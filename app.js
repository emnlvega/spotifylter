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

const LOGO_SVG = '<svg viewBox="0 0 3994 1883" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1,0,0,1,-100.338058,-100.340635)"><g transform="matrix(4.166667,0,0,4.166667,0,0)"><path d="M202.186,109.034L150.19,109.034C149.678,109.034 149.172,108.991 148.675,108.907L148.675,119.385C148.675,135.561 135.561,148.675 119.385,148.675L109.034,148.675L109.034,185.994L445.465,185.994C460.482,185.994 472.498,197.219 472.498,210.855L472.498,289.145C472.498,302.781 460.482,314.006 445.465,314.006L432.857,314.006L432.857,351.325L443.208,351.325C459.385,351.325 472.498,364.438 472.498,380.615L472.498,443.207C472.498,459.384 459.385,472.498 443.208,472.498L380.615,472.498C364.439,472.498 351.325,459.384 351.325,443.207L351.325,432.488C350.494,432.73 349.637,432.856 348.76,432.856L301.234,432.856L301.234,451.057C301.234,464.693 289.218,475.918 274.201,475.918L54.535,475.918C39.518,475.918 27.502,464.693 27.502,451.057L27.502,372.767C27.502,359.131 39.518,347.905 54.535,347.905L274.201,347.905C289.218,347.905 301.234,359.131 301.234,372.767L301.234,390.966L348.76,390.966C349.637,390.966 350.494,391.092 351.325,391.334L351.325,380.615C351.325,364.438 364.439,351.325 380.615,351.325L390.967,351.325L390.967,314.006L51.115,314.006C36.097,314.006 24.081,302.781 24.081,289.145L24.081,210.855C24.081,197.219 36.097,185.994 51.115,185.994L67.143,185.994L67.143,148.675L56.792,148.675C40.615,148.675 27.502,135.561 27.502,119.385L27.502,56.792C27.502,40.616 40.615,27.502 56.792,27.502L119.385,27.502C135.561,27.502 148.675,40.616 148.675,56.792L148.675,67.27C149.172,67.186 149.678,67.143 150.19,67.143L202.186,67.143L202.186,48.943C202.186,35.307 214.202,24.082 229.22,24.082L448.885,24.082C463.903,24.082 475.919,35.307 475.919,48.943L475.919,127.233C475.919,140.869 463.903,152.095 448.885,152.095L229.22,152.095C214.202,152.095 202.186,140.869 202.186,127.233L202.186,109.034ZM119.385,52.647L56.792,52.647C54.503,52.647 52.647,54.503 52.647,56.792L52.647,119.385C52.647,121.674 54.503,123.53 56.792,123.53L119.385,123.53C121.674,123.53 123.529,121.674 123.529,119.385L123.529,56.792C123.529,54.503 121.674,52.647 119.385,52.647ZM443.208,376.47L380.615,376.47C378.326,376.47 376.471,378.326 376.471,380.615L376.471,443.207C376.471,445.497 378.326,447.352 380.615,447.352L443.208,447.352C445.497,447.352 447.353,445.497 447.353,443.207L447.353,380.615C447.353,378.326 445.497,376.47 443.208,376.47Z" fill="currentColor"/></g><g transform="matrix(1,0,0,1,-166.90289,0)"><path d="M2542.786,774.973L2542.786,633.728L2490.253,633.728C2427.681,633.728 2377.614,586.954 2377.614,530.137L2377.614,203.931C2377.614,147.114 2427.681,100.341 2490.253,100.341L4147.632,100.341C4210.204,100.341 4260.271,147.114 4260.271,203.931L4260.271,530.137C4260.271,586.954 4210.204,633.728 4147.632,633.728L2717.331,633.728L2717.331,774.973L3405.527,774.973C3468.099,774.973 3518.166,821.746 3518.166,878.564L3518.166,1204.77C3518.166,1261.587 3468.099,1308.36 3405.527,1308.36L2717.331,1308.36L2717.331,1455.923C2717.331,1458.595 2717.22,1461.239 2717.002,1463.852L2760.46,1463.852C2827.862,1463.852 2882.502,1518.491 2882.502,1585.894L2882.502,1846.698C2882.502,1914.1 2827.862,1968.741 2760.46,1968.741L2499.655,1968.741C2432.254,1968.741 2377.614,1914.1 2377.614,1846.698L2377.614,1585.894C2377.614,1518.491 2432.254,1463.852 2499.655,1463.852L2543.115,1463.852C2542.897,1461.239 2542.786,1458.595 2542.786,1455.923L2542.786,1308.36L2490.253,1308.36C2427.681,1308.36 2377.614,1261.587 2377.614,1204.77L2377.614,878.564C2377.614,821.746 2427.681,774.973 2490.253,774.973L2542.786,774.973ZM2760.46,1568.624L2499.655,1568.624C2490.118,1568.624 2482.387,1576.357 2482.387,1585.894L2482.387,1846.698C2482.387,1856.236 2490.118,1863.968 2499.655,1863.968L2760.46,1863.968C2769.998,1863.968 2777.73,1856.236 2777.73,1846.698L2777.73,1585.894C2777.73,1576.357 2769.998,1568.624 2760.46,1568.624Z" fill="currentColor"/></g></g></svg>';

