<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let windowPathname = $state('');
	let windowHref = $state('');
	let mounted = $state(false);

	const param = $derived($page.params.testParam);
	const pathname = $derived($page.url.pathname);
	const pathnameEncoded = $derived(pathname.includes('%2F') || pathname.includes('%2f'));
	const paramDecoded = $derived(param.includes('/') && pathnameEncoded);

	onMount(() => {
		mounted = true;
		windowPathname = window.location.pathname;
		windowHref = window.location.href;

		console.log('[ENCODING_TEST] $page.params.testParam:', $page.params.testParam);
		console.log('[ENCODING_TEST] $page.url.pathname:', $page.url.pathname);
		console.log('[ENCODING_TEST] $page.url.searchParams.get("q"):', $page.url.searchParams.get('q'));
		console.log('[ENCODING_TEST] window.location.pathname:', window.location.pathname);
		console.log('[ENCODING_TEST] window.location.href:', window.location.href);
	});
</script>

<div style="padding: 2rem; font-family: monospace; max-width: 700px; background: #111; min-height: 100vh; color: #ccc;">
  <h1 style="color: #fff;">Encoding Differential — $page.params vs $page.url.pathname</h1>
  <p style="color: #888;">
    SvelteKit key differential: <code>$page.params</code> decodes %2F (DANGEROUS),
    while <code>$page.url.pathname</code> preserves %2F (SAFE).
    Visit with <code>/encoding-test/hello%2Fworld</code> to see the difference.
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE</div>
    <code style="color: #f90;">$page.params.testParam</code><br />
    <code style="color: #f90; font-size: 0.85rem;">$page.url.pathname</code><br />
    <code style="color: #f90; font-size: 0.85rem;">window.location.pathname</code>
  </div>

  <!-- RAW VALUE comparison box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 8px;">ENCODING COMPARISON</div>

    <div style="margin-bottom: 8px; padding: 8px; background: #0a0a0a; border-radius: 4px; border-left: 3px solid {paramDecoded ? '#f44' : '#555'};">
      <div style="color: #888; font-size: 0.75rem;">$page.params.testParam</div>
      <code style="color: {paramDecoded ? '#f44' : '#ccc'};">{param}</code>
      {#if paramDecoded}
      <span style="color: #f44; font-size: 0.75rem; margin-left: 8px;">DECODED — %2F became /</span>
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
    <div style="margin-bottom: 8px; padding: 8px; background: #0a0a0a; border-radius: 4px; border-left: 3px solid #555;">
      <div style="color: #888; font-size: 0.75rem;">window.location.pathname</div>
      <code style="color: #ccc;">{windowPathname}</code>
    </div>

    <div style="padding: 8px; background: #0a0a0a; border-radius: 4px; border-left: 3px solid #555;">
      <div style="color: #888; font-size: 0.75rem;">$page.url.searchParams.get('q')</div>
      <code style="color: #ccc;">{$page.url.searchParams.get('q') ?? '(no q param)'}</code>
    </div>
    {/if}
  </div>

  <!-- Summary box -->
  <div style="background: #1a1a1a; border: 1px solid {paramDecoded ? '#f44' : '#333'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">ENCODING ANALYSIS</div>
    {#if paramDecoded}
    <div style="color: #f44;">
      DIFFERENTIAL CONFIRMED: $page.params decoded %2F to / — DANGEROUS for fetch construction<br />
      $page.url.pathname preserved %2F — SAFE for fetch construction
    </div>
    {:else if pathnameEncoded}
    <div style="color: #4a4;">
      $page.url.pathname preserves %2F — this is the safe source
    </div>
    {:else}
    <div style="color: #888;">
      Visit /encoding-test/hello%2Fworld to see the encoding differential
    </div>
    {/if}
  </div>

  <!-- Full table -->
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
          <td style="padding: 4px 0; font-size: 0.85rem;">$page.params.testParam</td>
          <td style="padding: 4px 4px;"><code style="color: {paramDecoded ? '#f44' : '#ccc'};">{param}</code></td>
          <td style="padding: 4px 0; color: {paramDecoded ? '#f44' : '#888'};">{paramDecoded ? 'DANGEROUS' : 'unknown'}</td>
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
        <tr>
          <td style="padding: 4px 0; font-size: 0.85rem;">window.location.href</td>
          <td style="padding: 4px 4px;"><code style="font-size: 0.75rem;">{windowHref}</code></td>
          <td style="padding: 4px 0; color: #888;">-</td>
        </tr>
        {/if}
      </tbody>
    </table>
  </div>

  <div style="margin-top: 1.5rem; padding: 0.75rem; background: #0a0a1a; border: 1px solid #336; border-radius: 6px;">
    <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">TEST PAYLOADS</div>
    <a href="/encoding-test/hello%2Fworld" style="color: #f44; display: block;">/encoding-test/hello%2Fworld (see differential)</a>
    <a href="/encoding-test/normal" style="color: #4a4; display: block;">/encoding-test/normal (no encoding)</a>
    <a href="/encoding-test/test%2Fparam?q=query%2Fval" style="color: #f90; display: block;">/encoding-test/test%2Fparam?q=query%2Fval (both sources)</a>
  </div>
</div>
