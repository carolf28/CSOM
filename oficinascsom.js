document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".oficina-slider img");
  const prevBtn = document.querySelector(".left-arrow");
  const nextBtn = document.querySelector(".right-arrow");

  let currentIndex = 0;
  let autoSlideInterval = null;
  const AUTO_SLIDE_DELAY = 4000; // 4 seconds

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
    currentIndex =
      (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Initial state
  showSlide(currentIndex);
  startAutoSlide();

  // Arrow controls
  nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
  });

  prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
  });
});
