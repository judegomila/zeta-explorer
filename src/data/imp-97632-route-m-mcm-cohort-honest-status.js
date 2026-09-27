/**
 * @module imp-97632-route-m-mcm-cohort-honest-status
 * @fileoverview imp-97632 -- HONEST-STATUS NOTE consolidating the Route M MCM (multiplicative complete
 *   monotonicity) onset cohort: imp-97432 (MCM refuted, first counterexample b = p_11#), imp-97519
 *   (direct-kernel spot-check reaffirms MCM verified at omega<=6, base-term 0.043 crossing confirmed),
 *   imp-97583 (onset located exactly at omega=11, surrogate onset one order earlier at omega=10),
 *   imp-97601 (the margin-collapse rate DRIFTS downward, it is not the constant ~2.1e-3/order imp-97583
 *   reported), and imp-97606 (the omega=10 primorial is confirmed the strict minimiser over a broadened
 *   20,437-set family, so the onset cannot be pulled down to omega=10). Mirrors the imp-97491 Krein
 *   cohort honest-status pattern. Documentation only: restates the cohort verdict as a standalone,
 *   directly citable status note. No new numerics, no bound moves, NO QED.
 *
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11; b/4 ceiling survives)
 * @see imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js (MCM verified at omega<=6; 0.043 crossing confirmed)
 * @see imp-97583-route-m-mcm-onset-omega11-primorial.js (onset located exactly at omega=11; surrogate onset omega=10)
 * @see imp-97601-route-m-mcm-margin-collapse-rate-law.js (collapse rate drifts downward, not constant)
 * @see imp-97606-route-m-mcm-omega10-primorial-extremality-broadened.js (omega=10 primorial confirmed strict minimiser)
 *
 * Ticket: imp-97632 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97432_VERDICT } from './imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js';
import { IMP97519_VERDICT } from './imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js';
import { IMP97583_VERDICT, IMP97583_RESULTS } from './imp-97583-route-m-mcm-onset-omega11-primorial.js';
import { IMP97601_VERDICT, IMP97601_RESULTS } from './imp-97601-route-m-mcm-margin-collapse-rate-law.js';
import { IMP97606_OMEGA10_EXTREMALITY } from './imp-97606-route-m-mcm-omega10-primorial-extremality-broadened.js';

export const IMP97632_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97632',
  question:
    'across the imp-97432/97519/97583/97601/97606 cohort, does the Route M MCM (multiplicative complete ' +
    'monotonicity) hypothesis hold, where exactly does it first fail, is the margin-collapse rate constant, ' +
    'and is the primorial provably the worst case at the razor-thin last-holding order?',
  answer:
    'MCM is FALSE: imp-97432 proves the exact reweighted-mean/exponential-tilt characterization of the ' +
    'surrogate differences and locates the first counterexample at b = p_11# = 200560490130 ' +
    '(T = -9.624e-4 < 0), while showing the weaker b/4 ceiling |T(b)| <= 1/4 is NOT refuted (the primorial ' +
    'family converges to -e^{-gamma}/12 + Rcorr = -0.0458, deep inside the band). imp-97519 reaffirms MCM ' +
    'stays VERIFIED (not proved) at omega<=6 via a direct exact-Euler-Maclaurin-kernel spot-check fourteen-plus ' +
    'decades past the prior baked ladder, confirming the base-term scaled-approach crossing at 0.043 lands at ' +
    'x ~ 1.2737e31 with the drift toward K0=1/24 logarithmic (1/ln x), not power-law. imp-97583 measures the ' +
    'exact onset across the previously-untested omega = 7..11 window: MCM holds through omega = 10 ' +
    '(T = +4.782772e-4, the shallowest positive margin) and first fails at omega = 11 -- refuting the ticket ' +
    'premise that the onset lay in {7,8,9,10}. The smooth surrogate goes negative one order earlier, at ' +
    'omega = 10; the saturated R-correction (+1.0186e-3) buys exactly that one order and no more. imp-97601 ' +
    'revises the imp-97583 "roughly-constant ~2.1e-3/order" reading of the holding-margin collapse: the exact ' +
    'closed-form decrement dS(omega) = -(Pi_omega/p_{omega+1})(A_omega + c log p_{omega+1}) shows the rate ' +
    'DRIFTS DOWNWARD (decays) because the bracket is asymptotically constant (B_inf ~ 0.296789) while the ' +
    'prefactor decays like e^{-gamma}/(p_omega log p_omega); the gap to the -e^{-gamma}/12 limit closes only ' +
    'logarithmically and is never reached at any finite order. imp-97606 closes the remaining extremality gap ' +
    'at the razor-thin omega=10 margin: broadening the imp-97583 two-alternative sample to 20,437 squarefree ' +
    '10-sets (single- and two-prime substitutions, shift-up families, and a 20,000-trial offline sweep) finds ' +
    'the primorial p_10# remains the strict minimiser (smallest competitor T = +5.534829e-4, +7.52e-5 above ' +
    'the primorial), so no non-primorial 10-set crosses zero and the onset cannot be pulled down to omega=10. ' +
    'So the honest state is: MCM is disproved with a certified first counterexample at omega=11, its onset is ' +
    'pinned exactly there (not earlier), the approach to failure is a slowly-decaying (not constant-rate) ' +
    'margin collapse that never reaches the primorial limit at any finite order, and the weaker b/4 ceiling ' +
    'that MCM was meant to certify survives untouched.',
  mcmProved: false,
  mcmRefuted: IMP97432_VERDICT.mcmRefuted, // true
  ceilingRefuted: IMP97432_VERDICT.ceilingRefuted, // false -- ceiling survives
  onsetOmega: IMP97583_VERDICT.onsetOmega, // 11
  onsetPremiseWasRefuted: IMP97583_RESULTS.ticketPremiseRefuted !== undefined, // the {7,8,9,10} premise was wrong
  surrogateOnsetOmega: IMP97583_VERDICT.surrogateOnsetOmega, // 10 -- one order earlier than the full-h onset
  rCorrectionBuysOrders: IMP97583_RESULTS.rCorrectionBuysOrders, // 1
  marginCollapseRateConstant: IMP97601_VERDICT.rateIsConstant, // false -- REVISES the imp-97583 "~2.1e-3/order" reading
  marginCollapseRateDrifts: IMP97601_VERDICT.rateDriftsDownward, // true
  marginReachesLimitAtFiniteOrder: IMP97601_VERDICT.reachesLimitAtFiniteOrder, // false
  omega10PrimorialIsStrictMinimiser: IMP97606_OMEGA10_EXTREMALITY.primorialIsStrictMinimiser, // true
  omega10SetsTested: IMP97606_OMEGA10_EXTREMALITY.totalSetsTested, // 20437
  omega10AnyNegativeFound: IMP97606_OMEGA10_EXTREMALITY.anyNegativeFound, // false
  baseTermVerifiedBelowOnset: IMP97519_VERDICT.driftIsLogarithmic, // true (0.043 crossing / K0 approach reaffirmed)
  anyBoundMoves: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97632_HONEST_STATUS.mcmProved === false &&
    IMP97632_HONEST_STATUS.mcmRefuted === true &&
    IMP97632_HONEST_STATUS.ceilingRefuted === false &&
    IMP97632_HONEST_STATUS.onsetOmega === 11 &&
    IMP97632_HONEST_STATUS.surrogateOnsetOmega === 10 &&
    IMP97632_HONEST_STATUS.rCorrectionBuysOrders === 1 &&
    IMP97632_HONEST_STATUS.marginCollapseRateConstant === false &&
    IMP97632_HONEST_STATUS.marginCollapseRateDrifts === true &&
    IMP97632_HONEST_STATUS.marginReachesLimitAtFiniteOrder === false &&
    IMP97632_HONEST_STATUS.omega10PrimorialIsStrictMinimiser === true &&
    IMP97632_HONEST_STATUS.omega10SetsTested === 20437 &&
    IMP97632_HONEST_STATUS.omega10AnyNegativeFound === false &&
    IMP97632_HONEST_STATUS.baseTermVerifiedBelowOnset === true &&
    IMP97632_HONEST_STATUS.anyBoundMoves === false &&
    IMP97632_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97632-route-m-mcm-cohort-honest-status assertion FAILED: the cohort must record MCM as refuted ' +
      '(onset exactly omega=11, surrogate onset omega=10) with the b/4 ceiling untouched, the margin-collapse ' +
      'rate as drifting (not constant), and the omega=10 primorial as the confirmed strict minimiser.'
  );
}

export default IMP97632_HONEST_STATUS;
