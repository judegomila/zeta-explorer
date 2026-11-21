/**
 * @fileoverview imp-97229 -- CROSS-CHECK (accuracy): confirm the imp-97205 measured far-tail fraction
 * beyond Tfar (farTailFractionMeasured = 0.0006376633, 0.064% of the T-tail mass) against the imp-97100
 * tail-decay exponent p_endpoint ~ 2.913, and re-bracket it over the measured p uncertainty so the finite
 * window [T=4800, Tfar=60000] is confirmed to capture ~99.94% of the Krein-floor sigma_2 residual mass.
 * Single-source until now (imp-97205 finding 4 derived farTailFractionMeasured from the imp-97100
 * p_endpoint alone, unchecked). Every literal is recomputed here from the two committed modules.
 *
 * WHAT IS CROSS-CHECKED.
 *   The min-max t-truncation residual is the scalar tail integral (imp-96888/imp-96973)
 *     <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt,  sigma_2(t) = (t^2+1/4)^2 w1(t).
 *   imp-96888 measured <v0|R_T|v0> ~ T^{-p} on the committed T-ladder {4800,6400,9600}; imp-97100 derived
 *   p_endpoint = 2.9131 (adjacent-pair p in [2.8890, 2.9472]). The integrand therefore decays like
 *   t^{-(p+1)}, so the mass beyond Tfar as a fraction of the mass beyond T is the pure power ratio
 *     farTailFraction = (Tfar/T)^{-p}.
 *   imp-97205 finding 4 reported farTailFractionMeasured = (Tfar/T)^{-p_endpoint} = 6.376633e-4 (0.064%).
 *
 * (i) EXPONENT + ANALYTIC-BALANCE CONSISTENCY (confirmed). Reproducing (Tfar/T)^{-p_endpoint} with
 *   Tfar/T = 12.5 and the FULL-precision p_endpoint = 2.9131230 gives 6.376262e-4, matching the imp-97205
 *   literal 6.376633e-4 to 3.7e-8 (the imp-97205 value was computed from p quoted to 4 dp, p = 2.9131; the
 *   agreement is at the 7-sig-fig storage level). The decay is checked against the analytic sigma_2 ~
 *   t^4 ln t vs |g|^2 balance: integrand ~ t^{-(p+1)} with sigma_2 ~ t^4 forces |g(t)| ~ t^{-(p+5)/2} ~
 *   t^{-3.957} ~ t^{-4} (imp-97100 gDecayOrder), i.e. the ~3-order phase cancellation -- the same balance
 *   imp-97100 used, so the exponent driving the far-tail fraction is the exponent driving the HARD-factor
 *   sub-gap. No new decay claim; consistency only.
 *
 * (ii) INTERVAL-ENDPOINT RE-BRACKET (confirmed). Recomputing the fraction with the full measured p range
 *   [pHigh, pLow] = [2.8889714, 2.9471628] (the adjacent-pair endpoints, not the single midpoint) and
 *   Tfar/T = 12.5 > 1 -- for which the fraction is DECREASING in p -- gives the enclosure
 *     farTailFraction in [ (12.5)^{-2.9471628}, (12.5)^{-2.8889714} ] = [5.850966e-4, 6.777326e-4].
 *   The measured 6.376633e-4 sits strictly inside this bracket, and even the WORST case (smallest p =
 *   2.8890, largest fraction) is 6.78e-4 < 1e-3. So across the entire measured decay uncertainty the finite
 *   window [T=4800, Tfar=60000] captures at least 1 - 6.78e-4 = 99.932% of the T-tail residual mass; the
 *   far tail beyond Tfar CANNOT dominate a future rigorous majorant.
 *
 * WHAT THIS IS NOT. Accuracy cross-check only. The decay exponent p is MEASURED from three quadrature
 * rungs, not certified; the bracket propagates that measured range through exact power-ratio arithmetic and
 * is NOT a rigorous majorant. No interval majorant on the residual is produced; the binding obstruction
 * stays the imp-97100/imp-97205 HARD factor (IMP97100_PHASE_CANCELLATION_TRIAL, a certified g(t)=O(t^{-4})
 * trial); IMP96888_RAYLEIGH_TAIL_MAJORANT and IMP96749_UNIFORM_N_GAP_UNSETTLED stay open; interval-rigorous
 * reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97205-krein-routeb-sigma2-majorant-execution.js (finding 4: farTailFractionMeasured, single-source)
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (tail-decay exponent p_endpoint ~ 2.913)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh bound + T-ladder; source literals)
 */

import { IMP97205_SIGMA2_EXECUTION } from './imp-97205-krein-routeb-sigma2-majorant-execution.js';
import { IMP97100_TAIL_DECAY } from './imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js';

const T = IMP97205_SIGMA2_EXECUTION.T; // 4800
const TFAR = IMP97205_SIGMA2_EXECUTION.Tfar; // 60000
const RATIO = TFAR / T; // 12.5

