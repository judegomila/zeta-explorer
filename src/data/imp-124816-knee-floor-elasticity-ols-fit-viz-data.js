/**
 * @module imp-124816-knee-floor-elasticity-ols-fit-viz-data
 *
 * imp-124816: import-light viz-data leaf charting the imp-124772 full 10-floor p_knee OLS fit --
 * the (log10 E_trunc, log10 N*) scatter across the imp-33708 0.5x..5x floor ladder, the fitted
 * regression line (slope = p_knee_lsq ~ -2.106), and the sign-symmetric residual U (~3e-3 decades,
 * negative at both floor extremes, positive in the interior). Reuses the frozen
 * IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT fit verbatim plus the imp-97822 floorSweep raw
 * points it was fit from (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124772-knee-floor-elasticity-multifloor-fit.js (source fit: slope, residuals)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (source floorSweep raw points)
 */

import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';
import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';

const { fit } = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT;
const RESIDUAL_BY_FLOOR = new Map(fit.residuals.map((r) => [r.floorFactor, r.residualDecades]));

// Raw (log10 E_trunc, log10 N*) scatter points the OLS line was fit through.
const SWEEP = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.floorSweep.filter((r) => r.log10Nstar !== null);

export const IMP124816_SCATTER = Object.freeze(
  SWEEP.map((r) => {
    const log10Etrunc = +Math.log10(r.E_trunc).toFixed(6);
    const fittedLog10Nstar = +(fit.slope * log10Etrunc + fit.intercept).toFixed(6);
    return Object.freeze({
      floorFactor: r.floorFactor,
      log10Etrunc,
      log10Nstar: r.log10Nstar,
      fittedLog10Nstar,
      residualDecades: RESIDUAL_BY_FLOOR.get(r.floorFactor),
    });
  }),
);

// Two-point regression line (for a chart overlay) spanning the scatter's x-range.
const XS = IMP124816_SCATTER.map((r) => r.log10Etrunc);
const X_MIN = Math.min(...XS);
const X_MAX = Math.max(...XS);
export const IMP124816_REGRESSION_LINE = Object.freeze([
  Object.freeze({ log10Etrunc: X_MIN, log10Nstar: +(fit.slope * X_MIN + fit.intercept).toFixed(6) }),
  Object.freeze({ log10Etrunc: X_MAX, log10Nstar: +(fit.slope * X_MAX + fit.intercept).toFixed(6) }),
]);

export const IMP124816_SUMMARY = Object.freeze({
  pKneeLsq: fit.slope, // ~ -2.106
  r2: fit.r2, // ~0.99999
  rmsResidualDecades: fit.rmsResidualDecades, // ~1.6e-3
  maxAbsResidualDecades: fit.maxAbsResidualDecades, // ~3.0e-3
  law:
    `The imp-124772 full 10-floor OLS fit of log10 N* on log10 E_trunc has slope p_knee_lsq ~ ${fit.slope} `
    + `(R^2 ~ ${fit.r2}), certifying the imp-97822 two-floor chord ~${IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.twoFloorExponent} `
    + `clean power law. The residuals form a sign-symmetric U (~${fit.maxAbsResidualDecades} decades max-abs): `
    + 'negative at both floor extremes (0.5x, 5x) and positive in the interior.',
  reading:
    `scatter: ${IMP124816_SCATTER.map((r) => `${r.floorFactor}x->(${r.log10Etrunc},${r.log10Nstar})`).join(', ')}; `
    + `residuals (decades): ${IMP124816_SCATTER.map((r) => `${r.floorFactor}x:${r.residualDecades}`).join(', ')}.`,
  verdict:
    'Presentation only: every scatter point and residual is reused verbatim from imp-124772/imp-97822 '
    + '(a measurement, not a derivation), reshaped into a scatter-plus-regression-line series and a '
    + 'residual-vs-floor series for a chart; no new computation. Measurement / sensitivity only on the '
    + 'inherited imp-3220/imp-3406 extrapolation surrogate, not a rigorous asymptotic. Changes no bound; '
    + 'establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 '
    + 'untouched; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124816_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124816-ten-scatter-points',
    description: 'one scatter point per imp-97822 resolved floor factor (all ten floors)',
    holds: () => IMP124816_SCATTER.length === 10,
  },
  {
    id: 'imp124816-residuals-match-source-fit',
    description: 'every scatter residual matches the imp-124772 fit residual for the same floor',
    holds: () => IMP124816_SCATTER.every((r) => r.residualDecades === RESIDUAL_BY_FLOOR.get(r.floorFactor)),
  },
  {
    id: 'imp124816-fitted-values-on-regression-line',
    description: 'fittedLog10Nstar = slope * log10Etrunc + intercept to within float rounding',
    holds: () =>
      IMP124816_SCATTER.every(
        (r) => Math.abs(r.fittedLog10Nstar - (fit.slope * r.log10Etrunc + fit.intercept)) < 1e-4,
      ),
  },
  {
    id: 'imp124816-residual-sign-symmetric-u',
    description: 'residuals negative at both floor extremes (0.5x, 5x) and positive mid-ladder',
    holds: () => {
      const first = IMP124816_SCATTER[0].residualDecades;
      const last = IMP124816_SCATTER[IMP124816_SCATTER.length - 1].residualDecades;
      const mid = IMP124816_SCATTER[Math.floor(IMP124816_SCATTER.length / 2)].residualDecades;
      return first < 0 && last < 0 && mid > 0;
    },
  },
  {
    id: 'imp124816-regression-line-two-endpoints',
    description: 'the regression-line overlay has exactly two endpoints spanning the scatter x-range',
    holds: () =>
      IMP124816_REGRESSION_LINE.length === 2 &&
      IMP124816_REGRESSION_LINE[0].log10Etrunc === X_MIN &&
      IMP124816_REGRESSION_LINE[1].log10Etrunc === X_MAX,
  },
  {
    id: 'imp124816-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP124816_SUMMARY.verdict) && /NO QED/.test(IMP124816_SUMMARY.verdict),
  },
];

for (const assertion of IMP124816_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124816 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124816_SUMMARY;
