/**
 * @module imp-3614-sigma-crossover-floor-invariance-viz-data
 * @fileoverview imp-3614 -- lightweight, import-light literal data for a
 *   visualization of the imp-3580 sigma-crossover floor invariance.
 *
 *   Visualizes the N_half/N_x ratio (sigma=1/2 half-decay crossing over the
 *   E_coll=E_trunc crossover) staying in the tight band [0.99313, 0.99772]
 *   ~0.996 across the imp-3443 half-to-double E_trunc floor grid f in
 *   {0.5, 0.75, 1.0, 1.5, 2.0}, alongside the measured flow-gap
 *   1-N_half/N_x growing monotonically 0.228% -> 0.687% while tracking the
 *   structural law gap ~ 2 E_flow(N_x)/E_trunc within the sqrt/log-drift
 *   linearization.
 *
 *   Values below are baked reference literals taken from the imp-3580
 *   floorGrid (root-solved, residual < 1e-9). This module does NOT import
 *   imp-3580-sigma-crossover-floor-invariance.js (or any heavy assembly), so
 *   importing it into a page costs nothing at load time.
 *
 *   @see imp-3580-sigma-crossover-floor-invariance.js (the source derivation)
 *   @see imp-3556-sigma-threshold-crossings-rootsolve (baseline half-decay <=> crossover)
 *   @see imp-3613-replica-fold-in-geometry-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-3614 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP3614_RATIO_BAND = Object.freeze({ min: 0.99313, max: 0.99772, around: 0.996 });
export const IMP3614_GAP_BAND = Object.freeze({ min: 0.228, max: 0.687, baseline: 0.398 });

// Half-to-double E_trunc floor grid: root-solved N_half (sigma=1/2) and N_x
// (E_coll=E_trunc) crossings, the ratio between them, and the measured vs
// structural-law (2 E_flow(N_x)/E_trunc) flow gap, all in percent.
export const IMP3614_GRID = Object.freeze([
  { factor: 0.5, N_half: 1.395523e10, N_x: 1.398717e10, ratio: 0.997717, gap_pct: 0.228, law_gap_pct: 0.218 },
  { factor: 0.75, N_half: 5.972372e9, N_x: 5.991331e9, ratio: 0.996836, gap_pct: 0.316, law_gap_pct: 0.302 },
  { factor: 1.0, N_half: 3.267235e9, N_x: 3.280294e9, ratio: 0.996019, gap_pct: 0.398, law_gap_pct: 0.38 },
  { factor: 1.5, N_half: 1.393979e9, N_x: 1.401669e9, ratio: 0.994514, gap_pct: 0.549, law_gap_pct: 0.522 },
  { factor: 2.0, N_half: 7.607425e8, N_x: 7.660072e8, ratio: 0.993127, gap_pct: 0.687, law_gap_pct: 0.653 },
]);

export const IMP3614_BASELINE = IMP3614_GRID.find((r) => r.factor === 1.0);
