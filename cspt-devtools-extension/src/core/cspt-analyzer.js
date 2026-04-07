// CSPT Source Detection — finds where decoded route params flow into fetch/HTTP calls
// and where the response is processed. This is the actual CSPT chain:
// Route param (decoded by router) -> interpolated into fetch URL -> browser normalizes ../ -> traversal

var DoctorScan = window.DoctorScan || {};
window.DoctorScan = DoctorScan;

// ============================================================
// CSPT Source Patterns
// Each pattern matches code where a route param accessor
// flows into a fetch/HTTP URL — the core CSPT vulnerability.
// ============================================================

const CSPT_SOURCES = {
  universal: [
    {
      regex: /fetch\s*\(\s*`([^`]{0,120})\$\{([^}]+)\}[^`]*`/g,
      type: "fetch-template-literal",
      risk: "medium",
      sourceDesc: "Dynamic variable interpolated into fetch URL",
      sinkDesc: "fetch() with template literal — browser normalizes ../ before sending",
    },
    {
      regex: /fetch\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
      type: "fetch-concatenation",
      risk: "medium",
      sourceDesc: "Dynamic variable concatenated into fetch URL",
      sinkDesc: "fetch() with string concatenation in URL path",
    },
    {
      regex: /axios\.\w+\s*\(\s*`([^`]{0,120})\$\{([^}]+)\}[^`]*`/g,
      type: "axios-template-literal",
      risk: "medium",
      sourceDesc: "Dynamic variable interpolated into axios URL",
      sinkDesc: "axios with template literal URL",
    },
    {
      regex: /axios\.\w+\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
      type: "axios-concatenation",
      risk: "medium",
      sourceDesc: "Dynamic variable concatenated into axios URL",
      sinkDesc: "axios with string concatenation in URL path",
    },
    {
      regex: /\.open\s*\(\s*["']\w+["']\s*,\s*`([^`]{0,120})\$\{([^}]+)\}[^`]*`/g,
      type: "xhr-template-literal",
      risk: "medium",
      sourceDesc: "Dynamic variable interpolated into XHR URL",
      sinkDesc: "XMLHttpRequest.open() with template literal URL",
    },
  ],

  "react-router": [
    {
      regex: /useParams\s*\(\s*\)[\s\S]{0,300}fetch\s*\(\s*`[^`]*\$\{([^}]+)\}[^`]*`/g,
      type: "useParams-to-fetch",
      risk: "high",
      sourceDesc: "React Router useParams() — params fully decoded (%2e%2e%2f -> ../)",
      sinkDesc: "Decoded param interpolated into fetch() URL template literal",
    },
    {
      regex: /useParams\s*\(\s*\)[\s\S]{0,300}fetch\s*\(\s*["'][^"']*["']\s*\+/g,
      type: "useParams-to-fetch-concat",
      risk: "high",
      sourceDesc: "React Router useParams() — params fully decoded",
      sinkDesc: "Decoded param concatenated into fetch() URL string",
    },
    {
      regex: /params\s*\[\s*["']\*["']\s*\][\s\S]{0,300}fetch\s*\(/g,
      type: "splat-to-fetch",
      risk: "critical",
      sourceDesc: "React Router splat param [\"*\"] — captures full path including decoded slashes",
      sinkDesc: "Splat param (with /) flows into fetch URL — highest CSPT risk",
    },
    {
      regex: /\{[\w,:\s]{1,60}\}\s*=\s*\w{1,3}\(\s*\)[\s\S]{0,300}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "minified-params-to-fetch",
      risk: "high",
      sourceDesc: "Minified hook destructure (likely useParams) — params decoded",
      sinkDesc: "Decoded param from minified source flows into fetch() URL",
    },
    {
      regex: /\w{1,3}\(\s*\)\s*\[\s*["']\*["']\s*\][\s\S]{0,300}fetch\s*\(/g,
      type: "minified-splat-to-fetch",
      risk: "critical",
      sourceDesc: "Minified splat param access via [\"*\"] — full path with slashes",
      sinkDesc: "Splat param from minified source flows into fetch URL",
    },
    {
      regex: /\{params:\s*(\w+)\}[\s\S]{0,300}fetch\s*\(\s*`[^`]*\$\{\1\.\w+\}/g,
      type: "loader-params-to-fetch",
      risk: "high",
      sourceDesc: "React Router loader/action params — decoded from URL",
      sinkDesc: "Loader param interpolated into fetch() URL",
    },
    {
      regex: /queryFn\s*:\s*(?:\(\s*\)|_)\s*=>\s*fetch\s*\(\s*`[^`]*\$\{([^}]+)\}/g,
      type: "tanstack-query-fetch",
      risk: "high",
      sourceDesc: "TanStack/React Query queryFn — likely uses decoded route params",
      sinkDesc: "Variable interpolated in queryFn fetch URL",
    },
    {
      regex: /\.get\s*\(\s*["'][^"']+["']\s*\)[\s\S]{0,250}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "searchParams-to-fetch",
      risk: "high",
      sourceDesc: "searchParams.get() — URLSearchParams auto-decodes values",
      sinkDesc: "Decoded search param flows into fetch URL",
    },
  ],

  nextjs: [
    // Route handler await params — DECODED, direct SSRF (the real danger)
    {
      regex: /(?:export\s+(?:async\s+)?function\s+(?:GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS))[\s\S]{0,500}(?:await\s+)?params[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{([^}]+)\}[^`]*`/g,
      type: "route-handler-params-to-fetch",
      risk: "critical",
      sourceDesc: "Next.js Route Handler params — DECODED (%2F → /), direct SSRF",
      sinkDesc: "Route handler param interpolated into fetch URL (SSRF)",
    },
    // Page server component await params — RE-ENCODED, indirect SSRF only
    {
      regex: /(?:await\s+)?params[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{([^}]+)\}[^`]*`/g,
      type: "page-params-to-fetch",
      risk: "medium",
      sourceDesc: "Next.js page server component params — RE-ENCODED (%2F stays %2F), SSRF only via route handler indirection",
      sinkDesc: "Re-encoded param in fetch URL — traversal depends on receiving route handler",
    },
    {
      regex: /getServerSideProps[\s\S]{0,500}params[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "gssp-params-to-fetch",
      risk: "critical",
      sourceDesc: "Next.js getServerSideProps — server-side decoded params",
      sinkDesc: "GSSP param interpolated into fetch URL (server-side SSRF)",
    },
    {
      regex: /useParams\s*\(\s*\)[\s\S]{0,300}fetch/g,
      type: "next-useParams-to-fetch",
      risk: "low",
      sourceDesc: "Next.js useParams() — RE-ENCODED params (%2F stays %2F, safe for CSPT)",
      sinkDesc: "Re-encoded useParams value flows into fetch call — low CSPT risk",
    },
    // useSearchParams → fetch (standard browser decode, CSPT viable)
    {
      regex: /useSearchParams\s*\(\s*\)[\s\S]{0,300}fetch/g,
      type: "next-useSearchParams-to-fetch",
      risk: "high",
      sourceDesc: "Next.js useSearchParams() — standard URLSearchParams decode (%2F → /)",
      sinkDesc: "Decoded searchParam flows into fetch call",
    },
    // useSearchParams → fetch → dangerouslySetInnerHTML (XSS chain)
    {
      regex: /useSearchParams\s*\(\s*\)[\s\S]{0,500}fetch[\s\S]{0,500}dangerouslySetInnerHTML/g,
      type: "next-searchParams-to-innerHTML",
      risk: "critical",
      sourceDesc: "Next.js useSearchParams() → fetch → dangerouslySetInnerHTML (CSPT→XSS)",
      sinkDesc: "Decoded searchParam → fetch response → innerHTML injection",
    },
    // window.location.hash → fetch (no server-side protection)
    {
      regex: /(?:window\.)?location\.hash[\s\S]{0,300}fetch/g,
      type: "next-hash-to-fetch",
      risk: "high",
      sourceDesc: "window.location.hash — raw value, no server-side decoding, literal ../ works",
      sinkDesc: "Hash value flows into fetch URL — no encoding protection",
    },
    // window.location.hash → service layer → fetch
    {
      regex: /(?:window\.)?location\.hash[\s\S]{0,300}\.(?:get|post|put|delete|patch|request|send|fetch)\s*\(/g,
      type: "next-hash-to-service",
      risk: "high",
      sourceDesc: "window.location.hash → service layer — literal ../ traversal",
      sinkDesc: "Hash flows through service abstraction into HTTP request",
    },
    {
      regex: /(?:slug|path)\s*\.\s*join\s*\(\s*["'`]\/["'`]\s*\)[\s\S]{0,250}fetch/g,
      type: "catchall-join-to-fetch",
      risk: "medium",
      sourceDesc: "Next.js catch-all params join('/') — risk depends on context (re-encoded in pages, decoded in route handlers)",
      sinkDesc: "Joined catch-all segments flow into fetch URL",
    },
  ],

  "vue-router": [
    {
      regex: /route\.params\.\w+[\s\S]{0,200}(?:fetch|useFetch|\$fetch)\s*\(/g,
      type: "vue-params-to-fetch",
      risk: "high",
      sourceDesc: "Vue Router route.params — DECODED values (slashes decoded, most exploitable)",
      sinkDesc: "Decoded route param flows into fetch/useFetch/$fetch",
    },
    {
      regex: /(?:fetch|useFetch|\$fetch)\s*\(\s*`[^`]*\$\{[^}]*route\.params[^}]*\}[^`]*`/g,
      type: "vue-params-template-fetch",
      risk: "high",
      sourceDesc: "Vue Router route.params in template literal",
      sinkDesc: "route.params interpolated directly into fetch URL template",
    },
    {
      regex: /route\.params\.pathMatch[\s\S]{0,250}(?:fetch|useFetch|\$fetch)/g,
      type: "vue-catchall-to-fetch",
      risk: "critical",
      sourceDesc: "Vue Router pathMatch catch-all — array with decoded segments including slashes",
      sinkDesc: "Catch-all param flows into fetch URL",
    },
    {
      regex: /route\.query\.\w+[\s\S]{0,200}(?:fetch|useFetch|\$fetch)\s*\(/g,
      type: "vue-query-to-fetch",
      risk: "high",
      sourceDesc: "Vue Router route.query — decoded query params (no segment boundary, full traversal string)",
      sinkDesc: "Decoded query param flows into fetch/useFetch/$fetch URL",
    },
    {
      regex: /(?:fetch|useFetch|\$fetch)\s*\(\s*`[^`]*\$\{[^}]*route\.query[^}]*\}[^`]*`/g,
      type: "vue-query-template-fetch",
      risk: "high",
      sourceDesc: "Vue Router route.query in template literal — decoded, no segment boundary",
      sinkDesc: "route.query interpolated directly into fetch URL template",
    },
    {
      regex: /route\.hash[\s\S]{0,200}(?:fetch|useFetch|\$fetch)\s*\(/g,
      type: "vue-hash-to-fetch",
      risk: "high",
      sourceDesc: "Vue Router route.hash — decoded hash value, literal ../ works",
      sinkDesc: "Hash value flows into fetch URL — no encoding protection",
    },
  ],

  nuxt: [
    {
      regex: /useFetch\s*\(\s*`[^`]*\$\{[^}]*(?:route\.params|params)\.[^}]+\}[^`]*`/g,
      type: "nuxt-useFetch-params",
      risk: "high",
      sourceDesc: "Nuxt useFetch with route params — decoded by Vue Router underneath",
      sinkDesc: "Route param interpolated into useFetch URL",
    },
    {
      regex: /\$fetch\s*\(\s*`[^`]*\$\{[^}]*(?:route\.params|params)\.[^}]+\}[^`]*`/g,
      type: "nuxt-fetch-params",
      risk: "high",
      sourceDesc: "Nuxt $fetch with route params — decoded by Vue Router",
      sinkDesc: "Route param interpolated into $fetch URL",
    },
    {
      regex: /getRouterParam\s*\([^)]*\{\s*decode\s*:\s*true\s*\}[^)]*\)[\s\S]{0,200}(?:fetch|\$fetch)\s*\(/g,
      type: "nuxt-server-param-decoded-to-fetch",
      risk: "critical",
      sourceDesc: "Nuxt server getRouterParam({decode:true}) — DECODED, SSRF vector",
      sinkDesc: "Explicitly decoded server param flows into fetch (SSRF)",
    },
    {
      regex: /getRouterParam\s*\([^)]+\)[\s\S]{0,200}(?:fetch|\$fetch)\s*\(/g,
      type: "nuxt-server-param-to-fetch",
      risk: "medium",
      sourceDesc: "Nuxt server getRouterParam() — NOT decoded by default (raw from radix3). Check if {decode:true} is used.",
      sinkDesc: "Server route param flows into fetch — safe unless {decode:true} passed",
    },
    {
      regex: /route\.query\.\w+[\s\S]{0,200}(?:fetch|useFetch|\$fetch)\s*\(/g,
      type: "nuxt-query-to-fetch",
      risk: "high",
      sourceDesc: "Nuxt route.query — decoded query params (inherits Vue Router parseQuery, + stays literal)",
      sinkDesc: "Decoded query param flows into fetch URL",
    },
    {
      regex: /(?:fetch|useFetch|\$fetch)\s*\(\s*`[^`]*\$\{[^}]*route\.query[^}]*\}[^`]*`/g,
      type: "nuxt-query-template-fetch",
      risk: "high",
      sourceDesc: "Nuxt route.query in template literal — decoded, no segment boundary",
      sinkDesc: "route.query interpolated directly into fetch URL template",
    },
    {
      regex: /route\.hash[\s\S]{0,200}(?:fetch|useFetch|\$fetch)\s*\(/g,
      type: "nuxt-hash-to-fetch",
      risk: "high",
      sourceDesc: "Nuxt route.hash — decoded by Vue Router decode()",
      sinkDesc: "Hash value flows into fetch URL",
    },
  ],

  angular: [
    // Pattern 1: paramMap.pipe(switchMap((params) => { ... this.http.get(url) }))
    // This is the most common Angular CSPT pattern — paramMap emits decoded params
    // via pipe/switchMap, params.get() extracts them, then HttpClient sends the request.
    // The compiled code keeps paramMap.pipe intact even after AOT compilation.
    {
      regex: /\.(?:param|queryParam)Map\.pipe\s*\([\s\S]{0,800}\.http\.(?:get|post|put|delete|patch)\s*\(/g,
      type: "angular-paramMap-pipe-to-http",
      risk: "high",
      sourceDesc: "Angular paramMap.pipe() — decoded params flow through switchMap to HttpClient",
      sinkDesc: "paramMap.pipe(switchMap(params => { ... http.get(url) })) — decoded param in URL",
    },
    // Pattern 2: Template literal URL assigned to variable, then passed to http.get(var)
    // Compiled Angular preserves: const url = `/api/.../${param}`; ... this.http.get(url)
    {
      regex: /const\s+\w+\s*=\s*`\/[^`]*\$\{[^}]+\}[^`]*`[\s\S]{0,300}\.(?:get|post|put|delete|patch)\s*\(\s*\w+/g,
      type: "angular-url-var-to-http",
      risk: "high",
      sourceDesc: "Template literal URL with interpolated param assigned to variable",
      sinkDesc: "Variable URL passed to HttpClient — decoded param baked into path",
    },
    // Pattern 3: Direct paramMap.get() → http (resolver/snapshot pattern)
    // Resolvers use route.paramMap.get("x") directly, not via pipe
    {
      regex: /paramMap\.get\s*\(\s*["'][^"']+["']\s*\)[\s\S]{0,300}\.(?:get|post|put|delete|patch)\s*\(/g,
      type: "angular-paramMap-to-http",
      risk: "high",
      sourceDesc: "Angular paramMap.get() — fully decoded including slashes",
      sinkDesc: "Decoded param flows into HttpClient request",
    },
    // Pattern 4: HttpClient called with inline template literal URL
    {
      regex: /\.http\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`/g,
      type: "angular-http-template",
      risk: "high",
      sourceDesc: "Angular HttpClient with interpolated URL",
      sinkDesc: "Variable interpolated into HttpClient request URL template literal",
    },
    // Pattern 5: snapshot.paramMap → http
    {
      regex: /snapshot\.param(?:s|Map)[\s\S]{0,200}\.(?:get|post|put|delete|patch)\s*\(/g,
      type: "angular-snapshot-to-http",
      risk: "high",
      sourceDesc: "Angular route snapshot params — decoded from URL",
      sinkDesc: "Snapshot param flows into HttpClient request",
    },
    // Pattern 6: queryParamMap.get → http (direct, not via pipe)
    {
      regex: /queryParamMap\.get[\s\S]{0,200}(?:fetch|\.get|\.post)\s*\(/g,
      type: "angular-queryParam-to-http",
      risk: "medium",
      sourceDesc: "Angular queryParamMap.get() — decoded query params",
      sinkDesc: "Query param flows into HTTP request",
    },
    // Pattern 7: queryParamMap/paramMap → router.navigate() (open redirect)
    // Decoded query/path param flows into router.navigate([path]) — attacker controls destination
    {
      regex: /\.(?:param|queryParam)Map[\s\S]{0,400}\.router\.navigate\s*\(/g,
      type: "angular-param-to-navigate",
      risk: "high",
      sourceDesc: "Angular decoded param flows into router.navigate()",
      sinkDesc: "router.navigate() with attacker-controlled path — open redirect",
    },
    // Pattern 8: router.navigate with variable (catch programmatic navigation sinks)
    {
      regex: /\.router\.navigate\s*\(\s*\[\s*\w+\s*\]/g,
      type: "angular-navigate-variable",
      risk: "medium",
      sourceDesc: "Angular router.navigate() with variable argument",
      sinkDesc: "router.navigate([variable]) — check if variable comes from decoded param",
    },
  ],

  sveltekit: [
    {
      regex: /params\.\w+[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "sveltekit-params-to-fetch",
      risk: "high",
      sourceDesc: "SvelteKit load function params — decoded from URL",
      sinkDesc: "Param interpolated into fetch URL in load function",
    },
    {
      regex: /\$page\.params\.\w+[\s\S]{0,200}fetch/g,
      type: "sveltekit-page-params-to-fetch",
      risk: "high",
      sourceDesc: "SvelteKit $page.params — client-side decoded params",
      sinkDesc: "$page.params value flows into fetch URL",
    },
    {
      regex: /params\.path[\s\S]{0,150}fetch/g,
      type: "sveltekit-rest-to-fetch",
      risk: "critical",
      sourceDesc: "SvelteKit rest param 'path' — [...path] captures slashes",
      sinkDesc: "Rest param flows into fetch URL",
    },
  ],

  remix: [
    {
      regex: /(?:loader|action)[\s\S]{0,300}params\.\w+[\s\S]{0,200}fetch\s*\(/g,
      type: "remix-loader-params-to-fetch",
      risk: "critical",
      sourceDesc: "Remix loader/action params — server-side decoded, SSRF vector",
      sinkDesc: "Loader param flows into server-side fetch URL (SSRF)",
    },
    {
      regex: /params\s*\[\s*["']\*["']\s*\][\s\S]{0,300}fetch\s*\(/g,
      type: "remix-splat-to-fetch",
      risk: "critical",
      sourceDesc: "Remix splat param $.tsx — captures full path with decoded slashes",
      sinkDesc: "Splat param flows into fetch URL",
    },
  ],

  ember: [
    {
      regex: /model\s*\(\s*params\s*\)[\s\S]{0,300}fetch\s*\(/g,
      type: "ember-model-params-to-fetch",
      risk: "high",
      sourceDesc: "Ember model() hook params — decoded from URL",
      sinkDesc: "Model hook params flow into fetch URL",
    },
    {
      regex: /params\.[\w_]+[\s\S]{0,150}fetch/g,
      type: "ember-params-to-fetch",
      risk: "high",
      sourceDesc: "Ember route params — decoded from URL",
      sinkDesc: "Route params flow into fetch call",
    },
    {
      regex: /(?:store|this\.store)\.find(?:Record|All)\s*\(\s*["'][^"']+["']\s*,\s*params\./g,
      type: "ember-data-params",
      risk: "medium",
      sourceDesc: "Ember Data store.findRecord with route params",
      sinkDesc: "Route param used as record ID in Ember Data request",
    },
  ],

  solidstart: [
    {
      regex: /useParams[\s\S]{0,300}createResource[\s\S]{0,300}fetch\s*\(/g,
      type: "solid-params-resource-fetch",
      risk: "high",
      sourceDesc: "SolidStart useParams -> createResource — reactive CSPT chain",
      sinkDesc: "Param flows through reactive resource chain into fetch",
    },
    {
      regex: /['"]use server['"][\s\S]{0,500}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "solid-server-function-fetch",
      risk: "critical",
      sourceDesc: "SolidStart server function — CSPT becomes SSRF",
      sinkDesc: "Server function interpolates variable into fetch URL",
    },
    {
      regex: /createAsync[\s\S]{0,200}fetch\s*\(/g,
      type: "solid-createAsync-fetch",
      risk: "medium",
      sourceDesc: "SolidStart createAsync near fetch — check param flow",
      sinkDesc: "Async resource near fetch call",
    },
  ],

  astro: [
    {
      regex: /Astro\.params[\s\S]{0,200}fetch\s*\(/g,
      type: "astro-params-to-fetch",
      risk: "high",
      sourceDesc: "Astro.params — SSR decoded from URL (uses decodeURI, not decodeURIComponent)",
      sinkDesc: "Astro param flows into server-side fetch URL",
    },
  ],
};

// ============================================================
// Response Processing Indicators
// Scanned forward from found CSPT sources to identify how
// the fetch response is used — determines the impact:
// innerHTML/v-html = XSS, setState = data poisoning, etc.
// ============================================================

const RESPONSE_INDICATORS = [
  // XSS sinks (high impact — CSPT->XSS chain)
  { regex: /\.innerHTML\s*=/g, type: "innerHTML", desc: "Response assigned to innerHTML (XSS)", risk: "high" },
  { regex: /dangerouslySetInnerHTML/g, type: "dangerouslySetInnerHTML", desc: "Response -> dangerouslySetInnerHTML (XSS)", risk: "high" },
  { regex: /v-html/g, type: "v-html", desc: "Response bound via v-html directive (XSS)", risk: "high" },
  { regex: /\{@html\s/g, type: "@html", desc: "SvelteKit {@html} — renders raw HTML (XSS)", risk: "high" },
  { regex: /bypassSecurityTrustHtml\s*\(/g, type: "bypassSecurityTrustHtml", desc: "Angular bypassSecurityTrustHtml() — disables sanitizer (XSS)", risk: "high" },
  { regex: /\{\{\{/g, type: "triple-curlies", desc: "Ember/Handlebars {{{ — raw HTML rendering (XSS)", risk: "high" },
  { regex: /htmlSafe\s*\(/g, type: "htmlSafe", desc: "Ember htmlSafe() — marks string as safe HTML (XSS)", risk: "high" },
  { regex: /\.insertAdjacentHTML/g, type: "insertAdjacentHTML", desc: "Response -> insertAdjacentHTML (XSS)", risk: "high" },
  { regex: /document\.write/g, type: "document-write", desc: "Response -> document.write (XSS)", risk: "high" },
  // Navigation sinks (medium impact — open redirect)
  { regex: /window\.location\s*[=.]|location\.href\s*=/g, type: "navigation", desc: "Response used for navigation/redirect", risk: "medium" },
  { regex: /\.href\s*=(?!=)/g, type: "href-set", desc: "Response assigned to .href", risk: "medium" },
  { regex: /\.src\s*=(?!=)/g, type: "src-set", desc: "Response assigned to .src", risk: "medium" },
  // Data processing (info — shows how response is consumed)
  { regex: /\.json\s*\(\s*\)/g, type: "json-parse", desc: "Response parsed as JSON", risk: "info" },
  { regex: /\.text\s*\(\s*\)/g, type: "text-read", desc: "Response read as text", risk: "info" },
  { regex: /setState\s*\(/g, type: "setState", desc: "Response stored in React state", risk: "info" },
  { regex: /set[A-Z]\w*\s*\(/g, type: "state-setter", desc: "Response stored via state setter", risk: "info" },
  { regex: /\.value\s*=(?!=)/g, type: "ref-assign", desc: "Response assigned to reactive ref/value", risk: "info" },
  { regex: /\.subscribe\s*\(/g, type: "observable", desc: "Response processed via Observable subscription", risk: "info" },
  { regex: /\.pipe\s*\(/g, type: "rxjs-pipe", desc: "Response piped through RxJS operators", risk: "info" },
];

// ============================================================
// Helpers
// ============================================================

function extractContext(body, matchIndex, matchLength) {
  const start = Math.max(0, matchIndex - 80);
  const end = Math.min(body.length, matchIndex + matchLength + 80);
  let ctx = body.substring(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) ctx = "..." + ctx;
  if (end < body.length) ctx = ctx + "...";
  return ctx;
}

function getLineNumber(body, matchIndex) {
  let line = 1;
  for (let i = 0; i < matchIndex && i < body.length; i++) {
    if (body[i] === "\n") line++;
  }
  return line;
}

function getLineAndColumn(body, absoluteIndex) {
  let line = 1;
  let lastNewline = -1;
  for (let i = 0; i < absoluteIndex && i < body.length; i++) {
    if (body[i] === "\n") {
      line++;
      lastNewline = i;
    }
  }
  return { line, column: absoluteIndex - lastNewline - 1 };
}

// Find exact positions of the source (param accessor) and fetch call
// within a regex match, so each is independently clickable.

const SOURCE_LOCATORS = [
  /useParams\s*\(/,
  /params\s*\[\s*["']\*/,
  /params\.\w+/,
  /route\.params/,
  /paramMap\.get\s*\(/,
  /snapshot\.param/,
  /queryParamMap\.get/,
  /searchParams\.get\s*\(|\.get\s*\(\s*["']/,
  /Astro\.params/,
  /\$page\.params/,
  /getRouterParam\s*\(/,
  /getServerSideProps/,
  /model\s*\(\s*params/,
  /useParams/,
  /(?:slug|path)\s*\.\s*join/,
  /createAsync/,
  /queryFn/,
  /['"]use server['"]/,
  /(?:loader|action)/,
  /route\.query/,
  /route\.hash/,
];

const SINK_LOCATORS = [
  /fetch\s*\(/,
  /useFetch\s*\(/,
  /\$fetch\s*\(/,
  /axios\.\w+\s*\(/,
  /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(/,
  /\.open\s*\(/,
  /\.find(?:Record|All)\s*\(/,
  /createResource/,
];

function locateInMatch(matchText, locators) {
  for (const re of locators) {
    const m = re.exec(matchText);
    if (m) return m.index;
  }
  return null;
}

function getSourceAndFetchLines(body, matchIndex, matchText) {
  // Find source accessor position within the match
  const sourceOffset = locateInMatch(matchText, SOURCE_LOCATORS);
  // Find sink (fetch call) position within the match
  const sinkOffset = locateInMatch(matchText, SINK_LOCATORS);

  const sourceAbsolute = sourceOffset !== null ? matchIndex + sourceOffset : matchIndex;
  const sinkAbsolute = sinkOffset !== null ? matchIndex + sinkOffset : null;

  const sourcePos = getLineAndColumn(body, sourceAbsolute);
  const sinkPos = sinkAbsolute !== null ? getLineAndColumn(body, sinkAbsolute) : null;

  return {
    sourceLineNumber: sourcePos.line,
    sourceColumnNumber: sourcePos.column,
    sinkLineNumber: sinkPos ? sinkPos.line : null,
    sinkColumnNumber: sinkPos ? sinkPos.column : null,
  };
}

function findResponseProcessing(body, matchEnd) {
  const searchEnd = Math.min(body.length, matchEnd + 800);
  const region = body.substring(matchEnd, searchEnd);
  const found = [];
  const seen = new Set();

  for (const indicator of RESPONSE_INDICATORS) {
    indicator.regex.lastIndex = 0;
    const m = indicator.regex.exec(region);
    if (m && !seen.has(indicator.type)) {
      seen.add(indicator.type);
      found.push({
        type: indicator.type,
        desc: indicator.desc,
        risk: indicator.risk,
        pattern: m[0].substring(0, 60),
        lineNumber: getLineNumber(body, matchEnd + m.index),
      });
    }
  }

  const riskOrder = { high: 0, medium: 1, info: 2 };
  found.sort((a, b) => (riskOrder[a.risk] || 2) - (riskOrder[b.risk] || 2));
  return found;
}

// ============================================================
// Standalone Param Source Detection
// Finds uses of route param accessors (useParams, route.params, etc.)
// independent of whether they flow into fetch. Each is clickable.
// ============================================================

const PARAM_SOURCE_PATTERNS = {
  "react-router": [
    { regex: /useParams\s*\(\s*\)(?!\s*\{)/g, type: "useParams()", risk: "high", desc: "React Router useParams() — params fully decoded (%2F → /)" },
    { regex: /useSearchParams\s*\(\s*\)(?!\s*\{)/g, type: "useSearchParams()", risk: "high", desc: "React Router useSearchParams() — URLSearchParams auto-decodes" },
    { regex: /useLocation\s*\(\s*\)(?!\s*\{)/g, type: "useLocation()", risk: "low", desc: "React Router useLocation() — pathname preserves encoding" },
    { regex: /params\s*\[\s*["']\*["']\s*\]/g, type: 'params["*"] (splat)', risk: "critical", desc: "React Router splat — captures across / boundaries, full decode" },
    { regex: /useLoaderData\s*\(\s*\)(?!\s*\{)/g, type: "useLoaderData()", risk: "medium", desc: "React Router useLoaderData() — if loader used params, tainted data flows through" },
    { regex: /(?:loader|action)\s*\(\s*\{\s*(?:request\s*,\s*)?params\s*\}/g, type: "loader({ params })", risk: "high", desc: "React Router loader/action params — decoded from URL" },
  ],
  nextjs: [
    { regex: /useParams\s*\(\s*\)(?!\s*\{)/g, type: "useParams()", risk: "low", desc: "Next.js useParams() — RE-ENCODED (%2F stays %2F, safe for client-side CSPT)" },
    { regex: /useSearchParams\s*\(\s*\)(?!\s*\{)/g, type: "useSearchParams()", risk: "high", desc: "Next.js useSearchParams() — standard URLSearchParams decode (%2F → /, CSPT viable)" },
    { regex: /usePathname\s*\(\s*\)(?!\s*\{)/g, type: "usePathname()", risk: "low", desc: "Next.js usePathname() — preserves URL encoding (safe)" },
    // Route handler await params — must be inside GET/POST/etc export function
    { regex: /(?:export\s+(?:async\s+)?function\s+(?:GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS))[\s\S]{0,300}await\s+params/g, type: "await params (route handler)", risk: "critical", desc: "Next.js Route Handler params — DECODED (%2F → /, direct SSRF). Only route handlers decode; page components re-encode." },
    // Page server component await params — re-encoded, NOT decoded
    // Use negative lookahead to avoid matching route handler pattern
    { regex: /(?:async\s+function\s+\w+Page|async\s+function\s+\w+Layout|export\s+default\s+async\s+function)[\s\S]{0,300}await\s+params/g, type: "await params (page)", risk: "low", desc: "Next.js page/layout server component params — RE-ENCODED (%2F stays %2F). NOT decoded like route handlers." },
    // Fallback for generic await params not matched by the above — flag for manual review
    { regex: /(?<!\w)await\s+params(?!\s*\.)/g, type: "await params (unknown context)", risk: "medium", desc: "Next.js await params — context unclear. Pages get RE-ENCODED (safe), route handlers get DECODED (SSRF). Check which." },
    { regex: /useRouter\s*\(\s*\)[\s\S]{0,100}\.query/g, type: "useRouter().query", risk: "high", desc: "Next.js Pages Router query — decoded params" },
    { regex: /getServerSideProps/g, type: "getServerSideProps", risk: "critical", desc: "Next.js GSSP — server-side decoded params (SSRF vector)" },
    { regex: /getStaticProps/g, type: "getStaticProps", risk: "low", desc: "Next.js getStaticProps — build-time only, developer-controlled" },
    { regex: /(?:slug|path)\s*\.\s*join\s*\(\s*["'`]\/["'`]\s*\)/g, type: "slug.join('/') (catch-all)", risk: "medium", desc: "Next.js catch-all join('/') — re-encoded in pages (safe), decoded in route handlers (SSRF). Check context." },
    // window.location.hash — not Next.js specific but commonly used, literal ../ works
    { regex: /(?:window\.)?location\.hash/g, type: "location.hash", risk: "high", desc: "window.location.hash — raw value, no encoding, literal ../ works for CSPT" },
    // dangerouslySetInnerHTML sink
    { regex: /dangerouslySetInnerHTML\s*:\s*\{/g, type: "dangerouslySetInnerHTML", risk: "high", desc: "dangerouslySetInnerHTML sink — if fed by CSPT fetch response, enables XSS" },
  ],
  "vue-router": [
    { regex: /(?:use)?[Rr]oute\s*(?:\(\s*\))?\s*\.params\.\w+/g, type: "route.params.*", risk: "high", desc: "Vue Router route.params — FULLY DECODED (%2F → /)" },
    { regex: /route\.path(?!\w)/g, type: "route.path", risk: "low", desc: "Vue Router route.path — preserves encoding (safe)" },
    { regex: /route\.fullPath/g, type: "route.fullPath", risk: "low", desc: "Vue Router route.fullPath — preserves encoding" },
    { regex: /route\.query\.\w+/g, type: "route.query.*", risk: "high", desc: "Vue Router route.query — decoded query params" },
    { regex: /route\.params\.pathMatch/g, type: "route.params.pathMatch (catch-all)", risk: "critical", desc: "Vue Router catch-all pathMatch — array with decoded segments including slashes" },
    { regex: /route\.hash/g, type: "route.hash", risk: "high", desc: "Vue Router route.hash — decoded by Vue Router decode(), literal ../ works for CSPT" },
  ],
  nuxt: [
    { regex: /useRoute\s*\(\s*\)(?!\s*\{)[\s\S]{0,50}\.params/g, type: "useRoute().params", risk: "high", desc: "Nuxt useRoute().params — inherits Vue Router full decode" },
    { regex: /getRouterParam\s*\([^)]*\{\s*decode\s*:\s*true\s*\}/g, type: "getRouterParam({decode:true})", risk: "critical", desc: "Nuxt server getRouterParam({decode:true}) — opt-in DECODED, SSRF vector. Default is NOT decoded." },
    { regex: /getRouterParam\s*\(\s*event\s*,\s*["'][^"']+["']\s*\)/g, type: "getRouterParam()", risk: "low", desc: "Nuxt server getRouterParam() — NOT decoded by default (raw from radix3). Safe unless {decode:true} passed." },
    { regex: /getQuery\s*\(\s*event\s*\)/g, type: "getQuery(event)", risk: "medium", desc: "Nuxt server getQuery() — decoded query params (ufo library)" },
    { regex: /route\.query\.\w+/g, type: "route.query.*", risk: "high", desc: "Nuxt route.query — decoded by Vue Router parseQuery() (+ stays literal, unlike URLSearchParams)" },
    { regex: /route\.hash/g, type: "route.hash", risk: "high", desc: "Nuxt route.hash — decoded by Vue Router decode()" },
  ],
  angular: [
    { regex: /\.paramMap\.pipe\s*\(/g, type: "paramMap.pipe()", risk: "high", desc: "Angular paramMap.pipe() — Observable emitting fully decoded route params (slashes decoded)" },
    { regex: /\.queryParamMap\.pipe\s*\(/g, type: "queryParamMap.pipe()", risk: "high", desc: "Angular queryParamMap.pipe() — Observable emitting decoded query params" },
    { regex: /paramMap\.get\s*\(\s*["'][^"']+["']\s*\)/g, type: "paramMap.get()", risk: "high", desc: "Angular paramMap.get() — fully decoded including slashes" },
    { regex: /snapshot\.param(?:s|Map)/g, type: "snapshot.paramMap", risk: "high", desc: "Angular route snapshot params — decoded from URL" },
    { regex: /queryParamMap\.get\s*\(\s*["'][^"']+["']\s*\)/g, type: "queryParamMap.get()", risk: "medium", desc: "Angular queryParamMap.get() — decoded query params" },
    { regex: /this\.route\.params/g, type: "this.route.params", risk: "high", desc: "Angular ActivatedRoute params Observable — decoded values" },
    { regex: /\.router\.navigate\s*\(\s*\[/g, type: "router.navigate()", risk: "medium", desc: "Angular router.navigate() — open redirect sink if param-controlled. Also double-encodes % (encoding differential)" },
    { regex: /\.router\.createUrlTree\s*\(/g, type: "router.createUrlTree()", risk: "low", desc: "Angular createUrlTree() — URL construction sink, encodeUriSegment re-encodes %" },
    { regex: /bypassSecurityTrustHtml\s*\(/g, type: "bypassSecurityTrustHtml()", risk: "critical", desc: "Angular bypassSecurityTrustHtml() — disables Angular's HTML sanitizer. CSPT → XSS if response flows through." },
  ],
  sveltekit: [
    { regex: /(?:export\s+(?:async\s+)?function\s+load|load\s*[:=])[\s\S]{0,100}params\.\w+/g, type: "load() params.*", risk: "high", desc: "SvelteKit load() params — decoded via decode_pathname() + decode_params(). %2F → /. Double-encode blocked by %25-split." },
    { regex: /\$page\.params\.\w+/g, type: "$page.params.*", risk: "high", desc: "SvelteKit $page.params — client-side decoded params" },
    { regex: /\$page\.url\.pathname/g, type: "$page.url.pathname", risk: "low", desc: "SvelteKit $page.url.pathname — preserves encoding (safe)" },
    { regex: /\$page\.url\.searchParams/g, type: "$page.url.searchParams", risk: "high", desc: "SvelteKit $page.url.searchParams — standard URLSearchParams auto-decodes" },
    { regex: /url\.searchParams\.get\s*\(/g, type: "url.searchParams.get()", risk: "high", desc: "SvelteKit url.searchParams in load — decoded query params (standard URLSearchParams)" },
    { regex: /params\.path(?!\w)/g, type: "params.path (rest)", risk: "critical", desc: "SvelteKit [...path] rest param — decoded STRING with slashes (not array!)" },
    { regex: /\{@html\s/g, type: "{@html}", risk: "critical", desc: "SvelteKit {@html} — renders raw HTML into DOM. CSPT → XSS if fed by fetch response." },
  ],
  remix: [
    { regex: /useParams\s*\(\s*\)(?!\s*\{)/g, type: "useParams()", risk: "high", desc: "Remix useParams() — shares React Router decode pipeline" },
    { regex: /useSearchParams\s*\(\s*\)(?!\s*\{)/g, type: "useSearchParams()", risk: "high", desc: "Remix useSearchParams() — auto-decoded" },
    { regex: /params\s*\[\s*["']\*["']\s*\]/g, type: 'params["*"] (splat)', risk: "critical", desc: "Remix $.tsx splat — captures full path with decoded slashes" },
    { regex: /(?:loader|action)\s*(?::\s*\w+)?\s*\(\s*\{\s*(?:request\s*,\s*)?params/g, type: "loader/action params", risk: "critical", desc: "Remix loader/action — server-side decoded params (SSRF)" },
  ],
  ember: [
    { regex: /model\s*\(\s*params\s*\)/g, type: "model(params)", risk: "high", desc: "Ember model() hook — params decoded via normalizePath() + findHandler() → decodeURIComponent" },
    { regex: /this\.paramsFor\s*\(/g, type: "this.paramsFor()", risk: "high", desc: "Ember paramsFor() — decoded route params" },
    { regex: /htmlSafe\s*\(/g, type: "htmlSafe()", risk: "critical", desc: "Ember htmlSafe() — marks string as safe HTML, bypasses escaping. CSPT → XSS sink." },
    { regex: /\{\{\{/g, type: "{{{ triple curlies }}}", risk: "critical", desc: "Ember/Handlebars triple curlies — raw HTML rendering, compiles to insertAdjacentHTML. CSPT → XSS sink." },
    { regex: /this\.router\.currentRoute\.params/g, type: "currentRoute.params", risk: "high", desc: "Ember currentRoute.params — decoded from URL" },
  ],
  solidstart: [
    { regex: /useParams\s*\(\s*\)(?!\s*\{)/g, type: "useParams()", risk: "low", desc: "SolidStart useParams() — NOT decoded (%2F stays as %2F, SAFE). Primary CSPT vector is searchParams, not path params." },
    { regex: /useSearchParams\s*\(\s*\)(?!\s*\{)/g, type: "useSearchParams()", risk: "high", desc: "SolidStart useSearchParams() — URLSearchParams auto-decodes (STILL VULNERABLE). Primary CSPT vector in SolidStart." },
    { regex: /['"]use server['"]/g, type: '"use server"', risk: "critical", desc: "SolidStart server function — args serialized via seroval, exact client string passes through JSON RPC boundary unchanged. SSRF if input already decoded." },
    { regex: /innerHTML\s*=\s*\{/g, type: "innerHTML={} (JSX prop)", risk: "critical", desc: "SolidStart innerHTML JSX prop — compiles to element.innerHTML = value. CSPT → XSS sink." },
  ],
  astro: [
    { regex: /Astro\.params\.\w+/g, type: "Astro.params.*", risk: "low", desc: "Astro.params — uses decodeURI (preserves %2F, decodes %2E)" },
    { regex: /Astro\.url\.pathname/g, type: "Astro.url.pathname", risk: "low", desc: "Astro.url.pathname — decoded via decodeURI" },
  ],
};

// API call patterns — fetch/XHR/axios/wrappers with dynamic parameters
// Organized by: direct fetch → wrappers → .concat (Babel) → variable URL →
// URL construction → data hooks → service layers → XHR → Ember
const API_CALL_PATTERNS = [
  // ── Direct fetch: template literal ──
  { regex: /fetch\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "fetch()", risk: "high", desc: "fetch() with interpolated template literal" },
  // ── Direct fetch: string concatenation ──
  { regex: /fetch\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "fetch()", risk: "high", desc: "fetch() with string concatenation" },
  // ── Direct fetch: .concat() (Babel transpiles template literals to this) ──
  { regex: /fetch\s*\(\s*["']([^"']*\/?)["']\s*\.concat\s*\((\w+)/g,
    type: "fetch(.concat())", risk: "high", desc: "fetch() with .concat() — Babel-transpiled template literal" },
  // ── Direct fetch: variable URL (param built elsewhere) ──
  { regex: /fetch\s*\(\s*(\w{1,3})\s*[,)]/g,
    type: "fetch(var)", risk: "medium", desc: "fetch() with short variable URL — likely built from params" },
  // ── Direct fetch: new Request() ──
  { regex: /fetch\s*\(\s*new\s+Request\s*\(/g,
    type: "fetch(new Request())", risk: "medium", desc: "fetch() with dynamically constructed Request object" },

  // ── axios: template literal ──
  { regex: /axios\.\w+\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "axios", risk: "high", desc: "axios with interpolated template literal" },
  // ── axios: concatenation ──
  { regex: /axios\.\w+\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "axios", risk: "high", desc: "axios with string concatenation" },
  // ── axios: .concat() ──
  { regex: /axios\.\w+\s*\(\s*["']([^"']*\/?)["']\s*\.concat\s*\((\w+)/g,
    type: "axios(.concat())", risk: "high", desc: "axios with .concat() — Babel-transpiled" },
  // ── axios: variable URL ──
  { regex: /axios\.\w+\s*\(\s*(\w{1,3})\s*[,)]/g,
    type: "axios(var)", risk: "medium", desc: "axios with variable URL" },
  // ── axios: config object with dynamic url ──
  { regex: /axios\s*\(\s*\{[^}]{0,100}url\s*:\s*`([^`]{0,200})\$\{([^}]+)\}/g,
    type: "axios({url})", risk: "high", desc: "axios config object with interpolated url" },

  // ── XHR: template literal ──
  { regex: /\.open\s*\(\s*["']\w+["']\s*,\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "XHR.open()", risk: "high", desc: "XMLHttpRequest.open() with interpolated URL" },
  // ── XHR: concatenation ──
  { regex: /\.open\s*\(\s*["']\w+["']\s*,\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "XHR.open()", risk: "high", desc: "XMLHttpRequest.open() with string concatenation" },
  // ── XHR: .concat() ──
  { regex: /\.open\s*\(\s*["']\w+["']\s*,\s*["']([^"']*\/?)["']\s*\.concat\s*\((\w+)/g,
    type: "XHR.open(.concat())", risk: "high", desc: "XMLHttpRequest.open() with .concat()" },

  // ── Nuxt: useFetch / $fetch / ofetch ──
  { regex: /useFetch\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "useFetch()", risk: "high", desc: "Nuxt useFetch() with interpolated URL" },
  { regex: /useFetch\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "useFetch()", risk: "high", desc: "Nuxt useFetch() with string concatenation" },
  { regex: /useFetch\s*\(\s*["']([^"']*\/?)["']\s*\.concat\s*\((\w+)/g,
    type: "useFetch(.concat())", risk: "high", desc: "Nuxt useFetch() with .concat()" },
  { regex: /\$fetch\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "$fetch()", risk: "high", desc: "Nuxt $fetch() with interpolated URL" },
  { regex: /\$fetch\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "$fetch()", risk: "high", desc: "Nuxt $fetch() with string concatenation" },
  { regex: /ofetch\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "ofetch()", risk: "high", desc: "ofetch() with interpolated URL" },

  // ── HTTP client methods (.get/.post etc): template literal ──
  { regex: /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "HttpClient", risk: "high", desc: "HTTP client method with interpolated URL" },
  // ── HTTP client methods: concatenation ──
  { regex: /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "HttpClient", risk: "high", desc: "HTTP client method with string concatenation" },
  // ── HTTP client methods: .concat() ──
  { regex: /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*["']([^"']*\/?)["']\s*\.concat\s*\((\w+)/g,
    type: "HttpClient(.concat())", risk: "high", desc: "HTTP client method with .concat()" },
  // ── HTTP client methods: variable URL ──
  { regex: /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*(\w{1,3})\s*[,)]/g,
    type: "HttpClient(var)", risk: "medium", desc: "HTTP client method with variable URL" },

  // ── ky library ──
  { regex: /ky\s*\.(?:get|post|put|delete|patch)\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "ky", risk: "high", desc: "ky HTTP client with interpolated URL" },

  // ── wretch library ──
  { regex: /wretch\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "wretch()", risk: "high", desc: "wretch() with interpolated URL" },

  // ── URL construction → fetch ──
  { regex: /new\s+URL\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "new URL()", risk: "high", desc: "URL constructed with interpolated path — may flow to fetch" },
  { regex: /new\s+URL\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "new URL()", risk: "high", desc: "URL constructed with concatenated path" },
  { regex: /new\s+URL\s*\(\s*["']([^"']*\/?)["']\s*\.concat\s*\((\w+)/g,
    type: "new URL(.concat())", risk: "high", desc: "URL constructed with .concat() path" },

  // ── .replace() URL templates (e.g., '/api/:id'.replace(':id', val)) ──
  { regex: /["'`][^"'`]*\/:[a-zA-Z]+[^"'`]*["'`]\s*\.replace\s*\(\s*["'`]:(\w+)["'`]\s*,\s*(\w+)/g,
    type: ".replace(:param)", risk: "high", desc: "URL template with .replace(':param', value)" },

  // ── TanStack / React Query: queryFn containing fetch ──
  { regex: /queryFn\s*:\s*(?:async\s*)?\(\s*\)\s*=>\s*(?:{\s*)?(?:.*?return\s+)?fetch\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}/g,
    type: "useQuery queryFn", risk: "high", desc: "TanStack/React Query queryFn with dynamic fetch" },
  { regex: /queryFn\s*:\s*(?:async\s*)?\(\s*\)\s*=>\s*(?:{\s*)?(?:.*?return\s+)?fetch\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "useQuery queryFn", risk: "high", desc: "TanStack/React Query queryFn with concatenated fetch" },
  // ── SWR: key is the URL, fetcher uses it ──
  { regex: /useSWR\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "useSWR()", risk: "high", desc: "SWR with interpolated key URL — key IS the fetch URL" },
  { regex: /useSWR\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "useSWR()", risk: "high", desc: "SWR with concatenated key URL" },

  // ── Minified service layer: short var.get(`/api/${x}`) ──
  { regex: /\w{1,3}\.(?:get|post|put|delete|patch|request|send|fetch)\s*\(\s*`([^`]{0,200})\$\{([^}]+)\}[^`]*`/g,
    type: "service.method()", risk: "medium", desc: "Minified service/client method with interpolated URL" },
  // ── Minified service layer: short var.get('/api/' + x) ──
  { regex: /\w{1,3}\.(?:get|post|put|delete|patch|request|send|fetch)\s*\(\s*["']([^"']*\/?)["']\s*\+\s*(\w+)/g,
    type: "service.method()", risk: "medium", desc: "Minified service/client method with concatenated URL" },
  // ── Minified service layer: .concat() ──
  { regex: /\w{1,3}\.(?:get|post|put|delete|patch|request|send|fetch)\s*\(\s*["']([^"']*\/?)["']\s*\.concat\s*\((\w+)/g,
    type: "service.method(.concat())", risk: "medium", desc: "Minified service/client with .concat()" },

  // ── SolidStart createResource → fetch ──
  { regex: /createResource\s*\(\s*(?:\(\s*\)|_|[\w,\s{}]+)\s*=>\s*fetch\s*\(\s*`[^`]*\$\{/g,
    type: "createResource+fetch", risk: "high", desc: "SolidStart createResource with dynamic fetch" },

  // ── Ember Data store ──
  { regex: /(?:store|this\.store)\.find(?:Record|All)\s*\(\s*["'][^"']+["']\s*,\s*\w+/g,
    type: "Ember Data", risk: "medium", desc: "Ember Data store.findRecord/findAll with dynamic ID" },

  // ── GraphQL fetch (dynamic query variables) ──
  { regex: /fetch\s*\(\s*["'`][^"'`]*graphql[^"'`]*["'`]\s*,\s*\{[^}]*body\s*:/g,
    type: "GraphQL fetch", risk: "medium", desc: "fetch() to GraphQL endpoint with dynamic body" },
];

// For HTML content, check if a match position is inside a <script> block
function isInsideScriptTag(body, index) {
  // Find the last <script before this index
  const before = body.substring(0, index);
  const lastScriptOpen = before.lastIndexOf("<script");
  if (lastScriptOpen === -1) return false;
  const lastScriptClose = before.lastIndexOf("</script");
  // If the last <script> open is after the last </script> close, we're inside a script
  return lastScriptOpen > lastScriptClose;
}

// Check if a dangerouslySetInnerHTML match is a Next.js framework internal (not app code)
function isFrameworkInternalDSIH(body, matchIndex) {
  // Next.js uses dangerouslySetInnerHTML:{__html:this.rootHtml} in its HTML renderer
  // Also skip matches in _next/static framework chunks that are root-level rendering
  const region = body.substring(matchIndex, Math.min(body.length, matchIndex + 200));
  return /this\.rootHtml/.test(region) || /this\.props\.assetPrefix/.test(region);
}

// Check if a match is inside a Next.js RSC Flight payload (serialized component data).
// RSC payloads appear in HTML as: <script>self.__next_f.push([1,"...serialized..."])</script>
// Text like "await params" inside RSC data is UI content (e.g., <code> element text),
// NOT actual executable code. These are false positives.
function isInsideRscPayload(body, index) {
  // Look backwards from the match for the RSC push marker
  const searchStart = Math.max(0, index - 2000);
  const before = body.substring(searchStart, index);
  const rscPush = before.lastIndexOf("self.__next_f.push(");
  if (rscPush === -1) return false;
  // Make sure there's no </script> between the RSC push and our match
  const afterPush = before.substring(rscPush);
  if (afterPush.includes("</script")) return false;
  return true;
}

// Check if a match is inside serialized JSON string content (RSC children, props, etc.)
// Looks for patterns like \"children\":\"...match...\" or \"children\":[[...\"match\"...
function isRscSerializedText(body, index) {
  // Check ~200 chars before the match for RSC serialization markers
  const lookback = body.substring(Math.max(0, index - 200), index);
  // RSC children pattern: \"children\" followed by serialized content
  if (/\\?"children\\?"\s*:\s*/.test(lookback)) return true;
  // RSC element pattern: ["$","code",null,{...}] — match is inside element props
  if (/\[\\?"\$\\?",\\?"(?:code|pre|span)\\?"/.test(lookback)) return true;
  return false;
}

// Check if a match is inside a string literal — e.g., {children:"await params"}
// in compiled JSX. The actual code `await params` is never inside quotes;
// string literals containing "await params" are always UI display text.
function isInsideStringLiteral(body, index, matchLength) {
  // Check the character immediately before and after the match
  const charBefore = index > 0 ? body[index - 1] : "";
  const charAfter = index + matchLength < body.length ? body[index + matchLength] : "";
  // Direct quote wrapping: "await params" or 'await params'
  if ((charBefore === '"' && charAfter === '"') || (charBefore === "'" && charAfter === "'")) return true;
  // Escaped quote wrapping in JSON: \"await params\"
  if (index >= 2 && body[index - 2] === '\\' && charBefore === '"') return true;
  // Check if we're inside a quoted string context (match is mid-string, not at boundary).
  // Look backwards for an unmatched opening quote. For compiled JSX like {children:"await params text"},
  // the match "await params" starts after a " but doesn't end at a ".
  const lookback = body.substring(Math.max(0, index - 150), index);
  // Property-value context: key:"...match..." — find opening quote with no close before us
  // Match patterns like: children:" or label:" or text:" followed by content up to our position
  if (/(?:children|label|text|title|description|placeholder|message|content|value|alt|aria-label)\s*:\s*["'][^"']*$/.test(lookback)) return true;
  // Generic: inside a double-quoted string — look for an unclosed " before us
  // Count unescaped quotes backwards; odd count means we're inside a string
  const nearContext = body.substring(Math.max(0, index - 80), index);
  const quotesInContext = nearContext.split(/(?<!\\)"/).length - 1;
  // If we're after an odd number of quotes and the char before the match region starts with a quote context
  if (quotesInContext % 2 === 1 && /["'][^"']*$/.test(nearContext)) {
    // Verify the string extends past our match
    const afterMatch = body.substring(index + matchLength, Math.min(body.length, index + matchLength + 80));
    if (/^[^"']*["']/.test(afterMatch)) return true;
  }
  // Angular compiled template: i0.ɵɵtext(N, "...match...") or i0.ɵɵdomElementStart(...)
  // These are rendered UI text, not executable code. Look back for ɵɵtext or ɵɵdom patterns.
  if (/\u0275\u0275(?:text|domElement)\s*\([^)]*,\s*["'][^"']*$/.test(lookback)) return true;
  // Also catch HTML template strings in Angular compiled output (template: `<code>paramMap.get(...)</code>`)
  if (/template\s*:\s*(?:function\s+\w+_Template|`[^`]*$)/.test(lookback)) return true;
  // Angular dev mode: ɵsetClassMetadata(..., template: `<html>...`) — raw HTML in backtick
  // Use a wider lookback for this since the template can be very long
  const wideLookback = body.substring(Math.max(0, index - 2000), index);
  if (/\u0275setClassMetadata\s*\([^)]*template\s*:\s*`[^`]*$/s.test(wideLookback)) return true;
  // Generic: match is inside an HTML tag context (<code>match</code>) within a backtick string
  if (/`[^`]*<(?:code|pre|span|td|p)[^>]*>[^`]*$/.test(lookback)) return true;
  return false;
}

DoctorScan.analyzeParamSources = function(body, framework, sourceUrl, contentType) {
  const results = [];
  const seen = new Set();
  const isHtml = contentType === "html" || sourceUrl === "page";

  const fwPatterns = PARAM_SOURCE_PATTERNS[framework] || [];
  // Also check related frameworks (e.g., nuxt includes vue-router patterns)
  const relatedPatterns = [];
  if (framework === "nuxt") {
    relatedPatterns.push(...(PARAM_SOURCE_PATTERNS["vue-router"] || []));
  }
  if (framework === "remix") {
    relatedPatterns.push(...(PARAM_SOURCE_PATTERNS["react-router"] || []));
  }

  const allPatterns = [...fwPatterns, ...relatedPatterns];

  for (const pattern of allPatterns) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(body)) !== null) {
      const key = `${pattern.type}|${match.index}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Skip matches in HTML text content (not inside <script> tags)
      // These are false positives from rendered page content mentioning code patterns
      if (isHtml && !isInsideScriptTag(body, match.index)) continue;

      // Skip matches inside RSC Flight payloads — these are serialized UI text
      // (e.g., <code>await params</code> rendered as element children), not actual code.
      // Server component code never ships to the client.
      if (isInsideRscPayload(body, match.index) && isRscSerializedText(body, match.index)) continue;

      // Skip matches inside string literals — compiled JSX like {children:"await params"}
      // is UI display text, not executable code. Real `await params` is never inside quotes.
      if (isInsideStringLiteral(body, match.index, match[0].length)) continue;

      // Skip Next.js framework-internal dangerouslySetInnerHTML (root HTML renderer)
      if (pattern.type === "dangerouslySetInnerHTML" && isFrameworkInternalDSIH(body, match.index)) continue;

      const pos = getLineAndColumn(body, match.index);
      results.push({
        type: pattern.type,
        risk: pattern.risk,
        desc: pattern.desc,
        source: sourceUrl,
        framework,
        matchText: match[0].substring(0, 120),
        lineContext: extractContext(body, match.index, match[0].length),
        lineNumber: pos.line,
        columnNumber: pos.column,
      });
    }
  }

  return results;
};

DoctorScan.analyzeApiCalls = function(body, framework, sourceUrl) {
  const results = [];
  const seen = new Set();

  for (const pattern of API_CALL_PATTERNS) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(body)) !== null) {
      const key = `${pattern.type}|${match.index}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const pos = getLineAndColumn(body, match.index);
      // Look for response processing after this call
      const respProcessing = findResponseProcessing(body, match.index + match[0].length);

      results.push({
        type: pattern.type,
        risk: pattern.risk,
        desc: pattern.desc,
        source: sourceUrl,
        framework,
        matchText: match[0].substring(0, 200),
        lineContext: extractContext(body, match.index, match[0].length),
        lineNumber: pos.line,
        columnNumber: pos.column,
        responseProcessing: respProcessing,
        // Extract the URL pattern if available
        urlPattern: match[1] ? match[1].substring(0, 100) : null,
        dynamicVar: match[2] ? match[2].substring(0, 60) : null,
      });
    }
  }

  return results;
};

// ============================================================
// Main analysis function (original — kept for combined source→sink chains)
// ============================================================

DoctorScan.analyzeSources = function(body, framework, sourceUrl) {
  const sources = [];
  const seen = new Set();

  const addSource = (src) => {
    const key = `${src.type}|${src.lineContext.substring(0, 80)}`;
    if (!seen.has(key)) {
      seen.add(key);
      sources.push(src);
    }
  };

  // Universal patterns
  for (const pattern of CSPT_SOURCES.universal) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(body)) !== null) {
      // Skip matches inside RSC Flight payloads (serialized UI text, not code)
      if (isInsideRscPayload(body, match.index) && isRscSerializedText(body, match.index)) continue;
      // Skip matches inside string literals (compiled JSX UI text like {children:"await params"})
      if (isInsideStringLiteral(body, match.index, match[0].length)) continue;
      const pos = getSourceAndFetchLines(body, match.index, match[0]);
      addSource({
        pattern: match[0].substring(0, 200),
        type: pattern.type,
        risk: pattern.risk,
        sourceDesc: pattern.sourceDesc,
        sinkDesc: pattern.sinkDesc,
        source: sourceUrl,
        framework,
        lineContext: extractContext(body, match.index, match[0].length),
        sourceLineNumber: pos.sourceLineNumber,
        sourceColumnNumber: pos.sourceColumnNumber,
        sinkLineNumber: pos.sinkLineNumber,
        sinkColumnNumber: pos.sinkColumnNumber,
        responseProcessing: findResponseProcessing(body, match.index + match[0].length),
      });
    }
  }

  // Framework-specific patterns
  const fwPatterns = CSPT_SOURCES[framework] || [];
  for (const pattern of fwPatterns) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(body)) !== null) {
      // Skip matches inside RSC Flight payloads (serialized UI text, not code)
      if (isInsideRscPayload(body, match.index) && isRscSerializedText(body, match.index)) continue;
      // Skip matches inside string literals (compiled JSX UI text)
      if (isInsideStringLiteral(body, match.index, match[0].length)) continue;
      const pos = getSourceAndFetchLines(body, match.index, match[0]);
      addSource({
        pattern: match[0].substring(0, 200),
        type: pattern.type,
        risk: pattern.risk,
        sourceDesc: pattern.sourceDesc,
        sinkDesc: pattern.sinkDesc,
        source: sourceUrl,
        framework,
        lineContext: extractContext(body, match.index, match[0].length),
        sourceLineNumber: pos.sourceLineNumber,
        sourceColumnNumber: pos.sourceColumnNumber,
        sinkLineNumber: pos.sinkLineNumber,
        sinkColumnNumber: pos.sinkColumnNumber,
        responseProcessing: findResponseProcessing(body, match.index + match[0].length),
      });
    }
  }

  return sources;
};

// ============================================================
// Runtime CSPT Monitor
// Hooks fetch/XHR in the inspected page to detect live
// param-to-fetch flows at runtime. Inject via eval().
// ============================================================

DoctorScan.RUNTIME_HOOK = `(function(){
  if(window.__doctorscan)return JSON.stringify({status:'already_hooked',count:window.__doctorscan.sources.length});
  window.__doctorscan={sources:[],hooked:true};
  var segments=location.pathname.split('/').filter(function(s){return s.length>2});
  var origFetch=window.fetch;
  window.fetch=function(input){
    try{
      var url=typeof input==='string'?input:(input instanceof Request?input.url:String(input));
      for(var i=0;i<segments.length;i++){
        var seg=segments[i];
        if(url.indexOf(seg)>-1){
          var stack='';try{stack=new Error().stack.split('\\n').slice(1,6).join('\\n')}catch(e){}
          window.__doctorscan.sources.push({
            type:'fetch',url:url.substring(0,500),
            segment:seg,pageUrl:location.href,
            stack:stack,time:Date.now()
          });
          break;
        }
      }
    }catch(e){}
    return origFetch.apply(this,arguments);
  };
  var origOpen=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(method,url){
    try{
      var u=String(url);
      for(var i=0;i<segments.length;i++){
        var seg=segments[i];
        if(u.indexOf(seg)>-1){
          var stack='';try{stack=new Error().stack.split('\\n').slice(1,6).join('\\n')}catch(e){}
          window.__doctorscan.sources.push({
            type:'xhr',url:u.substring(0,500),
            segment:seg,pageUrl:location.href,
            stack:stack,time:Date.now()
          });
          break;
        }
      }
    }catch(e){}
    return origOpen.apply(this,arguments);
  };
  return JSON.stringify({status:'hooked',segments:segments});
})()`;

DoctorScan.RUNTIME_POLL = `(function(){
  if(!window.__doctorscan)return '[]';
  var s=JSON.stringify(window.__doctorscan.sources);
  window.__doctorscan.sources=[];
  return s;
})()`;
