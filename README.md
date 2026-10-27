whoismatheo

<p align="center">
  <strong>A little piece of the internet that represents me.</strong>
</p><p align="center">
  Personal website · Music · Experiments · Me
</p>---

About

whoismatheo is my personal website — a small corner of the internet where I can express myself, experiment with code, and build something that feels like my own.

Built with simplicity in mind, using the web technologies I enjoy working with.

Built with

- HTML5
- CSS3
- JavaScript
- Vercel for deployment

Features

- Personal website with a custom design
- Interactive elements powered by JavaScript
- Integrated music player
- Spotify recently played tracks through a serverless API
- Responsive layout

Project structure

whoismatheo/
├── api/
│   └── recent.js
├── audio/
│   ├── LEEME.txt
│   └── the-kill-2.mp3
├── index.html
├── style.css
├── script.js
└── README.md

Deployment

The website is deployed with Vercel and connected to GitHub for automatic deployments.

Every update pushed to the "main" branch can trigger a new deployment.

Spotify integration

The recently played tracks feature requires these environment variables in Vercel:

- "SPOTIFY_CLIENT_ID"
- "SPOTIFY_CLIENT_SECRET"
- "SPOTIFY_REFRESH_TOKEN"

Keep these values private. Never commit secrets or tokens to the repository.

Run locally

Clone the repository:

git clone https://github.com/developermathh/whoismatheo.git
cd whoismatheo

Open "index.html" in a browser to explore the static website. The Spotify API endpoint requires a compatible serverless environment and its environment variables.

---

<p align="center">
  <sub>Made by Matheo · Just getting started.</sub>
</p>