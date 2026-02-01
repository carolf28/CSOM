import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const container = document.getElementById('logo-container-3d');
const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5); 

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.6; // brighter tone mapping
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// ---- LIGHTING BOOST ----
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.65); // brighter
directionalLight.position.set(4, 5, 6);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.75); // brighter
scene.add(ambientLight);
// -------------------------

new RGBELoader()
  .setPath('hdr/')
  .load('hdr/christmas_photo_studio_06_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    scene.environmentIntensity = 1.35; // brighter reflections
  });

const loader = new GLTFLoader();
let logo;

loader.load(
  './logo.glb',
  (gltf) => {
    logo = gltf.scene;
    scene.add(logo);

    logo.traverse((child) => {
      if (child.isMesh && child.material) {

        // add more brightness in reflections
        child.material.envMapIntensity = 2.0;

        if (child.material.roughness !== undefined) child.material.roughness = 0.22;
        if (child.material.metalness !== undefined) child.material.metalness = 0.45;

        child.material.needsUpdate = true;
      }
    });

    resizeLogo();
  },
  undefined,
  (error) => console.error('Error loading GLB:', error)
);

function resizeLogo() {
  if (!logo) return;

  const box = new THREE.Box3().setFromObject(logo);
  const size = new THREE.Vector3();
  box.getSize(size);

  let baseScale = 3.5;
  const containerWidth = container.clientWidth;
  const responsiveScale = containerWidth / 1400;
  let scale = baseScale * responsiveScale;
  scale = Math.min(scale, baseScale);

  logo.scale.set(scale, scale, scale);
  logo.position.set(0, 0, 0);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  resizeLogo();
});
