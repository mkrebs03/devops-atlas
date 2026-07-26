/*
  Wraps every Markdown table in a div, so a wide table can scroll inside its
  own container instead of stretching the whole page.

  A <table> sizes to its content and overflows its parent rather than wrap;
  the only robust containment is a block wrapper with `overflow-x: auto`.
  Authors write plain Markdown pipe tables and cannot add that wrapper, so it
  is put there at build time. This plugin only provides the hook — the
  `atlas-table-wrap` class is styled in the site stylesheets.

  Unlike <details> (see rehype-details-body), Markdown tables arrive here as
  parsed elements, not raw HTML strings, so an element pass is enough. Tables
  already sitting inside a wrapper are left alone, which keeps the pass
  idempotent if it ever runs twice.
*/

const WRAP_CLASS = 'atlas-table-wrap';

const isWrapper = (node) =>
  node.type === 'element' && node.tagName === 'div'
  && [].concat(node.properties?.className ?? []).includes(WRAP_CLASS);

export function rehypeTableWrap() {
  return (tree) => {
    const walk = (node) => {
      if (!node || typeof node !== 'object' || !Array.isArray(node.children)) return;
      const wrapped = isWrapper(node);
      node.children = node.children.map((child) => {
        walk(child);
        if (!wrapped && child?.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: [WRAP_CLASS] },
            children: [child],
          };
        }
        return child;
      });
    };

    walk(tree);
  };
}

export default rehypeTableWrap;
