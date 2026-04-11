#!/usr/bin/env node
// Queue autofill — when the critical pending queue runs dry, generate new
// tickets automatically from the open-gap catalog instead of letting the
// engine drift to random work.
//
// User ask: "if we ever run out of improvements, add things on the queue
// to do the math to close the gaps in our strategy".
//
// Data sources:
//   - src/data/lambda-roadmap.js  OPEN_GAPS + LAMBDA_CHAIN_STEPS
//   - src/data/rh-dag.js          RH_DAG_NODES (status + dependsOn)
//   - scripts/queue-index.json    live pending list
//
// Output: appends new tickets directly to src/data/improvement-queue.js
// (before the `// META —` divider), regenerates scripts/queue-index.json,
// and reports what was added.
//
// Usage:
//   node scripts/autofill-queue.mjs            # dry run — print what would be added
//   node scripts/autofill-queue.mjs --apply    # actually write and commit
//   node scripts/autofill-queue.mjs --min 3    # autofill only if critical pending < 3
//
// Default: --min 3, dry run.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ── Args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
function argValue(flag, def) {
  const i = args.indexOf(flag);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : def;
}
const MIN_CRITICAL = parseInt(argValue('--min', '3'), 10);

// ── Load live queue state via queue-index.json ────────────────────────────

const INDEX_PATH = path.join(PROJECT_ROOT, 'scripts/queue-index.json');
function regenerateIndex() {
  const { execSync } = require('node:child_process');
  execSync(`node ${path.join(PROJECT_ROOT, 'scripts/build-queue-index.mjs')}`, {
    stdio: 'inherit',
  });
}

async function loadIndex() {
  if (!fs.existsSync(INDEX_PATH)) {
    throw new Error('scripts/queue-index.json missing. Run scripts/build-queue-index.mjs first.');
  }
  return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
}

// ── Load roadmap open gaps and DAG pending nodes ──────────────────────────

async function loadRoadmapGaps() {
  const mod = await import(
    'file://' + path.join(PROJECT_ROOT, 'src/data/lambda-roadmap.js')
  );
  return mod.OPEN_GAPS || [];
}

async function loadDagNodes() {
  const mod = await import(
    'file://' + path.join(PROJECT_ROOT, 'src/data/rh-dag.js')
  );
  return mod.RH_DAG_NODES || [];
}

// ── Generate candidate tickets ────────────────────────────────────────────

/**
 * For each open gap in the roadmap, check whether its nextTickets array
 * already has a pending ticket in the live queue. If not, emit a new
 * ticket filling the gap.
 */
function candidatesFromGaps(gaps, liveIndex) {
  const livePendingIds = new Set(liveIndex.allPendingIds || []);
  const out = [];
  for (const g of gaps) {
    if (g.severity === 'closed') continue;
    const nextTickets = g.nextTickets || [];
    // If any nextTicket is already pending, skip.
    if (nextTickets.some((t) => livePendingIds.has(t))) continue;
    // Otherwise, emit a fresh ticket targeting the gap.
    out.push({
      reason: `open gap ${g.id} (${g.severity})`,
      source: `lambda-roadmap.js OPEN_GAPS[${g.id}]`,
      ticket: {
        title: `Close ${g.id} — ${g.label}`,
        category: 'proof',
        priority: g.severity === 'critical' ? 'critical' : 'high',
        proofSection: 'S7',
        description:
          `Autofill-generated. Gap ${g.id} (${g.label}) is open per ` +
          `src/data/lambda-roadmap.js OPEN_GAPS. Status: ${g.status}. ` +
          `Blocks: ${g.blocks || '(unknown)'}. Owner: ${g.owner || '(none)'}. ` +
          `This ticket is a placeholder for the math work needed to close ` +
          `this gap. An agent picking it up should read the owner ticket ` +
          `and the gap definition, then attempt a partial or full closure.`,
        rationale:
          `Queue was below the ${MIN_CRITICAL}-critical threshold with this ` +
          `gap still open, so the autofill routine created a ticket to ` +
          `keep the engine moving on the highest-leverage math work.`,
        estimatedComplexity: 'high',
      },
    });
  }
  return out;
}

/**
 * DAG-backed candidates: for each pending DAG node whose dependencies are
 * all closed (i.e. it is in the unblocked frontier) but which does not
 * already have a matching pending id in the live queue, emit a ticket.
 */
