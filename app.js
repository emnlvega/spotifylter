const VERSION_NUMBER = "v1.23c"
let OFFLINE = localStorage.getItem("sp_offline") === "1";
const CLIENT_ID = "ERROR";
const ACCESS_TOKEN = "ERROR";
const SYNC_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/hidden";
const HIERARCHY_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/hierarchy";
const OPS_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/ops";
const HOLD_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/hold";
const OPS_CURSOR_KEY = "sp_ops_cursor";
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-library-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private"
].join(" ");

const HIERARCHY_KEY = "sp_hierarchy";
const HIERARCHY_ON_KEY = "sp_hierarchy_on";
const ME_KEY = "sp_me_v1";
const ME_TTL = 60 * 60 * 1000;
const PLAYLISTS_CACHE_KEY = "sp_playlists_v1";
const PLAYLISTS_TTL = 60 * 60 * 1000;
const LOCAL_PLAYLISTS_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/localplaylists";

const LOGO_SVG = '<svg viewBox="0 0 3994 1883" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1,0,0,1,-100.338058,-100.340635)"><g transform="matrix(4.166667,0,0,4.166667,0,0)"><path d="M202.186,109.034L150.19,109.034C149.678,109.034 149.172,108.991 148.675,108.907L148.675,119.385C148.675,135.561 135.561,148.675 119.385,148.675L109.034,148.675L109.034,185.994L445.465,185.994C460.482,185.994 472.498,197.219 472.498,210.855L472.498,289.145C472.498,302.781 460.482,314.006 445.465,314.006L432.857,314.006L432.857,351.325L443.208,351.325C459.385,351.325 472.498,364.438 472.498,380.615L472.498,443.207C472.498,459.384 459.385,472.498 443.208,472.498L380.615,472.498C364.439,472.498 351.325,459.384 351.325,443.207L351.325,432.488C350.494,432.73 349.637,432.856 348.76,432.856L301.234,432.856L301.234,451.057C301.234,464.693 289.218,475.918 274.201,475.918L54.535,475.918C39.518,475.918 27.502,464.693 27.502,451.057L27.502,372.767C27.502,359.131 39.518,347.905 54.535,347.905L274.201,347.905C289.218,347.905 301.234,359.131 301.234,372.767L301.234,390.966L348.76,390.966C349.637,390.966 350.494,391.092 351.325,391.334L351.325,380.615C351.325,364.438 364.439,351.325 380.615,351.325L390.967,351.325L390.967,314.006L51.115,314.006C36.097,314.006 24.081,302.781 24.081,289.145L24.081,210.855C24.081,197.219 36.097,185.994 51.115,185.994L67.143,185.994L67.143,148.675L56.792,148.675C40.615,148.675 27.502,135.561 27.502,119.385L27.502,56.792C27.502,40.616 40.615,27.502 56.792,27.502L119.385,27.502C135.561,27.502 148.675,40.616 148.675,56.792L148.675,67.27C149.172,67.186 149.678,67.143 150.19,67.143L202.186,67.143L202.186,48.943C202.186,35.307 214.202,24.082 229.22,24.082L448.885,24.082C463.903,24.082 475.919,35.307 475.919,48.943L475.919,127.233C475.919,140.869 463.903,152.095 448.885,152.095L229.22,152.095C214.202,152.095 202.186,140.869 202.186,127.233L202.186,109.034ZM119.385,52.647L56.792,52.647C54.503,52.647 52.647,54.503 52.647,56.792L52.647,119.385C52.647,121.674 54.503,123.53 56.792,123.53L119.385,123.53C121.674,123.53 123.529,121.674 123.529,119.385L123.529,56.792C123.529,54.503 121.674,52.647 119.385,52.647ZM443.208,376.47L380.615,376.47C378.326,376.47 376.471,378.326 376.471,380.615L376.471,443.207C376.471,445.497 378.326,447.352 380.615,447.352L443.208,447.352C445.497,447.352 447.353,445.497 447.353,443.207L447.353,380.615C447.353,378.326 445.497,376.47 443.208,376.47Z" fill="currentColor"/></g><g transform="matrix(1,0,0,1,-166.90289,0)"><path d="M2542.786,774.973L2542.786,633.728L2490.253,633.728C2427.681,633.728 2377.614,586.954 2377.614,530.137L2377.614,203.931C2377.614,147.114 2427.681,100.341 2490.253,100.341L4147.632,100.341C4210.204,100.341 4260.271,147.114 4260.271,203.931L4260.271,530.137C4260.271,586.954 4210.204,633.728 4147.632,633.728L2717.331,633.728L2717.331,774.973L3405.527,774.973C3468.099,774.973 3518.166,821.746 3518.166,878.564L3518.166,1204.77C3518.166,1261.587 3468.099,1308.36 3405.527,1308.36L2717.331,1308.36L2717.331,1455.923C2717.331,1458.595 2717.22,1461.239 2717.002,1463.852L2760.46,1463.852C2827.862,1463.852 2882.502,1518.491 2882.502,1585.894L2882.502,1846.698C2882.502,1914.1 2827.862,1968.741 2760.46,1968.741L2499.655,1968.741C2432.254,1968.741 2377.614,1914.1 2377.614,1846.698L2377.614,1585.894C2377.614,1518.491 2432.254,1463.852 2499.655,1463.852L2543.115,1463.852C2542.897,1461.239 2542.786,1458.595 2542.786,1455.923L2542.786,1308.36L2490.253,1308.36C2427.681,1308.36 2377.614,1261.587 2377.614,1204.77L2377.614,878.564C2377.614,821.746 2427.681,774.973 2490.253,774.973L2542.786,774.973ZM2760.46,1568.624L2499.655,1568.624C2490.118,1568.624 2482.387,1576.357 2482.387,1585.894L2482.387,1846.698C2482.387,1856.236 2490.118,1863.968 2499.655,1863.968L2760.46,1863.968C2769.998,1863.968 2777.73,1856.236 2777.73,1846.698L2777.73,1585.894C2777.73,1576.357 2769.998,1568.624 2760.46,1568.624Z" fill="currentColor"/></g></g></svg>';
const inner = LOGO_SVG.slice(LOGO_SVG.indexOf('>') + 1, LOGO_SVG.lastIndexOf('</svg>'))
  .replaceAll('fill="currentColor"', 'fill="var(--blackG)" fill-opacity="0.15"');
const pat = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="160" height="160" rx="32" fill="var(--blackG)" fill-opacity="0"/></svg>`;
document.documentElement.style.setProperty('--logo-pattern', `url("data:image/svg+xml,${encodeURIComponent(pat)}")`);
const TOOLS = [
  { id: "manual",    icon: "fa-paste",        label: "Manual",    desc: "Paste track links" },
  { id: "combine",   icon: "fa-circle-plus",  label: "Combine",   desc: "Union, no duplicates" },
  { id: "subtract",  icon: "fa-circle-minus", label: "Subtract",  desc: "Origin minus selected" },
  { id: "intersect", icon: "fa-circle-nodes", label: "Intersect", desc: "Only songs in all selected" },
  { id: "slice",     icon: "fa-scissors",     label: "Slice",     desc: "Split playlist into parts locally" },
  { id: "hierarchy", icon: "fa-sitemap",      label: "Hierarchy", desc: "Auto-add to linked playlists" },
  { id: "localplaylist", icon: "fa-folder-plus", label: "Local", desc: "Paste tracks and save locally on Wix" },
  { id: "color",     icon: "fa-palette",      label: "Color",     desc: "Customize theme hue and adaptive color" },
  { id: "offline",   icon: "fa-ban",          label: "Offline Mode", desc: "Toggle offline mode" }
];

const PLAYLISTS = {
};

const SOURCE_CANDIDATES = ["playlist"];
const TARGET_GRID = ["playlist"];

const RULES = {
};

const CACHE_KEY = "sp_cache_v3";
const HIDDEN_KEY = "sp_hidden";
const GRID_HIDE_KEY = "sp_grid_hidden";
const EXTRA_SOURCES = { "discover weekly": "37i9dQZEVXcHuSzt0MWVeH" };
const SOURCE_KEY = "sp_source";
const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="var(--blackG)"/></svg>'
);
const API_LOG_KEY = "sp_api_log";
const API_HOLD_KEY = "sp_api_hold";
const API_BUDGET_15M = 40;
const PLAYLIST_DATA_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/playlistdata";
const CLEAROPS_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/clearops";
const PLAYLIST_DATA_INDEX_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/playlistdata_index";
const PENDING_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/pending";
const PENDING_DELETE_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/pending_delete";

let cache = {};
let player = null;
let deviceId = null;
let currentTrack = null;
let pendingSeek = null;
let lastState = null;
let progressTimer = null;
let shuffleOn = localStorage.getItem("sp_shuffle") === "1";
let shuffleQueue = [];
let hideOnSkip = localStorage.getItem("sp_hide_on_skip") !== "0";
let pendingTrackUri = null;
let pendingTrackUriAt = 0;
let sdkStaleUri = null;
let sourcesCollapsed = true;
//let toolsCollapsed = localStorage.getItem("sp_tools_collapsed") !== "0";
let toolsCollapsed = 1;
let playAll = localStorage.getItem("sp_play_all") === "1";
let reverseOrder = localStorage.getItem("sp_reverse") === "1";
let songFilter = "";
let songSort = "default";
let songHiddenFilter = "all";
let filterQueue = localStorage.getItem("sp_filter_queue") === "1";
let recentPanel = null;
let movingTile = null;
let dragCandidate = null;
let dragStartX = 0;
let dragStartY = 0;
let dragPointerId = null;
let justFinishedDrag = false;
let reorderMode = false;
let volumeShown = false;
let pendingQueue = [];
let presetTracking = false;
let lastPaintedPreset = null;
let repeatMode = localStorage.getItem("sp_repeat") || "off";
if (repeatMode === "one") repeatMode = "off";
let previewMode = false;
let previewRunning = false;
let previewAbort = false;
let npPanel = null;
let npView = "queue";
let endHandledFor = null;
let previewSeconds = Number(localStorage.getItem("sp_preview_secs") || "5");
let previewPresets = localStorage.getItem("sp_preview_presets") || "ABCDE";
let previewHoldTimer = null;
let previewLongPressed = false;
let paintTargetBar = () => {};
let paintApiCounter = () => {};



function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  return `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`;
}

function createSongsPanelDock() {
  const panel = document.querySelector(".songs-panel");
  if (!panel || document.getElementById("songs-panel-dock")) return;

  const anchor = document.createElement("div");
  anchor.id = "songs-panel-anchor";
  panel.parentElement.insertBefore(anchor, panel);

  const dock = document.createElement("div");
  dock.id = "songs-panel-dock";
  dock.style.display = "none";
  anchor.parentElement.insertBefore(dock, anchor.nextSibling);

  let pinned = false;
  let lastHeight = 0;

  const updateDockState = () => {
    const rect = pinned
      ? dock.getBoundingClientRect()
      : panel.getBoundingClientRect();

    if (!pinned && (rect.bottom < 0 || rect.top > window.innerHeight)) {
      if (npPanel) toggleNpPanel();
      lastHeight = panel.offsetHeight || lastHeight;
      dock.style.width = rect.width + "px";
      dock.style.height = lastHeight + "px";
      dock.style.display = "block";
      panel.classList.add("pinned");
      pinned = true;
    } else if (pinned && rect.top <= window.innerHeight && rect.bottom >= 0) {
      panel.classList.remove("pinned");
      dock.style.display = "none";
      pinned = false;
    }
  };

  window.addEventListener("scroll", updateDockState, { passive: true });
  window.addEventListener("resize", updateDockState, { passive: true });
}

function secondaryColorEnabled() {
  return localStorage.getItem("sp_secondary_color") === "1";
}

function circularHueDistance(a, b) {
  const diff = Math.abs(((a - b) % 360) + 360) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function applySecondaryHue(h, s = 0.73) {
  const root = document.documentElement;
  const sat = Math.max(0, s);

  if (sat === 0) {
    root.style.setProperty("--scndry1", hslToRgb(0, 0, 0.70));
    root.style.setProperty("--scndry2", hslToRgb(0, 0, 0.50));
    root.style.setProperty("--scndry3", hslToRgb(0, 0, 0.30));
    root.style.setProperty("--scndry4", hslToRgb(0, 0, 0.14));
    return;
  }

  root.style.setProperty("--scndry1", hslToRgb(h, sat, 0.52));
  root.style.setProperty("--scndry2", hslToRgb(h, sat * 0.90, 0.38));
  root.style.setProperty("--scndry3", hslToRgb(h, sat * 0.80, 0.25));
  root.style.setProperty("--scndry4", hslToRgb(h, sat * 0.70, 0.13));
}

function applyAdaptiveColor(track) {
  if (localStorage.getItem("sp_adaptive_color") === "1" && track && track.image) {
    extractHueFromImageUrl(track.image).then(res => {
      applyHue(res.h, res.s);
      applySecondaryHue(res.secondaryH, res.secondaryS);
    });
  }
}

function applyHue(h, s = 0.73) {
  const root = document.documentElement;
  const sat = Math.max(0, s);

  if (sat === 0) {
    root.style.setProperty("--accent", hslToRgb(0, 0, 0.75));
    root.style.setProperty("--action", hslToRgb(0, 0, 0.65));
    root.style.setProperty("--darkG", hslToRgb(0, 0, 0.18));
    root.style.setProperty("--blackG", hslToRgb(0, 0, 0.08));
    root.style.setProperty("--line", hslToRgb(0, 0, 0.22));
    root.style.setProperty("--muted", hslToRgb(0, 0, 0.50));
    return;
  }

  root.style.setProperty("--accent", hslToRgb(h, sat, 0.42));
  root.style.setProperty("--action", hslToRgb(h, sat * 0.95, 0.34));
  root.style.setProperty("--darkG", hslToRgb(h, sat * 0.85, 0.24));
  root.style.setProperty("--blackG", hslToRgb(h, sat * 0.65, 0.10));
  root.style.setProperty("--line", hslToRgb(h, sat * 0.4, 0.13));
  root.style.setProperty("--muted", hslToRgb(h, sat * 0.55, 0.48));
}

async function extractHueFromImageUrl(url) {
  return new Promise(resolve => {
    if (!url) { resolve({ h: 141, s: 0.73, secondaryH: 202, secondaryS: 0.73 }); return; }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 100, 100);
      try {
        const data = ctx.getImageData(0, 0, 100, 100).data;
        let colorBuckets = {};
        let bucketSatSum = {};
        let bucketWeightSum = {};
        let totalWeightedS = 0;
        let totalWeight = 0;
        let fallbackHue = 141;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] / 255;
          const g = data[i+1] / 255;
          const b = data[i+2] / 255;
          const max = Math.max(r, g, b), min = Math.min(r, g, b);
          let h = 0, s = 0, l = (max + min) / 2;
          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h /= 6;
          }
          h *= 360;
          fallbackHue = h;
          if (s > 0.02 && l > 0.08 && l < 0.92) {
            const hueBin = Math.round(h / 15) * 15;
            const weight = (s + 0.1) * (1 - Math.abs(l - 0.5));
            colorBuckets[hueBin] = (colorBuckets[hueBin] || 0) + weight;
            bucketSatSum[hueBin] = (bucketSatSum[hueBin] || 0) + s * weight;
            bucketWeightSum[hueBin] = (bucketWeightSum[hueBin] || 0) + weight;
            totalWeightedS += s * weight;
            totalWeight += weight;
          }
        }
        let bestHue = fallbackHue;
        let maxWeight = -1;
        for (const [hueStr, weight] of Object.entries(colorBuckets)) {
          if (weight > maxWeight) {
            maxWeight = weight;
            bestHue = Number(hueStr);
          }
        }
        let secondaryHue = (bestHue + 180) % 360;
        let secondaryMaxWeight = -1;
        for (const [hueStr, weight] of Object.entries(colorBuckets)) {
          const candidateHue = Number(hueStr);
          if (circularHueDistance(candidateHue, bestHue) >= 60 && weight > secondaryMaxWeight) {
            secondaryMaxWeight = weight;
            secondaryHue = candidateHue;
          }
        }
        const avgS = totalWeight > 0 ? totalWeightedS / totalWeight : 0;
        const rawSecS = secondaryMaxWeight > 0 && bucketWeightSum[secondaryHue]
          ? bucketSatSum[secondaryHue] / bucketWeightSum[secondaryHue]
          : 0;
        const secS = rawSecS < 0.12 ? 0 : rawSecS;
        resolve({
          h: isNaN(bestHue) ? 141 : bestHue,
          s: Math.max(0, avgS),
          secondaryH: isNaN(secondaryHue) ? 202 : secondaryHue,
          secondaryS: Math.max(0, secS)
        });
      } catch (e) {
        resolve({ h: 141, s: 0.73, secondaryH: 202, secondaryS: 0.73 });
      }
    };
    img.onerror = () => resolve({ h: 141, s: 0.73, secondaryH: 202, secondaryS: 0.73 });
    img.src = url;
  });
}

function openColorTool() {
  const old = document.getElementById("tool-panel");
  if (old) old.remove();

  const prevHue = localStorage.getItem("sp_theme_hue") !== null ? Number(localStorage.getItem("sp_theme_hue")) : 141;
  const prevSat = localStorage.getItem("sp_theme_sat") !== null ? Number(localStorage.getItem("sp_theme_sat")) : 0.73;
  const prevAdaptive = localStorage.getItem("sp_adaptive_color") === "1";
  let currentHue = prevHue;
  let currentSat = prevSat;
  let adaptiveActive = prevAdaptive;

  const restoreDefaultSecondary = () => {
    const root = document.documentElement;
    root.style.setProperty("--scndry1", "rgb(155, 165, 175)");
    root.style.setProperty("--scndry2", "rgb(110, 120, 130)");
    root.style.setProperty("--scndry3", "rgb(70, 78, 86)");
    root.style.setProperty("--scndry4", "rgb(22, 26, 30)");
  };

  const panel = document.createElement("div");
  panel.id = "tool-panel";
  panel.className = "tool-panel";

  const head = document.createElement("div");
  head.className = "tool-head";
  const h3 = document.createElement("h3");
  h3.textContent = "Color Theme";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "tool-close";
  close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  close.addEventListener("click", () => {
    if (adaptiveActive) {
      localStorage.setItem("sp_adaptive_color", "1");
      if (currentTrack && currentTrack.image) {
        extractHueFromImageUrl(currentTrack.image).then(res => {
          applyHue(res.h, res.s);
          applySecondaryHue(res.secondaryH, res.secondaryS);
        });
      }
    } else {
      localStorage.setItem("sp_adaptive_color", "0");
      applyHue(prevHue, prevSat);
      restoreDefaultSecondary();
    }
    closeToolPanel();
  });
  head.append(h3, close);
  panel.appendChild(head);

  const hint = document.createElement("p");
  hint.className = "tool-hint";
  hint.textContent = "Adjust the theme hue and saturation live or enable adaptive color based on the current track cover.";
  panel.appendChild(hint);

  const adaptiveRow = document.createElement("div");
  adaptiveRow.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg);border:1px solid var(--line);border-radius:var(--r-sm);";
  const adaptiveLabel = document.createElement("span");
  adaptiveLabel.textContent = "Adaptive Color";
  adaptiveLabel.style.cssText = "font-size:13px;font-weight:600;";
  const adaptiveToggle = document.createElement("button");
  adaptiveToggle.type = "button";
  adaptiveToggle.className = "skip-toggle" + (adaptiveActive ? " on" : "");
  adaptiveToggle.innerHTML = adaptiveActive ? '<i class="fa-solid fa-toggle-on"></i><span>ON</span>' : '<i class="fa-solid fa-toggle-off"></i><span>OFF</span>';

  adaptiveToggle.addEventListener("click", async () => {
    adaptiveActive = !adaptiveActive;
    adaptiveToggle.classList.toggle("on", adaptiveActive);
    adaptiveToggle.innerHTML = adaptiveActive ? '<i class="fa-solid fa-toggle-on"></i><span>ON</span>' : '<i class="fa-solid fa-toggle-off"></i><span>OFF</span>';
    slider.disabled = adaptiveActive;
    satSlider.disabled = adaptiveActive;
    if (adaptiveActive) {
      let imgUrl = (currentTrack && currentTrack.image) || null;
      if (!imgUrl) {
        const recents = recentList();
        if (recents.length && recents[0].image) imgUrl = recents[0].image;
      }
      const res = await extractHueFromImageUrl(imgUrl);
      applyHue(res.h, res.s);
      applySecondaryHue(res.secondaryH, res.secondaryS);
    } else {
      applyHue(currentHue, currentSat);
      restoreDefaultSecondary();
    }
  });
  adaptiveRow.append(adaptiveLabel, adaptiveToggle);
  panel.appendChild(adaptiveRow);

  const sliderWrap = document.createElement("label");
  sliderWrap.className = "tool-label";
  sliderWrap.textContent = "Hue Slider";
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "360";
  slider.value = String(currentHue);
  slider.disabled = adaptiveActive;
  slider.style.cssText = "width:100%;cursor:pointer;";

  slider.addEventListener("input", () => {
    if (adaptiveActive) return;
    currentHue = Number(slider.value);
    applyHue(currentHue, currentSat);
  });
  sliderWrap.appendChild(slider);
  panel.appendChild(sliderWrap);

  const satWrap = document.createElement("label");
  satWrap.className = "tool-label";
  satWrap.textContent = "Saturation Slider";
  const satSlider = document.createElement("input");
  satSlider.type = "range";
  satSlider.min = "0";
  satSlider.max = "1";
  satSlider.step = "0.05";
  satSlider.value = String(currentSat);
  satSlider.disabled = adaptiveActive;
  satSlider.style.cssText = "width:100%;cursor:pointer;";

  satSlider.addEventListener("input", () => {
    if (adaptiveActive) return;
    currentSat = Number(satSlider.value);
    applyHue(currentHue, currentSat);
  });
  satWrap.appendChild(satSlider);
  panel.appendChild(satWrap);

  const actions = document.createElement("div");
  actions.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-top:8px;";

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.textContent = "Reset";
  resetBtn.style.cssText = "background:var(--surface-2);color:var(--text);border:1px solid var(--line);padding:8px 14px;border-radius:var(--r-sm);cursor:pointer;";
  resetBtn.addEventListener("click", () => {
    currentHue = 141;
    currentSat = 0.73;
    slider.value = "141";
    satSlider.value = "0.73";
    adaptiveActive = false;
    adaptiveToggle.classList.remove("on");
    adaptiveToggle.innerHTML = '<i class="fa-solid fa-toggle-off"></i><span>OFF</span>';
    slider.disabled = false;
    satSlider.disabled = false;
    applyHue(141, 0.73);
    restoreDefaultSecondary();
  });

  const rightActions = document.createElement("div");
  rightActions.style.cssText = "display:flex;gap:8px;";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.cssText = "background:var(--surface-2);color:var(--text);border:1px solid var(--line);padding:8px 14px;border-radius:var(--r-sm);cursor:pointer;";
  cancelBtn.addEventListener("click", () => {
    if (prevAdaptive) {
      localStorage.setItem("sp_adaptive_color", "1");
      if (currentTrack && currentTrack.image) {
        extractHueFromImageUrl(currentTrack.image).then(res => {
          applyHue(res.h, res.s);
          applySecondaryHue(res.secondaryH, res.secondaryS);
        });
      }
    } else {
      localStorage.setItem("sp_adaptive_color", "0");
      applyHue(prevHue, prevSat);
      restoreDefaultSecondary();
    }
    closeToolPanel();
  });

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.textContent = "Confirm";
  confirmBtn.style.cssText = "background:var(--accent);color:var(--bg);border:none;font-weight:700;padding:8px 14px;border-radius:var(--r-sm);cursor:pointer;";
  confirmBtn.addEventListener("click", () => {
    localStorage.setItem("sp_theme_hue", String(currentHue));
    localStorage.setItem("sp_theme_sat", String(currentSat));
    localStorage.setItem("sp_adaptive_color", adaptiveActive ? "1" : "0");
    if (!adaptiveActive) restoreDefaultSecondary();
    panel.remove();
    setFeedback("Theme color saved", false);
  });

  rightActions.append(cancelBtn, confirmBtn);
  actions.append(resetBtn, rightActions);
  panel.appendChild(actions);

  document.getElementById("tool-panel-host").appendChild(panel);
}



function showAppDialog({ type = "change", isQuestion = false, title = "", text = "", onConfirm = null, onCancel = null } = {}) {
  const existing = document.getElementById("app-custom-dialog");
  if (existing) existing.remove();

  const outlineColors = {
    add: "var(--accent)",
    delete: "var(--red)",
    change: "var(--yellow)"
  };
  const borderColor = outlineColors[type] || outlineColors.change;
  const defTitles = { add: "Confirm Add", delete: "Confirm Delete", change: "Notice" };
  const defTexts = { add: "Do you want to proceed with adding this?", delete: "Are you sure you want to delete this?", text: "Please review this action." };

  const finalTitle = title || defTitles[type] || "Notice";
  const finalText = text || defTexts[type] || "";

  const overlay = document.createElement("div");
  overlay.id = "app-custom-dialog";
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(10,13,18,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;box-sizing:border-box;";

  const box = document.createElement("div");
  box.style.cssText = "background:var(--surface);border:1px solid " + borderColor + ";border-radius:var(--r-lg);width:min(400px,90vw);padding:20px;display:flex;flex-direction:column;gap:16px;box-shadow:0 8px 24px rgba(0,0,0,0.5);color:var(--text);position:relative;font-family:inherit;box-sizing:border-box;";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeBtn.style.cssText = "position:absolute;top:14px;right:14px;background:transparent;border:none;color:var(--muted);font-size:16px;cursor:pointer;padding:4px;";
  closeBtn.addEventListener("click", () => {
    overlay.remove();
    if (onCancel) onCancel();
  });

  const h3 = document.createElement("h3");
  h3.textContent = finalTitle;
  h3.style.cssText = "margin:0;font-size:16px;font-weight:600;color:var(--text);padding-right:24px;";

  const p = document.createElement("p");
  p.textContent = finalText;
  p.style.cssText = "margin:0;font-size:13px;color:var(--muted);line-height:1.4;";

  const actions = document.createElement("div");
  actions.style.cssText = "display:flex;gap:10px;justify-content:flex-end;margin-top:4px;";

  if (isQuestion) {
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.cssText = "background:var(--surface-2);color:var(--text);border:1px solid var(--line);padding:8px 16px;border-radius:var(--r-sm);font-size:13px;font-weight:500;cursor:pointer;";
    cancelBtn.addEventListener("click", () => {
      overlay.remove();
      if (onCancel) onCancel();
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.textContent = "Confirm";
    confirmBtn.style.cssText = "background:" + (type === "delete" ? "var(--red)" : type === "add" ? "var(--accent)" : "var(--line)") + ";color:var(--white);border:none;padding:8px 16px;border-radius:var(--r-sm);font-size:13px;font-weight:500;cursor:pointer;";
    confirmBtn.addEventListener("click", () => {
      overlay.remove();
      if (onConfirm) onConfirm();
    });

    actions.append(cancelBtn, confirmBtn);
  } else {
    const okBtn = document.createElement("button");
    okBtn.type = "button";
    okBtn.textContent = "OK";
    okBtn.style.cssText = "background:var(--surface-2);color:var(--text);border:1px solid var(--line);padding:8px 16px;border-radius:var(--r-sm);font-size:13px;font-weight:500;cursor:pointer;";
    okBtn.addEventListener("click", () => {
      overlay.remove();
      if (onConfirm) onConfirm();
    });
    actions.appendChild(okBtn);
  }

  box.append(closeBtn, h3, p, actions);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", e => {
    if (e.target === overlay) {
      overlay.remove();
      if (onCancel) onCancel();
    }
  });
}
function currentPlayingUri() {
  if (pendingTrackUri) return pendingTrackUri;
  const sdkUri = lastState && lastState.track_window && lastState.track_window.current_track
    ? lastState.track_window.current_track.uri
    : null;
  if (sdkUri && sdkUri === sdkStaleUri) {
    return currentTrack && currentTrack.uri;
  }
  return sdkUri || (currentTrack && currentTrack.uri);
}

let manualQueue = [];

function enqueueNext(track) {
  if (!track || !track.uri) return;
  manualQueue = manualQueue.filter(t => t.uri !== track.uri);
  manualQueue.unshift(track);
  refreshNpPanel();
  setFeedback("added to queue: " + track.name, false);
}

function closeTrackContextMenu() {
  const existing = document.getElementById("track-context-menu");
  if (existing) existing.remove();
}

function openTrackContextMenu(x, y, track) {
  closeTrackContextMenu();
  const menu = document.createElement("div");
  menu.id = "track-context-menu";
  menu.className = "track-context-menu";

  const name = sourceName();
  const hidden = isHidden(name, track.uri);

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.innerHTML = '<i class="fa-solid fa-plus"></i><span>Add to queue</span>';
  addBtn.addEventListener("click", ev => {
    ev.stopPropagation();
    enqueueNext(track);
    closeTrackContextMenu();
  });

  const hideBtn = document.createElement("button");
  hideBtn.type = "button";
  hideBtn.innerHTML = '<i class="fa-solid ' + (hidden ? "fa-eye" : "fa-eye-slash") + '"></i><span>' + (hidden ? "Unfilter song" : "Filter song") + '</span>';
  hideBtn.addEventListener("click", ev => {
    ev.stopPropagation();
    setHidden(name, track.uri, !hidden);
    renderTracks();
    renderGrid();
    closeTrackContextMenu();
  });

  menu.append(addBtn, hideBtn);
  document.body.appendChild(menu);

  const rect = menu.getBoundingClientRect();
  const left = Math.min(x, window.innerWidth - rect.width - 8);
  const top = Math.min(y, window.innerHeight - rect.height - 8);
  menu.style.left = Math.max(8, left) + "px";
  menu.style.top = Math.max(8, top) + "px";

  setTimeout(() => {
    const dismiss = ev => {
      if (menu.contains(ev.target)) return;
      closeTrackContextMenu();
      document.removeEventListener("click", dismiss);
      document.removeEventListener("contextmenu", dismiss);
      window.removeEventListener("scroll", dismiss, true);
    };
    document.addEventListener("click", dismiss);
    document.addEventListener("contextmenu", dismiss);
    window.addEventListener("scroll", dismiss, true);
  }, 300);
}

async function playFromManualQueue(hide) {
  const name = sourceName();
  const original = currentTrack;
  if (hide !== false && original && !playAll) {
    setHidden(name, original.uri, true);
    lastAutoHidden = { playlistName: name, track: original };
  }
  const token = await getToken();
  while (manualQueue.length) {
    const candidate = manualQueue.shift();
    try {
      await playFromGesture(candidate, token);
      currentTrack = candidate;
      updatePlayerBar(candidate);
      renderTracks();
      highlightTracks();
      return;
    } catch (err) {
      if (isUnplayable(err)) continue;
      currentTrack = original;
      updatePlayerBar(original);
      setFeedback(err.message, true);
      renderTracks();
      highlightTracks();
      return;
    }
  }
  return playAdjacent(1, false);
}

const el = {
  status: document.getElementById("status-line"),
  auth: document.getElementById("auth-box"),
  clientId: document.getElementById("client-id-input"),
  redirect: document.getElementById("redirect-uri-display"),
  token: document.getElementById("token-input"),
  login: document.getElementById("login-btn"),
  tokenBtn: document.getElementById("token-btn"),
  main: document.getElementById("main"),
  source: document.getElementById("source-select"),
  refresh: document.getElementById("refresh-btn"),
  list: document.getElementById("track-list"),
  grid: document.getElementById("target-grid"),
  feedback: document.getElementById("feedback"),
  bar: document.getElementById("player-bar"),
  play: document.getElementById("play-btn"),
  pause: document.getElementById("pause-btn"),
  title: document.getElementById("player-title"),
  artists: document.getElementById("player-artists"),
  art: document.getElementById("player-art"),
  time: document.getElementById("player-time"),
  progress: document.getElementById("progress-bar")
};

function setStatus(text) {
  el.status.textContent = text;
}

function setFeedback(text, isError) {
  el.status.textContent = text || "";
  el.status.classList.toggle("error", Boolean(isError));
}

function formatMs(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

function bindImg(node, url) {
  node.src = url || PLACEHOLDER;
  node.onerror = () => {
    node.onerror = null;
    node.src = PLACEHOLDER;
  };
}

function redirectUri() {
  return location.origin + location.pathname;
}

function configuredClientId() {
  const t = typeof CLIENT_ID === "string" ? CLIENT_ID.trim() : "";
  return t && t !== "ERROR" ? t : "";
}

function getClientId() {
  return configuredClientId() || localStorage.getItem("sp_client_id") || "";
}

function configuredToken() {
  const t = typeof ACCESS_TOKEN === "string" ? ACCESS_TOKEN.trim() : "";
  return t && t !== "ERROR" ? t : null;
}

function parseCredential(raw) {
  let s = String(raw || "").trim();
  if (!s) return { type: "empty" };
  if (s.startsWith("{")) {
    try {
      const j = JSON.parse(s);
      if (j.access_token) {
        return {
          type: "access",
          token: j.access_token,
          refresh: j.refresh_token || null,
          expiresIn: j.expires_in || 3600
        };
      }
      if (j.client_id) return { type: "client_id", token: String(j.client_id).trim() };
    } catch (_) { /* fall through */ }
  }
  s = s.replace(/^Bearer\s+/i, "").trim().replace(/^["']|["']$/g, "");
  if (/^[0-9a-f]{32}$/i.test(s)) return { type: "client_id", token: s };
  if (s.length >= 80) return { type: "access", token: s, refresh: null, expiresIn: 3600 };
  return { type: "client_id", token: s };
}

function saveToken(access, refresh, expiresIn) {
  localStorage.setItem("sp_token", JSON.stringify({
    access: access.trim(),
    refresh: refresh || null,
    expiresAt: Date.now() + (expiresIn || 3600) * 1000
  }));
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function beginLogin(clientId) {
  const id = (clientId || getClientId()).trim();
  if (!id) throw new Error("ERROR no client id");
  localStorage.setItem("sp_client_id", id);
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(64)));
  const challenge = base64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
  localStorage.setItem("sp_verifier", verifier);
  const params = new URLSearchParams({
    client_id: id,
    response_type: "code",
    redirect_uri: redirectUri(),
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge
  });
  location.href = "https://accounts.spotify.com/authorize?" + params.toString();
}

async function handleCallback() {
  const params = new URLSearchParams(location.search);
  const err = params.get("error");
  if (err) throw new Error("ERROR auth " + err);
  const code = params.get("code");
  if (!code) return null;
  const verifier = localStorage.getItem("sp_verifier");
  const clientId = getClientId();
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
      code_verifier: verifier
    })
  });
  if (!res.ok) throw new Error("ERROR token " + res.status);
  const data = await res.json();
  saveToken(data.access_token, data.refresh_token, data.expires_in);
  history.replaceState(null, "", location.pathname);
  return data.access_token;
}

async function getToken() {
  const configured = configuredToken();
  if (configured) return configured;
  const raw = localStorage.getItem("sp_token");
  if (!raw) return null;
  const t = JSON.parse(raw);
  if (t.access && /^[0-9a-f]{32}$/i.test(t.access)) {
    localStorage.removeItem("sp_token");
    return null;
  }
  if (Date.now() < t.expiresAt - 60000) return t.access;
  if (!t.refresh) {
    localStorage.removeItem("sp_token");
    return null;
  }
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getClientId(),
      grant_type: "refresh_token",
      refresh_token: t.refresh
    })
  });
  if (!res.ok) {
    localStorage.removeItem("sp_token");
    throw new Error("ERROR refresh " + res.status);
  }
  const data = await res.json();
  saveToken(data.access_token, data.refresh_token || t.refresh, data.expires_in);
  return data.access_token;
}

function readMeCache() {
  const raw = localStorage.getItem(ME_KEY);
  if (!raw) return null;
  try {
    const c = JSON.parse(raw);
    if (!c || Date.now() > c.expiresAt) return null;
    return c;
  } catch (_) {
    return null;
  }
}

function writeMeCache(me) {
  localStorage.setItem(ME_KEY, JSON.stringify({
    id: me.id,
    display_name: me.display_name,
    expiresAt: Date.now() + ME_TTL
  }));
}

function readPlaylistsCache() {
  const raw = localStorage.getItem(PLAYLISTS_CACHE_KEY);
  if (!raw) return null;
  try {
    const c = JSON.parse(raw);
    if (!c || Date.now() > c.expiresAt || !Array.isArray(c.items)) return null;
    return c.items;
  } catch (_) {
    return null;
  }
}

function writePlaylistsCache(items) {
  localStorage.setItem(PLAYLISTS_CACHE_KEY, JSON.stringify({
    items,
    expiresAt: Date.now() + PLAYLISTS_TTL
  }));
}

function clearPlaylistsCache() {
  localStorage.removeItem(PLAYLISTS_CACHE_KEY);
}

async function ensureIdentity(token) {
  const cached = readMeCache();
  if (cached) return cached;
  const me = await validateToken(token);
  writeMeCache(me);
  return me;
}

const PLAYLIST_INDEX_CACHE_KEY = "sp_playlist_index_v1";
const PLAYLIST_INDEX_TTL = 24 * 60 * 60 * 1000;

async function ensurePlaylists(token, forceRefresh = false) {
  if (!forceRefresh) {
    const raw = localStorage.getItem(PLAYLIST_INDEX_CACHE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Date.now() < parsed.expiresAt && Array.isArray(parsed.items)) {
          return parsed.items;
        }
      } catch (_) {}
    }
  }
  const found = await discoverPlaylists(token);
  localStorage.setItem(PLAYLIST_INDEX_CACHE_KEY, JSON.stringify({
    items: found,
    expiresAt: Date.now() + PLAYLIST_INDEX_TTL
  }));
  return found;
}

async function syncAllPlaylistsFromWix(token) {
  const res = await fetch(PLAYLIST_DATA_INDEX_URL + "?accessToken=" + encodeURIComponent(token));
  if (!res.ok) return 0;
  const json = await res.json();
  if (json.error) return 0;
  const items = json.items || [];
  if (!items.length) return 0;
  
  window.wixSnapshotMap = window.wixSnapshotMap || {};
  for (const item of items) {
    if (item.playlistId && item.snapshotId) {
      window.wixSnapshotMap[item.playlistId] = item.snapshotId;
    }
  }

  const byId = {};
  for (const [name, entry] of Object.entries(PLAYLISTS)) byId[entry.id] = name;
  let applied = 0;
  for (const item of items) {
    const name = byId[item.playlistId];
    if (!name) continue;
    const local = cache[name];
    const localAt = local && !local.partial ? Number(local.loadedAt) || 0 : 0;
    const wixAt = Number(item.loadedAt) || 0;
    if (wixAt <= localAt) continue;
    if (await applyPlaylistFromWix(name, token)) applied++;
  }
  return applied;
}

async function resolvePlaylistData(name, token) {
  const entry = PLAYLISTS[name];
  if (!entry || !entry.id) return "none";
  const local = cache[name];
  const localComplete = Boolean(local && local.tracks && local.tracks.length && !local.partial);
  if (local && local.id && hasPending(local.id)) return "local";

  let liveMeta = null;
  try {
    const metaRes = await fetch(`https://api.spotify.com/v1/playlists/${entry.id}?fields=snapshot_id`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (metaRes.ok) liveMeta = await metaRes.json();
  } catch (_) {}

  const liveSnapshot = liveMeta ? liveMeta.snapshot_id : null;
  const wixKnownSnapshot = window.wixSnapshotMap && window.wixSnapshotMap[entry.id];

  if (localComplete && liveSnapshot && local.snapshot_id === liveSnapshot) {
    return "local";
  }

  let wix = null;
  let wixAt = 0;
  try {
const res = await fetch(
  PLAYLIST_DATA_URL
    + "?accessToken=" + encodeURIComponent(token)
    + "&playlistId=" + encodeURIComponent(entry.id)
);
if (res.ok) {
  const json = await res.json();
  if (!json.error && json.data) {
    await new Promise(r => setTimeout(r, 10));
    const parsed = JSON.parse(json.data);
    if (parsed && Array.isArray(parsed.tracks) && parsed.tracks.length) {
      wix = parsed;
      wixAt = Number(parsed.loadedAt) || 0;
    }
  }
}
  } catch (_) {}

  if (wix && liveSnapshot && wix.snapshot_id === liveSnapshot) {
    cache[name] = {
      id: entry.id,
      label: wix.label || entry.label,
      image: wix.image || null,
      loadedAt: wixAt,
      total: wix.total || wix.tracks.length,
      tracks: wix.tracks,
      snapshot_id: wix.snapshot_id || null,
    };
    writeCache();
    return "wix";
  }

  if (localComplete && Number(local.loadedAt || 0) >= wixAt) {
    return "local";
  }

  if (wix) {
    cache[name] = {
      id: entry.id,
      label: wix.label || entry.label,
      image: wix.image || null,
      loadedAt: wixAt,
      total: wix.total || wix.tracks.length,
      tracks: wix.tracks,
      snapshot_id: wix.snapshot_id || null,
    };
    writeCache();
    return "wix";
  }

  return "none";
}

