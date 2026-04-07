# 06 - Appendix: Source References, Lab Structure, Build Analysis

## Source Code References

### Vue Router v4.6.4 Source Locations

All references are to the installed package at:
`node_modules/vue-router/dist/`

#### Core Encoding Module
**File:** `devtools-EWN81iOl.mjs` (hash in filename varies per build)

| Function | Line | Purpose |
|----------|------|---------|
| `commonEncode()` | 119-121 | Base encoder using `encodeURI()` |
| `encodeHash()` | 128-130 | Hash encoding (less restrictive than encodeURIComponent) |
| `encodeQueryValue()` | 138-140 | Query value encoding |
| `encodeQueryKey()` | 146-148 | Query key encoding (also encodes `=`) |
| `encodePath()` | 155-157 | Path segment encoding |
| `encodeParam()` | 167-169 | Param encoding (encodes `/` to `%2F`) |
| `decode()` | 170-178 | **THE KEY FUNCTION** -- `decodeURIComponent()` wrapper |
| `parseURL()` | 193-214 | URL parsing, preserves path encoding |
| `resolveRelativePath()` | 287-309 | Relative path resolution (`.` and `..`) |

#### Router Core
**File:** `vue-router.mjs`

| Function | Line | Purpose |
|----------|------|---------|
| `createCurrentLocation()` | 16-26 | Extracts path from `window.location` |
| `createWebHistory()` | 160-183 | History mode factory |
| `tokenizePath()` | 282-401 | Tokenizes route path definitions |
| `BASE_PARAM_PATTERN` | 405 | Default param regex: `[^/]+?` |
| `tokensToParser()` | 435-526 | Creates regex matcher from tokens |
| `parse()` (inside tokensToParser) | 487-496 | Extracts params from matched path |
| `createRouterMatcher()` | 617-760 | Route matcher factory |
| `matcher.resolve()` | 700-746 | Resolves URL to route + params |
| `createRouter()` | 1158 | Router factory |
| `decodeParams` binding | 1172 | `applyToParams.bind(null, decode)` |
| `resolve()` (string path) | 1196-1209 | Resolves string URL -- params DECODED at line 1205 |
| `resolve()` (params object) | 1219-1222 | Resolves object -- params ENCODED then DECODED at 1228 |
| `push()` | 1256-1257 | `pushWithRedirect(to)` |

#### Key Data Flow
```
URL in browser
  -> createCurrentLocation() [encoded]
  -> parseURL() [path stays encoded, query/hash decoded]
  -> matcher.resolve() [regex match on encoded path]
  -> parse() [extract params from encoded match groups]
  -> decodeParams() [decodeURIComponent on ALL params] <-- THE CRITICAL STEP
  -> route.params [DECODED values available to components]
```

## Lab App Structure

```
vue-router-cspt-lab/
  src/
    main.ts                    # App entry: app.use(router), app.use(VueQueryPlugin)
    App.vue                    # Just <RouterView />
    router/
      index.ts                 # All route definitions (12 routes)
    pages/
      AboutPage.vue            # Static route (no params)
      UserPage.vue             # CSPT: route.params.userId -> fetch
      ProductPage.vue          # CSPT: multi-param concat -> fetch
      FilesPage.vue            # CSPT: catch-all array -> join -> fetch
      MemberPage.vue           # CSPT: multi-param -> axios
      CategoriesPage.vue       # CSPT: optional param -> fetch
      DocsPage.vue             # CSPT: repeatable param -> fetch
      ItemPage.vue             # CSPT: regex-constrained param -> useQuery
      DashboardLayout.vue      # Nested route layout
      DashboardIndex.vue       # Open redirect: query -> router.push
      DashboardStats.vue       # CSPT + XSS: query -> fetch -> v-html
      DashboardSettings.vue    # CSPT: service layer abstraction
      EncodingTestPage.vue     # Encoding comparison display
      EncodingCatchallPage.vue # Catch-all encoding display
  dist/                        # Production build output
    assets/
      index-BqgoA2er.js        # Main bundle (118KB, includes vue-router)
      [page]-[hash].js         # Code-split page chunks
```

## Build Analysis

### Production Bundle Size
| File | Size | Gzip | Contents |
|------|------|------|----------|
| `index-BqgoA2er.js` | 118.44 KB | 43.17 KB | Vue + Vue Router + app core |
| `MemberPage-CdRCjXfu.js` | 37.97 KB | 15.23 KB | Axios bundled with page |
| `ItemPage-DaiifG-h.js` | 9.18 KB | 3.52 KB | TanStack Vue Query subset |
| `EncodingTestPage-C11ttwB0.js` | 2.02 KB | 0.67 KB | All encoding display logic |
| Other pages | 0.26-1.14 KB each | 0.22-0.55 KB | Minimal page components |

### What Survives Minification

**Always survives (string literals):**
- Route path patterns: `'/users/:userId'`, `'/files/:pathMatch(.*)*'`
- API URL prefixes: `'/api/users/'`, `'/api/shop/'`
- Console log markers: `'[CSPT_SINK]'`, `'[ENCODING_TEST]'`
- HTML attribute names: `'innerHTML'`, `'class'`

**Survives with renaming (identifiable patterns):**
- `decodeURIComponent` -- built-in, never renamed
- `encodeURI` -- built-in, never renamed
- `fetch()` -- global function, never renamed
- `history.pushState` / `history.replaceState` -- browser API
- `window.location.pathname` -- browser API
- `popstate` event name

**Minified beyond recognition:**
- Vue Router function names (`createWebHistory` may be tree-shaken to alias)
- Component names (renamed to single letters)
- Variable names (all minified)
- Vue internal hooks (`watchEffect` -> single letter)

### Minified CSPT Sink Examples

From `UserPage-D36FALPo.js`:
```javascript
const t=`/api/users/${o.params.userId}`;
// 'o' is the minified route object from useRoute()
// The template literal and .params.userId survive clearly
```

From `DashboardStats-C5Ud5Z0A.js`:
```javascript
{innerHTML:o.value,class:"widget-container"}
// v-html compiles to innerHTML property assignment
// The property name 'innerHTML' always survives
```

From `ProductPage-BsRtdVWy.js`:
```javascript
"/api/shop/"+i(o).params.category+"/products/"+i(o).params.productId
// String concatenation with params survives verbatim
// i() is the minified unref() function
```

## Vue Router Version History (CSPT-relevant)

| Version | Change | Impact |
|---------|--------|--------|
| v4.0.0 | Composition API (`useRoute()`) | New param access pattern |
| v4.0.0 | Catch-all `(.*)*` syntax | Array return type |
| v4.1.0 | Improved param encoding | `encodeParam()` encodes `/` |
| v4.2.0 | Better hash handling | Still uses `decode()` |
| v4.6.4 | Current | All behaviors documented here |

## Related Issues

- **Issue #2187:** Hash encoding mismatch (`decodeURIComponent` vs `encodeURI`). Status: wontfix
- **Issue #2953:** Slash handling in params. Maintainers: "slashes are URL separators and MUST be encoded." But `%2F` decodes to `/` in params, which is by design.
- **Issue #1267:** Double encoding discussion. Maintainers clarified single decode is intentional.
