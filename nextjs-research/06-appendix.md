# 06 - Appendix

## Source Code References

All line numbers reference Next.js 16.1.6 installed via npm.

### Route Matching Pipeline

| File | Lines | Function | Role |
|------|-------|----------|------|
| `next/dist/shared/lib/router/utils/route-regex.js` | 32-76 | `getParametrizedRoute()` | Converts route pattern to regex with groups |
| `next/dist/shared/lib/router/utils/route-regex.js` | 58 | (inline) | `[param]` → `/([^/]+?)`, `[...param]` → `/(.+?)` |
| `next/dist/shared/lib/router/utils/route-matcher.js` | 13-43 | `getRouteMatcher()` | Matches URL against regex, decodes params |
| `next/dist/shared/lib/router/utils/route-matcher.js` | 19 | `decode()` | `decodeURIComponent(param)` -- THE decode step |
| `next/dist/shared/lib/router/utils/route-matcher.js` | 33 | (inline) | Catch-all: `match.split('/').map(decode)` |
| `next/dist/shared/lib/router/utils/route-matcher.js` | 35 | (inline) | Single: `decode(match)` |
| `next/dist/shared/lib/router/utils/route-match-utils.js` | 104-111 | `safeRouteMatcher()` | Wraps matcher with parameter separator cleanup |

### FlightRouterState Construction

| File | Lines | Function | Role |
|------|-------|----------|------|
| `next/dist/shared/lib/router/utils/get-dynamic-param.js` | 48-61 | `getParamValue()` | Gets param value, RE-ENCODES with `encodeURIComponent` |
| `next/dist/shared/lib/router/utils/get-dynamic-param.js` | 56-58 | (inline) | Array: `value.map(i => encodeURIComponent(i))`, String: `encodeURIComponent(value)` |
| `next/dist/shared/lib/router/utils/get-dynamic-param.js` | 107-142 | `getDynamicParam()` | Builds tree segment: `[key, joinedValue, type]` |
| `next/dist/shared/lib/router/utils/get-dynamic-param.js` | 137 | (inline) | Array values joined: `Array.isArray(value) ? value.join('/') : value` |
| `next/dist/shared/lib/router/utils/get-dynamic-param.js` | 143 | `PARAMETER_PATTERN` | `/^([^[]*)\[((?:\[[^\]]*\])|[^\]]+)\](.*)$/` |
| `next/dist/server/app-render/app-render.js` | 203-213 | `makeGetDynamicParamFromSegment()` | Factory for segment param resolver |
| `next/dist/server/app-render/get-short-dynamic-param-type.js` | 11-23 | `dynamicParamTypes` | Type codes: `d`=dynamic, `c`=catchall, `oc`=optional-catchall |

### Client-Side Param Access

| File | Lines | Function | Role |
|------|-------|----------|------|
| `next/dist/client/components/navigation.js` | 145-156 | `useParams()` | Returns PathParamsContext value |
| `next/dist/client/components/navigation.js` | 120-133 | `usePathname()` | Returns PathnameContext value |
| `next/dist/client/components/navigation.js` | 95-119 | `useSearchParams()` | Returns ReadonlyURLSearchParams from SearchParamsContext |
| `next/dist/client/components/app-router.js` | 114-119 | (inline) | `pathname = new URL(canonicalUrl).pathname` |
| `next/dist/client/components/app-router.js` | 304-305 | (inline) | `pathParams = getSelectedParams(tree)` |
| `next/dist/client/components/app-router.js` | 412-413 | (inline) | `PathParamsContext.Provider value={pathParams}` |
| `next/dist/client/components/router-reducer/compute-changed-path.js` | 103-120 | `getSelectedParams()` | Extracts params from FlightRouterState tree |
| `next/dist/client/components/router-reducer/compute-changed-path.js` | 111-113 | (inline) | Catch-all: `segment[1].split('/')`, Single: `segment[1]` |

### Flight Router State Structure

```
FlightRouterState = [
  segment,           // [0] - string or [paramName, paramValue, paramType]
  parallelRoutes,    // [1] - { children: FlightRouterState, ... }
  url?,              // [2] - optional URL
  refresh?,          // [3] - optional refresh marker
  isRootLayout?,     // [4] - boolean
  hasLoadingBoundary // [5] - loading boundary marker
]

// Dynamic segment format:
segment = [paramName, paramValue, paramType]
// paramType: 'd' (dynamic), 'c' (catchall), 'oc' (optional-catchall)
// paramValue: the RE-ENCODED value (for client) or decoded value (for server)
```

## Lab App Structure

