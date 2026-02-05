// -----------------------------
// Mobile Loading Screen
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("mobile-loading-screen");

  // Only show on mobile and if the element exists
  if (!loadingScreen) return;
  if (window.innerWidth > 700) {
    loadingScreen.style.display = "none"; // ensure hidden on desktop
    return;
  }

  // Make it visible immediately
  loadingScreen.style.display = "flex";

  // Wait 3s, then slide up + fade out
  setTimeout(() => {
    loadingScreen.style.transition = "transform 0.6s ease, opacity 0.6s ease";
    loadingScreen.style.transform = "translateY(-100%)";
    loadingScreen.style.opacity = "0";

    // Remove from DOM after animation finishes
    setTimeout(() => loadingScreen.remove(), 700);
  }, 3000);
});

// -----------------------------
// Panel / Sidebar Logic
// -----------------------------

const bar = document.getElementById('side-bar');
const panel = document.getElementById('side-panel');
const panelContent = panel?.querySelector('.panel-content');
const closeBtn = document.getElementById('close-panel');

function openPanel() {
  if (!panel) return;
  panel.classList.add('open');

  if (panelContent) panelContent.scrollTop = 0;
  panel.scrollTop = 0;
}

function closePanel() {
  if (!panel) return;
  panel.classList.remove('open');
}

bar?.addEventListener('click', (e) => {
  openPanel();
  e.stopPropagation();
});

closeBtn?.addEventListener('click', closePanel);

document.addEventListener('click', (e) => {
  if (panel && bar && !panel.contains(e.target) && !bar.contains(e.target)) {
    closePanel();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanel();
});


// -----------------------------
// Smooth Scroll Logic
// -----------------------------

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

window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }
});


// -----------------------------
// Hide Logo on Scroll (Desktop Only)
// -----------------------------

const logo = document.getElementById('logo-container');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  if (window.innerWidth <= 700) return;
  if (!logo) return;

  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScroll && currentScroll > 50) {
    logo.style.transition = 'transform 0.5s cubic-bezier(0.55, 0, 0.1, 1)';
    logo.style.transform = 'translateY(-200%)';
  } else {
    logo.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    logo.style.transform = 'translateY(0)';
  }

  lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});
