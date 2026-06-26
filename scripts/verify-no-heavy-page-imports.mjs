#!/usr/bin/env node
// scripts/verify-no-heavy-page-imports.mjs
// imp-2891: Tripwire — pages must NOT transitively import zeros-to-1e6.js.
//
// Statically walks the import graph starting from each src/pages/*.jsx entry
// and fails immediately if any path in the graph reaches zeros-to-1e6.js.
//
// Usage:
//   node scripts/verify-no-heavy-page-imports.mjs
//
// Exit codes:
//   0 -- no page imports zeros-to-1e6.js (directly or transitively)
//   1 -- one or more pages reach zeros-to-1e6.js

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const HEAVY_TARGET = path.join(ROOT, 'src', 'data', 'zeros-to-1e6.js');

const EXTENSIONS = ['.jsx', '.js', '.mjs', '.ts', '.tsx'];

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), specifier);
  if (path.extname(base)) {
    return fs.existsSync(base) ? base : null;
  }
  for (const ext of EXTENSIONS) {
    const candidate = base + ext;
    if (fs.existsSync(candidate)) return candidate;
  }
  for (const ext of EXTENSIONS) {
    const candidate = path.join(base, 'index' + ext);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

const IMPORT_RE = /^\s*import\s+(?:[^'"]*\s+from\s+)?['"]([^'"]+)['"]/gm;
const IMPORT_DYN_RE = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function getImports(filePath) {
  let src;
  try { src = fs.readFileSync(filePath, 'utf8'); } catch { return []; }
  const specifiers = [];
  for (const re of [IMPORT_RE, IMPORT_DYN_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src)) !== null) specifiers.push(m[1]);
  }
  return specifiers;
}

function findHeavyChain(startFile) {
  const visited = new Set();
  // DFS; returns the chain [startFile, ..., heavyTarget] or null
  function dfs(file, chain) {
    if (visited.has(file)) return null;
    visited.add(file);
    for (const spec of getImports(file)) {
      const resolved = resolveImport(file, spec);
      if (!resolved) continue;
      const newChain = [...chain, resolved];
      if (resolved === HEAVY_TARGET) return newChain;
      const result = dfs(resolved, newChain);
      if (result) return result;
    }
    return null;
  }
  return dfs(startFile, [startFile]);
}

const pageFiles = fs
  .readdirSync(PAGES_DIR)
  .filter((f) => f.endsWith('.jsx') || f.endsWith('.tsx'))
  .map((f) => path.join(PAGES_DIR, f))
  .sort();

console.log(`verify-no-heavy-page-imports: checking ${pageFiles.length} page(s) for transitive zeros-to-1e6.js imports\n`);

const violations = [];
for (const page of pageFiles) {
  const chain = findHeavyChain(page);
  if (chain) violations.push(chain);
}

if (violations.length === 0) {
  console.log('OK — no page transitively imports zeros-to-1e6.js');
  process.exit(0);
} else {
  console.error(`FAIL — ${violations.length} page(s) reach zeros-to-1e6.js:\n`);
  for (const chain of violations) {
    const rel = (f) => path.relative(ROOT, f);
    console.error('  ' + rel(chain[0]));
    for (let i = 1; i < chain.length; i++) {
      console.error('    -> ' + rel(chain[i]));
    }
    console.error('');
  }
  process.exit(1);
}
