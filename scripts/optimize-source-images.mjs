// scripts/optimize-source-images.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = path.resolve('assets/images/projects');
const DEST_DIR = path.resolve('src/assets/images/projects');
const PAPER_BG = { r: 246, g: 244, b: 238 }; // #F6F4EE

await fs.mkdir(DEST_DIR, { recursive: true });

const files = ['humanoid-sim.jpg', 'tug-bot.jpg'];

for (const file of files) {
  const inputPath = path.join(SRC_DIR, file);
  const outputPath = path.join(DEST_DIR, file);

  const beforeStat = await fs.stat(inputPath);
  const metadata = await sharp(inputPath).metadata();

  await sharp(inputPath)
    .flatten({ background: PAPER_BG })
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outputPath);

  const afterStat = await fs.stat(outputPath);
  const outMeta = await sharp(outputPath).metadata();

  console.log(
    `[optimize-source-images] ${file} (input format: ${metadata.format}, ${metadata.width}x${metadata.height}, ${beforeStat.size} bytes / ${(beforeStat.size / 1024).toFixed(1)} KB) -> (output format: ${outMeta.format}, ${outMeta.width}x${outMeta.height}, ${afterStat.size} bytes / ${(afterStat.size / 1024).toFixed(1)} KB)`
  );
}
