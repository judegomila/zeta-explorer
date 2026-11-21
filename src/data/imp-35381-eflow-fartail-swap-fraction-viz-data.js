/**
 * @module imp-35381-eflow-fartail-swap-fraction-viz-data
 * @fileoverview imp-35381 -- VIZ DATA ONLY for the imp-35279 E_flow far-tail inverse-swap
 *   FRACTION across the full four-rung ladder N = 1e6, 1e9, 1e12, 1e16.
 *
 *   imp-35279 isolated the inverse-swap gap (height-map-only difference in the imp-35135
 *   finite-difference E_flow far-tail exponent) at all four rungs and found the swap
 *   FRACTION of the analytic residual interpolates MONOTONICALLY but DECREASES down the
 *   ladder (0.786 -> 0.648 -> 0.600 -> 0.568), i.e. the inverse swap is the dominant but
 *   never the sole residual component. imp-35400 already visualizes this fraction as one
 *   panel of a larger two-component decomposition page; this module gives the swap
 *   fraction its own dedicated, single-metric viz-data source per the imp-35381 ticket.
 *
 *   Values below are baked reference literals, reproduced verbatim from the imp-35279
 *   RUNGS table. This module does NOT import lambda-rh-height-mapping.js -- no fresh
 *   computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35279-eflow-fartail-inverse-swap-ladder.js (source of the swapFraction literals)
 *   @see imp-35400-eflow-fartail-two-component-ladder-viz-data.js (sibling two-component viz)
 *
 *   Ticket: imp-35381 (ux, low). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

// -- four-rung swap-fraction ladder (baked verbatim from imp-35279 RUNGS) --
export const IMP35381_SWAP_FRACTION_LADDER = Object.freeze([
  Object.freeze({ N: 1e6, swapFraction: 0.786, inverseSwapGap: 0.0093, analyticResidual: 0.0119 }),
  Object.freeze({ N: 1e9, swapFraction: 0.648, inverseSwapGap: 0.0058, analyticResidual: 0.0089 }),
  Object.freeze({ N: 1e12, swapFraction: 0.6, inverseSwapGap: 0.0038, analyticResidual: 0.0064 }),
  Object.freeze({ N: 1e16, swapFraction: 0.568, inverseSwapGap: 0.0025, analyticResidual: 0.0043 }),
]);

export const IMP35381_SUMMARY = Object.freeze({
  fractionAtTop: IMP35381_SWAP_FRACTION_LADDER[0].swapFraction,
  fractionAtDeep: IMP35381_SWAP_FRACTION_LADDER[3].swapFraction,
  fractionDrop:
    IMP35381_SWAP_FRACTION_LADDER[0].swapFraction - IMP35381_SWAP_FRACTION_LADDER[3].swapFraction,
});

export default Object.freeze({
  id: 'imp-35381-eflow-fartail-swap-fraction-viz-data',
  ticket: 'imp-35381',
  sources: ['imp-35279-eflow-fartail-inverse-swap-ladder.js'],
  ladder: IMP35381_SWAP_FRACTION_LADDER,
  summary: IMP35381_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35381_ASSERTIONS = [
  {
    id: 'imp35381-four-rungs-present-in-order',
    holds: () => {
      const ns = IMP35381_SWAP_FRACTION_LADDER.map((r) => r.N);
      return ns.length === 4 && ns[0] === 1e6 && ns[1] === 1e9 && ns[2] === 1e12 && ns[3] === 1e16;
    },
    why: 'The ladder must cover exactly the four imp-35279 rungs N=1e6,1e9,1e12,1e16 in ascending order.',
  },
  {
    id: 'imp35381-swap-fraction-monotone-decreasing',
    holds: () =>
      IMP35381_SWAP_FRACTION_LADDER[0].swapFraction > IMP35381_SWAP_FRACTION_LADDER[1].swapFraction &&
      IMP35381_SWAP_FRACTION_LADDER[1].swapFraction > IMP35381_SWAP_FRACTION_LADDER[2].swapFraction &&
      IMP35381_SWAP_FRACTION_LADDER[2].swapFraction > IMP35381_SWAP_FRACTION_LADDER[3].swapFraction,
    why: 'imp-35279 F4: the swap fraction must decrease monotonically down the ladder, never rising toward 1.',
  },
  {
    id: 'imp35381-swap-fraction-dominant-but-not-sole',
    holds: () => IMP35381_SWAP_FRACTION_LADDER.every((r) => r.swapFraction > 0.5 && r.swapFraction < 1),
    why: 'imp-35279 F4: the swap is the dominant but never the sole residual component at any rung.',
  },
  {
    id: 'imp35381-summary-matches-endpoints',
    holds: () =>
      Math.abs(IMP35381_SUMMARY.fractionDrop - (0.786 - 0.568)) < 1e-9 &&
      IMP35381_SUMMARY.fractionAtTop === 0.786 &&
      IMP35381_SUMMARY.fractionAtDeep === 0.568,
    why: 'Summary fields must be derived from the same baked endpoint literals as the ladder rows.',
  },
];

for (const assertion of IMP35381_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35381-eflow-fartail-swap-fraction-viz-data assertion failed: ${assertion.id}`);
  }
}
