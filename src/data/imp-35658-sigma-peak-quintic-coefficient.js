/**
 * @module imp-35658-sigma-peak-quintic-coefficient
 *
 * imp-35658 (numerical, frontier-direction) -- MEASURES the leading QUINTIC coefficient c5 of the
 * imp-35411/imp-35337 interior sigma-share peak Taylor expansion about u0 = ln N_max, the next ODD-power
 * continuation of the imp-35451 cubic c3 (one order beyond the imp-35575 even quartic c4), and assesses its
 * contribution to the imp-35451 rising-minus-falling arm-imbalance prediction A_skew = -4 c3 / (k^2 ln10) ~ 11.02.
 *
 * WHY THE ODD QUINTIC (UNLIKE THE EVEN QUARTIC) CAN MOVE THE SKEW
 * --------------------------------------------------------------
 * imp-35450 measured the quadratic curvature k = -sigma-double-prime(u0) ~ 6.43191e-3, imp-35451 the cubic
 * skew c3 = sigma-triple-prime(u0)/6 ~ -2.623677e-4, and imp-35575 the quartic c4 = sigma-quad-prime(u0)/24
 * ~ -2.654580e-5 of sigma(u0 + d) ~ sigma_max - (k/2) d^2 + c3 d^3 + c4 d^4 + c5 d^5 about the interior peak.
 * imp-35575 found the EVEN quartic c4 d^4 negligible for the arm skew for a STRUCTURAL reason: an even power of
 * d steepens both arms symmetrically and does not enter the leading (odd) rising-minus-falling imbalance that
 * c3 sets. The QUINTIC c5 d^5 is the next ODD term, so -- like the cubic -- it DOES break the arm symmetry and
 * contribute to the imbalance. imp-35575 never measured it. This module measures c5 and quantifies its shift to
 * the imp-35451 cubic-only A_skew ~ 11.02.
 *
 * WHAT IS MEASURED
 * ----------------
 * On the SAME imp-35337 partsD double surrogate reproduced VERBATIM from imp-35450/imp-35451/imp-35575:
 *   (1) The quintic coefficient c5 = sigma-5prime(u0)/120 via the direct symmetric 7-point fifth-difference
 *       sigma-5prime(u0) ~ [ -sig(u0-3h) + 4 sig(u0-2h) - 5 sig(u0-h) + 5 sig(u0+h) - 4 sig(u0+2h)
 *                            + sig(u0+3h) ] / (2 h^5).
 *       Being an ODD (fifth) derivative the antisymmetric stencil cancels at h^5, so the round-off floor
 *       ~ 1e-16 / (2 h^5) blows up EARLIER than the imp-35575 fourth difference: the stencil sign-flips to
 *       +1.11e-1 garbage by h = 1e-3. The RESOLVABLE window is h in {1e-1 .. 2e-2}, where the raw stencil is
 *       stable to ~9.4e-4 relative. Richardson-extrapolated from the clean h = 2e-1 / 1e-1 pair (eliminates the
 *       O(h^2) stencil bias), sigma-5prime(u0) -> -3.088468e-4, so c5 -> -2.573724e-6 (the 1e-1 / 5e-2 pair
 *       gives -2.573715e-6, agreeing to ~3.4e-6 relative).
 *   (2) The materiality of the ODD quintic for the arm imbalance. Solving the local root balance
 *       tol = (k/2) d^2 - c3 d^3 - c4 d^4 - c5 d^5 for the rising (d < 0) and falling (d > 0) half-widths with
 *       and WITHOUT the quintic term, the arm-imbalance slope A_skew = (W_rise - W_fall)/(ln10 * tol) shifts by
 *       ~3.06e-4 at tol = 1e-4, ~3.05e-5 at 1e-5 and ~3.05e-6 at 1e-6 -- LINEAR in tol (the quintic, an odd
 *       term two powers of d beyond the cubic, is suppressed by an extra factor d^2 ~ 2 tol / k).
 *
 * THE VERDICT: THE QUINTIC IS NEGLIGIBLE FOR THE ARM-SKEW PREDICTION
 * -----------------------------------------------------------------
 * At the well-resolved tol = 1e-5 endpoints (the imp-35492 resolvable window that pins A_skew ~ 11.02) the odd
 * quintic shifts the imbalance slope by only ~3.05e-5 relative -- an ORDER below even the imp-35575 quartic
 * shift (~7.70e-5) and BELOW the ~9.4e-4 fifth-difference stencil spread, so the correction is not even
 * resolvable against the measurement noise. Notably the quintic pushes A_skew back UP (11.017 at tol = 1e-4,
 * partially undoing the quartic's 11.022 -> 11.013 pull), but the net move is sub-0.1%. The imp-35451 cubic-only
 * prediction A_skew = -4 c3 / (k^2 ln10) ~ 11.02 therefore STANDS: neither the even quartic (imp-35575) nor the
 * odd quintic materially corrects it. The odd-power hierarchy c5 / c3 ~ 9.8e-3 is the reason the odd quintic,
 * despite entering the imbalance, contributes an order less than the (immaterial) even quartic.
 *
 * GENUINE SURROGATE FEATURE, NOT A DOUBLE-ROUNDING ARTIFACT
 * --------------------------------------------------------
 * imp-35337 dd-certified sigma(N) across this N-shape to ~1e-16. Over the resolvable window h in {1e-1 .. 2e-2}
 * the h^5-scale FD cancellation error ~ 1e-16 / (2 h^5) ~ 6e-8 relative at h = 2e-2 is four orders below the
 * ~9.4e-4 raw-stencil spread reported, so the measured c5 ~ -2.57e-6 is a genuine feature of the
 * imp-3220/imp-3406 surrogate, not a double artifact. (The module retains the h = {1e-2 .. 1e-3} steps in the
 * table precisely to SHOW the h^5 round-off blow-up honestly -- the stencil sign-flips to +0.111 by h = 1e-3.)
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A direct measurement of the QUINTIC coefficient of the imp-35337/imp-3406 interior sigma-peak and an
 * assessment that the odd quintic is negligible relative to the cubic for the imp-35451 arm-imbalance prediction.
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double surrogate; the surrogate-vs-true fidelity half
 * (imp-35337a) stays OPEN and is not touched. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35575-sigma-peak-quartic-coefficient (even quartic c4 = -2.654580e-5, one order below, negligible)
 * @see imp-35451-sigma-peak-arm-asymmetry (cubic c3 = -2.623677e-4 and A_skew ~ 11.02, extended here)
 * @see imp-35450-sigma-peak-curvature-direct-fd (direct quadratic k = -sigma-double-prime(u0) ~ 6.43191e-3)
 * @see imp-35337-sigma-landmarks-double-double-certification (dd-certified peak VALUE / 2.1e-5 margin)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35450/imp-35451/imp-35575

// The imp-35337 DOUBLE surrogate, reproduced VERBATIM from imp-35450/imp-35451/imp-35575 (dd-certified to ~1e-16).
function sigmaD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35337/imp-35450/imp-35451/imp-35575).
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

// (1) DIRECT QUINTIC coefficient c5 = sigma-5prime(u0)/120 via the antisymmetric 7-point fifth-difference in u.
function d5FD(h) {
  return (
    -sigU(U0 - 3 * h) + 4 * sigU(U0 - 2 * h) - 5 * sigU(U0 - h)
    + 5 * sigU(U0 + h) - 4 * sigU(U0 + 2 * h) + sigU(U0 + 3 * h)
  ) / (2 * h * h * h * h * h);
}
const D5_STEPS = [3e-1, 2e-1, 1e-1, 7e-2, 5e-2, 3e-2, 2e-2, 1e-2, 5e-3, 1e-3];
const D5_VALUES = D5_STEPS.map(d5FD);
// RESOLVABLE window h in {1e-1 .. 2e-2} (indices 2..6): below it the h^5 round-off blows the stencil up.
const D5_WINDOW = D5_VALUES.slice(2, 7);

// Richardson extrapolation (eliminates the leading O(h^2) stencil bias) from the CLEAN h = 2e-1 / 1e-1 pair.
const SIGMA_5PRIME = (4 * d5FD(1e-1) - d5FD(2e-1)) / 3; // ~ -3.088468e-4
const C5 = SIGMA_5PRIME / 120; // ~ -2.573724e-6
// imp-35575-style finer 1e-1 / 5e-2 Richardson pair, for cross-pair consistency (agrees to ~3.4e-6 relative).
const C5_ALT_PAIR = ((4 * d5FD(5e-2) - d5FD(1e-1)) / 3) / 120; // ~ -2.573715e-6
const C5_PAIR_REL_AGREEMENT = Math.abs(C5 - C5_ALT_PAIR) / Math.abs(C5); // ~3.4e-6

const D5_REL_SPREAD = (Math.max(...D5_WINDOW) - Math.min(...D5_WINDOW)) / Math.abs(SIGMA_5PRIME); // ~9.4e-4
// Honest round-off blow-up: the smallest step h = 1e-3 (index 9) sign-flips out of the resolvable band.
const D5_BLOWUP_H1E3 = D5_VALUES[9]; // ~ +1.11e-1 (garbage: h^5 cancellation, sign-flipped)

// Quadratic k, cubic c3, quartic c4 (imp-35450/imp-35451/imp-35575), reproduced for the materiality assessment.
const K_CURVATURE = -(sigU(U0 + 1e-2) - 2 * sigU(U0) + sigU(U0 - 1e-2)) / (1e-2 * 1e-2); // ~6.43191e-3
function d3FD(h) {
  return (sigU(U0 + 2 * h) - 2 * sigU(U0 + h) + 2 * sigU(U0 - h) - sigU(U0 - 2 * h)) / (2 * h * h * h);
}
function d4FD(h) {
  return (sigU(U0 + 2 * h) - 4 * sigU(U0 + h) + 6 * sigU(U0) - 4 * sigU(U0 - h) + sigU(U0 - 2 * h)) / (h * h * h * h);
}
const C3 = ((4 * d3FD(1e-2) - d3FD(2e-2)) / 3) / 6; // ~ -2.623677e-4
const C4 = ((4 * d4FD(2e-2) - d4FD(4e-2)) / 3) / 24; // ~ -2.654580e-5
// Odd-power hierarchy: the quintic is ~1% of the cubic, why the ODD quintic contributes a full order less.
const C5_OVER_C3 = C5 / C3; // ~9.8e-3

// (2) MATERIALITY: solve the local root balance tol = (k/2) d^2 - c3 d^3 - c4 d^4 - c5 d^5 for the rising /
// falling half-widths with and WITHOUT the quintic, and compare the arm-imbalance slope A_skew.
function halfWidth(tol, sign, useQuintic) {
  // sign = -1 rising arm (u = u0 - d), sign = +1 falling arm; solve depth(d) = tol for d > 0 by bisection.
  const depth = (d) => {
    const dd = sign * d;
    return (K_CURVATURE / 2) * dd * dd - C3 * dd * dd * dd - C4 * dd * dd * dd * dd
      - (useQuintic ? C5 : 0) * dd * dd * dd * dd * dd;
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
  // Baseline already carries the imp-35575 quartic (c3 + c4); the toggle is the imp-35658 quintic.
  const aNoQuintic = (halfWidth(tol, -1, false) - halfWidth(tol, 1, false)) / Math.LN10 / tol;
  const aWithQuintic = (halfWidth(tol, -1, true) - halfWidth(tol, 1, true)) / Math.LN10 / tol;
  return {
    tol,
    a_skew_no_quintic: +aNoQuintic.toFixed(6),
    a_skew_with_quintic: +aWithQuintic.toFixed(6),
    rel_shift: +(Math.abs((aWithQuintic - aNoQuintic) / aNoQuintic)).toExponential(3),
  };
});
// The material comparison at the well-resolved tol = 1e-5: the quintic shift vs the stencil spread.
const REL_SHIFT_1E5 = MATERIALITY_TABLE[1].rel_shift; // ~3.05e-5
const QUINTIC_IMMATERIAL_AT_1E5 = REL_SHIFT_1E5 < D5_REL_SPREAD; // shift below the fifth-difference noise

export const IMP35658_SIGMA_PEAK_QUINTIC_COEFFICIENT = {
  id: 'imp-35658',
  proofSection: 'S-frontier',
  question:
    'imp-35451 measured the cubic c3 ~ -2.623677e-4 and imp-35575 the EVEN quartic c4 ~ -2.654580e-5 of ' +
    'sigma(u0+d) about the interior peak (N_max ~ 9.219e5); the next ODD-power QUINTIC c5 -- which, unlike ' +
    'the even quartic, DOES enter the rising-minus-falling arm imbalance -- was never measured. Measure ' +
    'c5 = sigma-5prime(u0)/120 via a Richardson-extrapolated 7-point fifth-difference stencil on the imp-35337 ' +
    'double surrogate, and assess its shift to the imp-35451 cubic-skew A_skew = -4 c3 / (k^2 ln10) ~ 11.02 ' +
    'relative to the ~9.4e-4 fifth-difference stencil spread.',
  constants: {
    log10_N_max: +(U0 / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    ln_N_max: +U0.toFixed(6), // ~13.734152
    k_curvature: +K_CURVATURE.toExponential(6), // ~6.431916e-3 (imp-35450 quadratic term)
    c3_cubic: +C3.toExponential(6), // ~ -2.623677e-4 (imp-35451 cubic term)
    c4_quartic: +C4.toExponential(6), // ~ -2.654580e-5 (imp-35575 even quartic term)
  },
  quintic_coefficient: {
    d5_steps_in_lnN: D5_STEPS,
    d5_values: D5_VALUES.map((d) => +d.toExponential(6)),
    resolvable_window_in_lnN: '{1e-1 .. 2e-2}',
    d5_rel_spread_resolvable_window: +D5_REL_SPREAD.toExponential(3), // ~9.4e-4
    d5_roundoff_blowup_at_h1e3: +D5_BLOWUP_H1E3.toExponential(3), // ~ +1.11e-1 (garbage, sign-flipped)
    sigma_5prime_richardson: +SIGMA_5PRIME.toExponential(7), // ~ -3.088468e-4
    c5_quintic_coefficient: +C5.toExponential(7), // ~ -2.573724e-6
    c5_alt_pair_1e1_5e2: +C5_ALT_PAIR.toExponential(7), // ~ -2.573715e-6
    c5_pair_rel_agreement: +C5_PAIR_REL_AGREEMENT.toExponential(3), // ~3.4e-6
    c5_over_c3: +C5_OVER_C3.toExponential(3), // ~9.8e-3 (odd-power hierarchy)
    note:
      'Quintic coefficient c5 = sigma-5prime(u0)/120 of sigma(u0+d) ~ sigma_max - (k/2) d^2 + c3 d^3 + c4 d^4 ' +
      '+ c5 d^5, from the antisymmetric 7-point fifth-difference, Richardson-extrapolated from the clean ' +
      'h = 2e-1 / 1e-1 pair. c5 < 0 is an ODD term, so -- like the cubic and UNLIKE the even quartic -- it ' +
      'breaks the arm symmetry and enters the imbalance. Being a fifth (odd) derivative the antisymmetric ' +
      'stencil cancels at h^5, so the round-off floor ~ 1e-16 / (2 h^5) blows up EARLIER than the imp-35575 ' +
      'fourth difference: the raw stencil sign-flips to +1.11e-1 garbage by h = 1e-3; the resolvable window is ' +
      'h in {1e-1 .. 2e-2}, stable to ~9.4e-4 relative, four orders above the ~6e-8 dd cancellation floor ' +
      'there -- so c5 is a genuine surrogate feature, not a double artifact.',
  },
  quintic_materiality_for_arm_skew: {
    tols: MAT_TOLS,
    table: MATERIALITY_TABLE,
    rel_shift_at_tol_1e5: REL_SHIFT_1E5, // ~3.05e-5
    stencil_rel_spread: +D5_REL_SPREAD.toExponential(3), // ~9.4e-4
    quintic_immaterial_at_1e5: QUINTIC_IMMATERIAL_AT_1E5, // true
    note:
      'Solving the local root balance tol = (k/2) d^2 - c3 d^3 - c4 d^4 - c5 d^5 for the rising / falling ' +
      'half-widths with and WITHOUT the quintic (the baseline already carries the imp-35575 quartic), the ' +
      'arm-imbalance slope A_skew = (W_rise - W_fall)/(ln10 * tol) shifts by ~3.06e-4 at tol = 1e-4, ~3.05e-5 ' +
      'at 1e-5 and ~3.05e-6 at 1e-6 -- LINEAR in tol (the odd quintic, two powers of d beyond the cubic, is ' +
      'suppressed by an extra factor d^2 ~ 2 tol / k). At the well-resolved tol = 1e-5 the shift ~3.05e-5 is ' +
      'an ORDER below the imp-35575 quartic shift (~7.70e-5) and BELOW the ~9.4e-4 fifth-difference stencil ' +
      'spread -- not even resolvable against the measurement noise. The quintic pushes A_skew back UP (11.017 ' +
      'at tol = 1e-4, partially undoing the quartic 11.022 -> 11.013 pull), a sub-0.1% net move. The imp-35451 ' +
      'cubic-only prediction A_skew ~ 11.02 therefore stands; neither the even quartic nor the odd quintic ' +
      'materially corrects it.',
  },
  finding:
    'The next ODD-power QUINTIC coefficient of the imp-35337/imp-3406 interior sigma-peak is ' +
    'c5 = sigma-5prime(u0)/120 ~ ' + (+C5.toExponential(6)) + ' (sigma-5prime ~ ' +
    (+SIGMA_5PRIME.toExponential(6)) + '), measured by an antisymmetric 7-point fifth-difference stencil, ' +
    'Richardson-extrapolated from the clean h = 2e-1 / 1e-1 pair and stable to ~9.4e-4 relative over the ' +
    'resolvable window h in {1e-1 .. 2e-2} (the fifth difference cancels at h^5, so the raw stencil sign-flips ' +
    'to +1.11e-1 garbage by h = 1e-3 -- shown in the table for honesty). c5 < 0 is an ODD term that DOES break ' +
    'the arm symmetry (unlike the even quartic), but solving the local root balance with and without it shifts ' +
    'the imp-35451 arm-imbalance slope A_skew ~ 11.02 by only ~3.05e-5 relative at the well-resolved tol = 1e-5 ' +
    '(LINEAR in tol, an order below the imp-35575 quartic shift) -- BELOW the ~9.4e-4 stencil spread, i.e. NOT ' +
    'materially correcting the cubic-only prediction A_skew = -4 c3 / (k^2 ln10). The odd-power hierarchy ' +
    'c5 / c3 ~ 9.8e-3 explains why the odd quintic, though it enters the imbalance, contributes a full order ' +
    'less. Genuine surrogate feature (four orders above the dd cancellation floor), NOT a double artifact. ' +
    'MEASUREMENT ONLY; imp-35337a stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this measures the QUINTIC coefficient of the peak on the imp-3220/imp-3406 double ' +
    'surrogate (dd-certified by imp-35337 to ~1e-16, so the h^5-scale fifth-difference cancellation error ' +
    '~6e-8 relative over the resolvable window is far below the ~9.4e-4 stencil spread -- not a double ' +
    'artifact). It does NOT establish that the surrogate MAP (E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) ' +
    'is a faithful proxy for the true empirical-vs-analytic gap at these heights; that sub-gap imp-35337a ' +
    'stays OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35337/imp-3406 interior ' +
    'sigma-share peak (sigma_max ~ 0.94942901 at N_max ~ 9.219e5) has quintic coefficient ' +
    'c5 = sigma-5prime(u0)/120 ~ -2.5737e-6 (sigma-5prime ~ -3.088468e-4), measured by an antisymmetric ' +
    '7-point fifth-difference stencil, Richardson-extrapolated from the clean h = 2e-1 / 1e-1 pair and stable ' +
    'to ~9.4e-4 relative over the resolvable window h in {1e-1 .. 2e-2} (the 1e-1 / 5e-2 pair agrees to ' +
    '~3.4e-6). The fifth difference cancels at h^5, so the raw stencil sign-flips to +1.11e-1 garbage by ' +
    'h = 1e-3 -- retained in the table for honesty. c5 < 0 is an ODD term (it DOES break the arm symmetry, ' +
    'unlike the even quartic): solving the local root balance with and without it shifts the imp-35451 ' +
    'arm-imbalance slope A_skew ~ 11.02 by only ~3.05e-5 relative at the well-resolved tol = 1e-5 (LINEAR in ' +
    'tol, an order below the imp-35575 quartic shift), BELOW the ~9.4e-4 stencil spread -- so the quintic does ' +
    'NOT materially correct the cubic-only prediction A_skew = -4 c3 / (k^2 ln10). The odd-power hierarchy ' +
    'c5 / c3 ~ 9.8e-3 explains the extra order of suppression. MEASUREMENT ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate, which is NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), ' +
    'the E_trunc = 3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; the surrogate-vs-true ' +
    'fidelity half (imp-35337a) stays OPEN; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35575 (even quartic c4 ~ -2.654580e-5, one order below, negligible); imp-35451 (cubic c3 ~ ' +
    '-2.623677e-4 and A_skew ~ 11.02, extended here); imp-35450 (direct quadratic curvature k ~ 6.43191e-3); ' +
    'imp-35411 (asymmetric plateau endpoints); imp-35337 (dd-certified peak VALUE / 2.1e-5 margin); imp-3406 ' +
    '(interior MAX ~ 9.22e5, on double); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F ' +
    'prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35658_SIGMA_PEAK_QUINTIC_COEFFICIENT_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337/imp-35411 peak landmark (N_max ~ 9.22e5, sigma_max ~ 0.94942901).
    id: 'imp35658-reproduces-imp35337-peak',
    description: 'argmax reproduces the imp-35337/imp-35411 interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // Reuse gate: reproduce the imp-35450 k, imp-35451 c3 and imp-35575 c4 on the same surrogate.
    id: 'imp35658-reproduces-k-c3-c4',
    description: 'reproduces imp-35450 k, imp-35451 c3 ~ -2.6237e-4 and imp-35575 c4 ~ -2.6546e-5 on the same surrogate',
    holds: () =>
      Math.abs(K_CURVATURE - 6.43191e-3) < 5e-8 &&
      C3 < 0 && Math.abs(C3 - -2.623677e-4) < 5e-8 &&
      C4 < 0 && Math.abs(C4 - -2.654580e-5) < 5e-9,
  },
  {
    // Direct quintic coefficient: c5 < 0 near -2.5737e-6, sigma-5prime near -3.0885e-4.
    id: 'imp35658-quintic-coefficient',
    description: 'antisymmetric 7-point fifth-difference gives c5 ~ -2.5737e-6 (sigma-5prime ~ -3.0885e-4), c5 < 0',
    holds: () =>
      C5 < 0 && Math.abs(C5 - -2.573724e-6) < 5e-10 &&
      Math.abs(SIGMA_5PRIME - -3.088468e-4) < 5e-8,
  },
  {
    // Cross-pair consistency: the two Richardson pairs agree to < 1e-4 relative.
    id: 'imp35658-richardson-pairs-consistent',
    description: 'the 2e-1/1e-1 and 1e-1/5e-2 Richardson pairs for c5 agree to < 1e-4 relative',
    holds: () => C5_ALT_PAIR < 0 && C5_PAIR_REL_AGREEMENT < 1e-4,
  },
  {
    // Resolvable window stable to < 3e-3 relative; the h = 1e-3 step blows up (round-off), documented honestly.
    id: 'imp35658-stencil-window-stable-blowup-documented',
    description: 'stencil stable to < 3e-3 over h in {1e-1..2e-2}; h=1e-3 step sign-flips (h^5 round-off) as shown',
    holds: () =>
      D5_REL_SPREAD < 3e-3 && D5_BLOWUP_H1E3 > 0 && Math.abs(D5_BLOWUP_H1E3 - SIGMA_5PRIME) > 1e-3,
  },
  {
    // Materiality: at the well-resolved tol = 1e-5 the odd quintic shifts A_skew below the stencil spread.
    id: 'imp35658-quintic-immaterial-for-arm-skew',
    description: 'at tol=1e-5 the odd quintic shifts A_skew by < the ~9.4e-4 stencil spread -- immaterial vs cubic',
    holds: () =>
      QUINTIC_IMMATERIAL_AT_1E5 === true && REL_SHIFT_1E5 < 9.4e-4 &&
      MATERIALITY_TABLE[1].a_skew_no_quintic > 10 && MATERIALITY_TABLE[1].a_skew_no_quintic < 12,
  },
  {
    // The quintic correction to the imbalance scales LINEARLY in tol (~10x per tol decade).
    id: 'imp35658-quintic-shift-linear-in-tol',
    description: 'the quintic A_skew shift scales linearly in tol (~10x per decade: 3.06e-4 -> 3.05e-5 -> 3.05e-6)',
    holds: () => {
      const r = MATERIALITY_TABLE[0].rel_shift / MATERIALITY_TABLE[1].rel_shift;
      return r > 9 && r < 11;
    },
  },
  {
    // Odd-power hierarchy: the quintic is ~1% of the cubic (a full order below), so it contributes an order less.
    id: 'imp35658-odd-power-hierarchy',
    description: 'c5 / c3 ~ 9.8e-3 (quintic ~1% of cubic), the odd-power hierarchy that suppresses the quintic',
    holds: () => C5_OVER_C3 > 0 && C5_OVER_C3 < 2e-2,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35658-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35658_SIGMA_PEAK_QUINTIC_COEFFICIENT.isRigorous === false &&
      /NO QED/.test(IMP35658_SIGMA_PEAK_QUINTIC_COEFFICIENT.verdict) &&
      /refereed bound is changed/i.test(IMP35658_SIGMA_PEAK_QUINTIC_COEFFICIENT.verdict) &&
      /imp-35337a/.test(IMP35658_SIGMA_PEAK_QUINTIC_COEFFICIENT.residual_sub_gap),
  },
];

for (const a of IMP35658_SIGMA_PEAK_QUINTIC_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35658-sigma-peak-quintic-coefficient assertion failed: ${a.id}`);
  }
}
