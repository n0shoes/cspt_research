# 04 - Encoding Matrix: Vue Router vs React Router

## Core Encoding Comparison

Both Vue Router v4 and React Router v6+ use `decodeURIComponent()` for params. The fundamental CSPT behavior is identical. But there are important API differences.

| Behavior | Vue Router v4 | React Router v6 |
|----------|--------------|-----------------|
| Param decoding | `decodeURIComponent()` | `decodeURIComponent()` |
| Params API | `route.params.X` | `useParams().X` |
| Encoded path | `route.path` (explicit) | `location.pathname` (browser) |
| Full path | `route.fullPath` (explicit) | `location.pathname + search + hash` |
| Query access | `route.query.X` (decoded) | `useSearchParams()` (decoded) |
| Hash access | `route.hash` (decoded) | `location.hash` (encoded) |

## Key Differences for CSPT

### 1. Catch-All Returns ARRAY (Vue) vs STRING (React)

**Vue Router:**
```typescript
// Route: /files/:pathMatch(.*)*
route.params.pathMatch  // ["segment1", "segment2"] -- ARRAY
```

**React Router:**
```typescript
// Route: /files/*
params['*']  // "segment1/segment2" -- STRING
```

Vue's array splitting on `/` creates a unique behavior:
- `%2F` does NOT split (decoded after splitting)
- Developers must `.join('/')` which reconstructs the traversal
- The array type can confuse TypeScript type checking

### 2. Explicit Path API (Vue) vs Browser API (React)

**Vue Router** provides `route.path` as a first-class decoded/encoded property:
```typescript
route.path      // "/users/..%2F..%2Fadmin" (ENCODED)
route.params    // { userId: "../../admin" } (DECODED)
```

**React Router** relies on browser `location.pathname`:
```typescript
location.pathname  // "/users/..%2F..%2Fadmin" (ENCODED, from browser)
useParams()        // { userId: "../../admin" } (DECODED)
```

Functionally equivalent, but Vue's explicit API means developers are more likely to use `route.params` (the decoded version) since it's the "right" way.

### 3. `router.push()` Asymmetry (Vue-specific)

Vue Router has an encoding asymmetry unique to its API:

```typescript
// String: NOT encoded -- developer must pre-encode
router.push('/users/../../admin')  // navigates with literal ../

// Object with params: AUTO-encoded
router.push({ name: 'user', params: { userId: '../../admin' } })
// Encodes to: /users/..%2F..%2Fadmin (safe)
```

React Router's `navigate()` always treats string paths the same way. Vue's object-vs-string distinction creates a specific vulnerability when `router.push(userInput)` receives a string.

### 4. Repeatable Params (Vue-specific)

Vue Router's `:param+` pattern has no React Router equivalent:
```typescript
// /docs/a/b/c -> chapters = ["a", "b", "c"]
// /docs/a     -> chapters = "a" (STRING, not array!)
```
The type inconsistency between single and multiple segments is a Vue-specific issue.

### 5. Hash Decoding Difference

| | Vue Router | React Router |
|--|-----------|-------------|
| Hash access | `route.hash` = decoded | `location.hash` = encoded |
| Hash in routing | Used by `createWebHashHistory()` | Used by `HashRouter` |

Vue decodes the hash (`decode(hash)` at line 1206), React preserves it encoded.

## Encoding Matrix

| Input | Vue `route.params.X` | Vue `route.path` | React `useParams().X` | React `location.pathname` |
|-------|---------------------|------------------|-----------------------|--------------------------|
| `/test` | `"test"` | `/users/test` | `"test"` | `/users/test` |
| `/..%2Fadmin` | `"../admin"` | `/users/..%2Fadmin` | `"../admin"` | `/users/..%2Fadmin` |
| `/..%2F..%2Fadmin` | `"../../admin"` | `/users/..%2F..%2Fadmin` | `"../../admin"` | `/users/..%2F..%2Fadmin` |
| `/hello%20world` | `"hello world"` | `/users/hello%20world` | `"hello world"` | `/users/hello%20world` |
| `/..%252F..%252F` | `"..%2F..%2F"` | `/users/..%252F..%252F` | `"..%2F..%2F"` | `/users/..%252F..%252F` |
| `/%2e%2e%2f` | `"../"` | `/users/%2e%2e%2f` | `"../"` | `/users/%2e%2e%2f` |

**Result: Encoding behavior is identical for standard cases.** Both frameworks use `decodeURIComponent()`.

## Framework-Specific Attack Surfaces

### Vue-Only Vectors
1. `v-html` directive as XSS sink (equivalent to `dangerouslySetInnerHTML`)
2. `router.push(stringInput)` encoding asymmetry
3. Catch-all array + `.join('/')` pattern
4. Repeatable param type confusion (string vs array)
5. Hash decoding mismatch (Issue #2187)

### React-Only Vectors
1. `dangerouslySetInnerHTML` as XSS sink
2. Catch-all `*` returns string (simpler exploitation)
3. Double-decode bug (React Router Issue #10814, historical)
4. `useLocation().pathname.split('/')` patterns

### Shared Vectors
1. `fetch(\`/api/${param}\`)` with decoded params
2. `axios.get()` with decoded params
3. Query params in fetch URLs
4. Open redirect via `navigate()`/`router.push()`
