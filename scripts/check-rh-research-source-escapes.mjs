import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DATA_DIRECTORY = fileURLToPath(new URL('../src/data/rh-research/', import.meta.url));
const SIMPLE_JAVASCRIPT_ESCAPES = new Set(['b', 'f', 'n', 'r', 't', 'v']);
const REGEX_PREFIX_KEYWORDS = new Set([
  'await', 'case', 'delete', 'in', 'instanceof', 'new', 'of', 'return', 'throw', 'typeof', 'void', 'yield',
]);
const REGEX_PREFIX_PUNCTUATORS = new Set([
  '(', '[', '{', ',', ';', ':', '=', '!', '?', '+', '-', '*', '%', '&', '|', '^', '~', '<', '>',
]);

function buildLineStarts(source) {
  const starts = [0];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === '\n') starts.push(index + 1);
  }
  return starts;
}

function sourceLocation(lineStarts, index) {
  let low = 0;
  let high = lineStarts.length;
  while (low + 1 < high) {
    const middle = Math.floor((low + high) / 2);
    if (lineStarts[middle] <= index) low = middle;
    else high = middle;
  }
  return { line: low + 1, column: index - lineStarts[low] + 1 };
}

function isIdentifierStart(character) {
  return /[A-Za-z_$]/.test(character || '');
}

function isIdentifierPart(character) {
  return /[A-Za-z0-9_$]/.test(character || '');
}

function isHex(character) {
  return /[0-9A-Fa-f]/.test(character || '');
}

function validUnicodeEscape(source, slashIndex) {
  if (source[slashIndex + 2] === '{') {
    const close = source.indexOf('}', slashIndex + 3);
    if (close === -1) return false;
    const digits = source.slice(slashIndex + 3, close);
    return digits.length > 0 && [...digits].every(isHex);
  }
  return [2, 3, 4, 5].every((offset) => isHex(source[slashIndex + offset]));
}

function unsafeLetterEscape(source, slashIndex) {
  const first = source[slashIndex + 1];
  if (!/[A-Za-z]/.test(first || '')) return null;

  let end = slashIndex + 2;
  while (/[A-Za-z]/.test(source[end] || '')) end += 1;
  const command = source.slice(slashIndex + 1, end);

  if (command.length === 1 && SIMPLE_JAVASCRIPT_ESCAPES.has(first)) return null;
  if (first === 'x' && isHex(source[slashIndex + 2]) && isHex(source[slashIndex + 3])) return null;
  if (first === 'u' && validUnicodeEscape(source, slashIndex)) return null;

  return `\\${command}`;
}

function canStartRegex(tokens) {
  const previous = tokens.at(-1);
  if (!previous) return true;
  if (previous.type === 'identifier') return REGEX_PREFIX_KEYWORDS.has(previous.value);
  return previous.type === 'punctuator' && REGEX_PREFIX_PUNCTUATORS.has(previous.value);
}

function isRawTemplateTag(tokens, rawAliases) {
  const previous = tokens.at(-1);
  if (previous?.type === 'identifier' && rawAliases.has(previous.value)) return true;
  return tokens.at(-3)?.value === 'String' && tokens.at(-2)?.value === '.' && previous?.value === 'raw';
}

/**
 * Lex JavaScript far enough to identify source string literals without mistaking
 * comments or regular-expression bodies for strings. This deliberately checks
 * source bytes before JavaScript can silently turn `\tau` into a tab.
 */
