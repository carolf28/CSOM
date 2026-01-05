  const bar = document.getElementById('side-bar');
  const panel = document.getElementById('side-panel');
  const closeBtn = document.getElementById('close-panel');

  bar.addEventListener('click', () => {
    panel.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  // START BUTTON 
const startText = document.querySelector('.start-text');

if (startText) { // only run if element exists
  let fadingIn = true;

  function animateText() {
    startText.style.opacity = fadingIn ? 1 : 0;
    fadingIn = !fadingIn;
    setTimeout(animateText, 1000);
  }

  animateText();
}
