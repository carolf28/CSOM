import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

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
controls.enableDamping = true;

// ===============================
// HDR ENVIRONMENT
// ===============================
new RGBELoader()
  .setPath('hdr/')
  .load('christmas_photo_studio_06_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 0.8; // tweak for brightness
  });

// ===============================
// LIGHTS
// ===============================

// Hemisphere Light (soft sky + ground fill)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.8);
scene.add(hemiLight);

// Directional Light — Main
const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight1.position.set(3, 4, 5); // angled from front/top
scene.add(dirLight1);

// Directional Light — Fill (so front is even)
const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight2.position.set(-3, 1, -2); // secondary filler light
scene.add(dirLight2);

// Optional rim light for subtle edge separation
const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
rimLight.position.set(0, 3, -4);
scene.add(rimLight);

// ===============================
// LOAD SYNTH MODEL
// ===============================
const loader = new GLTFLoader();
loader.load(
  'synthcsom.glb',
  (gltf) => {
    const synth = gltf.scene;
    synth.position.set(0, 0, 0);
    synth.scale.set(0.5, 0.5, 0.5);

    synth.traverse((child) => {
      if (child.isMesh && child.material) {
        // metallic reflections
        child.material.envMapIntensity = 1.5;
      }
    });

    scene.add(synth);
  },
  undefined,
  (error) => console.error('Error loading synth:', error)
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
  controls.update();
  renderer.render(scene, camera);
}
animate();
