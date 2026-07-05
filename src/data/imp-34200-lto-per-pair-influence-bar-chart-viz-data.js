/**
 * @module imp-34200-lto-per-pair-influence-bar-chart-viz-data
 * @fileoverview imp-34200 -- VIZ DATA ONLY for the imp-34110 leave-two-out (LTO) per-pair
 *   influence ranking: all C(9,2) = 36 folds of the imp-34042 sensitivity test, ranked by
 *   the fitted-log curve-shift metric rmsShift, with the two boundary-edge pairs (rank 1
 *   and rank 2) highlighted as the dominating destabilizers.
 *
 *   Values below are baked reference literals, reproduced by re-evaluating
 *   IMP34110_LTO_PER_PAIR_INFLUENCE_RANKING.ranked from imp-34110-lto-per-pair-influence-
 *   ranking.js. This module does NOT import that file directly (it would transitively pull
 *   imp-33917-endpoint-residual-growth-law.js -> lambda-rh-height-mapping.js ->
 *   polymath15-constant-C-C.js, the same heavy chain the imp-34198 viz-data module avoided)
 *   -- per [[no_heavy_imports_in_pages]], pages must not transitively import the 16.7MB
 *   zeros bundle, so the 36-fold table is baked here instead of imported live.
 *
 *   @see imp-34110-lto-per-pair-influence-ranking.js (the source measurement: 36 LTO folds, curve-shift ranking)
 *   @see imp-34042 (the leave-two-out folds ranked here)
 *   @see imp-33985 (the leave-ONE-out test naming kEnd = 11 most influential)
 *
 *   Ticket: imp-34200 (ux, medium). Presentation only of an already-established
 *   measurement; adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED.
 *   NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 */

// The 36 leave-two-out folds, ranked by fitted-log curve-shift (rmsShift), descending.
// {rank, droppedKEnds: [kEndA, kEndB], rmsShift, deltaAIC, isBoundaryEdge}
export const IMP34200_LTO_FOLDS_RANKED = Object.freeze(
  [
    { rank: 1, droppedKEnds: [11, 11.25], rmsShift: 0.008907, deltaAIC: -2.2238 },
    { rank: 2, droppedKEnds: [12.75, 13], rmsShift: 0.008507, deltaAIC: -3.0492 },
    { rank: 3, droppedKEnds: [11, 11.5], rmsShift: 0.004602, deltaAIC: -2.4031 },
    { rank: 4, droppedKEnds: [12.5, 13], rmsShift: 0.004582, deltaAIC: -2.8337 },
    { rank: 5, droppedKEnds: [11, 12.5], rmsShift: 0.004386, deltaAIC: -2.398 },
    { rank: 6, droppedKEnds: [11.5, 13], rmsShift: 0.00427, deltaAIC: -2.8262 },
    { rank: 7, droppedKEnds: [11, 12.25], rmsShift: 0.004053, deltaAIC: -2.4096 },
    { rank: 8, droppedKEnds: [11, 12.75], rmsShift: 0.004046, deltaAIC: -2.4253 },
    { rank: 9, droppedKEnds: [11.25, 13], rmsShift: 0.00401, deltaAIC: -2.8163 },
    { rank: 10, droppedKEnds: [11.75, 13], rmsShift: 0.003909, deltaAIC: -2.827 },
    { rank: 11, droppedKEnds: [11, 13], rmsShift: 0.003624, deltaAIC: -2.5767 },
    { rank: 12, droppedKEnds: [11, 12], rmsShift: 0.003538, deltaAIC: -2.4227 },
    { rank: 13, droppedKEnds: [11, 11.75], rmsShift: 0.003429, deltaAIC: -2.4245 },
    { rank: 14, droppedKEnds: [12, 13], rmsShift: 0.003422, deltaAIC: -2.8304 },
    { rank: 15, droppedKEnds: [12.25, 13], rmsShift: 0.00338, deltaAIC: -2.8168 },
    { rank: 16, droppedKEnds: [12, 12.25], rmsShift: 0.002525, deltaAIC: -2.6439 },
    { rank: 17, droppedKEnds: [11.75, 12], rmsShift: 0.0025, deltaAIC: -2.6495 },
    { rank: 18, droppedKEnds: [11.75, 12.25], rmsShift: 0.002239, deltaAIC: -2.6391 },
    { rank: 19, droppedKEnds: [12.25, 12.5], rmsShift: 0.002032, deltaAIC: -2.6161 },
    { rank: 20, droppedKEnds: [11.5, 11.75], rmsShift: 0.00202, deltaAIC: -2.6483 },
    { rank: 21, droppedKEnds: [12, 12.5], rmsShift: 0.001964, deltaAIC: -2.6285 },
    { rank: 22, droppedKEnds: [11.5, 12], rmsShift: 0.001955, deltaAIC: -2.6478 },
    { rank: 23, droppedKEnds: [11.5, 12.25], rmsShift: 0.001638, deltaAIC: -2.6367 },
    { rank: 24, droppedKEnds: [11.75, 12.5], rmsShift: 0.001628, deltaAIC: -2.6289 },
    { rank: 25, droppedKEnds: [11.25, 12.25], rmsShift: 0.001038, deltaAIC: -2.6166 },
    { rank: 26, droppedKEnds: [11.5, 12.5], rmsShift: 0.001021, deltaAIC: -2.629 },
    { rank: 27, droppedKEnds: [11.75, 12.75], rmsShift: 0.00101, deltaAIC: -2.6598 },
    { rank: 28, droppedKEnds: [11.5, 12.75], rmsShift: 0.000969, deltaAIC: -2.6625 },
    { rank: 29, droppedKEnds: [11.25, 12.75], rmsShift: 0.000963, deltaAIC: -2.6399 },
    { rank: 30, droppedKEnds: [11.25, 12.5], rmsShift: 0.000925, deltaAIC: -2.6064 },
    { rank: 31, droppedKEnds: [11.25, 12], rmsShift: 0.000899, deltaAIC: -2.6299 },
    { rank: 32, droppedKEnds: [12, 12.75], rmsShift: 0.000849, deltaAIC: -2.6556 },
    { rank: 33, droppedKEnds: [11.25, 11.75], rmsShift: 0.000671, deltaAIC: -2.631 },
    { rank: 34, droppedKEnds: [12.25, 12.75], rmsShift: 0.000612, deltaAIC: -2.6439 },
    { rank: 35, droppedKEnds: [12.5, 12.75], rmsShift: 0.000214, deltaAIC: -2.6434 },
    { rank: 36, droppedKEnds: [11.25, 11.5], rmsShift: 0.000131, deltaAIC: -2.6257 },
  ].map((f) =>
    Object.freeze({
      ...f,
      // The two dominating boundary-edge pairs: rank 1 (low edge 11, 11.25) and
      // rank 2 (high edge 12.75, 13) -- the near-tied worst by curve-shift.
      isBoundaryEdge: f.rank <= 2,
    }),
  ),
);

export const IMP34200_SUMMARY = Object.freeze({
  nFolds: 36,
  mostDestabilizingPair: [11, 11.25],
  mostDestabilizingRmsShift: 0.008907,
  secondDestabilizingPair: [12.75, 13],
  secondDestabilizingRmsShift: 0.008507,
  leastDestabilizingPair: [11.25, 11.5],
  leastDestabilizingRmsShift: 0.000131,
  ratioWorstToLeast: +(0.008907 / 0.000131).toFixed(1), // ~68x
});
