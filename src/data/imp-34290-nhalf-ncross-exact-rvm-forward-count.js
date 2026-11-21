/**
 * @module imp-34290-nhalf-ncross-exact-rvm-forward-count
 *
 * imp-34290 (numerical, frontier-direction): imp-33848 proved the imp-33796 ordering
 * N_half < N_cross (the sigma_full = 1/2 halving landmark sits strictly BELOW the
 * E_coll = E_trunc crossover) is STRICT in closed form WITHIN the inherited component
 * model. But both imp-33796 and imp-33848 locate the two landmarks by bisecting in N,
 * with the height entering as T0 = effectiveHeightForN(N) -- the Newton-INVERTED
 * Riemann-von Mangoldt approximation. This module MEASURES whether the same strict
 * ordering survives when the landmark N-values are instead recovered by the EXACT
 * Riemann-von Mangoldt FORWARD count N = zeroCountAtHeight(T0) (the imp-34213 style:
 * solve for the landmark HEIGHT first, then forward-count N), quantifying any shift in
 * the N_half / N_cross separation and confirming the sign of the inequality is preserved.
 *
 * THE MODEL (identical pinned sub-terms to imp-33796 / imp-33848 -- no fresh terms)
 * --------------------------------------------------------------------------------
 *     sigma_full = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow  = C_F (log T0 / T0) * Gronwall,     E_trunc = 3.06e-5   (N-independent),
 *     C_F     = (log(T0 / 2pi) + 1) / 2pi.
 *
 * THE TWO INVERSION DIRECTIONS
 * ----------------------------
 *   (N-axis, incumbent imp-33796 / imp-33848): bisect the condition in N, with the
 *       height derived by the Newton-inverted approximation T0 = effectiveHeightForN(N).
 *       -> N_half ~ 3.267235e9, N_cross ~ 3.280294e9.
 *   (Height-axis, EXACT forward count, this module, imp-34213 style): bisect the SAME
 *       condition in the height T0, with N recovered by the exact forward count
 *       N = zeroCountAtHeight(T0) = (T0/2pi)(log(T0/2pi) - 1); then read the landmark N
 *       off that forward count. -> T0_half ~ 1.139470e9, T0_cross ~ 1.143785e9.
 *
 * THE FINDING (measurement / interpretation only)
 * -----------------------------------------------
 *   (F1) STRICT ORDERING SURVIVES ON BOTH AXES. On the height axis T0_half ~ 1.13947e9
 *        sits strictly BELOW T0_cross ~ 1.14378e9, and forward-counting each height gives
 *        N_half ~ 3.267235e9 < N_cross ~ 3.280294e9. The sign of the imp-33848 strict
 *        inequality is preserved -- the ordering is NOT an artifact of solving in N versus
 *        solving in the height.
 *   (F2) THE RECOVERED N-VALUES AGREE TO MACHINE PRECISION. Because effectiveHeightForN
 *        is BY CONSTRUCTION the numerical inverse of zeroCountAtHeight (round-trip pinned
 *        to < 1e-4 in lambda-rh-height-mapping, and to ~1e-9 here where Newton converges),
 *        the exact-forward-count N_half and N_cross reproduce the incumbent N-axis bisection
 *        to ~3e-15 relative, and the N_cross/N_half - 1 separation shifts by only ~6e-15.
 *        The inversion DIRECTION contributes no measurable shift; the ~0.400% separation is
 *        an intrinsic property of the landmark pair, not of the height approximation used.
 *   (F3) THE HEIGHT SEPARATION IS THE N SEPARATION DE-AMPLIFIED BY THE RvM DENSITY. The
 *        height gap T0_cross/T0_half - 1 ~ 0.3786% is SMALLER than the N gap
 *        N_cross/N_half - 1 ~ 0.3997% by the local RvM log-density Jacobian
 *        d(log N)/d(log T0) = (T0/N)(log(T0/2pi)/2pi) ~ 1.056 at T0 ~ 1.14e9 -- the exact
 *        forward count STRETCHES the height gap into the N gap, but monotonically, so the
 *        sign is identical whether the ordering is read in the height or in the count.
 *
 * The punchline: the imp-33848 closed-form strict ordering N_half < N_cross SURVIVES the
 * exact Riemann-von Mangoldt forward count intact. Recovering the landmark N-values by the
 * forward count zeroCountAtHeight(T0) instead of the Newton-inverted effectiveHeightForN(N)
 * shifts the separation by only ~6e-15 (machine epsilon) and preserves the inequality on
 * both the height axis and the recovered-count axis. The ordering is a property of the
 * landmark pair, not of the inversion direction.
 *
 * MEASUREMENT / INTERPRETATION ONLY. Conditional-share curvature diagnostic, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8
 * ansatz is UNTOUCHED (imp-2642); changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33848-nhalf-ncross-strict-ordering-closed-form (closed-form strict ordering in N)
 * @see imp-33796-nhalf-below-ncross-independent-recompute (N-axis independent recompute)
 * @see imp-34213-eflow-onset-closed-form (fixed point in HEIGHT then exact forward count)
 * @see lambda-rh-height-mapping (effectiveHeightForN inverse; zeroCountAtHeight exact forward count)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33744/imp-33767/imp-33796 exactly

// --- N-axis incumbent (imp-33796 / imp-33848): height by Newton-inverted approximation ---
function termsN(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigmaFullN(N) {
  const { E_flow, E_coll } = termsN(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}
function solveHalfN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaFullN(Math.exp(mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
function solveCrossN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (termsN(Math.exp(mid)).E_coll > E_TRUNC_PT) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}

// --- Height-axis, EXACT Riemann-von Mangoldt forward count (this module, imp-34213 style) ---
// Free variable is the height T0; the landmark N is recovered by the exact forward count
// N = zeroCountAtHeight(T0), NOT by the Newton-inverted effectiveHeightForN.
function termsT(T0) {
  const N = zeroCountAtHeight(T0);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { N, L, E_flow, E_coll };
}
function sigmaFullT(T0) {
  const { E_flow, E_coll } = termsT(T0);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}
// sigma_full is monotone DECREASING in T0 (N grows with T0, so E_coll ~ N^{-1/2} shrinks).
function solveHalfT() {
  let lo = Math.log(1e3);
  let hi = Math.log(1e11);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaFullT(Math.exp(mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
// E_coll is monotone DECREASING in T0, so bisect the > E_trunc branch for the crossover height.
function solveCrossT() {
  let lo = Math.log(1e3);
  let hi = Math.log(1e10);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (termsT(Math.exp(mid)).E_coll > E_TRUNC_PT) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}

// --- Incumbent N-axis landmarks (Newton-inverted height) ---
const N_HALF_NAXIS = solveHalfN(); // ~3.267235e9
const N_CROSS_NAXIS = solveCrossN(); // ~3.280294e9
const SEP_NAXIS = N_CROSS_NAXIS / N_HALF_NAXIS - 1; // ~+0.3997%

// --- Exact-forward-count landmarks (solve height, then N = zeroCountAtHeight) ---
const T0_HALF = solveHalfT(); // ~1.139470e9
const T0_CROSS = solveCrossT(); // ~1.143785e9
const N_HALF_EXACT = zeroCountAtHeight(T0_HALF); // ~3.267235e9
const N_CROSS_EXACT = zeroCountAtHeight(T0_CROSS); // ~3.280294e9
const SEP_EXACT = N_CROSS_EXACT / N_HALF_EXACT - 1; // ~+0.3997% (matches N-axis to ~1e-14)
const SEP_HEIGHT = T0_CROSS / T0_HALF - 1; // ~+0.3786% (height gap, de-amplified)

// --- Cross-axis shift (the inversion-direction artifact, measured) ---
const NHALF_REL_SHIFT = N_HALF_EXACT / N_HALF_NAXIS - 1; // ~3.6e-15
const NCROSS_REL_SHIFT = N_CROSS_EXACT / N_CROSS_NAXIS - 1; // ~-2.4e-15
const SEP_ABS_SHIFT = Math.abs(SEP_EXACT - SEP_NAXIS); // ~6e-15

// --- (F3) the RvM log-density Jacobian that de-amplifies the height gap into the N gap ---
// d(log N)/d(log T0) = (T0/N)(dN/dT0) = (T0/N)(log(T0/2pi)/2pi), evaluated at the crossover.
const RVM_JACOBIAN = (T0_CROSS / N_CROSS_EXACT) * (Math.log(T0_CROSS / TWO_PI) / TWO_PI); // ~1.056
const SEP_RATIO_N_OVER_HEIGHT = SEP_NAXIS / SEP_HEIGHT; // ~1.056, should match RVM_JACOBIAN

export const IMP34290_NHALF_NCROSS_EXACT_RVM_FORWARD_COUNT = {
  id: 'imp-34290',
  proofSection: 'S-frontier',
  question:
    'imp-33848 proved the imp-33796 ordering N_half < N_cross STRICT in closed form WITHIN the ' +
    'component model, but both locate the landmarks by bisecting in N with the height entering as the ' +
    'Newton-inverted approximation T0 = effectiveHeightForN(N). MEASURE whether the same strict ' +
    'ordering survives when the landmark N-values are recovered by the EXACT Riemann-von Mangoldt ' +
    'FORWARD count N = zeroCountAtHeight(T0) (imp-34213 style: solve the height, then forward-count), ' +
    'quantifying any shift in the N_half/N_cross separation and confirming the sign is preserved. ' +
    'Measurement only; changes no bound; NOT an RH verdict; no QED.',
  measuredQuantity:
    'the two sigma(N) landmarks relocated on the HEIGHT axis (bisect the SAME condition in T0, then ' +
    'recover N by the exact forward count zeroCountAtHeight(T0)) versus the imp-33796/imp-33848 N-axis ' +
    'bisection (height by Newton-inverted effectiveHeightForN), the survival of the strict ordering, ' +
    'and the separation shift attributable to the inversion direction',
  incumbentNAxis: {
    N_half: +N_HALF_NAXIS.toExponential(6), // ~3.267235e9
    N_cross: +N_CROSS_NAXIS.toExponential(6), // ~3.280294e9
    strict_ordering: N_HALF_NAXIS < N_CROSS_NAXIS, // true
    separation: +SEP_NAXIS.toFixed(6), // ~0.003997
  },
  exactForwardCount: {
    T0_half: +T0_HALF.toExponential(6), // ~1.139470e9
    T0_cross: +T0_CROSS.toExponential(6), // ~1.143785e9
    strict_ordering_in_height: T0_HALF < T0_CROSS, // true
    N_half: +N_HALF_EXACT.toExponential(6), // ~3.267235e9 (= zeroCountAtHeight(T0_half))
    N_cross: +N_CROSS_EXACT.toExponential(6), // ~3.280294e9 (= zeroCountAtHeight(T0_cross))
    strict_ordering_in_count: N_HALF_EXACT < N_CROSS_EXACT, // true
    separation: +SEP_EXACT.toFixed(6), // ~0.003997 (matches N-axis)
    height_separation: +SEP_HEIGHT.toFixed(6), // ~0.003786 (de-amplified by RvM density)
  },
  inversionShift: {
    N_half_rel_shift: +NHALF_REL_SHIFT.toExponential(2), // ~3.6e-15
    N_cross_rel_shift: +NCROSS_REL_SHIFT.toExponential(2), // ~-2.4e-15
    separation_abs_shift: +SEP_ABS_SHIFT.toExponential(2), // ~6e-15 (machine epsilon)
    rvm_jacobian_dlogN_over_dlogT0: +RVM_JACOBIAN.toFixed(4), // ~1.0557
    sep_ratio_N_over_height: +SEP_RATIO_N_OVER_HEIGHT.toFixed(4), // ~1.0557 (matches the Jacobian)
    interpretation:
      'Because effectiveHeightForN is BY CONSTRUCTION the numerical inverse of zeroCountAtHeight, ' +
      'recovering the landmark N-values by the exact forward count instead of the Newton-inverted ' +
      'height reproduces both landmarks to ~3e-15 relative and shifts the N_cross/N_half - 1 ' +
      'separation by only ~6e-15 (machine epsilon). The strict ordering survives on BOTH the height ' +
      'axis (T0_half < T0_cross) and the recovered-count axis (N_half < N_cross); the sign of the ' +
      'imp-33848 inequality is preserved with a ~0.400% margin (~13 million zeros of headroom). The ' +
      'height gap ~0.3786% is the N gap ~0.3997% de-amplified by the local RvM log-density Jacobian ' +
      '(T0/N)(log(T0/2pi)/2pi) ~ 1.056 -- the forward count stretches the height gap into the count ' +
      'gap monotonically, so the ordering sign is identical whichever axis it is read on.',
  },
  finding: {
    F1_strict_ordering_survives_exact_forward_count:
      'Solving the SAME two conditions on the height axis and recovering N by the exact forward count ' +
      'zeroCountAtHeight(T0): T0_half ~ 1.13947e9 < T0_cross ~ 1.14378e9, and forward-counting gives ' +
      'N_half ~ 3.267235e9 < N_cross ~ 3.280294e9. The imp-33848 strict ordering survives the exact ' +
      'Riemann-von Mangoldt forward count intact on both axes.',
    F2_recovered_N_agrees_to_machine_precision:
      'The exact-forward-count N_half and N_cross reproduce the incumbent N-axis bisection to ~3e-15 ' +
      'relative and the separation shifts by only ~6e-15, because effectiveHeightForN is the numerical ' +
      'inverse of zeroCountAtHeight. The inversion DIRECTION contributes no measurable shift; the ' +
      '~0.400% separation is an intrinsic property of the landmark pair, not of the height approximation.',
    F3_height_gap_is_N_gap_de_amplified_by_rvm_density:
      'The height gap T0_cross/T0_half - 1 ~ 0.3786% is the N gap N_cross/N_half - 1 ~ 0.3997% ' +
      'de-amplified by the local RvM log-density Jacobian d(log N)/d(log T0) = (T0/N)(log(T0/2pi)/2pi) ' +
      '~ 1.056 at T0 ~ 1.14e9. The exact forward count stretches the height gap into the count gap ' +
      'monotonically, so the sign is identical whether the ordering is read in the height or the count.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33848 closed-form strict ordering ' +
    'N_half < N_cross SURVIVES the EXACT Riemann-von Mangoldt forward count. Relocating both sigma(N) ' +
    'landmarks on the HEIGHT axis (bisect the same condition in T0, then recover N by the exact forward ' +
    'count N = zeroCountAtHeight(T0), imp-34213 style) gives T0_half ~ 1.13947e9 < T0_cross ~ 1.14378e9 ' +
    'and N_half ~ 3.267235e9 < N_cross ~ 3.280294e9 -- strict on BOTH axes. The recovered N-values match ' +
    'the imp-33796/imp-33848 N-axis bisection (height by Newton-inverted effectiveHeightForN) to ~3e-15 ' +
    'relative, and the N_cross/N_half - 1 separation shifts by only ~6e-15 (machine epsilon), because ' +
    'effectiveHeightForN is by construction the numerical inverse of zeroCountAtHeight. The height gap ' +
    '~0.3786% is the count gap ~0.3997% de-amplified by the RvM log-density Jacobian ~1.056; the ' +
    'forward count stretches one into the other monotonically, so the sign is invariant to the axis. ' +
    'The strict ordering is a property of the landmark pair, NOT an artifact of the inversion direction. ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33848 (closed-form strict ordering N_half < N_cross); imp-33796 (N-axis independent recompute); ' +
    'imp-34213 (fixed point in height then exact forward count zeroCountAtHeight); imp-33767 (F3 ' +
    'N_half below N_cross); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN inverse, zeroCountAtHeight exact forward count).',
};

export const IMP34290_NHALF_NCROSS_EXACT_RVM_FORWARD_COUNT_ASSERTIONS = [
  {
    // Reuse gate: the incumbent N-axis landmarks reproduce the imp-33796/imp-33848 values.
    id: 'imp34290-reuses-incumbent-landmarks',
    description: 'incumbent N-axis N_half ~ 3.267e9 and N_cross ~ 3.280e9 both to ~1%',
    holds: () =>
      Math.abs(N_HALF_NAXIS / 3.267235e9 - 1) < 0.01 &&
      Math.abs(N_CROSS_NAXIS / 3.280294e9 - 1) < 0.01,
  },
  {
    // (F1a): the strict ordering survives on the HEIGHT axis.
    id: 'imp34290-strict-ordering-in-height',
    description: 'T0_half strictly below T0_cross (exact-forward-count height axis)',
    holds: () => T0_HALF < T0_CROSS,
  },
  {
    // (F1b): the strict ordering survives in the exact-forward-count recovered N.
    id: 'imp34290-strict-ordering-in-exact-count',
    description: 'zeroCountAtHeight(T0_half) strictly below zeroCountAtHeight(T0_cross)',
    holds: () => N_HALF_EXACT < N_CROSS_EXACT,
  },
  {
    // (F2): the exact-forward-count landmarks match the N-axis bisection to machine precision.
    id: 'imp34290-forward-count-matches-naxis',
    description: 'exact-forward-count N_half/N_cross reproduce the N-axis bisection to < 1e-10 relative',
    holds: () =>
      Math.abs(NHALF_REL_SHIFT) < 1e-10 &&
      Math.abs(NCROSS_REL_SHIFT) < 1e-10 &&
      SEP_ABS_SHIFT < 1e-10,
  },
  {
    // (F3): the height gap is the N gap de-amplified by the RvM log-density Jacobian ~1.056.
    id: 'imp34290-height-gap-de-amplified-by-rvm-density',
    description: 'sep_N/sep_height matches the RvM Jacobian (T0/N)(log(T0/2pi)/2pi) to < 1%',
    holds: () =>
      SEP_HEIGHT < SEP_NAXIS &&
      Math.abs(SEP_RATIO_N_OVER_HEIGHT / RVM_JACOBIAN - 1) < 0.01,
  },
  {
    // Honesty gate: measurement/interpretation only, no QED, no refereed bound is changed.
    id: 'imp34290-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34290_NHALF_NCROSS_EXACT_RVM_FORWARD_COUNT.isRigorous === false &&
      /NO QED/.test(IMP34290_NHALF_NCROSS_EXACT_RVM_FORWARD_COUNT.verdict) &&
      /refereed bound is changed/i.test(IMP34290_NHALF_NCROSS_EXACT_RVM_FORWARD_COUNT.verdict),
  },
];

for (const a of IMP34290_NHALF_NCROSS_EXACT_RVM_FORWARD_COUNT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34290-nhalf-ncross-exact-rvm-forward-count assertion failed: ${a.id}`);
  }
}
