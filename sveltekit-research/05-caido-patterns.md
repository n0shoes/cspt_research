# 5. Caido Patterns for SvelteKit CSPT Detection

## SvelteKit Fingerprinting

### HTTP Response Headers

```httpql
# SvelteKit sets x-sveltekit-page header on data requests
resp.header.cont:"x-sveltekit-page"

# SvelteKit normalize redirect
resp.header.cont:"x-sveltekit-normalize"

# Data request suffix
req.path.cont:"__data.json"

# Route resolution suffix
req.path.cont:"__route.js"
```

### HTML Body Fingerprints

```httpql
# SvelteKit app shell
resp.raw.cont:"__sveltekit"

# SvelteKit data hydration
resp.raw.cont:"__data"

# SvelteKit environment module
req.path.cont:"_app/env.js"

# SvelteKit immutable chunks
req.path.cont:"_app/immutable"
```

### Client Bundle Detection

```httpql
# SvelteKit client entry
req.path.cont:"_app/immutable/entry/start"

# SvelteKit app entry (contains route dictionary)
req.path.cont:"_app/immutable/entry/app"

# SvelteKit chunk files
req.path.cont:"_app/immutable/chunks"

# SvelteKit node files (route components)
req.path.cont:"_app/immutable/nodes"
```

## Route Extraction from Client Bundle

### Finding the Route Dictionary

The `app.*.js` entry point contains the full route dictionary:

```httpql
# Request that returns route dictionary
req.path.cont:"_app/immutable/entry/app" AND resp.raw.cont:"dictionary"
```

Look for the pattern:
```javascript
const dictionary = {
    "/": [3],
    "/users/[userId]": [14],
    "/files/[...path]": [11],
    ...
};
```

### Identifying Server-Data Routes

Negative node IDs indicate `+page.server.ts` usage:
```javascript
"/data/[dataId]": [-9]  // negative = server data
```

These are higher-value targets (SSRF potential).

### Identifying Matchers

```httpql
# Matchers in client bundle
resp.raw.cont:"matchers" AND req.path.cont:"_app/immutable/entry/app"
```

Matchers reduce attack surface -- routes with matchers may reject traversal payloads.

## Sink Detection

### {@html} (XSS Sink)

```httpql
# Server-rendered output containing {@html} artifacts
# In build output, {@html} compiles to raw HTML insertion
resp.raw.cont:"html" AND resp.raw.cont:"@html"
```

In source code analysis, search for:
```
{@html
```

### fetch() in Load Functions

In server build output (`entries/pages/*/`), fetch calls are preserved:

```httpql
# Server endpoints with fetch to internal services
resp.raw.cont:"fetch(" AND resp.raw.cont:"internal"

# fetch with template literal interpolation
resp.raw.cont:"fetch(`" AND resp.raw.cont:"${params"
```

### goto() Open Redirect

```httpql
# Client-side goto with user input
resp.raw.cont:"goto(" AND resp.raw.cont:"searchParams"
```

## CSPT Testing Patterns

### Catch-All Route Traversal

```httpql
# Requests to catch-all routes with traversal
req.path.cont:"%2e%2e" OR req.path.cont:"%2f"

# Data requests for catch-all routes
req.path.cont:"__data.json" AND (req.path.cont:"%2e" OR req.path.cont:"%2f")
```

### Server Load Data Requests

When a page with `+page.server.ts` is navigated to client-side, SvelteKit fetches data via:
```
GET /data/[dataId]/__data.json
```

```httpql
# Data fetches for server-load routes
req.path.cont:"__data.json" AND req.method.eq:"GET"
```

### Query Param CSPT

```httpql
# Widget parameter testing
req.query.cont:"widget=" AND req.path.cont:"/dashboard/stats"

# Any query param with traversal
req.query.cont:"%2e%2e" OR req.query.cont:".."
```

## SvelteKit-Specific API Patterns

### Internal Data API

SvelteKit creates internal endpoints for data loading:

```httpql
# __data.json requests (SvelteKit data loading)
req.path.cont:"__data.json"

# __route.js requests (route resolution)
req.path.cont:"__route.js"

# Remote function calls (CVE-2026-22803 target)
req.path.cont:"__remote"
```

### API Route Endpoints

```httpql
# Custom API routes (likely +server.ts)
req.path.cont:"/api/" AND req.method.eq:"GET"

# Proxy-style API routes
req.path.cont:"/api/proxy/"
```

## Detection Workflow

### Step 1: Identify SvelteKit App

```httpql
resp.raw.cont:"__sveltekit" OR req.path.cont:"_app/immutable"
```

### Step 2: Extract Route Dictionary

```httpql
req.path.cont:"_app/immutable/entry/app"
```

Download and parse the JavaScript to extract the `dictionary` object.

### Step 3: Identify High-Risk Routes

Look for:
1. **Catch-all routes** `[...path]` -- highest CSPT risk
2. **Negative node IDs** -- server-data routes (SSRF risk)
3. **Routes without matchers** -- no validation on params

### Step 4: Identify Sinks

Download server build chunks and search for:
1. `fetch(\`` with `${params` -- CSPT/SSRF sinks
2. `{@html` in component files -- XSS sinks
3. `goto(` with user-controlled input -- open redirect

### Step 5: Test Traversal

For each identified route, test:

```
# Single param traversal
/users/..%2f..%2fadmin

# Catch-all traversal
/files/..%2f..%2f..%2fadmin

# Query param traversal
/dashboard/stats?widget=..%2f..%2fadmin

# Double encoding (should be blocked by decode_pathname)
/users/%252e%252e%252fadmin

# Data request traversal
/users/..%2f..%2fadmin/__data.json
```

## Grep Patterns for Source Code Review

```bash
# Find all load functions with fetch
rg 'fetch\(`[^`]*\$\{params' --glob '*.ts' --glob '*.js'

# Find {@html} sinks
rg '\{@html' --glob '*.svelte'

# Find goto() with user input
rg 'goto\(' --glob '*.svelte' --glob '*.ts'

# Find server-only load functions
rg 'load.*params.*fetch' --glob '+page.server.ts'

# Find API endpoints
rg 'export.*GET|POST|PUT|DELETE' --glob '+server.ts'

# Find catch-all route directories
find src/routes -name '[...]*' -type d

# Find routes WITHOUT matchers (missing =matcher)
find src/routes -name '[*]' ! -name '*=*' -type d
```
