export default function HomePage() {
  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "monospace",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>Next.js CSPT Lab</h1>
      <p style={{ color: "#888", marginBottom: "1rem" }}>
        Client-Side Path Traversal research lab — Next.js App Router 15.5.12
      </p>

      {/* Key finding box — keep at top */}
      <div
        style={{
          padding: "1rem",
          background: "#111",
          borderRadius: 8,
          marginBottom: "2rem",
          border: "1px solid #333",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem", color: "#f90" }}>
          Key Finding: Encoding Differential
        </h3>
        <p style={{ margin: 0, color: "#ccc", lineHeight: 1.6 }}>
          <code>await params</code> in <strong>page server components</strong>{" "}
          returns <span style={{ color: "#4a4" }}>RE-ENCODED</span> values
          (%2F stays %2F).
          <br />
          <code>await params</code> in <strong>route handlers</strong> returns{" "}
          <span style={{ color: "#f44" }}>DECODED</span> values (%2F becomes
          /).
          <br />
          <code>useParams()</code> on the <strong>client</strong> returns{" "}
          <span style={{ color: "#4a4" }}>RE-ENCODED</span> values (same as
          page components).
          <br />
          <code>useSearchParams()</code> and <code>location.hash</code> on the{" "}
          <strong>client</strong> return{" "}
          <span style={{ color: "#f44" }}>DECODED</span> values (%2F becomes
          /).
          <br />
          <strong>
            Only route handlers, searchParams, and hash decode %2F out of the
            box.
          </strong>
        </p>
      </div>

      {/* CSPT DEMO — the main event */}
      <div
        style={{
          padding: "1rem",
          background: "#1a0000",
          borderRadius: 8,
          marginBottom: "2rem",
          border: "2px solid #f44",
        }}
      >
        <h2 style={{ margin: "0 0 0.5rem", color: "#f44" }}>
          CSPT Demo: Route Handler <code>await params</code>
        </h2>
        <p style={{ color: "#ccc", margin: "0 0 0.75rem", lineHeight: 1.6 }}>
          Page <code>await params</code> re-encodes, but route handler{" "}
          <code>await params</code> <strong>decodes</strong> %2F → /. The
          catch-all proxy uses <code>new URL()</code> which resolves ../ —
          SSRF to <code>/api/internal/credentials</code>.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a
            href="/cspt-await-params/docs/getting-started"
            style={{
              color: "#4a4",
              padding: "0.5rem 1rem",
              border: "1px solid #4a4",
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            Normal: /docs/getting-started
          </a>
          <a
            href="/cspt-await-params/docs/getting-started/..%2F..%2F..%2Finternal%2Fcredentials"
            style={{
              color: "#f44",
              padding: "0.5rem 1rem",
              border: "1px solid #f44",
              borderRadius: 4,
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            CSPT: /docs/getting-started/..%2F..%2F..%2Finternal%2Fcredentials
          </a>
        </div>
      </div>

      {/* DANGEROUS SOURCES */}
      <div
        style={{
          padding: "1rem",
          background: "#1a0000",
          borderRadius: 8,
          marginBottom: "2rem",
          border: "1px solid #f44",
        }}
      >
        <h2 style={{ margin: "0 0 0.75rem", color: "#f44" }}>
          DANGEROUS SOURCES (decode %2F to /)
        </h2>

        <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
          These sources return a decoded value — %2F becomes / before JavaScript
          sees it. Combined with a fetch sink, path traversal is possible.
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  color: "#888",
                  fontWeight: "normal",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #333",
                  fontSize: "0.8rem",
                }}
              >
                Source
              </th>
              <th
                style={{
                  textAlign: "left",
                  color: "#888",
                  fontWeight: "normal",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #333",
                  fontSize: "0.8rem",
                }}
              >
                Demo
              </th>
              <th
                style={{
                  textAlign: "left",
                  color: "#888",
                  fontWeight: "normal",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #333",
                  fontSize: "0.8rem",
                }}
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#f44" }}>
                <code>useSearchParams()</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a
                  href="/dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious"
                  style={{ color: "#f44" }}
                >
                  /dashboard/stats?widget=..%2F..%2Fattachments%2Fmalicious
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                CSPT + dangerouslySetInnerHTML → XSS chain
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#f44" }}>
                <code>location.hash</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a
                  href="/dashboard/settings#../../admin/users"
                  style={{ color: "#f44" }}
                >
                  /dashboard/settings#../../admin/users
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                Literal ../ in hash, flows through service layer → fetch
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#f44" }}>
                <code>await params</code>
                <br />
                <span style={{ fontSize: "0.75rem", color: "#888" }}>
                  (route handler)
                </span>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a
                  href="/route-handler-demo/proxy?path=..%2F..%2Finternal%2Fadmin"
                  style={{ color: "#f44" }}
                >
                  /route-handler-demo/proxy?path=..%2F..%2Finternal%2Fadmin
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                useSearchParams → fetch → /api/proxy/[...path] handler decodes
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#f44" }}>
                <code>await params</code>
                <br />
                <span style={{ fontSize: "0.75rem", color: "#888" }}>
                  (route handler)
                </span>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a
                  href="/route-handler-demo/files?path=..%2F..%2Finternal%2Fsecrets"
                  style={{ color: "#f44" }}
                >
                  /route-handler-demo/files?path=..%2F..%2Finternal%2Fsecrets
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                useSearchParams → fetch → /api/files/[...path] handler decodes
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#f44" }}>
                <code>await params</code>
                <br />
                <span style={{ fontSize: "0.75rem", color: "#888" }}>
                  (route handler)
                </span>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a
                  href="/route-handler-demo/users?userId=test%2Fpath"
                  style={{ color: "#f44" }}
                >
                  /route-handler-demo/users?userId=test%2Fpath
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                useSearchParams → fetch → /api/users/[userId] handler decodes
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#f44" }}>
                <code>await params</code>
                <br />
                <span style={{ fontSize: "0.75rem", color: "#888" }}>
                  (route handler)
                </span>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a
                  href="/route-handler-demo/data?dataId=..%2F..%2Finternal"
                  style={{ color: "#f44" }}
                >
                  /route-handler-demo/data?dataId=..%2F..%2Finternal
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                useSearchParams → fetch → /api/data/[dataId] handler decodes
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SAFE SOURCES */}
      <div
        style={{
          padding: "1rem",
          background: "#001a00",
          borderRadius: 8,
          marginBottom: "2rem",
          border: "1px solid #4a4",
        }}
      >
        <h2 style={{ margin: "0 0 0.75rem", color: "#4a4" }}>
          SAFE SOURCES (re-encode %2F, stays %2F)
        </h2>

        <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
          These sources re-encode %2F — the value you get in JavaScript still
          contains %2F, so it cannot cross path boundaries when used in a fetch
          URL.
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  color: "#888",
                  fontWeight: "normal",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #333",
                  fontSize: "0.8rem",
                }}
              >
                Source
              </th>
              <th
                style={{
                  textAlign: "left",
                  color: "#888",
                  fontWeight: "normal",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #333",
                  fontSize: "0.8rem",
                }}
              >
                Demo
              </th>
              <th
                style={{
                  textAlign: "left",
                  color: "#888",
                  fontWeight: "normal",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #333",
                  fontSize: "0.8rem",
                }}
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>useParams()</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a href="/users/test%2Fpath" style={{ color: "#4a4" }}>
                  /users/test%2Fpath
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                useParams → fetch — %2F stays encoded in userId
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>useParams()</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a
                  href="/shop/electronics%2Fhacked/99"
                  style={{ color: "#4a4" }}
                >
                  /shop/electronics%2Fhacked/99
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                useParams → fetch concat — %2F stays encoded in both params
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>useParams()</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a href="/teams/1/members/42" style={{ color: "#4a4" }}>
                  /teams/1/members/42
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                useParams nested — %2F stays encoded even in deeply nested routes
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>await params</code>
                <br />
                <span style={{ fontSize: "0.75rem", color: "#888" }}>
                  (page component)
                </span>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a href="/files/thepath%2fbooya" style={{ color: "#f90" }}>
                  /files/thepath%2fbooya
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                catch-all page — re-encoded at this layer, but forwards to
                route handler (indirect SSRF)
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>await params</code>
                <br />
                <span style={{ fontSize: "0.75rem", color: "#888" }}>
                  (page component)
                </span>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a href="/data/test%2Fpath" style={{ color: "#f90" }}>
                  /data/test%2Fpath
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                single param page — re-encoded, indirect SSRF via route handler
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>await params</code>
                <br />
                <span style={{ fontSize: "0.75rem", color: "#888" }}>
                  (page component)
                </span>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a href="/docs/guide%2Fintro" style={{ color: "#f90" }}>
                  /docs/guide%2Fintro
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", fontSize: "0.8rem" }}
              >
                optional catch-all page — re-encoded, indirect SSRF via route
                handler
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Encoding Diagnostics */}
      <h2 style={{ color: "#ccc" }}>Encoding Diagnostics</h2>
      <ul style={{ lineHeight: "2.2" }}>
        <li>
          <a
            href="/encoding-diff/thepath%2fbooya"
            style={{ fontWeight: "bold" }}
          >
            /encoding-diff/[...path]
          </a>
          <code
            style={{
              marginLeft: 8,
              fontSize: "0.8rem",
              color: "#f90",
              fontWeight: "bold",
            }}
          >
            ENCODING DIFFERENTIAL — page vs route handler side-by-side
          </code>
        </li>
        <li>
          <a href="/encoding-test/hello%2Fworld">
            /encoding-test/[testParam]
          </a>
          <code
            style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
          >
            client encoding — useParams vs usePathname vs window.location
          </code>
        </li>
        <li>
          <a href="/encoding-catchall/a%2Fb/c">
            /encoding-catchall/[...segments]
          </a>
          <code
            style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
          >
            page server component catch-all encoding
          </code>
        </li>
      </ul>

      <h2 style={{ color: "#ccc" }}>Static</h2>
      <ul style={{ lineHeight: "2.2" }}>
        <li>
          <a href="/about">/about</a>
          <code
            style={{ marginLeft: 8, fontSize: "0.8rem", color: "#888" }}
          >
            static page with client fetch
          </code>
        </li>
      </ul>
    </div>
  );
}
