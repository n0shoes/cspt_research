# 05 - Caido Patterns for Next.js

## Framework Fingerprinting

### Identify Next.js Application

```regex
# Response headers
x-nextjs-matched-path
x-nextjs-page
x-nextjs-redirect
x-middleware-rewrite

# HTML markers
/_next/static/
__NEXT_DATA__
id="__next"
<script src="/_next/

# Build ID in paths
/_next/static/[a-zA-Z0-9_-]{21}/

# RSC headers in requests
rsc:\s*1
next-router-state-tree
next-router-prefetch
next-router-segment-prefetch

# Turbopack-specific
globalThis\.TURBOPACK
```

**Caido HTTPQL:**
```
resp.raw.cont:"/_next/static/" OR resp.raw.cont:"__NEXT_DATA__" OR resp.header.eq:"x-nextjs-page"
```

### Identify Next.js Version

```regex
# In HTML or response
Next\.js\s+(\d+\.\d+\.\d+)

# In build output paths (Turbopack chunks)
/_next/static/chunks/turbopack-[a-f0-9]+\.js
```

### Identify App Router vs Pages Router

```regex
# App Router indicators
/_next/static/chunks/app/
text/x-component
\.rsc$
\.segment\.rsc$

# Pages Router indicators
/_next/data/
__NEXT_DATA__.*"page":
getServerSideProps
getStaticProps
```

## Route Extraction

### From routes-manifest.json

The routes manifest may be accessible at `/_next/routes-manifest.json` in development or misconfigured production builds.

```regex
# Extract all dynamic routes
"page":\s*"(/[^"]*\[[^\]]*\][^"]*)"

# Extract route regexes
"regex":\s*"(\^[^"]+\$)"

# Extract named route keys (nxtP prefix = Next.js fingerprint)
"nxtP([a-zA-Z]+)"
```

### From Client Bundles

```regex
# Turbopack module registration
globalThis\.TURBOPACK[^;]+push\(\[

# Route path strings in server manifests
"page":\s*"/[^"]*\["

# Dynamic segment markers in file paths
/app/[^/]*\[.*\][^/]*/page

# Build manifest route entries
"/((?:[^/]+?)(?:/(?:[^/]+?))*)"
```

### From Server File Structure

```regex
# Server-side page files expose route structure
\.next/server/app/.*\[.*\]/page\.js
\.next/server/app/.*\[\.\.\..*\]/page\.js
\.next/server/app/.*/route\.js
```

## Sink Detection in Client Bundles

### Primary CSPT Sinks

```regex
# fetch() with template literal interpolation
fetch\(`[^`]*\$\{[^}]+\}[^`]*`\)

# fetch() with string concatenation
fetch\("[^"]*"\s*\+\s*\w+[\s\+]

# fetch() with variable path
fetch\(\w+\s*\+\s*

# API endpoint patterns in fetch
fetch\(`/api/[^`]*\$\{

# Service layer fetch (baseUrl pattern)
baseUrl[^;]*fetch\(`\$\{this\.baseUrl\}

# Server-side fetch to localhost
fetch\(`https?://localhost[^`]*\$\{

# Server-side fetch to internal hosts
fetch\(`https?://[^`]*internal[^`]*\$\{
```

### XSS Sinks

```regex
# dangerouslySetInnerHTML
dangerouslySetInnerHTML:\s*\{

# innerHTML assignment
\.innerHTML\s*=

# document.write
document\.write\(

# eval-like
eval\(|Function\(|setTimeout\([^,]*\+
```

### Source Detection

```regex
# useParams (minified Turbopack form)
\(\d+,\s*\w+\.useParams\)\(\)
let\s*\{[^}]+\}\s*=\s*\(\d+,\s*\w+\.useParams\)

# useSearchParams (minified)
\(\d+,\s*\w+\.useSearchParams\)\(\)
\.useSearchParams\(\)\.get\(

# usePathname (minified)
\(\d+,\s*\w+\.usePathname\)\(\)

# window.location sources
window\.location\.(hash|pathname|search|href)
location\.hash\.slice\(

# Server Component await params
const\s*\{[^}]+\}\s*=\s*await\s+params

# Route handler params
params:\s*Promise<\{.*\}>
```

## CSPT-Specific Detection Rules

### Rule 1: useParams to fetch (Client Component)

```regex
# Pattern: destructure useParams, then fetch with that var
# Note: In Next.js this is LOW risk due to re-encoding
useParams\)\(\).*?fetch\(`[^`]*\$\{
```

**Caido HTTPQL:**
```
resp.raw.cont:"useParams" AND resp.raw.cont:"fetch("
```

### Rule 2: searchParams to fetch with innerHTML (Critical)

```regex
# Pattern: searchParams.get() → fetch → dangerouslySetInnerHTML
useSearchParams.*?fetch\(`[^`]*\$\{.*?dangerouslySetInnerHTML
```

**Caido HTTPQL:**
```
resp.raw.cont:"useSearchParams" AND resp.raw.cont:"dangerouslySetInnerHTML"
```

### Rule 3: Hash to fetch (High Risk)

```regex
# Pattern: window.location.hash → variable → fetch
location\.hash.*?fetch\(
```

**Caido HTTPQL:**
```
resp.raw.cont:"location.hash" AND resp.raw.cont:"fetch("
```

### Rule 4: Server-side catch-all to internal fetch (SSRF)

```regex
# Pattern: params.path.join('/') → fetch to internal
\.join\(['"]/'['"]\).*?fetch\(`https?://
```

### Rule 5: Route handler with catch-all params

```regex
# Detect route handlers that proxy to internal services
app/api/.*\[\.\.\..*\]/route\.(ts|js)
```

## Next.js-Specific Caido HTTPQL Queries

```
# Find Next.js apps
resp.raw.cont:"/_next/static/"

# Find dynamic routes in manifests
resp.raw.cont:"nxtP"

# Find potential CSPT sinks in JS bundles
resp.raw.cont:"fetch(" AND resp.raw.cont:"useParams"

# Find dangerouslySetInnerHTML in JS bundles
resp.raw.cont:"dangerouslySetInnerHTML"

# Find server-side fetch patterns
resp.raw.cont:"localhost" AND resp.raw.cont:"fetch("

# Find route handlers (API routes)
req.path.cont:"/api/" AND resp.header.cont:"text/x-component"

# Find RSC requests
req.header.cont:"rsc: 1"

# Find catch-all routes
resp.raw.cont:".join(" AND resp.raw.cont:"fetch("
```

## Testing Payloads for Next.js

### For Server Components (High Priority)

```
# Single [param] routes
/data/..%2F..%2Finternal
/data/..%2F..%2F..%2Fetc%2Fpasswd
/data/%2e%2e%2f%2e%2e%2finternal

# Catch-all [...param] routes
/files/..%2F..%2Fetc/passwd
/files/..%2F..%2F..%2Finternal/config
/api/proxy/..%2F..%2Finternal/admin
```

### For Client Components (Lower Priority)

```
# searchParams-based
/dashboard/stats?report=..%2F..%2Fattachments%2Fmalicious

# Hash-based (no server interaction)
/dashboard/settings#../../admin/users
/dashboard/settings#../../../internal/config
```

### For Route Handlers (SSRF)

```
# Catch-all API routes
/api/proxy/..%2F..%2Finternal/admin
/api/proxy/..%2F169.254.169.254/latest/meta-data
/api/proxy/..%2Flocalhost:6379/
```
