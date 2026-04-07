# 5. Updated Regex Patterns for Caido Plugin

## New/Updated Path Extraction Patterns

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

## New/Updated Sink Detection Patterns

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

## Updated Framework Detection

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
