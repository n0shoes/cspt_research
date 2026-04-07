<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let result = $state<unknown>(null);
	let fetchUrl = $state('');
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const filePath = $page.params.path;
		const url = `/api/files/${filePath}`;
		fetchUrl = url;
		fetch(url)
			.then((r) => r.text())
			.then((d) => (result = d))
			.catch((e) => (result = { error: String(e) }));
	});
</script>

<div style="padding: 2rem; font-family: monospace; max-width: 700px; background: #111; min-height: 100vh; color: #ccc;">
  <h1 style="color: #fff;">$page.params — Catch-All [...path] Route</h1>
  <p style="color: #888;">
    Source: <code>$page.params.path</code> reading <code>[...path]</code>.
    SvelteKit decodes %2F in catch-all params — each segment may contain decoded slashes.
    CRITICAL: entire paths can be traversed.
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE</div>
    <code style="color: #f90;">const filePath = $page.params.path  // [...path] catch-all</code><br />
    <code style="color: #f90; font-size: 0.85rem;">fetch(`/api/files/$&#123;filePath&#125;`)</code>
    <div style="color: #888; font-size: 0.8rem; margin-top: 6px;">
      Note: SvelteKit catch-all params decode encoded slashes — %2F becomes / in the string value
    </div>
  </div>

  <!-- RAW VALUE box -->
  {#if mounted}
  {@const filePath = $page.params.path}
  {@const hasDots = filePath.includes('..')}
  {@const hasDecodedSlash = filePath.includes('/') && !filePath.startsWith('/')}
  {@const isDangerous = hasDots || (hasDecodedSlash && filePath.includes('..'))}
  <div style="background: #1a1a1a; border: 1px solid {hasDots ? '#f44' : '#555'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from $page.params.path</div>
    <code style="color: {hasDots ? '#f44' : '#ccc'}; font-size: 1.1rem;">params.path = {JSON.stringify(filePath)}</code>
    <div style="color: {hasDots ? '#f44' : '#888'}; font-size: 0.8rem; margin-top: 8px;">
      {#if hasDots}
        DANGEROUS: Traversal dots present — %2F was decoded, path boundaries can be crossed
      {:else}
        Catch-all path value (slashes are from normal segment splitting here)
      {/if}
    </div>
  </div>
  {:else}
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from $page.params.path</div>
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
      DANGEROUS: Traversal segments in URL — server resolves relative paths
    </div>
    {:else if fetchUrl}
    <div style="color: #888; font-size: 0.8rem; margin-top: 6px;">
      Normal path — no traversal detected in this request
    </div>
    {/if}
  </div>

  <!-- RESULT box -->
  <div style="background: #1a1a1a; border: 1px solid #555; border-radius: 6px; padding: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RESULT from fetch</div>
    <pre style="margin: 0; color: #ccc; white-space: pre-wrap;">{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
  </div>

  <div style="margin-top: 1.5rem; padding: 0.75rem; background: #0a0a1a; border: 1px solid #336; border-radius: 6px;">
    <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">TEST PAYLOADS</div>
    <a href="/files/..%2F..%2Fetc%2Fpasswd" style="color: #f44; display: block;">/files/..%2F..%2Fetc%2Fpasswd</a>
    <a href="/files/documents/report.pdf" style="color: #4a4; display: block;">/files/documents/report.pdf (normal)</a>
  </div>
</div>