export function findUnsafeResearchStringEscapes(source, file = '<source>') {
  const findings = [];
  const lineStarts = buildLineStarts(source);
  const rawAliases = new Set();
  const tokens = [];

  function pushToken(type, value) {
    tokens.push({ type, value });
    if (tokens.length > 12) tokens.shift();

    const tail = tokens.slice(-6);
    if (
      tail.length === 6 &&
      tail[0].value === 'const' &&
      tail[1].type === 'identifier' &&
      tail[2].value === '=' &&
      tail[3].value === 'String' &&
      tail[4].value === '.' &&
      tail[5].value === 'raw'
    ) {
      rawAliases.add(tail[1].value);
    }
  }

  function recordUnsafeEscape(index, quote) {
    const escape = unsafeLetterEscape(source, index);
    if (!escape) return;
    findings.push({ file, ...sourceLocation(lineStarts, index), escape, quote });
  }

  function scanQuotedString(start, quote) {
    let index = start + 1;
    while (index < source.length) {
      const character = source[index];
      if (character === quote) return index + 1;
      if (character === '\\') {
        const next = source[index + 1];
        if (next !== '\n' && next !== '\r') recordUnsafeEscape(index, quote);
        index += 2;
        continue;
      }
      if (character === '\n' || character === '\r') return index;
      index += 1;
    }
    return index;
  }

  function scanRegex(start) {
    let index = start + 1;
    let inCharacterClass = false;
    while (index < source.length) {
      const character = source[index];
      if (character === '\\') {
        index += 2;
        continue;
      }
      if (character === '[') inCharacterClass = true;
      else if (character === ']') inCharacterClass = false;
      else if (character === '/' && !inCharacterClass) {
        index += 1;
        while (/[A-Za-z]/.test(source[index] || '')) index += 1;
        return index;
      }
      if (character === '\n' || character === '\r') return index;
      index += 1;
    }
    return index;
  }

  function scanTemplate(start, rawTagged) {
    let index = start + 1;
    while (index < source.length) {
      const character = source[index];
      if (character === '`') return index + 1;
      if (character === '\\') {
        if (!rawTagged) recordUnsafeEscape(index, '`');
        index += 2;
        continue;
      }
      if (character === '$' && source[index + 1] === '{') {
        // The interpolation begins a fresh expression. Do not let the outer
        // template's raw tag leak onto an untagged nested template.
        pushToken('punctuator', '{');
        index = scanCode(index + 2, true);
        continue;
      }
      index += 1;
    }
    return index;
  }

  function scanCode(start = 0, stopAtTemplateBrace = false) {
    let index = start;
    let braceDepth = 0;

    while (index < source.length) {
      const character = source[index];

      if (/\s/.test(character)) {
        index += 1;
        continue;
      }
      if (character === '/' && source[index + 1] === '/') {
        index += 2;
        while (index < source.length && source[index] !== '\n' && source[index] !== '\r') index += 1;
        continue;
      }
      if (character === '/' && source[index + 1] === '*') {
        const close = source.indexOf('*/', index + 2);
        index = close === -1 ? source.length : close + 2;
        continue;
      }
      if (character === "'" || character === '"') {
        index = scanQuotedString(index, character);
        pushToken('string', '<string>');
        continue;
      }
      if (character === '`') {
        const rawTagged = isRawTemplateTag(tokens, rawAliases);
        index = scanTemplate(index, rawTagged);
        pushToken('template', rawTagged ? '<raw-template>' : '<template>');
        continue;
      }
      if (character === '/') {
        if (canStartRegex(tokens)) {
          index = scanRegex(index);
          pushToken('regex', '<regex>');
        } else {
          pushToken('punctuator', '/');
          index += source[index + 1] === '=' ? 2 : 1;
        }
        continue;
      }
      if (isIdentifierStart(character)) {
        let end = index + 1;
        while (isIdentifierPart(source[end])) end += 1;
        pushToken('identifier', source.slice(index, end));
        index = end;
        continue;
      }
      if (/[0-9]/.test(character)) {
        let end = index + 1;
        while (/[0-9A-Fa-f_xXobOB.eE+-]/.test(source[end] || '')) end += 1;
        pushToken('number', source.slice(index, end));
        index = end;
        continue;
      }
      if (character === '{') {
        braceDepth += 1;
        pushToken('punctuator', character);
        index += 1;
        continue;
      }
      if (character === '}') {
        if (stopAtTemplateBrace && braceDepth === 0) return index + 1;
        braceDepth = Math.max(0, braceDepth - 1);
        pushToken('punctuator', character);
        index += 1;
        continue;
      }

      pushToken('punctuator', character);
      index += 1;
    }
    return index;
  }

  scanCode();
  return findings;
}

