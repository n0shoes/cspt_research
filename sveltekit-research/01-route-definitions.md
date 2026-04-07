# 1. SvelteKit Route Definitions

## File-Based Routing Convention

SvelteKit uses a file-based routing system under `src/routes/`. Every route is defined by a directory structure with special files.

### Route File Types

| File | Purpose | Runs On | CSPT Relevance |
|------|---------|---------|----------------|
| `+page.svelte` | Component (UI) | Client | Renders data, may use `{@html}` sink |
| `+page.ts` | Universal load | Client + Server | `fetch()` with params = CSPT source |
| `+page.server.ts` | Server load | Server only | `fetch()` with params = SSRF source |
| `+server.ts` | API endpoint | Server only | Request handler, often proxies to backends |
| `+layout.svelte` | Layout component | Client | Wraps child routes |
| `+layout.ts` | Layout load | Client + Server | Shared data loading |
| `+layout.server.ts` | Server layout load | Server only | Shared server data |
| `+error.svelte` | Error boundary | Client | Custom error pages |

### Dynamic Route Patterns

```
src/routes/
  [param]/           # Single dynamic param: /anything
  [param=matcher]/   # Param with matcher validation: /123 (if integer)
  [[optional]]/      # Optional param: / or /value
  [...rest]/          # Catch-all (rest): /a/b/c/d
  (group)/            # Route group (no URL impact)
```

### Parameter Behavior

**Single param `[param]`:**
- Matches exactly one path segment
- Regex: `([^/]+?)`
- `decodeURIComponent()` applied to extracted value

**Catch-all `[...rest]`:**
- Matches zero or more segments
- Regex: `([^]*?)`  (note: `[^]` matches ANY character including `/`)
- Returns a **string** (not an array like Vue Router)
- Example: `/files/a/b/c` -> `params.rest = "a/b/c"`
- HIGHEST RISK: Slashes preserved in param value

**Optional `[[optional]]`:**
- Matches zero or one segment
- Regex: `([^/]*)?`

**Matcher `[param=matcher]`:**
- Validates param against `src/params/matcher.ts`
- If matcher returns `false`, route does not match
- Defense mechanism against traversal

### Route Regex Generation

From `src/utils/routing.js`, `parse_route_id()` (line 10):

```javascript
export function parse_route_id(id) {
    const params = [];
    const pattern = id === '/'
        ? /^\/$/
        : new RegExp(
            `^${get_route_segments(id)
                .map((segment) => {
                    const rest_match = /^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(segment);
                    if (rest_match) {
                        return '(?:/([^]*))?';  // catch-all
                    }
                    // ... single param: ([^/]+?)
                    // ... optional: ([^/]*)?
                })
                .join('')}/?$`
        );
    return { pattern, params };
}
```

Key observation: The regex for catch-all `([^]*)` uses `[^]` which matches **any character** including newlines and `/`. This is unlike `[^/]+` used for single params.

## What Survives Production Build

### Client Bundle: Route Dictionary

The `app.*.js` entry point exposes the full route dictionary:

```javascript
const dictionary = {
    "/": [3],
    "/about": [4],
    "/dashboard": [5, [2]],
    "/dashboard/settings": [6, [2]],
    "/dashboard/stats": [7, [2]],
    "/data/[dataId]": [-9],           // negative = uses server data
    "/encoding-catchall/[...rest]": [9],
    "/encoding-test/[testParam]": [10],
    "/files/[...path]": [11],
    "/shop/[category]/[productId]": [12],
    "/teams/[teamId]/members/[memberId]": [13],
    "/users/[userId]": [14]
};
```

**Negative node IDs** (e.g., `-9`) indicate routes that use server-side data (ones' complement encoding). This reveals which routes have `+page.server.ts`.

### Client Bundle: Matchers

Param matchers are inlined in the client bundle:

```javascript
const integer = r => /^\d+$/.test(r);
const matchers = { integer };
```

### Server Build: Load Functions Preserved

Server-side build output preserves fetch patterns verbatim:

```javascript
// entries/pages/files/_...path_/_page.ts.js
async function load({ params, fetch }) {
    const res = await fetch(`/api/files/${params.path}`);
    return { content: await res.text() };
}
```

### Detection Regexes for Build Output

```regex
# Route dictionary in client bundle
/dictionary\s*[=:]\s*\{[^}]*\[/

# SvelteKit route patterns in dictionary
/"\/([\w-]+\/)*\[\.{0,3}\w+\]"/

# Server load indicator (negative node ID)
/\[-([\d]+)\]/

# Catch-all routes (highest risk)
/\[\.\.\.(\w+)\]/

# Param matchers
/matchers\s*[=:]\s*\{/
```

## +page.ts vs +page.server.ts

### Universal Load (`+page.ts`)

```typescript
export async function load({ params, fetch, url }) {
    // Runs on BOTH server (SSR) and client (navigation)
    // `fetch` is SvelteKit's enhanced fetch:
    //   - Server: makes internal request, returns response directly
    //   - Client: makes normal browser fetch
    const res = await fetch(`/api/users/${params.userId}/profile`);
    return { user: await res.json() };
}
```

**CSPT attack path:** On client-side navigation, `params` values come from the URL. If user navigates to `/users/..%2F..%2Fadmin`, the fetch URL becomes `/api/users/../../admin/profile`.

### Server Load (`+page.server.ts`)

```typescript
export async function load({ params }) {
    // Runs ONLY on server - has access to internal network
    // Uses Node.js/runtime fetch, not SvelteKit's
    const res = await fetch(`http://internal-service.local/data/${params.dataId}`);
    return { data: await res.json() };
}
```

**SSRF attack path:** params flow directly into server-side fetch to internal services. If attacker can control `params.dataId`, they can reach internal endpoints.

### API Endpoint (`+server.ts`)

```typescript
export async function GET({ params }) {
    // Server-only request handler
    const res = await fetch(`https://backend.internal/${params.path}`);
    return json(await res.json());
}
```

**SSRF attack path:** Similar to server load, but exposed as an API endpoint that can be called directly.
