import type { DetectedFramework, Framework } from "./types";

type Signal = { pattern: RegExp | string; weight: number; label: string };

const FRAMEWORK_SIGNALS: Record<Framework, Signal[]> = {
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
    { pattern: /__NEXT_LOADED_PAGES__/, weight: 30, label: "__NEXT_LOADED_PAGES__" },
  ],
  nuxt: [
    { pattern: /__NUXT__/, weight: 40, label: "__NUXT__ payload" },
    { pattern: /_nuxt\//, weight: 30, label: "_nuxt/ assets" },
    { pattern: /nuxt\.config/, weight: 15, label: "nuxt.config reference" },
    { pattern: /__nuxt_island/, weight: 35, label: "__nuxt_island (CVE-2025-59414)" },
    { pattern: /NuxtPage/, weight: 20, label: "NuxtPage component" },
    { pattern: /useFetch|useAsyncData|\$fetch/, weight: 15, label: "Nuxt data fetching" },
    { pattern: /nuxt-link/, weight: 20, label: "nuxt-link component" },
    { pattern: /_payload\.json/, weight: 25, label: "_payload.json" },
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
    { pattern: /data-server-rendered/, weight: 10, label: "Vue SSR marker" },
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
    { pattern: /useLocation\(\) may be used only in the context/, weight: 25, label: "React Router error string" },
  ],
  remix: [
    { pattern: /__remixContext/, weight: 40, label: "__remixContext" },
    { pattern: /__remix/, weight: 30, label: "__remix marker" },
    { pattern: /remix-run/, weight: 30, label: "remix-run reference" },
    { pattern: /_data=routes\//, weight: 35, label: "Remix _data parameter" },
    { pattern: /LoaderFunctionArgs|ActionFunctionArgs/, weight: 25, label: "Remix loader/action args" },
    { pattern: /useLoaderData/, weight: 25, label: "useLoaderData hook" },
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
    { pattern: /ng-app/, weight: 15, label: "ng-app (AngularJS)" },
  ],
  sveltekit: [
    { pattern: /__sveltekit/, weight: 40, label: "__sveltekit data" },
    { pattern: /data-sveltekit/, weight: 30, label: "data-sveltekit attribute" },
    { pattern: /__SVELTEKIT_DATA__/, weight: 35, label: "__SVELTEKIT_DATA__" },
    { pattern: /svelte-[a-z0-9]+/, weight: 10, label: "Svelte class hash" },
    { pattern: /\$app\/stores/, weight: 25, label: "$app/stores import" },
    { pattern: /\$app\/navigation/, weight: 25, label: "$app/navigation import" },
    { pattern: /goto\(/, weight: 10, label: "goto() navigation" },
  ],
  ember: [
    { pattern: /ember-view/, weight: 30, label: "ember-view class" },
    { pattern: /ember-application/, weight: 30, label: "ember-application class" },
    { pattern: /__ember/, weight: 25, label: "__ember marker" },
    { pattern: /ember-cli/, weight: 20, label: "ember-cli reference" },
    { pattern: /Ember\./, weight: 15, label: "Ember. namespace" },
    { pattern: /ember-data/, weight: 20, label: "ember-data" },
    { pattern: /transitionTo/, weight: 10, label: "transitionTo call" },
  ],
  solidstart: [
    { pattern: /data-hk/, weight: 25, label: "Solid hydration key" },
    { pattern: /solid-js/, weight: 30, label: "solid-js reference" },
    { pattern: /solid-start/, weight: 35, label: "solid-start reference" },
    { pattern: /createResource/, weight: 15, label: "createResource" },
    { pattern: /createAsync/, weight: 15, label: "createAsync" },
    { pattern: /@solidjs\/router/, weight: 30, label: "@solidjs/router" },
  ],
  astro: [
    { pattern: /astro-island/, weight: 40, label: "astro-island component" },
    { pattern: /data-astro-/, weight: 30, label: "data-astro attribute" },
    { pattern: /<astro-/, weight: 25, label: "Astro custom element" },
    { pattern: /astro\.config/, weight: 15, label: "astro.config reference" },
    { pattern: /Astro\.params/, weight: 25, label: "Astro.params" },
    { pattern: /client:load|client:visible|client:idle/, weight: 30, label: "Astro client directives" },
  ],
  unknown: [],
};

// Priority order: more specific frameworks first to avoid false positives
const DETECTION_ORDER: Framework[] = [
  "nextjs",      // Check before generic react-router (Next.js uses React Router internally)
  "remix",       // Check before generic react-router (Remix uses React Router)
  "nuxt",        // Check before generic vue-router (Nuxt uses Vue Router)
  "sveltekit",
  "solidstart",
  "astro",
  "angular",
  "ember",
  "vue-router",     // Generic Vue after Nuxt
  "react-router",   // Generic React Router after Next.js and Remix
];

export function detectFramework(
  body: string,
  headers: Record<string, string[]>,
  url: string,
): DetectedFramework | null {
  const results: DetectedFramework[] = [];

  // Check headers for quick wins
  const poweredBy = headers["x-powered-by"]?.join(" ") || "";
  const headerStr = Object.entries(headers)
    .map(([k, v]) => `${k}: ${v.join(", ")}`)
    .join("\n");

  const combined = body + "\n" + headerStr;

  for (const framework of DETECTION_ORDER) {
    const signals = FRAMEWORK_SIGNALS[framework];
    let totalWeight = 0;
    const matchedSignals: string[] = [];

    for (const signal of signals) {
      const regex =
        typeof signal.pattern === "string"
          ? new RegExp(signal.pattern, "i")
          : signal.pattern;

      if (regex.test(combined)) {
        totalWeight += signal.weight;
        matchedSignals.push(signal.label);
      }
    }

    if (totalWeight >= 30) {
      results.push({
        framework,
        confidence: Math.min(totalWeight, 100),
        signals: matchedSignals,
      });
    }
  }

  if (results.length === 0) return null;

  // Return highest confidence, respecting priority order for ties
  results.sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    return (
      DETECTION_ORDER.indexOf(a.framework) -
      DETECTION_ORDER.indexOf(b.framework)
    );
  });

  return results[0]!;
}

/**
 * Quick check: is this response HTML or JS?
 */
export function getContentType(
  headers: Record<string, string[]>,
): "html" | "js" | "other" {
  const ct = (headers["content-type"] || []).join(" ").toLowerCase();
  if (ct.includes("text/html") || ct.includes("application/xhtml")) return "html";
  if (
    ct.includes("javascript") ||
    ct.includes("application/x-javascript") ||
    ct.includes("text/javascript")
  )
    return "js";
  return "other";
}
