# 2. Source-to-Sink Analysis (Remix / React Router v7 Framework Mode)

## All CSPT Sources

### Client-Side Sources (Shared with React Router)

| Source | Returns | CSPT Risk | Reference |
|--------|---------|-----------|-----------|
| `useParams()` | **DECODED** | **HIGH** | Same as React Router -- see `react-research/02-source-to-sink.md` |
| `useSearchParams().get()` | **DECODED** | **HIGH** | Same URLSearchParams auto-decode |
| `useLocation().pathname` | **ENCODED** (raw) | LOW | Preserves percent-encoding |
| `params["*"]` (splat) | **DECODED** + multi-segment | **CRITICAL** | Captures across `/` boundaries |

### Server-Side Sources (REMIX-SPECIFIC)

| Source | Returns | CSPT Risk | Why |
|--------|---------|-----------|-----|
| `loader({ params })` | **DECODED** | **CRITICAL** | Same decode pipeline. Params flow to server-side fetch = SSRF |
| `action({ params })` | **DECODED** | **CRITICAL** | Same decode + mutation capability = CSPT2CSRF |
| `loader params["*"]` | **DECODED** + multi-segment | **CRITICAL** | Splat in server loader = unrestricted SSRF path |
| `request.url` in loader | Raw request URL | MEDIUM | Contains encoded path, but `new URL()` parsing may decode |
| `request.formData()` in action | User-submitted data | HIGH | Not path-traversal itself, but combined with param SSRF |
| `useLoaderData()` | Loader return value | MEDIUM | Tainted if loader used decoded params in fetch |
| `useFetcher().data` | Loader/action return | MEDIUM | Same taint chain as useLoaderData |
| `useActionData()` | Action return value | MEDIUM | Tainted if action used decoded params |

## All CSPT Sinks

### Server-Side Sinks (REMIX-SPECIFIC -- highest impact)

| Sink Pattern | Example | Risk | Impact |
|-------------|---------|------|--------|
| Loader `fetch()` with params | `fetch(\`http://internal/api/${params.userId}\`)` | **CRITICAL** | SSRF to internal services |
| Loader `fetch()` with splat | `fetch(\`http://internal/files/${params["*"]}\`)` | **CRITICAL** | Unrestricted SSRF path traversal |
| Action `fetch()` with params | `fetch(\`http://internal/users/${params.userId}/settings\`, {method:"PUT"})` | **CRITICAL** | SSRF + mutation (CSPT2CSRF) |
| Loader with auth headers | `fetch(url, {headers: {"X-Internal-Auth": key}})` | **CRITICAL** | SSRF with leaked credentials |
| Loader `request.url` parsing | `new URL(request.url).searchParams.get("section")` | HIGH | Server-side fetch with query param |

### Client-Side Sinks (Shared with React Router)

| Sink Pattern | Example | Risk |
|-------------|---------|------|
| `fetch()` template literal | `fetch(\`/api/users/${userId}\`)` | HIGH |
| `fetch()` concatenation | `fetch("/api/shop/" + category)` | HIGH |
| `dangerouslySetInnerHTML` | `{__html: fetchedContent}` | HIGH (XSS) |
| `navigate()` | `navigate(redirect)` | MEDIUM (open redir) |
| API service layer | `apiService.get(\`/settings/${section}\`)` | HIGH |

## Remix-Specific Source-to-Sink Chains

### Chain 1: Loader Param --> Server-Side SSRF (CRITICAL)

```
URL: /users/%2E%2E%2Fapi%2Fadmin
  |
  v
React Router decodes: params.userId = "../api/admin"
  |
  v
Server loader: fetch(`http://internal-api.local/users/${params.userId}`)
             = fetch("http://internal-api.local/users/../api/admin")
  |
  v
Node.js fetch resolves: GET http://internal-api.local/api/admin
  |
  v
