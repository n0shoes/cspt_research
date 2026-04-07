# 03 - Encoding Behavior

## The Complete Decoding Pipeline

### Stage 1: Browser Sends Request

The browser sends the URL with percent-encoding preserved. For example:
- User navigates to `/users/..%2F..%2Fadmin`
- Browser sends: `GET /users/..%2F..%2Fadmin HTTP/1.1`

### Stage 2: Next.js Server Receives Request

The Node.js HTTP server receives the raw URL. The URL is parsed by Node's `url.parse()` or `new URL()`.

### Stage 3: Route Matching (Server-Side)

**File:** `next/dist/shared/lib/router/utils/route-matcher.js:13-43`

The server matches the request URL against route regexes from `route-regex.js`.

**For single `[param]`:**
- Regex: `([^/]+?)`
- Input: `..%2F..%2Fadmin`
- The regex runs BEFORE decode. If `%2F` is present, the regex matches because `%2F` does NOT contain a literal `/` at this point.
- Wait -- actually Node.js may decode the URL pathname first. Let's trace more carefully.

**The actual flow depends on where the regex is applied:**

1. Node receives raw URL: `/users/..%2F..%2Fadmin`
2. Node's `url.parse()` typically does NOT decode the pathname
3. Next.js server matcher applies regex to the pathname
4. For `[userId]` route: regex `^/users/([^/]+?)(?:/)?$` matches `..%2F..%2Fadmin` as a single segment
5. Then `decodeURIComponent('..%2F..%2Fadmin')` = `../../admin`
6. This decoded value is what `useParams()` and `await params` receive

**Correction on Route Matching:**

Actually, testing with Node.js shows that `%2F` in the URL path is NOT decoded before regex matching. The regex `([^/]+?)` matches `..%2F..%2Fadmin` because `%2F` is not a literal `/`. Then the decode step produces `../../admin`.

This means **single `[param]` routes ARE vulnerable to CSPT** when the server doesn't normalize the URL before matching.

### Stage 4: Parameter Decoding

**File:** `next/dist/shared/lib/router/utils/route-matcher.js:17-27`

```javascript
const decode = (param) => {
    try {
        return decodeURIComponent(param);  // Line 19
    } catch {
        throw new DecodeError('failed to decode param');
    }
};
```

For catch-all `[...param]`:
```javascript
if (group.repeat) {
    params[key] = match.split('/').map((entry) => decode(entry));  // Line 33
}
```

**Critical distinction:**
- Single `[param]`: `decodeURIComponent(match)` -- full match decoded as one string
- Catch-all `[...param]`: `match.split('/').map(decode)` -- split on `/` first, then decode each piece

### Stage 5: FlightRouterState Construction (Server-Side)

**File:** `next/dist/shared/lib/router/utils/get-dynamic-param.js:48-61`

```javascript
function getParamValue(interpolatedParams, segmentKey, fallbackRouteParams) {
    let value = interpolatedParams[segmentKey];
    if (fallbackRouteParams?.has(segmentKey)) {
        const [searchValue] = fallbackRouteParams.get(segmentKey);
        value = searchValue;
    } else if (Array.isArray(value)) {
        value = value.map((i) => encodeURIComponent(i));  // RE-ENCODE arrays
    } else if (typeof value === 'string') {
        value = encodeURIComponent(value);                 // RE-ENCODE strings
    }
    return value;
}
```

**Key finding:** The server RE-ENCODES params when building the FlightRouterState tree segment. This means:
1. Server decodes `%2F` to `/` (route-matcher.js:19)
2. Server re-encodes `/` to `%2F` (get-dynamic-param.js:58)
3. Tree segment value is the re-encoded form

### Stage 6: Client-Side Tree Segment Reading

**File:** `next/dist/client/components/router-reducer/compute-changed-path.js:103-120`

```javascript
function getSelectedParams(currentTree, params = {}) {
    // ...
    const isCatchAll = isDynamicParameter && (segment[2] === 'c' || segment[2] === 'oc');
    if (isCatchAll) {
        params[segment[0]] = segment[1].split('/');  // Split re-encoded value on '/'
    } else if (isDynamicParameter) {
        params[segment[0]] = segment[1];  // Return re-encoded value as-is
    }
}
```

