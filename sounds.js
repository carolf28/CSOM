import * as THREE from 'three';

let listener;
let stripe01Sound;

// ===============================
// INIT AUDIO
// ===============================
export function initSounds(camera) {
  listener = new THREE.AudioListener();
  camera.add(listener);

  stripe01Sound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(
    'sounds/sound1.wav', // make sure path is correct
    (buffer) => {
      stripe01Sound.setBuffer(buffer);
      stripe01Sound.setLoop(false);
      stripe01Sound.setVolume(0.8);
      console.log('✅ Sound loaded: stripe_01');
    },
    undefined,
    (err) => console.error('❌ Error loading sound:', err)
  );
}

// ===============================
// UNLOCK AUDIO CONTEXT (required by browsers)
// ===============================
export function unlockAudio() {
  if (!listener) return;

  const context = listener.context;
  if (context.state === 'suspended') {
    context.resume().then(() => console.log('🔓 AudioContext resumed'));
  }
}

// ===============================
// PLAY SOUND
// ===============================
export function playStripe01() {
  if (!stripe01Sound || !stripe01Sound.buffer) {
    console.warn('⚠️ Sound not ready');
    return;
  }

  // Resume AudioContext just in case
  unlockAudio();

  if (stripe01Sound.isPlaying) stripe01Sound.stop();
  stripe01Sound.play();
}
