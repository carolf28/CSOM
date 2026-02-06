import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { initSounds, playStripe, stopStripe, unlockAudio, listener } from './sounds.js';

function unlockAudioContext() {
  if (!listener) return;
  const ctx = listener.context;
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => console.log('🔓 AudioContext unlocked'));
  }
}

// Any user gesture
['pointerdown', 'touchstart', 'mousedown'].forEach(evt => {
  window.addEventListener(evt, unlockAudioContext, { once: true });
});

// resume AudioContext when returning to page
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && listener?.context?.state === 'suspended') {
    listener.context.resume().then(() => console.log('🔊 AudioContext resumed on visibilitychange'));
  }
});

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
const startScale = originalScale * 0.8; 

if (synth) {
  synth.scale.setScalar(startScale); 

  let introStart = performance.now();
  const introDuration = 1300; //  seconds

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
// ========== STRIPE SETUP WITH MOBILE-ONLY BIGGER HITBOX ==========
stripeNames.forEach((name) => {
  const stripe = synth.getObjectByName(name);

  if (!stripe) {
    console.warn(`Stripe not found: ${name}`);
    return;
  }

  stripe.userData.clickable = true;

  // ------------------------------------------------------------
  // 📱 Add invisible larger hitbox ONLY on small screens (<500px)
  // ------------------------------------------------------------
  if (window.innerWidth < 700) {
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.3, 1.3), // same size you had
      new THREE.MeshBasicMaterial({ visible: false })
    );
    stripe.add(hitBox);
    hitBox.userData.parentStripe = stripe;
  }
  // ------------------------------------------------------------

  // Save original emissive colors
  stripe.traverse((child) => {
    if (child.isMesh && child.material) {
      if (!child.material.emissive) {
        child.material.emissive = new THREE.Color(0x000000);
      }
      child.userData.originalEmissive = child.material.emissive.clone();
    }
  });

  // Press
  stripe.userData.onPress = () => {
    unlockAudio();
    playStripe(name);

    stripe.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive.setHex(0xffee88);
        child.material.emissiveIntensity = 0.5;
      }
    });
  };

  // Release
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



function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.position.x = 2;
  camera.position.y = 2;

  // NEW BREAKPOINT (under 350)
  if (width < 380) {
    camera.position.z = 9.5;   
    pivot.position.x = 0.05;
  }
  else if (width < 400) {
    camera.position.z = 9.35;
    pivot.position.x = 0.0;
  } 
  else if (width < 600) {
    camera.position.z = 8.2;
    pivot.position.x = 0.1;
  } 
  else if (width < 1000) {
    camera.position.z = 6.5;
    pivot.position.x = 0.0;
  } 
  else {
    camera.position.z = 5;
    pivot.position.x = 0;
  }

  camera.updateProjectionMatrix();
  camera.lookAt(pivot.position);
  renderer.setSize(width, height);
}

onResize();
window.addEventListener('resize', onResize);

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
// RAYCASTER – PRESS / RELEASE (MOBILE-FRIENDLY)
// ===============================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let pressedObject = null;

const canvas = renderer.domElement;
canvas.style.touchAction = 'none';
canvas.style.userSelect = 'none';


function findClickableParent(obj) {
  while (obj) {
    if (obj.userData.clickable) return obj;
    obj = obj.parent;
  }
  return null;
}

// Handle down events
function handlePointerDown(event) {
  event.preventDefault();
  event.stopPropagation();

  let clientX, clientY;
  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  
  const intersects = raycaster.intersectObjects(pivot.children, true);

  if (intersects.length > 0) {
    let obj = intersects[0].object;

    if (window.innerWidth < 800) { 
      for (const inter of intersects) {
        const clickableCandidate = findClickableParent(inter.object);
        if (clickableCandidate) {
          obj = clickableCandidate;
          break;
        }
      }
    }

    const clickable = findClickableParent(obj);
    if (clickable && clickable.userData.onPress) {
      pressedObject = clickable;
      clickable.userData.onPress();
    }
  }
}

// Handle up events
function handlePointerUp(event) {
  event.preventDefault();
  event.stopPropagation();

  if (pressedObject && pressedObject.userData.onRelease) {
    pressedObject.userData.onRelease();
  }
  pressedObject = null;
}

// Attach events
['pointerdown', 'touchstart', 'mousedown'].forEach(evt => {
  canvas.addEventListener(evt, handlePointerDown, { passive: false });
});
['pointerup', 'touchend', 'mouseup'].forEach(evt => {
  canvas.addEventListener(evt, handlePointerUp, { passive: false });
});
