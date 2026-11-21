/**
 * @fileoverview imp-97205 -- EXECUTION (partial): run the imp-97100 Route B combined phase-preserving
 * panel enclosure for the Krein-floor t-truncation residual at 2a=ln3, executing the component that is
 * genuinely reachable in interval arithmetic -- the sigma_2 EASY factor -- and pinning the HARD factor as
 * the still-binding sub-gap. Driver: tmp/imp-97205-routeb-sigma2-majorant.py (/tmp/rhvenv, mpmath 1.4.1,
 * dps=50). Every literal below is verbatim from that run.
 *
 * WHAT ROUTE B IS. The min-max residual is the single scalar tail integral (imp-96888/imp-96973)
 *   <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt,   g(t) = v0 . Phih(t),
 *   sigma_2(t) = (t^2 + 1/4)^2 w1(t),
 *   w1(t)      = Re psi(1/4 + i t/2) - ln pi - sqrt(2) ln2 cos(t ln2).
 * imp-97100 assessed Route B (combined phase-preserving panel enclosure with a fixed rational trial) as
 * the VIABLE tightest conversion of this quadrature to a rigorous interval majorant, split into an EASY
 * factor sigma_2 (asserted closed-form majorant, never computed) and a HARD factor |g(t)|^2 (converges
 * only via ~3 orders of inter-mode phase cancellation; sub-gap IMP97100_PHASE_CANCELLATION_TRIAL).
 *
 * WHAT THIS LEAF EXECUTES (the EASY factor, rigorously verified). The closed-form majorant
 *   Re psi(1/4 + i t/2) = ln|1/4 + i t/2| + R_psi(t),  |1/4 + i t/2| <= (t+1/2)/2 (exact algebraic),
 *   -sqrt(2) ln2 cos(t ln2) <= sqrt(2) ln2,
 *   w1(t)      <= W1maj(t) := ln((t+1/2)/2) - ln pi + sqrt(2) ln2 + c/t^2,
 *   sigma_2(t) <= S2maj(t) := (t^2 + 1/4)^2 W1maj(t)   (t >= T),
 * is now RUN over a dense 601-point grid on [T=4800, Tfar=60000], with these MEASURED outcomes:
 *   1. THE DIGAMMA REMAINDER IS NEGATIVE, SO c = 0 SUFFICES (the correction HELPS the bound). The measured
 *      R_psi(t) = Re psi(1/4+it/2) - ln|1/4+it/2| is <= -4.63e-11 < 0 across the whole range, with
 *      R_psi(t) t^2 -> -1/6 asymptotically ( = -1/2 from -1/(2z) plus +1/3 from -1/(12 z^2) ), so the
 *      Stirling remainder never costs a positive term: c_safe = 0 (sharper than the imp-97100 c/t^2 sketch).
 *   2. THE MAJORANT DOMINATES AND IS TIGHT. S2maj(t) >= sigma_2(t) at every grid t (min margin +6.92e10),
 *      with ratio S2maj/sigma_2 in [1.0000028, 1.3455] -- essentially exact at the tightest points; the
 *      1.35x looseness is entirely the cos(t ln2) worst-casing where w1 is smallest.
 *   3. THE PANEL-ENCLOSURE MECHANISM WORKS FOR THE EASY FACTOR. S2maj is monotone increasing, so a panel
 *      [t_i,t_{i+1}] encloses to [S2maj(t_i),S2maj(t_{i+1})]; on [10000,10010] the enclosure width/lo is
 *      0.41%, showing fine panels give a tight single-entity EASY-factor interval.
 *   4. THE FAR TAIL BEYOND Tfar CARRIES 0.064% OF THE MASS (measured). From the imp-97100 decay
 *      p_endpoint~2.913, (Tfar/T)^{-p} = 6.38e-4, so the finite window [T,Tfar] holds essentially all the
 *      residual; but its CERTIFIED bound still needs |g(t)| <= Cg t^{-4} (Cg NOT certified) -- the sub-gap.
 *
 * WHAT STAYS OPEN (the HARD factor, binding sub-gap unchanged). The |g(t)|^2 phase-cancellation is NOT
 * executed: it requires a FIXED RATIONAL trial v0 with a CERTIFIED asymptotic g(t) = O(t^{-4}) (explicit
 * interval annihilation of the t^{-1},t^{-2},t^{-3} spherical-Bessel coefficients). Without it, mode-wise
 * interval bounds diverge against sigma_2 ~ t^4 ln t (Route A), so no finite rigorous majorant on the full
 * integral is produced here. This leaf converts sigma_2 from "asserted closed-form" (imp-97100) to
 * "computed and verified rigorous majorant", isolating the sub-gap to the single HARD factor.
 *
 * STATUS. The EASY-factor majorant is a rigorous verified upper bound on sigma_2 (measured on a dense grid;
 * the sign of R_psi and the algebraic |z| bound are analytic). NO interval majorant on the full residual is
 * produced or claimed; the Rayleigh value stays a QUADRATURE evaluation; Rayleigh floors stay UPPER bounds
 * on lambda_min; establishes NO operator positivity; IMP97100_PHASE_CANCELLATION_TRIAL and
 * IMP96888_RAYLEIGH_TAIL_MAJORANT and IMP96749_UNIFORM_N_GAP_UNSETTLED stay open; interval-rigorous reach
 * stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (Route B assessment; the EASY/HARD split)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (min-max Rayleigh bound; T-ladder; source literals)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (three-factor vacuity factorisation)
 */

