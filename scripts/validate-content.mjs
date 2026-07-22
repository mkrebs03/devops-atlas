import fs from 'node:fs';
import path from 'node:path';
import {
  learningModules,
  learningSteps,
} from '../src/data/learning-path.mjs';
import { parseFrontmatter } from './frontmatter-parser.mjs';

const root = path.resolve('src/content/docs');
const allowed = {
  type: new Set(['concept', 'tool', 'lab']),
  level: new Set(['beginner', 'intermediate', 'advanced']),
  module: new Set(['foundations', 'collaboration', 'delivery']),
};

function filesIn(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(absolute);
    return /\.(md|mdx)$/.test(entry.name) ? [absolute] : [];
  });
}

function canonicalFile(relativePath, locale) {
  const normalized = relativePath.replace(/\/$/, '');
  const base = normalized.includes('/')
    ? `${normalized}.md`
    : `${normalized}/index.md`;
  return locale === 'en' ? `en/${base}` : base;
}

const files = filesIn(root);
const errors = [];
const slugs = new Set();
const documents = new Map();

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file).split(path.sep).join('/');
  const slug = relative.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
  let frontmatter;
  try {
    frontmatter = parseFrontmatter(source, relative);
    documents.set(relative, frontmatter);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : `${relative}: invalid frontmatter`);
    continue;
  }

  for (const required of ['title', 'description', 'type', 'level', 'module']) {
    if (typeof frontmatter[required] !== 'string' || !frontmatter[required].trim()) {
      errors.push(`${relative}: missing ${required}`);
    }
  }

  for (const field of ['type', 'level', 'module']) {
    const value = frontmatter[field];
    if (typeof value === 'string' && !allowed[field].has(value)) {
      errors.push(`${relative}: invalid ${field}=${value}`);
    }
  }

  if (slugs.has(slug)) errors.push(`${relative}: duplicate content slug ${slug}`);
  slugs.add(slug);
}

const ids = new Set();
const orders = new Set();
const paths = new Set();
const moduleOrders = new Set();
for (const module of learningModules) {
  if (!allowed.module.has(module.id)) errors.push(`learning path: invalid module ${module.id}`);
  if (moduleOrders.has(module.order)) errors.push(`learning path: duplicate module order ${module.order}`);
  moduleOrders.add(module.order);
  if (module.order < 1 || !Number.isInteger(module.order)) {
    errors.push(`learning path: invalid module order for ${module.id}`);
  }
  for (const step of module.steps) {
    if (ids.has(step.id)) errors.push(`learning path: duplicate id ${step.id}`);
    if (orders.has(step.order)) errors.push(`learning path: duplicate order ${step.order}`);
    if (paths.has(step.relativePath)) errors.push(`learning path: duplicate path ${step.relativePath}`);
    ids.add(step.id);
    orders.add(step.order);
    paths.add(step.relativePath);
    if (step.module !== module.id) errors.push(`learning path: ${step.id} belongs to invalid module ${step.module}`);
    if (!step.id.startsWith(`${step.module}.`)) errors.push(`learning path: ${step.id} is not namespaced by its module`);
    if (!step.relativePath.startsWith(`${step.module}/`)) errors.push(`learning path: ${step.id} has invalid path ${step.relativePath}`);
    if (!Number.isInteger(step.order) || step.order < 1) errors.push(`learning path: invalid order for ${step.id}`);
    if (!Number.isInteger(step.minutes) || step.minutes < 1) errors.push(`learning path: invalid minutes for ${step.id}`);
  }
}

for (let index = 0; index < learningSteps.length; index += 1) {
  if (learningSteps[index].order !== index + 1) {
    errors.push(`learning path: ${learningSteps[index].id} must occupy route position ${index + 1}`);
  }
}

for (const step of learningSteps) {
  for (const prerequisite of step.prerequisites) {
    const prerequisiteStep = learningSteps.find((candidate) => candidate.id === prerequisite);
    if (!prerequisiteStep) errors.push(`learning path: ${step.id} references unknown prerequisite ${prerequisite}`);
    else if (prerequisiteStep.order >= step.order) errors.push(`learning path: ${step.id} prerequisite ${prerequisite} must appear earlier`);
  }

  const paired = {};
  for (const locale of ['es', 'en']) {
    const relative = canonicalFile(step.relativePath, locale);
    const frontmatter = documents.get(relative);
    if (!frontmatter) {
      errors.push(`${relative}: missing canonical ${locale.toUpperCase()} page for ${step.id}`);
      continue;
    }
    paired[locale] = frontmatter;

    for (const field of ['title', 'description', 'type', 'level', 'module', 'estimatedTime']) {
      if (typeof frontmatter[field] !== 'string' || !frontmatter[field].trim()) {
        errors.push(`${relative}: canonical step ${step.id} requires ${field}`);
      }
    }
    for (const field of ['tools', 'prerequisites', 'learningObjectives', 'takeaways']) {
      if (!Array.isArray(frontmatter[field])) {
        errors.push(`${relative}: canonical step ${step.id} requires ${field} array`);
      }
    }
    for (const field of ['learningObjectives', 'takeaways']) {
      if (Array.isArray(frontmatter[field]) && (
        frontmatter[field].length === 0 || frontmatter[field].some((value) => !value.trim())
      )) errors.push(`${relative}: ${field} must contain non-empty text`);
    }

    if (frontmatter.module !== step.module) {
      errors.push(`${relative}: module must be ${step.module} for ${step.id}`);
    }
    const expectedType = step.kind === 'overview' ? 'concept' : step.kind;
    if (frontmatter.type !== expectedType) {
      errors.push(`${relative}: type must be ${expectedType} for ${step.id}`);
    }
    const expectedTime = `${step.minutes} ${locale === 'en' ? 'minutes' : 'minutos'}`;
    if (frontmatter.estimatedTime !== expectedTime) {
      errors.push(`${relative}: estimatedTime must be ${expectedTime} for ${step.id}`);
    }
    if (Array.isArray(frontmatter.prerequisites) && (
      frontmatter.prerequisites.length !== step.prerequisites.length
      || frontmatter.prerequisites.some((value, index) => value !== step.prerequisites[index])
    )) errors.push(`${relative}: prerequisites must use canonical IDs: [${step.prerequisites.join(', ')}]`);
  }

  for (const field of ['learningObjectives', 'takeaways']) {
    if (Array.isArray(paired.es?.[field]) && Array.isArray(paired.en?.[field])
      && paired.es[field].length !== paired.en[field].length) {
      errors.push(`${canonicalFile(step.relativePath, 'en')}: ${field} count must match its Spanish counterpart`);
    }
  }
}

const canonicalFiles = new Set(learningSteps.flatMap((step) => [
  canonicalFile(step.relativePath, 'es'),
  canonicalFile(step.relativePath, 'en'),
]));
for (const relative of documents.keys()) {
  if (/^(?:en\/)?(?:foundations|collaboration|delivery)\//.test(relative) && !canonicalFiles.has(relative)) {
    errors.push(`${relative}: module page is not referenced by the canonical learning path`);
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Content validation passed: ${files.length} Markdown pages checked; ${learningSteps.length} bilingual step pairs verified.`);
