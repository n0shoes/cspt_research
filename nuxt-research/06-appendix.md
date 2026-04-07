# 06 - Appendix

## Source Code References

### Vue Router 4.6.4

| Function | File | Line | Purpose |
|----------|------|------|---------|
| `decode()` | `devtools-EWN81iOl.mjs` | 170 | `decodeURIComponent()` wrapper -- decodes all params |
| `encodeParam()` | `devtools-EWN81iOl.mjs` | 167 | Encodes param value including `/` -> `%2F` |
| `encodePath()` | `devtools-EWN81iOl.mjs` | 155 | Encodes path (preserves `/`) |
| `encodeHash()` | `devtools-EWN81iOl.mjs` | 128 | Encodes hash value |
| `commonEncode()` | `devtools-EWN81iOl.mjs` | 119 | Base encoder via `encodeURI()` |
| `decodeParams` binding | `vue-router.mjs` | 1172 | `applyToParams(decode)` -- applies decode to ALL params |
| `resolve()` decode | `vue-router.mjs` | 1205 | Applies `decodeParams` to matched route params |
| `resolve()` hash decode | `vue-router.mjs` | 1206 | Applies `decode` to hash |
| `tokensToParser()` | `vue-router.mjs` | 435 | Compiles route pattern to regex |
| `BASE_PARAM_PATTERN` | `vue-router.mjs` | 405 | `[^/]+?` -- default param regex |

### H3 (via Nitro)

| Function | File | Line | Purpose |
|----------|------|------|---------|
| `getRouterParams()` | `h3/dist/index.mjs` | 252 | Get all params, optional decode |
| `getRouterParam()` | `h3/dist/index.mjs` | 266 | Get single param, delegates to getRouterParams |
| `decode()` (ufo) | `ufo/dist/index.mjs` | 124 | `decodeURIComponent()` wrapper |
| `decodePath()` (ufo) | `ufo/dist/index.mjs` | ~131 | Decodes path segments |
| Event param assignment | `nitro.mjs` | 1912 | `event.context.params = params` from radix3 match |

### Nuxt 3.21.1

| Function | File | Purpose |
|----------|------|---------|
| `useFetch()` | `nuxt/dist/app/composables/fetch.js:7` | Data fetching composable, calls `$fetch` |
| `_$fetch(_request.value)` | `nuxt/dist/app/composables/fetch.js:64` | Actual fetch call -- no URL sanitization |
| Island reviver | `nuxt/dist/app/plugins/revive-payload.client.js:17-32` | CVE-2025-59414 -- `$fetch(/__nuxt_island/${key}.json)` |
| `_fetchComponent()` | `nuxt/dist/app/components/nuxt-island.js:184-216` | Island component fetch |
| Island URL construction | `nuxt/dist/app/components/nuxt-island.js:189` | `/__nuxt_island/${key2}.json` URL |
| `setPayload()` | `nuxt/dist/app/components/nuxt-island.js:96-118` | Stores island data with `__nuxt_island` key |
| Router plugin | `nuxt/dist/pages/runtime/plugins/router.js:27-233` | Sets up Vue Router with Nuxt integration |
| Payload client | `nuxt/dist/app/plugins/payload.client.js` | Loads payload on navigation |

### Nitro Server (Built)

| Component | File | Purpose |
|-----------|------|---------|
| Route handlers array | `nitro.mjs:4872-4881` | Compiled server route table |
| `/__nuxt_island/**` handler | `nitro.mjs:4880` | Island endpoint handler |
| `/**` catch-all renderer | `nitro.mjs:4881` | SSR renderer for all pages |

## Lab Structure

