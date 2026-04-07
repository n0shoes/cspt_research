<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let windowPathname = $state('');
	let mounted = $state(false);

	const rest = $derived($page.params.rest);
	const pathname = $derived($page.url.pathname);
	const restHasDots = $derived(rest.includes('..'));
	const pathnameEncoded = $derived(pathname.includes('%2F') || pathname.includes('%2f'));
	const restDecoded = $derived(rest.includes('/') && pathnameEncoded);
	const hypotheticalFetch = $derived(`/api/files/${rest}`);

	onMount(() => {
		mounted = true;
		windowPathname = window.location.pathname;
		console.log('[ENCODING_CATCHALL] $page.params.rest:', $page.params.rest);
		console.log('[ENCODING_CATCHALL] $page.url.pathname:', $page.url.pathname);
		console.log('[ENCODING_CATCHALL] window.location.pathname:', window.location.pathname);
		console.log('[ENCODING_CATCHALL] typeof $page.params.rest:', typeof $page.params.rest);
	});
</script>

<div style="padding: 2rem; font-family: monospace; max-width: 700px; background: #111; min-height: 100vh; color: #ccc;">
  <h1 style="color: #fff;">Catch-All [...rest] Encoding</h1>
  <p style="color: #888;">
    Source: <code>$page.params.rest</code> reading <code>[...rest]</code>.
    Catch-all params in SvelteKit decode %2F — the entire rest value is decoded.
    Visit with <code>/encoding-catchall/a%2Fb/c</code> to observe.
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE</div>
    <code style="color: #f90;">$page.params.rest  // [...rest] catch-all</code><br />
    <code style="color: #f90; font-size: 0.85rem;">$page.url.pathname  // encoded alternative</code>
  </div>

  <!-- RAW VALUE box -->
  <div style="background: #1a1a1a; border: 1px solid {restDecoded || restHasDots ? '#f44' : '#555'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 8px;">RAW VALUES COMPARISON</div>

    <div style="margin-bottom: 8px; padding: 8px; background: #0a0a0a; border-radius: 4px; border-left: 3px solid {restDecoded || restHasDots ? '#f44' : '#555'};">
      <div style="color: #888; font-size: 0.75rem;">$page.params.rest (type: {typeof rest})</div>
      <code style="color: {restDecoded || restHasDots ? '#f44' : '#ccc'};">{rest}</code>
      {#if restDecoded}
      <span style="color: #f44; font-size: 0.75rem; margin-left: 8px;">DECODED — %2F became /</span>
      {:else if restHasDots}
      <span style="color: #f44; font-size: 0.75rem; margin-left: 8px;">DANGEROUS — traversal dots present</span>
      {/if}
    </div>

    <div style="margin-bottom: 8px; padding: 8px; background: #0a0a0a; border-radius: 4px; border-left: 3px solid {pathnameEncoded ? '#4a4' : '#555'};">
      <div style="color: #888; font-size: 0.75rem;">$page.url.pathname</div>
      <code style="color: {pathnameEncoded ? '#4a4' : '#ccc'};">{pathname}</code>
      {#if pathnameEncoded}
      <span style="color: #4a4; font-size: 0.75rem; margin-left: 8px;">SAFE — %2F preserved</span>
      {/if}
    </div>

    {#if mounted}
    <div style="padding: 8px; background: #0a0a0a; border-radius: 4px; border-left: 3px solid #555;">
      <div style="color: #888; font-size: 0.75rem;">window.location.pathname</div>
      <code style="color: #ccc;">{windowPathname}</code>
    </div>
    {/if}

    <div style="color: {restDecoded || restHasDots ? '#f44' : '#888'}; font-size: 0.8rem; margin-top: 8px;">
      {#if restDecoded || restHasDots}
        DANGEROUS: catch-all params decode %2F — if used in fetch(), CSPT/SSRF possible
      {:else if pathnameEncoded}
        Encoded slashes only in pathname — $page.params.rest may not show differential yet
      {:else}
        Visit /encoding-catchall/a%2Fb/c to see the decoding behavior
      {/if}
    </div>
  </div>

  <!-- FETCH URL box (what would happen if used in fetch) -->
  <div style="background: #1a1a1a; border: 1px solid {restHasDots ? '#f44' : '#555'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">FETCH URL IF params.rest WERE USED</div>
    <code style="color: {restHasDots ? '#f44' : '#888'}; font-size: 0.9rem;">{hypotheticalFetch}</code>
    <div style="color: #888; font-size: 0.75rem; margin-top: 6px;">
      (hypothetical — this page does not make an actual fetch)
    </div>
    {#if restHasDots}
    <div style="color: #f44; font-size: 0.8rem; margin-top: 4px;">
      DANGEROUS: Traversal segments in hypothetical fetch URL — catch-all CSPT confirmed
    </div>
    {/if}
  </div>

  <!-- Full source table -->
  <div style="background: #1a1a1a; border: 1px solid #555; border-radius: 6px; padding: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 8px;">ALL SOURCES</div>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; color: #888; font-weight: normal; font-size: 0.75rem; padding-bottom: 4px; border-bottom: 1px solid #333;">Source</th>
          <th style="text-align: left; color: #888; font-weight: normal; font-size: 0.75rem; padding-bottom: 4px; border-bottom: 1px solid #333;">Value</th>
          <th style="text-align: left; color: #888; font-weight: normal; font-size: 0.75rem; padding-bottom: 4px; border-bottom: 1px solid #333;">Safe?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 4px 0; font-size: 0.85rem;">$page.params.rest</td>
          <td style="padding: 4px 4px;"><code style="color: {restDecoded || restHasDots ? '#f44' : '#ccc'};">{rest}</code></td>
          <td style="padding: 4px 0; color: {restDecoded || restHasDots ? '#f44' : '#888'};">{restDecoded || restHasDots ? 'DANGEROUS' : 'unknown'}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; font-size: 0.85rem;">$page.url.pathname</td>
          <td style="padding: 4px 4px;"><code style="color: {pathnameEncoded ? '#4a4' : '#ccc'};">{pathname}</code></td>
          <td style="padding: 4px 0; color: {pathnameEncoded ? '#4a4' : '#888'};">{pathnameEncoded ? 'SAFE' : 'n/a'}</td>
        </tr>
        {#if mounted}
        <tr>
          <td style="padding: 4px 0; font-size: 0.85rem;">window.location.pathname</td>
          <td style="padding: 4px 4px;"><code>{windowPathname}</code></td>
          <td style="padding: 4px 0; color: #888;">-</td>
        </tr>
        {/if}
      </tbody>
    </table>
  </div>

  <div style="margin-top: 1.5rem; padding: 0.75rem; background: #0a0a1a; border: 1px solid #336; border-radius: 6px;">
    <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">TEST PAYLOADS</div>
    <a href="/encoding-catchall/..%2F..%2Fetc%2Fpasswd" style="color: #f44; display: block;">/encoding-catchall/..%2F..%2Fetc%2Fpasswd (traversal)</a>
    <a href="/encoding-catchall/a%2Fb/c" style="color: #f90; display: block;">/encoding-catchall/a%2Fb/c (encoded slash in segment)</a>
    <a href="/encoding-catchall/a/b/c" style="color: #4a4; display: block;">/encoding-catchall/a/b/c (normal)</a>
  </div>
</div>
