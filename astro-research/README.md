# Astro CSPT Research

Empirical Client-Side Path Traversal (CSPT) and Server-Side Path Traversal research for Astro v5.18.0 in SSR mode with `@astrojs/node` adapter v9.5.4.

## Key Finding: `decodeURI()` Not `decodeURIComponent()`

Astro is fundamentally different from React/Next.js/Vue in its URL decoding: it uses `decodeURI()` throughout its routing pipeline, NOT `decodeURIComponent()`.

**Critical implication**: `decodeURI()` preserves these characters when percent-encoded:
- `/` (`%2F` stays `%2F`)
- `?` (`%3F` stays `%3F`)
- `#` (`%23` stays `%23`)
- `&`, `=`, `+`, `:`, `;`, `@`, `[`, `]`

But it DOES decode: `%61` -> `a`, `%2E` -> `.`, `%41` -> `A` (unreserved characters).

This means `%2F`-based path traversal does NOT work against Astro. However, encoded letters DO decode, enabling middleware bypass attacks.

## SSG vs SSR Security Boundary

- **SSG (Static Site Generation)**: Params come from `getStaticPaths()` -- developer-controlled, no CSPT surface.
- **SSR (Server-Side Rendering)**: Params decoded from URL at request time -- user-controlled, full CSPT/SSRF surface.

All Astro CSPT research requires `output: 'server'` mode.

## CVE References

- **CVE-2025-64765**: Middleware bypass via `/%61dmin` (encoded letter `a`). The middleware checks `context.url.pathname.startsWith('/admin')` but the pathname is not yet decoded at middleware time.
- **GHSA-whqg-ppgf-wp8c**: Bypass of fix via double-encoding `/%2561dmin`.
- **CVE-2026-25545**: SSRF via `x-forwarded-host` injection (mitigated in v5.18 with `allowedDomains` validation).

## Attack Surface Summary

| Route Type | Pattern | Risk Level | Primary Risk |
|---|---|---|---|
| `[param]` | `([^/]+?)` | Medium | Single-segment SSRF |
| `[...param]` catch-all | `(.*?)` | Critical | Multi-segment traversal/SSRF |
| API endpoint `[param]` | `([^/]+?)` | High | Server-side fetch manipulation |
| API catch-all `[...param]` | `(.*?)` | Critical | Full proxy SSRF |
| `set:html` sink | N/A | Critical | XSS when combined with CSPT |
| Middleware pathname check | N/A | High | Auth bypass via encoded letters |

## Double-Decode Defense (v5.18+)

Astro v5.18 added `validateAndDecodePathname()` which rejects multi-level encoding:
```javascript
function validateAndDecodePathname(pathname) {
  let decoded = decodeURI(pathname);
  const hasDecoding = decoded !== pathname;
  const decodedStillHasEncoding = /%[0-9a-fA-F]{2}/.test(decoded);
  if (hasDecoding && decodedStillHasEncoding) {
    throw new Error("Multi-level URL encoding is not allowed");
  }
  return decoded;
}
```

This blocks double-encoding attacks like `%2561` but does NOT prevent single-level encoded letter attacks.

## Research Files

1. [01-route-definitions.md](./01-route-definitions.md) - File-based routing, SSG vs SSR, detection patterns
2. [02-source-to-sink.md](./02-source-to-sink.md) - Sources, sinks, and data flow analysis
3. [03-encoding-behavior.md](./03-encoding-behavior.md) - Full `decodeURI()` pipeline analysis
4. [04-encoding-matrix.md](./04-encoding-matrix.md) - Comprehensive encoding matrix with React comparison
5. [05-caido-patterns.md](./05-caido-patterns.md) - Caido HTTPQL patterns for detection
6. [06-appendix.md](./06-appendix.md) - Source references and lab structure

## Lab

Lab app at `../astro-cspt-lab/` -- Astro 5.18.0 + @astrojs/node in SSR mode with vulnerable route patterns.
