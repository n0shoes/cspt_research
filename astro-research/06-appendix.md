# 06 - Appendix

## Source Code References

All references are from Astro v5.18.0 and @astrojs/node v9.5.4.

### Routing Core

| File | Function | Purpose |
|---|---|---|
| `astro/dist/core/routing/manifest/pattern.js` | `getPattern()` | Generates route regex patterns |
| `astro/dist/core/routing/manifest/create.js` | `createFileBasedRoutes()` | Walks `src/pages/` to build routes |
| `astro/dist/core/routing/match.js` | `matchRoute()` | Tests pathname against route patterns |
| `astro/dist/core/render/params-and-props.js` | `getParams()` | Extracts params from pathname via regex |
| `astro/dist/core/routing/rewrite.js` | `findRouteToRewrite()` | Handles `Astro.rewrite()` routing |

### URL Processing

| File | Function | Purpose |
|---|---|---|
| `astro/dist/core/util/pathname.js` | `validateAndDecodePathname()` | Core decode + double-encode defense |
| `astro/dist/core/render-context.js` | `#createNormalizedUrl()` | Creates decoded `Astro.url` |
| `astro/dist/core/app/index.js` | `#getPathnameFromRequest()` | Extracts and decodes pathname |
| `astro/dist/core/app/index.js` | `match()` | Route matching with decoded pathname |

### Node Adapter

| File | Function | Purpose |
|---|---|---|
| `@astrojs/node/dist/standalone.js` | `createStandaloneHandler()` | URL validation, static/app routing |
| `@astrojs/node/dist/serve-app.js` | `createAppHandler()` | Creates Request from Node req |
| `@astrojs/node/dist/serve-static.js` | `createStaticHandler()` | Static file serving |

### Security

| File | Function | Purpose |
|---|---|---|
| `astro/dist/core/app/index.js` | `sanitizeHost()` | Rejects hostnames with `/` or `\` |
| `astro/dist/core/app/index.js` | `validateForwardedHeaders()` | Validates forwarded headers against allowedDomains |

## Lab App Structure

```
astro-cspt-lab/
  astro.config.mjs          # SSR mode + node adapter
  src/
    middleware.ts             # Auth check (CVE-2025-64765 vulnerable pattern)
    pages/
      index.astro            # Home with links to all routes
      about.astro            # Static page (no CSPT surface)
      admin/
        index.astro          # Protected admin page
      users/
        [userId].astro       # Dynamic param -> fetch sink
      shop/
        [category]/
          [productId].astro  # Multi-param -> fetch concatenation
      files/
        [...path].astro      # Catch-all -> fetch + set:html (HIGHEST RISK)
      teams/
        [teamId]/
          members/
            [memberId].astro # Nested dynamic -> fetch
      data/
        [dataId].astro       # Server fetch with auth header (SSRF)
      encoding-test/
        [testParam].astro    # Encoding observation
      encoding-catchall/
        [...segments].astro  # Catch-all encoding observation
      api/
        users/
          [id].ts            # API endpoint -> fetch
        files/
          [...path].ts       # API catch-all -> fetch
        proxy/
          [...path].ts       # Full proxy pattern (catastrophic SSRF)
  dist/
    client/                  # Static assets
    server/
      entry.mjs              # Server entrypoint
      manifest_*.mjs         # Compiled route manifest
      pages/                 # Compiled page handlers
```

## Production Build Analysis

### Manifest Route Patterns (Compiled)

From `dist/server/manifest_BknvTVGi.mjs`:

| Route | Compiled Pattern | Params |
|---|---|---|
| `/about` | `^\/about\/?$` | None |
| `/admin` | `^\/admin\/?$` | None |
| `/users/[userId]` | `^\/users\/([^/]+?)\/?$` | `userId` |
| `/shop/[category]/[productId]` | `^\/shop\/([^/]+?)\/([^/]+?)\/?$` | `category`, `productId` |
| `/files/[...path]` | `^\/files(?:\/(.*?))?\/?$` | `...path` |
| `/teams/[teamId]/members/[memberId]` | `^\/teams\/([^/]+?)\/members\/([^/]+?)\/?$` | `teamId`, `memberId` |
| `/data/[dataId]` | `^\/data\/([^/]+?)\/?$` | `dataId` |
| `/encoding-test/[testParam]` | `^\/encoding-test\/([^/]+?)\/?$` | `testParam` |
| `/encoding-catchall/[...segments]` | `^\/encoding-catchall(?:\/(.*?))?\/?$` | `...segments` |
| `/api/users/[id]` | `^\/api\/users\/([^/]+?)\/?$` | `id` |
| `/api/files/[...path]` | `^\/api\/files(?:\/(.*?))?\/?$` | `...path` |
| `/api/proxy/[...path]` | `^\/api\/proxy(?:\/(.*?))?\/?$` | `...path` |

### Build Filenames

Dynamic params use `_paramname_` convention:
- `_userid_.astro.mjs` for `[userId]`
- `_---path_.astro.mjs` for `[...path]` (catch-all uses `---` prefix)

### Fingerprinting Production Builds

Detectable patterns in production:
1. `/_astro/` asset prefix
2. `self.Astro||(self.Astro={})` in hydration scripts
3. `astro:idle`, `astro:load`, `astro:visible`, `astro:media` client directives
4. `/_server-islands/` path for server components
5. `/_image` endpoint for image optimization
6. `x-astro-` response headers (when present)
7. `<meta name="generator" content="Astro v5.18.0">` (when not removed)

### Server Entry Point

The production server starts via:
```bash
node dist/server/entry.mjs
```

Default port: 4321 (configurable via PORT env var or adapter options).

## Version-Specific Notes

### Astro 5.18.0

- `validateAndDecodePathname()` present -- blocks double-encoding
- `allowedDomains` validation for forwarded headers
- `sanitizeHost()` rejects `/` and `\` in hostnames
- Session support with filesystem storage
- Server islands with `/_server-islands/` endpoint

### Key Differences from Earlier Versions

- Pre-5.x: No `validateAndDecodePathname()` defense
- Pre-5.x: No `allowedDomains` for forwarded headers
- Astro 4.x: Different middleware pipeline (CVE-2025-64765 more exploitable)
- Astro 3.x: No server islands, simpler rendering pipeline

## Related CVEs

| CVE | Impact | Status |
|---|---|---|
| CVE-2025-64765 | Middleware bypass via encoded letters | Fixed (partial) |
| GHSA-whqg-ppgf-wp8c | Double-encoding bypass of CVE-2025-64765 fix | Fixed in v5.18 |
| CVE-2026-25545 | SSRF via x-forwarded-host injection | Mitigated with allowedDomains |