async function validateToken(token) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    throw new Error("ERROR token 401 — Client ID and Client Secret are not access tokens. Put the Client ID above and log in.");
  }
  if (!res.ok) throw new Error("ERROR token " + res.status);
  return res.json();
}

function readCache() {
  const raw = localStorage.getItem(CACHE_KEY);
  cache = raw ? JSON.parse(raw) : {};
  return cache;
}

function writeCache() {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

async function spFetch(url, token, attempt = 1) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: "Bearer " + token }
  });
  if (res.status === 429) {
    let body = null;
    try {
      body = await res.clone().json();
    } catch (_) { /* not json */ }
    if (body && body.error && body.error.reason === "QUOTA_EXCEEDED") {
      setStatus("ERROR quota exceeded — stop and wait");
      return res;
    }
    if (attempt > 4) return res;
    const retryAfter = Number(res.headers.get("Retry-After"));
    const wait = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 1000 * Math.pow(2, attempt - 1);
    await new Promise(r => setTimeout(r, wait));
    return spFetch(url, token, attempt + 1);
  }
  if (res.status >= 500 && attempt <= 4) {
    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
    return spFetch(url, token, attempt + 1);
  }
  return res;
}

async function loadPlaylist(name, token, prefetchedMeta) {
  const entry = PLAYLISTS[name] || cache[name];
  if (entry && entry.local) return cache[name];
  const raw = String(PLAYLISTS[name].id || "").trim();
  const match = raw.match(/([0-9A-Za-z]{22})(?:[?/]|$)/);
  const id = match ? match[1] : raw;
  let meta = prefetchedMeta || null;
  if (!meta) {
    const metaRes = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!metaRes.ok) throw new Error("ERROR meta " + name + " " + metaRes.status);
    meta = await metaRes.json();
  }
  const tracks = [];
  let url = `https://api.spotify.com/v1/playlists/${id}/items?limit=100`;
  while (url) {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("ERROR load " + name + " " + res.status);
    const data = await res.json();
    for (const row of data.items) {
      const t = row.item || row.track;
      if (!t || typeof t !== "object" || !t.uri) continue;
      tracks.push({
        uri: t.uri,
        name: t.name,
        artists: t.artists.map(a => a.name).join(", "),
        durationMs: t.duration_ms,
        image: t.album && t.album.images && t.album.images.length ? t.album.images[0].url : null,
        isrc: t.external_ids && t.external_ids.isrc ? t.external_ids.isrc : null
      });
    }
    url = data.next;
  }
  cache[name] = {
    id,
    label: meta.name,
    image: meta.images && meta.images.length ? meta.images[0].url : null,
    loadedAt: Date.now(),
    total: meta.tracks && typeof meta.tracks.total === "number" ? meta.tracks.total : tracks.length,
    snapshot_id: meta.snapshot_id || null,
    tracks
  };
  writeCache();
  return cache[name];
}

async function discoverPlaylists(token) {
  const list = [];
  let url = "https://api.spotify.com/v1/me/playlists?limit=50";
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("ERROR discover " + res.status);
    const data = await res.json();
    for (const p of data.items) {
      if (!p || !p.id) continue;
      list.push({
        id: p.id,
        label: p.name,
        image: p.images && p.images.length ? p.images[0].url : null,
        owner: p.owner && p.owner.display_name ? p.owner.display_name : null,
        total: p.tracks && typeof p.tracks.total === "number" ? p.tracks.total : null
      });
    }
    url = data.next;
  }
  return list;
}

async function loadAll(token) {
  const names = Object.keys(PLAYLISTS);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    setStatus("Loading " + (i + 1) + "/" + names.length + ": " + name);
    await loadPlaylist(name, token);
  }
}

function resolveTargets(selected) {
  const targets = new Set([selected]);
  const stack = [selected];
  while (stack.length) {
    const node = stack.pop();
    for (const next of (RULES[node] || [])) {
      if (!targets.has(next)) {
        targets.add(next);
        stack.push(next);
      }
    }
  }
  return [...targets];
}

function initPlayer(onState) {
  return new Promise((resolve, reject) => {
    const attach = () => {
      player = new Spotify.Player({
        name: "spotifylter",
        getOAuthToken: async cb => cb(await getToken()),
        volume: Number(localStorage.getItem("sp_volume") || 0.8)
      });
      player.addListener("playback_error", ({ message }) => {
        if (message && message.includes("M_ID")) return;
        setFeedback("player " + message, true);
      });
      player.addListener("ready", ({ device_id }) => {
        deviceId = device_id;
        resolve(device_id);
      });
      player.addListener("not_ready", ({ device_id }) => {
        setStatus("Player disconnected — reconnecting");
        setTimeout(() => {
          try { player.connect(); } catch (_) { /* ignore */ }
        }, 1500);
      });
      player.addListener("player_state_changed", onState);
      player.addListener("initialization_error", e => reject(new Error("ERROR init " + e.message)));
      player.addListener("authentication_error", e => reject(new Error("ERROR auth " + e.message)));
      player.addListener("account_error", e => reject(new Error("ERROR account " + e.message)));
      player.connect();
    };
    window.onSpotifyWebPlaybackSDKReady = attach;
    if (window.Spotify) {
      attach();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.onerror = () => reject(new Error("ERROR sdk load"));
    document.head.appendChild(script);
  });
}

async function playTrack(trackUri, token, positionMs, attempt = 1) {
  const body = { uris: [trackUri], position_ms: typeof positionMs === "number" ? Math.floor(positionMs) : 0 };
  const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok && res.status !== 204) {
    if (attempt < 3 && (res.status >= 500 || res.status === 429)) {
      await new Promise(r => setTimeout(r, 500 * attempt));
      return playTrack(trackUri, token, positionMs, attempt + 1);
    }
    throw new Error("ERROR play " + res.status);
  }
}

function previewPosition(durationMs, part) {
  const positions = {
    A: durationMs * 0.20,
    B: durationMs * 0.35,
    C: durationMs * 0.50,
    D: durationMs * 0.65,
    E: durationMs * 0.80
  };
  return Math.floor(positions[part] || 0);
}

function seekPreview(durationMs, part) {
  if (!player) return Promise.reject(new Error("ERROR no player"));
  return player.seek(previewPosition(durationMs, part));
}

