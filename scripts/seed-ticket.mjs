#!/usr/bin/env node
// scripts/seed-ticket.mjs — imp-1275
// CLI for programmatic ticket seeding in src/data/improvement-queue.js.
//
// Usage:
//   node scripts/seed-ticket.mjs \
//     --id imp-NNNN \
//     --title "..." \
//     --priority critical|high|medium|low \
//     --category proof|content|ux|meta|numerical \
//     --proof-section S0 \
//     --description "..." \
//     --rationale "..." \
//     [--depends-on imp-XXX,imp-YYY] \
//     [--model opus-4-8|sonnet-4-6|haiku-4-5] \
//     [--channel api|subscription|sonnet|haiku] \
//     [--complexity extra-large|large|medium|small] \
//     [--dry-run]
//
// Validates: ID format (imp-NNNN), no duplicate, next-available check.
// Inserts the new ticket at the end of the queue array, preserving formatting.
// Regenerates scripts/queue-index.json on success.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const QUEUE_FILE = path.join(PROJECT_ROOT, 'src/data/improvement-queue.js');
const INDEX_FILE = path.join(PROJECT_ROOT, 'scripts/queue-index.json');

// ── Argument parsing ─────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  let i = 2;
  while (i < argv.length) {
    const key = argv[i];
    if (!key.startsWith('--')) { console.error(`Unexpected argument: ${key}`); process.exit(1); }
    const name = key.slice(2);
    if (name === 'dry-run') { args['dry-run'] = true; i++; continue; }
    const val = argv[i + 1];
    if (!val || val.startsWith('--')) { console.error(`Missing value for ${key}`); process.exit(1); }
    args[name] = val;
    i += 2;
  }
  return args;
}

const VALID_PRIORITY = ['critical', 'high', 'medium', 'low'];
const VALID_CATEGORY = ['proof', 'content', 'ux', 'meta', 'numerical', 'accuracy', 'performance', 'bug'];
const VALID_MODEL = ['opus-4-8', 'opus-4-7', 'sonnet-4-6', 'haiku-4-5'];
const VALID_CHANNEL = ['api', 'subscription', 'sonnet', 'haiku', 'local'];
const VALID_COMPLEXITY = ['extra-large', 'large', 'medium', 'small'];

function validateArgs(args) {
  const required = ['id', 'title', 'priority', 'category', 'proof-section', 'description', 'rationale'];
  for (const r of required) {
    if (!args[r]) { console.error(`Missing required flag: --${r}`); process.exit(1); }
  }
  if (!/^imp-\d+$/.test(args.id)) {
    console.error(`Invalid ID format: "${args.id}" — must be imp-NNNN`);
    process.exit(1);
  }
  if (!VALID_PRIORITY.includes(args.priority)) {
    console.error(`Invalid priority "${args.priority}" — must be one of: ${VALID_PRIORITY.join('|')}`);
    process.exit(1);
  }
  if (!VALID_CATEGORY.includes(args.category)) {
    console.error(`Invalid category "${args.category}" — must be one of: ${VALID_CATEGORY.join('|')}`);
    process.exit(1);
  }
  if (args.model && !VALID_MODEL.includes(args.model)) {
    console.error(`Invalid model "${args.model}" — must be one of: ${VALID_MODEL.join('|')}`);
    process.exit(1);
  }
  if (args.channel && !VALID_CHANNEL.includes(args.channel)) {
    console.error(`Invalid channel "${args.channel}" — must be one of: ${VALID_CHANNEL.join('|')}`);
    process.exit(1);
  }
  if (args.complexity && !VALID_COMPLEXITY.includes(args.complexity)) {
    console.error(`Invalid complexity "${args.complexity}" — must be one of: ${VALID_COMPLEXITY.join('|')}`);
    process.exit(1);
  }
}

// ── Duplicate ID detection (scan only for id: 'imp-NNN' lines) ───────────────

function findExistingIds(text) {
  const ids = new Set();
  for (const m of text.matchAll(/id:\s*'(imp-\d+)'/g)) {
    ids.add(m[1]);
  }
  return ids;
}

// ── Ticket entry builder ─────────────────────────────────────────────────────

