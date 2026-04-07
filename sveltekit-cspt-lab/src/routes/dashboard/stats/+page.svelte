<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let htmlContent = $state('');
	let fetchUrl = $state('');
	let widget = $state<string | null>(null);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const w = $page.url.searchParams.get('widget');
		widget = w;
		if (w) {
			const url = `/api/widgets/${w}`;
			fetchUrl = url;
			fetch(url)
				.then((r) => r.text())
				.then((d) => (htmlContent = d))
				.catch((e) => (htmlContent = `Error: ${e}`));
		}
	});
</script>

<div style="font-family: monospace; max-width: 700px; color: #ccc;">
  <h1 style="color: #fff;">$page.url.searchParams — Decoded Source (DANGEROUS)</h1>
  <p style="color: #888;">
    Source: <code>$page.url.searchParams.get('widget')</code>.
    SvelteKit decodes query params — %2F becomes / before your code sees it.
    Combined with <code>{'{@html}'}</code>, this is a CSPT + XSS chain (CRITICAL).
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE</div>
    <code style="color: #f90;">const widget = $page.url.searchParams.get('widget')</code><br />
    <code style="color: #f90; font-size: 0.85rem;">fetch(`/api/widgets/$&#123;widget&#125;`)  →  {'{@html}'} htmlContent</code>
    <div style="color: #888; font-size: 0.8rem; margin-top: 6px;">
      Note: SvelteKit's {'{@html}'} is the XSS sink — equivalent of React's dangerouslySetInnerHTML
    </div>
  </div>

  <!-- RAW VALUE box -->
  {#if mounted}
  {@const hasDots = widget !== null && widget.includes('..')}
  {@const hasSlash = widget !== null && widget.includes('/')}
  {@const isDangerous = hasDots || hasSlash}
  <div style="background: #1a1a1a; border: 1px solid {isDangerous ? '#f44' : widget !== null ? '#555' : '#333'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from searchParams.get('widget')</div>
    <code style="color: {isDangerous ? '#f44' : '#ccc'}; font-size: 1.1rem;">widget = {JSON.stringify(widget)}</code>
    <div style="color: {isDangerous ? '#f44' : '#888'}; font-size: 0.8rem; margin-top: 8px;">
      {#if widget === null}
        No widget param — add ?widget=..%2Fattachments%2Fmalicious to test
      {:else if isDangerous}
        DANGEROUS: %2F was decoded to / — traversal dots visible, combined with {'{@html}'} = XSS
      {:else}
        Value present but no traversal pattern detected
      {/if}
    </div>
  </div>
  {:else}
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUE from searchParams.get('widget')</div>
    <code style="color: #555;">loading...</code>
  </div>
  {/if}

  <!-- FETCH URL box -->
  <div style="background: #1a1a1a; border: 1px solid {fetchUrl && fetchUrl.includes('..') ? '#f44' : fetchUrl ? '#555' : '#333'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">FETCH URL CONSTRUCTED</div>
    <code style="color: {fetchUrl && fetchUrl.includes('..') ? '#f44' : '#ccc'}; font-size: 1rem;">
      {fetchUrl || '(waiting for widget param)'}
    </code>
    {#if fetchUrl && fetchUrl.includes('..')}
    <div style="color: #f44; font-size: 0.8rem; margin-top: 6px;">
      DANGEROUS: The / in the path came from a decoded %2F — traversal is active
    </div>
    {/if}
  </div>

  <!-- SINK box (XSS) -->
  <div style="background: #1a1a1a; border: 1px solid #f44; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SINK — {'{@html}'} (XSS)</div>
    <div style="color: #f44; font-size: 0.8rem; margin-bottom: 8px;">
      The raw HTML response from fetch is injected into the DOM via {'{@html}'} — if the
      fetched resource contains HTML/JS, it executes.
    </div>
    <!-- XSS SINK: {@html} with fetch response -->
    <div class="stats-widget">
      {@html htmlContent}
    </div>
    {#if !htmlContent}
      <span style="color: #555;">(no content loaded yet)</span>
    {/if}
  </div>

  <!-- RESULT box -->
  <div style="background: #1a1a1a; border: 1px solid #555; border-radius: 6px; padding: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RESULT (raw fetch response text)</div>
    <pre style="margin: 0; color: #ccc; white-space: pre-wrap;">{htmlContent || '(no content)'}</pre>
  </div>

  <div style="margin-top: 1.5rem; padding: 0.75rem; background: #0a0a1a; border: 1px solid #336; border-radius: 6px;">
    <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">TEST PAYLOADS</div>
    <a href="/dashboard/stats?widget=..%2Fattachments%2Fmalicious" style="color: #f44; display: block;">/dashboard/stats?widget=..%2Fattachments%2Fmalicious (XSS — fetches HTML into @html sink)</a>
    <a href="/dashboard/stats?widget=default" style="color: #4a4; display: block;">/dashboard/stats?widget=default (normal)</a>
  </div>
</div>
