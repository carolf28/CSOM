document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // MOBILE PAGE TITLE
  // =========================
  const originalTitle = document.querySelector(".page-title");
  const mainContent = document.querySelector("main.criaçoescsom");

  function handleTitlePlacement() {
    if (!originalTitle || !mainContent) return;

    let mobileTitle = document.querySelector(".mobile-page-title");

    if (window.innerWidth <= 700) {
      originalTitle.style.display = "none";

      if (!mobileTitle) {
        const clone = originalTitle.cloneNode(true);
        clone.classList.add("mobile-page-title");
        clone.classList.remove("page-title");

        const span = clone.querySelector("span");
        if (span) {
          span.style.display = "inline-block"; 
          span.style.paddingTop = "0.2em";      
        }

        mainContent.prepend(clone);
      }
    } else {
      originalTitle.style.display = "inline-flex";
      if (mobileTitle) mobileTitle.remove();
    }
  }

  handleTitlePlacement();
  window.addEventListener("resize", handleTitlePlacement);

  // =========================
  // FADE SLIDE UP FOR MAIN CONTENT
  // =========================
  if (mainContent) {
    const children = Array.from(mainContent.children);

    children.forEach((child, index) => {
      // Apply initial state
      child.style.opacity = 0;
      child.style.transform = "translateY(20px)";
      child.style.animationFillMode = "forwards";

      // Trigger animation with staggered delay
      child.style.animation = `fadeSlideUp 0.6s ease forwards ${index * 0.15}s`;
    });
  }

  // =========================
  // FADE SLIDE UP 
  // =========================
  const images = mainContent?.querySelectorAll(".image-grid img");
  if (images) {
    images.forEach((img, index) => {
      img.style.opacity = 0;
      img.style.transform = "translateY(20px)";
      img.style.animationFillMode = "forwards";
      img.style.animation = `fadeSlideUp 0.6s ease forwards ${index * 0.15}s`;
    });
  }
});
 

