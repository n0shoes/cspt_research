# 2. Source-to-Sink Analysis for Ember CSPT

## Sources (Attacker-Controlled Input)

### S1: Model Hook `params` Object
The primary source. Route-recognizer extracts params from the URL and passes them to the route's `model(params)` hook.

```javascript
// app/routes/user.js
export default class UserRoute extends Route {
  model(params) {
    // params.user_id comes directly from URL: /users/{user_id}
    // Already decoded by route-recognizer
  }
}
```

**Data flow:**
1. Browser URL → `HistoryLocation.getURL()` → `location.pathname`
2. → `router_js` `handleURL(url)` → `URLTransitionIntent`
3. → `recognizer.recognize(url)` → regex match + capture groups
4. → `findHandler()` → `decodeURIComponent(capture)` for dynamic segments
5. → `UnresolvedRouteInfoByParam.getModel()` → `route.model(params)`

### S2: `this.paramsFor(routeName)`
Access params from ancestor routes within a nested route.

```javascript
// app/routes/member/interest.js
model() {
  const memberParams = this.paramsFor('member');
  // memberParams.name comes from URL
}
```

### S3: `this.router.currentRoute.params`
Access current route params via the router service.

```javascript
// In any component or service
@service router;
get userId() {
  return this.router.currentRoute.params.user_id;
}
```

### S4: Query Parameters
Declared via `queryParams` on the route or controller.

```javascript
export default class StatsRoute extends Route {
  queryParams = { period: { refreshModel: true } };
  model(params) {
    // params.period from ?period=value
  }
}
```

### S5: `window.location` Direct Access
Routes or components that read `window.location` directly bypass route-recognizer's decoding.

```javascript
model() {
  const path = window.location.pathname; // raw, browser-decoded
  const hash = window.location.hash;     // fully client-controlled
}
```

### S6: Hash Location Fragment
When `locationType: 'hash'`, the entire route path comes from `location.hash`:
```
/#/users/ATTACKER_CONTROLLED
```
`HashLocation.getURL()` returns `location.hash.substring(1)`.

### S7: `transition.to.params`
Access params from a transition object in `beforeModel` or `willTransition` hooks.

```javascript
beforeModel(transition) {
  const params = transition.to?.params;
  // params from the target route
}
```

## Sinks (Dangerous Operations)

### K1: `fetch()` in Model Hook (CRITICAL)
The most common CSPT sink. Route params interpolated into API URLs.

```javascript
// VULNERABLE
model(params) {
  return fetch(`/api/users/${params.user_id}`);
}
```

**Impact:** If `user_id` = `../admin/secrets`, fetch goes to `/api/admin/secrets`.

### K2: Triple Curlies `{{{ }}}` (CRITICAL XSS)
Handlebars triple-curly syntax renders unescaped HTML.

```handlebars
{{! In .hbs template }}
{{{this.model.content}}}
```

**Compiled form:** Glimmer VM `appendHTML` opcode → `insertAdjacentHTML('beforeend', html)`

**Chain:** CSPT redirects fetch to attacker JSON → response has HTML payload → triple curlies render it → XSS

### K3: `htmlSafe()` / `SafeString` (XSS)
Ember's programmatic way to mark strings as safe for HTML rendering.

```javascript
import { htmlSafe } from '@ember/template';
// In a component
get renderedContent() {
  return htmlSafe(this.model.content); // Bypasses Handlebars escaping
}
```

### K4: Custom Ember Data / WarpDrive Adapter (CSPT)
Adapters that build URLs without encoding.

```javascript
// VULNERABLE adapter
urlForFindRecord(id, modelName) {
  return `/api/${modelName}s/${id}`; // No encodeURIComponent!
}
```

**Impact:** Model ID from decoded route param flows into adapter → API URL traversal.

### K5: `transitionTo()` / `replaceWith()` (Open Redirect)
Route transitions driven by user input.

```javascript
beforeModel(transition) {
  const redirect = transition.to?.queryParams?.redirect;
  if (redirect) {
    this.router.transitionTo(redirect); // Open redirect
  }
}
```

### K6: `window.location` Assignment
Direct location manipulation from route data.

```javascript
model(params) {
  if (params.redirect_url) {
    window.location.href = params.redirect_url; // Open redirect
  }
}
```

### K7: jQuery / DOM Manipulation (Legacy)
Older Ember apps (pre-Octane) may use jQuery in components:

```javascript
// Legacy pattern
didInsertElement() {
  this.$('.content').html(this.get('model.content')); // XSS via jQuery
}
```

## Source-to-Sink Flow Patterns

### Pattern 1: Direct Model Hook CSPT
```
URL → route-recognizer → params.id → model(params) → fetch(`/api/${params.id}`)
```
Prevalence: Very High
Risk: Depends on what the fetch response is used for

### Pattern 2: CSPT + Triple Curlies → XSS
```
URL → params → fetch(attacker-controlled-path) → JSON with HTML → {{{content}}} → XSS
```
Prevalence: Medium (requires triple curlies in template)
Risk: Critical

### Pattern 3: Wildcard CSPT
```
URL /docs/../../secret → params.doc_path = "../../secret" → fetch(`/api/documents/../../secret`)
```
Prevalence: Low (wildcard routes less common)
Risk: Critical (captures across path segments)

### Pattern 4: Adapter Chain
```
URL → params.id → Ember Data store.findRecord('user', id) → adapter.urlForFindRecord(id) → fetch(url)
```
Prevalence: High in Ember Data apps
Risk: High (adapter often lacks encoding)

### Pattern 5: Query Param → Redirect
```
?redirect=/evil → transition.to.queryParams.redirect → this.router.transitionTo(value)
```
Prevalence: Medium
Risk: Medium (open redirect, chainable with OAuth)

### Pattern 6: Hash Location Full Control
```
/#/users/../admin → HashLocation.getURL() → router.handleURL() → model(params)
```
Prevalence: Low (hash routing declining)
Risk: High (entire path client-controlled, no server-side protection possible)

## Key Insight: Decode Timing

The critical security property is WHEN decoding happens:

1. **Browser decodes** `location.pathname` once (except `%2f` and `%25`)
2. **`normalizePath()`** in route-recognizer decodes non-reserved chars (preserves `%2f` and `%25`)
3. **Route matching** happens on normalized path
4. **`findHandler()`** decodes captures via `decodeURIComponent()` for dynamic segments
5. **Model hook receives** fully decoded string

This means double-encoding is NOT effective: `%252f` → `%2f` (normalizePath) → still `%2f` in match → decoded to `/` in params.

The distinction is that `%2f` breaks route matching (splits segments) but wildcard `(.+)` captures it regardless.
