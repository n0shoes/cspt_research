#!/usr/bin/env node
// Test harness for CSPT DevTools Extension regex patterns
// Verifies all source/sink detection works against known patterns from research
// including minified code, blog examples, and real-world framework output.

// Load the modules by evaluating them (they attach to window/DoctorScan)
const fs = require("fs");
const path = require("path");

// Simulate browser global
globalThis.window = globalThis;
globalThis.DoctorScan = {};

// Load all modules
eval(fs.readFileSync(path.join(__dirname, "src/core/encoding-data.js"), "utf8"));
eval(fs.readFileSync(path.join(__dirname, "src/core/framework-detector.js"), "utf8"));
eval(fs.readFileSync(path.join(__dirname, "src/core/path-extractor.js"), "utf8"));
eval(fs.readFileSync(path.join(__dirname, "src/core/cspt-analyzer.js"), "utf8"));

let passed = 0;
let failed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
  } catch (e) {
    failed++;
    console.error(`FAIL: ${name}`);
    console.error(`  ${e.message}`);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || "Assertion failed");
}

function assertMatch(regex, text, msg) {
  regex.lastIndex = 0;
  assert(regex.test(text), msg || `Expected regex ${regex} to match: ${text.substring(0, 100)}`);
}

function assertNoMatch(regex, text, msg) {
  regex.lastIndex = 0;
  assert(!regex.test(text), msg || `Expected regex ${regex} NOT to match: ${text.substring(0, 100)}`);
}

function assertFinds(analyzerFn, body, framework, sourceUrl, expectedType) {
  const results = analyzerFn(body, framework, sourceUrl);
  const found = results.find(r => r.type === expectedType);
  assert(found, `Expected to find type="${expectedType}" in ${framework} scan of: ${body.substring(0, 80)}...`);
  return found;
}

// analyzeParamSources has 4 params: (body, framework, sourceUrl, contentType)
function assertParamFinds(body, framework, sourceUrl, contentType, expectedType) {
  const results = DoctorScan.analyzeParamSources(body, framework, sourceUrl, contentType);
  const found = results.find(r => r.type === expectedType);
  assert(found, `Expected to find type="${expectedType}" in ${framework} param scan of: ${body.substring(0, 80)}...`);
  return found;
}

function assertParamNotFinds(body, framework, sourceUrl, contentType, unwantedType) {
  const results = DoctorScan.analyzeParamSources(body, framework, sourceUrl, contentType);
  const found = results.find(r => r.type === unwantedType);
  assert(!found, `Expected NOT to find type="${unwantedType}" in ${framework} param scan`);
}

function assertNotFinds(analyzerFn, body, framework, sourceUrl, unwantedType) {
  const results = analyzerFn(body, framework, sourceUrl);
  const found = results.find(r => r.type === unwantedType);
  assert(!found, `Expected NOT to find type="${unwantedType}" in ${framework} scan`);
}

console.log("=== CSPT DevTools Extension Regex Test Suite ===\n");

// ============================================================
// SECTION 1: RESPONSE_INDICATORS — XSS Sinks
// ============================================================
console.log("--- XSS Sink Detection ---");

test("detects dangerouslySetInnerHTML", () => {
  const results = DoctorScan.analyzeSources(
    'fetch(`/api/data/${id}`).then(r=>r.text()).then(h=>setHtml(h)); <div dangerouslySetInnerHTML={{__html: html}} />',
    "react-router", "test.js"
  );
  const resp = results[0]?.responseProcessing;
  assert(resp?.some(r => r.type === "dangerouslySetInnerHTML"), "Should find dangerouslySetInnerHTML in response processing");
});

test("detects v-html directive", () => {
  const results = DoctorScan.analyzeSources(
    'fetch(`/api/widgets/${widget}`).then(r=>r.json()).then(d=>{html.value=d.body}); <div v-html="html" />',
    "vue-router", "test.js"
  );
  const resp = results[0]?.responseProcessing;
  assert(resp?.some(r => r.type === "v-html"), "Should find v-html in response processing");
});

test("detects SvelteKit {@html} directive", () => {
  const results = DoctorScan.analyzeSources(
    'fetch(`/api/content/${id}`).then(r=>r.text()).then(t=>{content=t}); {@html content}',
    "sveltekit", "test.js"
  );
  const resp = results[0]?.responseProcessing;
  assert(resp?.some(r => r.type === "@html"), "Should find @html in response processing");
});

test("detects Angular bypassSecurityTrustHtml", () => {
  const results = DoctorScan.analyzeSources(
    'fetch(`/api/content/${id}`).then(r=>r.text()).then(h=>{this.safe=this.sanitizer.bypassSecurityTrustHtml(h)})',
    "angular", "test.js"
  );
  const resp = results[0]?.responseProcessing;
  assert(resp?.some(r => r.type === "bypassSecurityTrustHtml"), "Should find bypassSecurityTrustHtml in response processing");
});

