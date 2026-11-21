/**
 * @module imp-34798-iters-to-floor-log-law-higher-N
 *
 * imp-34798 (numerical, frontier-direction): imp-34775 DERIVED the closed-form iters-to-floor log law
 *   k(seed) = 1 + ceil( ln( delta_0(seed) / eps_fp ) / ln( 1 / r ) )
 * for the Banach map g(N) = K log T0(N) (K = (C_C/E_trunc)^2 ~ 1.5727e8, unique double-precision fixed
 * point N_cross ~ 3.280294e9, contraction rate r = |g_prime(N_cross)| ~ 0.04542), and showed it reproduces
 * the imp-34755 M2 two-route (closed-form-predicted vs directly-measured Picard) count to within +/-1 iterate
 * at every seed on the SPARSE imp-3220 decade grid {1e2..1e12} plus far seeds -- 12 of 13 exact, one off-by-one
 * at a ceil boundary. imp-34775 recorded the +/-1 agreement ONLY over that 13-point grid; it never measured
 * the log-law constant explicitly, nor tested whether the +/-1 ceil-boundary agreement WIDENS (to +/-2) or
 * STAYS BOUNDED once the higher-N decades are sampled densely enough to hit many more ceil boundaries.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * 1. THE LOG-LAW CONSTANT. The single characteristic constant of the log law is the geometric-contraction
 *    slope per iterate:
 *        c_law = 1 / ln( 1 / r )   ~ 0.32344   (iterates per e-fold of delta_0)
 *    equivalently ln(1/r) ~ 3.09173 nats/iterate, i.e. -log10(r) ~ 1.34272 decimal digits removed per step
 *    (identical to the ~1.343 of imp-34775 and the ~1.35 of imp-34755 M2). This module reports the constant
 *    to 6 figures directly from the fixed-point contraction rate.
 *
 * 2. THE HIGHER-N TWO-ROUTE AGREEMENT. Where imp-34775 sampled [1e9..1e12] with just 4 decade points, this
 *    module sweeps a DENSE multiplicative grid over the same higher band [1e9, 1e12]:
 *        - a 31-point grid at 10^0.1 spacing, and
 *        - a 61-point grid at 10^0.05 spacing (~15x denser than imp-34775's decade grid),
 *    plus an EXTENDED tail band [1e12, 1e15] at 10^0.1 spacing. For every seed it compares the closed-form
 *    predicted count against the directly-measured Picard count and records the absolute iterate error.
 *
 * THE RESULT: THE +/-1 AGREEMENT STAYS BOUNDED, DOES NOT WIDEN
 * -----------------------------------------------------------
 * Across the dense 31-point band the two-route agreement is EXACT at 21 of 31 seeds and off by exactly 1 at
 * the remaining 10 (all sitting on ceil boundaries of the log law); the maximum absolute error is 1 -- it
 * NEVER reaches 2. Refining to the 61-point grid (adding 30 more interior seeds) produces MORE individual
 * ceil-boundary off-by-ones (21 of 61) but the maximum absolute error is STILL 1 -- the extra sampling never
 * manufactures a +/-2 disagreement. In the extended tail band [1e12, 1e15] the agreement is EXACT at all 31
 * seeds (max error 0): the map is deeper into its double-log plateau there, so the ceil boundaries thin out.
 *
 * WHY IT STAYS BOUNDED. The off-by-one is a rounding artifact of the ceil: the predicted count uses the
 * ASYMPTOTIC rate r, while the true early transient contracts slightly off r for the first step or two, so
 * near an integer crossing of ln(delta_0/eps_fp)/ln(1/r) the ceil can land one iterate early or late. That
 * transient offset is a fixed O(1) fraction of a single iterate and does NOT accumulate with seed magnitude
 * (the seed enters the count only through the doubly-logarithmic delta_0 ~ (K/N_cross) ln seed of imp-34775),
 * so denser or higher-N sampling multiplies the NUMBER of boundary crossings but never the SIZE of the
 * disagreement. The +/-1 ceil-boundary agreement is a bounded rounding floor, not a widening error.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A denser higher-N re-measurement of an inherited empirical/derived count, reporting the log-law constant and
 * confirming the two-route disagreement is bounded at a single iterate. The rate r and the collapse distances
 * are IEEE-754 double-precision evaluations via effectiveHeightForN; the law is an asymptotic
 * geometric-contraction idealization, so +/-1 iterate near ceil boundaries is the expected (honest) outcome.
 *
 * MEASUREMENT ONLY. Higher-N measurement of a surrogate-landmark log law, NOT a rigorous asymptotic and NOT
 * an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation; the C_C = (1/8)
 * sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34775-iters-to-floor-log-law (parent: derives the closed-form log law over the sparse decade grid)
 * @see imp-34755-two-route-residual-across-N (grandparent: M2 reports the iters-to-floor ladder empirically)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (route A: closed-form fixed point N_cross)
 * @see imp-34693-crossover-contraction-seed-band (route B: Picard terminal value, iterate counts, seed band)
 * @see imp-3220-conditional-share-decade-ladder (the {1e2..1e12} decade grid imp-34775 sampled sparsely)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34693/imp-34775)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor named in imp-34755/imp-34775

// The shared imp-33723/imp-34693/imp-34755/imp-34775 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged) -- identical to imp-34775.
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669

// Log-law contraction rate r = |g_prime(N_cross)| via a central difference (matches imp-34775 exactly).
const G_PRIME = (g(N_CROSS_FP + 1) - g(N_CROSS_FP - 1)) / 2;
const R_CONTRACT = Math.abs(G_PRIME); // ~0.04542
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)
const C_LAW_SLOPE = 1 / LN_INV_R; // ~0.32344 iterates per e-fold of delta_0
const DIGITS_PER_STEP = -Math.log10(R_CONTRACT); // ~1.34272 (the ~1.343 of imp-34775, ~1.35 of M2)

// Post-collapse relative distance after the single log-collapse iterate g(seed).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;

// THE CLOSED-FORM LOG LAW (imp-34775): iterate count to reach the floor from a given seed.
function itersToFloorPredicted(seed) {
  const delta0 = collapseDist(seed);
  return 1 + Math.ceil(Math.log(delta0 / EPS_FP) / LN_INV_R);
}

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34755/imp-34775).
function itersToFloorMeasured(seed, cap = 500) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}

// Build a dense multiplicative seed grid over a log10 band [loExp, hiExp] with the given step, then
// tabulate the closed-form-vs-Picard two-route iterate error at every seed.
function scanBand(loExp, hiExp, step) {
  const seeds = [];
  for (let e = loExp; e <= hiExp + 1e-9; e += step) seeds.push(Math.pow(10, e));
  let maxAbsError = 0;
  let exact = 0;
  let offByOne = 0;
  let minK = Infinity;
  let maxK = -Infinity;
  for (const s of seeds) {
    const kp = itersToFloorPredicted(s);
    const km = itersToFloorMeasured(s);
    const err = Math.abs(kp - km);
    if (err > maxAbsError) maxAbsError = err;
    if (err === 0) exact++;
    if (err === 1) offByOne++;
    if (km < minK) minK = km;
    if (km > maxK) maxK = km;
  }
  return { points: seeds.length, maxAbsError, exact, offByOne, k_measured_range: [minK, maxK] };
}

// (1) The higher-N band imp-34775 sampled sparsely, now at 10^0.1 spacing (~8x denser than the decade grid).
const BAND_31 = scanBand(9, 12, 0.1);
// (2) The same band at 10^0.05 spacing (~15x denser) -- more ceil crossings, same bounded error.
const BAND_61 = scanBand(9, 12, 0.05);
// (3) The EXTENDED far-tail band, beyond imp-34775's ceiling, at 10^0.1 spacing.
const BAND_TAIL = scanBand(12, 15, 0.1);

// The overall two-route ceiling across every dense/higher-N sample probed here.
const MAX_ABS_ERROR_ALL = Math.max(BAND_31.maxAbsError, BAND_61.maxAbsError, BAND_TAIL.maxAbsError);

export const IMP34798_ITERS_TO_FLOOR_LOG_LAW_HIGHER_N = {
  id: 'imp-34798',
  proofSection: 'S-frontier',
  question:
    'imp-34775 derived the iters-to-floor log law k(seed) = 1 + ceil(ln(delta_0/eps_fp)/ln(1/r)) for the ' +
    'Banach map g(N) = K log T0(N) and recorded its +/-1 two-route agreement ONLY over the sparse imp-3220 ' +
    'decade grid {1e2..1e12}. Measure the log-law constant explicitly and sweep the higher-N band densely to ' +
    'test whether the +/-1 ceil-boundary agreement WIDENS (to +/-2) or STAYS BOUNDED. Measurement only; two ' +
    'inherited routes; NOT an RH bound; no QED.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6), // (C_C/E_trunc)^2 ~ 1.572709e8
    N_cross_fixed_point: +N_CROSS_FP.toPrecision(15), // 3.28029435165241e9
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (the ~0.045 of imp-34755 M2)
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173 nats/iterate (THE log-law constant)
    log_law_slope_iters_per_efold: +C_LAW_SLOPE.toPrecision(6), // ~0.323444 iterates per e-fold of delta_0
    digits_per_step: +DIGITS_PER_STEP.toPrecision(6), // ~1.34272 (the ~1.343 of imp-34775)
    eps_fp_floor: EPS_FP, // 2.3e-16 relative floor
  },
  log_law_constant:
    'c_law = 1/ln(1/r) ~ 0.323444 iterates per e-fold of delta_0, i.e. ln(1/r) ~ 3.09173 nats (~1.34272 ' +
    'decimal digits) removed per geometric-contraction step -- identical to the ~1.343 of imp-34775',
  higher_N_bands: {
    'band_31_step_0p1_1e9_to_1e12': BAND_31, // dense re-measure of the band imp-34775 sampled at 4 points
    'band_61_step_0p05_1e9_to_1e12': BAND_61, // ~15x denser than the decade grid -- still bounded at +/-1
    'band_tail_step_0p1_1e12_to_1e15': BAND_TAIL, // extended far tail -- agreement becomes EXACT (max err 0)
  },
  summary: {
    max_abs_error_across_all_dense_samples: MAX_ABS_ERROR_ALL, // 1 -- the two-route ceiling NEVER reaches 2
    band_31_off_by_one: BAND_31.offByOne, // 10 of 31 on ceil boundaries
    band_61_off_by_one: BAND_61.offByOne, // 21 of 61 -- more crossings, same bounded error
    tail_all_exact: BAND_TAIL.maxAbsError === 0, // true: [1e12,1e15] is fully exact
    agreement_stays_bounded:
      'across a 31-point (10^0.1) and a 61-point (10^0.05) dense sweep of [1e9,1e12] the closed-form vs Picard ' +
      'two-route error is EXACT at most seeds and off by exactly 1 at the rest, with maximum absolute error 1 ' +
      'at every sampling density -- the +/-1 ceil-boundary agreement STAYS BOUNDED and does NOT widen to ' +
      '+/-2; in the extended tail [1e12,1e15] it becomes exact (max error 0)',
  },
  finding:
    'The log-law constant is c_law = 1/ln(1/r) ~ 0.323444 iterates per e-fold of delta_0 (ln(1/r) ~ 3.09173 ' +
    'nats, ~1.34272 digits/step -- identical to imp-34775). Densifying the higher-N band [1e9,1e12] that ' +
    'imp-34775 sampled at only 4 decade points, the closed-form-predicted vs directly-measured Picard count ' +
    'agrees EXACTLY at 21 of 31 seeds (10^0.1 spacing) and is off by exactly 1 at the other 10, all on ceil ' +
    'boundaries; the maximum absolute error is 1. Refining to 61 seeds (10^0.05 spacing, ~15x denser than the ' +
    'decade grid) yields more individual off-by-ones (21 of 61) but the maximum absolute error is STILL 1 -- ' +
    'the extra sampling multiplies the number of ceil-boundary crossings but never manufactures a +/-2 ' +
    'disagreement. In the extended tail band [1e12,1e15] the agreement is EXACT at all 31 seeds. The +/-1 ' +
    'agreement is a bounded rounding floor from the ceil (the predicted count uses the asymptotic rate r ' +
    'while the true early transient contracts slightly off r), and because the seed enters the count only ' +
    'through the doubly-logarithmic delta_0 the offset never accumulates with magnitude: denser or higher-N ' +
    'sampling changes the COUNT of boundary crossings, never the SIZE of the disagreement.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT an RH bound). The imp-34775 iters-to-floor log law for the Banach ' +
    'map g(N) = K log T0(N) has constant c_law = 1/ln(1/r) ~ 0.323444 iterates per e-fold of delta_0 ' +
    '(ln(1/r) ~ 3.09173 nats, ~1.34272 digits/step, identical to imp-34775). Where imp-34775 recorded the ' +
    '+/-1 two-route agreement over only the 4 higher-decade points of the imp-3220 grid, a dense 31-point ' +
    '(10^0.1) and 61-point (10^0.05) sweep of [1e9,1e12] shows the closed-form vs Picard error is exact at ' +
    'most seeds and off by exactly 1 at the rest, with maximum absolute error 1 at EVERY sampling density -- ' +
    'the +/-1 ceil-boundary agreement STAYS BOUNDED and does not widen to +/-2; in the extended tail ' +
    '[1e12,1e15] it is exact (max error 0). The off-by-one is a bounded rounding floor of the ceil (predicted ' +
    'count uses the asymptotic rate r vs the slightly-off early transient), and since the seed enters only ' +
    'through the doubly-logarithmic delta_0 the offset cannot accumulate with magnitude. IEEE-754 double ' +
    'precision, no interval enclosure (compare the imp-34693a sub-gap); the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and ' +
    'the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34775 (parent: derives the closed-form iters-to-floor log law over the sparse decade grid); ' +
    'imp-34755 (grandparent: M2 reports the iters-to-floor ladder empirically); imp-33723 (closed-form ' +
    'crossover fixed point N_cross); imp-34693/imp-34676 (Picard terminal value, iterate counts, seed band); ' +
    'imp-3220 (conditional-share decade grid {1e2..1e12}); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP34798_ITERS_TO_FLOOR_LOG_LAW_HIGHER_N_ASSERTIONS = [
  {
    // The log-law constant matches the inherited imp-34775 rate: ln(1/r) ~ 3.0917, ~1.343 digits/step.
    id: 'imp34798-log-law-constant-matches-parent',
    description: 'ln(1/r) ~ 3.0917 nats/iterate and -log10(r) ~ 1.343 digits/step (identical to imp-34775)',
    holds: () =>
      Math.abs(LN_INV_R - 3.09173) < 1e-3 &&
      Math.abs(C_LAW_SLOPE - 0.323444) < 1e-4 &&
      Math.abs(DIGITS_PER_STEP - 1.34272) < 1e-3,
  },
  {
    // The dense higher-N sweep keeps the two-route error bounded at exactly 1 -- it never reaches 2.
    id: 'imp34798-higher-N-agreement-stays-bounded',
    description: 'dense 31- and 61-point sweeps of [1e9,1e12] both cap the two-route error at 1, never 2',
    holds: () =>
      BAND_31.maxAbsError === 1 &&
      BAND_61.maxAbsError === 1 &&
      MAX_ABS_ERROR_ALL === 1,
  },
  {
    // Refining the grid multiplies off-by-ones but not the error size -- the disagreement does not widen.
    id: 'imp34798-refinement-adds-crossings-not-magnitude',
    description: 'the 61-point grid has more off-by-ones than the 31-point grid, yet both cap the error at 1',
    holds: () =>
      BAND_61.points > BAND_31.points &&
      BAND_61.offByOne > BAND_31.offByOne &&
      BAND_61.maxAbsError === BAND_31.maxAbsError,
  },
  {
    // The extended far-tail band [1e12,1e15] is fully exact -- the ceil boundaries thin out at high N.
    id: 'imp34798-extended-tail-exact',
    description: 'the [1e12,1e15] tail band agrees exactly at every seed (max abs error 0)',
    holds: () =>
      BAND_TAIL.maxAbsError === 0 &&
      BAND_TAIL.exact === BAND_TAIL.points &&
      BAND_TAIL.points >= 31,
  },
  {
    // Honesty gate: higher-N measurement of a surrogate count, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34798-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34798_ITERS_TO_FLOOR_LOG_LAW_HIGHER_N.isRigorous === false &&
      /NO QED/.test(IMP34798_ITERS_TO_FLOOR_LOG_LAW_HIGHER_N.verdict) &&
      /refereed bound is changed/i.test(IMP34798_ITERS_TO_FLOOR_LOG_LAW_HIGHER_N.verdict),
  },
];

for (const a of IMP34798_ITERS_TO_FLOOR_LOG_LAW_HIGHER_N_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34798-iters-to-floor-log-law-higher-N assertion failed: ${a.id}`);
  }
}
