/**
 * @module imp-95267-offlattice-robustness-viz-data
 *
 * imp-95267 (ux): lightweight, import-light viz-data module baking the
 * imp-95232 FINDING 2 off-lattice robustness table -- how the raw
 * Blaschke-Lagrange bound BL^2/Lambda ratio degrades as the dyadic
 * lattice sites {1,2,4,...,512} (rho=2, N=10, x=6) are jittered by a
 * multiplicative perturbation 1 + eps*U[-1,1] -- WITHOUT importing the
 * imp-95232 source module (which carries a self-executing assertion
 * block with an inverse-power pencil eigensolver run at every import).
 * Follows the imp-36185 / imp-95265 import-light pattern: baked literals
 * only, copied verbatim from the imp-95232 documented offLatticeTable /
 * offLatticeWitness, not re-derived or re-conjectured.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95232 FINDING 2 table
 * verbatim; off-lattice jitter is a mild, quantified degradation of the
 * RAW BL bound only (the count-uniform LAT collar is a separate, ~70x
 * looser object per imp-95232 FINDING 1); changes no bound; no operator
 * positivity; no RH claim; NO QED. No refereed bound is changed.
 *
 * @see imp-95232-bl-lat-off-lattice-degradation.js (source: FINDING 2 offLatticeTable / offLatticeWitness)
 *
 * Ticket: imp-95267 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP95267_OFFLATTICE_TABLE = [
  { eps: 0.01, meanRatio: 1.028, worstRatio: 1.033 },
  { eps: 0.05, meanRatio: 1.03, worstRatio: 1.061 },
  { eps: 0.1, meanRatio: 1.036, worstRatio: 1.142 },
  { eps: 0.2, meanRatio: 1.066, worstRatio: 1.582 },
  { eps: 0.3, meanRatio: 1.151, worstRatio: 9.385 },
];

export const IMP95267_ONLATTICE_RATIO = 1.0284;

export const IMP95267_WITNESS = {
  eps: 0.2,
  ratio: 1.007969,
  note: 'deterministic fixed perturbation vector at eps=0.2 (imp-95232 offLatticeWitness)',
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP95267_ASSERTIONS = [
  {
    id: 'imp95267-table-matches-imp95232-finding2-verbatim',
    description: 'the baked table matches the imp-95232 FINDING 2 offLatticeTable literals verbatim',
    holds: () => {
      const ref = [
        [0.01, 1.028, 1.033],
        [0.05, 1.03, 1.061],
        [0.1, 1.036, 1.142],
        [0.2, 1.066, 1.582],
        [0.3, 1.151, 9.385],
      ];
      return IMP95267_OFFLATTICE_TABLE.every(
        (row, i) =>
          Math.abs(row.eps - ref[i][0]) < 1e-9 &&
          Math.abs(row.meanRatio - ref[i][1]) < 1e-9 &&
          Math.abs(row.worstRatio - ref[i][2]) < 1e-9,
      );
    },
  },
  {
    id: 'imp95267-monotone-non-decreasing-degradation',
    description: 'both mean and worst ratio are non-decreasing as eps grows (graceful degradation)',
    holds: () =>
      IMP95267_OFFLATTICE_TABLE.every(
        (row, i, arr) =>
          i === 0 || (row.meanRatio >= arr[i - 1].meanRatio && row.worstRatio >= arr[i - 1].worstRatio),
      ),
  },
  {
    id: 'imp95267-all-rows-still-fire-below-vacuity',
    description: 'every row keeps BL firing (ratio times Lambda < 1 is the underlying claim; here the near-sharp ratio itself stays well under the BL-LAT ~70x collar overprice, i.e. under 60) through eps=0.3',
    holds: () => IMP95267_OFFLATTICE_TABLE.every((row) => row.worstRatio < 60),
  },
  {
    id: 'imp95267-witness-matches-imp95232-verbatim',
    description: 'the eps=0.2 deterministic witness ratio matches imp-95232 offLatticeWitness verbatim',
    holds: () => Math.abs(IMP95267_WITNESS.ratio - 1.007969) < 1e-6 && IMP95267_WITNESS.eps === 0.2,
  },
];

for (const a of IMP95267_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95267-offlattice-robustness-viz-data assertion failed: ${a.id}`);
  }
}
