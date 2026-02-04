
const form = document.querySelector('.contact-form');
const thankYou = document.getElementById('thankyou-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent default submission

  const formData = new FormData(form);
  const response = await fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  });

  if (response.ok) {
    form.style.display = 'none';       // hide the form
    thankYou.style.display = 'block';   // show thank you
  } else {
    alert('Oops! Something went wrong.');
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".oficina-slider");
  const items = document.querySelectorAll(".oficina-item");
  const quemsomos = document.querySelector(".quemsomos-main");

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

  // ⭐ Animate quemsomos-main
  if (quemsomos) {
    quemsomos.style.animation = `fadeSlideUp 0.8s ease forwards`;
  }
});


if (window.innerWidth < 1000) {
  const container = document.querySelector('.quemsomos-content');
  const intro = container.querySelector('.about-intro');
  const history = container.querySelector('.about-history');
  const image = document.querySelector('.quemsomos-image');

  // Move image between intro and history
  intro.after(image);
}