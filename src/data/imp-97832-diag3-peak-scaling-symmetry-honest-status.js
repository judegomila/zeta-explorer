/**
 * @module imp-97832-diag3-peak-scaling-symmetry-honest-status
 * @fileoverview imp-97832 -- HONEST-STATUS NOTE restating, standalone, the imp-97721 result that the
 *   exact three-axis cancellation DIAG3 = E_CC + E_ET + E_CF == 0 survives the imp-97662
 *   individual-elasticity square-root fold at the imp-97520 L1 interior sigma peak
 *   (sigma_max ~ 0.949429, N_peak ~ 9.22e5). imp-97721 straddled the peak on BOTH the upslope and
 *   downslope arms and found the reconstructed single-axis elasticities E_CC/E_ET/E_CF individually
 *   DIVERGE (shared kernel |K| grows ~sqrt(10) per decade of gap, the imp-97662 fold) yet their sum
 *   stays machine-zero, and the DIRECT diagonal (scaling) perturbation of DIAG3 stays at the
 *   bisection floor on both arms. The reason is structural, not a transversality artifact of the
 *   downslope landmarks: sigma = E_coll/E_N is degree-0 homogeneous in the amplitude triple
 *   (c, e, f) (imp-97644/imp-97689 Euler additivity), so the entire sigma curve -- peak included --
 *   is pointwise invariant under diagonal rescaling (c,e,f) -> lambda*(c,e,f), the peak-crossing
 *   landmark never moves, and DIAG3 == 0 holds identically at every level set, including where each
 *   individual elasticity blows up. Documentation only: re-exports the imp-97721 verdict verbatim,
 *   no new numerics, no bound moves, NO QED.
 *
 * @see imp-97721-diag3-peak-upslope-crossvalidation.js (source measurement: peak straddle, both arms)
 * @see imp-97662-cc-elasticity-peak-divergence.js (individual-elasticity square-root fold at the peak)
 * @see imp-97644-three-axis-additivity-flow-prefactor.js (DIAG3 == 0 Euler additivity, transversal case)
 *
 * Ticket: imp-97832 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda
 * moves; no refereed bound is changed; RH open; NO QED.
 */

import { IMP97721_DIAG3_PEAK_UPSLOPE_CROSSVALIDATION } from './imp-97721-diag3-peak-upslope-crossvalidation.js';

const SRC = IMP97721_DIAG3_PEAK_UPSLOPE_CROSSVALIDATION;

export const IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97832',
  question:
    'does the exact three-axis cancellation DIAG3 = E_CC + E_ET + E_CF == 0 survive the imp-97662 ' +
    'square-root fold at the imp-97520 L1 interior sigma peak, where each individual crossing ' +
    'elasticity diverges -- and if so, is that a scaling symmetry or a transversality artifact of ' +
    'the downslope landmarks it was previously checked at?',
  answer:
    'It is a SCALING SYMMETRY, not a transversality artifact. imp-97721 straddled the peak ' +
    '(sigma_max ~ ' + SRC.peak.sigma_max + ', N_peak ~ ' + SRC.peak.N_peak + ') on both the upslope ' +
    'and downslope arms: the reconstructed single-axis elasticities E_CC/E_ET/E_CF individually ' +
    'diverge as the shared kernel |K| grows ~sqrt(10) per decade of gap (decade ratios ' +
    SRC.kernel_decade_ratios_upslope.join(', ') + ', the imp-97662 fold), yet their reconstructed ' +
    'sum RECON_SUM = K*NUM stays machine-zero, and the DIRECT diagonal (scaling) perturbation of ' +
    'DIAG3 stays at the bisection floor on both arms. This holds because sigma = E_coll/E_N is ' +
    'degree-0 homogeneous in the amplitude triple (c, e, f) (diagonal-scaling invariance ' +
    SRC.peak.sigma_diagonal_scaling_invariance_at_peak + ' at the peak): the whole sigma curve -- ' +
    'peak included -- is pointwise invariant under (c,e,f) -> lambda*(c,e,f), so the landmark never ' +
    'moves and DIAG3 == 0 identically, at every level set, whether or not each individual ' +
    'elasticity blows up. The summed-triple direct (each axis perturbed separately) is O(eps^2) but ' +
    'its coefficient itself diverges near the fold, so it is the diagonal perturbation -- not the ' +
    'summed-triple direct -- that is the robust instrument at the fold.',
  peakSigmaMax: SRC.peak.sigma_max,
  peakN: SRC.peak.N_peak,
  sigmaDiagonalScalingInvarianceAtPeak: SRC.peak.sigma_diagonal_scaling_invariance_at_peak,
  kernelDecadeRatiosUpslope: SRC.kernel_decade_ratios_upslope,
  maxAbsReconSum: Math.max(
    ...SRC.upslopeLadder.map((r) => Math.abs(r.RECON_SUM)),
    ...SRC.downslopeLadder.map((r) => Math.abs(r.RECON_SUM))
  ),
  maxAbsDiag3Diagonal: Math.max(
    ...SRC.upslopeLadder.map((r) => Math.abs(r.DIAG3_diagonal)),
    ...SRC.downslopeLadder.map((r) => Math.abs(r.DIAG3_diagonal))
  ),
  cancellationIsScalingSymmetry: true,
  cancellationIsTransversalityArtifact: false,
  survivesSquareRootFold: true,
  anyBoundMoved: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.cancellationIsScalingSymmetry === true &&
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.cancellationIsTransversalityArtifact === false &&
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.survivesSquareRootFold === true &&
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.sigmaDiagonalScalingInvarianceAtPeak < 1e-13 &&
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.maxAbsReconSum < 1e-12 &&
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.maxAbsDiag3Diagonal < 1e-6 &&
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.anyBoundMoved === false &&
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.measurementOnly === true &&
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.isRigorous === false &&
    IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97832-diag3-peak-scaling-symmetry-honest-status assertion FAILED: the peak-fold DIAG3 ' +
      'cancellation must record as a scaling symmetry that survives the square-root fold, with the ' +
      'reconstructed sum and direct diagonal perturbation both at their measured machine floors.'
  );
}

export default IMP97832_DIAG3_PEAK_SCALING_SYMMETRY_HONEST_STATUS;
