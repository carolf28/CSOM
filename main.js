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

// 🔒 Vertical limits
controls.minPolarAngle = THREE.MathUtils.degToRad(10);  // prevents going above / seeing bottom
controls.maxPolarAngle = THREE.MathUtils.degToRad(70);  // allows looking down at the top


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
// VERY SOFT SHAPE LIGHT
// ===============================
const softDirectional = new THREE.DirectionalLight(0xffffff, 0.3);
softDirectional.position.set(2, 3, 4);
scene.add(softDirectional);

// ===============================
// LOAD & CENTER SYNTH
// ===============================
const loader = new GLTFLoader();
loader.load(
  'synthcsom.glb',
  (gltf) => {
    const synth = gltf.scene;

    synth.scale.set(0.45, 0.45, 0.45);

    const box = new THREE.Box3().setFromObject(synth);
    const center = box.getCenter(new THREE.Vector3());
    synth.position.sub(center);

    synth.rotation.y = THREE.MathUtils.degToRad(70);

    synth.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.0;
      }
    });

    scene.add(synth);
  },
  undefined,
  (error) => console.error('Error loading synth:', error)
);

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
  controls.update();
  renderer.render(scene, camera);
}
animate();
