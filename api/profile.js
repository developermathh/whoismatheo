/* GET /api/profile -> public profile of the owner for the Discord card.
   Sources (both legitimate, nothing private):
     1. Lanyard (same source as the live presence): username, display name, avatar, avatar decoration, public flags.
     2. Discord's OFFICIAL API  GET /users/{id}  with YOUR BOT's token (env DISCORD_BOT_TOKEN, server only): banner, accent colour.
        Without that variable the banner is simply not available and the card shows its neutral fallback.
   NOT available from any official API: the "About me" bio, Nitro/boost/Quest badges. They are never invented.
   Success: 200 { id, username, displayName, avatar, decoration, banner: {url, staticUrl, animated} | null, accentColor, badges: [], bannerSource } */
const { sendJson, allowGet, sendError, timeout } = require("./_lib/http");
const { fetchPresence, discordId, ID_RE } = require("./_lib/lanyard");
const { badgesFrom } = require("./_lib/badges");

const CDN = "https://cdn.discordapp.com";
const HASH_RE = /^(a_)?[a-f0-9]{8,64}$/i;

async function officialUser(id) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return { status: "no_token" };
  try {
    const r = await fetch("https://discord.com/api/v10/users/" + id, { headers: { Authorization: "Bot " + token, "User-Agent": "whoismatheo (https://whoismatheo.vercel.app, 1.0)" }, signal: timeout(6000) });
    if (!r.ok) { console.error("[api/profile] discord api", r.status); return { status: r.status === 401 ? "bad_token" : "error" }; }
    return { status: "ok", user: await r.json() };
  } catch (e) { console.error("[api/profile] discord api unreachable", e && e.message); return { status: "error" }; }
}

module.exports = async (req, res) => {
  if (!allowGet(req, res)) return;
  const id = discordId();
  try {
    if (!ID_RE.test(String(id || ""))) { const e = new Error("not_configured"); e.code = "not_configured"; e.status = 503; e.detail = "DISCORD_USER_ID missing"; throw e; }
    const [pres, off] = await Promise.all([fetchPresence(id).catch(e => { console.error("[api/profile] lanyard", e.code); return null; }), officialUser(id)]);
    const lu = (pres && pres.discord_user) || {}, ou = off.user || {};
    const u = Object.assign({}, lu, ou);                                /* the official API wins when both answer */
    if (!u.id) { const e = new Error("unavailable"); e.code = "unavailable"; throw e; }
    const avatarHash = HASH_RE.test(u.avatar || "") ? u.avatar : "";
    const bannerHash = HASH_RE.test(ou.banner || "") ? ou.banner : "";
    const dec = (u.avatar_decoration_data && /^[A-Za-z0-9_]{4,80}$/.test(u.avatar_decoration_data.asset || "")) ? u.avatar_decoration_data.asset : "";
    const animated = bannerHash.startsWith("a_");
    const body = {
      id: u.id, username: u.username || "", displayName: u.global_name || u.display_name || u.username || "",
      avatar: avatarHash ? `${CDN}/avatars/${u.id}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}?size=256` : "",
      avatarStatic: avatarHash ? `${CDN}/avatars/${u.id}/${avatarHash}.png?size=256` : "",
      decoration: dec ? `${CDN}/avatar-decoration-presets/${dec}.png?size=160&passthrough=true` : "",
      banner: bannerHash ? { url: `${CDN}/banners/${u.id}/${bannerHash}.${animated ? "gif" : "png"}?size=1024`, staticUrl: `${CDN}/banners/${u.id}/${bannerHash}.png?size=1024`, animated } : null,
      accentColor: Number.isInteger(ou.accent_color) && ou.accent_color >= 0 && ou.accent_color <= 0xFFFFFF ? "#" + ou.accent_color.toString(16).padStart(6, "0") : "",
      badges: badgesFrom(u.public_flags),
      bannerSource: off.status                                           /* ok | no_token | bad_token | error */
    };
    sendJson(res, 200, body, "public, s-maxage=300, stale-while-revalidate=600");
  } catch (e) { sendError(res, e, "api/profile", "public, s-maxage=30"); }
};
