# Ethan Liu | Portfolio

A small, framework-free portfolio built with plain HTML, CSS, and JavaScript.

## Structure

- `index.html`: landing page and desktop-style navigation
- `projects.html`: projects page shell
- `experience.html`: experience page shell
- `about.html`: about page shell
- `styles.css`: CSS entry point; imports the focused stylesheets in `css/`
- `css/`: shared foundations, reusable components, page styles, animations, and responsive overrides
- `script.js`: JavaScript module entry point
- `js/`: shared behavior plus terminal, home, projects, experience, and about modules
- `assets/`: static site assets

Each section has its own route, accessed through the desktop-style folder navigation.

CSS imports are ordered from shared foundations through page-specific rules, with
animations and responsive overrides last. JavaScript modules are page-aware, so the
same entry point can be loaded safely on every route.
