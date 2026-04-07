# 3. SvelteKit Encoding Behavior

## The Decoding Pipeline

SvelteKit's decoding happens in two stages across two functions in `src/utils/url.js`.

### Stage 1: decode_pathname() (line 50)

```javascript
export function decode_pathname(pathname) {
    return pathname.split('%25').map(decodeURI).join('%25');
}
```

**What this does:**
1. Split the pathname on literal `%25` (encoded `%`)
2. Apply `decodeURI()` to each segment
3. Rejoin with `%25`

**Why split on %25:**
This prevents double-decoding. Without this split, `%252f` would first become `%2f` (via decodeURI), then on a second pass `/`. By preserving `%25`, the second `%` stays encoded.

**decodeURI vs decodeURIComponent:**
- `decodeURI()` does NOT decode: `#`, `$`, `&`, `+`, `,`, `/`, `:`, `;`, `=`, `?`, `@`
- `decodeURIComponent()` decodes ALL of the above
- This means `%2f` (`/`) is NOT decoded by `decode_pathname()` but IS decoded by `decode_params()`

### Stage 2: decode_params() (line 55)

```javascript
export function decode_params(params) {
    for (const key in params) {
        // input has already been decoded by decodeURI
        // now handle the rest
        params[key] = decodeURIComponent(params[key]);
    }
    return params;
}
```

**What this does:**
After `decode_pathname()` has partially decoded the path and the route regex has extracted param values, `decode_params()` applies `decodeURIComponent()` to finish decoding each parameter value.

### Full Pipeline

```
Browser URL: /users/hello%20world%2Fslash
                        |
                        v
            decode_pathname()
            splits on %25, applies decodeURI()
            Result: /users/hello world%2Fslash
            Note: %2F NOT decoded (decodeURI preserves /)
                        |
                        v
            Route regex: /^\/users\/([^/]+?)\/?$/
            Captures: "hello world%2Fslash"
                        |
                        v
            decode_params()
            Applies decodeURIComponent()
            Result: params.userId = "hello world/slash"
            Note: %2F IS now decoded to /
```

### Critical Implication for CSPT

The two-stage decode means `%2f` in a URL path segment will be decoded to `/` in the final param value. For single-segment params `[param]`, this doesn't matter because the route regex `([^/]+?)` won't match a literal `/` in the URL. But the param value after `decode_params()` will contain the decoded `/`.

For catch-all params `[...rest]`, the regex `([^]*)` matches everything including `/`, so the param value naturally contains slashes.

## Client-Side vs Server-Side Decoding Differences

### Client-Side (client.js)

```javascript
// Line 1451-1457
function get_url_path(url) {
    return (
        decode_pathname(
            app.hash ? url.hash.replace(/^#/, '').replace(/[?#].+/, '')
                     : url.pathname.slice(base.length)
        ) || '/'
    );
}

// Line 1426
params: decode_params(params)
```

1. Extract pathname from `url.pathname` (or hash for hash routing)
2. `decode_pathname()` - partial decode
3. Route regex match
4. `decode_params()` - full decode

### Server-Side (respond.js)

```javascript
// Line 224
let resolved_path = url.pathname;

// Line 234-235 (reroute hook may modify)
resolved_path = (await options.hooks.reroute({ url: new URL(url), fetch: event.fetch }))
    ?? url.pathname;

// Line 246
resolved_path = decode_pathname(resolved_path);

// Line 313
const result = find_route(resolved_path, manifest._.routes, matchers);
```

1. Start with `url.pathname` from request
2. Pass through `reroute()` hook (may modify path)
3. `decode_pathname()` - partial decode
4. `find_route()` -> regex match -> `exec()` -> `decode_params()`

**Key difference:** Server-side has the `reroute()` hook between raw URL and `decode_pathname()`. This is where CVE-2025-67647 lives.

## Historical Double-Decode Bug (Issue #3069)

### The Vulnerability (pre-v1.0.0-next.385)

Before the fix, the decoding pipeline was:

```javascript
// OLD CODE (vulnerable)
const url = new URL(request.url);
const path = this.parse(url);  // First decode: URL constructor normalizes
// ... later in route matching:
const params = route.pattern.exec(path);  // Already decoded path
const decoded = decodeURIComponent(params[1]);  // Second decode!
```

**Attack:** `%252f` -> First decode -> `%2f` -> Second decode -> `/`

This enabled classic path traversal: `/users/%252e%252e%252fadmin` -> double-decode -> `/users/../admin`

### The Fix

`decode_pathname()` was introduced to handle decoding in one controlled step, splitting on `%25` to prevent the literal `%` from being consumed by a second decoding pass.

```javascript
// NEW CODE (fixed)
export function decode_pathname(pathname) {
    return pathname.split('%25').map(decodeURI).join('%25');
}
```

After `decode_pathname()`, `%252f` stays as `%2f` (the `%25` is preserved, so `25` stays, and the trailing `2f` is not a valid decode target on its own).

## CVE-2025-67647: decode_pathname vs url.pathname Discrepancy

### The Vulnerability

In `respond.js`, after the `reroute()` hook:

```javascript
// Line 246: decoded
resolved_path = decode_pathname(resolved_path);

// Line 254: compared against decoded url.pathname
resolved_path !== decode_pathname(url.pathname)
```

When `reroute()` returns a path that decodes differently than `url.pathname`, the condition becomes true. SvelteKit then attempts to serve a prerendered resource at `resolved_path`, which can point to internal resources.

### Attack Scenario

If a `reroute()` hook passes through a crafted path that, after `decode_pathname()`, resolves to an internal file path, the server will attempt to fetch and serve that resource.

### Impact

Full-read SSRF - attacker can read internal prerendered pages or trigger fetches to internal resources.

## Catch-All `[...path]` Behavior

### SvelteKit: String (not array)

```
URL: /files/a/b/c/d
params.path = "a/b/c/d"  // string with slashes
typeof params.path === "string"
```

### Vue Router: Array

```
URL: /files/a/b/c/d
route.params.path = ["a", "b", "c", "d"]  // array of segments
```

### Implication

SvelteKit's string-based catch-all is MORE dangerous for CSPT because:
1. Slashes are already present in the param value
2. Direct interpolation into fetch URLs preserves path structure
3. No need to `.join('/')` - traversal sequences work natively

```typescript
// SvelteKit: immediate traversal
fetch(`/api/files/${params.path}`)
// params.path = "../../../admin" -> fetch("/api/files/../../../admin")

// Vue: requires .join() first
fetch(`/api/files/${route.params.path.join('/')}`)
// Still traversable, but developer more likely to validate individual segments
```

## Param Matchers as Defense

### Definition (`src/params/integer.ts`)

```typescript
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
    return /^\d+$/.test(param);
};
```

### Usage in Route

```
src/routes/users/[userId=integer]/+page.svelte
```

### How Matchers Work in Routing

From `src/utils/routing.js`, `exec()` (line 174):

```javascript
if (!param.matcher || matchers[param.matcher](value)) {
    result[param.name] = value;
    continue;
}
// If matcher returns false, route does not match
return;
```

If the matcher rejects the value, the **entire route** fails to match. This is the strongest available defense because the traversal payload never reaches any load function.

### Limitations

- Matchers only validate individual param values, not the overall URL
- Catch-all `[...path]` matchers receive the full slash-delimited string
- Matchers must be explicitly opted into - no default validation
- Matchers run against the `decode_pathname()` output (partially decoded), NOT the fully `decodeURIComponent()` decoded value