function escapeForSingleQuote(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeForDoubleQuote(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildTicketEntry(args) {
  const dependsOn = args['depends-on']
    ? args['depends-on'].split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const depsStr = dependsOn.length > 0
    ? `[${dependsOn.map(d => `'${escapeForSingleQuote(d)}'`).join(', ')}]`
    : '[]';

  let entry = `  {\n`;
  entry += `    id: '${escapeForSingleQuote(args.id)}',\n`;
  entry += `    title: '${escapeForSingleQuote(args.title)}',\n`;
  entry += `    category: '${escapeForSingleQuote(args.category)}',\n`;
  entry += `    priority: '${escapeForSingleQuote(args.priority)}',\n`;
  entry += `    status: 'pending',\n`;
  entry += `    proofSection: '${escapeForSingleQuote(args['proof-section'])}',\n`;
  entry += `    description: "${escapeForDoubleQuote(args.description)}",\n`;
  entry += `    rationale: '${escapeForSingleQuote(args.rationale)}',\n`;
  entry += `    estimatedComplexity: '${escapeForSingleQuote(args.complexity || 'medium')}',\n`;
  entry += `    dependsOn: ${depsStr},\n`;
  if (args.model) entry += `    model: '${escapeForSingleQuote(args.model)}',\n`;
  if (args.channel) entry += `    channel: '${escapeForSingleQuote(args.channel)}',\n`;
  entry += `  },`;
  return entry;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const args = parseArgs(process.argv);
validateArgs(args);

const ticketId = args.id;
const isDryRun = args['dry-run'] === true;

// Load queue file (snapshot mtime for concurrent-write race detection)
let queueText;
let snapMtime;
try {
  snapMtime = fs.statSync(QUEUE_FILE).mtimeMs;
  queueText = fs.readFileSync(QUEUE_FILE, 'utf8');
} catch (e) {
  console.error(`Cannot read queue file: ${e.message}`);
  process.exit(1);
}

// Check for duplicate
const existingIds = findExistingIds(queueText);
if (existingIds.has(ticketId)) {
  console.error(`Duplicate ID: ${ticketId} already exists in improvement-queue.js`);
  process.exit(1);
}

// Suggest next ID from queue-index.json if provided ID seems off
let nextIdHint = null;
try {
  const idx = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  nextIdHint = idx.nextImprovementId;
} catch (_) {}

const proposedNum = parseInt(ticketId.replace('imp-', ''), 10);
if (nextIdHint !== null && proposedNum < nextIdHint - 50) {
  console.warn(`Warning: proposed ${ticketId} is much lower than expected next id imp-${nextIdHint}`);
}

// Find insertion point: the close of the IMPROVEMENT_QUEUE array specifically.
// NOT the file's LAST `\n];` — there are OTHER exported arrays after
// IMPROVEMENT_QUEUE (e.g. IMP2538_QUEUE_SUBGAP_SYNC_ASSERTIONS), and inserting
// at the last `];` silently files tickets into the wrong array, where the claim
// CLI (which reads IMPROVEMENT_QUEUE) can never see them -> the fleet starves.
const SUFFIX = '\n];';
const iqStart = queueText.indexOf('export const IMPROVEMENT_QUEUE');
const insertIdx = iqStart === -1 ? -1 : queueText.indexOf(SUFFIX, iqStart);
if (insertIdx === -1) {
  console.error('Cannot find the IMPROVEMENT_QUEUE array close in improvement-queue.js — file may be malformed');
  process.exit(1);
}

const newEntry = buildTicketEntry(args);

const updatedText =
  queueText.slice(0, insertIdx) +
  '\n' + newEntry +
  queueText.slice(insertIdx);

if (isDryRun) {
  console.log('--- DRY RUN: would insert the following ticket ---');
  console.log(newEntry);
  console.log('--- No files written ---');
  process.exit(0);
}

// Atomic write: re-check mtime then rename from tmp (same pattern as _queue-status-edit.mjs).
// If another process wrote the file between our read and now, bail rather than clobber.
const reMtime = fs.statSync(QUEUE_FILE).mtimeMs;
if (reMtime !== snapMtime) {
  console.error(`seed-ticket: queue file modified concurrently (mtime ${snapMtime} -> ${reMtime}); aborting to avoid clobber`);
  process.exit(1);
}
const tmpPath = QUEUE_FILE + '.seed-tmp-' + process.pid;
fs.writeFileSync(tmpPath, updatedText, 'utf8');
fs.renameSync(tmpPath, QUEUE_FILE);
console.log(`Inserted ${ticketId} into improvement-queue.js`);

// Regenerate queue-index.json
try {
  execSync('node scripts/build-queue-index.mjs', { cwd: PROJECT_ROOT, stdio: 'inherit' });
  console.log('Regenerated scripts/queue-index.json');
} catch (e) {
  console.warn('Warning: queue-index regeneration failed — run manually: node scripts/build-queue-index.mjs');
}

console.log(`Done. Ticket ${ticketId} seeded successfully.`);
