# 03 - Angular Encoding Behavior (Full Decoding Pipeline)

## Executive Summary

Angular's URL decoding pipeline is fundamentally different from React Router and Vue Router. The critical difference: **Angular splits on literal `/` FIRST, then decodes segments**. This means `%2F` is preserved within segment values (it never creates an actual path separator at the router level). However, when the decoded value containing `../` is interpolated into an HTTP request URL, the browser's HTTP stack resolves the traversal normally.

## The Full Pipeline (Source Code Analysis)

### Step 1: Browser Provides URL to Angular Router

The browser's `Location` service provides the current URL. Angular receives it as a raw string.

### Step 2: `DefaultUrlSerializer.parse()` (line 358-362)

```javascript
class DefaultUrlSerializer {
  parse(url) {
    const p = new UrlParser(url);
    return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
  }
}
```

This creates a `UrlParser` instance with the raw URL string.

### Step 3: `UrlParser.parseRootSegment()` (line 457-463)

```javascript
parseRootSegment() {
  this.consumeOptional('/');
  if (this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')) {
    return new UrlSegmentGroup([], {});
  }
  return new UrlSegmentGroup([], this.parseChildren());
}
```

Strips leading `/`, then delegates to `parseChildren()`.

### Step 4: `UrlParser.parseChildren()` (line 476-505)

```javascript
parseChildren(depth = 0) {
  if (depth > 50) throw new _RuntimeError(4010, 'URL is too deep');
  if (this.remaining === '') return {};
  this.consumeOptional('/');
  const segments = [];
  if (!this.peekStartsWith('(')) {
    segments.push(this.parseSegment());  // <-- KEY: parses one segment
  }
  while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
    this.capture('/');                     // <-- KEY: splits on literal '/'
    segments.push(this.parseSegment());
  }
  // ... handle children, parens
}
```

**CRITICAL**: The `while` loop splits on literal `/` characters. `%2F` is NOT a literal `/`, so it does not trigger a split. The `capture('/')` call consumes exactly the character `/`.

### Step 5: `UrlParser.parseSegment()` (line 506-513)

```javascript
parseSegment() {
  const path = matchSegments(this.remaining);  // <-- regex match
  if (path === '' && this.peekStartsWith(';')) {
    throw new _RuntimeError(4009, 'Empty path url segment cannot have parameters');
  }
  this.capture(path);
  return new UrlSegment(decode(path), this.parseMatrixParams());  // <-- decode AFTER match
}
```

### Step 6: `matchSegments()` / `SEGMENT_RE` (line 430-434)

```javascript
const SEGMENT_RE = /^[^\/()?;#]+/;
function matchSegments(str) {
  const match = str.match(SEGMENT_RE);
  return match ? match[0] : '';
}
```

**CRITICAL REGEX**: `/^[^\/()?;#]+/`

This regex matches any character that is NOT:
- `/` (literal forward slash)
- `(` or `)` (parentheses for named outlets)
- `?` (query string start)
- `;` (matrix parameter separator)
- `#` (fragment start)

Since `%2F` is the characters `%`, `2`, `F` -- none of which are in the exclusion set -- the regex MATCHES `%2F` as part of the segment.

### Step 7: `decode()` (line 412-413)

```javascript
function decode(s) {
  return decodeURIComponent(s);
}
```

**After** the segment is extracted (including `%2F`), it's decoded. So:
- `..%2F..%2Fadmin` as a matched segment -> decoded to `../../admin`
- This decoded value is stored in `UrlSegment.path`

### Step 8: Route Matching via `defaultUrlMatcher()` (line 58-100)

```javascript
function defaultUrlMatcher(segments, segmentGroup, route) {
  const parts = route.path.split('/');
  // ...
  const posParams = {};
  const consumed = segments.slice(0, parts.length);
  if (!matchParts(parts, consumed, posParams)) return null;
  return { consumed, posParams };
}
```

Route matching compares `UrlSegment.path` (decoded) against route definition parts. For `:param` patterns, the entire segment path becomes the param value.

### Step 9: `paramMap.get()` Returns Decoded Value

The `ActivatedRoute.paramMap` exposes the decoded `UrlSegment.path` value. So `paramMap.get('userId')` returns the fully decoded string.

## The Pipeline Illustrated

```
URL: /users/..%2F..%2Fadmin

Step 1: Browser -> "/users/..%2F..%2Fadmin"
Step 2: UrlParser receives: "users/..%2F..%2Fadmin"
Step 3: parseChildren() starts
Step 4: First segment matched by SEGMENT_RE: "users"
        capture('/') -- splits on literal /
        Second segment matched by SEGMENT_RE: "..%2F..%2Fadmin" (whole thing!)
Step 5: decode("users") -> "users"
        decode("..%2F..%2Fadmin") -> "../../admin"
Step 6: UrlSegment("users", {}), UrlSegment("../../admin", {})
Step 7: Route matching: "users" matches "users", "../../admin" matches ":userId"
Step 8: paramMap = { userId: "../../admin" }
Step 9: this.http.get(`/api/users/${userId}`)
        -> GET /api/users/../../admin
        -> Browser resolves to GET /admin
```

## The `%2F` Preservation Effect

For `/users/test%2Fvalue`:

