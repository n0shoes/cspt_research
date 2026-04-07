import { useParams } from "@solidjs/router";
import { query, createAsync } from "@solidjs/router";
import { Show } from "solid-js";

// CSPT Pattern: useParams().dataId → server function ("use server") → internal fetch
// Risk: MEDIUM/UNKNOWN — client-side param encoding is SAFE (preserved)
// BUT: server function receives dataId via JSON RPC — encoding may differ server-side
// This is the most interesting case for research: does "use server" re-encode or pass raw?
const getData = query(async (dataId: string) => {
  "use server";
  // On server: dataId arrives via JSON RPC boundary
  // The encoding behavior here may differ from client-side useParams
  const url = `http://internal-service.local/data/${dataId}`;
  console.log("[SERVER_CSPT_SINK] server-side fetch URL:", url);
  try {
    const res = await fetch(url);
    return res.json();
  } catch {
    return { error: "Internal service unreachable", attemptedUrl: url };
  }
}, "getData");

export default function DataPage() {
  const params = useParams<{ dataId: string }>();

  const data = createAsync(() => getData(params.dataId));

  const isEncoded = () =>
    params.dataId?.includes("%2F") || params.dataId?.includes("%2f");

  const clientFetchUrl = () => `/api/data/${params.dataId}`;

  return (
    <div style={{ padding: "2rem", "font-family": "monospace", "max-width": "700px" }}>
      <h1>useParams() + Server Function ("use server")</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams().dataId</code> passed to a{" "}
        <code>"use server"</code> function. The client-side param is preserved
        (safe), but the param crosses a JSON RPC boundary to the server. The
        server-side encoding behavior is an open research question.
      </p>

      {/* SOURCE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          SOURCE
        </div>
        <code style={{ color: "#f90" }}>
          {"const params = useParams<{ dataId: string }>()"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.85rem" }}>
          {"createAsync(() => getData(params.dataId))"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.8rem" }}>
          {"// Inside server fn: `http://internal-service.local/data/${dataId}`"}
        </code>
        <div
          style={{
            background: "#111",
            "border-radius": "4px",
            padding: "0.5rem",
            "margin-top": "0.5rem",
            "font-size": "0.8rem",
            color: "#f90",
          }}
        >
          Research note: "use server" creates a JSON RPC boundary. The dataId
          string is serialized client-side and deserialized server-side. Whether
          %2F is preserved through this boundary needs empirical testing.
        </div>
      </div>

      {/* RAW VALUE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${isEncoded() ? "#4a4" : "#555"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RAW VALUE from useParams() (client-side)
        </div>
        <code style={{ color: isEncoded() ? "#4a4" : "#ccc", "font-size": "1.1rem" }}>
          dataId = {JSON.stringify(params.dataId)}
        </code>
        <div
          style={{
            color: isEncoded() ? "#4a4" : "#888",
            "font-size": "0.8rem",
            "margin-top": "6px",
          }}
        >
          {isEncoded()
            ? "Client-side: SAFE — %2F preserved by SolidStart. Server-side behavior unknown."
            : "No %2F present — try /data/test%2Fpath to test encoding"}
        </div>
      </div>

      {/* FETCH URL box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #f90",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          FETCH URL CONSTRUCTED (server-side, inside "use server")
        </div>
        <code style={{ color: "#f90", "font-size": "1rem" }}>
          {`http://internal-service.local/data/${params.dataId}`}
        </code>
        <div style={{ color: "#f90", "font-size": "0.8rem", "margin-top": "6px" }}>
          WARNING: This fetch runs server-side against an internal service.
          If the JSON RPC boundary decodes %2F, SSRF path traversal becomes possible.
        </div>
      </div>

      {/* RESULT box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #555",
          "border-radius": "6px",
          padding: "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RESULT from server function
        </div>
        <Show when={data()} fallback={<span style={{ color: "#555" }}>loading...</span>}>
          <pre style={{ margin: 0, color: "#ccc" }}>
            {JSON.stringify(data(), null, 2)}
          </pre>
        </Show>
      </div>
    </div>
  );
}
