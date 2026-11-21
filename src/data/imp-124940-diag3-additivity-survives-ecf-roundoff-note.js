/**
 * @module imp-124940-diag3-additivity-survives-ecf-roundoff-note
 * @fileoverview imp-124940 -- STANDALONE REFERENCE NOTE answering a question left implicit by two prior
 *   findings: imp-124769 pins a landmark-bisection round-off floor that overtakes the DIRECT central-difference
 *   E_CF stencil past sigma_crit ~ 0.013 (at L6, errCF/|E_CF| explodes to ~1.4e-5, the stencil is noisy), while
 *   imp-124812 proves the three-axis additivity E_CC + E_ET + E_CF = 0 is EXACT algebra of the linear sigma =
 *   E_coll/E_N model (an Euler degree-0 homogeneity), machine-zero to ~9e-17. WHY does the exact identity survive
 *   at a landmark where the individual E_CF measurement is noise? Because the additivity is never computed from
 *   the noisy direct stencil in the first place: imp-124812's proof uses the CLOSED-FORM reconstructed elasticity
 *   csc = sigma(1-sigma) etc. and shows the shared crossing kernel K = -1/(N_L sigma_N) cancels out of the sum
 *   BEFORE any finite-difference step is taken -- K*(c sigma_c + e sigma_e + f sigma_f) = K*0 = 0 for ANY finite
 *   K, independent of how well K or the individual elasticity happens to be resolved numerically. The round-off
 *   floor is a property of one specific numerical ESTIMATOR (the direct eps = 1e-3 central difference) of one
 *   term; it is not a property of the algebraic identity those terms satisfy. Documentation only: no new
 *   numerics, no bound moves, NO QED.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (pins the round-off floor that collapses the direct stencil)
 * @see imp-124812-diag3-additivity-exact-identity-assessment.js (proves the additivity is exact linear-model algebra)
 * @see imp-124929 (companion ticket: re-measures DIAG3 with the round-off-resistant reconstructed E_CF directly)
 *
 * Ticket: imp-124940 (content, sonnet-4-6, sonnet). Reference note only; no bound on Lambda moves; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed.
 */

import { IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER } from './imp-124769-ecf-stencil-noise-floor-crossover.js';
import { IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT } from './imp-124812-diag3-additivity-exact-identity-assessment.js';

const L6 = IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.ladder.find((r) => r.key === 'L6');
const { sigma_crit, E_CF_crit } = IMP124769_ECF_STENCIL_NOISE_FLOOR_CROSSOVER.crossover;

