let pipWindow = null;
let pipSyncTimer = null;
let _lastPipGridSignature = "";

const PIP_WIDTH_KEY = "sp_pip_width";
const PIP_HEIGHT_KEY = "sp_pip_height";
const PIP_SHOW_META_KEY = "sp_pip_show_meta";
const PIP_SHOW_PROGRESS_KEY = "sp_pip_show_progress";

function getPipConfig() {
  const w = parseInt(localStorage.getItem(PIP_WIDTH_KEY) || "600", 10);
  const h = parseInt(localStorage.getItem(PIP_HEIGHT_KEY) || "140", 10);
  return {
    width: Number.isFinite(w) && w >= 240 ? w : 600,
    height: Number.isFinite(h) && h >= 120 ? h : 140,
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
    curHeight = 140;
    curMeta = true;
    curProgress = true;
    wRow.input.value = "600";
    hRow.input.value = "140";
    savePipConfig({ width: curWidth, height: curHeight, showMeta: curMeta, showProgress: curProgress });
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
    pipBar.style.width = (pos / dur * 100) + "%";
  }

  const splitsEl = doc.getElementById("pip-preset-splits");
  const progressWrap = doc.getElementById("pip-progress-wrap");
  if (!splitsEl || !progressWrap) return;

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
      if (OFFLINE && typeof applyOfflineSimulatedState === "function") {
        applyOfflineSimulatedState(lastState ? lastState.paused : false, targetMs);
      } else if (player) {
        await player.seek(targetMs);
      }
      syncPipState();
    }, { capture: true });
  }

  const activePreset = typeof activePresetAt === "function" ? activePresetAt(pos, dur) : "A";
  for (let idx = 0; idx < count; idx++) {
    const seg = splitsEl.children[idx];
    if (!seg) continue;
    seg.style.width = ((presetRanges[idx].end - presetRanges[idx].start) * 100) + "%";
    seg.classList.toggle("is-active", presetRanges[idx].key === activePreset);
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
  const art = doc.createElement("img");
  art.id = "pip-art";
  art.className = "np-art";
  art.alt = "";
  artWrap.appendChild(art);

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

  const volumeBtn = doc.createElement("button");
  volumeBtn.type = "button";
  volumeBtn.id = "pip-volume-btn";
  volumeBtn.className = "np-shuffle pip-ctrl-btn";
  volumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  volumeBtn.title = volumeShown ? "Hide volume" : "Show volume";

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

  controls.append(prev, toggle, next, shuffleBtn, filterBtn, previewBtn, volumeBtn);
  topSection.append(controls, progressRow);
  syncVolUi();

  const gridSection = doc.createElement("div");
  gridSection.id = "target-grid";
  gridSection.className = "pip-target-grid";

  right.append(topSection, gridSection);
  root.append(left, right);
  doc.body.appendChild(root);
}

function syncPipState() {
  if (!pipWindow || pipWindow.closed) return;
  const doc = pipWindow.document;
  if (!doc.body) return;

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