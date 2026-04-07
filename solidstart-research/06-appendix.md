# 06 - Appendix

## Package Versions Analyzed

| Package | Version | Source |
|---------|---------|--------|
| `@solidjs/router` | 0.15.4 | `node_modules/@solidjs/router/dist/` |
| `@solidjs/start` | 1.3.2 | `node_modules/@solidjs/start/dist/` |
| `solid-js` | 1.9.11 | `node_modules/solid-js/` |
| `vinxi` | 0.5.11 | Build tool |
| `bun` | 1.3.6 | Runtime |

## Source Code References

### @solidjs/router Key Files

| File | Purpose | CSPT Relevance |
|------|---------|----------------|
| `dist/utils.js` | `createMatcher()`, `normalizePath()`, `resolvePath()` | **Critical** -- param extraction, NO decoding |
| `dist/routing.js` | `useParams`, `useLocation`, `useSearchParams`, `createRouterContext` | **Critical** -- reactive param system |
| `dist/routers/Router.js` | Browser integration, `getSource()` | **High** -- reads `window.location.pathname` raw |
| `dist/routers/createRouter.js` | Signal creation, scroll handling | Medium |
| `dist/routers/components.jsx` | `Routes`, `createRouterComponent` | Medium -- route matching orchestration |
| `dist/data/events.js` | `setupNativeEvents`, anchor click interception | Medium -- client-side navigation |
| `dist/data/query.js` | `query()` (cache), `hashKey()` | **High** -- server function caching layer |
| `dist/data/createAsync.js` | `createAsync()`, `subFetch()` | Medium -- wraps createResource |
| `dist/components.jsx` | `<A>` component (only place with `decodeURI`) | Low |

### @solidjs/start Key Files

| File | Purpose | CSPT Relevance |
|------|---------|----------------|
| `dist/runtime/server-handler.js` | Server function handler, `handleServerFunction` | **Critical** -- deserializes client args |
| `dist/router/routes.js` | File route → config conversion, `radix3` for API routes | **High** -- route definition pipeline |
| `dist/router/FileRoutes.js` | `FileRoutes` component, lazy loading | Medium |
| `dist/router/lazyRoute.js` | Lazy component loading | Low |
| `dist/runtime/serialization.js` | seroval serialize/deserialize | Medium -- data boundary |

## Lab App Structure

```
solidstart-cspt-lab/
  app.config.ts                          # SolidStart config (vinxi)
  package.json                           # Dependencies
  tsconfig.json                          # TypeScript config
  src/
    app.tsx                              # Root layout with Router + FileRoutes
    entry-client.tsx                     # Client entry (mount)
    entry-server.tsx                     # Server entry (createHandler)
    routes/
      index.tsx                          # / (home)
      about.tsx                          # /about (static)
      users/[userId].tsx                 # SINK: useParams -> fetch
      shop/[category]/[productId].tsx    # SINK: multi-param -> fetch
      files/[...path].tsx                # SINK: catch-all -> fetch (HIGHEST RISK)
      teams/[teamId]/members/[memberId].tsx  # SINK: nested dynamic -> fetch
      dashboard.tsx                      # Layout
      dashboard/index.tsx                # Dashboard index
      dashboard/stats.tsx                # SINK: searchParams -> fetch -> innerHTML
      dashboard/settings.tsx             # SINK: searchParams -> fetch (API service)
      data/[dataId].tsx                  # SINK: query("use server") -> server fetch
      encoding-test/[testParam].tsx      # Test: encoding comparison display
      encoding-catchall/[...rest].tsx    # Test: catch-all encoding display
      api/proxy/[...path].ts            # SINK: API route catch-all -> SSRF
```

## Build Output Structure

```
.vinxi/build/
  client/_build/assets/
    web-{hash}.js               # solid-js/web runtime
    routing-{hash}.js           # @solidjs/router (createMatcher, params, etc.)
    client-{hash}.js            # Entry point
    _userId_-{hash}.js          # Route: /users/:userId
    _productId_-{hash}.js       # Route: /shop/:category/:productId
    _...path_-{hash}.js         # Route: /files/*path (catch-all)
    _memberId_-{hash}.js        # Route: /teams/:teamId/members/:memberId
    stats-{hash}.js             # Route: /dashboard/stats (innerHTML)
    settings-{hash}.js          # Route: /dashboard/settings
    _dataId_-{hash}.js          # Route: /data/:dataId (server function)
    _...rest_-{hash}.js         # Route: /encoding-catchall/*rest
    _testParam_-{hash}.js       # Route: /encoding-test/:testParam
    about-{hash}.js             # Route: /about
    index-{hash}.js             # Route: / (multiple index files)
    dashboard-{hash}.js         # Route: /dashboard (layout)

  ssr/                          # Server-side rendering chunks
    assets/routing-{hash}.js    # SSR router
    assets/fetchEvent-{hash}.js # Request event handling

  server-fns/_server/           # Server function implementations
    assets/server-fns-{hash}.js # Server function runtime
    _dataId_-{hash}.js          # getData server function

.output/                        # Production output (Nitro)
  server/
    chunks/build/               # Server chunks
    index.mjs                   # Entry point
  public/                       # Static assets
    _build/assets/              # Client bundles (copied)
```

