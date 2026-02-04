document.addEventListener("DOMContentLoaded", () => {
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
        mainContent.prepend(clone);
      }
    } else {
      originalTitle.style.display = "inline-flex";
      if (mobileTitle) mobileTitle.remove();
    }
  }

  handleTitlePlacement();
  window.addEventListener("resize", handleTitlePlacement);
});