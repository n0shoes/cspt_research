# 03 - Encoding Behavior

## The Critical Difference: `decodeURI()` vs `decodeURIComponent()`

Astro uses `decodeURI()` throughout its routing pipeline. This is fundamentally different from frameworks like React Router that use `decodeURIComponent()`.

### What `decodeURI()` Does NOT Decode (RFC 3986 Reserved Characters)

These percent-encoded sequences are PRESERVED by `decodeURI()`:

| Encoded | Character | Preserved? |
|---|---|---|
| `%2F` | `/` | YES - stays `%2F` |
| `%3F` | `?` | YES - stays `%3F` |
| `%23` | `#` | YES - stays `%23` |
| `%26` | `&` | YES - stays `%26` |
| `%3D` | `=` | YES - stays `%3D` |
| `%2B` | `+` | YES - stays `%2B` |
| `%3A` | `:` | YES - stays `%3A` |
| `%3B` | `;` | YES - stays `%3B` |
| `%40` | `@` | YES - stays `%40` |
| `%5B` | `[` | YES - stays `%5B` |
| `%5D` | `]` | YES - stays `%5D` |

### What `decodeURI()` DOES Decode (Unreserved Characters)

| Encoded | Character | Decoded? |
|---|---|---|
| `%61` | `a` | YES - becomes `a` |
| `%41` | `A` | YES - becomes `A` |
| `%2E` | `.` | YES - becomes `.` |
| `%2D` | `-` | YES - becomes `-` |
| `%5F` | `_` | YES - becomes `_` |
| `%7E` | `~` | YES - becomes `~` |
| `%30`-`%39` | `0`-`9` | YES - becomes digit |
| `%20` | space | YES - becomes space |

### Comparison with `decodeURIComponent()` (React Router)

| Input | `decodeURI()` (Astro) | `decodeURIComponent()` (React) |
|---|---|---|
| `%2F` | `%2F` (preserved) | `/` (decoded) |
| `%3F` | `%3F` (preserved) | `?` (decoded) |
| `%23` | `%23` (preserved) | `#` (decoded) |
| `%2E` | `.` (decoded) | `.` (decoded) |
| `%61` | `a` (decoded) | `a` (decoded) |
| `hello%20world` | `hello world` | `hello world` |
| `..%2F..%2F` | `..%2F..%2F` | `../../` |

## Empirical Browser Test Results (Astro 5.18.0, Node adapter, Chrome)

**These results CONFIRM the source-code analysis above.**

### Single `[param]` Route

| URL | `Astro.params.testParam` | `Astro.url.pathname` | Exploitable? |
|-----|-------------------------|---------------------|-------------|
| `/encoding-test/hello` | `hello` | `/encoding-test/hello` | Baseline |
| `/encoding-test/hello%2Fworld` | `hello%2Fworld` | `/encoding-test/hello%2Fworld` | **NO — `%2F` preserved** |
| `/encoding-test/%2E%2E%2Fapi%2Fadmin` | `..%2Fapi%2Fadmin` | `/encoding-test/..%2Fapi%2Fadmin` | **Partial — dots decoded, slashes preserved** |

### Catch-all `[...segments]` Route

| URL | `Astro.params.segments` | Notes |
|-----|------------------------|-------|
| `/encoding-catchall/a/b/c` | `a/b/c` (string with slashes) | Catch-all captures literal slashes |

### Middleware Bypass Test (CVE-2025-64765)

| URL | Middleware check | Result |
|-----|-----------------|--------|
| `/admin` | `pathname.startsWith('/admin')` = true | **403 Forbidden** |
| `/%61dmin` | Decoded to `/admin` by fixed middleware | **403 Forbidden** (patched) |

**Key confirmations:**
1. `decodeURI()` preserves `%2F` — slash-based traversal fails in `[param]` routes
2. Dots DO decode (`%2E` → `.`) — mixed result: `..%2Fapi%2Fadmin` has decoded dots but encoded slashes
3. CVE-2025-64765 is patched in Astro 5.18 — `%61dmin` is decoded before middleware checks
4. Catch-all routes return strings (not arrays), slashes included

## Full Decoding Pipeline

### Step 1: Node.js HTTP Server Receives Request

The Node.js `http` module provides `req.url` with the raw URL path. Percent-encoding is preserved as-is from the HTTP request line.

### Step 2: Standalone Handler Validation

`@astrojs/node/dist/standalone.js:32`:
```javascript
try {
  decodeURI(req.url);  // Validates URL is decodable
} catch {
  res.writeHead(400);
  res.end("Bad request.");
  return;
}
```

This only validates -- the result is discarded. The raw `req.url` is passed forward.

### Step 3: App.match() - Route Matching

`astro/dist/core/app/index.js:215`:
```javascript
match(request) {
  const url = new URL(request.url);
  let pathname = prependForwardSlash(this.removeBase(url.pathname));
  try {
    pathname = validateAndDecodePathname(pathname);
  } catch {
    return void 0;
  }
  let routeData = matchRoute(pathname, this.#manifestData);
  return routeData;
}
```

