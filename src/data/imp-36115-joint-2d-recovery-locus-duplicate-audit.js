/**
 * @module imp-36115-joint-2d-recovery-locus-duplicate-audit
 * @fileoverview imp-36115 -- AUDIT-CLOSE as a DUPLICATE. imp-36115 asked to measure the
 *   JOINT 2D (alpha, beta) recovery LOCUS at which the imp-35890 running-accumulator ratio
 *   r = max_i|S_i| / Sum|t_k| (for t_k = cos(alpha k + beta sqrt(k)) / sqrt(k), fixed
 *   N ~ 488602) first drops to within 10% and within 1% of the imp-35812 baseline
 *   r_base ~ 1.18e-3, characterizing whether the two-axis interaction NARROWS or WIDENS the
 *   recovery window relative to the imp-36061 single-axis edges -- since imp-36061 measured
 *   only the two axis-aligned edges (alpha with beta = 0, beta with alpha = 2 pi) separately
 *   and flagged them asymmetric.
 *
 *   That measurement was ALREADY DELIVERED, verbatim in scope, by imp-36096
 *   (imp-36096-w1-accumulator-joint-recovery-contour.js): it traces the FIRST-crossing
 *   r <= 1.10 r_base and r <= 1.01 r_base contours across the (alpha, beta) plane at the SAME
 *   fixed N ~ 488602 on the SAME term family, normalizes to the single-axis edges
 *   (u = delta/alphaEdge, v = beta/betaEdge), and answers the narrows-or-widens question
 *   directly: the joint basin is STRONGLY NON-CONVEX / NON-ELLIPTICAL -- it WIDENS over the bulk
 *   of the plane (u + v bulges to ~2.48 for the 10% target / ~2.52 for 1% near intermediate
 *   drift, so an intermediate sqrt-drift needs more than 2x the pure-alpha detuning to recover)
 *   and NARROWS only in a thin beta-axis lobe (u + v caves to ~0.60 / ~0.59). The follow-up
 *   angle NOT yet done -- the N-STABILITY of this joint basin at a larger N -- is a SEPARATE
 *   ticket (re-tracing the lobed contours at N ~ 1e6, cf. imp-36103 which did the single-axis
 *   edges only), so imp-36115 itself carries no residual measurement of its own.
 *
 *   This audit-close note imports the imp-36096 source object VERBATIM (no re-derivation, no new
 *   numerics, no re-running the ~30 s offline contour trace) and records that imp-36115 is a
 *   duplicate of imp-36096, so the fixed-N joint 2D recovery locus is NOT re-measured here.
 *   Follows the imp-35878 audit-close-as-duplicate precedent.
 *
 *   Ticket: imp-36115 (numerical, medium). Audit-close only; adds no new measurement; changes no
 *   bound; instantiates no directed-rounding interval; verifies no inequality; C_mb GUE-conditional
 *   (imp-486) untouched; NO QED; no refereed bound is changed.
 *
 * @see imp-36096-w1-accumulator-joint-recovery-contour (the delivered joint (alpha,beta) recovery contour this ticket duplicates)
 * @see imp-36061-w1-accumulator-recovery-detuning-width (the two single-axis edges imp-36115 asked to extend to the joint plane)
 * @see imp-36103-w1-accumulator-recovery-nstability (N-stability of the SINGLE-axis edges only; the joint-basin N-stability is a separate follow-up)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1) accumulator + run-max bound underlying the ratio r)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family / r_base)
 */

import { IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR } from './imp-36096-w1-accumulator-joint-recovery-contour.js';

const SOURCE = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR;

