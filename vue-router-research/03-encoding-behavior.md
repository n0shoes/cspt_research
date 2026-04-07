# 03 - Vue Router v4 Encoding Behavior

## The Complete Decoding Pipeline

### Step 1: URL Enters the Browser
Browser navigates to: `/users/..%2F..%2Fadmin`

`window.location.pathname` = `/users/..%2F..%2Fadmin` (ENCODED, preserved by browser)

### Step 2: `createCurrentLocation()` Extracts Path
**File:** `vue-router.mjs` line 16-26

```javascript
function createCurrentLocation(base, location) {
    const { pathname, search, hash } = location;
    // ... hash mode handling ...
    return stripBase(pathname, base) + search + hash;
}
```

Returns: `/users/..%2F..%2Fadmin` (still ENCODED -- comes from `location.pathname`)

### Step 3: `parseURL()` Processes the Path
**File:** `devtools-EWN81iOl.mjs` line 193-214

```javascript
function parseURL(parseQuery, location, currentLocation = "/") {
    let path, query = {}, searchString = "", hash = "";
    // ... extract path, query, hash ...
    path = resolveRelativePath(path != null ? path : location, currentLocation);
    return {
        fullPath: path + searchString + hash,  // ENCODED
        path,                                    // ENCODED
        query,                                   // DECODED (by parseQuery)
        hash: decode(hash)                       // DECODED
    };
}
```

`path` stays ENCODED at this point. `hash` gets decoded.

### Step 4: Matcher Resolves Route
**File:** `vue-router.mjs` line 700-746

```javascript
function resolve(location, currentLocation) {
    // ...
    matcher = matchers.find((m) => m.re.test(path));  // regex against ENCODED path
    if (matcher) {
        params = matcher.parse(path);  // extracts from ENCODED path
        // ...
    }
}
```

The `parse()` function (line 487-496):
```javascript
function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match) return null;
    for (let i = 1; i < match.length; i++) {
        const value = match[i] || "";
        const key = keys[i - 1];
        params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
}
```

At this point params contain ENCODED values from the regex match.

For catch-all `(.*)`: captures `..%2F..%2Fadmin`
For repeatable `+`: if multiple `/`-separated segments, splits into array

### Step 5: `decodeParams()` Decodes Everything
**File:** `vue-router.mjs` line 1172, 1205

```javascript
const decodeParams = applyToParams.bind(null, decode);
// ...
return assign(locationNormalized, matchedRoute, {
    params: decodeParams(matchedRoute.params),  // LINE 1205
    hash: decode(locationNormalized.hash),
    // ...
});
```

`applyToParams` (devtools module, line 35-42):
```javascript
function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
        const value = params[key];
        newParams[key] = isArray(value) ? value.map(fn) : fn(value);
    }
    return newParams;
}
```

The `decode()` function (devtools module, line 170-178):
```javascript
function decode(text) {
    if (text == null) return null;
    try {
        return decodeURIComponent("" + text);
    } catch (err) {
        // dev warning
    }
    return "" + text;
}
```

Result: ALL params get `decodeURIComponent()` applied.

`..%2F..%2Fadmin` -> `../../admin`

For arrays (catch-all/repeatable): each element gets decoded individually via `.map(decode)`.

## The Key Split: Params vs Path

| Property | Encoded? | Source |
|----------|----------|--------|
| `route.params.X` | **DECODED** | `decodeParams()` at line 1205/1228 |
| `route.path` | **ENCODED** | From `parseURL()`, never decoded |
| `route.fullPath` | **ENCODED** | `path + searchString + hash` |
| `route.query.X` | **DECODED** | `parseQuery()` at line 201 |
| `route.hash` | **DECODED** | `decode()` at line 1206 |

This is the most **explicit and predictable** encoding split of any major framework. React Router also decodes params, but Vue Router's API makes it clearer by providing both `route.params` (decoded) and `route.path` (encoded) as first-class properties.

## Catch-All `/:pathMatch(.*)*` Behavior

### Array Splitting
The catch-all regex captures everything after the prefix. The `parse()` function checks `key.repeatable`:

```javascript
params[key.name] = value && key.repeatable ? value.split("/") : value;
```

For `(.*)*` (repeatable + optional), the captured string is split on literal `/`.

### Encoding Implications

