<script>
	import { onMount } from 'svelte';
	export let src;

	let loaded = false;
	let failed = false;
	let loading = false;

	onMount(() => {
		const img = new Image();
		img.src = src;
		loading = true;

		img.onload = () => {
			loading = false;
			loaded = true;
		};
		img.onerror = () => {
			loading = false;
			failed = true;
		};
	});
</script>

<div class="image-sidebar">
	{#if loaded}
		<img {src} alt="Document" />
	{:else if failed}
		<img
			src="https://icon-library.com/images/not-found-icon/not-found-icon-20.jpg"
			alt="Not Found"
		/>
	{:else if loading}
		<img src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif" alt="Loading..." />
	{/if}
</div>
<style>
.image-sidebar {
    display: flex;
    flex-direction: column;
    align-items: start;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 1rem;
    padding-left: 0;
    margin: 0%;
    padding-bottom: 2rem;
    justify-content: flex-start;
    gap: 5px;
    height: auto;
    width: 100%;
}
</style>
