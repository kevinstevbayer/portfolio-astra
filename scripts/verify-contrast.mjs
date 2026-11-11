// scripts/verify-contrast.mjs
// Parses --raw-(light|dark)-* variables directly from src/styles/tokens.css.
import fs from 'node:fs';
import path from 'node:path';

const TOKENS_CSS_PATH = path.resolve('src/styles/tokens.css');
const css = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8');

const rawTokens = { light: {}, dark: {} };
const varRegex = /--raw-(light|dark)-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g;

let match;
while ((match = varRegex.exec(css)) !== null) {
  const [, mode, name, hex] = match;
  rawTokens[mode][name] = hex.toUpperCase();
}

function getHex(mode, name) {
  const val = rawTokens[mode]?.[name];
  if (!val) {
    throw new Error(`Missing token --raw-${mode}-${name} in ${TOKENS_CSS_PATH}`);
  }
  return val;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const PAIR_DEFINITIONS = [
  // Text pairs (>= 4.5:1) on paper, panel, and code surfaces
  { fg: 'ink', bg: 'paper', min: 4.5 },
  { fg: 'ink', bg: 'panel', min: 4.5 },
  { fg: 'ink', bg: 'code', min: 4.5 },
  { fg: 'ink-secondary', bg: 'paper', min: 4.5 },
  { fg: 'ink-secondary', bg: 'panel', min: 4.5 },
  { fg: 'ink-secondary', bg: 'code', min: 4.5 },
  { fg: 'ink-muted', bg: 'paper', min: 4.5 },
  { fg: 'ink-muted', bg: 'panel', min: 4.5 },
  { fg: 'ink-muted', bg: 'code', min: 4.5 },
  { fg: 'accent-text', bg: 'paper', min: 4.5 },
  { fg: 'accent-text', bg: 'panel', min: 4.5 },
  { fg: 'accent-text', bg: 'code', min: 4.5 },
  { fg: 'status-complete', bg: 'paper', min: 4.5 },
  { fg: 'status-complete', bg: 'panel', min: 4.5 },
  { fg: 'status-active', bg: 'paper', min: 4.5 },
  { fg: 'status-active', bg: 'panel', min: 4.5 },
  { fg: 'status-upcoming', bg: 'paper', min: 4.5 },
  { fg: 'status-upcoming', bg: 'panel', min: 4.5 },
  // UI / Focus / Border pairs (>= 3.0:1)
  { fg: 'accent-ui', bg: 'paper', min: 3.0 },
  { fg: 'accent-ui', bg: 'panel', min: 3.0 },
  { fg: 'accent-ui', bg: 'code', min: 3.0 },
  { fg: 'border-strong', bg: 'paper', min: 3.0 },
  { fg: 'border-strong', bg: 'panel', min: 3.0 },
];

let failed = 0;
console.log('Mode  | Token Pair (from tokens.css)      | Hex Values        | Ratio   | Min   | Status');
console.log('------+-----------------------------------+-------------------+---------+-------+-------');

for (const mode of ['light', 'dark']) {
  for (const def of PAIR_DEFINITIONS) {
    const fgHex = getHex(mode, def.fg);
    const bgHex = getHex(mode, def.bg);
    const ratio = contrastRatio(fgHex, bgHex);
    const pass = ratio >= def.min;
    if (!pass) failed++;
    const pairLabel = `${def.fg} on ${def.bg}`.padEnd(33, ' ');
    console.log(
      `${mode.padEnd(5, ' ')} | ${pairLabel} | ${fgHex} / ${bgHex} | ${ratio.toFixed(2).padStart(5, ' ')}:1 | ${def.min.toFixed(1)}:1 | ${pass ? 'PASS' : 'FAIL'}`
    );
  }
}

if (failed > 0) {
  console.error(`\n[verify-contrast] FAILED: ${failed} pair(s) below WCAG 2.2 AA threshold.`);
  process.exit(1);
}
console.log(`\n[verify-contrast] Parsed ${TOKENS_CSS_PATH} — all ${PAIR_DEFINITIONS.length * 2} pairs passed.`);
