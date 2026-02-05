// -----------------------------
// Panel / Sidebar Logic
// -----------------------------

const bar = document.getElementById('side-bar');
const panel = document.getElementById('side-panel');
const panelContent = panel?.querySelector('.panel-content'); // optional chaining in case panel doesn't exist
const closeBtn = document.getElementById('close-panel');

function openPanel() {
  if (!panel) return;
  panel.classList.add('open');

  // Reset scroll
  if (panelContent) panelContent.scrollTop = 0;
  panel.scrollTop = 0;
}

function closePanel() {
  if (!panel) return;
  panel.classList.remove('open');
}

// Open panel when sidebar clicked
bar?.addEventListener('click', (e) => {
  openPanel();
  e.stopPropagation();
});

// Close panel when X button clicked
closeBtn?.addEventListener('click', closePanel);

// Close panel when clicking outside
document.addEventListener('click', (e) => {
  if (panel && bar && !panel.contains(e.target) && !bar.contains(e.target)) {
    closePanel();
  }
});

// Optional: close panel on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanel();
});

// -----------------------------
// Smooth Scroll Logic
// -----------------------------

// Same-page smooth scroll for links inside the panel
if (panel) {
  panel.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        closePanel();
      }
    });
  });
}

// Smooth scroll when coming from another page
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      // small delay to allow layout to render properly
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }
});



const logo = document.getElementById('logo-container');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  // Only run on desktop (width > 900px)
  if (window.innerWidth <= 700) return;
  if (!logo) return;

  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScroll && currentScroll > 50) {
    // Scrolling down — slide logo up
    logo.style.transition = 'transform 0.5s cubic-bezier(0.55, 0, 0.1, 1)';
    logo.style.transform = 'translateY(-200%)';
  } else {
    // Scrolling up — slide logo down with playful bounce
    logo.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    logo.style.transform = 'translateY(0)';
  }

  lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});
