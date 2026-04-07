<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let result = $state<unknown>(null);
	let fetchUrl = $state('');
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const teamId = $page.params.teamId;
		const memberId = $page.params.memberId;
		const url = `/api/teams/${teamId}/members/${memberId}`;
		fetchUrl = url;
		fetch(url)
			.then((r) => r.json())
			.then((d) => (result = d))
			.catch((e) => (result = { error: String(e) }));
	});
</script>

<div style="padding: 2rem; font-family: monospace; max-width: 700px; background: #111; min-height: 100vh; color: #ccc;">
  <h1 style="color: #fff;">$page.params — Nested Route Params</h1>
  <p style="color: #888;">
    Source: <code>$page.params.teamId</code> + <code>$page.params.memberId</code>.
    SvelteKit decodes both nested params — traversal possible at either level.
  </p>

  <!-- SOURCE box -->
  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">SOURCE</div>
    <code style="color: #f90;">const teamId = $page.params.teamId</code><br />
    <code style="color: #f90;">const memberId = $page.params.memberId</code><br />
    <code style="color: #f90; font-size: 0.85rem;">fetch(`/api/teams/$&#123;teamId&#125;/members/$&#123;memberId&#125;`)</code>
  </div>

  <!-- RAW VALUE box -->
  {#if mounted}
  {@const teamId = $page.params.teamId}
  {@const memberId = $page.params.memberId}
  {@const teamDanger = teamId.includes('..') || (teamId.includes('/') && teamId.includes('..'))}
  {@const memberDanger = memberId.includes('..') || (memberId.includes('/') && memberId.includes('..'))}
  {@const isDangerous = teamDanger || memberDanger}
  <div style="background: #1a1a1a; border: 1px solid {isDangerous ? '#f44' : '#555'}; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
    <div style="color: #888; font-size: 0.8rem; margin-bottom: 4px;">RAW VALUES from $page.params</div>
    <code style="color: {teamDanger ? '#f44' : '#ccc'}; display: block;">teamId = {JSON.stringify(teamId)}</code>
    <code style="color: {memberDanger ? '#f44' : '#ccc'}; display: block; margin-top: 4px;">memberId = {JSON.stringify(memberId)}</code>
    <div style="color: {isDangerous ? '#f44' : '#888'}; font-size: 0.8rem; margin-top: 8px;">
      {#if isDangerous}
        DANGEROUS: %2F decoded in nested param — path traversal active in deeply nested route
      {:else}
        Both nested params look normal — no traversal pattern detected
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
      DANGEROUS: Traversal in nested route URL — even deep nesting is exploitable
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
    <a href="/teams/1%2F..%2F..%2Fadmin/members/m1" style="color: #f44; display: block;">/teams/1%2F..%2F..%2Fadmin/members/m1 (teamId injection)</a>
    <a href="/teams/t1/members/m1" style="color: #4a4; display: block;">/teams/t1/members/m1 (normal)</a>
  </div>
</div>
