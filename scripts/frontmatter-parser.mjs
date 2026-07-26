function syntaxError(filename, lineNumber, message) {
  return new Error(`${filename}:${lineNumber}: ${message}`);
}

/* Real YAML drops a trailing ` # comment`; keep parity so the validator sees
   the same value the site renders. A `#` inside quotes is text, not a comment. */
function stripTrailingComment(value) {
  let quote;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      if (quote === '"' && character === '\\') index += 1;
      else if (character === quote) quote = undefined;
    } else if (character === "'" || character === '"') {
      quote = character;
    } else if (character === '#' && (index === 0 || /\s/.test(value[index - 1]))) {
      return value.slice(0, index).trimEnd();
    }
  }
  return value;
}

function parseScalar(rawValue, filename, lineNumber, { arrayItem = false } = {}) {
  const value = rawValue.trim();
  if (!value) throw syntaxError(filename, lineNumber, 'scalar values must be non-empty');

  const openingQuote = value[0];
  if (openingQuote === "'" || openingQuote === '"') {
    let parsed = '';
    let escaped = false;
    for (let index = 1; index < value.length; index += 1) {
      const character = value[index];
      if (escaped) {
        if (character !== '"' && character !== '\\') {
          throw syntaxError(filename, lineNumber, `unsupported escape \\${character} in quoted scalar`);
        }
        parsed += character;
        escaped = false;
      } else if (openingQuote === '"' && character === '\\') {
        escaped = true;
      } else if (openingQuote === "'" && character === "'" && value[index + 1] === "'") {
        parsed += "'";
        index += 1;
      } else if (character === openingQuote) {
        if (value.slice(index + 1).trim()) {
          throw syntaxError(filename, lineNumber, 'unexpected text after quoted scalar');
        }
        if (!parsed) throw syntaxError(filename, lineNumber, 'scalar values must be non-empty');
        return parsed;
      } else {
        parsed += character;
      }
    }
    throw syntaxError(filename, lineNumber, 'unterminated quoted scalar');
  }

  // Apostrophes inside a word ("it's") or closing one ("admins'") are text,
  // not quoting; anything else looks like a quote gone wrong.
  const withoutWordApostrophes = value
    .replace(/([\p{L}\p{N}])'(?=[\p{L}\p{N}])/gu, '$1')
    .replace(/([\p{L}\p{N}])'(?=\s|$)/gu, '$1');
  if (value.includes('"') || withoutWordApostrophes.includes("'")) {
    throw syntaxError(filename, lineNumber, 'quotes must wrap an entire scalar value');
  }
  if (arrayItem && value.includes(':')) {
    throw syntaxError(filename, lineNumber, 'unquoted colon in an array item is not supported; quote it as text');
  }
  // YAML reads `key: text: more` as a nested mapping; the site would fail on
  // it later, so fail here with the same advice the array case gives.
  if (!arrayItem && (/:\s/.test(value) || value.endsWith(':'))) {
    throw syntaxError(filename, lineNumber, 'unquoted colon in a scalar value is not supported; quote it as text');
  }
  if (arrayItem && /[\[\]{}]/.test(value)) {
    throw syntaxError(filename, lineNumber, 'nested arrays or objects are not supported');
  }
  return value;
}

function parseInlineArray(value, filename, lineNumber) {
  if (!value.endsWith(']')) {
    throw syntaxError(filename, lineNumber, 'unterminated inline array');
  }

  const body = value.slice(1, -1);
  if (!body.trim()) return [];

  const tokens = [];
  let token = '';
  let quote;
  let escaped = false;

  const finishToken = () => {
    if (!token.trim()) throw syntaxError(filename, lineNumber, 'inline array items must be non-empty');
    tokens.push(token);
    token = '';
  };

  for (let index = 0; index < body.length; index += 1) {
    const character = body[index];

    if (quote) {
      token += character;
      if (escaped) {
        escaped = false;
      } else if (quote === '"' && character === '\\') {
        escaped = true;
      } else if (quote === "'" && character === "'" && body[index + 1] === "'") {
        token += body[index + 1];
        index += 1;
      } else if (character === quote) {
        quote = undefined;
      }
      continue;
    }

    if (character === "'" || character === '"') {
      token += character;
      if (!token.slice(0, -1).trim()) quote = character;
    } else if (character === ',') {
      finishToken();
    } else {
      token += character;
    }
  }

  finishToken();
  return tokens.map((item) => parseScalar(item, filename, lineNumber, { arrayItem: true }));
}

/**
 * Parse the deliberately small frontmatter subset used by this repository.
 * Supports top-level scalars, inline arrays, and indented dash arrays only.
 */
export function parseFrontmatter(source, filename) {
  const lines = source.replace(/^\uFEFF/, '').split(/\r?\n/);
  if (lines[0] !== '---') throw new Error(`${filename}:1: missing frontmatter`);
  const end = lines.indexOf('---', 1);
  if (end === -1) throw new Error(`${filename}:1: unterminated frontmatter`);

  const data = {};
  let pendingArray;
  for (let index = 1; index < end; index += 1) {
    const line = lines[index];
    const lineNumber = index + 1;
    if (!line.trim() || line.trimStart().startsWith('#')) continue;

    const arrayItem = line.match(/^\s{2,}-\s+(.+)$/);
    if (arrayItem) {
      if (!pendingArray) {
        throw syntaxError(filename, lineNumber, 'array item has no parent field');
      }
      const rawItem = stripTrailingComment(arrayItem[1]);
      if (/^-\s/.test(rawItem)) {
        throw syntaxError(filename, lineNumber, 'nested lists are not supported');
      }
      const item = parseScalar(rawItem, filename, lineNumber, { arrayItem: true });
      data[pendingArray].push(item);
      continue;
    }

    if (/^\s/.test(line)) {
      throw syntaxError(filename, lineNumber, 'nested objects and continuation syntax are not supported');
    }

    const field = line.match(/^([A-Za-z][\w-]*):(?:\s*(.*))?$/);
    if (!field) throw syntaxError(filename, lineNumber, 'unsupported frontmatter syntax');
    const [, key, raw = ''] = field;
    if (Object.hasOwn(data, key)) throw syntaxError(filename, lineNumber, `duplicate field ${key}`);

    const value = stripTrailingComment(raw.trim());
    if (!value) {
      data[key] = [];
      pendingArray = key;
    } else if (value.startsWith('[')) {
      data[key] = parseInlineArray(value, filename, lineNumber);
      pendingArray = undefined;
    } else {
      if (/[{}]/.test(value) || value.startsWith('|') || value.startsWith('>')) {
        throw syntaxError(filename, lineNumber, 'nested objects and multiline scalars are not supported');
      }
      data[key] = parseScalar(value, filename, lineNumber);
      pendingArray = undefined;
    }
  }
  return data;
}
