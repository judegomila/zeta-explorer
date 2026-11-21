/**
 * @module imp-35015-crossing-strength-exponent-window-stability
 *
 * imp-35015 (numerical, frontier): imp-34950 pinned the E_flow knee-vs-inflection crossing-strength
 * C_mb exponent p in s*(C_mb) = K C_mb^p to p = 1.5493 with a residual-based 95% CI ~ [1.5476, 1.5511],
 * extracted at the nominal 9.53-dex crossing landmark. imp-34956 SEPARATELY showed the landmark window
 * X_CROSS has ~52.8x freedom over the [1e9,1e11] bracket (r0 = r(X_CROSS) swings that much), while the
 * pinned coupling g* itself is landmark-window-INDEPENDENT (imp-34956 W0 / imp-35011). Whether the
 * SHARPLY-measured exponent p is itself stable under that window freedom -- a genuine surrogate constant
 * -- or is instead an artifact of the 9.53-dex window choice was untested. This module reuses the
 * imp-34950 21-point C_mb sweep and s* bisection kernels VERBATIM and re-extracts p at a 10-point grid of
 * X_CROSS windows across [1e9,1e11], PLUS the contrasting self-consistent tracking window, to determine
 * whether p drifts.
 *
 * WHY p COULD (OR COULD NOT) BE A WINDOW ARTIFACT (the question being tested)
 * --------------------------------------------------------------------------
 * The crossing-strength s*(C_mb) is found by the imp-34950 gap bisection (knee landmark = inflection
 * landmark), which searches the FULL x-bracket and contains no X_CROSS at all -- so s* carries no window.
 * The window enters only when s* is read into a pinned product P(C_mb; X_CROSS) = s*(C_mb) r(X_CROSS),
 * exactly as in the imp-34956/imp-34924 construction. Because r(X_CROSS) is C_mb-INDEPENDENT, multiplying
 * s*(C_mb) by it shifts ln P by the constant ln r0 -- it moves the PREFACTOR K -> K r0, not the slope
 * d ln P/d ln C_mb. So a FIXED window (any value in the bracket) leaves p exactly invariant. The ONLY way
 * a window can touch p is to TIE it to the C_mb-dependent crossing location x*(C_mb) (self-consistent
 * tracking, the imp-34956 open sub-gap): then d ln P/d ln C_mb = p + (d ln r/dx)(dx_star / d ln C_mb) =
 * p - q_eff (dx_star / d ln C_mb), a genuinely different effective exponent.
 *
 * THE FINDING (measurement only; answers imp-35015)
 * -------------------------------------------------
 *   (W1) p IS EXACTLY LANDMARK-WINDOW-STABLE. Re-extracting the pinned exponent at 10 X_CROSS windows
 *        spanning dex 9.0..11.0 gives p = 1.54933 at EVERY window, with a max spread ~2.4e-15 -- at the
 *        double-precision floor, ~12 orders below the imp-34950 se ~8.9e-4. So the sharply-measured p is
 *        a genuine surrogate constant, NOT an artifact of the nominal 9.53-dex window choice.
 *   (W2) THE ~52.8x WINDOW SWING LANDS ENTIRELY ON THE PREFACTOR. Across the same 10 windows the free-K
 *        fit prefactor K r0 swings by ~52.8x (matching the imp-34956 |P| bracket swing), while the slope
 *        is unmoved. The imp-34956 window freedom is thus an uncertainty on the pinned-product PREFACTOR,
 *        contributing EXACTLY 0 to the exponent -- because r(X_CROSS) is a C_mb-independent factor.
 *   (W3) ONLY A SELF-CONSISTENT TRACKING WINDOW SHIFTS THE EXPONENT. If X_CROSS is instead tied to the
 *        C_mb-dependent crossing location x*(C_mb) (the imp-34956 sub-gap direction), the effective
 *        exponent drops to p_track ~ -0.230 (free-K -0.232) -- a completely different number -- matching
 *        the structural prediction p - q_eff (dx_star / d ln C_mb) ~ 1.549 - 0.855(2.089) ~ -0.236 to ~3%. So
 *        the exponent is window-stable for any FIXED window and drifts ONLY when the window itself is
 *        made a function of C_mb.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound. This SWEEPS
 * C_mb and the X_CROSS window as free knobs; it does NOT discharge the GUE conditional (C_mb
 * GUE-conditional per imp-486). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT
 * a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463);
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the p = 1.5493 +/- 8.9e-4 exponent + CI this tests for window stability)
 * @see imp-34956-pinned-product-window-sensitivity (the ~52.8x X_CROSS window freedom this connects to the exponent)
 * @see imp-35011-gstar-window-independence-direct (the direct re-derivation that g* is bit-identical across X_CROSS windows)
 * @see imp-34973-pinned-product-slope-qeff-window-identity (the q_eff = -d ln r/dx window-wide identity used in W3)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL } from './imp-34950-eflow-crossing-strength-cmb-exponent-structural.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34886/imp-34950/imp-34956 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// --- kernels reused VERBATIM from imp-34950 (C_mb enters u_0 as an additive ln C_mb shift) ------------------
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
function u0(x, cmb) {
  return Math.log(cmb) + Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
function phi(x, s) {
  return -Math.log(1 + s * eflowRatio(x));
}
function uFull(x, s, cmb) {
  return u0(x, cmb) + phi(x, s);
}
function sigmaOf(x, s, cmb) {
  return 1 / (1 + Math.exp(-uFull(x, s, cmb)));
}
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
function d2Cond(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const up = d1((z) => uFull(z, s, cmb), x, h);
  const upp = d2((z) => uFull(z, s, cmb), x, h);
  return (1 - 2 * S) * up * up + upp;
}
function fKnee(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const v = -d1((z) => uFull(z, s, cmb), x, h);
  const vp = -d2((z) => uFull(z, s, cmb), x, h);
  const vpp = -d3((z) => uFull(z, s, cmb), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
function bisect(f, a, b) {
  let fa = f(a);
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return 0.5 * (a + b);
}
const LN10 = Math.LN10;
const LO = Math.log(1e6);
const HI = Math.log(1e13);
function kneeAt(s, cmb) {
  return bisect((x) => fKnee(x, s, cmb, H_ID), LO, HI);
}
function inflAt(s, cmb) {
  return bisect((x) => d2Cond(x, s, cmb, H_ID), LO, HI);
}
function gapAt(s, cmb) {
  return (kneeAt(s, cmb) - inflAt(s, cmb)) / LN10;
}
function sStarAt(cmb) {
  return bisect((s) => gapAt(s, cmb), 0, 1);
}

// --- the imp-34950 finer 21-point sweep over C_mb in [0.5, 1] (step 0.025), reused verbatim ------------------
// NOTE: s*(C_mb) is landmark-window-INDEPENDENT (gapAt contains no X_CROSS -- imp-34956 W0 / imp-35011);
// it is computed ONCE and re-used at every window below.
const CMB_GRID = [];
for (let i = 0; i <= 20; i++) {
  CMB_GRID.push(+(1.0 - 0.025 * i).toFixed(4));
}
const S_STAR = CMB_GRID.map((c) => sStarAt(c));
const S_STAR_AT_1 = S_STAR[0];
const LC = CMB_GRID.map((c) => Math.log(c));
const LS = S_STAR.map((s) => Math.log(s));
const NPTS = CMB_GRID.length;

// through-origin (pinned) and free-K log-log slope/intercept extractors, matching imp-34950 F1 exactly.
function pinnedSlope(logVals) {
  const l1 = logVals[0];
  let num = 0, den = 0;
  for (let i = 0; i < NPTS; i++) {
    num += (logVals[i] - l1) * LC[i];
    den += LC[i] * LC[i];
  }
  return num / den;
}
function freeFit(logVals) {
  let st = 0, sy = 0, stt = 0, sty = 0;
  for (let i = 0; i < NPTS; i++) {
    st += LC[i]; sy += logVals[i]; stt += LC[i] * LC[i]; sty += LC[i] * logVals[i];
  }
  const b = (NPTS * sty - st * sy) / (NPTS * stt - st * st);
  const a = (sy - b * st) / NPTS;
  return { slope: b, K: Math.exp(a) };
}

// baseline: the imp-34950 exponent from s* alone (no window factor).
const P_BASE = pinnedSlope(LS); // ~1.54933 -- reproduces imp-34950

// --- (W1)+(W2) re-extract the exponent at a 10-point X_CROSS window grid across [1e9,1e11] --------------------
function r0OfDex(dex) {
  return eflowRatio(Math.log(Math.pow(10, dex)));
}
const WINDOW_DEX = [9.0, 9.25, 9.5, 9.53, 9.75, 10.0, 10.25, 10.5, 10.75, 11.0];
const WINDOW_FITS = WINDOW_DEX.map((dex) => {
  const r0 = r0OfDex(dex);
  const LP = S_STAR.map((s) => Math.log(s * r0)); // pinned product P(C_mb; X_CROSS) = s*(C_mb) r0
  const free = freeFit(LP);
  return {
    dex,
    r0: +r0.toExponential(4),
    pPinned: pinnedSlope(LP),
    pFree: free.slope,
    prefactorK: free.K, // K r0 -- the window-dependent prefactor
  };
});
const P_FIXED_MIN = Math.min(...WINDOW_FITS.map((w) => w.pPinned));
const P_FIXED_MAX = Math.max(...WINDOW_FITS.map((w) => w.pPinned));
const P_FIXED_SPREAD = P_FIXED_MAX - P_FIXED_MIN; // ~2.4e-15 -- at the double-precision floor
const PREFACTOR_MAX = Math.max(...WINDOW_FITS.map((w) => w.prefactorK));
const PREFACTOR_MIN = Math.min(...WINDOW_FITS.map((w) => w.prefactorK));
const PREFACTOR_SWING = PREFACTOR_MAX / PREFACTOR_MIN; // ~52.8x -- matches imp-34956 bracket swing
const P_FREE_FIXED_SPREAD =
  Math.max(...WINDOW_FITS.map((w) => w.pFree)) - Math.min(...WINDOW_FITS.map((w) => w.pFree));

// --- (W3) contrast: a SELF-CONSISTENT tracking window X_CROSS = crossing location x*(C_mb) ------------------
// the crossing landmark location at each C_mb is x* = inflAt(s*(C_mb), C_mb) (= kneeAt at the crossing).
const LP_TRACK = [];
for (let i = 0; i < NPTS; i++) {
  const xStar = inflAt(S_STAR[i], CMB_GRID[i]);
  LP_TRACK.push(Math.log(S_STAR[i] * eflowRatio(xStar)));
}
const P_TRACK_PINNED = pinnedSlope(LP_TRACK); // ~-0.230
const P_TRACK_FREE = freeFit(LP_TRACK).slope; // ~-0.232

// structural prediction for the tracking exponent: p - q_eff (dx*/d ln C_mb), both measured at C_mb=1.
const X_STAR_AT_1 = inflAt(S_STAR_AT_1, 1.0);
const EPS = 1e-3;
const Q_EFF_AT_1 =
  -(Math.log(eflowRatio(X_STAR_AT_1 + EPS)) - Math.log(eflowRatio(X_STAR_AT_1 - EPS))) / (2 * EPS); // ~0.855
