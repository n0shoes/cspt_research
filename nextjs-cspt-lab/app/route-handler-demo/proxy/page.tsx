"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// CSPT Pattern: useSearchParams() → fetch → /api/proxy/[...path] (route handler)
// Risk: CRITICAL — searchParams decoded + route handler also decodes → direct traversal
// Default test: ?path=..%2F..%2Finternal%2Fadmin
function ProxyDemoContent() {
  const searchParams = useSearchParams();
  const path = searchParams.get("path") ?? "..%2F..%2Finternal%2Fadmin";
  const [result, setResult] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = `/api/proxy/${path}`;
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

  const hasDots = path.includes("..") || path.includes("%2F") || path.includes("%2f");

  return (
    <div style={{ fontFamily: "monospace", maxWidth: 700 }}>
      <h1>Route Handler Demo — /api/proxy/[...path]</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useSearchParams().get("path")</code> → fetch to{" "}
        <code>/api/proxy/[...path]</code>. The searchParam is decoded by the
        browser, then the route handler also decodes its param. Double-decoded
        path traversal.
      </p>
      <p style={{ color: "#555", fontSize: "0.85rem" }}>
        Test URLs:{" "}
        <a
          href="?path=..%2F..%2Finternal%2Fadmin"
          style={{ color: "#f44" }}
        >
          ?path=..%2F..%2Finternal%2Fadmin
        </a>
        {" | "}
        <a href="?path=normal-path" style={{ color: "#4a4" }}>
          ?path=normal-path
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
          {"fetch(`/api/proxy/${path}`)"}
        </code>
        <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 6 }}>
          Route handler: <code>await params</code> in route handler DECODES the
          path
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
          RAW VALUE from useSearchParams()
        </div>
        <code style={{ color: hasDots ? "#f44" : "#ccc", fontSize: "1.1rem" }}>
          path = {JSON.stringify(path)}
        </code>
        <div
          style={{
            color: hasDots ? "#f44" : "#888",
            fontSize: "0.8rem",
            marginTop: 8,
          }}
        >
          {hasDots
            ? "DANGEROUS: Browser decoded %2F to / — traversal visible in value. Route handler will also decode."
            : "No traversal pattern detected in this value"}
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
          DANGEROUS: Route handler at /api/proxy/[...path] uses await params
          which DECODES %2F to / — path traversal succeeds at handler.
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

export default function RouteHandlerProxyDemo() {
  return (
    <div style={{ padding: "2rem" }}>
      <Suspense
        fallback={
          <div style={{ fontFamily: "monospace" }}>Loading demo…</div>
        }
      >
        <ProxyDemoContent />
      </Suspense>
    </div>
  );
}
