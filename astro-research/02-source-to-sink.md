# 02 - Source to Sink Analysis

## Sources (User-Controlled Input)

### Source 1: `Astro.params` (SSR Pages)

Extracted in `getParams()` at `astro/dist/core/render/params-and-props.js:37`:
```javascript
function getParams(route, pathname) {
  const paramsMatch = route.pattern.exec(pathname);
  // pathname is already decodeURI()'d at this point
  route.params.forEach((key, i) => {
    params[key] = paramsMatch[i + 1];
  });
  return params;
}
```

The pathname fed to `getParams()` has been decoded via `validateAndDecodePathname()` which calls `decodeURI()`.

**Risk**: Params contain decoded characters. Catch-all params contain literal slashes.

### Source 2: `Astro.url`

Created in `RenderContext.#createNormalizedUrl()` at `astro/dist/core/render-context.js:55`:
```javascript
static #createNormalizedUrl(requestUrl) {
  const url = new URL(requestUrl);
  try {
    url.pathname = validateAndDecodePathname(url.pathname);
  } catch {
    try {
      url.pathname = decodeURI(url.pathname);
    } catch {}
  }
  return url;
}
```

**Properties available**:
- `Astro.url.pathname` - Decoded pathname
- `Astro.url.searchParams` - Query parameters
- `Astro.url.href` - Full URL

### Source 3: API Route `params`

For API routes (`pages/api/*.ts`), params are provided via the same `getParams()` pipeline:
```typescript
export const GET: APIRoute = async ({ params }) => {
  const { id } = params; // Same decodeURI()'d values
};
```

### Source 4: `context.url.pathname` (Middleware)

In middleware, `context.url.pathname` comes from the raw request URL parsed via `new URL()`. This is the vector for CVE-2025-64765: the middleware sees the raw pathname BEFORE route-level decoding applies.

### Source 5: Request Headers

`x-forwarded-host`, `x-forwarded-proto`, `x-forwarded-port` -- used in domain-based i18n routing. Validated against `allowedDomains` in v5.18+ but previously exploitable (CVE-2026-25545).

## Sinks (Dangerous Operations)

### Sink 1: `fetch()` in Frontmatter (Server-Side)

Astro frontmatter runs on the server. Any `fetch()` call with user-controlled params is a direct SSRF vector:

```astro
---
const { userId } = Astro.params;
// SSRF: userId controls the URL
const res = await fetch(`https://api.example.com/users/${userId}`);
---
```

**Severity**: High (SSRF)
**Exploitation**: `[param]` routes require non-slash characters; `[...param]` catch-all routes allow full path traversal.

### Sink 2: `set:html` Directive

Astro's equivalent of `dangerouslySetInnerHTML`:

```astro
<div set:html={content} />
```

When combined with attacker-controlled response data (via CSPT/SSRF), this becomes an XSS vector:

```astro
---
const { path } = Astro.params; // catch-all
const res = await fetch(`https://internal/files/${path}`);
const content = await res.text();
---
<div set:html={content} />
```

**Severity**: Critical (XSS via SSRF response injection)

### Sink 3: API Route `fetch()` (Server-Side)

```typescript
export const GET: APIRoute = async ({ params }) => {
  const path = params.path;
  const res = await fetch(`https://backend.internal/${path}`);
  return new Response(await res.text());
};
```

**Severity**: Critical (Full SSRF proxy)

### Sink 4: API Route Response Construction

If the API returns the fetched data to the client, it creates a reflection:

```typescript
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  const res = await fetch(`https://api.internal/users/${id}`);
  return new Response(JSON.stringify(await res.json()), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### Sink 5: Internal Auth Header Forwarding

When frontmatter includes auth headers, SSRF escalates to authenticated SSRF:

```astro
---
const res = await fetch(`http://internal-api/${dataId}`, {
  headers: { 'X-Internal-Auth': import.meta.env.INTERNAL_KEY || '' }
});
---
```

## Attack Chains

### Chain 1: Catch-All + fetch + set:html = XSS

```
URL: /files/../../admin/evil-content
          |
          v
Astro.params.path = "../../admin/evil-content"
          |
          v
fetch(`https://internal/files/../../admin/evil-content`)
          |
          v
Response contains HTML/JS
          |
          v
<div set:html={response} />  -->  XSS
```

### Chain 2: API Proxy + Catch-All = Full SSRF

```
URL: /api/proxy/../../internal-service/admin
          |
          v
params.path = "../../internal-service/admin"
          |
          v
fetch(`https://backend.internal/../../internal-service/admin`)
          |
          v
Reaches internal service, response returned to attacker
```

### Chain 3: Middleware Bypass + Admin Access

```
URL: /%61dmin  (encoded 'a')
          |
          v
Middleware: context.url.pathname = '/%61dmin'
  -> startsWith('/admin') = false -> PASS
          |
          v
Route matching: decodeURI('/%61dmin') = '/admin'
  -> Matches /admin route
          |
          v
Admin page rendered without auth check
```

### Chain 4: Single-Param + fetch = Targeted SSRF

```
URL: /data/..%2f..%2f..%2fadmin%2fsecrets
          |
          v
Astro.params.dataId = "..%2F..%2F..%2Fadmin%2Fsecrets"
  (decodeURI preserves %2F!)
          |
          v
fetch(`http://internal-api/data/..%2F..%2F..%2Fadmin%2Fsecrets`)
  -> Server may resolve the traversal
```

Note: Whether this works depends on how the backend HTTP server handles `%2F` in paths. Some servers (nginx, Apache) decode and resolve it; others preserve it literally.

## Source-Sink Matrix

| Source | Sink | Risk | Notes |
|---|---|---|---|
| `Astro.params.[param]` | `fetch()` frontmatter | High | Single segment, no slashes |
| `Astro.params.[...param]` | `fetch()` frontmatter | Critical | Includes slashes |
| `Astro.params.[...param]` | `set:html` | Critical | XSS if fetch response rendered |
| API `params.[param]` | `fetch()` | High | Single segment |
| API `params.[...param]` | `fetch()` | Critical | Full path control |
| `context.url.pathname` | Middleware auth check | High | Encoded letter bypass |
| `Astro.url.searchParams` | Various | Medium | Query param injection |
| Request headers | URL construction | Medium | x-forwarded-host (mitigated in v5.18) |
