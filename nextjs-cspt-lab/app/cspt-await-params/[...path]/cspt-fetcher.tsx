"use client";

import { useState, useEffect } from "react";

export function CsptFetcher({
  pathSegments,
  filePath,
}: {
  pathSegments: string[];
  filePath: string;
}) {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const fetchUrl = `/api/content/${filePath}`;

  useEffect(() => {
    fetch(fetchUrl)
      .then((r) => r.json())
      .then(setResult)
      .catch(() => setResult({ error: "fetch failed" }));
  }, [fetchUrl]);

  const hasTraversal =
    filePath.includes("..") ||
    filePath.includes("%2F") ||
    filePath.includes("%2f");
  const hitInternal = (result?.access as string) === "internal";
  const proxy = result?._proxy as Record<string, unknown> | undefined;
  const hitSpecificRoute = !proxy;

  const stepBorder = (dangerous: boolean) =>
    `1px solid ${dangerous ? "#f44" : "#333"}`;
  const stepColor = (dangerous: boolean) => (dangerous ? "#f44" : "#4a4");

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 800 }}>
      <h1 style={{ marginBottom: "0.25rem" }}>
        CSPT Attack Chain — Step by Step
      </h1>
      <p style={{ color: "#888", marginTop: 0 }}>
        Every value at every layer, from browser URL to final API response.
      </p>

      {/* STEP 1 — Attacker navigates */}
      <div
        style={{
          background: "#1a1a1a",
          border: stepBorder(hasTraversal),
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 6 }}>
          <span style={{ color: "#f90", fontWeight: "bold" }}>STEP 1</span>{" "}
          — Attacker navigates to
        </div>
        <code
          style={{
            color: stepColor(hasTraversal),
            fontSize: "0.95rem",
            wordBreak: "break-all",
          }}
        >
          /cspt-await-params/{filePath}
        </code>
        {hasTraversal && (
          <div style={{ color: "#888", fontSize: "0.75rem", marginTop: 6 }}>
            %2F is encoded in the URL — browser sends it as-is, does not
            resolve ../
          </div>
        )}
      </div>

      {/* Arrow */}
      <div style={{ textAlign: "center", color: "#555", fontSize: "1.2rem" }}>
        ↓
      </div>

      {/* STEP 2 — Page server component reads await params */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #4a4",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 6 }}>
          <span style={{ color: "#f90", fontWeight: "bold" }}>STEP 2</span>{" "}
          — Page server component reads{" "}
          <code style={{ color: "#f90" }}>await params</code>
        </div>
        <code style={{ color: "#4a4", fontSize: "0.95rem" }}>
          path = {JSON.stringify(pathSegments)}
        </code>
        <div style={{ color: "#4a4", fontSize: "0.75rem", marginTop: 6 }}>
          RE-ENCODED — %2F stays %2F via getParamValue(). Safe at this layer.
        </div>
      </div>

      {/* Arrow */}
      <div style={{ textAlign: "center", color: "#555", fontSize: "1.2rem" }}>
        ↓
      </div>

      {/* STEP 3 — Page joins and passes to client component */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 6 }}>
          <span style={{ color: "#f90", fontWeight: "bold" }}>STEP 3</span>{" "}
          — Page joins segments and passes to client component
        </div>
        <code style={{ color: "#ccc", fontSize: "0.85rem" }}>
          {"const filePath = path.join(\"/\")"}
        </code>
        <br />
        <code
          style={{
            color: stepColor(hasTraversal),
            fontSize: "0.95rem",
            wordBreak: "break-all",
          }}
        >
          filePath = {JSON.stringify(filePath)}
        </code>
        {hasTraversal && (
          <div style={{ color: "#888", fontSize: "0.75rem", marginTop: 6 }}>
            %2F is still encoded in the string — traversal payload is dormant
          </div>
        )}
      </div>

      {/* Arrow */}
      <div style={{ textAlign: "center", color: "#555", fontSize: "1.2rem" }}>
        ↓
      </div>

      {/* STEP 4 — Client component fetches */}
      <div
        style={{
          background: "#1a1a1a",
          border: stepBorder(hasTraversal),
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 6 }}>
          <span style={{ color: "#f90", fontWeight: "bold" }}>STEP 4</span>{" "}
          — Client component calls{" "}
          <code style={{ color: "#f90" }}>fetch()</code>
        </div>
        <code
          style={{
            color: stepColor(hasTraversal),
            fontSize: "0.95rem",
            wordBreak: "break-all",
          }}
        >
          fetch(&quot;{fetchUrl}&quot;)
        </code>
        <div style={{ color: "#888", fontSize: "0.75rem", marginTop: 6 }}>
          {hasTraversal
            ? "Browser sends this URL with %2F still encoded → hits the catch-all route handler"
            : "Hits /api/content/docs/getting-started specific route directly"}
        </div>
      </div>

      {/* Arrow */}
      <div style={{ textAlign: "center", color: "#555", fontSize: "1.2rem" }}>
        ↓
      </div>

      {/* STEP 5 — Route handler reads await params */}
      <div
        style={{
          background: proxy ? "#1a0000" : "#1a1a1a",
          border: proxy ? "2px solid #f44" : "1px solid #4a4",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 6 }}>
          <span style={{ color: "#f90", fontWeight: "bold" }}>STEP 5</span>{" "}
          — Route handler reads{" "}
          <code style={{ color: "#f90" }}>await params</code>
        </div>
        {proxy ? (
          <>
            <code style={{ color: "#f44", fontSize: "0.95rem" }}>
              path ={" "}
              {JSON.stringify(proxy.decodedSegments)}
            </code>
            <div
              style={{ color: "#f44", fontSize: "0.75rem", marginTop: 6, fontWeight: "bold" }}
            >
              DECODED — %2F became / and split into separate array elements
            </div>
            <div style={{ color: "#888", fontSize: "0.75rem", marginTop: 4 }}>
              Compare step 2: page got{" "}
              <code>{JSON.stringify(pathSegments)}</code>
              <br />
              Route handler got{" "}
              <code>
                {JSON.stringify(proxy.decodedSegments)}
              </code>
              <br />
              Same <code>await params</code> API, opposite encoding behavior.
            </div>
          </>
        ) : (
          <>
            <code style={{ color: "#4a4", fontSize: "0.95rem" }}>
              (specific route — not the catch-all proxy)
            </code>
            <div style={{ color: "#4a4", fontSize: "0.75rem", marginTop: 6 }}>
              No traversal — request matched /api/content/docs/getting-started
              directly
            </div>
          </>
        )}
      </div>

      {/* Arrow */}
      <div style={{ textAlign: "center", color: "#555", fontSize: "1.2rem" }}>
        ↓
      </div>

      {/* STEP 6 — Route handler joins + new URL() resolves */}
      <div
        style={{
          background: proxy ? "#1a0000" : "#1a1a1a",
          border: proxy ? "2px solid #f44" : "1px solid #4a4",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 6 }}>
          <span style={{ color: "#f90", fontWeight: "bold" }}>STEP 6</span>{" "}
          — Route handler constructs URL
        </div>
        {proxy ? (
          <>
            <div style={{ marginBottom: 8 }}>
              <code style={{ color: "#888", fontSize: "0.8rem" }}>
                {"path.join(\"/\") →"}
              </code>
              <br />
              <code
                style={{
                  color: "#f44",
                  fontSize: "0.95rem",
                  wordBreak: "break-all",
                }}
              >
                {JSON.stringify(proxy.rawJoinedPath)}
              </code>
            </div>
            <div style={{ marginBottom: 8 }}>
              <code style={{ color: "#888", fontSize: "0.8rem" }}>
                {"new URL(`/api/content/${rawPath}`, origin) →"}
              </code>
              <br />
              <code
                style={{
                  color: "#f44",
                  fontSize: "0.8rem",
                  wordBreak: "break-all",
                }}
              >
                pre-resolve: {JSON.stringify(proxy.preResolveUrl)}
              </code>
            </div>
            <div
              style={{
                background: "#2a0000",
                border: "1px solid #f44",
                borderRadius: 4,
                padding: "0.5rem",
              }}
            >
              <code style={{ color: "#888", fontSize: "0.8rem" }}>
                resolved →{" "}
              </code>
              <code
                style={{
                  color: "#f44",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                {proxy.resolvedUrl as string}
              </code>
              <div
                style={{
                  color: "#f44",
                  fontSize: "0.75rem",
                  marginTop: 4,
                  fontWeight: "bold",
                }}
              >
                new URL() resolved the ../ — escaped /api/content/ into
                /api/internal/
              </div>
            </div>
          </>
        ) : (
          <>
            <code style={{ color: "#4a4", fontSize: "0.95rem" }}>
              (no proxy — specific route returned content directly)
            </code>
          </>
        )}
      </div>

      {/* Arrow */}
      <div style={{ textAlign: "center", color: "#555", fontSize: "1.2rem" }}>
        ↓
      </div>

      {/* RESULT */}
      <div
        style={{
          background: hitInternal ? "#1a0000" : "#001a00",
          border: `2px solid ${hitInternal ? "#f44" : "#4a4"}`,
          borderRadius: 6,
          padding: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 6 }}>
          <span style={{ color: "#f90", fontWeight: "bold" }}>RESULT</span>
          {hitInternal ? (
            <span
              style={{ color: "#f44", fontWeight: "bold", marginLeft: 8 }}
            >
              CSPT → SSRF — fetched real data from /api/internal/credentials
            </span>
          ) : (
            <span
              style={{ color: "#4a4", fontWeight: "bold", marginLeft: 8 }}
            >
              Normal response from /api/content/docs/getting-started
            </span>
          )}
        </div>
        <pre
          style={{
            margin: 0,
            color: "#ccc",
            fontSize: "0.85rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {result ? JSON.stringify(result, null, 2) : "fetching..."}
        </pre>
      </div>

      {/* Test URLs */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#111",
          borderRadius: 8,
          border: "1px solid #333",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem", color: "#ccc" }}>Test URLs</h3>
        <ul style={{ lineHeight: 2.2, paddingLeft: "1.5rem" }}>
          <li>
            <a
              href="/cspt-await-params/docs/getting-started"
              style={{ color: "#4a4" }}
            >
              /docs/getting-started
            </a>{" "}
            — normal → specific route, no catch-all
          </li>
          <li>
            <a
              href="/cspt-await-params/docs/getting-started/..%2F..%2F..%2Finternal%2Fcredentials"
              style={{ color: "#f44" }}
            >
              /docs/getting-started/..%2F..%2F..%2Finternal%2Fcredentials
            </a>{" "}
            — CSPT → catch-all → SSRF to /api/internal/credentials
          </li>
        </ul>
      </div>
    </div>
  );
}
