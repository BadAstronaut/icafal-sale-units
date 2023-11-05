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
	import MultiSelect from '$lib/components/sidebarModal/MultiSelect.svelte';
	let _displayOrientationAnalytics_show = $displayOrientationAnalytics_show;
	let closeIcon = '/icons/x.svg';
	let selectedRow = null;
	let _viewerDeptos = null;
	let uniqueOrientations = [];
	let sortedKeys = [];
	let sortedValues = [];
	let fullGroupedDeptos = null;
	let selectedOrientationValues = [];

	//on mount get data from viewerDeptos
	onMount(async () => {
		_viewerDeptos = viewerDeptosToOrientationTable($viewerDeptos);
		fullGroupedDeptos = groupByOrientationTowerAndFloor(_viewerDeptos);
		[sortedKeys, sortedValues] = convertObjectToListOrdered(fullGroupedDeptos.P.B);
		uniqueOrientations = Object.keys(fullGroupedDeptos);

		console.log('viewerDeptos..............', sortedKeys);
	});

	//function to group _viewerDeptos by orientation using unique values of orientation
	function groupByOrientationTowerAndFloor(deptos) {
		// Helper function to extract floor from icatipo and get tower from edificio
		const extractFloorAndTower = (depto) => {
			const tower = depto.edificio || 'Unknown'; // Get tower from edificio property
			const floor = depto.icatipo ? depto.icatipo.split('.')[1] || 'Unknown' : 'Unknown'; // Extract floor from icatipo
			return { tower, floor };
		};

		// First group by orientation
		let groupedByOrientation = deptos.reduce((acc, depto) => {
			const orientation = depto.orientacion || 'Unknown'; // Default for undefined orientation
			if (!acc[orientation]) {
				acc[orientation] = {};
			}
			const { tower, floor } = extractFloorAndTower(depto);
			if (!acc[orientation][tower]) {
				acc[orientation][tower] = {};
			}
			if (!acc[orientation][tower][floor]) {
				acc[orientation][tower][floor] = [];
			}
			acc[orientation][tower][floor].push(depto);
			return acc;
		}, {});

		// Now sort each floor group by numero within each tower
		Object.keys(groupedByOrientation).forEach((orientation) => {
			Object.keys(groupedByOrientation[orientation]).forEach((tower) => {
				Object.keys(groupedByOrientation[orientation][tower]).forEach((floor) => {
					groupedByOrientation[orientation][tower][floor].sort((a, b) => a.numero - b.numero);
				});
			});
		});

		return groupedByOrientation;
	}
	//modify this function to sort by icatipo which combines the tower and floor
	function viewerDeptosToOrientationTable(vdeptos) {
		let data = [];
		console.log('vdeptos', vdeptos);
		vdeptos.forEach((depto) => {
			priceStateFaker(depto);
			//console.log('depto', depto.icatipo);
			data.push(depto);
		});
		return data;
	}
	function convertObjectToListOrdered(obj) {
		const sortedKeys = Object.keys(obj).sort().reverse();
		const valuesArray = sortedKeys.map((key) => obj[key]);
		//console.log(sortedKeys, valuesArray); // Add this line to check the output
		return [sortedKeys, valuesArray];
	}

	function priceStateFaker(depto) {
		const baseStates = ['disponible', 'reservado', 'nodisponible'];
		const priceRange = [69, 100];
		let price = Math.floor(Math.random() * (priceRange[1] - priceRange[0] + 1) + priceRange[0]);
		let state = baseStates[Math.floor(Math.random() * baseStates.length)];
		//add properties to depto
		depto.precio = price;
		depto.estado = state;
	}

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

	function onMultiSelectChange(e) {
		console.log(e, 'placehorlder changed');
		//filter fullGroupedDeptos based on 2 which comes as object {P:{value:"P", name:"P"}, B:{value:"B", name:"B"}
		//iterate over e props and check if index in fullGroupedDeptos exists, if so save it
		let filteredGroupedDeptos = {};
		Object.keys(e).forEach((key) => {
			if (fullGroupedDeptos[key]) {
				filteredGroupedDeptos[key] = fullGroupedDeptos[key];
			}
		});
		selectedOrientationValues = processOrientationSelection(filteredGroupedDeptos);
		//console.log(filteredGroupedDeptos, 'filteredGroupedDeptos');
	}

	//will need to create a function to flatten the object from multiselect
	function processOrientationSelection(selectionObject) {
		// Initialize an empty array to hold the result
		let combinedSelectionArray = [];
		Object.keys(selectionObject).forEach((orientation) => {
			// Get the towers within this orientation
			const towers = selectionObject[orientation];
			console.log(towers, 'towers');
			Object.keys(towers).forEach((tower) => {
				const combinedKey = `${orientation}_${tower}`;
				// Get all departments in this tower
				const _tower = towers[tower];
				// Create a new object with the combined key and departments
				//const combinedObject = convertObjectToListOrdered(departments)
				combinedSelectionArray.push({ [combinedKey]: _tower });
			});
		});
		console.log(combinedSelectionArray, 'combinedSelectionArray');
		return combinedSelectionArray;
	}

	//end data mock

	displayOrientationAnalytics_show.subscribe((v) => {
		sidebar_show.set(false);
		console.log('displayCompositionTable_show', $sidebar_show);
		_displayOrientationAnalytics_show = v;
	});
