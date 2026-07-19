(() => {
  const home = document.querySelector(".cinematic-hero");
  if (!home) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const video = home.querySelector(".cinematic-video");
  const revealItems = document.querySelectorAll("[data-reveal], [data-card-reveal]");
  const progressiveText = document.querySelector("[data-progress-text]");
  let textLetters = [];
  let animationFrame = 0;

  document.body.classList.add("studio-enhanced");

  if (progressiveText) {
    const text = progressiveText.textContent.trim();
    progressiveText.setAttribute("aria-label", text);
    progressiveText.textContent = "";
    textLetters = [...text].map((character) => {
      const span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      span.textContent = character;
      progressiveText.appendChild(span);
      return span;
    });
  }

  if (reducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    textLetters.forEach((letter) => { letter.style.opacity = "1"; });
    if (video) video.pause();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8%" });

  revealItems.forEach((item) => observer.observe(item));

  function updateProgressiveText() {
    animationFrame = 0;
    if (!progressiveText || !textLetters.length) return;

    const rect = progressiveText.getBoundingClientRect();
    const start = window.innerHeight * 0.84;
    const end = window.innerHeight * 0.22;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

    textLetters.forEach((letter, index) => {
      const letterStart = (index / textLetters.length) * 0.88;
      const opacity = Math.min(1, Math.max(0.18, (progress - letterStart) / 0.1));
      letter.style.opacity = opacity.toFixed(3);
    });
  }

  window.addEventListener("scroll", () => {
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(updateProgressiveText);
  }, { passive: true });

  window.addEventListener("resize", updateProgressiveText, { passive: true });
  updateProgressiveText();
})();
