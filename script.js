/* ===== CONFIG: edit here ===== */
const CONFIG = {
  discordUserId: "1356268956398387423", // string, never a number (Discord IDs exceed JS integer precision)          // your numeric Discord ID (join discord.gg/lanyard so Lanyard can see you)
  track: { src: "audio/the-kill-2.mp3", /* add your own authorized file at this path */ title: "The Kill 2", artist: "Lex Amarni & 2MuchMotion", cover: "" /* empty = fetched from Spotify oEmbed if reachable */, spotifyUrl: "https://open.spotify.com/track/1cvh28dmSvufqFqJe9LE3H" },
  dedicationMessage: ""       // your letter for iTake; empty = neutral placeholder
};
/* ===== Translations: [en, es, ru, de, fr] ===== */
const LANGS = ["en","es","ru","de","fr"];
const T = {
 home:["home","inicio","главная","start","accueil"],
 about:["about me","sobre mí","обо мне","über mich","à propos"],
 music:["music","música","музыка","musik","musique"],
 theme:["Toggle theme","Cambiar tema","Сменить тему","Thema wechseln","Changer de thème"],
 language:["Language","Idioma","Язык","Sprache","Langue"],
 hero:["just another entity on the internet.","solo otra entidad en internet.","просто ещё одно существо в интернете.","nur ein weiteres Wesen im Internet.","juste une autre entité sur internet."],
 presence:["discord presence","presencia en discord","статус в discord","discord-präsenz","présence discord"],
 connecting:["connecting","conectando","подключение","verbinde","connexion"],
 live:["real time","tiempo real","онлайн","echtzeit","temps réel"],
 reconnecting:["reconnecting","reconectando","переподключение","verbinde neu","reconnexion"],
 unavailable:["unavailable","no disponible","недоступно","nicht verfügbar","indisponible"],
 notConfigured:["Discord ID not set","ID de Discord sin configurar","ID Discord не задан","Discord-ID nicht gesetzt","ID Discord non défini"],
 online:["online","en línea","в сети","online","en ligne"],
 idle:["idle","ausente","нет на месте","abwesend","inactif"],
 dnd:["do not disturb","no molestar","не беспокоить","bitte nicht stören","ne pas déranger"],
 offline:["offline","desconectado","не в сети","offline","hors ligne"],
 noActivity:["no current activity","sin actividad actual","нет активности","keine aktuelle Aktivität","aucune activité"],
 listening:["listening to spotify","escuchando spotify","слушает spotify","hört spotify","écoute spotify"],
 aboutTitle:["a bit of everything, I guess.","un poco de todo, supongo.","понемногу обо всём, наверное.","ein bisschen von allem, schätze ich.","un peu de tout, je suppose."],
 aboutP1:["I don’t always know what I’m doing, but I almost always end up finding something interesting.","No siempre sé qué estoy haciendo, pero casi siempre termino encontrando algo interesante.","Я не всегда понимаю, что делаю, но почти всегда в итоге нахожу что-нибудь интересное.","Ich weiß nicht immer, was ich gerade tue, aber fast immer finde ich am Ende etwas Interessantes.","Je ne sais pas toujours ce que je fais, mais je finis presque toujours par trouver quelque chose d’intéressant."],
 aboutP2:["I like ideas that appear out of nowhere, conversations that drag on for no reason, and those small things that make an ordinary day feel different.","Me gustan las ideas que aparecen de la nada, las conversaciones que se alargan sin motivo y esas pequeñas cosas que hacen que un día normal sea diferente.","Мне нравятся идеи, которые появляются из ниоткуда, разговоры, которые затягиваются без всякой причины, и те маленькие мелочи, которые делают обычный день особенным.","Ich mag Ideen, die aus dem Nichts auftauchen, Gespräche, die sich ohne Grund in die Länge ziehen, und diese kleinen Dinge, die einen normalen Tag anders machen.","J’aime les idées qui surgissent de nulle part, les conversations qui s’éternisent sans raison, et ces petites choses qui rendent un jour ordinaire différent."],
 aboutClose:["Under construction, like everyone else.","En construcción, como todo el mundo.","В разработке, как и все мы.","Im Aufbau, wie alle anderen auch.","En construction, comme tout le monde."],
 hint:["no presence received — join discord.gg/lanyard","sin datos de presencia — únete a discord.gg/lanyard","нет данных о статусе — вступите на discord.gg/lanyard","keine Präsenzdaten — tritt discord.gg/lanyard bei","aucune donnée de présence — rejoins discord.gg/lanyard"],
 seek:["Seek","Buscar","Перемотка","Suchen","Position"],
 play:["Play","Reproducir","Играть","Abspielen","Lecture"],
 pause:["Pause","Pausa","Пауза","Pause","Pause"],
 volume:["Volume","Volumen","Громкость","Lautstärke","Volume"],
 noTrack:["no track configured","sin canción configurada","трек не настроен","kein Titel eingestellt","aucun titre configuré"],
 playing:["playing","reproduciendo","играет","spielt","lecture"],
 paused:["paused","en pausa","пауза","pausiert","en pause"],
 tapToPlay:["tap play to start music","pulsa play para iniciar la música","нажмите play, чтобы включить музыку","Play drücken, um Musik zu starten","appuie sur lecture pour lancer la musique"],
 loadError:["couldn't load audio","no se pudo cargar el audio","не удалось загрузить аудио","Audio konnte nicht geladen werden","impossible de charger l'audio"],
 letterFor:["a letter for","una carta para","письмо для","ein Brief für","une lettre pour"],
 placeholder:["Your message goes here.","Tu mensaje va aquí.","Ваше сообщение здесь.","Deine Nachricht kommt hierher.","Ton message va ici."],
 close:["Close","Cerrar","Закрыть","Schließen","Fermer"],
 secret:["Open the letter for iTake","Abrir la carta para iTake","Открыть письмо для iTake","Brief für iTake öffnen","Ouvrir la lettre pour iTake"],
 mute:["Mute music", "Silenciar música", "Отключить звук музыки", "Musik stummschalten", "Couper le son de la musique"],
 unmute:["Turn sound on", "Activar sonido", "Включить звук", "Ton einschalten", "Activer le son"],
 nothingPlaying:["nothing playing right now", "nada sonando ahora", "сейчас ничего не играет", "gerade wird nichts abgespielt", "rien en lecture pour le moment"],
 history:["recently played", "escuchado recientemente", "недавно прослушано", "zuletzt gehört", "écouté récemment"],
 prev:["Previous","Anterior","Назад","Zurück","Précédent"],
 next:["Next","Siguiente","Вперёд","Weiter","Suivant"],
 song:["Song","Canción","Песня","Titel","Titre"],
 badges:["Badges","Insignias","Значки","Abzeichen","Badges"],
 b_staff:["Discord Staff","Personal de Discord","Сотрудник Discord","Discord-Mitarbeiter","Employé Discord"],
 b_partner:["Partnered Server Owner","Propietario de servidor asociado","Владелец партнёрского сервера","Partner-Server-Inhaber","Propriétaire de serveur partenaire"],
 b_hypesquadEvents:["HypeSquad Events","Eventos de HypeSquad","События HypeSquad","HypeSquad Events","Événements HypeSquad"],
 b_bugHunter1:["Bug Hunter","Cazador de errores","Охотник за багами","Bug-Jäger","Chasseur de bugs"],
 b_bugHunter2:["Bug Hunter (Gold)","Cazador de errores (oro)","Охотник за багами (золото)","Bug-Jäger (Gold)","Chasseur de bugs (or)"],
 b_hypesquadBravery:["HypeSquad Bravery","HypeSquad Bravery","HypeSquad Bravery","HypeSquad Bravery","HypeSquad Bravery"],
 b_hypesquadBrilliance:["HypeSquad Brilliance","HypeSquad Brilliance","HypeSquad Brilliance","HypeSquad Brilliance","HypeSquad Brilliance"],
 b_hypesquadBalance:["HypeSquad Balance","HypeSquad Balance","HypeSquad Balance","HypeSquad Balance","HypeSquad Balance"],
 b_earlySupporter:["Early Supporter","Seguidor temprano","Ранний сторонник","Früher Unterstützer","Soutien de la première heure"],
 b_verifiedDeveloper:["Early Verified Bot Developer","Desarrollador de bots verificado temprano","Ранний верифицированный разработчик ботов","Früher verifizierter Bot-Entwickler","Développeur de bots certifié de la première heure"],
 b_certifiedModerator:["Moderator Programs Alumni","Exalumno del programa de moderadores","Выпускник программы модераторов","Ehemaliger des Moderatorenprogramms","Ancien du programme de modération"],
 b_activeDeveloper:["Active Developer","Desarrollador activo","Активный разработчик","Aktiver Entwickler","Développeur actif"],
 historyEmpty:["no recent plays to show yet", "aún no hay reproducciones recientes que mostrar", "пока нет недавних прослушиваний", "noch keine zuletzt gehörten Titel", "aucune écoute récente à afficher pour le moment"],
 historyError:["recent plays are unavailable right now", "las reproducciones recientes no están disponibles ahora", "недавние прослушивания сейчас недоступны", "zuletzt Gehörtes ist gerade nicht verfügbar", "les écoutes récentes sont indisponibles pour le moment"],
 openSpotify:["Open in Spotify", "Abrir en Spotify", "Открыть в Spotify", "In Spotify öffnen", "Ouvrir dans Spotify"],
 loading:["loading", "cargando", "загрузка", "lädt", "chargement"],
 footer:["somewhere on the internet","en algún lugar de internet","где-то в интернете","irgendwo im Internet","quelque part sur internet"]
};
const $ = s => document.querySelector(s);
/* storage can throw (private mode, in-app browsers, blocked cookies): every access goes through this guard */
const store = { get: k => { try { return localStorage.getItem(k); } catch(e){ return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch(e){} } };
let lang = store.get("lang"); if (!LANGS.includes(lang)) lang = "en";
const tr = k => (T[k] || [])[LANGS.indexOf(lang)] || k;
/* Static texts (nav, About Me, labels) and scroll-reveal are set up FIRST, so they cannot be blocked by anything below (audio, Lanyard, Spotify, storage) */
function applyStaticText(){
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(e => e.textContent = tr(e.dataset.i18n));
  document.querySelectorAll("[data-i18n-label]").forEach(e => e.setAttribute("aria-label", tr(e.dataset.i18nLabel)));
  document.querySelectorAll("[data-i18n-title]").forEach(e => e.title = tr(e.dataset.i18nTitle));
}
applyStaticText();
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.12}) : null;
document.querySelectorAll(".rv").forEach(e => io ? io.observe(e) : e.classList.add("in"));
let conn = CONFIG.discordUserId ? "connecting" : "notConfigured", pres = null;
let playerState = { blocked:false, error:false };

