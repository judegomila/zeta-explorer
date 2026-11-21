/**
 * @module imp-95268-collar-overprice-viz-data
 *
 * imp-95268 (ux): lightweight, import-light viz-data module baking the
 * imp-95232 FINDING 1 collar-overpricing table -- how far the
 * count-uniform BL-LAT collar c(rho)^4 e^(-2x)(1+tau_rho(x))^2 sits above
 * the exact Lambda (and the near-sharp raw Blaschke-Lagrange bound BL^2)
 * on the dyadic lattice (rho=2, N=10, rates 1,2,4,...,512) across depth
 * x -- WITHOUT importing the imp-95232 source module (which carries a
 * self-executing assertion block with an inverse-power pencil eigensolver
 * run at every import). Follows the imp-36185 / imp-95265 / imp-95267
 * import-light pattern: baked literals only, copied verbatim from the
 * imp-95232 documented onLatticeBaseline / collarOverpriceVsX, not
 * re-derived or re-conjectured.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95232 FINDING 1 table
 * verbatim; the collar over-pricing is a property of the count-uniform
 * BL-LAT certificate at finite N (its only merit is firing at unbounded
 * count); changes no bound; no operator positivity; no RH claim; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-95232-bl-lat-off-lattice-degradation.js (source: FINDING 1 onLatticeBaseline / collarOverpriceVsX)
 *
 * Ticket: imp-95268 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP95268_ONLATTICE_BASELINE = {
  rho: 2,
  N: 10,
  x: 6,
  lambdaExact: 4.100892e-4,
  blSquared: 4.217175e-4,
  blRatio: 1.0284,
  latCollar: 2.868751e-2,
  latOverLambda: 69.954,
  latOverBlSquared: 68.025,
};

export const IMP95268_COLLAR_OVERPRICE_VS_X = [
  { x: 4, latOverLambda: 78.65 },
  { x: 5, latOverLambda: 72.18 },
  { x: 6, latOverLambda: 69.95 },
  { x: 8, latOverLambda: 68.87 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP95268_ASSERTIONS = [
  {
    id: 'imp95268-baseline-matches-imp95232-finding1-verbatim',
    description: 'the baked baseline matches the imp-95232 FINDING 1 onLatticeBaseline literals verbatim',
    holds: () => {
      const b = IMP95268_ONLATTICE_BASELINE;
      return (
        b.rho === 2 &&
        b.N === 10 &&
        b.x === 6 &&
        Math.abs(b.lambdaExact - 4.100892e-4) < 1e-10 &&
        Math.abs(b.blSquared - 4.217175e-4) < 1e-10 &&
        Math.abs(b.blRatio - 1.0284) < 1e-6 &&
        Math.abs(b.latCollar - 2.868751e-2) < 1e-8 &&
        Math.abs(b.latOverLambda - 69.954) < 1e-3 &&
        Math.abs(b.latOverBlSquared - 68.025) < 1e-3
      );
    },
  },
  {
    id: 'imp95268-collar-overprice-table-matches-verbatim',
    description: 'the baked collarOverpriceVsX table matches the imp-95232 FINDING 1 literals verbatim',
    holds: () => {
      const ref = [
        [4, 78.65],
        [5, 72.18],
        [6, 69.95],
        [8, 68.87],
      ];
      return IMP95268_COLLAR_OVERPRICE_VS_X.every(
        (row, i) => row.x === ref[i][0] && Math.abs(row.latOverLambda - ref[i][1]) < 1e-6,
      );
    },
  },
  {
    id: 'imp95268-collar-always-loose-and-approaches-asymptote-from-above',
    description:
      'the collar over-pricing factor stays loose (>60x) at every measured x and approaches the ' +
      'c(2)^4/BL^2 asymptote from above as x grows',
    holds: () =>
      IMP95268_COLLAR_OVERPRICE_VS_X.every((row) => row.latOverLambda > 60) &&
      IMP95268_COLLAR_OVERPRICE_VS_X.every(
        (row, i, arr) => i === 0 || row.latOverLambda <= arr[i - 1].latOverLambda,
      ),
  },
  {
    id: 'imp95268-raw-bl-near-sharp-vs-collar-loose',
    description: 'the raw BL ratio is near-sharp (< 1.05) while the collar sits well above 60x at x=6',
    holds: () =>
      IMP95268_ONLATTICE_BASELINE.blRatio < 1.05 && IMP95268_ONLATTICE_BASELINE.latOverLambda > 60,
  },
];

for (const a of IMP95268_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95268-collar-overprice-viz-data assertion failed: ${a.id}`);
  }
}
