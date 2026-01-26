document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".oficina-slider");
  const items = document.querySelectorAll(".oficina-item");

  // Slide show logic (your existing code)
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

  // Animate oficina items
  items.forEach((item, index) => {
    item.style.animation = `fadeSlideUp 0.6s ease forwards ${index * 0.15}s`;
  });
});
