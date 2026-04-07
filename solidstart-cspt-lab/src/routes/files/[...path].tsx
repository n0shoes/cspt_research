import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";

// CSPT Pattern: useParams().path (catch-all) → fetch template literal
// Risk: LOW — SolidStart does NOT decode catch-all params either
// params.path is a string, %2F stays %2F even in [...path]
export default function FilePage() {
  const params = useParams<{ path: string }>();

  const [file] = createResource(
    () => params.path,
    async (path) => {
      const url = `/api/files/${path}`;
      console.log("[CSPT] catch-all fetch URL:", url);
      const res = await fetch(url);
      return res.json();
    }
  );

  const isEncoded = () =>
    params.path?.includes("%2F") || params.path?.includes("%2f");

  const fetchUrl = () => `/api/files/${params.path}`;

  return (
    <div style={{ padding: "2rem", "font-family": "monospace", "max-width": "700px" }}>
      <h1>useParams() — Catch-All Param [...path]</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams().path</code> reading <code>[...path]</code>.
        Catch-all params also preserve encoding in SolidStart — %2F stays %2F.
        This is the same behavior as single params, confirming the framework-wide pattern.
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
          {"const params = useParams<{ path: string }>()"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.85rem" }}>
          {"`/api/files/${params.path}`  →  fetch()"}
        </code>
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-top": "6px" }}>
          Note: params.path is a string (not array) in SolidStart catch-all routes
        </div>
      </div>

      {/* RAW VALUE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${isEncoded() ? "#4a4" : "#555"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RAW VALUE from useParams()
        </div>
        <code style={{ color: isEncoded() ? "#4a4" : "#ccc", "font-size": "1.1rem" }}>
          path = {JSON.stringify(params.path)}
        </code>
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-top": "4px" }}>
          typeof: {typeof params.path}
        </div>
        <div
          style={{
            color: isEncoded() ? "#4a4" : "#888",
            "font-size": "0.8rem",
            "margin-top": "6px",
          }}
        >
          {isEncoded()
            ? "SAFE: %2F is still encoded — catch-all also preserves encoding in SolidStart"
            : "No %2F present — try /files/thepath%2fbooya to test encoding"}
        </div>
      </div>

      {/* FETCH URL box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #4a4",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: "#4a4", "font-size": "1rem" }}>
          {fetchUrl()}
        </code>
        <div style={{ color: "#4a4", "font-size": "0.8rem", "margin-top": "6px" }}>
          %2F preserved — server cannot resolve ../ traversal from encoded slashes
        </div>
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
          RESULT from fetch
        </div>
        <Show when={!file.loading} fallback={<span style={{ color: "#555" }}>loading...</span>}>
          <pre style={{ margin: 0, color: "#ccc" }}>
            {JSON.stringify(file(), null, 2)}
          </pre>
        </Show>
      </div>
    </div>
  );
}
