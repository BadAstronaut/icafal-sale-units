<script>
	//import on mount
	import * as THREE from 'three';
	import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
	import { onMount } from 'svelte';
	import 'iconify-icon';
	import { get } from 'svelte/store';
	import { gsap, Power1 } from 'gsap';
	import {
		speckleViewer,
		finishLoading,
		currentDepto,
		currentViewerDepto,
		showModal
	} from '../../stores/toolStore';
	import InfoModal from './InfoModal.svelte';
	let canvas;
	let executingCommand;
	let _showModal = true;
	let renderLabel;
	let v;
	let cardLabel;
	//implement onmount
	currentViewerDepto.subscribe((depto) => {
		v = get(speckleViewer).speckleViewer;
		console.log('viewer dynamic update', depto);
		if (v) {
			if (depto && depto.clickinfo) {
				//console.log(v, 'ready for rendering');
				//console.log('showing sensor animation', v);
				const scene = v.filteringManager.Renderer._scene;
				const renderer = v.filteringManager.Renderer.renderer;
				const camera = v.filteringManager.Renderer.camera;
				//console.log('getting the scene to add animation', renderer);
				cardLabel = threeLabelCardCreate(depto, scene, renderer, {}, camera);
				animateFloatingCard(cardLabel, scene, camera);
				//console.log('viewer dynamic update', cardLabel);
				//right now if we add animations
				//
			} else {
				removeCurrentLabels(v.filteringManager.Renderer._scene, cardLabel);
				//console.log('viewer dynamic update', v);
			}
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
			// gsap.to(labelObject.infoLabel.position, {
			// 	duration: 3,
			// 	x: 3.5,
			// 	repeat: -1,
			// 	yoyo: true,
			// 	ease: 'power1.inOut',
			// 	onUpdate: () => {
			// 		console.log(labelObject.infoLabel, 'label.................');
			// 		//labelObject.infoLabel.position.y = position.y;
			// 	}
			// });
			//v.requestRender();
			//requestAnimationFrame(animateFloatingCard);
			//labelObject.renderLabel.render(scene, camera);
		}
	}
	function threeLabelCardCreate(element, scene, renderer, labelContent, camera) {
		const v = get(speckleViewer).speckleViewer;
		const elementInfo = element.element[0];
		labelContent = {
			title: `Departamento: ${elementInfo.numero}`,
			number: elementInfo.numero,
			tipologia: elementInfo.tipologia,
			area: elementInfo.area,
			orientacion: elementInfo.orientacion,
			precio: '4940'
		};
		const twoDCard = document.createElement('div');
		twoDCard.className = 'label';
		twoDCard.innerHTML = `
		                    <div class="card" style="width: 10em; height:auto; border-radius: 0.4em; background-color: rgba(255, 255, 255, 0.5); box-shadow: 0  2px 5px rgba(144, 144, 144, 0.2); padding:0.3em; z-index:100">
		                        <div class="flex-container" style ="display:flex; flex-direction:row; align-items:flex-start; gap:0.5em; justify-content:flex-start;">
		                            <iconify-icon icon="mdi:home"></iconify-icon>
		                            <h2 style="font-size: 0.8em; margin-bottom: 0.5em;">${labelContent.title}</h2>
		                        </div>
								<div class="flex-container" style ="display:flex; flex-direction:column; justify-content:flex-start; align-items:flex-start; gap:0.1em; width:100%">
									<div class="flex-container" style ="display:flex; flex-direction:row; justify-content:flex-start; align-items:flex-start; gap:0.5em; border: 1px solid lightgray;border-radius: 4px;padding: 1px; margin:0px;  width:100%  ">
										<iconify-icon icon="fluent-mdl2:radio-bullet"></iconify-icon>
										<p style="font-size: 0.6em; margin-bottom: 0.2em;">Tipo Departamento: ${labelContent.tipologia}</p>
									</div>
									<div class="flex-container" style ="display:flex; flex-direction:row; justify-content:flex-start; align-items:flex-start; gap:0.5em; border: 1px solid lightgray;border-radius: 4px;padding: 1px; margin:0px;  width:100%  ">
										<iconify-icon icon="fluent-mdl2:radio-bullet"></iconify-icon>
										<p style="font-size: 0.6em; margin-bottom: 0.2em;">Area: ${labelContent.area} m2</p>
									</div>
									<div class="flex-container" style ="display:flex; flex-direction:row; justify-content:flex-start; align-items:flex-start; gap:0.5em; border: 1px solid lightgray;border-radius: 4px;padding: 1px; margin:0px; width:100%  ">
										<iconify-icon icon="fluent-mdl2:radio-bullet"></iconify-icon>
										<p style="font-size: 0.6em; margin-bottom: 0.2em;">Orientación: ${labelContent.orientacion}</p>
									</div>
									<div class="flex-container" style ="display:flex; flex-direction:row; justify-content:flex-start; align-items:flex-start; gap:0.5em; border: 1px solid lightgray;border-radius: 4px;padding: 1px; margin:0px; width:100% ">
										<iconify-icon icon="fluent-mdl2:radio-bullet"></iconify-icon>
										<p style="font-size: 0.6em; margin-bottom: 0.1em;">Precio: ${labelContent.precio} UF</p>
									</div>
								</div>
		                    </div>
		                    `;

		camera.layers.enable(2);
		const infoLabel = new CSS2DObject(twoDCard);
		infoLabel.position.set(element.clickinfo.clientX, element.clickinfo.clientY+75, 0);
		infoLabel.layers.set(2);
		scene.add(infoLabel);
		const parentContainer = v.container;
		renderLabel = new CSS2DRenderer(parentContainer);
		renderLabel.setSize(parentContainer.clientWidth, parentContainer.clientHeight);

		//this line is to avoid clicking the text
		renderLabel.domElement.style.pointerEvents = 'none';
		renderLabel.domElement.style.position = 'absolute';
		renderLabel.domElement.style.top = '0px';
		parentContainer.appendChild(renderLabel.domElement);

		const cardLabelObject = {
			infoLabel: infoLabel,
			renderLabel: renderLabel
		};
		renderLabel.render(scene, camera);
		// Initial GSAP intro animation for the label
		gsap.from(twoDCard, {
			autoAlpha: 0,
			y: '+=150',
			duration: 0.5,
			ease: 'power2.out'
		});
		return cardLabelObject;
	}

	function removeCurrentLabels(scene) {
		const parentContainer = v.container;
		if (cardLabel.infoLabel) {
			scene.remove(cardLabel.infoLabel);
			parentContainer.removeChild(cardLabel.renderLabel.domElement);
			cardLabel = {
				infoLabel: null,
				renderLabel: null
			};
		}
	}
	//console.log('modal on off', $showModal);
	///////////// Model Loader //////////////
</script>

<canvas class="three-container" bind:this={canvas} />
{#if _showModal}
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
