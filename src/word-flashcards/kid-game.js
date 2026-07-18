(() => {
  "use strict";

  const GAME_STORAGE_KEY = "word-flashcards-kid-game-v1";
  const TRAVEL_DURATION_MS = 5 * 60 * 1000;

  const pets = [
    { id: "rabbit", name: "软糖兔", image: "assets/pets-v2/rabbit.png" },
    { id: "dino", name: "芽芽龙", image: "assets/pets-v2/dino.png" },
    { id: "kitten", name: "奶油猫", image: "assets/pets-v2/kitten.png" },
    { id: "capybara", name: "卡皮巴拉", image: "assets/pets-v2/capybara.png" },
    { id: "sadcat", name: "心心猫", image: "assets/pets-v2/sadcat.png" },
    { id: "puppy", name: "团团狗", image: "assets/pets-v2/puppy.png" },
    { id: "hamster", name: "栗子仓鼠", image: "assets/pets-v2/hamster.png" },
    { id: "parrot", name: "彩虹鹦鹉", image: "assets/pets-v2/parrot.png" },
    { id: "snake", name: "青团小蛇", image: "assets/pets-v2/snake.png" },
    { id: "redpanda", name: "莓莓小熊猫", image: "assets/pets-v2/redpanda.png" },
    { id: "penguin", name: "泡泡企鹅", image: "assets/pets-v2/penguin.png" },
    { id: "panda", name: "糯米熊猫", image: "assets/pets-v2/panda.png" }
  ];

  const shopItems = [
    { id: "berry-shirt", type: "wear", slot: "outfit", name: "草莓郊游套装", icon: "🍓", price: 2, matchingShoes: "berry-shoes" },
    { id: "sky-overalls", type: "wear", slot: "outfit", name: "天空探险套装", icon: "☁", price: 2, matchingShoes: "sky-sneakers" },
    { id: "star-pajamas", type: "wear", slot: "outfit", name: "星星晚安套装", icon: "★", price: 3, matchingShoes: "star-slippers" },
    { id: "lemon-raincoat", type: "wear", slot: "outfit", name: "柠檬雨天套装", icon: "●", price: 3, matchingShoes: "rain-boots" },
    { id: "berry-shoes", type: "wear", slot: "shoes", name: "草莓小鞋", icon: "●", price: 1 },
    { id: "sky-sneakers", type: "wear", slot: "shoes", name: "云朵运动鞋", icon: "○", price: 1 },
    { id: "star-slippers", type: "wear", slot: "shoes", name: "星星软拖鞋", icon: "★", price: 1 },
    { id: "rain-boots", type: "wear", slot: "shoes", name: "柠檬雨靴", icon: "▰", price: 1 },
    { id: "bow", type: "wear", slot: "head", name: "草莓蝴蝶结", icon: "🎀", price: 1 },
    { id: "cap", type: "wear", slot: "head", name: "探险小帽", icon: "🧢", price: 2 },
    { id: "flower", type: "wear", slot: "head", name: "太阳花发夹", icon: "🌼", price: 1 },
    { id: "crown", type: "wear", slot: "head", name: "星星皇冠", icon: "👑", price: 3 },
    { id: "glasses", type: "wear", slot: "face", name: "圆圆眼镜", icon: "◉", price: 2 },
    { id: "scarf", type: "wear", slot: "neck", name: "彩虹围巾", icon: "🧣", price: 2 },
    { id: "apple", type: "food", name: "脆脆苹果", icon: "🍎", price: 1, friendship: 1 },
    { id: "carrot", type: "food", name: "甜甜胡萝卜", icon: "🥕", price: 1, friendship: 1 },
    { id: "berry", type: "food", name: "莓果小碗", icon: "🍓", price: 2, friendship: 2 },
    { id: "cake", type: "food", name: "庆祝蛋糕", icon: "🧁", price: 3, friendship: 3 },
    { id: "banana", type: "food", name: "月亮香蕉", icon: "🍌", price: 1, friendship: 1 },
    { id: "corn", type: "food", name: "香香玉米", icon: "🌽", price: 1, friendship: 1 },
    { id: "milk", type: "food", name: "晚安牛奶", icon: "🥛", price: 2, friendship: 2 },
    { id: "cookie", type: "food", name: "星星曲奇", icon: "🍪", price: 2, friendship: 2 },
    { id: "watermelon", type: "food", name: "西瓜小船", icon: "🍉", price: 2, friendship: 2 },
    { id: "sandwich", type: "food", name: "野餐三明治", icon: "🥪", price: 3, friendship: 3 },
    { id: "pink-sofa", type: "furniture", slot: "leftLarge", name: "草莓云朵沙发", icon: "🛋", price: 2 },
    { id: "blue-bed", type: "furniture", slot: "rightLarge", name: "蓝莓小床", icon: "▰", price: 3 },
    { id: "rainbow-shelf", type: "furniture", slot: "wall", name: "彩虹故事书架", icon: "▤", price: 2 },
    { id: "moon-lamp", type: "furniture", slot: "rightSmall", name: "月亮落地灯", icon: "☾", price: 2 },
    { id: "candy-plant", type: "furniture", slot: "leftSmall", name: "糖果绿植", icon: "♣", price: 1 },
    { id: "tea-table", type: "furniture", slot: "center", name: "花朵小圆桌", icon: "●", price: 2 },
    { id: "toy-box", type: "furniture", slot: "center", name: "积木玩具箱", icon: "◇", price: 2 },
    { id: "rainbow-piano", type: "furniture", slot: "rightLarge", name: "彩虹小钢琴", icon: "♫", price: 4 },
    { id: "star-tent", type: "furniture", slot: "leftLarge", name: "星星游戏帐篷", icon: "△", price: 3 },
    { id: "flower-mirror", type: "furniture", slot: "wall", name: "花朵穿衣镜", icon: "✿", price: 2 },
    { id: "wall-cloud", type: "room", slot: "wall", name: "云朵墙纸", icon: "☁", price: 0 },
    { id: "wall-peach", type: "room", slot: "wall", name: "蜜桃墙纸", icon: "●", price: 1 },
    { id: "wall-rainbow", type: "room", slot: "wall", name: "彩虹墙纸", icon: "⌒", price: 2 },
    { id: "wall-space", type: "room", slot: "wall", name: "星空墙纸", icon: "✦", price: 3 },
    { id: "floor-honey", type: "room", slot: "floor", name: "蜂蜜木地板", icon: "▥", price: 0 },
    { id: "floor-mint", type: "room", slot: "floor", name: "薄荷地砖", icon: "▦", price: 1 },
    { id: "floor-checker", type: "room", slot: "floor", name: "糖果棋盘砖", icon: "▦", price: 2 },
    { id: "floor-star", type: "room", slot: "floor", name: "星星软地板", icon: "★", price: 2 },
    { id: "window-sunny", type: "room", slot: "window", name: "晴天方窗", icon: "☀", price: 0 },
    { id: "window-flower", type: "room", slot: "window", name: "花朵圆窗", icon: "✿", price: 2 },
    { id: "window-rain", type: "room", slot: "window", name: "雨滴飘窗", icon: "☂", price: 2 },
    { id: "window-night", type: "room", slot: "window", name: "月夜星窗", icon: "☾", price: 3 },
    { id: "rug-cloud", type: "room", slot: "rug", name: "白云地毯", icon: "☁", price: 1 },
    { id: "rug-rainbow", type: "room", slot: "rug", name: "彩虹地毯", icon: "⌒", price: 2 },
    { id: "rug-strawberry", type: "room", slot: "rug", name: "草莓地毯", icon: "🍓", price: 2 },
    { id: "rug-ocean", type: "room", slot: "rug", name: "海浪地毯", icon: "≈", price: 2 }
  ];

  const destinations = [
    { id: "garden", name: "江南水乡", icon: "🏮", color: "#dff3e7" },
    { id: "city", name: "西安城墙", icon: "🏯", color: "#f4e4cc" },
    { id: "forest", name: "成都竹林", icon: "🎋", color: "#e1f0d7" },
    { id: "island", name: "厦门海边", icon: "⛵", color: "#dceef5" },
    { id: "lake", name: "杭州西湖", icon: "🛶", color: "#dcecf4" },
    { id: "desert", name: "敦煌鸣沙山", icon: "🐫", color: "#f7e8c3" },
    { id: "snow", name: "哈尔滨雪乡", icon: "❄", color: "#e3f1f7" },
    { id: "space", name: "北京天文馆", icon: "✦", color: "#e5e5f5" }
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
    petRoom: $("petRoom"),
    homePetStage: $("homePetStage"),
    homePet: $("homePetImage"),
    homeOutfit: $("homePetOutfit"),
    homeHeadwear: $("homePetHeadwear"),
    homeFacewear: $("homePetFacewear"),
    homeNeckwear: $("homePetNeckwear"),
    homeShoes: $("homePetShoes"),
    homeRoomWindow: $("homeRoomWindow"),
    homeRoomRug: $("homeRoomRug"),
    homeRoomDecor: $("homeRoomDecor"),
    petSpeech: $("petSpeech"),
    roomLock: $("roomLock"),
    roomLockText: $("roomLockText"),
    changePetButton: $("changePetButton"),
    homeTentButton: $("homeTentButton"),
    missionDate: $("missionDate"),
    missionDone: $("missionDone"),
    missionTotal: $("missionTotal"),
    missionTitle: $("missionTitle"),
    missionSummary: $("missionSummary"),
    missionProgressBar: $("missionProgressBar"),
    startMissionButton: $("startMissionButton"),
    startMissionText: $("startMissionText"),
    homeImportWordsButton: $("homeImportWordsButton"),
    openTodayReportButton: $("openTodayReportButton"),
    homeTravelHint: $("homeTravelHint"),
    homePostcardHint: $("homePostcardHint"),
    leaveMissionButton: $("leaveMissionButton"),
    sessionProgressText: $("sessionProgressText"),
    sessionProgressBar: $("sessionProgressBar"),
    sessionScore: $("sessionScore"),
    dictationPet: $("dictationPetImage"),
    dictationOutfit: $("dictationPetOutfit"),
    dictationHeadwear: $("dictationPetHeadwear"),
    dictationShoes: $("dictationPetShoes"),
    dictationPetText: $("dictationPetText"),
    dictationMeaning: $("dictationMeaning"),
    wordRewardBadge: $("wordRewardBadge"),
    dictationInput: $("dictationInput"),
    dictationFeedback: $("dictationFeedback"),
    speakWordButton: $("speakWordButton"),
    submitDictationButton: $("submitDictationButton"),
    revealDictationButton: $("revealDictationButton"),
    swipeNextButton: $("swipeNextButton"),
    dictationBoard: document.querySelector(".dictation-board"),
    revealedAnswer: $("revealedAnswer"),
    revealedWord: $("revealedWord"),
    shopRoom: $("shopRoomPreview"),
    shopPetStage: $("shopPetStage"),
    shopPet: $("shopPetImage"),
    shopOutfit: $("shopPetOutfit"),
    shopHeadwear: $("shopPetHeadwear"),
    shopFacewear: $("shopPetFacewear"),
    shopNeckwear: $("shopPetNeckwear"),
    shopShoes: $("shopPetShoes"),
    shopRoomWindow: $("shopRoomWindow"),
    shopRoomRug: $("shopRoomRug"),
    shopRoomDecor: $("shopRoomDecor"),
    shopTentButton: $("shopTentButton"),
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
    tentModal: $("tentModal"),
    closeTentButton: $("closeTentButton"),
    tentPetStage: $("tentPetStage"),
    tentPet: $("tentPetImage"),
    tentOutfit: $("tentPetOutfit"),
    tentHeadwear: $("tentPetHeadwear"),
    tentFacewear: $("tentPetFacewear"),
    tentNeckwear: $("tentPetNeckwear"),
    tentShoes: $("tentPetShoes"),
    tentTalk: $("tentTalk"),
    tentSleepButton: $("tentSleepButton"),
    tentHandshakeButton: $("tentHandshakeButton"),
    tentChatButton: $("tentChatButton"),
    tentSnackButton: $("tentSnackButton"),
    parentModal: $("parentModal"),
    closeParentButton: $("closeParentButton"),
    parentGateModal: $("parentGateModal"),
    parentGateTitle: $("parentGateTitle"),
    parentGateCopy: $("parentGateCopy"),
    parentPinInput: $("parentPinInput"),
    parentGateMessage: $("parentGateMessage"),
    confirmParentGateButton: $("confirmParentGateButton"),
    closeParentGateButton: $("closeParentGateButton"),
    dailyTargetInput: $("dailyTargetInput"),
    parentPackSelect: $("parentPackSelect"),
    parentPackSummary: $("parentPackSummary"),
    targetMinusButton: $("targetMinusButton"),
    targetPlusButton: $("targetPlusButton"),
    taskModeControl: $("taskModeControl"),
    taskPreviewText: $("taskPreviewText"),
    saveTaskButton: $("saveTaskButton"),
    parentImportWordsButton: $("parentImportWordsButton"),
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
  let selectedPackDraft = state.taskConfig.packId || null;
  let activeShopTab = "wear";
  let isAdvancing = false;
  let travelTimer = null;
  let toastTimer = null;
  let petWalkTimer = null;
  let petDrag = null;
  let tentActionTimer = null;
  let tentChatIndex = 0;
  let parentSessionUnlocked = false;
  let pendingParentAction = "panel";
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
      ownedItems: ["wall-cloud", "floor-honey", "window-sunny"],
      equipped: {
        outfit: null,
        head: null,
        face: null,
        neck: null,
        shoes: null,
        wall: "wall-cloud",
        floor: "floor-honey",
        window: "window-sunny",
        rug: null
      },
      placedFurniture: [],
      petPosition: { x: 52, y: 70 },
      parentPinHash: "",
      taskConfig: { count: 10, mode: "sequential", packId: null },
      wordProgress: {},
      masteryCookieMilestone: 0,
      lastTentSnackDate: null,
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
    const savedEquipped = saved.equipped && typeof saved.equipped === "object" ? saved.equipped : {};
    const migratedHeadwear = savedEquipped.head || savedEquipped.clothes || null;
    const ownedItems = Array.isArray(saved.ownedItems) ? saved.ownedItems : [];
    ["wall-cloud", "floor-honey", "window-sunny"].forEach((itemId) => {
      if (!ownedItems.includes(itemId)) ownedItems.push(itemId);
    });
    return {
      ...base,
      ...saved,
      points: Math.max(0, Number(saved.points) || 0),
      cookies: Math.max(0, Number(saved.cookies) || 0),
      totalDictations: Math.max(0, Number(saved.totalDictations) || 0),
      friendship: Math.max(0, Number(saved.friendship) || 0),
      ownedItems,
      placedFurniture: Array.isArray(saved.placedFurniture)
        ? saved.placedFurniture.filter((id) => getItem(id)?.type === "furniture")
        : (typeof savedEquipped.furniture === "string" ? [savedEquipped.furniture] : []),
      petPosition: {
        x: Math.max(14, Math.min(86, Number(saved.petPosition?.x) || base.petPosition.x)),
        y: Math.max(58, Math.min(80, Number(saved.petPosition?.y) || base.petPosition.y))
      },
      parentPinHash: typeof saved.parentPinHash === "string" ? saved.parentPinHash : "",
      postcards: Array.isArray(saved.postcards) ? saved.postcards : [],
      records: Array.isArray(saved.records) ? saved.records.slice(-500) : [],
      taskConfig: { ...base.taskConfig, ...(saved.taskConfig || {}) },
      daily: saved.daily && typeof saved.daily === "object" ? {
        ...saved.daily,
        targetCount: Math.max(
          0,
          Number(saved.daily.targetCount)
            || new Set(Array.isArray(saved.daily.wordIds) ? saved.daily.wordIds : []).size
        )
      } : null,
      wordProgress: saved.wordProgress && typeof saved.wordProgress === "object" ? saved.wordProgress : {},
      masteryCookieMilestone: Math.max(0, Number(saved.masteryCookieMilestone) || 0),
      equipped: {
        ...base.equipped,
        ...savedEquipped,
        head: migratedHeadwear,
        outfit: savedEquipped.outfit || null,
        face: savedEquipped.face || null,
        neck: savedEquipped.neck || null,
        shoes: savedEquipped.shoes || null,
        wall: savedEquipped.wall || base.equipped.wall,
        floor: savedEquipped.floor || base.equipped.floor,
        window: savedEquipped.window || base.equipped.window,
        rug: savedEquipped.rug || null
      }
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

  function getAvailablePacks() {
    if (window.WordPacks && typeof window.WordPacks.getPacks === "function") {
      return window.WordPacks.getPacks();
    }
    return [];
  }

  function getSelectedPack(packId = state.taskConfig.packId) {
    const packs = getAvailablePacks();
    const selected = packs.find((pack) => pack.id === packId);
    if (selected) return selected;
    if (window.WordPacks && typeof window.WordPacks.getActivePack === "function") {
      return window.WordPacks.getActivePack();
    }
    return null;
  }

  function getTaskWordBank(packId = state.taskConfig.packId) {
    const pack = getSelectedPack(packId);
    if (pack && window.WordPacks && typeof window.WordPacks.getWordsForPack === "function") {
      return window.WordPacks.getWordsForPack(pack.id);
    }
    return getWordBank();
  }

  function getWordProgress(wordId) {
    const saved = state.wordProgress[wordId];
    return saved && typeof saved === "object" ? saved : { status: "new" };
  }

  function updateWordProgress(wordId, changes) {
    state.wordProgress[wordId] = { ...getWordProgress(wordId), ...changes };
    return state.wordProgress[wordId];
  }

  function isWordMastered(wordId) {
    return getWordProgress(wordId).status === "mastered";
  }

  function getMasteredCount() {
    return Object.values(state.wordProgress).filter((progress) => progress?.status === "mastered").length;
  }

  function getWordReward(entry) {
    if (!entry) return 1;
    if (Number(entry.difficulty) === 2) return 2;
    const word = String(entry.word || "").trim();
    const letterCount = (word.match(/[a-z]/gi) || []).length;
    return letterCount >= 7 || /[ -]/.test(word) ? 2 : 1;
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
    const learningIds = Object.entries(state.wordProgress)
      .filter(([, progress]) => progress?.status === "learning")
      .map(([wordId]) => wordId);
    return [...new Set([...learningIds, ...favoriteIds, ...recordIds])];
  }

  function makeTaskWordIds(count, mode, packId = state.taskConfig.packId) {
    const bank = getTaskWordBank(packId);
    const actualCount = Math.max(1, Math.min(Number(count) || 10, bank.length || 1));
    const available = bank.filter((entry) => !isWordMastered(entry.id));
    const learning = available.filter((entry) => getWordProgress(entry.id).status === "learning");
    const fresh = available.filter((entry) => getWordProgress(entry.id).status !== "learning");
    if (!available.length) return [];
    if (mode === "random") {
      return shuffle([...learning, ...fresh].map((entry) => entry.id)).slice(0, actualCount);
    }
    if (mode === "mistakes") {
      const mistakes = getMistakeIds().filter((id) => available.some((entry) => entry.id === id));
      const otherIds = available.map((entry) => entry.id).filter((id) => !mistakes.includes(id));
      return [...mistakes, ...otherIds].slice(0, actualCount);
    }
    return [...learning, ...fresh].slice(0, actualCount).map((entry) => entry.id);
  }

  function createDailyTask(force = false) {
    const today = localDateKey();
    const bank = getTaskWordBank();
    if (!bank.length) {
      return;
    }
    const selectedPack = getSelectedPack();
    if (!state.taskConfig.packId && selectedPack) state.taskConfig.packId = selectedPack.id;
    const dailyIsUsable = state.daily
      && state.daily.date === today
      && state.daily.packId === (selectedPack?.id || null)
      && Array.isArray(state.daily.wordIds)
      && (state.daily.wordIds.length > 0 || state.daily.allMastered);
    if (dailyIsUsable && !force) {
      const validIds = state.daily.wordIds.filter((id) => getWordById(id));
      if (validIds.length === state.daily.wordIds.length) {
        return;
      }
    }
    const wordIds = makeTaskWordIds(state.taskConfig.count, state.taskConfig.mode);
    state.daily = {
      date: today,
      packId: selectedPack?.id || null,
      packName: selectedPack?.name || "当前词库",
      wordIds,
      targetCount: wordIds.length,
      current: 0,
      records: [],
      retryCounts: {},
      activeAttempt: { wrongAttempts: 0, revealed: false, startedAt: null },
      startedAt: null,
      finishedAt: wordIds.length ? null : Date.now(),
      finished: wordIds.length === 0,
      allMastered: wordIds.length === 0,
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
    if (!state.daily.retryCounts) state.daily.retryCounts = {};
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
    schedulePetWalk();
  }

  function setWear(element, slot) {
    if (!element) return;
    element.dataset.item = state.equipped[slot] || "";
  }

  function renderRoom(room, windowElement, rugElement, decorLayer) {
    if (!room) return;
    const wall = state.equipped.wall || "wall-cloud";
    const floor = state.equipped.floor || "floor-honey";
    const windowStyle = state.equipped.window || "window-sunny";
    room.dataset.wall = wall.replace("wall-", "");
    room.dataset.floor = floor.replace("floor-", "");
    room.dataset.window = windowStyle.replace("window-", "");
    windowElement.className = `room-window room-${windowStyle}`;
    rugElement.dataset.rug = (state.equipped.rug || "").replace("rug-", "");
    decorLayer.replaceChildren();
    state.placedFurniture.forEach((itemId) => {
      const item = getItem(itemId);
      if (!item) return;
      const furniture = document.createElement(item.id === "star-tent" ? "button" : "span");
      furniture.className = `room-decor decor-${item.id}`;
      furniture.dataset.item = item.id;
      if (item.id === "star-tent") {
        furniture.type = "button";
        furniture.setAttribute("aria-label", "进入星星帐篷");
        furniture.title = "进入星星帐篷";
        furniture.addEventListener("click", (event) => {
          event.stopPropagation();
          openTent();
        });
      }
      decorLayer.append(furniture);
    });
  }

  function renderPetEverywhere() {
    const pet = getPet();
    [dom.homePet, dom.dictationPet, dom.shopPet, dom.travelPet, dom.rewardPetImage, dom.tentPet].forEach((image) => {
      image.src = pet.image;
      image.alt = state.petName ? `${state.petName}，${pet.name}` : pet.name;
    });
    [dom.homePetStage, dom.shopPetStage].forEach((stage) => { stage.dataset.pet = pet.id; });
    dom.tentPetStage.dataset.pet = pet.id;
    dom.dictationPet.parentElement.dataset.pet = pet.id;
    [dom.homeOutfit, dom.shopOutfit, dom.dictationOutfit, dom.tentOutfit].forEach((element) => setWear(element, "outfit"));
    [dom.homeHeadwear, dom.shopHeadwear, dom.dictationHeadwear, dom.tentHeadwear].forEach((element) => setWear(element, "head"));
    [dom.homeFacewear, dom.shopFacewear, dom.tentFacewear].forEach((element) => setWear(element, "face"));
    [dom.homeNeckwear, dom.shopNeckwear, dom.tentNeckwear].forEach((element) => setWear(element, "neck"));
    [dom.homeShoes, dom.shopShoes, dom.dictationShoes, dom.tentShoes].forEach((element) => setWear(element, "shoes"));
    renderRoom(dom.petRoom, dom.homeRoomWindow, dom.homeRoomRug, dom.homeRoomDecor);
    renderRoom(dom.shopRoom, dom.shopRoomWindow, dom.shopRoomRug, dom.shopRoomDecor);
    const tentIsPlaced = state.placedFurniture.includes("star-tent");
    dom.homeTentButton.hidden = !tentIsPlaced;
    dom.shopTentButton.hidden = !tentIsPlaced;
    setPetPosition(dom.homePetStage, state.petPosition, false);
    setPetPosition(dom.shopPetStage, state.petPosition, false);
    const name = state.petName || pet.name;
    dom.greeting.textContent = `${name} 正等着和你一起完成挑战`;
    dom.petSpeech.textContent = state.daily && state.daily.finished ? `${name}：来追我呀！` : `${name}：我先在小屋等你完成任务。`;
  }

  function resetTentAction() {
    window.clearTimeout(tentActionTimer);
    dom.tentPetStage.classList.remove("is-sleeping", "is-handshaking", "is-snacking");
  }

  function openTent() {
    if (!state.daily || !state.daily.finished) {
      showToast("完成今天的听写后，帐篷就会打开。", true);
      return;
    }
    resetTentAction();
    renderPetEverywhere();
    dom.tentTalk.textContent = `${state.petName || getPet().name}：这里是我们两个的秘密基地！`;
    dom.tentModal.hidden = false;
  }

  function closeTent() {
    resetTentAction();
    dom.tentModal.hidden = true;
  }

  function runTentAction(action) {
    resetTentAction();
    const name = state.petName || getPet().name;
    if (action === "sleep") {
      dom.tentPetStage.classList.add("is-sleeping");
      dom.tentTalk.textContent = `${name}：今天学得很认真，我们一起安静休息一下。`;
      tentActionTimer = window.setTimeout(() => {
        dom.tentPetStage.classList.remove("is-sleeping");
        dom.tentTalk.textContent = `${name}：睡醒啦，脑袋又有力气了！`;
      }, 6000);
      return;
    }
    if (action === "handshake") {
      dom.tentPetStage.classList.add("is-handshaking");
      dom.tentTalk.textContent = `${name}：击掌也算！今天我们是最佳学习搭档。`;
      tentActionTimer = window.setTimeout(() => dom.tentPetStage.classList.remove("is-handshaking"), 1500);
      return;
    }
    if (action === "snack") {
      dom.tentPetStage.classList.add("is-snacking");
      if (state.lastTentSnackDate !== localDateKey()) {
        state.lastTentSnackDate = localDateKey();
        state.friendship += 1;
        saveState();
        dom.tentTalk.textContent = `${name}：帐篷点心最好吃！今天的亲密值 +1。`;
      } else {
        dom.tentTalk.textContent = `${name}：今天已经一起吃过啦，剩下的留到明天。`;
      }
      tentActionTimer = window.setTimeout(() => dom.tentPetStage.classList.remove("is-snacking"), 1600);
      return;
    }
    const messages = [
      `${name}：今天哪个词最难？难一点也没关系。`,
      `${name}：你写错的时候没有逃走，这就很厉害。`,
      `${name}：我们明天也只学一点点，然后再来这里玩。`,
      `${name}：我记得你真正掌握的每一个词。`
    ];
    dom.tentTalk.textContent = messages[tentChatIndex % messages.length];
    tentChatIndex += 1;
  }

  function setPetPosition(stage, position, animate = true) {
    if (!stage) return;
    stage.classList.toggle("has-motion", animate);
    stage.style.setProperty("--pet-x", `${position.x}%`);
    stage.style.setProperty("--pet-y", `${position.y}%`);
    stage.style.setProperty("--pet-scale", String(0.82 + ((position.y - 58) / 22) * 0.22));
  }

  function activeRoomPet() {
    if (currentScreen === "pet") return { stage: dom.shopPetStage, room: dom.shopRoom };
    if (currentScreen === "home") return { stage: dom.homePetStage, room: dom.petRoom };
    return null;
  }

  function walkPetTo(position, save = true) {
    const active = activeRoomPet();
    if (!active) return;
    const next = {
      x: Math.max(14, Math.min(86, position.x)),
      y: Math.max(58, Math.min(80, position.y))
    };
    active.stage.classList.toggle("faces-left", next.x < state.petPosition.x);
    active.stage.classList.add("is-walking");
    state.petPosition = next;
    setPetPosition(active.stage, next, true);
    const mirrorStage = active.stage === dom.homePetStage ? dom.shopPetStage : dom.homePetStage;
    setPetPosition(mirrorStage, next, false);
    window.setTimeout(() => {
      active.stage.classList.remove("is-walking");
      if (save) saveState();
    }, 2500);
  }

  function schedulePetWalk() {
    window.clearTimeout(petWalkTimer);
    if (!activeRoomPet() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    petWalkTimer = window.setTimeout(() => {
      if (petDrag) return;
      walkPetTo({ x: 17 + Math.random() * 66, y: 60 + Math.random() * 18 });
      schedulePetWalk();
    }, 3500 + Math.random() * 3500);
  }

  function roomPositionFromPointer(event, room) {
    const rect = room.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100
    };
  }

  function beginPetDrag(event) {
    const stage = event.currentTarget;
    const room = stage.closest(".room-world");
    if (!room) return;
    event.preventDefault();
    window.clearTimeout(petWalkTimer);
    petDrag = { stage, room, pointerId: event.pointerId };
    stage.classList.add("is-dragging");
    stage.setPointerCapture?.(event.pointerId);
  }

  function movePetDrag(event) {
    if (!petDrag || petDrag.pointerId !== event.pointerId) return;
    const next = roomPositionFromPointer(event, petDrag.room);
    state.petPosition = {
      x: Math.max(14, Math.min(86, next.x)),
      y: Math.max(58, Math.min(80, next.y))
    };
    setPetPosition(petDrag.stage, state.petPosition, false);
  }

  function endPetDrag(event) {
    if (!petDrag || petDrag.pointerId !== event.pointerId) return;
    petDrag.stage.classList.remove("is-dragging");
    setPetPosition(dom.homePetStage, state.petPosition, false);
    setPetPosition(dom.shopPetStage, state.petPosition, false);
    petDrag = null;
    saveState();
    schedulePetWalk();
  }

  function movePetFromRoomTap(event) {
    if (event.target.closest("button, .room-pet, .room-lock")) return;
    walkPetTo(roomPositionFromPointer(event, event.currentTarget));
    schedulePetWalk();
  }

  function handleRoomDecorClick(event) {
    if (event.target.closest('[data-item="star-tent"]')) {
      event.stopPropagation();
      openTent();
    }
  }

  function renderHome() {
    ensureToday();
    const total = Number(state.daily.targetCount) || state.daily.wordIds.length;
    const done = Math.min(total, new Set(state.daily.records.map((record) => record.wordId)).size);
    const percent = total ? Math.round((done / total) * 100) : 0;
    dom.missionDate.textContent = formatToday();
    dom.missionDone.textContent = String(done);
    dom.missionTotal.textContent = `/ ${total}`;
    dom.missionProgressBar.style.width = `${percent}%`;
    dom.points.textContent = String(state.points);
    dom.cookies.textContent = String(state.cookies);
    dom.roomLock.hidden = Boolean(state.daily.finished);
    dom.roomLockText.textContent = `还差 ${Math.max(0, total - done)} 个单词`;

    if (state.daily.allMastered) {
      dom.missionTitle.textContent = "这个词包已经全部掌握";
      dom.missionSummary.textContent = `${state.daily.packName || "当前词包"}没有可以刷分的旧词啦。`;
      dom.startMissionText.textContent = "去小屋找伙伴玩";
    } else if (state.daily.finished) {
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
    const round = Math.floor(current / 3) + 1;
    dom.sessionProgressText.textContent = `第 ${round} 轮 · ${current + 1}/${total}`;
    dom.sessionProgressBar.style.width = `${Math.round((current / total) * 100)}%`;
    dom.sessionScore.textContent = `★ ${state.daily.pointsEarned}`;
    dom.dictationMeaning.textContent = entry.meaning;
    const reward = getWordReward(entry);
    const progress = getWordProgress(entry.id);
    dom.wordRewardBadge.textContent = progress.status === "learning" ? `巩固后可得 ${reward} 积分` : `掌握可得 ${reward} 积分`;
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

  function scheduleOneRetry(entry) {
    const retries = Number(state.daily.retryCounts[entry.id]) || 0;
    if (retries >= 1) return false;
    const remainingIds = state.daily.wordIds.slice(state.daily.current);
    if (remainingIds.includes(entry.id)) return false;
    state.daily.retryCounts[entry.id] = retries + 1;
    state.daily.wordIds.push(entry.id);
    return true;
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
      const previousProgress = getWordProgress(entry.id);
      updateWordProgress(entry.id, {
        status: "learning",
        wrongCount: (Number(previousProgress.wrongCount) || 0) + 1,
        lastPracticedAt: Date.now()
      });
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
    const firstTry = attempt.wrongAttempts === 0 && !attempt.revealed;
    const previousProgress = getWordProgress(entry.id);
    const masteredNow = firstTry && previousProgress.status !== "mastered";
    const rewardPoints = masteredNow ? getWordReward(entry) : 0;
    if (masteredNow) {
      updateWordProgress(entry.id, {
        status: "mastered",
        masteredAt: Date.now(),
        lastPracticedAt: Date.now(),
        nextReviewAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
        pointsAwarded: rewardPoints
      });
    } else if (previousProgress.status !== "mastered") {
      updateWordProgress(entry.id, {
        status: "learning",
        lastPracticedAt: Date.now()
      });
    }
    const record = {
      id: `${Date.now()}-${entry.id}`,
      date: localDateKey(),
      wordId: entry.id,
      word: entry.word,
      meaning: entry.meaning,
      firstTry,
      wrongAttempts: attempt.wrongAttempts,
      revealed: Boolean(attempt.revealed),
      masteredNow,
      pointsAwarded: rewardPoints,
      completedAt: Date.now(),
      durationSeconds: Math.max(1, Math.round((Date.now() - (attempt.startedAt || Date.now())) / 1000))
    };
    state.daily.records.push(record);
    state.records.push(record);
    state.records = state.records.slice(-500);
    state.daily.current += 1;
    if (!masteredNow) scheduleOneRetry(entry);
    state.daily.pointsEarned += rewardPoints;
    state.points += rewardPoints;
    state.totalDictations += 1;
    let cookieAwarded = false;
    if (masteredNow) {
      const milestone = Math.floor(getMasteredCount() / 10);
      if (milestone > state.masteryCookieMilestone) {
        const earnedCookies = milestone - state.masteryCookieMilestone;
        state.masteryCookieMilestone = milestone;
        state.cookies += earnedCookies;
        state.daily.cookiesEarned += earnedCookies;
        cookieAwarded = true;
      }
    }
    state.daily.activeAttempt = { wrongAttempts: 0, revealed: false, startedAt: Date.now() };
    saveState();
    dom.points.textContent = String(state.points);
    dom.cookies.textContent = String(state.cookies);
    dom.dictationFeedback.textContent = masteredNow
      ? `一次独立写对，${rewardPoints} 积分装进口袋啦。`
      : "这次已经订正，稍后会再考一次，独立写对才算掌握。";
    dom.dictationFeedback.className = "dictation-feedback is-right";
    dom.dictationPetText.textContent = cookieAwarded ? "十个不同的新词掌握啦！还得到一块小饼干。" : masteredNow ? "这个词已经真正掌握，继续保持！" : "我把它放到后面，等一下再自己写一次。";
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
    const previousProgress = getWordProgress(entry.id);
    updateWordProgress(entry.id, {
      status: "learning",
      revealCount: (Number(previousProgress.revealCount) || 0) + 1,
      lastPracticedAt: Date.now()
    });
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
    const targetCount = Number(state.daily.targetCount) || new Set(state.daily.wordIds).size;
    const retryCount = Math.max(0, state.daily.wordIds.length - targetCount);
    dom.rewardSummary.textContent = retryCount
      ? `${targetCount} 个新词完成，还认真巩固了 ${retryCount} 次。`
      : `${targetCount} 个单词都已经认真拼完。`;
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
          dom.petNameInput.value = pet.name.replace(/兔|龙|猫|狗|仓鼠|鹦鹉|小蛇|卡皮巴拉|小熊猫|企鹅|熊猫/g, "") || pet.name;
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
      const equipped = item.type === "furniture"
        ? state.placedFurniture.includes(item.id)
        : item.type !== "food" && state.equipped[item.slot] === item.id;
      const row = document.createElement("article");
      row.className = "shop-item";
      row.dataset.item = item.id;
      const actionText = item.type === "food"
        ? `喂给它 · ★${item.price}`
        : equipped
          ? (item.type === "furniture" || item.type === "wear" ? "收起来" : "正在使用")
          : owned ? (item.type === "furniture" ? "摆进房间" : "换上") : item.price === 0 ? "免费领取" : `购买 · ★${item.price}`;
      const ownedCopy = item.type === "furniture" ? "可以摆进房间" : item.type === "room" ? "已经拥有" : "衣柜里已经有了";
      row.innerHTML = `
        <span class="shop-item-icon catalog-${item.type}" aria-hidden="true">${item.icon}</span>
        <div><strong>${item.name}</strong><small>${item.type === "food" ? `亲密值 +${item.friendship}` : owned ? ownedCopy : item.price === 0 ? "第一件免费" : "完成几个词就能带回家"}</small><button type="button" ${equipped && item.type === "room" ? "disabled" : ""} class="${owned ? "is-owned" : ""}">${actionText}</button></div>
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
      if (item.matchingShoes && !state.ownedItems.includes(item.matchingShoes)) {
        state.ownedItems.push(item.matchingShoes);
      }
    }
    if (item.type === "furniture") {
      if (state.placedFurniture.includes(item.id)) {
        state.placedFurniture = state.placedFurniture.filter((id) => id !== item.id);
      } else {
        const sameSlotIds = shopItems.filter((entry) => entry.type === "furniture" && entry.slot === item.slot).map((entry) => entry.id);
        state.placedFurniture = state.placedFurniture.filter((id) => !sameSlotIds.includes(id));
        state.placedFurniture.push(item.id);
      }
    } else if (state.equipped[item.slot] === item.id && item.type === "wear") {
      state.equipped[item.slot] = null;
      if (item.matchingShoes && state.equipped.shoes === item.matchingShoes) {
        state.equipped.shoes = null;
      }
    } else {
      state.equipped[item.slot] = item.id;
      if (item.matchingShoes && state.ownedItems.includes(item.matchingShoes)) {
        state.equipped.shoes = item.matchingShoes;
      }
    }
    saveState();
    renderAll();
    const isNowVisible = item.type === "furniture" ? state.placedFurniture.includes(item.id) : state.equipped[item.slot] === item.id;
    if (item.type === "wear") {
      showToast(isNowVisible ? `${item.name}已经穿好啦！` : `${item.name}已经收进衣柜。`);
    } else {
      showToast(isNowVisible ? `${item.name}已经布置好啦！` : `${item.name}已经收好。`);
    }
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
      showToast("还没有小饼干。每掌握 10 个不同的新词就会得到 1 块。", true);
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
    dom.totalDictationsStat.textContent = String(getMasteredCount());
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
      empty.textContent = "还没有明信片。掌握 10 个不同的新词拿到小饼干，就能让伙伴去旅行。";
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

  function pinHash(pin) {
    let hash = 2166136261;
    for (const character of pin) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function openParent(action = "panel") {
    pendingParentAction = action;
    if (parentSessionUnlocked) {
      if (pendingParentAction === "import" && window.WordPacks) window.WordPacks.openImport();
      else openParentPanel();
      return;
    }
    const isSetup = !state.parentPinHash;
    dom.parentGateTitle.textContent = isSetup ? "设置家长密码" : "家长验证";
    dom.parentGateCopy.textContent = isSetup
      ? "请设置一个孩子不知道的四位数字。以后修改每日单词数，都需要先输入它。"
      : "输入四位家长密码，才能修改每日任务和词库。";
    dom.confirmParentGateButton.textContent = isSetup ? "设置密码并进入" : "验证并进入";
    dom.parentPinInput.value = "";
    dom.parentGateMessage.textContent = "";
    dom.parentGateMessage.classList.remove("is-error");
    dom.parentGateModal.hidden = false;
    window.setTimeout(() => dom.parentPinInput.focus(), 80);
  }

  function confirmParentGate() {
    const pin = dom.parentPinInput.value.replace(/\D/g, "");
    if (pin.length !== 4) {
      dom.parentGateMessage.textContent = "请输入完整的四位数字。";
      dom.parentGateMessage.classList.add("is-error");
      return;
    }
    if (!state.parentPinHash) {
      state.parentPinHash = pinHash(pin);
      saveState();
    } else if (pinHash(pin) !== state.parentPinHash) {
      dom.parentGateMessage.textContent = "密码不正确，请再试一次。";
      dom.parentGateMessage.classList.add("is-error");
      dom.parentPinInput.select();
      return;
    }
    parentSessionUnlocked = true;
    dom.parentGateModal.hidden = true;
    if (pendingParentAction === "import" && window.WordPacks) window.WordPacks.openImport();
    else openParentPanel();
  }

  function renderParentPackOptions() {
    const packs = getAvailablePacks();
    dom.parentPackSelect.replaceChildren();
    if (!packs.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "当前词库";
      dom.parentPackSelect.append(option);
      selectedPackDraft = null;
      dom.parentPackSummary.textContent = `${getWordBank().length} 个词`;
      return;
    }
    if (!packs.some((pack) => pack.id === selectedPackDraft)) {
      selectedPackDraft = getSelectedPack()?.id || packs[0].id;
    }
    packs.forEach((pack) => {
      const option = document.createElement("option");
      option.value = pack.id;
      option.textContent = pack.name;
      option.selected = pack.id === selectedPackDraft;
      dom.parentPackSelect.append(option);
    });
    const wordCount = getTaskWordBank(selectedPackDraft).length;
    const remaining = getTaskWordBank(selectedPackDraft).filter((entry) => !isWordMastered(entry.id)).length;
    dom.parentPackSummary.textContent = `共 ${wordCount} 个词，还有 ${remaining} 个未掌握`;
  }

  function openParentPanel() {
    ensureToday();
    selectedTaskMode = state.taskConfig.mode;
    selectedPackDraft = state.taskConfig.packId || getSelectedPack()?.id || null;
    renderParentPackOptions();
    const packWordCount = getTaskWordBank(selectedPackDraft).length;
    dom.dailyTargetInput.max = String(Math.min(30, packWordCount || 30));
    dom.dailyTargetInput.value = String(Math.min(state.taskConfig.count, packWordCount || state.taskConfig.count));
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
    const bank = getTaskWordBank(selectedPackDraft);
    const count = Math.max(1, Math.min(Number(dom.dailyTargetInput.value) || 10, bank.length || 1));
    const preview = makeTaskWordIds(count, selectedTaskMode, selectedPackDraft).map(getWordById).filter(Boolean);
    dom.taskPreviewText.textContent = preview.map((entry) => entry.word).join("、") || "这个词包已经全部掌握";
  }

  function adjustTarget(delta) {
    const max = Math.min(30, getTaskWordBank(selectedPackDraft).length || 30);
    dom.dailyTargetInput.value = String(Math.max(1, Math.min(max, (Number(dom.dailyTargetInput.value) || 10) + delta)));
    updateTaskPreview();
  }

  function saveTaskSettings() {
    const hadProgress = state.daily && state.daily.date === localDateKey() && state.daily.records.length > 0 && !state.daily.finished;
    if (hadProgress && !window.confirm("今天已经有听写记录。重新设置会重新开始今天的任务，原记录仍保留在成长足迹中。确定继续吗？")) {
      return;
    }
    const bank = getTaskWordBank(selectedPackDraft);
    state.taskConfig.count = Math.max(1, Math.min(Number(dom.dailyTargetInput.value) || 10, bank.length || 1));
    state.taskConfig.mode = selectedTaskMode;
    state.taskConfig.packId = selectedPackDraft;
    if (selectedPackDraft && window.WordPacks) window.WordPacks.setActivePack(selectedPackDraft, "task");
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
    const targetCount = Number(state.daily.targetCount) || state.daily.wordIds.length;
    const completedCount = Math.min(targetCount, new Set(records.map((record) => record.wordId)).size);
    dom.parentCompletedStat.textContent = `${completedCount}/${targetCount}`;
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
    dom.parentButton.addEventListener("click", () => openParent("panel"));
    dom.homeImportWordsButton.addEventListener("click", () => openParent("import"));
    dom.changePetButton.addEventListener("click", openPetPicker);
    dom.chooseAnotherPetButton.addEventListener("click", openPetPicker);
    dom.homeTentButton.addEventListener("click", openTent);
    dom.shopTentButton.addEventListener("click", openTent);
    [dom.homePetStage, dom.shopPetStage].forEach((stage) => stage.addEventListener("pointerdown", beginPetDrag));
    window.addEventListener("pointermove", movePetDrag);
    window.addEventListener("pointerup", endPetDrag);
    window.addEventListener("pointercancel", endPetDrag);
    [dom.petRoom, dom.shopRoom].forEach((room) => room.addEventListener("click", movePetFromRoomTap));
    [dom.homeRoomDecor, dom.shopRoomDecor].forEach((layer) => layer.addEventListener("click", handleRoomDecorClick));
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
    dom.closeTentButton.addEventListener("click", closeTent);
    dom.tentSleepButton.addEventListener("click", () => runTentAction("sleep"));
    dom.tentHandshakeButton.addEventListener("click", () => runTentAction("handshake"));
    dom.tentChatButton.addEventListener("click", () => runTentAction("chat"));
    dom.tentSnackButton.addEventListener("click", () => runTentAction("snack"));
    dom.closeParentButton.addEventListener("click", () => {
      dom.parentModal.hidden = true;
      parentSessionUnlocked = false;
    });
    dom.closeParentGateButton.addEventListener("click", () => { dom.parentGateModal.hidden = true; });
    dom.confirmParentGateButton.addEventListener("click", confirmParentGate);
    dom.parentPinInput.addEventListener("input", () => {
      dom.parentPinInput.value = dom.parentPinInput.value.replace(/\D/g, "").slice(0, 4);
      dom.parentGateMessage.textContent = "";
      dom.parentGateMessage.classList.remove("is-error");
    });
    dom.parentPinInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") confirmParentGate();
    });
    dom.targetMinusButton.addEventListener("click", () => adjustTarget(-1));
    dom.targetPlusButton.addEventListener("click", () => adjustTarget(1));
    dom.dailyTargetInput.addEventListener("input", updateTaskPreview);
    dom.parentPackSelect.addEventListener("change", () => {
      selectedPackDraft = dom.parentPackSelect.value || null;
      const max = Math.min(30, getTaskWordBank(selectedPackDraft).length || 30);
      dom.dailyTargetInput.max = String(max);
      dom.dailyTargetInput.value = String(Math.max(1, Math.min(max, Number(dom.dailyTargetInput.value) || state.taskConfig.count)));
      renderParentPackOptions();
      updateTaskPreview();
    });
    dom.taskModeControl.querySelectorAll("[data-task-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedTaskMode = button.dataset.taskMode;
        updateTaskModeButtons();
        updateTaskPreview();
      });
    });
    dom.saveTaskButton.addEventListener("click", saveTaskSettings);
    dom.parentImportWordsButton.addEventListener("click", () => {
      dom.parentModal.hidden = true;
      if (window.WordPacks) window.WordPacks.openImport();
    });
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
    [dom.petPickerModal, dom.tentModal, dom.parentModal, dom.parentGateModal, dom.todayReportModal].forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal && (modal !== dom.petPickerModal || state.selectedPet)) {
          if (modal === dom.tentModal) closeTent();
          else modal.hidden = true;
          if (modal === dom.parentModal) parentSessionUnlocked = false;
        }
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!dom.todayReportModal.hidden) dom.todayReportModal.hidden = true;
      else if (!dom.tentModal.hidden) closeTent();
      else if (!dom.parentModal.hidden) {
        dom.parentModal.hidden = true;
        parentSessionUnlocked = false;
      }
      else if (!dom.parentGateModal.hidden) dom.parentGateModal.hidden = true;
      else if (!dom.petPickerModal.hidden && state.selectedPet) dom.petPickerModal.hidden = true;
    });
    window.addEventListener("storage", (event) => {
      if (event.key === GAME_STORAGE_KEY) {
        state = loadState();
        renderAll();
      }
    });
    window.addEventListener("wordpackschange", (event) => {
      const packId = event.detail?.activePackId || window.WordPacks?.getActivePack()?.id || null;
      if (!packId) return;
      state.taskConfig.packId = packId;
      selectedPackDraft = packId;
      createDailyTask(true);
      saveState();
      renderAll();
      showToast(`已切换到“${event.detail?.pack?.name || "新词包"}”。`);
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