**For single params:** `useParams()` returns the value from `segment[1]` which is the RE-ENCODED value from the server.

So `useParams().userId` for URL `/users/..%2F..%2Fadmin` would be `..%2F..%2Fadmin` (the re-encoded form).

Wait -- let's re-examine. The server encodes `../../admin` (after initial decode) back to `..%2F..%2Fadmin`. But `getSelectedParams` returns `segment[1]` directly. So `useParams()` returns the **re-encoded** value.

This means `useParams()` returns **encoded** values in the App Router, unlike React Router which returns decoded values.

### Revised Understanding: The Double Encode/Decode Cycle

1. URL: `/users/..%2F..%2Fadmin`
2. Server route-matcher decodes: `../../admin`
3. Server `getParamValue` re-encodes: `..%2F..%2Fadmin`
4. FlightRouterState tree segment: `["userId", "..%2F..%2Fadmin", "d"]`
5. Client `getSelectedParams` returns: `..%2F..%2Fadmin`
6. `useParams().userId` = `..%2F..%2Fadmin` (encoded!)

**This means Next.js App Router is SAFER than React Router for single params** -- the re-encoding step neutralizes traversal.

But wait -- when the param is used in a `fetch()`:
```javascript
fetch(`/api/users/${userId}`)
// = fetch('/api/users/..%2F..%2Fadmin')
```

The browser's fetch API will send this as: `GET /api/users/..%2F..%2Fadmin` -- which the API server may or may not decode. If the API server decodes the path, traversal occurs server-side.

### For Catch-All Routes

1. URL: `/files/..%2Fetc/passwd`
2. Server route-matcher: regex `(.+?)` matches `..%2Fetc/passwd`
3. Split on `/`: `["..%2Fetc", "passwd"]`
4. Decode each: `["../etc", "passwd"]`
5. Re-encode each: `["..%2Fetc", "passwd"]`
6. Join for tree segment: `"..%2Fetc/passwd"`
7. Client `getSelectedParams` splits on `/`: `["..%2Fetc", "passwd"]`
8. `useParams().path` = `["..%2Fetc", "passwd"]`
9. `path.join('/')` = `"..%2Fetc/passwd"`

The re-encoding preserves the encoding, so `join('/')` produces an encoded path.

### For Server Components with `await params`

**CORRECTION (Confirmed via lab testing on Next.js 15.5.12):**

Server page/layout components go through the SAME re-encoding pipeline as client components via `getParamValue()` in `get-dynamic-param.js:48-61`. They do NOT receive decoded values directly.

**Lab proof:** `http://localhost:3000/files/thepath%2fbooya` (catch-all server component)
- `params.path`: `["thepath%2Fbooya"]` — **RE-ENCODED, not decoded**
- `path.join('/')`: `thepath%2Fbooya` — still encoded

The flow for page server components:
1. URL: `/data/..%2F..%2Finternal`
2. Server route-matcher decodes: `../../internal`
3. Server `getParamValue` re-encodes: `..%2F..%2Finternal`
4. Server Component receives: `{ dataId: "..%2F..%2Finternal" }` -- **RE-ENCODED**
5. `fetch(\`http://localhost:3000/api/data/${dataId}\`)` sends `GET /api/data/..%2F..%2Finternal`
6. The API route handler THEN decodes it to `../../internal` — traversal happens here

**Page server components are NOT more vulnerable than client components — they get the same re-encoded values.**

### Encoding Differential: Page Components vs Route Handlers

**This is the critical finding.** There is an encoding DIFFERENTIAL between the two server-side contexts:

- **Page/Layout server components** (`await params`): Re-encoded via `getParamValue()` — `%2F` stays as `%2F`
- **Route handlers** (`await params`): Decoded directly from `getRouteMatcher()` — `%2F` becomes `/`

