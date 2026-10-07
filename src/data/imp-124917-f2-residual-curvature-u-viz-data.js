/**
 * @module imp-124917-f2-residual-curvature-u-viz-data
 *
 * imp-124917 (ux): import-light viz-data leaf charting the imp-124823 / imp-124772 F2 residual-curvature
 * U-shape -- the per-floor OLS fit residuals (in decades of log10 N*) across the full imp-33708 ten-floor
 * ladder -- with the ~0.72-decade exponent gap to the imp-33684 interior-peak alternative overlaid as a
 * reference band. Reuses the frozen imp-124772 fit.residuals and imp-124823 gap/ratio fields verbatim
 * (no new computation).
 *
 * PRESENTATION ONLY. No new computation; changes no bound; RH open; NO QED.
 *
 * @see imp-124772-knee-floor-elasticity-multifloor-fit.js (source fit: residuals + exponent comparison)
 * @see imp-124823-f2-curvature-honest-status.js (honest-status restatement: gap/ratio fields reused here)
 */

import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';
import { IMP124823_F2_CURVATURE_HONEST_STATUS } from './imp-124823-f2-curvature-honest-status.js';

const FIT = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.fit;
const STATUS = IMP124823_F2_CURVATURE_HONEST_STATUS;

// One row per imp-33708 floor factor: the OLS residual (decades of log10 N*) forming the U-curve.
export const IMP124917_RESIDUAL_U_ROWS = Object.freeze(
  FIT.residuals.map((r) =>
    Object.freeze({
      floorFactor: r.floorFactor,
      residualDecades: r.residualDecades,
    })
  )
);

export const IMP124917_MAX_ABS_RESIDUAL_DECADES = STATUS.maxAbsResidualDecades; // ~3e-3
export const IMP124917_GAP_TO_INTERIOR_PEAK_DECADES = STATUS.gapToInteriorPeak; // ~0.72
export const IMP124917_RATIO_GAP_TO_RESIDUAL = STATUS.ratioGapToResidual; // ~100

// Reference overlay: the exponent-gap band dwarfs the U-curve (~100x), so it is exposed as a
// separate pair of horizontal reference lines rather than sharing the residual axis directly.
export const IMP124917_GAP_BAND = Object.freeze({
  lower: -IMP124917_GAP_TO_INTERIOR_PEAK_DECADES,
  upper: IMP124917_GAP_TO_INTERIOR_PEAK_DECADES,
  note:
    `the +/-${IMP124917_GAP_TO_INTERIOR_PEAK_DECADES}-decade band to the interior-peak alternative is ` +
    `~${IMP124917_RATIO_GAP_TO_RESIDUAL}x the U-curve's own max-abs residual ` +
    `(${IMP124917_MAX_ABS_RESIDUAL_DECADES} decades); plot on a secondary/log axis or as an inset to keep ` +
    'the U-shape legible.',
});

export const IMP124917_SUMMARY = Object.freeze({
  law:
    'The imp-124772 full ten-floor OLS fit of the knee floor-elasticity p_knee leaves a shallow, ' +
    'sign-symmetric concave-up residual U (negative at the 0.5x/5x floor extremes, positive in the ' +
    `interior), max-abs ${IMP124917_MAX_ABS_RESIDUAL_DECADES} decades -- ` +
    `~${IMP124917_RATIO_GAP_TO_RESIDUAL}x smaller than the ${IMP124917_GAP_TO_INTERIOR_PEAK_DECADES}-decade ` +
    'gap separating p_knee_lsq ~ -2.106 from the -1.375 interior-peak alternative.',
  reading: IMP124917_RESIDUAL_U_ROWS.map((r) => `factor=${r.floorFactor}: resid=${r.residualDecades}`).join(', '),
  verdict:
    'Presentation only: every residual row and the gap/ratio fields are reused verbatim from ' +
    'imp-124772/imp-124823 (measurements, not derivations); no new computation. Conditional-share ' +
    'curvature diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124917_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124917-ten-floor-rows',
    description: 'exactly ten floor-sweep residual rows (the imp-33708 {0.5..5} ladder)',
    holds: () => IMP124917_RESIDUAL_U_ROWS.length === 10,
  },
  {
    id: 'imp124917-sign-symmetric-u',
    description: 'residuals are negative at both floor extremes and positive in the interior',
    holds: () => {
      const first = IMP124917_RESIDUAL_U_ROWS[0].residualDecades;
      const last = IMP124917_RESIDUAL_U_ROWS[IMP124917_RESIDUAL_U_ROWS.length - 1].residualDecades;
      const mid = IMP124917_RESIDUAL_U_ROWS[Math.floor(IMP124917_RESIDUAL_U_ROWS.length / 2)].residualDecades;
      return first < 0 && last < 0 && mid > 0;
    },
  },
  {
    id: 'imp124917-gap-band-matches-source',
    description: 'the gap band bounds match the imp-124823 gapToInteriorPeak field exactly',
    holds: () =>
      IMP124917_GAP_BAND.upper === STATUS.gapToInteriorPeak &&
      IMP124917_GAP_BAND.lower === -STATUS.gapToInteriorPeak,
  },
  {
    id: 'imp124917-gap-dwarfs-residual',
    description: 'the exponent gap is at least 50x the max-abs residual (imp-124823 ratio gate)',
    holds: () => IMP124917_RATIO_GAP_TO_RESIDUAL > 50,
  },
  {
    id: 'imp124917-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /changes no bound/.test(IMP124917_SUMMARY.verdict) && /NO QED/.test(IMP124917_SUMMARY.verdict),
  },
];

for (const assertion of IMP124917_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124917 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124917_SUMMARY;
