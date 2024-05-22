import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import vertexShader from '../textures/shaders/vertex.glsl';
import fragmentShader from '../textures/shaders/fragment.glsl';
import { shaderMaterial } from '@react-three/drei';
import vertexShaderParse from '../textures/shaders/vertex_pars.glsl';
import vertexShaderMain from '../textures/shaders/vertex_main.glsl';
import fragmentMain from '../textures/shaders/fragment_main.glsl';
import fragmentPars from '../textures/shaders/fragment_pars.glsl';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';



			let group;
			const particlesData = [];
			let camera, scene, renderer, composer, light, light4, light2, light_helper,light3, light5;
			let positions, colors;
			let particles;
			let pointCloud;
			let particlePositions;
			let linesMesh;
			
      let controls;
      let lc = new THREE.Color("#ffffff");

			const maxParticleCount = 2000;
			let particleCount = 550;
			const r = 800;
			const rHalf = r / 2;
      let v3 = new THREE.Vector3();

			const effectController = {
				showDots: true,
				showLines: true,
				minDistance: 125,
				limitConnections: false,
				maxConnections: 20,
				particleCount: 500
			};


			
			
			
			//new THREE.MeshStandardMaterial({map: texture, 
			//onBeforeCompile: (shader) => {
					
			//	shadermaterial.userData.shader = shader;
			//	shader.uniforms.uTime = { value: 0.0 };
			//	const parseVertexString = /* glsl */`#include <displacementmap_pars_vertex>`
			///	shader.vertexShader = shader.vertexShader.replace(parseVertexString, 
				//	parseVertexString + vertexShaderParse
				
			//	);

			//	const mainVertexString = /* glsl */`#include <displacementmap_vertex>`
			//	shader.vertexShader = shader.vertexShader.replace(mainVertexString, mainVertexString + vertexShaderMain);
				
			//	const mainFragmentString = /* glsl */`#include <normal_fragment_maps>`
			//	const parsFragmentString = /* glsl */`#include <bumpmap_pars_fragment>`
			//	shader.fragmentShader = shader.fragmentShader.replace(parsFragmentString, parsFragmentString + fragmentPars);
			//	shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString, mainFragmentString + fragmentMain);
			
		//	}});
			
			
			init();
			animate();
			



			function init() {
				const textureLoader = new THREE.TextureLoader();
				
				const texture = textureLoader.load('../textures/download (3).jpg')
	
				texture.colorSpace = THREE.SRGBColorSpace
				texture.mapping = THREE.EquirectangularReflectionMapping;
		
				
				texture.flipY = false;
				
				
				
	
	
				const shadermaterial = new THREE.MeshStandardMaterial({map: texture});
				THREE.ColorManagement.enabled = true;

                //light = new THREE.PointLight(0xffffff,4.5, 1100,0);
				//light4 = new THREE.PointLight(0xffffff,4.5, 1100,0);
				//light2 = new THREE.PointLight(0xffffff,4.5, 1100,0);
				//light_helper = new THREE.PointLightHelper(light2, 5, 'red');
			//	light3 = new THREE.PointLight(0xffffff,4.5, 1100,0);
				light5 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9);

				

			
				
				
             //   light.position.set(-700, -700, 700);
			//	light2.position.set(-700, 700, -700);
			//	light3.position.set(700, 700, -700);
			//	light4.position.set(700, 700, 700);
			//	light5.position.set(0,700, 0)
				
				//light_helper.position.set(0, -700, 0);
				//light_ambient.position.set(0, -700, 0);
	
				
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 4000 );
				camera.position.z = 1750;
				camera.position.y = 250;
				camera.position.x = 0;
				
                
                
                

                
                
        

				//const axis_helper = new THREE.AxesHelper(1000);
					
				scene = new THREE.Scene();
                scene.add(camera);
				scene.add(light, light4, light2, light_helper, light3, light5);
				//scene.add(axis_helper);
				group = new THREE.Group();
				scene.add( group );


				// Create a texture
				
				scene.background = new THREE.Color('#121212');


				

				//shadermaterial = new THREE.ShaderMaterial({vertexShader, fragmentShader, uniforms: {spheretexture: {value: texture}, uTime: {value: 0.0}}});
				
				

		
				
                const helper = new THREE.Mesh(new THREE.IcosahedronGeometry(450, 6), shadermaterial);


                group.add(helper);


				const segments = maxParticleCount * maxParticleCount;

				positions = new Float32Array( segments * 3 );
				colors = new Float32Array( segments * 3 );

				const pMaterial = new THREE.PointsMaterial( {
					color: 0xffffff,
					size: 4,
					blending: THREE.AdditiveBlending,
					transparent: true,
					sizeAttenuation: false
				} );
                
				particles = new THREE.BufferGeometry();
				particlePositions = new Float32Array( maxParticleCount * 3 );
        

				for ( let i = 0; i < maxParticleCount; i ++ ) {

					let rand = Math.random();
                    let radius = Math.sqrt(rHalf * rHalf * rand);
                    v3.randomDirection().setLength(radius);

					particlePositions[ i * 3 ] = v3.x;
					particlePositions[ i * 3 + 1 ] = v3.y;
					particlePositions[ i * 3 + 2 ] = v3.z;

					// add it to the geometry
					particlesData.push( {
						velocity: new THREE.Vector3().randomDirection(),
						numConnections: 0
					} );

				}

				particles.setDrawRange( 0, particleCount );
				particles.setAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );

				// create the particle system
				pointCloud = new THREE.Points( particles, pMaterial );
				group.add( pointCloud );

				const geometry = new THREE.BufferGeometry();

				geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
				geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );

				geometry.computeBoundingSphere();

				geometry.setDrawRange( 0, 0 );

				const material = new THREE.LineBasicMaterial( {
					vertexColors: true,
					blending: THREE.AdditiveBlending,
					transparent: true
				} );

				linesMesh = new THREE.LineSegments( geometry, material );
				group.add( linesMesh );

				//
				const box = new THREE.Box3().setFromObject(group);
				const center = box.getCenter(new THREE.Vector3());

				group.position.x = (group.position.x - center.x);
				group.position.y = (group.position.y - center.y);
				group.position.z = (group.position.z - center.z);
				let contextPowerPreference = "default"; // default value

				var userAgent = navigator.userAgent || navigator.vendor || window.opera;

				if (/Mac/i.test(userAgent)) {
					contextPowerPreference = "high-performance";
				}
				
				if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
					contextPowerPreference = "high-performance";
				}

				renderer = new THREE.WebGLRenderer( { antialias: true, powerPreference: contextPowerPreference } );
				
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				function setupWebGLStateAndResources(){
					init();
				}
				
				
				
				


				
				var container = document.getElementById('canvas-container');
				var canvas = document.getElementById("canvas-container");

				canvas.addEventListener("webglcontextlost", function(event) {
						event.preventDefault();
					}, false);
				canvas.addEventListener(
						"webglcontextrestored", setupWebGLStateAndResources, false);
				container.style.position = 'fixed';
				container.style.top = '0';
				container.style.left = '0';
				container.style.width = '100vw';
				container.style.height = '100vh';
				if (window.location.pathname !== '/') {
					container.style.backgroundColor = '#121212';
					container.style.opacity = '.4';
				}
				console.log(window.getComputedStyle(container).opacity);


				
				document.body.appendChild( renderer.domElement );
				
				
                renderer.domElement.style.position = 'fixed';
                renderer.domElement.style.top = '0';
                renderer.domElement.style.left = '0';
                renderer.domElement.style.zIndex = '1';

                
        //
		
		//
        controls = new OrbitControls( camera, container );
				controls.minDistance = 800;
                controls.autoRotate = true;
                controls.enableDamping = true;
                controls.dampingFactor = 0.01;
				controls.maxDistance = 3000;
        
        controls.enableZoom = false;
        controls.enablePan = false;






		

				//




				window.addEventListener( 'resize', onWindowResize );
                document.addEventListener('mousemove', function(event) {
                    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                    const mouseY = -(event.clientY / window.innerHeight) * 2 +1.38 ;
                
                   // light.position.x = mouseX *500; // 500 is the scale factor
                    //light.position.y = mouseY * 500; // Adjust the scale factor as needed
                }, false);

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}


			function animate() {
				
        
        controls.update();

				let vertexpos = 0;
				let colorpos = 0;
				let numConnected = 0;

			//	if (shadermaterial.userData.shader) {
				//	shadermaterial.userData.shader.uniforms.uTime.value += 0.01;
				//}
				//shadermaterial.userData.shader.uniforms.uTime.value += 0.01;
			
				for ( let i = 0; i < particleCount; i ++ )
					particlesData[ i ].numConnections = 0;

				for ( let i = 0; i < particleCount; i ++ ) {

					// get the particle
					const particleData = particlesData[ i ];

					particlePositions[ i * 3 ] += particleData.velocity.x;
                    particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
                    particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

                    v3.fromArray(particlePositions, i * 3);
                    v3.normalize().multiplyScalar(500); // Project particle onto sphere surface

                    particlePositions[ i * 3 ] = v3.x;
                    particlePositions[ i * 3 + 1 ] = v3.y;
                    particlePositions[ i * 3 + 2 ] = v3.z;
          
          v3.fromArray(particlePositions, i * 3);
          let v3len = v3.length();
          v3.normalize().negate();
          if (v3len > rHalf) particleData.velocity.reflect(v3);

					if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
						continue;

					// Check collision
					for ( let j = i + 1; j < particleCount; j ++ ) {

						const particleDataB = particlesData[ j ];
						if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
							continue;

						const dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ];
						const dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
						const dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
						const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

						if ( dist < effectController.minDistance ) {

							particleData.numConnections ++;
							particleDataB.numConnections ++;

							const alpha = 1.0 - dist / effectController.minDistance;

							positions[ vertexpos ++ ] = particlePositions[ i * 3 ];
							positions[ vertexpos ++ ] = particlePositions[ i * 3 + 1 ];
							positions[ vertexpos ++ ] = particlePositions[ i * 3 + 2 ];

							positions[ vertexpos ++ ] = particlePositions[ j * 3 ];
							positions[ vertexpos ++ ] = particlePositions[ j * 3 + 1 ];
							positions[ vertexpos ++ ] = particlePositions[ j * 3 + 2 ];

							colors[ colorpos ++ ] = alpha * lc.r;
							colors[ colorpos ++ ] = alpha * lc.g;
							colors[ colorpos ++ ] = alpha * lc.b;

							colors[ colorpos ++ ] = alpha * lc.r;
							colors[ colorpos ++ ] = alpha * lc.g;
							colors[ colorpos ++ ] = alpha * lc.b;

							numConnected ++;

						}

					}

				}


				linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
				linesMesh.geometry.attributes.position.needsUpdate = true;
				linesMesh.geometry.attributes.color.needsUpdate = true;

				pointCloud.geometry.attributes.position.needsUpdate = true;

				requestAnimationFrame( animate );
				


				render();

			}

			function render() {

				const time = Date.now() * 0.0001;
				
				
				

				group.rotation.y = time * 0.001;
				renderer.render( scene, camera );

			}