function candidatesFromDag(dagNodes, liveIndex) {
  const byId = Object.fromEntries(dagNodes.map((n) => [n.id, n]));
  const closed = new Set(
    dagNodes
      .filter((n) => n.status === 'completed' || n.status === 'partial')
      .map((n) => n.id),
  );
  const livePendingIds = new Set(liveIndex.allPendingIds || []);

  const frontier = dagNodes.filter((n) => {
    if (n.status !== 'pending') return false;
    return (n.dependsOn || []).every((d) => closed.has(d) || !byId[d]);
  });

  const out = [];
  for (const n of frontier) {
    if (livePendingIds.has(n.id)) continue; // already live
    out.push({
      reason: `DAG frontier node (${n.complexity || 'unknown complexity'})`,
      source: `rh-dag.js RH_DAG_NODES[${n.id}]`,
      ticket: {
        title: n.title || `Close ${n.id}`,
        category: n.category || 'proof',
        priority: 'critical',
        proofSection: 'S7',
        description:
          `Autofill from rh-dag.js: ${n.claim || n.title}. Dependencies ` +
          `(${(n.dependsOn || []).join(', ') || 'none'}) are all closed.`,
        rationale:
          `DAG frontier ticket — unblocked now that dependencies are closed.`,
        estimatedComplexity: n.complexity || 'medium',
      },
    });
  }
  return out;
}

// ── Serialize a ticket to the improvement-queue.js format ─────────────────

function serializeTicket(id, t) {
  // Escape single quotes in strings by converting them to backtick-friendly
  // curly apostrophes. Prevents the parse-breaking pattern from earlier
  // sessions where \\' was used inside single-quoted strings.
  const esc = (s) => String(s || '').replace(/'/g, '\u2019');
  return [
    '  {',
    `    id: '${id}',`,
    `    title: '${esc(t.title)}',`,
    `    category: '${esc(t.category)}',`,
    `    priority: '${esc(t.priority)}',`,
    `    status: 'pending',`,
    t.proofSection ? `    proofSection: '${esc(t.proofSection)}',` : null,
    `    description: '${esc(t.description)}',`,
    `    rationale: '${esc(t.rationale)}',`,
    `    estimatedComplexity: '${esc(t.estimatedComplexity)}',`,
    `    completedAt: null,`,
    '  },',
  ]
    .filter(Boolean)
    .join('\n');
}

// ── Find next unused imp-NNN id ──────────────────────────────────────────

function findNextTicketId(queueText) {
  const re = /id: 'imp-(\d+)'/g;
  let max = 0;
  let m;
  while ((m = re.exec(queueText)) !== null) {
    const n = parseInt(m[1], 10);
    if (n > max) max = n;
  }
  return max + 1;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const index = await loadIndex();
  const critPending = (index.criticalPending || []).length;
  console.log(
    `Queue autofill: ${critPending} critical pending (threshold ${MIN_CRITICAL})`,
  );

  if (critPending >= MIN_CRITICAL) {
    console.log('Above threshold — no autofill needed. Exiting cleanly.');
    return;
  }

  const gaps = await loadRoadmapGaps();
  const dagNodes = await loadDagNodes();

  const gapCandidates = candidatesFromGaps(gaps, index);
  const dagCandidates = candidatesFromDag(dagNodes, index);

  // Prefer DAG frontier first (they are concrete actionable nodes), then
  // roadmap gap fill-ins. Deduplicate by title.
  const seen = new Set();
  const picked = [];
  for (const c of [...dagCandidates, ...gapCandidates]) {
    if (seen.has(c.ticket.title)) continue;
    seen.add(c.ticket.title);
    picked.push(c);
    if (picked.length >= 5) break;
  }

  if (picked.length === 0) {
    console.log(
      'No candidates found — all open gaps already have pending tickets and ' +
        'no DAG frontier nodes are unblocked. The queue is genuinely drained.',
    );
    return;
  }

  console.log(`\nCandidates (${picked.length}):`);
  for (const p of picked) {
    console.log(`  - ${p.ticket.title} [${p.ticket.priority}]`);
    console.log(`    reason: ${p.reason}`);
    console.log(`    source: ${p.source}`);
  }

  if (!APPLY) {
    console.log(
      '\n(dry run — re-run with --apply to actually insert into improvement-queue.js)',
    );
    return;
  }

  // Insert into improvement-queue.js
  const queuePath = path.join(PROJECT_ROOT, 'src/data/improvement-queue.js');
  const queueText = fs.readFileSync(queuePath, 'utf8');
  const nextId = findNextTicketId(queueText);

  const rendered = picked.map((p, i) =>
    serializeTicket(`imp-${nextId + i}`, p.ticket),
  );
  const block =
    '\n  // ── Autofill tickets (generated by scripts/autofill-queue.mjs) ──\n' +
    rendered.join('\n') +
    '\n';

  const marker = '// META — auto-improvement engine self-improvement';
  if (!queueText.includes(marker)) {
    console.error(`Could not find META marker "${marker}" in queue. Aborting.`);
    process.exit(1);
  }
  const newText = queueText.replace(marker, block + '\n  ' + marker);
  fs.writeFileSync(queuePath, newText);
  console.log(
    `\nInserted ${picked.length} tickets imp-${nextId}..imp-${nextId + picked.length - 1}`,
  );

  // Regenerate index.
  const { execSync } = await import('node:child_process');
  execSync(`node ${path.join(PROJECT_ROOT, 'scripts/build-queue-index.mjs')}`, {
    stdio: 'inherit',
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
