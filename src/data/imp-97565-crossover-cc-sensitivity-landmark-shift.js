/**
 * @module imp-97565-crossover-cc-sensitivity-landmark-shift
 *
 * imp-97565 (numerical, frontier-direction): imp-33723 pinned the imp-3444 E_coll = E_trunc
 * crossover in CLOSED FORM as the fixed point N_cross = (C_C/E_trunc)^2 * log T0(N_cross), i.e.
 * N = g(N) with g(N) = K * log T0(N) and K = (C_C/E_trunc)^2 ~ 1.5727e8, and reported it as a
 * strong contraction (|g_prime(N_cross)| ~ 4.54e-2) landing at N_cross ~ 3.280294e9. imp-33770
 * then swept C_C over 0.5x..2x but measured only the CONTRACTION RATE |g_prime| (it stays in
 * [4.28e-2, 4.84e-2], a log-slow function of K alone). What was never measured is the sensitivity
 * of the crossover VALUE N_cross itself -- and, through it, of the imp-33582 sigma(N) = 1/2 halving
 * landmark N_half -- to the C_C constant. This module supplies that: the analytic C_C-elasticity of
 * N_cross, its numerical confirmation over a 0.5x..2x C_C ladder, and the parallel shift of the
 * halving landmark N_half (with its own elasticity), quantifying the E(N)-bottleneck C_C-sensitivity
 * of the empirical-vs-analytic conditional-gap decay. Measurement only; no bound moves; NO QED.
 *
 * THE ANALYTIC ELASTICITY (the deliverable)
 * -----------------------------------------
 * Differentiate the fixed point N_cross = K log T0(N_cross), K = (C_C/E_trunc)^2, in C_C. With
 * dK/dC_C = 2K/C_C and g_prime(N) = K (dT0/dN)/T0,
 *
 *     dN_cross/dC_C * (1 - g_prime) = (2K/C_C) log T0 = 2 N_cross / C_C
 *   =>  d log N_cross / d log C_C = 2 / (1 - g_prime(N_cross)).                 (ELASTICITY)
 *
 * So the crossover has C_C-elasticity slightly above the naive N_cross ~ C_C^2 scaling: the log T0
 * self-coupling inflates the exponent 2 by the factor 1/(1 - g_prime). At the base amplitude
 * g_prime ~ 0.045423, giving elasticity ~ 2.09517 -- a 1% rise in C_C shifts N_cross UP by ~2.11%.
 * A central-difference of the converged fixed point in log C_C reproduces 2.095170, matching the
 * closed-form 2/(1 - g_prime) to 6 digits. The elasticity is nearly amplitude-flat: over the full
 * 0.5x..2x sweep it varies only in [2.0894, 2.1018] (g_prime drifts log-slowly, per imp-33770).
 *
 * THE HALVING LANDMARK TRACKS -- BUT ITS OFFSET IS C_C-DEPENDENT
 * -------------------------------------------------------------
 * The imp-33582 halving landmark N_half (sigma = E_coll/E_N = 1/2 <=> E_coll = E_trunc + E_flow,
 * imp-33601) shifts in near-lockstep with N_cross: its own C_C-elasticity is ~2.10235, marginally
 * STEEPER than N_cross's. The reason is that the ~0.4% halving offset (N_cross - N_half)/N_cross is
 * itself C_C-sensitive: it is set by the E_flow/E_trunc flow share, which contracts as the crossover
 * is pushed to larger N. Across the sweep the relative offset shrinks monotonically from ~1.376e-2
 * at 0.5x to ~1.141e-3 at 2x (base ~3.981e-3), so a larger C_C both raises N_cross and squeezes
 * the halving landmark toward it. The halving-landmark shift is therefore NOT identical to the
 * N_cross shift -- it inherits the ~2.095 crossover elasticity PLUS a small flow-share-contraction
 * term (~+0.007 in elasticity at the base amplitude).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (S1) N_CROSS C_C-ELASTICITY ~ 2.095, ABOVE THE NAIVE C_C^2. The closed form
 *        d log N_cross / d log C_C = 2/(1 - g_prime) gives 2.09517 at base (g_prime ~ 0.045423),
 *        confirmed by a log-C_C central difference to 6 digits. A 1% C_C move shifts N_cross by
 *        ~2.107%. The elasticity stays in [2.0894, 2.1018] over the whole 0.5x..2x amplitude sweep.
 *   (S2) THE HALVING LANDMARK SHIFTS IN NEAR-LOCKSTEP, SLIGHTLY STEEPER. N_half has C_C-elasticity
 *        ~2.10235, exceeding N_cross's ~2.09517 by ~+0.0072 because the halving offset itself
 *        contracts with C_C: the relative offset (N_cross - N_half)/N_cross falls monotonically from
 *        1.376e-2 (0.5x) through 3.981e-3 (base) to 1.141e-3 (2x). The E_flow flow share, not a
 *        grid artifact, is what makes the offset -- and hence the halving-landmark shift -- C_C-live.
 *
 * The punchline: under C_C perturbations the closed-form crossover N_cross moves like C_C^2 inflated
 * by 1/(1 - g_prime) ~ 2.095, and the sigma = 1/2 halving landmark tracks it with a marginally
 * steeper elasticity ~2.102 because the ~0.4% halving offset is itself the (shrinking) E_flow share.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-
 * conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED and is
 * only perturbed here as a sensitivity probe, not re-pinned; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed form N_cross = (C_C/E_trunc)^2 log T0)
 * @see imp-33770-crossover-contraction-cc-amplitude-sweep (C_C sweep of the CONTRACTION rate |g_prime|)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma=1/2 halving landmark N_half)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-33723 exactly

// EXACT imp-3406/imp-33582/imp-33601/imp-33723 sub-terms, with C_C carried as a parameter so it
// can be perturbed (sensitivity probe only; the pinned ansatz value is untouched, imp-2642).
function parts(N, cc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// (CLOSED FORM) crossover fixed point N = K log T0(N), K = (cc/E_trunc)^2 (imp-33723).
function crossoverFixedPoint(cc, seed, iters) {
  const K = (cc / E_TRUNC_PT) ** 2;
  let N = seed;
  for (let i = 0; i < iters; i++) N = K * Math.log(effectiveHeightForN(N));
  return N;
}

// Halving landmark: sigma = 1/2 (imp-33582), by downslope bisection in log N.
function halvingLandmark(cc) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc).sigma > 0.5) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Analytic contraction rate g_prime(N) = K * 2pi / (T0 log(T0/2pi)) at a crossover value.
function contractionAt(N, cc) {
  const K = (cc / E_TRUNC_PT) ** 2;
  const T0 = effectiveHeightForN(N);
  return (K * TWO_PI) / (T0 * Math.log(T0 / TWO_PI));
}

// Base (c = 1) landmarks and the analytic C_C-elasticity 2/(1 - g_prime).
const N_CROSS_BASE = crossoverFixedPoint(C_C_PINNED, 1e9, 60); // ~3.280294e9
const N_HALF_BASE = halvingLandmark(C_C_PINNED); // ~3.267235e9
const GPRIME_BASE = contractionAt(N_CROSS_BASE, C_C_PINNED); // ~4.5423e-2
const ELASTICITY_ANALYTIC = 2 / (1 - GPRIME_BASE); // ~2.09517
const REL_OFFSET_BASE = (N_CROSS_BASE - N_HALF_BASE) / N_CROSS_BASE; // ~3.981e-3

// Numerical C_C-elasticity of N_cross (central difference in log C_C), cross-check of ELASTICITY_ANALYTIC.
function logElasticity(fn, cc, eps) {
  const up = fn(cc * (1 + eps));
  const dn = fn(cc * (1 - eps));
  return (Math.log(up) - Math.log(dn)) / (Math.log(cc * (1 + eps)) - Math.log(cc * (1 - eps)));
}
const ELASTICITY_NCROSS_NUM = logElasticity((cc) => crossoverFixedPoint(cc, 1e9, 80), C_C_PINNED, 1e-4); // ~2.095170
const ELASTICITY_NHALF_NUM = logElasticity((cc) => halvingLandmark(cc), C_C_PINNED, 1e-3); // ~2.102347

// C_C amplitude ladder (c = 1 = the C_H = 1/8 ansatz base): N_cross, N_half, offset, local elasticity.
const FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0];
const LADDER = FACTORS.map((c) => {
  const cc = c * C_C_PINNED;
  const nCross = crossoverFixedPoint(cc, 1e9, 60);
  const nHalf = halvingLandmark(cc);
  const gp = contractionAt(nCross, cc);
  return {
    factor: c,
    N_cross: +nCross.toExponential(6),
    N_half: +nHalf.toExponential(6),
    rel_offset: +((nCross - nHalf) / nCross).toExponential(4),
    elasticity_analytic: +(2 / (1 - gp)).toFixed(5),
  };
});
const OFFSET_MIN = Math.min(...LADDER.map((r) => r.rel_offset));
const OFFSET_MAX = Math.max(...LADDER.map((r) => r.rel_offset));
const ELAST_MIN = Math.min(...LADDER.map((r) => r.elasticity_analytic));
const ELAST_MAX = Math.max(...LADDER.map((r) => r.elasticity_analytic));

export const IMP97565_CROSSOVER_CC_SENSITIVITY_LANDMARK_SHIFT = {
  id: 'imp-97565',
  proofSection: 'S-frontier',
  question:
    'Measure the sensitivity of the imp-33723 closed-form crossover N_cross = (C_C/E_trunc)^2 log T0(N_cross) ' +
    'to the C_C constant, and quantify the resulting shift of the imp-33582 sigma(N) = 1/2 halving landmark. ' +
    'Measurement only; C_C 1/8 ansatz perturbed as a probe not re-pinned; no bound moves; no QED.',
  elasticityFormula:
    'd log N_cross / d log C_C = 2 / (1 - g_prime(N_cross)); g_prime = K*2pi/(T0 log(T0/2pi)), K = (C_C/E_trunc)^2.',
  landmarks: {
    N_cross_base: +N_CROSS_BASE.toExponential(6), // ~3.280294e9
    N_half_base: +N_HALF_BASE.toExponential(6), // ~3.267235e9
    g_prime_base: +GPRIME_BASE.toExponential(4), // ~4.5423e-2
    rel_offset_base: +REL_OFFSET_BASE.toExponential(4), // ~3.981e-3
    elasticity_N_cross_analytic: +ELASTICITY_ANALYTIC.toFixed(6), // ~2.095170
    elasticity_N_cross_numeric: +ELASTICITY_NCROSS_NUM.toFixed(6), // ~2.095170
    elasticity_N_half_numeric: +ELASTICITY_NHALF_NUM.toFixed(6), // ~2.102347
    one_pct_CC_shifts_N_cross_pct: +((ELASTICITY_ANALYTIC) * 1.0).toFixed(4), // ~2.0952% per 1% (leading)
  },
  ladder: LADDER,
  ladderSpans: {
    elasticity_range: [+ELAST_MIN.toFixed(5), +ELAST_MAX.toFixed(5)], // ~[2.0894, 2.1018]
    rel_offset_range: [+OFFSET_MIN.toExponential(4), +OFFSET_MAX.toExponential(4)], // ~[1.141e-3, 1.376e-2]
  },
  finding: {
    S1_N_cross_elasticity_above_naive_square:
      'The closed form d log N_cross / d log C_C = 2/(1 - g_prime) gives ~2.09517 at the base amplitude ' +
      '(g_prime ~ 0.045423), above the naive N_cross ~ C_C^2 scaling because the log T0 self-coupling ' +
      'inflates the exponent by 1/(1 - g_prime). A log-C_C central difference reproduces 2.095170 to 6 ' +
      'digits, and the elasticity stays in ~[2.0894, 2.1018] across the full 0.5x..2x amplitude sweep.',
    S2_halving_landmark_tracks_slightly_steeper:
      'The sigma = 1/2 halving landmark N_half shifts in near-lockstep, with its own C_C-elasticity ~2.10235 ' +
      '(steeper than N_cross by ~+0.0072). The cause is that the ~0.4% halving offset (N_cross - N_half)/N_cross ' +
      'is itself C_C-sensitive: it is the E_flow flow share, which contracts as N_cross is pushed larger, so the ' +
      'relative offset falls monotonically from ~1.376e-2 (0.5x) through ~3.981e-3 (base) to ~1.141e-3 (2x).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Under C_C perturbations the imp-33723 closed-form ' +
    'crossover N_cross = (C_C/E_trunc)^2 log T0(N_cross) has C_C-elasticity d log N_cross / d log C_C = ' +
    '2/(1 - g_prime(N_cross)) ~ 2.09517 at the base amplitude -- above the naive C_C^2 by the log T0 ' +
    'self-coupling factor 1/(1 - g_prime) -- confirmed by a log-C_C central difference to 6 digits and ' +
    'flat in ~[2.089, 2.102] over 0.5x..2x. The imp-33582 sigma = 1/2 halving landmark tracks it with a ' +
    'marginally steeper elasticity ~2.10235, because the ~0.4% halving offset is the (shrinking) E_flow ' +
    'flow share and is itself C_C-dependent (relative offset 1.376e-2 -> 1.141e-3 across the sweep). ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED (perturbed ' +
    'only as a probe, not re-pinned); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33723 (closed-form crossover fixed point); imp-33770 (C_C sweep of the contraction rate |g_prime|); ' +
    'imp-33601 (identity sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-33582 (sigma=1/2 halving landmark); ' +
    'imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP97565_CROSSOVER_CC_SENSITIVITY_LANDMARK_SHIFT_ASSERTIONS = [
  {
    // Base landmarks reproduce imp-33723 (closed-form crossover + halving landmark).
    id: 'imp97565-base-reproduces-imp33723',
    description: 'base N_cross ~3.280294e9 and N_half ~3.267235e9 reproduce imp-33723 to < 5e-3 relative',
    holds: () =>
      Math.abs(N_CROSS_BASE / 3.280294e9 - 1) < 5e-3 && Math.abs(N_HALF_BASE / 3.267235e9 - 1) < 5e-3,
  },
  {
    // (S1): analytic elasticity 2/(1-g_prime) ~ 2.095 matches the numeric log-C_C central difference.
    id: 'imp97565-N-cross-elasticity-matches-analytic',
    description: 'analytic 2/(1-g_prime) ~2.0952 matches numeric d log N_cross/d log C_C to < 1e-3',
    holds: () =>
      Math.abs(ELASTICITY_ANALYTIC - 2.09517) < 5e-3 &&
      Math.abs(ELASTICITY_ANALYTIC - ELASTICITY_NCROSS_NUM) < 1e-3 &&
      ELASTICITY_ANALYTIC > 2, // strictly above the naive C_C^2 scaling
  },
  {
    // The C_C-elasticity is amplitude-flat over the swept range (g_prime is log-slow, imp-33770).
    id: 'imp97565-elasticity-amplitude-flat',
    description: 'N_cross elasticity stays in ~[2.089, 2.102] across the full 0.5x..2x C_C sweep',
    holds: () => ELAST_MIN > 2.08 && ELAST_MAX < 2.11 && ELAST_MAX - ELAST_MIN < 0.02,
  },
  {
    // (S2): the halving landmark tracks N_cross but with a marginally steeper elasticity.
    id: 'imp97565-halving-landmark-tracks-steeper',
    description: 'N_half elasticity ~2.1023 exceeds N_cross elasticity ~2.0952 (by a small positive margin)',
    holds: () =>
      ELASTICITY_NHALF_NUM > ELASTICITY_NCROSS_NUM &&
      ELASTICITY_NHALF_NUM - ELASTICITY_NCROSS_NUM < 0.05 &&
      Math.abs(ELASTICITY_NHALF_NUM - 2.10235) < 5e-3,
  },
  {
    // (S2): the halving offset is C_C-dependent -- it contracts monotonically as C_C grows.
    id: 'imp97565-offset-contracts-with-CC',
    description: 'rel offset falls monotonically across the ladder from ~1.376e-2 (0.5x) to ~1.141e-3 (2x)',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].rel_offset < LADDER[i - 1].rel_offset)) return false;
      }
      return OFFSET_MAX > 1e-2 && OFFSET_MIN < 2e-3 && LADDER.every((r) => r.rel_offset > 0);
    },
  },
  {
    // N_cross is strictly monotone increasing in C_C across the ladder (the crossover rises with C_C).
    id: 'imp97565-N-cross-monotone-in-CC',
    description: 'N_cross strictly increases with the C_C amplitude factor across the ladder',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].N_cross > LADDER[i - 1].N_cross)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed, ansatz untouched.
    id: 'imp97565-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97565_CROSSOVER_CC_SENSITIVITY_LANDMARK_SHIFT.isRigorous === false &&
      /NO QED/.test(IMP97565_CROSSOVER_CC_SENSITIVITY_LANDMARK_SHIFT.verdict) &&
      /refereed bound is changed/i.test(IMP97565_CROSSOVER_CC_SENSITIVITY_LANDMARK_SHIFT.verdict),
  },
];

for (const a of IMP97565_CROSSOVER_CC_SENSITIVITY_LANDMARK_SHIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97565-crossover-cc-sensitivity-landmark-shift assertion failed: ${a.id}`);
  }
}
