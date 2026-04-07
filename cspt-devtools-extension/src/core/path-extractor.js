// Path extraction — ported from Caido plugin path-extractor.ts
// Universal + framework-specific route/API/fetch/navigation extraction

var DoctorScan = window.DoctorScan || {};
window.DoctorScan = DoctorScan;

const UNIVERSAL_PATTERNS = [
  { regex: /["'`](\/api\/[a-zA-Z0-9\/:_\-\[\].*{}]+)["'`]/g, type: "api", label: "API endpoint" },
  { regex: /["'`](\/v[0-9]+\/[a-zA-Z0-9\/:_\-\[\].*{}]+)["'`]/g, type: "api", label: "Versioned API" },
  { regex: /["'`](\/graphql\b[^"'`]*)["'`]/g, type: "api", label: "GraphQL endpoint" },
  { regex: /fetch\s*\(\s*[`"']([^`"']+)[`"']/g, type: "fetch", label: "fetch() call" },
  { regex: /axios\.\w+\s*\(\s*[`"']([^`"']+)[`"']/g, type: "fetch", label: "axios call" },
  { regex: /\$http\.\w+\s*\(\s*[`"']([^`"']+)[`"']/g, type: "fetch", label: "$http call" },
  { regex: /["'`](\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/:[a-zA-Z0-9_]+(?:\/[^"'`]*)?)["'`]/g, type: "route", label: "Route with :param" },
];

const FRAMEWORK_PATTERNS = {
  "react-router": [
    { regex: /path\s*[:=]\s*["'`](\/[^"'`]+)["'`]/g, type: "route", label: "React Router path definition" },
    { regex: /Route[^>]*path\s*=\s*["']([^"']+)["']/g, type: "route", label: "<Route path> component" },
    { regex: /navigate\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "navigate() call" },
    { regex: /to\s*=\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "Link to prop" },
    { regex: /\{path:"(\/[^"]+)"[^}]*(?:element|loader|children):/g, type: "route", label: "Minified route config object" },
    { regex: /children:\[[^\]]*\{path:"([^"]+)"/g, type: "route", label: "Nested child route" },
    { regex: /import\("\.\/([A-Za-z]+-[A-Za-z0-9]+\.js)"\)/g, type: "route", label: "Lazy chunk import" },
  ],
  nextjs: [
    { regex: /"(\/[^"]+)"\s*:\s*\[/g, type: "route", label: "Next.js build manifest route" },
    { regex: /import\s*\(\s*["'][^"']*\/pages\/([\w\-/\[\]\.]+)["']\s*\)/g, type: "route", label: "Next.js dynamic page import" },
    { regex: /"page"\s*:\s*"(\/[^"]+)"/g, type: "route", label: "__NEXT_DATA__ page" },
    { regex: /router\.push\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "Next.js router.push" },
    { regex: /href\s*=\s*["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]/g, type: "navigation", label: "Next.js Link href" },
    { regex: /fetch\s*\(\s*["'`](\/api\/[^"'`]+)["'`]/g, type: "api", label: "Next.js API route fetch" },
  ],
  remix: [
    { regex: /_data=routes\/([\w.$\-()]+)/g, type: "route", label: "Remix _data route reference" },
    { regex: /["']routes\/([\w.$\-()]+)["']/g, type: "route", label: "Remix route module" },
    { regex: /path\s*[:=]\s*["'`](\/[^"'`]+)["'`]/g, type: "route", label: "Remix route path" },
  ],
  "vue-router": [
    { regex: /path\s*:\s*["'`](\/[^"'`]+)["'`]/g, type: "route", label: "Vue Router path config" },
    { regex: /router\.push\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "Vue router.push string" },
    { regex: /router\.push\s*\(\s*\{\s*path\s*:\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "Vue router.push object" },
    { regex: /to\s*=\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "router-link to" },
    { regex: /["'`](\/[^"'`]*:pathMatch[^"'`]*)["'`]/g, type: "route", label: "Vue catch-all route" },
  ],
  nuxt: [
    { regex: /["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]\s*:/g, type: "route", label: "Nuxt page route" },
    { regex: /useFetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "fetch", label: "Nuxt useFetch" },
    { regex: /\$fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "fetch", label: "Nuxt $fetch" },
    { regex: /navigateTo\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "Nuxt navigateTo" },
    { regex: /__nuxt_island\/([\w\-]+)/g, type: "api", label: "Nuxt island endpoint" },
  ],
  angular: [
    { regex: /path\s*:\s*["'`]([a-zA-Z0-9\/:_\-.*]+)["'`]/g, type: "route", label: "Angular route config" },
    { regex: /router\.navigate\s*\(\s*\[\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "Angular router.navigate" },
    { regex: /routerLink\s*=\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "Angular routerLink" },
    { regex: /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "api", label: "Angular HttpClient call" },
  ],
  sveltekit: [
    { regex: /fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "fetch", label: "SvelteKit fetch in load" },
    { regex: /goto\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "SvelteKit goto" },
    { regex: /__sveltekit\/[^/]*\/([\w\-/]+)/g, type: "route", label: "SvelteKit data route" },
    { regex: /href\s*=\s*["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]/g, type: "navigation", label: "SvelteKit href" },
  ],
  ember: [
    { regex: /\.route\s*\(\s*["'](\w+)["']\s*,\s*\{\s*path\s*:\s*["'`]([^"'`]+)["'`]/g, type: "route", label: "Ember route definition" },
    { regex: /transitionTo\s*\(\s*["']([^"']+)["']/g, type: "navigation", label: "Ember transitionTo" },
    { regex: /link-to\s+["']([^"']+)["']/g, type: "navigation", label: "Ember link-to" },
    { regex: /urlFor\w+\s*\([^)]*["'`](\/[^"'`]+)["'`]/g, type: "api", label: "Ember Data adapter URL" },
  ],
  solidstart: [
    { regex: /["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]\s*:/g, type: "route", label: "SolidStart route" },
    { regex: /fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "fetch", label: "SolidStart fetch" },
    { regex: /navigate\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "navigation", label: "SolidStart navigate" },
  ],
  astro: [
    { regex: /fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g, type: "fetch", label: "Astro fetch" },
    { regex: /href\s*=\s*["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]/g, type: "navigation", label: "Astro href" },
  ],
};

function isDynamicPath(path) {
  return (
    path.includes(":") ||
    /\[[^\]]+\]/.test(path) ||
    path.includes("*") ||
    /\$\{/.test(path) ||
    /\$\w+/.test(path)
  );
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
  const manifestRegex = /"(\/[^"]+)"\s*:\s*\[/g;
  let match;
  while ((match = manifestRegex.exec(body)) !== null) {
    const path = match[1];
    if (!isNoisePath(path) && !path.startsWith("/_next")) {
      paths.push({
        path: normalizePath(path), type: "route",
        source: "_buildManifest.js", framework: "nextjs",
        isDynamic: isDynamicPath(path),
      });
    }
  }
  return paths;
}

function extractNextData(body) {
  const paths = [];
  const nextDataMatch = body.match(/<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (nextDataMatch) {
    try {
      const data = JSON.parse(nextDataMatch[1]);
      if (data.page) {
        paths.push({
          path: data.page, type: "route", source: "__NEXT_DATA__",
          framework: "nextjs", isDynamic: isDynamicPath(data.page),
        });
      }
      if (data.buildId) {
        const dynRoutes = body.match(new RegExp(`/_next/data/${data.buildId}/([^"]+)\\.json`, "g"));
        if (dynRoutes) {
          for (const route of dynRoutes) {
            const path = "/" + route.replace(`/_next/data/${data.buildId}/`, "").replace(/\.json$/, "");
            if (!isNoisePath(path)) {
              paths.push({
                path: normalizePath(path), type: "route", source: "__NEXT_DATA__",
                framework: "nextjs", isDynamic: isDynamicPath(path),
              });
            }
          }
        }
      }
    } catch {}
  }
  return paths;
}

function extractNuxtPayload(body) {
  const paths = [];
  const nuxtMatch = body.match(/window\.__NUXT__\s*=\s*(\{[\s\S]*?\});?\s*<\/script>/);
  if (nuxtMatch) {
    const pathRegex = /"path"\s*:\s*"(\/[^"]+)"/g;
    let match;
    while ((match = pathRegex.exec(nuxtMatch[1])) !== null) {
      const path = match[1];
      if (!isNoisePath(path)) {
        paths.push({
          path: normalizePath(path), type: "route", source: "__NUXT__",
          framework: "nuxt", isDynamic: isDynamicPath(path),
        });
      }
    }
  }
  return paths;
}

DoctorScan.extractPaths = function(body, framework, sourceUrl, contentType) {
  const paths = [];
  const seen = new Set();

  const addPath = (p) => {
    const key = `${p.path}|${p.type}`;
    if (!seen.has(key) && !isNoisePath(p.path)) {
      seen.add(key);
      paths.push(p);
    }
  };

  // HTML-specific extractions
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
          path: normalizePath(path), type: "navigation", source: sourceUrl,
          framework, isDynamic: isDynamicPath(path),
        });
      }
    }
  }

  // Next.js _buildManifest.js
  if (contentType === "js" && (sourceUrl.includes("_buildManifest") || sourceUrl.includes("_ssgManifest"))) {
    for (const p of extractNextBuildManifest(body)) addPath(p);
  }

  // Framework-specific patterns
  const fwPatterns = FRAMEWORK_PATTERNS[framework] || [];
  for (const { regex, type, label } of fwPatterns) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(body)) !== null) {
      const raw = match[2] || match[1];
      if (!raw) continue;
      addPath({
        path: normalizePath(raw), type, source: sourceUrl,
        framework, isDynamic: isDynamicPath(raw),
      });
    }
  }

  // Universal patterns
  for (const { regex, type, label } of UNIVERSAL_PATTERNS) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(body)) !== null) {
      const raw = match[1];
      if (!raw) continue;
      addPath({
        path: normalizePath(raw), type, source: sourceUrl,
        framework, isDynamic: isDynamicPath(raw),
      });
    }
  }

  return paths;
};
