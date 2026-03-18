import { z } from 'zod';

const VALID_SECTIONS = [
  'news',
  'finance',
  'sports',
  'entertainment',
  'lifestyle',
  'science',
  'technology',
] as const;

export const ArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  author: z.string().min(1, 'Author is required'),
  section: z.enum(VALID_SECTIONS, {
    error: `Section must be one of: ${VALID_SECTIONS.join(', ')}`,
  }),
  summary: z.string().optional(),
  content: z.string().optional(),
  snippet: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  body: z.array(z.string()).optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  date: z.string(),
});

export const TrendingTopicSchema = z.object({
  label: z.string().min(1, 'Label is required'),
});

export const TrendingTopicsArraySchema = z.array(
  z.string().min(1, 'Each trending topic must be a non-empty string')
);

export const SubscriberSchema = z.object({
  email: z.string().email('Email required'),
});

export const SettingsSchema = z.object({
  siteTitle: z.string(),
  siteDescription: z.string(),
  heroArticleSlug: z.string(),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;
export type TrendingTopicInput = z.infer<typeof TrendingTopicSchema>;
export type SubscriberInput = z.infer<typeof SubscriberSchema>;
export type SettingsInput = z.infer<typeof SettingsSchema>;
