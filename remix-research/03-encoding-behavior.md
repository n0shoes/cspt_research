# 3. Encoding Behavior (Remix / React Router v7 Framework Mode)

## Shared Pipeline

Remix/React Router v7 framework mode uses the **identical** client-side routing pipeline documented in [`react-research/03-encoding-behavior.md`](../react-research/03-encoding-behavior.md):

```
Browser URL
    |
    v
decodePath() -- per-segment decodeURIComponent(), re-encodes / back to %2F
    |
    v
compilePath() -- builds regex, :param = [^\\/]+, * = (.*)
    |
    v
matchPath() -- LINE 747: .replace(/%2F/g, "/")  <-- UNDOES the re-encoding
    |
    v
params object (fully decoded, %2F = /)
```

**All encoding test results from the React Router research apply here.** This includes:
- `%2F` --> `/` in useParams (the CSPT primitive)
- Double-decode: `%252F` --> `%2F` --> `/`
- Null bytes pass through
- Overlong UTF-8 and Unicode homoglyphs do NOT work
- `useLocation().pathname` is safe (preserves encoding)

See `react-research/03-encoding-behavior.md` and `react-research/04-encoding-matrix.md` for the complete matrix.

## REMIX-SPECIFIC: Server-Side Param Encoding

### Loader Params: Same Decode, Different Execution Context

The critical Remix-specific finding is that **loader params go through the exact same decode pipeline**. When React Router matches a route for a server request, it runs:

1. `matchRoutesImpl()` calls `decodePath()` on the request pathname
2. `matchPath()` extracts params with the line 747 `%2F` --> `/` replacement
3. The decoded params object is passed to the loader function

```javascript
// Server-side: params.userId is DECODED
export async function loader({ params }: LoaderFunctionArgs) {
  // If URL is /users/%2E%2E%2Fapi%2Fadmin
  // params.userId = "../api/admin"  (DECODED)
  const res = await fetch(`http://internal-api.local/users/${params.userId}`);
  // Fetches: http://internal-api.local/users/../api/admin
  // Resolved: http://internal-api.local/api/admin  (SSRF!)
}
```

### Key Difference: Server vs Client Execution

| Aspect | Client-Side (useParams) | Server-Side (loader params) |
|--------|------------------------|---------------------------|
| Decode pipeline | decodePath + matchPath line 747 | **Same pipeline** |
| `%2F` --> `/` | YES | **YES** |
| Double-decode `%252F` | YES | **YES** |
| Execution context | Browser sandbox | **Node.js server** |
| Network access | Same-origin only | **Full server network** |
| Internal services | No | **YES (internal APIs, cloud metadata)** |
| Auth headers | Browser cookies | **Server env vars, service tokens** |
| Impact | Client CSPT | **SSRF with server privileges** |

### The `.data` Endpoint

React Router v7 framework mode uses a `.data` endpoint (replaces Remix v2's `_data` query param) for client-side data loading:

```
Client navigation: /users/123
  |
  v
Framework fetches: /users/123.data  (turbo-stream encoded)
  |
  v
Server runs loader({ params: { userId: "123" } })
  |
  v
Response encoded via turbo-stream, returned to client
```

The URL construction for the `.data` endpoint is handled by `singleFetchUrl()`:

```javascript
function singleFetchUrl(reqUrl, basename, trailingSlashAware, extension) {
  let url = new URL(reqUrl, window.location.origin);
  if (url.pathname === "/") {
    url.pathname = `_root.${extension}`;
  } else {
    url.pathname = `${url.pathname.replace(/\/$/, "")}.${extension}`;
  }
  return url;
}
```

- Extension is `"data"` for normal requests
- Route targeting via `?_routes=routeId1,routeId2` query param
- Response uses turbo-stream encoding (not plain JSON)
- `X-Remix-Response`, `X-Remix-Redirect`, `X-Remix-Revalidate` headers control behavior

### `.data` Endpoint CSPT Implications

The `.data` endpoint preserves the path structure:

```
/users/%2E%2E%2Fapi%2Fadmin.data
```

If a CDN or reverse proxy caches `.data` responses by URL, CSPT traversal payloads in the path could:
1. Cause the server to run a different loader (though React Router's server-side matching should prevent this)
2. Poison the CDN cache with unexpected response data
3. Bypass CDN path-based access controls

### Action Params for CSPT2CSRF

Actions receive the same decoded params:

```javascript
export async function action({ params, request }: ActionFunctionArgs) {
  // params.userId is DECODED (same pipeline)
  const formData = await request.formData();
  // Attacker controls both the path traversal AND the request body
  await fetch(`http://internal-api.local/users/${params.userId}/settings`, {
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(formData))
  });
}
```

Action submission to the `.data` endpoint:
```
POST /users/%2E%2E%2Fadmin.data
Content-Type: application/x-www-form-urlencoded

role=superadmin
```

### Fetcher Pattern Encoding

`useFetcher()` makes requests to the `.data` endpoint:

```javascript
const fetcher = useFetcher();
// fetcher.load("/users/%2E%2E%2Fapi%2Fadmin")
// --> GET /users/%2E%2E%2Fapi%2Fadmin.data
// Server decodes params, runs loader with decoded values
```

The fetcher uses the same `singleFetchUrl()` function, so encoding behavior is consistent.

### Server-Side `request.url` Handling

In loaders/actions, `request.url` contains the full URL as received by the server:

```javascript
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const section = url.searchParams.get("section");
  // searchParams.get() decodes once (URLSearchParams spec)
  // If ?section=%2E%2E%2Fadmin --> section = "../admin"
}
```

This is a secondary CSPT source: query parameters decoded by URLSearchParams flowing into server-side fetch URLs.
