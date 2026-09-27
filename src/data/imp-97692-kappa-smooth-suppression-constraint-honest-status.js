/**
 * @module imp-97692-kappa-smooth-suppression-constraint-honest-status
 * @fileoverview imp-97692 -- HONEST-STATUS NOTE recording the imp-97663 RESULT 2 suppression
 *   constraint on the Bettin-Conrey reflection normalisation kappaK_period. imp-97663 fed the
 *   measured band |kappa_smooth| <~ 1e-2 back into the imp-97597 decomposition and found the bare
 *   period scale pi^3/12 = 2.5838563900249847 sits ~258x above that band, forcing (under the
 *   no-cancellation reading) |kappaK_period| <~ 3.87e-3 -- a quantified suppression, not a pinned
 *   value. The single functional-equation reflection index that would fix kappaK exactly (imp-97617
 *   RESULT C) stays uncomputed. This note restates that constraint as a standalone, directly-citable
 *   status record, complementing the imp-97611 no-closed-form note. Documentation only: no new
 *   numerics, no bound moves, no operator positivity, NO QED.
 *
 * @see imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint.js (source: RESULT 2 cap)
 * @see imp-97611-kappa-smooth-no-closed-form-honest-status.js (complementary no-closed-form note)
 * @see imp-97617-route-m-bettin-conrey-kernel-gamma-factor-reconstruction (RESULT C: reflection index)
 *
 * Ticket: imp-97692 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda
 * moves; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import {
  IMP97663_VERDICT,
  IMP97663_SUBGAP,
  IMP97663_P2_UNIT,
  IMP97663_REFLECTION_NORM_CAP,
} from './imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint.js';

export const IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97692',
  question:
    'what does feeding the measured band |kappa_smooth| <~ 1e-2 back into the imp-97597 ' +
    'decomposition imply for the uncomputed Bettin-Conrey reflection normalisation kappaK_period, ' +
    'and is that a pinned value or a constraint?',
  answer:
    'A constraint, not a pinned value. imp-97663 compared the measured band to the bare ' +
    '(unit-normalisation) period scale P2_unit = (pi/2)zeta(2) = pi^3/12 = 2.5838563900249847 and ' +
    'found the band sits ~258x below it. Since the pole scale is only ~11x below the band, ' +
    'kappaK_period and kappaK_pole cannot both be O(1): under the no-cancellation reading the period ' +
    'normalisation is capped at |kappaK_period| <~ 3.87e-3, quantifying the imp-97617 RESULT C ' +
    'order-lowering epsilon from merely "small" to O(1e-3). The alternative is a ~1-part-in-250 ' +
    'cancellation between the period and pole parts, which the elementary reciprocity gives no reason ' +
    'to expect. Either way, no numeric value is pinned for kappaK, kappaK_period, or kappa_smooth: the ' +
    'single functional-equation reflection index that would fix kappaK exactly (imp-97617 RESULT C) ' +
    'stays uncomputed, and kappa_smooth stays measured-not-pinned.',
  directClosedFormCloses: IMP97663_VERDICT.directClosedFormCloses, // false
  reflectionNormalisationCappedAtMilliScale: IMP97663_VERDICT.reflectionNormalisationCappedAtMilliScale, // true
  quantifiesImp97617OrderLoweringEpsilon: IMP97663_VERDICT.quantifiesImp97617OrderLoweringEpsilon, // true
  mixedKernelCoefficientPinned: IMP97663_VERDICT.mixedKernelCoefficientPinned, // false
  kappaSmoothStaysMeasured: IMP97663_VERDICT.kappaSmoothStaysMeasured, // true
  anyBoundMoved: IMP97663_VERDICT.anyBoundMoved, // false
  barePeriodScale: IMP97663_P2_UNIT, // pi^3/12 ~ 2.5838563900249847
  reflectionNormCap: IMP97663_REFLECTION_NORM_CAP, // |kappaK_period| <~ 3.87e-3
  subGapId: IMP97663_SUBGAP.id, // imp-97663-bc-reflection-normalisation-scale
  reflectionIndexStatus: 'uncomputed',
  kappaSmoothStatus: 'measured-not-pinned',
  documentationOnly: true,
  isRigorous: false,
  boundMoves: false,
  operatorPositivityProved: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.directClosedFormCloses === false &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.reflectionNormalisationCappedAtMilliScale === true &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.quantifiesImp97617OrderLoweringEpsilon === true &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.mixedKernelCoefficientPinned === false &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.kappaSmoothStaysMeasured === true &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.anyBoundMoved === false &&
    Math.abs(IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.barePeriodScale - 2.5838563900249847) < 1e-13 &&
    Math.abs(IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.reflectionNormCap - 0.0038701841319839394) < 1e-15 &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.subGapId === 'imp-97663-bc-reflection-normalisation-scale' &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.reflectionIndexStatus === 'uncomputed' &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.kappaSmoothStatus === 'measured-not-pinned' &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.isRigorous === false &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.boundMoves === false &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.operatorPositivityProved === false &&
    IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97692-kappa-smooth-suppression-constraint-honest-status assertion FAILED: must record the ' +
      'imp-97663 suppression cap |kappaK_period| <~ 3.87e-3 as a constraint (not a pinned value) with ' +
      'the reflection index still uncomputed and kappa_smooth staying measured-not-pinned.'
  );
}

export default IMP97692_KAPPA_SMOOTH_SUPPRESSION_CONSTRAINT_HONEST_STATUS;
