const CLIENT_ID = "ERROR";
const ACCESS_TOKEN = "ERROR";
const SYNC_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/hidden";
const HIERARCHY_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/hierarchy";
const OPS_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/ops";
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
let paintTargetBar = () => {};

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
  el.feedback.textContent = text || "";
  el.feedback.classList.toggle("error", Boolean(isError));
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
        volume: 0.8
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
    A: durationMs * 0.10,
    B: durationMs * 0.30,
    C: durationMs * 0.50,
    D: durationMs * 0.60,
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
  } catch (err) {
    pendingTrackUri = null;
    pendingTrackUriAt = 0;
    throw err;
  }
      setTimeout(async () => {
    if (pendingTrackUri !== track.uri) return;
    const api = await fetchPlaybackState(token);
    if (!api) return;
    if (api.uri === track.uri) return;
    pendingTrackUri = null;
    pendingTrackUriAt = 0;
    const apiRef = {
      uri: api.uri,
      name: api.name,
      artists: api.artists,
      durationMs: api.durationMs
    };
    if (!currentTrack || !sameRecording(currentTrack, apiRef)) {
      const cached = findCachedTrack(api.uri);
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
  }, 2500);
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

async function addTrack(track, selectedName, token) {
  const entry = cache[selectedName];
  if (entry && entry.tracks && entry.tracks.some(t => sameRecording(t, track))) return 0;
  const res = await fetch("https://api.spotify.com/v1/playlists/" + PLAYLISTS[selectedName].id + "/items", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ uris: [track.uri] })
  });
  if (!res.ok) throw new Error("ERROR add " + selectedName + " " + res.status);
  if (!cache[selectedName]) {
    cache[selectedName] = {
      id: PLAYLISTS[selectedName].id,
      label: selectedName,
      image: PLAYLISTS[selectedName].image || null,
      loadedAt: Date.now(),
      tracks: [],
      partial: true
    };
  }
    if (!cache[selectedName].tracks) cache[selectedName].tracks = [];
  cache[selectedName].tracks.push(track);
  writeCache();
  pushOp({
    playlistId: PLAYLISTS[selectedName].id,
    trackUri: track.uri,
    action: "add",
    track
  }).catch(err => setFeedback(err.message, true));
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
  const cached = cache[name];
  if (cached && cached.tracks && cached.tracks.length && !cached.partial) {
    renderTracks();
    pickFirst();
    highlightTracks();
    markGridHasTrack();
  }
  try {
    const token = await getToken();
    const raw = String(PLAYLISTS[name].id || "").trim();
    const match = raw.match(/([0-9A-Za-z]{22})(?:[?/]|$)/);
    const id = match ? match[1] : raw;
    setStatus("Checking " + name);
    const metaRes = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!metaRes.ok) throw new Error("ERROR meta " + name + " " + metaRes.status);
    const meta = await metaRes.json();
    const realTotal = meta.tracks && typeof meta.tracks.total === "number" ? meta.tracks.total : null;
    const cachedTotal = cached && typeof cached.total === "number" ? cached.total : (cached && cached.tracks ? cached.tracks.length : -1);
    const inSync = cached && !cached.partial && realTotal !== null && cachedTotal === realTotal;
    if (inSync) {
      setStatus("Ready · Playlist Filter");
      renderTracks();
      pickFirst();
      highlightTracks();
      markGridHasTrack();
    } else {
      setStatus("Loading " + name);
      await loadPlaylist(name, token, meta);
      setStatus("Ready · Playlist Filter");
      renderTracks();
      pickFirst();
      highlightTracks();
      markGridHasTrack();
    }
    if (play && currentTrack) {
      await playFromGesture(currentTrack, token);
      updatePlayerBar(currentTrack);
      highlightTracks();
      markGridHasTrack();
    }
  } catch (err) {
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
  const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const na = norm(a.name);
  const nb = norm(b.name);
  if (!na || na !== nb) return false;
  const aa = norm(String(a.artists || "").split(",")[0]);
  const ab = norm(String(b.artists || "").split(",")[0]);
  if (aa !== ab) return false;
  const da = Number(a.durationMs) || 0;
  const db = Number(b.durationMs) || 0;
  return Math.abs(da - db) <= 2000;
}

function markGridHasTrack() {
  const cur = currentTrack && currentTrack.uri;
  for (const btn of el.grid.children) {
    const entry = cache[btn.dataset.name];
    const has = cur && entry && entry.tracks && entry.tracks.some(t => sameRecording(t, currentTrack));
    btn.classList.toggle("has-track", Boolean(has));
  }
}

