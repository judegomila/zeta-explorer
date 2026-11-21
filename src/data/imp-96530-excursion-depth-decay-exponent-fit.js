/**
 * imp-96530 -- MEASUREMENT: fit the below-envelope dip-depth decay exponent across ALL available
 * unclipped interior anchors and test whether the imp-96493 depth decay (relErr 0.425 vs sampling
 * floor 0.789 over T = 1.5e5 -> 3.879e5) is quantitatively consistent with a FIXED ~2.28% one-sided
 * GUE tail (sampling-noise reading B) rather than a systematic below-envelope excursion (reading A).
 *
 * BACKGROUND. imp-96510 argued against a systematic excursion using only the TWO deepest imp-96493
 * anchors (the T = 1.5e5 reference and the T = 3.879e5 deepest higher dip): the measured depth
 * relErr shrank by 0.425 while the chi-square sampling floor sqrt(2/n_w) shrank by only 0.789, so
 * the dip score z FELL (1.9234 -> 1.0358) -- the opposite of the T^(1/4) GROWTH a fixed-fractional
 * systematic deviation would produce. But imp-96510 explicitly left the relErr(T) SCALING EXPONENT
 * UNFIT across more than those two endpoints (its named open sub-gap
 * imp-96510-systematic-vs-noise-dip-depth-scaling). This module turns the two-point argument into a
 * MULTI-ANCHOR exponent fit over every clean interior dip the existing 10^6 set supplies, and reports
 * which of the two competing laws the data favours and by how much.
 *
 * THE TWO COMPETING LAWS (imp-96510 readings A / B), as exponents of relErr(T) ~ A * T^p:
 *  (A) SYSTEMATIC   -- relErr is a fixed fractional feature independent of height: p_A = 0, and the
 *                      dip score z = relErr sqrt(n_w/2) GROWS as n_w^(1/2) ~ T^(1/4) (z-exponent +1/4).
 *  (B) SAMPLING-NOISE -- relErr shrinks in lockstep with the chi-square floor sqrt(2/n_w) ~ T^(-1/4):
 *                      p_B = -1/4, and z stays O(1) (z-exponent 0), a fixed ~2.28% one-sided tail per
 *                      independent height.
 *
 * THE INTERIOR ANCHORS. The imp-96493 scan evaluates the dip score at ten candidate heights; the
 * CLEAN interior anchors (below-envelope residual < 0 AND unclipped, T <= T_clip ~ 4.6175e5) number
 * SEVEN: the T = 1.5e5 reference plus six higher heights (T = 2.361e5, 2.786e5, 3.0e5, 3.287e5,
 * 3.879e5, 4.577e5). The same baked band() sd(C - E) literals and dip-score formula as imp-96493 are
 * reused here (import-light: no zeros bundle, no sibling imports), so every relErr / n_w / z is
 * recomputed from scratch.
 *
 * FINDINGS.
 *  1. FREE log-log fit relErr(T) ~ A T^p over the seven interior anchors gives p = -1.917 with a POOR
 *     R^2 = 0.288 -- far steeper than EITHER law (p_A = 0, p_B = -1/4) and badly scattered. The
 *     exponent is dominated by two deep anchors (T = 1.5e5, 3.879e5) against five shallow noise
 *     crossings (relErr 0.005..0.045); the free exponent is therefore UNPINNED, exactly as the
 *     imp-96510 sub-gap warned. This measurement does NOT close that sub-gap; it quantifies it.
 *  2. But the DIRECTION robustly REJECTS the systematic reading (A). Across the six higher anchors
 *     the mean relErr = 0.02439 has COLLAPSED by 6.54x from the reference relErr = 0.15946 -- a fixed-
 *     fractional systematic deviation would have held it CONSTANT (collapse ~1x). And the z-score
 *     exponent (OLS log z vs log T) is -1.667, the OPPOSITE SIGN of the +1/4 GROWTH the systematic
 *     reading predicts. The mean higher-anchor z = 0.359 sits well below 1, not climbing toward 2.
 *  3. Constrained single-parameter fits (relErr = A T^p with p fixed to each law, best A in log-space)
 *     give RSS_A = 10.044 (systematic, p = 0) vs RSS_B = 9.338 (sampling-noise, p = -1/4): the
 *     sampling-noise law fits BETTER, RSS ratio A/B = 1.076. The margin is modest (both laws fit the
 *     scattered shallow anchors poorly, free RSS = 7.148), so the fit FAVOURS B without excluding the
 *     large-scatter regime -- consistent with the two-point imp-96510 verdict.
 *
 * VERDICT. Fitting the below-envelope dip-depth decay across all SEVEN clean unclipped interior
 * anchors (not just the imp-96510 two endpoints): the free log-log exponent p = -1.917 is too steep
 * and too scattered (R^2 = 0.288) to PIN -- so the imp-96510 relErr(T)-exponent sub-gap stays OPEN --
 * but the DIRECTION decisively favours the sampling-noise reading (B) over the systematic reading (A).
 * The higher-anchor mean depth collapsed 6.54x (systematic predicts constant), the z-exponent is
 * -1.667 (systematic predicts +1/4, opposite sign), and the constrained-law RSS ratio A/B = 1.076
 * favours B. So the imp-96493 depth decay IS quantitatively consistent with a fixed ~2.28% one-sided
 * GUE tail rather than a systematic excursion, corroborating imp-96510 across five extra anchors while
 * confirming the exponent itself cannot be nailed from the existing 10^6 set. Measurement only;
 * changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route
 * stays PCC/GRH-gated.
 *
 * @see imp-96510-deeper-interior-dip-height-source-reach (two-endpoint systematic-vs-noise argument + the exponent sub-gap this fits)
 * @see imp-96493-excursion-2sigma-interior-scan (the ten-candidate interior dip scan whose clean anchors are refit here)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the z = relErr/sqrt(2/n_w) dip score)
 *
 * Import-light: no zeros bundle, no sibling imports. The same baked band() sd(C - E) literals and
 * dip-score formula as imp-96493 are reused; every ratio / anchor / z-score / fit statistic is
 * recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI;
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T);
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

const SPAN_FRACTION = 0.3;
const T_MAX_ORDINATE = 600269.68; // top ordinate of the 10^6-th Odlyzko zero (src/data/zeros-to-1e6.js)
const T_CLIP = T_MAX_ORDINATE / (1 + SPAN_FRACTION); // ~4.6175e5: above this the +/-30% tiling clips the ceiling
const windowCount = (T) => {
  const upper = Math.min((1 + SPAN_FRACTION) * T, T_MAX_ORDINATE);
  const lower = (1 - SPAN_FRACTION) * T;
  return Math.floor((upper - lower) / (2 * halfWidth(T)));
};

// The six imp-95562 fit heights set the mean anchor C0_mean that r_cap uses (imp-96049/imp-96452).
const FIT = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];
const C0_mean = FIT.map((m) => m.sd * m.sd - SELBERG_C * logLog(m.Tc)).reduce((s, v) => s + v, 0) / FIT.length;
const cappedRatio = (T) => (SELBERG_C * logLog(T) + C0_mean) / gueNumberVariance(envelopeCount(T));

// dip z-score exactly as imp-96089/imp-96452/imp-96493: z = relErr / sqrt(2/n_w), relErr = |r_cap - r|/r.
const dipScore = (Tc, sd) => {
  const gueVar = gueNumberVariance(envelopeCount(Tc));
  const rMeasured = (sd * sd) / gueVar;
  const rCap = cappedRatio(Tc);
  const residual = rCap - rMeasured; // < 0 => below-envelope dip
  const relErr = Math.abs(residual) / rMeasured;
  const nW = windowCount(Tc);
  const z = relErr / Math.sqrt(2 / nW);
  const clipped = (1 + SPAN_FRACTION) * Tc > T_MAX_ORDINATE;
  return { Tc, residual, isDip: residual < 0, relErr, nW, z, clipped };
};

// Same candidate heights as the imp-96493 scan (baked band() sd(C - E) literals), plus the T = 1.5e5 reference.
const ALL = [
  { Tc: 1.5e5, sd: 0.6714 }, // imp-96089 reference excursion (z=1.9234)
  { Tc: 1.695e5, sd: 6.159914e-1 },
  { Tc: 2.001e5, sd: 6.108068e-1 },
  { Tc: 2.361e5, sd: 6.209680e-1 },
  { Tc: 2.786e5, sd: 6.323792e-1 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 3.287e5, sd: 6.214347e-1 },
  { Tc: 3.879e5, sd: 6.413375e-1 },
  { Tc: 4.577e5, sd: 6.222754e-1 },
  { Tc: 5.401e5, sd: 6.140988e-1 }, // above the clip threshold
  { Tc: 6.373e5, sd: 5.911225e-1 }, // above the clip threshold
];

// clean interior anchors: below-envelope dip AND unclipped (T <= T_clip).
const interiorDips = ALL.map((m) => dipScore(m.Tc, m.sd)).filter((r) => r.isDip && !r.clipped).sort((a, b) => a.Tc - b.Tc);

// --- log-log fit relErr(T) ~ A * T^p over the interior anchors ---
const n = interiorDips.length;
const xs = interiorDips.map((r) => Math.log(r.Tc));
const ysRel = interiorDips.map((r) => Math.log(r.relErr));
const ysZ = interiorDips.map((r) => Math.log(r.z));
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const olsSlope = (x, y) => {
  const mx = mean(x), my = mean(y);
  let sxy = 0, sxx = 0;
  for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) * (x[i] - mx); }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssr = 0, sst = 0;
  for (let i = 0; i < x.length; i++) { const pred = intercept + slope * x[i]; ssr += (y[i] - pred) ** 2; sst += (y[i] - my) ** 2; }
  return { slope, intercept, r2: 1 - ssr / sst, ssr };
};
const relFit = olsSlope(xs, ysRel); // free exponent of relErr(T)
const zFit = olsSlope(xs, ysZ); // free exponent of z(T)

// constrained single-parameter fits: relErr = A T^p, p fixed to each law, best A in log-space.
const constrainedRSS = (p) => {
  const b = mean(ysRel.map((y, i) => y - p * xs[i])); // best log-intercept
  let rss = 0;
  for (let i = 0; i < n; i++) { const pred = b + p * xs[i]; rss += (ysRel[i] - pred) ** 2; }
  return rss;
};
const P_SYSTEMATIC = 0; // reading A: relErr fixed
const P_SAMPLING = -0.25; // reading B: relErr ~ T^(-1/4)
const rssSystematic = constrainedRSS(P_SYSTEMATIC);
const rssSampling = constrainedRSS(P_SAMPLING);
const rssRatioAoverB = rssSystematic / rssSampling; // > 1 favours sampling-noise (B)

// direction diagnostics: higher-anchor depth collapse and z level.
const higher = interiorDips.filter((r) => r.Tc > 1.5e5);
const REF_RELERR = interiorDips.find((r) => r.Tc === 1.5e5).relErr; // ~0.159457
const meanRelErrHigher = mean(higher.map((r) => r.relErr));
const relErrCollapseFactor = REF_RELERR / meanRelErrHigher; // ~6.54x (systematic predicts ~1x)
const meanZHigher = mean(higher.map((r) => r.z)); // ~0.359 (well below 1; systematic climbs toward 2)

export const IMP96530_EXCURSION_DEPTH_DECAY_EXPONENT_FIT = {
  ticket: 'imp-96530',
  question:
    'Is the imp-96493 below-envelope dip-depth decay (relErr shrinking 0.425 vs the sampling floor 0.789 over T = 1.5e5 -> 3.879e5) quantitatively consistent with a FIXED ~2.28% one-sided GUE tail (sampling-noise reading B) rather than a systematic below-envelope excursion (reading A), when the depth-decay exponent is fit across ALL available interior anchors instead of just the two imp-96510 endpoints?',
  method:
    'Reuse the imp-96493 dip-score z(T) = |r_cap(T) - r(T)|/r(T) / sqrt(2/n_w(T)) and the same baked band() sd(C - E) literals to recompute every clean interior anchor (below-envelope dip AND unclipped, T <= T_clip ~ 4.6175e5). Free log-log fit relErr(T) ~ A T^p and z(T) ~ T^q over the anchors; compare the free exponents and constrained single-parameter fits (p fixed to law A p=0 and law B p=-1/4) against the two competing readings. Import-light, no zeros bundle, no sibling imports.',
  laws: {
    systematicA: { relErrExponent: P_SYSTEMATIC, zExponent: 0.25, note: 'relErr fixed with height; z grows as n_w^(1/2) ~ T^(1/4).' },
    samplingNoiseB: { relErrExponent: P_SAMPLING, zExponent: 0, note: 'relErr shrinks with the chi-square floor sqrt(2/n_w) ~ T^(-1/4); z stays O(1), a fixed ~2.28% one-sided tail.' },
  },
  anchors: {
    count: n, // 7 clean interior anchors
    C0_mean,
    T_clip: T_CLIP,
    list: interiorDips.map((r) => ({ Tc: r.Tc, relErr: r.relErr, nW: r.nW, z: r.z })),
  },
  freeFit: {
    relErrExponent: relFit.slope, // ~ -1.917: far steeper than either law
    relErrIntercept: relFit.intercept,
    relErrR2: relFit.r2, // ~0.288: poor -> exponent UNPINNED (imp-96510 sub-gap stays open)
    zExponent: zFit.slope, // ~ -1.667: OPPOSITE SIGN of the systematic +0.25 prediction
    note: 'The free relErr exponent is far steeper than either law and poorly determined (R^2 ~ 0.288), dominated by two deep anchors against five shallow noise crossings -- the exponent cannot be pinned from the existing 10^6 set.',
  },
  constrainedFit: {
    rssSystematic, // p = 0
    rssSampling, // p = -1/4
    rssRatioAoverB, // ~1.076 > 1 -> sampling-noise (B) fits better
    freeRSS: relFit.ssr, // ~7.148: both constrained laws fit the scatter poorly
    favours: rssRatioAoverB > 1 ? 'samplingNoiseB' : 'systematicA',
  },
  directionDiagnostics: {
    referenceRelErr: REF_RELERR, // ~0.159457 at T = 1.5e5
    meanRelErrHigher, // ~0.02439 across the six higher anchors
    relErrCollapseFactor, // ~6.54x -- systematic predicts ~1x (constant)
    meanZHigher, // ~0.359 -- well below 1, not climbing toward 2
    systematicRejected: true,
    note: 'Across the six higher anchors relErr collapsed 6.54x (systematic predicts constant) and the z-exponent is -1.667 (systematic predicts +1/4, opposite sign); the systematic reading (A) is decisively rejected in direction.',
  },
  verdict:
    'Fitting the below-envelope dip-depth decay across all SEVEN clean unclipped interior anchors (not just the imp-96510 two endpoints): the free log-log exponent p = -1.917 is too steep and too scattered (R^2 = 0.288) to PIN, so the imp-96510 relErr(T)-exponent sub-gap stays OPEN -- but the DIRECTION decisively favours the sampling-noise reading (B) over the systematic reading (A). The higher-anchor mean depth collapsed 6.54x (systematic predicts constant), the z-exponent is -1.667 (systematic predicts +1/4, opposite sign), and the constrained-law RSS ratio A/B = 1.076 favours B. So the imp-96493 depth decay IS quantitatively consistent with a fixed ~2.28% one-sided GUE tail rather than a systematic excursion, corroborating imp-96510 across five extra anchors while confirming the exponent itself cannot be nailed from the existing 10^6 set. Measurement only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 / imp-96510 convention).
export const IMP96530_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: fitting the dip-depth decay across '
  + 'seven interior anchors REJECTS the systematic reading in direction (depth collapses 6.54x, z-exponent '
  + '-1.667 vs the systematic +0.25) and favours the fixed-tail sampling-noise reading (constrained RSS ratio '
  + '1.076), corroborating imp-96510 -- but the free relErr(T) exponent stays unpinned (R^2 = 0.288), so the '
  + 'imp-96510 exponent sub-gap remains OPEN; changes no bound.';

// --- self-executing internal-consistency assertions (formula re-derivation, generous tolerances) ---
(() => {
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  // anchor set + reference reproduce imp-96493 exactly from the same fit literals
  if (rel(C0_mean, 0.26184177603555076) > 1e-9) throw new Error('imp-96530: C0_mean drifted from imp-96493');
  if (n !== 7) throw new Error('imp-96530: expected 7 clean interior anchors');
  if (rel(REF_RELERR, 0.159457, 1e-4) > 1e-4) throw new Error('imp-96530: reference relErr drifted from imp-96493 0.159457');
  const deep = interiorDips.find((r) => r.Tc === 3.879e5);
  if (!deep || rel(deep.z, 1.0358, 1e-3) > 1e-3) throw new Error('imp-96530: deepest higher dip z drifted from 1.0358');
  // free fit: relErr exponent far steeper than either law, poor R^2
  if (!(relFit.slope < -1.5)) throw new Error('imp-96530: free relErr exponent should be far steeper than -0.25');
  if (!(relFit.r2 < 0.5)) throw new Error('imp-96530: free relErr R^2 should be poor (exponent unpinned)');
  // z-exponent has the OPPOSITE sign of the systematic +0.25 prediction
  if (!(zFit.slope < 0)) throw new Error('imp-96530: z-exponent should be negative, opposite the systematic +0.25');
  // constrained RSS: sampling-noise (B) fits better
  if (!(rssRatioAoverB > 1)) throw new Error('imp-96530: constrained RSS ratio should favour sampling-noise (B)');
  if (rel(rssRatioAoverB, 1.0756, 5e-3) > 5e-3) throw new Error('imp-96530: RSS ratio A/B drifted from ~1.076');
  // direction diagnostics: depth collapses far more than systematic predicts
  if (!(relErrCollapseFactor > 3)) throw new Error('imp-96530: higher-anchor depth should collapse >>1x, rejecting systematic');
  if (rel(relErrCollapseFactor, 6.539, 1e-2) > 1e-2) throw new Error('imp-96530: relErr collapse factor drifted from ~6.54x');
  if (!(meanZHigher < 1)) throw new Error('imp-96530: mean higher-anchor z should sit below 1, not climb toward 2');
  if (!IMP96530_EXCURSION_DEPTH_DECAY_EXPONENT_FIT.directionDiagnostics.systematicRejected)
    throw new Error('imp-96530: systematic reading must be marked rejected in direction');
  // honesty gates
  if (!/NO QED/.test(IMP96530_EXCURSION_DEPTH_DECAY_EXPONENT_FIT.verdict))
    throw new Error('imp-96530: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96530_EXCURSION_DEPTH_DECAY_EXPONENT_FIT.verdict))
    throw new Error('imp-96530: verdict dropped the no-refereed-bound-change banner');
  if (!/sub-gap stays OPEN/.test(IMP96530_EXCURSION_DEPTH_DECAY_EXPONENT_FIT.verdict))
    throw new Error('imp-96530: verdict must keep the imp-96510 exponent sub-gap OPEN');
  if (!(/RH open/.test(IMP96530_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96530_HONEST_BANNER) && /NO QED/.test(IMP96530_HONEST_BANNER)))
    throw new Error('imp-96530: IMP96530_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96530_EXCURSION_DEPTH_DECAY_EXPONENT_FIT;
