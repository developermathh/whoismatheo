/* Vercel serverless function: GET /api/recent
   Returns the owner's most recent Spotify plays (up to 10, newest first, exactly what Spotify returns).
   Secrets live only in Vercel environment variables (Project -> Settings -> Environment Variables):
   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN (scope: user-read-recently-played).
   Success: 200 { items: [...] }  (items may be [] if Spotify has no recent plays)
   Failure: non-200 { error: <code> } with one of: not_configured | auth | forbidden | rate_limited | upstream | unavailable.
   Details of a failure (status + Spotify's error text, never a secret) go to the Vercel function logs only. */
let cache = { token: null, exp: 0 };
const fail = (code, reason, detail) => Object.assign(new Error(reason), { code, reason, detail });
const timeout = () => (typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined);
async function spotifyError(r) {
  try { const e = await r.json(); const x = e && (e.error_description || (e.error && (e.error.message || e.error))); return r.status + " " + (typeof x === "string" ? x : ""); }
  catch (_) { return String(r.status); }
}

async function getToken(force) {
  if (!force && cache.token && Date.now() < cache.exp) return cache.token;
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) throw fail(503, "not_configured", "missing: " + [!id && "SPOTIFY_CLIENT_ID", !secret && "SPOTIFY_CLIENT_SECRET", !refresh && "SPOTIFY_REFRESH_TOKEN"].filter(Boolean).join(", "));
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    signal: timeout()
  });
  if (!r.ok) throw fail(502, "auth", "token endpoint " + (await spotifyError(r)));
  const j = await r.json();
  if (!j.access_token) throw fail(502, "auth", "token endpoint returned no access_token");
  cache = { token: j.access_token, exp: Date.now() + Math.max(60, (j.expires_in || 3600) - 60) * 1000 };
  return cache.token;
}

async function fetchRecent(force) {
  const token = await getToken(force);
  return fetch("https://api.spotify.com/v1/me/player/recently-played?limit=20", { headers: { Authorization: "Bearer " + token }, signal: timeout() });
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    let r = await fetchRecent(false);
    if (r.status === 401) r = await fetchRecent(true); /* expired token: refresh once */
    if (r.status === 429) throw fail(429, "rate_limited", "429");
    if (r.status === 403) throw fail(502, "forbidden", "recently-played " + (await spotifyError(r))); /* e.g. missing scope, or the account is not allowed for this development-mode app */
    if (!r.ok) throw fail(502, "upstream", "recently-played " + (await spotifyError(r)));
    const j = await r.json(), items = [];
    for (const it of j.items || []) {
      const t = it && it.track;
      if (!t || !t.id) continue; /* local files have no id: skipped, never invented */
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
    console.error("[api/recent]", e.reason || "unavailable", e.detail || e.message || e);
    res.setHeader("Cache-Control", "no-store");
    res.status(e.code || 502).send(JSON.stringify({ error: e.reason || "unavailable" })); /* a short code only: no technical details leak */
  }
};
