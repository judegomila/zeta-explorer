#!/usr/bin/env node
// scripts/mine-papers.mjs — imp-2482
//
// Repeatable mining hook: scans public/papers/ for PDF/TeX/MD files,
// extracts falsifiable lemmas, bounds, and numerical claims, seeds
// draft improvement-queue tickets, and writes a markdown crosswalk.
//
// Usage:
//   node scripts/mine-papers.mjs [--dry-run] [--crosswalk PATH]
//
// Outputs:
//   - New tickets via seed-ticket.mjs (skipped with --dry-run)
//   - Markdown crosswalk at public/papers/CROSSWALK.md (default)
//   - Regenerated scripts/queue-index.json after all seeds
//
// PDF extraction requires pdftotext (poppler-utils / Homebrew poppler).
// TeX and MD files are read directly.

import { execSync, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PAPERS_DIR = join(ROOT, 'public', 'papers');
const QUEUE_FILE = join(ROOT, 'src', 'data', 'improvement-queue.js');
const INDEX_FILE = join(ROOT, 'scripts', 'queue-index.json');
const DEFAULT_CROSSWALK = join(PAPERS_DIR, 'CROSSWALK.md');

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const cwIdx = argv.indexOf('--crosswalk');
const CROSSWALK_PATH = cwIdx !== -1 ? argv[cwIdx + 1] : DEFAULT_CROSSWALK;

// ── Helpers ───────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[mine-papers] ${msg}`);
}

function nextIdFromIndex() {
  const idx = JSON.parse(readFileSync(INDEX_FILE, 'utf8'));
  return idx.nextImprovementId;
}

