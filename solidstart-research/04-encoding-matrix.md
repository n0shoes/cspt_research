# 04 - Encoding Matrix

## Key Difference from React Router

React Router calls `decodeURIComponent` (via `safelyDecodeURIComponent`) on every matched param. `@solidjs/router` does NOT. This fundamentally changes the encoding matrix.

For `@solidjs/router`, the question is: **what does the browser deliver in `window.location.pathname`**, since the router passes it through unmodified?

## Browser Behavior (Applies to All Frameworks)

The browser itself performs normalization on URLs before they reach JavaScript:

| Input in Address Bar | `window.location.pathname` | Notes |
|---|---|---|
| `/test/../admin` | `/admin` | Browser resolves `..` |
| `/test/%2e%2e/admin` | `/test/%2e%2e/admin` | `%2e` NOT resolved |
| `/test/%2f%2e%2e%2f/admin` | `/test/%2F..%2F/admin` | `%2f` stays encoded |
| `/test/hello%2fworld` | `/test/hello%2fworld` | `%2f` stays encoded |

## @solidjs/router Param Extraction (No Decoding)

### Dynamic Param `:userId`

| URL Pathname | `params.userId` | In `fetch(\`/api/users/${params.userId}\`)` | Traversal? |
|---|---|---|---|
| `/users/123` | `123` | `/api/users/123` | No |
| `/users/..%2f..%2fadmin` | `..%2f..%2fadmin` | `/api/users/..%2f..%2fadmin` | **No** (encoded slashes stay encoded) |
| `/users/%2e%2e%2f%2e%2e%2fadmin` | `%2e%2e%2f%2e%2e%2fadmin` | `/api/users/%2e%2e%2f%2e%2e%2fadmin` | **No** (double-encoded stays encoded) |
| `/users/..%252f..%252fadmin` | `..%252f..%252fadmin` | `/api/users/..%252f..%252fadmin` | **No** |
| `/users/hello` | `hello` | `/api/users/hello` | No |

**Single-segment params cannot traverse** because the router splits on `/` and a single segment never contains a real `/`.

### Catch-All Param `[...path]`

| URL Pathname | `params.path` | In `fetch(\`/api/files/${params.path}\`)` | Traversal? |
|---|---|---|---|
| `/files/a/b/c` | `a/b/c` | `/api/files/a/b/c` | No |
| `/files/../../admin` | Browser normalizes URL | N/A (browser removes `..`) | **No** (browser) |
| `/files/a/../../admin` | Browser normalizes to `/admin` | Route doesn't match `/files/*` | **No** (browser) |
| `/files/..%2f..%2fadmin` | `..%2f..%2fadmin` | `/api/files/..%2f..%2fadmin` | **No** (stays encoded) |

**Browser normalization protects against literal `..` in URL paths.** Encoded `..` (`%2e%2e`) stays encoded because the router does not decode.

### Search Params (Auto-Decoded by URLSearchParams)

| Query String | `searchParams.source` | In `fetch(\`/api/stats?source=${source}\`)` | Traversal? |
|---|---|---|---|
| `?source=normal` | `normal` | `/api/stats?source=normal` | No |
| `?source=..%2f..%2fadmin` | `../../admin` | `/api/stats?source=../../admin` | **YES** (in query param) |
| `?source=%2e%2e%2f%2e%2e%2fadmin` | `../../admin` | `/api/stats?source=../../admin` | **YES** |
| `?source=..%252fadmin` | `..%2fadmin` | `/api/stats?source=..%2fadmin` | **Partial** (single decode) |

**Search params are the primary CSPT vector** in SolidStart because `URLSearchParams` auto-decodes.

### Server Function Arguments

| Client param value | Serialized (seroval) | Server receives | Server-side traversal? |
|---|---|---|---|
| `"123"` | `"123"` in JSON | `"123"` | No |
| `"../../admin"` | `"../../admin"` in JSON | `"../../admin"` | **YES** |
| `"..%2f..%2fadmin"` | `"..%2f..%2fadmin"` in JSON | `"..%2f..%2fadmin"` | **No** (still encoded) |

Server functions receive the exact string value from the client. If the param was already decoded (e.g., from search params), the traversal string passes through unchanged.

## Comparison Matrix: React Router vs @solidjs/router

| Input | React Router `useParams().id` | Solid `useParams().id` | Winner (safer) |
|---|---|---|---|
| `%2e%2e%2fadmin` | `../admin` (decoded!) | `%2e%2e%2fadmin` (raw) | **Solid** |
| `..%2fadmin` | `../admin` (decoded!) | `..%2fadmin` (raw) | **Solid** |
| `hello%20world` | `hello world` | `hello%20world` | Neither (different behavior) |
| `%252e%252e` | `%2e%2e` (single decode) | `%252e%252e` (raw) | **Solid** |

| Input | React Router `useSearchParams().get("x")` | Solid `useSearchParams()[0].x` | Winner |
|---|---|---|---|
| `?x=%2e%2e%2fadmin` | `../admin` | `../admin` | **Tie** (both use URLSearchParams) |

## Encoding Patterns by Attack Vector

### Patterns That DO Work Against SolidStart

1. **Search param CSPT:**
   ```
   /dashboard/stats?source=../../admin/secrets
   /dashboard/settings?endpoint=../../internal/config
   ```

2. **Catch-all with natural slashes (if attacker controls link):**
   ```html
   <a href="/files/legitimate/../../../admin">Click</a>
   ```
   Browser normalizes to `/admin` -- route may not match. Limited viability.

3. **Server function param passthrough:**
   ```
   /data/../../admin  (if catch-all route)
   ```
   The value arrives on server unchanged.

### Patterns That DO NOT Work Against SolidStart

1. **Encoded path traversal in single-segment params:**
   ```
   /users/..%2f..%2fadmin  -> params.userId = "..%2f..%2fadmin" (stays encoded)
   ```

2. **Tab-encoded traversal:**
   ```
   /users/.%09.%2f.%09.%2fadmin -> split produces multiple segments, won't match :userId
   ```

3. **Backslash traversal:**
   ```
   /users/%5c..%5c..%5cadmin -> params.userId = "%5c..%5c..%5cadmin" (stays encoded)
   ```

4. **Double-encoded:**
   ```
   /users/..%252f..%252fadmin -> params.userId = "..%252f..%252fadmin" (stays encoded)
   ```

## Risk Summary

| Vector | Risk in React Router | Risk in SolidStart | Delta |
|---|---|---|---|
| Encoded param traversal | HIGH | **LOW** | Solid safer (no decode) |
| Catch-all traversal | HIGH | **MEDIUM** | Solid somewhat safer |
| Search param traversal | HIGH | **HIGH** | Same risk |
| Server function passthrough | N/A (no equivalent) | **HIGH** | SolidStart-specific risk |
| innerHTML XSS chain | MEDIUM (dangerouslySetInnerHTML verbose) | **HIGH** (innerHTML is short, native) | Solid riskier |
