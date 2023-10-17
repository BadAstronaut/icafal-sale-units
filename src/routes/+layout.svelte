<script>
	import pico from '@picocss/pico';
</script>



<svelte:head>
    <title>ICAFAL Analytics</title>
	<link rel="icon" href="/icons/building.svg" type="image/svg+xml">

</svelte:head>


<nav>
	<!-- add logoCTEC as a a logo in the top left corner of the nav bar -->
	<img class="logo" src="/logoICAFAL.png" alt="logo Icafal" width="auto" height="auto" />
	<div class="head-title">
		<h1 class="title">Unidades Vendibles ICAFAL</h1>
		<h2 class="coord">Proyecto: Clarck</h2>
	</div>
	<!-- <a data-sveltekit-preload-data="tap" href="/">Mod Habitar</a> Laguna Caren 33°26'12.2"S 70°50'20.0"W Pudahuel, 9020000, Región Metropolitana
  <a data-sveltekit-preload-data="tap" href="/viviendas/vivienda-1">Vivienda 1</a>
  <a data-sveltekit-preload-data="tap" href="/viviendas/vivienda-2">Vivienda 2</a> -->
</nav>

<main>
	<slot />
</main>

<footer class="footer">©ICAFAL Web Platforms</footer>

<style>
	nav {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		flex-direction: row;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		width: 100%;
		height: 1vh;
	}
	.title {
		font-size: 0.9rem;
		padding: 0;
		margin: 0;
	}
	.head-title {
		position: absolute;
		top: 5px;
		left: 5em;
		padding: 5px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		height: 1.5em;
		gap: 0;
		width: 100vw;
		margin: 0;
	}
	.coord {
		font-size: 0.9rem;
		height: 1em;
		font-weight: 500;
		margin: 0;
	}
	.logo {
		position: absolute;
		top: 10px;
		left: 10px;
		width: 4.5em;
		height: auto;
		padding: 5px;
	}
	:global(html) {
		/* scrollbar-gutter: stable; */
		overflow: hidden;
		overflow-y: hidden;
	}
	:global(body){
		/* scrollbar-gutter: stable; */
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		height: 100vh;
		width: 120vw;
		margin: 0;
		padding: 0;
	}
	main {
		position: relative;
		height: 98vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		margin: 0;
		padding: 0;


	}

	footer {
		position: absolute;
		bottom: 0;
		right: 1;
		margin-bottom: 2vh;
		text-align: center;
		color: rgba(94, 104, 121, 0.388);
		height: 1vh;
		width: 100%;
		z-index: 1000;

	}
</style>