async function fetchPlaybackState(token) {
  try {
    const res = await fetch("https://api.spotify.com/v1/me/player", {
      cache: "no-store",
      headers: { Authorization: "Bearer " + token }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.item) return null;
    return {
      uri: data.item.uri,
      name: data.item.name,
      artists: (data.item.artists || []).map(a => a.name).join(", "),
      image: data.item.album && data.item.album.images.length ? data.item.album.images[0].url : null,
      durationMs: data.item.duration_ms,
      position: data.progress_ms || 0,
      paused: !data.is_playing,
      timestamp: Date.now(),
      device: data.device
    };
  } catch (_) {
    return null;
  }
}

async function playFromGesture(track, token, positionMs) {
  if (OFFLINE) {
    currentTrack = track;
    updatePlayerBar(track);
    pushRecent(track);
    highlightTracks();
    markGridHasTrack();
    paintVersionsButton();
    applyAdaptiveColor(track);
    setFeedback("Playing locally (offline)", false);
    return;
  }

  if (player) await player.activateElement();
  pendingTrackUri = track.uri;
  pendingTrackUriAt = Date.now();
  currentTrack = track;
  updatePlayerBar(track);
  highlightTracks();
  markGridHasTrack();
  pushRecent(track);
  applyAdaptiveColor(track);

  lastState = {
    paused: false,
    position: typeof positionMs === "number" ? positionMs : 0,
    duration: track.durationMs,
    timestamp: Date.now(),
    track_window: { current_track: { uri: track.uri, name: track.name, artists: [{ name: track.artists }], duration_ms: track.durationMs } }
  };
  startProgress(lastState);
  const toggleIcon = document.querySelector("#player-view .np-toggle i");
  if (toggleIcon) toggleIcon.className = "fa-solid fa-pause";

  playTrack(track.uri, token, positionMs).catch(err => {
    pendingTrackUri = null;
    pendingTrackUriAt = 0;
    setFeedback(err.message, true);
  });
}

async function saveToLibrary(track, token, attempt = 1) {
  const params = new URLSearchParams({ uris: track.uri });
  const res = await fetch("https://api.spotify.com/v1/me/library?" + params.toString(), {
    method: "PUT",
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) {
    if (attempt < 2 && (res.status >= 500 || res.status === 429)) {
      await new Promise(r => setTimeout(r, 800 * attempt));
      return saveToLibrary(track, token, attempt + 1);
    }
    throw new Error("ERROR library " + res.status);
  }
}

function genOpId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

function playlistNameById(id) {
  for (const name of Object.keys(PLAYLISTS)) {
    if (PLAYLISTS[name].id === id) return name;
  }
  return null;
}

async function pushOp(op) {
  const token = await getToken();
  if (!token) return;
  const payload = {
    accessToken: token,
    op: {
      opId: genOpId(),
      playlistId: op.playlistId,
      trackUri: op.trackUri,
      action: op.action,
      trackJson: op.track ? JSON.stringify(op.track) : "",
      createdAt: new Date().toISOString()
    }
  };
  const res = await fetch(OPS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("ERROR ops push " + res.status);
  const data = await res.json();
  if (data.error) throw new Error("ERROR ops push " + data.error);
}

function applyOp(op) {
  if (!op || !op.playlistId) return false;
  const name = playlistNameById(op.playlistId);
  if (!name) return false;
  const opTime = Date.parse(op.createdAt);
  if (!Number.isFinite(opTime)) return false;
  let entry = cache[name];
  if (!entry) {
    entry = {
      id: op.playlistId,
      label: name,
      image: PLAYLISTS[name] ? PLAYLISTS[name].image || null : null,
      loadedAt: 0,
      tracks: [],
      partial: true
    };
    cache[name] = entry;
  }
  if (!entry.tracks) entry.tracks = [];
  if (entry.loadedAt && opTime <= entry.loadedAt) return true;
  if (op.action === "remove") {
    entry.tracks = entry.tracks.filter(t => t.uri !== op.trackUri);
    entry.loadedAt = Math.max(Number(entry.loadedAt) || 0, opTime);
    return true;
  }
  if (op.action === "add") {
    let track = null;
    if (op.trackJson) {
      try { track = JSON.parse(op.trackJson); } catch (_) { track = null; }
    }
    if (!track) track = lookupTrack(op.trackUri);
    if (!track) track = { uri: op.trackUri, name: op.trackUri, artists: "", durationMs: 0, image: null };
    if (!entry.tracks.some(t => sameRecording(t, track))) entry.tracks.push(track);
    entry.loadedAt = Math.max(Number(entry.loadedAt) || 0, opTime);
    return true;
  }
  return false;
}

async function syncOps(token) {
  const since = localStorage.getItem(OPS_CURSOR_KEY) || new Date(0).toISOString();
  const res = await fetch(OPS_URL + "?accessToken=" + encodeURIComponent(token) + "&since=" + encodeURIComponent(since));
  if (!res.ok) throw new Error("ERROR ops pull " + res.status);
  const data = await res.json();
  if (data.error) throw new Error("ERROR ops pull " + data.error);
  const items = data.items || [];
  if (!items.length) return 0;
  let applied = 0;
  let handled = 0;
  let changed = false;
  let newest = since;
  const seen = new Set();
  for (const op of items) {
    if (op.opId) {
      if (seen.has(op.opId)) continue;
      seen.add(op.opId);
    }
    const before = JSON.stringify(cache[playlistNameById(op.playlistId)]?.tracks?.length);
    if (applyOp(op)) {
      handled++;
      const after = JSON.stringify(cache[playlistNameById(op.playlistId)]?.tracks?.length);
      if (before !== after) changed = true;
      if (op.createdAt && op.createdAt > newest) newest = op.createdAt;
    }
  }
  if (handled) localStorage.setItem(OPS_CURSOR_KEY, newest);
  if (changed) {
    writeCache();
    renderTracks();
    renderGrid();
    highlightTracks();
    markGridHasTrack();
  }
  return handled;
}

function paintPendingButton() {
  const btn = document.getElementById("pending-btn");
  if (!btn) return;
  if (!pendingQueue.length) {
    btn.style.display = "none";
    return;
  }
  btn.style.display = "inline-flex";
  btn.innerHTML = '<i class="fa-solid fa-clock"></i><span>Replay ' + pendingQueue.length + '</span>';
  btn.classList.add("on");
}

async function replayPending() {
  if (apiHoldUntil() > Date.now()) {
    setFeedback("ERROR hold still active", true);
    return;
  }
  if (!pendingQueue.length) return;
  const token = await getToken();
  const snapshot = [...pendingQueue];
  const touched = new Set();

  for (let i = 0; i < snapshot.length; i++) {
    const item = snapshot[i];
    const name = playlistNameById(item.playlistId);
    setStatus("Replaying " + (i + 1) + "/" + snapshot.length + "...");
    try {
      let res;
      if (item.action === "add") {
        res = await fetch("https://api.spotify.com/v1/playlists/" + item.playlistId + "/items", {
          method: "POST",
          headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
          body: JSON.stringify({ uris: [item.trackUri] })
        });
      } else {
        res = await fetch("https://api.spotify.com/v1/playlists/" + item.playlistId + "/items", {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
          body: JSON.stringify({ items: [{ uri: item.trackUri }] })
        });
      }
      if (res.status === 429) {
        const ra = Number(res.headers.get("Retry-After"));
        if (Number.isFinite(ra) && ra > 0) apiHoldSet(ra);
        setStatus("");
        setFeedback("ERROR hold again — stopped after " + i + " items", true);
        return;
      }
      if (!res.ok && res.status !== 200 && res.status !== 204 && res.status !== 404) {
        throw new Error("HTTP " + res.status);
      }
      await deletePendingFromWix(item.opId, token);
      if (name) {
        touched.add(name);
        let t = null;
        if (item.trackJson) {
          try { t = JSON.parse(item.trackJson); } catch (_) { t = null; }
        }
        if (!t) t = { uri: item.trackUri };
        applyPendingLocally(name, t, item.action);
      }
      console.log("[data] replayed", item.action, item.playlistId, item.trackUri);
    } catch (err) {
      console.warn("[data] replay failed", item.opId, err.message);
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  for (const name of touched) {
    try {
      if (cache[name] && !hasPending(cache[name].id)) {
        cache[name].loadedAt = Date.now();
        writeCache();
        await commitPlaylist(name, token);
      }
    } catch (err) {
      console.warn("[data] post-replay commit failed", name, err.message);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  setStatus("");
  setFeedback("replayed " + touched.size + " playlists", false);
  renderGrid();
  renderTracks();
  highlightTracks();
  markGridHasTrack();
}

function hasPending(playlistId) {
  return pendingQueue.some(p => p.playlistId === playlistId);
}

async function queuePending(op, token) {
  const opId = genOpId();
  const record = {
    opId,
    playlistId: op.playlistId,
    trackUri: op.trackUri,
    action: op.action,
    trackJson: op.track ? JSON.stringify(op.track) : "",
    createdAt: new Date().toISOString()
  };
  pendingQueue.push(record);
  paintPendingButton();
  schedulePendingReplay();
  try {
    await fetch(PENDING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token, op: record })
    });
    console.log("[data] queued", op.action, op.playlistId, op.trackUri);
  } catch (err) {
    console.warn("[data] queue push failed", err.message);
  }
}

async function loadPendingFromWix(token) {
  try {
    const res = await fetch(PENDING_URL + "?accessToken=" + encodeURIComponent(token));
    if (!res.ok) return;
    const json = await res.json();
    if (json.error) return;
    pendingQueue = json.items || [];
    paintPendingButton();
    schedulePendingReplay();
    console.log("[data] pending loaded", pendingQueue.length);
  } catch (err) {
    console.warn("[data] pending pull failed", err.message);
  }
}

async function deletePendingFromWix(opId, token) {
  pendingQueue = pendingQueue.filter(p => p.opId !== opId);
  paintPendingButton();
  try {
    await fetch(PENDING_DELETE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token, opId })
    });
  } catch (err) {
    console.warn("[data] pending delete failed", err.message);
  }
}

function applyPendingLocally(name, track, action) {
  if (action === "add") {
    if (!cache[name]) {
      cache[name] = {
        id: PLAYLISTS[name].id,
        label: name,
        image: PLAYLISTS[name].image || null,
        loadedAt: 0,
        tracks: [],
        partial: true
      };
    }
    if (!cache[name].tracks) cache[name].tracks = [];
    if (!cache[name].tracks.some(t => sameRecording(t, track))) {
      cache[name].tracks.push(track);
    }
  } else if (action === "remove") {
    if (cache[name] && cache[name].tracks) {
      cache[name].tracks = cache[name].tracks.filter(t => !sameRecording(t, track));
    }
  }
  writeCache();
}

async function addTrack(track, selectedName, token) {
  const entry = cache[selectedName];
  if (entry && entry.tracks && entry.tracks.some(t => sameRecording(t, track))) return 0;
  const playlistId = PLAYLISTS[selectedName].id;

  if (apiHoldUntil() > Date.now()) {
    await queuePending({ playlistId, trackUri: track.uri, action: "add", track }, token);
    applyPendingLocally(selectedName, track, "add");
    return 1;
  }

  const res = await fetch("https://api.spotify.com/v1/playlists/" + playlistId + "/items", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ uris: [track.uri] })
  });

  if (res.status === 429) {
    const ra = Number(res.headers.get("Retry-After"));
    if (Number.isFinite(ra) && ra > 0) apiHoldSet(ra);
    await queuePending({ playlistId, trackUri: track.uri, action: "add", track }, token);
    applyPendingLocally(selectedName, track, "add");
    return 1;
  }

  if (!res.ok) throw new Error("ERROR add " + selectedName + " " + res.status);

  if (!cache[selectedName]) {
    cache[selectedName] = {
      id: playlistId,
      label: selectedName,
      image: PLAYLISTS[selectedName].image || null,
      loadedAt: Date.now(),
      tracks: [],
      partial: true
    };
  }
  if (!cache[selectedName].tracks) cache[selectedName].tracks = [];
  cache[selectedName].tracks.push(track);
  cache[selectedName].loadedAt = Date.now();
  writeCache();
  pushOp({ playlistId, trackUri: track.uri, action: "add", track }).catch(err => setFeedback(err.message, true));
  return 1;
}

function sourceName() {
  const saved = localStorage.getItem(SOURCE_KEY);
  if (saved && (SOURCE_CANDIDATES.includes(saved) || (typeof PLAYLISTS !== 'undefined' && PLAYLISTS[saved]))) {
    return saved;
  }
  return SOURCE_CANDIDATES[0];
}


const LOCAL_PLAYLISTS_DELETE_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/localplaylists_delete";

function renderSourceGrid() {
  let grid = document.getElementById("source-grid");
  if (!grid) {
    grid = document.createElement("div");
    grid.id = "source-grid";
    el.source.parentElement.insertBefore(grid, el.source);
  }
  el.source.style.display = "none";
  renderGrid("source");
  grid.style.display = sourcesCollapsed ? "none" : "grid";
}



async function syncPlaylist(name, token) {
  const entry = cache[name] || PLAYLISTS[name];
  if (entry && entry.local) return false;
  const currentEntry = cache[name];
  if (!currentEntry || !currentEntry.id) {
    await loadPlaylist(name, token);
    return true;
  }
  if (hasPending(currentEntry.id)) {
    console.log("[data] sync skip", name, "pending exists");
    return false;
  }
  const metaRes = await fetch(`https://api.spotify.com/v1/playlists/${currentEntry.id}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!metaRes.ok) throw new Error("ERROR meta " + name + " " + metaRes.status);
  const meta = await metaRes.json();

  if (currentEntry.snapshot_id && meta.snapshot_id === currentEntry.snapshot_id) {
    currentEntry.loadedAt = Date.now();
    writeCache();
    return false;
  }

  await loadPlaylist(name, token, meta);
  return true;
}

async function syncPlaylistToWix(name, token) {
  const entry = cache[name];
  if (!entry || !entry.id) return;
  if (entry.partial) return;
  if (!entry.tracks || !entry.tracks.length) return;
  if (hasPending(entry.id)) {
    console.log("[data] push skip", name, "has pending queue");
    return;
  }
  const payload = JSON.stringify({
    label: entry.label,
    image: entry.image,
    total: entry.total,
    loadedAt: entry.loadedAt,
    tracks: entry.tracks,
    snapshot_id: entry.snapshot_id || null
  });
  console.log("[data] push start", name, entry.tracks.length + " tracks", payload.length + " bytes");
  try {
    const res = await fetch(PLAYLIST_DATA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: token,
        playlistId: entry.id,
        data: payload
      })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn("[data] push failed", name, res.status, json.error || "");
      return;
    }
    if (json.error) {
      console.warn("[data] push error", name, json.error);
      return;
    }
    console.log("[data] push ok", name, entry.tracks.length + " tracks");
  } catch (err) {
    console.warn("[data] push network error", name, err.message);
  }
}

async function clearOpsForPlaylist(name, token) {
  const entry = cache[name];
  if (!entry || !entry.id) return;
  try {
    const res = await fetch(CLEAROPS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token, playlistId: entry.id })
    });
    const json = await res.json().catch(() => ({}));
    console.log("[data] clear ops", name, res.ok && !json.error ? ("cleared " + (json.cleared || 0)) : ("failed " + (json.error || res.status)));
  } catch (err) {
    console.warn("[data] clear ops error", name, err.message);
  }
}

async function commitPlaylist(name, token) {
  const entry = cache[name];
  if (!entry || !entry.id || entry.partial || !entry.tracks || !entry.tracks.length) {
    console.log("[data] commit skip", name, "nothing to commit");
    return;
  }
  try {
    await syncPlaylistToWix(name, token);
  } catch (_) {
    console.log("[data] commit skip", name, "push failed, keeping ops");
    return;
  }
  await clearOpsForPlaylist(name, token);
}

async function applyPlaylistFromWix(name, token) {
  const entry = PLAYLISTS[name];
  if (!entry || !entry.id) return false;
  try {
    const res = await fetch(
      PLAYLIST_DATA_URL
        + "?accessToken=" + encodeURIComponent(token)
        + "&playlistId=" + encodeURIComponent(entry.id)
    );
    if (!res.ok) return false;
    const json = await res.json();
    if (json.error || !json.data) return false;
    const parsed = JSON.parse(json.data);
    if (!parsed || !Array.isArray(parsed.tracks) || !parsed.tracks.length) return false;
    cache[name] = {
      id: entry.id,
      label: parsed.label || entry.label,
      image: parsed.image || null,
      loadedAt: Number(parsed.loadedAt) || Date.now(),
      total: parsed.total || parsed.tracks.length,
      snapshot_id: parsed.snapshot_id || null,
      tracks: parsed.tracks
    };
    writeCache();
    return true;
  } catch (_) {
    return false;
  }
}

async function syncAllPlaylistsFromWix(token) {
  const res = await fetch(PLAYLIST_DATA_INDEX_URL + "?accessToken=" + encodeURIComponent(token));
  if (!res.ok) return 0;
  const json = await res.json();
  if (json.error) return 0;
  const items = json.items || [];
  if (!items.length) return 0;
  const byId = {};
  for (const [name, entry] of Object.entries(PLAYLISTS)) byId[entry.id] = name;
  let applied = 0;
  for (const item of items) {
    const name = byId[item.playlistId];
    if (!name) continue;
    const local = cache[name];
    const localAt = local && !local.partial ? Number(local.loadedAt) || 0 : 0;
    const wixAt = Number(item.loadedAt) || 0;
    if (wixAt <= localAt) continue;
    if (await applyPlaylistFromWix(name, token)) applied++;
  }
  return applied;
}

async function resolvePlaylistData(name, token) {
  const entry = PLAYLISTS[name];
  if (!entry || !entry.id) {
    console.log("[data] resolve", name, "no playlist id");
    return "none";
  }
  const local = cache[name];
  const localComplete = Boolean(local && local.tracks && local.tracks.length && !local.partial);
  if (local && local.id && hasPending(local.id)) {
    console.log("[data] resolve", name, "-> pending wins, using local");
    return "local";
  }
  const localAt = localComplete ? Number(local.loadedAt) || 0 : 0;
  console.log("[data] resolve", name, "local", localComplete ? (local.tracks.length + " tracks") : "incomplete", localAt ? new Date(localAt).toISOString() : "no date");

  let wix = null;
  let wixAt = 0;
  try {
    const res = await fetch(
      PLAYLIST_DATA_URL
        + "?accessToken=" + encodeURIComponent(token)
        + "&playlistId=" + encodeURIComponent(entry.id)
    );
    if (res.ok) {
      const json = await res.json();
      if (!json.error && json.data) {
        const parsed = JSON.parse(json.data);
        if (parsed && Array.isArray(parsed.tracks) && parsed.tracks.length) {
          wix = parsed;
          wixAt = Number(parsed.loadedAt) || 0;
        }
      }
    }
  } catch (err) {
    console.warn("[data] wix fetch error", name, err.message);
  }
  console.log("[data] resolve", name, "wix", wix ? (wix.tracks.length + " tracks") : "empty", wixAt ? new Date(wixAt).toISOString() : "no date");

  if (localComplete && localAt >= wixAt) {
    if (!wix || wixAt < localAt) {
      console.log("[data] resolve", name, "-> local wins, pushing to wix");
      try { await syncPlaylistToWix(name, token); } catch (_) { /* best effort */ }
    } else {
      console.log("[data] resolve", name, "-> local wins (equal or newer), wix already up to date");
    }
    return "local";
  }

  if (wix) {
    console.log("[data] resolve", name, "-> wix wins, applying to local");
    cache[name] = {
      id: entry.id,
      label: wix.label || entry.label,
      image: wix.image || null,
      loadedAt: wixAt,
      total: wix.total || wix.tracks.length,
      tracks: wix.tracks,
      snapshot_id: wix.snapshot_id || null,
    };
    writeCache();
    return "wix";
  }

  console.log("[data] resolve", name, "-> nothing anywhere, will hit API");
  return "none";
}

function closeToolPanel() {
  const old = document.getElementById("tool-panel");
  if (old) old.remove();
  toolsCollapsed = true;
  localStorage.setItem("sp_tools_collapsed", "1");
  renderToolsGrid();
  const toolsBtn = document.querySelector('[data-tool="tools"]');
  if (toolsBtn) toolsBtn.classList.remove("active");
}

function setTracksOpen(open) {
  const songsToggle = document.querySelector(".songs-row .outline-btn");
  const songsTools = document.querySelector(".songs-tools");
  const songsFilters = document.querySelector(".songs-filters");
  if (!el.list) return;
  el.list.style.display = open ? "grid" : "none";
  if (songsTools) songsTools.style.display = open ? "flex" : "none";
  if (songsFilters) songsFilters.style.display = open ? "flex" : "none";
  if (songsToggle) songsToggle.classList.toggle("active", Boolean(open));
}

async function selectSource(name, play) {
  if (play) changedPlayingNow();
  localStorage.setItem(SOURCE_KEY, name);
  setTracksOpen(true);
  
  sourcesCollapsed = true;
  localStorage.setItem("sp_sources_collapsed", "1");
  const sourcesLabel = document.getElementById("sources-label");
  if (sourcesLabel) sourcesLabel.textContent = sourceName();
  const grid = document.getElementById("source-grid");
  if (grid) grid.style.display = "none";
  const pickFirst = () => {
    const tracks = (cache[name] && cache[name].tracks) || [];
    return tracks.find(t => !isHidden(name, t.uri)) || tracks[0];
  };
  const finish = async () => {
    renderTracks();
    if (play || !currentTrack) {
      const first = pickFirst();
      if (first) {
        currentTrack = first;
        updatePlayerBar(first);
      }
    }
    highlightTracks();
    markGridHasTrack();
    if (play && currentTrack) {
      try {
        const token = await getToken();
        await playFromGesture(currentTrack, token);
        updatePlayerBar(currentTrack);
        highlightTracks();
        markGridHasTrack();
      } catch (err) {
        setFeedback(err.message, true);
      }
    }
  };

  const entry = PLAYLISTS[name] || cache[name];
  if (entry && entry.local) {
    renderTracks();
    if (play || !currentTrack) {
      const first = pickFirst();
      if (first) {
        currentTrack = first;
        updatePlayerBar(first);
      }
    }
    highlightTracks();
    markGridHasTrack();
    if (play && currentTrack) {
      try {
        const token = await getToken();
        await playFromGesture(currentTrack, token);
      } catch (err) {
        setFeedback(err.message, true);
      }
    }
    return;
  }

  try {
    const token = await getToken();
    setStatus("Loading " + name);
    const source = await resolvePlaylistData(name, token);
    if (source === "none") {
      const changed = await syncPlaylist(name, token);
      if (changed) await commitPlaylist(name, token);
    } else {
      const changed = await syncPlaylist(name, token);
      if (changed) {
        try { await commitPlaylist(name, token); } catch (_) {}
        renderSourceGrid();
      }
    }
    setStatus("");
    await finish();
  } catch (err) {
    setStatus("");
    setFeedback(err.message, true);
  }
}

function renderSourceSelect() {
  el.source.innerHTML = "";
  const saved = localStorage.getItem(SOURCE_KEY);
  for (const name of SOURCE_CANDIDATES) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = (cache[name] && cache[name].label) || PLAYLISTS[name].label;
    el.source.appendChild(opt);
  }
  el.source.value = SOURCE_CANDIDATES.includes(saved) ? saved : SOURCE_CANDIDATES[0];
}

let _lastDisplayKey = "";
let _lastDisplayResult = [];

function displayTracks(name) {
  const cacheKey = `${name}:${songFilter}:${songHiddenFilter}:${songSort}:${reverseOrder}:${(cache[name]?.tracks || []).length}`;
  if (cacheKey === _lastDisplayKey) return _lastDisplayResult;

  const all = (cache[name] && cache[name].tracks) || [];
  let list = all;
  
  if (songHiddenFilter !== "all") {
    list = list.filter(t => {
      const h = isHidden(name, t.uri);
      return songHiddenFilter === "hidden" ? h : !h;
    });
  }
  if (songFilter) {
    const q = songFilter.toLowerCase();
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.artists.toLowerCase().includes(q));
  }
  if (songSort !== "default") {
    list = [...list];
    if (songSort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (songSort === "artist") list.sort((a, b) => a.artists.localeCompare(b.artists));
    else if (songSort === "durationAsc") list.sort((a, b) => a.durationMs - b.durationMs);
    else if (songSort === "durationDesc") list.sort((a, b) => b.durationMs - a.durationMs);
  }
  
  _lastDisplayKey = cacheKey;
  _lastDisplayResult = reverseOrder ? [...list].reverse() : list;
  return _lastDisplayResult;
}

function paintSongsProgress(name) {
  const all = (cache[name] && cache[name].tracks) || [];
  let hidden = 0;
  for (const t of all) if (isHidden(name, t.uri)) hidden++;
  const total = all.length;
  const pct = total ? Math.round((hidden / total) * 100) : 0;
  const node = document.getElementById("songs-progress");
  if (node) node.textContent = hidden + " filtered · " + total + " total · " + pct + "%";
}

function queueTracks(name) {
  if (filterQueue) return displayTracks(name);
  const all = (cache[name] && cache[name].tracks) || [];
  return reverseOrder ? [...all].reverse() : all;
}

function renderTracks() {
  const name = sourceName();
  const tracks = displayTracks(name);
  let idx = 0;
  el.list.innerHTML = "";
  for (const track of tracks) {
    const hidden = isHidden(name, track.uri);
    const card = document.createElement("div");
    card.dataset.index = String(idx);
    card.className = "track" + (currentTrack && sameRecording(track, currentTrack) ? " current" : "") + (hidden ? " dimmed" : "");
    idx++;
    card.setAttribute("role", "listitem");
    const img = document.createElement("img");
    img.alt = "";
    bindImg(img, track.image);
    const meta = document.createElement("div");
    meta.innerHTML = `<p class="track-name"></p><p class="track-artists"></p><p class="track-dur"></p>`;
    meta.querySelector(".track-name").textContent = track.name;
    meta.querySelector(".track-artists").textContent = track.artists;
    meta.querySelector(".track-dur").textContent = formatMs(track.durationMs);
    card.append(img, meta);
    if (hidden) {
      const un = document.createElement("button");
      un.type = "button";
      un.className = "track-unhide";
      un.textContent = "+";
      un.addEventListener("click", ev => {
        ev.stopPropagation();
        setHidden(name, track.uri, false);
        renderTracks();
      });
      card.appendChild(un);
    }
    card.addEventListener("contextmenu", ev => {
      ev.preventDefault();
      openTrackContextMenu(ev.clientX, ev.clientY, track);
    });
    attachTrackTouchHold(card, track);
    card.addEventListener("click", async () => {
      try {
        changedPlayingNow()
        const token = await getToken();
        currentTrack = track;
        await playFromGesture(track, token);
        updatePlayerBar(track);
        highlightTracks();
      } catch (err) {
        setFeedback(err.message, true);
      }
    });
    el.list.appendChild(card);
  }
  paintSongsProgress(name);
  refreshNpPanel();
}

function highlightTracks() {
  const tracks = displayTracks(sourceName());
  for (const node of el.list.querySelectorAll(".track")) {
    const i = Number(node.dataset.index);
    node.classList.toggle("current", Boolean(currentTrack) && sameRecording(tracks[i], currentTrack));
  }
}

function hiddenGrid(gridKey = "target") {
  const storageKey = gridKey === "source" ? "sp_source_hidden" : GRID_HIDE_KEY;
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : [];
}

let showHiddenGrid = false;

function hideGrid(name, value, gridKey = "target") {
  const storageKey = gridKey === "source" ? "sp_source_hidden" : GRID_HIDE_KEY;
  const list = hiddenGrid(gridKey);
  const idx = list.indexOf(name);
  if (value && idx === -1) list.push(name);
  if (!value && idx !== -1) list.splice(idx, 1);
  localStorage.setItem(storageKey, JSON.stringify(list));
}

function sameRecording(a, b) {
  if (!a || !b) return false;
  if (a.uri === b.uri) return true;
  if (a.isrc && b.isrc) return a.isrc === b.isrc;
  const norm = s => String(s || "")
    .toLowerCase()
    .replace(/\s*[\(\[\{][^\)\]\}]*[\)\]\}]/g, "")
    .replace(/\s*-\s*(remaster(ed)?|single|album|bonus|radio|extended|original|deluxe|version|mix|edit|live|acoustic|mono|stereo|explicit|clean)\b.*$/i, "")
    .replace(/[^a-z0-9]+/g, "");
  const na = norm(a.name);
  const nb = norm(b.name);
  if (!na || na !== nb) return false;
  const artNorm = s => String(s || "").split(",")[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (artNorm(a.artists) !== artNorm(b.artists)) return false;
  const da = Number(a.durationMs) || 0;
  const db = Number(b.durationMs) || 0;
  return Math.abs(da - db) <= 3000;
}

function markGridHasTrack() {
  const cur = currentTrack && currentTrack.uri;
  if (!cur) return;

  for (const btn of el.grid.children) {
    const entry = cache[btn.dataset.name];
    if (!entry || !entry.tracks) continue;

    if (!(entry._uriSet instanceof Set) || entry._uriSetTimestamp !== entry.tracks.length) {
      entry._uriSet = new Set(entry.tracks.map(t => t.uri));
      entry._uriSetTimestamp = entry.tracks.length;
    }

    const has = entry._uriSet.has(cur);
    btn.classList.toggle("has-track", Boolean(has));
  }
}

function gridOrder(gridKey = "target") {
  const storageKey = gridKey === "source" ? "sp_source_order" : "sp_grid_order";
  const current = gridKey === "source"
    ? [...SOURCE_CANDIDATES]
    : Object.keys(PLAYLISTS).filter(n => !PLAYLISTS[n].extra);
  const raw = localStorage.getItem(storageKey);
  if (!raw) return current;
  try {
    const stored = JSON.parse(raw);
    const inStored = stored.filter(n => current.includes(n));
    const newOnes = current.filter(n => !inStored.includes(n));
    return [...inStored, ...newOnes];
  } catch (_) {
    return current;
  }
}

function moveInGridOrder(name, dir) {
  const order = gridOrder();
  const idx = order.indexOf(name);
  if (idx === -1) return;
  const target = idx + dir;
  if (target < 0 || target >= order.length) return;
  [order[idx], order[target]] = [order[target], order[idx]];
  localStorage.setItem("sp_grid_order", JSON.stringify(order));
  renderGrid();
}

function saveGridOrder(order, gridKey = "target") {
  const storageKey = gridKey === "source" ? "sp_source_order" : "sp_grid_order";
  localStorage.setItem(storageKey, JSON.stringify(order));
}

function onDragMove(ev) {
  if (!movingTile) return;
  const moving = el.grid.querySelector('button[data-name="' + CSS.escape(movingTile) + '"]');
  if (!moving) return;
  const under = document.elementFromPoint(ev.clientX, ev.clientY);
  const target = under && under.closest("#target-grid button");
  if (!target || target === moving) return;
  const rect = target.getBoundingClientRect();
  const isLeftHalf = ev.clientX < rect.left + rect.width / 2;
  if (isLeftHalf) {
    if (target.previousElementSibling === moving) return;
    el.grid.insertBefore(moving, target);
  } else {
    if (target.nextElementSibling === moving) return;
    el.grid.insertBefore(moving, target.nextSibling);
  }
}

function onPointerMove(ev) {
  if (movingTile) { onDragMove(ev); return; }
  if (!dragCandidate) return;
  const dx = ev.clientX - dragStartX;
  const dy = ev.clientY - dragStartY;
  if (Math.hypot(dx, dy) < 10) return;
  movingTile = dragCandidate;
  dragCandidate = null;
  const moving = el.grid.querySelector('button[data-name="' + CSS.escape(movingTile) + '"]');
  if (moving) moving.classList.add("moving");
  el.grid.classList.add("has-moving");
  onDragMove(ev);
}

function onPointerUp() {
  document.body.removeEventListener("pointermove", onPointerMove);
  document.body.removeEventListener("pointerup", onPointerUp);
  document.body.removeEventListener("pointercancel", onPointerUp);
  if (movingTile) {
    const moving = el.grid.querySelector('button[data-name="' + CSS.escape(movingTile) + '"]');
    if (moving) moving.classList.remove("moving");
    el.grid.classList.remove("has-moving");
    const visible = [...el.grid.querySelectorAll("button[data-name]")].map(b => b.dataset.name);
    const previous = gridOrder();
    const hiddenOnes = previous.filter(n => !visible.includes(n));
    saveGridOrder([...visible, ...hiddenOnes]);
    justFinishedDrag = true;
    setTimeout(() => { justFinishedDrag = false; }, 150);
  }
  movingTile = null;
  dragCandidate = null;
  dragPointerId = null;
}

function renderGrid(gridKey = "target") {
  const isSource = gridKey === "source";
  const gridEl = isSource ? document.getElementById("source-grid") : el.grid;
  if (!gridEl) return;
  gridEl.innerHTML = "";
  const hidden = hiddenGrid(gridKey);
  const cur = currentTrack && currentTrack.uri;
  const orderedNames = isSource
    ? [...new Set([...gridOrder("source"), ...SOURCE_CANDIDATES])]
    : gridOrder("target");

  for (const name of orderedNames) {
    const entry = PLAYLISTS[name] || cache[name];
    if (!entry) continue;
    if (!isSource && (!PLAYLISTS[name] || entry.extra)) continue;
    const isHidden = hidden.includes(name);
    if (isHidden && !showHiddenGrid) continue;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.name = name;
    btn.className = isSource
      ? "source-tile" + (name === sourceName() ? " active" : "")
      : "";
    btn.style.position = "relative";
    if (isHidden) btn.classList.add("hidden-tile");

    const img = document.createElement("img");
    img.alt = "";
    bindImg(img, entry.image || (cache[name] && cache[name].image));
    const label = document.createElement("span");
    label.textContent = entry.label || name;
    btn.append(img, label);

    if (isSource && entry.local) {
      const badge = document.createElement("span");
      badge.className = "local-badge";
      badge.textContent = "local";
      badge.style.cssText = "position:absolute;bottom:26px;left:6px;z-index:2;font-size:9px;background:var(--scndry1);color:var(--bg);padding:1px 5px;border-radius:4px;letter-spacing:0.04em;";
      btn.appendChild(badge);
    }

    if (!isSource) {
      const cachedEntry = cache[name];
      const isWixSynced = cachedEntry && cachedEntry.tracks && cachedEntry.tracks.length > 0 && !cachedEntry.partial;
      if (isWixSynced && !entry.local) {
        const syncedBadge = document.createElement("span");
        syncedBadge.className = "local-badge";
        syncedBadge.textContent = "synced";
        syncedBadge.style.cssText = "position:absolute;bottom:26px;left:6px;z-index:2;font-size:9px;background:rgba(10,13,18,0.85);color:var(--muted);padding:1px 5px;border-radius:4px;letter-spacing:0.04em;";
        btn.appendChild(syncedBadge);
      }
    }

    if (reorderMode) {
      if (isSource && !entry.local) {
        const minus = document.createElement("span");
        minus.className = "grid-minus";
        minus.setAttribute("role", "button");
        minus.textContent = isHidden ? "+" : "-";
        minus.title = isHidden ? "Show playlist" : "Hide playlist";
        minus.addEventListener("click", ev => {
          ev.stopPropagation();
          hideGrid(name, !isHidden, "source");
          renderGrid("source");
        });
        btn.appendChild(minus);
      }

      if (isSource && entry.local) {
        const minus = document.createElement("span");
        minus.className = "grid-minus";
        minus.setAttribute("role", "button");
        minus.textContent = "-";
        minus.title = "Delete local playlist";
        minus.style.cssText = "position:absolute;top:6px;left:6px;z-index:2;background:rgba(10,13,18,0.8);border:none;width:22px;height:22px;border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--text);font-weight:bold;cursor:pointer;";
        minus.addEventListener("click", async ev => {
          ev.stopPropagation();
          showAppDialog({
            type: "delete",
            isQuestion: true,
            title: "Delete Local Playlist",
            text: "Are you sure you want to delete local playlist " + name + "?",
            onConfirm: async () => {
              try {
                const token = !OFFLINE ? await getToken() : "";
                await fetch(LOCAL_PLAYLISTS_DELETE_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ accessToken: token, playlistId: entry.id })
                });
              } catch (err) {
                console.warn("[local] delete failed from Wix", err.message);
              }
              delete PLAYLISTS[name];
              delete cache[name];
              const idx = SOURCE_CANDIDATES.indexOf(name);
              if (idx !== -1) SOURCE_CANDIDATES.splice(idx, 1);
              writeCache();
              if (sourceName() === name && SOURCE_CANDIDATES.length) {
                selectSource(SOURCE_CANDIDATES[0]);
              }
              renderGrid("target");
              renderGrid("source");
              renderTracks();
              setFeedback("deleted local playlist " + name, false);
            }
          });
        });
        btn.appendChild(minus);
      }

      if (!isSource) {
        const badge = document.createElement("span");
        badge.className = "grid-minus";
        badge.setAttribute("role", "button");
        badge.textContent = isHidden ? "+" : "-";
        badge.title = isHidden ? "Show playlist" : "Hide playlist";
        badge.addEventListener("click", async ev => {
          ev.stopPropagation();
          hideGrid(name, !isHidden, "target");
          renderGrid("target");
        });

        const sync = document.createElement("span");
        sync.className = "grid-sync";
        sync.setAttribute("role", "button");
        sync.innerHTML = '<i class="fa-solid fa-rotate"></i>';
        sync.title = "Sync this playlist";
        sync.addEventListener("click", async ev => {
          ev.stopPropagation();
          if (sync.classList.contains("busy")) return;

          showAppDialog({
            type: "change",
            isQuestion: true,
            title: "Sync Playlist",
            text: "Do you want to sync " + name + " with Spotify now?",
            onConfirm: async () => {
              sync.classList.add("busy");
              try {
                const token = await getToken();
                const changed = await syncPlaylist(name, token);
                if (changed) {
                  try { await commitPlaylist(name, token); } catch (_) {}
                  setFeedback("synced " + name, false);
                } else {
                  setFeedback("synced " + name + " (unchanged)", false);
                }
                renderGrid("target");
                renderTracks();
              } catch (err) {
                setFeedback(err.message, true);
              } finally {
                sync.classList.remove("busy");
              }
            }
          });
        });

        if (entry.local) {
          sync.style.right = "58px";
          const delBtn = document.createElement("span");
          delBtn.className = "grid-sync";
          delBtn.setAttribute("role", "button");
          delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
          delBtn.title = "Delete local playlist";
          delBtn.style.right = "32px";
          delBtn.addEventListener("click", async ev => {
            ev.stopPropagation();
            showAppDialog({
              type: "delete",
              isQuestion: true,
              title: "Delete Local Playlist",
              text: "Are you sure you want to delete local playlist " + name + "?",
              onConfirm: async () => {
                try {
                  const token = !OFFLINE ? await getToken() : "";
                  await fetch(LOCAL_PLAYLISTS_DELETE_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accessToken: token, playlistId: entry.id })
                  });
                } catch (_) {}
                delete PLAYLISTS[name];
                delete cache[name];
                const idx = SOURCE_CANDIDATES.indexOf(name);
                if (idx !== -1) SOURCE_CANDIDATES.splice(idx, 1);
                writeCache();
                if (sourceName() === name && SOURCE_CANDIDATES.length) {
                  selectSource(SOURCE_CANDIDATES[0]);
                }
                renderGrid("target");
                renderGrid("source");
                renderTracks();
                setFeedback("deleted local playlist " + name, false);
              }
            });
          });
          btn.append(badge, delBtn, sync);
        } else {
          btn.append(badge, sync);
        }
      }

      btn.classList.add("reordering");

      btn.addEventListener("pointerdown", ev => {
        if (ev.button !== 0 || ev.target.closest(".grid-minus, .grid-sync, .grid-edit")) return;
        ev.preventDefault();
        const startX = ev.clientX;
        const startY = ev.clientY;
        let dragging = false;

        const onMove = moveEv => {
          moveEv.preventDefault();
          if (!dragging) {
            if (Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY) < 6) return;
            dragging = true;
            btn.classList.add("moving");
            gridEl.classList.add("has-moving");
            const sel = window.getSelection();
            if (sel) sel.removeAllRanges();
          }

          const buttons = [...gridEl.querySelectorAll("button[data-name]")];
          const target = buttons.find(b => {
            if (b === btn) return false;
            const r = b.getBoundingClientRect();
            return moveEv.clientX >= r.left && moveEv.clientX <= r.right &&
                   moveEv.clientY >= r.top && moveEv.clientY <= r.bottom;
          });

          if (!target) return;

          const order = buttons.map(b => b.dataset.name);
          const fromIdx = order.indexOf(name);
          const toIdx = order.indexOf(target.dataset.name);

          if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
            order.splice(fromIdx, 1);
            order.splice(toIdx, 0, name);

            const map = new Map(buttons.map(b => [b.dataset.name, b]));
            order.forEach(n => {
              const node = map.get(n);
              if (node) gridEl.appendChild(node);
            });
          }
        };

        const onUp = () => {
          document.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerup", onUp);
          document.removeEventListener("pointercancel", onUp);
          if (!dragging) return;
          btn.classList.remove("moving");
          gridEl.classList.remove("has-moving");
          btn.dataset.justDragged = "1";
          setTimeout(() => { delete btn.dataset.justDragged; }, 150);

          const visible = [...gridEl.querySelectorAll("button[data-name]")].map(b => b.dataset.name);
          const previous = gridOrder(gridKey);
          const hiddenOnes = previous.filter(n => !visible.includes(n));
          saveGridOrder([...visible, ...hiddenOnes], gridKey);
        };

        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
        document.addEventListener("pointercancel", onUp);
      });
    }

    if (isSource) {
      btn.title = "Click to load · double-click to play";
      btn.addEventListener("click", () => {
        if (reorderMode || btn.dataset.justDragged) return;
        selectSource(name);
      });
      btn.addEventListener("dblclick", () => {
        if (reorderMode || btn.dataset.justDragged) return;
        selectSource(name, true);
      });
    } else {
      const has = cur && cache[name] && cache[name].tracks && cache[name].tracks.some(t => sameRecording(t, currentTrack));
      if (has) btn.classList.add("has-track");
      btn.addEventListener("click", () => {
        if (reorderMode || btn.dataset.justDragged) return;
        onAdd(name, btn);
      });
    }

    gridEl.appendChild(btn);
  }

  gridEl.classList.toggle("has-moving", Boolean(movingTile));
  if (!isSource) paintTargetBar();
}

async function removeTrack(track, name, token) {
  const id = PLAYLISTS[name] && PLAYLISTS[name].id;
  if (!id) throw new Error("ERROR no playlist id");
  const entry = cache[name];
  const stored = entry && entry.tracks ? entry.tracks.find(t => sameRecording(t, track)) : null;
  const uri = stored ? stored.uri : track.uri;

  if (apiHoldUntil() > Date.now()) {
    await queuePending({ playlistId: id, trackUri: uri, action: "remove", track }, token);
    applyPendingLocally(name, track, "remove");
    return;
  }

  const res = await fetch("https://api.spotify.com/v1/playlists/" + id + "/items", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ items: [{ uri }] })
  });

  if (res.status === 429) {
    const ra = Number(res.headers.get("Retry-After"));
    if (Number.isFinite(ra) && ra > 0) apiHoldSet(ra);
    await queuePending({ playlistId: id, trackUri: uri, action: "remove", track }, token);
    applyPendingLocally(name, track, "remove");
    return;
  }

  if (!res.ok && res.status !== 200 && res.status !== 404) {
    throw new Error("ERROR remove " + name + " " + res.status);
  }

  if (entry && entry.tracks) {
    entry.tracks = entry.tracks.filter(t => !sameRecording(t, track));
    entry.loadedAt = Date.now();
    writeCache();
  }
  pushOp({ playlistId: id, trackUri: uri, action: "remove" }).catch(err => setFeedback(err.message, true));
}

function hierarchyMap() {
  const raw = localStorage.getItem(HIERARCHY_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch (_) { return {}; }
}

async function syncHierarchyPull(token) {
  const res = await fetch(HIERARCHY_URL + "?accessToken=" + encodeURIComponent(token));
  if (!res.ok) throw new Error("ERROR hierarchy pull " + res.status);
  const data = await res.json();
  if (data.error) throw new Error("ERROR hierarchy pull " + data.error);
  if (!data.data) return;
  let parsed;
  try { parsed = JSON.parse(data.data); } catch (_) { return; }
  if (parsed.map && typeof parsed.map === "object") {
    localStorage.setItem(HIERARCHY_KEY, JSON.stringify(parsed.map));
  }
  if (typeof parsed.on === "boolean") {
    localStorage.setItem(HIERARCHY_ON_KEY, parsed.on ? "1" : "0");
  }
}

async function syncHierarchyPush(token) {
  const payload = JSON.stringify({ map: hierarchyMap(), on: hierarchyOn() });
  const res = await fetch(HIERARCHY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken: token, data: payload })
  });
  if (!res.ok) throw new Error("ERROR hierarchy push " + res.status);
  const data = await res.json();
  if (data.error) throw new Error("ERROR hierarchy push " + data.error);
}

function setHierarchyMap(map) {
  localStorage.setItem(HIERARCHY_KEY, JSON.stringify(map));
  getToken()
    .then(token => syncHierarchyPush(token))
    .catch(err => setFeedback(err.message, true));
}

function hierarchyOn() {
  return localStorage.getItem(HIERARCHY_ON_KEY) === "1";
}

function setHierarchyOn(v) {
  localStorage.setItem(HIERARCHY_ON_KEY, v ? "1" : "0");
  getToken()
    .then(token => syncHierarchyPush(token))
    .catch(err => setFeedback(err.message, true));
}

function resolveHierarchy(name) {
  const map = hierarchyMap();
  const out = new Set();
  const stack = [name];
  while (stack.length) {
    const node = stack.pop();
    for (const next of (map[node] || [])) {
      if (next === name || out.has(next)) continue;
      out.add(next);
      stack.push(next);
    }
  }
  return [...out];
}


async function onAdd(name, btn) {
  if (!currentTrack) {
    setFeedback("ERROR no current track", true);
    return;
  }

  const track = currentTrack;
  const cascading = hierarchyOn();
  const targets = cascading ? [name, ...resolveHierarchy(name)] : [name];
  const entry = cache[name];
  const already = entry && entry.tracks && entry.tracks.some(t => sameRecording(t, track));
  let resumeAfter = false;
  let playback = null;

  btn.classList.add("pending");

  try {
    const token = await getToken();

    if (cascading && !already) {
      playback = await fetchPlaybackState(token);

      if (playback && !playback.paused) {
        const pauseRes = await fetch(
          "https://api.spotify.com/v1/me/player/pause?device_id=" + encodeURIComponent(playback.device.id),
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        resumeAfter = pauseRes.ok || pauseRes.status === 204;
      }
    }

    btn.classList.remove("pending");

    if (already) {
      await removeTrack(track, name, token);
      setFeedback("removed from " + name, false);
      renderTracks();
      highlightTracks();
    } else {
      let totalAdded = 0;
      const errors = [];

      for (const target of targets) {
        try {
          totalAdded += await addTrack(track, target, token);
        } catch (err) {
          errors.push(target + ": " + err.message);
        }
      }

      if (errors.length) {
        setFeedback("partial " + errors.join(" · "), true);
      } else if (targets.length === 1) {
        setFeedback(totalAdded ? "added to " + name : "already in " + name, false);
      } else {
        setFeedback("added to " + totalAdded + " of " + targets.length + " playlists", false);
      }

      if (totalAdded && apiHoldUntil() <= Date.now()) {
        try {
          await saveToLibrary(track, token);
        } catch (_) {}
      }

      btn.classList.add("ok");
      setTimeout(() => btn.classList.remove("ok"), 1200);
    }

    renderGrid();
  } catch (err) {
    btn.classList.remove("pending");
    btn.classList.add("err");
    setFeedback(err.message, true);
  } finally {
    if (resumeAfter && playback) {
      try {
        await fetch(
          "https://api.spotify.com/v1/me/player/play?device_id=" + encodeURIComponent(playback.device.id),
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${await getToken()}` }
          }
        );
      } catch (_) {}
    }
  }
}


