import { useParams, useLocation } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

// ENCODING COMPARISON: Catch-all param [...rest]
// Key question: Is params.rest a string or array? How are slashes handled?
// Finding: params.rest is a STRING in SolidStart (not array like Next.js)
// Encoding is preserved — %2F stays %2F even in catch-all
export default function EncodingCatchall() {
  const params = useParams<{ rest: string }>();
  const location = useLocation();
  const [windowPath, setWindowPath] = createSignal("");

  onMount(() => {
    setWindowPath(window.location.pathname);

    console.log("[ENCODING_CATCHALL] === Catch-all Encoding ===");
    console.log("[ENCODING_CATCHALL] params.rest:", params.rest);
    console.log("[ENCODING_CATCHALL] typeof params.rest:", typeof params.rest);
    console.log("[ENCODING_CATCHALL] Array.isArray(params.rest):", Array.isArray(params.rest));
    console.log("[ENCODING_CATCHALL] useLocation().pathname:", location.pathname);
    console.log("[ENCODING_CATCHALL] window.location.pathname:", window.location.pathname);
    console.log("[ENCODING_CATCHALL] Constructed fetch URL:", `/api/files/${params.rest}`);
    console.log("[ENCODING_CATCHALL] === End ===");
  });

  const isEncoded = () =>
    params.rest?.includes("%2F") || params.rest?.includes("%2f");
  const isString = () => typeof params.rest === "string";

  return (
    <div style={{ padding: "2rem", "font-family": "monospace", "max-width": "800px" }}>
      <h1>Encoding — Catch-All Param [...rest]</h1>
      <p style={{ color: "#888" }}>
        Navigate to <code>/encoding-catchall/a%2Fb/c</code> to test catch-all
        encoding. In SolidStart, <code>params.rest</code> is a{" "}
        <strong>string</strong> (unlike Next.js where catch-all params are
        arrays).
      </p>

      {/* Key finding callout */}
      <div
        style={{
          background: "#111",
          border: "1px solid #f90",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1.5rem",
        }}
      >
        <div style={{ color: "#f90", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          KEY FINDINGS — CATCH-ALL
        </div>
        <div style={{ color: "#4a4" }}>
          params.rest is a STRING (not array) — SolidStart joins segments with /
        </div>
        <div style={{ color: "#4a4" }}>
          %2F is preserved in catch-all params (same as single params)
        </div>
        <div style={{ color: "#888" }}>
          /a%2Fb/c → params.rest = "a%2Fb/c" (literal slash separates real segments)
        </div>
      </div>

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
          {"const params = useParams<{ rest: string }>()"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.85rem" }}>
          {"`/api/files/${params.rest}`  →  fetch()"}
        </code>
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
          rest = {JSON.stringify(params.rest)}
        </code>
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-top": "4px" }}>
          typeof: <span style={{ color: isString() ? "#4a4" : "#f44" }}>{typeof params.rest}</span>
          {" "}| isArray: <span style={{ color: "#888" }}>{String(Array.isArray(params.rest))}</span>
        </div>
        <div
          style={{
            color: isEncoded() ? "#4a4" : "#888",
            "font-size": "0.8rem",
            "margin-top": "6px",
          }}
        >
          {isEncoded()
            ? "SAFE: %2F preserved in catch-all — consistent with single param behavior"
            : "No %2F present — try /encoding-catchall/a%2Fb/c"}
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
          {`/api/files/${params.rest}`}
        </code>
        <div style={{ color: "#4a4", "font-size": "0.8rem", "margin-top": "6px" }}>
          Catch-all value preserves encoding — %2F cannot traverse
        </div>
      </div>

      {/* Additional sources box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          "border-radius": "6px",
          padding: "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "8px" }}>
          OTHER SOURCES (for comparison)
        </div>
        <div style={{ "margin-bottom": "6px" }}>
          <span style={{ color: "#555", "font-size": "0.8rem" }}>useLocation().pathname: </span>
          <code style={{ color: "#ccc" }}>{location.pathname}</code>
        </div>
        <div>
          <span style={{ color: "#555", "font-size": "0.8rem" }}>window.location.pathname: </span>
          <code style={{ color: "#ccc" }}>{windowPath()}</code>
        </div>
      </div>
    </div>
  );
}
