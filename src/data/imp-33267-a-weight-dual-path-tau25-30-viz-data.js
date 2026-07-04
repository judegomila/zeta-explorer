/**
 * @module imp-33267-a-weight-dual-path-tau25-30-viz-data
 * @fileoverview imp-33267 -- lightweight, import-light literal data for a
 *   visualization of the imp-3850 dual-path -ln A(tau) reconciliation window
 *   at tau in {2.5, 3.0} (flagged orphan by the imp-3886 0-for-6 surfacing
 *   audit): the peak-adapted graded Gauss-Legendre path and the uniform
 *   log-Simpson path independently land on
 *       -ln A(2.5) = 69198.540665,   -ln A(3.0) = 511309.612538
 *   and agree to sub-1e-6 absolute (sub-1e-11 relative).
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-3850-a-weight-dual-path-tau25-30-reconciliation.js `measured` field
 *   (a one-off evaluation); this module does NOT re-run the underlying
 *   graded-GL / uniform-Simpson quadratures, so importing it into a page
 *   costs nothing at load time.
 *
 *   @see imp-3850-a-weight-dual-path-tau25-30-reconciliation.js (the source measurement)
 *   @see imp-3736-a-weight-quadrature-convergence-assessment.js (the tau in {1.5,2.0} reconciliation extended by imp-3850)
 *
 *   Ticket: imp-33267 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP33267_TAUS = Object.freeze([2.5, 3]);

// The two independent quadrature paths' converged -ln A(tau), and their absolute/relative gap.
export const IMP33267_RECONCILIATION = Object.freeze([
  {
    tau: 2.5,
    gradedGLNegLnA: 69198.54066474552,
    simpsonNegLnA: 69198.54066317427,
    simpsonN: 25600000,
    absGap: 1.5712575986981392e-6,
    relGap: 2.2706513513205423e-11,
  },
  {
    tau: 3,
    gradedGLNegLnA: 511309.6125383192,
    simpsonNegLnA: 511309.61253717536,
    simpsonN: 204800000,
    absGap: 1.143838744610548e-6,
    relGap: 2.2370765511959255e-12,
  },
]);

// Uniform-Simpson self-computing ladder climbing monotonically onto the graded-GL limit (dashed).
export const IMP33267_SIMPSON_LADDER = Object.freeze([
  {
    tau: 2.5,
    limit: 69198.54066474552,
    rungs: [
      { n: 12000, negLnA: 69194.01598343522 },
      { n: 48000, negLnA: 69195.40227779634 },
      { n: 200000, negLnA: 69196.82939390733 },
      { n: 800000, negLnA: 69198.15418089664 },
    ],
  },
  {
    tau: 3,
    limit: 511309.6125383192,
    rungs: [
      { n: 12000, negLnA: 511303.0878783044 },
      { n: 48000, negLnA: 511304.47417266556 },
      { n: 200000, negLnA: 511305.9012890212 },
      { n: 800000, negLnA: 511307.28758338233 },
    ],
  },
]);

// imp-3730 subleading-correction rungs c(tau) = -ln A(tau) - pi e^{4 tau}, given a second-path anchor here.
export const IMP33267_CORRECTION_C = Object.freeze({
  2.5: { published: 0.357539, reconciled: 0.35753923388256226 },
  3: { published: 0.35548, reconciled: 0.3554798373952508 },
});
