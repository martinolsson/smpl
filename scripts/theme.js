class ThemeSwitcher {
  static DEFAULT_THEME = "light";

  constructor() {
    this.rotation = 0;
    this.createSVG();
    this.init();
  }

  init() {
    this.applyStoredTheme();
    this.addEventListeners();
  }

  applyStoredTheme() {
    const theme = this.getCurrentTheme();
    document.documentElement.setAttribute("data-theme", theme);
    this.rotation = theme === "dark" ? 180 : 0;
    this.updateRotation();
  }

  getCurrentTheme() {
    return localStorage.getItem("theme") || ThemeSwitcher.DEFAULT_THEME;
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    this.rotation += 180;
    this.setTheme(nextTheme);
    this.updateRotation();
  }

  updateRotation() {
    const svg = document.querySelector(".theme-switcher svg");
    if (svg) {
      svg.style.setProperty("--rotation", `${this.rotation}deg`);
    }
  }

  createSVG() {
    const container = document.querySelector(".theme-switcher");
    if (!container) return;

    const link = document.createElement("a");
    link.href = "#";
    link.setAttribute("aria-label", "Toggle dark mode");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "48");
    svg.setAttribute("height", "48");
    svg.setAttribute("viewBox", "0 0 32 32");
    svg.setAttribute("fill", "none");

    const yinYang = `
      <circle cx="16" cy="16" r="15" fill="var(--color-foreground)" stroke="var(--color-foreground)" stroke-width="2"/>
      <path d="M 16 1 A 15 15 0 0 0 16 31 A 7.5 7.5 0 0 1 16 16 A 7.5 7.5 0 0 0 16 1" fill="var(--color-background)"/>
      <circle cx="16" cy="8.5" r="2" fill="var(--color-background)"/>
      <circle cx="16" cy="23.5" r="2" fill="var(--color-foreground)"/>
    `;

    svg.innerHTML = yinYang;
    link.appendChild(svg);
    container.appendChild(link);
  }

  addEventListeners() {
    const link = document.querySelector(".theme-switcher a");
    if (link) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    }
  }
}
