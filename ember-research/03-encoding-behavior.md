# 3. Encoding Behavior in Ember's Routing Pipeline

## The Decoding Pipeline

Ember's routing uses a multi-stage pipeline where encoding/decoding happens at specific points. Understanding this is critical for CSPT exploitation.

### Stage 1: Browser URL Decoding

The browser automatically decodes `location.pathname` for most percent-encoded characters, with two exceptions:
- `%2f` → remains `%2f` (would change path structure)
- `%25` → remains `%25` (would create ambiguity)

Everything else (`%41` → `A`, `%2e` → `.`, etc.) is decoded by the browser before JavaScript sees it.

### Stage 2: HistoryLocation.getURL()

Source: `ember-source/dist/packages/@ember/routing/history-location.js:119-137`

```javascript
getURL() {
  let path = location.pathname;
  // Remove baseURL and rootURL prefixes
  let url = path.replace(/^baseURL/, '').replace(/^rootURL/, '').replace(/\/\//g, '/');
  let search = location.search || '';
  url += search + this.getHash();
  return url;
}
```

No additional decoding. Passes `location.pathname` through with prefix stripping.

### Stage 3: route-recognizer.recognize(path)

Source: `route-recognizer/dist/route-recognizer.es.js:618-673`

```javascript
recognize(path) {
  // Strip hash fragment
  let hashStart = path.indexOf("#");
  if (hashStart !== -1) path = path.substr(0, hashStart);

  // Strip query string
  let queryStart = path.indexOf("?");
  if (queryStart !== -1) { /* parse query, truncate path */ }

  // Ensure leading slash
  if (path.charAt(0) !== "/") path = "/" + path;

  let originalPath = path;

  // CRITICAL: Normalize path encoding
  if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) {
    path = normalizePath(path);  // decode + re-encode reserved
  } else {
    path = decodeURI(path);
    originalPath = decodeURI(originalPath);
  }

  // Strip trailing slash
  // ... then character-by-character state machine matching
}
```

### Stage 3a: normalizePath() -- The Key Function

Source: `route-recognizer.es.js:100-113`

```javascript
function normalizePath(path) {
  return path.split("/").map(normalizeSegment).join("/");
}

var SEGMENT_RESERVED_CHARS = /%|\//g;

function normalizeSegment(segment) {
  if (segment.length < 3 || segment.indexOf("%") === -1) return segment;
  return decodeURIComponent(segment).replace(SEGMENT_RESERVED_CHARS, encodeURIComponent);
}
```

This function:
1. Splits on `/` (literal slash is a segment boundary)
2. For each segment: `decodeURIComponent()` then re-encode `%` and `/`
3. Rejoins with `/`

**Implications:**
- `%2e%2e` in a segment → decoded to `..` → stays as `..` (re-encode only touches `%` and `/`)
- `%2f` in a segment → decoded to `/` → re-encoded back to `%2F` (preserved!)
- `%252e` → decoded to `%2e` → the `%` re-encoded to `%25` → `%252e` → NO TRAVERSAL

### Stage 4: State Machine Matching

The normalized path is matched character-by-character against the state machine.

For dynamic `:param` segments: regex `([^/]+)` -- rejects `/`
For star `*param` segments: regex `(.+)` -- accepts everything

This means:
- `:param` with a `%2F` that survived normalization (re-encoded to `%2F`) won't match the `([^/]+)` regex either, since `%2F` is 3 chars none of which are `/`. BUT the segment was split on literal `/` BEFORE normalization, so `%2f` would need to be in the segment, get decoded to `/`, get re-encoded to `%2F`, and then the segment would contain `%2F` which matches `([^/]+)`. Actually, let me trace more carefully...

**Tracing `%2f` through normalizePath:**
1. URL: `/users/foo%2fbar`
2. `path.split("/")` → `["", "users", "foo%2fbar"]`
3. `normalizeSegment("foo%2fbar")` → `decodeURIComponent("foo%2fbar")` → `"foo/bar"` → `.replace(/%|\//g, encodeURIComponent)` → `"foo%2Fbar"`
4. `join("/")` → `"/users/foo%2Fbar"`
5. State machine matches character-by-character: `f`, `o`, `o`, `%`, `2`, `F`, `b`, `a`, `r`
6. For `:user_id` regex `([^/]+)`: captures `foo%2Fbar` (no literal `/`)
7. **findHandler decodes**: `decodeURIComponent("foo%2Fbar")` → `"foo/bar"`

So `params.user_id` = `"foo/bar"` (contains literal `/`). This IS a CSPT vector for dynamic params!

