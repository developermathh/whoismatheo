/* ===== CONFIG: edit here ===== */
const CONFIG = {
  discordUserId: "",          // your numeric Discord ID (join discord.gg/lanyard so Lanyard can see you)
  track: { src: "", title: "", artist: "", cover: "" }, // e.g. src:"audio/song.mp3"
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
 aboutText:["Write something about yourself here.","Escribe algo sobre ti aquí.","Напишите здесь что-нибудь о себе.","Schreibe hier etwas über dich.","Écris quelque chose sur toi ici."],
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
 footer:["somewhere on the internet","en algún lugar de internet","где-то в интернете","irgendwo im Internet","quelque part sur internet"]
};
const $ = s => document.querySelector(s);
let lang = localStorage.getItem("lang"); if (!LANGS.includes(lang)) lang = "en";
const tr = k => (T[k] || [])[LANGS.indexOf(lang)] || k;
let conn = CONFIG.discordUserId ? "connecting" : "notConfigured", pres = null;
let playerState = { blocked:false, error:false };

function setText(el, t){ if (el.textContent === t) return; el.textContent = t; if (!el.dataset.rdy){ el.dataset.rdy = 1; return; } el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); }
function renderPresence(){
  setText($("#conn-text"), tr(conn)); $("#conn-dot").dataset.s = conn; $("#discord").dataset.c = conn;
  const d = pres, sp = $("#spotify");
  const st = d ? d.discord_status : "offline";
  $("#st-dot").dataset.s = st;
  setText($("#status"), d ? tr(st) : tr(conn === "notConfigured" ? "notConfigured" : conn === "live" ? "offline" : conn));
  if (!d){ setText($("#name"), "—"); setText($("#activity"), ""); $("#av").hidden = true; $("#av-fb").hidden = false; sp.hidden = true; return; }
  const u = d.discord_user || {};
  setText($("#name"), u.global_name || u.display_name || u.username || "—");
  if (u.avatar){ $("#av").src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`; $("#av").hidden = false; $("#av-fb").hidden = true; }
  else { $("#av").hidden = true; $("#av-fb").hidden = false; }
  const act = (d.activities || []).find(a => a.type !== 4 && a.id !== "spotify:1");
  setText($("#activity"), act ? act.name + (act.details ? " — " + act.details : "") : tr("noActivity"));
  if (d.listening_to_spotify && d.spotify){
    $("#sp-art").src = d.spotify.album_art_url || ""; $("#sp-song").textContent = d.spotify.song;
    $("#sp-artist").textContent = d.spotify.artist; $("#sp-album").textContent = d.spotify.album; sp.hidden = false;
  } else sp.hidden = true;
}
let ws, hb, rt, wt, tries = 0, everLive = false;
function connect(){
  if (!CONFIG.discordUserId || (ws && ws.readyState < 2)) return;
  clearTimeout(rt); conn = everLive ? "reconnecting" : "connecting"; renderPresence();
  let s;
  try { s = ws = new WebSocket("wss://api.lanyard.rest/socket"); } catch(e){ return retry(); }
  s.onmessage = e => { if (s !== ws) return; let m; try { m = JSON.parse(e.data); } catch(_){ return; }
    if (m.op === 1){ clearInterval(hb); hb = setInterval(() => s.readyState === 1 && s.send('{"op":3}'), m.d.heartbeat_interval);
      s.send(JSON.stringify({ op:2, d:{ subscribe_to_id: CONFIG.discordUserId } }));
      wt = setTimeout(() => { if (!pres){ conn = "unavailable"; renderPresence(); } }, 8000); }
    if (m.op === 0 && m.d && m.d.discord_user){ clearTimeout(wt); pres = m.d; conn = "live"; everLive = true; tries = 0; renderPresence(); } };
  s.onclose = () => { if (s !== ws) return; clearInterval(hb); clearTimeout(wt); retry(); };
  s.onerror = () => s.close();
}
function retry(){ conn = everLive ? "reconnecting" : "unavailable"; renderPresence(); clearTimeout(rt); rt = setTimeout(connect, Math.min(30000, 2000 * ++tries)); }
addEventListener("online", () => { tries = 0; connect(); });
$("#sp-art").onerror = e => e.target.style.visibility = "hidden";

/* ===== Player ===== */
const audio = new Audio(); audio.loop = true; audio.volume = .5; audio.preload = "metadata";
const tk = CONFIG.track, pl = $("#player"), seek = $("#seek"); let seeking = false;
const fmt = n => isFinite(n) ? Math.floor(n / 60) + ":" + String(Math.floor(n % 60)).padStart(2, "0") : "0:00";
const fill = el => el.style.setProperty("--p", (el.value - el.min) / (el.max - el.min) * 100 + "%");
const failPlay = e => { if (e && e.name === "NotAllowedError") playerState.blocked = true; else playerState.error = true; renderPlayer(); };
if (tk.src){ audio.src = tk.src; pl.classList.add("has-src"); $("#play").disabled = false;
  audio.onerror = () => { playerState.error = true; renderPlayer(); };
  audio.onplaying = () => { playerState.error = false; playerState.blocked = false; renderPlayer(); }; }
audio.onplay = audio.onpause = () => renderPlayer();
audio.onloadedmetadata = () => { seek.disabled = !isFinite(audio.duration); $("#t-dur").textContent = fmt(audio.duration); };
audio.ontimeupdate = () => { if (isFinite(audio.duration) && !seeking){ seek.value = audio.currentTime / audio.duration; fill(seek); } $("#t-cur").textContent = fmt(audio.currentTime); };
seek.oninput = () => { seeking = true; fill(seek); $("#t-cur").textContent = fmt(seek.value * audio.duration); };
seek.onchange = () => { audio.currentTime = seek.value * audio.duration; seeking = false; };
function renderPlayer(){
  setText($("#p-title"), tk.title || tr("noTrack")); setText($("#p-artist"), tk.artist || "");
  $("#cover").hidden = !tk.cover; if (tk.cover && $("#cover").getAttribute("src") !== tk.cover) $("#cover").src = tk.cover;
  const playing = !audio.paused;
  pl.classList.toggle("playing", playing); pl.classList.toggle("blocked", playerState.blocked && !playing);
  $("#play").setAttribute("aria-label", tr(playing ? "pause" : "play"));
  setText($("#p-status"), !tk.src ? "" : playerState.error ? tr("loadError") : playing ? tr("playing") : playerState.blocked ? tr("tapToPlay") : tr("paused"));
}
$("#cover").onerror = e => e.target.hidden = true;
$("#play").onclick = () => { if (audio.paused) audio.play().catch(failPlay); else audio.pause(); };
$("#volume").oninput = e => { audio.volume = e.target.value; fill(e.target); }; fill($("#volume"));
if (tk.src) audio.play().catch(failPlay);

/* ===== Theme, language, letter ===== */
$("#theme").onclick = () => { const h = document.documentElement, n = h.dataset.theme === "dark" ? "light" : "dark"; h.classList.add("tt"); h.dataset.theme = n;
  try { localStorage.setItem("theme", n); } catch(e){} setTimeout(() => h.classList.remove("tt"), 800); metaTheme(); };
const metaTheme = () => $("meta[name=theme-color]").content = document.documentElement.dataset.theme === "dark" ? "#080808" : "#F6F5F2";
$("#lang").onchange = e => { lang = e.target.value; localStorage.setItem("lang", lang); applyLang(); };
function applyLang(){
  document.documentElement.lang = lang; $("#lang").value = lang;
  document.querySelectorAll("[data-i18n]").forEach(e => e.textContent = tr(e.dataset.i18n));
  document.querySelectorAll("[data-i18n-label]").forEach(e => e.setAttribute("aria-label", tr(e.dataset.i18nLabel)));
  $("#l-body").textContent = CONFIG.dedicationMessage || tr("placeholder");
  renderPresence(); renderPlayer();
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
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.12}) : null;
document.querySelectorAll(".rv").forEach(e => io ? io.observe(e) : e.classList.add("in"));
if (still) document.querySelectorAll("animateMotion").forEach(a => a.remove());
document.addEventListener("visibilitychange", () => { const h = document.hidden; document.documentElement.classList.toggle("paused", h); document.querySelectorAll("svg").forEach(v => h ? v.pauseAnimations() : v.unpauseAnimations()); });
try { localStorage.setItem("seen", "1"); } catch(e){}
metaTheme(); applyLang(); connect();
