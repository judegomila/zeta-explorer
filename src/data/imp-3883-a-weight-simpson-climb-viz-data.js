/**
 * @module imp-3883-a-weight-simpson-climb-viz-data
 * @fileoverview imp-3883 -- lightweight, import-light literal data for a visualization of the
 *   imp-3850 uniform-Simpson monotone climb onto the graded-GL -ln A(tau) limit at tau=3.0, with
 *   the tau=2.5 companion. This module does NOT import the heavy Phi-kernel/Simpson-quadrature
 *   assembly (imp-3850-a-weight-dual-path-tau25-30-reconciliation.js), so importing it into a
 *   page costs nothing at load time.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3850-a-weight-dual-path-tau25-30-reconciliation.js (measured.simpsonLadder rungs
 *   n=12000..800000, self-computing at import; measured.simpsonHiNOffline and measured.glLimit,
 *   both offline-verified/self-computed there) plus two intermediate rungs (n=3.2e6, n=1.28e7 for
 *   tau=3.0; n=3.2e6, n=1.28e7 for tau=2.5) quoted from that module's JSDoc provenance comment and
 *   reproduced by the same single-pass log-domain Simpson rule.
 *
 *   @see imp-3850-a-weight-dual-path-tau25-30-reconciliation.js (the source reconciliation)
 *   @see imp-3736-a-weight-quadrature-convergence-assessment.js (the tau in {1.5,2.0} precursor)
 *
 *   Ticket: imp-3883 (ux, medium). Presentation only, RH-equivalent; imp-3066 untouched; NO QED.
 */

// tau=3.0 uniform-Simpson climb: n-ladder -> -ln A(tau=3.0), monotonically approaching the
// graded-GL limit with no overshoot.
export const IMP3883_LADDER_TAU3 = Object.freeze({
  tau: 3,
  gradedGLLimit: 511309.6125383192,
  rungs: Object.freeze([
    { n: 12000, negLnA: 511303.0878783044 },
    { n: 48000, negLnA: 511304.47417266556 },
    { n: 200000, negLnA: 511305.9012890212 },
    { n: 800000, negLnA: 511307.28758338233 },
    { n: 3200000, negLnA: 511308.67201203055 },
    { n: 12800000, negLnA: 511309.5623760041 },
    { n: 102400000, negLnA: 511309.6125201113 },
    { n: 204800000, negLnA: 511309.61253717536 },
  ]),
});

// tau=2.5 companion: the near-s=0 peak is ~8x wider than at tau=3.0, so the required refinement
// (n=2.56e7) is ~8x smaller than the tau=3.0 refinement (n=2.048e8) for the same ~1e-6 residual.
export const IMP3883_LADDER_TAU25 = Object.freeze({
  tau: 2.5,
  gradedGLLimit: 69198.54066474552,
  rungs: Object.freeze([
    { n: 12000, negLnA: 69194.01598343522 },
    { n: 48000, negLnA: 69195.40227779634 },
    { n: 200000, negLnA: 69196.82939390733 },
    { n: 800000, negLnA: 69198.15418089664 },
    { n: 3200000, negLnA: 69198.5349749899 },
    { n: 12800000, negLnA: 69198.54063975584 },
    { n: 25600000, negLnA: 69198.54066317427 },
  ]),
});

// Gap-to-limit at each rung, both taus -- strictly monotone decreasing (no overshoot).
function withGaps(ladder) {
  return ladder.rungs.map((r) => ({ ...r, gapToLimit: ladder.gradedGLLimit - r.negLnA }));
}
export const IMP3883_TAU3_WITH_GAPS = withGaps(IMP3883_LADDER_TAU3);
export const IMP3883_TAU25_WITH_GAPS = withGaps(IMP3883_LADDER_TAU25);

export const IMP3883_CLIMBS_MONOTONE_NO_OVERSHOOT = [IMP3883_TAU3_WITH_GAPS, IMP3883_TAU25_WITH_GAPS].every(
  (rows) => rows.every((r, i) => r.gapToLimit >= 0 && (i === 0 || r.gapToLimit < rows[i - 1].gapToLimit)),
);
