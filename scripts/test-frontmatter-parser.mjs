import assert from 'node:assert/strict';
import { parseFrontmatter } from './frontmatter-parser.mjs';

const parsed = parseFrontmatter(`---
tools: [plain, it's, next, "quoted, comma", 'single, comma', "say \\"hello\\"", 'it''s valid']
summary: "Observe: then act"
inlineGuidance: ["Observe: then act"]
blockGuidance:
  - 'Observe: then act'
---
`, 'valid.md');

assert.deepEqual(parsed.tools, [
  'plain',
  "it's",
  'next',
  'quoted, comma',
  'single, comma',
  'say "hello"',
  "it's valid",
]);
assert.equal(parsed.summary, 'Observe: then act');
assert.deepEqual(parsed.inlineGuidance, ['Observe: then act']);
assert.deepEqual(parsed.blockGuidance, ['Observe: then act']);

assert.throws(
  () => parseFrontmatter(`---
tools: ["unterminated]
---
`, 'unterminated.md'),
  /unterminated\.md:2: unterminated quoted scalar/,
);

assert.throws(
  () => parseFrontmatter(`---
tools: ["closed" trailing]
---
`, 'trailing.md'),
  /trailing\.md:2: unexpected text after quoted scalar/,
);

assert.throws(
  () => parseFrontmatter(`---
tools: [plain "mixed"]
---
`, 'mixed.md'),
  /mixed\.md:2: quotes must wrap an entire scalar value/,
);

assert.throws(
  () => parseFrontmatter(String.raw`---
tools: ["bad\qescape"]
---
`, 'escape.md'),
  /escape\.md:2: unsupported escape \\q in quoted scalar/,
);

assert.throws(
  () => parseFrontmatter(`---
title: "mismatched'
---
`, 'scalar-quote.md'),
  /scalar-quote\.md:2: unterminated quoted scalar/,
);

assert.throws(
  () => parseFrontmatter(`---
items:
  - 'mismatched"
---
`, 'block-quote.md'),
  /block-quote\.md:3: unterminated quoted scalar/,
);

assert.throws(
  () => parseFrontmatter(`---
items: [nested: value]
---
`, 'inline-map.md'),
  /inline-map\.md:2: unquoted colon in an array item is not supported/,
);

assert.throws(
  () => parseFrontmatter(`---
items:
  - nested: value
---
`, 'block-map.md'),
  /block-map\.md:3: unquoted colon in an array item is not supported/,
);

console.log('Frontmatter parser assertions passed.');
