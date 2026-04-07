import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";

// CSPT Pattern: nested useParams() → axios.get (fetch wrapper)
// Risk: HIGH — deeply nested params still decoded by React Router
// URL: /teams/1%2F2/members/42%2F.. → teamId = "1/2", memberId = "42/.."
export default function MemberPage() {
  const { teamId, memberId } = useParams<{ teamId: string; memberId: string }>();
  const [member, setMember] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");

  useEffect(() => {
    const url = `/api/teams/${teamId}/members/${memberId}`;
    setFetchUrl(url);
    axios
      .get(url)
      .then((r) => setMember(r.data))
      .catch(() =>
        setMember({ error: "fetch failed (expected — no server)" })
      );
  }, [teamId, memberId]);

  const teamDangerous =
    (teamId?.includes("..") || teamId?.includes("/")) ?? false;
  const memberDangerous =
    (memberId?.includes("..") || memberId?.includes("/")) ?? false;
  const isDangerous = teamDangerous || memberDangerous;

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>useParams() — Nested Dynamic Params</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams()</code> reading <code>:teamId</code> and{" "}
        <code>:memberId</code> from nested route. Axios wraps fetch but the
        decoded params still reach the URL. Nesting depth does not add
        protection.
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
          {"axios.get(`/api/teams/${teamId}/members/${memberId}`)"}
        </code>
        <div style={{ color: "#888", fontSize: "0.75rem", marginTop: 6 }}>
          Route: <code>/teams/:teamId/members/:memberId</code> — two independent
          decoded params
        </div>
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
          RAW VALUES from useParams()
        </div>

        <div style={{ marginBottom: 8 }}>
          <code
            style={{ color: teamDangerous ? "#f44" : "#4a4", fontSize: "1rem" }}
          >
            teamId = {JSON.stringify(teamId)}
          </code>
          {teamDangerous && (
            <span style={{ marginLeft: 8, color: "#f44", fontSize: "0.75rem" }}>
              DANGEROUS
            </span>
          )}
        </div>

        <div>
          <code
            style={{
              color: memberDangerous ? "#f44" : "#4a4",
              fontSize: "1rem",
            }}
          >
            memberId = {JSON.stringify(memberId)}
          </code>
          {memberDangerous && (
            <span style={{ marginLeft: 8, color: "#f44", fontSize: "0.75rem" }}>
              DANGEROUS
            </span>
          )}
        </div>

        <div
          style={{
            color: isDangerous ? "#f44" : "#4a4",
            fontSize: "0.8rem",
            marginTop: 8,
          }}
        >
          {isDangerous
            ? "DANGEROUS: Decoded — %2F became /, traversal active in nested param"
            : "No traversal — try /teams/1%2F2/members/42 to test :teamId"}
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
          FETCH URL CONSTRUCTED (via axios)
        </div>
        <code style={{ color: isDangerous ? "#f44" : "#ccc", fontSize: "1rem" }}>
          {fetchUrl || "loading..."}
        </code>
        {isDangerous && (
          <div style={{ color: "#f44", fontSize: "0.8rem", marginTop: 6 }}>
            DANGEROUS: Axios does not sanitize paths — decoded param injected
            directly
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
          {JSON.stringify(member, null, 2)}
        </pre>
      </div>
    </div>
  );
}
