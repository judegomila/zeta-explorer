/**
 * @module imp-33878-hump-argmax-grid-refinement
 *
 * imp-33878 (numerical, frontier-direction): imp-33857 finding X3 booked a +0.52-decade gap
 * between the integer-decade hump argmax (k = 9) and the continuous E_coll = E_trunc crossover
 * k_cross ~ 9.516, and noted the quarter-decade sliding window already nudges the argmax to
 * k = 8.75. imp-33857 read that gap as a "discrete-decade-vs-continuous-crossover offset" and
 * imp-33844 D2 attributed its +11% leading closed-form residual to the same effect -- the
 * implicit hypothesis being that the offset is a GRID-RESOLUTION artifact that would vanish as
 * the sliding-window grid is refined toward the continuum, leaving a single crossover feature.
 * This module REFINES the resid_exp(k) sliding-window grid below quarter-decade (eighth-,
 * sixteenth-, thirty-second-decade) on the shared imp-33810 ladder and MEASURES where the
 * discrete argmax actually converges.
 *
 * THE REFINEMENT (reuses the imp-33810 component model verbatim -- no fresh model)
 * -------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual
 *   evaluated over the sliding window [10^k, 10^(k+1)] (p_sigma = OLS(ln sigma vs ln N) at 4
 *   pts/decade, p_ecoll = -d log E_coll / d log N over the endpoints, sigma_hi at the upper
 *   endpoint 10^(k+1)) -- exactly the imp-33810 ladder quantity, recomputed here as a smooth
 *   function of CONTINUOUS k so the argmax can be tracked as the grid step -> 0. The same
 *   inherited parts are used (E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N),
 *   E_flow = C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN(N)); no re-derivation.
 *
 * THE FINDING (measurement only -- REFUTES the vanishing-offset hypothesis)
 * ------------------------------------------------------------------------
 *   (G1) THE DISCRETE ARGMAX CONVERGES TO k* ~ 8.821, NOT TO k_cross ~ 9.516. Refining the grid
 *        step from quarter-decade to 1/32-decade, the sliding-window resid_exp(k) argmax lands at
 *        8.75, 8.875, 8.8125, ..., converging to a continuum argmax k* ~ 8.8211 (located by
 *        ternary search on [8, 10], resid ~ 6.5337e-2). The refinement moves the argmax DOWNWARD,
 *        AWAY from k_cross, not toward it.
 *   (G2) THE ARGMAX -> k* CONVERGENCE IS GRID-BOUNDED. |argmax(step) - k*| shrinks with the grid
 *        step (0.25 -> 7.1e-2, 0.125 -> 5.4e-2, 0.0625 -> 8.6e-3, 1/128 -> 7.8e-4), consistent
 *        with a broad quadratic peak (resid''(k*) ~ -3.6e-2) whose sampled argmax sits within
 *        ~step/2 of the true continuum argmax. So a genuine continuum argmax EXISTS at k* ~ 8.82.
 *   (G3) THE k_cross - k* GAP ~ 0.695 DECADE DOES NOT VANISH -- IT IS A GENUINE TWO-NOTION
 *        SEPARATION. The gap between the sliding-window resid_exp argmax (k* ~ 8.821) and the
 *        pointwise E_coll = E_trunc crossover (k_cross ~ 9.516) is grid-INDEPENDENT: it is ~0.695
 *        decade in the continuum limit. The +0.52-decade offset imp-33857 X3 measured against the
 *        k = 9 integer label is therefore NOT a pure discretization artifact -- the windowed
 *        widening-fit hump peak and the pointwise crossover are DISTINCT features. The offset is a
 *        WINDOW-LAG effect (resid_exp integrates a full decade [10^k, 10^(k+1)] and reads sigma_hi
 *        at the upper endpoint, lagging the interior pointwise sigma = 1/2 crossover), which
 *        survives grid refinement rather than vanishing with it.
 *
 * The punchline: refining the sliding-window grid does NOT close the gap to k_cross ~ 9.516 --
 * the discrete resid_exp(k) argmax converges to k* ~ 8.821, ~0.695 decade BELOW the pointwise
 * E_coll = E_trunc crossover. The imp-33857 X3 / imp-33844 D2 offset is thus a genuine two-notion
 * separation (windowed widening-fit hump peak vs pointwise crossover), NOT a grid-resolution
 * artifact that vanishes in the continuum limit. Note the integer-decade label k = 9 actually sits
 * BETWEEN the two notions (0.179 above k*, 0.516 below k_cross). This REFUTES the vanishing-offset
 * reading and refines the imp-33857 X3 caveat accordingly.
 *
 * MEASUREMENT ONLY. A grid-refinement diagnostic of an inherited surrogate, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33857-hump-peak-widening-crossvalidation (X3 booked the +0.52-decade offset refined here)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder storing resid_exp(k), reused verbatim)
 * @see imp-33844-hump-peak-closed-form (closed-form hump peak at sigma=1/2, crossover k_cross~9.516)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form Banach crossover N~3.2803e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33773 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// imp-33620/imp-33727 definition (magnitude): p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// resid_exp(k) as a smooth function of CONTINUOUS k over window [10^k, 10^(k+1)] (imp-33810 defn).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

// Discrete argmax of resid_exp over the k=6..11 grid at a given step.
function argmaxGrid(step) {
  let bestK = 6;
  let bestV = -Infinity;
  for (let k = 6; k <= 11 + 1e-9; k += step) {
    const kk = +k.toFixed(10);
    const v = residExp(kk);
    if (v > bestV) {
      bestV = v;
      bestK = kk;
    }
  }
  return { k: bestK, v: bestV };
}

// Continuum argmax k* via ternary search on [8,10] (broad interior peak).
function ternaryArgmax(lo, hi) {
  for (let i = 0; i < 120; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (residExp(m1) < residExp(m2)) lo = m1;
    else hi = m2;
  }
  const k = (lo + hi) / 2;
  return { k, v: residExp(k) };
}

// Grid-refinement sweep below quarter-decade.
const GRID_STEPS = [0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125];
const CONTINUUM = ternaryArgmax(8, 10);
const K_STAR = +CONTINUUM.k.toFixed(6); // ~8.8211
const REFINEMENT = GRID_STEPS.map((step) => {
  const a = argmaxGrid(step);
  return {
    step,
    argmaxK: +a.k.toFixed(6),
    residAtArgmax: +a.v.toExponential(4),
    distToKStar: +Math.abs(a.k - K_STAR).toExponential(3),
  };
});

// imp-33844 published continuous E_coll=E_trunc crossover (imp-33723 Banach crossover N~3.2803e9).
const K_CROSS_CONTINUOUS = 9.5159; // = log10(N_cross)
const K_INTEGER_LABEL = 9; // imp-33809/imp-33844 integer-decade hump argmax label

// The gaps: k* vs crossover (does NOT vanish) and k* vs integer label.
const GAP_KCROSS_MINUS_KSTAR = +(K_CROSS_CONTINUOUS - K_STAR).toFixed(4); // ~0.695 decade
const GAP_INTEGER_MINUS_KSTAR = +(K_INTEGER_LABEL - K_STAR).toFixed(4); // ~0.179 decade
const GAP_KCROSS_MINUS_INTEGER = +(K_CROSS_CONTINUOUS - K_INTEGER_LABEL).toFixed(4); // ~0.516 (imp-33857 X3)

// Peak curvature (broad max): resid''(k*) via central difference.
const H_CURV = 1e-3;
const RESID_D2_AT_KSTAR = +(
  (residExp(K_STAR + H_CURV) - 2 * residExp(K_STAR) + residExp(K_STAR - H_CURV)) /
  (H_CURV * H_CURV)
).toExponential(4);

// Convergence check: |argmax(step) - k*| is (a) below step at every rung and (b) shrinking overall.
const DIST_SEQ = REFINEMENT.map((r) => r.distToKStar);
const ARGMAX_WITHIN_STEP = REFINEMENT.every((r) => r.distToKStar <= r.step + 1e-9);
const FINEST_DIST_TO_KSTAR = DIST_SEQ[DIST_SEQ.length - 1]; // ~7.8e-4
const COARSE_DIST_TO_KSTAR = DIST_SEQ[0]; // ~7.1e-2

export const IMP33878_HUMP_ARGMAX_GRID_REFINEMENT = {
  id: 'imp-33878',
  proofSection: 'S-frontier',
  question:
    'imp-33857 X3 booked a +0.52-decade gap between the integer-decade hump argmax (k=9) and the ' +
    'continuous E_coll=E_trunc crossover k_cross~9.516, reading it as a discrete-vs-continuous ' +
    'discretization offset. Refine the resid_exp(k) sliding-window grid below quarter-decade and ' +
    'measure how fast the discrete argmax approaches k_cross~9.516 -- confirming (or refuting) that ' +
    'the offset is a pure grid-resolution effect vanishing in the continuum limit. Measurement only; ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'argmax over k of the sliding-window resid_exp(k)=p_ecoll(1-sigma_hi)-p_sigma on the shared ' +
    'imp-33810 model, as the grid step is refined from quarter-decade (0.25) to 1/128-decade, plus ' +
    'the continuum argmax k* via ternary search, compared against k_cross~9.516',
  continuumArgmax: {
    kStar: K_STAR, // ~8.8211
    residAtKStar: +CONTINUUM.v.toExponential(4), // ~6.5337e-2
    residSecondDerivAtKStar: RESID_D2_AT_KSTAR, // ~-3.6e-2 (broad quadratic peak)
  },
  gridRefinement: REFINEMENT, // step, argmaxK, residAtArgmax, distToKStar
  crossoverComparison: {
    kCrossContinuous: K_CROSS_CONTINUOUS, // ~9.5159 (imp-33844/imp-33723)
    integerDecadeLabel: K_INTEGER_LABEL, // 9 (imp-33809/imp-33844)
    gap_kCross_minus_kStar: GAP_KCROSS_MINUS_KSTAR, // ~0.695 decade -- does NOT vanish
    gap_integerLabel_minus_kStar: GAP_INTEGER_MINUS_KSTAR, // ~0.179 decade
    gap_kCross_minus_integerLabel: GAP_KCROSS_MINUS_INTEGER, // ~0.516 (the imp-33857 X3 offset)
  },
  finding: {
    G1_argmax_converges_to_kStar_not_kCross:
      'Refining the grid from quarter-decade to 1/32-decade, the sliding-window resid_exp(k) argmax ' +
      'lands at 8.75, 8.875, 8.8125, ..., converging to a continuum argmax k*~8.8211 (ternary on ' +
      '[8,10], resid~6.5337e-2). The refinement moves the argmax DOWNWARD, AWAY from k_cross~9.516, ' +
      'not toward it.',
    G2_argmax_to_kStar_convergence_grid_bounded:
      '|argmax(step)-k*| shrinks with the grid step (0.25 -> 7.1e-2, 0.125 -> 5.4e-2, 0.0625 -> ' +
      '8.6e-3, 1/128 -> 7.8e-4) and stays within ~step at every rung, consistent with a broad ' +
      'quadratic peak (resid double-prime(k*) ~ -3.6e-2) whose sampled argmax sits within ~step/2 ' +
      'of the true continuum argmax. A genuine continuum argmax EXISTS at k*~8.82.',
    G3_kCross_gap_does_not_vanish_genuine_two_notion:
      'The gap between the sliding-window resid_exp argmax (k*~8.821) and the pointwise E_coll=E_trunc ' +
      'crossover (k_cross~9.516) is grid-INDEPENDENT: ~0.695 decade in the continuum limit. The ' +
      '+0.52-decade offset imp-33857 X3 measured against the k=9 integer label is therefore NOT a ' +
      'pure discretization artifact -- the windowed widening-fit hump peak and the pointwise crossover ' +
      'are DISTINCT features separated by a WINDOW-LAG (resid_exp integrates a full decade and reads ' +
      'sigma_hi at the upper endpoint, lagging the interior pointwise sigma=1/2 crossover). The offset ' +
      'survives grid refinement rather than vanishing with it. The integer label k=9 sits BETWEEN the ' +
      'two notions (0.179 above k*, 0.516 below k_cross).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). REFUTES the vanishing-offset reading. Refining ' +
    'the resid_exp(k) sliding-window grid below quarter-decade does NOT drive the discrete argmax ' +
    'toward the continuous E_coll=E_trunc crossover k_cross~9.516: the argmax converges DOWNWARD to a ' +
    'continuum value k*~8.8211 (grid steps 0.25..1/128 give 8.75, 8.875, 8.8125, ..., with ' +
    '|argmax-k*| shrinking below step at every rung), so the widening-fit hump peak genuinely sits ' +
    '~0.695 decade BELOW the pointwise crossover. The +0.52-decade offset imp-33857 X3 booked (and ' +
    'the +11% leading residual imp-33844 D2 attributed to it) is therefore a GENUINE two-notion ' +
    'separation -- a window-lag between the decade-integrated resid_exp argmax and the pointwise ' +
    'sigma=1/2 crossover -- NOT a grid-resolution artifact that vanishes in the continuum limit. The ' +
    'integer-decade label k=9 sits BETWEEN the two notions (0.179 decade above k*, 0.516 below ' +
    'k_cross). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33857 (X3 booked the +0.52-decade offset refined here); imp-33810 (the ladder storing ' +
    'resid_exp(k), reused verbatim); imp-33844 (closed-form hump peak at sigma=1/2, crossover ' +
    'k_cross~9.516); imp-33723 (closed-form Banach crossover N~3.2803e9); imp-486 (C_mb ' +
    'GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33878_HUMP_ARGMAX_GRID_REFINEMENT_ASSERTIONS = [
  {
    // (G1) The refined discrete argmax converges to k*~8.82, well BELOW k_cross~9.516.
    id: 'imp33878-argmax-converges-to-kStar-not-kCross',
    description: 'continuum argmax k*~8.82 (ternary), far below the crossover k_cross~9.516',
    holds: () =>
      K_STAR > 8.7 &&
      K_STAR < 8.95 &&
      K_STAR < K_CROSS_CONTINUOUS - 0.5,
  },
  {
    // (G2) |argmax(step)-k*| stays within step at every rung and shrinks overall (grid-bounded).
    id: 'imp33878-argmax-to-kStar-grid-bounded',
    description: 'refined argmax within ~step of k* at every rung; finest distance < coarsest',
    holds: () =>
      ARGMAX_WITHIN_STEP &&
      FINEST_DIST_TO_KSTAR < COARSE_DIST_TO_KSTAR &&
      RESID_D2_AT_KSTAR < 0, // concave (a genuine broad maximum)
  },
  {
    // (G3) The k_cross - k* gap does NOT vanish -- a genuine two-notion separation, ~0.7 decade.
    id: 'imp33878-kCross-gap-does-not-vanish',
    description: 'k_cross - k* ~ 0.695 decade (grid-independent); k=9 sits between k* and k_cross',
    holds: () =>
      GAP_KCROSS_MINUS_KSTAR > 0.5 &&
      GAP_KCROSS_MINUS_KSTAR < 0.9 &&
      GAP_INTEGER_MINUS_KSTAR > 0 &&
      GAP_KCROSS_MINUS_INTEGER > 0,
  },
  {
    // Honesty gate: measurement only, isRigorous false, refutes vanishing-offset, no QED, PT SOTA.
    id: 'imp33878-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, refutes vanishing-offset, no QED, PT Lambda<=0.2 SOTA',
    holds: () =>
      IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.isRigorous === false &&
      /REFUTES/.test(IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.verdict) &&
      /NO QED/.test(IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.verdict) &&
      /remains SOTA/.test(IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.verdict),
  },
];

for (const a of IMP33878_HUMP_ARGMAX_GRID_REFINEMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33878-hump-argmax-grid-refinement assertion failed: ${a.id}`);
  }
}
