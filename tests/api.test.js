/* Offline tests for the Vercel functions. Lanyard (Discord), Discord's API and Upstash Redis are SIMULATED (fetch is mocked, the Redis
   fake is an in-memory map): they prove the logic, persistence behaviour, security and error handling, NOT that your real accounts work.
   Run: node tests/api.test.js   (Node 18+, no dependencies) */
"use strict";
const assert = require("assert"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const ID = "1356268956398387423";
const REDIS = { UPSTASH_REDIS_REST_URL: "https://fake-redis.upstash.io", UPSTASH_REDIS_REST_TOKEN: "REDIS_TOKEN_secret" };
const ENVKEYS = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_URL", "KV_REST_API_TOKEN", "DISCORD_USER_ID", "DISCORD_BOT_TOKEN", "TRACK_SECRET", "CRON_SECRET"];

function load(name, env) {                      /* fresh module instances = a "restarted" serverless environment */
  for (const k of Object.keys(require.cache)) if (k.startsWith(path.join(root, "api"))) delete require.cache[k];
  for (const k of ENVKEYS) delete process.env[k];
  Object.assign(process.env, env || {});
  return require(path.join(root, "api", name));
}
const J = (b, status) => new Response(JSON.stringify(b), { status: status || 200, headers: { "Content-Type": "application/json" } });
function call(handler, { method = "GET", headers = {} } = {}) {
  return new Promise(resolve => { const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(b) { resolve({ status: this.statusCode, headers: this.headers, body: b || "" }); } };
    Promise.resolve(handler({ method, headers }, res)).catch(e => resolve({ status: 500, headers: {}, body: "THROW " + e.stack })); });
}

