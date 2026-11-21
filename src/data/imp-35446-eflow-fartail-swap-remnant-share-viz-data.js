/**
 * @module imp-35446-eflow-fartail-swap-remnant-share-viz-data
 * @fileoverview imp-35446 -- VIZ DATA ONLY for the imp-35279/imp-35280/imp-35370 E_flow
 *   far-tail residual two-component SHARE trend: the inverse-swap gap share and the
 *   closed-form/prefactor remnant share of the analytic residual, tracked from the
 *   imp-35400 four-rung ladder (N=1e6..1e16, swap share 0.786->0.568) on through the
 *   imp-35370 deeper-ladder continuation (N=1e18..1e45) to the exact 50/50 half-crossover
 *   the imp-35370 bisection located at log10 N = 44.7593 (N ~ 5.7452e44).
 *
 *   At N = 1e16 the shares sit at ~57/43 (swap 0.568, remnant 0.432) -- the ~57/43 split
 *   named in this ticket. The shares then converge monotonically and meet exactly at
 *   50/50 at the crossover: swap share and remnant share are each pinned to precisely
 *   0.5 there (imp-35370 F3), the deep rung where the remnant becomes the majority owner
 *   of the residual for all N beyond it.
 *
 *   Values below are baked reference literals, reproduced verbatim from the imp-35400
 *   IMP35400_LADDER (four rungs) and the imp-35370 deeperLadder + crossover fields (both
 *   modules agree to the digit with their sources). This module does NOT import
 *   lambda-rh-height-mapping.js or re-run any finite difference -- no fresh computation,
 *   per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35279-eflow-fartail-inverse-swap-ladder.js (swap-gap side, four-rung ladder)
 *   @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap.js (remnant side, four-rung ladder)
 *   @see imp-35370-eflow-fartail-swap-fraction-half-crossover.js (deeper ladder + 50/50 crossover)
 *   @see imp-35400-eflow-fartail-two-component-ladder-viz-data.js (the four-rung viz-data source)
 *
 *   Ticket: imp-35446 (ux, low). Presentation only of already-established measurements;
 *   adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

// -- shallow ladder (imp-35400/imp-35279/imp-35280): swap share vs remnant share --
export const IMP35446_SHALLOW_LADDER = Object.freeze([
  Object.freeze({ log10N: 6, N: 1e6, swapShare: 0.786, remnantShare: 0.214 }),
  Object.freeze({ log10N: 9, N: 1e9, swapShare: 0.648, remnantShare: 0.352 }),
  Object.freeze({ log10N: 12, N: 1e12, swapShare: 0.6, remnantShare: 0.4 }),
  Object.freeze({ log10N: 16, N: 1e16, swapShare: 0.568, remnantShare: 0.432 }),
]);

// -- deeper ladder (imp-35370): shares continuing to converge past N = 1e16 --
export const IMP35446_DEEP_LADDER = Object.freeze([
  Object.freeze({ log10N: 18, N: 1e18, swapShare: 0.557239, remnantShare: 0.442761 }),
  Object.freeze({ log10N: 20, N: 1e20, swapShare: 0.548545, remnantShare: 0.451455 }),
  Object.freeze({ log10N: 24, N: 1e24, swapShare: 0.535137, remnantShare: 0.464863 }),
  Object.freeze({ log10N: 30, N: 1e30, swapShare: 0.520955, remnantShare: 0.479045 }),
  Object.freeze({ log10N: 40, N: 1e40, swapShare: 0.505407, remnantShare: 0.494593 }),
  Object.freeze({ log10N: 44, N: 1e44, swapShare: 0.500802, remnantShare: 0.499198 }),
  Object.freeze({ log10N: 45, N: 1e45, swapShare: 0.49975, remnantShare: 0.50025 }),
]);

// -- the exact 50/50 half-crossover the imp-35370 bisection located --
export const IMP35446_CROSSOVER = Object.freeze({
  log10N: 44.759302,
  lnN: 103.062102,
  N: 5.7452e44,
  swapShare: 0.5,
  remnantShare: 0.5,
});

export const IMP35446_SUMMARY = Object.freeze({
  swapShareAt1e16: 0.568,
  remnantShareAt1e16: 0.432,
  swapShareAtCrossover: IMP35446_CROSSOVER.swapShare,
  remnantShareAtCrossover: IMP35446_CROSSOVER.remnantShare,
  decadesFrom1e16ToCrossover: IMP35446_CROSSOVER.log10N - 16,
});

export default Object.freeze({
  id: 'imp-35446-eflow-fartail-swap-remnant-share-viz-data',
  ticket: 'imp-35446',
  sources: [
    'imp-35279-eflow-fartail-inverse-swap-ladder.js',
    'imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap.js',
    'imp-35370-eflow-fartail-swap-fraction-half-crossover.js',
    'imp-35400-eflow-fartail-two-component-ladder-viz-data.js',
  ],
  shallowLadder: IMP35446_SHALLOW_LADDER,
  deepLadder: IMP35446_DEEP_LADDER,
  crossover: IMP35446_CROSSOVER,
  summary: IMP35446_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35446_ASSERTIONS = [
  {
    id: 'imp35446-shallow-ladder-shares-sum-to-one',
    holds: () =>
      IMP35446_SHALLOW_LADDER.every((r) => Math.abs(r.swapShare + r.remnantShare - 1) < 1e-9),
    why: 'The two components must exactly partition the residual (swapShare + remnantShare = 1) at every shallow rung.',
  },
  {
    id: 'imp35446-deep-ladder-shares-sum-to-one',
    holds: () =>
      IMP35446_DEEP_LADDER.every((r) => Math.abs(r.swapShare + r.remnantShare - 1) < 1e-6),
    why: 'The two components must exactly partition the residual (swapShare + remnantShare = 1) at every deep rung.',
  },
  {
    id: 'imp35446-swap-share-monotone-decreasing-across-both-ladders',
    holds: () => {
      const all = [...IMP35446_SHALLOW_LADDER, ...IMP35446_DEEP_LADDER];
      return all.every((r, i) => i === 0 || all[i - 1].swapShare > r.swapShare);
    },
    why: 'imp-35279/imp-35370: the swap share must decrease monotonically from N=1e6 through N=1e45.',
  },
  {
    id: 'imp35446-1e16-share-is-approximately-57-43',
    holds: () =>
      Math.abs(IMP35446_SUMMARY.swapShareAt1e16 - 0.57) < 0.01 &&
      Math.abs(IMP35446_SUMMARY.remnantShareAt1e16 - 0.43) < 0.01,
    why: 'The ticket-named ~57/43 split at N=1e16 must match the imp-35400 literal (0.568/0.432).',
  },
  {
    id: 'imp35446-crossover-is-exactly-50-50',
    holds: () =>
      IMP35446_CROSSOVER.swapShare === 0.5 &&
      IMP35446_CROSSOVER.remnantShare === 0.5 &&
      Math.abs(IMP35446_CROSSOVER.log10N - 44.7593) < 1e-3,
    why: 'imp-35370 F3: at the located crossover the two shares are each pinned to exactly one-half, at log10 N = 44.7593.',
  },
  {
    id: 'imp35446-deep-ladder-brackets-crossover',
    holds: () => {
      const at44 = IMP35446_DEEP_LADDER.find((r) => r.log10N === 44);
      const at45 = IMP35446_DEEP_LADDER.find((r) => r.log10N === 45);
      return at44.swapShare > 0.5 && at45.swapShare < 0.5;
    },
    why: 'The N=1e44/1e45 deep-ladder rungs must bracket the swapShare=0.5 crossover, consistent with the bisection.',
  },
];

for (const assertion of IMP35446_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35446-eflow-fartail-swap-remnant-share-viz-data assertion failed: ${assertion.id}`);
  }
}
