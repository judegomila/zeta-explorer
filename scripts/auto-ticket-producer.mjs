#!/usr/bin/env node
// scripts/auto-ticket-producer.mjs — imp-1350
//
// Depth-watching ticket producer. Keeps the pending queue from draining so the
// engines never idle for lack of work ("don't lose pace; gain pace over time").
//
// Fully DETERMINISTIC and quota-free: it does NOT call any model. New tickets
// come from two sources:
//   1. Harvester  — scans src/data/ + src/math/ for `openSubGap` markers that
//                   are not yet represented by a pending ticket. These are real,
//                   already-identified follow-on tasks (non-boilerplate).
//   2. Template bank — a curated, goal-aligned set of evergreen research seeds
//                   used only to top up after the harvester is exhausted, so the
//                   queue never fully drains.
//
// Writes go through scripts/seed-ticket.mjs (validated atomic insert + index
// regen) and ids are claimed via scripts/claim-ticket-id.mjs (race-safe).
//
// Usage:
//   node scripts/auto-ticket-producer.mjs --once [--dry-run]
//   node scripts/auto-ticket-producer.mjs --daemon-loop [--interval 14400]
// Options:
//   --threshold N    only top up when pending < N            (default 12)
//   --target N       refill pending up to N                  (default 18)
//   --max-per-run N  cap tickets created per pass            (default 6)
//   --interval SEC   daemon sleep between passes             (default 14400 = 4h)
//   --dry-run        print what would be seeded, write nothing

import { readFileSync, readdirSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const QUEUE = join(ROOT, 'src/data/improvement-queue.js');
const INDEX = join(ROOT, 'scripts/queue-index.json');
const LOGDIR = join(ROOT, 'scripts/logs/local-lane');
const LOGFILE = join(LOGDIR, 'ticket-producer.log');

function parseArgs(argv) {
  const a = { threshold: 12, target: 18, 'max-per-run': 6, interval: 14400 };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--once') a.once = true;
    else if (k === '--daemon-loop') a.daemon = true;
    else if (k === '--dry-run') a['dry-run'] = true;
    else if (k.startsWith('--')) { a[k.slice(2)] = argv[++i]; }
  }
  for (const n of ['threshold', 'target', 'max-per-run', 'interval']) a[n] = parseInt(a[n], 10);
  return a;
}
const args = parseArgs(process.argv);

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try { mkdirSync(LOGDIR, { recursive: true }); appendFileSync(LOGFILE, line + '\n'); } catch (_) {}
}

