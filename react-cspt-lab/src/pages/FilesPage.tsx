import { useState, useEffect } from "react";
import { useParams } from "react-router";

// CSPT Pattern: useParams()["*"] (splat) → fetch template literal
// Risk: CRITICAL — splat routes capture literal slashes WITHOUT encoding
// URL: /files/../api/secret → filePath = "../api/secret" (literal ../)
// No %2F needed! The * segment naturally passes slashes through decoded.
export default function FilesPage() {
  const params = useParams();
  const filePath = params["*"] ?? "";
  const [content, setContent] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");

  useEffect(() => {
    const url = `/api/files/${filePath}`;
    setFetchUrl(url);
    if (filePath) {
      fetch(url)
        .then((r) => r.json())
        .catch(() => ({ error: "fetch failed (expected — no server)" }))
        .then(setContent);
    }
  }, [filePath]);

  const hasDots = filePath.includes("..");
  const hasLiteralSlash = filePath.includes("/");

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>useParams()["*"] — Splat / Catch-All Route</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams()["*"]</code>. The splat segment captures
        everything after <code>/files/</code> including literal slashes. No
        encoding needed — navigate to <code>/files/../api/secret</code> for
        direct traversal.
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
          {"const filePath = useParams()[\"*\"]"}
        </code>
        <div style={{ color: "#888", fontSize: "0.75rem", marginTop: 6 }}>
          Route: <code>/files/*</code> — splat captures everything including slashes
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${hasDots ? "#f44" : hasLiteralSlash ? "#f90" : "#4a4"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUE from useParams()["*"]
        </div>
        <code
          style={{
            color: hasDots ? "#f44" : hasLiteralSlash ? "#f90" : "#4a4",
            fontSize: "1.1rem",
          }}
        >
          filePath = {JSON.stringify(filePath || "(empty)")}
        </code>
        <div
          style={{
            color: hasDots ? "#f44" : hasLiteralSlash ? "#f90" : "#888",
            fontSize: "0.8rem",
            marginTop: 8,
          }}
        >
          {!filePath
            ? "No path — try /files/../api/secret or /files/docs/readme.txt"
            : hasDots
            ? "CRITICAL: Literal ../ in splat — direct traversal, no encoding needed"
            : hasLiteralSlash
            ? "Literal slashes present — splat route passes them through unencoded"
            : "Path present — no traversal pattern detected yet"}
        </div>
        <div
          style={{
            background: "#111",
            borderRadius: 4,
            padding: "0.5rem",
            marginTop: 8,
            fontSize: "0.75rem",
            color: "#888",
          }}
        >
          Note: Unlike regular params (:userId), splat (*) routes capture slashes
          WITHOUT encoding. This means ../ traversal works with literal slashes,
          no %2F encoding required. Maximum CSPT surface.
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${hasDots ? "#f44" : "#555"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: hasDots ? "#f44" : "#ccc", fontSize: "1rem" }}>
          {fetchUrl || "(no path provided)"}
        </code>
        {hasDots && (
          <div style={{ color: "#f44", fontSize: "0.8rem", marginTop: 6 }}>
            CRITICAL: Traversal segments in fetch URL — the server will resolve ../ and escape the intended path
          </div>
        )}
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
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    </div>
  );
}
