# 2. Dynamic Parameters to Fetch (Source-to-Sink)

## How React Router Extracts Dynamic Params and Feeds Them to Fetch

The full programmatic flow from URL to API request:

### Step 1: Route Definition → Regex Compilation via `compilePath()`

```jsx
<Route path="/data/:dataId" element={<DataPage />} />
```

React Router compiles `/data/:dataId` into an internal regex via `compilePath()` (react-router `chunk-XOLAXE2Z.js` line 777, mapped from `chunk-LFPYN7LY.mjs` in DevTools source maps).

**What `compilePath()` does internally:**

```js
function compilePath(path, caseSensitive = false, end = true) {
  let params = [];
  let regexpSource = "^" + path
    .replace(/\/*\*?$/, "")                    // 1. strip trailing /* or /
    .replace(/^\/*/, "/")                       // 2. ensure leading /
    .replace(/[\\.*+^${}|()[\]]/g, "\\$&")     // 3. escape regex special chars
    .replace(
      /\/:([\w-]+)(\?)?/g,                     // 4. convert :params to capture groups
      (match, paramName, isOptional) => {
        params.push({ paramName, isOptional: isOptional != null });
        if (isOptional) return "(?:/([^\\/]*))?";
        return "/([^\\/]+)";                    // ← captures anything except /
      }
    );
  // ... handle splat, end anchoring
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
```

The `.replace()` callback parameters come from JavaScript's replace-with-function API:
- `match` — the full matched string (e.g., `"/:dataId"`)
- `paramName` — first capture group `([\w-]+)`, the name after `:` (e.g., `"dataId"`)
- `isOptional` — second capture group `(\?)?`, the `?` char if present, otherwise `undefined`

The first `.replace(/\/*\*?$/, "")` only replaces the first match, but the `$` end-of-string anchor means it can only ever match once — there's only one end of string. The `:param` replacement uses the `g` flag so it fires for every `:param` in the path.

For `/data/:dataId`, the build-up is:

| Step | Value |
|------|-------|
| Strip trailing `/*` | `/data/:dataId` (no change) |
| Ensure leading `/` | `/data/:dataId` |
| Escape specials | `/data/:dataId` |
| `:param` → capture group | `/data/([^\\/]+)` |
| End anchor | `/data/([^\\/]+)\\/*$` |
| **Final regex** | `^/data/([^\\/]+)\\/*$` |
| **Params array** | `[{ paramName: "dataId", isOptional: false }]` |

The capture group `([^\\/]+)` matches anything except `/` — it does zero sanitization of the captured value.

**Splat routes produce a different capture group:**

For `/files/*`, the regex becomes `^/files(.*)$` — `(.*)` captures everything including slashes, which is why splat params capture across `/` boundaries and enable multi-segment traversal without encoding tricks.

### Step 2: URL Change → Route Matching

When the browser URL changes (via `<Link>`, `navigate()`, or direct URL entry), React Router's `<Router>` context re-evaluates. It tests `location.pathname` against each compiled regex:

```js
// User navigates to /data/42
const match = "/data/42".match(/^\/data\/([^/]+)\/?$/);
// match = ["/data/42", "42"]
//                        ↑ capture group value
```

### Step 3: Params Object Construction

React Router zips parameter names from the route definition with captured values:

```js
// paramName "dataId" came from parsing ":dataId" in the path string
// value "42" came from the regex capture group
const params = { dataId: "42" };
```

This object gets stored in the route match context.

### Step 4: Component Access via `useParams()`

```jsx
function DataPage() {
  const { dataId } = useParams();
  // dataId === "42" (always a string)
```

`useParams()` reads from React Router's internal context — specifically the nearest route match. It returns the `params` object from step 3. No DOM reading, no `window.location` parsing at the component level.

### Step 5: Fetch Request Construction

```jsx
  useEffect(() => {
    fetch(`/api/data/${dataId}`)  // → GET /api/data/42
      .then(res => res.json())
      .then(setData);
  }, [dataId]);
```

The `dataId` string gets interpolated into the fetch URL via template literal — standard JavaScript string interpolation.

### Why This Is the CSPT Primitive

The entire chain is:

```
Browser URL bar → location.pathname → regex match → params object → string interpolation → fetch URL
```

The value is **user-controlled input from the URL**. At no point does React Router sanitize, validate, or encode this value. Whatever sits in that URL segment arrives as-is in `useParams()`:

```
/data/..%2f..%2fadmin  →  dataId = "..%2f..%2fadmin"  (decoded to ../../admin)
/data/42%09../admin    →  dataId = "42\t../admin"      (browser may decode)
```