Route handlers do NOT go through the `getParamValue` re-encoding pipeline. They receive params directly from the route matcher's `decodeURIComponent()` call.

**Lab proof:** Same URL `thepath%2fbooya` hitting the same catch-all pattern:
- Page component `await params`: `["thepath%2Fbooya"]` (re-encoded)
- API route handler `await params`: `["thepath/booya"]` (decoded)

**The SSRF chain still works** but only through the fetch-to-API indirection:
1. Page component gets re-encoded params → makes fetch to API route
2. API route handler re-matches the URL → decodes params → SSRF

For direct page component → external service fetches, the re-encoded URL is sent, and the external service would need to handle `%2F` in the path. Many servers treat `%2F` and literal `/` differently, making this vector less reliable.

---

## Summary of Encoding by Source

| Source | Encoding State | CSPT Risk |
|--------|---------------|-----------|
| `useParams()` [single] | Re-encoded by server | Low -- `%2F` stays encoded |
| `useParams()` [catch-all] | Re-encoded array | Low -- each element stays encoded |
| `await params` in pages [single] | **Re-encoded** | **Low** -- same as `useParams()` |
| `await params` in pages [catch-all] | **Re-encoded** array | **Low** -- same as `useParams()` |
| `await params` in route handlers [single] | **DECODED** | **High** -- `%2F` becomes `/` |
| `await params` in route handlers [catch-all] | **DECODED** array | **High** -- elements are decoded |
| `useSearchParams()` | Browser-decoded (standard) | Medium -- single decode |
| `usePathname()` | Preserves URL encoding | Low |
| `window.location.hash` | Raw browser value | High -- no processing |

## Critical Finding: Encoding Differential Between Server Contexts

Next.js has a **fundamental encoding differential** — not between client and server, but between two server-side contexts:

- **Client Components** (`useParams()`) receive **re-encoded** values -- safe
- **Page/Layout Server Components** (`await params`) receive **re-encoded** values -- also safe (same pipeline as client)
- **Route Handlers** (`await params`) receive **DECODED** values -- vulnerable to SSRF

This was confirmed via lab testing on Next.js 15.5.12. The re-encoding in `getParamValue()` applies to page/layout rendering but NOT to route handlers.

**Route Handlers are the primary CSPT/SSRF attack surface in Next.js apps.** Page server components are only vulnerable via indirection: their re-encoded params flow into a `fetch()` to a route handler, which then decodes them.

## Empirical Browser Test Results (Next.js 15.5.12, Chrome)

**These results CORRECTED the original source-code analysis — page server components get re-encoded values, not decoded.**

### Single `[param]` — Client Component (`useParams()`)

| URL | `useParams().testParam` | `usePathname()` | Exploitable? |
|-----|------------------------|-----------------|-------------|
| `/encoding-test/hello` | `hello` | `/encoding-test/hello` | Baseline |
| `/encoding-test/..%2Fapi%2Fadmin` | `..%2Fapi%2Fadmin` | `/encoding-test/..%2Fapi%2Fadmin` | **NO — re-encoded** |
| `/encoding-test/hello%2Fworld` | `hello%2Fworld` | preserves `%2F` | **NO — re-encoded** |

### Catch-all `[...segments]` — Server Component

| URL | `params.segments` (array) | `segments.join('/')` |
|-----|--------------------------|---------------------|
| `/encoding-catchall/%2E%2E%2Fapi%2Fadmin` | `["..%2Fapi%2Fadmin"]` | `..%2Fapi%2Fadmin` |
| `/encoding-catchall/%252e%252e/%252e%252e/admin` | `["%252e%252e", "%252e%252e", "admin"]` | `%252e%252e/%252e%252e/admin` |

**Key correction:** Both client `useParams()` AND page server component `await params` return re-encoded values. Only route handler `await params` returns decoded values. The SSRF vector works via route handlers directly, or via page-to-route-handler fetch indirection.

## How `%2F` Behaves Per Route Type

