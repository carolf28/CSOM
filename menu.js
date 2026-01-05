document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-button");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll("#nav-links-wrapper .nav-btn");

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    // Update button text
    menuButton.textContent = isOpen ? "Close" : "Menu";

    if (isOpen) {
      // Opening cascade
      navLinks.forEach((link, i) => {
        link.style.transitionDelay = `${i * 0.08}s`;
        link.style.opacity = 1;
        link.style.transform = "translateY(0)";
      });
    } else {
      // Closing cascade (reverse order)
      navLinks.forEach((link, i) => {
        const delay = (navLinks.length - 1 - i) * 0.08;
        link.style.transitionDelay = `${delay}s`;
        link.style.opacity = 0;
        link.style.transform = "translateY(-20px)";
      });
    }
  });
});