test("detects Ember triple curlies {{{", () => {
  const results = DoctorScan.analyzeSources(
    'fetch(`/api/data/${id}`).then(r=>r.text()).then(t=>{this.set("content",t)}); {{{this.content}}}',
    "ember", "test.js"
  );
  const resp = results[0]?.responseProcessing;
  assert(resp?.some(r => r.type === "triple-curlies"), "Should find triple curlies in response processing");
});

test("detects Ember htmlSafe()", () => {
  const results = DoctorScan.analyzeSources(
    'fetch(`/api/data/${id}`).then(r=>r.text()).then(t=>{this.set("content",htmlSafe(t))})',
    "ember", "test.js"
  );
  const resp = results[0]?.responseProcessing;
  assert(resp?.some(r => r.type === "htmlSafe"), "Should find htmlSafe in response processing");
});

test("detects insertAdjacentHTML", () => {
  const results = DoctorScan.analyzeSources(
    "fetch(`/api/data/${id}`).then(r=>r.text()).then(t=>{el.insertAdjacentHTML('beforeend',t)})",
    "react-router", "test.js"
  );
  const resp = results[0]?.responseProcessing;
  assert(resp?.some(r => r.type === "insertAdjacentHTML"), "Should find insertAdjacentHTML");
});

// ============================================================
// SECTION 2: CSPT_SOURCES — Source-to-Sink Chains
// ============================================================
console.log("\n--- Source-to-Sink Chain Detection ---");

// React Router
test("React: useParams() → fetch template literal", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const {userId} = useParams(); const res = await fetch(`/api/users/${userId}/profile`);',
    "react-router", "app.js", "useParams-to-fetch");
});

test("React: useParams() → fetch concat", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const {id} = useParams(); fetch("/api/users/" + id)',
    "react-router", "app.js", "useParams-to-fetch-concat");
});

test("React: splat params[*] → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const filePath = params["*"]; fetch(`/api/files/${filePath}`)',
    "react-router", "app.js", "splat-to-fetch");
});

test("React: searchParams.get() → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const widget = searchParams.get("widget"); fetch(`/api/widgets/${widget}`)',
    "react-router", "app.js", "searchParams-to-fetch");
});

// Next.js
test("Next.js: route handler params → fetch (SSRF)", () => {
  assertFinds(DoctorScan.analyzeSources,
    'export async function GET(request, { params }) { const { path } = await params; return fetch(`https://backend.internal/${path.join("/")}`) }',
    "nextjs", "route.ts", "route-handler-params-to-fetch");
});

test("Next.js: useSearchParams → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const searchParams = useSearchParams(); const widget = searchParams.get("w"); fetch(`/api/w/${widget}`)',
    "nextjs", "page.tsx", "next-useSearchParams-to-fetch");
});

test("Next.js: hash → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const hash = window.location.hash.slice(1); fetch(`/api${hash}`)',
    "nextjs", "page.tsx", "next-hash-to-fetch");
});

test("Next.js: GSSP params → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'export async function getServerSideProps({ params }) { const res = await fetch(`http://internal/${params.id}`) }',
    "nextjs", "page.tsx", "gssp-params-to-fetch");
});

// Vue Router
test("Vue: route.params → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const id = route.params.userId; fetch(`/api/users/${id}`)',
    "vue-router", "app.js", "vue-params-to-fetch");
});

test("Vue: route.params in template → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'useFetch(`/api/products/${route.params.productId}`)',
    "vue-router", "app.js", "vue-params-template-fetch");
});

test("Vue: route.params.pathMatch → fetch (catch-all)", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const segments = route.params.pathMatch; useFetch(`/api/files/${segments.join("/")}`)',
    "vue-router", "app.js", "vue-catchall-to-fetch");
});

test("Vue: route.query → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const widget = route.query.widget; fetch(`/api/widgets/${widget}`)',
    "vue-router", "app.js", "vue-query-to-fetch");
});

test("Vue: route.query in template → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'useFetch(`/api/widgets/${route.query.widget}`)',
    "vue-router", "app.js", "vue-query-template-fetch");
});

test("Vue: route.hash → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const h = route.hash; fetch(`/api${h}`)',
    "vue-router", "app.js", "vue-hash-to-fetch");
});

// Nuxt
test("Nuxt: useFetch with params", () => {
  assertFinds(DoctorScan.analyzeSources,
    'useFetch(`/api/users/${route.params.id}`)',
    "nuxt", "page.vue", "nuxt-useFetch-params");
});

test("Nuxt: $fetch with params", () => {
  assertFinds(DoctorScan.analyzeSources,
    '$fetch(`/api/users/${params.id}/profile`)',
    "nuxt", "page.vue", "nuxt-fetch-params");
});

