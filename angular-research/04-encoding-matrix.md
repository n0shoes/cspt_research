# 04 - Angular Encoding Matrix

## Path Parameter Encoding Matrix

Test URL pattern: `/encoding-test/{PAYLOAD}`

### Angular's Decoding Pipeline Recap
1. `SEGMENT_RE = /^[^\/()?;#]+/` matches segment (splits on literal `/`)
2. `decode()` = `decodeURIComponent()` applied to matched segment
3. Result stored in `UrlSegment.path` and exposed via `paramMap.get()`

| Input Payload | SEGMENT_RE Match | After decode() | paramMap.get() | Segments Created | Notes |
|---|---|---|---|---|---|
| `hello` | `hello` | `hello` | `hello` | 1 | Basic |
| `hello%20world` | `hello%20world` | `hello world` | `hello world` | 1 | Space decoded |
| `..%2F..%2Fadmin` | `..%2F..%2Fadmin` | `../../admin` | `../../admin` | 1 | **%2F preserved in segment, decoded in value** |
| `..%2f..%2fadmin` | `..%2f..%2fadmin` | `../../admin` | `../../admin` | 1 | Case-insensitive |
| `..%252F..%252Fadmin` | `..%252F..%252Fadmin` | `..%2F..%2Fadmin` | `..%2F..%2Fadmin` | 1 | Double-encoded: only one layer decoded |
| `test/value` | `test` (stops at `/`) | `test` | `test` | 2 (`test`, `value`) | Literal `/` splits |
| `test%2Fvalue` | `test%2Fvalue` | `test/value` | `test/value` | 1 | **%2F does NOT split** |
| `%2e%2e/%2e%2e/admin` | `%2e%2e` (stops at `/`) | `..` | Route mismatch | 4 | Literal `/` splits; `..` segments cause issues |
| `%2e%2e%2f%2e%2e%2fadmin` | `%2e%2e%2f%2e%2e%2fadmin` | `../../admin` | `../../admin` | 1 | **All encoded: single segment** |
| `test%3Fq=1` | `test%3Fq=1` | `test?q=1` | `test?q=1` | 1 | `?` encoded, stays in segment |
| `test%23fragment` | `test%23fragment` | `test#fragment` | `test#fragment` | 1 | `#` encoded, stays in segment |
| `test%3Bmatrix` | `test%3Bmatrix` | `test;matrix` | `test;matrix` | 1 | `;` encoded, stays in segment |
| `test;key=val` | `test` (stops at `;`) | `test` | `test` | 1 + matrix param | `;` triggers matrix param parsing |
| `test(aux:foo)` | `test` (stops at `(`) | `test` | `test` | 1 + named outlet | `(` triggers outlet parsing |
| `%5c..%5c..%5cadmin` | `%5c..%5c..%5cadmin` | `\..\..\admin` | `\..\..\admin` | 1 | Backslash: no traversal effect |
| `.%09.%2f.%09.%2fadmin` | `.%09.%2f.%09.%2fadmin` | `.\t./.\t./admin` | `.\t./.\t./admin` | 1 | Tab-encoded: preserved as single segment |

## Query Parameter Encoding Matrix

Test URL pattern: `/dashboard/stats?widget={PAYLOAD}`

### Query Param Pipeline
1. `QUERY_PARAM_VALUE_RE = /^[^&#]+/` matches value (stops at `&` or `#` only)
2. `decodeQuery()` = `s.replace(/\+/g, '%20')` then `decodeURIComponent()`

| Input Payload | Regex Match | After decodeQuery() | queryParamMap.get() | Notes |
|---|---|---|---|---|
| `test` | `test` | `test` | `test` | Basic |
| `..%2F..%2Fadmin` | `..%2F..%2Fadmin` | `../../admin` | `../../admin` | Decoded with `/` |
| `../../../admin` | `../../../admin` | `../../../admin` | `../../../admin` | Literal `/` preserved (not split) |
| `test/path/here` | `test/path/here` | `test/path/here` | `test/path/here` | `/` is allowed in query values |
| `test+space` | `test+space` | `test space` | `test space` | `+` -> space |
| `test%20space` | `test%20space` | `test space` | `test space` | Standard encoding |
| `%2e%2e%2f%2e%2e%2fadmin` | `%2e%2e%2f%2e%2e%2fadmin` | `../../admin` | `../../admin` | Fully encoded traversal |
| `test%26extra=1` | `test%26extra=1` | `test&extra=1` | `test&extra=1` | `&` encoded stays in value |
| `test&extra=1` | `test` (stops at `&`) | `test` | `test` | Literal `&` splits params |

