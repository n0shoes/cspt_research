<script lang="ts">
	import { onMount } from 'svelte';

	// Service layer abstraction — hides the fetch sink
	const apiService = {
		get: (path: string) => fetch(`/api${path}`).then((r) => r.json())
	};

	let settings = $state<unknown>(null);
	let hashPath = $state('');
	let fetchUrl = $state('');
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const hash = window.location.hash.slice(1); // remove '#'
		hashPath = hash;
		if (hash) {
			const url = `/api${hash}`;
			fetchUrl = url;
			// Hash value flows through service layer into fetch
			apiService.get(hash).then((d) => (settings = d)).catch((e) => (settings = { error: String(e) }));
		}
	});
</script>

<div style="font-family: monospace; max-width: 700px; color: #ccc;">
  <h1 style="color: #fff;">location.hash — Literal Traversal Source (DANGEROUS)</h1>
  <p style="color: #888;">
    Source: <code>window.location.hash.slice(1)</code>.
    The hash fragment is never URL-decoded — literal <code>../../admin/users</code>
    works directly. Flows through a service layer abstraction into fetch.
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE</div>
    <code style="color: #f90;">const hash = window.location.hash.slice(1)</code><br />
    <code style="color: #f90; font-size: 0.85rem;">apiService.get(hash)  →  fetch(`/api$&#123;hash&#125;`)</code>
    <div style="color: #888; font-size: 0.8rem; margin-top: 6px;">
      Note: Service layer hides the fetch sink — common real-world pattern
    </div>
  </div>

  <!-- RAW VALUE box -->
  {#if mounted}
  {@const hasDots = hashPath.includes('..')}
  {@const hasLiteral = hashPath.includes('/')}
  {@const isDangerous = hasDots}
  <div style="background: #1a1a1a; border: 1px solid {isDangerous ? '#f44' : hashPath ? '#555' : '#333'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from location.hash</div>
    <code style="color: {isDangerous ? '#f44' : '#ccc'}; font-size: 1.1rem;">hash = {JSON.stringify(hashPath || '(empty)')}</code>
    <div style="color: {isDangerous ? '#f44' : '#888'}; font-size: 0.8rem; margin-top: 8px;">
      {#if !hashPath}
        No hash — navigate to #../../admin/users to test traversal
      {:else if isDangerous}
        DANGEROUS: Literal ../ in hash — no encoding needed, direct traversal
      {:else}
        Hash present but no traversal pattern detected
      {/if}
    </div>
  </div>
  {:else}
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from location.hash</div>
    <code style="color: #555;">loading...</code>
  </div>
  {/if}

  <!-- FETCH URL box -->
  <div style="background: #1a1a1a; border: 1px solid {fetchUrl && fetchUrl.includes('..') ? '#f44' : fetchUrl ? '#555' : '#333'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">FETCH URL CONSTRUCTED (inside apiService.get)</div>
    <code style="color: {fetchUrl && fetchUrl.includes('..') ? '#f44' : '#ccc'}; font-size: 1rem;">
      {fetchUrl || '(waiting for hash)'}
    </code>
    {#if fetchUrl && fetchUrl.includes('..')}
    <div style="color: #f44; font-size: 0.8rem; margin-top: 6px;">
      DANGEROUS: Literal path traversal segments passed to fetch — no encoding needed for hash-based CSPT
    </div>
    {/if}
  </div>

  <!-- RESULT box -->
  <div style="background: #1a1a1a; border: 1px solid #555; border-radius: 6px; padding: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RESULT from fetch</div>
    <pre style="margin: 0; color: #ccc;">{JSON.stringify(settings, null, 2)}</pre>
  </div>

  <div style="margin-top: 1.5rem; padding: 0.75rem; background: #0a0a1a; border: 1px solid #336; border-radius: 6px;">
    <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">TEST PAYLOADS</div>
    <a href="/dashboard/settings#../../admin/users" style="color: #f44; display: block;">/dashboard/settings#../../admin/users</a>
    <a href="/dashboard/settings#/settings/profile" style="color: #4a4; display: block;">/dashboard/settings#/settings/profile (normal)</a>
  </div>
</div>
