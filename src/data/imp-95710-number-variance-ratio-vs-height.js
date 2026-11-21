/**
 * imp-95710 -- TABULATING the imp-95562 finite-height number-variance ratio vs height.
 *
 * imp-95562 finding 4 collapsed the pointwise-variance-vs-GUE ratio to a SINGLE mean
 * (0.40 over T up to 5e5), reading the GUE/mean-square envelope Sigma^2(L) =
 * (1/pi^2)(log(2pi L) + gamma_E + 1) as a CONSERVATIVE over-estimate of the true
 * pointwise fluctuation at accessible heights. But a single mean hides the height
 * TREND: is the ratio rising toward the GUE asymptote 1 with height (so the
 * conservatism CLOSES before the imp-95519 window bottom T = 3.0e12), flat, or falling?
 *
 * METHOD (import-light, no zeros bundle). The zero-dependent inputs are the six
 * per-height pointwise standard deviations sd(C - E) baked from the imp-95562 offline
 * run (tmp/imp-95562-msq-vs-pointwise.mjs) over the 10^6 Odlyzko ordinates in
 * src/data/zeros-to-1e6.js. Everything else is re-derived from the closed forms:
 * the mean-square envelope count L = 2 Delta delta(T), Delta = sqrt(T/2pi),
 * delta(T) = (1/2pi) log(T/2pi), and the GUE variance Sigma^2(L). The per-height
 * var-ratio is r(T) = sd(C - E)^2 / Sigma^2(L), and a least-squares fit of r vs log T
 * gives the trend slope and its R^2.
 *
 * FINDINGS.
 *  1. The per-height var-ratio does NOT trend toward the GUE asymptote 1. It wanders
 *     in a narrow band r in [0.349, 0.480] (mean 0.402) across T = 1e4..5e5, with a
 *     WEAK negative log-linear slope d r / d(log T) = -2.08e-2 whose fit is
 *     noise-dominated (R^2 = 0.30, non-monotone -- the T = 1.5e5 point bumps to 0.462).
 *  2. So over the measured window the mean-square/GUE envelope stays CONSERVATIVE
 *     (r ~ 0.4, well below 1) and the finite-height arithmetic suppression does NOT
 *     close upward with height; if anything r drifts slightly down.
 *  3. HONEST SUB-GAP (window reach). The six heights span only ~1.7 decades in T
 *     (1e4..5e5), about 6.8 decades below the imp-95519 window bottom T = 3.0e12.
 *     A log-linear extrapolation of the noise-dominated fit sends r -> 0.04 at 3e12,
 *     which is NOT a warranted forecast from six scattered points: whether the
 *     suppression persists, deepens, or reverts toward the GUE value 1 at 3e12 is
 *     UNMEASURED. The conservatism is established only across the measured window.
 *
 * VERDICT. The finite-height number-variance ratio is flat-to-weakly-falling (mean
 * 0.40, band [0.35, 0.48]) across T = 1e4..5e5 and shows NO trend toward GUE closure;
 * the mean-square envelope stays conservative in the measured window. Extending that
 * conservatism to the imp-95519 window bottom T = 3.0e12 is a NAMED sub-gap (window
 * reach), not something these six heights decide. Changes no bound; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. Only the six sd(C - E) values are
 * baked measured literals (from imp-95562 over the verified ordinates); every derived
 * quantity is recomputed here from the closed forms.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
// GUE number variance for a hard box of mean count L (Dyson-Mehta large-L asymptotic)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);

// Baked from tmp/imp-95562-msq-vs-pointwise.mjs over the 10^6 Odlyzko ordinates:
// Tc = sample height, sdDiscrepancy = measured std of the pointwise discrepancy C - E.
// These two per-height columns are the only zero-dependent inputs.
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

const ROWS = MEASURED.map((m) => {
  const L = envelopeCount(m.Tc);
  const gueVar = gueNumberVariance(L);
  const measuredVar = m.sdDiscrepancy * m.sdDiscrepancy;
  return {
    Tc: m.Tc,
    logT: Math.log(m.Tc),
    meanLocalCountL: L, // mean-square envelope count
    measuredVariance: measuredVar, // measured pointwise variance sd(C - E)^2
    gueVariance: gueVar, // GUE Sigma^2(L)
    varRatioMeasuredOverGUE: measuredVar / gueVar, // r(T) = measured / GUE
  };
});

// least-squares fit of the var-ratio against log T (the height trend)
const n = ROWS.length;
const meanLogT = ROWS.reduce((s, r) => s + r.logT, 0) / n;
const meanRatio = ROWS.reduce((s, r) => s + r.varRatioMeasuredOverGUE, 0) / n;
let sxy = 0;
let sxx = 0;
for (const r of ROWS) {
  sxy += (r.logT - meanLogT) * (r.varRatioMeasuredOverGUE - meanRatio);
  sxx += (r.logT - meanLogT) * (r.logT - meanLogT);
}
const trendSlopePerLogT = sxy / sxx; // d r / d(log T)
const trendIntercept = meanRatio - trendSlopePerLogT * meanLogT;
let ssRes = 0;
let ssTot = 0;
for (const r of ROWS) {
  const pred = trendIntercept + trendSlopePerLogT * r.logT;
  ssRes += (r.varRatioMeasuredOverGUE - pred) ** 2;
  ssTot += (r.varRatioMeasuredOverGUE - meanRatio) ** 2;
}
const trendR2 = 1 - ssRes / ssTot; // goodness of the log-linear trend

const ratios = ROWS.map((r) => r.varRatioMeasuredOverGUE);
const minRatio = Math.min(...ratios);
const maxRatio = Math.max(...ratios);

// window reach: the sampled heights vs the imp-95519 window bottom (log10 decades)
const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 verified-height window bottom
const measuredSpanDecades = Math.log10(ROWS[ROWS.length - 1].Tc / ROWS[0].Tc);
const gapToWindowBottomDecades = Math.log10(WINDOW_BOTTOM_T / ROWS[ROWS.length - 1].Tc);
// UNRELIABLE forecast (extrapolation far outside the noise-dominated fit; carried
// only to show it is NOT a warranted number, per the named sub-gap)
const extrapolatedRatioAtWindowBottom = trendIntercept + trendSlopePerLogT * Math.log(WINDOW_BOTTOM_T);

export const IMP95710_NUMBER_VARIANCE_RATIO_VS_HEIGHT = {
  ticket: 'imp-95710',
  source:
    'imp-95562 finding 4 (finite-height pointwise-variance-vs-GUE ratio); the six sd(C - E) inputs were measured over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js via tmp/imp-95562-msq-vs-pointwise.mjs',
  definitions: {
    varRatio: 'r(T) = sd(C - E)^2 / Sigma^2(L): measured pointwise number variance over the GUE asymptote',
    gueVariance: 'Sigma^2(L) = (1/pi^2)(log(2pi L) + gamma_E + 1), Dyson-Mehta large-L asymptotic',
    envelope: 'L = 2 Delta delta(T), Delta = sqrt(T/2pi), delta(T) = (1/2pi) log(T/2pi)',
    trend: 'least-squares slope of r(T) against log T over the six sample heights, with its R^2',
  },
  rows: ROWS,
  trend: {
    slopePerLogT: trendSlopePerLogT, // d r / d(log T): weakly negative
    intercept: trendIntercept,
    r2: trendR2, // ~0.30: noise-dominated, no clean trend
    meanRatio, // ~0.40, matches imp-95562 collapsed mean
    minRatio, // ~0.349
    maxRatio, // ~0.480
    risesTowardGUE: trendSlopePerLogT > 0, // false: ratio does not climb toward 1
  },
  windowReach: {
    measuredBottomT: ROWS[0].Tc,
    measuredTopT: ROWS[ROWS.length - 1].Tc,
    windowBottomT: WINDOW_BOTTOM_T, // imp-95519
    measuredSpanDecades, // ~1.7
    gapToWindowBottomDecades, // ~6.8 decades unmeasured
    extrapolatedRatioAtWindowBottom, // ~0.04 log-linear -- UNWARRANTED, see subGap
    subGap:
      'WINDOW REACH: the six heights span only ~1.7 decades (T = 1e4..5e5), about 6.8 decades below the imp-95519 window bottom T = 3.0e12. The log-linear extrapolation (r -> 0.04) is NOT warranted from six noise-dominated points (R^2 ~ 0.30); whether the finite-height suppression persists, deepens, or reverts toward the GUE value 1 at 3e12 is UNMEASURED.',
  },
  verdict:
    'TABULATED per height, the imp-95562 number-variance ratio r(T) = measured pointwise variance / GUE Sigma^2(L) does NOT trend toward the GUE asymptote 1. It sits in a narrow band r in [0.35, 0.48] (mean 0.40) across T = 1e4..5e5 with a WEAK negative log-linear slope (d r / d(log T) ~ -2.1e-2, R^2 ~ 0.30, non-monotone), so over the measured window the mean-square/GUE envelope stays CONSERVATIVE and the finite-height arithmetic suppression does not close upward with height. HONEST SUB-GAP: the sampled window spans only ~1.7 decades and is ~6.8 decades below the imp-95519 bottom T = 3.0e12, so extending the conservatism to the window bottom is a named window-reach gap, not something these six heights decide (the log-linear extrapolation r -> 0.04 is not a warranted forecast). Changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // envelope + GUE closed forms match a spot value
  const r0 = ROWS[0];
  if (!approx(r0.meanLocalCountL, 2 * Math.sqrt(1.0e4 / TWO_PI) * Math.log(1.0e4 / TWO_PI) / TWO_PI, 1e-9))
    throw new Error('imp-95710: envelope L formula mismatch');
  if (!approx(r0.gueVariance, (Math.log(TWO_PI * r0.meanLocalCountL) + EULER + 1) / (Math.PI * Math.PI), 1e-12))
    throw new Error('imp-95710: GUE variance formula mismatch');
  // every per-height ratio sits strictly below the GUE asymptote (finite-height suppression)
  for (const r of ROWS) if (!(r.varRatioMeasuredOverGUE > 0 && r.varRatioMeasuredOverGUE < 1))
    throw new Error('imp-95710: var ratio outside (0,1)');
  // the collapsed mean matches the imp-95562 headline ~0.40
  if (!approx(meanRatio, 0.40, 0.02)) throw new Error('imp-95710: mean ratio drifted from the imp-95562 0.40 headline');
  // the trend does NOT rise toward GUE (this is the whole finding)
  if (!(trendSlopePerLogT <= 0)) throw new Error('imp-95710: ratio unexpectedly climbs toward GUE -- re-verify the trend');
  // the fit is noise-dominated, not a clean trend
  if (!(trendR2 >= 0 && trendR2 < 0.6)) throw new Error('imp-95710: trend R^2 outside the noise-dominated range');
  // window-reach sub-gap is real (a multi-decade gap below the imp-95519 bottom)
  if (!(gapToWindowBottomDecades > 5)) throw new Error('imp-95710: window-reach gap unexpectedly small');
  // honesty gate: measurement, not a bound change
  if (!/NO QED/.test(IMP95710_NUMBER_VARIANCE_RATIO_VS_HEIGHT.verdict))
    throw new Error('imp-95710: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95710_NUMBER_VARIANCE_RATIO_VS_HEIGHT.verdict))
    throw new Error('imp-95710: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95710_NUMBER_VARIANCE_RATIO_VS_HEIGHT;
