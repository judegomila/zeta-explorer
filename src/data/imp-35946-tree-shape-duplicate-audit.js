/**
 * @module imp-35946-tree-shape-duplicate-audit
 *
 * imp-35946 (numerical, S-frontier ticket audit): imp-35946 asked to "Measure whether the
 * imp-35893 skeptical pairing-tree SHAPE pushes pairwise divide-and-conquer summation
 * toward its depth*eps ceiling on a NON-cancelling all-positive same-sign multiset (where the
 * running accumulator GROWS)" -- specifically: hold N ~ 488602, replace the terms with an
 * all-positive family t_k = 1/sqrt(k), sweep the same balanced->skew->caterpillar tree shapes,
 * tabulate the pairwise normalized error and its ratio to the depth*eps ceiling, and assess
 * whether worst-case tree shape then DOES approach the depth-proportional worst-case bound.
 *
 * Auditing src/data/ BEFORE writing a new measurement module found this ALREADY DELIVERED:
 * imp-35945-w1-summation-monotone-tree-shape.js re-runs the IDENTICAL seven pairing-tree
 * shapes at the SAME N ~ 488602 on the SAME t_k = 1/sqrt(k) monotone all-positive multiset
 * (condition number ~1, no cancellation) against the SAME association-invariant exact BigInt
 * reference, and tabulates for every shape both ratioToPairwiseCeiling (fraction of the
 * log2(N)*eps ceiling) and ratioToDepthEpsBound (fraction of that tree own depth*eps bound).
 * Its measured verdict: the worst tree (caterpillarR, depth 3817) reaches ~0.647 of the
 * log2(N)*eps ceiling -- a ~1460x jump over imp-35893 ~4.42e-4 on the cancellation-heavy
 * multiset, CORROBORATING imp-35893 attribution -- but the depth-proportional depth*eps
 * worst-case bound STILL stays far from realized (~0.3%), so worst-case tree shape does NOT
 * approach the depth*eps ceiling even once coherent accumulation is possible. That is exactly
 * the measurement + assessment imp-35946 requested. imp-35946 is a DUPLICATE ticket the
 * anti-starvation frontier scout re-seeded from the same imp-35893 gap description before (or
 * concurrently with) imp-35945 landing.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new measurement module -- imp-35945 already supplies the monotone multiset, the
 * seven-shape sweep, the depth*eps-ratio column, and the assessment. No new numerics; no new
 * claim; changes no bound; NO QED. This module imports the pre-existing imp-35945 export and
 * pins a permanent regression guard that the imp-35946-requested measurement stays delivered.
 *
 * @see imp-35945-w1-summation-monotone-tree-shape (the pre-existing module delivering the requested measurement)
 * @see imp-35893-w1-summation-pairwise-tree-shape (tree-SHAPE stress on the cancellation-heavy multiset)
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive ceiling)
 */

import { IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE } from './imp-35945-w1-summation-monotone-tree-shape.js';

const DELIVERED = IMP35945_W1_SUMMATION_MONOTONE_TREE_SHAPE;

