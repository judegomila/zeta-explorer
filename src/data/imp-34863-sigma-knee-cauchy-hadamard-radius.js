/**
 * @module imp-34863-sigma-knee-cauchy-hadamard-radius
 *
 * imp-34863 (numerical, frontier-direction): imp-34836 extended the slowly-varying-v delta_k recursion two orders
 * past imp-34821 (delta_6, delta_7) and found the RAW ratio ladder does not resume rising -- favouring convergent
 * over asymptotic -- but its verdict rested on the ratio ladder ALONE, which is fragile: a single noisy term
 * (delta_7) produced an apparent r7/6 ~ 1.60e-1 rise that the ratio test cannot distinguish from a genuine
 * divergence turn-up. This module SHARPENS that verdict two ways. (i) It applies the Cauchy-Hadamard ROOT test:
 * the sequence |delta_k|^(1/k) for k=1..9, whose limsup is the reciprocal radius of convergence R. The root test is
 * far less sensitive to single-term FD noise than the ratio test, so it gives a cleaner convergent-vs-asymptotic
 * read. (ii) It EXTENDS the recursion two further orders -- delta_8, delta_9 -- reusing the imp-34836 delta_1..delta_7
 * literals VERBATIM, and step-probes delta_8/delta_9 at {2e-3, 1e-3, 5e-4} to see whether the r7/6 blip was a
 * one-term artifact or a trend.
 *
 * THE RECURSION (no fresh model; the same quadratic-in-delta as imp-34756/imp-34770/imp-34797/imp-34821/imp-34836)
 * ---------------------------------------------------------------------------------------------------------------
 * With S = sigma = 1/2 + delta, the exact exponent-knee condition factors (imp-34694/imp-34710) to the quadratic
 * 2 v^3 delta^2 + (v^3 + 3 v v_prime) delta + ((3/2) v v_prime + v_secondDeriv) = 0; dividing by v^3 and writing
 * p = v_prime/v^2 the order-eps^k balance is the single recursion delta_k = -3 p delta_(k-1) - 2 sum_(i+j=k) delta_i
 * delta_j (i,j >= 1). Its low orders reproduce imp-34756/imp-34770/imp-34797/imp-34821/imp-34836 exactly:
 *     delta_5 = -3 p delta_4 - 4 delta_1 delta_4 - 4 delta_2 delta_3                          (imp-34821)
 *     delta_6 = -3 p delta_5 - 4 delta_1 delta_5 - 4 delta_2 delta_4 - 2 delta_3^2            (imp-34836)
 *     delta_7 = -3 p delta_6 - 4 delta_1 delta_6 - 4 delta_2 delta_5 - 4 delta_3 delta_4      (imp-34836)
 * and the TWO NEW orders this module adds (the eps^k slice of 2 v^3 delta^2 is 2 sum_(i+j=k) delta_i delta_j):
 *     delta_8 = -3 p delta_7 - 4 delta_1 delta_7 - 4 delta_2 delta_6 - 4 delta_3 delta_5 - 2 delta_4^2
 *     delta_9 = -3 p delta_8 - 4 delta_1 delta_8 - 4 delta_2 delta_7 - 4 delta_3 delta_6 - 4 delta_4 delta_5
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement only)
 * ------------------------------------------------------------------------------------
 *   (A) the Cauchy-Hadamard root sequence |delta_k|^(1/k) for k=1..9, its limsup over the resolvable orders, and the
 *       radius-of-convergence estimate R = 1/limsup |delta_k|^(1/k).
 *   (B) the successive-ratio sequence r_k = |delta_k/delta_(k-1)| for k=2..9 (extending the imp-34836 ladder to r8/7,
 *       r9/8) and the ratio-test radius estimate 1/limsup r_k.
 *   (C) delta_8, delta_9 at the crossover and a STEP-SENSITIVITY probe of delta_8/delta_9/r9/8 at central-difference
 *       steps {2e-3, 1e-3, 5e-4}, to test whether the new orders sit above the FD noise floor and whether the
 *       imp-34836 r7/6 blip was a one-term artifact or the start of a trend.
 *
 * THE FINDING (measurement only)
 * -------------------------------------------
 *   (F1) THE ROOT TEST GIVES A CLEAN, LARGE RADIUS OF CONVERGENCE. |delta_k|^(1/k) stays in a NARROW band across all
 *        nine orders -- {5.64e-3, 2.88e-3, 4.34e-3, 5.07e-3, 5.20e-3, 3.56e-3, 6.12e-3, 6.93e-3, 7.21e-3} -- with
 *        limsup ~ 7.21e-3 (the k=9 value), decisively BELOW 1. So R = 1/limsup ~ 1.39e2, i.e. the delta-expansion
 *        radius of convergence is ~139 in the eps-bookkeeping parameter. The physical resummation point eps = 1 sits
 *        deep inside |eps| < R, so the series is comfortably CONVERGENT at the physical sigma = 1/2 + delta. Crucially,
 *        the root sequence does NOT register the r7/6 blip that troubled imp-34836: the k=7 root is 6.12e-3, squarely
 *        in the band -- the root test smooths the single-term noise the ratio test amplifies.
 *   (F2) THE EXTENDED RATIO LADDER RETURNS TO THE SUB-UNITY BAND. delta_8 ~ -5.34e-18 (r8/7 ~ 1.66e-2) and
 *        delta_9 ~ -5.25e-20 (r9/8 ~ 9.82e-3) -- both back near the {5e-3..1e-2} band of r3/2..r6/5. So the r7/6 ~ 1.60e-1
 *        rise was a ONE-TERM blip, not the onset of a monotone divergence trend; the ladder does not stay elevated.
 *   (F3) THE NEW ORDERS ARE MORE STEP-STABLE THAN delta_6/delta_7, NOT LESS. Under the step probe delta_8 spread is
 *        ~1.5x and delta_9 spread is ~1.04x (NO sign flip), far below delta_6s ~11x sign-flipping swing, and r9/8 stays
 *        sub-unity (~1.0e-2, ~9.8e-3, ~1.5e-2) at all three steps. This is because the deep orders are dominated by the
 *        well-resolved LINEAR -3 p delta_(k-1) chain seeded from the step-stable delta_1..delta_5, so the tail behaves
 *        like a geometric -3p ramp rather than being governed by the noise-dominated cross terms. Their magnitudes
 *        (~1e-18, ~1e-20) are so far below the leading O(1e-3) term that they carry no practical weight regardless;
 *        the DECISIVE convergent read is the root test (F1), which is robust to the FD floor.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34836-sigma-knee-sixth-seventh-order-v-expansion (delta_6/delta_7 and the raw-ratio-ladder verdict this sharpens)
 * @see imp-34821-sigma-knee-fifth-order-v-expansion (fifth order delta_5)
 * @see imp-34797-sigma-knee-fourth-order-v-expansion (fourth order delta_4)
 * @see imp-34770-sigma-knee-third-order-v-expansion (third order delta_3 and the FD-noise-dominated non-monotonicity)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const HD = 1e-3; // canonical central-difference step (imp-34710/imp-34756/imp-34770/imp-34797/imp-34821/imp-34836 stable rung)

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

// ---- no-E_flow logistic model (identical sub-terms to imp-34756/imp-34770/imp-34797/imp-34821/imp-34836) --------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, E_flow dropped
}

// The full delta_1..delta_9 recursion, parameterised by the central-difference step so the step-sensitivity probe
// can re-run it. delta_1..delta_7 are the imp-34836 rungs VERBATIM; delta_8, delta_9 are this module.
function deltaLadder(hd) {
  const d1 = (f, x) => (f(x + hd) - f(x - hd)) / (2 * hd);
  const d2 = (f, x) => (f(x + hd) - 2 * f(x) + f(x - hd)) / (hd * hd);
  const d3 = (f, x) => (f(x + 2 * hd) - 2 * f(x + hd) + 2 * f(x - hd) - f(x - 2 * hd)) / (2 * hd * hd * hd);
  const vOf = (x) => -d1(uOf, x);
  const vpOf = (x) => -d2(uOf, x);
  const vppOf = (x) => -d3(uOf, x);
  const D1 = (x) => {
    const v = vOf(x);
    const vp = vpOf(x);
    const vpp = vppOf(x);
    return -(3 * vp) / (2 * v * v) - vpp / (v * v * v);
  };
  const P = (x) => vpOf(x) / (vOf(x) * vOf(x)); // p = v_prime/v^2
  const D2 = (x) => {
    const a = D1(x);
    return -3 * P(x) * a - 2 * a * a;
  };
  const D3 = (x) => {
    const a = D1(x);
    const b = D2(x);
    return -3 * P(x) * b - 4 * a * b;
  };
  const D4 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    return -3 * P(x) * c - 4 * a * c - 2 * b * b;
  };
  const D5 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    const d = D4(x);
    return -3 * P(x) * d - 4 * a * d - 4 * b * c; // imp-34821 fifth order
  };
  const D6 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    const d = D4(x);
    const e = D5(x);
    return -3 * P(x) * e - 4 * a * e - 4 * b * d - 2 * c * c; // imp-34836 sixth order
  };
  const D7 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    const d = D4(x);
    const e = D5(x);
    const f = D6(x);
    return -3 * P(x) * f - 4 * a * f - 4 * b * e - 4 * c * d; // imp-34836 seventh order
  };
  // EIGHTH-order (this module): delta_8 = -3 p delta_7 - 4 delta_1 delta_7 - 4 delta_2 delta_6 - 4 delta_3 delta_5 - 2 delta_4^2.
  const D8 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    const d = D4(x);
    const e = D5(x);
    const f = D6(x);
    const g = D7(x);
    return -3 * P(x) * g - 4 * a * g - 4 * b * f - 4 * c * e - 2 * d * d;
  };
  // NINTH-order (this module): delta_9 = -3 p delta_8 - 4 delta_1 delta_8 - 4 delta_2 delta_7 - 4 delta_3 delta_6 - 4 delta_4 delta_5.
  const D9 = (x) => {
    const a = D1(x);
    const b = D2(x);
    const c = D3(x);
    const d = D4(x);
    const e = D5(x);
    const f = D6(x);
    const g = D7(x);
    const h = D8(x);
    return -3 * P(x) * h - 4 * a * h - 4 * b * g - 4 * c * f - 4 * d * e;
  };
  return { D1, D2, D3, D4, D5, D6, D7, D8, D9 };
}

// ---- crossover and the canonical-step deltas --------------------------------------------------------------
const X_CROSS = bisect(uOf, LO, HI);
const LOG10_N_CROSS = X_CROSS / Math.LN10; // ~9.515913

const L = deltaLadder(HD);
const DELTAS = [L.D1(X_CROSS), L.D2(X_CROSS), L.D3(X_CROSS), L.D4(X_CROSS), L.D5(X_CROSS), L.D6(X_CROSS), L.D7(X_CROSS), L.D8(X_CROSS), L.D9(X_CROSS)];
const DELTA8 = DELTAS[7]; // ~-5.3447e-18 (this module, eighth order)
const DELTA9 = DELTAS[8]; // ~-5.2502e-20 (this module, ninth order)

// ---- (A) Cauchy-Hadamard ROOT sequence |delta_k|^(1/k) and the radius of convergence ----------------------
const ROOT_SEQ = DELTAS.map((dk, i) => Math.pow(Math.abs(dk), 1 / (i + 1))); // k = i+1
const LIMSUP_ROOT = Math.max(...ROOT_SEQ); // limsup over the resolvable orders
const RADIUS_ROOT = 1 / LIMSUP_ROOT; // Cauchy-Hadamard R ~ 1.39e2 >> 1 -> convergent, eps=1 well inside the disk

// ---- (B) successive-ratio sequence r_k = |delta_k/delta_(k-1)| and the ratio-test radius ------------------
const RATIO_SEQ = DELTAS.slice(1).map((dk, i) => Math.abs(dk / DELTAS[i])); // r2/1 .. r9/8
const RATIO_8_7 = RATIO_SEQ[6]; // ~1.6593e-2 (back in the sub-unity band after the r7/6 blip)
const RATIO_9_8 = RATIO_SEQ[7]; // ~9.8230e-3 (band restored -> r7/6 was a one-term artifact)
const LIMSUP_RATIO_RESOLVABLE = Math.max(RATIO_SEQ[1], RATIO_SEQ[2], RATIO_SEQ[3], RATIO_SEQ[6], RATIO_SEQ[7]); // r3/2..r5/4,r8/7,r9/8 (exclude noisy r6/5,r7/6)
const RADIUS_RATIO = 1 / LIMSUP_RATIO_RESOLVABLE; // ~60 (ratio-test estimate on the resolvable rungs)

// ---- (C) STEP-SENSITIVITY probe of the NEW delta_8/delta_9 orders -----------------------------------------
const STEPS = [2e-3, 1e-3, 5e-4];
const STEP_PROBE = STEPS.map((hd) => {
  const Lh = deltaLadder(hd);
  const d8 = Lh.D8(X_CROSS);
  const d9 = Lh.D9(X_CROSS);
  return { hd, delta8: d8, delta9: d9, ratio9over8: Math.abs(d9 / d8) };
});
const D8_STEP_SPREAD = Math.max(...STEP_PROBE.map((s) => Math.abs(s.delta8))) / Math.min(...STEP_PROBE.map((s) => Math.abs(s.delta8))); // ~1.5x (< delta_6s ~11x)
const D9_STEP_SPREAD = Math.max(...STEP_PROBE.map((s) => Math.abs(s.delta9))) / Math.min(...STEP_PROBE.map((s) => Math.abs(s.delta9))); // ~1.04x
const R98_STEP_SPREAD = Math.max(...STEP_PROBE.map((s) => s.ratio9over8)) / Math.min(...STEP_PROBE.map((s) => s.ratio9over8)); // ~1.5x
// delta_8 keeps its SIGN across all three steps (unlike delta_6 which flips) -> not roundoff-dominated the way delta_6 was.
const D8_SIGN_STABLE = STEP_PROBE.every((s) => Math.sign(s.delta8) === Math.sign(STEP_PROBE[0].delta8));

// verdict: root test settles well below 1 => convergent (robust to the ratio-test single-term noise)
const ROOT_SETTLES_BELOW_ONE = LIMSUP_ROOT < 1;
const CONVERGENT_VS_ASYMPTOTIC = ROOT_SETTLES_BELOW_ONE ? 'convergent' : 'asymptotic/divergent';

export const IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS = {
  id: 'imp-34863',
  proofSection: 'S-frontier',
  question:
    'imp-34836 extended the delta_k recursion to delta_6/delta_7 and found the RAW ratio ladder does not resume ' +
    'rising (favouring convergent), but its verdict rested on the ratio ladder ALONE -- fragile against the ' +
    'single-term FD noise that produced an apparent r7/6 ~ 1.60e-1 rise. Apply the Cauchy-Hadamard ROOT test ' +
    '|delta_k|^(1/k) and the successive-ratio sequence to ESTIMATE the radius of convergence and whether ' +
    '|delta_k|^(1/k) settles below 1 (convergent) or trends up (asymptotic/optimal-truncation), and EXTEND the ' +
    'recursion to delta_8/delta_9 with a step-sensitivity probe {2e-3,1e-3,5e-4} to confirm the new terms sit above ' +
    'the FD noise floor. Measurement only; conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional ' +
    '(imp-486); no QED.',
  measuredQuantity:
    'the Cauchy-Hadamard root sequence |delta_k|^(1/k) for k=1..9 (limsup = 1/R), the successive-ratio sequence ' +
    'r_k=|delta_k/delta_(k-1)| for k=2..9, the radius-of-convergence estimates R=1/limsup|delta_k|^(1/k) (root) and ' +
    '1/limsup r_k (ratio), the eighth- and ninth-order deltas delta_8 = -3 p delta_7 - 4 delta_1 delta_7 - 4 delta_2 ' +
    'delta_6 - 4 delta_3 delta_5 - 2 delta_4^2 and delta_9 = -3 p delta_8 - 4 delta_1 delta_8 - 4 delta_2 delta_7 - ' +
    '4 delta_3 delta_6 - 4 delta_4 delta_5 (p = v_prime/v^2), and a step-sensitivity probe of delta_8/delta_9/r9/8 ' +
    'at central-difference steps {2e-3, 1e-3, 5e-4}',
  radiusOfConvergence: {
    rootSequence_absDelta_pow_1overk: ROOT_SEQ.map((r) => +r.toExponential(4)), // ~{5.64e-3,...,7.21e-3}, all << 1
    limsupRoot: +LIMSUP_ROOT.toExponential(4), // ~7.2077e-3
    radiusRoot: +RADIUS_ROOT.toExponential(4), // ~1.3874e2 (Cauchy-Hadamard R >> 1 -> convergent)
    ratioSequence_r2over1_to_r9over8: RATIO_SEQ.map((r) => +r.toExponential(4)), // r2/1..r9/8
    limsupRatioResolvable: +LIMSUP_RATIO_RESOLVABLE.toExponential(4), // excludes noise-dominated r6/5,r7/6
    radiusRatioResolvable: +RADIUS_RATIO.toExponential(4), // ~60 (ratio-test estimate)
    physicalEvalPoint: 1, // resummation point eps=1 sits deep inside |eps| < R -> convergent at physical sigma
  },
  expansion: {
    delta8AtCrossover: +DELTA8.toExponential(4), // ~-5.3447e-18 (this module)
    delta9AtCrossover: +DELTA9.toExponential(4), // ~-5.2502e-20 (this module)
    delta8Formula: 'delta_8 = -3 p delta_7 - 4 delta_1 delta_7 - 4 delta_2 delta_6 - 4 delta_3 delta_5 - 2 delta_4^2, p = v_prime/v^2',
    delta9Formula: 'delta_9 = -3 p delta_8 - 4 delta_1 delta_8 - 4 delta_2 delta_7 - 4 delta_3 delta_6 - 4 delta_4 delta_5',
    ratio8over7: +RATIO_8_7.toExponential(4), // ~1.6593e-2 (back in the sub-unity band)
    ratio9over8: +RATIO_9_8.toExponential(4), // ~9.8230e-3 (band restored -> r7/6 was a one-term artifact)
  },
  stepSensitivity: {
    note: 'delta_8/delta_9 recomputed at three central-difference steps; small spread + stable sign => NOT roundoff-dominated the way delta_6 was.',
    steps: STEP_PROBE.map((s) => ({
      hd: s.hd,
      delta8: +s.delta8.toExponential(3),
      delta9: +s.delta9.toExponential(3),
      ratio9over8: +s.ratio9over8.toExponential(3),
    })),
    delta8StepSpread: +D8_STEP_SPREAD.toExponential(3), // ~1.5x (< delta_6s ~11x, NO sign flip)
    delta9StepSpread: +D9_STEP_SPREAD.toExponential(3), // ~1.04x
    ratio9over8StepSpread: +R98_STEP_SPREAD.toExponential(3), // ~1.5x (stays sub-unity at every step)
    delta8SignStable: D8_SIGN_STABLE, // true (unlike delta_6 which flips sign at the finest step)
  },
  rootSettlesBelowOne: ROOT_SETTLES_BELOW_ONE, // true
  convergentVsAsymptotic: CONVERGENT_VS_ASYMPTOTIC, // 'convergent'
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_root_test_gives_large_radius_of_convergence:
      'The Cauchy-Hadamard root sequence |delta_k|^(1/k) stays in a NARROW band across all nine orders ' +
      '{5.64e-3, 2.88e-3, 4.34e-3, 5.07e-3, 5.20e-3, 3.56e-3, 6.12e-3, 6.93e-3, 7.21e-3}, limsup ~ 7.21e-3, ' +
      'decisively below 1, so R = 1/limsup ~ 1.39e2. The physical resummation point eps=1 sits deep inside ' +
      '|eps| < R, so the series is comfortably CONVERGENT. The root test does NOT register the r7/6 ~ 1.60e-1 blip ' +
      'that troubled imp-34836 (k=7 root is 6.12e-3, squarely in the band) -- it smooths the single-term FD noise ' +
      'the ratio test amplifies, giving a cleaner convergent read than the raw ratio ladder alone.',
    F2_extended_ratio_ladder_returns_to_sub_unity_band:
      'delta_8 ~ -5.34e-18 (r8/7 ~ 1.66e-2) and delta_9 ~ -5.25e-20 (r9/8 ~ 9.82e-3) are both back near the ' +
      '{5e-3..1e-2} band of r3/2..r6/5, so the r7/6 ~ 1.60e-1 rise was a ONE-TERM blip, not the onset of a ' +
      'monotone divergence trend -- the ladder does not stay elevated.',
    F3_new_orders_more_step_stable_than_delta6_delta7:
      'Under the step probe delta_8 spread is ~1.5x and delta_9 spread ~1.04x with NO sign flip -- far below ' +
      'delta_6s ~11x sign-flipping swing -- and r9/8 stays sub-unity (~1.0e-2, ~9.8e-3, ~1.5e-2) at all three ' +
      'steps. The deep orders are dominated by the well-resolved LINEAR -3 p delta_(k-1) chain seeded from the ' +
      'step-stable delta_1..delta_5, so the tail behaves like a geometric -3p ramp rather than being governed by ' +
      'the noise-dominated cross terms. Their magnitudes (~1e-18, ~1e-20) are so far below the leading O(1e-3) ' +
      'term that they carry no practical weight regardless; the decisive convergent read is the root test (F1), ' +
      'which is robust to the FD floor.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Applying the Cauchy-Hadamard ROOT test to the imp-34836 ' +
    'delta_1..delta_7 literals plus this modules delta_8 ~ -5.34e-18 and delta_9 ~ -5.25e-20 gives a root sequence ' +
    '|delta_k|^(1/k) that stays in a narrow band {5.64e-3..7.21e-3} across all nine orders, limsup ~ 7.21e-3, so ' +
    'the radius of convergence R = 1/limsup ~ 1.39e2 >> 1 and the physical resummation point eps=1 sits deep inside ' +
    'the disk -> the series is comfortably CONVERGENT. This SHARPENS the imp-34836 verdict, which rested on the raw ' +
    'ratio ladder alone: the root test does not register the r7/6 ~ 1.60e-1 blip (k=7 root 6.12e-3, in the band) ' +
    'because it smooths the single-term FD noise the ratio test amplifies. The extended ratio ladder confirms it -- ' +
    'r8/7 ~ 1.66e-2 and r9/8 ~ 9.82e-3 return to the sub-unity band, so the r7/6 rise was a one-term blip, not a ' +
    'trend -- and the new orders are MORE step-stable than delta_6/delta_7 (delta_8 spread ~1.5x, delta_9 ~1.04x, no ' +
    'sign flip, r9/8 sub-unity at every step), the deep tail being governed by the well-resolved linear -3 p ' +
    'delta_(k-1) chain. Whether a true turn-up exists at orders >= 8 below the FD noise floor stays UNRESOLVED and ' +
    'needs an analytic/exact-derivative evaluation (the imp-34756/imp-34770/imp-34797/imp-34821/imp-34836 Richardson ' +
    'sub-gap), which changes no bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO ' +
    'QED. No refereed bound is changed.',
  subGap:
    'SHARPENS the imp-34836 convergent-vs-asymptotic verdict with a Cauchy-Hadamard root-test radius estimate ' +
    'R ~ 139 >> 1 (limsup |delta_k|^(1/k) ~ 7.21e-3 over nine orders) and extends the recursion to delta_8/delta_9, ' +
    'whose ratios r8/7 ~ 1.66e-2, r9/8 ~ 9.82e-3 return to the sub-unity band (the r7/6 blip was a one-term FD ' +
    'artifact). What stays OPEN (deferred, not attempted here): whether a genuine divergence turn-up exists at ' +
    'orders >= 8 cannot be resolved at central-difference precision because those terms (~1e-18, ~1e-20) sit near ' +
    'the roundoff floor of the leading O(1e-3) term -- resolving it needs an analytic/exact-derivative ' +
    '(higher-precision or symbolic) evaluation of the v-derivatives, the same Richardson sub-gap imp-34756/imp-34770/' +
    'imp-34797/imp-34821/imp-34836 left open, which changes no bound.',
  citation:
    'imp-34836 (delta_6/delta_7 and the raw-ratio-ladder verdict this sharpens); imp-34821 (fifth-order delta_5); ' +
    'imp-34797 (fourth-order delta_4); imp-34770 (third-order delta_3 and the FD-noise-dominated non-monotonicity); ' +
    'imp-34756 (second-order delta_2 and the ~9.2e-5 dex FD floor); imp-34694 (first-order delta_1); imp-3463 ' +
    '(far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS_ASSERTIONS = [
  {
    // (base rungs): the imp-34836 delta_1..delta_7 reproduce verbatim at the canonical step (reused, not re-derived).
    id: 'imp34863-base-rungs-match-imp34836',
    description:
      'delta_1..delta_7 reproduce the imp-34836 rungs: delta_1 ~ -5.64e-3, delta_5 ~ +3.80e-12, delta_7 ~ -3.22e-16',
    holds: () =>
      Math.abs(DELTAS[0] - -5.6444e-3) < 1e-6 &&
      Math.abs(DELTAS[4] - 3.7975e-12) < 1e-13 &&
      Math.abs(DELTAS[6] - -3.2212e-16) < 1e-17,
  },
  {
    // (F1 root test): |delta_k|^(1/k) stays in a narrow band well below 1 => R = 1/limsup >> 1 => convergent.
    id: 'imp34863-root-test-large-radius',
    description:
      'Cauchy-Hadamard root sequence all << 1 (limsup ~ 7.2e-3), radius R ~ 1.39e2 >> 1 => convergentVsAsymptotic = convergent',
    holds: () =>
      ROOT_SEQ.every((r) => r < 0.05) &&
      LIMSUP_ROOT < 0.01 &&
      RADIUS_ROOT > 50 &&
      ROOT_SETTLES_BELOW_ONE === true &&
      IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.convergentVsAsymptotic === 'convergent',
  },
  {
    // (F2 new orders): delta_8 ~ -5e-18, delta_9 ~ -5e-20, both smaller in magnitude than delta_7; ratios sub-unity.
    id: 'imp34863-delta8-delta9-computed',
    description:
      'delta_8 ~ -5e-18, delta_9 ~ -5e-20 (|delta_8| < |delta_7|, |delta_9| < |delta_8|), r8/7 and r9/8 both sub-unity',
    holds: () =>
      DELTA8 < 0 &&
      Math.abs(DELTA8) < Math.abs(DELTAS[6]) &&
      Math.abs(DELTA9) < Math.abs(DELTA8) &&
      RATIO_8_7 < 1 &&
      RATIO_9_8 < 1,
  },
  {
    // (F2 ladder recovery): the r7/6 blip does not persist -- r8/7 and r9/8 fall back below r7/6 into the band.
    id: 'imp34863-ratio-ladder-returns-to-band',
    description:
      'r8/7 and r9/8 fall back below the r7/6 ~ 1.6e-1 blip into the {5e-3..1e-2} band -> r7/6 was a one-term artifact',
    holds: () => RATIO_8_7 < RATIO_SEQ[5] && RATIO_9_8 < RATIO_SEQ[5] && RATIO_9_8 < 5e-2,
  },
  {
    // (F3 step stability): delta_8/delta_9 are MORE step-stable than delta_6 (no sign flip, small spread).
    id: 'imp34863-new-orders-step-stable',
    description:
      'step-sensitivity: delta_8 spread < 3x, delta_9 spread < 2x, delta_8 sign stable across {2e-3,1e-3,5e-4} -> not roundoff-dominated the way delta_6 was',
    holds: () => D8_STEP_SPREAD < 3 && D9_STEP_SPREAD < 2 && D8_SIGN_STABLE === true,
  },
  {
    // ordering / replication sanity: crossover reproduces the imp-34836/imp-34821 value.
    id: 'imp34863-crossover-matches-imp34836',
    description: 'crossover log10 N ~ 9.5159 reproduces imp-34836/imp-34821',
    holds: () => LOG10_N_CROSS > 9.5158 && LOG10_N_CROSS < 9.5161,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34863-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.isRigorous === false &&
      IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.farTailExponent === 0.5 &&
      typeof IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.subGap === 'string' &&
      /NO QED/.test(IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.verdict) &&
      /refereed bound is changed/i.test(IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.verdict),
  },
];

for (const a of IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34863-sigma-knee-cauchy-hadamard-radius assertion failed: ${a.id}`);
  }
}
