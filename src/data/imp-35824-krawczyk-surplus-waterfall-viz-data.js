/**
 * @module imp-35824-krawczyk-surplus-waterfall-viz-data
 *
 * imp-35824 (ux): lightweight, import-light viz-data module for a
 * waterfall/stacked-bar chart of the imp-35762 D3 residual split, across
 * the three imp-34693 admissible seed band anchors (band-bottom, N_cross,
 * band-top): the exact Krawczyk headroom surplus decomposes additively as
 *   surplus_leading (S_inf . a/2)  +  shift_residual (a-shift, tiny)
 *     +  curvature_residual (O(a^2)+, dominant)  =  surplus_exact
 *
 * Reference literals are baked directly by re-running the imp-35762
 * shiftSplitAt formula at all three band anchors (imp-35762 itself only
 * exports the band-top + N_cross measurement fields, not band-bottom) --
 * no re-derivation of the underlying model, no heavy import.
 *
 * @see imp-35762-krawczyk-surplus-shift-residual-isolation.js (source: the additive split this plots)
 * @see imp-34693-crossover-contraction-seed-band.js (the band-bottom/N_cross/band-top anchors)
 *
 * Ticket: imp-35824 (ux, medium). Presentation only, RH-free; C_mb GUE-conditional
 * (imp-486) untouched; changes no bound; NO QED.
 */

export const IMP35824_SURPLUS_WATERFALL = [
  {
    key: 'band_bottom',
    label: 'band-bottom (N~3.109e9)',
    N: 3109049427.662956,
    leading: 59.897691,
    shift: 0.025716,
    curvature: 1.470321,
    exact: 61.393728,
  },
  {
    key: 'n_cross',
    label: 'N_cross (N~3.280e9)',
    N: 3280294351.652407,
    leading: 56.779221,
    shift: 0.024283,
    curvature: 1.319521,
    exact: 58.123025,
  },
  {
    key: 'band_top',
    label: 'band-top (N~3.452e9)',
    N: 3451539275.641857,
    leading: 53.969745,
    shift: 0.023001,
    curvature: 1.1908,
    exact: 55.183546,
  },
];

export const IMP35824_WATERFALL_GRID = IMP35824_SURPLUS_WATERFALL.map((row) => ({
  ...row,
  shiftFraction: +(row.shift / (row.exact - row.leading)).toFixed(4),
  curvatureFraction: +(row.curvature / (row.exact - row.leading)).toFixed(4),
}));

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35824_ASSERTIONS = [
  {
    id: 'imp35824-three-rows-ascending-N',
    description: 'the waterfall has exactly 3 rows (band-bottom, N_cross, band-top), strictly ascending in N',
    holds: () =>
      IMP35824_WATERFALL_GRID.length === 3 &&
      IMP35824_WATERFALL_GRID.every((r, i) => i === 0 || r.N > IMP35824_WATERFALL_GRID[i - 1].N),
  },
  {
    id: 'imp35824-split-closes-at-every-anchor',
    description: 'leading + shift + curvature reproduces the exact surplus at every band anchor (within 1e-3)',
    holds: () =>
      IMP35824_WATERFALL_GRID.every(
        (r) => Math.abs(r.leading + r.shift + r.curvature - r.exact) < 1e-3,
      ),
  },
  {
    id: 'imp35824-curvature-dominates-shift-everywhere',
    description: 'the curvature term is at least 40x the shift term at every band anchor (curvature is the driver, not the shift)',
    holds: () => IMP35824_WATERFALL_GRID.every((r) => r.curvature > 40 * r.shift),
  },
  {
    id: 'imp35824-surplus-decreases-toward-band-top',
    description: 'leading and exact surplus both decrease monotonically from band-bottom to band-top (a(N) shrinks as N rises)',
    holds: () =>
      IMP35824_WATERFALL_GRID.every(
        (r, i) => i === 0 || (r.leading < IMP35824_WATERFALL_GRID[i - 1].leading && r.exact < IMP35824_WATERFALL_GRID[i - 1].exact),
      ),
  },
];

for (const a of IMP35824_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35824-krawczyk-surplus-waterfall-viz-data assertion failed: ${a.id}`);
  }
}
