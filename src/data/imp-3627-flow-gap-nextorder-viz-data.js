/**
 * @module imp-3627-flow-gap-nextorder-viz-data
 *
 * imp-3627 (ux): lightweight, import-light viz-data module for a chart of the imp-3599
 * flow-gap next-order correction across the imp-3443 half-to-double E_trunc floor grid
 * f in {0.5, 0.75, 1.0, 1.5, 2.0}.
 *
 * Reference literals are baked from imp-3599's measured floorGrid (no re-computation,
 * no re-derivation): the root-solved (measured) gap, the imp-3580 leading-law model
 * 2 E_flow(N_x)/E_trunc, the imp-3599 next-order model 2 eps(1+lambda) -
 * (4 mu+4 lambda+3) eps^2, and the two residual ladders (leading-law resid0, next-order
 * resid1) -- the latter shrinking the former by ~20x uniformly across the grid.
 *
 * @see imp-3599-flow-gap-nextorder-correction (source module: floorGrid, gap_pct /
 *   leading_pct / nextorder_pct / resid_leading_pp / resid_nextorder_pp fields)
 * @see imp-3580-sigma-crossover-floor-invariance (the leading gap ~ 2 E_flow/E_trunc law)
 * @see imp-3443-nmax-etrunc-sensitivity (the half-to-double E_trunc floor grid 0.5x..2x)
 */

// Baked from imp-3599's floorGrid[*].{gap_pct,leading_pct,nextorder_pct,resid_leading_pp,resid_nextorder_pp}.
export const IMP3627_FLOW_GAP_GRID = [
  { factor: 0.5, measured_pct: 0.22832, leading_pct: 0.21849, nextorder_pct: 0.22787, resid_leading_pp: 0.00983, resid_nextorder_pp: 0.00045 },
  { factor: 0.75, measured_pct: 0.31643, leading_pct: 0.3023, nextorder_pct: 0.31575, resid_leading_pp: 0.01413, resid_nextorder_pp: 0.00068 },
  { factor: 1.0, measured_pct: 0.39811, leading_pct: 0.37985, nextorder_pct: 0.39719, resid_leading_pp: 0.01826, resid_nextorder_pp: 0.00092 },
  { factor: 1.5, measured_pct: 0.54863, leading_pct: 0.52245, nextorder_pct: 0.54722, resid_leading_pp: 0.02618, resid_nextorder_pp: 0.00141 },
  { factor: 2.0, measured_pct: 0.68729, leading_pct: 0.65352, nextorder_pct: 0.68536, resid_leading_pp: 0.03376, resid_nextorder_pp: 0.00192 },
];

export const IMP3627_EXACT_IDENTITY_FLOOR = 1e-13; // imp-3599 closed identity vs root-solve, ~1e-14/1e-13
export const IMP3627_MIN_RESID_SHRINK = 18.9; // worst-floor factor (f=0.5): 0.00983/0.00045 pp/pp
export const IMP3627_MAX_RESID_SHRINK = 21.8; // best-floor factor (f=1.0): 0.01826/0.00092 pp/pp (rounds to ~20x uniformly)