function updatePlayerBar(track) {
  if (!track) return;
  el.title.textContent = track.name;
  el.artists.textContent = track.artists || "";
  bindImg(el.art, track.image);
  el.time.textContent = "0:00 / " + formatMs(track.durationMs);
  paintVersionsButton();
  resetPresets();
}
function handleEnd() {
  const uri = currentPlayingUri();
  if (!uri || endHandledFor === uri) return;
  endHandledFor = uri;
  
  if (repeatMode === "all") {
    playAdjacent(1, false);
  } else {
    playAdjacent(1, hideOnSkip);
  }
}

async function onPlayerState(state) {
  const prev = lastState;
  lastState = state;
  if (!state) return;
  const sdkTrack = state.track_window.current_track;
  if (pendingTrackUri) {
    if (sdkTrack && sdkTrack.uri === pendingTrackUri) {
      pendingTrackUri = null;
      pendingTrackUriAt = 0;
    } else if (Date.now() - pendingTrackUriAt > 3000) {
      if (sdkTrack) sdkStaleUri = sdkTrack.uri;
      pendingTrackUri = null;
      pendingTrackUriAt = 0;
      const toggleIcon = document.querySelector("#player-view .np-toggle i");
      if (toggleIcon) toggleIcon.className = state.paused ? "fa-solid fa-play" : "fa-solid fa-pause";
      return;
    } else {
      return;
    }
  }
  if (sdkStaleUri) {
    if (sdkTrack && sdkTrack.uri === sdkStaleUri) {
      const toggleIcon = document.querySelector("#player-view .np-toggle i");
      if (toggleIcon) toggleIcon.className = state.paused ? "fa-solid fa-play" : "fa-solid fa-pause";
      return;
    }
    sdkStaleUri = null;
  }
  const prevUri = prev && prev.track_window && prev.track_window.current_track
    ? prev.track_window.current_track.uri
    : null;
  if (sdkTrack && sdkTrack.uri !== prevUri) {
    previewAbort = true;
    previewRunning = false;
    closeVersionsPanel();
    resetPresets();
    endHandledFor = null;
    if (previewMode) {
      const targetUri = sdkTrack.uri;
      setTimeout(() => {
        if (!previewMode || previewRunning) return;
        if (!currentTrack || currentTrack.uri !== targetUri) return;
        previewAbort = false;
        runPreviewForCurrent();
      }, 700);
    }
  }
  if (sdkTrack) {
    const cachedHit = findCachedTrack(sdkTrack.uri);
    const sdkRef = {
      uri: sdkTrack.uri,
      name: sdkTrack.name,
      artists: (sdkTrack.artists || []).map(a => a.name).join(", "),
      durationMs: sdkTrack.duration_ms,
      isrc: cachedHit && cachedHit.isrc ? cachedHit.isrc : null
    };
    if (!currentTrack || !sameRecording(currentTrack, sdkRef)) {
      const src = sourceName();
      const srcCache = cache[src];
      const srcMatch = srcCache && srcCache.tracks && srcCache.tracks.find(t => sameRecording(t, sdkRef) || t.uri === sdkTrack.uri);
      if (srcMatch) {
        currentTrack = srcMatch;
      } else if (!currentTrack) {
        currentTrack = { ...sdkRef, image: sdkTrack.album && sdkTrack.album.images && sdkTrack.album.images.length ? sdkTrack.album.images[0].url : null };
      }
    }
    el.title.textContent = currentTrack.name;
    el.artists.textContent = currentTrack.artists;
    bindImg(el.art, currentTrack.image);
    applyAdaptiveColor(currentTrack);
    highlightTracks();
    markGridHasTrack();
    if (pendingSeek && currentTrack) {
      const part = pendingSeek;
      pendingSeek = null;
      seekPreview(currentTrack.durationMs, part).catch(err => setFeedback(err.message, true));
    }
  }
  const toggleIcon = document.querySelector("#player-view .np-toggle i");
  if (toggleIcon) toggleIcon.className = state.paused ? "fa-solid fa-play" : "fa-solid fa-pause";
  highlightTracks();
  startProgress(state);
  markGridHasTrack();
  paintVersionsButton();
  refreshNpPanel();
}

function versionsOf(track) {
  if (!track) return [];
  const out = [];
  const seen = new Set();
  const order = [sourceName(), ...Object.keys(cache).filter(n => n !== sourceName())];
  
  for (const name of order) {
    const list = (cache[name] && cache[name].tracks) || [];
    for (const t of list) {
      if (t.uri !== track.uri && (!track.isrc || t.isrc !== track.isrc) && !sameRecording(t, track)) continue;
      if (seen.has(t.uri)) continue;
      seen.add(t.uri);
      out.push({ ...t, sourcePlaylist: name });
    }
  }
  return out;
}

function paintVersionsButton() {
  const btn = document.getElementById("np-versions-btn");
  if (!btn) return;
  const versions = versionsOf(currentTrack);
  if (versions.length < 2) {
    btn.style.display = "none";
    return;
  }
  btn.style.display = "inline-flex";
  const count = btn.querySelector("span");
  if (count) count.textContent = String(versions.length);
  btn.title = versions.length + " versions available";
}

function closeVersionsPanel() {
  const p = document.getElementById("versions-panel");
  if (p) p.remove();
}

function openVersionsPanel() {
  const existing = document.getElementById("versions-panel");
  if (existing) { existing.remove(); return; }
  const versions = versionsOf(currentTrack);
  if (versions.length < 2) return;
  const center = document.querySelector("#player-view .np-center");
  if (!center) return;
  const panel = document.createElement("div");
  panel.id = "versions-panel";
  panel.className = "versions-panel";
  for (const v of versions) {
    const row = document.createElement("div");
    row.className = "version-row" + (v.uri === currentTrack.uri ? " active" : "");
    row.setAttribute("role", "button");
    const img = document.createElement("img");
    img.alt = "";
    bindImg(img, v.image);
    const meta = document.createElement("div");
    const name = document.createElement("p");
    name.className = "version-name";
    name.textContent = v.name;
    const sub = document.createElement("p");
    sub.className = "version-sub";
    sub.textContent = v.artists + " · " + formatMs(v.durationMs) + " · " + v.sourcePlaylist;
    meta.append(name, sub);
    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "version-play";
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    playBtn.title = "Play this version";
    playBtn.addEventListener("click", async ev => {
      ev.stopPropagation();
      currentTrack = v;
      updatePlayerBar(v);
      highlightTracks();
      markGridHasTrack();
      paintVersionsButton();
      closeVersionsPanel();
      setStatus("Playing " + v.sourcePlaylist);
      try {
        await playFromGesture(v, await getToken());
        highlightTracks();
      } catch (err) {
        setFeedback(err.message, true);
      }
    });
    row.append(img, meta, playBtn);
    row.addEventListener("click", ev => {
      changedPlayingNow()
      if (ev.target.closest(".version-play")) return;
      currentTrack = v;
      updatePlayerBar(v);
      highlightTracks();
      markGridHasTrack();
      paintVersionsButton();
      closeVersionsPanel();
      setFeedback("using version from " + v.sourcePlaylist + " (press play to hear it)", false);
    });
    panel.appendChild(row);
  }
  const close = document.createElement("button");
  close.type = "button";
  close.className = "versions-close";
  close.textContent = "Close";
  close.addEventListener("click", () => closeVersionsPanel());
  panel.appendChild(close);
  center.appendChild(panel);
}

function recentList() {
  const raw = localStorage.getItem("sp_recent");
  if (!raw) return [];
  try { return JSON.parse(raw); } catch (_) { return []; }
}

function pushRecent(track) {
  if (!track || !track.uri) return;
  const list = recentList().filter(t => t.uri !== track.uri);
  list.unshift({
    uri: track.uri,
    name: track.name,
    artists: track.artists,
    image: track.image,
    durationMs: track.durationMs
  });
  localStorage.setItem("sp_recent", JSON.stringify(list.slice(0, 8)));
  paintRecentGrid();
}

function paintRecentGrid() {
  const target = recentPanel || (npPanel && npView === "recent" ? npPanel : null);
  if (!target) return;
  target.innerHTML = "";
  
  const header = document.createElement("div");
  header.className = "np-grid-header";
  const qBtn = document.createElement("button");
  qBtn.type = "button";
  qBtn.textContent = "Queue";
  qBtn.addEventListener("click", () => { npView = "queue"; paintNpGrid(); });
  const rBtn = document.createElement("button");
  rBtn.type = "button";
  rBtn.textContent = "Recent";
  rBtn.classList.add("active");
  rBtn.addEventListener("click", () => { npView = "recent"; paintRecentGrid(); });
  header.append(qBtn, rBtn);
  target.appendChild(header);

  const list = document.createElement("div");
  list.className = "np-grid-list";
  target.appendChild(list);

  const curUri = currentPlayingUri();
  const rawItems = recentList();
  const items = rawItems.filter(t => {
    if (!t) return false;
    if (curUri && t.uri === curUri) return false;
    if (currentTrack && sameRecording(t, currentTrack)) return false;
    return true;
  });

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "recent-empty";
    empty.textContent = "No recent songs";
    list.appendChild(empty);
    return;
  }
  
  for (let i = 0; i < items.length; i++) {
    const t = items[i];
    const card = document.createElement("div");
    card.dataset.uri = t.uri;
    card.className = "track";
    
    const img = document.createElement("img");
    img.alt = "";
    bindImg(img, t.image);
    
    const meta = document.createElement("div");
    meta.innerHTML = `<p class="track-name"></p><p class="track-artists"></p>`;
    meta.querySelector(".track-name").textContent = t.name;
    meta.querySelector(".track-artists").textContent = t.artists;

    if (i === 0 && npView === "recent") {
      const badge = document.createElement("span");
      badge.className = "np-next-badge";
      badge.textContent = "previous";
      card.appendChild(badge);
    }

    const actionBtn = document.createElement("span");
    actionBtn.className = "np-tile-btn";
    actionBtn.setAttribute("role", "button");
    actionBtn.textContent = "+";
    actionBtn.title = "Add to queue";
    actionBtn.addEventListener("click", ev => {
      ev.stopPropagation();
      enqueueNext(t);
    });

    card.append(img, meta, actionBtn);
    card.addEventListener("click", async () => {
      try {
        const token = !OFFLINE ? await getToken() : "";
        currentTrack = t;
        await playFromGesture(t, token);
        updatePlayerBar(t);
        highlightTracks();
        markGridHasTrack();
        paintVersionsButton();
        paintRecentGrid();
      } catch (err) {
        setFeedback(err.message, true);
      }
    });
    list.appendChild(card);
  }
}

