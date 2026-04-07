# 02 - Source to Sink Analysis

## CSPT Sources in Next.js

### Source 1: `useParams()` (Client Components)

**File:** `next/dist/client/components/navigation.js:145-156`

```javascript
function useParams() {
    useDynamicRouteParams?.('useParams()');
    const params = useContext(PathParamsContext);
    return params;
}
```

PathParamsContext is populated from `getSelectedParams()` in `compute-changed-path.js:103-120`:

```javascript
function getSelectedParams(currentTree, params = {}) {
    const parallelRoutes = currentTree[1];
    for (const parallelRoute of Object.values(parallelRoutes)) {
        const segment = parallelRoute[0];
        const isDynamicParameter = Array.isArray(segment);
        const segmentValue = isDynamicParameter ? segment[1] : segment;
        // Catch-all splits on '/'
        const isCatchAll = isDynamicParameter && (segment[2] === 'c' || segment[2] === 'oc');
        if (isCatchAll) {
            params[segment[0]] = segment[1].split('/');  // Array of decoded segments
        } else if (isDynamicParameter) {
            params[segment[0]] = segment[1];  // Single decoded string
        }
        params = getSelectedParams(parallelRoute, params);
    }
    return params;
}
```

**CSPT behavior:**
- Single `[param]`: Returns decoded string (e.g., `%2F` would become `/` IF the route matched, but `([^/]+?)` prevents `%2F` from matching since the server decodes it to `/` before matching)
- Catch-all `[...param]`: Returns array of decoded strings, split on `/`
- **Key insight**: The param value in the FlightRouterState tree segment is already decoded by the server-side route matcher

### Source 2: `await params` (Page/Layout Server Components, Next.js 15+)

**File:** `next/dist/shared/lib/router/utils/route-matcher.js:13-43` (initial decode)
**File:** `next/dist/shared/lib/router/utils/get-dynamic-param.js:48-61` (re-encode for pages)

```javascript
// Step 1: route-matcher.js decodes params
function getRouteMatcher({ re, groups }) {
    const rawMatcher = (pathname) => {
        const routeMatch = re.exec(pathname);
        if (!routeMatch) return false;
        const decode = (param) => {
            try {
                return decodeURIComponent(param);   // Line 19 - THE DECODE
            } catch {
                throw new DecodeError('failed to decode param');
            }
        };
        const params = {};
        for (const [key, group] of Object.entries(groups)) {
            const match = routeMatch[group.pos];
            if (match !== undefined) {
                if (group.repeat) {
                    params[key] = match.split('/').map(decode);  // catch-all: split THEN decode each
                } else {
                    params[key] = decode(match);  // single: just decode
                }
            }
        }
        return params;
    };
    return safeRouteMatcher(rawMatcher);
}

// Step 2: get-dynamic-param.js RE-ENCODES for page/layout components
function getParamValue(interpolatedParams, segmentKey, fallbackRouteParams) {
    let value = interpolatedParams[segmentKey];
    if (Array.isArray(value)) {
        value = value.map((i) => encodeURIComponent(i));  // RE-ENCODE arrays
    } else if (typeof value === 'string') {
        value = encodeURIComponent(value);                 // RE-ENCODE strings
    }
    return value;
}
```

**CORRECTION (lab-confirmed on Next.js 15.5.12):**
- Page/layout server components receive **re-encoded** values, NOT decoded values
- The `getParamValue()` re-encoding applies to page/layout rendering pipeline
- `await params` in a page component returns the same re-encoded values as `useParams()` on the client
- **Lab proof:** `/files/thepath%2fbooya` → page `params.path` = `["thepath%2Fbooya"]` (re-encoded)

### Source 2b: `await params` (Route Handlers, Next.js 15+)

Route handlers receive params directly from `getRouteMatcher()` WITHOUT the `getParamValue()` re-encoding step.

**CSPT behavior:**
- Route handler params ARE decoded with `decodeURIComponent`
- Catch-all: Split on `/` THEN decode each segment individually
- `%2F` in a catch-all creates a NEW array element, not a slash within a segment
- **Lab proof:** Same URL `/files/thepath%2fbooya` → route handler `params.path` = `["thepath/booya"]` (decoded)

