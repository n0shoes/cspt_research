# 01 - Route Definitions

## SolidStart File-Based Routing

SolidStart uses file-based routing under `src/routes/`. Route files are processed by vinxi and converted to route definitions consumed by `@solidjs/router`.

### Route Convention Mapping

| File Pattern | Route Path | Type |
|---|---|---|
| `src/routes/index.tsx` | `/` | Static index |
| `src/routes/about.tsx` | `/about` | Static |
| `src/routes/users/[userId].tsx` | `/users/:userId` | Dynamic param |
| `src/routes/shop/[category]/[productId].tsx` | `/shop/:category/products/:productId` | Multi-param |
| `src/routes/files/[...path].tsx` | `/files/*path` | Catch-all (splat) |
| `src/routes/teams/[teamId]/members/[memberId].tsx` | `/teams/:teamId/members/:memberId` | Nested dynamic |
| `src/routes/dashboard.tsx` | `/dashboard` | Layout (children via `props.children`) |
| `src/routes/dashboard/stats.tsx` | `/dashboard/stats` | Nested child |
| `src/routes/data/[dataId].tsx` | `/data/:dataId` | Server function route |
| `src/routes/api/proxy/[...path].ts` | `/api/proxy/**:path` | API route (server-only) |

### File to Route Processing Pipeline

1. **vinxi** reads `src/routes/` directory, produces `fileRoutes` array
2. **`routes.js`** (`@solidjs/start/dist/router/routes.js`) calls `defineRoutes()`:
   - Sorts by path length
   - Strips route groups: `.replace(/\([^)/]+\)/g, "")`
   - Normalizes slashes: `.replace(/\/+/g, "/")`
   - Processes parent/child nesting
3. **`FileRoutes.js`** wraps routes with lazy-loaded components via `lazyRoute()`
4. **`@solidjs/router`** `createBranches()` converts to pattern matchers

### Route Pattern Construction (`routing.js:206-234`)

```javascript
// createRoutes() in @solidjs/router
const path = joinPaths(base, expandedPath);
let pattern = isLeaf ? path : path.split("/*", 1)[0];
pattern = pattern
  .split("/")
  .map((s) => {
    return s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s);
  })
  .join("/");
```

Static segments are `encodeURIComponent`-encoded. Dynamic segments (`:param`) and splats (`*param`) are left as-is. This creates the internal pattern used for matching.

### API Route Pattern Construction (`routes.js:59-65`)

```javascript
let path = route.path
  .replace(/\([^)/]+\)/g, "")
  .replace(/\/+/g, "/")
  .replace(/\*([^/]*)/g, (_, m) => `**:${m}`)
  .split("/")
  .map(s => (s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s)))
  .join("/");
```

API routes use `radix3` router instead of `@solidjs/router`. Catch-all `*path` becomes `**:path` for radix3 matching.

## Build Output Analysis

### Client Bundle Structure (vinxi build)

```
.vinxi/build/client/_build/assets/
  routing-{hash}.js       # @solidjs/router core (createMatcher, params, etc)
  web-{hash}.js           # solid-js/web runtime
  client-{hash}.js        # Entry point
  _userId_-{hash}.js      # Per-route chunks
  _...path_-{hash}.js     # Catch-all route chunks
  stats-{hash}.js         # Stats route (innerHTML sink)
  _dataId_-{hash}.js      # Server function route (seroval, query)
```

### Server Bundle Structure

```
.output/server/chunks/build/
  routing-{hash}.mjs      # Router logic (server-side)
  _dataId_-{hash}.mjs     # Server function implementations
  _...path_-{hash}.mjs    # Catch-all handlers
```

### What Survives Minification

**Route params access** -- minified but recognizable:
```javascript
// Source: const params = useParams(); ... params.userId
// Build:  const l=x(); ... l.userId
```
The import `{j as x}from"./routing-{hash}.js"` maps to `useParams`. Property access `.userId`, `.path`, `.category` survives as-is.

**Fetch construction** -- template literals preserved:
```javascript
// Source: fetch(`/api/users/${userId}`)
// Build:  fetch(`/api/users/${e}`)
```
The string template structure survives; only the variable name changes.

**innerHTML sink** -- transformed to Solid runtime call:
```javascript
// Source: <div innerHTML={stats()} />
// Build:  d(n,"innerHTML",a())
// where d = y from web-{hash}.js (setAttribute equivalent)
```

**Server function registration** -- function ID preserved:
```javascript
pn(()=>{}, "src_routes_data_dataId_tsx--getData_query", "/Users/.../[dataId].tsx?...")
```
The full source file path is embedded as the server function identifier.

### Detection Regex for Build Output

```
# SolidStart app fingerprint
/from"\.\/web-[A-Za-z0-9]+\.js"/
/from"\.\/routing-[A-Za-z0-9]+\.js"/

# Route param access (useParams)
/\{j\s+as\s+\w+\}.*routing/

# Dynamic param sinks
/fetch\(`[^`]*\$\{[^}]+\.[a-zA-Z]+\}/

# innerHTML sink
/[a-z]\([^,]+,"innerHTML",[^)]+\)/

# Server function registration
/src_routes.*--\w+_query/

# seroval serialization
/__SEROVAL_/

# X-Server-Id header (server function calls)
/"X-Server-Id"/
```
