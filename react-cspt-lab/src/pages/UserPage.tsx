import { useState, useEffect } from "react";
import { useParams } from "react-router";

// CSPT Pattern: useParams() → fetch template literal
// Risk: HIGH — React Router DECODES params (unlike Next.js which re-encodes)
// useParams().userId will be DECODED (e.g., %2F becomes /)
export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");

  useEffect(() => {
    const url = `/api/users/${userId}`;
    setFetchUrl(url);
    fetch(url)
      .then((r) => r.json())
      .catch(() => ({ error: "fetch failed (expected — no server)" }))
      .then(setUser);
  }, [userId]);

  const hasDots = userId?.includes("..") ?? false;
  const isDangerous = hasDots || (userId?.includes("/") ?? false);

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>useParams() — Single Dynamic Param</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams()</code> reading <code>:userId</code>. React
        Router decodes via <code>decodeURIComponent</code> — %2F becomes /, so
        traversal works directly.
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
          {"const { userId } = useParams()"}
        </code>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${isDangerous ? "#f44" : "#4a4"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUE from useParams()
        </div>
        <code style={{ color: isDangerous ? "#f44" : "#4a4", fontSize: "1.1rem" }}>
          userId = {JSON.stringify(userId)}
        </code>
        <div
          style={{
            color: isDangerous ? "#f44" : "#4a4",
            fontSize: "0.8rem",
            marginTop: 6,
          }}
        >
          {isDangerous
            ? "DANGEROUS: %2F was decoded to / — path traversal is active"
            : "No traversal pattern — try /users/..%2Fapi%2Fsecret to test"}
        </div>
        <div style={{ color: "#888", fontSize: "0.75rem", marginTop: 4 }}>
          React Router calls decodeURIComponent() on every path param
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${isDangerous ? "#f44" : "#555"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: isDangerous ? "#f44" : "#ccc", fontSize: "1rem" }}>
          {fetchUrl || "loading..."}
        </code>
        {isDangerous && (
          <div style={{ color: "#f44", fontSize: "0.8rem", marginTop: 6 }}>
            DANGEROUS: The / in the path came from a decoded %2F — traversal is
            active
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
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
