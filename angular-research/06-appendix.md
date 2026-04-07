# 06 - Appendix: Source References, Lab Structure, Build Analysis

## Source Code References

All line numbers reference: `node_modules/@angular/router/fesm2022/_router-chunk.mjs` (Angular 21.2.1)

### URL Parsing Pipeline

| Function | Lines | Purpose |
|----------|-------|---------|
| `SEGMENT_RE` | 430 | `/^[^\/()?;#]+/` - regex that defines segment boundaries |
| `matchSegments()` | 431-434 | Applies `SEGMENT_RE` to extract next segment |
| `QUERY_PARAM_RE` | 440 | `/^[^=?&#]+/` - regex for query param keys |
| `QUERY_PARAM_VALUE_RE` | 445 | `/^[^&#]+/` - regex for query param values |
| `MATRIX_PARAM_SEGMENT_RE` | 435 | `/^[^\/()?;=#]+/` - regex for matrix param keys |

### URL Parser Class

| Method | Lines | Purpose |
|--------|-------|---------|
| `UrlParser.constructor()` | 453-455 | Stores raw URL string |
| `parseRootSegment()` | 457-463 | Entry point for URL parsing |
| `parseChildren()` | 476-505 | Splits URL on literal `/` and parses segments |
| `parseSegment()` | 506-513 | Matches and decodes one segment |
| `parseMatrixParams()` | 514-519 | Parses `;key=value` matrix params |
| `parseQueryParam()` | 537-562 | Parses one query key=value pair |
| `parseQueryParams()` | 464-471 | Iterates all `&`-separated query params |
| `parseFragment()` | 473-474 | Decodes fragment after `#` |
| `parseParens()` | 564-585 | Parses named outlet syntax `(outlet:path)` |
| `peekStartsWith()` | 587-588 | Checks if remaining starts with string |
| `consumeOptional()` | 590-595 | Consumes string if present |
| `capture()` | 597-600 | Consumes string or throws |

### Encoding/Decoding Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `decode()` | 412-413 | `decodeURIComponent(s)` - for path segments |
| `decodeQuery()` | 415-416 | `decode(s.replace(/\+/g, '%20'))` - for query params |
| `encodeUriString()` | 400-401 | Base encoding, un-encodes `@`, `:`, `$`, `,` |
| `encodeUriQuery()` | 403-404 | Query encoding, additionally un-encodes `;` |
| `encodeUriFragment()` | 406-407 | `encodeURI(s)` for fragments |
| `encodeUriSegment()` | 409-410 | Path segment encoding, encodes `(`, `)`, un-encodes `&` |

### URL Tree / Segment Classes

| Class/Function | Lines | Purpose |
|----------------|-------|---------|
| `UrlTree` | 248-269 | Root of parsed URL tree |
| `UrlSegmentGroup` | 271-289 | Group of segments with children |
| `UrlSegment` | 290-305 | Single segment with path and parameters |
| `DefaultUrlSerializer` | 358-368 | Default parse/serialize implementation |
| `UrlSerializer` | 327-357 | Injectable base class |

### Route Matching

| Function | Lines | Purpose |
|----------|-------|---------|
| `defaultUrlMatcher()` | 58-100 | Matches URL segments against route config |
| `matchParts()` | 45-56 | Compares route parts with URL segments |
| `convertToParamMap()` | 42-43 | Wraps params object in ParamsAsMap |

### Navigation (router.navigate)

| Function/Method | Lines | Purpose |
|-----------------|-------|---------|
| `Router.navigate()` | 4559-4563 | Entry point for programmatic navigation |
| `Router.navigateByUrl()` | 4552-4557 | Navigate with URL string or UrlTree |
| `Router.createUrlTree()` | 4510-4550 | Creates UrlTree from commands |
| `Router.parseUrl()` | 4568-4574 | Parses URL string to UrlTree |
| `computeNavigation()` | 731-769 | Processes navigation commands |
| `createNewSegmentGroup()` | 897-922 | Creates segments from commands |
| `findStartingPositionForTargetGroup()` | 781-793 | Resolves relative navigation |
| `createPositionApplyingDoubleDots()` | 795-807 | Handles `../` in commands |

### Serialization

| Function | Lines | Purpose |
|----------|-------|---------|
| `serializePaths()` | 371-372 | Joins segments with `/` |
| `serializeSegment()` | 374-398 | Recursive segment serialization |
| `serializePath()` | 418-419 | Single path with matrix params |
| `serializeMatrixParams()` | 421-422 | `;key=value` serialization |
| `serializeQueryParams()` | 424-429 | `?key=value&key2=value2` serialization |

## Lab App Structure

