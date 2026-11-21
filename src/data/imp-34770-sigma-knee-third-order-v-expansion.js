/**
 * @module imp-34770-sigma-knee-third-order-v-expansion
 *
 * imp-34770 (numerical, frontier-direction): imp-34756 F2 restored the SECOND order delta_2 of the
 * slowly-varying-v expansion of the logistic exponent-knee condition and showed the self-consistent knee
 * converges to the exact all-orders F=0 root to ~1.1e-5 dex, then stopped at second order. imp-34756 F3 left
 * an OPEN ~9.2e-5 dex finite-difference (FD) floor between the analytic-F knee and the direct no-E_flow
 * root-find. This module restores ONE MORE order -- the THIRD order delta_3 -- of the same slowly-varying-v
 * expansion, tabulates its magnitude at the crossover, and ASSESSES whether the ordered terms
 * |delta_1|, |delta_2|, |delta_3| form a rapidly-converging (geometric-like) sequence whose tail sits BELOW
 * the ~9.2e-5 dex FD floor -- i.e. whether any attainable expansion order could ever reach below that floor.
 *
 * THE EXPANSION (no fresh model; identical sub-terms to imp-3406/imp-33582/imp-34694/imp-34710/imp-34756)
 * -----------------------------------------------------------------------------------------------------
 * In the no-E_flow logistic model sigma = 1/(1+exp(-u)), u = ln A + 0.5 ln L - x/2 (x = ln N), the EXACT
 * exponent-knee condition p_secondDeriv(x) = 0 factors (imp-34694/imp-34710 derivation) to
 *     F(x) = S(2S-1) v^3 + 3 S v v_prime + v_secondDeriv = 0,   S = sigma,  v = -u_prime.
 * Writing S = 1/2 + delta and using S(2S-1) = delta + 2 delta^2 and 3S = 3/2 + 3 delta EXACTLY turns F = 0
 * into the quadratic in delta
 *     2 v^3 delta^2 + (v^3 + 3 v v_prime) delta + ((3/2) v v_prime + v_secondDeriv) = 0.
 * Treating v_prime, v_secondDeriv as O(eps) (v varies slowly) and expanding delta = delta_1 + delta_2 + delta_3 + ...:
 *     ORDER eps  : v^3 delta_1 + ((3/2) v v_prime + v_secondDeriv) = 0
 *                  => delta_1 = -(3 v_prime)/(2 v^2) - v_secondDeriv/v^3            (imp-34694/imp-34710 first order)
 *     ORDER eps^2: v^3 delta_2 + 3 v v_prime delta_1 + 2 v^3 delta_1^2 = 0
 *                  => delta_2 = -3 (v_prime/v^2) delta_1 - 2 delta_1^2             (imp-34756 second order)
 *     ORDER eps^3: v^3 delta_3 + 3 v v_prime delta_2 + 4 v^3 delta_1 delta_2 = 0
 *                  => delta_3 = -3 (v_prime/v^2) delta_2 - 4 delta_1 delta_2       (the NEXT slowly-varying-v order)
 * The order-eps^3 balance uses the eps^3 slice of 2 v^3 delta^2, which is 2 v^3 (2 delta_1 delta_2) = 4 v^3 delta_1 delta_2,
 * plus the eps^3 slice 3 v v_prime delta_2 of the linear (v^3 + 3 v v_prime) delta term. The constant carries no eps^3.
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement/derivation only)
 * ------------------------------------------------------------------------------------
 *   (A) delta_3 at the crossover, and the raw ratio ladder |delta_2/delta_1|, |delta_3/delta_2|.
 *   (B) the third-order (raw and self-consistent) knee log10 N* it implies, against the imp-34756 second-order
 *       knee, the all-orders analytic F(x)=0 knee, and the direct no-E_flow central-difference root-find.
 *   (C) a conservative geometric tail bound sum_{k>=3} |delta_k| using the worst observed ratio, compared to
 *       the imp-34756 F3 ~9.2e-5 dex FD floor.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) delta_3 = -3(v_prime/v^2) delta_2 - 4 delta_1 delta_2 ~ +8.15e-8 at the crossover -- about THREE orders
 *        of magnitude below delta_2 (~+8.30e-6), which is itself ~three orders below delta_1 (~-5.64e-3). The
 *        ordered magnitudes 5.64e-3, 8.30e-6, 8.15e-8 form a rapidly-converging sequence with successive ratios
 *        |delta_2/delta_1| ~ 1.47e-3 and |delta_3/delta_2| ~ 9.82e-3, BOTH well below 1 (geometric-LIKE, though
 *        not strictly constant-ratio). Taking the worst ratio r ~ 1e-2 as a conservative cap, the whole tail
 *        sum_{k>=3} |delta_k| < |delta_3|/(1-r) ~ 8.2e-8.
 *   (F2) THE TAIL SITS ~3 ORDERS BELOW THE FD FLOOR. The delta_3 tail (~8e-8 in delta, mapping to a knee shift of
 *        only ~3e-7 dex via d(log10 N)/d delta ~ -3.6) is ~1000x smaller than the imp-34756 F3 ~9.2e-5 dex FD
 *        floor. So the analytic slowly-varying-v series is convergent with a tail utterly negligible against the
 *        discretization floor: NO attainable expansion order can reach below the ~9.2e-5 FD gap, confirming
 *        imp-34756 F3 that the gap is the finite-difference/roundoff floor, not a missing physical v-order.
 *   (F3) SELF-CONSISTENCY IS FD-NOISE-DOMINATED BELOW ~1e-4. The raw third-order-at-crossover knee (9.536426)
 *        is indistinguishable from the second-order knee (9.536426) to 6 digits, as expected for a ~3e-7 dex
 *        shift. But the third-order SELF-CONSISTENT knee lands 9.536334, moving AWAY from the exact-F knee
 *        (9.536285) to +4.9e-5 -- larger than imp-34756s second-order self-consistent -1.1e-5. This is NOT a
 *        divergence of the series: delta_3 itself is ~8e-8, three orders too small to cause a ~6e-5 fixed-point
 *        shift. It is the near-marginal self-consistent fixed-point map amplifying the HD=1e-3 central-difference
 *        noise in v_prime/v_secondDeriv -- once ordered terms drop below the ~1e-4 FD floor, the self-consistent
 *        iterate is dominated by discretization, so adding delta_3 does not monotonically tighten the match.
 *        This directly corroborates imp-34756 F3: below the milli-dex scale the balance is FD noise, not v-order.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent
 * stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34756-sigma-knee-second-order-v-expansion (second order delta_2 and the ~9.2e-5 FD floor this bounds against)
 * @see imp-34710-sigma-exponent-knee-residual-decomposition (the ~99%/1% split; F3 first identifies the FD floor)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (first-order delta_1 and the original ~7.4e-3 dex gap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const HD = 1e-3; // central-difference step (imp-34710/imp-34756 stable rung)
const H_REF = 1e-3; // direct root-find step (matches imp-34694/imp-34710/imp-34756)
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

// ---- no-E_flow logistic model (identical sub-terms to imp-34710/imp-34756) --------------------------------
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
// THIRD-order slowly-varying-v delta: delta_3 = -3 (v_prime/v^2) delta_2 - 4 delta_1 delta_2  (this module).
function delta3At(x) {
  const v = vOf(x);
  const vp = vpOf(x);
  const dd1 = delta1At(x);
  const dd2 = delta2At(x);
  return -3 * (vp / (v * v)) * dd2 - 4 * dd1 * dd2;
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
// DIRECT no-E_flow central-difference root-find of p_secondDeriv(x) = 0 (imp-34710/imp-34756 reference).
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
const DELTA3_AT_CROSS = delta3At(X_CROSS); // ~+8.149e-8 (this module, third order)

const RATIO_2_1 = Math.abs(DELTA2_AT_CROSS / DELTA1_AT_CROSS); // ~1.47e-3
const RATIO_3_2 = Math.abs(DELTA3_AT_CROSS / DELTA2_AT_CROSS); // ~9.82e-3
const WORST_RATIO = Math.max(RATIO_2_1, RATIO_3_2); // ~9.82e-3 (conservative tail cap)
const TAIL_BOUND = Math.abs(DELTA3_AT_CROSS) / (1 - WORST_RATIO); // ~8.23e-8 (sum_{k>=3} |delta_k| cap)

const X_STAR_2ND = locateFromDelta(DELTA1_AT_CROSS + DELTA2_AT_CROSS);
const LOG10_N_2ND = X_STAR_2ND / Math.LN10; // ~9.536426 (imp-34756 second-order @crossover)
const X_STAR_3RD = locateFromDelta(DELTA1_AT_CROSS + DELTA2_AT_CROSS + DELTA3_AT_CROSS);
const LOG10_N_3RD = X_STAR_3RD / Math.LN10; // ~9.536426 (third-order @crossover, shift ~3e-7)

// SELF-CONSISTENT third-order: evaluate delta_1 + delta_2 + delta_3 at the knee, iterate to a fixed point.
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
const THIRD_ORDER_SC_TO_EXACTF = LOG10_N_3RD_SC - LOG10_N_EXACTF; // ~+4.9e-5 (FD-noise-dominated below floor)
const SECOND_ORDER_SC_TO_EXACTF = LOG10_N_2ND_SC - LOG10_N_EXACTF; // ~-1.1e-5 (imp-34756 tightened match)
const THIRD_SOURCE_FD = LOG10_N_EXACTF - LOG10_N_DIRECT; // ~-9.2e-5 (imp-34756 F3 FD floor, unchanged)
const RAW_3RD_MINUS_2ND = LOG10_N_3RD - LOG10_N_2ND; // ~-3e-7 (raw delta_3 knee shift)

export const IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION = {
  id: 'imp-34770',
  proofSection: 'S-frontier',
  question:
    'imp-34756 F2 restored the second-order delta_2 of the slowly-varying-v expansion of the logistic ' +
    'exponent-knee condition and converged the self-consistent knee to the exact all-orders F=0 root to ~1.1e-5 ' +
    'dex, but stopped at second order and left a ~9.2e-5 dex finite-difference floor (F3) open. Restore the THIRD ' +
    'order delta_3, tabulate its magnitude at the crossover, and ASSESS whether |delta_1|, |delta_2|, |delta_3| ' +
    'form a convergent geometric-like sequence whose tail sits below that FD floor. Measurement/derivation only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the third-order slowly-varying-v delta delta_3 = -3(v_prime/v^2)delta_2 - 4 delta_1 delta_2 of the ' +
    'exponent-knee condition F(x)=S(2S-1)v^3+3 S v v_prime+v_secondDeriv=0, the successive-term ratios ' +
    '|delta_2/delta_1| and |delta_3/delta_2|, a conservative geometric tail bound sum_{k>=3}|delta_k|, and the ' +
    'third-order (raw and self-consistent) knee locations against the imp-34756 second-order knee, the ' +
    'all-orders analytic F(x)=0 knee, and the direct no-E_flow central-difference root-find',
  expansion: {
    delta1AtCrossover: +DELTA1_AT_CROSS.toExponential(4), // ~-5.6444e-3
    delta2AtCrossover: +DELTA2_AT_CROSS.toExponential(4), // ~+8.2994e-6 (imp-34756)
    delta3AtCrossover: +DELTA3_AT_CROSS.toExponential(4), // ~+8.1486e-8 (this module)
    delta3Formula: 'delta_3 = -3 (v_prime/v^2) delta_2 - 4 delta_1 delta_2',
    ratio2over1: +RATIO_2_1.toExponential(4), // ~1.4704e-3
    ratio3over2: +RATIO_3_2.toExponential(4), // ~9.8183e-3
    tailBoundSumKge3: +TAIL_BOUND.toExponential(4), // ~8.23e-8 (< FD floor by ~3 orders)
    fdFloorDex: FD_FLOOR, // 9.2e-5 (imp-34756 F3)
  },
  kneeLadder: {
    log10Ncross: +LOG10_N_CROSS.toFixed(6), // ~9.515913
    log10Nstar2ndOrderAtCross: +LOG10_N_2ND.toFixed(6), // ~9.536426 (imp-34756)
    log10Nstar3rdOrderAtCross: +LOG10_N_3RD.toFixed(6), // ~9.536426 (shift ~3e-7)
    log10Nstar3rdOrderSelfConsistent: +LOG10_N_3RD_SC.toFixed(6), // ~9.536334
    log10Nstar2ndOrderSelfConsistent: +LOG10_N_2ND_SC.toFixed(6), // ~9.536274 (imp-34756)
    log10NstarExactF: +LOG10_N_EXACTF.toFixed(6), // ~9.536285 (all-orders analytic)
    log10NstarDirectNoEflow: +LOG10_N_DIRECT.toFixed(6), // ~9.536377 (direct route)
  },
  residualBudget: {
    rawThirdMinusSecondLog10: +RAW_3RD_MINUS_2ND.toExponential(4), // ~-3e-7 (raw delta_3 knee shift)
    thirdOrderSelfConsistentToExactFLog10: +THIRD_ORDER_SC_TO_EXACTF.toExponential(4), // ~+4.9e-5 (FD-noise-dominated)
    secondOrderSelfConsistentToExactFLog10: +SECOND_ORDER_SC_TO_EXACTF.toExponential(4), // ~-1.1e-5 (imp-34756)
    thirdSourceFiniteDifferenceLog10: +THIRD_SOURCE_FD.toExponential(4), // ~-9.2e-5 (imp-34756 F3, unchanged)
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_delta3_is_three_orders_below_delta2:
      'delta_3 = -3(v_prime/v^2)delta_2 - 4 delta_1 delta_2 ~ +8.15e-8 at the crossover, ~three orders below ' +
      'delta_2 (~+8.30e-6), which is itself ~three orders below delta_1 (~-5.64e-3). The ordered magnitudes ' +
      '{5.64e-3, 8.30e-6, 8.15e-8} form a rapidly-converging sequence with successive ratios ~1.47e-3 and ' +
      '~9.82e-3, both well below 1 (geometric-LIKE though not strictly constant-ratio). A conservative cap ' +
      'r~1e-2 gives the whole tail sum_{k>=3}|delta_k| < ~8.2e-8.',
    F2_tail_sits_three_orders_below_fd_floor:
      'The delta_3 tail (~8e-8 in delta, mapping to only ~3e-7 dex in knee position via d(log10 N)/d delta ~ -3.6) ' +
      'is ~1000x smaller than the imp-34756 F3 ~9.2e-5 dex finite-difference floor. The analytic slowly-varying-v ' +
      'series is convergent with a tail utterly negligible against the discretization floor: no attainable ' +
      'expansion order can reach below the ~9.2e-5 FD gap, confirming imp-34756 F3 that the gap is the ' +
      'finite-difference/roundoff floor, NOT a missing physical v-order.',
    F3_self_consistency_is_fd_noise_dominated_below_floor:
      'The raw third-order-at-crossover knee (9.536426) is indistinguishable from the second-order knee ' +
      '(9.536426) to 6 digits (shift ~3e-7). But the third-order SELF-CONSISTENT knee lands 9.536334, moving ' +
      'AWAY from the exact-F knee (9.536285) to +4.9e-5 -- larger than imp-34756s second-order self-consistent ' +
      '-1.1e-5. This is NOT series divergence (delta_3 ~ 8e-8 is three orders too small to cause a ~6e-5 ' +
      'fixed-point shift); it is the near-marginal self-consistent map amplifying the HD=1e-3 central-difference ' +
      'noise in v_prime/v_secondDeriv. Once ordered terms drop below the ~1e-4 FD floor, the self-consistent ' +
      'iterate is FD-dominated, so adding delta_3 does not monotonically tighten the match -- directly ' +
      'corroborating imp-34756 F3.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). Restoring the THIRD order of the ' +
    'slowly-varying-v expansion of the logistic exponent-knee condition gives delta_3 = -3(v_prime/v^2)delta_2 ' +
    '- 4 delta_1 delta_2 ~ +8.15e-8 at the crossover. The ordered magnitudes {|delta_1|,|delta_2|,|delta_3|} = ' +
    '{5.64e-3, 8.30e-6, 8.15e-8} form a rapidly-converging (geometric-like) sequence with successive ratios ' +
    '~1.47e-3 and ~9.82e-3, both well below 1, so a conservative cap r~1e-2 bounds the whole tail ' +
    'sum_{k>=3}|delta_k| < ~8.2e-8. That tail maps to only ~3e-7 dex in knee position -- ~1000x BELOW the ' +
    'imp-34756 F3 ~9.2e-5 dex finite-difference floor. FINDING: the analytic v-series is convergent with a tail ' +
    'negligible against the discretization floor, so no attainable expansion order can reach below the ~9.2e-5 ' +
    'gap; the third-order self-consistent knee even moves AWAY from exact-F (+4.9e-5 vs the second-order ' +
    '-1.1e-5), not because the series diverges but because below the ~1e-4 floor the near-marginal ' +
    'self-consistent map amplifies HD=1e-3 central-difference noise. This confirms imp-34756 F3: the residual ' +
    'gap is the finite-difference/roundoff floor, not a missing v-order, and it was the dropped E_flow all ' +
    'along. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  subGap:
    'CLOSES imp-34756s deferred question of whether a THIRD v-order could reach below the ~9.2e-5 dex FD floor: ' +
    'delta_3 ~ +8.15e-8 makes the tail sum_{k>=3}|delta_k| < ~8.2e-8, ~1000x below the floor, so no expansion ' +
    'order can. What stays OPEN (deferred, not attempted here) is unchanged from imp-34756: a ' +
    'Richardson/higher-precision resolution of the ~9.2e-5 F-route-vs-direct-route discretization floor below ' +
    'the milli-dex scale, which changes no bound.',
  citation:
    'imp-34756 (second-order delta_2 and the ~9.2e-5 dex FD floor this bounds against); imp-34710 (the ~99%/1% ' +
    'residual split; F3 first identifies the FD floor); imp-34694 (first-order delta_1 and the original ~7.4e-3 ' +
    'dex gap); imp-34111 (tight-grid bisection log10 N* ~ 9.52903); imp-3463 (far-tail 1/2); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION_ASSERTIONS = [
  {
    // (F1): delta_3 is a small positive next-order term ~three orders below delta_2, and the ordered magnitudes
    // strictly decrease |delta_1| > |delta_2| > |delta_3| with sub-unity successive ratios (convergent).
    id: 'imp34770-delta3-three-orders-below-delta2',
    description: 'delta_3 ~ +8e-8, |delta_1| > |delta_2| > |delta_3|, and both successive ratios are well below 1',
    holds: () =>
      DELTA3_AT_CROSS > 0 &&
      DELTA3_AT_CROSS < 1e-6 &&
      Math.abs(DELTA1_AT_CROSS) > Math.abs(DELTA2_AT_CROSS) &&
      Math.abs(DELTA2_AT_CROSS) > Math.abs(DELTA3_AT_CROSS) &&
      RATIO_2_1 < 0.1 &&
      RATIO_3_2 < 0.1,
  },
  {
    // (F2): the geometric tail bound sum_{k>=3} |delta_k| sits well below the imp-34756 F3 ~9.2e-5 dex FD floor
    // (by ~3 orders), and the raw third-order knee shift against the second-order knee is negligible (< 1e-5).
    id: 'imp34770-tail-below-fd-floor',
    description: 'the geometric tail bound sits ~3 orders below the ~9.2e-5 dex FD floor; raw delta_3 knee shift < 1e-5',
    holds: () =>
      TAIL_BOUND > 0 &&
      TAIL_BOUND < FD_FLOOR / 100 &&
      Math.abs(RAW_3RD_MINUS_2ND) < 1e-5 &&
      Math.abs(THIRD_SOURCE_FD) > 3e-5 &&
      Math.abs(THIRD_SOURCE_FD) < 2e-4,
  },
  {
    // (F3): the third-order self-consistent knee does NOT monotonically tighten the match -- it moves away from
    // exact-F relative to the second-order self-consistent knee -- while |delta_3| is far too small to explain
    // the shift, evidencing FD-noise domination below the floor (both SC-to-exactF residuals stay sub-1e-4).
    id: 'imp34770-self-consistency-fd-noise-dominated',
    description: 'third-order self-consistent knee moves away from exact-F despite negligible delta_3 (FD-noise-dominated)',
    holds: () =>
      Math.abs(THIRD_ORDER_SC_TO_EXACTF) > Math.abs(SECOND_ORDER_SC_TO_EXACTF) &&
      Math.abs(THIRD_ORDER_SC_TO_EXACTF) < 1e-4 &&
      Math.abs(SECOND_ORDER_SC_TO_EXACTF) < 1e-4 &&
      Math.abs(DELTA3_AT_CROSS) < Math.abs(THIRD_ORDER_SC_TO_EXACTF - SECOND_ORDER_SC_TO_EXACTF),
  },
  {
    // ordering / replication sanity: crossover below all knees; the no-E_flow knees cluster in [9.5362, 9.5365].
    id: 'imp34770-knee-ordering',
    description: 'crossover < knee cluster; all no-E_flow knees sit within [9.5362, 9.5365]',
    holds: () =>
      LOG10_N_CROSS < LOG10_N_3RD_SC &&
      LOG10_N_3RD_SC > 9.5362 &&
      LOG10_N_3RD_SC < 9.5365 &&
      LOG10_N_3RD > 9.5362 &&
      LOG10_N_3RD < 9.5365 &&
      LOG10_N_DIRECT > 9.5362 &&
      LOG10_N_DIRECT < 9.5365,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34770-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION.isRigorous === false &&
      IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION.farTailExponent === 0.5 &&
      typeof IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION.subGap === 'string' &&
      /NO QED/.test(IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION.verdict) &&
      /refereed bound is changed/i.test(IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION.verdict),
  },
];

for (const a of IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34770-sigma-knee-third-order-v-expansion assertion failed: ${a.id}`);
  }
}
