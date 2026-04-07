# Nuxt 3 CSPT Research

Empirical CSPT (Client-Side Path Traversal) research for Nuxt 3.21.1 with Vue Router 4.6.4 and H3 server framework.

## Key Findings

### 1. Inherits Vue Router's Decoding Behavior (Client-Side)

Nuxt uses Vue Router under the hood for client-side routing. All Vue Router encoding/decoding rules apply:

- `route.params.*` are **DECODED** via `decodeURIComponent()` -- `%2F` becomes `/`
- `route.path` preserves percent-encoding from the URL bar
- `route.query.*` values are decoded but `+` is not converted to space
- Catch-all `[...slug]` returns an **array** of decoded segments

This means any `useFetch`/`$fetch` call interpolating `route.params` is a CSPT sink.

### 2. Server-Side H3 `getRouterParam()` Does NOT Decode by Default

**Critical difference from Vue Router:** H3's `getRouterParam(event, 'id')` does NOT decode by default. It only decodes when explicitly called with `{ decode: true }`. However, `event.context.params` values are set directly from the router match, which may or may not be decoded depending on the incoming URL normalization.

This is a key distinction -- server-side params are safer by default than client-side params.

### 3. CVE-2025-59414: Stored CSPT via Island Payload Revival

The `revive-payload.client.js` plugin contains a critical CSPT sink:

```javascript
nuxtApp.payload.data[key] ||= $fetch(`/__nuxt_island/${key}.json`, { ... })
```

The `key` comes from the island payload data without sanitization. If an attacker can control the `key` value in the serialized payload (e.g., via cache poisoning or stored payload injection), the `$fetch` URL can be traversed to arbitrary endpoints.

### 4. `useFetch` / `$fetch` as Universal CSPT Sinks

Nuxt's primary data-fetching composables pass the URL directly to `globalThis.$fetch` or the server-side request fetch. No URL sanitization occurs in the data layer -- whatever string is passed to `useFetch(url)` becomes the fetch target.

### 5. Server Routes Enable SSRF

Server routes under `server/api/` execute on the server with full network access. Any pattern like:
```typescript
const path = event.context.params?.path || ''
return $fetch(`https://backend.internal/${path}`)
```
...is a server-side path traversal / SSRF sink, even without explicit decoding.

## Attack Surface Summary

| Vector | Layer | Decoded? | Severity |
|--------|-------|----------|----------|
| `route.params.*` in `useFetch` | Client | Yes (Vue Router) | High -- CSPT |
| `route.query.*` in `useFetch` | Client | Partial | Medium -- CSPT |
| `getRouterParam()` in server `$fetch` | Server | No (unless opts.decode) | Medium -- SSRF |
| `event.context.params` in server `$fetch` | Server | Depends on URL normalization | Medium -- SSRF |
| Island payload `key` in `$fetch` | Client | N/A (stored value) | High -- Stored CSPT |
| `v-html` with API response | Client | N/A | Critical -- XSS |

## Research Files

| File | Description |
|------|-------------|
| [01-route-definitions.md](01-route-definitions.md) | Nuxt file-based routes, compiled output, detection patterns |
| [02-source-to-sink.md](02-source-to-sink.md) | Source-sink analysis for all CSPT vectors |
| [03-encoding-behavior.md](03-encoding-behavior.md) | Full encoding/decoding pipeline (client + server) |
| [04-encoding-matrix.md](04-encoding-matrix.md) | Encoding reference matrix |
| [05-caido-patterns.md](05-caido-patterns.md) | Caido detection and fingerprinting patterns |
| [06-appendix.md](06-appendix.md) | Source references, lab structure, build analysis |

## Versions Tested

- Nuxt: 3.21.1
- Vue Router: 4.6.4
- H3: (bundled via Nitro in Nuxt)
- ufo: (encoding utility used by both Vue Router and H3)