```
angular-cspt-lab/
  src/
    app/
      app.ts                          # Root component
      app.html                        # Root template with nav links
      app.config.ts                   # App config (router + HttpClient)
      app.routes.ts                   # Route definitions
      services/
        api.service.ts                # Wrapper around HttpClient
      pages/
        about/
          about.component.ts          # Static page (no params)
        user/
          user.component.ts           # paramMap -> HttpClient (template literal)
        product/
          product.component.ts        # paramMap x2 -> HttpClient (concatenation)
        member/
          member.component.ts         # paramMap x2 -> HttpClient (template literal)
        dashboard/
          dashboard.component.ts      # Parent with child routes + router-outlet
        dashboard-index/
          dashboard-index.component.ts # queryParamMap -> router.navigate (open redirect)
        dashboard-stats/
          dashboard-stats.component.ts # queryParamMap -> HttpClient -> bypassSecurityTrustHtml -> innerHTML (XSS)
        dashboard-settings/
          dashboard-settings.component.ts # queryParamMap -> ApiService.get (wrapper sink)
        encoding-test/
          encoding-test.component.ts  # Displays all param access methods side-by-side
        not-found/
          not-found.component.ts      # 404 wildcard
  dist/
    angular-cspt-lab/
      browser/
        index.html                    # Production HTML
        main-YQUL5TOJ.js            # Main bundle with routes
        chunk-VEONB6FU.js           # Angular core (117KB)
        chunk-IEARWRNA.js           # Angular router + HttpClient (109KB)
        chunk-IWVCQI6S.js           # UserComponent (825B)
        chunk-DKSUEUHH.js           # ProductComponent (958B)
        chunk-HJPLIAK6.js           # MemberComponent (929B)
        chunk-P4UGMWLD.js           # DashboardComponent (620B)
        chunk-SSQXUNLK.js           # DashboardIndexComponent (593B)
        chunk-2LTZ7OWV.js           # DashboardStatsComponent (881B)
        chunk-T4JPIZCR.js           # DashboardSettingsComponent (1.2KB)
        chunk-TTODYUGG.js           # EncodingTestComponent (2.1KB)
        chunk-GSCRUAP6.js           # NotFoundComponent (372B)
        chunk-RE6QMYPC.js           # AboutComponent (358B)
```

## Production Build Analysis

### Bundle Sizes
| Bundle | Size | Content |
|--------|------|---------|
| `chunk-VEONB6FU.js` | 117.7KB | Angular core framework |
| `chunk-IEARWRNA.js` | 109.6KB | Angular router + HttpClient + common |
| `main-YQUL5TOJ.js` | 1.98KB | Route config + bootstrap |
| Lazy chunks | 358B - 2.1KB | Individual components |

### What Survives Minification (Empirical)

**Route path strings** - Verbatim in main bundle:
```javascript
path:"users/:userId"
path:"shop/:category/:productId"
path:"teams/:teamId/members/:memberId"
path:"encoding-test/:testParam"
path:"**"
```

**Component export names** - In lazy chunk exports:
```javascript
export{C as UserComponent}
export{v as ProductComponent}
export{v as MemberComponent}
export{g as DashboardStatsComponent}
```

**API URL strings** - Verbatim in lazy chunks:
```javascript
`/api/users/${this.userId}`
"/api/shop/"+this.category+"/products/"+this.productId
`/api/teams/${this.teamId}/members/${this.memberId}`
`/api/widgets/${t}`
`settings/${e}`
```

**Angular metadata** - Component metadata in specialized format:
```javascript
static ɵfac = function(e){return new(e||p)(s(h),s(v))}
static ɵcmp = m({type:p, selectors:[["app-user"]], ...})
static ɵprov = m({token:i, factory:i.ɵfac, providedIn:"root"})
```

**innerHTML binding** - In template factory:
```javascript
c("innerHTML",e.widgetHtml,n)  // 'n' = sanitization context
```

**bypassSecurityTrustHtml** - Preserved in minified code:
```javascript
this.sanitizer.bypassSecurityTrustHtml(e)
```

**console.log markers** - Preserved:
```javascript
console.log("[ENCODING_TEST]",JSON.stringify(this.results,null,2))
```

### Angular-Specific Minification Patterns

1. **Component decorator -> static properties**: `@Component({})` becomes `static ɵcmp = m({...})`
2. **DI via constructor -> factory function**: `constructor(private http: HttpClient)` becomes `static ɵfac = function(e){return new(e||p)(s(v))}`
3. **Template -> factory function**: HTML template becomes `template:function(e,a){...}` with imperative DOM calls
4. **Imports renamed to single letters**: `ActivatedRoute` -> `h`, `HttpClient` -> `v`, etc.
5. **RouterLink in template**: Becomes `consts` array: `["routerLink","/users/123"]`

### HTML Fingerprints in Production

```html
<!-- From index.html -->
<html lang="en" data-beasties-container>
<app-root></app-root>
<link rel="modulepreload" href="chunk-IEARWRNA.js">
<script src="main-YQUL5TOJ.js" type="module"></script>
```

Key identifiers:
- `<app-root>` custom element
- `data-beasties-container` attribute (Angular 17+ build optimizer)
- `modulepreload` link tags for chunk preloading
- `type="module"` on main script
- Hash-suffixed chunk filenames (`chunk-XXXXXXXX.js`, `main-XXXXXXXX.js`)
- No `zone.js` script tag (Angular 19+ zoneless mode)
