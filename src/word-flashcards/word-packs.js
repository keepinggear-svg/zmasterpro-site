(() => {
  "use strict";

  const PACK_STORAGE_KEY = "word-flashcards-packs-v1";
  const TESSERACT_URL = "./vendor/tesseract/tesseract.min.js";
  const sourceLabels = {
    school: "学校课堂",
    teacher: "老师词表",
    homework: "家庭作业",
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
    cropArea: document.getElementById("wordPhotoCropArea"),
    cropBox: document.getElementById("wordPhotoCropBox"),
    cropReset: document.getElementById("resetPhotoCropButton"),
    cropHint: document.getElementById("photoCropHint"),
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
  let cropSelection = { left: 0, top: 0, right: 1, bottom: 1 };
  let cropDrag = null;
  let activeOcrPass = 0;
  let totalOcrPasses = 1;
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
    dom.scanStatus.textContent = "照片已准备好，请先框住词表";
    resetCropSelection();
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
    dom.source.value = "school";
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

    const pairedColumnRows = rows.filter((row) => {
      const candidates = row.tokens.filter((token) => {
        const cleaned = token.text.replace(/^[^a-z]+|[^a-z'-]+$/gi, "");
        return wordLooksValid(cleaned);
      });
      return candidates.some((token) => token.centerX < imageWidth * 0.44)
        && candidates.some((token) => token.centerX > imageWidth * 0.56);
    }).length;
    const columnCount = imageWidth / imageHeight >= 1.35 || pairedColumnRows >= 2 ? 2 : 1;
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
          return relativeX < 0.36 && wordLooksValid(cleaned) && !ignoredEnglish.test(cleaned);
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
          uncertain,
          confidence: wordToken.confidence
        });
      }
    });
    const byId = new Map();
    entries.forEach((entry) => byId.set(createWordId(entry.word), entry));
    return [...byId.values()];
  }

  function mergeOcrEntries(...entrySets) {
    const byId = new Map();
    entrySets.flat().forEach((entry) => {
      if (!entry || !wordLooksValid(entry.word)) return;
      const id = createWordId(entry.word);
      const previous = byId.get(id);
      if (!previous) {
        byId.set(id, { ...entry, detections: 1 });
        return;
      }
      const confidence = Math.max(Number(previous.confidence) || 0, Number(entry.confidence) || 0);
      const meaning = String(previous.meaning || "").length >= String(entry.meaning || "").length
        ? previous.meaning
        : entry.meaning;
      const detections = (previous.detections || 1) + 1;
      byId.set(id, {
        ...previous,
        word: confidence === Number(entry.confidence) ? entry.word : previous.word,
        meaning,
        confidence,
        detections,
        selected: previous.selected || entry.selected || detections >= 2,
        uncertain: Boolean(previous.uncertain && entry.uncertain && detections < 2)
      });
    });
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
      const uncertainCount = reviewEntries.length - selectedCount;
      setMessage(uncertainCount
        ? `识别出 ${selectedCount} 个较可信词；另有 ${uncertainCount} 个不确定候选已收起，请检查后保存。`
        : `识别出 ${selectedCount} 个词，请检查英文和中文后保存。`);
    } else {
      setMessage("没有识别到英文词条。可以换一张更清楚的照片，或切换到粘贴词表。", true);
    }
  }

  function renderReview() {
    dom.review.hidden = reviewEntries.length === 0;
    dom.reviewCount.textContent = `${reviewEntries.filter((entry) => entry.selected).length} 个词`;
    dom.reviewList.replaceChildren();
    const uncertainEntries = [];
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
      if (entry.selected) {
        dom.reviewList.append(row);
      } else {
        uncertainEntries.push(row);
      }
    });
    if (uncertainEntries.length) {
      const details = document.createElement("details");
      details.className = "uncertain-review-group";
      const summary = document.createElement("summary");
      summary.textContent = `查看 ${uncertainEntries.length} 个不确定候选（默认不导入）`;
      const list = document.createElement("div");
      list.className = "uncertain-review-list";
      list.append(...uncertainEntries);
      details.append(summary, list);
      dom.reviewList.append(details);
    }
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

  function previewImageBounds() {
    const wrap = dom.cropArea.getBoundingClientRect();
    const naturalWidth = dom.photoPreview.naturalWidth || 1;
    const naturalHeight = dom.photoPreview.naturalHeight || 1;
    const imageRatio = naturalWidth / naturalHeight;
    const wrapRatio = wrap.width / Math.max(1, wrap.height);
    let width = wrap.width;
    let height = wrap.height;
    let left = 0;
    let top = 0;
    if (imageRatio > wrapRatio) {
      height = width / imageRatio;
      top = (wrap.height - height) / 2;
    } else {
      width = height * imageRatio;
      left = (wrap.width - width) / 2;
    }
    return { wrap, left, top, width, height };
  }

  function renderCropSelection() {
    if (!dom.photoPreview.naturalWidth || dom.photoPreviewWrap.hidden) return;
    const bounds = previewImageBounds();
    dom.cropBox.style.left = `${bounds.left + cropSelection.left * bounds.width}px`;
    dom.cropBox.style.top = `${bounds.top + cropSelection.top * bounds.height}px`;
    dom.cropBox.style.width = `${(cropSelection.right - cropSelection.left) * bounds.width}px`;
    dom.cropBox.style.height = `${(cropSelection.bottom - cropSelection.top) * bounds.height}px`;
  }

  function resetCropSelection() {
    cropSelection = { left: 0, top: 0, right: 1, bottom: 1 };
    cropDrag = null;
    if (dom.cropHint) dom.cropHint.textContent = "用手指框住单词表，能明显提高识别准确率";
    window.requestAnimationFrame(renderCropSelection);
  }

  function cropPointFromEvent(event) {
    const bounds = previewImageBounds();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.wrap.left - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.wrap.top - bounds.top) / bounds.height));
    return { x, y };
  }

  function beginCropSelection(event) {
    if (!selectedPhoto || dom.scanButton.disabled) return;
    event.preventDefault();
    const point = cropPointFromEvent(event);
    cropDrag = { pointerId: event.pointerId, start: point };
    dom.cropArea.setPointerCapture?.(event.pointerId);
    cropSelection = { left: point.x, top: point.y, right: point.x, bottom: point.y };
    renderCropSelection();
  }

  function moveCropSelection(event) {
    if (!cropDrag || cropDrag.pointerId !== event.pointerId) return;
    event.preventDefault();
    const point = cropPointFromEvent(event);
    cropSelection = {
      left: Math.min(cropDrag.start.x, point.x),
      top: Math.min(cropDrag.start.y, point.y),
      right: Math.max(cropDrag.start.x, point.x),
      bottom: Math.max(cropDrag.start.y, point.y)
    };
    renderCropSelection();
  }

  function finishCropSelection(event) {
    if (!cropDrag || cropDrag.pointerId !== event.pointerId) return;
    moveCropSelection(event);
    cropDrag = null;
    const width = cropSelection.right - cropSelection.left;
    const height = cropSelection.bottom - cropSelection.top;
    if (width < 0.08 || height < 0.08) {
      resetCropSelection();
      setMessage("框选范围太小，已恢复使用整张照片。请从词表左上角拖到右下角。");
      return;
    }
    dom.cropHint.textContent = "黄色框内会被识别；不满意可以直接重新框选";
    dom.scanStatus.textContent = "框选完成，可以开始识别";
  }

  function handlePhotoSelection() {
    const file = dom.photoInput.files?.[0];
    if (!file) return;
    selectedPhoto = file;
    if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
    selectedPhotoUrl = URL.createObjectURL(file);
    dom.photoPreview.src = selectedPhotoUrl;
    dom.photoPreview.onload = resetCropSelection;
    dom.photoPreviewWrap.hidden = false;
    dom.scanProgress.style.width = "0%";
    dom.scanStatus.textContent = "照片已准备好，请先框住词表";
    setMessage("先用手指框住英文和中文词表，再点击“识别框选区域”。");
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

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("image-encode")), "image/png");
    });
  }

  function otsuThreshold(histogram, pixelCount) {
    let total = 0;
    for (let value = 0; value < 256; value += 1) total += value * histogram[value];
    let backgroundWeight = 0;
    let backgroundTotal = 0;
    let bestVariance = -1;
    let bestThreshold = 170;
    for (let value = 0; value < 256; value += 1) {
      backgroundWeight += histogram[value];
      if (!backgroundWeight) continue;
      const foregroundWeight = pixelCount - backgroundWeight;
      if (!foregroundWeight) break;
      backgroundTotal += value * histogram[value];
      const meanBackground = backgroundTotal / backgroundWeight;
      const meanForeground = (total - backgroundTotal) / foregroundWeight;
      const variance = backgroundWeight * foregroundWeight * ((meanBackground - meanForeground) ** 2);
      if (variance > bestVariance) {
        bestVariance = variance;
        bestThreshold = value;
      }
    }
    return bestThreshold;
  }

  async function preparePhoto(file) {
    const image = await loadImage(file);
    const sourceWidth = image.width || image.naturalWidth;
    const sourceHeight = image.height || image.naturalHeight;
    const sourceX = Math.round(cropSelection.left * sourceWidth);
    const sourceY = Math.round(cropSelection.top * sourceHeight);
    const cropWidth = Math.max(1, Math.round((cropSelection.right - cropSelection.left) * sourceWidth));
    const cropHeight = Math.max(1, Math.round((cropSelection.bottom - cropSelection.top) * sourceHeight));
    const longestEdge = Math.max(cropWidth, cropHeight);
    let scale = Math.min(2, 2600 / longestEdge);
    if (longestEdge * scale < 1500) scale = Math.min(2, 1500 / longestEdge);

    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = Math.max(1, Math.round(cropWidth * scale));
    sourceCanvas.height = Math.max(1, Math.round(cropHeight * scale));
    const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
    sourceContext.fillStyle = "#ffffff";
    sourceContext.fillRect(0, 0, sourceCanvas.width, sourceCanvas.height);
    sourceContext.drawImage(
      image,
      sourceX,
      sourceY,
      cropWidth,
      cropHeight,
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height
    );
    if (typeof image.close === "function") image.close();

    const sourceData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const pixelCount = sourceCanvas.width * sourceCanvas.height;
    const gray = new Uint8Array(pixelCount);
    const histogram = new Uint32Array(256);
    for (let index = 0; index < pixelCount; index += 1) {
      const offset = index * 4;
      const value = Math.round(
        sourceData.data[offset] * 0.299
        + sourceData.data[offset + 1] * 0.587
        + sourceData.data[offset + 2] * 0.114
      );
      gray[index] = value;
      histogram[value] += 1;
    }

    const otsu = otsuThreshold(histogram, pixelCount);
    const enhancedCanvas = document.createElement("canvas");
    enhancedCanvas.width = sourceCanvas.width;
    enhancedCanvas.height = sourceCanvas.height;
    const enhancedContext = enhancedCanvas.getContext("2d");
    const enhancedData = enhancedContext.createImageData(sourceCanvas.width, sourceCanvas.height);
    for (let index = 0; index < pixelCount; index += 1) {
      const offset = index * 4;
      const centered = (gray[index] - Math.min(150, otsu)) * 1.34 + 150;
      const value = Math.max(0, Math.min(255, Math.round(centered)));
      enhancedData.data[offset] = value;
      enhancedData.data[offset + 1] = value;
      enhancedData.data[offset + 2] = value;
      enhancedData.data[offset + 3] = 255;
    }
    enhancedContext.putImageData(enhancedData, 0, 0);

    const width = sourceCanvas.width;
    const height = sourceCanvas.height;
    const integralWidth = width + 1;
    const integral = new Uint32Array((width + 1) * (height + 1));
    for (let y = 0; y < height; y += 1) {
      let rowSum = 0;
      for (let x = 0; x < width; x += 1) {
        rowSum += gray[y * width + x];
        integral[(y + 1) * integralWidth + x + 1] = integral[y * integralWidth + x + 1] + rowSum;
      }
    }

    const thresholdCanvas = document.createElement("canvas");
    thresholdCanvas.width = width;
    thresholdCanvas.height = height;
    const thresholdContext = thresholdCanvas.getContext("2d");
    const thresholdData = thresholdContext.createImageData(width, height);
    const radius = Math.max(12, Math.min(30, Math.round(Math.min(width, height) / 70)));
    for (let y = 0; y < height; y += 1) {
      const top = Math.max(0, y - radius);
      const bottom = Math.min(height - 1, y + radius);
      for (let x = 0; x < width; x += 1) {
        const left = Math.max(0, x - radius);
        const right = Math.min(width - 1, x + radius);
        const sum = integral[(bottom + 1) * integralWidth + right + 1]
          - integral[top * integralWidth + right + 1]
          - integral[(bottom + 1) * integralWidth + left]
          + integral[top * integralWidth + left];
        const area = (right - left + 1) * (bottom - top + 1);
        const localMean = sum / area;
        const current = gray[y * width + x];
        const value = current < localMean - 10 && current < 220 ? 0 : 255;
        const offset = (y * width + x) * 4;
        thresholdData.data[offset] = value;
        thresholdData.data[offset + 1] = value;
        thresholdData.data[offset + 2] = value;
        thresholdData.data[offset + 3] = 255;
      }
    }
    thresholdContext.putImageData(thresholdData, 0, 0);

    const [enhancedBlob, thresholdBlob] = await Promise.all([
      canvasToBlob(enhancedCanvas),
      canvasToBlob(thresholdCanvas)
    ]);
    return { enhancedBlob, thresholdBlob, width, height };
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
    const combinedProgress = (activeOcrPass + progress) / totalOcrPasses;
    dom.scanProgress.style.width = `${Math.round(combinedProgress * 96)}%`;
    if (message.status === "recognizing text") {
      const passName = totalOcrPasses > 1
        ? (activeOcrPass === 0 ? "正在读取词表结构" : "正在校对模糊文字")
        : "正在识别文字";
      dom.scanStatus.textContent = `${passName} ${Math.round(progress * 100)}%`;
    } else if (message.status) {
      dom.scanStatus.textContent = "正在准备本地识别工具…";
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
      activeOcrPass = 0;
      totalOcrPasses = 2;
      await worker.setParameters({ preserve_interword_spaces: "1", tessedit_pageseg_mode: "11" });
      const layoutResult = await withTimeout(
        worker.recognize(preparedPhoto.enhancedBlob, {}, { text: true, tsv: true }),
        120000,
        "ocr-recognition-timeout"
      );
      activeOcrPass = 1;
      await worker.setParameters({ preserve_interword_spaces: "1", tessedit_pageseg_mode: "6" });
      const clarityResult = await withTimeout(
        worker.recognize(preparedPhoto.thresholdBlob, {}, { text: true, tsv: true }),
        120000,
        "ocr-recognition-timeout"
      );
      const layoutText = String(layoutResult?.data?.text || "").trim();
      const clarityText = String(clarityResult?.data?.text || "").trim();
      dom.importText.value = layoutText || clarityText;
      dom.scanProgress.style.width = "100%";
      dom.scanStatus.textContent = "识别完成，请逐个检查";
      const layoutEntries = entriesFromTsv(layoutResult?.data?.tsv, preparedPhoto.width, preparedPhoto.height);
      const clarityEntries = entriesFromTsv(clarityResult?.data?.tsv, preparedPhoto.width, preparedPhoto.height);
      const tableEntries = mergeOcrEntries(layoutEntries, clarityEntries);
      const textEntries = entriesFromText([layoutText, clarityText].filter(Boolean).join("\n"));
      setReviewEntries(tableEntries.length >= 2 ? tableEntries : mergeOcrEntries(tableEntries, textEntries));
    } catch (error) {
      console.error(error);
      dom.scanStatus.textContent = "这张照片暂时没有识别成功";
      setMessage("照片识别失败。请换一张更清楚的照片，或使用“粘贴词表”。", true);
    } finally {
      if (worker) await worker.terminate().catch(() => {});
      activeOcrPass = 0;
      totalOcrPasses = 1;
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
    dom.cropArea.addEventListener("pointerdown", beginCropSelection);
    dom.cropArea.addEventListener("pointermove", moveCropSelection);
    dom.cropArea.addEventListener("pointerup", finishCropSelection);
    dom.cropArea.addEventListener("pointercancel", finishCropSelection);
    dom.cropReset.addEventListener("click", () => {
      resetCropSelection();
      dom.scanStatus.textContent = "将使用整张照片识别";
    });
    window.addEventListener("resize", renderCropSelection);
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
