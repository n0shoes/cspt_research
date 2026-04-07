"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// CSPT Pattern: useParams() → fetch template literal
// Risk: LOW — Next.js re-encodes params on client side
// useParams().userId will be re-encoded (e.g., %2F stays as %2F)
export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");

  useEffect(() => {
    const url = `/api/users/${userId}`;
    setFetchUrl(url);
    fetch(url)
      .then((r) => r.json())
      .then(setUser);
  }, [userId]);

  const isEncoded = userId?.includes("%2F") || userId?.includes("%2f");

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>useParams() — Single Dynamic Param</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams()</code> reading <code>[userId]</code>. Next.js
        re-encodes slashes, so %2F stays %2F and cannot traverse.
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
          {"const { userId } = useParams<{ userId: string }>()"}
        </code>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${isEncoded ? "#4a4" : "#f44"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUE from useParams()
        </div>
        <code style={{ color: isEncoded ? "#4a4" : "#f44", fontSize: "1.1rem" }}>
          userId = {JSON.stringify(userId)}
        </code>
        <div
          style={{
            color: isEncoded ? "#4a4" : "#f44",
            fontSize: "0.8rem",
            marginTop: 6,
          }}
        >
          {isEncoded
            ? "SAFE: %2F is still encoded — cannot traverse path boundaries"
            : "No %2F present in this request"}
        </div>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #4a4",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: "#4a4", fontSize: "1rem" }}>
          {fetchUrl || "loading…"}
        </code>
        <div style={{ color: "#4a4", fontSize: "0.8rem", marginTop: 6 }}>
          %2F is preserved in the URL — server sees it as a literal %2F, not a /
        </div>
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
