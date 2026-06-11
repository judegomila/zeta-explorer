#!/usr/bin/env node
// Decision-doc template generator (imp-1283).
//
// Problem: after a significant subagent completion the orchestrator hand-writes
// thinking/decisions/YYYY-MM-DD-<topic>.md from scratch every time (cf. imp-1246,
// imp-1258, the imp-2369 false-positive cluster). The frontmatter shape and the
// Question/Alternatives/Verdict/Evidence/Honest-scope/Follow-ups section skeleton
// are identical run to run; only the prose differs. That boilerplate is ~10-15
// min of mechanical typing.
//
// Fix: this script reads a ticket from the queue, prefills the frontmatter
// (date / ticket / kind / model / artifact paths) and the ticket's closureNote
// as seed Evidence, emits the canonical skeleton, and opens it in $EDITOR. Target
// doc-writing time drops to 3-5 min (fill prose, delete the seeded scaffolding).
//
// Usage:
//   node scripts/decision-doc.mjs --ticket imp-1258
//   node scripts/decision-doc.mjs --ticket imp-1258 --no-open   # write, do not launch $EDITOR
//   node scripts/decision-doc.mjs --ticket imp-1258 --stdout     # print to stdout, write nothing
//
// Output: thinking/decisions/YYYY-MM-DD-imp-NNNN-<title-slug>.md (will not
// clobber an existing file — appends a -2, -3, ... suffix instead).

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DECISIONS_DIR = path.join(PROJECT_ROOT, 'thinking/decisions');
const QUEUE_FILE = path.join(PROJECT_ROOT, 'src/data/improvement-queue.js');

function die(msg) {
  console.error(`decision-doc: ${msg}`);
  process.exit(1);
}

// ── Parse CLI args ─────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = { ticket: null, open: true, stdout: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--ticket' || a === '-t') out.ticket = argv[++i];
    else if (a.startsWith('--ticket=')) out.ticket = a.slice('--ticket='.length);
    else if (a === '--no-open') out.open = false;
    else if (a === '--stdout') { out.stdout = true; out.open = false; }
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
    else die(`unknown argument "${a}" (try --help)`);
  }
  return out;
}

function printHelp() {
  console.log([
    'Usage: node scripts/decision-doc.mjs --ticket imp-NNNN [--no-open] [--stdout]',
    '',
    '  --ticket, -t   ticket id to seed the doc from (required)',
    '  --no-open      write the file but do not launch $EDITOR',
    '  --stdout       print the skeleton to stdout and write nothing',
    '  --help, -h     show this help',
  ].join('\n'));
}

// ── Pull a single ticket from the queue ────────────────────────────────────
// Balanced-brace walker so we never have to import the heavy ESM module. Finds
// the object literal whose `id:` matches and shallow-parses the string/scalar
// fields we need (no nested-object support required for these keys).
function findTicket(id) {
  if (!fs.existsSync(QUEUE_FILE)) die(`queue file missing at ${QUEUE_FILE}`);
  const src = fs.readFileSync(QUEUE_FILE, 'utf8');
  const marker = `id: '${id}'`;
  const at = src.indexOf(marker);
  if (at === -1) die(`ticket "${id}" not found in improvement-queue.js`);

  // Walk backward to the opening brace of this object literal.
  let start = src.lastIndexOf('{', at);
  // Walk forward with brace-depth tracking (skipping string contents) to the
  // matching close brace.
  let depth = 0, end = -1, inStr = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') inStr = c;
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) die(`could not find object bounds for ticket "${id}"`);
  return src.slice(start, end + 1);
}

// Extract a single-quoted, double-quoted, or backtick string field value.
function field(block, key) {
  const re = new RegExp(`${key}:\\s*(['"\`])([\\s\\S]*?)\\1`);
  const m = block.match(re);
  if (!m) return null;
  // Unescape the quote that delimited the literal plus common escapes.
  return m[2].replace(new RegExp(`\\\\${m[1]}`, 'g'), m[1]).replace(/\\n/g, '\n');
}

// ── Helpers ────────────────────────────────────────────────────────────────
function slugify(s) {
  return (s || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 48)
    .replace(/-+$/g, '');
}

