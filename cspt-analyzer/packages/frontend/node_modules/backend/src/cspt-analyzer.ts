import type { CSPTSink, Framework } from "./types";

/**
 * CSPT sink patterns organized by framework.
 *
 * Each pattern looks for code where URL parameters flow into fetch/navigation sinks.
 * The key CSPT insight: if a framework decodes params (../  from %2e%2e) and the dev
 * interpolates them into fetch() URLs, the browser normalizes ../ before sending.
 *
 * Risk levels:
 * - high:   Direct param interpolation in fetch/API calls (classic CSPT)
 * - medium: Param used in URL construction that could lead to traversal
 * - low:    Param flows into a potentially dangerous sink but traversal less likely
 */

type SinkPattern = {
  regex: RegExp;
  type: string;
  risk: CSPTSink["risk"];
  description: string;
};

// =============================================================================
// UNIVERSAL SINKS (all frameworks)
// =============================================================================
const UNIVERSAL_SINKS: SinkPattern[] = [
  // fetch() with template literal containing ${}
  {
    regex: /fetch\s*\(\s*`[^`]*\/[^`]*\$\{[^}]+\}[^`]*`/g,
    type: "fetch-interpolation",
    risk: "high",
    description:
      "fetch() with interpolated variable in URL path. If the variable contains decoded '../' sequences, browser normalizes before sending.",
  },
  // fetch() with string concatenation
  {
    regex: /fetch\s*\(\s*["'][^"']*\/["']\s*\+\s*\w+/g,
    type: "fetch-concatenation",
    risk: "high",
    description:
      "fetch() with string concatenation in URL. Decoded route params can inject path traversal.",
  },
  // axios with template literal
  {
    regex: /axios\.\w+\s*\(\s*`[^`]*\/[^`]*\$\{[^}]+\}[^`]*`/g,
    type: "axios-interpolation",
    risk: "high",
    description:
      "axios call with interpolated variable in URL path.",
  },
  // axios with concatenation
  {
    regex: /axios\.\w+\s*\(\s*["'][^"']*\/["']\s*\+\s*\w+/g,
    type: "axios-concatenation",
    risk: "high",
    description:
      "axios call with string concatenation in URL path.",
  },
  // XMLHttpRequest.open with template literal
  {
    regex: /\.open\s*\(\s*["']\w+["']\s*,\s*`[^`]*\$\{[^}]+\}[^`]*`/g,
    type: "xhr-interpolation",
    risk: "high",
    description:
      "XMLHttpRequest.open() with interpolated URL.",
  },
  // dangerouslySetInnerHTML (React XSS amplification)
  {
    regex: /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:/g,
    type: "dangerouslySetInnerHTML",
    risk: "medium",
    description:
      "dangerouslySetInnerHTML sink. If fed by CSPT-fetched content, enables XSS.",
  },
  // .innerHTML assignment
  {
    regex: /\.innerHTML\s*=\s*[^;]+/g,
    type: "innerHTML",
    risk: "medium",
    description:
      "innerHTML assignment. CSPT to XSS chain if content comes from traversed endpoint.",
  },
  // Template literal fetch with params/route keyword nearby
  {
    regex: /(?:params|route|slug|id)\s*[\.\[]\s*\w*\s*[\]\)]?\s*[;,)}\s]*[\s\S]{0,60}fetch\s*\(/g,
    type: "param-near-fetch",
    risk: "medium",
    description:
      "Route parameter access near a fetch() call. Likely data flow from param to fetch URL.",
  },
];

// =============================================================================
// FRAMEWORK-SPECIFIC SINKS
// =============================================================================
const FRAMEWORK_SINKS: Record<Framework, SinkPattern[]> = {
  "react-router": [
    // useParams() followed by fetch in same scope
    {
      regex: /useParams\s*\(\s*\)[\s\S]{0,200}fetch\s*\(\s*[`"'][^`"']*\$?\{/g,
      type: "useParams-to-fetch",
      risk: "high",
      description:
        "React Router: useParams() value flows into fetch(). Params are decoded (../  from %2e%2e). Empirically confirmed: %2F→/ via decodePath()+matchPath() line 811.",
    },
    // params["*"] splat access
    {
      regex: /params\s*\[\s*["']\*["']\s*\]/g,
      type: "splat-param-access",
      risk: "high",
      description:
        "React Router: Splat/catch-all param access. Captures everything including slashes - highest CSPT risk. Regex is (.*) so multi-segment traversal works.",
    },
    // params.* destructured then used in URL
    {
      regex: /(?:const|let|var)\s*\{[^}]*\}\s*=\s*useParams\s*\(\s*\)/g,
      type: "useParams-destructure",
      risk: "medium",
      description:
        "React Router: useParams destructured. Check if values flow into fetch/navigation calls.",
    },
    // v7 empirical: minified useParams destructure → fetch ({x:n}=hookCall()...fetch)
    {
      regex: /\{\w+:\w+\}\s*=\s*\w{1,3}\(\s*\)[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "minified-useParams-to-fetch",
      risk: "high",
      description:
        "React Router (minified): Destructured hook result flows into fetch template literal. In production bundles, useParams becomes 2-letter identifier.",
    },
    // v7 empirical: splat access in minified code ["*"] near fetch
    {
      regex: /\w{1,3}\(\s*\)\s*\[\s*["']\*["']\s*\][\s\S]{0,200}fetch\s*\(/g,
      type: "minified-splat-to-fetch",
      risk: "high",
      description:
        "React Router (minified): Splat param access via [\"*\"] near fetch call. Splat captures across / boundaries.",
    },
    // v7 empirical: route loader function with params → fetch
    {
      regex: /\{params:\w+\}[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{\w+\.\w+\}/g,
      type: "loader-params-to-fetch",
      risk: "high",
      description:
        "React Router: Route loader/action destructures params and interpolates into fetch URL. Params are decoded same as useParams.",
    },
    // v7 empirical: API service layer pattern hiding the sink
    {
      regex: /\{\s*get\s*:\s*\w+\s*=>\s*fetch\s*\(\s*`[^`]*\$\{\w+\}`\s*\)/g,
      type: "api-service-layer",
      risk: "high",
      description:
        "React Router: API service object wrapping fetch with interpolation. Abstraction hides the CSPT sink from simple grep.",
    },
    // v7 empirical: TanStack Query queryFn with dynamic fetch
    {
      regex: /queryFn\s*:\s*\(\s*\)\s*=>\s*fetch\s*\(\s*`[^`]*\$\{[^}]+\}/g,
      type: "tanstack-query-fetch",
      risk: "high",
      description:
        "TanStack/React Query: queryFn fetches with interpolated param. queryKey and queryFn survive minification.",
    },
    // v7 empirical: useSearchParams near fetch
    {
      regex: /\.get\s*\(\s*["'][^"']+["']\s*\)[\s\S]{0,200}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "searchParams-to-fetch",
      risk: "high",
      description:
        "React Router: searchParams.get() flows into fetch. URLSearchParams auto-decodes values (../  from %2e%2e).",
    },
    // v7 empirical: dangerouslySetInnerHTML with single variable (app code)
    {
      regex: /dangerouslySetInnerHTML\s*:\s*\{\s*__html\s*:\s*\w{1,3}\s*\}/g,
      type: "dangerouslySetInnerHTML-var",
      risk: "high",
      description:
        "React: dangerouslySetInnerHTML with a variable (not static string). CSPT→XSS chain if content comes from traversed endpoint. This pattern survives minification verbatim.",
    },
  ],
  nextjs: [
    // Server Component with params and fetch (most dangerous - SSRF)
    {
      regex: /(?:await\s+)?params[\s\S]{0,100}fetch\s*\(\s*[`"'][^`"']*\$?\{/g,
      type: "server-component-fetch",
      risk: "high",
      description:
        "Next.js: Server Component/Route Handler uses params in fetch(). CSPT becomes SSRF with server credentials.",
    },
    // getServerSideProps with params in fetch
    {
      regex: /getServerSideProps[\s\S]{0,300}fetch\s*\(\s*[`"'][^`"']*\$?\{[^}]*params/g,
      type: "gssp-fetch",
      risk: "high",
      description:
        "Next.js: getServerSideProps interpolates params into fetch URL. Server-side SSRF.",
    },
    // useParams from next/navigation
    {
      regex: /useParams\s*\(\s*\)[\s\S]{0,200}fetch/g,
      type: "next-useParams-fetch",
      risk: "high",
      description:
        "Next.js: useParams() from next/navigation flows into fetch. Client-side CSPT.",
    },
    // Catch-all: params.slug array joined
    {
      regex: /(?:slug|path)\s*\.\s*join\s*\(\s*["'`]\/["'`]\s*\)/g,
      type: "catchall-join",
      risk: "high",
      description:
        "Next.js: Catch-all params joined with '/'. Array ['..','..','admin'] becomes '../../admin'.",
    },
  ],
  remix: [
    // Loader/action with params in fetch
    {
      regex: /(?:loader|action)\s*[\s\S]{0,200}params\.\w+[\s\S]{0,100}fetch\s*\(/g,
      type: "loader-param-fetch",
      risk: "high",
      description:
        "Remix: Loader/action accesses params and calls fetch(). Server-side SSRF via CSPT.",
    },
    // Splat params["*"]
    {
      regex: /params\s*\[\s*["']\*["']\s*\]/g,
      type: "remix-splat",
      risk: "high",
      description:
        "Remix: Splat route param access. Files.$.tsx captures everything after /files/.",
    },
    // useLoaderData consumed by dangerouslySetInnerHTML
    {
      regex: /useLoaderData[\s\S]{0,200}dangerouslySetInnerHTML/g,
      type: "loader-to-html",
      risk: "high",
      description:
        "Remix: Loader data flows to dangerouslySetInnerHTML. CSPT to XSS via controlled endpoint.",
    },
  ],
  "vue-router": [
    // route.params in fetch/useFetch
    {
      regex: /route\.params\.\w+[\s\S]{0,100}(?:fetch|useFetch|\$fetch)\s*\(/g,
      type: "vue-params-fetch",
      risk: "high",
      description:
        "Vue Router: route.params (DECODED) flows into fetch. Most exploitable framework - params deliver decoded slashes.",
    },
    // Template literal with route.params
    {
      regex: /`[^`]*\$\{[^}]*route\.params[^}]*\}[^`]*`/g,
      type: "vue-params-template",
      risk: "high",
      description:
        "Vue Router: route.params interpolated in template literal. Decoded '../' creates traversal.",
    },
    // watch + route.params + fetch
    {
      regex: /watch\s*\(\s*\(\s*\)\s*=>\s*route\.params/g,
      type: "vue-watch-params",
      risk: "medium",
      description:
        "Vue Router: Watcher on route.params. CSPT re-executes on every navigation reactively.",
    },
    // v-html directive
    {
      regex: /v-html\s*=\s*["'][^"']+["']/g,
      type: "v-html",
      risk: "medium",
      description:
        "Vue: v-html directive. CSPT to XSS if content comes from traversed endpoint.",
    },
    // Catch-all: pathMatch param
    {
      regex: /route\.params\.pathMatch/g,
      type: "vue-catchall-param",
      risk: "high",
      description:
        "Vue Router: pathMatch catch-all param. Array contains slashes - no encoding needed for traversal.",
    },
  ],
  nuxt: [
    // useFetch with route params
    {
      regex: /useFetch\s*\(\s*`[^`]*\$\{[^}]*(?:route\.params|params)\.[^}]+\}[^`]*`/g,
      type: "nuxt-useFetch-params",
      risk: "high",
      description:
        "Nuxt: useFetch() with route params in URL. Params are decoded by Vue Router.",
    },
    // $fetch with route params
    {
      regex: /\$fetch\s*\(\s*`[^`]*\$\{[^}]*(?:route\.params|params)\.[^}]+\}[^`]*`/g,
      type: "nuxt-fetch-params",
      risk: "high",
      description:
        "Nuxt: $fetch() with route params in URL.",
    },
    // Server route with getRouterParam
    {
      regex: /getRouterParam\s*\([^)]+\)[\s\S]{0,100}(?:fetch|\$fetch)/g,
      type: "nuxt-server-param-fetch",
      risk: "high",
      description:
        "Nuxt: Server route uses getRouterParam() then fetches. Server-side SSRF.",
    },
    // __nuxt_island key manipulation (CVE-2025-59414)
    {
      regex: /__nuxt_island/g,
      type: "nuxt-island",
      risk: "high",
      description:
        "Nuxt: __nuxt_island reference detected. CVE-2025-59414: stored CSPT via island payload revival.",
    },
  ],
  angular: [
    // paramMap.get() near http call
    {
      regex: /paramMap\.get\s*\(\s*["'][^"']+["']\s*\)[\s\S]{0,200}\.(?:get|post|put|delete|patch)\s*\(/g,
      type: "angular-param-http",
      risk: "high",
      description:
        "Angular: paramMap.get() flows into HttpClient call. Note: Angular preserves %2F but decodes %2e%2e.",
    },
    // Template literal with param in HttpClient
    {
      regex: /\.(?:get|post|put|delete|patch)\s*(?:<[^>]*>)?\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`/g,
      type: "angular-http-template",
      risk: "high",
      description:
        "Angular: HttpClient call with template literal interpolation.",
    },
    // snapshot.params in http call
    {
      regex: /snapshot\.param(?:s|Map)[\s\S]{0,100}\.(?:get|post|put|delete|patch)\s*\(/g,
      type: "angular-snapshot-http",
      risk: "high",
      description:
        "Angular: Route snapshot params flow into HttpClient call.",
    },
    // queryParamMap in fetch (Angular's wider CSPT surface)
    {
      regex: /queryParamMap\.get[\s\S]{0,100}(?:fetch|\.get|\.post)\s*\(/g,
      type: "angular-query-param-fetch",
      risk: "medium",
      description:
        "Angular: Query params in fetch. Angular's bigger CSPT surface since %2f is preserved in path params.",
    },
  ],
  sveltekit: [
    // params.X in fetch within load function
    {
      regex: /params\.\w+[\s\S]{0,100}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "sveltekit-load-fetch",
      risk: "high",
      description:
        "SvelteKit: params used in fetch() within load function. Server load = SSRF.",
    },
    // $page.params in fetch
    {
      regex: /\$page\.params\.\w+[\s\S]{0,100}fetch/g,
      type: "sveltekit-page-params-fetch",
      risk: "high",
      description:
        "SvelteKit: $page.params in component flows into fetch.",
    },
    // Rest params [...path] (any reference to params.path with fetch)
    {
      regex: /params\.path[\s\S]{0,60}fetch/g,
      type: "sveltekit-rest-params",
      risk: "high",
      description:
        "SvelteKit: Rest param 'path' near fetch. [...path] routes capture slashes - no encoding needed.",
    },
    // handleFetch hook (last defense)
    {
      regex: /handleFetch/g,
      type: "sveltekit-handleFetch",
      risk: "low",
      description:
        "SvelteKit: handleFetch hook detected. This intercepts fetch calls in load functions - check for CSPT defense.",
    },
  ],
  ember: [
    // model() hook with fetch
    {
      regex: /model\s*\(\s*params\s*\)[\s\S]{0,200}fetch\s*\(/g,
      type: "ember-model-fetch",
      risk: "high",
      description:
        "Ember: model() hook uses decoded params in fetch call.",
    },
    // Wildcard path access in model
    {
      regex: /params\.[\w_]+[\s\S]{0,60}fetch/g,
      type: "ember-params-fetch",
      risk: "high",
      description:
        "Ember: Route params accessed then used in fetch.",
    },
    // Ember Data findRecord
    {
      regex: /(?:store|this\.store)\.find(?:Record|All)\s*\(\s*["'][^"']+["']\s*,\s*params\./g,
      type: "ember-data-find",
      risk: "medium",
      description:
        "Ember: store.findRecord with route params. Custom adapters may not encode IDs.",
    },
  ],
  solidstart: [
    // useParams + createResource + fetch
    {
      regex: /useParams[\s\S]{0,200}createResource[\s\S]{0,200}fetch\s*\(/g,
      type: "solid-params-resource-fetch",
      risk: "high",
      description:
        "SolidStart: useParams → createResource → fetch chain. Reactive CSPT fires on every navigation.",
    },
    // 'use server' function with param in fetch
    {
      regex: /['"]use server['"][\s\S]{0,300}fetch\s*\(\s*`[^`]*\$\{/g,
      type: "solid-server-function-fetch",
      risk: "high",
      description:
        "SolidStart: Server function ('use server') with param interpolation in fetch. CSPT → SSRF.",
    },
    // createAsync + fetch
    {
      regex: /createAsync[\s\S]{0,100}fetch\s*\(/g,
      type: "solid-createAsync-fetch",
      risk: "medium",
      description:
        "SolidStart: createAsync near fetch call. Check if params flow into URL.",
    },
  ],
  astro: [
    // Astro.params in fetch
    {
      regex: /Astro\.params[\s\S]{0,100}fetch\s*\(/g,
      type: "astro-params-fetch",
      risk: "high",
      description:
        "Astro: Astro.params used near fetch(). In SSR mode, params are decoded from URL.",
    },
    // client:load island with fetch (hydration CSPT)
    {
      regex: /client:(?:load|visible|idle)[\s\S]{0,300}fetch\s*\(/g,
      type: "astro-island-fetch",
      risk: "medium",
      description:
        "Astro: Island with client directive near fetch. Hydration CSPT if server-decoded param is passed as prop.",
    },
    // getStaticPaths with external data
    {
      regex: /getStaticPaths[\s\S]{0,200}fetch\s*\(/g,
      type: "astro-static-external",
      risk: "low",
      description:
        "Astro: getStaticPaths fetches external data for params. Stored CSPT if CMS returns malicious slugs.",
    },
  ],
  unknown: [],
};

/**
 * Extract a ~120 char context window around a regex match.
 */
function extractContext(body: string, matchIndex: number, matchLength: number): string {
  const start = Math.max(0, matchIndex - 40);
  const end = Math.min(body.length, matchIndex + matchLength + 40);
  let ctx = body.substring(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) ctx = "..." + ctx;
  if (end < body.length) ctx = ctx + "...";
  return ctx;
}

/**
 * Analyze response body for CSPT sinks.
 */
export function analyzeSinks(
  body: string,
  framework: Framework,
  sourceUrl: string,
): CSPTSink[] {
  const sinks: CSPTSink[] = [];
  const seen = new Set<string>();

  const addSink = (sink: CSPTSink) => {
    // Dedupe by pattern + source
    const key = `${sink.type}|${sink.lineContext.substring(0, 60)}`;
    if (!seen.has(key)) {
      seen.add(key);
      sinks.push(sink);
    }
  };

  // Universal sinks
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
        lineContext: extractContext(body, match.index, match[0].length),
      });
    }
  }

  // Framework-specific sinks
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
        lineContext: extractContext(body, match.index, match[0].length),
      });
    }
  }

  return sinks;
}
