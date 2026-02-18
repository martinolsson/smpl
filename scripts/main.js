const cursor = document.querySelector(".cursor");
let cursorVisible = false;

if (cursor) {
  window.addEventListener("mousemove", (e) => {
    if (!cursorVisible) {
      cursor.classList.add("is-visible");
      cursorVisible = true;
    }

    cursor.style.transform =
      `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  new ThemeSwitcher();
  document.querySelectorAll(".slideshow").forEach((el) => new Slideshow(el));
});
