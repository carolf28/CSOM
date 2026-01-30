const bar = document.getElementById('side-bar');
const panel = document.getElementById('side-panel');
const closeBtn = document.getElementById('close-panel');

// Open panel when sidebar clicked
bar.addEventListener('click', (e) => {
  panel.classList.add('open');
  e.stopPropagation(); 
});

// Close panel when X button clicked
closeBtn.addEventListener('click', () => {
  panel.classList.remove('open');
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
  
  if (!panel.contains(e.target) && !bar.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// Optional: close panel on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    panel.classList.remove('open');
  }
});

  // START BUTTON 
const startText = document.querySelector('.start-text');

if (startText) { 
  let fadingIn = true;

  function animateText() {
    startText.style.opacity = fadingIn ? 1 : 0;
    fadingIn = !fadingIn;
    setTimeout(animateText, 1000);
  }

  animateText();
}

