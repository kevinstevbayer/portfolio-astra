// scripts/generate-og-images.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DATA_PATH = path.resolve('src/data/portfolio.json');
const OUT_DIR = path.resolve('public/og');
const PROJECTS_OUT_DIR = path.join(OUT_DIR, 'projects');

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapLines(text, maxCharsPerLine = 42, maxLines = 3) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }
  return lines;
}

function buildCardSvg({ topLabel, title, subtitle, metaLeft, metaRight }) {
  const titleLines = wrapLines(title, 30, 2);
  const subLines = wrapLines(subtitle, 62, 3);

  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<text x="72" y="${210 + i * 64}" font-family="sans-serif" font-size="54" font-weight="700" fill="#161614">${escapeXml(line)}</text>`
    )
    .join('\n');

  const subStartY = 210 + titleLines.length * 64 + 28;
  const subSvg = subLines
    .map(
      (line, i) =>
        `<text x="72" y="${subStartY + i * 38}" font-family="sans-serif" font-size="26" font-weight="400" fill="#4A4944">${escapeXml(line)}</text>`
    )
    .join('\n');

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#F6F4EE" />
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="#161614" stroke-width="3" />
  <line x1="36" y1="116" x2="1164" y2="116" stroke="#161614" stroke-width="1.5" />
  <line x1="36" y1="516" x2="1164" y2="516" stroke="#161614" stroke-width="1.5" />
  <rect x="36" y="36" width="14" height="558" fill="#B23E0A" />

  <text x="72" y="85" font-family="monospace" font-size="22" font-weight="600" fill="#9A3406">${escapeXml(topLabel.toUpperCase())}</text>
  <text x="1128" y="85" text-anchor="end" font-family="monospace" font-size="20" fill="#5C5A54">SPEC SHEET // KSB</text>

  ${titleSvg}
  ${subSvg}

  <text x="72" y="562" font-family="monospace" font-size="20" font-weight="600" fill="#161614">${escapeXml(metaLeft)}</text>
  <text x="1128" y="562" text-anchor="end" font-family="monospace" font-size="20" fill="#5C5A54">${escapeXml(metaRight)}</text>
</svg>`;
}

await fs.mkdir(PROJECTS_OUT_DIR, { recursive: true });
const raw = await fs.readFile(DATA_PATH, 'utf-8');
const data = JSON.parse(raw);

const cards = [
  {
    outPath: path.join(OUT_DIR, 'home.png'),
    svg: buildCardSvg({
      topLabel: data.about.tagline,
      title: data.about.name,
      subtitle: data.about.bio_paragraphs[0],
      metaLeft: data.about.location,
      metaRight: 'kevinstevbayer.github.io',
    }),
  },
  {
    outPath: path.join(OUT_DIR, 'cv.png'),
    svg: buildCardSvg({
      topLabel: 'Curriculum Vitae',
      title: `${data.about.name} — CV`,
      subtitle: `${data.about.tagline} · ${data.about.location}`,
      metaLeft: data.about.email,
      metaRight: 'kevinstevbayer.github.io/cv/',
    }),
  },
  ...data.projects.map((p) => ({
    outPath: path.join(PROJECTS_OUT_DIR, `${p.slug}.png`),
    svg: buildCardSvg({
      topLabel: `${p.category} · ${p.status_label}`,
      title: p.title,
      subtitle: p.short_description,
      metaLeft: p.tech_tags.slice(0, 5).join(' · '),
      metaRight: data.about.name,
    }),
  })),
];

for (const card of cards) {
  await sharp(Buffer.from(card.svg))
    .png({ compressionLevel: 9, palette: true })
    .toFile(card.outPath);
  const stat = await fs.stat(card.outPath);
  console.log(
    `[generate-og-images] ${path.relative(process.cwd(), card.outPath)} (${(stat.size / 1024).toFixed(1)} KB)`
  );
}