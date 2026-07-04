/**
 * @module imp-33298-fifth-pair-precision-collapse-viz-data
 * @fileoverview imp-33298 -- VIZ DATA ONLY. Bakes the imp-33272 side-by-side fp64-vs-double-double
 *   fifth-pair spread measurement (identical N=2000 fifth-pair matrix, imp-3668 spectrum) alongside
 *   the imp-33253 derived Wilkinson n*kappa_pair floor line, for a bar-chart viz page. Values are
 *   baked as literals (toExponential(6)/fixed prints of imp-33272's computed fields), per
 *   [[storage_precision_assertion_tolerance]] -- this module does NOT re-run the dd Jacobi solve.
 *
 *   @see imp-33272-fifth-pair-extended-precision-crossval.js (the measurement this bakes)
 *   @see imp-33253-fifth-pair-condition-number-floor.js (the derived Wilkinson kappa*u floor line)
 *
 *   Ticket: imp-33298 (ux, low). Presentation of an already-established cross-check; adds no new
 *   Lambda bound. imp-3066 K_a>=0 UNTOUCHED. RH-EQUIVALENT. NO QED. Platt-Trudgian Lambda <= 0.2
 *   remains the rigorous SOTA.
 */

// -- baked from imp-33272 (fp64 vs double-double fifth-pair spread, identical N=2000 matrix) --
export const IMP33298_SPREAD_FP64_ULPS = 4.424858; // spreadFp64Ulps, order n*kappa_pair
export const IMP33298_SPREAD_FP64_REL = 9.825158e-16; // spreadFp64Rel
export const IMP33298_SPREAD_DD_REL = 3.272435e-32; // spreadDDRel, double-double floor
export const IMP33298_COLLAPSE_ORDERS = 16; // round(log10(collapseRatio)), collapseRatio ~ 3.00e16

// -- baked from imp-33272/imp-33253 (derived Wilkinson n*kappa_pair floor at the N=2000 rung) --
export const IMP33298_WILKINSON_FLOOR_ULPS = 10.012415; // n=10, kappa_pair ~ 1.001242

// chartUlps places both bars on ONE shared axis: fp64 machine-epsilon units. For the
// dd bar this is deliberately NOT double-double's own ULP (which would sit at O(1) in
// dd's ~1e-32 epsilon and defeat the point of the chart) -- it is spreadDDRel expressed
// in fp64-ULP units, so the collapse across working precisions is visible on one scale.
export const IMP33298_BARS = Object.freeze([
  Object.freeze({
    key: 'fp64',
    label: 'fp64 Jacobi',
    chartUlps: IMP33298_SPREAD_FP64_ULPS,
    rel: IMP33298_SPREAD_FP64_REL,
  }),
  Object.freeze({
    key: 'dd',
    label: 'double-double Jacobi',
    chartUlps: IMP33298_SPREAD_DD_REL / 2.220446049250313e-16,
    rel: IMP33298_SPREAD_DD_REL,
  }),
]);

export default Object.freeze({
  id: 'imp-33298-fifth-pair-precision-collapse-viz-data',
  ticket: 'imp-33298',
  source: 'imp-33272-fifth-pair-extended-precision-crossval.js',
  bars: IMP33298_BARS,
  wilkinsonFloorUlps: IMP33298_WILKINSON_FLOOR_ULPS,
  collapseOrders: IMP33298_COLLAPSE_ORDERS,
});
