/* Reads the current Spotify activity from Discord (via Lanyard), records it when it is a new play, returns the stored history.
   Only the server decides what is recorded, and it only uses data fetched here from Lanyard: a visitor cannot inject entries. */
"use strict";
const { fetchPresence, spotifyFrom, discordId } = require("./lanyard");
const { applyTrack } = require("./history");
const store = require("./storage");

async function sync() {
  let items = await store.loadItems();                 /* storage errors propagate: without storage there is no history */
  let track = null, live = true;
  try { track = spotifyFrom(await fetchPresence(discordId())); }
  catch (e) { live = false; console.error("[sync] presence unavailable:", e.code || e.message); }  /* keep showing the stored history */
  if (!track) return { items, added: false, live };
  if (!(await store.lock())) return { items, added: false, live };   /* another request is recording right now */
  try {
    items = await store.loadItems();                    /* re-read inside the lock */
    const r = applyTrack(items, track, new Date().toISOString());
    if (r.added) await store.saveItems(r.items);
    return { items: r.items, added: r.added, live };
  } finally { await store.unlock(); }
}

module.exports = { sync };
