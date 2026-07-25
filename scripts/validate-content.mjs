import fs from 'node:fs';
import path from 'node:path';
import { modules, pages } from '../src/data/curriculum.mjs';
import { parseFrontmatter } from './frontmatter-parser.mjs';

const root = path.resolve('src/content/docs');
const allowed = {
  type: new Set(['concept', 'tool', 'practice', 'cheatsheet']),
  level: new Set(['beginner', 'intermediate', 'advanced']),
  module: new Set(['foundations', 'collaboration', 'delivery', 'testing', 'deployment']),
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

  // Standalone pages (the index, the A–Z) only owe a title and a description;
  // module pages owe the full taxonomy, checked again per curriculum entry.
  const isModulePage = /^(?:en\/)?(?:foundations|collaboration|delivery|testing|deployment)\//.test(relative);
  const required = isModulePage
    ? ['title', 'description', 'type', 'level', 'module']
    : ['title', 'description'];
  for (const field of required) {
    if (typeof frontmatter[field] !== 'string' || !frontmatter[field].trim()) {
      errors.push(`${relative}: missing ${field}`);
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
for (const module of modules) {
  if (!allowed.module.has(module.id)) errors.push(`curriculum: invalid module ${module.id}`);
  if (moduleOrders.has(module.order)) errors.push(`curriculum: duplicate module order ${module.order}`);
  moduleOrders.add(module.order);
  if (module.order < 1 || !Number.isInteger(module.order)) {
    errors.push(`curriculum: invalid module order for ${module.id}`);
  }
  for (const item of module.pages) {
    if (ids.has(item.id)) errors.push(`curriculum: duplicate id ${item.id}`);
    if (orders.has(item.order)) errors.push(`curriculum: duplicate order ${item.order}`);
    if (paths.has(item.relativePath)) errors.push(`curriculum: duplicate path ${item.relativePath}`);
    ids.add(item.id);
    orders.add(item.order);
    paths.add(item.relativePath);
    if (item.module !== module.id) errors.push(`curriculum: ${item.id} belongs to invalid module ${item.module}`);
    if (!item.id.startsWith(`${item.module}.`)) errors.push(`curriculum: ${item.id} is not namespaced by its module`);
    if (!item.relativePath.startsWith(`${item.module}/`)) errors.push(`curriculum: ${item.id} has invalid path ${item.relativePath}`);
    if (!Number.isInteger(item.order) || item.order < 1) errors.push(`curriculum: invalid order for ${item.id}`);
  }
}

for (let index = 0; index < pages.length; index += 1) {
  if (pages[index].order !== index + 1) {
    errors.push(`curriculum: ${pages[index].id} must occupy reading position ${index + 1}`);
  }
}

for (const item of pages) {
  // Prerequisites are advisory ("worth knowing first"), but they must still
  // point at real pages that come earlier in the suggested reading order.
  for (const prerequisite of item.prerequisites) {
    const target = pages.find((candidate) => candidate.id === prerequisite);
    if (!target) errors.push(`curriculum: ${item.id} references unknown prerequisite ${prerequisite}`);
    else if (target.order >= item.order) errors.push(`curriculum: ${item.id} prerequisite ${prerequisite} must appear earlier`);
  }

  const paired = {};
  for (const locale of ['es', 'en']) {
    const relative = canonicalFile(item.relativePath, locale);
    const frontmatter = documents.get(relative);
    if (!frontmatter) {
      errors.push(`${relative}: missing canonical ${locale.toUpperCase()} page for ${item.id}`);
      continue;
    }
    paired[locale] = frontmatter;

    for (const field of ['title', 'description', 'type', 'level', 'module']) {
      if (typeof frontmatter[field] !== 'string' || !frontmatter[field].trim()) {
        errors.push(`${relative}: canonical page ${item.id} requires ${field}`);
      }
    }
    for (const field of ['tools', 'prerequisites', 'learningObjectives', 'takeaways']) {
      if (!Array.isArray(frontmatter[field])) {
        errors.push(`${relative}: canonical page ${item.id} requires ${field} array`);
      }
    }
    for (const field of ['learningObjectives', 'takeaways']) {
      if (Array.isArray(frontmatter[field]) && (
        frontmatter[field].length === 0 || frontmatter[field].some((value) => !value.trim())
      )) errors.push(`${relative}: ${field} must contain non-empty text`);
    }

    if (frontmatter.module !== item.module) {
      errors.push(`${relative}: module must be ${item.module} for ${item.id}`);
    }
    const expectedType = item.kind === 'overview' ? 'concept' : item.kind;
    if (frontmatter.type !== expectedType) {
      errors.push(`${relative}: type must be ${expectedType} for ${item.id}`);
    }
    if (Array.isArray(frontmatter.prerequisites) && (
      frontmatter.prerequisites.length !== item.prerequisites.length
      || frontmatter.prerequisites.some((value, index) => value !== item.prerequisites[index])
    )) errors.push(`${relative}: prerequisites must use canonical IDs: [${item.prerequisites.join(', ')}]`);
  }

  for (const field of ['learningObjectives', 'takeaways']) {
    if (Array.isArray(paired.es?.[field]) && Array.isArray(paired.en?.[field])
      && paired.es[field].length !== paired.en[field].length) {
      errors.push(`${canonicalFile(item.relativePath, 'en')}: ${field} count must match its Spanish counterpart`);
    }
  }
}

const canonicalFiles = new Set(pages.flatMap((item) => [
  canonicalFile(item.relativePath, 'es'),
  canonicalFile(item.relativePath, 'en'),
]));
for (const relative of documents.keys()) {
  if (/^(?:en\/)?(?:foundations|collaboration|delivery|testing|deployment)\//.test(relative) && !canonicalFiles.has(relative)) {
    errors.push(`${relative}: module page is not listed in the curriculum`);
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Content validation passed: ${files.length} Markdown pages checked; ${pages.length} bilingual page pairs verified.`);
