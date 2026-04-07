# Remix / React Router v7 Framework Mode: CSPT Deep Dive

> Empirical validation of Client-Side Path Traversal in Remix (now React Router v7 framework mode).
> Built a real app with loaders, actions, fetchers, and file-based routing. Compiled, analyzed, tested.

## Key Finding: Remix = React Router + Server Execution Surface

Remix merged into React Router v7. It shares **100% of the client-side routing internals** documented in the [React Router research](../react-research/). The same `decodePath()` -> `matchPath()` pipeline, the same line 747 `%2F`->`/` replacement, the same `useParams()` decoding behavior.

**What Remix adds** is a server-side execution layer (loaders, actions, fetchers) that creates an entirely new attack surface: **Server-Side Request Forgery via decoded route params**.

## Files

| File | Description |
|------|-------------|
| [01-route-definitions.md](01-route-definitions.md) | React Router v7 route config (`routes.ts`), file naming conventions, manifest, detection regexes |
| [02-source-to-sink.md](02-source-to-sink.md) | Sources (loader params, action params, useParams, useFetcher) and sinks (server-side fetch, client fetch, dangerouslySetInnerHTML, _data endpoint) |
| [03-encoding-behavior.md](03-encoding-behavior.md) | Remix-specific encoding: loader params, `.data` endpoint, server vs client param handling |
| [04-encoding-matrix.md](04-encoding-matrix.md) | References React Router matrix (shared pipeline). Remix-specific differences only |
| [05-caido-patterns.md](05-caido-patterns.md) | Caido patterns: Remix/RR7 framework-mode fingerprinting, route extraction, sink detection |
| [06-appendix.md](06-appendix.md) | Source references, lab structure, build analysis |

## Key Takeaways

1. **Shares React Router internals** -- `decodePath()`, `matchPath()` line 747, `compilePath()` are identical. All encoding behavior from `react-research/03-encoding-behavior.md` applies.
2. **Loaders receive DECODED params** -- `params.userId` in a loader is decoded the same way as `useParams().userId`. This means server-side fetch URLs constructed from params are vulnerable to SSRF.
3. **Actions enable CSPT2CSRF** -- Actions accept form data via POST. A CSPT payload can redirect an action to a different server endpoint, enabling mutation of arbitrary resources.
4. **`.data` endpoint returns loader data as JSON** -- Client navigations hit `/<path>.data` to fetch loader results via turbo-stream. This endpoint is an attack surface for cache poisoning.
5. **Server-side loaders execute with full server privileges** -- Loaders can hit internal services, carry auth headers, access `process.env`. CSPT in a loader param = SSRF with internal credentials.
6. **Splat routes (`files/*`) in loaders = critical SSRF** -- `params["*"]` captures across `/` boundaries and is fully decoded. A splat loader hitting an internal service is the highest-risk pattern.
7. **Manifest exposes full route map** -- `window.__reactRouterManifest` contains all route paths, which routes have loaders/actions, and module URLs. Complete attack surface enumeration from one request.
8. **CVE-2025-31137** -- X-Forwarded-Host port injection in React Router dev server enables cache poisoning DoS.

## Lab App

The test app is at `../remix-cspt-lab/` -- a React Router v7 framework-mode app (the new Remix) with 13 routes, loaders, actions, and CSPT-vulnerable patterns.
