// SERVER COMPONENT — Encoding Differential Demonstrator
// Shows the critical finding: page components get RE-ENCODED params,
// but route handlers get DECODED params.
// Try: /encoding-diff/thepath%2fbooya
// Try: /encoding-diff/..%2F..%2Fadmin

export default async function EncodingDiffPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const joined = path.join("/");

  // Fetch the same path through a route handler to show the differential
  let handlerResult = null;
  try {
    const res = await fetch(`http://localhost:3000/api/files/${joined}`, {
      cache: "no-store",
    });
    handlerResult = await res.json();
  } catch {
    handlerResult = { error: "Fetch failed" };
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Encoding Differential Test</h1>
      <p style={{ color: "#888", marginBottom: "1rem" }}>
        This page demonstrates the encoding differential between page server
        components and route handlers. Both receive params via{" "}
        <code>await params</code>, but they get different values.
      </p>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div
          style={{
            flex: 1,
            minWidth: 300,
            padding: "1rem",
            border: "2px solid #4a4",
            borderRadius: 8,
          }}
        >
          <h2 style={{ color: "#4a4" }}>Page Server Component</h2>
          <p>
            <code>await params</code> via <code>getParamValue()</code>{" "}
            (re-encodes)
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 8px", color: "#888" }}>
                  params.path:
                </td>
                <td style={{ padding: "4px 8px" }}>{JSON.stringify(path)}</td>
              </tr>
              <tr>
                <td style={{ padding: "4px 8px", color: "#888" }}>
                  path.join(&apos;/&apos;):
                </td>
                <td style={{ padding: "4px 8px" }}>{joined}</td>
              </tr>
              <tr>
                <td style={{ padding: "4px 8px", color: "#888" }}>
                  Contains decoded /:
                </td>
                <td style={{ padding: "4px 8px" }}>
                  {path.some((s) => s.includes("/")) ? (
                    <span style={{ color: "#f44" }}>YES (decoded)</span>
                  ) : (
                    <span style={{ color: "#4a4" }}>NO (still encoded)</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 300,
            padding: "1rem",
            border: "2px solid #f44",
            borderRadius: 8,
          }}
        >
          <h2 style={{ color: "#f44" }}>Route Handler</h2>
          <p>
            <code>await params</code> via <code>getRouteMatcher()</code>{" "}
            (decodes directly)
          </p>
          {handlerResult && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "4px 8px", color: "#888" }}>
                    params.path:
                  </td>
                  <td style={{ padding: "4px 8px" }}>
                    {JSON.stringify(handlerResult.segments)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", color: "#888" }}>
                    path.join(&apos;/&apos;):
                  </td>
                  <td style={{ padding: "4px 8px" }}>{handlerResult.file}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", color: "#888" }}>
                    Contains decoded /:
                  </td>
                  <td style={{ padding: "4px 8px" }}>
                    {handlerResult.segments?.some((s: string) =>
                      s.includes("/")
                    ) ? (
                      <span style={{ color: "#f44" }}>
                        YES (decoded — VULNERABLE)
                      </span>
                    ) : (
                      <span style={{ color: "#4a4" }}>NO</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#111",
          borderRadius: 8,
        }}
      >
        <h3>Test URLs</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <a href="/encoding-diff/thepath%2fbooya" style={{ color: "#6cf" }}>
              /encoding-diff/thepath%2fbooya
            </a>{" "}
            — <code>%2F</code> encoding differential
          </li>
          <li>
            <a
              href="/encoding-diff/..%2F..%2Fadmin"
              style={{ color: "#6cf" }}
            >
              /encoding-diff/..%2F..%2Fadmin
            </a>{" "}
            — traversal payload
          </li>
          <li>
            <a
              href="/encoding-diff/..%2F..%2F..%2Fetc%2Fpasswd"
              style={{ color: "#6cf" }}
            >
              /encoding-diff/..%2F..%2F..%2Fetc%2Fpasswd
            </a>{" "}
            — deep traversal
          </li>
          <li>
            <a
              href="/encoding-diff/normal/path/here"
              style={{ color: "#6cf" }}
            >
              /encoding-diff/normal/path/here
            </a>{" "}
            — baseline (no encoding)
          </li>
          <li>
            <a
              href="/encoding-diff/test%252Fpath"
              style={{ color: "#6cf" }}
            >
              /encoding-diff/test%252Fpath
            </a>{" "}
            — double-encoded
          </li>
        </ul>
      </div>
    </div>
  );
}
