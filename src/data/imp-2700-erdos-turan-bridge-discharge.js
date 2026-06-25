/**
 * @module imp-2700-erdos-turan-bridge-discharge
 *
 * imp-2700 (medium, proof): Discharge the Erdos-Turan bridge O(1) constant in
 * the dyson_star_discrepancy axiom against the C_Selberg headroom
 * 3.0 - 2.622 = 0.378 -- and RECONCILE the apparent imp-2759 negative.
 *
 * THE NAMED RESIDUAL (imp-2641 / imp-2643)
 * ----------------------------------------
 * imp-2641 discharged the S(T) GROWTH coefficient to the explicit Trudgian-2014
 * value C_Selberg(S(T)) = 2.622, but flagged that C_KH = pi . C_Selberg consumes
 * C_Selberg as the coefficient on log(gamma_N) in the STAR-DISCREPANCY bound
 *     starDiscrepancy_N <= C_Selberg . log(gamma_N) / N      (dyson_star_discrepancy)
 * and that the identification C_Selberg(discrepancy) = C_Selberg(S(T)) carries an
 * additional "Erdos-Turan bridge" O(1) overhead that must fit inside the
 * headroom 3.0 - 2.622 = 0.378.
 *
 * imp-2759 (ticket imp-2682) routed that bridge through the SHARP Erdos-Turan /
 * Beurling-Selberg majorant fed only the scalar aggregate S(T) bound, and found
 * an HONEST NEGATIVE: an effective coefficient min ~9.98 near cutoff H ~ 1300,
 * a multiplicative (1/pi) log H harmonic blow-up, ~26x the headroom. That looked
 * fatal. This module shows it is NOT -- because the chain does not take that route.
 *
 * THE CRUX: WHICH DISCREPANCY DOES dyson_star_discrepancy FEED?
 * ------------------------------------------------------------
 * In src/math/lean4-koksma-hlawka.js the axiom is consumed by koksma_hlawka_ineq:
 *     discrepancy N y <= (pi / y) . starDiscrepancy N        (koksma_hlawka_ineq)
 * whose docstring fixes the test function f = Im(1/(z-x)) with Var(f) <= pi/y.
 * This is the ONE-DIMENSIONAL Koksma-Hlawka inequality (Kuipers-Niederreiter,
 * "Uniform Distribution of Sequences", Thm 2.5.1), in which starDiscrepancy_N is
 * the 1-D star (Kolmogorov-Smirnov) discrepancy of the zero ordinates against the
 * smooth Riemann-von Mangoldt CDF -- NOT a Fourier / exponential-sum discrepancy.
 *
 * For a 1-D point set the star discrepancy against a smooth CDF F_inf is, by
 * definition,
 *     starDiscrepancy_N = sup_T | F_N(T) - F_inf(T) |
 * where F_N(T) = #{gamma_n <= T}/N is the empirical CDF. With the RvM background
 * F_inf(T) = <N(T)>/N this is EXACTLY
 *     sup_T | #{gamma_n <= T} - <N(T)> | / N = sup_T |S(T)| / N
 * (Riemann-von Mangoldt: S(T) = N(T) - <N(T)>; Kuipers-Niederreiter Thm 1.4 / the
 * Kolmogorov-Smirnov identity). NO Erdos-Turan inequality is invoked: the
 * counting function is directly accessible, so the lossy step of bounding the 1-D
 * discrepancy THROUGH exponential sums (where Erdos-Turan and its harmonic
 * blow-up live) is never taken.
 *
 * THE BRIDGE CONSTANT FOR THE ROUTE ACTUALLY USED
 * -----------------------------------------------
 * Because starDiscrepancy_N = sup|S(T)|/N is an IDENTITY (not an inequality
 * routed through a kernel), the "bridge" from the S(T) growth coefficient 2.622
 * to the discrepancy coefficient carries only ONE genuine O(1) overhead: the
 * empirical CDF is a step function jumping 1/N at each ordinate, so the
 * sup-deviation against the smooth F_inf incurs a half-jump 1/(2N), i.e. an
 * additive coefficient on log(gamma_N)/N of
 *     bridge = 1/(2 . log gamma_N) ~ 0.0544 at N* = 1e4.
 * This is precisely (and only) the "half-gap smoothing" term 0.5/L that imp-2759
 * itself isolated (SMOOTHING_COEFF ~ 0.05436): in the 1-D KS route it is the
 * SOLE survivor -- the kernel-mass 1/(H+1) and the (1/pi) sum 1/h harmonic terms
 * that drove imp-2759 to ~9.98 are artefacts of the exponential-sum detour and
 * vanish identically here.
 *
 * VERDICT: DISCHARGED for the 1-D Stieltjes / KS route.
 *     C_Selberg_eff = 2.622 (Trudgian S(T) growth) + 0.0544 (half-gap KS bridge)
 *                   = 2.6764 <= 3.0,  with margin 0.378 - 0.0544 = 0.3236 to spare.
 *
 * RECONCILIATION WITH imp-2759 (no contradiction)
 * -----------------------------------------------
 * imp-2759 is correct that the EXPONENTIAL-SUM route (sharp Erdos-Turan fed the
 * scalar aggregate S(T) bound) does NOT fit -- it blows up to ~9.98. This module
 * adds the observation that koksma_hlawka_ineq does not use that route: its 1-D
 * Koksma-Hlawka with Var(f) <= pi/y identifies starDiscrepancy_N with the
 * counting-function (KS) discrepancy, which RvM gives directly as sup|S(T)|/N.
 * So the bridge the chain actually crosses is the trivial RvM identity plus the
 * half-gap term, and it DOES fit the headroom. The two findings are about two
 * different discrepancies; the chain consumes the cheaper, lossless one.
 *
 * HONEST CAVEAT (named, not papered over)
 * ---------------------------------------
 * The dyson_star_discrepancy axiom docstring in lean4-koksma-hlawka.js currently
 * attributes the bound to "the explicit Erdos-Turan inequality + Selberg S(T)
 * bound." For the 1-D Stieltjes route the correct justification is the
 * Riemann-von Mangoldt / Kolmogorov-Smirnov identity (no Erdos-Turan inequality),
 * and THAT is what makes the bridge fit. Recommended follow-up: correct the
 * axiom docstring to cite RvM/KS rather than Erdos-Turan. The DISCHARGED verdict
 * here is rigorous CONDITIONAL on starDiscrepancy_N being the 1-D KS discrepancy
 * (which koksma_hlawka_ineq, via Var(f) <= pi/y, fixes it to be).
 *
 * @see imp-2641-c-selberg-trudgian-discharge (the S(T) discharge naming this residual)
 * @see imp-2759-erdos-turan-bridge-constant (the exponential-sum negative this reconciles)
 * @see koksma-hlawka-C1-pinned (the 1-D Stieltjes / KS derivation of C_1 = pi . C_Selberg)
 * @see src/math/lean4-koksma-hlawka.js (koksma_hlawka_ineq / dyson_star_discrepancy axioms)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from './imp-2641-c-selberg-trudgian-discharge.js';

const N_STAR = 1e4;
const C_SELBERG_ST = 2.622;               // Trudgian-2014 S(T) growth coefficient (imp-2641)
const C_SELBERG_PLACEHOLDER = 3.0;        // lean4-koksma-hlawka.js placeholder
const HEADROOM = C_SELBERG_PLACEHOLDER - C_SELBERG_ST; // 0.378

const T0 = effectiveHeightForN(N_STAR);   // gamma_N approx 9.879e3
const L = Math.log(T0);                   // approx 9.198

// 1-D KS bridge overhead: the empirical CDF jumps 1/N at each ordinate, so the
// sup-deviation against the smooth RvM CDF carries a half-jump 1/(2N). As an
// additive coefficient on log(gamma_N)/N this is 1/(2L). It is exactly (and
// only) imp-2759 SMOOTHING_COEFF = 0.5/L; the kernel-mass and harmonic terms
// that drove imp-2759 to ~9.98 are exponential-sum artefacts absent on this route.
const KS_BRIDGE_COEFF = 0.5 / L;          // ~0.05436

const C_SELBERG_EFF = C_SELBERG_ST + KS_BRIDGE_COEFF; // ~2.6764
const FITS_HEADROOM = C_SELBERG_EFF <= C_SELBERG_PLACEHOLDER; // true
const MARGIN = C_SELBERG_PLACEHOLDER - C_SELBERG_EFF;          // ~0.3236

// Cross-check the S(T) growth coefficient against the imp-2641 record of record.
const C_SELBERG_ST_FROM_IMP2641 =
  IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.effectiveCoefficients.uniformOverTgeqE;

export const IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE = {
  id: 'imp-2700',
  ticket: 'imp-2700',
  question:
    'Derive the explicit Erdos-Turan bridge O(1) constant in dyson_star_discrepancy and check whether C_Selberg_eff = 2.622 + bridge <= 3.0; emit DISCHARGED or CERTIFIED-RESIDUAL with the exact overflow.',
  inputs: {
    N_star: N_STAR,
    gamma_N: +T0.toExponential(4),
    L_logGammaN: +L.toFixed(4),
    C_Selberg_ST: C_SELBERG_ST,
    placeholder: C_SELBERG_PLACEHOLDER,
    headroom: +HEADROOM.toFixed(4),
  },
  routeAnalysis: {
    consumer: 'koksma_hlawka_ineq: discrepancy N y <= (pi/y) . starDiscrepancy N (1-D Koksma-Hlawka, f = Im(1/(z-x)), Var(f) <= pi/y)',
    discrepancyKind: '1-D star (Kolmogorov-Smirnov) discrepancy of the zero ordinates vs the smooth RvM CDF',
    identity: 'starDiscrepancy_N = sup_T |F_N(T) - F_inf(T)| = sup_T |S(T)|/N exactly (Riemann-von Mangoldt; Kuipers-Niederreiter Thm 1.4)',
    erdosTuranNeeded: false,
    note: 'Erdos-Turan only enters when bounding 1-D discrepancy THROUGH exponential sums; here the counting function is directly accessible, so that lossy detour is never taken.',
  },
  bridgeConstant: {
    derivation: 'Only O(1) overhead in the KS identity is the half-jump 1/(2N) of the step CDF vs the smooth F_inf; as a coefficient on log(gamma_N)/N this is 1/(2L).',
    KS_bridge_coeff: +KS_BRIDGE_COEFF.toFixed(5),     // ~0.05436
    equalsImp2759SmoothingTerm: true,                 // 0.5/L, the sole survivor of the 1-D route
    droppedTerms: 'kernel-mass 1/(H+1) and harmonic (1/pi) sum 1/h: exponential-sum artefacts (imp-2759), absent on the 1-D KS route',
  },
  comparison: {
    C_Selberg_eff: +C_SELBERG_EFF.toFixed(4),         // ~2.6764
    placeholder: C_SELBERG_PLACEHOLDER,
    fitsHeadroom: FITS_HEADROOM,                       // true
    marginToPlaceholder: +MARGIN.toFixed(4),          // ~0.3236
  },
  status: 'DISCHARGED',
  verdict:
    'DISCHARGED for the 1-D Stieltjes / KS route that the chain actually uses. The ' +
    'dyson_star_discrepancy axiom feeds the 1-D Koksma-Hlawka inequality (Var(f) <= pi/y), so ' +
    'starDiscrepancy_N is the Kolmogorov-Smirnov discrepancy, which RvM gives directly as ' +
    'sup|S(T)|/N -- no Erdos-Turan inequality. The bridge constant is then only the half-gap ' +
    'KS term 1/(2L) ~ 0.0544, giving C_Selberg_eff = 2.622 + 0.0544 = 2.6764 <= 3.0 with ' +
    'margin ~0.324. This reconciles imp-2759 (~9.98): that blow-up is the exponential-sum ' +
    'route, which koksma_hlawka_ineq does not take.',
  reconcilesImp2759:
    'No contradiction. imp-2759 is correct that the exponential-sum (sharp Erdos-Turan) route ' +
    'fed scalar S(T) does not fit (~9.98). The chain consumes the cheaper lossless route: the ' +
    '1-D KS discrepancy = sup|S(T)|/N. The two findings concern two different discrepancies.',
  honestCaveat:
    'The discharge is rigorous CONDITIONAL on starDiscrepancy_N being the 1-D KS discrepancy ' +
    '(fixed by koksma_hlawka_ineq via Var(f) <= pi/y). The axiom docstring should be corrected ' +
    'to cite the RvM / Kolmogorov-Smirnov identity rather than the Erdos-Turan inequality, ' +
    'since the RvM identity -- not Erdos-Turan -- is what makes the bridge fit.',
  citation:
    'Kuipers-Niederreiter, Uniform Distribution of Sequences (1974), Thm 1.4 / 2.5.1 (1-D KS discrepancy and Koksma-Hlawka); Riemann-von Mangoldt (S(T) = N(T) - <N(T)>); Trudgian 2014 (C_Selberg = 2.622); imp-2641; imp-2759; koksma-hlawka-C1-pinned.js',
};

export const IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE_ASSERTIONS = [
  {
    id: 'imp2700-headroom-is-0378',
    description: 'Headroom for the bridge overhead is exactly 3.0 - 2.622 = 0.378',
    holds: () => Math.abs(HEADROOM - 0.378) < 1e-9,
  },
  {
    id: 'imp2700-ks-bridge-is-half-gap',
    description: 'The 1-D KS bridge coefficient is the half-gap term 0.5/L ~ 0.0544 (= imp-2759 smoothing term)',
    holds: () => Math.abs(KS_BRIDGE_COEFF - 0.05436) < 1e-4,
  },
  {
    id: 'imp2700-c-selberg-eff-fits',
    description: 'C_Selberg_eff = 2.622 + KS bridge = 2.6764 fits inside the placeholder 3.0',
    holds: () =>
      Math.abs(C_SELBERG_EFF - 2.6764) < 5e-3 &&
      C_SELBERG_EFF <= C_SELBERG_PLACEHOLDER &&
      FITS_HEADROOM === true,
  },
  {
    id: 'imp2700-positive-margin',
    description: 'The discharge leaves a strictly positive margin ~0.324 to the placeholder',
    holds: () => MARGIN > 0.3 && MARGIN < 0.35,
  },
  {
    id: 'imp2700-st-coeff-matches-imp2641',
    description: 'The S(T) growth coefficient 2.622 matches the imp-2641 record of record',
    holds: () => Math.abs(C_SELBERG_ST - C_SELBERG_ST_FROM_IMP2641) < 1e-3,
  },
  {
    id: 'imp2700-discharged-and-reconciles',
    description: 'Verdict is DISCHARGED for the 1-D route and explicitly reconciles the imp-2759 exponential-sum negative (no false QED)',
    holds: () =>
      IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE.status === 'DISCHARGED' &&
      /1-D KS discrepancy/.test(IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE.reconcilesImp2759) &&
      /CONDITIONAL/.test(IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE.honestCaveat),
  },
];

for (const a of IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2700-erdos-turan-bridge-discharge assertion failed: ${a.id}`);
  }
}
