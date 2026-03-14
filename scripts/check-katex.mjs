import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import katex from 'katex';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src');

function walkDir(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) files.push(full);
  }
  return files;
}

function extractTexStrings(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const results = [];

  // Pattern 1: tex="..." (JSX string attribute - backslashes are literal)
  const re1 = /tex="([^"]+)"/g;
  let m;
  while ((m = re1.exec(src)) !== null) {
    const line = src.substring(0, m.index).split('\n').length;
    results.push({ line, tex: m[1], type: 'jsx-attr' });
  }

  // Pattern 2: tex={"..."} (JS string expression - backslashes are JS-escaped)
  const re2 = /tex=\{"([^"]+)"\}/g;
  while ((m = re2.exec(src)) !== null) {
    const line = src.substring(0, m.index).split('\n').length;
    // Evaluate the JS string to get actual content
    let tex;
    try {
      tex = JSON.parse('"' + m[1] + '"');
    } catch {
      tex = m[1]; // fallback
    }
    results.push({ line, tex, type: 'js-expr' });
  }

  // Pattern 3: tex={`...`} (template literal)
  const re3 = /tex=\{`([^`]+)`\}/g;
  while ((m = re3.exec(src)) !== null) {
    const line = src.substring(0, m.index).split('\n').length;
    results.push({ line, tex: m[1], type: 'template' });
  }

  return results;
}

const allFiles = walkDir(srcDir);
let totalErrors = 0;
const errorsByFile = {};

for (const file of allFiles) {
  const texStrings = extractTexStrings(file);
  for (const { line, tex, type } of texStrings) {
    try {
      katex.renderToString(tex, { throwOnError: true, displayMode: false });
    } catch (e) {
      try {
        katex.renderToString(tex, { throwOnError: true, displayMode: true });
      } catch (e2) {
        const rel = path.relative(path.join(__dirname, '..'), file);
        if (!errorsByFile[rel]) errorsByFile[rel] = [];
        errorsByFile[rel].push({
          line,
          type,
          error: e2.message.substring(0, 80),
          tex: tex.substring(0, 80),
        });
        totalErrors++;
      }
    }
  }
}

for (const [file, errors] of Object.entries(errorsByFile)) {
  console.log(`\n=== ${file} (${errors.length} errors) ===`);
  for (const e of errors) {
    console.log(`  L${e.line} [${e.type}]: ${e.error}`);
    console.log(`    tex: ${e.tex}`);
  }
}

console.log(`\nTotal KaTeX errors: ${totalErrors}`);
