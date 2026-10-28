# whoismatheo

Static site (HTML/CSS/vanilla JS) + one optional Vercel serverless function (`api/recent.js`). No build step, no dependencies, no `vercel.json`.
All settings are at the top of `script.js` (`CONFIG`).

## What needs YOUR configuration
1. **Music file (required for sound).** Spotify does not allow background playback of a track with volume/mute control (its embeds only give 30-second previews, no volume API, no autoplay; the Web Playback SDK needs Premium for every visitor). So the player uses an HTML `<audio>` file. Put an audio file you are authorized to use at `audio/the-kill-2.mp3` (or change `CONFIG.track.src`). Until it exists the player shows the title/artist and "couldn't load audio", and the play and mute buttons stay disabled. Title/artist are already set to *The Kill 2 — Lex Amarni & 2MuchMotion*; the cover is fetched from Spotify's public oEmbed (set `track.cover` to override).
2. **Discord.** `CONFIG.discordUserId` is already your ID. Join https://discord.gg/lanyard and stay in it, otherwise Lanyard cannot see you. Lanyard only exposes status, username, display name, avatar, activities and Spotify. Badges and bio are NOT available through Lanyard or the official API without a user token, so they are not shown.
3. **Recently played (optional).** Needs the Spotify Web API:
   - Create an app at https://developer.spotify.com/dashboard. Add redirect URI `http://127.0.0.1:3000/callback`.
   - Open in your browser (replace `CLIENT_ID`): `https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-recently-played`
   - After you accept, the browser shows an error page; copy the `code=` value from its address bar.
   - Run: `curl -X POST https://accounts.spotify.com/api/token -u CLIENT_ID:CLIENT_SECRET -d grant_type=authorization_code -d code=THE_CODE -d redirect_uri=http://127.0.0.1:3000/callback` and copy the `refresh_token`.
   - In Vercel → Project → Settings → Environment Variables add `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, then redeploy.
   - Without them `/api/recent` answers 503 and the section shows a discreet "recent plays are unavailable" line (translated). To see why, open `https://YOUR-SITE/api/recent` and read the `error` code: `not_configured` (a variable is missing), `auth` (wrong client secret or refresh token), `forbidden` (missing scope, or the account is not allowed for a development-mode app), `rate_limited`, `upstream`, `unavailable`. Details (never secrets) appear in Vercel → Project → Logs. Environment variables only apply to NEW deployments: redeploy after adding them.
   - It shows up to the 10 most recent plays exactly as Spotify returns them (a track played twice counts as two plays). Check Spotify's current developer terms: access rules for development-mode apps have been changing.
   - "Now playing" comes from Lanyard; "recently played" are *finished* plays from Spotify, not a full history.
4. **About Me** texts: `aboutTitle`, `aboutP1`, `aboutP2`, `aboutClose` in the `T` dictionary in `script.js`. **Dedication:** `CONFIG.dedicationMessage`.

## Deploy on Vercel
Upload the project to a GitHub repo (root: `index.html`, `style.css`, `script.js`, `api/`, `audio/`), then Vercel → Add New → Project → import the repo → Framework "Other", no build command → Deploy. Every push redeploys.