function renderGrid() {
  el.grid.innerHTML = "";
  const hidden = hiddenGrid();
  const cur = currentTrack && currentTrack.uri;
  for (const name of Object.keys(PLAYLISTS)) {
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
        await loadPlaylist(name, await getToken());
        renderGrid();
        setFeedback("synced " + name, false);
      } catch (err) {
        setFeedback(err.message, true);
      } finally {
        sync.classList.remove("busy");
      }
    });
    btn.append(img, label, badge, sync);
    const has = cur && cache[name] && cache[name].tracks && cache[name].tracks.some(t => sameRecording(t, currentTrack));
    if (has) btn.classList.add("has-track");
    btn.addEventListener("click", () => onAdd(name, btn));
    el.grid.appendChild(btn);
  }
  paintTargetBar();
}

async function removeTrack(track, name, token) {
  const id = PLAYLISTS[name] && PLAYLISTS[name].id;
  if (!id) throw new Error("ERROR no playlist id");
  const entry = cache[name];
  const stored = entry && entry.tracks ? entry.tracks.find(t => sameRecording(t, track)) : null;
  const uri = stored ? stored.uri : track.uri;
  const res = await fetch("https://api.spotify.com/v1/playlists/" + id + "/items", {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ items: [{ uri }] })
  });
  if (!res.ok && res.status !== 200) throw new Error("ERROR remove " + name + " " + res.status);
    if (entry && entry.tracks) {
    entry.tracks = entry.tracks.filter(t => !sameRecording(t, track));
    writeCache();
  }
  pushOp({
    playlistId: id,
    trackUri: uri,
    action: "remove"
  }).catch(err => setFeedback(err.message, true));
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
      if (totalAdded) {
        try {
          await saveToLibrary(currentTrack, token);
        } catch (_) { /* library is best-effort */ }
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
    document.querySelectorAll("#player-view .np-preset").forEach(b => b.classList.add("active"));
  }
  if (sdkTrack) {
    const sdkRef = {
      uri: sdkTrack.uri,
      name: sdkTrack.name,
      artists: (sdkTrack.artists || []).map(a => a.name).join(", "),
      durationMs: sdkTrack.duration_ms
    };
    if (!currentTrack || !sameRecording(currentTrack, sdkRef)) {
      const fromCache = findCachedTrack(sdkTrack.uri);
      if (fromCache) currentTrack = fromCache;
      else currentTrack = { ...sdkRef, image: sdkTrack.album && sdkTrack.album.images && sdkTrack.album.images.length ? sdkTrack.album.images[0].url : null };
    }
    el.title.textContent = currentTrack.name;
    el.artists.textContent = (sdkTrack.artists || []).map(a => a.name).join(", ");
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
  renderGrid();
  renderSourceGrid();
  renderTracks();
  setStatus("Ready · " + who);
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
  const tracks = displayTracks(name);
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
      document.querySelectorAll("#player-view .np-preset").forEach(b => b.classList.add("active"));
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
      return;
    }
  }
  currentTrack = original;
  if (dir === 1 && hide !== false && !playAll) setHidden(name, original.uri, false);
  updatePlayerBar(original);
  renderTracks();
  setFeedback("ERROR no playable track", true);
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
  el.title.className = "np-title";
  el.artists.className = "np-artists";
  progressWrap.classList.add("np-progress");
  center.append(el.art, el.title, el.artists, progressWrap, el.time);
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
    const playAllBtn = document.createElement("button");
  playAllBtn.type = "button";
  playAllBtn.className = "np-shuffle";
  const paintPlayAll = () => {
    playAllBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    playAllBtn.classList.toggle("active", playAll);
    playAllBtn.title = playAll ? "Playing all tracks (hidden included)" : "Skipping hidden tracks";
  };
  paintPlayAll();
  playAllBtn.addEventListener("click", () => {
    playAll = !playAll;
    localStorage.setItem("sp_play_all", playAll ? "1" : "0");
    paintPlayAll();
    renderTracks();
  });
  center.appendChild(controls);
  const seeks = document.createElement("div");
  seeks.className = "np-seeks";
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
      paintPresets(part);
      seekCurrent(part);
    });
    presetBtns[part] = b;
    presetPill.appendChild(b);
  }
  paintPresets(null);
  seeks.appendChild(presetPill);
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
    controls.append(prev, toggle, rnd, playAllBtn, next);
  center.appendChild(seeks);
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
  label.textContent = "Add current track";
  const hiddenBtn = document.createElement("button");
  hiddenBtn.type = "button";
  hiddenBtn.className = "target-toggle";
  const paint = () => {
    const n = hiddenGrid().length;
    hiddenBtn.classList.toggle("on", showHiddenGrid);
    hiddenBtn.innerHTML = '<i class="fa-solid ' + (showHiddenGrid ? "fa-eye" : "fa-eye-slash") + '"></i><span>Hidden' + (n ? " · " + n : "") + '</span>';
    hiddenBtn.title = showHiddenGrid ? "Hide hidden playlists" : "Show hidden playlists";
  };
  paint();
  hiddenBtn.addEventListener("click", () => {
    showHiddenGrid = !showHiddenGrid;
    paint();
    renderGrid();
  });
  bar.append(label, el.status, hiddenBtn);
  el.grid.parentElement.insertBefore(bar, el.grid);
  return paint;
}