/* ---- fakes ---- */
const db = { data: new Map(), fail: false };     /* the "Upstash database" survives module reloads, like the real one survives restarts */
const sp = (id, song, extra) => Object.assign({ track_id: id, song, artist: "Artist A; Artist B", album: "Alb", album_art_url: "https://i.scdn.co/image/" + id, timestamps: { start: 1_000_000, end: 1_200_000 } }, extra);
const lan = { mode: "none", spotify: null, user: { id: ID, username: "matheo", global_name: "Matheo", avatar: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4", public_flags: 0 }, status: 200 };
const calls = [];
function install() {
  calls.length = 0;
  global.fetch = async (url, opts) => {
    url = String(url); calls.push({ url, opts: opts || {} });
    if (url.startsWith("https://api.lanyard.rest/v1/users/")) {
      if (lan.status === 0) throw new Error("network down");
      if (lan.status !== 200) return J({ success: false }, lan.status);
      return J({ success: true, data: { discord_user: lan.user, discord_status: "online", activities: [], listening_to_spotify: !!lan.spotify, spotify: lan.spotify } });
    }
    if (url.startsWith("https://fake-redis.upstash.io")) {
      if (db.fail) throw new Error("redis down");
      assert.equal(opts.headers.Authorization, "Bearer REDIS_TOKEN_secret");
      const [c, k, v, ...rest] = JSON.parse(opts.body);
      if (c === "GET") return J({ result: db.data.has(k) ? db.data.get(k) : null });
      if (c === "SET") { if (rest.includes("NX") && db.data.has(k)) return J({ result: null }); db.data.set(k, v); return J({ result: "OK" }); }
      if (c === "DEL") { db.data.delete(k); return J({ result: 1 }); }
      throw new Error("unexpected redis command " + c);
    }
    if (url.startsWith("https://discord.com/api/v10/users/")) return lan.discordApi ? lan.discordApi(url, opts) : J({}, 401);
    throw new Error("unexpected fetch " + url);
  };
}
const reset = () => { db.data.clear(); db.fail = false; lan.spotify = null; lan.status = 200; lan.discordApi = null; lan.user = { id: ID, username: "matheo", global_name: "Matheo", avatar: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4", public_flags: 0 }; install(); };
const recent = async (env) => { const r = await call(load("recent.js", env || REDIS)); return Object.assign(r, { json: r.body ? JSON.parse(r.body) : null }); };
const play = async (id, song, extra) => { lan.spotify = sp(id, song, extra); return recent(); };
const ids = r => r.json.items.map(i => i.id);

let tests = []; const test = (n, f) => tests.push([n, f]);

/* ===== recent: recording ===== */
test("recent: storage not configured -> 503 storage_not_configured (no ephemeral fallback)", async () => { reset(); const r = await recent({}); assert.equal(r.status, 503); assert.deepEqual(r.json, { error: "storage_not_configured" }); });
test("recent: nothing playing -> 200 with an empty list (nothing invented)", async () => { reset(); const r = await recent(); assert.equal(r.status, 200); assert.deepEqual(r.json.items, []); });
test("recent: new song is recorded with title, artists, album, cover, Spotify link built from the track id (no Spotify API call)", async () => {
  reset(); const r = await play("0VjIjW4GlUZAMYd2vXMi3b", "Blinding Lights"); const i = r.json.items[0];
  assert.equal(r.status, 200); assert.equal(r.json.items.length, 1);
  assert.deepEqual(Object.keys(i).sort(), ["album", "artists", "cover", "id", "playedAt", "title", "url"]);   /* internal fields (timestamps) are not leaked */
  assert.equal(i.title, "Blinding Lights"); assert.equal(i.artists, "Artist A, Artist B"); assert.equal(i.album, "Alb"); assert.equal(i.cover, "https://i.scdn.co/image/0VjIjW4GlUZAMYd2vXMi3b");
  assert.equal(i.url, "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b"); assert(!isNaN(new Date(i.playedAt)));
  assert(calls.every(c => !/spotify\.com\/v1|accounts\.spotify/.test(c.url)), "no Spotify Web API / OAuth call");
  assert(!JSON.stringify(r.json).includes("REDIS_TOKEN_secret"));
});
test("recent: dedup - the same song still playing across many calls is recorded once", async () => { reset(); for (let n = 0; n < 5; n++) await play("A".repeat(22), "Song A"); const r = await recent(); assert.deepEqual(ids(r), ["A".repeat(22)]); });
test("recent: A, B, A -> A recorded again as a NEW event after other songs; newest first", async () => {
  reset(); const A = "A".repeat(22), B = "B".repeat(22); await play(A, "A"); await play(B, "B"); const r = await play(A, "A");
  assert.deepEqual(ids(r), [A, B, A]); assert(new Date(r.json.items[0].playedAt) >= new Date(r.json.items[2].playedAt));
});
test("recent: same song restarted after it ended (new play) is a new event; pause/resume of the same play is not", async () => {
  reset(); const A = "A".repeat(22); await play(A, "A", { timestamps: { start: 1_000_000, end: 1_200_000 } });
  let r = await play(A, "A", { timestamps: { start: 1_050_000, end: 1_250_000 } }); assert.equal(r.json.items.length, 1, "resume after a pause shifts the timestamps but is the same play");
  r = await play(A, "A", { timestamps: { start: 1_260_000, end: 1_460_000 } }); assert.equal(r.json.items.length, 2, "started again after the previous play ended");
});
test("recent: never more than 10 entries; the oldest drops out; order newest -> oldest", async () => {
  reset(); let r; for (let n = 0; n < 14; n++) r = await play(String.fromCharCode(65 + n).repeat(22), "Song " + n);
  assert.equal(r.json.items.length, 10); assert.equal(r.json.items[0].title, "Song 13"); assert.equal(r.json.items[9].title, "Song 4");
  const t = r.json.items.map(i => +new Date(i.playedAt)); assert(t.every((v, k) => k === 0 || t[k - 1] >= v));
  assert.equal(JSON.parse(db.data.get("whoismatheo:recent-plays")).length, 10, "the stored list is capped too");
});
test("recent: entries are kept while no music is detected", async () => { reset(); await play("A".repeat(22), "A"); lan.spotify = null; const r = await recent(); assert.deepEqual(ids(r), ["A".repeat(22)]); assert.equal(r.json.live, true); });
test("recent: PERSISTENCE - history survives a restart of the environment (fresh modules, same database)", async () => {
  reset(); await play("A".repeat(22), "A"); await play("B".repeat(22), "B"); lan.spotify = null;
  const r = await recent(); assert.deepEqual(ids(r), ["B".repeat(22), "A".repeat(22)]);
  assert(db.data.has("whoismatheo:recent-plays")); /* lives in Redis, not in local files */
  assert(!fs.existsSync(path.join(root, "api", "_lib", "history.json")));
});
test("recent: legacy KV_REST_API_* variable names work too", async () => { reset(); const r = await recent({ KV_REST_API_URL: REDIS.UPSTASH_REDIS_REST_URL, KV_REST_API_TOKEN: REDIS.UPSTASH_REDIS_REST_TOKEN }); assert.equal(r.status, 200); });
test("recent: two simultaneous requests with the same new song record it once (lock)", async () => {
  reset(); lan.spotify = sp("C".repeat(22), "C"); const h = load("recent.js", REDIS); await Promise.all([call(h), call(h), call(h)]); const r = await recent(); assert.equal(r.json.items.length, 1);
});
test("recent: incomplete Discord data - no track id -> entry without link; no timestamps; listening flag off -> nothing recorded", async () => {
  reset(); lan.spotify = { song: "Local thing", artist: "", album: "", timestamps: {} }; let r = await recent(); const i = r.json.items[0];
  assert.equal(i.title, "Local thing"); assert.equal(i.url, ""); assert.equal(i.cover, ""); assert.equal(i.artists, "");
  reset(); lan.spotify = { song: "", track_id: "x" }; r = await recent(); assert.deepEqual(r.json.items, []);
  reset(); lan.user = Object.assign({}, lan.user); lan.spotify = null; r = await recent(); assert.deepEqual(r.json.items, []);
  reset(); lan.spotify = sp("D".repeat(22), "D", { album_art_url: "javascript:alert(1)", track_id: "../../evil" }); r = await recent(); assert.equal(r.json.items[0].url, ""); assert.equal(r.json.items[0].cover, "");
});
test("recent: Lanyard down / not monitoring -> stored history still served, live=false; no entry invented", async () => {
  reset(); await play("A".repeat(22), "A"); for (const st of [0, 404, 500]) { lan.status = st; const r = await recent(); assert.equal(r.status, 200); assert.equal(r.json.live, false); assert.deepEqual(ids(r), ["A".repeat(22)]); }
});
test("recent: storage network error -> 502 storage_unreachable, no secret in the response", async () => { reset(); db.fail = true; const r = await recent(); assert.equal(r.status, 502); assert.deepEqual(r.json, { error: "storage_unreachable" }); assert(!r.body.includes("REDIS_TOKEN")); });
test("recent: corrupt stored value is treated as empty, not as a crash", async () => { reset(); db.data.set("whoismatheo:recent-plays", "{not json"); const r = await recent(); assert.equal(r.status, 200); assert.deepEqual(r.json.items, []); });
test("recent: only GET/HEAD; headers are safe; visitors cannot write", async () => {
  reset(); for (const m of ["POST", "PUT", "DELETE", "PATCH"]) { const r = await call(load("recent.js", REDIS), { method: m }); assert.equal(r.status, 405); }
  const r = await recent(); assert.equal(r.headers["x-content-type-options"], "nosniff"); assert(/s-maxage/.test(r.headers["cache-control"]));
  assert.equal(db.data.size, 0, "rejected methods wrote nothing");
});

/* ===== track (optional scheduler endpoint) ===== */
test("track: 404 when no secret is configured; 401 without/with a wrong secret; 200 with the right one and it records", async () => {
  reset(); lan.spotify = sp("E".repeat(22), "E"); const SECRET = "s".repeat(24);
  assert.equal((await call(load("track.js", REDIS))).status, 404);
  const h = load("track.js", Object.assign({ TRACK_SECRET: SECRET }, REDIS));
  assert.equal((await call(h)).status, 401); assert.equal((await call(h, { headers: { authorization: "Bearer wrong" } })).status, 401); assert.equal((await call(h, { headers: { authorization: SECRET } })).status, 401);
  const ok = await call(h, { headers: { authorization: "Bearer " + SECRET } }); assert.equal(ok.status, 200); assert.equal(JSON.parse(ok.body).added, true); assert.equal(ok.headers["cache-control"], "no-store");
  assert.equal((await call(h, { method: "POST", headers: { authorization: "Bearer " + SECRET } })).status, 405);
  assert.equal(JSON.parse(db.data.get("whoismatheo:recent-plays")).length, 1);
});
test("track: a short secret is ignored (cannot be configured insecurely); CRON_SECRET is accepted", async () => {
  reset(); assert.equal((await call(load("track.js", Object.assign({ TRACK_SECRET: "short" }, REDIS)), { headers: { authorization: "Bearer short" } })).status, 404);
  const C = "c".repeat(20); assert.equal((await call(load("track.js", Object.assign({ CRON_SECRET: C }, REDIS)), { headers: { authorization: "Bearer " + C } })).status, 200);
});

/* ===== profile ===== */
const prof = async (env) => { const r = await call(load("profile.js", env || {})); return Object.assign(r, { json: JSON.parse(r.body) }); };
test("profile: without a bot token -> avatar/name/badges from Lanyard, banner null (not invented), bannerSource=no_token, no bio field", async () => {
  reset(); lan.user.public_flags = (1 << 6) | (1 << 22); const r = await prof(); assert.equal(r.status, 200);
  assert.equal(r.json.banner, null); assert.equal(r.json.bannerSource, "no_token"); assert.equal(r.json.displayName, "Matheo"); assert.deepEqual(r.json.badges, ["hypesquadBravery", "activeDeveloper"]);
  assert(r.json.avatar.startsWith("https://cdn.discordapp.com/avatars/" + ID + "/")); assert.equal(r.json.accentColor, ""); assert.equal(r.json.decoration, "");
  assert(!("bio" in r.json) && !("about" in r.json), "the bio is not available from any official API and is never invented");
  assert(calls.every(c => !c.url.startsWith("https://discord.com")), "no Discord API call without a token");
});
test("profile: no flags -> no badges (never shows badges you do not have)", async () => { reset(); lan.user.public_flags = 0; assert.deepEqual((await prof()).json.badges, []); lan.user.public_flags = undefined; assert.deepEqual((await prof()).json.badges, []); });
test("profile: with a bot token -> OFFICIAL API gives the real banner (animated gif when the hash starts with a_), accent colour, decoration; token never leaks", async () => {
  reset(); lan.discordApi = (url, opts) => { assert.equal(opts.headers.Authorization, "Bot BOT_secret_value"); assert.equal(url, "https://discord.com/api/v10/users/" + ID);
    return J({ id: ID, username: "matheo", global_name: "Matheo", avatar: "a_" + "f".repeat(32), banner: "a_" + "9".repeat(32), accent_color: 0x2b6cb0, public_flags: 4194304, avatar_decoration_data: { asset: "a_deco123456", sku_id: "1" } }); };
  const r = await prof({ DISCORD_BOT_TOKEN: "BOT_secret_value" });
  assert.equal(r.json.bannerSource, "ok"); assert.equal(r.json.banner.animated, true); assert.equal(r.json.banner.url, `https://cdn.discordapp.com/banners/${ID}/a_${"9".repeat(32)}.gif?size=1024`); assert.equal(r.json.banner.staticUrl, `https://cdn.discordapp.com/banners/${ID}/a_${"9".repeat(32)}.png?size=1024`);
  assert.equal(r.json.accentColor, "#2b6cb0"); assert(r.json.decoration.includes("/avatar-decoration-presets/a_deco123456.png")); assert(r.json.avatar.endsWith(".gif?size=256")); assert.deepEqual(r.json.badges, ["activeDeveloper"]);
  assert(!r.body.includes("BOT_secret_value")); assert(/s-maxage=300/.test(r.headers["cache-control"]), "cached 5 min: a changed banner shows up without touching the code");
});
test("profile: static banner -> png; user without banner -> null; bad token -> bannerSource=bad_token (card falls back); bad hash rejected", async () => {
  reset(); lan.discordApi = () => J({ id: ID, username: "m", banner: "8".repeat(32), avatar: null }); let r = await prof({ DISCORD_BOT_TOKEN: "t" }); assert.equal(r.json.banner.animated, false); assert(r.json.banner.url.endsWith(".png?size=1024"));
  lan.discordApi = () => J({ id: ID, username: "m", banner: null }); r = await prof({ DISCORD_BOT_TOKEN: "t" }); assert.equal(r.json.banner, null); assert.equal(r.json.bannerSource, "ok");
  lan.discordApi = () => J({ message: "401: Unauthorized" }, 401); r = await prof({ DISCORD_BOT_TOKEN: "t" }); assert.equal(r.status, 200); assert.equal(r.json.banner, null); assert.equal(r.json.bannerSource, "bad_token");
  lan.discordApi = () => J({ id: ID, username: "m", banner: "../../x?y=" }); r = await prof({ DISCORD_BOT_TOKEN: "t" }); assert.equal(r.json.banner, null);
});
test("profile: Discord API network failure -> still 200 from Lanyard data; both sources down -> error code only", async () => {
  reset(); lan.discordApi = () => { throw new Error("boom"); }; let r = await prof({ DISCORD_BOT_TOKEN: "t" }); assert.equal(r.status, 200); assert.equal(r.json.bannerSource, "error"); assert.equal(r.json.banner, null);
  lan.status = 0; lan.discordApi = () => { throw new Error("boom"); }; r = await prof({ DISCORD_BOT_TOKEN: "t" }); assert.notEqual(r.status, 200); assert(Object.keys(r.json).join() === "error");
});

/* ===== pure logic ===== */
test("history logic: applyTrack unit cases", () => {
  const { applyTrack } = require(path.join(root, "api/_lib/history.js")), t = (id, s = 0, e = 0) => ({ id, title: id, artists: "", album: "", cover: "", url: "", startMs: s, endMs: e });
  assert.deepEqual(applyTrack([], null, "x"), { items: [], added: false }); let r = applyTrack([], t("a"), "1"); assert.equal(r.added, true);
  assert.equal(applyTrack(r.items, t("a"), "2").added, false); r = applyTrack(r.items, t("b"), "3"); assert.deepEqual(r.items.map(i => i.id), ["b", "a"]);
  let l = []; for (let n = 0; n < 25; n++) l = applyTrack(l, t("t" + n), "x").items; assert.equal(l.length, 10);
});

/* ===== removal of the old Spotify API integration ===== */
test("cleanup: no Spotify Web API / OAuth code or variables remain in api/, script.js or config", () => {
  const files = []; (function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); f.isDirectory() ? walk(p) : files.push(p); } })(path.join(root, "api"));
  files.push(path.join(root, "script.js"), path.join(root, ".env.example"), path.join(root, "vercel.json"));
  for (const f of files) { const c = fs.readFileSync(f, "utf8"); assert(!/api\.spotify\.com|accounts\.spotify\.com|SPOTIFY_(CLIENT|REFRESH|REDIRECT|SETUP)|refresh_token|\/api\/spotify|\/api\/now/.test(c), f + " still references the old Spotify API"); }
  for (const gone of ["api/spotify", "api/_lib/spotify.js", "api/now.js"]) assert(!fs.existsSync(path.join(root, gone)), gone + " should be removed");
});
test("security: no secrets in the repository files (frontend/config)", () => {
  for (const f of ["script.js", "index.html", ".env.example"]) { const c = fs.readFileSync(path.join(root, f), "utf8"); assert(!/(Bot |Bearer )[A-Za-z0-9._-]{20,}|[MN][A-Za-z0-9_-]{23,}\.[\w-]{6}\.[\w-]{27,}/.test(c), f + " looks like it contains a token"); }
  assert(/DISCORD_BOT_TOKEN/.test(fs.readFileSync(path.join(root, ".env.example"), "utf8")));
});

(async () => { let pass = 0;
  for (const [n, f] of tests) { try { await f(); pass++; console.log("  ok   " + n); } catch (e) { console.log("  FAIL " + n + "\n       " + (e && e.stack || e)); process.exitCode = 1; } }
  console.log("\n" + pass + "/" + tests.length + " passed (simulated Lanyard / Discord / Redis)"); process.exit(process.exitCode || 0); })();
