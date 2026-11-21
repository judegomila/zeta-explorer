/**
 * @module imp-34529-recovered-pole-convergence-vs-inherited
 *
 * imp-34529 (accuracy, frontier-direction): imp-34512 R3 reported the naive 1/leak linear-root pole
 * estimate climbing 19.98 -> 21.22 -> 21.26 as the fit window tightens onto the inherited imp-34023
 * pole k* ~ 21.28095, but only sampled THREE windows and never tabulated the recovered-pole-vs-inherited
 * residual |k*_recovered - 21.28095| as a standalone convergence check. This module tabulates the
 * recovered pole across a GRADED seven-rung ladder of tightening windows, reports the residual and its
 * per-rung shrink rate, and confirms the sequence converges monotonically onto the inherited pole. It
 * reuses the IDENTICAL imp-34247 metric, imp-34188 y(k) surrogate, imp-34023 pole, and imp-34512
 * invLeakRoot 1/leak-linear-root estimator VERBATIM.
 *
 * Cross-validation / measurement only; the component model is NOT rigorous; the inherited surrogate is
 * NOT a rigorous asymptotic; no bound changes; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 * K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 / imp-34512, reused VERBATIM)
 * ---------------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); dy/dk is the symmetric central-difference local slope. The
 *   pole-leakage leak(k) = 100 |dy/dk(k) - P| / |P| is driven by the imp-34023 simple pole at
 *   k* ~ 21.28095. For a pure simple pole leak = B/(k* - k), so 1/leak is linear in k with root exactly
 *   at k = k*: the imp-34512 invLeakRoot(kLo, kHi, dk) OLS-fits 1/leak(k) over a window and returns the
 *   x-intercept, a naive estimate of the pole location.
 *
 * THE FINDING (recovered pole converges GEOMETRICALLY onto the inherited k*)
 * -------------------------------------------------------------------------
 *   (R1) THE RECOVERED POLE CLIMBS MONOTONICALLY TOWARD THE INHERITED k* AS THE WINDOW TIGHTENS. Over
 *        the seven windows the 1/leak-root estimate is 19.981, 20.808, 21.115, 21.226, 21.263, 21.275,
 *        21.279 -- strictly increasing, each rung closer to the inherited imp-34023 pole k* ~ 21.28095.
 *        The three imp-34512 waypoints are reproduced VERBATIM: [18.0,20.6] -> 19.981 (kStarFitWindow),
 *        [20.7,21.15] -> 21.226 (kStarFitNear ~ 21.224), [21.0,21.18] -> 21.263 (kStarFitClosest).
 *   (R2) THE RESIDUAL |k*_recovered - 21.28095| SHRINKS MONOTONICALLY TO ~0.002. Down the ladder the
 *        residual falls 1.300 -> 0.472 -> 0.166 -> 0.055 -> 0.018 -> 0.0059 -> 0.0021 -- a ~635x
 *        contraction over six rungs, ending ~0.0021 (~0.01% of k*) below the inherited pole. The naive
 *        estimator does NOT stall at a stubborn residual; it converges onto the inherited pole.
 *   (R3) THE SHRINK RATE IS ROUGHLY GEOMETRIC AT ~1/3 PER RUNG. The per-rung residual ratios are
 *        ~0.364, 0.352, 0.331, 0.322, 0.331, 0.350 (geometric mean ~0.341, ~2.9x contraction per
 *        tightening rung), tightly clustered -- the residual decays like a fixed fraction per rung rather
 *        than plateauing, so this INDEPENDENT recovered-pole sequence cross-validates the inherited
 *        imp-34023 k* ~ 21.28095 as the genuine simple-pole location (consistent with the imp-34512 R3
 *        effective-exponent collapse 2.12 -> 1.14 toward order 1).
 *
 * The punchline: imp-34512 R3 noted the 1/leak-root recovers the pole "as the window tightens" but only
 * gave three points {19.98, 21.22, 21.26}. Tabulating a seven-rung ladder shows the recovered pole
 * climbs 19.981 -> ... -> 21.279 and the residual to the inherited k* ~ 21.28095 shrinks geometrically
 * (~1/3 per rung, ~635x total) to ~0.002 -- a clean standalone cross-validation that the naive estimator
 * converges ONTO the inherited pole, not to a distinct value.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY. Tabulating the convergence of an inherited 1/leak-root estimator
 * onto an inherited pole, NOT an RH bound. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a numerical/structural
 * observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34512-pole-leakage-fit-15-20-percent-crossings (R3 recovered-pole {19.98,21.22,21.26}; invLeakRoot reused)
 * @see imp-34247-widening-slope-pole-divergence (R3 contaminationLadder devPct -- the metric)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the widening-slope surrogate the pole leakage corrupts)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the residExp sign-change simple pole k* ~ 21.281)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247 / imp-34512
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-34247/imp-34512 sub-terms (no re-derivation, no fresh model).
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
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 / imp-34512 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* (imp-34247 / imp-34512 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 / imp-34512 k*)

const PLATEAU = localSlope(14, stepFor(14, K_STAR)); // ~ -0.977 clean far-field plateau
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1. The imp-34512 1/leak-linear-root pole estimator, reused VERBATIM ----
// A pure simple pole leak = B/(k* - k) => 1/leak linear in k with x-intercept at k = k*.
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

// ---- 2. Graded ladder of tightening windows: recovered pole vs inherited k* ----
// Each rung raises both window edges toward k*; three edges reproduce imp-34512 (kStarFitWindow/Near/Closest).
const WINDOWS = [
  { kLo: 18.0, kHi: 20.6, dk: 0.1 }, // imp-34512 kStarFitWindow ~19.981
  { kLo: 19.5, kHi: 20.8, dk: 0.05 },
  { kLo: 20.3, kHi: 21.0, dk: 0.02 },
  { kLo: 20.7, kHi: 21.15, dk: 0.01 }, // imp-34512 kStarFitNear ~21.224
  { kLo: 21.0, kHi: 21.18, dk: 0.005 }, // imp-34512 kStarFitClosest ~21.263
  { kLo: 21.1, kHi: 21.24, dk: 0.005 },
  { kLo: 21.18, kHi: 21.26, dk: 0.004 },
];
const LADDER = [];
let prevResid = null;
for (const w of WINDOWS) {
  const root = invLeakRoot(w.kLo, w.kHi, w.dk);
  const resid = Math.abs(root - K_STAR);
  const shrink = prevResid == null ? null : +(resid / prevResid).toFixed(4);
  LADDER.push({
    window: [w.kLo, w.kHi],
    dk: w.dk,
    recoveredPole: +root.toFixed(5),
    residual: +resid.toFixed(5),
    shrink,
  });
  prevResid = resid;
}

// ---- 3. Convergence summary ----
const RECOVERED_POLES = LADDER.map((r) => r.recoveredPole); // 19.981 -> ... -> 21.279
const RESIDUALS = LADDER.map((r) => r.residual); // 1.300 -> ... -> 0.002
const SHRINKS = LADDER.slice(1).map((r) => r.shrink); // ~[0.364,0.352,0.331,0.322,0.331,0.350]
let RECOVERED_MONOTONE_INCREASING = true;
for (let i = 1; i < RECOVERED_POLES.length; i++) {
  if (RECOVERED_POLES[i] <= RECOVERED_POLES[i - 1]) RECOVERED_MONOTONE_INCREASING = false;
}
let RESIDUAL_MONOTONE_DECREASING = true;
for (let i = 1; i < RESIDUALS.length; i++) {
  if (RESIDUALS[i] >= RESIDUALS[i - 1]) RESIDUAL_MONOTONE_DECREASING = false;
}
const RESIDUAL_FIRST = RESIDUALS[0]; // ~1.29986
const RESIDUAL_LAST = RESIDUALS[RESIDUALS.length - 1]; // ~0.00205
const TOTAL_CONTRACTION = +(RESIDUAL_FIRST / RESIDUAL_LAST).toFixed(1); // ~634.6
// geometric mean of the per-rung shrink ratios
const SHRINK_GEOMEAN = +Math.exp(
  SHRINKS.reduce((a, b) => a + Math.log(b), 0) / SHRINKS.length,
).toFixed(4); // ~0.341 (~2.9x contraction per rung)
const RESIDUAL_LAST_PCT_OF_KSTAR = +((100 * RESIDUAL_LAST) / K_STAR).toFixed(4); // ~0.0097% of k*

export const IMP34529_RECOVERED_POLE_CONVERGENCE_VS_INHERITED = {
  id: 'imp-34529',
  proofSection: 'S-frontier',
  question:
    'imp-34512 R3 reported the naive 1/leak linear-root pole estimate climbing 19.98 -> 21.22 -> 21.26 ' +
    'as the fit window tightens onto the inherited imp-34023 pole k* ~ 21.28095, but only over three ' +
    'windows and never tabulated the recovered-pole-vs-inherited residual as a standalone convergence ' +
    'check. Tabulate the recovered pole across a graded ladder of tightening windows, report the residual ' +
    '|k*_recovered - 21.28095| and its shrink rate, and confirm convergence onto the inherited pole. ' +
    'Cross-validation / measurement only; inherited surrogate NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'The imp-34512 1/leak-linear-root pole estimate recovered over seven tightening OLS windows, its ' +
    'residual |k*_recovered - K_STAR| to the inherited imp-34023 pole, and the per-rung shrink ratio of ' +
    'that residual',
  poleLocation: +K_STAR.toFixed(5), // ~21.28095 (imp-34023 / imp-34247 / imp-34512 k*)
  plateau: +PLATEAU.toFixed(4), // ~ -0.977 clean far-field plateau
  ladder: LADDER, // seven rungs {window, dk, recoveredPole, residual, shrink}
  recoveredPoles: RECOVERED_POLES, // 19.981 -> 20.808 -> 21.115 -> 21.226 -> 21.263 -> 21.275 -> 21.279
  residuals: RESIDUALS, // 1.300 -> 0.472 -> 0.166 -> 0.055 -> 0.018 -> 0.0059 -> 0.0021
  shrinks: SHRINKS, // ~[0.364,0.352,0.331,0.322,0.331,0.350] -- tightly clustered near 1/3
  recoveredMonotoneIncreasing: RECOVERED_MONOTONE_INCREASING, // true -- climbs toward k*
  residualMonotoneDecreasing: RESIDUAL_MONOTONE_DECREASING, // true -- converges onto k*
  residualFirst: RESIDUAL_FIRST, // ~1.29986 (naive pre-pole window)
  residualLast: RESIDUAL_LAST, // ~0.00205 (tightest window)
  totalContraction: TOTAL_CONTRACTION, // ~634.6x over six rungs
  shrinkGeoMean: SHRINK_GEOMEAN, // ~0.341 -- ~2.9x contraction per tightening rung (roughly geometric)
  residualLastPctOfKStar: RESIDUAL_LAST_PCT_OF_KSTAR, // ~0.0097% -- tightest window within ~0.01% of k*
  finding: {
    R1_recovered_pole_climbs_to_inherited:
      'Across seven tightening windows the 1/leak-root pole estimate is 19.981, 20.808, 21.115, 21.226, ' +
      '21.263, 21.275, 21.279 -- strictly increasing toward the inherited imp-34023 pole k* ~ 21.28095. ' +
      'The three imp-34512 waypoints reproduce VERBATIM: [18.0,20.6] -> 19.981 (kStarFitWindow), ' +
      '[20.7,21.15] -> 21.226 (kStarFitNear ~21.224), [21.0,21.18] -> 21.263 (kStarFitClosest).',
    R2_residual_shrinks_to_two_thousandths:
      'The residual |k*_recovered - 21.28095| shrinks monotonically 1.300 -> 0.472 -> 0.166 -> 0.055 -> ' +
      '0.018 -> 0.0059 -> 0.0021 -- a ~635x contraction over six rungs, ending ~0.0021 (~0.01% of k*) ' +
      'below the inherited pole. The naive estimator converges ONTO the inherited pole, not to a stubborn ' +
      'residual.',
    R3_shrink_roughly_geometric_one_third:
      'The per-rung residual ratios ~0.364, 0.352, 0.331, 0.322, 0.331, 0.350 cluster tightly (geometric ' +
      'mean ~0.341, ~2.9x contraction per rung) -- the residual decays like a fixed fraction per rung ' +
      'rather than plateauing, so this INDEPENDENT recovered-pole sequence cross-validates the inherited ' +
      'imp-34023 k* ~ 21.28095 as the genuine simple-pole location (consistent with the imp-34512 R3 ' +
      'effective-exponent collapse 2.12 -> 1.14 toward order 1).',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION / MEASUREMENT (frontier-direction, NOT rigorous). Tabulating the imp-34512 ' +
    '1/leak-linear-root pole estimator over a graded seven-rung ladder of tightening windows shows the ' +
    'recovered pole climbs monotonically 19.981 -> 20.808 -> 21.115 -> 21.226 -> 21.263 -> 21.275 -> ' +
    '21.279 and the residual to the inherited imp-34023 pole k* ~ 21.28095 shrinks monotonically 1.300 -> ' +
    '0.472 -> 0.166 -> 0.055 -> 0.018 -> 0.0059 -> 0.0021 (~635x over six rungs, ~2.9x per rung, ending ' +
    '~0.01% of k* away). The three imp-34512 waypoints {19.98, 21.22, 21.26} are reproduced verbatim. ' +
    'The naive estimator converges ONTO the inherited pole, cross-validating k* ~ 21.28095 as the genuine ' +
    'simple-pole location. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the residExp simple-zero structure is a numerical/structural observation, not a ' +
    'derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34512 (R3 recovered-pole {19.98,21.22,21.26}; invLeakRoot reused); imp-34247 (R3 ' +
    'contaminationLadder devPct -- the metric); imp-34188 (the widening-slope surrogate); imp-34023 ' +
    '(residExp simple pole k* ~ 21.281); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34529_RECOVERED_POLE_CONVERGENCE_VS_INHERITED_ASSERTIONS = [
  {
    // The pole and plateau match imp-34247 / imp-34512 (inherited primitives reproduced).
    id: 'imp34529-inherited-metric-reproduces-imp34512',
    description: 'k* ~ 21.281, P ~ -0.977 match imp-34247 / imp-34512',
    holds: () => K_STAR > 21.27 && K_STAR < 21.29 && PLATEAU < -0.9 && PLATEAU > -1.05,
  },
  {
    // (R1) The recovered pole climbs monotonically and reproduces the three imp-34512 waypoints.
    id: 'imp34529-recovered-pole-climbs-to-inherited',
    description: 'recovered pole strictly increases toward k* and reproduces imp-34512 {19.98,21.22,21.26}',
    holds: () =>
      RECOVERED_MONOTONE_INCREASING === true &&
      Math.abs(RECOVERED_POLES[0] - 19.981) < 0.01 &&
      Math.abs(RECOVERED_POLES[3] - 21.226) < 0.01 &&
      Math.abs(RECOVERED_POLES[4] - 21.263) < 0.01 &&
      RECOVERED_POLES[RECOVERED_POLES.length - 1] < K_STAR &&
      RECOVERED_POLES[RECOVERED_POLES.length - 1] > 21.27,
  },
  {
    // (R2) The residual to the inherited pole shrinks monotonically to ~0.002 (~635x contraction).
    id: 'imp34529-residual-shrinks-to-inherited-pole',
    description: 'residual |k*_recovered - K_STAR| decreases monotonically 1.300 -> ~0.002, ~635x contraction',
    holds: () =>
      RESIDUAL_MONOTONE_DECREASING === true &&
      Math.abs(RESIDUAL_FIRST - 1.29986) < 0.01 &&
      RESIDUAL_LAST < 0.005 &&
      TOTAL_CONTRACTION > 400 &&
      RESIDUAL_LAST_PCT_OF_KSTAR < 0.02,
  },
  {
    // (R3) The per-rung shrink rate is roughly geometric at ~1/3, tightly clustered.
    id: 'imp34529-shrink-roughly-geometric-one-third',
    description: 'per-rung residual shrink ratios cluster near 1/3 (geometric mean ~0.341)',
    holds: () =>
      SHRINK_GEOMEAN > 0.30 &&
      SHRINK_GEOMEAN < 0.38 &&
      SHRINKS.every((s) => s > 0.28 && s < 0.40),
  },
  {
    // Honesty gate: cross-validation / measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34529-honesty-gate-no-qed',
    description: 'measurement/cross-validation only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34529_RECOVERED_POLE_CONVERGENCE_VS_INHERITED.isRigorous === false &&
      /NO QED/.test(IMP34529_RECOVERED_POLE_CONVERGENCE_VS_INHERITED.verdict) &&
      /refereed bound is changed/i.test(IMP34529_RECOVERED_POLE_CONVERGENCE_VS_INHERITED.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34529_RECOVERED_POLE_CONVERGENCE_VS_INHERITED.verdict),
  },
];

for (const a of IMP34529_RECOVERED_POLE_CONVERGENCE_VS_INHERITED_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34529-recovered-pole-convergence-vs-inherited assertion failed: ${a.id}`);
  }
}
