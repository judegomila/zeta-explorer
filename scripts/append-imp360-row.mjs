#!/usr/bin/env node
/**
 * scripts/append-imp360-row.mjs
 *
 * Appends one JSON row to the imp-360 extended ladder sidecar file.
 * Usage:  node scripts/append-imp360-row.mjs <row-json-file>
 *   or:   cat row.json | node scripts/append-imp360-row.mjs --stdin
 */
import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT     = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SIDECAR  = path.join(ROOT, 'src/data/imp-360-extended-ladder-N1e6-rows.json');

async function readInput() {
  const args = process.argv.slice(2);
  if (args.includes('--stdin')) {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8').trim();
  }
  const file = args[0];
  if (!file) { process.stderr.write('Usage: append-imp360-row.mjs <file> | --stdin\n'); process.exit(1); }
  return fs.readFileSync(file, 'utf8').trim();
}

const raw  = await readInput();
const row  = JSON.parse(raw);

const existing = JSON.parse(fs.readFileSync(SIDECAR, 'utf8'));
// Remove any existing row with the same N (idempotent)
const filtered = existing.filter((r) => r.N !== row.N);
filtered.push(row);
filtered.sort((a, b) => a.N - b.N);

fs.writeFileSync(SIDECAR, JSON.stringify(filtered, null, 2) + '\n');
process.stderr.write(
  `appended N=${row.N} row to ${path.relative(ROOT, SIDECAR)} ` +
  `(total ${filtered.length} rows)\n`,
);