export const IMP35946_TREE_SHAPE_DUPLICATE_AUDIT = {
  id: 'imp-35946',
  proofSection: 'S-frontier',
  question:
    'imp-35946 asked to measure whether skeptical pairing-tree SHAPE pushes pairwise summation ' +
    'toward its depth*eps ceiling on a NON-cancelling all-positive multiset t_k = 1/sqrt(k) at ' +
    'N ~ 488602 (the complement of the imp-35893 cancellation-heavy family), sweeping the same ' +
    'balanced->skew->caterpillar shapes and tabulating the error ratio to the depth*eps bound; ' +
    'audit whether that measurement already exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. imp-35945-w1-summation-monotone-tree-shape.js already re-runs the identical ' +
    'seven pairing-tree shapes at the same N ~ 488602 on the same t_k = 1/sqrt(k) monotone ' +
    'all-positive multiset (condition ~1, no cancellation) against the same association-invariant ' +
    'exact BigInt reference, tabulating both ratioToPairwiseCeiling and ratioToDepthEpsBound per ' +
    'shape. Its measured assessment: the worst tree (caterpillarR, depth 3817) reaches ~0.647 of ' +
    'the log2(N)*eps ceiling (a ~1460x jump over imp-35893 ~4.42e-4, corroborating imp-35893), ' +
    'yet the depth-proportional depth*eps worst-case bound stays far from realized (~0.3%), so ' +
    'worst-case tree shape does NOT approach the depth*eps ceiling even with cancellation removed.',
  duplicateOf: 'imp-35945 (the ticket that authored the pre-existing monotone tree-shape measurement)',
  deliveredWorstRatioToPairwiseCeiling: DELIVERED.summary.worstRatioToPairwiseCeiling,
  deliveredWorstRatioToDepthEpsBound: DELIVERED.summary.worstRatioToDepthEpsBound,
  deliveredShapeCount: DELIVERED.shapes.length,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new measurement module added -- imp-35945 already supplies the t_k = 1/sqrt(k) ' +
    'monotone all-positive multiset at N ~ 488602, the seven-shape balanced->caterpillar sweep, the ' +
    'per-shape ratio to the depth*eps ceiling, and the assessment that worst-case tree shape ' +
    'approaches the (small) log2(N)*eps ceiling but NOT the depth-proportional depth*eps bound. This ' +
    'module records the duplicate-ticket finding and pins a permanent regression guard confirming the ' +
    'delivered measurement stays present and consistent. Certifies no W1 bound; instantiates no ' +
    'interval; changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35946_TREE_SHAPE_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35946-delivered-monotone-multiset-non-cancelling',
    description: 'The pre-existing imp-35945 module uses the requested t_k = 1/sqrt(k) monotone all-positive multiset (condition ~1)',
    holds: () =>
      /1 \/ sqrt\(k\)|1\/sqrt\(k\)/.test(DELIVERED.representativeSum.form) &&
      Math.abs(DELIVERED.representativeSum.conditionNumberAtTPT - 1) < 1e-9,
  },
  {
    id: 'imp35946-delivered-n-anchor-and-seven-shapes',
    description: 'The delivered measurement holds N ~ 488602 and sweeps the requested seven balanced->caterpillar tree shapes',
    holds: () =>
      DELIVERED.representativeSum.retainedTermsAtTPT > 4.8e5 &&
      DELIVERED.representativeSum.retainedTermsAtTPT < 4.9e5 &&
      DELIVERED.shapes.length === 7 &&
      DELIVERED.shapes.some((s) => s.shape === 'caterpillarR'),
  },
  {
    id: 'imp35946-delivered-tabulates-depth-eps-ratio',
    description: 'The delivered measurement tabulates the per-shape ratio to the depth*eps ceiling imp-35946 requested',
    holds: () =>
      DELIVERED.shapes.every(
        (s) => typeof s.ratioToDepthEpsBound === 'number' && s.ratioToDepthEpsBound > 0,
      ),
  },
  {
    id: 'imp35946-delivered-assessment-approaches-log2-not-depth-eps',
    description: 'The delivered assessment: worst tree approaches the log2(N)*eps ceiling (>0.3) but NOT the depth*eps bound (<1e-2)',
    holds: () =>
      DELIVERED.summary.worstRatioToPairwiseCeiling > 0.3 &&
      DELIVERED.summary.worstRatioToPairwiseCeiling < 1 &&
      DELIVERED.summary.worstRatioToDepthEpsBound < 1e-2,
  },
  {
    id: 'imp35946-duplicate-of-imp-35945',
    description: 'The audit correctly attributes the pre-existing measurement to imp-35945',
    holds: () => IMP35946_TREE_SHAPE_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35945'),
  },
  {
    id: 'imp35946-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35946_TREE_SHAPE_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35946_TREE_SHAPE_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35946_TREE_SHAPE_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35946_TREE_SHAPE_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35946-tree-shape-duplicate-audit assertion failed: ${a.id}`);
  }
}
