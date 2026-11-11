# Repository Guidelines for Maintainers & AI Coding Agents (`AGENTS.md`)

## 1. Architecture & Single Source of Truth
- **Framework:** Astro 7 (`output: 'static'`), TypeScript, and Zod 4 (`astro/zod`).
- **Single Source of Truth:** All portfolio content lives in `src/data/portfolio.json`. Never hardcode bio copy, project specs, skills, experience items, or certifications inside `.astro` templates.
- **Zero Client JS Default:** Pages ship zero client-side JavaScript bundles. Only two progressive-enhancement `<script is:inline>` blocks exist:
  1. Theme persistence (`<head>` initialiser + `#theme-toggle` button with `aria-pressed` in `src/layouts/BaseLayout.astro`).
  2. Clipboard copy helper (`#copy-email-btn` in `src/pages/index.astro`).
  Both controls carry the HTML `hidden` attribute by default so users without JS never see dead buttons.

## 2. Key Commands
Run all commands on **Node >= 22.12.0** (`.nvmrc`):
- `npm run dev` — Start local Astro dev server (`http://localhost:4321`).
- `npm run optimize:images` — Flatten alpha onto `#F6F4EE` and re-encode source photos from `assets/images/projects/` into `src/assets/images/projects/`.
- `npm run validate` — Validate `src/data/portfolio.json` in `DEV` mode (allows `"TODO"` slots while drafting).
- `STRICT_PROD=true npm run validate` — Strict CI validation (fails if any skill `level`, non-upcoming project `media.type`, or `case_study_todos` field is still `"TODO"` / `"schematic_todo"`).
- `npm run verify:contrast` — Parse `src/styles/tokens.css` and verify all 46 light/dark color pairs against WCAG 2.2 AA (4.5:1 text, 3.0:1 UI).
- `npm run build` — Run validation, contrast check, OG PNG card generation, `astro check`, `astro build`, and internal link/asset size verification (`scripts/check-links.mjs`).
- `npm run test:a11y` — Run Playwright + `axe-core` across all 9 routes in both light and dark modes, 320px viewport overflow check, 44x44px target check, keyboard navigation check, and JS-disabled check.
- `npm run test:lh` — Run Lighthouse CI mobile assertions (`>= 95` in all four categories).

## 3. Content & Anti-Slop Rules
- **Plain First Person:** Write concise, factual sentences.
- **Banned Words (enforced by `scripts/validate-content.mjs`):** `passionate`, `cutting-edge`, `seamless`, `leverage`, `innovative`, `building the future`, `machines that move with purpose`.
- **No Unverified Metrics:** Never invent numbers, competition placements, CGPAs, or solo-authorship claims. Log any unconfirmed claim in `TODO.md`.
- **No Banned UI Patterns:** No text/background gradients, no `backdrop-filter` / glassmorphism, no neon glow shadows, no purple/cyan palettes, no emoji icons, no `// 01` section chips, no percentage skill bars, no canvas backgrounds, no custom cursors.

## 4. How to Add or Update a Project
1. **Place the Image:** Add a real hardware photo, CAD render, or clean simulation screenshot (landscape ~16:10, under 1600px wide) in `src/assets/images/projects/<slug>.jpg`.
2. **Edit `src/data/portfolio.json`:** Add or update the project object in `projects[]`:
   - `id`: `"p-<short-id>"` (must be unique).
   - `slug`: `"<url-slug>"` (generates `/projects/<url-slug>/`).
   - `specs`: Array of `{ "label": "...", "value": "..." }` pairs (at least 2 rows).
   - `case_study_todos`: Fill in `problem`, `my_role_vs_team`, `outcome`, and `what_i_would_change` with factual 1–2 sentence answers.
   - `media`: Set `type: "image"`, `image_path: "src/assets/images/projects/<slug>.jpg"`, and write a concrete visual description in `image_alt` (>= 10 characters).
3. **Link Proving Skills:** Add the project's `id` to the `evidence_projects` array of any relevant entry in `skills[]`.
4. **Verify Locally:** Run `STRICT_PROD=true npm run build && npm run test:a11y`.