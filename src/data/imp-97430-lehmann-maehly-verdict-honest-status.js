/**
 * @fileoverview imp-97430 -- import-light honest-status note recording the imp-97400 verdict for the
 * Lehmann-Maehly / interval finite-section LOWER-bracket attempt on the Krein concentration constant
 * c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a = ln3.
 *
 * imp-97400 EXECUTED (not merely assessed) the Lehmann-Maehly enclosure and found three things:
 *   1. The spectral gap is LARGE, not small: lambda_2 - lambda_1 = 83.090493 - 0.543044 = 82.547449
 *      (Ritz upper brackets, N=28, T=200) -- correcting the imp-97136 worry that a small a-priori
 *      separation might be the binding obstruction. The break-even residual budget eta_max =
 *      sqrt(mu(lambda_2-mu)) = 6.695287 is generous.
 *   2. The uncompressed second-moment surrogate A2 = <M phi_i, M phi_j> = (1/pi) int sigma_2^2 R_i R_j dt
 *      is VACUOUS: M2 = 1.2527831e8, eta = 11192.779 -- three orders of magnitude past the break-even
 *      6.695287 -- because it references M_sigma2, which is unbounded below to -4336.198 (imp-97335).
 *   3. The trial-space compressed surrogate A2 = A1 A0^{-1} A1 is CIRCULAR: it returns exactly
 *      mu = 0.543044 (the Ritz UPPER value) for every shift rho, because the Ritz vector is an exact
 *      eigenvector of the finite-section operator (residual eta2 = 0 there).
 *
 * WHAT THIS CLOSES. Before imp-97400, it was open whether the a-priori spectral gap might be the binding
 * wall for a Lehmann-Maehly lower bracket. imp-97400 settles this negatively: the gap is generous. The
 * binding wall is instead the compressed second-moment (graph-norm) object A2 = <A phi_i, A phi_j> with
 * A = P_a M_sigma2 P_a: it needs the FULL band projector P_a (a sinc-kernel double integral, the
 * imp-97399 reproducing-kernel primitive), not either surrogate tried here. Even with the genuine A2, a
 * certified rho <= lambda_2 (imp-97415) is still required, since Rayleigh-Ritz only supplies the
 * wrong-direction upper bracket on lambda_2.
 *
 * WHY A NOTE (not a re-derivation). imp-97400 already carries the full execution (both surrogate builds,
 * the measured gap, every verdict flag) and its own self-executing assertions establish every flag below.
 * This module only records the honest status for the frontier index.
 *
 * WHAT REMAINS OPEN (unaffected by this closure): c_sharp itself -- bracketed from above only at 0.581059
 * (imp-97183/imp-97206/imp-97379), no proven positive lower bound. No bound on Lambda moves;
 * interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97400-krein-lehmann-maehly-lower-bracket-execution.js (source of every verdict flag below)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (the small-gap worry corrected by Finding 1)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (inf_t sigma_2 = -4336.198, why the uncompressed surrogate is vacuous)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (the FULL band-projector primitive the genuine A2 needs)
 *
 * Ticket: imp-97430 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import {
  IMP97400_RITZ,
  IMP97400_SURROGATE_UNCOMPRESSED,
  IMP97400_SURROGATE_TRIAL_COMPRESSED,
  IMP97400_VERDICT,
  IMP97400_BINDING_2A,
  IMP97400_BEST_UPPER_BRACKET,
} from './imp-97400-krein-lehmann-maehly-lower-bracket-execution.js';

export const IMP97430_STATUS = Object.freeze({
  ticket: 'imp-97430',
  sourceTicket: 'imp-97400',
  bindingBandEdge2a: IMP97400_BINDING_2A,
  gapUpperBrackets: IMP97400_RITZ.gapUpperBrackets,
  gapIsLargeNotSmall: IMP97400_RITZ.gapIsLargeNotSmall,
  uncompressedM2: IMP97400_SURROGATE_UNCOMPRESSED.M2,
  uncompressedEta: IMP97400_SURROGATE_UNCOMPRESSED.eta,
  uncompressedEtaBreakEven: IMP97400_SURROGATE_UNCOMPRESSED.etaBreakEven,
  uncompressedSecondMomentVacuous: IMP97400_VERDICT.uncompressedSecondMomentVacuous,
  trialCompressedReturnsRitzUpperValue: IMP97400_SURROGATE_TRIAL_COMPRESSED.returnsRitzUpperValue,
  trialCompressedSecondMomentCircular: IMP97400_VERDICT.trialCompressedSecondMomentCircular,
  genuineSecondMomentNeedsFullProjector: IMP97400_VERDICT.genuineSecondMomentNeedsFullProjector,
  bindingObstructionIsSecondMomentNotGap: IMP97400_VERDICT.bindingObstructionIsSecondMomentNotGap,
  rigorousLowerBoundProduced: IMP97400_VERDICT.rigorousLowerBoundProduced,
  bestUpperBracket: IMP97400_BEST_UPPER_BRACKET,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97430_HONEST_BANNER =
  'imp-97400 result recorded: the Lehmann-Maehly spectral gap is LARGE (lambda_2 - lambda_1 = 82.547449, ' +
  'correcting the imp-97136 small-gap worry), the uncompressed second-moment surrogate A2 is VACUOUS ' +
  '(M2 = 1.2527831e8, eta = 11192.779 vs break-even 6.695287) because it references M_sigma2 unbounded ' +
  'below to -4336.198, and the trial-space compressed surrogate A2 is CIRCULAR (returns exactly the Ritz ' +
  'upper bracket 0.543044 for every shift rho). The binding obstruction is the compressed second-moment ' +
  '(graph-norm) object, not the spectral gap; a genuine bracket needs the FULL band projector P_a. No ' +
  'bound on Lambda moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH ' +
  'open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97430_ASSERTIONS = [
  {
    id: 'imp97430-status-matches-committed-imp97400-verdict',
    holds: () =>
      IMP97430_STATUS.gapUpperBrackets === IMP97400_RITZ.gapUpperBrackets &&
      IMP97430_STATUS.gapIsLargeNotSmall === true &&
      IMP97430_STATUS.uncompressedM2 === IMP97400_SURROGATE_UNCOMPRESSED.M2 &&
      IMP97430_STATUS.uncompressedSecondMomentVacuous === true &&
      IMP97430_STATUS.trialCompressedSecondMomentCircular === true &&
      IMP97430_STATUS.genuineSecondMomentNeedsFullProjector === true &&
      IMP97430_STATUS.bindingObstructionIsSecondMomentNotGap === true &&
      IMP97430_STATUS.gapUpperBrackets > 10 &&
      IMP97430_STATUS.uncompressedEta > IMP97430_STATUS.uncompressedEtaBreakEven &&
      Math.abs(IMP97430_STATUS.bindingBandEdge2a - Math.log(3)) < 1e-12,
    why: 'this honest-status note must reproduce the exact verdict flags and measured numbers already established by imp-97400, not a re-derivation.',
  },
  {
    id: 'imp97430-honesty-gate-no-qed',
    holds: () =>
      IMP97430_STATUS.rigorousLowerBoundProduced === false &&
      IMP97430_STATUS.anyBoundMoved === false &&
      IMP97430_STATUS.operatorPositivityProved === false &&
      IMP97430_STATUS.rhResolved === false &&
      IMP97430_STATUS.qed === false &&
      /NO QED/.test(IMP97430_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97430_HONEST_BANNER) &&
      /RH open/.test(IMP97430_HONEST_BANNER) &&
      /VACUOUS/.test(IMP97430_HONEST_BANNER) &&
      /CIRCULAR/.test(IMP97430_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97430_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97430-lehmann-maehly-verdict-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97430_STATUS, banner: IMP97430_HONEST_BANNER };
