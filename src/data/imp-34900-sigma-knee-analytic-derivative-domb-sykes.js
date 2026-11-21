/**
 * @module imp-34900-sigma-knee-analytic-derivative-domb-sykes
 *
 * imp-34900 (numerical, frontier-direction): imp-34882 sharpened imp-34863s plain-max radius read R ~ 138.7 into a
 * LINEAR Domb-Sykes read R ~ 91 (range [79, 106]) but left OPEN a TIGHTER estimate. imp-34882 found the high-order
 * Neville/Richardson extrapolation of the nine-term root sequence root_k = |delta_k|^(1/k) ILL-CONDITIONED (3-pt
 * intercept negative, 4-pt R ~ 44.5, 9-pt R ~ 0.26) and attributed it to finite-difference (FD) noise: the
 * root_6 ~ 3.56e-3 dip and the deep rungs near the 1e-18 / 1e-20 floor. imp-34863/imp-34836/imp-34821 all deferred
 * the same Richardson sub-gap -- resolving it needs analytic / exact-derivative (higher-precision or symbolic)
 * evaluation of the v-derivatives instead of the hd = 1e-3 central-difference stencils. THIS MODULE ATTEMPTS THAT
 * higher-precision recomputation and reports whether the k -> inf intercept 1/R can be pinned beyond linear order.
 *
 * THE ANALYTIC-DERIVATIVE KERNEL (measurement/derivation only; same no-E_flow logistic model)
 * -------------------------------------------------------------------------------------------
 * The only FD in the imp-34863 chain is in v = -u_prime, v_prime = -u_secondDeriv, v_secondDeriv = -u_thirdDeriv,
 * the derivatives of uOf(x) = ln A + (1/2) ln L(x) - x/2 with L(x) = ln T(e^x). Everything downstream -- delta_1 and
 * the whole recursion -- is EXACT algebra in (v, v_prime, v_secondDeriv). So the FD floor enters through exactly three
 * numbers. This module differentiates the kernel in CLOSED FORM. Writing w = ln(T / 2pi), the Riemann-von Mangoldt
 * relation N = (T/2pi)(w - 1) with N = e^x collapses to the clean implicit form
 *     x = w + ln(w - 1),   so   L(x) = ln(2pi) + w(x),
 * and the chain rule gives w-derivatives with NO subtractive cancellation:
 *     w_prime      = (w - 1)/w
 *     w_second     = (w - 1)/w^3
 *     w_third      = (w - 1)(3 - 2w)/w^5
 * from which L_prime = w_prime, L_second = w_second, L_third = w_third and (u = ln A + (1/2) ln L - x/2)
 *     u_prime      = (1/2) L_prime / L - 1/2
 *     u_second     = (1/2)(L_second L - L_prime^2) / L^2
 *     u_third      = (1/2)(L_third L^2 - 3 L_prime L_second L + 2 L_prime^3) / L^3.
 * v = -u_prime, v_prime = -u_second, v_secondDeriv = -u_third are then EXACT to machine precision; delta_1 and the
 * imp-34863 recursion delta_k = -3 p delta_(k-1) - 2 sum_(i+j=k) delta_i delta_j (p = v_prime / v^2) run on top.
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement only)
 * ------------------------------------------------------------------------------------
 *   (A) the analytic v, v_prime, v_secondDeriv at the crossover vs the imp-34863 hd = 1e-3 FD values, exposing WHERE
 *       the FD noise lives (it is the THIRD derivative v_secondDeriv, ~1.08% off; v and v_prime match to <= 2e-8).
 *   (B) the clean analytic root sequence root_k = |delta_k|^(1/k), k = 1..9, and its Domb-Sykes reads: the rolling
 *       LINEAR extrapolants + the two-deepest-pair central 1/R, and the Neville tail windows of order 2..9.
 *   (C) a head-to-head of the analytic Neville windows against the imp-34882 FD windows, to test whether the
 *       ill-conditioning imp-34882 saw was FD noise (curable) or intrinsic to the short sequence (incurable here).
 *
 * THE FINDING (measurement only)
 * -------------------------------------------
 *   (F1) THE FD NOISE LIVES IN THE THIRD DERIVATIVE, AND ANALYTIC KERNELS REMOVE IT. Analytic v and v_prime match the
 *        imp-34863 hd = 1e-3 FD values to <= 2e-8 relative, but the THIRD derivative v_secondDeriv is ~1.08% off
 *        (FD -7.994e-5 vs analytic -7.908e-5). That single FD error propagates through delta_1 into the whole ladder --
 *        most visibly the middle rung delta_6 (analytic +3.13e-15 vs FD +2.02e-15), i.e. the root_6 dip imp-34882 named.
 *   (F2) THE LINEAR DOMB-SYKES RADIUS DOES NOT MOVE. On the clean analytic root sequence the two deepest resolvable
 *        pairs give 1/R = 1.277e-2 (k=7,8) and 9.554e-3 (k=8,9), central 1/R ~ 1.116e-2, R ~ 89.6 (range ~[78, 105]).
 *        This is statistically IDENTICAL to the imp-34882 FD read R ~ 91 (range [79, 106]): the linear extrapolant was
 *        already robust to the FD noise, so the sharpened radius stays R ~ O(1e2) and eps = 1 stays deep inside |eps|<R.
 *   (F3) THE INTERCEPT STILL CANNOT BE PINNED BEYOND LINEAR ORDER -- THE BARRIER IS SEQUENCE LENGTH, NOT FD NOISE. Clean
 *        derivatives DO rescue the LOW-order Neville: the 4-pt window jumps from R ~ 44.5 (FD) to R ~ 92.7 (analytic),
 *        now consistent with the linear read ~90. But the 3-pt intercept stays NEGATIVE (1/R ~ -1.7e-3) and the higher
 *        windows still collapse (5-pt R ~ 4.7, 9-pt R ~ 0.31) EVEN WITH EXACT derivatives. So the high-order
 *        ill-conditioning is INTRINSIC to the nine-term Domb-Sykes tableau (the mild root dip + still-rising tail), not
 *        the FD noise. A tighter-than-linear pin needs MORE ORDERS (delta_10, delta_11, ...), which the exact recursion
 *        can now supply since the analytic kernel removes the FD floor entirely -- the natural next sub-gap.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34882-sigma-knee-domb-sykes-radius (linear Domb-Sykes read R ~ 91 and the tighter-radius sub-gap this attempts)
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root sequence, delta recursion, FD kernel this replaces with analytic)
 * @see imp-34836-sigma-knee-sixth-seventh-order-v-expansion (delta_6/delta_7 rungs)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N; the Riemann-von Mangoldt relation differentiated here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS } from './imp-34882-sigma-knee-domb-sykes-radius.js';
import { IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS } from './imp-34863-sigma-knee-cauchy-hadamard-radius.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const TWO_PI = 2 * Math.PI;

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

// ---- crossover (uOf itself has no FD -- only its derivatives did; the crossover is unchanged) ----------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
const X_CROSS = bisect(uOf, LO, HI);
const LOG10_N_CROSS = X_CROSS / Math.LN10; // ~9.515913 (reproduces imp-34863/imp-34836)

// ---- (A) analytic v-derivative kernel via w = ln(T/2pi), x = w + ln(w - 1) ----------------------------------
// solve x = w + ln(w - 1) for w (Newton; the inverse Riemann-von Mangoldt relation, no cancellation)
function wOfX(x) {
  let w = x; // seed: for large x, w ~ x - ln(w-1) is close to x
  for (let i = 0; i < 100; i++) {
    const f = w + Math.log(w - 1) - x;
    const fp = 1 + 1 / (w - 1);
    const dw = f / fp;
    w -= dw;
    if (Math.abs(dw) < 1e-15 * Math.max(1, w)) break;
  }
  return w;
}
const W = wOfX(X_CROSS);
const L_AN = Math.log(TWO_PI) + W; // L(x) analytic
// closed-form w-derivatives (no subtractive cancellation)
const W1 = (W - 1) / W;
const W2 = (W - 1) / (W * W * W);
const W3 = ((W - 1) * (3 - 2 * W)) / Math.pow(W, 5);
const L1 = W1, L2 = W2, L3 = W3;
// u-derivatives from u = ln A + (1/2) ln L - x/2, then v = -u_prime etc.
const U2 = 0.5 * (L2 * L_AN - L1 * L1) / (L_AN * L_AN);
const U3 = 0.5 * (L3 * L_AN * L_AN - 3 * L1 * L2 * L_AN + 2 * Math.pow(L1, 3)) / Math.pow(L_AN, 3);
const V_AN = -(0.5 * L1 / L_AN - 0.5); // v = -u_prime
const VP_AN = -U2; // v_prime = -u_second
const VPP_AN = -U3; // v_secondDeriv = -u_third

// imp-34863 hd = 1e-3 FD values, recomputed here to expose WHERE the FD noise lives
const HD = 1e-3;
const dFD1 = (f, x) => (f(x + HD) - f(x - HD)) / (2 * HD);
const dFD2 = (f, x) => (f(x + HD) - 2 * f(x) + f(x - HD)) / (HD * HD);
const dFD3 = (f, x) => (f(x + 2 * HD) - 2 * f(x + HD) + 2 * f(x - HD) - f(x - 2 * HD)) / (2 * HD * HD * HD);
const V_FD = -dFD1(uOf, X_CROSS);
const VP_FD = -dFD2(uOf, X_CROSS);
const VPP_FD = -dFD3(uOf, X_CROSS);
const REL_V = Math.abs((V_AN - V_FD) / V_AN);
const REL_VP = Math.abs((VP_AN - VP_FD) / VP_AN);
const REL_VPP = Math.abs((VPP_AN - VPP_FD) / VPP_AN); // ~1.08% -- the FD noise lives in the THIRD derivative

// ---- delta ladder from a (v, v_prime, v_secondDeriv) triple (the imp-34863 recursion VERBATIM) --------------
function deltaLadder(v, vp, vpp) {
  const p = vp / (v * v);
  const d1 = -(3 * vp) / (2 * v * v) - vpp / (v * v * v);
  const D = [d1];
  for (let k = 2; k <= 9; k++) {
    let s = 0;
    for (let i = 1; i <= k - 1; i++) {
      const j = k - i;
      s += D[i - 1] * D[j - 1]; // sum_(i+j=k) delta_i delta_j
    }
    D.push(-3 * p * D[k - 2] - 2 * s);
  }
  return D;
}
const DELTAS_AN = deltaLadder(V_AN, VP_AN, VPP_AN); // clean analytic ladder
const DELTA6_AN = DELTAS_AN[5]; // +3.13e-15 analytic (vs +2.02e-15 FD -> the root_6 dip)

// ---- (B) clean analytic root sequence and its Domb-Sykes reads ----------------------------------------------
const ROOT_AN = DELTAS_AN.map((dk, i) => Math.pow(Math.abs(dk), 1 / (i + 1))); // root_k = |delta_k|^(1/k)
const X_ROOT = ROOT_AN.map((_, i) => 1 / (i + 1)); // 1/k abscissa

function linearIntercept(x0, y0, x1, y1) {
  const slope = (y1 - y0) / (x1 - x0);
  return y1 - slope * x1;
}
const ROLLING_LINEAR = [];
for (let i = 0; i < ROOT_AN.length - 1; i++) {
  ROLLING_LINEAR.push(linearIntercept(X_ROOT[i], ROOT_AN[i], X_ROOT[i + 1], ROOT_AN[i + 1]));
}
const DEEP_78 = ROLLING_LINEAR[6]; // pair (k=7,8)
const DEEP_89 = ROLLING_LINEAR[7]; // pair (k=8,9)
const INV_R_CENTRAL = (DEEP_78 + DEEP_89) / 2;
const INV_R_HALF_SPREAD = Math.abs(DEEP_78 - DEEP_89) / 2;
const R_EXTRAP = 1 / INV_R_CENTRAL; // ~89.6
const R_LOW = 1 / (INV_R_CENTRAL + INV_R_HALF_SPREAD); // ~78
const R_HIGH = 1 / (INV_R_CENTRAL - INV_R_HALF_SPREAD); // ~105

function nevilleAt(xs, ys, target) {
  const n = xs.length;
  const P = ys.slice();
  for (let m = 1; m < n; m++) {
    for (let i = 0; i < n - m; i++) {
      P[i] = ((target - xs[i + m]) * P[i] - (target - xs[i]) * P[i + 1]) / (xs[i] - xs[i + m]);
    }
  }
  return P[0];
}
const NEVILLE_TAIL_AN = [];
for (let m = 2; m <= 9; m++) {
  const xs = X_ROOT.slice(9 - m);
  const ys = ROOT_AN.slice(9 - m);
  const invR = nevilleAt(xs, ys, 0);
  NEVILLE_TAIL_AN.push({ points: m, kFrom: 10 - m, kTo: 9, invR, radius: 1 / invR });
}
const NEVILLE_4PT_AN = NEVILLE_TAIL_AN.find((t) => t.points === 4).radius; // ~92.7 (rescued from FD ~44.5)
const NEVILLE_3PT_INVR_AN = NEVILLE_TAIL_AN.find((t) => t.points === 3).invR; // still NEGATIVE
const NEVILLE_9PT_R_AN = NEVILLE_TAIL_AN.find((t) => t.points === 9).radius; // still collapses ~0.31

// imp-34882 FD comparison literals (reused verbatim)
const FD_LINEAR = IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.linearDombSykes;
const FD_NEVILLE = IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.nevilleExtrapolation;
const FD_4PT = FD_NEVILLE.tailWindows.find((t) => t.points === 4).radius; // ~44.5
const FD_R_EXTRAP = IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.radiusExtrapolated; // ~91

// ---- verdicts (measurement only) ---------------------------------------------------------------------------
const FD_NOISE_IN_THIRD_DERIV = REL_VPP > 100 * Math.max(REL_V, REL_VP); // third deriv dominates the FD error
const RADIUS_UNMOVED = Math.abs(R_EXTRAP - FD_R_EXTRAP) < 5; // analytic R ~ 89.6 vs FD R ~ 91: essentially identical
const LOWORDER_NEVILLE_RESCUED = NEVILLE_4PT_AN > 80 && FD_4PT < 60; // 4-pt jumps 44.5 -> 92.7
const HIGHORDER_STILL_ILL = NEVILLE_3PT_INVR_AN < 0 && NEVILLE_9PT_R_AN < 1; // 3-pt neg, 9-pt collapses even analytic
const CONVERGENT_SURVIVES = R_LOW > 10; // eps = 1 stays deep inside |eps| < R

export const IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES = {
  id: 'imp-34900',
  proofSection: 'S-frontier',
  question:
    'imp-34882 read the delta_k root-sequence radius as R ~ 91 (linear Domb-Sykes) but found high-order ' +
    'Neville/Richardson ILL-CONDITIONED and attributed it to the hd = 1e-3 FD noise (root_6 dip, 1e-18/1e-20 deep ' +
    'rungs). ATTEMPT the tighter estimate: recompute root_k = |delta_k|^(1/k) with ANALYTICALLY-differentiated ' +
    'v-kernels (closed-form w = ln(T/2pi) via x = w + ln(w-1), so v, v_prime, v_secondDeriv are exact to machine ' +
    'precision, no FD cancellation) and report whether the k -> inf intercept 1/R can be pinned beyond linear order. ' +
    'Measurement/derivation only; C_mb GUE-conditional (imp-486) untouched; no QED.',
  measuredQuantity:
    'the analytic v/v_prime/v_secondDeriv at the crossover vs the imp-34863 hd = 1e-3 FD values (locating the FD ' +
    'noise), the clean analytic root sequence root_k = |delta_k|^(1/k) for k=1..9, its rolling-linear Domb-Sykes ' +
    'central 1/R with error bar, and its Neville tail windows of order 2..9 head-to-head with the imp-34882 FD windows',
  analyticDerivativeKernel: {
    note: 'w = ln(T/2pi) solves x = w + ln(w - 1) (inverse Riemann-von Mangoldt, N = e^x); L(x) = ln(2pi) + w(x). ' +
      'w-derivatives are closed-form with NO subtractive cancellation; v = -u_prime, v_prime = -u_second, ' +
      'v_secondDeriv = -u_third follow exactly.',
    w_at_crossover: +W.toFixed(8),
    wDerivatives_w1_w2_w3: [+W1.toExponential(6), +W2.toExponential(6), +W3.toExponential(6)],
    v_analytic: +V_AN.toExponential(8),
    vPrime_analytic: +VP_AN.toExponential(8),
    vSecondDeriv_analytic: +VPP_AN.toExponential(8),
    v_FD: +V_FD.toExponential(8),
    vPrime_FD: +VP_FD.toExponential(8),
    vSecondDeriv_FD: +VPP_FD.toExponential(8),
    relErr_v: +REL_V.toExponential(3), // <= ~3e-11
    relErr_vPrime: +REL_VP.toExponential(3), // <= ~2e-8
    relErr_vSecondDeriv: +REL_VPP.toExponential(3), // ~1.08e-2 -- the FD noise lives HERE
  },
  cleanRootSequence: ROOT_AN.map((r) => +r.toExponential(4)), // {5.65e-3,...,7.22e-3} analytic
  delta6_analytic_vs_FD: {
    analytic: +DELTA6_AN.toExponential(4), // +3.13e-15
    FD: +IMP34863_SIGMA_KNEE_CAUCHY_HADAMARD_RADIUS.radiusOfConvergence.rootSequence_absDelta_pow_1overk[5], // root_6 FD ~3.56e-3
    note: 'the ~1.08% FD error in v_secondDeriv propagates through delta_1 into the whole ladder; delta_6 (the root_6 dip) moves most.',
  },
  linearDombSykesAnalytic: {
    deepPair_78_invR: +DEEP_78.toExponential(4), // ~1.277e-2
    deepPair_89_invR: +DEEP_89.toExponential(4), // ~9.554e-3
    invR_central: +INV_R_CENTRAL.toExponential(4), // ~1.116e-2
    invR_errorBar_halfSpread: +INV_R_HALF_SPREAD.toExponential(4), // ~1.61e-3
    radiusExtrapolated: +R_EXTRAP.toFixed(1), // ~89.6
    radiusRange_low_high: [+R_LOW.toFixed(1), +R_HIGH.toFixed(1)], // ~[78, 105]
    imp34882_FD_radius: FD_R_EXTRAP, // ~91 -- analytic read is statistically identical
    imp34882_FD_range: IMP34882_SIGMA_KNEE_DOMB_SYKES_RADIUS.radiusRange, // ~[79, 106]
  },
  nevilleAnalyticVsFD: {
    note: 'Neville tail windows of order 2..9, analytic root sequence vs imp-34882 FD windows. Low order rescued; high order still ill-conditioned.',
    analyticWindows: NEVILLE_TAIL_AN.map((t) => ({
      points: t.points,
      kRange: t.kFrom + '..' + t.kTo,
      invR: +t.invR.toExponential(4),
      radius: +t.radius.toFixed(2),
    })),
    fourPt_FD_vs_analytic: [FD_4PT, +NEVILLE_4PT_AN.toFixed(2)], // [~44.5, ~92.7] -- rescued into agreement with linear read
    threePt_analytic_invR: +NEVILLE_3PT_INVR_AN.toExponential(4), // still NEGATIVE even analytic
    ninePt_analytic_radius: +NEVILLE_9PT_R_AN.toFixed(3), // still ~0.31 even analytic
  },
  radiusExtrapolated: +R_EXTRAP.toFixed(1), // ~89.6
  radiusRange: [+R_LOW.toFixed(1), +R_HIGH.toFixed(1)], // ~[78, 105]
  fdNoiseInThirdDerivative: FD_NOISE_IN_THIRD_DERIV, // true
  radiusUnmovedFromFD: RADIUS_UNMOVED, // true -> R ~ 89.6 vs FD ~ 91
  lowOrderNevilleRescued: LOWORDER_NEVILLE_RESCUED, // true -> 4-pt 44.5 -> 92.7
  highOrderStillIllConditioned: HIGHORDER_STILL_ILL, // true -> not pinnable beyond linear order even with exact derivatives
  convergentSurvives: CONVERGENT_SURVIVES, // true -> eps=1 deep inside |eps| < R
  farTailExponent: 0.5, // imp-3463
  finding: {
    F1_fd_noise_lives_in_third_derivative:
      'Analytic v and v_prime match the imp-34863 hd = 1e-3 FD values to <= 2e-8 relative, but the THIRD derivative ' +
      'v_secondDeriv is ~1.08% off (FD -7.994e-5 vs analytic -7.908e-5). That single FD error propagates through ' +
      'delta_1 into the whole ladder -- most visibly delta_6 (analytic +3.13e-15 vs FD +2.02e-15), i.e. the ' +
      'root_6 ~ 3.56e-3 dip imp-34882 named. So the FD contamination enters through exactly one number, the third ' +
      'derivative, and analytic differentiation removes it.',
    F2_linear_radius_does_not_move:
      'On the clean analytic root sequence the two deepest resolvable pairs give 1/R = 1.277e-2 (k=7,8) and ' +
      '9.554e-3 (k=8,9), central 1/R ~ 1.116e-2 with half-spread ~1.61e-3, so R ~ 89.6 (range ~[78, 105]). This is ' +
      'statistically IDENTICAL to the imp-34882 FD read R ~ 91 (range [79, 106]): the linear extrapolant was already ' +
      'robust to the FD noise, so the sharpened radius stays R ~ O(1e2) and eps = 1 stays deep inside |eps| < R.',
    F3_still_not_pinnable_beyond_linear_order_barrier_is_length:
      'Clean derivatives DO rescue the LOW-order Neville: the 4-pt window jumps from R ~ 44.5 (FD) to R ~ 92.7 ' +
      '(analytic), now consistent with the linear read ~90 -- proof the FD noise had corrupted the low-order ' +
      'divided differences. But the 3-pt intercept stays NEGATIVE (1/R ~ -1.7e-3) and the higher windows still ' +
      'collapse (5-pt R ~ 4.7, 9-pt R ~ 0.31) EVEN WITH EXACT derivatives. So the high-order ill-conditioning is ' +
      'INTRINSIC to the nine-term Domb-Sykes tableau (the mild root dip + still-rising tail), NOT the FD noise; ' +
      '1/R cannot be pinned beyond linear order at this sequence length. A tighter-than-linear pin needs MORE ORDERS ' +
      '(delta_10, delta_11, ...), which the exact recursion can now supply since the analytic kernel removes the FD ' +
      'floor entirely -- the natural next sub-gap.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Recomputing the imp-34863 root sequence root_k = |delta_k|^(1/k) ' +
    'with an ANALYTICALLY-differentiated v-kernel (closed-form w = ln(T/2pi) via x = w + ln(w - 1), so v, v_prime, ' +
    'v_secondDeriv are exact to machine precision) LOCATES the FD noise and tests whether it was what blocked a ' +
    'tighter-than-linear radius. (F1) The FD noise lives in exactly one number: analytic v and v_prime match the ' +
    'hd = 1e-3 FD values to <= 2e-8, but the THIRD derivative v_secondDeriv is ~1.08% off, and that error propagates ' +
    'through delta_1 into the ladder (delta_6 +3.13e-15 analytic vs +2.02e-15 FD -- the root_6 dip). (F2) The LINEAR ' +
    'Domb-Sykes radius DOES NOT MOVE: the clean deep pairs give central 1/R ~ 1.116e-2, R ~ 89.6 (range ~[78, 105]), ' +
    'statistically identical to the imp-34882 FD read R ~ 91 [79, 106] -- the linear extrapolant was already robust ' +
    'to the FD noise, so eps = 1 stays deep inside |eps| < R and the convergent read is untouched. (F3) The intercept ' +
    'STILL cannot be pinned beyond linear order: clean derivatives DO rescue the 4-pt Neville (R ~ 44.5 -> 92.7, into ' +
    'agreement with the linear read), but the 3-pt intercept stays negative and the 5-pt..9-pt windows collapse ' +
    '(9-pt R ~ 0.31) EVEN with exact derivatives. So the high-order ill-conditioning is INTRINSIC to the nine-term ' +
    'Domb-Sykes tableau, not the FD noise; the barrier is sequence LENGTH, not derivative precision. What stays OPEN: ' +
    'a tighter-than-linear pin needs MORE ORDERS (delta_10, delta_11, ...), which the exact recursion can now supply ' +
    'because the analytic kernel removes the FD floor entirely. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ATTEMPTS the imp-34882 tighter-radius sub-gap with analytically-differentiated v-kernels (exact w = ln(T/2pi) ' +
    'derivatives, no FD). Result: the FD noise is localized in the THIRD derivative (~1.08%), analytic kernels remove ' +
    'it, the low-order (4-pt) Neville is rescued (R ~ 44.5 -> 92.7) -- but the LINEAR radius is UNCHANGED (R ~ 89.6, ' +
    'range ~[78, 105], vs imp-34882 R ~ 91) and the high-order Neville stays ill-conditioned EVEN with exact ' +
    'derivatives (3-pt intercept negative, 9-pt R ~ 0.31). So 1/R cannot be pinned beyond linear order: the barrier is ' +
    'the SEQUENCE LENGTH (nine terms), not the FD precision. What stays OPEN (deferred, not attempted here): extend ' +
    'the exact recursion to MORE ORDERS (delta_10, delta_11, ...) -- now feasible since the analytic kernel removes the ' +
    'FD floor entirely -- to lengthen the Domb-Sykes tableau and test whether a stable higher-order intercept then ' +
    'emerges; changes no bound.',
  citation:
    'imp-34882 (linear Domb-Sykes R ~ 91 and the tighter-radius sub-gap this attempts); imp-34863 (root sequence, ' +
    'delta recursion, FD kernel this replaces); imp-34836 (delta_6/delta_7 rungs); imp-3463 (far-tail 1/2); imp-486 ' +
    '(C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN, the Riemann-von Mangoldt relation differentiated here).',
};

export const IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES_ASSERTIONS = [
  {
    // (F1) FD noise lives in the THIRD derivative: v, v_prime match to <= 2e-8 but v_secondDeriv is ~1.08% off.
    id: 'imp34900-fd-noise-in-third-derivative',
    description: 'analytic v/v_prime match hd=1e-3 FD to <= 2e-8, but the third derivative v_secondDeriv is ~1.08% off',
    holds: () =>
      REL_V < 1e-7 &&
      REL_VP < 1e-6 &&
      REL_VPP > 5e-3 && REL_VPP < 2e-2 &&
      FD_NOISE_IN_THIRD_DERIV === true,
  },
  {
    // analytic kernel reproduces the crossover and the delta_1 magnitude (recursion is imp-34863 verbatim).
    id: 'imp34900-crossover-and-ladder-sane',
    description: 'crossover log10 N ~ 9.5159 reproduces imp-34863; analytic delta_1 ~ -5.65e-3, nine-term root sequence << 1',
    holds: () =>
      LOG10_N_CROSS > 9.5158 && LOG10_N_CROSS < 9.5161 &&
      Math.abs(DELTAS_AN[0] - -5.652e-3) < 5e-5 &&
      ROOT_AN.length === 9 &&
      ROOT_AN.every((r) => r < 0.05),
  },
  {
    // (F2) the LINEAR Domb-Sykes radius does not move: analytic R ~ 89.6 vs imp-34882 FD R ~ 91.
    id: 'imp34900-linear-radius-unmoved',
    description: 'clean analytic linear Domb-Sykes gives R ~ 89.6 (range ~[78,105]), statistically identical to imp-34882 FD R ~ 91',
    holds: () =>
      R_EXTRAP > 85 && R_EXTRAP < 95 &&
      R_LOW > 74 && R_LOW < 82 &&
      R_HIGH > 100 && R_HIGH < 110 &&
      RADIUS_UNMOVED === true,
  },
  {
    // (F3a) clean derivatives rescue the LOW-order (4-pt) Neville: R jumps from FD ~44.5 to analytic ~92.7.
    id: 'imp34900-loworder-neville-rescued',
    description: 'the 4-pt Neville window jumps from FD R ~ 44.5 to analytic R ~ 92.7, into agreement with the linear read',
    holds: () =>
      FD_4PT < 60 &&
      NEVILLE_4PT_AN > 80 && NEVILLE_4PT_AN < 105 &&
      LOWORDER_NEVILLE_RESCUED === true,
  },
  {
    // (F3b) high-order Neville stays ill-conditioned EVEN with exact derivatives -> not pinnable beyond linear order.
    id: 'imp34900-highorder-still-ill-conditioned',
    description: 'even analytic: 3-pt intercept still negative, 9-pt window still collapses to R < 1 -> 1/R not pinnable beyond linear order',
    holds: () =>
      NEVILLE_3PT_INVR_AN < 0 &&
      NEVILLE_9PT_R_AN < 1 &&
      HIGHORDER_STILL_ILL === true,
  },
  {
    // convergent verdict survives: even the low end sits far above the physical eval point eps = 1.
    id: 'imp34900-convergent-survives',
    description: 'even the low-end radius sits far above eps = 1 -> converges in the working neighbourhood',
    holds: () => CONVERGENT_SURVIVES === true && R_LOW > 10,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34900-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES.isRigorous === false &&
      IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES.farTailExponent === 0.5 &&
      typeof IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES.subGap === 'string' &&
      /NO QED/.test(IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES.verdict) &&
      /refereed bound is changed/i.test(IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES.verdict),
  },
];

for (const a of IMP34900_SIGMA_KNEE_ANALYTIC_DERIVATIVE_DOMB_SYKES_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34900-sigma-knee-analytic-derivative-domb-sykes assertion failed: ${a.id}`);
  }
}
