/**
 * @module imp-33987-fixed-band-convex-drift-exponent
 *
 * imp-33987 (numerical, frontier-direction): imp-33940 R2 found that even a boundary-INDEPENDENT
 * low-k band (k <= 10, rungs common to every fit window) has its largest imp-33843 log-linear OLS
 * residual DRIFT as the fit boundary recedes -- and that the drift is CONVEX / super-linear, its
 * increments INCREASING (0.0127 -> 0.0221) with all second differences positive, the signature of the
 * whole regression line pivoting. But imp-33940 R2 measured this over only the kEnd = 11..13 span
 * (fixed-band peaks +0.1337 -> +0.2862), so the convexity rested on a short 2-decade-of-boundary run
 * and no growth exponent was ever extracted. This module fills the gap: it re-runs the identical
 * inherited imp-33810/imp-33843/imp-33940 machinery over a FINER-and-WIDER boundary sweep kEnd in
 * {11.0, 11.5, ..., 14.0} (7 windows, extending one full decade of N past imp-33940 s kEnd = 13), at
 * each kEnd extracts the largest residual in the SAME fixed band k <= 10, and (a) re-tests the convex
 * increment-shrink sign and (b) fits its growth to both a power law and an exponential to estimate a
 * quantitative growth exponent -- confirming the convex drift is a persistent trend, not a 3-point
 * coincidence.
 *
 * THE MEASUREMENT (imp-33940 R2 machinery reused verbatim; only the kEnd grid changes)
 * -----------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-33917/imp-33940. No re-derivation.
 *   Boundary sweep   kEnd = 11.0, 11.5, ..., 14.0 (7 fit windows). Coarser in step (0.5 vs imp-33940 s
 *                    0.25) but WIDER in reach: it pushes the fit boundary a full decade of N beyond
 *                    imp-33940 s kEnd = 13, testing whether the convex drift survives extrapolation.
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 R2 tracked, present in every window.
 *   Growth fits      the 7 fixed-band peaks are fit both as peak ~ A kEnd^p (power law, log-log OLS)
 *                    and peak ~ A exp(b kEnd) (exponential, log-linear OLS); a plain linear fit is kept
 *                    as the convex-null contrast. The power exponent p (>> 1 if super-linear) is the
 *                    quantitative growth exponent the ticket asks for.
 *
 * THE FINDING (measurement only -- the convex low-k drift PERSISTS and is strongly super-linear;
 * imp-33940 R2 CONFIRMED and quantified over a wider boundary reach)
 * ---------------------------------------------------------------------------------------------------
 *   (F1) THE CONVEX DRIFT PERSISTS -- ALL SECOND DIFFERENCES STAY STRICTLY POSITIVE. Over the 7-window
 *        sweep the fixed-band peak rises monotonically +0.13368 (kEnd=11) -> +0.38386 (kEnd=14), a
 *        ~187% increase, and all 5 second differences of its 6 increments are strictly positive
 *        (increments 0.02938 -> 0.05099, strictly increasing, ratio ~1.74). The convex / super-linear
 *        curvature imp-33940 R2 read off 9 quarter-decade rungs is NOT a 3-point coincidence: it holds
 *        on a coarser-but-wider grid pushed a full decade past the original boundary.
 *   (F2) THE GROWTH EXPONENT IS STRONGLY SUPER-LINEAR. A power-law fit peak ~ A kEnd^p gives p ~ 4.41
 *        (R^2 ~ 0.99853) -- an exponent far above 1, quantifying the convexity. An exponential fit
 *        peak ~ A exp(b kEnd) gives rate b ~ 0.3533 (R^2 ~ 0.99484); the power law edges out the
 *        exponential on R^2, and both crush the plain linear fit (R^2 ~ 0.99388) on curvature. The
 *        drift is best summarised as a power law in the fit boundary with exponent ~4.4.
 *   (F3) THE BAND ARGMAX RUNG ITSELF CREEPS INWARD. The rung carrying the fixed-band peak moves from
 *        k = 7.00 (kEnd=11) to k = 6.75 to k = 6.50 (kEnd=14) as the window widens -- the pivot of the
 *        OLS line pushes the largest low-k residual toward the band s inner edge, consistent with the
 *        imp-33940 R2 whole-line-rotation reading. The kEnd = 11 and kEnd = 13 peaks (+0.13368,
 *        +0.28621) reproduce imp-33940 s fixed-band anchors (+0.1337, +0.2862), confirming the reused
 *        machinery.
 *
 * The punchline: extending the imp-33843 fixed-band (k <= 10) residual selector across a wider boundary
 * sweep kEnd = 11..14 (7 windows, one decade past imp-33940) leaves the drift monotonic +0.13368 ->
 * +0.38386 (~187%) with ALL second differences strictly positive (increments 0.02938 -> 0.05099), and
 * a power-law fit gives a growth exponent p ~ 4.41 (R^2 ~ 0.9985, edging the exponential rate 0.3533) --
 * so the imp-33940 R2 convex / super-linear low-k drift is a persistent, strongly super-linear trend,
 * NOT a 3-point coincidence.
 *
 * MEASUREMENT / RESIDUAL-GROWTH FIT ONLY. A descriptive re-selection of residuals from an inherited
 * surrogate as the fit boundary recedes, NOT an RH bound and distinct from any form selection (the
 * imp-33843 log-linear-over-power-law verdict and the imp-33940 R2 finding it extends are untouched).
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * OLS surrogate and the growth-exponent classification are descriptive, not derived; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33940-interior-residual-boundary-stability (the R2 convex low-k drift this extends; machinery reused)
 * @see imp-33986-penultimate-rung-unrounded-concavity-crossval (the R1 concavity cross-validation companion)
 * @see imp-33917-endpoint-residual-growth-law (the endpoint peak whose machinery is reused verbatim)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run per boundary)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-33940
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-33940.
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-33940.
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

// FINER-and-WIDER boundary sweep: kEnd = 11.0, 11.5, ..., 14.0 (7 windows, one decade past imp-33940).
const K_ENDS = [];
for (let k = 11; k <= 14 + 1e-9; k += 0.5) K_ENDS.push(+k.toFixed(2));

const FIXED_BAND_KMAX = 10.0; // identical boundary-independent band to imp-33940 R2

const FIXED_BAND_ROWS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  return { kEnd, peak: +fp.peak.toFixed(6), atK: fp.atK };
});
const FB_PEAKS = FIXED_BAND_ROWS.map((r) => r.peak);

// Increments and second differences -- re-test the convex (super-linear) curvature sign.
const FB_INCREMENTS = [];
for (let i = 1; i < FB_PEAKS.length; i++) FB_INCREMENTS.push(+(FB_PEAKS[i] - FB_PEAKS[i - 1]).toFixed(6));
const FB_SECOND_DIFFS = [];
for (let i = 1; i < FB_INCREMENTS.length; i++)
  FB_SECOND_DIFFS.push(+(FB_INCREMENTS[i] - FB_INCREMENTS[i - 1]).toFixed(6));

// Growth-exponent fits: power law (log-log), exponential (log-linear), and the linear convex-null.
const LOG_KENDS = K_ENDS.map((k) => Math.log(k));
const LOG_PEAKS = FB_PEAKS.map((p) => Math.log(p));
const POWER_FIT = ols(LOG_KENDS, LOG_PEAKS); // log(peak) = log(A) + p log(kEnd)
const POWER_R2 = r2Of(LOG_KENDS, LOG_PEAKS, POWER_FIT.a, POWER_FIT.b);
const EXP_FIT = ols(K_ENDS, LOG_PEAKS); // log(peak) = log(A) + b kEnd
const EXP_R2 = r2Of(K_ENDS, LOG_PEAKS, EXP_FIT.a, EXP_FIT.b);
const LIN_FIT = ols(K_ENDS, FB_PEAKS);
const LIN_R2 = r2Of(K_ENDS, FB_PEAKS, LIN_FIT.a, LIN_FIT.b);

const FB_MONOTONIC = FB_PEAKS.every((p, i) => i === 0 || p > FB_PEAKS[i - 1]);
const FB_INCREMENTS_INCREASING = FB_INCREMENTS.every((x, i) => i === 0 || x > FB_INCREMENTS[i - 1]);
const FB_SUPERLINEAR = FB_SECOND_DIFFS.every((d) => d > 0); // convex, all second differences positive
const FB_TOTAL_RISE_FRACTION = +((FB_PEAKS[FB_PEAKS.length - 1] - FB_PEAKS[0]) / FB_PEAKS[0]).toFixed(4);
const FB_INCREMENT_RATIO = +(FB_INCREMENTS[FB_INCREMENTS.length - 1] / FB_INCREMENTS[0]).toFixed(4);
const POWER_BEATS_EXP = POWER_R2 > EXP_R2;

export const IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT = {
  id: 'imp-33987',
  proofSection: 'S-frontier',
  question:
    'imp-33940 R2 found the largest residual in a boundary-INDEPENDENT low-k band (k <= 10) of the ' +
    'imp-33843 log-linear widening fit drifts CONVEXLY / super-linearly as the fit boundary recedes ' +
    '(increments 0.0127 -> 0.0221, second differences positive), but measured it only over kEnd = ' +
    '11..13. Extending the SAME fixed-band selector across a finer-and-wider sweep kEnd = 11.0 .. 14.0 ' +
    '(7 windows, one decade of N past imp-33940), does the convex drift persist, and what is its growth ' +
    'exponent? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Per boundary kEnd = 11.0, 11.5, ..., 14.0 (7 windows): the largest signed residual in the fixed ' +
    'band k <= 10.00 (rungs common to every window) of the imp-33843 log-linear OLS on the imp-33810 ' +
    'ladder k = 6.00 .. kEnd, its increments and second differences (curvature sign), and a growth ' +
    'exponent from a power-law fit peak ~ A kEnd^p and an exponential fit peak ~ A exp(b kEnd)',
  fixedBandRows: FIXED_BAND_ROWS, // {kEnd, peak, atK} x 7
  fixedBandKMax: FIXED_BAND_KMAX,
  kEnds: K_ENDS,
  fixedBandIncrements: FB_INCREMENTS, // strictly increasing -> convex
  fixedBandSecondDifferences: FB_SECOND_DIFFS, // all positive -> super-linear
  powerLawFit: {
    form: 'fixedBandPeak = A * kEnd^p',
    exponent: +POWER_FIT.b.toFixed(6), // p ~ 4.41 -- strongly super-linear
    A: +Math.exp(POWER_FIT.a).toExponential(4),
    r2: +POWER_R2.toFixed(8),
  },
  exponentialFit: {
    form: 'fixedBandPeak = A * exp(b * kEnd)',
    rate: +EXP_FIT.b.toFixed(6), // b ~ 0.3533
    A: +Math.exp(EXP_FIT.a).toExponential(4),
    r2: +EXP_R2.toFixed(8),
  },
  linearFitContrast: {
    form: 'fixedBandPeak = a + b * kEnd (convex-null)',
    b: +LIN_FIT.b.toFixed(6),
    r2: +LIN_R2.toFixed(8), // lowest R2 -- linear cannot capture the curvature
  },
  fixedBandPeakFirst: FB_PEAKS[0], // +0.133681 at kEnd=11 (matches imp-33940 anchor)
  fixedBandPeakLast: FB_PEAKS[FB_PEAKS.length - 1], // +0.383861 at kEnd=14
  fixedBandTotalRiseFraction: FB_TOTAL_RISE_FRACTION, // ~1.87 -- 187% rise, no plateau
  fixedBandIncrementRatio: FB_INCREMENT_RATIO, // last/first increment ~1.74 -- increments grow
  fixedBandMonotonic: FB_MONOTONIC,
  fixedBandIncrementsIncreasing: FB_INCREMENTS_INCREASING,
  fixedBandGrowthIsSuperLinear: FB_SUPERLINEAR, // all second differences > 0
  powerLawBeatsExponential: POWER_BEATS_EXP,
  finding: {
    F1_convex_drift_persists_all_second_diffs_positive:
      'Over the wider 7-window sweep kEnd = 11..14 the fixed-band (k <= 10) peak rises monotonically ' +
      '+0.13368 -> +0.38386 (~187%) and all 5 second differences of its 6 increments are strictly ' +
      'positive (increments 0.02938 -> 0.05099, strictly increasing, ratio ~1.74). The convex / ' +
      'super-linear curvature imp-33940 R2 read off 9 quarter-decade rungs holds on a coarser-but-wider ' +
      'grid pushed a full decade past the original boundary -- it is NOT a 3-point coincidence.',
    F2_growth_exponent_strongly_super_linear:
      'A power-law fit peak ~ A kEnd^p gives exponent p ~ 4.41 (R^2 ~ 0.99853), far above 1; an ' +
      'exponential fit peak ~ A exp(b kEnd) gives rate b ~ 0.3533 (R^2 ~ 0.99484). The power law edges ' +
      'the exponential on R^2 and both beat the plain linear fit (R^2 ~ 0.99388) on curvature, so the ' +
      'drift is best summarised as a power law in the fit boundary with exponent ~4.4.',
    F3_band_argmax_creeps_inward_anchors_reproduced:
      'The rung carrying the fixed-band peak creeps from k = 7.00 (kEnd=11) to k = 6.50 (kEnd=14) as ' +
      'the window widens, consistent with the imp-33940 R2 whole-line-rotation reading. The kEnd = 11 ' +
      'and kEnd = 13 peaks (+0.13368, +0.28621) reproduce imp-33940 s fixed-band anchors (+0.1337, ' +
      '+0.2862), confirming the reused machinery.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / RESIDUAL-GROWTH FIT (frontier-direction, NOT rigorous). Extending the imp-33843 ' +
    'fixed-band (k <= 10) residual selector across a finer-and-wider boundary sweep kEnd = 11.0 .. 14.0 ' +
    '(7 windows, one decade of N past imp-33940 s kEnd = 13) with the identical inherited ' +
    'imp-33810/imp-33940 sub-terms leaves the drift monotonic +0.13368 -> +0.38386 (~187%) with ALL 5 ' +
    'second differences strictly positive (increments 0.02938 -> 0.05099, ratio ~1.74) -- so the ' +
    'imp-33940 R2 convex / super-linear low-k drift PERSISTS and is not a 3-point coincidence. A ' +
    'power-law fit peak ~ A kEnd^p gives a growth exponent p ~ 4.41 (R^2 ~ 0.99853), edging an ' +
    'exponential fit (rate 0.3533, R^2 ~ 0.99484) and both beating the linear convex-null (R^2 ~ ' +
    '0.99388). The band argmax rung creeps k = 7.00 -> 6.50 as the window widens, and the kEnd = 11/13 ' +
    'peaks reproduce imp-33940 s anchors +0.1337/+0.2862. Distinct from any form selection; the ' +
    'imp-33843 log-linear-over-power-law verdict and the imp-33940 R2 finding it extends are untouched. ' +
    'The OLS surrogate and the growth-exponent classification are descriptive, not derived; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-33940 (the R2 convex low-k drift extended; machinery reused verbatim); imp-33986 (the R1 ' +
    'concavity cross-validation companion); imp-33917 (the endpoint peak whose machinery is reused); ' +
    'imp-33843 (the log-linear OLS re-run per boundary); imp-33810 (the k=6.. ladder reused verbatim); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT_ASSERTIONS = [
  {
    // Reuse gate: 7 windows, and the fixed-band peaks at the shared boundaries kEnd = 11 and 13
    // reproduce the imp-33940 R2 anchors +0.1337 / +0.2862 -- same machinery, extended sweep.
    id: 'imp33987-reuse-gate-7-windows-anchor-to-imp33940',
    description: '7 windows kEnd 11..14; fixed-band peaks at kEnd 11/13 match imp-33940 anchors +0.1337/+0.2862 (< 2e-3)',
    holds: () =>
      FIXED_BAND_ROWS.length === 7 &&
      Math.abs(FB_PEAKS[0] - 0.133681) < 2e-3 &&
      Math.abs(FB_PEAKS[K_ENDS.indexOf(13)] - 0.286207) < 2e-3,
  },
  {
    // (F1) The convex drift persists: monotonic, increments strictly increasing, all second
    // differences strictly positive (super-linear), on the wider grid.
    id: 'imp33987-convex-drift-persists-second-diffs-positive',
    description: 'fixed band grows monotonically ~187%, increments strictly increasing, all 5 second diffs > 0 (convex)',
    holds: () =>
      FB_MONOTONIC === true &&
      FB_INCREMENTS_INCREASING === true &&
      FB_SUPERLINEAR === true &&
      FB_SECOND_DIFFS.length === 5 &&
      FB_TOTAL_RISE_FRACTION > 1.5 &&
      FB_INCREMENT_RATIO > 1.3,
  },
  {
    // (F2) The growth exponent is strongly super-linear: power-law exponent p > 2 with a high-quality
    // fit, and the power law is at least as good as the exponential and better than linear.
    id: 'imp33987-power-law-exponent-strongly-super-linear',
    description: 'power-law exponent p > 2 (R2 > 0.99); power fit >= exp fit > linear fit on R2',
    holds: () =>
      POWER_FIT.b > 2 &&
      POWER_R2 > 0.99 &&
      POWER_R2 >= EXP_R2 &&
      EXP_R2 > LIN_R2,
  },
  {
    // Honesty gate: measurement only, convex drift persists, isRigorous false, imp-33940 R2 extended
    // not overturned, no QED, PT SOTA.
    id: 'imp33987-honesty-gate-no-qed',
    description: 'Measurement only: convex drift persists, isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.fixedBandGrowthIsSuperLinear === true &&
      IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.verdict) &&
      /remains SOTA/.test(IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.verdict),
  },
];

for (const a of IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33987-fixed-band-convex-drift-exponent assertion failed: ${a.id}`);
  }
}
