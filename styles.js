const bar = document.getElementById('side-bar');
const panel = document.getElementById('side-panel');
const panelContent = panel.querySelector('.panel-content'); // scrollable container on mobile
const closeBtn = document.getElementById('close-panel');

// Open panel
function openPanel() {
  panel.classList.add('open');

  // Reset scroll
  if (panelContent) {
    panelContent.scrollTop = 0; // mobile scroll
  }
  panel.scrollTop = 0; // desktop scroll
}

// Close panel
function closePanel() {
  panel.classList.remove('open');
}

// Open panel when sidebar clicked
bar.addEventListener('click', (e) => {
  openPanel();
  e.stopPropagation(); 
});

// Close panel when X button clicked
closeBtn.addEventListener('click', closePanel);

// Close panel when clicking outside
document.addEventListener('click', (e) => {
  if (!panel.contains(e.target) && !bar.contains(e.target)) {
    closePanel();
  }
});

// Optional: close panel on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePanel();
  }
});
