import fs from 'node:fs';
import path from 'node:path';

const DATA_PATH = path.resolve('src/data/portfolio.json');
const IS_STRICT_PROD = process.env.CI === 'true' || process.env.STRICT_PROD === 'true';

const BANNED_WORDS = [
  'passionate',
  'cutting-edge',
  'seamless',
  'leverage',
  'innovative',
  'building the future',
  'machines that move with purpose',
];

function fail(errors) {
  console.error('\n[validate-content] Validation failed with ' + errors.length + ' error(s):');
  for (const err of errors) {
    console.error('  - ' + err);
  }
  process.exit(1);
}

const raw = fs.readFileSync(DATA_PATH, 'utf-8');
const data = JSON.parse(raw);
const errors = [];

const projectIds = new Set();
const projectTitles = new Set();
const projectSlugs = new Set();
const repoUrls = new Map();

for (const p of data.projects) {
  if (projectIds.has(p.id)) errors.push(`Duplicate project id: ${p.id}`);
  if (projectTitles.has(p.title)) errors.push(`Duplicate project title: ${p.title}`);
  if (projectSlugs.has(p.slug)) errors.push(`Duplicate project slug: ${p.slug}`);
  projectIds.add(p.id);
  projectTitles.add(p.title);
  projectSlugs.add(p.slug);

  if (!p.media?.image_alt || p.media.image_alt.trim().length < 10) {
    errors.push(`Project ${p.id} is missing descriptive media.image_alt`);
  }

  if (p.links?.github) {
    if (repoUrls.has(p.links.github)) {
      errors.push(
        `Duplicate GitHub repo URL "${p.links.github}" shared by ${repoUrls.get(p.links.github)} and ${p.id}`
      );
    }
    repoUrls.set(p.links.github, p.id);
  }

  if (p.status === 'upcoming' && (p.links.github || p.links.demo || p.links.video)) {
    errors.push(`Planned project ${p.id} must not have live repo/demo/video links`);
  }

  if (p.media.type === 'image') {
    const imgFile = path.resolve(p.media.image_path);
    if (!fs.existsSync(imgFile)) {
      errors.push(`Project ${p.id} image file not found: ${p.media.image_path}`);
    } else {
      const stats = fs.statSync(imgFile);
      if (stats.size <= 100) {
        errors.push(`Project ${p.id} image is a 1-byte/empty placeholder (${stats.size} B): ${p.media.image_path}`);
      }
    }
  }

  if (IS_STRICT_PROD) {
    if (p.media.type === 'schematic_todo' && p.status !== 'upcoming') {
      errors.push(`[STRICT_PROD] Project ${p.id} has unresolved schematic_todo media: ${p.media.todo_note}`);
    }
    for (const [k, v] of Object.entries(p.case_study_todos || {})) {
      if (v === 'TODO') {
        errors.push(`[STRICT_PROD] Project ${p.id} has unresolved case_study_todos.${k} === "TODO"`);
      }
    }
  }
}

for (const group of data.skills) {
  if (IS_STRICT_PROD && group.level === 'TODO') {
    errors.push(`[STRICT_PROD] Skill "${group.id}" has unresolved level === "TODO"`);
  }
  for (const pid of group.evidence_projects) {
    if (!projectIds.has(pid)) {
      errors.push(`Skill "${group.name}" references unknown project ID: ${pid}`);
    }
  }
}

const textDump = JSON.stringify({
  about: data.about,
  skills: data.skills,
  projects: data.projects,
  journey: data.journey,
}).toLowerCase();

for (const word of BANNED_WORDS) {
  if (textDump.includes(word.toLowerCase())) {
    errors.push(`Banned marketing filler phrase detected in portfolio.json: "${word}"`);
  }
}

if (errors.length > 0) {
  fail(errors);
}

console.log(
  `[validate-content] Passed (${IS_STRICT_PROD ? 'STRICT_PROD' : 'DEV'} mode): ${data.projects.length} projects, ${data.skills.length} skills, ${data.journey.length} journey items, ${data.certifications.length} certifications.`
);
