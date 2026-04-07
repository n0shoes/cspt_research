import { defineMiddleware } from 'astro:middleware';

// CVE-2025-64765 middleware bypass demonstration
//
// The middleware checks context.url.pathname which is the RAW (undecoded) URL path.
// So /%61dmin has pathname = "/%61dmin", which does NOT start with "/admin".
// Middleware passes the request through.
//
// Astro then routes the request using decodeURI() to resolve the route.
// decodeURI("/%61dmin") = "/admin" — the admin page loads.
//
// The bypass: letter encoding (%61 = 'a') survives decodeURI() but fools string checks.
// %2F does NOT bypass because decodeURI() preserves %2F (reserved char), so pathname
// and the param both have %2F — the check would see /admin%2F... which still starts with /admin.
// The CVE was specifically about letter encoding, not slash encoding.

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  // VULNERABLE CHECK: compares against decoded path string
  // /%61dmin passes this check because "%61dmin" !== "admin"
  if (pathname.startsWith('/admin')) {
    console.log(`[MIDDLEWARE] BLOCKED: ${pathname}`);
    return new Response(
      JSON.stringify({
        error: 'Forbidden',
        message: 'Access denied by middleware',
        pathname,
        note: 'Try /%61dmin to bypass — %61 decodes to "a" after this check (CVE-2025-64765)',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  console.log(`[MIDDLEWARE] ALLOWED: ${pathname}`);
  return next();
});
