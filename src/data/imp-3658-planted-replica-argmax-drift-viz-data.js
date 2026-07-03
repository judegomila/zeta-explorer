/**
 * @module imp-3658-planted-replica-argmax-drift-viz-data
 * @fileoverview imp-3658 -- lightweight, import-light literal data for a
 *   visualization of the imp-3622 planted-replica argmax-drift discriminator.
 *
 *   Visualizes the imp-3622 measurement: a synthetic feature planted at
 *   xi_true = 250 keeps its in-band periodogram argmax pinned at 250 across
 *   the four imp-3558 rungs N in {1200, 2400, 4800, 9600} (drift 0), while
 *   the first-fold (m = 1) and second-fold (m = 2) aliasing-replica argmaxes
 *   climb 2 xi_Nyq and 4 xi_Nyq per panel doubling respectively -- both
 *   staying above the band ceiling xi_max = 400 at every rung, and both above
 *   the imp-3582 generic clearance floor N_replica ~ 764.
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-3622-planted-replica-argmax-drift.js measured export (residual
 *   < 1e-6 against the closed image formula 2 m xi_Nyq - xi_true). This
 *   module does NOT import that module, so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-3622-planted-replica-argmax-drift.js (the source measurement)
 *   @see imp-3582-replica-hiding-grid-threshold.js (the N_replica ~ 764 floor)
 *   @see imp-3657-sigma-crossover-tc-closedform-pin-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-3658 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP3658_BAND = Object.freeze({
  xiTrue: 250,
  xiMax: 400,
  nReplicaFloor: 763.9437, // imp-3582 generic first-order clearance floor (2400/pi)
});

// Per-rung argmax locations (Hz-like frequency units), N in {1200, 2400, 4800, 9600}.
export const IMP3658_RUNGS = Object.freeze([
  { N: 1200, xiNyq: 628.3185, genuineArgmax: 250, firstFoldLoc: 1006.6371, secondFoldLoc: 2263.2741 },
  { N: 2400, xiNyq: 1256.6371, genuineArgmax: 250, firstFoldLoc: 2263.2741, secondFoldLoc: 4776.5482 },
  { N: 4800, xiNyq: 2513.2741, genuineArgmax: 250, firstFoldLoc: 4776.5482, secondFoldLoc: 9803.0965 },
  { N: 9600, xiNyq: 5026.5482, genuineArgmax: 250, firstFoldLoc: 9803.0965, secondFoldLoc: 19856.193 },
]);

// Across-ladder (N=1200 -> N=9600) drift: how far each series' argmax moves.
export const IMP3658_ACROSS_LADDER_DRIFT = Object.freeze({
  genuine: 0, // pinned at xi_true = 250 -- the discriminator's 0 side
  firstFold: 8796.4594, // matches imp-3601 asserted ~8797 (m = 1)
  secondFold: 17592.9189, // matches imp-3601 asserted ~17593 (m = 2), exactly 2x firstFold
});

export const IMP3658_VERDICT =
  'PLANTED-REPLICA-DRIFT-CONFIRMS-IMP3601-2mXINYQ-PER-DOUBLING-INBAND-DRIFT-0-NO-FOLD-INBAND-N>=1200';
