<script>
	// 	/** @type {import('./$types').PageData} */
	import { onMount } from 'svelte';
	import SpeckleViewer from '$lib/components/SpeckleViewer.svelte';
	import { get } from 'svelte/store';
	import { reloadViewer } from '$lib/speckle/speckleHandler';
	import {
		speckleStream,
		speckleViewer,
		speckleDatatree,
		finishLoading,
		viewerDeptos,
		sidebar_show,
		currentDepto,
		currentViewerDepto,
		displayCompositionTable_show
	} from '../stores/toolStore';
	import UtilityBar from '$lib/components/modelViewer/UtilityBar.svelte';
	import DonoutKpiChart from '$lib/components/charts/DonoutKpiChart.svelte';
	import DisplayCompositionTable from '$lib/components/analytics/DisplayCompositionTable.svelte';
	import DepartamentosOrientacionTable from '../lib/components/analytics/DepartamentosOrientacionTable.svelte';
	import Sidebar from '$lib/components/sidebarModal/Sidebar.svelte';
	import MobileWarning from '../lib/components/MobileWarning.svelte';
	import { Jellyfish } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores';
	export let data;

	let speckleStramToPass = '';
	let speckleViewerRunning = '';
	let loadCompleted = $finishLoading;
	let _sidebar_show = get(sidebar_show);
	let selectedElement = [];
	let _viewerLotes = [];

	//implement onMount function
	onMount(async () => {
		//handle sidebar show and hide
		currentViewerDepto.subscribe((v) => {
			if (v) {
				selectedElement = v.element;
				const viewerDeptosData = get(viewerDeptos);

				if (selectedElement && selectedElement.length > 0) {
					const viewerDeptosDataIds = viewerDeptosData.map((item) => item.id);
					const viewerDataIds = [...viewerDeptosDataIds];
					//console.log(viewerDataIds.includes(selectedElement[0]?.id), viewerDataIds)
					if (viewerDataIds.includes(selectedElement[0]?.id)) {
						//console.log('found showing sidebar', selectedElement[0]?.id);
						sidebar_show.set(true);
						const selectedDepto = viewerDeptosData.find(
							(item) => item.id === selectedElement[0]?.id
						);
						console.log(_sidebar_show, '========', selectedDepto);
						currentDepto.set(selectedDepto);
					} else {
						//console.log('not found hiding sidebar');
						_sidebar_show = false;
						currentDepto.set(null);
					}
				} else {
					_sidebar_show = false;
					currentDepto.set(null);
				}
			}
		});

		speckleViewer.subscribe((sv) => {
			speckleViewerRunning = sv;
			//console.log('from the store', get(speckleViewer));
		});
	});
	finishLoading.subscribe((v) => {
		console.log('finishLoading', v);
		if (v) {
			loadCompleted = true;
		} else {
			loadCompleted = false;
		}
	});
	sidebar_show.subscribe((v) => {
		console.log('sidebar_show', v);
		_sidebar_show = v;
	});
</script>
<MobileWarning></MobileWarning>
<SpeckleViewer _speckleStream={$speckleStream} />

{#if loadCompleted}
	<UtilityBar />
	<DonoutKpiChart dataProp={'edificio'} tittle="Deptos Por Edificio:" />
	<Sidebar bind:show={_sidebar_show} />
	<DisplayCompositionTable />
	<DepartamentosOrientacionTable />
{:else}
	<div class="center-loader">
		<Jellyfish size="60" color="#FF3E00" unit="px" duration="1.5s" />
	</div>
{/if}

<style>
	.center-loader {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
