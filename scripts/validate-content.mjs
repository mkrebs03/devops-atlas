import fs from 'node:fs';
import path from 'node:path';
import { LEVELS, MODULE_IDS, PAGE_TYPES, modules, pages } from '../src/data/curriculum.mjs';
import { toolNames } from '../src/data/tool-names.mjs';
import { parseFrontmatter } from './frontmatter-parser.mjs';

const root = path.resolve('src/content/docs');
// The taxonomy lives in curriculum.mjs; content.config.ts consumes the same
// arrays, so the three enforcement points cannot drift from each other.
const allowed = {
  type: new Set(PAGE_TYPES),
  level: new Set(LEVELS),
  module: new Set(MODULE_IDS),
};
const modulePath = new RegExp(`^(?:en/)?(?:${MODULE_IDS.join('|')})/`);

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

  // Spanish questions open with ¿. The <summary> self-checks are where the
  // mark keeps going missing, so the rule is enforced rather than assumed.
  if (!relative.startsWith('en/')) {
    for (const match of source.matchAll(/<summary>([^]*?)<\/summary>/g)) {
      const text = match[1].trim();
      if (text.endsWith('?') && !text.includes('¿')) {
        errors.push(`${relative}: <summary> question is missing the opening ¿: "${text}"`);
      }
    }
  }

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
  const isModulePage = modulePath.test(relative);
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

  // Every tool slug must have a display name, or the A–Z index and the tool
  // chips would fall back to printing the raw slug.
  if (Array.isArray(frontmatter.tools)) {
    for (const tool of frontmatter.tools) {
      if (!Object.hasOwn(toolNames, tool)) {
        errors.push(`${relative}: tool slug "${tool}" has no display name in src/data/tool-names.mjs`);
      }
    }
  }

  if (slugs.has(slug)) errors.push(`${relative}: duplicate content slug ${slug}`);
  slugs.add(slug);
}

// Bilingual parity is a hard product constraint, and a missing English file
// would not fail the build: Starlight quietly fills the route with Spanish
// content. So the files themselves are paired for every page — standalone
// ones (index, what-is-devops, tools, glossary, 404) included.
const relatives = files.map((file) => path.relative(root, file).split(path.sep).join('/'));
const spanishFiles = new Set(relatives.filter((relative) => !relative.startsWith('en/')));
const englishFiles = new Set(relatives.filter((relative) => relative.startsWith('en/')).map((relative) => relative.slice(3)));
for (const relative of spanishFiles) {
  if (!englishFiles.has(relative)) errors.push(`en/${relative}: missing English counterpart of ${relative}`);
}
for (const relative of englishFiles) {
  if (!spanishFiles.has(relative)) errors.push(`${relative}: missing Spanish counterpart of en/${relative}`);
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

  // The landing cards print module.tools; every entry must be a tool that
  // some page of the module actually declares, under the display name the
  // A–Z index shows, or the card advertises what /tools/ cannot find.
  const declared = new Set();
  for (const item of module.pages) {
    const frontmatter = documents.get(canonicalFile(item.relativePath, 'es'));
    if (Array.isArray(frontmatter?.tools)) {
      for (const tool of frontmatter.tools) declared.add((toolNames[tool] ?? tool).toLowerCase());
    }
  }
  for (const tool of module.tools) {
    if (!declared.has(tool.toLowerCase())) {
      errors.push(`curriculum: module ${module.id} lists tool "${tool}" that none of its pages declare`);
    }
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
    // Sidebar, landing cards and prev/next links all print the curriculum
    // label, so it must read exactly like the page's own title. Overviews are
    // the one deliberate exception: a short label against the module title.
    if (item.kind !== 'overview' && typeof frontmatter.title === 'string'
      && frontmatter.title.trim() && frontmatter.title !== item.label[locale]) {
      errors.push(`${relative}: title "${frontmatter.title}" must match the curriculum label "${item.label[locale]}"`);
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

  // Level and tools describe the shared canonical page, not one edition of
  // it, so both locales must state the same values — tools in the same order,
  // since the Spanish list is the one every tool index is built from.
  if (paired.es && paired.en) {
    const relative = canonicalFile(item.relativePath, 'en');
    if (paired.es.level !== paired.en.level) {
      errors.push(`${relative}: level must match its Spanish counterpart (${paired.es.level})`);
    }
    if (Array.isArray(paired.es.tools) && Array.isArray(paired.en.tools) && (
      paired.es.tools.length !== paired.en.tools.length
      || paired.es.tools.some((value, index) => value !== paired.en.tools[index])
    )) errors.push(`${relative}: tools must match its Spanish counterpart in the same order: [${paired.es.tools.join(', ')}]`);
  }
}

const canonicalFiles = new Set(pages.flatMap((item) => [
  canonicalFile(item.relativePath, 'es'),
  canonicalFile(item.relativePath, 'en'),
]));
for (const relative of documents.keys()) {
  if (modulePath.test(relative) && !canonicalFiles.has(relative)) {
    errors.push(`${relative}: module page is not listed in the curriculum`);
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Content validation passed: ${files.length} Markdown pages checked; ${pages.length} bilingual page pairs verified.`);
