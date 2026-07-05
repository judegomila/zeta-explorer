/**
 * @module imp-34040-fixed-band-drift-saturation-decade
 *
 * imp-34040 (numerical, frontier-direction): imp-33987 extended the imp-33940 R2 fixed-band (k <= 10)
 * convex residual-drift sweep across kEnd = 11.0 .. 14.0 (7 windows) and found the drift PERSISTS and is
 * strongly super-linear -- all second differences strictly positive, a power-law growth exponent p ~ 4.41
 * (R^2 ~ 0.9985), and a band argmax rung creeping inward k = 7.00 -> 6.50. But imp-33987 stopped at
 * kEnd = 14 and could not tell whether that convex / super-linear drift SATURATES or keeps accelerating,
 * nor whether the argmax rung keeps creeping past 6.50. This module pushes the SAME inherited
 * imp-33810/imp-33940/imp-33987 machinery one further decade of N, kEnd in {14.0, 14.5, ..., 17.0}
 * (7 windows), and re-tests: (a) do the second differences stay positive (convex drift persists) or turn
 * negative (onset of saturation)?; (b) is the power-law exponent p stable near 4.41 or does it collapse?;
 * (c) does the band argmax rung keep creeping past 6.50?
 *
 * THE MEASUREMENT (imp-33987 machinery reused verbatim; only the kEnd grid shifts one decade)
 * ------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-33917/imp-33940/imp-33987. No re-derivation.
 *   Boundary sweep   kEnd = 14.0, 14.5, ..., 17.0 (7 fit windows), the immediate one-decade continuation
 *                    of imp-33987 s kEnd = 11.0 .. 14.0 grid (same 0.5 step). kEnd = 14 is the shared
 *                    endpoint, so its fixed-band peak reproduces imp-33987 s last anchor +0.383861.
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 R2 / imp-33987 tracked, present in every window.
 *   Growth fits      the 7 fixed-band peaks are fit as peak ~ A kEnd^p (power law, log-log OLS), as
 *                    peak ~ A exp(b kEnd) (exponential, log-linear OLS), and as a plain linear contrast --
 *                    the identical three families imp-33987 scored, so the exponent p is directly
 *                    comparable across the two decades.
 *
 * THE FINDING (measurement only -- the convex drift DOES NOT persist: it SATURATES past kEnd = 14;
 * imp-33987 s super-linear regime ENDS and the argmax creep HALTS)
 * ------------------------------------------------------------------------------------------------------
 *   (F1) THE SUPER-LINEAR CONVEX REGIME ENDS -- ALL SECOND DIFFERENCES FLIP STRICTLY NEGATIVE. The
 *        fixed-band peak still rises monotonically +0.38386 (kEnd=14) -> +0.64855 (kEnd=17), a ~69%
 *        further increase, but its 6 increments now SHRINK monotonically (0.04951 -> 0.03851, ratio
 *        ~0.78) and ALL 5 second differences are strictly NEGATIVE (-0.00194 -> -0.00232). The drift has
 *        turned CONCAVE: the convex / super-linear acceleration imp-33987 measured over kEnd = 11..14
 *        does NOT persist -- it is decelerating, the signature of saturation onset right at kEnd ~ 14.
 *   (F2) THE POWER-LAW EXPONENT COLLAPSES AND THE LINEAR FIT NOW WINS. A power-law fit peak ~ A kEnd^p
 *        gives p ~ 2.686 (R^2 ~ 0.99177) on this decade -- down sharply from imp-33987 s p ~ 4.41 over
 *        11..14, still above 1 but no longer strongly super-linear. And the ranking INVERTS: the plain
 *        linear fit now has the highest R^2 (~0.99808), beating the power law (~0.99177) and the
 *        exponential (~0.98595). Over the saturating decade the drift is best summarised as very nearly
 *        LINEAR-with-slight-concavity, not the accelerating power law of the previous decade.
 *   (F3) THE BAND ARGMAX RUNG STOPS CREEPING -- IT LOCKS AT k = 6.50. Across all 7 windows kEnd = 14..17
 *        the rung carrying the fixed-band peak stays fixed at k = 6.50; it does NOT keep creeping past
 *        6.50 as it did (7.00 -> 6.50) over imp-33987 s decade. The inward pivot of the OLS line has
 *        stalled, consistent with the saturation reading in F1/F2.
 *
 * The punchline: pushing the imp-33987 fixed-band (k <= 10) drift sweep one further decade to
 * kEnd = 14..17 shows the convex / super-linear drift DOES NOT persist -- the peak still climbs
 * +0.38386 -> +0.64855 (~69%) but its increments SHRINK (0.04951 -> 0.03851) and ALL 5 second differences
 * flip strictly NEGATIVE, the power-law exponent collapses p ~ 4.41 -> ~2.686, the linear fit overtakes it
 * (R^2 0.99808 > 0.99177 > 0.98595), and the band argmax rung locks at k = 6.50 (no further creep). This
 * is the onset of SATURATION at kEnd ~ 14, the boundary imp-33987 could not see past.
 *
 * MEASUREMENT / RESIDUAL-GROWTH FIT ONLY. A descriptive re-selection of residuals from an inherited
 * surrogate as the fit boundary recedes, NOT an RH bound and distinct from any form selection (the
 * imp-33843 log-linear-over-power-law verdict and the imp-33940 R2 / imp-33987 findings it extends are
 * untouched -- imp-33987 s reading is CORRECT within its measured window kEnd = 11..14; this module only
 * shows what happens beyond it). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT
 * a rigorous asymptotic; the OLS surrogate and the growth-exponent classification are descriptive, not
 * derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33987-fixed-band-convex-drift-exponent (the kEnd = 11..14 sweep this continues; machinery reused)
 * @see imp-33940-interior-residual-boundary-stability (the R2 convex low-k drift origin)
 * @see imp-33917-endpoint-residual-growth-law (the endpoint peak whose machinery is reused verbatim)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run per boundary)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-33987
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-33987.
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-33987.
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

// ONE-DECADE CONTINUATION of imp-33987: kEnd = 14.0, 14.5, ..., 17.0 (7 windows past imp-33987 s 11..14).
const K_ENDS = [];
for (let k = 14; k <= 17 + 1e-9; k += 0.5) K_ENDS.push(+k.toFixed(2));

const FIXED_BAND_KMAX = 10.0; // identical boundary-independent band to imp-33940 R2 / imp-33987

const FIXED_BAND_ROWS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  return { kEnd, peak: +fp.peak.toFixed(6), atK: fp.atK };
});
const FB_PEAKS = FIXED_BAND_ROWS.map((r) => r.peak);

// Increments and second differences -- re-test the convex (super-linear) curvature sign for saturation.
const FB_INCREMENTS = [];
for (let i = 1; i < FB_PEAKS.length; i++) FB_INCREMENTS.push(+(FB_PEAKS[i] - FB_PEAKS[i - 1]).toFixed(6));
const FB_SECOND_DIFFS = [];
for (let i = 1; i < FB_INCREMENTS.length; i++)
  FB_SECOND_DIFFS.push(+(FB_INCREMENTS[i] - FB_INCREMENTS[i - 1]).toFixed(6));

// Growth-exponent fits: power law (log-log), exponential (log-linear), and the linear contrast.
const LOG_KENDS = K_ENDS.map((k) => Math.log(k));
const LOG_PEAKS = FB_PEAKS.map((p) => Math.log(p));
const POWER_FIT = ols(LOG_KENDS, LOG_PEAKS); // log(peak) = log(A) + p log(kEnd)
const POWER_R2 = r2Of(LOG_KENDS, LOG_PEAKS, POWER_FIT.a, POWER_FIT.b);
const EXP_FIT = ols(K_ENDS, LOG_PEAKS); // log(peak) = log(A) + b kEnd
const EXP_R2 = r2Of(K_ENDS, LOG_PEAKS, EXP_FIT.a, EXP_FIT.b);
const LIN_FIT = ols(K_ENDS, FB_PEAKS);
const LIN_R2 = r2Of(K_ENDS, FB_PEAKS, LIN_FIT.a, LIN_FIT.b);

const FB_MONOTONIC = FB_PEAKS.every((p, i) => i === 0 || p > FB_PEAKS[i - 1]);
const FB_INCREMENTS_DECREASING = FB_INCREMENTS.every((x, i) => i === 0 || x < FB_INCREMENTS[i - 1]);
const FB_CONVEX_PERSISTS = FB_SECOND_DIFFS.every((d) => d > 0); // was true over 11..14; now false (saturating)
const FB_SATURATING = FB_SECOND_DIFFS.every((d) => d < 0); // all second differences negative -> concave
const FB_TOTAL_RISE_FRACTION = +((FB_PEAKS[FB_PEAKS.length - 1] - FB_PEAKS[0]) / FB_PEAKS[0]).toFixed(4);
const FB_INCREMENT_RATIO = +(FB_INCREMENTS[FB_INCREMENTS.length - 1] / FB_INCREMENTS[0]).toFixed(4);
const ARGMAX_KS = FIXED_BAND_ROWS.map((r) => r.atK);
const ARGMAX_LOCKED = ARGMAX_KS.every((k) => k === ARGMAX_KS[0]);
const LINEAR_BEATS_POWER = LIN_R2 > POWER_R2;

// imp-33987 s previous-decade exponent, for the side-by-side collapse comparison (baked literal).
const IMP33987_POWER_EXPONENT_11_14 = 4.409905;

export const IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE = {
  id: 'imp-34040',
  proofSection: 'S-frontier',
  question:
    'imp-33987 found the fixed-band (k <= 10) imp-33843 residual drift is convex / super-linear over ' +
    'kEnd = 11..14 (all second differences positive, power exponent p ~ 4.41) with the band argmax rung ' +
    'creeping 7.00 -> 6.50. Pushing the SAME selector one further decade to kEnd = 14.0 .. 17.0 (7 ' +
    'windows), does that convex / super-linear drift PERSIST or SATURATE, does the exponent stay near ' +
    '4.41, and does the argmax rung keep creeping past 6.50? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Per boundary kEnd = 14.0, 14.5, ..., 17.0 (7 windows): the largest signed residual in the fixed ' +
    'band k <= 10.00 of the imp-33843 log-linear OLS on the imp-33810 ladder k = 6.00 .. kEnd, its ' +
    'increments and second differences (curvature sign / saturation test), a growth exponent from a ' +
    'power-law fit peak ~ A kEnd^p versus exponential and linear fits, and the band argmax rung per window',
  fixedBandRows: FIXED_BAND_ROWS, // {kEnd, peak, atK} x 7
  fixedBandKMax: FIXED_BAND_KMAX,
  kEnds: K_ENDS,
  fixedBandIncrements: FB_INCREMENTS, // now strictly DECREASING -> saturation
  fixedBandSecondDifferences: FB_SECOND_DIFFS, // now all NEGATIVE -> concave / saturating
  powerLawFit: {
    form: 'fixedBandPeak = A * kEnd^p',
    exponent: +POWER_FIT.b.toFixed(6), // p ~ 2.686 -- collapsed from imp-33987 s ~4.41
    A: +Math.exp(POWER_FIT.a).toExponential(4),
    r2: +POWER_R2.toFixed(8),
  },
  exponentialFit: {
    form: 'fixedBandPeak = A * exp(b * kEnd)',
    rate: +EXP_FIT.b.toFixed(6), // b ~ 0.1733
    A: +Math.exp(EXP_FIT.a).toExponential(4),
    r2: +EXP_R2.toFixed(8),
  },
  linearFitContrast: {
    form: 'fixedBandPeak = a + b * kEnd',
    b: +LIN_FIT.b.toFixed(6),
    r2: +LIN_R2.toFixed(8), // now the HIGHEST R2 -- the drift has flattened to near-linear
  },
  imp33987PowerExponent11to14: IMP33987_POWER_EXPONENT_11_14, // ~4.41 (previous decade, for contrast)
  fixedBandPeakFirst: FB_PEAKS[0], // +0.383861 at kEnd=14 (reproduces imp-33987 s last anchor)
  fixedBandPeakLast: FB_PEAKS[FB_PEAKS.length - 1], // +0.648552 at kEnd=17
  fixedBandTotalRiseFraction: FB_TOTAL_RISE_FRACTION, // ~0.69 -- 69% further rise, but decelerating
  fixedBandIncrementRatio: FB_INCREMENT_RATIO, // last/first increment ~0.78 -- increments SHRINK
  fixedBandArgmaxKs: ARGMAX_KS, // all 6.50 -- creep halted
  fixedBandMonotonic: FB_MONOTONIC,
  fixedBandIncrementsDecreasing: FB_INCREMENTS_DECREASING,
  fixedBandConvexDriftPersists: FB_CONVEX_PERSISTS, // false -- convex regime has ended
  fixedBandDriftIsSaturating: FB_SATURATING, // true -- all second differences negative
  fixedBandArgmaxLocked: ARGMAX_LOCKED, // true -- rung locked at 6.50, no further creep
  linearBeatsPower: LINEAR_BEATS_POWER,
  finding: {
    F1_super_linear_regime_ends_second_diffs_flip_negative:
      'Over the further decade kEnd = 14..17 the fixed-band (k <= 10) peak still rises monotonically ' +
      '+0.38386 -> +0.64855 (~69%), but its 6 increments now SHRINK monotonically (0.04951 -> 0.03851, ' +
      'ratio ~0.78) and ALL 5 second differences are strictly NEGATIVE (-0.00194 -> -0.00232). The ' +
      'convex / super-linear acceleration imp-33987 measured over kEnd = 11..14 does NOT persist -- the ' +
      'drift has turned concave / decelerating, the onset of saturation right at the kEnd ~ 14 boundary.',
    F2_power_exponent_collapses_linear_now_wins:
      'A power-law fit peak ~ A kEnd^p gives p ~ 2.686 (R^2 ~ 0.99177) on this decade -- collapsed from ' +
      'imp-33987 s p ~ 4.41 over 11..14, still above 1 but no longer strongly super-linear. And the ' +
      'ranking inverts: the plain linear fit now has the HIGHEST R^2 (~0.99808), beating the power law ' +
      '(~0.99177) and the exponential (~0.98595). Over the saturating decade the drift is best ' +
      'summarised as near-linear-with-slight-concavity, not the accelerating power law of the prior one.',
    F3_argmax_rung_stops_creeping_locks_at_6_50:
      'Across all 7 windows kEnd = 14..17 the rung carrying the fixed-band peak stays fixed at k = 6.50; ' +
      'it does NOT keep creeping past 6.50 as it did (7.00 -> 6.50) over imp-33987 s decade. The inward ' +
      'pivot of the OLS line has stalled, consistent with the saturation reading in F1/F2.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / RESIDUAL-GROWTH FIT (frontier-direction, NOT rigorous). Pushing the imp-33987 ' +
    'fixed-band (k <= 10) residual selector one further decade of N to kEnd = 14.0 .. 17.0 (7 windows) ' +
    'with the identical inherited imp-33810/imp-33940/imp-33987 sub-terms shows the convex / super-linear ' +
    'drift DOES NOT persist: the peak still climbs +0.38386 -> +0.64855 (~69%) but its increments SHRINK ' +
    '(0.04951 -> 0.03851, ratio ~0.78) and ALL 5 second differences flip strictly NEGATIVE (-0.00194 -> ' +
    '-0.00232) -- concave / saturating. The power-law exponent collapses p ~ 4.41 -> ~2.686, and the ' +
    'ranking inverts so the plain linear fit now wins (R^2 0.99808 > power 0.99177 > exponential ' +
    '0.98595). The band argmax rung locks at k = 6.50 across all 7 windows -- it does NOT creep past ' +
    '6.50. This is the onset of SATURATION at kEnd ~ 14, the boundary imp-33987 could not see past; ' +
    'imp-33987 s convex reading over kEnd = 11..14 is CORRECT within its measured window and is not ' +
    'overturned -- only its extrapolation beyond kEnd = 14 is corrected. Distinct from any form ' +
    'selection; the imp-33843 log-linear-over-power-law verdict is untouched. The OLS surrogate and the ' +
    'growth-exponent classification are descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33987 (the kEnd = 11..14 convex-drift sweep this continues one decade; machinery reused ' +
    'verbatim); imp-33940 (the R2 convex low-k drift origin); imp-33917 (the endpoint peak whose ' +
    'machinery is reused); imp-33843 (the log-linear OLS re-run per boundary); imp-33810 (the k=6.. ' +
    'ladder reused verbatim); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE_ASSERTIONS = [
  {
    // Reuse gate: 7 windows, and the fixed-band peak at the shared boundary kEnd = 14 reproduces
    // imp-33987 s last anchor +0.383861 -- same machinery, continued one decade.
    id: 'imp34040-reuse-gate-7-windows-anchor-to-imp33987',
    description: '7 windows kEnd 14..17; fixed-band peak at kEnd 14 matches imp-33987 last anchor +0.383861 (< 2e-3)',
    holds: () =>
      FIXED_BAND_ROWS.length === 7 &&
      Math.abs(FB_PEAKS[0] - 0.383861) < 2e-3,
  },
  {
    // (F1) The convex drift does NOT persist: still monotonic, but increments strictly DECREASE and all
    // 5 second differences are strictly NEGATIVE (concave / saturating) on the further decade.
    id: 'imp34040-super-linear-regime-ends-second-diffs-negative',
    description: 'fixed band still monotonic but increments strictly decreasing, all 5 second diffs < 0 (saturating)',
    holds: () =>
      FB_MONOTONIC === true &&
      FB_INCREMENTS_DECREASING === true &&
      FB_CONVEX_PERSISTS === false &&
      FB_SATURATING === true &&
      FB_SECOND_DIFFS.length === 5 &&
      FB_TOTAL_RISE_FRACTION > 0.5 &&
      FB_INCREMENT_RATIO < 1.0,
  },
  {
    // (F2) The power-law exponent collapses relative to imp-33987 s ~4.41 and the linear fit now wins.
    id: 'imp34040-power-exponent-collapses-linear-wins',
    description: 'power exponent p in (1,4) and below imp-33987 4.41; linear R2 > power R2 > exponential R2',
    holds: () =>
      POWER_FIT.b > 1 &&
      POWER_FIT.b < 4 &&
      POWER_FIT.b < IMP33987_POWER_EXPONENT_11_14 &&
      LIN_R2 > POWER_R2 &&
      POWER_R2 > EXP_R2,
  },
  {
    // (F3) The band argmax rung stops creeping: locked at k = 6.50 across all 7 windows (no creep past).
    id: 'imp34040-argmax-rung-locks-at-6-50',
    description: 'band argmax rung fixed at k = 6.50 across all 7 windows -- creep halted, no move past 6.50',
    holds: () =>
      ARGMAX_LOCKED === true &&
      ARGMAX_KS[0] === 6.5,
  },
  {
    // Honesty gate: measurement only, saturation onset, isRigorous false, imp-33987 CORRECTED not
    // overturned within its window, no QED, PT SOTA.
    id: 'imp34040-honesty-gate-no-qed',
    description: 'Measurement only: saturation onset, isRigorous false, imp-33987 within-window untouched, no QED, PT SOTA, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.fixedBandDriftIsSaturating === true &&
      IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.isRigorous === false &&
      /NO QED/.test(IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.verdict) &&
      /remains SOTA/.test(IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.verdict),
  },
];

for (const a of IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34040-fixed-band-drift-saturation-decade assertion failed: ${a.id}`);
  }
}
