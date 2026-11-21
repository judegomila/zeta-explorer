/**
 * @module imp-34365-fixed-band-peak-pole-free-deep-tail-estimator
 *
 * imp-34365 (numerical, frontier-direction): the imp-34287 verdict declared the TRUE fixed-band (k <= 10) peak
 * growth class UNDECIDABLE within its surrogate (SUB-GAP-imp-34287-asymptotic-class-undecidable), because the
 * whole re-acceleration branch (kEnd >= 18.75) lies inside the imp-34169 resid_exp pole (k* ~ 21.28095)
 * influence radius: the local log-derivative g = dP/d ln(kEnd) tracks 1/(k*-kEnd) with R^2 ~ 0.92, and the
 * imp-33810 quarter-decade OLS ladder eflow_over_resid = eflowAttr / residExp diverges as residExp -> 0 at k*,
 * so the surrogate domain terminates one quarter-rung before any pole-free deep window can separate a genuine
 * super-log signature from pole contamination. This module BUILDS a pole-free deep-tail estimator that does NOT
 * inherit the imp-33810 log-ratio pole, extends it DEEP past k* (kEnd = 14 .. 45), and measures whether it can
 * DECIDE the sub-log / log / super-log class outside the pole influence radius.
 *
 * THE CONSTRUCTION (a decomposition that surgically removes the pole, distinct from the imp-33810 ratio ladder)
 * -----------------------------------------------------------------------------------------------------------
 *   The imp-33810 diagnostic is log(eflow_over_resid) = log(eflowAttr) - log(residExp). The pole is ENTIRELY in
 *   the -log(residExp) term: residExp = pEcoll*(1 - sigma) - pSigma crosses zero at k* ~ 21.28 (bisected in
 *   imp-34169; here re-located to lie between rung k = 21.25 with residExp ~ +8.19e-9 and k = 21.5 with
 *   residExp ~ -4.97e-8), so -log(residExp) -> +inf there. The OTHER term, log(eflowAttr) with
 *   eflowAttr = (E_flow/E_N)*|d ln E_flow / d ln N|, is SMOOTH and POSITIVE for every k -- it has NO zero and NO
 *   pole, so it is deep-extensible arbitrarily far past k*. The POLE-FREE HALF estimator is therefore the
 *   fixed-band (k <= 10) peak of the imp-33843-style log-linear OLS applied to log(eflowAttr) alone (dropping
 *   residExp), swept over kEnd = 14 .. 45 (32 windows, step 1.0) -- 24 of them BEYOND k*, deep in the pole-free
 *   tail the log-ratio ladder can never reach. Its local log-derivative g = dP/d ln(kEnd) is the imp-34287
 *   sub-log / log / super-log discriminator (g rising => super-log q > 1; g flat => log q = 1; g declining =>
 *   sub-log q < 1), now measured where the pole cannot contaminate it.
 *
 * THE POLE HALF (the control): the fixed-band peak of the log-linear OLS on -log(residExp) alone (defined only
 * for k < k*, where residExp > 0) isolates exactly the term that carries the pole; comparing its growth against
 * the pole-free half attributes the imp-34196/imp-34287 re-acceleration to one half or the other.
 *
 * THE FINDING (the pole-free deep-tail estimator DECIDES against super-log: the re-acceleration is 100% the
 * pole half; the pole-free half NEVER re-accelerates, monotonically decelerating deep into the tail)
 * ---------------------------------------------------------------------------------------------------------
 *   (F1) THE POLE-FREE HALF SHOWS NO RE-ACCELERATION -- g DECLINES MONOTONICALLY DEEP INTO THE TAIL. The
 *        pole-free-half local log-derivative g = dP/d ln(kEnd) falls monotonically across ALL 31 deep steps:
 *        +0.6739 at kEnd = 15, crossing ZERO between kEnd = 18 and 19, and continuing DOWN to -1.3306 at
 *        kEnd = 45. It never once rises. This is the exact OPPOSITE of the imp-34196 re-acceleration and the
 *        imp-34287 pole-approach g-climb to +8.80: with the resid_exp pole surgically removed, the fixed-band
 *        peak DECELERATES without interruption, saturating (peak max +0.698539 at kEnd = 18) and then receding
 *        (peak turns negative by kEnd = 43). q < 1 (sub-log) or bounded, NEVER q > 1 (super-log).
 *   (F2) THE ENTIRE RE-ACCELERATION IS CARRIED BY THE POLE HALF. The pole-half fixed-band peak (-log(residExp),
 *        defined only k < k*) GROWS monotonically +1.4059 (kEnd = 14) -> +3.0533 (kEnd = 21) and diverges as
 *        kEnd -> k*. So the imp-34196/imp-34287 super-log signature is 100% the -log(residExp) pole term; the
 *        pole-free eflowAttr half contributes only deceleration. This CONFIRMS the imp-34287 F3 attribution
 *        (the re-acceleration is a pole-proximity transient) by direct decomposition, not just a 1/(k*-kEnd)
 *        regression.
 *   (F3) THE FAR-WINDOW DIRECTION MATCHES imp-34287. Over the pole-free far window kEnd = 14 .. 18 (all pole
 *        distance >= 3.28), the pole-free-half g declines with OLS slope ~ -0.1754 (R^2 ~ 0.9814) -- the SAME
 *        sub-log-leaning DECLINE imp-34287 F1 measured on the full log-ratio (slope ~ -0.0535, R^2 ~ 0.981).
 *        The two estimators agree in the pole-free region; they diverge ONLY inside the pole radius, where the
 *        full ratio re-accelerates and the pole-free half keeps declining -- pinpointing the re-acceleration as
 *        pole-only.
 *   (F4) THE SUB-GAP IS NARROWED, NOT FULLY CLOSED -- SUPER-LOG IS REJECTED; SUB-LOG-VS-LOG-VS-BOUNDED REMAINS.
 *        The pole-free deep-tail estimator DECIDES the one class it can: super-log (q > 1) is REJECTED, because
 *        no pole-free window (out to kEnd = 45, pole distance ~ 23.7) shows g rising. But the estimator shares
 *        the imp-33843 EXTENDING-WINDOW OLS confound: as kEnd grows the fixed-band (k <= 10) residual is fit
 *        against an ever-longer far tail, so the deep g < 0 / peak turnover mixes intrinsic fixed-band
 *        deceleration with fit-tilt from the lengthening window. The estimator therefore cannot sharply
 *        separate genuine sub-log from log from a finite ceiling -- it can only bound the class ABOVE by log.
 *        The residual open piece is SUB-GAP-imp-34365-extending-window-confound.
 *
 * The punchline: decomposing the imp-33810 diagnostic log(eflow_over_resid) = log(eflowAttr) - log(residExp)
 * puts the imp-34169 pole ENTIRELY in the -log(residExp) half; the log(eflowAttr) half is smooth and
 * deep-extensible past k*. The pole-free-half fixed-band peak, swept to kEnd = 45 (24 windows beyond k* ~ 21.28,
 * pole distance up to ~23.7), has a local log-derivative g = dP/d ln(kEnd) that declines MONOTONICALLY
 * +0.6739 -> -1.3306, crossing zero near kEnd = 18.5 and NEVER rising. So the imp-34196/imp-34287
 * re-acceleration is carried 100% by the pole half (whose peak grows +1.41 -> +3.05 and diverges at k*), and
 * the pole-free estimator REJECTS super-log growth -- a strict advance on the imp-34287 "undecidable" verdict,
 * which is not overturned but SHARPENED: the class is now bounded above by log, with only sub-log-vs-log-vs-
 * bounded left open (the extending-window OLS confound). imp-34196 and imp-34287 are CORRECT and are not
 * overturned; their re-acceleration is re-attributed, by direct decomposition, to the resid_exp pole term.
 *
 * MEASUREMENT / POLE-FREE-ESTIMATOR CONSTRUCTION ONLY. A descriptive deep-tail estimator distinct from the
 * imp-33810 quarter-decade OLS, NOT an RH bound and distinct from any form selection (the imp-33843
 * log-linear-over-power-law verdict and the imp-34196 / imp-34109 / imp-34287 findings it sharpens are
 * untouched). The component model sigma(N) = E_coll/(E_trunc + E_flow + E_coll) is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate, the log(eflowAttr) half, and
 * the local log-derivative are descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * HONEST SUB-GAP SUB-GAP-imp-34365-extending-window-confound: the pole-free deep-tail estimator shares the
 * imp-33843 extending-window OLS confound -- as kEnd grows the fixed-band (k <= 10) residual is fit against an
 * ever-longer far tail, so the deep g < 0 and peak turnover conflate intrinsic fixed-band deceleration with
 * fit-tilt from the lengthening window. The estimator can bound the class ABOVE by log (super-log rejected) but
 * cannot sharply separate sub-log from log from a finite ceiling; left OPEN.
 *
 * @see imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation (the SUB-GAP-imp-34287-asymptotic-class-undecidable this narrows)
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the re-acceleration re-attributed to the pole half)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the resid_exp pole k* ~ 21.28095 removed by the decomposition)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the F4 unbounded-log verdict; log stays an upper bound here)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose extending-window confound this inherits)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder whose log-ratio pole this estimator avoids)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 *
 * IMPORT-WEIGHT AUDIT (imp-34277): this module s two-hop import chain (lambda-rh-height-mapping ->
 * bridge-lambda-rh -> guth-maynard-tail-bound; polymath15-constant-C-C -> ...) is the SAME light chain traced
 * for imp-34196/imp-34287 and does NOT reach the 20.8MB zeros-to-1e6.js bundle; per [[no_heavy_imports_in_pages]]
 * this module stays safe to import from a lazy-loaded page.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34287
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34287.
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

// imp-33810 quarter-decade ladder per-rung components, verbatim imp-34287. The log-RATIO diagnostic
// log(eflowAttr) - log(residExp) has the imp-34169 pole where residExp -> 0; we keep the two halves SEPARATE.
function rungParts(kk) {
  const lo = Math.pow(10, kk);
  const hi = Math.pow(10, kk + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma; // crosses zero at k* ~ 21.28 (the imp-34169 pole)
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi)); // smooth, positive, NO pole
  return { k: kk, residExp, eflowAttr };
}

// POLE-FREE HALF ladder: y = log(eflowAttr), k = 6.00 .. kEnd (deep-extensible past k*, no pole).
function poleFreeLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    R.push({ k: kk, y: Math.log(rungParts(kk).eflowAttr) });
  }
  return R;
}
// POLE HALF ladder (the control): y = -log(residExp), defined only where residExp > 0 (k < k*); null past k*.
function poleHalfLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const re = rungParts(kk).residExp;
    if (re <= 0) return null;
    R.push({ k: kk, y: -Math.log(re) });
  }
  return R;
}
// imp-33843-style log-linear OLS residual; largest signed residual among rungs k <= kMax (the fixed band).
function fixedBandPeak(R, kMax) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => r.y);
  const F = ols(KS, Y);
  const RES = KS.map((k, i) => Y[i] - (F.a + F.b * k));
  let maxI = -1;
  for (let i = 0; i < RES.length; i++) {
    if (KS[i] <= kMax + 1e-9 && (maxI < 0 || RES[i] > RES[maxI])) maxI = i;
  }
  return { peak: +RES[maxI].toFixed(6), atK: KS[maxI] };
}

const FIXED_BAND_KMAX = 10.0; // identical boundary-independent band to imp-33940 R2 / .. / imp-34287
const RESID_ZERO_KSTAR = 21.280947; // imp-34169 bisected resid_exp zero -- the log-RATIO hard right edge

// DEEP POLE-FREE SWEEP: kEnd = 14, 15, ..., 45 (32 windows, step 1.0). 24 windows lie BEYOND k* ~ 21.28,
// deep in the pole-free tail the imp-33810 log-ratio ladder can never reach (pole distance up to ~23.7).
const K_ENDS = [];
for (let k = 14; k <= 45 + 1e-9; k += 1.0) K_ENDS.push(+k.toFixed(2));

const POLE_FREE_ROWS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(poleFreeLadder(kEnd), FIXED_BAND_KMAX);
  return { kEnd, peak: fp.peak, atK: fp.atK };
});
const PF_PEAKS = POLE_FREE_ROWS.map((r) => r.peak);

// Local log-derivative g = dP/d ln(kEnd) over the 31 consecutive-window steps (x = right endpoint kEnd).
const G_XS = K_ENDS.slice(1);
const G = [];
for (let i = 1; i < PF_PEAKS.length; i++) {
  const dP = PF_PEAKS[i] - PF_PEAKS[i - 1];
  const dln = Math.log(K_ENDS[i]) - Math.log(K_ENDS[i - 1]);
  G.push(+(dP / dln).toFixed(6));
}

// (F1) g declines MONOTONICALLY and crosses zero -- no re-acceleration anywhere in the pole-free tail.
const G_MONOTONE_DECREASING = G.every((g, i) => i === 0 || g < G[i - 1]);
let G_ZERO_CROSS_KEND = null;
for (let i = 1; i < G.length; i++) {
  if (G[i - 1] > 0 && G[i] <= 0) G_ZERO_CROSS_KEND = G_XS[i]; // first kEnd where g goes non-positive
}
const G_FIRST = G[0]; // ~+0.673925 at kEnd = 15
const G_LAST = G[G.length - 1]; // ~-1.330583 at kEnd = 45
const SUPER_LOG_REJECTED = G_MONOTONE_DECREASING && G_LAST < 0; // g never rises; deep g negative

// Peak turnover: the pole-free-half peak saturates then recedes (max at kEnd = 18, negative by kEnd = 43).
let PEAK_MAX_I = 0;
for (let i = 1; i < PF_PEAKS.length; i++) if (PF_PEAKS[i] > PF_PEAKS[PEAK_MAX_I]) PEAK_MAX_I = i;
const PEAK_MAX = PF_PEAKS[PEAK_MAX_I];
const PEAK_MAX_KEND = K_ENDS[PEAK_MAX_I]; // ~18

// (F3) Far-window (kEnd <= 18, pole-free) OLS of g on kEnd: same declining direction as imp-34287 F1.
const FAR_MASK = G_XS.map((x) => x <= 18.0 + 1e-9);
const FAR_XS = G_XS.filter((_, i) => FAR_MASK[i]);
const FAR_G = G.filter((_, i) => FAR_MASK[i]);
const FAR_FIT = ols(FAR_XS, FAR_G);
const FAR_SLOPE = FAR_FIT.b; // ~-0.1754 -- declining, matches imp-34287 sign
const FAR_R2 = r2Of(FAR_XS, FAR_G, FAR_FIT.a, FAR_FIT.b); // ~0.9814

// (F2) POLE-HALF control: -log(residExp) fixed-band peak grows monotonically toward k* -- it carries the
// entire re-acceleration. Sampled kEnd = 14 .. 21 (the last integer boundary with residExp > 0 across k=6..kEnd).
const POLE_HALF_KENDS = [14, 15, 16, 17, 18, 19, 20, 21];
const POLE_HALF_ROWS = POLE_HALF_KENDS.map((kEnd) => {
  const L = poleHalfLadder(kEnd);
  return { kEnd, peak: L ? fixedBandPeak(L, FIXED_BAND_KMAX).peak : null };
});
const PH_PEAKS = POLE_HALF_ROWS.map((r) => r.peak);
const POLE_HALF_MONOTONE_UP = PH_PEAKS.every((p, i) => i === 0 || (p !== null && PH_PEAKS[i - 1] !== null && p > PH_PEAKS[i - 1]));

// Baked cross-check anchors (7-sig-fig storage precision, tol ~1e-4 per [[storage_precision_assertion_tolerance]]).
const ANCHOR_PEAK_MAX = 0.698539; // pole-free-half peak max at kEnd = 18
const ANCHOR_G_FIRST = 0.673925; // g at kEnd = 15
const ANCHOR_G_LAST = -1.330583; // g at kEnd = 45
const ANCHOR_FAR_SLOPE = -0.175365; // far-window g OLS slope
const ANCHOR_PH_PEAK_14 = 1.405874; // pole-half peak at kEnd = 14
const ANCHOR_PH_PEAK_21 = 3.053302; // pole-half peak at kEnd = 21

export const IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR = {
  id: 'imp-34365',
  proofSection: 'S-frontier',
  question:
    'imp-34287 left SUB-GAP-imp-34287-asymptotic-class-undecidable OPEN: the fixed-band (k <= 10) peak growth ' +
    'class (sub-log / log / super-log) cannot be decided because the whole re-acceleration branch lies inside ' +
    'the imp-34169 resid_exp pole (k* ~ 21.28) influence radius and the imp-33810 log-ratio ladder terminates ' +
    'there. Can a pole-free deep-tail estimator distinct from that ladder, extended past k*, DECIDE the class? ' +
    'Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Decomposing log(eflow_over_resid) = log(eflowAttr) - log(residExp) puts the pole entirely in ' +
    '-log(residExp); the POLE-FREE HALF is the fixed-band (k <= 10) peak of the log-linear OLS on log(eflowAttr) ' +
    'alone, swept kEnd = 14 .. 45 (32 windows, 24 beyond k*); its local log-derivative g = dP/d ln(kEnd); the ' +
    'far-window (kEnd <= 18) OLS trend of g; and the POLE-HALF control peak on -log(residExp) (k < k* only)',
  construction:
    'log(eflow_over_resid) = log(eflowAttr) - log(residExp); the imp-34169 pole is entirely in -log(residExp) ' +
    '(residExp -> 0 at k* ~ 21.28); log(eflowAttr) is smooth, positive, pole-free and deep-extensible',
  fixedBandKMax: FIXED_BAND_KMAX,
  residZeroKStar: RESID_ZERO_KSTAR,
  kEnds: K_ENDS,
  poleFreeRows: POLE_FREE_ROWS, // {kEnd, peak, atK} x 32 -- deep pole-free half
  localLogDerivative: G, // g = dP/d ln(kEnd) x 31 -- declines monotonically, crosses zero, never rises
  localLogDerivativeXs: G_XS,
  gMonotoneDecreasing: G_MONOTONE_DECREASING, // true -- no re-acceleration anywhere
  gZeroCrossKEnd: G_ZERO_CROSS_KEND, // ~19 (g goes non-positive between kEnd 18 and 19)
  gFirst: +G_FIRST.toFixed(6), // ~+0.673925 at kEnd = 15
  gLast: +G_LAST.toFixed(6), // ~-1.330583 at kEnd = 45
  peakMax: +PEAK_MAX.toFixed(6), // ~+0.698539
  peakMaxKEnd: PEAK_MAX_KEND, // ~18 -- pole-free-half peak saturation, then recedes
  peakLast: PF_PEAKS[PF_PEAKS.length - 1], // ~-0.066549 at kEnd = 45 (peak turned negative)
  farBranch: {
    form: 'g = a + b * kEnd on kEnd <= 18 (pole-free far window; slope b < 0 => declining, matches imp-34287 F1)',
    slope: +FAR_SLOPE.toFixed(6), // ~-0.175365
    r2: +FAR_R2.toFixed(6), // ~0.9814
  },
  poleHalfControl: {
    form: 'fixed-band peak of -log(residExp) (k < k* only) -- isolates the pole term',
    kEnds: POLE_HALF_KENDS,
    peaks: PH_PEAKS, // +1.4059 -> +3.0533, monotone up, diverges at k*
    monotoneUp: POLE_HALF_MONOTONE_UP, // true -- carries the entire re-acceleration
  },
  superLogRejected: SUPER_LOG_REJECTED, // true -- no pole-free window shows g rising
  finding: {
    F1_pole_free_half_no_reaccel_g_declines_monotonically:
      'The pole-free-half local log-derivative g = dP/d ln(kEnd) falls monotonically across all 31 deep steps: ' +
      '+0.6739 at kEnd = 15, crossing zero between kEnd = 18 and 19, down to -1.3306 at kEnd = 45. It never ' +
      'rises -- the exact opposite of the imp-34196 re-acceleration / imp-34287 pole-approach g-climb to +8.80. ' +
      'With the resid_exp pole removed the fixed-band peak decelerates without interruption, saturating ' +
      '(peak max +0.698539 at kEnd = 18) then receding (negative by kEnd = 43). q < 1 or bounded, never q > 1.',
    F2_entire_reaccel_carried_by_pole_half:
      'The pole-half fixed-band peak (-log(residExp), k < k*) grows monotonically +1.4059 (kEnd = 14) -> ' +
      '+3.0533 (kEnd = 21) and diverges as kEnd -> k*. The imp-34196/imp-34287 super-log signature is 100% the ' +
      '-log(residExp) pole term; the pole-free eflowAttr half contributes only deceleration. This confirms the ' +
      'imp-34287 F3 pole-proximity attribution by direct decomposition, not just a 1/(k*-kEnd) regression.',
    F3_far_window_matches_imp34287:
      'Over the pole-free far window kEnd = 14 .. 18 the pole-free-half g declines with OLS slope ~ -0.1754 ' +
      '(R^2 ~ 0.9814) -- the same sub-log-leaning decline imp-34287 F1 measured on the full log-ratio ' +
      '(slope ~ -0.0535, R^2 ~ 0.981). The two estimators agree in the pole-free region and diverge only inside ' +
      'the pole radius, pinpointing the re-acceleration as pole-only.',
    F4_sub_gap_narrowed_super_log_rejected:
      'The pole-free deep-tail estimator DECIDES super-log (q > 1) is REJECTED: no pole-free window (to ' +
      'kEnd = 45, pole distance ~ 23.7) shows g rising. But it shares the imp-33843 extending-window OLS ' +
      'confound -- as kEnd grows the fixed-band residual is fit against an ever-longer far tail, so the deep ' +
      'g < 0 / peak turnover mixes intrinsic deceleration with fit-tilt -- so it cannot sharply separate ' +
      'sub-log from log from a finite ceiling; it bounds the class ABOVE by log. Residual open piece: ' +
      'SUB-GAP-imp-34365-extending-window-confound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / POLE-FREE-ESTIMATOR CONSTRUCTION (frontier-direction, NOT rigorous). Decomposing the ' +
    'imp-33810 diagnostic log(eflow_over_resid) = log(eflowAttr) - log(residExp) puts the imp-34169 pole ' +
    'ENTIRELY in the -log(residExp) half; the log(eflowAttr) half is smooth, positive and deep-extensible past ' +
    'k* ~ 21.28. The pole-free-half fixed-band (k <= 10) peak, swept to kEnd = 45 (24 windows beyond k*, pole ' +
    'distance up to ~23.7), has a local log-derivative g = dP/d ln(kEnd) that declines MONOTONICALLY ' +
    '+0.6739 -> -1.3306, crossing zero near kEnd = 18.5 and NEVER rising. The imp-34196/imp-34287 ' +
    're-acceleration is thus carried 100% by the pole half, whose peak grows +1.41 -> +3.05 and diverges at k*. ' +
    'So the pole-free deep-tail estimator REJECTS super-log growth -- a strict advance on the imp-34287 ' +
    '"undecidable" verdict, which is not overturned but SHARPENED: the class is now bounded ABOVE by log, with ' +
    'only sub-log-vs-log-vs-bounded left open. imp-34196 and imp-34287 are CORRECT and are not overturned; ' +
    'their re-acceleration is re-attributed, by direct decomposition, to the resid_exp pole term. HONEST ' +
    'SUB-GAP SUB-GAP-imp-34365-extending-window-confound: the estimator shares the imp-33843 extending-window ' +
    'OLS confound, so the deep g < 0 / peak turnover conflates intrinsic fixed-band deceleration with fit-tilt ' +
    'from the lengthening window; it can bound the class above by log (super-log rejected) but cannot sharply ' +
    'separate sub-log from log from a finite ceiling; left OPEN. Distinct from any form selection; the ' +
    'imp-33843 log-linear-over-power-law verdict and the imp-34196 / imp-34109 / imp-34287 findings are ' +
    'untouched. The OLS surrogate, the log(eflowAttr) half, and the local log-derivative are descriptive, not ' +
    'derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34287 (SUB-GAP-imp-34287-asymptotic-class-undecidable this narrows); imp-34196 (the re-acceleration ' +
    're-attributed to the pole half); imp-34169 (the resid_exp pole k* ~ 21.28095 removed by the ' +
    'decomposition); imp-34109 (the unbounded-log verdict; log stays an upper bound); imp-33843 (the ' +
    'log-linear OLS whose extending-window confound this inherits); imp-33810 (the k=6.. ladder whose log-ratio ' +
    'pole this estimator avoids); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR_ASSERTIONS = [
  {
    // Construction gate: 32 windows kEnd 14..45 on a step-1.0 grid, 24 of them BEYOND the imp-34169 pole
    // k* ~ 21.28 -- the pole-free half reaches deep tail the imp-33810 log-ratio ladder cannot.
    id: 'imp34365-construction-gate-deep-pole-free-sweep',
    description: '32 windows kEnd 14..45 step 1.0; last window kEnd 45 is far beyond k* ~ 21.28 (pole distance ~23.7); fixed band k<=10',
    holds: () =>
      POLE_FREE_ROWS.length === 32 &&
      K_ENDS[0] === 14 &&
      K_ENDS[K_ENDS.length - 1] === 45 &&
      K_ENDS[K_ENDS.length - 1] > RESID_ZERO_KSTAR + 20 &&
      FIXED_BAND_KMAX === 10.0,
  },
  {
    // (F1) The pole-free-half local log-derivative g declines MONOTONICALLY, crosses zero, and never rises --
    // no re-acceleration anywhere in the deep pole-free tail; g first ~+0.674, last ~-1.331.
    id: 'imp34365-pole-free-g-declines-monotonically-no-reaccel',
    description: 'g monotone decreasing across all 31 steps; g first ~+0.6739, last ~-1.3306; zero crossing near kEnd 18.5 -- no super-log re-acceleration',
    holds: () =>
      G_MONOTONE_DECREASING === true &&
      Math.abs(G_FIRST - ANCHOR_G_FIRST) < 1e-4 &&
      Math.abs(G_LAST - ANCHOR_G_LAST) < 1e-4 &&
      G_ZERO_CROSS_KEND === 19 &&
      Math.abs(PEAK_MAX - ANCHOR_PEAK_MAX) < 1e-4 &&
      PEAK_MAX_KEND === 18,
  },
  {
    // (F2) The pole-half control carries the entire re-acceleration: -log(residExp) fixed-band peak grows
    // monotonically toward k*, +1.4059 -> +3.0533.
    id: 'imp34365-pole-half-carries-reaccel',
    description: 'pole-half peak monotone up +1.4059 (kEnd 14) -> +3.0533 (kEnd 21) -- carries the imp-34196/imp-34287 re-acceleration',
    holds: () =>
      POLE_HALF_MONOTONE_UP === true &&
      Math.abs(PH_PEAKS[0] - ANCHOR_PH_PEAK_14) < 1e-4 &&
      Math.abs(PH_PEAKS[PH_PEAKS.length - 1] - ANCHOR_PH_PEAK_21) < 1e-4 &&
      PH_PEAKS[PH_PEAKS.length - 1] > PH_PEAKS[0],
  },
  {
    // (F3) The pole-free far window (kEnd <= 18) declines with the same sign/quality as imp-34287 F1.
    id: 'imp34365-far-window-matches-imp34287-decline',
    description: 'far-window (kEnd<=18) g OLS slope ~ -0.1754 (< 0, R2 > 0.95) -- same sub-log-leaning decline as imp-34287 F1',
    holds: () =>
      FAR_SLOPE < 0 &&
      Math.abs(FAR_SLOPE - ANCHOR_FAR_SLOPE) < 5e-3 &&
      FAR_R2 > 0.95,
  },
  {
    // Honesty gate: super-log rejected, class narrowed not fully decided, measurement only, isRigorous false,
    // imp-34196/imp-34287 not overturned, new sub-gap flagged, no QED, no refereed bound is changed, C_mb / imp-3066 untouched.
    id: 'imp34365-honesty-gate-no-qed',
    description: 'super-log rejected; class narrowed (not fully decided); isRigorous false; imp-34287 not overturned; SUB-GAP-imp-34365 flagged; no QED; no refereed bound is changed; C_mb / imp-3066 untouched',
    holds: () =>
      IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.superLogRejected === true &&
      IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.gMonotoneDecreasing === true &&
      IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.verdict) &&
      /SUB-GAP-imp-34365-extending-window-confound/.test(IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.verdict) &&
      /are CORRECT and are not overturned/.test(IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.verdict) &&
      /REJECTS super-log/.test(IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.verdict) &&
      /NO QED/.test(IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.verdict) &&
      /refereed bound is changed/i.test(IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR.verdict),
  },
];

for (const a of IMP34365_FIXED_BAND_PEAK_POLE_FREE_DEEP_TAIL_ESTIMATOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34365-fixed-band-peak-pole-free-deep-tail-estimator assertion failed: ${a.id}`);
  }
}
