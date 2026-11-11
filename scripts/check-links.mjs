// scripts/check-links.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const MAX_IMAGE_BYTES = 200 * 1024; // 200 KB budget

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

if (!fs.existsSync(DIST_DIR)) {
  console.error('[check-links] dist/ directory not found. Run npm run build first.');
  process.exit(1);
}

const allFiles = walk(DIST_DIR);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const imageFiles = allFiles.filter((f) => /\.(avif|webp|jpg|jpeg|png)$/i.test(f));

const errors = [];

for (const img of imageFiles) {
  const stat = fs.statSync(img);
  if (stat.size > MAX_IMAGE_BYTES) {
    errors.push(
      `Shipped image exceeds 200 KB budget: ${path.relative(DIST_DIR, img)} (${(stat.size / 1024).toFixed(1)} KB)`
    );
  }
}

const pageIds = new Map();
for (const htmlFile of htmlFiles) {
  const relRoute = '/' + path.relative(DIST_DIR, htmlFile).replace(/\\/g, '/');
  const normalizedRoute = relRoute.replace(/index\.html$/, '');
  const content = fs.readFileSync(htmlFile, 'utf-8');
  const ids = new Set();
  const idRegex = /\bid=["']([^"']+)["']/g;
  let m;
  while ((m = idRegex.exec(content)) !== null) {
    ids.add(m[1]);
  }
  pageIds.set(normalizedRoute, ids);
  pageIds.set(relRoute, ids);
}

for (const htmlFile of htmlFiles) {
  const relFile = path.relative(DIST_DIR, htmlFile);
  const currentRoute = '/' + relFile.replace(/\\/g, '/').replace(/index\.html$/, '');
  const content = fs.readFileSync(htmlFile, 'utf-8');

  const imgTagRegex = /<img\b[^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgTagRegex.exec(content)) !== null) {
    const tag = imgMatch[0];
    if (!/\balt=["'][^"']+["']/i.test(tag) && !/\baria-hidden=["']true["']/i.test(tag)) {
      errors.push(`${relFile}: <img> tag missing non-empty alt attribute: ${tag}`);
    }
  }

  const attrRegex = /\b(?:href|src)=["']([^"']+)["']/g;
  let attrMatch;
  while ((attrMatch = attrRegex.exec(content)) !== null) {
    const rawUrl = attrMatch[1];
    if (
      rawUrl.startsWith('http://') ||
      rawUrl.startsWith('https://') ||
      rawUrl.startsWith('mailto:') ||
      rawUrl.startsWith('data:')
    ) {
      continue;
    }

    const [pathnamePart, hashPart] = rawUrl.split('#');
    const targetRoute = pathnamePart || currentRoute;

    if (pathnamePart) {
      const candidatePath = path.join(DIST_DIR, pathnamePart);
      const existsAsFile = fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile();
      const existsAsIndex = fs.existsSync(path.join(candidatePath, 'index.html'));
      if (!existsAsFile && !existsAsIndex) {
        errors.push(`${relFile}: Broken internal link or asset reference "${rawUrl}"`);
        continue;
      }
    }

    if (hashPart) {
      const idsForTarget = pageIds.get(targetRoute);
      if (!idsForTarget || !idsForTarget.has(hashPart)) {
        errors.push(`${relFile}: Broken anchor "#${hashPart}" on target "${targetRoute}"`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`\n[check-links] Failed with ${errors.length} error(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log(
  `[check-links] Verified ${htmlFiles.length} HTML files and ${imageFiles.length} shipped images (all < 200 KB).`
);