const XP = inflAt(sStarAt(1.0 * Math.exp(EPS)), 1.0 * Math.exp(EPS));
const XM = inflAt(sStarAt(1.0 * Math.exp(-EPS)), 1.0 * Math.exp(-EPS));
const DX_DLNCMB = (XP - XM) / (2 * EPS); // ~2.089 (the imp-34950 landmark-translation coefficient)
const P_TRACK_PREDICTED = P_BASE - Q_EFF_AT_1 * DX_DLNCMB; // ~-0.236
const P_TRACK_PRED_REL_ERR = Math.abs(P_TRACK_PINNED - P_TRACK_PREDICTED) / Math.abs(P_TRACK_PINNED); // ~3%

// reuse gate: the fixed-window exponent reproduces the imp-34950 point value.
const P_VS_IMP34950 = Math.abs(P_BASE - IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.exponent.pinned.p);

export const IMP35015_CROSSING_STRENGTH_EXPONENT_WINDOW_STABILITY = {
  id: 'imp-35015',
  proofSection: 'S-frontier',
  question:
    'imp-34950 pinned the E_flow crossing-strength C_mb exponent p in s* = K C_mb^p to p = 1.5493 +/- 8.9e-4 ' +
    '(95% CI [1.5476,1.5511]) at the nominal 9.53-dex crossing, while imp-34956 showed the X_CROSS landmark ' +
    'window has ~52.8x freedom over [1e9,1e11]. Re-extract p at multiple X_CROSS windows across the bracket ' +
    'and ASSESS whether the sharply-measured exponent is landmark-window-STABLE (a genuine surrogate constant) ' +
    'or a window artifact. Measurement only; SWEEPS C_mb and the window, does NOT discharge the GUE conditional ' +
    '(imp-486); changes no bound; NO QED.',
  verdictShort:
    'The exponent is EXACTLY landmark-window-stable: re-extracted at 10 X_CROSS windows spanning dex 9.0..11.0 ' +
    'it is p = 1.54933 at every window, with a max spread ~2.4e-15 (the double-precision floor, ~12 orders ' +
    'below the imp-34950 se ~8.9e-4). So the sharply-measured p is a genuine surrogate constant, NOT an ' +
    'artifact of the 9.53-dex window choice. The imp-34956 ~52.8x window freedom lands ENTIRELY on the pinned ' +
    'product PREFACTOR K r0 (which swings ~52.8x across the same windows) because r(X_CROSS) is a ' +
    'C_mb-INDEPENDENT factor -- it moves the intercept, not the slope. The exponent shifts ONLY under a ' +
    'self-consistent tracking window X_CROSS = x*(C_mb): then p drops to ~-0.230, matching the structural ' +
    'prediction p - q_eff (dx*/d ln C_mb) ~ -0.236 to ~3%.',
  measuredQuantity:
    'the imp-34950 pinned power-law exponent p re-extracted at a 10-point X_CROSS window grid across ' +
    '[1e9,1e11] (fixed windows) plus the self-consistent tracking window X_CROSS = x*(C_mb); the spread of p ' +
    'across fixed windows, the prefactor K r0 swing, and the tracking-window exponent vs its structural ' +
    'prediction p - q_eff (dx*/d ln C_mb)',
  baselineExponent: {
    p_base: +P_BASE.toFixed(5), // ~1.54933 -- reproduces imp-34950
    p_vs_imp34950_absdiff: +P_VS_IMP34950.toExponential(3),
  },
  fixedWindowStability: {
    nWindows: WINDOW_DEX.length,
    dexRange: [WINDOW_DEX[0], WINDOW_DEX[WINDOW_DEX.length - 1]],
    p_min: +P_FIXED_MIN.toFixed(12),
    p_max: +P_FIXED_MAX.toFixed(12),
    p_spread: +P_FIXED_SPREAD.toExponential(3), // ~2.4e-15 -- at the FP floor
    p_free_spread: +P_FREE_FIXED_SPREAD.toExponential(3),
    imp34950_se: 8.9e-4, // for scale: the spread is ~12 orders below the measured se
    note:
      'The pinned exponent is p = 1.54933 at every one of the 10 X_CROSS windows spanning dex 9.0..11.0, with ' +
      'a spread ~2.4e-15 -- at the double-precision floor and ~12 orders below the imp-34950 se ~8.9e-4. p is ' +
      'window-stable to machine precision, NOT an artifact of the nominal 9.53-dex window.',
  },
  prefactorAbsorbsWindow: {
    prefactor_min: +PREFACTOR_MIN.toExponential(4),
    prefactor_max: +PREFACTOR_MAX.toExponential(4),
    prefactor_swing: +PREFACTOR_SWING.toFixed(3), // ~52.8x -- matches imp-34956
    note:
      'Across the same 10 windows the free-K fit prefactor K r0 swings ~52.8x (matching the imp-34956 |P| ' +
      'bracket swing) while the slope is unmoved. The window freedom is an uncertainty on the pinned-product ' +
      'PREFACTOR, contributing EXACTLY 0 to the exponent, because r(X_CROSS) is a C_mb-independent factor: ' +
      'multiplying s*(C_mb) by it shifts ln P by the constant ln r0, moving the intercept not the slope.',
  },
  selfConsistentTrackingWindow: {
    p_track_pinned: +P_TRACK_PINNED.toFixed(4), // ~-0.230
    p_track_free: +P_TRACK_FREE.toFixed(4), // ~-0.232
    q_eff_at_1: +Q_EFF_AT_1.toFixed(4), // ~0.855
    dx_dlncmb: +DX_DLNCMB.toFixed(4), // ~2.089
    p_track_predicted: +P_TRACK_PREDICTED.toFixed(4), // ~-0.236 = p - q_eff dx*/dlnC_mb
    p_track_pred_rel_err: +P_TRACK_PRED_REL_ERR.toExponential(3), // ~3%
    note:
      'If X_CROSS is instead tied to the C_mb-dependent crossing location x*(C_mb) (the imp-34956 open ' +
      'sub-gap), the effective exponent drops to p_track ~ -0.230 (free-K -0.232), matching the structural ' +
      'prediction p - q_eff (dx*/d ln C_mb) ~ 1.549 - 0.855(2.089) ~ -0.236 to ~3%. So the exponent drifts ' +
      'ONLY when the window itself is made a function of C_mb, not under any fixed-window choice.',
  },
  windowGrid: WINDOW_FITS.map((w) => ({
    dex: w.dex,
    r0: w.r0,
    pPinned: +w.pPinned.toFixed(9),
    prefactorK: +w.prefactorK.toExponential(4),
  })),
  finding: {
    W1_exponent_is_exactly_window_stable:
      'Re-extracting the pinned exponent at 10 X_CROSS windows spanning dex 9.0..11.0 gives p = 1.54933 at ' +
      'every window with a max spread ~2.4e-15 -- at the double-precision floor, ~12 orders below the ' +
      'imp-34950 se ~8.9e-4. The sharply-measured p is a genuine surrogate constant, NOT a 9.53-dex-window artifact.',
    W2_window_swing_lands_on_prefactor:
      'The free-K prefactor K r0 swings ~52.8x across the same windows (matching the imp-34956 |P| swing) ' +
      'while the slope is unmoved. r(X_CROSS) is C_mb-independent, so it shifts ln P by the constant ln r0 -- ' +
      'the intercept, not the slope: the window freedom contributes EXACTLY 0 to the exponent.',
    W3_only_self_consistent_tracking_shifts_p:
      'Tying X_CROSS to the C_mb-dependent crossing location x*(C_mb) drops the exponent to p_track ~ -0.230 ' +
      '(free-K -0.232), matching p - q_eff (dx*/d ln C_mb) ~ -0.236 to ~3%. The exponent drifts ONLY when the ' +
      'window is itself a function of C_mb, i.e. the imp-34956 self-consistent-ramp direction, not any fixed window.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Re-extracting the imp-34950 pinned crossing-strength C_mb exponent ' +
    'p at 10 X_CROSS windows across [1e9,1e11] and contrasting a self-consistent tracking window: (W1) p is ' +
    'EXACTLY landmark-window-stable -- p = 1.54933 at every fixed window, spread ~2.4e-15 (the ' +
    'double-precision floor, ~12 orders below the imp-34950 se ~8.9e-4), so the sharply-measured p is a ' +
    'genuine surrogate constant NOT a 9.53-dex-window artifact. (W2) the imp-34956 ~52.8x window freedom ' +
    'lands ENTIRELY on the pinned-product prefactor K r0 (which swings ~52.8x across the same windows) ' +
    'because r(X_CROSS) is a C_mb-INDEPENDENT factor: it shifts the intercept ln r0, not the slope. (W3) the ' +
    'exponent shifts ONLY under a self-consistent tracking window X_CROSS = x*(C_mb), dropping to p_track ~ ' +
    '-0.230 (free-K -0.232), matching the structural prediction p - q_eff (dx*/d ln C_mb) ~ -0.236 to ~3%. ' +
    'This SWEEPS C_mb and the window as free knobs and does NOT discharge the GUE conditional (C_mb ' +
    'GUE-conditional per imp-486). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT ' +
    'a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS imp-35015: the imp-34950 crossing-strength C_mb exponent p = 1.5493 is EXACTLY ' +
    'landmark-window-stable -- re-extracted at 10 X_CROSS windows over [1e9,1e11] it is 1.54933 at every ' +
    'window (spread ~2.4e-15, at the FP floor), so it is a genuine surrogate constant NOT an artifact of the ' +
    'nominal 9.53-dex window. The imp-34956 ~52.8x window freedom lands entirely on the pinned-product ' +
    'PREFACTOR K r0 (swinging ~52.8x) because r(X_CROSS) is C_mb-independent; the exponent shifts ONLY under ' +
    'a self-consistent tracking window X_CROSS = x*(C_mb), to p_track ~ -0.230 (matching p - q_eff dx*/d ln ' +
    'C_mb ~ -0.236). What stays OPEN (deferred, changes no bound): the self-consistent-ramp exponent -0.23 ' +
    'is itself surrogate-dependent and inherits the imp-34950 F3 ~88% transmission puzzle; and a derivation ' +
    'PINNING C_mb below the GUE bound of 1 (imp-486) would fix the physical s* = K C_mb^p and hence the ' +
    'pinned product at any chosen window.',
  citation:
    'imp-34950 (the p = 1.5493 +/- 8.9e-4 exponent + CI tested here for window stability); imp-34956 (the ' +
    '~52.8x X_CROSS window freedom connected to the exponent); imp-35011 (g* bit-identical across X_CROSS ' +
    'windows); imp-34973 (the q_eff = -d ln r/dx window-wide identity used in W3); imp-3463 (far-tail 1/2); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35015_CROSSING_STRENGTH_EXPONENT_WINDOW_STABILITY_ASSERTIONS = [
  {
    // Reuse gate: the baseline exponent reproduces the imp-34950 point value.
    id: 'imp35015-reproduces-imp34950-exponent',
    description: 'baseline p reproduces the imp-34950 pinned exponent p = 1.5493',
    holds: () => P_VS_IMP34950 < 1e-3 && Math.abs(P_BASE - 1.5493) < 5e-3,
  },
  {
    // (W1): the exponent is window-stable to the double-precision floor across all 10 windows.
    id: 'imp35015-exponent-window-stable-to-fp-floor',
    description: 'pinned p spread across 10 X_CROSS windows is < 1e-12 (~ FP floor), far below the imp-34950 se',
    holds: () =>
      WINDOW_FITS.length === 10 &&
      P_FIXED_SPREAD < 1e-12 &&
      P_FREE_FIXED_SPREAD < 1e-9 &&
      WINDOW_FITS.every((w) => Math.abs(w.pPinned - P_BASE) < 1e-9),
  },
  {
    // (W2): the ~52.8x window freedom lands on the prefactor, not the exponent.
    id: 'imp35015-window-swing-in-prefactor-not-exponent',
    description: 'free-K prefactor swings ~52.8x across windows while the slope is unmoved',
    holds: () => PREFACTOR_SWING > 40 && PREFACTOR_SWING < 70 && P_FIXED_SPREAD < 1e-12,
  },
  {
    // (W3): a self-consistent tracking window gives a completely different exponent, matching the prediction.
    id: 'imp35015-tracking-window-shifts-exponent',
    description: 'self-consistent tracking exponent ~-0.23 differs from p and matches p - q_eff dx*/dlnC_mb to < 10%',
    holds: () =>
      P_TRACK_PINNED < 0 &&
      Math.abs(P_TRACK_PINNED - P_BASE) > 1.5 &&
      P_TRACK_PRED_REL_ERR < 0.1 &&
      Math.abs(Q_EFF_AT_1 - 0.855) < 5e-3 &&
      Math.abs(DX_DLNCMB - 2.089) < 0.05,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed.
    id: 'imp35015-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed',
    holds: () =>
      IMP35015_CROSSING_STRENGTH_EXPONENT_WINDOW_STABILITY.isRigorous === false &&
      IMP35015_CROSSING_STRENGTH_EXPONENT_WINDOW_STABILITY.farTailExponent === 0.5 &&
      typeof IMP35015_CROSSING_STRENGTH_EXPONENT_WINDOW_STABILITY.subGap === 'string' &&
      /imp-486/.test(IMP35015_CROSSING_STRENGTH_EXPONENT_WINDOW_STABILITY.subGap) &&
      /NO QED/.test(IMP35015_CROSSING_STRENGTH_EXPONENT_WINDOW_STABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP35015_CROSSING_STRENGTH_EXPONENT_WINDOW_STABILITY.verdict),
  },
];

for (const a of IMP35015_CROSSING_STRENGTH_EXPONENT_WINDOW_STABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35015-crossing-strength-exponent-window-stability assertion failed: ${a.id}`);
  }
}
