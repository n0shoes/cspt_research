<script lang="ts">
	let { children } = $props();
</script>

<div style="background: #111; min-height: 100vh; color: #ccc;">
  <nav style="padding: 1rem 2rem; background: #0a0a0a; border-bottom: 1px solid #333; font-family: monospace;">
    <a href="/dashboard" style="color: #f90; margin-right: 1.5rem; text-decoration: none;">Dashboard</a>
    <a href="/dashboard/stats?widget=default" style="color: #f44; margin-right: 1.5rem; text-decoration: none;">Stats (XSS chain)</a>
    <a href="/dashboard/settings" style="color: #f44; margin-right: 1.5rem; text-decoration: none;">Settings (hash CSPT)</a>
    <a href="/" style="color: #888; text-decoration: none;">← Index</a>
  </nav>
  <main style="padding: 2rem;">
    {@render children()}
  </main>
</div>
