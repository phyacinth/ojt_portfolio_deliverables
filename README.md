# ojt_portfolio_deliverables

Personal portfolio website of **Andrei Acosta** for OJT applications
(College of Industrial Technology, Bulacan State University).

> Status: **work in progress.** Initially generated in Figma Make, now edited directly in this repo.

## Tech stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4

## Run locally

Requires Node.js 22 and pnpm.

```bash
pnpm install
```

```bash
pnpm dev
```

Build for production (output goes to `dist/`):

```bash
pnpm build
```

## Project structure

- `src/App.tsx` – page layout (section order)
- `src/components/` – Header, Hero, About (draggable windows), Skills, Projects, Contact, Footer
- `src/lib/assets.ts` – image paths and **all links** (email, socials, CV, project URLs)
- `src/lib/useDraggable.ts` – drag logic for the About windows
- `public/assets/` – images exported from Figma

## To do

- [ ] Move all contact links to the bottom Contact section (replace About "contacts" window with "quick facts")
- [ ] Hero: change "Contact Me" to "View My Work"
- [ ] Connect real links (GitHub, Instagram, project demos, certificates) in `src/lib/assets.ts`
- [ ] Add CV PDF to `public/`
- [ ] Fill in placeholders: graduation year, Thesis role/description, project screenshots
- [ ] Replace fonts loaded from `static.figma.com` with self-hosted / Google Fonts
- [ ] Remove Figma Make leftovers (`.figma/`, Figma plugins in `vite.config.ts`, `AGENTS.md`)
- [ ] Deploy (GitHub Pages / Vercel / Netlify) and set `robots.index` to `true`