export const IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT = Object.freeze({
  id: 'imp-36115',
  title:
    'Audit-close as DUPLICATE: the joint 2D (alpha,beta) recovery locus at 10%/1% of r_base that imp-36115 ' +
    'requested was already delivered by imp-36096',
  resolution: 'duplicate',
  duplicateOf: 'imp-36096',
  sourceModule: 'imp-36096-w1-accumulator-joint-recovery-contour.js',

  requestedVsDelivered: Object.freeze({
    requested:
      'joint 2D (alpha,beta) locus where r = max_i|S_i|/Sum|t_k| first reaches within 10% (1%) of r_base ~ 1.18e-3 ' +
      'at fixed N ~ 488602, characterizing whether the two-axis interaction narrows or widens the recovery window ' +
      'relative to the imp-36061 single-axis edges',
    delivered:
      'imp-36096 traced exactly those first-crossing r <= 1.10 r_base and r <= 1.01 r_base contours across the ' +
      '(alpha,beta) plane at the same N ~ 488602 on the same term family and reported the narrows-or-widens answer',
    scopeMatch: true,
  }),

  answerFromSource: Object.freeze({
    maxInteriorUplusV10: SOURCE.jointContour10.maxInteriorUplusV,
    minInteriorUplusV10: SOURCE.jointContour10.minInteriorUplusV,
    maxInteriorUplusV1: SOURCE.jointContour1.maxInteriorUplusV,
    minInteriorUplusV1: SOURCE.jointContour1.minInteriorUplusV,
    note:
      'normalized to the single-axis edges (u = delta/alphaEdge, v = beta/betaEdge): the recovery window WIDENS over ' +
      'the bulk (u+v ~ 2.48 / 2.52 outside the axis diamond u+v = 1) and NARROWS only in a thin beta-axis lobe ' +
      '(u+v ~ 0.60 / 0.59), so the two-axis interaction is strongly non-convex, not a smooth interpolation of the axes',
  }),

  residualFollowUp:
    'the only angle NOT covered by imp-36096 -- the N-STABILITY of this joint basin at a larger N (re-tracing the ' +
    'lobed contours at e.g. N ~ 1e6, since imp-36096 traced only N ~ 488602 and imp-36103 checked N-stability of the ' +
    'SINGLE-axis edges) -- is tracked as a SEPARATE ticket; imp-36115 itself carries no residual fixed-N measurement.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    reranNumerics: false,
    scope: 'audit-close-as-duplicate; imports imp-36096 verbatim; instantiates no directed-rounding interval; verifies no inequality',
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'DUPLICATE OF imp-36096 (audit-close, NO new measurement). imp-36115 requested the joint 2D (alpha,beta) recovery ' +
    'locus at 10%/1% of r_base ~ 1.18e-3 at fixed N ~ 488602, extending the imp-36061 single-axis edges to the coupled ' +
    'plane and characterizing narrows-vs-widens. imp-36096 already traced exactly those first-crossing contours on the ' +
    'same N and term family and answered the question: the joint basin is STRONGLY NON-CONVEX -- the recovery window ' +
    'WIDENS over the bulk (normalized u+v bulging to ~' +
    SOURCE.jointContour10.maxInteriorUplusV.toFixed(2) +
    ' / ~' +
    SOURCE.jointContour1.maxInteriorUplusV.toFixed(2) +
    ' outside the axis diamond, so an intermediate sqrt-drift needs more than 2x the pure-alpha detuning) and NARROWS ' +
    'only in a thin beta-axis lobe (u+v ~ ' +
    SOURCE.jointContour10.minInteriorUplusV.toFixed(2) +
    ' / ~' +
    SOURCE.jointContour1.minInteriorUplusV.toFixed(2) +
    '). No re-derivation is added here; the fixed-N joint locus is NOT re-run. The one uncovered angle -- the ' +
    'N-stability of this joint basin -- is a separate follow-up ticket. Audit-close only; changes no bound; ' +
    'instantiates no directed-rounding interval; verifies no inequality; C_mb GUE-conditional (imp-486) untouched; ' +
    'NO QED; no refereed bound is changed.',
});

export const IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp36115-source-non-rigorous',
    why: 'The source imp-36096 module must self-report as a non-rigorous measurement, matching this audit-close.',
    holds: () => SOURCE.isRigorous === false,
  },
  {
    id: 'imp36115-source-is-joint-contour',
    why: 'The duplicate source must actually be the joint (alpha,beta) recovery contour (id imp-36096) with both target contours present.',
    holds: () =>
      SOURCE.id === 'imp-36096' &&
      typeof SOURCE.jointContour10.maxInteriorUplusV === 'number' &&
      typeof SOURCE.jointContour1.maxInteriorUplusV === 'number',
  },
  {
    id: 'imp36115-answer-matches-source',
    why: 'The restated narrows/widens figures must equal the imp-36096 source measurement exactly (read-only audit).',
    holds: () =>
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.answerFromSource.maxInteriorUplusV10 ===
        SOURCE.jointContour10.maxInteriorUplusV &&
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.answerFromSource.minInteriorUplusV10 ===
        SOURCE.jointContour10.minInteriorUplusV &&
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.answerFromSource.maxInteriorUplusV1 ===
        SOURCE.jointContour1.maxInteriorUplusV &&
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.answerFromSource.minInteriorUplusV1 ===
        SOURCE.jointContour1.minInteriorUplusV,
  },
  {
    id: 'imp36115-widens-and-narrows',
    why: 'The joint basin must genuinely WIDEN past the axis diamond (u+v > 1) and NARROW below it (u+v < 1) to support the narrows/widens answer imp-36115 asked for.',
    holds: () =>
      SOURCE.jointContour10.maxInteriorUplusV > 1 &&
      SOURCE.jointContour1.maxInteriorUplusV > 1 &&
      SOURCE.jointContour10.minInteriorUplusV < 1 &&
      SOURCE.jointContour1.minInteriorUplusV < 1,
  },
  {
    id: 'imp36115-honesty-gate',
    why: 'This is an audit-close-as-duplicate note: it must not claim proof, RH reduction, any changed bound, or re-run numerics.',
    holds: () =>
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.honestCaveat.isProof === false &&
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.honestCaveat.isReductionBelowRH === false &&
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.honestCaveat.changesAnyBound === false &&
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.honestCaveat.reranNumerics === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.honestCaveat.sota),
  },
  {
    id: 'imp36115-verdict-duplicate-no-qed',
    why: 'The verdict must record the duplicate-of-imp-36096 resolution and NO QED.',
    holds: () =>
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.resolution === 'duplicate' &&
      IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.duplicateOf === 'imp-36096' &&
      /DUPLICATE OF imp-36096/.test(IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.verdict) &&
      /NO QED/.test(IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT.verdict),
  },
];

for (const assertion of IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36115-joint-2d-recovery-locus-duplicate-audit assertion failed: ${assertion.id}`
    );
  }
}

export default IMP36115_JOINT_2D_RECOVERY_LOCUS_DUPLICATE_AUDIT;
