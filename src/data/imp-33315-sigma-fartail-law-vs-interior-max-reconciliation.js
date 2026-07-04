/**
 * @module imp-33315-sigma-fartail-law-vs-interior-max-reconciliation
 *
 * imp-33315 (numerical, frontier-direction): imp-33291 confirmed the sigma(N) far-tail law
 *     sigma ~ (C_C / E_trunc) sqrt(log T0 / N)  =  const * N^(-1/2) * (log T0)^(+1/2)
 * as a JOINT (-1/2, +1/2) power pair (two-regressor fit converging to |b1+1/2| ~ 2e-13,
 * |b2-1/2| ~ 3e-11). imp-3406 SEPARATELY reconciled the sigma(N) U-shape, pinning the true
 * interior MAXIMUM at N_max ~ 9.22e5 (sigma_max ~ 0.9494), with the 10^6 decade sample only
 * 2.1e-5 below on the downslope. The two results were never connected. This module DERIVES the
 * closed-form far-tail asymptotic implied by the imp-33291 (-1/2, +1/2) leading form using the
 * effectiveHeightForN RvM inverse, and MEASURES its predicted interior-max location and value
 * against the imp-3406 reconciliation -- testing whether the joint power pair reproduces the
 * U-shape peak location. The answer is NO, and the derivation says exactly why.
 *
 * THE QUANTITY (identical sub-terms to imp-3406 / imp-33291)
 * ---------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll) = 1 / (1 + (E_trunc + E_flow)/E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *
 * THE DERIVATION: the far-tail (-1/2, +1/2) law drops the term that MAKES the peak
 * -------------------------------------------------------------------------------
 * The imp-33291 leading form is the SMALL-SHARE (sigma -> 0) tail: past the crossover
 * N_cross ~ 3.28e9 the constant floor E_trunc outlives the vanishing E_coll and E_flow is
 * super-poly negligible, so sigma ~ E_coll / E_trunc = (C_C/E_trunc) sqrt(log T0/N). Written
 * as sigma = 1/(1+R) with R = (E_trunc + E_flow)/E_coll, this far-tail form KEEPS only
 * R_ft = E_trunc/E_coll. Since E_coll ~ sqrt(log T0/N) is monotone DECREASING in N (the 1/sqrt N
 * dominates the slow sqrt(log T0) growth), R_ft is monotone INCREASING, so sigma_ft = 1/(1+R_ft)
 * is monotone DECREASING and has NO interior maximum -- its ternary argmax pins to the lower
 * bracket endpoint. The interior MAX of the full sigma is an interior MINIMUM of R, requiring
 * dR/dN = 0; that balance is driven by the E_flow term (which falls super-polynomially while
 * E_coll falls only like 1/sqrt N), so R = (E_trunc + E_flow)/E_coll has an interior min while
 * R_ft = E_trunc/E_coll does not. THE FAR-TAIL LAW DROPS THE VERY TERM THAT CREATES THE PEAK.
 *
 * THE MEASUREMENT: residual of the far-tail law at the imp-3406 interior max
 * -------------------------------------------------------------------------
 * At N_max ~ 9.22e5 the sub-terms are E_trunc = 3.06e-5, E_flow ~ 4.68e-5, E_coll ~ 1.45e-3:
 * E_flow ~ 1.53 * E_trunc, i.e. E_flow is LARGER than the truncation floor at the peak, the
 * opposite of the far-tail regime where it is negligible. The far-tail law omits this positive
 * denominator term and therefore OVERSHOOTS: sigma_ft(N_max) ~ 0.97939 vs sigma_full(N_max) ~
 * 0.94943, an overshoot of ~3.0e-2. And the peak sits ~3.55 decades BELOW the crossover
 * N_cross ~ 3.28e9 where the far-tail approximation first becomes valid -- squarely in the
 * pre-crossover regime the far-tail law is not built for (there sigma ~ 0.95, near 1, the far
 * end of the sigma -> 0 small-share tail the (-1/2, +1/2) power law describes).
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (F1) THE JOINT POWER PAIR DOES NOT REPRODUCE THE PEAK. The far-tail law sigma_ft =
 *        E_coll/(E_trunc + E_coll) implied by the imp-33291 (-1/2, +1/2) leading form is MONOTONE
 *        DECREASING in N (ternary argmax pins to the lower bracket): it has no interior maximum,
 *        so it cannot reproduce the imp-3406 interior-max LOCATION at N ~ 9.22e5 at all.
 *   (F2) THE DROPPED E_flow TERM IS WHAT MAKES THE PEAK. At N_max the flow term E_flow ~ 4.68e-5
 *        EXCEEDS the truncation floor E_trunc = 3.06e-5 (ratio ~1.53). The interior max is the
 *        min of R = (E_trunc + E_flow)/E_coll, a balance the super-poly-decaying E_flow drives;
 *        the far-tail law keeps only R_ft = E_trunc/E_coll (monotone), losing the balance.
 *   (F3) THE RESIDUAL IS A ~3.0e-2 OVERSHOOT, 3.55 DECADES OFF-REGIME. Evaluated at the true peak
 *        the far-tail law overshoots by ~3.0e-2 (0.97939 vs 0.94943) because it omits the positive
 *        E_flow denominator term; the peak lies ~3.55 decades below the crossover N_cross ~ 3.28e9
 *        where the (-1/2, +1/2) small-share tail first applies. The far tail and the interior max
 *        live in DISJOINT regimes.
 *
 * The punchline: the imp-33291 far-tail (-1/2, +1/2) power law and the imp-3406 interior maximum
 * are structurally disjoint. The far-tail law is the sigma -> 0 small-share tail past the
 * crossover and is monotone decreasing; the U-shape peak is a pre-crossover E_flow-vs-E_trunc
 * balance ~3.55 decades below the crossover where sigma ~ 0.95. The joint power pair does NOT
 * reproduce the peak location; forced to the peak it overshoots by ~3.0e-2 by dropping the very
 * E_flow term that creates the maximum. The imp-3406 reconciliation and the imp-33291 tail law
 * are complementary halves of the N-shape, not two views of one law.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. C_C is
 * GUE-conditional per imp-486; changes no bound; imp-3066 untouched; no positivity, no bridge
 * closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit (the (-1/2, +1/2) joint power law)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33291)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33291 exactly

// EXACT imp-3406 / imp-33291 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // super-poly negligible on the far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, C_F, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// The FULL conditional share (all three terms) -- the imp-3406 quantity.
const sigmaFull = (N) => parts(N).sigma;

// The imp-33291 FAR-TAIL leading form: drop the super-poly E_flow term, keeping only
// sigma_ft = E_coll / (E_trunc + E_coll). This is exactly the (-1/2, +1/2) power law
// sigma ~ (C_C/E_trunc) sqrt(log T0/N) in the small-share (sigma -> 0) limit, written
// without the far-past-crossover linearisation so it can be compared at finite N.
function sigmaFarTail(N) {
  const p = parts(N);
  return p.E_coll / (E_TRUNC_PT + p.E_coll);
}

// Ternary search of the argmax in ln N. If the target is monotone the returned point
// pins to a bracket endpoint -- exactly how we detect the far-tail law has no interior max.
function argmaxLnN(fn, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (fn(Math.exp(m1)) < fn(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// The E_coll = E_trunc crossover (reproduces imp-3444 / imp-33291 N ~ 3.280e9).
function ecollEqualsEtrunc() {
  let a = Math.log(1e6);
  let b = Math.log(1e12);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const LO_BRACKET = 1e4;
const HI_BRACKET = 1e9;
const N_MAX_FULL = argmaxLnN(sigmaFull, LO_BRACKET, HI_BRACKET); // ~9.219e5 (reproduces imp-3406)
const SIGMA_MAX_FULL = sigmaFull(N_MAX_FULL); // ~0.949429
const N_ARGMAX_FT = argmaxLnN(sigmaFarTail, LO_BRACKET, HI_BRACKET); // pins to LO (monotone)
const PM = parts(N_MAX_FULL);
const N_CROSS = ecollEqualsEtrunc(); // ~3.280e9

const SIGMA_FT_AT_PEAK = sigmaFarTail(N_MAX_FULL); // ~0.97939 (overshoot)
const OVERSHOOT = SIGMA_FT_AT_PEAK - SIGMA_MAX_FULL; // ~3.0e-2
const PEAK_TO_CROSS_DECADES = Math.log10(N_CROSS) - Math.log10(N_MAX_FULL); // ~3.55

// Side-by-side ladder: full sigma vs the far-tail law across and past the peak.
const LADDER_N = [1e4, 1e5, N_MAX_FULL, 1e6, 1e7, 1e8, 1e9, 1e12];
const RECONCILIATION_LADDER = LADDER_N.map((N) => {
  const p = parts(N);
  return {
    N: +N.toExponential(3),
    log10_N: +Math.log10(N).toFixed(4),
    sigma_full: +p.sigma.toFixed(7),
    sigma_farTail: +sigmaFarTail(N).toFixed(7),
    farTail_minus_full: +(sigmaFarTail(N) - p.sigma).toExponential(3),
    E_flow_over_E_trunc: +(p.E_flow / E_TRUNC_PT).toFixed(4),
  };
});

export const IMP33315_SIGMA_FARTAIL_LAW_VS_INTERIOR_MAX_RECONCILIATION = {
  id: 'imp-33315',
  proofSection: 'S-frontier',
  question:
    'Derive the closed-form far-tail sigma(N) asymptotic implied by the imp-33291 recovered ' +
    '(-1/2, +1/2) two-parameter law and measure its residual against the imp-3406 interior-max ' +
    'reconciliation (sigma_max ~ 0.9494 at N ~ 9.22e5), testing whether the joint power pair ' +
    'reproduces the U-shape peak location. Derivation/measurement only; C_C GUE-conditional per ' +
    'imp-486; no new bound; no QED.',
  farTailLaw:
    'sigma_ft(N) = E_coll/(E_trunc + E_coll) ~ (C_C/E_trunc) sqrt(log T0/N) = ' +
    'const * N^(-1/2) * (log T0)^(+1/2) -- the imp-33291 (-1/2, +1/2) small-share (sigma -> 0) ' +
    'leading form, valid far PAST the crossover; drops the super-poly E_flow term.',
  interiorMax: {
    N_max: +N_MAX_FULL.toExponential(4), // ~9.219e5 (reproduces imp-3406)
    log10_N_max: +Math.log10(N_MAX_FULL).toFixed(4), // ~5.9647
    sigma_max: +SIGMA_MAX_FULL.toFixed(7), // ~0.9494290
    E_trunc: +E_TRUNC_PT.toExponential(3),
    E_flow_at_peak: +PM.E_flow.toExponential(3), // ~4.68e-5
    E_coll_at_peak: +PM.E_coll.toExponential(3), // ~1.45e-3
    E_flow_over_E_trunc_at_peak: +(PM.E_flow / E_TRUNC_PT).toFixed(4), // ~1.53 (E_flow EXCEEDS the floor)
  },
  farTailMonotone: {
    ternary_argmax_over_bracket: +N_ARGMAX_FT.toExponential(3), // pins to LO_BRACKET
    lo_bracket: +LO_BRACKET.toExponential(1),
    pins_to_lower_endpoint: N_ARGMAX_FT < LO_BRACKET * 1.05, // true: monotone decreasing, no interior max
    note:
      'The far-tail law sigma_ft is monotone DECREASING in N (E_coll ~ sqrt(log T0/N) falls, so ' +
      'R_ft = E_trunc/E_coll rises); its ternary argmax pins to the lower bracket endpoint. It has ' +
      'NO interior maximum, so it cannot reproduce the imp-3406 peak LOCATION at all.',
  },
  residual: {
    sigma_ft_at_peak: +SIGMA_FT_AT_PEAK.toFixed(7), // ~0.9793857
    sigma_full_at_peak: +SIGMA_MAX_FULL.toFixed(7), // ~0.9494290
    overshoot_farTail_minus_full: +OVERSHOOT.toExponential(4), // ~2.996e-2
    peak_below_crossover_decades: +PEAK_TO_CROSS_DECADES.toFixed(4), // ~3.55
    N_cross: +N_CROSS.toExponential(4), // ~3.280e9
    note:
      'Forced to the true peak the far-tail law OVERSHOOTS by ~3.0e-2 (0.97939 vs 0.94943) because ' +
      'it drops the positive E_flow denominator term -- which at the peak EXCEEDS the E_trunc floor. ' +
      'The peak sits ~3.55 decades BELOW the crossover N_cross ~ 3.28e9 where the (-1/2, +1/2) tail ' +
      'first applies: far tail and interior max live in disjoint regimes.',
  },
  reconciliationLadder: RECONCILIATION_LADDER,
  finding: {
    F1_joint_power_pair_does_not_reproduce_peak:
      'The far-tail law sigma_ft = E_coll/(E_trunc + E_coll) implied by the imp-33291 (-1/2, +1/2) ' +
      'leading form is MONOTONE DECREASING in N (ternary argmax pins to the lower bracket). It has ' +
      'no interior maximum, so it cannot reproduce the imp-3406 interior-max location N ~ 9.22e5.',
    F2_dropped_E_flow_makes_the_peak:
      'At N_max the flow term E_flow ~ 4.68e-5 EXCEEDS the truncation floor E_trunc = 3.06e-5 ' +
      '(ratio ~1.53). The interior max is the min of R = (E_trunc + E_flow)/E_coll, a balance the ' +
      'super-poly-decaying E_flow drives; the far-tail law keeps only R_ft = E_trunc/E_coll ' +
      '(monotone), losing the balance and hence the peak.',
    F3_residual_is_overshoot_off_regime:
      'Evaluated at the true peak the far-tail law overshoots by ~3.0e-2 (0.97939 vs 0.94943) by ' +
      'omitting the positive E_flow denominator term; the peak lies ~3.55 decades below the crossover ' +
      'N_cross ~ 3.28e9 where the (-1/2, +1/2) small-share tail first applies. The far tail and the ' +
      'interior max are disjoint regimes, not two views of one law.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). The closed-form far-tail law ' +
    'sigma_ft(N) = E_coll/(E_trunc + E_coll) ~ (C_C/E_trunc) sqrt(log T0/N) implied by the imp-33291 ' +
    '(-1/2, +1/2) joint power pair is monotone DECREASING and has NO interior maximum, so it does ' +
    'NOT reproduce the imp-3406 U-shape peak LOCATION (N_max ~ 9.22e5) at all. Forced to the true ' +
    'peak it OVERSHOOTS the value by ~3.0e-2 (0.97939 vs 0.94943) because it drops the E_flow term, ' +
    'which at the peak EXCEEDS the E_trunc floor (E_flow/E_trunc ~ 1.53). The peak sits ~3.55 decades ' +
    'BELOW the crossover N_cross ~ 3.28e9 where the (-1/2, +1/2) small-share tail first applies: the ' +
    'far-tail law and the interior max live in DISJOINT regimes and are complementary halves of the ' +
    'N-shape, not two views of one law. C_C is GUE-conditional per imp-486; changes no bound; ' +
    'imp-3066 untouched; no positivity, no bridge closure, no RH claim, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33291 ((-1/2, +1/2) joint power law); imp-3406 (interior MAX N ~ 9.22e5, sigma_max ~ ' +
    '0.9494); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-486 (C_C GUE-conditional); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP33315_SIGMA_FARTAIL_LAW_VS_INTERIOR_MAX_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: the FULL sigma here reproduces the imp-3406 interior max (N ~ 9.22e5,
    // sigma_max ~ 0.9494), proving the identical imp-3406 / imp-33291 sub-term formulas are in use.
    id: 'imp33315-reproduces-imp3406-interior-max',
    description: 'full sigma interior max reproduces imp-3406 (N_max ~ 9.22e5, sigma_max ~ 0.9494)',
    holds: () =>
      N_MAX_FULL > 5e5 && N_MAX_FULL < 2e6 && Math.abs(SIGMA_MAX_FULL - 0.94943) < 5e-4,
  },
  {
    // (F1): the far-tail law is monotone DECREASING -- its ternary argmax pins to the lower
    // bracket endpoint, so it has NO interior maximum and cannot reproduce the peak location.
    id: 'imp33315-fartail-law-monotone-no-interior-max',
    description: 'far-tail law ternary argmax pins to the lower bracket (monotone, no interior max)',
    holds: () =>
      N_ARGMAX_FT < LO_BRACKET * 1.05 &&
      sigmaFarTail(1e5) > sigmaFarTail(1e6) &&
      sigmaFarTail(1e6) > sigmaFarTail(1e7),
  },
  {
    // (F2): at the true peak the dropped E_flow term EXCEEDS the E_trunc floor -- it is the term
    // that makes the maximum, and the far-tail law omits exactly it.
    id: 'imp33315-Eflow-exceeds-Etrunc-at-peak',
    description: 'E_flow > E_trunc at the interior max (E_flow/E_trunc ~ 1.53), the dropped peak-making term',
    holds: () => PM.E_flow > E_TRUNC_PT && PM.E_flow / E_TRUNC_PT > 1.2 && PM.E_flow / E_TRUNC_PT < 2,
  },
  {
    // (F3): the residual is a positive ~3.0e-2 overshoot, and the peak sits several decades below
    // the crossover where the far-tail tail first applies -- disjoint regimes.
    id: 'imp33315-fartail-overshoots-peak-offregime',
    description: 'far-tail law overshoots sigma_max by ~3.0e-2; peak ~3.55 decades below the crossover',
    holds: () =>
      OVERSHOOT > 1e-2 &&
      OVERSHOOT < 5e-2 &&
      PEAK_TO_CROSS_DECADES > 3 &&
      PEAK_TO_CROSS_DECADES < 4 &&
      N_CROSS > 1e9 &&
      N_CROSS < 1e10,
  },
  {
    // Convergence gate: far past the crossover the two curves coincide -- the far-tail law is a
    // faithful description of the tail, just not of the interior max.
    id: 'imp33315-fartail-matches-full-past-crossover',
    description: 'far-tail and full sigma agree to < 1e-3 far past the crossover (N = 1e12)',
    holds: () => Math.abs(sigmaFarTail(1e12) - sigmaFull(1e12)) < 1e-3,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, PT stays SOTA.
    id: 'imp33315-honesty-gate-no-qed',
    description: 'Derivation/measurement only: no QED, PT stays SOTA',
    holds: () =>
      IMP33315_SIGMA_FARTAIL_LAW_VS_INTERIOR_MAX_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP33315_SIGMA_FARTAIL_LAW_VS_INTERIOR_MAX_RECONCILIATION.verdict) &&
      /remains SOTA/.test(IMP33315_SIGMA_FARTAIL_LAW_VS_INTERIOR_MAX_RECONCILIATION.verdict),
  },
];

for (const a of IMP33315_SIGMA_FARTAIL_LAW_VS_INTERIOR_MAX_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33315-sigma-fartail-law-vs-interior-max-reconciliation assertion failed: ${a.id}`);
  }
}
