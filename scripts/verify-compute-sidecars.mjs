#!/usr/bin/env node
// scripts/verify-compute-sidecars.mjs
// imp-2888: Build-health smoke check for compute-imp-*.mjs sidecar scripts.
//
// For each compute sidecar:
//   1. Run `node --check` to verify it still parses (syntax check only, no execution).
//   2. If the script declares a file-based output artifact (e.g. "Output: src/data/foo.json"),
//      grep src/ + scripts/ for at least one consumer of that artifact and warn if none found.
//
// Exit codes:
//   0 -- all scripts parse; consumer warnings are printed but do not fail
//   1 -- one or more scripts fail to parse

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SCRIPTS_DIR = path.join(ROOT, 'scripts');
const SRC_DIR = path.join(ROOT, 'src');

// Match Output declarations like:
//   * Output: src/data/imp-2509-rk4-large-n-rows.json
//   * Output: ./src/data/foo.json
//   const OUT_PATH = path.resolve(__dirname, '../src/data/foo.json')
//   writeFileSync('../src/data/foo.json', ...)
const OUTPUT_DECL_RE = /(?:Output:|OUT_PATH\s*=|writeFileSync\s*\()\s*['"`]?(?:\.\.\/)?(?:src\/data\/([^\s'"`,)]+))/g;

function extractOutputArtifacts(source) {
  const files = new Set();
  OUTPUT_DECL_RE.lastIndex = 0;
  let m;
  while ((m = OUTPUT_DECL_RE.exec(source)) !== null) {
    const name = m[1].trim();
    if (name) files.add(name);
  }
  return [...files];
}

function hasConsumer(artifactRelPath, computeFile) {
  // artifactRelPath is relative to ROOT, e.g. "src/data/imp-2509-rk4-large-n-rows.json"
  const basename = path.basename(artifactRelPath);
  // Search src/ only — production code is the meaningful consumer, not other scripts
  return searchDirForString(SRC_DIR, basename, computeFile);
}

function searchDirForString(dir, needle, excludeFile) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return false; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      if (searchDirForString(full, needle, excludeFile)) return true;
    } else if (entry.isFile()) {
      if (full === excludeFile) continue;
      const ext = path.extname(entry.name);
      if (!['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json', '.md'].includes(ext)) continue;
      let content;
      try { content = fs.readFileSync(full, 'utf8'); } catch { continue; }
      if (content.includes(needle)) return true;
    }
  }
  return false;
}

const computeFiles = fs
  .readdirSync(SCRIPTS_DIR)
  .filter((f) => f.startsWith('compute-') && f.endsWith('.mjs'))
  .sort()
  .map((f) => path.join(SCRIPTS_DIR, f));

console.log(`verify-compute-sidecars: checking ${computeFiles.length} sidecar script(s)\n`);

let parseErrors = 0;
let orphanWarnings = 0;

for (const file of computeFiles) {
  const rel = path.relative(ROOT, file);
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    parseErrors++;
    console.error(`PARSE ERROR: ${rel}`);
    if (result.stderr) console.error('  ' + result.stderr.trim().split('\n').join('\n  '));
    continue;
  }

  let source;
  try { source = fs.readFileSync(file, 'utf8'); } catch { continue; }
  const artifacts = extractOutputArtifacts(source);
  for (const artifact of artifacts) {
    if (!hasConsumer(artifact, file)) {
      orphanWarnings++;
      console.warn(`ORPHAN (no consumer): ${rel} -> ${artifact}`);
    }
  }
}

console.log('');
console.log(`Results: ${computeFiles.length} scripts checked`);
if (parseErrors > 0) {
  console.error(`  ${parseErrors} parse error(s) — FAIL`);
} else {
  console.log('  0 parse errors — OK');
}
if (orphanWarnings > 0) {
  console.warn(`  ${orphanWarnings} orphaned output artifact(s) — WARNING (no consumers found)`);
} else {
  console.log('  0 orphaned outputs — OK');
}

process.exit(parseErrors > 0 ? 1 : 0);
