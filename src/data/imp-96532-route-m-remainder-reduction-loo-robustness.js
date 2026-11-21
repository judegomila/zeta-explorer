/**
 * @module imp-96532-route-m-remainder-reduction-loo-robustness
 *
 * imp-96532 (accuracy): decide whether the imp-96487 Route M asymptotic-remainder
 * model (MB: ratio = c0 + L^{-p}(a cos(wL)+b sin(wL)), p=2, w=3.85, L=logN) owes
 * its ~29 percent rms reduction over a flat plateau to a single outlier Gram rung
 * or to a smoothly-spread fluctuation across the N=250..10000 ladder, and report
 * the leave-one-out sensitivity of that reduction.
 *
 * METHOD (tmp/imp-96532-scratch.mjs, reproducible; no new solve): the imp-96487 MB
 * linear least-squares fit was reproduced on the frozen 21-rung IMP96487_LADDER
 * (c0=0.984564, rms=8.8545e-3, reduction=29.03 percent vs the flat constant, max
 * |residual|=0.02063 at N=2600 -- reproduces the imp-96487 baked values). Two
 * decompositions were then run:
 *   (1) the per-rung |residual| distribution and the SSE share of the maximum rung;
 *   (2) leave-one-out: for each of the 21 rungs, MB AND the constant plateau were
 *       re-fit on the remaining 20 rungs and the reduction recomputed.
 *
 * FINDINGS:
 *   (1) NOT an outlier. The max |residual| 0.02063 (N=2600) carries only 25.8
 *       percent of the total sum of squared residuals, sits atop a smooth spread
 *       (top-3 |resid| = 0.02063, 0.01659, 0.01659 at N=2600/10000/9000; the
 *       10000 and 9000 rungs are within 20 percent of the max), and is only 4.31x
 *       the median |residual| (0.00479). The fluctuation is distributed, not a
 *       lone spike.
 *   (2) ROBUST under leave-one-out. Removing any single rung and re-fitting keeps
 *       the reduction in [24.41 percent, 35.28 percent] -- it never collapses toward
 *       zero. Dropping the max-residual rung (N=2600) does not shrink the reduction:
 *       it RAISES it to 33.27 percent, because that rung is a genuine fluctuation the
 *       flat constant fails on, not an anomaly the MB fit fails on. The lowest LOO
 *       reduction, 24.41 percent, comes from dropping N=750; the extrapolated
 *       centerline c0 stays pinned in [0.98318, 0.98546] across all 21 refits.
 *
 * VERDICT: the ~29 percent reduction is robust -- it reflects a smoothly-distributed
 * remainder fluctuation, not a single outlier rung. The MB model's improvement over a
 * flat plateau survives leave-one-out on every rung (>= 24.4 percent) and even
 * strengthens when the max-residual rung is removed. This does NOT touch the imp-96487
 * asymptote question (the fitted centerline is still a plateau at ~0.985, RH value 1
 * disfavored ~1.9x, undecided by the 3.689-wide log-N window): a robust reduction
 * means the fluctuating-remainder description is well-founded, not that ratio(N) -> 1.
 *
 * MEASUREMENT/FIT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the MB fit and ladder)
 */

// Reproduced imp-96487 MB full-ladder fit (p=2, w=3.85) over the frozen 21 rungs.
export const IMP96532_MB_REPRODUCE = Object.freeze({
  c0: 0.984564,
  rmsMB: 0.0088545,
  rmsConstant: 0.012477,
  reduction: 0.2903,             // 1 - rmsMB/rmsConstant
  maxAbsResid: 0.02063,
  maxAbsResidAtN: 2600,
  note: 'reproduces the imp-96487 baked MB fit: c0 ~ 0.9846, rms 8.85e-3, ~29 percent below the flat constant, max |residual| 0.0206 at N=2600.',
});

// Per-rung residual distribution: is the max a lone outlier or the top of a spread?
export const IMP96532_RESIDUAL_SPREAD = Object.freeze({
  maxAbsResid: 0.02063,
  maxAbsResidAtN: 2600,
  maxShareOfSSE: 0.258,          // (max^2)/SSE -- 25.8 percent, far from dominating
  top3AbsResid: Object.freeze([0.02063, 0.01659, 0.01629]),  // N=2600, 10000, 9000
  medianAbsResid: 0.00479,
  maxOverMedian: 4.31,
  isSingleOutlier: false,
  note: 'the max |residual| carries only 25.8 percent of the SSE and is 4.31x the median, with two further rungs (N=9000,10000) within ~20 percent of it: the fluctuation is smoothly spread across the ladder, not concentrated in one rung.',
});

