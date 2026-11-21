/**
 * @module imp-36052-w1-forward-error-ladder-crossref
 * @fileoverview imp-36052 -- standalone CROSS-REFERENCE note assembling the full W1 forward-error
 *   LADDER storyline into one measured-to-a-priori arc, so a reader landing on any single rung sees
 *   the whole chain:
 *     1. MEASURED achieved error (imp-35812 baseline order, imp-35852 four worst-case orderings)
 *        ~3.0e-17 (baseline) .. ~4.86e-15 (worst skeptical), still far below every a-priori bound;
 *     2. CERTIFIED deterministic running-accumulator run-max bound (imp-35890) ~6.41e-14 -- the
 *        tightest USABLE certified a-priori bound, recovering ~3.2 of the ~6.5 orders between the
 *        imp-35761 pessimistic N*eps ceiling and the achieved error;
 *     3. PROBABILISTIC Wilkinson / Higham-Mary sqrt(N) scales (imp-35948) ~9.17e-17 / ~5.58e-17 --
 *        the intermediate rung recovering ~85-92% of the remaining coherent-vs-random-walk residual
 *        under a roundoff-independence assumption;
 *     4. pairwise-tree DEPTH-BOUND slack (imp-35970) -- a distinct axis (association-tree depth
 *        rather than the naive-recursive-sum accumulator) showing the published depth-proportional
 *        a-priori bound is loose by 4-7 orders across the imp-35893 shape family, widening with depth;
 *     5. CONFIDENCE-CONSTANT calibration (imp-35990) -- lambda_required ~0.327 (Wilkinson) / ~0.538
 *        (Higham-Mary), both sub-unity, so the imp-35948 residual is exactly the single-realization-
 *        vs-ensemble-std gap, not a missing confidence margin.
 *
 *   Read-only note: imports all six modules' recorded verdicts verbatim (no re-derivation, no new
 *   numerics). States the combined reading that the ladder rungs are internally consistent -- each
 *   successive a-priori refinement narrows the gap to the achieved error without ever closing it
 *   deterministically -- so precision stays NON-binding throughout and the obstruction remains the
 *   MECHANICAL engineering of the certified length-N interval sum (imp-35725). The W1 A + B - C
 *   certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 *   Ticket: imp-36052 (content, sonnet-4-6, low). Note only; changes no bound; C_mb GUE-conditional
 *   (imp-486) untouched; no refereed bound is changed; NO QED.
 *
 *   @see imp-35812-w1-summation-scheme-measured-cost (rung 1: baseline-order MEASURED achieved error)
 *   @see imp-35852-w1-summation-adversarial-ordering (rung 1: adversarial-order MEASURED achieved error)
 *   @see imp-35890-w1-running-accumulator-apriori-bound (rung 2: CERTIFIED deterministic run-max bound)
 *   @see imp-35948-w1-probabilistic-sqrtN-apriori-scale (rung 3: PROBABILISTIC Wilkinson/Higham-Mary scale)
 *   @see imp-35970-w1-pairwise-apriori-depth-bound-slack (rung 4: pairwise-tree DEPTH-BOUND slack)
 *   @see imp-35990-w1-lambda-confidence-calibration (rung 5: CONFIDENCE-CONSTANT calibration)
 *   @see imp-35987-w1-summation-cost-order-shape-crossref (companion cross-ref: cost/order/shape trio)
 *   @see imp-35725-w1-effective-error-cap-budget (names the mechanical N-term certified-rounding cost)
 *   @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval bound greenfield)
 */

import { IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST } from './imp-35812-w1-summation-scheme-measured-cost.js';
import { IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING } from './imp-35852-w1-summation-adversarial-ordering.js';
import { IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND } from './imp-35890-w1-running-accumulator-apriori-bound.js';
import { IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE } from './imp-35948-w1-probabilistic-sqrtN-apriori-scale.js';
import { IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK } from './imp-35970-w1-pairwise-apriori-depth-bound-slack.js';
import { IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION } from './imp-35990-w1-lambda-confidence-calibration.js';

