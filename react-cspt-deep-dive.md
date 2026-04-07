# React CSPT Deep Dive: Empirical Analysis

> Empirical validation of Client-Side Path Traversal in React Router v7.
> Built a real app, compiled it, tested encodings in-browser, read the source code.

---

## 1. All Client-Side Path Definition Methods

### Route Definition Styles in React Router v7

React Router v7 uses `createBrowserRouter()` with a route config array. Every style was tested:

| Style | Example | Compiled Form |
|-------|---------|---------------|
| Static | `path: "/about"` | `{path:"/about",element:De.jsx(HE,{})}` |
| Dynamic segment | `path: "/users/:userId"` | `{path:"/users/:userId",element:...}` |
| Optional segment | `path: "/:lang?/categories"` | `{path:"/:lang?/categories",element:...}` |
| Catch-all (splat) | `path: "/files/*"` | `{path:"/files/*",element:...}` |
| Nested dynamic | `path: "/teams/:teamId/members/:memberId"` | `{path:"/teams/:teamId/members/:memberId",...}` |
| Multiple params | `path: "/shop/:category/:productId"` | `{path:"/shop/:category/:productId",...}` |
| Layout + children | `path: "/dashboard", children: [...]` | `{path:"/dashboard",element:...,children:[...]}` |
| Index route | `{ index: true }` | `{index:!0,element:...}` |
| Lazy-loaded | `React.lazy(() => import("./LazyPage"))` | `ip.lazy(()=>L0(()=>import("./LazyPage-CWMNrFw5.js"),[]))` |
| Loader (data mode) | `loader: dataLoader` | `{path:"/data/:dataId",loader:DR,element:...}` |

### What Survives Minification

**ALWAYS preserved (string literals):**
- All `path:` values verbatim (e.g., `"/users/:userId"`)
- `:param` syntax, `*` splat, `?` optional markers
- `children:` array nesting
- `index:` key (value becomes `!0`)
- `loader:` key (function reference mangled)
- `element:` key
- `dangerouslySetInnerHTML` prop name
- All fetch URL strings and template literals
- `queryKey` and `queryFn` (TanStack Query option keys)
- Import paths for lazy chunks

**ALWAYS mangled (identifiers):**
- `useParams` → 2-letter (`ul` in main, `Z` in lazy chunk)
- `useSearchParams` → `cu`
- `useNavigate` → `Ic`
- `useLocation` → `Ta`
- `useLoaderData` → `dS`
- `createBrowserRouter` → `kS`
- `axios` → `ft`
- `React.lazy` → `ip.lazy`

**Framework fingerprints that survive:**
- `window.__reactRouterVersion="7.13.1"` - always present
- `window.__reactRouterContext` with `isSpaMode`
- Error strings: `"useLocation() may be used only in the context of a <Router>"`
- `dangerouslySetInnerHTML` - React prop, never minified

### Detection Regexes for Route Discovery

```
# React Router v7 fingerprint
window\.__reactRouterVersion=

# Route definitions with dynamic params
\{path:"[^"]*:[a-zA-Z]\w*[^"]*"

# Route definitions with splat
\{path:"[^"]*\*[^"]*"

# Any route definition
path:"(/[^"]+)"

# Nested route structure
children:\[.*\{path:

# Index route
index:!0

# Loader route
loader:\w+,\s*element:

# Lazy chunk import
import\("\.\/[A-Za-z]+-[A-Za-z0-9]+\.js"\)
```

---

## 2. Dynamic Parameters to Fetch (Source-to-Sink)

### All CSPT Sources

| Source | What it returns | CSPT Risk | Why |
|--------|----------------|-----------|-----|
| `useParams()` | **DECODED** values | **HIGH** | `%2F` → `/`, `%2E` → `.` via decodeURIComponent + line 811 |
| `useSearchParams().get()` | **DECODED** values | **HIGH** | URLSearchParams auto-decodes per URL spec |
| `useLocation().pathname` | **ENCODED** (raw) | LOW | Preserves `%2F`, `%2E` as-is |
| `window.location.pathname` | **ENCODED** (raw) | LOW | Browser preserves encoding |
| Route `loader({ params })` | **DECODED** values | **HIGH** | Same pipeline as useParams |
| `useLoaderData()` | Depends on loader | MEDIUM | If loader used params in fetch, tainted data flows through |
| `params["*"]` (splat) | **DECODED** + multi-segment | **CRITICAL** | Captures across `/` boundaries, full decode |