test("Nuxt: getRouterParam({decode:true}) → fetch (SSRF)", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const id = getRouterParam(event, "id", { decode: true }); return $fetch(`https://internal/${id}`)',
    "nuxt", "server.ts", "nuxt-server-param-decoded-to-fetch");
});

test("Nuxt: route.query → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const widget = route.query.widget; useFetch(`/api/widgets/${widget}`)',
    "nuxt", "page.vue", "nuxt-query-to-fetch");
});

test("Nuxt: route.hash → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const h = route.hash; $fetch(`/api${h}`)',
    "nuxt", "page.vue", "nuxt-hash-to-fetch");
});

// Angular
test("Angular: paramMap.pipe → http.get", () => {
  assertFinds(DoctorScan.analyzeSources,
    'this.route.paramMap.pipe(switchMap(params => { const id = params.get("userId"); return this.http.get(`/api/users/${id}`) }))',
    "angular", "component.ts", "angular-paramMap-pipe-to-http");
});

test("Angular: paramMap.get → http.get", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const id = paramMap.get("userId"); this.http.get(`/api/users/${id}`)',
    "angular", "component.ts", "angular-paramMap-to-http");
});

test("Angular: http.get with template literal", () => {
  assertFinds(DoctorScan.analyzeSources,
    'this.http.get(`/api/users/${userId}/profile`)',
    "angular", "component.ts", "angular-http-template");
});

test("Angular: queryParamMap → navigate (open redirect)", () => {
  assertFinds(DoctorScan.analyzeSources,
    'this.route.queryParamMap.pipe(switchMap(p => { const r = p.get("redirect"); this.router.navigate([r]) }))',
    "angular", "component.ts", "angular-param-to-navigate");
});

// SvelteKit
test("SvelteKit: params → fetch in load", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const dataId = params.dataId; const res = await fetch(`http://internal/${dataId}`)',
    "sveltekit", "+page.server.ts", "sveltekit-params-to-fetch");
});

test("SvelteKit: $page.params → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const id = $page.params.userId; fetch(`/api/users/${id}`)',
    "sveltekit", "+page.svelte", "sveltekit-page-params-to-fetch");
});

test("SvelteKit: params.path (rest) → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const p = params.path; fetch(`/api/files/${p}`)',
    "sveltekit", "+page.ts", "sveltekit-rest-to-fetch");
});

// Ember
test("Ember: model(params) → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'model(params) { return fetch(`/api/users/${params.user_id}`).then(r => r.json()) }',
    "ember", "route.js", "ember-model-params-to-fetch");
});

test("Ember: store.findRecord with params", () => {
  assertFinds(DoctorScan.analyzeSources,
    'this.store.findRecord("user", params.user_id)',
    "ember", "route.js", "ember-data-params");
});

// SolidStart
test("SolidStart: useParams → createResource → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const params = useParams(); const [user] = createResource(() => params.userId, async (id) => { const res = await fetch(`/api/users/${id}`) })',
    "solidstart", "page.tsx", "solid-params-resource-fetch");
});

test("SolidStart: 'use server' → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    '"use server"; const res = await fetch(`http://internal/${dataId}`)',
    "solidstart", "page.tsx", "solid-server-function-fetch");
});

// ============================================================
// SECTION 3: PARAM_SOURCE_PATTERNS — Standalone Source Detection
// ============================================================
console.log("\n--- Standalone Param Source Detection ---");

// React Router sources
test("React: detects useParams()", () => {
  assertParamFinds('const {id} = useParams(); doSomething(id);', "react-router", "app.js", "js", "useParams()");
});

test("React: detects splat params[*]", () => {
  assertParamFinds('const path = params["*"];', "react-router", "app.js", "js", 'params["*"] (splat)');
});

test("React: detects useSearchParams()", () => {
  assertParamFinds('const [sp] = useSearchParams(); const q = sp.get("q");', "react-router", "app.js", "js", "useSearchParams()");
});

// Next.js sources
test("Next.js: detects useSearchParams() as high risk", () => {
  const r = assertParamFinds('const sp = useSearchParams(); sp.get("w");', "nextjs", "page.tsx", "js", "useSearchParams()");
  assert(r.risk === "high", `Expected high risk, got ${r.risk}`);
});

test("Next.js: detects useParams() as low risk", () => {
  const r = assertParamFinds('const p = useParams(); const id = p.id;', "nextjs", "page.tsx", "js", "useParams()");
  assert(r.risk === "low", `Expected low risk, got ${r.risk}`);
});

test("Next.js: detects dangerouslySetInnerHTML as source", () => {
  assertParamFinds('dangerouslySetInnerHTML: { __html: content }', "nextjs", "page.tsx", "js", "dangerouslySetInnerHTML");
});