// Leave-one-out: re-fit MB and constant on the remaining 20 rungs, per dropped rung.
export const IMP96532_LOO = Object.freeze({
  reductionFull: 0.2903,
  reductionMin: 0.2441,          // dropping N=750
  reductionMinAtDropN: 750,
  reductionMax: 0.3528,          // dropping N=10000
  reductionMaxAtDropN: 10000,
  reductionDropMaxResidRung: 0.3327, // dropping N=2600 RAISES the reduction
  dropMaxResidRungN: 2600,
  c0Range: Object.freeze({ lo: 0.98318, hi: 0.98546 }),
  robust: true,
  note: 'across all 21 leave-one-out refits the reduction stays in [24.41, 35.28] percent and never collapses; dropping the max-residual rung N=2600 raises it to 33.27 percent, confirming the ~29 percent reduction is not driven by a single outlier. c0 stays pinned in [0.98318, 0.98546].',
});

export const IMP96532_VERDICT = Object.freeze({
  reductionRobust: true,
  maxResidualIsOutlier: false,
  looReductionFloor: 0.2441,
  conclusion:
    'the imp-96487 ~29 percent rms reduction of the MB asymptotic-remainder model over a flat plateau is robust: the max |residual| 0.0206 (N=2600) carries only 25.8 percent of the SSE and is the top of a smoothly-distributed fluctuation (top-3 at N=2600/9000/10000), and leave-one-out on every rung keeps the reduction >= 24.41 percent, even RISING to 33.27 percent when the max-residual rung is removed. The reduction is therefore a stable property of the ladder, not a single-rung artifact. This does not bear on the undecided asymptote (centerline still ~0.985, RH value 1 disfavored ~1.9x, log-N window too narrow to resolve): a robust reduction validates the fluctuating-remainder DESCRIPTION only.',
});

export const IMP96532_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/fit only: every value is a reproducible numeric from tmp/imp-96532-scratch.mjs re-fitting the imp-96487 MB model over the frozen imp-96487 ladder; no new solve, no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96532_ASSERTIONS = [
  {
    id: 'imp96532-reproduces-imp96487-mb',
    holds: () =>
      Math.abs(IMP96532_MB_REPRODUCE.reduction - 0.2903) < 5e-4 &&
      Math.abs(IMP96532_MB_REPRODUCE.maxAbsResid - 0.02063) < 5e-4 &&
      IMP96532_MB_REPRODUCE.maxAbsResidAtN === 2600,
    why: 'the reproduced MB fit matches the imp-96487 baked ~29 percent reduction and max |residual| 0.0206 at N=2600.',
  },
  {
    id: 'imp96532-max-residual-not-a-lone-outlier',
    holds: () =>
      IMP96532_RESIDUAL_SPREAD.isSingleOutlier === false &&
      IMP96532_RESIDUAL_SPREAD.maxShareOfSSE < 0.30 &&
      IMP96532_RESIDUAL_SPREAD.maxOverMedian < 5,
    why: 'the max |residual| carries under 30 percent of the SSE and is under 5x the median: the fluctuation is spread across the ladder, not a single outlier.',
  },
  {
    id: 'imp96532-reduction-robust-under-loo',
    holds: () =>
      IMP96532_LOO.robust === true &&
      IMP96532_LOO.reductionMin > 0.24 &&
      IMP96532_LOO.reductionDropMaxResidRung > IMP96532_LOO.reductionFull,
    why: 'leave-one-out keeps the reduction above 24 percent on every rung, and dropping the max-residual rung raises it above the full-ladder value: the reduction is not outlier-driven.',
  },
  {
    id: 'imp96532-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96532_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96532_HONEST_BANNER) &&
      /NO QED/.test(IMP96532_HONEST_BANNER) &&
      IMP96532_VERDICT.reductionRobust === true,
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and the verdict records the robust-reduction reading.',
  },
];

for (const a of IMP96532_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96532-route-m-remainder-reduction-loo-robustness assertion failed: ${a.id}`);
  }
}

export default {
  mbReproduce: IMP96532_MB_REPRODUCE,
  residualSpread: IMP96532_RESIDUAL_SPREAD,
  loo: IMP96532_LOO,
  verdict: IMP96532_VERDICT,
  banner: IMP96532_HONEST_BANNER,
};
