import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const SpecRowSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const CaseStudyTodosSchema = z.object({
  problem: z.string(),
  my_role_vs_team: z.string(),
  outcome: z.string(),
  what_i_would_change: z.string(),
});

const ProjectSchema = z.object({
  id: z.string().regex(/^p-[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(3),
  category: z.string().min(2),
  status: z.enum(['active', 'complete', 'upcoming']),
  status_label: z.string().min(2),
  short_description: z.string().min(10),
  full_description: z.string().min(20),
  highlights: z.array(z.string().min(5)).min(1),
  specs: z.array(SpecRowSchema).min(2),
  case_study_todos: CaseStudyTodosSchema,
  tech_tags: z.array(z.string().min(1)).min(1),
  links: z.object({
    github: z.union([z.url(), z.literal('')]),
    video: z.union([z.url(), z.literal('')]),
    demo: z.union([z.url(), z.literal('')]),
    paper: z.union([z.url(), z.literal('')]),
  }),
  media: z.object({
    type: z.enum(['image', 'schematic_todo']),
    image_path: z.string(),
    image_alt: z.string().min(10),
    todo_note: z.string().optional(),
  }),
  featured: z.boolean(),
  order: z.number().int().positive(),
});

const SkillGroupSchema = z.object({
  id: z.string().regex(/^sk-[a-z0-9-]+$/),
  category: z.string().min(2),
  name: z.string().min(2),
  description: z.string().min(10),
  level: z.enum(['used on hardware', 'used in coursework', 'learning', 'daily workflow', 'TODO']),
  evidence_projects: z.array(z.string()),
  tags: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
});

const JourneySchema = z.object({
  id: z.string().regex(/^j-[a-z0-9-]+$/),
  role: z.string().min(2),
  organisation: z.string().min(2),
  location: z.string().min(2),
  period: z.string().min(4),
  year_label: z.string().length(4),
  type: z.enum(['education', 'activity', 'self-study']),
  type_badge: z.string().min(2),
  status: z.enum(['active', 'complete']),
  status_label: z.string().min(2),
  description: z.string().min(10),
  highlights: z.array(z.string().min(5)).min(1),
  skills: z.array(z.string().min(1)).min(1),
});

const CertificationSchema = z.object({
  id: z.string().regex(/^cert-[a-z0-9-]+$/),
  name: z.string().min(2),
  issuer: z.string().min(2),
  year: z.string().length(4),
  score: z.string().min(2),
  url: z.url(),
  category: z.string().min(2),
});

export const PortfolioRootSchema = z.object({
  _meta: z.object({
    schema_version: z.string(),
    last_updated: z.string(),
    author: z.string(),
    note: z.string(),
  }),
  about: z.object({
    name: z.string().min(2),
    tagline: z.string().min(2),
    bio_paragraphs: z.array(z.string().min(10)).min(1),
    location: z.string().min(2),
    email: z.email(),
    status: z.string().min(2),
    status_active: z.boolean(),
    media: z.object({
      type: z.enum(['image', 'video', 'none']),
      image_path: z.string(),
      image_alt: z.string().min(5),
      todo_note: z.string().optional(),
    }),
    socials: z.array(
      z.object({
        label: z.string().min(2),
        url: z.url(),
        icon: z.enum(['github', 'linkedin']),
      })
    ),
    tech_tags: z.array(z.string().min(1)),
  }),
  skills: z.array(SkillGroupSchema),
  projects: z.array(ProjectSchema),
  journey: z.array(JourneySchema),
  certifications: z.array(CertificationSchema),
});

const portfolio = defineCollection({
  loader: async () => {
    const fs = await import('node:fs/promises');
    const raw = await fs.readFile(new URL('./data/portfolio.json', import.meta.url), 'utf-8');
    const parsed = JSON.parse(raw);
    return [{ id: 'main', ...parsed }];
  },
  schema: PortfolioRootSchema,
});

export const collections = { portfolio };
