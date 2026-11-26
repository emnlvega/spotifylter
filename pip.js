let pipWindow = null;
let pipSyncTimer = null;
let _lastPipGridSignature = "";

const PIP_WIDTH_KEY = "sp_pip_width";
const PIP_HEIGHT_KEY = "sp_pip_height";
const PIP_SHOW_META_KEY = "sp_pip_show_meta";
const PIP_SHOW_PROGRESS_KEY = "sp_pip_show_progress";

function getPipConfig() {
  const w = parseInt(localStorage.getItem(PIP_WIDTH_KEY) || "600", 10);
  const h = parseInt(localStorage.getItem(PIP_HEIGHT_KEY) || "180", 10);
  return {
    width: Number.isFinite(w) && w >= 240 ? w : 600,
    height: Number.isFinite(h) && h >= 120 ? h : 180,
    showMeta: localStorage.getItem(PIP_SHOW_META_KEY) !== "0",
    showProgress: localStorage.getItem(PIP_SHOW_PROGRESS_KEY) !== "0"
  };
}

function savePipConfig(cfg) {
  localStorage.setItem(PIP_WIDTH_KEY, String(cfg.width));
  localStorage.setItem(PIP_HEIGHT_KEY, String(cfg.height));
  localStorage.setItem(PIP_SHOW_META_KEY, cfg.showMeta ? "1" : "0");
  localStorage.setItem(PIP_SHOW_PROGRESS_KEY, cfg.showProgress ? "1" : "0");
}

function applyPipWindowSize(win, width, height) {
  if (!win || win.closed) return;
  try {
    win.resizeTo(width, height);
  } catch (_) {}
}

function showPipSettings() {
  const existing = document.getElementById("pip-settings");
  if (existing) {
    existing.remove();
    return;
  }

  const host = document.getElementById("tool-panel-host") || document.querySelector(".songs-panel")?.parentElement;
  if (!host) return;

  const cfg = getPipConfig();
  const panel = document.createElement("div");
  panel.id = "pip-settings";
  panel.className = "preview-settings pip-settings";
  panel.addEventListener("click", e => e.stopPropagation());

  const makeNumberRow = (labelText, initialVal, onChange) => {
    const row = document.createElement("div");
    row.className = "preview-setting-row";
    const lbl = document.createElement("span");
    lbl.textContent = labelText;
    const input = document.createElement("input");
    input.type = "number";
    input.min = "100";
    input.max = "1600";
    input.className = "preview-setting-input";
    input.value = String(initialVal);
    input.addEventListener("change", () => onChange(parseInt(input.value, 10)));
    row.append(lbl, input);
    return { row, input };
  };

  let curWidth = cfg.width;
  let curHeight = cfg.height;
  let curMeta = cfg.showMeta;
  let curProgress = cfg.showProgress;

  const wRow = makeNumberRow("Width (px)", curWidth, v => {
    if (Number.isFinite(v) && v >= 240) curWidth = v;
  });
  const hRow = makeNumberRow("Height (px)", curHeight, v => {
    if (Number.isFinite(v) && v >= 120) curHeight = v;
  });

  const makeToggleRow = (labelText, state, onToggle) => {
    const row = document.createElement("div");
    row.className = "preview-setting-row";
    const lbl = document.createElement("span");
    lbl.textContent = labelText;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "skip-toggle" + (state ? " on" : "");
    const paint = val => {
      btn.classList.toggle("on", val);
      btn.innerHTML = val
        ? '<i class="fa-solid fa-toggle-on"></i><span>ON</span>'
        : '<i class="fa-solid fa-toggle-off"></i><span>OFF</span>';
    };
    paint(state);
    btn.addEventListener("click", () => {
      const next = onToggle();
      paint(next);
    });
    row.append(lbl, btn);
    return row;
  };

  const metaRow = makeToggleRow("Title & Artist", curMeta, () => {
    curMeta = !curMeta;
    return curMeta;
  });

  const progRow = makeToggleRow("Progress Bar", curProgress, () => {
    curProgress = !curProgress;
    return curProgress;
  });

  const actions = document.createElement("div");
  actions.className = "tool-actions";

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.textContent = "Reset";
  resetBtn.addEventListener("click", () => {
    curWidth = 600;
    curHeight = 180;
    curMeta = true;
    curProgress = true;
    wRow.input.value = "600";
    hRow.input.value = "180";
    localStorage.setItem(PIP_WIDTH_KEY, "600");
    localStorage.setItem(PIP_HEIGHT_KEY, "180");
    savePipConfig({ width: curWidth, height: curHeight, showMeta: curMeta, showProgress: curProgress });
    applyPipWindowSize(pipWindow, curWidth, curHeight);
    panel.remove();
    showPipSettings();
    syncPipState();
  });

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "tool-create";
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => {
    const w = parseInt(wRow.input.value, 10);
    const h = parseInt(hRow.input.value, 10);
    if (Number.isFinite(w) && w >= 240) curWidth = w;
    if (Number.isFinite(h) && h >= 120) curHeight = h;
    savePipConfig({ width: curWidth, height: curHeight, showMeta: curMeta, showProgress: curProgress });
    applyPipWindowSize(pipWindow, curWidth, curHeight);
    panel.remove();
    syncPipState();
    setFeedback("PiP settings saved (" + curWidth + "x" + curHeight + ")", false);
  });

  actions.append(resetBtn, saveBtn);
  panel.append(wRow.row, hRow.row, metaRow, progRow, actions);
  host.appendChild(panel);
}

async function togglePipMode() {
  if (pipWindow && !pipWindow.closed) {
    pipWindow.close();
    return;
  }
  if (!("documentPictureInPicture" in window)) {
    setFeedback("ERROR Document Picture-in-Picture not supported", true);
    return;
  }

  clearInterval(pipSyncTimer);
  pipSyncTimer = null;
  _lastPipGridSignature = "";

  const cfg = getPipConfig();

  try {
    pipWindow = await documentPictureInPicture.requestWindow({
      width: cfg.width,
      height: cfg.height
    });
    applyPipWindowSize(pipWindow, cfg.width, cfg.height);

    for (const styleSheet of document.styleSheets) {
      try {
        if (styleSheet.href) {
          const link = pipWindow.document.createElement("link");
          link.rel = "stylesheet";
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        } else {
          const cssRules = [...styleSheet.cssRules].map(r => r.cssText).join("\n");
          const style = pipWindow.document.createElement("style");
          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        }
      } catch (_) {}
    }

    buildPipLayout(pipWindow.document);
    syncPipState();
    pipSyncTimer = setInterval(syncPipState, 200);

    pipWindow.addEventListener("pagehide", () => {
      clearInterval(pipSyncTimer);
      pipSyncTimer = null;
      _lastPipGridSignature = "";
      pipWindow = null;
      const pipBtn = document.getElementById("pip-mode-btn");
      if (pipBtn) pipBtn.classList.remove("active");
    }, { once: true });

    const pipBtn = document.getElementById("pip-mode-btn");
    if (pipBtn) pipBtn.classList.add("active");
  } catch (err) {
    pipWindow = null;
    setFeedback("ERROR PiP: " + err.message, true);
  }
}