function expectFindings(name, source, expectedEscapes) {
  const actual = findUnsafeResearchStringEscapes(source, `<self-test:${name}>`).map(({ escape }) => escape);
  if (JSON.stringify(actual) !== JSON.stringify(expectedEscapes)) {
    throw new Error(`${name} source-escape self-test failed: expected ${JSON.stringify(expectedEscapes)}, got ${JSON.stringify(actual)}`);
  }
}

function runSelfTests() {
  expectFindings('single-quoted-cosh', String.raw`const value = '\cosh';`, [String.raw`\cosh`]);
  expectFindings('double-quoted-le', String.raw`const value = "\le";`, [String.raw`\le`]);
  expectFindings('template-tau', 'const value = `' + String.raw`\tau` + '`;', [String.raw`\tau`]);
  expectFindings('template-times', 'const value = `' + String.raw`\times` + '`;', [String.raw`\times`]);
  expectFindings(
    'doubled-backslashes',
    String.raw`const a = '\\cosh'; const b = "\\le";` + ' const c = `' + String.raw`\\tau \\times` + '`;',
    [],
  );
  expectFindings(
    'direct-string-raw',
    'const value = String.raw`' + String.raw`\cosh \le \tau \times` + '`;',
    [],
  );
  expectFindings(
    'string-raw-alias',
    'const tex = String.raw; const value = tex`' + String.raw`\cosh \le \tau \times` + '`;',
    [],
  );
  expectFindings(
    'raw-template-expression-is-still-code',
    'const value = String.raw`safe ${' + String.raw`'\cosh'` + '}`;',
    [String.raw`\cosh`],
  );
  expectFindings(
    'raw-template-expression-nested-ordinary-template',
    'const value = String.raw`${`' + String.raw`\tau` + '`}`;',
    [String.raw`\tau`],
  );
  expectFindings(
    'raw-template-expression-nested-raw-template',
    'const value = String.raw`${String.raw`' + String.raw`\tau` + '`}`;',
    [],
  );
  expectFindings(
    'comments-and-regex',
    String.raw`// '\cosh' "\le"
/* ` + String.raw`\tau` + String.raw` */
const matcher = /\times|\cosh/;`,
    [],
  );
  expectFindings('intentional-js-escapes', String.raw`const lines = 'a\n' + "b\t";`, []);
  expectFindings('hex-and-unicode-escapes', String.raw`const value = '\x41\u0042\u{43}';`, []);
}

async function auditResearchData() {
  const entries = (await readdir(DATA_DIRECTORY, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map((entry) => entry.name)
    .sort();
  const findings = [];

  for (const name of entries) {
    const absolutePath = path.join(DATA_DIRECTORY, name);
    const source = await readFile(absolutePath, 'utf8');
    const displayPath = path.posix.join('src/data/rh-research', name);
    findings.push(...findUnsafeResearchStringEscapes(source, displayPath));
  }

  if (findings.length > 0) {
    const details = findings.map(({ file, line, column, escape, quote }) =>
      `- ${file}:${line}:${column} unsafe ${quote} source escape ${JSON.stringify(escape)}`,
    );
    throw new Error(
      `RH research data contains TeX-like source escapes that JavaScript can silently corrupt. ` +
      `Use String.raw tagged templates or double the backslash.\n${details.join('\n')}`,
    );
  }

  console.log(`RH research source-literal escape gate: PASS (${entries.length} files; fault injections passed)`);
}

runSelfTests();
await auditResearchData();
