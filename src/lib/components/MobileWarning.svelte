<script>
	import { onMount } from 'svelte';

	let displayWarning = false;

	onMount(() => {
		if (!sessionStorage.getItem('mobileWarningClosed')) {
			displayWarning = isMobileDevice();
		}
	});

	function isMobileDevice() {
		return (
			typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1
		);
	}

	function closeWarning() {
		displayWarning = false;
		sessionStorage.setItem('mobileWarningClosed', 'true');
	}
</script>

{#if displayWarning}
	<div class="mobile-warning">
		Para mejor experiencia utilice computador 💻.
		<button on:click={closeWarning}>Close</button>
	</div>
{/if}

<style>
	.mobile-warning {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: #ffeb3b; /* yellow background */
		color: #333; /* dark text */
		padding: 10px;
		text-align: center;
		z-index: 1000;
	}

	.mobile-warning button {
		background-color: #f44336; /* red background */
		color: #fff; /* white text */
		border: none;
		padding: 5px 10px;
		margin-left: 10px;
		cursor: pointer;
	}
</style>
