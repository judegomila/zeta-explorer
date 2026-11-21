/**
 * @module imp-96273-detector-zero40-extrapolation
 *
 * imp-96273 (numerical): extrapolate the imp-96059 Route L detector N_det ladder to estimate the
 * Levinson truncation order N at which zero 40 (gamma_0 = 122.9468) would FIRST be detected -- it
 * is measured UNDETECTED through N = 400 across all delta (imp-96059 rows). Two independent
 * power-law extrapolations are run on the detected zeros (indices 1,3,6,10,20) and both PREDICT
 * detection far below 400, so the finding is a genuine TENSION, not a clean forecast:
 *
 *   - height basis:  N_det = A * gamma_0^b  (A = 0.364336, b = 1.271686, r2 = 0.976; reproduces
 *     imp-96149_DETECTOR_FIT exactly)  ->  N_det(122.9468) = 165.6
 *   - index basis:   N_det = A * k^b       (A = 10.3239, b = 0.714264, r2 = 0.963)
 *     ->  N_det(index 40) = 143.9
 *
 * Both point estimates (~144-166) lie BELOW the measured non-detection order 400. The height-fit
 * 95% log-log prediction interval is [82.5, 332.4]; the observed lower bound N_det >= 400 sits
 * ABOVE that upper end. So the reach law is SUPER-power at gamma ~ 123: zero 40 is harder to
 * detect than the fit on zeros 1..20 extrapolates -- consistent with imp-96149's clean-prefix
 * height reach at N = 400 (122.482) landing just below gamma_0 = 122.9468 (resolution-limited at
 * the fit boundary, not a positivity failure; PD holds for all N, imp-96046/96068).
 *
 * FIRM CONCLUSION: only a lower bound is certain -- N_det(zero 40) >= 400, i.e. at least ~2.4x the
 * point extrapolation. The power-law reach systematically UNDER-predicts the first-detection order
 * at this height; a fresh finer N_det grid (SG-96149-grid) is still needed to pin the true value.
 *
 * Reference literals copied verbatim from imp-96059 / imp-96149; pure-JS refit reproduced in
 * tmp/imp-96273-scratch.mjs. Measurement/extrapolation only; changes NO bound; the verified-zero
 * route stays cheaper; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96059-detector-reach-ladder-viz-data.js (IMP96059_NDET_RANGE_BY_ZERO, canonical rows)
 * @see imp-96149-route-l-detector-reach-law-fit.js (IMP96149_DETECTOR_FIT, IMP96149_UNDETECTED_TAIL)
 *
 * Ticket: imp-96273 (numerical, low). RH-equivalent context; NO QED.
 */

// Height-basis extrapolation: N_det = A * gamma_0^b fit to the five detected zeros (delta = 0.1).
export const IMP96273_HEIGHT_EXTRAP = Object.freeze({
  form: 'N_det = A * gamma_0^b',
  A: 0.364336, b: 1.271686, r2: 0.975997,
  gammaFit: Object.freeze([14.1347, 25.0109, 37.5862, 49.7738, 77.1448]),
  nDetFit: Object.freeze([12, 20, 33, 48, 107]),
  target: Object.freeze({ zeroIndex: 40, gamma0: 122.9468 }),
  nDetPoint: 165.6,
  ci95Mean: Object.freeze([99.5, 275.5]),      // 95% CI on the log-log mean at gamma_0 = 122.9468
  pi95Single: Object.freeze([82.5, 332.4]),    // 95% prediction interval for a single new order
});

// Index-basis cross-check: N_det = A * k^b fit to (index, N_det) pairs -- an independent basis.
export const IMP96273_INDEX_CROSSCHECK = Object.freeze({
  form: 'N_det = A * k^b',
  A: 10.323857, b: 0.714264, r2: 0.963248,
  indexFit: Object.freeze([1, 3, 6, 10, 20]),
  nDetFit: Object.freeze([12, 20, 33, 48, 107]),
  nDetPointAt40: 143.9,
});

// The measured constraint that both extrapolations must live with: zero 40 is undetected at N=400.
export const IMP96273_MEASURED_LOWER_BOUND = Object.freeze({
  zeroIndex: 40, gamma0: 122.9468,
  nDetLowerBound: 400,           // undetected across all delta = 0.4..0.025 through N = 400
  detected: false,
  pointOverMeasuredRatio: 400 / 165.6, // observed lower bound / height-fit point estimate ~ 2.42
});

export const IMP96273_VERDICT =
  'Both power-law extrapolations of the imp-96059 detector ladder (height basis N_det = 0.364 * gamma^1.272 -> 165.6; '
  + 'index basis N_det = 10.32 * k^0.714 -> 143.9) place zero 40 detection near N ~ 144-166, but the measured rows show it '
  + 'UNDETECTED through N = 400 across all delta. The observed lower bound N_det >= 400 sits above the height-fit 95% '
  + 'prediction interval [82.5, 332.4], so the Route L reach law is SUPER-power at gamma ~ 123 -- detection is harder than '
  + 'the fit on zeros 1..20 forecasts, and only the lower bound N_det >= 400 (>= 2.4x the point estimate) is firm. '
  + 'Consistent with imp-96149 clean-prefix reach 122.48 < 122.95 at N = 400 (resolution-limited at the fit boundary, PD holds). '
  + 'Extrapolation only; changes NO bound; verified-zero route stays cheaper; RH open; NO QED. '
  + 'Sub-gap SG-96273-tail: a finer N_det grid past zero 20 (more indices/delta at high dps) is needed to pin the true order.';

export const IMP96273_SCRIPTS = Object.freeze(['tmp/imp-96273-scratch.mjs']);