function buildHeader() {
  if (document.getElementById("app-header")) return;
  const header = document.createElement("header");
  header.id = "app-header";
  const logo = document.createElement("span");
  logo.className = "header-logo";
  logo.innerHTML = '<svg viewBox="0 0 1883 1883" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1,0,0,1,-100.338058,-100.340635)"><g transform="matrix(4.166667,0,0,4.166667,0,0)"><path d="M390.967,351.325L390.967,314.006L51.115,314.006C36.097,314.006 24.081,302.781 24.081,289.145L24.081,210.855C24.081,197.219 36.097,185.994 51.115,185.994L67.143,185.994L67.143,148.675L56.792,148.675C40.615,148.675 27.502,135.561 27.502,119.385L27.502,56.792C27.502,40.616 40.615,27.502 56.792,27.502L119.385,27.502C135.561,27.502 148.675,40.616 148.675,56.792L148.675,67.27C149.172,67.186 149.678,67.143 150.19,67.143L202.186,67.143L202.186,48.943C202.186,35.307 214.202,24.082 229.22,24.082L448.885,24.082C463.903,24.082 475.919,35.307 475.919,48.943L475.919,127.233C475.919,140.869 463.903,152.095 448.885,152.095L229.22,152.095C214.202,152.095 202.186,140.869 202.186,127.233L202.186,109.034L150.19,109.034C149.678,109.034 149.172,108.991 148.675,108.907L148.675,119.385C148.675,135.561 135.561,148.675 119.385,148.675L109.034,148.675L109.034,185.994L445.465,185.994C460.482,185.994 472.498,197.219 472.498,210.855L472.498,289.145C472.498,302.781 460.482,314.006 445.465,314.006L432.857,314.006L432.857,351.325L443.208,351.325C459.385,351.325 472.498,364.438 472.498,380.615L472.498,443.207C472.498,459.384 459.385,472.498 443.208,472.498L380.615,472.498C364.439,472.498 351.325,459.384 351.325,443.207L351.325,432.488C350.494,432.73 349.637,432.856 348.76,432.856L301.234,432.856L301.234,451.057C301.234,464.693 289.218,475.918 274.201,475.918L54.535,475.918C39.518,475.918 27.502,464.693 27.502,451.057L27.502,372.767C27.502,359.131 39.518,347.905 54.535,347.905L274.201,347.905C289.218,347.905 301.234,359.131 301.234,372.767L301.234,390.966L348.76,390.966C349.637,390.966 350.494,391.092 351.325,391.334L351.325,380.615C351.325,364.438 364.439,351.325 380.615,351.325L390.967,351.325ZM443.208,376.47L380.615,376.47C378.326,376.47 376.471,378.326 376.471,380.615L376.471,443.207C376.471,445.497 378.326,447.352 380.615,447.352L443.208,447.352C445.497,447.352 447.353,445.497 447.353,443.207L447.353,380.615C447.353,378.326 445.497,376.47 443.208,376.47ZM119.385,52.647L56.792,52.647C54.503,52.647 52.647,54.503 52.647,56.792L52.647,119.385C52.647,121.674 54.503,123.53 56.792,123.53L119.385,123.53C121.674,123.53 123.529,121.674 123.529,119.385L123.529,56.792C123.529,54.503 121.674,52.647 119.385,52.647Z" fill="currentColor"/></g></g></svg>';
  const wrap = document.createElement("div");
  wrap.className = "header-text";
  const h1 = document.createElement("h1");
  h1.textContent = "spotifylter";
  wrap.append(h1);
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
  setStatus("Ready · spotifylter");
  renderGrid();
  renderTracks();
  highlightTracks();
}

