export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <nav style={{ marginBottom: "1rem" }}>
        <a href="/dashboard" style={{ marginRight: "1rem" }}>Home</a>
        <a href="/dashboard/stats?widget=summary" style={{ marginRight: "1rem" }}>Stats</a>
        <a href="/dashboard/settings#/user/profile">Settings</a>
      </nav>
      <hr />
      {children}
    </div>
  );
}
