# 4. Encoding Matrix for Ember route-recognizer

Route-recognizer v0.3.4 uses `normalizePath()` → `decodeURIComponent()` + re-encode reserved chars, then `findHandler()` → `decodeURIComponent()` for dynamic params. Star params skip the final decode.

## Standard Percent Encoding

| Input in URL | After normalizePath | Dynamic `:param` value | Star `*param` value | Traversal? |
|-------------|--------------------|-----------------------|--------------------|-----------|
| `..%2f..%2fadmin` | `..%2F..%2Fadmin` | `../../admin` | `..%2F..%2Fadmin` | YES (dynamic), Partial (star) |
| `%2e%2e%2f%2e%2e%2fadmin` | `..%2F..%2Fadmin` | `../../admin` | `..%2F..%2Fadmin` | YES (dynamic) |
| `%2e%2e/admin` | `../admin` | N/A (extra segment) | `../admin` | YES (star only) |
| `..%2fadmin` | `..%2Fadmin` | `../admin` | `..%2Fadmin` | YES (dynamic) |
| `foo%2fbar` | `foo%2Fbar` | `foo/bar` | `foo%2Fbar` | YES (dynamic) |
| `hello` | `hello` | `hello` | `hello` | No |
| `%252e%252e%252f` | `%2e%2e%2f` | `../` | `%2e%2e%2f` | YES (dynamic, double-encoded) |
| `%252f` | `%2f` | `/` | `%2f` | YES (dynamic, double-encoded) |

**Key finding for dynamic params:** Both `..%2f` and `%2e%2e%2f` decode to `../` in the final param value. Double-encoding (`%252f`) also works because normalizePath decodes `%25` to `%`, creating `%2f`, which is re-encoded to `%2F`, then findHandler decodes to `/`.

**Key finding for star params:** Star params do NOT get the final `decodeURIComponent()` call. The value reflects the normalized path. Literal `../` works (since `(.+)` captures it), but `%2f` remains encoded.

## Overlong UTF-8

| Encoding | Target | After normalizePath | Exploitable? |
|----------|--------|--------------------|----|
| `%C0%AF` (2-byte overlong `/`) | `/` | Error → raw preserved | NO - decodeURIComponent rejects |
| `%E0%80%AF` (3-byte overlong `/`) | `/` | Error → raw preserved | NO |
| `%C0%AE` (2-byte overlong `.`) | `.` | Error → raw preserved | NO |
| `%C0%AE%C0%AE%C0%AF` (overlong `../`) | `../` | Error → raw preserved | NO |

**Why:** `decodeURIComponent()` is strict and throws `URIError` on invalid UTF-8. Route-recognizer's `normalizeSegment()` does not catch this error -- it would propagate. However, browsers typically won't produce these in `location.pathname`.

## Unicode Homoglyphs

| Character | Codepoint | After normalizePath | Treated as `.` or `/`? |
|-----------|-----------|--------------------|----|
| `．` FULLWIDTH FULL STOP | U+FF0E | `．` (preserved) | NO |
| `／` FULLWIDTH SOLIDUS | U+FF0F | `／` (preserved) | NO |
| `．．／` fullwidth `../` | U+FF0E+FF0E+FF0F | `．．／` (preserved) | NO |
| `․` ONE DOT LEADER | U+2024 | `․` (preserved) | NO |
| `‥` TWO DOT LEADER | U+2025 | `‥` (preserved) | NO |

**Why:** `decodeURIComponent()` does not perform Unicode normalization. These codepoints are valid UTF-8 but are NOT equivalent to ASCII `.` or `/` at any point in the pipeline. However, if a backend applies NFKC normalization, fullwidth chars could become ASCII traversal.

## Backslash Variants

| Input | After normalizePath | Dynamic param | Traversal? |
|-------|--------------------|----|---|
| `..%5c..%5cadmin` | `..\..\admin` | `..\..admin` | NO for path traversal (backslash not a separator) |
| `%5c` | `\` | `\` | NO - not a path separator in URLs |

**Why:** URL path resolution only treats `/` as a separator. Backslashes are literal characters. However, some Windows-based servers may interpret `\` as `/`.

## Fragment Termination

| Input | After normalizePath | Effect |
|-------|--------------------|----|
| `payload%23garbage` | `payload` (hash stripped) | YES - `%23` decoded to `#`, then recognize() strips everything after `#` |
| `payload%2523garbage` | `payload%23garbage` | Partial - double-encoded `#` becomes literal `%23` after one decode |

**Why:** `recognize()` strips `#` and everything after it BEFORE normalization. But `%23` is decoded during normalization, creating a `#` that was already past the stripping step. Actually, checking the code more carefully:

```javascript
// recognize() order:
var hashStart = path.indexOf("#");      // Step 1: strip hash
if (hashStart !== -1) path = path.substr(0, hashStart);
// ... then later:
path = normalizePath(path);             // Step 2: normalize
```

So `#` is stripped BEFORE normalization. `%23` is NOT `#` at strip time, so it passes through. Then normalization decodes `%23` to `#`. But `#` after normalization is just a regular character in the state machine. Route-recognizer's state machine matches individual characters, so `#` would need to match a literal `#` in the route pattern -- which won't happen for dynamic/star segments.

Actually, for dynamic `([^/]+)`: `#` matches (it's not `/`)
For star `(.+)`: `#` matches

So `%23` is decoded to `#` and included in the param value. NOT a truncation point.

**Correction:** Fragment termination via `%23` does NOT work in Ember's route-recognizer because `%23` is decoded AFTER the `#`-stripping step.

## Tab and Special Whitespace

| Input | After normalizePath | Param value | Notes |
|-------|--------------------|----|---|
| `.%09.%2f` | `.	.%2F` (tab between dots) | `".\t./"` | Tab injected but not traversal |
| `..%0d%0a..%2fadmin` | `..\r\n..%2Fadmin` | `..\r\n../admin` | CRLF injection possible downstream |

## Wildcard `*path` Specific Behavior

Wildcard routes capture across `/` boundaries. This is the highest-risk CSPT vector.

| URL | `*doc_path` value | Notes |
|-----|------------------|-------|
| `/docs/readme` | `readme` | Normal |
| `/docs/path/to/file` | `path/to/file` | Slashes captured |
| `/docs/../../etc/passwd` | `../../etc/passwd` | Direct traversal |
| `/docs/..%2f..%2fetc` | `..%2F..%2Fetc` | Encoded (no final decode for star) |
| `/docs/a/b/../c` | `a/b/../c` | Literal `../` captured |

**Critical:** For wildcard routes, literal `../` is the most effective payload because:
1. `(.+)` captures everything
2. No final `decodeURIComponent()` for star params
3. The path is already browser-decoded, so `../` is literal

## Hash Routing Matrix

When `locationType: 'hash'`:

| Hash URL | getURL() returns | After recognize | Notes |
|----------|-----------------|----------------|-------|
| `/#/users/hello` | `/users/hello` | Match, param=`hello` | Normal |
| `/#/users/..%2fadmin` | `/users/..%2fadmin` | Match, param=`../admin` | Browser may or may not decode hash |
| `/#/users/../admin` | `/users/../admin` | NO match (extra segment) | Browser resolves `../` in hash? (implementation-dependent) |

**Key difference:** `location.hash` encoding behavior varies by browser. Some browsers decode percent-encoding in hash, others preserve it. This creates inconsistent CSPT exploitability across browsers for hash-routed Ember apps.
