# 1. All Client-Side Path Definition Methods

## Route Definition Styles in React Router v7

React Router v7 uses `createBrowserRouter()` with a route config array. Every style was tested:

| Style | Example | Compiled Form |
|-------|---------|---------------|
| Static | `path: "/about"` | `{path:"/about",element:De.jsx(HE,{})}` |
| Dynamic segment | `path: "/users/:userId"` | `{path:"/users/:userId",element:...}` |
| Optional segment | `path: "/:lang?/categories"` | `{path:"/:lang?/categories",element:...}` |
| Catch-all (splat) | `path: "/files/*"` | `{path:"/files/*",element:...}` |
| Nested dynamic | `path: "/teams/:teamId/members/:memberId"` | `{path:"/teams/:teamId/members/:memberId",...}` |
| Multiple params | `path: "/shop/:category/:productId"` | `{path:"/shop/:category/:productId",...}` |
| Layout + children | `path: "/dashboard", children: [...]` | `{path:"/dashboard",element:...,children:[...]}` |
| Index route | `{ index: true }` | `{index:!0,element:...}` |
| Lazy-loaded | `React.lazy(() => import("./LazyPage"))` | `ip.lazy(()=>L0(()=>import("./LazyPage-CWMNrFw5.js"),[]))` |
| Loader (data mode) | `loader: dataLoader` | `{path:"/data/:dataId",loader:DR,element:...}` |

## What Survives Minification

**ALWAYS preserved (string literals):**
- All `path:` values verbatim (e.g., `"/users/:userId"`)
- `:param` syntax, `*` splat, `?` optional markers
- `children:` array nesting
- `index:` key (value becomes `!0`)
- `loader:` key (function reference mangled)
- `element:` key
- `dangerouslySetInnerHTML` prop name
- All fetch URL strings and template literals
- `queryKey` and `queryFn` (TanStack Query option keys)
- Import paths for lazy chunks

**ALWAYS mangled (identifiers):**
- `useParams` → 2-letter (`ul` in main, `Z` in lazy chunk)
- `useSearchParams` → `cu`
- `useNavigate` → `Ic`
- `useLocation` → `Ta`
- `useLoaderData` → `dS`
- `createBrowserRouter` → `kS`
- `axios` → `ft`
- `React.lazy` → `ip.lazy`

**Framework fingerprints that survive:**
- `window.__reactRouterVersion="7.13.1"` - always present
- `window.__reactRouterContext` with `isSpaMode`
- Error strings: `"useLocation() may be used only in the context of a <Router>"`
- `dangerouslySetInnerHTML` - React prop, never minified

## Detection Regexes for Route Discovery

```
# React Router v7 fingerprint
window\.__reactRouterVersion=

# Route definitions with dynamic params
\{path:"[^"]*:[a-zA-Z]\w*[^"]*"

# Route definitions with splat
\{path:"[^"]*\*[^"]*"

# Any route definition
path:"(/[^"]+)"

# Nested route structure
children:\[.*\{path:

# Index route
index:!0

# Loader route
loader:\w+,\s*element:

# Lazy chunk import
import\("\.\/[A-Za-z]+-[A-Za-z0-9]+\.js"\)
```
