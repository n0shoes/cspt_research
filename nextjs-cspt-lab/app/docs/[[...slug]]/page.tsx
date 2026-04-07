// SERVER COMPONENT — optional catch-all route
// CSPT Pattern: await params (optional catch-all) → server-side fetch
// Risk: MEDIUM (indirect) — same re-encoded behavior as catch-all, but also matches /docs
// The encoded value forwarded to /api/files/ route handler which decodes it

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const docPath = slug ? slug.join("/") : "index";
  const fetchUrl = `http://localhost:3000/api/files/${docPath}`;

  const res = await fetch(fetchUrl, { cache: "no-store" });
  const data = await res.json().catch(() => ({ error: "Failed to parse" }));

  const hasEncodedSlash =
    docPath.includes("%2F") || docPath.includes("%2f");

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>await params — Optional Catch-All Server Component</h1>
      <p style={{ color: "#888" }}>
        Source: <code>await params</code> reading <code>[[...slug]]</code>.
        Optional catch-all also matches <code>/docs</code> with no segments.
        Same re-encoding behavior as catch-all — %2F preserved at page layer,
        decoded by the route handler it forwards to.
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
          {"const { slug } = await params  // [[...slug]] optional catch-all"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"const docPath = slug ? slug.join(\"/\") : \"index\""}
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
            params.slug (array|undefined) ={" "}
            {JSON.stringify(slug ?? "undefined (no segments)")}
          </code>
        </div>
        <div>
          <code style={{ color: "#4a4" }}>
            resolved docPath = {JSON.stringify(docPath)}
          </code>
        </div>
        <div style={{ color: "#4a4", fontSize: "0.8rem", marginTop: 8 }}>
          {hasEncodedSlash
            ? "SAFE at this layer: %2F preserved — re-encoded by Next.js page component"
            : slug
            ? "No encoded slashes — normal segments were split into array"
            : "No slug — matched /docs with no segments, defaulted to 'index'"}
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
          WARNING: Forwarded to /api/files/ route handler which decodes %2F to
          / — traversal can happen at the handler level.
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
