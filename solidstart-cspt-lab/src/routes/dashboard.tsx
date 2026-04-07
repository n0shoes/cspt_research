import type { RouteSectionProps } from "@solidjs/router";

// Dashboard layout with nested routes
export default function DashboardLayout(props: RouteSectionProps) {
  return (
    <div style={{ padding: "2rem", "font-family": "monospace" }}>
      <h2 style={{ color: "#ccc", "margin-bottom": "0.25rem" }}>Dashboard</h2>
      <p style={{ color: "#555", "font-size": "0.8rem", "margin-bottom": "1rem" }}>
        Query param and hash-based CSPT demos — these are DANGEROUS even though path params are safe
      </p>
      <nav style={{ "margin-bottom": "1.5rem" }}>
        <a href="/dashboard" style={{ color: "#888", "margin-right": "1rem" }}>Overview</a>
        <a href="/dashboard/stats?source=..%2F..%2Fattachments%2Fmalicious" style={{ color: "#f44", "margin-right": "1rem" }}>
          Stats (DANGEROUS — searchParams)
        </a>
        <a href="/dashboard/settings#../../admin/users" style={{ color: "#f44" }}>
          Settings (DANGEROUS — hash)
        </a>
      </nav>
      <div>{props.children}</div>
    </div>
  );
}
