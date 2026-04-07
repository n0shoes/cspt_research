"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// CSPT Pattern: useParams() → fetch with nested dynamic params
// Risk: LOW — Next.js re-encodes params on client side
export default function MemberPage() {
  const { teamId, memberId } = useParams<{
    teamId: string;
    memberId: string;
  }>();
  const [member, setMember] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");

  useEffect(() => {
    const url = `/api/teams/${teamId}/members/${memberId}`;
    setFetchUrl(url);
    fetch(url)
      .then((r) => r.json())
      .then(setMember);
  }, [teamId, memberId]);

  const teamEncoded = teamId?.includes("%2F") || teamId?.includes("%2f");
  const memberEncoded = memberId?.includes("%2F") || memberId?.includes("%2f");
  const anyEncoded = teamEncoded || memberEncoded;

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>useParams() — Nested Dynamic Params</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams()</code> reading <code>[teamId]</code> and{" "}
        <code>[memberId]</code>. Deeply nested route, still re-encoded.
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
          {"const { teamId, memberId } = useParams()"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"`/api/teams/${teamId}/members/${memberId}`"}
        </code>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${anyEncoded ? "#4a4" : "#555"}`,
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: 4 }}>
          RAW VALUES from useParams()
        </div>
        <div style={{ marginBottom: 6 }}>
          <code style={{ color: teamEncoded ? "#4a4" : "#ccc" }}>
            teamId = {JSON.stringify(teamId)}
          </code>
          {teamEncoded && (
            <span style={{ color: "#4a4", fontSize: "0.8rem", marginLeft: 8 }}>
              %2F preserved
            </span>
          )}
        </div>
        <div>
          <code style={{ color: memberEncoded ? "#4a4" : "#ccc" }}>
            memberId = {JSON.stringify(memberId)}
          </code>
          {memberEncoded && (
            <span style={{ color: "#4a4", fontSize: "0.8rem", marginLeft: 8 }}>
              %2F preserved
            </span>
          )}
        </div>
        <div style={{ color: "#4a4", fontSize: "0.8rem", marginTop: 8 }}>
          SAFE: useParams() re-encodes %2F even in deeply nested routes
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
          %2F preserved in both path segments — no traversal possible
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
          {JSON.stringify(member, null, 2)}
        </pre>
      </div>
    </div>
  );
}
