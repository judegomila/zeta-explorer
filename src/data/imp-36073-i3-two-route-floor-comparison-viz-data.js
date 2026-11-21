/**
 * @module imp-36073-i3-two-route-floor-comparison-viz-data
 * @fileoverview imp-36073 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-36011 I3 two-route
 *   modulus-floor comparison on the shared main-term |H_t| ~ 1 normalization:
 *
 *   - Route S (imp-35951): a SINGLE angle-robust off-axis modulus floor,
 *     C_PS = pi / sqrt(2) ~ 2.2214, the constant |A_quad(theta)| of the
 *     scale-free model-cusp amplitude, spread ~0 across theta in {45..135} deg;
 *   - Route G (imp-35778): the two-knob edge-type decomposition
 *     delta = min(delta_short, delta_long), illustrative O(1) floor = 1 at the
 *     main-term normalization |H_t| ~ 1, h ~ 1/w.
 *
 *   Residual factor: FLOOR_RATIO = C_PS / 1 = C_PS ~ 2.2214, |log10 ratio| ~
 *   0.347 decades (< 1 => same order of magnitude). Route S characterizes ONLY
 *   the off-axis LONG edges y = +-h of Route G's four-edge min; it is SILENT on
 *   the axis-crossing SHORT edges x = const.
 *
 *   This module does not import imp-36011 or imp-35951/imp-35778 (no
 *   re-deriving the quadrature/geometry at page-load time); it only bakes the
 *   recorded literals for direct charting.
 *
 *   @see imp-36011-i3-floor-cusp-vs-geometry-reconciliation.js (source reconciliation)
 *   @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy.js (Route S source)
 *   @see imp-35778-i3-edge-type-floor-decomposition-scope.js (Route G source)
 *   @see imp-36000-accumulator-ratio-corners-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-36073 (ux, low). Viz-data only, presentation/no-bound-change;
 *   certifies no delta > 0; I3 stays GREENFIELD; NO QED.
 */

const C_PS = Math.PI / Math.SQRT2; // ~2.2214 (imp-35951 Route S floor)
const ROUTE_G_FLOOR = 1; // illustrative O(1) main-term floor (imp-35778 Route G, h ~ 1/w cancels w)
const FLOOR_RATIO = C_PS / ROUTE_G_FLOOR; // ~2.2214
const OOM_DIFFERENCE = Math.abs(Math.log10(FLOOR_RATIO)); // ~0.347 decades

export const IMP36073_I3_ROUTES = Object.freeze([
  {
    label: 'Route S (imp-35951, single-cusp sampled)',
    floor: +C_PS.toFixed(12),
    edgesCharacterized: 'LONG edges y = +-h (off-axis)',
    edgesSilentOn: 'SHORT edges x = const (axis-crossing)',
  },
  {
    label: 'Route G (imp-35778, four-edge geometric)',
    floor: +ROUTE_G_FLOOR.toFixed(12),
    edgesCharacterized: 'both LONG (delta_long) and SHORT (delta_short) edges, min of the two',
    edgesSilentOn: 'none -- covers all four dR edges',
  },
]);

export const IMP36073_COMPARISON = Object.freeze({
  commonNormalization: 'main-term scale |H_t| ~ 1',
  floorRatio: +FLOOR_RATIO.toFixed(9), // ~2.2214
  oomDifferenceDecades: +OOM_DIFFERENCE.toFixed(9), // ~0.347
  sameOrderOfMagnitude: OOM_DIFFERENCE < 1, // true
});

export const IMP36073_I3_TWO_ROUTE_FLOOR_COMPARISON_VIZ_DATA = {
  ticket: 'imp-36073',
  sourceTicket: 'imp-36011',
  routes: IMP36073_I3_ROUTES,
  comparison: IMP36073_COMPARISON,
  note:
    'imp-36011 I3 two-route modulus-floor comparison at the shared main-term |H_t| ~ 1 ' +
    'normalization: Route S single-cusp C_PS ~ 2.2214 vs Route G O(1) four-edge geometric floor ' +
    '~1, residual factor ~2.2214 (~0.347 decades, same order of magnitude). Route S proxies only ' +
    'the off-axis LONG edges of the Route G four-edge min; it is silent on the axis-crossing SHORT ' +
    'edges.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-36011 reconciliation exactly; adds no new ' +
    'derivation and changes no bound. Both routes remain PROXIES for the true H_t = A + B - C on ' +
    'dR at T_PT = 3e12; certifies no delta > 0; I3 stays GREENFIELD (imp-35727). NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP36073_VIZ_ASSERTIONS = [
  {
    id: 'imp36073-two-routes',
    description: 'exactly 2 named routes (Route S, Route G)',
    holds: () => IMP36073_I3_ROUTES.length === 2,
  },
  {
    id: 'imp36073-route-s-floor-is-cps',
    description: 'Route S floor equals C_PS = pi/sqrt(2) ~ 2.2214',
    holds: () =>
      Math.abs(IMP36073_I3_ROUTES[0].floor - Math.PI / Math.SQRT2) < 1e-9 &&
      Math.abs(IMP36073_I3_ROUTES[0].floor - 2.221441469) < 1e-6,
  },
  {
    id: 'imp36073-route-g-floor-is-one',
    description: 'Route G illustrative floor is exactly 1',
    holds: () => IMP36073_I3_ROUTES[1].floor === 1,
  },
  {
    id: 'imp36073-floor-ratio-matches-cps',
    description: 'floorRatio = C_PS, same order of magnitude (< 1 decade)',
    holds: () =>
      Math.abs(IMP36073_COMPARISON.floorRatio - Math.PI / Math.SQRT2) < 1e-6 &&
      IMP36073_COMPARISON.oomDifferenceDecades < 1 &&
      IMP36073_COMPARISON.sameOrderOfMagnitude === true,
  },
  {
    id: 'imp36073-edge-mapping-asymmetry',
    description: 'Route S characterizes only LONG edges and is silent on SHORT edges; Route G covers both',
    holds: () =>
      /LONG edges/.test(IMP36073_I3_ROUTES[0].edgesCharacterized) &&
      /SHORT edges/.test(IMP36073_I3_ROUTES[0].edgesSilentOn) &&
      /LONG/.test(IMP36073_I3_ROUTES[1].edgesCharacterized) &&
      /SHORT/.test(IMP36073_I3_ROUTES[1].edgesCharacterized) &&
      /none/.test(IMP36073_I3_ROUTES[1].edgesSilentOn),
  },
  {
    id: 'imp36073-honesty-gate-no-qed',
    description: 'honest status references viz-data-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP36073_I3_TWO_ROUTE_FLOOR_COMPARISON_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP36073_I3_TWO_ROUTE_FLOOR_COMPARISON_VIZ_DATA.honest) &&
      /NO QED/.test(IMP36073_I3_TWO_ROUTE_FLOOR_COMPARISON_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP36073_I3_TWO_ROUTE_FLOOR_COMPARISON_VIZ_DATA.honest),
  },
];

for (const a of IMP36073_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36073-i3-two-route-floor-comparison-viz-data assertion failed: ${a.id}`);
  }
}
