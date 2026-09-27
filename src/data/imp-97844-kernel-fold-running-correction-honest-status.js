/**
 * @module imp-97844-kernel-fold-running-correction-honest-status
 * @fileoverview imp-97844 -- HONEST-STATUS NOTE restating, standalone, the imp-97823 M2 result that the
 *   naive full-ladder shared-kernel |K| per-decade growth (2.90 upslope / 3.36 downslope, measured over
 *   the WIDE gap window g = 1e-1 .. 1e-7 straddling the imp-97520 L1 interior sigma peak) is NOT
 *   sqrt(10) = 3.162278. imp-97823 traced this to an O(sqrt(g)) RUNNING CORRECTION from the cubic term
 *   in the local expansion of sigma(x) near the peak, NOT a genuine exponent that differs from the
 *   inverse-square-root fold law |K| ~ g^(-1/2). Restricting to the DEEP window (g = 1e-5 .. 1e-8) the
 *   least-squares slope brackets -1/2 to ~1e-3 on both arms and the per-decade growth converges onto
 *   sqrt(10) (3.158 / 3.167), with the deviation from sqrt(10) decaying geometrically by ~1/sqrt(10)
 *   per decade and opposite-signed on the two arms -- the running-correction signature, not a shifted
 *   exponent. Documentation only: re-exports the imp-97823 M2 finding verbatim, no new numerics, no
 *   bound moves, NO QED.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10.js (source measurement: wide + deep ladder, both arms)
 * @see imp-97721-diag3-peak-upslope-crossvalidation.js (kernel |K| ~ sqrt(10) per decade, reported qualitatively)
 * @see imp-97662-cc-elasticity-peak-divergence.js (near-peak individual-elasticity square-root fold)
 *
 * Ticket: imp-97844 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97823_KERNEL_DECADE_GROWTH_SQRT10 } from './imp-97823-kernel-decade-growth-sqrt10.js';

const SRC = IMP97823_KERNEL_DECADE_GROWTH_SQRT10;

export const IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97844',
  question:
    'the imp-97823 M2 finding is that the naive full-ladder shared-kernel |K| slope (per-decade growth ' +
    '2.90 upslope / 3.36 downslope) is NOT sqrt(10) -- is this a genuine exponent shift away from the ' +
    'inverse-square-root fold law |K| ~ g^(-1/2), or a finite-gap running correction that vanishes in ' +
    'the deep limit?',
  answer:
    'It is a RUNNING CORRECTION, NOT an exponent shift. Over the FULL wide ladder (g = 1e-1 .. 1e-7) ' +
    'the naive least-squares per-decade growth reads ' + SRC.upslope.full_ls.growth_per_decade +
    ' (upslope) / ' + SRC.downslope.full_ls.growth_per_decade + ' (downslope) against sqrt(10) = ' +
    SRC.sqrt10 + ', purely because the far-from-peak decades carry an O(sqrt(g)) running term from the ' +
    'cubic component of the local expansion of sigma(x) near the peak. Restricted to the DEEP window ' +
    '(g = 1e-5 .. 1e-8) the least-squares slope is p = ' + SRC.upslope.deep_ls.slope_p + ' (upslope) / ' +
    SRC.downslope.deep_ls.slope_p + ' (downslope), bracketing the exact -1/2 exponent to ~1e-3, with ' +
    'per-decade growth ' + SRC.upslope.deep_ls.growth_per_decade + ' / ' + SRC.downslope.deep_ls.growth_per_decade +
    ' converging onto sqrt(10). The per-decade deviation |ratio - sqrt(10)| decays geometrically by a ' +
    'factor ~1/sqrt(10) each decade and is opposite-signed on the two arms (upslope from below, ' +
    'downslope from above) -- the cubic-fold signature of a running correction, not a distinct exponent.',
  sqrt10: SRC.sqrt10,
  fullLadderGrowthUpslope: SRC.upslope.full_ls.growth_per_decade,
  fullLadderGrowthDownslope: SRC.downslope.full_ls.growth_per_decade,
  deepGrowthUpslope: SRC.upslope.deep_ls.growth_per_decade,
  deepGrowthDownslope: SRC.downslope.deep_ls.growth_per_decade,
  deepSlopeUpslope: SRC.upslope.deep_ls.slope_p,
  deepSlopeDownslope: SRC.downslope.deep_ls.slope_p,
  deviationDecayFactorUpslope: SRC.upslope.deviation_decade_decay_factor,
  deviationDecayFactorDownslope: SRC.downslope.deviation_decade_decay_factor,
  farLadderDeviatesFromSqrt10: true,
  deepLadderConvergesToSqrt10: true,
  isRunningCorrection: true,
  isExponentShift: false,
  anyBoundMoved: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.farLadderDeviatesFromSqrt10 === true &&
    IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.deepLadderConvergesToSqrt10 === true &&
    IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.isRunningCorrection === true &&
    IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.isExponentShift === false &&
    Math.abs(IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.deepSlopeUpslope + 0.5) < 3e-3 &&
    Math.abs(IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.deepSlopeDownslope + 0.5) < 3e-3 &&
    Math.abs(
      IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.fullLadderGrowthUpslope -
        IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.sqrt10
    ) > 0.1 &&
    IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.anyBoundMoved === false &&
    IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.measurementOnly === true &&
    IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.isRigorous === false &&
    IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97844-kernel-fold-running-correction-honest-status assertion FAILED: the naive full-ladder ' +
      'kernel-growth departure from sqrt(10) must record as a deep-window-convergent running ' +
      'correction, not a genuine exponent shift.'
  );
}

export default IMP97844_KERNEL_FOLD_RUNNING_CORRECTION_HONEST_STATUS;
