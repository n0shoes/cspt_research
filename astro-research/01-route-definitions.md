# 01 - Astro Route Definitions

## File-Based Routing

Astro uses filesystem-based routing from `src/pages/`. The route system is defined in:
- `astro/dist/core/routing/manifest/create.js` - `createFileBasedRoutes()`
- `astro/dist/core/routing/manifest/pattern.js` - `getPattern()`

### Route Types

| File Pattern | Route Type | Regex Pattern | Param Extraction |
|---|---|---|---|
| `pages/about.astro` | Static page | `^\\/about\\/?$` | None |
| `pages/users/[userId].astro` | Dynamic page | `^\\/users\\/([^/]+?)\\/?$` | Single segment |
| `pages/shop/[cat]/[id].astro` | Multi-param page | `^\\/shop\\/([^/]+?)\\/([^/]+?)\\/?$` | Two segments |
| `pages/files/[...path].astro` | Catch-all page | `^\\/files(?:\\/(.*?))?\\/?$` | Everything after prefix |
| `pages/api/users/[id].ts` | API endpoint | `^\\/api\\/users\\/([^/]+?)\\/?$` | Single segment |
| `pages/api/files/[...path].ts` | API catch-all | `^\\/api\\/files(?:\\/(.*?))?\\/?$` | Everything after prefix |

### Key Regex Differences

**Dynamic `[param]`**: Uses `([^/]+?)` -- matches one or more characters EXCEPT `/`. This prevents traversal via decoded `/` characters. However, since Astro uses `decodeURI()` which preserves `%2F`, a literal `%2F` in the param would match as part of the string.

**Catch-all `[...param]`**: Uses `(.*?)` -- matches ANYTHING including `/`. This is the highest-risk pattern because traversal sequences with literal slashes are captured directly.

### Important: Catch-all Params are Strings, Not Arrays

Unlike Next.js where `[...slug]` returns an array (`['a', 'b', 'c']`), Astro catch-all params return a single string with slashes preserved:

```javascript
// URL: /files/a/b/c
// Next.js: params.path = ['a', 'b', 'c']
// Astro:   params.path = 'a/b/c'
```

This means `${params.path}` in a template literal directly includes the slashes, making traversal trivial in catch-all routes.

## SSG vs SSR: The Security Boundary

### SSG Mode (`output: 'static'` or `output: 'hybrid'` with prerender)

In SSG mode, dynamic routes REQUIRE `getStaticPaths()`:
```astro
---
export function getStaticPaths() {
  return [
    { params: { userId: '1' } },
    { params: { userId: '2' } },
  ];
}
const { userId } = Astro.params;
---
```

Params come from developer-defined values. No user input reaches params. **No CSPT surface.**

### SSR Mode (`output: 'server'`)

In SSR mode, params are extracted directly from the URL at request time via regex matching:

```javascript
// astro/dist/core/render/params-and-props.js:37
function getParams(route, pathname) {
  if (!route.params.length) return {};
  const paramsMatch = route.pattern.exec(pathname);
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
    } else {
      params[key] = paramsMatch[i + 1];
    }
  });
  return params;
}
```

The `pathname` has already been through `decodeURI()` at this point. User controls the value. **Full CSPT surface.**

## Production Build Structure

SSR build outputs to `dist/server/`:
```
dist/
  client/          # Static assets
  server/
    entry.mjs      # Server entrypoint
    manifest_*.mjs # Route manifest with compiled patterns
    pages/         # Individual route handlers
      _image.astro.mjs
      about.astro.mjs
      users/_userid_.astro.mjs
      files/_---path_.astro.mjs      # catch-all
      api/proxy/_---path_.astro.mjs  # API catch-all
```

### Production Filename Convention

Dynamic params: `_paramname_.astro.mjs`
Catch-all params: `_---paramname_.astro.mjs`

This naming convention can be used for fingerprinting Astro apps in production.

## Detection Regexes

### Identify Astro Applications
```
# Response headers
x-astro-
astro-

# HTML meta tag
<meta name="generator" content="Astro v

# Client-side hydration scripts
self.Astro||(self.Astro={})
astro:idle
astro:load
astro:visible
astro:media

# Build artifacts
/_astro/
/_server-islands/
/_image
```

### Identify SSR Mode
```
# No pre-rendered HTML files in dist/client/ for dynamic routes
# Server entry point exists
dist/server/entry.mjs

# Manifest indicates server mode
"buildFormat":"directory"
"prerender":false
```

### Identify Vulnerable Patterns
```
# Catch-all routes (highest risk)
pages/**/[...*.astro
pages/**/[...*.ts

# Dynamic params in API routes
pages/api/**/[*.ts

# set:html usage (XSS sink)
set:html=
set:html={
```