test("Next.js: detects location.hash", () => {
  assertParamFinds('const h = window.location.hash.slice(1);', "nextjs", "page.tsx", "js", "location.hash");
});

// Vue Router sources
test("Vue: detects route.params.* as high risk", () => {
  const r = assertParamFinds('const id = route.params.userId;', "vue-router", "app.js", "js", "route.params.*");
  assert(r.risk === "high", `Expected high risk, got ${r.risk}`);
});

test("Vue: detects route.path as low risk (safe)", () => {
  const r = assertParamFinds('const p = route.path;', "vue-router", "app.js", "js", "route.path");
  assert(r.risk === "low", `Expected low risk, got ${r.risk}`);
});

test("Vue: detects route.query.*", () => {
  assertParamFinds('const w = route.query.widget;', "vue-router", "app.js", "js", "route.query.*");
});

test("Vue: detects route.params.pathMatch (catch-all)", () => {
  assertParamFinds('const segs = route.params.pathMatch;', "vue-router", "app.js", "js", "route.params.pathMatch (catch-all)");
});

test("Vue: detects route.hash", () => {
  assertParamFinds('const h = route.hash;', "vue-router", "app.js", "js", "route.hash");
});

// Nuxt sources
test("Nuxt: detects getRouterParam({decode:true}) as critical", () => {
  const r = assertParamFinds('const id = getRouterParam(event, "id", { decode: true });', "nuxt", "server.ts", "js", "getRouterParam({decode:true})");
  assert(r.risk === "critical", `Expected critical risk, got ${r.risk}`);
});

test("Nuxt: detects getRouterParam() default as low", () => {
  const r = assertParamFinds('const id = getRouterParam(event, "id");', "nuxt", "server.ts", "js", "getRouterParam()");
  assert(r.risk === "low", `Expected low risk, got ${r.risk}`);
});

test("Nuxt: detects route.query.* (inherits from Vue)", () => {
  assertParamFinds('const w = route.query.widget;', "nuxt", "page.vue", "js", "route.query.*");
});

test("Nuxt: detects route.hash", () => {
  assertParamFinds('const h = route.hash;', "nuxt", "page.vue", "js", "route.hash");
});

// Angular sources
test("Angular: detects paramMap.get()", () => {
  assertParamFinds('const id = paramMap.get("userId");', "angular", "comp.ts", "js", "paramMap.get()");
});

test("Angular: detects paramMap.pipe()", () => {
  assertParamFinds('this.route.paramMap.pipe(switchMap(p => {}))', "angular", "comp.ts", "js", "paramMap.pipe()");
});

test("Angular: detects bypassSecurityTrustHtml()", () => {
  assertParamFinds('this.safe = this.sanitizer.bypassSecurityTrustHtml(html);', "angular", "comp.ts", "js", "bypassSecurityTrustHtml()");
});

test("Angular: detects router.navigate()", () => {
  assertParamFinds('this.router.navigate([redirect]);', "angular", "comp.ts", "js", "router.navigate()");
});

// SvelteKit sources
test("SvelteKit: detects $page.url.searchParams", () => {
  assertParamFinds('const w = $page.url.searchParams.get("widget");', "sveltekit", "+page.svelte", "js", "$page.url.searchParams");
});

test("SvelteKit: detects {@html} as critical", () => {
  const r = assertParamFinds('{@html content}', "sveltekit", "+page.svelte", "js", "{@html}");
  assert(r.risk === "critical", `Expected critical risk, got ${r.risk}`);
});

test("SvelteKit: detects params.path (rest)", () => {
  assertParamFinds('const p = params.path;', "sveltekit", "+page.ts", "js", "params.path (rest)");
});

// Ember sources
test("Ember: detects model(params)", () => {
  assertParamFinds('model(params) { return this.store.findRecord("user", params.user_id) }', "ember", "route.js", "js", "model(params)");
});

test("Ember: detects htmlSafe() as critical", () => {
  const r = assertParamFinds('const safe = htmlSafe(content);', "ember", "comp.js", "js", "htmlSafe()");
  assert(r.risk === "critical", `Expected critical risk, got ${r.risk}`);
});

test("Ember: detects triple curlies as critical", () => {
  const r = assertParamFinds('{{{this.model.content}}}', "ember", "template.hbs", "js", "{{{ triple curlies }}}");
  assert(r.risk === "critical", `Expected critical risk, got ${r.risk}`);
});

// SolidStart sources
test("SolidStart: detects useParams() as low risk", () => {
  const r = assertParamFinds('const p = useParams(); doStuff(p.id);', "solidstart", "page.tsx", "js", "useParams()");
  assert(r.risk === "low", `Expected low risk, got ${r.risk}`);
});

