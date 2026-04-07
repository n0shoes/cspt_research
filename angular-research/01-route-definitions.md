# 01 - Angular Route Definitions

## Route Definition Methods

### Static Routes
```typescript
{ path: 'about', component: AboutComponent }
{ path: 'about', loadComponent: () => import('./about.component').then(m => m.AboutComponent) }
```

### Parameterized Routes
```typescript
{ path: 'users/:userId', component: UserComponent }
{ path: 'shop/:category/:productId', component: ProductComponent }
{ path: 'teams/:teamId/members/:memberId', component: MemberComponent }
```

### Nested Routes (Children)
```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    { path: '', component: DashboardIndexComponent },
    { path: 'stats', component: DashboardStatsComponent },
    { path: 'settings', component: DashboardSettingsComponent },
  ]
}
```

### Wildcard Route
```typescript
{ path: '**', component: NotFoundComponent }
```

**IMPORTANT**: Angular's `**` wildcard is NOT a catch-all with sub-path capture. It consumes ALL remaining segments but does NOT provide them as a parameter. There is no Angular equivalent to React Router's `<Route path="*">` splat that captures sub-paths as a single string.

The wildcard consumes all segments into `consumed` but stores no `posParams`:
```javascript
// From defaultUrlMatcher (line 58-100 in _router-chunk.mjs)
// When wildcardIndex !== -1:
return { consumed: segments, posParams };
// posParams only contains named :params, NOT the wildcard content
```

### Lazy Loading Patterns
```typescript
// Standalone component (Angular 14+)
loadComponent: () => import('./page.component').then(m => m.PageComponent)

// Module-based (legacy)
loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)
```

### Named Outlets
```typescript
{ path: 'popup', component: PopupComponent, outlet: 'aux' }
// URL: /main(aux:popup)
```

## What Survives Minification

### Route Paths - ALWAYS Survive
Route path strings are NOT minified. They appear verbatim in production bundles:
```javascript
// From main-YQUL5TOJ.js (production build):
{path:"users/:userId",loadComponent:()=>import("./chunk-IWVCQI6S.js").then(t=>t.UserComponent)}
{path:"shop/:category/:productId",loadComponent:()=>import("./chunk-DKSUEUHH.js").then(t=>t.ProductComponent)}
{path:"teams/:teamId/members/:memberId",loadComponent:()=>import("./chunk-HJPLIAK6.js").then(t=>t.MemberComponent)}
{path:"dashboard",...children:[{path:"",...},{path:"stats",...},{path:"settings",...}]}
{path:"encoding-test/:testParam",...}
{path:"**",...}
```

### Component Names - ALWAYS Survive (in lazy chunks)
When using `loadComponent` or `loadChildren`, the component class name appears in `.then(t => t.ComponentName)`:
```javascript
.then(t=>t.UserComponent)
.then(t=>t.ProductComponent)
.then(t=>t.DashboardStatsComponent)
```

### API URL Patterns - ALWAYS Survive
String literals in fetch/HttpClient calls are never minified:
```javascript
// chunk-IWVCQI6S.js (UserComponent):
this.http.get(`/api/users/${this.userId}`)

// chunk-DKSUEUHH.js (ProductComponent):
this.http.get("/api/shop/"+this.category+"/products/"+this.productId)

// chunk-HJPLIAK6.js (MemberComponent):
this.http.get(`/api/teams/${this.teamId}/members/${this.memberId}`)
```

### What IS Minified
- Variable names: `userId` -> `this.userId` (property access preserved, but local vars mangled)
- Method names on custom services: class method names survive (they're property access)
- Angular internal APIs: `ɵfac`, `ɵcmp`, `ɵprov` survive (they're Angular metadata)

## Detection Regexes (Source Code)

```regex
# Route definitions with params
path:\s*["']([^"']*:[^"']+)["']

# Lazy-loaded components
loadComponent:\s*\(\)\s*=>\s*import\(["']([^"']+)["']\)

# Lazy-loaded modules
loadChildren:\s*\(\)\s*=>\s*import\(["']([^"']+)["']\)

# Wildcard routes
path:\s*["']\*\*["']

# Named outlet routes
outlet:\s*["']([^"']+)["']
```

## Detection Regexes (Minified Bundles)

```regex
# Route paths with params (minified format - no spaces)
path:"([^"]*:[^"]+)"

# Lazy chunk imports
import\("\.\/chunk-[A-Z0-9]+\.js"\)\.then\(\w+=>\w+\.(\w+)\)

# API URL patterns in template literals
\.get\(`[^`]*\$\{[^}]+\}[^`]*`\)

# API URL patterns in concatenation
\.get\("[^"]*"\s*\+\s*\w+\.\w+\s*\+\s*"[^"]*"

# Angular selector fingerprint
selectors:\[\["([^"]+)"\]\]
```

## Angular-Specific Route Features

### Matrix Parameters
Angular supports matrix parameters (`;key=value`) on URL segments:
```
/users/123;sort=name;order=asc
```
These are parsed by `parseMatrixParams()` and available via `route.snapshot.paramMap`.

### Auxiliary Routes
```
/main(sidebar:settings//footer:info)
```
Multiple named outlets with `//` separator.

### Route Guards
`canActivate`, `canDeactivate`, `canMatch` -- these don't affect CSPT but may block navigation.

### Resolvers
Data resolvers run before component activation. If a resolver makes an API call with route params, that's a CSPT sink too.
