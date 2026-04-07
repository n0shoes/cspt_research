# 6. Appendix

## A: React Router v7 Source Line References (Framework Mode)

Version: `react-router@7.12.0`

| Function | File | Lines | Purpose |
|----------|------|-------|---------|
| `decodePath()` | chunk-2BEI23B2.js | 785-795 | Per-segment decodeURIComponent, re-encodes / |
| `matchPath()` | chunk-2BEI23B2.js | 723-758 | Extracts params, **line 747: %2F-->/** |
| `compilePath()` | chunk-2BEI23B2.js | 760-783 | Builds regex: `:param`=[^\\/]+, `*`=(.*) |
| `matchRoutesImpl()` | chunk-2BEI23B2.js | 501-518 | Orchestrates matching, calls decodePath at 511 |
| `singleFetchUrl()` | chunk-2BEI23B2.js | 6478-6501 | Constructs `.data` endpoint URL |
| `fetchAndDecodeViaTurboStream()` | chunk-2BEI23B2.js | 6502-6563 | Fetches `.data` URL, decodes turbo-stream |
| `convertRouteMatchToUiMatch()` | chunk-2BEI23B2.js | 520-529 | Attaches loaderData to match |

### Shared with React Router (Identical Code)

The following functions are **identical** to those documented in [`react-research/06-appendix.md`](../react-research/06-appendix.md):
- `decodePath()` -- same per-segment decode + re-encode logic
- `matchPath()` -- same `%2F` --> `/` replacement (now at line 747 vs 811 in older versions)
- `compilePath()` -- same regex construction
- `matchRoutesImpl()` -- same orchestration

### Framework-Mode Specific (NOT in plain React Router)

| Function | Purpose |
|----------|---------|
| `singleFetchUrl()` | Appends `.data` extension to URL for data fetching |
| `fetchAndDecodeViaTurboStream()` | Client-side data fetcher using turbo-stream |
| `callSingleFetch()` | Wrapper for single-fetch loader/action calls |
| `stripIndexParam()` | Removes `?index` from `.data` URLs |
| `decode()` (turbo-stream) | Decodes turbo-stream response format |
| `unflatten()` (turbo-stream) | Deserializes turbo-stream data |

## B: Lab App Structure

```
remix-cspt-lab/
  app/
    root.tsx                              - Root layout with Outlet
    routes.ts                             - Route configuration (routes.ts pattern)
    routes/
      home.tsx                            - Index route (home page)
      about.tsx                           - Static route (no CSPT risk)
      users.$userId.tsx                   - Loader + Action + client fetch (SSRF + CSPT2CSRF)
      shop.$category.$productId.tsx       - Loader with concatenation (multi-param SSRF)
      files.$.tsx                         - Splat loader (CRITICAL SSRF)
      teams.$teamId.members.$memberId.tsx - Nested dynamic params (multi-param SSRF)
      dashboard.tsx                       - Layout route with Outlet
      dashboard._index.tsx                - navigate() open redirect via searchParams
      dashboard.stats.tsx                 - searchParams → fetch → dangerouslySetInnerHTML (XSS)
      dashboard.settings.tsx              - API service layer + loader with query params
      data.$dataId.tsx                    - Loader with internal auth header (SSRF + credential leak)
      encoding-test.$testParam.tsx        - Encoding experiment (named param + loader)
      encoding-splat.$.tsx                - Encoding experiment (splat param + loader)

  build/
    client/
      assets/
        entry.client-CiypOLxj.js          - 190 kB entry (hydration, router init)
        chunk-EPOLDU6W-jgZcKmkK.js        - 124 kB shared chunk (React Router core)
        manifest-1f758c93.js              - 4.9 kB route manifest (JSON)
        users._userId-CcL-Wuzu.js         - 0.64 kB route chunk (minified)
        files._-26MvFS_Q.js               - 0.39 kB route chunk (minified)
        dashboard.stats-DGpkhsZU.js       - 0.48 kB route chunk (minified)
        dashboard.settings-DYlKExp8.js    - 0.84 kB route chunk (minified)
        encoding-test._testParam-...js    - 2.17 kB route chunk (minified)
        encoding-splat._-...js            - 1.74 kB route chunk (minified)
        [+ other route chunks]

    server/
      index.js                            - 40.8 kB server bundle (NOT minified!)
        Contains: all loaders, actions, components (SSR)
        Exposes: internal service URLs, auth headers, env vars
```

## C: Key Build Observations

### Client Build

1. **Route chunks are code-split by route** -- each route file becomes a separate JS chunk
2. **Shared chunk** contains React Router core (decodePath, matchPath, etc.)
3. **Manifest JS** (`manifest-*.js`) contains the full route map as `window.__reactRouterManifest`
4. **Hook names mangled** -- `useLoaderData` --> `l`, `useParams` --> `h`, `useSearchParams` --> `i`
5. **Fetch URL strings preserved verbatim** -- template literals and concatenations survive minification
6. **`dangerouslySetInnerHTML` preserved** -- React prop name, never minified
7. **API service layer objects preserved** -- `{get:s=>fetch(\`/api${s}\`)}` readable in minified output

### Server Build

1. **NOT minified by default** -- all function names, string literals, comments readable
2. **Loader/action functions are named** -- `loader$7`, `loader$6`, etc. (numbered by route order)
3. **Internal service URLs exposed** -- `http://internal-api.local`, `http://internal-service.local`
4. **Auth headers visible** -- `X-Internal-Auth`, `process.env.INTERNAL_KEY`
5. **Route table at end of file** -- maps route IDs to module objects
6. **Exports** -- `routes`, `assets`, `entry`, `ssr`, `isSpaMode`, `basename`, `future`

### Manifest Intelligence

The `window.__reactRouterManifest` provides complete attack surface enumeration:

| Field | Intelligence Value |
|-------|-------------------|
| `routes.*.path` | All route patterns with param names |
| `routes.*.hasLoader` | Server-side data fetching (SSRF target) |
| `routes.*.hasAction` | Server-side mutations (CSPT2CSRF target) |
| `routes.*.hasClientLoader` | Client-side loader (client CSPT) |
| `routes.*.hasClientAction` | Client-side action (client CSPT) |
| `routes.*.module` | Client chunk URL for sink analysis |
| `routes.*.parentId` | Route nesting hierarchy |
| `routes.*.index` | Index route marker |
| `entry.module` | Entry point URL |
| `entry.imports` | Shared chunk URLs |
| `version` | Build version hash |

## D: CVE-2025-31137 -- X-Forwarded-Host Port Injection

Affects React Router dev server. The `X-Forwarded-Host` header can inject a port number that gets reflected in responses, enabling cache poisoning DoS:

```
GET / HTTP/1.1
X-Forwarded-Host: example.com:evil-port
```

Causes the server to generate URLs with the injected port, breaking asset loading. If cached by a CDN, this becomes a DoS for all users.

**Status:** Fixed in later versions. Relevant for targets running React Router dev server in production (misconfiguration).

## E: Shared React Router Research References

For encoding behavior, encoding matrix, and client-side patterns that are shared with plain React Router, see:

- [`../react-research/03-encoding-behavior.md`](../react-research/03-encoding-behavior.md) -- Complete encoding pipeline
- [`../react-research/04-encoding-matrix.md`](../react-research/04-encoding-matrix.md) -- All encoding types tested
- [`../react-research/02-source-to-sink.md`](../react-research/02-source-to-sink.md) -- Client-side chains
- [`../react-research/05-caido-patterns.md`](../react-research/05-caido-patterns.md) -- Client-side detection patterns
