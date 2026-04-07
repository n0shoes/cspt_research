import { useParams, useSearchParams, useLocation } from "react-router";

// Encoding diagnostic — shows how React Router treats each source
// Navigate here with encoded characters to observe decoding behavior
// e.g., /encoding-test/hello%2Fworld?q=test%2Fvalue#my%2Fhash
export default function EncodingTestPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const testParam = params.testParam;
  const qParam = searchParams.get("q");
  const pathname = location.pathname;
  const search = location.search;
  const hash = location.hash;
  const href = typeof window !== "undefined" ? window.location.href : "N/A";
  const windowPathname =
    typeof window !== "undefined" ? window.location.pathname : "N/A";

  const rows = [
    {
      label: "useParams().testParam",
      value: testParam,
      dangerous:
        testParam?.includes("/") || testParam?.includes(".."),
      note: "DECODED via decodeURIComponent — %2F becomes /",
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
      note: "SAFE — preserves %2F encoding in pathname",
    },
    {
      label: "location.search",
      value: search,
      dangerous: false,
      note: "Raw search string — still encoded at this level",
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
      note: "Full URL — encoding status depends on browser",
    },
    {
      label: "window.location.pathname",
      value: windowPathname,
      dangerous: false,
      note: "Browser-native — preserves %2F",
    },
  ];

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 900 }}>
      <h1>Encoding Diagnostic — useParams vs location</h1>
      <p style={{ color: "#888" }}>
        React Router encoding behavior for each param source. Navigate with{" "}
        <code>%2F</code> in different positions to observe which sources decode
        it.
      </p>

      <div
        style={{
          background: "#111",
          border: "1px solid #f90",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ color: "#f90", fontWeight: "bold", marginBottom: 6 }}>
          Key Finding
        </div>
        <div style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: 1.7 }}>
          React Router calls <code>decodeURIComponent()</code> on ALL path
          params (<code>useParams()</code>). This is the opposite of Next.js App
          Router which re-encodes client params.{" "}
          <span style={{ color: "#f44" }}>
            Every path param source is a CSPT vector in React Router.
          </span>
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
            <a href="/encoding-test/hello%2Fworld">
              /encoding-test/hello%2Fworld
            </a>{" "}
            — %2F in path param
          </li>
          <li>
            <a href="/encoding-test/..%2F..%2Fapi%2Fsecret">
              /encoding-test/..%2F..%2Fapi%2Fsecret
            </a>{" "}
            — traversal payload
          </li>
          <li>
            <a href="/encoding-test/normal?q=test%2Fvalue">
              /encoding-test/normal?q=test%2Fvalue
            </a>{" "}
            — %2F in query param
          </li>
          <li>
            <a href="/encoding-test/normal#../../admin">
              /encoding-test/normal#../../admin
            </a>{" "}
            — traversal in hash
          </li>
        </ul>
      </div>
    </div>
  );
}