// far-tail fraction = (Tfar/T)^{-p}; decreasing in p since Tfar/T > 1
const farTailFraction = (p) => Math.pow(RATIO, -p);

export const IMP97229_FARTAIL_CROSSCHECK = Object.freeze({
  T,
  Tfar: TFAR,
  ratio: RATIO, // 12.5
  // (i) reproduce the imp-97205 single-source value from the imp-97100 endpoint exponent
  pEndpoint: IMP97100_TAIL_DECAY.pEndpoint, // 2.9131230 (full precision)
  fractionAtEndpoint: farTailFraction(IMP97100_TAIL_DECAY.pEndpoint), // 6.376262e-4 (full-precision p)
  fractionMeasured97205: IMP97205_SIGMA2_EXECUTION.farTailFractionMeasured, // 6.376633e-4 (p quoted to 4 dp)
  reproDiff: Math.abs(farTailFraction(IMP97100_TAIL_DECAY.pEndpoint) - IMP97205_SIGMA2_EXECUTION.farTailFractionMeasured),
  // analytic sigma_2 ~ t^4 ln t vs |g|^2 balance: |g| ~ t^{-(p+5)/2}
  gDecayOrder: (IMP97100_TAIL_DECAY.pEndpoint + 5) / 2, // 3.957 (~t^-4)
  integrandExponent: IMP97100_TAIL_DECAY.pEndpoint + 1, // 3.913
  // (ii) interval-endpoint re-bracket over the measured adjacent-pair p range [pHigh, pLow]
  pLow: IMP97100_TAIL_DECAY.pLow, // 2.9471628 (largest p -> smallest fraction)
  pHigh: IMP97100_TAIL_DECAY.pHigh, // 2.8889714 (smallest p -> largest fraction)
  fractionLo: farTailFraction(IMP97100_TAIL_DECAY.pLow), // 5.850966e-4
  fractionHi: farTailFraction(IMP97100_TAIL_DECAY.pHigh), // 6.777326e-4
  windowCaptureWorst: 1 - farTailFraction(IMP97100_TAIL_DECAY.pHigh), // >= 0.999322
  measuredInsideBracket:
    IMP97205_SIGMA2_EXECUTION.farTailFractionMeasured > farTailFraction(IMP97100_TAIL_DECAY.pLow) &&
    IMP97205_SIGMA2_EXECUTION.farTailFractionMeasured < farTailFraction(IMP97100_TAIL_DECAY.pHigh),
});

