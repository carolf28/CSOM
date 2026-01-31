import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// ====================
// Container & Scene
// ====================
const container = document.getElementById('logo-container-3d');
const scene = new THREE.Scene();
scene.background = null; // fully transparent

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

// We'll position the camera farther back to avoid clipping
camera.position.set(0, 0, 6);

// ====================
// Renderer
// ====================
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0); // fully transparent
container.appendChild(renderer.domElement);

// ====================
// Lighting (same as top logo)
// ====================
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
directionalLight.position.set(4, 5, 6);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

new RGBELoader()
  .setPath('hdr/')
  .load('christmas_photo_studio_06_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 0.95;
  });

// ====================
// Load GLB logo
// ====================
const loader = new GLTFLoader();
loader.load(
  './logo.glb',
  (gltf) => {
    const logo = gltf.scene;

    // Remove any possible background objects (white planes/cubes)
    logo.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.3;
        if (child.material.roughness !== undefined) child.material.roughness = 0.28;
        if (child.material.metalness !== undefined) child.material.metalness = 0.45;
        child.material.transparent = true;
        child.material.needsUpdate = true;
      }
      // Remove any unintended background meshes
      if (child.isMesh && child.name.toLowerCase().includes('background')) {
        child.visible = false;
      }
    });

    // Normalize and double size
    const box = new THREE.Box3().setFromObject(logo);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    const scale = 4.4 / maxDim; // double the previous scale
    logo.scale.set(scale, scale, scale);

    // Center the logo
    const center = new THREE.Vector3();
    box.getCenter(center);
    logo.position.sub(center.multiplyScalar(scale));

    scene.add(logo);

    renderer.render(scene, camera);
  },
  undefined,
  (error) => console.error('Error loading GLB:', error)
);

// ====================
// Animate / Render
// ====================
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// ====================
// Resize handling
// ====================
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