**This encoding differential between page components and route handlers is the key finding.**

### Source 3: `useSearchParams()` (Client Components)

**File:** `next/dist/client/components/navigation.js:95-119`

```javascript
function useSearchParams() {
    const searchParams = useContext(SearchParamsContext);
    return new ReadonlyURLSearchParams(searchParams);
}
```

SearchParamsContext comes from `new URL(canonicalUrl).searchParams` in app-router.js:114-119.

**CSPT behavior:**
- `searchParams.get('key')` returns the standard `URLSearchParams.get()` result
- Standard browser behavior: single-decoded (`%252F` stays as `%2F`)

### Source 4: `usePathname()` (Client Components)

**File:** `next/dist/client/components/navigation.js:120-133`

```javascript
function usePathname() {
    const pathname = useContext(PathnameContext);
    return pathname;
}
```

PathnameContext comes from `new URL(canonicalUrl).pathname` in app-router.js:114-119.

**CSPT behavior:**
- Returns the pathname as-is from the URL object
- **PRESERVES encoding** -- `%2F` stays as `%2F` in the pathname
- Generally SAFE for CSPT because encoding is preserved

### Source 5: `window.location.hash` (Client Components)

Not a Next.js API but commonly used in Next.js apps (as in our Settings page).

**CSPT behavior:**
- Never decoded by Next.js
- Browser provides raw hash value
- `#../../admin` is available as-is
- Particularly dangerous because there are NO server-side protections

### Source 6: Route Handler params (Server-Side)

**File:** Route handlers receive params through the same `getRouteMatcher` pipeline.

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  // path is already decoded array
}
```

**CSPT/SSRF behavior:**
- Decoded by the same `decodeURIComponent` in route-matcher.js
- Catch-all gives array of decoded segments
- `path.join('/')` reconstitutes traversal sequences
- Server-side fetch with these params = SSRF potential

---

## CSPT Sinks in Next.js

### Sink 1: `fetch()` with Template Literal

```javascript
// Source: useParams()
const { userId } = useParams();
fetch(`/api/users/${userId}`)

// Minified form:
let{userId:e}=(0,r.useParams)();
fetch(`/api/users/${e}`)
```

**Risk:** If `userId` contains decoded traversal chars, the fetch URL is manipulated.

**Note for Next.js:** Unlike React Router, `useParams()` in Next.js gets its values from the server-rendered FlightRouterState. The server-side route matcher already decoded `%2F` to `/`, but the `([^/]+?)` regex for single params prevents `%2F` from matching in the first place. So for single `[param]` routes, CSPT via `%2F` results in 404.

### Sink 2: `fetch()` with String Concatenation

```javascript
// Source: useParams()
const { category, productId } = useParams();
fetch("/api/shop/" + category + "/products/" + productId)

// Minified form:
fetch("/api/shop/"+e+"/products/"+c)
```

Same constraints as Sink 1 for single params.

### Sink 3: `fetch()` with Catch-All `join('/')`

```javascript
// Source: Page Server Component await params (RE-ENCODED)
const { path } = await params;
const fullPath = path.join('/');
fetch(`http://localhost:3000/api/files/${fullPath}`)
```

**Risk: MEDIUM (not HIGH as previously stated).** Lab testing confirmed that page server components receive re-encoded params, not decoded params. So `path.join('/')` produces a re-encoded string like `thepath%2Fbooya`, and the fetch sends the `%2F` encoded.

**However, the SSRF chain still works via indirection:** When the fetch hits an API route handler, the route handler decodes `%2F` → `/`, creating the traversal at the handler level.

```javascript
// Source: Route Handler await params (DECODED — this is the real danger)
const { path } = await params;
const fullPath = path.join('/');
fetch(`https://backend.internal/${fullPath}`)
```

**Risk: HIGH for route handlers.** Route handlers get decoded params directly. `join('/')` reconstitutes traversal: `["..","..","etc","passwd"]` → `"../../etc/passwd"`.

### Sink 4: `dangerouslySetInnerHTML` with Fetch Response

```javascript
// Source: useSearchParams()
const report = searchParams.get('report');
fetch(`/api/reports/${report}`)
  .then(res => res.text())
  .then(data => setHtml(data));
