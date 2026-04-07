<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		* { box-sizing: border-box; }
		body {
			margin: 0;
			background: #111;
			color: #ccc;
			font-family: monospace;
		}
		a { color: #4a9eff; }
		a:visited { color: #7a7eff; }
		code { font-family: monospace; }
		pre { font-family: monospace; overflow-x: auto; }
	</style>
</svelte:head>

{@render children()}
