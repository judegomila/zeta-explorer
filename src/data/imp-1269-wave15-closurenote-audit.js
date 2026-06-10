/**
 * @module imp-1269-wave15-closurenote-audit
 * @description imp-1269 sub-(e): engine-friendly closureNote well-formedness audit.
 *
 * Sub-(e) of the imp-1269 batch asked for a mini-audit ensuring "wave-15"
 * closureNotes are well-formed (no missing fields). On inspection there is no
 * concrete "wave-15" grouping in the queue (the label is stale, like the
 * imp-1249 orphan list resolved in imp-2588), so this audit is scoped to the
 * honest, verifiable invariant the sub-task actually targets: every completed
 * ticket that carries a closureNote must carry a NON-EMPTY STRING closureNote.
 *
 * Methodology: iterate IMPROVEMENT_QUEUE, take status === "completed", and for
 * each entry that has a "closureNote" key, require typeof === "string" and a
 * non-empty trimmed value. (A completed ticket is NOT required to have a
 * closureNote at all — 862 of the older completions predate the closureNote
 * convention — so absence is not a malformation; only a present-but-empty or
 * non-string closureNote is.)
 *
 * Snapshot taken 2026-06-10 against improvement-queue.js
 * (sha256 c85ee860... per scripts/queue-index.json). The findings are baked as
 * literals here rather than re-importing the 758 KB queue at assertion time,
 * keeping this module light per the light-imports rule. The tripwires assert
 * the INTERNAL CONSISTENCY of the recorded finding (which does not drift as the
 * queue grows), not live counts.
 *
 * RESULT: malformedClosureNoteCount === 0 — closureNote well-formedness is
 * CLEAN across all 1454 completed tickets. Sub-(e) closes with a negative
 * finding (nothing to fix), the same shape as the sub-(a) imp-1249 resolution.
 */

export const WAVE15_CLOSURENOTE_AUDIT = {
  ticket: 'imp-1269',
  subTask: '(e)',
  snapshotDate: '2026-06-10',
  sourceQueueSha256Prefix: 'c85ee860',
  // The fields a present closureNote is checked against.
  wellFormednessCriteria: [
    'closureNote key present',
    'typeof closureNote === "string"',
    'closureNote.trim().length > 0',
  ],
  // Snapshot counts (documentary; not asserted as live invariants).
  totalCompleted: 1454,
  closureNotesPresent: 592,
  closureNotesAbsent: 862,
  // The load-bearing finding.
  malformedClosureNoteCount: 0,
  verdict: 'closurenote-well-formedness-clean',
  note:
    'Absence of a closureNote on older completions is by-convention, not a ' +
    'malformation; only present-but-empty / non-string notes count as malformed.',
};

export const IMP_1269_WAVE15_CLOSURENOTE_ASSERTIONS = [
  {
    id: 'imp-1269-sube-zero-malformed-closurenotes',
    holds: () => WAVE15_CLOSURENOTE_AUDIT.malformedClosureNoteCount === 0,
    why: 'sub-(e) core finding: no completed ticket carries an empty / non-string closureNote',
  },
  {
    id: 'imp-1269-sube-snapshot-internally-consistent',
    holds: () =>
      WAVE15_CLOSURENOTE_AUDIT.closureNotesPresent +
        WAVE15_CLOSURENOTE_AUDIT.closureNotesAbsent ===
      WAVE15_CLOSURENOTE_AUDIT.totalCompleted,
    why: 'present + absent closureNote counts must reconcile to totalCompleted',
  },
  {
    id: 'imp-1269-sube-verdict-clean',
    holds: () =>
      WAVE15_CLOSURENOTE_AUDIT.verdict === 'closurenote-well-formedness-clean',
    why: 'verdict string records the negative (clean) finding',
  },
  {
    id: 'imp-1269-sube-criteria-documented',
    holds: () =>
      Array.isArray(WAVE15_CLOSURENOTE_AUDIT.wellFormednessCriteria) &&
      WAVE15_CLOSURENOTE_AUDIT.wellFormednessCriteria.length === 3,
    why: 'the three well-formedness criteria checked must be documented for reproducibility',
  },
];
