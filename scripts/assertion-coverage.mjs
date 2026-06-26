#!/usr/bin/env node
// scripts/assertion-coverage.mjs
// imp-2755: Coverage report — list every src/data module with ZERO assertions.
// imp-2883: --gate mode fails on NEW zero-assertion modules (not in baseline).
// Usage:
//   node scripts/assertion-coverage.mjs               # diagnostic reporter, exit 0
//   node scripts/assertion-coverage.mjs --gate        # exit 1 if new zero-assertion modules appear
//   node scripts/assertion-coverage.mjs --save-baseline  # write current zero-assertion set as baseline

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR    = path.resolve(__dirname, '../src/data');
const BASELINE_FILE = path.resolve(__dirname, 'assertion-coverage-baseline.json');

const args = process.argv.slice(2);
const gateMode         = args.includes('--gate');
const saveBaselineMode = args.includes('--save-baseline');

const allFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('.js'))
  .sort();

const withAssertions    = [];
const withoutAssertions = [];

for (const file of allFiles) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  // A module has assertions if it exports any identifier ending in _ASSERTIONS.
  if (/_ASSERTIONS\s*=/.test(src)) {
    withAssertions.push(file);
  } else {
    withoutAssertions.push(file);
  }
}

const pct = (n) => ((n / allFiles.length) * 100).toFixed(1);

console.log('# Assertion Coverage Report — src/data/\n');
console.log(`Total modules  : ${allFiles.length}`);
console.log(`With assertions: ${withAssertions.length} (${pct(withAssertions.length)}%)`);
console.log(`Zero assertions: ${withoutAssertions.length} (${pct(withoutAssertions.length)}%)\n`);

if (withoutAssertions.length === 0) {
  console.log('All modules have at least one assertion. Full coverage!');
} else {
  console.log('## Modules with ZERO assertions:\n');
  for (const file of withoutAssertions) {
    console.log(`  - ${file}`);
  }
}

// --save-baseline: record current zero-assertion set as the allowed baseline
if (saveBaselineMode) {
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(withoutAssertions, null, 2) + '\n');
  console.log(`\nBaseline saved: ${withoutAssertions.length} module(s) → ${BASELINE_FILE}`);
  process.exit(0);
}

// --gate: fail if any module not in the baseline has zero assertions
if (gateMode) {
  let baseline = [];
  if (fs.existsSync(BASELINE_FILE)) {
    baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
  } else {
    // First run with no baseline: bootstrap it and exit 0
    fs.writeFileSync(BASELINE_FILE, JSON.stringify(withoutAssertions, null, 2) + '\n');
    console.log(`\n[gate] No baseline found — initialized with ${withoutAssertions.length} module(s). Re-run to enforce.`);
    process.exit(0);
  }

  const baselineSet = new Set(baseline);
  const newViolations = withoutAssertions.filter(f => !baselineSet.has(f));

  if (newViolations.length === 0) {
    console.log('\n[gate] PASS — no new zero-assertion modules since baseline.');
    process.exit(0);
  } else {
    console.error(`\n[gate] FAIL — ${newViolations.length} new zero-assertion module(s) not in baseline:`);
    for (const f of newViolations) {
      console.error(`  + ${f}`);
    }
    console.error('\nAdd assertions or run --save-baseline to grandfather them.');
    process.exit(1);
  }
}
