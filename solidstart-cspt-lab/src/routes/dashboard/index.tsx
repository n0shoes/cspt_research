export default function DashboardIndex() {
  return (
    <div style={{ "font-family": "monospace" }}>
      <h3 style={{ color: "#ccc" }}>Dashboard Overview</h3>
      <p style={{ color: "#888" }}>
        SolidStart path params are SAFE — but this dashboard demos the dangerous sources.
      </p>

      <div
        style={{
          background: "#1a0000",
          border: "1px solid #f44",
          "border-radius": "6px",
          padding: "1rem",
          "margin-bottom": "1rem",
        }}
      >
        <div style={{ color: "#f44", "margin-bottom": "0.5rem", "font-weight": "bold" }}>
          DANGEROUS — useSearchParams + innerHTML
        </div>
        <a
          href="/dashboard/stats?source=..%2F..%2Fattachments%2Fmalicious"
          style={{ color: "#f44", display: "block", "margin-bottom": "4px" }}
        >
          /dashboard/stats?source=..%2F..%2Fattachments%2Fmalicious
        </a>
        <div style={{ color: "#888", "font-size": "0.8rem" }}>
          useSearchParams()[0].source → fetch → innerHTML — CSPT + XSS chain
        </div>
      </div>

      <div
        style={{
          background: "#1a0000",
          border: "1px solid #f44",
          "border-radius": "6px",
          padding: "1rem",
        }}
      >
        <div style={{ color: "#f44", "margin-bottom": "0.5rem", "font-weight": "bold" }}>
          DANGEROUS — location.hash + service layer
        </div>
        <a
          href="/dashboard/settings#../../admin/users"
          style={{ color: "#f44", display: "block", "margin-bottom": "4px" }}
        >
          /dashboard/settings#../../admin/users
        </a>
        <div style={{ color: "#888", "font-size": "0.8rem" }}>
          location.hash → apiService.get() → fetch — literal ../ in hash
        </div>
      </div>
    </div>
  );
}
