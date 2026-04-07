# 4. Encoding Matrix (Remix / React Router v7 Framework Mode)

## Shared Client-Side Pipeline

Remix/RR7 framework mode shares **100% of the client-side encoding behavior** with React Router. The complete encoding matrix is documented in [`react-research/04-encoding-matrix.md`](../react-research/04-encoding-matrix.md).

**All of the following apply identically:**
- Standard percent-encoding (`%2F`, `%2E`)
- Double encoding (`%252F`)
- Overlong UTF-8 (does NOT work)
- Unicode homoglyphs (does NOT work -- no NFKC normalization)
- Zero-width characters (pass through unchanged)
- BiDi characters (pass through unchanged)
- Case sensitivity of percent encoding (both upper/lower work)
- Invalid/malformed percent encoding (returned raw)
- Triple encoding (partial decode)
- Mixed encoding (works)
- Backslash handling (decoded but not path separator)
- Splat route encoding (identical to named params)

**Do not duplicate this analysis. Reference the React Router research.**

## REMIX-SPECIFIC Encoding Differences

### Difference 1: Server-Side Param Decoding in Loaders

Server-side loaders receive params through the same `matchPath()` pipeline. However, the server request URL may have different encoding than what the browser sends:

| Scenario | Browser Sends | Server Receives | Loader Params |
|----------|--------------|-----------------|---------------|
| Direct navigation | `/users/%2E%2E%2Fapi` | `/users/%2E%2E%2Fapi` | `../api` (decoded) |
| Client navigation | `.data` fetch via turbo-stream | `/users/%2E%2E%2Fapi.data` | `../api` (decoded) |
| Link click | Client-side routing (no server hit) | N/A (params decoded client-side) | `../api` (decoded) |
| Form submission | POST to `.data` | POST `/users/%2E%2E%2Fapi.data` | `../api` (decoded) |

**Key insight:** On initial page load (SSR), the server receives the raw URL from the browser. On subsequent navigations, the client-side router handles params locally (no server round-trip unless a loader exists). When a loader exists, the `.data` endpoint is hit.

### Difference 2: `.data` Endpoint URL Encoding

The `.data` endpoint URL is constructed by appending `.data` to the pathname:

```
Original URL:  /users/%2E%2E%2Fapi%2Fadmin
.data URL:     /users/%2E%2E%2Fapi%2Fadmin.data
```

Encoding is preserved in the `.data` URL -- the framework does not re-encode or decode before appending the extension. This means:
- CSPT traversal payloads survive into the `.data` request
- The server processes the same encoded path for both SSR and data requests

### Difference 3: Action FormData Encoding

Action requests carry both:
1. Path params (decoded via matchPath) -- CSPT source
2. Form data body (raw from request) -- attacker-controlled payload

```
POST /users/%2E%2E%2Fadmin.data
Content-Type: application/x-www-form-urlencoded

role=superadmin&email=attacker@evil.com
```

The form data is NOT encoded/decoded by React Router -- it passes through the standard `request.formData()` API. The CSPT attack is in the path, not the body. But the body provides the mutation payload.

### Difference 4: turbo-stream Response Encoding

Loader/action responses are encoded using turbo-stream, a streaming serialization format:

- Supports complex types (Date, Set, Map, Error, Promise)
- NOT plain JSON -- requires specific decoder
- Binary-safe
- Streaming (can send partial responses)

If a CSPT payload causes the loader to return unexpected data (e.g., from an internal endpoint), the turbo-stream encoding wraps whatever the loader returns. The client decoder then unwraps it and makes it available via `useLoaderData()`.

### Difference 5: Server-Side fetch() URL Resolution

When a loader constructs a URL with decoded params, Node.js `fetch()` resolves `../` paths:

| Loader Code | Effective Request |
|-------------|-------------------|
| `fetch(\`http://api.local/users/${params.userId}\`)` with `params.userId = "../admin"` | `GET http://api.local/admin` |
| `fetch(\`http://api.local/files/${params["*"]}\`)` with `params["*"] = "../../etc/passwd"` | `GET http://api.local/../etc/passwd` (may resolve to root) |
| `fetch("http://api.local/data/" + params.dataId)` with `params.dataId = "../../../169.254.169.254/latest/meta-data"` | Cloud metadata access |

**Node.js `fetch()` (undici) resolves relative paths in URLs**, making path traversal effective for SSRF.

## Encoding Decision Tree (Remix-Specific Extension)

```
Is the target route a Remix/RR7 framework-mode app?
  |
  YES -- check for loaders/actions in manifest
  |
  v
Does the route have hasLoader:true or hasAction:true?
  |
  YES
  |
  v
Does the loader/action use params in fetch URL? (check server bundle)
  |
  YES
  |
  v
Use standard traversal: %2E%2E%2F (../)
  |
  v
Server loader executes SSRF with decoded param
  |
  Impact: SSRF to internal services, cloud metadata
  |
  If action: CSPT2CSRF (also control request body)
```
