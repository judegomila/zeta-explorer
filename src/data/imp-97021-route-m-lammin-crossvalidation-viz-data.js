/**
 * @module imp-97021-route-m-lammin-crossvalidation-viz-data
 *
 * imp-97021 (ux): import-light viz-data leaf for the imp-96999 four-estimator Route M
 * lam_min exponent cross-validation. imp-96999 re-estimated the imp-96428 Vasyunin Gram
 * lam_min power-law exponent p = 1.917927 four independent ways (full 12-rung OLS
 * control, Theil-Sen robust median slope, dense anchor-dropped subset, low/high
 * sub-ladder split) and found three of the four estimators land within +/-0.33 sigma of
 * the OLS value while the 4-rung high split reads -3.44 sigma on the tight full-ladder
 * scale but only -0.44% relative, covered by its own 15x-looser band. This leaf reshapes
 * the five p estimates (control + 4 independent) into one chart-ready series with an
 * SE(p) 1-sigma band around the reference p, so the "estimator-robust within the OLS
 * band" reading can be seen at a glance.
 *
 * No re-derivation: every p, A, sigma-deviation, and SE(p) value is copied verbatim
 * from imp-96999. The only new arithmetic here is reshaping into plot-ready arrays and
 * computing the +/-1-sigma band bounds (refP +/- seP) for chart overlay.
 *
 * @see imp-96999-route-m-lammin-exponent-crossvalidation.js (the four-estimator cross-validation this leaf reshapes)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (the lam_min power law being cross-validated)
 *
 * Ticket: imp-97021 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no
 * bound; NO QED. No self-executing assertion throw (per the imp-96294/imp-96819
 * convention) -- values are validated below via a plain exported check object
 * instead of an import-time throw.
 */

import {
  IMP96999_REF,
  IMP96999_FULL_OLS,
  IMP96999_ESTIMATORS,
  IMP96999_VERDICT,
} from './imp-96999-route-m-lammin-exponent-crossvalidation.js';

// FINDING (estimator comparison): one row per estimator (control + 4 independent),
// each carrying its own sigma-deviation from the full-OLS p, for a dot/bar chart.
export const IMP97021_ESTIMATOR_SERIES = Object.freeze([
  Object.freeze({
    estimator: IMP96999_FULL_OLS.estimator,
    p: IMP96999_FULL_OLS.p,
    sePOverP: IMP96999_FULL_OLS.sePOverP,
    devSigmaVsFull: 0,
    pRelVsRef: IMP96999_FULL_OLS.pRelVsRef,
    isControl: true,
  }),
  ...IMP96999_ESTIMATORS.map((e) => Object.freeze({
    estimator: e.estimator,
    p: e.p,
    sePOverP: e.sePOverP ?? null,
    devSigmaVsFull: e.devSigmaVsFull,
    pRelVsRef: e.pRelVsRef,
    isControl: false,
  })),
]);

// SE(p) 1-sigma band around the reference p, for a chart overlay band/whisker.
export const IMP97021_SIGMA_BAND = Object.freeze({
  refP: IMP96999_REF.p,
  seP: IMP96999_FULL_OLS.seP,
  sePOverP: IMP96999_FULL_OLS.sePOverP,
  lo1Sigma: IMP96999_REF.p - IMP96999_FULL_OLS.seP,
  hi1Sigma: IMP96999_REF.p + IMP96999_FULL_OLS.seP,
});

export const IMP97021_LANDMARKS = Object.freeze({
  refP: IMP96999_REF.p,
  refA: IMP96999_REF.A,
  estimatorCount: IMP97021_ESTIMATOR_SERIES.length,
  worstEstimator: IMP97021_ESTIMATOR_SERIES.reduce(
    (worst, e) => (Math.abs(e.pRelVsRef) > Math.abs(worst.pRelVsRef) ? e : worst),
    IMP97021_ESTIMATOR_SERIES[0],
  ).estimator,
  worstEstimatorRelDevVsRef: IMP96999_VERDICT.worstEstimatorRelDevVsRef,
  exponentEstimatorRobust: IMP96999_VERDICT.exponentEstimatorRobust,
});

export const IMP97021_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every p, A, sigma-' +
  'deviation, and SE(p) value plotted here is copied verbatim from imp-96999. This is an ' +
  'ESTIMATOR cross-validation on the same committed imp-96428 lam_min rungs, not a genuinely ' +
  'independent second-basis Gram rebuild (IMP96999_SUBGAP stays open). Measurement/reshaping ' +
  'only: changes no bound and establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP97021_VALIDATION = Object.freeze({
  rowCountIsFive: IMP97021_ESTIMATOR_SERIES.length === 5,
  controlRowIsFirst: IMP97021_ESTIMATOR_SERIES[0].isControl === true,
  bandBracketsRefP:
    IMP97021_SIGMA_BAND.lo1Sigma < IMP97021_SIGMA_BAND.refP &&
    IMP97021_SIGMA_BAND.refP < IMP97021_SIGMA_BAND.hi1Sigma,
  threeOfFourWithinOneSigma:
    IMP97021_ESTIMATOR_SERIES.filter((e) => !e.isControl && Math.abs(e.devSigmaVsFull) <= 1).length === 3,
});

export default {
  estimatorSeries: IMP97021_ESTIMATOR_SERIES,
  sigmaBand: IMP97021_SIGMA_BAND,
  landmarks: IMP97021_LANDMARKS,
  banner: IMP97021_HONEST_BANNER,
  validation: IMP97021_VALIDATION,
};
