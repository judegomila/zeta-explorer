/**
 * @module data/cross-reference-integrity-2026-04-12
 * @fileoverview imp-504 audit artefact: cross-reference integrity sweep of all
 *   imp-NNN citations across the project. Extracted every imp-NNN token from
 *   src/, papers/, lean/, and IMPROVEMENTS.md (excluding the queue-internal
 *   files improvement-queue.js, improvements.js, improvement-queue-archive.js
 *   to avoid self-reference noise), then cross-checked each id against
 *   improvement-queue.js for (a) existence and (b) status == completed.
 *   Flagged two phantom ids (imp-364, imp-367) cited in src/data/lambda-roadmap.js
 *   step-2/step-4/step-5 tickets arrays but never created in the queue (queue
 *   skips imp-363 -> imp-366 and imp-366 -> imp-368); both were removed from
 *   lambda-roadmap.js as part of imp-504. No pending tickets were cited as
 *   completed in any submission-facing file. The 42 out-of-range refs
 *   (imp-1090..imp-1361) found in rh-dag.js and ticket-router.js are informal
 *   shorthand for improvements.js log entries (sequential id field, ~1404
 *   entries), not queue ticket ids; they are explicitly classified as
 *   NOT-A-VIOLATION in the informalRefs field.
 *
 * Proof-chain step: meta / audit (not a proof step). Provides the audit-trail
 *   record that no pending ticket is cited as completed in any submission-facing
 *   file as of 2026-04-12, which is a hygiene precondition for the Lambda chain
 *   submission package but not itself a mathematical step.
 *
 * Exports:
 *   - XREF_INTEGRITY_2026_04_12: frozen-shape record with scope (files scanned
 *     and excluded), citedIds counts (536 total unique, 494 in-range 1..504,
 *     42 out-of-range informal refs), queueState snapshot at sweep time (492
 *     unique ids, 467 completed, 18 pending, 7 other), phantomIds list
 *     (imp-364, imp-367 with citedIn / context / fix per entry),
 *     pendingCitedAsCompleted (empty array == CLEAN), informalRefs
 *     classification of imp-1090+ refs as improvements.js log shorthand,
 *     verdict summary (CORRECTED, 2 phantoms removed, 0 pending-cited-as-
 *     completed), and a howToVerify shell-snippet checklist for reproducing
 *     the sweep.
 *
 * Inbound dependencies:
 *   - src/data/improvement-queue.js (queried for ticket ids and statuses; not
 *     imported as a module here, only referenced as the source of truth that
 *     this audit validates against).
 *   - src/data/lambda-roadmap.js (the file containing the two phantom-id
 *     citations that this audit flagged and corrected).
 *
 * Tickets that created or modified this file: imp-504 (initial cross-reference
 *   integrity sweep and the two phantom-id corrections in lambda-roadmap.js),
 *   imp-1077 (this @module / @fileoverview header).
 *
 * imp-504: Cross-reference integrity check
 * Date: 2026-04-12
 *
 * Sweep: extracted every imp-NNN reference from all .js/.lean/.tex/.md files
 * under src/, papers/, lean/, and IMPROVEMENTS.md; cross-checked each against
 * improvement-queue.js to verify (a) the id exists and (b) the status is
 * completed. Flagged all mismatches.
 *
 * SYNTAX NOTE: avoid star-slash inside JSDoc text.
 */

// ── SWEEP PARAMETERS ──────────────────────────────────────────────────────────

