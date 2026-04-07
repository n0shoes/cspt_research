<div style="padding: 2rem; font-family: monospace; max-width: 700px; background: #111; min-height: 100vh; color: #ccc;">
  <h1 style="color: #fff;">About — SvelteKit CSPT Lab</h1>
  <p style="color: #888;">Static page for CSPT lab testing.</p>

  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">LAB OVERVIEW</div>
    <p style="margin: 0; color: #ccc; line-height: 1.6;">
      This lab demonstrates Client-Side Path Traversal (CSPT) vulnerabilities in SvelteKit.
      Each route shows a different source of user-controlled input flowing into a fetch() sink.
    </p>
  </div>

  <div style="background: #1a1a1a; border: 1px solid #4a4; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #4a4; font-size: 0.8rem; margin-bottom: 4px;">SAFE SOURCE</div>
    <code style="color: #4a4;">$page.url.pathname</code> — preserves %2F encoding
  </div>

  <div style="background: #1a1a1a; border: 1px solid #f44; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #f44; font-size: 0.8rem; margin-bottom: 4px;">DANGEROUS SOURCES</div>
    <code style="color: #f44; display: block;">$page.params.xxx</code>
    <code style="color: #f44; display: block;">$page.url.searchParams.get()</code>
    <code style="color: #f44; display: block;">location.hash</code>
    <code style="color: #f44; display: block;">params in +page.server.ts</code>
    <code style="color: #f44; display: block;">params in +server.ts</code>
    <code style="color: #f44; display: block;">[...rest] catch-all params</code>
  </div>

  <a href="/" style="color: #888;">← Back to index</a>
</div>
