<script>
	import { get } from 'svelte/store';
	import {
		speckleViewer,
	} from '/src/stores/toolStore.js';
	export let numero;
	export let precio;
	export let id;
	export let tipologia;
	export let estado;
	export let orientacion;

	// Mapping colors for tipologias and estados
	const tipologiaColors = {
		'1D1B': 'red',
		'2D1B': 'blue',
		'2D2B': 'green',
		'3D2B': 'yellow'
	};

	const estadoColors = {
		reservado: '#f2f2f2', // light gray
		disponible: '#e6ffe6', // light green
		nodisponible: '#181615' //black color
	};

	function handleClick() {
		console.log('clicked', id, $speckleViewer);
		$speckleViewer.speckleViewer.selectObjects([id]);
		$speckleViewer.speckleViewer.isolateObjects([id]);

	}
</script>

<div class="cell" on:click={handleClick} style="--bg-color: {estadoColors[estado]};">
	<div class="state-number">
		<p class="numero">{numero}</p>
		<div class="circle" style="--circle-color: {tipologiaColors[tipologia]};" />
	</div>
	
	<span class="precio">{precio}</span>
</div>

<style>
	.state-number{
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: flex-start;
		height: 100%;
		width: 50%;
	}
	.numero {
		font-size: 0.5em;
		position: relative;
		margin: 0;
		height: 0.5em;
	}
	.precio {
		font-size: 0.8em;
	}
	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0.1px solid	 lightgray;
		width: 4em;
		height: 1.5em;
		overflow: hidden; /* Ensure content doesn't spill out */
		background-color: var(--bg-color);
		transition: background-color 0.3s;
		cursor: pointer;
		padding: 0px;
		margin: 0px;
	}
	.cell:hover {
		background-color: #f7f7f7; /* Subtle hover effect */
	}

	.circle {
		width: 10px;
		height: 10px;
		border: 1.5px solid lightgray;
		border-radius: 50%;
		background-color: var(--circle-color);
		margin-top: 8px;
		/* https://smoothshadows.com/#djEsMSw1LDAuMDgsMjQsMzIsMCwjMDMwNzEyLCNmM2Y0ZjYsI2ZmZmZmZiwy */
		/* https://smoothshadows.com/#djEsMSwzLDAuNDQsMzQsMzIsMCwjMDMwNzEyLCNmM2Y0ZjYsI2ZmZmZmZiwy */
		box-shadow: 0px 4px 4px rgba(3, 7, 18, 0.15), 0px 14px 15px rgba(3, 7, 18, 0.29),
			0px 32px 34px rgba(3, 7, 18, 0.44);
	}
</style>
