import type { ClientPath, Framework } from "./types";

/**
 * Universal path patterns that work across all frameworks.
 * These target string literals in minified/bundled JS.
 */
const UNIVERSAL_PATTERNS: Array<{
  regex: RegExp;
  type: ClientPath["type"];
  label: string;
}> = [
  // API paths: "/api/...", "/v1/...", "/v2/...", "/graphql"
  {
    regex: /["'`](\/api\/[a-zA-Z0-9\/:_\-\[\].*{}]+)["'`]/g,
    type: "api",
    label: "API endpoint",
  },
  {
    regex: /["'`](\/v[0-9]+\/[a-zA-Z0-9\/:_\-\[\].*{}]+)["'`]/g,
    type: "api",
    label: "Versioned API",
  },
  {
    regex: /["'`](\/graphql\b[^"'`]*)["'`]/g,
    type: "api",
    label: "GraphQL endpoint",
  },
  // fetch/axios URL patterns (template literals)
  {
    regex: /fetch\s*\(\s*[`"']([^`"']+)[`"']/g,
    type: "fetch",
    label: "fetch() call",
  },
  {
    regex: /axios\.\w+\s*\(\s*[`"']([^`"']+)[`"']/g,
    type: "fetch",
    label: "axios call",
  },
  {
    regex: /\$http\.\w+\s*\(\s*[`"']([^`"']+)[`"']/g,
    type: "fetch",
    label: "$http call",
  },
  // Generic route-looking paths with dynamic segments
  {
    regex: /["'`](\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/:[a-zA-Z0-9_]+(?:\/[^"'`]*)?)["'`]/g,
    type: "route",
    label: "Route with :param",
  },
];

/**
 * Framework-specific route extraction patterns.
 * These are more targeted and produce higher-confidence results.
 */
const FRAMEWORK_PATTERNS: Record<
  Framework,
  Array<{ regex: RegExp; type: ClientPath["type"]; label: string }>
> = {
  "react-router": [
    // Route definitions: path: "/users/:id" or path="/users/:id"
    {
      regex: /path\s*[:=]\s*["'`](\/[^"'`]+)["'`]/g,
      type: "route",
      label: "React Router path definition",
    },
    // <Route path="..." /> in JSX (survives in bundled code as string)
    {
      regex: /Route[^>]*path\s*=\s*["']([^"']+)["']/g,
      type: "route",
      label: "<Route path> component",
    },
    // navigate("/path") or push("/path")
    {
      regex: /navigate\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "navigate() call",
    },
    // Link to="/path"
    {
      regex: /to\s*=\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Link to prop",
    },
    // v7 empirical: minified route config objects {path:"/users/:id",element:...}
    {
      regex: /\{path:"(\/[^"]+)"[^}]*(?:element|loader|children):/g,
      type: "route",
      label: "Minified route config object",
    },
    // v7 empirical: nested children routes {path:"stats",element:...}
    {
      regex: /children:\[[^\]]*\{path:"([^"]+)"/g,
      type: "route",
      label: "Nested child route",
    },
    // v7 empirical: lazy chunk imports import("./ChunkName-hash.js")
    {
      regex: /import\("\.\/([A-Za-z]+-[A-Za-z0-9]+\.js)"\)/g,
      type: "route",
      label: "Lazy chunk import",
    },
  ],
  nextjs: [
    // _buildManifest.js entries: "/users/[id]": [...]
    {
      regex: /["'](\/[a-zA-Z0-9_\-/\[\]\.]+)["']\s*:/g,
      type: "route",
      label: "Next.js build manifest route",
    },
    // Dynamic imports: () => import("./pages/users/[id]")
    {
      regex: /import\s*\(\s*["'][^"']*\/pages\/([\w\-/\[\]\.]+)["']\s*\)/g,
      type: "route",
      label: "Next.js dynamic page import",
    },
    // __NEXT_DATA__ contains routes in the page property
    {
      regex: /"page"\s*:\s*"(\/[^"]+)"/g,
      type: "route",
      label: "__NEXT_DATA__ page",
    },
    // router.push("/path")
    {
      regex: /router\.push\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Next.js router.push",
    },
    // Link href="/path"
    {
      regex: /href\s*=\s*["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]/g,
      type: "navigation",
      label: "Next.js Link href",
    },
    // API routes from fetch calls
    {
      regex: /fetch\s*\(\s*["'`](\/api\/[^"'`]+)["'`]/g,
      type: "api",
      label: "Next.js API route fetch",
    },
  ],
  remix: [
    // Remix route file convention shows in _data param
    {
      regex: /_data=routes\/([\w.$\-()]+)/g,
      type: "route",
      label: "Remix _data route reference",
    },
    // Route module paths
    {
      regex: /["']routes\/([\w.$\-()]+)["']/g,
      type: "route",
      label: "Remix route module",
    },
    // loader/action fetch patterns
    {
      regex: /path\s*[:=]\s*["'`](\/[^"'`]+)["'`]/g,
      type: "route",
      label: "Remix route path",
    },
  ],
  "vue-router": [
    // Route config: { path: "/users/:id", ... }
    {
      regex: /path\s*:\s*["'`](\/[^"'`]+)["'`]/g,
      type: "route",
      label: "Vue Router path config",
    },
    // router.push("/path") or router.push({ path: "/..." })
    {
      regex: /router\.push\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Vue router.push string",
    },
    {
      regex: /router\.push\s*\(\s*\{\s*path\s*:\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Vue router.push object",
    },
    // to="/path" on router-link
    {
      regex: /to\s*=\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "router-link to",
    },
    // Catch-all: /:pathMatch(.*)*
    {
      regex: /["'`](\/[^"'`]*:pathMatch[^"'`]*)["'`]/g,
      type: "route",
      label: "Vue catch-all route",
    },
  ],
  nuxt: [
    // Nuxt auto-generated routes from pages/
    {
      regex: /["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]\s*:/g,
      type: "route",
      label: "Nuxt page route",
    },
    // useFetch/useAsyncData URL
    {
      regex: /useFetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "Nuxt useFetch",
    },
    {
      regex: /\$fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "Nuxt $fetch",
    },
    // navigateTo("/path")
    {
      regex: /navigateTo\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Nuxt navigateTo",
    },
    // __nuxt_island paths
    {
      regex: /__nuxt_island\/([\w\-]+)/g,
      type: "api",
      label: "Nuxt island endpoint",
    },
  ],
  angular: [
    // Route config: { path: "users/:id", ... } (Angular paths don't start with /)
    {
      regex: /path\s*:\s*["'`]([a-zA-Z0-9\/:_\-.*]+)["'`]/g,
      type: "route",
      label: "Angular route config",
    },
    // router.navigate(["/path"])
    {
      regex: /router\.navigate\s*\(\s*\[\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Angular router.navigate",
    },
    // routerLink="/path"
    {
      regex: /routerLink\s*=\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "Angular routerLink",
    },
    // HttpClient calls: this.http.get("/api/...")
    {
      regex: /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "api",
      label: "Angular HttpClient call",
    },
  ],
  sveltekit: [
    // SvelteKit routes inferred from fetch in load functions
    {
      regex: /fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "SvelteKit fetch in load",
    },
    // goto("/path")
    {
      regex: /goto\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "SvelteKit goto",
    },
    // __SVELTEKIT_DATA__ route references
    {
      regex: /__sveltekit\/[^/]*\/([\w\-/]+)/g,
      type: "route",
      label: "SvelteKit data route",
    },
    // href="/path" in Svelte components
    {
      regex: /href\s*=\s*["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]/g,
      type: "navigation",
      label: "SvelteKit href",
    },
  ],
  ember: [
    // this.route('name', { path: '/path/:id' })
    {
      regex: /\.route\s*\(\s*["'](\w+)["']\s*,\s*\{\s*path\s*:\s*["'`]([^"'`]+)["'`]/g,
      type: "route",
      label: "Ember route definition",
    },
    // transitionTo("routeName")
    {
      regex: /transitionTo\s*\(\s*["']([^"']+)["']/g,
      type: "navigation",
      label: "Ember transitionTo",
    },
    // link-to with route name
    {
      regex: /link-to\s+["']([^"']+)["']/g,
      type: "navigation",
      label: "Ember link-to",
    },
    // Ember Data adapter URLs
    {
      regex: /urlFor\w+\s*\([^)]*["'`](\/[^"'`]+)["'`]/g,
      type: "api",
      label: "Ember Data adapter URL",
    },
  ],
  solidstart: [
    // File-based route paths
    {
      regex: /["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]\s*:/g,
      type: "route",
      label: "SolidStart route",
    },
    // createResource fetch
    {
      regex: /fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "SolidStart fetch",
    },
    // A("/path") navigation
    {
      regex: /navigate\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "navigation",
      label: "SolidStart navigate",
    },
  ],
  astro: [
    // Astro island data fetching
    {
      regex: /fetch\s*\(\s*["'`](\/[^"'`]+)["'`]/g,
      type: "fetch",
      label: "Astro fetch",
    },
    // href="/path" in Astro templates
    {
      regex: /href\s*=\s*["'`](\/[a-zA-Z0-9_\-/\[\]]+)["'`]/g,
      type: "navigation",
      label: "Astro href",
    },
  ],
  unknown: [],
};

/**
 * Checks if a path contains dynamic segments
 */
function isDynamicPath(path: string): boolean {
  return (
    path.includes(":") ||         // :param (React Router, Angular, Ember)
    /\[[^\]]+\]/.test(path) ||    // [param] (Next.js, SvelteKit, Nuxt, Astro, SolidStart)
    path.includes("*") ||         // splat/catch-all
    /\$\{/.test(path) ||          // template literal interpolation
    /\$\w+/.test(path)            // Remix $param in filenames
  );
}

/**
 * Clean and normalize extracted paths
 */
function normalizePath(raw: string): string {
  // Remove trailing commas, semicolons, whitespace
  let path = raw.trim().replace(/[,;}\s]+$/, "");
  // Remove query strings for route-type paths
  const qIdx = path.indexOf("?");
  if (qIdx > 0) path = path.substring(0, qIdx);
  // Ensure starts with / for route/api types
  if (!path.startsWith("/") && !path.startsWith("http")) {
    path = "/" + path;
  }
  return path;
}

/**
 * Filter out noise: common false positives
 */
function isNoisePath(path: string): boolean {
  // Too short or too long
  if (path.length < 2 || path.length > 200) return true;
  // File extensions that aren't routes
  if (/\.(css|svg|png|jpg|jpeg|gif|ico|woff2?|ttf|eot|map|json)$/i.test(path)) return true;
  // Just a slash
  if (path === "/") return true;
  // Data URIs, blobs, etc
  if (/^(data:|blob:|javascript:|mailto:)/i.test(path)) return true;
  // Common non-route paths
  if (/^\/(favicon|robots|sitemap|manifest|sw|service-worker|workbox)/i.test(path)) return true;
  // Webpack/bundler internals
  if (/webpack|__webpack|hot-update|\.module\./i.test(path)) return true;
  return false;
}

/**
 * Extract Next.js routes from _buildManifest.js content
 */
function extractNextBuildManifest(body: string): ClientPath[] {
  const paths: ClientPath[] = [];
  // Pattern: "/route/[param]": [...] or "/route/[...slug]": [...]
  const manifestRegex = /"(\/[^"]+)":\s*\[/g;
  let match;
  while ((match = manifestRegex.exec(body)) !== null) {
    const path = match[1]!;
    if (!isNoisePath(path) && !path.startsWith("/_next")) {
      paths.push({
        path: normalizePath(path),
        type: "route",
        source: "_buildManifest.js",
        framework: "nextjs",
        isDynamic: isDynamicPath(path),
      });
    }
  }
  return paths;
}

/**
 * Extract routes from __NEXT_DATA__ JSON in HTML
 */
function extractNextData(body: string): ClientPath[] {
  const paths: ClientPath[] = [];
  const nextDataMatch = body.match(
    /<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (nextDataMatch) {
    try {
      const data = JSON.parse(nextDataMatch[1]!);
      if (data.page) {
        paths.push({
          path: data.page,
          type: "route",
          source: "__NEXT_DATA__",
          framework: "nextjs",
          isDynamic: isDynamicPath(data.page),
        });
      }
      // Extract dynamic route segments from buildId URLs
      if (data.buildId) {
        const dynRoutes = body.match(
          new RegExp(`/_next/data/${data.buildId}/([^"]+)\\.json`, "g"),
        );
        if (dynRoutes) {
          for (const route of dynRoutes) {
            const path =
              "/" +
              route
                .replace(`/_next/data/${data.buildId}/`, "")
                .replace(/\.json$/, "");
            if (!isNoisePath(path)) {
              paths.push({
                path: normalizePath(path),
                type: "route",
                source: "__NEXT_DATA__",
                framework: "nextjs",
                isDynamic: isDynamicPath(path),
              });
            }
          }
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  }
  return paths;
}

/**
 * Extract routes from __NUXT__ payload in HTML
 */
function extractNuxtPayload(body: string): ClientPath[] {
  const paths: ClientPath[] = [];
  // __NUXT__ can contain route info
  const nuxtMatch = body.match(
    /window\.__NUXT__\s*=\s*(\{[\s\S]*?\});?\s*<\/script>/,
  );
  if (nuxtMatch) {
    // Extract path strings from the payload
    const pathRegex = /"path"\s*:\s*"(\/[^"]+)"/g;
    let match;
    while ((match = pathRegex.exec(nuxtMatch[1]!)) !== null) {
      const path = match[1]!;
      if (!isNoisePath(path)) {
        paths.push({
          path: normalizePath(path),
          type: "route",
          source: "__NUXT__",
          framework: "nuxt",
          isDynamic: isDynamicPath(path),
        });
      }
    }
  }
  return paths;
}

/**
 * Extract all client-side paths from a response body.
 */
export function extractPaths(
  body: string,
  framework: Framework,
  sourceUrl: string,
  contentType: "html" | "js",
): ClientPath[] {
  const paths: ClientPath[] = [];
  const seen = new Set<string>();

  const addPath = (p: ClientPath) => {
    const key = `${p.path}|${p.type}`;
    if (!seen.has(key) && !isNoisePath(p.path)) {
      seen.add(key);
      paths.push(p);
    }
  };

  // HTML-specific extractions
  if (contentType === "html") {
    // Next.js __NEXT_DATA__
    if (framework === "nextjs" || framework === "unknown") {
      for (const p of extractNextData(body)) addPath(p);
    }
    // Nuxt __NUXT__
    if (framework === "nuxt" || framework === "unknown") {
      for (const p of extractNuxtPayload(body)) addPath(p);
    }

    // Extract all href/src/action attributes from HTML
    const hrefRegex = /(?:href|src|action)\s*=\s*["'](\/[^"'#?][^"']*)["']/gi;
    let hrefMatch;
    while ((hrefMatch = hrefRegex.exec(body)) !== null) {
      const path = hrefMatch[1]!;
      if (!isNoisePath(path)) {
        addPath({
          path: normalizePath(path),
          type: "navigation",
          source: sourceUrl,
          framework,
          isDynamic: isDynamicPath(path),
        });
      }
    }
  }

  // Next.js _buildManifest.js
  if (
    contentType === "js" &&
    (sourceUrl.includes("_buildManifest") || sourceUrl.includes("_ssgManifest"))
  ) {
    for (const p of extractNextBuildManifest(body)) addPath(p);
  }

  // Framework-specific patterns
  const fwPatterns = FRAMEWORK_PATTERNS[framework] || [];
  for (const { regex, type, label } of fwPatterns) {
    // Reset regex state
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(body)) !== null) {
      // Some patterns have capture group 1, some have 2 (ember route)
      const raw = match[2] || match[1];
      if (!raw) continue;
      const path = normalizePath(raw);
      addPath({
        path,
        type,
        source: sourceUrl,
        framework,
        isDynamic: isDynamicPath(path),
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
      const path = normalizePath(raw);
      addPath({
        path,
        type,
        source: sourceUrl,
        framework,
        isDynamic: isDynamicPath(path),
      });
    }
  }

  return paths;
}
