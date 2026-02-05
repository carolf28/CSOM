document.addEventListener("DOMContentLoaded", () => {
  const originalTitle = document.querySelector(".page-title");
  const mainContent = document.querySelector("main.criaçoescsom");

  function handleTitlePlacement() {
    if (!originalTitle || !mainContent) return;

    let mobileTitle = document.querySelector(".mobile-page-title");

    if (window.innerWidth <= 700) {
      // Hide desktop title
      originalTitle.style.display = "none";

      // Create mobile title if it doesn't exist
      if (!mobileTitle) {
        const clone = originalTitle.cloneNode(true);
        clone.classList.add("mobile-page-title");
        clone.classList.remove("page-title");

        // Add padding to the span inside
        const span = clone.querySelector("span");
        if (span) {
          span.style.display = "inline-block"; 
          span.style.paddingTop = "0.2em";      
        }

        mainContent.prepend(clone);
      }
    } else {
      // Show desktop title
      originalTitle.style.display = "inline-flex";

      // Remove mobile title if it exists
      if (mobileTitle) mobileTitle.remove();
    }
  }

  handleTitlePlacement();
  window.addEventListener("resize", handleTitlePlacement);
});