## Minified Code Mapping

### Variable Mappings in Build Output

Based on analysis of `routing-{hash}.js`:

| Minified | Original | Import Source |
|----------|----------|---------------|
| `$e` | `useParams` | exported as `j` |
| `qe` | `useSearchParams` | exported as `u` |
| `Ee` | `useLocation` | exported as `l` |
| `Ae` | `useNavigate` | exported as `h` |
| `ve` | `createMatcher` | internal |
| `De` | `createRouterContext` | exported as `a` |
| `Le` | `createBranches` | exported as `c` |
| `q` | `getRouteMatches` | internal |
| `Y` | `createMemoObject` | internal |
| `V` | `extractSearchParams` | internal |
| `B` | `resolvePath` | internal |
| `E` | `normalizePath` | internal |

### Key Build Patterns for Detection

```javascript
// useParams usage (route chunk imports)
import{j as x}from"./routing-{hash}.js"
// Then: x() returns params object

// useSearchParams usage
import{u as v}from"./routing-{hash}.js"
// Then: [s] = v() returns [searchParams, setSearchParams]

// createResource (from solid-js)
import{w as f}from"./web-{hash}.js"
// Then: f(() => params.key, async (val) => { ... })

// innerHTML (Solid runtime)
import{y as d}from"./web-{hash}.js"
// Then: d(element, "innerHTML", value)

// Server function proxy (from _dataId_ chunk)
pn(() => {}, "function_id", "source_path")
// pn = createServerFunctionProxy
```

## seroval Serialization Format

Server function arguments are serialized via seroval. Key characteristics:

- Uses a custom binary/JSON format (not standard JSON)
- Supports streaming (ReadableStream)
- Handles JS-specific types (Date, RegExp, Map, Set, etc.)
- Request header: `x-serialized: true`
- Content-Type: `text/plain` (for seroval) or `application/json`

Example server function call:
```
POST /_server HTTP/1.1
X-Server-Id: src_routes_data_dataId_tsx--getData_query%23%2FUsers%2F...
X-Server-Instance: server-fn:0
x-serialized: true
Content-Type: text/plain

[seroval-encoded arguments]
```

## Security Architecture Summary

```
Browser URL
    |
    v
window.location.pathname  [percent-encoded by browser]
    |
    v
Router.getSource()  [reads raw, no transformation]
    |
    v
createLocation()  [wraps in reactive signals]
    |
    +---> location.pathname [encoded]
    +---> location.search [encoded]
    +---> location.query [decoded by URLSearchParams]
    |
    v
createMatcher()  [splits on "/", matches segments]
    |
    v
params  [RAW segments, NO decodeURIComponent]
    |
    +---> Developer fetch(`/api/${params.x}`)  [param still encoded]
    +---> Developer query(fn)("use server")    [passes to server unchanged]
    +---> Developer innerHTML = response       [if response is HTML, XSS]
```

## Differences from Other Frameworks

### vs React Router
- React Router decodes params; Solid does not
- React Router catch-all returns array; Solid returns string
- React Router has no server function equivalent
- Both use `URLSearchParams` for query params (same behavior)

### vs Next.js
- Next.js App Router decodes params; Solid does not
- Next.js catch-all returns array; Solid returns string
- Next.js Server Actions use similar JSON-based transport
- Next.js has middleware for server-side validation; SolidStart does not

### vs SvelteKit
- SvelteKit decodes params in `$page.params`; Solid does not
- SvelteKit `+server.ts` is similar to SolidStart API routes
- SvelteKit form actions vs SolidStart server functions (similar transport)

### vs Vue Router
- Vue Router does NOT decode params (like Solid -- both are safer)
- Both use raw URL segments for params
- Vue has no native `innerHTML` equivalent in templates (v-html exists but is explicit)
