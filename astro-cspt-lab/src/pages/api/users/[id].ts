import type { APIRoute } from 'astro';

// API route param diagnostic
// Params in API routes are decoded with decodeURI() like page routes
// %2F stays encoded, but letter encoding (%61) decodes

export const GET: APIRoute = async ({ params, url }) => {
  const { id } = params;

  const hasEncodedSlash = (id || '').includes('%2F') || (id || '').includes('%2f');
  const hasLiteralSlash = (id || '').includes('/');
  const hasEncodedLetter = /%(6[1-9a-fA-F]|[4-5][0-9a-fA-F]|7[0-9a-eA-E])/.test(id || '');

  // CSPT SINK: API route param flows into fetch
  const fetchUrl = `https://backend.internal/users/${id}`;

  let fetchResult: unknown = null;
  let fetchError: string | null = null;
  try {
    const res = await fetch(fetchUrl);
    fetchResult = await res.json().catch(() => ({ error: 'non-JSON response' }));
  } catch (e) {
    fetchError = String(e);
  }

  const diagnostic = {
    source: 'Astro.params.id (API route)',
    decoding: 'decodeURI() — %2F preserved, letters decoded',
    'params.id': id,
    'url.pathname': url.pathname,
    'url.href': url.href,
    flags: {
      hasEncodedSlash,
      hasLiteralSlash,
      hasEncodedLetter,
    },
    risk: hasLiteralSlash
      ? 'HIGH: literal slash in API param → path traversal in fetch'
      : hasEncodedSlash
      ? 'MEDIUM: %2F preserved — no direct slash injection (decodeURI)'
      : hasEncodedLetter
      ? 'MEDIUM: letter encoding decoded (middleware bypass possible)'
      : 'LOW: standard param',
    constructedFetchUrl: fetchUrl,
    fetchResult,
    fetchError,
  };

  return new Response(JSON.stringify(diagnostic, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
