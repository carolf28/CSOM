document.addEventListener("DOMContentLoaded", () => {
  // SLIDERS
  const sliders = document.querySelectorAll(".barulhario-slider");
  
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

  // FADE ANIMATION FOR ALL SECTIONS
  const fadeItems = document.querySelectorAll(
    ".barulhario-item, .barulhario-sobre, .barulhario-window"
  );

  fadeItems.forEach((item, index) => {
    // make sure initial state is hidden
    item.style.opacity = 0;
    item.style.transform = "translateY(20px)";
    item.style.animationFillMode = "forwards";

    // apply staggered fadeSlideUp
    item.style.animation = `fadeSlideUp 0.6s ease forwards ${index * 0.15}s`;
  });
});