```
nextjs-cspt-lab/
  app/
    page.tsx                              # Home - static, route index
    about/page.tsx                        # Static route
    users/[userId]/page.tsx               # Client: useParams → fetch template
    shop/[category]/[productId]/page.tsx  # Client: useParams → fetch concat
    files/[...path]/page.tsx              # Server: catch-all → server fetch
    docs/[[...slug]]/page.tsx             # Server: optional catch-all
    teams/[teamId]/members/[memberId]/page.tsx  # Client: nested params → fetch
    dashboard/
      layout.tsx                          # Layout wrapper
      page.tsx                            # Dashboard index
      stats/page.tsx                      # Client: searchParams → fetch → innerHTML
      settings/page.tsx                   # Client: hash → service layer → fetch
    api/proxy/[...path]/route.ts          # Route handler: catch-all → SSRF
    data/[dataId]/page.tsx                # Server: await params → server fetch
    encoding-test/[testParam]/page.tsx    # Client: encoding comparison display
    encoding-catchall/[...segments]/page.tsx  # Server: catch-all encoding test
```

### Route Types by Component Type

| Route | Component Type | CSPT Source | CSPT Sink |
|-------|---------------|-------------|-----------|
| `/users/[userId]` | Client | `useParams()` | `fetch` template literal |
| `/shop/[cat]/[prod]` | Client | `useParams()` | `fetch` concatenation |
| `/files/[...path]` | Server | `await params` | `fetch` with `join('/')` |
| `/docs/[[...slug]]` | Server | `await params` | Display only |
| `/teams/[t]/members/[m]` | Client | `useParams()` | `fetch` template literal |
| `/dashboard/stats` | Client | `useSearchParams()` | `fetch` + `dangerouslySetInnerHTML` |
| `/dashboard/settings` | Client | `window.location.hash` | Service layer `fetch` |
| `/api/proxy/[...path]` | Route Handler | `await params` | `fetch` to external |
| `/data/[dataId]` | Server | `await params` | `fetch` to localhost |
| `/encoding-test/[param]` | Client | All hooks | Display comparison |
| `/encoding-catchall/[...seg]` | Server | `await params` | Display comparison |

## Build Output Analysis

### Next.js 16.1.6 with Turbopack

```
Build command: bun run build (uses `next build` with Turbopack)
Build time: ~2.9s compile + ~92ms static generation

Output structure:
  .next/
    static/
      chunks/           # Client-side JavaScript bundles
        *.js            # Per-page chunks (small, ~1-3KB each)
        turbopack-*.js  # Turbopack runtime
        *.css           # Compiled CSS
    server/
      app/              # Server-side route handlers (mirrors app/ structure)
      chunks/           # Server-side JavaScript bundles
        ssr/            # SSR chunks
    routes-manifest.json    # All routes with regexes
    build-manifest.json     # Client bundle mappings
    app-build-manifest.json # App Router specific manifest
```

### What Survives Minification

**Preserved in client bundles:**
- Fetch URL strings (template literals and concatenations)
- `dangerouslySetInnerHTML` property name
- `window.location.hash`, `.pathname`, etc.
- API base URL strings (`"/api/v2"`)
- JSON methods: `JSON.stringify`, `JSON.parse`
- HTTP methods: `"PUT"`, `"POST"`
- Content-Type headers

**Minified but pattern-detectable:**
- Hook calls: `(0,r.useParams)()` pattern
- Destructuring: `let{userId:e}=`
- State hooks: `(0,t.useState)("Loading...")`
- Effect hooks: `(0,t.useEffect)(()=>{...},[e])`

**Turbopack module format:**
```javascript
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push([
  "object"==typeof document?document.currentScript:void 0,
  moduleId,
  (e,s,r)=>{ /* module factory */ },
  chunkId,
  e=>{ /* page component */ }
]);
```

### Example: Minified Vulnerable Pattern

**Original:**
```javascript
const { userId } = useParams();
fetch(`/api/users/${userId}`)
```

**Minified (Turbopack):**
```javascript
let{userId:e}=(0,r.useParams)();
fetch(`/api/users/${e}`)
```

**Detection regex:**
```regex
let\s*\{[^}]+\}\s*=\s*\(\d+,\s*\w+\.useParams\)\(\).*?fetch\(`[^`]*\$\{
```

## Next.js Version History (CSPT-Relevant)

| Version | Change | CSPT Impact |
|---------|--------|-------------|
| 13.0 | App Router introduced | File-based routing, Server Components |
| 13.4 | App Router stable | Widespread adoption |
| 14.0 | Server Actions | New attack surface |
| 15.0 | `params` becomes Promise (`await params`) | Async params pattern |
| 15.x | CVE-2025-29927 (middleware bypass) | `x-middleware-subrequest` header bypass |
| 16.0 | Turbopack default | Different bundle format |
| 16.1.6 | Current (lab app version) | Re-encoding behavior confirmed |

## Known CVEs

### CVE-2025-29927: Middleware Bypass
- Header: `x-middleware-subrequest`
- Bypasses all middleware including auth checks
- Not directly CSPT but enables access to protected routes

### CVE-2025-55182 / CVE-2025-66478: React2Shell
- RSC (React Server Component) deserialization RCE
- Exploits server-side rendering pipeline
- Not CSPT but related to Server Component attack surface
