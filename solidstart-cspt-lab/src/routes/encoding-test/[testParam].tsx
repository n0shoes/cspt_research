import { useParams, useLocation, useSearchParams } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

// ENCODING COMPARISON: All param sources side by side
// Key finding: useParams() preserves %2F, but useSearchParams/window decode it
export default function EncodingTest() {
  const params = useParams<{ testParam: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams<{ q?: string }>();
  const [windowPath, setWindowPath] = createSignal("");
  const [windowHref, setWindowHref] = createSignal("");

  onMount(() => {
    setWindowPath(window.location.pathname);
    setWindowHref(window.location.href);

    console.log("[ENCODING_TEST] === Encoding Comparison ===");
    console.log("[ENCODING_TEST] useParams().testParam:", params.testParam);
    console.log("[ENCODING_TEST] useLocation().pathname:", location.pathname);
    console.log("[ENCODING_TEST] useSearchParams().q:", searchParams.q);
    console.log("[ENCODING_TEST] window.location.pathname:", window.location.pathname);
    console.log("[ENCODING_TEST] window.location.href:", window.location.href);
    console.log("[ENCODING_TEST] Constructed fetch URL:", `/api/test/${params.testParam}`);
    console.log("[ENCODING_TEST] === End ===");
  });

  const paramEncoded = () =>
    params.testParam?.includes("%2F") || params.testParam?.includes("%2f");
  const queryDecoded = () =>
    searchParams.q?.includes("/") && !searchParams.q?.includes("%2F");

  type RowDef = {
    source: string;
    getValue: () => string;
    isSafe: () => boolean | null;
    note: string;
  };

  const rows: RowDef[] = [
    {
      source: "useParams().testParam",
      getValue: () => params.testParam ?? "",
      isSafe: () => paramEncoded() ? true : null,
      note: "SAFE — SolidStart preserves %2F",
    },
    {
      source: "useLocation().pathname",
      getValue: () => location.pathname,
      isSafe: () => null,
      note: "Raw pathname — may or may not be decoded",
    },
    {
      source: "useSearchParams()[0].q",
      getValue: () => searchParams.q ?? "(none)",
      isSafe: () => queryDecoded() ? false : null,
      note: "URLSearchParams — decodes %2F to /",
    },
    {
      source: "window.location.pathname",
      getValue: () => windowPath(),
      isSafe: () => null,
      note: "Browser pathname — normalized by browser",
    },
    {
      source: "window.location.href",
      getValue: () => windowHref(),
      isSafe: () => null,
      note: "Full URL including encoded segments",
    },
    {
      source: "Constructed fetch URL",
      getValue: () => `/api/test/${params.testParam}`,
      isSafe: () => paramEncoded() ? true : null,
      note: "Template literal with testParam — encoding preserved",
    },
  ];

  return (
    <div style={{ padding: "2rem", "font-family": "monospace", "max-width": "800px" }}>
      <h1>Encoding Comparison — All Sources</h1>
      <p style={{ color: "#888" }}>
        Navigate to <code>/encoding-test/hello%2Fworld?q=hello%2Fworld</code> to
        compare how each source handles the same encoded value.
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
          KEY FINDING
        </div>
        <code style={{ color: "#4a4" }}>useParams().testParam</code>
        <span style={{ color: "#ccc" }}> — %2F stays %2F (SAFE, SolidStart-specific)</span>
        <br />
        <code style={{ color: "#f44" }}>useSearchParams()[0].q</code>
        <span style={{ color: "#ccc" }}> — %2F becomes / (DANGEROUS, standard URLSearchParams)</span>
      </div>

      {/* Row-by-row comparison */}
      {rows.map((row) => (
        <div
          style={{
            background: "#1a1a1a",
            border: `1px solid ${row.isSafe() === true ? "#4a4" : row.isSafe() === false ? "#f44" : "#333"}`,
            "border-radius": "6px",
            padding: "1rem",
            "margin-bottom": "0.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "margin-bottom": "4px",
            }}
          >
            <code style={{ color: "#f90", "font-size": "0.9rem" }}>{row.source}</code>
            <span
              style={{
                color:
                  row.isSafe() === true
                    ? "#4a4"
                    : row.isSafe() === false
                    ? "#f44"
                    : "#555",
                "font-size": "0.75rem",
              }}
            >
              {row.isSafe() === true
                ? "SAFE"
                : row.isSafe() === false
                ? "DANGEROUS"
                : "neutral"}
            </span>
          </div>
          <code
            style={{
              color:
                row.isSafe() === true
                  ? "#4a4"
                  : row.isSafe() === false
                  ? "#f44"
                  : "#ccc",
              "font-size": "1rem",
              display: "block",
              "margin-bottom": "4px",
            }}
          >
            {row.getValue()}
          </code>
          <div style={{ color: "#555", "font-size": "0.78rem" }}>{row.note}</div>
        </div>
      ))}
    </div>
  );
}
