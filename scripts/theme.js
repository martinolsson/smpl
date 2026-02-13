class ThemeSwitcher {
  static DEFAULT_THEME = "light";
  static THEMES = ["light", "forest", "paper", "cyber", "dark"];

  constructor() {
    this.angleStep = 360 / ThemeSwitcher.THEMES.length;
    this.createSVG();
    this.links = document.querySelectorAll(".theme-switcher a");
    this.rotation = 0;
    this.visualRotation = 0;
    this.init();
  }

  init() {
    this.applyStoredTheme();
    this.addEventListeners();
  }

  applyStoredTheme() {
    if (!document.documentElement.hasAttribute("data-theme")) {
      const theme = this.getCurrentTheme();
      document.documentElement.setAttribute("data-theme", theme);
    }
    const currentTheme = this.getCurrentTheme();
    const currentIndex = ThemeSwitcher.THEMES.indexOf(currentTheme);
    this.rotation = -currentIndex * this.angleStep;
    this.visualRotation = this.rotation;
    this.updateRotation();
    this.updateLinks();
  }

  getCurrentTheme() {
    return localStorage.getItem("theme") || ThemeSwitcher.DEFAULT_THEME;
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.updateLinks();
  }

  cycleTheme() {
    const currentTheme = this.getCurrentTheme();
    const currentIndex = ThemeSwitcher.THEMES.indexOf(currentTheme);
    const nextIndex = (currentIndex - 1 + ThemeSwitcher.THEMES.length) %
      ThemeSwitcher.THEMES.length;

    this.visualRotation += this.angleStep;
    this.rotation = -nextIndex * this.angleStep;

    this.setTheme(ThemeSwitcher.THEMES[nextIndex]);
    this.updateRotation();
  }

  updateLinks() {
    const currentTheme = this.getCurrentTheme();
    this.links.forEach((link) => {
      if (link.dataset.theme !== "cycle") {
        link.style.display = link.dataset.theme === currentTheme
          ? "none"
          : "inline";
      }
    });
  }

  updateRotation() {
    const circles = document.querySelector(".theme-circles");
    if (circles) {
      circles.style.transform = `rotate(${this.visualRotation}deg)`;
    }
  }

  createSVG() {
    const container = document.querySelector(".theme-switcher");
    if (!container) return;

    const link = document.createElement("a");
    link.href = "#";
    link.dataset.theme = "cycle";
    link.setAttribute("aria-label", "Cycle through themes");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "72");
    svg.setAttribute("height", "72");
    svg.setAttribute("viewBox", "0 -6 32 44");
    svg.setAttribute("fill", "none");

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "theme-circles");

    const centerX = 16;
    const centerY = 16;
    const radius = 13;

    ThemeSwitcher.THEMES.forEach((theme, index) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );

      const angle = (index * this.angleStep - 90) * (Math.PI / 180);
      const cx = centerX + radius * Math.cos(angle);
      const cy = centerY + radius * Math.sin(angle);

      circle.setAttribute("data-theme", theme);
      circle.setAttribute("cx", cx.toFixed(1));
      circle.setAttribute("cy", cy.toFixed(1));
      circle.setAttribute("r", "4");
      g.appendChild(circle);
    });

    svg.appendChild(g);
    link.appendChild(svg);
    container.appendChild(link);
  }

  addEventListeners() {
    this.links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (link.dataset.theme === "cycle") {
          this.cycleTheme();
        } else {
          this.setTheme(link.dataset.theme);
        }
      });
    });
  }
}
