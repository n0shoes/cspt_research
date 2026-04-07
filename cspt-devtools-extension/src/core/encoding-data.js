// Per-framework encoding techniques — compiled from empirical research
// Each framework's decoding pipeline, risk level, payloads, and CSPT chain

var DoctorScan = window.DoctorScan || {};
window.DoctorScan = DoctorScan;

DoctorScan.ENCODING_DATA = {
  "react-router": {
    name: "React Router",
    riskLevel: "high",
    decodeFunction: "decodeURIComponent",
    decodePipeline: [
      "Browser sends %2F as-is in URL",
      "decodePath() calls decodeURIComponent on each segment",
      "matchPath() line 811: replaces remaining %2F with /",
      "useParams() returns fully decoded string including slashes",
      "Catch-all splat uses (.*) regex — captures everything"
    ],
    paramBehavior: {
      "useParams() [single]": "Fully decoded: %2F->/  %2E->.",
      "useParams() [catch-all *]": "Array of decoded segments via (.*) regex",
      "useSearchParams()": "Auto-decoded by browser URLSearchParams API",
      "useLocation().pathname": "NOT decoded — preserves URL encoding",
    },
    payloads: [
      { input: "/users/..%2F..%2Fadmin", result: "params.userId = '../../admin'", works: true },
      { input: "/users/..%252F..%252Fadmin", result: "params.userId = '../../admin'", works: true, note: "Double decode: decodePath() decodes %252F→%2F, then line 811 .replace(/%2F/g,'/') → /" },
      { input: "/files/* with /files/a/b/../../secret", result: "params['*'] = 'a/b/../../secret'", works: true },
      { input: "?redirect=..%2F..%2Fadmin", result: "searchParams.get('redirect') = '../../admin'", works: true },
    ],
    csptChain: "URL param -> decodeURIComponent -> interpolate in fetch(`/api/${param}`) -> browser normalizes ../ before sending -> traversal to /admin",
    cves: [],
    defenses: ["Validate params before interpolation", "Use URL constructor: new URL(path, baseUrl)", "Allowlist expected param formats"],
  },

  nextjs: {
    name: "Next.js",
    riskLevel: "high",
    decodeFunction: "decodeURIComponent (server) / re-encoded (client)",
    decodePipeline: [
      "Server route-matcher.js:19 — decodeURIComponent on matched segments",
      "Server get-dynamic-param.js:58 — RE-ENCODES with encodeURIComponent for FlightRouterState",
      "Client useParams() receives RE-ENCODED values (safe)",
      "Server Components 'await params' receive DECODED values (vulnerable)",
      "Route Handlers params receive DECODED values (SSRF)"
    ],
    paramBehavior: {
      "useParams() [client]": "RE-ENCODED — %2F stays as %2F (safe)",
      "await params [server]": "DECODED — %2F becomes / (SSRF vector!)",
      "Route Handler params": "DECODED — %2F becomes / (SSRF vector!)",
      "[...slug] catch-all": "Client: re-encoded array / Server: decoded array",
      "useSearchParams()": "Auto-decoded by browser API",
      "usePathname()": "Preserves URL encoding",
    },
    payloads: [
      { input: "/users/..%2F..%2Fadmin", result: "Client: '..%2F..%2Fadmin' / Server: '../../admin'", works: true, note: "Server-side only" },
      { input: "/data/[...slug] with ../../internal", result: "Server params.slug = ['..','..','internal']", works: true },
      { input: "/api/data/..%2F..%2Finternal", result: "Route handler: params decoded -> SSRF", works: true },
    ],
    csptChain: "Server Component: await params -> decoded '../../admin' -> fetch(`http://backend/${param}`) -> SSRF to internal service",
    cves: [],
    defenses: ["Validate server-side params", "Use URL constructor for fetch URLs", "Never interpolate await params directly"],
  },

  "vue-router": {
    name: "Vue Router",
    riskLevel: "high",
    decodeFunction: "decodeURIComponent",
    decodePipeline: [
      "URL pathname arrives percent-encoded",
      "Router splits on / to get segments",
      "decode() = decodeURIComponent called on each segment",
      "route.params stores DECODED values (including slashes from %2F)",
      "route.path preserves original encoding"
    ],
    paramBehavior: {
      "route.params [single]": "Fully decoded: %2F->/  (MOST exploitable)",
      "route.params [catch-all]": "Array of decoded segments — slashes are path separators",
      "route.path": "Preserves URL encoding (safe)",
      "route.query": "Auto-decoded by URLSearchParams",
    },
    payloads: [
      { input: "/users/..%2F..%2Fadmin", result: "route.params.userId = '../../admin'", works: true },
      { input: "/:pathMatch(.*)* catch-all", result: "route.params.pathMatch = ['..','..','admin']", works: true },
      { input: "?source=..%2F..%2Fadmin", result: "route.query.source = '../../admin'", works: true },
    ],
    csptChain: "route.params.id (decoded '../../admin') -> fetch(`/api/users/${id}`) -> browser normalizes -> GET /api/admin",
    cves: [],
    defenses: ["Use route.path instead of route.params for URL construction", "Validate params against allowlist", "Use router.resolve() which re-encodes"],
  },

  nuxt: {
    name: "Nuxt",
    riskLevel: "high",
    decodeFunction: "decodeURIComponent (inherits Vue Router) + H3 server",
    decodePipeline: [
      "Inherits Vue Router decoding for client-side params",
      "route.params fully decoded (same as Vue Router)",
      "Server routes: H3 getRouterParam() provides decoded values",
      "useFetch/$fetch with params = CSPT on client, SSRF on server",
      "__nuxt_island payloads can be stored (CVE-2025-59414)"
    ],
    paramBehavior: {
      "useRoute().params [client]": "Fully decoded (inherits Vue Router)",
      "getRouterParam() [server, default]": "NOT decoded — raw from radix3 (safe by default)",
      "getRouterParam() [server, {decode:true}]": "DECODED — SSRF vector when opt-in decode enabled",
      "useFetch/useAsyncData": "URL interpolation with decoded params",
      "$fetch": "Same as useFetch — decoded params in URL",
      "route.query [client]": "Decoded by Vue Router parseQuery() (+ stays literal, unlike URLSearchParams)",
      "getQuery(event) [server]": "Decoded by ufo library",
    },
    payloads: [
      { input: "/users/..%2F..%2Fadmin", result: "route.params.id = '../../admin'", works: true },
      { input: "Server: getRouterParam(event, 'id')", result: "'..%2F..%2Fadmin' (NOT decoded by default)", works: false, note: "Safe by default, no decode" },
      { input: "Server: getRouterParam(event, 'id', {decode:true})", result: "'../../admin' -> SSRF", works: true, note: "Opt-in decode enables traversal" },
      { input: "__nuxt_island payload injection", result: "Stored CSPT via island revival", works: true, note: "CVE-2025-59414" },
    ],
    csptChain: "Client: useFetch(`/api/users/${route.params.id}`) -> traversal. Server: getRouterParam({decode:true}) -> fetch(internal_url + param) -> SSRF. Default getRouterParam is NOT decoded.",
    cves: ["CVE-2025-59414 — Stored CSPT via __nuxt_island payload revival"],
    defenses: ["Validate params in middleware", "Use defineEventHandler input validation", "Sanitize __nuxt_island payloads"],
  },

  angular: {
    name: "Angular",
    riskLevel: "high",
    decodeFunction: "decodeURIComponent",
    decodePipeline: [
      "UrlParser splits URL on literal / first (preserving %2F during matching)",
      "Route matching works on raw segments",
      "decode() = decodeURIComponent runs AFTER matching, BEFORE paramMap storage",
      "paramMap.get() returns FULLY DECODED values including slashes",
      "EMPIRICALLY VERIFIED: %2F decodes to / in paramMap"
    ],
    paramBehavior: {
      "paramMap.get() [single]": "Fully decoded: %2F->/ (empirically verified)",
      "paramMap.get() [catch-all **]": "Decoded, slash-separated string",
      "queryParamMap.get()": "Decoded query parameters",
      "window.location.pathname": "Preserves encoding (safe)",
    },
    payloads: [
      { input: "/users/..%2Fapi%2Fadmin", result: "paramMap.get('id') = '../api/admin'", works: true },
      { input: "/users/hello%2Fworld", result: "paramMap.get('id') = 'hello/world'", works: true },
      { input: "/users/hello%00world", result: "paramMap.get('id') = 'hello\\0world'", works: true, note: "Null byte" },
      { input: "?q=..%2F..%2Fadmin", result: "queryParamMap.get('q') = '../../admin'", works: true },
    ],
    csptChain: "paramMap.get('id') -> decoded '../../admin' -> this.http.get(`/api/users/${id}`) -> traversal",
    cves: [],
    defenses: ["Use UrlSerializer.serialize() which re-encodes", "Validate paramMap values", "Use HttpParams for query construction"],
  },

  sveltekit: {
    name: "SvelteKit",
    riskLevel: "medium",
    decodeFunction: "decodeURIComponent (two-stage: pathname + params)",
    decodePipeline: [
      "decode_pathname() splits on %25 (encoded %), applies decodeURI() per segment — preserves %2F but decodes %2E",
      "Route matching via regex against decoded pathname",
      "decode_params() runs decodeURIComponent on matched groups — %2F becomes /",
      "params.x returns decoded values (two-stage decode: pathname + params)",
      "$page.url.pathname preserves encoding (safe source)",
      "Catch-all [...path] returns STRING (not array)",
      "Double-encode blocked: %252F → %25-split prevents decode → stays as literal %2F (Issue #3069 fix)"
    ],
    paramBehavior: {
      "params.x [single]": "Decoded via decode_params()",
      "params.path [...path]": "Decoded STRING with slashes (not array!)",
      "$page.url.pathname": "Preserves encoding (safe)",
      "url.searchParams": "Auto-decoded by browser API",
    },
    payloads: [
      { input: "/users/..%2F..%2Fadmin", result: "params.id = '../../admin'", works: true },
      { input: "/files/[...path] with ../secret", result: "params.path = '../../secret' (string)", works: true },
      { input: "CVE-2025-67647: decode_pathname vs url.pathname", result: "Inconsistency between decoded and raw", works: true },
    ],
    csptChain: "params.id (decoded) -> fetch(`/api/${params.id}`) -> server load = SSRF, client load = CSPT",
    cves: ["CVE-2025-67647 — decode_pathname vs url.pathname inconsistency"],
    defenses: ["Use param matchers to restrict format", "Use handleFetch hook to validate URLs", "Prefer $page.url over params for URL construction"],
  },

  solidstart: {
    name: "SolidStart",
    riskLevel: "low",
    decodeFunction: "NONE — @solidjs/router does NOT decode params",
    decodePipeline: [
      "@solidjs/router createMatcher() reads window.location.pathname (encoded)",
      "Splits on / to get segments",
      "Stores raw segments as params — NO decodeURIComponent called",
      "useParams() returns ENCODED values (%2F stays as %2F)",
      "EMPIRICALLY VERIFIED: most secure client-side framework for CSPT"
    ],
    paramBehavior: {
      "useParams() [single]": "NOT decoded: %2F stays as %2F (SAFE)",
      "useParams() [catch-all *]": "NOT decoded: single encoded string",
      "searchParams (URLSearchParams)": "Auto-decoded by browser API (STILL VULNERABLE)",
      "Server functions (RPC)": "Params pass via JSON — decoded on arrival",
    },
    payloads: [
      { input: "/users/..%2F..%2Fadmin", result: "useParams().id = '..%2F..%2Fadmin' (encoded!)", works: false },
      { input: "?source=..%2F..%2Fadmin", result: "searchParams.source = '../../admin'", works: true, note: "Search params ARE decoded" },
      { input: "Server function with param", result: "JSON deserialization preserves traversal", works: true, note: "Server-side only" },
    ],
    csptChain: "Path params blocked (no decode). Search params: URLSearchParams.get('x') -> decoded '../..' -> fetch -> traversal",
    cves: [],
    defenses: ["Already secure for path params", "Validate search params before use", "Validate server function inputs"],
  },

  remix: {
    name: "Remix",
    riskLevel: "high",
    decodeFunction: "decodeURIComponent (shares React Router v7 internals)",
    decodePipeline: [
      "Shares React Router v7 routing engine",
      "Same decodePath() + matchPath() pipeline",
      "Adds loaders/actions with server-side params access",
      "Loader params are decoded same as useParams()",
      "$.tsx splat routes use (.*) regex",
      "Server build NOT minified — patterns visible in source"
    ],
    paramBehavior: {
      "useParams() [client]": "Fully decoded (same as React Router)",
      "loader/action params [server]": "Fully decoded — SSRF vector",
      "params['*'] splat": "Captures everything including slashes",
      "useSearchParams()": "Auto-decoded",
    },
    payloads: [
      { input: "/users/..%2F..%2Fadmin", result: "params.userId = '../../admin'", works: true },
      { input: "/files/$.tsx with ../../secret", result: "params['*'] = '../../secret'", works: true },
      { input: "Loader: fetch with params", result: "Server-side SSRF", works: true },
    ],
    csptChain: "Same as React Router + loader/action server-side: params.id -> fetch(`http://internal/${id}`) -> SSRF",
    cves: [],
    defenses: ["Same as React Router", "Validate loader params", "Use invariant() for param format checks"],
  },

  ember: {
    name: "Ember",
    riskLevel: "medium",
    decodeFunction: "decodeURIComponent",
    decodePipeline: [
      "route-recognizer 0.3.4 (frozen since 2017)",
      "normalizePath(): splits on /, decodeURIComponent each segment, re-encodes % and / back",
      "Dynamic :param uses ([^/]+) regex — single segment, matched against normalized path",
      "Wildcard *path uses (.+) regex — captures everything including literal /",
      "findHandler(): dynamic params get final decodeURIComponent, wildcard params SKIP final decode",
      "Double-encode blocked: normalizePath re-encodes % → %252F stays as %252F → final decode gives %2F literal",
      "model() hook receives decoded params (dynamic) or partially-decoded params (wildcard)"
    ],
    paramBehavior: {
      "params.id [dynamic :id]": "Fully decoded: %2F → / via normalizePath+findHandler double decode. %2e%2e%2f also works.",
      "params.path [wildcard *path]": "NOT final-decoded: %2F stays %2F (star skips findHandler decode). Literal ../ works for traversal.",
      "queryParams": "Decoded via browser URLSearchParams",
    },
    payloads: [
      { input: "/users/..%2F..%2Fadmin", result: "params.id = '../../admin' (but %2F is literal in URL)", works: true, note: "Depends on server %2F handling" },
      { input: "/files/*path with ../../secret", result: "params.path = '../../secret'", works: true },
      { input: "Ember Data: store.findRecord('user', params.id)", result: "Adapter may not encode", works: true },
    ],
    csptChain: "model(params) -> fetch(`/api/${params.id}`) -> decoded traversal. Ember Data: adapter.buildURL() with decoded ID",
    cves: [],
    defenses: ["Use serialize() hook to validate params", "Custom adapter with URL encoding", "Route constraints"],
  },

  astro: {
    name: "Astro",
    riskLevel: "low",
    decodeFunction: "decodeURI (NOT decodeURIComponent!)",
    decodePipeline: [
      "Node.js receives raw req.url",
      "Standalone handler validates with decodeURI() (result discarded)",
      "App.match() calls validateAndDecodePathname() with decodeURI()",
      "decodeURI preserves %2F, %3F, %23 (RFC 3986 reserved chars)",
      "decodeURI DOES decode %2E->. and %61->a (unreserved chars)",
      "Double-encode defense: rejects if decoded still has %XX AND string changed",
      "CVE-2025-64765: middleware bypass via encoded letters (%61dmin)"
    ],
    paramBehavior: {
      "Astro.params [single]": "Partially decoded: dots yes, slashes NO (%2F stays)",
      "Astro.params [catch-all]": "String (not array) with literal slashes from path",
      "Astro.url.pathname": "Decoded via decodeURI (same partial decode)",
    },
    payloads: [
      { input: "/users/..%2F..%2Fadmin", result: "Astro.params = '..%2F..%2Fadmin' (slashes preserved!)", works: false },
      { input: "/users/%2E%2E%2Fapi%2Fadmin", result: "Astro.params = '..%2Fapi%2Fadmin' (dots decode, slashes don't)", works: false, note: "Partial decode" },
      { input: "/%61dmin", result: "Decoded to /admin but middleware may check raw", works: true, note: "CVE-2025-64765 (patched)" },
      { input: "[...segments] with literal /a/b/../../secret", result: "Catch-all captures literal slashes", works: true },
    ],
    csptChain: "Limited: %2F stays encoded. Catch-all routes with literal slashes or middleware bypass via encoded letters. SSR fetch with decoded dots.",
    cves: [
      "CVE-2025-64765 — Middleware bypass via encoded letters (%61dmin -> admin)",
      "GHSA-whqg-ppgf-wp8c — Double-encode bypass of CVE-2025-64765 fix"
    ],
    defenses: ["decodeURI already blocks %2F traversal", "Validate catch-all params", "Use stricter decode: reject any remaining %XX after decode"],
  },

  unknown: {
    name: "Unknown Framework",
    riskLevel: "medium",
    decodeFunction: "Unknown",
    decodePipeline: ["Framework not detected — check manually"],
    paramBehavior: {
      "Check manually": "Inspect how the framework handles URL decoding"
    },
    payloads: [
      { input: "..%2F..%2Fadmin", result: "Test with browser DevTools", works: null },
      { input: "..%252F..%252Fadmin", result: "Test double-encoding", works: null },
    ],
    csptChain: "Generic: URL param -> decode -> interpolate in fetch/XHR -> browser normalizes ../ -> traversal",
    cves: [],
    defenses: ["Validate all user-controlled URL inputs", "Use URL constructor", "Content Security Policy"],
  },
};

