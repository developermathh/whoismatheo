/* Reads the current Spotify activity from Discord (via Lanyard), records it when it is a new play, returns the stored history.
   Only the server decides what is recorded, and it only uses data fetched here from Lanyard: a visitor cannot inject entries. */
"use strict";
const { fetchPresence, spotifyFrom, discordId } = require("./lanyard");
const { applyTrack, keyOf } = require("./history");
const lastfm = require("./lastfm");
const store = require("./storage");

const publicNow = t => t ? { id: t.id, title: t.title, artists: t.artists, album: t.album, cover: t.cover, url: t.url, durationMs: t.durationMs || 0 } : null;

async function sync() {
  let items = await store.loadItems();                 /* storage errors propagate: without storage there is no history */
  let track = null, live = true;
  try { track = spotifyFrom(await fetchPresence(discordId())); }
  catch (e) { live = false; console.error("[sync] presence unavailable:", e.code || e.message); }  /* keep showing the stored history */
  if (!track && lastfm.configured()) {                 /* second source (optional): Last.fm, used only when Discord reports no Spotify */
    try {
      track = await lastfm.nowPlaying(); if (track) live = true;
      if (track && !(items[0] && keyOf(items[0]) === keyOf(track))) track.durationMs = await lastfm.duration(track);
    } catch (e) { console.error("[sync] last.fm unavailable:", e.code || e.message); }
  }
  if (!track) return { items, added: false, live, now: null };
  if (!(await store.lock())) return { items, added: false, live, now: publicNow(track) };   /* another request is recording right now */
  try {
    items = await store.loadItems();                    /* re-read inside the lock */
    const r = applyTrack(items, track, new Date().toISOString());
    if (r.added) await store.saveItems(r.items);
    return { items: r.items, added: r.added, live, now: publicNow(track) };
  } finally { await store.unlock(); }
}

module.exports = { sync };
