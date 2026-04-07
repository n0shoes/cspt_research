// SERVER COMPONENT — single dynamic param
// CSPT Pattern: await params (single) → server-side fetch
// CORRECTED: Page server components get RE-ENCODED params
// URL: /data/..%2F..%2Finternal → params.dataId = "..%2F..%2Finternal" (re-encoded!)
// SSRF via indirection: re-encoded value sent to API route, which decodes it

export default async function DataPage({
  params,
}: {
  params: Promise<{ dataId: string }>;
}) {
  const { dataId } = await params;
  const fetchUrl = `http://localhost:3000/api/data/${dataId}`;

  const res = await fetch(fetchUrl, { cache: "no-store" });
  const data = await res.json().catch(() => ({ error: "Failed to parse" }));

  const hasEncodedSlash =
    dataId.includes("%2F") || dataId.includes("%2f");

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>await params — Single Param Server Component</h1>
      <p style={{ color: "#888" }}>
        Source: <code>await params</code> reading <code>[dataId]</code>. Page
        server components re-encode %2F. The encoded value is forwarded to the
        API route handler which decodes it (indirect SSRF path).
      </p>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          SOURCE
        </div>
        <code style={{ color: "#f90" }}>
          {"const { dataId } = await params"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"`http://localhost:3000/api/data/${dataId}`"}
        </code>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #4a4",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUE from await params
        </div>
        <code style={{ color: "#4a4", fontSize: "1.1rem" }}>
          dataId = {JSON.stringify(dataId)}
        </code>
        <div style={{ color: "#4a4", fontSize: "0.8rem", marginTop: 8 }}>
          {hasEncodedSlash
            ? "SAFE at this layer: %2F is preserved (re-encoded by Next.js page component)"
            : "No encoded slashes in this request"}
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #f90",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: "#f90", fontSize: "1rem" }}>{fetchUrl}</code>
        <div style={{ color: "#f90", fontSize: "0.8rem", marginTop: 6 }}>
          WARNING: This URL is sent to the /api/data/ route handler. That
          handler uses await params, which DECODES %2F to / — traversal can
          occur at the handler level.
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #555",
          borderRadius: 6,
          padding: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RESULT from fetch
        </div>
        <pre style={{ margin: 0, color: "#ccc" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