function refreshNpPanel() {
  if (!npPanel) return;
  if (npView === "queue" || npView === "recent") paintNpGrid();
}

function toggleRecentPanel() {
  const btn = document.getElementById("np-recent-btn");
  if (recentPanel) {
    recentPanel.remove();
    recentPanel = null;
    if (btn) btn.classList.remove("active");
    return;
  }
  const view = document.getElementById("player-view");
  if (!view) return;
  recentPanel = document.createElement("div");
  recentPanel.id = "recently-grid";
  view.appendChild(recentPanel);
  paintRecentGrid();
  if (btn) btn.classList.add("active");
}

function findCachedTrack(uri) {
  for (const name of Object.keys(cache)) {
    const hit = cache[name].tracks.find(t => t.uri === uri);
    if (hit) return hit;
  }
  return currentTrack && currentTrack.uri === uri ? currentTrack : null;
}

let isHandlingEnd = false;

function startProgress(state) {
  clearInterval(progressTimer);
  const duration = currentTrack ? currentTrack.durationMs : state.duration;
  const paint = () => {
    if (!lastState) return;
    const pos = lastState.paused
      ? lastState.position
      : lastState.position + (Date.now() - lastState.timestamp);
    const dur = duration || lastState.duration || 1;
    const clamped = Math.min(dur, Math.max(0, pos));
    el.progress.style.width = (clamped / dur * 100) + "%";
    el.time.textContent = formatMs(clamped) + " / " + formatMs(dur);
    paintPresetsFromPosition(clamped, dur);

    if (!lastState.paused && dur > 1000 && clamped >= dur - 300) {
      if (!isHandlingEnd && currentPlayingUri() && endHandledFor !== currentPlayingUri()) {
        isHandlingEnd = true;
        handleEnd();
        setTimeout(() => { isHandlingEnd = false; }, 2000);
      }
    }
  };
  paint();
  if (!state.paused) progressTimer = setInterval(paint, 250);
}

function showApp() {
  el.auth.classList.add("hidden");
  el.main.classList.remove("hidden");
  el.bar.classList.remove("hidden");
  document.body.classList.remove("auth-mode");
}

function showAuth(message) {
  el.auth.classList.remove("hidden");
  document.body.classList.add("auth-mode");
  el.main.classList.add("hidden");
  el.bar.classList.add("hidden");
  el.redirect.textContent = redirectUri();
  if (!el.clientId.value) el.clientId.value = getClientId();
  setStatus(message || "Log in with your Client ID");
}

async function startSession(token) {
  const me = await ensureIdentity(token);
  el.auth.classList.add("hidden");
  document.body.classList.remove("auth-mode");
  showApp();
  setStatus("Connecting player…");
  if (!player) await initPlayer(onPlayerState);
  setStatus("Discovering playlists…");
  for (const key of Object.keys(PLAYLISTS)) delete PLAYLISTS[key];
  SOURCE_CANDIDATES.length = 0;
  const found = await ensurePlaylists(token);
  for (const p of found) {
    PLAYLISTS[p.label] = { id: p.id, label: p.label, image: p.image };
    if (cache[p.label]) cache[p.label].id = p.id;
  }

  try {
    const res = await fetch(LOCAL_PLAYLISTS_URL + "?accessToken=" + encodeURIComponent(token));
    if (res.ok) {
      const data = await res.json();
      if (!data.error && data.items) {
        for (const item of data.items) {
          const label = item.label;
          PLAYLISTS[label] = { id: item.playlistId, label, image: item.image, local: true };
          if (!SOURCE_CANDIDATES.includes(label)) SOURCE_CANDIDATES.push(label);
          cache[label] = {
            id: item.playlistId,
            label,
            image: item.image,
            loadedAt: item.loadedAt,
            total: item.tracks.length,
            tracks: item.tracks,
            local: true
          };
        }
        writeCache();
      }
    }
  } catch (err) {
    setFeedback(err.message, true);
  }

  const validNames = new Set(Object.keys(PLAYLISTS));
  for (const key of Object.keys(cache)) {
    if (!validNames.has(key) && !cache[key].local) delete cache[key];
  }
  const storedOrder = localStorage.getItem("sp_grid_order");
  if (storedOrder) {
    try {
      const pruned = JSON.parse(storedOrder).filter(n => validNames.has(n));
      localStorage.setItem("sp_grid_order", JSON.stringify(pruned));
    } catch (_) {}
  }
  SOURCE_CANDIDATES.push(...Object.keys(PLAYLISTS).filter(n => !SOURCE_CANDIDATES.includes(n)));
  writeCache();

  try {
    await syncPull(token);
  } catch (err) {
    setFeedback(err.message, true);
  }
  try {
    await syncHierarchyPull(token);
  } catch (err) {
    setFeedback(err.message, true);
  }
  try {
    await syncOps(token);
  } catch (err) {
    setFeedback(err.message, true);
  }
  try {
    await loadPendingFromWix(token);
  } catch (err) {
    setFeedback(err.message, true);
  }
  try {
    const applied = await syncAllPlaylistsFromWix(token);
    if (applied) console.log("[data] boot sync applied", applied, "playlists");
  } catch (err) {
    setFeedback(err.message, true);
  }

  renderGrid();
  renderSourceGrid();
  renderTracks();
  paintVersionsButton();
  
  const sourcesLabel = document.getElementById("sources-label");
  if (sourcesLabel) sourcesLabel.textContent = sourceName();

  const container = document.getElementById("source-container");
  if (container) container.style.display = "block";

  setStatus("");
}

async function usePastedToken(raw) {
  const parsed = parseCredential(raw);
  if (parsed.type === "empty") throw new Error("ERROR no token");
  if (parsed.type === "client_id") {
    await beginLogin(parsed.token);
    return;
  }
  saveToken(parsed.token, parsed.refresh, parsed.expiresIn);
  el.token.value = "";
  await startSession(parsed.token);
}

function parseTrackIds(text) {
  const ids = [];
  for (const line of text.split(/\s+/)) {
    const m = line.match(/(?:track[/:])([0-9A-Za-z]{22})/) || line.match(/^([0-9A-Za-z]{22})$/);
    if (m) ids.push(m[1]);
  }
  return [...new Set(ids)];
}

async function openManualPlaylist(token) {
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(10,13,18,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;";
  const box = document.createElement("div");
  box.style.cssText = "background:var(--surface);padding:20px;border-radius:var(--r-md);width:min(520px,90vw);display:flex;flex-direction:column;gap:12px;border:1px solid var(--line);box-shadow:0 8px 24px rgba(0,0,0,0.5);color:var(--text);";
  const title = document.createElement("p");
  title.textContent = "Paste Spotify track links";
  title.style.cssText = "margin:0;font-weight:600;color:var(--text);font-size:16px;";
  const area = document.createElement("textarea");
  area.rows = 10;
  area.style.cssText = "width:100%;resize:vertical;background:var(--bg);color:var(--text);border:1px solid var(--line);border-radius:var(--r-sm);padding:8px;font-family:monospace;font-size:12px;outline:none;";
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:10px;justify-content:flex-end;";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Cancel";
  cancel.style.cssText = "background:var(--surface-2);color:var(--text);border:1px solid var(--line);padding:8px 16px;border-radius:var(--r-sm);font-size:13px;font-weight:500;cursor:pointer;";
  const create = document.createElement("button");
  create.type = "button";
  create.textContent = "Create";
  create.style.cssText = "background:var(--accent);color:var(--blackG);border:none;padding:8px 16px;border-radius:var(--r-sm);font-size:13px;font-weight:700;cursor:pointer;";
  row.append(cancel, create);
  box.append(title, area, row);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  cancel.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  create.addEventListener("click", async () => {
    const ids = parseTrackIds(area.value);
    if (!ids.length) {
      setFeedback("ERROR no tracks", true);
      return;
    }
    create.disabled = true;
    create.textContent = "…";
    try {
      const name = "Manual " + new Date().toISOString().slice(0, 10);
      const plRes = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name, public: false, description: "Pasted track links" })
      });
      if (!plRes.ok) throw new Error("ERROR create " + plRes.status);
      const pl = await plRes.json();
      const uris = ids.map(id => "spotify:track:" + id);
      for (let i = 0; i < uris.length; i += 100) {
        const addRes = await fetch(`https://api.spotify.com/v1/playlists/${pl.id}/items`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ uris: uris.slice(i, i + 100) })
        });
        if (!addRes.ok) throw new Error("ERROR add " + addRes.status);
      }
      PLAYLISTS[name] = { id: pl.id, label: name, image: null };
      SOURCE_CANDIDATES.push(name);
      await loadPlaylist(name, token);
      try { await syncPlaylistToWix(name, token); } catch (_) { /* best effort */ }
      clearPlaylistsCache();
      localStorage.setItem(SOURCE_KEY, name);
      renderSourceGrid();
      renderTracks();
      overlay.remove();
      setFeedback("created " + name, false);
    } catch (err) {
      create.disabled = false;
      create.textContent = "Create";
      setFeedback(err.message, true);
    }
  });
}

async function seekRelative(deltaMs) {
  if (!player) {
    setFeedback("ERROR no player", true);
    return;
  }
  try {
    const state = await player.getCurrentState();
    if (!state) {
      setFeedback("ERROR no state", true);
      return;
    }
    const max = state.duration || Infinity;
    const target = Math.min(max - 1000, Math.max(0, state.position + deltaMs));
    await player.seek(target);
  } catch (err) {
    setFeedback(err.message, true);
  }
}

async function seekCurrent(part) {
  if (!currentTrack) {
    setFeedback("ERROR no track", true);
    return;
  }
  try {
    await seekPreview(currentTrack.durationMs, part);
  } catch (err) {
    setFeedback(err.message, true);
  }
}

async function syncPull(token) {
  const res = await fetch(SYNC_URL + "?accessToken=" + encodeURIComponent(token));
  if (!res.ok) throw new Error("ERROR sync pull " + res.status);
  const data = await res.json();
  if (data.error) throw new Error("ERROR sync pull " + data.error);
  const items = data.items || [];
  const local = hiddenMap();
  const localCount = Object.values(local).reduce((n, l) => n + l.length, 0);
  if (!items.length && localCount > 0) return local;
  const byId = {};
  for (const [name, entry] of Object.entries(PLAYLISTS)) byId[entry.id] = name;
  const map = {};
  for (const row of items) {
    const name = byId[row.playlistId];
    if (!name) continue;
    if (!map[name]) map[name] = [];
    if (!map[name].includes(row.trackUri)) map[name].push(row.trackUri);
  }
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(map));
  return map;
}

async function syncPush(token, playlistId, trackUri, hidden) {
  const res = await fetch(SYNC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken: token, playlistId, trackUri, hidden })
  });
  if (!res.ok) throw new Error("ERROR sync push " + res.status);
  const data = await res.json();
  if (data.error) throw new Error("ERROR sync push " + data.error);
}

function hiddenMap() {
  const raw = localStorage.getItem(HIDDEN_KEY);
  return raw ? JSON.parse(raw) : {};
}

function lookupTrack(uri) {
  for (const name of Object.keys(cache)) {
    const hit = cache[name].tracks.find(t => t.uri === uri);
    if (hit) return hit;
  }
  return null;
}

function isHidden(name, uri) {
  const map = hiddenMap();
  const list = map[name] || [];
  if (!list.length) return false;
  
  if (!window._hiddenSets) window._hiddenSets = {};
  if (!window._hiddenSets[name] || window._hiddenSets[name]._raw !== list) {
    window._hiddenSets[name] = new Set(list);
    window._hiddenSets[name]._raw = list;
  }
  
  if (window._hiddenSets[name].has(uri)) return true;
  
  const ref = lookupTrack(uri) || (currentTrack && currentTrack.uri === uri ? currentTrack : null);
  if (!ref) return false;
  
  return list.some(u => {
    const t = lookupTrack(u);
    return t ? sameRecording(t, ref) : false;
  });
}

function setHidden(name, uri, value) {
  const map = hiddenMap();
  const list = map[name] || [];
  const idx = list.indexOf(uri);
  if (value && idx === -1) list.push(uri);
  if (!value && idx !== -1) list.splice(idx, 1);
  map[name] = list;
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(map));
  const entry = PLAYLISTS[name];
  if (entry && entry.id) {
    getToken()
      .then(token => syncPush(token, entry.id, uri, value))
      .catch(err => setFeedback(err.message, true));
  }
}

function playableTracks(name) {
  const all = (cache[name] && cache[name].tracks) || [];
  return playAll ? all : all.filter(t => !isHidden(name, t.uri));
}

function resetShuffleQueue(name, exclude) {
  shuffleQueue = playableTracks(name)
    .filter(t => t.uri !== exclude)
    .map(t => t.uri)
    .sort(() => Math.random() - 0.5);
}

async function playNextShuffled(hide) {
  if (manualQueue.length) return playFromManualQueue(hide);
  const name = sourceName();
  const tracks = playableTracks(name);
  if (!tracks.length) return;
  const original = currentTrack;
  if (hide !== false && original && !playAll) {
    setHidden(name, original.uri, true);
    lastAutoHidden = { playlistName: name, track: original };
  }
  const token = await getToken();
  const valid = new Set(tracks.map(t => t.uri));
  shuffleQueue = shuffleQueue.filter(u => valid.has(u));
  const tried = new Set();
  while (tried.size < tracks.length) {
    if (!shuffleQueue.length) resetShuffleQueue(name, original && original.uri);
    if (!shuffleQueue.length) break;
    const uri = shuffleQueue.shift();
    if (tried.has(uri)) continue;
    tried.add(uri);
    const track = tracks.find(t => t.uri === uri);
    if (!track) continue;
    try {
      await playFromGesture(track, token);
      currentTrack = track;
      updatePlayerBar(track);
      renderTracks();
      highlightTracks();
      return;
    } catch (err) {
      if (isUnplayable(err)) continue;
      currentTrack = original;
      updatePlayerBar(original);
      setFeedback(err.message, true);
      renderTracks();
      return;
    }
  }
  currentTrack = original;
  if (hide !== false && original && !playAll) setHidden(name, original.uri, false);
  updatePlayerBar(original);
  renderTracks();
  setFeedback("ERROR no playable track", true);
}

function isUnplayable(err) {
  return /ERROR play (400|403|404)/.test(String(err && err.message || ""));
}

let _lastPlayAdjacentTime = 0;

async function playAdjacent(dir, hide) {
  const now = Date.now();
  if (now - _lastPlayAdjacentTime < 400) return;
  _lastPlayAdjacentTime = now;

  changedPlayingNow();
  if (dir === 1 && manualQueue.length) return playFromManualQueue(hide);
  if (shuffleOn && dir === 1) return playNextShuffled(hide);
  
  const name = sourceName();
  const allTracks = queueTracks(name);
  if (!allTracks.length || !currentTrack) return;
  
  const original = currentTrack;
  if (dir === 1 && hide !== false && !playAll) {
    setHidden(name, original.uri, true);
    lastAutoHidden = { playlistName: name, track: original };
  }

  const map = hiddenMap();
  const hiddenList = map[name] || [];
  const hiddenSet = new Set(hiddenList);
  
  const activeTracks = playAll ? allTracks : allTracks.filter(t => !hiddenSet.has(t.uri));
  if (!activeTracks.length) {
    currentTrack = original;
    updatePlayerBar(original);
    renderTracks();
    setFeedback("ERROR no playable track", true);
    return;
  }

  let idx = activeTracks.findIndex(t => sameRecording(t, original));
  if (idx === -1) idx = 0;
  
  idx = (idx + dir + activeTracks.length) % activeTracks.length;
  const candidate = activeTracks[idx];

  const token = await getToken();
  try {
    await playFromGesture(candidate, token);
    currentTrack = candidate;
    updatePlayerBar(candidate);
    renderTracks();
    highlightTracks();
    if (previewMode) {
      previewAbort = true;
      const scheduledUri = candidate.uri;
      setTimeout(() => {
        if (!previewMode) return;
        if (!currentTrack || currentTrack.uri !== scheduledUri) return;
        previewAbort = false;
        runPreviewForCurrent();
      }, 300);
    }
  } catch (err) {
    currentTrack = original;
    if (dir === 1 && hide !== false && !playAll) setHidden(name, original.uri, false);
    updatePlayerBar(original);
    renderTracks();
    highlightTracks();
    setFeedback(err.message, true);
  }
}

function activePresetAt(ms, durationMs) {
  if (!durationMs || durationMs <= 0) return "A";
  const p = ms / durationMs;
  if (p >= 0.80) return "E";
  if (p >= 0.65) return "D";
  if (p >= 0.50) return "C";
  if (p >= 0.35) return "B";
  return "A";
}

function paintPresetsFromPosition(ms, durationMs) {
  if (!presetTracking) return;
  const active = activePresetAt(ms, durationMs);
  if (active === lastPaintedPreset) return;
  lastPaintedPreset = active;
  document.querySelectorAll("#player-view .np-preset").forEach(b => {
    b.classList.toggle("active", b.dataset.preset === active);
  });
}

function resetPresets() {
  presetTracking = false;
  lastPaintedPreset = null;
  document.querySelectorAll("#player-view .np-preset").forEach(b => b.classList.remove("active"));
}

function paintRepeatButton() {
  const btn = document.getElementById("np-repeat-btn");
  if (!btn) return;
  btn.classList.toggle("active", repeatMode === "all");
  btn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
  btn.title = repeatMode === "all" ? "Repeat all" : "Repeat off";
}

function cycleRepeat() {
  repeatMode = repeatMode === "all" ? "off" : "all";
  localStorage.setItem("sp_repeat", repeatMode);
  paintRepeatButton();
  setFeedback("repeat " + repeatMode, false);
}

function stopPreviewMode() {
  previewMode = false;
  previewAbort = true;

  const btn = document.getElementById("np-preview-btn");
  if (btn) btn.classList.remove("active");

  const settings = document.getElementById("preview-settings");
  if (settings) settings.remove();

  resetPresets();
}

function changedPlayingNow() {
  if (previewRunning) return;
  if (!previewMode) return;
  stopPreviewMode();
}

function togglePreviewMode() {
  if (previewMode) {
    stopPreviewMode();
    setFeedback("preview off", false);
    return;
  }

  previewMode = true;
  const btn = document.getElementById("np-preview-btn");
  if (btn) btn.classList.add("active");

  const settings = document.getElementById("preview-settings");
  if (settings) settings.remove();

  setFeedback("preview on · " + previewSeconds + "s · " + previewPresets, false);
  runPreviewForCurrent();
}


async function previewAdvance() {
  const name = sourceName();
  const tracks = queueTracks(name);
  if (!tracks.length && !manualQueue.length) return false;
  if (!currentTrack) return false;
  let idx = tracks.findIndex(t => sameRecording(t, currentTrack));
  if (idx === -1) idx = 0;
  if (hideOnSkip && !playAll) {
    setHidden(name, currentTrack.uri, true);
    lastAutoHidden = { playlistName: name, track: currentTrack };
  }
  const candidate = manualQueue.length ? manualQueue.shift() : tracks[(idx + 1) % tracks.length];
  if (!candidate) return false;
  try {
    const token = await getToken();
    previewRunning = false;
    previewAbort = false;
    currentTrack = candidate;
    updatePlayerBar(candidate);
    await playFromGesture(candidate, token);
    renderTracks();
    highlightTracks();
    const scheduledUri = candidate.uri;
    setTimeout(() => {
      if (!previewMode || previewRunning) return;
      if (!currentTrack || currentTrack.uri !== scheduledUri) return;
      runPreviewForCurrent();
    }, 600);
    return true;
  } catch (err) {
    setFeedback(err.message, true);
    return false;
  }
}

async function previewWait(ms) {
  const start = await player.getCurrentState();
  if (!start) return false;
  const targetPos = start.position + ms;
  const dur = start.duration || Infinity;
  while (true) {
    if (previewAbort || !previewMode) return false;
    try {
      const s = await player.getCurrentState();
      if (!s) return false;
      if (s.track_window.current_track && currentTrack && s.track_window.current_track.uri !== currentTrack.uri) return false;
      if (!s.paused && s.position >= targetPos) return true;
      if (!s.paused && s.position >= dur - 200) return false;
    } catch (_) {
      return false;
    }
    await new Promise(r => setTimeout(r, 250));
  }
}

async function previewWaitUntil(targetMs, durationMs) {
  let lastLog = 0;
  while (true) {
    if (previewAbort || !previewMode) {
      return false;
    }
    try {
      const s = await player.getCurrentState();
      if (!s) {
        await new Promise(r => setTimeout(r, 250));
        continue;
      }
      if (!s.paused) {
        if (s.position >= targetMs) {
          return true;
        }
        if (durationMs > 10000 && s.position >= durationMs - 500) {
          return false;
        }
      }
      const now = Date.now();
      if (now - lastLog > 2000) {
        lastLog = now;
      }
    } catch (err) {
      console.log("[preview] wait error", err.message);
    }
    await new Promise(r => setTimeout(r, 250));
  }
}

async function runPreviewForCurrent() {
  if (!player || !currentTrack || previewRunning || !previewMode) return;
  previewRunning = true;
  previewAbort = false;
  presetTracking = true;
  lastPaintedPreset = null;
  const startedUri = currentTrack.uri;
  const durationMs = currentTrack.durationMs;
  const parts = previewPresets.split("").filter(p => "ABCDE".includes(p));
  if (!parts.length) parts.push("A", "B", "C", "D", "E");

  try {
    for (const part of parts) {
      if (previewAbort || !previewMode || !currentTrack || currentTrack.uri !== startedUri) break;
      const seekTo = previewPosition(durationMs, part);
      const cur = await player.getCurrentState();
      if (!(cur && Math.abs(cur.position - seekTo) < 1000)) {
        await seekPreview(durationMs, part);
      }
      await new Promise(r => setTimeout(r, 300));
      const ok = await previewWaitUntil(seekTo + previewSeconds * 1000, durationMs);
      if (!ok) break;
    }
  } finally {
    presetTracking = false;
    resetPresets();
    const wasAborted = previewAbort || !previewMode;
    previewAbort = false;
    previewRunning = false;
    if (previewMode && !wasAborted && currentTrack && currentTrack.uri === startedUri) {
      try { await previewAdvance(); } catch (_) {}
    }
  }
}

let _trackIndexCache = { name: "", uri: "", index: -1 };

function queueUpcoming(count) {
  count = count || 8;
  const out = [];
  for (const t of manualQueue) {
    if (!out.some(o => o.uri === t.uri)) out.push(t);
    if (out.length >= count) return out;
  }
  const name = sourceName();
  if (shuffleOn) {
    const tracks = playableTracks(name);
    const byUri = new Map(tracks.map(t => [t.uri, t]));
    for (const uri of shuffleQueue) {
      const t = byUri.get(uri);
      if (t && !out.some(o => o.uri === t.uri)) out.push(t);
      if (out.length >= count) break;
    }
    return out;
  }
  const tracks = queueTracks(name);
  if (!tracks.length) return out;
  
  let idx = -1;
  const curUri = currentTrack ? currentTrack.uri : "";
  if (_trackIndexCache.name === name && _trackIndexCache.uri === curUri && _trackIndexCache.index !== -1) {
    idx = _trackIndexCache.index;
  } else {
    idx = currentTrack ? tracks.findIndex(t => sameRecording(t, currentTrack)) : 0;
    if (idx === -1) idx = 0;
    _trackIndexCache = { name, uri: curUri, index: idx };
  }

  for (let i = 1; out.length < count && i <= tracks.length; i++) {
    const next = tracks[(idx + i) % tracks.length];
    if (next && !out.some(o => o.uri === next.uri)) out.push(next);
  }
  return out;
}

function removeFromQueue(track) {
  if (!track || !track.uri) return;
  const idx = manualQueue.findIndex(t => t.uri === track.uri);
  if (idx !== -1) {
    manualQueue.splice(idx, 1);
  } else if (shuffleOn) {
    shuffleQueue = shuffleQueue.filter(u => u !== track.uri);
  } else {
    const upcoming = queueUpcoming(8);
    const qIdx = upcoming.findIndex(t => t.uri === track.uri);
    if (qIdx !== -1) {
      manualQueue = upcoming.slice(qIdx + 1);
    }
  }
  refreshNpPanel();
  setFeedback("removed from queue: " + track.name, false);
}

function attachTrackTouchHold(card, track) {
  let holdTimer = null;
  let isHolding = false;
  card.addEventListener("pointerdown", ev => {
    if (ev.button !== 0 || ev.target.closest(".track-unhide")) return;
    isHolding = false;
    holdTimer = setTimeout(() => {
      isHolding = true;
      if (navigator.vibrate) navigator.vibrate(30);
      openTrackContextMenu(ev.clientX, ev.clientY, track);
    }, 500);
  });
  card.addEventListener("pointerup", () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  });
  card.addEventListener("pointercancel", () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  });
  card.addEventListener("click", ev => {
    if (isHolding) {
      ev.preventDefault();
      ev.stopPropagation();
      isHolding = false;
    }
  });
  card.addEventListener("contextmenu", ev => {
    ev.preventDefault();
    openTrackContextMenu(ev.clientX, ev.clientY, track);
  });
}

function attachQueueDrag(card, track, list) {
  card.addEventListener("pointerdown", ev => {
    if (ev.button !== 0 || ev.target.closest(".np-tile-btn")) return;
    ev.preventDefault();
    const startX = ev.clientX;
    const startY = ev.clientY;
    let dragging = false;

    const onMove = moveEv => {
      moveEv.preventDefault();
      if (!dragging) {
        if (Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY) < 8) return;
        dragging = true;
        card.classList.add("moving");
        list.classList.add("has-moving");
        const sel = window.getSelection();
        if (sel) sel.removeAllRanges();
      }
      const under = document.elementFromPoint(moveEv.clientX, moveEv.clientY);
      const target = under && under.closest(".np-grid-list .track");
      if (!target || target === card) return;
      const rect = target.getBoundingClientRect();
      const before = moveEv.clientX < rect.left + rect.width / 2;
      if (before) {
        if (target.previousElementSibling !== card) list.insertBefore(card, target);
      } else {
        if (target.nextElementSibling !== card) list.insertBefore(card, target.nextSibling);
      }
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      if (!dragging) return;
      card.classList.remove("moving");
      list.classList.remove("has-moving");
      card.dataset.justDragged = "1";
      setTimeout(() => { delete card.dataset.justDragged; }, 150);

      const orderedUris = [...list.querySelectorAll(".track")].map(el => el.dataset.uri).filter(Boolean);
      const byUri = new Map(queueUpcoming(8).map(t => [t.uri, t]));
      const nextManual = orderedUris.map(u => byUri.get(u)).filter(Boolean);
      const remainder = manualQueue.filter(t => !orderedUris.includes(t.uri));
      manualQueue = [...nextManual, ...remainder];
      refreshNpPanel();
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  });
}