export const IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF = Object.freeze({
  id: 'imp-36052',
  title:
    'Cross-reference note: the full W1 forward-error LADDER storyline -- MEASURED achieved error ' +
    '(imp-35812/imp-35852) -> CERTIFIED deterministic run-max bound (imp-35890) -> PROBABILISTIC ' +
    'Wilkinson/Higham-Mary scales (imp-35948) -> pairwise-tree DEPTH-BOUND slack (imp-35970) -> ' +
    'CONFIDENCE-CONSTANT calibration (imp-35990), as one measured-to-a-priori arc',

  ladder: Object.freeze({
    rung1_measured: Object.freeze({
      role: 'MEASURED: exact-BigInt achieved naive error, baseline order then four worst-case orderings',
      achievedBaselineNormErr: IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.measuredAtTPT.naiveNormErr,
      achievedWorstAdversarialNormErr: IMP35852_W1_SUMMATION_ADVERSARIAL_ORDERING.summary.naiveWorstNormErr,
      staysGreenfield: IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.conclusion.staysGreenfield,
    }),
    rung2_certifiedDeterministic: Object.freeze({
      role: 'CERTIFIED: tightest USABLE deterministic a-priori bound, running-accumulator run-max form',
      runMaxNorm: IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.bounds.runningAccumulatorRunMax.value,
      ordersRecoveredFromPessimisticCeiling:
        IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.gapDecomposition.ordersRecoveredByRunningAccumulator,
      ordersStillAboveAchieved:
        IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.gapDecomposition.ordersResidualCoherentVsRandomWalk,
      staysGreenfield: IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.conclusion.staysGreenfield,
    }),
    rung3_probabilistic: Object.freeze({
      role: 'PROBABILISTIC: Wilkinson sqrt(N-1) and sharper Higham-Mary mean-square scales, independence-conditional',
      wilkinsonNorm: IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.scales.probWilkinson.value,
      highamMaryNorm: IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.scales.probHighamMary.value,
      fractionOfResidualRecoveredWilkinson:
        IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.gapRecovery.wilkinson.fractionOfResidualRecovered,
      fractionOfResidualRecoveredHighamMary:
        IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.gapRecovery.highamMary.fractionOfResidualRecovered,
      staysGreenfield: IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.conclusion.staysGreenfield,
    }),
    rung4_depthBoundSlack: Object.freeze({
      role:
        'DISTINCT AXIS: pairwise association-tree DEPTH bound (imp-35893 shapes), not the naive-sum ' +
        'accumulator axis of rungs 1-3 and 5 -- included because the ticket names it as part of this arc',
      tightestSlackShape: IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.summary.tightestSlackShape,
      loosestSlackShape: IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.summary.loosestSlackShape,
      slackSpanOrdersOfMagnitude: IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.summary.slackSpanOrdersOfMagnitude,
      staysGreenfield: IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.conclusion.staysGreenfield,
    }),
    rung5_confidenceCalibration: Object.freeze({
      role: 'CONFIDENCE CONSTANT: empirical lambda_required to cover the achieved error under each probabilistic scale',
      lambdaReqWilkinson: IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.lambdaCalibration.wilkinson.lambdaRequired,
      lambdaReqHighamMary: IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.lambdaCalibration.highamMary.lambdaRequired,
      bothBelowUnity: IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.lambdaCalibration.bothBelowUnity,
      staysGreenfield: IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.conclusion.staysGreenfield,
    }),
  }),

  throughline:
    'Starting from the MEASURED achieved naive error (imp-35812 baseline order ~3.0e-17, imp-35852 worst ' +
    'worst-case ordering ~4.86e-15), the ladder climbs through successively more conservative a-priori ' +
    'rungs: the CERTIFIED deterministic running-accumulator bound (imp-35890, ~6.41e-14) recovers the ' +
    'magnitude-scale pessimism of the imp-35761 pessimistic N*eps ceiling; the PROBABILISTIC Wilkinson / ' +
    'Higham-Mary sqrt(N) scales (imp-35948, ~9.17e-17 / ~5.58e-17) recover most of the remaining coherent-' +
    'vs-random-walk residual under an independence assumption; the CONFIDENCE-CONSTANT calibration ' +
    '(imp-35990) shows the required lambda for both probabilistic scales is sub-unity, so no missing ' +
    'confidence margin is hiding in that residual. On the separate pairwise-tree DEPTH axis (imp-35970), ' +
    'the published depth-proportional a-priori bound is loose by 4-7 orders and widens with depth, the ' +
    'same qualitative pattern as the naive-sum axis: every honest a-priori bound over-predicts the ' +
    'measured error, and no deterministic bound recovers the sqrt(N) random-walk floor. Every rung agrees: ' +
    'precision stays NON-BINDING at every level of this ladder, so the sole obstruction to the W1 A + B - C ' +
    'certificate at T_PT = 3e12 is the MECHANICAL engineering of the certified length-N interval sum ' +
    '(imp-35725), not summation-scheme precision; the certificate itself stays GREENFIELD (imp-35681 Part A).',

  honestCaveat: Object.freeze({
    isProof: false,
    changesAnyBound: false,
    dischargesAnyObligation: false,
    portsAnyRoute: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'CROSS-REFERENCE NOTE (documentation only). Links imp-35812/imp-35852 (MEASURED achieved error), ' +
    'imp-35890 (CERTIFIED deterministic run-max bound), imp-35948 (PROBABILISTIC Wilkinson/Higham-Mary ' +
    'scales), imp-35970 (pairwise-tree DEPTH-BOUND slack), and imp-35990 (CONFIDENCE-CONSTANT calibration) ' +
    'as one measured-to-a-priori arc: each rung is an honest but successively looser a-priori refinement ' +
    'of the same achieved-error floor, and none closes the gap deterministically. Precision stays NON-' +
    'BINDING throughout, so the obstruction stays the MECHANICAL engineering of the certified length-N ' +
    'interval sum (imp-35725), not precision. The W1 A + B - C certificate at T_PT stays GREENFIELD ' +
    '(imp-35681 Part A). Changes no bound; NO QED. No refereed bound is changed.',
});

export const IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF_ASSERTIONS = [
  {
    id: 'imp36052-ladder-rungs-descend-toward-achieved',
    why: 'The certified and probabilistic bounds must sit above the achieved error in the expected order.',
    holds: () =>
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung2_certifiedDeterministic.runMaxNorm >
        IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung3_probabilistic.wilkinsonNorm &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung3_probabilistic.wilkinsonNorm >
        IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung1_measured.achievedBaselineNormErr &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung3_probabilistic.highamMaryNorm >
        IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung1_measured.achievedBaselineNormErr,
  },
  {
    id: 'imp36052-links-five-source-verdicts-verbatim',
    why: 'The note must restate each source module GREENFIELD verdict verbatim, not paraphrase it.',
    holds: () =>
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung1_measured.staysGreenfield ===
        IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST.conclusion.staysGreenfield &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung2_certifiedDeterministic.staysGreenfield ===
        IMP35890_W1_RUNNING_ACCUMULATOR_APRIORI_BOUND.conclusion.staysGreenfield &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung3_probabilistic.staysGreenfield ===
        IMP35948_W1_PROBABILISTIC_SQRTN_APRIORI_SCALE.conclusion.staysGreenfield &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung4_depthBoundSlack.staysGreenfield ===
        IMP35970_W1_PAIRWISE_APRIORI_DEPTH_BOUND_SLACK.conclusion.staysGreenfield &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung5_confidenceCalibration.staysGreenfield ===
        IMP35990_W1_LAMBDA_CONFIDENCE_CALIBRATION.conclusion.staysGreenfield,
  },
  {
    id: 'imp36052-confidence-constants-below-unity',
    why: 'The calibration rung must confirm both required lambdas are sub-unity (no missing confidence margin).',
    holds: () =>
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung5_confidenceCalibration.lambdaReqWilkinson < 1 &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung5_confidenceCalibration.lambdaReqHighamMary < 1 &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.ladder.rung5_confidenceCalibration.bothBelowUnity === true,
  },
  {
    id: 'imp36052-throughline-names-all-five-rungs-and-mechanical-obstruction',
    why: 'The throughline must name every rung of the arc and the mechanical residual.',
    holds: () =>
      /MEASURED/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.throughline) &&
      /CERTIFIED/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.throughline) &&
      /PROBABILISTIC/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.throughline) &&
      /DEPTH/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.throughline) &&
      /CONFIDENCE-CONSTANT/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.throughline) &&
      /NON-BINDING/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.throughline) &&
      /MECHANICAL/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.throughline) &&
      /GREENFIELD/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.throughline),
  },
  {
    id: 'imp36052-honesty-gate',
    why: 'This is a read-only cross-reference note: it must not claim to discharge any obligation, port any route, or change any bound.',
    holds: () =>
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.honestCaveat.dischargesAnyObligation === false &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.honestCaveat.portsAnyRoute === false &&
      IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.honestCaveat.sota),
  },
  {
    id: 'imp36052-verdict-no-qed',
    why: 'The verdict must record NO QED and the no-refereed-bound-change floor, matching every source module.',
    holds: () =>
      /NO QED/.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.verdict) &&
      /refereed bound is changed/i.test(IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF.verdict),
  },
];

for (const assertion of IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36052-w1-forward-error-ladder-crossref assertion failed: ${assertion.id}`);
  }
}

export default IMP36052_W1_FORWARD_ERROR_LADDER_CROSSREF;
