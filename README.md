# Kevin Stev Bayer — Engineering Portfolio

Static engineering portfolio and curriculum vitae for **Kevin Stev Bayer** (Mechatronics Engineering student at KCG College of Technology, Chennai).

## Architecture

- **Framework:** Astro 7 (static output, zero client-side framework bundles)
- **Content Source of Truth:** `src/data/portfolio.json` validated at build time with Zod 4 (`src/content.config.ts`) and `scripts/validate-content.mjs`
- **Styling & Typography:** Hand-authored CSS with custom properties, `light-dark()`, and self-hosted Latin-subset WOFF2 fonts (`Public Sans Variable` and `IBM Plex Mono`) via Fontsource — zero external runtime network requests
- **Routes Generated:**
  - `/` — Overview, featured build, projects index, skills-by-evidence matrix, education & experience timeline, certifications, and direct contact
  - `/projects/[slug]/` — Individual engineering case-study and specification pages for all 6 projects
  - `/cv/` — Single-source HTML Curriculum Vitae with `@media print` A4 formatting
  - `/404.html` — Static 404 fallback page

## Requirements & Setup

Requires **Node.js >= 22.12.0** (see `.nvmrc`).

```bash
# Install dependencies
npm install

# Optimise source images from assets/images/projects/ into src/assets/images/projects/
npm run optimize:images

# Start local development server at http://localhost:4321
npm run dev