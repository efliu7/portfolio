const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector(".site-header");
const year = document.querySelector("[data-year]");
const taskbarTime = document.querySelector(".taskbar-time");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
});

nav?.addEventListener("click", () => {
  menuButton?.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
});

const updateHeaderSurface = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderSurface();
window.addEventListener("scroll", updateHeaderSurface, { passive: true });

const updateTaskbarTime = () => {
  if (!taskbarTime) return;

  taskbarTime.textContent = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
};

updateTaskbarTime();
if (taskbarTime) window.setInterval(updateTaskbarTime, 30_000);

if (year) year.textContent = String(new Date().getFullYear());