async function reconcileDevice() {
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
      clearPlaylistsCache();
      renderSourceGrid();
      renderGrid();
      panel.remove();
      setFeedback("created " + name + " · " + built.length + " songs", false);
      setStatus("Ready · spotifylter");
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
  logo.innerHTML = '<svg viewBox="0 0 1883 1883" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1,0,0,1,-100.338058,-100.340635)"><g transform="matrix(4.166667,0,0,4.166667,0,0)"><path d="M390.967,351.325L390.967,314.006L51.115,314.006C36.097,314.006 24.081,302.781 24.081,289.145L24.081,210.855C24.081,197.219 36.097,185.994 51.115,185.994L67.143,185.994L67.143,148.675L56.792,148.675C40.615,148.675 27.502,135.561 27.502,119.385L27.502,56.792C27.502,40.616 40.615,27.502 56.792,27.502L119.385,27.502C135.561,27.502 148.675,40.616 148.675,56.792L148.675,67.27C149.172,67.186 149.678,67.143 150.19,67.143L202.186,67.143L202.186,48.943C202.186,35.307 214.202,24.082 229.22,24.082L448.885,24.082C463.903,24.082 475.919,35.307 475.919,48.943L475.919,127.233C475.919,140.869 463.903,152.095 448.885,152.095L229.22,152.095C214.202,152.095 202.186,140.869 202.186,127.233L202.186,109.034L150.19,109.034C149.678,109.034 149.172,108.991 148.675,108.907L148.675,119.385C148.675,135.561 135.561,148.675 119.385,148.675L109.034,148.675L109.034,185.994L445.465,185.994C460.482,185.994 472.498,197.219 472.498,210.855L472.498,289.145C472.498,302.781 460.482,314.006 445.465,314.006L432.857,314.006L432.857,351.325L443.208,351.325C459.385,351.325 472.498,364.438 472.498,380.615L472.498,443.207C472.498,459.384 459.385,472.498 443.208,472.498L380.615,472.498C364.439,472.498 351.325,459.384 351.325,443.207L351.325,432.488C350.494,432.73 349.637,432.856 348.76,432.856L301.234,432.856L301.234,451.057C301.234,464.693 289.218,475.918 274.201,475.918L54.535,475.918C39.518,475.918 27.502,464.693 27.502,451.057L27.502,372.767C27.502,359.131 39.518,347.905 54.535,347.905L274.201,347.905C289.218,347.905 301.234,359.131 301.234,372.767L301.234,390.966L348.76,390.966C349.637,390.966 350.494,391.092 351.325,391.334L351.325,380.615C351.325,364.438 364.439,351.325 380.615,351.325L390.967,351.325ZM443.208,376.47L380.615,376.47C378.326,376.47 376.471,378.326 376.471,380.615L376.471,443.207C376.471,445.497 378.326,447.352 380.615,447.352L443.208,447.352C445.497,447.352 447.353,445.497 447.353,443.207L447.353,380.615C447.353,378.326 445.497,376.47 443.208,376.47ZM119.385,52.647L56.792,52.647C54.503,52.647 52.647,54.503 52.647,56.792L52.647,119.385C52.647,121.674 54.503,123.53 56.792,123.53L119.385,123.53C121.674,123.53 123.529,121.674 123.529,119.385L123.529,56.792C123.529,54.503 121.674,52.647 119.385,52.647Z" fill="currentColor"/></g></g></svg>';
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

async function boot() {
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
  skipToggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i><span>Skip hides</span>';
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
  unhideBtn.innerHTML = '<i class="fa-solid fa-eye"></i><span>Unhide all</span>';
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

  songsTools.append(unhideBtn, reverseBtn, spacer, songsZoom);

  const songsHeader = document.createElement("div");
  songsHeader.className = "songs-header";
  songsHeader.append(songsRow, songsTools);

  el.list.style.display = "none";
  songsTools.style.display = "none";
  songsToggle.addEventListener("click", () => {
    const open = el.list.style.display === "none";
    el.list.style.display = open ? "grid" : "none";
    songsTools.style.display = open ? "flex" : "none";
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
  toolbar.parentElement.insertBefore(toolsHost, toolbar.nextSibling);

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
  toolbar.appendChild(toolsBtn);
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
  toolbar.appendChild(reloadBtn);

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
        document.querySelectorAll("#player-view .np-preset").forEach(b => b.classList.add("active"));
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
