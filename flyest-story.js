document.querySelectorAll("[data-post-slides]").forEach((carousel) => {
  const slides = JSON.parse(carousel.dataset.postSlides);
  const image = carousel.querySelector("img");
  const count = carousel.querySelector(".story-slide-count");
  let currentIndex = 0;
  let pointerStart = null;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    image.src = slides[currentIndex];
    image.alt = `${carousel.dataset.postAlt}, photo ${currentIndex + 1} of ${slides.length}`;
    count.textContent = `${currentIndex + 1} / ${slides.length}`;
  };

  carousel.querySelectorAll("[data-slide-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      showSlide(currentIndex + Number(button.dataset.slideDirection));
    });
  });

  carousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    pointerStart = { x: event.clientX, y: event.clientY };
  });
  carousel.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      showSlide(currentIndex + (deltaX < 0 ? 1 : -1));
    }
  });
  carousel.addEventListener("pointercancel", () => {
    pointerStart = null;
  });
});