| URL | Captured (encoded) | Array after split | After decode |
|-----|--------------------|-------------------|--------------|
| `/files/a/b/c` | `a/b/c` | `["a", "b", "c"]` | `["a", "b", "c"]` |
| `/files/a%2Fb/c` | `a%2Fb/c` | `["a%2Fb", "c"]` | `["a/b", "c"]` |
| `/files/..%2F..%2Fadmin` | `..%2F..%2Fadmin` | `["..%2F..%2Fadmin"]` | `["../../admin"]` |

Key insight: `%2F` in the URL does NOT cause splitting. Only literal `/` splits. After decode, `%2F` becomes `/` inside a single array element.

## Repeatable Params `/:chapters+` Behavior

Similar to catch-all but requires at least one segment:

| URL | Type | Value |
|-----|------|-------|
| `/docs/intro` | string | `"intro"` |
| `/docs/intro/advanced` | array | `["intro", "advanced"]` |
| `/docs/..%2F..%2Fadmin` | string | `"../../admin"` |

The type inconsistency (string vs array) means developers often have:
```javascript
const path = Array.isArray(chapters) ? chapters.join('/') : chapters
```
Both branches flow decoded values into fetch URLs.

## `router.push()` Encoding Asymmetry

### String Path (line 1196-1209)
```javascript
if (typeof rawLocation === "string") {
    const locationNormalized = parseURL(parseQuery, rawLocation, currentLocation.path);
    const matchedRoute = matcher.resolve({ path: locationNormalized.path }, currentLocation);
    // ...
    params: decodeParams(matchedRoute.params),
}
```
String paths are passed through `parseURL()` which preserves encoding. The developer must provide an already-encoded string.

### Params Object (line 1219-1222)
```javascript
else {
    const targetParams = assign({}, rawLocation.params);
    // ...
    matcherLocation = assign({}, rawLocation, { params: encodeParams(targetParams) });
}
```
Params objects get auto-encoded via `encodeParams()` which calls `encodeParam()`:

```javascript
function encodeParam(text) {
    return encodePath(text).replace(SLASH_RE, "%2F");
}
```

This means `router.push({ name: 'user', params: { userId: '../../admin' } })` will encode the traversal:
`encodeParam('../../admin')` -> `..%2F..%2Fadmin` -> encoded in the URL -> then decoded back on the receiving end.

**The asymmetry:** `router.push('/users/../../admin')` does NOT encode the path. The literal `../` sequences remain, and the browser resolves them. This is the exploitable path.

## Hash Encoding Bug (Issue #2187)

### The Mismatch
`parseURL()` decodes hash:
```javascript
hash: decode(hash)  // decodeURIComponent
```

`NEW_stringifyURL()` / display re-encodes with:
```javascript
return path + (searchText && "?") + searchText + encodeHash(hash);
```

`encodeHash()` uses `commonEncode()` which uses `encodeURI()`:
```javascript
function commonEncode(text) {
    return text == null ? "" : encodeURI("" + text).replace(...);
}
```

`encodeURI` does NOT encode: `; , / ? : @ & = + $ - _ . ! ~ * ' ( )`
`encodeURIComponent` DOES encode: `; , / ? : @ & = + $`

So if a hash contains characters like `;/?:@&=+$`, they survive through `encodeHash` but would not survive through `encodeURIComponent`.

### Impact
Mostly cosmetic, but can affect hash-based routing and hash-injected data. The maintainers marked this as wontfix.

## Double Encoding Behavior

| Input URL | `route.params` | `route.path` | Notes |
|-----------|---------------|--------------|-------|
| `/users/test` | `"test"` | `/users/test` | Normal |
| `/users/..%2F..%2Fadmin` | `"../../admin"` | `/users/..%2F..%2Fadmin` | Single-encoded traversal |
| `/users/..%252F..%252Fadmin` | `"..%2F..%2Fadmin"` | `/users/..%252F..%252Fadmin` | Double-encoded: one decode layer |
| `/users/%2e%2e%2f%2e%2e%2fadmin` | `"../../admin"` | `/users/%2e%2e%2f%2e%2e%2fadmin` | Dot-encoded traversal |

Double encoding (`%252F`) only decodes one layer, leaving `%2F` in the param value. This is a common WAF bypass pattern -- if the server double-decodes, the traversal reaches the backend.
