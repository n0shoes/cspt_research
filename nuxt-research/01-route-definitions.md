# 01 - Nuxt Route Definitions

## File-Based Routing

Nuxt uses a file-based routing system under `pages/`. The directory structure maps directly to URL paths, compiled at build time into Vue Router route definitions.

### Route Type Mapping

| File Path | Route Pattern | Vue Router Compiled | Type |
|-----------|--------------|-------------------|------|
| `pages/index.vue` | `/` | `path: "/"` | Static |
| `pages/about.vue` | `/about` | `path: "/about"` | Static |
| `pages/users/[id].vue` | `/users/:id` | `path: "/users/:id()"` | Dynamic param |
| `pages/shop/[category]/[productId].vue` | `/shop/:category/:productId` | `path: "/shop/:category()/:productId()"` | Multi-param |
| `pages/files/[...slug].vue` | `/files/:slug(.*)` | `path: "/files/:slug(.*)*"` | Catch-all |
| `pages/teams/[teamId]/members/[memberId].vue` | `/teams/:teamId/members/:memberId` | `path: "/teams/:teamId()/members/:memberId()"` | Nested dynamic |
| `pages/dashboard.vue` + children | `/dashboard` | `path: "/dashboard"` with `children: [...]` | Layout parent |
| `pages/data/[dataId].vue` | `/data/:dataId` | `path: "/data/:dataId()"` | Dynamic param |
| `pages/encoding-test/[testParam].vue` | `/encoding-test/:testParam` | `path: "/encoding-test/:testParam()"` | Dynamic param |
| `pages/encoding-catchall/[...slug].vue` | `/encoding-catchall/:slug(.*)` | `path: "/encoding-catchall/:slug(.*)*"` | Catch-all |

### Server Route Mapping

Server routes under `server/api/` are compiled into Nitro route handlers:

| File Path | Nitro Route | Handler Pattern |
|-----------|-------------|-----------------|
| `server/api/users/[id].ts` | `/api/users/:id` | `getRouterParam(event, 'id')` |
| `server/api/files/[...].ts` | `/api/files/**` | `event.context.params?._` |
| `server/api/proxy/[...path].ts` | `/api/proxy/**:path` | `event.context.params?.path` |
| `server/api/data/[dataId].ts` | `/api/data/:dataId` | `getRouterParam(event, 'dataId')` |
| `server/api/shop/[...].ts` | `/api/shop/**` | `event.context.params?._` |

### Compiled Route Output (Production)

From `.output/server/chunks/build/server.mjs`:

```javascript
// Nuxt compiles pages/ to Vue Router route configs
{
  name: "users-id",
  path: "/users/:id()",
  component: () => import('./_id_-DrwRZmc2.mjs')
},
{
  name: "files-slug",
  path: "/files/:slug(.*)*",
  component: () => import('./_...slug_-Bx4ZqEqD.mjs')
},
{
  name: "shop-category-productId",
  path: "/shop/:category()/:productId()",
  component: () => import('./_productId_-BiY-lRJl.mjs')
}
```

From `.output/server/chunks/nitro/nitro.mjs`:

```javascript
const handlers = [
  { route: '/api/data/:dataId', handler: _lazy_sKuOry, lazy: true },
  { route: '/api/files/**', handler: _lazy_yGIUhT, lazy: true },
  { route: '/api/proxy/**:path', handler: _lazy_6jEJsJ, lazy: true },
  { route: '/api/shop/**', handler: _lazy_FhibpP, lazy: true },
  { route: '/api/users/:id', handler: _lazy_wUV1Rp, lazy: true },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false },
  { route: '/**', handler: _lazy__a51vK, lazy: true }  // catch-all renderer
];
```

### Nuxt-Specific Route Naming Convention

Nuxt auto-generates route names from file paths:
- `pages/users/[id].vue` -> name: `"users-id"`
- `pages/shop/[category]/[productId].vue` -> name: `"shop-category-productId"`
- `pages/teams/[teamId]/members/[memberId].vue` -> name: `"teams-teamId-members-memberId"`

### Empty Parens `()` Suffix

Nuxt compiles `[param]` to `:param()` in Vue Router -- the empty parens mean "no custom regex, use default `[^/]+?`". Catch-all `[...slug]` compiles to `:slug(.*)*`.

## Detection Regexes

### Identify Nuxt File-Based Routes (Source)

```regex
pages/.*\[([^\]]+)\]\.vue
pages/.*\[\.\.\.([^\]]+)\]\.vue
```

### Identify Compiled Route Patterns (Build Output)

```regex
path:\s*["']/[^"']*:[a-zA-Z]+\(\)
path:\s*["']/[^"']*:\w+\(\.\*\)\*
```

### Identify Server Route Handlers (Source)

```regex
server/api/.*\[([^\]]+)\]\.ts
server/api/.*\[\.\.\.([^\]]*)\]\.ts
```

### Identify Server Route Patterns (Build Output)

```regex
route:\s*['"]\/api\/[^'"]*:[a-zA-Z]+
route:\s*['"]\/api\/[^'"]*\*\*
```
