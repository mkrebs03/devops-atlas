import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

const moduleSchema = z.enum(['foundations', 'collaboration', 'delivery']);
const typeSchema = z.enum(['concept', 'tool', 'lab']);
const levelSchema = z.enum(['beginner', 'intermediate']);

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        type: typeSchema.default('concept'),
        level: levelSchema.default('beginner'),
        module: moduleSchema.default('foundations'),
        tools: z.array(z.string()).default([]),
        estimatedTime: z.string().optional(),
        prerequisites: z.array(z.string()).default([]),
      }),
    }),
  }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema(),
  }),
};
