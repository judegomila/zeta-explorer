// src/data/imp-1285-engine-subagent-coordination.js
//
// imp-1285: canonical reference for the engine + subagent collision detector
// (the "in-flight ticket lock"). This file is the documentation target that
// the harness code points at:
//   - scripts/_queue-status-edit.mjs  (FAILURE MODES comment)
//   - scripts/dispatch-subagent.mjs   (--lock flow comments)
//   - scripts/salvage-subagent.mjs    (post-cherry-pick release)
//   - scripts/unlock-ticket.mjs       (operator override)
//
// WHY THIS EXISTS
// ---------------
// Multiple engines (subscription / API / Sonnet / Haiku) AND orchestrator-
// dispatched subagents all read the SAME pending queue and can pick the SAME
// ticket. On 2026-05-28 imp-1257 was shipped twice on different commits
// (engine + subagent), costing ~5 min of manual reconciliation. The lock
// turns that race into a no-op: a ticket dispatched to a subagent is hidden
// from every engine ticket-picker until the subagent finishes or is unlocked.
//
// THE PROTOCOL (lifecycle of one ticket)
// --------------------------------------
//   1. ACQUIRE  scripts/dispatch-subagent.mjs --ticket imp-NNNN --lock [--task <id>]
//      Atomically flips status 'pending' -> 'in-progress-subagent' and (if
//      --task is given) records inflightTaskId. Default behavior without
//      --lock is unchanged (the CLI just renders a prompt, no write).
//   2. HIDDEN   scripts/build-queue-index.mjs counts in-progress-subagent
//      tickets (totalInProgressSubagent) but does NOT emit their ids into any
//      pending bucket. Engines read only the buckets, so they never see a
//      locked ticket -> no race.
//   3. RELEASE  scripts/salvage-subagent.mjs flips 'in-progress-subagent' ->
//      'completed' after the subagent commit is cherry-picked. Idempotent: a
//      ticket already at 'completed' is a no-op, so re-running never clobbers
//      a hand-marked completion.
//   4. RECOVER  scripts/unlock-ticket.mjs --ticket imp-NNNN --to pending
//      Operator escape hatch when a subagent dies without committing, leaving
//      the ticket stuck at 'in-progress-subagent'. Always strips
//      inflightTaskId. `--list-locked` enumerates every stuck ticket.
//
// CONCURRENCY MODEL
// -----------------
// No filesystem lock is taken. The queue is a 19k-line JS module edited as a
// surgical brace-balanced string splice (see scripts/_queue-status-edit.mjs).
// Safety comes from an mtime snapshot at read-time plus an mtime re-check
// immediately before the atomic tmp-write + rename. If the mtime moved, the
// edit aborts (mtime-race-detected) rather than clobber a concurrent writer.
// The orchestrator is single-threaded, so simultaneous dispatch of the same
// ticket within milliseconds is the only realistic race, and the mtime guard
// catches it.
//
// FAILURE MODES
// -------------
// Each flip returns { changed, reason, ... }. The reasons and their handling:

export const STATUSES = Object.freeze([
  'pending',
  'in-progress-subagent',
  'completed',
  'blocked',
  'abandoned',
]);

export const FAILURE_MODES = Object.freeze([
  {
    reason: 'mtime-race-detected',
    errno: 'EBUSY',
    meaning: 'Queue mtime changed between read and write; another writer beat us.',
    handling: 'Caller decides: retry the flip (re-read first) or bail. dispatch --lock exits non-zero so the orchestrator does NOT launch the subagent.',
  },
  {
    reason: 'ticket-not-found',
    errno: 'ENOENT',
    meaning: 'No ticket with that id exists in the queue.',
    handling: 'Operator typo or stale id. Fix the id; nothing was written.',
  },
  {
    reason: 'status-mismatch',
    errno: 'EINVAL',
    meaning: 'A --from guard was supplied and the current status differs (e.g. expected pending, found in-progress-subagent = double-dispatch).',
    handling: 'Treat as "already claimed". Do NOT dispatch again; inspect with --list-locked or --inspect.',
  },
  {
    reason: 'already-at-target',
    errno: null,
    meaning: 'Desired status already in place (and no inflightTaskId change requested).',
    handling: 'Benign no-op; exit 0. This is what makes salvage/unlock safe to re-run.',
  },
  {
    reason: 'parse-failure',
    errno: 'EPROTO',
    meaning: 'The ticket chunk did not contain an expected status: field shape.',
    handling: 'Malformed queue entry. Nothing written; inspect the entry by hand.',
  },
]);

// EDGE CASES (explicitly handled or documented)
// ---------------------------------------------
//   - Subagent timeout: the orchestrator must run unlock-ticket.mjs to flip
//     the entry back to 'pending' (retry) or 'completed' (if work salvaged).
//     Until then the ticket stays hidden from engines -- safe, just stalled.
//   - Simultaneous reads: two writers can both read 'pending'; the second
//     write hits mtime-race-detected and aborts -- no double-claim escapes.
//   - inflightTaskId hygiene: any manual unlock strips inflightTaskId so a
//     stale task id can never linger past the lock it described.
export const EDGE_CASES = Object.freeze([
  'subagent-timeout: operator unlock back to pending or completed',
  'simultaneous-reads: second writer aborts via mtime-race-detected',
  'inflightTaskId-hygiene: stripped on every manual unlock',
]);

export default { STATUSES, FAILURE_MODES, EDGE_CASES };
