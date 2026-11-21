/**
 * @module imp-96347-detector-reach-curvature-correction
 *
 * imp-96347 (numerical): model a CORRECTION FACTOR for the imp-96273 systematic under-prediction
 * of the Route L detector first-detection order by the imp-96059 power-law reach. imp-96273 found
 * that both power-law extrapolations (height basis N_det = 0.364 * gamma^1.272; index basis
 * N_det = 10.32 * k^0.714) place zero 40 detection near N ~ 144-166, while it is measured
 * UNDETECTED through N = 400. Here we measure the signed per-zero bias on the FIT points and fit a
 * de-biasing correction.
 *
 * STEP 1 -- signed per-zero bias b_k = N_det_measured / N_det_predicted - 1 (height basis), on the
 * five detected fit zeros k = 1,3,6,10,20:
 *
 *   k=1:  +13.469%   k=3:  -8.474%   k=6:  -10.036%   k=10:  -8.444%   k=20:  +16.902%
 *
 * The bias is NOT monotone -- it is U-shaped (convex in log gamma): positive at BOTH ends,
 * negative in the middle. This is the diagnostic signature of a missing positive-curvature term.
 *
 * STEP 2 -- a plain log-linear multiplicative correction C(k) = exp(a) * k^b is DEGENERATE: OLS on
 * the power law already zeroes the mean log-residual, so the fitted C collapses to the trivial
 * C == 1 (slope 0, r2 0) and cannot de-bias. The correct model is the CURVATURE term. Refitting the
 * height ladder as a quadratic in log gamma, ln N_det = a0 + a1*L + a2*L^2 with L = ln(gamma):
 *
 *   a0 = 3.318598,  a1 = -1.283809,  a2 = +0.366590 (positive curvature),  r2 = 0.999574
 *
 * cuts the in-sample RMS bias from 11.92% (power law) to 1.53%. The correction factor is the ratio
 * of the quadratic to the power-law reach, C(gamma) = N_quad(gamma) / N_power(gamma):
 *
 *   C(14.13) = 1.1405   C(25.01) = 0.9054   C(37.59) = 0.8887   C(49.77) = 0.9417   C(77.14) = 1.1571
 *
 * STEP 3 -- de-biased zero-40 reach (gamma_0 = 122.9468): the curvature correction lifts the point
 * estimate from N_det = 165.6 (power) to N_det = 278.4 (quad), C(gamma_0) = 1.6812. This HALVES the
 * shortfall against the measured lower bound: the power-law point was 165.6 / 400 = 0.41 of the
 * measured floor; the de-biased point is 278.4 / 400 = 0.70.
 *
 * FIRM CONCLUSION: the under-prediction is explained by a genuine positive log-curvature (super-power
 * reach) that a single power law smooths away; a quadratic-in-log correction factor de-biases the
 * ladder to within 1.5% in-sample and moves the zero-40 forecast from ~2.4x to ~1.44x below the
 * measured floor. It does NOT fully reconcile: even the curvature-corrected 278.4 sits below
 * N_det >= 400, so the reach is super-power even relative to the fitted convexity. The residual
 * sub-gap needs real higher-index detector rows past k = 20 to pin the curvature at gamma ~ 123.
 *
 * Baked literals from imp-96273 (fit points, power laws) and imp-96059 (canonical rows); pure-JS
 * refit in tmp/imp-96347-scratch.mjs and tmp/imp-96347-quad.mjs. Measurement/extrapolation only;
 * changes NO bound; the verified-zero route stays cheaper; RH open; no refereed bound is changed
 * ; NO QED.
 *
 * @see imp-96273-detector-zero40-extrapolation.js (IMP96273_HEIGHT_EXTRAP, IMP96273_MEASURED_LOWER_BOUND)
 * @see imp-96059-detector-reach-ladder-viz-data.js (IMP96059_NDET_RANGE_BY_ZERO)
 *
 * Ticket: imp-96347 (numerical, medium). RH-equivalent context; NO QED.
 */