function buildPipProgressRow() {
  const row = document.createElement("div");
  row.id = "pip-progress-row";
  row.className = "pip-progress-row";

  const elapsed = document.createElement("span");
  elapsed.id = "pip-time-elapsed";
  elapsed.className = "pip-time-label";
  elapsed.textContent = "0:00";

  const progressWrap = document.createElement("div");
  progressWrap.id = "pip-progress-wrap";
  progressWrap.className = "np-progress pip-progress";

  const presetsLayer = document.createElement("div");
  presetsLayer.id = "pip-preset-splits";
  presetsLayer.className = "pip-preset-splits";

  const progressBar = document.createElement("div");
  progressBar.id = "pip-progress-bar";
  progressWrap.append(presetsLayer, progressBar);

  progressWrap.addEventListener("click", async e => {
    if (progressWrap.dataset.presetHit === "1") {
      delete progressWrap.dataset.presetHit;
      return;
    }
    if (!player || !currentTrack) return;
    const rect = progressWrap.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const duration = currentTrack.durationMs || (lastState && lastState.duration) || 1;
    await player.seek(Math.floor(fraction * duration));
    syncPipState();
  });

  const total = document.createElement("span");
  total.id = "pip-time-total";
  total.className = "pip-time-label";
  total.textContent = "0:00";

  row.append(elapsed, progressWrap, total);
  return row;
}