test("SolidStart: detects useSearchParams() as high risk", () => {
  const r = assertParamFinds('const [sp] = useSearchParams(); sp.source;', "solidstart", "page.tsx", "js", "useSearchParams()");
  assert(r.risk === "high", `Expected high risk, got ${r.risk}`);
});

test("SolidStart: detects innerHTML={} JSX prop as critical", () => {
  const r = assertParamFinds('<div innerHTML={ stats() } />', "solidstart", "page.tsx", "js", "innerHTML={} (JSX prop)");
  assert(r.risk === "critical", `Expected critical risk, got ${r.risk}`);
});

// ============================================================
// SECTION 4: API_CALL_PATTERNS — Sink Detection
// ============================================================
console.log("\n--- API Call / Sink Detection ---");

test("detects fetch with template literal", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'fetch(`/api/users/${userId}/profile`)', "react-router", "app.js", "fetch()");
});

test("detects fetch with concat", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'fetch("/api/users/" + userId)', "react-router", "app.js", "fetch()");
});

test("detects fetch with .concat() (Babel)", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'fetch("/api/users/".concat(userId))', "react-router", "app.js", "fetch(.concat())");
});

test("detects fetch with short variable", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'fetch(u)', "react-router", "app.js", "fetch(var)");
});

test("detects axios template literal", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'axios.get(`/api/users/${id}`)', "react-router", "app.js", "axios");
});

test("detects axios concat", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'axios.get("/api/users/" + id)', "react-router", "app.js", "axios");
});

test("detects axios .concat()", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'axios.get("/api/users/".concat(id))', "react-router", "app.js", "axios(.concat())");
});

test("detects XHR.open template literal", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'xhr.open("GET", `/api/users/${id}`)', "react-router", "app.js", "XHR.open()");
});

test("detects XHR.open .concat()", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'xhr.open("GET", "/api/users/".concat(id))', "react-router", "app.js", "XHR.open(.concat())");
});

test("detects useFetch template literal", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'useFetch(`/api/users/${id}`)', "nuxt", "page.vue", "useFetch()");
});

test("detects useFetch .concat()", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'useFetch("/api/users/".concat(id))', "nuxt", "page.vue", "useFetch(.concat())");
});

test("detects $fetch template literal", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    '$fetch(`/api/users/${id}`)', "nuxt", "page.vue", "$fetch()");
});

test("detects HttpClient template literal", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'this.http.get(`/api/users/${id}`)', "angular", "comp.ts", "HttpClient");
});

test("detects HttpClient .concat()", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'this.http.get("/api/users/".concat(id))', "angular", "comp.ts", "HttpClient(.concat())");
});

test("detects minified service.method()", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'e.get(`/api/users/${id}`)', "angular", "comp.ts", "service.method()");
});

test("detects minified service.method() concat", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'e.get("/api/users/" + id)', "angular", "comp.ts", "service.method()");
});

test("detects minified service.method() .concat()", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'e.get("/api/users/".concat(id))', "angular", "comp.ts", "service.method(.concat())");
});

test("detects useSWR with template literal", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'useSWR(`/api/users/${id}`, fetcher)', "react-router", "app.js", "useSWR()");
});

test("detects URL template .replace(:param)", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    "'/api/users/:userId/profile'.replace(':userId', id)", "react-router", "app.js", ".replace(:param)");
});

test("detects new URL() construction", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'new URL(`/api/users/${id}`, base)', "react-router", "app.js", "new URL()");
});

test("detects Ember Data store.findRecord", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'this.store.findRecord("user", id)', "ember", "route.js", "Ember Data");
});

test("detects TanStack queryFn fetch", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'queryFn: async () => { return fetch(`/api/users/${id}`) }', "react-router", "app.js", "useQuery queryFn");
});

// ============================================================
// SECTION 5: MINIFIED CODE DETECTION
// ============================================================
console.log("\n--- Minified Code Detection ---");

test("minified: destructure {a:b} = c() → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    '{userId:e}=t();fetch(`/api/users/${e}`)',
    "react-router", "chunk.js", "minified-params-to-fetch");
});

test("minified: destructure {a} = c() → fetch (no rename)", () => {
  assertFinds(DoctorScan.analyzeSources,
    '{userId}=t();fetch(`/api/users/${userId}`)',
    "react-router", "chunk.js", "minified-params-to-fetch");
});

test("minified: multi-destructure {a:b,c:d} = e() → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    '{userId:e,name:n}=t();fetch(`/api/users/${e}`)',
    "react-router", "chunk.js", "minified-params-to-fetch");
});

test("minified: splat e()['*'] → fetch", () => {
  assertFinds(DoctorScan.analyzeSources,
    'const p=t()["*"];fetch(`/api/files/${p}`)',
    "react-router", "chunk.js", "minified-splat-to-fetch");
});