```
nuxt-cspt-lab/
+-- nuxt.config.ts                    # Nuxt configuration
+-- app.vue                           # Root component with <NuxtPage />
+-- package.json                      # Dependencies
+-- composables/
|   +-- useApiService.ts              # CSPT sink: API service composable
+-- pages/
|   +-- index.vue                     # Home with nav links
|   +-- about.vue                     # Static page
|   +-- users/
|   |   +-- [id].vue                  # CSPT: useFetch with route.params.id
|   +-- shop/
|   |   +-- [category]/
|   |       +-- [productId].vue       # CSPT: multi-param $fetch
|   +-- files/
|   |   +-- [...slug].vue             # CSPT: catch-all array join
|   +-- teams/
|   |   +-- [teamId]/
|   |       +-- members/
|   |           +-- [memberId].vue    # CSPT: nested dynamic params
|   +-- dashboard.vue                 # Layout parent
|   +-- dashboard/
|   |   +-- index.vue                 # Dashboard index
|   |   +-- stats.vue                 # CSPT + XSS: query -> useFetch -> v-html
|   |   +-- settings.vue              # CSPT: API service composable
|   +-- data/
|   |   +-- [dataId].vue              # CSPT: useFetch with SSR
|   +-- encoding-test/
|   |   +-- [testParam].vue           # Encoding comparison test
|   +-- encoding-catchall/
|       +-- [...slug].vue             # Catch-all encoding test
+-- server/
|   +-- api/
|       +-- users/
|       |   +-- [id].ts              # SSRF: getRouterParam
|       +-- files/
|       |   +-- [...].ts             # SSRF: catch-all server route
|       +-- proxy/
|       |   +-- [...path].ts         # SSRF: proxy pattern
|       +-- data/
|       |   +-- [dataId].ts          # Server data endpoint
|       +-- shop/
|           +-- [...].ts             # Server shop endpoint
+-- .output/                          # Production build
    +-- public/
    |   +-- _nuxt/                    # Client bundles (hashed names)
    +-- server/
        +-- chunks/
            +-- build/                # SSR bundles
            +-- routes/               # Compiled server routes
            +-- nitro/                # Nitro runtime
```

## Build Analysis

### Client Bundle Observations

1. **Route definitions** are compiled into `server.mjs` (SSR) and loaded by the client router plugin
2. **Dynamic imports** use hashed filenames: `() => import('./_id_-DrwRZmc2.mjs')`
3. **CSPT sinks survive minification**: Template literals with params are preserved
4. **v-html compiles to** `{innerHTML: value}` with `["innerHTML"]` prop list -- easily searchable
5. **useFetch** is imported as a short alias (e.g., `p`) but the URL template literal is preserved

### Server Bundle Observations

1. **Server routes** are compiled to individual `.mjs` files under `.output/server/chunks/routes/`
2. **getRouterParam** is imported from the Nitro bundle, not inlined
3. **Route table** in `nitro.mjs` lists all routes with patterns including `:param` and `**` wildcard
4. **`/__nuxt_island/**`** is a registered route with an empty handler (for SSR island rendering)
5. **Catch-all renderer** (`/**`) handles all page requests

### Nuxt-Specific Fingerprints in Production

| Fingerprint | Location | Confidence |
|-------------|----------|------------|
| `window.__NUXT__` | HTML body | High |
| `/_nuxt/` path prefix | Client assets | High |
| `_payload.json` files | Navigation payload | High |
| `/__nuxt_island/` routes | Island components | Medium |
| `/__nuxt_error` route | Error handler | Medium |
| `x-powered-by: Nitro` header | Response headers (if not stripped) | Medium |
| `data-island-uid` attribute | HTML (with islands) | Medium |
| Route path pattern `:param()` | Client bundles | High (Nuxt-specific suffix) |
| `builds/meta/` manifest | Client assets | Medium |

## CVE References

| CVE | Description | Component | Impact |
|-----|-------------|-----------|--------|
| CVE-2025-59414 | Stored CSPT via island payload revival | `revive-payload.client.js` | CSPT -> potential XSS |
| CVE-2025-27415 | Cache poisoning DoS via payload route regex | Payload routing | DoS |

## Key Differences from Plain Vue Router

| Aspect | Vue Router (standalone) | Nuxt 3 |
|--------|------------------------|--------|
| Route definitions | Manual in `router/index.ts` | Auto-generated from `pages/` |
| Data fetching | `fetch()` / axios (manual) | `useFetch()` / `$fetch()` (framework) |
| Server-side routes | N/A | `server/api/` with H3 |
| SSR | Manual setup | Built-in with payload hydration |
| Island components | N/A | `NuxtIsland` with `/__nuxt_island/` |
| Param decoding (client) | Same -- Vue Router decodes | Same -- inherits Vue Router |
| Param decoding (server) | N/A | H3 does NOT decode by default |
| CSPT risk surface | Client-side only | Client + Server (SSRF) + Stored (islands) |