// Signed per-zero bias of the imp-96273 height power law on the five detected fit zeros.
export const IMP96347_PER_ZERO_BIAS = Object.freeze([
  { k: 1, gamma0: 14.1347, nDet: 12, predPower: 10.576, biasPct: 13.469 },
  { k: 3, gamma0: 25.0109, nDet: 20, predPower: 21.852, biasPct: -8.474 },
  { k: 6, gamma0: 37.5862, nDet: 33, predPower: 36.681, biasPct: -10.036 },
  { k: 10, gamma0: 49.7738, nDet: 48, predPower: 52.427, biasPct: -8.444 },
  { k: 20, gamma0: 77.1448, nDet: 107, predPower: 91.530, biasPct: 16.902 },
]);

// A log-linear multiplicative correction is degenerate -- OLS already zeroes the mean log-residual.
export const IMP96347_LOGLINEAR_DEGENERATE = Object.freeze({
  form: 'C(k) = exp(a) * k^b',
  a: 0.0, b: 0.0, r2: 0.0,
  note: 'Power-law OLS zeroes the mean log-residual by construction, so the fitted multiplier collapses to C == 1; it cannot de-bias the U-shaped per-zero bias.',
});

// The working correction: quadratic-in-log-gamma refit capturing the positive curvature.
export const IMP96347_CURVATURE_CORRECTION = Object.freeze({
  form: 'ln N_det = a0 + a1*L + a2*L^2,  L = ln(gamma)',
  a0: 3.318598, a1: -1.283809, a2: 0.366590, // a2 > 0: positive log-curvature (super-power reach)
  r2: 0.999574,
  rmsBiasPowerPct: 11.9238, // in-sample RMS |bias| of the plain power law
  rmsBiasQuadPct: 1.5320,   // in-sample RMS residual after the curvature correction
  correctionFactorByZero: Object.freeze([
    { k: 1, gamma0: 14.1347, C: 1.1405 },
    { k: 3, gamma0: 25.0109, C: 0.9054 },
    { k: 6, gamma0: 37.5862, C: 0.8887 },
    { k: 10, gamma0: 49.7738, C: 0.9417 },
    { k: 20, gamma0: 77.1448, C: 1.1571 },
  ]),
});

// De-biased zero-40 reach and the residual shortfall against the measured lower bound.
export const IMP96347_ZERO40_DEBIASED = Object.freeze({
  zeroIndex: 40, gamma0: 122.9468,
  nDetPower: 165.56,       // imp-96273 height point estimate
  correctionC: 1.6812,     // C(gamma_0) = N_quad / N_power
  nDetDebiased: 278.35,    // curvature-corrected point estimate
  measuredLowerBound: 400, // imp-96059 / imp-96273: undetected through N = 400
  powerOverFloor: 0.4139,  // 165.56 / 400
  debiasedOverFloor: 0.6959, // 278.35 / 400 -- shortfall halved but not closed
});

export const IMP96347_VERDICT =
  'The imp-96273 power-law reach under-predicts because its signed per-zero bias is U-shaped '
  + '(+13.5% at k=1, -8..-10% in the middle, +16.9% at k=20) -- the mark of a missing positive '
  + 'log-curvature term. A log-linear multiplicative correction is degenerate (C == 1, r2 = 0) and '
  + 'cannot de-bias. The working correction is a quadratic-in-log-gamma refit (a2 = +0.3666 > 0, '
  + 'r2 = 0.9996) whose correction factor C(gamma) = N_quad/N_power cuts the in-sample RMS bias from '
  + '11.92% to 1.53%. At zero 40 it gives C(gamma_0) = 1.681, lifting the reach from N_det = 165.6 '
  + 'to 278.4 and halving the shortfall (from 0.41 to 0.70 of the measured floor N_det >= 400). It '
  + 'does NOT fully reconcile: the corrected 278.4 still sits below 400, so the reach is super-power '
  + 'even relative to the fitted convexity. Sub-gap SG-96347-curv: real detector rows past k = 20 '
  + 'are needed to pin the curvature at gamma ~ 123. Extrapolation only; changes NO bound; '
  + 'verified-zero route stays cheaper; RH open; no refereed bound is changed; NO QED.';

export const IMP96347_SCRIPTS = Object.freeze(['tmp/imp-96347-scratch.mjs', 'tmp/imp-96347-quad.mjs']);
