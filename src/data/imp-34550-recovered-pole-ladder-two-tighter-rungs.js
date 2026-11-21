/**
 * @module imp-34550-recovered-pole-ladder-two-tighter-rungs
 *
 * imp-34550 (accuracy, frontier-direction): imp-34529 R2/R3 tabulated the imp-34512 invLeakRoot
 * 1/leak-linear-root recovered pole converging onto the inherited imp-34023 k* ~ 21.28095 with the
 * residual shrinking roughly geometrically ~0.341 per rung (~635x over six rungs) down to ~0.00205 at
 * the tightest window [21.18,21.26], but stopped there and never tested whether that ~1/3 shrink
 * PERSISTS deeper or STALLS at the imp-34368 resid_exp evaluation-noise floor. This module adds TWO more
 * tightening windows past [21.0,21.18] (rungs 8 and 9 of the ladder), reports invLeakRoot and the
 * residual for each, MEASURES whether the ~1/3 geometric ratio persists, and cross-checks the residual
 * scale against the imp-34368 resid_exp peak-location noise floor dk ~ 7.2e-8. It reuses the IDENTICAL
 * imp-34247 metric, imp-34188 y(k) surrogate, imp-34023 pole, and imp-34512 invLeakRoot estimator
 * VERBATIM (the seven imp-34529 rungs are reproduced, then two tighter rungs appended).
 *
 * Cross-validation / measurement only; the component model is NOT rigorous; the inherited surrogate is
 * NOT a rigorous asymptotic; no bound changes; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 * K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 / imp-34512 / imp-34529, reused VERBATIM)
 * -------------------------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); the pole-leakage leak(k) = 100 |dy/dk - P| / |P| is driven
 *   by the imp-34023 simple pole at k* ~ 21.28095. For a pure simple pole leak = B/(k* - k), so 1/leak
 *   is linear in k with x-intercept at k = k*: invLeakRoot(kLo, kHi, dk) OLS-fits 1/leak over a window
 *   and returns the intercept -- a naive estimate of the pole location.
 *
 * THE FINDING (the ~1/3 shrink does NOT cleanly persist; the slowdown is NOT the noise floor)
 * -------------------------------------------------------------------------------------------
 *   (F1) THE RECOVERED POLE KEEPS CLIMBING AND THE RESIDUAL KEEPS SHRINKING PAST THE imp-34529 TAIL.
 *        Two tighter windows [21.22,21.27] and [21.25,21.275] give recovered poles 21.279970 and
 *        21.280579 -- still strictly increasing toward the inherited k* ~ 21.28095 -- with residuals
 *        9.776e-4 and 3.688e-4, monotonically below the imp-34529 tightest-rung residual ~2.055e-3. The
 *        naive estimator does NOT stall; it keeps converging onto the inherited pole.
 *   (F2) BUT THE ~1/3 GEOMETRIC RATIO DOES NOT PERSIST -- THE CONTRACTION SLOWS. The two new per-rung
 *        shrink ratios are ~0.476 and ~0.377 (geometric mean ~0.424), noticeably ABOVE the imp-34529
 *        early cluster ~0.341 (geomean of rungs 2..7). So the residual keeps falling but no longer at a
 *        fixed 1/3 fraction: the sequence BENDS -- the per-rung contraction decelerates as the window
 *        crowds the pole. The clean ~1/3 law was a mid-ladder regime, not a persistent one.
 *   (F3) THE SLOWDOWN IS NOT THE imp-34368 DOUBLE-PRECISION NOISE FLOOR. Both new residuals live in the
 *        k-location scale at 9.78e-4 and 3.69e-4 -- respectively ~1.36e4x and ~5.1e3x ABOVE the imp-34368
 *        resid_exp peak-location floor dk ~ 7.2e-8 (eps_f ~ 9.4e-17 / |f2| ~ 0.0362, ~6.5 ulp). The floor
 *        is ~4 decades BELOW the tightest residual here, so deeper convergence is still fully observable
 *        at native double precision; the shrink slowdown is a SYSTEMATIC of the naive linear-1/leak OLS
 *        estimator (higher-order pole structure + the stepFor near-pole step cap biasing 1/leak), NOT a
 *        precision limit. Reaching the ~7e-8 floor would require a better pole estimator, not bignum.
 *
 * The punchline: extending the imp-34529 ladder two tighter rungs shows the recovered pole and residual
 * keep improving (21.279970 -> 21.280579, residual 9.78e-4 -> 3.69e-4), but the imp-34529 R3 ~1/3
 * geometric shrink is a mid-ladder regime, not a persistent law: the per-rung ratio bends up to ~0.42.
 * That deceleration is NOT the imp-34368 noise floor (which sits ~4 decades lower at dk ~ 7.2e-8) -- it
 * is the naive linear-1/leak estimator saturating its own accuracy near the pole, so the double-precision
 * floor is not yet the binding constraint at these residual scales.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY. Extending the convergence ladder of an inherited 1/leak-root
 * estimator onto an inherited pole, NOT an RH bound. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a numerical/structural
 * observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34529-recovered-pole-convergence-vs-inherited (the seven-rung ladder this extends; ~1/3 shrink, R2/R3)
 * @see imp-34512-pole-leakage-fit-15-20-percent-crossings (invLeakRoot reused VERBATIM)
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
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247 / imp-34512 / imp-34529
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-34247/imp-34512/imp-34529 sub-terms (no re-derivation, no fresh model).
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
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 / imp-34512 / imp-34529 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* (imp-34247 / imp-34512 / imp-34529 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 / imp-34512 / imp-34529 k*)

const PLATEAU = localSlope(14, stepFor(14, K_STAR)); // ~ -0.977 clean far-field plateau
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1. The imp-34512 1/leak-linear-root pole estimator, reused VERBATIM ----
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

// ---- 2. The imp-34529 seven-rung ladder + TWO tighter appended rungs (imp-34550) ----
// The first seven WINDOWS are the imp-34529 ladder VERBATIM; the last two are the imp-34550 extension.
const WINDOWS = [
  { kLo: 18.0, kHi: 20.6, dk: 0.1 }, // imp-34512 kStarFitWindow ~19.981
  { kLo: 19.5, kHi: 20.8, dk: 0.05 },
  { kLo: 20.3, kHi: 21.0, dk: 0.02 },
  { kLo: 20.7, kHi: 21.15, dk: 0.01 }, // imp-34512 kStarFitNear ~21.224
  { kLo: 21.0, kHi: 21.18, dk: 0.005 }, // imp-34512 kStarFitClosest ~21.263
  { kLo: 21.1, kHi: 21.24, dk: 0.005 },
  { kLo: 21.18, kHi: 21.26, dk: 0.004 }, // imp-34529 tightest rung ~21.2789
  // ---- imp-34550 extension: two tighter windows past [21.0,21.18] ----
  { kLo: 21.22, kHi: 21.27, dk: 0.0025 }, // rung 8
  { kLo: 21.25, kHi: 21.275, dk: 0.0015 }, // rung 9
];
const N_INHERITED = 7; // imp-34529 rung count; rungs 8..9 are the imp-34550 extension.

const LADDER = [];
let prevResid = null;
for (const w of WINDOWS) {
  const root = invLeakRoot(w.kLo, w.kHi, w.dk);
  const resid = Math.abs(root - K_STAR);
  const shrink = prevResid == null ? null : +(resid / prevResid).toFixed(4);
  LADDER.push({
    window: [w.kLo, w.kHi],
    dk: w.dk,
    recoveredPole: +root.toFixed(6),
    residual: +resid.toExponential(4),
    shrink,
  });
  prevResid = resid;
}

// ---- 3. imp-34368 resid_exp peak-location noise floor (inherited scalar, k-location scale) ----
const RESIDEXP_NOISE_FLOOR_DK = 7.2e-8; // imp-34368: dk ~ sqrt(2 eps_f / |f2|), eps_f ~ 9.4e-17, |f2| ~ 0.0362

// ---- 4. Convergence / persistence summary ----
const RECOVERED_POLES = LADDER.map((r) => r.recoveredPole);
const RESIDUALS = LADDER.map((r) => r.residual);
const SHRINKS = LADDER.slice(1).map((r) => r.shrink);
// The two NEW rungs (imp-34550 extension).
const NEW_POLES = RECOVERED_POLES.slice(N_INHERITED); // [21.279970, 21.280579]
const NEW_RESIDUALS = RESIDUALS.slice(N_INHERITED); // [9.776e-4, 3.688e-4]
const NEW_SHRINKS = LADDER.slice(N_INHERITED).map((r) => r.shrink); // [~0.476, ~0.377]

let ALL_POLES_MONOTONE_INCREASING = true;
for (let i = 1; i < RECOVERED_POLES.length; i++) {
  if (RECOVERED_POLES[i] <= RECOVERED_POLES[i - 1]) ALL_POLES_MONOTONE_INCREASING = false;
}
let ALL_RESIDUALS_MONOTONE_DECREASING = true;
for (let i = 1; i < RESIDUALS.length; i++) {
  if (RESIDUALS[i] >= RESIDUALS[i - 1]) ALL_RESIDUALS_MONOTONE_DECREASING = false;
}

// Early (imp-34529, rungs 2..7) shrink geomean vs the new (rungs 8..9) shrink geomean.
const EARLY_SHRINKS = SHRINKS.slice(0, N_INHERITED - 1); // rungs 2..7
const geomean = (arr) => +Math.exp(arr.reduce((a, b) => a + Math.log(b), 0) / arr.length).toFixed(4);
const EARLY_SHRINK_GEOMEAN = geomean(EARLY_SHRINKS); // ~0.341 (matches imp-34529)
const NEW_SHRINK_GEOMEAN = geomean(NEW_SHRINKS); // ~0.424 -- ABOVE the early ~1/3 (contraction slows)
const SHRINK_SLOWS = NEW_SHRINK_GEOMEAN > EARLY_SHRINK_GEOMEAN; // true -- the ~1/3 law does not persist

// How far the new residuals sit ABOVE the imp-34368 noise floor (k-location scale).
const NEW_RESID_OVER_FLOOR = NEW_RESIDUALS.map((r) => +(r / RESIDEXP_NOISE_FLOOR_DK).toFixed(1)); // ~[13578, 5122]
const TIGHTEST_RESID = RESIDUALS[RESIDUALS.length - 1]; // ~3.688e-4
const TIGHTEST_RESID_OVER_FLOOR = +(TIGHTEST_RESID / RESIDEXP_NOISE_FLOOR_DK).toFixed(1); // ~5122
const NOISE_FLOOR_IS_BINDING = TIGHTEST_RESID <= 10 * RESIDEXP_NOISE_FLOOR_DK; // false -- floor ~4 decades below

export const IMP34550_RECOVERED_POLE_LADDER_TWO_TIGHTER_RUNGS = {
  id: 'imp-34550',
  proofSection: 'S-frontier',
  question:
    'imp-34529 R2/R3 tabulated the imp-34512 invLeakRoot recovered pole converging onto the inherited ' +
    'imp-34023 k* ~ 21.28095 with the residual shrinking ~1/3 per rung (~635x over six rungs) to ~0.00205 ' +
    'at the tightest window [21.18,21.26], but never tested whether that ~1/3 geometric shrink persists ' +
    'deeper or stalls at the imp-34368 resid_exp evaluation-noise floor. Add two more tightening windows, ' +
    'report invLeakRoot and the residual for each, measure whether the ~1/3 ratio persists, and cross-check ' +
    'the residual scale against the imp-34368 noise floor dk ~ 7.2e-8. Cross-validation / measurement only; ' +
    'inherited surrogate NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'The imp-34512 1/leak-linear-root pole estimate recovered over two tightening OLS windows past the ' +
    'imp-34529 tail, its residual to the inherited imp-34023 pole, the per-rung shrink ratio (does the ~1/3 ' +
    'persist?), and the residual scale relative to the imp-34368 resid_exp peak-location noise floor',
  poleLocation: +K_STAR.toFixed(5), // ~21.28095 (imp-34023 / imp-34247 / imp-34512 / imp-34529 k*)
  plateau: +PLATEAU.toFixed(4), // ~ -0.977 clean far-field plateau
  inheritedRungCount: N_INHERITED, // 7 -- reproduced imp-34529 ladder
  ladder: LADDER, // nine rungs {window, dk, recoveredPole, residual, shrink}
  recoveredPoles: RECOVERED_POLES,
  residuals: RESIDUALS,
  shrinks: SHRINKS,
  newRungPoles: NEW_POLES, // [21.279970, 21.280579]
  newRungResiduals: NEW_RESIDUALS, // [9.776e-4, 3.688e-4]
  newRungShrinks: NEW_SHRINKS, // [~0.476, ~0.377]
  allPolesMonotoneIncreasing: ALL_POLES_MONOTONE_INCREASING, // true -- still climbing toward k*
  allResidualsMonotoneDecreasing: ALL_RESIDUALS_MONOTONE_DECREASING, // true -- still converging
  earlyShrinkGeoMean: EARLY_SHRINK_GEOMEAN, // ~0.341 (imp-34529 rungs 2..7)
  newShrinkGeoMean: NEW_SHRINK_GEOMEAN, // ~0.424 (rungs 8..9) -- ABOVE ~1/3
  shrinkSlows: SHRINK_SLOWS, // true -- the ~1/3 law does NOT persist; contraction decelerates
  residExpNoiseFloorDk: RESIDEXP_NOISE_FLOOR_DK, // 7.2e-8 (imp-34368)
  newResidOverFloor: NEW_RESID_OVER_FLOOR, // ~[13578, 5122] -- both ~4 decades ABOVE the floor
  tightestResidOverFloor: TIGHTEST_RESID_OVER_FLOOR, // ~5122
  noiseFloorIsBinding: NOISE_FLOOR_IS_BINDING, // false -- floor not yet the binding constraint
  finding: {
    F1_pole_keeps_climbing_residual_keeps_shrinking:
      'Two tighter windows [21.22,21.27] and [21.25,21.275] give recovered poles 21.279970 and 21.280579 ' +
      '(still strictly increasing toward k* ~ 21.28095) with residuals 9.776e-4 and 3.688e-4, monotonically ' +
      'below the imp-34529 tightest-rung residual ~2.055e-3. The naive estimator does NOT stall; it keeps ' +
      'converging onto the inherited pole.',
    F2_one_third_shrink_does_not_persist:
      'The two new per-rung shrink ratios ~0.476 and ~0.377 (geometric mean ~0.424) sit ABOVE the imp-34529 ' +
      'early cluster ~0.341 (rungs 2..7): the residual keeps falling but no longer at a fixed 1/3 fraction. ' +
      'The sequence BENDS -- per-rung contraction decelerates as the window crowds the pole. The clean ~1/3 ' +
      'law was a mid-ladder regime, not a persistent one.',
    F3_slowdown_is_not_the_double_precision_noise_floor:
      'Both new residuals (9.78e-4, 3.69e-4 in the k-location scale) sit ~1.36e4x and ~5.1e3x ABOVE the ' +
      'imp-34368 resid_exp peak-location floor dk ~ 7.2e-8 (eps_f ~ 9.4e-17 / |f2| ~ 0.0362) -- ~4 decades ' +
      'below the tightest residual. Deeper convergence is still fully observable at native double precision; ' +
      'the shrink slowdown is a SYSTEMATIC of the naive linear-1/leak OLS estimator (higher-order pole ' +
      'structure + the stepFor near-pole step cap), NOT a precision limit. Reaching the ~7e-8 floor would ' +
      'need a better pole estimator, not bignum.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION / MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-34529 recovered- ' +
    'pole ladder two tighter rungs [21.22,21.27] and [21.25,21.275] gives recovered poles 21.279970 -> ' +
    '21.280579 (still climbing toward k* ~ 21.28095) with residuals 9.776e-4 -> 3.688e-4 (still shrinking ' +
    'below the imp-34529 tail ~2.055e-3), but the per-rung shrink ratio rises to ~0.476 and ~0.377 ' +
    '(geomean ~0.424) ABOVE the imp-34529 early ~0.341 -- so the ~1/3 geometric law does NOT persist; the ' +
    'contraction DECELERATES as the window crowds the pole. That slowdown is NOT the imp-34368 ' +
    'double-precision noise floor: both new residuals sit ~1.36e4x / ~5.1e3x ABOVE the resid_exp ' +
    'peak-location floor dk ~ 7.2e-8, ~4 decades below the tightest residual, so deeper convergence is ' +
    'still observable at double precision -- the naive linear-1/leak estimator saturates its own accuracy ' +
    'near the pole before the precision floor binds. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a numerical/structural ' +
    'observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34529 (the seven-rung ladder extended; ~1/3 shrink R2/R3); imp-34512 (invLeakRoot reused); ' +
    'imp-34368 (resid_exp peak-location floor dk ~ 7.2e-8); imp-34247 (R3 contaminationLadder devPct -- the ' +
    'metric); imp-34188 (the widening-slope surrogate); imp-34023 (residExp simple pole k* ~ 21.281); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C ' +
    '(C_C_PINNED).',
};

export const IMP34550_RECOVERED_POLE_LADDER_TWO_TIGHTER_RUNGS_ASSERTIONS = [
  {
    // The pole and plateau match imp-34247 / imp-34512 / imp-34529 (inherited primitives reproduced).
    id: 'imp34550-inherited-metric-reproduces-imp34529',
    description: 'k* ~ 21.281, P ~ -0.977 match imp-34247 / imp-34512 / imp-34529',
    holds: () => K_STAR > 21.27 && K_STAR < 21.29 && PLATEAU < -0.9 && PLATEAU > -1.05,
  },
  {
    // The seven imp-34529 rungs are reproduced VERBATIM (tail residual ~2.055e-3, early shrink geomean ~0.341).
    id: 'imp34550-reproduces-imp34529-seven-rung-tail',
    description: 'imp-34529 tail residual ~2.055e-3 and early shrink geomean ~0.341 reproduced verbatim',
    holds: () =>
      Math.abs(RESIDUALS[N_INHERITED - 1] - 2.055e-3) < 5e-5 &&
      EARLY_SHRINK_GEOMEAN > 0.30 &&
      EARLY_SHRINK_GEOMEAN < 0.38,
  },
  {
    // (F1) Two new rungs: pole still climbs, residual still shrinks, values as measured.
    id: 'imp34550-new-rungs-keep-converging',
    description: 'new rungs: poles 21.279970/21.280579 climb, residuals 9.78e-4/3.69e-4 shrink monotonically',
    holds: () =>
      ALL_POLES_MONOTONE_INCREASING === true &&
      ALL_RESIDUALS_MONOTONE_DECREASING === true &&
      Math.abs(NEW_POLES[0] - 21.279970) < 1e-4 &&
      Math.abs(NEW_POLES[1] - 21.280579) < 1e-4 &&
      Math.abs(NEW_RESIDUALS[0] - 9.776e-4) < 5e-6 &&
      Math.abs(NEW_RESIDUALS[1] - 3.688e-4) < 5e-6 &&
      NEW_POLES[1] < K_STAR,
  },
  {
    // (F2) The ~1/3 geometric shrink does NOT persist -- the new shrink geomean is ABOVE the early ~0.341.
    id: 'imp34550-one-third-shrink-does-not-persist',
    description: 'new-rung shrink ratios (~0.476, ~0.377; geomean ~0.424) exceed the early ~0.341 -- contraction slows',
    holds: () =>
      SHRINK_SLOWS === true &&
      NEW_SHRINK_GEOMEAN > EARLY_SHRINK_GEOMEAN &&
      NEW_SHRINK_GEOMEAN > 0.38 &&
      NEW_SHRINKS.every((s) => s > 0.34),
  },
  {
    // (F3) The slowdown is NOT the imp-34368 noise floor: new residuals sit ~4 decades ABOVE dk ~ 7.2e-8.
    id: 'imp34550-slowdown-not-noise-floor',
    description: 'new residuals ~1e3..1e4x above the imp-34368 resid_exp floor dk ~ 7.2e-8; floor not binding',
    holds: () =>
      NOISE_FLOOR_IS_BINDING === false &&
      NEW_RESID_OVER_FLOOR.every((r) => r > 1000) &&
      TIGHTEST_RESID_OVER_FLOOR > 1000 &&
      RESIDEXP_NOISE_FLOOR_DK === 7.2e-8,
  },
  {
    // Honesty gate: cross-validation / measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34550-honesty-gate-no-qed',
    description: 'measurement/cross-validation only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34550_RECOVERED_POLE_LADDER_TWO_TIGHTER_RUNGS.isRigorous === false &&
      /NO QED/.test(IMP34550_RECOVERED_POLE_LADDER_TWO_TIGHTER_RUNGS.verdict) &&
      /refereed bound is changed/i.test(IMP34550_RECOVERED_POLE_LADDER_TWO_TIGHTER_RUNGS.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34550_RECOVERED_POLE_LADDER_TWO_TIGHTER_RUNGS.verdict),
  },
];

for (const a of IMP34550_RECOVERED_POLE_LADDER_TWO_TIGHTER_RUNGS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34550-recovered-pole-ladder-two-tighter-rungs assertion failed: ${a.id}`);
  }
}