function syncPipProgress(doc, cfg) {
  const row = doc.getElementById("pip-progress-row");
  if (!row) return;
  row.style.display = cfg.showProgress ? "flex" : "none";
  if (!cfg.showProgress) return;

  const hasTrack = Boolean(currentTrack);
  const dur = Math.max(1, (currentTrack && currentTrack.durationMs) || (lastState && lastState.duration) || 0);
  let pos = 0;
  if (lastState) {
    pos = lastState.paused
      ? lastState.position
      : lastState.position + (Date.now() - lastState.timestamp);
    pos = Math.min(dur, Math.max(0, pos));
  }

  const elapsedEl = doc.getElementById("pip-time-elapsed");
  const totalEl = doc.getElementById("pip-time-total");
  if (elapsedEl) elapsedEl.textContent = typeof formatMs === "function" ? formatMs(pos) : "0:00";
  if (totalEl) totalEl.textContent = typeof formatMs === "function" ? formatMs(dur) : "0:00";

  const pipBar = doc.getElementById("pip-progress-bar");
  if (pipBar) {
    pipBar.style.position = "relative";
    pipBar.style.zIndex = "3";
    pipBar.style.width = (pos / dur * 100) + "%";
  }

  const splitsEl = doc.getElementById("pip-preset-splits");
  const progressWrap = doc.getElementById("pip-progress-wrap");
  if (!splitsEl || !progressWrap) return;

  progressWrap.style.position = "relative";
  progressWrap.style.overflow = "hidden";
  splitsEl.style.position = "absolute";
  splitsEl.style.inset = "0";
  splitsEl.style.zIndex = "1";
  splitsEl.style.pointerEvents = "none";

  let activeRangeLayer = progressWrap.querySelector(".preset-time-range-highlight");
  if (!activeRangeLayer) {
    activeRangeLayer = doc.createElement("div");
    activeRangeLayer.className = "preset-time-range-highlight";
    progressWrap.insertBefore(activeRangeLayer, splitsEl);
  }
  activeRangeLayer.style.position = "absolute";
  activeRangeLayer.style.top = "0";
  activeRangeLayer.style.bottom = "0";
  activeRangeLayer.style.zIndex = "0";
  activeRangeLayer.style.pointerEvents = "none";

  const presetRanges = [
    { key: "A", preset: "A", start: 0.0, end: 0.20, seekMs: typeof previewPosition === "function" ? previewPosition(dur, "A") : Math.floor(dur * 0.20) },
    { key: "A", preset: "B", start: 0.20, end: 0.35, seekMs: typeof previewPosition === "function" ? previewPosition(dur, "B") : Math.floor(dur * 0.20) },
    { key: "B", preset: "C", start: 0.35, end: 0.50, seekMs: typeof previewPosition === "function" ? previewPosition(dur, "C") : Math.floor(dur * 0.35) },
    { key: "C", preset: "D", start: 0.50, end: 0.65, seekMs: typeof previewPosition === "function" ? previewPosition(dur, "D") : Math.floor(dur * 0.50) },
    { key: "D", preset: "E", start: 0.65, end: 0.80, seekMs: typeof previewPosition === "function" ? previewPosition(dur, "E") : Math.floor(dur * 0.65) },
    { key: "E", preset: "E", start: 0.80, end: 1, seekMs: typeof previewPosition === "function" ? previewPosition(dur, "E") : Math.floor(dur * 0.80) }
  ];
  const count = presetRanges.length;

  const findSplitIdxAt = clientX => {
    const rect = splitsEl.getBoundingClientRect();
    if (!rect.width) return -1;
    let bestIdx = -1;
    let bestDist = 11;
    for (let i = 0; i < count - 1; i++) {
      const boundaryX = rect.left + rect.width * presetRanges[i].end;
      const dist = Math.abs(clientX - boundaryX);
      if (dist <= 10 && dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  if (splitsEl.children.length !== count) {
    splitsEl.innerHTML = "";
    splitsEl.style.pointerEvents = "none";
    splitsEl.style.cursor = "";
    for (let idx = 0; idx < count; idx++) {
      const seg = doc.createElement("span");
      seg.className = "pip-preset-seg";
      seg.dataset.idx = String(idx);
      seg.style.position = "relative";
      seg.style.width = ((presetRanges[idx].end - presetRanges[idx].start) * 100) + "%";
      splitsEl.appendChild(seg);
    }
    progressWrap.addEventListener("pointermove", ev => {
      const hitIdx = findSplitIdxAt(ev.clientX);
      progressWrap.style.cursor = hitIdx >= 0 ? "pointer" : "";
      for (let i = 0; i < splitsEl.children.length; i++) {
        splitsEl.children[i].classList.toggle("is-hover", i === hitIdx);
      }
    });
    progressWrap.addEventListener("pointerleave", () => {
      progressWrap.style.cursor = "";
      for (let i = 0; i < splitsEl.children.length; i++) {
        splitsEl.children[i].classList.remove("is-hover");
      }
    });
    progressWrap.addEventListener("click", async ev => {
      const hitIdx = findSplitIdxAt(ev.clientX);
      if (hitIdx < 0) return;
      progressWrap.dataset.presetHit = "1";
      const item = presetRanges[hitIdx];
      if (!item) return;
      const activeDur = Math.max(1, (currentTrack && currentTrack.durationMs) || (lastState && lastState.duration) || dur);
      const targetMs = typeof previewPosition === "function" ? previewPosition(activeDur, item.preset) : Math.floor(item.start * activeDur);
      if (typeof presetTracking !== "undefined") presetTracking = true;
      if (typeof lastPaintedPreset !== "undefined") lastPaintedPreset = null;
      if (lastState) {
        lastState.position = targetMs;
        lastState.timestamp = Date.now();
      }
      if (OFFLINE && typeof applyOfflineSimulatedState === "function") {
        applyOfflineSimulatedState(lastState ? lastState.paused : false, targetMs);
      } else if (player) {
        await player.seek(targetMs);
      }
      syncPipState();
    }, { capture: true });
  }

  const presetOrder = ["A", "B", "C", "D", "E"];
  const presetPoints = presetOrder
    .map(p => ({ p, ms: typeof previewPosition === "function" ? previewPosition(dur, p) : null }))
    .filter(x => typeof x.ms === "number" && Number.isFinite(x.ms))
    .sort((a, b) => a.ms - b.ms);
  let matchedStartMs = null;
  let matchedEndMs = null;
  if (hasTrack && presetPoints.length) {
    if (pos < presetPoints[0].ms) {
      matchedStartMs = 0;
      matchedEndMs = presetPoints[0].ms;
    } else {
      for (let i = 0; i < presetPoints.length; i++) {
        if (pos >= presetPoints[i].ms) {
          matchedStartMs = presetPoints[i].ms;
          matchedEndMs = i + 1 < presetPoints.length ? presetPoints[i + 1].ms : dur;
        }
      }
    }
  }
  if (matchedStartMs !== null && matchedEndMs !== null && matchedEndMs > matchedStartMs && dur > 0) {
    const leftPct = Math.max(0, Math.min(100, (matchedStartMs / dur) * 100));
    const widthPct = Math.max(0, Math.min(100 - leftPct, ((matchedEndMs - matchedStartMs) / dur) * 100));
    activeRangeLayer.style.display = "block";
    activeRangeLayer.style.left = leftPct + "%";
    activeRangeLayer.style.width = widthPct + "%";
  } else {
    activeRangeLayer.style.display = "none";
    activeRangeLayer.style.left = "0%";
    activeRangeLayer.style.width = "0%";
  }

  for (let idx = 0; idx < count; idx++) {
    const seg = splitsEl.children[idx];
    if (!seg) continue;
    seg.style.width = ((presetRanges[idx].end - presetRanges[idx].start) * 100) + "%";
    seg.classList.remove("is-active");
    seg.style.zIndex = "2";
  }
}

let trackListPipWindow = null;
let trackListPipSyncTimer = null;

function copyStylesToWindow(targetWin) {
  for (const styleSheet of document.styleSheets) {
    try {
      if (styleSheet.href) {
        const link = targetWin.document.createElement("link");
        link.rel = "stylesheet";
        link.href = styleSheet.href;
        targetWin.document.head.appendChild(link);
      } else {
        const cssRules = [...styleSheet.cssRules].map(r => r.cssText).join("\n");
        const style = targetWin.document.createElement("style");
        style.textContent = cssRules;
        targetWin.document.head.appendChild(style);
      }
    } catch (_) {}
  }
}

function findMatchingMainControl(controlId, fallbackSelector) {
  if (controlId) {
    const byId = document.getElementById(controlId);
    if (byId) return byId;
  }
  return fallbackSelector ? document.querySelector(fallbackSelector) : null;
}

function syncTrackListControls(doc) {
  const pipSearch = doc.getElementById("pip-track-search");
  const mainSearch = findMatchingMainControl(null, '.songs-filter-input, input[type="search"], input[id*="search"], input[class*="search"], #track-search, #filter-search');
  if (pipSearch && mainSearch && doc.activeElement !== pipSearch && pipSearch.value !== mainSearch.value) {
    pipSearch.value = mainSearch.value;
  }

  const pipFilterSelect = doc.getElementById("pip-track-filter");
  const currentFilterVal = typeof songHiddenFilter !== "undefined"
    ? songHiddenFilter
    : (pipFilterSelect ? pipFilterSelect.value : "all");

  if (pipFilterSelect && pipFilterSelect.value !== currentFilterVal) {
    pipFilterSelect.value = currentFilterVal;
  }

  const stageBtns = doc.querySelectorAll("#pip-track-filter-stages button");
  for (const btn of stageBtns) {
    btn.classList.toggle("active", btn.dataset.value === currentFilterVal);
  }

  const pipTwoDots = doc.getElementById("pip-two-dots-btn");
  if (pipTwoDots && typeof ratingDot2Filter !== "undefined") {
    pipTwoDots.classList.toggle("on", ratingDot2Filter);
  }

  const pipThreeDots = doc.getElementById("pip-three-dots-btn");
  if (pipThreeDots && typeof ratingDot3Filter !== "undefined") {
    pipThreeDots.classList.toggle("on", ratingDot3Filter);
  }
}

function buildTrackListToolbar(doc) {
  const toolbar = doc.createElement("div");
  toolbar.id = "pip-track-toolbar";
  toolbar.className = "songs-filters";

  const filterWrap = doc.createElement("div");
  filterWrap.className = "songs-filter-wrap";

  const searchInput = doc.createElement("input");
  searchInput.type = "text";
  searchInput.id = "pip-track-search";
  searchInput.className = "songs-filter-input";
  searchInput.placeholder = "Search name or artist";

  const mainSearch = findMatchingMainControl(null, '.songs-filter-input, input[type="search"], input[id*="search"], input[class*="search"], #track-search, #filter-search');
  if (mainSearch) {
    searchInput.value = mainSearch.value || "";
    searchInput.addEventListener("input", () => {
      mainSearch.value = searchInput.value;
      mainSearch.dispatchEvent(new Event("input", { bubbles: true }));
      mainSearch.dispatchEvent(new Event("change", { bubbles: true }));
      syncTrackListPip();
    });
  }

  const filterClear = doc.createElement("button");
  filterClear.type = "button";
  filterClear.className = "songs-filter-clear";
  filterClear.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  filterClear.title = "Clear filter";
  filterClear.addEventListener("click", () => {
    searchInput.value = "";
    if (mainSearch) {
      mainSearch.value = "";
      mainSearch.dispatchEvent(new Event("input", { bubbles: true }));
      mainSearch.dispatchEvent(new Event("change", { bubbles: true }));
    }
    syncTrackListPip();
  });

  filterWrap.append(searchInput, filterClear);

  const filterSelect = doc.createElement("select");
  filterSelect.id = "pip-track-filter";
  filterSelect.className = "pip-track-filter";
  filterSelect.style.display = "none";
  filterSelect.append(
    new Option("All", "all"),
    new Option("Unfiltered", "unhidden"),
    new Option("Filtered", "hidden")
  );
  filterSelect.value = typeof songHiddenFilter !== "undefined" ? songHiddenFilter : "all";

  const hiddenStages = [
    { value: "all", label: "All" },
    { value: "unhidden", label: "Unfiltered" },
    { value: "hidden", label: "Filtered" }
  ];

  const hiddenStageGroup = doc.createElement("div");
  hiddenStageGroup.id = "pip-track-filter-stages";
  hiddenStageGroup.className = "stage-toggle-group";

  const hiddenStageBtns = [];

  const paintHiddenStages = val => {
    for (const btn of hiddenStageBtns) {
      btn.classList.toggle("active", btn.dataset.value === val);
    }
  };

  for (const st of hiddenStages) {
    const btn = doc.createElement("button");
    btn.type = "button";
    btn.className = "stage-toggle-btn";
    btn.dataset.value = st.value;
    btn.textContent = st.label;
    btn.addEventListener("click", () => {
      filterSelect.value = st.value;
      if (typeof songHiddenFilter !== "undefined") {
        songHiddenFilter = st.value;
      }
      if (typeof _lastDisplayKey !== "undefined") {
        _lastDisplayKey = "";
      }
      paintHiddenStages(st.value);
      if (typeof renderTracks === "function") {
        renderTracks();
      }
      syncTrackListPip();
    });
    hiddenStageBtns.push(btn);
    hiddenStageGroup.appendChild(btn);
  }

  paintHiddenStages(filterSelect.value);

  const twoDotsBtn = doc.createElement("button");
  twoDotsBtn.type = "button";
  twoDotsBtn.id = "pip-two-dots-btn";
  twoDotsBtn.className = "outline-btn" + (typeof ratingDot2Filter !== "undefined" && ratingDot2Filter ? " on" : "");
  twoDotsBtn.textContent = typeof RATING_LIST_2_NAME !== "undefined" ? RATING_LIST_2_NAME : "";
  twoDotsBtn.addEventListener("click", () => {
    if (typeof ratingDot2Filter !== "undefined") {
      ratingDot2Filter = !ratingDot2Filter;
      twoDotsBtn.classList.toggle("on", ratingDot2Filter);
    }
    if (typeof syncRatingDotFilterState === "function") {
      syncRatingDotFilterState();
    }
    syncTrackListPip();
  });

  const threeDotsBtn = doc.createElement("button");
  threeDotsBtn.type = "button";
  threeDotsBtn.id = "pip-three-dots-btn";
  threeDotsBtn.className = "outline-btn" + (typeof ratingDot3Filter !== "undefined" && ratingDot3Filter ? " on" : "");
  threeDotsBtn.textContent = typeof RATING_LIST_3_NAME !== "undefined" ? RATING_LIST_3_NAME : "";
  threeDotsBtn.addEventListener("click", () => {
    if (typeof ratingDot3Filter !== "undefined") {
      ratingDot3Filter = !ratingDot3Filter;
      threeDotsBtn.classList.toggle("on", ratingDot3Filter);
    }
    if (typeof syncRatingDotFilterState === "function") {
      syncRatingDotFilterState();
    }
    syncTrackListPip();
  });

  toolbar.append(filterWrap, filterSelect,  twoDotsBtn, threeDotsBtn, hiddenStageGroup);
  return toolbar;
}

function syncTrackListPip() {
  if (!trackListPipWindow || trackListPipWindow.closed) return;
  const doc = trackListPipWindow.document;
  if (!doc.body) return;

  const mainRootStyle = document.documentElement.style;
  for (let i = 0; i < mainRootStyle.length; i++) {
    const prop = mainRootStyle[i];
    if (prop.startsWith("--")) {
      doc.documentElement.style.setProperty(prop, mainRootStyle.getPropertyValue(prop));
    }
  }

  syncTrackListControls(doc);

  const sourceTrackList = document.getElementById("track-list");
  const pipTrackList = doc.getElementById("track-list");
  if (!sourceTrackList || !pipTrackList) return;

  const nextHtml = sourceTrackList.innerHTML;
  const isHovering = Boolean(doc.querySelector("#track-list > *:hover"));
  const hasPointerDown = Boolean(doc.querySelector("#track-list > *:active"));

  if (!isHovering && !hasPointerDown && pipTrackList.dataset.lastHtml !== nextHtml) {
    const prevScrollTop = pipTrackList.scrollTop;
    const scroller = doc.getElementById("pip-track-scroll");
    const prevScrollerTop = scroller ? scroller.scrollTop : 0;
    pipTrackList.dataset.lastHtml = nextHtml;
    pipTrackList.innerHTML = nextHtml;
    pipTrackList.querySelectorAll(".track-dur").forEach(el => el.remove());
    pipTrackList.scrollTop = prevScrollTop;
    if (scroller) scroller.scrollTop = prevScrollerTop;
  }
  pipTrackList.className = "np-grid-list";

  const pipSearch = doc.getElementById("pip-track-search");
  const query = (pipSearch ? pipSearch.value : "").trim().toLowerCase();

  for (const child of pipTrackList.children) {
    if (!child.classList.contains("track")) {
      child.classList.add("track");
    }
    const textMatch = !query || (child.textContent || "").toLowerCase().includes(query);
    child.style.display = textMatch ? "" : "none";
  }
}

function applyResponsiveTrackListMetrics(win, doc) {
  if (!win || win.closed || !doc) return;
  const wrap = doc.querySelector(".pip-track-list-wrap");
  const scroller = doc.getElementById("pip-track-scroll");
  const list = doc.getElementById("track-list");
  if (!wrap || !scroller || !list) return;

  const pad = 6;
  const gap = 6;
  const minCol = 72;
  const cardH = 104;
  const imgSize = 62;
  const titlePx = 10;
  const artistPx = 9;

  wrap.style.padding = pad + "px";
  wrap.style.gap = gap + "px";

  list.style.setProperty("grid-template-columns", `repeat(auto-fill, minmax(${minCol}px, 1fr))`, "important");
  list.style.setProperty("gap", gap + "px", "important");
  scroller.style.setProperty("--pip-card-h", cardH + "px");
  scroller.style.setProperty("--pip-img-size", imgSize + "px");
  scroller.style.setProperty("--pip-title-px", titlePx + "px");
  scroller.style.setProperty("--pip-artist-px", artistPx + "px");
}

let _lastTrackListPipToggleAt = 0;

async function toggleTrackListPip(forcePip = false) {
  const now = Date.now();
  if (now - _lastTrackListPipToggleAt < 350) {
    return;
  }
  _lastTrackListPipToggleAt = now;

  if (trackListPipWindow && !trackListPipWindow.closed) {
    trackListPipWindow.close();
    return;
  }
  if (!("documentPictureInPicture" in window)) {
    setFeedback("ERROR Document Picture-in-Picture not supported", true);
    return;
  }

  clearInterval(trackListPipSyncTimer);
  trackListPipSyncTimer = null;

try {
    const winW = 600;
    const winH = 350;
    const hasPip = Boolean(pipWindow && !pipWindow.closed);
    const pipLeft = hasPip
      ? (pipWindow.screenLeft ?? pipWindow.screenX ?? window.screenLeft ?? window.screenX ?? 0)
      : (window.screenLeft ?? window.screenX ?? 0);
    const pipTop = hasPip
      ? (pipWindow.screenTop ?? pipWindow.screenY ?? window.screenTop ?? window.screenY ?? 0)
      : (window.screenTop ?? window.screenY ?? 0);
    const offsetX = 0;
    const offsetY = -345;
    const targetLeft = Math.max(0, Math.round(pipLeft + offsetX));
    const targetTop = Math.max(0, Math.round(pipTop + offsetY));

    const targetWin = !forcePip && typeof window.open === "function"
      ? window.open("", "spotifylterTrackList", `popup=yes,width=${winW},height=${winH},left=${targetLeft},top=${targetTop}`)
      : null;

    if (targetWin) {
      trackListPipWindow = targetWin;
      const placeWindow = () => {
        if (!targetWin || targetWin.closed) return;
        try {
          targetWin.moveTo(targetLeft, targetTop);
          targetWin.resizeTo(winW, winH);
        } catch (_) {}
      };
      placeWindow();
      setTimeout(placeWindow, 50);
      setTimeout(placeWindow, 200);
    } else {
      trackListPipWindow = await documentPictureInPicture.requestWindow({
        width: winW,
        height: winH
      });
    }

    const doc = trackListPipWindow.document;
    doc.open();
    doc.write("<!DOCTYPE html><html><head><title>Track List</title></head><body></body></html>");
    doc.close();

    copyStylesToWindow(trackListPipWindow);

    doc.body.className = document.body.className;
    doc.body.innerHTML = "";

    const pipStyle = doc.createElement("style");
    pipStyle.textContent = `
      :root {
        --bg: #080808;
        --surface: #070708;
        --surface-2: #0f1013;
        --line: rgb(24, 44, 30);
        --text: #e8ecf2;
        --muted: rgb(72, 173, 86);
        --white: #ffffff;
        --grey: #777c8b;
        --accent: rgb(29, 185, 84);
        --action: rgb(26, 145, 67);
        --darkG: rgb(22, 102, 50);
        --blackG: rgb(14, 39, 27);
        --yellow: #d29922;
        --red: #da3633;
        --r-sm: 6px;
        --r-md: 10px;
        --r-lg: 14px;
        --np-art: 340px;
        --fast: .12s ease;
        --scndry1: rgb(155, 165, 175);
        --scndry2: rgb(110, 120, 130);
        --scndry3: rgb(70, 78, 86);
        --scndry4: rgb(22, 26, 30);
        --darkGrad: linear-gradient(135deg, var(--surface-2), var(--bg));
        --darkGrad2: linear-gradient(135deg, var(--bg), var(--surface-2));
        --primaryGrad: linear-gradient(135deg, var(--accent), var(--action));
        --secondaryGrad: linear-gradient(135deg, var(--scndry1), var(--scndry2));
        --backgroundGrad: linear-gradient(90deg, var(--surface), color-mix(in srgb, var(--scndry4) 50%, transparent), var(--surface)),
          var(--surface);
        --backgroundGrad2: linear-gradient(90deg, var(--scndry4), color-mix(in srgb, var(--surface) 50%, transparent), var(--scndry4)),
          var(--surface);
        --backgroundGrad3: linear-gradient(90deg, var(--darkG), color-mix(in srgb, var(--surface) 50%, transparent), var(--darkG)),
          var(--surface);
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: var(--backgroundGrad);
        color: var(--text);
      }
      .pip-track-list-wrap {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;
        height: 100%;
        padding: 6px;
        overflow: hidden;
        background: var(--backgroundGrad);
      }
      .pip-track-list-wrap .songs-filters {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }
      .pip-track-list-wrap .songs-filter-wrap {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
      }
      .pip-track-list-wrap .songs-filter-input {
        width: 100%;
        padding: 5px 24px 5px 8px;
        min-height: 35px;
        border-radius: var(--r-sm);
        border: 1px solid var(--line);
        background: var(--surface-2);
        color: var(--text);
        font-size: 11px;
      }
      .pip-track-list-wrap .songs-filter-clear {
        position: absolute;
        right: 5px;
        background: none;
        border: none;
        color: var(--text);
        cursor: pointer;
        padding: 2px 4px;
        font-size: 11px;
      }
      .pip-track-list-wrap .pip-track-filter {
        padding: 5px 6px;
        border-radius: var(--r-sm);
        border: 1px solid var(--line);
        background: var(--surface-2);
        color: var(--text);
        font-size: 11px;
      }
      .pip-track-scroll {
        flex: 1 1 0;
        min-height: 0;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .pip-track-scroll .np-grid-list,
      .pip-track-scroll #track-list {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)) !important;
        gap: 6px !important;
        max-height: none !important;
        overflow: visible !important;
        align-content: start;
        width: 100%;
        padding-bottom: 12px;
      }
      .pip-track-scroll .np-grid-list .track,
      .pip-track-scroll #track-list > * {
        position: relative;
        display: flex !important;
        flex-direction: column !important;
        gap: 4px !important;
        padding: 5px !important;
        height: var(--pip-card-h, 110px) !important;
        border-radius: var(--r-md);
        background: var(--darkGrad);
        border: 1px solid var(--surface-2);
        cursor: pointer;
        overflow: hidden;
        min-width: 0;
        max-width: 100%;
        width: auto !important;
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
      }
      .pip-track-scroll .np-grid-list .track.current,
      .pip-track-scroll #track-list > *.current,
      .pip-track-scroll .np-grid-list .track.active,
      .pip-track-scroll #track-list > *.active,
      .pip-track-scroll .np-grid-list .track.is-active,
      .pip-track-scroll #track-list > *.is-active,
      .pip-track-scroll .np-grid-list .track[aria-current="true"],
      .pip-track-scroll #track-list > *[aria-current="true"] {
        background: var(--primaryGrad);
        border-color: var(--accent);
      }
      .pip-track-scroll .np-grid-list .track:hover,
      .pip-track-scroll #track-list > *:hover {
        border-color: var(--accent);
      }
      .pip-track-scroll .np-grid-list .track img,
      .pip-track-scroll #track-list img {
        width: var(--pip-img-size, 64px) !important;
        height: var(--pip-img-size, 64px) !important;
        max-width: none !important;
        max-height: none !important;
        flex-shrink: 0;
        object-fit: cover;
        border-radius: var(--r-sm);
        display: block;
      }
      .pip-track-scroll .np-grid-list .track p,
      .pip-track-scroll #track-list p {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }
      .pip-track-scroll .np-grid-list .track-name,
      .pip-track-scroll #track-list .track-name {
        font-size: var(--pip-title-px, 11px) !important;
        font-weight: 600;
      }
      .pip-track-scroll .np-grid-list .track-artists,
      .pip-track-scroll #track-list .track-artists {
        font-size: var(--pip-artist-px, 10px) !important;
        color: var(--scndry1);
      }
      .pip-track-scroll .np-grid-list .recent-empty,
      .pip-track-scroll #track-list .recent-empty {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--muted);
        font-size: 12px;
        padding: 20px;
      }
    `;
    doc.head.appendChild(pipStyle);

    const wrap = doc.createElement("div");
    wrap.className = "pip-track-list-wrap";

    const toolbar = buildTrackListToolbar(doc);

    const scroller = doc.createElement("div");
    scroller.id = "pip-track-scroll";
    scroller.className = "pip-track-scroll";

    const list = doc.createElement("div");
    list.id = "track-list";
    list.className = "np-grid-list";

    list.addEventListener("pointerdown", ev => {
      if (ev.button !== 0) return;
      const sourceTrackList = document.getElementById("track-list");
      if (!sourceTrackList) return;
      const itemEl = ev.target.closest("[data-uri], [data-index], .track, .track-row, .track-item, button, a");
      if (!itemEl) return;

      const idx = itemEl.dataset.index;
      const uri = itemEl.dataset.uri;
      let targetInMain = null;

      if (idx !== undefined) {
        targetInMain = sourceTrackList.querySelector(`[data-index="${idx}"]`);
      }
      if (!targetInMain && uri) {
        targetInMain = sourceTrackList.querySelector(`[data-uri="${uri}"]`);
      }
      if (!targetInMain && itemEl.parentElement) {
        const allItems = [...list.children];
        const pos = allItems.indexOf(itemEl);
        if (pos >= 0 && sourceTrackList.children[pos]) {
          targetInMain = sourceTrackList.children[pos];
        }
      }

      if (targetInMain) {
        ev.preventDefault();
        ev.stopPropagation();
        targetInMain.click();
        setTimeout(() => {
          syncTrackListPip();
          if (typeof syncPipState === "function") syncPipState();
        }, 80);
      }
    });

    scroller.appendChild(list);
    wrap.append(toolbar, scroller);
    doc.body.appendChild(wrap);

    applyResponsiveTrackListMetrics(trackListPipWindow, doc);
    trackListPipWindow.addEventListener("resize", () => applyResponsiveTrackListMetrics(trackListPipWindow, doc));

    syncTrackListPip();
    trackListPipSyncTimer = setInterval(() => {
      applyResponsiveTrackListMetrics(trackListPipWindow, doc);
      syncTrackListPip();
    }, 250);

    const onClose = () => {
      clearInterval(trackListPipSyncTimer);
      trackListPipSyncTimer = null;
      trackListPipWindow = null;
      const btn = pipWindow && !pipWindow.closed ? pipWindow.document.getElementById("pip-track-list-btn") : null;
      if (btn) btn.classList.remove("active");
    };

    trackListPipWindow.addEventListener("pagehide", onClose, { once: true });
    trackListPipWindow.addEventListener("beforeunload", onClose, { once: true });

    const btn = pipWindow && !pipWindow.closed ? pipWindow.document.getElementById("pip-track-list-btn") : null;
    if (btn) btn.classList.add("active");
  } catch (err) {
    trackListPipWindow = null;
    setFeedback("ERROR Track list PiP: " + err.message, true);
  }
}

function scrollTrackListPipToCurrent(doc) {
  if (!doc || !currentTrack) return;
  const pipTrackList = doc.getElementById("track-list");
  if (!pipTrackList) return;

  const targetUri = currentTrack.uri || "";
  const targetName = (currentTrack.name || "").trim().toLowerCase();
  let matchEl = null;

  for (const child of pipTrackList.children) {
    if (child.style.display === "none") continue;
    if (targetUri && child.dataset && child.dataset.uri === targetUri) {
      matchEl = child;
      break;
    }
    if (!matchEl && typeof sameRecording === "function" && child.dataset && child.dataset.uri) {
      if (sameRecording({ uri: child.dataset.uri }, currentTrack)) {
        matchEl = child;
        break;
      }
    }
    if (!matchEl && targetName) {
      const nameEl = child.querySelector(".track-name");
      if (nameEl && (nameEl.textContent || "").trim().toLowerCase() === targetName) {
        matchEl = child;
        break;
      }
    }
  }

  if (matchEl) {
    matchEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }
}

async function openTrackListPipToCurrent() {
  if (!trackListPipWindow || trackListPipWindow.closed) {
    await toggleTrackListPip();
  }
  if (trackListPipWindow && !trackListPipWindow.closed) {
    try {
      trackListPipWindow.focus();
    } catch (_) {}
    syncTrackListPip();
    setTimeout(() => {
      if (trackListPipWindow && !trackListPipWindow.closed) {
        try {
          trackListPipWindow.focus();
        } catch (_) {}
        scrollTrackListPipToCurrent(trackListPipWindow.document);
      }
    }, 120);
  }
}

function bindTrackListCoverTriggers(doc) {
  const pipArtWrap = doc && doc.querySelector(".pip-art-wrap");
  if (pipArtWrap && !pipArtWrap.dataset.trackListBound) {
    pipArtWrap.dataset.trackListBound = "1";
    pipArtWrap.style.cursor = "pointer";
    pipArtWrap.addEventListener("click", () => {
      openTrackListPipToCurrent();
    });
  }

  const mainArtWrap = document.querySelector("#player-view .np-art-wrap");
  if (mainArtWrap && !mainArtWrap.dataset.trackListBound) {
    mainArtWrap.dataset.trackListBound = "1";
    mainArtWrap.style.cursor = "pointer";
    mainArtWrap.addEventListener("click", () => {
      openTrackListPipToCurrent();
    });
  }
}

function paintRatingPill() {
  const docs = [document];
  if (typeof pipWindow !== "undefined" && pipWindow && !pipWindow.closed && pipWindow.document) {
    docs.push(pipWindow.document);
  }
  const activeScore = currentTrack ? getSongRating(currentTrack.uri) : 1;
  for (const doc of docs) {
    const pill = doc.getElementById("np-rating-pill");
    const view = doc.getElementById("player-view");
    if (!pill) continue;
    pill.style.display = ratingOn ? "inline-flex" : "none";
    if (view) {
      view.classList.toggle("has-rating-bar", ratingOn);
    }
    if (!ratingOn) continue;
    pill.dataset.score = String(activeScore);
    for (const btn of pill.querySelectorAll("button[data-rating]")) {
      const stage = Number(btn.dataset.rating);
      const active = activeScore >= 2 && stage <= activeScore;
      btn.classList.toggle("active", active);
      btn.classList.toggle("rating-2", active && activeScore === 2);
      btn.classList.toggle("rating-3", active && activeScore === 3);
    }
  }
}

function buildPipLayout(doc) {
  doc.body.className = "pip-body";
  doc.body.innerHTML = "";

  const root = doc.createElement("div");
  root.className = "pip-container";

  const left = doc.createElement("div");
  left.className = "pip-left";

  const statusBar = doc.createElement("div");
  statusBar.id = "pip-status-line";
  statusBar.className = "pip-status-line";

  const cardGroup = doc.createElement("div");
  cardGroup.className = "pip-card-group";

  const artWrap = doc.createElement("div");
  artWrap.className = "np-art-wrap pip-art-wrap";
  artWrap.style.position = "relative";
  const art = doc.createElement("img");
  art.id = "pip-art";
  art.className = "np-art";
  art.alt = "";
  artWrap.appendChild(art);

  const ratingPill = doc.createElement("div");
  ratingPill.id = "np-rating-pill";
  ratingPill.className = "np-rating-pill";
  ratingPill.style.position = "absolute";
  ratingPill.style.left = "50%";
  ratingPill.style.transform = "translateX(-50%)";
  ratingPill.addEventListener("click", ev => ev.stopPropagation());
  ratingPill.addEventListener("dblclick", ev => ev.stopPropagation());
  for (const n of [1, 2, 3]) {
    const rb = doc.createElement("button");
    rb.type = "button";
    rb.className = "np-rating-dot";
    rb.dataset.rating = String(n);
    rb.title = `${n} rating`;
    rb.addEventListener("click", ev => {
      ev.stopPropagation();
      if (!currentTrack) return;
      setSongRating(currentTrack.uri, n);
    });
    ratingPill.appendChild(rb);
    if (n < 3) {
      const slash = doc.createElement("span");
      slash.className = "np-rating-slash";
      slash.textContent = "/";
      ratingPill.appendChild(slash);
    }
  }
  artWrap.appendChild(ratingPill);

  const meta = doc.createElement("div");
  meta.id = "pip-meta";
  meta.className = "pip-meta";
  const title = doc.createElement("p");
  title.id = "pip-title";
  title.className = "np-title pip-title";
  const artists = doc.createElement("p");
  artists.id = "pip-artists";
  artists.className = "np-artists pip-artists";
  meta.append(title, artists);

  cardGroup.append(artWrap, meta);

  const playlistProgress = doc.createElement("div");
  playlistProgress.id = "pip-songs-progress";
  playlistProgress.className = "pip-songs-progress";

  left.append(statusBar, cardGroup, playlistProgress);

  const right = doc.createElement("div");
  right.className = "pip-right";

  const topSection = doc.createElement("div");
  topSection.id = "player-view";
  topSection.className = "pip-top-section";

  const controls = doc.createElement("div");
  controls.className = "np-controls pip-controls";

  const prev = doc.createElement("button");
  prev.type = "button";
  prev.className = "np-toggle pip-ctrl-btn pip-prev-btn";
  prev.innerHTML = '<i class="fa-solid fa-backward-step"></i>';
  prev.title = "Previous";
  prev.addEventListener("click", () => playAdjacent(-1));

  const toggle = doc.createElement("button");
  toggle.type = "button";
  toggle.id = "pip-toggle-btn";
  toggle.className = "np-toggle pip-ctrl-btn";
  toggle.innerHTML = '<i class="fa-solid fa-play"></i>';
  toggle.title = "Play / Pause";
  toggle.addEventListener("click", () => {
    const mainToggle = document.querySelector("#player-view .np-toggle");
    if (mainToggle) mainToggle.click();
    setTimeout(syncPipState, 80);
  });

  const next = doc.createElement("button");
  next.type = "button";
  next.className = "np-toggle pip-ctrl-btn pip-next-btn";
  next.innerHTML = '<i class="fa-solid fa-forward-step"></i>';
  next.title = "Skip";
  next.addEventListener("click", () => playAdjacent(1, hideOnSkip));

  const shuffleBtn = doc.createElement("button");
  shuffleBtn.type = "button";
  shuffleBtn.id = "pip-shuffle-btn";
  shuffleBtn.className = "np-shuffle pip-ctrl-btn";
  shuffleBtn.innerHTML = '<i class="fa-solid fa-shuffle"></i>';
  shuffleBtn.title = "Shuffle";
  shuffleBtn.addEventListener("click", () => {
    shuffleOn = !shuffleOn;
    localStorage.setItem("sp_shuffle", shuffleOn ? "1" : "0");
    if (shuffleOn) resetShuffleQueue(sourceName(), currentTrack && currentTrack.uri);
    const mainRnd = document.querySelector("#player-view .np-shuffle .fa-shuffle")?.closest("button");
    if (mainRnd) mainRnd.classList.toggle("active", shuffleOn);
    syncPipState();
  });

  const filterBtn = doc.createElement("button");
  filterBtn.type = "button";
  filterBtn.id = "pip-filter-btn";
  filterBtn.className = "np-shuffle pip-ctrl-btn";
  filterBtn.innerHTML = '<i class="fa-solid fa-filter"></i>';
  filterBtn.title = "Filter mode";
  filterBtn.addEventListener("click", () => {
    hideOnSkip = !hideOnSkip;
    localStorage.setItem("sp_hide_on_skip", hideOnSkip ? "1" : "0");
    if (window.syncAllFilterButtons) window.syncAllFilterButtons();
    syncPipState();
  });

  const previewBtn = doc.createElement("button");
  previewBtn.type = "button";
  previewBtn.id = "pip-preview-btn";
  previewBtn.className = "np-shuffle pip-ctrl-btn";
  previewBtn.innerHTML = '<i class="fa-solid fa-stopwatch"></i>';
  previewBtn.title = "Preview mode";
  previewBtn.addEventListener("click", () => {
    togglePreviewMode();
    syncPipState();
  });

  const ratingBtn = doc.createElement("button");
  ratingBtn.type = "button";
  ratingBtn.id = "pip-rating-btn";
  ratingBtn.className = "np-shuffle pip-ctrl-btn";
  ratingBtn.textContent = "●";
  ratingBtn.title = "Rating lists";
  ratingBtn.addEventListener("click", () => {
    if (typeof ratingOn !== "undefined") {
      ratingOn = !ratingOn;
      if (typeof RATING_ON_KEY !== "undefined") {
        localStorage.setItem(RATING_ON_KEY, ratingOn ? "1" : "0");
      }
      if (typeof paintRatingPill === "function") paintRatingPill();
      if (typeof applyRatingGridVisibility === "function") applyRatingGridVisibility();
    }
    syncPipState();
  });

  const volumeBtn = doc.createElement("button");
  volumeBtn.type = "button";
  volumeBtn.id = "pip-volume-btn";
  volumeBtn.className = "np-shuffle pip-ctrl-btn";
  volumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  volumeBtn.title = volumeShown ? "Hide volume" : "Show volume";

  const trackListBtn = doc.createElement("button");
  trackListBtn.type = "button";
  trackListBtn.id = "pip-track-list-btn";
  trackListBtn.className = "np-shuffle pip-ctrl-btn" + (trackListPipWindow && !trackListPipWindow.closed ? " active" : "");
  trackListBtn.innerHTML = '<i class="fa-solid fa-list"></i>';
  trackListBtn.title = "Track list";
  trackListBtn.addEventListener("click", () => {
    toggleTrackListPip();
  });

  const progressRow = buildPipProgressRow();
  const progressWrap = progressRow.querySelector("#pip-progress-wrap");

  const volOverlay = doc.createElement("div");
  volOverlay.id = "pip-volume-overlay";
  volOverlay.className = "pip-volume-overlay";
  volOverlay.style.display = volumeShown ? "flex" : "none";

  const volMuteBtn = doc.createElement("button");
  volMuteBtn.type = "button";
  volMuteBtn.id = "pip-volume-mute-btn";
  volMuteBtn.className = "pip-volume-icon-btn";
  volMuteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  volMuteBtn.title = "Mute / Unmute";

  const volRange = doc.createElement("input");
  volRange.type = "range";
  volRange.id = "pip-volume-range";
  volRange.className = "pip-volume-slider";
  volRange.min = "0";
  volRange.max = "1";
  volRange.step = "0.05";
  volRange.value = localStorage.getItem("sp_volume") || "0.8";

  const syncVolUi = () => {
    const curVal = Number(localStorage.getItem("sp_volume") || volRange.value || "0.8");
    const muted = curVal <= 0;
    volRange.value = String(curVal);
    volMuteBtn.innerHTML = muted
      ? '<i class="fa-solid fa-volume-xmark"></i>'
      : '<i class="fa-solid fa-volume-high"></i>';
    volumeBtn.classList.toggle("active", volumeShown);
    volumeBtn.title = volumeShown ? "Hide volume" : "Show volume";
    volOverlay.style.display = volumeShown ? "flex" : "none";
  };

  volRange.addEventListener("input", () => {
    const v = Number(volRange.value);
    localStorage.setItem("sp_volume", String(v));
    if (player) player.setVolume(v);
    syncVolUi();
  });

  volMuteBtn.addEventListener("click", e => {
    e.stopPropagation();
    const curVal = Number(localStorage.getItem("sp_volume") || volRange.value || "0.8");
    if (curVal > 0) {
      localStorage.setItem("sp_prev_volume", String(curVal));
      localStorage.setItem("sp_volume", "0");
      if (player) player.setVolume(0);
    } else {
      const restored = Math.max(0.05, Number(localStorage.getItem("sp_prev_volume") || "0.8"));
      localStorage.setItem("sp_volume", String(restored));
      if (player) player.setVolume(restored);
    }
    syncVolUi();
  });

  volumeBtn.addEventListener("click", () => {
    volumeShown = !volumeShown;
    syncVolUi();
  });

  volOverlay.append(volMuteBtn, volRange);
  if (progressWrap) progressWrap.appendChild(volOverlay);

  controls.append(prev, toggle, next, shuffleBtn, filterBtn, previewBtn, ratingBtn, volumeBtn, trackListBtn);
  topSection.append(controls, progressRow);
  syncVolUi();

  const gridSection = doc.createElement("div");
  gridSection.id = "target-grid";
  gridSection.className = "pip-target-grid";

  right.append(topSection, gridSection);
  root.append(left, right);
  doc.body.appendChild(root);

  bindTrackListCoverTriggers(doc);
  if (typeof paintRatingPill === "function") paintRatingPill();
}

function syncPipState() {
  if (!pipWindow || pipWindow.closed) return;
  const doc = pipWindow.document;
  if (!doc.body) return;

  bindTrackListCoverTriggers(doc);

  const cfg = getPipConfig();

  const mainRootStyle = document.documentElement.style;
  for (let i = 0; i < mainRootStyle.length; i++) {
    const prop = mainRootStyle[i];
    if (prop.startsWith("--")) {
      doc.documentElement.style.setProperty(prop, mainRootStyle.getPropertyValue(prop));
    }
  }

  const pipStatus = doc.getElementById("pip-status-line");
  if (pipStatus && el && el.status) {
    pipStatus.textContent = el.status.textContent || "";
    pipStatus.classList.toggle("error", el.status.classList.contains("error"));
  }

  const art = doc.getElementById("pip-art");
  if (art) {
    const targetSrc = (currentTrack && currentTrack.image) || PLACEHOLDER;
    if (art.src !== targetSrc) bindImg(art, targetSrc);
  }

  const pipMeta = doc.getElementById("pip-meta");
  if (pipMeta) {
    pipMeta.style.display = cfg.showMeta ? "flex" : "none";
  }

  const pipTitle = doc.getElementById("pip-title");
  if (pipTitle) {
    pipTitle.textContent = (currentTrack && currentTrack.name) || "No track";
  }

  const pipArtists = doc.getElementById("pip-artists");
  if (pipArtists) {
    pipArtists.textContent = (currentTrack && currentTrack.artists) || "";
  }

  const pipSongsProgress = doc.getElementById("pip-songs-progress");
  if (pipSongsProgress && typeof sourceName === "function" && typeof cache !== "undefined" && typeof isHidden === "function") {
    const src = sourceName();
    const all = (cache[src] && cache[src].tracks) || [];
    let hidden = 0;
    for (const t of all) if (isHidden(src, t.uri)) hidden++;
    const total = all.length;
    const pct = total ? Math.round((hidden / total) * 100) : 0;
    pipSongsProgress.textContent = hidden + "/" + total + " (" + pct + "%)";
  }

  const mainArtWrap = document.querySelector("#player-view .np-art-wrap");
  const pipArtWrap = doc.querySelector(".pip-art-wrap");
  if (mainArtWrap && pipArtWrap) {
    pipArtWrap.classList.toggle("playing", mainArtWrap.classList.contains("playing"));
  }

  const mainToggleIcon = document.querySelector("#player-view .np-toggle i");
  const pipToggleIcon = doc.querySelector("#pip-toggle-btn i");
  if (mainToggleIcon && pipToggleIcon) {
    pipToggleIcon.className = mainToggleIcon.className;
  }

  const pipShuffle = doc.getElementById("pip-shuffle-btn");
  if (pipShuffle) {
    pipShuffle.classList.toggle("active", shuffleOn);
  }
  const mainRnd = document.querySelector("#player-view .np-shuffle .fa-shuffle")?.closest("button");
  if (mainRnd) {
    mainRnd.classList.toggle("active", shuffleOn);
  }

  const pipFilter = doc.getElementById("pip-filter-btn");
  if (pipFilter) {
    pipFilter.classList.toggle("active", hideOnSkip);
    pipFilter.classList.toggle("on", hideOnSkip);
  }

  const pipPreview = doc.getElementById("pip-preview-btn");
  if (pipPreview) {
    pipPreview.classList.toggle("active", previewMode);
  }

  const pipRatingBtn = doc.getElementById("pip-rating-btn");
  if (pipRatingBtn && typeof ratingOn !== "undefined") {
    pipRatingBtn.classList.toggle("active", ratingOn);
    pipRatingBtn.classList.toggle("on", ratingOn);
  }

  if (typeof paintRatingPill === "function") paintRatingPill();

  const pipTrackListBtn = doc.getElementById("pip-track-list-btn");
  if (pipTrackListBtn) {
    pipTrackListBtn.classList.toggle("active", Boolean(trackListPipWindow && !trackListPipWindow.closed));
  }

  const pipVolBtn = doc.getElementById("pip-volume-btn");
  const pipVolOverlay = doc.getElementById("pip-volume-overlay");
  const pipProgressWrap = doc.getElementById("pip-progress-wrap");
  const pipVolRange = doc.getElementById("pip-volume-range");
  const pipVolMuteBtn = doc.getElementById("pip-volume-mute-btn");
  if (pipVolBtn) pipVolBtn.classList.toggle("active", volumeShown);
  if (pipVolOverlay) {
    pipVolOverlay.style.display = volumeShown ? "flex" : "none";
    if (volumeShown && pipProgressWrap) {
      const r = pipProgressWrap.getBoundingClientRect();
      pipVolOverlay.style.top = r.top + "px";
      pipVolOverlay.style.left = r.left + "px";
      pipVolOverlay.style.width = r.width + "px";
      pipVolOverlay.style.height = r.height + "px";
    }
  }
  if (pipVolRange && pipVolMuteBtn) {
    const curVal = Number(localStorage.getItem("sp_volume") || pipVolRange.value || "0.8");
    pipVolRange.value = String(curVal);
    pipVolMuteBtn.innerHTML = curVal <= 0
      ? '<i class="fa-solid fa-volume-xmark"></i>'
      : '<i class="fa-solid fa-volume-high"></i>';
  }

  syncPipProgress(doc, cfg);
  syncTrackListPip();

  const gridEl = doc.getElementById("target-grid");
  if (!gridEl) return;

  const hidden = hiddenGrid("target");
  const visibleNames = gridOrder("target").filter(name => {
    const entry = PLAYLISTS[name] || cache[name];
    return entry && PLAYLISTS[name] && !entry.extra && !hidden.includes(name);
  });

  const curUri = currentTrack ? currentTrack.uri : "";
  const signature = visibleNames.join("|") + "::" + curUri;

  if (signature !== _lastPipGridSignature || gridEl.children.length !== visibleNames.length) {
    _lastPipGridSignature = signature;
    gridEl.innerHTML = "";
    for (const name of visibleNames) {
      const entry = PLAYLISTS[name] || cache[name];
      const btn = doc.createElement("button");
      btn.type = "button";
      btn.dataset.name = name;

      const has = curUri && cache[name] && cache[name].tracks && cache[name].tracks.some(t => sameRecording(t, currentTrack));
      if (has) btn.classList.add("has-track");

      const img = doc.createElement("img");
      img.alt = "";
      img.draggable = false;
      bindImg(img, entry.image || (cache[name] && cache[name].image));

      const label = doc.createElement("span");
      label.textContent = entry.label || name;

      btn.append(img, label);
      btn.addEventListener("click", async () => {
        await onAdd(name, btn);
        _lastPipGridSignature = "";
        syncPipState();
      });
      gridEl.appendChild(btn);
    }
  } else {
    for (const btn of gridEl.children) {
      const name = btn.dataset.name;
      const has = curUri && cache[name] && cache[name].tracks && cache[name].tracks.some(t => sameRecording(t, currentTrack));
      btn.classList.toggle("has-track", Boolean(has));
    }
  }
}