/**
 * @module imp-124857-knee-elasticity-locator-comparison-viz-data
 *
 * imp-124857: import-light viz-data leaf charting the imp-124814 fresh-locator knee
 * floor-elasticities -- exponent-curvature p_knee ~ -2.106 vs the structurally different
 * ramp-inflection p_knee ~ -2.073 -- alongside the imp-33684 interior-peak exponent ~ -1.375
 * as a contrast band. Reuses IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO and
 * IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY verbatim (no re-derivation, no new
 * computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-124814-knee-floor-elasticity-fresh-locator-repro.js (fresh-locator reproduction, both knee slopes)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js (interior-peak floor exponent ~ -1.375, the softer contrast)
 */

import { IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO } from './imp-124814-knee-floor-elasticity-fresh-locator-repro.js';
import { IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY } from './imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js';

const { pKneeFreshExpCurvature, pKneeFreshRampInflection, comparison, verdict } =
  IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO;
const INTERIOR_PEAK_EXPONENT = IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.scalingExponent;

// One bar per locator/exponent, ordered exponent-curvature -> ramp-inflection -> interior-peak contrast.
export const IMP124857_ELASTICITY_ROWS = Object.freeze([
  Object.freeze({
    key: 'exp-curvature',
    label: 'Fresh exponent-curvature knee',
    exponent: pKneeFreshExpCurvature,
    r2: comparison.fresh_exp_curvature_r2,
    isContrastBand: false,
  }),
  Object.freeze({
    key: 'ramp-inflection',
    label: 'Fresh ramp-inflection knee',
    exponent: pKneeFreshRampInflection,
    r2: null,
    isContrastBand: false,
  }),
  Object.freeze({
    key: 'interior-peak',
    label: 'imp-33684 interior-peak (contrast)',
    exponent: INTERIOR_PEAK_EXPONENT,
    r2: null,
    isContrastBand: true,
  }),
]);

export const IMP124857_SUMMARY = Object.freeze({
  reading:
    'Two structurally different fresh knee locators both land in the clean dimensional ~-2 ' +
    `band: exponent-curvature ${pKneeFreshExpCurvature}, ramp-inflection ${pKneeFreshRampInflection} ` +
    `(within ${comparison.delta_ramp_vs_exp_curvature} of each other). The imp-33684 interior-peak ` +
    `floor-elasticity ${INTERIOR_PEAK_EXPONENT} sits well off that band -- a softer, distinct scaling ` +
    'regime for the interior maximum versus the far-tail knee.',
  deltaBetweenLocators: comparison.delta_ramp_vs_exp_curvature,
  verdict,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124857_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124857-three-rows',
    description: 'exactly three elasticity rows: two fresh locators plus the interior-peak contrast',
    holds: () => IMP124857_ELASTICITY_ROWS.length === 3,
  },
  {
    id: 'imp124857-two-locators-agree-in-minus-2-band',
    description: 'both fresh locator exponents lie in (-2.2, -1.9)',
    holds: () =>
      IMP124857_ELASTICITY_ROWS[0].exponent < -1.9 &&
      IMP124857_ELASTICITY_ROWS[0].exponent > -2.2 &&
      IMP124857_ELASTICITY_ROWS[1].exponent < -1.9 &&
      IMP124857_ELASTICITY_ROWS[1].exponent > -2.2,
  },
  {
    id: 'imp124857-contrast-band-is-distinct',
    description: 'the imp-33684 interior-peak exponent is flagged as the contrast band and sits outside the -2 band',
    holds: () =>
      IMP124857_ELASTICITY_ROWS[2].isContrastBand === true &&
      (IMP124857_ELASTICITY_ROWS[2].exponent > -1.9 || IMP124857_ELASTICITY_ROWS[2].exponent < -2.2),
  },
  {
    id: 'imp124857-values-match-sources-verbatim',
    description: 'row exponents are reused verbatim from imp-124814 and imp-33684',
    holds: () =>
      IMP124857_ELASTICITY_ROWS[0].exponent === pKneeFreshExpCurvature &&
      IMP124857_ELASTICITY_ROWS[1].exponent === pKneeFreshRampInflection &&
      IMP124857_ELASTICITY_ROWS[2].exponent === INTERIOR_PEAK_EXPONENT,
  },
  {
    id: 'imp124857-honesty-gate-no-qed',
    description: 'restated verdict carries the no-QED markers',
    holds: () => /NO QED/.test(IMP124857_SUMMARY.verdict) && /remains SOTA/.test(IMP124857_SUMMARY.verdict),
  },
];

for (const assertion of IMP124857_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124857 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}
