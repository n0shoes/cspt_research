# 03 - Encoding Behavior

## The Critical Finding: No `decodeURIComponent` on Route Params

Unlike React Router (which calls `decodeURIComponent` via `safelyDecodeURIComponent` on every path segment and param), `@solidjs/router` does **NOT** decode URL segments before storing them as params.

### Proof: `createMatcher()` in `utils.js:50-89`

```javascript
export function createMatcher(path, partial, matchFilters) {
  const [pattern, splat] = path.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  const len = segments.length;

  return (location) => {
    const locSegments = location.split("/").filter(Boolean);
    // ...
    for (let i = 0; i < len; i++) {
      const segment = segments[i];
      const dynamic = segment[0] === ":";
      const locSegment = dynamic ? locSegments[i] : locSegments[i].toLowerCase();
      const key = dynamic ? segment.slice(1) : segment.toLowerCase();

      if (dynamic && matchSegment(locSegment, matchFilter(key))) {
        match.params[key] = locSegment;  // <-- RAW segment, NO decoding
      }
      // ...
    }

    if (splat) {
      const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
      if (matchSegment(remainder, matchFilter(splat))) {
        match.params[splat] = remainder;  // <-- RAW segments joined, NO decoding
      }
    }
    return match;
  };
}
```

The `locSegments` come from `location.split("/")` where `location` is `location.pathname` -- which is already percent-encoded by the browser.

### Where `location.pathname` Comes From

`Router.js:10`:
```javascript
const url = window.location.pathname.replace(/^\/+/, "/") + window.location.search;
```

`window.location.pathname` is the browser's encoded pathname. For URL `/users/hello%2fworld`:
- `window.location.pathname` = `/users/hello%2fworld`
- After split on `/`: `["users", "hello%2fworld"]`
- `params.userId` = `"hello%2fworld"` (still encoded)

### Only Two `decodeURI`/`decodeURIComponent` Calls in Entire Router

1. **`components.jsx:22`** -- Active link matching in `<A>` component:
   ```javascript
   const loc = decodeURI(normalizePath(location.pathname).toLowerCase());
   ```
   This is ONLY for CSS class toggling (active/inactive links). Not in the routing pipeline.

2. **`Router.js:27`** -- Scroll to hash:
   ```javascript
   scrollToHash(decodeURIComponent(window.location.hash.slice(1)), scroll);
   ```
   Only for hash-based scrolling. Not in the routing pipeline.

## Empirical Browser Test Results (SolidStart + @solidjs/router, Chrome)

**These results CONFIRM the source-code analysis above.**

| URL | `useParams().testParam` | `fetch URL constructed` | Exploitable? |
|-----|------------------------|------------------------|-------------|
| `/encoding-test/hello` | `hello` | `/api/test/hello` | Baseline |
| `/encoding-test/hello%2Fworld` | `hello%2Fworld` | `/api/test/hello%2Fworld` | **NO — stays encoded** |
| `/encoding-test/%2E%2E%2Fapi%2Fadmin` | `..%2Fapi%2Fadmin` | `/api/test/..%2Fapi%2Fadmin` | **NO — dots decode but slashes don't** |

**SolidStart is the MOST SECURE client-side framework for CSPT.** The router never calls `decodeURIComponent` on params. The only CSPT vectors are:
1. **Search params** — `URLSearchParams` auto-decodes per spec
2. **Server functions** — params pass via JSON RPC, decoded on arrival
3. **Developer mistake** — explicit `decodeURIComponent(params.id)` in component code

## Decoding Pipeline Summary

### Client-Side Navigation Flow

```
Browser URL: /users/hello%2fworld
  |
  v
window.location.pathname = "/users/hello%2fworld"  [encoded]
  |
  v
Router.getSource() reads pathname + search + hash   [encoded]
  |
  v
createLocation() wraps in reactive signals           [encoded]
  |
  v
location.pathname = "/users/hello%2fworld"          [encoded]
  |
  v
createMatcher() splits on "/" and matches segments   [encoded]
  |
  v
params.userId = "hello%2fworld"                      [STILL ENCODED]
  |
  v
Developer code: fetch(`/api/users/${params.userId}`)
  |
  v
fetch("/api/users/hello%2fworld")                    [STILL ENCODED]
  |
  v
Browser sends: GET /api/users/hello%2fworld          [Server sees encoded]
```

### Catch-All Route Flow

```
Browser URL: /files/a/b/../secret
  |
  v
window.location.pathname = "/files/a/b/../secret"   [browser normalizes .. in path]
  |
  v
ACTUALLY: browser resolves .. before setting pathname
  window.location.pathname = "/files/a/secret"       [normalized by browser]
  |
  v
Router splits: ["files", "a", "secret"]
  |
  v
params.path = "a/secret"                             [joined, NO traversal]
```

**Key insight:** The browser itself resolves `..` in the URL bar before JavaScript can access it. Navigating to `/files/a/b/../secret` results in `window.location.pathname = "/files/a/secret"`.

