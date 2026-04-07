import { NextRequest, NextResponse } from "next/server";

// CSPT Pattern: Route handler catch-all → SSRF
// Risk: HIGH — route handler params are DECODED
// URL: /api/proxy/..%2F..%2Finternal/admin → path = ["../../internal", "admin"]
// URL: /api/proxy/..%2F169.254.169.254/latest/meta-data → SSRF to cloud metadata

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const targetPath = path.join("/");

  // SSRF sink: decoded catch-all params used in server-side fetch
  try {
    const res = await fetch(`http://localhost:3000/api/${targetPath}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json({
      proxy: true,
      targetPath,
      decodedSegments: path,
      response: data,
    });
  } catch {
    return NextResponse.json({
      proxy: true,
      targetPath,
      decodedSegments: path,
      error: "Upstream fetch failed",
    });
  }
}
