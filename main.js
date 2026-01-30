import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { initSounds, playStripe, stopStripe, unlockAudio } from './sounds.js';

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

const stripeNames = [
  'Stripe_01','Stripe_02','Stripe_03','Stripe_04','Stripe_05','Stripe_06',
  'Stripe_07','Stripe_08','Stripe_09','Stripe_10','Stripe_11','Stripe_12',
  'Stripe_13','Stripe_14','Stripe_15','Stripe_16','Stripe_17','Stripe_18',
  'Stripe_19','Stripe_20','Stripe_21','Stripe_22'
];

loader.load(
  'synthcsom.glb',
  (gltf) => {
    synth = gltf.scene;
    synth.scale.set(0.50, 0.50, 0.50); // keep EXACT original scale

    // center model
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

    // ------------------------------------------------------------
    // INTRO ANIMATION (KEEPING ORIGINAL SCALE & POSITION)
    // ------------------------------------------------------------
// Original synth scale
const originalScale = 0.5; 
const startScale = originalScale * 0.8; // 80% of original

if (synth) {
  synth.scale.setScalar(startScale); // start slightly smaller

  let introStart = performance.now();
  const introDuration = 1300; // 2.5 seconds

  function introAnim() {
    let elapsed = (performance.now() - introStart) / introDuration;
    let t = Math.min(elapsed, 1);

    // cubic ease-out for smooth scaling
    let ease = 1 - Math.pow(1 - t, 3);

    // Scale smoothly to original scale
    synth.scale.setScalar(startScale + ease * (originalScale - startScale));

    if (t < 1) requestAnimationFrame(introAnim);
  }

  introAnim();
}
    // ------------------------------------------------------------

    // ========== STRIPE SETUP ==========
    stripeNames.forEach((name) => {
      const stripe = synth.getObjectByName(name);

      if (!stripe) {
        console.warn(`Stripe not found: ${name}`);
        return;
      }

      stripe.userData.clickable = true;

      stripe.traverse((child) => {
        if (child.isMesh && child.material) {
          if (!child.material.emissive) {
            child.material.emissive = new THREE.Color(0x000000);
          }
          child.userData.originalEmissive = child.material.emissive.clone();
        }
      });

      stripe.userData.onPress = () => {
        unlockAudio();
        playStripe(name);

        stripe.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.emissive.setHex(0xffff00);
          }
        });
      };

      stripe.userData.onRelease = () => {
        stopStripe(name);

        stripe.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.emissive.copy(child.userData.originalEmissive);
          }
        });
      };
    });
  },
  undefined,
  (error) => console.error('Error loading synth:', error)
);

// ===============================
// INIT SOUNDS
// ===============================
initSounds(camera);

// ===============================
// SUBTLE SLOW TILT ANIMATION
// ===============================
let tiltDirection = 1;
let tiltAnimationActive = true;

const maxTilt = THREE.MathUtils.degToRad(5);
const minTilt = THREE.MathUtils.degToRad(-0.002);
const tiltSpeed = 0.0005;

function updateTiltAnimation() {
  if (!tiltAnimationActive) return;

  pivot.rotation.x += tiltSpeed * tiltDirection;

  if (pivot.rotation.x > maxTilt || pivot.rotation.x < minTilt) {
    tiltDirection *= -1;
  }
}

// ===============================
// STOP TILT ONLY ON DRAG
// ===============================
let isDragging = false;

controls.addEventListener('start', () => {
  isDragging = false;
});

controls.addEventListener('change', () => {
  isDragging = true;
});

controls.addEventListener('end', () => {
  if (isDragging) tiltAnimationActive = false;
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
// RAYCASTER – PRESS / RELEASE (FIXED)
// ===============================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let pressedObject = null;

function findClickableParent(obj) {
  while (obj) {
    if (obj.userData.clickable) return obj;
    obj = obj.parent;
  }
  return null;
}

function onPointerDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(pivot.children, true);

  if (intersects.length > 0) {
    let obj = intersects[0].object;

    const clickable = findClickableParent(obj);

    if (clickable && clickable.userData.onPress) {
      pressedObject = clickable;
      clickable.userData.onPress();
    }
  }
}

function onPointerUp() {
  if (pressedObject && pressedObject.userData.onRelease) {
    pressedObject.userData.onRelease();
  }
  pressedObject = null;
}

window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointerup', onPointerUp);
