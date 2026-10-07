/**
 * @module imp-124880-pairratio-drift-slope-scatter-viz-data
 *
 * imp-124880 (ux, visualization leaf): a presentation-only scatter + fit-line panel for the imp-124850
 * P = D*|E_CF| + R drift-slope OLS fit. Every point, the fit slope/intercept, and their standard errors
 * are REUSED VERBATIM from imp-124850; this leaf only derives the two fit-line endpoints and a +/-2-sigma
 * envelope band (slope +/- 2*se, intercept +/- 2*se) for plotting, it does not re-run the regression.
 *
 * @see imp-124850-pairratio-drift-slope-fit (the OLS fit this leaf visualizes, reused verbatim)
 */

import { IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT } from './imp-124850-pairratio-drift-slope-fit.js';

export const IMP124880_SCATTER = IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT.ladder.map((r) => ({
  key: r.key,
  sigma: r.sigma,
  absE_CF: r.absE_CF,
  product: r.product_reldiff_times_absECF,
}));

const { drift_slope_D, drift_slope_se, roundoff_floor_R, roundoff_floor_se } = IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT.fit;

const xs = IMP124880_SCATTER.map((r) => r.absE_CF);
const X_MIN = Math.min(...xs);
const X_MAX = Math.max(...xs);

const fitLine = (x, slope, intercept) => slope * x + intercept;

// Central OLS fit line (reused verbatim slope/intercept from imp-124850).
export const IMP124880_FIT_LINE = [
  { absE_CF: X_MIN, product: fitLine(X_MIN, drift_slope_D, roundoff_floor_R) },
  { absE_CF: X_MAX, product: fitLine(X_MAX, drift_slope_D, roundoff_floor_R) },
];

// +/-2-sigma envelope: slope and intercept each shifted by 2 standard errors (reused verbatim se values).
export const IMP124880_ENVELOPE_UPPER = [
  { absE_CF: X_MIN, product: fitLine(X_MIN, drift_slope_D + 2 * drift_slope_se, roundoff_floor_R + 2 * roundoff_floor_se) },
  { absE_CF: X_MAX, product: fitLine(X_MAX, drift_slope_D + 2 * drift_slope_se, roundoff_floor_R + 2 * roundoff_floor_se) },
];
export const IMP124880_ENVELOPE_LOWER = [
  { absE_CF: X_MIN, product: fitLine(X_MIN, drift_slope_D - 2 * drift_slope_se, roundoff_floor_R - 2 * roundoff_floor_se) },
  { absE_CF: X_MAX, product: fitLine(X_MAX, drift_slope_D - 2 * drift_slope_se, roundoff_floor_R - 2 * roundoff_floor_se) },
];

export const IMP124880_FIT_SUMMARY = IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT.fit;
export const IMP124880_VERDICT = IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT.verdict;

export const IMP124880_ASSERTIONS = [
  {
    id: 'imp124880-scatter-matches-ladder-length',
    description: 'the scatter reuses all six imp-124850 ladder rungs verbatim',
    holds: () => IMP124880_SCATTER.length === 6,
  },
  {
    id: 'imp124880-fit-line-spans-data-range',
    description: 'the fit-line endpoints span the min/max |E_CF| of the scatter',
    holds: () =>
      IMP124880_FIT_LINE[0].absE_CF === X_MIN &&
      IMP124880_FIT_LINE[1].absE_CF === X_MAX &&
      X_MIN < X_MAX,
  },
  {
    id: 'imp124880-envelope-brackets-fit-line',
    description: 'at both endpoints the 2-sigma envelope upper bound exceeds the lower bound (non-degenerate band)',
    holds: () =>
      IMP124880_ENVELOPE_UPPER[0].product > IMP124880_ENVELOPE_LOWER[0].product &&
      IMP124880_ENVELOPE_UPPER[1].product > IMP124880_ENVELOPE_LOWER[1].product,
  },
];

for (const a of IMP124880_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124880-pairratio-drift-slope-scatter-viz-data assertion failed: ${a.id}`);
  }
}
