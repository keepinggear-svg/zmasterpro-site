(() => {
  "use strict";

  const installButton = document.getElementById("installAppButton");
  const modal = document.getElementById("installGuideModal");
  const closeButton = document.getElementById("closeInstallGuideButton");
  const nativeButton = document.getElementById("nativeInstallButton");
  const tabButtons = [...document.querySelectorAll("[data-install-tab]")];
  const panels = [...document.querySelectorAll("[data-install-panel]")];
  if (!installButton || !modal || !closeButton || !nativeButton) return;

  let deferredPrompt = null;

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches
      || window.matchMedia("(display-mode: fullscreen)").matches
      || window.navigator.standalone === true;
  }

  function selectTab(tab) {
    tabButtons.forEach((button) => {
      const active = button.dataset.installTab === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    panels.forEach((panel) => {
      const active = panel.dataset.installPanel === tab;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  function openGuide() {
    const ios = /iPad|iPhone|iPod/i.test(navigator.userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    selectTab(ios ? "ios" : "android");
    nativeButton.hidden = !deferredPrompt;
    modal.hidden = false;
  }

  function closeGuide() {
    modal.hidden = true;
  }

  async function promptInstall() {
    if (!deferredPrompt) {
      openGuide();
      return;
    }
    const prompt = deferredPrompt;
    deferredPrompt = null;
    nativeButton.hidden = true;
    await prompt.prompt();
    const choice = await prompt.userChoice.catch(() => ({ outcome: "dismissed" }));
    if (choice.outcome === "accepted") closeGuide();
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.hidden = false;
    nativeButton.hidden = modal.hidden;
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installButton.hidden = true;
    closeGuide();
  });

  installButton.addEventListener("click", promptInstall);
  nativeButton.addEventListener("click", promptInstall);
  closeButton.addEventListener("click", closeGuide);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeGuide();
  });
  tabButtons.forEach((button) => button.addEventListener("click", () => selectTab(button.dataset.installTab)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeGuide();
  });

  if (isStandalone()) installButton.hidden = true;

  const action = new URLSearchParams(window.location.search).get("action");
  if (action === "import") {
    window.setTimeout(() => document.getElementById("navImportWordsButton")?.click(), 250);
  }
})();
