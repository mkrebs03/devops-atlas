import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

const moduleSchema = z.enum(['foundations', 'collaboration', 'delivery', 'testing', 'deployment']);
const typeSchema = z.enum(['concept', 'tool', 'lab']);
const levelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        type: typeSchema,
        level: levelSchema,
        module: moduleSchema,
        tools: z.array(z.string()),
        estimatedTime: z.string().optional(),
        prerequisites: z.array(z.string()),
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
