/**
 * @module imp-34129-widening-slope-drift-convergence-fit
 *
 * imp-34129 (numerical, frontier-direction): imp-34022 R3 found that lengthening the imp-33810
 * ladder tilts the WHOLE imp-33843 log-linear OLS line -- the intercept a drifts 7.959 -> 7.440 and
 * the slope b drifts -1.434 -> -1.367 across just the three BASE (k<=11) / EXT115 (k<=11.5) /
 * EXT12 (k<=12) windows imp-33877 built -- rebalancing residuals down to the low-k edge (whose k=6
 * residual flips sign -0.1142 -> +0.0050). imp-34022 recorded ONLY those three window endpoints and
 * never fit the drift. Does the widening slope b keep drifting indefinitely as the boundary recedes,
 * or does it approach a FINITE limit? This module extends the same inherited ladder much further --
 * kEnd = 11.0, 11.5, ..., 18.0 (15 windows, staying well inside the imp-34023 residExp sign-change
 * ceiling kEnd ~ 21.3, past which the ratio denominator crosses zero and y blows up) -- tabulates the
 * re-fit (a, b) versus kEnd, fits the slope drift to a convergence form, and reports the extrapolated
 * limit with an independent cross-check from the local slope of y(k).
 *
 * THE MEASUREMENT (imp-33810 ladder + imp-33877 model reused verbatim; reuse gate below)
 * -------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-33877 (E_trunc = 3.06e-5 fixed strip,
 *                    E_coll = C_C_PINNED sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall,
 *                    T0 = effectiveHeightForN(N)). Reuse gate: the replicated buildLadder/fitLadder
 *                    reproduces the imp-33877 base (kEnd=11) and ext12 (kEnd=12) log-linear fits to
 *                    machine precision, so the sweep is the SAME measurement pushed further, not a
 *                    fresh model.
 *   Sweep            For kEnd = 11.0, 11.5, ..., 18.0 build the quarter-decade ladder k = 6..kEnd,
 *                    y_k = ln(eflow_over_resid_k), re-run the imp-33843 log-linear OLS y = a + b k,
 *                    and record (a, b). 15 windows spanning kEnd = 11..18 (2 extra decades past EXT12).
 *   Convergence      Fit b(kEnd) to two saturating surrogates -- exponential approach
 *                    b = b_inf + c exp(-lam kEnd) and power approach b = b_inf + c kEnd^(-p) -- by
 *                    grid-searching the nonlinear rate/exponent and OLS on (b_inf, c) at each. The
 *                    limit b_inf is cross-checked against the local slope dy/dk of y(k) at large k,
 *                    which a whole-window OLS over [6, kEnd] must approach as kEnd -> inf.
 *
 * THE FINDING (measurement only -- the widening slope CONVERGES to a finite limit near -1.0)
 * ----------------------------------------------------------------------------------------
 *   (R1) THE SLOPE DRIFT DECELERATES: b RISES WITH SHRINKING INCREMENTS. Across kEnd = 11 -> 18 the
 *        slope drifts monotonically upward (less negative) -1.4337 -> -1.1274, but the per-window-step
 *        increment SHRINKS from ~0.033 (near kEnd=12) to ~0.010 (kEnd 17.5 -> 18) -- a ~3x
 *        deceleration. A slope that drifted without bound would keep a non-vanishing step; the shrinking
 *        increment is the signature of an approach to a finite limit, so the imp-34022 three-window
 *        "whole-line tilt" is the head of a CONVERGING sequence, not open-ended drift.
 *   (R2) THE CONVERGENCE IS EXPONENTIAL-IN-kEnd, WITH LIMIT b_inf ~ -1.01. The exponential-approach
 *        surrogate b = b_inf + c exp(-lam kEnd) fits the 15-window drift with SSR ~5.3e-5, ~1.9x
 *        tighter than the power-approach b = b_inf + c kEnd^(-p) at SSR ~1.0e-4, and extrapolates to a
 *        finite b_inf ~ -1.014 (rate lam ~0.19 per k-unit). The widening slope does NOT keep drifting;
 *        it saturates near -1.0 -- i.e. in the kEnd -> inf limit the log-linear widening rate settles at
 *        ~1.0 ln-unit of eflow/resid separation per k-decade, roughly 70% of the short-window kEnd=11
 *        value.
 *   (R3) THE LIMIT IS CORROBORATED BY THE LOCAL TAIL SLOPE OF y(k). Independently of any convergence
 *        surrogate, a whole-window OLS slope over [6, kEnd] must approach the local slope dy/dk of the
 *        ln-ratio curve at large k as kEnd -> inf. That local slope PLATEAUS near ~-0.98 across
 *        k = 12..18 (-0.9915, -0.9770, -0.9892, -0.9710), consistent with the exponential-fit limit
 *        b_inf ~ -1.01. Past k ~ 21 the local slope goes undefined -- the imp-34023 residExp sign-change
 *        ceiling, where the ratio denominator crosses zero -- which is exactly why the sweep stops at
 *        kEnd=18: the finite limit is well-posed only on the pre-sign-change window.
 *
 * The punchline: the imp-34022 R3 whole-line tilt (slope b -1.434 -> -1.367 over three windows) is NOT
 * open-ended -- extending the imp-33810/imp-33877 ladder to kEnd=18 shows b drifts with monotonically
 * SHRINKING increments (~0.033 -> ~0.010) and CONVERGES exponentially-in-kEnd to a finite limit
 * b_inf ~ -1.01 (exp-approach SSR ~1.9x tighter than power-approach), cross-checked by the local tail
 * slope of y(k) plateauing near -0.98. The widening rate saturates at ~1.0 ln-unit per k-decade, well
 * before the imp-34023 residExp sign-change ceiling kEnd ~ 21.3 would corrupt the tail.
 *
 * MEASUREMENT / CONVERGENCE-FIT ONLY. A diagnostic sweep-and-extrapolation of an inherited surrogate on
 * the inherited ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form selection
 * (the imp-33843 log-linear verdict is untouched). The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate and the two convergence surrogates are
 * descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34022-argmin-argmax-migration-symmetry (the R3 three-window whole-line tilt fit/extrapolated here)
 * @see imp-33877-widening-fit-tail-endpoint-artifact-test (the buildLadder/fitLadder model reused verbatim)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose slope drift is tracked)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..11 ladder extended here)
 * @see imp-34023 (the residExp sign-change ceiling kEnd ~ 21.3 bounding the meaningful window)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST } from './imp-33877-widening-fit-tail-endpoint-artifact-test.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631, exactly as imp-33810/imp-33877)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33773/imp-33877 exactly

// EXACT inherited imp-3406/imp-33810/imp-33877 sub-terms (no re-derivation, no fresh model).
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

// Plain OLS slope of ys against xs, and a full (a, b) fit.
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

// imp-33582/imp-33730: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
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
// imp-33620/imp-33727 magnitude: p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
// s_flow = d ln E_flow / d ln N via a symmetric log-N central difference (small, negative).
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// Build the quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd, exactly as imp-33810/imp-33877.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const lo = Math.pow(10, kk);
    const hi = Math.pow(10, kk + 1);
    const pSigma = olsSigmaExponent(lo, hi);
    const pEcoll = ecollExponentMag(lo, hi);
    const ph = parts(hi);
    const residExp = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi)); // attributed E_flow term
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}
// Fit the imp-33843 log-linear surrogate on a ladder; return (a, b) rounded exactly as imp-33877.
function fitLadder(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { a: +F.a.toFixed(6), b: +F.b.toFixed(6) };
}

// The local slope dy/dk of the ln-ratio curve y(k) at a single k (a whole-window OLS slope over
// [6, kEnd] must approach this as kEnd -> inf). Uses a central difference on the smooth ladder rung.
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
function localSlope(k) {
  const h = 0.01;
  return (yAtK(k + h) - yAtK(k - h)) / (2 * h);
}

// ---- 1. The (a, b)-vs-kEnd sweep: kEnd = 11.0, 11.5, ..., 18.0 (15 windows) ----
const SWEEP = [];
for (let ke = 11; ke <= 18 + 1e-9; ke += 0.5) {
  const kEnd = +ke.toFixed(2);
  const f = fitLadder(buildLadder(kEnd));
  SWEEP.push({ kEnd, a: f.a, b: f.b });
}
// Per-window-step slope increments (positive: b rising toward zero) -- shrinking => convergent.
const SLOPE_STEPS = [];
for (let i = 1; i < SWEEP.length; i++) SLOPE_STEPS.push(+(SWEEP[i].b - SWEEP[i - 1].b).toFixed(6));
const FIRST_STEP = SLOPE_STEPS[0];
const LAST_STEP = SLOPE_STEPS[SLOPE_STEPS.length - 1];
const B_MONOTONE_UP = SWEEP.every((r, i) => i === 0 || r.b > SWEEP[i - 1].b);

// ---- 2. Convergence-form fits of b(kEnd) ----
// Exponential approach b = b_inf + c exp(-lam kEnd): grid-search lam, OLS (b_inf, c) at each.
function fitExpApproach(rows) {
  let best = null;
  for (let lam = 0.01; lam <= 2.0 + 1e-9; lam += 0.001) {
    const xs = rows.map((r) => Math.exp(-lam * r.kEnd));
    const ys = rows.map((r) => r.b);
    const { a: bInf, b: c } = ols(xs, ys);
    let ssr = 0;
    for (let i = 0; i < rows.length; i++) ssr += (rows[i].b - (bInf + c * Math.exp(-lam * rows[i].kEnd))) ** 2;
    if (!best || ssr < best.ssr) best = { lam: +lam.toFixed(3), bInf, c, ssr };
  }
  return { lam: best.lam, bInf: +best.bInf.toFixed(6), c: +best.c.toFixed(6), ssr: +best.ssr.toExponential(4) };
}
// Power approach b = b_inf + c kEnd^(-p): grid-search p, OLS (b_inf, c) at each.
function fitPowApproach(rows) {
  let best = null;
  for (let p = 0.1; p <= 4.0 + 1e-9; p += 0.005) {
    const xs = rows.map((r) => Math.pow(r.kEnd, -p));
    const ys = rows.map((r) => r.b);
    const { a: bInf, b: c } = ols(xs, ys);
    let ssr = 0;
    for (let i = 0; i < rows.length; i++) ssr += (rows[i].b - (bInf + c * Math.pow(rows[i].kEnd, -p))) ** 2;
    if (!best || ssr < best.ssr) best = { p: +p.toFixed(3), bInf, c, ssr };
  }
  return { p: best.p, bInf: +best.bInf.toFixed(6), c: +best.c.toFixed(6), ssr: +best.ssr.toExponential(4) };
}
const EXP_FIT = fitExpApproach(SWEEP);
const POW_FIT = fitPowApproach(SWEEP);
const EXP_WINS = EXP_FIT.ssr < POW_FIT.ssr;
const SSR_RATIO_POW_OVER_EXP = +(POW_FIT.ssr / EXP_FIT.ssr).toFixed(3); // >1 => exp-approach tighter

// ---- 3. Local-slope cross-check: dy/dk of y(k) plateaus near the exp-fit limit ----
const LOCAL_SLOPES = [12, 14, 16, 18].map((k) => ({ k, slope: +localSlope(k).toFixed(6) }));
const LOCAL_SLOPE_MEAN = +(LOCAL_SLOPES.reduce((s, r) => s + r.slope, 0) / LOCAL_SLOPES.length).toFixed(6);
// The imp-34023 residExp sign-change ceiling: y(k) is undefined (NaN) past k ~ 21.3.
const LOCAL_SLOPE_AT_25 = localSlope(25); // NaN -- past the sign-change ceiling

// Reuse gate: the replicated model reproduces the imp-33877 base (kEnd=11) / ext12 (kEnd=12) fits.
const BASE_FIT = SWEEP[0]; // kEnd = 11
const EXT12_FIT = SWEEP.find((r) => r.kEnd === 12);
const REUSE_DIFF_BASE_B = Math.abs(BASE_FIT.b - IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.base.fit.b);
const REUSE_DIFF_EXT12_B = Math.abs(EXT12_FIT.b - IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.ext12.fit.b);
const REUSE_DIFF_BASE_A = Math.abs(BASE_FIT.a - IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.base.fit.a);

export const IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT = {
  id: 'imp-34129',
  proofSection: 'S-frontier',
  question:
    'imp-34022 R3 found lengthening the imp-33810 ladder tilts the WHOLE imp-33843 log-linear OLS ' +
    'line (intercept a 7.959 -> 7.440, slope b -1.434 -> -1.367) across just three windows (kEnd 11, ' +
    '11.5, 12) but never fit the drift. Extend the ladder to kEnd=18 (inside the imp-34023 residExp ' +
    'sign-change ceiling kEnd ~ 21.3), tabulate (a, b) vs kEnd, fit the slope drift to a convergence ' +
    'form, and report whether b approaches a finite limit or keeps drifting. Measurement only; NOT an ' +
    'RH bound; no QED.',
  measuredQuantity:
    'The imp-33843 log-linear OLS y = a + b k re-fit on the imp-33810/imp-33877 ladder for kEnd = ' +
    '11.0, 11.5, ..., 18.0 (15 windows), the slope drift b(kEnd) fit to b = b_inf + c exp(-lam kEnd) ' +
    'and b = b_inf + c kEnd^(-p), and the extrapolated limit cross-checked against the local slope ' +
    'dy/dk of y(k) at large k',
  reuseGate: {
    baseSlopeDiffVsImp33877: +REUSE_DIFF_BASE_B.toExponential(3), // ~0 -- same inherited model
    ext12SlopeDiffVsImp33877: +REUSE_DIFF_EXT12_B.toExponential(3), // ~0
    baseInterceptDiffVsImp33877: +REUSE_DIFF_BASE_A.toExponential(3), // ~0
  },
  sweep: SWEEP, // (kEnd, a, b) for kEnd = 11..18
  slopeStepIncrements: SLOPE_STEPS, // ~0.033 -> ~0.010, shrinking => convergent
  firstStep: FIRST_STEP,
  lastStep: LAST_STEP,
  slopeMonotoneUp: B_MONOTONE_UP,
  convergenceFits: {
    expApproach: EXP_FIT, // b = b_inf + c exp(-lam kEnd); b_inf ~ -1.014, lam ~0.19
    powApproach: POW_FIT, // b = b_inf + c kEnd^(-p); b_inf ~ -0.871, p ~1.64
    winner: EXP_WINS ? 'exp-approach' : 'power-approach',
    ssrRatioPowOverExp: SSR_RATIO_POW_OVER_EXP, // >1 => exp-approach tighter
  },
  slopeLimit: EXP_FIT.bInf, // ~ -1.014 -- the finite widening-slope limit
  localSlopeCrossCheck: {
    perK: LOCAL_SLOPES, // dy/dk ~ -0.98 plateau across k=12..18
    mean: LOCAL_SLOPE_MEAN, // ~ -0.982
    undefinedPastCeiling: Number.isNaN(LOCAL_SLOPE_AT_25), // true -- imp-34023 kEnd ~ 21.3 sign change
  },
  slopeConvergesToFiniteLimit: true,
  finding: {
    R1_drift_decelerates_shrinking_increments:
      'Across kEnd = 11 -> 18 the slope drifts monotonically upward (less negative) -1.4337 -> ' +
      '-1.1274, but the per-window-step increment SHRINKS from ~0.033 (near kEnd=12) to ~0.010 ' +
      '(kEnd 17.5 -> 18), a ~3x deceleration. An unbounded drift keeps a non-vanishing step; the ' +
      'shrinking increment is the signature of an approach to a finite limit, so the imp-34022 ' +
      'three-window whole-line tilt is the head of a CONVERGING sequence, not open-ended drift.',
    R2_exponential_convergence_limit_near_minus_one:
      'The exponential-approach surrogate b = b_inf + c exp(-lam kEnd) fits the 15-window drift with ' +
      'SSR ~5.3e-5, ~1.9x tighter than the power-approach b = b_inf + c kEnd^(-p) at SSR ~1.0e-4, and ' +
      'extrapolates to a finite b_inf ~ -1.014 (rate lam ~0.19 per k-unit). The widening slope ' +
      'SATURATES near -1.0 -- ~1.0 ln-unit of eflow/resid separation per k-decade in the limit, ' +
      'roughly 70% of the short-window kEnd=11 value -1.434.',
    R3_local_tail_slope_corroborates_limit:
      'Independently of any convergence surrogate, a whole-window OLS slope over [6, kEnd] must ' +
      'approach the local slope dy/dk of y(k) at large k. That local slope PLATEAUS near ~-0.98 across ' +
      'k=12..18 (mean ~-0.982), consistent with the exp-fit limit b_inf ~ -1.01. Past k ~ 21 the local ' +
      'slope goes undefined (the imp-34023 residExp sign-change ceiling, where the ratio denominator ' +
      'crosses zero), which is exactly why the sweep stops at kEnd=18 -- the finite limit is well-posed ' +
      'only on the pre-sign-change window.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CONVERGENCE-FIT (frontier-direction, NOT rigorous). Extending the imp-33810/imp-33877 ' +
    'ladder to kEnd=18 (reuse gate: the replicated buildLadder/fitLadder reproduces the imp-33877 base ' +
    'kEnd=11 and ext12 kEnd=12 log-linear fits to machine precision) and re-running the imp-33843 ' +
    'log-linear OLS across 15 windows shows the imp-34022 R3 whole-line tilt is NOT open-ended: the ' +
    'slope b drifts monotonically -1.434 -> -1.127 with per-step increments SHRINKING ~3x (~0.033 -> ' +
    '~0.010), and CONVERGES exponentially-in-kEnd to a finite limit b_inf ~ -1.01 (exp-approach SSR ' +
    '~1.9x tighter than power-approach), cross-checked by the local tail slope of y(k) plateauing near ' +
    '-0.98. The widening rate saturates at ~1.0 ln-unit of eflow/resid separation per k-decade, well ' +
    'before the imp-34023 residExp sign-change ceiling kEnd ~ 21.3 would corrupt the tail. Distinct ' +
    'from any form selection; the imp-33843 log-linear-over-power-law verdict is untouched. The OLS ' +
    'surrogate and the two convergence surrogates are descriptive, not derived; the component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34022 (the R3 three-window whole-line tilt fit/extrapolated here); imp-33877 (the ' +
    'buildLadder/fitLadder model reused verbatim); imp-33843 (the log-linear OLS whose slope drift is ' +
    'tracked); imp-33810 (the k=6..11 ladder extended here); imp-34023 (the residExp sign-change ' +
    'ceiling kEnd ~ 21.3); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT_ASSERTIONS = [
  {
    // Reuse gate: the replicated model reproduces the imp-33877 base/ext12 log-linear fits to machine
    // precision, so the sweep is the same inherited measurement pushed further, not a fresh model.
    id: 'imp34129-reuse-gate-reproduces-imp33877-fits',
    description: '15 windows kEnd=11..18; base (kEnd=11) and ext12 (kEnd=12) slopes match imp-33877 to < 1e-6',
    holds: () =>
      SWEEP.length === 15 &&
      SWEEP[0].kEnd === 11 &&
      SWEEP[14].kEnd === 18 &&
      REUSE_DIFF_BASE_B < 1e-6 &&
      REUSE_DIFF_EXT12_B < 1e-6 &&
      REUSE_DIFF_BASE_A < 1e-6,
  },
  {
    // (R1) The slope drifts monotonically upward with SHRINKING per-step increments (convergent).
    id: 'imp34129-slope-drift-decelerates',
    description: 'b rises monotonically -1.434 -> -1.127; per-step increment shrinks from ~0.033 to ~0.010',
    holds: () =>
      B_MONOTONE_UP &&
      Math.abs(SWEEP[0].b + 1.433678) < 1e-4 &&
      Math.abs(SWEEP[14].b + 1.127437) < 1e-4 &&
      LAST_STEP > 0 &&
      LAST_STEP < FIRST_STEP &&
      LAST_STEP < 0.5 * FIRST_STEP,
  },
  {
    // (R2) The exponential-approach fit is tighter than the power-approach and extrapolates to a finite
    // limit near -1.0.
    id: 'imp34129-exponential-convergence-finite-limit',
    description: 'exp-approach SSR < power-approach SSR (ratio >1.5); b_inf finite in (-1.10, -0.95)',
    holds: () =>
      EXP_WINS &&
      SSR_RATIO_POW_OVER_EXP > 1.5 &&
      Number.isFinite(EXP_FIT.bInf) &&
      EXP_FIT.bInf > -1.1 &&
      EXP_FIT.bInf < -0.95 &&
      EXP_FIT.lam > 0,
  },
  {
    // (R3) The local tail slope of y(k) plateaus near the exp-fit limit and is undefined past the
    // imp-34023 sign-change ceiling.
    id: 'imp34129-local-slope-corroborates-and-ceiling',
    description: 'local dy/dk mean ~ -0.98 (in (-1.05,-0.90)); undefined past k~21 (imp-34023 ceiling)',
    holds: () =>
      LOCAL_SLOPE_MEAN < -0.9 &&
      LOCAL_SLOPE_MEAN > -1.05 &&
      Math.abs(LOCAL_SLOPE_MEAN - EXP_FIT.bInf) < 0.1 &&
      Number.isNaN(LOCAL_SLOPE_AT_25),
  },
  {
    // Honesty gate: convergence-fit only, finite-limit verdict, isRigorous false, no QED, PT SOTA.
    id: 'imp34129-honesty-gate-no-qed',
    description: 'Measurement only: converges to finite limit, isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT.slopeConvergesToFiniteLimit === true &&
      IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT.isRigorous === false &&
      /NO QED/.test(IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT.verdict) &&
      /remains SOTA/.test(IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT.verdict),
  },
];

for (const a of IMP34129_WIDENING_SLOPE_DRIFT_CONVERGENCE_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34129-widening-slope-drift-convergence-fit assertion failed: ${a.id}`);
  }
}
