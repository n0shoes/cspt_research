export default function Home() {
  return (
    <div
      style={{
        padding: "2rem",
        "font-family": "monospace",
        "max-width": "900px",
        margin: "0 auto",
      }}
    >
      <h1>SolidStart CSPT Lab</h1>
      <p style={{ color: "#888", "margin-bottom": "1rem" }}>
        Client-Side Path Traversal research lab — SolidStart 1.1.0 / @solidjs/router 0.15.3
      </p>

      {/* Key finding box */}
      <div
        style={{
          padding: "1rem",
          background: "#111",
          "border-radius": "8px",
          "margin-bottom": "2rem",
          border: "1px solid #333",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem", color: "#f90" }}>
          Key Finding: SolidStart is the SAFE Outlier
        </h3>
        <p style={{ margin: 0, color: "#ccc", "line-height": "1.6" }}>
          <code>useParams()</code> in SolidStart does{" "}
          <strong>NOT</strong> decode path params —{" "}
          <span style={{ color: "#4a4" }}>%2F stays %2F</span>.
          <br />
          This is the <strong>opposite</strong> of React Router and Vue Router, which both decode params.
          <br />
          SolidStart is one of the{" "}
          <span style={{ color: "#4a4" }}>only frameworks</span> that preserves encoding in path params.
          <br />
          However,{" "}
          <code>useSearchParams()[0].xxx</code> and{" "}
          <code>location.hash</code> are still{" "}
          <span style={{ color: "#f44" }}>DANGEROUS</span> — standard web platform decoding applies.
          <br />
          <strong>
            Path params are safe. Query params and hash are still exploitable.
          </strong>
        </p>
      </div>

      {/* DANGEROUS SOURCES */}
      <div
        style={{
          padding: "1rem",
          background: "#1a0000",
          "border-radius": "8px",
          "margin-bottom": "2rem",
          border: "1px solid #f44",
        }}
      >
        <h2 style={{ margin: "0 0 0.75rem", color: "#f44" }}>
          DANGEROUS SOURCES (decode %2F to /)
        </h2>

        <p style={{ color: "#888", "font-size": "0.85rem", margin: "0 0 0.75rem" }}>
          These sources return a decoded value — %2F becomes / before JavaScript
          sees it. Combined with a fetch sink, path traversal is possible.
        </p>

        <table style={{ width: "100%", "border-collapse": "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  "text-align": "left",
                  color: "#888",
                  "font-weight": "normal",
                  "padding-bottom": "0.5rem",
                  "border-bottom": "1px solid #333",
                  "font-size": "0.8rem",
                }}
              >
                Source
              </th>
              <th
                style={{
                  "text-align": "left",
                  color: "#888",
                  "font-weight": "normal",
                  "padding-bottom": "0.5rem",
                  "border-bottom": "1px solid #333",
                  "font-size": "0.8rem",
                }}
              >
                Demo
              </th>
              <th
                style={{
                  "text-align": "left",
                  color: "#888",
                  "font-weight": "normal",
                  "padding-bottom": "0.5rem",
                  "border-bottom": "1px solid #333",
                  "font-size": "0.8rem",
                }}
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#f44" }}>
                <code>useSearchParams()[0].source</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a
                  href="/dashboard/stats?source=..%2F..%2Fattachments%2Fmalicious"
                  style={{ color: "#f44" }}
                >
                  /dashboard/stats?source=..%2F..%2Fattachments%2Fmalicious
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", "font-size": "0.8rem" }}
              >
                CSPT + innerHTML → XSS chain (CRITICAL)
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
                style={{ padding: "0.5rem 0", color: "#888", "font-size": "0.8rem" }}
              >
                Literal ../ in hash, service layer → fetch (HIGH)
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#f44" }}>
                <code>useSearchParams()[0].endpoint</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a
                  href="/dashboard/settings?endpoint=..%2F..%2Fadmin"
                  style={{ color: "#f44" }}
                >
                  /dashboard/settings?endpoint=..%2F..%2Fadmin
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", "font-size": "0.8rem" }}
              >
                Query param → service layer fetch (HIGH)
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
          "border-radius": "8px",
          "margin-bottom": "2rem",
          border: "1px solid #4a4",
        }}
      >
        <h2 style={{ margin: "0 0 0.75rem", color: "#4a4" }}>
          SAFE SOURCES (preserve encoding — %2F stays %2F)
        </h2>

        <p style={{ color: "#888", "font-size": "0.85rem", margin: "0 0 0.75rem" }}>
          These sources do NOT decode %2F — the value in JavaScript still
          contains %2F, so it cannot cross path boundaries in a fetch URL.
          SolidStart is the ONLY major framework with this behavior for path params.
        </p>

        <table style={{ width: "100%", "border-collapse": "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  "text-align": "left",
                  color: "#888",
                  "font-weight": "normal",
                  "padding-bottom": "0.5rem",
                  "border-bottom": "1px solid #333",
                  "font-size": "0.8rem",
                }}
              >
                Source
              </th>
              <th
                style={{
                  "text-align": "left",
                  color: "#888",
                  "font-weight": "normal",
                  "padding-bottom": "0.5rem",
                  "border-bottom": "1px solid #333",
                  "font-size": "0.8rem",
                }}
              >
                Demo
              </th>
              <th
                style={{
                  "text-align": "left",
                  color: "#888",
                  "font-weight": "normal",
                  "padding-bottom": "0.5rem",
                  "border-bottom": "1px solid #333",
                  "font-size": "0.8rem",
                }}
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>useParams().userId</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a href="/users/test%2Fpath" style={{ color: "#4a4" }}>
                  /users/test%2Fpath
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", "font-size": "0.8rem" }}
              >
                useParams → fetch — %2F stays encoded, no traversal possible
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>useParams().path</code>
                <br />
                <span style={{ "font-size": "0.75rem", color: "#888" }}>
                  (catch-all)
                </span>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a href="/files/thepath%2fbooya" style={{ color: "#4a4" }}>
                  /files/thepath%2fbooya
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", "font-size": "0.8rem" }}
              >
                catch-all param — %2F stays encoded even in [...path]
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>useParams().category</code>
                <br />
                <code>useParams().productId</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a href="/shop/electronics%2Fhacked/99" style={{ color: "#4a4" }}>
                  /shop/electronics%2Fhacked/99
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", "font-size": "0.8rem" }}
              >
                multiple params concatenated — both stay encoded
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem 0", color: "#4a4" }}>
                <code>useParams().teamId</code>
                <br />
                <code>useParams().memberId</code>
              </td>
              <td style={{ padding: "0.5rem 0.5rem" }}>
                <a href="/teams/1/members/42" style={{ color: "#4a4" }}>
                  /teams/1/members/42
                </a>
              </td>
              <td
                style={{ padding: "0.5rem 0", color: "#888", "font-size": "0.8rem" }}
              >
                nested dynamic params — %2F stays encoded in deeply nested routes
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Encoding Diagnostics */}
      <h2 style={{ color: "#ccc" }}>Encoding Diagnostics</h2>
      <ul style={{ "line-height": "2.2" }}>
        <li>
          <a
            href="/encoding-test/hello%2Fworld"
            style={{ "font-weight": "bold" }}
          >
            /encoding-test/[testParam]
          </a>
          <code
            style={{
              "margin-left": "8px",
              "font-size": "0.8rem",
              color: "#f90",
              "font-weight": "bold",
            }}
          >
            ENCODING COMPARISON — useParams vs useLocation vs window.location
          </code>
        </li>
        <li>
          <a href="/encoding-catchall/a%2Fb/c">
            /encoding-catchall/[...rest]
          </a>
          <code
            style={{ "margin-left": "8px", "font-size": "0.8rem", color: "#888" }}
          >
            catch-all encoding — params.rest type and encoding behavior
          </code>
        </li>
      </ul>

      <h2 style={{ color: "#ccc" }}>Path Param Sources (SAFE)</h2>
      <ul style={{ "line-height": "2.2" }}>
        <li>
          <a href="/users/test%2Fpath">/users/[userId]</a>
          <code style={{ "margin-left": "8px", "font-size": "0.8rem", color: "#4a4" }}>
            useParams().userId — %2F preserved, SAFE
          </code>
        </li>
        <li>
          <a href="/files/thepath%2fbooya">/files/[...path]</a>
          <code style={{ "margin-left": "8px", "font-size": "0.8rem", color: "#4a4" }}>
            catch-all useParams — %2F preserved, SAFE
          </code>
        </li>
        <li>
          <a href="/shop/electronics%2Fhacked/99">/shop/[category]/[productId]</a>
          <code style={{ "margin-left": "8px", "font-size": "0.8rem", color: "#4a4" }}>
            multiple params concat — both preserved, SAFE
          </code>
        </li>
        <li>
          <a href="/teams/1/members/42">/teams/[teamId]/members/[memberId]</a>
          <code style={{ "margin-left": "8px", "font-size": "0.8rem", color: "#4a4" }}>
            nested params — both preserved, SAFE
          </code>
        </li>
        <li>
          <a href="/data/test%2Fpath">/data/[dataId]</a>
          <code style={{ "margin-left": "8px", "font-size": "0.8rem", color: "#f90" }}>
            server function (use server) — encoding may differ server-side
          </code>
        </li>
      </ul>

      <h2 style={{ color: "#ccc" }}>Query Param / Hash Sources (DANGEROUS)</h2>
      <ul style={{ "line-height": "2.2" }}>
        <li>
          <a
            href="/dashboard/stats?source=..%2F..%2Fattachments%2Fmalicious"
            style={{ color: "#f44" }}
          >
            /dashboard/stats?source=..%2F..%2Fattachments%2Fmalicious
          </a>
          <code style={{ "margin-left": "8px", "font-size": "0.8rem", color: "#f44" }}>
            useSearchParams → fetch → innerHTML (CRITICAL)
          </code>
        </li>
        <li>
          <a
            href="/dashboard/settings#../../admin/users"
            style={{ color: "#f44" }}
          >
            /dashboard/settings#../../admin/users
          </a>
          <code style={{ "margin-left": "8px", "font-size": "0.8rem", color: "#f44" }}>
            location.hash → service layer → fetch (HIGH)
          </code>
        </li>
      </ul>
    </div>
  );
}
