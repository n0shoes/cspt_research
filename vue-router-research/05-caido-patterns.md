# 05 - Caido Detection Patterns for Vue Router CSPT

## Vue Router Fingerprinting

### HTTPQL Queries

```
# Detect Vue Router in responses (script bundles)
resp.raw.cont:"createWebHistory" OR resp.raw.cont:"createRouter"

# Vue Router production fingerprint (minified decode function)
resp.raw.cont:"decodeURIComponent(\"\"+" AND resp.raw.cont:"encodeURI(\"\"+"

# Vue.js framework detection
resp.raw.cont:"__vue_app__" OR resp.raw.cont:"__VUE__"

# RouterView/RouterLink components
resp.raw.cont:"RouterView" OR resp.raw.cont:"RouterLink"

# v-html directive in responses
resp.raw.cont:"v-html" OR resp.raw.cont:"innerHTML"
```

### Route Definition Detection

```
# Catch-all routes (high CSPT risk)
resp.raw.cont:"pathMatch(.*)*" OR resp.raw.cont:"pathMatch(.*)"

# Dynamic param routes
resp.raw.cont:":userId" OR resp.raw.cont:":teamId" OR resp.raw.cont:":category"

# Repeatable params
resp.raw.cont:":chapters+" OR resp.raw.cont:":segments+"
```

## Sink Detection in Source/Bundle

### Fetch with Params

```
# Template literal fetch with params
resp.raw.cont:"/api/" AND resp.raw.cont:".params."

# Specific sink patterns
resp.raw.cont:"fetch(`/api/" AND resp.raw.cont:"params"
resp.raw.cont:"axios.get(`" AND resp.raw.cont:"params"

# v-html sink (XSS)
resp.raw.cont:"v-html" AND resp.raw.cont:"fetch"
resp.raw.cont:"innerHTML" AND resp.raw.cont:".params"
```

### Open Redirect Patterns

```
# router.push with query params
resp.raw.cont:"router.push" AND resp.raw.cont:"query.redirect"
resp.raw.cont:".push(" AND resp.raw.cont:"query."
```

## CSPT Traversal Testing Patterns

### Request-Side Detection

```
# Detect traversal attempts in requests
req.path.cont:"%2F..%2F" OR req.path.cont:"%2f..%2f"
req.path.cont:"%252F" OR req.path.cont:"%252f"
req.path.cont:"%2e%2e" OR req.path.cont:"%2E%2E"

# Detect traversal in query params
req.query.cont:"../" OR req.query.cont:"%2F"

# Detect attempted CSPT redirects
req.path.cont:".%09.%2f" OR req.path.cont:"%5c..%5c"
```

### Response-Side Detection

```
# Detect if API responded to traversed path
resp.code.eq:200 AND req.path.cont:"%2F..%2F"

# Detect JSON responses to non-API paths (CSPT success indicator)
resp.header.cont:"application/json" AND req.path.not.cont:"/api/"
```

## Regex Patterns for Source Analysis

### Vue Router Route Definitions
```regex
# Match route path definitions
path\s*:\s*['"`]/[^'"]*:[a-zA-Z]\w*

# Match catch-all routes
path\s*:\s*['"`][^'"]*\(\.\*\)\*

# Match optional params
path\s*:\s*['"`][^'"]*:\w+\?

# Match repeatable params
path\s*:\s*['"`][^'"]*:\w+[+*]
```

### Vue Router Param Sources
```regex
# Composition API
(?:use)?[Rr]oute\(\)\.params\.\w+
route\.params\.\w+

# Options API
\$route\.params\.\w+
this\.\$route\.params\.\w+

# Query params
route\.query\.\w+
\$route\.query\.\w+
```

### CSPT Sinks in Vue
```regex
# fetch with template literal
fetch\s*\(\s*`[^`]*\$\{[^}]*(?:params|query)[^}]*\}

# fetch with concatenation
fetch\s*\([^)]*\+\s*(?:route|this\.\$route)\.(?:params|query)\.\w+

# axios with params
axios\.(?:get|post|put|delete)\s*\(\s*`[^`]*\$\{[^}]*(?:params|query)

# v-html with fetched data
v-html\s*=\s*"[^"]*(?:data|html|body|content|response)"

# router.push with user input
router\.push\s*\(\s*(?:route|this\.\$route)\.query\.\w+
```

### Minified Bundle Patterns
```regex
# Minified decode function
function\s+\w+\(\w+\)\{if\(\w+==null\)return null;try\{return decodeURIComponent

# Minified fetch with dynamic URL
fetch\(\w+\)\s*  # where variable was constructed from params

# Minified v-html (becomes innerHTML property)
\{innerHTML:\w+\.value

# Minified router chunk identifier
createWebHistory|popstate.*replaceState
```

## Testing Workflow in Caido

### Step 1: Identify Vue Router Target
```
# Find Vue apps with router
resp.raw.cont:"createWebHistory" AND resp.raw.cont:"createRouter"
```

### Step 2: Map Dynamic Routes
```
# Find route definitions in JS bundles
resp.raw.cont:"path:" AND resp.raw.cont:":param" AND resp.raw.cont:"component"
```

### Step 3: Find Sinks
```
# Fetch + params patterns
resp.raw.cont:"fetch(" AND resp.raw.cont:".params."
resp.raw.cont:"axios" AND resp.raw.cont:".params."
resp.raw.cont:"v-html"
```

### Step 4: Test Traversal
Send requests with encoded traversal in param positions:
- `..%2F..%2Fadmin` (basic)
- `..%252F..%252Fadmin` (double-encoded)
- `%2e%2e%2f%2e%2e%2f` (dot-encoded)
- `.%09.%2f.%09.%2f` (tab-encoded, Front pattern)

### Step 5: Verify Impact
```
# Check if traversed requests return different data
resp.code.eq:200 AND req.path.cont:"%2F..%2F"
resp.header.cont:"application/json" AND req.path.cont:"..%2F"
```
