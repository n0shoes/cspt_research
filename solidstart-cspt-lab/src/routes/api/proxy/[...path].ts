import type { APIEvent } from "@solidjs/start/server";

// CSPT SINK: API route with catch-all - server-side path traversal
// /api/proxy/../../internal/admin -> proxied to internal service
export async function GET(event: APIEvent) {
  const path = event.params.path;
  const targetUrl = `http://internal-api.local/${path}`;

  console.log("[API_CSPT_SINK] Proxy path param:", path);
  console.log("[API_CSPT_SINK] Proxy target URL:", targetUrl);

  return new Response(
    JSON.stringify({
      message: "Proxy endpoint",
      requestedPath: path,
      constructedUrl: targetUrl,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
