"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// CSPT Pattern: useSearchParams() → fetch → /api/files/[...path] (route handler)
// Risk: CRITICAL — searchParams decoded + catch-all route handler also decodes → direct traversal
// Default test: ?path=..%2F..%2Finternal%2Fsecrets
function FilesDemoContent() {
  const searchParams = useSearchParams();
  const path = searchParams.get("path") ?? "..%2F..%2Finternal%2Fsecrets";
  const [result, setResult] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = `/api/files/${path}`;
    setFetchUrl(url);
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setResult(d);
        setLoading(false);
      })
      .catch(() => {
        setResult({ error: "fetch failed" });
        setLoading(false);
      });
  }, [path]);

  const hasDecoded = path.includes("/");
  const hasEncoded = path.includes("%2F") || path.includes("%2f");
  const hasDots = path.includes("..");

  return (
    <div style={{ fontFamily: "monospace", maxWidth: 700 }}>
      <h1>Route Handler Demo — /api/files/[...path]</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useSearchParams().get("path")</code> → fetch to{" "}
        <code>/api/files/[...path]</code>. Catch-all route handler with{" "}
        <code>await params</code> decodes each segment. Compare with the page
        server component at <code>/files/</code> which re-encodes.
      </p>
      <p style={{ color: "#555", fontSize: "0.85rem" }}>
        Test URLs:{" "}
        <a
          href="?path=..%2F..%2Finternal%2Fsecrets"
          style={{ color: "#f44" }}
        >
          ?path=..%2F..%2Finternal%2Fsecrets
        </a>
        {" | "}
        <a href="?path=normal%2Ffile" style={{ color: "#4a4" }}>
          ?path=normal%2Ffile
        </a>
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
          {"const path = useSearchParams().get(\"path\")"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"fetch(`/api/files/${path}`)"}
        </code>
        <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 6 }}>
          Route handler: <code>const {"{ path } = await params"}</code> —
          catch-all, each segment DECODED. Compare: <code>/files/</code>{" "}
          page component re-encodes the same path.
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${hasDots || hasDecoded ? "#f44" : "#555"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUE from useSearchParams()
        </div>
        <code
          style={{
            color: hasDots || hasDecoded ? "#f44" : "#ccc",
            fontSize: "1.1rem",
          }}
        >
          path = {JSON.stringify(path)}
        </code>
        <div
          style={{
            color: hasDots || hasDecoded ? "#f44" : "#888",
            fontSize: "0.8rem",
            marginTop: 8,
          }}
        >
          {hasDecoded && hasDots
            ? "DANGEROUS: %2F decoded to / by browser + traversal dots present — route handler traversal will succeed"
            : hasEncoded && hasDots
            ? "Has %2F with traversal dots — route handler will decode and traverse"
            : "No traversal pattern detected"}
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #f44",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: "#f44", fontSize: "1rem" }}>
          {fetchUrl || "loading…"}
        </code>
        <div style={{ color: "#f44", fontSize: "0.8rem", marginTop: 6 }}>
          DANGEROUS: Catch-all route handler decodes each path segment — %2F
          becomes / in the params array — traversal crosses path boundaries.
        </div>
      </div>

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
          CONTRAST: page component (/files/) vs route handler (/api/files/)
        </div>
        <div style={{ color: "#4a4", marginBottom: 4 }}>
          /files/{path} → page component → await params → re-encodes %2F →
          SAFE
        </div>
        <div style={{ color: "#f44" }}>
          /api/files/{path} → route handler → await params → DECODES %2F →
          DANGEROUS
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
          RESULT from route handler
        </div>
        <pre style={{ margin: 0, color: "#ccc" }}>
          {loading ? "fetching…" : JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function RouteHandlerFilesDemo() {
  return (
    <div style={{ padding: "2rem" }}>
      <Suspense
        fallback={
          <div style={{ fontFamily: "monospace" }}>Loading demo…</div>
        }
      >
        <FilesDemoContent />
      </Suspense>
    </div>
  );
}
