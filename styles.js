  const bar = document.getElementById('side-bar');
  const panel = document.getElementById('side-panel');
  const closeBtn = document.getElementById('close-panel');

  bar.addEventListener('click', () => {
    panel.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  // START BUTTON ANIMATION

  const startText = document.querySelector('.start-text');
let fadingIn = true;

function animateText() {
  if (fadingIn) {
    startText.style.opacity = 1;
  } else {
    startText.style.opacity = 0;
  }
  fadingIn = !fadingIn;
  setTimeout(animateText, 1000); // switch every 1 second
}

// Start animation
animateText();