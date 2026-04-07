# 2. SvelteKit Source-to-Sink Analysis

## Sources (Attacker-Controlled Input)

### 1. `params` in Universal Load (`+page.ts`)

```typescript
export async function load({ params, fetch }) {
    // params.userId comes from URL path
    const res = await fetch(`/api/users/${params.userId}/profile`);
}
```

**How params are populated (client-side):**

1. `get_navigation_intent()` in `client.js` (line 1408) receives URL
2. `get_url_path()` (line 1451) extracts path: `decode_pathname(url.pathname.slice(base.length))`
3. Route regex `.exec(path)` matches against the decoded path
4. `decode_params(params)` (line 1426) applies `decodeURIComponent()` to each param
5. Decoded params passed to `load()` function

**How params are populated (server-side):**

1. `internal_respond()` in `respond.js` (line 70) receives request
2. `resolved_path = decode_pathname(resolved_path)` (line 246) decodes path
3. `find_route(resolved_path, routes, matchers)` (line 313) matches route
4. `exec()` extracts params, `decode_params()` applies `decodeURIComponent()`
5. Params passed to `load()` function

### 2. `params` in Server Load (`+page.server.ts`)

Same as above but server-side only. Higher risk because server has access to internal network.

### 3. `params` in API Endpoint (`+server.ts`)

```typescript
export async function GET({ params }) {
    // params.path from catch-all route
}
```

### 4. `url.searchParams` in Load Functions

```typescript
export async function load({ url, fetch }) {
    const widget = url.searchParams.get('widget');
    const res = await fetch(`/api/widgets/${widget}`);
}
```

Directly attacker-controlled via query string.

### 5. `$page.params` in Components (Svelte Store)

```svelte
<script>
    import { page } from '$app/stores';
    // $page.params.testParam available in component
</script>
```

Reactive store that reflects current route params. Used for client-side rendering.

### 6. `$page.url` in Components

```svelte
<script>
    import { page } from '$app/stores';
    // $page.url.pathname, $page.url.searchParams
</script>
```

### 7. `window.location` in Components (via `onMount`)

```svelte
<script>
    import { onMount } from 'svelte';
    onMount(() => {
        // window.location.pathname - raw browser URL
    });
</script>
```

## Sinks (Dangerous Consumers)

### 1. `fetch()` in Load Functions (CSPT / SSRF)

**Universal load (CSPT on client, request on server):**
```typescript
// +page.ts
export async function load({ params, fetch }) {
    await fetch(`/api/files/${params.path}`);        // Template literal
    await fetch("/api/shop/" + params.category + "/products/" + params.productId);  // Concatenation
}
```

**Server load (SSRF):**
```typescript
// +page.server.ts
export async function load({ params }) {
    await fetch(`http://internal-service.local/data/${params.dataId}`);
}
```

**API endpoint (SSRF):**
```typescript
// +server.ts
export async function GET({ params }) {
    await fetch(`https://backend.internal/${params.path}`);
}
```

### 2. `{@html}` Directive (XSS)

```svelte
<!-- Svelte's equivalent of dangerouslySetInnerHTML -->
{@html data.content}
```

When `data.content` comes from a fetch that was redirected via CSPT to attacker-controlled content, this results in XSS.

**Chain:** CSPT redirects fetch -> returns malicious HTML -> `{@html}` renders it -> XSS

### 3. `goto()` Navigation (Open Redirect)

```svelte
<script>
    import { goto } from '$app/navigation';
    const redirect = new URLSearchParams(location.search).get('redirect');
    if (redirect) goto(redirect);
</script>
```

If `redirect` param is attacker-controlled, this becomes an open redirect.

### 4. `element.innerHTML` in Components

```svelte
<script>
    import { onMount } from 'svelte';
    let container;
    onMount(() => {
        container.innerHTML = someData;  // Direct DOM manipulation
    });
</script>
<div bind:this={container}></div>
```

## Complete Attack Chains

### Chain 1: CSPT + {@html} = XSS

```
Source: /files/[...path] param
  -> Flow: params.path in +page.ts load function
  -> Sink: fetch(`/api/files/${params.path}`)
  -> Response flows to: data.content
  -> Rendered via: {@html data.content}
  -> Result: XSS

Attack URL: /files/..%2F..%2Fattacker-controlled-endpoint
```

### Chain 2: SSRF via Server Load

```
Source: /data/[dataId] param
  -> Flow: params.dataId in +page.server.ts load function
  -> Sink: fetch(`http://internal-service.local/data/${params.dataId}`)
  -> params.dataId = "../../sensitive-endpoint"
  -> Result: Full-read SSRF to internal network

Attack URL: /data/..%2F..%2Fsensitive-endpoint
```

### Chain 3: SSRF via API Endpoint

```
Source: /api/proxy/[...path] param
  -> Flow: params.path in +server.ts GET handler
  -> Sink: fetch(`https://backend.internal/${params.path}`)
  -> params.path controls full backend URL path
  -> Result: SSRF to arbitrary backend paths

Attack URL: /api/proxy/..%2F..%2Fadmin%2Fsecrets
```

### Chain 4: Search Param CSPT + {@html} = XSS

```
Source: ?widget= query param
  -> Flow: url.searchParams.get('widget') in +page.ts
  -> Sink: fetch(`/api/widgets/${widget}`)
  -> Response flows to: data.content
  -> Rendered via: {@html data.content}
  -> Result: XSS

Attack URL: /dashboard/stats?widget=..%2F..%2Fattacker-endpoint
```

### Chain 5: Multi-Param CSPT

```
Source: /shop/[category]/[productId] params
  -> Flow: Both params concatenated in fetch URL
  -> Sink: fetch("/api/shop/" + params.category + "/products/" + params.productId)
  -> category = "..%2F..%2Fadmin" breaks out of /api/shop/ prefix
  -> Result: CSPT to arbitrary API endpoints

Attack URL: /shop/..%2F..%2Fadmin/anything
```

## Source-to-Sink Flow Diagram

```
URL Path/Query
    |
    v
[SvelteKit Router]
    |-- decode_pathname() (decodeURI, preserve %25)
    |-- route.pattern.exec(path)
    |-- decode_params() (decodeURIComponent per param)
    |
    v
+page.ts / +page.server.ts / +server.ts
    |
    v
load({ params, fetch, url })
    |
    |-- fetch(`/api/${params.value}`)     --> CSPT/SSRF
    |-- fetch(`http://internal/${params}`) --> SSRF
    |
    v
{ data: response }
    |
    v
+page.svelte
    |
    |-- {@html data.content}  --> XSS
    |-- {data.field}          --> Safe (auto-escaped)
    |-- goto(data.redirect)   --> Open Redirect
```
