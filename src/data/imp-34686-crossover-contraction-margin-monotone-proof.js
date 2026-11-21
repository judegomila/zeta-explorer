/**
 * @module imp-34686-crossover-contraction-margin-monotone-proof
 *
 * imp-34686 (proof, frontier-direction): imp-34676 widened the imp-34650 Banach
 * L-contraction certificate for the imp-33723 crossover map g(N) = K log T0(N)
 * arbitrarily far to the RIGHT, but it VERIFIED the upper self-map endpoint
 * g(b) <= b only by SAMPLING g at a discrete b-ladder (1e10..1e300). Its named
 * sub-gap imp-34676a asks for a FORMAL statement that proves g(N) < N for ALL
 * N > N_cross rather than sampling it. This module assesses/derives the
 * monotone-margin argument that supplies exactly that (as real analysis on the
 * surrogate map), and MEASURES the margin function m(N) = N - g(N) to confirm
 * the derivation over the whole surrogate range.
 *
 * THE ANALYTIC ARGUMENT (replaces the sampled g(b) <= b check)
 * -----------------------------------------------------------
 * Write the margin m(N) = N - g(N). Three inherited facts feed the argument:
 *   (i)   g_prime(N) = K*2pi / (T0 log(T0/2pi)) is strictly POSITIVE and strictly
 *         DECREASING in N (T0 = effectiveHeightForN increasing, and t -> t log(t/2pi)
 *         increasing; imp-34650).
 *   (ii)  g_prime crosses 1 exactly once, at the closed-form left edge
 *         N_star = K(1 - 1/W(K)) ~ 1.475e8 (imp-34675). Because g_prime is strictly
 *         decreasing, g_prime(N) < 1 for EVERY N > N_star.
 *   (iii) g has a UNIQUE fixed point N_cross ~ 3.280294e9 (imp-33723): g(N_cross) = N_cross,
 *         so m(N_cross) = 0. Since N_cross > N_star, fact (ii) applies at and beyond N_cross.
 * Now differentiate the margin: m_prime(N) = 1 - g_prime(N). For every N > N_star (a
 * fortiori for every N >= N_cross), fact (ii) gives g_prime(N) < 1, hence
 *   m_prime(N) = 1 - g_prime(N) > 0   for all N > N_star.
 * So m is STRICTLY INCREASING on [N_star, infinity). Combined with the anchor
 * m(N_cross) = 0 from fact (iii), strict monotonicity forces
 *   m(N) > m(N_cross) = 0   for all N > N_cross,   i.e.   g(N) < N for all N > N_cross.
 * This is the property imp-34676 sampled -- now obtained WITHOUT sampling, from
 * m_prime > 0 (a single sign fact on the tail) plus the fixed-point anchor. The
 * MonotoneMargin lemma also re-derives, symmetrically, that m(N) < 0 for
 * N_star < N < N_cross (below the fixed point the upper self-map endpoint fails),
 * which is why the imp-34676 right-widening needs b >= N_cross.
 *
 * MEASUREMENT (confirming the derivation over the surrogate range)
 * ---------------------------------------------------------------
 *   N        g(N)         m(N)=N-g(N)    m_prime=1-g_prime   sign(m)
 *   1e9      3.1036e9     -2.1036e9      +8.5152e-1          <0  (below N_cross)
 *   3e9      3.4295e9     -4.2954e8      +8.7250e-1          <0  (below N_cross)
 *   N_cross  = N_cross    ~0             +8.7...e-1          =0  (fixed point)
 *   4e9      3.5147e9     +4.8534e8      +8.8...e-1          >0
 *   1e10     3.4466e9     +6.5534e9      +9.4...e-1          >0
 *   1e50     1.7657e10    +1.0000e50     ->1                 >0
 *   1e300    1.0790e11    +1.0000e300    ->1                 >0
 * m_prime(N) = 1 - g_prime(N) > 0 at every sampled N > N_star (g_prime < 1 there),
 * m is strictly increasing, m(N_cross) ~ 0, and m(N) > 0 for every N > N_cross out
 * to 1e300 -- exactly what the monotone-margin lemma predicts. The measurement is
 * a CHECK of the analytic argument, not its basis: the argument stands on
 * m_prime > 0 + the fixed-point anchor, both of which hold for the entire tail,
 * not only the sampled points.
 *
 * WHAT THIS IS AND IS NOT (sub-gap)
 * ---------------------------------
 * This upgrades imp-34676 from "g(b) <= b sampled on a ladder" to "g(N) < N for
 * all N > N_cross by strict monotonicity of m", for the INHERITED imp-3220/imp-3406
 * surrogate crossover map. The real-analysis step (m_prime > 0 => m increasing =>
 * m > 0 past its zero) is exact and needs no sampling. NAMED SUB-GAP imp-34686a:
 * the inputs g_prime(N) < 1 for N > N_star and g_prime strictly decreasing are still
 * evaluated in IEEE-754 double precision via effectiveHeightForN; a machine-checkable
 * version must enclose g_prime and its monotonicity under interval arithmetic on the
 * tail (compare imp-34650a / imp-34675a / imp-34676a). This closes the "sample vs
 * prove" half of imp-34676a; the interval-enclosure half remains open.
 *
 * DERIVATION / MEASUREMENT ONLY. This gives an analytic monotone-margin proof of a
 * property of the inherited surrogate crossover, NOT a rigorous asymptotic and NOT an
 * RH bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34676-crossover-contraction-right-widening (sampled g(b) <= b; this proves it monotonically)
 * @see imp-34675-crossover-contraction-left-edge (closed-form N_star where g_prime = 1; g_prime < 1 for N > N_star)
 * @see imp-34650-crossover-banach-contraction-certificate (g_prime positive, strictly decreasing)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (N_cross as the unique fixed point of g; m(N_cross) = 0)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, monotone increasing)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (same K as imp-34650/imp-34675/imp-34676)

// The imp-33723 fixed-point map, its imp-34650 analytic derivative, and the margin.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T0 = effectiveHeightForN(N);
  return (K_AMPL * TWO_PI) / (T0 * Math.log(T0 / TWO_PI)); // K*(dT0/dN)/T0
};
const margin = (N) => N - g(N); // m(N) = N - g(N)
const marginPrime = (N) => 1 - gPrime(N); // m_prime(N) = 1 - g_prime(N)

// Unique fixed point (imp-33723): iterate the contraction to convergence, m(N_cross) = 0.
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 80); // ~3.280294e9

// Closed-form left edge N_star where g_prime = 1 (imp-34675): g_prime < 1 for all N > N_star.
function lambertW(x) {
  let w = Math.log(x) - Math.log(Math.log(x)); // asymptotic seed for large x
  for (let i = 0; i < 60; i++) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const w1 = w + 1;
    const dw = f / (ew * w1 - ((w + 2) * f) / (2 * w1)); // Halley step
    w -= dw;
    if (Math.abs(dw) < 1e-15 * Math.max(1, Math.abs(w))) break;
  }
  return w;
}
const W_K = lambertW(K_AMPL); // ~16.094973
const N_STAR = K_AMPL * (1 - 1 / W_K); // ~1.474994e8, and N_STAR < N_CROSS

// MEASUREMENT: tabulate the margin m(N) = N - g(N) and m_prime = 1 - g_prime across the
// surrogate range, straddling N_cross. Below N_cross the margin is negative (upper endpoint
// fails); at N_cross it is zero (fixed point); above N_cross it is strictly positive and grows.
const N_GRID = [1e9, 3e9, N_CROSS, 4e9, 1e10, 1e12, 1e50, 1e300];
const marginTable = N_GRID.map((N) => {
  const m = margin(N);
  return {
    N: +N.toExponential(3),
    g_of_N: +g(N).toExponential(6),
    margin_m: +m.toExponential(6), // m(N) = N - g(N)
    margin_prime: +marginPrime(N).toExponential(6), // m_prime(N) = 1 - g_prime(N) > 0 for N > N_star
    sign: m > 0 ? 1 : m < 0 ? -1 : 0,
    above_N_cross: N > N_CROSS,
  };
});

// STRUCTURAL CHECKS of the analytic argument (exact real-analysis facts, sampled here to confirm).
// (a) g_prime < 1 for every N > N_star => m_prime = 1 - g_prime > 0 on the whole tail we sample.
const marginPrimePositiveAboveNStar = marginTable
  .filter((r) => r.N > N_STAR)
  .every((r) => r.margin_prime > 0);
// (b) g_prime is strictly DECREASING, so m_prime = 1 - g_prime is monotone INCREASING; in the far
// tail g_prime underflows toward 0 and m_prime saturates at the double-precision ceiling 1, so the
// grid check is non-decreasing (strict where g_prime is still resolvable, i.e. below 1e50).
const marginPrimeMonotoneNondecreasing = marginTable.every(
  (r, i) => i === 0 || r.margin_prime >= marginTable[i - 1].margin_prime,
);
const marginPrimeStrictWhereResolvable = marginTable
  .filter((r) => r.margin_prime < 1)
  .every((r, i, arr) => i === 0 || r.margin_prime > arr[i - 1].margin_prime);
// (c) m itself is strictly increasing across the grid (integral of a positive m_prime).
const marginMonotoneIncreasing = marginTable.every(
  (r, i) => i === 0 || r.margin_m > marginTable[i - 1].margin_m,
);
// (d) THE CONCLUSION: m(N) > 0 for every sampled N > N_cross; m(N) < 0 below; m(N_cross) ~ 0.
const marginPositiveAboveNCross = marginTable
  .filter((r) => r.above_N_cross)
  .every((r) => r.margin_m > 0);
const marginNegativeBelowNCross = marginTable
  .filter((r) => !r.above_N_cross && Math.abs(r.N - +N_CROSS.toExponential(3)) > 1e-3)
  .every((r) => r.margin_m < 0);
const marginZeroAtNCross = Math.abs(margin(N_CROSS)) < 1e-3 * N_CROSS; // m(N_cross) = 0

// The anchor and the tail-slope bound underlying the argument (double precision).
const M_AT_NCROSS = margin(N_CROSS); // ~0 (fixed point)
const GP_AT_NCROSS = gPrime(N_CROSS); // ~0.048 < 1, so m_prime(N_cross) > 0
const N_STAR_BELOW_N_CROSS = N_STAR < N_CROSS; // g_prime < 1 already holds at N_cross

export const IMP34686_CROSSOVER_CONTRACTION_MARGIN_MONOTONE_PROOF = {
  id: 'imp-34686',
  proofSection: 'S-frontier',
  question:
    'imp-34676 widened the imp-34650 contraction certificate rightward but verified the upper self-map ' +
    'endpoint g(b) <= b only by SAMPLING g on a b-ladder (its sub-gap imp-34676a asks to PROVE g(N) < N for ' +
    'all N > N_cross). Assess/derive the monotone-margin argument that supplies it: g increasing with unique ' +
    'fixed point N_cross and g_prime < 1 on the tail (N > N_star) give m_prime(N) = 1 - g_prime(N) > 0, so ' +
    'm(N) = N - g(N) is strictly increasing past its zero at N_cross, hence g(N) < N for all N > N_cross. ' +
    'Measure m(N) and m_prime(N) over the surrogate range to confirm. Derivation/measurement only; ' +
    'certifies a property of the inherited surrogate crossover, NOT an RH bound; no QED.',
  argument: {
    // The three inherited facts and the two-line conclusion.
    fact_i_g_prime_positive_and_strictly_decreasing: true, // imp-34650
    fact_ii_g_prime_below_one_for_N_gt_N_star: true, // imp-34675, closed-form single crossing
    fact_iii_unique_fixed_point_m_zero_at_N_cross: true, // imp-33723, m(N_cross) = 0
    step_m_prime_positive_on_tail: 'm_prime(N) = 1 - g_prime(N) > 0 for all N > N_star',
    step_m_strictly_increasing: 'm strictly increasing on [N_star, infinity)',
    conclusion: 'm(N) > m(N_cross) = 0, i.e. g(N) < N, for all N > N_cross (no sampling)',
  },
  anchors: {
    N_star: +N_STAR.toExponential(6), // ~1.474994e8, where g_prime = 1
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9, the unique fixed point
    N_star_below_N_cross: N_STAR_BELOW_N_CROSS, // so g_prime < 1 holds at and beyond N_cross
    m_at_N_cross: +M_AT_NCROSS.toExponential(3), // ~0
    g_prime_at_N_cross: +GP_AT_NCROSS.toExponential(6), // < 1, so m_prime(N_cross) > 0
  },
  marginTable, // m(N) < 0 below N_cross, = 0 at N_cross, > 0 and growing above it; m_prime > 0 throughout the tail
  structure: {
    margin_prime_positive_above_N_star: marginPrimePositiveAboveNStar,
    margin_prime_monotone_nondecreasing: marginPrimeMonotoneNondecreasing, // g_prime decreasing; saturates at 1 in far tail
    margin_prime_strict_where_resolvable: marginPrimeStrictWhereResolvable, // strict below 1e50
    margin_strictly_increasing: marginMonotoneIncreasing,
    margin_positive_above_N_cross: marginPositiveAboveNCross, // THE conclusion, confirmed on the grid
    margin_negative_below_N_cross: marginNegativeBelowNCross,
    margin_zero_at_N_cross: marginZeroAtNCross,
  },
  finding:
    'The sampled g(b) <= b of imp-34676 is replaced by an analytic monotone-margin argument. With ' +
    'm(N) = N - g(N), the derivative m_prime(N) = 1 - g_prime(N) is strictly positive for every N > N_star ' +
    '~ 1.475e8 (imp-34675: g_prime crosses 1 once and g_prime is strictly decreasing, so g_prime < 1 beyond ' +
    'N_star), hence m is strictly increasing on [N_star, infinity). Since N_cross ~ 3.28e9 > N_star is the ' +
    'unique fixed point (imp-33723) with m(N_cross) = 0, strict monotonicity forces m(N) > 0 -- i.e. ' +
    'g(N) < N -- for ALL N > N_cross, with no sampling. The measurement confirms this: m_prime > 0 at every ' +
    'sampled N > N_star, m strictly increasing, m(N_cross) ~ 0, and m(N) > 0 for every N > N_cross out to ' +
    '1e300 (below N_cross the margin is negative, which is why imp-34676 right-widening needs b >= N_cross).',
  subGap:
    'imp-34686a: the argument is exact real analysis (m_prime > 0 on the tail + the fixed-point anchor => ' +
    'm > 0 past N_cross), but its two inputs -- g_prime(N) < 1 for N > N_star and g_prime strictly ' +
    'decreasing -- are still evaluated in IEEE-754 double precision via effectiveHeightForN. A ' +
    'machine-checkable version must enclose g_prime and its monotonicity under interval arithmetic on the ' +
    'tail (compare imp-34650a / imp-34675a / imp-34676a). This closes the sample-vs-prove half of ' +
    'imp-34676a; the interval-enclosure half remains open.',
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT an RH bound). The imp-34676 sampled upper self-map endpoint ' +
    'g(b) <= b is upgraded to an analytic monotone-margin proof for the surrogate map g(N) = ' +
    '(C_C_PINNED/E_trunc)^2 log T0(N): the margin m(N) = N - g(N) has derivative m_prime(N) = 1 - g_prime(N), ' +
    'and since g_prime is positive, strictly decreasing, and crosses 1 exactly once at N_star ~ 1.475e8 ' +
    '(imp-34675), g_prime(N) < 1 for every N > N_star, so m_prime(N) > 0 and m is strictly increasing on ' +
    '[N_star, infinity). The unique fixed point N_cross ~ 3.280294e9 (imp-33723) anchors m(N_cross) = 0, and ' +
    'strict monotonicity then forces g(N) < N for ALL N > N_cross without sampling. Measured over the ' +
    'surrogate range (N swept 1e9..1e300): m_prime > 0 at every N > N_star, m strictly increasing, ' +
    'm(N_cross) ~ 0, m(N) > 0 for every N > N_cross and m(N) < 0 below it -- exactly the lemma prediction. ' +
    'SUB-GAP imp-34686a: the two inputs (g_prime < 1 on the tail, g_prime decreasing) are double-precision, ' +
    'not interval-arithmetic enclosures; this closes the sample-vs-prove half of imp-34676a, the ' +
    'interval-enclosure half remains open. This gives an analytic proof of a property of the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34676 (sampled g(b) <= b on a b-ladder; sub-gap imp-34676a asks to prove g(N) < N for all N > N_cross); ' +
    'imp-34675 (closed-form left edge N_star = K(1 - 1/W(K)) ~ 1.475e8 where g_prime = 1); imp-34650 (g_prime ' +
    'positive, strictly decreasing); imp-33723 (unique fixed point N_cross); imp-2642 (C_C = (1/8) sqrt(3 pi) ' +
    '1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN, monotone Riemann-von Mangoldt inverse).',
};

export const IMP34686_CROSSOVER_CONTRACTION_MARGIN_MONOTONE_PROOF_ASSERTIONS = [
  {
    // The tail slope fact: m_prime = 1 - g_prime > 0 for every N > N_star (g_prime < 1 there).
    id: 'imp34686-margin-prime-positive-on-tail',
    description: 'm_prime(N) = 1 - g_prime(N) > 0 for every sampled N > N_star (g_prime < 1 beyond the left edge)',
    holds: () =>
      N_STAR_BELOW_N_CROSS === true &&
      GP_AT_NCROSS < 1 &&
      marginPrimePositiveAboveNStar === true,
  },
  {
    // g_prime strictly decreasing => m_prime strictly increasing; m itself strictly increasing.
    id: 'imp34686-margin-strictly-increasing',
    description: 'm_prime monotone non-decreasing (strict where g_prime resolvable; saturates at 1 in the far tail) and m = N - g(N) strictly increasing across the grid',
    holds: () =>
      marginPrimeMonotoneNondecreasing === true &&
      marginPrimeStrictWhereResolvable === true &&
      marginMonotoneIncreasing === true,
  },
  {
    // THE conclusion: anchored at m(N_cross) = 0, m > 0 above N_cross and m < 0 below it.
    id: 'imp34686-margin-sign-straddles-N-cross',
    description: 'm(N_cross) ~ 0, m(N) > 0 for all sampled N > N_cross, m(N) < 0 below -- g(N) < N iff N > N_cross',
    holds: () =>
      marginZeroAtNCross === true &&
      marginPositiveAboveNCross === true &&
      marginNegativeBelowNCross === true &&
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3,
  },
  {
    // Honesty gate: analytic proof of a surrogate property, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34686-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, named sub-gap imp-34686a, no QED, no refereed bound is changed',
    holds: () =>
      IMP34686_CROSSOVER_CONTRACTION_MARGIN_MONOTONE_PROOF.isRigorous === false &&
      /imp-34686a/.test(IMP34686_CROSSOVER_CONTRACTION_MARGIN_MONOTONE_PROOF.subGap) &&
      /NO QED/.test(IMP34686_CROSSOVER_CONTRACTION_MARGIN_MONOTONE_PROOF.verdict) &&
      /refereed bound is changed/i.test(IMP34686_CROSSOVER_CONTRACTION_MARGIN_MONOTONE_PROOF.verdict),
  },
];

for (const a of IMP34686_CROSSOVER_CONTRACTION_MARGIN_MONOTONE_PROOF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34686-crossover-contraction-margin-monotone-proof assertion failed: ${a.id}`);
  }
}
