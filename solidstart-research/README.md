# SolidStart / @solidjs/router CSPT Research

Empirical analysis of Client-Side Path Traversal attack surfaces in SolidStart applications using `@solidjs/router` v0.15.x and `@solidjs/start` v1.3.x.

## Key Takeaways

1. **No `decodeURIComponent` on route params.** Unlike React Router, `@solidjs/router` does NOT decode URL segments before storing them in `params`. The router's `createMatcher()` (in `utils.js`) compares raw URL segments directly -- `locSegments[i]` is used as-is from `location.pathname.split("/")`. This means `%2f` stays as `%2f` in params, which is a **defense-in-depth** advantage over React Router.

2. **Catch-all params are strings, not arrays.** The splat (`[...path]`) captures remainder segments joined by `/` as a single string: `locSegments.slice(-lenDiff).join("/")`. Unlike Next.js which returns an array, SolidStart returns `"a/b/c"` as a string. This means if a dev uses `params.path` in a fetch URL, embedded slashes from catch-all are real `/` characters (they came from the URL path), enabling path traversal.

3. **Reactivity is a security surface.** Solid's `createResource` re-executes its fetcher whenever the tracked signal (params) changes. Client-side navigation instantly fires new fetches with new param values -- no page reload needed. An attacker link using `<A>` or `navigate()` triggers CSPT sinks reactively.

4. **Server functions pass params via JSON RPC unchanged.** When using `query()` with `"use server"`, arguments are serialized via seroval and sent as POST body to `/_server`. The server receives the exact string the client sent -- no re-encoding, no sanitization. `../../admin` on the client becomes `../../admin` on the server.

5. **`innerHTML` sink exists natively in Solid.** Solid's JSX supports `<div innerHTML={value} />` which compiles to `element.innerHTML = value`. This is a first-class API, not a workaround, making CSPT-to-XSS chains straightforward.

6. **`location.pathname` (from `useLocation()`) is NOT decoded.** The Router component reads `window.location.pathname` directly and stores it as the reactive location. The only place `decodeURI` is used is in the `<A>` component for active-link matching -- not in the routing/param pipeline.

7. **Build fingerprints are distinctive.** SolidStart uses vinxi as its build tool, producing chunks with recognizable patterns: `from"./web-{hash}.js"`, `from"./routing-{hash}.js"`, seroval serialization library, `X-Server-Id` headers for server functions.

## Risk Assessment

| Pattern | Risk | Reason |
|---------|------|--------|
| `useParams()` -> `fetch()` | **MEDIUM** | Params NOT decoded, so `%2f` stays encoded. But literal `../` in path segments still works if attacker controls navigation. |
| `[...path]` catch-all -> `fetch()` | **HIGH** | Catch-all joins segments with real `/`, enabling multi-segment traversal. |
| `query("use server")` -> server fetch | **HIGH** | JSON RPC boundary passes traversal strings unchanged to server-side fetch. |
| `useSearchParams()` -> `fetch()` | **HIGH** | Query params are never encoded/decoded by the router -- raw user input. |
| `innerHTML` sink | **CRITICAL** | Native Solid API. Combined with CSPT, enables XSS. |
| `useLocation().pathname` -> `fetch()` | **LOW** | Pathname is not decoded. Encoded chars stay encoded. |

## Files

- `01-route-definitions.md` - Route types, file conventions, build output patterns
- `02-source-to-sink.md` - Source-to-sink dataflow analysis
- `03-encoding-behavior.md` - Full decoding pipeline analysis
- `04-encoding-matrix.md` - Encoding transformation matrix
- `05-caido-patterns.md` - Caido HTTPQL detection patterns
- `06-appendix.md` - Source references, lab structure, build analysis