// ...
<div dangerouslySetInnerHTML={{ __html: html }} />
```

**Risk: CRITICAL.** This is CSPT + XSS. If the fetch can be redirected to a controlled endpoint (via CSPT in the path or an uploaded file), the response HTML is injected into the DOM.

### Sink 5: API Service Layer Pattern

```javascript
const apiService = {
  baseUrl: '/api/v2',
  getSettings(section) {
    return fetch(`${this.baseUrl}/settings/${section}`).then(r => r.json());
  }
};
// Source: window.location.hash
const section = window.location.hash.slice(1);
apiService.getSettings(section);
```

**Risk: HIGH.** The service layer obscures the CSPT chain but the vulnerability is the same. Hash-based sources bypass all server-side protections.

### Sink 6: Server-Side Fetch (SSRF)

```javascript
// Route handler — DECODED params, direct SSRF
const { path } = await params;
fetch(`https://backend.internal/${path.join('/')}`)
```

**Risk: HIGH for SSRF.** Route handlers receive DECODED params (unlike page components which get re-encoded values). They execute on the server with server credentials and network access. Catch-all params joined into internal URLs can reach internal services.

```javascript
// Page server component — RE-ENCODED params, indirect SSRF
const { path } = await params;
fetch(`http://localhost:3000/api/files/${path.join('/')}`)
// Sends re-encoded URL → API route handler decodes → SSRF via indirection
```

**Risk: MEDIUM for page components.** The re-encoding means direct external fetches send `%2F` encoded. SSRF only works if the fetch target is another route handler that decodes the params again.

---

## Source-to-Sink Chains Summary

| Source | Sink | Exploitable? | Notes |
|--------|------|-------------|-------|
| `useParams()` [single] | `fetch` template | **Low** | `([^/]+?)` regex blocks `%2F` (404) |
| `useParams()` [catch-all] | `fetch` with `join('/')` | **Medium** | Segments are individual, traversal requires literal `..` segments in URL |
| `useSearchParams()` | `fetch` template | **Medium** | Single-decoded, `%252F` stays `%2F` |
| `useSearchParams()` | `fetch` + `dangerouslySetInnerHTML` | **Critical** | Full CSPT-to-XSS if redirect to controlled response |
| `usePathname()` | `fetch` template | **Low** | Preserves encoding, rarely used for API calls |
| `window.location.hash` | `fetch` via service | **High** | No server-side protection, fully attacker-controlled |
| Page `await params` [catch-all] | Server `fetch` to API route | **Medium** | Re-encoded params; SSRF only via API route handler indirection |
| Page `await params` [catch-all] | Server `fetch` to external | **Low** | Re-encoded `%2F` sent; depends on external server decode behavior |
| Route handler `await params` | Server `fetch` | **High** | DECODED params, direct SSRF, server credentials |

## Minified Chain Patterns

### Pattern 1: useParams() to fetch (single param)
```javascript
// Unminified
const { userId } = useParams();
fetch(`/api/users/${userId}`)

// Minified (Turbopack)
let{userId:e}=(0,r.useParams)();
fetch(`/api/users/${e}`)
```

### Pattern 2: useParams() to fetch (multi-param concatenation)
```javascript
// Minified
let{category:e,productId:c}=(0,r.useParams)();
fetch("/api/shop/"+e+"/products/"+c)
```

### Pattern 3: useSearchParams() to fetch + innerHTML
```javascript
// Minified
let e=(0,t.useSearchParams)().get("report")||"default";
fetch(`/api/reports/${e}`)
// ... later:
dangerouslySetInnerHTML:{__html:n}
```

### Pattern 4: Hash to service layer
```javascript
// Minified
let e=window.location.hash.slice(1);
i.getSettings(e)  // i = apiService object
// where i contains: fetch(`${this.baseUrl}/settings/${e}`)
```