export const XREF_INTEGRITY_2026_04_12 = {
  ticket:     'imp-504',
  runDate:    '2026-04-12',
  timestamp:  '2026-04-12T18:00:00Z',

  // ── Scope ────────────────────────────────────────────────────────────────────
  scope: {
    filesScanned:  'src/**/*.js, papers/**/*.{tex,md,bib}, lean/**/*.lean, IMPROVEMENTS.md',
    excludedFiles: 'src/data/improvement-queue.js, src/data/improvements.js, src/data/improvement-queue-archive.js',
    note: 'Queue-internal files excluded to avoid self-reference noise.',
  },

  // ── Cited-ID counts ──────────────────────────────────────────────────────────
  citedIds: {
    totalUnique:          536,   // all unique imp-NNN references found
    inRange_1_to_504:     494,   // queue ticket range
    outOfRange_505_plus:   42,   // informal improvement-log refs (see informalRefs below)
  },

  // ── Queue state at sweep time ─────────────────────────────────────────────────
  queueState: {
    uniqueTicketIds:  492,   // unique ids in improvement-queue.js (imp-476/477 duplicated)
    completed:        467,
    pending:           18,   // from queue-index.json (includes imp-503 which was just completed)
    otherStatuses:      7,   // 1 done + 4 partial + 2 superseded
  },

  // ── VIOLATION TYPE 1: phantom IDs ─────────────────────────────────────────────
  // Cited in files outside the queue but NOT present in improvement-queue.js at all.
  phantomIds: [
    {
      id:    'imp-364',
      citedIn: ['src/data/lambda-roadmap.js'],
      context: 'step 2 tickets array: [..., "imp-363", "imp-364"]. Queue jumps imp-363 -> imp-366; imp-364 was never created.',
      fix:   'Removed imp-364 from the step-2 tickets array in lambda-roadmap.js.',
    },
    {
      id:    'imp-367',
      citedIn: ['src/data/lambda-roadmap.js'],
      context: 'step 4 tickets array: [..., "imp-366", "imp-367"] AND step 5 tickets array: [..., "imp-355", "imp-367"]. Queue goes imp-366 -> imp-368; imp-367 was never created.',
      fix:   'Removed imp-367 from both tickets arrays in lambda-roadmap.js.',
    },
  ],

  // ── VIOLATION TYPE 2: pending tickets cited as completed ──────────────────────
  // Pending IDs cited in submission-facing files outside the queue.
  pendingCitedAsCompleted: [],  // CLEAN — no pending ticket appears in non-queue files as completed

  // ── OUT-OF-RANGE references (NNN > 504) ───────────────────────────────────────
  // These are informal shorthand for improvement-log entries (improvements.js id: NNN),
  // NOT queue ticket IDs. They do not violate integrity.
  informalRefs: [
    {
      ids:     'imp-1090, imp-1093, imp-1094, imp-1098, imp-1100..1126, imp-1160, imp-1190..1217, imp-1233, imp-1358, imp-1361',
      citedIn: ['src/data/rh-dag.js', 'src/data/ticket-router.js'],
      nature:  'Informal shorthand for improvement-log entries (improvements.js id field). Not queue tickets.',
      verdict: 'NOT A VIOLATION — improvements.js has ~1404 sequential entries; these refs are in-bounds.',
    },
  ],

  // ── VERDICT ───────────────────────────────────────────────────────────────────
  verdict: {
    phantomCount:             2,   // imp-364, imp-367
    pendingCitedAsCompleted:  0,
    correctionsMade:          2,   // removed imp-364 and imp-367 from lambda-roadmap.js tickets arrays
    status: 'CORRECTED',
    summary:
      '2 phantom IDs found (imp-364, imp-367) — tickets planned but never created, ' +
      'cited only in lambda-roadmap.js internal tickets arrays. Removed both. ' +
      'No pending tickets are cited as completed in any submission-facing file. ' +
      'Audit trail is clean after corrections.',
  },

  // ── howToVerify ──────────────────────────────────────────────────────────────
  howToVerify: [
    'grep -roh "imp-[0-9]+" src/ papers/ lean/ | sort -u  # all cited IDs',
    'grep -oh "id: .imp-[0-9]*." src/data/improvement-queue.js | sort -u  # all queue IDs',
    'comm -23 <(cited|sort) <(queue|sort)  # phantoms = cited but not in queue',
    'grep -n "imp-364\\|imp-367" src/data/lambda-roadmap.js  # should return empty after fix',
  ],
};
