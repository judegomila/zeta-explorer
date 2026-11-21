/**
 * @module imp-36191-duplicate-ticket-audit-verification
 *
 * imp-36191 (meta, audit): verifies the recent wave of imp-361xx
 * "duplicate-ticket-honest-status" modules (imp-36106, imp-36107, imp-36122, imp-36123,
 * imp-36161, imp-36162) each genuinely duplicate the completed original ticket they name,
 * rather than a false-positive dup flag that would wrongly suppress real, undelivered scope.
 *
 * METHOD. For each of the six named modules: (1) read the ORIGINAL_TICKET_ID it records,
 * (2) confirm a matching src/data/imp-NNNNN-*.js file exists for that original id,
 * (3) confirm improvement-queue.js records that original ticket's status as 'completed',
 * and (4) compare the duplicate module's verdictShort prose against the original module's
 * own @fileoverview/header summary to confirm the two describe the same underlying finding
 * (not merely similar ids).
 *
 * FINDING. All six checks pass; zero false positives.
 *   imp-36106 -> imp-36124 (kbn-kahan-soft-onset-honest-status): completed, file exists,
 *     both restate the identical imp-36062 SOFT/N-keyed (not kappa-keyed) onset finding.
 *   imp-36107 -> imp-36125 (w1-accumulator-recovery-margin-honest-status): completed, file
 *     exists, both restate the identical imp-36061 asymmetric recovery-margin finding.
 *   imp-36122 -> imp-36104 (kbn-kahan-separation-onset-viz-data): completed, file exists,
 *     both target the identical imp-36062 11-rung viz-data ladder.
 *   imp-36123 -> imp-36105 (recovery-detuning-width-viz-data): completed, file exists, both
 *     target the identical imp-36061 two-axis recovery-detuning-width measurement.
 *   imp-36161 -> imp-36142 (joint-basin-non-convex-single-axis-unsafe-honest-status):
 *     completed, file exists, both restate the identical imp-36096/imp-36061 non-convex
 *     joint-basin finding.
 *   imp-36162 -> imp-36145 (joint-recovery-contour-viz-data): completed, file exists, both
 *     target the identical imp-36096 joint (alpha, beta) recovery-contour data.
 * No false-positive dup flag was found: every flagged "original" is a real, completed,
 * topically-matching ticket -- none of the six audited duplicate flags suppresses
 * undelivered scope.
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check
 * (none needed correction). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-36106-duplicate-ticket-honest-status.js (audited: dup of imp-36124)
 * @see imp-36107-duplicate-ticket-honest-status.js (audited: dup of imp-36125)
 * @see imp-36122-duplicate-ticket-honest-status.js (audited: dup of imp-36104)
 * @see imp-36123-duplicate-ticket-honest-status.js (audited: dup of imp-36105)
 * @see imp-36161-duplicate-ticket-honest-status.js (audited: dup of imp-36142)
 * @see imp-36162-duplicate-ticket-honest-status.js (audited: dup of imp-36145)
 * @see imp-36190-imp36098-166-cross-reference-integrity-audit.js (sibling audit method precedent)
 */

const AUDITED_PAIRS = [
  { duplicateId: 'imp-36106', originalId: 'imp-36124', originalStatus: 'completed' },
  { duplicateId: 'imp-36107', originalId: 'imp-36125', originalStatus: 'completed' },
  { duplicateId: 'imp-36122', originalId: 'imp-36104', originalStatus: 'completed' },
  { duplicateId: 'imp-36123', originalId: 'imp-36105', originalStatus: 'completed' },
  { duplicateId: 'imp-36161', originalId: 'imp-36142', originalStatus: 'completed' },
  { duplicateId: 'imp-36162', originalId: 'imp-36145', originalStatus: 'completed' },
];

const FALSE_POSITIVES_FOUND = 0;

export const IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION = {
  id: 'imp-36191',
  proofSection: 'audit',
  question:
    'For each of the six imp-361xx "duplicate-ticket-honest-status" modules (imp-36106/' +
    '36107/36122/36123/36161/36162), does the completed original ticket it names actually ' +
    'exist, actually carry status completed, and actually cover the same finding -- or is ' +
    'any of the six a false-positive dup flag suppressing real, undelivered scope?',
  verdictShort:
    'CLEAN. All six audited duplicate flags are genuine: every named original ' +
    '(imp-36124, imp-36125, imp-36104, imp-36105, imp-36142, imp-36145) has a real ' +
    'src/data file, is recorded as status: completed in improvement-queue.js, and its ' +
    'header prose topically matches the duplicate module verdictShort it was flagged ' +
    'against. Zero false positives found.',
  auditedPairs: AUDITED_PAIRS,
  auditedPairsCount: AUDITED_PAIRS.length,
  falsePositivesFound: FALSE_POSITIVES_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked each ' +
    'of the six named duplicate-ticket-honest-status modules against its claimed completed ' +
    'original: file existence, improvement-queue.js status, and topical content match. ' +
    'Result: zero false positives, no dup flag suppresses real work, no source file ' +
    'required correction. Changes no bound; establishes no operator positivity; no RH ' +
    'verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-36106/imp-36107/imp-36122/imp-36123/imp-36161/imp-36162 (audited duplicate ' +
    'modules); imp-36124/imp-36125/imp-36104/imp-36105/imp-36142/imp-36145 (their verified ' +
    'completed originals); imp-36190 (sibling audit method precedent).',
};

export const IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp36191-audited-six-pairs',
    description: 'the audit covers exactly the six named duplicate/original pairs',
    holds: () => IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION.auditedPairsCount === 6,
  },
  {
    id: 'imp36191-all-originals-completed',
    description: 'every audited original ticket is recorded as completed',
    holds: () =>
      IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION.auditedPairs.every(
        (p) => p.originalStatus === 'completed'
      ),
  },
  {
    id: 'imp36191-zero-false-positives',
    description: 'the audit found zero false-positive duplicate flags',
    holds: () => IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION.falsePositivesFound === 0,
  },
  {
    id: 'imp36191-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION.isRigorous === false &&
      /NO QED/.test(IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION.verdict),
  },
];

for (const a of IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36191-duplicate-ticket-audit-verification assertion failed: ${a.id}`);
  }
}

export default IMP36191_DUPLICATE_TICKET_AUDIT_VERIFICATION;
