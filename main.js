import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// Scene & camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // white background

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// --- ENVIRONMENT HDRI (this is what makes it look like blender) ---
new RGBELoader()
  .setPath('hdr/') // place your HDR in a folder called hdr/
  .load('studio_small_08_1k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;  // <-- THIS is the magic
    scene.environmentIntensity = 1.0;
  });

// Soft fill light (Blender-style)
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// Load your synth
const loader = new GLTFLoader();
loader.load(
  'synthcsom.glb',
  (gltf) => {
    const synth = gltf.scene;

    synth.position.set(0, 0, 0);
    synth.scale.set(0.5, 0.5, 0.5);

    // Make materials respond strongly to HDRI
    synth.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.5; // makes metals shiny
      }
    });

    scene.add(synth);
    console.log('Synth loaded!', synth);
  },
  undefined,
  (error) => {
    console.error('Error loading synth:', error);
  }
);

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
