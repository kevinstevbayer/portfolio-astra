# Zip notes (added by Claude — not part of Argon's output)

This repo was reassembled from the code blocks you pasted, using the **latest version of each file**. Nothing was edited to fix bugs; files are as Argon sent them.

## Structure
```
portfolio-astro/
├── .nvmrc  .gitignore  package.json  astro.config.mjs  tsconfig.json
├── DESIGN.md  TODO.md  _ZIP_NOTES.md
├── assets/images/projects/        original source images (PNG data saved as .jpg)
├── scripts/                       validate-content, verify-contrast, optimize-source-images
└── src/
    ├── content.config.ts          Zod 4 schema + loader
    ├── data/portfolio.json        single source of truth
    ├── styles/                    tokens.css, typography.css, base.css
    ├── layouts/BaseLayout.astro
    ├── components/                SpecTable, ProjectFigure, ProjectCard, SkillsMatrix
    ├── pages/                     index, cv, 404, projects/[slug]
    └── assets/images/projects/    real JPEGs (converted for you, see below)
```

## Which round each file comes from
| File | Version used |
|---|---|
| package.json, .nvmrc | Phase 1 fix round |
| astro.config.mjs | Phase 1 |
| content.config.ts | copy-pass round (headline / code_snippet removed) |
| portfolio.json | latest data round (_meta date, "I am targeting…", tags removed) |
| validate-content.mjs | Phase 1 fix round |
| verify-contrast.mjs, tokens.css | copy-pass round (parses tokens.css) |
| optimize-source-images.mjs | copy-pass round (flatten alpha) |
| typography.css, BaseLayout.astro, TODO.md | latest round (@font-face, 52rem sticky header) |
| base.css, DESIGN.md | Phase 2 (unchanged since) |
| components, pages | Phase 3 |

## Added by me (not in Argon's output)
- `tsconfig.json`, `.gitignore` — `astro check` needs a tsconfig.
- `src/assets/images/projects/*.jpg` — real JPEGs converted from the originals so `npm run validate` passes without running the optimize step first. `npm run optimize:images` will regenerate them with sharp.
- This file.

## Not included (never pasted)
Phase 4–6 output: Playwright/axe tests, Lighthouse config, GitHub Actions workflow, README, OG images.

## What I ran (no network, so no npm install / astro build)
- `node scripts/validate-content.mjs` → passes in DEV mode.
- `STRICT_PROD=true node scripts/validate-content.mjs` → 33 errors, as designed (TODO fields and placeholder media).
- `node scripts/verify-contrast.mjs` → all 46 token pairs pass.
- Relative imports in src/ all resolve. 9 routes would be generated.
Not run: `astro check`, `astro build`, any browser test.

## Known issues still in this code (not fixed here)
1. Live site is under `/portfolio/` but config has no `base`; all internal links are root-absolute.
2. `.sr-only` exists only in SpecTable's scoped CSS; captions elsewhere are visible.
3. Template copy not from the data: "Coursework / CAD", the contact paragraph, "Linked to repositories & builds".
4. Hero card jumps from h1 to h3.
5. CV printed from dark theme keeps light-grey text on white.
6. Generated "schematic" figure: misleading alt text, text cut mid-word.
7. Certification links point to site home pages.
8. `.figure-img` scoped class probably doesn't reach the `<img>` inside `<Picture>`.
9. `@font-face` with bare package paths in `url()` is untested.
