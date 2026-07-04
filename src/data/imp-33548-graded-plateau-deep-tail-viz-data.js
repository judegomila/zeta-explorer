/**
 * @module imp-33548-graded-plateau-deep-tail-viz-data
 *
 * imp-33548 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33316 graded-plateau deep-tail node-budget measurement. Presents the
 * per-rung ULP scan across the dense integer window n in [285,315] -- the
 * imp-33316 reference window around the n=300 plateau lattice spike -- plus
 * the n=300 head-to-head PLATEAU-HOLDS vs UNIFORM-FAILS comparison and the
 * ~9.3x node-budget saving of the fixed 4000-node graded plateau over the
 * 37205-node uniform Richardson ladder.
 *
 * Reference literals are baked from a direct re-run of the imp-33537 W0
 * reference window (n=285..315) and the imp-33316 rungTable n=300 entry --
 * no re-derivation of the underlying A(tau) kernel or quadrature rules here.
 *
 * @see imp-33316-graded-plateau-deep-tail-node-budget.js (source module: coarse deep-tail node budget)
 * @see imp-33537-deep-tail-plateau-spike-recurrence.js (source module: the dense W0 window this bakes)
 *
 * Ticket: imp-33548 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP33548_WINDOW_LO = 285;
export const IMP33548_WINDOW_HI = 315;
export const IMP33548_STRICT_BAND_ULP = 30;
export const IMP33548_DEEP_BAND_ULP = 64;
export const IMP33548_SPIKE_N = 300;
export const IMP33548_NEIGHBOUR_LO_N = 295;
export const IMP33548_NEIGHBOUR_HI_N = 305;

export const IMP33548_PLATEAU_NODES = 4000;
export const IMP33548_UNIFORM_LADDER_NODES = 37205;
export const IMP33548_PLATEAU_SAVING = 9.30125;

// PLATEAU-HOLDS vs UNIFORM-FAILS at the n=300 reference rung.
export const IMP33548_N300_COMPARISON = Object.freeze({
  n: 300,
  gradedPlateauUlp: 50.15194908265721,
  uniformExtrapUlp: 23572.327922468576,
  plateauVsUniformCloseness: 470.01818181818186,
});

// Per-rung ULP scan of the imp-33295 conservative grade4/400p=4000-node graded
// plateau, n=285..315 (imp-33537 W0 reference window rungUlp array).
export const IMP33548_RUNG_ULP = Object.freeze([
  6.412453, 18.47922, 2.91185, 15.59809, 2.890773, 40.79643, 21.11013, 9.249562, 2.912518, 8.252741,
  5.195833, 29.80051, 12.80959, 23.03274, 20.2905, 50.15195, 31.54929, 12.26731, 14.52232, 31.39108,
  2.153104, 32.48546, 13.04578, 7.129699, 4.480366, 0.5630274, 16.27111, 25.77456, 20.09621, 32.95356,
  25.53526,
]);

export const IMP33548_SCAN = Object.freeze(
  IMP33548_RUNG_ULP.map((ulp, i) => Object.freeze({ n: IMP33548_WINDOW_LO + i, ulp }))
);
