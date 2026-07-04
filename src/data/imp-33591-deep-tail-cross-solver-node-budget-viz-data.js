/**
 * @module imp-33591-deep-tail-cross-solver-node-budget-viz-data
 *
 * imp-33591 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33560 deep-tail cross-solver node-budget comparison. Presents, for the
 * deeper deep-tail rungs n in {350,375,400}, the imp-33539 FLAT ~200-node
 * graded-GL minimum against the independent single-grid Clenshaw-Curtis
 * minimum (257, 257, 513 nodes) and the CC/graded ratio (~1.285, ~1.285,
 * ~2.565) -- all under the 4x node-competitive bar, the headline that the
 * imp-33539 ~9.3x/~186x deep-tail graded-vs-uniform saving is baseline-relative.
 *
 * Reference literals are baked from the imp-33560 self-computing RUNG_TABLE
 * (nodes + ULPs) -- no re-derivation of the underlying A(tau) kernel or
 * quadrature rules here.
 *
 * @see imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js (source module: the cross-solver measurement)
 * @see imp-33539-graded-plateau-deeper-tail-min-budget.js (the flat ~200-node graded-GL plateau reference)
 *
 * Ticket: imp-33591 (ux, medium). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP33591_BAND_ULP = 64;
export const IMP33591_GRADED_MIN_NODES = 200;
export const IMP33591_NODE_COMPETITIVE_RATIO = 4;

export const IMP33591_RUNG_TABLE = [
  {
    n: 350,
    gradedMinNodes: 200,
    ccMinNodes: 257,
    ccMinUlp: 19.659174707295463,
    ccOverGraded: 257 / 200,
  },
  {
    n: 375,
    gradedMinNodes: 200,
    ccMinNodes: 257,
    ccMinUlp: 22.81416433547438,
    ccOverGraded: 257 / 200,
  },
  {
    n: 400,
    gradedMinNodes: 200,
    ccMinNodes: 513,
    ccMinUlp: 35.000632401027616,
    ccOverGraded: 513 / 200,
  },
];

export const IMP33591_MAX_CC_OVER_GRADED = Math.max(...IMP33591_RUNG_TABLE.map((r) => r.ccOverGraded));
