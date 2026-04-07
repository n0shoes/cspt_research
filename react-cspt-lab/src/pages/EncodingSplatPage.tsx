import { useParams, useSearchParams, useLocation } from "react-router";

// Splat encoding diagnostic — shows catch-all route encoding behavior
// Navigate here with slashes and traversal to observe splat behavior
// e.g., /encoding-splat/a%2Fb/c  or  /encoding-splat/../api/secret
export default function EncodingSplatPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const splat = params["*"];
  const qParam = searchParams.get("q");
  const pathname = location.pathname;
  const hash = location.hash;
  const href = typeof window !== "undefined" ? window.location.href : "N/A";

  // The splat param preserves literal slashes from the URL path segments
  // but STILL decodes percent-encoded chars (%2F → /)
  const splatHasLiteralSlash = splat?.includes("/") ?? false;
  const splatHasDots = splat?.includes("..") ?? false;
  const rows = [
    {
      label: 'useParams()["*"]',
      value: splat,
      dangerous: splatHasDots || splatHasLiteralSlash,
      note: splatHasLiteralSlash
        ? "DECODED — literal slashes AND %2F→/ both present"
        : "Splat captures path segments joined with /",
    },
    {
      label: 'searchParams.get("q")',
      value: qParam,
      dangerous: qParam?.includes("/") || qParam?.includes(".."),
      note: "DECODED — query params decoded before JS sees them",
    },
    {
      label: "location.pathname",
      value: pathname,
      dangerous: false,
      note: "SAFE — preserves %2F encoding",
    },
    {
      label: "location.hash",
      value: hash,
      dangerous: hash?.includes(".."),
      note: "Raw hash — literal ../ works without encoding",
    },
    {
      label: "window.location.href",
      value: href,
      dangerous: false,
      note: "Full URL — browser-native representation",
    },
  ];

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 900 }}>
      <h1>Encoding Diagnostic — Splat Route (*)</h1>
      <p style={{ color: "#888" }}>
        Splat / catch-all route encoding behavior. The <code>*</code> segment is
        unique: it captures multiple path segments including literal slashes,
        AND still decodes percent-encoded characters.
      </p>

      <div
        style={{
          background: "#111",
          border: "1px solid #f44",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ color: "#f44", fontWeight: "bold", marginBottom: 6 }}>
          CRITICAL: Splat Route = Maximum CSPT Surface
        </div>
        <div style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: 1.7 }}>
          The splat param (<code>*</code>) gives attackers two traversal vectors:
          <br />
          1.{" "}
          <span style={{ color: "#f44" }}>
            Literal slashes
          </span>{" "}
          — navigate to <code>/encoding-splat/../api/secret</code> (no encoding
          needed)
          <br />
          2.{" "}
          <span style={{ color: "#f44" }}>
            Percent-encoded slashes
          </span>{" "}
          — <code>/encoding-splat/a%2Fb%2Fc</code> → <code>a/b/c</code> in
          splat
        </div>
      </div>

      <div
        style={{
          background: "#111",
          borderRadius: 8,
          border: "1px solid #333",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a1a1a" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.6rem 1rem",
                  color: "#888",
                  fontWeight: "normal",
                  fontSize: "0.8rem",
                  borderBottom: "1px solid #333",
                }}
              >
                Source
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.6rem 1rem",
                  color: "#888",
                  fontWeight: "normal",
                  fontSize: "0.8rem",
                  borderBottom: "1px solid #333",
                }}
              >
                Value
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.6rem 1rem",
                  color: "#888",
                  fontWeight: "normal",
                  fontSize: "0.8rem",
                  borderBottom: "1px solid #333",
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.6rem 1rem",
                  color: "#888",
                  fontWeight: "normal",
                  fontSize: "0.8rem",
                  borderBottom: "1px solid #333",
                }}
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: i < rows.length - 1 ? "1px solid #222" : "none",
                }}
              >
                <td style={{ padding: "0.6rem 1rem" }}>
                  <code style={{ color: "#f90" }}>{row.label}</code>
                </td>
                <td style={{ padding: "0.6rem 1rem" }}>
                  <code
                    style={{
                      color: row.dangerous ? "#f44" : "#4a4",
                      wordBreak: "break-all",
                    }}
                  >
                    {JSON.stringify(row.value)}
                  </code>
                </td>
                <td style={{ padding: "0.6rem 1rem" }}>
                  <span
                    style={{
                      color: row.dangerous ? "#f44" : "#4a4",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {row.dangerous ? "DANGEROUS" : "SAFE"}
                  </span>
                </td>
                <td
                  style={{
                    padding: "0.6rem 1rem",
                    color: "#888",
                    fontSize: "0.8rem",
                  }}
                >
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ color: "#888", fontSize: "0.85rem" }}>
        <strong style={{ color: "#ccc" }}>Test URLs:</strong>
        <ul style={{ marginTop: 8, lineHeight: "2" }}>
          <li>
            <a href="/encoding-splat/a/b/c">/encoding-splat/a/b/c</a> — literal
            slashes in splat
          </li>
          <li>
            <a href="/encoding-splat/a%2Fb/c">/encoding-splat/a%2Fb/c</a> —
            %2F in splat segment
          </li>
          <li>
            <a href="/encoding-splat/../api/secret">
              /encoding-splat/../api/secret
            </a>{" "}
            — literal traversal (may be normalized by browser)
          </li>
          <li>
            <a href="/encoding-splat/..%2F..%2Fapi%2Fsecret">
              /encoding-splat/..%2F..%2Fapi%2Fsecret
            </a>{" "}
            — encoded traversal payload
          </li>
        </ul>
      </div>
    </div>
  );
}
