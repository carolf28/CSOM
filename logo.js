import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// 1️⃣ Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = null; // true transparency

const container = document.getElementById('logo-container');

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5); 

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0); // fully transparent
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// 2️⃣ Lighting (match synth scene)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3); // soft
directionalLight.position.set(2, 3, 4);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 3️⃣ Optional HDR environment (if you have HDR file)
// Comment this out if you don't have an HDR
new RGBELoader()
  .setPath('hdr/') 
  .load('christmas_photo_studio_06_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 1.0;
  });

// 4️⃣ Load GLB logo
const loader = new GLTFLoader();
let logo;

loader.load(
  './logo.glb', // keep path as is
  function (gltf) {
    logo = gltf.scene;

    // Keep your current scale (no changes)
    const box = new THREE.Box3().setFromObject(logo);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    const scale = 2.5 / maxDim; // keep your current scale
    logo.scale.set(scale, scale, scale);

    // Center (keep position)
    const center = new THREE.Vector3();
    box.getCenter(center);
    logo.position.sub(center.multiplyScalar(scale));

    // Make materials reflect environment
    logo.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.0;
        child.material.needsUpdate = true;
      }
    });

    scene.add(logo);
  },
  undefined,
  function (error) {
    console.error('Error loading GLB:', error);
  }
);

// 5️⃣ Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});

// 6️⃣ Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (logo) logo.rotation.y += 0.005; // keep rotation

  renderer.render(scene, camera);
}

animate();
