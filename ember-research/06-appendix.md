# 6. Appendix: Source References, Lab Structure, Build Analysis

## Source Code References

### route-recognizer v0.3.4

**Package:** `node_modules/route-recognizer/dist/route-recognizer.es.js`

| Function | Line | Purpose | CSPT Relevance |
|----------|------|---------|-------|
| `normalizePath()` | 100-103 | Splits on `/`, normalizes each segment | Decodes params, re-encodes `%` and `/` |
| `normalizeSegment()` | 109-113 | `decodeURIComponent` + re-encode reserved | Core decode step for route matching |
| `encodePathSegment()` | 125-127 | Encode for URL generation | Used by `generate()` for serialize |
| `parse()` | 202-247 | Parse route pattern into segments | Classifies `:param` vs `*wildcard` |
| `eachChar[1/*Dynamic*/]` | 156-158 | State for dynamic params | `put(47/*SLASH*/, true, true)` -- stops at `/` |
| `eachChar[2/*Star*/]` | 159-161 | State for star params | `put(-1/*ANY*/, false, true)` -- matches anything |
| `regex[1/*Dynamic*/]` | 169-171 | Regex for dynamic | `"([^/]+)"` |
| `regex[2/*Star*/]` | 172-174 | Regex for star | `"(.+)"` |
| `generate[1/*Dynamic*/]` | 182-190 | URL gen for dynamic | Calls `encodePathSegment()` when ENCODE flag set |
| `generate[2/*Star*/]` | 191-193 | URL gen for star | Returns raw value, NO encoding |
| `findHandler()` | 412-450 | Extract params from regex match | `decodeURIComponent()` for dynamic only |
| `recognize()` | 618-673 | Main entry point | Strips `#`, `?`, normalizes, matches |
| `ENCODE_AND_DECODE_PATH_SEGMENTS` | 677 | Static flag | Default `true`, controls decode behavior |

### router_js v8.0.6

**Package:** `node_modules/router_js/dist/modules/`

| File | Key Functions | CSPT Relevance |
|------|--------------|-------|
| `router.js` | `handleURL()`, `doTransition()`, `recognize()` | Entry points for URL-based navigation |
| `url-transition-intent.js` | `applyToState()` | Calls `recognizer.recognize(url)`, creates route infos |
| `route-info.js` | `UnresolvedRouteInfoByParam.getModel()` | Calls `route.model(params)` with decoded params |
| `route-info.js` | `UnresolvedRouteInfoByObject.serialize()` | Calls `route.serialize()` for URL generation |
| `transition.js` | `InternalTransition` | Manages transition state, params |

### ember-source v6.11.0

**Package:** `node_modules/ember-source/dist/packages/@ember/routing/`

| File | Key Class/Function | CSPT Relevance |
|------|-------------------|-------|
| `route.js` | `Route.serialize()` | Default serialize: uses `model.id` for `_id` patterns |
| `route.js` | `Route.paramsFor()` | Access ancestor route params |
| `history-location.js` | `HistoryLocation.getURL()` | Reads `location.pathname`, strips rootURL/baseURL |
| `hash-location.js` | `HashLocation.getURL()` | Reads `location.hash.substring(1)` |
| `lib/dsl.js` | `DSLImpl.route()` | Route definition DSL, creates route entries |
| `router-service.js` | `RouterService` | `transitionTo()`, `currentRoute`, params access |

## Lab Structure

