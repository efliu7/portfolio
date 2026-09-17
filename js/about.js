// About-page call connection and hobby-card reveal effects.

import { reduceMotion } from "./core.js";

const callWindow = document.querySelector(".call-window");
const callConnect = document.querySelector(".call-connect");
const hobbyCards = document.querySelectorAll(".hobby-card");

if (callWindow && callConnect && !reduceMotion.matches) {
  document.documentElement.classList.add("call-connecting");

  window.setTimeout(() => {
    document.documentElement.classList.add("call-ready");
    callConnect.hidden = true;

    window.setTimeout(() => {
      document.documentElement.classList.remove("call-connecting", "call-ready");
    }, 750);
  }, 2550);
} else if (callConnect) {
  callConnect.hidden = true;
}

if (hobbyCards.length && !reduceMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("about-motion");

  const hobbyObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -7%" },
  );

  hobbyCards.forEach((card) => hobbyObserver.observe(card));
} else {
  hobbyCards.forEach((card) => card.classList.add("is-visible"));
}
