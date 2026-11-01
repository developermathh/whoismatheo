/* Pure logic of the "recently played" list (no network, no storage): easy to test. */
"use strict";
const MAX = 10;

/* Key of a play. Items without a Spotify id (local files) are identified by title+artists. */
const keyOf = t => t.id || ("local:" + t.title + "|" + t.artists);

/* Track length in ms, taken from the same Discord timestamps (end - start). 0 = unknown (older entries, or Discord gave no end). */
const MAX_DURATION = 6 * 3600e3;
const durationOf = t => { const d = (+t.endMs || 0) - (+t.startMs || 0); return t.startMs > 0 && d > 0 && d <= MAX_DURATION ? Math.round(d) : 0; };

/* Returns { items, added }. items = newest first, at most MAX.
   - no track (nothing detected)                         -> history untouched
   - same track as the newest entry, still the same play  -> nothing added (it is still playing)
   - same track, but a NEW play started after the previous one ended (repeat) -> added
   - any other track (including one that played before, after other songs)   -> added at the top */
function applyTrack(items, track, nowIso) {
  const list = Array.isArray(items) ? items.slice(0, MAX) : [];
  if (!track || !track.title) return { items: list, added: false };
  const head = list[0];
  if (head && keyOf(head) === keyOf(track)) {
    const repeated = head.endMs > 0 && track.startMs >= head.endMs;   /* the previous play is over and a new one started */
    if (!repeated) return { items: list, added: false };
  }
  const entry = { id: track.id, title: track.title, artists: track.artists, album: track.album, cover: track.cover, url: track.url,
    playedAt: nowIso, startMs: track.startMs || 0, endMs: track.endMs || 0, durationMs: durationOf(track) };
  return { items: [entry].concat(list).slice(0, MAX), added: true };
}

/* What the browser receives: no internal fields (start/end timestamps stay on the server). durationMs is 0 when unknown. */
const publicItems = items => (items || []).slice(0, MAX).map(i => ({ id: i.id, title: i.title, artists: i.artists, album: i.album, cover: i.cover, url: i.url, playedAt: i.playedAt, durationMs: (+i.durationMs > 0 && +i.durationMs <= MAX_DURATION) ? Math.round(+i.durationMs) : 0 }));

module.exports = { MAX, applyTrack, publicItems, keyOf, durationOf };
