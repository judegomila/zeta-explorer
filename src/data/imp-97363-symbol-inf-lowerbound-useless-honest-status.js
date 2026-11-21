/**
 * @fileoverview imp-97363 -- import-light honest-status note recording the imp-97335 result: the ONLY
 * band-limit-free lower bound on the Krein concentration constant c_sharp = lambda_min(P_a M_sigma2 P_a)
 * at 2a = ln3 -- the naive Gershgorin/Rayleigh symbol infimum c_sharp >= inf_t sigma_2(t) -- is DEEPLY
 * NEGATIVE (global infimum -4336.198026 at t = 9.3502, sigma_2(0) = -0.397028), and hence certifies NO
 * positivity. This CONFIRMS the band-limit psi in PW_a is essential: no symbol-only argument can ever
 * reach c_sharp positivity, so the Gershgorin/Rayleigh route is a closed door for this problem.
 *
 * WHAT THIS CLOSES. Before imp-97335, it was open whether the plain symbol infimum -- the cheapest
 * possible lower-bound argument, needing no band-limit machinery at all -- might already be enough to
 * certify c_sharp > 0. imp-97335 settles this negatively: the quartic prefactor (t^2+1/4)^2 amplifies the
 * negative w_1 well (w_1 only turns positive past t ~ 17) so far below zero that the naive bound is
 * useless by more than three orders of magnitude relative to the measured upper bracket (~0.582,
 * imp-97183/imp-97206). So the ONLY route to a lower bound must use the band-limit constraint.
 *
 * WHY A NOTE (not a re-derivation). imp-97335 already carries the full measurement (symbol values,
 * argmin, the confined-well shape) and its own self-executing assertions establish every flag below.
 * This module only records the honest status for the frontier index: the Gershgorin/Rayleigh route is
 * ruled out as a lever, sharpening the open sub-gap to band-limit-aware methods only.
 *
 * WHAT REMAINS OPEN (unaffected by this closure): c_sharp itself -- bracketed from above only, no
 * proven positive lower bound (imp-97183/imp-97206, extrapolates to a measured ~0.582 but N unconverged).
 * No bound on Lambda moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (source of every verdict flag below)
 * @see imp-97183-csharp-extprec-ladder.js (c_sharp bracketed from above only -- the surviving open object)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (c_sharp = lambda_min(P_a M_sigma2 P_a) definition)
 *
 * Ticket: imp-97363 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import IMP97335_DEFAULT, { IMP97335_NAIVE_SYMBOL_INF, IMP97335_BINDING_2A } from './imp-97335-krein-csharp-naive-lowerbound-tlimit.js';

export const IMP97363_STATUS = Object.freeze({
  ticket: 'imp-97363',
  sourceTicket: 'imp-97335',
  bindingBandEdge2a: IMP97335_BINDING_2A,
  naiveSymbolInfGlobalMin: IMP97335_NAIVE_SYMBOL_INF.globalInf,
  naiveSymbolInfArgmin: IMP97335_NAIVE_SYMBOL_INF.argmin,
  naiveSymbolInfAtZero: IMP97335_NAIVE_SYMBOL_INF.sigma2AtZero,
  naiveBoundIsNegativeHenceUseless: IMP97335_NAIVE_SYMBOL_INF.isNegativeHenceUseless,
  bandLimitIsEssential: IMP97335_NAIVE_SYMBOL_INF.bandLimitIsEssential,
  gershgorinRayleighRouteClosedForPositivity: IMP97335_DEFAULT.gershgorinRayleighRouteClosedForPositivity,
  rigorousLowerBoundProduced: IMP97335_DEFAULT.rigorousLowerBoundProduced,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97363_HONEST_BANNER =
  'imp-97335 result recorded: the naive band-limit-free lower bound c_sharp >= inf_t sigma_2(t) is DEEPLY ' +
  'NEGATIVE (global infimum -4336.198026 at t = 9.3502, sigma_2(0) = -0.397028), so it certifies NO ' +
  'positivity and is USELESS as a lever. This confirms the band-limit psi in PW_a is essential: the plain ' +
  'Gershgorin/Rayleigh symbol argument is a closed door for c_sharp positivity, and any future lower-bound ' +
  'attempt must use band-limit-aware methods. No bound on Lambda moves; interval-rigorous reach stays ' +
  '2a <= 0.96; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97363_ASSERTIONS = [
  {
    id: 'imp97363-status-matches-committed-imp97335-verdict',
    holds: () =>
      IMP97363_STATUS.naiveSymbolInfGlobalMin === IMP97335_NAIVE_SYMBOL_INF.globalInf &&
      IMP97363_STATUS.naiveSymbolInfArgmin === IMP97335_NAIVE_SYMBOL_INF.argmin &&
      IMP97363_STATUS.naiveSymbolInfAtZero === IMP97335_NAIVE_SYMBOL_INF.sigma2AtZero &&
      IMP97363_STATUS.naiveBoundIsNegativeHenceUseless === true &&
      IMP97363_STATUS.bandLimitIsEssential === true &&
      IMP97363_STATUS.gershgorinRayleighRouteClosedForPositivity === true &&
      IMP97363_STATUS.naiveSymbolInfGlobalMin < -1000 &&
      Math.abs(IMP97363_STATUS.bindingBandEdge2a - Math.log(3)) < 1e-12,
    why: 'this honest-status note must reproduce the exact verdict flags already established by imp-97335, not a re-derivation.',
  },
  {
    id: 'imp97363-honesty-gate-no-qed',
    holds: () =>
      IMP97363_STATUS.rigorousLowerBoundProduced === false &&
      IMP97363_STATUS.anyBoundMoved === false &&
      IMP97363_STATUS.operatorPositivityProved === false &&
      IMP97363_STATUS.rhResolved === false &&
      IMP97363_STATUS.qed === false &&
      /NO QED/.test(IMP97363_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97363_HONEST_BANNER) &&
      /RH open/.test(IMP97363_HONEST_BANNER) &&
      /USELESS/.test(IMP97363_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97363_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97363-symbol-inf-lowerbound-useless-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97363_STATUS, banner: IMP97363_HONEST_BANNER };
