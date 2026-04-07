# Angular CSPT Empirical Research

## Key Takeaway

**Angular is architecturally DIFFERENT from React/Vue but EQUALLY EXPLOITABLE for CSPT.** The `UrlParser` splits on literal `/` first (before decoding), which means `%2F` stays as part of the segment during route matching. However, `decode()` (= `decodeURIComponent`) is called on the matched segment BEFORE storing in `paramMap`. **Empirical result: `paramMap.get('userId')` returns `"../../admin"` for URL `/users/..%2F..%2Fadmin` — fully decoded including slashes.** CSPT works identically to React at the HTTP layer.

## Framework: Angular 21.2.1

## Critical Findings

### 1. `%2F` Routing Preservation → Full Decode in paramMap (EMPIRICALLY VERIFIED)
Angular's `SEGMENT_RE = /^[^\/()?;#]+/` regex treats `%2F` as three characters (`%`, `2`, `F`), so it stays in a single segment during routing — unlike React Router which would split on the decoded `/`. However, `decode()` (`decodeURIComponent`) runs AFTER segment matching, so `paramMap.get('userId')` returns **fully decoded** values including slashes.

**Empirical browser test results (Angular 21.2.1):**
- URL `/encoding-test/hello%2Fworld` → `paramMap.get('testParam')` = `"hello/world"` (DECODED)
- URL `/encoding-test/..%2Fapi%2Fadmin` → `paramMap.get('testParam')` = `"../api/admin"` (DECODED)
- URL `/encoding-test/hello%252Fworld` → `paramMap.get('testParam')` = `"hello%2Fworld"` (single decode)
- URL `/encoding-test/hello%00world` → `paramMap.get('testParam')` = `"hello\0world"` (null byte passes)

**The routing-level preservation of `%2F` is irrelevant for CSPT** because the decode happens before `paramMap` is exposed to developer code. CSPT works identically to React/Vue at the HTTP layer.

### 2. `SEGMENT_RE` is the Gate
The regex `/^[^\/()?;#]+/` at line 430 is the critical control point. It defines what constitutes a "segment" and stops at literal `/`, `(`, `)`, `?`, `;`, `#`. Any percent-encoded version of these characters passes through.

### 3. Query Parameters are the Bigger Surface
Angular's router decodes query params via `decodeQuery()` (which replaces `+` with `%20` then calls `decodeURIComponent`). Query params are never split on `/` so they have a larger CSPT attack surface than path params.

### 4. `router.navigate()` Double-Encoding
`router.navigate([value])` passes values through `createUrlTree` which calls `encodeUriSegment()` on each path segment. If the value already contains `%`-encoding, the `%` gets re-encoded to `%25`. This is NOT idempotent.

### 5. No Catch-All with Sub-Path Capture
Angular's `**` wildcard matches any URL but consumes ALL remaining segments without providing sub-path params. There is no equivalent to React Router's `*` splat that captures sub-paths as a single string.

### 6. `bypassSecurityTrustHtml` is the XSS Key
Angular's built-in sanitizer strips dangerous content from `[innerHTML]` bindings. For CSPT -> XSS chains, the application must explicitly call `bypassSecurityTrustHtml()` on fetched content. This is a common pattern that developers use when they trust their own API responses.

## Research Files

| File | Contents |
|------|----------|
| [01-route-definitions.md](01-route-definitions.md) | Route definition methods, minification survival, detection |
| [02-source-to-sink.md](02-source-to-sink.md) | All CSPT sources and sinks with minified patterns |
| [03-encoding-behavior.md](03-encoding-behavior.md) | Full decoding pipeline from source code analysis |
| [04-encoding-matrix.md](04-encoding-matrix.md) | Complete encoding test matrix |
| [05-caido-patterns.md](05-caido-patterns.md) | Regex patterns for Caido detection |
| [06-appendix.md](06-appendix.md) | Source references, lab structure, build analysis |

## Lab App

Located at `/Users/jonathandunn/Desktop/ctbbp/angular-cspt-lab/`

Build: `cd angular-cspt-lab && npx ng build --configuration production`

Production output: `dist/angular-cspt-lab/browser/`
