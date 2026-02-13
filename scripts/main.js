const cursor = document.querySelector(".cursor");
let cursorVisible = false;
let isOverThemeSwitcher = false;

if (cursor) {
  window.addEventListener("mousemove", (e) => {
    const themeSwitcher = document.querySelector(".theme-switcher");
    const wasOverThemeSwitcher = isOverThemeSwitcher;
    isOverThemeSwitcher = themeSwitcher && themeSwitcher.contains(e.target);

    if (isOverThemeSwitcher) {
      if (!wasOverThemeSwitcher) {
        cursor.classList.add("shrinking");
      }

      const selectedCircle = themeSwitcher.querySelector(
        `circle[data-theme="${
          document.documentElement.getAttribute("data-theme")
        }"]`,
      );
      if (selectedCircle) {
        const rect = selectedCircle.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        cursor.style.transform =
          `translate(${targetX}px, ${targetY}px) translate(-50%, -50%) scale(0.05)`;
      } else {
        cursor.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(0.05)`;
      }
    } else {
      if (wasOverThemeSwitcher) {
        cursor.classList.remove("shrinking");
        cursor.classList.add("growing");
        setTimeout(() => {
          cursor.classList.remove("growing");
        }, 600);
      }

      if (!cursorVisible) {
        cursor.classList.add("is-visible");
        cursorVisible = true;
      }

      cursor.style.transform =
        `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(1)`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  new ThemeSwitcher();
  document.querySelectorAll(".slideshow").forEach((el) => new Slideshow(el));
});
