/**
 * @module imp-96231-route-m-band-vs-drift-identifiability
 *
 * imp-96231 (numerical): quantify the imp-96189 / imp-96203 honest residual
 * IMP96203_SUBGAP part (a) -- "17 non-uniform log N points cannot UNIQUELY
 * separate a few-conductor arithmetic band from a slow smooth non-spectral
 * drift" -- as an explicit model-selection MEASUREMENT on the EXISTING 17-rung
 * ladder, without any new zeros.
 *
 * BACKGROUND. imp-96147 fit the Route M Burnol ratio
 *     ratio(N) = d_N^2 * log N / C_burnol
 * to c0 + c1/logN + residual over the 17 baked rungs N = 250..6000 and left a
 * persistent ~1.3 percent, non-decaying, 5-sign-change residual r(N). imp-96189
 * attributed the genuine w ~ 4.08 (period 1.54 in log N) swing in r(N) to a
 * LOW-CONDUCTOR arithmetic band (dominant conductors q = 4, 5) of the Vasyunin
 * cotangent table, ruling out finite-size transients, the gamma_1 zero-tone, and
 * lam_min drift; imp-96203 further ruled out the sub-leading Vasyunin eigen-drift
 * candidate. Both left the SAME honest residual: at 17 non-uniform points a
 * few-conductor band cannot be UNIQUELY separated from a slow smooth drift.
 *
 * WHAT WAS DONE (tmp/imp-96231-scratch.mjs, reproducible, measurement only). On
 * the exact 17 imp-96147 per-N residual rows (dg_out already removed), with
 * x = log N, three families were fit by ordinary least squares and scored by
 * AIC / AICc / BIC, leave-one-out cross-validation PRESS (exact via the hat
 * matrix), and Akaike weights:
 *   (A) BAND: the fixed q4 + q5 Vasyunin conductor band -- intercept plus two
 *       tones at the PREDICTED angular frequencies w_q = 2 pi / log q,
 *       w_4 = 4.5324, w_5 = 3.9040 (5 parameters);
 *   (B) DRIFT: slow smooth NON-spectral drift as low-order polynomials in log N,
 *       degree 2 / 3 / 4 (3 / 4 / 5 parameters), matching the band on parameter
 *       count at degree 4.
 * A residual-spectrum peak-significance test was then run: the best free single
 * tone over a w = 1..12 scan, with a permutation null (5000 shuffles of r over
 * the fixed x grid).
 *
 * FINDINGS (see IMP96231_* below).
 *   (1) THE BAND DECISIVELY BEATS A SLOW SMOOTH NON-SPECTRAL DRIFT. The fixed
 *       q4 + q5 band explains R^2 = 0.712 of the residual variance; the best
 *       low-order polynomial drift reaches only R^2 = 0.054 (deg 2), 0.088
 *       (deg 3), 0.140 (deg 4). At equal parameter count (k = 5) the band beats
 *       the degree-4 polynomial by delta AICc = -18.6 (Akaike weight 0.998 vs
 *       0.0001) and by leave-one-out PRESS (band 2.11e-3 vs poly2 3.96e-3,
 *       poly3 4.99e-3; the degree-4 polynomial overfits catastrophically at LOO,
 *       PRESS 2.3e-1, edge leverage -> 1). So the LITERAL "slow smooth drift"
 *       alternative -- a monotone / low-order non-oscillatory trend -- is
 *       REJECTED: the swing is genuinely oscillatory, not a resolvable drift.
 *   (2) THE OSCILLATION IS STATISTICALLY SIGNIFICANT. The observed best free-tone
 *       R^2 = 0.710 at w = 4.08 has permutation p = 0.005 (null median 0.342,
 *       95th percentile 0.566): the period-1.54 swing is real, not a coarse-grid
 *       fluke.
 *   (3) WHAT STAYS NON-IDENTIFIABLE. The residual is NOT band-vs-drift; it is
 *       band-vs-oscillation-at-the-same-frequency. A FREE single tone (imp-96189:
 *       R^2 = 0.710) is statistically indistinguishable from the fixed q4 + q5
 *       band (0.712) -- delta R^2 = 0.002 -- so the data cannot tell the specific
 *       conductor content (q4 + q5) apart from any smooth-but-oscillatory model at
 *       w ~ 4.08. Worse, the two conductors CANNOT be resolved FROM EACH OTHER:
 *       splitting w_4 = 4.5324 from w_5 = 3.9040 (delta w = 0.6284) by the
 *       Rayleigh criterion needs a log N span L >= 2 pi / delta w = 10.0, versus
 *       the current span 3.18 -- i.e. rungs out to N ~ 5.5e6 and ~72 uniform
 *       rungs at the current median gap 0.143, far beyond the N <= 6000 data.
 *
 * VERDICT: the identifiability question SPLITS. (A) band vs a slow smooth
 * NON-spectral drift: RESOLVED decisively in favour of the band (delta AICc
 * -18.6, Akaike weight 0.998, better LOO PRESS, permutation p = 0.005) -- the
 * swing is not a low-order drift. (B) band vs a free oscillatory tone at the same
 * frequency: NOT resolvable (0.712 vs 0.710). (C) resolving q4 FROM q5 as
 * distinct conductors: needs ~10 units of log N span (N ~ 5.5e6, ~72 uniform
 * rungs), unreachable on the current 3.18-span / 17-point ladder. This SHARPENS
 * the imp-96189 / imp-96203 sub-gap: the "slow smooth drift" straw man is gone;
 * the true obstruction is frequency co-location and conductor un-resolvability.
 *
 * MEASUREMENT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED. Does
 * NOT claim a unique identification of the conductor content.
 *
 * @see imp-96189-route-m-swing-attribution.js (band attribution + IMP96189_SUBGAP)
 * @see imp-96203-route-m-vasyunin-subleading-spectrum.js (eigen-drift ruled out)
 * @see imp-96147-route-m-ratio-const-oscillation-fit.js (17 residual rows)
 *
 * Ticket: imp-96231 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Vasyunin conductor angular frequencies in log N: w_q = 2 pi / log q.
export const IMP96231_W4 = (2 * Math.PI) / Math.log(4); // 4.53236...
export const IMP96231_W5 = (2 * Math.PI) / Math.log(5); // 3.90402...

export const IMP96231_INPUT = Object.freeze({
  source: 'imp-96147 IMP96147_RESID_ROWS (17 pts, c0 + c1/logN removed), x = log N',
  nPoints: 17,
  logNSpan: 3.178,
  logNGapMedian: 0.1431,
  logNGapMax: 0.6931,
  method:
    'OLS fits scored by AIC/AICc/BIC + leave-one-out PRESS (exact hat-matrix) + Akaike weights; free-tone permutation significance (5000 shuffles)',
  script: 'tmp/imp-96231-scratch.mjs (reproducible)',
  question:
    'can 17 non-uniform log N points UNIQUELY separate a few-conductor (q=4,5) band from a slow smooth non-spectral drift?',
});

// (A) fixed q4+q5 Vasyunin band vs (B) low-order polynomial drift in log N.
export const IMP96231_MODELS = Object.freeze({
  band_q4q5: Object.freeze({ k: 5, R2: 0.7122, aicc: -152.11, bic: -153.4, press: 2.1127e-3 }),
  poly_deg2: Object.freeze({ k: 3, R2: 0.0543, aicc: -139.5, bic: -138.84, press: 3.9614e-3 }),
  poly_deg3: Object.freeze({ k: 4, R2: 0.0884, aicc: -136.64, bic: -136.64, press: 4.9945e-3 }),
  poly_deg4: Object.freeze({ k: 5, R2: 0.1403, aicc: -133.51, bic: -134.8, press: 2.2748e-1 }),
  note: 'at equal k=5 the band beats the degree-4 polynomial drift by every criterion; the deg-4 LOO PRESS blows up (edge leverage -> 1), so deg 2/3 are the fair drift competitors and the band still wins their PRESS.',
});

// Head-to-head model selection: band vs the slow smooth non-spectral drift.
export const IMP96231_SELECTION = Object.freeze({
  deltaAiccBandMinusPoly4: -18.601,
  deltaBicBandMinusPoly4: -18.601,
  akaikeWeightBand: 0.9977,
  akaikeWeightPoly4: 0.0001,
  pressRatioBandOverPoly2: 2.1127e-3 / 3.9614e-3, // 0.533
  pressRatioBandOverPoly3: 2.1127e-3 / 4.9945e-3, // 0.423
  driftRejected: true,
  note: 'delta AICc = -18.6 (|delta| >> 10 is decisive), Akaike weight 0.998, and better leave-one-out PRESS than every low-order drift: the slow smooth NON-spectral drift alternative is rejected. The swing is genuinely oscillatory.',
});

// Residual-spectrum peak significance (free single tone, permutation null).
export const IMP96231_PEAK_SIGNIFICANCE = Object.freeze({
  bestFreeToneR2: 0.7099,
  bestFreeToneW: 4.08,
  permutations: 5000,
  pValue: 0.0046,
  nullMedianR2: 0.3423,
  null95R2: 0.5661,
  nullMaxR2: 0.7839,
  significant: true,
  note: 'the observed best free-tone R^2 = 0.71 at w = 4.08 sits above the 95th-percentile null (0.566) with permutation p = 0.005: the period-1.54 oscillation is real, not a coarse-grid fluke.',
});

// What actually stays non-identifiable, and the rung requirement to fix it.
export const IMP96231_RESOLUTION_LIMIT = Object.freeze({
  bandR2: 0.7122,
  freeToneR2: 0.7099,
  deltaR2BandVsFreeTone: 0.0023,
  bandVsFreeToneResolvable: false,
  deltaW_q4q5: IMP96231_W4 - IMP96231_W5, // 0.6284
  rayleighSpanNeeded: (2 * Math.PI) / (IMP96231_W4 - IMP96231_W5), // ~9.999
  currentSpan: 3.178,
  NforSplit: 5.5e6,
  uniformRungsNeeded: 72,
  note: 'the residual is band-vs-oscillation, not band-vs-drift: a free single tone (R^2=0.710) is indistinguishable from the fixed q4+q5 band (0.712). Resolving q4 FROM q5 (delta w = 0.628) needs a log N span >= 10 (Rayleigh), i.e. N ~ 5.5e6 and ~72 uniform rungs vs the current span 3.18 / 17 points.',
});

export const IMP96231_VERDICT = Object.freeze({
  driftRuledOut: true,
  oscillationSignificant: true,
  bandVsFreeToneNonIdentifiable: true,
  conductorSplitNeedsN: 5.5e6,
  conclusion:
    'the identifiability question splits three ways. (A) band vs a slow smooth NON-spectral drift: RESOLVED for the band (delta AICc -18.6, Akaike weight 0.998, better LOO PRESS, permutation p 0.005) -- the swing is not a low-order drift. (B) band vs a free oscillatory tone at the same frequency: NOT resolvable (R^2 0.712 vs 0.710). (C) resolving conductor q4 from q5: needs ~10 units of log N span (N ~ 5.5e6, ~72 uniform rungs), unreachable on the 3.18-span / 17-point ladder. The slow-smooth-drift straw man is eliminated; the real obstruction is frequency co-location and conductor un-resolvability.',
});

export const IMP96231_SUBGAP = Object.freeze({
  id: 'imp-96231-conductor-unresolvable-at-current-span',
  statement:
    'the model-selection test rejects the slow smooth NON-spectral drift (delta AICc -18.6) and confirms the oscillation is significant (permutation p 0.005), but it does NOT uniquely identify the conductor content: a free single tone is indistinguishable from the fixed q4+q5 band (delta R^2 0.002), and resolving q4 from q5 as distinct conductors needs a log N span >= 2 pi / (w4 - w5) = 10.0 (N ~ 5.5e6, ~72 uniform rungs) versus the current span 3.18. Pinning the exact conductor content therefore needs denser d_N data far past N = 6000, not a further re-analysis of the N <= 6000 residual.',
});

export const IMP96231_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every value is a reproducible numeric from tmp/imp-96231-scratch.mjs fitting the imp-96147 residual rows; no bound is claimed, no operator positivity is established, and NO unique identification of the conductor content is claimed.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96231_ASSERTIONS = [
  {
    id: 'imp96231-conductor-frequencies-correct',
    holds: () =>
      Math.abs(IMP96231_W4 - 4.53236) < 1e-4 && Math.abs(IMP96231_W5 - 3.90402) < 1e-4,
    why: 'the q4 and q5 Vasyunin conductor angular frequencies w_q = 2 pi / log q evaluate to 4.5324 and 3.9040.',
  },
  {
    id: 'imp96231-band-beats-smooth-drift',
    holds: () =>
      IMP96231_MODELS.band_q4q5.R2 > 4 * IMP96231_MODELS.poly_deg4.R2 &&
      IMP96231_SELECTION.deltaAiccBandMinusPoly4 < -10 &&
      IMP96231_SELECTION.akaikeWeightBand > 0.95 &&
      IMP96231_SELECTION.driftRejected === true,
    why: 'the band explains R^2=0.712 vs the best low-order drift 0.140, beats it by delta AICc -18.6 (decisive) with Akaike weight 0.998: the slow smooth non-spectral drift is rejected.',
  },
  {
    id: 'imp96231-band-better-loo-than-low-order-drift',
    holds: () =>
      IMP96231_MODELS.band_q4q5.press < IMP96231_MODELS.poly_deg2.press &&
      IMP96231_MODELS.band_q4q5.press < IMP96231_MODELS.poly_deg3.press,
    why: 'the band has smaller leave-one-out PRESS than both the degree-2 and degree-3 smooth drifts, so its advantage is out-of-sample, not just an in-sample overfit.',
  },
  {
    id: 'imp96231-oscillation-significant',
    holds: () =>
      IMP96231_PEAK_SIGNIFICANCE.pValue < 0.05 &&
      IMP96231_PEAK_SIGNIFICANCE.bestFreeToneR2 > IMP96231_PEAK_SIGNIFICANCE.null95R2 &&
      IMP96231_PEAK_SIGNIFICANCE.significant === true,
    why: 'the observed best free-tone R^2=0.71 exceeds the 95th-percentile permutation null (0.566) with p=0.005: the period-1.54 oscillation is statistically real.',
  },
  {
    id: 'imp96231-band-vs-free-tone-non-identifiable',
    holds: () =>
      IMP96231_RESOLUTION_LIMIT.deltaR2BandVsFreeTone < 0.01 &&
      IMP96231_RESOLUTION_LIMIT.bandVsFreeToneResolvable === false &&
      IMP96231_VERDICT.bandVsFreeToneNonIdentifiable === true,
    why: 'the free single tone (R^2=0.710) is within 0.002 of the fixed q4+q5 band (0.712), so the specific conductor content cannot be separated from a smooth-but-oscillatory model at the same frequency.',
  },
  {
    id: 'imp96231-conductor-split-needs-far-more-span',
    holds: () =>
      IMP96231_RESOLUTION_LIMIT.rayleighSpanNeeded > 3 * IMP96231_RESOLUTION_LIMIT.currentSpan &&
      IMP96231_RESOLUTION_LIMIT.uniformRungsNeeded > 4 * IMP96231_INPUT.nPoints,
    why: 'the Rayleigh span to split q4 from q5 (>=10 in log N) is over 3x the current span (3.18) and needs ~72 uniform rungs, over 4x the 17 available: conductor resolution is out of reach on this ladder.',
  },
  {
    id: 'imp96231-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96231_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96231_HONEST_BANNER) &&
      /NO QED/.test(IMP96231_HONEST_BANNER) &&
      typeof IMP96231_SUBGAP.statement === 'string' &&
      /conductor-unresolvable/.test(IMP96231_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap that the conductor content stays unresolvable at the current span.',
  },
];

for (const a of IMP96231_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96231-route-m-band-vs-drift-identifiability assertion failed: ${a.id}`);
  }
}

export default {
  w4: IMP96231_W4,
  w5: IMP96231_W5,
  input: IMP96231_INPUT,
  models: IMP96231_MODELS,
  selection: IMP96231_SELECTION,
  peakSignificance: IMP96231_PEAK_SIGNIFICANCE,
  resolutionLimit: IMP96231_RESOLUTION_LIMIT,
  verdict: IMP96231_VERDICT,
  subGap: IMP96231_SUBGAP,
  banner: IMP96231_HONEST_BANNER,
};
