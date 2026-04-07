# 02 - Source-to-Sink Analysis

## CSPT Sources in Vue Router v4

### Primary Sources (DECODED -- exploitable)

| Source | API | Decoded? | Notes |
|--------|-----|----------|-------|
| `route.params.X` | Composition API | YES | `decodeURIComponent()` applied |
| `$route.params.X` | Options API | YES | Same underlying object |
| `useRoute().params.X` | Composition API | YES | Same underlying object |
| `route.query.X` | Composition/Options | YES | Decoded by `parseQuery()` |
| `route.hash` | Composition/Options | YES | `decode()` applied (line 1206) |

### Secondary Sources (ENCODED -- safer but still exploitable)

| Source | API | Decoded? | Notes |
|--------|-----|----------|-------|
| `route.path` | Vue Router | NO | Encoded path preserved |
| `route.fullPath` | Vue Router | NO | Encoded path + query + hash |
| `window.location.pathname` | Browser | NO | Raw browser URL |
| `window.location.href` | Browser | NO | Full browser URL |
| `window.location.search` | Browser | NO | Raw query string |

### Source Ranking by Exploitability

1. **route.params** -- Most common, always decoded, direct to sinks
2. **route.query** -- Decoded, used for config/filter params
3. **route.hash** -- Decoded, less commonly used in fetch URLs
4. **window.location.pathname** -- Encoded, but can contain `../` if not percent-encoded

## CSPT Sinks

### Direct Sinks

| Sink | Risk | Pattern |
|------|------|---------|
| `fetch()` | HIGH | `fetch(\`/api/${route.params.x}\`)` |
| `axios.get()` | HIGH | `axios.get(\`/api/${route.params.x}\`)` |
| `XMLHttpRequest` | HIGH | `xhr.open('GET', '/api/' + param)` |
| `v-html` | CRITICAL | `<div v-html="fetchedData">` (XSS) |
| `router.push()` | MEDIUM | `router.push(route.query.redirect)` (open redirect) |
| `router.replace()` | MEDIUM | Same as push |
| `window.location` | MEDIUM | Assignment from decoded param |

### Indirect Sinks (via data flow)

| Pattern | Risk | Description |
|---------|------|-------------|
| API service layer | HIGH | `apiService.get(\`/path/${param}\`)` -- hides the sink |
| TanStack Vue Query | HIGH | `queryFn` uses params in fetch URL |
| Pinia store actions | HIGH | Store dispatches fetch with param |
| Computed properties | MEDIUM | Param flows through computed -> fetch |

## Complete Data Flow Chains

### Chain 1: Basic CSPT (UserPage pattern)
```
URL: /users/..%2F..%2Fadmin
  -> Vue Router matcher extracts "..%2F..%2Fadmin"
  -> decode() applies decodeURIComponent
  -> route.params.userId = "../../admin"
  -> Template literal: `/api/users/${route.params.userId}`
  -> Resolved: "/api/users/../../admin"
  -> fetch() browser normalization: GET /admin
```

### Chain 2: Multi-param CSPT (ProductPage pattern)
```
URL: /shop/..%2F..%2Fadmin/anything
  -> route.params.category = "../../admin"
  -> route.params.productId = "anything"
  -> Concatenation: "/api/shop/" + "../../admin" + "/products/" + "anything"
  -> Resolved: "/api/shop/../../admin/products/anything"
  -> fetch() normalization: GET /admin/products/anything
```

### Chain 3: Catch-all + join (FilesPage pattern)
```
URL: /files/..%2F..%2Fadmin
  -> pathMatch regex captures "..%2F..%2Fadmin"
  -> decode() -> "../../admin"
  -> key.repeatable splits on "/" -> ["../../admin"] (no literal / to split)
  -> .join('/') -> "../../admin"
  -> fetch(`/api/files/${fullPath}`) -> GET /admin

URL: /files/a/b/../../admin
  -> pathMatch captures "a/b/../../admin"
  -> Split on / -> ["a", "b", "..", "..", "admin"]
  -> .join('/') -> "a/b/../../admin"
  -> fetch normalizes: GET /api/files/admin
  Note: This second case uses literal ../ which the browser already resolved
```

### Chain 4: CSPT + v-html = XSS (DashboardStats pattern)
```
URL: /dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious-uuid
  -> route.query.widget = "../../attachments/malicious-uuid"
  -> fetch(`/api/widgets/${widget}`)
  -> fetch normalizes: GET /attachments/malicious-uuid
  -> Response: {"body": "<img src=x onerror=alert(document.domain)>"}
  -> v-html renders response body as HTML
  -> XSS executes
```

### Chain 5: Open Redirect (DashboardIndex pattern)
```
URL: /dashboard?redirect=//evil.com
  -> route.query.redirect = "//evil.com"
  -> router.push("//evil.com")
  -> Vue Router warns about "//" but still processes
  -> Navigates to protocol-relative URL
```

### Chain 6: Service Layer Abstraction (DashboardSettings pattern)
```
URL: /dashboard/settings?id=..%2F..%2Fadmin%2Fusers
  -> route.query.id = "../../admin/users"
  -> apiService.get(`/settings/${id}`)
  -> fetch("/settings/../../admin/users")
  -> GET /admin/users
```

### Chain 7: TanStack Vue Query (ItemPage pattern)
```
URL: /items/123  (constrained to \d+)
  -> route.params.itemId = "123" (passes regex)
  -> useQuery queryFn: fetch(`/api/items/123`)

Note: Regex constraint blocks CSPT here. But if constraint is
relaxed (e.g., `:itemId` without `(\d+)`), the pattern is exploitable.
TanStack Query adds caching, so a single traversal poisons the cache.
```

### Chain 8: Axios with multiple params (MemberPage pattern)
```
URL: /teams/..%2F..%2Fadmin/members/1
  -> route.params.teamId = "../../admin"
  -> route.params.memberId = "1"
  -> axios.get(`/api/teams/${teamId}/members/${memberId}`)
  -> axios normalizes: GET /admin/members/1
```

## Minified Source-to-Sink Detection

In production bundles, look for these patterns:

```javascript
// Template literal with params (survives minification)
`/api/users/${o.params.userId}`
`/api/widgets/${s}`

// String concat with params
"/api/shop/"+e.params.category+"/products/"+e.params.productId

// v-html directive (survives as innerHTML assignment)
{innerHTML:o.value,class:"widget-container"}

// fetch call with dynamic URL
fetch(t)  // where t was constructed from params

// router.push with query
i.push(a)  // where a came from route.query
```

## Defense Patterns

| Defense | Effectiveness | Notes |
|---------|---------------|-------|
| Regex constraint (`:id(\d+)`) | Strong | Blocks `..` in param matching |
| Server-side validation | Strong | Validate param format server-side |
| `route.path` instead of `route.params` | Partial | Stays encoded, but `..` doesn't need encoding |
| URL allowlist | Strong | Only permit known API paths |
| CSP | Partial | Blocks inline scripts from v-html, not fetch |
