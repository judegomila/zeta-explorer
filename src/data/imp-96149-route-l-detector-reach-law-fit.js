/**
 * @module imp-96149-route-l-detector-reach-law-fit
 *
 * imp-96149 (numerical): refine the Route L (Li-Herglotz-CMV) detector reach law by FITTING
 * the reach constant to the existing measured data, and extrapolate the truncation order N
 * required to reach a target height -- assessing whether the reach is a genuine lever or a
 * fixed-cost detector.
 *
 * Inputs (measured, copied verbatim -- NO new heavy run here):
 *   - Detector rows N_det vs gamma_0 (imp-96059 / ROUTE_L.detector.rows), off-line quadruple
 *     1/2 +/- delta +/- i*gamma_0, N_det = first Levinson order with |kappa| >= 1.
 *   - Clean-prefix reach gamma_reach vs N (imp-96045 / ROUTE_L.a20.reachExtended.reachPrefix),
 *     the length of the true-zero prefix reproduced to 1e-12 at truncation order N.
 *
 * Method: power-law least squares in log-log (y = A * x^b) on each measured series, then invert
 * and extrapolate to the Platt-Trudgian verified height T0 ~ 3.0001e12.
 *
 * HEADLINE REFINEMENT: the earlier "linear reach gamma_{N/10}" recorded in imp-96059 is a stale
 * pre-extension claim; the measured laws are POWER laws, both SUBLINEAR in height:
 *   - detector:     gamma_det(N)   ~ 2.212 * N^0.786   (from N_det = 0.3643 * gamma^1.272)
 *   - clean-prefix: gamma_reach(N) ~ 13.55 * N^0.367   (index K ~ 1.437 * N^0.554)
 * The detector (off-line displacement sensitivity) reaches a given height at a MUCH lower N than
 * the clean-prefix reproduction of true zeros needs -- but BOTH extrapolate to astronomically
 * large N at the PT height, so Route L stays a fixed-cost detector, NOT a lever.
 *
 * Reproduce: tmp/imp-96149-fit.mjs (pure JS power-fit on the literals below).
 *
 * @see imp-96059-detector-reach-ladder-viz-data.js (detector rows, stale linear-reach string)
 * @see rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js (ROUTE_L.detector, ROUTE_L.a20.reachExtended)
 *
 * Ticket: imp-96149 (numerical, medium). Measurement/fit only; changes NO bound; RH open;
 * no refereed bound is changed; NO QED.
 */

// Detector power-law fit N_det = A * gamma_0^b (canonical delta = 0.1; nearly delta-independent).
// r2 = coefficient of determination in log-log.
export const IMP96149_DETECTOR_FIT = Object.freeze({
  form: 'N_det = A * gamma_0^b',
  delta: 0.1,
  A: 0.364336, b: 1.271686, r2: 0.975997,
  // all-delta pooled fit (delta = 0.4..0.025): confirms delta-near-independence of the exponent
  allDelta: Object.freeze({ A: 0.349427, b: 1.280246, r2: 0.962589 }),
  // inverted to a HEIGHT reach: the largest displaced-zero height the order-N detector resolves
  inverseHeightReach: Object.freeze({ form: 'gamma_det(N) = 2.212158 * N^0.786358', A: 2.212158, exponent: 0.786358 }),
  gammaFit: Object.freeze([14.1347, 25.0109, 37.5862, 49.7738, 77.1448]),
  nDetFit: Object.freeze([12, 20, 33, 48, 107]),
});

// Clean-prefix reach power-law fits from imp-96045 reachExtended.reachPrefix.
export const IMP96149_PREFIX_FIT = Object.freeze({
  heightForm: 'gamma_reach = A * N^b',   // height of the last true zero reproduced at order N
  heightA: 13.550752, heightB: 0.367443, heightR2: 0.979068,
  indexForm: 'K = A * N^b',              // clean-prefix length (resolved-zero count) at order N
  indexA: 1.436881, indexB: 0.553694, indexR2: 0.971601,
  N: Object.freeze([50, 100, 200, 400, 800]),
  gammaReach: Object.freeze([52.97, 79.34, 98.83, 121.37, 153.03]),
  indexK: Object.freeze([11, 21, 29, 39, 55]),
});

// Extrapolation to the Platt-Trudgian verified height T0 ~ 3.0001e12 (RH verified below T0).
// N_zerosBelowT0 by Riemann-von Mangoldt. All N estimates are astronomically beyond the ~1e14
// the (refuted) linear law implied; the honest clean-prefix law is worst by ~16 orders.
export const IMP96149_EXTRAPOLATION = Object.freeze({
  T0: 3.0001e12,
  zerosBelowT0: 1.2363e13,
  nNeeded: Object.freeze({
    refutedLinear: 1.2363e14,   // gamma_{N/10}: N ~ 10 * zerosBelowT0  (STALE, refuted)
    detectorPowerLaw: 3.2897e15, // N = 0.349427 * T0^1.280246
    cleanPrefixPowerLaw: 7.517e30, // N = (T0 / 13.550752)^(1/0.367443)
  }),
  zerosPerN_slope: Object.freeze({ firstDecade: 0.2, lastDecade: 0.04 }), // clean-prefix index slope: DECAYING
  spanOrdersOfMagnitude: 16, // between detector (~3e15) and clean-prefix (~7.5e30) estimates
});

// The single undetected zero at N = 400 (zero 40, gamma = 122.9468) sits just PAST the clean-prefix
// height reach at N = 400 (fit value 122.48), i.e. it is resolution-limited exactly at the fit
// boundary -- consistent with the power law, not a positivity failure.
export const IMP96149_UNDETECTED_TAIL = Object.freeze({
  N: 400, resolved: 39, total: 40,
  firstUndetectedZeroIndex: 40, firstUndetectedGamma: 122.9468,
  prefixHeightReachAt400: 122.482,
  note: 'zero 40 is 0.4 above the fitted clean-prefix reach at N=400: resolution-limited at the fit boundary, not a PD/positivity failure (PD holds for all N, imp-96046/96068).',
});

export const IMP96149_VERDICT =
  'The Route L reach is a POWER law, not linear: the imp-96059 "gamma_{N/10}" string is stale. '
  + 'Detector height reach gamma_det ~ 2.21 * N^0.786 (N_det = 0.364 * gamma^1.272, r2 = 0.98, delta-near-independent); '
  + 'clean-prefix height reach gamma_reach ~ 13.55 * N^0.367 (index K ~ 1.44 * N^0.554, r2 = 0.98). '
  + 'Extrapolating to the Platt-Trudgian height 3e12 needs N ~ 3e15 (detector) to ~8e30 (clean-prefix) -- 1 to 16 orders BEYOND the ~1e14 the refuted-linear law implied, and incomparably above the verified-zero route. '
  + 'Route L is a fixed-cost, verified-height-dominated detector, NOT a lever. Measurement/fit only; RH open; NO QED. '
  + 'Sub-gap SG-96149-grid: a genuinely FINER N_det grid (more zero indices, more delta values, per-delta exponents) and the analytic reach law N_res(gamma) = Christoffel function of nu_a still need fresh high-dps runs.';

export const IMP96149_SCRIPTS = Object.freeze(['tmp/imp-96149-fit.mjs']);
