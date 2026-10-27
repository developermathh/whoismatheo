/* Vercel serverless function: GET /api/recent
   Returns the owner's recently played Spotify tracks. Secrets live only in Vercel environment variables:
   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN (scope: user-read-recently-played). */
let cache = { token: null, exp: 0 };
const fail = (code, msg) => Object.assign(new Error(msg), { code });

async function getToken(force) {
  if (!force && cache.token && Date.now() < cache.exp) return cache.token;
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) throw fail(503, "not_configured");
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh })
  });
  if (!r.ok) throw fail(502, "auth");
  const j = await r.json();
  if (!j.access_token) throw fail(502, "auth");
  cache = { token: j.access_token, exp: Date.now() + Math.max(60, (j.expires_in || 3600) - 60) * 1000 };
  return cache.token;
}

async function fetchRecent(force) {
  const token = await getToken(force);
  return fetch("https://api.spotify.com/v1/me/player/recently-played?limit=30", { headers: { Authorization: "Bearer " + token } });
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    let r = await fetchRecent(false);
    if (r.status === 401) r = await fetchRecent(true); /* expired token: refresh once */
    if (r.status === 429) throw fail(429, "rate_limited");
    if (!r.ok) throw fail(502, "upstream");
    const j = await r.json(), seen = new Set(), items = [];
    for (const it of j.items || []) {
      const t = it && it.track;
      if (!t || !t.id || seen.has(t.id)) continue;
      seen.add(t.id);
      const imgs = (t.album && t.album.images) || [];
      items.push({
        id: t.id, title: t.name, artists: (t.artists || []).map(a => a.name).join(", "),
        cover: (imgs[1] || imgs[0] || {}).url || "", url: (t.external_urls && t.external_urls.spotify) || "https://open.spotify.com/track/" + t.id,
        playedAt: it.played_at
      });
      if (items.length >= 10) break;
    }
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(JSON.stringify({ items }));
  } catch (e) {
    res.status(e.code || 502).send(JSON.stringify({ error: e.message === "not_configured" ? "not_configured" : "unavailable" })); /* no technical details leak */
  }
};
