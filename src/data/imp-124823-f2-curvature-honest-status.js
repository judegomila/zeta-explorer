/**
 * @module imp-124823-f2-curvature-honest-status
 * @fileoverview imp-124823 -- HONEST-STATUS NOTE restating, standalone, the imp-124772 (F2) finding that the
 *   full 10-floor OLS fit of the knee floor-elasticity p_knee leaves a faint, sign-symmetric residual
 *   curvature: negative at both floor extremes (0.5x, 5x), positive in the interior, forming a shallow
 *   concave-up U of ~3e-3 decades. That curvature is REAL (it survives the fit) but is ~100x smaller
 *   than the ~0.72-decade exponent gap separating the certified p_knee_lsq ~ -2.106 from the -1.375
 *   interior-peak alternative, so it does not threaten the ~ -2 identification. Documentation only:
 *   re-exports the imp-124772 (F2) residual pattern verbatim, no new numerics, no bound moves, NO QED.
 *
 * @see imp-124772-knee-floor-elasticity-multifloor-fit.js (source measurement: F2 residual pattern + the gap)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (the two-floor chord p_knee ~ -2.099 this certifies)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js (the -1.375 interior-peak contrast)
 *
 * Ticket: imp-124823 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * no refereed bound is changed; RH open; NO QED.
 */

import {
  IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT as SRC,
} from './imp-124772-knee-floor-elasticity-multifloor-fit.js';

const RESIDUAL_DECADES = SRC.fit.residuals.map((r) => r.residualDecades);
const MAX_ABS_RESIDUAL_DECADES = SRC.fit.maxAbsResidualDecades;
const GAP_TO_INTERIOR_PEAK = SRC.exponentComparison.gap_to_interior_peak;
const RATIO_GAP_TO_RESIDUAL = +(GAP_TO_INTERIOR_PEAK / MAX_ABS_RESIDUAL_DECADES).toFixed(1);

export const IMP124823_F2_CURVATURE_HONEST_STATUS = Object.freeze({
  ticket: 'imp-124823',
  question:
    'the imp-124772 full 10-floor OLS fit certified p_knee_lsq ~ -2.106 with a clean power law (R^2 ~ ' +
    '0.99999) -- but its F2 finding reported a faint residual curvature. Is that curvature a real, ' +
    'measurable deviation, and if so, does it threaten the -2 identification against the -1.375 ' +
    'interior-peak alternative?',
  answer:
    'The curvature is real: the OLS residuals form a shallow, sign-symmetric U -- negative at the ' +
    '0.5x and 5x floor extremes, positive in the interior -- a concave-up deviation of ' +
    `~${MAX_ABS_RESIDUAL_DECADES} decades at its largest. It is present (not a numerical artifact of the ` +
    'fit) but it is ~100x smaller than the ~0.72-decade gap separating p_knee_lsq ~ -2.106 from the ' +
    '-1.375 interior-peak alternative, so it cannot flip that identification; the clean dimensional ' +
    'N* ~ E_trunc^(-2) scaling from imp-124772 stands unchanged.',
  residualDecades: RESIDUAL_DECADES,
  maxAbsResidualDecades: MAX_ABS_RESIDUAL_DECADES,
  gapToInteriorPeak: GAP_TO_INTERIOR_PEAK,
  ratioGapToResidual: RATIO_GAP_TO_RESIDUAL, // ~ how many times smaller the curvature is than the exponent gap
  curvatureIsReal: true,
  curvatureThreatensIdentification: false,
  anyBoundMoved: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP124823_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. This note restates, standalone, the imp-124772 F2 ' +
  'residual-curvature finding so it is independently checkable: changes no bound; establishes no operator ' +
  'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.';

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    Array.isArray(IMP124823_F2_CURVATURE_HONEST_STATUS.residualDecades) &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.residualDecades.length === 10 &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.residualDecades[0] < 0 &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.residualDecades[IMP124823_F2_CURVATURE_HONEST_STATUS.residualDecades.length - 1] < 0 &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.maxAbsResidualDecades < 1e-2 &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.gapToInteriorPeak > 0.5 &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.ratioGapToResidual > 50 &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.curvatureIsReal === true &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.curvatureThreatensIdentification === false &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.anyBoundMoved === false &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.measurementOnly === true &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.isRigorous === false &&
    IMP124823_F2_CURVATURE_HONEST_STATUS.qed === false &&
    /NO QED/.test(IMP124823_HONEST_BANNER) &&
    /imp-3066 K_a >= 0 untouched/.test(IMP124823_HONEST_BANNER) &&
    /changes no bound/.test(IMP124823_HONEST_BANNER) &&
    /refereed bound is changed/i.test(IMP124823_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-124823-f2-curvature-honest-status assertion FAILED: the F2 residual curvature must be a real, ' +
      'sign-symmetric U (negative at both floor extremes) at least 50x smaller than the exponent gap to ' +
      'the interior-peak alternative.'
  );
}

export default IMP124823_F2_CURVATURE_HONEST_STATUS;
