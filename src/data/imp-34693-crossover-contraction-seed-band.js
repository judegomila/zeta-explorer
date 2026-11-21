/**
 * @module imp-34693-crossover-contraction-seed-band
 *
 * imp-34693 (numerical, frontier-direction): imp-34676 showed the imp-34650 Banach L-contraction
 * certificate for the imp-33723 crossover map g(N) = K log T0(N) widens to the RIGHT for free --
 * L = g_prime(1e9) ~ 0.1485 and the self-map g([1e9,b]) subset [1e9,b] hold for arbitrarily large b --
 * with the ONE honest cost that the a-priori Picard bound from the FAR seed N_0 = b degrades linearly
 * (its k=5 relative value climbs from ~1.7e-4 at b=1e10 to O(1e286) at b=1e300, because
 * |N_1 - N_0| = |g(b) - b| = m(b) ~ b grows linearly). imp-34676 recommended "seed near N_cross" but
 * only QUALITATIVELY. This module makes that recommendation QUANTITATIVE: it derives the seed placement
 * N_0(tol, k) for which the a-priori bound stays below a target tolerance, and MEASURES the admissible
 * seed band around N_cross ~ 3.280294e9.
 *
 * THE CLOSED-FORM ADMISSIBLE SEED BAND
 * ------------------------------------
 * The Banach a-priori bound from seed N_0 after k iterates is
 *   B(N_0, k) = L^k/(1-L) * |g(N_0) - N_0|,   L = g_prime(1e9) ~ 0.148483.
 * Because g has a fixed point at N_cross (g(N_cross) = N_cross) and g is smooth, a first-order expansion
 * about N_cross gives the seed defect in closed form:
 *   g(N_0) - N_0 = [g(N_0) - g(N_cross)] - [N_0 - N_cross]
 *               ~ (L_c - 1)(N_0 - N_cross),   L_c := g_prime(N_cross) ~ 0.045423,
 * so |g(N_0) - N_0| ~ (1 - L_c) |N_0 - N_cross|. Substituting, the a-priori bound is USEFUL
 * (B(N_0, k) < tol) exactly on the seed band centered on N_cross
 *   |N_0 - N_cross| < rho(tol, k) := tol * (1 - L) / [ (1 - L_c) * L^k ].
 * This is the quantitative form of imp-34676s "seed near N_cross": rho is the half-width of the
 * admissible seed band, and it GROWS GEOMETRICALLY by the factor 1/L ~ 6.7348 per Picard iterate.
 *
 * MEASUREMENT (tol = 1, i.e. sub-unit absolute a-priori error on N ~ 3.28e9)
 * -------------------------------------------------------------------------
 * The linearized half-width rho(1, k) matches the directly root-bracketed band |N_0 - N_cross| where
 * B(N_0, k) < 1 to ~4 significant figures across k (the two columns below are the linearized closed form
 * and the measured band; they agree, confirming no reciprocal/sign slip):
 *   k    rho(1,k) closed form   measured band half-width   band grows x1/L=6.7348
 *   0    8.9204e-1              8.9204e-1                  (base)
 *   1    6.0077e+0              6.0077e+0                  x6.7348
 *   2    4.0460e+1              4.0460e+1                  x6.7348
 *   3    2.7249e+2              2.7249e+2                  x6.7348
 *   5    1.2359e+4              1.2359e+4                  x6.7348
 *   10   1.7124e+8              1.7124e+8                  x6.7348
 * READING: with ZERO iterates (k=0) the useful seed band is only +-0.89 around N_cross -- one must land
 * essentially ON the fixed point for a bare a-priori bound < 1. Each Picard iterate WIDENS the admissible
 * seed band by 6.7348x, so by k=5 any seed within +-1.24e4 of N_cross already certifies a sub-unit
 * a-priori error, and by k=10 within +-1.7e8 (a band ~5% of N_cross itself).
 *
 * OPTIMAL SEED vs FAR SEED: MINIMAL k TO FLOATING-POINT AGREEMENT
 * --------------------------------------------------------------
 * Iterates until |N_k - N_cross| <= N_cross * 2.3e-16 (double-precision agreement):
 *   far seed N_0 = 1e10  : 12 iterates   (matches imp-34676s "~12")
 *   far seed N_0 = 1e300 : 14 iterates   (matches imp-34676s "~13")
 *   optimal seed within the k=5 band (N_cross + 1e6) : 10 iterates
 *   seed EXACTLY at N_cross : 1 iterate  (already the fixed point)
 * So seeding near N_cross buys only ~2-4 fewer Picard iterates to full floating-point agreement (the
 * per-iterate rate L is seed-independent, confirming imp-34676) -- the real payoff of the optimal seed is
 * the a-priori CERTIFICATE: the bound is < 1 immediately (small k) rather than needing k >= 12 to first
 * dip below 1 from the far endpoint.
 *
 * WHAT THIS IS AND IS NOT (sub-gap)
 * ---------------------------------
 * This derives and measures the admissible-seed band of the imp-34650/imp-34676 a-priori bound for the
 * INHERITED imp-3220/imp-3406 surrogate crossover map, in IEEE-754 double precision via
 * effectiveHeightForN. The band closed form uses the first-order (linearized) seed defect; the k=0
 * half-width is O(1) so higher-order terms are negligible over the band, and the measured column
 * confirms it. NAMED SUB-GAP imp-34693a: L, L_c and g are double-precision evaluations, and the
 * defect linearization is not interval-enclosed; a formal statement would bound the second derivative
 * of g on the band and enclose L, L_c under interval arithmetic (compare imp-34676a / imp-34687).
 *
 * DERIVATION / MEASUREMENT ONLY. This quantifies the seed placement for a property of the inherited
 * surrogate crossover, NOT a rigorous asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz
 * (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34676-crossover-contraction-right-widening (the far-seed a-priori degradation this module fixes by seeding near N_cross)
 * @see imp-34650-crossover-banach-contraction-certificate (the L-contraction certificate on I = [1e9, 1e10])
 * @see imp-34675-crossover-contraction-left-edge (closed-form LEFT edge N_star; the sole binding constraint)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (states N_cross as the fixed point of g)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, monotone increasing)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (same K as imp-34650/imp-34675/imp-34676)

// The imp-33723 fixed-point map and its imp-34650 analytic derivative (same as imp-34676).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T0 = effectiveHeightForN(N);
  return (K_AMPL * TWO_PI) / (T0 * Math.log(T0 / TWO_PI)); // K*(dT0/dN)/T0
};

const A = 1e9;
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 80); // ~3.280294e9
const L_CONTRACTION = gPrime(A); // ~1.484829e-1 (invariant under right-widening, imp-34676)
const L_AT_CROSS = gPrime(N_CROSS); // ~4.542338e-2 (local rate at the fixed point)

// The a-priori Banach bound from seed N_0 after k iterates, and its linearized admissible half-width.
const aPrioriBound = (N0, k) =>
  (Math.pow(L_CONTRACTION, k) / (1 - L_CONTRACTION)) * Math.abs(g(N0) - N0);
// rho(tol, k) = tol (1 - L) / [ (1 - L_c) L^k ] : the closed-form seed-band half-width around N_cross.
const rho = (tol, k) =>
  (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

// Directly root-bracket the measured band { N0 : aPrioriBound(N0, k) < 1 } (symmetric about N_cross).
function measuredHalfWidth(k) {
  let hi = N_CROSS;
  let step = 1e3;
  while (aPrioriBound(hi + step, k) < 1 && hi < 1e300) {
    hi += step;
    step *= 1.5;
  }
  let a2 = hi;
  let b2 = hi + step;
  for (let i = 0; i < 60; i++) {
    const m = (a2 + b2) / 2;
    if (aPrioriBound(m, k) < 1) a2 = m;
    else b2 = m;
  }
  return a2 - N_CROSS;
}

// The K-ladder and the seed-band table (tol = 1: sub-unit absolute a-priori error on N ~ 3.28e9).
const K_GRID = [0, 1, 2, 3, 5, 10];
const seedBandTable = K_GRID.map((k) => {
  const closed = rho(1, k);
  const measured = measuredHalfWidth(k);
  return {
    k,
    rho_closed_form: +closed.toExponential(4), // tol=1 half-width from the linearized defect
    measured_half_width: +measured.toExponential(4), // directly root-bracketed band |N0 - N_cross|
    closed_vs_measured_rel: +(Math.abs(closed - measured) / measured).toExponential(3),
  };
});

// Minimal Picard iterates to double-precision agreement |N_k - N_cross| <= N_cross * 2.3e-16.
function iteratesToFloatingPoint(seed) {
  let x = seed;
  for (let k = 1; k <= 200; k++) {
    x = g(x);
    if (Math.abs(x - N_CROSS) <= Math.abs(N_CROSS) * 2.3e-16) return k;
  }
  return -1;
}
const K_FAR_SEED_1E10 = iteratesToFloatingPoint(1e10);
const K_FAR_SEED_1E300 = iteratesToFloatingPoint(1e300);
const K_OPTIMAL_SEED = iteratesToFloatingPoint(N_CROSS + 1e6); // seed inside the k=5 band
const K_EXACT_FIXED_POINT = iteratesToFloatingPoint(N_CROSS); // already the fixed point

// The geometric growth factor of the admissible band per iterate is exactly 1/L.
const BAND_GROWTH_PER_ITERATE = 1 / L_CONTRACTION; // ~6.7348

// Structural checks.
const closed_matches_measured = seedBandTable.every((r) => r.closed_vs_measured_rel < 1e-2);
// Growth is checked on the UNROUNDED closed form rho(1,k); the stored table is toExponential(4).
const band_grows_geometrically = K_GRID.every((k, i) => {
  if (i === 0) return true;
  const prevK = K_GRID[i - 1];
  const expected = Math.pow(BAND_GROWTH_PER_ITERATE, k - prevK);
  const actual = rho(1, k) / rho(1, prevK);
  return Math.abs(actual - expected) / expected < 1e-9;
});
const k0_band_is_sub_unit = seedBandTable[0].rho_closed_form < 1; // must land ~ON N_cross with zero iterates

export const IMP34693_CROSSOVER_CONTRACTION_SEED_BAND = {
  id: 'imp-34693',
  proofSection: 'S-frontier',
  question:
    'imp-34676 recommended seeding the imp-34650 Picard iteration near N_cross to keep the Banach ' +
    'a-priori bound L^k/(1-L)*|g(N_0)-N_0| useful (< 1), but only qualitatively. Derive the seed ' +
    'placement N_0(tol, k) that keeps the bound below a target tolerance, and measure the admissible ' +
    'seed band around N_cross ~ 3.28e9, plus the minimal k to floating-point agreement from the optimal ' +
    'vs the far seed. Measurement/derivation only; certifies a property of the inherited surrogate ' +
    'crossover, NOT an RH bound; no QED.',
  constants: {
    L_contraction: +L_CONTRACTION.toExponential(6), // ~1.484829e-1
    L_at_cross: +L_AT_CROSS.toExponential(6), // ~4.542338e-2
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    band_growth_per_iterate_inv_L: +BAND_GROWTH_PER_ITERATE.toExponential(6), // ~6.7348
  },
  // Closed form: |N_0 - N_cross| < rho(tol, k) = tol (1 - L) / [ (1 - L_c) L^k ].
  seedBandClosedForm: 'rho(tol,k) = tol*(1 - L)/[(1 - L_c)*L^k], L=g_prime(1e9), L_c=g_prime(N_cross)',
  seedBandTable, // closed-form vs measured half-width, growing by 1/L ~ 6.7348 per iterate
  iteratesToFloatingPoint: {
    far_seed_1e10: K_FAR_SEED_1E10, // 12
    far_seed_1e300: K_FAR_SEED_1E300, // 14
    optimal_seed_near_N_cross: K_OPTIMAL_SEED, // 10
    exact_fixed_point: K_EXACT_FIXED_POINT, // 1
  },
  structure: {
    closed_form_matches_measured_band: closed_matches_measured,
    admissible_band_grows_geometrically_by_inv_L: band_grows_geometrically,
    k0_band_is_sub_unit_must_seed_on_N_cross: k0_band_is_sub_unit,
  },
  finding:
    'The imp-34676 "seed near N_cross" recommendation is now QUANTITATIVE. First-order expansion of the ' +
    'seed defect about the fixed point, g(N_0) - N_0 ~ (L_c - 1)(N_0 - N_cross) with L_c = g_prime(N_cross) ' +
    '~ 0.04542, turns the Banach a-priori bound B(N_0,k) = L^k/(1-L)*|g(N_0)-N_0| < tol into an explicit ' +
    'admissible seed band centered on N_cross: |N_0 - N_cross| < rho(tol,k) = tol*(1-L)/[(1-L_c)*L^k]. This ' +
    'half-width GROWS by exactly 1/L ~ 6.7348 per Picard iterate; the closed form matches the directly ' +
    'root-bracketed band to ~4 sig figs across k. At tol=1 the k=0 band is only +-0.89 (one must land ON ' +
    'N_cross for a bare a-priori bound < 1), widening to +-1.24e4 by k=5 and +-1.7e8 by k=10. Iterates to ' +
    'full floating-point agreement fall only from 12 (far seed 1e10) / 14 (1e300) to 10 near N_cross (1 if ' +
    'seeded exactly at the fixed point): the per-iterate rate is seed-independent (confirming imp-34676), ' +
    'so the payoff of the optimal seed is the immediately-useful a-priori CERTIFICATE, not fewer iterates.',
  subGap:
    'imp-34693a: L, L_c and g are IEEE-754 double-precision evaluations via effectiveHeightForN, and the ' +
    'seed-defect linearization g(N_0)-N_0 ~ (L_c-1)(N_0-N_cross) is not interval-enclosed. Formalize by ' +
    'bounding g_double_prime on the band and enclosing L, L_c under interval arithmetic (compare ' +
    'imp-34676a / imp-34687). This quantifies the seed placement; it adds no RH bound.',
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT an RH bound). imp-34676 left "seed the imp-34650 ' +
    'Picard iteration near N_cross" qualitative; this module makes it quantitative. A first-order expansion ' +
    'of the seed defect about the fixed point (g(N_cross) = N_cross), g(N_0) - N_0 ~ (L_c - 1)(N_0 - N_cross) ' +
    'with L_c = g_prime(N_cross) ~ 0.04542, converts the Banach a-priori bound B(N_0,k) = L^k/(1-L)*|g(N_0)-N_0| ' +
    '< tol into the explicit admissible seed band |N_0 - N_cross| < rho(tol,k) = tol*(1-L)/[(1-L_c)*L^k] ' +
    'centered on N_cross ~ 3.280294e9, whose half-width grows by exactly 1/L ~ 6.7348 per Picard iterate. ' +
    'The closed form matches the directly root-bracketed band to ~4 significant figures across k = 0..10 ' +
    '(confirming no sign/reciprocal slip): at tol=1 the band is +-0.89 (k=0), +-1.24e4 (k=5), +-1.7e8 (k=10). ' +
    'Minimal iterates to double-precision agreement fall only from 12 (far seed 1e10) and 14 (1e300) to 10 ' +
    'seeded near N_cross (and 1 exactly at the fixed point) -- the per-iterate rate L is seed-independent, so ' +
    'the payoff of seeding near N_cross is the immediately-useful a-priori certificate (bound < 1 at small k) ' +
    'rather than the far-seed k >= 12 needed to first dip below 1, NOT fewer iterates to convergence. SUB-GAP ' +
    'imp-34693a: L, L_c, g are double-precision and the defect linearization is not interval-enclosed. This ' +
    'quantifies the seed placement for a property of the inherited imp-3220/imp-3406 surrogate crossover map, ' +
    'NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per ' +
    'imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34676 (right-widening; far-seed a-priori degradation; "seed near N_cross" qualitative); imp-34650 ' +
    '(Banach contraction certificate on I = [1e9, 1e10]); imp-34675 (closed-form left edge N_star); imp-33723 ' +
    '(closed-form crossover fixed point N_cross); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, monotone Riemann-von Mangoldt inverse).',
};

export const IMP34693_CROSSOVER_CONTRACTION_SEED_BAND_ASSERTIONS = [
  {
    // The linearized closed-form band matches the directly root-bracketed band across all k.
    id: 'imp34693-closed-form-matches-measured-band',
    description: 'rho(1,k) = (1-L)/[(1-L_c)L^k] matches the measured { N0 : B(N0,k) < 1 } band to ~4 sig figs',
    holds: () => closed_matches_measured === true,
  },
  {
    // The admissible seed band widens by exactly 1/L per Picard iterate.
    id: 'imp34693-band-grows-by-inv-L-per-iterate',
    description: 'admissible seed half-width grows geometrically by 1/L ~ 6.7348 per iterate; k=0 band is sub-unit',
    holds: () =>
      band_grows_geometrically === true &&
      k0_band_is_sub_unit === true &&
      Math.abs(BAND_GROWTH_PER_ITERATE - 6.7348) < 1e-2,
  },
  {
    // Optimal-vs-far seed: iterates to floating point drop only ~2-4; the per-iterate rate is seed-independent.
    id: 'imp34693-iterates-to-fp-optimal-vs-far',
    description: 'far seed 1e10 -> 12 iterates, 1e300 -> 14, optimal near N_cross -> 10, exact fixed point -> 1',
    holds: () =>
      K_FAR_SEED_1E10 === 12 &&
      K_FAR_SEED_1E300 === 14 &&
      K_OPTIMAL_SEED === 10 &&
      K_EXACT_FIXED_POINT === 1,
  },
  {
    // The band is centered on N_cross and the local rate L_c < L (fixed point is the slowest-defect seed).
    id: 'imp34693-constants-N-cross-and-rates',
    description: 'N_cross ~ 3.28e9, L ~ 0.1485, L_c ~ 0.04542 with L_c < L < 1',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(L_CONTRACTION - 1.484829e-1) < 1e-4 &&
      Math.abs(L_AT_CROSS - 4.542338e-2) < 1e-4 &&
      L_AT_CROSS < L_CONTRACTION &&
      L_CONTRACTION < 1,
  },
  {
    // Honesty gate: measurement of a surrogate property, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34693-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, named sub-gap, no QED, no refereed bound is changed',
    holds: () =>
      IMP34693_CROSSOVER_CONTRACTION_SEED_BAND.isRigorous === false &&
      /imp-34693a/.test(IMP34693_CROSSOVER_CONTRACTION_SEED_BAND.subGap) &&
      /NO QED/.test(IMP34693_CROSSOVER_CONTRACTION_SEED_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP34693_CROSSOVER_CONTRACTION_SEED_BAND.verdict),
  },
];

for (const a of IMP34693_CROSSOVER_CONTRACTION_SEED_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34693-crossover-contraction-seed-band assertion failed: ${a.id}`);
  }
}
