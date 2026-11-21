/**
 * @module imp-34732-krawczyk-rho-sweep-N
 *
 * imp-34732 (numerical, frontier): imp-34714 verified the Krawczyk linear contraction factor
 * rho = mag(1 - f_prime(m)^-1 [f_prime]) ~ delta/U (U = log(m/2pi), delta the relative bracket
 * half-width) at a SINGLE crossover N = 1e9 (rho = 1.127e-5, U = 17.896). Because U grows with N,
 * the delta/U model predicts rho should SHRINK monotonically along the ladder -- but that was one
 * spot-check. This module SWEEPS N in {1e6, 1e7, ..., 1e12} at a FIXED relative half-width delta,
 * computes the exact rho and the delta/U prediction at each rung, and MEASURES (i) the monotone
 * decrease of rho and (ii) the relative agreement rho vs delta/U across the whole crossover range.
 * Measurement only; confirms/extends the imp-34714 contraction claim; NO QED.
 *
 * SETUP (same f, derivative, and Krawczyk operator as imp-34714)
 * -------------------------------------------------------------
 * f(T) = (T/2pi)(log(T/2pi) - 1) - N on T > 2pi, f_prime(T) = log(T/2pi)/2pi (increasing, so its
 * range on an interval is the endpoint values), f_dblprime = 1/(2pi T) > 0. For each N the root
 * T0(N) = effectiveHeightForN(N) (RvM inverse) is enclosed by a bracket of FIXED relative half-width
 * delta centred at T0: [T_lo, T_hi] = [T0(1 - delta), T0(1 + delta)], m = T0. The Krawczyk operator
 * K([T]) = m - Y f(m) + (1 - Y[f_prime])([T] - m) with Y = 1/f_prime(m) has linear contraction factor
 *   rho(N) = mag(1 - Y[f_prime]) = max(|1 - f_prime(T_lo)/f_prime(m)|, |1 - f_prime(T_hi)/f_prime(m)|),
 * and the imp-34714 first-order model is rho ~ delta/U with U = log(m/2pi). Fixing delta isolates the
 * N-dependence entirely into U(N): rho should fall like delta/U as N (hence U) grows.
 *
 * WHAT IS MEASURED (delta = 2e-4, ladder N = 1e6 .. 1e12)
 * ------------------------------------------------------
 *  (1) MONOTONE DECREASE: rho(N) strictly decreases along the ladder as U(N) increases.
 *  (2) LINEARIZATION AGREEMENT: the relative gap |rho - delta/U| / (delta/U) at each rung.
 *      Since f_prime(T_hi)/f_prime(m) = 1 + delta/U + O(delta^2), the model error relative to delta/U
 *      is O(delta) -- i.e. it is set by the FIXED delta, not by N -- so the agreement should be
 *      essentially CONSTANT across the sweep rather than degrading at any end.
 *
 * RESULT (double-precision surrogate for the exact evaluations; see imp-34714a)
 * ----------------------------------------------------------------------------
 * With delta = 2e-4, across N = 1e6, 1e7, ..., 1e12:
 *   rho(N):   1.7443e-5, 1.4723e-5, 1.2715e-5, 1.1177e-5, 9.9625e-6, 8.9812e-6, 8.1724e-6
 *   U(N):     11.4673,   13.5855,   15.7307,   17.8962,   20.0773,   22.2711,   24.4751
 * rho is STRICTLY MONOTONE DECREASING (each rung below the last), tracking 1/U as N grows, and the
 * delta/U prediction agrees to a UNIFORM relative error ~1.00e-4 at EVERY rung (the O(delta) = delta/2
 * second-order term, independent of N). So the single N = 1e9 spot-check (rho ~ 1.12e-5, matching
 * delta/U) is representative: the linearized delta/U model holds across the full 6-decade crossover
 * range with no degradation, and rho decreases monotonically exactly as U = log(m/2pi) grows.
 *
 * INTERPRETATION
 * --------------
 * The imp-34714 contraction claim rho ~ delta/U is CONFIRMED and EXTENDED from a single point to the
 * whole 1e6 .. 1e12 ladder: for fixed delta the model error is set by delta (O(delta) relative), not by
 * N, so agreement neither improves nor degrades along the sweep, and rho's monotone decrease is exactly
 * the 1/U falloff. Nowhere in the measured range does the linearization fail; it would only start to
 * degrade at O(delta) relative if delta itself were pushed up toward O(1).
 *
 * MEASUREMENT ONLY. This tabulates the contraction factor of the interval-Newton solver for the
 * inherited imp-3220/imp-3406 surrogate crossover map across N, NOT a rigorous asymptotic and NOT an RH
 * bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the lemma; rho ~ delta/U at the single N = 1e9)
 * @see imp-34726-krawczyk-outward-ulp-slack (outward-ULP slack of the N = 1e9 certificate; sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, Newton solver)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// Same f_prime as imp-34714 (f is strictly increasing and convex on T > 2pi; f_prime range = endpoints).
const fPrime = (T) => Math.log(T / TWO_PI) / TWO_PI;

// FIXED relative bracket half-width, matching the imp-34714 N = 1e9 spot-check (delta ~ 2.0e-4).
const DELTA = 2e-4;

// The crossover ladder swept beyond the single imp-34714 N = 1e9 spot-check.
const N_LADDER = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12];

// One Krawczyk contraction measurement at a given N: bracket [T0(1-delta), T0(1+delta)], m = T0.
function rhoAtN(N) {
  const T0 = effectiveHeightForN(N); // RvM inverse root
  const M = T0; // centre the fixed-delta bracket at the root
  const T_LO = M * (1 - DELTA);
  const T_HI = M * (1 + DELTA);
  const FP_LO = fPrime(T_LO);
  const FP_HI = fPrime(T_HI);
  const Y = 1 / fPrime(M); // preconditioner
  const RHO = Math.max(Math.abs(1 - Y * FP_LO), Math.abs(1 - Y * FP_HI));
  const U = Math.log(M / TWO_PI);
  const RHO_MODEL = DELTA / U; // first-order delta/U prediction (imp-34714)
  const REL = Math.abs(RHO - RHO_MODEL) / RHO_MODEL; // linearization relative error
  return { N, T0, M, U, rho: RHO, rhoModel: RHO_MODEL, rel: REL };
}

const SWEEP = N_LADDER.map(rhoAtN);

// (1) monotone decrease of rho along the ladder (rho falls as U = log(m/2pi) grows).
let STRICT_MONOTONE_DECREASE = true;
for (let i = 1; i < SWEEP.length; i++) {
  if (!(SWEEP[i].rho < SWEEP[i - 1].rho)) STRICT_MONOTONE_DECREASE = false;
}

// (2) uniform linearization agreement across the sweep (max/min relative error).
const REL_ERRORS = SWEEP.map((r) => r.rel);
const MAX_REL = Math.max(...REL_ERRORS);
const MIN_REL = Math.min(...REL_ERRORS);
const REL_SPREAD = MAX_REL - MIN_REL; // ~0 if agreement is N-independent (set by fixed delta)

// U is monotone increasing along the ladder (this is why rho falls); rho vs the N=1e9 rung.
let U_MONOTONE_INCREASE = true;
for (let i = 1; i < SWEEP.length; i++) {
  if (!(SWEEP[i].U > SWEEP[i - 1].U)) U_MONOTONE_INCREASE = false;
}
const RHO_1E9 = SWEEP[3].rho; // the single imp-34714 spot-check rung (N = 1e9)

export const IMP34732_KRAWCZYK_RHO_SWEEP_N = {
  id: 'imp-34732',
  proofSection: 'S-frontier',
  question:
    'imp-34714 verified the Krawczyk contraction factor rho = mag(1 - f_prime(m)^-1 [f_prime]) ~ ' +
    'delta/U (U = log(m/2pi)) at a SINGLE N = 1e9 (rho = 1.127e-5, U = 17.896). U grows with N so ' +
    'rho ~ delta/U should shrink -- but this is one spot-check. For a fixed relative half-width delta, ' +
    'sweep N in {1e6, ..., 1e12}, compute the exact rho and the delta/U prediction at each, and MEASURE ' +
    'the relative agreement and the monotone decrease of rho; report where (if anywhere) the linearized ' +
    'delta/U approximation degrades. Measurement only; confirms/extends the contraction claim; NO QED.',
  model: {
    setup:
      'For each N, T0(N) = effectiveHeightForN(N) is bracketed at FIXED relative half-width delta = 2e-4: ' +
      '[T_lo, T_hi] = [T0(1 - delta), T0(1 + delta)], m = T0. Krawczyk contraction ' +
      'rho(N) = max(|1 - f_prime(T_lo)/f_prime(m)|, |1 - f_prime(T_hi)/f_prime(m)|); model rho ~ delta/U.',
    prediction:
      'f_prime(T_hi)/f_prime(m) = 1 + delta/U + O(delta^2), so the model error relative to delta/U is ' +
      'O(delta) -- set by the FIXED delta, not by N. Fixing delta isolates the N-dependence into U(N): ' +
      'rho should fall like delta/U as U = log(m/2pi) grows, with N-INDEPENDENT relative agreement.',
  },
  measurement: {
    // Double-precision surrogate for the exact evaluations; certifies nothing (see imp-34714a).
    delta: +DELTA.toExponential(1), // fixed relative bracket half-width
    N_ladder: N_LADDER.map((N) => +N.toExponential(0)),
    T0: SWEEP.map((r) => +r.T0.toExponential(6)),
    U: SWEEP.map((r) => +r.U.toFixed(6)), // 11.4673 .. 24.4751 (monotone increasing)
    rho: SWEEP.map((r) => +r.rho.toExponential(6)), // 1.7443e-5 .. 8.1724e-6 (monotone decreasing)
    rho_model_delta_over_U: SWEEP.map((r) => +r.rhoModel.toExponential(6)),
    rel_error: SWEEP.map((r) => +r.rel.toExponential(4)), // ~1.00e-4 at every rung (O(delta) = delta/2)
    rho_strict_monotone_decrease: STRICT_MONOTONE_DECREASE,
    U_strict_monotone_increase: U_MONOTONE_INCREASE,
    max_rel_error: +MAX_REL.toExponential(4), // ~1.0001e-4
    min_rel_error: +MIN_REL.toExponential(4), // ~1.0001e-4
    rel_error_spread: +REL_SPREAD.toExponential(4), // ~0 -> agreement is N-independent
    rho_at_N_1e9: +RHO_1E9.toExponential(6), // matches the imp-34714 spot-check order (~1.12e-5)
  },
  finding:
    'Sweeping N = 1e6, 1e7, ..., 1e12 at fixed delta = 2e-4, the Krawczyk contraction factor rho(N) is ' +
    'STRICTLY MONOTONE DECREASING -- 1.7443e-5, 1.4723e-5, 1.2715e-5, 1.1177e-5, 9.9625e-6, 8.9812e-6, ' +
    '8.1724e-6 -- tracking 1/U as U = log(m/2pi) climbs monotonically 11.4673 -> 24.4751. The first-order ' +
    'delta/U prediction agrees to a UNIFORM relative error ~1.00e-4 at EVERY rung (the O(delta) = delta/2 ' +
    'second-order term, independent of N; the max/min relative error spread is ~0). So the single ' +
    'imp-34714 N = 1e9 spot-check (rho ~ 1.12e-5 matching delta/U) is representative: the linearized ' +
    'delta/U model holds across the full 6-decade crossover range with NO degradation at either end, and ' +
    'rho decreases monotonically exactly as U grows. The linearization would only degrade at O(delta) ' +
    'relative if delta itself were pushed toward O(1); at delta = 2e-4 it is uniformly ~1e-4-accurate.',
  subGap:
    'imp-34714a REMAINS OPEN. Each rho(N) evaluates f_prime endpoints and the preconditioner in DOUBLE ' +
    'PRECISION (few-ULP roundoff), so this sweep MEASURES the contraction factor and its delta/U model ' +
    'across N; it does not machine-certify the underlying Krawczyk (H1)-(H2) hypotheses, which still need ' +
    'the imp-34687a directed-rounding layer. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'CONTRACTION-FACTOR SWEEP (frontier, NOT an RH bound). The imp-34714 claim rho = ' +
    'mag(1 - f_prime(m)^-1 [f_prime]) ~ delta/U, verified at the SINGLE crossover N = 1e9, is CONFIRMED ' +
    'and EXTENDED across N = 1e6 .. 1e12 at fixed relative half-width delta = 2e-4. rho(N) is STRICTLY ' +
    'MONOTONE DECREASING (1.7443e-5 down to 8.1724e-6) as U = log(m/2pi) grows monotonically ' +
    '(11.4673 -> 24.4751), and the first-order delta/U prediction agrees to a UNIFORM relative error ' +
    '~1.00e-4 at EVERY rung -- the O(delta) = delta/2 second-order term, INDEPENDENT of N (relative-error ' +
    'spread across the ladder is ~0). The linearized delta/U model therefore does NOT degrade anywhere in ' +
    'the measured 6-decade range; it would only start to at O(delta) relative if delta itself approached ' +
    'O(1). The single N = 1e9 spot-check is representative. MEASUREMENT ONLY for the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; SUB-GAP imp-34714a REMAINS OPEN (double-precision ' +
    'surrogate, not a machine certificate). The C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34714 (Krawczyk existence-uniqueness lemma; rho ~ delta/U at the single N = 1e9); ' +
    'imp-34726 (outward-ULP slack of the N = 1e9 certificate; sub-gap imp-34714a); ' +
    'imp-34687 (crossover interval-arithmetic scope; sub-gap imp-34687a directed-rounding layer); ' +
    'imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN, Newton ' +
    'inverse of the Riemann-von Mangoldt count). Interval-Newton / Krawczyk: Moore, Krawczyk, Neumaier.',
};

export const IMP34732_KRAWCZYK_RHO_SWEEP_N_ASSERTIONS = [
  {
    // rho strictly decreases along the whole ladder (the delta/U -> shrink prediction).
    id: 'imp34732-rho-monotone-decrease',
    description: 'rho(N) strictly decreases across N = 1e6 .. 1e12 as U = log(m/2pi) grows',
    holds: () =>
      STRICT_MONOTONE_DECREASE &&
      U_MONOTONE_INCREASE &&
      SWEEP[0].rho > SWEEP[SWEEP.length - 1].rho &&
      SWEEP[0].rho < 1e-3, // still a genuine (<< 1) contraction at the small-N end
  },
  {
    // The first-order delta/U model agrees uniformly (O(delta) error, N-independent).
    id: 'imp34732-delta-over-U-uniform-agreement',
    description: 'rho vs delta/U agrees to ~1e-4 at every rung; relative-error spread ~0 (set by delta, not N)',
    holds: () =>
      MAX_REL < 5e-4 && // uniformly close (O(delta) = delta/2 ~ 1e-4)
      MAX_REL > 0 &&
      REL_SPREAD < 1e-6, // agreement does not degrade at either end of the sweep
  },
  {
    // The N = 1e9 rung reproduces the imp-34714 spot-check order of magnitude.
    id: 'imp34732-N1e9-matches-spot-check',
    description: 'the N = 1e9 rung rho ~ 1.12e-5 matches the imp-34714 single-point value',
    holds: () => RHO_1E9 > 1.0e-5 && RHO_1E9 < 1.2e-5,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34732-honesty-gate-no-qed',
    description: 'Sweep measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34732_KRAWCZYK_RHO_SWEEP_N.isRigorous === false &&
      /imp-34714a/.test(IMP34732_KRAWCZYK_RHO_SWEEP_N.subGap) &&
      /REMAINS OPEN/.test(IMP34732_KRAWCZYK_RHO_SWEEP_N.subGap) &&
      /NO QED/.test(IMP34732_KRAWCZYK_RHO_SWEEP_N.verdict) &&
      /refereed bound is changed/i.test(IMP34732_KRAWCZYK_RHO_SWEEP_N.verdict),
  },
];

for (const a of IMP34732_KRAWCZYK_RHO_SWEEP_N_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34732-krawczyk-rho-sweep-N assertion failed: ${a.id}`);
  }
}