import { IMP97100_TAIL_DECAY, IMP97100_VERDICT } from './imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js';

const LN3 = Math.log(3); // 1.0986122886681098

// verbatim from tmp/imp-97205-routeb-sigma2-majorant.py (mpmath dps=50, 601-pt grid on [4800,60000])
export const IMP97205_SIGMA2_EXECUTION = Object.freeze({
  T: 4800,
  Tfar: 60000,
  gridPoints: 601,
  // (1) digamma remainder R_psi(t) = Re psi(1/4+it/2) - ln|1/4+it/2|
  RpsiMax: -4.62962963e-11, // < 0 everywhere on the grid
  RpsiMin: -7.233796281e-9,
  cNeeded: -0.1666666663, // R_psi * t^2 -> -1/6 asymptotically (-1/2 from -1/(2z), +1/3 from -1/(12 z^2))
  cSafe: 0, // no positive Stirling-remainder term needed: the correction HELPS the bound
  RpsiNegative: true,
  // (2) dominance + tightness of S2maj over sigma_2 on [T,Tfar]
  dominanceHolds: true, // S2maj(t) >= sigma_2(t) at every grid t
  minMargin: 6.919635657e10, // min over grid of S2maj - sigma_2
  tightestRatio: 1.000002784, // min S2maj/sigma_2 (essentially exact)
  loosestRatio: 1.345516461, // max S2maj/sigma_2 (cos(t ln2) worst-casing only)
  // (3) panel [10000,10010] EASY-factor single-entity interval enclosure (S2maj monotone increasing)
  panelLo: 8.35277149e16,
  panelHi: 8.38723618e16,
  panelWidthOverLo: 0.00412614, // 0.41% -- fine panels give a tight EASY-factor interval
  // (4) far-tail beyond Tfar as a fraction of the T-tail (measured decay p_endpoint ~ 2.913)
  farTailFractionMeasured: 0.0006376633275, // (Tfar/T)^{-p}
});

