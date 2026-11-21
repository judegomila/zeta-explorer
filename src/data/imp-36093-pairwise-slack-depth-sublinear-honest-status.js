/**
 * @module imp-36093-pairwise-slack-depth-sublinear-honest-status
 * @fileoverview imp-36093 -- standalone HONEST-STATUS note recording the imp-36018
 *   finding that the pairwise-summation slack-vs-depth relation (how far the
 *   imp-35970 a-priori depth-proportional forward-error bound over-predicts the
 *   imp-35893 measured pairwise error) is SUB-LINEAR and noisy, NOT the strict
 *   slack ~ d^1 the imp-35970 depth-independent-floor mechanism assumed. The
 *   full seven-shape OLS fit gives a depth-scaling exponent ~0.748 (R^2 ~0.658),
 *   well below the linear value 1, so the a-priori bound over-predicts with a
 *   depth-DEPENDENT margin (the slack itself changes shape across depth) rather
 *   than the fixed-ratio margin a strict linear law would imply.
 *
 *   Read-only note: imports the imp-36018 module verbatim (no re-derivation, no
 *   new regression), restating plainly for a reader who lands on this ticket
 *   without having read imp-36018 in full that the depth-scaling exponent is
 *   sub-linear and that imp-35970's "linearly in d" prose is refined accordingly.
 *
 *   Ticket: imp-36093 (content, medium). Note only; ports nothing; changes no
 *   bound; no refereed bound is changed; NO QED.
 *
 * @see imp-36018-w1-pairwise-slack-depth-scaling-exponent.js (source: the depth-scaling OLS fit this note restates)
 * @see imp-35970-w1-pairwise-apriori-depth-bound-slack.js (the a-priori-vs-measured slack table; asserted "linearly in d")
 * @see imp-35893-w1-summation-pairwise-tree-shape (the tree-SHAPE sweep + measured errors underlying both)
 * @see imp-36039-w1-pairwise-slack-depth-law-adjudication (adjudicates FLAT/SQRT/LINEAR; SQRT vs LINEAR a statistical tie)
 */

import { IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT } from './imp-36018-w1-pairwise-slack-depth-scaling-exponent.js';

const SOURCE = IMP36018_W1_PAIRWISE_SLACK_DEPTH_SCALING_EXPONENT;

