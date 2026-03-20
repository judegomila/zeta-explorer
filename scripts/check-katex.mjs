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
  let m;

  // Pattern 1: tex="..." (JSX string attribute - backslashes are literal)
  const re1 = /tex="([^"]+)"/g;
  while ((m = re1.exec(src)) !== null) {
    // Skip if preceded by { which means it's tex={"..."} (handled by pattern 2)
    if (src[m.index + 4] === '{') continue;
    const line = src.substring(0, m.index).split('\n').length;
    results.push({ line, tex: m[1], type: 'jsx-attr' });
  }

  // Pattern 2: tex={"..."} (JS string expression - backslashes are JS-escaped)
  const re2 = /tex=\{"([^"]+)"\}/g;
  while ((m = re2.exec(src)) !== null) {
    const line = src.substring(0, m.index).split('\n').length;
    let tex;
    try {
      tex = JSON.parse('"' + m[1] + '"');
    } catch {
      tex = m[1];
    }
    results.push({ line, tex, type: 'js-expr' });
  }

  // Pattern 3: tex={`...`} (template literal)
  const re3 = /tex=\{`([^`]+)`\}/g;
  while ((m = re3.exec(src)) !== null) {
    const line = src.substring(0, m.index).split('\n').length;
    results.push({ line, tex: m[1], type: 'template' });
  }

  // Pattern 4: tex={...multiline concat with +...} - concatenated strings
  const re4 = /tex=\{(\s*(?:'[^']*'\s*\+?\s*)+)\}/gs;
  while ((m = re4.exec(src)) !== null) {
    const line = src.substring(0, m.index).split('\n').length;
    // Combine the string parts
    const parts = m[1].match(/'([^']*)'/g);
    if (parts) {
      let combined = parts.map(p => p.slice(1, -1)).join('');
      let tex;
      try {
        tex = JSON.parse('"' + combined.replace(/"/g, '\\"') + '"');
      } catch {
        tex = combined;
      }
      results.push({ line, tex, type: 'concat' });
    }
  }

  // Pattern 5: $...$ and $$...$$ inside JS string literals (for data files)
  const dollarRegex = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;
  while ((m = dollarRegex.exec(src)) !== null) {
    const tex = m[1] || m[2];
    const isDisplay = !!m[1];
    const line = src.substring(0, m.index).split('\n').length;

    // Only process if inside a string context (rough heuristic)
    const lineText = src.split('\n')[line - 1] || '';
    if (!lineText.includes("'") && !lineText.includes('"') && !lineText.includes('`')) continue;
    // Skip if it looks like it's in a comment
    const trimmed = lineText.trimStart();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

    let processed;
    try {
      processed = JSON.parse('"' + tex.replace(/"/g, '\\"') + '"');
    } catch {
      processed = tex;
    }

    results.push({ line, tex: processed, type: isDisplay ? 'dollar-display' : 'dollar-inline' });
  }

  // Pattern 6: formula: '...' in concept arrays
  const formulaRegex = /formula:\s*'([^']+)'/g;
  while ((m = formulaRegex.exec(src)) !== null) {
    const line = src.substring(0, m.index).split('\n').length;
    let tex;
    try {
      tex = JSON.parse('"' + m[1].replace(/"/g, '\\"') + '"');
    } catch {
      tex = m[1];
    }
    results.push({ line, tex, type: 'formula-prop' });
  }

  // Pattern 7: symbol: '...' and sym: '...'
  const symRegex = /(?:symbol|sym):\s*'([^']+)'/g;
  while ((m = symRegex.exec(src)) !== null) {
    const line = src.substring(0, m.index).split('\n').length;
    let tex;
    try {
      tex = JSON.parse('"' + m[1].replace(/"/g, '\\"') + '"');
    } catch {
      tex = m[1];
    }
    results.push({ line, tex, type: 'symbol-prop' });
  }

  return results;
}

const allFiles = walkDir(srcDir);
let totalErrors = 0;
const errorsByFile = {};

for (const file of allFiles) {
  const texStrings = extractTexStrings(file);
  for (const { line, tex, type } of texStrings) {
    // Try both display modes
    let hasError = false;
    let errorMsg = '';

    const displayMode = type === 'dollar-display' || type === 'formula-prop' ||
                        type.includes('block') || tex.includes('\\begin{');
    try {
      katex.renderToString(tex, { throwOnError: true, displayMode });
    } catch (e) {
      // Try the other mode
      try {
        katex.renderToString(tex, { throwOnError: true, displayMode: !displayMode });
      } catch (e2) {
        hasError = true;
        errorMsg = e2.message;
      }
    }

    if (hasError) {
      const rel = path.relative(path.join(__dirname, '..'), file);
      if (!errorsByFile[rel]) errorsByFile[rel] = [];
      // Deduplicate
      const existing = errorsByFile[rel].find(e => e.tex === tex.substring(0, 100));
      if (!existing) {
        errorsByFile[rel].push({
          line,
          type,
          error: errorMsg.substring(0, 120),
          tex: tex.substring(0, 100),
        });
        totalErrors++;
      }
    }
  }
}

for (const [file, errors] of Object.entries(errorsByFile).sort()) {
  console.log(`\n=== ${file} (${errors.length} errors) ===`);
  for (const e of errors) {
    console.log(`  L${e.line} [${e.type}]: ${e.error}`);
    console.log(`    tex: ${e.tex}`);
  }
}

console.log(`\nTotal KaTeX errors: ${totalErrors}`);
