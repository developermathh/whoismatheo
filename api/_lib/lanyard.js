/* Reads the SAME data source the website already uses in the browser: Lanyard (https://github.com/Phineas/lanyard),
   which mirrors your Discord presence, including the "listening to Spotify" activity (also from Discord on Android).
   Server side we use its public REST twin of the WebSocket. No Spotify API, no OAuth, no tokens, no user credentials. */
"use strict";
const { timeout, fail } = require("./http");

const BASE = "https://api.lanyard.rest/v1/users/";
const ID_RE = /^\d{15,25}$/;
const DEFAULT_ID = "1356268956398387423"; /* your public Discord ID (same as CONFIG.discordUserId in script.js); DISCORD_USER_ID overrides it */
const discordId = () => process.env.DISCORD_USER_ID || DEFAULT_ID;
const TRACK_RE = /^[A-Za-z0-9]{22}$/;   /* a Spotify track id; anything else (local file, podcast) gets no link */

async function fetchPresence(userId) {
  if (!ID_RE.test(String(userId || ""))) throw fail(503, "not_configured", "invalid or missing DISCORD_USER_ID");
  let r;
  try { r = await fetch(BASE + userId, { headers: { Accept: "application/json" }, signal: timeout(8000) }); }
  catch (e) { throw fail(502, "lanyard_unreachable", String(e && e.message)); }
  if (r.status === 404) throw fail(502, "lanyard_not_monitored", "Lanyard does not monitor this user: join discord.gg/lanyard");
  if (!r.ok) throw fail(502, "lanyard_error", "lanyard " + r.status);
  let j = null; try { j = await r.json(); } catch (_) {}
  if (!j || j.success !== true || !j.data || typeof j.data !== "object") throw fail(502, "lanyard_error", "unexpected lanyard payload");
  return j.data;
}

/* The Spotify activity exactly as Discord reports it, or null. Nothing is invented: missing fields stay empty. */
function spotifyFrom(data) {
  const s = data && data.listening_to_spotify && data.spotify;
  if (!s || typeof s !== "object" || !s.song) return null;
  const id = TRACK_RE.test(String(s.track_id || "")) ? s.track_id : "";
  const start = Number(s.timestamps && s.timestamps.start) || 0, end = Number(s.timestamps && s.timestamps.end) || 0;
  return {
    id,
    title: String(s.song),
    artists: String(s.artist || "").split(";").map(x => x.trim()).filter(Boolean).join(", "),
    album: String(s.album || ""),
    cover: /^https:\/\//.test(s.album_art_url || "") ? s.album_art_url : "",
    url: id ? "https://open.spotify.com/track/" + id : "",
    startMs: start, endMs: end > start ? end : 0
  };
}

module.exports = { fetchPresence, spotifyFrom, discordId, ID_RE, TRACK_RE };
