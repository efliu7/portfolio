// Project explorer boot, keyboard tabs, and media gallery behavior.

import { reduceMotion } from "./core.js";

const projectBrowser = document.querySelector("[data-project-browser]");
const projectBoot = document.querySelector(".project-boot");

if (projectBrowser && projectBoot && !reduceMotion.matches) {
  document.documentElement.classList.add("projects-motion");

  const finishProjectBoot = () => {
    document.documentElement.classList.add("projects-ready");
    projectBoot.hidden = true;

    window.setTimeout(() => {
      document.documentElement.classList.remove("projects-motion", "projects-ready");
    }, 850);
  };

  window.setTimeout(finishProjectBoot, 2850);
} else if (projectBoot) {
  projectBoot.hidden = true;
}

if (projectBrowser) {
  const projectTabs = [...projectBrowser.querySelectorAll("[data-project-target]")];
  const projectPanels = [...projectBrowser.querySelectorAll("[role='tabpanel']")];
  const projectInspector = projectBrowser.querySelector(".project-inspector");
  const projectStatus = projectBrowser.querySelector("[data-project-status]");
  const projectPath = projectBrowser.querySelector("[data-project-path]");

  const selectProject = (selectedTab, moveFocus = false) => {
    const selectedPanel = projectPanels.find((panel) => panel.id === selectedTab.dataset.projectTarget);
    if (!selectedPanel) return;

    projectTabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle("is-selected", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    projectPanels.forEach((panel) => {
      panel.hidden = panel !== selectedPanel;
      panel.classList.remove("is-loading");
    });

    if (projectInspector) projectInspector.scrollTop = 0;

    if (!reduceMotion.matches) {
      requestAnimationFrame(() => selectedPanel.classList.add("is-loading"));
    }

    const selectedIndex = projectTabs.indexOf(selectedTab) + 1;
    const selectedName = selectedTab.querySelector("strong")?.textContent ?? "project";
    if (projectStatus) projectStatus.textContent = `${String(selectedIndex).padStart(2, "0")} / ${selectedName.toUpperCase()}`;
    if (projectPath) projectPath.textContent = selectedName;

    if (moveFocus) selectedTab.focus();
  };

  projectTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectProject(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % projectTabs.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + projectTabs.length) % projectTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = projectTabs.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      selectProject(projectTabs[nextIndex], true);
    });
  });

  projectBrowser.querySelectorAll(".project-shot-list button[data-media-src]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.getAttribute("aria-pressed") === "true") return;

      const showcase = button.closest(".project-showcase");
      const frame = showcase?.querySelector(".project-media-frame");
      const image = frame?.querySelector("img");
      const caption = frame?.querySelector("figcaption");
      const slot = showcase?.querySelector(".project-showcase-bar span:last-child");
      const mediaSrc = button.dataset.mediaSrc;
      if (!showcase || !frame || !image || !caption || !mediaSrc) return;

      showcase.querySelectorAll(".project-shot-list button").forEach((option) => {
        const isSelected = option === button;
        option.classList.toggle("is-selected", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
      });

      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

      const loadSelectedImage = () => {
        image.src = mediaSrc;
        image.alt = button.dataset.mediaAlt ?? "Project screenshot";
        caption.textContent = button.dataset.mediaCaption ?? "";
        if (slot) slot.textContent = `slot ${String([...button.parentElement.children].indexOf(button) + 1).padStart(2, "0")}`;

        if (!reduceMotion.matches) {
          window.setTimeout(() => frame.classList.remove("is-switching"), 120);
        }
      };

      if (reduceMotion.matches) loadSelectedImage();
      else {
        window.clearTimeout(Number(frame.dataset.mediaSwapTimer));
        frame.classList.add("is-switching");
        frame.dataset.mediaSwapTimer = String(window.setTimeout(loadSelectedImage, 80));
      }
    });
  });
}
