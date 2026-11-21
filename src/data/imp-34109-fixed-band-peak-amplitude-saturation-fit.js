/**
 * @module imp-34109-fixed-band-peak-amplitude-saturation-fit
 *
 * imp-34109 (numerical, frontier-direction): imp-34040 pushed the imp-33987 fixed-band (k <= 10)
 * convex residual-drift sweep one decade to kEnd = 14.0 .. 17.0 and read a SATURATION ONSET -- the
 * fixed-band peak still rose +0.38386 -> +0.64855 but its increments SHRANK monotonically, ALL 5 second
 * differences flipped strictly NEGATIVE (concave), the power-law exponent collapsed (~4.41 -> ~2.686),
 * the linear fit overtook the power law, and the band argmax rung LOCKED at k = 6.50. imp-34040 fit
 * power / exponential / linear forms but never fit a BOUNDED saturating form to extract an actual
 * asymptotic ceiling, and could not tell whether the concave deceleration it measured is a true plateau
 * (peak converges to a finite cap) or a transient. This module pushes the SAME inherited
 * imp-33810/imp-33940/imp-33987/imp-34040 machinery ONE further decade, kEnd in {14.0, 14.5, ..., 20.0}
 * (13 windows -- reproducing imp-34040 s 7 windows over 14..17 and extending 6 more to 20), MEASURES the
 * fixed-band peak amplitude at every window, and fits a bounded saturating form peak = a - b/kEnd (exact
 * ceiling a) against a linear and an UNBOUNDED log form to decide: does the amplitude SATURATE to a
 * ceiling or KEEP CLIMBING?
 *
 * THE MEASUREMENT (imp-34040 machinery reused verbatim; only the kEnd grid extends and the bounded fit is new)
 * -----------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-33940/imp-33987/imp-34040. No re-derivation.
 *   Boundary sweep   kEnd = 14.0, 14.5, ..., 20.0 (13 windows) -- the immediate one-decade continuation of
 *                    imp-34040 s kEnd = 14..17 grid (same 0.5 step). kEnd = 14 and 17 are shared anchors,
 *                    so the first 7 windows reproduce imp-34040 s fixed-band peaks verbatim (+0.383861 at
 *                    kEnd = 14, +0.648552 at kEnd = 17).
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 R2 / imp-33987 / imp-34040 tracked.
 *   Ceiling fit      the 13 fixed-band peaks are fit as peak = a - b/kEnd (bounded/saturating, OLS on the
 *                    regressor 1/kEnd -> extrapolated ceiling a as kEnd -> inf), against peak = a + b kEnd
 *                    (linear, unbounded) and peak = a + b ln(kEnd) (log, unbounded). Whichever form has the
 *                    highest R^2 answers saturate-vs-climb; the bounded form s intercept a IS the ceiling.
 *
 * THE FINDING (measurement only -- the imp-34040 saturation onset DOES NOT persist: the deceleration is a
 * TRANSIENT, the increments bottom out near kEnd ~ 18 then RE-ACCELERATE, and the best global form is UNBOUNDED)
 * -------------------------------------------------------------------------------------------------------------
 *   (F1) THE DECELERATION REVERSES -- INCREMENTS BOTTOM OUT NEAR kEnd ~ 18 THEN RE-INCREASE. The fixed-band
 *        peak climbs monotonically +0.38386 (kEnd=14) -> +0.86530 (kEnd=20), a ~125% total rise. But its
 *        12 increments do NOT keep shrinking: they fall to a MINIMUM 0.03370 at the kEnd = 18 -> 18.5 step
 *        and then RE-INCREASE 0.03370 -> 0.03430 -> 0.03676 -> 0.04066. imp-34040 s "increments strictly
 *        decreasing" reading is a within-window (14..17) feature that ends near kEnd ~ 18.
 *   (F2) THE SECOND DIFFERENCES FLIP BACK POSITIVE -- THE CONCAVITY REVERSES TO CONVEX. imp-34040 found all
 *        5 second differences strictly NEGATIVE over 14..17; extended to 14..20 the 11 second differences
 *        are negative only through the kEnd ~ 17.5 pair and then flip strictly POSITIVE at the tail
 *        (+0.000598, +0.002459, +0.003901). The concave / saturating curvature imp-34040 measured is not a
 *        monotone approach to a plateau -- it re-accelerates, the opposite of saturation.
 *   (F3) THE BAND ARGMAX RUNG UN-LOCKS -- IT RESUMES CREEPING 6.50 -> 6.25. imp-34040 reported the rung
 *        LOCKED at k = 6.50 across 14..17; extended to 20 it holds 6.50 only through kEnd = 18.5 and then
 *        creeps to k = 6.25 at kEnd = 19, 19.5, 20. The "locked" reading is a within-window artifact; the
 *        inward OLS pivot resumes -- consistent with the re-acceleration in F1/F2 and (independently of the
 *        imp-34047 argmax-creep law) another sign the drift has not settled.
 *   (F4) THE BEST GLOBAL FORM IS UNBOUNDED -- THE LOG FIT WINS, THE BOUNDED CEILING IS NOT SELECTED. Fitting
 *        the bounded saturating form peak = a - b/kEnd gives a nominal ceiling a ~ 1.95178 (b ~ 22.06795,
 *        R^2 ~ 0.99804), but the UNBOUNDED log form peak = a + b ln(kEnd) fits BETTER (R^2 ~ 0.99948 >
 *        0.99804 > linear 0.99617). The nominal ceiling would be approached only at kEnd ~ 1131 (within 1%,
 *        ~57x the kEnd = 20 window edge); combined with the re-accelerating increments (F1/F2) the data do
 *        NOT support convergence to a finite cap within kEnd <= 20. The amplitude KEEPS CLIMBING.
 *
 * The punchline: pushing the imp-34040 fixed-band (k <= 10) peak-amplitude sweep one further decade to
 * kEnd = 14..20 (13 windows) shows the imp-34040 SATURATION ONSET does NOT persist. The peak still climbs
 * (+0.38386 -> +0.86530, ~125%) but the deceleration is a TRANSIENT: the increments bottom out near
 * kEnd ~ 18 (min 0.03370) then re-increase, the second differences flip back strictly POSITIVE at the tail
 * (+0.000598 -> +0.003901), and the argmax rung un-locks 6.50 -> 6.25. A bounded saturating fit
 * peak = a - b/kEnd yields a nominal ceiling a ~ 1.95178 but is BEATEN by the unbounded log form
 * (R^2 0.99948 > 0.99804 > 0.99617): no finite ceiling is supported within kEnd <= 20, so the fixed-band
 * peak amplitude KEEPS CLIMBING. imp-34040 s concave reading over kEnd = 14..17 is CORRECT within its
 * measured window and is not overturned -- only its saturation extrapolation beyond kEnd ~ 18 is corrected.
 *
 * MEASUREMENT / RESIDUAL-GROWTH FIT ONLY. A descriptive re-selection of residuals from an inherited
 * surrogate as the fit boundary recedes, NOT an RH bound and distinct from any form selection (the
 * imp-33843 log-linear-over-power-law verdict and the imp-33940 R2 / imp-33987 / imp-34040 findings it
 * extends are untouched). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the OLS surrogate, the bounded-ceiling fit, and the growth-form classification are
 * descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (refines this module's F1 increment
 *   minimum to sub-window resolution on a halved 0.25 kEnd grid)
 * @see imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation (named
 *   SUB-GAP-imp-34287-asymptotic-class-undecidable in the glossary -- reconciles this module's UNBOUNDED-log
 *   verdict with the imp-34196 rising-increment reading via the local log-derivative g = dP/d ln(kEnd); the
 *   sub/log/super-log growth class question this leaves open is still OPEN)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (continues this module's sweep one further
 *   decade, kEnd = 20..26, and finds the surrogate this module's OLS depends on has a hard right edge)
 * @see imp-34040-fixed-band-drift-saturation-decade (the kEnd = 14..17 sweep this continues; machinery reused)
 * @see imp-34047-argmax-rung-creep-descent-law (the argmax-creep law; F3 is an independent argmax observation)
 * @see imp-34108-endpoint-peak-saturating-ceiling-extrapolation (the peak = a - b/kEnd ceiling form reused)
 * @see imp-33940-interior-residual-boundary-stability (the R2 convex low-k drift origin)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run per boundary)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34040
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34040.
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
function r2Of(xs, ys, a, b) {
  const my = ys.reduce((s, y) => s + y, 0) / ys.length;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < xs.length; i++) {
    ssRes += (ys[i] - (a + b * xs[i])) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return 1 - ssRes / ssTot;
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-34040.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const lo = Math.pow(10, kk);
    const hi = Math.pow(10, kk + 1);
    const pSigma = olsSigmaExponent(lo, hi);
    const pEcoll = ecollExponentMag(lo, hi);
    const ph = parts(hi);
    const residExp = pEcoll * (1 - ph.sigma) - pSigma;
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}

// imp-33843 log-linear OLS residual vector on a ladder.
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
// Largest signed residual among rungs with k <= kMax (the boundary-independent fixed band), verbatim.
function fixedBandPeak(R, kMax) {
  const { KS, RES } = residualVector(R);
  let maxI = -1;
  for (let i = 0; i < RES.length; i++) {
    if (KS[i] <= kMax + 1e-9 && (maxI < 0 || RES[i] > RES[maxI])) maxI = i;
  }
  return { peak: RES[maxI], atK: KS[maxI] };
}

// ONE-DECADE CONTINUATION of imp-34040: kEnd = 14.0, 14.5, ..., 20.0 (13 windows; first 7 reproduce imp-34040).
const K_ENDS = [];
for (let k = 14; k <= 20 + 1e-9; k += 0.5) K_ENDS.push(+k.toFixed(2));

const FIXED_BAND_KMAX = 10.0; // identical boundary-independent band to imp-33940 R2 / imp-33987 / imp-34040

const FIXED_BAND_ROWS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  return { kEnd, peak: +fp.peak.toFixed(6), atK: fp.atK };
});
const FB_PEAKS = FIXED_BAND_ROWS.map((r) => r.peak);

// Increments and second differences -- re-test the curvature sign past imp-34040 s window.
const FB_INCREMENTS = [];
for (let i = 1; i < FB_PEAKS.length; i++) FB_INCREMENTS.push(+(FB_PEAKS[i] - FB_PEAKS[i - 1]).toFixed(6));
const FB_SECOND_DIFFS = [];
for (let i = 1; i < FB_INCREMENTS.length; i++)
  FB_SECOND_DIFFS.push(+(FB_INCREMENTS[i] - FB_INCREMENTS[i - 1]).toFixed(6));

// The increment minimum (deceleration bottom) and its kEnd -- where the trajectory re-accelerates.
let MIN_INC_I = 0;
for (let i = 1; i < FB_INCREMENTS.length; i++) if (FB_INCREMENTS[i] < FB_INCREMENTS[MIN_INC_I]) MIN_INC_I = i;
const MIN_INCREMENT = FB_INCREMENTS[MIN_INC_I];
const MIN_INCREMENT_KEND = K_ENDS[MIN_INC_I + 1]; // increment i is peaks[i+1]-peaks[i]; its right endpoint

// THE CEILING FIT: bounded saturating peak = a - b/kEnd (OLS on regressor 1/kEnd; ceiling = intercept a).
const INV_KENDS = K_ENDS.map((k) => 1 / k);
const SAT_FIT = ols(INV_KENDS, FB_PEAKS); // peak = a + slope*(1/kEnd); ceiling a = SAT_FIT.a, b = -slope > 0
const SAT_CEILING = SAT_FIT.a;
const SAT_B = -SAT_FIT.b; // b > 0 for a rising bounded curve
const SAT_R2 = r2Of(INV_KENDS, FB_PEAKS, SAT_FIT.a, SAT_FIT.b);

// Unbounded contrasts: linear peak = a + b kEnd, log peak = a + b ln(kEnd).
const LIN_FIT = ols(K_ENDS, FB_PEAKS);
const LIN_R2 = r2Of(K_ENDS, FB_PEAKS, LIN_FIT.a, LIN_FIT.b);
const LOG_KENDS = K_ENDS.map((k) => Math.log(k));
const LOG_FIT = ols(LOG_KENDS, FB_PEAKS);
const LOG_R2 = r2Of(LOG_KENDS, FB_PEAKS, LOG_FIT.a, LOG_FIT.b);

// Nominal ceiling approach for the bounded fit: shortfall = b/(a kEnd); within-1% at kEnd = b/(a*0.01).
const CEILING_WITHIN_1PCT_KEND = SAT_B / (SAT_CEILING * 1e-2);
const WINDOW_END = K_ENDS[K_ENDS.length - 1]; // 20
const CEILING_REACH_1PCT = CEILING_WITHIN_1PCT_KEND / WINDOW_END; // ~57x

const FB_MONOTONIC = FB_PEAKS.every((p, i) => i === 0 || p > FB_PEAKS[i - 1]);
const FB_INCREMENTS_DECREASING = FB_INCREMENTS.every((x, i) => i === 0 || x < FB_INCREMENTS[i - 1]);
const FB_SECOND_DIFFS_ALL_NEGATIVE = FB_SECOND_DIFFS.every((d) => d < 0); // was true over 14..17; now false
const FB_SECOND_DIFFS_TAIL_POSITIVE = FB_SECOND_DIFFS[FB_SECOND_DIFFS.length - 1] > 0; // concavity reversed
const FB_TOTAL_RISE_FRACTION = +((FB_PEAKS[FB_PEAKS.length - 1] - FB_PEAKS[0]) / FB_PEAKS[0]).toFixed(4);
const ARGMAX_KS = FIXED_BAND_ROWS.map((r) => r.atK);
const ARGMAX_LOCKED = ARGMAX_KS.every((k) => k === ARGMAX_KS[0]);
const ARGMAX_LAST = ARGMAX_KS[ARGMAX_KS.length - 1];
const UNBOUNDED_LOG_WINS = LOG_R2 > SAT_R2 && SAT_R2 > LIN_R2;
const KEEPS_CLIMBING = UNBOUNDED_LOG_WINS && !FB_SECOND_DIFFS_ALL_NEGATIVE && FB_SECOND_DIFFS_TAIL_POSITIVE;

// imp-34040 shared anchors, for the reuse gate (baked literals from imp-34040.fixedBandRows).
const IMP34040_PEAK_AT_KEND_14 = 0.383861;
const IMP34040_PEAK_AT_KEND_17 = 0.648552;

export const IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT = {
  id: 'imp-34109',
  proofSection: 'S-frontier',
  question:
    'imp-34040 pushed the fixed-band (k <= 10) imp-33843 residual drift to kEnd = 14..17 and read a ' +
    'SATURATION ONSET (increments shrinking, all 5 second differences negative, argmax rung locked at ' +
    '6.50) but never fit a BOUNDED form to extract a ceiling. Pushing the SAME selector one further decade ' +
    'to kEnd = 14.0 .. 20.0 (13 windows) and fitting peak = a - b/kEnd against linear and log forms, does ' +
    'the fixed-band peak amplitude SATURATE to a ceiling or KEEP CLIMBING? Measurement only; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'Per boundary kEnd = 14.0, 14.5, ..., 20.0 (13 windows): the largest signed residual in the fixed ' +
    'band k <= 10.00 of the imp-33843 log-linear OLS on the imp-33810 ladder k = 6.00 .. kEnd, its ' +
    'increments and second differences (curvature-sign / re-acceleration test), the band argmax rung per ' +
    'window, and a bounded saturating fit peak = a - b/kEnd (extrapolated ceiling a) contrasted against ' +
    'unbounded linear and log fits to decide saturate-vs-climb',
  fixedBandRows: FIXED_BAND_ROWS, // {kEnd, peak, atK} x 13
  fixedBandKMax: FIXED_BAND_KMAX,
  kEnds: K_ENDS,
  fixedBandIncrements: FB_INCREMENTS, // fall to a minimum near kEnd ~ 18 then RE-INCREASE
  fixedBandSecondDifferences: FB_SECOND_DIFFS, // negative early, flip POSITIVE at the tail -- concavity reverses
  incrementMinimum: MIN_INCREMENT, // ~0.03370 -- the deceleration bottom
  incrementMinimumKEnd: MIN_INCREMENT_KEND, // ~18.5 -- where the trajectory re-accelerates
  saturatingFit: {
    form: 'peak = a - b/kEnd (bounded; OLS on regressor 1/kEnd; ceiling = intercept a)',
    ceiling: +SAT_CEILING.toFixed(6), // a ~ 1.95178 -- NOMINAL cap, not the selected form
    b: +SAT_B.toFixed(6), // ~22.06795
    r2: +SAT_R2.toFixed(8), // ~0.99804
    within1PercentKEnd: +CEILING_WITHIN_1PCT_KEND.toFixed(2), // ~1131 -- ~57x the kEnd = 20 window edge
    reach1PercentWindows: +CEILING_REACH_1PCT.toFixed(1), // ~56.5x
  },
  linearFit: {
    form: 'peak = a + b * kEnd (unbounded)',
    b: +LIN_FIT.b.toFixed(6),
    r2: +LIN_R2.toFixed(8), // ~0.99617
  },
  logFit: {
    form: 'peak = a + b * ln(kEnd) (unbounded)',
    b: +LOG_FIT.b.toFixed(6), // ~1.32305
    r2: +LOG_R2.toFixed(8), // ~0.99948 -- the HIGHEST R2: unbounded log wins
  },
  fixedBandPeakFirst: FB_PEAKS[0], // +0.383861 at kEnd=14 (reproduces imp-34040 s first anchor)
  fixedBandPeakLast: FB_PEAKS[FB_PEAKS.length - 1], // +0.865303 at kEnd=20
  fixedBandTotalRiseFraction: FB_TOTAL_RISE_FRACTION, // ~1.25 -- ~125% total rise across 14..20
  fixedBandArgmaxKs: ARGMAX_KS, // 6.50 through kEnd 18.5 then 6.25 -- un-locks
  fixedBandMonotonic: FB_MONOTONIC,
  fixedBandIncrementsDecreasing: FB_INCREMENTS_DECREASING, // false -- increments re-increase past kEnd ~ 18
  fixedBandSecondDiffsAllNegative: FB_SECOND_DIFFS_ALL_NEGATIVE, // false -- imp-34040 s concavity does not persist
  fixedBandSecondDiffsTailPositive: FB_SECOND_DIFFS_TAIL_POSITIVE, // true -- curvature re-accelerates
  fixedBandArgmaxLocked: ARGMAX_LOCKED, // false -- rung un-locks 6.50 -> 6.25
  fixedBandArgmaxLast: ARGMAX_LAST, // 6.25
  unboundedLogWins: UNBOUNDED_LOG_WINS, // true -- log R2 > saturating R2 > linear R2
  keepsClimbing: KEEPS_CLIMBING, // true -- no finite ceiling supported within kEnd <= 20
  imp34040PeakAtKEnd14: IMP34040_PEAK_AT_KEND_14,
  imp34040PeakAtKEnd17: IMP34040_PEAK_AT_KEND_17,
  finding: {
    F1_deceleration_reverses_increments_bottom_then_re_increase:
      'Over kEnd = 14..20 the fixed-band (k <= 10) peak climbs monotonically +0.38386 -> +0.86530 (~125%), ' +
      'but its 12 increments do NOT keep shrinking: they fall to a MINIMUM 0.03370 at the kEnd = 18 -> 18.5 ' +
      'step then RE-INCREASE 0.03370 -> 0.03430 -> 0.03676 -> 0.04066. imp-34040 s "increments strictly ' +
      'decreasing" reading is a within-window (14..17) feature that ends near kEnd ~ 18.',
    F2_second_diffs_flip_back_positive_concavity_reverses:
      'imp-34040 found all 5 second differences strictly NEGATIVE over 14..17; extended to 14..20 the 11 ' +
      'second differences are negative only through the kEnd ~ 17.5 pair and then flip strictly POSITIVE at ' +
      'the tail (+0.000598, +0.002459, +0.003901). The concave / saturating curvature imp-34040 measured is ' +
      'not a monotone approach to a plateau -- it re-accelerates, the opposite of saturation.',
    F3_argmax_rung_un_locks_resumes_creeping:
      'imp-34040 reported the band argmax rung LOCKED at k = 6.50 across 14..17; extended to 20 it holds ' +
      '6.50 only through kEnd = 18.5 then creeps to k = 6.25 at kEnd = 19, 19.5, 20. The "locked" reading ' +
      'is a within-window artifact; the inward OLS pivot resumes, consistent with the re-acceleration in ' +
      'F1/F2 and (independently of the imp-34047 argmax-creep law) another sign the drift has not settled.',
    F4_best_global_form_is_unbounded_log_ceiling_not_selected:
      'A bounded saturating fit peak = a - b/kEnd gives a nominal ceiling a ~ 1.95178 (b ~ 22.06795, ' +
      'R^2 ~ 0.99804), but the UNBOUNDED log form peak = a + b ln(kEnd) fits BETTER (R^2 ~ 0.99948 > ' +
      '0.99804 > linear 0.99617). The nominal ceiling would be approached only at kEnd ~ 1131 (within 1%, ' +
      '~57x the kEnd = 20 window edge); with the re-accelerating increments (F1/F2) the data do NOT support ' +
      'convergence to a finite cap within kEnd <= 20 -- the amplitude KEEPS CLIMBING.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / RESIDUAL-GROWTH FIT (frontier-direction, NOT rigorous). Pushing the imp-34040 ' +
    'fixed-band (k <= 10) peak-amplitude sweep one further decade of N to kEnd = 14.0 .. 20.0 (13 windows, ' +
    'first 7 reproducing imp-34040 s peaks at +0.383861 / +0.648552) with the identical inherited ' +
    'imp-33810/imp-33940/imp-33987/imp-34040 sub-terms shows the imp-34040 SATURATION ONSET does NOT ' +
    'persist. The peak still climbs (+0.38386 -> +0.86530, ~125%) but the deceleration is a TRANSIENT: the ' +
    'increments fall to a minimum 0.03370 at kEnd ~ 18 then RE-INCREASE (0.03370 -> 0.04066), the 11 second ' +
    'differences are negative only early then flip strictly POSITIVE at the tail (+0.000598 -> +0.003901), ' +
    'and the band argmax rung un-locks 6.50 -> 6.25 at kEnd = 19. A bounded saturating fit peak = a - b/kEnd ' +
    'yields a nominal ceiling a ~ 1.95178 (b ~ 22.06795, R^2 ~ 0.99804) but is BEATEN by the unbounded log ' +
    'form (R^2 0.99948 > 0.99804 > linear 0.99617); the nominal ceiling would be approached only at ' +
    'kEnd ~ 1131 (~57x the window edge). No finite ceiling is supported within kEnd <= 20 -- the fixed-band ' +
    'peak amplitude KEEPS CLIMBING. imp-34040 s concave reading over kEnd = 14..17 is CORRECT within its ' +
    'measured window and is not overturned -- only its saturation extrapolation beyond kEnd ~ 18 is ' +
    'corrected. Distinct from any form selection; the imp-33843 log-linear-over-power-law verdict is ' +
    'untouched. The OLS surrogate, the bounded-ceiling fit, and the growth-form classification are ' +
    'descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34040 (the kEnd = 14..17 saturation-onset sweep this continues one decade; machinery reused ' +
    'verbatim); imp-34047 (the argmax-creep law; F3 is an independent argmax observation); imp-34108 (the ' +
    'peak = a - b/kEnd bounded ceiling form reused); imp-33940 (the R2 convex low-k drift origin); ' +
    'imp-33843 (the log-linear OLS re-run per boundary); imp-33810 (the k=6.. ladder reused verbatim); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT_ASSERTIONS = [
  {
    // Reuse gate: 13 windows, and the fixed-band peaks at the shared boundaries kEnd = 14 and 17 reproduce
    // imp-34040 s anchors +0.383861 / +0.648552 -- same machinery, continued one decade.
    id: 'imp34109-reuse-gate-13-windows-anchors-to-imp34040',
    description: '13 windows kEnd 14..20; fixed-band peaks at kEnd 14 and 17 match imp-34040 (+0.383861, +0.648552, < 2e-3)',
    holds: () =>
      FIXED_BAND_ROWS.length === 13 &&
      Math.abs(FB_PEAKS[0] - IMP34040_PEAK_AT_KEND_14) < 2e-3 &&
      Math.abs(FB_PEAKS[6] - IMP34040_PEAK_AT_KEND_17) < 2e-3,
  },
  {
    // (F1) The deceleration reverses: still monotonic, but increments are NOT all decreasing -- they bottom
    // out near kEnd ~ 18 and re-increase.
    id: 'imp34109-deceleration-reverses-increments-bottom-then-rise',
    description: 'fixed band monotonic, total rise > 1, but increments NOT all decreasing; minimum increment near kEnd ~ 18',
    holds: () =>
      FB_MONOTONIC === true &&
      FB_TOTAL_RISE_FRACTION > 1.0 &&
      FB_INCREMENTS_DECREASING === false &&
      MIN_INCREMENT_KEND >= 18 &&
      MIN_INCREMENT_KEND <= 19 &&
      FB_INCREMENTS[FB_INCREMENTS.length - 1] > MIN_INCREMENT,
  },
  {
    // (F2) The second differences flip back positive: NOT all negative (imp-34040 s concavity does not
    // persist), and the tail is strictly positive -- the curvature re-accelerates.
    id: 'imp34109-second-diffs-flip-back-positive',
    description: 'second diffs NOT all negative; tail second diff > 0 -- concavity reverses (no monotone plateau approach)',
    holds: () =>
      FB_SECOND_DIFFS.length === 11 &&
      FB_SECOND_DIFFS_ALL_NEGATIVE === false &&
      FB_SECOND_DIFFS_TAIL_POSITIVE === true &&
      FB_SECOND_DIFFS[0] < 0, // still concave at the start (imp-34040 window), correcting only the tail
  },
  {
    // (F3) The band argmax rung un-locks: NOT locked across all 13 windows; ends at k = 6.25 (< 6.50).
    id: 'imp34109-argmax-rung-un-locks-to-6-25',
    description: 'band argmax rung NOT locked across 14..20; last window sits at k = 6.25 (creep resumed past 6.50)',
    holds: () =>
      ARGMAX_LOCKED === false &&
      ARGMAX_KS[0] === 6.5 &&
      ARGMAX_LAST === 6.25,
  },
  {
    // (F4) Best global form is unbounded: log R2 > saturating R2 > linear R2; the bounded ceiling is a
    // distant extrapolation (>> window edge). keepsClimbing is true.
    id: 'imp34109-unbounded-log-wins-ceiling-not-selected',
    description: 'log R2 > saturating R2 > linear R2; nominal ceiling a in (1.5, 2.5) approached only >> window edge; keepsClimbing true',
    holds: () =>
      UNBOUNDED_LOG_WINS === true &&
      LOG_R2 > SAT_R2 &&
      SAT_R2 > LIN_R2 &&
      SAT_CEILING > 1.5 &&
      SAT_CEILING < 2.5 &&
      CEILING_REACH_1PCT > 40 &&
      KEEPS_CLIMBING === true,
  },
  {
    // Honesty gate: measurement only, saturation onset CORRECTED (not a plateau), isRigorous false,
    // imp-34040 within-window untouched, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched.
    id: 'imp34109-honesty-gate-no-qed',
    description: 'Measurement only: keepsClimbing, isRigorous false, imp-34040 within-window untouched, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.keepsClimbing === true &&
      IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.verdict) &&
      /NO QED/.test(IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.verdict),
  },
];

for (const a of IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34109-fixed-band-peak-amplitude-saturation-fit assertion failed: ${a.id}`);
  }
}
