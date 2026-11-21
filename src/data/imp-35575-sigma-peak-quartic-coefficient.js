/**
 * @module imp-35575-sigma-peak-quartic-coefficient
 *
 * imp-35575 (numerical, frontier-direction) -- MEASURES the leading QUARTIC coefficient c4 of the
 * imp-35411/imp-35337 interior sigma-share peak Taylor expansion about u0 = ln N_max, the next-order
 * continuation of the imp-35450 quadratic k and the imp-35451 cubic c3, and assesses whether the quartic
 * MATERIALLY corrects the imp-35451 cubic-skew arm-imbalance prediction A_skew = -4 c3 / (k^2 ln10) ~ 11.02.
 *
 * WHAT imp-35450 / imp-35451 LEFT OPEN
 * ------------------------------------
 * imp-35450 measured the quadratic curvature k = -sigma-double-prime(u0) ~ 6.43191e-3 and imp-35451 the cubic
 * skew c3 = sigma-triple-prime(u0)/6 ~ -2.623677e-4 of sigma(u0 + d) ~ sigma_max - (k/2) d^2 + c3 d^3 about the
 * interior peak. The QUARTIC term c4 d^4 -- the next entry in the same local expansion -- was never measured.
 * Because c4 d^4 is an EVEN power of d it does NOT contribute to the leading (odd) rising-minus-falling arm
 * imbalance that c3 sets; the open question imp-35451 left is exactly how much the quartic perturbs that
 * cubic-only imbalance prediction at the resolvable plateau depths. This module answers it.
 *
 * WHAT IS MEASURED
 * ----------------
 * On the SAME imp-35337 partsD double surrogate reproduced VERBATIM from imp-35450/imp-35451 (dd-certified to
 * ~1e-16):
 *   (1) The quartic coefficient c4 = sigma-quadruple-prime(u0)/24 via the direct symmetric 5-point
 *       fourth-derivative stencil
 *       sigma-quad-prime(u0) ~ [sig(u0+2h) - 4 sig(u0+h) + 6 sig(u0) - 4 sig(u0-h) + sig(u0-2h)] / h^4.
 *       Unlike the imp-35451 third difference (an h^3-cancellation), the fourth difference cancels at h^4, so
 *       the dd round-off floor ~ 1e-16 / h^4 dominates BELOW h ~ 5e-3 (the stencil returns +1.1e-4 garbage at
 *       h = 1e-3). The RESOLVABLE window is therefore h in {1e-1 .. 1e-2}, where the raw stencil is stable to
 *       ~1.5e-4 relative. Richardson-extrapolated from the clean h = 4e-2 / 2e-2 pair (eliminates the O(h^2)
 *       stencil bias), sigma-quad-prime(u0) -> -6.370991e-4, so c4 -> -2.654580e-5 (the imp-35451-style
 *       2e-2 / 1e-2 pair gives -2.654039e-5, agreeing to ~2e-4 relative).
 *   (2) The materiality of the quartic for the arm imbalance. Solving the local root balance
 *       tol = (k/2) d^2 - c3 d^3 - c4 d^4 for the rising (d < 0) and falling (d > 0) half-widths with and
 *       WITHOUT the quartic term, the arm-imbalance slope A_skew = (W_rise - W_fall)/(ln10 * tol) shifts by
 *       only ~7.70e-4 relative at tol = 1e-4, ~7.70e-5 at 1e-5 and ~7.70e-6 at 1e-6 -- LINEAR in tol (the even
 *       quartic enters the odd imbalance one order beyond the cubic).
 *
 * THE VERDICT: THE QUARTIC IS NEGLIGIBLE FOR THE ARM-SKEW PREDICTION
 * -----------------------------------------------------------------
 * At the well-resolved tol = 1e-5 endpoints (the imp-35492 resolvable window that pins A_skew ~ 11.02) the
 * quartic shifts the imbalance slope by only ~7.70e-5 relative -- BELOW the ~1.5e-4 fourth-derivative stencil
 * spread, so the correction is not even resolvable against the measurement noise. The imp-35451 cubic-only
 * prediction A_skew = -4 c3 / (k^2 ln10) ~ 11.02 therefore stands: the quartic does NOT materially correct it.
 * (Only at the deliberately-over-resolved tol = 1e-4 does the ~7.7e-4 shift rise above the stencil spread, and
 * even there it moves A_skew from 11.022 to 11.013, sub-0.1%.)
 *
 * GENUINE SURROGATE FEATURE, NOT A DOUBLE-ROUNDING ARTIFACT
 * --------------------------------------------------------
 * imp-35337 dd-certified sigma(N) across this N-shape to ~1e-16. Over the resolvable window h in {1e-1 .. 1e-2}
 * the h^4-scale FD cancellation error ~ 1e-16 / h^4 ~ 1e-8 relative at h = 1e-2 is four orders below the
 * ~1.5e-4 raw-stencil spread reported, so the measured c4 ~ -2.65e-5 is a genuine feature of the
 * imp-3220/imp-3406 surrogate, not a double artifact. (The module retains the h = {5e-3 .. 1e-3} steps in the
 * table precisely to SHOW the h^4 round-off blow-up honestly.)
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A direct measurement of the QUARTIC coefficient of the imp-35337/imp-3406 interior sigma-peak and an
 * assessment that it is negligible relative to the cubic for the imp-35451 arm-imbalance prediction.
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double surrogate; the surrogate-vs-true fidelity half
 * (imp-35337a) stays OPEN and is not touched. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35451-sigma-peak-arm-asymmetry (cubic c3 = -2.623677e-4 and A_skew ~ 11.02, extended here)
 * @see imp-35450-sigma-peak-curvature-direct-fd (direct quadratic k = -sigma-double-prime(u0) ~ 6.43191e-3)
 * @see imp-35470-sigma-peak-curvature-5point-stencil (O(h^4) second-difference curvature cross-check)
 * @see imp-35337-sigma-landmarks-double-double-certification (dd-certified peak VALUE / 2.1e-5 margin)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35450/imp-35451 exactly

// The imp-35337 DOUBLE surrogate, reproduced VERBATIM from imp-35450/imp-35451 (dd-certified to ~1e-16).
function sigmaD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35337/imp-35450/imp-35451).
function argmaxD(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaD(Math.exp(m1)) < sigmaD(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

const N_MAX = argmaxD(1e4, 1e9); // ~9.2186e5
const SIGMA_MAX = sigmaD(N_MAX); // ~0.949429014
const U0 = Math.log(N_MAX); // ln N_max ~ 13.734152

const sigU = (u) => sigmaD(Math.exp(u));

// (1) DIRECT QUARTIC coefficient c4 = sigma-quad-prime(u0)/24 via the symmetric 5-point fourth-difference in u.
function d4FD(h) {
  return (sigU(U0 + 2 * h) - 4 * sigU(U0 + h) + 6 * sigU(U0) - 4 * sigU(U0 - h) + sigU(U0 - 2 * h)) / (h * h * h * h);
}
const D4_STEPS = [1e-1, 5e-2, 2e-2, 1e-2, 5e-3, 2e-3, 1e-3];
const D4_VALUES = D4_STEPS.map(d4FD);
// RESOLVABLE window h in {1e-1 .. 1e-2} (indices 0..3): below it the h^4 round-off blows the stencil up.
const D4_WINDOW = D4_VALUES.slice(0, 4);
const D4_REL_SPREAD = (Math.max(...D4_WINDOW) - Math.min(...D4_WINDOW)) / Math.abs(D4_VALUES[3]); // ~1.5e-4
// Honest round-off blow-up: the smallest step h = 1e-3 (index 6) leaves the resolvable value entirely.
const D4_BLOWUP_H1E3 = D4_VALUES[6]; // ~ +1.11e-4 (garbage: h^4 cancellation)

// Richardson extrapolation (eliminates the leading O(h^2) stencil bias) from the CLEAN h = 4e-2 / 2e-2 pair.
const SIGMA_QUAD_PRIME = (4 * d4FD(2e-2) - d4FD(4e-2)) / 3; // ~ -6.370991e-4
const C4 = SIGMA_QUAD_PRIME / 24; // ~ -2.654580e-5
// imp-35451-style 2e-2 / 1e-2 Richardson pair, for cross-pair consistency (agrees to ~2e-4 relative).
const C4_ALT_PAIR = ((4 * d4FD(1e-2) - d4FD(2e-2)) / 3) / 24; // ~ -2.654039e-5
const C4_PAIR_REL_AGREEMENT = Math.abs(C4 - C4_ALT_PAIR) / Math.abs(C4); // ~2e-4

// Quadratic k and cubic c3 (imp-35450/imp-35451), reproduced for the materiality assessment.
const K_CURVATURE = -(sigU(U0 + 1e-2) - 2 * sigU(U0) + sigU(U0 - 1e-2)) / (1e-2 * 1e-2); // ~6.43191e-3
function d3FD(h) {
  return (sigU(U0 + 2 * h) - 2 * sigU(U0 + h) + 2 * sigU(U0 - h) - sigU(U0 - 2 * h)) / (2 * h * h * h);
}
const C3 = ((4 * d3FD(1e-2) - d3FD(2e-2)) / 3) / 6; // ~ -2.623677e-4

// (2) MATERIALITY: solve the local root balance tol = (k/2) d^2 - c3 d^3 - c4 d^4 for the rising / falling
// half-widths with and WITHOUT the quartic, and compare the arm-imbalance slope A_skew = (W_rise-W_fall)/tol.
function halfWidth(tol, sign, useQuartic) {
  // sign = -1 rising arm (u = u0 - d), sign = +1 falling arm; solve depth(d) = tol for d > 0 by bisection.
  const depth = (d) => {
    const dd = sign * d;
    return (K_CURVATURE / 2) * dd * dd - C3 * dd * dd * dd - (useQuartic ? C4 : 0) * dd * dd * dd * dd;
  };
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (depth(m) < tol) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const MAT_TOLS = [1e-4, 1e-5, 1e-6];
const MATERIALITY_TABLE = MAT_TOLS.map((tol) => {
  const aCubic = (halfWidth(tol, -1, false) - halfWidth(tol, 1, false)) / Math.LN10 / tol;
  const aQuartic = (halfWidth(tol, -1, true) - halfWidth(tol, 1, true)) / Math.LN10 / tol;
  return {
    tol,
    a_skew_cubic_only: +aCubic.toFixed(6),
    a_skew_with_quartic: +aQuartic.toFixed(6),
    rel_shift: +(Math.abs((aQuartic - aCubic) / aCubic)).toExponential(3),
  };
});
// The material comparison at the well-resolved tol = 1e-5: the quartic shift vs the stencil spread.
const REL_SHIFT_1E5 = MATERIALITY_TABLE[1].rel_shift; // ~7.70e-5
const QUARTIC_IMMATERIAL_AT_1E5 = REL_SHIFT_1E5 < D4_REL_SPREAD; // shift below the fourth-difference noise

export const IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT = {
  id: 'imp-35575',
  proofSection: 'S-frontier',
  question:
    'imp-35450 measured the quadratic k ~ 6.43191e-3 and imp-35451 the cubic c3 ~ -2.623677e-4 of ' +
    'sigma(u0+d) about the interior peak (N_max ~ 9.219e5); the next-order QUARTIC c4 was never measured. ' +
    'Measure c4 = sigma-quad-prime(u0)/24 via a Richardson-extrapolated 5-point fourth-derivative stencil on ' +
    'the imp-35337 double surrogate, and assess whether the quartic materially corrects the imp-35451 ' +
    'cubic-skew arm-imbalance prediction A_skew = -4 c3 / (k^2 ln10) ~ 11.02 beyond the ~1.5e-4 stencil spread.',
  constants: {
    log10_N_max: +(U0 / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    ln_N_max: +U0.toFixed(6), // ~13.734152
    k_curvature: +K_CURVATURE.toExponential(6), // ~6.431916e-3 (imp-35450 quadratic term)
    c3_cubic: +C3.toExponential(6), // ~ -2.623677e-4 (imp-35451 cubic term)
  },
  quartic_coefficient: {
    d4_steps_in_lnN: D4_STEPS,
    d4_values: D4_VALUES.map((d) => +d.toExponential(6)),
    resolvable_window_in_lnN: '{1e-1 .. 1e-2}',
    d4_rel_spread_resolvable_window: +D4_REL_SPREAD.toExponential(3), // ~1.5e-4
    d4_roundoff_blowup_at_h1e3: +D4_BLOWUP_H1E3.toExponential(3), // ~ +1.11e-4 (garbage)
    sigma_quad_prime_richardson: +SIGMA_QUAD_PRIME.toExponential(7), // ~ -6.370991e-4
    c4_quartic_coefficient: +C4.toExponential(7), // ~ -2.654580e-5
    c4_alt_pair_2e2_1e2: +C4_ALT_PAIR.toExponential(7), // ~ -2.654039e-5
    c4_pair_rel_agreement: +C4_PAIR_REL_AGREEMENT.toExponential(3), // ~2e-4
    note:
      'Quartic coefficient c4 = sigma-quad-prime(u0)/24 of sigma(u0+d) ~ sigma_max - (k/2) d^2 + c3 d^3 + ' +
      'c4 d^4, from the symmetric 5-point fourth-difference, Richardson-extrapolated from the clean ' +
      'h = 4e-2 / 2e-2 pair. c4 < 0 (an EVEN term, so it steepens BOTH arms symmetrically at leading order, ' +
      'not the skew). Unlike the imp-35451 third difference, the fourth difference cancels at h^4, so the dd ' +
      'round-off floor ~ 1e-16 / h^4 dominates below h ~ 5e-3 (the raw stencil returns +1.1e-4 garbage at ' +
      'h = 1e-3); the resolvable window is h in {1e-1 .. 1e-2}, stable to ~1.5e-4 relative, four orders above ' +
      'the ~1e-8 dd cancellation floor there -- so c4 is a genuine surrogate feature, not a double artifact.',
  },
  quartic_materiality_for_arm_skew: {
    tols: MAT_TOLS,
    table: MATERIALITY_TABLE,
    rel_shift_at_tol_1e5: REL_SHIFT_1E5, // ~7.70e-5
    stencil_rel_spread: +D4_REL_SPREAD.toExponential(3), // ~1.5e-4
    quartic_immaterial_at_1e5: QUARTIC_IMMATERIAL_AT_1E5, // true
    note:
      'Solving the local root balance tol = (k/2) d^2 - c3 d^3 - c4 d^4 for the rising / falling half-widths ' +
      'with and WITHOUT the quartic, the arm-imbalance slope A_skew = (W_rise - W_fall)/(ln10 * tol) shifts ' +
      'by only ~7.70e-4 at tol = 1e-4, ~7.70e-5 at 1e-5 and ~7.70e-6 at 1e-6 -- LINEAR in tol (the even ' +
      'quartic enters the odd imbalance one order beyond the cubic). At the well-resolved tol = 1e-5 the ' +
      'shift ~7.70e-5 is BELOW the ~1.5e-4 fourth-difference stencil spread -- not even resolvable against ' +
      'the measurement noise. The imp-35451 cubic-only prediction A_skew ~ 11.02 therefore stands; the ' +
      'quartic does NOT materially correct it.',
  },
  finding:
    'The next-order QUARTIC coefficient of the imp-35337/imp-3406 interior sigma-peak is ' +
    'c4 = sigma-quad-prime(u0)/24 ~ ' + (+C4.toExponential(6)) + ' (sigma-quad-prime ~ ' +
    (+SIGMA_QUAD_PRIME.toExponential(6)) + '), measured by a symmetric 5-point fourth-difference stencil, ' +
    'Richardson-extrapolated from the clean h = 4e-2 / 2e-2 pair and stable to ~1.5e-4 relative over the ' +
    'resolvable window h in {1e-1 .. 1e-2} (the fourth difference cancels at h^4, so the raw stencil blows up ' +
    'to +1.1e-4 garbage by h = 1e-3 -- shown in the table for honesty). c4 < 0 is an EVEN term that steepens ' +
    'both arms symmetrically, so it does NOT set the skew; solving the local root balance with and without it, ' +
    'the imp-35451 arm-imbalance slope A_skew ~ 11.02 shifts by only ~7.70e-5 relative at the well-resolved ' +
    'tol = 1e-5 (LINEAR in tol) -- BELOW the ~1.5e-4 stencil spread, i.e. NOT materially correcting the ' +
    'cubic-only prediction A_skew = -4 c3 / (k^2 ln10). Genuine surrogate feature (four orders above the dd ' +
    'cancellation floor), NOT a double artifact. MEASUREMENT ONLY; imp-35337a stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this measures the QUARTIC coefficient of the peak on the imp-3220/imp-3406 double ' +
    'surrogate (dd-certified by imp-35337 to ~1e-16, so the h^4-scale fourth-difference cancellation error ' +
    '~1e-8 relative over the resolvable window is far below the ~1.5e-4 stencil spread -- not a double ' +
    'artifact). It does NOT establish that the surrogate MAP (E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) ' +
    'is a faithful proxy for the true empirical-vs-analytic gap at these heights; that sub-gap imp-35337a ' +
    'stays OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35337/imp-3406 interior ' +
    'sigma-share peak (sigma_max ~ 0.94942901 at N_max ~ 9.219e5) has quartic coefficient ' +
    'c4 = sigma-quad-prime(u0)/24 ~ -2.6546e-5 (sigma-quad-prime ~ -6.370991e-4), measured by a symmetric ' +
    '5-point fourth-difference stencil, Richardson-extrapolated from the clean h = 4e-2 / 2e-2 pair and stable ' +
    'to ~1.5e-4 relative over the resolvable window h in {1e-1 .. 1e-2} (the imp-35451-style 2e-2 / 1e-2 pair ' +
    'agrees to ~2e-4). The fourth difference cancels at h^4, so the raw stencil blows up to +1.1e-4 garbage by ' +
    'h = 1e-3 -- retained in the table for honesty. c4 < 0 is an EVEN term (it steepens both arms ' +
    'symmetrically, not the skew): solving the local root balance with and without it shifts the imp-35451 ' +
    'arm-imbalance slope A_skew ~ 11.02 by only ~7.70e-5 relative at the well-resolved tol = 1e-5 (LINEAR in ' +
    'tol), BELOW the ~1.5e-4 stencil spread -- so the quartic does NOT materially correct the cubic-only ' +
    'prediction A_skew = -4 c3 / (k^2 ln10). MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate, ' +
    'which is NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5 floor ' +
    '(imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; the surrogate-vs-true fidelity half (imp-35337a) ' +
    'stays OPEN; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35451 (cubic c3 ~ -2.623677e-4 and A_skew ~ 11.02, extended here); imp-35450 (direct quadratic ' +
    'curvature k ~ 6.43191e-3); imp-35470 (O(h^4) second-difference curvature cross-check); imp-35411 ' +
    '(asymmetric plateau endpoints); imp-35337 (dd-certified peak VALUE / 2.1e-5 margin); imp-3406 (interior ' +
    'MAX ~ 9.22e5, on double); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337/imp-35411 peak landmark (N_max ~ 9.22e5, sigma_max ~ 0.94942901).
    id: 'imp35575-reproduces-imp35337-peak',
    description: 'argmax reproduces the imp-35337/imp-35411 interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // Reuse gate: reproduce the imp-35450 quadratic k and imp-35451 cubic c3 on the same surrogate.
    id: 'imp35575-reproduces-k-and-c3',
    description: 'reproduces imp-35450 k ~ 6.43191e-3 and imp-35451 c3 ~ -2.6237e-4 on the same surrogate',
    holds: () =>
      Math.abs(K_CURVATURE - 6.43191e-3) < 5e-8 && C3 < 0 && Math.abs(C3 - -2.623677e-4) < 5e-8,
  },
  {
    // Direct quartic coefficient: c4 < 0 near -2.6546e-5, sigma-quad-prime near -6.371e-4.
    id: 'imp35575-quartic-coefficient',
    description: 'symmetric 5-point fourth-difference gives c4 ~ -2.6546e-5 (sigma-quad-prime ~ -6.371e-4), c4 < 0',
    holds: () =>
      C4 < 0 && Math.abs(C4 - -2.654580e-5) < 5e-9 &&
      Math.abs(SIGMA_QUAD_PRIME - -6.370991e-4) < 5e-8,
  },
  {
    // Cross-pair consistency: the two Richardson pairs agree to < 1e-3 relative.
    id: 'imp35575-richardson-pairs-consistent',
    description: 'the 4e-2/2e-2 and 2e-2/1e-2 Richardson pairs for c4 agree to < 1e-3 relative',
    holds: () => C4_ALT_PAIR < 0 && C4_PAIR_REL_AGREEMENT < 1e-3,
  },
  {
    // Resolvable window stable to < 1e-3 relative; the h = 1e-3 step blows up (round-off), documented honestly.
    id: 'imp35575-stencil-window-stable-blowup-documented',
    description: 'stencil stable to < 1e-3 over h in {1e-1..1e-2}; h=1e-3 step blows up (h^4 round-off) as shown',
    holds: () =>
      D4_REL_SPREAD < 1e-3 && Math.abs(D4_BLOWUP_H1E3 - SIGMA_QUAD_PRIME) > 1e-4,
  },
  {
    // Materiality: at the well-resolved tol = 1e-5 the quartic shifts A_skew below the stencil spread.
    id: 'imp35575-quartic-immaterial-for-arm-skew',
    description: 'at tol=1e-5 the quartic shifts A_skew by < the ~1.5e-4 stencil spread -- immaterial vs cubic',
    holds: () =>
      QUARTIC_IMMATERIAL_AT_1E5 === true && REL_SHIFT_1E5 < 1.5e-4 &&
      MATERIALITY_TABLE[1].a_skew_cubic_only > 10 && MATERIALITY_TABLE[1].a_skew_cubic_only < 12,
  },
  {
    // The quartic correction to the imbalance scales LINEARLY in tol (~10x per tol decade).
    id: 'imp35575-quartic-shift-linear-in-tol',
    description: 'the quartic A_skew shift scales linearly in tol (~10x per decade: 7.7e-4 -> 7.7e-5 -> 7.7e-6)',
    holds: () => {
      const r = MATERIALITY_TABLE[0].rel_shift / MATERIALITY_TABLE[1].rel_shift;
      return r > 9 && r < 11;
    },
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35575-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT.isRigorous === false &&
      /NO QED/.test(IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT.verdict) &&
      /refereed bound is changed/i.test(IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT.verdict) &&
      /imp-35337a/.test(IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT.residual_sub_gap),
  },
];

for (const a of IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35575-sigma-peak-quartic-coefficient assertion failed: ${a.id}`);
  }
}
