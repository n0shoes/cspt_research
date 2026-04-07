import { useSearchParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";

// CSPT Pattern: useSearchParams()[0].source → fetch → innerHTML
// Risk: CRITICAL — searchParams are decoded (%2F → /), innerHTML renders arbitrary HTML
// URL: /dashboard/stats?source=../../attachments/malicious
export default function Stats() {
  const [searchParams] = useSearchParams<{ source?: string }>();

  const [html] = createResource(
    () => searchParams.source,
    async (source) => {
      if (!source) return null;
      const url = `/api/stats?source=${source}`;
      console.log("[CSPT_SINK] stats fetch URL:", url);
      const res = await fetch(url);
      return res.text();
    }
  );

  const source = () => searchParams.source ?? null;
  const hasDots = () => source()?.includes("..") ?? false;
  const fetchUrl = () => source() ? `/api/stats?source=${source()}` : null;

  return (
    <div style={{ "font-family": "monospace", "max-width": "700px" }}>
      <h1>useSearchParams() — Decoded Source (DANGEROUS)</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useSearchParams()[0].source</code>. Browser decodes %2F
        to / before JavaScript sees it. Even though SolidStart path params are
        safe, <strong>searchParams are still standard URLSearchParams</strong> —
        decoded on the client. Combined with <code>innerHTML</code>, this is a
        CSPT + XSS chain.
      </p>

      {/* SOURCE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          SOURCE
        </div>
        <code style={{ color: "#f90" }}>
          {"const [searchParams] = useSearchParams()"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.85rem" }}>
          {"`/api/stats?source=${searchParams.source}`  →  fetch()  →  innerHTML"}
        </code>
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-top": "6px" }}>
          Note: useSearchParams uses URLSearchParams — always decodes %2F to /
        </div>
      </div>

      {/* RAW VALUE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${hasDots() ? "#f44" : source() ? "#555" : "#333"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RAW VALUE from useSearchParams()
        </div>
        <code style={{ color: hasDots() ? "#f44" : "#ccc", "font-size": "1.1rem" }}>
          source = {JSON.stringify(source())}
        </code>
        <div
          style={{
            color: hasDots() ? "#f44" : "#888",
            "font-size": "0.8rem",
            "margin-top": "8px",
          }}
        >
          {source() === null
            ? "No source param — add ?source=..%2F..%2Fattachments%2Fmalicious to test"
            : hasDots()
            ? "DANGEROUS: %2F was decoded to / — traversal dots visible in value"
            : "Value present but no traversal pattern detected"}
        </div>
      </div>

      {/* FETCH URL box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${fetchUrl() ? "#f44" : "#555"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: fetchUrl() ? "#f44" : "#888", "font-size": "1rem" }}>
          {fetchUrl() ?? "(waiting for source param)"}
        </code>
        <Show when={fetchUrl()}>
          <div style={{ color: "#f44", "font-size": "0.8rem", "margin-top": "6px" }}>
            DANGEROUS: The / in the path came from decoded %2F — traversal is active
          </div>
        </Show>
      </div>

      {/* SINK box — innerHTML */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #f44",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          SINK — innerHTML (XSS)
        </div>
        <div style={{ color: "#f44", "font-size": "0.8rem", "margin-bottom": "8px" }}>
          The raw HTML response from fetch is injected into the DOM via{" "}
          <code>innerHTML</code> — if the fetched resource contains HTML/JS, it
          executes. SolidStart's <code>innerHTML</code> prop is NOT sanitized.
        </div>
        {/* XSS SINK: innerHTML with fetch response — SolidStart uses innerHTML prop directly */}
        <Show when={html()} fallback={<span style={{ color: "#555" }}>(no content loaded yet)</span>}>
          <div innerHTML={html()!} />
        </Show>
      </div>

      {/* RESULT box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #555",
          "border-radius": "6px",
          padding: "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RESULT (raw fetch response text)
        </div>
        <Show when={html.loading}>
          <span style={{ color: "#555" }}>loading...</span>
        </Show>
        <pre style={{ margin: 0, color: "#ccc", "white-space": "pre-wrap" }}>
          {html() ?? "(no content)"}
        </pre>
      </div>
    </div>
  );
}
