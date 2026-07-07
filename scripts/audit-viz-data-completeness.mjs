#!/usr/bin/env node
// scripts/audit-viz-data-completeness.mjs
// imp-35046: automated audit-coverage-completeness check for the
// caveat-surfacing / discoverability audit lineage (imp-35007/35020/35032
// and the orphaned-assertion-wiring lineage imp-34896/34920/34945/34967).
//
// Those audits enumerate viz-data modules BY HAND from a page-id range
// (e.g. "34947..34951"), which is error-prone -- imp-35032 found imp-34948
// fell through two manual audits this way. This script instead globs every
// src/data/*-viz-data.js module and checks, programmatically:
//
//   1. honest-status banner  -- does the module carry the "NO QED" marker
//      (the one marker common to the shared caveat block used across the
//      cohort: isRigorous:false / C_mb GUE-conditional / NO QED / SOTA)?
//   2. assertion wiring      -- if the module exports a self-executing
//      *_ASSERTIONS array, is it listed in scripts/run-assertions.mjs'
//      MATH_MODULES sweep so it actually runs in CI?
//   3. index discoverability -- resolve the module's companion page (the
//      src/pages/*.jsx file that imports it), then that page's route from
//      App.jsx, then check whether that route is registered in
//      src/data/visualizations-index.js. NOTE: the page/route id is a
//      SEPARATE numbering sequence from the data-module id in this cohort
//      (e.g. imp-34952-....js backs the imp-34978 viz page), so this check
//      resolves the actual import chain rather than string-matching ids.
//      (informational only -- the authoritative exempt/backlog list lives
//      in scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX; a "not indexed"
//      module here may simply be on that documented backlog.)
//
// Usage: node scripts/audit-viz-data-completeness.mjs
// Exit codes:
//   0 -- every viz-data module has the banner and, if it has assertions,
//        is wired into the MATH_MODULES sweep
//   1 -- one or more modules are missing the banner or the wiring

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

const DATA_DIR = path.join(ROOT, 'src/data');
const vizDataFiles = fs
  .readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('-viz-data.js'))
  .sort();

const runAssertionsSrc = readFile('scripts/run-assertions.mjs');
const vizIndexSrc = readFile('src/data/visualizations-index.js');
const appSrc = readFile('src/App.jsx');

const PAGES_DIR = path.join(ROOT, 'src/pages');
const pageFiles = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.jsx'));

// Map page component name -> route path, from `<Route path="..." element={<Comp />}` pairs in App.jsx.
const routeByComponent = new Map();
const routeRe = /<Route\s+path="([^"]+)"\s+element=\{<(\w+)\b/g;
let rm;
while ((rm = routeRe.exec(appSrc)) !== null) {
  routeByComponent.set(rm[2], rm[1]);
}

const BANNER_MARKER = 'NO QED';
const ASSERTIONS_RE = /\b[A-Z0-9_]*_ASSERTIONS\b\s*=/;

const missingBanner = [];
const unwiredAssertions = [];
const notIndexed = [];
const noCompanionPage = [];

for (const file of vizDataFiles) {
  const rel = `src/data/${file}`;
  const src = readFile(rel);
  const stem = file.replace(/\.js$/, '');

  if (!src.includes(BANNER_MARKER)) {
    missingBanner.push(file);
  }

  if (ASSERTIONS_RE.test(src) && !runAssertionsSrc.includes(`/src/data/${file}'`)) {
    unwiredAssertions.push(file);
  }

  // Resolve the companion page(s) that import this data module.
  const companionPages = pageFiles.filter((p) => readFile(`src/pages/${p}`).includes(stem));
  if (companionPages.length === 0) {
    noCompanionPage.push(file);
    continue;
  }
  const anyIndexed = companionPages.some((p) => {
    const component = p.replace(/\.jsx$/, '');
    const route = routeByComponent.get(component);
    return route && vizIndexSrc.includes(`'${route}'`);
  });
  if (!anyIndexed) {
    notIndexed.push(file);
  }
}

console.log(`\nViz-data completeness audit -- ${vizDataFiles.length} modules scanned\n`);

console.log(`Missing "${BANNER_MARKER}" honest-status banner: ${missingBanner.length}`);
for (const f of missingBanner) console.log(`  !!  ${f}`);

console.log(`\nSelf-executing assertions not wired into run-assertions.mjs MATH_MODULES: ${unwiredAssertions.length}`);
for (const f of unwiredAssertions) console.log(`  !!  ${f}`);

console.log(`\nCompanion page route not registered in visualizations-index.js (informational -- check scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX before treating as an orphan): ${notIndexed.length}`);
for (const f of notIndexed) console.log(`  ??  ${f}`);

console.log(`\nNo companion page found importing this module (informational -- may be a supporting/derivation module with no dedicated viz page): ${noCompanionPage.length}`);
for (const f of noCompanionPage) console.log(`  ??  ${f}`);

console.log('');

const exitCode = missingBanner.length > 0 || unwiredAssertions.length > 0 ? 1 : 0;
if (exitCode === 0) {
  console.log('All viz-data modules carry the honest-status banner and, where applicable, are wired into the assertion sweep.\n');
}

process.exit(exitCode);
