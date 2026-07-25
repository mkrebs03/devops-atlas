// @ts-check
/**
 * The tool index. Built from the `tools` frontmatter of the Spanish canonical
 * pages, which is validated to match the English ones, so one pass describes
 * both editions.
 */
import { getCollection } from 'astro:content';
import { getPage, getPageByPath } from '../data/curriculum.mjs';

/** @typedef {import('../data/curriculum.mjs').Page} Page */
/** @typedef {import('../data/curriculum.mjs').Locale} Locale */

/** Tool names as authored vary in case; this keeps one display form per key.
 * @param {string} value */
const displayName = (value) => value.trim();

/**
 * @returns {Promise<Map<string, readonly string[]>>} page id -> tool names
 */
export async function toolsByPageId() {
  const docs = await getCollection('docs');
  /** @type {Map<string, readonly string[]>} */
  const map = new Map();
  for (const doc of docs) {
    if (doc.id.startsWith('en/')) continue;
    const page = getPageByPath(doc.id);
    if (!page) continue;
    const tools = Array.isArray(doc.data.tools) ? doc.data.tools : [];
    map.set(page.id, Object.freeze(tools.map(displayName)));
  }
  return map;
}

/**
 * Alphabetical tool index: one entry per distinct tool, with the pages that
 * mention it in frontmatter.
 * @param {Locale} locale
 * @returns {Promise<readonly { key: string, name: string, pages: readonly Page[] }[]>}
 */
export async function toolIndex(locale) {
  const byPage = await toolsByPageId();
  /** @type {Map<string, { key: string, name: string, pages: Page[] }>} */
  const entries = new Map();
  for (const [pageId, tools] of byPage) {
    const page = getPage(pageId);
    for (const tool of tools) {
      const key = tool.toLowerCase();
      const existing = entries.get(key) ?? { key, name: tool, pages: [] };
      existing.pages.push(...(page ? [page] : []));
      entries.set(key, existing);
    }
  }
  return Object.freeze(
    [...entries.values()]
      .map((entry) => ({ ...entry, pages: entry.pages.sort((a, b) => a.order - b.order) }))
      .sort((a, b) => a.key.localeCompare(b.key, locale)),
  );
}
