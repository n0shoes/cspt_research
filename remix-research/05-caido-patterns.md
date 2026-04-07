# 5. Caido Patterns for Remix / React Router v7 Framework Mode

## Framework Detection

### Definitive Fingerprints

```typescript
// React Router v7 Framework Mode (the new Remix) detection
function detectRR7FrameworkMode(body: string): boolean {
  return (
    /__reactRouterManifest/.test(body) ||
    /__reactRouterContext/.test(body) ||
    /__reactRouterVersion/.test(body) ||
    /__reactRouterHdrActive/.test(body) ||
    /__reactRouterDataRouter/.test(body) ||
    /__reactRouterRouteModules/.test(body)
  );
}

// Distinguish from plain React Router (SPA mode)
function isFrameworkMode(body: string): boolean {
  // Framework mode has manifest with hasLoader/hasAction
  return /"hasLoader":true/.test(body) || /"hasAction":true/.test(body);
}
```

### Fingerprint Regex Patterns

```typescript
// Primary: manifest in HTML (always present in framework mode)
{ regex: /__reactRouterManifest/g, type: "framework-marker", confidence: "high" }

// Secondary: context object with isSpaMode
{ regex: /__reactRouterContext/g, type: "framework-marker", confidence: "high" }

// Version identifier
{ regex: /__reactRouterVersion/g, type: "framework-marker", confidence: "high" }

// X-Remix headers in client bundle (framework mode specific)
{ regex: /X-Remix-(?:Response|Redirect|Revalidate|Reload|Replace|Status)/g, type: "framework-marker", confidence: "medium" }

// isSpaMode references (framework mode feature)
{ regex: /isSpaMode/g, type: "framework-marker", confidence: "medium" }
```

### Fingerprint Counts from Production Build (v7.12.0)

| Fingerprint | Location | Count |
|-------------|----------|-------|
| `__reactRouterManifest` | manifest JS + entry chunk | 5 |
| `__reactRouterContext` | entry chunk + shared chunk | 8 |
| `__reactRouterVersion` | shared chunk | 1 |
| `__reactRouterRouteModules` | shared chunk | 1 |
| `__reactRouterHdrActive` | shared chunk | 1 |
| `__reactRouterDataRouter` | shared chunk | 1 |
| `X-Remix-*` headers | shared chunk | 14 |
| `isSpaMode` | entry chunk | 9 |

## Route Extraction from Manifest

```typescript
// Extract all routes from __reactRouterManifest
{ regex: /window\.__reactRouterManifest\s*=\s*(\{[\s\S]*?\});\s*$/m,
  type: "manifest", process: "parseJSON" }

// Individual route paths from manifest
{ regex: /"path":"([^"]+)"/g, type: "route" }

// Routes with loaders (server-side data fetching -- SSRF targets)
{ regex: /"id":"([^"]+)"[^}]*"hasLoader":true/g, type: "loader-route",
  description: "Route with server loader - potential SSRF target" }

// Routes with actions (server-side mutations -- CSPT2CSRF targets)
{ regex: /"id":"([^"]+)"[^}]*"hasAction":true/g, type: "action-route",
  description: "Route with server action - potential CSPT2CSRF target" }

// Splat routes (highest risk)
{ regex: /"path":"([^"]*\*[^"]*)"/g, type: "splat-route",
  description: "Splat/catch-all route - captures across / boundaries" }

// Dynamic param routes
{ regex: /"path":"([^"]*:[a-zA-Z]\w*[^"]*)"/g, type: "dynamic-route" }

// Client module URLs for further analysis
{ regex: /"module":"(\/assets\/[^"]+\.js)"/g, type: "chunk-url" }
```

## Sink Detection in Client Bundles

```typescript
// Minified useParams → fetch (template literal)
{ regex: /\{\w+:\w+\}=\w{1,3}\(\)[^]*?fetch\(`[^`]*\$\{/g, risk: "high",
  description: "Minified useParams destructure flowing into fetch template literal" }

// Minified useParams → fetch (concatenation)
{ regex: /\{\w+:\w+\}=\w{1,3}\(\).*fetch\("[^"]+"\+\w+/g, risk: "high",
  description: "Minified useParams flowing into fetch concatenation" }

// API service layer pattern
{ regex: /\{get:\w+=>\s*fetch\(`[^`]*\$\{\w+\}`\)/g, risk: "high",
  description: "API service object wrapping fetch with param interpolation" }

