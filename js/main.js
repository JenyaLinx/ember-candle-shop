/*=============== ELEMENTS ===============*/
const navMenu = document.getElementById("js-nav-menu");
const navToggle = document.getElementById("js-nav-toggle");
const navClose = document.getElementById("js-nav-close");
const navLinks = document.querySelectorAll(".nav-link");

/*=============== SHOW MENU ===============*/
const showMenu = () => {
  navMenu?.classList.add("show-menu");
};

/*=============== HIDE MENU ===============*/
const hideMenu = () => {
  navMenu?.classList.remove("show-menu");
};

navToggle?.addEventListener("click", showMenu);
navClose?.addEventListener("click", hideMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", hideMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideMenu();
  }
});