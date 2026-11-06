# Nejamul Haque — portfolio

This repository contains the static portfolio deployed at
`https://nejamulhaque.vercel.app/`. It uses HTML, CSS, and vanilla
JavaScript with no build step or runtime dependencies.

## Local development

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Content verification

Unverified personal details are intentionally marked `TODO_CONFIRM` in
the active page. Replace them only with confirmed information:

- public email address;
- verified resume PDF at `assets/resume.pdf`;
- official internship/program wording and dates;
- GitShield repository URL and proof;
- confirmed writing/article URLs.

The previous long-form page is preserved under `legacy/` for reference.
It is not loaded by the active site.

## Deployment

The site is deployable as-is on Vercel or any static host. `vercel.json`
adds CSP, MIME-sniffing, referrer, permissions, and clickjacking
protections. The contact form uses a public Formspree endpoint and does
not require client-side secrets.
