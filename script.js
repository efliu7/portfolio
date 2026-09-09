const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector(".site-header");
const year = document.querySelector("[data-year]");
const taskbarTime = document.querySelector(".taskbar-time");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

const experienceList = document.querySelector(".experience-list");
const experienceRecords = document.querySelectorAll(".experience-record");
const activityCards = document.querySelectorAll(".activity-card");

if (experienceList) {
  const revealTargets = [...experienceRecords, ...activityCards];

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    experienceList.style.setProperty("--timeline-progress", "100%");
  } else {
    document.documentElement.classList.add("experience-motion");

    const animateMetric = (metric) => {
      if (metric.dataset.counted === "true") return;

      const finalValue = metric.textContent.trim();
      const match = finalValue.match(/^(\D*)(\d+)(.*)$/);
      if (!match) return;

      const [, prefix, number, suffix] = match;
      const target = Number(number);
      const duration = 850;
      const startedAt = performance.now();

      metric.dataset.counted = "true";
      metric.setAttribute("aria-label", finalValue);

      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        metric.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;

        if (progress < 1) requestAnimationFrame(tick);
        else metric.textContent = finalValue;
      };

      requestAnimationFrame(tick);
    };

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll(".role-metrics dd").forEach(animateMetric);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    revealTargets.forEach((target) => revealObserver.observe(target));

    let timelineFrame;
    const updateTimeline = () => {
      timelineFrame = undefined;
      const bounds = experienceList.getBoundingClientRect();
      const activeLine = window.innerHeight * 0.62;
      const progress = Math.min(Math.max((activeLine - bounds.top) / bounds.height, 0), 1);
      experienceList.style.setProperty("--timeline-progress", `${progress * 100}%`);
    };

    const requestTimelineUpdate = () => {
      if (timelineFrame) return;
      timelineFrame = requestAnimationFrame(updateTimeline);
    };

    updateTimeline();
    window.addEventListener("scroll", requestTimelineUpdate, { passive: true });
    window.addEventListener("resize", requestTimelineUpdate);
  }
}
