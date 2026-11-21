/**
 * @module imp-35981-pairwise-shape-honest-status-duplicate-audit
 *
 * imp-35981 (content, S-frontier ticket audit): imp-35981 asked to "Add a standalone
 * honest-status MEASUREMENT-ONLY note recording the imp-35893 finding that skeptical
 * pairing-tree SHAPE does NOT push pairwise summation toward its ceiling (robust to BOTH
 * tree shape and term order)".
 *
 * Auditing existing modules BEFORE writing a new note found this ALREADY DELIVERED:
 * imp-35962-w1-pairwise-tree-shape-robust-honest-status.js is exactly this standalone
 * honest-status note -- it restates the imp-35893 worst-shape result (caterpillarR, depth
 * 3817, ~4.42e-4 of the log2(N)*eps ceiling), concludes tree SHAPE does NOT push pairwise
 * toward its ceiling "exactly as worst-case term ORDER (imp-35852) did not" (i.e. robust
 * to BOTH levers), and carries the same measurement-only / no-bound-change / NO QED framing
 * imp-35981 requested. imp-35981 is a DUPLICATE ticket the anti-starvation frontier scout
 * re-seeded from the same imp-35893 gap description before (or concurrently with) imp-35962
 * landing.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new honest-status note -- imp-35962 already supplies it. No new numerics; no new
 * claim; changes no bound; NO QED. This module imports the pre-existing imp-35962 export
 * and pins a permanent regression guard that the imp-35981-requested note stays delivered
 * and does not silently regress.
 *
 * @see imp-35962-w1-pairwise-tree-shape-robust-honest-status (the pre-existing note this audit confirms)
 * @see imp-35893-w1-summation-pairwise-tree-shape (source: the tree-SHAPE sweep both tickets restate)
 * @see imp-35980-representability-cliff-glossary-duplicate-audit (sibling duplicate-ticket audit pattern)
 */

import { IMP35962_W1_PAIRWISE_TREE_SHAPE_ROBUST_HONEST_STATUS } from './imp-35962-w1-pairwise-tree-shape-robust-honest-status.js';

const NOTE = IMP35962_W1_PAIRWISE_TREE_SHAPE_ROBUST_HONEST_STATUS;

export const IMP35981_PAIRWISE_SHAPE_HONEST_STATUS_DUPLICATE_AUDIT = {
  id: 'imp-35981',
  proofSection: 'S-frontier',
  question:
    'imp-35981 asked to add a standalone honest-status MEASUREMENT-ONLY note recording the ' +
    'imp-35893 finding that skeptical pairing-tree SHAPE does not push pairwise summation ' +
    'toward its ceiling (robust to both tree shape and term order); audit whether that note ' +
    'already exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. imp-35962-w1-pairwise-tree-shape-robust-honest-status.js already is ' +
    'exactly this standalone honest-status note: it restates the imp-35893 worst-shape result ' +
    '(caterpillarR, depth 3817, ~4.42e-4 of the log2(N)*eps ceiling) and concludes skeptical ' +
    'tree SHAPE does not push pairwise toward its ceiling "exactly as worst-case term ORDER ' +
    '(imp-35852) did not" -- i.e. robust to BOTH levers, verbatim the imp-35981 request.',
  duplicateOf: 'imp-35962 (the ticket that authored the pre-existing pairwise-shape honest-status note)',
  deliveredVerdict: NOTE.verdict,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new honest-status note added -- imp-35962 already supplies it verbatim. ' +
    'This module records the duplicate-ticket finding and pins a permanent regression guard ' +
    'confirming the delivered note stays present and consistent. Presentation-only; changes ' +
    'no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35981_PAIRWISE_SHAPE_HONEST_STATUS_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35981-note-exists',
    description: 'The pre-existing imp-35962 honest-status note is importable and non-empty',
    holds: () => !!NOTE && typeof NOTE.verdict === 'string' && NOTE.verdict.length > 0,
  },
  {
    id: 'imp35981-note-covers-both-levers',
    description: 'The delivered note states robustness to BOTH tree shape and term order',
    holds: () => /ROBUST/.test(NOTE.verdict) && /BOTH/.test(NOTE.conclusion),
  },
  {
    id: 'imp35981-note-does-not-push-toward-ceiling',
    description: 'The delivered note states skeptical shape does NOT push toward the ceiling',
    holds: () => /does NOT push pairwise summation toward its ceiling/.test(NOTE.conclusion),
  },
  {
    id: 'imp35981-duplicate-of-imp-35962',
    description: 'The audit correctly attributes the pre-existing note to imp-35962',
    holds: () => IMP35981_PAIRWISE_SHAPE_HONEST_STATUS_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35962'),
  },
  {
    id: 'imp35981-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35981_PAIRWISE_SHAPE_HONEST_STATUS_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35981_PAIRWISE_SHAPE_HONEST_STATUS_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35981_PAIRWISE_SHAPE_HONEST_STATUS_DUPLICATE_AUDIT.verdict) &&
      /GUE-conditional/.test(IMP35981_PAIRWISE_SHAPE_HONEST_STATUS_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35981_PAIRWISE_SHAPE_HONEST_STATUS_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35981-pairwise-shape-honest-status-duplicate-audit assertion failed: ${a.id}`);
  }
}
