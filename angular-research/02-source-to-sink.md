# 02 - Angular CSPT Sources and Sinks

## Sources (Where User Input Enters)

### 1. `paramMap.get()` (Recommended API)
```typescript
this.route.paramMap.subscribe(params => {
  const userId = params.get('userId');
});
```
- **Encoding**: Decoded via `decodeURIComponent()` at parse time (line 512)
- **Split behavior**: URL is split on literal `/` BEFORE decoding, so `%2F` is preserved within the param value
- **Minified pattern**: `this.route.paramMap.subscribe(t=>{...t.get("userId")...})`

### 2. `snapshot.paramMap.get()` (Snapshot)
```typescript
const userId = this.route.snapshot.paramMap.get('userId');
```
- Same encoding as observable `paramMap` -- it's the same underlying data
- **Minified pattern**: `this.route.snapshot.paramMap.get("userId")`

### 3. `snapshot.params[]` (Legacy Direct Access)
```typescript
const userId = this.route.snapshot.params['userId'];
```
- Same data as `paramMap`, just accessed as a plain object
- **Minified pattern**: `this.route.snapshot.params.userId` (dot notation after minification)

### 4. `queryParamMap.get()` (Query Parameters)
```typescript
this.route.queryParamMap.subscribe(qparams => {
  const widget = qparams.get('widget');
});
```
- **Encoding**: Decoded via `decodeQuery()` which replaces `+` with `%20` then calls `decodeURIComponent` (line 415-416)
- **NO split on `/`**: Query params are extracted whole, making them a BIGGER CSPT surface
- **Minified pattern**: `this.route.queryParamMap.subscribe(t=>{...t.get("widget")...})`

### 5. `router.url` (Current URL)
```typescript
const currentUrl = this.router.url;
```
- Returns the full URL path as-is from the current `UrlTree` serialization
- Includes encoding as processed by the router
- **Minified pattern**: `this.router.url`

### 6. `window.location.pathname` / `window.location.href` (Raw Browser)
```typescript
const path = window.location.pathname;
```
- NOT processed by Angular router -- raw browser URL
- Browser decodes per-spec: `%2F` stays encoded in `pathname`, other chars decoded
- **Minified pattern**: `window.location.pathname`

### 7. Route Resolvers
```typescript
@Injectable()
export class UserResolver implements Resolve<User> {
  resolve(route: ActivatedRouteSnapshot) {
    return this.http.get(`/api/users/${route.paramMap.get('userId')}`);
  }
}
```
- Resolvers access the same `paramMap` -- same encoding behavior
- Data flows into the component via `route.data`

## Sinks (Where User Input is Consumed)

### 1. `HttpClient.get()` - API Path Injection
```typescript
// Template literal
this.http.get(`/api/users/${userId}`);

// String concatenation
this.http.get('/api/shop/' + category + '/products/' + productId);
```
**Minified patterns:**
```javascript
// Template literal preserved:
this.http.get(`/api/users/${this.userId}`)

// Concatenation preserved:
this.http.get("/api/shop/"+this.category+"/products/"+this.productId)
```

### 2. `ApiService.get()` - Wrapped HttpClient
```typescript
this.apiService.get(`settings/${id}`);
// Where ApiService does: this.http.get(`${this.baseUrl}/${path}`)
```
**Minified patterns:**
```javascript
// Service wrapper:
this.http.get(`${this.baseUrl}/${t}`)
// Usage:
this.apiService.get(`settings/${e}`)
```

### 3. `[innerHTML]` + `bypassSecurityTrustHtml()` - XSS Sink
```typescript
this.widgetHtml = this.sanitizer.bypassSecurityTrustHtml(html);
// Template: <div [innerHTML]="widgetHtml"></div>
```
**Minified patterns:**
```javascript
// bypassSecurityTrustHtml call:
this.sanitizer.bypassSecurityTrustHtml(e)

// innerHTML binding in template factory:
c("innerHTML",e.widgetHtml,n)
// The 'n' here is Angular's sanitization context (sa import = sanitize)
```

**IMPORTANT**: Angular's `[innerHTML]` WITHOUT `bypassSecurityTrustHtml` is SAFE -- Angular's built-in sanitizer strips `<script>`, event handlers, etc. The sink only becomes dangerous when `bypassSecurityTrustHtml` is used.

### 4. `router.navigate()` - Open Redirect / Navigation Hijack
```typescript
this.router.navigate([redirect]);
```
**Minified pattern:**
```javascript
this.router.navigate([e])
```
Note: `router.navigate()` double-encodes `%` characters -- see encoding behavior doc.

### 5. `routerLink` Directive - Template Navigation
```html
<a [routerLink]="['/users', userId]">Profile</a>
```
**Minified pattern**: Appears in template factory as `consts` array.

### 6. `window.location.href` Assignment - Direct Redirect
```typescript
window.location.href = userInput;
```
Not Angular-specific but appears in Angular apps.

## Complete CSPT Chains

### Chain 1: paramMap -> HttpClient -> API Redirect
```
Source: paramMap.get('userId')
Flow:   /users/..%2F..%2Fadmin/secrets
Sink:   this.http.get(`/api/users/${userId}`)
Result: GET /api/users/../../admin/secrets -> GET /admin/secrets
```
Note: `%2F` is decoded to `/` by `paramMap.get()`, so the interpolated URL contains literal `../`.

### Chain 2: queryParamMap -> HttpClient -> API Redirect
```
Source: queryParamMap.get('widget')
Flow:   /dashboard/stats?widget=..%2F..%2Fadmin%2Fsecrets
Sink:   this.http.get(`/api/widgets/${widget}`)
Result: GET /api/widgets/../../admin/secrets -> GET /admin/secrets
```
Query params have a BIGGER attack surface because they're never split on `/`.

### Chain 3: CSPT -> innerHTML -> XSS
```
Source: queryParamMap.get('widget')
Flow:   /dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious-uuid
Sink:   this.http.get(`/api/widgets/${widget}`) -> bypassSecurityTrustHtml -> [innerHTML]
Result: Attacker-controlled HTML rendered in DOM
```

### Chain 4: queryParamMap -> router.navigate -> Open Redirect
```
Source: queryParamMap.get('redirect')
Flow:   /dashboard?redirect=/evil.com
Sink:   this.router.navigate([redirect])
Result: Navigation to attacker-controlled path
```

## Source/Sink Detection Summary

| Source | Encoding | Split on `/`? | Risk Level |
|--------|----------|---------------|------------|
| `paramMap.get()` | Decoded | Yes (at parse) | Medium |
| `snapshot.params[]` | Decoded | Yes (at parse) | Medium |
| `queryParamMap.get()` | Decoded | No | High |
| `router.url` | Partially encoded | N/A | Medium |
| `window.location.*` | Browser-encoded | N/A | High |

| Sink | Impact | Requires |
|------|--------|----------|
| `HttpClient.get/post/put/delete` | API path traversal | Param in URL path |
| `bypassSecurityTrustHtml` + `[innerHTML]` | XSS | Controlled response body |
| `router.navigate()` | Open redirect | Controlled nav target |
| `window.location.href =` | Open redirect | Direct assignment |
