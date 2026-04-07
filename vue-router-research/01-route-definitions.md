# 01 - Vue Router v4 Route Definitions

## Route Definition Methods

### 1. Static Routes
```typescript
{ path: '/about', component: AboutPage }
```
No dynamic params. Not a CSPT source.

### 2. Dynamic Segments (`:param`)
```typescript
{ path: '/users/:userId', component: UserPage }
```
- `route.params.userId` = **DECODED** string
- `/users/..%2F..%2Fadmin` -> `userId = "../../admin"`
- **CSPT risk: HIGH**

### 3. Optional Segments (`:param?`)
```typescript
{ path: '/:lang?/categories', component: CategoriesPage }
```
- Param may be undefined (when omitted) or decoded string
- `/..%2F..%2Fadmin/categories` -> `lang = "../../admin"`
- **CSPT risk: HIGH** (often defaulted without validation)

### 4. Catch-All (`/:pathMatch(.*)*`)
```typescript
{ path: '/files/:pathMatch(.*)*', component: FilesPage }
```
- Returns **array** of decoded segments (split on `/`)
- `/files/..%2F..%2Fadmin` -> `pathMatch = ["../../admin"]` (single element)
- `/files/a/b/../../admin` -> `pathMatch = ["a", "b", "..", "..", "admin"]`
- Developers typically `.join('/')` to reconstruct path
- **CSPT risk: CRITICAL** (catch-all accepts anything)

### 5. Repeatable Params (`:param+`)
```typescript
{ path: '/docs/:chapters+', component: DocsPage }
```
- Single segment: returns **string** `"intro"`
- Multiple segments: returns **array** `["intro", "advanced"]`
- Type inconsistency (string vs array) is a common source of bugs
- `/docs/..%2F..%2Fadmin` -> `chapters = "../../admin"` (string, single segment)
- **CSPT risk: HIGH**

### 6. Regex-Constrained Params
```typescript
{ path: '/items/:itemId(\\d+)', component: ItemPage }
```
- Only matches digits in the URL path
- Provides defense-in-depth against traversal
- **CSPT risk: LOW** (constraint blocks `..` characters)
- But: constraint applies to the ENCODED URL, regex matches after path extraction

### 7. Multiple Dynamic Segments
```typescript
{ path: '/shop/:category/:productId', component: ProductPage }
{ path: '/teams/:teamId/members/:memberId', component: MemberPage }
```
- Each param independently decoded
- Any single param can contain traversal payload
- **CSPT risk: HIGH** (multiple injection points)

### 8. Nested Routes with Children
```typescript
{
  path: '/dashboard',
  component: DashboardLayout,
  children: [
    { path: '', component: DashboardIndex },
    { path: 'stats', component: DashboardStats },
    { path: 'settings', component: DashboardSettings },
  ]
}
```
- Child routes inherit parent params
- Query params (`route.query`) also flow to children
- **CSPT risk: MEDIUM** (query params as secondary source)

## What Survives Minification

### Route Definitions in Production

Vue Router route definitions survive as **runtime objects**. In the minified bundle (`index-BqgoA2er.js`), the route config is embedded as data:

```javascript
// Route path strings survive verbatim
{ path: '/users/:userId', ... }
{ path: '/files/:pathMatch(.*)*', ... }
```

Route paths are **never minified** because they're string literals used at runtime for regex matching.

### Identifying Vue Router Apps in Production

**Bundle fingerprints:**
- `createWebHistory` / `createRouter` function names (may be aliased but imported)
- `decodeURIComponent` present in router chunk
- `encodeURI` present (for `commonEncode`)
- Route path regex patterns (e.g., `[^/]+?` which is `BASE_PARAM_PATTERN`)
- `RouterView` / `RouterLink` component names
- `popstate` event listener setup
- `history.replaceState` / `history.pushState` calls

**Minified patterns from vue-router v4.6.4:**
```
// The decode function (always present)
function on(e){if(e==null)return null;try{return decodeURIComponent(""+e)}catch{}return""+e}

// The encodeParam function (encodes / to %2F)
function oa(e){return ia(e).replace(zu,"%2F")}

// The commonEncode function
function ks(e){return e==null?"":encodeURI(""+e).replace(ta,"|").replace(Xu,"[").replace(Zu,"]")}
```

## Detection Regexes

### Find route definitions in source
```regex
(?:path|route)\s*:\s*['"`][^'"]*:[a-zA-Z]+
```

### Find catch-all routes
```regex
\(\.\*\)\*|\(\.\*\)\+|pathMatch
```

### Find param access in Vue files
```regex
route\.params\.\w+|useRoute\(\)\.params|\$route\.params
```

### Find optional/repeatable params
```regex
:\w+\?|:\w+\+|:\w+\*
```

### Find Vue Router in minified JS
```regex
decodeURIComponent\(""\+\w\)|createWebHistory|RouterView|popstate
```
