const CLIENT_ID = "ERROR";
const ACCESS_TOKEN = "ERROR";
const SYNC_URL = "https://emnlvega.wixsite.com/my-site-2/_functions/hidden";
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private"
].join(" ");

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

async function loadPlaylist(name, token) {
  const raw = String(PLAYLISTS[name].id || "").trim();
  const match = raw.match(/([0-9A-Za-z]{22})(?:[?/]|$)/);
  const id = match ? match[1] : raw;
  const metaRes = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!metaRes.ok) throw new Error("ERROR meta " + name + " " + metaRes.status);
  const meta = await metaRes.json();
  const tracks = [];
  let url = `https://api.spotify.com/v1/playlists/${id}/items?limit=100`;
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
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
        image: t.album && t.album.images && t.album.images.length ? t.album.images[0].url : null
      });
    }
    url = data.next;
  }
  cache[name] = {
    id,
    label: meta.name,
    image: meta.images && meta.images.length ? meta.images[0].url : null,
    loadedAt: Date.now(),
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
        name: "Playlist Filter",
        getOAuthToken: async cb => cb(await getToken()),
        volume: 0.8
      });
      player.addListener("ready", ({ device_id }) => {
        deviceId = device_id;
        resolve(device_id);
      });
      player.addListener("not_ready", ({ device_id }) => reject(new Error("ERROR device " + device_id)));
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

async function playTrack(trackUri, token, positionMs) {
  const transfer = await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ device_ids: [deviceId], play: false })
  });
  if (!transfer.ok && transfer.status !== 204) throw new Error("ERROR transfer " + transfer.status);
  const body = { uris: [trackUri] };
  if (typeof positionMs === "number") body.position_ms = positionMs;
  const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok && res.status !== 204) throw new Error("ERROR play " + res.status);
}

function previewPosition(durationMs, part) {
  const positions = { A: durationMs / 6, B: durationMs / 2, C: (5 * durationMs) / 6 };
  return Math.floor(positions[part] || 0);
}

function seekPreview(durationMs, part) {
  if (!player) return Promise.reject(new Error("ERROR no player"));
  return player.seek(previewPosition(durationMs, part));
}

async function playFromGesture(track, token, positionMs) {
  if (player) await player.activateElement();
  await playTrack(track.uri, token, positionMs);
}

