// =========================
// CUSTOM CAROUSEL
// =========================

const track = document.querySelector(".carousel-track");
const items = Array.from(track.children);
const prevBtn = document.querySelector(".arrow.left");
const nextBtn = document.querySelector(".arrow.right");

const visibleCount = 3; // number of visible slides
const totalItems = items.length;

// --- Clone first and last visibleCount items for seamless loop ---
for (let i = 0; i < visibleCount; i++) {
  const cloneFirst = items[i].cloneNode(true);
  cloneFirst.classList.add("clone");
  track.appendChild(cloneFirst);

  const cloneLast = items[totalItems - 1 - i].cloneNode(true);
  cloneLast.classList.add("clone");
  track.insertBefore(cloneLast, track.firstChild);
}

// --- All items including clones ---
let allItems = Array.from(track.children);

// --- Compute item width including margin ---
let gap = 16; // 1rem gap in pixels
let itemWidth = allItems[0].getBoundingClientRect().width + gap;

// --- Start at first real slide ---
let index = 0;
let currentTranslate = -itemWidth * visibleCount;
track.style.transform = `translateX(${currentTranslate}px)`;

// =========================
// HELPER FUNCTIONS
// =========================

// Move carousel to current index
function moveCarousel() {
  track.style.transition = "transform 0.5s ease";
  currentTranslate = -itemWidth * (index + visibleCount);
  track.style.transform = `translateX(${currentTranslate}px)`;
}

// Check infinite loop (snap after reaching clones)
function checkInfinite() {
  track.addEventListener(
    "transitionend",
    () => {
      // End clones
      if (index >= totalItems) {
        track.style.transition = "none";
        index = 0;
        currentTranslate = -itemWidth * visibleCount;
        track.style.transform = `translateX(${currentTranslate}px)`;
      }
      // Start clones
      if (index < 0) {
        track.style.transition = "none";
        index = totalItems - 1;
        currentTranslate = -itemWidth * (index + visibleCount);
        track.style.transform = `translateX(${currentTranslate}px)`;
      }
    },
    { once: true }
  );
}

// =========================
// ARROW BUTTONS
// =========================

nextBtn.addEventListener("click", () => {
  index++;
  moveCarousel();
  checkInfinite();
});

prevBtn.addEventListener("click", () => {
  index--;
  moveCarousel();
  checkInfinite();
});

// =========================
// POINTER / DRAG SUPPORT
// =========================

let isDragging = false;
let startX = 0;
let dragTranslate = 0;

track.addEventListener("pointerdown", (e) => {
  e.preventDefault(); // prevent image ghost drag
  isDragging = true;
  startX = e.clientX;
  dragTranslate = currentTranslate;
  track.style.transition = "none";
  track.setPointerCapture(e.pointerId);
});

track.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - startX;
  track.style.transform = `translateX(${dragTranslate + deltaX}px)`;
});

track.addEventListener("pointerup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  const deltaX = e.clientX - startX;

  if (deltaX < -itemWidth / 3) {
    index++;
  } else if (deltaX > itemWidth / 3) {
    index--;
  }

  moveCarousel();
  checkInfinite();
});

track.addEventListener("pointerleave", (e) => {
  if (!isDragging) return;
  isDragging = false;
  const deltaX = e.clientX - startX;

  if (deltaX < -itemWidth / 3) {
    index++;
  } else if (deltaX > itemWidth / 3) {
    index--;
  }

  moveCarousel();
  checkInfinite();
});

// =========================
// HANDLE WINDOW RESIZE
// =========================

window.addEventListener("resize", () => {
  itemWidth = allItems[0].getBoundingClientRect().width + gap;
  track.style.transition = "none";
  currentTranslate = -itemWidth * (index + visibleCount);
  track.style.transform = `translateX(${currentTranslate}px)`;
});
