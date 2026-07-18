(() => {
  "use strict";

  const PACK_STORAGE_KEY = "word-flashcards-packs-v1";
  const TESSERACT_URL = "./vendor/tesseract/tesseract.min.js";
  const sourceLabels = {
    "new-concept-1": "新概念英语第一册",
    "new-concept-2": "新概念英语第二册",
    "new-concept-3": "新概念英语第三册",
    "new-concept-4": "新概念英语第四册",
    school: "学校英语",
    teacher: "老师词表",
    custom: "自定义词包"
  };

  const dom = {
    modal: document.getElementById("wordImportModal"),
    close: document.getElementById("closeWordImportButton"),
    source: document.getElementById("packSourceSelect"),
    lesson: document.getElementById("packLessonInput"),
    name: document.getElementById("packNameInput"),
    photoInput: document.getElementById("wordPhotoInput"),
    photoDropzone: document.getElementById("wordPhotoDropzone"),
    photoPreviewWrap: document.getElementById("photoScanPreview"),
    photoPreview: document.getElementById("wordPhotoPreview"),
    scanLine: document.getElementById("wordScanLine"),
    scanButton: document.getElementById("scanWordPhotoButton"),
    scanStatus: document.getElementById("wordScanStatus"),
    scanProgress: document.getElementById("wordScanProgress"),
    importText: document.getElementById("packImportText"),
    parseButton: document.getElementById("parsePackWordsButton"),
    manualWord: document.getElementById("manualPackWord"),
    manualMeaning: document.getElementById("manualPackMeaning"),
    manualAdd: document.getElementById("addManualPackWord"),
    message: document.getElementById("wordImportMessage"),
    review: document.getElementById("importReview"),
    reviewCount: document.getElementById("importReviewCount"),
    reviewList: document.getElementById("importReviewList"),
    save: document.getElementById("saveWordPackButton"),
    packCount: document.getElementById("packLibraryCount"),
    packList: document.getElementById("packLibraryList")
  };

  let selectedPhoto = null;
  let selectedPhotoUrl = "";
  let reviewEntries = [];
  let packNameWasEdited = false;
  let store = loadStore();

  function uid(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function sourceLabel(value) {
    return sourceLabels[value] || sourceLabels.custom;
  }

  function defaultPack() {
    return {
      id: "starter",
      name: "我的第一组词",
      sourceType: "custom",
      lesson: "",
      wordIds: words.map((entry) => entry.id),
      createdAt: Date.now()
    };
  }

  function normalizePack(saved) {
    if (!saved || typeof saved !== "object") return null;
    const wordIds = Array.isArray(saved.wordIds)
      ? [...new Set(saved.wordIds.filter((id) => typeof id === "string"))]
      : [];
    if (!wordIds.length) return null;
    return {
      id: String(saved.id || uid("pack")),
      name: String(saved.name || "未命名词包").trim() || "未命名词包",
      sourceType: String(saved.sourceType || "custom"),
      lesson: String(saved.lesson || "").trim(),
      wordIds,
      createdAt: Number(saved.createdAt) || Date.now()
    };
  }

  function loadStore() {
    try {
      const saved = JSON.parse(localStorage.getItem(PACK_STORAGE_KEY) || "null");
      const packs = Array.isArray(saved?.packs) ? saved.packs.map(normalizePack).filter(Boolean) : [];
      const nextPacks = packs.length ? packs : [defaultPack()];
      const activePackId = nextPacks.some((pack) => pack.id === saved?.activePackId)
        ? saved.activePackId
        : nextPacks[0].id;
      const nextStore = { activePackId, packs: nextPacks };
      syncLooseWords(nextStore);
      return nextStore;
    } catch {
      return { activePackId: "starter", packs: [defaultPack()] };
    }
  }

  function saveStore() {
    try {
      localStorage.setItem(PACK_STORAGE_KEY, JSON.stringify(store));
    } catch {
      setMessage("当前浏览器没有保存词包，请检查浏览器存储权限。", true);
    }
  }

  function syncLooseWords(targetStore = store) {
    const assigned = new Set(targetStore.packs.flatMap((pack) => pack.wordIds));
    const looseIds = words.map((entry) => entry.id).filter((id) => !assigned.has(id));
    if (!looseIds.length) return;
    const fallback = targetStore.packs.find((pack) => pack.id === targetStore.activePackId) || targetStore.packs[0];
    fallback.wordIds.push(...looseIds);
    fallback.wordIds = [...new Set(fallback.wordIds)];
  }

  function getPacks() {
    return store.packs.map((pack) => ({ ...pack, wordIds: [...pack.wordIds] }));
  }

  function getPack(packId) {
    return store.packs.find((pack) => pack.id === packId) || null;
  }

  function getActivePack() {
    return getPack(store.activePackId) || store.packs[0] || null;
  }

  function getWordsForPack(packId = store.activePackId) {
    const pack = getPack(packId);
    if (!pack) return [...words];
    const bankById = new Map(words.map((entry) => [entry.id, entry]));
    return pack.wordIds.map((id) => bankById.get(id)).filter(Boolean);
  }

  function dispatchPackChange(reason) {
    window.dispatchEvent(new CustomEvent("wordpackschange", {
      detail: { reason, activePackId: store.activePackId, pack: getActivePack() }
    }));
  }

  function setActivePack(packId, reason = "select") {
    if (!getPack(packId) || store.activePackId === packId) return;
    store.activePackId = packId;
    saveStore();
    renderPackLibrary();
    dispatchPackChange(reason);
  }

  function setMessage(message, isError = false) {
    dom.message.textContent = message;
    dom.message.classList.toggle("is-error", isError);
  }

  function suggestedPackName() {
    const lesson = dom.lesson.value.trim();
    return [sourceLabel(dom.source.value), lesson].filter(Boolean).join(" · ");
  }

  function updateSuggestedName() {
    if (!packNameWasEdited || !dom.name.value.trim()) {
      dom.name.value = suggestedPackName();
    }
  }

  function selectMethod(method) {
    document.querySelectorAll("[data-import-method]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.importMethod === method);
    });
    document.querySelectorAll("[data-import-panel]").forEach((panel) => {
      const active = panel.dataset.importPanel === method;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  function resetDraft() {
    selectedPhoto = null;
    if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
    selectedPhotoUrl = "";
    dom.photoInput.value = "";
    dom.photoPreview.removeAttribute("src");
    dom.photoPreviewWrap.hidden = true;
    dom.scanProgress.style.width = "0%";
    dom.scanStatus.textContent = "照片已经准备好";
    dom.scanLine.classList.remove("is-scanning");
    dom.importText.value = "";
    dom.manualWord.value = "";
    dom.manualMeaning.value = "";
    reviewEntries = [];
    renderReview();
    setMessage("");
  }

  function openImport() {
    packNameWasEdited = false;
    dom.lesson.value = "";
    dom.source.value = "new-concept-1";
    updateSuggestedName();
    resetDraft();
    selectMethod("photo");
    renderPackLibrary();
    dom.modal.hidden = false;
  }

  function closeImport() {
    dom.modal.hidden = true;
  }

  function renderPackLibrary() {
    syncLooseWords();
    saveStore();
    dom.packCount.textContent = `${store.packs.length} 个`;
    dom.packList.replaceChildren();
    store.packs.forEach((pack) => {
      const availableCount = getWordsForPack(pack.id).length;
      const row = document.createElement("article");
      row.className = "pack-library-row";
      row.classList.toggle("is-active", pack.id === store.activePackId);

      const text = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = pack.name;
      const detail = document.createElement("small");
      detail.textContent = `${availableCount} 个词${pack.id === store.activePackId ? " · 当前使用" : ""}`;
      text.append(title, detail);

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = pack.id === store.activePackId ? "正在使用" : "使用";
      button.disabled = pack.id === store.activePackId;
      button.addEventListener("click", () => setActivePack(pack.id));
      row.append(text, button);
      dom.packList.append(row);
    });
  }

  function wordLooksValid(word) {
    return /[a-z]/i.test(word) && /^[a-z][a-z0-9' -]{0,59}$/i.test(word.trim());
  }

  function automaticDifficulty(word) {
    const normalized = String(word).trim();
    const letterCount = (normalized.match(/[a-z]/gi) || []).length;
    return letterCount >= 7 || /[ -]/.test(normalized) ? 2 : 1;
  }

  function editDistance(left, right) {
    const a = String(left).toLowerCase();
    const b = String(right).toLowerCase();
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const current = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = current;
      }
    }
    return row[b.length];
  }

  function correctWithKnownBank(candidate) {
    const normalized = String(candidate).toLowerCase();
    if (words.some((entry) => entry.word.toLowerCase() === normalized)) return candidate;
    const close = words
      .filter((entry) => Math.abs(entry.word.length - candidate.length) <= 1)
      .map((entry) => ({ word: entry.word, distance: editDistance(candidate, entry.word) }))
      .filter((entry) => entry.distance === 1);
    return close.length === 1 ? close[0].word : candidate;
  }

  function entriesFromText(text) {
    const parsed = typeof parseImportText === "function" ? parseImportText(text) : [];
    const byId = new Map();
    parsed.forEach((entry) => {
      const word = String(entry.word || "").replace(/^[^a-z]+/i, "").trim();
      if (!wordLooksValid(word)) return;
      const id = createWordId(word);
      byId.set(id, {
        word,
        pronunciation: String(entry.pronunciation || "").trim(),
        part: String(entry.part || "自定义").trim() || "自定义",
        meaning: String(entry.meaning || "").trim(),
        difficulty: automaticDifficulty(word),
        selected: true
      });
    });
    return [...byId.values()];
  }

  function entriesFromTsv(tsv, imageWidth, imageHeight) {
    if (!tsv || !imageWidth || !imageHeight) return [];
    const rows = [];
    const wordsFromTsv = String(tsv).split(/\r?\n/).slice(1).map((line) => {
      const fields = line.split("\t");
      if (fields.length < 12 || fields[0] !== "5") return null;
      const text = fields.slice(11).join("\t").trim();
      const left = Number(fields[6]);
      const top = Number(fields[7]);
      const width = Number(fields[8]);
      const height = Number(fields[9]);
      const confidence = Number(fields[10]);
      if (!text || confidence < 12 || !width || !height) return null;
      return { text, left, top, width, height, confidence, centerY: top + height / 2, centerX: left + width / 2 };
    }).filter(Boolean).sort((a, b) => a.centerY - b.centerY || a.left - b.left);

    wordsFromTsv.forEach((token) => {
      const tolerance = Math.max(10, token.height * 0.72);
      const row = rows.find((candidate) => Math.abs(candidate.centerY - token.centerY) <= tolerance);
      if (row) {
        row.tokens.push(token);
        row.centerY = row.tokens.reduce((sum, item) => sum + item.centerY, 0) / row.tokens.length;
      } else {
        rows.push({ centerY: token.centerY, tokens: [token] });
      }
    });

    const columnCount = imageWidth / imageHeight >= 2.8 ? 2 : 1;
    const columnWidth = imageWidth / columnCount;
    const entries = [];
    const ignoredEnglish = /^(?:n|v|adj|adv|prep|pron|conj|art|num|lesson|unit)$/i;
    rows.forEach((row) => {
      for (let column = 0; column < columnCount; column += 1) {
        const leftBound = column * columnWidth;
        const rightBound = (column + 1) * columnWidth;
        const tokens = row.tokens.filter((token) => token.centerX >= leftBound && token.centerX < rightBound).sort((a, b) => a.left - b.left);
        const wordToken = tokens.find((token) => {
          const cleaned = token.text.replace(/^[^a-z]+|[^a-z'-]+$/gi, "");
          const relativeX = (token.centerX - leftBound) / columnWidth;
          return relativeX < 0.22 && wordLooksValid(cleaned) && !ignoredEnglish.test(cleaned);
        });
        if (!wordToken) continue;
        const rawWord = wordToken.text.replace(/^[^a-z]+|[^a-z'-]+$/gi, "").trim();
        const word = correctWithKnownBank(rawWord);
        const cjkTokens = wordsFromTsv
          .filter((token) => token.centerX >= leftBound && token.centerX < rightBound)
          .filter((token) => /[\u3400-\u9fff]/.test(token.text))
          .map((token) => ({ ...token, rowDistance: Math.abs(token.centerY - wordToken.centerY) }));
        const nearestMeaningDistance = cjkTokens.length ? Math.min(...cjkTokens.map((token) => token.rowDistance)) : Infinity;
        const recognizedMeaning = nearestMeaningDistance <= Math.max(26, wordToken.height * 1.15)
          ? cjkTokens
            .filter((token) => token.rowDistance <= nearestMeaningDistance + 7)
            .sort((a, b) => a.left - b.left)
          .map((token) => token.text.replace(/[^\u3400-\u9fff，、；（）]/g, ""))
          .filter(Boolean)
            .join("")
          : "";
        const knownEntry = words.find((entry) => entry.word.toLowerCase() === word.toLowerCase());
        const meaning = knownEntry?.meaning || recognizedMeaning;
        const uncertain = wordToken.confidence < 48
          || rawWord.length < 2
          || (/^[A-Z]+$/.test(rawWord) && rawWord.length <= 4)
          || (!meaning && wordToken.confidence < 74);
        entries.push({
          word,
          pronunciation: "",
          part: "自定义",
          meaning,
          difficulty: automaticDifficulty(word),
          selected: !uncertain,
          uncertain
        });
      }
    });
    const byId = new Map();
    entries.forEach((entry) => byId.set(createWordId(entry.word), entry));
    return [...byId.values()];
  }

  function setReviewEntries(entries, append = false) {
    const merged = append ? [...reviewEntries, ...entries] : entries;
    const byId = new Map();
    merged.forEach((entry) => byId.set(createWordId(entry.word), entry));
    reviewEntries = [...byId.values()];
    renderReview();
    if (reviewEntries.length) {
      const selectedCount = reviewEntries.filter((entry) => entry.selected).length;
      setMessage(`识别到 ${reviewEntries.length} 个候选词，已自动勾选其中 ${selectedCount} 个，请检查后保存。`);
    } else {
      setMessage("没有识别到英文词条。可以换一张更清楚的照片，或切换到粘贴词表。", true);
    }
  }

  function renderReview() {
    dom.review.hidden = reviewEntries.length === 0;
    dom.reviewCount.textContent = `${reviewEntries.filter((entry) => entry.selected).length} 个词`;
    dom.reviewList.replaceChildren();
    reviewEntries.forEach((entry, index) => {
      const row = document.createElement("div");
      row.className = "import-review-row";
      row.classList.toggle("has-missing-meaning", !entry.meaning || entry.meaning === "待补充释义");
      row.classList.toggle("is-uncertain", Boolean(entry.uncertain));

      const include = document.createElement("input");
      include.type = "checkbox";
      include.checked = entry.selected;
      include.setAttribute("aria-label", `是否导入 ${entry.word}`);
      include.addEventListener("change", () => {
        entry.selected = include.checked;
        if (include.checked) entry.uncertain = false;
        renderReview();
      });

      const fields = document.createElement("div");
      fields.className = "review-word-fields";
      const wordInput = document.createElement("input");
      wordInput.value = entry.word;
      wordInput.autocapitalize = "none";
      wordInput.spellcheck = false;
      wordInput.setAttribute("aria-label", "英文单词");
      wordInput.addEventListener("input", () => {
        entry.word = wordInput.value;
      });
      const meaningInput = document.createElement("input");
      meaningInput.value = entry.meaning;
      meaningInput.placeholder = "请补充中文释义";
      meaningInput.setAttribute("aria-label", `${entry.word} 的中文释义`);
      meaningInput.addEventListener("input", () => {
        entry.meaning = meaningInput.value;
        row.classList.toggle("has-missing-meaning", !entry.meaning.trim());
      });
      fields.append(wordInput, meaningInput);

      const difficulty = document.createElement("select");
      difficulty.setAttribute("aria-label", `${entry.word} 的积分难度`);
      difficulty.innerHTML = '<option value="1">1 分</option><option value="2">2 分</option>';
      difficulty.value = String(entry.difficulty);
      difficulty.addEventListener("change", () => { entry.difficulty = Number(difficulty.value); });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-review-word";
      remove.textContent = "移除";
      remove.addEventListener("click", () => {
        reviewEntries.splice(index, 1);
        renderReview();
      });
      row.append(include, fields, difficulty, remove);
      dom.reviewList.append(row);
    });
  }

  function parsePastedWords() {
    setReviewEntries(entriesFromText(dom.importText.value));
  }

  function addManualWord() {
    const word = dom.manualWord.value.trim();
    const meaning = dom.manualMeaning.value.trim();
    if (!wordLooksValid(word)) {
      setMessage("请先输入正确的英文单词。", true);
      dom.manualWord.focus();
      return;
    }
    setReviewEntries([{
      word,
      meaning,
      pronunciation: "",
      part: "自定义",
      difficulty: automaticDifficulty(word),
      selected: true
    }], true);
    dom.manualWord.value = "";
    dom.manualMeaning.value = "";
    dom.manualWord.focus();
  }

  function handlePhotoSelection() {
    const file = dom.photoInput.files?.[0];
    if (!file) return;
    selectedPhoto = file;
    if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
    selectedPhotoUrl = URL.createObjectURL(file);
    dom.photoPreview.src = selectedPhotoUrl;
    dom.photoPreviewWrap.hidden = false;
    dom.scanProgress.style.width = "0%";
    dom.scanStatus.textContent = "照片已经准备好";
    setMessage("确认照片清楚后，点击“开始识别照片”。");
  }

  async function loadImage(file) {
    if ("createImageBitmap" in window) {
      try {
        return await createImageBitmap(file);
      } catch {
        // Safari can preview some camera formats that createImageBitmap cannot decode.
      }
    }
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("image-decode"));
      };
      image.src = url;
    });
  }

  async function preparePhoto(file) {
    const image = await loadImage(file);
    const sourceWidth = image.width || image.naturalWidth;
    const sourceHeight = image.height || image.naturalHeight;
    const scale = Math.min(1, 2200 / Math.max(sourceWidth, sourceHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = canvas.getContext("2d", { willReadFrequently: false });
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.filter = "grayscale(1) contrast(1.28)";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (typeof image.close === "function") image.close();
    return new Promise((resolve) => canvas.toBlob((blob) => resolve({
      blob: blob || file,
      width: canvas.width,
      height: canvas.height
    }), "image/jpeg", 0.94));
  }

  function loadTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${TESSERACT_URL}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.Tesseract), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = TESSERACT_URL;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(window.Tesseract);
      script.onerror = reject;
      document.head.append(script);
    });
  }

  function updateOcrProgress(message) {
    const progress = Math.max(0, Math.min(1, Number(message.progress) || 0));
    dom.scanProgress.style.width = `${Math.round(progress * 100)}%`;
    if (message.status === "recognizing text") {
      dom.scanStatus.textContent = `正在识别文字 ${Math.round(progress * 100)}%`;
    } else if (message.status) {
      dom.scanStatus.textContent = "正在准备识别工具…";
    }
  }

  function withTimeout(promise, timeoutMs, message) {
    let timer = null;
    const timeout = new Promise((_, reject) => {
      timer = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    });
    return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer));
  }

  async function scanPhoto() {
    if (!selectedPhoto || dom.scanButton.disabled) return;
    dom.scanButton.disabled = true;
    dom.scanLine.classList.add("is-scanning");
    dom.scanStatus.textContent = "正在准备照片…";
    dom.scanProgress.style.width = "3%";
    setMessage("首次识别需要下载文字模型，可能要等一会儿，请不要关闭页面。");
    let worker = null;
    try {
      const preparedPhoto = await preparePhoto(selectedPhoto);
      const tesseract = await loadTesseract();
      const workerOptions = {
        logger: updateOcrProgress,
        workerPath: new URL("./vendor/tesseract/worker.min.js", document.baseURI).href,
        langPath: new URL("./vendor/tesseract/lang", document.baseURI).href,
        corePath: new URL("./vendor/tesseract", document.baseURI).href
      };
      worker = await withTimeout(
        tesseract.createWorker(["eng", "chi_sim"], 1, workerOptions),
        60000,
        "ocr-worker-timeout"
      );
      await worker.setParameters({ preserve_interword_spaces: "1", tessedit_pageseg_mode: "11" });
      const result = await withTimeout(
        worker.recognize(preparedPhoto.blob, {}, { text: true, tsv: true }),
        90000,
        "ocr-recognition-timeout"
      );
      const text = String(result?.data?.text || "").trim();
      dom.importText.value = text;
      dom.scanProgress.style.width = "100%";
      dom.scanStatus.textContent = "识别完成，请检查词条";
      const tableEntries = entriesFromTsv(result?.data?.tsv, preparedPhoto.width, preparedPhoto.height);
      const textEntries = entriesFromText(text);
      setReviewEntries(tableEntries.length >= 2 ? tableEntries : textEntries);
    } catch (error) {
      console.error(error);
      dom.scanStatus.textContent = "这张照片暂时没有识别成功";
      setMessage("照片识别失败。请换一张更清楚的照片，或使用“粘贴词表”。", true);
    } finally {
      if (worker) await worker.terminate().catch(() => {});
      dom.scanButton.disabled = false;
      dom.scanLine.classList.remove("is-scanning");
    }
  }

  function saveWordPack() {
    const name = dom.name.value.trim() || suggestedPackName();
    const selected = reviewEntries
      .filter((entry) => entry.selected)
      .map((entry) => ({ ...entry, word: entry.word.trim(), meaning: entry.meaning.trim() }))
      .filter((entry) => wordLooksValid(entry.word));
    if (!selected.length) {
      setMessage("请至少保留一个要导入的单词。", true);
      return;
    }
    const missingMeaning = selected.find((entry) => !entry.meaning || entry.meaning === "待补充释义");
    if (missingMeaning) {
      setMessage(`请先补充 “${missingMeaning.word}” 的中文释义。`, true);
      return;
    }
    const packId = uid("pack");
    const storedEntries = selected.map((entry) => ({
      word: entry.word,
      pronunciation: entry.pronunciation,
      part: entry.part,
      meaning: entry.meaning,
      note: `来自词包：${name}。`,
      source: name,
      packId,
      difficulty: entry.difficulty
    }));
    if (typeof appendImportedWords !== "function" || !appendImportedWords(storedEntries)) {
      setMessage("词库没有保存成功，请稍后再试。", true);
      return;
    }
    const pack = {
      id: packId,
      name,
      sourceType: dom.source.value,
      lesson: dom.lesson.value.trim(),
      wordIds: [...new Set(storedEntries.map((entry) => createWordId(entry.word)))],
      createdAt: Date.now()
    };
    store.packs.push(pack);
    store.activePackId = pack.id;
    saveStore();
    renderPackLibrary();
    dispatchPackChange("import");
    setMessage(`“${name}”已经保存，共 ${pack.wordIds.length} 个词。`);
    window.setTimeout(closeImport, 650);
  }

  function bindEvents() {
    dom.close.addEventListener("click", closeImport);
    dom.modal.addEventListener("click", (event) => {
      if (event.target === dom.modal) closeImport();
    });
    document.querySelectorAll("[data-import-method]").forEach((button) => {
      button.addEventListener("click", () => selectMethod(button.dataset.importMethod));
    });
    dom.source.addEventListener("change", updateSuggestedName);
    dom.lesson.addEventListener("input", updateSuggestedName);
    dom.name.addEventListener("input", () => { packNameWasEdited = true; });
    dom.photoInput.addEventListener("change", handlePhotoSelection);
    dom.scanButton.addEventListener("click", scanPhoto);
    dom.parseButton.addEventListener("click", parsePastedWords);
    dom.manualAdd.addEventListener("click", addManualWord);
    [dom.manualWord, dom.manualMeaning].forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") addManualWord();
      });
    });
    dom.save.addEventListener("click", saveWordPack);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dom.modal.hidden) closeImport();
    });
  }

  syncLooseWords();
  saveStore();
  bindEvents();
  renderPackLibrary();

  window.WordPacks = {
    openImport,
    closeImport,
    getPacks,
    getPack,
    getActivePack,
    getWordsForPack,
    setActivePack,
    syncLooseWords
  };
})();
