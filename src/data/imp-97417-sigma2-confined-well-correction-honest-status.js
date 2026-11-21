/**
 * @module imp-97417-sigma2-confined-well-correction-honest-status
 * @fileoverview imp-97417 -- HONEST-STATUS CORRECTION NOTE recording the imp-97399 FINDING 1: the
 *   negativity set of sigma_2(t) = (t^2+1/4)^2 w_1(t) is a SINGLE CONFINED region
 *       [-10.532, -6.945] u [-3.306, 3.306] u [6.945, 10.532],
 *   with FINITE global depth -4336.198 (at t = 9.3502) and FINITE total negative area
 *   int sigma_2^- dt = 18301.61 (one-sided 9150.805, doubled by evenness). sigma_2 stays positive for
 *   every t > 10.532 (verified to t = 2000-5000).
 *
 *   This CORRECTS the imp-97161 PROSE claim (Assessment 2, part (i)-(ii)) that sigma_2 "dips negative
 *   in every cos(t ln2) band out to infinity" with an "unbounded" t^4-growing depth. The fixed-amplitude
 *   oscillation sqrt2 ln2 cos(t ln2) = 0.980 * cos(t ln2) cannot overcome the growing archimedean drift
 *   2 theta prime(t), so no negativity recurs past t ~ 10.53 and the well depth is finite, not unbounded.
 *
 *   Note: the imp-97161 numeric ASSERTIONS themselves only sampled sigma_2 at t = 0, 2, 10, 50 and all
 *   still pass under the corrected picture (those sample points are consistent with a confined well);
 *   only the PROSE over-stated the recurrence and unboundedness. No imp-97161 code or exported constant
 *   is wrong; this note documents the correction so it is directly citable without re-deriving imp-97399.
 *
 *   Documentation only: no new numerics, no operator positivity, no bound moves; interval-rigorous
 *   reach stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (source FINDING 1 + the new -3200.029 floor)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (the corrected prose; assertions unaffected)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (originally named the "confined negative well")
 *
 * Ticket: imp-97417 (content, sonnet-4-6, sonnet). Honest-status correction note only; no bound on
 * Lambda moves; no refereed bound is changed; RH open; NO QED.
 */

import { IMP97399_WELL, IMP97399_VERDICT } from './imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js';

export const IMP97417_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97417',
  question:
    'record the imp-97399 FINDING 1 correction to the imp-97161 prose claim that the negative sigma_2 ' +
    'well recurs "in every cos(t ln2) band out to infinity" with "unbounded" t^4 depth.',
  answer:
    'the imp-97399 fine sign scan shows the negativity set is a SINGLE CONFINED bounded region ' +
    '[-10.532,-6.945] u [-3.306,3.306] u [6.945,10.532], with FINITE global depth -4336.198 (at ' +
    't=9.3502) and FINITE total negative area 18301.61 (one-sided 9150.805, doubled by evenness); ' +
    'sigma_2 > 0 for every t > 10.532 (verified to t=2000-5000). This corrects the imp-97161 prose ' +
    '(not its code or assertions, which sampled only t=0,2,10,50 and remain consistent) that claimed ' +
    'recurring negativity bands and unbounded t^4 depth: the fixed-amplitude cos(t ln2) oscillation ' +
    'cannot overcome the growing 2 theta prime(t) archimedean drift.',
  negativeSetIsConfined: IMP97399_WELL.isConfined, // true
  lastNegativeT: IMP97399_WELL.lastNegativeT, // 10.532
  globalDepth: IMP97399_WELL.globalInf, // -4336.198
  depthIsFinite: IMP97399_WELL.depthIsFinite, // true
  totalNegativeAreaFullLine: IMP97399_WELL.negAreaFullLine, // 18301.610
  correctsImp97161RecurringBandsProse: IMP97399_VERDICT.correctsImp97161RecurringBandsProse, // true
  imp97161CodeAndAssertionsUnaffected: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97417_HONEST_STATUS.negativeSetIsConfined === true &&
    IMP97417_HONEST_STATUS.lastNegativeT === 10.532 &&
    Math.abs(IMP97417_HONEST_STATUS.globalDepth - -4336.198) < 1e-3 &&
    IMP97417_HONEST_STATUS.depthIsFinite === true &&
    Math.abs(IMP97417_HONEST_STATUS.totalNegativeAreaFullLine - 18301.61) < 1e-2 &&
    IMP97417_HONEST_STATUS.correctsImp97161RecurringBandsProse === true &&
    IMP97417_HONEST_STATUS.boundMoves === false &&
    IMP97417_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97417-sigma2-confined-well-correction-honest-status assertion FAILED: the imp-97399 FINDING 1 ' +
      'correction (confined negativity set, finite depth -4336.198, finite area 18301.61, correcting the ' +
      'imp-97161 unbounded-recurrence prose) must hold.'
  );
}

export default IMP97417_HONEST_STATUS;
