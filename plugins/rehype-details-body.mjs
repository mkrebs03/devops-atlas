/*
  Wraps the body of a <details> — everything after its <summary> — in a single
  element.

  A disclosure that opens by growing needs a height it can travel to. The only
  way to interpolate that in every engine is a grid track (`0fr` to `1fr`);
  animating to a height of `auto` needs `interpolate-size`, which today only
  Chromium has. A track sizes to one item, and `::details-content` is a
  pseudo-element whose children cannot be selected from CSS, so the thing that
  collapses has to be a real element. Authors write plain <details> in the
  content, so it is put there at build time.

  It works on raw HTML rather than on parsed elements because Astro runs
  rehype-raw after the plugins configured here: at this point a <details>
  authored in markdown is still an unparsed string, and its body is a run of
  sibling nodes rather than its children. Both shapes are handled anyway, so the
  plugin keeps working if that order ever changes.

  Without it the disclosure still opens — it just opens in one frame.
*/

const BODY_CLASS = 'atlas-details__body';
const OPEN_BODY = `<div class="${BODY_CLASS}">`;

/* Raw-string pass. `depth` carries across nodes because a single <details> is
   split over several of them, with the markdown-rendered body in between. */
function rewriteRaw(value, state) {
  let out = '';
  let rest = value;
  const token = /<\/summary\s*>|<\/details\s*>/i;

  for (let match = rest.match(token); match; match = rest.match(token)) {
    const at = match.index;
    const tag = match[0];
    out += rest.slice(0, at);
    rest = rest.slice(at + tag.length);

    if (/summary/i.test(tag)) {
      out += tag + OPEN_BODY;
      state.depth += 1;
    } else {
      // Only close a body this pass actually opened; a stray </details> stays as
      // written rather than emitting an orphan </div>.
      if (state.depth > 0) {
        out += '</div>';
        state.depth -= 1;
      }
      out += tag;
    }
  }
  return out + rest;
}

/* Element pass, for the day a <details> arrives already parsed. */
const isSummary = (n) => n.type === 'element' && n.tagName === 'summary';
const isBlank = (n) => n.type === 'text' && n.value.trim() === '';
const isBody = (n) =>
  n.type === 'element' && n.tagName === 'div' && [].concat(n.properties?.className ?? []).includes(BODY_CLASS);

function wrapElement(node) {
  const children = node.children ?? [];
  if (children.some(isBody)) return;

  const summaryAt = children.findIndex(isSummary);
  if (summaryAt === -1) return;

  const body = children.slice(summaryAt + 1).filter((c) => !isBlank(c));
  if (body.length === 0) return;

  node.children = [
    ...children.slice(0, summaryAt + 1),
    { type: 'element', tagName: 'div', properties: { className: [BODY_CLASS] }, children: body },
  ];
}

export function rehypeDetailsBody() {
  return (tree) => {
    const state = { depth: 0 };

    const walk = (node) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'raw' && typeof node.value === 'string') {
        node.value = rewriteRaw(node.value, state);
        return;
      }
      if (node.type === 'element' && node.tagName === 'details') wrapElement(node);
      for (const child of node.children ?? []) walk(child);
    };

    walk(tree);
  };
}

export default rehypeDetailsBody;
