<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let result = $state<unknown>(null);
	let fetchUrl = $state('');
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const userId = $page.params.userId;
		const url = `/api/users/${userId}/profile`;
		fetchUrl = url;
		fetch(url)
			.then((r) => r.json())
			.then((d) => (result = d))
			.catch((e) => (result = { error: String(e) }));
	});

	// Reactive: re-run if params change
	$effect(() => {
		const userId = $page.params.userId;
		if (!mounted) return;
		const url = `/api/users/${userId}/profile`;
		fetchUrl = url;
		fetch(url)
			.then((r) => r.json())
			.then((d) => (result = d))
			.catch((e) => (result = { error: String(e) }));
	});
</script>

<div style="padding: 2rem; font-family: monospace; max-width: 700px; background: #111; min-height: 100vh; color: #ccc;">
  <h1 style="color: #fff;">$page.params — Single Dynamic Param</h1>
  <p style="color: #888;">
    Source: <code>$page.params.userId</code> reading <code>[userId]</code>.
    SvelteKit decodes %2F in params — %2F becomes / before your code sees it, enabling path traversal.
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE</div>
    <code style="color: #f90;">const userId = $page.params.userId</code><br />
    <code style="color: #f90; font-size: 0.85rem;">fetch(`/api/users/$&#123;userId&#125;/profile`)</code>
  </div>

  <!-- RAW VALUE box -->
  {#if mounted}
  {@const userId = $page.params.userId}
  {@const isDecoded = userId.includes('/') && !userId.includes('%2')}
  {@const hasDots = userId.includes('..')}
  {@const isDangerous = isDecoded || hasDots}
  <div style="background: #1a1a1a; border: 1px solid {isDangerous ? '#f44' : '#555'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from $page.params.userId</div>
    <code style="color: {isDangerous ? '#f44' : '#ccc'}; font-size: 1.1rem;">userId = {JSON.stringify(userId)}</code>
    <div style="color: {isDangerous ? '#f44' : '#888'}; font-size: 0.8rem; margin-top: 8px;">
      {#if isDangerous}
        DANGEROUS: %2F was decoded to / — traversal dots are visible, path boundaries can be crossed
      {:else}
        No traversal pattern detected in this request
      {/if}
    </div>
  </div>
  {:else}
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from $page.params.userId</div>
    <code style="color: #555;">loading...</code>
  </div>
  {/if}

  <!-- FETCH URL box -->
  <div style="background: #1a1a1a; border: 1px solid {fetchUrl && fetchUrl.includes('..') ? '#f44' : fetchUrl ? '#555' : '#333'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">FETCH URL CONSTRUCTED</div>
    <code style="color: {fetchUrl && fetchUrl.includes('..') ? '#f44' : '#ccc'}; font-size: 1rem;">
      {fetchUrl || '(waiting for mount)'}
    </code>
    {#if fetchUrl && fetchUrl.includes('..')}
    <div style="color: #f44; font-size: 0.8rem; margin-top: 6px;">
      DANGEROUS: Traversal segments in the fetch URL — server will resolve the path
    </div>
    {/if}
  </div>

  <!-- RESULT box -->
  <div style="background: #1a1a1a; border: 1px solid #555; border-radius: 6px; padding: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RESULT from fetch</div>
    <pre style="margin: 0; color: #ccc;">{JSON.stringify(result, null, 2)}</pre>
  </div>

  <div style="margin-top: 1.5rem; padding: 0.75rem; background: #0a0a1a; border: 1px solid #336; border-radius: 6px;">
    <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">TEST PAYLOADS</div>
    <a href="/users/..%2Faccount%2Fupgrade" style="color: #f44; display: block;">/users/..%2Faccount%2Fupgrade (CSRF — hits /api/account/upgrade/profile)</a>
    <a href="/users/123" style="color: #4a4; display: block;">/users/123 (normal)</a>
  </div>
</div>
