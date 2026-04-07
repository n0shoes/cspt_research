# 1. Route Definitions in React Router v7 Framework Mode (Remix)

## Route Configuration: `routes.ts`

React Router v7 framework mode uses a `routes.ts` file (replaces Remix v2's flat file convention). Routes are defined programmatically:

```typescript
import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("users/:userId", "routes/users.$userId.tsx"),
  route("shop/:category/:productId", "routes/shop.$category.$productId.tsx"),
  route("files/*", "routes/files.$.tsx"),
  layout("routes/dashboard.tsx", [
    index("routes/dashboard._index.tsx"),
    route("stats", "routes/dashboard.stats.tsx"),
    route("settings", "routes/dashboard.settings.tsx"),
  ]),
  route("data/:dataId", "routes/data.$dataId.tsx"),
] satisfies RouteConfig;
```

## File Naming Convention

While `routes.ts` defines the route patterns, the file naming convention from Remix v2 is still commonly used for the module file names:

| Convention | Example File | Route Pattern |
|-----------|-------------|---------------|
| `$param` | `users.$userId.tsx` | `users/:userId` |
| `$` (alone) | `files.$.tsx` | `files/*` (splat/catch-all) |
| `._index` | `dashboard._index.tsx` | Index route (no path segment) |
| `.` separator | `dashboard.stats.tsx` | Nested under parent (`dashboard/stats`) |
| `_` prefix (pathless) | `_auth.login.tsx` | Layout without URL segment |

## Route Modules: Loaders, Actions, Components

Each route module can export:

| Export | Purpose | Execution | CSPT Risk |
|--------|---------|-----------|-----------|
| `loader` | GET data fetching | **Server-side** | SSRF if params in fetch URL |
| `action` | POST/PUT/DELETE mutations | **Server-side** | SSRF + CSPT2CSRF |
| `default` (component) | UI rendering | Client-side (+ SSR) | Client CSPT, XSS |
| `clientLoader` | Client-side data fetching | Client-side only | Client CSPT |
| `clientAction` | Client-side mutations | Client-side only | Client CSPT |
| `meta` | SEO metadata | Both | Low |
| `links` | Link tags | Both | Low |
| `headers` | HTTP headers | Server-side | Low |

## What Survives in Production Build

### Client Manifest (`window.__reactRouterManifest`)

The manifest reveals the complete route structure:

```javascript
window.__reactRouterManifest = {
  "entry": {
    "module": "/assets/entry.client-CiypOLxj.js",
    "imports": ["/assets/chunk-EPOLDU6W-jgZcKmkK.js"]
  },
  "routes": {
    "routes/users.$userId": {
      "id": "routes/users.$userId",
      "parentId": "root",
      "path": "users/:userId",
      "hasAction": true,      // <-- reveals action endpoint exists
      "hasLoader": true,      // <-- reveals loader endpoint exists
      "hasClientAction": false,
      "hasClientLoader": false,
      "module": "/assets/users._userId-CcL-Wuzu.js"
    },
    "routes/files.$": {
      "id": "routes/files.$",
      "path": "files/*",       // <-- splat route visible
      "hasLoader": true
    }
  }
};
```

**Key intelligence from manifest:**
- Complete route paths with `:param` and `*` markers
- Which routes have server loaders (potential SSRF targets)
- Which routes have server actions (potential CSPT2CSRF targets)
- Client module URLs for further analysis
- Parent/child relationships for nested routing

### Server Build (`build/server/index.js`)

The server bundle is **NOT minified** by default. Loader and action function bodies are readable:

```javascript
async function loader$7({ params }) {
  const res = await fetch(`http://localhost:3000/api/users/${params.userId}`);
  // ...
}

async function action({ params, request }) {
  await fetch(`http://internal-api.local/users/${params.userId}/settings`, {
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(formData)),
  });
}
```

**Internal service URLs, auth headers, and API patterns are fully exposed in server bundles.**

### Client Chunks

Client route chunks ARE minified. Pattern from build:

```javascript
// users._userId-CcL-Wuzu.js (minified)
const u=c(function(){
  const a=l(),{userId:s}=h(),[n,r]=t.useState(null);
  t.useEffect(()=>{fetch(`/api/users/${s}`)...},[s])
  // ...
});
```

Hook names mangled (`l`=useLoaderData, `h`=useParams), but fetch URL strings and template literals preserved verbatim.

## Detection Regexes

```
# React Router v7 Framework Mode fingerprint (in HTML)
__reactRouterManifest

# Route manifest with dynamic params
"path":"[^"]*:[a-zA-Z]\w*[^"]*"

# Route manifest with splat
"path":"[^"]*\*[^"]*"

# Routes with loaders (server-side data fetching)
"hasLoader":true

# Routes with actions (server-side mutations)
"hasAction":true

# Server build: loader function with params → fetch
async function \w+\(\{\s*params\s*\}\).*fetch\(

# Server build: action function
async function \w+\(\{\s*params,\s*request\s*\}\)

# Server build: internal service URL in loader
fetch\(`http://[^`]*\$\{params\.\w+\}

# Server build: route module export
module:\s*route\d+

# Client chunk: minified useParams → fetch chain
\{\w+:\w+\}=\w+\(\)[^]*?fetch\(`[^`]*\$\{
```
