class Slideshow {
  constructor(root) {
    this.root = root;
    this.viewport = root.querySelector(".slideshow-viewport");
    this.slides = Array.from(this.viewport.children);
    this.dots = [];
  }

  init() {
    this.createDotNavigation();
    this.viewport.addEventListener("click", this.onViewportClick);
    this.viewport.addEventListener("scroll", this.updateActiveDot);
    this.viewport.addEventListener("scroll", this.updateHeight);
    window.addEventListener("resize", this.updateHeight);
    this.updateHeight();
  }

  createDotNavigation() {
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Slideshow navigation");
    this.dots = this.slides.map((slide, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.addEventListener("click", () => {
        slide.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      });
      nav.appendChild(dot);
      return dot;
    });
    if (this.dots && this.dots.length) this.dots[0].classList.add("active");
    this.root.appendChild(nav);
  }

  onViewportClick = (e) => {
    const rect = this.viewport.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const index = this.getCurrentSlideIndex();
    if (clickX < rect.width / 2 && index > 0) {
      this.scrollToSlide(index - 1);
    } else if (clickX >= rect.width / 2 && index < this.slides.length - 1) {
      this.scrollToSlide(index + 1);
    }
  };

  getCurrentSlideIndex() {
    if (!this.slides.length) return 0;
    const slideWidth = this.slides[0].offsetWidth;
    return slideWidth ? Math.round(this.viewport.scrollLeft / slideWidth) : 0;
  }

  scrollToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    this.slides[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  updateActiveDot = () => {
    if (!this.dots.length) return;
    const index = this.getCurrentSlideIndex();
    this.dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  };

  updateHeight = () => {
    const index = this.getCurrentSlideIndex();
    const slide = this.slides[index];

    if (!slide) return;
    let content = slide.querySelector("img, video") || slide;
    let height = content.offsetHeight;
    if (content.tagName === "IMG" && !content.complete) {
      content.addEventListener("load", this.updateHeight, { once: true });
    } else if (content.tagName === "VIDEO" && content.readyState < 1) {
      content.addEventListener("loadedmetadata", this.updateHeight, {
        once: true,
      });
    }
    if (height > 0) {
      this.viewport.style.height = height + "px";
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slideshow").forEach((el) =>
    new Slideshow(el).init()
  );
});
