import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";

// CSPT Pattern: Multiple params concatenated into fetch URL
// Risk: LOW — SolidStart preserves encoding in both params
// category = "electronics%2Fhacked", productId = "99"
// fetch goes to /api/shop/electronics%2Fhacked/products/99 (safe — %2F preserved)
export default function ProductPage() {
  const params = useParams<{ category: string; productId: string }>();

  const [product] = createResource(
    () => [params.category, params.productId] as const,
    async ([category, productId]) => {
      const url = `/api/shop/${category}/products/${productId}`;
      console.log("[CSPT] fetch URL:", url);
      const res = await fetch(url);
      return res.json();
    }
  );

  const categoryEncoded = () =>
    params.category?.includes("%2F") || params.category?.includes("%2f");
  const productEncoded = () =>
    params.productId?.includes("%2F") || params.productId?.includes("%2f");
  const eitherEncoded = () => categoryEncoded() || productEncoded();

  const fetchUrl = () =>
    `/api/shop/${params.category}/products/${params.productId}`;

  return (
    <div style={{ padding: "2rem", "font-family": "monospace", "max-width": "700px" }}>
      <h1>useParams() — Multiple Params Concatenated</h1>
      <p style={{ color: "#888" }}>
        Source: <code>useParams().category</code> +{" "}
        <code>useParams().productId</code>. Both params preserve encoding —
        even when concatenated into a fetch URL, %2F stays %2F in both.
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
          {"const params = useParams<{ category: string; productId: string }>()"}
        </code>
        <br />
        <code style={{ color: "#f90", "font-size": "0.85rem" }}>
          {"`/api/shop/${params.category}/products/${params.productId}`  →  fetch()"}
        </code>
      </div>

      {/* RAW VALUE box */}
      <div
        style={{
          background: "#1a1a1a",
          border: `1px solid ${eitherEncoded() ? "#4a4" : "#555"}`,
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          RAW VALUES from useParams()
        </div>
        <code style={{ color: categoryEncoded() ? "#4a4" : "#ccc", display: "block", "margin-bottom": "4px" }}>
          category = {JSON.stringify(params.category)}
          {categoryEncoded() && " ✓ encoded"}
        </code>
        <code style={{ color: productEncoded() ? "#4a4" : "#ccc", display: "block" }}>
          productId = {JSON.stringify(params.productId)}
          {productEncoded() && " ✓ encoded"}
        </code>
        <div
          style={{
            color: eitherEncoded() ? "#4a4" : "#888",
            "font-size": "0.8rem",
            "margin-top": "8px",
          }}
        >
          {eitherEncoded()
            ? "SAFE: %2F preserved in both params — no traversal possible even when concatenated"
            : "Try /shop/electronics%2Fhacked/99 to test encoding behavior"}
        </div>
      </div>

      {/* FETCH URL box */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #4a4",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#888", "font-size": "0.8rem", "margin-bottom": "4px" }}>
          FETCH URL CONSTRUCTED
        </div>
        <code style={{ color: "#4a4", "font-size": "1rem" }}>
          {fetchUrl()}
        </code>
        <div style={{ color: "#4a4", "font-size": "0.8rem", "margin-top": "6px" }}>
          Both params contribute their raw (preserved) values — concatenation does not decode
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
          RESULT from fetch
        </div>
        <Show when={!product.loading} fallback={<span style={{ color: "#555" }}>loading...</span>}>
          <pre style={{ margin: 0, color: "#ccc" }}>
            {JSON.stringify(product(), null, 2)}
          </pre>
        </Show>
      </div>
    </div>
  );
}
