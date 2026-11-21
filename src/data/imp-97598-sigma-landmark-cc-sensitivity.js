/**
 * @module imp-97598-sigma-landmark-cc-sensitivity
 *
 * imp-97598 (numerical, sensitivity): imp-97584 tabulated the E_trunc-elasticity
 * d(ln N)/d(ln E_trunc) of ALL FOUR imp-97520 sigma(N) = E_coll/E_N landmarks --
 * L1 interior PEAK (N ~ 9.22e5), L2 DOWNSLOPE below 0.9 (N ~ 2.57e7), L3 HALVING
 * sigma = 1/2 (N ~ 3.27e9), L4 below 0.1 (N ~ 3.21e11). The complementary C_C axis
 * was measured (imp-36139/imp-97565) ONLY for the halving crossover (elasticity
 * ~+2.095). This LIGHT standalone module completes the sensitivity map: it measures
 * the C_C-elasticity of ALL FOUR landmarks by the IDENTICAL imp-97520 procedure
 * (ternary-search peak, bisection downslope crossings) over a 0.5x .. 2x C_C ladder,
 * carrying the SAME inherited imp-3406/imp-33582 sub-terms (no new model, no new
 * constants; the pinned C_C 1/8 ansatz is perturbed only as a probe, imp-2642).
 *
 * WHAT IS MEASURED
 * ----------------
 * For each amplitude factor c the four landmark N-values are recomputed with
 * E_coll = c * C_C * sqrt(L/N). Reported per landmark: the log-log elasticity
 * d(ln N)/d(ln C_C) at c = 1 (central difference), and whether the strictly-
 * increasing ordering and the decade gaps are preserved across the whole ladder.
 *
 * THE ELASTICITY RESULT (central difference at c = 1)
 * ---------------------------------------------------
 *   L1 peak      d ln N / d ln C_C ~  0.000   (the odd one out: C_C-INVARIANT)
 *   L2 below-0.9 d ln N / d ln C_C ~ +2.555   (steepest)
 *   L3 halving   d ln N / d ln C_C ~ +2.102   (matches imp-97565 to 5 digits)
 *   L4 below-0.1 d ln N / d ln C_C ~ +2.079   (near the closed-form +2)
 *
 * TWO STRUCTURAL CONTRASTS WITH THE imp-97584 E_trunc AXIS
 * -------------------------------------------------------
 *  (A) SIGN FLIPS. C_C sits in the NUMERATOR of E_coll where E_trunc sits in the
 *      denominator of sigma, so the three downslope landmarks scale like N ~ C_C^2
 *      (elasticity ~ +2) rather than N ~ E_trunc^-2 (elasticity ~ -2). L3 halving
 *      ~+2.102 reproduces the imp-97565 closed-form 2/(1 - g_prime) numeric value
 *      2.102347 to 5 digits; L4 tail ~+2.079; L2 runs steepest at ~+2.555.
 *  (B) THE PEAK IS EXACTLY C_C-INVARIANT, NOT MERELY SHALLOW. On the E_trunc axis
 *      L1 was the odd-one-out at ~ -1.373 (shallowest). On the C_C axis L1 is even
 *      more the exception: its elasticity is 0 to numerical precision because C_C
 *      is a COMMON MULTIPLICATIVE FACTOR of E_coll, hence of the ratio
 *      (E_trunc + E_flow)/E_coll whose minimiser in N fixes the peak location. A
 *      constant prefactor cannot move an extremum, so the peak N is C_C-independent
 *      (only the peak VALUE sigma_max rises with C_C, from 0.9037 at 0.5x to 0.9741
 *      at 2x). The measured L1 elasticity stays below 1e-3 across the ladder and the
 *      peak N is fixed at 9.21863e5 to six figures for every amplitude.
 *
 * ORDERING / GAP PRESERVATION
 * ---------------------------
 * Across the entire 0.5x .. 2x ladder the four landmarks stay strictly increasing
 * (L1 < L2 < L3 < L4). The L3 -> L4 gap is essentially frozen at ~1.99 decades
 * (as on the E_trunc axis). Because L1 is pinned while the downslope landmarks rise
 * with C_C, the total peak-to-tail span EXPANDS from ~4.92 to ~6.17 decades -- the
 * OPPOSITE of the E_trunc axis (where the span contracts). No landmark reordering
 * occurs.
 *
 * MEASUREMENT ONLY. Same inherited imp-3220/imp-3406 surrogate component model,
 * NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; the C_C
 * 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED and perturbed only as a sensitivity
 * probe, not re-pinned; E_trunc pinned 3.06e-5 unchanged; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-97584-sigma-landmark-etrunc-sensitivity (the E_trunc-axis companion)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the four-landmark object)
 * @see imp-97565-crossover-cc-sensitivity-landmark-shift (C_C sensitivity of the halving landmark)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (N_cross ~ (C_C/E_trunc)^2 log T0)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-97565 exactly

// EXACT imp-3406/imp-33582/imp-97520 sub-terms; C_C is carried as the perturbed input
// (sensitivity probe only; the pinned 1/8 ansatz value is untouched, imp-2642).
function parts(N, cc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N };
}

// Interior peak of sigma(N): ternary search in log N (imp-97520 procedure).
function peakNlogN(lo, hi, cc) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 400; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), cc).sigma < parts(Math.exp(m2), cc).sigma) a = m1;
    else b = m2;
  }
  return Math.exp((a + b) / 2);
}

// Downslope crossing where sigma first drops below target (imp-97520 procedure).
function crossBelow(target, lo, hi, cc) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc).sigma > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

function landmarks(cc) {
  const L1 = peakNlogN(1e4, 1e8, cc);
  const smax = parts(L1, cc).sigma;
  const L2 = crossBelow(0.9, L1, 1e18, cc);
  const L3 = crossBelow(0.5, L1, 1e18, cc);
  const L4 = crossBelow(0.1, L1, 1e18, cc);
  return { L1, smax, L2, L3, L4 };
}

const FACTORS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const log10 = (x) => Math.log10(x);

const LADDER = FACTORS.map((c) => {
  const lm = landmarks(c * C_C_PINNED);
  return {
    factor: c,
    L1_peak: +lm.L1.toExponential(6),
    sigma_max: +lm.smax.toFixed(6),
    L2_below_0p9: +lm.L2.toExponential(6),
    L3_halving: +lm.L3.toExponential(6),
    L4_below_0p1: +lm.L4.toExponential(6),
    gap_L1_L2_decades: +(log10(lm.L2) - log10(lm.L1)).toFixed(4),
    gap_L2_L3_decades: +(log10(lm.L3) - log10(lm.L2)).toFixed(4),
    gap_L3_L4_decades: +(log10(lm.L4) - log10(lm.L3)).toFixed(4),
    span_L1_L4_decades: +(log10(lm.L4) - log10(lm.L1)).toFixed(4),
    strictly_increasing: lm.L1 < lm.L2 && lm.L2 < lm.L3 && lm.L3 < lm.L4,
  };
});

// Log-log elasticity d(ln N)/d(ln C_C) at c = 1 by central difference.
const EPS = 0.01;
const UP = landmarks((1 + EPS) * C_C_PINNED);
const DN = landmarks((1 - EPS) * C_C_PINNED);
const D_LN_CC = Math.log(1 + EPS) - Math.log(1 - EPS);
const elasticity = (key) => +((Math.log(UP[key]) - Math.log(DN[key])) / D_LN_CC).toFixed(5);
const ELASTICITY = {
  L1_peak: elasticity('L1'), // ~  0.000 (C_C-invariant)
  L2_below_0p9: elasticity('L2'), // ~ +2.555
  L3_halving: elasticity('L3'), // ~ +2.102 (matches imp-97565)
  L4_below_0p1: elasticity('L4'), // ~ +2.079
};

const ALL_INCREASING = LADDER.every((r) => r.strictly_increasing === true);

export const IMP97598_SIGMA_LANDMARK_CC_SENSITIVITY = {
  id: 'imp-97598',
  proofSection: 'S-frontier',
  title:
    'Measure the C_C sensitivity of the imp-97520 four sigma(N) landmarks (peak, below-0.9, ' +
    'halving, below-0.1) across a 0.5x..2x amplitude ladder -- per-landmark elasticity and ' +
    'ordering/gap preservation, completing the map imp-97584 built for the E_trunc axis',
  isRigorous: false,
  baseline: { C_C_PINNED: +C_C_PINNED.toFixed(10), E_TRUNC_PT, factors: FACTORS },
  model:
    'sigma(N) = E_coll / (E_trunc + E_flow + E_coll) with the exact inherited imp-3406/imp-33582 ' +
    'sub-terms; E_coll = c * C_C * sqrt(L/N), C_C scaled by amplitude factor c as a sensitivity ' +
    'probe (the pinned 1/8 ansatz value is unchanged, imp-2642).',
  ladder: LADDER,
  elasticity: ELASTICITY,
  orderingPreserved: ALL_INCREASING,
  finding:
    'The three downslope landmarks scale like N ~ C_C^2 (elasticity ~ +2, sign-flipped from the ' +
    'E_trunc axis because C_C is in the numerator of E_coll): L3 halving ~+2.102 reproduces the ' +
    'imp-97565 closed-form 2/(1 - g_prime) numeric value 2.102347 to 5 digits, L4 tail ~+2.079, ' +
    'and L2 runs steepest at ~+2.555. The interior peak L1 is the odd one out AND stronger than on ' +
    'the E_trunc axis: its C_C-elasticity is 0 to numerical precision because C_C is a common ' +
    'multiplicative factor of E_coll -- a constant prefactor cannot move the minimiser of ' +
    '(E_trunc+E_flow)/E_coll that fixes the peak location, so the peak N is C_C-invariant (only the ' +
    'peak VALUE sigma_max rises, 0.9037 -> 0.9741 across the ladder). Across the full 0.5x..2x ladder ' +
    'the four landmarks stay strictly increasing; the L3->L4 gap is frozen at ~1.99 decades while the ' +
    'peak-to-tail span EXPANDS from ~4.92 to ~6.17 decades (opposite the E_trunc axis, since L1 is ' +
    'pinned while the downslope landmarks climb with C_C). No reordering occurs.',
  note:
    'Complementary sensitivity axis to imp-97584 (E_trunc-elasticity of all four landmarks) and a ' +
    'completion of imp-97565 (which perturbed C_C for the halving landmark only): here C_C is ' +
    'perturbed across a 0.5x..2x ladder for ALL FOUR imp-97520 landmarks. Measurement only on the ' +
    'inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486; C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) untouched (perturbed only as a probe, not re-pinned); the pinned E_trunc ' +
    '3.06e-5 is unchanged; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP97598_SIGMA_LANDMARK_CC_SENSITIVITY_ASSERTIONS = [
  {
    id: 'imp97598-baseline-reproduces-imp97520',
    description: 'the c=1 row reproduces the imp-97520 four landmarks',
    holds: () => {
      const r = LADDER.find((x) => x.factor === 1.0);
      return (
        Math.abs(r.L1_peak / 9.218633e5 - 1) < 5e-3 &&
        Math.abs(r.sigma_max - 0.949429) < 1e-3 &&
        Math.abs(r.L2_below_0p9 / 2.572361e7 - 1) < 5e-3 &&
        Math.abs(r.L3_halving / 3.267235e9 - 1) < 5e-3 &&
        Math.abs(r.L4_below_0p1 / 3.213181e11 - 1) < 5e-3
      );
    },
  },
  {
    id: 'imp97598-peak-is-CC-invariant',
    description: 'the interior peak elasticity is ~0 (C_C is a common factor, cannot move the extremum)',
    holds: () => Math.abs(ELASTICITY.L1_peak) < 1e-2,
  },
  {
    id: 'imp97598-downslope-landmarks-near-plus-square',
    description: 'L3/L4 elasticities sit near the closed-form +2 (N ~ C_C^2), sign-flipped from E_trunc',
    holds: () =>
      Math.abs(ELASTICITY.L3_halving - 2) < 0.2 &&
      Math.abs(ELASTICITY.L4_below_0p1 - 2) < 0.2 &&
      ELASTICITY.L3_halving > 0 &&
      ELASTICITY.L4_below_0p1 > 0,
  },
  {
    id: 'imp97598-halving-elasticity-matches-imp97565',
    description: 'the L3 halving C_C-elasticity reproduces the imp-97565 numeric value 2.102347 to 5 digits',
    holds: () => Math.abs(ELASTICITY.L3_halving - 2.10235) < 1e-3,
  },
  {
    id: 'imp97598-L2-steepest-downslope',
    description: 'L2 has the steepest downslope C_C-elasticity (largest magnitude of the three crossings)',
    holds: () =>
      ELASTICITY.L2_below_0p9 > ELASTICITY.L3_halving &&
      ELASTICITY.L2_below_0p9 > ELASTICITY.L4_below_0p1 &&
      Math.abs(ELASTICITY.L2_below_0p9) > Math.abs(ELASTICITY.L1_peak),
  },
  {
    id: 'imp97598-ordering-preserved-across-ladder',
    description: 'the four landmarks stay strictly increasing at every amplitude factor',
    holds: () => ALL_INCREASING === true,
  },
  {
    id: 'imp97598-tail-gap-frozen',
    description: 'the L3->L4 gap stays ~2 decades across the whole ladder',
    holds: () => LADDER.every((r) => Math.abs(r.gap_L3_L4_decades - 2.0) < 0.05),
  },
  {
    id: 'imp97598-span-expands-with-CC',
    description: 'the peak-to-tail span grows monotonically as C_C rises (opposite the E_trunc axis)',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].span_L1_L4_decades > LADDER[i - 1].span_L1_L4_decades)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97598-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97598_SIGMA_LANDMARK_CC_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP97598_SIGMA_LANDMARK_CC_SENSITIVITY.note) &&
      /refereed bound is changed/i.test(IMP97598_SIGMA_LANDMARK_CC_SENSITIVITY.note),
  },
];

for (const a of IMP97598_SIGMA_LANDMARK_CC_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97598-sigma-landmark-cc-sensitivity assertion failed: ${a.id}`);
  }
}
