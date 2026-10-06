/**
 * @module imp-124841-knee-locator-comparison-viz-data
 *
 * imp-124841: import-light viz-data leaf comparing the imp-124814 fresh-locator knee floor-elasticities
 * against the imp-97822 imported two-floor chord and the imp-124772 reused-sweep certification. Five
 * p_knee readings, same sigma model (only the knee-locating numerics differ), land in one clean band:
 *   fresh exponent-curvature locator   ~ -2.1064   (imp-124814, independent grid)
 *   imp-124772 reused-sweep OLS        ~ -2.1065   (imported imp-97822 floorSweep array verbatim)
 *   imp-97822 imported two-floor chord ~ -2.099     (the original two-point fit)
 *   fresh ramp-inflection locator      ~ -2.073     (imp-124814, structurally different knee definition)
 * all five sigma-digits apart, and all five well clear of the imp-33684 softened interior-peak
 * contrast ~ -1.375. Reuses the imp-124814/imp-97822 exported comparison fields verbatim -- no new
 * computation.
 *
 * PRESENTATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound; no bound moves; NO QED.
 *
 * @see imp-124814-knee-floor-elasticity-fresh-locator-repro.js (IMP124814_..., fresh locators A/B)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (IMP97822_..., imported two-floor chord)
 */

import { IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO } from './imp-124814-knee-floor-elasticity-fresh-locator-repro.js';
import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';

const D814 = IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO;
const D822 = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY;

export const IMP124841_LOCATOR_BARS = Object.freeze([
  Object.freeze({
    key: 'fresh-exp-curvature',
    label: 'Fresh exponent-curvature (imp-124814)',
    pKnee: D814.pKneeFreshExpCurvature, // ~ -2.1064
    note: 'independent grid, no imported floorSweep',
  }),
  Object.freeze({
    key: 'reused-sweep-ols',
    label: 'Reused-sweep OLS (imp-124772)',
    pKnee: D814.comparison.imp124772_reused_sweep_slope, // ~ -2.106468
    note: 'OLS over the imp-97822 floorSweep array verbatim',
  }),
  Object.freeze({
    key: 'imported-two-floor-chord',
    label: 'Imported two-floor chord (imp-97822)',
    pKnee: D822.kneeFloorExponent, // ~ -2.099
    note: 'original two-point (0.5x/2x) fit',
  }),
  Object.freeze({
    key: 'fresh-ramp-inflection',
    label: 'Fresh ramp-inflection (imp-124814)',
    pKnee: D814.pKneeFreshRampInflection, // ~ -2.073
    note: 'structurally different knee definition',
  }),
  Object.freeze({
    key: 'interior-peak-contrast',
    label: 'Interior-peak contrast (imp-33684)',
    pKnee: D822.exponentComparison.imp33684_interior_peak_exponent, // ~ -1.375
    note: 'softer contrast, NOT a knee locator',
  }),
]);

export const IMP124841_SPREAD = Object.freeze({
  minAbsLocatorPKnee: Math.min(
    Math.abs(D814.pKneeFreshExpCurvature),
    Math.abs(D814.comparison.imp124772_reused_sweep_slope),
    Math.abs(D822.kneeFloorExponent),
    Math.abs(D814.pKneeFreshRampInflection)
  ),
  maxAbsLocatorPKnee: Math.max(
    Math.abs(D814.pKneeFreshExpCurvature),
    Math.abs(D814.comparison.imp124772_reused_sweep_slope),
    Math.abs(D822.kneeFloorExponent),
    Math.abs(D814.pKneeFreshRampInflection)
  ),
  deltaFreshVsImp124772: D814.comparison.delta_fresh_vs_imp124772, // ~2.2e-5
  deltaRampVsExpCurvature: D814.comparison.delta_ramp_vs_exp_curvature, // ~0.033
});

export const IMP124841_SUMMARY = Object.freeze({
  law:
    'Four independent ways of locating the sigma-ramp knee -- a fresh exponent-curvature locator on an '
    + 'independent grid, the imp-124772 OLS refit of the reused imp-97822 floorSweep, the original imp-97822 '
    + `two-floor chord, and a structurally different ramp-inflection locator -- all land in `
    + `[${IMP124841_SPREAD.minAbsLocatorPKnee.toFixed(3)}, ${IMP124841_SPREAD.maxAbsLocatorPKnee.toFixed(3)}] `
    + 'in magnitude, within 0.033 of each other, and all well clear of the imp-33684 softened '
    + 'interior-peak contrast (-1.375).',
  reading: IMP124841_LOCATOR_BARS.map((b) => `${b.label}: p_knee=${b.pKnee}`).join('; '),
  verdict:
    'Presentation only: every bar is read verbatim from the imp-124814/imp-97822 exported comparison '
    + 'fields; no new computation. Measurement/cross-validation on the inherited imp-3220/imp-3406 '
    + 'extrapolation, not a rigorous asymptotic; changes no bound; imp-3066 K_a >= 0 untouched; '
    + 'Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124841_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124841-five-bars',
    description: 'exactly five comparison bars',
    holds: () => IMP124841_LOCATOR_BARS.length === 5,
  },
  {
    id: 'imp124841-four-locators-clustered-near-minus-2',
    description: 'the four knee-locator p_knee values (excluding the interior-peak contrast) lie in [-2.2,-1.9]',
    holds: () =>
      IMP124841_LOCATOR_BARS.slice(0, 4).every((b) => b.pKnee < -1.9 && b.pKnee > -2.2),
  },
  {
    id: 'imp124841-interior-peak-is-the-outlier',
    description: 'the imp-33684 interior-peak contrast is the only bar outside [-2.2,-1.9]',
    holds: () => {
      const peak = IMP124841_LOCATOR_BARS[4].pKnee; // ~ -1.375
      return peak < -1.9 === false;
    },
  },
  {
    id: 'imp124841-fresh-reproduces-reused-sweep-tightly',
    description: 'fresh exponent-curvature matches imp-124772 reused-sweep slope to within 1e-3',
    holds: () => IMP124841_SPREAD.deltaFreshVsImp124772 < 1e-3,
  },
  {
    id: 'imp124841-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /changes no bound/.test(IMP124841_SUMMARY.verdict) && /NO QED/.test(IMP124841_SUMMARY.verdict),
  },
];

for (const assertion of IMP124841_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124841 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124841_SUMMARY;
