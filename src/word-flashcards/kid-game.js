(() => {
  "use strict";

  const GAME_STORAGE_KEY = "word-flashcards-kid-game-v1";
  const TRAVEL_DURATION_MS = 5 * 60 * 1000;

  const pets = [
    { id: "rabbit", name: "软糖兔", image: "assets/pets/rabbit.webp" },
    { id: "dino", name: "芽芽龙", image: "assets/pets/dino.webp" },
    { id: "kitten", name: "奶油猫", image: "assets/pets/kitten.webp" },
    { id: "capybara", name: "卡皮巴拉", image: "assets/pets/capybara.webp" },
    { id: "sadcat", name: "心心猫", image: "assets/pets/sadcat.webp" },
    { id: "puppy", name: "团团狗", image: "assets/pets/puppy.webp" },
    { id: "hamster", name: "栗子仓鼠", image: "assets/pets/hamster.webp" },
    { id: "parrot", name: "彩虹鹦鹉", image: "assets/pets/parrot.webp" },
    { id: "snake", name: "青团小蛇", image: "assets/pets/snake.webp" }
  ];

  const shopItems = [
    { id: "bow", type: "clothes", name: "草莓蝴蝶结", icon: "🎀", price: 2 },
    { id: "cap", type: "clothes", name: "探险小帽", icon: "🧢", price: 3 },
    { id: "scarf", type: "clothes", name: "暖暖围巾", icon: "🧣", price: 3 },
    { id: "crown", type: "clothes", name: "星星皇冠", icon: "👑", price: 5 },
    { id: "apple", type: "food", name: "脆脆苹果", icon: "🍎", price: 1, friendship: 1 },
    { id: "carrot", type: "food", name: "甜甜胡萝卜", icon: "🥕", price: 1, friendship: 1 },
    { id: "berry", type: "food", name: "莓果小碗", icon: "🍓", price: 2, friendship: 2 },
    { id: "cake", type: "food", name: "庆祝蛋糕", icon: "🧁", price: 3, friendship: 3 },
    { id: "plant", type: "furniture", name: "窗边绿植", icon: "🪴", price: 2 },
    { id: "cushion", type: "furniture", name: "软软坐垫", icon: "🛋️", price: 3 },
    { id: "lamp", type: "furniture", name: "月亮小灯", icon: "💡", price: 3 },
    { id: "bookshelf", type: "furniture", name: "故事书架", icon: "📚", price: 4 }
  ];

  const destinations = [
    { id: "snow", name: "云朵雪山", icon: "🏔️", color: "#dceef7" },
    { id: "island", name: "蓝莓海岛", icon: "🏝️", color: "#dff5ed" },
    { id: "forest", name: "萤火森林", icon: "🌲", color: "#e3f1d5" },
    { id: "city", name: "星光小城", icon: "🌃", color: "#e7e2f6" },
    { id: "desert", name: "布丁沙漠", icon: "🏜️", color: "#f7e8c3" },
    { id: "lake", name: "镜子湖", icon: "🛶", color: "#dcecf4" },
    { id: "garden", name: "糖果花园", icon: "🌷", color: "#f8e0e7" },
    { id: "space", name: "月亮车站", icon: "🚀", color: "#dfe4f7" }
  ];

  const $ = (id) => document.getElementById(id);
  const dom = {
    app: $("kidApp"),
    greeting: $("kidGreeting"),
    points: $("kidPoints"),
    cookies: $("kidCookies"),
    pointsPocket: $("pointsPocket"),
    parentButton: $("parentButton"),
    homeButton: $("kidHomeButton"),
    homePet: $("homePetImage"),
    homeAccessory: $("homePetAccessory"),
    roomFurniture: $("roomFurniture"),
    petSpeech: $("petSpeech"),
    roomLock: $("roomLock"),
    roomLockText: $("roomLockText"),
    changePetButton: $("changePetButton"),
    missionDate: $("missionDate"),
    missionDone: $("missionDone"),
    missionTotal: $("missionTotal"),
    missionTitle: $("missionTitle"),
    missionSummary: $("missionSummary"),
    missionProgressBar: $("missionProgressBar"),
    startMissionButton: $("startMissionButton"),
    startMissionText: $("startMissionText"),
    openTodayReportButton: $("openTodayReportButton"),
    homeTravelHint: $("homeTravelHint"),
    homePostcardHint: $("homePostcardHint"),
    leaveMissionButton: $("leaveMissionButton"),
    sessionProgressText: $("sessionProgressText"),
    sessionProgressBar: $("sessionProgressBar"),
    sessionScore: $("sessionScore"),
    dictationPet: $("dictationPetImage"),
    dictationAccessory: $("dictationPetAccessory"),
    dictationPetText: $("dictationPetText"),
    dictationMeaning: $("dictationMeaning"),
    dictationInput: $("dictationInput"),
    dictationFeedback: $("dictationFeedback"),
    speakWordButton: $("speakWordButton"),
    submitDictationButton: $("submitDictationButton"),
    revealDictationButton: $("revealDictationButton"),
    swipeNextButton: $("swipeNextButton"),
    dictationBoard: document.querySelector(".dictation-board"),
    revealedAnswer: $("revealedAnswer"),
    revealedWord: $("revealedWord"),
    shopPet: $("shopPetImage"),
    shopAccessory: $("shopPetAccessory"),
    shopFurniture: $("shopRoomFurniture"),
    friendshipBar: $("friendshipBar"),
    friendshipValue: $("friendshipValue"),
    shopGrid: $("shopGrid"),
    chooseAnotherPetButton: $("chooseAnotherPetButton"),
    travelPet: $("travelPetImage"),
    travelPetWrap: $("travelPetWrap"),
    travelIdle: $("travelIdle"),
    travelActive: $("travelActive"),
    travelDestination: $("travelDestination"),
    travelCountdown: $("travelCountdown"),
    startTravelButton: $("startTravelButton"),
    claimPostcardButton: $("claimPostcardButton"),
    totalDictationsStat: $("totalDictationsStat"),
    firstTryStat: $("firstTryStat"),
    revealedStat: $("revealedStat"),
    postcardLevelStat: $("postcardLevelStat"),
    dailyIncomeStat: $("dailyIncomeStat"),
    postcardIncomeCopy: $("postcardIncomeCopy"),
    postcardCount: $("postcardCount"),
    postcardGrid: $("postcardGrid"),
    historyList: $("historyList"),
    openNotebookFromKidButton: $("openNotebookFromKidButton"),
    petPickerModal: $("petPickerModal"),
    petPickerGrid: $("petPickerGrid"),
    petNameInput: $("petNameInput"),
    confirmPetButton: $("confirmPetButton"),
    closePetPickerButton: $("closePetPickerButton"),
    parentModal: $("parentModal"),
    closeParentButton: $("closeParentButton"),
    dailyTargetInput: $("dailyTargetInput"),
    targetMinusButton: $("targetMinusButton"),
    targetPlusButton: $("targetPlusButton"),
    taskModeControl: $("taskModeControl"),
    taskPreviewText: $("taskPreviewText"),
    saveTaskButton: $("saveTaskButton"),
    parentEditLibraryButton: $("parentEditLibraryButton"),
    openLegacyCardsButton: $("openLegacyCardsButton"),
    parentReportStatus: $("parentReportStatus"),
    parentCompletedStat: $("parentCompletedStat"),
    parentFirstTryStat: $("parentFirstTryStat"),
    parentHelpStat: $("parentHelpStat"),
    parentRecords: $("parentRecords"),
    todayReportModal: $("todayReportModal"),
    todayReportList: $("todayReportList"),
    closeTodayReportButton: $("closeTodayReportButton"),
    missionCompleteModal: $("missionCompleteModal"),
    rewardPetImage: $("rewardPetImage"),
    rewardSummary: $("rewardSummary"),
    rewardPoints: $("rewardPoints"),
    rewardCookies: $("rewardCookies"),
    unlockRoomButton: $("unlockRoomButton"),
    legacyReturn: $("legacyReturn"),
    returnToKidButton: $("returnToKidButton"),
    toast: $("kidToast")
  };

  let state = loadState();
  let currentScreen = "home";
  let selectedPetDraft = state.selectedPet || null;
  let selectedTaskMode = state.taskConfig.mode;
  let activeShopTab = "clothes";
  let isAdvancing = false;
  let travelTimer = null;
  let toastTimer = null;
  let swipeStartX = null;
  let swipeOffsetX = 0;

  function getWordBank() {
    if (typeof words !== "undefined" && Array.isArray(words)) {
      return words;
    }
    return [];
  }

  function createDefaultState() {
    return {
      selectedPet: null,
      petName: "",
      points: 0,
      cookies: 0,
      totalDictations: 0,
      friendship: 0,
      ownedItems: [],
      equipped: { clothes: null, furniture: null },
      taskConfig: { count: 10, mode: "sequential" },
      daily: null,
      records: [],
      postcards: [],
      travel: null,
      lastPassiveDate: null
    };
  }

  function normalizeState(saved) {
    const base = createDefaultState();
    if (!saved || typeof saved !== "object") {
      return base;
    }
    return {
      ...base,
      ...saved,
      points: Math.max(0, Number(saved.points) || 0),
      cookies: Math.max(0, Number(saved.cookies) || 0),
      totalDictations: Math.max(0, Number(saved.totalDictations) || 0),
      friendship: Math.max(0, Number(saved.friendship) || 0),
      ownedItems: Array.isArray(saved.ownedItems) ? saved.ownedItems : [],
      postcards: Array.isArray(saved.postcards) ? saved.postcards : [],
      records: Array.isArray(saved.records) ? saved.records.slice(-500) : [],
      taskConfig: { ...base.taskConfig, ...(saved.taskConfig || {}) },
      equipped: { ...base.equipped, ...(saved.equipped || {}) }
    };
  }

  function loadState() {
    try {
      return normalizeState(JSON.parse(localStorage.getItem(GAME_STORAGE_KEY) || "null"));
    } catch {
      return createDefaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(state));
    } catch {
      showToast("当前浏览器没有保存进度，请不要关闭页面。", true);
    }
  }

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatToday() {
    return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date());
  }

  function shuffle(list) {
    const copy = [...list];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function getPet() {
    return pets.find((pet) => pet.id === state.selectedPet) || pets[0];
  }

  function getItem(itemId) {
    return shopItems.find((item) => item.id === itemId) || null;
  }

  function getWordById(wordId) {
    return getWordBank().find((entry) => entry.id === wordId) || null;
  }

  function getCurrentDailyWord() {
    if (!state.daily || state.daily.current >= state.daily.wordIds.length) {
      return null;
    }
    return getWordById(state.daily.wordIds[state.daily.current]);
  }

  function getMistakeIds() {
    const favoriteIds = typeof favorites !== "undefined" && favorites instanceof Set ? [...favorites] : [];
    const recordIds = state.records.filter((record) => !record.firstTry).map((record) => record.wordId);
    return [...new Set([...favoriteIds, ...recordIds])];
  }

  function makeTaskWordIds(count, mode) {
    const bank = getWordBank();
    const actualCount = Math.max(1, Math.min(Number(count) || 10, bank.length || 1));
    if (mode === "random") {
      return shuffle(bank.map((entry) => entry.id)).slice(0, actualCount);
    }
    if (mode === "mistakes") {
      const mistakes = getMistakeIds().filter((id) => bank.some((entry) => entry.id === id));
      const otherIds = bank.map((entry) => entry.id).filter((id) => !mistakes.includes(id));
      return [...mistakes, ...otherIds].slice(0, actualCount);
    }
    return bank.slice(0, actualCount).map((entry) => entry.id);
  }

  function createDailyTask(force = false) {
    const today = localDateKey();
    const bank = getWordBank();
    if (!bank.length) {
      return;
    }
    const dailyIsUsable = state.daily && state.daily.date === today && Array.isArray(state.daily.wordIds) && state.daily.wordIds.length > 0;
    if (dailyIsUsable && !force) {
      const validIds = state.daily.wordIds.filter((id) => getWordById(id));
      if (validIds.length === state.daily.wordIds.length) {
        return;
      }
    }
    const wordIds = makeTaskWordIds(state.taskConfig.count, state.taskConfig.mode);
    state.daily = {
      date: today,
      wordIds,
      current: 0,
      records: [],
      activeAttempt: { wrongAttempts: 0, revealed: false, startedAt: null },
      startedAt: null,
      finishedAt: null,
      finished: false,
      pointsEarned: 0,
      cookiesEarned: 0
    };
    saveState();
  }

  function ensureToday() {
    createDailyTask(false);
    if (!state.daily.activeAttempt) {
      state.daily.activeAttempt = { wrongAttempts: 0, revealed: false, startedAt: null };
    }
  }

  function getPostcardLevel() {
    const count = state.postcards.length;
    if (count >= 15) return 5;
    if (count >= 10) return 4;
    if (count >= 6) return 3;
    if (count >= 3) return 2;
    if (count >= 1) return 1;
    return 0;
  }

  function grantDailyIncome() {
    const today = localDateKey();
    const level = getPostcardLevel();
    if (level === 0 || state.lastPassiveDate === today) {
      return;
    }
    state.points += level;
    state.lastPassiveDate = today;
    saveState();
    window.setTimeout(() => showToast(`明信片送来今日积分：+${level} ★`), 550);
  }

  function showToast(message, isError = false) {
    window.clearTimeout(toastTimer);
    dom.toast.textContent = message;
    dom.toast.style.background = isError ? "#e66a57" : "#4d86b8";
    dom.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => dom.toast.classList.remove("is-visible"), 2300);
  }

  function playTone(kind) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = kind === "right" ? 660 : 230;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.22);
      oscillator.addEventListener("ended", () => context.close());
    } catch {
      // Sound is a small reward; the learning flow should continue without it.
    }
  }

  function animatePocket() {
    dom.pointsPocket.animate(
      [
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-5px) scale(1.08)" },
        { transform: "translateY(0) scale(1)" }
      ],
      { duration: 420, easing: "ease-out" }
    );
  }

  function navigate(screen, options = {}) {
    const lockedFeature = screen === "pet" || screen === "travel";
    if (lockedFeature && (!state.daily || !state.daily.finished) && !options.ignoreLock) {
      showToast("先完成今天的听写，小屋和旅行就会解锁。", true);
      screen = "home";
    }
    currentScreen = screen;
    dom.app.classList.toggle("is-dictating", screen === "dictation");
    document.querySelectorAll(".kid-screen").forEach((section) => {
      section.classList.toggle("is-active", section.dataset.screen === screen);
    });
    document.querySelectorAll("[data-nav]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.nav === screen);
    });
    dom.app.querySelector(".kid-main").scrollTop = 0;
    if (screen === "dictation") renderDictation();
    if (screen === "pet") renderShop();
    if (screen === "travel") renderTravel();
    if (screen === "growth") renderGrowth();
  }

  function renderPetEverywhere() {
    const pet = getPet();
    const accessory = getItem(state.equipped.clothes);
    const furniture = getItem(state.equipped.furniture);
    [dom.homePet, dom.dictationPet, dom.shopPet, dom.travelPet, dom.rewardPetImage].forEach((image) => {
      image.src = pet.image;
      image.alt = state.petName ? `${state.petName}，${pet.name}` : pet.name;
    });
    [dom.homeAccessory, dom.dictationAccessory, dom.shopAccessory].forEach((element) => {
      element.textContent = accessory ? accessory.icon : "";
    });
    [dom.roomFurniture, dom.shopFurniture].forEach((element) => {
      element.textContent = furniture ? furniture.icon : "";
    });
    const name = state.petName || pet.name;
    dom.greeting.textContent = `${name} 正等着和你一起完成挑战`;
    dom.petSpeech.textContent = state.daily && state.daily.finished ? `${name}：今天可以一起玩啦！` : `${name}：我陪你学完，再一起去玩！`;
  }

  function renderHome() {
    ensureToday();
    const total = state.daily.wordIds.length;
    const done = state.daily.records.length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    dom.missionDate.textContent = formatToday();
    dom.missionDone.textContent = String(done);
    dom.missionTotal.textContent = `/ ${total}`;
    dom.missionProgressBar.style.width = `${percent}%`;
    dom.points.textContent = String(state.points);
    dom.cookies.textContent = String(state.cookies);
    dom.roomLock.hidden = Boolean(state.daily.finished);
    dom.roomLockText.textContent = `还差 ${Math.max(0, total - done)} 个单词`;

    if (state.daily.finished) {
      dom.missionTitle.textContent = "今天已经认真完成";
      dom.missionSummary.textContent = `${total} 个词都收进口袋啦，去找伙伴玩吧。`;
      dom.startMissionText.textContent = "去小屋找伙伴玩";
    } else if (done > 0) {
      dom.missionTitle.textContent = `还剩 ${total - done} 个，很快就完成`;
      dom.missionSummary.textContent = `已经学会 ${done} 个，进度会一直替你保存。`;
      dom.startMissionText.textContent = `继续第 ${done + 1} 个词`;
    } else {
      dom.missionTitle.textContent = `${total} 个词，约 ${Math.max(3, Math.ceil(total / 2))} 分钟`;
      dom.missionSummary.textContent = "一次只学一个，写错也不用着急。";
      dom.startMissionText.textContent = "开始学习";
    }

    dom.homeTravelHint.textContent = state.travel ? "小伙伴正在旅行，回来会带明信片" : "用小饼干换一张明信片";
    dom.homePostcardHint.textContent = state.postcards.length ? `${state.postcards.length} 张明信片，每天 +${getPostcardLevel()} 积分` : "还没有明信片";
    renderPetEverywhere();
  }

  function startOrResumeMission() {
    ensureToday();
    if (state.daily.finished) {
      navigate("pet");
      return;
    }
    if (!state.daily.startedAt) {
      state.daily.startedAt = Date.now();
    }
    if (!state.daily.activeAttempt.startedAt) {
      state.daily.activeAttempt.startedAt = Date.now();
    }
    saveState();
    navigate("dictation");
    if (window.innerWidth > 620) {
      window.setTimeout(() => dom.dictationInput.focus(), 150);
    }
  }

  function resetDictationFields() {
    dom.dictationInput.value = "";
    dom.dictationInput.classList.remove("is-wrong", "is-right");
    dom.dictationFeedback.textContent = "";
    dom.dictationFeedback.classList.remove("is-wrong", "is-right");
    dom.revealedAnswer.hidden = true;
    dom.revealedWord.textContent = "";
    dom.submitDictationButton.disabled = false;
    dom.revealDictationButton.disabled = false;
    dom.speakWordButton.disabled = false;
    dom.swipeNextButton.hidden = true;
    dom.dictationBoard.classList.remove("is-swipe-ready", "is-leaving");
    dom.dictationBoard.style.removeProperty("--swipe-x");
    swipeStartX = null;
    swipeOffsetX = 0;
    isAdvancing = false;
  }

  function renderDictation() {
    ensureToday();
    const entry = getCurrentDailyWord();
    if (!entry) {
      if (state.daily.finished) {
        navigate("home");
      }
      return;
    }
    const current = state.daily.current;
    const total = state.daily.wordIds.length;
    dom.sessionProgressText.textContent = `第 ${current + 1} 个，共 ${total} 个`;
    dom.sessionProgressBar.style.width = `${Math.round((current / total) * 100)}%`;
    dom.sessionScore.textContent = `★ ${state.daily.pointsEarned}`;
    dom.dictationMeaning.textContent = entry.meaning;
    dom.dictationPetText.textContent = state.daily.activeAttempt.revealed ? "看过答案也没关系，现在自己写对它。" : "慢慢想，我会一直陪着你。";
    resetDictationFields();
    if (state.daily.activeAttempt.revealed) {
      dom.revealedAnswer.hidden = false;
      dom.revealedWord.textContent = entry.word;
    }
  }

  function normalizeKidAnswer(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
  }

  function kidAnswersMatch(input, target) {
    const normalizedInput = normalizeKidAnswer(input);
    const normalizedTarget = normalizeKidAnswer(target);
    return normalizedInput === normalizedTarget || normalizedInput.replace(/\s/g, "") === normalizedTarget.replace(/\s/g, "");
  }

  function markCurrentAsMistake(entry) {
    if (typeof addToNotebook === "function") {
      addToNotebook(entry);
    }
  }

  function submitDictation() {
    if (isAdvancing) return;
    const entry = getCurrentDailyWord();
    if (!entry) return;
    const answer = dom.dictationInput.value.trim();
    if (!answer) {
      dom.dictationFeedback.textContent = "先把你想到的拼法写下来。";
      dom.dictationFeedback.className = "dictation-feedback is-wrong";
      dom.dictationInput.focus();
      return;
    }

    if (!kidAnswersMatch(answer, entry.word)) {
      state.daily.activeAttempt.wrongAttempts += 1;
      markCurrentAsMistake(entry);
      saveState();
      dom.dictationInput.classList.add("is-wrong");
      dom.dictationFeedback.textContent = "这次还没写对，记录下来了。再试一次吧。";
      dom.dictationFeedback.className = "dictation-feedback is-wrong";
      dom.dictationPetText.textContent = "不会没关系，认真再想一次就好。";
      playTone("wrong");
      dom.dictationInput.select();
      return;
    }

    isAdvancing = true;
    dom.submitDictationButton.disabled = true;
    dom.revealDictationButton.disabled = true;
    dom.speakWordButton.disabled = true;
    dom.dictationInput.classList.remove("is-wrong");
    dom.dictationInput.classList.add("is-right");
    const attempt = state.daily.activeAttempt;
    const record = {
      id: `${Date.now()}-${entry.id}`,
      date: localDateKey(),
      wordId: entry.id,
      word: entry.word,
      meaning: entry.meaning,
      firstTry: attempt.wrongAttempts === 0 && !attempt.revealed,
      wrongAttempts: attempt.wrongAttempts,
      revealed: Boolean(attempt.revealed),
      completedAt: Date.now(),
      durationSeconds: Math.max(1, Math.round((Date.now() - (attempt.startedAt || Date.now())) / 1000))
    };
    state.daily.records.push(record);
    state.records.push(record);
    state.records = state.records.slice(-500);
    state.daily.current += 1;
    state.daily.pointsEarned += 1;
    state.points += 1;
    state.totalDictations += 1;
    let cookieAwarded = false;
    if (state.totalDictations % 10 === 0) {
      state.cookies += 1;
      state.daily.cookiesEarned += 1;
      cookieAwarded = true;
    }
    state.daily.activeAttempt = { wrongAttempts: 0, revealed: false, startedAt: Date.now() };
    saveState();
    dom.dictationFeedback.textContent = record.firstTry ? "一次写对！积分装进口袋啦。" : "重新写对了，这才算真正完成。";
    dom.dictationFeedback.className = "dictation-feedback is-right";
    dom.dictationPetText.textContent = cookieAwarded ? "十次听写完成！还得到一块小饼干。" : "认真写对了，继续保持！";
    dom.swipeNextButton.hidden = false;
    dom.dictationBoard.classList.add("is-swipe-ready");
    dom.sessionProgressBar.style.width = `${Math.round((state.daily.current / state.daily.wordIds.length) * 100)}%`;
    dom.sessionProgressText.textContent = `已完成 ${state.daily.current} / ${state.daily.wordIds.length}`;
    dom.sessionScore.textContent = `★ ${state.daily.pointsEarned}`;
    playTone("right");
    animatePocket();
  }

  function advanceFromCompletedCard() {
    if (!isAdvancing) return;
    dom.dictationBoard.classList.add("is-leaving");
    window.setTimeout(() => {
      if (state.daily.current >= state.daily.wordIds.length) {
        finishMission();
      } else {
        renderDictation();
        if (window.innerWidth > 620) {
          dom.dictationInput.focus();
        }
      }
    }, 260);
  }

  function beginCardSwipe(event) {
    if (!isAdvancing || !dom.dictationBoard.classList.contains("is-swipe-ready")) return;
    swipeStartX = event.clientX;
    swipeOffsetX = 0;
    dom.dictationBoard.setPointerCapture?.(event.pointerId);
  }

  function moveCardSwipe(event) {
    if (swipeStartX === null) return;
    swipeOffsetX = Math.min(0, event.clientX - swipeStartX);
    dom.dictationBoard.style.setProperty("--swipe-x", `${swipeOffsetX}px`);
  }

  function endCardSwipe() {
    if (swipeStartX === null) return;
    const shouldAdvance = swipeOffsetX < -70;
    swipeStartX = null;
    if (shouldAdvance) {
      advanceFromCompletedCard();
    } else {
      swipeOffsetX = 0;
      dom.dictationBoard.style.setProperty("--swipe-x", "0px");
    }
  }

  function revealDictationAnswer() {
    const entry = getCurrentDailyWord();
    if (!entry || isAdvancing) return;
    state.daily.activeAttempt.revealed = true;
    markCurrentAsMistake(entry);
    saveState();
    dom.revealedAnswer.hidden = false;
    dom.revealedWord.textContent = entry.word;
    dom.dictationInput.value = "";
    dom.dictationInput.classList.remove("is-wrong", "is-right");
    dom.dictationFeedback.textContent = "看答案已经记入记录。现在请自己重新拼写。";
    dom.dictationFeedback.className = "dictation-feedback is-wrong";
    dom.dictationPetText.textContent = "看清楚了吗？现在靠自己写一遍。";
    dom.dictationInput.focus();
  }

  function speakCurrentWord() {
    const entry = getCurrentDailyWord();
    if (!entry || !("speechSynthesis" in window)) {
      showToast("这台设备暂时不能播放读音。", true);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(entry.word);
    utterance.lang = "en-US";
    utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  }

  function finishMission() {
    state.daily.finished = true;
    state.daily.finishedAt = Date.now();
    saveState();
    renderHome();
    dom.rewardSummary.textContent = `${state.daily.wordIds.length} 个单词都已经认真拼完。`;
    dom.rewardPoints.textContent = `+${state.daily.pointsEarned} 积分`;
    dom.rewardCookies.textContent = `+${state.daily.cookiesEarned} 小饼干`;
    dom.missionCompleteModal.hidden = false;
    isAdvancing = false;
  }

  function renderPetPicker() {
    dom.petPickerGrid.replaceChildren();
    pets.forEach((pet) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pet-choice";
      button.classList.toggle("is-selected", selectedPetDraft === pet.id);
      button.innerHTML = `<img src="${pet.image}" alt=""><strong>${pet.name}</strong>`;
      button.addEventListener("click", () => {
        selectedPetDraft = pet.id;
        if (!dom.petNameInput.value.trim()) {
          dom.petNameInput.value = pet.name.replace(/兔|龙|猫|狗|仓鼠|鹦鹉|小蛇|卡皮巴拉/g, "") || pet.name;
        }
        dom.confirmPetButton.disabled = false;
        renderPetPicker();
      });
      dom.petPickerGrid.append(button);
    });
    dom.confirmPetButton.disabled = !selectedPetDraft;
    dom.closePetPickerButton.hidden = !state.selectedPet;
  }

  function openPetPicker() {
    selectedPetDraft = state.selectedPet || null;
    dom.petNameInput.value = state.petName || "";
    renderPetPicker();
    dom.petPickerModal.hidden = false;
  }

  function confirmPet() {
    if (!selectedPetDraft) return;
    state.selectedPet = selectedPetDraft;
    state.petName = dom.petNameInput.value.trim() || pets.find((pet) => pet.id === selectedPetDraft).name;
    saveState();
    dom.petPickerModal.hidden = true;
    renderAll();
    showToast(`${state.petName} 已经成为你的学习伙伴！`);
  }

  function renderShop() {
    renderPetEverywhere();
    const friendship = Math.min(100, state.friendship);
    dom.friendshipValue.textContent = String(state.friendship);
    dom.friendshipBar.style.width = `${friendship}%`;
    dom.shopGrid.replaceChildren();
    shopItems.filter((item) => item.type === activeShopTab).forEach((item) => {
      const owned = state.ownedItems.includes(item.id);
      const equipped = state.equipped[item.type] === item.id;
      const row = document.createElement("article");
      row.className = "shop-item";
      const actionText = item.type === "food" ? `喂给它 · ★${item.price}` : equipped ? "正在使用" : owned ? "使用" : `购买 · ★${item.price}`;
      row.innerHTML = `
        <span class="shop-item-icon" aria-hidden="true">${item.icon}</span>
        <div><strong>${item.name}</strong><small>${item.type === "food" ? `亲密值 +${item.friendship}` : owned ? "已经拥有" : "完成几个词就能带回家"}</small><button type="button" ${equipped ? "disabled" : ""} class="${owned ? "is-owned" : ""}">${actionText}</button></div>
      `;
      row.querySelector("button").addEventListener("click", () => useShopItem(item));
      dom.shopGrid.append(row);
    });
  }

  function useShopItem(item) {
    if (item.type === "food") {
      if (state.points < item.price) {
        showToast("积分还不够，再认真完成几个单词吧。", true);
        return;
      }
      state.points -= item.price;
      state.friendship += item.friendship;
      saveState();
      renderAll();
      showToast(`${state.petName || getPet().name} 吃得很开心，亲密值 +${item.friendship}`);
      return;
    }
    const alreadyOwned = state.ownedItems.includes(item.id);
    if (!alreadyOwned) {
      if (state.points < item.price) {
        showToast("积分还不够，再认真完成几个单词吧。", true);
        return;
      }
      state.points -= item.price;
      state.ownedItems.push(item.id);
    }
    state.equipped[item.type] = item.id;
    saveState();
    renderAll();
    showToast(alreadyOwned ? `已经换上${item.name}` : `买到${item.name}，马上用起来了！`);
  }

  function startTravel() {
    if (!state.daily || !state.daily.finished) {
      showToast("完成今日听写后，小伙伴才能出发。", true);
      return;
    }
    if (state.travel) {
      renderTravel();
      return;
    }
    if (state.cookies < 1) {
      showToast("还没有小饼干。每完成 10 次听写就会得到 1 块。", true);
      return;
    }
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    state.cookies -= 1;
    state.travel = {
      destinationId: destination.id,
      startedAt: Date.now(),
      endsAt: Date.now() + TRAVEL_DURATION_MS
    };
    saveState();
    renderAll();
    showToast(`${state.petName || getPet().name} 带着小饼干出发啦！`);
  }

  function renderTravel() {
    renderPetEverywhere();
    window.clearInterval(travelTimer);
    if (!state.travel) {
      dom.travelIdle.hidden = false;
      dom.travelActive.hidden = true;
      dom.travelPetWrap.classList.remove("is-traveling");
      dom.startTravelButton.disabled = state.cookies < 1;
      dom.startTravelButton.textContent = state.cookies < 1 ? "还需要 1 块小饼干" : "出发旅行 · 1 块饼干";
      return;
    }
    const destination = destinations.find((item) => item.id === state.travel.destinationId) || destinations[0];
    dom.travelIdle.hidden = true;
    dom.travelActive.hidden = false;
    dom.travelDestination.textContent = `正在前往${destination.name}`;
    dom.travelPetWrap.classList.add("is-traveling");
    updateTravelCountdown();
    travelTimer = window.setInterval(updateTravelCountdown, 1000);
  }

  function updateTravelCountdown() {
    if (!state.travel) return;
    const remaining = Math.max(0, state.travel.endsAt - Date.now());
    const totalSeconds = Math.ceil(remaining / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    dom.travelCountdown.textContent = remaining > 0 ? `${minutes}:${seconds} 后回来，关掉页面也会继续` : "小伙伴回来啦，快收下明信片！";
    dom.claimPostcardButton.disabled = remaining > 0;
    dom.claimPostcardButton.textContent = remaining > 0 ? "等小伙伴回来" : "收下明信片";
    if (remaining <= 0) {
      window.clearInterval(travelTimer);
    }
  }

  function claimPostcard() {
    if (!state.travel || state.travel.endsAt > Date.now()) return;
    const destination = destinations.find((item) => item.id === state.travel.destinationId) || destinations[0];
    const hadNoPostcards = state.postcards.length === 0;
    state.postcards.push({ id: `${Date.now()}-${destination.id}`, destinationId: destination.id, receivedAt: Date.now() });
    state.travel = null;
    if (hadNoPostcards) {
      state.lastPassiveDate = localDateKey();
    }
    saveState();
    renderAll();
    showToast(`收到来自${destination.name}的明信片！`);
  }

  function renderGrowth() {
    const firstTryCount = state.records.filter((record) => record.firstTry).length;
    const revealCount = state.records.filter((record) => record.revealed).length;
    const level = getPostcardLevel();
    dom.totalDictationsStat.textContent = String(state.totalDictations);
    dom.firstTryStat.textContent = String(firstTryCount);
    dom.revealedStat.textContent = String(revealCount);
    dom.postcardLevelStat.textContent = `Lv.${level}`;
    dom.dailyIncomeStat.textContent = `每天 +${level} 积分`;
    dom.postcardCount.textContent = `${state.postcards.length} 张`;
    dom.postcardIncomeCopy.textContent = level ? `当前等级每天会自动得到 ${level} 个积分，最高每天 5 个。` : "获得第一张后，每天都会有积分装进口袋。";
    renderPostcards();
    renderHistory();
  }

  function renderPostcards() {
    dom.postcardGrid.replaceChildren();
    if (!state.postcards.length) {
      const empty = document.createElement("div");
      empty.className = "empty-kid-state";
      empty.textContent = "还没有明信片。完成 10 次听写拿到小饼干，就能让伙伴去旅行。";
      dom.postcardGrid.append(empty);
      return;
    }
    const groups = new Map();
    state.postcards.forEach((card) => groups.set(card.destinationId, (groups.get(card.destinationId) || 0) + 1));
    groups.forEach((count, destinationId) => {
      const destination = destinations.find((item) => item.id === destinationId) || destinations[0];
      const card = document.createElement("article");
      card.className = "postcard-card";
      card.style.background = destination.color;
      card.innerHTML = `<span aria-hidden="true">${destination.icon}</span><strong>${destination.name}</strong><small>寄给 ${state.petName || "我的小伙伴"}</small><em>× ${count}</em>`;
      dom.postcardGrid.append(card);
    });
  }

  function recordStatusText(record) {
    if (record.firstTry) return "一次写对";
    if (record.revealed) return "看过答案后写对";
    return `写错 ${record.wrongAttempts} 次后写对`;
  }

  function createRecordRow(record, className = "history-row") {
    const row = document.createElement("div");
    row.className = className;
    const detailParts = [];
    if (record.wrongAttempts) detailParts.push(`错误 ${record.wrongAttempts} 次`);
    if (record.revealed) detailParts.push("看过答案");
    detailParts.push(`用时 ${record.durationSeconds || 1} 秒`);
    row.innerHTML = `
      <div class="record-word"><strong>${escapeHtml(record.word)}</strong><small>${escapeHtml(record.meaning || "")}</small></div>
      <div class="record-detail">${detailParts.join(" · ")}</div>
      <span class="record-badge ${record.firstTry ? "" : "needs-work"}">${recordStatusText(record)}</span>
    `;
    return row;
  }

  function renderHistory() {
    dom.historyList.replaceChildren();
    const latest = [...state.records].reverse().slice(0, 12);
    if (!latest.length) {
      const empty = document.createElement("div");
      empty.className = "empty-kid-state";
      empty.textContent = "完成第一组听写后，这里会出现每个词的真实记录。";
      dom.historyList.append(empty);
      return;
    }
    latest.forEach((record) => dom.historyList.append(createRecordRow(record)));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  }

  function openParent() {
    ensureToday();
    selectedTaskMode = state.taskConfig.mode;
    dom.dailyTargetInput.max = String(Math.min(30, getWordBank().length || 30));
    dom.dailyTargetInput.value = String(Math.min(state.taskConfig.count, getWordBank().length || state.taskConfig.count));
    updateTaskModeButtons();
    updateTaskPreview();
    renderParentReport();
    dom.parentModal.hidden = false;
  }

  function updateTaskModeButtons() {
    dom.taskModeControl.querySelectorAll("[data-task-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.taskMode === selectedTaskMode);
    });
  }

  function updateTaskPreview() {
    const count = Math.max(1, Math.min(Number(dom.dailyTargetInput.value) || 10, getWordBank().length || 1));
    const preview = makeTaskWordIds(count, selectedTaskMode).map(getWordById).filter(Boolean);
    dom.taskPreviewText.textContent = preview.map((entry) => entry.word).join("、") || "词库里还没有单词";
  }

  function adjustTarget(delta) {
    const max = Math.min(30, getWordBank().length || 30);
    dom.dailyTargetInput.value = String(Math.max(1, Math.min(max, (Number(dom.dailyTargetInput.value) || 10) + delta)));
    updateTaskPreview();
  }

  function saveTaskSettings() {
    const hadProgress = state.daily && state.daily.date === localDateKey() && state.daily.records.length > 0 && !state.daily.finished;
    if (hadProgress && !window.confirm("今天已经有听写记录。重新设置会重新开始今天的任务，原记录仍保留在成长足迹中。确定继续吗？")) {
      return;
    }
    state.taskConfig.count = Math.max(1, Math.min(Number(dom.dailyTargetInput.value) || 10, getWordBank().length || 1));
    state.taskConfig.mode = selectedTaskMode;
    createDailyTask(true);
    saveState();
    renderAll();
    renderParentReport();
    showToast(`今天设置了 ${state.daily.wordIds.length} 个单词。`);
  }

  function renderParentReport() {
    ensureToday();
    const records = state.daily.records || [];
    const firstTryCount = records.filter((record) => record.firstTry).length;
    const helpCount = records.filter((record) => record.revealed).length;
    dom.parentCompletedStat.textContent = `${records.length}/${state.daily.wordIds.length}`;
    dom.parentFirstTryStat.textContent = String(firstTryCount);
    dom.parentHelpStat.textContent = String(helpCount);
    dom.parentReportStatus.textContent = state.daily.finished ? "已完成" : records.length ? "进行中" : "还没开始";
    dom.parentRecords.replaceChildren();
    if (!records.length) {
      const empty = document.createElement("div");
      empty.className = "empty-kid-state";
      empty.textContent = "孩子完成一个词后，这里会记录写错次数、看答案和用时。";
      dom.parentRecords.append(empty);
      return;
    }
    records.forEach((record) => dom.parentRecords.append(createRecordRow(record, "parent-record-row")));
  }

  function openTodayReport() {
    ensureToday();
    dom.todayReportList.replaceChildren();
    const records = state.daily.records || [];
    if (!records.length) {
      const empty = document.createElement("div");
      empty.className = "empty-kid-state";
      empty.textContent = "今天还没有完成的听写记录。";
      dom.todayReportList.append(empty);
    } else {
      records.forEach((record) => dom.todayReportList.append(createRecordRow(record, "report-row")));
    }
    dom.todayReportModal.hidden = false;
  }

  function openLegacyCards() {
    dom.parentModal.hidden = true;
    document.body.classList.add("legacy-mode");
    dom.legacyReturn.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function returnToKidApp() {
    document.body.classList.remove("legacy-mode");
    dom.legacyReturn.hidden = true;
    if (typeof setMode === "function") {
      setMode("card");
    }
    renderAll();
    navigate("home");
  }

  function renderAll() {
    ensureToday();
    dom.points.textContent = String(state.points);
    dom.cookies.textContent = String(state.cookies);
    renderHome();
    renderPetEverywhere();
    renderShop();
    renderTravel();
    renderGrowth();
    renderParentReport();
  }

  function bindEvents() {
    document.querySelectorAll("[data-nav]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.nav)));
    document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.go)));
    dom.homeButton.addEventListener("click", () => navigate("home"));
    dom.parentButton.addEventListener("click", openParent);
    dom.changePetButton.addEventListener("click", openPetPicker);
    dom.chooseAnotherPetButton.addEventListener("click", openPetPicker);
    dom.startMissionButton.addEventListener("click", startOrResumeMission);
    dom.leaveMissionButton.addEventListener("click", () => {
      saveState();
      renderHome();
      navigate("home");
    });
    dom.submitDictationButton.addEventListener("click", submitDictation);
    dom.revealDictationButton.addEventListener("click", revealDictationAnswer);
    dom.swipeNextButton.addEventListener("click", advanceFromCompletedCard);
    dom.dictationBoard.addEventListener("pointerdown", beginCardSwipe);
    dom.dictationBoard.addEventListener("pointermove", moveCardSwipe);
    dom.dictationBoard.addEventListener("pointerup", endCardSwipe);
    dom.dictationBoard.addEventListener("pointercancel", endCardSwipe);
    dom.speakWordButton.addEventListener("click", speakCurrentWord);
    dom.dictationInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") submitDictation();
    });
    document.querySelectorAll("[data-shop]").forEach((button) => {
      button.addEventListener("click", () => {
        activeShopTab = button.dataset.shop;
        document.querySelectorAll("[data-shop]").forEach((tab) => tab.classList.toggle("is-active", tab === button));
        renderShop();
      });
    });
    dom.startTravelButton.addEventListener("click", startTravel);
    dom.claimPostcardButton.addEventListener("click", claimPostcard);
    dom.openNotebookFromKidButton.addEventListener("click", () => {
      if (typeof openNotebook === "function") openNotebook();
    });
    dom.confirmPetButton.addEventListener("click", confirmPet);
    dom.petNameInput.addEventListener("input", () => {
      dom.confirmPetButton.disabled = !selectedPetDraft;
    });
    dom.closePetPickerButton.addEventListener("click", () => { dom.petPickerModal.hidden = true; });
    dom.closeParentButton.addEventListener("click", () => { dom.parentModal.hidden = true; });
    dom.targetMinusButton.addEventListener("click", () => adjustTarget(-1));
    dom.targetPlusButton.addEventListener("click", () => adjustTarget(1));
    dom.dailyTargetInput.addEventListener("input", updateTaskPreview);
    dom.taskModeControl.querySelectorAll("[data-task-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedTaskMode = button.dataset.taskMode;
        updateTaskModeButtons();
        updateTaskPreview();
      });
    });
    dom.saveTaskButton.addEventListener("click", saveTaskSettings);
    dom.parentEditLibraryButton.addEventListener("click", () => {
      dom.parentModal.hidden = true;
      if (typeof openLibrary === "function") openLibrary();
    });
    dom.openLegacyCardsButton.addEventListener("click", openLegacyCards);
    dom.returnToKidButton.addEventListener("click", returnToKidApp);
    dom.openTodayReportButton.addEventListener("click", openTodayReport);
    dom.closeTodayReportButton.addEventListener("click", () => { dom.todayReportModal.hidden = true; });
    dom.unlockRoomButton.addEventListener("click", () => {
      dom.missionCompleteModal.hidden = true;
      renderAll();
      navigate("pet", { ignoreLock: true });
    });
    [dom.petPickerModal, dom.parentModal, dom.todayReportModal].forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal && (modal !== dom.petPickerModal || state.selectedPet)) {
          modal.hidden = true;
        }
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!dom.todayReportModal.hidden) dom.todayReportModal.hidden = true;
      else if (!dom.parentModal.hidden) dom.parentModal.hidden = true;
      else if (!dom.petPickerModal.hidden && state.selectedPet) dom.petPickerModal.hidden = true;
    });
    window.addEventListener("storage", (event) => {
      if (event.key === GAME_STORAGE_KEY) {
        state = loadState();
        renderAll();
      }
    });
    window.addEventListener("beforeunload", saveState);
  }

  function init() {
    ensureToday();
    grantDailyIncome();
    bindEvents();
    renderAll();
    navigate("home");
    if (!state.selectedPet) {
      openPetPicker();
    }
  }

  init();
})();
