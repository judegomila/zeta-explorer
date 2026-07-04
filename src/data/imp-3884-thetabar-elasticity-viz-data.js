/**
 * @module imp-3884-thetabar-elasticity-viz-data
 * @fileoverview imp-3884 -- lightweight, import-light literal data for a
 *   visualization of the imp-3854 thetaBar-elasticity of the imp-3725
 *   certified K_paper enclosure across the feasible [0.99, thetaBar*] window,
 *   per H_raw-plateau tiling [1e4, 1e6]: the measured relative K_paper shift
 *   (imp-3728 improveFactor - 1, always < 1.4e-5) against the analytic
 *   O((H/Dmin)^2) prediction band imp-3854 derives, illustrating the
 *   double-inertness (product of two O((H/Dmin)^2) factors) that keeps the
 *   8.31e4x carryforward margin thetaBar-robust.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3854-thetabar-insensitivity-derivation.js (ROWS: H, Dmin, hOverDminSq,
 *   predictedRelKChange, measuredRelKChange, predictionRatio). This module
 *   does NOT import the Odlyzko zeros bundle or the imp-3725/3728/3854
 *   modules themselves, so importing it into a page costs nothing at load
 *   time.
 *
 *   @see imp-3854-thetabar-insensitivity-derivation.js (source derivation + full rows)
 *   @see imp-3728-fmb-thetabar-sensitivity.js (the measurement imp-3854 explains)
 *
 *   Ticket: imp-3884 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP3884_ROWS = Object.freeze([
  { plateauIndex: 0, startN: 10000,  endN: 18859,   H: 0.0376985,  Dmin: 1.01843815, hOverDminSq: 1.3701837791e-3, predictedRelKChange: 1.1521905088e-5, measuredRelKChange: 1.2e-5,  predictionRatio: 1.0414944324 },
  { plateauIndex: 1, startN: 18860,  endN: 44555,   H: 0.03530732, Dmin: 0.725045979, hOverDminSq: 2.371365028e-3, predictedRelKChange: 1.737182711e-5,  measuredRelKChange: 1.4e-5,  predictionRatio: 0.8059025636 },
  { plateauIndex: 2, startN: 44556,  endN: 73997,   H: 0.02953763, Dmin: 1.03830817, hOverDminSq: 8.092798916e-4, predictedRelKChange: 7.053286814e-6,  measuredRelKChange: 1.1e-5,  predictionRatio: 1.5595565996 },
  { plateauIndex: 3, startN: 73998,  endN: 82552,   H: 0.02583928, Dmin: 0.844046273, hOverDminSq: 9.371914181e-4, predictedRelKChange: 8.118166863e-6,  measuredRelKChange: 1.1e-5,  predictionRatio: 1.3549856988 },
  { plateauIndex: 4, startN: 82553,  endN: 87761,   H: 0.0208495,  Dmin: 0.673928644, hOverDminSq: 9.571135347e-4, predictedRelKChange: 8.640393185e-6,  measuredRelKChange: 7e-6,   predictionRatio: 0.8101483173 },
  { plateauIndex: 5, startN: 87762,  endN: 95248,   H: 0.01948463, Dmin: 0.757921236, hOverDminSq: 6.609006443e-4, predictedRelKChange: 6.105218395e-6,  measuredRelKChange: 9e-6,   predictionRatio: 1.4741487394 },
  { plateauIndex: 6, startN: 95249,  endN: 354769,  H: 0.01470148, Dmin: 0.881065028, hOverDminSq: 2.784236923e-4, predictedRelKChange: 2.697872724e-6,  measuredRelKChange: 4e-6,   predictionRatio: 1.4826496315 },
  { plateauIndex: 7, startN: 354770, endN: 415587,  H: 0.01305322, Dmin: 0.565709875, hOverDminSq: 5.324119513e-4, predictedRelKChange: 5.068331942e-6,  measuredRelKChange: 4e-6,   predictionRatio: 0.7892142909 },
  { plateauIndex: 8, startN: 415588, endN: 420891,  H: 0.00863639, Dmin: 0.585747313, hOverDminSq: 2.173921620e-4, predictedRelKChange: 2.164092797e-6,  measuredRelKChange: 2e-6,   predictionRatio: 0.9241747873 },
  { plateauIndex: 9, startN: 420892, endN: 1000000, H: 0.00570371, Dmin: 0.691776931, hOverDminSq: 6.798024440e-5, predictedRelKChange: 6.864493459e-7,  measuredRelKChange: 1e-6,   predictionRatio: 1.4567717281 },
]);

export const IMP3884_PREDICTION_RATIO_RANGE = Object.freeze([0.7892142908752592, 1.5595565996412912]);
export const IMP3884_MAX_MEASURED_REL_K_CHANGE = 1.399999999995849e-5;
export const IMP3884_CARRYFORWARD_MARGIN = 8.31e4;
