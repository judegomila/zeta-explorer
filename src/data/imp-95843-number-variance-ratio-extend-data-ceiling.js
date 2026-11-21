/**
 * imp-95843 -- EXTENDING the imp-95710 number-variance ratio r(T) above the T=5e5
 * ceiling toward the imp-95519 verified-height window, with the wider lever arm.
 *
 * imp-95710 tabulated r(T) = sd(C - E)^2 / Sigma^2(L) at six heights T = 1e4..5e5
 * (band [0.349, 0.480], mean 0.40, weak negative slope, R^2 ~ 0.30) and NAMED the
 * window-reach sub-gap: the six heights span only ~1.7 decades, ~6.8 decades below
 * the imp-95519 window bottom T = 3.0e12. imp-95735 flagged that whether the
 * ~0.40 mean-square/GUE conservatism persists, deepens, or reverts toward 1 above
 * the measured window is UNMEASURED. This module extends the same measurement to as
 * high a T as the in-repo zero table permits, refits the height trend, and reports
 * the updated forecast toward 3e12 with honest uncertainty.
 *
 * METHOD (import-light, no zeros bundle). Same tiled-window estimator as
 * tmp/imp-95562-msq-vs-pointwise.mjs re-run over the 10^6 Odlyzko ordinates in
 * src/data/zeros-to-1e6.js via tmp/imp-95843-extend.mjs, adding two nominal centers
 * ABOVE 5e5 (5.5e5, 5.8e5). For each center the estimator tiles non-overlapping
 * half-width windows across +/-30% of center, capped at the data ceiling
 * MAXG = gamma(10^6) = 600269.677, and measures the pointwise-count discrepancy
 * D = C - E and its standard deviation sd(D). The six lower rows reproduce imp-95710
 * exactly; only the two new rows and the refit are new. Every non-zero-dependent
 * quantity is recomputed here from the closed forms.
 *
 * FINDINGS.
 *  1. DATA-CEILING SATURATION (the operative result). Nominal centers above 5e5 do
 *     NOT extend the effective sampled height. Because the +/-30% window span is
 *     truncated at the data ceiling MAXG = 6.00e5, the EFFECTIVE mean sampled height
 *     rises only from 4.75e5 (nominal 5e5) to 5.03e5 (nominal 5.8e5) -- a mere 0.025
 *     decades. The lever arm toward 3e12 is essentially unchanged; the binding
 *     constraint is DATA AVAILABILITY (the Odlyzko 10^6 table caps at gamma ~ 6e5),
 *     NOT the choice of centers.
 *  2. The two new ratios r = 0.371 (nominal 5.5e5) and 0.374 (nominal 5.8e5) sit
 *     squarely inside the imp-95710 band [0.349, 0.480]; the conservatism persists
 *     and shows NO trend toward the GUE asymptote 1. The eight-point refit gives
 *     slope d r / d(log h) = -1.96e-2 (was -2.08e-2), R^2 = 0.34, mean 0.394 --
 *     statistically indistinguishable from the six-point fit, as expected since the
 *     added points barely move the height.
 *  3. HONEST SUB-GAP (data-ceiling, sharpening the imp-95710 window-reach gap). The
 *     in-repo zero table cannot measure r(T) above an effective height ~5e5; the gap
 *     to the imp-95519 bottom T = 3.0e12 remains ~6.8 decades. The eight-point
 *     log-linear extrapolation (r -> 0.064 at 3e12) is STILL not a warranted forecast.
 *     Extending r(T) meaningfully upward requires a larger verified-zero dataset
 *     (higher Odlyzko/LMFDB tables), which is not in the repo -- OR the analytic
 *     imp-95722 envelope (r_cap(3e12) ~ 0.26), which is the route that actually
 *     reaches the window bottom.
 *
 * VERDICT. Pushing the r(T) measurement above 5e5 with the in-repo 10^6-ordinate
 * table is DATA-CEILING-LIMITED: the effective sampled height saturates near 5e5, so
 * the two new heights add points but almost no lever arm. The measured conservatism
 * (r ~ 0.37-0.48, mean 0.39, no rise toward GUE) is confirmed to the edge of the data,
 * but the ~6.8-decade gap to T = 3.0e12 remains a named sub-gap that only a larger
 * zero table (numeric) or the imp-95722 analytic envelope (r_cap ~ 0.26) can close.
 * Changes no bound; NO QED; no refereed bound is changed; the zero-side
 * route stays PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. Only the per-height sd(C - E),
 * the effective mean sampled height, and the mean local count L for the two new rows
 * are baked measured literals (from tmp/imp-95843-extend.mjs over the verified
 * ordinates); every derived quantity is recomputed here from the closed forms.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
// GUE number variance for a hard box of mean count L (Dyson-Mehta large-L asymptotic)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);

// The 10^6-th Odlyzko ordinate: the hard data ceiling that caps every window.
const DATA_CEILING_MAXG = 600269.677;

// Six lower rows: reproduced from imp-95710 (nominal center == effective mean height,
// L from the closed-form envelope). sdDiscrepancy measured over the 10^6 ordinates.
const LOWER = [
  { Tc: 1.0e4, effMeanT: 1.0e4, sdDiscrepancy: 0.6218, meanLocalCountL: null },
  { Tc: 3.0e4, effMeanT: 3.0e4, sdDiscrepancy: 0.5823, meanLocalCountL: null },
  { Tc: 7.0e4, effMeanT: 7.0e4, sdDiscrepancy: 0.5689, meanLocalCountL: null },
  { Tc: 1.5e5, effMeanT: 1.5e5, sdDiscrepancy: 0.6714, meanLocalCountL: null },
  { Tc: 3.0e5, effMeanT: 3.0e5, sdDiscrepancy: 0.6199, meanLocalCountL: null },
  { Tc: 5.0e5, effMeanT: 474991, sdDiscrepancy: 0.6078, meanLocalCountL: 980.22 },
];

// Two NEW rows above 5e5, baked from tmp/imp-95843-extend.mjs. effMeanT is the
// midpoint of the (truncated) tiled span -- it barely exceeds the 5e5 effMeanT
// because the upper window edge is pinned at DATA_CEILING_MAXG.
const EXTENDED = [
  { Tc: 5.5e5, effMeanT: 492484, sdDiscrepancy: 0.6234, meanLocalCountL: 1002.17 },
  { Tc: 5.8e5, effMeanT: 502980, sdDiscrepancy: 0.6261, meanLocalCountL: 1015.17 },
];

const MEASURED = [...LOWER, ...EXTENDED];

const ROWS = MEASURED.map((m) => {
  // L: use the closed-form envelope where the span is untruncated (effMeanT == Tc),
  // else the measured mean local count over the truncated tiling.
  const L = m.meanLocalCountL != null ? m.meanLocalCountL : envelopeCount(m.Tc);
  const gueVar = gueNumberVariance(L);
  const measuredVar = m.sdDiscrepancy * m.sdDiscrepancy;
  return {
    Tc: m.Tc, // nominal center
    effMeanT: m.effMeanT, // effective mean sampled height (== Tc when untruncated)
    logH: Math.log(m.effMeanT), // fit against the EFFECTIVE height, not the nominal center
    meanLocalCountL: L,
    measuredVariance: measuredVar, // sd(C - E)^2
    gueVariance: gueVar, // Sigma^2(L)
    varRatioMeasuredOverGUE: measuredVar / gueVar, // r(T)
    truncatedAtCeiling: m.meanLocalCountL != null, // window span capped by the data ceiling
  };
});

// least-squares fit of the var-ratio against log(effective height) over all eight rows
const n = ROWS.length;
const meanLogH = ROWS.reduce((s, r) => s + r.logH, 0) / n;
const meanRatio = ROWS.reduce((s, r) => s + r.varRatioMeasuredOverGUE, 0) / n;
let sxy = 0;
let sxx = 0;
for (const r of ROWS) {
  sxy += (r.logH - meanLogH) * (r.varRatioMeasuredOverGUE - meanRatio);
  sxx += (r.logH - meanLogH) * (r.logH - meanLogH);
}
const trendSlopePerLogT = sxy / sxx; // d r / d(log h)
const trendIntercept = meanRatio - trendSlopePerLogT * meanLogH;
let ssRes = 0;
let ssTot = 0;
for (const r of ROWS) {
  const pred = trendIntercept + trendSlopePerLogT * r.logH;
  ssRes += (r.varRatioMeasuredOverGUE - pred) ** 2;
  ssTot += (r.varRatioMeasuredOverGUE - meanRatio) ** 2;
}
const trendR2 = 1 - ssRes / ssTot;

const ratios = ROWS.map((r) => r.varRatioMeasuredOverGUE);
const minRatio = Math.min(...ratios);
const maxRatio = Math.max(...ratios);

// window / data reach: effective height barely moves despite the higher nominal centers
const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 verified-height window bottom
const prevTopEffHeight = ROWS[5].effMeanT; // the imp-95710 top (nominal 5e5)
const newTopEffHeight = ROWS[ROWS.length - 1].effMeanT; // this run's top
const effHeightGainDecades = Math.log10(newTopEffHeight / prevTopEffHeight); // ~0.025 -- tiny
const gapToWindowBottomDecades = Math.log10(WINDOW_BOTTOM_T / newTopEffHeight); // still ~6.8
// UNRELIABLE forecast (extrapolation far outside the noise-dominated fit; carried
// only to show it is NOT a warranted number, per the named sub-gap)
const extrapolatedRatioAtWindowBottom = trendIntercept + trendSlopePerLogT * Math.log(WINDOW_BOTTOM_T);

export const IMP95843_NUMBER_VARIANCE_RATIO_EXTEND_DATA_CEILING = {
  ticket: 'imp-95843',
  source:
    'imp-95710 (six heights T=1e4..5e5) extended above 5e5 via tmp/imp-95843-extend.mjs over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js (nominal centers 5.5e5, 5.8e5)',
  definitions: {
    varRatio: 'r(T) = sd(C - E)^2 / Sigma^2(L): measured pointwise number variance over the GUE asymptote',
    gueVariance: 'Sigma^2(L) = (1/pi^2)(log(2pi L) + gamma_E + 1), Dyson-Mehta large-L asymptotic',
    envelope: 'L = 2 Delta delta(T), Delta = sqrt(T/2pi), delta(T) = (1/2pi) log(T/2pi)',
    effMeanT: 'effective mean sampled height = midpoint of the (ceiling-truncated) tiled span; equals the nominal center only when the span is untruncated',
    trend: 'least-squares slope of r(T) against log(effMeanT) over the eight sample heights, with its R^2',
  },
  dataCeiling: DATA_CEILING_MAXG,
  rows: ROWS,
  trend: {
    slopePerLogT: trendSlopePerLogT, // d r / d(log h): weakly negative, ~-1.96e-2
    intercept: trendIntercept,
    r2: trendR2, // ~0.34: still noise-dominated
    meanRatio, // ~0.39
    minRatio, // ~0.349
    maxRatio, // ~0.480
    risesTowardGUE: trendSlopePerLogT > 0, // false: ratio does not climb toward 1
  },
  windowReach: {
    prevTopEffHeight, // ~4.75e5 (imp-95710 top)
    newTopEffHeight, // ~5.03e5 (this run)
    effHeightGainDecades, // ~0.025 -- the data ceiling pins the effective height
    windowBottomT: WINDOW_BOTTOM_T, // imp-95519
    gapToWindowBottomDecades, // still ~6.8 decades unmeasured
    extrapolatedRatioAtWindowBottom, // ~0.06 log-linear -- UNWARRANTED, see subGap
    subGap:
      'DATA CEILING (sharpening the imp-95710 window-reach gap): the in-repo 10^6-ordinate table caps at gamma ~ 6.00e5, so tiling +/-30% windows above 5e5 truncates at the ceiling and the EFFECTIVE mean sampled height rises only ~0.025 decades (4.75e5 -> 5.03e5). Nominal centers above 5e5 add points but no lever arm; the gap to the imp-95519 bottom T = 3.0e12 stays ~6.8 decades. The log-linear extrapolation (r -> 0.06) is NOT warranted. Extending r(T) upward needs a larger verified-zero dataset OR the imp-95722 analytic envelope (r_cap(3e12) ~ 0.26).',
  },
  verdict:
    'EXTENDING the imp-95710 number-variance ratio r(T) above 5e5 with the in-repo 10^6-ordinate table is DATA-CEILING-LIMITED: because the +/-30% tiled windows truncate at gamma ~ 6.00e5, the effective mean sampled height rises only ~0.025 decades (4.75e5 -> 5.03e5) despite the higher nominal centers, so the two new heights (r = 0.371, 0.374) add points but almost no lever arm. They sit inside the imp-95710 band [0.349, 0.480]; the eight-point refit (slope ~ -1.96e-2, R^2 ~ 0.34, mean ~ 0.39) is statistically indistinguishable from the six-point fit and shows NO trend toward the GUE asymptote 1 -- the mean-square/GUE envelope stays conservative to the edge of the data. HONEST SUB-GAP (data ceiling): the ~6.8-decade gap to the imp-95519 bottom T = 3.0e12 is unchanged and the log-linear extrapolation (r -> 0.06) is not warranted; closing it needs a larger verified-zero table (numeric) or the imp-95722 analytic envelope (r_cap(3e12) ~ 0.26, the route that actually reaches the bottom). Changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the six lower rows reproduce the imp-95710 band and ratios
  if (!approx(ROWS[0].varRatioMeasuredOverGUE, 0.48, 0.01))
    throw new Error('imp-95843: lower row 0 var ratio drifted from imp-95710');
  // the two new rows sit inside the imp-95710 band [0.349, 0.480]
  for (let i = 6; i < ROWS.length; i++) {
    const r = ROWS[i].varRatioMeasuredOverGUE;
    if (!(r >= 0.349 && r <= 0.480))
      throw new Error('imp-95843: extended row outside the imp-95710 band [0.349, 0.480]');
    if (!ROWS[i].truncatedAtCeiling)
      throw new Error('imp-95843: extended row not flagged as ceiling-truncated');
  }
  // every per-height ratio sits strictly below the GUE asymptote (finite-height suppression)
  for (const r of ROWS) if (!(r.varRatioMeasuredOverGUE > 0 && r.varRatioMeasuredOverGUE < 1))
    throw new Error('imp-95843: var ratio outside (0,1)');
  // DATA-CEILING SATURATION: the effective height barely moved despite higher centers
  if (!(effHeightGainDecades >= 0 && effHeightGainDecades < 0.05))
    throw new Error('imp-95843: effective height gain unexpectedly large -- ceiling saturation claim broken');
  // the eight-point trend still does NOT rise toward GUE
  if (!(trendSlopePerLogT <= 0)) throw new Error('imp-95843: ratio unexpectedly climbs toward GUE');
  // still noise-dominated
  if (!(trendR2 >= 0 && trendR2 < 0.6)) throw new Error('imp-95843: trend R^2 outside the noise-dominated range');
  // the data-ceiling gap to the imp-95519 bottom is still multi-decade
  if (!(gapToWindowBottomDecades > 5)) throw new Error('imp-95843: window-reach gap unexpectedly small');
  // honesty gates
  if (!/NO QED/.test(IMP95843_NUMBER_VARIANCE_RATIO_EXTEND_DATA_CEILING.verdict))
    throw new Error('imp-95843: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95843_NUMBER_VARIANCE_RATIO_EXTEND_DATA_CEILING.verdict))
    throw new Error('imp-95843: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95843_NUMBER_VARIANCE_RATIO_EXTEND_DATA_CEILING;