## HTTP Request Impact Matrix

When param value flows into `this.http.get(\`/api/endpoint/${paramValue}\`)`:

| paramMap.get() Value | Constructed URL | Browser Resolves To | CSPT? |
|---|---|---|---|
| `123` | `/api/endpoint/123` | `/api/endpoint/123` | No |
| `../../admin` | `/api/endpoint/../../admin` | `/admin` | **YES** |
| `../../admin/secrets` | `/api/endpoint/../../admin/secrets` | `/admin/secrets` | **YES** |
| `..%2F..%2Fadmin` | `/api/endpoint/..%2F..%2Fadmin` | `/api/endpoint/..%2F..%2Fadmin` | No (stays encoded in URL) |
| `test/value` | `/api/endpoint/test/value` | `/api/endpoint/test/value` | Partial (extra path) |

**Key insight**: The CSPT works because `paramMap.get()` returns the DECODED value. When interpolated into a URL string, the decoded `../` characters cause path traversal at the HTTP level.

## `router.navigate()` Encoding Matrix

When value passes through `router.navigate(['/path', value])`:

| Input Value | encodeUriSegment() Output | Resulting URL | Notes |
|---|---|---|---|
| `hello` | `hello` | `/path/hello` | No encoding needed |
| `hello world` | `hello%20world` | `/path/hello%20world` | Space encoded |
| `../../admin` | `..%2F..%2Fadmin` | `/path/..%2F..%2Fadmin` | `/` gets encoded |
| `..%2F..%2Fadmin` | `..%252F..%252Fadmin` | `/path/..%252F..%252Fadmin` | **Double-encoded!** |
| `test/value` | `test%2Fvalue` | `/path/test%2Fvalue` | `/` encoded |
| `test?q=1` | `test%3Fq%3D1` | `/path/test%3Fq%3D1` | Special chars encoded |

## Encoding Functions Reference

### `encodeUriSegment()` (line 409-410)
```javascript
function encodeUriSegment(s) {
  return encodeUriString(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
```
Used for path segments during serialization. Encodes everything EXCEPT `@`, `:`, `$`, `,`, `&`.

### `encodeUriString()` (line 400-401)
```javascript
function encodeUriString(s) {
  return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
}
```
Base encoding function. Starts with `encodeURIComponent` then un-encodes specific safe chars.

### `encodeUriQuery()` (line 403-404)
```javascript
function encodeUriQuery(s) {
  return encodeUriString(s).replace(/%3B/gi, ';');
}
```
Used for query parameter keys and values. Additionally un-encodes `;`.

### `decode()` (line 412-413)
```javascript
function decode(s) {
  return decodeURIComponent(s);
}
```
Simple wrapper. Used for path segments and matrix params.

### `decodeQuery()` (line 415-416)
```javascript
function decodeQuery(s) {
  return decode(s.replace(/\+/g, '%20'));
}
```
Used for query params. Handles `+` as space (form encoding compat).

## Implications for CSPT Exploitation

### Path Params: CSPT Works but Differently
1. `%2F` encoding preserves the full payload in a single Angular segment
2. `paramMap.get()` returns decoded value with literal `/` characters
3. When interpolated into HTTP URL, browser resolves `../` traversal
4. Net effect: CSPT works the same as other frameworks at the HTTP layer, despite different router behavior

### Query Params: Larger Attack Surface
1. No splitting on `/` at any stage
2. `decodeQuery()` fully decodes all encoded characters
3. Literal `../` can be used directly (no encoding needed)
4. Query params are the preferred CSPT vector in Angular apps

### `router.navigate()`: Double-Encoding Prevents CSPT via Navigation
1. Values get encoded by `encodeUriSegment()` during serialization
2. Already-encoded values get double-encoded
3. This makes `router.navigate()` harder to exploit for CSPT
4. But `navigateByUrl()` with a string URL does NOT encode -- direct injection possible
