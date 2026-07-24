(() => {
  "use strict";

  const MENU_URL = "./menu-data.json";
  const SELECTED_KEY = "family-flavor-selected-v1";
  const HEART_KEY = "family-flavor-hearts-v1";
  const FILTER_KEY = "family-flavor-filter-v1";

  const state = {
    data: null,
    category: "全部",
    cuisine: "全部风味",
    query: "",
    childOnly: false,
    ratedOnly: false,
    selectedIds: readStoredArray(SELECTED_KEY),
    hearts: readStoredObject(HEART_KEY),
    detailId: null,
    deferredPrompt: null,
    installTab: "ios",
    toastTimer: null,
    refreshTimer: null,
  };

  const dom = {
    pageLoader: document.getElementById("pageLoader"),
    appShell: document.getElementById("appShell"),
    dishCountLabel: document.getElementById("dishCountLabel"),
    featuredRow: document.getElementById("featuredRow"),
    dishGrid: document.getElementById("dishGrid"),
    resultCount: document.getElementById("resultCount"),
    categoryFilters: document.getElementById("categoryFilters"),
    cuisineFilters: document.getElementById("cuisineFilters"),
    searchInput: document.getElementById("searchInput"),
    clearSearchButton: document.getElementById("clearSearchButton"),
    childFriendlyButton: document.getElementById("childFriendlyButton"),
    ratedButton: document.getElementById("ratedButton"),
    resetFiltersButton: document.getElementById("resetFiltersButton"),
    emptyState: document.getElementById("emptyState"),
    syncButton: document.getElementById("syncButton"),
    syncLabel: document.getElementById("syncLabel"),
    menuVersion: document.getElementById("menuVersion"),
    orderDock: document.getElementById("orderDock"),
    orderDockNames: document.getElementById("orderDockNames"),
    detailBackdrop: document.getElementById("detailBackdrop"),
    detailImage: document.getElementById("detailImage"),
    detailTags: document.getElementById("detailTags"),
    detailTitle: document.getElementById("detailTitle"),
    detailSummary: document.getElementById("detailSummary"),
    detailDuration: document.getElementById("detailDuration"),
    detailDifficulty: document.getElementById("detailDifficulty"),
    detailAudience: document.getElementById("detailAudience"),
    detailIngredients: document.getElementById("detailIngredients"),
    detailSteps: document.getElementById("detailSteps"),
    detailTip: document.getElementById("detailTip"),
    detailRating: document.getElementById("detailRating"),
    detailSelectButton: document.getElementById("detailSelectButton"),
    orderBackdrop: document.getElementById("orderBackdrop"),
    selectedList: document.getElementById("selectedList"),
    orderEmpty: document.getElementById("orderEmpty"),
    balanceCard: document.getElementById("balanceCard"),
    balanceProgress: document.getElementById("balanceProgress"),
    balanceText: document.getElementById("balanceText"),
    copyOrderButton: document.getElementById("copyOrderButton"),
    clearOrderButton: document.getElementById("clearOrderButton"),
    installGuideModal: document.getElementById("installGuideModal"),
    installAppButton: document.getElementById("installAppButton"),
    mobileInstallButton: document.getElementById("mobileInstallButton"),
    closeInstallGuideButton: document.getElementById("closeInstallGuideButton"),
    nativeInstallButton: document.getElementById("nativeInstallButton"),
    toast: document.getElementById("toast"),
  };

  function readStoredArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value.filter(Number.isFinite) : [];
    } catch {
      return [];
    }
  }

  function readStoredObject(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }

  function saveState() {
    localStorage.setItem(SELECTED_KEY, JSON.stringify(state.selectedIds));
    localStorage.setItem(HEART_KEY, JSON.stringify(state.hearts));
    localStorage.setItem(
      FILTER_KEY,
      JSON.stringify({
        category: state.category,
        cuisine: state.cuisine,
        childOnly: state.childOnly,
      }),
    );
  }

  function restoreFilters() {
    try {
      const value = JSON.parse(localStorage.getItem(FILTER_KEY) || "{}");
      if (typeof value.category === "string") state.category = value.category;
      if (typeof value.cuisine === "string") state.cuisine = value.cuisine;
      state.childOnly = value.childOnly === true;
    } catch {
      // Keep defaults.
    }
  }

  function sanitizeSelections() {
    const validIds = new Set(state.data.dishes.map((dish) => dish.id));
    state.selectedIds = state.selectedIds.filter((id) => validIds.has(id));
    for (const id of Object.keys(state.hearts)) {
      if (!validIds.has(Number(id))) delete state.hearts[id];
    }
    saveState();
  }

  function formatVersion(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "菜单持续更新";
    return `菜单更新于 ${date.toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}`;
  }

  async function fetchMenu({ announce = false } = {}) {
    dom.syncButton.classList.add("is-syncing");
    dom.syncLabel.textContent = "正在同步";
    try {
      const response = await fetch(`${MENU_URL}?t=${Date.now()}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const next = await response.json();
      if (!Array.isArray(next.dishes) || !next.dishes.length) throw new Error("菜单数据为空");
      const changed = state.data && next.version !== state.data.version;
      state.data = next;
      sanitizeSelections();
      ensureValidFilters();
      renderAll();
      dom.syncButton.classList.toggle("is-new", Boolean(changed));
      dom.syncLabel.textContent = changed ? "发现新菜单" : "菜单已同步";
      if (changed || announce) showToast(changed ? "菜单已更新到最新版" : "现在已经是最新菜单");
      window.setTimeout(() => dom.syncButton.classList.remove("is-new"), 2200);
      scheduleRefresh();
    } catch (error) {
      if (!state.data) {
        dom.pageLoader.querySelector("strong").textContent = "菜单暂时没有摆好，请稍后重试";
        console.error(error);
      } else {
        dom.syncLabel.textContent = "离线菜单";
        if (announce) showToast("网络不稳定，正在使用手机里的菜单");
      }
    } finally {
      dom.syncButton.classList.remove("is-syncing");
    }
  }

  function scheduleRefresh() {
    window.clearInterval(state.refreshTimer);
    const seconds = Math.max(30, Number(state.data?.refreshSeconds) || 60);
    state.refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") fetchMenu();
    }, seconds * 1000);
  }

  function ensureValidFilters() {
    if (!state.data.categoryOrder.includes(state.category)) state.category = "全部";
    if (!state.data.cuisineOrder.includes(state.cuisine)) state.cuisine = "全部风味";
  }

  function dishById(id) {
    return state.data?.dishes.find((dish) => dish.id === Number(id)) || null;
  }

  function selectedDishes() {
    return state.selectedIds.map(dishById).filter(Boolean);
  }

  function filteredDishes() {
    const query = state.query.trim().toLocaleLowerCase("zh-CN");
    return state.data.dishes.filter((dish) => {
      const categoryMatch = state.category === "全部" || dish.category === state.category;
      const cuisineMatch = state.cuisine === "全部风味" || dish.cuisine === state.cuisine;
      const queryMatch =
        !query ||
        dish.name.toLocaleLowerCase("zh-CN").includes(query) ||
        dish.category.toLocaleLowerCase("zh-CN").includes(query) ||
        (dish.cuisine || "").toLocaleLowerCase("zh-CN").includes(query);
      const childMatch = !state.childOnly || dish.audience === "亲子";
      const ratedMatch = !state.ratedOnly || Number(state.hearts[dish.id] || 0) > 0;
      return categoryMatch && cuisineMatch && queryMatch && childMatch && ratedMatch;
    });
  }

  function renderAll() {
    if (!state.data) return;
    dom.appShell.hidden = false;
    dom.pageLoader.hidden = true;
    dom.dishCountLabel.textContent = `${state.data.dishes.length} 道家庭菜单`;
    dom.menuVersion.textContent = formatVersion(state.data.version);
    renderFilters();
    renderFeatured();
    renderDishes();
    renderOrderState();
    openDishFromUrl();
  }

  function renderFilters() {
    renderFilterGroup(dom.categoryFilters, state.data.categoryOrder, state.category, (value) => {
      state.category = value;
      saveState();
      renderFilters();
      renderDishes();
    });
    renderFilterGroup(dom.cuisineFilters, state.data.cuisineOrder, state.cuisine, (value) => {
      state.cuisine = value;
      saveState();
      renderFilters();
      renderDishes();
    });
    dom.searchInput.value = state.query;
    dom.clearSearchButton.hidden = !state.query;
    dom.childFriendlyButton.setAttribute("aria-pressed", String(state.childOnly));
    dom.ratedButton.setAttribute("aria-pressed", String(state.ratedOnly));
  }

  function renderFilterGroup(container, values, current, onClick) {
    container.replaceChildren();
    values.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = value;
      button.className = value === current ? "is-active" : "";
      button.addEventListener("click", () => onClick(value));
      container.append(button);
    });
  }

  function renderFeatured() {
    dom.featuredRow.replaceChildren();
    const featured = state.data.featuredIds.map(dishById).filter(Boolean);
    featured.forEach((dish) => {
      const selected = state.selectedIds.includes(dish.id);
      const card = document.createElement("button");
      card.type = "button";
      card.className = `featured-card${selected ? " is-selected" : ""}`;
      card.setAttribute("aria-label", `查看${dish.name}做法`);
      card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" width="900" height="900">
        <span class="featured-card-content">
          <small>${dish.cuisine ? `${dish.cuisine} · ` : ""}${dish.category}</small>
          <strong>${dish.name}</strong>
          <em>${selected ? "已选" : "看做法"}</em>
        </span>`;
      card.addEventListener("click", () => openDetail(dish.id));
      dom.featuredRow.append(card);
    });
  }

  function renderDishes() {
    const dishes = filteredDishes();
    dom.resultCount.textContent = `${dishes.length} 道`;
    dom.dishGrid.replaceChildren();
    dom.emptyState.hidden = dishes.length > 0;
    dishes.forEach((dish) => dom.dishGrid.append(createDishCard(dish)));
  }

  function createDishCard(dish) {
    const selected = state.selectedIds.includes(dish.id);
    const rating = Number(state.hearts[dish.id] || 0);
    const card = document.createElement("article");
    card.className = `dish-card${selected ? " is-selected" : ""}`;
    card.dataset.dishId = String(dish.id);
    card.innerHTML = `
      <button class="dish-image-button" type="button" aria-label="查看${dish.name}制作流程">
        <img src="${dish.image}" alt="${dish.name}" width="900" height="900" loading="lazy" decoding="async">
        ${selected ? '<span class="selected-badge">已选</span>' : ""}
      </button>
      <div class="dish-body">
        <div class="dish-meta">
          <span>${dish.category}</span>
          <span class="dish-tags">
            ${dish.cuisine ? `<span class="dish-tag is-cuisine">${dish.cuisine}</span>` : ""}
            <span class="dish-tag${dish.audience === "亲子" ? " is-child" : ""}">${dish.audience}</span>
          </span>
        </div>
        <h3>${dish.name}</h3>
        <p>${dish.duration} · ${dish.difficulty}</p>
        <div class="card-actions">
          <button class="select-dish" type="button">${selected ? "从菜单移除" : "选进明日菜单"}</button>
          <button class="quick-heart${rating ? " is-rated" : ""}" type="button" aria-label="${rating ? "取消喜欢" : "喜欢"}${dish.name}" aria-pressed="${Boolean(rating)}">♥</button>
        </div>
      </div>`;
    card.querySelector(".dish-image-button").addEventListener("click", () => openDetail(dish.id));
    card.querySelector(".select-dish").addEventListener("click", () => toggleSelection(dish.id));
    card.querySelector(".quick-heart").addEventListener("click", () => setRating(dish.id, rating ? 0 : 3));
    return card;
  }

  function toggleSelection(id) {
    if (state.selectedIds.includes(id)) {
      state.selectedIds = state.selectedIds.filter((item) => item !== id);
    } else {
      const max = Number(state.data.maxSelections) || 6;
      if (state.selectedIds.length >= max) {
        showToast(`一次最多选 ${max} 道，先去掉一道再选`);
        return;
      }
      state.selectedIds.push(id);
      showToast(`${dishById(id).name} 已加入明日菜单`);
    }
    saveState();
    renderFeatured();
    renderDishes();
    renderOrderState();
    if (state.detailId === id) updateDetailSelectButton();
  }

  function setRating(id, value) {
    state.hearts[id] = value;
    saveState();
    renderDishes();
    if (state.detailId === id) renderDetailRating(id);
    if (value) showToast("已经记下这道喜欢的菜");
  }

  function openDetail(id, { updateUrl = true } = {}) {
    const dish = dishById(id);
    if (!dish) return;
    state.detailId = dish.id;
    dom.detailImage.src = dish.image;
    dom.detailImage.alt = dish.name;
    dom.detailTitle.textContent = dish.name;
    dom.detailSummary.textContent = dish.summary;
    dom.detailDuration.textContent = dish.duration;
    dom.detailDifficulty.textContent = dish.difficulty;
    dom.detailAudience.textContent = dish.audience;
    dom.detailTip.textContent = dish.tip;
    dom.detailTags.replaceChildren(
      createBadge(dish.cuisine || dish.category),
      createBadge(dish.audience, true),
    );
    fillList(dom.detailIngredients, dish.ingredients);
    fillList(dom.detailSteps, dish.steps);
    renderDetailRating(dish.id);
    updateDetailSelectButton();
    dom.detailBackdrop.hidden = false;
    document.body.classList.add("modal-open");
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("dish", String(dish.id));
      history.replaceState(null, "", url);
    }
    window.setTimeout(() => dom.detailBackdrop.querySelector("[data-close-detail]")?.focus(), 50);
  }

  function createBadge(text, secondary = false) {
    const span = document.createElement("span");
    span.className = `detail-badge${secondary ? " secondary" : ""}`;
    span.textContent = text;
    return span;
  }

  function fillList(container, values) {
    container.replaceChildren();
    values.forEach((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      container.append(item);
    });
  }

  function renderDetailRating(id) {
    dom.detailRating.replaceChildren();
    const rating = Number(state.hearts[id] || 0);
    [1, 2, 3].forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "♥";
      button.className = value <= rating ? "is-active" : "";
      button.setAttribute("aria-label", `${value}颗红心`);
      button.setAttribute("aria-pressed", String(value <= rating));
      button.addEventListener("click", () => setRating(id, rating === value ? 0 : value));
      dom.detailRating.append(button);
    });
  }

  function updateDetailSelectButton() {
    const selected = state.selectedIds.includes(state.detailId);
    dom.detailSelectButton.textContent = selected ? "从明日菜单移除" : "选进明日菜单";
    dom.detailSelectButton.classList.toggle("is-selected", selected);
  }

  function closeDetail({ updateUrl = true } = {}) {
    dom.detailBackdrop.hidden = true;
    document.body.classList.remove("modal-open");
    state.detailId = null;
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.delete("dish");
      history.replaceState(null, "", url);
    }
  }

  function openDishFromUrl() {
    if (state.detailId || !state.data) return;
    const id = Number(new URL(window.location.href).searchParams.get("dish"));
    if (id && dishById(id)) openDetail(id, { updateUrl: false });
  }

  function renderOrderState() {
    const selected = selectedDishes();
    document.querySelectorAll("[data-order-count]").forEach((element) => {
      element.textContent = String(selected.length);
    });
    dom.orderDock.hidden = selected.length === 0;
    dom.orderDockNames.textContent = selected.length
      ? `${selected.slice(0, 3).map((dish) => dish.name).join("、")}${selected.length > 3 ? "…" : ""}`
      : "再选一道喜欢的菜吧";

    dom.selectedList.replaceChildren();
    selected.forEach((dish) => {
      const item = document.createElement("div");
      item.className = "selected-item";
      item.innerHTML = `
        <img src="${dish.image}" alt="" width="900" height="900">
        <p><strong>${dish.name}</strong><small>${dish.cuisine ? `${dish.cuisine} · ` : ""}${dish.category} · ${dish.audience}</small></p>
        <button type="button" aria-label="移除${dish.name}">×</button>`;
      item.querySelector("img").addEventListener("click", () => {
        closeOrder();
        openDetail(dish.id);
      });
      item.querySelector("button").addEventListener("click", () => toggleSelection(dish.id));
      dom.selectedList.append(item);
    });
    dom.orderEmpty.hidden = selected.length > 0;
    dom.selectedList.hidden = selected.length === 0;
    dom.balanceCard.hidden = selected.length === 0;
    dom.copyOrderButton.disabled = selected.length === 0;
    dom.clearOrderButton.disabled = selected.length === 0;
    renderBalance(selected);
  }

  function renderBalance(selected) {
    const hasStaple = selected.some((dish) => /主食|早餐/.test(dish.category));
    const hasVegetable = selected.some((dish) => /蔬菜/.test(dish.category));
    const hasSoup = selected.some((dish) => /汤|羹|瓦罐|温补/.test(dish.category));
    const hasProtein = selected.some((dish) => /猪肉|排骨|牛肉|羊肉|鸡肉|鸭肉|鱼虾|海鲜|鸡蛋|豆腐/.test(dish.category));
    const score = [hasStaple, hasProtein, hasVegetable, hasSoup].filter(Boolean).length * 25;
    dom.balanceProgress.style.width = `${score}%`;
    const missing = [];
    if (!hasStaple) missing.push("主食");
    if (!hasProtein) missing.push("主菜");
    if (!hasVegetable) missing.push("蔬菜");
    if (!hasSoup) missing.push("汤");
    dom.balanceText.textContent = score === 100
      ? "主食、主菜、蔬菜和汤都齐了，可以开饭。"
      : `已经完成 ${score}%${missing.length ? `，还可以补：${missing.join("、")}` : ""}`;
  }

  function openOrder() {
    renderOrderState();
    dom.orderBackdrop.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeOrder() {
    dom.orderBackdrop.hidden = true;
    document.body.classList.remove("modal-open");
  }

  async function copyOrder() {
    const selected = selectedDishes();
    if (!selected.length) return;
    const text = [
      "FAMILY FLAVOR｜明日家庭菜单",
      "",
      ...selected.map((dish) => `• ${dish.name}（${dish.category}）`),
      "",
      "一起选，一起吃，一起记住家的味道。",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      showToast("明日菜单已复制，可以发到家庭群");
    } catch {
      showToast("复制失败，请长按菜单文字复制");
    }
  }

  function resetFilters() {
    state.category = "全部";
    state.cuisine = "全部风味";
    state.query = "";
    state.childOnly = false;
    state.ratedOnly = false;
    saveState();
    renderFilters();
    renderDishes();
  }

  function showToast(message) {
    window.clearTimeout(state.toastTimer);
    dom.toast.textContent = message;
    dom.toast.hidden = false;
    state.toastTimer = window.setTimeout(() => {
      dom.toast.hidden = true;
    }, 2200);
  }

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.navigator.standalone === true;
  }

  function detectInstallTab() {
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (ios) return "ios";
    if (/HUAWEI|HarmonyOS|HuaweiBrowser/i.test(ua)) return "huawei";
    return "android";
  }

  function selectInstallTab(tab) {
    state.installTab = tab;
    document.querySelectorAll("[data-install-tab]").forEach((button) => {
      const active = button.dataset.installTab === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-install-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.installPanel !== tab;
    });
  }

  function openInstallGuide() {
    if (isStandalone()) {
      showToast("家味点菜已经安装在桌面了");
      return;
    }
    selectInstallTab(detectInstallTab());
    dom.nativeInstallButton.hidden = !state.deferredPrompt;
    dom.installGuideModal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeInstallGuide() {
    dom.installGuideModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  async function promptInstall() {
    if (!state.deferredPrompt) {
      openInstallGuide();
      return;
    }
    const prompt = state.deferredPrompt;
    state.deferredPrompt = null;
    await prompt.prompt();
    const result = await prompt.userChoice.catch(() => ({ outcome: "dismissed" }));
    if (result.outcome === "accepted") closeInstallGuide();
  }

  function bindEvents() {
    dom.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      dom.clearSearchButton.hidden = !state.query;
      renderDishes();
    });
    dom.clearSearchButton.addEventListener("click", () => {
      state.query = "";
      renderFilters();
      renderDishes();
      dom.searchInput.focus();
    });
    dom.childFriendlyButton.addEventListener("click", () => {
      state.childOnly = !state.childOnly;
      saveState();
      renderFilters();
      renderDishes();
    });
    dom.ratedButton.addEventListener("click", () => {
      state.ratedOnly = !state.ratedOnly;
      renderFilters();
      renderDishes();
    });
    dom.resetFiltersButton.addEventListener("click", resetFilters);
    dom.syncButton.addEventListener("click", () => fetchMenu({ announce: true }));
    document.querySelectorAll("[data-open-order]").forEach((button) => button.addEventListener("click", openOrder));
    document.querySelectorAll("[data-close-order]").forEach((button) => button.addEventListener("click", closeOrder));
    document.querySelectorAll("[data-close-detail]").forEach((button) => button.addEventListener("click", closeDetail));
    dom.detailSelectButton.addEventListener("click", () => toggleSelection(state.detailId));
    dom.copyOrderButton.addEventListener("click", copyOrder);
    dom.clearOrderButton.addEventListener("click", () => {
      state.selectedIds = [];
      saveState();
      renderFeatured();
      renderDishes();
      renderOrderState();
      showToast("明日菜单已清空");
    });
    dom.detailBackdrop.addEventListener("mousedown", (event) => {
      if (event.target === dom.detailBackdrop) closeDetail();
    });
    dom.orderBackdrop.addEventListener("mousedown", (event) => {
      if (event.target === dom.orderBackdrop) closeOrder();
    });
    dom.installGuideModal.addEventListener("mousedown", (event) => {
      if (event.target === dom.installGuideModal) closeInstallGuide();
    });
    dom.installAppButton.addEventListener("click", openInstallGuide);
    dom.mobileInstallButton.addEventListener("click", openInstallGuide);
    dom.closeInstallGuideButton.addEventListener("click", closeInstallGuide);
    dom.nativeInstallButton.addEventListener("click", promptInstall);
    document.querySelectorAll("[data-install-tab]").forEach((button) => {
      button.addEventListener("click", () => selectInstallTab(button.dataset.installTab));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!dom.detailBackdrop.hidden) closeDetail();
      else if (!dom.orderBackdrop.hidden) closeOrder();
      else if (!dom.installGuideModal.hidden) closeInstallGuide();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") fetchMenu();
    });
    window.addEventListener("online", () => fetchMenu({ announce: true }));
    window.addEventListener("popstate", openDishFromUrl);
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      state.deferredPrompt = event;
      dom.nativeInstallButton.hidden = false;
    });
    window.addEventListener("appinstalled", () => {
      state.deferredPrompt = null;
      closeInstallGuide();
      showToast("家味点菜已经添加到桌面");
    });
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", { scope: "./" });
      registration.update();
    } catch (error) {
      console.warn("Service worker registration failed", error);
    }
  }

  restoreFilters();
  bindEvents();
  registerServiceWorker();
  fetchMenu();
})();
