# 4. SvelteKit Encoding Matrix

SvelteKit uses `decode_pathname()` (splitting on `%25`, applying `decodeURI()`) followed by `decode_params()` (`decodeURIComponent()`). The fundamental encoding behavior of `decodeURIComponent()` is identical to React Router -- see `react-research/04-encoding-matrix.md` for the comprehensive matrix covering overlong UTF-8, Unicode homoglyphs, Unicode normalization, zero-width characters, and null bytes.

This document focuses on SvelteKit-specific differences and quirks.

## Key Difference: Two-Stage Decode

| Encoding | After `decode_pathname()` | After `decode_params()` | Net Result |
|----------|--------------------------|------------------------|------------|
| `%2f` (/) | `%2f` (preserved by decodeURI) | `/` (decoded) | Slash in param |
| `%2F` (/) | `%2F` (preserved by decodeURI) | `/` (decoded) | Slash in param |
| `%23` (#) | `%23` (preserved by decodeURI) | `#` (decoded) | Hash in param |
| `%3f` (?) | `%3f` (preserved by decodeURI) | `?` (decoded) | Question mark in param |
| `%3d` (=) | `%3d` (preserved by decodeURI) | `=` (decoded) | Equals in param |
| `%26` (&) | `%26` (preserved by decodeURI) | `&` (decoded) | Ampersand in param |
| `%40` (@) | `%40` (preserved by decodeURI) | `@` (decoded) | At sign in param |
| `%2e` (.) | `.` (decoded by decodeURI) | `.` (already decoded) | Dot in param |
| `%20` (space) | ` ` (decoded by decodeURI) | ` ` (already decoded) | Space in param |
| `%252f` | `%2f` (split preserves %25) | `/` (second stage decodes) | **Slash in param** |
| `%2525` | `%25` (split preserves) | `%` (decoded) | Percent in param |

## The %252f Question (Double Encoding)

### React Router

`%252f` -> `decodePath()` catches URIError on malformed -> falls back to raw -> `%252f` stays as-is in param.

### SvelteKit

`%252f` -> `decode_pathname()` splits on `%25`:
- Before split: `%252f`
- Split result: `["", "2f"]`
- decodeURI each: `["", "2f"]`
- Rejoin: `%252f` -> actually `%2f` after the split/rejoin

Wait -- let's trace more carefully:
- Input: `%252f`
- Split on `%25`: `["", "2f"]`
- `decodeURI("")` -> `""`
- `decodeURI("2f")` -> `"2f"` (not a valid percent-encoded sequence by itself)
- Join with `%25`: `"%252f"`

So `%252f` is preserved through `decode_pathname()`. Then `decode_params()` applies `decodeURIComponent("%252f")` = `"%2f"`. The final param value is the string `%2f` -- NOT a slash.

**Conclusion:** Double encoding does NOT result in traversal. The `%25` preservation in `decode_pathname()` is specifically designed to prevent this.

## Route Regex vs Encoding

### Single Param `[param]`

Route regex: `([^/]+?)` -- does NOT match `/`

| URL | Route Match? | Why |
|-----|-------------|-----|
| `/users/normal` | YES | Single segment |
| `/users/hello%20world` | YES | Space decoded, still one segment |
| `/users/..%2f..%2fadmin` | YES | `%2f` NOT decoded by decode_pathname, stays as one segment |
| `/users/../admin` | NO | Literal `/` creates multiple segments, regex fails |
| `/users/%2e%2e%2fadmin` | YES* | `.` decoded but `%2f` stays, single segment matched |

*The param value after `decode_params()` would be `../admin` (with decoded slash), but the route regex already matched on the partially-decoded path.

### Catch-All `[...rest]`

Route regex: `([^]*)` -- matches EVERYTHING

| URL | Route Match? | Param Value |
|-----|-------------|-------------|
| `/files/a/b/c` | YES | `a/b/c` |
| `/files/..%2f..%2fadmin` | YES | `../admin` (after decode_params) |
| `/files/../../../etc/passwd` | YES* | `../../../etc/passwd` |

*Browser may normalize `/../` before sending request, but if the URL reaches SvelteKit, the catch-all matches.

## Server vs Client Encoding Differences

### Server-Side (SSR / +page.server.ts)

The server receives the raw HTTP request URL. The `URL` constructor normalizes percent-encoding but does NOT decode path segments. Then `decode_pathname()` + `decode_params()` runs.

**Important:** On the server, `fetch()` with relative URLs is handled by SvelteKit's custom `create_fetch()` (in `src/runtime/server/fetch.js`). This fetch:
1. Normalizes the URL against `event.url`
2. Applies `decodeURIComponent(url.pathname)` (line 58)
3. Checks if it's a same-origin request

This means server-side fetch applies an ADDITIONAL `decodeURIComponent()` to the pathname. If the load function does `fetch(\`/api/files/${params.path}\`)`, and `params.path` contains `%2f`, the server fetch will decode it to `/`.

### Client-Side (Browser Navigation)

On client-side navigation, `fetch()` is the browser's native fetch. The browser handles URL encoding/decoding per its own rules. Notably:
- Browsers normalize `/../` in URLs
- `%2f` in fetch URLs is sent as-is to the server
- The server then decides how to handle `%2f`

## SvelteKit-Unique Encoding Quirks

### 1. Hash Routing Mode

When `kit.router.type = 'hash'`, paths come from `url.hash`:

```javascript
function get_url_path(url) {
    return decode_pathname(
        app.hash ? url.hash.replace(/^#/, '').replace(/[?#].+/, '')
                 : url.pathname.slice(base.length)
    ) || '/';
}
```

Hash values are NOT percent-encoded by the browser in the same way as pathnames. This could create different encoding behavior.

### 2. Escape Function in Routing

The `escape()` function in `routing.js` (line 212) normalizes route segment literals:

```javascript
function escape(str) {
    return str
        .normalize()           // NFC normalization on literal segments!
        .replace(/[[\]]/g, '\\$&')
        .replace(/%/g, '%25')
        .replace(/\//g, '%2[Ff]')
        .replace(/\?/g, '%3[Ff]')
        .replace(/#/g, '%23')
        .replace(/[.*+?^${}()|\\]/g, '\\$&');
}
```

Note: `.normalize()` is called on LITERAL route segments (e.g., the word "users" in `/users/[id]`), NOT on parameter values. This means route matching is Unicode-normalized for fixed segments but NOT for dynamic params.

### 3. Server-Side Fetch URL Decoding

In `src/runtime/server/fetch.js` (line 58):

```javascript
const decoded = decodeURIComponent(url.pathname);
```

Server-side fetch applies `decodeURIComponent()` to the entire pathname before checking if it's a same-origin asset request. This is a third decoding step beyond `decode_pathname()` and `decode_params()`.
