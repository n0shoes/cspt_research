# 05 - Caido Detection Patterns

## Nuxt Fingerprinting

### HTTPQL Queries for Nuxt Detection

```httpql
# Nuxt payload requests
req.path.cont:"_payload.json"

# Nuxt island requests (server components)
req.path.cont:"__nuxt_island"

# Nuxt client bundles
req.path.cont:"/_nuxt/"

# Nuxt error pages
req.path.cont:"__nuxt_error"

# Nuxt build manifest
req.path.cont:"builds/meta"
resp.body.cont:"buildAssetsDir"

# Combined Nuxt fingerprint
req.path.cont:"/_nuxt/" OR req.path.cont:"_payload.json" OR req.path.cont:"__nuxt_island"
```

### Response-Based Detection

```httpql
# Nuxt hydration payload in HTML
resp.body.cont:"window.__NUXT__"

# Nuxt meta tag
resp.body.cont:"__NUXT_DATA__"

# Nuxt prerender hints
resp.header.cont:"x-nitro-prerender"

# Nuxt server timing
resp.header.cont:"x-powered-by" AND resp.header.cont:"Nitro"

# Nuxt island response format
resp.body.cont:"data-island-uid"
```

## Route Extraction from Client Bundles

### HTTPQL for Route Definitions in Bundles

```httpql
# Client bundles containing route paths
req.path.cont:"/_nuxt/" AND resp.body.cont:"path:"

# Look for dynamic route patterns in bundles
req.path.cont:"/_nuxt/" AND resp.body.cont:":id()"

# Catch-all route patterns
req.path.cont:"/_nuxt/" AND resp.body.cont:"(.*)*"
```

### Grep Patterns for Route Extraction

Apply to downloaded `/_nuxt/*.js` bundles:

```regex
# Compiled route definitions
path:\s*["'](/[^"']*:[a-zA-Z]+[^"']*)["']

# Route names (reveal page structure)
name:\s*["']([a-z]+-[a-z]+(?:-[a-z]+)*)["']

# Dynamic imports (page components)
component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)
```

## CSPT Sink Detection

### Client-Side Sinks in Bundles

```httpql
# useFetch with template literals (minified)
req.path.cont:"/_nuxt/" AND resp.body.cont:"useFetch" AND resp.body.cont:"route.params"

# $fetch with string concatenation
req.path.cont:"/_nuxt/" AND resp.body.cont:"$fetch" AND resp.body.cont:".params."

# innerHTML / v-html sinks
req.path.cont:"/_nuxt/" AND resp.body.cont:"innerHTML"

# navigateTo with params
req.path.cont:"/_nuxt/" AND resp.body.cont:"navigateTo"
```

### Minified Sink Patterns

In production builds, look for these minified patterns:

```regex
# useFetch with route param (minified)
# Pattern: p(`/api/.../${o.params.id}`)  where p = useFetch
\w\(`[/][^`]*\$\{\w+\.params\.\w+\}[^`]*`\)

# $fetch with concatenation (minified)
\$fetch\s*\([^)]*\+\s*\w+\.params\.\w+

# innerHTML assignment (from v-html)
\{innerHTML:\w+\(\w+\)

# Catch: ["innerHTML"] array (Vue's v-html compilation)
\["innerHTML"\]
```

### Server-Side Sink Detection

```httpql
# Server API routes with params
req.path.cont:"/api/" AND req.path.cont:":"

# Proxy-pattern routes
req.path.cont:"/api/proxy/"

# Catch-all API routes
req.path.cont:"/api/" AND resp.body.cont:"params"
```

## Active Testing Patterns

### CSPT Probing

```httpql
# Traversal attempts in path params
req.path.cont:"%2F" AND req.path.cont:".."

# Double-encoded traversal
req.path.cont:"%252F"

# Encoded dots
req.path.cont:"%2e%2e"

# Tab-encoded (Front App style)
req.path.cont:"%09"

# Traversal in query params
req.raw.cont:"widget=" AND req.raw.cont:".."
```

### Verify CSPT Success

```httpql
# Response from a different endpoint than expected
# Compare: request to /api/users/../../admin vs normal /api/users/123
req.path.cont:"/api/users/" AND resp.body.cont:"admin"

# Island traversal
req.path.cont:"__nuxt_island" AND req.path.cont:".."
```

## Workflow: Nuxt CSPT Audit

### Phase 1: Fingerprint

```httpql
# Confirm Nuxt
resp.body.cont:"window.__NUXT__" OR req.path.cont:"/_nuxt/"
```

### Phase 2: Extract Routes

```httpql
# Download all client bundles
req.path.cont:"/_nuxt/" AND resp.header.cont:"javascript"
```

Then search downloaded JS for:
- `path:` route definitions
- `params.` parameter access
- Template literals with `${}` containing params
- `innerHTML` assignments

### Phase 3: Identify Sinks

```httpql
# Find bundles with fetch + params
req.path.cont:"/_nuxt/" AND resp.body.cont:"params" AND (resp.body.cont:"useFetch" OR resp.body.cont:"$fetch")
```

### Phase 4: Test Traversals

For each identified sink, test:

```
# Normal param
GET /users/123

# Single-encoded traversal
GET /users/..%2F..%2Fadmin

# Double-encoded traversal
GET /users/..%252F..%252Fadmin

# Encoded dots + slash
GET /users/%2e%2e%2f%2e%2e%2fadmin

# Catch-all with traversal
GET /files/..%2F..%2Fetc/passwd

# Query param traversal
GET /dashboard/stats?widget=..%2F..%2Fattacker-endpoint

# Island payload probe
GET /__nuxt_island/../../api/users/1.json
```

### Phase 5: Chain Detection

```httpql
# v-html + fetch (CSPT -> XSS chain)
req.path.cont:"/_nuxt/" AND resp.body.cont:"innerHTML" AND resp.body.cont:"useFetch"

# Server proxy pattern (CSPT -> SSRF chain)
req.path.cont:"/api/proxy/" AND resp.body.cont:"backend"

# Island + traversal (Stored CSPT)
req.path.cont:"__nuxt_island" AND resp.body.cont:"$fetch"
```

## Nuclei Template Markers

For automated scanning, look for these response indicators:

```yaml
# Nuxt app confirmed
matchers:
  - type: word
    words:
      - "window.__NUXT__"
      - "/_nuxt/"
      - "__NUXT_DATA__"

# CSPT vulnerability confirmed (response from wrong endpoint)
matchers:
  - type: word
    part: body
    words:
      - "unexpected_field_from_traversed_endpoint"
```
