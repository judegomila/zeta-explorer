/**
 * @module imp-97656-wlin-laurent-crossval-subgap-standing-honest-status
 * @fileoverview imp-97656 -- HONEST-STATUS NOTE restating, side by side, the two imp-97618 results so
 *   neither is read as closing the other: (1) the leading Laurent block {A, B, C0} of the Estermann
 *   function E(s, a/q) at its s=1 double pole DOES reproduce w_lin(x) = 2C/pi + log(x)/pi - x/pi to
 *   measured precision (imp-97618 cross-check of imp-97597 RESULT 1), and (2) the epsilon*z^2 mixed
 *   Bettin-Conrey kernel coefficient (imp-97597 RESULT 3) is STILL uncomputed -- imp-97618 cross-checks
 *   only the leading block, never touches that coefficient, and its residual (the O(x^2) wobble tail)
 *   is exactly where that sub-gap lives. Documentation only: no new numerics, no bound moves, no
 *   operator positivity, NO QED.
 *
 * @see imp-97618-wlin-leading-laurent-crossval.js (the cross-check RESULT restated here)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion.js (RESULT 3 sub-gap that STANDS)
 *
 * Ticket: imp-97656 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97618_VERDICT, IMP97618_FIT, IMP97618_MAX_RESID_SMALL_X } from './imp-97618-wlin-leading-laurent-crossval.js';
import { IMP97597_VERDICT, IMP97597_SUBGAP } from './imp-97597-route-m-psi-s-integral-rep-double-expansion.js';

export const IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97656',
  question:
    'does the imp-97618 cross-check of the leading Laurent block {A,B,C0} reproducing w_lin also ' +
    'close the imp-97597 RESULT 3 epsilon*z^2 mixed Bettin-Conrey kernel coefficient sub-gap?',
  answer:
    'No. The two facts are independent and both stand as recorded: the leading Laurent block DOES ' +
    'reproduce w_lin to measured precision (imp-97618, an independent numerical cross-check via the ' +
    'directly-evaluated cotangent-sum limit), while the epsilon*z^2 mixed kernel coefficient kappaK ' +
    '(imp-97597 RESULT 3) remains completely uncomputed -- the cross-check never touches it, and its ' +
    'unresolved contribution is exactly the O(x^2) wobble-tail residual that the cross-check leaves ' +
    'unreproduced.',
  leadingBlockReproducesWLin: IMP97618_VERDICT.leadingLaurentBlockReproducesWLin, // true
  crossCheckedIndependently: IMP97618_VERDICT.crossCheckedViaDirectCotangentSumLimit, // true
  bcKernelNormalisationReconstructed: IMP97618_VERDICT.bcKernelNormalisationReconstructed, // false
  linCoefficientErr: IMP97618_FIT.linErr, // 6.3947e-3 (most contaminated -- nearest the O(x^2) boundary)
  maxResidualSmallX: IMP97618_MAX_RESID_SMALL_X, // 2.3633e-4 for x <= 0.12
  subgapMixedKernelMonomial: IMP97597_SUBGAP.mixedKernelCoefficientMonomial, // "epsilon * z^2 in K(s,z) at (s=1,z=0)"
  subgapClosedFormCloses: IMP97597_VERDICT.closedFormClosesFromElementaryCocycle, // false
  subgapPinned: IMP97597_VERDICT.pureAnalyticCoefficientPinned, // false
  subgapStands: true,
  crossCheckAndSubgapAreIndependent: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP97656_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. The imp-97618 cross-check confirms the leading ' +
  'Laurent block {A,B,C0} reproduces w_lin to measured precision, but this does NOT close the imp-97597 ' +
  'RESULT 3 sub-gap: the epsilon*z^2 mixed Bettin-Conrey kernel coefficient kappaK is uncomputed and its ' +
  'contribution is exactly the O(x^2) wobble tail the cross-check leaves unreproduced. No bound moves; ' +
  'the rigorous anchor stays T = 2.594e7; compute binds first by >2600x.';

export default IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS;

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.leadingBlockReproducesWLin === true &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.crossCheckedIndependently === true &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.bcKernelNormalisationReconstructed === false &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.subgapClosedFormCloses === false &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.subgapPinned === false &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.subgapStands === true &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.crossCheckAndSubgapAreIndependent === true &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.linCoefficientErr > IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.maxResidualSmallX &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.anyBoundMoved === false &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.operatorPositivityEstablished === false &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.computeBindsFirst === true &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.measurementOnly === true &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.isRigorous === false &&
    IMP97656_CROSSVAL_SUBGAP_STANDING_HONEST_STATUS.qed === false &&
    /NO QED/.test(IMP97656_HONEST_BANNER) &&
    /PT Lambda <= 0.2/.test(IMP97656_HONEST_BANNER) &&
    /RH open/.test(IMP97656_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-97656-wlin-laurent-crossval-subgap-standing-honest-status assertion FAILED: the leading Laurent ' +
      'block cross-check and the RESULT 3 mixed-kernel sub-gap must both stand, independently.'
  );
}
