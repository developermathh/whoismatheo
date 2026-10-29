/* GET /api/recent  ->  { items: [{ id, title, artists, album, cover, url, playedAt }], live }   (newest first, at most 10)
   Each call also checks what Discord says you are listening to and records a new play if there is one (see _lib/sync.js).
   Failure: { error: storage_not_configured | storage_unreachable | storage_error | unavailable } */
const { sendJson, allowGet, sendError } = require("./_lib/http");
const { sync } = require("./_lib/sync");
const { publicItems } = require("./_lib/history");

module.exports = async (req, res) => {
  if (!allowGet(req, res)) return;
  try {
    const r = await sync();
    sendJson(res, 200, { items: publicItems(r.items), live: r.live }, "public, s-maxage=8, stale-while-revalidate=20");
  } catch (e) { sendError(res, e, "api/recent"); }
};