export const IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE = Object.freeze({
  ticket: 'imp-124940',
  restatedClaim:
    'the DIAG3 additivity E_CC + E_ET + E_CF = 0 stays an EXACT algebraic identity at landmarks past the ' +
    'imp-124769 round-off crossover (sigma < sigma_crit ~ ' + sigma_crit.toExponential(3) + '), even though the ' +
    'DIRECT central-difference E_CF stencil there is dominated by numerical noise -- because the proof never ' +
    'routes through that noisy stencil.',
  theTensionBeingResolved: {
    fromImp124769:
      'at L6 (sigma = ' + L6.sigma + '), the direct eps = 1e-3 central-difference measurement of E_CF carries ' +
      'relative error ~' + L6.relTrunc_at_1em3.toExponential(2) + ' (errCF = ' + L6.errCF_at_1em3.toExponential(2) +
      ' against |E_CF| ~ ' + Math.abs(L6.E_CF).toExponential(2) + '), the landmark-bisection round-off floor ' +
      'having overtaken the O(eps^2) truncation once |E_CF| fell below the crit value ' + E_CF_crit.toExponential(2) + '.',
    fromImp124812:
      'the amplitude-weighted partial sum NUM = c*sigma_c + e*sigma_e + f*sigma_f stays below ' +
      IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT.max_linear_partial_sum.toExponential(2) +
      ' (IEEE round-off) at EVERY probed N, flow share, and value perturbation -- it is an Euler degree-0 ' +
      'homogeneity, not a numerical coincidence that could degrade.',
    apparentTension:
      'if the additivity E_CC + E_ET + E_CF = K*NUM is exact only because NUM = 0, and E_CF (one of the three ' +
      'summands) is itself measured so badly past sigma_crit that its direct stencil value is mostly round-off ' +
      'noise, how can the SUM still be exact there?',
  },
  resolution: {
    mechanism:
      'the imp-124812 proof is an algebraic statement about the CLOSED-FORM elasticities ' +
      '(c*sigma_c = sigma(1-sigma), e*sigma_e = -e*sigma/E_N, f*sigma_f = -E_flow*sigma/E_N), derived directly ' +
      'from the degree-0 homogeneity of sigma(c,e,f) -- it never evaluates a finite difference. The shared kernel ' +
      'K = -1/(N_L sigma_N) factors out of E_CC + E_ET + E_CF = K*(c sigma_c + e sigma_e + f sigma_f) and the ' +
      'bracketed sum is zero POINTWISE, for any finite non-zero K, independent of the VALUE of K or of how any ' +
      'one term in it is numerically estimated.',
    whatBreaksInsteadIsDecoupled:
      'the round-off floor pinned by imp-124769 is a property of a SPECIFIC ESTIMATOR of one factor (the direct ' +
      'eps = 1e-3 central difference of ln N_L used to build E_CF numerically) -- it measures how precisely that ' +
      'one numerical recipe can resolve a quantity that happens to be small past L6. It says nothing about the ' +
      'algebraic identity the closed-form quantities satisfy; swapping in the round-off-resistant reconstructed ' +
      'E_CF (as imp-124929 does directly) sidesteps the noisy estimator entirely and the sum is unaffected either way.',
    whyThisIsNotSpecialPleading:
      'the same decoupling already appears inside imp-124812 (B2): the paper explicitly flags that the ' +
      'INDIVIDUAL elasticity magnitudes are measurement-only and need the numerical kernel K, while only their ' +
      'SUM is kernel-free and exact. The round-off floor is exactly the sharper, quantitative version of that ' +
      'same B2 caveat: it pins PRECISELY where one individual measurement (direct E_CF) stops being trustworthy, ' +
      'without touching the B-part-independent (A) proof that the sum is always zero.',
  },
  sigma_crit,
  E_CF_crit,
  landmarkPastCrossover: 'L6',
  directStencilRelativeErrorAtL6: L6.relTrunc_at_1em3,
  algebraicCoreMachineZeroBound: IMP124812_DIAG3_ADDITIVITY_EXACT_IDENTITY_ASSESSMENT.max_linear_partial_sum,
  additivitySurvivesStencilCollapse: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP124940_HONEST_BANNER =
  'Reference note only. No bound on Lambda moves. imp-3066 K_a >= 0 untouched. No RH verdict, NO QED. ' +
  'No refereed bound is changed.';

export default IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE;

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE.sigma_crit > L6.sigma &&
    IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE.directStencilRelativeErrorAtL6 > 1e-6 &&
    IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE.algebraicCoreMachineZeroBound < 1e-10 &&
    IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE.additivitySurvivesStencilCollapse === true &&
    IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE.anyBoundMoved === false &&
    IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE.operatorPositivityEstablished === false &&
    IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE.measurementOnly === true &&
    IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE.isRigorous === false &&
    IMP124940_DIAG3_ADDITIVITY_SURVIVES_ECF_ROUNDOFF_NOTE.qed === false &&
    /NO QED/.test(IMP124940_HONEST_BANNER) &&
    /PT Lambda <= 0.2|Platt-Trudgian Lambda <= 0.2|refereed bound is changed/.test(IMP124940_HONEST_BANNER) &&
    /K_a >= 0 untouched/.test(IMP124940_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-124940-diag3-additivity-survives-ecf-roundoff-note assertion FAILED: the round-off-floor-vs-exact-' +
      'additivity resolution must stay internally consistent (sigma_crit above L6, L6 stencil error well above ' +
      'floor-noise threshold, algebraic core machine-zero, additivity still marked as surviving).'
  );
}
