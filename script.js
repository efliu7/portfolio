const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
});

nav?.addEventListener("click", () => {
  menuButton?.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
});

if (year) year.textContent = String(new Date().getFullYear());
