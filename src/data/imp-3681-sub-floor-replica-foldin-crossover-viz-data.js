/**
 * @module imp-3681-sub-floor-replica-foldin-crossover-viz-data
 *
 * imp-3681 (ux): lightweight, import-light viz-data module for a chart of the imp-3647
 * sub-floor replica fold-in: the masking crossover as the ladder N sweeps 900 -> 400 for the
 * planted mid-band feature at xi_true = 250, the co-location point N_colocate ~ 477.46 where the
 * folded replica sweeps exactly through the genuine peak, and the feature-specific floor
 * N_fold ~ 620.70, strictly below the imp-3582 generic worst-case floor N_replica = 764.
 *
 * Reference literals are baked from the imp-3647 rungCells (self-computing at import) -- no
 * re-derivation here.
 *
 * @see imp-3647-below-floor-replica-foldin-margin.js (source module: rungCells, N_fold, N_colocate)
 * @see imp-3582-replica-hiding-grid-threshold.js (generic worst-case floor N_replica ~ 764)
 *
 * Ticket: imp-3681 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP3681_XI_MAX = 400;
export const IMP3681_XI_TRUE = 250;
export const IMP3681_N_REPLICA_GENERIC = 764; // imp-3582 worst-case floor, 2400/pi
export const IMP3681_N_FOLD_EXACT = 620.7042780583919; // (xi_max + xi_true) U/(2 pi) = 1950/pi
export const IMP3681_N_COLOCATE_EXACT = 477.46482927568604; // xi_true U/pi = 1500/pi

// Per-rung ladder measurement (imp-3647 rungCells, N sweeping 900 -> 400).
export const IMP3681_RUNG_LADDER = [
  { N: 900, replicaLoc: 692.4777960769379, inBand: false, peakCount: 1 },
  { N: 764, replicaLoc: 550.0589291142006, inBand: false, peakCount: 1 },
  { N: 700, replicaLoc: 483.03828583761833, inBand: false, peakCount: 1 },
  { N: 640, replicaLoc: 420.20643276582257, inBand: false, peakCount: 1 },
  { N: 512, replicaLoc: 286.165146212658, inBand: true, peakCount: 2 },
  { N: 400, replicaLoc: 168.87902047863912, inBand: true, peakCount: 2 },
];

// The ladder split: largest replica-in-band N vs smallest replica-free N, bracketing N_fold.
export const IMP3681_LARGEST_IN_BAND_N = 512;
export const IMP3681_SMALLEST_FREE_N = 640;