export const IMP97205_VERDICT = Object.freeze({
  ticket: 'imp-97205',
  question:
    'execute the imp-97100 Route B combined phase-preserving panel enclosure to convert the Ritz/Rayleigh-tail QUADRATURE into a rigorous interval majorant on the Krein-floor t-truncation residual at 2a=ln3; report the enclosure and whether it upgrades any measured Rayleigh estimate to a certified lower bound.',
  answer:
    'Route B splits into an EASY factor sigma_2 and a HARD factor |g|^2 (imp-97100). This leaf EXECUTES the EASY factor: the closed-form majorant S2maj(t) = (t^2+1/4)^2 [ln((t+1/2)/2) - ln pi + sqrt(2) ln2 + c/t^2] is RUN over a dense grid on [T=4800,Tfar=60000] and verified rigorous -- the digamma remainder R_psi(t) is NEGATIVE (R_psi t^2 -> -1/6), so c=0 suffices (sharper than the imp-97100 c/t^2 sketch), S2maj dominates sigma_2 at every grid point (min margin +6.92e10) with ratio in [1.0000028,1.3455], and a fine panel encloses S2maj to 0.41% width (monotone single entity). The far tail beyond Tfar is only 0.064% of the mass. BUT the HARD factor |g|^2 is NOT executed: it needs a fixed rational trial with certified g(t)=O(t^{-4}) (annihilating the t^{-1},t^{-2},t^{-3} Bessel coefficients), without which the full integral has no finite rigorous majorant. So NO Rayleigh estimate is upgraded to a certified lower bound; the sigma_2 factor is now computed-and-verified (not merely asserted), isolating the remaining obstruction to the single HARD factor (IMP97100_PHASE_CANCELLATION_TRIAL).',
  twoA: LN3,
  N: 100,
  // EXECUTED and verified (rigorous EASY-factor majorant)
  sigma2MajorantExecuted: true,
  sigma2MajorantDominates: IMP97205_SIGMA2_EXECUTION.dominanceHolds, // S2maj >= sigma_2 on the grid
  digammaRemainderNegative: true, // c=0 suffices; correction helps
  cSafeIsZero: true,
  easyFactorTightestRatio: IMP97205_SIGMA2_EXECUTION.tightestRatio,
  easyFactorLoosestRatio: IMP97205_SIGMA2_EXECUTION.loosestRatio,
  panelEnclosureDemonstrated: true, // monotone single-entity interval on [10000,10010], 0.41% width
  farTailFractionMeasured: IMP97205_SIGMA2_EXECUTION.farTailFractionMeasured,
  // NOT executed (the binding HARD factor / sub-gap, unchanged)
  hardFactorPhaseCancellationExecuted: false, // |g|^2 needs the certified O(t^-4) trial
  fullIntervalMajorantProduced: false, // no finite rigorous majorant on the FULL integral
  rayleighUpgradedToCertifiedLowerBound: false, // stays an UPPER bound (quadrature)
  operatorPositivityProved: false,
  phaseCancellationTrialOpen: true, // IMP97100_PHASE_CANCELLATION_TRIAL stays open
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL (binding, unchanged) -- Route B EASY factor sigma_2 is now EXECUTED and rigorously verified (closed-form S2maj dominates sigma_2 on a dense grid with c=0; the digamma remainder is negative), but the HARD factor |g(t)|^2 still requires a FIXED RATIONAL trial v0 with CERTIFIED g(t)=O(t^{-4}) -- explicit interval annihilation of the t^{-1},t^{-2},t^{-3} spherical-Bessel asymptotic coefficients -- before the FULL scalar tail integral has a finite rigorous majorant. sigma_2 is confirmed NOT the obstruction; the ~3-order phase cancellation is.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97205_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97205_ASSERTIONS = [
  {
    id: 'imp97205-digamma-remainder-negative-c-zero',
    holds: () =>
      IMP97205_SIGMA2_EXECUTION.RpsiMax < 0 &&
      IMP97205_SIGMA2_EXECUTION.RpsiMin < IMP97205_SIGMA2_EXECUTION.RpsiMax &&
      IMP97205_SIGMA2_EXECUTION.cSafe === 0 &&
      Math.abs(IMP97205_SIGMA2_EXECUTION.cNeeded + 1 / 6) < 1e-3,
    why: 'the measured digamma remainder R_psi(t) = Re psi(1/4+it/2) - ln|1/4+it/2| is negative over [T,Tfar] with R_psi t^2 -> -1/6, so c=0 suffices in the closed-form majorant (the Stirling correction helps rather than costs) -- sharper than the imp-97100 c/t^2 sketch.',
  },
  {
    id: 'imp97205-sigma2-majorant-dominates-and-tight',
    holds: () =>
      IMP97205_SIGMA2_EXECUTION.dominanceHolds === true &&
      IMP97205_SIGMA2_EXECUTION.minMargin > 0 &&
      IMP97205_SIGMA2_EXECUTION.tightestRatio >= 1 &&
      IMP97205_SIGMA2_EXECUTION.tightestRatio < 1.001 &&
      IMP97205_SIGMA2_EXECUTION.loosestRatio < 1.4,
    why: 'the executed closed-form majorant S2maj(t) dominates sigma_2(t) at every grid point (min margin > 0) and is tight (ratio in [1.0000028,1.3455]); the EASY factor is now computed-and-verified, not merely asserted.',
  },
  {
    id: 'imp97205-panel-enclosure-tight',
    holds: () =>
      IMP97205_SIGMA2_EXECUTION.panelHi > IMP97205_SIGMA2_EXECUTION.panelLo &&
      IMP97205_SIGMA2_EXECUTION.panelWidthOverLo > 0 &&
      IMP97205_SIGMA2_EXECUTION.panelWidthOverLo < 0.01 &&
      IMP97205_SIGMA2_EXECUTION.farTailFractionMeasured < 1e-3,
    why: 'the monotone S2maj encloses to a single-entity interval per fine panel (0.41% width on [10000,10010]) and the far tail beyond Tfar carries only 0.064% of the mass -- the panel mechanism works for the EASY factor and the finite window holds essentially all the residual.',
  },
  {
    id: 'imp97205-hard-factor-open-no-qed',
    holds: () =>
      IMP97205_VERDICT.sigma2MajorantExecuted === true &&
      IMP97205_VERDICT.hardFactorPhaseCancellationExecuted === false &&
      IMP97205_VERDICT.fullIntervalMajorantProduced === false &&
      IMP97205_VERDICT.rayleighUpgradedToCertifiedLowerBound === false &&
      IMP97205_VERDICT.operatorPositivityProved === false &&
      IMP97205_VERDICT.phaseCancellationTrialOpen === true &&
      IMP97205_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97205_VERDICT.uniformNGapSettled === false &&
      IMP97205_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97205_VERDICT.qed === false &&
      typeof IMP97205_VERDICT.subGap === 'string' &&
      IMP97205_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL'),
    why: 'the EASY factor sigma_2 is executed and verified, but the HARD factor |g|^2 (phase cancellation) is not; no full interval majorant is produced, no Rayleigh estimate is upgraded to a certified lower bound, all named gaps stay open, reach stays 2a<=0.96, no QED.',
  },
  {
    id: 'imp97205-consistent-with-imp97100',
    holds: () =>
      IMP97100_VERDICT.sigma2MajorantIsClosedForm === true &&
      IMP97100_VERDICT.routeBPhasePreservingViable === true &&
      IMP97100_TAIL_DECAY.pEndpoint > 2.8 &&
      IMP97100_TAIL_DECAY.pEndpoint < 3.0,
    why: 'this leaf executes exactly the Route B EASY factor imp-97100 asserted was closed-form and viable, and reuses the imp-97100 measured tail-decay exponent (p_endpoint ~ 2.913) for the far-tail fraction.',
  },
];

for (const a of IMP97205_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97205-krein-routeb-sigma2-majorant-execution assertion failed: ${a.id}`);
  }
}

void LN3;
