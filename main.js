import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { initSounds, playStripe01, unlockAudio } from './sounds.js';

// ===============================
// Scene & Camera
// ===============================
const scene = new THREE.Scene();
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
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
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
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;
controls.minPolarAngle = THREE.MathUtils.degToRad(10);
controls.maxPolarAngle = THREE.MathUtils.degToRad(70);

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
const pivot = new THREE.Group();
scene.add(pivot);

let synth = null;

loader.load(
  'synthcsom.glb',
  (gltf) => {
    synth = gltf.scene;
    synth.scale.set(0.50, 0.50, 0.50);

    const box = new THREE.Box3().setFromObject(synth);
    const center = box.getCenter(new THREE.Vector3());
    synth.position.sub(center);

    synth.rotation.y = THREE.MathUtils.degToRad(70);

    synth.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.0;
      }
    });

    pivot.add(synth);
    pivot.rotation.x = THREE.MathUtils.degToRad(0);

    // ===============================
    // LOG OBJECT TREE FOR DEBUG
    // ===============================
    console.log('--- GLTF Object Tree ---');
    function logNode(node, depth = 0) {
      console.log('  '.repeat(depth) + node.name || '(no name)');
      node.children.forEach((child) => logNode(child, depth + 1));
    }
    logNode(synth);

    // ===============================
    // STRIPE_01 WITH GLOW
    // ===============================
const stripe01 = synth.getObjectByName('Stripe_01');// replace with exact name from log
    if (stripe01) {
      stripe01.traverse((child) => {
        if (child.isMesh && child.material) {
          child.userData.clickable = true;

          // Ensure emissive property exists
          if (!child.material.emissive) child.material.emissive = new THREE.Color(0x000000);

          child.userData.originalEmissive = child.material.emissive.clone();

          child.onClick = () => {
            console.log('Stripe clicked!'); // debug
            unlockAudio();
            playStripe01();

            // Glow effect
            child.material.emissive.setHex(0xffff00);
            setTimeout(() => {
              child.material.emissive.copy(child.userData.originalEmissive);
            }, 300);
          };
        }
      });
    } else {
      console.warn('error');
    }
  },
  undefined,
  (error) => console.error('Error loading synth:', error)
);

// ===============================
// INIT SOUNDS
// ===============================
initSounds(camera);

// ===============================
// SLOW TILT ANIMATION
// ===============================
let tiltDirection = 1;
let tiltAnimationActive = true;
const tiltSpeed = 0.0009;

function updateTiltAnimation() {
  if (!tiltAnimationActive) return;

  const maxTilt = THREE.MathUtils.degToRad(9);
  const minTilt = THREE.MathUtils.degToRad(-0.005);

  pivot.rotation.x += tiltSpeed * tiltDirection;

  if (pivot.rotation.x > maxTilt || pivot.rotation.x < minTilt) tiltDirection *= -1;
}

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

// ===============================
// RAYCASTER FOR CLICKING
// ===============================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(pivot.children, true);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (obj.userData.clickable && obj.onClick) obj.onClick();
  }
}

window.addEventListener('pointerdown', onClick);
