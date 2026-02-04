document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // SLIDERS
  // =========================
  const sliders = document.querySelectorAll(".oficina-slider");
  const items = document.querySelectorAll(".oficina-item");

  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll("img");
    const prevBtn = slider.parentElement.querySelector(".left-arrow");
    const nextBtn = slider.parentElement.querySelector(".right-arrow");

    let currentIndex = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("show", i === index);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    }

    showSlide(currentIndex);

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);
  });

  // =========================
  // FADE ANIMATION FOR ITEMS
  // =========================
  items.forEach((item, index) => {
    item.style.opacity = 0;
    item.style.transform = "translateY(20px)";
    item.style.animationFillMode = "forwards";
    item.style.animation = `fadeSlideUp 0.6s ease forwards ${index * 0.15}s`;
  });

  // =========================
  // MOBILE PAGE TITLE
  // =========================
function createMobileTitle() {
  const desktopTitle = document.querySelector(".page-title");
  const main = document.querySelector(".oficina-main");
  if (!desktopTitle || !main) return;

  const mobileTitle = document.createElement("div");
  mobileTitle.classList.add("mobile-page-title");
  mobileTitle.innerHTML = `<span>${desktopTitle.textContent}</span>`;

  // Add padding to the span inside mobile title
  const span = mobileTitle.querySelector("span");
  if (span) {
    span.style.display = "inline-block"; // needed for vertical padding
    span.style.paddingTop = "0.2em"; // adjust as needed
  }

  main.insertBefore(mobileTitle, main.firstChild);
}

// Only create mobile title on small screens
if (window.innerWidth <= 700) {
  createMobileTitle();
}

// Update on resize
window.addEventListener("resize", () => {
  const mobileTitleExists = document.querySelector(".mobile-page-title");
  if (window.innerWidth <= 700 && !mobileTitleExists) {
    createMobileTitle();
  } else if (window.innerWidth > 700 && mobileTitleExists) {
    mobileTitleExists.remove();
  }
});
});