function paintNpGrid() {
  if (!npPanel) return;
  npPanel.innerHTML = "";

  const header = document.createElement("div");
  header.className = "np-grid-header";
  const qBtn = document.createElement("button");
  qBtn.type = "button";
  qBtn.textContent = "Queue";
  qBtn.classList.toggle("active", npView === "queue");
  qBtn.addEventListener("click", () => { npView = "queue"; paintNpGrid(); });
  const rBtn = document.createElement("button");
  rBtn.type = "button";
  rBtn.textContent = "Recent";
  rBtn.classList.toggle("active", npView === "recent");
  rBtn.addEventListener("click", () => { npView = "recent"; paintNpGrid(); });
  header.append(qBtn, rBtn);
  npPanel.appendChild(header);

  const list = document.createElement("div");
  list.className = "np-grid-list";
  npPanel.appendChild(list);

  const tracks = npView === "queue" ? queueUpcoming(8) : recentList();
  if (!tracks.length) {
    const empty = document.createElement("p");
    empty.className = "recent-empty";
    empty.textContent = npView === "queue" ? "Nothing queued" : "No recent songs";
    list.appendChild(empty);
    return;
  }
  for (const t of tracks) {
    const card = document.createElement("div");
    card.className = "track";
    card.dataset.uri = t.uri;
    const img = document.createElement("img");
    img.alt = "";
    bindImg(img, t.image);
    const meta = document.createElement("div");
    meta.innerHTML = `<p class="track-name"></p><p class="track-artists"></p>`;
    meta.querySelector(".track-name").textContent = t.name;
    meta.querySelector(".track-artists").textContent = t.artists;
    if (npView === "queue" && t === tracks[0]) {
      const badge = document.createElement("span");
      badge.className = "np-next-badge";
      badge.textContent = "next";
      card.appendChild(badge);
    } else if (npView === "recent" && t === tracks[1]) {
      const badge = document.createElement("span");
      badge.className = "np-next-badge";
      badge.textContent = "previous";
      card.appendChild(badge);
    }

    const actionBtn = document.createElement("span");
    actionBtn.className = "np-tile-btn";
    actionBtn.setAttribute("role", "button");
    if (npView === "queue") {
      actionBtn.textContent = "-";
      actionBtn.title = "Remove from queue";
      actionBtn.addEventListener("click", ev => {
        ev.stopPropagation();
        removeFromQueue(t);
      });
      attachQueueDrag(card, t, list);
    } else {
      actionBtn.textContent = "+";
      actionBtn.title = "Add to queue";
      actionBtn.addEventListener("click", ev => {
        ev.stopPropagation();
        enqueueNext(t);
      });
    }

    card.append(img, meta, actionBtn);
    card.addEventListener("click", async () => {
      if (card.dataset.justDragged) return;
      try {
        changedPlayingNow()
        const token = await getToken();
        currentTrack = t;
        await playFromGesture(t, token);
        updatePlayerBar(t);
        highlightTracks();
        markGridHasTrack();
        paintVersionsButton();
      } catch (err) {
        setFeedback(err.message, true);
      }
    });
    list.appendChild(card);
  }
}

function toggleNpPanel() {
  const btn = document.getElementById("np-queue-btn");
  if (npPanel) {
    npPanel.remove();
    npPanel = null;
    if (btn) btn.classList.remove("active");
    return;
  }
  const view = document.getElementById("player-view");
  if (!view) return;
  npPanel = document.createElement("div");
  npPanel.id = "np-grid";
  view.appendChild(npPanel);
  paintNpGrid();
  if (btn) btn.classList.add("active");
}

function showPreviewSettings() {
  const existing = document.getElementById("preview-settings");
  if (existing) { existing.remove(); return; }
  const center = document.querySelector("#player-view .np-center");
  if (!center) return;

  const panel = document.createElement("div");
  panel.id = "preview-settings";
  panel.className = "preview-settings";
  panel.addEventListener("click", e => e.stopPropagation());

  const timeRow = document.createElement("div");
  timeRow.className = "preview-setting-row";
  const timeLabel = document.createElement("span");
  timeLabel.textContent = "Time per preset";
  const timeSlider = document.createElement("input");
  timeSlider.type = "range";
  timeSlider.min = "1";
  timeSlider.max = "10";
  timeSlider.step = "1";
  timeSlider.value = String(Math.min(10, Math.max(1, previewSeconds)));
  
  const timeVal = document.createElement("span");
  timeVal.className = "preview-setting-val";
  timeVal.textContent = previewSeconds + "s";
  timeVal.title = "Double-click to type custom seconds";

  const applySeconds = val => {
    const num = parseInt(val, 10);
    if (Number.isFinite(num) && num > 0) {
      previewSeconds = num;
      localStorage.setItem("sp_preview_secs", String(previewSeconds));
      timeVal.textContent = previewSeconds + "s";
      if (num <= 10) {
        timeSlider.value = String(num);
      }
    }
  };

  timeSlider.addEventListener("input", () => {
    applySeconds(timeSlider.value);
  });

  timeVal.addEventListener("dblclick", () => {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.className = "preview-setting-input";
    input.value = String(previewSeconds);

    const commit = () => {
      applySeconds(input.value);
      input.replaceWith(timeVal);
    };

    input.addEventListener("blur", commit);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        input.blur();
      } else if (e.key === "Escape") {
        input.replaceWith(timeVal);
      }
    });

    timeVal.replaceWith(input);
    input.focus();
    input.select();
  });

  const bar = el.progress.parentElement || el.progress;
  if (bar) {
    bar.addEventListener("click", () => {
      if (previewSeconds > 10) {
        previewSeconds = 5;
        localStorage.setItem("sp_preview_secs", String(previewSeconds));
        timeVal.textContent = previewSeconds + "s";
        timeSlider.value = String(previewSeconds);
      }
    }, { capture: true });
  }

  timeRow.append(timeLabel, timeSlider, timeVal);

  const presetRow = document.createElement("div");
  presetRow.className = "preview-setting-row";
  const presetLabel = document.createElement("span");
  presetLabel.textContent = "Presets";
  const presetPill = document.createElement("div");
  presetPill.className = "preview-preset-pill";
  for (const part of ["A", "B", "C", "D", "E"]) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = part;
    if (previewPresets.includes(part)) b.classList.add("on");
    b.addEventListener("click", () => {
      if (previewPresets.includes(part)) {
        if (previewPresets.length <= 1) return;
        previewPresets = previewPresets.replace(part, "");
      } else {
        previewPresets = (previewPresets + part).split("").sort().join("");
      }
      localStorage.setItem("sp_preview_presets", previewPresets);
      b.classList.toggle("on");
    });
    presetPill.appendChild(b);
  }
  presetRow.append(presetLabel, presetPill);

  panel.append(timeRow, presetRow);
  center.appendChild(panel);
}

function buildPlayer() {
  let progressWrap = el.progress.parentElement;
  if (!progressWrap || progressWrap === el.bar) {
    progressWrap = document.createElement("div");
    progressWrap.appendChild(el.progress);
  }
  el.bar.style.setProperty("display", "none", "important");
  el.play.style.setProperty("display", "none", "important");
  el.pause.style.setProperty("display", "none", "important");
  const oldView = document.getElementById("player-view");
  if (oldView) oldView.remove();
  const view = document.createElement("div");
  view.id = "player-view";
  const card = document.createElement("div");
  card.className = "np-card";
  const center = document.createElement("div");
  center.className = "np-center";
  el.art.className = "np-art";
  bindImg(el.art, null);
  el.title.className = "np-title";
  el.artists.className = "np-artists";
  progressWrap.classList.add("np-progress");
  const versionsBtn = document.createElement("button");
  versionsBtn.type = "button";
  versionsBtn.id = "np-versions-btn";
  versionsBtn.className = "np-versions-btn";
  versionsBtn.innerHTML = '<i class="fa-solid fa-code-branch"></i><span>1</span>';
  versionsBtn.style.display = "none";
  versionsBtn.title = "Switch version";
  versionsBtn.addEventListener("click", openVersionsPanel);
  center.append(el.art, el.title, el.artists, versionsBtn, progressWrap, el.time);
  const controls = document.createElement("div");
  controls.className = "np-controls";
  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "np-nav np-nav-prev";
  prev.innerHTML = '<i class="fa-solid fa-backward-step"></i>';
  prev.addEventListener("click", () => playAdjacent(-1));
  const next = document.createElement("button");
  next.type = "button";
  next.className = "np-nav np-nav-next";
  next.innerHTML = '<i class="fa-solid fa-forward-step"></i>';
  next.addEventListener("click", () => playAdjacent(1, hideOnSkip));
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "np-toggle";
  toggle.innerHTML = '<i class="fa-solid fa-play"></i>';
toggle.addEventListener("click", async () => {
    if (OFFLINE) {
      if (!currentTrack) {
        const tracks = (cache[sourceName()] && cache[sourceName()].tracks) || [];
        if (tracks.length) {
          currentTrack = tracks[0];
          updatePlayerBar(currentTrack);
        }
      }
      const toggleIcon = document.querySelector("#player-view .np-toggle i");
      const isPaused = toggleIcon.classList.contains("fa-play");
      toggleIcon.className = isPaused ? "fa-solid fa-pause" : "fa-solid fa-play";
      setFeedback(isPaused ? "Playing locally" : "Paused locally", false);
      return;
    }
    if (!player) return;
    try {
      await player.activateElement();
      const token = await getToken();
      const src = sourceName();
      const srcEntry = cache[src];
      const needsLoad = !srcEntry || !srcEntry.tracks || !srcEntry.tracks.length || srcEntry.partial;
      if (needsLoad) {
        setStatus("Loading " + src);
        const source = await resolvePlaylistData(src, token);
        if (source === "none") {
          await loadPlaylist(src, token);
          try { await commitPlaylist(src, token); } catch (_) { /* best effort */ }
        }
        setStatus("");
        renderTracks();
      }
      if (!currentTrack) {
        const tracks = (cache[src] && cache[src].tracks) || [];
        const first = tracks.find(t => !isHidden(src, t.uri)) || tracks[0];
        if (first) {
          currentTrack = first;
          updatePlayerBar(first);
          highlightTracks();
          markGridHasTrack();
          paintVersionsButton();
        }
      }
      const real = await fetchPlaybackState(token);
      const isPlaying = real ? !real.paused : (lastState ? !lastState.paused : false);
      if (isPlaying) {
        await fetch("https://api.spotify.com/v1/me/player/pause", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });
        return;
      }
      if (real && currentTrack) {
        const realRef = { uri: real.uri, name: real.name, artists: real.artists, durationMs: real.durationMs };
        if (!sameRecording(currentTrack, realRef)) {
          await playFromGesture(currentTrack, token);
          updatePlayerBar(currentTrack);
          highlightTracks();
          return;
        }
      } else if (currentTrack && !real) {
        await playFromGesture(currentTrack, token);
        updatePlayerBar(currentTrack);
        highlightTracks();
        return;
      }
      await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ device_ids: [deviceId], play: true })
      });
    } catch (err) {
      setFeedback(err.message, true);
    }
  });

  const queueBtn = document.createElement("button");
  queueBtn.type = "button";
  queueBtn.id = "np-queue-btn";
  queueBtn.className = "np-shuffle";
  queueBtn.innerHTML = '<i class="fa-solid fa-list-ul"></i>';
  queueBtn.title = "Queue / Recent";
  queueBtn.addEventListener("click", toggleNpPanel);

  const repeatBtn = document.createElement("button");
  repeatBtn.type = "button";
  repeatBtn.id = "np-repeat-btn";
  repeatBtn.className = "np-shuffle";
  repeatBtn.addEventListener("click", cycleRepeat);
  paintRepeatButton();

  const previewBtn = document.createElement("button");
  previewBtn.type = "button";
  previewBtn.id = "np-preview-btn";
  previewBtn.className = "np-shuffle";
  previewBtn.innerHTML = '<i class="fa-solid fa-stopwatch"></i>';
  previewBtn.title = "Preview";

  let previewClickTimer = null;

  previewBtn.addEventListener("pointerdown", () => {
    previewLongPressed = false;
    clearTimeout(previewHoldTimer);
    previewHoldTimer = setTimeout(() => {
      previewHoldTimer = null;
      previewLongPressed = true;
      if (navigator.vibrate) navigator.vibrate(30);
      showPreviewSettings();
    }, 500);
  });

  previewBtn.addEventListener("pointerup", () => {
    if (previewHoldTimer) {
      clearTimeout(previewHoldTimer);
      previewHoldTimer = null;
    }
    if (previewLongPressed) {
      previewLongPressed = false;
      return;
    }
    clearTimeout(previewClickTimer);
    previewClickTimer = setTimeout(() => {
      togglePreviewMode();
    }, 250);
  });

  previewBtn.addEventListener("pointercancel", () => {
    clearTimeout(previewHoldTimer);
    previewHoldTimer = null;
    previewLongPressed = false;
    clearTimeout(previewClickTimer);
  });

  previewBtn.addEventListener("dblclick", ev => {
    ev.stopPropagation();
    clearTimeout(previewClickTimer);
    if (previewHoldTimer) {
      clearTimeout(previewHoldTimer);
      previewHoldTimer = null;
    }
    previewLongPressed = false;
    showPreviewSettings();
    if (!previewMode) {
      togglePreviewMode();
    }
  });

  previewBtn.addEventListener("contextmenu", ev => ev.preventDefault());

const filterBtn = document.createElement("button");
  filterBtn.type = "button";
  filterBtn.className = "np-shuffle";

  window.paintPlayerFilter = () => {
    filterBtn.classList.toggle("active", hideOnSkip);
    filterBtn.classList.toggle("on", hideOnSkip);
    filterBtn.innerHTML = '<i class="fa-solid fa-filter"></i>';
    filterBtn.title = hideOnSkip ? "Filter mode: ON" : "Filter mode: OFF";
  };

  filterBtn.addEventListener("click", () => {
    hideOnSkip = !hideOnSkip;
    localStorage.setItem("sp_hide_on_skip", hideOnSkip ? "1" : "0");
    if (window.syncAllFilterButtons) window.syncAllFilterButtons();
    else window.paintPlayerFilter();
    setFeedback(hideOnSkip ? "filter mode on" : "filter mode off", false);
  });

  window.paintPlayerFilter();

  const volumeBtn = document.createElement("button");
  volumeBtn.type = "button";
  volumeBtn.className = "np-shuffle";
  const paintVolume = () => {
    volumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    volumeBtn.classList.toggle("active", volumeShown);
    volumeBtn.title = volumeShown ? "Hide volume" : "Show volume";
  };
  paintVolume();
  volumeBtn.addEventListener("click", () => {
    volumeShown = !volumeShown;
    volume.style.display = volumeShown ? "flex" : "none";
    center.appendChild(volume);
    paintVolume();
  });

  center.appendChild(controls);
    const seeks = document.createElement("div");
  seeks.className = "np-seeks";

  const back10 = document.createElement("button");
  back10.type = "button";
  back10.className = "np-preset-adj np-preset-back";
  back10.title = "-10 seconds";
  back10.addEventListener("click", () => seekRelative(-10000));

  const presetPill = document.createElement("div");
  presetPill.className = "np-preset-pill";
  const presets = [["A", "1"], ["B", "2"], ["C", "3"], ["D", "4"], ["E", "5"]];
  const presetBtns = {};
  const paintPresets = mode => {
    for (const [p, btn] of Object.entries(presetBtns)) {
      btn.classList.toggle("active", mode ? p === mode : false);
    }
  };
  for (const [part] of presets) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "np-preset";
      b.dataset.preset = part;
      b.textContent = "";
      presetBtns[part] = b;
      b.addEventListener("click", () => {
      if (OFFLINE) {
        presetTracking = false;
        lastPaintedPreset = null;
        paintPresets(part);
        return;
      }
      presetTracking = true;
      lastPaintedPreset = null;
      seekCurrent(part);
    });
      presetPill.appendChild(b);
    }
  paintPresets(null);

  const fwd10 = document.createElement("button");
  fwd10.type = "button";
  fwd10.className = "np-preset-adj np-preset-fwd";
  fwd10.title = "+10 seconds";
  fwd10.addEventListener("click", () => seekRelative(10000));

  seeks.append(back10, presetPill, fwd10);
  paintPresets(null);
    const rnd = document.createElement("button");
  rnd.type = "button";
  rnd.className = "np-shuffle";
  const paintRnd = () => {
    rnd.innerHTML = '<i class="fa-solid fa-shuffle"></i>';
    rnd.classList.toggle("active", shuffleOn);
  };
  paintRnd();
  rnd.addEventListener("click", () => {
    shuffleOn = !shuffleOn;
    localStorage.setItem("sp_shuffle", shuffleOn ? "1" : "0");
    if (shuffleOn) resetShuffleQueue(sourceName(), currentTrack && currentTrack.uri);
    paintRnd();
  });
 controls.append(prev, toggle, filterBtn, rnd, queueBtn, previewBtn, volumeBtn, next);
  center.appendChild(seeks);
  const volume = document.createElement("div");
  volume.className = "np-volume";
  const vIcon = document.createElement("i");
  vIcon.className = "fa-solid fa-volume-high";
  const vRange = document.createElement("input");
  vRange.type = "range";
  vRange.min = "0";
  vRange.max = "1";
  vRange.step = "0.05";
  vRange.value = localStorage.getItem("sp_volume") || "0.8";
  vRange.addEventListener("input", () => {
    const v = Number(vRange.value);
    localStorage.setItem("sp_volume", String(v));
    if (player) player.setVolume(v);
  });
  volume.append(vIcon, vRange);
  volume.style.display = "none";
  center.appendChild(volume);
  card.appendChild(center);
  view.appendChild(card);
  const gridParent = el.grid && el.grid.parentElement;
  if (gridParent) gridParent.insertBefore(view, el.grid);
  else document.body.appendChild(view);
  paintRepeatButton();
}

function applyPlayerScale(v) {
  const view = document.getElementById("player-view");
  if (view) view.style.zoom = String(v);
}

