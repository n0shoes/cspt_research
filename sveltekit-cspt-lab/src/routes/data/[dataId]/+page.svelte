<script lang="ts">
	let { data } = $props();

	const ctx = $derived(data.serverContext);
	const isDangerous = $derived(ctx?.isTraversal ?? false);
	const apiUrl = $derived(ctx?.constructedUrl ?? '');
	const dataId = $derived(ctx?.receivedId ?? '');
</script>

<div style="padding: 2rem; font-family: monospace; max-width: 700px; background: #111; min-height: 100vh; color: #ccc;">
  <h1 style="color: #fff;">+page.server.ts — Secondary Path Traversal</h1>
  <p style="color: #888;">
    Source: <code>params.dataId</code> in <code>+page.server.ts</code> (server-only load function).
    Unlike client-side CSPT, this fetch runs on the server with internal network access.
    The server can reach admin APIs, internal services, and cloud metadata that the browser cannot.
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE (+page.server.ts — server only)</div>
    <code style="color: #f90;">export async function load(&#123; params, fetch &#125;) &#123;</code><br />
    <code style="color: #f90; font-size: 0.85rem;">&nbsp;&nbsp;const res = await fetch(`/api/data/$&#123;params.dataId&#125;`)</code><br />
    <code style="color: #f90; font-size: 0.85rem;">&#125;</code>
    <div style="color: #f44; font-size: 0.8rem; margin-top: 6px;">
      This is NOT a client-side fetch. The server makes this request — it bypasses hooks.server.ts
      and can reach internal endpoints.
    </div>
  </div>

  <!-- RAW VALUE box -->
  <div style="background: #1a1a1a; border: 1px solid {isDangerous ? '#f44' : '#555'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE — params.dataId as decoded by server</div>
    <code style="color: {isDangerous ? '#f44' : '#ccc'}; font-size: 1.1rem;">params.dataId = {JSON.stringify(dataId)}</code>
    <div style="color: {isDangerous ? '#f44' : '#888'}; font-size: 0.8rem; margin-top: 8px;">
      {#if isDangerous}
        TRAVERSAL: decode_params() decoded %2F to / — the server sees literal ../
      {:else}
        Normal dataId — no traversal pattern
      {/if}
    </div>
  </div>

  <!-- FETCH URL box -->
  <div style="background: #1a1a1a; border: 1px solid {isDangerous ? '#f44' : '#555'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SERVER-SIDE FETCH URL</div>
    <code style="color: {isDangerous ? '#f44' : '#ccc'}; font-size: 1rem;">{apiUrl}</code>
    {#if isDangerous}
    <div style="color: #f44; font-size: 0.8rem; margin-top: 6px;">
      Server resolves ../ → the fetch lands on /api/admin/credentials instead of /api/data/
    </div>
    {/if}
  </div>

  <!-- RESULT box -->
  <div style="background: #1a1a1a; border: 1px solid {isDangerous ? '#f44' : '#555'}; border-radius: 6px; padding: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RESULT from server-side fetch</div>
    <pre style="margin: 0; color: {isDangerous ? '#f44' : '#ccc'};">{JSON.stringify(data.data, null, 2)}</pre>
    {#if isDangerous}
    <div style="color: #f44; font-size: 0.8rem; margin-top: 8px; padding-top: 8px; border-top: 1px solid #333;">
      The server fetched internal admin credentials. This data was returned to the page because
      +page.server.ts passes the fetch response directly to the component. In production, this
      would leak secrets from internal APIs, cloud metadata (169.254.169.254), or admin panels.
    </div>
    {/if}
  </div>

  <div style="margin-top: 1.5rem; padding: 0.75rem; background: #0a0a1a; border: 1px solid #336; border-radius: 6px;">
    <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">TEST PAYLOADS (Secondary Path Traversal)</div>
    <a href="/data/..%2Fadmin%2Fcredentials" style="color: #f44; display: block;">/data/..%2Fadmin%2Fcredentials (server fetches /api/admin/credentials)</a>
    <a href="/data/d1" style="color: #4a4; display: block;">/data/d1 (normal)</a>
  </div>
</div>
