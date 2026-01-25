import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// ====================
// Scene, Camera, Renderer
// ====================
const scene = new THREE.Scene();
scene.background = null;

const container = document.getElementById('logo-container');

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // improve quality
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5; // brighter overall
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// ====================
// Lighting (brighter synth-style)
// ====================
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // brighter
directionalLight.position.set(2, 3, 4);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // brighter fill
scene.add(ambientLight);

// Optional HDR environment
new RGBELoader()
  .setPath('hdr/')
  .load('christmas_photo_studio_06_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 1.2; // more reflective
  });

// ====================
// Load GLB logo
// ====================
const loader = new GLTFLoader();
let logo;

loader.load(
  './logo.glb',
  (gltf) => {
    logo = gltf.scene;

    const box = new THREE.Box3().setFromObject(logo);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    const scale = 2.5 / maxDim;
    logo.scale.set(scale, scale, scale);

    const center = new THREE.Vector3();
    box.getCenter(center);
    logo.position.sub(center.multiplyScalar(scale));

    logo.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.2; // reflect HDR more
        child.material.needsUpdate = true;
        if (child.material.roughness !== undefined) child.material.roughness = 0.3;
        if (child.material.metalness !== undefined) child.material.metalness = 0.3;
      }
    });

    scene.add(logo);
  },
  undefined,
  (error) => console.error('Error loading GLB:', error)
);

// ====================
// Mouse Tilt (horizontal only)
// ====================
let mouseX = 0;

window.addEventListener('mousemove', (event) => {
  // normalize (-1 → 1)
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
});

// ====================
// Animate loop with smooth horizontal tilt only
// ====================
let currentX = 0;
const tiltAmount = 0.35; // stronger horizontal tilt (~20°)
const ease = 0.05;       // smoothness factor

function animate() {
  requestAnimationFrame(animate);

  if (logo) {
    // Smoothly interpolate tilt horizontally
    currentX += (mouseX - currentX) * ease;
    logo.rotation.y = currentX * tiltAmount; // horizontal tilt
  }

  renderer.render(scene, camera);
}

animate();

// ====================
// Handle Resize
// ====================
window.addEventListener('resize', () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});
