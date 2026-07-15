/**
 * @module imp-35751-postport-shares-sigma-viz-data
 *
 * imp-35751 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-35677 four-rung sigma-ladder post-port provenance shares: the residual
 * GUE-conditional share (= sigma, imp-486) vanishing a factor 10 per rung, and
 * the post-port unconditional share (= 1 - sigma) rising 0.999 -> 0.999999
 * toward 1 across sigma = {1e-3, 1e-4, 1e-5, 1e-6}.
 *
 * Reference literals are baked directly from the imp-35677 sigma model
 * (residualGueShare = sigma, unconditionalShare = 1 - sigma) -- no
 * re-derivation, no heavy import.
 *
 * @see imp-35677-postport-residual-share-sigma-ladder.js (source: the four-rung sigma ladder this plots)
 * @see imp-35750-beat-parity-handoff-sigma-viz-data.js (sibling viz-data module for the pre-port beat/barrier shares)
 * @see imp-486 (C_mb GUE-conditional; residual share = sigma)
 *
 * Ticket: imp-35751 (ux, medium). Presentation only, RH-free; C_mb GUE-conditional
 * (imp-486) untouched; changes no bound; NO QED.
 */

export const IMP35751_SIGMA_LADDER = [1.0e-3, 1.0e-4, 1.0e-5, 1.0e-6];

export const IMP35751_POSTPORT_SHARES_GRID = IMP35751_SIGMA_LADDER.map((sigma) => ({
  sigma,
  residualGueShare: sigma, // E_coll/E post-port -- imp-486/imp-35677; vanishes x10/rung
  unconditionalShare: 1 - sigma, // (E_trunc + E_flow)/E post-port -- imp-35677; rises toward 1
}));

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35751_ASSERTIONS = [
  {
    id: 'imp35751-residual-share-vanishes-x10-per-rung',
    description: 'Residual GUE share (=sigma) shrinks by exactly a factor 10 per rung',
    holds: () =>
      IMP35751_POSTPORT_SHARES_GRID.every(
        (r, i) =>
          i === 0 ||
          Math.abs(
            IMP35751_POSTPORT_SHARES_GRID[i - 1].residualGueShare / r.residualGueShare - 10,
          ) < 1e-9,
      ),
  },
  {
    id: 'imp35751-unconditional-share-rises-toward-one',
    description: 'Unconditional share (=1-sigma) strictly increases toward 1 down the ladder',
    holds: () =>
      IMP35751_POSTPORT_SHARES_GRID.every(
        (r, i) => i === 0 || r.unconditionalShare > IMP35751_POSTPORT_SHARES_GRID[i - 1].unconditionalShare,
      ) && IMP35751_POSTPORT_SHARES_GRID[IMP35751_POSTPORT_SHARES_GRID.length - 1].unconditionalShare > 0.999998,
  },
  {
    id: 'imp35751-shares-sum-to-one',
    description: 'residualGueShare + unconditionalShare sums to 1 at every rung',
    holds: () =>
      IMP35751_POSTPORT_SHARES_GRID.every(
        (r) => Math.abs(r.residualGueShare + r.unconditionalShare - 1) < 1e-12,
      ),
  },
];

for (const a of IMP35751_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35751-postport-shares-sigma-viz-data assertion failed: ${a.id}`);
  }
}
