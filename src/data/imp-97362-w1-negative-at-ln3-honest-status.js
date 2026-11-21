/**
 * @fileoverview imp-97362 -- import-light honest-status note recording the imp-97336 result: the
 * bare residual symbol w_1(t) = 2 theta'(t) - sqrt2 ln2 cos(t ln2) (the half-pole-free CC Q-trick
 * residual left after peeling both free prefactor squares off sigma_2 = (t^2+1/4)^2 w_1) is
 * definitively NEGATIVE at and around the band edge t = ln 3: w_1(ln3) = -2.5946, and w_1 stays
 * negative across the whole edge neighbourhood ([0.9, 2.0] sampled, all negative) and on the entire
 * leading interval [0, 3.30501). The negative mass over the resolution window [0, pi/a] (fixed at
 * 7.2641) dominates the positive mass, by 5.740x at 2a = ln3, and the ratio WORSENS past the verified
 * reach (4.541x at 2a = 0.96 -> 6.730x at 2a = 1.16).
 *
 * WHAT THIS CLOSES. imp-97256 recorded residual (2) as "the residual w_1 / sigma_1 sign near ln3 --
 * separately unresolved". imp-97336 resolves it: the sign is NOT unresolved -- it is pointwise
 * NEGATIVE, unambiguously, at and around ln3. So residual (2) was never a symbol-level ambiguity; it
 * is (and always was) the truncated-cancellation question, i.e. exactly c_sharp =
 * lambda_min(P_a M_sigma2 P_a), the same exact open quantity residual (1) already named (bracketed
 * from above only, imp-97183/imp-97206).
 *
 * WHY A NOTE (not a re-derivation). imp-97336 already carries the full measurement (zero crossings,
 * band-edge values, resolution-window mass ladder) and its own self-executing assertions establish
 * every flag below. This module only records the honest status for the frontier index and folds
 * residual (2) into residual (1): there is now a single surviving open object, not two.
 *
 * WHAT REMAINS OPEN (unaffected by this closure): c_sharp itself -- bracketed from above only, no
 * proven lower bound (imp-97183/imp-97206, still descending). No bound on Lambda moves;
 * interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97336-w1-residual-sign-profile-near-ln3.js (source of every verdict flag below)
 * @see imp-97256-krein-fejer-riesz-margin-honest-status.js (residual (2), here closed)
 * @see imp-97182-krein-fejer-riesz-margin-factorisation-attempt.js (defines residual (1) and (2))
 * @see imp-97183-csharp-extprec-ladder.js (c_sharp bracketed from above only -- the sole surviving open object)
 *
 * Ticket: imp-97362 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import IMP97336_DEFAULT, { IMP97336_BANNER } from './imp-97336-w1-residual-sign-profile-near-ln3.js';

export const IMP97362_STATUS = Object.freeze({
  ticket: 'imp-97362',
  sourceTicket: 'imp-97336',
  closesResidual: 'imp-97256 residual (2): w_1 / sigma_1 sign near ln3',
  bindingBandEdge2a: IMP97336_DEFAULT.bindingBandEdge2a,
  intervalRigorousReach2a: IMP97336_DEFAULT.intervalRigorousReach2a,
  w1AtLn3: IMP97336_DEFAULT.w1AtLn3,
  w1NegativeAtBandEdge: IMP97336_DEFAULT.w1NegativeAtBandEdge,
  w1NegativeOnWholeLeadingInterval: IMP97336_DEFAULT.w1NegativeOnWholeLeadingInterval,
  negMassDominatesResolutionWindow: IMP97336_DEFAULT.negMassDominatesResolutionWindow,
  dominanceWorsensPastVerifiedReach: IMP97336_DEFAULT.dominanceWorsensPastVerifiedReach,
  pointwiseSignResolvedNegative: IMP97336_DEFAULT.pointwiseSignResolvedNegative,
  residualTwoWasSymbolAmbiguity: false, // it was always a truncation question, now confirmed not pointwise
  residualsMergeIntoSingleOpenObject: true, // residual (1) and (2) are now the same object: c_sharp
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97362_HONEST_BANNER =
  'imp-97336 result recorded: the bare residual symbol w_1 is definitively NEGATIVE at and around the ' +
  'band edge 2a = ln3 (w_1(ln3) = -2.5946, negative on the whole leading interval [0, 3.30501), negative ' +
  'mass dominating positive mass 5.740x at ln3 and worsening past the verified reach). So imp-97256 ' +
  'residual (2) was never a pointwise-symbol ambiguity -- it is (and always was) the truncated-' +
  'cancellation question, i.e. exactly c_sharp = lambda_min(P_a M_sigma2 P_a), the same object residual ' +
  '(1) already named. The two residuals merge into one surviving open object, bracketed from above only. ' +
  'No bound on Lambda moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; ' +
  'RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97362_ASSERTIONS = [
  {
    id: 'imp97362-status-matches-committed-imp97336-verdict',
    holds: () =>
      IMP97362_STATUS.w1AtLn3 === IMP97336_DEFAULT.w1AtLn3 &&
      IMP97362_STATUS.w1NegativeAtBandEdge === IMP97336_DEFAULT.w1NegativeAtBandEdge &&
      IMP97362_STATUS.w1NegativeOnWholeLeadingInterval === IMP97336_DEFAULT.w1NegativeOnWholeLeadingInterval &&
      IMP97362_STATUS.negMassDominatesResolutionWindow === IMP97336_DEFAULT.negMassDominatesResolutionWindow &&
      IMP97362_STATUS.dominanceWorsensPastVerifiedReach === IMP97336_DEFAULT.dominanceWorsensPastVerifiedReach &&
      IMP97362_STATUS.pointwiseSignResolvedNegative === IMP97336_DEFAULT.pointwiseSignResolvedNegative &&
      Math.abs(IMP97362_STATUS.bindingBandEdge2a - Math.log(3)) < 1e-12 &&
      IMP97362_STATUS.intervalRigorousReach2a === 0.96,
    why: 'this honest-status note must reproduce the exact verdict flags already established by imp-97336, not a re-derivation.',
  },
  {
    id: 'imp97362-honesty-gate-no-qed',
    holds: () =>
      IMP97362_STATUS.anyBoundMoved === false &&
      IMP97362_STATUS.operatorPositivityProved === false &&
      IMP97362_STATUS.rhResolved === false &&
      IMP97362_STATUS.qed === false &&
      IMP97362_STATUS.residualTwoWasSymbolAmbiguity === false &&
      IMP97362_STATUS.residualsMergeIntoSingleOpenObject === true &&
      /NO QED/.test(IMP97362_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97362_HONEST_BANNER) &&
      /RH open/.test(IMP97362_HONEST_BANNER) &&
      /negative/i.test(IMP97336_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open, residuals correctly merged.',
  },
];

for (const assertion of IMP97362_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97362-w1-negative-at-ln3-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97362_STATUS, banner: IMP97362_HONEST_BANNER };
