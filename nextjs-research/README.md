# Next.js CSPT Deep Dive: Empirical Analysis

> Empirical validation of Client-Side Path Traversal in Next.js 15.5.12 (App Router).
> Built a real app, compiled with Turbopack, read router source code, traced the decoding pipeline.

## Files

| File | Description |
|------|-------------|
| [01-route-definitions.md](01-route-definitions.md) | All Next.js route definition methods (file-based), what survives in production, detection regexes |
| [02-source-to-sink.md](02-source-to-sink.md) | All CSPT sources and sinks: useParams, await params, useSearchParams, usePathname, route handlers |
| [03-encoding-behavior.md](03-encoding-behavior.md) | Complete decoding pipeline from URL to params with exact function names and line numbers |
| [04-encoding-matrix.md](04-encoding-matrix.md) | Encoding matrix with Next.js-specific behaviors: catch-all splitting, server vs client differences |
| [05-caido-patterns.md](05-caido-patterns.md) | Caido plugin regex patterns for Next.js fingerprinting, route extraction, sink detection |
| [06-appendix.md](06-appendix.md) | Source line references, lab app structure, build output analysis |

## Key Takeaways

1. **`useParams()` returns RE-ENCODED values** — the server decodes params via `decodeURIComponent` in route-matcher.js, then RE-ENCODES via `getParamValue()` in get-dynamic-param.js before sending to client. `%2F` stays as `%2F`.
2. **Page/layout server components (`await params`) also return RE-ENCODED values** — they go through the same `getParamValue()` pipeline. Lab-confirmed: `/files/thepath%2fbooya` → page params = `["thepath%2Fbooya"]`
3. **Route handlers (`await params`) return DECODED values** — they use `getRouteMatcher()` directly WITHOUT the re-encoding step. Same URL → handler params = `["thepath/booya"]`
4. **Encoding differential between page components and route handlers is the critical finding** — not client vs server, but page-rendering vs route-handling
5. **Catch-all `[...param]` splits on `/` BEFORE decoding** — route-matcher.js:33: `match.split('/').map(decode)`
6. **`%2F` in single `[param]` routes returns 404** — regex `([^/]+?)` rejects decoded slashes
7. **`usePathname()` preserves encoding** — reads from `canonicalUrl` via `new URL().pathname`
8. **Route handlers are the primary SSRF attack surface** — only context where `%2F` → `/` out of the box
9. **SSRF via page components works only through indirection** — page fetches API route handler, which decodes params
10. **Next.js is dramatically safer for client-side CSPT than React Router** — React Router's `matchPath()` line 811 actively strips `%2F` → `/` for ALL params; Next.js re-encodes everything except route handlers

## React Router vs Next.js: CSPT Comparison

| Behavior | React Router | Next.js |
|----------|-------------|---------|
| `useParams()` encoding | **DECODED** — `%2F` → `/` via line 811 `.replace(/%2F/g, "/")` | **RE-ENCODED** — `%2F` stays `%2F` via `getParamValue()` |
| Splat/catch-all | **DECODED** — `(.*)` captures + full decode | **RE-ENCODED** on client, **DECODED** in route handlers only |
| Double-encode `%252F` | **DECODED** — `%252F` → `%2F` → `/` (two-step) | **RE-ENCODED** on client, single decode in route handlers |
| `searchParams.get()` | **DECODED** (standard URLSearchParams) | **DECODED** (same — standard browser API) |
| `location.hash` | Raw literal `../` works | Raw literal `../` works (same) |
| `location.pathname` | **ENCODED** (safe) | **ENCODED** (safe) |
| Server components | N/A (client-side only) | **RE-ENCODED** (same as client `useParams()`) |
| Route handlers | N/A | **DECODED** — primary SSRF surface |
| Primary CSPT surface | ALL path params (client-side) | Route handlers only (server-side SSRF) |
| Defense mechanism | None — line 811 actively removes `%2F` defense | `getParamValue()` re-encodes after decode |

**Bottom line:** React Router is a CSPT vending machine — every path source decodes `%2F`. Next.js neutralizes client-side CSPT via re-encoding, narrowing the attack surface to route handlers (SSRF) and standard browser APIs (`searchParams`, `hash`).

## Lab App

The test app is at `../nextjs-cspt-lab/` -- a Next.js 15.5.12 app with 13 routes covering all dynamic routing patterns and CSPT-vulnerable sink patterns.
