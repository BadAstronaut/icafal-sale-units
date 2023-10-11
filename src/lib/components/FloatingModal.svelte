<script>
	//import on mount
	import * as THREE from 'three';
	import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { gsap, Power1 } from 'gsap';
	import {
		speckleViewer,
		finishLoading,
		currentDepto,
		currentViewerDepto
	} from '../../stores/toolStore';
	import InfoModal from './InfoModal.svelte';
	let canvas;
	let executingCommand;
	let showModal = true;
	let renderLabel;
	let v;
	let cardLabel;
	//implement onmount
	onMount(
		() => {
			const scene = v.filteringManager.Renderer._scene;
			const renderer = v.filteringManager.Renderer.renderer;
			const camera = v.filteringManager.Renderer.camera;
			v = get(speckleViewer).speckleViewer;
		}
		//console.log(v);
		//console.log(v);
		//console.log("showing sensor animation",get(activeIoTIndicators));
	);
	currentDepto.subscribe((v) => {
		if (v) {
			//console.log(v);
			v = get(speckleViewer).speckleViewer;
			console.log('showing sensor animation', v);
			const scene = v.filteringManager.Renderer._scene;
			const renderer = v.filteringManager.Renderer.renderer;
			const camera = v.filteringManager.Renderer.camera;
			console.log('getting the scene to add animation', renderer);
			cardLabel = threeLabelCardCreate(scene, renderer, {}, camera);
			animateFloatingCard(cardLabel, scene, camera);
			console.log('viewer dynamic update', cardLabel);
			//right now if we add animations
			//
		}
	});
	//need to create a gsap animation of the twoDcard to make it look like its floating
	function animateFloatingCard(labelObject) {
		console.log(labelObject.infoLabel.position, 'label.................');
		const v = get(speckleViewer).speckleViewer;
		const scene = v.filteringManager.Renderer.scene;
		const renderer = v.filteringManager.Renderer.renderer;
		const camera = v.filteringManager.Renderer.camera; 
		camera.layers.enable(2);
		if (labelObject.infoLabel.position) {
			gsap.to(labelObject.infoLabel.position, {
				duration: 3,
				x: 3.5,
				repeat: -1,
				yoyo: true,
				ease: 'power1.inOut',
				onUpdate: () => {
					console.log(labelObject.infoLabel, 'label.................');
					//labelObject.infoLabel.position.y = position.y;
					v.requestRender();
					labelObject.renderLabel.render(scene, camera);

				}
			});
		}
	}
	function threeLabelCardCreate(scene, renderer, labelContent, camera) {
		const v = get(speckleViewer).speckleViewer;
		labelContent = {
			title: 'Earth',
			icon: 'https://threejs.org/examples/textures/uv_grid_opengl.jpg',
			description:
				'Earth is the third planet from the Sun and the only astronomical object known to harbor life.'
		};
		const earthDiv = document.createElement('div');
		earthDiv.className = 'label';
		earthDiv.innerHTML = `
		                    <div class="card" style="width: 10em; height:auto; border-radius: 0.4em; background-color: rgba(255, 255, 255, 0.5); box-shadow: 0  2px 5px rgba(144, 144, 144, 0.2); padding:0.3em; z-index:100">
		                        <div class="flex-container" style ="display:flex; flex-direction:row; align-items:center; gap:0.5em; ">
		                            <img src="${labelContent.icon}" alt="Icon" style="width: 1em; height: 1em;">
		                            <h2 style="font-size: 0.8em; margin-bottom: 0.5em;">${labelContent.title}</h2>
		                        </div>
		                        <p style="font-size: 0.6em;">${labelContent.description}</p>
		                    </div>
		                    `;

		camera.layers.enable(2);
		const infoLabel = new CSS2DObject(earthDiv);
		infoLabel.position.set(0, 0, 0);
		//infoLabel.center.set(0, 0);
		infoLabel.layers.set(2);
		scene.add(infoLabel);
		//scene.add(cPointLabel);
		console.log('scene data tree------------C---c----', infoLabel, scene);
		const parentContainer = v.container;
		console.log('scene data tree-----dd--di----', parentContainer);
		renderLabel = new CSS2DRenderer(parentContainer);
		renderLabel.setSize(parentContainer.clientWidth, parentContainer.clientHeight);

		//this line is to avoid clicking the text
		renderLabel.domElement.style.pointerEvents = 'none';
		renderLabel.domElement.style.position = 'absolute';
		renderLabel.domElement.style.top = '0px';
		//renderLabel.render(scene, camera);
		console.log('scene data tree', renderLabel);
		//append labelRenderer to the parent container
		parentContainer.appendChild(renderLabel.domElement);

		const cardLabelObject = {
			infoLabel: infoLabel,
			renderLabel: renderLabel
		};
		renderLabel.render(scene, camera);
		v.update();
		return cardLabelObject;
	}
	///////////// Model Loader //////////////
</script>

<canvas class="three-container" bind:this={canvas} />
{#if showModal}
	<!-- <InfoModal
        bind:showModal
        onClose={() => (showModal = false)}
        {executingCommand}
    /> -->
{/if}

<style>
	.three-container {
		width: 100%;
		height: 140em;
		z-index: 10000;
	}
</style>
