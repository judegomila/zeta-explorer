/**
 * @module imp-35400-eflow-fartail-two-component-ladder-viz-data
 * @fileoverview imp-35400 -- VIZ DATA ONLY for the imp-35279/imp-35280 E_flow far-tail
 *   two-component decomposition (inverse-swap gap + fd-vs-analytic remnant) across the
 *   FULL four-rung ladder N = 1e6, 1e9, 1e12, 1e16.
 *
 *   imp-35295 already visualized the imp-35236 decomposition, but only at its two endpoint
 *   anchors (N = 1e6, 1e16). imp-35279 and imp-35280 independently extended the same
 *   decomposition to the two intermediate rungs (N = 1e9, 1e12), confirming the identity
 *   swap gap + fd-vs-analytic remnant = analytic residual holds at EVERY rung, and that the
 *   remnant is a NON-VANISHING ~0.002 floor whose SHARE of the (shrinking) residual GROWS
 *   deep down the ladder (~21% at N = 1e6 to ~43% at N = 1e16), not a transient artifact.
 *   This module fills that four-rung gap in the visualization coverage.
 *
 *   Values below are baked reference literals, reproduced verbatim from the imp-35279
 *   RUNGS table and the imp-35280 LADDER table (both modules agree to the digit on every
 *   shared field). This module does NOT import lambda-rh-height-mapping.js -- no fresh
 *   computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35279-eflow-fartail-inverse-swap-ladder.js (swap-gap side, four-rung ladder)
 *   @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap.js (remnant side, four-rung ladder)
 *   @see imp-35236-eflow-fartail-inverse-swap-isolation.js (original two-endpoint decomposition)
 *   @see imp-35217-eflow-fartail-exponent-x2-correction.js (the leading residual being decomposed)
 *
 *   Ticket: imp-35400 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

// -- four-rung two-component decomposition: swap gap vs fd-vs-analytic remnant --
export const IMP35400_LADDER = Object.freeze([
  Object.freeze({ N: 1e6, swapGap: 0.0093, remnant: 0.0025, residual: 0.0119, swapFraction: 0.786 }),
  Object.freeze({ N: 1e9, swapGap: 0.0058, remnant: 0.0031, residual: 0.0089, swapFraction: 0.648 }),
  Object.freeze({ N: 1e12, swapGap: 0.0038, remnant: 0.0026, residual: 0.0064, swapFraction: 0.6 }),
  Object.freeze({ N: 1e16, swapGap: 0.0025, remnant: 0.0019, residual: 0.0043, swapFraction: 0.568 }),
]);

export const IMP35400_SUMMARY = Object.freeze({
  swapGapTopToDeepRatio: 0.0093 / 0.0025,
  remnantShareAtTop: 1 - 0.786,
  remnantShareAtDeep: 1 - 0.568,
});

export default Object.freeze({
  id: 'imp-35400-eflow-fartail-two-component-ladder-viz-data',
  ticket: 'imp-35400',
  sources: [
    'imp-35279-eflow-fartail-inverse-swap-ladder.js',
    'imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap.js',
  ],
  ladder: IMP35400_LADDER,
  summary: IMP35400_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35400_ASSERTIONS = [
  {
    id: 'imp35400-four-rungs-present-in-order',
    holds: () => {
      const ns = IMP35400_LADDER.map((r) => r.N);
      return ns.length === 4 && ns[0] === 1e6 && ns[1] === 1e9 && ns[2] === 1e12 && ns[3] === 1e16;
    },
    why: 'The ladder must cover exactly the four imp-35279/imp-35280 rungs N=1e6,1e9,1e12,1e16 in ascending order.',
  },
  {
    id: 'imp35400-components-reconstruct-residual-every-rung',
    holds: () =>
      IMP35400_LADDER.every((r) => Math.abs(r.swapGap + r.remnant - r.residual) < 5e-4),
    why: 'imp-35279/imp-35280 F3: swap gap + fd-vs-analytic remnant must reconstruct the analytic residual to <5e-4 at every rung.',
  },
  {
    id: 'imp35400-swap-gap-monotone-decreasing',
    holds: () =>
      IMP35400_LADDER[0].swapGap > IMP35400_LADDER[1].swapGap &&
      IMP35400_LADDER[1].swapGap > IMP35400_LADDER[2].swapGap &&
      IMP35400_LADDER[2].swapGap > IMP35400_LADDER[3].swapGap,
    why: 'imp-35279 F2: the isolated inverse-swap gap must shrink monotonically down the ladder.',
  },
  {
    id: 'imp35400-remnant-share-grows-deep',
    holds: () => IMP35400_SUMMARY.remnantShareAtDeep > IMP35400_SUMMARY.remnantShareAtTop,
    why: 'imp-35280 honestStatus: the fd-vs-analytic remnant is a roughly-flat floor whose FRACTION of the shrinking residual must grow deep down the ladder, not shrink.',
  },
  {
    id: 'imp35400-swap-dominant-but-not-sole-every-rung',
    holds: () => IMP35400_LADDER.every((r) => r.swapFraction > 0.5 && r.swapFraction < 1),
    why: 'imp-35279 F4: the swap gap is the dominant but never the sole component of the residual at any of the four rungs.',
  },
];

for (const assertion of IMP35400_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35400-eflow-fartail-two-component-ladder-viz-data assertion failed: ${assertion.id}`);
  }
}