function setText(el, t){ if (el.textContent === t) return; el.textContent = t; if (!el.dataset.rdy){ el.dataset.rdy = 1; return; } el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); }
let avBad = "", bannerBad = "", spT, histT, prof = null, profFails = 0, profT;
/* Spotify as Discord reports it (Lanyard's `spotify` object). Same source as before: nothing is invented, no Spotify API involved. */
const TRACK_RE = /^[A-Za-z0-9]{22}$/;
function spotifyOf(d){
  const s = d && d.listening_to_spotify && d.spotify; if (!s || typeof s !== "object" || !s.song) return null;
  const id = TRACK_RE.test(String(s.track_id || "")) ? s.track_id : "", st = +(s.timestamps && s.timestamps.start) || 0, en = +(s.timestamps && s.timestamps.end) || 0;
  return { id, title: String(s.song), artists: String(s.artist || "").split(";").map(x => x.trim()).filter(Boolean).join(", "), album: String(s.album || ""),
    cover: /^https:\/\//.test(s.album_art_url || "") ? s.album_art_url : "", url: id ? "https://open.spotify.com/track/" + id : "", startMs: st, endMs: en > st ? en : 0 };
}
const safeUrl = u => /^https:\/\/(cdn\.discordapp\.com|media\.discordapp\.net)\//.test(u || "") ? u : "";
/* ===== Discord card: live presence (Lanyard WebSocket) + public profile (GET /api/profile) ===== */
function renderBanner(){
  const box = $("#banner"), img = $("#banner-img"), b = prof && prof.banner;
  const src = b ? safeUrl(still ? b.staticUrl : b.url) : "", acc = prof && /^#[0-9a-f]{6}$/i.test(prof.accentColor || "") ? prof.accentColor : "";
  box.style.setProperty("--acc", acc);
  /* no banner: Discord itself shows the profile accent colour as a flat banner; without it, a quiet dotted background. Never a made-up image. */
  box.dataset.acc = !src && acc ? "1" : "0";
  if (src && src !== bannerBad){ if (img.getAttribute("src") !== src) img.src = src; img.hidden = false; box.dataset.has = "1"; } else { img.hidden = true; box.dataset.has = "0"; }
}
/* About Me: the Discord API does not expose it. The only supported source is a Lanyard KV key named "bio" that YOU set (see README). Otherwise nothing is shown. */
function bioText(){
  const raw = (pres && pres.kv && pres.kv.bio) || (prof && prof.bio) || ""; if (typeof raw !== "string") return "";
  return raw.replace(/\\n/g, "\n").replace(/\r\n?/g, "\n").trim().slice(0, 600);
}
function bioNodes(t){ /* tiny, safe subset of Discord markdown: **bold** ~~strike~~ `code` *italic* _italic_ ; everything else stays plain text (textContent only, no innerHTML) */
  const out = [], re = /(\*\*[^*\n]+\*\*|~~[^~\n]+~~|`[^`\n]+`|\*[^*\n]+\*|_[^_\n]+_)/g; let last = 0, m;
  const add = (tag, txt) => { const e = document.createElement(tag); e.textContent = txt; out.push(e); };
  while ((m = re.exec(t))){ if (m.index > last) out.push(t.slice(last, m.index)); const x = m[0];
    if (x.startsWith("**")) add("b", x.slice(2, -2)); else if (x.startsWith("~~")) add("s", x.slice(2, -2)); else if (x[0] === "`") add("code", x.slice(1, -1)); else add("i", x.slice(1, -1)); last = m.index + x.length; }
  if (last < t.length) out.push(t.slice(last)); return out;
}
let bioKey = "";
function renderBio(){
  const el = $("#bio"), t = bioText(); el.hidden = !t; if (t === bioKey) return; bioKey = t;
  el.replaceChildren(...(t ? bioNodes(t) : [])); /* line breaks are kept by CSS (white-space: pre-line) */
}
function renderBadges(){
  const list = (prof && Array.isArray(prof.badges) ? prof.badges : []).filter(k => T["b_" + k]), ul = $("#badges");
  ul.hidden = !list.length; ul.setAttribute("aria-label", tr("badges"));
  ul.replaceChildren(...list.map(k => { const li = document.createElement("li"); li.textContent = tr("b_" + k); return li; }));
}
function renderPresence(){
  setText($("#conn-text"), tr(conn)); $("#conn-dot").dataset.s = conn; $("#discord").dataset.c = conn;
  const d = pres, u = (d && d.discord_user) || {}, st = d ? d.discord_status : "offline";
  $("#st-dot").dataset.s = st;
  setText($("#status"), d ? tr(st) : tr(conn === "live" ? "offline" : conn));
  const nm = d ? (u.global_name || u.display_name || u.username || (prof && prof.displayName) || "—") : (prof && prof.displayName) || "—"; setText($("#name"), nm);
  const uname = (d && u.username) || (prof && prof.username) || "", un = uname && uname !== nm ? "@" + uname : ""; setText($("#uname"), un); $("#uname").hidden = !un;
  const acts = d ? d.activities || [] : [];
  const cs = acts.find(a => a.type === 4), csTxt = cs ? [(cs.emoji && !cs.emoji.id && cs.emoji.name) || "", cs.state || ""].filter(Boolean).join(" ") : "";
  setText($("#custom"), csTxt); $("#custom").hidden = !csTxt;
  const act = acts.find(a => a.type !== 4 && a.id !== "spotify:1" && a.name !== "Spotify");
  setText($("#activity"), !d ? (conn === "unavailable" ? tr("hint") : "") : act ? act.name + (act.details ? " — " + act.details : "") : tr("noActivity"));
  /* avatar: official profile (animated if it is) -> Lanyard's avatar hash; decoration only when Discord reports one */
  const lanyardAv = d && u.id && u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128` : "";
  const av = $("#av"), src = safeUrl(prof && (still ? prof.avatarStatic : prof.avatar)) || lanyardAv;
  if (src && src !== avBad){ if (av.getAttribute("src") !== src) av.src = src; av.hidden = false; $("#av-fb").hidden = true; } else { av.hidden = true; $("#av-fb").hidden = false; }
  const dec = safeUrl((prof && prof.decoration) || (u.avatar_decoration_data && u.avatar_decoration_data.asset ? `https://cdn.discordapp.com/avatar-decoration-presets/${u.avatar_decoration_data.asset}.png?size=160&passthrough=true` : "")), de = $("#av-deco");
  if (dec){ if (de.getAttribute("src") !== dec) de.src = dec; de.hidden = false; } else de.hidden = true;
  renderBanner(); renderBio(); renderBadges(); renderSpotify();
}
/* ===== Spotify activity (from Discord): loading | playing | idle (nothing detected) | error. No data = no song shown. ===== */
let lastSpId = null;
function renderSpotify(){
  const t = spotifyOf(pres), s = !pres ? (conn === "unavailable" ? "error" : "loading") : t ? "playing" : "idle", live = s === "playing", box = $("#spotify"), song = $("#sp-song"), img = $("#sp-art");
  box.classList.toggle("idle", !live); box.classList.toggle("playing", live); box.dataset.s = s;
  setText($("#sp-label"), live ? tr("listening") : s === "idle" ? tr("nothingPlaying") : s === "error" ? "Spotify · " + tr("unavailable") : tr("loading"));
  setText(song, live ? t.title : ""); if (live && t.url) song.href = t.url; else song.removeAttribute("href");
  setText($("#sp-artist"), live ? t.artists : ""); setText($("#sp-album"), live ? t.album : "");
  const art = live && t.cover; img.style.display = art ? "" : "none"; if (art && img.getAttribute("src") !== art) img.src = art;
  const sid = live ? (t.id || t.title) : null; if (sid && sid !== lastSpId){ setTimeout(loadHistory, 2500); } lastSpId = sid; /* a new song: the server records it, refresh the carousel soon */
  clearInterval(spT); const pr = $(".sp-prog"), dur = live ? t.endMs - t.startMs : 0, ok = live && t.startMs > 0 && dur > 0; pr.hidden = !ok; if (!ok) return; /* progress only when Discord gives both timestamps */
  const upd = () => { const el = Math.min(Math.max(Date.now() - t.startMs, 0), dur);
    $("#sp-cur").textContent = fmt(el / 1000); $("#sp-dur").textContent = fmt(dur / 1000); $("#sp-bar").style.transform = `scaleX(${el / dur})`; if (el >= dur) clearInterval(spT); };
  upd(); spT = setInterval(upd, 1000);
}
/* public profile (banner, accent colour, badges, decoration): changes rarely, so it is refreshed every 5 minutes while the tab is visible */
async function loadProfile(){
  clearTimeout(profT); if (stopped) return;
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 10000); let next = 300000;
  try { const r = await fetch("/api/profile", { signal: ctl.signal, headers: { Accept: "application/json" } }); if (!r.ok) throw 0; const j = await r.json(); if (!j || !j.id) throw 0; prof = j; profFails = 0; renderPresence(); }
  catch(e){ profFails++; next = Math.min(300000, 15000 * Math.pow(2, profFails)); } /* on failure the last good profile stays */
  finally { clearTimeout(to); profT = setTimeout(loadProfile, document.hidden ? 300000 : next); }
}
let ws, hb, rt, wt, tries = 0, everLive = false, stopped = false;
function connect(){
  if (!CONFIG.discordUserId || stopped || (ws && ws.readyState < 2)) return;
  clearTimeout(rt); clearTimeout(wt);
  if (everLive) conn = "reconnecting"; else if (!tries) conn = "connecting"; /* after a failure keep "unavailable" instead of flashing "connecting" */
  renderPresence();
  let s;
  try { s = ws = new WebSocket("wss://api.lanyard.rest/socket"); } catch(e){ return retry(); }
  /* no presence within 10 s (stuck handshake, or ID not monitored by Lanyard) -> say so instead of loading forever */
  wt = setTimeout(() => { if (conn !== "live"){ conn = pres ? "reconnecting" : "unavailable"; renderPresence(); } }, 10000);
  s.onmessage = e => { if (s !== ws) return; let m; try { m = JSON.parse(e.data); } catch(_){ return; }
    if (m.op === 1){ clearInterval(hb); hb = setInterval(() => s.readyState === 1 && s.send('{"op":3}'), m.d.heartbeat_interval);
      s.send(JSON.stringify({ op:2, d:{ subscribe_to_id: CONFIG.discordUserId } })); }
    if (m.op === 0 && m.d && m.d.discord_user){ clearTimeout(wt); pres = m.d; conn = "live"; everLive = true; tries = 0; renderPresence(); } };
  s.onclose = () => { if (s !== ws || stopped) return; clearInterval(hb); clearTimeout(wt); retry(); };
  s.onerror = () => s.close();
}
function retry(){ conn = everLive ? "reconnecting" : "unavailable"; renderPresence(); clearTimeout(rt); rt = setTimeout(connect, Math.min(30000, 2000 * ++tries)); }
addEventListener("online", () => { tries = 0; connect(); loadHistory(); loadProfile(); });
addEventListener("pagehide", () => { clearInterval(spT); clearInterval(histT); clearTimeout(profT); stopped = true; clearTimeout(rt); clearTimeout(wt); clearInterval(hb); if (ws) ws.close(); });
addEventListener("pageshow", e => { if (e.persisted){ stopped = false; tries = 0; connect(); startHistory(); loadProfile(); } });
$("#sp-art").onerror = e => e.target.style.display = "none";
$("#banner-img").onerror = e => { bannerBad = e.target.getAttribute("src"); renderBanner(); };
$("#av").onerror = e => { avBad = e.target.getAttribute("src"); e.target.hidden = true; $("#av-fb").hidden = false; };

