<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import {
		speckleViewer,
		viewerDeptos,
		finishLoading,
		displayCompositionTable_show,
		currentColorSet,
		sidebar_show
	} from '/src/stores/toolStore.js';
	//import modal
	import { resetViewerFilters, generateRandomColor } from '/src/lib/speckle/speckleHandler.js';

	let _displayCompositionTable_show = $displayCompositionTable_show;
	let closeIcon = '/icons/x.svg';
	let selectedRow = null;

	async function selectRow(row) {
		const v = get(speckleViewer).speckleViewer;
		selectedRow = row;

		// Mapping of tipologia to deptotipologia
		const tipologiaMapping = {
			'1D1B': '1D1B',
			'2D2B': '2D2B',
			'2D1B': '2D1B',
			'3D2B': '3D2B',
			"Estudio": ".ESTUDIO",


			// Add other mappings as needed
		};

		const deptotipologia = tipologiaMapping[row.tipologia];

		if (deptotipologia) {
			const toIsolate = $currentColorSet.filter((item) => item.deptotipologia === deptotipologia);
			await v.resetFilters();
			v.isolateObjects(toIsolate[0].objectIds);
			// If you want to log the objectIds, uncomment the following line
			// console.log(deptotipologia, toIsolate[0].objectIds);
		} 
		else if (row.tipologia === 'Total') {
			// Reset filters
			await v.resetFilters();
			//isolate all elements in currentColorSets 
			const toIsolate = $currentColorSet.map((item) => item.objectIds);
			v.isolateObjects(toIsolate.flat());
		}
		else {
			// Handle cases where row.tipologia doesn't match any known values
			console.error('Unknown tipologia:', row.tipologia);
		}
	}

	let data = [
		{ tipologia: 'Estudio', N: 1, O: 8, P: 9, S: 2, Total: 20, percent: '16%', color: 0x66c0b7 },
		{ tipologia: '1D1B', N: 5, O: 7, P: 18, S: 1, Total: 31, percent: '25%', color: 0xf1f3e8 },
		{ tipologia: '2D1B', N: 4, O: 4, P: 14, S: 0, Total: 22, percent: '17%', color: 0x375e62 },
		{ tipologia: '2D2B', N: 9, O: 0, P: 41, S: 0, Total: 50, percent: '40%', color: 0x3f9595 },
		{ tipologia: '3D2B', N: 0, O: 0, P: 3, S: 0, Total: 3, percent: '2%', color: 0xf3efe8 },
		//Total has no color.
		{
			tipologia: 'Total',
			N: 10,
			O: 28,
			P: 85,
			S: 3,
			Total: 126,
			percent: '100%',
			color: 0x00ffffff
		}
	];
	displayCompositionTable_show.subscribe((v) => {
		sidebar_show.set(false);
		console.log('displayCompositionTable_show', $sidebar_show);
		_displayCompositionTable_show = v;
	});

	// Convert 0x format to # format for CSS
	data = data.map((item) => ({
		...item,
		color: `#${item.color.toString(16)}`
	}));
</script>

{#if $displayCompositionTable_show}
	<nav class="composition-table" transition:fly={{ x: 250, opacity: 1 }}>
		<div class="component-head">
			<button class="close-button" on:click={() => displayCompositionTable_show.set(false)}>
				<img src={closeIcon} alt="x" />
			</button>
		</div>
		<table>
			<thead>
				<tr>
					<th class="main-header" colspan="2"> </th>
					<th class="main-header" colspan="6" style="background-color:gainsboro"
						>Cantidad de Deptos.</th
					>
				</tr>
				<tr>
					<th />
					<th>Orientación</th>
					<th>N</th>
					<th>O</th>
					<th>P</th>
					<th>S</th>
					<th>Total</th>
					<th>%</th>
				</tr>
			</thead>
			<tbody>
				{#each data as row}
					<tr on:click={() => selectRow(row)} class:selected={row === selectedRow}>
						<td class="color-row" style="background-color:{row.color};" />
						<td>{row.tipologia}</td>
						<td>{row.N}</td>
						<td>{row.O}</td>
						<td>{row.P}</td>
						<td>{row.S}</td>
						<td class="row-total">{row.Total}</td>
						<td>{row.percent}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<!-- {#if chatUi}
			<span>GPT Chat:</span>
			<ChatUi />
		{/if} -->
	</nav>
{/if}

<style>
	table tbody tr:last-child {
		font-weight: 600 !important;
	}
	table tbody tr:hover {
		cursor: pointer;
		background-color: rgba(220, 220, 220, 0.2);
	}
	.row-total {
		font-weight: 600;
	}
	.color-row {
		width: 10px;
		margin-left: 0;
	}
	.component-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 5px;
		height: 1rem;
	}
	.title-text {
		font-size: 1rem;
		font-weight: 500;
		margin: 0;
		padding: 0;
	}
	.main-header {
		text-align: center;
	}
	table {
		border-collapse: collapse;
		width: 100%;
		height: 80%;
		margin: 0;
		padding: 0;
		z-index: 1000;
	}

	th,
	td {
		border: 1px solid none;
		padding: 2px;
		padding-left: 5px;
		text-align: left;
		min-width: 10px;
	}

	th {
		text-align: left;
	}
	.close-button {
		border-radius: 50%;
		border: none;
		background-color: transparent;
		padding: 0;
		margin: 0;
		position: absolute;
		right: 15px;
		height: auto;
		width: 15px;
	}
	tr.selected {
		background-color: rgb(255, 203, 159, 20%); /* Example color (light gold) */
	}

	.composition-table {
		position: fixed;
		right: 0;
		bottom: 3rem;
		height: auto;
		max-height: 30vh;
		padding: 0rem 1rem 1rem;
		margin-right: 1rem;
		box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
		width: 30em;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 1rem;
		border-radius: 5px;
		/* From https://css.glass */
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(3px);
		-webkit-backdrop-filter: blur(3px);
	}
</style>
