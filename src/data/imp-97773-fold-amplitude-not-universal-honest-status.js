/**
 * @module imp-97773-fold-amplitude-not-universal-honest-status
 * @fileoverview imp-97773 -- HONEST-STATUS BANNER restating, as a standalone directly-citable
 *   note, that the imp-97725 square-root-fold amplitude K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx))
 *   is NOT a universal constant. Two independent perturbation axes both move K:
 *   (1) FLOOR-dependent (imp-97743): rescaling the E_trunc floor by 0.5x..5.0x moves K
 *       monotonically from 0.363295 to 0.606688 (a ~1.67x span, exponent ~+0.221);
 *   (2) HEIGHT-dependent (imp-97735): walking the denominator phi_xx along a height ladder
 *       N = 1e6..1e32 shows it drifts monotonically downward by a factor ~1449 with no
 *       plateau, so the amplitude structure has no height-independent value away from the
 *       single interior peak. K = 0.423330 is therefore a numerical property of the
 *       inherited imp-3406/imp-33582 surrogate curvature evaluated at ONE floor and ONE
 *       height, not a dimensionless universal constant. Documentation only: no new
 *       numerics, no bound moves. NO QED.
 *
 * @see imp-97725-fold-amplitude-analytic-pin.js (source: K structure + the honest sub-gap)
 * @see imp-97743-fold-amplitude-etrunc-floor-sensitivity.js (floor-dependence measurement)
 * @see imp-97735-fold-amplitude-height-ladder-drift.js (height-dependence measurement)
 *
 * Ticket: imp-97773 (ux, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda
 * moves; no refereed bound is changed; RH open; NO QED.
 */

import { IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN } from './imp-97725-fold-amplitude-analytic-pin.js';
import { IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY } from './imp-97743-fold-amplitude-etrunc-floor-sensitivity.js';
import { IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT } from './imp-97735-fold-amplitude-height-ladder-drift.js';

export const IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97773',
  question:
    'Is the imp-97725 fold amplitude K = 0.423330 a universal constant, or does it depend on the ' +
    'E_trunc floor and the reference height at which it is evaluated?',
  answer:
    'K is NOT a universal constant. It is floor-dependent (imp-97743): rescaling the E_trunc floor ' +
    'by 0.5x..5.0x moves K monotonically from 0.363295 to 0.606688, a ~1.67x span with a shallow ' +
    'positive scaling exponent ~+0.221. It is also height-dependent (imp-97735): the denominator ' +
    'phi_xx drifts monotonically downward by a factor ~1449 across a height ladder N = 1e6..1e32 ' +
    'with no plateau, so the amplitude structure has no height-independent limit away from the ' +
    'single interior peak. K = 0.423330 is a numerical property of the surrogate curvature at ONE ' +
    'floor (E_trunc = 3.06e-5) and ONE height (N_peak ~ 9.22e5), not a dimensionless universal number.',
  floorSensitivity: {
    K_base_1_0x: IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.drift.K_base_1_0x, // ~0.423330
    K_min_0_5x: IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.drift.K_min_0_5x, // ~0.363295
    K_max_5x: IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.drift.K_max_5x, // ~0.606688
    fullSweepFactor: IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.drift.K_full_sweep_factor, // ~1.67
    scalingExponentQ: IMP97743_FOLD_AMPLITUDE_ETRUNC_FLOOR_SENSITIVITY.drift.K_scaling_exponent_q, // ~+0.221
  },
  heightSensitivity: {
    phiXxAtPeak: IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT.anchor.phi_xx_peak, // ~1.339604e-1
    phiXxDeepestN1e32: IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT.drift.phi_xx_deepest_N1e32, // ~9.42e-5
    driftFactor1e6to1e32: IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT.drift.phi_xx_drift_factor_1e6_to_1e32, // ~1449
    monotoneDecreasingNoPlateau: IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT.drift.phi_xx_monotone_decreasing_along_ladder, // true
  },
  KAtPeakBaseline: IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN.amplitude.K_from_A, // ~0.423330
  isUniversalConstant: false,
  bothAxesMoveK: true,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS.isUniversalConstant === false &&
    IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS.bothAxesMoveK === true &&
    IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS.floorSensitivity.fullSweepFactor > 1.5 &&
    IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS.heightSensitivity.driftFactor1e6to1e32 > 1000 &&
    IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS.heightSensitivity.monotoneDecreasingNoPlateau === true &&
    IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS.measurementOnly === true &&
    IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS.isRigorous === false &&
    IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS.qed === false &&
    /NO QED/.test(IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN.verdict) &&
    /SUB-GAP/.test(IMP97725_FOLD_AMPLITUDE_ANALYTIC_PIN.verdict)
  )
) {
  throw new Error(
    'imp-97773-fold-amplitude-not-universal-honest-status assertion FAILED: the floor- and ' +
      'height-dependence of the imp-97725 fold amplitude K must both hold as recorded.'
  );
}

export default IMP97773_FOLD_AMPLITUDE_NOT_UNIVERSAL_HONEST_STATUS;