const TOOLS = [
  { id: "manual",    icon: "fa-paste",        label: "Manual",    desc: "Paste track links" },
  { id: "combine",   icon: "fa-circle-plus",  label: "Combine",   desc: "Union, no duplicates" },
  { id: "subtract",  icon: "fa-circle-minus", label: "Subtract",  desc: "Origin minus selected" },
  { id: "intersect", icon: "fa-circle-nodes", label: "Intersect", desc: "Only songs in all selected" },
  { id: "dedupe",    icon: "fa-clone",        label: "Dedupe",    desc: "Copy without duplicates" },
  { id: "hierarchy", icon: "fa-sitemap", label: "Hierarchy", desc: "Auto-add to linked playlists" }
];

const PLAYLISTS = {
  dscvry:               { id: "ERROR", label: "dscvry" },
  instnrcrush:          { id: "ERROR", label: "instnrcrush" },
  vygr:                 { id: "ERROR", label: "vygr" },
  "vygr + instnrcrush": { id: "ERROR", label: "vygr + instnrcrush" },
  bynd:                 { id: "ERROR", label: "bynd" },
  gvlfbcktmsc:          { id: "ERROR", label: "gvlfbcktmsc" },
  lsyrslftdnc:          { id: "ERROR", label: "lsyrslftdnc" },
  "nu disc":            { id: "ERROR", label: "nu disc" },
  electrnc:             { id: "ERROR", label: "electrnc" },
  wave:                 { id: "ERROR", label: "wave" },
  hideout:              { id: "ERROR", label: "hideout" },
  tieduprightnow:       { id: "ERROR", label: "tieduprightnow" },
  flashbacks:           { id: "ERROR", label: "flashbacks" }
};

const SOURCE_CANDIDATES = ["dscvry", "vygr", "instnrcrush", "bynd", "gvlfbcktmsc", "lsyrslftdnc"];
const TARGET_GRID = ["vygr", "instnrcrush", "bynd", "nu disc", "electrnc", "wave", "hideout", "tieduprightnow", "flashbacks"];

const RULES = {
  dscvry:               [],
  instnrcrush:          ["vygr + instnrcrush"],
  vygr:                 ["vygr + instnrcrush"],
  "vygr + instnrcrush": ["bynd"],
  bynd:                 ["gvlfbcktmsc"],
  gvlfbcktmsc:          ["lsyrslftdnc"],
  lsyrslftdnc:          [],
  "nu disc":            ["gvlfbcktmsc"],
  electrnc:             ["gvlfbcktmsc"],
  wave:                 ["gvlfbcktmsc"],
  hideout:              [],
  tieduprightnow:       [],
  flashbacks:           []
};

