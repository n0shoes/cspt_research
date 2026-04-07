# 5. Caido Detection Patterns for Ember CSPT

## Ember Framework Fingerprinting

### HTML Meta Tag Detection (Most Reliable)
```httpql
resp.raw.cont:"meta name=\"" AND resp.raw.cont:"/config/environment\""
```

The `<meta name="{appName}/config/environment" content="...">` tag is unique to Ember apps. The content contains URL-encoded JSON with:
- `modulePrefix` (app name)
- `locationType` (history/hash/none)
- `rootURL`
- `EmberENV` configuration

### Script Tag Detection
```httpql
resp.raw.cont:"@embroider/virtual/vendor.js"
```

Or for older Ember apps:
```httpql
resp.raw.cont:"vendor-" AND resp.raw.cont:"ember"
```

### JavaScript Bundle Fingerprints
```httpql
resp.raw.cont:"ENCODE_AND_DECODE_PATH_SEGMENTS"
```

```httpql
resp.raw.cont:"normalizeSegment" AND resp.raw.cont:"normalizePath"
```

```httpql
resp.raw.cont:"ember-source"
```

```httpql
resp.raw.cont:"__ember" OR resp.raw.cont:"Ember."
```

### Ember Data / WarpDrive Detection
```httpql
resp.raw.cont:"@warp-drive" OR resp.raw.cont:"ember-data"
```

```httpql
resp.raw.cont:"urlForFindRecord" OR resp.raw.cont:"urlForQueryRecord"
```

## Route Extraction from Production Bundles

### Dynamic Route Patterns
```httpql
resp.raw.cont:"/:" AND resp.raw.cont:"route"
```

Search bundle JS for route paths:
```httpql
resp.raw.cont:"/:user_id" OR resp.raw.cont:"/:id"
```

### Wildcard Route Patterns (Highest Priority)
```httpql
resp.raw.cont:"/*" AND resp.raw.cont:"route"
```

### Route Names in Bundle
Ember preserves route names as strings in production. Look for patterns like:
```httpql
resp.raw.cont:"\"user\"" AND resp.raw.cont:"\"product\"" AND resp.raw.cont:"route"
```

## CSPT Sink Detection

### Fetch with Template Literals
```httpql
resp.raw.cont:"fetch(`/api/" AND resp.raw.cont:"${"
```

### Fetch with String Concatenation
```httpql
resp.raw.cont:"fetch(\"/api/" AND resp.raw.cont:"\"+e."
```

### Triple Curlies (Compiled)
In production, triple curlies compile to Glimmer VM opcodes. Look for:
```httpql
resp.raw.cont:"insertAdjacentHTML" AND resp.raw.cont:"appendHTML"
```

Or for `htmlSafe`:
```httpql
resp.raw.cont:"htmlSafe" OR resp.raw.cont:"SafeString"
```

### TransitionTo with Dynamic Input
```httpql
resp.raw.cont:"transitionTo" AND resp.raw.cont:"queryParams"
```

### Adapter URL Builders
```httpql
resp.raw.cont:"urlForFindRecord" AND resp.raw.cont:"/api/"
```

## Hash Routing Detection

If the meta tag contains `locationType":"hash"`:
```httpql
resp.raw.cont:"locationType%22%3A%22hash"
```

Hash routing expands the attack surface since `location.hash` is fully client-controlled.

## Request Patterns for CSPT Testing

### Dynamic Segment Traversal
```httpql
req.path.cont:"%2f" AND req.path.cont:".." AND req.host.eq:"target.com"
```

### Wildcard Route Traversal
```httpql
req.path.cont:"/docs/" AND req.path.cont:".."
```

### API Calls from CSPT
Look for API requests that result from CSPT-redirected fetches:
```httpql
req.path.cont:"/api/" AND req.path.cont:"../"
```

## Multi-Stage Detection Workflow

### Stage 1: Identify Ember App
```httpql
resp.raw.cont:"/config/environment\"" AND resp.status.eq:200
```

### Stage 2: Extract Route Map
Download the main JS bundle and search for:
```
grep -oP '/[\w-]+/:[\w_]+' bundle.js      # Dynamic segments
grep -oP '/[\w-]+/\*[\w_]+' bundle.js     # Wildcard segments
grep -oP '"[\w.-]+"' bundle.js | sort -u  # Route names
```

### Stage 3: Identify Sinks
```
grep -oP 'fetch\(`[^`]*\$\{[^}]*\}[^`]*`\)' bundle.js  # Template literal fetches
grep -oP 'fetch\("[^"]*"\s*\+\s*\w+' bundle.js           # Concat fetches
grep 'insertAdjacentHTML\|htmlSafe\|SafeString' bundle.js  # HTML sinks
grep 'transitionTo\|replaceWith' bundle.js                 # Redirect sinks
```

### Stage 4: Test CSPT Payloads
For each dynamic route `/path/:param`:
```
/path/..%2fadmin
/path/%2e%2e%2fadmin
/path/..%252fadmin
```

For each wildcard route `/path/*wildcard`:
```
/path/../../etc/passwd
/path/../../../api/admin
```

### Stage 5: Chain with Sinks
If CSPT confirmed:
1. Check if response is rendered via triple curlies → XSS
2. Check if response feeds into `htmlSafe()` → XSS
3. Check if response data enters `transitionTo()` → Open redirect
4. Check if adapter builds further URLs from response → Second-order CSPT

## Ember-Specific Indicators in Network Traffic

| Pattern | Significance |
|---------|-------------|
| `/_unused_dummy_error_path_route_` in URLs | Ember loading/error substates |
| `__ember_auto_import__` in bundle | Ember auto-import addon |
| `@embroider/virtual/` requests | Embroider build system |
| `ember-cli-` in response headers | Ember CLI middleware |
| `X-Content-Type-Options: nosniff` + SPA | Common Ember server config |
