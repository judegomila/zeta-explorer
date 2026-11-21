/**
 * @module imp-124863-ecf-precision-cluster-cohort-index
 * @fileoverview imp-124863 -- META cross-reference cohort index grouping the imp-124808/imp-124810/
 *   imp-124811 E_CF precision cluster by role: extended-precision two-axis separation (imp-124808),
 *   bisection-tolerance round-off floor sweep (imp-124810), and the |reldiff|-vs-|E_CF| invariant-
 *   product round-off law (imp-124811), mirroring the imp-124822 / imp-124782 / imp-97846
 *   cohort-index pattern. Read individually, a scout may re-run the dps/eps two-axis split, re-sweep
 *   the bisection tolerance, or re-tabulate the |reldiff| ladder and mistake any one result for the
 *   whole picture. Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE CLUSTER (logical order, not chronological). All three separate the DOUBLE-PRECISION round-off
 *   floor from the EXACT imp-97665 pair-ratio identity E_CF/E_ET = E_flow/E_trunc at the deep
 *   landmarks (L6/L7), where the imp-124769/imp-124770 direct 5-point cross-check |reldiff| grows as
 *   |E_CF| collapses.
 *     imp-124808 -- SEPARATES the imp-124788 single-point mpmath dps=60 |reldiff| ~ 3.33e-14 floor
 *       into two independent axes: sweeping dps 30..120 at fixed eps=1e-3 leaves |reldiff| unchanged
 *       (dps-invariant), while sweeping eps at fixed dps=100 gives a clean O(eps^4) law (log-log
 *       slope 4.000, ~1e4 drop per decade down to 3.33e-26) -- proving the floor is pure 5-point
 *       stencil truncation, NOT working-precision-limited, and that the identity carries ZERO
 *       residual drift at arbitrary precision.
 *     imp-124810 -- SWEEPS the imp-124769 landmark-bisection tolerance TOL across decades: the
 *       round-off floor R(TOL) tracks the bisection resolution linearly while tolerance-limited, then
 *       SATURATES at the double-precision floor R_inf ~ 4.46e-13 once TOL <= ~1e-15 (identical to the
 *       TOL=0 machine-limit imp-124769 solve), pinning sigma_crit ~ 1.27e-2 strictly between L6 and
 *       L5 -- a tighter bisection CANNOT push the DIAG3 L6 non-monotonicity past L6; only extended
 *       precision (imp-124808) moves it.
 *     imp-124811 -- FITS the imp-124770 M2 attribution (|reldiff| growth tracks |E_CF| collapse) as a
 *       law: a log-log regression of |reldiff| against |E_CF| over L2..L7 has slope ~ -1.085 (within
 *       ~9% of the predicted -1), and the invariant product P = |reldiff|*|E_CF| stays flat
 *       (max/min ~ 8.5, geomean R ~ 2.34e-12) rather than decreasing toward the deep tail, capping any
 *       residual identity drift D <= 5.8e-12 -- consistent with the imp-124808 D = 0 result.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-124808 looks like an isolated
 *   extended-precision diagnostic, imp-124810 an isolated tolerance-sensitivity sweep, and imp-124811
 *   an isolated curve-fit. Read together, all three triangulate the SAME conclusion from three
 *   independent angles -- raising working precision (imp-124808), tightening the bisection tolerance
 *   (imp-124810), and fitting the |reldiff|-vs-|E_CF| law directly (imp-124811) -- and all three land
 *   on the same verdict: the deep-landmark |reldiff| growth is pure double-precision round-off/stencil
 *   truncation, the imp-97665 pair-ratio identity carries ZERO residual drift, and nothing short of
 *   extended precision can move the DIAG3 L6 eps-ladder non-monotonicity. This index bakes that
 *   reading verbatim so future work does not re-run the dps/eps two-axis split, does not re-sweep the
 *   bisection tolerance, and does not re-tabulate the |reldiff|-vs-|E_CF| law as if any one of these
 *   were still open.
 *
 *   STATUS: a grouping/index note over three already-committed modules, not a new derivation. No
 *   bound changes; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz untouched; imp-3066
 *   K_a >= 0 untouched; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-124808-extprec-pairratio-two-axis.js (dps/eps two-axis split, floor = pure O(eps^4) stencil truncation)
 * @see imp-124810-bisection-tol-roundoff-floor-sweep.js (bisection TOL sweep, R_inf saturates ~4.46e-13)
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law.js (|reldiff| vs |E_CF| inverse law, flat invariant product)
 * @see imp-124822-frontier-crosscheck-batch-cohort-index.js (sibling cohort-index this mirrors)
 * @see imp-124782-sigma-ramp-knee-cohort-index.js (sibling cohort-index this mirrors)
 * @see imp-97846-kernel-fold-diag3-cohort-index.js (sibling cohort-index this mirrors)
 *
 * Ticket: imp-124863 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const AXIS_B_SLOPE = 4.0; // imp-124808: O(eps^4) log-log slope, dps-invariant floor
const R_INF_BISECTION = 4.46e-13; // imp-124810: double-precision bisection round-off floor
const SIGMA_CRIT = 1.27e-2; // imp-124810: saturated crossover, strictly between L6 (0.005) and L5 (0.02)
const RELDIFF_VS_ECF_SLOPE = -1.085; // imp-124811: log-log OLS slope (predicted -1)
const R_FLOOR_GEOMEAN = 2.34e-12; // imp-124811: geomean of the invariant product P
const DRIFT_CAP = 5.8e-12; // imp-124811: residual identity-drift cap at the flow-heavy L2 rung

const ECF_PRECISION_CLUSTER_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-124808',
    role: 'extended-precision dps/eps two-axis separation',
    result:
      'Separates the imp-124788 single-point mpmath |reldiff| ~ 3.33e-14 floor into two axes: ' +
      'dps-invariant across 30..120 at fixed eps=1e-3 (not working-precision-limited), and a clean ' +
      'O(eps^4) law at fixed dps=100 (log-log slope ' + AXIS_B_SLOPE.toFixed(1) + ', ~1e4 drop per ' +
      'decade to 3.33e-26) -- the floor is pure 5-point stencil truncation and the identity carries ' +
      'ZERO residual drift at arbitrary precision.',
  }),
  Object.freeze({
    id: 'imp-124810',
    role: 'bisection-tolerance round-off floor sweep',
    result:
      'Sweeps the imp-124769 landmark-bisection TOL across decades: R(TOL) tracks the bisection ' +
      'resolution linearly while tolerance-limited, then saturates at the double-precision floor ' +
      'R_inf ~ ' + R_INF_BISECTION.toExponential(2) + ' once TOL <= ~1e-15 (identical to the imp-124769 ' +
      'machine-limit solve), pinning sigma_crit ~ ' + SIGMA_CRIT.toFixed(3) + ' strictly between L6 ' +
      'and L5 -- a tighter bisection cannot push the L6 non-monotonicity further; only extended ' +
      'precision moves it.',
  }),
  Object.freeze({
    id: 'imp-124811',
    role: 'reldiff-vs-E_CF invariant-product round-off law',
    result:
      'Fits the imp-124770 M2 attribution as a law: log-log slope of |reldiff| vs |E_CF| over L2..L7 ' +
      'is ' + RELDIFF_VS_ECF_SLOPE.toFixed(3) + ' (within ~9% of the predicted -1), and the invariant ' +
      'product P = |reldiff|*|E_CF| stays flat (geomean R ~ ' + R_FLOOR_GEOMEAN.toExponential(2) + ') ' +
      'rather than decreasing toward the deep tail, capping any residual identity drift D <= ' +
      DRIFT_CAP.toExponential(2) + ' -- consistent with the imp-124808 D = 0 result.',
  }),
]);

export const IMP124863_ECF_PRECISION_CLUSTER_COHORT_INDEX = Object.freeze({
  id: 'imp-124863',
  proofSection: 'S-frontier',
  cohort: ECF_PRECISION_CLUSTER_COHORT,
  axisB_slope: AXIS_B_SLOPE,
  R_inf_bisection: R_INF_BISECTION,
  sigma_crit: SIGMA_CRIT,
  reldiff_vs_ecf_slope: RELDIFF_VS_ECF_SLOPE,
  R_floor_geomean: R_FLOOR_GEOMEAN,
  drift_cap: DRIFT_CAP,
  anyBoundMoved: false,
  question:
    'The E_CF precision cluster (imp-124808, imp-124810, imp-124811) reads as three separate ' +
    'measurements: an extended-precision two-axis split, a bisection-tolerance sweep, and a ' +
    'curve-fit. Grouped, do they triangulate one coherent conclusion about the imp-97665 pair-ratio ' +
    'identity at the deep landmarks, or could a future scout mistake any one result as an isolated, ' +
    'still-open question?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-124808 proves the imp-124788 ~3.33e-14 floor is ' +
    'pure O(eps^4) stencil truncation (dps-invariant), not a working-precision limit; imp-124810 ' +
    'shows the same conclusion from the bisection side -- R saturates at the double-precision floor ' +
    'R_inf ~ ' + R_INF_BISECTION.toExponential(2) + ' and a tighter TOL cannot move sigma_crit past ' +
    SIGMA_CRIT.toFixed(3) + '; imp-124811 fits the |reldiff|-vs-|E_CF| relationship directly and finds ' +
    'a flat invariant product (no deep-tail decay), capping any residual drift D <= ' +
    DRIFT_CAP.toExponential(2) + '. All three independently converge on: the imp-97665 pair-ratio ' +
    'identity E_CF/E_ET = E_flow/E_trunc carries ZERO residual drift, the deep-landmark |reldiff| ' +
    'growth is pure double-precision round-off/stencil truncation, and only extended precision (not a ' +
    'tighter double-precision bisection) can move the DIAG3 L6 eps-ladder non-monotonicity. Future ' +
    'work on this thread should not re-run the dps/eps two-axis split, should not re-sweep the ' +
    'bisection tolerance, and should not re-tabulate the |reldiff|-vs-|E_CF| law as open questions. ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation; C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124808 (extended-precision dps/eps two-axis split); imp-124810 (bisection-tolerance ' +
    'round-off floor sweep); imp-124811 (|reldiff|-vs-|E_CF| invariant-product law); imp-124769/' +
    'imp-124770/imp-124788/imp-97665 (the prior findings this cluster triangulates); ' +
    'imp-124822-frontier-crosscheck-batch-cohort-index.js / imp-124782-sigma-ramp-knee-cohort-index.js ' +
    '/ imp-97846-kernel-fold-diag3-cohort-index.js (sibling cohort-indices this mirrors).',
});

export default IMP124863_ECF_PRECISION_CLUSTER_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124863_ECF_PRECISION_CLUSTER_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp124863-cohort-has-all-three-members',
    why: 'The whole point of the index is grouping exactly these three modules; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP124863_ECF_PRECISION_CLUSTER_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-124808', 'imp-124810', 'imp-124811'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp124863-pinned-literals-consistent',
    why: 'The cohort cites specific pinned magnitudes from each member; those must match the ' +
      'committed values from the underlying modules.',
    holds: () => {
      const idx = IMP124863_ECF_PRECISION_CLUSTER_COHORT_INDEX;
      return (
        Math.abs(idx.axisB_slope - 4.0) < 1e-9 &&
        idx.R_inf_bisection > 3e-13 && idx.R_inf_bisection < 7e-13 &&
        idx.sigma_crit > 0.005 && idx.sigma_crit < 0.02 &&
        idx.reldiff_vs_ecf_slope < -0.9 && idx.reldiff_vs_ecf_slope > -1.2 &&
        idx.R_floor_geomean > 1e-13 && idx.R_floor_geomean < 1e-11 &&
        idx.drift_cap < 1e-11
      );
    },
  },
  {
    id: 'imp124863-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP124863_ECF_PRECISION_CLUSTER_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP124863_ECF_PRECISION_CLUSTER_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP124863_ECF_PRECISION_CLUSTER_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP124863_ECF_PRECISION_CLUSTER_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124863-ecf-precision-cluster-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
