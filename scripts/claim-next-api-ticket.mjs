#!/usr/bin/env node
// scripts/claim-next-api-ticket.mjs
//
// Claim coordinator for the parallel API worker pool (auto-improve-api-pool.sh).
//
// The single-worker engines pick "highest-priority, lowest-id" deterministically
// and have no claim step, so running N of them on the same opus-4-8 bucket makes
// them all grab the SAME ticket -> duplicate API spend + colliding commits. This
// CLI hands each worker a DISTINCT ticket by atomically flipping it
// pending -> in-progress-subagent (the imp-1285 status that build-queue-index.mjs
// already excludes from every engine's pending bucket). The flip is done by
// flipTicketStatus from _queue-status-edit.mjs, whose from:'pending' guard +
// mtime race-check guarantee that two workers can never both win the same ticket
// (the loser gets status-mismatch / mtime-race and we move to the next candidate).
//
// Reuse of in-progress-subagent (rather than a new status) is deliberate: it is
// already in LEGAL_STATUSES and already excluded by the index builder, and the
// inflightTaskId tag ('api-pool-w<N>-<epochMs>') distinguishes pool claims from
// real subagent dispatches for the reaper below and for unlock-ticket --list-locked.
//
// Subcommands:
//   --worker <id>            claim one ticket for worker <id>; prints "imp-NNN" or "NONE"
//   --release <imp-NNN>      flip a claimed ticket back to pending (worker failed/produced nothing)
//   --reap-only              only revert stale pool claims to pending; print count
//
// A claim is "stale" (reclaimable) when its inflightTaskId epoch is older than
// STALE_MS -- i.e. the worker that held it died mid-turn. Every --worker and
// --reap-only call reaps stale pool claims first so leaked tickets self-heal.
//
// Exit codes: 0 ok (even when NONE) | 1 usage error | 3 internal error.

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { flipTicketStatus } from './_queue-status-edit.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const REPO_ROOT  = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(REPO_ROOT, 'src', 'data', 'improvement-queue.js');

const STALE_MS = Number(process.env.API_POOL_STALE_MS || 30 * 60 * 1000); // 30 min
const POOL_TAG_RE = /^api-pool-w[0-9]+-([0-9]+)$/;

// opus-4-8 is the API pool's bucket. If it is empty, fall through to opus-class
// work that no other engine owns: untagged tickets in these categories. We must
// NOT pick tickets tagged for the other engines' buckets.
const FALLBACK_CATEGORIES = new Set(['proof', 'feature', 'content', 'meta', 'numerical']);
const OTHER_ENGINE_MODELS = new Set(['opus-4-7', 'opus-4-6', 'sonnet-4-6', 'haiku-4-5']);
const PRIORITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 };

function fail(code, msg) {
  process.stderr.write(`claim-next-api-ticket: ${msg}\n`);
  process.exit(code);
}

// Import the queue as a structured array (cheap in node; no token cost). Bust the
// ESM module cache with a query param so successive imports in one long-lived
// process would see fresh data -- harmless for the short-lived CLI case.
async function loadQueue() {
  const url = pathToFileURL(QUEUE_PATH).href + `?t=${Date.now()}`;
  const mod = await import(url);
  const q = mod.IMPROVEMENT_QUEUE || mod.default;
  if (!Array.isArray(q)) fail(3, 'improvement-queue.js does not export IMPROVEMENT_QUEUE array');
  return q;
}

function isBlocked(ticket, byId) {
  const deps = Array.isArray(ticket.dependsOn) ? ticket.dependsOn : [];
  return deps.some((d) => {
    const dep = byId.get(d);
    return dep && dep.status !== 'completed';
  });
}

function isEligible(ticket, byId) {
  if (ticket.status !== 'pending') return false;
  if (isBlocked(ticket, byId)) return false;
  if (ticket.model === 'opus-4-8') return true;
  // Fallback: opus-class work no other engine owns.
  if (OTHER_ENGINE_MODELS.has(ticket.model)) return false;
  return FALLBACK_CATEGORIES.has(ticket.category);
}

function sortCandidates(a, b) {
  const pa = PRIORITY_RANK[a.priority] ?? 9;
  const pb = PRIORITY_RANK[b.priority] ?? 9;
  if (pa !== pb) return pa - pb;
  const na = parseInt(String(a.id).replace(/^imp-/, ''), 10) || 0;
  const nb = parseInt(String(b.id).replace(/^imp-/, ''), 10) || 0;
  return na - nb;
}

// Revert pool claims to pending. With force=false, only claims whose holding
// worker died (inflightTaskId epoch older than STALE_MS) are reverted — leaked
// tickets self-heal. With force=true, ALL pool claims are reverted regardless of
// age (used on clean pool shutdown so nothing is left stranded). Real subagent
// dispatches (non api-pool inflightTaskId) are never touched. Returns count.
function reapStale(queue, force = false) {
  let reaped = 0;
  const now = Date.now();
  for (const t of queue) {
    if (t.status !== 'in-progress-subagent') continue;
    const m = POOL_TAG_RE.exec(t.inflightTaskId || '');
    if (!m) continue;                       // a real subagent dispatch, not ours — leave it
    if (!force && now - Number(m[1]) < STALE_MS) continue;
    const r = flipTicketStatus({ ticketId: t.id, to: 'pending', from: 'in-progress-subagent', inflightTaskId: null });
    if (r.changed) reaped++;
  }
  return reaped;
}

async function cmdClaim(workerId) {
  const queue = await loadQueue();
  const byId = new Map(queue.map((t) => [t.id, t]));

  reapStale(queue);

  const candidates = queue.filter((t) => isEligible(t, byId)).sort(sortCandidates);
  const tag = `api-pool-w${workerId}-${Date.now()}`;

  for (const c of candidates) {
    const r = flipTicketStatus({
      ticketId: c.id,
      to: 'in-progress-subagent',
      from: 'pending',
      inflightTaskId: tag,
    });
    if (r.changed) {
      process.stdout.write(c.id + '\n');
      return;
    }
    // status-mismatch (another worker claimed it first) or mtime-race-detected
    // (concurrent edit) -> just try the next candidate.
  }
  process.stdout.write('NONE\n');
}

async function cmdRelease(ticketId) {
  if (!/^imp-\d+$/.test(ticketId || '')) fail(1, `bad ticket id: ${ticketId}`);
  const r = flipTicketStatus({
    ticketId,
    to: 'pending',
    from: 'in-progress-subagent',
    inflightTaskId: null,
  });
  // Idempotent: if it's already pending or got completed by the turn, that's fine.
  process.stdout.write(`${ticketId}: ${r.reason}\n`);
}

async function cmdReapOnly(force = false) {
  const queue = await loadQueue();
  const n = reapStale(queue, force);
  process.stdout.write(`reaped ${n}\n`);
}

async function main() {
  const argv = process.argv.slice(2);
  const i = argv.indexOf('--worker');
  if (i !== -1) return cmdClaim(argv[i + 1] || '0');
  const r = argv.indexOf('--release');
  if (r !== -1) return cmdRelease(argv[r + 1]);
  if (argv.includes('--reap-all')) return cmdReapOnly(true);
  if (argv.includes('--reap-only')) return cmdReapOnly(false);
  fail(1, 'usage: --worker <id> | --release <imp-NNN> | --reap-only | --reap-all');
}

main().catch((e) => fail(3, e && e.stack ? e.stack : String(e)));
