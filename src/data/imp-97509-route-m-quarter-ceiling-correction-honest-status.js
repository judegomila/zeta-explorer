/**
 * @module imp-97509-route-m-quarter-ceiling-correction-honest-status
 * @fileoverview imp-97509 -- HONEST-STATUS CORRECTION NOTE re-pointing the imp-97432 / imp-97461
 *   "b/4-ceiling survives" conclusion, which imp-97481 REFUTED.
 *
 *   imp-97432 and imp-97461 concluded the Route-M b/4-ceiling |E1(b)| <= b/4 SURVIVES the MCM refutation,
 *   from the premise that the primorial family is the two-sided extremizer with lower infimum
 *   -e^{-gamma}/12 = -0.046788. imp-97481 RESULT 5 REFUTED that premise: the primorial (P0 = 2) is the
 *   SHALLOWEST window, not the deepest, and window sets [P0, Y] with P0 >= 101 sink unboundedly deeper
 *   (surrogate limit -c e^{-gamma}/Prod_{p<P0}(1-1/p), e.g. -0.388874 at P0 = 101). So the LOWER edge
 *   T(b) >= -1/4 itself is FALSE for general squarefree b, not merely its imp-97422 proof.
 *
 *   Emphasise: NO Lambda bound and no kappa_arith value ever depended on the ceiling -- it was an
 *   EXPLORATORY Route-M sub-claim. Nothing in the verified ledger moves. Documentation only.
 *   Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js (source refutation + exported verdict)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (asserted the ceiling survives via primorial premise)
 * @see imp-97461-route-m-quarter-ceiling-survival-without-mcm-scope.js (restated survival via the unformalized RL-L)
 * @see imp-97544-route-m-b4-ceiling-dead-route-consolidated-honest-status.js (later CONSOLIDATED
 *   status note this correction feeds into -- imp-97544 folds this narrower correction plus every
 *   downstream witness/harmlessness result into one up-to-date banner; cite imp-97544 going forward)
 *
 * Ticket: imp-97509 (content, sonnet-4-6, sonnet). Honest-status correction note only; no bound on
 * Lambda moves; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97481_VERDICT } from './imp-97481-route-m-quarter-ceiling-lower-edge-refuted-window-sets.js';
import { IMP97544_STATUS } from './imp-97544-route-m-b4-ceiling-dead-route-consolidated-honest-status.js';

export const IMP97509_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97509',
  question:
    'record the imp-97481 correction to the imp-97432 / imp-97461 conclusion that the Route-M b/4-ceiling ' +
    '|E1(b)| <= b/4 SURVIVES the MCM refutation via a primorial-extremizer premise.',
  answer:
    'imp-97481 RESULT 5 refuted the premise: the primorial (P0=2) is the SHALLOWEST window (floor -0.0468), ' +
    'not the deepest, and window sets [P0,Y] with P0>=101 sink unboundedly deeper (e.g. -0.388874 at P0=101, ' +
    '-0.497500 at P0=379), both past -1/4. Hence the lower edge T(b) >= -1/4 is FALSE for general squarefree ' +
    'b -- a finite (astronomically large) counterexample b exists -- and the "ceiling survives" conclusion of ' +
    'imp-97432/imp-97461 rests on a now-refuted premise. The b/4-ceiling line is a dead route.',
  primorialIsExtremizer: IMP97481_VERDICT.primorialIsExtremizer, // false
  replacementLemmaExists: IMP97481_VERDICT.replacementLemmaExists, // false
  lowerEdgeHolds: IMP97481_VERDICT.lowerEdgeHolds, // false
  ceilingRefuted: IMP97481_VERDICT.ceilingRefuted, // true
  correctsImp97432Imp97461CeilingSurvivesConclusion: true,
  ceilingWasLoadBearingForLambdaOrKappaArith: false,
  anyBoundMoved: IMP97481_VERDICT.anyBoundMoved, // false
  consolidatedInto: 'imp-97544',
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97509_HONEST_STATUS.primorialIsExtremizer === false &&
    IMP97509_HONEST_STATUS.replacementLemmaExists === false &&
    IMP97509_HONEST_STATUS.lowerEdgeHolds === false &&
    IMP97509_HONEST_STATUS.ceilingRefuted === true &&
    IMP97509_HONEST_STATUS.correctsImp97432Imp97461CeilingSurvivesConclusion === true &&
    IMP97509_HONEST_STATUS.ceilingWasLoadBearingForLambdaOrKappaArith === false &&
    IMP97509_HONEST_STATUS.anyBoundMoved === false &&
    IMP97509_HONEST_STATUS.consolidatedInto === 'imp-97544' &&
    IMP97544_STATUS.ceilingRefuted === IMP97509_HONEST_STATUS.ceilingRefuted &&
    IMP97509_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97509-route-m-quarter-ceiling-correction-honest-status assertion FAILED: the imp-97481 refutation ' +
      'of the imp-97432/imp-97461 "b/4-ceiling survives" conclusion must hold, and must agree with the ' +
      'later imp-97544 consolidated status it feeds into.'
  );
}

export default IMP97509_HONEST_STATUS;
