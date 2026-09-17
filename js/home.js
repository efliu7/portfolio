// Home-page desktop boot sequence.

import { reduceMotion } from "./core.js";

const landingDesktop = document.querySelector(".pixel-desktop");
const desktopBoot = document.querySelector(".desktop-boot");

if (landingDesktop && desktopBoot && !reduceMotion.matches) {
  document.documentElement.classList.add("landing-motion");

  const finishDesktopBoot = () => {
    document.documentElement.classList.add("landing-ready");
    desktopBoot.hidden = true;

    window.setTimeout(() => {
      document.documentElement.classList.remove("landing-motion", "landing-ready");
    }, 800);
  };

  window.setTimeout(finishDesktopBoot, 2850);
} else if (desktopBoot) {
  desktopBoot.hidden = true;
}
