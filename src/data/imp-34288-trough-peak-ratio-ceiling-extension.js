/**
 * @module imp-34288-trough-peak-ratio-ceiling-extension
 *
 * imp-34288 (numerical, frontier-direction): imp-34214 REFUTED convergence of the imp-34085
 * |trough|/|peak| amplitude ratio -- across the five widening windows kEnd = 11..13 (window width
 * w = kEnd - 6 = 5.0..7.0) it creeps with GROWING per-window increments (+0.0142 -> +0.0332) and both
 * saturating forms (exp/power) pin to the grid floor with non-physical limits r_inf ~ 6.0 / 3.8, far
 * above the amplitude ceiling 1 the ratio "cannot exceed". imp-34214 STOPPED at w = 7 (kEnd = 13) and
 * never MEASURED the approach to that ceiling. This module extends the window-width grid PAST w = 7
 * (kEnd = 13.0 .. 20.0 in quarter-decade steps) with the VERBATIM imp-33843 OLS residual machinery
 * (parts/buildLadder/fitLadder re-implemented identically, reuse gate below reproduces the imp-34085
 * ratio sequence at kEnd = 11..13 exactly) and asks the concrete question imp-34214 left open: does the
 * ratio keep climbing toward the ceiling 1, saturate below it, or OVERSHOOT it -- an overshoot flagging
 * a component-model artifact, since a literal amplitude ratio |trough| / |peak| is bounded by 1.
 *
 * THE MEASUREMENT (imp-33843 machinery reused verbatim; reuse gate reproduces imp-34085 at kEnd <= 13)
 * ---------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll / (E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-34085 (E_trunc = 3.06e-5 fixed strip,
 *                    E_coll = C_C_PINNED sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall,
 *                    T0 = effectiveHeightForN(N)). A reuse gate checks the extended-grid ratio at
 *                    kEnd = 11, 11.5, 12, 12.5, 13 reproduces the imp-34085 published 0.6151..0.7200,
 *                    so this is the SAME measurement pushed further, not a fresh model.
 *   Response  y_k = ln(eflow_over_resid_k);  Fit  y = a + b k  (the imp-33843 log-linear WINNER),
 *   re-run by OLS on EACH ladder k = 6.00 .. kEnd; ratio = |argmin.resid| / |argmax.resid| per window.
 *   Extended grid  kEnd = 13.00, 13.25, ..., 20.00 (window width w = 7.0 .. 14.0) -- PAST the imp-34214
 *                  w = 7 stopping point.
 *   Diagnosis  Track (a) the ratio versus w, (b) whether it ever reaches or crosses the ceiling 1, and
 *              (c) the argmax LOCATION -- because the imp-34085 climb was driven by an endpoint-locked
 *              peak, and a peak that migrates OFF the receding right endpoint changes the regime.
 *
 * THE FINDING (measurement only -- the ratio SATURATES BELOW 1; no overshoot; a regime change caps it)
 * ---------------------------------------------------------------------------------------------------
 *   (R1) THE RATIO KEEPS CLIMBING PAST w = 7 BUT SATURATES BELOW THE CEILING 1. Continuing past kEnd = 13
 *        the ratio rises 0.7200 -> 0.7631 -> 0.8015 -> 0.8451 -> 0.8873 -> 0.9072 (kEnd = 15.25,
 *        w = 9.25), then turns back DOWN. Its maximum over the whole extended grid is ~0.907, comfortably
 *        BELOW 1. So the imp-34214 "creep with no visible limit" does have a ceiling in view: the ratio
 *        approaches but never reaches 1. NO OVERSHOOT occurs -- the |trough| never exceeds the |peak|, so
 *        no component-model artifact of the |trough| > |peak| kind is exhibited on this grid.
 *   (R2) THE PER-STEP INCREMENT STOPS ACCELERATING PAST w = 7 -- IT PLATEAUS THEN REVERSES. The imp-34085
 *        growing increment (+0.0142 -> +0.0332 over w = 5..7) does NOT keep accelerating: past w = 7 the
 *        half-decade increment stabilizes near +0.042 (+0.0431, +0.0384, +0.0435, +0.0422 over
 *        w = 7.0..9.0), then goes NEGATIVE past the peak. The imp-34214 read of an ever-growing increment
 *        was itself a short-window artifact of the w <= 7 span -- the increment plateaus, it does not
 *        diverge.
 *   (R3) THE CAP IS A REGIME CHANGE, NOT A PHYSICAL BOUND: THE ARGMAX MIGRATES OFF THE RECEDING RIGHT
 *        ENDPOINT. Through kEnd = 15.25 the argmax peak stays endpoint-locked (argmax.k = kEnd, the
 *        receding right end). At kEnd = 15.50 (w = 9.5) it JUMPS to the near-LEFT rung k = 6.5
 *        (isEndpoint false) and stays there; the left-endpoint peak then grows quickly (0.5263 -> 0.6100
 *        -> ... -> 0.8653) while the interior trough saturates (-0.4708 -> -0.5351), so the ratio RECEDES
 *        0.8946 -> 0.8561 -> ... -> 0.6184 (kEnd = 20). The ceiling of 1 is respected because the widening
 *        window develops a larger positive residual at its LEFT edge than at the receding right endpoint,
 *        capping the ratio -- a structural feature of the OLS residual pattern in wide windows, NOT a
 *        physical |trough| <= |peak| amplitude constraint.
 *
 * The punchline: extending the window-width grid past the imp-34214 w = 7 stopping point MEASURES the
 * approach the ceiling: the imp-34085 |trough| / |peak| ratio keeps climbing to a maximum ~0.907 at
 * w = 9.25, SATURATES BELOW the amplitude ceiling of 1 (no overshoot, no |trough| > |peak| artifact), and
 * then turns back down. The turnaround is NOT the ratio decelerating on its own but a REGIME CHANGE -- the
 * argmax peak migrates off the receding right endpoint to the near-left rung k = 6.5 once the window
 * exceeds w ~ 9.25 -- so the imp-34214 non-convergence reading is refined: the ratio neither converges to
 * a fixed interior limit nor crosses 1; it rises to ~0.907 under the endpoint-locked regime and recedes
 * once the peak relocates. The imp-34214 "non-physical r_inf >> 1" limits were exactly the saturating fit
 * extrapolating the pre-cap climb; the actual data caps well below 1.
 *
 * MEASUREMENT / GRID-EXTENSION ONLY. A diagnostic re-fit of an inherited surrogate on a wider inherited
 * grid, NOT an RH bound and distinct from any log-linear-vs-power-law form selection (the imp-33843
 * log-linear verdict is untouched; R^2 stays > 0.98). The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive, not
 * derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34214-trough-peak-ratio-limit-fit (the convergence REFUTED at w = 7, extended here)
 * @see imp-34085-trough-peak-ratio-convergence (the |trough|/|peak| ratio sequence and machinery reused)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run on the extended grid)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..kEnd ladder extended here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 * @see imp-486 (C_mb GUE-conditional, untouched)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE } from './imp-34085-trough-peak-ratio-convergence.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631, exactly as imp-33810/imp-34085)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810/imp-34085 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
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
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}
// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
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
// imp-33620/imp-33727 magnitude exponent: p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
// s_flow = d ln E_flow / d ln N via a symmetric log-N central difference.
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// Build the quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), same as imp-33810.
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
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}

// Fit the imp-33843 log-linear surrogate on a ladder; return argmax/argmin and R^2.
function fitLadder(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  const RES = KS.map((k, i) => Y[i] - (F.a + F.b * k));
  let minI = 0;
  let maxI = 0;
  for (let i = 0; i < RES.length; i++) {
    if (RES[i] < RES[minI]) minI = i;
    if (RES[i] > RES[maxI]) maxI = i;
  }
  const my = Y.reduce((a, b) => a + b, 0) / Y.length;
  const ssTot = Y.reduce((s, y) => s + (y - my) ** 2, 0);
  const ssRes = RES.reduce((s, e) => s + e * e, 0);
  return {
    r2: +(1 - ssRes / ssTot).toFixed(6),
    argmax: { k: KS[maxI], resid: +RES[maxI].toExponential(4), isEndpoint: maxI === RES.length - 1 },
    argmin: { k: KS[minI], resid: +RES[minI].toExponential(4) },
  };
}

// ---- Extended window-width grid PAST the imp-34214 w = 7 stopping point ----
// kEnd = 13.00 .. 20.00 in quarter-decade steps (window width w = 7.0 .. 14.0).
const AMPLITUDE_RATIO_CEILING = 1.0; // a literal |trough|/|peak| amplitude ratio cannot exceed 1
const GRID = [];
for (let kEnd = 13; kEnd <= 20 + 1e-9; kEnd += 0.25) {
  const ke = +kEnd.toFixed(2);
  const f = fitLadder(buildLadder(ke));
  GRID.push({
    kEnd: ke,
    w: +(ke - 6).toFixed(2),
    peakK: f.argmax.k,
    peakIsEndpoint: f.argmax.isEndpoint,
    peak: f.argmax.resid,
    troughK: f.argmin.k,
    trough: f.argmin.resid,
    ratio: +(Math.abs(f.argmin.resid) / Math.abs(f.argmax.resid)).toFixed(4),
    r2: f.r2,
  });
}

// ---- Reuse gate: the extended machinery reproduces the imp-34085 ratio sequence at kEnd = 11..13 ----
// The extended grid starts at kEnd = 13, so re-fit the four earlier windows here and compare to imp-34085.
const IMP34085_RATIOS = IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.ratioSequence; // kEnd = 11..13
let REUSE_MAX_DIFF = 0;
for (const src of IMP34085_RATIOS) {
  const f = fitLadder(buildLadder(src.kEnd));
  const r = +(Math.abs(f.argmin.resid) / Math.abs(f.argmax.resid)).toFixed(4);
  REUSE_MAX_DIFF = Math.max(REUSE_MAX_DIFF, Math.abs(r - src.ratio));
}

// ---- Diagnosis ----
// (R1) The ratio maximum over the extended grid and whether it ever reaches / crosses the ceiling 1.
const MAX_RATIO = Math.max(...GRID.map((g) => g.ratio));
const MAX_ROW = GRID.find((g) => g.ratio === MAX_RATIO);
const RATIO_CROSSES_CEILING = GRID.some((g) => g.ratio >= AMPLITUDE_RATIO_CEILING); // false -- no overshoot
const RATIO_SATURATES_BELOW_CEILING = MAX_RATIO < AMPLITUDE_RATIO_CEILING; // true

// (R2) The half-decade increment past w = 7 plateaus (does not keep accelerating) then reverses.
const halfRows = [13, 13.5, 14, 14.5, 15].map((ke) => GRID.find((g) => g.kEnd === ke));
const HALF_DECADE_INCREMENTS = [];
for (let i = 1; i < halfRows.length; i++) {
  HALF_DECADE_INCREMENTS.push(+(halfRows[i].ratio - halfRows[i - 1].ratio).toFixed(4));
}
const INCREMENT_PLATEAUS_NOT_ACCELERATES =
  HALF_DECADE_INCREMENTS.every((d) => d > 0.03 && d < 0.05); // ~0.042, not the accelerating imp-34085 trend

// (R3) The cap is a regime change: the argmax migrates off the receding right endpoint at the max.
// First grid row where the argmax is NOT on the receding right endpoint.
const CROSSOVER_ROW = GRID.find((g) => g.peakIsEndpoint === false);
const ARGMAX_ENDPOINT_THROUGH_MAX = GRID.filter((g) => g.kEnd <= MAX_ROW.kEnd + 1e-9).every(
  (g) => g.peakIsEndpoint === true,
);
const LAST_ROW = GRID[GRID.length - 1];
const RATIO_RECEDES_AFTER_REGIME_CHANGE = LAST_ROW.ratio < MAX_RATIO; // 0.6184 < 0.9072

const ratioConverges = false; // no fixed interior limit (imp-34214) AND no crossing of 1 (this module)
const overshootsCeiling = RATIO_CROSSES_CEILING; // false
const isComponentModelArtifact = false; // no |trough| > |peak| overshoot exhibited on this grid

export const IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION = {
  id: 'imp-34288',
  proofSection: 'S-frontier',
  question:
    'imp-34214 REFUTED convergence of the imp-34085 |trough|/|peak| amplitude ratio (it creeps with ' +
    'growing increments, and both saturating forms pin to the grid floor with non-physical limits ' +
    'r_inf ~ 6.0/3.8 above the ceiling 1) but STOPPED at window width w = 7 (kEnd = 13). Extend the grid ' +
    'past w = 7 with the verbatim imp-33843 OLS residual machinery and MEASURE whether the ratio keeps ' +
    'climbing toward the ceiling 1, saturates below it, or OVERSHOOTS (an overshoot flagging a ' +
    'component-model artifact, since a literal |trough|/|peak| is bounded by 1). Measurement only; NOT an ' +
    'RH bound; no QED.',
  measuredQuantity:
    'The imp-33843 log-linear OLS |trough|/|peak| amplitude ratio re-fit on the imp-33810 ladder over ' +
    'the EXTENDED window-width grid kEnd = 13.0..20.0 (w = 7.0..14.0, quarter-decade steps), its maximum ' +
    'over the grid, whether it ever reaches/crosses the amplitude ceiling of 1, and the argmax-peak ' +
    'location that governs the approach',
  amplitudeRatioCeiling: AMPLITUDE_RATIO_CEILING, // 1 -- a literal amplitude ratio cannot exceed it
  reuseGateMaxDiffVsImp34085: +REUSE_MAX_DIFF.toExponential(3), // ~0 -- reproduces imp-34085 at kEnd 11..13
  extendedGrid: GRID, // kEnd 13..20, w 7..14
  maxRatio: MAX_RATIO, // ~0.9072
  maxRatioKEnd: MAX_ROW.kEnd, // 15.25 (w = 9.25)
  maxRatioW: MAX_ROW.w, // 9.25
  ratioCrossesCeiling: RATIO_CROSSES_CEILING, // false -- NO overshoot
  ratioSaturatesBelowCeiling: RATIO_SATURATES_BELOW_CEILING, // true
  halfDecadeIncrementsPastW7: HALF_DECADE_INCREMENTS, // +0.0431, +0.0384, +0.0435, +0.0422 -- plateau ~0.042
  incrementPlateausNotAccelerates: INCREMENT_PLATEAUS_NOT_ACCELERATES, // true
  crossoverKEnd: CROSSOVER_ROW ? CROSSOVER_ROW.kEnd : null, // 15.5 -- argmax leaves the right endpoint
  crossoverW: CROSSOVER_ROW ? CROSSOVER_ROW.w : null, // 9.5
  crossoverPeakK: CROSSOVER_ROW ? CROSSOVER_ROW.peakK : null, // 6.5 -- migrates to the near-left rung
  argmaxEndpointLockedThroughMax: ARGMAX_ENDPOINT_THROUGH_MAX, // true
  ratioRecedesAfterRegimeChange: RATIO_RECEDES_AFTER_REGIME_CHANGE, // true -- 0.907 -> 0.618 by kEnd 20
  lastRowRatio: LAST_ROW.ratio, // ~0.6184 at kEnd 20
  ratioConverges, // false
  overshootsCeiling, // false
  isComponentModelArtifact, // false -- no |trough| > |peak| overshoot exhibited on this grid
  finding: {
    R1_ratio_climbs_past_w7_but_saturates_below_ceiling_one:
      'Continuing past kEnd = 13 (w = 7) the ratio rises 0.7200 -> 0.7631 -> 0.8015 -> 0.8451 -> 0.8873 ' +
      '-> 0.9072 (kEnd = 15.25, w = 9.25) then turns back down; its maximum over the whole extended grid ' +
      'is ~0.907, comfortably BELOW the amplitude ceiling of 1. The imp-34214 "creep with no visible ' +
      'limit" does have a ceiling in view -- the ratio approaches but never reaches 1. NO OVERSHOOT ' +
      'occurs, so no component-model artifact of the |trough| > |peak| kind is exhibited on this grid.',
    R2_increment_plateaus_past_w7_then_reverses:
      'The imp-34085 growing increment (+0.0142 -> +0.0332 over w = 5..7) does NOT keep accelerating: ' +
      'past w = 7 the half-decade increment stabilizes near +0.042 (+0.0431, +0.0384, +0.0435, +0.0422 ' +
      'over w = 7.0..9.0), then goes negative past the peak. The imp-34214 read of an ever-growing ' +
      'increment was a short-window artifact of the w <= 7 span -- the increment plateaus, not diverges.',
    R3_cap_is_argmax_regime_change_not_physical_bound:
      'Through kEnd = 15.25 the argmax peak stays endpoint-locked (argmax.k = kEnd, the receding right ' +
      'end). At kEnd = 15.50 (w = 9.5) it JUMPS to the near-left rung k = 6.5 (isEndpoint false) and ' +
      'stays there; the left-endpoint peak then grows quickly (0.5263 -> 0.8653) while the interior ' +
      'trough saturates (-0.4708 -> -0.5351), so the ratio RECEDES 0.8946 -> 0.6184 (kEnd = 20). The ' +
      'ceiling of 1 is respected because the widening window develops a larger positive residual at its ' +
      'LEFT edge than at the receding right endpoint -- a structural feature of the OLS residual pattern ' +
      'in wide windows, NOT a physical |trough| <= |peak| amplitude constraint.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / GRID-EXTENSION (frontier-direction, NOT rigorous). Extending the window-width grid ' +
    'past the imp-34214 w = 7 stopping point (kEnd = 13.0..20.0, w = 7.0..14.0, quarter-decade steps) ' +
    'with the verbatim imp-33843 OLS residual machinery (reuse gate: the extended machinery reproduces ' +
    'the imp-34085 ratio at kEnd = 11..13 exactly) MEASURES the approach to the ceiling the imp-34214 ' +
    'fit only extrapolated. The imp-34085 |trough|/|peak| ratio keeps climbing past w = 7 to a maximum ' +
    '~0.907 at w = 9.25, SATURATES BELOW the amplitude ceiling of 1 (no overshoot, no |trough| > |peak| ' +
    'component-model artifact), and then turns back DOWN. The turnaround is NOT the ratio decelerating ' +
    'on its own but a REGIME CHANGE: the argmax peak migrates off the receding right endpoint to the ' +
    'near-left rung k = 6.5 once the window exceeds w ~ 9.25, after which the left-endpoint peak grows ' +
    'and the ratio recedes to ~0.618 by kEnd = 20. So the imp-34214 non-convergence reading is refined: ' +
    'the ratio neither converges to a fixed interior limit nor crosses 1; it rises to ~0.907 under the ' +
    'endpoint-locked regime and recedes once the peak relocates, and the imp-34214 "non-physical ' +
    'r_inf >> 1" limits were the saturating fit extrapolating the pre-cap climb while the actual data ' +
    'caps well below 1. Distinct from any form selection; the imp-33843 log-linear verdict is untouched ' +
    '(R^2 stays > 0.98). The OLS surrogate is descriptive, not derived; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34214 (the convergence refuted at w = 7, extended here); imp-34085 (the |trough|/|peak| ratio ' +
    'sequence and machinery reused); imp-33843 (the log-linear OLS re-run on the extended grid); ' +
    'imp-33810 (the k=6..kEnd ladder extended here); lambda-rh-height-mapping (effectiveHeightForN); ' +
    'polymath15-constant-C-C (C_C_PINNED); imp-486 (C_mb GUE-conditional, untouched).',
};

export const IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION_ASSERTIONS = [
  {
    // Reuse gate: the extended machinery reproduces the imp-34085 ratio at kEnd = 11..13 (< 1e-3), so
    // this is the SAME measurement pushed further, and the grid spans w = 7..14 in quarter-decade steps.
    id: 'imp34288-reuse-gate-reproduces-imp34085-ratio-sequence',
    description: 'extended machinery reproduces imp-34085 kEnd 11..13 ratios (< 1e-3); grid w = 7..14',
    holds: () =>
      REUSE_MAX_DIFF < 1e-3 &&
      GRID[0].kEnd === 13 &&
      GRID[0].w === 7 &&
      GRID[GRID.length - 1].kEnd === 20 &&
      GRID[GRID.length - 1].w === 14 &&
      Math.abs(GRID[0].ratio - 0.72) < 1e-9,
  },
  {
    // (R1) The ratio climbs past w = 7 to a maximum ~0.907 at kEnd = 15.25 (w = 9.25) and SATURATES
    // BELOW the amplitude ceiling of 1 -- it never reaches or crosses it (no overshoot).
    id: 'imp34288-ratio-saturates-below-ceiling-one-no-overshoot',
    description: 'max ratio ~0.907 at kEnd 15.25 (w 9.25); < 1; never crosses ceiling (no overshoot)',
    holds: () =>
      MAX_RATIO > 0.9 &&
      MAX_RATIO < 1.0 &&
      MAX_ROW.kEnd === 15.25 &&
      Math.abs(MAX_ROW.w - 9.25) < 1e-9 &&
      RATIO_CROSSES_CEILING === false &&
      RATIO_SATURATES_BELOW_CEILING === true,
  },
  {
    // (R2) Past w = 7 the half-decade increment plateaus near +0.042 (it does not keep accelerating as
    // imp-34214 read over the w <= 7 span), so the growing-increment reading was a short-window artifact.
    id: 'imp34288-increment-plateaus-past-w7',
    description: 'half-decade increments +0.043,+0.038,+0.044,+0.042 (~0.042 plateau), not accelerating',
    holds: () =>
      HALF_DECADE_INCREMENTS.length === 4 &&
      INCREMENT_PLATEAUS_NOT_ACCELERATES === true &&
      Math.abs(HALF_DECADE_INCREMENTS[0] - 0.0431) < 0.002 &&
      Math.abs(HALF_DECADE_INCREMENTS[3] - 0.0422) < 0.002,
  },
  {
    // (R3) The cap is an argmax regime change: the peak is endpoint-locked through the maximum, then
    // migrates off the receding right endpoint to the near-left rung k = 6.5 at kEnd = 15.5, after
    // which the ratio recedes to ~0.618 by kEnd = 20.
    id: 'imp34288-cap-is-argmax-regime-change',
    description: 'argmax endpoint-locked through max; migrates to k=6.5 at kEnd 15.5; ratio recedes to ~0.618',
    holds: () =>
      ARGMAX_ENDPOINT_THROUGH_MAX === true &&
      CROSSOVER_ROW.kEnd === 15.5 &&
      CROSSOVER_ROW.peakK === 6.5 &&
      RATIO_RECEDES_AFTER_REGIME_CHANGE === true &&
      Math.abs(LAST_ROW.ratio - 0.6184) < 0.01,
  },
  {
    // Honesty gate: measurement only, no overshoot / no artifact exhibited, isRigorous false, form
    // verdict untouched (R^2 > 0.98), no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34288-honesty-gate-no-qed',
    description: 'Measurement only: overshoot false, isRigorous false, R^2 > 0.98, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION.overshootsCeiling === false &&
      IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION.isComponentModelArtifact === false &&
      IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION.isRigorous === false &&
      GRID.every((g) => g.r2 > 0.98) &&
      /NO QED/.test(IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION.verdict),
  },
];

for (const a of IMP34288_TROUGH_PEAK_RATIO_CEILING_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34288-trough-peak-ratio-ceiling-extension assertion failed: ${a.id}`);
  }
}