// Framework comparison matrix for quick reference
DoctorScan.ENCODING_MATRIX = [
  { framework: "React Router", decode: "decodeURIComponent + %2F replace", paramDecoded: true, catchAllType: "array", searchParamsDecoded: true, csptRisk: "HIGH" },
  { framework: "Next.js (client)", decode: "re-encoded via encodeURIComponent", paramDecoded: false, catchAllType: "re-encoded array", searchParamsDecoded: true, csptRisk: "LOW" },
  { framework: "Next.js (server)", decode: "decodeURIComponent", paramDecoded: true, catchAllType: "decoded array", searchParamsDecoded: true, csptRisk: "HIGH (SSRF)" },
  { framework: "Vue Router", decode: "decodeURIComponent", paramDecoded: true, catchAllType: "decoded array", searchParamsDecoded: true, csptRisk: "HIGH" },
  { framework: "Nuxt (client)", decode: "Inherits Vue Router", paramDecoded: true, catchAllType: "decoded array", searchParamsDecoded: true, csptRisk: "HIGH" },
  { framework: "Nuxt (server)", decode: "H3 getRouterParam (NOT decoded by default, decoded with {decode:true})", paramDecoded: false, catchAllType: "raw (default) / decoded (opt-in)", searchParamsDecoded: true, csptRisk: "LOW (default) / HIGH (with {decode:true})" },
  { framework: "Angular", decode: "decodeURIComponent (verified)", paramDecoded: true, catchAllType: "decoded string", searchParamsDecoded: true, csptRisk: "HIGH" },
  { framework: "SvelteKit", decode: "decodeURIComponent (two-stage)", paramDecoded: true, catchAllType: "decoded string", searchParamsDecoded: true, csptRisk: "MEDIUM" },
  { framework: "SolidStart", decode: "NONE (no decode)", paramDecoded: false, catchAllType: "encoded string", searchParamsDecoded: true, csptRisk: "LOW" },
  { framework: "Remix", decode: "decodeURIComponent (React Router)", paramDecoded: true, catchAllType: "decoded (splat)", searchParamsDecoded: true, csptRisk: "HIGH" },
  { framework: "Ember", decode: "decodeURIComponent", paramDecoded: true, catchAllType: "decoded string", searchParamsDecoded: true, csptRisk: "MEDIUM" },
  { framework: "Astro", decode: "decodeURI (NOT Component)", paramDecoded: false, catchAllType: "string (literal /)", searchParamsDecoded: true, csptRisk: "LOW" },
];
