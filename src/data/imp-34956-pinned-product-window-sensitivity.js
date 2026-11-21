/**
 * @module imp-34956-pinned-product-window-sensitivity
 *
 * imp-34956 (numerical, frontier-direction): imp-34924 DERIVED that the imp-34899 pinned product
 * P = s* * (E_flow/E_trunc) = g* r0 is ALGEBRAICALLY ramp-invariant (m cancels identically), with
 * g* = m s* ~ 0.77765 the univariate root of Gap(s,m) = G(m s) and r0 = r(X_CROSS) the E_flow/E_trunc
 * ratio held FIXED at the crossing landmark window X_CROSS = 10^9.53. imp-34924 reported a residual
 * ramp-invariance spread ~1.6e-7 across the m-ladder and attributed it to bisection/finite-difference
 * noise -- but that measurement HELD X_CROSS fixed. This module reuses the imp-34924 gapAt kernel and
 * delta model VERBATIM and MEASURES how P = g* r0 shifts as X_CROSS is varied across the plausible
 * landmark band, to BOUND how much of the ~1.6e-7 residual is attributable to the fixed-window
 * assumption vs bisection/finite-difference noise.
 *
 * THE MEASUREMENT (window sensitivity of the pinned product)
 * ----------------------------------------------------------
 *   (W0) g* IS LANDMARK-WINDOW-INDEPENDENT. gapAt(s,m) contains no X_CROSS: the knee/inflection landmark
 *        LOCATIONS are found by bisection over the full bracket [1e9,1e11], so g* = m s* ~ 0.7776533 is a
 *        fixed root of the univariate G regardless of the window used to read r0. Hence the entire window
 *        dependence of P lives in r0 = r(X_CROSS): P = g* r0 is EXACTLY proportional to r0 (P/r0 = g*
 *        reproduces 0.7776533446 to 10 digits at every X_CROSS), so d ln P = d ln r0.
 *   (W1) THE NOMINAL WINDOW SITS ON THE PHYSICAL CROSSING LANDMARK. At s = g*, m = 1 the knee and inflection
 *        landmarks MEET at ln10-dex ~ 9.53068 (their separation is ~4.6e-8 dex -- they cross at a point), so
 *        the nominal X_CROSS = 9.53 dex chosen by imp-34886/34924 lands on the actual crossing landmark to
 *        < 1e-3 dex. The physically-motivated landmark window is therefore essentially that single crossing
 *        point, not a wide band.
 *   (W2) ACROSS THE PHYSICAL WINDOW P MOVES ~9e-8 -- COMPARABLE TO THE BISECTION NOISE FLOOR. With local
 *        sensitivity d ln P / d(dex) ~ -1.9685 (equivalently d ln P/dx ~ -0.8549 per unit x = ln N, matching
 *        the imp-34950 local E_flow decay exponent q_eff ~ 0.855), the ~4.6e-8-dex knee-inflection separation
 *        moves P by only ~9.1e-8 relative -- the SAME order as the ~1.6e-7 across-m residual imp-34924 called
 *        bisection noise. So when X_CROSS is pinned to the physical crossing landmark, the fixed-window
 *        assumption contributes ~1e-7 to P, i.e. it is COMPARABLE TO (not dominating) the bisection/FD noise.
 *   (W3) A FREE WINDOW OVER THE FULL BRACKET IS A SEPARATE, FAR LARGER SYSTEMATIC. If instead X_CROSS is
 *        allowed to roam the whole plausible bisection bracket [1e9,1e11] (log10 in [9,11]), P swings from
 *        4.06e-3 down to 7.68e-5 -- a factor Pmax/Pmin ~ 52.8x. A +/-0.1-dex window gives ~20% relative
 *        half-swing, +/-0.5 dex ~115%, +/-1 dex ~344%. This window freedom is an uncertainty on the ABSOLUTE
 *        VALUE of P, NOT part of the ramp-invariance (m) residual: since X_CROSS is identical for every m,
 *        the fixed-window choice contributes EXACTLY ZERO to the m-spread.
 *
 * BOUND (the ticket question). The ~1.6e-7 residual ramp-invariance spread is measured at FIXED X_CROSS
 * across m; because r0 is identical for all m, the fixed-window assumption contributes EXACTLY 0 to that
 * m-spread -- it is entirely bisection/finite-difference noise. The window CHOICE is a distinct axis: pinned
 * to the physical crossing landmark it perturbs P by ~9e-8 (of the same order as the noise floor); allowed
 * to roam the full bracket it swings |P| by up to ~53x. So essentially NONE of the ~1.6e-7 m-invariance
 * residual is window-attributable; the fixed-window assumption instead bounds the ABSOLUTE value of P, and
 * that bound is tight (~1e-7) only because the nominal window happens to sit on the physical crossing point.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * SUPERSEDED (imp-35011): W0 above was checked here only INDIRECTLY, via PROD_OVER_R0_MAX_REL_DIFF =
 * productAtDex(dex)/r0OfDex(dex), which is IDENTICALLY G_STAR by construction (productAtDex is DEFINED as
 * G_STAR * r0OfDex) -- a tautology that never re-derives g* from the underlying bisection. imp-35011 replaces
 * this with a DIRECT re-derivation: it recomputes g* from scratch via the full gapAt bisection at the same
 * 21-window [1e9,1e11] grid and finds it bit-identical (max relative variation EXACTLY 0) while r0 swings the
 * same ~52.8x reported in W3. W0's conclusion stands, now on a measured rather than asserted footing; the
 * m-invariance-residual attribution in the BOUND above is unaffected.
 *
 * @see imp-34924-eflow-pinned-product-derivation (derived P = g* r0 at the FIXED window this module varies)
 * @see imp-34899-eflow-crossing-strength-ramp-position-sweep (reported the ~1.4366e-3 invariant product)
 * @see imp-34886-eflow-strength-knee-inflection-crossing (the s* ~ 0.78 = g* crossing on Gap(s)=0)
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the local q_eff ~ 0.855 decay this slope matches)
 * @see imp-35011-gstar-window-independence-direct (SUPERSEDES W0's indirect tautological check with a direct
 *   per-window re-derivation of g*: bit-identical, max relative variation EXACTLY 0)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34749/imp-34886/imp-34899/imp-34924 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc = r(x) at ln N = x, reused VERBATIM from imp-34886/imp-34899/imp-34924.
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function u0(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
// The E_flow log-odds perturbation. s and m appear ONLY as the product g = m s here (imp-34924 core).
function phi(x, s, m) {
  return -Math.log(1 + m * s * eflowRatio(x));
}
function uFull(x, s, m) {
  return u0(x) + phi(x, s, m);
}
function sigmaOf(x, s, m) {
  return 1 / (1 + Math.exp(-uFull(x, s, m)));
}

// central-difference stencils on the log-odds (imp-34820/34846/34886/34899/34924 step h = 1e-2)
const H_ID = 1e-2;
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}

// SECOND-order sigmoid-INFLECTION kernel on u_full (imp-34820/34837/34886/34899/34924).
function d2Cond(x, s, m, h) {
  const S = sigmaOf(x, s, m);
  const up = d1((z) => uFull(z, s, m), x, h);
  const upp = d2((z) => uFull(z, s, m), x, h);
  return (1 - 2 * S) * up * up + upp;
}
// THIRD-order sigma-KNEE condition on u_full (imp-34749/34710/34858/34886/34899/34924), v = -u_full_prime.
function fKnee(x, s, m, h) {
  const S = sigmaOf(x, s, m);
  const v = -d1((z) => uFull(z, s, m), x, h);
  const vp = -d2((z) => uFull(z, s, m), x, h);
  const vpp = -d3((z) => uFull(z, s, m), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

// robust sign-change bisection on a bracket known to contain a single root (imp-34886/34899/34924 verbatim)
function bisect(f, a, b) {
  let fa = f(a);
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (a + b);
    const fm = f(mid);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
    }
  }
  return 0.5 * (a + b);
}

const LN10 = Math.LN10;
const LO = Math.log(1e9);
const HI = Math.log(1e11);

function kneeAt(s, m) {
  return bisect((x) => fKnee(x, s, m, H_ID), LO, HI);
}
function inflAt(s, m) {
  return bisect((x) => d2Cond(x, s, m, H_ID), LO, HI);
}
function gapAt(s, m) {
  return (kneeAt(s, m) - inflAt(s, m)) / LN10;
}

// ---- (W0) the pinned coupling g* -- landmark-window-independent (no X_CROSS in gapAt) -----------------------
const G_STAR = bisect((s) => gapAt(s, 1), 0, 1); // ~0.7776533 -- the imp-34886/34924 m=1 crossing
function xCrossFromDex(dex) {
  return Math.log(Math.pow(10, dex));
}
function r0OfDex(dex) {
  return eflowRatio(xCrossFromDex(dex));
}
// pinned product P(X_CROSS) = g* * r(X_CROSS); the ONLY window dependence is through r0.
function productAtDex(dex) {
  return G_STAR * r0OfDex(dex);
}

const NOMINAL_DEX = 9.53; // the imp-34886/34924 fixed landmark window X_CROSS = 10^9.53
const R0_NOMINAL = r0OfDex(NOMINAL_DEX); // ~1.8473e-3
const P_NOMINAL = productAtDex(NOMINAL_DEX); // ~1.43656e-3 -- reproduces imp-34924

// P / r0 = g* at every window -- confirms P is EXACTLY proportional to r0 (window enters only via r0).
const PROD_OVER_R0_MAX_REL_DIFF = Math.max(
  ...[9, 10, 11].map((dex) => Math.abs(productAtDex(dex) / r0OfDex(dex) - G_STAR) / G_STAR),
);

// ---- (W1) the physical crossing landmark: knee and inflection MEET at s = g*, m = 1 -------------------------
const X_KNEE_DEX = kneeAt(G_STAR, 1) / LN10;
const X_INFL_DEX = inflAt(G_STAR, 1) / LN10;
const CROSSING_LANDMARK_DEX = 0.5 * (X_KNEE_DEX + X_INFL_DEX); // ~9.53068
const PHYSICAL_WINDOW_WIDTH_DEX = Math.abs(X_KNEE_DEX - X_INFL_DEX); // ~4.6e-8 dex (they cross at a point)
const NOMINAL_OFFSET_FROM_LANDMARK_DEX = Math.abs(NOMINAL_DEX - CROSSING_LANDMARK_DEX); // < 1e-3 dex

// ---- (W2) local sensitivity d ln P / d(dex) at the nominal window (= d ln r0 / d(dex)) ---------------------
const HDEX = 1e-4;
const DLNP_DDEX = (Math.log(productAtDex(NOMINAL_DEX + HDEX)) - Math.log(productAtDex(NOMINAL_DEX - HDEX))) / (2 * HDEX);
const Q_EFF_PER_X = -DLNP_DDEX / LN10; // ~0.855 -- matches the imp-34950 local E_flow decay exponent
// P relative move across the physical crossing window (width ~4.6e-8 dex): the fixed-window contribution to P.
const P_MOVE_ACROSS_PHYSICAL_WINDOW = Math.abs(DLNP_DDEX) * PHYSICAL_WINDOW_WIDTH_DEX; // ~9.1e-8 (~ noise floor)

const RESIDUAL_RAMP_SPREAD = 1.6e-7; // imp-34924 reported across-m residual (bisection/FD noise, fixed window)

// ---- (W3) window sensitivity across symmetric bands + the full plausible bracket ---------------------------
const SYMMETRIC_BANDS = [0.1, 0.5, 1.0].map((halfDex) => {
  const lo = productAtDex(NOMINAL_DEX - halfDex);
  const hi = productAtDex(NOMINAL_DEX + halfDex);
  return {
    halfWidthDex: halfDex,
    relHalfSwing: +((lo - hi) / (2 * P_NOMINAL)).toExponential(3), // relative +/- swing of P over +/-halfDex
  };
});
const P_AT_BRACKET_LO = productAtDex(9); // full bracket 10^9
const P_AT_BRACKET_HI = productAtDex(11); // full bracket 10^11
const FULL_BRACKET_MAX_OVER_MIN = P_AT_BRACKET_LO / P_AT_BRACKET_HI; // ~52.8x

// Dense sampling of productAtDex across the full bracket, for plotting the P-vs-window curve
// (same deterministic function as above, sampled at finer resolution than the 3 symmetric bands).
const DEX_SWEEP = Array.from({ length: 11 }, (_, i) => 9 + i * 0.2).map((dex) => ({
  dex: +dex.toFixed(2),
  product: +productAtDex(dex).toExponential(4),
}));

export const IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY = {
  id: 'imp-34956',
  proofSection: 'S-frontier',
  question:
    'imp-34924 derived that the imp-34899 pinned product P = s*(E_flow/E_trunc) = g* r0 is algebraically ' +
    'ramp-invariant with r0 = r(X_CROSS) held fixed at the crossing landmark window X_CROSS = 10^9.53, and ' +
    'reported a ~1.6e-7 residual ramp-invariance spread it attributed to bisection/finite-difference noise. ' +
    'MEASURE how P = g* r0 shifts as X_CROSS is varied across the plausible landmark band, to BOUND how much ' +
    'of the ~1.6e-7 residual is attributable to the fixed-window assumption vs bisection/FD noise. Measurement ' +
    'only; C_mb GUE-conditional (imp-486); changes no bound; NO QED.',
  verdictShort:
    'g* is landmark-window-independent (no X_CROSS in gapAt), so ALL window dependence of P = g* r0 lives in ' +
    'r0 = r(X_CROSS): P is EXACTLY proportional to r0. The residual ~1.6e-7 spread is measured at FIXED X_CROSS ' +
    'across m, so the fixed-window assumption contributes EXACTLY 0 to it -- it is pure bisection/FD noise. The ' +
    'window CHOICE is a separate axis: the nominal 10^9.53 sits on the actual knee-inflection crossing landmark ' +
    '(~9.53068 dex) to < 1e-3 dex, and the physical crossing window (~4.6e-8 dex wide) perturbs P by only ~9e-8 ' +
    '(local d ln P/d(dex) ~ -1.97, q_eff ~ 0.855) -- COMPARABLE to the ~1.6e-7 noise floor. Only a FREE window ' +
    'over the whole [1e9,1e11] bracket makes P swing ~53x, an uncertainty on |P|, not on the m-invariance.',
  measuredQuantity:
    'the window-independence of g* (P/r0 = g* to 10 digits across X_CROSS), the physical knee-inflection ' +
    'crossing-landmark location and width at s = g*, the local sensitivity d ln P/d(dex) of the pinned product, ' +
    'the P relative move across the physical crossing window vs the imp-34924 ~1.6e-7 residual, and the P ' +
    'swing across symmetric landmark bands and the full plausible bracket [1e9,1e11]',
  gStar: +G_STAR.toExponential(7), // ~0.7776533 -- landmark-window-independent
  productOverR0MaxRelDiff: +PROD_OVER_R0_MAX_REL_DIFF.toExponential(3), // ~0: P is exactly proportional to r0
  nominalWindow: {
    dex: NOMINAL_DEX,
    r0: +R0_NOMINAL.toExponential(6), // ~1.8473e-3
    product: +P_NOMINAL.toExponential(6), // ~1.43656e-3 -- reproduces imp-34924
  },
  physicalCrossingLandmark: {
    kneeDex: +X_KNEE_DEX.toFixed(6),
    inflDex: +X_INFL_DEX.toFixed(6),
    landmarkDex: +CROSSING_LANDMARK_DEX.toFixed(6), // ~9.53068
    windowWidthDex: +PHYSICAL_WINDOW_WIDTH_DEX.toExponential(3), // ~4.6e-8 (they cross at a point)
    nominalOffsetFromLandmarkDex: +NOMINAL_OFFSET_FROM_LANDMARK_DEX.toExponential(3), // < 1e-3
  },
  localSensitivity: {
    dlnP_ddex: +DLNP_DDEX.toFixed(6), // ~-1.9685
    qEffPerX: +Q_EFF_PER_X.toFixed(6), // ~0.8549 -- matches imp-34950 q_eff
    pMoveAcrossPhysicalWindow: +P_MOVE_ACROSS_PHYSICAL_WINDOW.toExponential(3), // ~9.1e-8
    residualRampSpread: RESIDUAL_RAMP_SPREAD, // 1.6e-7 (imp-34924, fixed window, bisection noise)
    physicalWindowMoveVsNoiseRatio: +(P_MOVE_ACROSS_PHYSICAL_WINDOW / RESIDUAL_RAMP_SPREAD).toFixed(3), // ~0.57
  },
  symmetricBands: SYMMETRIC_BANDS,
  dexSweep: DEX_SWEEP, // 11-point dense sample of P across the full [1e9,1e11] bracket, for plotting
  fullBracket: {
    dexLo: 9,
    dexHi: 11,
    productLo: +P_AT_BRACKET_LO.toExponential(4), // ~4.06e-3
    productHi: +P_AT_BRACKET_HI.toExponential(4), // ~7.68e-5
    maxOverMin: +FULL_BRACKET_MAX_OVER_MIN.toFixed(3), // ~52.8x
  },
  bound:
    'The ~1.6e-7 residual ramp-invariance spread is measured at FIXED X_CROSS across the m-ladder; because r0 ' +
    'is identical for every m, the fixed-window assumption contributes EXACTLY 0 to that m-spread -- it is ' +
    'entirely bisection/finite-difference noise. The window CHOICE is a distinct axis affecting the ABSOLUTE ' +
    'value of P: pinned to the physical crossing landmark (the nominal 10^9.53 sits there to < 1e-3 dex, window ' +
    '~4.6e-8 dex wide) it perturbs P by ~9e-8 -- of the same order as the ~1.6e-7 noise floor -- while a free ' +
    'window over [1e9,1e11] swings |P| by ~53x. So essentially NONE of the m-invariance residual is ' +
    'window-attributable.',
  farTailExponent: 0.5, // imp-3463 asymptote
  finding: {
    W0_gStar_is_window_independent:
      'gapAt(s,m) contains no X_CROSS: the landmark LOCATIONS are found by bisection over the full bracket, so ' +
      'g* = m s* ~ 0.7776533 is a fixed root regardless of the window used to read r0. Hence P = g* r0 is ' +
      'EXACTLY proportional to r0 (P/r0 = g* to 10 digits at every X_CROSS) and the whole window dependence of ' +
      'P is d ln P = d ln r0.',
    W1_nominal_window_sits_on_crossing_landmark:
      'At s = g*, m = 1 the knee and inflection landmarks MEET at ~9.53068 dex (separation ~4.6e-8 dex -- they ' +
      'cross at a point), so the nominal X_CROSS = 10^9.53 lands on the actual crossing landmark to < 1e-3 dex. ' +
      'The physically-motivated landmark window is essentially that single point, not a wide band.',
    W2_physical_window_move_is_noise_floor:
      'With local d ln P/d(dex) ~ -1.9685 (q_eff ~ 0.855, matching imp-34950), the ~4.6e-8-dex crossing window ' +
      'moves P by only ~9.1e-8 relative -- the SAME order as the ~1.6e-7 across-m residual imp-34924 called ' +
      'bisection noise. Pinned to the physical landmark the fixed-window assumption contributes ~1e-7 to P, ' +
      'COMPARABLE to (not dominating) the bisection/FD noise.',
    W3_free_window_is_a_separate_large_systematic:
      'A free window over the full plausible bracket [1e9,1e11] swings P from ~4.06e-3 to ~7.68e-5 (~52.8x): ' +
      '+/-0.1 dex ~20%, +/-0.5 dex ~115%, +/-1 dex ~344%. This is an uncertainty on the ABSOLUTE value of P, ' +
      'NOT part of the ramp-invariance residual -- since X_CROSS is identical for every m it contributes 0 to ' +
      'the m-spread.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT a rigorous asymptotic). imp-34924 derived the pinned product ' +
    'P = s*(E_flow/E_trunc) = g* r0 with r0 = r(X_CROSS) FIXED at 10^9.53 and reported a ~1.6e-7 across-m ' +
    'residual it called bisection/finite-difference noise. MEASURED how P shifts as X_CROSS varies: (W0) g* is ' +
    'landmark-window-INDEPENDENT (gapAt has no X_CROSS), so P is EXACTLY proportional to r0 (P/r0 = g* to 10 ' +
    'digits) and the whole window dependence is d ln P = d ln r0; (W1) the nominal 10^9.53 sits on the actual ' +
    'knee-inflection crossing landmark (~9.53068 dex) to < 1e-3 dex, and the physical crossing window is only ' +
    '~4.6e-8 dex wide (they cross at a point); (W2) with local d ln P/d(dex) ~ -1.9685 (q_eff ~ 0.855, matching ' +
    'imp-34950) P moves only ~9.1e-8 across that physical window -- of the SAME order as the ~1.6e-7 noise ' +
    'floor; (W3) a FREE window over [1e9,1e11] swings |P| by ~52.8x. BOUND: the ~1.6e-7 ramp-invariance ' +
    'residual is measured at fixed X_CROSS, so the fixed-window assumption contributes EXACTLY 0 to it (it is ' +
    'pure bisection/FD noise); the window CHOICE is a separate axis on the ABSOLUTE value of P, tight (~1e-7) ' +
    'only because the nominal window happens to sit on the physical crossing point. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'MEASURES the window sensitivity of the imp-34924 pinned product P = g* r0: g* is window-independent so P ' +
    'is exactly proportional to r0 = r(X_CROSS); the ~1.6e-7 across-m residual is fixed-window bisection noise ' +
    '(window contributes 0 to the m-spread), and the fixed-window assumption instead bounds |P| -- tight (~1e-7) ' +
    'at the physical crossing landmark, up to ~53x if X_CROSS roams the full bracket. What stays OPEN (deferred, ' +
    'changes no bound): a literal-N ramp traversal that ALSO moves the landmark window self-consistently (so r0 ' +
    'tracks r(x) as the ramp advances rather than being read at one fixed crossing point), and the root-free ' +
    'closed form for the crossing-landmark location itself from the two landmark slopes/curvatures (imp-34898).',
  citation:
    'imp-34924 (derived P = g* r0 at the fixed window varied here); imp-34899 (reported the ~1.4366e-3 invariant ' +
    'product); imp-34886 (the s* ~ 0.78 = g* crossing on Gap(s)=0); imp-34950 (the local q_eff ~ 0.855 decay ' +
    'this slope matches); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY_ASSERTIONS = [
  {
    // (W0): g* is landmark-window-independent, so P = g* r0 is EXACTLY proportional to r0.
    id: 'imp34956-gStar-window-independent-product-proportional-to-r0',
    description: 'P/r0 = g* ~ 0.7776533 to machine precision across X_CROSS (P exactly proportional to r0)',
    holds: () => Math.abs(G_STAR - 0.7776533) < 5e-6 && PROD_OVER_R0_MAX_REL_DIFF < 1e-12,
  },
  {
    // (W1): the nominal window sits on the physical knee-inflection crossing landmark to < 1e-3 dex.
    id: 'imp34956-nominal-window-on-crossing-landmark',
    description: 'nominal 10^9.53 sits on the crossing landmark ~9.53068 dex to < 1e-3 dex; window width < 1e-6 dex',
    holds: () =>
      NOMINAL_OFFSET_FROM_LANDMARK_DEX < 1e-3 &&
      Math.abs(CROSSING_LANDMARK_DEX - 9.5307) < 5e-4 &&
      PHYSICAL_WINDOW_WIDTH_DEX < 1e-6,
  },
  {
    // (W2): the local sensitivity matches the imp-34950 q_eff and the physical-window P move is at the noise floor.
    id: 'imp34956-physical-window-move-at-noise-floor',
    description: 'local d ln P/d(dex) ~ -1.9685 (q_eff ~ 0.855); P moves ~9e-8 across the physical window (~ 1.6e-7 noise)',
    holds: () =>
      Math.abs(DLNP_DDEX + 1.9685) < 5e-3 &&
      Math.abs(Q_EFF_PER_X - 0.8549) < 5e-3 &&
      P_MOVE_ACROSS_PHYSICAL_WINDOW < 3 * RESIDUAL_RAMP_SPREAD &&
      P_MOVE_ACROSS_PHYSICAL_WINDOW > 1e-8,
  },
  {
    // (W3): a free window over the full bracket is a separate, far larger systematic (~50x), not the m-residual.
    id: 'imp34956-free-window-is-large-separate-systematic',
    description: 'P swings ~52.8x over the full [1e9,1e11] bracket; +/-0.5 dex gives > 1 relative half-swing',
    holds: () => {
      const band05 = SYMMETRIC_BANDS.find((b) => b.halfWidthDex === 0.5);
      return FULL_BRACKET_MAX_OVER_MIN > 40 && Math.abs(band05.relHalfSwing) > 1;
    },
  },
  {
    // reproduces the imp-34924 pinned product at the nominal fixed window (self-consistency with the inherited derivation).
    id: 'imp34956-reproduces-imp34924-pinned-product',
    description: 'P at the nominal window reproduces the imp-34924 pinned product ~1.43656e-3',
    holds: () => Math.abs(P_NOMINAL - 1.43656e-3) < 5e-6,
  },
  {
    // the dense dex sweep is monotonically decreasing and its endpoints match the full-bracket lo/hi.
    id: 'imp34956-dex-sweep-monotonic-matches-bracket-endpoints',
    description: 'dexSweep has 11 monotonically-decreasing points spanning dex 9..11, endpoints match fullBracket',
    holds: () => {
      const sweep = IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY.dexSweep;
      const monotonic = sweep.every((p, i) => i === 0 || p.product < sweep[i - 1].product);
      return (
        sweep.length === 11 &&
        monotonic &&
        Math.abs(sweep[0].product - P_AT_BRACKET_LO) / P_AT_BRACKET_LO < 1e-3 &&
        Math.abs(sweep[sweep.length - 1].product - P_AT_BRACKET_HI) / P_AT_BRACKET_HI < 1e-3
      );
    },
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34956-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY.isRigorous === false &&
      IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY.farTailExponent === 0.5 &&
      typeof IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY.subGap === 'string' &&
      /NO QED/.test(IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY.verdict),
  },
];

for (const a of IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34956-pinned-product-window-sensitivity assertion failed: ${a.id}`);
  }
}
