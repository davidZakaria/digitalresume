# Digital résumé

Animated single-page portfolio built with **Vite**, **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Produces a **static `dist/`** folder suitable for **Hostinger shared hosting** (Apache, no Node runtime).

## Customize

- **[src/data/resume.ts](src/data/resume.ts)** — Full résumé: name, summary, experience (includes portfolio bullets), education, skills, **and `projects`** (same array powers the Projects section). **HR ERP** and **Talé** use a live URL when `liveUrl` is set or via `.env.local`: `VITE_LIVE_HRERP_URL`, `VITE_LIVE_TALE_URL`. **Arabic Cinema Archive** and **English Platform** stay **GitHub-only** unless you add `liveUrl`.
- **`index.html`** — Update `<title>`, `meta description`, and **`og:url`** to your real domain after deployment.
- **`.env.local`** — Optional **`VITE_SITE_URL=https://your-domain.com`** (no trailing slash) so JSON-LD structured data uses your canonical URL when useful.

### Hostinger subfolder

If the site is served from a subdirectory (not domain root), set `base` in [vite.config.ts](vite.config.ts):

```ts
export default defineConfig({
  plugins: [react()],
  base: '/your-subfolder/',
})
```

Rebuild so asset paths resolve correctly.

## Develop

```bash
npm install
npm run dev
```

Smooth scrolling uses **[Lenis](https://github.com/darkroomengineering/lenis)** when **`prefers-reduced-motion`** is off — turn that preference on in your OS to get instant native scrolling instead.

## Build

```bash
npm run build
```

Output: **`dist/`**.

## Deploy on Hostinger

1. Run `npm run build` locally.
2. In **File Manager** or FTP, open **`public_html`** (or your addon domain folder).
3. Upload **everything inside `dist/`** (including `assets/` and `index.html`), preserving structure.
4. Visit your domain over HTTPS. Replace `https://example.com/` in `index.html` **`og:url`** with the live URL.

No `.htaccess` is required for routing (anchor-only navigation).

## Scripts

| Command        | Purpose              |
| -------------- | -------------------- |
| `npm run dev`  | Local dev server     |
| `npm run build`| Production build     |
| `npm run preview` | Preview `dist` locally |
| `npm run lint` | ESLint               |
