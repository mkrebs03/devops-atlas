import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/content/docs');
const allowed = {
  type: new Set(['concept', 'tool', 'lab']),
  level: new Set(['beginner', 'intermediate']),
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

function frontmatterOf(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  return match?.[1] ?? '';
}

function valueOf(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '');
}

const files = filesIn(root);
const errors = [];
const slugs = new Set();

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const frontmatter = frontmatterOf(source);
  const relative = path.relative(root, file);
  const slug = relative.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
  if (!frontmatter) errors.push(`${relative}: missing frontmatter`);

  for (const required of ['title', 'description', 'type', 'level', 'module']) {
    if (!valueOf(frontmatter, required)) errors.push(`${relative}: missing ${required}`);
  }

  for (const field of ['type', 'level', 'module']) {
    const value = valueOf(frontmatter, field);
    if (value && !allowed[field].has(value)) errors.push(`${relative}: invalid ${field}=${value}`);
  }

  if (slugs.has(slug)) errors.push(`${relative}: duplicate content slug ${slug}`);
  slugs.add(slug);
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Content validation passed: ${files.length} Markdown pages checked.`);