export const IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS = Object.freeze({
  id: 'imp-36093',
  title:
    'Honest-status note: the imp-36018 pairwise-summation slack-vs-depth relation is SUB-LINEAR and noisy, ' +
    'NOT the strict slack ~ d^1 the imp-35970 a-priori depth-proportional forward-error bound assumed, so the ' +
    'a-priori bound over-predicts with a depth-dependent margin',
  sourceModule: 'imp-36018-w1-pairwise-slack-depth-scaling-exponent.js',

  fitResult: Object.freeze({
    fullFitExponent: SOURCE.fit.full.exponent,
    fullFitR2: SOURCE.fit.full.r2,
    fullFitN: SOURCE.fit.full.n,
    excludingOutlierExponent: SOURCE.fit.excludingSameDepthCaterpillarR.exponent,
    excludingOutlierR2: SOURCE.fit.excludingSameDepthCaterpillarR.r2,
    strictLinearInDPredictedExponent: SOURCE.test.strictLinearInDPredictedExponent,
    strictLinearConfirmed: SOURCE.test.strictLinearConfirmed,
    floorSpreadFactor: SOURCE.diagnostics.floorSpreadFactor,
    sameDepthCaterpillarSlackRatio: SOURCE.diagnostics.sameDepthCaterpillarSlackRatio,
  }),

  conclusion:
    'imp-35970 tabulated the depth-proportional a-priori pairwise forward-error bound over-predicting the ' +
    'imp-35893 measured error by ~3.7 to ~6.8 orders of magnitude across seven pairing-tree shapes, and stated ' +
    'in prose that the slack "widens with depth ... linearly in d" -- a strict power law slack ~ d^1 (exponent ' +
    'exactly 1) that follows only if the measured error is a perfectly depth-independent floor. imp-36018 fit ' +
    'that relation by ordinary least squares of log10(slack) on log10(tree depth) over the seven imp-35893 ' +
    'shapes (depth 12..3817) and found a full-set exponent of ~' +
    SOURCE.fit.full.exponent.toFixed(3) +
    ' with R^2 ~' +
    SOURCE.fit.full.r2.toFixed(3) +
    ' -- SUB-linear and noisy, not the strict value 1. The slack DOES widen with depth (positive exponent, ' +
    'deepest tree loosest), so the qualitative direction of imp-35970 is correct, but the exponent understates ' +
    'strict linearity because the measured error is not a perfectly constant floor: it spans ~' +
    SOURCE.diagnostics.floorSpreadFactor.toFixed(0) +
    'x across the seven shapes, and the two caterpillar shapes sharing the identical depth 3817 differ ~' +
    SOURCE.diagnostics.sameDepthCaterpillarSlackRatio.toFixed(1) +
    'x in slack -- direct evidence slack is not a pure function of depth alone. Excluding that single ' +
    'same-depth high-floor outlier lifts the exponent to ~' +
    SOURCE.fit.excludingSameDepthCaterpillarR.exponent.toFixed(3) +
    ' (R^2 ~' +
    SOURCE.fit.excludingSameDepthCaterpillarR.r2.toFixed(3) +
    '), close to linear, confirming the underlying mechanism is approximately linear-in-d once the ' +
    'non-constant per-shape floor is controlled for. NET EFFECT ON THE A-PRIORI BOUND: because the true slack ' +
    'grows more slowly with depth than a strict linear law predicts, the imp-35970 bound over-predicts the ' +
    'measured error by a MARGIN THAT ITSELF SHRINKS (in log-log slope terms) as depth grows, rather than by a ' +
    'depth-independent multiplicative factor -- the over-prediction is depth-dependent in magnitude, not merely ' +
    'depth-dependent in the sense imp-35970 assumed. Either way the bound remains overwhelmingly loose (4-7 ' +
    'orders of magnitude of headroom on every shape per imp-35970/imp-36039), so double-precision headroom is ' +
    'NOT the binding constraint under any reading of the exponent.',

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    changesAnyBound: false,
    portsAnyRoute: false,
    smallSampleCaveat: 'only seven data points (two sharing depth 3817); exponent sensitive to the single caterpillarR outlier',
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'SUB-LINEAR, NOT STRICT-LINEAR (restated from imp-36018): the pairwise-summation slack-vs-depth relation ' +
    'has a fitted full-set depth-scaling exponent of ~' +
    SOURCE.fit.full.exponent.toFixed(3) +
    ' (R^2 ~' +
    SOURCE.fit.full.r2.toFixed(3) +
    '), below the strict linear value 1 that imp-35970 assumed; the a-priori depth-proportional forward-error ' +
    'bound therefore over-predicts the imp-35893 measured error with a depth-DEPENDENT margin rather than a ' +
    'fixed-ratio one, though the bound stays loose by 4-7 orders on every shape regardless. Note only; changes ' +
    'no bound; NO QED; no refereed bound is changed.',
});

export const IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36093-exponent-matches-source',
    why: 'The restated full-fit exponent and R^2 must equal the imp-36018 source measurement verbatim.',
    holds: () =>
      IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.fitResult.fullFitExponent === SOURCE.fit.full.exponent &&
      IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.fitResult.fullFitR2 === SOURCE.fit.full.r2,
  },
  {
    id: 'imp36093-exponent-sub-linear',
    why: 'The full-set exponent must sit strictly below the strict-linear value 1, confirming the sub-linear finding.',
    holds: () =>
      IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.fitResult.fullFitExponent <
        IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.fitResult.strictLinearInDPredictedExponent &&
      IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.fitResult.strictLinearConfirmed === false,
  },
  {
    id: 'imp36093-outlier-removal-raises-exponent',
    why: 'Excluding the same-depth caterpillarR outlier must raise the exponent toward linear, matching imp-36018.',
    holds: () =>
      IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.fitResult.excludingOutlierExponent >
      IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.fitResult.fullFitExponent,
  },
  {
    id: 'imp36093-conclusion-mentions-depth-dependent-margin',
    why: 'The conclusion must characterize the over-prediction margin as depth-dependent, not a fixed ratio.',
    holds: () => /MARGIN THAT ITSELF SHRINKS/.test(IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36093-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim proof, RH reduction, or any changed bound.',
    holds: () =>
      IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.honestCaveat.isReductionBelowRH === false &&
      IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36093-verdict-sub-linear-no-qed',
    why: 'The verdict must record SUB-LINEAR and NO QED, matching the imp-36018 source finding.',
    holds: () =>
      /SUB-LINEAR/.test(IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.verdict) &&
      /NO QED/.test(IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36093-pairwise-slack-depth-sublinear-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36093_PAIRWISE_SLACK_DEPTH_SUBLINEAR_HONEST_STATUS;
