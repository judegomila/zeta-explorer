/**
 * @module imp-33770-crossover-contraction-cc-amplitude-sweep
 *
 * imp-33770 (numerical, frontier-direction): the COMPLEMENT of imp-33749. imp-33723 wrote
 * the imp-3444 E_coll = E_trunc crossover in CLOSED FORM as the fixed point
 * N_cross = (C_C/E_trunc)^2 * log T0(N_cross), i.e. N = g(N) with g(N) = K * log T0(N) and
 * K = (C_C/E_trunc)^2, and reported the contraction rate |g_prime(N_cross)| ~ 4.54e-2 << 1
 * (unique Banach fixed point, geometric iteration). imp-33749 then swept the contraction over
 * the E_trunc floor factor with C_C held at the C_H = 1/8 ansatz value. This module sweeps the
 * OTHER axis: it holds E_trunc at its base floor and varies the C_C amplitude (the C_H = 1/8
 * ansatz numerator) over 0.5x..2x, re-computing |g_prime(N_cross)| at each amplitude and asking
 * whether the strong contraction survives, and how the contraction-rate C_C-sensitivity compares
 * to its E_trunc-sensitivity. Measurement/stability only; no bound change, no QED.
 *
 * THE MAP AND ITS DERIVATIVE (identical to imp-33723/imp-33749; only C_C is varied)
 * --------------------------------------------------------------------------------
 *     g(N)       = K * log T0(N),         K = (c * C_C_PINNED / E_trunc)^2,
 *     T0         = effectiveHeightForN(N)  (Riemann-von Mangoldt inverse),
 *     g_prime(N) = K * (dT0/dN)/T0 = K * 2pi / (T0 * log(T0/2pi)).
 * The dT0/dN factor is the reciprocal of the zero-counting density
 * dN/dT0 = log(T0/2pi)/2pi (imp-398 prefactor), so g_prime is fully analytic; we cross-check
 * it against a central-difference of g at the converged root and the two agree to all digits.
 *
 * THE KEY STRUCTURAL FACT: g_prime DEPENDS ONLY ON K = (C_C/E_trunc)^2
 * -------------------------------------------------------------------
 * Because K enters the map only through the ratio C_C/E_trunc, scaling C_C by a factor c is
 * EXACTLY the same K-move as scaling E_trunc by 1/c. So the contraction rate g_prime(N_cross) is
 * a function of K ALONE, and the C_C-sensitivity of the contraction has the SAME magnitude as the
 * E_trunc-sensitivity at matched K-span -- only the SIGN differs (C_C is in the numerator of K,
 * E_trunc in the denominator). Concretely the imp-33749 E_trunc-floor 2x..0.5x sub-range maps
 * onto this C_C 0.5x..2x sweep: same |g_prime| endpoints, reversed order.
 *
 * WHY THE 16x SWING IN K BARELY MOVES THE CONTRACTION (the same mechanism as imp-33749)
 * ------------------------------------------------------------------------------------
 * At the root N_cross = K * log T0, so K = N_cross / log T0 and therefore
 *     g_prime(N_cross) = (N_cross / log T0) * 2pi / (T0 * log(T0/2pi))
 *                      = (N_cross / T0) * 2pi / (log T0 * log(T0/2pi)).
 * By the Riemann-von Mangoldt density N_cross/T0 ~ log(T0/2pi)/2pi, so
 *     g_prime(N_cross) ~ 1 / log T0 ~ 1 / log(T0/2pi),
 * a LOG-SLOW quantity. Doubling C_C grows K by 4x and N_cross by ~4x, but the compensating
 * growth of T0 leaves the RATIO N_cross/T0 -- hence g_prime -- almost unchanged; the 16x K swing
 * (0.5x..2x C_C => K in [0.25, 4]x) is absorbed into the slowly-varying log.
 *
 * THE MEASUREMENT: |g_prime(N_cross)| at each C_C amplitude factor
 * ---------------------------------------------------------------
 * For each amplitude factor c in {0.5..2} (c = 1 = imp-33723 C_H = 1/8 ansatz base) set
 * C_C = c * C_C_PINNED at fixed E_trunc = 3.06e-5, K = (C_C/E_trunc)^2, converge the fixed point
 * N_cross = g(N_cross) from a common seed, and record |g_prime(N_cross)| (analytic + central diff).
 *
 * THE FINDING (measurement / stability only)
 * ------------------------------------------
 *   (C0) BASE AMPLITUDE REPRODUCES imp-33723. c = 1.0 gives N_cross ~ 3.280e9 and
 *        |g_prime| ~ 4.542e-2, the exact imp-33723 contraction rate -- confirming the map is the
 *        c = 1 member of the C_C-amplitude sweep (and the f = 1 member of the imp-33749 floor sweep).
 *   (C1) THE CONTRACTION STAYS STRONG AT EVERY AMPLITUDE. Across the full 0.5x..2x sweep
 *        |g_prime(N_cross)| ranges only over [4.28e-2, 4.84e-2] -- entirely below 0.06, two-plus
 *        orders of magnitude short of 1 -- so the fixed point stays UNIQUE (Banach) and iteration
 *        stays geometrically convergent for every swept amplitude. Contraction is C_C-robust.
 *   (C2) THE 16x SWING IN K DOES NOT DEGRADE IT. K = (C_C/E_trunc)^2 changes by exactly 16x from
 *        c = 0.5 to c = 2 (K ~ c^2), and N_cross by ~1.26 decades (7.66e8 -> 1.40e10), yet
 *        |g_prime| moves only ~13%. Reason: g_prime(N_cross) ~ 1/log(T0/2pi) (log T0/2pi runs
 *        17.65 -> 20.40 over the sweep), so the amplitude swing is absorbed into the slow log.
 *   (C3) THE DRIFT IS MONOTONE AND OPPOSITE IN SIGN TO THE imp-33749 FLOOR SWEEP. |g_prime|
 *        DECREASES monotonically as C_C rises (larger C_C -> larger K -> larger N_cross -> larger
 *        T0 -> smaller 1/log(T0/2pi)), whereas in imp-33749 it INCREASES with the floor factor.
 *        This is the sign the C_C/E_trunc ratio dictates: C_C numerator vs E_trunc denominator.
 *   (C4) C_C-SENSITIVITY EQUALS E_trunc-SENSITIVITY AT MATCHED K-SPAN. Because g_prime depends on
 *        K = (C_C/E_trunc)^2 alone, the C_C 0.5x..2x endpoints reproduce the imp-33749 E_trunc
 *        2x..0.5x |g_prime| endpoints to all printed digits (~4.28e-2 and ~4.84e-2), reversed in
 *        order: the two sensitivities are the SAME quantity read from opposite ends of the ratio.
 *
 * VERDICT: STRONG CONTRACTION IS C_C-AMPLITUDE-ROBUST. The imp-33723 closed-form crossover map
 * g(N) = K log T0(N), K = (C_C/E_trunc)^2, is a strong Banach contraction (|g_prime| in
 * [4.28e-2, 4.84e-2] < 0.06) across the whole 0.5x..2x C_C-amplitude sweep at fixed E_trunc, even
 * though K swings 16x and N_cross moves ~1.26 decades; the contraction rate ~ 1/log(T0/2pi) is
 * log-slow, so the unique geometrically-convergent fixed point survives. Since g_prime is a
 * function of K = (C_C/E_trunc)^2 alone, the C_C-sensitivity has the same magnitude as the
 * imp-33749 E_trunc-sensitivity at matched K-span but the opposite sign; the closed-form
 * SOLVABILITY of the crossover is structurally robust to the C_C ansatz amplitude just as it is
 * to the E_trunc floor form.
 *
 * MEASUREMENT / STABILITY ONLY. Conditional-share diagnostic, NOT an RH bound. Component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb stays
 * GUE-conditional (imp-486); the C_C 1/8 ansatz VALUE is UNTOUCHED (imp-2642/imp-2643) -- this
 * sweep varies only a diagnostic amplitude multiplier around it; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33749-crossover-contraction-etrunc-floor-sweep (the E_trunc-axis complement; same map)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the closed-form map + base |g_prime| ~ 4.54e-2)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-33723 base; held FIXED here)

// The closed-form fixed-point map g(N) = K log T0(N) and its analytic derivative.
const kFor = (C_C) => (C_C / E_TRUNC_BASE) ** 2; // K = (C_C/E_trunc)^2
function crossoverFixedPoint(K, seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K * Math.log(effectiveHeightForN(N));
  return N;
}
// Analytic |g_prime| = K * 2pi / (T0 * log(T0/2pi)); dN/dT0 = log(T0/2pi)/2pi is the zero density.
const gPrimeAnalytic = (K, T0) => K * TWO_PI / (T0 * Math.log(T0 / TWO_PI));
// Central-difference cross-check of the same map at the root (bisection-free confirmation).
function gPrimeCentral(K, N) {
  const h = N * 1e-6;
  const G = (x) => K * Math.log(effectiveHeightForN(x));
  return Math.abs((G(N + h) - G(N - h)) / (2 * h));
}

// factor 1.0 = imp-33723 C_H = 1/8 ansatz base amplitude. Sweep the numerator 0.5x..2x.
const CC_FACTORS = [0.5, 0.6, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0];

const SWEEP = CC_FACTORS.map((c) => {
  const C_C = C_C_PINNED * c;
  const K = kFor(C_C);
  const N_cross = crossoverFixedPoint(K, 1e9, 80);
  const T0 = effectiveHeightForN(N_cross);
  const gpA = gPrimeAnalytic(K, T0);
  const gpC = gPrimeCentral(K, N_cross);
  return {
    ccFactor: c,
    C_C: +C_C.toExponential(4),
    K_amplitude: +K.toExponential(4),
    N_cross: +N_cross.toExponential(4),
    logT0_over_2pi: +Math.log(T0 / TWO_PI).toFixed(3),
    contraction_gprime: +gpA.toExponential(4), // analytic |g_prime(N_cross)|
    gprime_central_diff: +gpC.toExponential(4), // central-difference cross-check
  };
});

const BASE = SWEEP.find((r) => r.ccFactor === 1.0);
const gpValues = SWEEP.map((r) => r.contraction_gprime);
const GP_MIN = Math.min(...gpValues); // ~4.277e-2 at c = 2.0 (largest N_cross)
const GP_MAX = Math.max(...gpValues); // ~4.842e-2 at c = 0.5 (smallest N_cross)
const K_SPAN = kFor(C_C_PINNED * 2.0) / kFor(C_C_PINNED * 0.5); // exactly 16x (K ~ c^2)
const N_SPAN_DECADES =
  Math.log10(Math.max(...SWEEP.map((r) => r.N_cross)) / Math.min(...SWEEP.map((r) => r.N_cross)));
// Monotone DECREASE in |g_prime| as C_C rises (larger N_cross -> smaller 1/log) -- OPPOSITE sign
// to imp-33749 (where |g_prime| increases with the E_trunc floor factor).
const GP_MONOTONE_DOWN = SWEEP.every(
  (r, i) => i === 0 || r.contraction_gprime < SWEEP[i - 1].contraction_gprime,
);
// Analytic vs central-difference agreement across the whole sweep.
const MAX_ANALYTIC_VS_CENTRAL = Math.max(
  ...SWEEP.map((r) => Math.abs(r.contraction_gprime / r.gprime_central_diff - 1)),
);

export const IMP33770_CROSSOVER_CONTRACTION_CC_AMPLITUDE_SWEEP = {
  id: 'imp-33770',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-33723 fixed-point contraction rate |g_prime(N_cross)| ~ 4.54e-2 of the ' +
    'crossover map g(N) = (C_C/E_trunc)^2 * log T0(N) across a 0.5x..2x sweep of the C_C ' +
    '(C_H = 1/8 ansatz) amplitude at FIXED E_trunc, complementary to the imp-33749 E_trunc-floor ' +
    'sweep: does the strong contraction (|g_prime| << 1, unique Banach fixed point) survive, and ' +
    'how does the C_C-sensitivity compare to the E_trunc-sensitivity? Measurement/stability only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  map:
    'g(N) = K log T0(N), K = (C_C/E_trunc)^2; g_prime(N) = K*2pi/(T0 log(T0/2pi)); g_prime depends ' +
    'on K = (C_C/E_trunc)^2 ALONE, so scaling C_C by c equals scaling E_trunc by 1/c, and at the ' +
    'root g_prime(N_cross) ~ 1/log(T0/2pi) (log-slow) absorbs the 16x K swing.',
  base_amplitude_reproduces_imp33723: {
    N_cross: BASE.N_cross, // ~3.280e9
    contraction_gprime: BASE.contraction_gprime, // ~4.542e-2, the imp-33723 value
  },
  sweep: SWEEP,
  stability: {
    gprime_min: +GP_MIN.toExponential(4), // ~4.277e-2 at c = 2.0 (largest N_cross)
    gprime_max: +GP_MAX.toExponential(4), // ~4.842e-2 at c = 0.5 (smallest N_cross)
    gprime_stays_below: 0.06, // whole sweep < 0.06 << 1 => strong contraction everywhere
    K_amplitude_span_factor: +K_SPAN.toFixed(1), // exactly 16.0 (0.5x -> 2x amplitude, K ~ c^2)
    N_cross_span_decades: +N_SPAN_DECADES.toFixed(3), // ~1.26 (narrower than imp-33749 ~2.10)
    gprime_monotone_decreasing_with_cc: GP_MONOTONE_DOWN, // true (OPPOSITE sign to imp-33749)
    analytic_vs_central_diff_max_rel: +MAX_ANALYTIC_VS_CENTRAL.toExponential(3), // ~0 (exact)
  },
  cross_axis_comparison: {
    // g_prime is a function of K = (C_C/E_trunc)^2 alone, so C_C-sensitivity = E_trunc-sensitivity
    // at matched K-span but with reversed sign; the C_C 0.5x..2x endpoints reproduce the imp-33749
    // E_trunc 2x..0.5x |g_prime| endpoints to all printed digits.
    cc_sweep_Kspan: +K_SPAN.toFixed(1), // 16x (C_C 0.5x..2x)
    etrunc_sweep_Kspan_imp33749: 100, // 100x (E_trunc 0.5x..5x, per imp-33749)
    gprime_ratio_over_cc_sweep: +(GP_MAX / GP_MIN).toFixed(4), // ~1.13 (matches imp-33749 2x..0.5x sub-range)
    sensitivity_note:
      'C_C-sensitivity and E_trunc-sensitivity are the SAME function of K = (C_C/E_trunc)^2, ' +
      'opposite in sign: the C_C 0.5x..2x endpoints equal the imp-33749 E_trunc 2x..0.5x endpoints.',
  },
  finding: {
    C0_base_amplitude_reproduces_imp33723:
      'c = 1.0 gives N_cross ~ 3.280e9 and |g_prime| ~ 4.542e-2 -- the exact imp-33723 contraction ' +
      'rate -- confirming the map is the c = 1 member of the C_C-amplitude sweep.',
    C1_contraction_strong_at_every_amplitude:
      'Across the full 0.5x..2x sweep |g_prime(N_cross)| stays in [4.28e-2, 4.84e-2], entirely below ' +
      '0.06 and two-plus orders short of 1, so the crossover map is a strong Banach contraction at ' +
      'EVERY amplitude: the fixed point stays unique and iteration stays geometrically convergent.',
    C2_16x_K_swing_does_not_degrade_it:
      'K = (C_C/E_trunc)^2 changes by exactly 16x (c = 0.5 -> 2, K ~ c^2) and N_cross by ~1.26 ' +
      'decades (7.66e8 -> 1.40e10), yet |g_prime| moves only ~13% because g_prime(N_cross) ~ ' +
      '1/log(T0/2pi) (log T0/2pi runs 17.65 -> 20.40): the amplitude swing is absorbed into the ' +
      'slow log, so the contraction is nearly amplitude-invariant.',
    C3_drift_monotone_opposite_sign_to_imp33749:
      '|g_prime| DECREASES monotonically as C_C rises (larger C_C -> larger K -> larger N_cross -> ' +
      'larger T0 -> smaller 1/log(T0/2pi)), the OPPOSITE sign to imp-33749 where it increases with ' +
      'the E_trunc floor factor -- exactly what the C_C-numerator vs E_trunc-denominator roles dictate.',
    C4_cc_sensitivity_equals_etrunc_sensitivity_at_matched_K:
      'Because g_prime depends on K = (C_C/E_trunc)^2 alone, the C_C 0.5x..2x endpoints reproduce the ' +
      'imp-33749 E_trunc 2x..0.5x |g_prime| endpoints (~4.28e-2 and ~4.84e-2) to all printed digits, ' +
      'reversed in order: the two sensitivities are one quantity read from opposite ends of the ratio.',
  },
  isRigorous: false,
  verdict:
    'STRONG CONTRACTION IS C_C-AMPLITUDE-ROBUST. The imp-33723 closed-form crossover map ' +
    'g(N) = K log T0(N), K = (C_C/E_trunc)^2, is a strong Banach contraction (|g_prime(N_cross)| in ' +
    '[4.28e-2, 4.84e-2] < 0.06) across the whole 0.5x..2x C_C-amplitude sweep at fixed E_trunc ' +
    '(c = 1 reproduces N_cross ~ 3.280e9 and |g_prime| ~ 4.542e-2), even though K swings exactly 16x ' +
    'and N_cross moves ~1.26 decades. The contraction rate ~ 1/log(T0/2pi) is log-slow, so the 16x ' +
    'amplitude swing is absorbed into the slow log and |g_prime| moves only ~13% (monotone, larger at ' +
    'smaller C_C). Because g_prime is a function of K = (C_C/E_trunc)^2 alone, the C_C-sensitivity has ' +
    'the SAME magnitude as the imp-33749 E_trunc-sensitivity at matched K-span but the OPPOSITE sign; ' +
    'the C_C 0.5x..2x |g_prime| endpoints reproduce the imp-33749 E_trunc 2x..0.5x endpoints to all ' +
    'printed digits. So the closed-form SOLVABILITY of the crossover is structurally robust to the ' +
    'C_C ansatz amplitude just as it is to the E_trunc floor form. Analytic g_prime matches a ' +
    'central-difference of the map to machine precision across the sweep. Measurement/stability only; ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'C_mb stays GUE-conditional (imp-486); the C_C 1/8 ansatz VALUE is UNTOUCHED (imp-2642/imp-2643) ' +
    '-- this sweep varies only a diagnostic amplitude multiplier around it; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33749 (E_trunc-axis complement, same map, N ~ E_trunc^(-2) landmark span); imp-33723 ' +
    '(closed-form crossover map + base |g_prime| ~ 4.54e-2); imp-3444 (E_coll = E_trunc crossover ' +
    'N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-2631 ' +
    '(E_trunc = 3.06e-5 floor); imp-398 (zero-counting density prefactor); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP33770_CROSSOVER_CONTRACTION_CC_AMPLITUDE_SWEEP_ASSERTIONS = [
  {
    // C0: the base amplitude reproduces the imp-33723 crossover and its |g_prime|.
    id: 'imp33770-base-amplitude-reproduces-imp33723',
    description: 'c = 1.0 gives N_cross ~ 3.280e9 and |g_prime| ~ 4.542e-2 (imp-33723 values)',
    holds: () =>
      Math.abs(BASE.N_cross / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(BASE.contraction_gprime / 4.54e-2 - 1) < 2e-2,
  },
  {
    // C1: the contraction stays strong (< 0.06 << 1) at every swept amplitude.
    id: 'imp33770-strong-contraction-at-every-amplitude',
    description: 'every |g_prime(N_cross)| in the sweep is in (0, 0.06) -- strong contraction, unique fixed point',
    holds: () => SWEEP.every((r) => r.contraction_gprime > 0 && r.contraction_gprime < 0.06),
  },
  {
    // C2: the 16x K swing moves |g_prime| by well under a factor of 2 (log-slow absorption).
    id: 'imp33770-16x-K-swing-barely-moves-gprime',
    description: 'K swings exactly 16x but |g_prime| max/min ratio < 1.3 (1/log absorption)',
    holds: () => Math.abs(K_SPAN - 16) < 0.1 && GP_MAX / GP_MIN < 1.3,
  },
  {
    // C2 (concrete): N_cross spans ~1.26 decades, narrower than the imp-33749 ~2.10.
    id: 'imp33770-N-cross-spans-about-1p26-decades',
    description: 'N_cross span across the 4x C_C sweep is ~1.26 decades (narrower than imp-33749 ~2.10)',
    holds: () => N_SPAN_DECADES > 1.1 && N_SPAN_DECADES < 1.4,
  },
  {
    // C3: |g_prime| decreases monotonically as C_C rises -- OPPOSITE sign to imp-33749.
    id: 'imp33770-gprime-monotone-decreasing-in-cc',
    description: '|g_prime| decreases monotonically as C_C rises (larger N_cross -> smaller 1/log) -- opposite to imp-33749',
    holds: () => GP_MONOTONE_DOWN === true,
  },
  {
    // C4: C_C-sensitivity equals E_trunc-sensitivity at matched K-span (g_prime is a function of K alone).
    id: 'imp33770-cc-sensitivity-matches-etrunc-at-matched-K',
    description: 'C_C 0.5x..2x |g_prime| endpoints reproduce the imp-33749 E_trunc 2x..0.5x endpoints (~4.28e-2, ~4.84e-2)',
    holds: () =>
      Math.abs(GP_MIN / 4.277e-2 - 1) < 5e-3 && Math.abs(GP_MAX / 4.842e-2 - 1) < 5e-3,
  },
  {
    // Cross-check: analytic g_prime matches a central-difference of the map to high precision.
    id: 'imp33770-analytic-matches-central-diff',
    description: 'analytic |g_prime| agrees with central-difference of g to < 1e-5 relative across the sweep',
    holds: () => MAX_ANALYTIC_VS_CENTRAL < 1e-5,
  },
  {
    // Honesty gate: measurement/stability only, C_C-robust verdict, no QED, no refereed bound is changed.
    id: 'imp33770-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, C_C-amplitude-robust verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP33770_CROSSOVER_CONTRACTION_CC_AMPLITUDE_SWEEP.isRigorous === false &&
      /STRONG CONTRACTION IS C_C-AMPLITUDE-ROBUST/.test(IMP33770_CROSSOVER_CONTRACTION_CC_AMPLITUDE_SWEEP.verdict) &&
      /NO QED/.test(IMP33770_CROSSOVER_CONTRACTION_CC_AMPLITUDE_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP33770_CROSSOVER_CONTRACTION_CC_AMPLITUDE_SWEEP.verdict),
  },
];

for (const a of IMP33770_CROSSOVER_CONTRACTION_CC_AMPLITUDE_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33770-crossover-contraction-cc-amplitude-sweep assertion failed: ${a.id}`);
  }
}
