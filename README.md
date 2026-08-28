# DevSecOps Portfolio — Nejamul Haque

A single-page portfolio site for a DevSecOps / Cloud Security Engineer,
built as static HTML/CSS/JS — no framework, no build step, no server
required. Dark cyber-glass theme, particle background, live typewriter
role rotation, animated skill bars, and a filterable project grid with
full Problem → Approach → Trade-off → Result case studies instead of
generic project blurbs.

**Live look at what's inside:** hero → about → experience → skills →
tech stack → journey timeline → write-ups → practice & achievements →
project case studies → threat model → GitHub activity → training &
certification roadmap → contact.

---

## Tech stack

- **HTML5 / CSS3 / vanilla JavaScript** — zero build tooling, so it's
  as easy to self-host or fork as it is to read.
- **[Font Awesome 6](https://fontawesome.com/)** (CDN) — icons.
- **Google Fonts** — Syne (display), DM Sans (body), JetBrains Mono
  (terminal/code accents).
- **[github-readme-stats](https://github.com/anuraghazra/github-readme-stats)**
  style stats/languages/streak cards, plus the contribution snake —
  **self-hosted as static SVGs** via GitHub Actions running in the
  [`NejamulHaque/NejamulHaque`](https://github.com/NejamulHaque/NejamulHaque)
  profile repo, not loaded live from any third-party server at request
  time. (Kept in the profile repo rather than this one so the same
  cards also show up on the GitHub profile page itself.)

### Why the stats cards are self-hosted, not live-embedded

The original version of this site embedded `<img>` tags pointing
directly at the free public `github-readme-stats.vercel.app` instance
and a random third-party trophy mirror. That's the standard tutorial
approach — and it's fragile: the shared public instance is
best-effort infrastructure that gets rate-limited or paused with no
warning, breaking every site that embeds it simultaneously, with no
fix available on the embedding site's end.

The `snake.yml` and `stats.yml` workflows in
[`NejamulHaque/NejamulHaque`](https://github.com/NejamulHaque/NejamulHaque)
instead **generate the cards ourselves**, using our own `GITHUB_TOKEN`
(never sharing someone else's rate limit), and commit the resulting
static SVGs to that repo's `output` branch. This site then embeds
those files directly from `raw.githubusercontent.com`, so the cards
render whether or not any third-party server happens to be up.

**GitHub Trophies were dropped entirely** rather than self-hosted —
there's no maintained GitHub Action that generates trophies as a
static file the way there is for stats/languages/streak, so the only
way to keep them would be re-introducing a live third-party
dependency. If you want them back, self-deploy your own instance of
[github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy)
on Vercel (one-click "Deploy" button in that repo) — that's still a
live server, but one under your own account and rate limit rather than
a shared public one.

The **Activity Graph** widget is the one remaining live third-party
embed (no static-generation equivalent was found for it either) — if
it ever breaks the same way the others did, either remove it or
self-deploy [github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph)
the same way.

## Project structure

```
devsecops-portfolio/
├── index.html                 all page content & structure
├── styles.css                 theme, layout, components, animations
├── script.js                  interactivity (see "What script.js does" below)
└── assets/                    profile photo, etc.
```

GitHub Action workflows (`snake.yml`, `stats.yml`) live in the separate
[`NejamulHaque/NejamulHaque`](https://github.com/NejamulHaque/NejamulHaque)
profile repo, not here — see "Why the stats cards are self-hosted"
below for why.

## Running it locally

No build step — just open the file, or serve it so relative asset
paths resolve correctly:

```bash
git clone https://github.com/NejamulHaque/devsecops-portfolio.git
cd devsecops-portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

Or use the VS Code "Live Server" extension, or any static file server.

## Deploying it

Since it's static files with no backend, any static host works:

- **GitHub Pages** (free, simplest): Settings → Pages → Deploy from
  branch → `main` / root. Live at `https://NejamulHaque.github.io/devsecops-portfolio/`.
- **Netlify / Vercel**: drag-and-drop the folder, or connect the repo
  for auto-deploy on push.

## What `script.js` does

| Feature | What it's for |
|---|---|
| Theme toggle | Dark/light mode, persisted in `localStorage` |
| Typewriter | Rotates role titles in the hero (`DevSecOps Engineer`, `Cloud Security Engineer`, …) |
| Reveal-on-scroll | `IntersectionObserver`-based fade/slide-in for sections, with a `setTimeout` fallback so content never stays hidden if the observer fails |
| Animated stat counters | Counts up to each stat's `data-target` when scrolled into view |
| 3D tilt | Mouse-tracked perspective tilt on the hero terminal card and project/cert/achievement cards |
| Project filter | Filters the case-study grid by `data-tags` (`security`, `automation`, `fullstack`) |
| Contact form | Submits via [Formspree](https://formspree.io/) — **you must replace the placeholder form ID** in `index.html`'s `<form action="...">` with your own |
| Particle network | Canvas-based ambient background, mouse-reactive |
| Write-ups | Static array of case-study articles rendered into the "Write-ups" section — edit the `WRITEUPS` array in `script.js` directly to add/change posts |

## Customizing

- **Content** — everything is plain HTML in `index.html`; sections are
  clearly commented (`<!-- ===== SECTION NAME ===== -->`) so you can
  find and edit each one without hunting.
- **Colors / theme** — CSS custom properties at the top of
  `styles.css` (`:root { --accent: ...; --accent-2: ...; }`) control
  the whole palette from one place.
- **Photo** — drop an image into `assets/` and point the `<img src>`
  in the About section at it (see the `about-photo-wrap` block).
- **GitHub username** — the GitHub stat widgets, project repo links,
  and the contribution snake all hardcode `NejamulHaque` — find/replace
  if you fork this for yourself.
- **Certifications / roadmap** — edit the `cert-grid` and
  `cert-roadmap` blocks in the Training section directly; only list
  credentials you've actually completed as "completed" cards.

## A note on the project case studies

The **Projects** section deliberately uses a Problem → Approach →
Trade-off → Result format instead of one-line blurbs, and any metric
you haven't personally measured yet is marked with a `.fill-in`
styled placeholder (amber, dashed underline) rather than an invented
number. If you're forking this, replace those with real numbers from
your own testing — don't ship fabricated statistics.

## Related project

[SentinelDaemon](https://github.com/NejamulHaque/SentinelDaemon) —
the SSH brute-force auto-blocking daemon featured as the primary case
study in the Projects section. Built and tested independently; its
own README covers the architecture in full.

## License

MIT — see [`LICENSE`](LICENSE) if included, or treat as free to fork
and adapt with attribution.