// searchParams → fetch → dangerouslySetInnerHTML chain
{ regex: /\.get\("[^"]+"\).*fetch\(`[^`]*\$\{.*dangerouslySetInnerHTML/gs, risk: "critical",
  description: "searchParams → fetch → innerHTML XSS chain" }

// Splat param access near fetch
{ regex: /\w+\["\*"\][^;]*;[^]*?fetch\s*\(\s*`[^`]*\$\{/g, risk: "high",
  description: "Splat param flows to fetch" }

// dangerouslySetInnerHTML with variable
{ regex: /dangerouslySetInnerHTML:\{__html:\w{1,3}\}/g, risk: "high",
  description: "dangerouslySetInnerHTML with variable - potential XSS sink" }

// navigate with variable (open redirect)
{ regex: /\w{1,3}\(\w+\).*useNavigate|useNavigate.*\w{1,3}\(\w+\)/gs, risk: "medium",
  description: "navigate() with variable - open redirect" }
```

## Sink Detection in Server Bundles

Server bundles are typically NOT accessible externally, but if exposed (misconfiguration, source maps, or build artifact leak):

```typescript
// Server loader with params in fetch URL
{ regex: /async function \w+\(\{\s*params\s*\}\)[^}]*fetch\(`[^`]*\$\{params\.\w+\}/g,
  risk: "critical",
  description: "Server loader using route params in fetch URL - SSRF" }

// Server loader with splat in fetch URL
{ regex: /params\["\*"\][^;]*;[^]*?fetch\(`[^`]*\$\{/g,
  risk: "critical",
  description: "Server loader using splat param in fetch URL - unrestricted SSRF" }

// Server action with params in fetch URL
{ regex: /async function \w+\(\{\s*params,\s*request\s*\}\)[^}]*fetch\(`[^`]*\$\{params\.\w+\}/g,
  risk: "critical",
  description: "Server action using route params in fetch URL - CSPT2CSRF + SSRF" }

// Internal service URL patterns
{ regex: /fetch\(`https?:\/\/(?:internal|localhost|127\.0\.0\.1|10\.|172\.\d+\.|192\.168\.)[^`]*\$\{/g,
  risk: "critical",
  description: "Fetch to internal/localhost with param interpolation" }

// Auth headers in loader fetch
{ regex: /headers:\s*\{[^}]*(?:Authorization|X-Internal|X-API|Bearer)[^}]*\}[^}]*fetch/gs,
  risk: "critical",
  description: "Auth headers near fetch - credential leak via SSRF" }

// process.env in loader
{ regex: /process\.env\.\w+[^;]*fetch/g,
  risk: "critical",
  description: "Environment variable used near fetch - potential credential in SSRF" }
```

## `.data` Endpoint Detection

```typescript
// Detect .data endpoint responses (turbo-stream content type)
{ regex: /content-type:\s*text\/x-turbo/i, type: "header",
  description: "turbo-stream response - React Router v7 framework mode .data endpoint" }

// Client-side .data URL construction
{ regex: /\.pathname\s*=\s*`\$\{[^}]+\}\.data`/g, type: "code",
  description: "singleFetchUrl constructing .data endpoint URL" }

// _routes query param (route targeting for data fetching)
{ regex: /_routes=[^&"]+/g, type: "query",
  description: "Route targeting param for .data endpoint" }
```

## HTTPQL Queries for Caido

```
# Find .data endpoint requests
req.path.cont:".data" AND resp.header.cont:"turbo"

# Find manifest responses
resp.raw.cont:"__reactRouterManifest"

# Find routes with loaders
resp.raw.cont:"hasLoader\":true"

# Find routes with actions
resp.raw.cont:"hasAction\":true"

# Find splat routes
resp.raw.cont:"\"path\":\"" AND resp.raw.cont:"*\""

# Find server-side SSRF patterns (if server bundle exposed)
resp.raw.cont:"fetch(`http" AND resp.raw.cont:"${params"

# Detect X-Remix headers
resp.header.cont:"X-Remix"

# Find turbo-stream responses
resp.header.cont:"text/x-turbo"
```
