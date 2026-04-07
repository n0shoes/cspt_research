import { NextRequest, NextResponse } from "next/server";

// Catch-all proxy — realistic API gateway pattern.
// `await params` in route handlers DECODES %2F → /, so attacker-controlled
// segments traverse out of /api/content/ and hit /api/internal/credentials.
//
// Normal:  /api/content/docs/getting-started → matched by specific route (not this handler)
// CSPT:    /api/content/docs/getting-started/..%2F..%2F..%2Finternal%2Fcredentials
//          → caught here → decoded → new URL() resolves ../ → fetches /api/internal/credentials

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const rawPath = path.join("/");
  const preResolveUrl = `/api/content/${rawPath}`;

  // new URL() resolves ../ in the path — this is the SSRF primitive.
  const targetUrl = new URL(preResolveUrl, request.nextUrl.origin);

  try {
    const res = await fetch(targetUrl);
    const data = await res.json();

    return NextResponse.json({
      _proxy: {
        handler: "catch-all route handler",
        decodedSegments: path,
        rawJoinedPath: rawPath,
        preResolveUrl,
        resolvedUrl: targetUrl.pathname,
        fetchedFrom: targetUrl.href,
      },
      ...data,
    });
  } catch {
    return NextResponse.json(
      { error: "Proxy fetch failed", resolvedUrl: targetUrl.pathname },
      { status: 502 }
    );
  }
}