// ── Read all existing titles + ids for dedup ─────────────────────────────────
function normalize(s) {
  return String(s).toLowerCase().replace(/\\u[0-9a-f]{4}/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
function existingState() {
  const text = readFileSync(QUEUE, 'utf8');
  const titles = new Set();
  // both 'single' and "double" quoted title: fields
  const re = /title:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g;
  let m;
  while ((m = re.exec(text))) titles.add(normalize(m[1] ?? m[2] ?? ''));
  return { titles };
}

// ── Harvest openSubGap markers not yet ticketed ──────────────────────────────
function harvestSubGaps(existing) {
  const out = [];
  const dirs = ['src/data', 'src/math'];
  for (const d of dirs) {
    let files = [];
    try { files = readdirSync(join(ROOT, d)).filter(f => f.endsWith('.js')); } catch (_) { continue; }
    for (const f of files) {
      let txt;
      try { txt = readFileSync(join(ROOT, d, f), 'utf8'); } catch (_) { continue; }
      const re = /openSubGap:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g;
      let m;
      while ((m = re.exec(txt))) {
        const label = (m[1] ?? m[2] ?? '').trim();
        if (!label) continue;
        const title = `Close named open sub-gap ${label} (in ${d}/${f})`;
        if (existing.titles.has(normalize(title))) continue;
        // also skip if the label itself already appears in some pending title
        const labelNorm = normalize(label);
        let dup = false;
        for (const t of existing.titles) { if (labelNorm.length > 6 && t.includes(labelNorm)) { dup = true; break; } }
        if (dup) continue;
        out.push({
          title,
          priority: 'high',
          category: 'proof',
          section: 'S-subgap-followup',
          description: `${d}/${f} declares an open sub-gap "${label}". Read the file's openSubGap field, implement the named work, update the file's status + closureNote, and ship a build-time assertion confirming the gap is closed.`,
          rationale: 'Harvested open sub-gap — a previously-identified, concrete follow-on task. Auto-produced to keep the queue from draining.',
        });
        existing.titles.add(normalize(title)); // avoid dupes within this run
      }
    }
  }
  return out;
}

// ── Goal-aligned evergreen template bank (top-up of last resort) ─────────────
// Each entry has a STABLE title so dedup prevents reseeding across runs.
function templateBank(existing) {
  const bank = [
    ['Lambda audit: re-derive E_trunc_pt sensitivity to T_PT under the latest verified zero-strip height', 'high', 'proof', 'S-lambda',
      'Recompute the E_trunc_pt -> Lambda chain as a function of the verified zero-free/zero-strip height T_PT, tabulating the bound at each candidate height. Surface which literature height is load-bearing.'],
    ['Super-critical zeta: extend the sigma>1/2 empirical phase survey to a finer sigma grid', 'medium', 'numerical', 'S-supercrit',
      'Extend the existing super-critical-strip phase/winding empirical survey to a finer sigma grid in (1/2, 1) and longer t-range; record any structural transitions for the novel-angle program.'],
    ['Volterra norm: empirical ||V_{a,Phi}|| sweep on a denser a-grid to map the <=1 boundary', 'medium', 'numerical', 'S-volterra',
      'Run the operator-2-norm power iteration over a denser a-grid to sharpen where ||V_{a,Phi}|| approaches 1, cross-checking against the HS and Wiener-Hopf analytic bounds.'],
    ['GRH extension: HS-bound spot-check on an additional GL(2) L-function family', 'medium', 'numerical', 'S-grh',
      'Apply the Hilbert-Schmidt Volterra-norm bound to one more GL(2)/GL(n) L-function family and verify the <=1 prediction empirically, extending the imp-1298/1317 validation set.'],
    ['Meta-harness: regenerate queue-index.json and reconcile byModel buckets with current engine model strings', 'medium', 'meta', 'S-meta',
      'Audit queue-index byModel buckets against the live engine model tags (opus-4-8 etc.); flag any tickets stranded in an unread bucket so no engine starves while work exists.'],
    ['Tripwire coverage: add a frozen-constant assertion for the most recently shipped numerical data module', 'medium', 'numerical', 'S-tripwire',
      'Identify the newest src/data numerical module lacking a frozen-constant/monotonicity tripwire in run-assertions.mjs and add one to lock its headline constants against regression.'],
    ['Decision-doc backfill: write a thinking/decisions entry for the most recent un-documented completed critical ticket', 'low', 'meta', 'S-meta',
      'Find the most recent completed critical/high ticket with no corresponding thinking/decisions/*.md audit note and write one, preserving the reasoning trail.'],
  ];
  const out = [];
  for (const [title, priority, category, section, description] of bank) {
    if (existing.titles.has(normalize(title))) continue;
    out.push({ title, priority, category, section, description, rationale: 'Evergreen goal-aligned seed — auto-produced to keep the queue from draining.' });
    existing.titles.add(normalize(title));
  }
  return out;
}

function readPending() {
  // refresh index first so the count is current
  try { execFileSync('node', [join(ROOT, 'scripts/build-queue-index.mjs')], { cwd: ROOT, stdio: 'ignore' }); } catch (_) {}
  try { return JSON.parse(readFileSync(INDEX, 'utf8')).totalPending ?? 0; }
  catch (_) { return 0; }
}

function claimId() {
  // Propose max(existing queue id, index.nextImprovementId) + 1, so we never
  // collide with an already-seeded ticket even when the index lags. The claim
  // log (claim-ticket-id) then guards against concurrent in-flight claims.
  let maxId = 0;
  try {
    const text = readFileSync(QUEUE, 'utf8');
    const re = /id:\s*'imp-(\d+)'/g; let m;
    while ((m = re.exec(text))) maxId = Math.max(maxId, parseInt(m[1], 10));
  } catch (_) {}
  let idxNext = 1;
  try { idxNext = JSON.parse(readFileSync(INDEX, 'utf8')).nextImprovementId ?? 1; } catch (_) {}
  const proposed = Math.max(maxId + 1, idxNext);
  const out = execFileSync('node', [join(ROOT, 'scripts/claim-ticket-id.mjs'), String(proposed)], { cwd: ROOT }).toString().trim();
  const m = out.match(/imp-\d+/);
  if (!m) throw new Error(`claim-ticket-id returned unexpected: ${out}`);
  return m[0];
}

function seed(id, t, dry) {
  const a = [
    join(ROOT, 'scripts/seed-ticket.mjs'),
    '--id', id, '--title', t.title, '--priority', t.priority,
    '--category', t.category, '--proof-section', t.section,
    '--description', t.description, '--rationale', t.rationale,
    '--model', 'opus-4-8',
  ];
  if (dry) a.push('--dry-run');
  execFileSync('node', a, { cwd: ROOT, stdio: 'pipe' });
}

function topUp() {
  const pending = readPending();
  if (pending >= args.threshold) { log(`queue healthy (${pending} pending >= threshold ${args.threshold}); no top-up`); return; }
  const need = Math.min(args.target - pending, args['max-per-run']);
  const existing = existingState();
  const candidates = [...harvestSubGaps(existing), ...templateBank(existing)].slice(0, need);
  log(`pending=${pending} < threshold=${args.threshold}; seeding ${candidates.length}/${need} (harvest+template)${args['dry-run'] ? ' [DRY-RUN]' : ''}`);
  let made = 0;
  for (const t of candidates) {
    try {
      if (args['dry-run']) {
        log(`  + (dry) [${t.priority}] ${t.title}`);
        made++;
        continue;
      }
      const id = claimId();
      seed(id, t, false);
      made++;
      log(`  + ${id}  [${t.priority}] ${t.title}`);
    } catch (e) {
      log(`  ! failed to seed "${t.title}": ${String(e.message || e).split('\n')[0]}`);
    }
  }
  log(`top-up complete: ${made} ticket(s) ${args['dry-run'] ? 'would be ' : ''}created`);
}

async function main() {
  if (args.daemon) {
    log(`auto-ticket-producer daemon starting (interval=${args.interval}s, threshold=${args.threshold}, target=${args.target})`);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try { topUp(); } catch (e) { log(`pass error: ${String(e.message || e).split('\n')[0]}`); }
      await new Promise(r => setTimeout(r, args.interval * 1000));
    }
  } else {
    topUp();
  }
}
main();
