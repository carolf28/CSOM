import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// ===============================
// Scene & Camera
// ===============================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 5);

// ===============================
// Renderer
// ===============================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// ===============================
// Controls
// ===============================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

// Free horizontal rotation
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;

// Vertical rotation limits
controls.minPolarAngle = THREE.MathUtils.degToRad(10);  // cannot look above
controls.maxPolarAngle = THREE.MathUtils.degToRad(70);  // can look down

// ===============================
// HDR ENVIRONMENT
// ===============================
new RGBELoader()
  .setPath('hdr/')
  .load('christmas_photo_studio_06_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 1.0;
  });

// ===============================
// VERY SOFT LIGHT
// ===============================
const softDirectional = new THREE.DirectionalLight(0xffffff, 0.3);
softDirectional.position.set(2, 3, 4);
scene.add(softDirectional);

// ===============================
// LOAD & CENTER SYNTH WITH PIVOT
// ===============================
const loader = new GLTFLoader();
let pivot = new THREE.Group(); // pivot group for tilt animation
scene.add(pivot);

loader.load(
  'synthcsom.glb',
  (gltf) => {
    const synth = gltf.scene;

    // Scale
    synth.scale.set(0.45, 0.45, 0.45);

    // Auto-center model
    const box = new THREE.Box3().setFromObject(synth);
    const center = box.getCenter(new THREE.Vector3());
    synth.position.sub(center);

    // Default horizontal rotation
    synth.rotation.y = THREE.MathUtils.degToRad(70);

    // Enhance copper shine
    synth.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.0;
      }
    });

    pivot.add(synth); // add synth to pivot for tilt animation
    pivot.rotation.x = THREE.MathUtils.degToRad(0); // default tilt
  },
  undefined,
  (error) => console.error('Error loading synth:', error)
);

// ===============================
// SLOWER INITIAL TILT ANIMATION
// ===============================
let tiltDirection = 1;
let tiltAnimationActive = true;
const tiltSpeed = 0.0007; // slower than before

function updateTiltAnimation() {
  if (!tiltAnimationActive || !pivot) return;

  const maxTilt = THREE.MathUtils.degToRad(5);
  const minTilt = THREE.MathUtils.degToRad(-5);

  pivot.rotation.x += tiltSpeed * tiltDirection;

  if (pivot.rotation.x > maxTilt || pivot.rotation.x < minTilt) {
    tiltDirection *= -1;
  }
}

// Stop tilt animation when user interacts
controls.addEventListener('start', () => {
  tiltAnimationActive = false;
});

// ===============================
// Resize
// ===============================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===============================
// Animate
// ===============================
function animate() {
  requestAnimationFrame(animate);
  updateTiltAnimation();
  controls.update();
  renderer.render(scene, camera);
}

animate();
