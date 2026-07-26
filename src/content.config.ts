import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { LEVELS, MODULE_IDS, PAGE_TYPES } from './data/curriculum.mjs';

// The taxonomy enums live in curriculum.mjs; building the schemas from the
// same arrays keeps schema, curriculum and validator from drifting apart.
const moduleSchema = z.enum(MODULE_IDS);
const typeSchema = z.enum(PAGE_TYPES);
const levelSchema = z.enum(LEVELS);

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      // Module pages carry the full set; the index and the A–Z page do not.
      // `scripts/validate-content.mjs` enforces the required fields per page.
      extend: z.object({
        type: typeSchema.optional(),
        level: levelSchema.optional(),
        module: moduleSchema.optional(),
        tools: z.array(z.string()).optional(),
        prerequisites: z.array(z.string()).optional(),
        learningObjectives: z.array(z.string()).optional(),
        takeaways: z.array(z.string()).optional(),
      }),
    }),
  }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema(),
  }),
};
