/**
 * @fileoverview imp-97256 -- import-light honest-status note recording the imp-97182 verdict: a
 * Fejer-Riesz / de Branges square factorisation cannot manufacture a certified margin c > 0 at the
 * binding half-width 2a = ln3 for the pole-free Krein certificate sigma_2 = (t^2+1/4)^2 w_1(t).
 *
 * WHAT imp-97182 SHOWED. The polynomial prefactor (t^2+1/4)^2 = |(t-i/2)^2|^2 = A^2 (A = -D^2+1/4
 * self-adjoint) IS a free, exact Hermitian square, and lifting through it reduces sigma_2-coercivity
 * to w_1-coercivity on lifted band-limited data h = A g (mod boundary terms). But the residual w_1 is
 * exactly the first-order sigma_1 Weil symbol -- negative at the origin (w_1(0) = -6.352 < 0) and with
 * sign UNRESOLVED near ln3 -- so no positive margin survives peeling off the prefactor. Worse, Fejer-Riesz
 * is an EQUIVALENCE, not a certificate: the symbol-level square is unavailable for every c >= 0 (sigma_2
 * dips negative), and the truncated (Mercer) square with margin c exists iff c <= c_sharp =
 * lambda_min(P_a M_sigma2 P_a) -- so producing the SOS with margin c IS certifying c <= c_sharp, the
 * exact open quantity the numerics only bracket from above (0.552 -> 0.504, still descending; imp-97183).
 *
 * WHY A NOTE (not a re-derivation). imp-97182 already carries the full four-step derivation and its own
 * self-executing assertions establish every flag below. This module only records the honest status for
 * the frontier index and posts the do-not-re-attempt gate: symbol-level SOS at 2a = ln3 is a closed door,
 * not an unexplored one.
 *
 * WHAT REMAINS OPEN (unaffected by this closure):
 *   (1) c_sharp = lambda_min(P_a M_sigma2 P_a) itself -- bracketed from above only, no proven lower bound
 *       (imp-97183, still descending at dps=50);
 *   (2) the residual w_1 / sigma_1 sign near ln3 (the half-pole-free CC Q-trick) -- separately unresolved;
 *   (3) the constructive LP-dual square (committed certificate) -- its positive-margin wall sits at
 *       a >= 0.50, below ln3/2 = 0.5493, so it does not reach the binding half-width either.
 * No bound on Lambda moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97182-krein-fejer-riesz-margin-factorisation-attempt.js (source of every verdict flag below)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (named this route; c_sharp definition)
 * @see imp-97183-csharp-extprec-ladder.js (c_sharp bracketed from above only, 0.552 -> 0.504, descending)
 *
 * Ticket: imp-97256 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import IMP97182_DEFAULT, { IMP97182_BINDING_2A, IMP97182_RIGOROUS_REACH_2A, IMP97182_LP_MARGIN_WALL_A } from './imp-97182-krein-fejer-riesz-margin-factorisation-attempt.js';

export const IMP97256_STATUS = Object.freeze({
  ticket: 'imp-97256',
  sourceTicket: 'imp-97182',
  binding2a: IMP97182_BINDING_2A,
  intervalRigorousReach2a: IMP97182_RIGOROUS_REACH_2A,
  lpDualMarginWallA: IMP97182_LP_MARGIN_WALL_A,
  certifiedMarginProduced: IMP97182_DEFAULT.certifiedMarginProduced,
  operatorPositivityProved: IMP97182_DEFAULT.operatorPositivityProved,
  fejerRieszIsEquivalenceNotCertificate: IMP97182_DEFAULT.fejerRieszIsEquivalenceNotCertificate,
  truncatedSquareMarginEqualsCsharp: IMP97182_DEFAULT.truncatedSquareMarginEqualsCsharp,
  cSharpBracketedFromAboveOnly: IMP97182_DEFAULT.cSharpBracketedFromAboveOnly,
  doNotReattemptSymbolLevelSOS: true,
  anyBoundMoved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97256_HONEST_BANNER =
  'imp-97182 result recorded: a Fejer-Riesz / de Branges square factorisation cannot manufacture a ' +
  'certified margin c > 0 at 2a = ln3 -- the free exact prefactor square (t^2+1/4)^2 = |(t-i/2)^2|^2 ' +
  'reduces coercivity to the negative, sign-unresolved residual w_1, and Fejer-Riesz is an EQUIVALENCE ' +
  'whose truncated margin equals c_sharp = lambda_min(P_a M_sigma2 P_a) itself -- the exact unknown the ' +
  'numerics only bracket from above. Do not re-attempt symbol-level SOS at this half-width. No bound on ' +
  'Lambda moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97256_ASSERTIONS = [
  {
    id: 'imp97256-status-matches-committed-imp97182-verdict',
    holds: () =>
      IMP97256_STATUS.certifiedMarginProduced === IMP97182_DEFAULT.certifiedMarginProduced &&
      IMP97256_STATUS.operatorPositivityProved === IMP97182_DEFAULT.operatorPositivityProved &&
      IMP97256_STATUS.fejerRieszIsEquivalenceNotCertificate === IMP97182_DEFAULT.fejerRieszIsEquivalenceNotCertificate &&
      IMP97256_STATUS.truncatedSquareMarginEqualsCsharp === IMP97182_DEFAULT.truncatedSquareMarginEqualsCsharp &&
      IMP97256_STATUS.cSharpBracketedFromAboveOnly === IMP97182_DEFAULT.cSharpBracketedFromAboveOnly &&
      Math.abs(IMP97256_STATUS.binding2a - Math.log(3)) < 1e-12 &&
      IMP97256_STATUS.intervalRigorousReach2a === 0.96 &&
      IMP97256_STATUS.lpDualMarginWallA === 0.50,
    why: 'this honest-status note must reproduce the exact verdict flags already established by imp-97182, not a re-derivation.',
  },
  {
    id: 'imp97256-honesty-gate-no-qed',
    holds: () =>
      IMP97256_STATUS.anyBoundMoved === false &&
      IMP97256_STATUS.operatorPositivityProved === false &&
      IMP97256_STATUS.rhResolved === false &&
      IMP97256_STATUS.qed === false &&
      IMP97256_STATUS.doNotReattemptSymbolLevelSOS === true &&
      /NO QED/.test(IMP97256_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97256_HONEST_BANNER) &&
      /RH open/.test(IMP97256_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open, do-not-re-attempt gate posted.',
  },
];

for (const assertion of IMP97256_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97256-krein-fejer-riesz-margin-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97256_STATUS, banner: IMP97256_HONEST_BANNER };
