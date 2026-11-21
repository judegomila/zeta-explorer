/**
 * @module imp-34169-fixed-band-peak-extended-decade-surrogate-zero
 *
 * imp-34169 (numerical, frontier-direction): imp-34109 pushed the imp-34040 fixed-band (k <= 10)
 * peak-amplitude sweep one decade to kEnd = 14.0 .. 20.0 and found the imp-34040 saturation ONSET is a
 * TRANSIENT -- the 12 increments bottom out ~0.03370 at kEnd ~ 18 then RE-INCREASE (0.03370 -> 0.03430 ->
 * 0.03676 -> 0.04066), the tail second differences flip strictly POSITIVE, and the unbounded log form beats
 * the bounded a - b/kEnd ceiling over kEnd <= 20, so the peak "keeps climbing" with no finite ceiling
 * supported inside the window. This module continues the IDENTICAL inherited
 * imp-33810/imp-33940/imp-33987/imp-34040/imp-34109 machinery ONE further decade, kEnd in
 * {20.0, 20.5, ..., 26.0} (13 windows, 0.5 step), to MEASURE whether the imp-34109 post-18 increment
 * RE-ACCELERATION persists or the unbounded log form breaks.
 *
 * THE ANSWER: BOTH, AND THE STRONGER ONE IS DECISIVE -- THE re-acceleration PERSISTS over every window that
 * remains computable, and the "unbounded log form" BREAKS in the strongest possible sense at kEnd ~ 21.28:
 * not because a bounded ceiling finally wins, but because the imp-33810/imp-33843 log-linear SURROGATE the
 * ENTIRE fixed-band-peak family fits CEASES TO BE DEFINED. The quarter-decade ladder quantity
 * resid_exp(k) = pEcoll (1 - sigma) - pSigma -- whose LOG the imp-33843 OLS takes (via
 * eflow_over_resid = eflow_attr / resid_exp) -- is strictly decaying through the deep tail and CROSSES ZERO
 * at k* ~ 21.28095. For any kEnd >= 21.5 the ladder includes at least one rung (k = 21.5) with
 * resid_exp < 0, hence eflow_over_resid < 0, hence Math.log(eflow_over_resid) = NaN, hence the imp-33843
 * OLS residual vector -- and every downstream quantity (fixed-band peak, increments, second differences,
 * all three fits) -- is undefined. The 13-window kEnd = 20..26 ceiling contest the ticket envisioned is NOT
 * computable: the sweep has a HARD RIGHT EDGE at k* ~ 21.28.
 *
 * THE MEASUREMENT (imp-34109 machinery reused verbatim; the kEnd grid extends and a surrogate-zero probe is new)
 * -------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-33940/imp-33987/imp-34040/imp-34109. No re-derivation.
 *   Boundary sweep   kEnd = 20.0, 20.5, ..., 26.0 (13 windows) -- the immediate one-decade continuation of
 *                    imp-34109 s kEnd = 14..20 grid (same 0.5 step). kEnd = 20 is a shared anchor, so the
 *                    first window reproduces imp-34109 s last fixed-band peak (+0.865303).
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 R2 / imp-33987 / imp-34040 / imp-34109 tracked.
 *   Surrogate-zero   the first ladder rung k where resid_exp(k) = pEcoll (1 - sigma) - pSigma <= 0 (the log
 *   probe            argument goes non-positive), and the bisected continuous zero-crossing k* -- the hard
 *                    right edge past which NO fixed-band peak (and NO log-vs-saturate contest) is defined.
 *
 * THE FINDING (measurement only -- the extension DOES NOT complete: the log-linear surrogate terminates at k* ~ 21.28)
 * -----------------------------------------------------------------------------------------------------------------
 *   (F1) THE re-acceleration PERSISTS AND STRENGTHENS over the computable extension. On the three windows
 *        that remain defined -- kEnd = 20.0 (reproducing imp-34109 s +0.865303), 20.5, 21.0 -- the fixed-band
 *        peak keeps climbing +0.865303 -> +0.915942 -> +0.996333, and its increments RE-ACCELERATE further
 *        0.050639 -> 0.080391 (a single strictly POSITIVE second difference +0.029752). Stitched onto
 *        imp-34109 s tail increment 0.04066 (kEnd 19.5 -> 20) the increment sequence is 0.04066 -> 0.050639
 *        -> 0.080391 -- monotone rising, NOT settling. imp-34109 s post-18 re-acceleration is confirmed and
 *        accelerating into kEnd = 20..21; it does NOT flatten toward a ceiling.
 *   (F2) THE SWEEP TERMINATES AT kEnd = 21.0 -- THE SURROGATE resid_exp(k) CROSSES ZERO AT k* ~ 21.28095.
 *        resid_exp(k) = pEcoll (1 - sigma) - pSigma is strictly decaying through the deep tail: +3.04e-6 at
 *        k = 19, +7.94e-7 at k = 20, +8.72e-8 at k = 21, +8.19e-9 at k = 21.25, then -4.97e-8 at k = 21.5.
 *        Bisection pins the continuous zero at k* ~ 21.28095. The last 0.5-grid boundary whose entire ladder
 *        (rungs k = 6.00 .. kEnd) stays positive is kEnd = 21.0; at kEnd = 21.5 the newest rung k = 21.5 is
 *        already negative.
 *   (F3) PAST k* THE LOG ARGUMENT IS NON-POSITIVE, SO THE FIXED-BAND PEAK IS NaN -- THE UNBOUNDED LOG FORM
 *        "BREAKS" BY CEASING TO EXIST, NOT BY LOSING A FIT. eflow_over_resid = eflow_attr / resid_exp has a
 *        POLE at k* (the ratio spikes to +5.90e-7 at k = 21.25 then flips to -5.67e-8 at k = 21.5). Once any
 *        ladder rung carries eflow_over_resid < 0, the imp-33843 OLS takes Math.log of a negative number ->
 *        NaN -> the entire residual vector, and hence the fixed-band peak / increments / second differences /
 *        bounded-linear-log fits, is undefined. So NO log-vs-saturate ceiling contest is possible for
 *        kEnd = 21.5 .. 26.0 -- the 13-window fit the ticket posed is not computable; only kEnd = 20.0, 20.5,
 *        21.0 (3 windows) extend imp-34109.
 *
 * The punchline: pushing the imp-34109 fixed-band (k <= 10) peak sweep one further decade to kEnd = 20..26
 * shows the re-acceleration PERSISTS (peak +0.865303 -> +0.996333, increments 0.050639 -> 0.080391, second
 * difference +0.029752) over the three windows that remain defined, and the "unbounded log form" BREAKS
 * decisively at kEnd ~ 21.28: the imp-33810/imp-33843 surrogate resid_exp(k) crosses zero at k* ~ 21.28095,
 * turning the log argument eflow_over_resid non-positive and every downstream fixed-band-peak quantity into
 * NaN. The imp-34109 verdict is CORRECT within its measured window and is not overturned -- but the sweep
 * cannot be continued to kEnd = 22..26 as posed, because the log-linear surrogate the whole family fits has
 * a hard right edge at k* ~ 21.28.
 *
 * MEASUREMENT / SURROGATE-DOMAIN PROBE ONLY. A descriptive continuation of an inherited surrogate that finds
 * the surrogate s domain edge, NOT an RH bound and distinct from any form selection (the imp-33843
 * log-linear-over-power-law verdict and the imp-34109 findings it extends are untouched). The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate and
 * the zero-crossing bisection are descriptive, not derived; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (sibling cohort member: refines the
 *   imp-34109 increment minimum on the same fixed-band (k<=10) peak this module tracks to the same k*~21.281 pole)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the kEnd = 14..20 sweep this continues; machinery reused)
 * @see imp-34040-fixed-band-drift-saturation-decade (the kEnd = 14..17 saturation-onset sweep)
 * @see imp-34107-resid-exp-second-path-crossvalidation (the resid_exp(k) schedule whose zero this locates)
 * @see imp-33940-interior-residual-boundary-stability (the R2 convex low-k drift origin)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose log argument goes non-positive)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim; its resid_exp is what crosses zero)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the same k*~21.281 ceiling, bisected there)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (closed-form derivation of the same k*)
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (next-order term on the same ceiling)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (widening-slope limit bounded by the same k*)
 * @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (viz of this module's pole)
 * @see imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation (sibling cohort member: SUB-GAP-imp-34287-asymptotic-class-undecidable, the growth-class this pole leaves undecided)
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (sibling cohort member: SUB-GAP-imp-34268-convex-branch-form, the convex branch this pole terminates)
 * @see imp-34228-doubling-map-double-precision-anchor-floor (sibling cohort member: SUB-GAP-imp-34228-residexp-resolution-floor, the resid_exp resolution floor near the same pole)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd*~21.281) -> imp-34127
 * (leading closed form) -> imp-34189 (next-order term + window-width divergence) -> imp-34188
 * (widening-slope leading -ln10/2, observed -1 a finite-window coincidence per imp-34246) ->
 * imp-34169 (this module)/imp-34237 (fixed-band peak
 * re-acceleration terminating at the resid_exp pole). All six share the same kEnd* ceiling.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34109
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34109.
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

// The imp-33810/imp-33843 surrogate quantities at a single decade [10^k, 10^(k+1)] -- verbatim imp-34109.
function residExpAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-34109.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
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
// Returns { peak, atK, defined }: defined=false when any ladder rung carried a non-positive log argument.
function fixedBandPeak(R, kMax) {
  const anyNonPositive = R.some((r) => !(r.eflow_over_resid > 0));
  const { KS, RES } = residualVector(R);
  let maxI = -1;
  for (let i = 0; i < RES.length; i++) {
    if (KS[i] <= kMax + 1e-9 && (maxI < 0 || RES[i] > RES[maxI])) maxI = i;
  }
  const peak = RES[maxI];
  const defined = !anyNonPositive && Number.isFinite(peak);
  return { peak, atK: KS[maxI], defined };
}

// ONE-DECADE CONTINUATION of imp-34109: kEnd = 20.0, 20.5, ..., 26.0 (13 windows; first reproduces imp-34109).
const K_ENDS = [];
for (let k = 20; k <= 26 + 1e-9; k += 0.5) K_ENDS.push(+k.toFixed(2));

const FIXED_BAND_KMAX = 10.0; // identical band to imp-33940 R2 / imp-33987 / imp-34040 / imp-34109

const ALL_ROWS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  return { kEnd, peak: fp.defined ? +fp.peak.toFixed(6) : null, atK: fp.atK, defined: fp.defined };
});

// The computable extension: the leading run of windows whose fixed-band peak is defined (all rungs positive).
const VALID_ROWS = ALL_ROWS.filter((r) => r.defined);
const FIRST_BREAKDOWN_ROW = ALL_ROWS.find((r) => !r.defined) || null;
const FIRST_BREAKDOWN_KEND = FIRST_BREAKDOWN_ROW ? FIRST_BREAKDOWN_ROW.kEnd : null; // 21.5
const V_PEAKS = VALID_ROWS.map((r) => r.peak);

// Increments and the single second difference over the computable extension -- the re-acceleration test.
const V_INCREMENTS = [];
for (let i = 1; i < V_PEAKS.length; i++) V_INCREMENTS.push(+(V_PEAKS[i] - V_PEAKS[i - 1]).toFixed(6));
const V_SECOND_DIFFS = [];
for (let i = 1; i < V_INCREMENTS.length; i++)
  V_SECOND_DIFFS.push(+(V_INCREMENTS[i] - V_INCREMENTS[i - 1]).toFixed(6));

// The surrogate zero: first ladder rung k where resid_exp(k) <= 0, and the bisected continuous crossing k*.
function firstNonPositiveResidRung(kMax) {
  for (let k = 6; k <= kMax + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    if (!(residExpAt(kk) > 0)) return kk;
  }
  return null;
}
const FIRST_NEG_RUNG_K = firstNonPositiveResidRung(26.0); // 21.5 -- the newest rung at kEnd = 21.5
function bisectResidZero(a0, b0) {
  let a = a0;
  let b = b0;
  for (let it = 0; it < 80; it++) {
    const m = (a + b) / 2;
    if (residExpAt(m) > 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
const RESID_ZERO_KSTAR = bisectResidZero(21.0, 22.0); // k* ~ 21.28095
const RESID_AT_21_25 = residExpAt(21.25); // ~ +8.19e-9 -- last positive quarter-rung
const RESID_AT_21_50 = residExpAt(21.5); // ~ -4.97e-8 -- first negative quarter-rung
const RATIO_AT_21_25 = eflowOverResidAt(21.25); // ~ +5.90e-7 -- ratio spikes toward the pole
const RATIO_AT_21_50 = eflowOverResidAt(21.5); // ~ -5.67e-8 -- ratio flips negative past the pole

// imp-34109 shared anchor + tail increment, for the reuse / continuation gate (baked literals).
const IMP34109_PEAK_AT_KEND_20 = 0.865303; // imp-34109 fixedBandPeakLast
const IMP34109_TAIL_INCREMENT_195_TO_20 = 0.04066; // imp-34109 last increment kEnd 19.5 -> 20

const V_MONOTONIC = V_PEAKS.every((p, i) => i === 0 || p > V_PEAKS[i - 1]);
const V_TOTAL_RISE_FRACTION = +((V_PEAKS[V_PEAKS.length - 1] - V_PEAKS[0]) / V_PEAKS[0]).toFixed(4);
const V_INCREMENTS_RE_ACCELERATE = V_INCREMENTS.every((x, i) => i === 0 || x > V_INCREMENTS[i - 1]);
const V_SECOND_DIFF_POSITIVE = V_SECOND_DIFFS.every((d) => d > 0);
const STITCHED_INCREMENTS_RISING =
  IMP34109_TAIL_INCREMENT_195_TO_20 < V_INCREMENTS[0] && V_INCREMENTS[0] < V_INCREMENTS[1];
const RE_ACCELERATION_PERSISTS = V_MONOTONIC && V_INCREMENTS_RE_ACCELERATE && V_SECOND_DIFF_POSITIVE;
const LOG_SURROGATE_BREAKS = FIRST_BREAKDOWN_KEND !== null && RATIO_AT_21_50 < 0 && RESID_AT_21_50 < 0;
const SWEEP_NOT_COMPUTABLE_AS_POSED = VALID_ROWS.length < K_ENDS.length; // 3 of 13 windows defined

export const IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO = {
  id: 'imp-34169',
  proofSection: 'S-frontier',
  question:
    'imp-34109 pushed the fixed-band (k <= 10) peak sweep to kEnd = 14..20 and found the imp-34040 ' +
    'saturation onset is a TRANSIENT -- increments bottom out ~0.03370 at kEnd ~ 18 then re-increase and ' +
    'the unbounded log form beats the bounded a - b/kEnd ceiling. Pushing the SAME selector one further ' +
    'decade to kEnd = 20.0 .. 26.0 (13 windows), does the imp-34109 post-18 increment RE-ACCELERATION ' +
    'persist or does the unbounded log form break? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Per boundary kEnd = 20.0, 20.5, ..., 26.0 (13 windows): the largest signed residual in the fixed band ' +
    'k <= 10.00 of the imp-33843 log-linear OLS on the imp-33810 ladder k = 6.00 .. kEnd, its increments ' +
    'and second differences over the windows that remain computable (re-acceleration test), and -- where ' +
    'the sweep terminates -- the first ladder rung with resid_exp(k) = pEcoll (1 - sigma) - pSigma <= 0 and ' +
    'the bisected continuous zero-crossing k* past which the log argument eflow_over_resid is non-positive ' +
    'and the fixed-band peak is undefined',
  kEnds: K_ENDS, // 13 windows kEnd = 20.0 .. 26.0
  allRows: ALL_ROWS, // {kEnd, peak|null, atK, defined} x 13 -- peak is null for kEnd >= 21.5
  validRows: VALID_ROWS, // {kEnd, peak, atK, defined} x 3 -- kEnd = 20.0, 20.5, 21.0 (the computable extension)
  fixedBandKMax: FIXED_BAND_KMAX,
  validPeaks: V_PEAKS, // [0.865303, 0.915942, 0.996333]
  validIncrements: V_INCREMENTS, // [0.050639, 0.080391] -- RE-ACCELERATE
  validSecondDifferences: V_SECOND_DIFFS, // [0.029752] -- strictly POSITIVE
  validTotalRiseFraction: V_TOTAL_RISE_FRACTION, // ~0.1514 (~15% over the 3 defined windows)
  validArgmaxKs: VALID_ROWS.map((r) => r.atK), // [6.25, 6.25, 6.25] -- holds imp-34109 s unlocked rung
  firstBreakdownKEnd: FIRST_BREAKDOWN_KEND, // 21.5 -- first window whose ladder carries a non-positive rung
  computableWindowCount: VALID_ROWS.length, // 3 of 13 -- the ticket s 13-window contest is not computable
  surrogateZero: {
    quantity: 'resid_exp(k) = pEcoll (1 - sigma) - pSigma (the imp-33810/imp-33843 log argument numerator)',
    firstNonPositiveRungK: FIRST_NEG_RUNG_K, // 21.5
    continuousZeroKStar: +RESID_ZERO_KSTAR.toFixed(6), // ~21.280947
    residAtLastPositiveRung: +RESID_AT_21_25.toExponential(4), // ~ +8.19e-9 at k = 21.25
    residAtFirstNegativeRung: +RESID_AT_21_50.toExponential(4), // ~ -4.97e-8 at k = 21.5
    eflowOverResidAtLastPositiveRung: RATIO_AT_21_25, // ~ +5.90e-7 -- spikes toward the pole at k*
    eflowOverResidAtFirstNegativeRung: RATIO_AT_21_50, // ~ -5.67e-8 -- flips negative past the pole
  },
  imp34109PeakAtKEnd20: IMP34109_PEAK_AT_KEND_20,
  imp34109TailIncrement195To20: IMP34109_TAIL_INCREMENT_195_TO_20,
  stitchedIncrementsRising: STITCHED_INCREMENTS_RISING, // 0.04066 -> 0.050639 -> 0.080391
  reAccelerationPersists: RE_ACCELERATION_PERSISTS, // true over the computable extension
  logSurrogateBreaks: LOG_SURROGATE_BREAKS, // true -- resid_exp goes non-positive at k* ~ 21.28
  sweepNotComputableAsPosed: SWEEP_NOT_COMPUTABLE_AS_POSED, // true -- only 3 of 13 windows are defined
  finding: {
    F1_re_acceleration_persists_and_strengthens:
      'On the three windows that remain defined -- kEnd = 20.0 (reproducing imp-34109 s +0.865303), 20.5, ' +
      '21.0 -- the fixed-band (k <= 10) peak keeps climbing +0.865303 -> +0.915942 -> +0.996333 and its ' +
      'increments RE-ACCELERATE 0.050639 -> 0.080391 (a single strictly POSITIVE second difference ' +
      '+0.029752). Stitched onto imp-34109 s tail increment 0.04066 (kEnd 19.5 -> 20) the increments read ' +
      '0.04066 -> 0.050639 -> 0.080391 -- monotone rising, NOT settling. imp-34109 s post-18 re-acceleration ' +
      'persists and accelerates into kEnd = 20..21; it does not flatten toward a ceiling.',
    F2_surrogate_resid_exp_crosses_zero_at_kstar_21_28:
      'resid_exp(k) = pEcoll (1 - sigma) - pSigma is strictly decaying through the deep tail (+3.04e-6 at ' +
      'k = 19, +7.94e-7 at k = 20, +8.72e-8 at k = 21, +8.19e-9 at k = 21.25) then goes NEGATIVE ' +
      '(-4.97e-8 at k = 21.5). Bisection pins the continuous zero-crossing at k* ~ 21.28095. The last ' +
      '0.5-grid boundary whose entire ladder stays positive is kEnd = 21.0; at kEnd = 21.5 the newest rung ' +
      'k = 21.5 is already negative.',
    F3_log_form_breaks_by_ceasing_to_exist_not_by_losing_a_fit:
      'eflow_over_resid = eflow_attr / resid_exp has a POLE at k* -- the ratio spikes to +5.90e-7 at ' +
      'k = 21.25 then flips to -5.67e-8 at k = 21.5. Once any ladder rung carries eflow_over_resid < 0 the ' +
      'imp-33843 OLS takes Math.log of a negative number -> NaN -> the whole residual vector, and hence the ' +
      'fixed-band peak / increments / second differences / bounded-linear-log fits, is undefined. So NO ' +
      'log-vs-saturate ceiling contest is possible for kEnd = 21.5 .. 26.0 -- the 13-window fit posed by the ' +
      'ticket is NOT computable; only kEnd = 20.0, 20.5, 21.0 (3 windows) extend imp-34109. The "unbounded ' +
      'log form" breaks in the strongest possible sense: the surrogate it fits terminates, not the fit.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SURROGATE-DOMAIN PROBE (frontier-direction, NOT rigorous). Continuing the imp-34109 ' +
    'fixed-band (k <= 10) peak sweep one further decade to kEnd = 20.0 .. 26.0 (13 windows) with the ' +
    'identical inherited imp-33810/imp-33940/imp-33987/imp-34040/imp-34109 sub-terms shows the imp-34109 ' +
    'post-18 increment RE-ACCELERATION PERSISTS over every window that stays computable (peak +0.865303 -> ' +
    '+0.915942 -> +0.996333, increments 0.050639 -> 0.080391, second difference +0.029752, stitched onto ' +
    'imp-34109 s 0.04066), and the "unbounded log form" BREAKS decisively at kEnd ~ 21.28: the ' +
    'imp-33810/imp-33843 surrogate resid_exp(k) = pEcoll (1 - sigma) - pSigma is strictly decaying through ' +
    'the deep tail and crosses ZERO at k* ~ 21.28095, so eflow_over_resid = eflow_attr / resid_exp turns ' +
    'non-positive (a pole at k*), Math.log of it is NaN, and every downstream fixed-band-peak quantity is ' +
    'undefined. Only kEnd = 20.0, 20.5, 21.0 (3 of the 13 windows) are computable -- the log-vs-saturate ' +
    'ceiling contest the ticket envisioned over kEnd = 22..26 is NOT computable: the log-linear surrogate ' +
    'the whole fixed-band-peak family fits has a HARD RIGHT EDGE at k* ~ 21.28. imp-34109 s verdict is ' +
    'CORRECT within its measured window and is not overturned -- but the sweep cannot be pushed further as ' +
    'posed. HONEST SUB-GAP SUB-GAP-imp-34169-surrogate-domain-edge: whether the resid_exp(k) zero at ' +
    'k* ~ 21.28 is an artifact of the OLS quarter-decade exponent estimators (pSigma, pEcoll) or a genuine ' +
    'feature of the inherited imp-3220/imp-3406 component model in the deep tail is left OPEN for a ' +
    'dedicated reconciliation. Distinct from any form selection; the imp-33843 log-linear-over-power-law ' +
    'verdict and the imp-34109 findings are untouched. The OLS surrogate and the zero-crossing bisection ' +
    'are descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34109 (the kEnd = 14..20 sweep this continues one decade; machinery reused verbatim); imp-34040 ' +
    '(the kEnd = 14..17 saturation-onset sweep); imp-34107 (the resid_exp(k) schedule whose zero this ' +
    'locates); imp-33940 (the R2 convex low-k drift origin); imp-33843 (the log-linear OLS whose log ' +
    'argument goes non-positive); imp-33810 (the k=6.. ladder reused verbatim); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN); ' +
    'polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO_ASSERTIONS = [
  {
    // Reuse / continuation gate: 13-window grid kEnd 20..26, and the kEnd = 20 fixed-band peak reproduces
    // imp-34109 s last window +0.865303 -- same machinery, continued one decade.
    id: 'imp34169-reuse-gate-13-window-grid-anchors-to-imp34109',
    description: '13-window grid kEnd 20..26; kEnd = 20 fixed-band peak matches imp-34109 fixedBandPeakLast (+0.865303, < 2e-3)',
    holds: () =>
      K_ENDS.length === 13 &&
      K_ENDS[0] === 20 &&
      K_ENDS[K_ENDS.length - 1] === 26 &&
      VALID_ROWS.length >= 1 &&
      Math.abs(V_PEAKS[0] - IMP34109_PEAK_AT_KEND_20) < 2e-3,
  },
  {
    // (F1) The re-acceleration persists: exactly 3 windows are computable, the peak is monotone rising, and
    // the increments RE-ACCELERATE with a strictly positive second difference.
    id: 'imp34169-re-acceleration-persists-over-computable-extension',
    description: '3 computable windows; peaks monotone rising; increments re-accelerate 0.050639 -> 0.080391 with a positive second difference; stitched onto imp-34109 s 0.04066',
    holds: () =>
      VALID_ROWS.length === 3 &&
      V_MONOTONIC === true &&
      V_TOTAL_RISE_FRACTION > 0.1 &&
      V_INCREMENTS_RE_ACCELERATE === true &&
      V_SECOND_DIFF_POSITIVE === true &&
      STITCHED_INCREMENTS_RISING === true &&
      RE_ACCELERATION_PERSISTS === true,
  },
  {
    // (F2) The surrogate resid_exp(k) crosses zero: first non-positive rung at k = 21.5, continuous zero
    // k* in (21.25, 21.5), last positive rung resid_exp > 0, first negative rung resid_exp < 0.
    id: 'imp34169-surrogate-resid-exp-crosses-zero-at-kstar-21-28',
    description: 'first non-positive resid_exp rung at k = 21.5; bisected continuous zero k* in (21.25, 21.5); resid_exp(21.25) > 0 > resid_exp(21.5)',
    holds: () =>
      FIRST_NEG_RUNG_K === 21.5 &&
      RESID_ZERO_KSTAR > 21.25 &&
      RESID_ZERO_KSTAR < 21.5 &&
      RESID_AT_21_25 > 0 &&
      RESID_AT_21_50 < 0,
  },
  {
    // (F3) The log form breaks by ceasing to exist: past k* eflow_over_resid < 0 (a pole at k*), the sweep
    // is not computable as posed (only 3 of 13 windows defined), and the first breakdown is at kEnd = 21.5.
    id: 'imp34169-log-form-breaks-surrogate-non-positive-past-kstar',
    description: 'eflow_over_resid flips positive->negative across k* (a pole); sweep not computable as posed (3 of 13 windows); first breakdown at kEnd = 21.5',
    holds: () =>
      RATIO_AT_21_25 > 0 &&
      RATIO_AT_21_50 < 0 &&
      LOG_SURROGATE_BREAKS === true &&
      SWEEP_NOT_COMPUTABLE_AS_POSED === true &&
      FIRST_BREAKDOWN_KEND === 21.5 &&
      ALL_ROWS.filter((r) => r.defined).length === 3,
  },
  {
    // Honesty gate: measurement only, re-acceleration persists AND log surrogate breaks, isRigorous false,
    // imp-34109 within-window untouched, open sub-gap flagged, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched.
    id: 'imp34169-honesty-gate-no-qed',
    description: 'Measurement only: reAccelerationPersists & logSurrogateBreaks, isRigorous false, imp-34109 untouched, sub-gap flagged, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched',
    holds: () =>
      IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.reAccelerationPersists === true &&
      IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.logSurrogateBreaks === true &&
      IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.verdict) &&
      /SUB-GAP-imp-34169-surrogate-domain-edge/.test(IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.verdict) &&
      /is CORRECT within its measured window and is not overturned/.test(IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.verdict) &&
      /NO QED/.test(IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.verdict) &&
      /refereed bound is changed/i.test(IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO.verdict),
  },
];

for (const a of IMP34169_FIXED_BAND_PEAK_EXTENDED_DECADE_SURROGATE_ZERO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34169-fixed-band-peak-extended-decade-surrogate-zero assertion failed: ${a.id}`);
  }
}
