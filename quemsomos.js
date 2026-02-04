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

  
    if (!mobileTitle) {
      const clone = originalTitle.cloneNode(true);
      clone.classList.add("mobile-page-title");
      clone.classList.remove("page-title"); 

      // Add padding to the span inside clone
      const span = clone.querySelector("span");
      if (span) {
        span.style.display = "inline-block"; // needed for vertical padding
        span.style.paddingTop = "0.1em"; // adjust as needed
      }

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
