<script>
	export let numero;
	export let precio;
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
		dispatch('click', numero);
	}
</script>

<div class="cell" on:click={handleClick} style="--bg-color: {estadoColors[estado]};">
	<div class="circle" style="--circle-color: {tipologiaColors[tipologia]};" />
	<span>{precio}</span>
</div>

<style>
	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0.1px solid	 lightgray;
		width: 4em;
		height: 1.2em;
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
		margin: 5px;
		margin-right: 10px;
		/* https://smoothshadows.com/#djEsMSw1LDAuMDgsMjQsMzIsMCwjMDMwNzEyLCNmM2Y0ZjYsI2ZmZmZmZiwy */
		/* https://smoothshadows.com/#djEsMSwzLDAuNDQsMzQsMzIsMCwjMDMwNzEyLCNmM2Y0ZjYsI2ZmZmZmZiwy */
		box-shadow: 0px 4px 4px rgba(3, 7, 18, 0.15), 0px 14px 15px rgba(3, 7, 18, 0.29),
			0px 32px 34px rgba(3, 7, 18, 0.44);
	}
</style>
