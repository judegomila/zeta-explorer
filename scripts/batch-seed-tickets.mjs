#!/usr/bin/env node
// Batch-seed many tickets in ONE atomic write (vs 100+ racy seed-ticket calls).
// Usage: node scripts/batch-seed-tickets.mjs --json <path> [--model opus-4-8] [--dry-run]
// JSON shape: { tickets: [ { title, description, rationale, category, priority, area } ] }
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeForLedger } from './lib/public-sanitize.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.join(__dirname, '..', 'src', 'data', 'improvement-queue.js');

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}
const jsonPath = arg('json');
const defaultModel = arg('model', 'opus-4-8');
const dryRun = arg('dry-run', false) === true;
if (!jsonPath) { console.error('need --json <path>'); process.exit(1); }

const CATS = new Set(['proof', 'content', 'ux', 'meta', 'numerical', 'accuracy', 'performance', 'bug']);
const PRIS = new Set(['critical', 'high', 'medium', 'low']);

const sq = (s) => String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/[\r\n]+/g, ' ').trim();
const dq = (s) => String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]+/g, ' ').trim();

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const raw = (data.tickets || data || []).filter(Boolean);

let queueText = fs.readFileSync(QUEUE_FILE, 'utf8');
const snapMtime = fs.statSync(QUEUE_FILE).mtimeMs;

// next id = max existing + 1
let maxId = 0;
for (const m of queueText.matchAll(/id:\s*'imp-(\d+)'/g)) maxId = Math.max(maxId, +m[1]);
let nextId = maxId + 1;

// de-dup against existing titles (cheap normalized compare)
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const existingTitles = new Set([...queueText.matchAll(/title:\s*'([^']*)'/g)].map((m) => norm(m[1])));

const entries = [];
const seededTitles = new Set();
let skipped = 0;
for (const t of raw) {
  const cat = CATS.has(t.category) ? t.category : 'content';
  const pri = PRIS.has(t.priority) ? t.priority : 'medium';
  const nt = norm(t.title);
  if (!nt || existingTitles.has(nt) || seededTitles.has(nt)) { skipped++; continue; }
  seededTitles.add(nt);
  const id = 'imp-' + nextId++;
  const rationale = sq((t.rationale || '') + (t.area ? ` (area: ${t.area})` : ''));
  let e = '  {\n';
  e += `    id: '${id}',\n`;
  e += `    title: '${sq(t.title)}',\n`;
  e += `    category: '${cat}',\n`;
  e += `    priority: '${pri}',\n`;
  e += `    status: 'pending',\n`;
  e += `    proofSection: 'S7',\n`;
  e += `    description: "${dq(t.description)}",\n`;
  e += `    rationale: '${rationale}',\n`;
  e += `    model: '${sq(defaultModel)}',\n`;
  e += '  },';
  // Public repository: shared sanitiser on every entry; an entry that is still
  // unpublishable after the rewrite is skipped, not written.
  try { entries.push(sanitizeForLedger(e)); } catch (err) { skipped++; console.warn(`skipped ${id}: ${err.message}`); }
}

console.log(`prepared ${entries.length} tickets (skipped ${skipped} dup/empty); ids imp-${maxId + 1}..imp-${nextId - 1}`);
if (!entries.length) process.exit(0);
if (dryRun) { console.log(entries.slice(0, 2).join('\n')); console.log('--- DRY RUN, no write ---'); process.exit(0); }

// Insert at the IMPROVEMENT_QUEUE array close, NOT the file's last `\n];` (other
// exported arrays follow it; the last-`];` insert misfiles tickets into the wrong
// array where the claim CLI can't see them -> fleet starves).
const SUFFIX = '\n];';
const iqStart = queueText.indexOf('export const IMPROVEMENT_QUEUE');
const insertIdx = iqStart === -1 ? -1 : queueText.indexOf(SUFFIX, iqStart);
if (insertIdx === -1) { console.error('cannot find IMPROVEMENT_QUEUE array close'); process.exit(1); }
const updated = queueText.slice(0, insertIdx) + '\n' + entries.join('\n') + queueText.slice(insertIdx);

const reMtime = fs.statSync(QUEUE_FILE).mtimeMs;
if (reMtime !== snapMtime) { console.error(`queue modified concurrently (${snapMtime}->${reMtime}); aborting`); process.exit(2); }
const tmp = QUEUE_FILE + '.batch-tmp-' + process.pid;
fs.writeFileSync(tmp, updated, 'utf8');
fs.renameSync(tmp, QUEUE_FILE);
console.log(`Inserted ${entries.length} tickets into improvement-queue.js`);
