/**
 * @module imp-34755-two-route-residual-across-N
 *
 * imp-34755 (numerical, frontier-direction): imp-34733 cross-tabulated the TWO inherited routes to the
 * N_cross ~ 3.280294e9 crossover landmark -- (A) the imp-33723 CLOSED FORM (40 iterates of the Banach map
 * g(N) = K log T0(N) from seed 1e9) and (B) the imp-34693/imp-34676 PICARD terminal value (iterate the
 * SAME g to double-precision agreement) -- and found their bit-agreement residual is exactly 0 (below the
 * ~2.3e-16 floating-point floor), >12 orders of magnitude under the ~3.98e-3 sigma = 1/2 halving gap. But
 * imp-34733 measured that residual at ONE seed only (1e9). This module TABULATES the two-route residual
 * across a RANGE of seeds -- the imp-3220 decade grid {1e2, 1e3, ..., 1e12} plus far seeds 1e50 and 1e300 --
 * to confirm the routes stay bit-identical below the floor everywhere, and to LOCATE whether the Picard
 * iteration count needed to reach the floor grows with the seed distance from the fixed point.
 *
 * THE MEASUREMENT
 * ---------------
 * The map g(N) = K log T0(N) (K = (C_C/E_trunc)^2 ~ 1.5727e8) has a UNIQUE double-precision fixed point
 * N_cross; every seed flows there. For each seed on the grid we record:
 *   - iters_to_floor: how many Picard iterates from that seed until the value becomes bit-identical to the
 *     fixed point (the count needed to reach the floor);
 *   - N_final: the 200-iterate Picard terminal value from that seed;
 *   - residual_vs_closed_form: |N_closed_form(40) - N_final(seed)| / N_final(seed), the two-route residual.
 *
 *   (M1) BIT-IDENTICAL EVERYWHERE. For EVERY seed on the imp-3220 decade grid (1e2..1e12) and both far
 *        seeds (1e50, 1e300), N_final lands on the EXACT SAME double as the imp-33723 closed-form value,
 *        3280294351.65240669. The two-route residual is exactly 0 at every seed -- at (below) the
 *        ~2.3e-16 floor, with NO systematic seed-dependent offset. So the imp-34733 bit-agreement is not a
 *        crossover-point coincidence: it holds N-uniformly.
 *   (M2) ITERATION COUNT IS ESSENTIALLY N-INDEPENDENT. The Picard iteration count needed to reach the floor
 *        does NOT grow with seed distance across the practical grid: it is a flat 12-13 iterates for every
 *        seed in 1e2..1e12, rising only to 14 for the extreme far seeds 1e50 and 1e300. The reason is
 *        structural: g(N) = K log T0(N) collapses ANY seed (however large) into the same bounded
 *        log-region in a single iterate, after which the strong contraction |g_prime(N_cross)| ~ 0.045 << 1
 *        removes ~1.35 decimal digits per step, so ~12-14 iterates always suffice. The count grows only
 *        logarithmically-slowly (a single extra iterate over ~290 decades of seed offset), never diverging.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A floating-point consistency check extending the imp-34733 single-seed cross-tabulation to a seed range.
 * Both routes share the map g and the pinned amplitude K, so bit-agreement is the expected outcome; the
 * deliverable is confirming it is seed-uniform (not a crossover-point artifact) and that the iterate count
 * to reach the floor stays bounded. Values are IEEE-754 double-precision evaluations via effectiveHeightForN;
 * this adds no interval enclosure (compare the imp-34693a sub-gap) and no new derivation.
 *
 * MEASUREMENT ONLY. Seed-range consistency check of two inherited routes, NOT a rigorous asymptotic and NOT
 * an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation; the C_C = (1/8)
 * sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34733-crossover-closedform-vs-picard-crosstab (parent: single-seed two-route cross-tabulation)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (route A: closed-form fixed point N_cross)
 * @see imp-34693-crossover-contraction-seed-band (route B: Picard terminal value, iterate counts, seed band)
 * @see imp-3220-conditional-share-decade-ladder (the {1e2..1e12} decade grid used here as the seed range)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34693/imp-34733)
const FP_FLOOR = 2.3e-16; // the ~machine-epsilon relative agreement floor named in the ticket

// The shared imp-33723/imp-34693 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged) and the route-A closed-form value.
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669
const N_CROSS_CLOSED_FORM = iterate(1e9, 40); // route A: 40 iterates from 1e9 (imp-33723)

// Picard iterates from a seed until the value is bit-identical to the fixed point (count to reach the floor).
function itersToFloor(seed, cap = 500) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}

// The imp-3220 decade grid of seeds, plus two far seeds to probe iteration-count growth.
const SEED_GRID = [1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e50, 1e300];

const TABLE = SEED_GRID.map((seed) => {
  const N_final = iterate(seed, 200); // route B terminal value from this seed
  const residual = Math.abs(N_CROSS_CLOSED_FORM - N_final) / N_final; // two-route residual at this seed
  return {
    seed_exponent: Math.round(Math.log10(seed)), // 2..12, then 50, 300
    iters_to_floor: itersToFloor(seed), // Picard iterates until bit-identical to the fixed point
    N_final: +N_final.toPrecision(15), // all land on 3.28029435165241e9
    residual_vs_closed_form: residual, // exactly 0 everywhere (< 2.3e-16 floor)
    bit_identical: N_final === N_CROSS_FP, // strict === to the fixed point
  };
});

const ALL_BIT_IDENTICAL = TABLE.every((r) => r.bit_identical === true);
const ALL_BELOW_FLOOR = TABLE.every((r) => r.residual_vs_closed_form <= FP_FLOOR);
const MAX_RESIDUAL = Math.max(...TABLE.map((r) => r.residual_vs_closed_form));
const MAX_ITERS_TO_FLOOR = Math.max(...TABLE.map((r) => r.iters_to_floor));
// Iteration count over the imp-3220 decade grid only (exclude the two far seeds) to show N-independence.
const DECADE_ROWS = TABLE.filter((r) => r.seed_exponent <= 12);
const MIN_ITERS_DECADE = Math.min(...DECADE_ROWS.map((r) => r.iters_to_floor));
const MAX_ITERS_DECADE = Math.max(...DECADE_ROWS.map((r) => r.iters_to_floor));

export const IMP34755_TWO_ROUTE_RESIDUAL_ACROSS_N = {
  id: 'imp-34755',
  proofSection: 'S-frontier',
  question:
    'imp-34733 measured the two-route (closed-form vs Picard) bit-agreement residual for the N_cross ~ ' +
    '3.280294e9 crossover at ONE seed (1e9) only. Tabulate that residual across a RANGE of seeds -- the ' +
    'imp-3220 decade grid {1e2..1e12} plus far seeds 1e50 and 1e300 -- to confirm the routes stay ' +
    'bit-identical below the ~2.3e-16 floor everywhere, and locate whether the Picard iteration count ' +
    'needed to reach the floor grows with seed distance. Measurement only; two inherited routes; NOT an ' +
    'RH bound; no QED.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6), // (C_C/E_trunc)^2 ~ 1.572709e8
    fp_floor_reference: FP_FLOOR, // 2.3e-16 (the ticket floor)
    N_cross_fixed_point: +N_CROSS_FP.toPrecision(15), // 3.28029435165241e9 (route B converged)
    N_cross_closed_form_40_iters: +N_CROSS_CLOSED_FORM.toPrecision(15), // 3.28029435165241e9 (route A)
  },
  table: TABLE, // one row per seed: iters_to_floor, N_final, residual, bit_identical
  summary: {
    all_seeds_bit_identical: ALL_BIT_IDENTICAL, // true for every seed on the grid
    all_residuals_at_or_below_floor: ALL_BELOW_FLOOR, // true (all exactly 0)
    max_residual_across_grid: MAX_RESIDUAL, // 0
    max_iters_to_floor_across_grid: MAX_ITERS_TO_FLOOR, // 14 (at the far seeds)
    iters_to_floor_decade_grid_range: [MIN_ITERS_DECADE, MAX_ITERS_DECADE], // [12, 13] across 1e2..1e12
    iters_to_floor_N_independent:
      'the Picard iterate count to reach the floor is a flat 12-13 across the entire imp-3220 decade grid ' +
      '(1e2..1e12), rising only to 14 at the extreme far seeds 1e50/1e300 -- it does NOT grow with N',
  },
  finding:
    'Extending the imp-34733 single-seed cross-tabulation to a seed range confirms the two-route ' +
    'bit-agreement is N-UNIFORM, not a crossover-point coincidence. Across the imp-3220 decade grid of ' +
    'seeds {1e2, 1e3, ..., 1e12} and both far seeds (1e50, 1e300), the 200-iterate Picard terminal value ' +
    'lands on the EXACT SAME double as the imp-33723 40-iterate closed-form value, 3280294351.65240669 -- ' +
    'the two-route residual is exactly 0 at EVERY seed (at, below the ~2.3e-16 floor), with no ' +
    'systematic seed-dependent offset. The Picard iteration count needed to reach the floor is ' +
    'essentially N-independent: a flat 12-13 iterates for every seed in 1e2..1e12, rising only to 14 for ' +
    'the extreme far seeds. This is structural: g(N) = K log T0(N) collapses any seed (however large) into ' +
    'the same bounded log-region in a single iterate, after which the strong contraction ' +
    '|g_prime(N_cross)| ~ 0.045 << 1 removes ~1.35 decimal digits per step, so ~12-14 iterates always ' +
    'suffice -- the count grows only logarithmically-slowly (one extra iterate over ~290 decades of seed ' +
    'offset), never diverging.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT an RH bound). The imp-34733 two-route bit-agreement residual for ' +
    'the N_cross ~ 3.280294e9 crossover, measured there at the single seed 1e9, is here tabulated across a ' +
    'seed RANGE -- the imp-3220 decade grid {1e2..1e12} plus far seeds 1e50 and 1e300. At every seed the ' +
    '200-iterate Picard terminal value lands on the EXACT SAME double as the imp-33723 closed-form value, ' +
    '3280294351.65240669; the two-route residual is exactly 0 (at, below the ~2.3e-16 floor) with no ' +
    'systematic seed-dependent offset, so the bit-agreement is N-uniform rather than a crossover-point ' +
    'coincidence. The Picard iteration count to reach the floor is essentially N-independent (a flat 12-13 ' +
    'iterates across 1e2..1e12, rising only to 14 at the extreme far seeds), because the map collapses any ' +
    'seed into the same bounded log-region in one iterate and then contracts at |g_prime| ~ 0.045 << 1. ' +
    'Seed-range consistency check of two inherited routes for a surrogate landmark, IEEE-754 double ' +
    'precision, no interval enclosure (compare the imp-34693a sub-gap); the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34733 (parent: single-seed closed-form vs Picard cross-tabulation); imp-33723 (closed-form ' +
    'crossover fixed point N_cross); imp-34693/imp-34676 (Picard terminal value, iterate counts, seed ' +
    'band); imp-3220 (conditional-share decade grid {1e2..1e12} used as the seed range); imp-2642 ' +
    '(C_C = (1/8) sqrt(3 pi) 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN Riemann-von ' +
    'Mangoldt inverse).',
};

export const IMP34755_TWO_ROUTE_RESIDUAL_ACROSS_N_ASSERTIONS = [
  {
    // (M1): every seed on the grid reproduces the SAME double as the closed-form route (residual 0).
    id: 'imp34755-all-seeds-bit-identical',
    description: 'across 1e2..1e12 plus far seeds 1e50/1e300, the Picard value is bit-identical to the closed form',
    holds: () => ALL_BIT_IDENTICAL === true && ALL_BELOW_FLOOR === true && MAX_RESIDUAL === 0,
  },
  {
    // (M2): the iterate count to reach the floor stays bounded and is flat across the decade grid.
    id: 'imp34755-iters-to-floor-bounded-and-flat',
    description: 'iters-to-floor is 12-13 across the imp-3220 decade grid and never exceeds 14 on the full grid',
    holds: () =>
      MIN_ITERS_DECADE >= 12 &&
      MAX_ITERS_DECADE <= 13 &&
      MAX_ITERS_TO_FLOOR <= 14 &&
      MAX_ITERS_TO_FLOOR > MAX_ITERS_DECADE,
  },
  {
    // The tabulated landmark value is the inherited N_cross ~ 3.280294e9 at every seed.
    id: 'imp34755-value-is-N-cross',
    description: 'both routes at every seed land on N_cross ~ 3.280294e9',
    holds: () =>
      Math.abs(N_CROSS_FP / 3.280294e9 - 1) < 5e-3 &&
      TABLE.every((r) => Math.abs(r.N_final / 3.280294e9 - 1) < 5e-3),
  },
  {
    // The seed grid actually spans the imp-3220 decades plus the two far probes.
    id: 'imp34755-grid-spans-decades-plus-far',
    description: 'the tabulated seed grid covers exponents 2..12 and includes far seeds 50 and 300',
    holds: () =>
      TABLE.length === 13 &&
      TABLE.some((r) => r.seed_exponent === 2) &&
      TABLE.some((r) => r.seed_exponent === 12) &&
      TABLE.some((r) => r.seed_exponent === 300),
  },
  {
    // Honesty gate: measurement of a surrogate consistency property, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34755-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34755_TWO_ROUTE_RESIDUAL_ACROSS_N.isRigorous === false &&
      /NO QED/.test(IMP34755_TWO_ROUTE_RESIDUAL_ACROSS_N.verdict) &&
      /refereed bound is changed/i.test(IMP34755_TWO_ROUTE_RESIDUAL_ACROSS_N.verdict),
  },
];

for (const a of IMP34755_TWO_ROUTE_RESIDUAL_ACROSS_N_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34755-two-route-residual-across-N assertion failed: ${a.id}`);
  }
}
