# 05 - Caido Detection Patterns

## SolidStart Fingerprinting

### Response Header Fingerprints

```httpql
# SolidStart server function responses
resp.headers.cont:"X-Server-Id"
resp.headers.cont:"x-serialized"
resp.headers.cont:"X-Single-Flight"

# Vinxi/Nitro server
resp.headers.cont:"x-nitro"
```

### Request Header Fingerprints

```httpql
# Server function calls (POST to /_server)
req.path.eq:"/_server" AND req.method.eq:"POST"

# Server function with specific headers
req.headers.cont:"X-Server-Id" AND req.headers.cont:"X-Server-Instance"

# Single-flight mutations
req.headers.cont:"X-Single-Flight"
```

### URL Pattern Fingerprints

```httpql
# Server function endpoint
req.path.cont:"/_server"

# SolidStart build assets (vinxi output)
req.path.cont:"/_build/assets/"

# Typical SolidStart static assets
req.path.regex:"/_build/assets/(web|routing|client)-[A-Za-z0-9]+\.js"
```

### Response Body Fingerprints

```httpql
# Solid.js runtime markers in HTML
resp.raw.cont:"_$HY"
resp.raw.cont:"data-hk"

# SolidStart hydration markers
resp.raw.cont:"_$OWNER"
resp.raw.cont:"solid-js"

# Vinxi manifest
resp.raw.cont:"vinxi"

# seroval serialization markers
resp.raw.cont:"__SEROVAL_"
```

## Route Extraction

### Identify Dynamic Routes from Client Bundle

```httpql
# Fetch the routing chunk
req.path.regex:"/_build/assets/routing-[A-Za-z0-9]+\.js"

# Fetch individual route chunks (param routes use underscore prefix)
req.path.regex:"/_build/assets/_[a-zA-Z]+-[A-Za-z0-9]+\.js"

# Catch-all route chunks (triple dots in filename)
req.path.regex:"/_build/assets/_\.\.\.[a-z]+-[A-Za-z0-9]+\.js"
```

### Identify Dynamic API Routes

```httpql
# API routes with path params
req.path.regex:"/api/[^/]+/[^/]+"

# API proxy/catch-all patterns
req.path.cont:"/api/proxy/"
```

## CSPT Sink Detection

### Client-Side Fetch with Dynamic Params

Look for server function calls that include user-controlled data:

```httpql
# Server function calls (all are potential CSPT sinks)
req.path.eq:"/_server" AND req.method.eq:"POST" AND req.headers.cont:"X-Server-Id"

# GET-based server function calls (args in URL)
req.path.cont:"/_server?" AND req.raw.cont:"args="
```

### innerHTML in Response

```httpql
# Pages that may use innerHTML (search in HTML responses)
resp.raw.cont:"innerHTML"

# Solid's compiled innerHTML pattern
resp.raw.regex:"\w+\(\w+,\"innerHTML\","
```

### Catch-All Route Requests

```httpql
# Requests to file/proxy endpoints (catch-all sinks)
req.path.regex:"/files/.+"
req.path.regex:"/api/proxy/.+"

# Traversal attempts in catch-all
req.path.regex:"/files/.*\.\."
req.path.regex:"/api/proxy/.*\.\."
```

### Search Param CSPT

```httpql
# Requests with traversal in query params
req.raw.regex:"\?(source|endpoint|path|url|redirect|callback|next|file)=.*\.\./"

# Encoded traversal in query params
req.raw.regex:"\?(source|endpoint|path|url)=.*%2e%2e%2f"
```

## Active Testing Patterns

### Test Server Function CSPT

```httpql
# Identify all server function endpoints
req.path.eq:"/_server" AND req.method.eq:"POST"
```

For each identified server function:
1. Capture the `X-Server-Id` header value
2. Inspect the request body (seroval-serialized arguments)
3. Modify argument values to include traversal payloads
4. Check if server response changes (different data = CSPT confirmed)

### Test Search Param Sinks

```httpql
# Find pages with query params that trigger fetches
req.path.regex:"/dashboard" AND req.raw.cont:"source="
req.path.regex:"/settings" AND req.raw.cont:"endpoint="
```

### Test Catch-All Routes

```httpql
# Requests to catch-all patterns
req.path.regex:"^/files/"
req.path.regex:"^/api/proxy/"
```

## Workflow: SolidStart CSPT Assessment

### Step 1: Identify Target as SolidStart

```httpql
resp.raw.cont:"_$HY" OR resp.raw.cont:"data-hk"
resp.raw.cont:"/_build/assets/"
```

### Step 2: Extract Route Map

Fetch the routing chunk and route chunks:
```httpql
req.path.regex:"/_build/assets/.*-[A-Za-z0-9]+\.js"
```

Look in response bodies for:
- Route patterns: `fetch(\`/api/.../${param}\`)`
- innerHTML sinks: `("innerHTML", ...)`
- Server function IDs: `"X-Server-Id"`

### Step 3: Identify Server Functions

```httpql
req.path.eq:"/_server" AND req.method.eq:"POST"
```

Extract function IDs from `X-Server-Id` headers. These reveal:
- Source file paths (e.g., `src_routes_data_dataId_tsx--getData_query`)
- Function names and their route associations

### Step 4: Test CSPT Vectors

Priority order:
1. **Search params** -> test with `?source=../../etc` on identified pages
2. **Server function args** -> modify serialized args in `/_server` POST body
3. **Catch-all routes** -> test `/files/../../admin` patterns
4. **API routes** -> test `/api/proxy/../../internal` patterns

### Step 5: Chain to Impact

If CSPT confirmed:
- Check if response is used in `innerHTML` -> XSS
- Check if server function makes internal requests -> SSRF
- Check if response data is cached -> Cache poisoning
- Check if navigated URL is reflected -> Open redirect

## Caido Findings Template

```
Title: Client-Side Path Traversal via [source] in [SolidStart Route]
Severity: [High/Critical]
Category: CSPT

Description:
The SolidStart application at [URL] uses [useSearchParams/useParams/server function]
to construct [fetch URL/server-side request]. An attacker can manipulate the
[query parameter/route parameter] to redirect the request to an arbitrary endpoint.

Steps to Reproduce:
1. Navigate to [URL with payload]
2. Observe [network request/response/XSS]
3. The request was redirected to [unintended endpoint]

Impact:
[XSS via innerHTML / SSRF via server function / Data exfiltration]

Proof of Concept:
[URL with payload]
```