`validateAndDecodePathname()` at `astro/dist/core/util/pathname.js:1`:
```javascript
function validateAndDecodePathname(pathname) {
  let decoded;
  try {
    decoded = decodeURI(pathname);
  } catch (_e) {
    throw new Error("Invalid URL encoding");
  }
  const hasDecoding = decoded !== pathname;
  const decodedStillHasEncoding = /%[0-9a-fA-F]{2}/.test(decoded);
  if (hasDecoding && decodedStillHasEncoding) {
    throw new Error("Multi-level URL encoding is not allowed");
  }
  return decoded;
}
```

**This is the double-encode defense.** After one round of `decodeURI()`, if any `%XX` sequences remain AND the string changed, the request is rejected.

Key insight: `%2F` after `decodeURI()` stays as `%2F`. If the original had `%2F` (which doesn't change), then `hasDecoding` is false for that character. But if other characters changed AND `%2F` remains, the request is blocked.

### Step 4: getParams() - Parameter Extraction

`astro/dist/core/render/params-and-props.js:37`:
```javascript
function getParams(route, pathname) {
  const paramsMatch = route.pattern.exec(pathname);
  // pathname is the decoded result from step 3
  route.params.forEach((key, i) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i + 1];
    } else {
      params[key] = paramsMatch[i + 1];
    }
  });
  return params;
}
```

Params are captured from the decoded pathname via regex groups. No additional encoding/decoding happens.

### Step 5: RenderContext URL Normalization

`astro/dist/core/render-context.js:55`:
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

This creates `Astro.url`. Note the fallback: if `validateAndDecodePathname` fails (e.g., double-encoded), it falls back to plain `decodeURI()`.

### Step 6: Middleware Execution

Middleware runs BEFORE route rendering but AFTER route matching. The `context.url` is the normalized URL from Step 5. However, the critical vulnerability (CVE-2025-64765) arises because middleware checks the pathname value which may differ from what the route matcher eventually resolves.

## CVE-2025-64765: Middleware Bypass via Encoded Letters

### The Vulnerability

```typescript
// Middleware
if (context.url.pathname.startsWith('/admin')) {
  return new Response('Forbidden', { status: 403 });
}
```

### The Attack

```
GET /%61dmin HTTP/1.1

Step 1: new URL().pathname = '/%61dmin'  (raw)
Step 2: decodeURI('/%61dmin') = '/admin'  (decoded)
Step 3: Route pattern ^\/admin\/?$ matches '/admin'
Step 4: Page renders

But middleware checked: '/%61dmin'.startsWith('/admin') = false
-> Middleware BYPASSED
```

### Why It Works

The key is timing. In some code paths, middleware receives the URL before full normalization. The `%61` is not decoded in the raw `url.pathname` that middleware checks, but `decodeURI()` decodes it to `a` during route matching.

### Double-Encode Bypass of Fix (GHSA-whqg-ppgf-wp8c)

After the initial fix normalized the pathname before middleware:
```
GET /%2561dmin HTTP/1.1

Step 1: decodeURI('%2561dmin') = '%61dmin'  (one level decoded)
Step 2: Middleware checks: '%61dmin'.startsWith('/admin') = false -> PASS
Step 3: '%61dmin' still contains %61
Step 4: Some code paths do another decode: decodeURI('%61dmin') = 'admin'
```

This was blocked by `validateAndDecodePathname()` which now rejects multi-level encoding.

## SSG vs SSR Encoding Handling

### SSG Mode

```javascript
// getStaticPaths returns developer-defined strings
export function getStaticPaths() {
  return [{ params: { userId: '123' } }];
}
// userId = '123' always -- no URL decoding involved
```

### SSR Mode

```javascript
// URL: /users/hello%20world
// After decodeURI: /users/hello world
// Regex exec: params.userId = 'hello world'
```

User controls the value entirely.

## Catch-All Param Behavior

### `[...path]` Route

Pattern: `^\\/files(?:\\/(.*?))?\\/?$`

The `(.*?)` group matches everything including literal `/` characters:

```
URL: /files/a/b/c
decodeURI: /files/a/b/c
Regex match: params.path = 'a/b/c'  (string, not array!)
```

This is why catch-all routes are the highest-risk pattern in Astro -- the param directly contains path separators.

## Node Adapter `%2F` Handling

Node.js behavior with `%2F` in URLs varies by version:

- **Node.js < 18**: `%2F` in URL path was sometimes decoded by the HTTP parser
- **Node.js >= 18**: `%2F` preserved in `req.url` by default

Since Astro's `decodeURI()` also preserves `%2F`, the combination means `%2F` stays encoded through the entire pipeline. This is a **defense** against `/`-based traversal in `[param]` routes, but catch-all `[...param]` routes are still vulnerable because they match literal `/` characters.

## Recommended Defense

After one round of `decodeURI()`, if any `%XX` sequences remain, return 400:
```javascript
const decoded = decodeURI(pathname);
if (/%[0-9a-fA-F]{2}/.test(decoded)) {
  return new Response('Bad Request', { status: 400 });
}
```

This is more aggressive than Astro's current defense which only blocks when BOTH conditions are true (something changed AND encoding remains). The stricter check prevents all partially-encoded attacks.
