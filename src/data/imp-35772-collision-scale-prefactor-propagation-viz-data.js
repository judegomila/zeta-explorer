/**
 * @module imp-35772-collision-scale-prefactor-propagation-viz-data
 *
 * imp-35772 (ux): lightweight, import-light viz-data module for a chart of
 * the imp-35724 collision-scale prefactor propagation. imp-35724 propagated
 * the imp-35696 cube-root prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.0467 onto the
 * two imp-35337 sigma-landmark heights -- N_peak ~ 9.22e5 (interior flat-cap
 * sigma peak) and N_cross ~ 3.28e9 (E_coll = E_trunc crossover, imp-35304) --
 * showing that the standard-vs-C_C collision scale s_min shift is the SAME
 * O(1) factor ~2.0467 at both landmarks, and that the -1/3 log-log slope of
 * s_min against N is untouched by the coefficient choice.
 *
 * Reference literals are baked from the imp-35724 measurement (no
 * re-derivation, no heavy import):
 *   peak  (N ~ 9.22e5): s_min(std) ~ 9.97e-3,  s_min(C_C) ~ 2.04e-2
 *   cross (N ~ 3.28e9): s_min(std) ~ 6.53e-4,  s_min(C_C) ~ 1.34e-3
 * both ratio to ~2.0467, and both readings' two-landmark log-log slope of
 * s_min against N is ~-1/3.
 *
 * @see imp-35724-collision-scale-landmark-prefactor-propagation.js (source: the propagation measurement this visualizes)
 * @see imp-35696-collision-exponent-consistency-check.js (source: the cube-root prefactor ((pi^2/3)/C_C)^{1/3} ~ 2.047)
 * @see imp-35720-prefactor-M-independence-ladder (prefactor flat across an abstract M-ladder)
 *
 * Ticket: imp-35772 (ux, low). Presentation only, RH-free; C_mb GUE-conditional
 * (imp-486) untouched; changes no bound; NO QED.
 */

export const IMP35772_PREFACTOR_RATIO = 2.0466534; // ((pi^2/3)/C_C)^{1/3}, imp-35696/imp-35724

export const IMP35772_LANDMARK_GRID = [
  {
    label: 'N_peak',
    N: 9.2186e5,
    sMinStd: 9.967e-3,
    sMinCC: 2.040e-2,
  },
  {
    label: 'N_cross',
    N: 3.280294352e9,
    sMinStd: 6.527e-4,
    sMinCC: 1.336e-3,
  },
];

// Two-landmark log-log slope of s_min against N, per coefficient reading.
function logLogSlope(rowHi, rowLo, key) {
  return (
    Math.log10(rowHi[key] / rowLo[key]) / Math.log10(rowHi.N / rowLo.N)
  );
}

export const IMP35772_SLOPE_STD = logLogSlope(
  IMP35772_LANDMARK_GRID[1],
  IMP35772_LANDMARK_GRID[0],
  'sMinStd',
);
export const IMP35772_SLOPE_CC = logLogSlope(
  IMP35772_LANDMARK_GRID[1],
  IMP35772_LANDMARK_GRID[0],
  'sMinCC',
);

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35772_ASSERTIONS = [
  {
    id: 'imp35772-oshift-matches-prefactor-at-both-landmarks',
    description:
      'the C_C/std s_min ratio at both landmarks matches the baked prefactor ratio ~2.0467 to within ' +
      'the 4-significant-figure rounding floor of the baked s_min literals',
    // The s_min values are baked to 4 sig figs, so the ratio of two of them can only reproduce the
    // exact prefactor to ~2e-4 (N_cross: 1.336e-3/6.527e-4 = 2.04688 vs 2.04665, diff 2.3e-4). A 2e-4
    // tolerance was tighter than the input rounding and failed at import; 1e-3 matches the 4-sig-fig floor.
    holds: () =>
      IMP35772_LANDMARK_GRID.every(
        (r) => Math.abs(r.sMinCC / r.sMinStd - IMP35772_PREFACTOR_RATIO) < 1e-3,
      ),
  },
  {
    id: 'imp35772-slopes-near-minus-one-third-and-equal',
    description: 'the two-landmark log-log slope of s_min against N is ~-1/3 for both readings and equal to each other',
    holds: () =>
      Math.abs(IMP35772_SLOPE_STD - -1 / 3) < 5e-3 &&
      Math.abs(IMP35772_SLOPE_CC - -1 / 3) < 5e-3 &&
      Math.abs(IMP35772_SLOPE_STD - IMP35772_SLOPE_CC) < 5e-3,
  },
  {
    id: 'imp35772-cc-values-exceed-std-values',
    description: 's_min(C_C) exceeds s_min(std) at every landmark (the O(1) shift is a lift, not a drop)',
    holds: () => IMP35772_LANDMARK_GRID.every((r) => r.sMinCC > r.sMinStd),
  },
  {
    id: 'imp35772-landmarks-ordered-by-height',
    description: 'the landmark grid is ordered by increasing N (peak before crossover)',
    holds: () => IMP35772_LANDMARK_GRID[1].N > IMP35772_LANDMARK_GRID[0].N,
  },
];

for (const a of IMP35772_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35772-collision-scale-prefactor-propagation-viz-data assertion failed: ${a.id}`);
  }
}
