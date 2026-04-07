"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// CSPT Pattern: useSearchParams() → fetch → /api/data/[dataId] (route handler)
// Risk: HIGH — searchParams decoded + route handler also decodes → traversal
// Default test: ?dataId=..%2F..%2Finternal
function DataDemoContent() {
  const searchParams = useSearchParams();
  const dataId = searchParams.get("dataId") ?? "..%2F..%2Finternal";
  const [result, setResult] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = `/api/data/${dataId}`;
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
  }, [dataId]);

  const hasDecoded = dataId.includes("/");
  const hasEncoded = dataId.includes("%2F") || dataId.includes("%2f");
  const hasDots = dataId.includes("..");

  return (
    <div style={{ fontFamily: "monospace", maxWidth: 700 }}>
      <h1>Route Handler Demo — /api/data/[dataId]</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useSearchParams().get("dataId")</code> → fetch to{" "}
        <code>/api/data/[dataId]</code>. Route handler decodes the dataId param
        via <code>await params</code>.
      </p>
      <p style={{ color: "#555", fontSize: "0.85rem" }}>
        Test URLs:{" "}
        <a href="?dataId=..%2F..%2Finternal" style={{ color: "#f44" }}>
          ?dataId=..%2F..%2Finternal
        </a>
        {" | "}
        <a href="?dataId=normaldata" style={{ color: "#4a4" }}>
          ?dataId=normaldata
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
          {"const dataId = useSearchParams().get(\"dataId\")"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"fetch(`/api/data/${dataId}`)"}
        </code>
        <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 6 }}>
          Route handler: <code>const {"{ dataId } = await params"}</code> —
          DECODES %2F to /
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
          dataId = {JSON.stringify(dataId)}
        </code>
        <div
          style={{
            color: hasDots || hasDecoded ? "#f44" : "#888",
            fontSize: "0.8rem",
            marginTop: 8,
          }}
        >
          {hasDecoded && hasDots
            ? "DANGEROUS: Browser decoded %2F to / — traversal dots visible — route handler path traversal will succeed"
            : hasEncoded && hasDots
            ? "Has %2F with dots — route handler will decode and traverse"
            : hasDots
            ? "Has traversal dots — check if slashes are also present"
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
          DANGEROUS: Route handler at /api/data/[dataId] decodes the param —
          %2F becomes / in dataId — traversal active.
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

export default function RouteHandlerDataDemo() {
  return (
    <div style={{ padding: "2rem" }}>
      <Suspense
        fallback={
          <div style={{ fontFamily: "monospace" }}>Loading demo…</div>
        }
      >
        <DataDemoContent />
      </Suspense>
    </div>
  );
}
