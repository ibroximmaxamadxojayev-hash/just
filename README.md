# Amazing Comfort Site

This is a small, responsive static landing page built to be comfortable and effective.

Files:

- `index.html` — The main page
- `styles.css` — Site styles with theme support
- `script.js` — Theme toggle, form handling, and small interactions
- `assets/` — Placeholder thumbnails and future media

Quick preview (local):

If you have Python 3 installed, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Alternatively, open `index.html` directly in a modern browser.

Next steps you might want:

- Hook the contact form to a backend or form service
- Add higher-fidelity images or video to the `hero-visual` and `assets/`
- Replace fonts with a chosen webfont for branding

Latest update (2026-01-11):

- Added a canvas-based live wallpaper (`#live-bg`) with soft particle gradients and adaptive density for modern screens.
- Improved theme handling: light/dark toggle with `prefers-color-scheme` support and persistent choice in `localStorage`.
- Form validation UX: client-side checks with user-friendly status messages and a mailto fallback button.
- Added a Framer Awards–style showcase section with search and category filters, responsive grid, thumbnails under `assets/`, and a modal viewer for entries.

If you want, I can now implement additional pages, improve visuals, or prepare a ZIP for download.

**Deployment & CI**

GitHub Pages (automatic):

- Commit and push your repo to GitHub (branch `main`). The included GitHub Actions workflow at `.github/workflows/deploy.yml` will deploy the repository root to GitHub Pages automatically on pushes to `main`.
- After the first deploy, enable Pages in your repository Settings → Pages, and choose the `gh-pages` deployment or the default Pages output. GitHub will provide a site URL.

Netlify (recommended for static sites):

- Option A — Quick: Drag-and-drop the generated `lms-collab-app.zip` into Netlify Drop (https://app.netlify.com/drop).
- Option B — CI: Connect your GitHub repo in Netlify, set the `publish` directory to `/` (root) and the build command blank. The repo contains `netlify.toml` for any additional settings.

Vercel (recommended for previews):

- Import the project via Vercel (https://vercel.com/import) and select the repository. Vercel will detect a static site and deploy from the repository root. No build command required for this simple static project.

CI tips:

- For GitHub Pages the included workflow uses `actions/upload-pages-artifact` and `actions/deploy-pages` — no secret token needed.
- For Netlify, you can set environment variables under Site Settings → Build & Deploy if you later add API keys.
- For robust deployments with transformations (image optimization, bundling), add a build step (e.g., a simple Node script or a static-site generator) and update the Actions workflow or Netlify build command accordingly.

If you want, I can:

- Configure a GitHub Pages custom domain and HTTPS.
- Add a GitHub Actions job to run accessibility checks (axe), Lighthouse, or image optimization before deploy.
- Connect Netlify/Vercel and demo a live URL.