| Framework | Segment Count | paramMap.get('userId') | HTTP Request |
|-----------|--------------|----------------------|--------------|
| **Angular** | 2 (`users`, `test%2Fvalue`) | `test/value` | `/api/users/test/value` |
| **React Router** | 3 (`users`, `test`, `value`) | `test` (only first segment) | `/api/users/test` |

For `/users/..%2F..%2Fadmin`:

| Framework | Segment Count | paramMap.get('userId') | HTTP Request |
|-----------|--------------|----------------------|--------------|
| **Angular** | 2 (`users`, `..%2F..%2Fadmin`) | `../../admin` | `/api/users/../../admin` -> `/admin` |
| **React Router** | 4 (`users`, `..`, `..`, `admin`) | Route mismatch (too many segments) | N/A |

**Key insight**: Angular's routing-level `%2F` preservation actually makes CSPT **easier** than React Router because the full traversal payload stays in a single segment (and matches a single `:param`), whereas React Router splits on decoded `/` and may break the route match with too many segments.

## Empirical Browser Test Results (Angular 21.2.1, Chrome)

**IMPORTANT: These results OVERRIDE any source-code-only predictions above.**

| URL Encoding | `paramMap.get('testParam')` | `window.location.pathname` | Exploitable? |
|-------------|---------------------------|---------------------------|-------------|
| `hello` | `hello` | `/encoding-test/hello` | Baseline |
| `hello%2Fworld` | `hello/world` | preserves `%2F` | **YES — slash decoded** |
| `..%2Fapi%2Fadmin` | `../api/admin` | preserves encoding | **YES — full traversal** |
| `hello%252Fworld` | `hello%2Fworld` | preserves `%252F` | Single decode only |
| `hello%00world` | `hello\0world` | preserves `%00` | **YES — null byte** |
| `?q=..%2F..%2Fadmin` | (query) `../../admin` | N/A | **YES — query decoded** |

**Critical correction:** The theoretical claim that "Angular preserves `%2F` in paramMap" is **WRONG at the developer-facing API level**. While `%2F` is preserved during route MATCHING (segment splitting), `decode()` = `decodeURIComponent()` runs on the segment value BEFORE it reaches `paramMap`. Developers see fully decoded values including slashes.

## `router.navigate()` Double-Encoding Bug

When using `router.navigate()` programmatically:

```typescript
this.router.navigate(['/users', '..%2F..%2Fadmin']);
```

The value passes through `createNewSegmentGroup()` which creates `new UrlSegment(curr, {})`. Then serialization calls `encodeUriSegment()`:

```javascript
function encodeUriSegment(s) {
  return encodeUriString(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
function encodeUriString(s) {
  return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
}
```

`encodeURIComponent('..%2F..%2Fadmin')` -> `..%252F..%252Fadmin` (the `%` gets encoded to `%25`)

This means `router.navigate()` is NOT idempotent for encoded values. A value that was decoded from the URL gets double-encoded when passed through navigate.

## `routerLink` Double-Encoding Issue

The `routerLink` directive has the same problem. Angular GitHub issue #50950 documents this:

```html
<!-- This double-encodes -->
<a [routerLink]="['/users', encodedValue]">Link</a>
```

If `encodedValue` contains `%2F`, the resulting URL will have `%252F`.

## `UrlSerializer` as Control Point

`UrlSerializer` is an injectable service. Applications can provide a custom implementation:

```typescript
@Injectable()
class CustomUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    // Custom parsing logic here
    return super.parse(url);
  }
  serialize(tree: UrlTree): string {
    // Custom serialization logic here
    return super.serialize(tree);
  }
}

// In app config:
{ provide: UrlSerializer, useClass: CustomUrlSerializer }
```

If an application provides a custom `UrlSerializer` that pre-decodes URLs or changes splitting behavior, the encoding behavior changes entirely. This is rare but worth checking.

## Query Parameter Encoding

Query parameters follow a separate path:

```javascript
parseQueryParam(params) {
  const key = matchQueryParams(this.remaining);    // QUERY_PARAM_RE = /^[^=?&#]+/
  this.capture(key);
  let value = '';
  if (this.consumeOptional('=')) {
    const valueMatch = matchUrlQueryParamValue(this.remaining);  // /^[^&#]+/
    if (valueMatch) {
      value = valueMatch;
      this.capture(value);
    }
  }
  const decodedKey = decodeQuery(key);    // decode() with + -> %20 replacement
  const decodedVal = decodeQuery(value);
  params[decodedKey] = decodedVal;
}
```

Query param values are matched by `/^[^&#]+/` -- they stop at `&` or `#` but NOT at `/`. Then decoded via `decodeQuery()`. This means query params preserve ALL path characters including `/`, making them a larger CSPT surface.

## Comparison with React Router

| Aspect | Angular Router | React Router v6 |
|--------|---------------|-----------------|
| URL splitting | Literal `/` first, then decode | Decode first, then split (browser does this) |
| `%2F` in params | Preserved in segment, decoded in paramMap | Causes extra segment split |
| `%2e%2e` handling | Decoded to `..` in segment path | Depends on browser URL normalization |
| Custom serializer | `UrlSerializer` injectable | No equivalent |
| Query param decoding | `decodeQuery()` with `+` handling | `new URLSearchParams()` |
| Double-encoding on navigate | Yes (documented bug) | No (navigate uses raw strings) |
| Wildcard capture | `**` consumes all, no param output | `*` captures sub-path as param |
