# Nejamul Haque — portfolio

This repository contains the static portfolio deployed at
`https://nejamulhaque.vercel.app/`. It uses HTML, CSS, and vanilla
JavaScript with no build step or runtime dependencies.

## Local development

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

The previous long-form page is preserved under `legacy/` for reference.
It is not loaded by the active site.

Private follow-up items are tracked in `TODO.md`; `.vercelignore` keeps
that file out of deployments.

## Deployment

The site is deployable as-is on Vercel or any static host. `vercel.json`
adds CSP, MIME-sniffing, referrer, permissions, and clickjacking
protections. The contact form uses a public Formspree endpoint and does
not require client-side secrets.