test("minified: short var fetch(u)", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'fetch(u)', "react-router", "chunk.js", "fetch(var)");
});

test("minified: service e.get(`/api/${x}`)", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'e.get(`/api/users/${x}`)', "angular", "chunk.js", "service.method()");
});

test("minified: Babel concat fetch('/api/'.concat(x))", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'fetch("/api/users/".concat(x))', "react-router", "chunk.js", "fetch(.concat())");
});

test("minified: Angular paramMap preserved after AOT", () => {
  assertParamFinds(
    'let i=this.route.snapshot.paramMap.get("param")??"";this.paramValue.set(i)',
    "angular", "chunk.js", "js", "paramMap.get()");
});

test("minified: Angular switchMap pipe chain", () => {
  assertFinds(DoctorScan.analyzeSources,
    'this.route.paramMap.pipe(switchMap(l=>{let r=l.get("teamId");const u=`/api/teams/${r}`;return this.http.get(u)}))',
    "angular", "chunk.js", "angular-paramMap-pipe-to-http");
});

test("minified: React fetch template with short names", () => {
  assertFinds(DoctorScan.analyzeApiCalls,
    'fetch(`/api/data/${e}`)', "react-router", "chunk.js", "fetch()");
});

// ============================================================
// SECTION 6: FRAMEWORK DETECTION
// ============================================================
console.log("\n--- Framework Detection ---");

test("detects React Router from __reactRouterVersion", () => {
  const r = DoctorScan.detectFramework('window.__reactRouterVersion="7.0.0"');
  assert(r?.framework === "react-router", `Expected react-router, got ${r?.framework}`);
});

test("detects Next.js from __NEXT_DATA__", () => {
  const r = DoctorScan.detectFramework('<script id="__NEXT_DATA__">{"page":"/"}</script>');
  assert(r?.framework === "nextjs", `Expected nextjs, got ${r?.framework}`);
});

test("detects Vue Router from createRouter", () => {
  const r = DoctorScan.detectFramework('createRouter({history:createWebHistory(),routes:[]})');
  assert(r?.framework === "vue-router", `Expected vue-router, got ${r?.framework}`);
});

test("detects Nuxt from __NUXT__", () => {
  const r = DoctorScan.detectFramework('window.__NUXT__={data:{}}');
  assert(r?.framework === "nuxt", `Expected nuxt, got ${r?.framework}`);
});

test("detects Angular from ng-version", () => {
  const r = DoctorScan.detectFramework('<app-root ng-version="21.2.1" _nghost-abc></app-root>');
  assert(r?.framework === "angular", `Expected angular, got ${r?.framework}`);
});

test("detects SvelteKit from __sveltekit", () => {
  const r = DoctorScan.detectFramework('window.__sveltekit={};document.querySelector("[data-sveltekit]")');
  assert(r?.framework === "sveltekit", `Expected sveltekit, got ${r?.framework}`);
});

test("detects Ember from ember-application", () => {
  const r = DoctorScan.detectFramework('<div class="ember-application ember-view" id="ember1"></div>');
  assert(r?.framework === "ember", `Expected ember, got ${r?.framework}`);
});

test("detects SolidStart from data-hk + solid-start", () => {
  const r = DoctorScan.detectFramework('<div data-hk="0">solid-start app</div>');
  assert(r?.framework === "solidstart", `Expected solidstart, got ${r?.framework}`);
});

// ============================================================
// SECTION 7: ENCODING DATA ACCURACY
// ============================================================
console.log("\n--- Encoding Data Accuracy ---");

test("React Router: %252F double-decode works=true", () => {
  const payload = DoctorScan.ENCODING_DATA["react-router"].payloads.find(p => p.input.includes("%252F"));
  assert(payload, "Should have %252F payload");
  assert(payload.works === true, `Expected works=true for %252F in React Router, got ${payload.works}`);
});

test("Nuxt: getRouterParam default NOT decoded", () => {
  const pb = DoctorScan.ENCODING_DATA.nuxt.paramBehavior;
  const defaultKey = Object.keys(pb).find(k => k.includes("default"));
  assert(defaultKey, "Should have a 'default' getRouterParam behavior entry");
  assert(pb[defaultKey].includes("NOT decoded"), `Expected 'NOT decoded' in default behavior, got: ${pb[defaultKey]}`);
});

test("Nuxt: getRouterParam {decode:true} IS decoded", () => {
  const pb = DoctorScan.ENCODING_DATA.nuxt.paramBehavior;
  const decodeKey = Object.keys(pb).find(k => k.includes("decode:true"));
  assert(decodeKey, "Should have a '{decode:true}' getRouterParam behavior entry");
  assert(pb[decodeKey].includes("DECODED"), `Expected 'DECODED' in {decode:true} behavior, got: ${pb[decodeKey]}`);
});

