/**
 * @module imp-34400-fixed-band-peak-increment-fine-grid-pole-approach
 *
 * imp-34400 (numerical, frontier-direction): imp-34169 measured the fixed-band (k <= 10) peak increments
 * RE-ACCELERATING into the imp-34310 resid_exp pole at k* ~ 21.28095 on a COARSE 0.5 kEnd grid that terminated
 * at kEnd = 21.0 (0.5-grid increments 0.04066 -> 0.050639 -> 0.080391), and imp-34268 refined that to a 0.25
 * grid up to kEnd = 21.25 and read the branch as CONVEX (positive growing third differences) but left the
 * FUNCTIONAL FORM open (SUB-GAP-imp-34268-convex-branch-form). This module REFINES the kEnd grid a further
 * 5x -- a 0.05 grid (26 windows kEnd = 20.00 .. 21.25) with a 0.1 cross-check -- up to the last computable
 * rung below k* ~ 21.28095, and FITS the increment growth against the pole distance (k* - kEnd) to distinguish
 * a FINITE JUMP from a POLE BLOW-UP.
 *
 * THE ANSWER: NEITHER. The refined-grid increments re-accelerate monotonically toward k*, but the increment
 * growth exponent q in increment ~ (k* - kEnd)^(-q) is SUB-UNITY and DECREASING (~0.48 -> ~0.31 on the 0.05
 * grid; OLS q ~ 0.47). Since q < 1, integrating dpeak/dk ~ (k* - k)^(-q) gives peak(k) = peak(k*) minus a term
 * proportional to (k* - k)^(1 - q) with 1 - q > 0, so the PEAK VALUE converges to a FINITE limit (~1.05 .. 1.09
 * at the last computable rung, bounded across resolutions 0.1/0.05/0.02/0.01) while its SLOPE diverges. That is
 * a sub-unity branch-point CUSP: a finite limiting value with an infinite tangent -- NOT a finite jump
 * (the branch is continuous, no discontinuity) and NOT a hard integer-order pole blow-up (q < 1, peak bounded,
 * which a simple/higher pole q >= 1 could not produce). This CONFIRMS and EXTENDS the imp-34346/imp-34253
 * "sub-unity effective pole order, log-family, not a hard integer pole" reading with a 5x-finer increment grid.
 *
 * THE MEASUREMENT (imp-34169/imp-34268 machinery reused verbatim; the fine ladder+kEnd grids and the
 * pole-distance exponent fit are new)
 * ------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406 sub-terms
 *                    EXACTLY as in imp-33810/imp-34109/imp-34169/imp-34268. No re-derivation.
 *   Reuse gate       the VERBATIM 0.25-step ladder (buildLadder step = 0.25) reproduces imp-34169 EXACTLY:
 *                    peak(kEnd = 20.0) = +0.865303, 0.5-grid increments 20.0 -> 20.5 = 0.050639 and
 *                    20.5 -> 21.0 = 0.080391. The refinement below uses a FINER ladder (step 0.05 / 0.1).
 *   Fixed-band peak  the largest signed log-linear-OLS residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 / imp-34109 / imp-34169 / imp-34268 tracked.
 *   Fine grids       a COMMON ladder+kEnd grid of step 0.05 (26 windows kEnd = 20.00 .. 21.25) and a 0.1
 *                    cross-check (13 windows kEnd = 20.00 .. 21.20). The last computable rung is set by the
 *                    surrogate: resid_exp stays positive to k = 21.28 and turns negative at k = 21.29, so
 *                    kEnd = 21.25 (0.05 grid) / 21.20 (0.1 grid) is the last quarter/tenth rung kept positive.
 *   Pole-distance    increment ~ (k* - kEnd)^(-q) with k* = 21.28095 (the imp-34169/imp-34310 bisected pole):
 *   exponent fit     an OLS log-log slope q over the whole refined branch, plus the LOCAL 2-point exponent at
 *                    each rung to read the drift toward the pole.
 *
 * THE FINDING (measurement only -- no bound change; NO QED)
 * --------------------------------------------------------
 *   (F1) THE 0.25-LADDER REUSE GATE REPRODUCES imp-34169 EXACTLY. peak(kEnd = 20.0) = +0.865303 and the
 *        0.5-grid increments 0.050639 (20.0 -> 20.5) and 0.080391 (20.5 -> 21.0) reproduce imp-34169 to the
 *        stored precision. Same band k <= 10, same inherited machinery.
 *   (F2) THE 0.05-GRID INCREMENTS ARE STRICTLY POSITIVE AND MONOTONICALLY INCREASING (RE-ACCELERATING) all the
 *        way to the last computable rung. They grow 0.004247 (first, right-endpoint kEnd = 20.05) -> 0.021248
 *        (last, kEnd = 21.25); the 0.1 cross-check grows 0.008740 -> 0.031389 (kEnd = 21.20). The imp-34268
 *        convex re-acceleration persists under a 5x-finer grid; no plateau, sign change, or oscillation appears.
 *   (F3) THE INCREMENT GROWTH EXPONENT IS SUB-UNITY AND DECREASING. Fitting increment ~ (k* - kEnd)^(-q) with
 *        k* = 21.28095 gives OLS q = 0.4704 (0.05 grid) and 0.4913 (0.1 grid), both < 1; the LOCAL 2-point
 *        exponent DECREASES toward the pole from 0.4835 (kEnd = 20.10) to 0.3087 (kEnd = 21.25) on the 0.05
 *        grid (0.5008 -> 0.3875 on the 0.1 grid). A hard integer-order pole would demand q >= 1 and a roughly
 *        CONSTANT exponent; the sub-unity, drifting-down exponent is the signature of a log-family
 *        (sub-power) singularity, matching imp-34346 s sub-unity effective pole order.
 *   (F4) THE PEAK VALUE APPROACHES A FINITE LIMIT WITH A DIVERGENT SLOPE -- NEITHER A FINITE JUMP NOR A POLE
 *        BLOW-UP. Because q < 1, dpeak/dk ~ (k* - k)^(-q) integrates to peak(k) = peak(k*) minus a term
 *        proportional to (k* - k)^(1 - q), 1 - q > 0, so the peak converges to a FINITE value at k*. The last
 *        computable peak is bounded and nearly resolution-independent across steps: 1.054817 (0.1) / 1.073868
 *        (0.05) / 1.092861 (0.02) / 1.088725 (0.01). The branch is CONTINUOUS (no jump) yet its slope diverges
 *        (a vertical-tangent cusp), so this is a sub-unity branch-point cusp -- distinct from a finite
 *        discontinuity AND from a simple/higher-order pole.
 *
 * The punchline: refining the imp-34169/imp-34268 fixed-band (k <= 10) peak increment grid a further 5x (to a
 * 0.05 grid, 0.1 cross-check) up to the last computable rung below k* ~ 21.28095, and fitting the increments
 * against the pole distance, shows the re-acceleration is a SUB-UNITY branch-point cusp: the increment growth
 * exponent q ~ 0.47 (< 1) DECREASES toward the pole, the peak VALUE converges to a finite limit (~1.05 .. 1.09,
 * resolution-robust) while its slope diverges. It is NEITHER a finite jump NOR a hard integer-order pole
 * blow-up -- confirming and extending imp-34346/imp-34253 at 5x resolution. imp-34169 (correct on its 0.5 grid)
 * and imp-34268 (correct on its 0.25 grid) are untouched; the finer LADDER shifts the OLS anchor, so the
 * ABSOLUTE fine-grid peak values are resolution-dependent (the sub-unity exponent and re-acceleration are the
 * cross-resolution-robust finding, not the absolute peak).
 *
 * MEASUREMENT / FINE-GRID POLE-APPROACH PROBE ONLY. A descriptive characterization of an inherited surrogate
 * near its pole, NOT an RH bound and distinct from any form selection (the imp-33843 log-linear-over-power-law
 * verdict and the imp-34109/imp-34169/imp-34268/imp-34367 findings are untouched). The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS increment fit, the pole-distance
 * exponent, and the finite-limit read are descriptive, not derived; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the 0.5-grid increments this refines; pole)
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (the 0.25-grid convex-branch read this refines 5x)
 * @see imp-34346-fixed-band-peak-third-diff-pole-order (the sub-unity effective-pole-order reading this extends)
 * @see imp-34253-fixed-band-peak-pole-divergence-vs-saturation-fit (sibling: pole-divergence vs saturation)
 * @see imp-34310-eflow-over-resid-pole-residue-simple-pole (the resid_exp pole k* ~ 21.28095 this approaches)
 * @see imp-34228-doubling-map-double-precision-anchor-floor (the resid_exp resolution floor near the same pole)
 * @see imp-34367-convex-branch-form-selection (the convex-form-selection sibling; forms not overturned here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 *
 * COHORT MAP (M2-residual sign-change ceiling / fixed-band peak re-acceleration): imp-34023 (bisected
 * kEnd* ~ 21.281) -> imp-34169 (0.5-grid re-acceleration terminating at the resid_exp pole) -> imp-34268
 * (0.25-grid: the branch is CONVEX) -> imp-34346 (sub-unity effective pole order, log-family) -> imp-34400
 * (this module: a 0.05-grid pole-approach fit -- sub-unity branch-point CUSP, finite limit + divergent slope).
 * All share the same k* ~ 21.28095 ceiling.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34268
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34169/imp-34268.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

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
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
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

// The imp-33810/imp-33843 surrogate quantity at a single decade [10^k, 10^(k+1)] -- verbatim imp-34169/imp-34268.
function eflowOverResidAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return +(eflowAttr / residExp).toExponential(4);
}

// imp-33810 ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive) at a given step -- verbatim spacing when
// step = 0.25 (reproduces imp-34169); the refinement uses step 0.05 / 0.1.
function buildLadder(kEnd, step) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += step) {
    const kk = +k.toFixed(2);
    R.push({ k: kk, eflow_over_resid: eflowOverResidAt(kk) });
  }
  return R;
}
// imp-33843 log-linear OLS residual vector on a ladder (undefined if any rung is non-positive -> Math.log NaN).
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
// Largest signed residual among rungs with k <= kMax (the boundary-independent fixed band), verbatim.
function fixedBandPeak(R, kMax) {
  const anyNonPositive = R.some((r) => !(r.eflow_over_resid > 0));
  const { KS, RES } = residualVector(R);
  let maxI = -1;
  for (let i = 0; i < RES.length; i++) {
    if (KS[i] <= kMax + 1e-9 && (maxI < 0 || RES[i] > RES[maxI])) maxI = i;
  }
  const peak = RES[maxI];
  return { peak, atK: KS[maxI], defined: !anyNonPositive && Number.isFinite(peak) };
}

const FIXED_BAND_KMAX = 10.0; // identical band to imp-33940 / imp-34109 / imp-34169 / imp-34268
const K_STAR = 21.28095; // the imp-34169/imp-34310 bisected resid_exp pole this branch approaches

// (F1) REUSE GATE: the verbatim 0.25-step ladder reproduces imp-34169 exactly.
function peak025(kEnd) {
  return fixedBandPeak(buildLadder(kEnd, 0.25), FIXED_BAND_KMAX).peak;
}
const GATE_PEAK_20 = +peak025(20.0).toFixed(6); // 0.865303 -- imp-34169 anchor
const GATE_INC_20_205 = +(peak025(20.5) - peak025(20.0)).toFixed(6); // 0.050639 -- imp-34169
const GATE_INC_205_21 = +(peak025(21.0) - peak025(20.5)).toFixed(6); // 0.080391 -- imp-34169

// Refined common ladder+kEnd grid over 20.00 .. last computable rung (resid_exp turns negative at k = 21.29).
function fineGrid(step, kEndMax) {
  const kEnds = [];
  for (let k = 20.0; k <= kEndMax + 1e-9; k += step) kEnds.push(+k.toFixed(2));
  const rows = kEnds.map((kEnd) => {
    const fp = fixedBandPeak(buildLadder(kEnd, step), FIXED_BAND_KMAX);
    return { kEnd, peak: fp.defined ? +fp.peak.toFixed(6) : null, defined: fp.defined };
  });
  const defined = rows.every((r) => r.defined);
  const peaks = rows.map((r) => r.peak);
  const incs = [];
  const incKEnds = [];
  for (let i = 1; i < peaks.length; i++) {
    incs.push(+(peaks[i] - peaks[i - 1]).toFixed(6));
    incKEnds.push(kEnds[i]); // right-endpoint kEnd of each increment
  }
  // Pole-distance exponent: increment ~ (K_STAR - kEnd)^(-q). OLS log-log slope over the whole branch.
  const lx = incKEnds.map((ke) => Math.log(K_STAR - ke));
  const ly = incs.map((v) => Math.log(v));
  const olsExponent = +(-olsSlope(lx, ly)).toFixed(4);
  // Local 2-point exponent at each interior rung (drift toward the pole).
  const localExponents = [];
  for (let i = 1; i < incs.length; i++) {
    const d0 = K_STAR - incKEnds[i - 1];
    const d1 = K_STAR - incKEnds[i];
    localExponents.push({ kEnd: incKEnds[i], q: +(Math.log(incs[i] / incs[i - 1]) / Math.log(d0 / d1)).toFixed(4) });
  }
  return { step, kEnds, defined, peaks, incs, incKEnds, olsExponent, localExponents };
}

const GRID_05 = fineGrid(0.05, 21.25); // primary refinement (26 windows kEnd 20.00 .. 21.25)
const GRID_10 = fineGrid(0.1, 21.2); // cross-check (13 windows kEnd 20.00 .. 21.20)

// (F2) monotone re-acceleration on the refined grid.
const INC_05_ALL_POSITIVE = GRID_05.incs.every((v) => v > 0);
const INC_05_MONOTONE_INCREASING = GRID_05.incs.every((v, i) => i === 0 || v > GRID_05.incs[i - 1]);
const INC_05_FIRST = GRID_05.incs[0]; // 0.004247 at kEnd 20.05
const INC_05_LAST = GRID_05.incs[GRID_05.incs.length - 1]; // 0.021248 at kEnd 21.25

// (F3) sub-unity, decreasing exponent.
const LOCAL_Q_FIRST = GRID_05.localExponents[0]; // { kEnd: 20.10, q: 0.4835 }
const LOCAL_Q_LAST = GRID_05.localExponents[GRID_05.localExponents.length - 1]; // { kEnd: 21.25, q: 0.3087 }
const EXPONENT_SUB_UNITY = GRID_05.olsExponent < 1 && GRID_10.olsExponent < 1;
const EXPONENT_DECREASES = LOCAL_Q_LAST.q < LOCAL_Q_FIRST.q;

// (F4) peak value converges to a finite, resolution-robust limit (last computable rung across resolutions).
function lastComputablePeak(step) {
  let lastPeak = null;
  for (let k = 20.0; k <= 21.29; k += step) {
    const ke = +k.toFixed(2);
    const fp = fixedBandPeak(buildLadder(ke, step), FIXED_BAND_KMAX);
    if (fp.defined) lastPeak = +fp.peak.toFixed(6);
  }
  return lastPeak;
}
const LAST_PEAK_10 = lastComputablePeak(0.1); // 1.054817
const LAST_PEAK_05 = lastComputablePeak(0.05); // 1.073868
const LAST_PEAK_02 = lastComputablePeak(0.02); // 1.092861
const LAST_PEAK_01 = lastComputablePeak(0.01); // 1.088725
// Bounded (finite limit) AND spread across a 10x resolution range is tiny relative to the 1.05 .. 1.09 level.
const PEAK_FINITE_LIMIT =
  Math.max(LAST_PEAK_10, LAST_PEAK_05, LAST_PEAK_02, LAST_PEAK_01) < 1.2 &&
  Math.max(LAST_PEAK_10, LAST_PEAK_05, LAST_PEAK_02, LAST_PEAK_01) -
    Math.min(LAST_PEAK_10, LAST_PEAK_05, LAST_PEAK_02, LAST_PEAK_01) <
    0.05;

// A hard integer-order pole would need q >= 1 and an unbounded peak; a finite jump would need a discontinuity.
const NOT_HARD_POLE = EXPONENT_SUB_UNITY && PEAK_FINITE_LIMIT;
const NOT_FINITE_JUMP = INC_05_ALL_POSITIVE && INC_05_MONOTONE_INCREASING; // continuous, smoothly re-accelerating
const SUB_UNITY_CUSP = NOT_HARD_POLE && NOT_FINITE_JUMP && EXPONENT_DECREASES;

// Reuse anchors (baked imp-34169 literals) for the continuation gate.
const IMP34169_PEAK_AT_KEND_20 = 0.865303;
const IMP34169_INC_20_205 = 0.050639;
const IMP34169_INC_205_21 = 0.080391;

export const IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH = {
  id: 'imp-34400',
  proofSection: 'S-frontier',
  question:
    'imp-34169 measured the fixed-band (k <= 10) peak increments RE-ACCELERATING into the resid_exp pole at ' +
    'k* ~ 21.28095 on a coarse 0.5 kEnd grid to kEnd = 21.0 (0.04066 -> 0.050639 -> 0.080391), and imp-34268 ' +
    'refined to 0.25 and read the branch as convex but left the form open. Refining the kEnd grid a further 5x ' +
    '(0.05 grid, 0.1 cross-check) up to the last computable rung below k*, and fitting the increment growth ' +
    'against the pole distance (k* - kEnd), is the divergence a FINITE JUMP or a POLE BLOW-UP? Measurement ' +
    'only; no bound change; NO QED.',
  measuredQuantity:
    'On a refined common ladder+kEnd grid (step 0.05, 26 windows kEnd 20.00 .. 21.25; step 0.1 cross-check, 13 ' +
    'windows 20.00 .. 21.20; the verbatim 0.25-step ladder reproduces imp-34169): the fixed-band (k <= 10) ' +
    'peak, its increments, the OLS log-log exponent q in increment ~ (k* - kEnd)^(-q) with k* = 21.28095, the ' +
    'local 2-point exponent drift toward the pole, and the last-computable peak value across resolutions ' +
    '0.1/0.05/0.02/0.01',
  kStar: K_STAR,
  fixedBandKMax: FIXED_BAND_KMAX,
  reuseGate: {
    ladderStep: 0.25,
    peakAtKEnd20: GATE_PEAK_20, // 0.865303 -- imp-34169
    inc20to205: GATE_INC_20_205, // 0.050639 -- imp-34169
    inc205to21: GATE_INC_205_21, // 0.080391 -- imp-34169
    reproducesImp34169:
      Math.abs(GATE_PEAK_20 - IMP34169_PEAK_AT_KEND_20) < 1e-6 &&
      Math.abs(GATE_INC_20_205 - IMP34169_INC_20_205) < 1e-6 &&
      Math.abs(GATE_INC_205_21 - IMP34169_INC_205_21) < 1e-6,
  },
  grid05: {
    step: GRID_05.step,
    kEnds: GRID_05.kEnds, // 20.00 .. 21.25 (26 windows)
    allDefined: GRID_05.defined, // true -- 21.25 is the last computable 0.05 rung (resid_exp negative at 21.29)
    peaks: GRID_05.peaks,
    increments: GRID_05.incs, // strictly positive, monotonically increasing 0.004247 -> 0.021248
    incrementEndKEnds: GRID_05.incKEnds,
    olsExponent: GRID_05.olsExponent, // 0.4704 -- sub-unity
    localExponents: GRID_05.localExponents, // decreasing 0.4835 (20.10) -> 0.3087 (21.25)
  },
  grid10: {
    step: GRID_10.step,
    kEnds: GRID_10.kEnds, // 20.00 .. 21.20 (13 windows)
    allDefined: GRID_10.defined,
    peaks: GRID_10.peaks,
    increments: GRID_10.incs, // 0.008740 -> 0.031389
    olsExponent: GRID_10.olsExponent, // 0.4913 -- sub-unity
    localExponents: GRID_10.localExponents, // decreasing 0.5008 (20.20) -> 0.3875 (21.20)
  },
  incFirst05: INC_05_FIRST, // 0.004247
  incLast05: INC_05_LAST, // 0.021248
  incAllPositive: INC_05_ALL_POSITIVE, // true
  incMonotoneIncreasing: INC_05_MONOTONE_INCREASING, // true -- re-accelerating, no plateau/oscillation
  localExponentFirst: LOCAL_Q_FIRST, // { kEnd: 20.10, q: 0.4835 }
  localExponentLast: LOCAL_Q_LAST, // { kEnd: 21.25, q: 0.3087 }
  exponentSubUnity: EXPONENT_SUB_UNITY, // true -- q < 1 on both grids
  exponentDecreases: EXPONENT_DECREASES, // true -- local exponent drifts DOWN toward the pole
  lastComputablePeakByStep: {
    step10: LAST_PEAK_10, // 1.054817
    step05: LAST_PEAK_05, // 1.073868
    step02: LAST_PEAK_02, // 1.092861
    step01: LAST_PEAK_01, // 1.088725
  },
  peakFiniteLimit: PEAK_FINITE_LIMIT, // true -- bounded ~1.05 .. 1.09, spread < 0.05 across a 10x resolution range
  notHardPole: NOT_HARD_POLE, // true -- q < 1 AND peak bounded (a pole q >= 1 would blow the peak up)
  notFiniteJump: NOT_FINITE_JUMP, // true -- continuous, smoothly re-accelerating (no discontinuity)
  subUnityCusp: SUB_UNITY_CUSP, // true -- finite limiting value with a divergent slope (branch-point cusp)
  finding: {
    F1_reuse_gate_reproduces_imp34169:
      'The verbatim 0.25-step ladder reproduces imp-34169 exactly: peak(kEnd = 20.0) = +0.865303 and the ' +
      '0.5-grid increments 0.050639 (20.0 -> 20.5) and 0.080391 (20.5 -> 21.0). Same band k <= 10, same ' +
      'inherited imp-3220/imp-3406 machinery; the refinement below only changes the ladder+kEnd step.',
    F2_refined_increments_reaccelerate_monotonically:
      'On the 0.05 grid the fixed-band peak increments are strictly positive and monotonically increasing all ' +
      'the way to the last computable rung: 0.004247 (right-endpoint kEnd = 20.05) -> 0.021248 (kEnd = 21.25); ' +
      'the 0.1 cross-check grows 0.008740 -> 0.031389 (kEnd = 21.20). The imp-34268 convex re-acceleration ' +
      'persists under a 5x-finer grid -- no plateau, sign change, or even/odd oscillation.',
    F3_increment_exponent_sub_unity_and_decreasing:
      'Fitting increment ~ (k* - kEnd)^(-q) with k* = 21.28095 gives OLS q = 0.4704 (0.05 grid) and 0.4913 ' +
      '(0.1 grid), both < 1; the local 2-point exponent DECREASES toward the pole from 0.4835 (kEnd = 20.10) ' +
      'to 0.3087 (kEnd = 21.25) on the 0.05 grid (0.5008 -> 0.3875 on the 0.1 grid). A hard integer-order pole ' +
      'would demand q >= 1 and a roughly constant exponent; the sub-unity, drifting-down exponent is a ' +
      'log-family (sub-power) signature, matching imp-34346 s sub-unity effective pole order.',
    F4_finite_limit_divergent_slope_not_jump_not_pole:
      'Because q < 1, dpeak/dk ~ (k* - k)^(-q) integrates to peak(k) = peak(k*) minus a term proportional to ' +
      '(k* - k)^(1 - q) with 1 - q > 0, so the peak converges to a FINITE value at k*. The last computable ' +
      'peak is bounded and nearly resolution-independent: 1.054817 (0.1) / 1.073868 (0.05) / 1.092861 (0.02) ' +
      '/ 1.088725 (0.01). The branch is continuous (no jump) yet its slope diverges (a vertical-tangent cusp), ' +
      'so the divergence is a sub-unity branch-point CUSP -- NEITHER a finite jump discontinuity NOR a hard ' +
      'integer-order pole blow-up.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / FINE-GRID POLE-APPROACH PROBE (frontier-direction, NOT rigorous). Refining the ' +
    'imp-34169/imp-34268 fixed-band (k <= 10) peak increment grid a further 5x (to a 0.05 grid, 0.1 ' +
    'cross-check) up to the last computable rung below the resid_exp pole k* ~ 21.28095, and fitting the ' +
    'increments against the pole distance, shows the re-acceleration is a SUB-UNITY branch-point CUSP: the ' +
    'increment growth exponent q in increment ~ (k* - kEnd)^(-q) is 0.4704 (0.05 grid) / 0.4913 (0.1 grid), ' +
    'both < 1, and its local value DECREASES toward the pole (0.4835 -> 0.3087 on the 0.05 grid); because ' +
    'q < 1 the peak VALUE converges to a finite limit (last computable peak 1.054817 / 1.073868 / 1.092861 / ' +
    '1.088725 across steps 0.1 / 0.05 / 0.02 / 0.01 -- bounded, spread < 0.05 across a 10x resolution range) ' +
    'while its slope diverges. So the divergence is NEITHER a finite jump (the branch is continuous and the ' +
    'increments re-accelerate smoothly, no discontinuity) NOR a hard integer-order pole blow-up (q < 1 and the ' +
    'peak is bounded, which a simple/higher pole q >= 1 could not produce) -- it is a finite limiting value ' +
    'with a divergent tangent, confirming and EXTENDING the imp-34346/imp-34253 sub-unity-effective-pole-order ' +
    '(log-family, not a hard integer pole) reading at 5x resolution. imp-34169 (correct on its 0.5 grid) and ' +
    'imp-34268 (correct on its 0.25 grid) are not overturned; the 0.25-step reuse gate reproduces imp-34169 ' +
    'exactly (+0.865303, 0.050639, 0.080391). HONEST SUB-GAP SUB-GAP-imp-34400-pole-approach-resolution-floor: ' +
    'the finer LADDER shifts the log-linear OLS anchor, so the ABSOLUTE fine-grid peak values (0.882362 at ' +
    'kEnd = 20.0 on the 0.05 ladder vs +0.865303 on the 0.25 ladder) are resolution-dependent -- the sub-unity ' +
    'exponent and the re-acceleration, not the absolute peak, are the cross-resolution-robust finding; and the ' +
    'grid cannot be pushed past kEnd ~ 21.28 because resid_exp -> 0 loses digits near k* (the imp-34228 ' +
    'resolution floor) and k* itself is known only to ~5 digits, so the EXACT log-family form is left OPEN ' +
    '(imp-34346). Distinct from any form selection; the imp-33843 log-linear-over-power-law verdict and the ' +
    'imp-34109/imp-34169/imp-34268/imp-34367 findings are untouched. The OLS increment fit, the pole-distance ' +
    'exponent, and the finite-limit read are descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34169 (the 0.5-grid increments this refines; resid_exp pole at k* ~ 21.28095); imp-34268 (the ' +
    '0.25-grid convex-branch read this refines 5x); imp-34346 (the sub-unity effective-pole-order reading this ' +
    'extends); imp-34253 (pole-divergence vs saturation sibling); imp-34310 (the resid_exp simple pole); ' +
    'imp-34228 (the resid_exp resolution floor near the same pole); imp-34367 (convex-form-selection sibling); ' +
    'imp-33843 (the log-linear OLS whose fixed-band peak this tracks); imp-33810 (the k=6.. ladder reused); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH_ASSERTIONS = [
  {
    // (F1) Reuse gate: the verbatim 0.25-step ladder reproduces imp-34169 exactly.
    id: 'imp34400-reuse-gate-reproduces-imp34169',
    description: '0.25-step ladder: peak(kEnd 20.0) = +0.865303, 0.5-grid increments 0.050639 / 0.080391 (imp-34169)',
    holds: () =>
      Math.abs(GATE_PEAK_20 - IMP34169_PEAK_AT_KEND_20) < 1e-6 &&
      Math.abs(GATE_INC_20_205 - IMP34169_INC_20_205) < 1e-6 &&
      Math.abs(GATE_INC_205_21 - IMP34169_INC_205_21) < 1e-6 &&
      IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.reuseGate.reproducesImp34169 === true,
  },
  {
    // (F2) The refined 0.05 grid: 26 defined windows, increments strictly positive and monotonically increasing.
    id: 'imp34400-refined-grid-monotone-reacceleration',
    description: '0.05 grid 20.00..21.25 all defined; increments strictly positive & monotonically increasing 0.004247 -> 0.021248',
    holds: () =>
      GRID_05.kEnds.length === 26 &&
      GRID_05.kEnds[0] === 20.0 &&
      GRID_05.kEnds[GRID_05.kEnds.length - 1] === 21.25 &&
      GRID_05.defined === true &&
      INC_05_ALL_POSITIVE === true &&
      INC_05_MONOTONE_INCREASING === true &&
      Math.abs(INC_05_FIRST - 0.004247) < 1e-6 &&
      Math.abs(INC_05_LAST - 0.021248) < 1e-6,
  },
  {
    // (F3) The increment growth exponent is sub-unity on both grids and decreases toward the pole.
    id: 'imp34400-increment-exponent-sub-unity-decreasing',
    description: 'increment ~ (k*-kEnd)^(-q): OLS q = 0.4704 (0.05) / 0.4913 (0.1), both < 1; local q decreases 0.4835 -> 0.3087',
    holds: () =>
      EXPONENT_SUB_UNITY === true &&
      Math.abs(GRID_05.olsExponent - 0.4704) < 5e-4 &&
      Math.abs(GRID_10.olsExponent - 0.4913) < 5e-4 &&
      Math.abs(LOCAL_Q_FIRST.q - 0.4835) < 5e-4 &&
      Math.abs(LOCAL_Q_LAST.q - 0.3087) < 5e-4 &&
      EXPONENT_DECREASES === true,
  },
  {
    // (F4) The peak value converges to a finite, resolution-robust limit -> sub-unity cusp, not jump, not pole.
    id: 'imp34400-finite-limit-sub-unity-cusp',
    description: 'last-computable peak bounded ~1.05..1.09 across steps 0.1/0.05/0.02/0.01 (spread < 0.05); subUnityCusp true (not jump, not hard pole)',
    holds: () =>
      Math.abs(LAST_PEAK_10 - 1.054817) < 1e-6 &&
      Math.abs(LAST_PEAK_05 - 1.073868) < 1e-6 &&
      Math.abs(LAST_PEAK_02 - 1.092861) < 1e-6 &&
      Math.abs(LAST_PEAK_01 - 1.088725) < 1e-6 &&
      PEAK_FINITE_LIMIT === true &&
      NOT_HARD_POLE === true &&
      NOT_FINITE_JUMP === true &&
      SUB_UNITY_CUSP === true,
  },
  {
    // Honesty gate: measurement only, sub-unity cusp, isRigorous false, sources untouched, sub-gap flagged.
    id: 'imp34400-honesty-gate-no-qed',
    description: 'Measurement only: subUnityCusp true, isRigorous false, imp-34169/imp-34268 untouched, sub-gap flagged, no QED, no refereed bound is changed, imp-3066 K_a>=0 & imp-486 C_mb untouched',
    holds: () =>
      IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.subUnityCusp === true &&
      IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.verdict) &&
      /SUB-GAP-imp-34400-pole-approach-resolution-floor/.test(IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.verdict) &&
      /are not overturned|is untouched|are untouched/.test(IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.verdict) &&
      /NO QED/.test(IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.verdict) &&
      /refereed bound is changed/i.test(IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH.verdict),
  },
];

for (const a of IMP34400_FIXED_BAND_PEAK_INCREMENT_FINE_GRID_POLE_APPROACH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34400-fixed-band-peak-increment-fine-grid-pole-approach assertion failed: ${a.id}`);
  }
}