### All CSPT Sinks

| Sink Pattern | Example in Source | Minified Form | Risk |
|-------------|-------------------|---------------|------|
| `fetch()` template literal | `` fetch(`/api/users/${userId}`) `` | `` fetch(`/api/users/${n}`) `` | HIGH |
| `fetch()` concatenation | `fetch("/api/shop/" + category)` | `fetch("/api/shop/"+n+"/products/"+i)` | HIGH |
| `axios.get()` template | `` axios.get(`/api/teams/${teamId}`) `` | `` ft.get(`/api/teams/${n}/members/${i}`) `` | HIGH |
| `dangerouslySetInnerHTML` | `{__html: fetchedContent}` | `dangerouslySetInnerHTML:{__html:r}` | HIGH (XSS) |
| `navigate()` | `navigate(redirect)` | `Ic(n)` | MEDIUM (open redir) |
| API service layer | `apiService.get(`/settings/${id}`)` | `OR.get(`/settings/${n}`)` | HIGH |
| TanStack `queryFn` | `` queryFn: () => fetch(`/api/items/${id}`) `` | `` queryFn:()=>fetch(`/api/items/${t}`) `` | HIGH |
| Route `loader` | `` fetch(`/api/data/${params.dataId}`) `` | `` fetch(`/api/data/${n.dataId}`) `` | HIGH |

### Source-to-Sink Chains (How They Appear in Minified Bundles)

