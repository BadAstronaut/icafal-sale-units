<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import CellOrientacionTable from './CellOrientacionTable.svelte';
	import {
		speckleViewer,
		viewerDeptos,
		finishLoading,
		displayOrientationAnalytics_show,
		currentColorSet,
		sidebar_show
	} from '/src/stores/toolStore.js';
	//import modal
	import { resetViewerFilters, generateRandomColor } from '/src/lib/speckle/speckleHandler.js';

	let _displayOrientationAnalytics_show = $displayOrientationAnalytics_show;
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
			Estudio: '.ESTUDIO'

			// Add other mappings as needed
		};

		const deptotipologia = tipologiaMapping[row.tipologia];

		if (deptotipologia) {
			const toIsolate = $currentColorSet.filter((item) => item.deptotipologia === deptotipologia);
			await v.resetFilters();
			v.isolateObjects(toIsolate[0].objectIds);
			// If you want to log the objectIds, uncomment the following line
			// console.log(deptotipologia, toIsolate[0].objectIds);
		} else if (row.tipologia === 'Total') {
			// Reset filters
			await v.resetFilters();
			//isolate all elements in currentColorSets
			const toIsolate = $currentColorSet.map((item) => item.objectIds);
			v.isolateObjects(toIsolate.flat());
		} else {
			// Handle cases where row.tipologia doesn't match any known values
			console.error('Unknown tipologia:', row.tipologia);
		}
	}
	//data mock
	let baseDeptos = [
		{
			numero: '101',
			precio: 100,
			area: 100,
			tipologia: '1D1B',
			estado: 'reservado',
			orientacion: 'n'
		},
		{
			numero: '103',
			precio: 66,
			area: 110,
			tipologia: '2D1B',
			estado: 'disponible',
			orientacion: 'n'
		},
		{
			numero: '105',
			precio: 72,
			area: 112,
			tipologia: '3D2B',
			estado: 'disponible',
			orientacion: 'n'
		},
		{
			numero: '107',
			precio: 68,
			area: 115,
			tipologia: '2D2B',
			estado: 'reservado',
			orientacion: 'no'
		},
		{
			numero: '108',
			precio: 73,
			area: 116,
			tipologia: '2D1B',
			estado: 'nodisponible',
			orientacion: 'n'
		},
		{
			numero: '109',
			precio: 70,
			area: 117,
			tipologia: '3D2B',
			estado: 'disponible',
			orientacion: 'n'
		}
	];

	let data = [];

	for (let i = 11; i >= 1; i--) {
		let nivelData = {
			nivel: i.toString(),
			orientacion: 'N',
			deptos: baseDeptos.map((depto) => ({
				...depto,
				numero: (i * 100 + (parseInt(depto.numero) % 100)).toString()
			}))
		};
		data.push(nivelData);
	}

	//end data mock

	displayOrientationAnalytics_show.subscribe((v) => {
		sidebar_show.set(false);
		console.log('displayCompositionTable_show', $sidebar_show);
		_displayOrientationAnalytics_show = v;
	});

	// Convert 0x format to # format for CSS
	// data = data.map((item) => ({
	// 	...item,
	// 	color: `#${item.color.toString(16)}`
	// }));
    console.log("data",data);
</script>

{#if $displayOrientationAnalytics_show}
	<nav class="orientation-analytics" transition:fly={{ x: 250, opacity: 1 }}>
		<div class="component-head">
			<p class="title-text">Orientación: {data[0].orientacion}</p>
			<button class="close-button" on:click={() => displayOrientationAnalytics_show.set(false)}>
				<img src={closeIcon} alt="x" />
			</button>
		</div>
		<div class="orientation-table-div">
			{#each data as nivel}
				<div class="table-row-container">
					<p class="nivel-p">{nivel.nivel}</p>
					<div class="orientation-row-div">
						{#each nivel.deptos as depto}
							<CellOrientacionTable
								numero={depto.numero}
								precio={depto.precio}
								tipologia={depto.tipologia}
								estado={depto.estado}
								orientacion={depto.orientacion}
							/>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</nav>
{/if}

<style>
    .table-row-container{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin: 0;
        padding: 0;
        gap: 0rem;
    }
	.nivel-p {
		font-size: 1.1rem;
		font-weight: 500;
        line-height: 1;
		margin: 0;
		padding-right: 15px;
        width: 2rem;
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
	.orientation-row-div {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		gap: 0rem;
	}
	.orientation-table-div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
        margin: 0;
        padding: 0;
		gap: 0rem;
	}

	.orientation-analytics {
		position: fixed;
		right: 0;
		top: 3rem;
		height: auto;
		max-height: 70vh;
		padding: 0rem 1rem 1rem;
		margin-right: 1rem;
		box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
		width: auto;
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
