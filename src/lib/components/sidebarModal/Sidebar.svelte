<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { reloadViewer } from '$lib/speckle/speckleHandler';
	import {
		finishLoading,
		speckleViewer,
		viewerDeptos,
		sidebar_show,
		currentDepto,
		disponibilitySelected,
		colorValueDisponibility,
		chatMessages
	} from '/src/stores/toolStore';
	import {
		selectElementsByPropNameValue,
		resetViewerFilters
	} from '/src/lib/speckle/speckleHandler.js';
	import { SpriteMaterial } from 'three';
	import SideBarRow from './SideBarRow.svelte';
	import MultiSelect from './MultiSelect.svelte';
	import ChatUi from '../gptChat/ChatUi.svelte';
	import ImageViewer from './ImageViewer.svelte';
	import { element } from 'svelte/internal';

	export let show = false;
	let depto = get(currentDepto);
	console.log('depto', depto);
	let filterService = false;
	let _disponibilitySelected = $disponibilitySelected;
	let chatUi = $chatMessages;

	currentDepto.subscribe((v) => {
			depto = v;
		});
	function truncateString(str, maxLength) {
		let truncatedString = '';
		if (str.length <= maxLength) {
			truncatedString = str;
		} else {
			//check if its string if it is get the first 15 characters
			if (typeof str === 'string') {
				truncatedString = str.substring(0, maxLength) + '...';
			} else {
				truncatedString = str;
			}
		}
		return truncatedString;
	}
</script>

{#if show}
	<nav class="side-bar" transition:fly={{ x: 250, opacity: 1 }}>
		{#if depto}
			<span>Departamento: {depto.numero}</span>
			<div class="side-container">
				{#each Object.entries(depto) as [propName, propValue]}
					<SideBarRow {propName} {propValue} />
				{/each}
			</div>
			<ImageViewer src="/departamentos/plantas/2D2B.jpg" />
		{/if}
		<!-- {#if chatUi}
			<span>GPT Chat:</span>
			<ChatUi />
		{/if} -->
	</nav>
{/if}

<style>
	.side-container {
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
	.side-bar {
		position: fixed;
		right: 0;
		top: 3rem;
		height: auto;
		max-height: 90vh;
		min-height: 50vh;
		padding: 2rem 1rem 1rem;
		margin-right: 1rem;
		box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
		width: 20em;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 1rem;
		z-index: 5;
		border-radius: 5px;
		/* From https://css.glass */
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(3px);
		-webkit-backdrop-filter: blur(3px);
	}
</style>
