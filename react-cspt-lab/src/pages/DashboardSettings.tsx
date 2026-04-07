import { useState, useEffect } from "react";

// Service layer abstraction — hides the fetch sink
const apiService = {
  get: (path: string) => fetch(`/api${path}`).then((r) => r.json()),
};

// CSPT Pattern: window.location.hash → service layer → fetch
// Risk: HIGH — hash is never URL-decoded by browser, raw traversal works
// URL: /dashboard/settings#../../admin/users
export default function DashboardSettings() {
  const [settings, setSettings] = useState<unknown>(null);
  const [hashPath, setHashPath] = useState("");
  const [fetchUrl, setFetchUrl] = useState("");

  useEffect(() => {
    const hash = window.location.hash.slice(1); // remove '#'
    setHashPath(hash);
    if (hash) {
      const constructedUrl = `/api${hash}`;
      setFetchUrl(constructedUrl);
      // Hash value flows through service layer into fetch
      apiService
        .get(hash)
        .catch(() => ({ error: "fetch failed (expected — no server)" }))
        .then(setSettings);
    }
  }, []);

  const hasDots = hashPath.includes("..");

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>location.hash — Literal Traversal Source (DANGEROUS)</h1>
      <p style={{ color: "#888" }}>
        Source: <code>window.location.hash.slice(1)</code>. The hash fragment is
        never URL-decoded by the browser — literal{" "}
        <code>../../admin/users</code> works directly. Flows through a service
        layer abstraction into fetch.
      </p>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          SOURCE
        </div>
        <code style={{ color: "#f90" }}>
          {"const hash = window.location.hash.slice(1)"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"apiService.get(hash)  →  fetch(`/api${hash}`)"}
        </code>
        <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 6 }}>
          Note: Service layer hides the fetch sink — common real-world pattern
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${hasDots ? "#f44" : hashPath ? "#555" : "#333"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUE from location.hash
        </div>
        <code
          style={{
            color: hasDots ? "#f44" : "#ccc",
            fontSize: "1.1rem",
          }}
        >
          hash = {JSON.stringify(hashPath || "(empty)")}
        </code>
        <div
          style={{
            color: hasDots ? "#f44" : "#888",
            fontSize: "0.8rem",
            marginTop: 8,
          }}
        >
          {!hashPath
            ? "No hash — navigate to #../../admin/users to test traversal"
            : hasDots
            ? "DANGEROUS: Literal ../ in hash — no encoding needed, direct traversal"
            : "Hash present but no traversal pattern detected"}
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${fetchUrl ? "#f44" : "#555"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          FETCH URL CONSTRUCTED (inside apiService.get)
        </div>
        <code style={{ color: fetchUrl ? "#f44" : "#888", fontSize: "1rem" }}>
          {fetchUrl || "(waiting for hash)"}
        </code>
        {fetchUrl && hasDots && (
          <div style={{ color: "#f44", fontSize: "0.8rem", marginTop: 6 }}>
            DANGEROUS: Literal path traversal segments passed to fetch — no
            encoding needed for hash-based CSPT
          </div>
        )}
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #555",
          borderRadius: 6,
          padding: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RESULT from fetch
        </div>
        <pre style={{ margin: 0, color: "#ccc" }}>
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </div>
  );
}
