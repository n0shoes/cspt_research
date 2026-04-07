# 1. Route Definitions in Ember.js

## How Routes Are Defined

Ember uses `Router.map()` with a DSL callback. The DSL (`@ember/routing/lib/dsl.js`) processes route names and path options, then feeds them to `route-recognizer.add()`.

```javascript
// app/router.js
Router.map(function () {
  this.route('user', { path: '/users/:user_id' });           // dynamic segment
  this.route('product', { path: '/shop/:category/:product_id' }); // multi-param
  this.route('document', { path: '/docs/*doc_path' });        // wildcard catch-all
  this.route('dashboard', function () {                       // nested routes
    this.route('stats');
    this.route('settings');
  });
});
```

## Route Types and Their Segment Handling

### Static Segments
Path: `/about`
Regex: Exact string match (escaped)
Param access: None

### Dynamic Segments (`:param`)
Path: `/users/:user_id`
Regex: `([^/]+)` -- matches one segment, excludes `/`
Param access: `params.user_id` in model hook
Decoding: `decodeURIComponent()` applied when `ENCODE_AND_DECODE_PATH_SEGMENTS=true`

### Star/Wildcard Segments (`*param`)
Path: `/docs/*doc_path`
Regex: `(.+)` -- matches everything including `/`
Param access: `params.doc_path` in model hook
Decoding: NOT decoded via `decodeURIComponent` (shouldDecodes is false for star segments)
Pre-processing: Path is normalized via `normalizePath()` before regex matching

### Nested Routes
Path: `/dashboard/stats`
Combined from parent + child paths
Each level has its own route handler with its own model hook

## What Survives Production Build

Tested with Ember 6.11 + Vite 7.3.1 production build:

**Preserved in minified bundle:**
- Route path patterns: `/users/:user_id`, `/docs/*doc_path`, etc. (string literals)
- Route names: `user`, `product`, `document`, `dashboard.stats`, etc.
- `ENCODE_AND_DECODE_PATH_SEGMENTS` flag name (4 occurrences)
- `fetch()` call targets with template literals
- `encodeURIComponent` / `decodeURIComponent` references
- `normalizePath` / `normalizeSegment` function references

**In index.html:**
- `<meta name="{appName}/config/environment">` with URL-encoded JSON config
- `locationType` value (history/hash/none)
- `rootURL` value
- `@embroider/virtual/vendor.js` script tag
- Module prefix in meta tag

**Detection regexes for Ember route patterns in minified JS:**
```
# Dynamic params
/\/:[\w_]+/

# Wildcard params
/\/\*[\w_]+/

# Route definition patterns (route names as strings)
/"([\w.-]+)"\s*,\s*\{?\s*path:\s*"/

# Ember fingerprints
/ENCODE_AND_DECODE_PATH_SEGMENTS/
/normalizeSegment/
/route-recognizer/
```

## Route Registration Pipeline

1. `Router.map(callback)` invokes DSL
2. DSL calls `matcher.add(path, routeName)` for each route
3. `eachRoute()` collects all route arrays
4. `recognizer.add(routes, { as: handler })` registers with route-recognizer
5. `parse()` in route-recognizer splits path on `/`, classifies segments:
   - `:` prefix → Dynamic (type 1)
   - `*` prefix → Star (type 2)
   - Empty → Epsilon (type 4)
   - Otherwise → Static (type 0)
6. State machine built character-by-character
7. Regex pattern compiled: Static=literal, Dynamic=`([^/]+)`, Star=`(.+)`

## DSL Implementation Details

Source: `ember-source/dist/packages/@ember/routing/lib/dsl.js`

- Route names cannot contain `:` (assertion check)
- `loading` and `error` sub-routes auto-created when `enableLoadingSubstates` is true
- Index route auto-created if not explicitly defined
- Nested routes combine parent path + child path via string concatenation
- The `push()` method stores `[url, name, callback]` tuples in `matches` array
