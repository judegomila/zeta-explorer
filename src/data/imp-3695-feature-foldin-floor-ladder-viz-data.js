/**
 * @module imp-3695-feature-foldin-floor-ladder-viz-data
 *
 * imp-3695 (ux): lightweight, import-light viz-data module for a chart of the imp-3666
 * feature-specific fold-in floor LADDER: the linear N_fold(xi_true) = (xi_max + xi_true) U/(2 pi)
 * line across xi_true in {100..400} (slope 3/pi), the gap(xi_true) = (400 - xi_true) 3/pi closing
 * to 0 at the top rung, and the per-rung in-band comb-peak count flipping 2 -> 1 across each floor.
 *
 * Reference literals are baked from the imp-3666 rungCells (self-computing at import) -- no
 * re-derivation here.
 *
 * @see imp-3666-feature-foldin-floor-ladder.js (source module: rungCells, slope/intercept fit)
 * @see imp-3647-below-floor-replica-foldin-margin.js (parent: single-feature floor at xi_true=250)
 * @see imp-3582-replica-hiding-grid-threshold.js (generic worst-case floor N_replica ~ 764)
 */

export const IMP3695_XI_MAX = 400;
export const IMP3695_SLOPE_EXACT = 0.954929658551372; // 3/pi
export const IMP3695_INTERCEPT_EXACT = 381.9718634205488; // 1200/pi
export const IMP3695_STEP_INCREMENT_EXACT = 47.7464829275686; // 150/pi
export const IMP3695_N_REPLICA_GENERIC_EXACT = 763.9437268410976; // 2400/pi

export const IMP3695_RUNG_LADDER = [
  { xiTrue: 100, nFold: 477.46482927568604, nBelow: 477, nAbove: 478, gapBelowGeneric: 286.47889756541156 },
  { xiTrue: 150, nFold: 525.2113122032546, nBelow: 525, nAbove: 526, gapBelowGeneric: 238.73241463784302 },
  { xiTrue: 200, nFold: 572.9577951308232, nBelow: 572, nAbove: 573, gapBelowGeneric: 190.98593171027437 },
  { xiTrue: 250, nFold: 620.7042780583919, nBelow: 620, nAbove: 621, gapBelowGeneric: 143.23944878270572 },
  { xiTrue: 300, nFold: 668.4507609859604, nBelow: 668, nAbove: 669, gapBelowGeneric: 95.49296585513719 },
  { xiTrue: 350, nFold: 716.1972439135291, nBelow: 716, nAbove: 717, gapBelowGeneric: 47.746482927568536 },
  { xiTrue: 400, nFold: 763.9437268410976, nBelow: 763, nAbove: 764, gapBelowGeneric: 0 },
];

// Per-rung in-band comb-peak count: 2 at N_below (replica folded in, ties the genuine peak),
// 1 at N_above (replica folded out) -- identical at every rung, the discriminator flip.
export const IMP3695_PEAK_COUNT_BELOW = 2;
export const IMP3695_PEAK_COUNT_ABOVE = 1;
