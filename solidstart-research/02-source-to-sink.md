# 02 - Source-to-Sink Dataflow

## Sources (User-Controlled Input)

### 1. `useParams()` -- Route Parameters

```typescript
import { useParams } from "@solidjs/router";
const params = useParams<{ userId: string }>();
// params.userId comes from URL path segment
```

**Implementation** (`routing.js:130`):
```javascript
export const useParams = () => useRouter().params;
```

`params` is a reactive Proxy created by `createMemoObject(buildParams)` in `createRouterContext()` (`routing.js:397-407`). It merges all matched route params:

```javascript
const buildParams = () => {
  const m = matches();
  const params = {};
  for (let i = 0; i < m.length; i++) {
    Object.assign(params, m[i].params);
  }
  return params;
};
```

**Key:** Each `m[i].params` comes from `createMatcher()` (`utils.js:50-89`) which stores raw URL segments WITHOUT decoding.

### 2. `useLocation()` -- Location Object

```typescript
import { useLocation } from "@solidjs/router";
const location = useLocation();
// location.pathname, location.search, location.hash
```

**Implementation** (`routing.js:53`):
```javascript
export const useLocation = () => useRouter().location;
```

Location is created from `createLocation()` (`routing.js:293-330`) using `new URL(path, origin)`. The `path` signal comes from `Router.js:10`:

```javascript
const url = window.location.pathname.replace(/^\/+/, "/") + window.location.search;
// ... value: url + window.location.hash
```

`window.location.pathname` retains percent-encoding. No decoding applied.

### 3. `useSearchParams()` -- Query Parameters

```typescript
import { useSearchParams } from "@solidjs/router";
const [searchParams] = useSearchParams<{ source?: string }>();
// searchParams.source comes from ?source=value
```

**Implementation** (`routing.js:158-170`): Returns `location.query` which is extracted via `extractSearchParams(url)`:

```javascript
export function extractSearchParams(url) {
  const params = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value; // URLSearchParams auto-decodes
  });
  return params;
}
```

**Key:** `URLSearchParams` performs automatic decoding. `?source=%2e%2e%2fadmin` becomes `source: "../admin"`.

### 4. Server Function Arguments -- `query()` with `"use server"`

```typescript
const getData = query(async (dataId: string) => {
  "use server";
  // dataId received from client via JSON RPC
}, "getData");

// Client-side call:
const data = createAsync(() => getData(params.dataId));
```

Arguments pass through seroval serialization -> POST to `/_server` -> seroval deserialization. The string value is preserved exactly.

### 5. `window.location` -- Direct Browser API

```typescript
const path = window.location.pathname; // raw, encoded
const hash = window.location.hash;     // raw, encoded
```

Not managed by router. Direct access to browser state.

## Sinks (Dangerous Operations)

### Sink 1: `fetch()` with String Interpolation

```typescript
// HIGH RISK: Direct param in URL
const [user] = createResource(
  () => params.userId,
  async (userId) => {
    const res = await fetch(`/api/users/${userId}`);
    return res.json();
  }
);
```

**Minified pattern:**
```javascript
fetch(`/api/users/${e}`)
```

### Sink 2: `fetch()` with Catch-All Params

```typescript
// HIGHEST RISK: Catch-all captures full path with slashes
const [file] = createResource(
  () => params.path,
  async (path) => {
    const res = await fetch(`/api/files/${path}`);
    return res.json();
  }
);
```

Catch-all `params.path` is a string like `"docs/readme.txt"` -- already contains real slashes.

### Sink 3: `innerHTML` (Solid Native)

```typescript
// CRITICAL: Native Solid innerHTML support
<div innerHTML={stats()} />
```

**Minified pattern:**
```javascript
d(n, "innerHTML", a())  // where d is solid's property setter
```

Solid compiles `innerHTML` prop to a direct `element.innerHTML = value` call via its web runtime.

### Sink 4: Server-Side Fetch via Server Functions

