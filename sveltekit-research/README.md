# SvelteKit CSPT Research

Empirical analysis of Client-Side Path Traversal attack surface in SvelteKit v2.53.4 (Svelte 5.53.7).

## Key Takeaways

### 1. decode_pathname is the Critical Function

SvelteKit's entire decoding pipeline centers on `decode_pathname()` in `src/utils/url.js`:

```javascript
export function decode_pathname(pathname) {
    return pathname.split('%25').map(decodeURI).join('%25');
}
```

This function applies `decodeURI()` (NOT `decodeURIComponent()`) to the pathname, but preserves literal `%25` (encoded `%`) to prevent double-decoding. Parameters are then further decoded with `decodeURIComponent()` via `decode_params()`.

### 2. Historical Double-Decode Bug (Issue #3069)

In versions before v1.0.0-next.385, the `parse()` method decoded the URL, then the route manifest's regex exec + param extraction called `decodeURIComponent()` again. This created a double-decode vulnerability where `%252f` would first decode to `%2f`, then to `/`, enabling path traversal. **Fixed** by introducing `decode_pathname()` which preserves `%25`.

### 3. CVE-2025-67647: decode_pathname vs url.pathname Discrepancy (SSRF)

Server-side, `respond.js` computes `resolved_path = decode_pathname(resolved_path)` (line 246), while `url.pathname` stays browser-encoded. When the `reroute()` hook modifies the path, the condition `resolved_path !== decode_pathname(url.pathname)` (line 254) can become true, causing SvelteKit to fetch internal resources. This enables full-read SSRF on server-side load functions.

### 4. Three-Tier Attack Surface

| Tier | File Type | Risk | Example |
|------|-----------|------|---------|
| Universal load | `+page.ts` | CSPT (client + server) | `fetch(\`/api/files/${params.path}\`)` |
| Server load | `+page.server.ts` | SSRF | `fetch(\`http://internal/${params.dataId}\`)` |
| API endpoint | `+server.ts` | SSRF | `fetch(\`https://backend/${params.path}\`)` |

### 5. Catch-All Routes `[...path]` are Highest Risk

Unlike Vue Router (which returns an array), SvelteKit catch-all params return a **string** with slashes preserved. This means `params.path` in `/files/[...path]` already contains `/` characters, making path traversal trivially easy when concatenated into fetch URLs.

### 6. `{@html}` is Svelte's innerHTML Equivalent

`{@html data.content}` renders raw HTML without sanitization. When combined with CSPT to redirect a fetch to attacker-controlled content, this creates a direct XSS chain.

### 7. Param Matchers as Defense

SvelteKit's `src/params/` directory allows defining matchers (e.g., `/^\d+$/`) that reject invalid params at the routing level. This is the strongest defense against CSPT but is opt-in and rarely used.

### 8. Full Route Dictionary Exposed in Client Bundle

The production build exposes the complete route dictionary in the client bundle entry point:
```javascript
const Pe = {
    "/": [3],
    "/about": [4],
    "/dashboard": [5, [2]],
    "/data/[dataId]": [-9],
    "/files/[...path]": [11],
    ...
};
```
This enables complete route enumeration from static analysis of the JavaScript bundle.

## Research Files

| File | Contents |
|------|----------|
| [01-route-definitions.md](01-route-definitions.md) | Route types, file conventions, build output |
| [02-source-to-sink.md](02-source-to-sink.md) | Sources, sinks, and data flow patterns |
| [03-encoding-behavior.md](03-encoding-behavior.md) | Full decoding pipeline with source references |
| [04-encoding-matrix.md](04-encoding-matrix.md) | Encoding test results and SvelteKit-specific quirks |
| [05-caido-patterns.md](05-caido-patterns.md) | Detection patterns for Caido proxy |
| [06-appendix.md](06-appendix.md) | Source references and lab structure |

## Lab App

Located at `/Users/jonathandunn/Desktop/ctbbp/sveltekit-cspt-lab/`

## Source Code Analyzed

- SvelteKit v2.53.4
- `@sveltejs/kit/src/utils/url.js` - `decode_pathname`, `decode_params`
- `@sveltejs/kit/src/utils/routing.js` - `parse_route_id`, `exec`, `find_route`
- `@sveltejs/kit/src/runtime/client/client.js` - Client-side router
- `@sveltejs/kit/src/runtime/server/respond.js` - Server-side routing + the CVE path
