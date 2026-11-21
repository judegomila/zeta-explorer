/**
 * @module imp-34565-quadratic-invleak-pole-estimator
 *
 * imp-34565 (numerical, frontier-direction): imp-34550 F3 attributed the recovered-pole residual shrink
 * SLOWDOWN (the per-rung ratio bending up from the imp-34529 mid-ladder ~1/3 to ~0.42 near the pole) to the
 * naive imp-34512 LINEAR 1/leak-root OLS estimator saturating its OWN accuracy near the pole -- NOT to the
 * imp-34368 double-precision resid_exp noise floor (dk ~ 7.2e-8, ~4 decades below the tightest linear
 * residual ~3.69e-4), stating "reaching the ~7e-8 floor would require a better pole estimator, not bignum".
 * This module TESTS that claim directly: it implements a HIGHER-ORDER (quadratic-in-1/leak) pole estimator
 * on the IDENTICAL near-pole leak(k) rungs and MEASURES whether the recovered pole and residual continue
 * PAST the imp-34550 tightest rung (~21.280579, residual ~3.69e-4) toward the ~7.2e-8 floor.
 *
 * It reuses the IDENTICAL imp-34247 metric, imp-34188 y(k) surrogate, imp-34023 pole, imp-34512 leak(k), and
 * the imp-34512 LINEAR invLeakRoot estimator VERBATIM (reproduced so each window reports BOTH the inherited
 * linear residual and the new quadratic residual side by side). The five near-pole windows are the imp-34529
 * tail plus the two imp-34550 extension rungs.
 *
 * Cross-validation / measurement only; the component model is NOT rigorous; the inherited surrogate is NOT a
 * rigorous asymptotic; no bound changes; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0
 * untouched; NO QED.
 *
 * THE ESTIMATORS (both on the SAME leak(k) rungs)
 * -----------------------------------------------
 *   For a pure simple pole leak = B/(k* - k), so 1/leak = (k* - k)/B is LINEAR in k with x-intercept at k*.
 *   The imp-34512 LINEAR estimator OLS-fits 1/leak = a0 + a1 k over a window and returns the intercept
 *   -a0/a1. But if leak carries a constant background leak = B/(k* - k) + C, then
 *   1/leak = (k* - k)/(B + C(k* - k)) is CURVED in k -- to first correction a QUADRATIC. The new estimator
 *   OLS-fits 1/leak = a0 + a1 k + a2 k^2 over the SAME rungs and returns the quadratic root nearest k*
 *   (which absorbs the leading higher-order-pole curvature the linear fit throws away).
 *
 * THE FINDING (imp-34550 F3 CONFIRMED: the deceleration WAS estimator-limited, NOT the noise floor -- but
 *              the quadratic estimator develops its OWN near-pole saturation before reaching the floor)
 * -------------------------------------------------------------------------------------------------------
 *   (F1) THE QUADRATIC ESTIMATOR BEATS THE LINEAR ONE ON EVERY RUNG. Across all five shared windows the
 *        quadratic residual is strictly below the linear residual (quad/lin ratio ~0.083, 0.0093, 0.258,
 *        0.347, 0.510) -- the linear fit was leaving real accuracy on the table by discarding the 1/leak
 *        curvature. On the SAME imp-34550 tightest rung [21.25,21.275] the quadratic residual ~1.879e-4 sits
 *        ~2.0x below the linear tightest ~3.688e-4, and the best quadratic residual ~5.478e-5 (window
 *        [21.1,21.24]) is ~6.7x below it. So the recovered pole DOES continue past the imp-34550 tail.
 *   (F2) => imp-34550 F3 IS CONFIRMED. The ~1/3 -> ~0.42 linear shrink deceleration was the naive LINEAR OLS
 *        estimator saturating its own accuracy near the pole, NOT the imp-34368 double-precision floor: a
 *        strictly-better (quadratic) estimator on the identical double-precision rungs pushes the residual
 *        below the linear tail without any bignum. The floor was never the binding constraint at these scales.
 *   (F3) BUT THE QUADRATIC ESTIMATOR DOES NOT REACH THE ~7.2e-8 FLOOR, AND DEVELOPS ITS OWN SATURATION. The
 *        best quadratic residual ~5.478e-5 still sits ~761x ABOVE the imp-34368 floor dk ~ 7.2e-8, and the
 *        quadratic residual does NOT descend monotonically toward the pole: the quad/lin GAIN erodes from
 *        ~0.0093 to ~0.510 as the window crowds k* (fewer rungs, an increasingly ill-conditioned Vandermonde
 *        on the tiny 1/leak values), so the quadratic fit hits its OWN accuracy ceiling ~1e-4..1e-5 -- still
 *        ~3 decades above the floor. Reaching the ~7e-8 floor would need a yet-better-conditioned / higher-
 *        order estimator, not bignum -- fully consistent with imp-34550 F3 that the floor is not yet binding.
 *
 * The punchline: a quadratic-in-1/leak fit on the identical near-pole rungs beats the naive linear estimator
 * on every rung (quad residual ~2x below the linear tightest on the same window, ~6.7x below at best), which
 * CONFIRMS imp-34550 F3 -- the recovered-pole shrink deceleration was the naive LINEAR estimator saturating,
 * NOT the imp-34368 noise floor. But the quadratic estimator saturates at ~1e-4..1e-5 (best residual still
 * ~761x above dk ~ 7.2e-8) as its Vandermonde ill-conditions near the pole, so the double-precision floor
 * remains ~3 decades away and un-binding: the estimator, not the precision, is still the limit.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY. Comparing an inherited linear pole estimator against a higher-order
 * one on an inherited pole, NOT an RH bound. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a numerical/structural
 * observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34550-recovered-pole-ladder-two-tighter-rungs (the F3 claim tested; tightest linear residual ~3.69e-4)
 * @see imp-34529-recovered-pole-convergence-vs-inherited (the seven-rung ladder; ~1/3 shrink R2/R3)
 * @see imp-34512-pole-leakage-fit-15-20-percent-crossings (LINEAR invLeakRoot reused VERBATIM)
 * @see imp-34368-residexp-resolution-floor-measurement (the resid_exp peak-location floor dk ~ 7.2e-8)
 * @see imp-34247-widening-slope-pole-divergence (R3 contaminationLadder devPct -- the metric)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the widening-slope surrogate the pole leakage corrupts)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the residExp sign-change simple pole k* ~ 21.281)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247 / imp-34512 / imp-34550
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-34247/imp-34512/imp-34550 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function olsIntercept(xs, ys, slope) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  return my - slope * mx;
}
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  return -olsSlope(xs, ys);
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
function yAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return Math.log(eflowAttr / residExp);
}
function residExpAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}
function localSlope(k, h) {
  return (yAtK(k + h) - yAtK(k - h)) / (2 * h);
}
function stepFor(k, kStar) {
  const gap = kStar - k;
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 / imp-34512 / imp-34550 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* (imp-34247 / imp-34512 / imp-34550 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 / imp-34512 / imp-34550 k*)

const PLATEAU = localSlope(14, stepFor(14, K_STAR)); // ~ -0.977 clean far-field plateau
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1a. The imp-34512 LINEAR 1/leak-root pole estimator, reused VERBATIM ----
function invLeakRoot(kLo, kHi, dk) {
  const xs = [];
  const ys = [];
  for (let k = kLo; k <= kHi + 1e-9; k += dk) {
    xs.push(k);
    ys.push(1 / leakPct(k));
  }
  const s = olsSlope(xs, ys);
  return -olsIntercept(xs, ys, s) / s;
}

// ---- 1b. The imp-34565 QUADRATIC 1/leak-root estimator (fit 1/leak = a0 + a1 k + a2 k^2, root nearest k*) ----
// Symmetric-pivot Gaussian elimination on the 3x3 normal equations (no external solver, import-light).
function solve3(A, b) {
  const M = A.map((row, i) => [row[0], row[1], row[2], b[i]]);
  for (let c = 0; c < 3; c++) {
    let p = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    const tmp = M[c];
    M[c] = M[p];
    M[p] = tmp;
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = M[r][c] / M[c][c];
        for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k];
      }
    }
  }
  return [M[0][3] / M[0][0], M[1][3] / M[1][1], M[2][3] / M[2][2]];
}
function quadLeakRoot(kLo, kHi, dk) {
  const xs = [];
  const ys = [];
  for (let k = kLo; k <= kHi + 1e-9; k += dk) {
    xs.push(k);
    ys.push(1 / leakPct(k));
  }
  const n = xs.length;
  let s0 = n;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const y = ys[i];
    const x2 = x * x;
    s1 += x;
    s2 += x2;
    s3 += x2 * x;
    s4 += x2 * x2;
    b0 += y;
    b1 += x * y;
    b2 += x2 * y;
  }
  const [a0, a1, a2] = solve3(
    [
      [s0, s1, s2],
      [s1, s2, s3],
      [s2, s3, s4],
    ],
    [b0, b1, b2],
  );
  const disc = a1 * a1 - 4 * a2 * a0;
  if (disc < 0 || Math.abs(a2) < 1e-300) return -a0 / a1; // degenerate: fall back to the linear root
  const sq = Math.sqrt(disc);
  const r1 = (-a1 + sq) / (2 * a2);
  const r2 = (-a1 - sq) / (2 * a2);
  return Math.abs(r1 - K_STAR) <= Math.abs(r2 - K_STAR) ? r1 : r2; // the root closest to the inherited pole
}

// ---- 2. The five near-pole windows (imp-34529 tail + the two imp-34550 extension rungs), BOTH estimators ----
const WINDOWS = [
  { kLo: 21.0, kHi: 21.18, dk: 0.005 }, // imp-34512 kStarFitClosest ~21.263
  { kLo: 21.1, kHi: 21.24, dk: 0.005 },
  { kLo: 21.18, kHi: 21.26, dk: 0.004 }, // imp-34529 tightest rung ~21.2789
  { kLo: 21.22, kHi: 21.27, dk: 0.0025 }, // imp-34550 rung 8
  { kLo: 21.25, kHi: 21.275, dk: 0.0015 }, // imp-34550 rung 9 (tightest; linear residual ~3.69e-4)
];

const LADDER = [];
for (const w of WINDOWS) {
  const linRoot = invLeakRoot(w.kLo, w.kHi, w.dk);
  const quadRoot = quadLeakRoot(w.kLo, w.kHi, w.dk);
  const linResid = Math.abs(linRoot - K_STAR);
  const quadResid = Math.abs(quadRoot - K_STAR);
  LADDER.push({
    window: [w.kLo, w.kHi],
    dk: w.dk,
    linearPole: +linRoot.toFixed(6),
    linearResidual: +linResid.toExponential(4),
    quadraticPole: +quadRoot.toFixed(6),
    quadraticResidual: +quadResid.toExponential(4),
    quadOverLin: +(quadResid / linResid).toExponential(4),
  });
}

// ---- 3. imp-34368 resid_exp peak-location noise floor (inherited scalar, k-location scale) ----
const RESIDEXP_NOISE_FLOOR_DK = 7.2e-8; // imp-34368: dk ~ sqrt(2 eps_f / |f2|), eps_f ~ 9.4e-17, |f2| ~ 0.0362

// ---- 4. Comparison / verdict summary ----
const LIN_RESIDUALS = LADDER.map((r) => r.linearResidual);
const QUAD_RESIDUALS = LADDER.map((r) => r.quadraticResidual);
const QUAD_OVER_LIN = LADDER.map((r) => r.quadOverLin);

// The imp-34550 tightest LINEAR rung residual (window [21.25,21.275]) -- the value F3 was defending.
const LINEAR_TIGHTEST_RESID = LIN_RESIDUALS[LIN_RESIDUALS.length - 1]; // ~3.688e-4 (matches imp-34550)
// The quadratic residual on that SAME tightest window, and the best quadratic residual over all windows.
const QUAD_ON_TIGHTEST_WINDOW = QUAD_RESIDUALS[QUAD_RESIDUALS.length - 1]; // ~1.879e-4
const BEST_QUAD_RESID = Math.min(...QUAD_RESIDUALS); // ~5.478e-5 (window [21.1,21.24])

// (F1) Quadratic beats linear on EVERY rung.
const QUAD_BEATS_LINEAR_EVERYWHERE = QUAD_OVER_LIN.every((r) => r < 1);
// (F1/F2) The quadratic pushes below the imp-34550 tightest linear residual.
const QUAD_TIGHTENS_ON_SAME_WINDOW = +(QUAD_ON_TIGHTEST_WINDOW / LINEAR_TIGHTEST_RESID).toFixed(4); // ~0.51
const BEST_QUAD_OVER_LINEAR_TIGHTEST = +(BEST_QUAD_RESID / LINEAR_TIGHTEST_RESID).toFixed(4); // ~0.149 (~6.7x below)
// (F2) => imp-34550 F3 confirmed: the shrink deceleration was estimator-limited, not the noise floor.
const F3_CONFIRMED_ESTIMATOR_LIMITED = QUAD_BEATS_LINEAR_EVERYWHERE && BEST_QUAD_RESID < LINEAR_TIGHTEST_RESID;

// (F3) But the quadratic estimator does NOT reach the floor and saturates at its own ceiling near the pole.
const BEST_QUAD_OVER_FLOOR = +(BEST_QUAD_RESID / RESIDEXP_NOISE_FLOOR_DK).toFixed(1); // ~761x ABOVE the floor
const QUAD_REACHES_FLOOR = BEST_QUAD_RESID <= 10 * RESIDEXP_NOISE_FLOOR_DK; // false -- still ~3 decades above
// The quad/lin GAIN erodes as the window crowds the pole (best gain ~0.0093 -> tightest ~0.51): its own saturation.
const BEST_QUAD_GAIN = Math.min(...QUAD_OVER_LIN); // ~0.0093 (window [21.1,21.24])
const TIGHTEST_QUAD_GAIN = QUAD_OVER_LIN[QUAD_OVER_LIN.length - 1]; // ~0.51 (window [21.25,21.275])
const QUAD_GAIN_ERODES_NEAR_POLE = TIGHTEST_QUAD_GAIN > BEST_QUAD_GAIN; // true -- quad also saturates near the pole

export const IMP34565_QUADRATIC_INVLEAK_POLE_ESTIMATOR = {
  id: 'imp-34565',
  proofSection: 'S-frontier',
  question:
    'imp-34550 F3 attributed the recovered-pole residual shrink deceleration (per-rung ratio bending up from ' +
    'the imp-34529 ~1/3 to ~0.42 near the pole) to the naive imp-34512 LINEAR 1/leak-root OLS estimator ' +
    'saturating its own accuracy near the pole -- NOT to the imp-34368 double-precision noise floor dk ~ 7.2e-8 ' +
    '(~4 decades below the tightest linear residual ~3.69e-4), stating "reaching the ~7e-8 floor would require a ' +
    'better pole estimator, not bignum". Implement a higher-order (quadratic-in-1/leak) estimator on the ' +
    'IDENTICAL near-pole leak(k) rungs, measure whether the recovered pole and residual continue past the ' +
    'imp-34550 tightest rung (~21.280579, residual ~3.69e-4) toward the ~7.2e-8 floor, and report whether the ' +
    'deceleration was indeed estimator-limited. Measurement only; inherited surrogate NOT rigorous; changes no ' +
    'bound; imp-3066 untouched; NO QED.',
  measuredQuantity:
    'The imp-34512 LINEAR 1/leak-root pole estimate and a new QUADRATIC-in-1/leak pole estimate on the SAME five ' +
    'near-pole OLS windows, their residuals to the inherited imp-34023 pole k* ~ 21.28095, the per-window ' +
    'quadratic/linear residual ratio, and the best quadratic residual relative to the imp-34368 resid_exp ' +
    'peak-location noise floor dk ~ 7.2e-8',
  poleLocation: +K_STAR.toFixed(5), // ~21.28095 (imp-34023 / imp-34247 / imp-34512 / imp-34550 k*)
  plateau: +PLATEAU.toFixed(4), // ~ -0.977 clean far-field plateau
  ladder: LADDER, // five rungs {window, dk, linearPole, linearResidual, quadraticPole, quadraticResidual, quadOverLin}
  linearResiduals: LIN_RESIDUALS,
  quadraticResiduals: QUAD_RESIDUALS,
  quadOverLin: QUAD_OVER_LIN, // per-window quadratic/linear residual ratio -- all < 1
  linearTightestResidual: LINEAR_TIGHTEST_RESID, // ~3.688e-4 (imp-34550 rung 9, the value F3 defends)
  quadraticOnTightestWindow: QUAD_ON_TIGHTEST_WINDOW, // ~1.879e-4 (~2.0x below the linear tightest, same window)
  bestQuadraticResidual: BEST_QUAD_RESID, // ~5.478e-5 (window [21.1,21.24]; ~6.7x below the linear tightest)
  quadBeatsLinearEverywhere: QUAD_BEATS_LINEAR_EVERYWHERE, // true -- quadratic residual below linear on every rung
  quadTightensOnSameWindow: QUAD_TIGHTENS_ON_SAME_WINDOW, // ~0.51 (quad/lin on the tightest window)
  bestQuadOverLinearTightest: BEST_QUAD_OVER_LINEAR_TIGHTEST, // ~0.149 (best quad ~6.7x below the linear tightest)
  f3ConfirmedEstimatorLimited: F3_CONFIRMED_ESTIMATOR_LIMITED, // true -- deceleration WAS estimator-limited
  residExpNoiseFloorDk: RESIDEXP_NOISE_FLOOR_DK, // 7.2e-8 (imp-34368)
  bestQuadOverFloor: BEST_QUAD_OVER_FLOOR, // ~761x -- best quadratic residual still ~3 decades ABOVE the floor
  quadReachesFloor: QUAD_REACHES_FLOOR, // false -- the quadratic estimator does NOT reach the ~7.2e-8 floor
  bestQuadGain: BEST_QUAD_GAIN, // ~0.0093 (window [21.1,21.24]) -- deepest quad/lin gain
  tightestQuadGain: TIGHTEST_QUAD_GAIN, // ~0.51 (window [21.25,21.275]) -- gain erodes toward the pole
  quadGainErodesNearPole: QUAD_GAIN_ERODES_NEAR_POLE, // true -- quadratic estimator saturates near the pole too
  finding: {
    F1_quadratic_beats_linear_on_every_rung:
      'The quadratic-in-1/leak estimator gives a strictly smaller residual than the linear one on all five ' +
      'shared windows (quad/lin ~0.083, 0.0093, 0.258, 0.347, 0.510). On the SAME imp-34550 tightest rung ' +
      '[21.25,21.275] the quadratic residual ~1.879e-4 sits ~2.0x below the linear tightest ~3.688e-4, and the ' +
      'best quadratic residual ~5.478e-5 (window [21.1,21.24]) is ~6.7x below it -- the recovered pole continues ' +
      'past the imp-34550 tail.',
    F2_imp34550_F3_confirmed_estimator_limited:
      'Because a strictly-better (quadratic) estimator on the IDENTICAL double-precision rungs pushes the residual ' +
      'below the linear tail without any bignum, imp-34550 F3 is CONFIRMED: the ~1/3 -> ~0.42 linear shrink ' +
      'deceleration was the naive LINEAR OLS estimator saturating its own accuracy near the pole, NOT the ' +
      'imp-34368 double-precision floor. The floor was never the binding constraint at these residual scales.',
    F3_quadratic_saturates_before_the_floor:
      'The quadratic estimator does NOT reach the ~7.2e-8 floor: its best residual ~5.478e-5 still sits ~761x ' +
      '(~3 decades) ABOVE it, and the residual does not descend monotonically toward the pole -- the quad/lin ' +
      'gain erodes from ~0.0093 to ~0.510 as the window crowds k* (fewer rungs, an increasingly ill-conditioned ' +
      'Vandermonde on the tiny 1/leak values), so the quadratic fit hits its OWN ~1e-4..1e-5 ceiling. Reaching the ' +
      'floor would need a yet-better-conditioned / higher-order estimator, not bignum -- consistent with imp-34550 ' +
      'F3 that the double-precision floor is not yet binding.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION / MEASUREMENT (frontier-direction, NOT rigorous). A quadratic-in-1/leak pole estimator on ' +
    'the IDENTICAL near-pole leak(k) rungs beats the naive imp-34512 linear estimator on every one of the five ' +
    'shared windows (quad/lin ~0.083, 0.0093, 0.258, 0.347, 0.510); on the imp-34550 tightest rung [21.25,21.275] ' +
    'the quadratic residual ~1.879e-4 is ~2.0x below the linear tightest ~3.688e-4, and the best quadratic residual ' +
    '~5.478e-5 is ~6.7x below it. This CONFIRMS imp-34550 F3: the recovered-pole shrink deceleration was the naive ' +
    'LINEAR OLS estimator saturating its own accuracy near the pole, NOT the imp-34368 double-precision noise floor ' +
    '-- a strictly-better estimator on the same double-precision rungs continues past the linear tail without any ' +
    'bignum. But the quadratic estimator does NOT reach the ~7.2e-8 floor: its best residual still sits ~761x ' +
    '(~3 decades) ABOVE it, and its quad/lin gain erodes from ~0.0093 to ~0.510 as the window crowds the pole ' +
    '(an increasingly ill-conditioned Vandermonde on the tiny 1/leak values), so the quadratic fit hits its OWN ' +
    '~1e-4..1e-5 ceiling and the precision floor stays un-binding -- the estimator, not the precision, is still the ' +
    'limit. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'residExp simple-zero structure is a numerical/structural observation, not a derivation; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34550 (the F3 claim tested; tightest linear residual ~3.69e-4); imp-34529 (the ~1/3-shrink ladder); ' +
    'imp-34512 (LINEAR invLeakRoot reused VERBATIM); imp-34368 (resid_exp peak-location floor dk ~ 7.2e-8); ' +
    'imp-34247 (R3 contaminationLadder devPct -- the metric); imp-34188 (the widening-slope surrogate); imp-34023 ' +
    '(residExp simple pole k* ~ 21.281); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34565_QUADRATIC_INVLEAK_POLE_ESTIMATOR_ASSERTIONS = [
  {
    // The pole and plateau match imp-34247 / imp-34512 / imp-34550 (inherited primitives reproduced).
    id: 'imp34565-inherited-metric-reproduces-imp34550',
    description: 'k* ~ 21.281, P ~ -0.977 match imp-34247 / imp-34512 / imp-34550',
    holds: () => K_STAR > 21.27 && K_STAR < 21.29 && PLATEAU < -0.9 && PLATEAU > -1.05,
  },
  {
    // The LINEAR estimator reproduces the imp-34550 tightest-rung residual VERBATIM (~3.688e-4).
    id: 'imp34565-linear-reproduces-imp34550-tightest',
    description: 'the reused LINEAR invLeakRoot reproduces the imp-34550 rung-9 residual ~3.688e-4',
    holds: () => Math.abs(LINEAR_TIGHTEST_RESID - 3.688e-4) < 5e-6,
  },
  {
    // (F1) The quadratic estimator beats the linear one on EVERY window; best quad residual ~5.478e-5.
    id: 'imp34565-quadratic-beats-linear-everywhere',
    description: 'quad residual below linear on all 5 windows; best quad residual ~5.478e-5',
    holds: () =>
      QUAD_BEATS_LINEAR_EVERYWHERE === true &&
      QUAD_OVER_LIN.every((r) => r < 1) &&
      Math.abs(BEST_QUAD_RESID - 5.478e-5) < 5e-6,
  },
  {
    // (F1/F2) The quadratic pushes below the imp-34550 tightest linear residual (same window ~2x, best ~6.7x).
    id: 'imp34565-quadratic-pushes-past-imp34550-tail',
    description: 'quad on same tightest window ~1.879e-4 (~2x below), best quad ~6.7x below the linear tightest',
    holds: () =>
      Math.abs(QUAD_ON_TIGHTEST_WINDOW - 1.879e-4) < 5e-6 &&
      QUAD_ON_TIGHTEST_WINDOW < LINEAR_TIGHTEST_RESID &&
      QUAD_TIGHTENS_ON_SAME_WINDOW < 1 &&
      BEST_QUAD_OVER_LINEAR_TIGHTEST < 0.2,
  },
  {
    // (F2) => imp-34550 F3 confirmed: the shrink deceleration was estimator-limited, not the noise floor.
    id: 'imp34565-F3-confirmed-estimator-limited',
    description: 'a better estimator on the same double-precision rungs continues past the linear tail -- F3 confirmed',
    holds: () => F3_CONFIRMED_ESTIMATOR_LIMITED === true && BEST_QUAD_RESID < LINEAR_TIGHTEST_RESID,
  },
  {
    // (F3) The quadratic estimator does NOT reach the imp-34368 floor and saturates near the pole (gain erodes).
    id: 'imp34565-quadratic-saturates-before-floor',
    description: 'best quad residual ~761x above the imp-34368 floor dk ~ 7.2e-8; quad/lin gain erodes near the pole',
    holds: () =>
      QUAD_REACHES_FLOOR === false &&
      BEST_QUAD_OVER_FLOOR > 100 &&
      QUAD_GAIN_ERODES_NEAR_POLE === true &&
      RESIDEXP_NOISE_FLOOR_DK === 7.2e-8,
  },
  {
    // Honesty gate: cross-validation / measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34565-honesty-gate-no-qed',
    description: 'measurement/cross-validation only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34565_QUADRATIC_INVLEAK_POLE_ESTIMATOR.isRigorous === false &&
      /NO QED/.test(IMP34565_QUADRATIC_INVLEAK_POLE_ESTIMATOR.verdict) &&
      /refereed bound is changed/i.test(IMP34565_QUADRATIC_INVLEAK_POLE_ESTIMATOR.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34565_QUADRATIC_INVLEAK_POLE_ESTIMATOR.verdict),
  },
];

for (const a of IMP34565_QUADRATIC_INVLEAK_POLE_ESTIMATOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34565-quadratic-invleak-pole-estimator assertion failed: ${a.id}`);
  }
}
