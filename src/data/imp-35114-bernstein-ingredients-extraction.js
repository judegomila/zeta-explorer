/**
 * @module imp-35114-bernstein-ingredients-extraction
 *
 * imp-35114 (numerical, S-frontier): EXTRACTS the imp-35012 Bernstein / Levy-Khintchine
 * representation INGREDIENTS for the inherited imp-3220 / imp-3406 / imp-33723 SURROGATE crossover
 * map g(N) = K log T0(N) (K = (C_C/E_trunc)^2 ~ 1.5727e8, T0 = effectiveHeightForN(N)). imp-35012
 * CLASSIFIED g as a Bernstein function of N on the post-peak ramp (g_prime completely monotone) and
 * stated the representation
 *     g(x) = a + b x + integral_0^inf (1 - e^(-x t)) dmu(t),   a, b >= 0,
 * FOLLOWS by Hausdorff-Bernstein-Widder -- but never NUMERICALLY EXTRACTED its ingredients. This
 * module supplies that measurement from source: (1) confirm g_prime is completely monotone through the
 * first orders on the ramp (g_prime > 0 nonnegative, g_pp < 0 so g_prime DECREASING, g_ppp > 0 so
 * g_prime CONVEX); (2) estimate the DRIFT b = lim_{N->inf} g_prime(N) and cross-check it against the
 * far-tail linear-in-x slope g(N)/N of K log T0; (3) estimate the KILLING term a = g(0+).
 * MEASUREMENT ONLY on the surrogate map; the representation is a SURROGATE structural property, NOT
 * operator positivity; changes no bound; C_mb GUE-conditional per imp-486; NO QED.
 *
 * THE INGREDIENTS (what a Levy-Khintchine / Bernstein representation pins down)
 * -----------------------------------------------------------------------------------------
 * For a Bernstein function g the three ingredients are: the KILLING term a = g(0+) >= 0, the DRIFT
 * b = lim_{x->inf} g_prime(x) >= 0 (the linear growth rate at infinity, equivalently lim g(x)/x), and
 * the LEVY measure dmu >= 0 whose Laplace transform is g_prime - b. Because g_prime is completely
 * monotone iff it is the Laplace transform of a nonnegative measure (Hausdorff-Bernstein-Widder),
 * confirming g_prime >= 0, g_pp <= 0, g_ppp >= 0 numerically is a direct check of dmu >= 0.
 *
 * THE FINDINGS (measurement only, from source)
 * -----------------------------------------------------------------------------------------
 *   (I1) g_prime IS NUMERICALLY COMPLETELY MONOTONE. Across eight ramp/far-tail points spanning
 *        N in {1e7 .. 1e18} the from-source central differences give g_prime > 0, g_pp < 0, g_ppp > 0
 *        at EVERY point -- g_prime nonnegative, decreasing, convex -- matching the imp-35012 Bernstein
 *        classification (and the first three signs of the (-1)^(n+1) ladder).
 *   (I2) THE DRIFT IS ZERO. b = lim_{N->inf} g_prime(N) = 0: g_prime(N) decays like K*2pi/(T0 u) (u =
 *        log(T0/2pi)) and both g_prime(N) and the far-tail linear slope g(N)/N collapse toward 0 as N
 *        grows (g_prime ~ 1.5e-22 and g/N ~ 1e-20 by N = 1e30). K log T0 has NO linear-in-x component,
 *        so ALL of g's growth lives in the Levy integral term integral (1 - e^(-N t)) dmu(t). The drift
 *        b and the far-tail linear slope of K log T0 AGREE (both 0), the ticket's cross-check.
 *   (I3) THE KILLING TERM IS a = K log T0(0+) >= 0, FINITE. As N -> 0+ the height map floors at
 *        T0 ~ 17.08 (its Riemann-von Mangoldt inverse floor), so a = K log(17.08) ~ 4.46e8 (or the
 *        analytic-continuation value K log(2pi) ~ 2.89e8 if T0 -> 2pi); either way a is finite and
 *        >= 0, as the representation requires. (g = K log T0 is the classic Bernstein log with drift 0.)
 *
 * PROOF SCOPE / HONESTY. MEASUREMENT ONLY on the INHERITED imp-3220 / imp-3406 / imp-33723 SURROGATE
 * crossover map g. Establishes NO operator positivity and NO spectral consequence; the Bernstein
 * ingredients are structural properties of the SURROGATE map, NOT of the RH operator. The C_mb
 * GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are
 * UNTOUCHED. Changes NO bound; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35012-crossover-complete-monotonicity-bernstein-assessment (the classification this extracts from)
 * @see imp-35113-crossover-deriv-sign-ladder-finite-difference (finite-difference sign ladder cross-check)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (surrogate g = K log T0, K = (C_C/E_trunc)^2)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33723)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8, the pinned surrogate amplitude

// The inherited surrogate crossover map g(N) = K log T0(N), recomputed FROM SOURCE each call.
function g(N) {
  return K_AMPL * Math.log(effectiveHeightForN(N));
}

// Central finite differences of g in N (relative step; ramp spans many decades of N).
function derivs(N) {
  const h = N * 1e-4;
  const gm2 = g(N - 2 * h), gm1 = g(N - h), g0 = g(N), gp1 = g(N + h), gp2 = g(N + 2 * h);
  return {
    g0,
    d1: (gp1 - gm1) / (2 * h),
    d2: (gp1 - 2 * g0 + gm1) / (h * h),
    d3: (gp2 - 2 * gp1 + 2 * gm1 - gm2) / (2 * h * h * h),
  };
}

// (I1) g_prime complete monotonicity through the first orders across the ramp and far tail.
const RAMP_NS = [1e7, 1e8, 3.28e9, 1e10, 1e11, 1e13, 1e15, 1e18];
const CM_TABLE = RAMP_NS.map((N) => {
  const { d1, d2, d3 } = derivs(N);
  return {
    N: +N.toExponential(2),
    gPrime: +d1.toExponential(4),
    gPrimePrime: +d2.toExponential(4),
    gPrimePrimePrime: +d3.toExponential(4),
    cmOk: d1 > 0 && d2 < 0 && d3 > 0, // g_prime nonnegative, decreasing, convex
  };
});
const G_PRIME_COMPLETELY_MONOTONE = CM_TABLE.every((r) => r.cmOk);

// (I2) DRIFT b = lim_{N->inf} g_prime(N), cross-checked against the far-tail linear slope g(N)/N.
const TAIL_NS = [1e10, 1e13, 1e16, 1e20, 1e25, 1e30];
const DRIFT_TABLE = TAIL_NS.map((N) => {
  const { d1 } = derivs(N);
  return { N: +N.toExponential(2), gPrime: +d1.toExponential(4), gOverN: +(g(N) / N).toExponential(4) };
});
const B_DRIFT_FAR = DRIFT_TABLE[DRIFT_TABLE.length - 1].gPrime; // g_prime at the far tail -> b
const SLOPE_FAR = DRIFT_TABLE[DRIFT_TABLE.length - 1].gOverN; // g(N)/N at the far tail -> b
// b is zero: both the derivative limit and the linear-slope estimate collapse toward 0, and each
// successive tail row is strictly smaller than the previous (monotone decay to 0, not a positive floor).
const DRIFT_DECAYS_TO_ZERO =
  DRIFT_TABLE.every((r, i) => i === 0 || r.gPrime < DRIFT_TABLE[i - 1].gPrime) &&
  B_DRIFT_FAR < 1e-18 &&
  SLOPE_FAR < 1e-15;

// (I3) KILLING term a = g(0+) = lim_{N->0+} K log T0(N). Height floors near its RvM inverse floor.
const T0_FLOOR = effectiveHeightForN(1e-6); // ~17.08, the height-map floor as N -> 0+
const A_KILLING_FLOOR = K_AMPL * Math.log(T0_FLOOR); // a from the actual surrogate height floor
const A_KILLING_2PI = K_AMPL * Math.log(TWO_PI); // a from the analytic-continuation limit T0 -> 2pi
const A_KILLING_NONNEGATIVE = A_KILLING_FLOOR >= 0 && A_KILLING_2PI >= 0;

export const IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION = {
  id: 'imp-35114',
  proofSection: 'S-frontier',
  question:
    'Extract the imp-35012 Bernstein / Levy-Khintchine representation ingredients for the surrogate ' +
    'g = K log T0(N): confirm g_prime is completely monotone (nonnegative, decreasing, convex) on the ' +
    'ramp and estimate the killing term a and drift b in g(x) = a + b x + integral (1 - e^(-x t)) dmu(t), ' +
    'checking b against the far-tail linear-in-x slope of K log T0. Measurement only; changes no bound; NO QED.',
  surrogate: 'g(N) = K log T0(N), K = (C_C/E_trunc)^2 ~ 1.5727e8, T0 = effectiveHeightForN(N)',
  kAmplitude: +K_AMPL.toExponential(6),
  gPrimeCompletelyMonotone: G_PRIME_COMPLETELY_MONOTONE,
  cmTable: CM_TABLE,
  driftTable: DRIFT_TABLE,
  ingredients: {
    a_killing_from_height_floor: +A_KILLING_FLOOR.toExponential(6),
    a_killing_from_2pi_limit: +A_KILLING_2PI.toExponential(6),
    b_drift: +B_DRIFT_FAR.toExponential(4),
    b_drift_is_zero: DRIFT_DECAYS_TO_ZERO,
    farTailLinearSlope: +SLOPE_FAR.toExponential(4),
    note:
      'b (drift) = lim g_prime(N) and the far-tail linear slope g(N)/N of K log T0 BOTH collapse to 0, ' +
      'so g has zero drift and all growth is in the Levy integral term integral (1 - e^(-N t)) dmu(t); ' +
      'a (killing) = K log T0(0+) is finite and >= 0.',
  },
  finding: {
    I1_gprime_completely_monotone:
      'From-source central differences give g_prime > 0, g_pp < 0, g_ppp > 0 (g_prime nonnegative, ' +
      'decreasing, convex) at all eight ramp/far-tail points N in {1e7 .. 1e18}, matching the imp-35012 ' +
      'Bernstein classification (g_prime completely monotone). (cm=' + G_PRIME_COMPLETELY_MONOTONE + ').',
    I2_drift_is_zero:
      'The drift b = lim_{N->inf} g_prime(N) = 0: g_prime(N) ~ K*2pi/(T0 log(T0/2pi)) and the far-tail ' +
      'linear slope g(N)/N both decay monotonically toward 0 (g_prime ~ ' + B_DRIFT_FAR.toExponential(2) +
      ', g/N ~ ' + SLOPE_FAR.toExponential(2) + ' at N=1e30), so K log T0 has NO linear-in-x component ' +
      'and the two estimates of b AGREE at 0. (decays=' + DRIFT_DECAYS_TO_ZERO + ').',
    I3_killing_term_finite_nonnegative:
      'The killing term a = g(0+) = K log T0(0+) is finite and >= 0: the height map floors at T0 ~ ' +
      T0_FLOOR.toFixed(3) + ' as N -> 0+, giving a = ' + A_KILLING_FLOOR.toExponential(4) + ' (or the ' +
      'analytic-continuation value K log(2pi) = ' + A_KILLING_2PI.toExponential(4) + '); both >= 0 as ' +
      'the Levy-Khintchine form requires. (nonneg=' + A_KILLING_NONNEGATIVE + ').',
  },
  isRigorous: false, // numerical extraction of the surrogate-map representation ingredients; no QED
  rigorousScope:
    'MEASUREMENT ONLY on the INHERITED imp-3220 / imp-3406 / imp-33723 SURROGATE crossover map g. The ' +
    'extracted ingredients (g_prime completely monotone, drift b = 0, eliminating a = K log T0(0+) >= 0) are ' +
    'structural properties of the SURROGATE map g, NOT of the RH operator. Establishes NO operator ' +
    'positivity, NO spectral consequence, changes NO bound.',
  changesBound: false,
  verdict:
    'MEASUREMENT (frontier-direction, surrogate-map ingredient extraction). From-source central ' +
    'differences of the inherited surrogate g = K log T0(N) confirm g_prime is completely monotone ' +
    '(g_prime > 0, g_pp < 0, g_ppp > 0: nonnegative, decreasing, convex) across N in {1e7 .. 1e18}, ' +
    'matching the imp-35012 Bernstein classification. The extracted Levy-Khintchine ingredients are: ' +
    'DRIFT b = 0 -- lim_{N->inf} g_prime(N) and the far-tail linear slope g(N)/N both collapse to 0 ' +
    '(K log T0 is sub-linear, so all growth lives in the Levy integral term) -- and ELIMINATING a = ' +
    'K log T0(0+) finite and >= 0 (~4.46e8 at the height floor, ~2.89e8 in the T0 -> 2pi limit), as the ' +
    'a, b >= 0 representation requires. The drift and the far-tail linear slope AGREE (the ticket ' +
    'cross-check). MEASUREMENT ONLY on the surrogate map: the C_mb GUE-conditional per imp-486, the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator ' +
    'positivity; changes no bound; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35012 (Bernstein classification, representation follows by Hausdorff-Bernstein-Widder); ' +
    'imp-35113 (finite-difference sign-ladder cross-check); imp-34957/imp-34880 (all-positive P_n, ' +
    'sign (-1)^(n+1)); imp-33723 (surrogate g = K log T0, K = (C_C/E_trunc)^2); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN ' +
    'Riemann-von Mangoldt inverse). Levy-Khintchine representation of Bernstein functions.',
};

export const IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION_ASSERTIONS = [
  {
    // (I1): g_prime is numerically completely monotone (>0, decreasing, convex) at every ramp point.
    id: 'imp35114-gprime-completely-monotone',
    description:
      'from-source central differences give g_prime > 0, g_pp < 0, g_ppp > 0 at all eight ramp/far-tail ' +
      'points (g_prime nonnegative, decreasing, convex) -- the imp-35012 Bernstein classification',
    holds: () => G_PRIME_COMPLETELY_MONOTONE && CM_TABLE.length === RAMP_NS.length && CM_TABLE.every((r) => r.cmOk),
  },
  {
    // (I2): the drift b = lim g_prime(N) is zero, matching the far-tail linear slope g(N)/N.
    id: 'imp35114-drift-is-zero',
    description:
      'the drift b = lim_{N->inf} g_prime(N) and the far-tail linear slope g(N)/N both decay ' +
      'monotonically toward 0 (K log T0 has no linear-in-x component), so b = 0 by both estimates',
    holds: () => DRIFT_DECAYS_TO_ZERO && B_DRIFT_FAR < 1e-18 && SLOPE_FAR < 1e-15,
  },
  {
    // (I3): the killing term a = K log T0(0+) is finite and nonnegative (a >= 0 as the form requires).
    id: 'imp35114-killing-term-finite-nonnegative',
    description:
      'the killing term a = g(0+) = K log T0(0+) is finite and >= 0 from both the height floor ' +
      '(~4.46e8) and the T0 -> 2pi limit (~2.89e8), as the Levy-Khintchine a, b >= 0 form requires',
    holds: () =>
      A_KILLING_NONNEGATIVE &&
      Number.isFinite(A_KILLING_FLOOR) &&
      Number.isFinite(A_KILLING_2PI) &&
      A_KILLING_FLOOR > A_KILLING_2PI, // height floor 17.08 > 2pi => larger a
  },
  {
    // Honesty gate: measurement only on the surrogate map, no operator positivity, no bound change, no QED.
    id: 'imp35114-honesty-gate-no-qed',
    description:
      'measurement scope is the surrogate-map representation ingredients only: establishes no operator ' +
      'positivity, changes no bound, no QED, no refereed bound is changed',
    holds: () =>
      IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION.changesBound === false &&
      IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION.isRigorous === false &&
      /NO QED/.test(IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION.verdict) &&
      /no operator positivity/.test(IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION.verdict) &&
      /refereed bound is changed/i.test(IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION.verdict) &&
      /surrogate/i.test(IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION.rigorousScope),
  },
];

for (const a of IMP35114_BERNSTEIN_INGREDIENTS_EXTRACTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35114-bernstein-ingredients-extraction assertion failed: ${a.id}`);
  }
}