```typescript
const getData = query(async (dataId: string) => {
  "use server";
  const res = await fetch(`http://internal-service.local/data/${dataId}`);
  return res.json();
}, "getData");
```

The `dataId` arrives via JSON RPC (seroval deserialization). No server-side validation or re-encoding. This enables SSRF via CSPT.

### Sink 5: `useNavigate()` -- Open Redirect

```typescript
const navigate = useNavigate();
navigate(userInput); // If userInput is attacker-controlled
```

### Sink 6: API Route Params

```typescript
// src/routes/api/proxy/[...path].ts
export async function GET(event: APIEvent) {
  const path = event.params.path;
  const targetUrl = `http://internal-api.local/${path}`;
  // Server-side SSRF
}
```

API routes use radix3 router. The `event.params` come from radix3 matching, which also preserves raw path values.

## Source-to-Sink Chains

### Chain 1: useParams -> createResource -> fetch (Client-Side CSPT)

```
URL: /users/../../admin/secrets
  -> @solidjs/router createMatcher() extracts "../../admin/secrets" as userId
  -> useParams().userId = "../../admin/secrets"
  -> createResource tracks params.userId as signal
  -> fetcher fires: fetch("/api/users/../../admin/secrets")
  -> Browser resolves to: fetch("/admin/secrets")
```

**Complication:** The router splits on `/` for matching. `../../admin/secrets` contains slashes, so it won't match a single `:userId` segment. The traversal must use encoded slashes (`%2f`) which the router does NOT decode, or target catch-all routes.

### Chain 2: Catch-All -> fetch (Most Viable Client-Side)

```
URL: /files/../../admin/secrets
  -> Catch-all [..path] captures remaining segments
  -> params.path = "../../admin/secrets" (joined with real /)
  -> fetch("/api/files/../../admin/secrets")
  -> Browser resolves to: fetch("/admin/secrets")
```

This is the most direct CSPT vector. The catch-all naturally captures multiple path segments including `..`.

### Chain 3: useSearchParams -> fetch -> innerHTML (CSPT-to-XSS)

```
URL: /dashboard/stats?source=../../attacker-upload/malicious.json
  -> searchParams.source = "../../attacker-upload/malicious.json"
  -> fetch("/api/stats?source=../../attacker-upload/malicious.json")
  -> Response contains HTML payload
  -> innerHTML renders attacker HTML -> XSS
```

### Chain 4: useParams -> query("use server") -> server fetch (SSRF via CSPT)

```
URL: /data/../../admin/internal-config
  -> params.dataId = "../../admin/internal-config"
  -> Client calls getData("../../admin/internal-config")
  -> seroval serializes string, POST to /_server
  -> Server deserializes: dataId = "../../admin/internal-config"
  -> Server-side fetch("http://internal-service.local/data/../../admin/internal-config")
  -> Resolves to: http://internal-service.local/admin/internal-config
```

### Chain 5: Reactive Navigation (No Page Reload)

```
Attacker page: navigate("/files/../../admin/secrets")
  -> SolidStart client-side navigation (no full page load)
  -> Router updates params reactively
  -> createResource detects param change
  -> New fetch fires immediately
  -> Response parsed and rendered
```

Solid's fine-grained reactivity means CSPT sinks fire instantly on navigation without requiring a page reload.

## Minified Sink Detection Patterns

```
# fetch with interpolated param (from useParams)
/fetch\(`[^`]*\$\{[a-z]\.[a-zA-Z]+\}`?\)/

# innerHTML assignment (Solid runtime)
/\w\(\w+,"innerHTML",\w+\(\)\)/

# createResource with fetch (w = createResource import)
/\w\(\(\)=>[a-z]\.\w+,async\s*\w+=>\{.*fetch/

# Server function call pattern
/"X-Server-Id"/
/encodeURIComponent\(\w+\)/

# useParams import (j as varname from routing chunk)
/\{j\s+as\s+\w+\}/

# useSearchParams import (u as varname from routing chunk)
/\{u\s+as\s+\w+\}/
```
