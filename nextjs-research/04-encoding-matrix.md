# 04 - Encoding Matrix

## Next.js vs React Router: Key Differences

Next.js App Router has a fundamentally different encoding pipeline than React Router:

| Aspect | React Router | Next.js App Router |
|--------|-------------|-------------------|
| Param decoding | `decodeURIComponent` once | Decode then RE-ENCODE for client |
| `useParams()` returns | Decoded values | Re-encoded values (client) |
| Server params | N/A (client-side only) | Decoded values (vulnerable!) |
| Catch-all splitting | N/A (uses `*` splat) | Split on `/` then decode each |
| Route regex for `[param]` | `([^/]+)` | `([^/]+?)` (lazy) |
| Route regex for catch-all | `(.*)` | `(.+?)` (lazy, non-empty) |

## Encoding Matrix: Client Components (`useParams()`)

Since Next.js re-encodes params for client delivery, the standard `decodeURIComponent` behaviors from react-research/04-encoding-matrix.md apply to the SERVER-SIDE decoding step, but the CLIENT receives re-encoded values.

| Input in URL | Server Decodes To | Re-Encoded (Client Gets) | In `fetch()` URL |
|-------------|-------------------|--------------------------|------------------|
| `%2F` | `/` | `%2F` | `%2F` (encoded slash) |
| `%2E%2E%2F` | `../` | `..%2F` | `..%2F` (safe) |
| `%252F` | `%2F` | `%252F` | `%252F` (double-encoded) |
| `%20` | ` ` | `%20` | `%20` (space) |
| `%00` | `\0` | `%00` | `%00` (null) |
| `%23` | `#` | `%23` | `%23` (hash) |
| `%3F` | `?` | `%3F` | `%3F` (question) |
| `hello%2Fworld` | `hello/world` | `hello%2Fworld` | `hello%2Fworld` |

**Key takeaway:** Client-side CSPT via `useParams()` is significantly harder in Next.js than React Router because of the re-encoding step.

## Encoding Matrix: Page/Layout Server Components (`await params`)

**CORRECTION (lab-confirmed on Next.js 15.5.12):** Page/layout server components receive RE-ENCODED values via `getParamValue()`, NOT decoded values. They behave the same as client `useParams()`.

| Input in URL | Page `params` Value | Used in `fetch()` | Direct Traversal? |
|-------------|---------------------|-------------------|-------------------|
| `..%2F..%2Fadmin` | `..%2F..%2Fadmin` (re-encoded) | `http://host/api/..%2F..%2Fadmin` | **NO** (re-encoded) |
| `thepath%2Fbooya` | `thepath%2Fbooya` (re-encoded) | Sends `%2F` encoded | **NO** (re-encoded) |
| `%252F` | `%252F` (re-encoded) | Literal `%252F` | No |
| Normal text | Normal text | Normal | No |

**However**, if the fetch target is an API route handler, the handler decodes `%2F` → `/`, enabling traversal via indirection.

## Encoding Matrix: Route Handlers (`await params`)

Route handlers receive DECODED values directly from `getRouteMatcher()`. This is the primary server-side attack surface.

| Input in URL | Route Handler `params` Value | Used in `fetch()` | Traversal? |
|-------------|------------------------------|-------------------|-----------|
| `..%2F..%2Fadmin` | `../../admin` | `http://host/api/../../admin` | **YES** |
| `thepath%2Fbooya` | `thepath/booya` | Sends decoded `/` | **YES** |
| `..%2F..%2F..%2Fetc%2Fpasswd` | `../../../etc/passwd` | Path traversal | **YES** |
| `%2e%2e%2f` | `../` | Traversal | **YES** |
| `%252F` | `%2F` | Literal `%2F` in path | No |
| `%252e%252e%252f` | `%2e%2e%2f` | Literal `%2e%2e%2f` | No |
| Normal text | Normal text | Normal | No |

## Encoding Matrix: Catch-All Routes

### Page Server Component Catch-All (`await params`) — RE-ENCODED

| URL Path | Page `params.path` Array | `join('/')` Result |
|----------|-------------------------|--------------------|
| `/files/a/b/c` | `["a","b","c"]` | `a/b/c` |
| `/files/..%2Fetc/passwd` | `["..%2Fetc","passwd"]` | `..%2Fetc/passwd` (safe) |
| `/files/thepath%2Fbooya` | `["thepath%2Fbooya"]` | `thepath%2Fbooya` (lab-confirmed) |
| `/files/../etc/passwd` | `["..","etc","passwd"]` | `../etc/passwd` (**traversal**) |

**Lab-confirmed:** Page components get re-encoded catch-all params, same as client.

