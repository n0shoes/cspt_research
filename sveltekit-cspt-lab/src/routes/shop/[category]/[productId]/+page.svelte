<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let result = $state<unknown>(null);
	let fetchUrl = $state('');
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const category = $page.params.category;
		const productId = $page.params.productId;
		const url = `/api/shop/${category}/products/${productId}`;
		fetchUrl = url;
		fetch(url)
			.then((r) => r.json())
			.then((d) => (result = d))
			.catch((e) => (result = { error: String(e) }));
	});
</script>

<div style="padding: 2rem; font-family: monospace; max-width: 700px; background: #111; min-height: 100vh; color: #ccc;">
  <h1 style="color: #fff;">$page.params — Multi-Param Concat</h1>
  <p style="color: #888;">
    Source: <code>$page.params.category</code> + <code>$page.params.productId</code>.
    SvelteKit decodes both params — either can contain decoded %2F to inject path traversal.
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE</div>
    <code style="color: #f90;">const category = $page.params.category</code><br />
    <code style="color: #f90;">const productId = $page.params.productId</code><br />
    <code style="color: #f90; font-size: 0.85rem;">fetch(`/api/shop/$&#123;category&#125;/products/$&#123;productId&#125;`)</code>
  </div>

  <!-- RAW VALUE box -->
  {#if mounted}
  {@const category = $page.params.category}
  {@const productId = $page.params.productId}
  {@const catDanger = category.includes('..') || (category.includes('/') && !category.startsWith('/'))}
  {@const pidDanger = productId.includes('..') || (productId.includes('/') && !productId.startsWith('/'))}
  {@const isDangerous = catDanger || pidDanger}
  <div style="background: #1a1a1a; border: 1px solid {isDangerous ? '#f44' : '#555'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUES from $page.params</div>
    <code style="color: {catDanger ? '#f44' : '#ccc'}; display: block;">category = {JSON.stringify(category)}</code>
    <code style="color: {pidDanger ? '#f44' : '#ccc'}; display: block; margin-top: 4px;">productId = {JSON.stringify(productId)}</code>
    <div style="color: {isDangerous ? '#f44' : '#888'}; font-size: 0.8rem; margin-top: 8px;">
      {#if isDangerous}
        DANGEROUS: %2F decoded in {catDanger ? 'category' : 'productId'} — path injection active
      {:else}
        Both params look normal — no traversal pattern detected
      {/if}
    </div>
  </div>
  {:else}
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUES from $page.params</div>
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
      DANGEROUS: Traversal segments in URL from decoded params
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
    <a href="/shop/electronics%2Fhacked/99" style="color: #f44; display: block;">/shop/electronics%2Fhacked/99 (category injection)</a>
    <a href="/shop/electronics/456" style="color: #4a4; display: block;">/shop/electronics/456 (normal)</a>
  </div>
</div>
