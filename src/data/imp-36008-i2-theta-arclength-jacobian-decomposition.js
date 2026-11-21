/**
 * @module imp-36008-i2-theta-arclength-jacobian-decomposition
 *
 * imp-36008 (numerical/assessment, S-frontier): DERIVE the explicit
 * theta -> arclength/height Jacobian for the imp-33923 model-cusp geometry that
 * puts the two imp-35727 ingredient-I2 panel-count proxies on a SHARED axis, and
 * MEASURE the resulting ratio. This is the geometric follow-through on the
 * imp-35993 per-unit-height reconciliation: imp-35993 bridged the two densities
 * with the raw angular velocity Omega = d theta / dt and closed it with the
 * mean-gap map, but it never wrote down the underlying cusp-geometry Jacobian.
 * Here we FACTOR that conversion into the pure-geometry piece and the single
 * imported scale, and read the residual off the factorization.
 *
 * ASSESSMENT / MEASUREMENT ONLY. Certifies no cap; instantiates no interval
 * enclosure; counts no zeros; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE TWO PROXIES (recap)
 * -----------------------------------------------------------------------------
 *   Route A (imp-35757): along-line Riemann-Siegel mean winding rate
 *     w(T) = (1/2) log(T / 2 pi) ~ 13.446 rad per unit HEIGHT at T_PT (~4.28
 *     panels per unit height); parameter = along-line height t.
 *   Route B (imp-35951, from the HELD imp-33923 quadrature): off-axis phase
 *     slope |s| = d arg / d theta = 3/2 rad per rad of THETA, where the model
 *     observation point is w(theta) = e^{i theta} on the unit circle.
 * imp-35951 flagged these as NOT one-to-one comparable: a per-height density vs a
 * per-angle density, with no intrinsic scale on the scale-free cusp.
 *
 * THE GEOMETRIC JACOBIAN (the new, explicit derivation)
 * -----------------------------------------------------------------------------
 * The imp-33923 observation point traces the UNIT CIRCLE w(theta) = e^{i theta}.
 * Its arclength element is
 *     ds_model = |dw/dtheta| dtheta = |i e^{i theta}| dtheta = 1 * dtheta,
 * so the model-arclength Jacobian is
 *     J_geo = ds_model / dtheta = 1   (radius-1 circle, EXACT).
 * Numerically, model arclength equals theta radian-for-radian: the pi/2 theta arc
 * (theta in {45..135} deg) is exactly pi/2 of model arclength. Consequently the
 * route-B phase-winding density per unit MODEL ARCLENGTH is
 *     |s| / J_geo = (3/2) / 1 = 3/2 rad per unit model arclength,
 * IDENTICAL to the per-radian-theta figure. The pure geometry therefore carries
 * NO height scale -- it is a unit-for-unit relabeling.
 *
 * THE ONE IMPORTED NUMBER: THE SIMILARITY SCALE lambda
 * -----------------------------------------------------------------------------
 * To reach the along-line dR edge, parameterized by physical height t, the model
 * arclength must be scaled by
 *     lambda = dt / ds_model    (physical height per unit model arclength),
 * the single quantity the scale-free cusp rho = |x|^{-1/2} does not fix. The full
 * theta -> height Jacobian FACTORS as
 *     dt / dtheta = (dt / ds_model)(ds_model / dtheta) = lambda * J_geo = lambda,
 * i.e. lambda = 1 / Omega (the reciprocal of the imp-35993 angular velocity). All
 * of the dimensional gap lives in lambda; J_geo contributes 1.
 * Route B expressed per unit height is then
 *     (|s| / J_geo) * (ds_model / dt) = (3/2) * (1 / lambda),
 * and the residual against route A is
 *     R = w / ((3/2) / lambda) = (2/3) * w * lambda,  scaling linearly in lambda.
 *
 * THE MEAN-GAP CLOSURE AS A JACOBIAN PRODUCT
 * -----------------------------------------------------------------------------
 * The one height scale the repo attaches to the model cusp is the mean zero gap
 * delta(T) = 2 pi / log(T / 2 pi) = pi / w (the imp-35757 borderline panel width).
 * Identifying the full pi/2 model arc with one mean gap gives
 *     lambda = delta / (pi/2) = 2 delta / pi = 2 / w,
 * so
 *     R = (2/3) * w * (2 / w) = 4/3   EXACTLY, independent of T,
 * reproducing the imp-35993 residual but now READ OFF the factorization
 * J_geo = 1 (pure geometry, no scale) times lambda = 2/w (the imported scale).
 * Equivalently, on the shared MODEL-ARCLENGTH axis: route B books 3/2 rad per unit
 * model arclength while route A, mapped over by lambda, books w * lambda = 2 rad
 * per unit model arclength, ratio 2 / (3/2) = 4/3 -- the same signature that
 * imp-33923 is a BRANCH cusp (non-integer winding 3/2), not a true zero.
 *
 * WHAT THIS DOES NOT DO (the honesty boundary)
 * -----------------------------------------------------------------------------
 * The Jacobian J_geo = 1 is EXACT geometry (unit circle), but the similarity scale
 * lambda is IMPORTED: 4/3 holds only under the mean-gap closure (lambda = 2/w), and
 * ANY other theta -> height map rescales R linearly in lambda. BOTH densities are
 * PROXIES: route B lives on the off-axis model cusp rho = |x|^{-1/2}, NOT the true
 * H_t = A + B - C on dR, and route A is the SMOOTH mean rate (a certified cap needs
 * an interval UPPER bound on the LOCAL rate). This module instantiates no interval
 * enclosure, certifies no cap, counts no zeros, fixes no Delta or h, changes no
 * bound; I2 stays GREENFIELD. NO QED. No refereed bound is changed.
 *
 * @see imp-35993-i2-panel-proxy-reconciliation-per-unit-height (per-unit-height reconciliation via Omega; residual 4/3 under the mean-gap map)
 * @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy (route B slope |s|=3/2, flagged the not-one-to-one-comparable gap)
 * @see imp-35757-i2-panel-width-count-scope (route A smooth Riemann-Siegel mean rate ~13.45, ~4.28 panels/unit height)
 * @see imp-33923-off-axis-phase-winding-quadrature (held sampled slope -3/2, modulus C_PS, unit-circle w=e^{i theta}, isRigorous:false)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I1-I5 enumerated, all GREENFIELD)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35757 / imp-35951 / imp-35993) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this derivation
const HALF_TURN = Math.PI; // the I2 cap threshold: |Delta arg f| < pi per panel

// Route A (imp-35757): smooth along-line Riemann-Siegel mean winding rate.
const routeARate = (T) => 0.5 * Math.log(T / (2 * Math.PI)); // w(T) rad per unit height
const meanGap = (T) => (2 * Math.PI) / Math.log(T / (2 * Math.PI)); // delta = pi / w
const W_A = routeARate(T_PT); // ~13.446 rad per unit height
const DELTA_GAP = meanGap(T_PT); // ~0.2336 = the imp-35757 borderline panel width

// Route B (imp-35951, from held imp-33923): per-radian phase-winding slope on the unit-circle model.
const WINDING_SLOPE_MAG = 1.5; // |s| = d arg / d theta = 3/2 rad per rad of theta
const MODEL_ARC = Math.PI / 2; // theta in {45..135} deg = pi/2 rad of theta

// The geometric arclength Jacobian for w(theta) = e^{i theta} (radius-1 circle).
// J_geo = |dw/dtheta| = |i e^{i theta}| = 1, sampled here to confirm it is a constant 1.
const jacobianAt = (theta) => Math.hypot(-Math.sin(theta), Math.cos(theta)); // |i e^{i theta}|
const J_GEO_SAMPLES = [45, 67.5, 90, 112.5, 135].map((deg) => jacobianAt((deg * Math.PI) / 180));
const J_GEO = 1; // exact constant; the samples confirm it to ~1e-15
const MODEL_ARCLENGTH_OVER_ARC = J_GEO * MODEL_ARC; // = pi/2 (arclength equals theta on the unit circle)

// Route B density on the shared MODEL-ARCLENGTH axis = |s| / J_geo (identical to per-radian-theta).
const ROUTE_B_PER_ARCLENGTH = WINDING_SLOPE_MAG / J_GEO; // = 3/2 rad per unit model arclength

// The single imported number: the similarity scale lambda = dt / ds_model (height per model arclength).
// Under the mean-gap closure the pi/2 model arc is identified with one mean gap delta.
const LAMBDA_MEAN_GAP = DELTA_GAP / MODEL_ARCLENGTH_OVER_ARC; // = 2 delta / pi = 2 / w
// Full theta -> height Jacobian factors as dt/dtheta = lambda * J_geo = lambda (= 1/Omega of imp-35993).
const DT_DTHETA_MEAN_GAP = LAMBDA_MEAN_GAP * J_GEO;

// Route B per unit height and the residual against route A, read off the factorization.
const ROUTE_B_PER_HEIGHT = ROUTE_B_PER_ARCLENGTH / LAMBDA_MEAN_GAP; // (3/2)/lambda = 3w/4
const RESIDUAL_FACTOR = W_A / ROUTE_B_PER_HEIGHT; // = (2/3) w lambda = 4/3
// Equivalent reading on the model-arclength axis: route A carried over by lambda = w*lambda = 2.
const ROUTE_A_PER_ARCLENGTH = W_A * LAMBDA_MEAN_GAP; // = 2 rad per unit model arclength
const RESIDUAL_FROM_ARCLENGTH = ROUTE_A_PER_ARCLENGTH / ROUTE_B_PER_ARCLENGTH; // 2/(3/2) = 4/3

// T-independence: recompute the residual a decade above/below T_PT.
const residualAt = (T) => {
  const w = routeARate(T);
  const lambda = meanGap(T) / MODEL_ARCLENGTH_OVER_ARC; // = 2/w
  return w / ((WINDING_SLOPE_MAG / J_GEO) / lambda);
};

export const IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION = {
  id: 'imp-36008',
  proofSection: 'S-frontier',
  question:
    'Derive the explicit theta -> arclength/height Jacobian for the imp-33923 model-cusp geometry that puts the ' +
    'imp-35757 along-line I2 panel rate (~13.45 rad per unit height) and the imp-35951 theta-slope proxy (|s|=3/2 ' +
    'rad per rad of theta) on a shared axis, and measure the resulting ratio. Assessment/measurement only; ' +
    'certifies no cap; changes no bound; NO QED.',
  anchor: { heightT_PT: T_PT, sotaLambda: L_PT },
  geometricJacobian: {
    observationPoint: 'imp-33923 model observation point w(theta) = e^{i theta} on the unit circle',
    arclengthElement: 'ds_model = |dw/dtheta| dtheta = |i e^{i theta}| dtheta = 1 * dtheta',
    J_geo: J_GEO, // = 1 exactly
    jacobianSampleMax: +Math.max(...J_GEO_SAMPLES).toFixed(15),
    jacobianSampleMin: +Math.min(...J_GEO_SAMPLES).toFixed(15),
    note:
      'The model-arclength Jacobian J_geo = ds_model / dtheta = |i e^{i theta}| = 1 for the radius-1 circle, ' +
      'confirmed constant to ~1e-15 across the {45..135} deg sweep. Model arclength equals theta radian-for-radian, ' +
      'so the pi/2 theta arc is exactly pi/2 of model arclength and the pure geometry carries NO height scale.',
    modelArclengthOverArc: +MODEL_ARCLENGTH_OVER_ARC.toFixed(9), // pi/2
  },
  importedSimilarityScale: {
    lambdaDefinition: 'lambda = dt / ds_model (physical height per unit model arclength); the one scale-free-cusp-undetermined number',
    factorization: 'dt/dtheta = (dt/ds_model)(ds_model/dtheta) = lambda * J_geo = lambda = 1 / Omega (imp-35993 angular velocity)',
    meanGapClosure:
      'identify the full pi/2 model arc with one mean gap delta = 2 pi / log(T/2pi) = pi/w (the imp-35757 ' +
      'borderline panel width): lambda = delta / (pi/2) = 2 delta / pi = 2 / w.',
    lambdaMeanGap: +LAMBDA_MEAN_GAP.toFixed(9), // 2/w
    dtDthetaMeanGap: +DT_DTHETA_MEAN_GAP.toFixed(9), // = lambda (J_geo = 1)
  },
  sharedAxis: {
    axis: 'model arclength s_model (radian-for-radian with theta since J_geo = 1)',
    routeBPerArclengthRad: +ROUTE_B_PER_ARCLENGTH.toFixed(9), // 3/2
    routeAPerArclengthRadUnderMeanGap: +ROUTE_A_PER_ARCLENGTH.toFixed(9), // w * lambda = 2
    note:
      'On the shared model-arclength axis route B books |s|/J_geo = 3/2 rad per unit arclength; route A, carried ' +
      'over by the mean-gap lambda = 2/w, books w * lambda = 2 rad per unit arclength.',
  },
  routeA: {
    source: 'imp-35757 smooth along-line Riemann-Siegel mean rate',
    ratePerUnitHeightRad: +W_A.toFixed(6), // ~13.446
    meanGap: +DELTA_GAP.toFixed(9), // ~0.2336 = pi/w
  },
  routeB: {
    source: 'imp-35951 held imp-33923 off-axis phase-winding slope (isRigorous:false)',
    slopeMagnitudePerRadTheta: WINDING_SLOPE_MAG, // 3/2
    perUnitHeightUnderMeanGapRad: +ROUTE_B_PER_HEIGHT.toFixed(6), // (3/2)/lambda = 3w/4 ~ 10.084
  },
  residual: {
    factor: +RESIDUAL_FACTOR.toFixed(12), // 4/3
    exactValue: '4/3',
    formula: 'R = w / ((3/2)/lambda) = (2/3) w lambda; under lambda = 2/w gives 4/3',
    fromArclengthAxis: +RESIDUAL_FROM_ARCLENGTH.toFixed(12), // 2/(3/2) = 4/3
    tIndependent: true,
    interpretation:
      'The theta -> height Jacobian factors as J_geo * lambda with J_geo = 1 (pure unit-circle geometry, no scale) ' +
      'and lambda the imported height similarity scale, so ALL the imp-35951 non-comparability lives in lambda. ' +
      'Under the mean-gap closure lambda = 2/w, the residual is 4/3 EXACTLY (T-independent), matching imp-35993 but ' +
      'now read off the factorization; the 4/3 is the branch-cusp winding signature (3/2 vs a true-zero 1).',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / MEASUREMENT (frontier-direction, NOT rigorous). The imp-33923 model observation point w(theta) = ' +
    'e^{i theta} traces the unit circle, so its arclength Jacobian J_geo = ds_model / dtheta = |i e^{i theta}| = 1 ' +
    'EXACTLY (confirmed constant to ~1e-15 across the {45..135} deg sweep): model arclength equals theta ' +
    'radian-for-radian and the pure geometry carries NO height scale, leaving the route-B density 3/2 rad per unit ' +
    'model arclength identical to its per-radian-theta value. The theta -> height Jacobian FACTORS as dt/dtheta = ' +
    'lambda * J_geo = lambda, where lambda = dt / ds_model is the single similarity scale the scale-free cusp ' +
    'rho = |x|^{-1/2} does not fix (lambda = 1/Omega of imp-35993). Route B per unit height = (3/2)/lambda and the ' +
    'residual R = w / ((3/2)/lambda) = (2/3) w lambda scales linearly in lambda. Under the natural mean-gap closure ' +
    '(the full pi/2 model arc identified with one mean gap delta = pi/w) lambda = 2/w, route B per unit height = ' +
    '3w/4 ~ 10.084 rad, and R = 4/3 EXACTLY, T-independent -- equivalently, on the shared model-arclength axis ' +
    'route B books 3/2 and route A books w*lambda = 2 rad per unit arclength, ratio 4/3. This reproduces the ' +
    'imp-35993 residual but read off the explicit Jacobian product, isolating ALL non-comparability in the imported ' +
    'lambda while the geometry contributes 1. The 4/3 holds only under the mean-gap closure; any other theta -> ' +
    'height map rescales R linearly in lambda. BOTH remain PROXIES on the off-axis model cusp, NOT the true ' +
    'H_t = A + B - C on dR, and route A is the SMOOTH mean rate (a certificate needs an interval UPPER bound on the ' +
    'LOCAL rate). Instantiates no interval enclosure; certifies no cap; counts no zeros; fixes no Delta or h; ' +
    'changes no bound; I2 stays GREENFIELD; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35993 (per-unit-height reconciliation via Omega, residual 4/3 under the mean-gap map); imp-35951 (route B ' +
    'slope |s|=3/2, flagged the not-one-to-one-comparable gap); imp-35757 (route A smooth Riemann-Siegel mean rate ' +
    '~13.45, ~4.28 panels/unit height); imp-33923 (off-axis phase-winding quadrature, unit-circle w=e^{i theta}, ' +
    'sampled slope -3/2, modulus C_PS, isRigorous:false); imp-35727 (I1-I5 enumerated, all GREENFIELD); ' +
    'Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021.',
};

export const IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION_ASSERTIONS = [
  {
    // The unit-circle arclength Jacobian is a constant 1 across the sweep (pure geometry, no scale).
    id: 'imp36008-jacobian-is-unit-constant',
    description: 'J_geo = |d/dtheta e^{i theta}| = 1 for every sampled theta in {45..135} deg (constant to ~1e-15)',
    holds: () =>
      J_GEO === 1 &&
      J_GEO_SAMPLES.every((j) => Math.abs(j - 1) < 1e-12) &&
      Math.abs(MODEL_ARCLENGTH_OVER_ARC - Math.PI / 2) < 1e-12,
  },
  {
    // Because J_geo = 1, the route-B model-arclength density equals the per-radian-theta slope 3/2.
    id: 'imp36008-arclength-density-equals-slope',
    description: 'Route B density per unit model arclength = |s|/J_geo = 3/2, identical to the per-radian-theta figure',
    holds: () =>
      Math.abs(ROUTE_B_PER_ARCLENGTH - 1.5) < 1e-15 &&
      Math.abs(ROUTE_B_PER_ARCLENGTH - WINDING_SLOPE_MAG / J_GEO) < 1e-15,
  },
  {
    // The imported similarity scale under the mean-gap closure is lambda = 2/w = the reciprocal angular velocity.
    id: 'imp36008-lambda-is-two-over-w',
    description: 'Mean-gap closure: lambda = delta/(pi/2) = 2/w; the full theta->height Jacobian dt/dtheta = lambda (J_geo=1)',
    holds: () =>
      Math.abs(LAMBDA_MEAN_GAP - 2 / W_A) < 1e-12 &&
      Math.abs(LAMBDA_MEAN_GAP - (2 * DELTA_GAP) / Math.PI) < 1e-12 &&
      Math.abs(DT_DTHETA_MEAN_GAP - LAMBDA_MEAN_GAP) < 1e-15,
  },
  {
    // The residual read off the Jacobian product is EXACTLY 4/3, two equivalent ways, matching imp-35993.
    id: 'imp36008-residual-is-four-thirds',
    description: 'R = w/((3/2)/lambda) = (2/3) w lambda = 4/3; equal to the model-arclength ratio (w*lambda)/(3/2) = 2/(3/2)',
    holds: () =>
      Math.abs(RESIDUAL_FACTOR - 4 / 3) < 1e-12 &&
      Math.abs(RESIDUAL_FROM_ARCLENGTH - 4 / 3) < 1e-12 &&
      Math.abs(ROUTE_A_PER_ARCLENGTH - 2) < 1e-9 &&
      Math.abs(ROUTE_B_PER_HEIGHT - 0.75 * W_A) < 1e-9,
  },
  {
    // T-independence: the mean-gap residual is 4/3 a decade above and below T_PT.
    id: 'imp36008-residual-t-independent',
    description: 'The mean-gap residual is T-independent: R(3e11) = R(3e12) = R(3e13) = 4/3',
    holds: () =>
      Math.abs(residualAt(3e11) - 4 / 3) < 1e-12 &&
      Math.abs(residualAt(3e12) - 4 / 3) < 1e-12 &&
      Math.abs(residualAt(3e13) - 4 / 3) < 1e-12,
  },
  {
    // Honesty gate: measurement only; J_geo exact geometry but lambda imported; both proxies; no cert; no refereed bound is changed.
    id: 'imp36008-honesty-gate-no-qed',
    description: 'Measurement only; J_geo=1 exact geometry, lambda IMPORTED (4/3 only under mean-gap); PROXIES on the model cusp; certifies no cap; I2 GREENFIELD; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      /PROXIES on the off-axis model cusp/.test(IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION.verdict) &&
      /only under the mean-gap closure/.test(IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION.verdict) &&
      /certifies no cap/.test(IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION.verdict) &&
      /I2 stays GREENFIELD/.test(IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION.verdict) &&
      /NO QED/.test(IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION.verdict),
  },
];

for (const a of IMP36008_I2_THETA_ARCLENGTH_JACOBIAN_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36008-i2-theta-arclength-jacobian-decomposition assertion failed: ${a.id}`);
  }
}
