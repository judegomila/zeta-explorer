/**
 * @module imp-34775-iters-to-floor-log-law
 *
 * imp-34775 (numerical, frontier-direction): imp-34755 M2 OBSERVED that the Picard iterate count needed to
 * reach the machine-epsilon floor for the map g(N) = K log T0(N) (K = (C_C/E_trunc)^2 ~ 1.5727e8, unique
 * double-precision fixed point N_cross ~ 3.280294e9) is a flat ~12-13 across seeds 1e2..1e12, rising only to
 * 14 for the far seeds 1e50/1e300 -- and ATTRIBUTED that to a single-iterate log-collapse plus a strong
 * contraction removing ~1.35 decimal digits per step (|g_prime(N_cross)| ~ 0.045). imp-34755 reported the
 * count empirically but never DERIVED the log law from the 0.045 rate. This module derives the closed-form
 * count k(seed) from the contraction rate and measures its agreement with the observed ladder, confirming the
 * count grows only logarithmically (in fact double-logarithmically) with seed distance and never diverges.
 *
 * THE DERIVATION
 * --------------
 * The Banach map g(N) = K log T0(N) has a unique double-precision fixed point N_cross with local
 * contraction rate r = |g_prime(N_cross)|. A numerical central difference at N_cross gives
 *   r ~ 0.04542  (consistent with the ~0.045 named in imp-34755 M2),
 * so each contraction step removes -log10(r) ~ 1.343 decimal digits (consistent with the ~1.35 in M2).
 *
 * From ANY seed the FIRST iterate collapses the value into the same bounded log-region -- this is the
 * "single-iterate log-collapse" of M2: g(seed) = K log T0(seed), and since T0 (the Riemann-von Mangoldt
 * inverse height) grows only ~linearly in seed, g(seed) ~ K log(seed), so the post-collapse RELATIVE distance
 *   delta_0(seed) = |g(seed) - N_cross| / N_cross
 * is O(1) even for astronomically far seeds (delta_0 ~ 0.74 at seed 1e2, ~32 at seed 1e300). After that one
 * collapse the geometric contraction at rate r reduces the relative error delta_k ~ delta_0 * r^(k-1), and the
 * iteration reaches the machine-epsilon relative floor eps_fp ~ 2.3e-16 once delta_0 * r^(k-1) <= eps_fp.
 * Solving for k gives the CLOSED FORM
 *
 *   k(seed) = 1 + ceil( ln( delta_0(seed) / eps_fp ) / ln( 1 / r ) ).                (the log law)
 *
 * The leading 1 is the log-collapse iterate; the ceil term is the number of geometric-contraction steps.
 *
 * WHY IT NEVER DIVERGES (double-log in seed)
 * ------------------------------------------
 * Because T0(seed) ~ (linear in seed), the collapse gives delta_0(seed) ~ (K/N_cross) ln(seed) - 1 for large
 * seed -- delta_0 grows only LOGARITHMICALLY in the seed. Feeding that into the log law, k(seed) ~
 * 1 + ln(delta_0)/ln(1/r) ~ 1 + ln( (K/N_cross) ln seed )/ln(1/r), i.e. k grows like ln ln(seed) -- DOUBLE
 * logarithmically. That is why one extra iterate (13 -> 14) covers ~290 decades of seed offset and the count
 * can never diverge: the seed enters the count through two nested logarithms.
 *
 * THE MEASUREMENT
 * ---------------
 * Over the imp-3220 decade grid {1e2..1e12} plus far seeds {1e50, 1e300}, the closed-form k(seed) reproduces
 * the directly-measured itersToFloor to within +/-1 iterate at EVERY seed (12 of 13 exact; the single
 * off-by-one, at seed 1e10, sits on a ceil boundary where the early transient contracts slightly off the
 * asymptotic rate r). The predicted and measured ladders both read a flat 12-13 across 1e2..1e12 and rise to
 * exactly 14 at the far seeds -- the log law reproduces the observed plateau and its single far-seed step.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A closed-form derivation of an inherited empirical count from the fixed-point contraction rate, checked
 * against direct measurement. The rate r and the collapse distance delta_0 are IEEE-754 double-precision
 * evaluations via effectiveHeightForN; the law is an asymptotic geometric-contraction idealization, so
 * agreement to +/-1 iterate near ceil boundaries is the expected (honest) outcome, not a defect.
 *
 * MEASUREMENT/DERIVATION ONLY. Log-law derivation for a surrogate landmark, NOT a rigorous asymptotic and NOT
 * an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation; the C_C = (1/8)
 * sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34755-two-route-residual-across-N (parent: M2 reports the iters-to-floor ladder empirically)
 * @see imp-34733-crossover-closedform-vs-picard-crosstab (single-seed two-route cross-tabulation)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (route A: closed-form fixed point N_cross)
 * @see imp-34693-crossover-contraction-seed-band (route B: Picard terminal value, iterate counts, seed band)
 * @see imp-3220-conditional-share-decade-ladder (the {1e2..1e12} decade grid used here as the seed range)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34693/imp-34755)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor named in imp-34755

// The shared imp-33723/imp-34693/imp-34755 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged).
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669

// Local contraction rate r = |g_prime(N_cross)| via a central difference (step 1 in N-units ~ 3e-10 relative).
const G_PRIME = (g(N_CROSS_FP + 1) - g(N_CROSS_FP - 1)) / 2;
const R_CONTRACT = Math.abs(G_PRIME); // ~0.04542 (the ~0.045 of imp-34755 M2)
const DIGITS_PER_STEP = -Math.log10(R_CONTRACT); // ~1.343 (the ~1.35 of imp-34755 M2)

// Post-collapse relative distance after the single log-collapse iterate g(seed).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;

// THE CLOSED-FORM LOG LAW: iterate count to reach the floor from a given seed.
function itersToFloorPredicted(seed) {
  const delta0 = collapseDist(seed);
  return 1 + Math.ceil(Math.log(delta0 / EPS_FP) / Math.log(1 / R_CONTRACT));
}

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34755).
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

// The imp-3220 decade grid of seeds, plus the two far seeds probed in imp-34755 (~290 decades of offset).
const SEED_GRID = [1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e50, 1e300];

const TABLE = SEED_GRID.map((seed) => {
  const kPred = itersToFloorPredicted(seed);
  const kMeas = itersToFloorMeasured(seed);
  return {
    seed_exponent: Math.round(Math.log10(seed)), // 2..12, then 50, 300
    collapse_dist_delta0: +collapseDist(seed).toExponential(4), // post-collapse relative distance
    k_predicted: kPred, // closed-form log law
    k_measured: kMeas, // direct Picard count
    abs_error: Math.abs(kPred - kMeas), // 0 or 1 everywhere
  };
});

const MAX_ABS_ERROR = Math.max(...TABLE.map((r) => r.abs_error));
const EXACT_COUNT = TABLE.filter((r) => r.abs_error === 0).length; // 12 of 13
const MAX_K_MEASURED = Math.max(...TABLE.map((r) => r.k_measured)); // 14 at the far seeds
// Decade-grid-only range (exclude the far seeds) to show the flat plateau the log law reproduces.
const DECADE_ROWS = TABLE.filter((r) => r.seed_exponent <= 12);
const MIN_K_PRED_DECADE = Math.min(...DECADE_ROWS.map((r) => r.k_predicted));
const MAX_K_PRED_DECADE = Math.max(...DECADE_ROWS.map((r) => r.k_predicted));

// Double-log check: delta_0(seed) ~ (K/N_cross) ln(seed) - 1 for far seeds (drives the ln-ln flatness).
const KOVER_NSTAR = K_AMPL / N_CROSS_FP; // ~0.0479
const FAR_SEED = 1e300;
const DELTA0_LINLOG_APPROX = KOVER_NSTAR * Math.log(FAR_SEED) - 1; // ~32.1
const DELTA0_LINLOG_REL_ERR = Math.abs(DELTA0_LINLOG_APPROX / collapseDist(FAR_SEED) - 1); // ~0.7%

export const IMP34775_ITERS_TO_FLOOR_LOG_LAW = {
  id: 'imp-34775',
  proofSection: 'S-frontier',
  question:
    'imp-34755 M2 OBSERVED the Picard iters-to-floor count for g(N) = K log T0(N) is a flat ~12-13 across ' +
    'seeds 1e2..1e12, rising only to 14 for far seeds 1e50/1e300, and attributed it to a single-iterate ' +
    'log-collapse plus ~1.35 digits/step from |g_prime(N_cross)| ~ 0.045 -- but never DERIVED the log law. ' +
    'Derive the closed-form count k(seed) = 1 + ceil(ln(delta_0/eps_fp)/ln(1/r)) from the contraction rate ' +
    'and measure its agreement with the observed ladder over ~290 decades of seed. Derivation/measurement ' +
    'only; two inherited routes; NOT an RH bound; no QED.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6), // (C_C/E_trunc)^2 ~ 1.572709e8
    N_cross_fixed_point: +N_CROSS_FP.toPrecision(15), // 3.28029435165241e9
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (the ~0.045 of imp-34755 M2)
    digits_per_step: +DIGITS_PER_STEP.toPrecision(6), // ~1.34272 (the ~1.35 of imp-34755 M2)
    eps_fp_floor: EPS_FP, // 2.3e-16 relative floor
    K_over_N_cross: +KOVER_NSTAR.toPrecision(6), // ~0.0479440 (the delta_0 ~ (K/N*) ln seed slope)
  },
  closed_form_law: 'k(seed) = 1 + ceil( ln( delta_0(seed) / eps_fp ) / ln( 1 / r ) ), delta_0 = |g(seed)-N_cross|/N_cross',
  table: TABLE, // one row per seed: collapse dist, predicted vs measured count, abs error
  summary: {
    max_abs_error_across_grid: MAX_ABS_ERROR, // 1 (a single off-by-one at a ceil boundary)
    seeds_exact: EXACT_COUNT, // 12 of 13
    seeds_total: TABLE.length, // 13
    k_predicted_decade_range: [MIN_K_PRED_DECADE, MAX_K_PRED_DECADE], // [12, 13] across 1e2..1e12
    max_k_measured_across_grid: MAX_K_MEASURED, // 14 at the far seeds
    delta0_linlog_rel_error_at_1e300: +DELTA0_LINLOG_REL_ERR.toExponential(3), // ~7e-3 (double-log structure)
    law_reproduces_ladder:
      'the closed-form log law reproduces the imp-34755 M2 iters-to-floor ladder to within +/-1 iterate at ' +
      'every seed (12/13 exact), matching the flat 12-13 plateau across 1e2..1e12 and the single step to 14 ' +
      'at the far seeds; k grows like ln ln(seed), so it can never diverge',
  },
  finding:
    'The imp-34755 M2 iters-to-floor count is DERIVED here from the fixed-point contraction rate. A central ' +
    'difference at N_cross gives r = |g_prime(N_cross)| ~ 0.04542 (the ~0.045 of M2), so each geometric step ' +
    'removes -log10(r) ~ 1.343 decimal digits (the ~1.35 of M2). Since the first iterate g(seed) = K log ' +
    'T0(seed) collapses ANY seed into the same bounded log-region, the post-collapse relative distance ' +
    'delta_0(seed) is O(1) even for far seeds, and the geometric contraction delta_k ~ delta_0 r^(k-1) hits ' +
    'the eps_fp ~ 2.3e-16 floor at k(seed) = 1 + ceil(ln(delta_0/eps_fp)/ln(1/r)). This closed form ' +
    'reproduces the directly-measured Picard count to within +/-1 iterate at every seed on the imp-3220 ' +
    'decade grid {1e2..1e12} plus far seeds {1e50, 1e300} (12 of 13 exact; the lone off-by-one at 1e10 sits ' +
    'on a ceil boundary), matching the flat 12-13 plateau and the single far-seed step to 14. Because T0 is ' +
    'linear in seed, delta_0(seed) ~ (K/N_cross) ln(seed) - 1 (verified ~0.7% at 1e300), so k(seed) grows ' +
    'like ln ln(seed) -- DOUBLE-logarithmically -- which is why one extra iterate spans ~290 decades of seed ' +
    'offset and the count can never diverge.',
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT an RH bound). The imp-34755 M2 iters-to-floor count ' +
    'for the Banach map g(N) = K log T0(N) is derived from the fixed-point contraction rate r = ' +
    '|g_prime(N_cross)| ~ 0.04542 (central difference; consistent with the ~0.045 of M2, ~1.343 digits/step ' +
    'vs the ~1.35 of M2). The single-iterate log-collapse brings any seed to an O(1) post-collapse relative ' +
    'distance delta_0, after which geometric contraction hits the eps_fp ~ 2.3e-16 floor at the closed form ' +
    'k(seed) = 1 + ceil(ln(delta_0/eps_fp)/ln(1/r)). This reproduces the measured Picard count to within ' +
    '+/-1 iterate at every seed on the imp-3220 decade grid {1e2..1e12} plus far seeds {1e50, 1e300} (12 of ' +
    '13 exact; a single off-by-one at a ceil boundary), matching the flat 12-13 plateau and the single step ' +
    'to 14. Because T0 is linear in seed, delta_0 ~ (K/N_cross) ln(seed), so k grows like ln ln(seed) -- ' +
    'double-logarithmically -- and can never diverge. IEEE-754 double precision, no interval enclosure ' +
    '(compare the imp-34693a sub-gap); the law is an asymptotic geometric-contraction idealization so +/-1 ' +
    'iterate at ceil boundaries is expected; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34755 (parent: M2 reports the iters-to-floor ladder empirically); imp-34733 (single-seed two-route ' +
    'cross-tabulation); imp-33723 (closed-form crossover fixed point N_cross); imp-34693/imp-34676 (Picard ' +
    'terminal value, iterate counts, seed band); imp-3220 (conditional-share decade grid {1e2..1e12}); ' +
    'imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN Riemann-von ' +
    'Mangoldt inverse).',
};

export const IMP34775_ITERS_TO_FLOOR_LOG_LAW_ASSERTIONS = [
  {
    // The derived contraction rate matches the ~0.045 named in imp-34755 M2, ~1.35 digits/step.
    id: 'imp34775-contraction-rate-matches-M2',
    description: 'central-difference r = |g_prime(N_cross)| ~ 0.045 and removes ~1.35 digits/step',
    holds: () =>
      Math.abs(R_CONTRACT - 0.045) < 5e-3 &&
      Math.abs(DIGITS_PER_STEP - 1.35) < 0.05,
  },
  {
    // The closed-form log law reproduces the measured count to within +/-1 iterate everywhere.
    id: 'imp34775-log-law-within-one-iterate',
    description: 'k(seed) closed form matches measured itersToFloor to +/-1 at every seed, 12/13 exact',
    holds: () =>
      MAX_ABS_ERROR <= 1 &&
      EXACT_COUNT >= 12 &&
      TABLE.length === 13,
  },
  {
    // The predicted ladder reproduces the flat 12-13 plateau and the single far-seed step to 14.
    id: 'imp34775-reproduces-plateau-and-far-step',
    description: 'predicted count is 12-13 across the decade grid and the measured max reaches 14 at far seeds',
    holds: () =>
      MIN_K_PRED_DECADE >= 12 &&
      MAX_K_PRED_DECADE <= 13 &&
      MAX_K_MEASURED === 14,
  },
  {
    // Double-log structure: delta_0 ~ (K/N_cross) ln(seed) - 1 to ~1% at the far seed, so k ~ ln ln(seed).
    id: 'imp34775-double-log-structure',
    description: 'delta_0(1e300) ~ (K/N_cross) ln(seed) - 1 within ~1%, giving ln-ln growth of k',
    holds: () => DELTA0_LINLOG_REL_ERR < 0.02,
  },
  {
    // Honesty gate: derivation of a surrogate count, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34775-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34775_ITERS_TO_FLOOR_LOG_LAW.isRigorous === false &&
      /NO QED/.test(IMP34775_ITERS_TO_FLOOR_LOG_LAW.verdict) &&
      /refereed bound is changed/i.test(IMP34775_ITERS_TO_FLOOR_LOG_LAW.verdict),
  },
];

for (const a of IMP34775_ITERS_TO_FLOOR_LOG_LAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34775-iters-to-floor-log-law assertion failed: ${a.id}`);
  }
}