### Route Handler Catch-All (`await params`) — DECODED

| URL Path | Handler `params.path` Array | `join('/')` Result |
|----------|----------------------------|--------------------|
| `/files/a/b/c` | `["a","b","c"]` | `a/b/c` |
| `/files/..%2Fetc/passwd` | `["../etc","passwd"]` | `../etc/passwd` (**traversal**) |
| `/files/thepath%2Fbooya` | `["thepath/booya"]` | `thepath/booya` (lab-confirmed, decoded) |
| `/files/../etc/passwd` | `["..","etc","passwd"]` | `../etc/passwd` (**traversal**) |
| `/files/a%2Fb/c` | `["a/b","c"]` | `a/b/c` (slash in first element) |

**Note:** `%2F` in a catch-all URL segment gets decoded to `/` by `split('/').map(decode)`. But the split happens BEFORE decode, so `a%2Fb` stays as one array element that decodes to `a/b`. Then `join('/')` would produce `a/b/c` which looks the same as if it were two elements.

### Client Component Catch-All (`useParams()`)

| URL Path | `useParams().path` Array | `join('/')` Result |
|----------|-------------------------|--------------------|
| `/files/a/b/c` | `["a","b","c"]` | `a/b/c` |
| `/files/..%2Fetc/passwd` | `["..%2Fetc","passwd"]` | `..%2Fetc/passwd` (safe) |
| `/files/../etc/passwd` | `["..","etc","passwd"]` | `../etc/passwd` (**traversal**) |

**Critical:** Literal `..` segments (without encoding) in the URL DO create traversal even in client components! The path `/files/../etc/passwd` has literal `..` which the server treats as real path segments.

But the browser typically normalizes `../` before sending the request, so `/files/../etc/passwd` would be sent as `/etc/passwd` which won't match the `/files/` route. This is browser-level protection.

## Encoding Matrix: `useSearchParams()`

Standard browser `URLSearchParams` behavior -- single decode only.

| Query String | `searchParams.get('q')` | Notes |
|-------------|------------------------|-------|
| `?q=hello%2Fworld` | `hello/world` | Standard decode |
| `?q=..%2F..%2Fadmin` | `../../admin` | Decoded -- CSPT risk |
| `?q=%252F` | `%2F` | Single decode only |
| `?q=%252e%252e%252f` | `%2e%2e%2f` | Double-encoded stays |

**CSPT via searchParams is viable** because the browser does standard single-decode.

## Encoding Matrix: `window.location.hash`

Hash is never sent to the server. The browser provides it raw.

| URL Hash | `location.hash.slice(1)` | Notes |
|----------|--------------------------|-------|
| `#../../admin` | `../../admin` | Raw traversal |
| `#..%2F..%2F` | `..%2F..%2F` | Percent-encoded preserved |
| `#%2e%2e%2f` | `%2e%2e%2f` | Not decoded |

**Hash-based CSPT uses literal `../` directly** -- no encoding needed.

## Special Encoding Behaviors

### Overlong UTF-8

`decodeURIComponent` rejects overlong UTF-8 sequences (e.g., `%C0%AF` for `/`). This is standard JavaScript behavior and applies equally to Next.js and React Router.

### Unicode Normalization

Next.js does NOT perform NFKC normalization on params. Unicode homoglyphs like fullwidth characters (`%EF%BC%8F` for `/`) are NOT normalized to ASCII equivalents.

### Null Bytes

`%00` decodes to `\0` in params. This may be significant for some backend APIs that use null-terminated strings (C-based servers, PHP).

### Double Decoding

Next.js does NOT double-decode. `%252F` becomes `%2F` after one decode. A second decode would require application code to explicitly call `decodeURIComponent()` again.

## Attack Surface Summary by Encoding Strategy

| Strategy | Client Components | Page Server Components | Route Handlers |
|----------|------------------|----------------------|----------------|
| `%2F` (encoded slash) | Blocked (re-encoded) | Blocked (re-encoded) | **Works (decoded)** |
| `..%2F` (encoded traversal) | Blocked (re-encoded) | Blocked (re-encoded) | **Works (decoded)** |
| `%252F` (double-encoded) | Shows as `%252F` | Shows as `%252F` | Shows as `%2F` |
| Literal `../` in catch-all | Browser normalizes | Browser normalizes | Browser normalizes |
| `#../../admin` (hash) | **Works** (no server) | N/A | N/A |
| `?q=../../admin` (query) | **Works** (standard decode) | N/A | N/A |

**Key correction:** Page server components behave identically to client components for encoding — both get re-encoded values. Only route handlers receive decoded params. The encoding differential is between page rendering and route handling, not between client and server.