Response returned to client via turbo-stream
```

**Impact:** Full SSRF with server-side network access, internal auth headers, cloud metadata access.

### Chain 2: Splat Loader --> Unrestricted Internal SSRF (CRITICAL)

```
URL: /files/%2E%2E%2F%2E%2E%2Fmetadata%2Fv1
  |
  v
params["*"] = "../../metadata/v1"
  |
  v
Server loader: fetch(`http://internal-service.local/files/../../metadata/v1`)
  |
  v
Resolved: GET http://internal-service.local/metadata/v1
```

**Impact:** Cloud metadata access (169.254.169.254), internal service enumeration, credential theft.

### Chain 3: Action Param --> CSPT2CSRF (CRITICAL)

```
POST /users/%2E%2E%2Fadmin/settings
Body: role=superadmin
  |
  v
params.userId = "../admin"
  |
  v
Server action: fetch(`http://internal-api.local/users/${params.userId}/settings`, {
  method: "PUT",
  body: JSON.stringify({role: "superadmin"})
})
  |
  v
Resolved: PUT http://internal-api.local/users/../admin/settings
        = PUT http://internal-api.local/admin/settings
```

**Impact:** Privilege escalation via server-side mutation with attacker-controlled body.

### Chain 4: `.data` Endpoint --> Cache Poisoning

```
GET /users/legitimate-id.data
  |
  v
Returns turbo-stream encoded loader data
  |
  v
If CDN caches based on URL path: /users/%2E%2E%2Fmalicious.data
May serve poisoned response to other users
```

**Impact:** Cache poisoning, response confusion.

### Chain 5: SearchParams --> Fetch --> dangerouslySetInnerHTML (XSS)

```
URL: /dashboard/stats?widget=../../uploads/malicious
  |
  v
searchParams.get("widget") = "../../uploads/malicious"
  |
  v
fetch(`/api/widgets/../../uploads/malicious`)
  |
  v
Browser resolves: GET /uploads/malicious
  |
  v
Response HTML injected via dangerouslySetInnerHTML
```

**Impact:** Stored XSS if combined with file upload.

### Chain 6: Loader Data --> Client Render --> XSS

```
Server loader fetches from SSRF-redirected endpoint
  |
  v
Returns attacker-controlled JSON
  |
  v
useLoaderData() returns malicious data
  |
  v
Component renders data into DOM (innerHTML, href, src)
```

**Impact:** Server-side data trust confusion leading to XSS.

## Build Output: Source-to-Sink Patterns

### Server Build (NOT minified)

```javascript
// Loader with SSRF - fully readable
async function loader$7({ params }) {
  const res = await fetch(`http://localhost:3000/api/users/${params.userId}`);
  // ...
}

// Action with CSPT2CSRF - fully readable
async function action({ params, request }) {
  const formData = await request.formData();
  await fetch(`http://internal-api.local/users/${params.userId}/settings`, {
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(formData)),
  });
}

// Splat loader - critical SSRF
async function loader$5({ params }) {
  const filePath = params["*"];
  const res = await fetch(`http://internal-service.local/files/${filePath}`);
}

// Loader with internal auth header
async function loader$2({ params }) {
  const res = await fetch(`http://internal-api.local/data/${params.dataId}`, {
    headers: { "X-Internal-Auth": process.env.INTERNAL_KEY || "secret-key-123" }
  });
}
```

### Client Chunks (Minified)

```javascript
// useParams → fetch (template literal)
{userId:s}=h(),[n,r]=t.useState(null);t.useEffect(()=>{fetch(`/api/users/${s}`)...},[s])

// useParams → fetch (concatenation)
{category:e,productId:r}=l();...fetch("/api/shop/"+e+"/products/"+r)

// API service layer
const h={get:s=>fetch(`/api${s}`).then(e=>e.json())}

// searchParams → fetch → dangerouslySetInnerHTML
n.get("widget");n&&fetch(`/api/widgets/${n}`).then(d=>d.text()).then(a)
...dangerouslySetInnerHTML:{__html:s}
```
