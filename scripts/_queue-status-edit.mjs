// scripts/_queue-status-edit.mjs
// imp-1285: shared in-place editor for the `status:` field of a single
// ticket inside src/data/improvement-queue.js.
//
// Used by:
//   - scripts/dispatch-subagent.mjs   (--lock flag: pending -> in-progress-subagent)
//   - scripts/salvage-subagent.mjs    (post-cherry-pick: in-progress-subagent -> completed, if not already)
//   - scripts/unlock-ticket.mjs       (manual operator override)
//
// PROTOCOL CONTRACT
// -----------------
// The queue file is a 19k-line JS module. We deliberately do NOT round-trip
// via dynamic import + AST serialisation; that would mangle comments and
// formatting. Instead we operate as a surgical string edit on the file.
//
// Each ticket is a `{ ... }` literal containing `id: 'imp-NNNN'`. The
// `status:` field lives in the same object. We:
//   1. mtime-snapshot the queue file at read-time
//   2. parse only the chunk we care about (the smallest brace-balanced
//      region that contains the target id)
//   3. apply the substitution (status + optional inflightTaskId)
//   4. mtime-check before write: if mtime changed since the snapshot,
//      bail out with EBUSY -- ANOTHER editor is mid-flight, retrying
//      our edit would clobber theirs.
//
// IDEMPOTENCE
// -----------
// flipTicketStatus is idempotent w.r.t. the same target status: re-running
// with `to: 'completed'` on a ticket already at 'completed' is a no-op
// (returns { changed: false, reason: 'already-at-target' }). This lets the
// salvage CLI safely retry without corrupting hand-marked completions.
//
// CONCURRENCY MODEL
// -----------------
// We do NOT take a filesystem lock. The mtime-check + atomic-rename write
// pattern handles the only realistic race (orchestrator dispatches two
// subagents within ms of each other on the same ticket — extremely rare
// in practice because the orchestrator is single-threaded).
//
// FAILURE MODES (documented in src/data/imp-1285-engine-subagent-coordination.js):
//   - mtime-race-detected   (EBUSY): another writer beat us; caller decides retry vs. bail
//   - ticket-not-found      (ENOENT): id not in queue
//   - status-mismatch       (EINVAL): expected `from` status, found something else
//   - already-at-target     (no-op):  desired status already in place
//   - parse-failure         (EPROTO): regex did not match expected shape

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const REPO_ROOT  = path.resolve(__dirname, '..');

export const QUEUE_PATH = path.join(REPO_ROOT, 'src', 'data', 'improvement-queue.js');

// Legal status values. `in-progress-subagent` is the imp-1285 addition.
export const LEGAL_STATUSES = Object.freeze([
  'pending',
  'in-progress-subagent',
  'completed',
  'blocked',
  'abandoned',
]);

// ── Locate ticket chunk ──────────────────────────────────────────────────────

/**
 * Find the byte-offsets of the brace-balanced `{ ... }` literal in `text`
 * whose first id field matches `ticketId`. Returns null if not found.
 *
 * @param {string} text
 * @param {string} ticketId e.g. 'imp-1285'
 * @returns {{start: number, end: number} | null}
 */
