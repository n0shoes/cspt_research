<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let redirectTarget = $state('');
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const params = new URLSearchParams(window.location.search);
		const redirect = params.get('redirect');
		if (redirect) {
			redirectTarget = redirect;
			goto(redirect);
		}
	});
</script>

<div style="font-family: monospace; max-width: 700px; color: #ccc;">
  <h1 style="color: #fff;">Dashboard — Open Redirect via searchParams</h1>
  <p style="color: #888;">
    Source: <code>new URLSearchParams(window.location.search).get('redirect')</code>.
    The redirect value flows directly into <code>goto()</code> — SvelteKit's client-side
    router follows arbitrary paths.
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE</div>
    <code style="color: #f90;">const redirect = new URLSearchParams(window.location.search).get('redirect')</code><br />
    <code style="color: #f90; font-size: 0.85rem;">goto(redirect)  // SvelteKit client-side navigation</code>
  </div>

  <!-- RAW VALUE box -->
  {#if mounted}
  {@const hasDots = redirectTarget.includes('..')}
  {@const isDangerous = hasDots || redirectTarget.startsWith('http') || redirectTarget.startsWith('//')}
  <div style="background: #1a1a1a; border: 1px solid {isDangerous ? '#f44' : redirectTarget ? '#555' : '#333'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from searchParams.get('redirect')</div>
    <code style="color: {isDangerous ? '#f44' : '#ccc'}; font-size: 1.1rem;">redirect = {JSON.stringify(redirectTarget || '(empty)')}</code>
    <div style="color: {isDangerous ? '#f44' : '#888'}; font-size: 0.8rem; margin-top: 8px;">
      {#if !redirectTarget}
        No redirect param — add ?redirect=/some/path to test
      {:else if isDangerous}
        DANGEROUS: Arbitrary redirect target — open redirect or path traversal possible
      {:else}
        Redirect target detected: {redirectTarget}
      {/if}
    </div>
  </div>
  {:else}
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from searchParams.get('redirect')</div>
    <code style="color: #555;">loading...</code>
  </div>
  {/if}

  <!-- FETCH URL box (goto destination) -->
  <div style="background: #1a1a1a; border: 1px solid {redirectTarget && (redirectTarget.includes('..') || redirectTarget.startsWith('http')) ? '#f44' : redirectTarget ? '#555' : '#333'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">GOTO DESTINATION</div>
    <code style="color: {redirectTarget ? '#f44' : '#888'}; font-size: 1rem;">
      {redirectTarget ? `goto("${redirectTarget}")` : '(no redirect param)'}
    </code>
    {#if redirectTarget}
    <div style="color: #f44; font-size: 0.8rem; margin-top: 6px;">
      NOTE: If redirecting to an external origin, this is an open redirect vulnerability
    </div>
    {/if}
  </div>

  <!-- RESULT box -->
  <div style="background: #1a1a1a; border: 1px solid #555; border-radius: 6px; padding: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">STATUS</div>
    {#if redirectTarget}
      <p style="margin: 0; color: #f44;">Redirecting to: {redirectTarget}</p>
    {:else}
      <p style="margin: 0; color: #ccc;">Welcome to the dashboard. Add ?redirect=... to test open redirect.</p>
    {/if}
  </div>

  <div style="margin-top: 1.5rem; padding: 0.75rem; background: #0a0a1a; border: 1px solid #336; border-radius: 6px;">
    <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">TEST PAYLOADS</div>
    <a href="/dashboard?redirect=//evil.com" style="color: #f44; display: block;">/dashboard?redirect=//evil.com (open redirect)</a>
    <a href="/dashboard?redirect=/about" style="color: #4a4; display: block;">/dashboard?redirect=/about (normal)</a>
    <a href="/dashboard/stats" style="color: #888; display: block;">/dashboard/stats (XSS chain)</a>
    <a href="/dashboard/settings" style="color: #888; display: block;">/dashboard/settings (hash traversal)</a>
  </div>
</div>
