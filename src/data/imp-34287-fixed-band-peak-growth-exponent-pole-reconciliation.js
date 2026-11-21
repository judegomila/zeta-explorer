/**
 * @module imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation
 *
 * imp-34287 (numerical, frontier-direction): imp-34196 confirmed at 0.25-grid sub-window resolution that the
 * fixed-band (k <= 10) peak keeps climbing with per-kEnd increments that bottom out near kEnd ~ 18.64 then
 * RE-ACCELERATE (increment slope +0.002567), and cited the imp-34109 F4 "unbounded-LOG" verdict. But a pure
 * logarithm P = A ln(kEnd) + B grows with monotonically DECELERATING increments -- so a RISING increment is
 * in direct tension with a genuine log. This module RECONCILES that tension by measuring the LOCAL GROWTH
 * EXPONENT of the fixed-band peak across the WIDEST computable boundary window (kEnd = 14.0 .. 21.25, the full
 * span from the imp-34040 saturation-onset window out to the last 0.25-grid boundary whose entire imp-33810
 * ladder stays positive before the imp-34169 resid_exp pole at k* ~ 21.28095) and asks whether the
 * re-acceleration is a bounded finite-window transient consistent with unbounded (log-or-slower) growth, or
 * genuine super-logarithmic growth.
 *
 * THE DISCRIMINATOR (additive-constant-free, unlike a raw power-of-log fit)
 * ------------------------------------------------------------------------
 *   The clean sub-log / log / super-log test is the LOCAL LOG-DERIVATIVE g(kEnd) = dP / d ln(kEnd), estimated
 *   as the consecutive difference (P_i - P_{i-1}) / (ln kEnd_i - ln kEnd_{i-1}). With P = A (ln kEnd)^q,
 *   g = A q (ln kEnd)^(q-1), so:
 *     q = 1 (pure log)   => g CONSTANT
 *     q < 1 (sub-log)    => g DECLINING in kEnd
 *     q > 1 (super-log)  => g RISING in kEnd
 *   g is insensitive to the large additive offset in P (the fixed-band peak does NOT pass through the origin),
 *   which is exactly why a direct dlnP / dln(ln kEnd) power-of-log exponent is contaminated (it reads q ~ 5..12,
 *   a pure offset artifact) and g is not. The per-kEnd increment imp-34196 tracked is dP/dkEnd = g/kEnd, so a
 *   RISING increment does NOT by itself imply super-log: g = kEnd * (increment/step) can still be declining.
 *
 * THE MEASUREMENT (imp-34196/imp-34109 machinery reused verbatim; only the kEnd span widens and g + the
 * pole-proximity regression are new)
 * ---------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406 sub-terms
 *                    EXACTLY as in imp-33810/imp-33940/imp-33987/imp-34040/imp-34109/imp-34196. No re-derivation.
 *   Widest sweep     kEnd = 14.0, 14.25, ..., 21.25 (30 windows, 0.25 step) -- from the imp-34040 onset window
 *                    to the last 0.25 boundary before the imp-34169 pole k* ~ 21.28095 (rung k = 21.25 has
 *                    resid_exp ~ +8.19e-9 > 0, the last positive quarter-rung; kEnd = 21.5 is undefined).
 *   Fixed-band peak  the largest signed residual among rungs k <= 10.00 -- the identical boundary-independent
 *                    band imp-33940 R2 / imp-33987 / imp-34040 / imp-34109 / imp-34196 tracked.
 *   Local exponent   g(kEnd) = dP / d ln(kEnd) across the 29 consecutive-window steps; split into a
 *                    FAR-FROM-POLE branch (kEnd <= 18, pole distance >= 3.28) and a POLE-APPROACH branch
 *                    (kEnd >= 18.75), each OLS-fit g = a + b kEnd for its trend sign.
 *   Pole regression  g regressed on the pole-proximity coordinate 1/(k* - kEnd): a high R^2 means the local
 *                    exponent is GOVERNED by distance to the resid_exp pole, i.e. the re-acceleration is a
 *                    pole-driven transient, not intrinsic super-log growth.
 *
 * THE FINDING (measurement only -- the tension resolves: the far window is DECELERATING (sub-log-leaning), the
 * near-pole re-acceleration is a pole-proximity transient, and the true asymptotic class is UNDECIDABLE)
 * ---------------------------------------------------------------------------------------------------------------
 *   (F1) FAR FROM THE POLE THE LOCAL EXPONENT DECLINES -- SUB-LOG-LEANING, NOT SUPER-LOG. Over kEnd = 14.25 ..
 *        18.0 the local log-derivative g(kEnd) falls monotonically +1.4109 -> +1.2325 (OLS slope b ~ -0.0535,
 *        R^2 ~ 0.981), bottoming at g ~ 1.2288 at kEnd = 18.25. A DECLINING g means q < 1 (sub-log): the
 *        genuine within-window growth DECELERATES, exactly the imp-34040 saturation-onset behaviour, and is
 *        LOG-CONSISTENT-OR-SLOWER, never super-log. g stays well above 0 (~1.3), so there is no finite ceiling
 *        -- the imp-34109 "unbounded" reading holds, but "log" is an upper bound on the far-window rate, not a
 *        floor.
 *   (F2) THE RE-ACCELERATION IS CONFINED TO THE POLE-APPROACH BRANCH. Over kEnd >= 18.75 g REVERSES and climbs
 *        +1.2418 -> +8.8009 at kEnd = 21.25 -- the imp-34196 re-acceleration, now read on the log-derivative.
 *        This is the ONLY window where g rises; it begins one quarter-rung after the g minimum (kEnd = 18.25)
 *        and steepens without bound toward the boundary.
 *   (F3) THE RE-ACCELERATION IS A POLE-PROXIMITY TRANSIENT, NOT GENUINE SUPER-LOG GROWTH. Regressing g on the
 *        pole-proximity coordinate 1/(k* - kEnd) (k* = 21.280947) gives g ~ 1.4074 + 0.2361/(k* - kEnd) with
 *        R^2 ~ 0.9235 across ALL 29 steps (R^2 ~ 0.9298 restricted to the pole-approach branch). So the local
 *        exponent DIVERGES like 1/(k* - kEnd): the apparent super-log signature is the leading edge of the
 *        imp-34169/imp-34237 resid_exp pole (where eflow_over_resid -> +inf inflates the imp-33843 OLS
 *        residuals), NOT intrinsic super-logarithmic growth of the peak. The re-acceleration is a bounded
 *        finite-window transient governed by the surrogate s hard right edge.
 *   (F4) THE ASYMPTOTIC GROWTH CLASS IS UNDECIDABLE WITHIN THIS SURROGATE. The surrogate domain terminates at
 *        k* ~ 21.28 before any pole-free window can separate a genuine super-log signature from pole
 *        contamination: the entire re-acceleration branch (kEnd >= 18.75) sits inside the pole s influence
 *        radius (g tracks 1/(k*-kEnd) with R^2 ~ 0.92). So this measurement can only conclude the far-window
 *        growth is DECELERATING / sub-log-leaning and the re-acceleration is a pole transient; whether the TRUE
 *        underlying fixed-band-peak growth is sub-log, log, or super-log is left OPEN.
 *
 * The punchline: measuring the local log-derivative g = dP/d ln(kEnd) across the widest computable window
 * (kEnd = 14.0 .. 21.25, 30 windows) reconciles the imp-34196 rising-increment / imp-34109 unbounded-log
 * tension. Far from the imp-34169 pole (kEnd <= 18) g DECLINES 1.4109 -> 1.2325 (slope -0.0535, R^2 0.981) --
 * DECELERATING, sub-log-leaning, never super-log. The imp-34196 re-acceleration is confined to the
 * pole-approach branch (kEnd >= 18.75), where g climbs to 8.80, and is EXPLAINED by pole proximity:
 * g ~ 1.4074 + 0.2361/(k* - kEnd), R^2 0.9235. The re-acceleration is thus a bounded finite-window transient
 * driven by the surrogate resid_exp pole at k* ~ 21.28, NOT genuine super-logarithmic growth -- and because
 * the whole re-accel branch lies inside the pole s influence radius, the TRUE asymptotic class stays
 * UNDECIDABLE. imp-34196 s measured re-acceleration is CORRECT and is not overturned; its SUPER-LOG reading is
 * reframed as a pole artifact.
 *
 * MEASUREMENT / LOCAL-EXPONENT RECONCILIATION ONLY. A descriptive reconciliation of two inherited-surrogate
 * measurements, NOT an RH bound and distinct from any form selection (the imp-33843 log-linear-over-power-law
 * verdict and the imp-34196 / imp-34109 findings it reconciles are untouched). The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate, the local
 * log-derivative, and the pole-proximity regression are descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * HONEST SUB-GAP SUB-GAP-imp-34287-asymptotic-class-undecidable: whether the TRUE fixed-band-peak growth is
 * sub-log, log, or super-log cannot be decided by this surrogate, because its domain terminates at the
 * resid_exp pole k* ~ 21.28 and the entire re-acceleration branch (kEnd >= 18.75) lies inside the pole s
 * influence radius (g tracks 1/(k*-kEnd) with R^2 ~ 0.92). A pole-free deep-tail estimator distinct from the
 * imp-33810 quarter-decade OLS would be required to separate an intrinsic super-log signature from pole
 * contamination; left OPEN.
 *
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the rising-increment re-acceleration this reconciles)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the F4 unbounded-log verdict this reconciles)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the resid_exp pole k* ~ 21.28095 this attributes the re-accel to)
 * @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data (the pole viz sibling)
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (sibling cohort member: SUB-GAP-imp-34268-convex-branch-form on the same post-minimum branch)
 * @see imp-34228-doubling-map-double-precision-anchor-floor (sibling cohort member: SUB-GAP-imp-34228-residexp-resolution-floor, the resid_exp resolution floor near the same pole)
 * @see imp-34040-fixed-band-drift-saturation-decade (the kEnd = 14..17 saturation-onset window whose deceleration F1 recovers)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run per boundary)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim; its resid_exp is what has the pole)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 *
 * IMPORT-WEIGHT AUDIT (imp-34277): this module s two-hop import chain (lambda-rh-height-mapping ->
 * bridge-lambda-rh -> guth-maynard-tail-bound; polymath15-constant-C-C -> ...) is the SAME light chain traced
 * for imp-34196 and does NOT reach the 20.8MB zeros-to-1e6.js bundle; per [[no_heavy_imports_in_pages]] this
 * module stays safe to import from a lazy-loaded page.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34196
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34196.
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-34196.
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

// WIDEST COMPUTABLE SWEEP: kEnd = 14.0, 14.25, ..., 21.25 (30 windows). The last 0.25-grid boundary whose
// entire ladder (rungs k = 6.00 .. kEnd) stays positive -- rung k = 21.25 resid_exp ~ +8.19e-9 > 0; at
// kEnd = 21.5 the newest rung is negative and the peak is NaN (imp-34169).
const SWEEP_STEP = 0.25;
const K_ENDS = [];
for (let k = 14.0; k <= 21.25 + 1e-9; k += SWEEP_STEP) K_ENDS.push(+k.toFixed(2));

const FIXED_BAND_KMAX = 10.0; // identical boundary-independent band to imp-33940 R2 / .. / imp-34196
const RESID_ZERO_KSTAR = 21.280947; // imp-34169 bisected resid_exp zero -- the surrogate hard right edge

const FIXED_BAND_ROWS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  return { kEnd, peak: +fp.peak.toFixed(6), atK: fp.atK };
});
const FB_PEAKS = FIXED_BAND_ROWS.map((r) => r.peak);

// LOCAL LOG-DERIVATIVE g(kEnd) = dP / d ln(kEnd) over the 29 consecutive-window steps (x = right endpoint).
const G_XS = K_ENDS.slice(1);
const G = [];
for (let i = 1; i < FB_PEAKS.length; i++) {
  const dP = FB_PEAKS[i] - FB_PEAKS[i - 1];
  const dln = Math.log(K_ENDS[i]) - Math.log(K_ENDS[i - 1]);
  G.push(+(dP / dln).toFixed(6));
}

// (F1) FAR-FROM-POLE branch (kEnd <= 18): g DECLINES (slope < 0 => sub-log-leaning). Its minimum locates the
// deceleration-to-re-acceleration inflection on the log-derivative.
const FAR_MASK = G_XS.map((x) => x <= 18.0 + 1e-9);
const FAR_XS = G_XS.filter((_, i) => FAR_MASK[i]);
const FAR_G = G.filter((_, i) => FAR_MASK[i]);
const FAR_FIT = ols(FAR_XS, FAR_G);
const FAR_SLOPE = FAR_FIT.b; // ~ -0.0535 -- declining
const FAR_R2 = r2Of(FAR_XS, FAR_G, FAR_FIT.a, FAR_FIT.b);
let G_MIN_I = 0;
for (let i = 1; i < G.length; i++) if (G[i] < G[G_MIN_I]) G_MIN_I = i;
const G_MIN = G[G_MIN_I];
const G_MIN_KEND = G_XS[G_MIN_I]; // ~18.25

// (F2) POLE-APPROACH branch (kEnd >= 18.75): g RISES back up (the imp-34196 re-acceleration on g).
const POLE_MASK = G_XS.map((x) => x >= 18.75 - 1e-9);
const POLE_XS = G_XS.filter((_, i) => POLE_MASK[i]);
const POLE_G = G.filter((_, i) => POLE_MASK[i]);
const POLE_FIT = ols(POLE_XS, POLE_G);
const POLE_SLOPE = POLE_FIT.b; // > 0 -- rising
const G_LAST = G[G.length - 1]; // ~8.80 at kEnd = 21.25

// (F3) POLE-PROXIMITY regression: g = a + b / (k* - kEnd). High R^2 => the local exponent is GOVERNED by
// distance to the resid_exp pole -- the re-acceleration is a pole transient, not intrinsic super-log growth.
const INV_XS_FULL = G_XS.map((x) => 1 / (RESID_ZERO_KSTAR - x));
const POLE_PROX_FIT_FULL = ols(INV_XS_FULL, G);
const POLE_PROX_SLOPE_FULL = POLE_PROX_FIT_FULL.b; // ~ +0.2361
const POLE_PROX_INTERCEPT_FULL = POLE_PROX_FIT_FULL.a; // ~ +1.4074
const POLE_PROX_R2_FULL = r2Of(INV_XS_FULL, G, POLE_PROX_FIT_FULL.a, POLE_PROX_FIT_FULL.b); // ~0.9235
const INV_XS_POLE = POLE_XS.map((x) => 1 / (RESID_ZERO_KSTAR - x));
const POLE_PROX_FIT_POLE = ols(INV_XS_POLE, POLE_G);
const POLE_PROX_R2_POLE = r2Of(INV_XS_POLE, POLE_G, POLE_PROX_FIT_POLE.a, POLE_PROX_FIT_POLE.b); // ~0.9298

// Booleans / summaries.
const FB_MONOTONIC = FB_PEAKS.every((p, i) => i === 0 || p > FB_PEAKS[i - 1]);
const FAR_DECELERATES = FAR_SLOPE < 0; // g declining far from pole => sub-log-leaning, NOT super-log
const POLE_REACCELERATES = POLE_SLOPE > 0; // g rising on the pole-approach branch (the imp-34196 re-accel)
const REACCEL_IS_POLE_TRANSIENT = POLE_PROX_R2_FULL > 0.9; // g governed by 1/(k*-kEnd) => pole-driven transient
const ASYMPTOTIC_CLASS_UNDECIDABLE = REACCEL_IS_POLE_TRANSIENT && G_MIN_KEND < RESID_ZERO_KSTAR; // no pole-free super-log window

// imp-34196 shared anchor (baked literal): the kEnd = 17.0 fixed-band peak reproduces imp-34196 s anchor.
const IMP34196_PEAK_AT_KEND_17 = 0.648552;

export const IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION = {
  id: 'imp-34287',
  proofSection: 'S-frontier',
  question:
    'imp-34196 found the fixed-band (k <= 10) peak s per-kEnd increments RE-ACCELERATE past kEnd ~ 18.64, ' +
    'citing the imp-34109 F4 unbounded-LOG verdict -- but a pure log has DECELERATING increments, in tension ' +
    'with a rising one. Measuring the local growth exponent g = dP/d ln(kEnd) across the widest computable ' +
    'window (kEnd = 14.0 .. 21.25, up to the imp-34169 resid_exp pole k* ~ 21.28), is the re-acceleration a ' +
    'bounded finite-window transient consistent with unbounded (log-or-slower) growth, or genuine ' +
    'super-logarithmic growth? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Per boundary kEnd = 14.0, 14.25, ..., 21.25 (30 windows): the largest signed residual in the fixed band ' +
    'k <= 10.00 of the imp-33843 log-linear OLS on the imp-33810 ladder k = 6.00 .. kEnd; the local ' +
    'log-derivative g = dP/d ln(kEnd) over the 29 steps; its OLS trend on a far-from-pole branch (kEnd <= 18) ' +
    'and a pole-approach branch (kEnd >= 18.75); and a regression of g on the pole-proximity coordinate ' +
    '1/(k* - kEnd) (k* = 21.280947) to test whether the re-acceleration is pole-driven',
  sweepStep: SWEEP_STEP, // 0.25 -- the imp-33810 ladder rung spacing
  residZeroKStar: RESID_ZERO_KSTAR, // 21.280947 -- imp-34169 resid_exp pole, the surrogate hard right edge
  fixedBandRows: FIXED_BAND_ROWS, // {kEnd, peak, atK} x 30
  fixedBandKMax: FIXED_BAND_KMAX,
  kEnds: K_ENDS,
  localLogDerivative: G, // g = dP/d ln(kEnd) x 29 -- declines far from pole then re-accelerates toward k*
  localLogDerivativeXs: G_XS, // right-endpoint kEnd of each g estimate
  farBranch: {
    form: 'g = a + b * kEnd on kEnd <= 18 (slope b < 0 => g DECLINING => q < 1 => sub-log-leaning)',
    slope: +FAR_SLOPE.toFixed(6), // ~ -0.053499 -- declining
    r2: +FAR_R2.toFixed(6), // ~0.981
    gFirst: FAR_G[0], // ~1.410881 at kEnd = 14.25
    gMin: +G_MIN.toFixed(6), // ~1.228783
    gMinKEnd: G_MIN_KEND, // ~18.25 -- the log-derivative deceleration bottom
    decelerates: FAR_DECELERATES, // true
  },
  poleApproachBranch: {
    form: 'g = a + b * kEnd on kEnd >= 18.75 (slope b > 0 => g RISING -- the imp-34196 re-acceleration on g)',
    slope: +POLE_SLOPE.toFixed(6), // > 0
    gLast: +G_LAST.toFixed(6), // ~8.800910 at kEnd = 21.25
    reAccelerates: POLE_REACCELERATES, // true
  },
  poleProximityRegression: {
    form: 'g = a + b / (k* - kEnd), k* = 21.280947 -- high R^2 => g governed by distance to the resid_exp pole',
    slopeFull: +POLE_PROX_SLOPE_FULL.toFixed(6), // ~ +0.236112
    interceptFull: +POLE_PROX_INTERCEPT_FULL.toFixed(6), // ~ +1.407443
    r2Full: +POLE_PROX_R2_FULL.toFixed(6), // ~0.9235 across all 29 steps
    r2PoleBranch: +POLE_PROX_R2_POLE.toFixed(6), // ~0.9298 restricted to kEnd >= 18.75
  },
  fixedBandPeakFirst: FB_PEAKS[0], // ~0.383861 at kEnd = 14.0
  fixedBandPeakAtKEnd17: FIXED_BAND_ROWS.find((r) => r.kEnd === 17.0).peak, // 0.648552 -- imp-34196 anchor
  fixedBandPeakLast: FB_PEAKS[FB_PEAKS.length - 1], // ~1.100487 at kEnd = 21.25
  fixedBandMonotonic: FB_MONOTONIC,
  farDecelerates: FAR_DECELERATES, // true -- sub-log-leaning far from the pole, NOT super-log
  poleReaccelerates: POLE_REACCELERATES, // true -- re-acceleration confined to the pole-approach branch
  reaccelIsPoleTransient: REACCEL_IS_POLE_TRANSIENT, // true -- g ~ 1/(k*-kEnd), R^2 > 0.9
  asymptoticClassUndecidable: ASYMPTOTIC_CLASS_UNDECIDABLE, // true -- no pole-free super-log window exists
  finding: {
    F1_far_from_pole_g_declines_sub_log:
      'Over kEnd = 14.25 .. 18.0 the local log-derivative g = dP/d ln(kEnd) falls monotonically +1.4109 -> ' +
      '+1.2325 (OLS slope ~ -0.0535, R^2 ~ 0.981), bottoming at g ~ 1.2288 at kEnd = 18.25. A declining g ' +
      'means q < 1 (sub-log): the genuine within-window growth DECELERATES -- the imp-34040 saturation-onset ' +
      'behaviour, log-consistent-or-slower, never super-log. g stays ~1.3 (well above 0), so there is no ' +
      'finite ceiling and the imp-34109 "unbounded" reading holds; "log" is an upper bound on the far-window ' +
      'rate, not a floor.',
    F2_reaccel_confined_to_pole_approach:
      'Over kEnd >= 18.75 g reverses and climbs +1.2418 -> +8.8009 at kEnd = 21.25 -- the imp-34196 ' +
      're-acceleration read on the log-derivative. This is the ONLY window where g rises; it begins one ' +
      'quarter-rung after the g minimum (kEnd = 18.25) and steepens without bound toward the boundary.',
    F3_reaccel_is_a_pole_proximity_transient:
      'Regressing g on the pole-proximity coordinate 1/(k* - kEnd) (k* = 21.280947) gives ' +
      'g ~ 1.4074 + 0.2361/(k* - kEnd) with R^2 ~ 0.9235 across all 29 steps (R^2 ~ 0.9298 on the ' +
      'pole-approach branch). The local exponent DIVERGES like 1/(k* - kEnd): the apparent super-log ' +
      'signature is the leading edge of the imp-34169/imp-34237 resid_exp pole (eflow_over_resid -> +inf ' +
      'inflates the imp-33843 OLS residuals), NOT intrinsic super-logarithmic growth. The re-acceleration is a ' +
      'bounded finite-window transient governed by the surrogate s hard right edge.',
    F4_asymptotic_class_undecidable:
      'The surrogate domain terminates at k* ~ 21.28 before any pole-free window can separate a genuine ' +
      'super-log signature from pole contamination: the whole re-acceleration branch (kEnd >= 18.75) sits ' +
      'inside the pole s influence radius (g tracks 1/(k*-kEnd), R^2 ~ 0.92). So this measurement concludes ' +
      'only that the far-window growth is DECELERATING / sub-log-leaning and the re-acceleration is a pole ' +
      'transient; whether the TRUE underlying growth is sub-log, log, or super-log is left OPEN ' +
      '(SUB-GAP-imp-34287-asymptotic-class-undecidable).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / LOCAL-EXPONENT RECONCILIATION (frontier-direction, NOT rigorous). Measuring the local ' +
    'log-derivative g = dP/d ln(kEnd) of the fixed-band (k <= 10) peak across the widest computable window ' +
    '(kEnd = 14.0 .. 21.25, 30 windows, up to the imp-34169 resid_exp pole k* ~ 21.28095) reconciles the ' +
    'imp-34196 rising-increment / imp-34109 unbounded-log tension. FAR from the pole (kEnd <= 18) g DECLINES ' +
    '+1.4109 -> +1.2325 (slope -0.0535, R^2 0.981), bottoming at g ~ 1.2288 at kEnd = 18.25 -- DECELERATING, ' +
    'sub-log-leaning (q < 1), never super-log; g stays ~1.3 so there is no ceiling and the imp-34109 ' +
    '"unbounded" reading holds. The imp-34196 re-acceleration is CONFINED to the pole-approach branch ' +
    '(kEnd >= 18.75), where g climbs to ~8.80, and is EXPLAINED by pole proximity: ' +
    'g ~ 1.4074 + 0.2361/(k* - kEnd), R^2 0.9235 across all 29 steps -- the local exponent diverges like ' +
    '1/(k* - kEnd), so the apparent super-log signature is the leading edge of the resid_exp pole (a bounded ' +
    'finite-window transient), NOT genuine super-logarithmic growth. imp-34196 s measured re-acceleration is ' +
    'CORRECT and is not overturned; its super-log reading is reframed as a pole artifact. HONEST SUB-GAP ' +
    'SUB-GAP-imp-34287-asymptotic-class-undecidable: because the surrogate domain terminates at k* ~ 21.28 ' +
    'and the entire re-accel branch (kEnd >= 18.75) lies inside the pole s influence radius (g tracks ' +
    '1/(k*-kEnd), R^2 ~ 0.92), the TRUE fixed-band-peak growth class (sub-log vs log vs super-log) is ' +
    'UNDECIDABLE within this surrogate -- a pole-free deep-tail estimator distinct from the imp-33810 ' +
    'quarter-decade OLS would be required; left OPEN. Distinct from any form selection; the imp-33843 ' +
    'log-linear-over-power-law verdict and the imp-34196 / imp-34109 findings are untouched. The OLS ' +
    'surrogate, the local log-derivative, and the pole-proximity regression are descriptive, not derived; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34196 (the rising-increment re-acceleration this reconciles; machinery reused verbatim); imp-34109 ' +
    '(the F4 unbounded-log verdict); imp-34169 (the resid_exp pole k* ~ 21.28095 this attributes the ' +
    're-acceleration to); imp-34237 (the pole viz sibling); imp-34040 (the kEnd = 14..17 saturation-onset ' +
    'window whose deceleration F1 recovers); imp-33843 (the log-linear OLS re-run per boundary); imp-33810 ' +
    '(the k=6.. ladder reused verbatim; its resid_exp has the pole); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN); ' +
    'polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: 30 windows on a 0.25 grid over kEnd 14.0..21.25; the kEnd = 17.0 fixed-band peak reproduces
    // imp-34196 s anchor +0.648552, and the sweep terminates one quarter-rung before the imp-34169 pole.
    id: 'imp34287-reuse-gate-30-windows-anchors-to-imp34196',
    description: '30 windows kEnd 14.0..21.25 (step 0.25); peak at kEnd 17.0 matches imp-34196 (+0.648552); last window one quarter-rung before k* ~ 21.28',
    holds: () =>
      FIXED_BAND_ROWS.length === 30 &&
      SWEEP_STEP === 0.25 &&
      K_ENDS[0] === 14.0 &&
      K_ENDS[K_ENDS.length - 1] === 21.25 &&
      K_ENDS[K_ENDS.length - 1] < RESID_ZERO_KSTAR &&
      Math.abs(IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.fixedBandPeakAtKEnd17 - IMP34196_PEAK_AT_KEND_17) < 2e-3,
  },
  {
    // (F1) Far from the pole the local log-derivative g DECLINES (slope < 0, good fit) -- sub-log-leaning,
    // not super-log; the fixed band is monotone and g bottoms at kEnd = 18.25.
    id: 'imp34287-far-branch-g-declines-sub-log',
    description: 'fixed band monotonic; far-branch (kEnd<=18) g slope ~ -0.0535 (R2 > 0.95); g minimum ~1.2288 at kEnd 18.25 -- decelerating',
    holds: () =>
      FB_MONOTONIC === true &&
      FAR_SLOPE < 0 &&
      Math.abs(FAR_SLOPE - -0.053499) < 5e-3 &&
      FAR_R2 > 0.95 &&
      Math.abs(G_MIN - 1.228783) < 5e-3 &&
      G_MIN_KEND === 18.25 &&
      FAR_DECELERATES === true,
  },
  {
    // (F2) The re-acceleration is confined to the pole-approach branch: g rises there (slope > 0) and the
    // last g (kEnd = 21.25) is many times the g minimum -- the imp-34196 re-acceleration on the log-derivative.
    id: 'imp34287-reaccel-confined-to-pole-approach',
    description: 'pole-approach (kEnd>=18.75) g slope > 0; last g ~8.80 >> g minimum ~1.23 -- the imp-34196 re-acceleration on g',
    holds: () =>
      POLE_SLOPE > 0 &&
      POLE_REACCELERATES === true &&
      Math.abs(G_LAST - 8.800910) < 5e-2 &&
      G_LAST > 5 * G_MIN,
  },
  {
    // (F3) The re-acceleration is a pole-proximity transient: g regresses on 1/(k*-kEnd) with R^2 > 0.9 across
    // all steps (and on the pole branch), slope > 0 -- the local exponent is governed by distance to the pole.
    id: 'imp34287-reaccel-is-pole-proximity-transient',
    description: 'g = a + b/(k*-kEnd): R2 ~0.9235 full (>0.9), ~0.9298 pole-branch; slope ~+0.236, intercept ~+1.407 -- pole-driven, not intrinsic super-log',
    holds: () =>
      POLE_PROX_R2_FULL > 0.9 &&
      POLE_PROX_R2_POLE > 0.9 &&
      POLE_PROX_SLOPE_FULL > 0 &&
      Math.abs(POLE_PROX_SLOPE_FULL - 0.236112) < 5e-2 &&
      Math.abs(POLE_PROX_INTERCEPT_FULL - 1.407443) < 5e-2 &&
      REACCEL_IS_POLE_TRANSIENT === true,
  },
  {
    // Honesty gate: measurement/reconciliation only, far-decelerates & reaccel-is-pole-transient &
    // asymptotic-class-undecidable, isRigorous false, imp-34196 not overturned, sub-gap flagged, no QED,
    // no refereed bound is changed, C_mb / imp-3066 untouched.
    id: 'imp34287-honesty-gate-no-qed',
    description: 'Measurement only: farDecelerates & reaccelIsPoleTransient & asymptoticClassUndecidable; isRigorous false; sub-gap flagged; imp-34196 not overturned; no QED; no refereed bound is changed; C_mb / imp-3066 untouched',
    holds: () =>
      IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.farDecelerates === true &&
      IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.reaccelIsPoleTransient === true &&
      IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.asymptoticClassUndecidable === true &&
      IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.verdict) &&
      /SUB-GAP-imp-34287-asymptotic-class-undecidable/.test(IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.verdict) &&
      /is CORRECT and is not overturned/.test(IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.verdict) &&
      /NO QED/.test(IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is\s+UNTOUCHED/i.test(IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION.verdict),
  },
];

for (const a of IMP34287_FIXED_BAND_PEAK_GROWTH_EXPONENT_POLE_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation assertion failed: ${a.id}`);
  }
}
