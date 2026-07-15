/**
 * @module imp-35750-beat-parity-handoff-sigma-viz-data
 *
 * imp-35750 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-35678 beat -> parity HANDOFF along the sigma-axis. The imp-35678 regime
 * boundary is the vanishing of the GUE-conditional beat carrier (E_coll), whose
 * far-tail share equals sigma exactly (imp-486); the surviving C_T-barrier term
 * (E_trunc) has share 1 - sigma - E_flow_share (imp-35677 three-class partition;
 * E_flow_share held at the baked ~5.655e-9 sigma<1e-3 literal, imp-398). Plotting
 * both shares against the imp-35677 four-rung sigma ladder shows the beat-carrier
 * curve FALLING toward zero and the C_T-barrier curve RISING toward one as the
 * tail deepens.
 *
 * The two curves mathematically cross near sigma = 0.5 (where beatCarrierShare ==
 * ctBarrierShare), well ABOVE the entire measured far-tail ladder (sigma <= 1e-3):
 * by the time the ladder starts, the handoff has already completed and the
 * ctBarrierShare is already the dominant (>99.9%) share. The ladder therefore
 * illustrates the CONTINUATION of the handoff deep into asymptotic parity, not
 * the crossing point itself.
 *
 * Reference literals are baked from the imp-35677/imp-35678 sigma model
 * (beatCarrierShare = sigma, ctBarrierShare = 1 - sigma - E_flow_share) -- no
 * re-derivation, no heavy import.
 *
 * @see imp-35678-finite-height-beat-vs-parity-regime-boundary.js (source: the regime-boundary assessment)
 * @see imp-35677-postport-residual-share-sigma-ladder.js (source: the four-rung sigma ladder + E_flow_share this reuses)
 * @see imp-486 (C_mb GUE-conditional; E_coll far-tail share = sigma)
 *
 * Ticket: imp-35750 (ux, medium). Presentation only, RH-free; C_mb GUE-conditional
 * (imp-486) untouched; changes no bound; NO QED.
 */

const E_FLOW_SHARE = 5.655e-9; // imp-35677/imp-398 baked sigma<1e-3 literal; fully unconditional, held fixed

export const IMP35750_SIGMA_LADDER = [1.0e-3, 1.0e-4, 1.0e-5, 1.0e-6];

export const IMP35750_MATHEMATICAL_CROSSOVER_SIGMA = 0.5; // where beatCarrierShare == ctBarrierShare (E_flow_share negligible there)

export const IMP35750_HANDOFF_GRID = IMP35750_SIGMA_LADDER.map((sigma) => ({
  sigma,
  beatCarrierShare: sigma, // E_coll/E -- imp-486; falls toward zero
  ctBarrierShare: 1 - sigma - E_FLOW_SHARE, // E_trunc/E -- imp-35677/imp-34791; rises toward one
}));

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35750_ASSERTIONS = [
  {
    id: 'imp35750-beat-carrier-falls-monotonically',
    description: 'Beat-carrier share (=sigma) strictly decreases down the ladder',
    holds: () =>
      IMP35750_HANDOFF_GRID.every(
        (r, i) => i === 0 || r.beatCarrierShare < IMP35750_HANDOFF_GRID[i - 1].beatCarrierShare,
      ),
  },
  {
    id: 'imp35750-ct-barrier-rises-monotonically',
    description: 'C_T-barrier share (=1-sigma-E_flow_share) strictly increases down the ladder',
    holds: () =>
      IMP35750_HANDOFF_GRID.every(
        (r, i) => i === 0 || r.ctBarrierShare > IMP35750_HANDOFF_GRID[i - 1].ctBarrierShare,
      ),
  },
  {
    id: 'imp35750-shares-sum-to-one',
    description: 'beatCarrierShare + ctBarrierShare + E_flow_share sums to 1 at every rung',
    holds: () =>
      IMP35750_HANDOFF_GRID.every(
        (r) => Math.abs(r.beatCarrierShare + r.ctBarrierShare + E_FLOW_SHARE - 1) < 1e-12,
      ),
  },
  {
    id: 'imp35750-crossover-above-ladder-range',
    description: 'The mathematical crossover sigma=0.5 lies strictly above every ladder rung',
    holds: () =>
      IMP35750_HANDOFF_GRID.every((r) => r.sigma < IMP35750_MATHEMATICAL_CROSSOVER_SIGMA) &&
      IMP35750_MATHEMATICAL_CROSSOVER_SIGMA === 0.5,
  },
];

for (const a of IMP35750_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35750-beat-parity-handoff-sigma-viz-data assertion failed: ${a.id}`);
  }
}
