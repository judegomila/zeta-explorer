/**
 * @module imp-33613-band-crossing-cross-solver-node-budget-viz-data
 *
 * imp-33613 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33577 band-crossing cross-solver node budget. Presents, at each of the
 * imp-33557 BAND-CROSSING rungs n in {495,510,596}, the smallest node count at
 * which each solver clears the imp-33316 &lt; 64 ULP A_log band: the independent
 * single-grid Clenshaw-Curtis ladder (513/513/385 nodes, CC floor
 * ~14.7/~1.6/~0.87 ULP) against the imp-33557 graded-GL grade-4 minInBandNodes
 * (200/~500/Infinity). At n=596 the graded ladder never clears the band on its
 * &lt;= 4000-node budget while CC clears it in ~385 nodes -- the imp-33577
 * headline that the n=596 graded failure is a RULE-SPECIFIC resolution
 * artifact, not a rule-invariant arithmetic-jitter floor.
 *
 * Reference literals are baked from a direct re-run of the imp-33577
 * self-computing module (same phiKernel/saddleTau/aDirectGradedGL/aDirectCC
 * formulas, CC_LADDER nodes 17..8193, PANEL_SWEEP 100..4000 nodes) -- no
 * re-derivation of the underlying A(tau) kernel or quadrature rules here.
 *
 * @see imp-33577-band-crossing-cross-solver-node-budget.js (source module: the cross-solver sweep)
 * @see imp-33557-band-crossing-min-budget.js (the graded band-conditional minimum this cross-solves)
 * @see imp-33316-graded-plateau-deep-tail-node-budget.js (the &lt; 64 ULP deep-tail band)
 *
 * Ticket: imp-33613 (ux, medium). Presentation only, RH-equivalent; imp-3066
 * untouched; no refereed bound is changed; NO QED.
 */

export const IMP33613_BAND_ULP = 64;

export const IMP33613_ROWS = [
  {
    n: 495,
    tauStar: 0.9351464197283086,
    gradedMinInBandNodes: 200,
    gradedBandStatus: 'HOLDS',
    ccMinNodes: 513,
    ccMinUlp: 22.765856370335694,
    ccFloorUlp: 14.68764927118432,
  },
  {
    n: 510,
    tauStar: 0.9410392318415262,
    gradedMinInBandNodes: 500,
    gradedBandStatus: 'EDGE',
    ccMinNodes: 513,
    ccMinUlp: 1.6148126426848737,
    ccFloorUlp: 1.6148126426848737,
  },
  {
    n: 596,
    tauStar: 0.9719236195928045,
    gradedMinInBandNodes: null, // Infinity: no budget on the <= 4000-node graded ladder clears the band
    gradedBandStatus: 'FAILS',
    ccMinNodes: 385,
    ccMinUlp: 49.63009423733168,
    ccFloorUlp: 0.8707034076724858,
  },
];

export const IMP33613_MODEST_BUDGET_NODES = 1024;
export const IMP33613_MAX_GRADED_LADDER_NODES = 4000;
