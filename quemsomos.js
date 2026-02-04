document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     CONTACT FORM SUBMISSION
  ============================ */
  const form = document.querySelector('.contact-form');
  const thankYou = document.getElementById('thankyou-message');

  if (form && thankYou) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });
      if (response.ok) {
        form.style.display = 'none';
        thankYou.style.display = 'block';
      } else {
        alert('Oops! Something went wrong.');
      }
    });
  }

  /* ============================
     SLIDERS
  ============================ */
  const sliders = document.querySelectorAll(".oficina-slider");
  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll("img");
    const prevBtn = slider.parentElement.querySelector(".left-arrow");
    const nextBtn = slider.parentElement.querySelector(".right-arrow");
    let currentIndex = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => slide.classList.toggle("show", i === index));
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    };

    showSlide(currentIndex);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  });

  /* ============================
     ANIMATIONS
  ============================ */
  const items = document.querySelectorAll(".oficina-item");
  items.forEach((item, index) => {
    item.style.animation = `fadeSlideUp 0.6s ease forwards ${index * 0.15}s`;
  });

  const quemsomos = document.querySelector(".quemsomos-main");
  if (quemsomos) quemsomos.style.animation = `fadeSlideUp 0.8s ease forwards`;

  /* ============================
     MOBILE: MOVE IMAGE
  ============================ */
  const moveImageMobile = () => {
    const container = document.querySelector('.quemsomos-content');
    const intro = container?.querySelector('.about-intro');
    const history = container?.querySelector('.about-history');
    const image = document.querySelector('.quemsomos-image');

    if (!container || !intro || !history || !image) return;

    if (window.innerWidth < 1000) {
      intro.after(image);
    } else {
      const mainContainer = document.querySelector('.quemsomos-container');
      if (mainContainer) mainContainer.prepend(image);
    }
  };
  moveImageMobile();
  window.addEventListener("resize", moveImageMobile);

  /* ============================
     MOBILE: PAGE TITLE
  ============================ */
  const originalTitle = document.querySelector(".page-title");

  const handleTitlePlacement = () => {
    if (!originalTitle || !quemsomos) return;

    let mobileTitle = document.querySelector(".mobile-page-title");

    if (window.innerWidth <= 700) {
      // Hide desktop title
      originalTitle.style.display = "none";

      // Clone mobile title if not exists
      if (!mobileTitle) {
        const clone = originalTitle.cloneNode(true);
        clone.classList.add("mobile-page-title");
        clone.classList.remove("page-title"); // remove original class
        quemsomos.prepend(clone); // insert inside main container
      }
    } else {
      // Show desktop title
      originalTitle.style.display = "flex";

      // Remove mobile title if exists
      if (mobileTitle) mobileTitle.remove();
    }
  };

  handleTitlePlacement();
  window.addEventListener("resize", handleTitlePlacement);
});
