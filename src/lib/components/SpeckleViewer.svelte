<script>
	import { Viewer, ViewerEvent } from '@speckle/viewer';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
	import { get } from 'svelte/store';
	import {
		fetchUserData,
		reloadViewerGetObjectsByIds,
		handleBeaconOrigin,
		reloadViewer,
		changeElementColorByIds, 
	} from '$lib/speckle/speckleHandler';
	
	import {
		speckleViewer,
		speckleStream,
		finishLoading,
		speckleDatatree,
		currentDepto,
		sidebar_show,
		disponibilitySelected,
		currentViewerDepto,
		viewerDeptos,
		speckleSchedule,
		showModal,
	} from '../../stores/toolStore';
	import FloatingModal from './FloatingModal.svelte';
	export let _speckleStream;
	//const speckleViewer = toolStore.speckleViewer
	console.log(speckleStream, "from viwer updated.......")

	let viewerVal;
	let maxRad = 4;
	let rad = 0.1;
	let opa = 1;
	let spheres = [];
	let v;
	let coor = [];
	let labelRenderer;

	

	onMount(() => {
		//console.log('viewer dynamic update' , speckleStreams[idUpdate]);
		v = new Viewer(viewerVal);
		//console.log(v);
		v.on(ViewerEvent.ObjectClicked, (args) => {
			if (args) {
				//console.log(args,"clicked");
				//this changed not sure why  args.userData.id
				const clieckedElement = args.hits[0].object;
				v.selectObjects([clieckedElement.id]);
				v.isolateObjects([clieckedElement.id]);
				//console.log($viewerDeptos,"deptoSelectedObject",clieckedElement )
				//filter viewerDeptos list to get the one with the same clickedElement id 
				
				const deptoSelected = get(viewerDeptos).filter((item) => item.id === clieckedElement.id);	
				let deptoSelectedObject = {
					element: [deptoSelected[0]],
					clickinfo: args.event,
				}
				currentViewerDepto.set(deptoSelectedObject);
				//changeElementColorByIds([clieckedElement.id], 0xff0000, true);
				// @ts-ignore
				//console.log(clieckedElement, 'clicked!', args.event);
			} else {
				v.resetSelection();
				// @ts-ignore
				currentViewerDepto.set({element:[], clickinfo: null});
				showModal.set(false);
				//currentDepto.set([]);
				//disponibilitySelected.set([]);
			}
			//console.log(v.needsRender);
		});
		// @ts-ignore
		// import the data tree store and save it in here
		//console.log("viewer store set",get(speckleViewer) )
		v.setLightConfiguration({
			azimuth: 0.55,
			castShadow: true,
			color: 16777215,
			elevation: 1.33,
			enabled: true,
			indirectLightIntensity: 1.2,
			intensity: 9,
			radius: 0
		});
		console.log('viewer here.....', _speckleStream);
		//let branch =  fetchStreamData(speckleStreams.NLW01);
		//let userD = fetchUserData();
		//console.log("user data");
		//Espacio Colaborativo
		const speckObj = reloadViewerGetObjectsByIds(v, _speckleStream, [], $speckleSchedule);
		//console.log("speckleObj",v.speckleRenderer._scene);
		//twoDCard(v);
	});

	function twoDCard(v) {
		const scene = v.speckleRenderer._scene;
		const earthDiv = document.createElement('div');

		earthDiv.className = 'label';
		earthDiv.textContent = 'Earttttttt9999999999999999999999999999ttth';
		earthDiv.style.backgroundColor = 'Black';
		earthDiv.style.color = 'white';
		earthDiv.style.padding = '5px';
		earthDiv.style.borderRadius = '5px';
		earthDiv.style.fontSize = '120px';
		earthDiv.style.fontFamily = 'sans-serif';
		earthDiv.style.fontWeight = 'bold';
		earthDiv.style.textAlign = 'center';
		earthDiv.style.width = '100px';
		earthDiv.style.height = '100px';
		earthDiv.style.border = '1px solid black';

		const earthLabel = new CSS2DObject(earthDiv);
		earthLabel.position.set(10, 1, 0);
		earthLabel.scale.set(50, 50, 50);
		earthLabel.layers.set(2);

		const sphere = ThreeSphere({ x: 0, y: 0, z: 0 });
		scene.add(earthLabel);
		console.log('sphere', sphere);
		sphere.position.set(0, 10, 1);
		//scene.add(sphere);

		console.log('scene data tree', viewerVal.parentNode);

		labelRenderer = new CSS2DRenderer(viewerVal.parentNode);
		labelRenderer.setSize(window.innerWidth, window.innerHeight);
		labelRenderer.domElement.style.position = 'absolute';
		labelRenderer.domElement.style.top = '0px';
		labelRenderer.domElement.style.pointerEvents = 'none';
		labelRenderer.domElement.style.zIndex = '1';
		viewerVal.parentNode.appendChild(labelRenderer.domElement);
		v.requestRender();
	}

	function ThreeSphere(position) {
		const sphere = new THREE.Mesh(
			new THREE.SphereGeometry(5.25),
			new THREE.MeshBasicMaterial({
				color: 0xc1e0db,
				opacity: 0.7,
				transparent: false
			})
		);
		sphere.position.set(position.x, position.y, position.z);
		sphere.layers.set(2);
		return sphere;
	}
	speckleStream.subscribe((speckleS) => {
		console.log('speckleStream........', speckleS);
		if (v && speckleS) {
			const speckObj = reloadViewerGetObjectsByIds(v, speckleS, [], $speckleSchedule);
		}
		
	});
</script>
<FloatingModal>	</FloatingModal>
<div bind:this={viewerVal} class="viewer" />

<style>
	.viewer {
		border-radius: 5px;
		opacity: 0.9;
		box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
		min-height: 100%;
		min-width: 100%;
	}
</style>
