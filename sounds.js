import * as THREE from 'three';

let listener;
const stripeSounds = {};

// ===============================
// AUDIO INIT
// ===============================
export function initSounds(camera) {
  listener = new THREE.AudioListener();
  camera.add(listener);

  const audioLoader = new THREE.AudioLoader();

  for (let i = 1; i <= 22; i++) {
    const sound = new THREE.Audio(listener);
    const path = `csounds/csom${i}.wav`;

    audioLoader.load(
      path,
      (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);   // 🔁 loop while pressed
        sound.setVolume(0.8);
        stripeSounds[`Stripe_${String(i).padStart(2, '0')}`] = sound;
        console.log(`✅ Loaded: ${path}`);
      },
      undefined,
      (err) => console.error(`❌ Error loading ${path}`, err)
    );
  }
}

// ===============================
// UNLOCK AUDIO CONTEXT
// ===============================
export function unlockAudio() {
  if (!listener) return;

  const context = listener.context;
  if (context.state === 'suspended') {
    context.resume().then(() => console.log('🔓 AudioContext resumed'));
  }
}

// ===============================
// PLAY STRIPE SOUND (on press)
// ===============================
export function playStripe(name) {
  const sound = stripeSounds[name];

  if (!sound || !sound.buffer) {
    console.warn(`⚠️ Sound not ready for ${name}`);
    return;
  }

  unlockAudio();

  // Only start if it's not already playing
  if (!sound.isPlaying) {
    sound.play();
  }
}

// ===============================
// STOP STRIPE SOUND (on release)
// ===============================
export function stopStripe(name) {
  const sound = stripeSounds[name];

  if (!sound) return;

  if (sound.isPlaying) {
    sound.stop();
  }
}