```
ember-cspt-lab/
  app/
    router.js                          # Route definitions with all segment types
    routes/
      user.js                          # :user_id → fetch CSPT
      product.js                       # :category/:product_id → multi-param CSPT
      document.js                      # *doc_path → wildcard CSPT (CRITICAL)
      member.js                        # :team_id/:member_id → nested param CSPT
      data.js                          # :data_id → fetch CSPT
      encoding-test.js                 # Diagnostic: shows decode behavior
      encoding-wildcard.js             # Diagnostic: wildcard decode behavior
      dashboard/
        index.js                       # Query param redirect sink
        stats.js                       # Query param → fetch → triple curlies
        settings.js                    # Service-layer fetch
    templates/
      user.hbs                         # Safe (double curlies)
      product.hbs                      # Safe
      document.hbs                     # Safe
      member.hbs                       # Safe
      data.hbs                         # Safe
      encoding-test.hbs                # Diagnostic display
      encoding-wildcard.hbs            # Diagnostic display
      dashboard.hbs                    # Outlet for nested
      dashboard/
        index.hbs                      # Static
        stats.hbs                      # CRITICAL: {{{this.model.content}}} XSS sink
        settings.hbs                   # Safe
      not-found.hbs                    # 404 catch-all
    adapters/
      application.js                   # Vulnerable adapter pattern (no encoding)
    helpers/
      json-stringify.js                # Display helper
    templates/
      application.gjs                  # Root template
  dist/                                # Production build output
    assets/
      main-Bx5k940E.js                # Main bundle (563 KB)
      modules-4-12-C738aZrd.js         # Modules chunk
    index.html                         # With Ember meta tag fingerprint
```

## Production Build Analysis

### Build Tool
Vite 7.3.1 via @embroider/vite. Embroider is Ember's next-gen build system that compiles to standard ES modules.

### Bundle Size
- Main bundle: 563.58 KB (167.86 KB gzip)
- Modules chunk: 7.18 KB (3.00 KB gzip)

### What Survives Minification

**Route patterns (string literals):**
```
/users/:user_id
/shop/:category/:product_id
/docs/*doc_path
/teams/:team_id/members/:member_id
/data/:data_id
/encoding-test/:test_param
/encoding-wildcard/*wildcard_path
/*path
```
All route path definitions survive as-is. They are string arguments to route-recognizer's parser.

**Fetch calls:**
```javascript
fetch(`/api/users/${e.user_id}`)
fetch("/api/shop/"+e.category+"/products/"+e.product_id)
fetch(`/api/documents/${t}`)
fetch(`/api/teams/${e.team_id}/members/${e.member_id}`)
fetch(`/api/data/${e.data_id}`)
fetch(`/api/dashboard/stats?period=${t}`)
fetch("/api/dashboard/settings")
```
Template literals and string concatenation both preserved. Variable names minified but API paths preserved.

**Framework references (count in bundle):**
- `decodeURIComponent`: 5 occurrences
- `encodeURIComponent`: 5 occurrences
- `ENCODE_AND_DECODE_PATH_SEGMENTS`: 4 occurrences
- `insertAdjacentHTML`: 7 occurrences (Glimmer VM)
- `appendHTML`: 7 occurrences (Glimmer VM)
- `createTextNode`: 7 occurrences (safe rendering)
- `transitionTo`: 18 occurrences
- `replaceWith`: 3 occurrences
- `ember-source`: 4 occurrences
- `@embroider`: 2 occurrences
- `Ember.`: 1 occurrence

**index.html fingerprints:**
- `<meta name="ember-cspt-lab/config/environment" content="...">` -- unique Ember fingerprint
- Content contains URL-encoded JSON with `locationType`, `rootURL`, `modulePrefix`
- `@embroider/virtual/vendor.js` script tag
- Module script with hashed filename

### Glimmer VM Compilation

Triple curlies `{{{content}}}` compile to Glimmer VM opcodes. In the production bundle, the compiled template uses:
- `appendHTML` opcode which calls `insertAdjacentHTML('beforeend', html)` on the DOM element
- This is functionally identical to `innerHTML` assignment
- Regular double curlies `{{content}}` compile to `createTextNode()` which is safe

## Version History

| Package | Version | Release | Notes |
|---------|---------|---------|-------|
| ember-source | 6.11.0 | 2025 | Octane edition, Embroider by default |
| route-recognizer | 0.3.4 | 2017 | Last release, unchanged since |
| router_js | 8.0.6 | 2023 | Maintained by Ember team |
| @embroider/router | 3.0.6 | 2024 | Embroider's router wrapper |
| @embroider/vite | 1.5.2 | 2025 | Vite integration for Ember |

Note: route-recognizer 0.3.4 was last published in 2017 and has not been updated. The `ENCODE_AND_DECODE_PATH_SEGMENTS` feature was added in 0.3.0 (PR #55). This is the most security-relevant code in the routing pipeline and it has been frozen for 8+ years.