</script>

{#if $displayOrientationAnalytics_show}
	<nav class="orientation-analytics" transition:fly={{ x: 250, opacity: 1 }}>
		<div class="component-head">
			<p class="title-text">Orientación:</p>
			<MultiSelect
				id="selectOrientation"
				value[0]
				placeholder="Select Orientation"
				onChange={onMultiSelectChange}
			>
				{#each uniqueOrientations as orientation}
					{#if orientation}
						<option value={orientation}>{orientation}</option>
					{/if}
				{/each}
			</MultiSelect>
			<button class="close-button" on:click={() => displayOrientationAnalytics_show.set(false)}>
				<img src={closeIcon} alt="x" />
			</button>
		</div>
		{#if selectedOrientationValues.length > 0}
			<div class="orientation-table-group">
				{#each selectedOrientationValues as towerGroup}
					<div class="orientation-group">
						{#each Object.entries(towerGroup) as [towerKey, floors]}
						<p class="tower-key-p">Elevación_Torre: {towerKey}</p>
						{#each Object.entries(floors) as [floorKey, departments]}
							<div class="table-row-container">
								<p class="nivel-p">{floorKey}</p>
								<div class="orientation-row-div">
									{#each departments as depto}
										<CellOrientacionTable
											numero={depto.numero}
											precio={depto.precio}
											tipologia={depto.tipologia}
											estado={depto.estado}
											id={depto.id}
											orientacion={depto.orientacion}
										/>
									{/each}
								</div>
							</div>
						{/each}
					{/each}
					</div>
					
				{/each}
			</div>
		{/if}
		<!-- <div class="orientation-table-div">
			{#each sortedKeys as key, index}
				<div class="table-row-container">
					<p class="nivel-p">{key}</p>
					<div class="orientation-row-div">
						{#each sortedValues[index] as depto}
							<CellOrientacionTable
								numero={depto.numero}
								precio={depto.precio}
								tipologia={depto.tipologia}
								estado={depto.estado}
								id={depto.id}
								orientacion={depto.orientacion}
							/>
						{/each}
					</div>
				</div>
			{/each}
		</div> -->
	</nav>
{/if}

<style>
	.orientation-group{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		margin: 0;
		padding: 5px;
		gap: 0rem;
		border : 1px solid ;
		border-radius: 10px;
		width: 100%;
	}
	.tower-key-p{
		font-size: 1rem;
		font-weight: 500;
		line-height: 1;
		margin: 0;
		padding-right: 15px;
		padding-top:10px;
		padding-bottom:5px;
		width: 100%;
	}
	.orientation-table-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		margin: 0;
		padding: 0;
		gap: 0.5rem;
	}
	.table-row-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin: 0;
		padding: 0;
		gap: 0rem;
	}
	.nivel-p {
		font-size: 1rem;
		font-weight: 500;
		line-height: 1;
		margin: 0;
		padding-right: 15px;
		width: 4rem;
	}
	.component-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap:5px;
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
