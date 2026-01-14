const track = document.querySelector(".carousel-track");
const items = Array.from(track.children);
const prevBtn = document.querySelector(".arrow.left");
const nextBtn = document.querySelector(".arrow.right");

const visibleCount = 3; // number of images visible at a time
const totalItems = items.length;

let index = 0;

// Clone first and last visibleCount items for seamless loop
for (let i = 0; i < visibleCount; i++) {
  const cloneFirst = items[i].cloneNode(true);
  cloneFirst.classList.add("clone");
  track.appendChild(cloneFirst);

  const cloneLast = items[totalItems - 1 - i].cloneNode(true);
  cloneLast.classList.add("clone");
  track.insertBefore(cloneLast, track.firstChild);
}

// update all items after cloning
const allItems = Array.from(track.children);
let itemWidth = allItems[0].getBoundingClientRect().width + 16; // includes margin-right

// Start at first real item
track.style.transform = `translateX(-${itemWidth * visibleCount}px)`;

// Move carousel
function moveCarousel() {
  track.style.transition = "transform 0.5s ease";
  track.style.transform = `translateX(-${itemWidth * (index + visibleCount)}px)`;
}

// Snap for infinite loop
function checkInfinite() {
  track.addEventListener("transitionend", () => {
    if (index >= totalItems) {
      track.style.transition = "none";
      index = 0;
      track.style.transform = `translateX(-${itemWidth * visibleCount}px)`;
    }
    if (index < 0) {
      track.style.transition = "none";
      index = totalItems - visibleCount;
      track.style.transform = `translateX(-${itemWidth * (index + visibleCount)}px)`;
    }
  }, { once: true });
}

// Button clicks
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

// Handle resize
window.addEventListener("resize", () => {
  itemWidth = allItems[0].getBoundingClientRect().width + 16;
  track.style.transition = "none";
  track.style.transform = `translateX(-${itemWidth * (index + visibleCount)}px)`;
});
