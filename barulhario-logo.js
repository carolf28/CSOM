import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const container = document.getElementById('logo-container'); // same div as Oficina
if (!container) throw new Error("Logo container not found");

// ====================
// Scene, Camera, Renderer
// ====================
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
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

// ====================
// Lights
// ====================
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
directionalLight.position.set(4, 5, 6);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

// ====================
// HDR Environment
// ====================
new RGBELoader()
  .setPath('hdr/')
  .load('christmas_photo_studio_06_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 0.95;
  });

// ====================
// Load Barulhário logo
// ====================
const loader = new GLTFLoader();
let logo;

loader.load(
  './logometal.glb', // ← load the metal logo
  (gltf) => {
    logo = gltf.scene;

    // normalize size like Oficina
    const box = new THREE.Box3().setFromObject(logo);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.2 / maxDim; // same size as Oficina logo
    logo.scale.set(scale, scale, scale);

    const center = new THREE.Vector3();
    box.getCenter(center);
    logo.position.sub(center.multiplyScalar(scale));

    // material tuning
    logo.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.3;
        if (child.material.roughness !== undefined) child.material.roughness = 0.28;
        if (child.material.metalness !== undefined) child.material.metalness = 0.45;
        child.material.needsUpdate = true;
      }
    });

    scene.add(logo);
  },
  undefined,
  (error) => console.error('Error loading GLB:', error)
);

// ====================
// Mouse tilt
// ====================
let mouseX = 0;
let currentX = 0;
const tiltAmount = 0.35;
const ease = 0.05;

window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
});

// ====================
// Animate
// ====================
function animate() {
  requestAnimationFrame(animate);
  if (logo) {
    currentX += (mouseX - currentX) * ease;
    logo.rotation.y = currentX * tiltAmount;
  }
  renderer.render(scene, camera);
}

animate();

// ====================
// Handle resize
// ====================
window.addEventListener('resize', () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});
