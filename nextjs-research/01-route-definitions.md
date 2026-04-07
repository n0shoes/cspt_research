# 01 - Route Definitions

## Next.js App Router File-Based Routing

Next.js uses file-system routing -- no `createBrowserRouter()` call to find. Routes are defined by the filesystem structure under `app/`.

### Route Types

| Pattern | File Path | URL Pattern | Regex in routes-manifest |
|---------|-----------|-------------|--------------------------|
| Static | `app/about/page.tsx` | `/about` | `^/about(?:/)?$` |
| Dynamic | `app/users/[userId]/page.tsx` | `/users/:userId` | `^/users/([^/]+?)(?:/)?$` |
| Multi-param | `app/shop/[cat]/[prod]/page.tsx` | `/shop/:cat/:prod` | `^/shop/([^/]+?)/([^/]+?)(?:/)?$` |
| Catch-all | `app/files/[...path]/page.tsx` | `/files/*` | `^/files/(.+?)(?:/)?$` |
| Optional catch-all | `app/docs/[[...slug]]/page.tsx` | `/docs` or `/docs/*` | `^/docs(?:/(.+?))?(?:/)?$` |
| Nested dynamic | `app/teams/[t]/members/[m]/page.tsx` | `/teams/:t/members/:m` | multi-segment regex |
| Route handler | `app/api/proxy/[...path]/route.ts` | `/api/proxy/*` | `^/api/proxy/(.+?)(?:/)?$` |

### How Regexes Are Generated

Source: `next/dist/shared/lib/router/utils/route-regex.js`

```javascript
// route-regex.js:58 - single dynamic segment
let s = repeat ? optional ? '(?:/(.+?))?' : '/(.+?)' : '/([^/]+?)';

// Key difference:
// [param]    → /([^/]+?)   -- REJECTS slashes (no %2F traversal possible)
// [...param] → /(.+?)      -- ACCEPTS slashes (traversal via multiple segments)
// [[...param]] → (?:/(.+?))? -- Optional, ACCEPTS slashes
```

### Route Key Naming Convention

Next.js prefixes route keys with `nxtP` in the routes manifest:

```json
{
  "page": "/users/[userId]",
  "routeKeys": { "nxtPuserId": "nxtPuserId" },
  "namedRegex": "^/users/(?<nxtPuserId>[^/]+?)(?:/)?$"
}
```

This `nxtP` prefix is a reliable Next.js fingerprint.

## What Survives Production Build (Turbopack)

### Client-Side Bundles

Next.js with Turbopack produces per-page chunks. Each client component gets its own small chunk file.

**Preserved verbatim:**
- Fetch URL strings: `` `/api/users/${e}` ``, `"/api/shop/" + e + "/products/" + c`
- API base URLs: `"/api/v2"`
- `dangerouslySetInnerHTML` property name
- `window.location.hash`
- Template literal structure with interpolation

**Minified but detectable:**
- `useParams()` → `(0,r.useParams)()` -- the import alias varies but pattern is consistent
- `useSearchParams()` → `(0,t.useSearchParams)()`
- Variable names shortened: `userId` → `e`, `category` → `e`, `productId` → `c`
- Destructuring patterns preserved: `let{userId:e}=`

### Server-Side Bundles

Server components compile into SSR chunks under `.next/server/chunks/`:
- Fetch URLs with template literals preserved: `` `http://localhost:3000/api/files/${e}` ``
- External URLs preserved: `` `https://httpbin.org/anything/${a}` ``
- `cache: "no-store"` option preserved

### Routes Manifest

The file `.next/routes-manifest.json` is always present and contains:
- All dynamic route definitions with their regexes
- Named capture groups with `nxtP` prefix
- Route key mappings
- RSC headers and configuration

## Detection Regexes

### Fingerprint Next.js App

```regex
# In HTML response
/_next/static/
__NEXT_DATA__
__next
next-router-prefetch

# In routes-manifest.json (accessible at /_next/routes-manifest.json in some configs)
"nxtP[a-zA-Z]+"

# In client bundles
globalThis\.TURBOPACK
TURBOPACK\|\|
```

### Extract Dynamic Routes from Build Output

```regex
# From routes-manifest.json
"page":\s*"(/[^"]*\[[^\]]*\][^"]*)"

# From server file structure
/\.next/server/app/.*\[.*\].*page\.js

# Route regex patterns
"namedRegex":\s*"\^[^"]*\(\?<nxtP[^"]*"
```

### Find Fetch Sinks in Client Bundles

```regex
# Template literal fetch with interpolation
fetch\(`[^`]*\$\{[^}]+\}[^`]*`\)

# String concatenation fetch
fetch\("[^"]*"\s*\+\s*\w+

# API path patterns
/api/[a-z]+/\$\{

# dangerouslySetInnerHTML sink
dangerouslySetInnerHTML:\s*\{

# Hash-based source
window\.location\.hash
location\.hash\.slice
```

### Find CSPT Sources in Client Bundles

```regex
# useParams destructuring (minified)
let\s*\{[^}]+\}\s*=\s*\(\d+,\s*\w+\.\w+\)\(\)

# useSearchParams
\.useSearchParams\(\)\.get\(

# window.location sources
window\.location\.(hash|pathname|search|href)
```