**Chain 1: useParams → fetch (template literal)** - Most common
```javascript
// Source → Sink in one scope
{userId:n}=ul(),[i,r]=z.useState(null);z.useEffect(()=>{fetch(`/api/users/${n}`)...},[n])
```
Detection: `\w+\(\).*fetch\(`[^`]*\$\{`

**Chain 2: useParams → fetch (concatenation)**
```javascript
{category:n,productId:i}=ul();...fetch("/api/shop/"+n+"/products/"+i)
```
Detection: `fetch\("[^"]+"\+\w+`

**Chain 3: useSearchParams → fetch → dangerouslySetInnerHTML (XSS chain)**
```javascript
[n]=cu(),i=n.get("widget");...fetch(`/api/widgets/${i}`).then(c=>c.text()).then(o)
...dangerouslySetInnerHTML:{__html:r}
```
Detection: `dangerouslySetInnerHTML:\{__html:\w\}` within same component as `fetch(`

**Chain 4: Splat param → fetch**
```javascript
i=ul()["*"];...fetch(`/api/files/${i}`)
```
Detection: `\w+\["\*"\]` near `fetch(`

**Chain 5: Route loader → fetch (server-like)**
```javascript
async function DR({params:n}){return(await fetch(`/api/data/${n.dataId}`)).json()}
```
Detection: `async function \w+\(\{params:\w+\}\).*fetch\(`

**Chain 6: TanStack Query → fetch**
```javascript
{itemId:t}=Z(),{data:e}=pt({queryKey:["item",t],queryFn:()=>fetch(`/api/items/${t}`)...})
```
Detection: `queryFn:\(\)=>fetch\(`

**Chain 7: API service layer abstraction**
```javascript
const OR={get:n=>fetch(`/api${n}`).then(i=>i.json())}
...OR.get(`/settings/${n}`)
```
Detection: `\{get:\w+=>\w*fetch\(` (service object pattern)

---

## 3. Encoding Behavior

### The React Router Decoding Pipeline

**Source:** `@remix-run/router v1.23.0` at `/node_modules/@remix-run/router/dist/router.js`

```
Browser URL
    |
    v
window.location.pathname (percent-encoded)
    |
    v
parsePath() [line 309-327] -- NO decoding, just splits path/search/hash
    |
    v
matchRoutesImpl() [line 523-543]
    |
    v
decodePath() [line 863-870] -- KEY: per-segment decodeURIComponent()
    |                            then re-encodes / back to %2F
    v
compilePath() [line 822-861] -- builds regex, :param = [^\\/]+, * = (.*)
    |
    v
matchPath() [line 782-821]
    |  LINE 811: .replace(/%2F/g, "/")  <-- UNDOES the re-encoding!
    v
params object (fully decoded, %2F = /)
    |
    v
useParams() returns decoded params
```

### `decodePath()` - The Defense That Gets Bypassed (line 863-870)

```javascript
function decodePath(value) {
  try {
    return value
      .split("/")                              // preserve structural /
      .map(v => decodeURIComponent(v)          // decode each segment
        .replace(/\//g, "%2F"))                // re-encode decoded / back to %2F
      .join("/");                              // rejoin
  } catch (error) {
    return value;  // fallback: return raw on malformed encoding
  }
}
```

This is an **anti-CSPT defense for route matching** - it prevents `%2F` from creating new path segments during regex matching. But `matchPath()` at line 811 **undoes it** for the extracted param values.

### `matchPath()` line 811 - The CSPT Primitive

```javascript
memo[paramName] = (value || "").replace(/%2F/g, "/");
```

After `decodePath()` carefully preserved `%2F`, this line converts it back to `/` in params. This affects ALL params including splats.

### Empirical Encoding Test Results

Tested in Chrome with React Router v7 dev server. Each row = one browser navigation.

#### Path Parameters (`:testParam`)

| URL Encoding | `useParams()` Value | `location.pathname` | Exploitable? |
|-------------|---------------------|---------------------|-------------|
| `hello` (baseline) | `hello` | `/encoding-test/hello` | - |
| `hello%2Fworld` | `hello/world` | preserves `%2F` | YES - slash injected |
| `%2E%2E%2Fapi%2Fadmin` | `../api/admin` | preserves encoding | YES - full traversal |
| `hello%252Fworld` | `hello/world` | preserves `%252F` | YES - DOUBLE DECODE |
| `hello%09world` | `hello\tworld` | preserves `%09` | YES - tab injected |
| `hello%00world` | `hello\0world` | preserves `%00` | YES - null byte passes through |
| `hello%23fragment` | `hello#fragment` | preserves `%23` | Decoded but not delimiter |
| `hello%3Fkey=val` | `hello?key=val` | preserves `%3F` | Decoded but not delimiter |
| `hello%5Cworld` | `hello\world` | preserves `%5C` | YES - backslash injected |

#### Splat Parameters (`params["*"]`)

| URL | `params["*"]` | Notes |
|-----|---------------|-------|
| `/encoding-splat/%2E%2E%2Fapi%2Fadmin` | `../api/admin` | Same decoding as named params |
| `/encoding-splat/path/to/../../api/admin` | `api/admin` | Browser normalized `../` BEFORE React Router |

#### Query Parameters (`searchParams.get()`)

| URL Query | `searchParams.get('q')` | Exploitable? |
|-----------|------------------------|-------------|
| `?q=%2E%2E%2Fapi%2Fadmin` | `../api/admin` | YES - single decode |
| `?q=%252E%252E%252F` | `%2E%2E%2F` | NO - only single decode |

### Critical Encoding Insights

1. **Path params double-decode**: `%252F` → `%2F` (decodeURIComponent) → `/` (line 811). Query params only single-decode.

2. **The double-decode path**: `decodePath()` calls `decodeURIComponent("%252F")` → `"%2F"`, then `matchPath()` line 811 calls `.replace(/%2F/g, "/")` → `"/"`. This is NOT two calls to decodeURIComponent - it's decode + string replace.

3. **Null bytes pass through**: `%00` → `\0` in params. No stripping. Potential for null byte injection on backends that handle C strings.

4. **Browser normalizes unencoded `../`**: If you put literal `../../` in the URL, the browser resolves it before React Router sees it. CSPT requires **encoded** traversal to bypass browser normalization.

5. **`useLocation().pathname` is the safe alternative**: It preserves encoding. Devs who use `location.pathname` for API calls are safe from CSPT (but almost nobody does this).

### End-to-End CSPT Proof

```
URL:     /users/%2E%2E%2Fapi%2Fadmin

Step 1:  React Router decodes useParams().userId = "../api/admin"
Step 2:  Component executes: fetch(`/api/users/${userId}`)
         = fetch("/api/users/../api/admin")
Step 3:  Browser normalizes ../: GET /api/api/admin

With correct depth: /users/%2E%2E%2F%2E%2E%2Fsecret-endpoint
         userId = "../../secret-endpoint"
         fetch("/api/users/../../secret-endpoint")
         Browser: GET /secret-endpoint
```

### 3.5 Comprehensive Encoding Matrix (All Encoding Types)

Beyond standard percent-encoding, every encoding scheme was tested empirically against React Router v7's `decodePath()` + `matchPath()` pipeline.

#### Overlong UTF-8

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

#### Unicode Homoglyph Characters

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

#### Unicode Normalization (NFC / NFKC)

Does React Router normalize Unicode? Tested with chars that change under NFC/NFKC.

| Input | Codepoint | `useParams()` display | Actual codepoint in params | NFC applied? |
|-------|-----------|----------------------|---------------------------|-------------|
| U+2126 OHM SIGN | 2126 | `Ω` (looks like Omega) | **U+2126** (verified) | NO |
| U+212A KELVIN SIGN | 212A | `K` (looks like K) | **U+212A** (verified) | NO |
| U+212B ANGSTROM SIGN | 212B | `Å` (looks like A-ring) | **U+212B** (verified) | NO |
| U+FB01 fi LIGATURE | FB01 | `ﬁ` (ligature) | **U+FB01** (verified) | NO (NFKC would → "fi") |

**Verified via `codePointAt(0).toString(16)`**: `decodeURIComponent` returns the raw codepoint. No normalization happens anywhere in React Router. The visual similarity in browser display is misleading - the actual bytes are different.

**Parser differential opportunity:** If a backend applies NFKC normalization, U+FF0E+FF0E+FF0F (fullwidth `../`) would normalize to ASCII `../`. React Router preserves the original codepoints, but a normalizing backend might interpret them as traversal.

#### Zero-Width & Invisible Characters

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

#### BiDi / Directional Characters

| Character | Codepoint | `useParams()` | Preserved? |
|-----------|-----------|---------------|-----------|
| RIGHT-TO-LEFT OVERRIDE | U+202E | `‮admin` | YES |
| RIGHT-TO-LEFT MARK | U+200F | `‏admin` | YES |
| LEFT-TO-RIGHT ISOLATE | U+2066 | `⁦admin` | YES |

**All pass through.** RTL override could visually reverse displayed path segments in UIs, potentially masking malicious paths in logs or error messages.

#### Combining Characters

| Test | `useParams()` | Notes |
|------|---------------|-------|
| U+0338 COMBINING LONG SOLIDUS OVERLAY on `o` | `hello̸world` | Preserved - combines with previous char visually |

React Router does not strip or normalize combining characters. They attach to the preceding codepoint.

#### Case Sensitivity of Percent Encoding

| Encoding | `useParams()` | Works? |
|----------|---------------|--------|
| `%2F` (uppercase) | `/` | YES |
| `%2f` (lowercase) | `/` | YES |
| `%2E%2E%2F` (upper) | `../admin` | YES |
| `%2e%2e%2f` (lower) | `../admin` | YES |

**Both cases work.** `decodeURIComponent` is case-insensitive for hex digits per the spec. Both `%2f` and `%2F` decode to `/`.

#### Invalid / Malformed Percent Encoding

| Input | `useParams()` | Behavior |
|-------|---------------|----------|
| `%ZZ` (invalid hex) | `%ZZ` (raw) | Fallback - returned as-is |
| `%2` (incomplete) | `%2` (raw) | Fallback |
| `%G1` (invalid hex) | `%G1test` (raw) | Fallback |
| `%` alone | `test%` (raw) | Fallback |
| `%0` (single digit) | `%0test` (raw) | Fallback |

**All malformed sequences are returned raw** thanks to the try/catch in `decodePath()`. This is safe - no partial decode, no corruption. The raw `%XX` string passes through unchanged.

#### Triple Encoding

| Input | `useParams()` | Decode chain |
|-------|---------------|-------------|
| `%25252F` | `%252F` | Only one decode level: `%25`→`%`, result=`%252F`. Line 811 doesn't match (no `%2F` substring). |
| `%252E%252E%252F` | `%2E%2E/` | `%25`→`%` gives `%2E%2E%2F`. Line 811 replaces `%2F`→`/`. Dots stay encoded. |

**Triple encoding partially decodes.** The `%2F`→`/` replacement at line 811 still fires if a `%2F` literal exists after the first decode pass. But `%2E` stays as `%2E` (line 811 only targets `%2F`).

#### Mixed Encoding (Combining Literal + Percent-Encoded)

| Input | `useParams()` | Exploitable? |
|-------|---------------|-------------|
| `..%2Fadmin` (literal dots + encoded /) | `../admin` | YES |
| `%2E.%2Fadmin` (one encoded dot + one literal + encoded /) | `../admin` | YES |
| `%2E%2E` + literal `/admin` | Route breaks (/ creates new segment) | Different behavior |

**Mixed encoding works for traversal.** You can mix literal `.` with encoded `%2E` and encoded `%2F` freely. React Router decodes each encoded char and the result is the same.

#### Backslash Handling

| Input | `useParams()` | Notes |
|-------|---------------|-------|
| `%5C` (encoded backslash) | `\` | Decoded to literal backslash |
| `..%5Cadmin` | `..\admin` | Decoded but `\` is NOT `/` - no path traversal via backslash |

**Backslash is decoded but not treated as a path separator.** React Router (and browsers) only use `/` for path navigation. `..\\admin` does not traverse.

#### Splat Route (`*`) Encoding Behavior

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

#### JavaScript Source-Level Escapes

| Escape | In URL context | Result |
|--------|---------------|--------|
| `\u002F` in JS string | Resolved to `/` at JS parse time | Creates real path separator BEFORE pushState |
| `\x2F` in JS string | Same - resolved at parse time | Same |
| Octal `\057` in JS string | Same | Same |

**These are NOT URL-level encodings.** JavaScript resolves `\u`, `\x`, and octal escapes when parsing the source code string. By the time the string reaches `pushState()` or `history.push()`, the escape is already a literal character. Not relevant for URL-based CSPT payloads sent from an attacker's link.

### 3.6 Encoding Decision Tree (Which Bypasses Work?)

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

---

## 4. Updated Regex Patterns for Caido Plugin

### New/Updated Path Extraction Patterns

```typescript
// React Router v7 fingerprint (HIGH confidence)
{ regex: /window\.__reactRouterVersion\s*=\s*["']([^"']+)["']/g, type: "framework-marker" }

// Route definitions with dynamic params (existing pattern enhanced)
{ regex: /\{path:"([^"]*:[a-zA-Z]\w*[^"]*)"[^}]*(?:element|loader|children):/g, type: "route" }

// Splat route definitions
{ regex: /\{path:"([^"]*\*[^"]*)"[^}]*element:/g, type: "route" }

// Nested route children array
{ regex: /children:\[([^\]]*\{path:"[^"]+")[^\]]*\]/g, type: "route" }

// Index route marker
{ regex: /\{index:!0,element:/g, type: "route" }

// Loader function with params → fetch
{ regex: /async\s+function\s+\w+\(\{params:\w+\}\)\{[^}]*fetch\(`[^`]*\$\{[^}]+\.(\w+)\}[^`]*`\)/g, type: "fetch" }

// Lazy chunk imports
{ regex: /import\("\.\/([A-Za-z]+-[A-Za-z0-9]+\.js)"\)/g, type: "route" }
```

### New/Updated Sink Detection Patterns

```typescript
// Splat param access near fetch (highest risk)
{ regex: /\w+\["\*"\][^;]*;[^]*?fetch\s*\(\s*`[^`]*\$\{/g, risk: "high",
  description: "Splat param flows to fetch - captures across / boundaries, no encoding needed for traversal" }

// API service layer pattern (abstraction hiding the sink)
{ regex: /\{get:\w+=>\s*fetch\(`[^`]*\$\{\w+\}`\)/g, risk: "high",
  description: "API service object wrapping fetch with param interpolation" }

// TanStack Query with dynamic URL
{ regex: /queryFn:\s*\(\)\s*=>\s*fetch\(`[^`]*\$\{[^}]+\}`\)/g, risk: "high",
  description: "TanStack/React Query fetcher with interpolated param in URL" }

// Route loader with params → fetch (data mode)
{ regex: /\{params:\w+\}[^]*?fetch\(`[^`]*\$\{\w+\.\w+\}`\)/g, risk: "high",
  description: "React Router loader function using params in fetch URL" }

// dangerouslySetInnerHTML with single variable (app code, not React internals)
{ regex: /dangerouslySetInnerHTML:\{__html:\w{1,3}\}/g, risk: "high",
  description: "dangerouslySetInnerHTML with variable - CSPT to XSS if content from traversed endpoint" }

// navigate() with variable (open redirect)
{ regex: /\w{1,3}\(\w+\)[^;]*;?\s*\/\/.*navigate|navigate[^(]*\(\w+\)/g, risk: "medium",
  description: "navigate() called with variable - open redirect if param-controlled" }

// useSearchParams().get() near fetch
{ regex: /\w+\.get\(["'][^"']+["']\)[^;]*;[^]*?fetch\s*\(/g, risk: "high",
  description: "searchParams.get() value flows to fetch - URLSearchParams auto-decodes" }

// Minified useParams destructure → fetch (pattern: {x:n}=hookCall()...fetch)
{ regex: /\{\w+:\w+\}=\w{1,3}\(\)[^]*?fetch\(`[^`]*\$\{/g, risk: "high",
  description: "Minified useParams destructure flowing into fetch template literal" }
```

### Updated Framework Detection

```typescript
// React Router v7 detection (add to framework-detector.ts)
function detectReactRouterV7(body: string): boolean {
  return (
    /__reactRouterVersion/.test(body) ||
    /__reactRouterContext/.test(body) ||
    /\{path:"[^"]+",element:/.test(body) ||
    /useLocation\(\) may be used only in the context/.test(body)
  );
}
```

---

## Appendix A: React Router Source Line References

| Function | File | Lines | Purpose |
|----------|------|-------|---------|
| `parsePath()` | router.js | 309-327 | Split URL into path/search/hash (no decode) |
| `createBrowserLocation()` | router.js | 170-183 | Read from window.location |
| `matchRoutesImpl()` | router.js | 523-543 | Orchestrates matching, calls decodePath at 539 |
| `decodePath()` | router.js | 863-870 | Per-segment decodeURIComponent, re-encodes / |
| `compilePath()` | router.js | 822-861 | Builds regex: `:param`=[^\\/]+, `*`=(.*) |
| `matchPath()` | router.js | 782-821 | Extracts params, **line 811: %2F→/** |
| `matchRouteBranch()` | router.js | 693-736 | Iterates route segments |
| `useParams()` | react-router.js | 237-243 | Returns match.params (decoded) |
| `useSearchParams()` | react-router-dom.js | 1068-1085 | Wraps URLSearchParams (auto-decodes) |
| Re-encoding | react-router.js | 353-360 | Re-encodes pathname via new URL() but NOT params |

## Appendix B: Lab App Structure

```
react-cspt-lab/
  src/
    App.tsx              - createBrowserRouter with all 12 route types
    pages/
      UserPage.tsx       - useParams → fetch (template literal)
      ProductPage.tsx    - useParams → fetch (concatenation)
      CategoriesPage.tsx - useSearchParams → fetch
      FilesPage.tsx      - splat param → fetch
      MemberPage.tsx     - useParams → axios.get
      DashboardStats.tsx - searchParams → fetch → dangerouslySetInnerHTML
      DashboardSettings.tsx - API service layer pattern
      DataPage.tsx       - route loader → fetch
      LazyPage.tsx       - TanStack Query with dynamic URL
      DashboardIndex.tsx - navigate() open redirect
      EncodingTestPage.tsx - encoding experiment (named param)
      EncodingSplatPage.tsx - encoding experiment (splat param)
  dist/
    assets/
      index-DeP1TdBi.js     - 349 kB main bundle
      LazyPage-CWMNrFw5.js  - 8.9 kB lazy chunk
```