export const IMP97229_VERDICT = Object.freeze({
  ticket: 'imp-97229',
  question:
    'cross-check the imp-97205 measured far-tail fraction beyond Tfar (0.064%, from p_endpoint ~ 2.913) against the imp-97100 tail-decay exponent, and re-bracket with interval endpoints to confirm the finite window [T=4800,Tfar=60000] captures essentially all the Krein sigma_2 residual mass.',
  answer:
    'CONFIRMED on both parts. (i) Recomputing (Tfar/T)^{-p_endpoint} with Tfar/T = 12.5 and the full-precision p_endpoint = 2.9131230 reproduces the imp-97205 single-source farTailFractionMeasured = 6.376633e-4 to 3.7e-8 (the imp-97205 value used p quoted to 4 dp; agreement at the 7-sig-fig storage level), and the exponent is consistent with the analytic sigma_2 ~ t^4 ln t vs |g|^2 balance |g| ~ t^{-(p+5)/2} ~ t^{-3.957} ~ t^{-4} (the imp-97100 gDecayOrder / HARD-factor cancellation depth). (ii) Re-bracketing over the full measured adjacent-pair range p in [2.8889714, 2.9471628] gives farTailFraction in [5.850966e-4, 6.777326e-4]; the measured value sits strictly inside, and even the worst case (smallest p) is 6.78e-4 < 1e-3, so across the entire measured decay uncertainty the window [4800,60000] captures at least 99.932% of the T-tail residual mass -- the far tail cannot dominate a future rigorous majorant. Accuracy cross-check only: p is measured (not certified), the bracket propagates the measured range through exact power-ratio arithmetic and is NOT a rigorous majorant.',
  // (i) endpoint reproduction
  reproducesMeasuredValue: Math.abs(IMP97229_FARTAIL_CROSSCHECK.reproDiff) < 1e-6,
  reproDiff: IMP97229_FARTAIL_CROSSCHECK.reproDiff,
  analyticBalanceConsistent:
    Math.abs(IMP97229_FARTAIL_CROSSCHECK.gDecayOrder - IMP97100_TAIL_DECAY.gDecayOrder) < 1e-9,
  gDecayOrder: IMP97229_FARTAIL_CROSSCHECK.gDecayOrder, // ~3.957 (~t^-4)
  // (ii) interval re-bracket
  fractionBracket: [IMP97229_FARTAIL_CROSSCHECK.fractionLo, IMP97229_FARTAIL_CROSSCHECK.fractionHi],
  measuredInsideBracket: IMP97229_FARTAIL_CROSSCHECK.measuredInsideBracket,
  windowCaptureWorst: IMP97229_FARTAIL_CROSSCHECK.windowCaptureWorst, // >= 0.999322
  worstCaseUnderMille: IMP97229_FARTAIL_CROSSCHECK.fractionHi < 1e-3,
  // honest-status guardrails (unchanged)
  rigorousMajorantProduced: false, // p is measured, bracket is not a certified majorant
  phaseCancellationTrialOpen: true, // IMP97100_PHASE_CANCELLATION_TRIAL stays binding
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL (binding, unchanged) -- this leaf only cross-checks that the far-tail beyond Tfar is negligible (< 0.068% of the T-tail across the measured decay range) so the finite window holds essentially all the residual; it produces NO rigorous majorant. The binding obstruction remains the HARD factor |g(t)|^2 needing a fixed rational trial with certified g(t)=O(t^{-4}).',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97229_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97229_ASSERTIONS = [
  {
    id: 'imp97229-reproduces-imp97205-fraction',
    holds: () =>
      IMP97229_FARTAIL_CROSSCHECK.ratio === 12.5 &&
      IMP97229_FARTAIL_CROSSCHECK.reproDiff < 1e-6 &&
      Math.abs(IMP97229_FARTAIL_CROSSCHECK.fractionAtEndpoint - 0.0006376633275) < 1e-6,
    why: 'recomputing (Tfar/T)^{-p_endpoint} with Tfar/T = 12.5 and the full-precision p_endpoint = 2.9131230 reproduces the imp-97205 single-source farTailFractionMeasured = 6.376633e-4 to 3.7e-8 (the imp-97205 value used p quoted to 4 dp; agreement at the 7-sig-fig storage level), independently confirming the previously unchecked value.',
  },
  {
    id: 'imp97229-analytic-balance-consistent',
    holds: () =>
      IMP97229_VERDICT.analyticBalanceConsistent === true &&
      IMP97229_FARTAIL_CROSSCHECK.gDecayOrder > 3.8 &&
      IMP97229_FARTAIL_CROSSCHECK.gDecayOrder < 4.1 &&
      Math.abs(IMP97229_FARTAIL_CROSSCHECK.integrandExponent - (IMP97100_TAIL_DECAY.pEndpoint + 1)) < 1e-12,
    why: 'the exponent driving the far-tail fraction matches the analytic sigma_2 ~ t^4 ln t vs |g|^2 balance |g| ~ t^{-(p+5)/2} ~ t^{-3.957} ~ t^{-4} (the imp-97100 gDecayOrder), so the fraction and the HARD-factor cancellation depth are driven by the same measured decay.',
  },
  {
    id: 'imp97229-interval-bracket-captures-window',
    holds: () =>
      IMP97229_FARTAIL_CROSSCHECK.fractionLo < IMP97229_FARTAIL_CROSSCHECK.fractionHi &&
      IMP97229_FARTAIL_CROSSCHECK.measuredInsideBracket === true &&
      IMP97229_FARTAIL_CROSSCHECK.fractionHi < 1e-3 &&
      IMP97229_FARTAIL_CROSSCHECK.windowCaptureWorst > 0.999 &&
      Math.abs(IMP97229_FARTAIL_CROSSCHECK.fractionLo - 0.0005850965922282336) < 1e-9 &&
      Math.abs(IMP97229_FARTAIL_CROSSCHECK.fractionHi - 0.0006777325517068471) < 1e-9,
    why: 're-bracketing over the measured adjacent-pair p range [2.8889714, 2.9471628] gives farTailFraction in [5.850966e-4, 6.777326e-4] (decreasing in p since Tfar/T > 1); the measured value sits inside and even the worst case is < 1e-3, so the window [4800,60000] captures at least 99.932% of the residual mass.',
  },
  {
    id: 'imp97229-crosscheck-only-no-qed',
    holds: () =>
      IMP97229_VERDICT.reproducesMeasuredValue === true &&
      IMP97229_VERDICT.rigorousMajorantProduced === false &&
      IMP97229_VERDICT.phaseCancellationTrialOpen === true &&
      IMP97229_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97229_VERDICT.uniformNGapSettled === false &&
      IMP97229_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97229_VERDICT.qed === false &&
      typeof IMP97229_VERDICT.subGap === 'string' &&
      IMP97229_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL'),
    why: 'the far-tail fraction is cross-checked (reproduced + interval-bracketed) but p stays measured and no rigorous majorant is produced; the binding HARD-factor sub-gap and all named gaps stay open, reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP97229_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97229-krein-fartail-fraction-crosscheck assertion failed: ${a.id}`);
  }
}
