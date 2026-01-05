document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-button");
  const nav = document.querySelector("nav");
  const navLinks = [...document.querySelectorAll("#nav-links-wrapper .nav-btn")];

  if (!menuButton || !nav) return;

  const openMenu = () => {
    nav.classList.add("open");
    menuButton.textContent = "Close";

    navLinks.forEach((link, i) => {
      link.style.transitionDelay = `${i * 0.08}s`;
      link.style.opacity = "1";
      link.style.transform = "translateY(0)";
    });
  };

  const closeMenu = () => {
    navLinks
      .slice()
      .reverse()
      .forEach((link, i) => {
        link.style.transitionDelay = `${i * 0.08}s`;
        link.style.opacity = "0";
        link.style.transform = "translateY(-20px)";
      });


    setTimeout(() => {
      nav.classList.remove("open");
      menuButton.textContent = "Menu";
    }, navLinks.length * 80 + 150);
  };

  /* Toggle menu */
  menuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.contains("open") ? closeMenu() : openMenu();
  });


  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && nav.classList.contains("open")) {
      closeMenu();
    }
  });
});