const CACHE_KEY = "sp_cache_v3";
const HIDDEN_KEY = "sp_hidden";
const GRID_HIDE_KEY = "sp_grid_hidden";
const EXTRA_SOURCES = { "discover weekly": "37i9dQZEVXcHuSzt0MWVeH" };
const SOURCE_KEY = "sp_source";
const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="#2a3140"/></svg>'
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
let sourcesCollapsed = localStorage.getItem("sp_sources_collapsed") === "1";
let toolsCollapsed = localStorage.getItem("sp_tools_collapsed") !== "0";
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
let paintTargetBar = () => {};
let paintApiCounter = () => {};

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

async function ensurePlaylists(token) {
  const cached = readPlaylistsCache();
  if (cached) return cached;
  const found = await discoverPlaylists(token);
  writePlaylistsCache(found);
  return found;
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
  const targets = new Set(["dscvry"]);
  const stack = [selected];
  while (stack.length) {
    const node = stack.pop();
    if (targets.has(node)) continue;
    targets.add(node);
    for (const next of (RULES[node] || [])) stack.push(next);
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
  if (player) await player.activateElement();
  pendingTrackUri = track.uri;
  pendingTrackUriAt = Date.now();
  try {
    await playTrack(track.uri, token, positionMs);
    pushRecent(track);
  } catch (err) {
    pendingTrackUri = null;
    pendingTrackUriAt = 0;
    throw err;
  }
  setTimeout(async () => {
    if (pendingTrackUri !== track.uri) return;
    const api = await fetchPlaybackState(token);
    if (!api) return;
    pendingTrackUri = null;
    pendingTrackUriAt = 0;
    if (api.uri === track.uri) return;
    const cachedHit = findCachedTrack(api.uri);
    const apiRef = {
      uri: api.uri,
      name: api.name,
      artists: api.artists,
      durationMs: api.durationMs,
      isrc: cachedHit && cachedHit.isrc ? cachedHit.isrc : null
    };
    if (currentTrack && sameRecording(currentTrack, apiRef)) {
      sdkStaleUri = api.uri;
    } else {
      const src = sourceName();
      const srcCache = cache[src];
      const srcMatch = srcCache && srcCache.tracks && srcCache.tracks.find(t => sameRecording(t, apiRef) || t.uri === api.uri);
      if (srcMatch) {
        currentTrack = srcMatch;
      } else if (!currentTrack) {
        currentTrack = { ...apiRef, image: api.image };
      } else {
        sdkStaleUri = api.uri;
      }
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
  }, 800);
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
  if (saved && SOURCE_CANDIDATES.includes(saved)) return saved;
  return SOURCE_CANDIDATES[0];
}

function sourceName() {
  const saved = localStorage.getItem(SOURCE_KEY);
  if (saved && SOURCE_CANDIDATES.includes(saved)) return saved;
  return SOURCE_CANDIDATES[0];
}

function renderSourceGrid() {
  let grid = document.getElementById("source-grid");
  if (!grid) {
    grid = document.createElement("div");
    grid.id = "source-grid";
    el.source.parentElement.insertBefore(grid, el.source);
  }
  grid.innerHTML = "";
  const saved = sourceName();
  for (const name of SOURCE_CANDIDATES) {
    const entry = PLAYLISTS[name] || cache[name];
    if (!entry) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.name = name;
    btn.className = "source-tile" + (name === saved ? " active" : "");
    const img = document.createElement("img");
    img.alt = "";
    bindImg(img, entry.image || (cache[name] && cache[name].image));
    const label = document.createElement("span");
    label.textContent = entry.label || name;
    btn.append(img, label);
    btn.title = "Click to load · double-click to play";
    btn.addEventListener("click", () => selectSource(name));
    btn.addEventListener("dblclick", () => selectSource(name, true));
    grid.appendChild(btn);
  }
  el.source.style.display = "none";
  grid.style.display = sourcesCollapsed ? "none" : "grid";
  
}

async function syncPlaylist(name, token) {
  const entry = cache[name];
  if (!entry || !entry.id) {
    await loadPlaylist(name, token);
    return true;
  }
  if (hasPending(entry.id)) {
    console.log("[data] sync skip", name, "pending exists");
    return false;
  }
  const metaRes = await fetch(`https://api.spotify.com/v1/playlists/${entry.id}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!metaRes.ok) throw new Error("ERROR meta " + name + " " + metaRes.status);
  const meta = await metaRes.json();

  if (entry.snapshot_id && meta.snapshot_id === entry.snapshot_id) {
    console.log("[data] sync", name, "unchanged, 1 call");
    entry.loadedAt = Date.now();
    writeCache();
    return false;   // nothing changed, no full load
  }

  console.log("[data] sync", name, "changed, full load");
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

async function selectSource(name, play) {
  localStorage.setItem(SOURCE_KEY, name);
  const grid = document.getElementById("source-grid");
  if (grid) {
    for (const b of grid.children) b.classList.toggle("active", b.dataset.name === name);
  }
  const pickFirst = () => {
    const tracks = (cache[name] && cache[name].tracks) || [];
    const first = tracks.find(t => !isHidden(name, t.uri)) || tracks[0];
    if (first) {
      currentTrack = first;
      updatePlayerBar(first);
    }
  };
  const finish = async () => {
    renderTracks();
    pickFirst();
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
  try {
    const token = await getToken();
    setStatus("Loading " + name);
    const source = await resolvePlaylistData(name, token);
    if (source === "none") {
      console.log("[data] select", name, "-> API fetch (no local, no wix)");
      const changed = await syncPlaylist(name, token);
      if (changed) await commitPlaylist(name, token);
    } else {
      console.log("[data] select", name, "-> resolved from", source, "checking snapshot (1 call)");
      const changed = await syncPlaylist(name, token);
      if (changed) {
        try { await commitPlaylist(name, token); } catch (_) { /* best effort */ }
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

function displayTracks(name) {
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
  return reverseOrder ? [...list].reverse() : list;
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
    card.addEventListener("click", async () => {
      try {
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
}

function highlightTracks() {
  const tracks = displayTracks(sourceName());
  for (const node of el.list.querySelectorAll(".track")) {
    const i = Number(node.dataset.index);
    node.classList.toggle("current", Boolean(currentTrack) && sameRecording(tracks[i], currentTrack));
  }
}

function hiddenGrid() {
  const raw = localStorage.getItem(GRID_HIDE_KEY);
  return raw ? JSON.parse(raw) : [];
}

let showHiddenGrid = false;

function hideGrid(name, value) {
  const list = hiddenGrid();
  const idx = list.indexOf(name);
  if (value && idx === -1) list.push(name);
  if (!value && idx !== -1) list.splice(idx, 1);
  localStorage.setItem(GRID_HIDE_KEY, JSON.stringify(list));
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
  for (const btn of el.grid.children) {
    const entry = cache[btn.dataset.name];
    const has = cur && entry && entry.tracks && entry.tracks.some(t => sameRecording(t, currentTrack));
    btn.classList.toggle("has-track", Boolean(has));
  }
}

function gridOrder() {
  const current = Object.keys(PLAYLISTS).filter(n => !PLAYLISTS[n].extra);
  const raw = localStorage.getItem("sp_grid_order");
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

function saveGridOrder(order) {
  localStorage.setItem("sp_grid_order", JSON.stringify(order));
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

function renderGrid() {
  el.grid.innerHTML = "";
  const hidden = hiddenGrid();
  const cur = currentTrack && currentTrack.uri;
  for (const name of gridOrder()) {
    const entry = PLAYLISTS[name];
    if (entry.extra) continue;
    const isHidden = hidden.includes(name);
    if (isHidden && !showHiddenGrid) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.name = name;
    if (isHidden) btn.classList.add("hidden-tile");
    const img = document.createElement("img");
    img.alt = "";
    bindImg(img, entry.image || (cache[name] && cache[name].image));
    const label = document.createElement("span");
    label.textContent = entry.label;
    if (reorderMode) {
  const badge = document.createElement("span");
  badge.className = "grid-minus";
  badge.setAttribute("role", "button");
  badge.textContent = isHidden ? "+" : "-";
  badge.addEventListener("click", ev => {
    ev.stopPropagation();
    hideGrid(name, !isHidden);
    renderGrid();
  });
  const sync = document.createElement("span");
  sync.className = "grid-sync";
  sync.setAttribute("role", "button");
  sync.innerHTML = '<i class="fa-solid fa-rotate"></i>';
  sync.title = "Sync this playlist";
  sync.addEventListener("click", async ev => {
    ev.stopPropagation();
    if (sync.classList.contains("busy")) return;
    sync.classList.add("busy");
    try {
      const token = await getToken();
      const changed = await syncPlaylist(name, token);
      if (changed) {
        try { await commitPlaylist(name, token); } catch (_) { /* best effort */ }
        setFeedback("synced " + name, false);
      } else {
        setFeedback("synced " + name + " (unchanged)", false);
      }
      renderGrid();
      renderTracks();
    } catch (err) {
      setFeedback(err.message, true);
    } finally {
      sync.classList.remove("busy");
    }
  });
  btn.append(img, label, badge, sync);
} else {
  btn.append(img, label);
}
    const has = cur && cache[name] && cache[name].tracks && cache[name].tracks.some(t => sameRecording(t, currentTrack));
if (has) btn.classList.add("has-track");

if (reorderMode) {
  btn.classList.add("reordering");
  const up = document.createElement("span");
  up.className = "reorder-arrow reorder-up";
  up.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  up.addEventListener("click", ev => {
    ev.stopPropagation();
    moveInGridOrder(name, -1);
  });
  const down = document.createElement("span");
  down.className = "reorder-arrow reorder-down";
  down.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
  down.addEventListener("click", ev => {
    ev.stopPropagation();
    moveInGridOrder(name, 1);
  });
  btn.append(up, down);
}

btn.addEventListener("click", () => {
  if (reorderMode) return;
  onAdd(name, btn);
});

el.grid.appendChild(btn);

  }
  el.grid.classList.toggle("has-moving", Boolean(movingTile));
  paintTargetBar();
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
  const targets = hierarchyOn() ? [name, ...resolveHierarchy(name)] : [name];
  const entry = cache[name];
  const already = entry && entry.tracks && entry.tracks.some(t => sameRecording(t, currentTrack));
  btn.classList.add("pending");
  try {
    const token = await getToken();
    btn.classList.remove("pending");
    if (already) {
      await removeTrack(currentTrack, name, token);
      setFeedback("removed from " + name, false);
      renderTracks();
      highlightTracks();
    } else {
      let totalAdded = 0;
      const errors = [];
      for (const target of targets) {
        try {
          totalAdded += await addTrack(currentTrack, target, token);
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
        try { await saveToLibrary(currentTrack, token); } catch (_) { /* library is best-effort */ }
      }
      btn.classList.add("ok");
      setTimeout(() => btn.classList.remove("ok"), 1200);
    }
    renderGrid();
  } catch (err) {
    btn.classList.remove("pending");
    btn.classList.add("err");
    setFeedback(err.message, true);
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

function onPlayerState(state) {
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
    closeVersionsPanel();
    resetPresets();
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
    if (pendingSeek && currentTrack) {
      const part = pendingSeek;
      pendingSeek = null;
      seekPreview(currentTrack.durationMs, part).catch(err => setFeedback(err.message, true));
    }
  }
  const toggleIcon = document.querySelector("#player-view .np-toggle i");
  if (toggleIcon) toggleIcon.className = state.paused ? "fa-solid fa-play" : "fa-solid fa-pause";
  if (prev && prev.track_window && prev.track_window.current_track && !prev.paused && state.paused) {
    const prevPos = prev.position + (state.timestamp - prev.timestamp);
    const duration = (currentTrack && currentTrack.durationMs) || prev.duration || 0;
    if (duration && prevPos >= duration - 2000 && state.position < 2000) {
      playAdjacent(1, false);
    }
  }
  highlightTracks();
  startProgress(state);
  markGridHasTrack();
  paintVersionsButton();
}

function versionsOf(track) {
  if (!track) return [];
  const out = [];
  const seen = new Set();
  const order = [sourceName(), ...Object.keys(cache).filter(n => n !== sourceName())];
  for (const name of order) {
    const list = (cache[name] && cache[name].tracks) || [];
    for (const t of list) {
      if (!sameRecording(t, track)) continue;
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
  localStorage.setItem("sp_recent", JSON.stringify(list.slice(0, 12)));
  paintRecentGrid();
}

function paintRecentGrid() {
  if (!recentPanel) return;
  recentPanel.innerHTML = "";
  const list = recentList();
  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "recent-empty";
    empty.textContent = "No recent songs";
    recentPanel.appendChild(empty);
    return;
  }
  for (const t of list) {
    const card = document.createElement("div");
    card.className = "track";
    const img = document.createElement("img");
    img.alt = "";
    bindImg(img, t.image);
    const meta = document.createElement("div");
    meta.innerHTML = `<p class="track-name"></p><p class="track-artists"></p>`;
    meta.querySelector(".track-name").textContent = t.name;
    meta.querySelector(".track-artists").textContent = t.artists;
    card.append(img, meta);
    card.addEventListener("click", async () => {
      try {
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
    recentPanel.appendChild(card);
  }
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
  const who = me.display_name || me.id || "Spotify";
  setStatus("Discovering playlists…");
  for (const key of Object.keys(PLAYLISTS)) delete PLAYLISTS[key];
  SOURCE_CANDIDATES.length = 0;
    const found = await ensurePlaylists(token);
  for (const p of found) {
    PLAYLISTS[p.label] = { id: p.id, label: p.label, image: p.image };
    if (cache[p.label]) cache[p.label].id = p.id;
  }
  SOURCE_CANDIDATES.push(...Object.keys(PLAYLISTS));
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
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:1000;";
  const box = document.createElement("div");
  box.style.cssText = "background:#1b2029;padding:16px;border-radius:8px;width:min(520px,90vw);display:flex;flex-direction:column;gap:8px;";
  const title = document.createElement("p");
  title.textContent = "Paste Spotify track links";
  title.style.cssText = "margin:0;font-weight:600;";
  const area = document.createElement("textarea");
  area.rows = 10;
  area.style.cssText = "width:100%;resize:vertical;background:#0d1117;color:#e6edf3;border:1px solid #30363d;border-radius:6px;padding:8px;font-family:monospace;font-size:12px;";
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:8px;justify-content:flex-end;";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Cancel";
  const create = document.createElement("button");
  create.type = "button";
  create.textContent = "Create";
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
  const list = hiddenMap()[name] || [];
  if (!list.length) return false;
  if (list.includes(uri)) return true;
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
  if (entry) {
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
  const name = sourceName();
  const tracks = playableTracks(name);
  if (!tracks.length) return;
  const original = currentTrack;
  if (hide !== false && original && !playAll) setHidden(name, original.uri, true);
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

async function playAdjacent(dir, hide) {
  if (shuffleOn && dir === 1) return playNextShuffled(hide);
  const name = sourceName();
  const tracks = queueTracks(name);
  if (!tracks.length || !currentTrack) return;
  const original = currentTrack;
  if (dir === 1 && hide !== false && !playAll) setHidden(name, original.uri, true);
  const token = await getToken();
  const tried = new Set();
  let idx = tracks.findIndex(t => sameRecording(t, original));
  if (idx === -1) idx = 0;
  for (let step = 0; step < tracks.length; step++) {
    idx = (idx + dir + tracks.length) % tracks.length;
    const candidate = tracks[idx];
    if (tried.has(candidate.uri)) break;
    tried.add(candidate.uri);
    if (!playAll && isHidden(name, candidate.uri)) continue;
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
      markGridHasTrack();
      paintVersionsButton();
      return;
    }
  }
  currentTrack = original;
  if (dir === 1 && hide !== false && !playAll) setHidden(name, original.uri, false);
  updatePlayerBar(original);
  renderTracks();
  setFeedback("ERROR no playable track", true);
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
    b.classList.toggle("active", b.title === active);
  });
}

function resetPresets() {
  presetTracking = false;
  lastPaintedPreset = null;
  document.querySelectorAll("#player-view .np-preset").forEach(b => b.classList.add("active"));
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

  const recentBtn = document.createElement("button");
  recentBtn.type = "button";
  recentBtn.id = "np-recent-btn";
  recentBtn.className = "np-shuffle";
  recentBtn.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i>';
  recentBtn.title = "Recently played";
  recentBtn.addEventListener("click", toggleRecentPanel);

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
      btn.classList.toggle("active", !mode || p === mode);
    }
  };
  for (const [part] of presets) {
    const b = document.createElement("button");
    b.type = "button";
    b.title = part;
    b.className = "np-preset";
    b.textContent = "";
    b.addEventListener("click", () => {
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
  controls.append(prev, toggle, rnd, recentBtn, volumeBtn, next);
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
}

function applyPlayerScale(v) {
  const view = document.getElementById("player-view");
  if (view) view.style.zoom = String(v);
}

function applyGridScale(v) {
  el.grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${Math.round(140 * v)}px, 1fr))`;
}

async function playRandom() {
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
  map[name] = [];
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(map));
  renderTracks();
  renderGrid();
  try {
    const token = await getToken();
    const id = PLAYLISTS[name] && PLAYLISTS[name].id;
    if (!id) return;
    await Promise.all(list.map(uri => syncPush(token, id, uri, false).catch(() => null)));
  } catch (err) {
    setFeedback(err.message, true);
  }
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
  const label = document.createElement("span");
  label.className = "sources-label";
  label.textContent = "Sources";
  const collapse = document.createElement("button");
  collapse.type = "button";
  collapse.className = "sources-collapse";
  const paintCollapse = () => {
    collapse.innerHTML = sourcesCollapsed
      ? '<i class="fa-solid fa-chevron-down"></i>'
      : '<i class="fa-solid fa-chevron-up"></i>';
    collapse.title = sourcesCollapsed ? "Show sources" : "Hide sources";
  };
  paintCollapse();
  collapse.addEventListener("click", () => {
    sourcesCollapsed = !sourcesCollapsed;
    localStorage.setItem("sp_sources_collapsed", sourcesCollapsed ? "1" : "0");
    const grid = document.getElementById("source-grid");
    if (grid) grid.style.display = sourcesCollapsed ? "none" : "grid";
    paintCollapse();
  });
  const hint = document.createElement("span");
  hint.className = "sources-hint";
  hint.textContent = "double-click to play";
  bar.append(label, collapse, hint);
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
  bar.append(label, progressSpan, el.status);
  el.grid.parentElement.insertBefore(bar, el.grid);

  const bottom = document.createElement("div");
  bottom.className = "target-bar target-bottom";

  const hiddenBtn = document.createElement("button");
  hiddenBtn.type = "button";
  hiddenBtn.className = "target-toggle";
  const paintHidden = () => {
    const n = hiddenGrid().length;
    hiddenBtn.classList.toggle("on", showHiddenGrid);
    hiddenBtn.innerHTML = '<i class="fa-solid ' + (showHiddenGrid ? "fa-eye" : "fa-eye-slash") + '"></i><span>Hidden' + (n ? " · " + n : "") + '</span>';
    hiddenBtn.title = showHiddenGrid ? "Hide hidden playlists" : "Show hidden playlists";
  };
  paintHidden();
  hiddenBtn.addEventListener("click", () => {
    showHiddenGrid = !showHiddenGrid;
    paintHidden();
    renderGrid();
  });

  const reorderBtn = document.createElement("button");
  reorderBtn.type = "button";
  reorderBtn.className = "target-toggle";
  const paintReorder = () => {
    reorderBtn.classList.toggle("on", reorderMode);
    reorderBtn.innerHTML = '<i class="fa-solid fa-pen"></i><span>' + (reorderMode ? "Done" : "Edit") + '</span>';
    reorderBtn.title = reorderMode ? "Exit reorder mode" : "Reorder playlists";
  };
  paintReorder();
  reorderBtn.addEventListener("click", () => {
    reorderMode = !reorderMode;
    paintReorder();
    renderGrid();
  });

  const pendingBtn = document.createElement("button");
  pendingBtn.type = "button";
  pendingBtn.id = "pending-btn";
  pendingBtn.className = "target-toggle";
  pendingBtn.innerHTML = '<i class="fa-solid fa-clock"></i><span>Pending</span>';
  pendingBtn.style.display = "none";
  pendingBtn.title = "Replay queued changes";
  pendingBtn.addEventListener("click", () => replayPending());
  const right = document.createElement("div");
  right.className = "target-right";
  right.append(hiddenBtn, reorderBtn);
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
  const out = document.createElement("button");
  out.type = "button";
  out.className = "header-signout";
  out.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i><span>Sign out</span>';
  out.addEventListener("click", signOut);
  header.appendChild(out);
  el.main.insertBefore(header, el.main.firstChild);
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

function renderToolsGrid() {
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
    btn.addEventListener("click", async () => {
      try {
        const token = await getToken();
        if (t.id === "manual") {
          await openManualPlaylist(token);
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
  close.addEventListener("click", () => panel.remove());
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
  close.addEventListener("click", () => panel.remove());
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
  cancel.addEventListener("click", () => panel.remove());
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
      try { await syncPlaylistToWix(name, token); } catch (_) { /* best effort */ }
      clearPlaylistsCache();
      renderSourceGrid();
      renderGrid();
      panel.remove();
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

function apiHoldSet(seconds) {
  const until = Date.now() + seconds * 1000;
  localStorage.setItem(API_HOLD_KEY, String(until));
  paintApiCounter();
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
  songsToggle.className = "songs-toggle";
  songsToggle.innerHTML = '<i class="fa-solid fa-list-ul"></i><span>Songs</span>';

  const skipToggle = document.createElement("button");
  skipToggle.type = "button";
  skipToggle.className = "outline-btn";
  skipToggle.innerHTML = '<i class="fa-solid fa-forward-step"></i><span>Skip Filtered</span>';
  const paintSkip = () => skipToggle.classList.toggle("on", hideOnSkip);
  paintSkip();
  skipToggle.addEventListener("click", () => {
    hideOnSkip = !hideOnSkip;
    localStorage.setItem("sp_hide_on_skip", hideOnSkip ? "1" : "0");
    paintSkip();
  });

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

  const unhideBtn = document.createElement("button");
  unhideBtn.type = "button";
  unhideBtn.className = "outline-btn";
  unhideBtn.innerHTML = '<i class="fa-solid fa-eye"></i><span>Unfilter all</span>';
  unhideBtn.addEventListener("click", () => unhideAll());

  const reverseBtn = document.createElement("button");
  reverseBtn.type = "button";
  reverseBtn.className = "outline-btn";
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
queueToggle.className = "outline-btn";
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
playAllBtn.className = "outline-btn";
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

  songsTools.append(unhideBtn, reverseBtn, spacer, songsZoom);

  const songsHeader = document.createElement("div");
  songsHeader.className = "songs-header";
  songsHeader.append(songsRow, songsTools, songsFilters);

  el.list.style.display = "none";
  songsTools.style.display = "none";
  songsFilters.style.display = "none";
  songsToggle.addEventListener("click", () => {
    const open = el.list.style.display === "none";
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
  songsPanel.parentElement.insertBefore(toolsHost, songsPanel.nextSibling);

  const toolsBtn = document.createElement("button");
  toolsBtn.type = "button";
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

;


  const reloadBtn = document.createElement("button");
  reloadBtn.type = "button";
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

    el.source.parentElement.insertBefore(buildSourcesBar(), el.source);
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
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState !== "visible") return;
      try {
        await reconcileDevice();
      } catch (err) {
        setFeedback(err.message, true);
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
