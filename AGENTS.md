# ojt_portfolio_deliverables

Andrei Acosta's OJT portfolio site: React 19 + Vite 8 + Tailwind CSS v4 + TypeScript. It started as a Figma Make export and is now developed locally (Windows, pnpm) and versioned on GitHub. See `README.md` for the to-do list.

## Local workflow

- The user runs `pnpm dev` themselves. It is usually already running at http://localhost:8443 with hot reload. **Do not start, restart, or kill the dev server.** If you need to know whether it's up, ask the user.
- The port comes from `vite.config.ts` (`PORT` env var, default `8443`, `strictPort: true`). A second `pnpm dev` will fail because the port is taken.
- To check a change without the dev server, run `pnpm build` (output in `dist/`). Run `pnpm format` (oxfmt) for formatting.
- Toolchain: Node.js 22 and pnpm (versions pinned in `.mise.toml`). Use pnpm, not npm or yarn.
- Shell is Windows. Use forward slashes in paths in code and config.

## Project structure

- `src/main.tsx`: React entrypoint. Imports `src/index.css` and mounts `src/App.tsx`
- `src/App.tsx`: page layout and section order
- `src/components/`: `Header`, `Hero`, `About`, `Skills`, `Projects`, `Contact`, `Footer`, plus `Decor.tsx` (background/decoration) and `ui.tsx` (shared pieces such as `WindowCard`)
- `src/lib/assets.ts`: image paths and the `links` object. **Every link** (email, socials, CV, project and certificate URLs) lives here. Don't hard-code URLs in components
- `src/lib/useDraggable.ts`: drag logic for the About section's draggable windows
- `src/index.css`: global CSS, Tailwind import, fonts, theme tokens
- `public/assets/`: images exported from Figma (hashed filenames)
- `index.html`: Vite HTML shell with `<!-- figma:* -->` comment slots
- `vite.config.ts`: Vite config with React, Tailwind, the `@` → `src` alias, and leftover Figma Make plugins

## Design language

A "retro desktop" theme: content sits in window cards with title bars, in cream, tangerine, butter, and navy, over a black background with diagonal lines. The About section uses draggable `WindowCard`s. New UI should follow this look, so reuse the existing card and title-bar components and colors instead of adding new styles.

## Figma Make leftovers (still present)

These are still wired in and still needed until they're removed on purpose (see the README to-do):

- `.figma/make/site.json` is imported by `vite.config.ts` and supplies the page title, meta, favicon, and `robots.index`. Edit it there for now
- `vite.config.ts` still registers the `figma*` plugins (site configuration, error-overlay replay, refresh-boundary fallback, make-kit, linked-package sourcemaps), and `base` reads `FIGMA_PUBLIC_URL`
- Some fonts load from `static.figma.com`

Don't delete these as a side effect of another task.

## Styling

Tailwind CSS v4 runs through `@tailwindcss/vite`. There's no Tailwind or PostCSS config file. Use utility classes in JSX. Put global CSS and `@theme` customization in `src/index.css`, with CSS `@import` statements first, then `@font-face`, then font defaults.

Tailwind emits utilities in `@layer utilities`, and CSS outside any layer overrides all layers. So put global element styles (resets, `body`, headings, `button`, `input`) inside `@layer base { ... }`. Preflight already handles `box-sizing`, default margins, and `font: inherit` on form controls, so don't repeat those rules.
