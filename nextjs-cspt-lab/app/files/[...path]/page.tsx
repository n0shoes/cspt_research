// SERVER COMPONENT — catch-all route
// CSPT Pattern: await params (catch-all) → server-side fetch
// CORRECTED: Page server components get RE-ENCODED params (not decoded!)
// URL: /files/thepath%2fbooya → params.path = ["thepath%2Fbooya"] (re-encoded)
// SSRF works via indirection: page fetch → API route handler decodes → traversal

export default async function FilesPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const filePath = path.join("/");
  const fetchUrl = `http://localhost:3000/api/files/${filePath}`;

  const res = await fetch(fetchUrl, { cache: "no-store" });
  const data = await res.json().catch(() => ({ error: "Failed to parse" }));

  const anyDecoded =
    filePath.includes("/") && !filePath.startsWith("/");
  const hasEncodedSlash =
    filePath.includes("%2F") || filePath.includes("%2f");

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>await params — Catch-All Server Component</h1>
      <p style={{ color: "#888" }}>
        Source: <code>await params</code> reading <code>[...path]</code>. Page
        server components re-encode %2F — the encoded value is then forwarded to
        the API route handler, which decodes it (indirect SSRF).
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
          {"const { path } = await params  // [[...path]] catch-all"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"const filePath = path.join(\"/\")"}
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
        <div style={{ marginBottom: 4 }}>
          <code style={{ color: "#4a4" }}>
            params.path (array) = {JSON.stringify(path)}
          </code>
        </div>
        <div>
          <code style={{ color: "#4a4" }}>filePath = {JSON.stringify(filePath)}</code>
        </div>
        <div style={{ color: "#4a4", fontSize: "0.8rem", marginTop: 8 }}>
          {hasEncodedSlash
            ? "SAFE at this layer: %2F preserved in params — re-encoded by Next.js page component"
            : "No %2F in path — normal slash came from catch-all segment splitting"}
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
          WARNING: The encoded %2F is forwarded to /api/files/... route handler.
          The route handler WILL decode %2F to / — traversal happens there.
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
