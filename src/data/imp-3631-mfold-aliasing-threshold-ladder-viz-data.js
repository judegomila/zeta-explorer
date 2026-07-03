/**
 * @module imp-3631-mfold-aliasing-threshold-ladder-viz-data
 * @fileoverview imp-3631 -- lightweight, import-light literal data for a
 *   visualization of the imp-3601 m-fold aliasing replica fold-in ladder
 *   N_m = N_replica/m against the four imp-3558 rungs N in
 *   {1200, 2400, 4800, 9600}.
 *
 *   Visualizes the imp-3601 certificate: the m-fold floors N_m decrease
 *   monotonically in m (764, 382, 255, 191 for m = 1..4, ceil of
 *   N_replica/m), so the first replica (m = 1) is the binding floor and
 *   sup_m N_m = N_1 = N_replica ~ 764. Every imp-3558 rung sits strictly
 *   above every fold floor, so the band is replica-free at first- AND
 *   higher-order fold.
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-3601-second-fold-replica-threshold.js measured export (foldLadder,
 *   foldThresholds). This module does NOT import that module, so importing
 *   it into a page costs nothing at load time.
 *
 *   @see imp-3601-second-fold-replica-threshold.js (the source derivation)
 *   @see imp-3582-replica-hiding-grid-threshold.js (N_replica ~ 764 floor)
 *   @see imp-3558-far-tail-band-max-grid-ladder-n9600.js (the four-rung ladder)
 *
 *   Ticket: imp-3631 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// m-fold thresholds N_m = N_replica/m (exact, ceil), m = 1..4.
export const IMP3631_FOLD_LADDER = Object.freeze([
  { m: 1, nThresholdExact: 763.9437, nThreshold: 764, label: 'first replica' },
  { m: 2, nThresholdExact: 381.9718, nThreshold: 382, label: 'second fold' },
  { m: 3, nThresholdExact: 254.6479, nThreshold: 255, label: 'third fold' },
  { m: 4, nThresholdExact: 190.9859, nThreshold: 191, label: 'fourth fold' },
]);

// imp-3558 empirical rungs, all replica-free above every fold threshold.
export const IMP3631_RUNGS = Object.freeze([1200, 2400, 4800, 9600]);

export const IMP3631_BAND = Object.freeze({
  bindingFloor: 763.9437, // sup_m N_m, attained at m = 1
  bindingFoldOrder: 1,
  smallestRung: 1200,
  smallestRungMarginOverBindingFloor: 1200 / 763.9437, // ~1.5708
  smallestRungMarginOverSecondFold: 1200 / 381.9718, // ~3.1416
});

export const IMP3631_VERDICT =
  'MFOLD-LADDER-DECREASING-N_1-764-BINDING-ALL-RUNGS-1200-9600-CLEAR-EVERY-FOLD';
