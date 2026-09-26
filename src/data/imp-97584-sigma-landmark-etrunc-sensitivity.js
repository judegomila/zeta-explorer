/**
 * @module imp-97584-sigma-landmark-etrunc-sensitivity
 *
 * imp-97584 (numerical, sensitivity): imp-97520 tabulated the four sigma(N) =
 * E_coll/E_N landmarks as one object -- L1 interior PEAK (N ~ 9.22e5, sigma_max
 * ~ 0.9494), L2 DOWNSLOPE below 0.9 (N ~ 2.57e7), L3 HALVING sigma = 1/2
 * (N ~ 3.27e9), L4 below 0.1 (N ~ 3.21e11) -- all computed at the fixed
 * E_TRUNC_PT = 3.06e-5. imp-97565 measures the C_C sensitivity of only the
 * halving landmark. This LIGHT standalone module supplies the complementary
 * axis: the sensitivity of ALL FOUR landmarks to the E_trunc constant, sweeping
 * an E_trunc multiplier ladder (0.5x .. 2x) with the SAME inherited
 * imp-3406/imp-33582 sub-terms (no new model, no new constants).
 *
 * WHAT IS MEASURED
 * ----------------
 * For each multiplier m the four landmark N-values are recomputed by the exact
 * imp-97520 procedure (ternary-search peak, bisection downslope crossings) with
 * E_trunc replaced by m * E_TRUNC_PT. Reported per landmark: the log-log
 * elasticity d(ln N)/d(ln E_trunc) at m = 1 (central difference), and whether
 * the strictly-increasing ordering and the decade gaps are preserved across the
 * whole ladder.
 *
 * THE ELASTICITY RESULT (central difference at m = 1)
 * ---------------------------------------------------
 *   L1 peak      d ln N / d ln E_trunc ~ -1.373   (shallowest; peak location)
 *   L2 below-0.9 d ln N / d ln E_trunc ~ -2.304   (steepest)
 *   L3 halving   d ln N / d ln E_trunc ~ -2.098   (near the closed-form -2)
 *   L4 below-0.1 d ln N / d ln E_trunc ~ -2.079   (near the closed-form -2)
 *
 * The three downslope landmarks track the imp-33723 closed-form scaling
 * N_cross = (C_C/E_trunc)^2 log T0 (elasticity -2 to leading order); the halving
 * and tail landmarks sit within ~5% of -2, while L2 runs slightly steeper. The
 * interior peak L1 is the odd one out at ~ -1.37: the peak is a balance point of
 * the two competing terms rather than a crossover, so it moves more slowly.
 *
 * ORDERING / GAP PRESERVATION
 * ---------------------------
 * Across the entire 0.5x .. 2x ladder the four landmarks stay strictly
 * increasing (L1 < L2 < L3 < L4). The L3 -> L4 gap is essentially frozen at
 * ~1.99 decades; the L2 -> L3 gap widens mildly (2.06 -> 2.19) and the L1 -> L2
 * gap narrows (1.72 -> 1.15) as E_trunc grows, so the total peak-to-tail span
 * contracts from ~5.76 to ~5.34 decades. No landmark reordering occurs.
 *
 * MEASUREMENT ONLY. Same inherited imp-3220/imp-3406 surrogate component model,
 * NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8
 * ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc is perturbed only as a
 * sensitivity probe, the pinned 3.06e-5 value is unchanged; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the four-landmark object)
 * @see imp-97565 (C_C sensitivity of the halving landmark -- the complementary axis)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (N_cross ~ E_trunc^-2 closed form)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (F3 halving landmark)
 * @see imp-3406-sigma-highN-extrapolation (the inherited sigma(N) component model)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601 exactly

// EXACT imp-3406/imp-33582/imp-97520 sub-terms; E_trunc is the perturbed input.
function parts(N, Etrunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = Etrunc + E_flow + E_coll;
  return { sigma: E_coll / E_N };
}

// Interior peak of sigma(N): ternary search in log N (imp-97520 procedure).
function peakNlogN(lo, hi, Etrunc) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 400; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), Etrunc).sigma < parts(Math.exp(m2), Etrunc).sigma) a = m1;
    else b = m2;
  }
  return Math.exp((a + b) / 2);
}

// Downslope crossing where sigma first drops below target (imp-97520 procedure).
function crossBelow(target, lo, hi, Etrunc) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), Etrunc).sigma > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

function landmarks(Etrunc) {
  const L1 = peakNlogN(1e4, 1e8, Etrunc);
  const smax = parts(L1, Etrunc).sigma;
  const L2 = crossBelow(0.9, L1, 1e18, Etrunc);
  const L3 = crossBelow(0.5, L1, 1e18, Etrunc);
  const L4 = crossBelow(0.1, L1, 1e18, Etrunc);
  return { L1, smax, L2, L3, L4 };
}

const MULTIPLIERS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const log10 = (x) => Math.log10(x);

const LADDER = MULTIPLIERS.map((m) => {
  const lm = landmarks(m * E_TRUNC_PT);
  return {
    mult: m,
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

// Log-log elasticity d(ln N)/d(ln E_trunc) at m = 1 by central difference.
const EPS = 0.01;
const UP = landmarks((1 + EPS) * E_TRUNC_PT);
const DN = landmarks((1 - EPS) * E_TRUNC_PT);
const D_LN_ET = Math.log(1 + EPS) - Math.log(1 - EPS);
const elasticity = (key) => +((Math.log(UP[key]) - Math.log(DN[key])) / D_LN_ET).toFixed(4);
const ELASTICITY = {
  L1_peak: elasticity('L1'), // ~ -1.373
  L2_below_0p9: elasticity('L2'), // ~ -2.304
  L3_halving: elasticity('L3'), // ~ -2.098
  L4_below_0p1: elasticity('L4'), // ~ -2.079
};

const ALL_INCREASING = LADDER.every((r) => r.strictly_increasing === true);

export const IMP97584_SIGMA_LANDMARK_ETRUNC_SENSITIVITY = {
  id: 'imp-97584',
  proofSection: 'S-frontier',
  title:
    'Measure the E_trunc sensitivity of the imp-97520 four sigma(N) landmarks (peak, below-0.9, ' +
    'halving, below-0.1) across a 0.5x..2x multiplier ladder -- per-landmark elasticity and ' +
    'ordering/gap preservation, complementing the imp-97565 C_C axis',
  isRigorous: false,
  baseline: { E_TRUNC_PT, multipliers: MULTIPLIERS },
  model:
    'sigma(N) = E_coll / (E_trunc + E_flow + E_coll) with the exact inherited imp-3406/imp-33582 ' +
    'sub-terms; E_trunc scaled by a multiplier as a sensitivity probe (pinned 3.06e-5 unchanged).',
  ladder: LADDER,
  elasticity: ELASTICITY,
  orderingPreserved: ALL_INCREASING,
  finding:
    'The three downslope landmarks track the imp-33723 closed-form N ~ E_trunc^-2 scaling ' +
    '(L3 halving ~ -2.098, L4 tail ~ -2.079, within ~5% of -2; L2 slightly steeper at ~ -2.304). ' +
    'The interior peak L1 is the exception at ~ -1.373: it is a balance point of the two competing ' +
    'terms, not a crossover, so it shifts more slowly. Across the full 0.5x..2x ladder the four ' +
    'landmarks stay strictly increasing; the L3->L4 gap is frozen at ~1.99 decades while the total ' +
    'peak-to-tail span contracts from ~5.76 to ~5.34 decades. No reordering occurs.',
  note:
    'Complementary sensitivity axis to imp-97565 (which perturbs C_C for the halving landmark only): ' +
    'here E_trunc is perturbed across a 0.5x..2x ladder for ALL FOUR imp-97520 landmarks. Measurement ' +
    'only on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486; C_C 1/8 ' +
    'ansatz untouched; the pinned E_trunc 3.06e-5 is unchanged; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
};

export const IMP97584_SIGMA_LANDMARK_ETRUNC_SENSITIVITY_ASSERTIONS = [
  {
    id: 'imp97584-baseline-reproduces-imp97520',
    description: 'the m=1 row reproduces the imp-97520 four landmarks',
    holds: () => {
      const r = LADDER.find((x) => x.mult === 1.0);
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
    id: 'imp97584-downslope-landmarks-near-inverse-square',
    description: 'L3/L4 elasticities sit near the closed-form -2 (N ~ E_trunc^-2)',
    holds: () =>
      Math.abs(ELASTICITY.L3_halving + 2) < 0.2 && Math.abs(ELASTICITY.L4_below_0p1 + 2) < 0.2,
  },
  {
    id: 'imp97584-peak-shallower-than-downslope',
    description: 'the interior peak elasticity is shallower (smaller magnitude) than the downslope ones',
    holds: () =>
      Math.abs(ELASTICITY.L1_peak) < Math.abs(ELASTICITY.L3_halving) &&
      Math.abs(ELASTICITY.L1_peak) < Math.abs(ELASTICITY.L2_below_0p9) &&
      ELASTICITY.L1_peak < 0,
  },
  {
    id: 'imp97584-ordering-preserved-across-ladder',
    description: 'the four landmarks stay strictly increasing at every multiplier',
    holds: () => ALL_INCREASING === true,
  },
  {
    id: 'imp97584-tail-gap-frozen',
    description: 'the L3->L4 gap stays ~2 decades across the whole ladder',
    holds: () => LADDER.every((r) => Math.abs(r.gap_L3_L4_decades - 2.0) < 0.05),
  },
  {
    id: 'imp97584-span-contracts-with-etrunc',
    description: 'the peak-to-tail span shrinks monotonically as E_trunc grows',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].span_L1_L4_decades < LADDER[i - 1].span_L1_L4_decades)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97584-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97584_SIGMA_LANDMARK_ETRUNC_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP97584_SIGMA_LANDMARK_ETRUNC_SENSITIVITY.note) &&
      /remains SOTA/.test(IMP97584_SIGMA_LANDMARK_ETRUNC_SENSITIVITY.note),
  },
];

for (const a of IMP97584_SIGMA_LANDMARK_ETRUNC_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97584-sigma-landmark-etrunc-sensitivity assertion failed: ${a.id}`);
  }
}
