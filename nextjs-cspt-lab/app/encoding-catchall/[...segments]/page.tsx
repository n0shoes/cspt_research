// SERVER COMPONENT — encoding diagnostic for catch-all
// Shows how server-side params are DECODED (unlike client re-encoding)
// Try: /encoding-catchall/%2E%2E%2Fapi%2Fadmin → segments = ["../api/admin"]

export default async function EncodingCatchallPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;

  const results = {
    "params.segments": segments,
    "segments.join('/')": segments.join("/"),
    "typeof segments[0]": typeof segments[0],
    "segments.length": segments.length,
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Encoding Catch-All (Server Component)</h1>
      <p style={{ color: "#f90" }}>
        ⚠️ CORRECTED: Page server components receive RE-ENCODED params (not decoded).
        Only route handlers get decoded values.
      </p>
      <p style={{ color: "#888" }}>
        Try: <code>/encoding-catchall/%2E%2E%2Fapi%2Fadmin</code>
      </p>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
