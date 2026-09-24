import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** A string that exists in both languages. */
const localized = z.object({
  fa: z.string().min(1),
  en: z.string().min(1),
});

/**
 * One milestone on the timeline = one YAML file in src/content/timeline/.
 * File name convention: `<year>-<slug>.yaml` (the slug is only for humans).
 */
const timeline = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/timeline' }),
  schema: ({ image }) =>
    z.object({
      /** Gregorian year of the milestone. */
      year: z.number().int().min(1990).max(2100),
      /** Order inside the same year (smaller first). */
      order: z.number().int().default(0),
      title: localized,
      summary: localized,
      /** A defining moment of the career: gets more visual weight on the timeline. */
      featured: z.boolean().default(false),
      /** One sentence on why this moment matters, shown under the summary. */
      why: localized.optional(),
      /** Optional short points shown under the summary. */
      highlights: z
        .object({
          fa: z.array(z.string().min(1)),
          en: z.array(z.string().min(1)),
        })
        .optional(),
      /**
       * Up to four photos, paths relative to the YAML file (e.g. ./2021-a.jpg).
       * The first one is shown large next to the year; the rest appear as thumbnails under the text.
       */
      images: z
        .array(
          z.object({
            src: image(),
            alt: localized.optional(),
          }),
        )
        .max(4)
        .default([]),
      /** Notable guests of a show or podcast: who they are, a link to the episode and its views. */
      guests: z
        .array(
          z.object({
            name: localized,
            about: localized,
            url: z.url().optional(),
            stat: localized.optional(),
          }),
        )
        .default([]),
      /** Optional related links (channel, video, article...). */
      links: z
        .array(
          z.object({
            label: localized,
            url: z.url(),
          }),
        )
        .default([]),
    }),
});

export const collections = { timeline };
