class Slideshow {
  static SWIPE_THRESHOLD = 50;
  static WHEEL_THRESHOLD = 10;
  static WHEEL_DEBOUNCE = 600;

  constructor(element) {
    this.element = element;
    this.viewport = element.querySelector(".slideshow-viewport");
    this.slides = element.querySelectorAll(".slideshow-viewport > figure");
    this.dots = element.querySelectorAll("nav > a");
    this.currentIndex = 0;
    this.touchStart = 0;
    this.wheelDebounce = null;

    if (this.slides.length > 1) this.init();
  }

  init() {
    this.transitionDuration = this.getTransitionDuration();
    this.setupInitialState();
    this.addEventListeners();
  }

  getTransitionDuration() {
    const duration = getComputedStyle(this.slides[0]).transitionDuration;
    return parseInt(duration.replace("s", "")) * 1000 || 500;
  }

  setupInitialState() {
    const hash = window.location.hash.substring(1);
    const activeIndex = hash
      ? Array.from(this.slides).findIndex((s) => s.id === hash)
      : -1;

    this.currentIndex = activeIndex >= 0 ? activeIndex : 0;

    this.slides.forEach((slide, i) => {
      slide.style.transition = "none";
      slide.style.transform = i === this.currentIndex
        ? "translateX(0)"
        : "translateX(100%)";
      if (i === this.currentIndex) slide.classList.add("active");
    });

    this.dots[this.currentIndex].classList.add("active");
  }

  addEventListeners() {
    this.dots.forEach((dot, i) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        this.goToSlide(i, i > this.currentIndex ? "next" : "prev");
      });
    });

    this.viewport.style.cursor = "pointer";
    this.viewport.addEventListener("click", (e) => {
      const { left, width } = this.viewport.getBoundingClientRect();
      (e.clientX - left < width / 2) ? this.prevSlide() : this.nextSlide();
    });

    this.viewport.addEventListener("touchstart", (e) => {
      this.touchStart = e.changedTouches[0].screenX;
    }, { passive: true });

    this.viewport.addEventListener("touchend", (e) => {
      const diff = this.touchStart - e.changedTouches[0].screenX;
      if (Math.abs(diff) > Slideshow.SWIPE_THRESHOLD) {
        diff > 0 ? this.nextSlide() : this.prevSlide();
      }
    }, { passive: true });

    this.viewport.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaX) > 0) e.preventDefault();

      const isHorizontalSwipe = Math.abs(e.deltaX) > Math.abs(e.deltaY) &&
        Math.abs(e.deltaX) > Slideshow.WHEEL_THRESHOLD;

      if (isHorizontalSwipe && !this.wheelDebounce) {
        e.deltaX > 0 ? this.nextSlide() : this.prevSlide();
        this.wheelDebounce = setTimeout(
          () => this.wheelDebounce = null,
          Slideshow.WHEEL_DEBOUNCE,
        );
      }
    }, { passive: false });
  }

  goToSlide(index, direction = "next") {
    if (index === this.currentIndex) return;

    const prevSlide = this.slides[this.currentIndex];
    const nextSlide = this.slides[index];

    this.updateActiveState(index);
    this.animateTransition(prevSlide, nextSlide, direction);
    this.scheduleCleanup();
  }

  updateActiveState(index) {
    this.dots[this.currentIndex].classList.remove("active");
    this.dots[index].classList.add("active");
    this.currentIndex = index;

    if (this.slides[index].id) {
      history.replaceState(null, "", `#${this.slides[index].id}`);
    }
  }

  animateTransition(prevSlide, nextSlide, direction) {
    const exitTransform = direction === "next"
      ? "translateX(-100%)"
      : "translateX(100%)";
    const enterTransform = direction === "next"
      ? "translateX(100%)"
      : "translateX(-100%)";

    nextSlide.style.transition = "none";
    nextSlide.style.transform = enterTransform;
    nextSlide.offsetHeight;
    nextSlide.style.transition = "";
    prevSlide.style.transition = "";

    requestAnimationFrame(() => {
      nextSlide.style.transform = "translateX(0)";
      nextSlide.classList.add("active");
      prevSlide.classList.remove("active");
      prevSlide.style.transform = exitTransform;
    });
  }

  scheduleCleanup() {
    setTimeout(() => {
      this.slides.forEach((slide, i) => {
        if (i !== this.currentIndex) {
          slide.style.transition = "none";
          slide.style.transform = "translateX(100%)";
          slide.offsetHeight;
          slide.style.transition = "";
        }
      });
    }, this.transitionDuration);
  }

  nextSlide() {
    this.goToSlide((this.currentIndex + 1) % this.slides.length, "next");
  }

  prevSlide() {
    this.goToSlide(
      (this.currentIndex - 1 + this.slides.length) % this.slides.length,
      "prev",
    );
  }
}
