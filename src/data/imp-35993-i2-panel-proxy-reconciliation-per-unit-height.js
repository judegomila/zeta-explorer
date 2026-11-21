/**
 * @module imp-35993-i2-panel-proxy-reconciliation-per-unit-height
 *
 * imp-35993 (accuracy/assessment, S-frontier): RECONCILE the two imp-35727
 * ingredient-I2 panel-count proxies onto a common per-unit-height figure and
 * MEASURE the residual factor between them at T_PT = 3e12.
 *
 *   Route A (imp-35757): the SMOOTH along-line Riemann-Siegel mean winding rate
 *     w(T) = (1/2) log(T / 2 pi) ~ 13.446 rad per unit HEIGHT (rho ~ 4.28 panels
 *     per unit height). Its parameter is the along-line height t.
 *   Route B (imp-35951, from the HELD imp-33923 quadrature): the off-axis
 *     phase-winding slope |s| = d arg / d theta = 3/2 rad per rad of THETA, a
 *     dimensionless density on the model-cusp observation-angle theta.
 *
 * imp-35951 explicitly flagged these two panel counts as NOT one-to-one
 * comparable: route A is per unit height, route B is per radian of theta, so
 * they carry different DIMENSIONS and cannot be differenced until a theta ->
 * height map is supplied. This module derives that map and reports the residual.
 *
 * ASSESSMENT / MEASUREMENT ONLY. Certifies no cap; instantiates no interval
 * enclosure; counts no zeros; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * WHY THE TWO ARE NOT ONE-TO-ONE COMPARABLE (the dimensional gap)
 * -----------------------------------------------------------------------------
 * Route A measures how fast arg H_t winds as you TRANSLATE along the critical
 * line by unit imaginary height: w(T) rad per unit height. Route B measures how
 * fast the phase of the model leading amplitude A(theta) winds as you ROTATE the
 * observation direction theta about the model cusp rho = |x|^{-1/2}: 3/2 rad per
 * rad of theta. The first density is per HEIGHT; the second is per ANGLE. The
 * model cusp is SCALE-FREE (the imp-33923 quadrature is scale-invariant), so it
 * carries NO intrinsic height scale -- there is no canonical way to say how many
 * units of height one radian of theta spans. That missing scale is exactly the
 * "not one-to-one comparable" obstruction.
 *
 * THE PARAMETERIZATION MAP
 * -----------------------------------------------------------------------------
 * Bridge the two with the angular velocity of the observation direction as the
 * boundary is traversed,
 *     Omega = d theta / dt    (rad of theta per unit height),
 * so route B expressed per unit height is |s| * Omega = (3/2) Omega, and the
 * residual factor between the two per-unit-height densities is
 *     R(T) = w(T) / (|s| * Omega).
 * Omega is set by the theta -> height map and is NOT fixed by the scale-free
 * model; it must be IMPORTED. If the model arc of angular span L_theta is
 * identified with a height footprint L_h, then Omega = L_theta / L_h and
 *     R = w * L_h / (|s| * L_theta),   i.e. R scales linearly in the imported L_h.
 *
 * THE NATURAL CLOSURE: MEAN-GAP MAP (the one clean, T-independent residual)
 * -----------------------------------------------------------------------------
 * The one height scale the repo already attaches to the model cusp is the mean
 * zero gap delta(T) = 2 pi / log(T / 2 pi) = pi / w -- the imp-35757 borderline
 * I2 panel width, the height footprint of ONE would-be zero. Identify the full
 * imp-33923 model arc L_theta = pi/2 (theta in {45..135} deg) with one mean gap
 * L_h = delta. Then
 *     Omega = (pi/2) / delta = w/2,
 * so route B per unit height = (3/2)(w/2) = 3w/4, and
 *     R = w / (3w/4) = 4/3   EXACTLY, independent of T.
 * Equivalently, per common ATOM (one mean gap  <->  one pi/2 model arc):
 *   - route A accrues  w * delta = pi          rad (one half-turn per mean gap),
 *   - route B accrues  |s| * (pi/2) = 3 pi / 4 rad (three-quarter turn per arc),
 * and the residual is the winding-per-atom ratio  pi / (3 pi / 4) = 4/3.
 *
 * WHAT THE 4/3 MEANS
 * -----------------------------------------------------------------------------
 * At T_PT = 3e12: route A = 13.446 rad per unit height (4.28 panels); route B
 * under the mean-gap map = 3w/4 = 10.084 rad per unit height (3.21 panels). The
 * two per-unit-height panel counts therefore differ by the fixed factor 4/3 ~
 * 1.333 -- so once the theta -> height conversion is pinned to the mean gap the
 * counts ARE comparable, and route A is exactly 4/3 as dense as route B. The 4/3
 * is a SIGNATURE of the proxy mismatch: the along-line rate books a half-turn
 * (pi) of argument per mean zero gap, whereas the model-cusp branch winding
 * books only three-quarters of a turn (3 pi / 4) over its arc. A genuine simple
 * zero read off a full 2 pi loop would give a per-turn ratio of 1, not 4/3; the
 * 4/3 records that imp-33923 is a BRANCH cusp (rho = |x|^{-1/2}, non-integer
 * winding 3/2), NOT a true zero of H_t.
 *
 * WHAT THIS DOES NOT DO (the honesty boundary)
 * -----------------------------------------------------------------------------
 * The residual 4/3 is EXACT only under the mean-gap closure; ANY other theta ->
 * height map rescales R linearly in the imported L_h (formula above), so 4/3 is a
 * property of the natural map, not a forced universal constant. BOTH densities
 * are PROXIES: route B lives on the off-axis model cusp rho = |x|^{-1/2}, not the
 * true H_t = A + B - C on dR, and route A uses the SMOOTH mean rate (a LOWER
 * bound on a certificate, since a certified cap needs an interval UPPER bound on
 * the LOCAL rate). This module reconciles the two OOM proxies; it instantiates no
 * interval enclosure, certifies no cap, counts no zeros, fixes no Delta or h,
 * changes no bound; I2 stays GREENFIELD. NO QED. No refereed bound is changed.
 *
 * @see imp-35757-i2-panel-width-count-scope (route A: smooth Riemann-Siegel mean rate ~13.45, ~4.28 panels/unit height)
 * @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy (route B: |s|=3/2 rad/rad-theta, flagged the not-comparable gap)
 * @see imp-33923-off-axis-phase-winding-quadrature (held sampled slope -3/2, modulus C_PS, isRigorous:false)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I1-I5 enumerated, all GREENFIELD)
 * @see imp-35815-panel-width-mean-gap-agreement-table (route A width = mean gap delta = pi/w, an algebraic identity)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35757 / imp-35951) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this reconciliation
const HALF_TURN = Math.PI; // the I2 cap threshold: |Delta arg f| < pi per panel

// Route A (imp-35757): smooth along-line Riemann-Siegel mean winding rate.
const routeARate = (T) => 0.5 * Math.log(T / (2 * Math.PI)); // w(T) rad per unit height
const meanGap = (T) => (2 * Math.PI) / Math.log(T / (2 * Math.PI)); // delta = pi / w
const W_A = routeARate(T_PT); // ~13.446 rad per unit height
const DELTA_GAP = meanGap(T_PT); // ~0.2336 = the imp-35757 borderline panel width
const ROUTE_A_PANELS_PER_HEIGHT = W_A / HALF_TURN; // ~4.28 panels per unit height

// Route B (imp-35951, from held imp-33923): per-radian phase-winding slope.
const WINDING_SLOPE_MAG = 1.5; // |s| = d arg / d theta = 3/2 rad per rad of theta
const MODEL_ARC = Math.PI / 2; // theta in {45..135} deg = pi/2 rad of model arc
const ROUTE_B_WINDING_OVER_ARC = WINDING_SLOPE_MAG * MODEL_ARC; // 3 pi / 4 ~ 2.356 rad

// The mean-gap parameterization map: identify the pi/2 model arc with one mean gap delta.
const OMEGA = MODEL_ARC / DELTA_GAP; // d theta / dt = (pi/2)/delta = w/2
const ROUTE_B_RATE_PER_HEIGHT = WINDING_SLOPE_MAG * OMEGA; // (3/2)(w/2) = 3w/4 rad per unit height
const ROUTE_B_PANELS_PER_HEIGHT = ROUTE_B_RATE_PER_HEIGHT / HALF_TURN; // ~3.21 panels per unit height

// The residual factor, two equivalent readings.
const RESIDUAL_FACTOR = W_A / ROUTE_B_RATE_PER_HEIGHT; // = 4/3, T-independent
const WIND_A_PER_ATOM = W_A * DELTA_GAP; // = pi (half-turn per mean gap)
const WIND_B_PER_ATOM = ROUTE_B_WINDING_OVER_ARC; // = 3 pi / 4 (three-quarter turn per arc)
const RESIDUAL_FROM_ATOMS = WIND_A_PER_ATOM / WIND_B_PER_ATOM; // = 4/3

// T-independence check: recompute the residual at a decade above/below T_PT.
const residualAt = (T) => {
  const w = routeARate(T);
  const omega = MODEL_ARC / meanGap(T);
  return w / (WINDING_SLOPE_MAG * omega);
};

export const IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT = {
  id: 'imp-35993',
  proofSection: 'S-frontier',
  question:
    'Reconcile the two imp-35727 ingredient-I2 panel-count proxies onto a common per-unit-height figure: ' +
    'imp-35757 analytic Riemann-Siegel along-line mean winding rate (~13.45 rad per unit height, ~4.28 panels/unit) ' +
    'vs imp-35951 held imp-33923 theta-parameter phase-winding slope |s| = 3/2 (rad per rad of theta), measuring ' +
    'the theta -> height conversion imp-35951 flagged as NOT one-to-one comparable. Assessment/measurement only; ' +
    'certifies no cap; changes no bound; NO QED.',
  anchor: { heightT_PT: T_PT, sotaLambda: L_PT },
  dimensionalGap: {
    routeAParameter: 'along-line height t (rad of arg per unit HEIGHT)',
    routeBParameter: 'model-cusp observation angle theta (rad of arg per rad of ANGLE)',
    obstruction:
      'route A is per height, route B is per angle -- different DIMENSIONS; the imp-33923 model cusp ' +
      'rho = |x|^{-1/2} is scale-free (scale-invariant quadrature) and carries no intrinsic height scale, so the ' +
      'theta -> height conversion must be IMPORTED. This is the imp-35951 not-one-to-one-comparable flag.',
  },
  parameterizationMap: {
    bridge: 'Omega = d theta / dt (rad of theta per unit height); route B per unit height = |s| * Omega.',
    residualFormula: 'R(T) = w(T) / (|s| * Omega); with arc L_theta -> footprint L_h, Omega = L_theta/L_h so R scales linearly in L_h.',
    naturalClosure:
      'mean-gap map: identify the full imp-33923 model arc L_theta = pi/2 with one mean zero gap ' +
      'L_h = delta(T) = 2 pi / log(T/2pi) = pi / w (the imp-35757 borderline panel width). Then ' +
      'Omega = (pi/2)/delta = w/2 and route B per unit height = (3/2)(w/2) = 3w/4.',
  },
  routeA: {
    source: 'imp-35757 smooth along-line Riemann-Siegel mean rate',
    ratePerUnitHeightRad: +W_A.toFixed(6), // ~13.446
    panelsPerUnitHeight: +ROUTE_A_PANELS_PER_HEIGHT.toFixed(6), // ~4.28
    meanGap: +DELTA_GAP.toFixed(9), // ~0.2336 = pi/w
    windingPerMeanGapRad: +WIND_A_PER_ATOM.toFixed(9), // = pi (half-turn per gap)
  },
  routeB: {
    source: 'imp-35951 held imp-33923 off-axis phase-winding slope (isRigorous:false)',
    slopeMagnitudePerRadTheta: WINDING_SLOPE_MAG, // 3/2
    modelArcRad: +MODEL_ARC.toFixed(9), // pi/2
    windingOverArcRad: +ROUTE_B_WINDING_OVER_ARC.toFixed(9), // 3 pi / 4 ~ 2.356
    ratePerUnitHeightUnderMeanGapMapRad: +ROUTE_B_RATE_PER_HEIGHT.toFixed(6), // 3w/4 ~ 10.084
    panelsPerUnitHeightUnderMeanGapMap: +ROUTE_B_PANELS_PER_HEIGHT.toFixed(6), // ~3.21
  },
  residual: {
    factor: +RESIDUAL_FACTOR.toFixed(12), // 4/3
    exactValue: '4/3',
    fromAtoms: +RESIDUAL_FROM_ATOMS.toFixed(12), // pi / (3 pi / 4) = 4/3
    tIndependent: true,
    interpretation:
      'Once the theta -> height conversion is pinned to the mean gap, the two per-unit-height panel counts ARE ' +
      'comparable and route A is exactly 4/3 as dense as route B, independent of T. The 4/3 records that the ' +
      'along-line rate books a half-turn (pi) of argument per mean zero gap while the model-cusp BRANCH winding ' +
      'books three-quarters of a turn (3 pi / 4) over its arc; a genuine simple zero (per-turn ratio 1) would ' +
      'give 1, so the 4/3 is a signature that imp-33923 is a branch cusp (non-integer winding 3/2), NOT a zero.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / MEASUREMENT (frontier-direction, NOT rigorous). The imp-35757 and imp-35951 I2 panel counts are ' +
    'NOT one-to-one comparable because route A is a per-HEIGHT density (w(T) = (1/2)log(T/2pi) ~ 13.446 rad per ' +
    'unit height at T_PT) while route B is a per-ANGLE density (|s| = 3/2 rad per rad of the model-cusp theta), and ' +
    'the scale-free imp-33923 cusp rho = |x|^{-1/2} supplies no intrinsic height scale. The bridge is the ' +
    'observation-angle angular velocity Omega = d theta / dt, giving route B per unit height = (3/2) Omega and ' +
    'residual R = w / ((3/2) Omega). Under the natural mean-gap map (the full pi/2 model arc identified with one ' +
    'mean zero gap delta = pi/w, the imp-35757 borderline panel width) Omega = w/2, route B per unit height = 3w/4 ' +
    '~ 10.084 rad (~3.21 panels), and R = 4/3 EXACTLY, independent of T. Equivalently per atom: route A books pi ' +
    '(half-turn per mean gap), route B books 3 pi / 4 (three-quarter turn per arc), ratio 4/3 -- the signature ' +
    'that imp-33923 is a BRANCH cusp (non-integer winding 3/2), not a true zero (which would give 1). The 4/3 is ' +
    'exact only under the mean-gap closure; any other theta -> height map rescales R linearly in the imported ' +
    'height footprint. BOTH remain PROXIES on the off-axis model cusp, NOT the true H_t = A + B - C on dR, and ' +
    'route A is the SMOOTH mean rate (a certificate needs an interval UPPER bound on the LOCAL rate). Instantiates ' +
    'no interval enclosure; certifies no cap; counts no zeros; fixes no Delta or h; changes no bound; I2 stays ' +
    'GREENFIELD; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35757 (I2 sized from the smooth Riemann-Siegel mean rate ~13.45, ~4.28 panels/unit height); imp-35951 ' +
    '(I2/I3 sized from the held imp-33923 slope |s|=3/2, flagged the not-one-to-one-comparable gap); imp-33923 ' +
    '(off-axis phase-winding quadrature, sampled slope -3/2, modulus C_PS, isRigorous:false); imp-35727 (I1-I5 ' +
    'enumerated, all GREENFIELD); imp-35815 (route A width = mean gap delta = pi/w, algebraic identity); ' +
    'Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021.',
};

export const IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT_ASSERTIONS = [
  {
    // Route A per-unit-height figures reproduce imp-35757: ~13.446 rad, ~4.28 panels, gap = pi/w.
    id: 'imp35993-route-a-reproduces-imp35757',
    description: 'Route A: w(T_PT) ~ 13.446 rad per unit height, ~4.28 panels/unit, mean gap delta = pi/w ~ 0.2336',
    holds: () =>
      Math.abs(W_A - 13.445878169) < 1e-6 &&
      Math.abs(ROUTE_A_PANELS_PER_HEIGHT - 4.279956) < 1e-4 &&
      Math.abs(DELTA_GAP - Math.PI / W_A) < 1e-12 &&
      Math.abs(DELTA_GAP - 0.233647265) < 1e-6,
  },
  {
    // Route B total winding over the pi/2 model arc is 3 pi / 4 ~ 2.356 rad (matches imp-35951).
    id: 'imp35993-route-b-arc-winding-is-three-quarter-turn',
    description: 'Route B: |s|=3/2 over the pi/2 model arc winds 3 pi / 4 ~ 2.356 rad',
    holds: () =>
      Math.abs(ROUTE_B_WINDING_OVER_ARC - (3 * Math.PI) / 4) < 1e-12 &&
      Math.abs(ROUTE_B_WINDING_OVER_ARC - WINDING_SLOPE_MAG * MODEL_ARC) < 1e-15,
  },
  {
    // The mean-gap map gives Omega = w/2, route B per unit height = 3w/4 ~ 10.084 rad (~3.21 panels).
    id: 'imp35993-mean-gap-map-gives-three-quarter-w',
    description: 'Mean-gap map: Omega = (pi/2)/delta = w/2; route B per unit height = 3w/4 ~ 10.084 rad (~3.21 panels)',
    holds: () =>
      Math.abs(OMEGA - W_A / 2) < 1e-9 &&
      Math.abs(ROUTE_B_RATE_PER_HEIGHT - 0.75 * W_A) < 1e-9 &&
      Math.abs(ROUTE_B_RATE_PER_HEIGHT - 10.084409) < 1e-4 &&
      Math.abs(ROUTE_B_PANELS_PER_HEIGHT - 3.209967) < 1e-4,
  },
  {
    // The residual factor is EXACTLY 4/3, reachable two ways (ratio of rates and ratio of per-atom windings).
    id: 'imp35993-residual-is-four-thirds',
    description: 'Residual R = w/(3w/4) = 4/3, equal to the per-atom winding ratio pi/(3 pi / 4)',
    holds: () =>
      Math.abs(RESIDUAL_FACTOR - 4 / 3) < 1e-12 &&
      Math.abs(RESIDUAL_FROM_ATOMS - 4 / 3) < 1e-12 &&
      Math.abs(WIND_A_PER_ATOM - Math.PI) < 1e-12 &&
      Math.abs(WIND_B_PER_ATOM - (3 * Math.PI) / 4) < 1e-12,
  },
  {
    // T-independence: recomputing R a decade above and below T_PT gives the same 4/3.
    id: 'imp35993-residual-t-independent',
    description: 'The mean-gap residual is T-independent: R(3e11) = R(3e12) = R(3e13) = 4/3',
    holds: () =>
      Math.abs(residualAt(3e11) - 4 / 3) < 1e-12 &&
      Math.abs(residualAt(3e12) - 4 / 3) < 1e-12 &&
      Math.abs(residualAt(3e13) - 4 / 3) < 1e-12,
  },
  {
    // Honesty gate: assessment only, both proxies on the model cusp, mean-gap-specific, no certification, no refereed bound is changed.
    id: 'imp35993-honesty-gate-no-qed',
    description: 'Assessment only; PROXIES on the model cusp; 4/3 exact only under the mean-gap closure; certifies no cap; I2 GREENFIELD; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      /PROXIES on the off-axis model cusp/.test(IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT.verdict) &&
      /exact only under the mean-gap closure/.test(IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT.verdict) &&
      /certifies no cap/.test(IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT.verdict) &&
      /I2 stays\s+GREENFIELD/.test(IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT.verdict) &&
      /NO QED/.test(IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT.verdict) &&
      /refereed bound is changed/i.test(IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT.verdict),
  },
];

for (const a of IMP35993_I2_PANEL_PROXY_RECONCILIATION_PER_UNIT_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35993-i2-panel-proxy-reconciliation-per-unit-height assertion failed: ${a.id}`);
  }
}