function applyGridScale(v) {
  el.grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${Math.round(140 * v)}px, 1fr))`;
}

async function playRandom() {
  changedPlayingNow()
  const name = sourceName();
  const tracks = ((cache[name] && cache[name].tracks) || []).filter(t => !isHidden(name, t.uri));
  if (!tracks.length) {
    setFeedback("ERROR no visible tracks", true);
    return;
  }
  const track = tracks[Math.floor(Math.random() * tracks.length)];
  try {
    const token = await getToken();
    currentTrack = track;
    await playFromGesture(track, token);
    updatePlayerBar(track);
    renderTracks();
    highlightTracks();
  } catch (err) {
    setFeedback(err.message, true);
  }
}

function exportHidden() {
  const blob = new Blob([JSON.stringify(hiddenMap(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "hidden-" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function importHidden(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("ERROR invalid file");
      localStorage.setItem(HIDDEN_KEY, JSON.stringify(data));
      renderTracks();
      renderGrid();
      setFeedback("hidden imported", false);
    } catch (err) {
      setFeedback(err.message, true);
    }
  };
  reader.readAsText(file);
}

async function unhideAll() {
  const name = sourceName();
  const map = hiddenMap();
  const list = (map[name] || []).slice();
  if (!list.length) return;

  showAppDialog({
    type: "change",
    isQuestion: true,
    title: "Unfilter All Songs",
    text: "Are you sure you want to unfilter all hidden songs in " + name + "?",
    onConfirm: async () => {
      map[name] = [];
      localStorage.setItem(HIDDEN_KEY, JSON.stringify(map));
      renderTracks();
      renderGrid();
      setFeedback("unfiltered all in " + name, false);
      try {
        const token = await getToken();
        const id = PLAYLISTS[name] && PLAYLISTS[name].id;
        if (!id) return;
        await Promise.all(list.map(uri => syncPush(token, id, uri, false).catch(() => null)));
      } catch (err) {
        setFeedback(err.message, true);
      }
    }
  });
}

function signOut() {
  localStorage.removeItem("sp_token");
  localStorage.removeItem("sp_verifier");
    localStorage.removeItem(OPS_CURSOR_KEY);
  localStorage.removeItem(ME_KEY);
  localStorage.removeItem(PLAYLISTS_CACHE_KEY);
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(HIDDEN_KEY);
  localStorage.removeItem(HIERARCHY_KEY);
  localStorage.removeItem(HIERARCHY_ON_KEY);
  location.reload();
}

function buildSourcesBar() {
  const bar = document.createElement("div");
  bar.className = "sources-bar";

  sourcesCollapsed = true;
  localStorage.setItem("sp_sources_collapsed", "1");

  const label = document.createElement("span");
  label.className = "sources-label";
  label.id = "sources-label";
  label.textContent = sourceName();

  const collapse = document.createElement("button");
  collapse.type = "button";
  collapse.className = "sources-collapse";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "outline-btn-scndry";

  const paintEdit = () => {
    editBtn.style.display = sourcesCollapsed ? "none" : "inline-flex";
    editBtn.classList.toggle("on", reorderMode || showHiddenGrid);
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.title = reorderMode ? "Exit edit mode" : "Edit sources";
  };

  const paintCollapse = () => {
    collapse.innerHTML = sourcesCollapsed
      ? '<i class="fa-solid fa-chevron-down"></i>'
      : '<i class="fa-solid fa-chevron-up"></i>';
    collapse.title = sourcesCollapsed ? "Show sources" : "Hide sources";

    const grid = document.getElementById("source-grid");
    if (grid) grid.style.display = sourcesCollapsed ? "none" : "grid";
    paintEdit();
  };

  paintCollapse();

  collapse.addEventListener("click", () => {
    sourcesCollapsed = !sourcesCollapsed;
    localStorage.setItem("sp_sources_collapsed", sourcesCollapsed ? "1" : "0");
    paintCollapse();
  });

  editBtn.addEventListener("click", () => {
    reorderMode = !reorderMode;
    showHiddenGrid = reorderMode;
    paintEdit();
    paintTargetBar();
    renderGrid("source");
    renderGrid("target");
  });

  const hint = document.createElement("span");
  hint.className = "sources-hint";
  hint.textContent = "double-click to play";
  bar.append(label, collapse, editBtn, hint);
  return bar;
}
function buildTargetBar() {
  const bar = document.createElement("div");
  bar.className = "target-bar";
  const label = document.createElement("span");
  label.className = "target-label";
  label.textContent = "";
  const progressSpan = document.createElement("span");
  progressSpan.id = "songs-progress";
  progressSpan.className = "songs-progress";

  const hierarchyText = document.createElement("span");
  hierarchyText.id = "hierarchy-status-text";
  hierarchyText.style.cssText = "font-size: 11px; color: var(--muted); margin-left: 8px;";
  hierarchyText.textContent = hierarchyOn() ? "Hierarchy: ON" : "";

  bar.append(label, progressSpan, hierarchyText, el.status);
  el.grid.parentElement.insertBefore(bar, el.grid);

  const bottom = document.createElement("div");
  bottom.className = "target-bar target-bottom";

  const hiddenBtn = document.createElement("button");
  hiddenBtn.type = "button";
  hiddenBtn.className = "outline-btn-scndry";
  const paintHidden = () => {
    const n = hiddenGrid("target").length + hiddenGrid("source").length;
    hiddenBtn.classList.toggle("on", showHiddenGrid);
    hiddenBtn.innerHTML = '<i class="fa-solid ' + (showHiddenGrid ? "fa-eye" : "fa-eye-slash") + '"></i><span>Hidden' + (n ? " · " + n : "") + '</span>';
    hiddenBtn.title = showHiddenGrid ? "Hide hidden playlists" : "Show hidden playlists";
  };
  paintHidden();
  hiddenBtn.addEventListener("click", () => {
    showHiddenGrid = !showHiddenGrid;
    paintHidden();
    renderGrid("target");
    renderGrid("source");
  });

  const reorderBtn = document.createElement("button");
  reorderBtn.type = "button";
  reorderBtn.className = "outline-btn-scndry";
  const paintReorder = () => {
    reorderBtn.classList.toggle("on", reorderMode || showHiddenGrid);
    reorderBtn.innerHTML = '<i class="fa-solid fa-pen"></i><span>' + (reorderMode ? "Done" : "Edit") + '</span>';
    reorderBtn.title = reorderMode ? "Exit edit mode" : "Edit playlists";
  };
  paintReorder();
  reorderBtn.addEventListener("click", () => {
    reorderMode = !reorderMode;
    showHiddenGrid = reorderMode;
    paintReorder();
    paintHidden();
    renderGrid("target");
    renderGrid("source");
  });

  const pendingBtn = document.createElement("button");
  pendingBtn.type = "button";
  pendingBtn.id = "pending-btn";
  pendingBtn.className = "outline-btn-scndry";
  pendingBtn.innerHTML = '<i class="fa-solid fa-clock"></i><span>Pending</span>';
  pendingBtn.style.display = "none";
  pendingBtn.title = "Replay queued changes";
  pendingBtn.addEventListener("click", () => replayPending());
  const right = document.createElement("div");
  right.className = "target-right";
  right.append(reorderBtn);
  right.appendChild(pendingBtn);
  bottom.appendChild(right);

  el.grid.parentElement.insertBefore(bottom, el.grid.nextSibling);

  return paintHidden;
}

function buildHeader() {
  if (document.getElementById("app-header")) return;
  const header = document.createElement("header");
  header.id = "app-header";
  const logo = document.createElement("span");
  logo.className = "header-logo";
  logo.innerHTML = LOGO_SVG;

  const wrap = document.createElement("div");
  wrap.className = "header-text";

  header.append(logo, wrap);

  const versionSpan = document.createElement("span");
  versionSpan.className = "header-version";
  versionSpan.textContent = VERSION_NUMBER;
  versionSpan.style.cssText = "color: var(--blackG); margin-right: 12px; font-size: 10px; font-family: monospace;";

  const out = document.createElement("button");
  out.type = "button";
  out.className = "header-signout";
  out.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i><span>Sign out</span>';
  out.addEventListener("click", signOut);

  header.append(out);
  el.main.insertBefore(header, el.main.firstChild);

  const offlineBadge = document.createElement("div");
  offlineBadge.id = "offline-mode-badge";
  offlineBadge.className = "offline-badge-full";
  offlineBadge.textContent = "OFFLINE MODE";
  offlineBadge.style.cssText = "display: " + (OFFLINE ? "block" : "none") + "; width: calc(100% + 48px); margin: -20px -24px 20px -24px; background: var(--backgroundGrad3); color: var(--white); font-size: 10px; font-weight: 700; padding: 6px 24px; text-align: center; letter-spacing: 0.05em; box-sizing: border-box;";
  header.insertAdjacentElement("afterend", offlineBadge);

  let bottomVersion = document.getElementById("bottom-version-footer");
  if (!bottomVersion) {
    bottomVersion = document.createElement("div");
    bottomVersion.id = "bottom-version-footer";
    bottomVersion.style.cssText = "text-align: left; color: var(--scndry1); font-size: 11px; font-family: monospace; margin: 20px 0 10px 0; padding: 1px;";
    el.main.appendChild(bottomVersion);
  }
  bottomVersion.textContent = VERSION_NUMBER;

  document.querySelectorAll("h1, h2, h3, header").forEach(node => {
    if (node.closest("#app-header")) return;
    if (node.textContent.trim().startsWith("spotifylter")) node.style.display = "none";
  });
}


async function reloadGridPlaylists() {
  const token = await getToken();
  const hidden = hiddenGrid();
  const names = Object.keys(PLAYLISTS).filter(n => !PLAYLISTS[n].extra && !hidden.includes(n));
  for (let i = 0; i < names.length; i++) {
    setStatus("Reloading " + (i + 1) + "/" + names.length + ": " + names[i]);
    try {
      await loadPlaylist(names[i], token);
    } catch (err) {
      setFeedback(err.message, true);
    }
  }
  setStatus("");
  renderGrid();
  renderTracks();
  highlightTracks();
}

async function reconcileDevice() {
  const last = Number(localStorage.getItem("sp_last_reconcile") || 0);
  if (Date.now() - last < 120000) return;
  localStorage.setItem("sp_last_reconcile", String(Date.now()));
  const token = await getToken();
  const api = await fetchPlaybackState(token);
  if (!api) return;
  const activeId = api.device && api.device.id;
  if (activeId && activeId === deviceId) return;
  pendingTrackUri = null;
  pendingTrackUriAt = 0;
  sdkStaleUri = null;
  const cached = findCachedTrack(api.uri);
  const apiRef = {
    uri: api.uri,
    name: api.name,
    artists: api.artists,
    durationMs: api.durationMs
  };
  if (!currentTrack || !sameRecording(currentTrack, apiRef)) {
    currentTrack = cached || {
      uri: api.uri,
      name: api.name,
      artists: api.artists,
      durationMs: api.durationMs,
      image: api.image
    };
  }
  el.title.textContent = currentTrack.name;
  el.artists.textContent = currentTrack.artists;
  bindImg(el.art, currentTrack.image);
  lastState = {
    paused: api.paused,
    position: api.position,
    duration: api.durationMs,
    timestamp: api.timestamp,
    track_window: { current_track: { uri: api.uri } }
  };
  startProgress(lastState);
  const toggleIcon = document.querySelector("#player-view .np-toggle i");
  if (toggleIcon) toggleIcon.className = api.paused ? "fa-solid fa-play" : "fa-solid fa-pause";
  highlightTracks();
  markGridHasTrack();
  paintVersionsButton();
  setStatus("Playing on " + (api.device && api.device.name || "another device"));
}

async function renderToolsGrid() {
  const grid = document.getElementById("tools-grid");
  if (!grid) return;
  grid.innerHTML = "";
  grid.style.display = toolsCollapsed ? "none" : "grid";
  if (toolsCollapsed) return;
  for (const t of TOOLS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tool-tile";
    btn.innerHTML = '<i class="fa-solid ' + t.icon + '"></i><span>' + t.label + '</span>';
    btn.title = t.desc;
    if (t.id === "hierarchy") {
      const paintTile = () => btn.classList.toggle("cascade-on", hierarchyOn());
      paintTile();
      btn.title = "Click to configure · double-click to toggle cascade";
      let clickTimer = null;
      btn.addEventListener("click", () => {
        if (clickTimer) return;
        clickTimer = setTimeout(() => {
          clickTimer = null;
          openHierarchyPanel();
        }, 220);
      });
      btn.addEventListener("dblclick", () => {
        clearTimeout(clickTimer);
        clickTimer = null;
        setHierarchyOn(!hierarchyOn());
        paintTile();
        paintToolsBadge();
        setFeedback(hierarchyOn() ? "cascade ON" : "cascade OFF", false);
      });
      grid.appendChild(btn);
      continue;
    }
    if (t.id === "localplaylist") {
      btn.addEventListener("click", async () => {
        try {
          const token = await getToken();
          await openLocalPlaylistTool(token);
        } catch (err) {
          setFeedback(err.message, true);
        }
      });
      grid.appendChild(btn);
      continue;
    }
    if (t.id === "color") {
      btn.addEventListener("click", () => {
        openColorTool();
      });
      grid.appendChild(btn);
      continue;
    }
if (t.id === "offline") {
      const paintOfflineTile = () => {
        btn.classList.toggle("active", OFFLINE);
        btn.style.background = OFFLINE ? "var(--primaryGrad)" : "";
        btn.style.color = OFFLINE ? "var(--bg)" : "";
        btn.style.border = OFFLINE ? "1px solid var(--accent)" : "";
        const icon = btn.querySelector("i");
        if (icon) icon.style.color = OFFLINE ? "var(--bg)" : "";
      };
      paintOfflineTile();
      btn.title = OFFLINE ? "Offline mode: ON (click to go online)" : "Offline mode: OFF (click to go offline)";
      btn.addEventListener("click", () => {
        const nextState = !OFFLINE;
        localStorage.setItem("sp_offline", nextState ? "1" : "0");
        location.reload();
      });
      grid.appendChild(btn);
      continue;
    }
    
    btn.addEventListener("click", async () => {
      try {
        const token = await getToken();
        if (t.id === "manual") {
          await openManualPlaylist(token);
          return;
        }
        if (t.id === "slice") {
          await openSliceTool(token);
          return;
        }
        await openTool(t.id, token);
      } catch (err) {
        setFeedback(err.message, true);
      }
    });
    grid.appendChild(btn);
  }
}

async function createPlaylistWithTracks(name, uris, token) {
  const plRes = await fetch("https://api.spotify.com/v1/me/playlists", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ name, public: false, description: "Created by spotifylter" })
  });
  if (!plRes.ok) throw new Error("ERROR create " + plRes.status);
  const pl = await plRes.json();
  const unique = [...new Set(uris)];
  for (let i = 0; i < unique.length; i += 100) {
    const batch = unique.slice(i, i + 100);
    let attempt = 0;
    while (true) {
      const addRes = await fetch("https://api.spotify.com/v1/playlists/" + pl.id + "/items", {
        method: "POST",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify({ uris: batch })
      });
      if (addRes.ok) break;
      if (addRes.status === 429 && attempt < 4) {
        const ra = Number(addRes.headers.get("Retry-After"));
        const wait = Number.isFinite(ra) && ra > 0 ? ra * 1000 : 2000 * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, Math.min(wait, 30000)));
        attempt++;
        continue;
      }
      throw new Error("ERROR add " + addRes.status);
    }
  }
  return pl;
}

async function ensureLoaded(names, token) {
  for (const name of names) {
    const c = cache[name];
    if (c && c.tracks && c.tracks.length && !c.partial) continue;
    setStatus("Loading " + name);
    await loadPlaylist(name, token);
  }
}

function openHierarchyPanel() {
  const old = document.getElementById("tool-panel");
  if (old) old.remove();

  const panel = document.createElement("div");
  panel.id = "tool-panel";
  panel.className = "tool-panel";

  const head = document.createElement("div");
  head.className = "tool-head";
  const h3 = document.createElement("h3");
  h3.textContent = "Hierarchy";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "tool-close";
  close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  close.addEventListener("click", () => closeToolPanel());
  head.append(h3, close);
  panel.appendChild(head);

  const hint = document.createElement("p");
  hint.className = "tool-hint";
  hint.textContent = "When you add a song to a playlist, also add it to the linked ones below. Cascades downstream. Only runs while the toggle is ON. Removing a song only removes it from the playlist you clicked.";
  panel.appendChild(hint);

  const toggleRow = document.createElement("div");
  toggleRow.className = "hierarchy-toggle-row";
  const toggleLabel = document.createElement("span");
  toggleLabel.textContent = "Cascade";
  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "skip-toggle";
  const paintToggle = () => {
    toggleBtn.classList.toggle("on", hierarchyOn());
    toggleBtn.innerHTML = hierarchyOn()
      ? '<i class="fa-solid fa-toggle-on"></i><span>ON</span>'
      : '<i class="fa-solid fa-toggle-off"></i><span>OFF</span>';
  };
  paintToggle();
  toggleBtn.addEventListener("click", () => {
    setHierarchyOn(!hierarchyOn());
    paintToggle();
    paintToolsBadge();
  });
  toggleRow.append(toggleLabel, toggleBtn);
  panel.appendChild(toggleRow);

  const list = document.createElement("div");
  list.className = "hierarchy-list";
  panel.appendChild(list);

  const names = Object.keys(PLAYLISTS).filter(n => !PLAYLISTS[n].extra);

  for (const name of names) {
    const row = document.createElement("div");
    row.className = "hierarchy-row";

    const header = document.createElement("button");
    header.type = "button";
    header.className = "hierarchy-header";
    const title = document.createElement("span");
    title.textContent = name;
    const summary = document.createElement("span");
    summary.className = "hierarchy-summary";
    const dests = (hierarchyMap()[name] || []);
    summary.textContent = dests.length ? "→ " + dests.join(", ") : "→ none";
    const chevron = document.createElement("i");
    chevron.className = "fa-solid fa-chevron-down hierarchy-chevron";
    header.append(title, summary, chevron);
    row.appendChild(header);

    const body = document.createElement("div");
    body.className = "hierarchy-body";
    body.style.display = "none";

    for (const other of names) {
      if (other === name) continue;
      const label = document.createElement("label");
      label.className = "hierarchy-option";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = dests.includes(other);
      cb.addEventListener("change", () => {
        const m = hierarchyMap();
        const cur = (m[name] || []).slice();
        const idx = cur.indexOf(other);
        if (cb.checked && idx === -1) cur.push(other);
        if (!cb.checked && idx !== -1) cur.splice(idx, 1);
        if (cur.length) m[name] = cur; else delete m[name];
        setHierarchyMap(m);
        summary.textContent = cur.length ? "→ " + cur.join(", ") : "→ none";
      });
      const span = document.createElement("span");
      span.textContent = other;
      label.append(cb, span);
      body.appendChild(label);
    }

    header.addEventListener("click", () => {
      const open = body.style.display !== "none";
      body.style.display = open ? "none" : "grid";
      chevron.style.transform = open ? "rotate(0deg)" : "rotate(180deg)";
    });

    row.appendChild(body);
    list.appendChild(row);
  }

  document.getElementById("tool-panel-host").appendChild(panel);
}

async function openLocalPlaylistTool(token) {
    const old = document.getElementById("tool-panel");
    if (old) old.remove();

    const panel = document.createElement("div");
    panel.id = "tool-panel";
    panel.className = "tool-panel";

    const head = document.createElement("div");
    head.className = "tool-head";
    const h3 = document.createElement("h3");
    h3.textContent = "Create Local Playlist";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "tool-close outline-btn";
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    close.addEventListener("click", () => closeToolPanel());
    head.append(h3, close);

    const hint = document.createElement("p");
    hint.className = "tool-hint";
    hint.textContent = "Paste Spotify track links below. This playlist will be saved locally on Wix with a special label.";
    panel.append(head, hint);

    const nameWrap = document.createElement("label");
    nameWrap.className = "tool-label";
    nameWrap.textContent = "Playlist name";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = "Local " + new Date().toISOString().slice(0, 10);
    nameWrap.appendChild(nameInput);
    panel.appendChild(nameWrap);

    const area = document.createElement("textarea");
    area.rows = 10;
    area.style.cssText = "width:100%;resize:vertical;background:var(--bg);color:var(--text);border:1px solid var(--line);border-radius:var(--r-sm);padding:8px;font-family:monospace;font-size:12px;outline:none;";
    area.placeholder = "https://open.spotify.com/track/...";
    panel.appendChild(area);

    const actions = document.createElement("div");
    actions.className = "tool-actions";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => closeToolPanel());
    const create = document.createElement("button");
    create.type = "button";
    create.className = "tool-create";
    create.textContent = "Save local playlist";
    actions.append(cancel, create);
    panel.appendChild(actions);

    create.addEventListener("click", async () => {
        const ids = parseTrackIds(area.value);
        if (!ids.length) {
            setFeedback("ERROR no tracks", true);
            return;
        }
        create.disabled = true;
        create.textContent = "Working...";
        try {
            const playlistName = "local: " + (nameInput.value.trim() || "Playlist");
            const playlistId = "local_" + Date.now();
            const tracks = [];

            for (let i = 0; i < ids.length; i += 50) {
                const chunk = ids.slice(i, i + 50);
                const missingIds = [];
                const chunkTracks = [];

                for (const id of chunk) {
                    let track = lookupTrack("spotify:track:" + id);
                    if (track) {
                        chunkTracks.push(track);
                    } else {
                        missingIds.push(id);
                    }
                }

                if (missingIds.length > 0) {
                    try {
                        const res = await fetch(`https://api.spotify.com/v1/tracks?ids=${missingIds.join(",")}`, {
                            headers: { Authorization: "Bearer " + token }
                        });
                        if (res.ok) {
                            const data = await res.json();
                            for (const t of (data.tracks || [])) {
                                if (!t) continue;
                                const formatted = {
                                    uri: t.uri,
                                    name: t.name,
                                    artists: (t.artists || []).map(a => a.name).join(", "),
                                    durationMs: t.duration_ms,
                                    image: t.album && t.album.images && t.album.images.length ? t.album.images[0].url : null,
                                    isrc: t.external_ids && t.external_ids.isrc ? t.external_ids.isrc : null
                                };
                                chunkTracks.push(formatted);
                            }
                        }
                    } catch (_) {}
                }

                for (const id of chunk) {
                    if (!chunkTracks.some(t => t.uri.includes(id))) {
                        chunkTracks.push({
                            uri: "spotify:track:" + id,
                            name: "Track " + id,
                            artists: "Unknown",
                            durationMs: 0,
                            image: null,
                            isrc: null
                        });
                    }
                }
                tracks.push(...chunkTracks);
            }

            PLAYLISTS[playlistName] = { id: playlistId, label: playlistName, image: tracks[0] ? tracks[0].image : null, local: true };
            if (!SOURCE_CANDIDATES.includes(playlistName)) SOURCE_CANDIDATES.push(playlistName);
            cache[playlistName] = {
                id: playlistId,
                label: playlistName,
                image: tracks[0] ? tracks[0].image : null,
                loadedAt: Date.now(),
                total: tracks.length,
                tracks,
                local: true
            };
            writeCache();

            await fetch(LOCAL_PLAYLISTS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accessToken: token,
                    playlistId,
                    label: playlistName,
                    image: tracks[0] ? tracks[0].image : null,
                    tracks
                })
            });

            localStorage.setItem(SOURCE_KEY, playlistName);
            renderSourceGrid();
            renderTracks();
            closeToolPanel();
            setFeedback("created local playlist " + playlistName, false);
        } catch (err) {
            create.disabled = false;
            create.textContent = "Save local playlist";
            setFeedback(err.message, true);
        }
    });

    document.getElementById("tool-panel-host").appendChild(panel);
}

async function openSliceTool(token) {
  const old = document.getElementById("tool-panel");
  if (old) old.remove();

  const panel = document.createElement("div");
  panel.id = "tool-panel";
  panel.className = "tool-panel";

  const head = document.createElement("div");
  head.className = "tool-head";
  const h3 = document.createElement("h3");
  h3.textContent = "Slice Playlist";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "tool-close";
  close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  close.addEventListener("click", () => closeToolPanel());
  head.append(h3, close);

  const hint = document.createElement("p");
  hint.className = "tool-hint";
  hint.textContent = "Split a loaded playlist into smaller local parts by track count, entirely offline without calling the Spotify API.";
  panel.append(head, hint);

  // Source playlist select
  const originWrap = document.createElement("label");
  originWrap.className = "tool-label";
  originWrap.textContent = "Playlist to slice";
  const originSelect = document.createElement("select");
  for (const name of Object.keys(PLAYLISTS)) {
    if (PLAYLISTS[name].extra) continue;
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    originSelect.appendChild(opt);
  }
  originWrap.appendChild(originSelect);
  panel.appendChild(originWrap);

  // Chunk size input
  const sizeWrap = document.createElement("label");
  sizeWrap.className = "tool-label";
  sizeWrap.textContent = "Tracks per part";
  const sizeInput = document.createElement("input");
  sizeInput.type = "number";
  sizeInput.value = "500";
  sizeInput.min = "10";
  sizeWrap.appendChild(sizeInput);
  panel.appendChild(sizeWrap);

  const preview = document.createElement("p");
  preview.className = "tool-preview";
  panel.appendChild(preview);

  const updatePreview = () => {
    const name = originSelect.value;
    const tracks = (cache[name] && cache[name].tracks) || [];
    const chunkSize = Math.max(1, parseInt(sizeInput.value, 10) || 500);
    const parts = Math.ceil(tracks.length / chunkSize);
    preview.textContent = `${tracks.length} total tracks → ${parts} local parts of ~${chunkSize} tracks`;
  };

  originSelect.addEventListener("change", updatePreview);
  sizeInput.addEventListener("input", updatePreview);
  updatePreview();

  const actions = document.createElement("div");
  actions.className = "tool-actions";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Cancel";
  cancel.addEventListener("click", () => closeToolPanel());
  
  const create = document.createElement("button");
  create.type = "button";
  create.className = "tool-create";
  create.textContent = "Create local parts";
  actions.append(cancel, create);
  panel.appendChild(actions);

  // ── FIX: Ensure this click listener function is marked as 'async' ──
  create.addEventListener("click", async () => {
    const name = originSelect.value;
    const entry = cache[name];
    if (!entry || !entry.tracks || !entry.tracks.length) {
      setFeedback("ERROR playlist data not loaded yet", true);
      return;
    }

    const chunkSize = Math.max(1, parseInt(sizeInput.value, 10) || 500);
    const tracks = entry.tracks;
    create.disabled = true;
    create.textContent = "Slicing...";

    try {
      let createdCount = 0;
      for (let i = 0; i < tracks.length; i += chunkSize) {
        const chunk = tracks.slice(i, i + chunkSize);
        const partNum = Math.floor(i / chunkSize) + 1;
        const partName = `local: ${name} (Part ${partNum})`;
        const playlistId = `local_slice_${Date.now()}_${partNum}`;
        const image = chunk[0] ? chunk[0].image : null;

        PLAYLISTS[partName] = { id: playlistId, label: partName, image, local: true };
        if (!SOURCE_CANDIDATES.includes(partName)) SOURCE_CANDIDATES.push(partName);
        cache[partName] = {
          id: playlistId,
          label: partName,
          image,
          loadedAt: Date.now(),
          total: chunk.length,
          tracks: chunk,
          local: true
        };

        if (!OFFLINE && token) {
          // This await is inside the async click handler
          await fetch(LOCAL_PLAYLISTS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: token,
              playlistId,
              label: partName,
              image,
              tracks: chunk
            })
          }).catch(() => {});
        }
        createdCount++;
      }

      writeCache();
      renderSourceGrid();
      renderGrid();
      closeToolPanel();
      setFeedback(`Successfully created ${createdCount} local parts from ${name}`, false);
    } catch (err) {
      create.disabled = false;
      create.textContent = "Create local parts";
      setFeedback(err.message, true);
    }
  });

  document.getElementById("tool-panel-host").appendChild(panel);
}

async function openTool(toolId, token) {
  const old = document.getElementById("tool-panel");
  if (old) old.remove();

  const meta = {
    combine:   { title: "Combine",   hint: "Union of the checked playlists. Duplicates are dropped." },
    subtract:  { title: "Subtract",  hint: "Keep songs in the origin that are NOT in any checked playlist." },
    intersect: { title: "Intersect", hint: "Keep only songs present in every checked playlist." },
    dedupe:    { title: "Dedupe",    hint: "Copy the first checked playlist with duplicates removed." }
  }[toolId];

  const panel = document.createElement("div");
  panel.id = "tool-panel";
  panel.className = "tool-panel";

  const head = document.createElement("div");
  head.className = "tool-head";
  const h3 = document.createElement("h3");
  h3.textContent = meta.title;
  const close = document.createElement("button");
  close.type = "button";
  close.className = "tool-close";
  close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  close.addEventListener("click", () => closeToolPanel());
  head.append(h3, close);

  const hint = document.createElement("p");
  hint.className = "tool-hint";
  hint.textContent = meta.hint;
  panel.append(head, hint);

  let originSelect = null;
  if (toolId === "subtract") {
    const wrap = document.createElement("label");
    wrap.className = "tool-label";
    wrap.textContent = "Origin playlist";
    originSelect = document.createElement("select");
    for (const name of Object.keys(PLAYLISTS)) {
      if (PLAYLISTS[name].extra) continue;
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      originSelect.appendChild(opt);
    }
    originSelect.addEventListener("change", updatePreview);
    wrap.appendChild(originSelect);
    panel.appendChild(wrap);
  }

  const list = document.createElement("div");
  list.className = "tool-list";
  const checks = new Map();
  for (const name of Object.keys(PLAYLISTS)) {
    if (PLAYLISTS[name].extra) continue;
    const row = document.createElement("label");
    row.className = "tool-row";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = name;
    cb.addEventListener("change", updatePreview);
    const span = document.createElement("span");
    span.textContent = name;
    row.append(cb, span);
    checks.set(name, cb);
    list.appendChild(row);
  }
  panel.appendChild(list);

  const nameWrap = document.createElement("label");
  nameWrap.className = "tool-label";
  nameWrap.textContent = "New playlist name";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = meta.title + " " + new Date().toISOString().slice(0, 10);
  nameWrap.appendChild(nameInput);
  panel.appendChild(nameWrap);

  const preview = document.createElement("p");
  preview.className = "tool-preview";
  panel.appendChild(preview);

  const actions = document.createElement("div");
  actions.className = "tool-actions";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Cancel";
  cancel.addEventListener("click", () => closeToolPanel());
  const create = document.createElement("button");
  create.type = "button";
  create.className = "tool-create";
  create.textContent = "Create playlist";
  actions.append(cancel, create);
  panel.appendChild(actions);

  function collect() {
    const origin = originSelect ? originSelect.value : null;
    const others = [...checks.entries()]
      .filter(([n, cb]) => cb.checked && n !== origin)
      .map(([n]) => n);
    return { origin, others };
  }

  function compute() {
    const { origin, others } = collect();
    if (toolId === "combine") {
      const seen = new Set();
      const out = [];
      for (const name of others) {
        for (const t of (cache[name] && cache[name].tracks) || []) {
          if (seen.has(t.uri)) continue;
          seen.add(t.uri);
          out.push(t.uri);
        }
      }
      return out;
    }
    if (toolId === "subtract") {
      if (!origin) return [];
      const remove = new Set();
      for (const name of others) {
        for (const t of (cache[name] && cache[name].tracks) || []) remove.add(t.uri);
      }
      return ((cache[origin] && cache[origin].tracks) || []).map(t => t.uri).filter(u => !remove.has(u));
    }
    if (toolId === "intersect") {
      if (others.length < 2) return [];
      const sets = others.map(n => new Set(((cache[n] && cache[n].tracks) || []).map(t => t.uri)));
      return [...sets[0]].filter(u => sets.every(s => s.has(u)));
    }
    if (toolId === "dedupe") {
      const name = others[0];
      if (!name) return [];
      const seen = new Set();
      return ((cache[name] && cache[name].tracks) || []).map(t => t.uri).filter(u => {
        if (seen.has(u)) return false;
        seen.add(u);
        return true;
      });
    }
    return [];
  }

  function updatePreview() {
    const { origin, others } = collect();
    const needed = origin ? [origin, ...others] : others;
    const missing = needed.filter(n => !cache[n] || !cache[n].tracks || cache[n].partial);
    if (missing.length) {
      preview.textContent = "Will load: " + missing.join(", ");
      return;
    }
    const out = compute();
    preview.textContent = out.length + " songs · " + new Set(out).size + " unique";
  }

  create.addEventListener("click", async () => {
    const { origin, others } = collect();
    const needed = origin ? [origin, ...others] : others;
    if (!needed.length) {
      setFeedback("ERROR select a playlist", true);
      return;
    }
    if (toolId === "intersect" && others.length < 2) {
      setFeedback("ERROR intersect needs 2+", true);
      return;
    }
    create.disabled = true;
    create.textContent = "Working…";
    try {
      await ensureLoaded(needed, token);
      const uris = compute();
      if (!uris.length) throw new Error("ERROR empty result");
      const name = nameInput.value.trim() || meta.title;
      setStatus("Creating " + name);
      const pl = await createPlaylistWithTracks(name, uris, token);
      PLAYLISTS[name] = { id: pl.id, label: name, image: null };
      SOURCE_CANDIDATES.push(name);
      const trackMap = new Map();
      for (const u of uris) {
        if (trackMap.has(u)) continue;
        const t = findCachedTrack(u);
        if (t) trackMap.set(u, t);
      }
      const built = [...trackMap.values()];
      cache[name] = {
        id: pl.id,
        label: name,
        image: built.length && built[0].image ? built[0].image : null,
        loadedAt: Date.now(),
        tracks: built,
        partial: false
      };
      writeCache();
      try { await syncPlaylistToWix(name, token); } catch (_) {}
      clearPlaylistsCache();
      renderSourceGrid();
      renderGrid();
      closeToolPanel();
      setFeedback("created " + name + " · " + built.length + " songs", false);
      setStatus("");
    } catch (err) {
      create.disabled = false;
      create.textContent = "Create playlist";
      setFeedback(err.message, true);
    }
  });
  updatePreview();
  document.getElementById("tool-panel-host").appendChild(panel);
}

function paintToolsBadge() {
  const btn = document.querySelector('[data-tool="tools"]');
  if (!btn) return;
  
  
  const existing = btn.querySelector(".hierarchy-dot");
  if (hierarchyOn() && !existing) {
    const dot = document.createElement("span");
    dot.className = "hierarchy-dot";
    dot.title = "Hierarchy cascade is ON";
    btn.appendChild(dot);
  } else if (!hierarchyOn() && existing) {
    existing.remove();
  }
}