// Map ticket category to a decision-doc "kind" tag.
function kindFor(category) {
  switch ((category || '').toLowerCase()) {
    case 'proof':
    case 'proof-gap': return 'proof-audit';
    case 'meta': return 'meta-decision';
    case 'feature': return 'design-decision';
    case 'content': return 'content-decision';
    default: return 'decision';
  }
}

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

// ── Build the skeleton ─────────────────────────────────────────────────────
function buildDoc(id, block, relArtifactPath) {
  const title = field(block, 'title') || id;
  const category = field(block, 'category') || '';
  const model = field(block, 'completedByModel') || field(block, 'model') || 'claude-opus-4-8';
  const closureNote = field(block, 'closureNote');
  const description = field(block, 'description');
  const date = isoDate();
  const kind = kindFor(category);

  const frontmatter = [
    '---',
    `date: ${date}`,
    `ticket: ${id}`,
    `kind: ${kind}`,
    `model: ${model}`,
    'artifact:',
    `  - ${relArtifactPath}`,
    'status_delta: TODO one-line status change this doc records (what flipped, what closed).',
    '---',
  ].join('\n');

  const seedEvidence = closureNote
    ? `<!-- Seeded from ${id} closureNote — trim to the load-bearing facts: -->\n${closureNote}`
    : description
      ? `<!-- No closureNote on ${id} yet; seeded from its description — replace with actual evidence: -->\n${description}`
      : `TODO the reasoning trail: numbers, file paths, assertion names, what was measured.`;

  return [
    frontmatter,
    '',
    `# Decision: ${title}`,
    '',
    '## Question',
    '',
    `TODO what concrete question did ${id} force? State it so a future reader who never saw the ticket understands the stakes.`,
    '',
    '## Alternatives',
    '',
    '- **Option A** — TODO. Cost / risk.',
    '- **Option B** — TODO. Cost / risk.',
    '- **(chosen)** — TODO why this one won.',
    '',
    '## Verdict',
    '',
    'TODO the decision in one or two bold sentences. Be unambiguous about what is now true vs still open.',
    '',
    '## Evidence',
    '',
    seedEvidence,
    '',
    '## Honest scope',
    '',
    'TODO what this does NOT prove / does NOT change. Name the still-open tickets and the conditional assumptions.',
    '',
    '## Follow-ups',
    '',
    '- TODO any new tickets to seed, or `none`.',
    '',
  ].join('\n');
}

// ── Main ───────────────────────────────────────────────────────────────────
const args = parseArgs(process.argv.slice(2));
if (!args.ticket) die('missing required --ticket imp-NNNN (try --help)');
const id = args.ticket.startsWith('imp-') ? args.ticket : `imp-${args.ticket}`;

const block = findTicket(id);
const title = field(block, 'title') || id;
const fileName = `${isoDate()}-${id}-${slugify(title)}.md`;
const relArtifactPath = path.posix.join('thinking/decisions', fileName);
const doc = buildDoc(id, block, relArtifactPath);

if (args.stdout) {
  process.stdout.write(doc);
  process.exit(0);
}

if (!fs.existsSync(DECISIONS_DIR)) fs.mkdirSync(DECISIONS_DIR, { recursive: true });

// Never clobber an existing doc — suffix -2, -3, ... if needed.
let outPath = path.join(DECISIONS_DIR, fileName);
if (fs.existsSync(outPath)) {
  const base = fileName.replace(/\.md$/, '');
  let n = 2;
  while (fs.existsSync(path.join(DECISIONS_DIR, `${base}-${n}.md`))) n++;
  outPath = path.join(DECISIONS_DIR, `${base}-${n}.md`);
}
fs.writeFileSync(outPath, doc, 'utf8');
console.log(`decision-doc: wrote ${path.relative(PROJECT_ROOT, outPath)}`);

if (args.open) {
  const editor = process.env.EDITOR || process.env.VISUAL;
  if (!editor) {
    console.log('decision-doc: $EDITOR not set — skipping launch. Open the file above to fill it in.');
  } else {
    const child = spawn(editor, [outPath], { stdio: 'inherit' });
    child.on('error', (e) => console.error(`decision-doc: failed to launch $EDITOR (${editor}): ${e.message}`));
  }
}