So when it hits the fetch:

```js
fetch(`/api/data/${dataId}`)
// Could become: fetch("/api/data/../../admin")
```

**What React Router does NOT do:**
- No URL encoding of extracted params
- No path traversal protection
- No type coercion (always a string, never validated as a number)
- No allowlist check

It's a pure passthrough from URL segment to JavaScript string.

---

## All CSPT Sources

| Source | What it returns | CSPT Risk | Why |
|--------|----------------|-----------|-----|
| `useParams()` | **DECODED** values | **HIGH** | `%2F` → `/`, `%2E` → `.` via decodeURIComponent + line 811 |
| `useSearchParams().get()` | **DECODED** values | **HIGH** | URLSearchParams auto-decodes per URL spec |
| `useLocation().pathname` | **ENCODED** (raw) | LOW | Preserves `%2F`, `%2E` as-is |
| `window.location.pathname` | **ENCODED** (raw) | LOW | Browser preserves encoding |
| Route `loader({ params })` | **DECODED** values | **HIGH** | Same pipeline as useParams |
| `useLoaderData()` | Depends on loader | MEDIUM | If loader used params in fetch, tainted data flows through |
| `params["*"]` (splat) | **DECODED** + multi-segment | **CRITICAL** | Captures across `/` boundaries, full decode |

## All CSPT Sinks

| Sink Pattern | Example in Source | Minified Form | Risk |
|-------------|-------------------|---------------|------|
| `fetch()` template literal | `` fetch(`/api/users/${userId}`) `` | `` fetch(`/api/users/${n}`) `` | HIGH |
| `fetch()` concatenation | `fetch("/api/shop/" + category)` | `fetch("/api/shop/"+n+"/products/"+i)` | HIGH |
| `axios.get()` template | `` axios.get(`/api/teams/${teamId}`) `` | `` ft.get(`/api/teams/${n}/members/${i}`) `` | HIGH |
| `dangerouslySetInnerHTML` | `{__html: fetchedContent}` | `dangerouslySetInnerHTML:{__html:r}` | HIGH (XSS) |
| `navigate()` | `navigate(redirect)` | `Ic(n)` | MEDIUM (open redir) |
| API service layer | `apiService.get(`/settings/${id}`)` | `OR.get(`/settings/${n}`)` | HIGH |
| TanStack `queryFn` | `` queryFn: () => fetch(`/api/items/${id}`) `` | `` queryFn:()=>fetch(`/api/items/${t}`) `` | HIGH |
| Route `loader` | `` fetch(`/api/data/${params.dataId}`) `` | `` fetch(`/api/data/${n.dataId}`) `` | HIGH |

## Source-to-Sink Chains (How They Appear in Minified Bundles)

### Chain 1: useParams → fetch (template literal) — Most common
```javascript
// Source → Sink in one scope
{userId:n}=ul(),[i,r]=z.useState(null);z.useEffect(()=>{fetch(`/api/users/${n}`)...},[n])
```
Detection: `\w+\(\).*fetch\(`[^`]*\$\{`

### Chain 2: useParams → fetch (concatenation)
```javascript
{category:n,productId:i}=ul();...fetch("/api/shop/"+n+"/products/"+i)
```
Detection: `fetch\("[^"]+"\+\w+`

### Chain 3: useSearchParams → fetch → dangerouslySetInnerHTML (XSS chain)
```javascript
[n]=cu(),i=n.get("widget");...fetch(`/api/widgets/${i}`).then(c=>c.text()).then(o)
...dangerouslySetInnerHTML:{__html:r}
```
Detection: `dangerouslySetInnerHTML:\{__html:\w\}` within same component as `fetch(`

### Chain 4: Splat param → fetch
```javascript
i=ul()["*"];...fetch(`/api/files/${i}`)
```
Detection: `\w+\["\*"\]` near `fetch(`

### Chain 5: Route loader → fetch (server-like)
```javascript
async function DR({params:n}){return(await fetch(`/api/data/${n.dataId}`)).json()}
```
Detection: `async function \w+\(\{params:\w+\}\).*fetch\(`

### Chain 6: TanStack Query → fetch
```javascript
{itemId:t}=Z(),{data:e}=pt({queryKey:["item",t],queryFn:()=>fetch(`/api/items/${t}`)...})
```
Detection: `queryFn:\(\)=>fetch\(`

### Chain 7: API service layer abstraction
```javascript
const OR={get:n=>fetch(`/api${n}`).then(i=>i.json())}
...OR.get(`/settings/${n}`)
```
Detection: `\{get:\w+=>\w*fetch\(` (service object pattern)