function buildAuthBox() {
  el.auth.innerHTML = "";
    const logo = document.createElement("span");
  logo.className = "auth-logo";
  logo.innerHTML = LOGO_SVG;
  const h2 = document.createElement("h2");
  h2.textContent = "spotifylter";
  const sub = document.createElement("p");
  sub.className = "auth-sub";
  sub.textContent = "Connect your Spotify account to begin.";
  const label = document.createElement("label");
  label.textContent = "Client ID";
  const clientInput = document.createElement("input");
  clientInput.id = "client-id-input";
  clientInput.type = "text";
  clientInput.placeholder = "Paste your Spotify Client ID";
  clientInput.autocomplete = "off";
  const help = document.createElement("details");
  help.className = "auth-help";
  const summary = document.createElement("summary");
  summary.textContent = "How do I get a Client ID?";
  const steps = document.createElement("ol");
  const li1 = document.createElement("li");
  li1.innerHTML = 'Open <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener">developer.spotify.com/dashboard</a> and log in with the same Spotify account you use here.';
  const li2 = document.createElement("li");
  li2.textContent = "Click Create app. Give it any name and description.";
  const li3 = document.createElement("li");
  li3.textContent = "In Redirect URIs, paste exactly the address shown below. Then select Web API and save.";
  const li4 = document.createElement("li");
  li4.textContent = "Open the app and copy its Client ID into the field above.";
  steps.append(li1, li2, li3, li4);
  help.append(summary, steps);
  const redirectLabel = document.createElement("label");
  redirectLabel.textContent = "Redirect URI (must be registered)";
  const redirect = document.createElement("code");
  redirect.id = "redirect-uri-display";
  redirect.className = "auth-redirect";
  const loginBtn = document.createElement("button");
  loginBtn.id = "login-btn";
  loginBtn.type = "button";
  loginBtn.className = "auth-login";
  loginBtn.innerHTML = '<i class="fa-brands fa-spotify"></i><span>Log in with Spotify</span>';
  const tokenDetails = document.createElement("details");
  tokenDetails.className = "auth-help";
  const tokenSummary = document.createElement("summary");
  tokenSummary.textContent = "Advanced: paste an access token";
  const tokenInput = document.createElement("input");
  tokenInput.id = "token-input";
  tokenInput.type = "password";
  tokenInput.placeholder = "Access token or JSON";
  const tokenBtn = document.createElement("button");
  tokenBtn.id = "token-btn";
  tokenBtn.type = "button";
  tokenBtn.textContent = "Use token";
  tokenDetails.append(tokenSummary, tokenInput, tokenBtn);
  el.auth.append(logo, h2, sub, label, clientInput, help, redirectLabel, redirect, loginBtn, tokenDetails);
  el.clientId = clientInput;
  el.redirect = redirect;
  el.login = loginBtn;
  el.token = tokenInput;
  el.tokenBtn = tokenBtn;
}

function apiLog() {
  const raw = localStorage.getItem(API_LOG_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch (_) { return []; }
}

function apiStats() {
  const now = Date.now();
  const log = apiLog().filter(t => t > now - 3 * 60 * 60 * 1000);
  return {
    m15: log.filter(t => t > now - 15 * 60 * 1000).length,
    h1: log.filter(t => t > now - 60 * 60 * 1000).length,
    h3: log.length
  };
}

function apiLogPush() {
  const now = Date.now();
  const log = apiLog().filter(t => t > now - 3 * 60 * 60 * 1000);
  log.push(now);
  localStorage.setItem(API_LOG_KEY, JSON.stringify(log));
  paintApiCounter();
}

function apiHoldUntil() {
  return Number(localStorage.getItem(API_HOLD_KEY) || 0);
}

let pendingReplayTimer = null;
let lastAutoHidden = null;

function schedulePendingReplay() {
  clearTimeout(pendingReplayTimer);
  if (!pendingQueue.length) return;
  const remaining = apiHoldUntil() - Date.now();
  const delay = remaining > 0 ? remaining + 1000 : 1000;
  pendingReplayTimer = setTimeout(() => {
    if (pendingQueue.length && apiHoldUntil() <= Date.now()) {
      replayPending();
    }
  }, delay);
}

async function undoLastHide() {
  if (!lastAutoHidden) {
    setFeedback("Nothing to undo", false);
    return;
  }
  const { playlistName, track } = lastAutoHidden;
  lastAutoHidden = null;
  setHidden(playlistName, track.uri, false);
  if (sourceName() !== playlistName) {
    await selectSource(playlistName, false);
  }
  try {
    const token = await getToken();
    currentTrack = track;
    await playFromGesture(track, token);
    updatePlayerBar(track);
    renderTracks();
    highlightTracks();
    markGridHasTrack();
    paintVersionsButton();
    setFeedback("Restored " + track.name, false);
  } catch (err) {
    setFeedback(err.message, true);
  }
}

function apiHoldSet(seconds) {
  const until = Date.now() + seconds * 1000;
  localStorage.setItem(API_HOLD_KEY, String(until));
  paintApiCounter();
  schedulePendingReplay();
  getToken()
    .then(token => fetch(HOLD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token, holdUntil: until })
    }))
    .catch(() => {});
}

async function syncHold(token) {
  const res = await fetch(HOLD_URL + "?accessToken=" + encodeURIComponent(token));
  if (!res.ok) return;
  const data = await res.json();
  if (data.error) return;
  const remote = Number(data.holdUntil) || 0;
  const local = apiHoldUntil();
  if (remote > local) {
    localStorage.setItem(API_HOLD_KEY, String(remote));
    paintApiCounter();
  } else if (local > remote) {
    fetch(HOLD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token, holdUntil: local })
    }).catch(() => {});
  }
}

function installApiCounter() {
  const original = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    const counted = url.indexOf("https://api.spotify.com/") === 0;
    if (counted && OFFLINE) {
      console.warn("[api] OFFLINE — blocked:", url);
      return new Response(JSON.stringify({ error: { status: 503, message: "OFFLINE" } }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (counted) apiLogPush();
    const res = await original(input, init);
    if (counted && res.status === 429) {
      const ra = Number(res.headers.get("Retry-After"));
      if (Number.isFinite(ra) && ra > 0) apiHoldSet(ra);
    }
    return res;
  };
}

function buildApiCounter() {
  const wrap = document.createElement("div");
  wrap.className = "api-counter";
  const pill = document.createElement("span");
  pill.className = "api-pill";
  wrap.appendChild(pill);
  const paint = () => {
    const hold = apiHoldUntil() - Date.now();
    if (hold > 0) {
      pill.textContent = "HOLD " + Math.ceil(hold / 60000) + "m";
      pill.className = "api-pill hold";
      pill.title = "Spotify quota hold active. Another request can extend it.";
      return;
    }
    const s = apiStats();
    const pct = s.m15 / API_BUDGET_15M;
    pill.textContent = s.m15 + " / " + API_BUDGET_15M;
    pill.className = "api-pill" + (pct >= 0.8 ? " danger" : pct >= 0.5 ? " warn" : "");
    pill.title = "15m: " + s.m15 + " · 1h: " + s.h1 + " · 3h: " + s.h3;
  };
  paint();
  paintApiCounter = paint;
  setInterval(paint, 5000);
  return wrap;
}

async function startOfflineSession() {
  showApp();
  setStatus("OFFLINE - Reading from Wix...");
  readCache();

  let token = null;
  try {
    const rawToken = localStorage.getItem("sp_token");
    if (rawToken) {
      const t = JSON.parse(rawToken);
      token = t.access;
    }
  } catch (_) {}

  if (token) {
    try {
      const localRes = await fetch(LOCAL_PLAYLISTS_URL + "?accessToken=" + encodeURIComponent(token));
      if (localRes.ok) {
        const data = await localRes.json();
        if (!data.error && data.items) {
          for (const item of data.items) {
            const label = item.label;
            PLAYLISTS[label] = { id: item.playlistId, label, image: item.image, local: true };
            if (!SOURCE_CANDIDATES.includes(label)) SOURCE_CANDIDATES.push(label);
            cache[label] = {
              id: item.playlistId,
              label,
              image: item.image,
              loadedAt: item.loadedAt,
              total: item.tracks.length,
              tracks: item.tracks,
              local: true
            };
          }
        }
      }
    } catch (e) {
      console.warn("[offline] Wix local playlists fetch failed, falling back to cache", e);
    }

    try {
      const indexRes = await fetch(PLAYLIST_DATA_INDEX_URL + "?accessToken=" + encodeURIComponent(token));
      if (indexRes.ok) {
        const indexJson = await indexRes.json();
        if (!indexJson.error && indexJson.items) {
          for (const item of indexJson.items) {
            const name = Object.keys(PLAYLISTS).find(n => PLAYLISTS[n].id === item.playlistId);
            if (name && (!cache[name] || Number(cache[name].loadedAt || 0) < Number(item.loadedAt || 0))) {
              const dataRes = await fetch(PLAYLIST_DATA_URL + "?accessToken=" + encodeURIComponent(token) + "&playlistId=" + encodeURIComponent(item.playlistId));
              if (dataRes.ok) {
                const dataJson = await dataRes.json();
                if (!dataJson.error && dataJson.data) {
                  const parsed = JSON.parse(dataJson.data);
                  if (parsed && Array.isArray(parsed.tracks)) {
                    cache[name] = {
                      id: item.playlistId,
                      label: parsed.label || name,
                      image: parsed.image || null,
                      loadedAt: Number(parsed.loadedAt) || Date.now(),
                      total: parsed.total || parsed.tracks.length,
                      snapshot_id: parsed.snapshot_id || null,
                      tracks: parsed.tracks
                    };
                  }
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("[offline] Wix playlist data fetch failed, falling back to cache", e);
    }
  }

  writeCache();

  const cachedNames = Object.keys(cache);
  if (cachedNames.length > 0) {
    for (const name of cachedNames) {
      if (!PLAYLISTS[name]) {
        PLAYLISTS[name] = { id: cache[name].id || ("offline_" + name), label: cache[name].label || name, image: cache[name].image || null, local: cache[name].local || true };
      }
      if (!SOURCE_CANDIDATES.includes(name)) {
        SOURCE_CANDIDATES.push(name);
      }
    }
  }

  if (!SOURCE_CANDIDATES.length) {
    SOURCE_CANDIDATES.push("playlist");
  }
  const defaultSource = SOURCE_CANDIDATES.includes(sourceName()) ? sourceName() : SOURCE_CANDIDATES[0];
  localStorage.setItem(SOURCE_KEY, defaultSource);
  if (!currentTrack && cache[defaultSource] && cache[defaultSource].tracks && cache[defaultSource].tracks.length) {
    currentTrack = cache[defaultSource].tracks[0];
    updatePlayerBar(currentTrack);
    applyAdaptiveColor(currentTrack);
  }
  renderGrid();
  renderSourceGrid();
  renderTracks();
  highlightTracks();
  paintVersionsButton();
  const sourcesLabel = document.getElementById("sources-label");
  if (sourcesLabel) sourcesLabel.textContent = sourceName();
  setStatus("OFFLINE - Ready");
}

async function playFirstInSource() {
  changedPlayingNow();
  const name = sourceName();
  const tracks = queueTracks(name);
  const candidate = playAll
    ? tracks[0]
    : (tracks.find(t => !isHidden(name, t.uri)) || tracks[0]);
  if (!candidate) {
    setFeedback("ERROR no tracks", true);
    return;
  }
  try {
    const token = !OFFLINE ? await getToken() : "";
    currentTrack = candidate;
    await playFromGesture(candidate, token);
    updatePlayerBar(candidate);
    renderTracks();
    highlightTracks();
    markGridHasTrack();
  } catch (err) {
    setFeedback(err.message, true);
  }
}

async function boot() {
  installApiCounter();
  renderGrid();
  buildPlayer();
  buildHeader();
  buildAuthBox();
  el.redirect.textContent = redirectUri();
  el.clientId.value = getClientId();
  if (!document.getElementById("fa-css")) {
    const fa = document.createElement("link");
    fa.id = "fa-css";
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
    document.head.appendChild(fa);
  }
  el.refresh.style.display = "none";

  const songsRow = document.createElement("div");
  songsRow.className = "songs-row";

  const songsToggle = document.createElement("button");
  songsToggle.type = "button";
  songsToggle.className = "outline-btn";
  songsToggle.innerHTML = '<i class="fa-solid fa-list-ul"></i><span>Songs</span>';

const skipToggle = document.createElement("button");
  skipToggle.type = "button";
  skipToggle.className = "outline-btn";
  skipToggle.innerHTML = '<i class="fa-solid fa-filter"></i><span>Filter</span>';
  
  const paintSkip = () => {
    skipToggle.classList.toggle("on", hideOnSkip);
    if (window.paintPlayerFilter) window.paintPlayerFilter();
  };
  
  paintSkip();
  
  skipToggle.addEventListener("click", () => {
    hideOnSkip = !hideOnSkip;
    localStorage.setItem("sp_hide_on_skip", hideOnSkip ? "1" : "0");
    paintSkip();
  });

  window.syncAllFilterButtons = () => {
    skipToggle.classList.toggle("on", hideOnSkip);
    if (window.paintPlayerFilter) window.paintPlayerFilter();
  };
  
  window.paintPlayerFilter();

  const playerZoom = document.createElement("div");
  playerZoom.className = "zoom-group";
  const playerZoomIcon = document.createElement("i");
  playerZoomIcon.className = "fa-solid fa-music";
  playerZoomIcon.title = "Player size";
  const pDown = document.createElement("button");
  pDown.type = "button";
  pDown.textContent = "-";
  const pUp = document.createElement("button");
  pUp.type = "button";
  pUp.textContent = "+";
  const pKey = "sp_player_scale";
  pDown.addEventListener("click", () => {
    const v = Math.max(0.6, Number(localStorage.getItem(pKey) || 1) - 0.1);
    localStorage.setItem(pKey, String(v));
    applyPlayerScale(v);
  });
  pUp.addEventListener("click", () => {
    const v = Math.min(2, Number(localStorage.getItem(pKey) || 1) + 0.1);
    localStorage.setItem(pKey, String(v));
    applyPlayerScale(v);
  });
  playerZoom.append(playerZoomIcon, pDown, pUp);
  applyPlayerScale(localStorage.getItem(pKey) || 1);

  const gridZoom = document.createElement("div");
  gridZoom.className = "zoom-group";
  const gridZoomIcon = document.createElement("i");
  gridZoomIcon.className = "fa-solid fa-table-cells";
  gridZoomIcon.title = "Grid size";
  const gDown = document.createElement("button");
  gDown.type = "button";
  gDown.textContent = "-";
  const gUp = document.createElement("button");
  gUp.type = "button";
  gUp.textContent = "+";
  const gKey = "sp_grid_scale";
  gDown.addEventListener("click", () => {
    const v = Math.max(0.6, Number(localStorage.getItem(gKey) || 1) - 0.1);
    localStorage.setItem(gKey, String(v));
    applyGridScale(v);
  });
  gUp.addEventListener("click", () => {
    const v = Math.min(2, Number(localStorage.getItem(gKey) || 1) + 0.1);
    localStorage.setItem(gKey, String(v));
    applyGridScale(v);
  });
  gridZoom.append(gridZoomIcon, gDown, gUp);
  applyGridScale(localStorage.getItem(gKey) || 1);

  songsRow.append(songsToggle, skipToggle, playerZoom, gridZoom);

  const songsTools = document.createElement("div");
  songsTools.className = "songs-tools";

  const playSourceBtn = document.createElement("button");
  playSourceBtn.type = "button";
  playSourceBtn.className = "np-toggle";
  playSourceBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  playSourceBtn.title = "Play first song in playlist";
  playSourceBtn.addEventListener("click", () => playFirstInSource());

  const unhideBtn = document.createElement("button");
  unhideBtn.type = "button";
  unhideBtn.className = "outline-btn-scndry";
  unhideBtn.innerHTML = '<i class="fa-solid fa-eye"></i><span>Unfilter all</span>';
  unhideBtn.addEventListener("click", () => unhideAll());

  const undoBtn = document.createElement("button");
  undoBtn.type = "button";
  undoBtn.className = "outline-btn-scndry";
  undoBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i><span>Undo</span>';
  undoBtn.title = "Undo last hidden song (Ctrl+Z)";
  undoBtn.addEventListener("click", () => undoLastHide());

  const reverseBtn = document.createElement("button");
  reverseBtn.type = "button";
  reverseBtn.className = "outline-btn-scndry";
  const paintReverse = () => {
    reverseBtn.classList.toggle("on", reverseOrder);
    reverseBtn.innerHTML = '<i class="fa-solid fa-arrow-down-wide-short"></i><span>Reverse</span>';
  };
  paintReverse();
  reverseBtn.addEventListener("click", () => {
    reverseOrder = !reverseOrder;
    localStorage.setItem("sp_reverse", reverseOrder ? "1" : "0");
    paintReverse();
    renderTracks();
    highlightTracks();
    resetShuffleQueue(sourceName(), currentTrack && currentTrack.uri);
  });

  const spacer = document.createElement("span");
  spacer.className = "songs-tools-spacer";

  const sKey = "sp_songs_scale";
  const applyZoom = () => {
    const v = Number(localStorage.getItem(sKey) || 1);
    el.list.style.gridTemplateColumns = `repeat(auto-fill, minmax(${Math.round(160 * v)}px, 1fr))`;
  };
  const sDown = document.createElement("button");
  sDown.type = "button";
  sDown.textContent = "-";
  const sUp = document.createElement("button");
  sUp.type = "button";
  sUp.textContent = "+";
  sDown.addEventListener("click", () => {
    localStorage.setItem(sKey, String(Math.max(0.6, Number(localStorage.getItem(sKey) || 1) - 0.1)));
    applyZoom();
  });
  sUp.addEventListener("click", () => {
    localStorage.setItem(sKey, String(Math.min(2, Number(localStorage.getItem(sKey) || 1) + 0.1)));
    applyZoom();
  });
  const songsZoom = document.createElement("div");
  songsZoom.className = "zoom-group";
  songsZoom.append(sDown, sUp);
  applyZoom();

  const songsFilters = document.createElement("div");
  songsFilters.className = "songs-filters";

  const filterWrap = document.createElement("div");
  filterWrap.className = "songs-filter-wrap";
  const filterInput = document.createElement("input");
  filterInput.type = "text";
  filterInput.placeholder = "Filter name or artist";
  filterInput.className = "songs-filter-input";
  filterInput.value = songFilter;
  let filterTimer = null;
  filterInput.addEventListener("input", () => {
    songFilter = filterInput.value;
    clearTimeout(filterTimer);
    filterTimer = setTimeout(renderTracks, 150);
  });
  const filterClear = document.createElement("button");
  filterClear.type = "button";
  filterClear.className = "songs-filter-clear";
  filterClear.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  filterClear.title = "Clear filter";
  filterClear.addEventListener("click", () => {
    filterInput.value = "";
    songFilter = "";
    renderTracks();
    paintQueue();
    setFeedback("filter cleared", false);
  });
  filterWrap.append(filterInput, filterClear);

  const hiddenSelect = document.createElement("select");
  hiddenSelect.className = "songs-filter-select";
  hiddenSelect.append(new Option("All", "all"), new Option("Unfiltered", "unhidden"), new Option("Filtered", "hidden"));
  hiddenSelect.value = songHiddenFilter;
  hiddenSelect.addEventListener("change", () => {
    songHiddenFilter = hiddenSelect.value;
    renderTracks();
  });

  const sortSelect = document.createElement("select");
  sortSelect.className = "songs-filter-select";
  for (const [v, label] of [["default", "Playlist order"], ["name", "Name"], ["artist", "Artist"], ["durationAsc", "Shortest"], ["durationDesc", "Longest"]]) {
    sortSelect.append(new Option(label, v));
  }
  sortSelect.value = songSort;
  sortSelect.addEventListener("change", () => {
    songSort = sortSelect.value;
    renderTracks();
  });

  const queueToggle = document.createElement("button");
  queueToggle.type = "button";
  queueToggle.className = "outline-btn-scndry";
  const paintQueue = () => {
    queueToggle.classList.toggle("on", filterQueue);
    queueToggle.innerHTML = '<i class="fa-solid fa-list-check"></i><span>Queue filter</span>';
    queueToggle.title = filterQueue ? "Next/prev walk only filtered songs" : "Next/prev walk the full playlist";
  };
  paintQueue();
  queueToggle.addEventListener("click", () => {
    filterQueue = !filterQueue;
    localStorage.setItem("sp_filter_queue", filterQueue ? "1" : "0");
    paintQueue();
  });

  const playAllBtn = document.createElement("button");
  playAllBtn.type = "button";
  playAllBtn.className = "outline-btn-scndry";
  const paintPlayAll = () => {
    playAllBtn.classList.toggle("on", playAll);
    playAllBtn.innerHTML = '<i class="fa-solid fa-eye"></i><span>Play filtered</span>';
    playAllBtn.title = playAll ? "Playing all tracks (hidden included)" : "Skipping filtered tracks";
  };
  paintPlayAll();
  playAllBtn.addEventListener("click", () => {
    playAll = !playAll;
    localStorage.setItem("sp_play_all", playAll ? "1" : "0");
    paintPlayAll();
    renderTracks();
  });

  songsFilters.append(filterWrap, hiddenSelect, sortSelect, queueToggle, playAllBtn);

  songsTools.append(playSourceBtn, unhideBtn, undoBtn, reverseBtn, spacer, songsZoom);

  const songsHeader = document.createElement("div");
  songsHeader.className = "songs-header";
  songsHeader.append(songsRow, songsTools, songsFilters);

  el.list.style.display = "none";
  songsTools.style.display = "none";
  songsFilters.style.display = "none";
  songsToggle.addEventListener("click", () => {
    const open = el.list.style.display === "none";
    setTracksOpen(open);
    el.list.style.display = open ? "grid" : "none";
    songsTools.style.display = open ? "flex" : "none";
    songsFilters.style.display = open ? "flex" : "none";
    songsToggle.classList.toggle("active", open);
  });

  const songsPanel = document.createElement("div");
  songsPanel.className = "songs-panel";
  el.list.parentElement.insertBefore(songsPanel, el.list);
  songsPanel.appendChild(songsHeader);
  songsPanel.appendChild(el.list);

  const toolbar = document.createElement("div");
  toolbar.className = "ui-toolbar";
  el.refresh.parentElement.appendChild(toolbar);

  el.login.addEventListener("click", async () => {
    try {
      await beginLogin(el.clientId.value.trim());
    } catch (err) {
      showAuth(err.message);
    }
  });
  el.tokenBtn.addEventListener("click", async () => {
    try {
      await usePastedToken(el.token.value);
    } catch (err) {
      localStorage.removeItem("sp_token");
      showAuth(err.message);
    }
  });

  const toolsHost = document.createElement("div");
  toolsHost.id = "tools-host";
  const toolsGrid = document.createElement("div");
  toolsGrid.id = "tools-grid";
  const panelHost = document.createElement("div");
  panelHost.id = "tool-panel-host";
  toolsHost.append(toolsGrid, panelHost);
  songsPanel.parentElement.insertBefore(toolsHost, songsPanel);
  createSongsPanelDock()

  const toolsBtn = document.createElement("button");
  toolsBtn.type = "button";
  toolsBtn.className = "outline-btn";
  toolsBtn.innerHTML = '<i class="fa-solid fa-toolbox"></i><span> Tools</span>';
  toolsBtn.dataset.tool = "tools";
  const paintTools = () => toolsBtn.classList.toggle("active", !toolsCollapsed);
  paintTools();
  toolsBtn.addEventListener("click", () => {
    toolsCollapsed = !toolsCollapsed;
    localStorage.setItem("sp_tools_collapsed", toolsCollapsed ? "1" : "0");
    renderToolsGrid();
    paintTools();
  });
  songsRow.appendChild(toolsBtn);
  renderToolsGrid();
  paintToolsBadge();

  const reloadBtn = document.createElement("button");
  reloadBtn.type = "button";
  reloadBtn.className = "outline-btn";
  reloadBtn.innerHTML = '<i class="fa-solid fa-rotate"></i><span> Reload grid</span>';
  reloadBtn.addEventListener("click", async () => {
    reloadBtn.disabled = true;
    try {
      await reloadGridPlaylists();
    } catch (err) {
      setFeedback(err.message, true);
    } finally {
      reloadBtn.disabled = false;
    }
  });
  songsRow.appendChild(reloadBtn);

  toolbar.remove();

  const sourceContainer = document.createElement("div");
  sourceContainer.id = "source-container";
  sourceContainer.style.display = "none";
  sourceContainer.appendChild(buildSourcesBar());
  el.source.parentElement.insertBefore(sourceContainer, el.source);

  paintTargetBar = buildTargetBar();
  paintTargetBar();
  for (const node of document.querySelectorAll("label, h2, h3, h4, p")) {
    if (node.closest("#app-header")) continue;
    if (node.textContent.trim() === "Source" || node.textContent.trim() === "Add current track") node.style.display = "none";
  }

  const bar = el.progress.parentElement || el.progress;
  bar.style.cursor = "pointer";
  bar.addEventListener("click", async e => {
    if (!player || !currentTrack) return;
    const rect = bar.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const duration = currentTrack.durationMs || (lastState && lastState.duration) || 1;
    await player.seek(Math.floor(fraction * duration));
  });
  try {
    readCache();
    
    const savedHue = localStorage.getItem("sp_theme_hue");
    const adaptiveOn = localStorage.getItem("sp_adaptive_color") === "1";
    if (adaptiveOn && currentTrack && currentTrack.image) {
      applyAdaptiveColor(currentTrack);
    } else if (savedHue !== null) {
      applyHue(Number(savedHue));
    }

    if (OFFLINE) {
      startOfflineSession();
      const container = document.getElementById("source-container");
      if (container) container.style.display = "block";
      return;
    }
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState !== "visible") return;
      if (pendingQueue.length && apiHoldUntil() <= Date.now()) {
        replayPending();
      } else {
        schedulePendingReplay();
      }
      try {
        await reconcileDevice();
      } catch (err) {
        setFeedback(err.message, true);
      }
    });
    document.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        undoLastHide();
      }
    });
    document.addEventListener("click", e => {
      const panel = document.getElementById("versions-panel");
      if (!panel) return;
      if (panel.contains(e.target)) return;
      if (e.target.closest("#np-versions-btn")) return;
      closeVersionsPanel();
    });
    let token = null;
    try {
      token = await handleCallback();
    } catch (err) {
      showAuth(err.message);
      return;
    }
    if (!token) token = await getToken();
    if (!token) {
      showAuth("Log in with your Client ID");
      return;
    }
    await startSession(token);
  } catch (err) {
    localStorage.removeItem("sp_token");
    showAuth(err.message);
  }
}

boot();
