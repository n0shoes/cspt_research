import type { APIRoute } from 'astro';

// CATASTROPHIC CSPT/SSRF SINK: full proxy pattern
// Attacker controls the entire path after the base URL
// Catch-all params include literal URL slashes — direct path traversal
// This pattern is the most dangerous: single request controls full backend path

export const GET: APIRoute = async ({ params, url }) => {
  const path = params.path;

  const hasLiteralSlash = (path || '').includes('/');
  const hasEncodedSlash = (path || '').includes('%2F') || (path || '').includes('%2f');
  const hasDotDot = (path || '').includes('..');

  // FULL PROXY — attacker controls everything after the domain
  const fetchUrl = `https://backend.internal/${path}`;

  let fetchResult: string | null = null;
  let fetchError: string | null = null;
  try {
    const res = await fetch(fetchUrl);
    fetchResult = await res.text();
  } catch (e) {
    fetchError = String(e);
  }

  const diagnostic = {
    source: 'Astro.params.path (FULL PROXY catch-all [...path])',
    pattern: 'CATASTROPHIC — attacker controls entire path after base URL',
    decoding: 'decodeURI() — literal slashes from URL preserved as-is',
    'params.path': path,
    'url.pathname': url.pathname,
    flags: {
      hasLiteralSlash,
      hasEncodedSlash,
      hasDotDot,
    },
    risk: 'CRITICAL: Full proxy — attacker can reach any internal endpoint',
    constructedFetchUrl: fetchUrl,
    attackExample: 'GET /api/proxy/../../internal/admin/users → fetches backend.internal/internal/admin/users',
    fetchResult,
    fetchError,
  };

  return new Response(JSON.stringify(diagnostic, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
