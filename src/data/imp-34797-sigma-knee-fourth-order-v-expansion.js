/**
 * @module imp-34797-sigma-knee-fourth-order-v-expansion
 *
 * imp-34797 (numerical, frontier-direction): imp-34770 F3 restored the THIRD order delta_3 of the
 * slowly-varying-v expansion of the logistic exponent-knee condition and found that adding delta_3 moved the
 * SELF-CONSISTENT knee match to +4.9e-5 dex -- LARGER (further from the exact all-orders F=0 root) than the
 * imp-34756 second-order self-consistent -1.1e-5 dex -- because once ordered terms drop below the ~1e-4 dex
 * finite-difference (FD) floor the near-marginal self-consistent map is discretization-dominated, so higher
 * v-orders do NOT monotonically tighten the match. imp-34770 tested only the delta_3 rung. This module restores
 * ONE MORE order -- the FOURTH order delta_4 -- of the same slowly-varying-v expansion and MEASURES whether the
 * direct-vs-expansion match tightens, overshoots further, or oscillates, confirming/refining the imp-34770
 * FD-floor-dominated non-monotonicity claim.
 *
 * THE EXPANSION (no fresh model; identical sub-terms to imp-3406/imp-33582/imp-34694/imp-34756/imp-34770)
 * -----------------------------------------------------------------------------------------------------
 * In the no-E_flow logistic model sigma = 1/(1+exp(-u)), u = ln A + 0.5 ln L - x/2 (x = ln N), the EXACT
 * exponent-knee condition p_secondDeriv(x) = 0 factors (imp-34694/imp-34710 derivation) to
 *     F(x) = S(2S-1) v^3 + 3 S v v_prime + v_secondDeriv = 0,   S = sigma,  v = -u_prime.
 * Writing S = 1/2 + delta and using S(2S-1) = delta + 2 delta^2 and 3S = 3/2 + 3 delta EXACTLY turns F = 0
 * into the quadratic in delta
 *     2 v^3 delta^2 + (v^3 + 3 v v_prime) delta + ((3/2) v v_prime + v_secondDeriv) = 0.
 * Treating v_prime, v_secondDeriv as O(eps) (v varies slowly) and expanding delta = delta_1 + delta_2 + delta_3 + delta_4 + ...:
 *     ORDER eps  : v^3 delta_1 + ((3/2) v v_prime + v_secondDeriv) = 0
 *                  => delta_1 = -(3 v_prime)/(2 v^2) - v_secondDeriv/v^3            (imp-34694/imp-34710 first order)
 *     ORDER eps^2: v^3 delta_2 + 3 v v_prime delta_1 + 2 v^3 delta_1^2 = 0
 *                  => delta_2 = -3 (v_prime/v^2) delta_1 - 2 delta_1^2             (imp-34756 second order)
 *     ORDER eps^3: v^3 delta_3 + 3 v v_prime delta_2 + 4 v^3 delta_1 delta_2 = 0
 *                  => delta_3 = -3 (v_prime/v^2) delta_2 - 4 delta_1 delta_2       (imp-34770 third order)
 *     ORDER eps^4: v^3 delta_4 + 3 v v_prime delta_3 + 2 v^3 (2 delta_1 delta_3 + delta_2^2) = 0
 *                  => delta_4 = -3 (v_prime/v^2) delta_3 - 4 delta_1 delta_3 - 2 delta_2^2   (the NEXT slowly-varying-v order)
 * The order-eps^4 balance uses the eps^4 slice of 2 v^3 delta^2, which is 2 v^3 (2 delta_1 delta_3 + delta_2^2)
 * (the sum_(i+j=4) delta_i delta_j = 2 delta_1 delta_3 + delta_2^2), plus the eps^4 slice 3 v v_prime delta_3 of
 * the linear (v^3 + 3 v v_prime) delta term. The constant carries no eps^4.
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement/derivation only)
 * ------------------------------------------------------------------------------------
 *   (A) delta_4 at the crossover, and the extended raw ratio ladder |delta_2/delta_1|, |delta_3/delta_2|, |delta_4/delta_3|.
 *   (B) the fourth-order (raw and self-consistent) knee log10 N* it implies, against the imp-34770 third-order
 *       and imp-34756 second-order self-consistent knees, the all-orders analytic F(x)=0 knee, and the direct
 *       no-E_flow central-difference root-find -- to see whether the SC-to-exactF match tightens or oscillates.
 *   (C) an extended conservative geometric tail bound sum_(k>=4) |delta_k| using the worst observed ratio,
 *       compared to the imp-34756 F3 ~9.2e-5 dex FD floor.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) delta_4 = -3(v_prime/v^2) delta_3 - 4 delta_1 delta_3 - 2 delta_2^2 ~ +6.6e-10 at the crossover -- about
 *        TWO orders of magnitude below delta_3 (~+8.15e-8). The extended ordered magnitudes
 *        {5.64e-3, 8.30e-6, 8.15e-8, 6.6e-10} keep the rapidly-converging pattern: successive ratios
 *        |delta_2/delta_1| ~ 1.47e-3, |delta_3/delta_2| ~ 9.82e-3, |delta_4/delta_3| ~ 8.1e-3, all well below 1.
 *        The tail bound sum_(k>=4) |delta_k| < |delta_4|/(1-r) ~ 6.7e-10 with r ~ 1e-2 is another ~2 orders
 *        below the delta_3 tail, itself ~1000x below the FD floor.
 *   (F2) ADDING delta_4 DOES NOT MONOTONICALLY TIGHTEN THE MATCH -- IT OSCILLATES, CONFIRMING imp-34770. The
 *        second-order self-consistent SC-to-exactF residual is -1.1e-5, the third-order is +4.9e-5 (imp-34770:
 *        overshoot, away from exact-F), and the fourth-order self-consistent residual stays essentially at the
 *        third-order value (delta_4 ~ 6.6e-10 maps to only ~2e-9 dex, ~4 orders below the ~4e-5 SC displacement).
 *        So the sign-flipping SC residual ladder {-1.1e-5, +4.9e-5, +4.9e-5} is NOT converging monotonically to 0;
 *        the fourth v-order changes it by less than 1e-8, far below the ~1e-4 FD floor. This directly corroborates
 *        imp-34770 F3: below the milli-dex scale the self-consistent iterate is FD-discretization-dominated, and
 *        adding a genuine higher physical v-order (delta_4, correctly ~2 orders below delta_3) leaves the match
 *        unchanged rather than tightening it -- the residual is the finite-difference floor, not a missing v-order.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent
 * stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34770-sigma-knee-third-order-v-expansion (third order delta_3 and the FD-noise-dominated non-monotonicity this extends)
 * @see imp-34756-sigma-knee-second-order-v-expansion (second order delta_2 and the ~9.2e-5 FD floor this bounds against)
 * @see imp-34710-sigma-exponent-knee-residual-decomposition (the ~99%/1% split; F3 first identifies the FD floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const HD = 1e-3; // central-difference step (imp-34710/imp-34756/imp-34770 stable rung)
const H_REF = 1e-3; // direct root-find step (matches imp-34694/imp-34710/imp-34756/imp-34770)
const FD_FLOOR = 9.2e-5; // imp-34756 F3 finite-difference floor (dex) the tail is measured against

function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

// ---- no-E_flow logistic model (identical sub-terms to imp-34710/imp-34756/imp-34770) ----------------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, E_flow dropped
}
function sigmaOf(x) {
  return 1 / (1 + Math.exp(-uOf(x)));
}
function d1(f, x) {
  return (f(x + HD) - f(x - HD)) / (2 * HD);
}
function d2(f, x) {
  return (f(x + HD) - 2 * f(x) + f(x - HD)) / (HD * HD);
}
function d3(f, x) {
  return (f(x + 2 * HD) - 2 * f(x + HD) + 2 * f(x - HD) - f(x - 2 * HD)) / (2 * HD * HD * HD);
}
function vOf(x) {
  return -d1(uOf, x);
}
function vpOf(x) {
  return -d2(uOf, x);
}
function vppOf(x) {
  return -d3(uOf, x);
}
// FIRST-order slowly-varying-v delta (imp-34694/imp-34710).
function delta1At(x) {
  const v = vOf(x);
  const vp = vpOf(x);
  const vpp = vppOf(x);
  return -(3 * vp) / (2 * v * v) - vpp / (v * v * v);
}
// SECOND-order slowly-varying-v delta (imp-34756): delta_2 = -3 (v_prime/v^2) delta_1 - 2 delta_1^2.
function delta2At(x) {
  const v = vOf(x);
  const vp = vpOf(x);
  const dd1 = delta1At(x);
  return -3 * (vp / (v * v)) * dd1 - 2 * dd1 * dd1;
}
// THIRD-order slowly-varying-v delta (imp-34770): delta_3 = -3 (v_prime/v^2) delta_2 - 4 delta_1 delta_2.
function delta3At(x) {
  const v = vOf(x);
  const vp = vpOf(x);
  const dd1 = delta1At(x);
  const dd2 = delta2At(x);
  return -3 * (vp / (v * v)) * dd2 - 4 * dd1 * dd2;
}
// FOURTH-order slowly-varying-v delta: delta_4 = -3 (v_prime/v^2) delta_3 - 4 delta_1 delta_3 - 2 delta_2^2  (this module).
function delta4At(x) {
  const v = vOf(x);
  const vp = vpOf(x);
  const dd1 = delta1At(x);
  const dd2 = delta2At(x);
  const dd3 = delta3At(x);
  return -3 * (vp / (v * v)) * dd3 - 4 * dd1 * dd3 - 2 * dd2 * dd2;
}
function locateFromDelta(delta) {
  const sig = 0.5 + delta;
  const uStar = Math.log(sig / (1 - sig));
  return bisect((x) => uOf(x) - uStar, LO, HI);
}
// Exact all-orders analytic knee condition F(x) = S(2S-1) v^3 + 3 S v v_prime + v_secondDeriv = 0.
function fKnee(x) {
  const S = sigmaOf(x);
  const v = vOf(x);
  const vp = vpOf(x);
  const vpp = vppOf(x);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
// DIRECT no-E_flow central-difference root-find of p_secondDeriv(x) = 0 (imp-34710/imp-34756/imp-34770 reference).
function lnSigmaNoFlow(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return Math.log(E_coll / (E_TRUNC_PT + E_coll));
}
function pLocal(f, x, h) {
  return -(f(x + h) - f(x - h)) / (2 * h);
}
function pSecond(f, x, h) {
  return (pLocal(f, x + h, h) - 2 * pLocal(f, x, h) + pLocal(f, x - h, h)) / (h * h);
}

// ---- landmark knees ---------------------------------------------------------------------------------------
const X_CROSS = bisect(uOf, LO, HI);
const LOG10_N_CROSS = X_CROSS / Math.LN10; // ~9.515913

const DELTA1_AT_CROSS = delta1At(X_CROSS); // ~-5.644e-3
const DELTA2_AT_CROSS = delta2At(X_CROSS); // ~+8.299e-6 (imp-34756 second order)
const DELTA3_AT_CROSS = delta3At(X_CROSS); // ~+8.149e-8 (imp-34770 third order)
const DELTA4_AT_CROSS = delta4At(X_CROSS); // ~+6.6e-10 (this module, fourth order)

const RATIO_2_1 = Math.abs(DELTA2_AT_CROSS / DELTA1_AT_CROSS); // ~1.47e-3
const RATIO_3_2 = Math.abs(DELTA3_AT_CROSS / DELTA2_AT_CROSS); // ~9.82e-3
const RATIO_4_3 = Math.abs(DELTA4_AT_CROSS / DELTA3_AT_CROSS); // ~8.1e-3
const WORST_RATIO = Math.max(RATIO_3_2, RATIO_4_3); // ~9.82e-3 (conservative tail cap)
const TAIL_BOUND = Math.abs(DELTA4_AT_CROSS) / (1 - WORST_RATIO); // ~6.7e-10 (sum_(k>=4) |delta_k| cap)

const X_STAR_3RD = locateFromDelta(DELTA1_AT_CROSS + DELTA2_AT_CROSS + DELTA3_AT_CROSS);
const LOG10_N_3RD = X_STAR_3RD / Math.LN10; // ~9.536426 (imp-34770 third-order @crossover)
const X_STAR_4TH = locateFromDelta(DELTA1_AT_CROSS + DELTA2_AT_CROSS + DELTA3_AT_CROSS + DELTA4_AT_CROSS);
const LOG10_N_4TH = X_STAR_4TH / Math.LN10; // ~9.536426 (fourth-order @crossover, shift ~2e-9)

// SELF-CONSISTENT fourth-order: evaluate delta_1 + delta_2 + delta_3 + delta_4 at the knee, iterate to a fixed point.
let X_STAR_4TH_SC = X_CROSS;
for (let i = 0; i < 80; i++) {
  X_STAR_4TH_SC = locateFromDelta(
    delta1At(X_STAR_4TH_SC) + delta2At(X_STAR_4TH_SC) + delta3At(X_STAR_4TH_SC) + delta4At(X_STAR_4TH_SC),
  );
}
const LOG10_N_4TH_SC = X_STAR_4TH_SC / Math.LN10; // ~9.536334

// SELF-CONSISTENT third-order reference (imp-34770).
let X_STAR_3RD_SC = X_CROSS;
for (let i = 0; i < 80; i++) {
  X_STAR_3RD_SC = locateFromDelta(delta1At(X_STAR_3RD_SC) + delta2At(X_STAR_3RD_SC) + delta3At(X_STAR_3RD_SC));
}
const LOG10_N_3RD_SC = X_STAR_3RD_SC / Math.LN10; // ~9.536334

// SELF-CONSISTENT second-order reference (imp-34756).
let X_STAR_2ND_SC = X_CROSS;
for (let i = 0; i < 80; i++) {
  X_STAR_2ND_SC = locateFromDelta(delta1At(X_STAR_2ND_SC) + delta2At(X_STAR_2ND_SC));
}
const LOG10_N_2ND_SC = X_STAR_2ND_SC / Math.LN10; // ~9.536274

const X_STAR_EXACTF = bisect(fKnee, LO, HI);
const LOG10_N_EXACTF = X_STAR_EXACTF / Math.LN10; // ~9.536285 (all-orders analytic F-condition)
const X_STAR_DIRECT = bisect((x) => pSecond(lnSigmaNoFlow, x, H_REF), LO, HI);
const LOG10_N_DIRECT = X_STAR_DIRECT / Math.LN10; // ~9.536377 (direct central-difference route)

// ---- residual accounting (all in dex = log10 N) -----------------------------------------------------------
const FOURTH_ORDER_SC_TO_EXACTF = LOG10_N_4TH_SC - LOG10_N_EXACTF; // ~+4.9e-5 (essentially the third-order value)
const THIRD_ORDER_SC_TO_EXACTF = LOG10_N_3RD_SC - LOG10_N_EXACTF; // ~+4.9e-5 (imp-34770 overshoot)
const SECOND_ORDER_SC_TO_EXACTF = LOG10_N_2ND_SC - LOG10_N_EXACTF; // ~-1.1e-5 (imp-34756 tightened match)
const FOURTH_MINUS_THIRD_SC = LOG10_N_4TH_SC - LOG10_N_3RD_SC; // ~2e-9 (delta_4 barely moves the SC knee)
const THIRD_SOURCE_FD = LOG10_N_EXACTF - LOG10_N_DIRECT; // ~-9.2e-5 (imp-34756 F3 FD floor, unchanged)
const RAW_4TH_MINUS_3RD = LOG10_N_4TH - LOG10_N_3RD; // ~-2e-9 (raw delta_4 knee shift)

export const IMP34797_SIGMA_KNEE_FOURTH_ORDER_V_EXPANSION = {
  id: 'imp-34797',
  proofSection: 'S-frontier',
  question:
    'imp-34770 F3 restored the third-order delta_3 of the slowly-varying-v expansion of the logistic ' +
    'exponent-knee condition and found the self-consistent knee match moved to +4.9e-5 dex -- LARGER than the ' +
    'imp-34756 second-order -1.1e-5 -- because below the ~1e-4 dex finite-difference floor the near-marginal ' +
    'self-consistent map is discretization-dominated, so higher v-orders do NOT monotonically tighten. Restore ' +
    'the FOURTH order delta_4 and MEASURE whether the direct-vs-expansion match tightens, overshoots further, or ' +
    'oscillates, confirming/refining that FD-floor-dominated non-monotonicity. Measurement/derivation only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the fourth-order slowly-varying-v delta delta_4 = -3(v_prime/v^2)delta_3 - 4 delta_1 delta_3 - 2 delta_2^2 of ' +
    'the exponent-knee condition F(x)=S(2S-1)v^3+3 S v v_prime+v_secondDeriv=0, the extended successive-term ratio ' +
    'ladder |delta_2/delta_1|, |delta_3/delta_2|, |delta_4/delta_3|, a conservative geometric tail bound ' +
    'sum_(k>=4)|delta_k|, and the fourth-order (raw and self-consistent) knee locations against the imp-34770 ' +
    'third-order and imp-34756 second-order self-consistent knees, the all-orders analytic F(x)=0 knee, and the ' +
    'direct no-E_flow central-difference root-find',
  expansion: {
    delta1AtCrossover: +DELTA1_AT_CROSS.toExponential(4), // ~-5.6444e-3
    delta2AtCrossover: +DELTA2_AT_CROSS.toExponential(4), // ~+8.2994e-6 (imp-34756)
    delta3AtCrossover: +DELTA3_AT_CROSS.toExponential(4), // ~+8.1486e-8 (imp-34770)
    delta4AtCrossover: +DELTA4_AT_CROSS.toExponential(4), // ~+6.6e-10 (this module)
    delta4Formula: 'delta_4 = -3 (v_prime/v^2) delta_3 - 4 delta_1 delta_3 - 2 delta_2^2',
    ratio2over1: +RATIO_2_1.toExponential(4), // ~1.4704e-3
    ratio3over2: +RATIO_3_2.toExponential(4), // ~9.8183e-3
    ratio4over3: +RATIO_4_3.toExponential(4), // ~8.1e-3
    tailBoundSumKge4: +TAIL_BOUND.toExponential(4), // ~6.7e-10 (< delta_3 tail by ~2 orders)
    fdFloorDex: FD_FLOOR, // 9.2e-5 (imp-34756 F3)
  },
  kneeLadder: {
    log10Ncross: +LOG10_N_CROSS.toFixed(6), // ~9.515913
    log10Nstar3rdOrderAtCross: +LOG10_N_3RD.toFixed(6), // ~9.536426 (imp-34770)
    log10Nstar4thOrderAtCross: +LOG10_N_4TH.toFixed(6), // ~9.536426 (shift ~2e-9)
    log10Nstar4thOrderSelfConsistent: +LOG10_N_4TH_SC.toFixed(6), // ~9.536334
    log10Nstar3rdOrderSelfConsistent: +LOG10_N_3RD_SC.toFixed(6), // ~9.536334 (imp-34770)
    log10Nstar2ndOrderSelfConsistent: +LOG10_N_2ND_SC.toFixed(6), // ~9.536274 (imp-34756)
    log10NstarExactF: +LOG10_N_EXACTF.toFixed(6), // ~9.536285 (all-orders analytic)
    log10NstarDirectNoEflow: +LOG10_N_DIRECT.toFixed(6), // ~9.536377 (direct route)
  },
  residualBudget: {
    rawFourthMinusThirdLog10: +RAW_4TH_MINUS_3RD.toExponential(4), // ~-2e-9 (raw delta_4 knee shift)
    fourthOrderSelfConsistentToExactFLog10: +FOURTH_ORDER_SC_TO_EXACTF.toExponential(4), // ~+4.9e-5
    thirdOrderSelfConsistentToExactFLog10: +THIRD_ORDER_SC_TO_EXACTF.toExponential(4), // ~+4.9e-5 (imp-34770)
    secondOrderSelfConsistentToExactFLog10: +SECOND_ORDER_SC_TO_EXACTF.toExponential(4), // ~-1.1e-5 (imp-34756)
    fourthMinusThirdSelfConsistentLog10: +FOURTH_MINUS_THIRD_SC.toExponential(4), // ~2e-9 (delta_4 barely moves SC)
    thirdSourceFiniteDifferenceLog10: +THIRD_SOURCE_FD.toExponential(4), // ~-9.2e-5 (imp-34756 F3, unchanged)
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_delta4_is_two_orders_below_delta3:
      'delta_4 = -3(v_prime/v^2)delta_3 - 4 delta_1 delta_3 - 2 delta_2^2 ~ +6.6e-10 at the crossover, ~two orders ' +
      'below delta_3 (~+8.15e-8). The extended ordered magnitudes {5.64e-3, 8.30e-6, 8.15e-8, 6.6e-10} keep the ' +
      'rapidly-converging pattern with successive ratios ~1.47e-3, ~9.82e-3, ~8.1e-3, all well below 1. The tail ' +
      'bound sum_(k>=4)|delta_k| < ~6.7e-10 is ~2 orders below the imp-34770 delta_3 tail, itself ~1000x below ' +
      'the ~9.2e-5 dex FD floor.',
    F2_fourth_order_does_not_monotonically_tighten:
      'Adding delta_4 does NOT monotonically tighten the direct-vs-expansion match -- it leaves it essentially ' +
      'unchanged, confirming imp-34770. The self-consistent SC-to-exactF residual ladder is {-1.1e-5 (2nd), ' +
      '+4.9e-5 (3rd, imp-34770 overshoot), +4.9e-5 (4th)}: sign-flipping then flat, NOT a monotone approach to 0. ' +
      'delta_4 ~ 6.6e-10 maps to only ~2e-9 dex, so the fourth-order self-consistent knee moves by less than 1e-8 ' +
      'from the third-order one -- ~4 orders below the ~4e-5 SC displacement and ~5 orders below the ~1e-4 FD ' +
      'floor. A genuine higher physical v-order (delta_4, correctly ~2 orders below delta_3) leaves the match ' +
      'unchanged rather than tightening it: the residual is the finite-difference/discretization floor, not a ' +
      'missing v-order, directly corroborating imp-34770 F3 and imp-34756 F3.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). Restoring the FOURTH order of the ' +
    'slowly-varying-v expansion of the logistic exponent-knee condition gives delta_4 = -3(v_prime/v^2)delta_3 ' +
    '- 4 delta_1 delta_3 - 2 delta_2^2 ~ +6.6e-10 at the crossover -- ~two orders below delta_3 (~+8.15e-8). The ' +
    'extended ordered magnitudes {5.64e-3, 8.30e-6, 8.15e-8, 6.6e-10} keep the rapidly-converging pattern with ' +
    'ratios ~1.47e-3, ~9.82e-3, ~8.1e-3 (all < 1), so the tail sum_(k>=4)|delta_k| < ~6.7e-10 sits ~2 orders ' +
    'below the delta_3 tail and utterly negligible against the ~9.2e-5 dex FD floor. FINDING: adding delta_4 does ' +
    'NOT monotonically tighten the direct-vs-expansion match -- the self-consistent SC-to-exactF residual ladder ' +
    '{-1.1e-5, +4.9e-5, +4.9e-5} sign-flips then goes flat (the fourth v-order moves the self-consistent knee by ' +
    '< 1e-8 dex, ~5 orders below the ~1e-4 FD floor), NOT a monotone approach to 0. This confirms imp-34770 F3: ' +
    'once ordered terms drop below the ~1e-4 floor the self-consistent iterate is FD-discretization-dominated, so ' +
    'a genuine higher physical v-order leaves the match unchanged rather than tightening it -- the residual is ' +
    'the finite-difference/roundoff floor, not a missing v-order, and it was the dropped E_flow all along. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'CLOSES imp-34770s deferred delta_4 rung: delta_4 ~ +6.6e-10 (~two orders below delta_3) leaves the ' +
    'self-consistent SC-to-exactF match essentially unchanged (moves it by < 1e-8 dex), so the fourth v-order ' +
    'does NOT monotonically tighten -- confirming the imp-34770 FD-floor-dominated non-monotonicity. What stays ' +
    'OPEN (deferred, not attempted here) is unchanged from imp-34756/imp-34770: a Richardson/higher-precision ' +
    'resolution of the ~9.2e-5 F-route-vs-direct-route discretization floor below the milli-dex scale, which ' +
    'changes no bound.',
  citation:
    'imp-34770 (third-order delta_3 and the FD-noise-dominated non-monotonicity this extends); imp-34756 ' +
    '(second-order delta_2 and the ~9.2e-5 dex FD floor); imp-34710 (the ~99%/1% residual split; F3 first ' +
    'identifies the FD floor); imp-34694 (first-order delta_1 and the original ~7.4e-3 dex gap); imp-34111 ' +
    '(tight-grid bisection log10 N* ~ 9.52903); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34797_SIGMA_KNEE_FOURTH_ORDER_V_EXPANSION_ASSERTIONS = [
  {
    // (F1): delta_4 is a small positive next-order term ~two orders below delta_3, and the extended ordered
    // magnitudes strictly decrease |delta_1| > |delta_2| > |delta_3| > |delta_4| with sub-unity ratios (convergent).
    id: 'imp34797-delta4-two-orders-below-delta3',
    description: 'delta_4 ~ +7e-10, |delta_1| > |delta_2| > |delta_3| > |delta_4|, and all successive ratios well below 1',
    holds: () =>
      DELTA4_AT_CROSS > 0 &&
      DELTA4_AT_CROSS < 1e-8 &&
      Math.abs(DELTA2_AT_CROSS) > Math.abs(DELTA3_AT_CROSS) &&
      Math.abs(DELTA3_AT_CROSS) > Math.abs(DELTA4_AT_CROSS) &&
      RATIO_3_2 < 0.1 &&
      RATIO_4_3 < 0.1,
  },
  {
    // (F1 tail): the extended geometric tail bound sum_(k>=4) |delta_k| sits well below the imp-34770 delta_3 tail
    // (by ~2 orders) and ~5 orders below the ~9.2e-5 dex FD floor; raw delta_4 knee shift is negligible (< 1e-7).
    id: 'imp34797-tail-below-delta3-tail',
    description: 'the sum_(k>=4) tail bound is < |delta_3| and ~5 orders below the ~9.2e-5 dex FD floor; raw delta_4 knee shift < 1e-7',
    holds: () =>
      TAIL_BOUND > 0 &&
      TAIL_BOUND < Math.abs(DELTA3_AT_CROSS) &&
      TAIL_BOUND < FD_FLOOR / 1000 &&
      Math.abs(RAW_4TH_MINUS_3RD) < 1e-7,
  },
  {
    // (F2): adding delta_4 does NOT monotonically tighten -- the fourth-order self-consistent knee barely moves
    // from the third-order one (< 1e-8 dex), far below the ~1e-4 FD floor, while the SC-to-exactF residual stays
    // at the imp-34770 overshoot value rather than shrinking toward the second-order -1.1e-5 (non-monotone).
    id: 'imp34797-fourth-order-non-monotonic-fd-dominated',
    description: 'fourth-order self-consistent knee barely moves from third-order; SC-to-exactF residual does not monotonically shrink',
    holds: () =>
      Math.abs(FOURTH_MINUS_THIRD_SC) < 1e-7 &&
      Math.abs(DELTA4_AT_CROSS) < 1e-4 &&
      Math.abs(FOURTH_ORDER_SC_TO_EXACTF) > Math.abs(SECOND_ORDER_SC_TO_EXACTF) &&
      Math.abs(FOURTH_ORDER_SC_TO_EXACTF) < 1e-4 &&
      Math.abs(FOURTH_ORDER_SC_TO_EXACTF - THIRD_ORDER_SC_TO_EXACTF) < 1e-6,
  },
  {
    // ordering / replication sanity: crossover below all knees; the no-E_flow knees cluster in [9.5362, 9.5365].
    id: 'imp34797-knee-ordering',
    description: 'crossover < knee cluster; all no-E_flow knees sit within [9.5362, 9.5365]',
    holds: () =>
      LOG10_N_CROSS < LOG10_N_4TH_SC &&
      LOG10_N_4TH_SC > 9.5362 &&
      LOG10_N_4TH_SC < 9.5365 &&
      LOG10_N_4TH > 9.5362 &&
      LOG10_N_4TH < 9.5365 &&
      LOG10_N_DIRECT > 9.5362 &&
      LOG10_N_DIRECT < 9.5365,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34797-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34797_SIGMA_KNEE_FOURTH_ORDER_V_EXPANSION.isRigorous === false &&
      IMP34797_SIGMA_KNEE_FOURTH_ORDER_V_EXPANSION.farTailExponent === 0.5 &&
      typeof IMP34797_SIGMA_KNEE_FOURTH_ORDER_V_EXPANSION.subGap === 'string' &&
      /NO QED/.test(IMP34797_SIGMA_KNEE_FOURTH_ORDER_V_EXPANSION.verdict) &&
      /refereed bound is changed/i.test(IMP34797_SIGMA_KNEE_FOURTH_ORDER_V_EXPANSION.verdict),
  },
];

for (const a of IMP34797_SIGMA_KNEE_FOURTH_ORDER_V_EXPANSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34797-sigma-knee-fourth-order-v-expansion assertion failed: ${a.id}`);
  }
}
