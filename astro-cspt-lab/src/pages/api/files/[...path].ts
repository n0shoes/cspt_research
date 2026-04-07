import type { APIRoute } from 'astro';

// Catch-all API route
// Like page catch-alls, literal URL slashes become literal slashes in params
// %2F stays encoded (decodeURI), but real path slashes are not encoded at all

export const GET: APIRoute = async ({ params, url }) => {
  const { path } = params;

  const hasLiteralSlash = (path || '').includes('/');
  const hasEncodedSlash = (path || '').includes('%2F') || (path || '').includes('%2f');
  const hasDotDot = (path || '').includes('..');
  const segments = path ? path.split('/') : [];

  // CSPT SINK: catch-all API route — path includes literal slashes from URL
  const fetchUrl = `https://backend.internal/files/${path}`;

  let fetchResult: string | null = null;
  let fetchError: string | null = null;
  try {
    const res = await fetch(fetchUrl);
    fetchResult = await res.text();
  } catch (e) {
    fetchError = String(e);
  }

  const diagnostic = {
    source: 'Astro.params.path (catch-all API route [...path])',
    decoding: 'decodeURI() — literal URL slashes preserved, %2F preserved',
    'params.path': path,
    'url.pathname': url.pathname,
    parsedSegments: segments,
    flags: {
      hasLiteralSlash,
      hasEncodedSlash,
      hasDotDot,
      segmentCount: segments.length,
    },
    risk: (hasLiteralSlash && hasDotDot)
      ? 'CRITICAL: literal ../ in catch-all param — direct path traversal'
      : hasLiteralSlash
      ? 'HIGH: literal slashes in catch-all param'
      : hasEncodedSlash
      ? 'LOW: %2F preserved by decodeURI()'
      : 'MEDIUM: standard segments',
    constructedFetchUrl: fetchUrl,
    fetchResult,
    fetchError,
  };

  return new Response(JSON.stringify(diagnostic, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
