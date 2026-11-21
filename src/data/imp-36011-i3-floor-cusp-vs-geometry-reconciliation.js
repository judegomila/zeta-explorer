/**
 * @module imp-36011-i3-floor-cusp-vs-geometry-reconciliation
 *
 * imp-36011 (accuracy/assessment, S-frontier): RECONCILE the two independent
 * imp-35727 ingredient-I3 modulus-floor routes for the transition rectangle
 * dR = [T_PT, T_PT + Delta] x [-h, h], and report whether the single-cusp
 * SAMPLED floor and the four-edge GEOMETRIC floor agree in order of magnitude.
 *
 *   Route S (imp-35951, from the HELD imp-33923 quadrature): a SINGLE
 *     angle-robust modulus floor proxy delta = C_PS = pi / sqrt(2) ~ 2.2214,
 *     read as the constant modulus |A_quad(theta)| of the scale-free off-axis
 *     model-cusp leading amplitude A(theta) = int |u|^{-1/2}/(w-u)^2 du,
 *     w = e^{i theta}, sampled across theta in {45..135} deg (spread ~0).
 *   Route G (imp-35778): a two-knob edge-type decomposition
 *     delta = min(delta_short, delta_long), where delta_short is the on-axis
 *     reverse-triangle surplus (|A_t+B_t| - |C_t|) - cap on the axis-crossing
 *     SHORT edges x = const (endpoints placed between real zeros) and delta_long
 *     ~ |H_t prime| . h is the h-LINEAR floor on the off-axis LONG edges y = +-h.
 *
 * These two I3 floor routes have never been cross-compared. This module places
 * them on the common main-term (O(1)) normalization and measures the residual
 * factor, and identifies WHICH dR edges each route actually characterizes.
 *
 * ASSESSMENT / MEASUREMENT ONLY. Certifies no delta > 0; instantiates no
 * interval enclosure; evaluates no |H_t| or |H_t prime| on any edge; counts no
 * zeros; positions no rectangle; fixes no Delta or h; changes no bound; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * WHY THE COMPARISON NEEDS A COMMON NORMALIZATION
 * -----------------------------------------------------------------------------
 * Neither route delivers a certified |H_t| magnitude at T_PT. Route S reads the
 * modulus of a SCALE-FREE amplitude integral: the imp-33923 model cusp
 * rho = |x|^{-1/2} carries no intrinsic height scale, so C_PS ~ 2.2214 is a
 * dimensionless O(1) number, not a value of |H_t| on dR. Route G is likewise an
 * ORDER-OF-MAGNITUDE proxy: imp-35778 normalises the main-term modulus to
 * |H_t| ~ 1 and shows both edge floors reach that same O(1) main-term scale
 * under the zero-spacing geometry (endpoints one mean gap apart, h ~ 1/w). So
 * the only meaningful cross-comparison is at the shared main-term normalization
 * |H_t| ~ 1: does the single-cusp C_PS sit in the SAME order of magnitude as the
 * imp-35778 O(1) geometric floor?
 *
 * THE ORDER-OF-MAGNITUDE VERDICT
 * -----------------------------------------------------------------------------
 * Route S floor: C_PS = pi / sqrt(2) ~ 2.2214.
 * Route G floor (illustrative, imp-35778): delta_long ~ |H_t| . w . h ~ 1 at
 *   h ~ 1/w with |H_t| ~ 1 (delta_short is likewise main-term-scale O(1)).
 * Ratio C_PS / 1 = 2.2214, i.e. |log10 ratio| = 0.347 < 1: the single-cusp
 * sampled floor is CONSISTENT with the geometric min-floor -- SAME order of
 * magnitude, the sampled floor sitting a factor ~2.2 ABOVE the illustrative
 * O(1) geometric floor (well inside one decade).
 *
 * WHICH EDGES EACH ROUTE CHARACTERIZES (the structural asymmetry)
 * -----------------------------------------------------------------------------
 * The imp-35951 sample is an OFF-AXIS observation: it reads the modulus of the
 * model cusp along an observation direction theta OFF the singularity, and the
 * modulus is angle-ROBUST (a single constant C_PS). That maps it to the
 * imp-35778 LONG edges y = +-h (off the axis), where |H_t| is likewise bounded
 * away from 0 by moving off the axis: Route S is a proxy for delta_long, the
 * OFF-AXIS half of Route G. It is SILENT on the imp-35778 SHORT edges x = const,
 * whose floor delta_short is the ON-AXIS inter-zero surplus set by endpoint
 * placement between real zeros -- a mechanism the single off-axis cusp sample
 * never sees. So the four-edge geometric min delta = min(delta_short,
 * delta_long) could BIND on either family, and the single-cusp proxy informs
 * only the long-edge (off-axis) half of that minimum.
 *
 * WHAT THIS DOES NOT DO (the honesty boundary)
 * -----------------------------------------------------------------------------
 * Order-of-magnitude reconciliation only. BOTH routes remain PROXIES for the
 * true H_t = A + B - C on dR at T_PT = 3e12 (greenfield imp-35681 Part A /
 * imp-35725): Route S on the off-axis model cusp rho = |x|^{-1/2}, Route G an
 * OOM scoping using the imp-35777 sup-derivative proxy B ~ |H_t| . w in place of
 * the required inf|H_t prime|. Neither certifies delta > 0; the agreement is
 * between two normalized O(1) proxies, NOT between two certified floors, and the
 * true |H_t| magnitude on dR at T_PT stays unknown. A certified I3 floor needs
 * an interval LOWER bound on |H_t| on each edge, gated on the greenfield
 * evaluator. Instantiates no interval enclosure; certifies no delta > 0; counts
 * no zeros; changes no bound; I3 stays GREENFIELD; NO QED. No refereed bound is changed.
 *
 * @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy (Route S: single-cusp C_PS floor proxy)
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (Route G: delta = min(delta_short, delta_long))
 * @see imp-35993-i2-panel-proxy-reconciliation-per-unit-height (sibling I2 proxy reconciliation)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 floor = margin - cap; monolithic min over dR)
 * @see imp-35777-i2-logderivative-panel-cap-scope (B = sup|H_t prime| ~ |H_t| . w derivative-scale proxy)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I3 named GREENFIELD)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval enclosure greenfield)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35951 / imp-35778) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this reconciliation

// Winding / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777 / imp-35778).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446 rad per unit height at T_PT

// Route S floor (imp-35951, from the held imp-33923 sampled quadrature modulus).
const C_PS = Math.PI / Math.SQRT2; // ~2.2214: angle-robust off-axis model-cusp modulus = sampled |f| floor

// Route G floor (imp-35778, illustrative main-term normalization): |H_t| ~ 1, off-axis h ~ 1/w
// gives delta_long ~ |H_t| . w . h ~ 1; delta_short is likewise main-term scale O(1).
const ILLUSTRATIVE_HT = 1; // O(1) main-term-scale |H_t| (imp-35778)
const H_OFFAXIS = 1 / W_TPT; // ~0.0744, ~ (1/pi) of the mean zero gap (imp-35778)
const ROUTE_G_FLOOR = ILLUSTRATIVE_HT * W_TPT * H_OFFAXIS; // = 1 (h ~ 1/w cancels w)

// Common main-term normalization: ratio of the single-cusp floor to the geometric O(1) floor.
const FLOOR_RATIO = C_PS / ROUTE_G_FLOOR; // = C_PS ~ 2.2214
const OOM_DIFFERENCE = Math.abs(Math.log10(FLOOR_RATIO)); // ~0.347 decades (< 1 => same OOM)
const SAME_ORDER_OF_MAGNITUDE = OOM_DIFFERENCE < 1;

export const IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION = {
  id: 'imp-36011',
  proofSection: 'S-frontier',
  question:
    'Reconcile the imp-35951 single-cusp SAMPLED I3 modulus-floor proxy delta = C_PS = pi/sqrt(2) ~ 2.2214 ' +
    '(angle-robust min |A_quad| from the held imp-33923 off-axis quadrature) against the imp-35778 two-knob ' +
    'rectangle-geometry floor delta = min(delta_short, delta_long): do the single-cusp sampled floor and the ' +
    'four-edge geometric floor agree in order of magnitude, and which dR edges does each route characterize? ' +
    'Assessment/measurement only; certifies no delta > 0; changes no bound; NO QED.',
  routeS: {
    source: 'imp-35951 (from the HELD imp-33923 off-axis phase-winding quadrature, isRigorous:false)',
    floor: +C_PS.toFixed(12),
    kind:
      'a SINGLE angle-robust modulus floor: the constant |A_quad(theta)| = C_PS = pi/sqrt(2) of the scale-free ' +
      'off-axis model-cusp leading amplitude, spread over the {45..135} deg sweep ~0 (< 1e-9)',
    dimensionNote:
      'C_PS is the modulus of a SCALE-FREE amplitude integral, a dimensionless O(1) number -- NOT a value of ' +
      '|H_t| on dR (the model cusp carries no intrinsic height scale)',
  },
  routeG: {
    source: 'imp-35778 (two-knob edge-type decomposition, isRigorous:false)',
    floor: 'delta = min(delta_short, delta_long)',
    illustrativeFloor: +ROUTE_G_FLOOR.toFixed(12), // = 1 at |H_t| ~ 1, h ~ 1/w
    shortEdge: 'delta_short = (|A_t+B_t| - |C_t|) - cap: ON-AXIS reverse-triangle surplus on the short edges x = const',
    longEdge: 'delta_long ~ |H_t prime| . h ~ |H_t| . w . h: OFF-AXIS h-linear floor on the long edges y = +-h',
    dimensionNote:
      'both edge floors are OOM proxies normalised to main-term scale |H_t| ~ 1; they reach O(1) under the ' +
      'zero-spacing geometry (endpoints one mean gap apart, h ~ 1/w)',
  },
  reconciliation: {
    commonNormalization: 'main-term scale |H_t| ~ 1 (the only shared footing; neither route is a certified |H_t| magnitude)',
    routeSFloor: +C_PS.toFixed(12),
    routeGFloor: +ROUTE_G_FLOOR.toFixed(12),
    floorRatio: +FLOOR_RATIO.toFixed(9), // ~2.2214
    oomDifferenceDecades: +OOM_DIFFERENCE.toFixed(9), // ~0.347
    sameOrderOfMagnitude: SAME_ORDER_OF_MAGNITUDE, // true
    verdictLine:
      'CONSISTENT -- same order of magnitude: the single-cusp C_PS ~ 2.2214 sits a factor ~2.2 ABOVE the ' +
      'imp-35778 illustrative O(1) geometric floor, |log10 ratio| ~ 0.347 < 1 (well inside one decade)',
  },
  edgeMapping: {
    routeSCharacterizes:
      'the imp-35778 LONG edges y = +-h (OFF the axis): the imp-35951 sample is an off-axis observation of an ' +
      'angle-robust modulus, matching the off-axis long-edge floor delta_long',
    routeSSilentOn:
      'the imp-35778 SHORT edges x = const (axis-crossing): delta_short is the ON-AXIS inter-zero surplus set by ' +
      'endpoint placement between real zeros -- a mechanism the single off-axis cusp sample never sees',
    consequence:
      'the four-edge geometric min delta = min(delta_short, delta_long) could BIND on either edge family; the ' +
      'single-cusp proxy informs ONLY the long-edge (off-axis) half of that minimum',
  },
  windingRateTPT: +W_TPT.toFixed(6),
  offAxisHeight: +H_OFFAXIS.toFixed(9),
  isRigorous: false,
  verdict:
    'ASSESSMENT / MEASUREMENT (frontier-direction, NOT rigorous). The two imp-35727 ingredient-I3 modulus-floor ' +
    'routes reconcile at the shared main-term normalization |H_t| ~ 1. Route S (imp-35951) gives a SINGLE ' +
    'angle-robust floor delta = C_PS = pi/sqrt(2) ~ 2.2214, the constant modulus of the scale-free off-axis ' +
    'model cusp; Route G (imp-35778) gives delta = min(delta_short, delta_long) with both edge floors reaching ' +
    'the O(1) main-term scale (illustrative ~1) under the zero-spacing geometry. The ratio C_PS / 1 = 2.2214 has ' +
    '|log10 ratio| ~ 0.347 < 1, so the single-cusp SAMPLED floor is CONSISTENT with the four-edge GEOMETRIC floor ' +
    '-- SAME order of magnitude, sitting a factor ~2.2 ABOVE the illustrative O(1) geometric floor. STRUCTURAL ' +
    'ASYMMETRY: the imp-35951 sample is an OFF-AXIS observation of an angle-robust modulus, so it characterizes ' +
    'ONLY the imp-35778 LONG edges y = +-h (the off-axis delta_long) and is SILENT on the SHORT edges x = const, ' +
    'whose delta_short is the ON-AXIS inter-zero surplus set by endpoint placement -- so the geometric min could ' +
    'bind on either family and the single-cusp proxy informs only the long-edge half. BOTH remain PROXIES for the ' +
    'true H_t = A + B - C on dR at T_PT = 3e12 (Route S on the model cusp rho = |x|^{-1/2}, Route G an OOM scoping ' +
    'using the imp-35777 sup-derivative in place of inf|H_t prime|); the agreement is between two normalized O(1) ' +
    'proxies, NOT two certified floors, and the true |H_t| magnitude on dR stays unknown. Instantiates no interval ' +
    'enclosure; certifies no delta > 0; counts no zeros; fixes no Delta or h; changes no bound; I3 stays ' +
    'GREENFIELD; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35951 (single-cusp C_PS = pi/sqrt(2) I3 floor proxy from the held imp-33923 quadrature); imp-35778 ' +
    '(two-knob delta = min(delta_short, delta_long) edge-type decomposition); imp-35993 (sibling I2 proxy ' +
    'reconciliation); imp-35758 (I3 floor = margin - cap, monolithic min over dR); imp-35777 (B = sup|H_t prime| ' +
    '~ |H_t| . w); imp-35727 (I3 GREENFIELD); imp-35681 Part A (A+B-C interval enclosure greenfield); Polymath15 ' +
    '2019 (H_t = A + B - C, barrier method); Platt-Trudgian 2021.',
};

export const IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION_ASSERTIONS = [
  {
    // Route S floor is the imp-35951 single-cusp C_PS = pi/sqrt(2) ~ 2.2214.
    id: 'imp36011-route-s-floor-is-cps',
    description: 'Route S (imp-35951) single-cusp floor = C_PS = pi/sqrt(2) ~ 2.2214',
    holds: () =>
      Math.abs(C_PS - Math.PI / Math.SQRT2) < 1e-15 &&
      Math.abs(C_PS - 2.221441469) < 1e-6 &&
      Math.abs(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.routeS.floor - C_PS) < 1e-9,
  },
  {
    // Route G illustrative floor normalises to O(1): delta_long ~ |H_t| . w . h = 1 at h ~ 1/w.
    id: 'imp36011-route-g-floor-is-order-one',
    description: 'Route G (imp-35778) illustrative floor = |H_t| . w . h = 1 at h ~ 1/w (h cancels w)',
    holds: () =>
      Math.abs(ROUTE_G_FLOOR - 1) < 1e-9 &&
      Math.abs(H_OFFAXIS - 1 / W_TPT) < 1e-15 &&
      Math.abs(W_TPT - windingRate(3e12)) < 1e-15,
  },
  {
    // The order-of-magnitude verdict: ratio = C_PS, within one decade => same OOM.
    id: 'imp36011-same-order-of-magnitude',
    description: 'Floor ratio C_PS / 1 = 2.2214, |log10 ratio| ~ 0.347 < 1 => single-cusp and geometric floors agree in OOM',
    holds: () =>
      Math.abs(FLOOR_RATIO - C_PS) < 1e-9 &&
      Math.abs(OOM_DIFFERENCE - Math.abs(Math.log10(C_PS))) < 1e-12 &&
      OOM_DIFFERENCE < 1 &&
      SAME_ORDER_OF_MAGNITUDE === true &&
      /same order of magnitude/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.reconciliation.verdictLine),
  },
  {
    // Edge mapping: Route S proxies the LONG (off-axis) edges, silent on the SHORT (axis-crossing) edges.
    id: 'imp36011-edge-mapping-long-vs-short',
    description: 'Route S characterizes the off-axis LONG edges (delta_long); silent on the axis-crossing SHORT edges (delta_short)',
    holds: () =>
      /LONG edges/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.edgeMapping.routeSCharacterizes) &&
      /OFF the axis/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.edgeMapping.routeSCharacterizes) &&
      /SHORT edges/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.edgeMapping.routeSSilentOn) &&
      /ON-AXIS/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.edgeMapping.routeSSilentOn) &&
      /either edge family/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.edgeMapping.consequence),
  },
  {
    // Honesty gate: measurement only, both proxies, no certification, no QED, no refereed bound is changed.
    id: 'imp36011-honesty-gate-no-qed',
    description: 'Measurement only; both routes PROXIES; certifies no delta>0; I3 GREENFIELD; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      /BOTH remain PROXIES/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.verdict) &&
      /certifies no delta > 0/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.verdict) &&
      /I3 stays[\s\S]*GREENFIELD/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.verdict) &&
      /NO QED/.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION.verdict),
  },
];

for (const a of IMP36011_I3_FLOOR_CUSP_VS_GEOMETRY_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36011-i3-floor-cusp-vs-geometry-reconciliation assertion failed: ${a.id}`);
  }
}