test("SolidStart: path params NOT decoded", () => {
  const data = DoctorScan.ENCODING_DATA.solidstart;
  assert(data.riskLevel === "low", `Expected SolidStart riskLevel='low', got '${data.riskLevel}'`);
  assert(data.decodeFunction.includes("NONE"), `Expected decode function to mention NONE, got: ${data.decodeFunction}`);
});

test("SvelteKit: mentions %25-split defense", () => {
  const pipeline = DoctorScan.ENCODING_DATA.sveltekit.decodePipeline.join(" ");
  assert(pipeline.includes("%25"), `Expected pipeline to mention %25-split, got: ${pipeline.substring(0, 200)}`);
});

test("Ember: mentions normalizePath re-encoding", () => {
  const pipeline = DoctorScan.ENCODING_DATA.ember.decodePipeline.join(" ");
  assert(pipeline.includes("re-encodes") || pipeline.includes("re-encode"), `Expected pipeline to mention re-encoding, got: ${pipeline.substring(0, 200)}`);
});

test("Ember: wildcard skips final decode", () => {
  const pb = DoctorScan.ENCODING_DATA.ember.paramBehavior;
  const wildcardKey = Object.keys(pb).find(k => k.includes("wildcard"));
  assert(wildcardKey, "Should have wildcard behavior entry");
  assert(pb[wildcardKey].includes("NOT final-decoded") || pb[wildcardKey].includes("skips"),
    `Expected wildcard to mention skipping decode, got: ${pb[wildcardKey]}`);
});

test("Angular: paramMap fully decoded including slashes", () => {
  const pb = DoctorScan.ENCODING_DATA.angular.paramBehavior;
  const paramKey = Object.keys(pb).find(k => k.includes("paramMap.get()"));
  assert(paramKey, "Should have paramMap.get() behavior");
  assert(pb[paramKey].includes("decoded") || pb[paramKey].includes("Decoded"),
    `Expected decoded mention, got: ${pb[paramKey]}`);
});

test("Next.js: client useParams RE-ENCODED (safe)", () => {
  const pb = DoctorScan.ENCODING_DATA.nextjs.paramBehavior;
  const clientKey = Object.keys(pb).find(k => k.includes("useParams") && k.includes("client"));
  assert(clientKey, "Should have client useParams behavior");
  assert(pb[clientKey].includes("RE-ENCODED"), `Expected RE-ENCODED, got: ${pb[clientKey]}`);
});

test("Next.js: route handler params DECODED (SSRF)", () => {
  const pb = DoctorScan.ENCODING_DATA.nextjs.paramBehavior;
  const routeKey = Object.keys(pb).find(k => k.includes("Route Handler"));
  assert(routeKey, "Should have Route Handler behavior");
  assert(pb[routeKey].includes("DECODED"), `Expected DECODED, got: ${pb[routeKey]}`);
});

// ============================================================
// SECTION 8: FALSE POSITIVE FILTERING
// ============================================================
console.log("\n--- False Positive Filtering ---");

test("filters RSC payload false positives", () => {
  const body = '<script>self.__next_f.push([1,"\\u003ccode\\u003eawait params\\u003c/code\\u003e"])</script>';
  const results = DoctorScan.analyzeParamSources(body, "nextjs", "page", "html");
  const awaitParams = results.filter(r => r.type.includes("await params"));
  assert(awaitParams.length === 0, `Should filter RSC payload false positives, got ${awaitParams.length} results`);
});

test("filters string literal false positives", () => {
  const body = '{children:"await params in Next.js"}';
  const results = DoctorScan.analyzeParamSources(body, "nextjs", "chunk.js", "js");
  const awaitParams = results.filter(r => r.type.includes("await params"));
  assert(awaitParams.length === 0, `Should filter string literal false positives, got ${awaitParams.length} results`);
});

test("filters framework-internal dangerouslySetInnerHTML", () => {
  const body = 'dangerouslySetInnerHTML:{__html:this.rootHtml}';
  const results = DoctorScan.analyzeParamSources(body, "nextjs", "chunk.js", "js");
  const dsih = results.filter(r => r.type === "dangerouslySetInnerHTML");
  assert(dsih.length === 0, `Should filter framework-internal DSIH, got ${dsih.length} results`);
});

test("filters HTML text content outside script tags", () => {
  const body = '<p>This page uses useParams() to read data</p>';
  const results = DoctorScan.analyzeParamSources(body, "react-router", "page", "html");
  const useParamsResults = results.filter(r => r.type === "useParams()");
  assert(useParamsResults.length === 0, `Should filter HTML text, got ${useParamsResults.length} results`);
});

