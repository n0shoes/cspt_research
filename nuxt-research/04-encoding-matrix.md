# 04 - Encoding Matrix

## Client-Side (Vue Router) Encoding Matrix

### Input: URL with Various Encodings -> route.params.id

| URL Path Segment | `route.params.id` | `route.path` | Traversal Works? |
|------------------|-------------------|--------------|-----------------|
| `hello` | `hello` | `/users/hello` | N/A |
| `..%2F..%2Fadmin` | `../../admin` | `/users/..%2F..%2Fadmin` | Yes -- decoded to literal `../` |
| `..%2f..%2fadmin` | `../../admin` | `/users/..%2f..%2fadmin` | Yes -- case insensitive |
| `..%252F..%252Fadmin` | `..%2F..%2Fadmin` | `/users/..%252F..%252Fadmin` | No -- single decode, still encoded |
| `..%252f..%252fadmin` | `..%2f..%2fadmin` | `/users/..%252f..%252fadmin` | No |
| `hello%20world` | `hello world` | `/users/hello%20world` | N/A |
| `%2e%2e%2f%2e%2e%2f` | `../../` | `/users/%2e%2e%2f%2e%2e%2f` | Yes -- dots + slashes decoded |
| `..%5C..%5Cadmin` | `..\\..\\admin` | `/users/..%5C..%5Cadmin` | Depends on backend |
| `%00null` | `\x00null` | `/users/%00null` | Null byte injection |
| `hello%23fragment` | `hello#fragment` | `/users/hello%23fragment` | Hash injection |

### Input: URL with Encoded Slash in Catch-All -> route.params.slug (Array)

| URL Path | `route.params.slug` | Joined | Notes |
|----------|---------------------|--------|-------|
| `/files/a/b/c` | `['a', 'b', 'c']` | `a/b/c` | Normal splitting |
| `/files/a%2Fb/c` | `['a/b', 'c']` | `a/b/c` | %2F decoded, becomes part of segment |
| `/files/..%2F..%2Fetc/passwd` | `['../../etc', 'passwd']` | `../../etc/passwd` | Traversal in first segment |
| `/files/..%2Fetc%2Fpasswd` | `['../etc/passwd']` | `../etc/passwd` | All in one segment |

### Input: Query Parameters -> route.query

| URL Query | `route.query.q` | Notes |
|-----------|-----------------|-------|
| `?q=hello` | `hello` | Normal |
| `?q=hello%20world` | `hello world` | Decoded |
| `?q=..%2F..%2Fadmin` | `../../admin` | Decoded -- traversal possible |
| `?q=hello+world` | `hello+world` | Plus NOT converted to space (Vue Router) |
| `?q=a%26b` | `a&b` | Ampersand decoded |

## Server-Side (H3) Encoding Matrix

### getRouterParam() WITHOUT decode option

| URL Path Segment | `getRouterParam(event, 'id')` | Traversal Works? |
|------------------|-------------------------------|-----------------|
| `hello` | `hello` | N/A |
| `..%2F..%2Fadmin` | `..%2F..%2Fadmin` | No -- stays encoded |
| `%2e%2e%2f%2e%2e%2f` | `%2e%2e%2f%2e%2e%2f` | No -- stays encoded |
| `hello%20world` | `hello%20world` | N/A |

### getRouterParam() WITH { decode: true }

| URL Path Segment | `getRouterParam(event, 'id', {decode:true})` | Traversal Works? |
|------------------|---------------------------------------------|-----------------|
| `hello` | `hello` | N/A |
| `..%2F..%2Fadmin` | `../../admin` | Yes |
| `%2e%2e%2f%2e%2e%2f` | `../../` | Yes |
| `hello%20world` | `hello world` | N/A |
| `..%252F..%252Fadmin` | `..%2F..%2Fadmin` | No -- single decode |

### event.context.params (Raw from radix3)

Same as `getRouterParam()` without decode -- params come from the matched URL segments without transformation.

### Catch-All Server Routes (event.context.params._ or .path)

| URL | `event.context.params.path` | Notes |
|-----|---------------------------|-------|
| `/api/proxy/a/b/c` | `a/b/c` | Slashes are real path separators |
| `/api/proxy/..%2F..%2Finternal` | `..%2F..%2Finternal` | Stays encoded |
| `/api/proxy/../../../etc/passwd` | Route may not match | `..` resolved by HTTP client before reaching server |

## $fetch / ofetch Encoding Behavior

When `$fetch(url)` is called:

### Client-Side $fetch
- Calls browser `fetch()` API
- Browser resolves `../` sequences in the URL path
- `/api/users/../../admin` -> browser resolves to `/admin`
- Percent-encoded sequences are passed through to the server

### Server-Side $fetch (Nitro)
- Uses Node.js `http.request()` or `https.request()`
- `../` in the URL path is resolved by the HTTP client
- `http://internal/api/users/../../admin` -> requests `/admin` on the internal host

## useFetch Key Generation

Nuxt generates cache keys for `useFetch` based on the URL:

```javascript
const key = "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...])
```

The URL string (with decoded params interpolated) is part of the cache key hash. Different traversal paths that resolve to the same endpoint will have different cache keys, preventing cache-based detection.

## Island Payload Key Encoding

Island keys follow format: `${componentName}_${hash}` where hash is derived from props/context. The key is NOT URL-encoded when stored in `__NUXT__` payload -- it's a plain string that flows directly into `$fetch(`/__nuxt_island/${key}.json`)`.

No encoding/sanitization is applied to the key before URL construction.
