# 6. Appendix

## Source Code References

All line numbers reference SvelteKit v2.53.4 (`@sveltejs/kit@2.53.4`).

### Core Decoding Functions

| Function | File | Line | Purpose |
|----------|------|------|---------|
| `decode_pathname()` | `src/utils/url.js` | 50 | Split on %25, apply decodeURI |
| `decode_params()` | `src/utils/url.js` | 55 | Apply decodeURIComponent to each param |
| `decode_uri()` | `src/utils/url.js` | 69 | Error-augmented decodeURI wrapper |
| `normalize_path()` | `src/utils/url.js` | 34 | Trailing slash normalization |
| `resolve()` | `src/utils/url.js` | 15 | Base + path URL resolution |

### Routing Functions

| Function | File | Line | Purpose |
|----------|------|------|---------|
| `parse_route_id()` | `src/utils/routing.js` | 10 | Generate regex + params from route ID |
| `exec()` | `src/utils/routing.js` | 140 | Execute regex match, extract params, run matchers |
| `find_route()` | `src/utils/routing.js` | 293 | Find first matching route for a path |
| `escape()` | `src/utils/routing.js` | 212 | Escape literal route segments for regex |
| `get_route_segments()` | `src/utils/routing.js` | 131 | Split route ID into segments |

### Client-Side Router

| Function | File | Line | Purpose |
|----------|------|------|---------|
| `get_navigation_intent()` | `src/runtime/client/client.js` | 1408 | Resolve navigation target |
| `get_url_path()` | `src/runtime/client/client.js` | 1451 | Extract + decode path from URL |
| `parse()` | `src/runtime/client/parse.js` | 7 | Parse route dictionary into CSRRoute objects |

### Server-Side Router

| Function | File | Line | Purpose |
|----------|------|------|---------|
| `internal_respond()` | `src/runtime/server/respond.js` | 70 | Main server request handler |
| `create_fetch()` | `src/runtime/server/fetch.js` | 18 | Create server-side fetch with cookie handling |

### Key Lines for CVE-2025-67647

```
respond.js:224  - let resolved_path = url.pathname;
respond.js:234  - resolved_path = await reroute(...) ?? url.pathname;
respond.js:246  - resolved_path = decode_pathname(resolved_path);
respond.js:254  - resolved_path !== decode_pathname(url.pathname)  // the discrepancy
```

## Lab App Structure

```
sveltekit-cspt-lab/
  src/
    routes/
      +page.svelte                           # Home with navigation links
      +layout.svelte                         # Root layout
      about/+page.svelte                     # Static page
      users/[userId]/
        +page.svelte                         # User display
        +page.ts                             # Universal load: fetch(/api/users/${userId}/profile)
      shop/[category]/[productId]/
        +page.svelte                         # Product display
        +page.ts                             # Universal load: concatenated fetch
      files/[...path]/
        +page.svelte                         # File display
        +page.ts                             # Universal load: catch-all -> fetch (HIGHEST RISK)
      teams/[teamId]/members/[memberId]/
        +page.svelte                         # Member display
        +page.ts                             # Universal load: nested params
      dashboard/
        +layout.svelte                       # Dashboard layout wrapper
        +page.svelte                         # goto() redirect sink
        stats/
          +page.svelte                       # {@html data.content} XSS sink
          +page.ts                           # searchParams -> fetch
        settings/
          +page.svelte                       # Settings display
          +page.ts                           # Simple settings fetch
      data/[dataId]/
        +page.svelte                         # Server data display
        +page.server.ts                      # SERVER LOAD: SSRF to internal-service.local
      encoding-test/[testParam]/
        +page.svelte                         # Encoding comparison display
      encoding-catchall/[...rest]/
        +page.svelte                         # Catch-all encoding test
      api/proxy/[...path]/
        +server.ts                           # API ENDPOINT: SSRF to backend.internal
    params/
      integer.ts                             # Param matcher: /^\d+$/
```

## Build Output Analysis

### Client Bundle Structure

```
.svelte-kit/output/client/
  _app/
    version.json                             # Build version
    immutable/
      entry/
        start.*.js                           # Bootstrap entry (~0.08 KB)
        app.*.js                             # App entry with route dictionary (~9 KB)
      chunks/
        *.js                                 # Shared runtime chunks
      nodes/
        0.*.js                               # Root layout
        1.*.js                               # Error page
        2.*.js - 14.*.js                     # Route components (order matches dictionary)
```

### Key Observations from Build

1. **Route dictionary fully exposed** in `app.*.js` - every route pattern visible
2. **Param matchers inlined** as JavaScript functions in `app.*.js`
3. **Negative node IDs** reveal server-data routes (`+page.server.ts`)
4. **Load functions preserved verbatim** in server output chunks
5. **Fetch URLs with param interpolation** survive minification unchanged
6. **{@html} compiles to raw insertion** in component output

### Server Build Structure

```
.svelte-kit/output/server/
  entries/
    pages/                                   # One directory per route
      users/_userId_/
        _page.ts.js                          # Compiled load function
        _page.svelte.js                      # Compiled component
      data/_dataId_/
        _page.server.ts.js                   # Server load (SSRF pattern)
      files/_...path_/
        _page.ts.js                          # Catch-all load (CSPT pattern)
    endpoints/
      api/proxy/_...path_/
        _server.ts.js                        # API endpoint (SSRF pattern)
    matchers/
      integer.js                             # Compiled param matcher
  chunks/
    index.js                                 # Main server runtime
    index2.js                                # Extended runtime
```

## Version Information

| Package | Version |
|---------|---------|
| `@sveltejs/kit` | 2.53.4 |
| `svelte` | 5.53.7 |
| `vite` | 7.3.1 |
| `@sveltejs/adapter-auto` | 7.0.1 |
| `@sveltejs/vite-plugin-svelte` | 6.2.4 |
| `typescript` | 5.9.3 |
| `svelte-check` | 4.4.4 |

## CVE Summary

| CVE | Type | Component | Status |
|-----|------|-----------|--------|
| Issue #3069 | Double Decode | `decode_pathname` pipeline | Fixed (v1.0.0-next.385) |
| CVE-2025-67647 | SSRF | `respond.js` resolved_path discrepancy | Documented |
| CVE-2026-22803 | DoS | Remote functions | Documented |