### Single `[param]` route: `/users/test%2Fpath`
- Server regex `([^/]+?)` matches `test%2Fpath` (not decoded yet)
- Server decodes to `test/path`
- Server re-encodes to `test%2Fpath`
- Client `useParams().userId` = `test%2Fpath` (encoded)
- Page Server Component `params.userId` = `test%2Fpath` (re-encoded, same as client!)
- Route Handler `params.userId` = `test/path` (**DECODED** -- different from page!)

### Catch-all `[...path]` route: `/files/a%2Fb/c`
- Server regex `(.+?)` matches `a%2Fb/c`
- Split on `/`: `["a%2Fb", "c"]`
- Decode each: `["a/b", "c"]`
- Re-encode each: `["a%2Fb", "c"]`
- Client `useParams().path` = `["a%2Fb", "c"]` (encoded array)
- Page Server Component `params.path` = `["a%2Fb", "c"]` (re-encoded, same as client!)
- Route Handler `params.path` = `["a/b", "c"]` (**DECODED** array -- different from page!)

### Double-Encoded: `/users/test%252Fpath`
- Server regex matches `test%252Fpath`
- Server decodes to `test%2Fpath`
- Server re-encodes to `test%252Fpath`
- Client `useParams().userId` = `test%252Fpath`
- Page Server Component `params.userId` = `test%252Fpath` (re-encoded)
- Route Handler `params.userId` = `test%2Fpath` (decoded once)
- If app does another `decodeURIComponent()`, gets `test/path` -- traversal!

### `..%2F..%2F` traversal: `/users/..%2F..%2Fadmin`
- Server regex matches `..%2F..%2Fadmin`
- Server decodes to `../../admin`
- Server re-encodes to `..%2F..%2Fadmin`
- Client `fetch(\`/api/users/${userId}\`)` sends: `/api/users/..%2F..%2Fadmin`
- Page Server Component `fetch(\`http://localhost/api/data/${dataId}\`)` sends: `/api/data/..%2F..%2Fadmin` -- re-encoded, traversal depends on receiving server
- Route Handler `fetch(\`http://localhost/api/data/${dataId}\`)` sends: `/api/data/../../admin` -- **DIRECT TRAVERSAL**

### Lab-Confirmed Catch-All: `/files/thepath%2fbooya`
- Page Server Component `await params`: `["thepath%2Fbooya"]` -- **re-encoded**
- Route Handler `await params`: `["thepath/booya"]` -- **decoded**
- This proves the encoding differential between page components and route handlers

## React Router vs Next.js: Why Next.js Is Dramatically Safer

React Router has a deliberate line in `matchPath()` (line 811) that ACTIVELY removes the `%2F` encoding defense:

```javascript
// React Router matchPath() line 811
memo[paramName] = (value || "").replace(/%2F/g, "/");
```

This means React Router:
1. `decodePath()` decodes `%2F` → `/`, then re-encodes back to `%2F` (defense)
2. `matchPath()` line 811 strips `%2F` → `/` (undoes the defense)
3. ALL params — `:param`, `*` splat, `loader({ params })` — get decoded `%2F`

Next.js does the opposite:
1. `getRouteMatcher()` decodes `%2F` → `/`
2. `getParamValue()` re-encodes `/` → `%2F` for page/layout rendering
3. Route handlers skip `getParamValue()` and get decoded values

### Sources That Decode `%2F` → `/`

| Source | React Router | Next.js |
|--------|:---:|:---:|
| `useParams()` single param | YES | NO (re-encoded) |
| `useParams()` splat/catch-all | YES | NO (re-encoded) |
| `loader({ params })` | YES | N/A |
| Page `await params` | N/A | NO (re-encoded) |
| Route handler `await params` | N/A | **YES** |
| `searchParams.get()` | YES | YES |
| `window.location.hash` | literal `../` | literal `../` |
| `useLocation().pathname` / `usePathname()` | NO | NO |
| Double-encoded `%252F` | YES (`%2F` → `/` via line 811) | NO on client, YES in route handlers |

**React Router attack surface:** Every path param in every component.
**Next.js attack surface:** Route handlers + searchParams + hash only.