async function addTrack(track, selectedName, token) {
  const entry = cache[selectedName];
  if (entry && entry.tracks.some(t => t.uri === track.uri)) return 0;
  const res = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLISTS[selectedName].id}/items`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ uris: [track.uri] })
  });
  if (!res.ok) throw new Error("ERROR add " + selectedName + " " + res.status);
  if (entry) {
    entry.tracks.push(track);
    writeCache();
  }
  return 1;
}

function sourceName() {
  return el.source.value || localStorage.getItem(SOURCE_KEY) || SOURCE_CANDIDATES[0];
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

function renderTracks() {
  const name = sourceName();
  const entry = cache[name];
  const tracks = entry && entry.tracks ? entry.tracks : [];
  const playingUri = lastState && lastState.track_window && lastState.track_window.current_track
    ? lastState.track_window.current_track.uri
    : (currentTrack && currentTrack.uri);
  el.list.innerHTML = "";
  for (const track of tracks) {
    const hidden = isHidden(name, track.uri);
    const card = document.createElement("div");
    card.className = "track" + (playingUri === track.uri ? " current" : "") + (hidden ? " dimmed" : "");
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
  const uri = lastState && lastState.track_window && lastState.track_window.current_track
    ? lastState.track_window.current_track.uri
    : (currentTrack && currentTrack.uri);
  const tracks = (cache[sourceName()] && cache[sourceName()].tracks) || [];
  for (let i = 0; i < tracks.length; i++) {
    if (el.list.children[i]) el.list.children[i].classList.toggle("current", Boolean(uri) && tracks[i].uri === uri);
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

function renderGrid() {
  el.grid.innerHTML = "";
  const hidden = hiddenGrid();
  for (const name of Object.keys(PLAYLISTS)) {
    const entry = PLAYLISTS[name];
    if (entry.extra) continue;
    const isHidden = hidden.includes(name);
    if (isHidden && !showHiddenGrid) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.name = name;
    if (isHidden) btn.style.opacity = ".45";
    const img = document.createElement("img");
    img.alt = "";
    img.style.width = "100%";
    img.style.aspectRatio = "1";
    img.style.objectFit = "cover";
    img.style.display = "block";
    img.style.borderRadius = "6px";
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
    btn.append(img, label, badge);
    btn.addEventListener("click", () => onAdd(name, btn));
    el.grid.appendChild(btn);
  }
}

async function onAdd(name, btn) {
  if (!currentTrack) {
    setFeedback("ERROR no current track", true);
    return;
  }
  btn.classList.remove("ok", "err");
  btn.classList.add("pending");
  const original = btn.textContent;
  btn.textContent = "…";
  try {
    const added = await addTrack(currentTrack, name, await getToken());
    btn.classList.remove("pending");
    btn.classList.add("ok");
    btn.textContent = original;
    setFeedback("added to " + added + " playlists", false);
    setTimeout(() => btn.classList.remove("ok"), 1200);
  } catch (err) {
    btn.classList.remove("pending");
    btn.classList.add("err");
    btn.textContent = original;
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
  if (sdkTrack) {
    const fromCache = findCachedTrack(sdkTrack.uri);
    if (fromCache) currentTrack = fromCache;
    el.title.textContent = sdkTrack.name;
    el.artists.textContent = sdkTrack.artists.map(a => a.name).join(", ");
    const img = sdkTrack.album && sdkTrack.album.images && sdkTrack.album.images.length
      ? sdkTrack.album.images[0].url
      : (currentTrack && currentTrack.image);
    bindImg(el.art, img);
    if (pendingSeek && currentTrack) {
      const part = pendingSeek;
      pendingSeek = null;
      seekPreview(currentTrack.durationMs, part).catch(err => setFeedback(err.message, true));
    }
  }
  const toggle = document.querySelector("#player-view .np-toggle");
  if (toggle) toggle.textContent = state.paused ? "PLAY" : "PAUSE";
  if (prev && prev.track_window && prev.track_window.current_track && !prev.paused && state.paused) {
    const prevPos = prev.position + (state.timestamp - prev.timestamp);
    const duration = (currentTrack && currentTrack.durationMs) || prev.duration || 0;
    if (duration && prevPos >= duration - 2000 && state.position < 2000) {
      playAdjacent(1, false);
    }
  }
  highlightTracks();
  startProgress(state);
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
}

function showAuth(message) {
  el.auth.classList.remove("hidden");
  el.main.classList.add("hidden");
  el.bar.classList.add("hidden");
  el.redirect.textContent = redirectUri();
  if (!el.clientId.value) el.clientId.value = getClientId();
  setStatus(message || "Log in with your Client ID");
}

async function startSession(token) {
  const me = await validateToken(token);
  showApp();
  setStatus("Connecting player…");
  if (!player) await initPlayer(onPlayerState);
  const who = me.display_name || me.id || "Spotify";
  setStatus("Discovering playlists…");
  for (const key of Object.keys(PLAYLISTS)) delete PLAYLISTS[key];
  SOURCE_CANDIDATES.length = 0;
  const found = await discoverPlaylists(token);
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
  renderGrid();
  renderSourceSelect();
  const name = sourceName();
    try {
    if (!cache[name] || !cache[name].tracks || !cache[name].tracks.length) {
      setStatus("Loading " + name);
      await loadPlaylist(name, token);
    }
    if (!lastState || !lastState.track_window || !lastState.track_window.current_track) {
      const tracks = (cache[name] && cache[name].tracks) || [];
      const first = tracks.find(t => !isHidden(name, t.uri)) || tracks[0];
      if (first) {
        currentTrack = first;
        updatePlayerBar(first);
      }
    }
    renderTracks();
    highlightTracks();
  } catch (err) {
    setFeedback(err.message, true);
  }
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
      renderSourceSelect();
      el.source.value = name;
      localStorage.setItem(SOURCE_KEY, name);
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

function isHidden(name, uri) {
  const map = hiddenMap();
  return (map[name] || []).includes(uri);
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

function resetShuffleQueue(name, exclude) {
  const tracks = ((cache[name] && cache[name].tracks) || []).filter(t => !isHidden(name, t.uri) && t.uri !== exclude);
  shuffleQueue = tracks.map(t => t.uri).sort(() => Math.random() - 0.5);
}

async function playNextShuffled(hide) {
  const name = sourceName();
  const tracks = ((cache[name] && cache[name].tracks) || []).filter(t => !isHidden(name, t.uri));
  if (!tracks.length) return;
  if (hide !== false && currentTrack) setHidden(name, currentTrack.uri, true);
  const valid = new Set(tracks.map(t => t.uri));
  shuffleQueue = shuffleQueue.filter(u => valid.has(u));
  if (!shuffleQueue.length) resetShuffleQueue(name, currentTrack && currentTrack.uri);
  const uri = shuffleQueue.shift();
  const track = tracks.find(t => t.uri === uri);
  if (!track) return;
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

async function playAdjacent(dir, hide) {
  if (shuffleOn && dir === 1) return playNextShuffled(hide);
  const name = sourceName();
  const tracks = (cache[name] && cache[name].tracks) || [];
  if (!tracks.length || !currentTrack) return;
  if (dir === 1 && hide !== false) setHidden(name, currentTrack.uri, true);
  let idx = tracks.findIndex(t => t.uri === currentTrack.uri);
  if (idx === -1) idx = 0;
  let next = null;
  const len = tracks.length;
  for (let step = 0; step < len; step++) {
    idx = (idx + dir + len) % len;
    if (!isHidden(name, tracks[idx].uri)) {
      next = tracks[idx];
      break;
    }
  }
  if (!next) {
    renderTracks();
    return;
  }
  try {
    const token = await getToken();
    currentTrack = next;
    await playFromGesture(next, token);
    updatePlayerBar(next);
    renderTracks();
    highlightTracks();
  } catch (err) {
    setFeedback(err.message, true);
  }
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
  let styleTag = document.getElementById("player-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "player-style";
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = `
    #player-view {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 32px 0;
      width: 100%;
    }
    #player-view .np-card {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 760px;
      padding: 0 120px;
    }
    #player-view .np-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      flex: 1;
      max-width: 480px;
    }
    #player-view .np-art {
      width: 340px;
      height: 340px;
      object-fit: cover;
      border-radius: 14px;
      box-shadow: 0 16px 50px rgba(0,0,0,.55);
      display: block;
    }
    #player-view .np-title {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      text-align: center;
      line-height: 1.2;
    }
    #player-view .np-artists {
      margin: 0;
      font-size: 16px;
      opacity: .7;
      text-align: center;
    }
    #player-view .np-progress {
      width: 100%;
    }
    #player-view .np-controls,
    #player-view .np-seeks {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    #player-view .np-controls button,
    #player-view .np-seeks button {
      min-width: 72px;
      padding: 16px 14px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 800;
      border: none;
      transition: transform .12s ease, box-shadow .12s ease;
    }
    #player-view .np-seeks button {
      background: #ffffff;
      color: #0d1117;
      font-size: 20px;
      box-shadow: 0 4px 16px rgba(255,255,255,.18);
    }
    #player-view .np-seeks button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 22px rgba(255,255,255,.3);
    }
    #player-view .np-toggle {
      background: #1db954;
      color: #0d1117;
      box-shadow: 0 4px 16px rgba(29,185,84,.35);
    }
    #player-view .np-toggle:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 22px rgba(29,185,84,.55);
    }
    #player-view .np-nav {
      background: #4d6bfe;
      color: #ffffff;
      box-shadow: 0 4px 16px rgba(77,107,254,.35);
      position: absolute;
      height: 520px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
    #player-view .np-nav:hover {
      transform: translateY(-50%);
      box-shadow: 0 6px 22px rgba(77,107,254,.55);
    }
    #player-view .np-nav-prev { left: 0; }
    #player-view .np-nav-next { right: 0; }
    @media (max-width: 720px) {
      #player-view .np-card { padding: 0; }
      #player-view .np-nav {
        position: static;
        transform: none;
        font-size: 16px;
        padding: 16px 14px;
        height: auto;
        display: block;
      }
      #player-view .np-nav:hover {
        transform: translateY(-1px);
      }
      #player-view .np-art {
        width: 240px;
        height: 240px;
      }
    }
  `;
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
  prev.textContent = "<";
  prev.addEventListener("click", () => playAdjacent(-1));
  const next = document.createElement("button");
  next.type = "button";
  next.className = "np-nav np-nav-next";
  next.textContent = ">";
  next.addEventListener("click", () => playAdjacent(1));
    const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "np-toggle";
  toggle.textContent = "PLAY";
  toggle.addEventListener("click", async () => {
    if (!player) return;
    try {
      await player.activateElement();
      const token = await getToken();
      if (lastState && !lastState.paused) {
        await fetch("https://api.spotify.com/v1/me/player/pause", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });
        return;
      }
      const sdkTrack = lastState && lastState.track_window && lastState.track_window.current_track;
      if (!sdkTrack && currentTrack) {
        await playFromGesture(currentTrack, token);
        updatePlayerBar(currentTrack);
        highlightTracks();
        return;
      }
      await fetch("https://api.spotify.com/v1/me/player/play?device_id=" + deviceId, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      setFeedback(err.message, true);
    }
  });
  controls.append(prev, toggle, next);
  center.appendChild(controls);
  const seeks = document.createElement("div");
  seeks.className = "np-seeks";
    const rnd = document.createElement("button");
  rnd.type = "button";
  const paintRnd = () => {
    rnd.textContent = shuffleOn ? "SHUF ON" : "SHUF OFF";
    rnd.style.background = shuffleOn ? "#8b5cf6" : "#3a3f4b";
    rnd.style.color = "#ffffff";
  };
  paintRnd();
  rnd.addEventListener("click", () => {
    shuffleOn = !shuffleOn;
    localStorage.setItem("sp_shuffle", shuffleOn ? "1" : "0");
    if (shuffleOn) resetShuffleQueue(sourceName(), currentTrack && currentTrack.uri);
    paintRnd();
  });
  seeks.appendChild(rnd);
  for (const part of ["A", "B", "C"]) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = part;
    b.addEventListener("click", () => seekCurrent(part));
    seeks.appendChild(b);
  }
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

async function boot() {
  renderGrid();
  buildPlayer();
  el.redirect.textContent = redirectUri();
  el.clientId.value = getClientId();
  if (!document.getElementById("fa-css")) {
    const fa = document.createElement("link");
    fa.id = "fa-css";
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
    document.head.appendChild(fa);
  }

  const songsRow = document.createElement("div");
  songsRow.className = "songs-row";

  const songsToggle = document.createElement("button");
  songsToggle.type = "button";
  songsToggle.className = "songs-toggle";
  const songsIcon = document.createElement("i");
  songsIcon.className = "fa-solid fa-list-ul";
  const songsLabel = document.createElement("span");
  songsLabel.textContent = "Songs";
  songsToggle.append(songsIcon, songsLabel);
  el.list.style.display = "none";
  songsToggle.addEventListener("click", () => {
    const open = el.list.style.display === "none";
    el.list.style.display = open ? "grid" : "none";
    songsToggle.classList.toggle("active", open);
  });

  const unhideBtn = document.createElement("button");
  unhideBtn.type = "button";
  unhideBtn.className = "songs-toggle";
  unhideBtn.style.background = "#4d6bfe";
  unhideBtn.style.color = "#ffffff";
  unhideBtn.style.boxShadow = "0 4px 16px rgba(77,107,254,.45)";
  const unhideIcon = document.createElement("i");
  unhideIcon.className = "fa-solid fa-eye";
  const unhideLabel = document.createElement("span");
  unhideLabel.textContent = "Unhide all";
  unhideBtn.append( unhideLabel);
  unhideBtn.addEventListener("click", () => unhideAll());

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

  songsRow.append(songsToggle, unhideBtn, playerZoom, gridZoom);
  el.list.parentElement.insertBefore(songsRow, el.list);

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
  el.source.addEventListener("change", async () => {
    const name = el.source.value;
    localStorage.setItem(SOURCE_KEY, name);
    try {
      const token = await getToken();
      if (!cache[name] || !cache[name].tracks || !cache[name].tracks.length) {
        setStatus("Loading " + name);
        await loadPlaylist(name, token);
        setStatus("Ready · Playlist Filter");
      }
      renderTracks();
      const tracks = (cache[name] && cache[name].tracks) || [];
      const first = tracks.find(t => !isHidden(name, t.uri)) || tracks[0];
      if (first && (!lastState || !lastState.track_window || !lastState.track_window.current_track)) {
        currentTrack = first;
        updatePlayerBar(first);
      }
      highlightTracks();
    } catch (err) {
      setFeedback(err.message, true);
    }
  });
  el.refresh.addEventListener("click", async () => {
    try {
      const token = await getToken();
      const name = sourceName();
      setStatus("Refreshing " + name);
      await loadPlaylist(name, token);
      try {
        await syncPull(token);
      } catch (err) {
        setFeedback(err.message, true);
      }
      setStatus("Ready · Playlist Filter");
      renderSourceSelect();
      el.source.value = name;
      renderTracks();
      renderGrid();
    } catch (err) {
      setFeedback(err.message, true);
    }
  });
  const manualBtn = document.createElement("button");
  manualBtn.type = "button";
  manualBtn.textContent = "Manual";
  toolbar.appendChild(manualBtn);
  manualBtn.addEventListener("click", async () => {
    try {
      await openManualPlaylist(await getToken());
    } catch (err) {
      setFeedback(err.message, true);
    }
  });
  const hiddenBtn = document.createElement("button");
  hiddenBtn.type = "button";
  hiddenBtn.textContent = "Hidden";
  toolbar.appendChild(hiddenBtn);
  hiddenBtn.addEventListener("click", () => {
    showHiddenGrid = !showHiddenGrid;
    renderGrid();
  });

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
