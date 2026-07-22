// @ts-check
/**
 * Turn ```mermaid fenced code blocks into a raw `<pre class="mermaid">` element so
 * Expressive Code leaves them alone and the client runner can render them. Runs at
 * build time on the mdast; no browser is needed here (rendering is client-side).
 */

/** @param {string} value */
const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** @param {any} node */
function transform(node) {
  if (!node || !Array.isArray(node.children)) return;
  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    if (child && child.type === 'code' && child.lang === 'mermaid') {
      node.children[i] = {
        type: 'html',
        value: `<pre class="mermaid" role="img" aria-label="Diagrama">${escapeHtml(child.value)}</pre>`,
      };
    } else {
      transform(child);
    }
  }
}

export default function remarkMermaid() {
  /** @param {any} tree */
  return (tree) => transform(tree);
}
