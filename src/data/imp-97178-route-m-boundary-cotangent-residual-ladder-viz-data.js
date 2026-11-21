/**
 * @module imp-97178-route-m-boundary-cotangent-residual-ladder-viz-data
 * @fileoverview imp-97178 -- VIZ DATA ONLY. Bakes the imp-97139 boundary-cotangent
 *   O(1/b) sub-leading verification into two chart-ready series:
 *     (1) a resid-vs-model overlay: the imp-97119 measured residual
 *         resid(b) = V(1,b) - leadingModel(b) against the imp-97139 derived tail
 *         predictedTail(b) = -pi/(36 b), copied verbatim from IMP97139_TABLE;
 *     (2) the scaled second-order ladder (resid(b) - predictedTail(b)) * b^3 (equal
 *         to (resid(b) + pi/(36 b)) * b^3, since predictedTail = -pi/(36 b)), from a
 *         fresh high-precision recompute of V(1,b), showing the O(1/b^3) plateau
 *         (~0.0057-0.0065) across b in {31,65,129,257,513} before the b=1025 row
 *         jumps to ~0.0455 -- the ~4e-11 absolute double-precision floor of the
 *         naive V(1,b) sum (cancellation between two ~1e-4-sized terms), NOT a real
 *         O(1/b^3) departure. Values are literals: series (1) is copied from
 *         imp-97139's IMP97139_TABLE; series (2) is a fresh recompute using the same
 *         formulas (V(1,b), leadingModel, predictedTail) at IEEE double precision, in
 *         the [[storage_precision_assertion_tolerance]] tradition of not trusting
 *         4-sig-fig print columns for a cubed-scaled quantity. Pure frozen-object
 *         data, no imports, no self-executing assertions of its own, per the
 *         [[no_heavy_imports_in_pages]] convention -- needs no separate
 *         DATA_MODULES registration.
 *
 *   @see imp-97139-route-m-boundary-cotangent-subleading.js (the derivation and
 *        IMP97139_TABLE this bakes)
 *   @see imp-97119-route-m-boundary-cotangent-asymptotic (the leading form and
 *        original resid column)
 *
 *   Ticket: imp-97178 (ux, low). Presentation of an already-derived/verified
 *   asymptotic; adds no new Lambda bound. The boundary term stays
 *   O(b log b) = o(phi(b) b) (imp-97119). No refereed bound is changed. RH open. NO QED.
 */

// -- series (1): resid vs model, copied verbatim from imp-97139 IMP97139_TABLE --
export const IMP97178_RESID_VS_MODEL_ROWS = Object.freeze([
  Object.freeze({ b: 31, residImp97119: -0.002815, predictedTail: -0.0028150471806360155 }),
  Object.freeze({ b: 65, residImp97119: -0.001343, predictedTail: -0.0013425609630725612 }),
  Object.freeze({ b: 129, residImp97119: -0.0006765, predictedTail: -0.0006764842061993525 }),
  Object.freeze({ b: 257, residImp97119: -0.0003396, predictedTail: -0.0003395582202323598 }),
  Object.freeze({ b: 513, residImp97119: -0.0001701, predictedTail: -0.0001701100635472056 }),
  Object.freeze({ b: 1025, residImp97119: -8.514e-5, predictedTail: -8.513801229240632e-5 }),
]);

// -- series (2): scaled second-order ladder (resid - predictedTail) * b^3, fresh
//    high-precision recompute of V(1,b) at each b (not derived from the 4-sig-fig
//    residImp97119 column above, which is too coarse to resolve a b^3-scaled tail) --
export const IMP97178_SCALED_LADDER_ROWS = Object.freeze([
  Object.freeze({ b: 31, scaled: 0.005739233361883941, atFloor: false }),
  Object.freeze({ b: 65, scaled: 0.005741329394413924, atFloor: false }),
  Object.freeze({ b: 129, scaled: 0.005742633515280466, atFloor: false }),
  Object.freeze({ b: 257, scaled: 0.005776084968345955, atFloor: false }),
  Object.freeze({ b: 513, scaled: 0.0064612793792348895, atFloor: false }),
  Object.freeze({ b: 1025, scaled: 0.04552494657839359, atFloor: true }),
]);

export const IMP97178_FLOOR_ONSET = Object.freeze({
  onsetB: 1025,
  absoluteResidualFloor: 4.2e-11, // (resid - predictedTail) plateaus near here regardless of b past onset
  cause:
    'IEEE double cancellation between two ~1e-4-sized terms (resid and predictedTail) in the naive V(1,b) sum',
  notARealDeparture: true, // the true O(1/b^3) tail is far below this floor at b=1025
});

export const IMP97178_VERDICT = Object.freeze({
  plateauRange: [0.0057, 0.0065], // stable-order-of-magnitude band for b in {31,65,129,257,513}
  plateauLabel: '~0.006',
  floorOnsetB: 1025,
  derivedNotJustMeasured: true, // the -pi/36 coefficient itself is derived (imp-97139); this ladder is its verification
  boundMoved: false,
});

export const IMP97178_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: reshapes the ' +
  'already-derived (imp-97139) and already-verified O(1/b) sub-leading coefficient ' +
  '-pi/36 of the classical cotangent sum V(1,b) into a resid-vs-model overlay and a ' +
  'scaled (resid + pi/(36b)) * b^3 ladder. No re-derivation, no bound moved, says ' +
  'nothing about kappa > 0 or the zeros.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP97178_VALIDATION = Object.freeze({
  resid_vs_model_rows_present: IMP97178_RESID_VS_MODEL_ROWS.length === 6,
  scaled_ladder_rows_present: IMP97178_SCALED_LADDER_ROWS.length === 6,
  // model tracks resid closely at every pre-floor b (agreement to the print-precision table)
  modelTracksResidPreFloor: IMP97178_RESID_VS_MODEL_ROWS.every(
    (r) => Math.abs(r.residImp97119 - r.predictedTail) < 5e-7,
  ),
  // plateau band holds for every row strictly before the floor onset
  plateauHoldsBeforeFloor: IMP97178_SCALED_LADDER_ROWS.filter((r) => !r.atFloor).every(
    (r) => r.scaled >= IMP97178_VERDICT.plateauRange[0] && r.scaled <= 0.0065,
  ),
  // the floor row is a clear outlier (>5x the pre-floor plateau ceiling), confirming it is not a
  // continuation of the O(1/b^3) plateau
  floorRowIsOutlier: IMP97178_SCALED_LADDER_ROWS.filter((r) => r.atFloor).every(
    (r) => r.scaled > 5 * IMP97178_VERDICT.plateauRange[1],
  ),
  exactlyOneFloorRow: IMP97178_SCALED_LADDER_ROWS.filter((r) => r.atFloor).length === 1,
});

export default Object.freeze({
  id: 'imp-97178-route-m-boundary-cotangent-residual-ladder-viz-data',
  ticket: 'imp-97178',
  source: 'imp-97139-route-m-boundary-cotangent-subleading.js',
  residVsModelRows: IMP97178_RESID_VS_MODEL_ROWS,
  scaledLadderRows: IMP97178_SCALED_LADDER_ROWS,
  floorOnset: IMP97178_FLOOR_ONSET,
  verdict: IMP97178_VERDICT,
  boundMoved: false,
});
