# Ember.js CSPT Research

Empirical Client-Side Path Traversal research for Ember.js 6.x (Octane + Embroider/Vite).

## Key Findings

1. **route-recognizer decodes with `decodeURIComponent`** -- Dynamic `:param` segments are decoded via `decodeURIComponent` when `ENCODE_AND_DECODE_PATH_SEGMENTS` is `true` (default). This means `%2e%2e%2f` in a param becomes `../` in the model hook's `params` object.

2. **`%2f` breaks regular route matching** -- Route-recognizer splits the URL on `/` first, then matches segments. A `%2f` that gets normalized to `/` via `normalizePath()` creates an extra segment, breaking the match. Regular `:param` routes use regex `([^/]+)` which cannot match a literal `/`.

3. **Wildcard `*path` is the primary CSPT vector** -- Star segments use regex `(.+)` which captures everything including `/`. The captured value is NOT decoded (`shouldDecodes[j]` is `false` for star segments). However, the path is pre-normalized via `normalizePath()` which decodes non-reserved characters. The wildcard captures the already-normalized path.

4. **serialize/model hook symmetry issue (#11497)** -- The `serialize()` hook converts a model to URL params, while `model()` does the reverse. If a model ID contains `/`, the default `serialize()` produces a URL with literal `/` that breaks route matching on re-entry. Custom serialize hooks must use `encodeURIComponent`.

5. **Custom Ember Data / WarpDrive adapters are CSPT sinks** -- Legacy `urlForFindRecord(id, modelName)` and similar adapter methods often interpolate IDs without encoding. Since Ember Data resolved models by ID, and IDs came from route params (already decoded), traversal payloads flow through.

6. **Triple curlies `{{{ }}}` are Ember's innerHTML** -- Handlebars triple-curly syntax renders unescaped HTML. Combined with CSPT (redirect fetch to attacker-controlled response), this is a direct XSS vector. In production builds, triple-curlies compile to Glimmer VM `appendHTML` opcodes using `insertAdjacentHTML`.

7. **Hash routing expands attack surface** -- `HashLocation` reads from `location.hash.substring(1)`. The fragment is never sent to the server and is fully client-controlled. Combined with route-recognizer's decoding, hash-based Ember apps have the widest CSPT surface.

## Attack Chains

- **Wildcard + fetch + triple-curlies**: `/docs/../../api/malicious` → fetch redirected → response contains `<img onerror=alert(1)>` → rendered via `{{{content}}}` → XSS
- **Adapter CSPT**: User record with ID `../admin/config` → adapter builds `/api/users/../admin/config` → response confusion
- **Query param redirect**: `/dashboard?redirect=/evil` → `transitionTo(queryParams.redirect)` → open redirect
- **Hash routing traversal**: `#/users/..%2fadmin` → decoded to `../admin` → model hook receives traversal payload

## File Index

| File | Description |
|------|-------------|
| [01-route-definitions.md](01-route-definitions.md) | Ember route definition methods, what survives build |
| [02-source-to-sink.md](02-source-to-sink.md) | Sources, sinks, and data flow patterns |
| [03-encoding-behavior.md](03-encoding-behavior.md) | Full encoding pipeline via route-recognizer |
| [04-encoding-matrix.md](04-encoding-matrix.md) | Encoding test matrix with route-recognizer specifics |
| [05-caido-patterns.md](05-caido-patterns.md) | Caido detection queries for Ember CSPT |
| [06-appendix.md](06-appendix.md) | Source references, lab structure, build analysis |

## Framework Versions Tested

- ember-source: 6.11.0
- route-recognizer: 0.3.4
- router_js: 8.0.6
- @embroider/router: 3.0.6
- Build tool: Vite 7.3.1 via @embroider/vite