/* ===== Player (single Audio instance; language/theme changes never touch it) ===== */
const audio = new Audio(); audio.loop = true; audio.preload = "auto";
const v0 = parseFloat(store.get("vol")); audio.volume = v0 >= 0 && v0 <= 1 ? v0 : .5; audio.muted = store.get("muted") === "1";
let lastVol = audio.volume || .5;
const tk = CONFIG.track, pl = $("#player"), seek = $("#seek"), vol = $("#volume"), mute = $("#mute"); let seeking = false;
const fmt = n => isFinite(n) ? Math.floor(n / 60) + ":" + String(Math.floor(n % 60)).padStart(2, "0") : "0:00";
const fill = el => el.style.setProperty("--p", (el.value - el.min) / (el.max - el.min) * 100 + "%");
const usable = () => !!tk.src && !playerState.error;
const isPlaying = () => !audio.paused && audio.readyState > 2 && !audio.error;
const failPlay = e => { if (e && e.name === "AbortError") return; /* interrupted by a later pause/load: neither blocked nor broken */
  if (e && e.name === "NotAllowedError") playerState.blocked = true; else playerState.error = true; renderPlayer(); };
/* Autoplay is an ATTEMPT: the browser may refuse (NotAllowedError). Then the play button stays enabled, pulses and the "tap play" hint shows. No gesture tricks. */
function tryAutoplay(){ if (!tk.src || store.get("music") === "off" || !audio.paused) return; try { const p = audio.play(); if (p && p.catch) p.catch(failPlay); } catch(e){ failPlay(e); } }
if (tk.src){ audio.src = tk.src;
  audio.onerror = () => { playerState.error = true; renderPlayer(); };
  audio.onplaying = () => { playerState.error = false; playerState.blocked = false; renderPlayer(); }; }
