/**
 * @module imp-34203-endpoint-vs-fixed-band-peak-saturation-cross-viz-data
 * @fileoverview imp-34203 -- VIZ DATA ONLY cross-linking the opposite peak-saturation verdicts
 *   of imp-34108 (imp-33917 boundary-locked ENDPOINT peak: bounded fit peak = a - b/kEnd wins,
 *   saturates to a distant ceiling a ~ 1.678095) and imp-34109 (imp-33987 FIXED-BAND peak: the
 *   UNBOUNDED log fit peak = a + b*ln(kEnd) wins, no finite ceiling supported -- KEEPS CLIMBING).
 *
 *   Values below are baked reference literals, reproduced by re-evaluating
 *   IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION and
 *   IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.fixedBandRows. This module does NOT
 *   import either source file directly -- imp-34109 transitively pulls
 *   lambda-rh-height-mapping.js -> polymath15-constant-C-C.js, the same heavy chain the
 *   imp-34198/imp-34200 viz-data modules avoided -- per [[no_heavy_imports_in_pages]], pages
 *   must not transitively import the 16.7MB zeros bundle, so both peak-family tables are baked
 *   here instead of imported live.
 *
 *   @see imp-34108-endpoint-peak-saturating-ceiling-extrapolation.js (bounded ceiling a ~ 1.678095, SATURATES)
 *   @see imp-34109-fixed-band-peak-amplitude-saturation-fit.js (unbounded log wins, KEEPS CLIMBING)
 *   @see imp-33917-endpoint-residual-growth-law (the 9 endpoint peaks the imp-34108 fit reads)
 *   @see imp-33987 (the fixed-band peak family the imp-34109 fit reads)
 *
 *   Ticket: imp-34203 (ux, medium). Presentation only of two already-established measurements;
 *   adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

// imp-34108: the 9 imp-33917 boundary-locked endpoint peaks (kEnd = 11.00 .. 13.00, step 0.25),
// baked verbatim, plus the Akaike-winning bounded fit peak = a - b/kEnd (a = ceiling, b > 0).
export const IMP34203_ENDPOINT_PEAKS = Object.freeze([
  { kEnd: 11.0, peak: 0.247876 },
  { kEnd: 11.25, peak: 0.286305 },
  { kEnd: 11.5, peak: 0.321845 },
  { kEnd: 11.75, peak: 0.354118 },
  { kEnd: 12.0, peak: 0.383012 },
  { kEnd: 12.25, peak: 0.408428 },
  { kEnd: 12.5, peak: 0.430484 },
  { kEnd: 12.75, peak: 0.449303 },
  { kEnd: 13.0, peak: 0.465108 },
]);

export const IMP34203_ENDPOINT_FIT = Object.freeze({
  form: 'peak = a - b/kEnd (bounded/saturating; imp-34043 Akaike winner, reused verbatim by imp-34108)',
  ceiling: 1.678095, // a -- the extrapolated asymptotic ceiling; peak -> a as kEnd -> inf
  b: 15.629706,
  fitWindowEndKEnd: 13,
  peakAtWindowEdge: 0.475810,
  fracOfCeilingAtEdge: 0.2835, // ~28% of the cap at the last data point
  within1PercentKEnd: 931.4, // ~72x the window edge -- ceiling approached only astronomically far out
  reach1PercentWindows: 71.6,
  verdict: 'SATURATES',
});

// imp-34109: the 13 imp-33987 fixed-band (k <= 10) peaks (kEnd = 14.0 .. 20.0, step 0.5), baked
// verbatim, plus the three-way model tournament (bounded saturating vs. linear vs. unbounded log).
export const IMP34203_FIXED_BAND_PEAKS = Object.freeze([
  { kEnd: 14.0, peak: 0.383861 },
  { kEnd: 14.5, peak: 0.433367 },
  { kEnd: 15.0, peak: 0.480932 },
  { kEnd: 15.5, peak: 0.526291 },
  { kEnd: 16.0, peak: 0.569328 },
  { kEnd: 16.5, peak: 0.610045 },
  { kEnd: 17.0, peak: 0.648552 },
  { kEnd: 17.5, peak: 0.685053 },
  { kEnd: 18.0, peak: 0.71989 },
  { kEnd: 18.5, peak: 0.75359 },
  { kEnd: 19.0, peak: 0.787888 },
  { kEnd: 19.5, peak: 0.824645 },
  { kEnd: 20.0, peak: 0.865303 },
]);

export const IMP34203_FIXED_BAND_FIT = Object.freeze({
  boundedForm: 'peak = a - b/kEnd (bounded/saturating; OLS on regressor 1/kEnd)',
  boundedCeilingNominal: 1.95178, // nominal cap -- NOT the selected form
  boundedR2: 0.99804,
  logForm: 'peak = a + b * ln(kEnd) (unbounded; the SELECTED winner)',
  logR2: 0.99948, // highest R2 -- unbounded log wins over both bounded and linear
  linearR2: 0.99617,
  fitWindowEndKEnd: 20,
  peakAtWindowEdge: 0.865303,
  incrementMinimumKEnd: 18.5, // deceleration bottoms out here, then RE-ACCELERATES
  nominalCeilingWithin1PercentKEnd: 1131, // ~57x the window edge -- would-be approach, but not the winning form
  reach1PercentWindows: 56.5,
  verdict: 'KEEPS CLIMBING',
});

export const IMP34203_SUMMARY = Object.freeze({
  endpointCeiling: 1.678095,
  endpointVerdict: 'SATURATES (bounded fit wins; ceiling a ~ 1.678095, approached only at kEnd ~ 931, ~72x the window edge)',
  fixedBandVerdict: 'KEEPS CLIMBING (unbounded log fit wins; R2 0.99948 > 0.99804 bounded > 0.99617 linear; no finite ceiling supported)',
  contrast:
    'Two sibling boundary-residual peak families, fit with the SAME bounded saturating form ' +
    'peak = a - b/kEnd, reach OPPOSITE model-selection verdicts: the imp-33917 endpoint peak ' +
    'selects the bounded form (imp-34043/imp-34108), while the imp-33987 fixed-band peak selects ' +
    'an unbounded log form over the same bounded fit (imp-34040/imp-34109).',
});
