import { useState, useEffect } from "react";
import { useParams } from "react-router";

// CSPT Pattern: multiple useParams() → fetch concatenation
// Risk: HIGH — both params decoded, either can carry traversal
// URL: /shop/electronics%2Fhacked/99 → category = "electronics/hacked"
export default function ProductPage() {
  const { category, productId } = useParams<{ category: string; productId: string }>();
  const [product, setProduct] = useState<unknown>(null);
  const [fetchUrl, setFetchUrl] = useState("");

  useEffect(() => {
    const url = `/api/shop/${category}/products/${productId}`;
    setFetchUrl(url);
    fetch(url)
      .then((r) => r.json())
      .catch(() => ({ error: "fetch failed (expected — no server)" }))
      .then(setProduct);
  }, [category, productId]);

  const categoryDangerous =
    (category?.includes("..") || category?.includes("/")) ?? false;
  const productDangerous =
    (productId?.includes("..") || productId?.includes("/")) ?? false;
  const isDangerous = categoryDangerous || productDangerous;

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 700 }}>
      <h1>useParams() — Multiple Params</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams()</code> reading both <code>:category</code> and{" "}
        <code>:productId</code>. React Router decodes all path params — either
        one can carry a traversal payload.
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
          {"const { category, productId } = useParams()"}
        </code>
        <br />
        <code style={{ color: "#f90", fontSize: "0.85rem" }}>
          {"`/api/shop/${category}/products/${productId}`"}
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
          RAW VALUES from useParams()
        </div>

        <div style={{ marginBottom: 8 }}>
          <code
            style={{
              color: categoryDangerous ? "#f44" : "#4a4",
              fontSize: "1rem",
            }}
          >
            category = {JSON.stringify(category)}
          </code>
          {categoryDangerous && (
            <span
              style={{
                marginLeft: 8,
                color: "#f44",
                fontSize: "0.75rem",
              }}
            >
              DANGEROUS — decoded
            </span>
          )}
        </div>

        <div>
          <code
            style={{
              color: productDangerous ? "#f44" : "#4a4",
              fontSize: "1rem",
            }}
          >
            productId = {JSON.stringify(productId)}
          </code>
          {productDangerous && (
            <span
              style={{
                marginLeft: 8,
                color: "#f44",
                fontSize: "0.75rem",
              }}
            >
              DANGEROUS — decoded
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
            ? "DANGEROUS: At least one param was decoded — traversal active"
            : "No traversal — try /shop/electronics%2Fhacked/99 to test :category"}
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
            DANGEROUS: Decoded param injected into URL — traversal is active
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
          {JSON.stringify(product, null, 2)}
        </pre>
      </div>
    </div>
  );
}