**Tracing `../` traversal through normalizePath:**
1. URL: `/users/..%2fadmin`
2. `path.split("/")` → `["", "users", "..%2fadmin"]`
3. `normalizeSegment("..%2fadmin")` → `decodeURIComponent("..%2fadmin")` → `"../admin"` → re-encode → `"..%2Fadmin"`
4. State machine sees: `.`, `.`, `%`, `2`, `F`, `a`, `d`, `m`, `i`, `n`
5. `:user_id` regex `([^/]+)`: captures `..%2Fadmin`
6. **findHandler decodes**: `decodeURIComponent("..%2Fadmin")` → `"../admin"`

So `params.user_id` = `"../admin"`. **Traversal payload delivered.**

### Stage 5: findHandler() -- Final Decode

Source: `route-recognizer.es.js:412-450`

```javascript
function findHandler(state, originalPath, queryParams) {
  var captures = originalPath.match(regex);
  // ...
  for (var j = 0; j < names.length; j++) {
    var capture = captures[currentCapture++];
    if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS && shouldDecodes[j]) {
      params[name] = capture && decodeURIComponent(capture);
    } else {
      params[name] = capture;
    }
  }
}
```

**Critical detail:** `shouldDecodes[j]` is `true` for Dynamic segments, `false` for Star segments.

For Dynamic (`:param`): `decodeURIComponent(capture)` applied
For Star (`*param`): Raw capture used (but path was already normalized)

### Stage 6: Model Hook

```javascript
// UnresolvedRouteInfoByParam.getModel()
if (route.model) {
  result = route.model(fullParams, transition);
}
```

The fully decoded params object is passed to the model hook.

## Hash Location Differences

Source: `ember-source/dist/packages/@ember/routing/hash-location.js:63-78`

```javascript
getURL() {
  let originalPath = this.getHash().substring(1);
  let outPath = originalPath;
  if (outPath[0] !== '/') {
    outPath = '/';
    if (originalPath) outPath += `#${originalPath}`;
  }
  return outPath;
}
```

For hash routing:
- The URL is `/#/users/:user_id`
- `location.hash` is fully client-controlled (never sent to server)
- Browser does NOT decode `location.hash` the way it decodes `location.pathname`
- `%2f` in hash remains `%2f` until route-recognizer processes it

This means hash routing may have slightly different encoding behavior: the browser's initial decode step is skipped, so double-encoding attacks may work differently.

## The serialize/model Hook Symmetry Issue

Ember GitHub Issue #11497: serialize and model hooks should be inverses.

- `model(params)` converts URL params → model
- `serialize(model)` converts model → URL params

If a model's ID contains `/`:
1. `serialize({ id: 'foo/bar' })` produces `{ user_id: 'foo/bar' }`
2. Route-recognizer's `generate()` for Dynamic segments calls `encodePathSegment(value)` when `ENCODE_AND_DECODE_PATH_SEGMENTS=true`
3. `encodePathSegment('foo/bar')` → `encodeURIComponent('foo/bar')` → `foo%2Fbar` → then decodes sub-delimiters → `foo%2Fbar`
4. Generated URL: `/users/foo%2Fbar`

When this URL is visited:
5. `normalizePath` processes it (see trace above)
6. `params.user_id` = `"foo/bar"` (round-tripped correctly)

So the symmetry IS maintained for Dynamic segments with `ENCODE_AND_DECODE_PATH_SEGMENTS=true`. But for Star segments, `generate()` does NOT encode:

```javascript
generate[2 /* Star */] = function (segment, params) {
  return getParam(params, segment.value); // No encoding!
};
```

This means star segments produce URLs with literal `/` which changes the path structure.

## Summary Table

| Input | normalizePath output | Route Match? | params value |
|-------|---------------------|--------------|-------------|
| `/users/hello` | `/users/hello` | Yes (:param) | `"hello"` |
| `/users/..%2fadmin` | `/users/..%2Fadmin` | Yes (:param) | `"../admin"` |
| `/users/%2e%2e%2fadmin` | `/users/..%2Fadmin` | Yes (:param) | `"../admin"` |
| `/users/foo%2fbar` | `/users/foo%2Fbar` | Yes (:param) | `"foo/bar"` |
| `/users/foo/bar` | `/users/foo/bar` | NO (extra segment) | N/A |
| `/docs/a/b/c` | `/docs/a/b/c` | Yes (*path) | `"a/b/c"` |
| `/docs/../../etc` | `/docs/../../etc` | Yes (*path) | `"../../etc"` |
| `/docs/..%2f..%2fetc` | `/docs/..%2F..%2Fetc` | Yes (*path) | `"..%2F..%2Fetc"` |
| `/#/users/..%2fadmin` | (hash) varies | Yes | `"../admin"` |

**Key takeaway for dynamic params:** `..%2f` is the effective traversal payload. It survives normalization and gets decoded to `../` in the final params.

**Key takeaway for wildcard params:** Literal `../` works directly since `(.+)` captures everything. `%2f` variants also work but the final value retains the encoding since star segments skip the final decode.
