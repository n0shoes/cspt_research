"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// CSPT Pattern: useSearchParams() → fetch → dangerouslySetInnerHTML
// Risk: CRITICAL — searchParams are decoded, innerHTML renders arbitrary HTML
// URL: /dashboard/stats?widget=../../attachments/malicious
function StatsContent() {
  const searchParams = useSearchParams();
  const widget = searchParams.get("widget");
  const [html, setHtml] = useState("");
  const [fetchUrl, setFetchUrl] = useState("");

  useEffect(() => {
    if (widget) {
      const url = `/api/widgets/${widget}`;
      setFetchUrl(url);
      fetch(url)
        .then((r) => r.text())
        .then(setHtml);
    }
  }, [widget]);

  const isDecoded =
    widget !== null &&
    (widget.includes("/") || !widget.includes("%2F"));
  const hasDots = widget?.includes("..") ?? false;

  return (
    <div style={{ fontFamily: "monospace", maxWidth: 700 }}>
      <h1>useSearchParams() — Decoded Source (DANGEROUS)</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useSearchParams().get("widget")</code>. Browser decodes
        %2F to / before JavaScript sees it. Combined with{" "}
        <code>dangerouslySetInnerHTML</code>, this is a CSPT + XSS chain.
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
          {"const widget = searchParams.get(\"widget\")"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"`/api/widgets/${widget}`  →  fetch()  →  dangerouslySetInnerHTML"}
        </code>
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
          widget = {JSON.stringify(widget)}
        </code>
        <div
          style={{
            color: hasDots ? "#f44" : "#888",
            fontSize: "0.8rem",
            marginTop: 8,
          }}
        >
          {widget === null
            ? "No widget param — add ?widget=../../attachments/malicious to test"
            : hasDots
            ? "DANGEROUS: %2F was decoded to / — traversal dots visible in value"
            : "Value present but no traversal pattern detected"}
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${fetchUrl ? "#f44" : "#555"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: fetchUrl ? "#f44" : "#888", fontSize: "1rem" }}>
          {fetchUrl || "(waiting for widget param)"}
        </code>
        {fetchUrl && (
          <div style={{ color: "#f44", fontSize: "0.8rem", marginTop: 6 }}>
            DANGEROUS: The / in the path came from a decoded %2F — traversal is
            active
          </div>
        )}
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
          SINK — dangerouslySetInnerHTML (XSS)
        </div>
        <div style={{ color: "#f44", fontSize: "0.8rem", marginBottom: 8 }}>
          The raw HTML response from fetch is injected into the DOM — if the
          fetched resource contains HTML/JS, it executes.
        </div>
        {/* XSS SINK: dangerouslySetInnerHTML with fetch response */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {!html && (
          <span style={{ color: "#555" }}>(no content loaded yet)</span>
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
          RESULT (raw fetch response text)
        </div>
        <pre style={{ margin: 0, color: "#ccc", whiteSpace: "pre-wrap" }}>
          {html || "(no content)"}
        </pre>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  return (
    <div style={{ padding: "2rem" }}>
      <Suspense fallback={<div style={{ fontFamily: "monospace" }}>Loading stats...</div>}>
        <StatsContent />
      </Suspense>
    </div>
  );
}
