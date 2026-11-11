# Design System: Engineering Notebook (`DESIGN.md`)

## 1. Visual Direction
Plain, high-contrast archival engineering notebook. Prioritises tabular technical specifications, real hardware photographs, schematic diagrams, and left-aligned prose.

## 2. Colour Tokens & WCAG 2.2 AA Verification
All ratios are verified programmatically by `scripts/verify-contrast.mjs` before every build:
- **Surfaces:** `--bg-paper` (`#F6F4EE` light / `#121314` dark), `--bg-panel` (`#EAE6DC` light / `#1A1C1E` dark), `--bg-code` (`#E2DDD0` light / `#222528` dark).
- **Typography Ink:** `--ink-primary` (`#161614` light / `#ECEAE4` dark), `--ink-secondary` (`#4A4944` light / `#B8B5AC` dark), `--ink-muted` (`#5C5A54` light / `#96938A` dark).
- **Single Accent (Engineering Rust):** `--accent-text` (`#9A3406` light / `#F47A40` dark — passes >= 4.5:1 on both `--bg-paper`, `--bg-panel`, and `--bg-code`), `--accent-ui` (`#B23E0A` light / `#E86B30` dark — passes >= 3.0:1 for focus rings and interactive borders).

## 3. Typography
- **Prose & Headings:** Self-hosted `Public Sans Variable` (`@fontsource-variable/public-sans`) with metric-adjusted `@font-face` local fallback (`Public Sans Fallback`) to prevent CLS.
- **Data, Spec Sheets & Code:** Self-hosted `IBM Plex Mono` (`@fontsource/ibm-plex-mono`) with `font-variant-numeric: tabular-nums`.
- **Scale & Measure:** Fluid `clamp()` scale with base body `--step-0` >= 18px (`1.125rem`), line-height `1.65`, line length capped at `68ch`, `text-wrap: balance` on headings, and `text-wrap: pretty` on paragraphs.

## 4. Progressive Enhancement Features Used
- `light-dark()` CSS colour function for automatic system theme adaptation with manual `[data-theme]` override.
- `color-mix(in oklab, ...)` for hairline borders and subtle surface tints derived from core tokens.
- `@view-transition { navigation: auto; }` gated inside `@media (prefers-reduced-motion: no-preference)`.
- `@media (forced-colors: active)` fallback rules for Windows High Contrast Mode.

## 5. Strictly Banned Patterns (Enforced)
- No text or background gradients, glassmorphism (`backdrop-filter`), or neon/glow shadows.
- No purple/cyan/indigo AI palettes.
- No emoji icons (`🤖`, `🏆`, `⚡` stripped from `portfolio.json`), no `// 01` numbered section chips, no percentage skill bars, no custom cursors, no canvas animations.
