#!/usr/bin/env node
// scripts/assertion-coverage.mjs
// imp-2755: Coverage report — list every src/data module with ZERO assertions.
// Usage: node scripts/assertion-coverage.mjs
// Exit 0 always (diagnostic reporter, not a gate).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = path.resolve(__dirname, '../src/data');

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
