// packages/backend/src/framework-detector.ts
var FRAMEWORK_SIGNALS = {
  nextjs: [
    { pattern: /__NEXT_DATA__/, weight: 40, label: "__NEXT_DATA__ script" },
    { pattern: /_next\/static/, weight: 30, label: "_next/static assets" },
    { pattern: /_next\/data/, weight: 25, label: "_next/data endpoint" },
    { pattern: /x-powered-by.*next/i, weight: 35, label: "X-Powered-By: Next.js header" },
    { pattern: /__next/, weight: 20, label: "__next container div" },
    { pattern: /_buildManifest\.js/, weight: 35, label: "_buildManifest.js" },
    { pattern: /_ssgManifest\.js/, weight: 30, label: "_ssgManifest.js" },
    { pattern: /next\/router/, weight: 25, label: "next/router import" },
    { pattern: /next\/navigation/, weight: 25, label: "next/navigation import" },
    { pattern: /NextResponse/, weight: 15, label: "NextResponse reference" },
    { pattern: /getServerSideProps/, weight: 20, label: "getServerSideProps" },
    { pattern: /getStaticProps/, weight: 20, label: "getStaticProps" },
    { pattern: /__NEXT_LOADED_PAGES__/, weight: 30, label: "__NEXT_LOADED_PAGES__" }
  ],
  nuxt: [
    { pattern: /__NUXT__/, weight: 40, label: "__NUXT__ payload" },
    { pattern: /_nuxt\//, weight: 30, label: "_nuxt/ assets" },
    { pattern: /nuxt\.config/, weight: 15, label: "nuxt.config reference" },
    { pattern: /__nuxt_island/, weight: 35, label: "__nuxt_island (CVE-2025-59414)" },
    { pattern: /NuxtPage/, weight: 20, label: "NuxtPage component" },
    { pattern: /useFetch|useAsyncData|\$fetch/, weight: 15, label: "Nuxt data fetching" },
    { pattern: /nuxt-link/, weight: 20, label: "nuxt-link component" },
    { pattern: /_payload\.json/, weight: 25, label: "_payload.json" }
  ],
  "vue-router": [
    { pattern: /data-v-[a-f0-9]+/, weight: 15, label: "Vue scoped style attribute" },
    { pattern: /__vue_app__/, weight: 30, label: "__vue_app__ instance" },
    { pattern: /vue-router/, weight: 35, label: "vue-router reference" },
    { pattern: /createRouter/, weight: 25, label: "createRouter call" },
    { pattern: /createWebHistory|createWebHashHistory/, weight: 30, label: "Vue history mode" },
    { pattern: /router-view/, weight: 20, label: "router-view component" },
    { pattern: /router-link/, weight: 20, label: "router-link component" },
    { pattern: /useRoute\b/, weight: 20, label: "useRoute composable" },
    { pattern: /data-server-rendered/, weight: 10, label: "Vue SSR marker" }
  ],
  "react-router": [
    { pattern: /__reactContainer/, weight: 15, label: "React container" },
    { pattern: /data-reactroot/, weight: 15, label: "React root marker" },
    { pattern: /_reactRootContainer/, weight: 15, label: "React root container" },
    { pattern: /react-router/, weight: 35, label: "react-router reference" },
    { pattern: /createBrowserRouter/, weight: 30, label: "createBrowserRouter" },
    { pattern: /useParams/, weight: 15, label: "useParams hook" },
    { pattern: /useNavigate/, weight: 15, label: "useNavigate hook" },
    { pattern: /<Route\s/, weight: 20, label: "<Route component" },
    { pattern: /RouterProvider/, weight: 25, label: "RouterProvider" },
    // v7 empirical: these survive minification in production bundles
    { pattern: /__reactRouterVersion/, weight: 40, label: "__reactRouterVersion global (v7)" },
    { pattern: /__reactRouterContext/, weight: 35, label: "__reactRouterContext global (v7)" },
    { pattern: /\{path:"[^"]+",element:/, weight: 30, label: "Route config object (minified)" },
    { pattern: /useLocation\(\) may be used only in the context/, weight: 25, label: "React Router error string" }
  ],
  remix: [
    { pattern: /__remixContext/, weight: 40, label: "__remixContext" },
    { pattern: /__remix/, weight: 30, label: "__remix marker" },
    { pattern: /remix-run/, weight: 30, label: "remix-run reference" },
    { pattern: /_data=routes\//, weight: 35, label: "Remix _data parameter" },
    { pattern: /LoaderFunctionArgs|ActionFunctionArgs/, weight: 25, label: "Remix loader/action args" },
    { pattern: /useLoaderData/, weight: 25, label: "useLoaderData hook" }
  ],
  angular: [
    { pattern: /ng-version/, weight: 35, label: "ng-version attribute" },
    { pattern: /_nghost-/, weight: 30, label: "Angular host binding" },
    { pattern: /_ngcontent-/, weight: 30, label: "Angular content projection" },
    { pattern: /platformBrowserDynamic/, weight: 25, label: "Angular bootstrap" },
    { pattern: /@angular\/router/, weight: 35, label: "@angular/router" },
    { pattern: /ActivatedRoute/, weight: 20, label: "ActivatedRoute" },
    { pattern: /paramMap/, weight: 15, label: "paramMap usage" },
    { pattern: /routerLink/, weight: 20, label: "routerLink directive" },
    { pattern: /ng-app/, weight: 15, label: "ng-app (AngularJS)" }
  ],
  sveltekit: [
    { pattern: /__sveltekit/, weight: 40, label: "__sveltekit data" },
    { pattern: /data-sveltekit/, weight: 30, label: "data-sveltekit attribute" },
    { pattern: /__SVELTEKIT_DATA__/, weight: 35, label: "__SVELTEKIT_DATA__" },
    { pattern: /svelte-[a-z0-9]+/, weight: 10, label: "Svelte class hash" },
    { pattern: /\$app\/stores/, weight: 25, label: "$app/stores import" },
    { pattern: /\$app\/navigation/, weight: 25, label: "$app/navigation import" },
    { pattern: /goto\(/, weight: 10, label: "goto() navigation" }
  ],
  ember: [
    { pattern: /ember-view/, weight: 30, label: "ember-view class" },
    { pattern: /ember-application/, weight: 30, label: "ember-application class" },
    { pattern: /__ember/, weight: 25, label: "__ember marker" },
    { pattern: /ember-cli/, weight: 20, label: "ember-cli reference" },
    { pattern: /Ember\./, weight: 15, label: "Ember. namespace" },
    { pattern: /ember-data/, weight: 20, label: "ember-data" },
    { pattern: /transitionTo/, weight: 10, label: "transitionTo call" }
  ],
  solidstart: [
    { pattern: /data-hk/, weight: 25, label: "Solid hydration key" },
    { pattern: /solid-js/, weight: 30, label: "solid-js reference" },
    { pattern: /solid-start/, weight: 35, label: "solid-start reference" },
    { pattern: /createResource/, weight: 15, label: "createResource" },
    { pattern: /createAsync/, weight: 15, label: "createAsync" },
    { pattern: /@solidjs\/router/, weight: 30, label: "@solidjs/router" }
  ],
  astro: [
    { pattern: /astro-island/, weight: 40, label: "astro-island component" },
    { pattern: /data-astro-/, weight: 30, label: "data-astro attribute" },
    { pattern: /<astro-/, weight: 25, label: "Astro custom element" },
    { pattern: /astro\.config/, weight: 15, label: "astro.config reference" },
    { pattern: /Astro\.params/, weight: 25, label: "Astro.params" },
    { pattern: /client:load|client:visible|client:idle/, weight: 30, label: "Astro client directives" }
  ],
  unknown: []
};
var DETECTION_ORDER = [
  "nextjs",
  // Check before generic react-router (Next.js uses React Router internally)
  "remix",
  // Check before generic react-router (Remix uses React Router)
  "nuxt",
  // Check before generic vue-router (Nuxt uses Vue Router)
  "sveltekit",
  "solidstart",
  "astro",
  "angular",
  "ember",
  "vue-router",
  // Generic Vue after Nuxt
  "react-router"
  // Generic React Router after Next.js and Remix
];
function detectFramework(body, headers, url) {
  const results = [];
  const poweredBy = headers["x-powered-by"]?.join(" ") || "";
  const headerStr = Object.entries(headers).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n");
  const combined = body + "\n" + headerStr;
  for (const framework of DETECTION_ORDER) {
    const signals = FRAMEWORK_SIGNALS[framework];
    let totalWeight = 0;
    const matchedSignals = [];
    for (const signal of signals) {
      const regex = typeof signal.pattern === "string" ? new RegExp(signal.pattern, "i") : signal.pattern;
      if (regex.test(combined)) {
        totalWeight += signal.weight;
        matchedSignals.push(signal.label);
      }
    }
    if (totalWeight >= 30) {
      results.push({
        framework,
        confidence: Math.min(totalWeight, 100),
        signals: matchedSignals
      });
    }
  }
  if (results.length === 0) return null;
  results.sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    return DETECTION_ORDER.indexOf(a.framework) - DETECTION_ORDER.indexOf(b.framework);
  });
  return results[0];
}
function getContentType(headers) {
  const ct = (headers["content-type"] || []).join(" ").toLowerCase();
  if (ct.includes("text/html") || ct.includes("application/xhtml")) return "html";
  if (ct.includes("javascript") || ct.includes("application/x-javascript") || ct.includes("text/javascript"))
    return "js";
  return "other";
}

// packages/backend/src/path-extractor.ts
var UNIVERSAL_PATTERNS = [
  // API paths: "/api/...", "/v1/...", "/v2/...", "/graphql"
  {
    regex: /["'`](\/api\/[a-zA-Z0-9\/:_\-\[\].*{}]+)["'`]/g,
    type: "api",
    label: "API endpoint"
  },
  {
    regex: /["'`](\/v[0-9]+\/[a-zA-Z0-9\/:_\-\[\].*{}]+)["'`]/g,
    type: "api",
    label: "Versioned API"
  },
  {
    regex: /["'`](\/graphql\b[^"'`]*)["'`]/g,
    type: "api",
    label: "GraphQL endpoint"
  },
  // fetch/axios URL patterns (template literals)
  {
    regex: /fetch\s*\(\s*[`"']([^`"']+)[`"']/g,
    type: "fetch",
    label: "fetch() call"
  },
  {
    regex: /axios\.\w+\s*\(\s*[`"']([^`"']+)[`"']/g,
    type: "fetch",
    label: "axios call"
  },
  {
    regex: /\$http\.\w+\s*\(\s*[`"']([^`"']+)[`"']/g,
    type: "fetch",
    label: "$http call"
  },
  // Generic route-looking paths with dynamic segments
  {
    regex: /["'`](\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/:[a-zA-Z0-9_]+(?:\/[^"'`]*)?)["'`]/g,
    type: "route",
    label: "Route with :param"
  }
];
var FRAMEWORK_PATTERNS = {
  "react-router": [
    // Route definitions: path: "/users/:id" or path="/users/:id"
    {
      regex: /path\s*[:=]\s*["'`](\/[^"'`]+)["'`]/g,
      type: "route",
      label: "React Router path definition"
    },
    // <Route path="..." /> in JSX (survives in bundled code as string)
    {
      regex: /Route[^>]*path\s*=\s*["']([^"']+)["']/g,
      type: "route",
      label: "<Route path> component"
    },
    // navigate("/path") or push("/path")
    {
      regex: /navigate\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "navigate() call"
    },
    // Link to="/path"
    {
      regex: /to\s*=\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Link to prop"
    },
    // v7 empirical: minified route config objects {path:"/users/:id",element:...}
    {
      regex: /\{path:"(\/[^"]+)"[^}]*(?:element|loader|children):/g,
      type: "route",
      label: "Minified route config object"
    },
    // v7 empirical: nested children routes {path:"stats",element:...}
    {
      regex: /children:\[[^\]]*\{path:"([^"]+)"/g,
      type: "route",
      label: "Nested child route"
    },
    // v7 empirical: lazy chunk imports import("./ChunkName-hash.js")
    {
      regex: /import\("\.\/([A-Za-z]+-[A-Za-z0-9]+\.js)"\)/g,
      type: "route",
      label: "Lazy chunk import"
    }
  ],
  nextjs: [
    // _buildManifest.js entries: "/users/[id]": [...]
    {
      regex: /["'](\/[a-zA-Z0-9_\-/\[\]\.]+)["']\s*:/g,
      type: "route",
      label: "Next.js build manifest route"
    },
    // Dynamic imports: () => import("./pages/users/[id]")
    {
      regex: /import\s*\(\s*["'][^"']*\/pages\/([\w\-/\[\]\.]+)["']\s*\)/g,
      type: "route",
      label: "Next.js dynamic page import"
    },
    // __NEXT_DATA__ contains routes in the page property
    {
      regex: /"page"\s*:\s*"(\/[^"]+)"/g,
      type: "route",
      label: "__NEXT_DATA__ page"
    },
    // router.push("/path")
    {
      regex: /router\.push\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Next.js router.push"
    },
    // Link href="/path"
    {
      regex: /href\s*=\s*["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]/g,
      type: "navigation",
      label: "Next.js Link href"
    },
    // API routes from fetch calls
    {
      regex: /fetch\s*\(\s*["'`](\/api\/[^"'`]+)["'`]/g,
      type: "api",
      label: "Next.js API route fetch"
    }
  ],
  remix: [
    // Remix route file convention shows in _data param
    {
      regex: /_data=routes\/([\w.$\-()]+)/g,
      type: "route",
      label: "Remix _data route reference"
    },
    // Route module paths
    {
      regex: /["']routes\/([\w.$\-()]+)["']/g,
      type: "route",
      label: "Remix route module"
    },
    // loader/action fetch patterns
    {
      regex: /path\s*[:=]\s*["'`](\/[^"'`]+)["'`]/g,
      type: "route",
      label: "Remix route path"
    }
  ],
  "vue-router": [
    // Route config: { path: "/users/:id", ... }
    {
      regex: /path\s*:\s*["'`](\/[^"'`]+)["'`]/g,
      type: "route",
      label: "Vue Router path config"
    },
    // router.push("/path") or router.push({ path: "/..." })
    {
      regex: /router\.push\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Vue router.push string"
    },
    {
      regex: /router\.push\s*\(\s*\{\s*path\s*:\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Vue router.push object"
    },
    // to="/path" on router-link
    {
      regex: /to\s*=\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "router-link to"
    },
    // Catch-all: /:pathMatch(.*)*
    {
      regex: /["'`](\/[^"'`]*:pathMatch[^"'`]*)["'`]/g,
      type: "route",
      label: "Vue catch-all route"
    }
  ],
  nuxt: [
    // Nuxt auto-generated routes from pages/
    {
      regex: /["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]\s*:/g,
      type: "route",
      label: "Nuxt page route"
    },
    // useFetch/useAsyncData URL
    {
      regex: /useFetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "Nuxt useFetch"
    },
    {
      regex: /\$fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "Nuxt $fetch"
    },
    // navigateTo("/path")
    {
      regex: /navigateTo\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Nuxt navigateTo"
    },
    // __nuxt_island paths
    {
      regex: /__nuxt_island\/([\w\-]+)/g,
      type: "api",
      label: "Nuxt island endpoint"
    }
  ],
  angular: [
    // Route config: { path: "users/:id", ... } (Angular paths don't start with /)
    {
      regex: /path\s*:\s*["'`]([a-zA-Z0-9\/:_\-.*]+)["'`]/g,
      type: "route",
      label: "Angular route config"
    },
    // router.navigate(["/path"])
    {
      regex: /router\.navigate\s*\(\s*\[\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Angular router.navigate"
    },
    // routerLink="/path"
    {
      regex: /routerLink\s*=\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Angular routerLink"
    },
    // HttpClient calls: this.http.get("/api/...")
    {
      regex: /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "api",
      label: "Angular HttpClient call"
    }
  ],
  sveltekit: [
    // SvelteKit routes inferred from fetch in load functions
    {
      regex: /fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "SvelteKit fetch in load"
    },
    // goto("/path")
    {
      regex: /goto\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "SvelteKit goto"
    },
    // __SVELTEKIT_DATA__ route references
    {
      regex: /__sveltekit\/[^/]*\/([\w\-/]+)/g,
      type: "route",
      label: "SvelteKit data route"
    },
    // href="/path" in Svelte components
    {
      regex: /href\s*=\s*["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]/g,
      type: "navigation",
      label: "SvelteKit href"
    }
  ],
  ember: [
    // this.route('name', { path: '/path/:id' })
    {
      regex: /\.route\s*\(\s*["'](\w+)["']\s*,\s*\{\s*path\s*:\s*["'`]([^"'`]+)["'`]/g,
      type: "route",
      label: "Ember route definition"
    },
    // transitionTo("routeName")
    {
      regex: /transitionTo\s*\(\s*["']([^"']+)["']/g,
      type: "navigation",
      label: "Ember transitionTo"
    },
    // link-to with route name
    {
      regex: /link-to\s+["']([^"']+)["']/g,
      type: "navigation",
      label: "Ember link-to"
    },
    // Ember Data adapter URLs
    {
      regex: /urlFor\w+\s*\([^)]*["'`](\/[^"'`]+)["'`]/g,
      type: "api",
      label: "Ember Data adapter URL"
    }
  ],
  solidstart: [
    // File-based route paths
    {
      regex: /["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]\s*:/g,
      type: "route",
      label: "SolidStart route"
    },
    // createResource fetch
    {
      regex: /fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "SolidStart fetch"
    },
    // A("/path") navigation
    {
      regex: /navigate\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "SolidStart navigate"
    }
  ],
  astro: [
    // Astro island data fetching
    {
      regex: /fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "Astro fetch"
    },
    // href="/path" in Astro templates
    {
      regex: /href\s*=\s*["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]/g,
      type: "navigation",
      label: "Astro href"
    }
  ],
  unknown: []
};
function isDynamicPath(path) {
  return path.includes(":") || // :param (React Router, Angular, Ember)
  /\[[^\]]+\]/.test(path) || // [param] (Next.js, SvelteKit, Nuxt, Astro, SolidStart)
  path.includes("*") || // splat/catch-all
  /\$\{/.test(path) || // template literal interpolation
  /\$\w+/.test(path);
}
function normalizePath(raw) {
  let path = raw.trim().replace(/[,;}\s]+$/, "");
  const qIdx = path.indexOf("?");
  if (qIdx > 0) path = path.substring(0, qIdx);
  if (!path.startsWith("/") && !path.startsWith("http")) {
    path = "/" + path;
  }
  return path;
}
function isNoisePath(path) {
  if (path.length < 2 || path.length > 200) return true;
  if (/\.(css|svg|png|jpg|jpeg|gif|ico|woff2?|ttf|eot|map|json)$/i.test(path)) return true;
  if (path === "/") return true;
  if (/^(data:|blob:|javascript:|mailto:)/i.test(path)) return true;
  if (/^\/(favicon|robots|sitemap|manifest|sw|service-worker|workbox)/i.test(path)) return true;
  if (/webpack|__webpack|hot-update|\.module\./i.test(path)) return true;
  return false;
}
function extractNextBuildManifest(body) {
  const paths = [];
  const manifestRegex = /"(\/[^"]+)":\s*\[/g;
  let match;
  while ((match = manifestRegex.exec(body)) !== null) {
    const path = match[1];
    if (!isNoisePath(path) && !path.startsWith("/_next")) {
      paths.push({
        path: normalizePath(path),
        type: "route",
        source: "_buildManifest.js",
        framework: "nextjs",
        isDynamic: isDynamicPath(path)
      });
    }
  }
  return paths;
}
function extractNextData(body) {
  const paths = [];
  const nextDataMatch = body.match(
    /<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  );
  if (nextDataMatch) {
    try {
      const data = JSON.parse(nextDataMatch[1]);
      if (data.page) {
        paths.push({
          path: data.page,
          type: "route",
          source: "__NEXT_DATA__",
          framework: "nextjs",
          isDynamic: isDynamicPath(data.page)
        });
      }
      if (data.buildId) {
        const dynRoutes = body.match(
          new RegExp(`/_next/data/${data.buildId}/([^"]+)\\.json`, "g")
        );
        if (dynRoutes) {
          for (const route of dynRoutes) {
            const path = "/" + route.replace(`/_next/data/${data.buildId}/`, "").replace(/\.json$/, "");
            if (!isNoisePath(path)) {
              paths.push({
                path: normalizePath(path),
                type: "route",
                source: "__NEXT_DATA__",
                framework: "nextjs",
                isDynamic: isDynamicPath(path)
              });
            }
          }
        }
      }
    } catch {
    }
  }
  return paths;
}
function extractNuxtPayload(body) {
  const paths = [];
  const nuxtMatch = body.match(
    /window\.__NUXT__\s*=\s*(\{[\s\S]*?\});?\s*<\/script>/
  );
  if (nuxtMatch) {
    const pathRegex = /"path"\s*:\s*"(\/[^"]+)"/g;
    let match;
    while ((match = pathRegex.exec(nuxtMatch[1])) !== null) {
      const path = match[1];
      if (!isNoisePath(path)) {
        paths.push({
          path: normalizePath(path),
          type: "route",
          source: "__NUXT__",
          framework: "nuxt",
          isDynamic: isDynamicPath(path)
        });
      }
    }
  }
  return paths;
}
function extractPaths(body, framework, sourceUrl, contentType) {
  const paths = [];
  const seen = /* @__PURE__ */ new Set();
  const addPath = (p) => {
    const key = `${p.path}|${p.type}`;
    if (!seen.has(key) && !isNoisePath(p.path)) {
      seen.add(key);
      paths.push(p);
    }
  };
  if (contentType === "html") {
    if (framework === "nextjs" || framework === "unknown") {
      for (const p of extractNextData(body)) addPath(p);
    }
    if (framework === "nuxt" || framework === "unknown") {
      for (const p of extractNuxtPayload(body)) addPath(p);
    }
    const hrefRegex = /(?:href|src|action)\s*=\s*["'](\/[^"'#?][^"']*)["']/gi;
    let hrefMatch;
    while ((hrefMatch = hrefRegex.exec(body)) !== null) {
      const path = hrefMatch[1];
      if (!isNoisePath(path)) {
        addPath({
          path: normalizePath(path),
          type: "navigation",
          source: sourceUrl,
          framework,
          isDynamic: isDynamicPath(path)
        });
      }
    }
  }
  if (contentType === "js" && (sourceUrl.includes("_buildManifest") || sourceUrl.includes("_ssgManifest"))) {
    for (const p of extractNextBuildManifest(body)) addPath(p);
  }
  const fwPatterns = FRAMEWORK_PATTERNS[framework] || [];
  for (const { regex, type, label } of fwPatterns) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(body)) !== null) {
      const raw = match[2] || match[1];
      if (!raw) continue;
      const path = normalizePath(raw);
      addPath({
        path,
        type,
        source: sourceUrl,
        framework,
        isDynamic: isDynamicPath(path)
      });
    }
  }
  for (const { regex, type, label } of UNIVERSAL_PATTERNS) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(body)) !== null) {
      const raw = match[1];
      if (!raw) continue;
      const path = normalizePath(raw);
      addPath({
        path,
        type,
        source: sourceUrl,
        framework,
        isDynamic: isDynamicPath(path)
      });
    }
  }
  return paths;
}

// packages/backend/src/cspt-analyzer.ts
var UNIVERSAL_SINKS = [
  // fetch() with template literal containing ${}
  {
    regex: /fetch\s*\(\s*`[^`]*\/[^`]*\$\{[^}]+\}[^`]*`/g,
    type: "fetch-interpolation",
    risk: "high",
    description: "fetch() with interpolated variable in URL path. If the variable contains decoded '../' sequences, browser normalizes before sending."
  },
  // fetch() with string concatenation
  {
    regex: /fetch\s*\(\s*["'][^"']*\/["']\s*\+\s*\w+/g,
    type: "fetch-concatenation",
    risk: "high",
    description: "fetch() with string concatenation in URL. Decoded route params can inject path traversal."
  },
  // axios with template literal
  {
    regex: /axios\.\w+\s*\(\s*`[^`]*\/[^`]*\$\{[^}]+\}[^`]*`/g,
    type: "axios-interpolation",
    risk: "high",
    description: "axios call with interpolated variable in URL path."
  },
  // axios with concatenation
  {
    regex: /axios\.\w+\s*\(\s*["'][^"']*\/["']\s*\+\s*\w+/g,
    type: "axios-concatenation",
    risk: "high",
    description: "axios call with string concatenation in URL path."
  },
  // XMLHttpRequest.open with template literal
  {
    regex: /\.open\s*\(\s*["']\w+["']\s*,\s*`[^`]*\$\{[^}]+\}[^`]*`/g,
    type: "xhr-interpolation",
    risk: "high",
    description: "XMLHttpRequest.open() with interpolated URL."
  },
  // dangerouslySetInnerHTML (React XSS amplification)
  {
    regex: /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:/g,
    type: "dangerouslySetInnerHTML",
    risk: "medium",
    description: "dangerouslySetInnerHTML sink. If fed by CSPT-fetched content, enables XSS."
  },
  // .innerHTML assignment
  {
    regex: /\.innerHTML\s*=\s*[^;]+/g,
    type: "innerHTML",
    risk: "medium",
    description: "innerHTML assignment. CSPT to XSS chain if content comes from traversed endpoint."
  },
  // Template literal fetch with params/route keyword nearby
  {
    regex: /(?:params|route|slug|id)\s*[\.\[]\s*\w*\s*[\]\)]?\s*[;,)}\s]*[\s\S]{0,60}fetch\s*\(/g,
    type: "param-near-fetch",
    risk: "medium",
    description: "Route parameter access near a fetch() call. Likely data flow from param to fetch URL."
  }
];
var FRAMEWORK_SINKS = {
  "react-router": [
    // useParams() followed by fetch in same scope
    {
      regex: /useParams\s*\(\s*\)[\s\S]{0,200}fetch\s*\(\s*[`"'][^`"']*\$?\{/g,
      type: "useParams-to-fetch",
      risk: "high",
      description: "React Router: useParams() value flows into fetch(). Params are decoded (../  from %2e%2e). Empirically confirmed: %2F\u2192/ via decodePath()+matchPath() line 811."
    },
    // params["*"] splat access
    {
      regex: /params\s*\[\s*["']\*["']\s*\]/g,
      type: "splat-param-access",
      risk: "high",
      description: "React Router: Splat/catch-all param access. Captures everything including slashes - highest CSPT risk. Regex is (.*) so multi-segment traversal works."
    },
    // params.* destructured then used in URL
    {
      regex: /(?:const|let|var)\s*\{[^}]*\}\s*=\s*useParams\s*\(\s*\)/g,
      type: "useParams-destructure",
      risk: "medium",
      description: "React Router: useParams destructured. Check if values flow into fetch/navigation calls."
    },
    // v7 empirical: minified useParams destructure → fetch ({x:n}=hookCall()...fetch)
    {
      regex: /\{\w+:\w+\}\s*=\s*\w{1,3}\(\s*\)[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "minified-useParams-to-fetch",
      risk: "high",
      description: "React Router (minified): Destructured hook result flows into fetch template literal. In production bundles, useParams becomes 2-letter identifier."
    },
    // v7 empirical: splat access in minified code ["*"] near fetch
    {
      regex: /\w{1,3}\(\s*\)\s*\[\s*["']\*["']\s*\][\s\S]{0,200}fetch\s*\(/g,
      type: "minified-splat-to-fetch",
      risk: "high",
      description: 'React Router (minified): Splat param access via ["*"] near fetch call. Splat captures across / boundaries.'
    },
    // v7 empirical: route loader function with params → fetch
    {
      regex: /\{params:\w+\}[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{\w+\.\w+\}/g,
      type: "loader-params-to-fetch",
      risk: "high",
      description: "React Router: Route loader/action destructures params and interpolates into fetch URL. Params are decoded same as useParams."
    },
    // v7 empirical: API service layer pattern hiding the sink
    {
      regex: /\{\s*get\s*:\s*\w+\s*=>\s*fetch\s*\(\s*`[^`]*\$\{\w+\}`\s*\)/g,
      type: "api-service-layer",
      risk: "high",
      description: "React Router: API service object wrapping fetch with interpolation. Abstraction hides the CSPT sink from simple grep."
    },
    // v7 empirical: TanStack Query queryFn with dynamic fetch
    {
      regex: /queryFn\s*:\s*\(\s*\)\s*=>\s*fetch\s*\(\s*`[^`]*\$\{[^}]+\}/g,
      type: "tanstack-query-fetch",
      risk: "high",
      description: "TanStack/React Query: queryFn fetches with interpolated param. queryKey and queryFn survive minification."
    },
    // v7 empirical: useSearchParams near fetch
    {
      regex: /\.get\s*\(\s*["'][^"']+["']\s*\)[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "searchParams-to-fetch",
      risk: "high",
      description: "React Router: searchParams.get() flows into fetch. URLSearchParams auto-decodes values (../  from %2e%2e)."
    },
    // v7 empirical: dangerouslySetInnerHTML with single variable (app code)
    {
      regex: /dangerouslySetInnerHTML\s*:\s*\{\s*__html\s*:\s*\w{1,3}\s*\}/g,
      type: "dangerouslySetInnerHTML-var",
      risk: "high",
      description: "React: dangerouslySetInnerHTML with a variable (not static string). CSPT\u2192XSS chain if content comes from traversed endpoint. This pattern survives minification verbatim."
    }
  ],
  nextjs: [
    // Server Component with params and fetch (most dangerous - SSRF)
    {
      regex: /(?:await\s+)?params[\s\S]{0,100}fetch\s*\(\s*[`"'][^`"']*\$?\{/g,
      type: "server-component-fetch",
      risk: "high",
      description: "Next.js: Server Component/Route Handler uses params in fetch(). CSPT becomes SSRF with server credentials."
    },
    // getServerSideProps with params in fetch
    {
      regex: /getServerSideProps[\s\S]{0,300}fetch\s*\(\s*[`"'][^`"']*\$?\{[^}]*params/g,
      type: "gssp-fetch",
      risk: "high",
      description: "Next.js: getServerSideProps interpolates params into fetch URL. Server-side SSRF."
    },
    // useParams from next/navigation
    {
      regex: /useParams\s*\(\s*\)[\s\S]{0,200}fetch/g,
      type: "next-useParams-fetch",
      risk: "high",
      description: "Next.js: useParams() from next/navigation flows into fetch. Client-side CSPT."
    },
    // Catch-all: params.slug array joined
    {
      regex: /(?:slug|path)\s*\.\s*join\s*\(\s*["'`]\/["'`]\s*\)/g,
      type: "catchall-join",
      risk: "high",
      description: "Next.js: Catch-all params joined with '/'. Array ['..','..','admin'] becomes '../../admin'."
    }
  ],
  remix: [
    // Loader/action with params in fetch
    {
      regex: /(?:loader|action)\s*[\s\S]{0,200}params\.\w+[\s\S]{0,100}fetch\s*\(/g,
      type: "loader-param-fetch",
      risk: "high",
      description: "Remix: Loader/action accesses params and calls fetch(). Server-side SSRF via CSPT."
    },
    // Splat params["*"]
    {
      regex: /params\s*\[\s*["']\*["']\s*\]/g,
      type: "remix-splat",
      risk: "high",
      description: "Remix: Splat route param access. Files.$.tsx captures everything after /files/."
    },
    // useLoaderData consumed by dangerouslySetInnerHTML
    {
      regex: /useLoaderData[\s\S]{0,200}dangerouslySetInnerHTML/g,
      type: "loader-to-html",
      risk: "high",
      description: "Remix: Loader data flows to dangerouslySetInnerHTML. CSPT to XSS via controlled endpoint."
    }
  ],
  "vue-router": [
    // route.params in fetch/useFetch
    {
      regex: /route\.params\.\w+[\s\S]{0,100}(?:fetch|useFetch|\$fetch)\s*\(/g,
      type: "vue-params-fetch",
      risk: "high",
      description: "Vue Router: route.params (DECODED) flows into fetch. Most exploitable framework - params deliver decoded slashes."
    },
    // Template literal with route.params
    {
      regex: /`[^`]*\$\{[^}]*route\.params[^}]*\}[^`]*`/g,
      type: "vue-params-template",
      risk: "high",
      description: "Vue Router: route.params interpolated in template literal. Decoded '../' creates traversal."
    },
    // watch + route.params + fetch
    {
      regex: /watch\s*\(\s*\(\s*\)\s*=>\s*route\.params/g,
      type: "vue-watch-params",
      risk: "medium",
      description: "Vue Router: Watcher on route.params. CSPT re-executes on every navigation reactively."
    },
    // v-html directive
    {
      regex: /v-html\s*=\s*["'][^"']+["']/g,
      type: "v-html",
      risk: "medium",
      description: "Vue: v-html directive. CSPT to XSS if content comes from traversed endpoint."
    },
    // Catch-all: pathMatch param
    {
      regex: /route\.params\.pathMatch/g,
      type: "vue-catchall-param",
      risk: "high",
      description: "Vue Router: pathMatch catch-all param. Array contains slashes - no encoding needed for traversal."
    }
  ],
  nuxt: [
    // useFetch with route params
    {
      regex: /useFetch\s*\(\s*`[^`]*\$\{[^}]*(?:route\.params|params)\.[^}]+\}[^`]*`/g,
      type: "nuxt-useFetch-params",
      risk: "high",
      description: "Nuxt: useFetch() with route params in URL. Params are decoded by Vue Router."
    },
    // $fetch with route params
    {
      regex: /\$fetch\s*\(\s*`[^`]*\$\{[^}]*(?:route\.params|params)\.[^}]+\}[^`]*`/g,
      type: "nuxt-fetch-params",
      risk: "high",
      description: "Nuxt: $fetch() with route params in URL."
    },
    // Server route with getRouterParam
    {
      regex: /getRouterParam\s*\([^)]+\)[\s\S]{0,100}(?:fetch|\$fetch)/g,
      type: "nuxt-server-param-fetch",
      risk: "high",
      description: "Nuxt: Server route uses getRouterParam() then fetches. Server-side SSRF."
    },
    // __nuxt_island key manipulation (CVE-2025-59414)
    {
      regex: /__nuxt_island/g,
      type: "nuxt-island",
      risk: "high",
      description: "Nuxt: __nuxt_island reference detected. CVE-2025-59414: stored CSPT via island payload revival."
    }
  ],
  angular: [
    // paramMap.get() near http call
    {
      regex: /paramMap\.get\s*\(\s*["'][^"']+["']\s*\)[\s\S]{0,200}\.(?:get|post|put|delete|patch)\s*\(/g,
      type: "angular-param-http",
      risk: "high",
      description: "Angular: paramMap.get() flows into HttpClient call. Note: Angular preserves %2F but decodes %2e%2e."
    },
    // Template literal with param in HttpClient
    {
      regex: /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`/g,
      type: "angular-http-template",
      risk: "high",
      description: "Angular: HttpClient call with template literal interpolation."
    },
    // snapshot.params in http call
    {
      regex: /snapshot\.param(?:s|Map)[\s\S]{0,100}\.(?:get|post|put|delete|patch)\s*\(/g,
      type: "angular-snapshot-http",
      risk: "high",
      description: "Angular: Route snapshot params flow into HttpClient call."
    },
    // queryParamMap in fetch (Angular's wider CSPT surface)
    {
      regex: /queryParamMap\.get[\s\S]{0,100}(?:fetch|\.get|\.post)\s*\(/g,
      type: "angular-query-param-fetch",
      risk: "medium",
      description: "Angular: Query params in fetch. Angular's bigger CSPT surface since %2f is preserved in path params."
    }
  ],
  sveltekit: [
    // params.X in fetch within load function
    {
      regex: /params\.\w+[\s\S]{0,100}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "sveltekit-load-fetch",
      risk: "high",
      description: "SvelteKit: params used in fetch() within load function. Server load = SSRF."
    },
    // $page.params in fetch
    {
      regex: /\$page\.params\.\w+[\s\S]{0,100}fetch/g,
      type: "sveltekit-page-params-fetch",
      risk: "high",
      description: "SvelteKit: $page.params in component flows into fetch."
    },
    // Rest params [...path] (any reference to params.path with fetch)
    {
      regex: /params\.path[\s\S]{0,60}fetch/g,
      type: "sveltekit-rest-params",
      risk: "high",
      description: "SvelteKit: Rest param 'path' near fetch. [...path] routes capture slashes - no encoding needed."
    },
    // handleFetch hook (last defense)
    {
      regex: /handleFetch/g,
      type: "sveltekit-handleFetch",
      risk: "low",
      description: "SvelteKit: handleFetch hook detected. This intercepts fetch calls in load functions - check for CSPT defense."
    }
  ],
  ember: [
    // model() hook with fetch
    {
      regex: /model\s*\(\s*params\s*\)[\s\S]{0,200}fetch\s*\(/g,
      type: "ember-model-fetch",
      risk: "high",
      description: "Ember: model() hook uses decoded params in fetch call."
    },
    // Wildcard path access in model
    {
      regex: /params\.[\w_]+[\s\S]{0,60}fetch/g,
      type: "ember-params-fetch",
      risk: "high",
      description: "Ember: Route params accessed then used in fetch."
    },
    // Ember Data findRecord
    {
      regex: /(?:store|this\.store)\.find(?:Record|All)\s*\(\s*["'][^"']+["']\s*,\s*params\./g,
      type: "ember-data-find",
      risk: "medium",
      description: "Ember: store.findRecord with route params. Custom adapters may not encode IDs."
    }
  ],
  solidstart: [
    // useParams + createResource + fetch
    {
      regex: /useParams[\s\S]{0,200}createResource[\s\S]{0,200}fetch\s*\(/g,
      type: "solid-params-resource-fetch",
      risk: "high",
      description: "SolidStart: useParams \u2192 createResource \u2192 fetch chain. Reactive CSPT fires on every navigation."
    },
    // 'use server' function with param in fetch
    {
      regex: /['"]use server['"][\s\S]{0,300}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "solid-server-function-fetch",
      risk: "high",
      description: "SolidStart: Server function ('use server') with param interpolation in fetch. CSPT \u2192 SSRF."
    },
    // createAsync + fetch
    {
      regex: /createAsync[\s\S]{0,100}fetch\s*\(/g,
      type: "solid-createAsync-fetch",
      risk: "medium",
      description: "SolidStart: createAsync near fetch call. Check if params flow into URL."
    }
  ],
  astro: [
    // Astro.params in fetch
    {
      regex: /Astro\.params[\s\S]{0,100}fetch\s*\(/g,
      type: "astro-params-fetch",
      risk: "high",
      description: "Astro: Astro.params used near fetch(). In SSR mode, params are decoded from URL."
    },
    // client:load island with fetch (hydration CSPT)
    {
      regex: /client:(?:load|visible|idle)[\s\S]{0,300}fetch\s*\(/g,
      type: "astro-island-fetch",
      risk: "medium",
      description: "Astro: Island with client directive near fetch. Hydration CSPT if server-decoded param is passed as prop."
    },
    // getStaticPaths with external data
    {
      regex: /getStaticPaths[\s\S]{0,200}fetch\s*\(/g,
      type: "astro-static-external",
      risk: "low",
      description: "Astro: getStaticPaths fetches external data for params. Stored CSPT if CMS returns malicious slugs."
    }
  ],
  unknown: []
};
function extractContext(body, matchIndex, matchLength) {
  const start = Math.max(0, matchIndex - 40);
  const end = Math.min(body.length, matchIndex + matchLength + 40);
  let ctx = body.substring(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) ctx = "..." + ctx;
  if (end < body.length) ctx = ctx + "...";
  return ctx;
}
function analyzeSinks(body, framework, sourceUrl) {
  const sinks = [];
  const seen = /* @__PURE__ */ new Set();
  const addSink = (sink) => {
    const key = `${sink.type}|${sink.lineContext.substring(0, 60)}`;
    if (!seen.has(key)) {
      seen.add(key);
      sinks.push(sink);
    }
  };
  for (const pattern of UNIVERSAL_SINKS) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(body)) !== null) {
      addSink({
        pattern: match[0].substring(0, 100),
        type: pattern.type,
        risk: pattern.risk,
        description: pattern.description,
        source: sourceUrl,
        framework,
        lineContext: extractContext(body, match.index, match[0].length)
      });
    }
  }
  const fwSinks = FRAMEWORK_SINKS[framework] || [];
  for (const pattern of fwSinks) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(body)) !== null) {
      addSink({
        pattern: match[0].substring(0, 100),
        type: pattern.type,
        risk: pattern.risk,
        description: pattern.description,
        source: sourceUrl,
        framework,
        lineContext: extractContext(body, match.index, match[0].length)
      });
    }
  }
  return sinks;
}

// packages/backend/src/index.ts
var hostDataMap = /* @__PURE__ */ new Map();
var MAX_BODY_SIZE = 5 * 1024 * 1024;
function getHostData(host) {
  let data = hostDataMap.get(host);
  if (!data) {
    data = {
      host,
      framework: { framework: "unknown", confidence: 0, signals: [] },
      paths: [],
      sinks: [],
      analyzedUrls: []
    };
    hostDataMap.set(host, data);
  }
  return data;
}
function addPaths(hostData, newPaths) {
  const existingKeys = new Set(hostData.paths.map((p) => `${p.path}|${p.type}`));
  let added = 0;
  for (const p of newPaths) {
    const key = `${p.path}|${p.type}`;
    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      hostData.paths.push(p);
      added++;
    }
  }
  return added;
}
function addSinks(hostData, newSinks) {
  const existingKeys = new Set(
    hostData.sinks.map((s) => `${s.type}|${s.lineContext.substring(0, 60)}`)
  );
  let added = 0;
  for (const s of newSinks) {
    const key = `${s.type}|${s.lineContext.substring(0, 60)}`;
    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      hostData.sinks.push(s);
      added++;
    }
  }
  return added;
}
function getAllHosts(_sdk) {
  return Array.from(hostDataMap.keys()).sort();
}
function getHostAnalysis(_sdk, host) {
  return hostDataMap.get(host) || null;
}
function getAllData(_sdk) {
  return Array.from(hostDataMap.values());
}
function getStats(_sdk) {
  let totalPaths = 0;
  let totalSinks = 0;
  let dynamicPaths = 0;
  let highRiskSinks = 0;
  const frameworks = {};
  for (const data of hostDataMap.values()) {
    totalPaths += data.paths.length;
    totalSinks += data.sinks.length;
    dynamicPaths += data.paths.filter((p) => p.isDynamic).length;
    highRiskSinks += data.sinks.filter((s) => s.risk === "high").length;
    const fw = data.framework.framework;
    if (fw !== "unknown") {
      frameworks[fw] = (frameworks[fw] || 0) + 1;
    }
  }
  return {
    hosts: hostDataMap.size,
    totalPaths,
    totalSinks,
    dynamicPaths,
    highRiskSinks,
    frameworks
  };
}
function clearData(_sdk) {
  hostDataMap.clear();
  return { success: true };
}
function clearHost(_sdk, host) {
  hostDataMap.delete(host);
  return { success: true };
}
function init(sdk) {
  sdk.console.log("[CSPT Analyzer] Plugin initialized");
  sdk.api.register("getAllHosts", getAllHosts);
  sdk.api.register("getHostAnalysis", getHostAnalysis);
  sdk.api.register("getAllData", getAllData);
  sdk.api.register("getStats", getStats);
  sdk.api.register("clearData", clearData);
  sdk.api.register("clearHost", clearHost);
  sdk.events.onInterceptResponse(async (sdk2, request, response) => {
    try {
      const host = request.getHost();
      const url = request.getUrl();
      const path = request.getPath();
      const statusCode = response.getCode();
      const responseHeaders = response.getHeaders();
      const headers = {};
      for (const [key, values] of Object.entries(responseHeaders)) {
        headers[key.toLowerCase()] = values;
      }
      const contentType = getContentType(headers);
      if (contentType === "other") return;
      if (statusCode >= 400 && contentType === "html") return;
      const body = response.getBody();
      if (!body) return;
      if (body.length > MAX_BODY_SIZE) return;
      const bodyText = body.toText();
      if (!bodyText || bodyText.length < 10) return;
      const hostData = getHostData(host);
      if (hostData.analyzedUrls.includes(url)) return;
      hostData.analyzedUrls.push(url);
      if (hostData.analyzedUrls.length > 2e3) {
        hostData.analyzedUrls = hostData.analyzedUrls.slice(-1e3);
      }
      let frameworkUpdated = false;
      if (contentType === "html" || hostData.framework.framework === "unknown") {
        const detected = detectFramework(bodyText, headers, url);
        if (detected && detected.confidence > hostData.framework.confidence) {
          hostData.framework = detected;
          frameworkUpdated = true;
          sdk2.console.log(
            `[CSPT Analyzer] ${host}: Detected ${detected.framework} (confidence: ${detected.confidence}, signals: ${detected.signals.join(", ")})`
          );
        }
      }
      if (contentType === "js" && hostData.framework.framework === "unknown") {
        const detected = detectFramework(bodyText, headers, url);
        if (detected && detected.confidence > hostData.framework.confidence) {
          hostData.framework = detected;
          frameworkUpdated = true;
          sdk2.console.log(
            `[CSPT Analyzer] ${host}: Detected ${detected.framework} from JS (confidence: ${detected.confidence})`
          );
        }
      }
      const framework = hostData.framework.framework;
      const newPaths = extractPaths(bodyText, framework, url, contentType);
      const pathsAdded = addPaths(hostData, newPaths);
      const newSinks = analyzeSinks(bodyText, framework, url);
      const sinksAdded = addSinks(hostData, newSinks);
      if (pathsAdded > 0 || sinksAdded > 0 || frameworkUpdated) {
        sdk2.api.send("onNewFindings", {
          host,
          newPaths: pathsAdded,
          newSinks: sinksAdded,
          framework
        });
        if (pathsAdded > 0) {
          sdk2.console.log(
            `[CSPT Analyzer] ${host}: +${pathsAdded} paths (total: ${hostData.paths.length})`
          );
        }
        if (sinksAdded > 0) {
          sdk2.console.log(
            `[CSPT Analyzer] ${host}: +${sinksAdded} sinks (total: ${hostData.sinks.length})`
          );
        }
      }
      for (const sink of newSinks) {
        if (sink.risk === "high") {
          const dedupeKey = `cspt-${host}-${sink.type}-${sink.source}`;
          try {
            const exists = await sdk2.findings.exists(dedupeKey);
            if (!exists) {
              await sdk2.findings.create({
                title: `[CSPT] ${sink.type} on ${host}`,
                description: [
                  `Framework: ${framework}`,
                  `Sink Type: ${sink.type}`,
                  `Risk: ${sink.risk}`,
                  `Source: ${sink.source}`,
                  `Description: ${sink.description}`,
                  `Context: ${sink.lineContext}`
                ].join("\n"),
                reporter: "CSPT Analyzer",
                dedupeKey,
                request
              });
            }
          } catch {
          }
        }
      }
    } catch (err) {
      sdk2.console.error(`[CSPT Analyzer] Error processing response: ${err}`);
    }
  });
}
export {
  init
};
