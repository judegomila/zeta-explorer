/**
 * @module imp-97765-fartail-crossing-heights-viz-data
 *
 * imp-97765: import-light viz-data leaf charting the imp-97744 pinned far-tail diagnostic
 * crossing heights (0.99/0.995/0.999) -- the exact N at which
 * (1/2 - p) * 2 log T0 = 1 - 1/log(T0/2pi) reaches each target, via L = 1/(1 - t) and the
 * Riemann-von Mangoldt relation N = (L - 1) e^L. Reuses
 * IMP97744_FARTAIL_DIAGNOSTIC_CROSSING_HEIGHTS verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; RH open; NO QED.
 *
 * @see imp-97744-fartail-diagnostic-crossing-heights.js (CROSSINGS, closed-form inversion)
 */

import { IMP97744_FARTAIL_DIAGNOSTIC_CROSSING_HEIGHTS } from './imp-97744-fartail-diagnostic-crossing-heights.js';

const { crossings, verdict } = IMP97744_FARTAIL_DIAGNOSTIC_CROSSING_HEIGHTS;

// Only the three targets named in the ticket (0.99/0.995/0.999); the 0.9999 rung is left
// out of this leaf's ladder (it has no imp-97723 bisection counterpart to sanity-check against).
export const IMP97765_CROSSING_ROWS = Object.freeze(
  crossings
    .filter((r) => r.target !== 0.9999)
    .map((r) =>
      Object.freeze({
        key: `t${r.target}`,
        target: r.target,
        L: r.L,
        log10_T0: r.log10_T0,
        log10_N: r.log10_N,
        N_mantissa: r.N_mantissa,
        N_exp10: r.N_exp10,
      })
    )
);

export const IMP97765_SUMMARY = Object.freeze({
  reading:
    'The imp-97744 closed-form inversion pins the far-tail diagnostic crossing heights: the ' +
    '0.99 target lands at N ~ 2.66124e45, the 0.995 target at N ~ 1.43797e89, and the 0.999 ' +
    'target at N ~ 1.96810e437 -- each an order-of-magnitude sharper read than the imp-97723 ' +
    '"near 1e45 / near 1e89" bisection. Crossing height grows like e^(1/(1-t)), so each extra ' +
    'nine costs hundreds of orders of magnitude in N.',
  verdict,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97765_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97765-three-rows',
    description: 'exactly three crossing rows (0.99/0.995/0.999)',
    holds: () => IMP97765_CROSSING_ROWS.length === 3,
  },
  {
    id: 'imp97765-monotone-log10N',
    description: 'log10 N strictly increases across the three targets',
    holds: () =>
      IMP97765_CROSSING_ROWS[0].log10_N < IMP97765_CROSSING_ROWS[1].log10_N &&
      IMP97765_CROSSING_ROWS[1].log10_N < IMP97765_CROSSING_ROWS[2].log10_N,
  },
  {
    id: 'imp97765-values-match-imp97744-source',
    description: 'L/log10_N values match the imp-97744 pinned crossings verbatim',
    holds: () =>
      IMP97765_CROSSING_ROWS.every((row) => {
        const src = crossings.find((c) => c.target === row.target);
        return src && row.L === src.L && row.log10_N === src.log10_N;
      }),
  },
  {
    id: 'imp97765-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no RH verdict/.test(IMP97765_SUMMARY.verdict) && /NO QED/.test(IMP97765_SUMMARY.verdict),
  },
];

for (const assertion of IMP97765_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97765 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97765_SUMMARY;