### Encoded Traversal Flow

```
Browser URL: /files/..%2f..%2fadmin%2fsecrets
  |
  v
window.location.pathname = "/files/..%2f..%2fadmin%2fsecrets"  [%2f stays encoded]
  |
  v
Router splits on "/": ["files", "..%2f..%2fadmin%2fsecrets"]
  |
  v
Catch-all: params.path = "..%2f..%2fadmin%2fsecrets"  [single segment, encoded]
  |
  v
fetch(`/api/files/..%2f..%2fadmin%2fsecrets`)          [stays encoded]
  |
  v
Server receives: /api/files/..%2f..%2fadmin%2fsecrets  [no traversal]
```

**Without decoding, `%2f` never becomes `/`** in the fetch URL construction. The router does NOT create the traversal opportunity that React Router's `decodeURIComponent` does.

### Search Params Flow (DIFFERENT -- Auto-Decoded)

```
Browser URL: /dashboard/stats?source=..%2f..%2fadmin
  |
  v
URLSearchParams.get("source") = "../../admin"          [AUTO-DECODED by browser API]
  |
  v
searchParams.source = "../../admin"                     [decoded!]
  |
  v
fetch(`/api/stats?source=../../admin`)                  [traversal in query string]
```

`URLSearchParams` automatically decodes percent-encoded values. This is a significant CSPT vector.

## Comparison with React Router

| Aspect | React Router | @solidjs/router |
|--------|-------------|-----------------|
| `decodeURIComponent` on params | YES (`safelyDecodeURIComponent`) | **NO** |
| `%2f` in params | Decoded to `/` | Stays as `%2f` |
| `%2e%2e` in params | Decoded to `..` | Stays as `%2e%2e` |
| Catch-all format | Array of decoded segments | Single string, NOT decoded |
| Search params | Auto-decoded | Auto-decoded (same) |
| `location.pathname` | Not decoded | Not decoded (same) |
| CSPT via encoded traversal | **HIGH** (decoding enables it) | **LOW** (no decoding blocks it) |
| CSPT via catch-all | HIGH (decoded segments) | **MEDIUM** (raw but joined) |
| CSPT via search params | HIGH | **HIGH** (same behavior) |

## Reactivity Implications

Solid's fine-grained reactivity means:

1. **`createResource` re-fetches on param change.** When navigating client-side, the reactive param signal updates, and any `createResource` tracking it fires a new fetch immediately.

2. **No component remount needed.** Unlike React where components may remount on route changes, Solid's reactive system updates only the specific signals. This means a CSPT payload fires without DOM recreation.

3. **`createAsync` wraps `createResource`.** The newer `createAsync` API (`data/createAsync.js`) internally uses `createResource` with the same reactive behavior.

## Server Function Encoding Boundary

When `query()` with `"use server"` is called:

### Client Side (build output):
```javascript
// Serialized via seroval, sent as POST body
body: await Ie(args)  // Ie = seroval serialize
headers: { "X-Server-Id": encodeURIComponent(functionId) }
```

### Server Side (`server-handler.js:24`):
```javascript
[functionId, name] = decodeURIComponent(serverReference).split("#");
// ...
if (contentType?.startsWith('application/json')) {
  parsed = await tmpReq.json();
}
// OR via seroval:
parsed = await deserializeFromJSONString(await tmpReq.text());
```

The function arguments (including the traversal payload) are serialized as JSON/seroval, not URL-encoded. The deserialized value on the server is the exact string from the client. `"../../admin"` -> serialized -> deserialized -> `"../../admin"`.

## Practical Attack Scenarios

### Scenario 1: Catch-All + Server-Side SSRF
Most viable because catch-all captures real `/` from URL path:
```
/files/../../internal-api/admin
-> params.path = "../../internal-api/admin"  (real slashes from URL path)
-> Server function: fetch(`http://backend/${params.path}`)
-> SSRF to http://backend/../../internal-api/admin -> http://internal-api/admin
```

### Scenario 2: Search Params + innerHTML XSS
Search params are auto-decoded, enabling traversal in query strings:
```
/dashboard/stats?source=../../uploads/evil.json
-> searchParams.source = "../../uploads/evil.json"
-> fetch("/api/stats?source=../../uploads/evil.json")
-> Response: {"html": "<img src=x onerror=alert(1)>"}
-> innerHTML renders: XSS
```

### Scenario 3: Direct Navigation Payload
Using SolidStart's client-side navigation:
```javascript
// Attacker controls a link or navigate() call
navigate("/files/" + encodeURIComponent("../../admin"))
// This navigates to /files/%2e%2e%2fadmin
// params.path = "%2e%2e%2fadmin" (NOT decoded -- blocked)

// BUT:
navigate("/files/../../admin")
// Browser resolves to /admin (browser normalization -- also blocked)
```

**The most viable vectors are search params and catch-all routes with real `/` in paths.**
