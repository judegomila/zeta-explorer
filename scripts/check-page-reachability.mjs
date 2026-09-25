#!/usr/bin/env node
// scripts/check-page-reachability.mjs
// imp-96798: build-time reachability check for src/data finding modules (imp-NNNNN-*.js).
// Flags modules that no page, App.jsx route, run-assertions.mjs DATA_MODULES entry, or
// visualizations-index.js entry actually IMPORTS -- as opposed to merely mentioning in a
// prose/@see/comment/glossary-id string, which does not make a module reachable.
//
// METHOD. Static import-graph reachability, not a re-derivation of any module's claims:
//   1. Parse every .js/.jsx file under src/ (comments stripped) for real `import ... from`,
//      `import(...)`, and `require(...)` specifiers; resolve relative specifiers to files.
//   2. BFS from src/App.jsx over that graph -> "page-reachable" set.
//   3. Parse scripts/run-assertions.mjs's DATA_MODULES array for its quoted path strings
//      (a separate reachability channel: registered-but-not-page-wired modules still run).
//   4. Parse src/data/visualizations-index.js's `dataModule:` string fields (glossary/
//      viz-index reachability channel).
// A finding module (src/data/imp-NNNNN-*.js) is ORPHANED iff it is in none of the three sets.
//
// Usage:
//   node scripts/check-page-reachability.mjs               # diagnostic reporter, exit 0
//   node scripts/check-page-reachability.mjs --gate        # exit 1 on new orphans since baseline
//   node scripts/check-page-reachability.mjs --save-baseline

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(REPO_ROOT, 'src');
const DATA_DIR = path.join(SRC_DIR, 'data');
const BASELINE_FILE = path.resolve(__dirname, 'page-reachability-baseline.json');

const args = process.argv.slice(2);
const gateMode = args.includes('--gate');
const saveBaselineMode = args.includes('--save-baseline');

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (/\.(js|jsx|mjs)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function extractSpecifiers(src) {
  const specs = [];
  const re = /(?:from\s+|import\s*\(\s*|require\(\s*)['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) specs.push(m[1]);
  return specs;
}

function resolveSpecifier(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null; // skip bare package imports
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    base,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.mjs`,
    path.join(base, 'index.js'),
    path.join(base, 'index.jsx'),
  ];
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) || null;
}

const allFiles = walk(SRC_DIR, []);
const fileContents = new Map();
const fileImports = new Map();

for (const file of allFiles) {
  const raw = fs.readFileSync(file, 'utf8');
  fileContents.set(file, raw);
  const stripped = stripComments(raw);
  const resolved = extractSpecifiers(stripped)
    .map((spec) => resolveSpecifier(file, spec))
    .filter(Boolean);
  fileImports.set(file, resolved);
}

// Page-reachable set: BFS from src/App.jsx over the import graph.
const APP_ENTRY = path.join(SRC_DIR, 'App.jsx');
const pageReachable = new Set();
if (fs.existsSync(APP_ENTRY)) {
  const queue = [APP_ENTRY];
  pageReachable.add(APP_ENTRY);
  while (queue.length > 0) {
    const cur = queue.shift();
    for (const next of fileImports.get(cur) || []) {
      if (!pageReachable.has(next)) {
        pageReachable.add(next);
        queue.push(next);
      }
    }
  }
}

// DATA_MODULES registration set: quoted '/src/data/...js' string entries in run-assertions.mjs.
const RUN_ASSERTIONS = path.join(REPO_ROOT, 'scripts', 'run-assertions.mjs');
const assertionReachable = new Set();
if (fs.existsSync(RUN_ASSERTIONS)) {
  const raSrc = stripComments(fs.readFileSync(RUN_ASSERTIONS, 'utf8'));
  const re = /['"]\/src\/data\/([^'"]+\.js)['"]/g;
  let m;
  while ((m = re.exec(raSrc)) !== null) {
    assertionReachable.add(path.join(DATA_DIR, m[1]));
  }
}

// visualizations-index.js dataModule string entries.
const VIZ_INDEX = path.join(DATA_DIR, 'visualizations-index.js');
const vizReachable = new Set();
if (fs.existsSync(VIZ_INDEX)) {
  const viSrc = stripComments(fs.readFileSync(VIZ_INDEX, 'utf8'));
  const re = /dataModule:\s*['"]src\/data\/([^'"]+\.js)['"]/g;
  let m;
  while ((m = re.exec(viSrc)) !== null) {
    vizReachable.add(path.join(DATA_DIR, m[1]));
  }
}

// Scope: finding modules only (imp-NNNNN-*.js), matching the ticket's naming convention.
const findingModules = fs.readdirSync(DATA_DIR)
  .filter((f) => /^imp-\d+-.*\.js$/.test(f))
  .sort();

const orphaned = [];
const reachableReport = [];
for (const file of findingModules) {
  const full = path.join(DATA_DIR, file);
  const onPage = pageReachable.has(full);
  const inAssertions = assertionReachable.has(full);
  const inVizIndex = vizReachable.has(full);
  if (onPage || inAssertions || inVizIndex) {
    reachableReport.push(file);
  } else {
    orphaned.push(file);
  }
}

const pct = (n, d) => (d === 0 ? '0.0' : ((n / d) * 100).toFixed(1));

console.log('# Page-Reachability Report — src/data/imp-NNNNN-*.js finding modules\n');
console.log(`Total finding modules: ${findingModules.length}`);
console.log(`Reachable            : ${reachableReport.length} (${pct(reachableReport.length, findingModules.length)}%)`);
console.log(`Orphaned              : ${orphaned.length} (${pct(orphaned.length, findingModules.length)}%)\n`);

if (orphaned.length === 0) {
  console.log('No orphaned finding modules found.');
} else {
  console.log('## Orphaned modules (no real import from any page, App.jsx route, DATA_MODULES, or visualizations-index.js):\n');
  for (const file of orphaned) {
    console.log(`  - ${file}`);
  }
}

if (saveBaselineMode) {
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(orphaned, null, 2) + '\n');
  console.log(`\nBaseline saved: ${orphaned.length} module(s) -> ${BASELINE_FILE}`);
  process.exit(0);
}

if (gateMode) {
  let baseline = [];
  if (fs.existsSync(BASELINE_FILE)) {
    baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
  } else {
    fs.writeFileSync(BASELINE_FILE, JSON.stringify(orphaned, null, 2) + '\n');
    console.log(`\n[gate] No baseline found — initialized with ${orphaned.length} module(s). Re-run to enforce.`);
    process.exit(0);
  }

  const baselineSet = new Set(baseline);
  const newOrphans = orphaned.filter((f) => !baselineSet.has(f));

  if (newOrphans.length === 0) {
    console.log('\n[gate] PASS — no new orphaned finding modules since baseline.');
    process.exit(0);
  } else {
    console.error(`\n[gate] FAIL — ${newOrphans.length} new orphaned finding module(s) not in baseline:`);
    for (const f of newOrphans) {
      console.error(`  + ${f}`);
    }
    console.error('\nWire the module into a page, DATA_MODULES, or visualizations-index.js, or run --save-baseline to grandfather it.');
    process.exit(1);
  }
}
