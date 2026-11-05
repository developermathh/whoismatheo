/* Pure logic of the "recently played" list (no network, no storage): easy to test. */
"use strict";
const MAX = 10;

/* Key of a play. Items without a Spotify id (local files) are identified by title+artists. */
const keyOf = t => t.id || ("local:" + t.title + "|" + t.artists);

/* Track length in ms, taken from the same Discord timestamps (end - start). 0 = unknown (older entries, or Discord gave no end). */
const MAX_DURATION = 6 * 3600e3;
const durationOf = t => { const d = (+t.endMs || 0) - (+t.startMs || 0); if (t.startMs > 0 && d > 0 && d <= MAX_DURATION) return Math.round(d); return +t.durationMs >= 1000 && +t.durationMs <= MAX_DURATION ? Math.round(+t.durationMs) : 0; };   /* from Discord timestamps, or an explicit durationMs (Last.fm) */

/* Same SONG? Two entries match when both have a Spotify id and it is equal, or (when one of them has no id, e.g. a Last.fm entry) when title and first artist are equal ignoring case, accents and punctuation. */
const norm = x => String(x || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const firstArtist = a => norm(String(a || "").split(",")[0]);
const sameSong = (a, b) => {
  if (!a || !b) return false;
  if (a.id && b.id) return a.id === b.id;
  const t = norm(a.title); return !!t && t === norm(b.title) && firstArtist(a.artists) === firstArtist(b.artists);
};

/* A NEW play of the same song (a repeat) starts right when the previous one ended: Discord's start timestamp is then ~ the previous end.
   Pause/resume, seeking and reconnects also change Discord's timestamps, but they land anywhere else, so they are NOT repeats. */
const REPEAT_SLACK = 2000, REPEAT_TOL = 20000;
const isRepeat = (older, newer) => +older.endMs > 0 && +newer.startMs > 0 && newer.startMs >= older.endMs - REPEAT_SLACK && newer.startMs - older.endMs <= REPEAT_TOL;

/* Merge consecutive entries of the same song that are not real repeats (duplicates saved by older versions, or by Last.fm + Discord both reporting the same play). Newest first in and out. */
function collapse(items) {
  const out = [];
  for (const it of Array.isArray(items) ? items : []) {
    const a = out[out.length - 1];
    if (a && sameSong(a, it) && !isRepeat(it, a)) { if (!a.id && it.id) { a.id = it.id; a.url = it.url || a.url; } if (!a.cover && it.cover) a.cover = it.cover; if (!(+a.durationMs > 0) && +it.durationMs > 0) a.durationMs = it.durationMs; continue; }
    out.push(Object.assign({}, it));
  }
  return out.slice(0, MAX);
}

/* Returns { items, added } (+ updated: true when only the newest entry was refreshed). items = newest first, at most MAX.
   - no track (nothing detected)                          -> history untouched
   - same song as the newest entry, same play             -> nothing added (still playing, paused/resumed, seeked, or reported by another source); the newest entry only gets fresher timestamps / missing id
   - same song, and a NEW play started right when the previous one ended (repeat) -> added
   - any other song (including one that played before, after other songs) -> added at the top */
function applyTrack(items, track, nowIso) {
  const list = Array.isArray(items) ? items.slice(0, MAX) : [];
  if (!track || !track.title) return { items: list, added: false };
  const head = list[0];
  if (head && sameSong(head, track) && !isRepeat(head, track)) {
    const next = Object.assign({}, head); let changed = false;
    if (!next.id && track.id) { next.id = track.id; next.url = track.url || next.url; changed = true; }
    if (!next.cover && track.cover) { next.cover = track.cover; changed = true; }
    if (+track.startMs > 0 && (next.startMs !== track.startMs || next.endMs !== (track.endMs || 0))) { next.startMs = track.startMs; next.endMs = track.endMs || 0; changed = true; }
    const d = durationOf(track); if (!(+next.durationMs > 0) && d > 0) { next.durationMs = d; changed = true; }
    if (!changed) return { items: list, added: false };
    return { items: [next].concat(list.slice(1)), added: false, updated: true };
  }
  const entry = { id: track.id, title: track.title, artists: track.artists, album: track.album, cover: track.cover, url: track.url,
    playedAt: nowIso, startMs: track.startMs || 0, endMs: track.endMs || 0, durationMs: durationOf(track) };
  return { items: [entry].concat(list).slice(0, MAX), added: true };
}

/* What the browser receives: no internal fields (start/end timestamps stay on the server). durationMs is 0 when unknown. */
const publicItems = items => (items || []).slice(0, MAX).map(i => ({ id: i.id, title: i.title, artists: i.artists, album: i.album, cover: i.cover, url: i.url, playedAt: i.playedAt, durationMs: (+i.durationMs > 0 && +i.durationMs <= MAX_DURATION) ? Math.round(+i.durationMs) : 0 }));

module.exports = { MAX, applyTrack, collapse, sameSong, publicItems, keyOf, durationOf };
