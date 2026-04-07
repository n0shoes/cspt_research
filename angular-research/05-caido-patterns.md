# 05 - Caido Detection Patterns for Angular

## Angular Fingerprinting

### HTML Fingerprints
```
# app-root custom element (Angular default)
resp.raw.cont:"<app-root"

# Angular version attribute (dev mode only)
resp.raw.cont:"ng-version="

# Angular-specific attributes
resp.raw.cont:"_ngcontent-"
resp.raw.cont:"_nghost-"
resp.raw.cont:"ng-reflect-"

# data-beasties-container (Angular 17+ SSR)
resp.raw.cont:"data-beasties-container"

# base href tag (common in Angular SPAs)
resp.raw.cont:"<base href"
```

### JavaScript Fingerprints
```
# Angular compiler output markers
resp.raw.cont:"ɵfac"
resp.raw.cont:"ɵcmp"
resp.raw.cont:"ɵprov"

# Angular selectors pattern
resp.raw.cont:"selectors:[["

# Angular template factory pattern
resp.raw.cont:"template:function"

# Angular dependency injection
resp.raw.cont:"providedIn:\"root\""

# Module preload pattern (Angular lazy loading)
resp.raw.cont:"modulepreload"

# zone.js (Angular <= 17, or without zoneless)
resp.raw.cont:"zone.js"
resp.raw.cont:"Zone.__load_patch"
```

### URL Pattern Fingerprints
```
# Angular CLI chunk naming
req.path.cont:"chunk-" AND resp.raw.cont:"ɵcmp"

# Angular main bundle
req.path.cont:"main-" AND resp.raw.cont:"bootstrapApplication" OR resp.raw.cont:"platformBrowser"
```

## Route Extraction

### From Main Bundle
```
# Route definitions with path params
resp.raw.cont:"path:\"" AND resp.raw.cont:":userId" OR resp.raw.cont:":id"

# Route paths with parameters (general)
resp.raw.regex:"path:\"[^\"]*:[^\"]+\""

# Lazy-loaded chunk imports
resp.raw.regex:"import\\(\"\\./chunk-[A-Z0-9]+\\.js\"\\)"

# loadComponent pattern
resp.raw.cont:"loadComponent" AND resp.raw.cont:"import("

# loadChildren pattern (module-based)
resp.raw.cont:"loadChildren" AND resp.raw.cont:"import("

# Wildcard route
resp.raw.cont:"path:\"**\""

# Named outlet routes
resp.raw.regex:"outlet:\"[^\"]+\""
```

### From Lazy Chunks
```
# Component class names in lazy chunks
resp.raw.regex:"export\\{\\w+ as \\w+Component\\}"

# Param extraction in lazy chunks
resp.raw.cont:".paramMap.subscribe" OR resp.raw.cont:".paramMap.get("
resp.raw.cont:".queryParamMap.subscribe" OR resp.raw.cont:".queryParamMap.get("
resp.raw.cont:".snapshot.paramMap"
resp.raw.cont:".snapshot.params."
```

## CSPT Sink Detection

### HttpClient API Calls
```
# Template literal with variable interpolation in HTTP calls
resp.raw.cont:".http.get(`" AND resp.raw.cont:"${this."
resp.raw.cont:".http.post(`" AND resp.raw.cont:"${this."
resp.raw.cont:".http.put(`" AND resp.raw.cont:"${this."
resp.raw.cont:".http.delete(`" AND resp.raw.cont:"${this."

# String concatenation in HTTP calls
resp.raw.regex:"\\.http\\.get\\(\"[^\"]*\"\\s*\\+\\s*this\\."

# API service wrapper patterns
resp.raw.cont:"this.baseUrl" AND resp.raw.cont:".http.get("
resp.raw.regex:"\\.get\\(`\\$\\{this\\.baseUrl\\}"
```

### innerHTML / XSS Sinks
```
# bypassSecurityTrustHtml (the dangerous one)
resp.raw.cont:"bypassSecurityTrustHtml"

# bypassSecurityTrustUrl
resp.raw.cont:"bypassSecurityTrustUrl"

# bypassSecurityTrustResourceUrl
resp.raw.cont:"bypassSecurityTrustResourceUrl"

# bypassSecurityTrustScript
resp.raw.cont:"bypassSecurityTrustScript"

# innerHTML binding in Angular template factory (minified)
resp.raw.regex:"c\\(\"innerHTML\",[^,]+,\\w+\\)"

# Direct innerHTML assignment
resp.raw.cont:".innerHTML=" OR resp.raw.cont:".innerHTML ="
```

### Navigation Sinks
```
# router.navigate with dynamic input
resp.raw.cont:".router.navigate([" AND resp.raw.cont:".get("

# router.navigateByUrl with dynamic input
resp.raw.cont:".navigateByUrl("

# window.location assignment
resp.raw.cont:"window.location.href=" OR resp.raw.cont:"window.location ="
resp.raw.cont:"window.open("
```

## CSPT Source Detection

### Path Parameter Sources
```
# paramMap observable subscription with param extraction
resp.raw.regex:"paramMap\\.subscribe\\(\\w+=>[^}]*\\.get\\(\"[^\"]+\"\\)"

# Snapshot param access
resp.raw.regex:"snapshot\\.paramMap\\.get\\(\"[^\"]+\"\\)"
resp.raw.regex:"snapshot\\.params\\.[a-zA-Z]+"

# Combined source + sink (high confidence CSPT)
resp.raw.cont:"paramMap" AND resp.raw.cont:".http.get(`/api/"
```

### Query Parameter Sources
```
# queryParamMap access
resp.raw.regex:"queryParamMap\\.subscribe\\(\\w+=>[^}]*\\.get\\(\"[^\"]+\"\\)"
resp.raw.cont:"queryParamMap.get("

# Combined query param + sink (highest risk)
resp.raw.cont:"queryParamMap" AND resp.raw.cont:".http.get("
resp.raw.cont:"queryParamMap" AND resp.raw.cont:"bypassSecurityTrustHtml"
```

### Browser API Sources
```
resp.raw.cont:"window.location.pathname"
resp.raw.cont:"window.location.hash"
resp.raw.cont:"window.location.search"
resp.raw.cont:"document.URL"
```

## Combined High-Confidence CSPT Queries

```
# Path param -> HttpClient (most common CSPT pattern)
resp.raw.cont:"paramMap" AND resp.raw.cont:".http.get(`" AND resp.raw.cont:"${this."

# Query param -> HttpClient + innerHTML (CSPT -> XSS chain)
resp.raw.cont:"queryParamMap" AND resp.raw.cont:"bypassSecurityTrustHtml"

# Query param -> router.navigate (open redirect)
resp.raw.cont:"queryParamMap" AND resp.raw.cont:".navigate(["

# API service with param interpolation
resp.raw.cont:"this.baseUrl" AND resp.raw.cont:"paramMap"
```

## Angular Version-Specific Notes

### Angular 14+ (Standalone Components)
- `standalone: true` in component metadata
- `loadComponent` in route definitions
- No NgModule wrapper needed

### Angular 17+ (New Control Flow)
- `@if`, `@for`, `@switch` in templates
- May use `data-beasties-container` attribute
- Signal-based inputs: `input()`, `model()`

### Angular 19+ (Zoneless)
- May not include zone.js
- Uses `provideExperimentalZonelessChangeDetection()`
- Fingerprint via `ɵprov` and `ɵcmp` still works

### Angular 21+ (Current)
- File naming convention: `.ts` instead of `.component.ts` (optional)
- `provideBrowserGlobalErrorListeners()` in app config
- Signal-based reactive patterns
