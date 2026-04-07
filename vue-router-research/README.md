# Vue Router v4 CSPT Research

**Framework:** Vue Router v4.6.4
**Research type:** Empirical (lab-verified with source code analysis)
**Date:** 2026-03-06

## Key Takeaway

Vue Router v4 has the **most exploitable encoding split** of any major frontend router. `route.params` delivers **DECODED** values via `decodeURIComponent()`, while `route.path` stays **ENCODED**. This split is explicit, documented, and consistent -- making it highly reliable for CSPT exploitation.

## Critical Findings

### 1. The Decoding Pipeline
Vue Router applies `decodeURIComponent()` to ALL params at line 1172/1205 of `vue-router.mjs`:
```javascript
const decodeParams = applyToParams.bind(null, decode);
// ...
params: decodeParams(matchedRoute.params)
```
The `decode()` function (devtools module, line 170) wraps `decodeURIComponent()` with a try-catch fallback.

### 2. Catch-All Returns Arrays
`/:pathMatch(.*)*` splits matched content on `/` into arrays. When `%2F` decodes to `/` inside a single segment, it creates a single array element containing the literal slash. This is unique to Vue Router.

### 3. `router.push()` Encoding Asymmetry
- **String path:** Must be pre-encoded, passed through `parseURL()` as-is
- **Params object:** Auto-encodes via `encodeParams()` which uses `encodeParam()` (encodes `/` to `%2F`)
This asymmetry means `router.push(userInput)` with a string is directly exploitable.

### 4. Hash Encoding Bug (Issue #2187)
`parseURL()` decodes hash with `decodeURIComponent()` but `stringifyURL()` re-encodes with `encodeHash()` which uses `encodeURI()`. These are not symmetric -- `encodeURI` encodes fewer characters than `encodeURIComponent`. Status: wontfix.

### 5. `v-html` = XSS Sink
Vue's `v-html` directive is the equivalent of React's `dangerouslySetInnerHTML`. When combined with CSPT (fetching attacker-controlled responses), it creates stored XSS chains.

## Attack Chain Summary

| Chain | Vector | Impact |
|-------|--------|--------|
| CSPT + v-html | `route.params` -> fetch -> v-html | Stored XSS |
| CSPT + query + v-html | `route.query.widget` -> fetch -> v-html | Reflected XSS |
| CSPT + file upload | Upload malicious JSON, CSPT redirects fetch | Stored XSS |
| router.push(query) | `route.query.redirect` -> `router.push()` | Open redirect |
| Catch-all + join | `pathMatch.join('/')` -> fetch | Path traversal |

## Files

| File | Contents |
|------|----------|
| [01-route-definitions.md](01-route-definitions.md) | Route definition patterns, minification survival, detection regexes |
| [02-source-to-sink.md](02-source-to-sink.md) | CSPT sources, sinks, and complete data flow chains |
| [03-encoding-behavior.md](03-encoding-behavior.md) | Complete decoding pipeline with source line references |
| [04-encoding-matrix.md](04-encoding-matrix.md) | Vue Router vs React Router encoding comparison |
| [05-caido-patterns.md](05-caido-patterns.md) | Caido HTTPQL and regex detection patterns |
| [06-appendix.md](06-appendix.md) | Source references, lab structure, build analysis |

## Lab App

Located at `/Users/jonathandunn/Desktop/ctbbp/vue-router-cspt-lab/`

Run with:
```bash
cd vue-router-cspt-lab && bun dev
```