["play","pause","waiting","canplay","ended"].forEach(e => audio.addEventListener(e, renderPlayer));
audio.onloadedmetadata = () => { seek.disabled = !isFinite(audio.duration); $("#t-dur").textContent = fmt(audio.duration); };
audio.ontimeupdate = () => { if (isFinite(audio.duration) && !seeking){ seek.value = audio.currentTime / audio.duration; fill(seek); } $("#t-cur").textContent = fmt(audio.currentTime); };
seek.oninput = () => { seeking = true; fill(seek); $("#t-cur").textContent = fmt(seek.value * audio.duration); };
seek.onchange = () => { audio.currentTime = seek.value * audio.duration; seeking = false; };
audio.addEventListener("volumechange", () => { vol.value = audio.volume; fill(vol); store.set("vol", audio.volume); store.set("muted", audio.muted ? "1" : "0"); renderMute(); });
vol.oninput = e => { audio.volume = +e.target.value; if (audio.volume > 0){ lastVol = audio.volume; audio.muted = false; } };
mute.onclick = () => { if (audio.muted || audio.volume === 0){ audio.muted = false; if (audio.volume < .05) audio.volume = lastVol; } else { lastVol = audio.volume; audio.muted = true; } };
function renderMute(){ const m = audio.muted || audio.volume === 0, l = tr(m ? "unmute" : "mute"); mute.dataset.muted = m; mute.setAttribute("aria-label", l); mute.title = l; mute.disabled = !usable(); }
function renderPlayer(){
  const tl = $("#p-title"); setText(tl, tk.title || tr("noTrack")); if (tk.spotifyUrl && tk.title) tl.href = tk.spotifyUrl; else tl.removeAttribute("href");
  setText($("#p-artist"), tk.artist || "");
  $("#cover").hidden = !tk.cover; if (tk.cover && $("#cover").getAttribute("src") !== tk.cover) $("#cover").src = tk.cover;
  pl.classList.toggle("has-src", usable()); pl.classList.toggle("playing", !audio.paused); pl.classList.toggle("blocked", playerState.blocked && audio.paused);
  $("#play").disabled = !usable(); $("#play").setAttribute("aria-label", tr(audio.paused ? "play" : "pause"));
  setText($("#p-status"), !tk.src ? "" : playerState.error ? tr("loadError") : isPlaying() ? tr("playing") : playerState.blocked ? tr("tapToPlay") : audio.paused ? tr("paused") : tr("loading"));
  renderMute();
}
$("#cover").onerror = e => e.target.hidden = true;
/* the floating player can grow (long FR/RU texts wrap): keep the page padding in sync so it never covers the end of the page */
const syncPlayerH = () => document.documentElement.style.setProperty("--player-h", Math.ceil(pl.getBoundingClientRect().height || 108) + "px");
if (typeof ResizeObserver !== "undefined") try { new ResizeObserver(syncPlayerH).observe(pl); } catch(e){}
addEventListener("resize", syncPlayerH); syncPlayerH();
$("#play").onclick = () => { if (audio.paused){ store.set("music", "on"); try { const p = audio.play(); if (p && p.catch) p.catch(failPlay); } catch(e){ failPlay(e); } } else { store.set("music", "off"); audio.pause(); } };
fill(vol); vol.value = audio.volume; fill(vol);
tryAutoplay(); /* a visitor who paused earlier (music=off) is respected */
if (!tk.cover && tk.spotifyUrl) fetch("https://open.spotify.com/oembed?url=" + encodeURIComponent(tk.spotifyUrl)).then(r => r.ok ? r.json() : Promise.reject()).then(j => { if (j && /^https:\/\//.test(j.thumbnail_url || "")){ tk.cover = j.thumbnail_url; renderPlayer(); } }).catch(() => {});

/* ===== Theme, language, letter ===== */
let ttT; /* one shared timer: rapid clicks reset it instead of stacking */
$("#theme").onclick = () => { const h = document.documentElement, n = h.dataset.theme === "dark" ? "light" : "dark";
  clearTimeout(ttT); h.classList.add("tt"); h.dataset.theme = n; ttT = setTimeout(() => h.classList.remove("tt"), 280);
  try { localStorage.setItem("theme", n); } catch(e){} metaTheme(); };
const metaTheme = () => $("meta[name=theme-color]").content = document.documentElement.dataset.theme === "dark" ? "#080808" : "#F6F5F2";
const lw = $("#langwrap"), lb = $("#lang"), lm = $("#lang-menu"), lo = [...lm.children]; let act = 0;
function syncLang(){ $("#lang-cur").textContent = lang.toUpperCase(); lo.forEach(o => o.setAttribute("aria-selected", o.dataset.lang === lang)); }
function setLang(c){ if (!LANGS.includes(c)) return; lang = c; try { localStorage.setItem("lang", lang); } catch(e){} applyLang(); }
function mark(i){ act = (i + lo.length) % lo.length; lo.forEach((o, j) => o.classList.toggle("act", j === act)); lm.setAttribute("aria-activedescendant", lo[act].id); }
function openLang(){ lw.classList.add("open"); lb.setAttribute("aria-expanded", "true"); lm.style.left = lm.style.right = "";
  const r = lm.getBoundingClientRect(); if (r.left < 8){ lm.style.left = "0"; lm.style.right = "auto"; }
  mark(LANGS.indexOf(lang)); lm.focus({preventScroll:true}); }
function closeLang(back){ if (!lw.classList.contains("open")) return; lw.classList.remove("open"); lb.setAttribute("aria-expanded", "false"); if (back) lb.focus(); }
lb.onclick = () => lw.classList.contains("open") ? closeLang(true) : openLang();
lb.addEventListener("keydown", e => { if (e.key === "ArrowDown" || e.key === "ArrowUp"){ e.preventDefault(); openLang(); } });
lo.forEach(o => o.addEventListener("click", () => { setLang(o.dataset.lang); closeLang(true); }));
lm.addEventListener("keydown", e => { const k = e.key;
  if (k === "ArrowDown") mark(act + 1); else if (k === "ArrowUp") mark(act - 1); else if (k === "Home") mark(0); else if (k === "End") mark(lo.length - 1);
  else if (k === "Enter" || k === " "){ setLang(lo[act].dataset.lang); closeLang(true); }
  else if (k === "Escape"){ e.stopPropagation(); closeLang(true); } else if (k === "Tab"){ closeLang(false); return; } else return;
  e.preventDefault(); });
document.addEventListener("pointerdown", e => { if (!lw.contains(e.target)) closeLang(false); });
lm.addEventListener("focusout", e => { if (!lw.contains(e.relatedTarget)) closeLang(false); });
function applyLang(){
  syncLang(); applyStaticText();
  $("#l-body").textContent = CONFIG.dedicationMessage || tr("placeholder");
  renderPresence(); renderPlayer(); renderHistoryState();
}
const dlg = $("#letter");
$("#secret").onclick = e => { const b = e.currentTarget; b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); dlg.showModal(); }; $("#close").onclick = () => dlg.close();
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

/* ===== Stars & motion ===== */
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const layers = [{n:34,s:[1,1.5],k:.015,d:160},{n:22,s:[1.5,2.2],k:.04,d:110},{n:9,s:[2.4,3.4],k:.09,d:80}].map(L => {
  const l = document.createElement("div"), d = document.createElement("div"); l.className = "sl"; d.className = "sd"; d.style.setProperty("--dd", L.d + "s"); l.appendChild(d);
  for (let i = 0; i < L.n; i++){ const e = document.createElement("i"), z = L.s[0] + Math.random() * (L.s[1] - L.s[0]);
    e.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${z}px;height:${z}px;opacity:${.25+Math.random()*.65}`;
    if (Math.random() < .45 && !still){ e.className = "t"; e.style.setProperty("--t", 3 + Math.random() * 6 + "s"); e.style.setProperty("--dl", -Math.random() * 8 + "s"); }
    d.appendChild(e); }
  $("#stars").appendChild(l); return { l, k: L.k };
});
let mx = 0, raf = 0;
const par = () => { raf = 0; layers.forEach(({l, k}) => l.style.transform = `translate3d(${-mx*k*80}px,${-scrollY*k}px,0)`); };
const req = () => raf || (raf = requestAnimationFrame(par));
if (!still){ addEventListener("scroll", req, {passive:true});
  addEventListener("pointermove", e => { if (e.pointerType === "mouse"){ mx = e.clientX / innerWidth - .5; req(); } }, {passive:true}); }
if (still) document.querySelectorAll("animateMotion").forEach(a => a.remove());
document.addEventListener("visibilitychange", () => { const h = document.hidden; document.documentElement.classList.toggle("paused", h); document.querySelectorAll("svg").forEach(v => h ? v.pauseAnimations() : v.unpauseAnimations()); });
try { localStorage.setItem("seen", "1"); } catch(e){}
/* ===== Recently played carousel: GET /api/recent (the server records new songs from Discord and returns the stored last 10).
   States: loading -> ok | empty | error. Real data only: never invented tracks ===== */
const hist = $("#hist"), histSec = $("#history"), histMsg = $("#hist-msg"), dots = $("#car-dots"), cPrev = $("#car-prev"), cNext = $("#car-next"); let histKey = "", histState = "loading", histBusy = false, cur = 0;
function fmtPlayed(iso){ const d = new Date(iso); if (isNaN(d)) return ""; const today = d.toDateString() === new Date().toDateString();
  try { return new Intl.DateTimeFormat(lang, today ? { hour:"2-digit", minute:"2-digit" } : { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }).format(d); } catch(e){ return d.toLocaleString(); } }
function updateHistTimes(){ hist.querySelectorAll("time[datetime]").forEach(t => { const iso = t.getAttribute("datetime"), d = new Date(iso); t.textContent = fmtPlayed(iso); t.title = isNaN(d) ? "" : d.toLocaleString(lang); }); }
const cards = () => [...hist.children];
function step(){ const c = cards(); if (c.length < 2) return c[0] ? (c[0].offsetWidth || 0) : 0; return (c[1].offsetLeft - c[0].offsetLeft) || c[0].offsetWidth || 0; }
function carState(){
  const c = cards(), st = step() || 1, max = Math.max(0, (hist.scrollWidth || 0) - (hist.clientWidth || 0));
  cur = Math.min(c.length - 1, Math.max(0, Math.round((hist.scrollLeft || 0) / st)));
  cPrev.disabled = !c.length || (hist.scrollLeft || 0) <= 1; cNext.disabled = !c.length || (hist.scrollLeft || 0) >= max - 1;
  [...dots.children].forEach((d, i) => d.setAttribute("aria-current", i === cur ? "true" : "false"));
}
function goTo(i){ const c = cards(); if (!c.length) return; const k = Math.min(c.length - 1, Math.max(0, i)); try { hist.scrollTo({ left: k * step(), behavior: still ? "auto" : "smooth" }); } catch(e){ hist.scrollLeft = k * step(); } }
function page(dir){ const per = Math.max(1, Math.floor((hist.clientWidth || 1) / (step() || 1))); goTo(cur + dir * per); }
cPrev.onclick = () => page(-1); cNext.onclick = () => page(1);
let carRaf = 0; hist.addEventListener("scroll", () => { if (!carRaf) carRaf = requestAnimationFrame(() => { carRaf = 0; carState(); }); }, { passive:true });
hist.addEventListener("keydown", e => { if (e.key === "ArrowRight"){ e.preventDefault(); page(1); } else if (e.key === "ArrowLeft"){ e.preventDefault(); page(-1); } });
addEventListener("resize", () => carState());
function renderHistoryState(){
  const m = histState === "ok" ? "" : tr(histState === "loading" ? "loading" : histState === "empty" ? "historyEmpty" : "historyError");
  histMsg.textContent = m; histMsg.hidden = !m; hist.hidden = histState !== "ok"; dots.hidden = histState !== "ok" || cards().length < 2; histSec.hidden = false; histSec.dataset.s = histState;
  $("#car-prev").parentNode.hidden = histState !== "ok"; updateHistTimes(); carState();
}
function renderHistory(items){
  histState = items.length ? "ok" : "empty";
  const key = items.map(i => i.id + "@" + (i.playedAt || "")).join(","); /* same track played twice = two plays */
  if (key !== histKey){ histKey = key;
    hist.replaceChildren(...items.map(i => { const li = document.createElement("li"), a = document.createElement("a"), t = document.createElement("strong"), r = document.createElement("span"), tm = document.createElement("time");
      if (i.url){ a.href = i.url; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("data-i18n-title", "openSpotify"); a.title = tr("openSpotify"); }
      if (/^https:\/\//.test(i.cover || "")){ const im = document.createElement("img"); im.src = i.cover; im.alt = ""; im.width = im.height = 240; im.loading = "lazy"; im.decoding = "async"; a.appendChild(im); } else a.appendChild(document.createElement("div")).className = "ph";
      t.textContent = i.title; r.textContent = i.artists || ""; if (i.playedAt && !isNaN(new Date(i.playedAt))) tm.setAttribute("datetime", i.playedAt); a.append(t, r, tm); li.appendChild(a); return li; }));
    dots.replaceChildren(...items.map((_, k) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", tr("song") + " " + (k + 1)); b.onclick = () => goTo(k); return b; }));
    try { hist.scrollLeft = 0; } catch(e){} }
  renderHistoryState();
}
async function loadHistory(){ if (document.hidden || histBusy) return; histBusy = true;
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 12000);
  try { const r = await fetch("/api/recent", { signal: ctl.signal, headers: { Accept: "application/json" } }); if (!r.ok) throw 0; const j = await r.json();
    if (!j || !Array.isArray(j.items)) throw 0;
    renderHistory(j.items.filter(i => i && i.title && (!i.url || /^https:\/\/open\.spotify\.com\//.test(i.url))).slice(0, 10));
  } catch(e){ if (histState !== "ok"){ histState = "error"; renderHistoryState(); } /* a transient failure keeps the last good carousel */ }
  finally { clearTimeout(to); histBusy = false; } }
document.addEventListener("visibilitychange", () => { if (!document.hidden){ if (histState !== "ok") loadHistory(); else startHistory(); loadProfile(); } });
/* polling: the server only records while somebody (or the optional scheduler) calls it; /api/recent is CDN-cached 8 s, so many visitors cost almost nothing */
const startHistory = () => { clearInterval(histT); loadHistory(); histT = setInterval(loadHistory, 15000); };
renderHistoryState(); startHistory(); loadProfile();
[metaTheme, applyLang, connect].forEach(f => { try { f(); } catch(e){ console.error(e); } }); /* one failing step must not stop the others */