export function findTicketSpan(text, ticketId) {
  // Anchor on the literal `id: 'imp-NNNN'` substring. The opening `{` lives
  // somewhere before it; scan backwards.
  const idPattern = new RegExp(`id:\\s*['"]${ticketId.replace(/[-]/g, '\\-')}['"]`);
  const m = idPattern.exec(text);
  if (!m) return null;
  const idAt = m.index;

  // Walk backwards from idAt to find the matching `{`. We only have to
  // count braces in the rough range -- ticket literals are <= ~3k chars
  // each, so we cap the look-behind at 20k chars to bound work.
  const lookBehindCap = Math.max(0, idAt - 20000);
  let depth = 0;
  let braceStart = -1;
  for (let i = idAt; i >= lookBehindCap; i--) {
    const ch = text[i];
    if (ch === '}') depth++;
    else if (ch === '{') {
      if (depth === 0) { braceStart = i; break; }
      depth--;
    }
  }
  if (braceStart < 0) return null;

  // Walk forward from braceStart to find the matching `}`.
  let braceEnd = -1;
  let d = 0;
  const n = text.length;
  for (let i = braceStart; i < n; i++) {
    const ch = text[i];
    // Skip string/comment content (light pass — same conventions used by
    // build-queue-index.mjs).
    if (ch === "'" && text[i - 1] !== '\\') {
      i++;
      while (i < n && !(text[i] === "'" && text[i - 1] !== '\\')) i++;
      continue;
    }
    if (ch === '"' && text[i - 1] !== '\\') {
      i++;
      while (i < n && !(text[i] === '"' && text[i - 1] !== '\\')) i++;
      continue;
    }
    if (ch === '`') {
      i++;
      while (i < n && text[i] !== '`') { if (text[i] === '\\') i++; i++; }
      continue;
    }
    if (ch === '/' && text[i + 1] === '/') {
      while (i < n && text[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && text[i + 1] === '*') {
      i += 2;
      while (i < n - 1 && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (ch === '{') d++;
    else if (ch === '}') {
      d--;
      if (d === 0) { braceEnd = i; break; }
    }
  }
  if (braceEnd < 0) return null;

  return { start: braceStart, end: braceEnd + 1 };
}

/**
 * Read the current `status:` field value from a ticket chunk.
 * Returns null if no `status:` field is present.
 */
export function readChunkStatus(chunk) {
  const m = chunk.match(/status:\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

/**
 * Read the current `inflightTaskId:` field value from a ticket chunk.
 * Returns null if absent.
 */
export function readChunkInflightTaskId(chunk) {
  const m = chunk.match(/inflightTaskId:\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

// ── Edit a chunk ─────────────────────────────────────────────────────────────

/**
 * Apply a status/inflightTaskId edit to a ticket chunk and return the new
 * chunk text. Pure function; no I/O.
 *
 * - If `inflightTaskId` is provided and the field already exists, replaces it.
 * - If `inflightTaskId` is provided and the field is absent, INSERTS a new
 *   line immediately after the `status:` line.
 * - If `inflightTaskId` is null, the field is REMOVED if present (and the
 *   line is deleted entirely so the chunk stays formatted).
 *
 * @param {string} chunk
 * @param {{ newStatus: string, inflightTaskId?: string | null }} args
 * @returns {string}
 */
export function rewriteChunkStatus(chunk, { newStatus, inflightTaskId }) {
  if (!LEGAL_STATUSES.includes(newStatus)) {
    throw new Error(`rewriteChunkStatus: illegal newStatus ${JSON.stringify(newStatus)}`);
  }
  let out = chunk;

  // 1. Replace the status field.
  out = out.replace(
    /(status:\s*)(['"])[^'"]+(\2)/,
    (_full, p, q) => `${p}${q}${newStatus}${q}`,
  );

  // 2. Handle inflightTaskId (add / replace / remove).
  const hasInflight = /inflightTaskId:\s*['"]/.test(out);
  if (inflightTaskId === undefined) {
    // Caller doesn't want to touch the field. Leave alone.
    return out;
  }
  if (inflightTaskId === null) {
    if (hasInflight) {
      // Remove the entire line containing inflightTaskId.
      out = out.replace(/^\s*inflightTaskId:\s*['"][^'"]+['"],?\s*$\n?/m, '');
    }
    return out;
  }
  // Insert or replace.
  if (hasInflight) {
    out = out.replace(
      /(inflightTaskId:\s*)(['"])[^'"]+(\2)/,
      (_full, p, q) => `${p}${q}${inflightTaskId}${q}`,
    );
  } else {
    // Insert immediately after the status line. Preserve the indentation
    // used on the status line.
    out = out.replace(
      /^(\s*)status:\s*(['"])[^'"]+\2,?\s*$/m,
      (statusLine, indent) => `${statusLine}\n${indent}inflightTaskId: '${inflightTaskId}',`,
    );
  }
  return out;
}

// ── Top-level edit API ───────────────────────────────────────────────────────

/**
 * Read queue file, find ticket, flip status. Idempotent w.r.t. `to`.
 *
 * @param {Object} args
 * @param {string} args.ticketId
 * @param {string} args.to                  target status
 * @param {string|null} [args.from]         (optional) require current status to be this
 * @param {string|null|undefined} [args.inflightTaskId] (see rewriteChunkStatus)
 * @param {boolean} [args.dryRun=false]
 * @returns {{ changed: boolean, reason: string, before?: string, after?: string }}
 */
export function flipTicketStatus({ ticketId, to, from = null, inflightTaskId, dryRun = false }) {
  if (!/^imp-\d+$/.test(ticketId || '')) {
    return { changed: false, reason: 'bad-ticket-id', error: `bad ticket id format: ${ticketId}` };
  }
  if (!LEGAL_STATUSES.includes(to)) {
    return { changed: false, reason: 'bad-target-status', error: `illegal target status: ${to}` };
  }
  if (!fs.existsSync(QUEUE_PATH)) {
    return { changed: false, reason: 'queue-missing', error: `queue not found at ${QUEUE_PATH}` };
  }

  // Snapshot mtime for race detection.
  const snapMtime = fs.statSync(QUEUE_PATH).mtimeMs;
  const text      = fs.readFileSync(QUEUE_PATH, 'utf8');

  const span = findTicketSpan(text, ticketId);
  if (!span) {
    return { changed: false, reason: 'ticket-not-found', error: `ticket ${ticketId} not in queue` };
  }
  const before = text.slice(span.start, span.end);
  const currentStatus = readChunkStatus(before);
  if (!currentStatus) {
    return { changed: false, reason: 'parse-failure', error: `no status: field in ticket ${ticketId}` };
  }
  if (from && currentStatus !== from) {
    return {
      changed: false,
      reason: 'status-mismatch',
      error: `ticket ${ticketId} is at status='${currentStatus}', expected '${from}'`,
      currentStatus,
    };
  }
  if (currentStatus === to && inflightTaskId === undefined) {
    return { changed: false, reason: 'already-at-target', currentStatus };
  }

  const after = rewriteChunkStatus(before, { newStatus: to, inflightTaskId });
  if (after === before) {
    return { changed: false, reason: 'no-op', currentStatus };
  }

  if (dryRun) {
    return { changed: true, reason: 'dry-run', before, after, currentStatus };
  }

  // Race check: re-stat the file before write.
  const reMtime = fs.statSync(QUEUE_PATH).mtimeMs;
  if (reMtime !== snapMtime) {
    return {
      changed: false,
      reason: 'mtime-race-detected',
      error: `queue file mtime changed (${snapMtime} -> ${reMtime}) between read and write; aborting to avoid clobbering concurrent edit`,
    };
  }

  // Atomic write: write to tmp then rename. fs.renameSync is atomic on
  // the same filesystem.
  const newText = text.slice(0, span.start) + after + text.slice(span.end);
  const tmpPath = QUEUE_PATH + '.imp1285-tmp-' + process.pid;
  fs.writeFileSync(tmpPath, newText, 'utf8');
  fs.renameSync(tmpPath, QUEUE_PATH);

  return { changed: true, reason: 'updated', before, after, currentStatus };
}

/**
 * Read-only inspect: returns the current status + inflightTaskId for a
 * ticket. Used by salvage CLI to decide whether to unlock.
 *
 * @param {string} ticketId
 * @returns {{ found: boolean, status?: string, inflightTaskId?: string|null }}
 */
export function inspectTicket(ticketId) {
  if (!fs.existsSync(QUEUE_PATH)) return { found: false };
  const text = fs.readFileSync(QUEUE_PATH, 'utf8');
  const span = findTicketSpan(text, ticketId);
  if (!span) return { found: false };
  const chunk = text.slice(span.start, span.end);
  return {
    found: true,
    status: readChunkStatus(chunk),
    inflightTaskId: readChunkInflightTaskId(chunk),
  };
}