function existingQueueTitles() {
  const text = readFileSync(QUEUE_FILE, 'utf8');
  const titles = new Set();
  const re = /title:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g;
  let m;
  while ((m = re.exec(text))) {
    const t = (m[1] ?? m[2] ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (t) titles.add(t);
  }
  return titles;
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

// ── Text extraction ───────────────────────────────────────────────────────────

function extractText(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    try {
      return execFileSync('pdftotext', ['-layout', filePath, '-'], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    } catch (e) {
      log(`Warning: pdftotext failed on ${basename(filePath)}: ${e.message}`);
      return '';
    }
  }
  try {
    return readFileSync(filePath, 'utf8');
  } catch (e) {
    log(`Warning: cannot read ${basename(filePath)}: ${e.message}`);
    return '';
  }
}

// ── Claim extraction ──────────────────────────────────────────────────────────
//
// Falsifiable claim heuristics:
//   1. Named math results (Lemma / Theorem / Proposition / Corollary / Claim)
//      that contain a falsifiable keyword (bound, <=, >=, O(, constant, norm,
//      estimate, error, <=, >=).
//   2. Explicit numerical inequalities with a constant on one side.

const RESULT_KINDS = ['Lemma', 'Theorem', 'Proposition', 'Corollary', 'Claim', 'Conjecture'];

const BOUND_KEYWORDS = [
  '\\u2264', '\\u2265', '<=', '>=', '\\u2264', '\\u2265',
  'bound', 'norm', 'O\\(', 'estimate', 'error', 'constant',
  'converge', 'uniform', 'integr',
];
const BOUND_RE = new RegExp(BOUND_KEYWORDS.join('|'), 'i');

// Matches "Lemma 3.1" or "Theorem 2" followed by (optional period/colon) and text up to the first double newline or sentence end
const CLAIM_RE = new RegExp(
  `(${RESULT_KINDS.join('|')})\\s+(\\d+(?:\\.\\d+)*)\\s*[.:]?\\s*([^\\n]{10,200})`,
  'g'
);

// Matches explicit numerical bound statements like "||V|| <= 0.95" or "|t_c| <= 1.3"
const NUMERICAL_RE = /[|‖][^|‖\n]{2,30}[|‖]\s*[≤≥<=]{1,2}\s*\d[\d.eE+\-]*/g;

function extractClaims(text, paperName) {
  const claims = [];

  // Named results
  let m;
  CLAIM_RE.lastIndex = 0;
  while ((m = CLAIM_RE.exec(text)) !== null) {
    const kind = m[1];
    const num = m[2];
    const body = m[3].trim().replace(/\s+/g, ' ');
    if (!BOUND_RE.test(body)) continue;
    claims.push({
      paper: paperName,
      kind,
      label: `${kind} ${num}`,
      summary: body.slice(0, 120),
      type: 'named-result',
    });
  }

  // Explicit numerical bounds
  NUMERICAL_RE.lastIndex = 0;
  while ((m = NUMERICAL_RE.exec(text)) !== null) {
    const expr = m[0].trim().replace(/\s+/g, ' ');
    claims.push({
      paper: paperName,
      kind: 'NumericalBound',
      label: expr,
      summary: expr,
      type: 'numerical-bound',
    });
  }

  // Deduplicate within this paper by label
  const seen = new Set();
  return claims.filter(c => {
    const key = normalize(c.label);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Ticket seeding ────────────────────────────────────────────────────────────

function seedTicket(id, title, description, paperName) {
  const args = [
    'node', 'scripts/seed-ticket.mjs',
    '--id', id,
    '--title', title,
    '--priority', 'medium',
    '--category', 'proof',
    '--proof-section', 'S-paper-mining',
    '--description', description,
    '--rationale', `Auto-mined from ${paperName} by mine-papers.mjs (imp-2482). Verify / disprove this claim in the Lambda-attack context.`,
    '--model', 'opus-4-7',
    '--channel', 'subscription',
    '--complexity', 'medium',
  ];
  execSync(args.join(' '), { cwd: ROOT, stdio: 'inherit' });
}

// ── Main ──────────────────────────────────────────────────────────────────────

log(`Scanning ${PAPERS_DIR}`);
let paperFiles = [];
try {
  paperFiles = readdirSync(PAPERS_DIR).filter(f => {
    const ext = extname(f).toLowerCase();
    return ['.pdf', '.tex', '.md'].includes(ext);
  }).map(f => join(PAPERS_DIR, f));
} catch (e) {
  log(`Cannot read papers dir: ${e.message}`);
  process.exit(1);
}

if (paperFiles.length === 0) {
  log('No PDF/TeX/MD files found in public/papers/ — nothing to mine.');
  process.exit(0);
}

log(`Found ${paperFiles.length} paper(s): ${paperFiles.map(f => basename(f)).join(', ')}`);

const existingTitles = existingQueueTitles();
let nextId = nextIdFromIndex();

const crosswalkRows = [];
let seededCount = 0;

for (const filePath of paperFiles) {
  const paperName = basename(filePath);
  log(`Extracting text from ${paperName}...`);
  const text = extractText(filePath);
  if (!text) { log(`  Skipping (no text extracted)`); continue; }

  const claims = extractClaims(text, paperName);
  log(`  Found ${claims.length} candidate claim(s)`);

  for (const claim of claims) {
    const ticketTitle = `[paper-mine] ${paperName}: ${claim.label} — ${claim.summary.slice(0, 60)}`;
    const normTitle = normalize(ticketTitle);

    // Skip if already in queue
    let dup = false;
    for (const existing of existingTitles) {
      if (normalize(claim.label).length > 8 && existing.includes(normalize(claim.label))) {
        dup = true; break;
      }
    }
    if (dup) {
      log(`  Skipping (duplicate): ${claim.label}`);
      continue;
    }

    const ticketId = `imp-${nextId}`;
    const description = `Paper: ${paperName} | Claim: ${claim.label} | Statement: "${claim.summary}". Verify whether this claim holds in the Lambda-attack context: check the proof assumptions, test numerically if applicable, and record agreement or discrepancy.`;

    crosswalkRows.push({
      paper: paperName,
      claimLabel: claim.label,
      claimSummary: claim.summary.slice(0, 80),
      ticketId,
      roadmapNode: 'S-paper-mining',
    });

    if (DRY_RUN) {
      log(`  DRY-RUN: would seed ${ticketId}: ${ticketTitle.slice(0, 80)}`);
    } else {
      log(`  Seeding ${ticketId}: ${ticketTitle.slice(0, 80)}`);
      try {
        seedTicket(ticketId, ticketTitle, description, paperName);
        existingTitles.add(normTitle);
        nextId++;
        seededCount++;
      } catch (e) {
        log(`  Error seeding ${ticketId}: ${e.message}`);
      }
    }
  }
}

// ── Write crosswalk markdown ──────────────────────────────────────────────────

const now = new Date().toISOString();
let md = `# Paper-Mining Crosswalk\n\nGenerated: ${now}  \nScript: scripts/mine-papers.mjs (imp-2482)\n\n`;
md += `| Paper | Claim | Summary | Ticket ID | Roadmap Node |\n`;
md += `|-------|-------|---------|-----------|---------------|\n`;

for (const r of crosswalkRows) {
  const paper = r.paper.replace(/\|/g, '\\|');
  const claim = r.claimLabel.replace(/\|/g, '\\|');
  const summary = r.claimSummary.replace(/\|/g, '\\|');
  const ticket = r.ticketId;
  const node = r.roadmapNode;
  md += `| ${paper} | ${claim} | ${summary} | ${ticket} | ${node} |\n`;
}

if (crosswalkRows.length === 0) {
  md += `| (none) | — | No new falsifiable claims found | — | — |\n`;
}

md += `\n## Stats\n\n- Papers scanned: ${paperFiles.length}\n- New tickets seeded: ${DRY_RUN ? `${crosswalkRows.length} (dry-run)` : seededCount}\n`;

writeFileSync(CROSSWALK_PATH, md, 'utf8');
log(`Crosswalk written to ${CROSSWALK_PATH}`);
log(`Done. ${seededCount} ticket(s) seeded.`);