test("allows script tag content in HTML", () => {
  const body = '<script>const {id} = useParams(); fetch(`/api/${id}`)</script>';
  const results = DoctorScan.analyzeParamSources(body, "react-router", "page", "html");
  const useParamsResults = results.filter(r => r.type === "useParams()");
  assert(useParamsResults.length > 0, "Should detect useParams inside script tags");
});

// ============================================================
// SECTION 9: REAL-WORLD MINIFIED PATTERNS FROM LAB APPS
// ============================================================
console.log("\n--- Real-World Minified Patterns ---");

test("Angular AOT: preserved paramMap.get chain", () => {
  const code = 'let i=this.route.snapshot.paramMap.get("param")??"";this.paramValue.set(i);this.hasTraversal.set(i.includes("..")||i.includes("/"))';
  assertParamFinds(code, "angular", "chunk.js", "js", "paramMap.get()");
});

test("Angular AOT: pipe/switchMap/http chain", () => {
  const code = 'this.route.paramMap.pipe(switchMap(l=>{let r=l.get("teamId");return this.http.get(`/api/teams/${r}/members`)}))';
  assertFinds(DoctorScan.analyzeSources, code, "angular", "chunk.js", "angular-paramMap-pipe-to-http");
});

test("Vue compiled: route.params property access", () => {
  const code = 'const userId=route.params.userId;const url=`/api/users/${userId}`;fetch(url)';
  assertParamFinds(code, "vue-router", "chunk.js", "js", "route.params.*");
  // fetch(url) where url is a 3-char variable matches fetch(var) pattern
  assertFinds(DoctorScan.analyzeApiCalls, code, "vue-router", "chunk.js", "fetch(var)");
});

test("Nuxt compiled: useFetch with params interpolation", () => {
  const code = 'useFetch(`/api/users/${route.params.id}`,{key:"user"})';
  assertFinds(DoctorScan.analyzeSources, code, "nuxt", "chunk.js", "nuxt-useFetch-params");
});

test("React minified: destructure → template literal fetch (direct)", () => {
  // When template literal is directly in fetch(), the minified pattern matches
  const code = 'let{dataId:e}=t();fetch(`/api/data/${e}`).then(r=>r.json())';
  assertFinds(DoctorScan.analyzeSources, code, "react-router", "chunk.js", "minified-params-to-fetch");
});

test("React minified: destructure → variable → fetch(var) (indirect)", () => {
  // When URL is built in a variable, detect via fetch(var) API call pattern
  const code = 'let{dataId:e}=t();const n=`/api/data/${e}`;fetch(n).then(r=>r.json())';
  assertFinds(DoctorScan.analyzeApiCalls, code, "react-router", "chunk.js", "fetch(var)");
});

test("SvelteKit compiled: searchParams.get in compiled output", () => {
  const code = 'const w=$page.url.searchParams.get("widget");fetch(`/api/widgets/${w}`)';
  assertParamFinds(code, "sveltekit", "chunk.js", "js", "$page.url.searchParams");
  assertFinds(DoctorScan.analyzeApiCalls, code, "sveltekit", "chunk.js", "fetch()");
});

// ============================================================
// SECTION 10: PATH EXTRACTION
// ============================================================
console.log("\n--- Path Extraction ---");

test("extracts API endpoints from JS", () => {
  const paths = DoctorScan.extractPaths('fetch("/api/users/123")', "react-router", "app.js", "js");
  assert(paths.some(p => p.path.includes("/api/users")), "Should extract /api/users path");
});

test("extracts Next.js buildManifest routes", () => {
  const body = '"/dashboard":[],"/users/[id]":[],"/settings":[]';
  const paths = DoctorScan.extractPaths(body, "nextjs", "_buildManifest.js", "js");
  assert(paths.some(p => p.path === "/dashboard"), "Should extract /dashboard");
  assert(paths.some(p => p.path === "/users/[id]" && p.isDynamic), "Should extract /users/[id] as dynamic");
});

test("extracts __NEXT_DATA__ page route", () => {
  const body = '<script id="__NEXT_DATA__" type="application/json">{"page":"/users/[id]","buildId":"abc"}</script>';
  const paths = DoctorScan.extractPaths(body, "nextjs", "page", "html");
  assert(paths.some(p => p.path === "/users/[id]"), "Should extract page from __NEXT_DATA__");
});

test("identifies dynamic paths", () => {
  const paths = DoctorScan.extractPaths('path:"/users/:userId/profile"', "react-router", "app.js", "js");
  assert(paths.some(p => p.isDynamic), "Should identify :userId as dynamic");
});

// ============================================================
// Summary
// ============================================================
console.log("\n" + "=".repeat(50));
console.log(`Results: ${passed}/${total} passed, ${failed} failed`);
if (failed > 0) {
  console.log("\nFailed tests need attention!");
  process.exit(1);
} else {
  console.log("\nAll tests passed!");
  process.exit(0);
}
