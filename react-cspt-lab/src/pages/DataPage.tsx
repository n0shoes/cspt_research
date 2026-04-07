import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

// CSPT Pattern: loader({ params }) → fetch
// Risk: HIGH — data router loader params are decoded via decodeURIComponent
// URL: /data/..%2F..%2Finternal → params.dataId = "../../internal" (decoded)
export async function dataLoader({ params }: LoaderFunctionArgs) {
  const dataId = params.dataId ?? "";
  const url = `/api/data/${dataId}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return { dataId, url, data };
  } catch {
    return { dataId, url, data: { error: "fetch failed (expected — no server)" } };
  }
}

export default function DataPage() {
  const { dataId, url, data } = useLoaderData() as {
    dataId: string;
    url: string;
    data: unknown;
  };

  const isDangerous =
    dataId.includes("..") || (dataId.includes("/") && !dataId.includes("%2F"));

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>loader({"{ params }"}) — Data Router Loader</h1>
      <p style={{ color: "#888" }}>
        Source: <code>params.dataId</code> inside a React Router data loader.
        Loader params are decoded the same way as <code>useParams()</code> —
        %2F becomes / before the loader runs.
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
          {"export async function dataLoader({ params }) {"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"  const url = `/api/data/${params.dataId}`"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"  return fetch(url).then(r => r.json())"}
        </code>
        <div style={{ color: "#888", fontSize: "0.75rem", marginTop: 6 }}>
          Loader runs before component renders — decoded param flows into fetch
          at the loader level
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
          RAW VALUE from loader params
        </div>
        <code style={{ color: isDangerous ? "#f44" : "#4a4", fontSize: "1.1rem" }}>
          params.dataId = {JSON.stringify(dataId)}
        </code>
        <div
          style={{
            color: isDangerous ? "#f44" : "#4a4",
            fontSize: "0.8rem",
            marginTop: 6,
          }}
        >
          {isDangerous
            ? "DANGEROUS: Decoded — %2F became /, traversal is active in loader"
            : "No traversal — try /data/..%2F..%2Finternal to test"}
        </div>
        <div style={{ color: "#888", fontSize: "0.75rem", marginTop: 4 }}>
          React Router decodes loader params identically to useParams()
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
          FETCH URL CONSTRUCTED (in loader, before render)
        </div>
        <code style={{ color: isDangerous ? "#f44" : "#ccc", fontSize: "1rem" }}>
          {url}
        </code>
        {isDangerous && (
          <div style={{ color: "#f44", fontSize: "0.8rem", marginTop: 6 }}>
            DANGEROUS: Traversal segments in fetch URL — loader ran with decoded
            path
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
          RESULT from fetch (loaded before render)
        </div>
        <pre style={{ margin: 0, color: "#ccc" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
