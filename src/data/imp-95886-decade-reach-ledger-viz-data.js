/**
 * @module imp-95886-decade-reach-ledger-viz-data
 * @fileoverview imp-95886 -- lightweight viz-data module reshaping the imp-95863
 *   intermediate-ordinate-table decade ledger into chart-ready points: decades
 *   bought and decades still remaining to the imp-95519 window bottom T = 3.0e12,
 *   plotted against log10 of the candidate table size N, with the in-repo
 *   N = 1e6 ceiling and the N_smooth(3e12) ~ 1.2362e13 window-bottom landmark
 *   both marked.
 *
 *   Self-computing from the already-baked imp-95863 ledger rows -- no
 *   re-derivation, no fresh RvM inversion, no heavy imports. Viz data only;
 *   changes no bound; NO QED.
 *
 *   @see imp-95863-intermediate-ordinate-table-reach-ledger.js (the ledger this reshapes)
 */

import { IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER } from './imp-95863-intermediate-ordinate-table-reach-ledger.js';

const { ledger, baselineGapDecades, consecutiveOrdinatesToWindowBottom, inRepoCeiling } =
  IMP95863_INTERMEDIATE_ORDINATE_TABLE_REACH_LEDGER;

// Chart-ready curve points: one per ledger row, ascending log10 N.
export const IMP95886_CURVE_POINTS = Object.freeze(
  ledger.map((r) =>
    Object.freeze({
      N: r.N,
      log10N: +Math.log10(r.N).toFixed(4),
      gammaN: r.gammaN,
      decadesToWindow: r.decadesToWindow,
      decadesBought: r.decadesBought,
      inRepo: r.inRepo,
    }),
  ),
);

// Two named landmarks on the same log10 N axis as the curve.
export const IMP95886_LANDMARKS = Object.freeze([
  Object.freeze({
    name: 'in_repo_ceiling',
    label: 'imp-95801 in-repo ceiling',
    N: inRepoCeiling.N,
    log10N: +Math.log10(inRepoCeiling.N).toFixed(4),
    decadesBought: 0,
  }),
  Object.freeze({
    name: 'window_bottom',
    label: 'N_smooth(3e12) window bottom',
    N: consecutiveOrdinatesToWindowBottom,
    log10N: +Math.log10(consecutiveOrdinatesToWindowBottom).toFixed(4),
    decadesBought: baselineGapDecades,
  }),
]);

export const IMP95886_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW of the already-baked imp-95863 decade ledger, not a ' +
  'new measurement. The N = 1e6 row is the exact ZEROS_EXTENDED anchor; every higher row is an ' +
  'RvM-asymptotic ESTIMATE (Newton inversion of N_smooth(T) = N), not a verified ordinate. Per the ' +
  'imp-95801 catalog, NO table above N = 1e6 exists in-repo, so decades bought in-repo is exactly ' +
  '0.0. Introduces no new cited input and changes no bound; no refereed bound is changed' +
  '. NO QED.';

export const IMP95886_DECADE_REACH_LEDGER_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95886-curve-has-eight-points',
    description: 'the reshaped curve carries all eight imp-95863 ledger rows',
    holds: () => IMP95886_CURVE_POINTS.length === 8,
  },
  {
    id: 'imp95886-curve-strictly-ascending-log10N',
    description: 'the curve points are strictly ascending in log10N',
    holds: () =>
      IMP95886_CURVE_POINTS.every(
        (p, i) => i === 0 || p.log10N > IMP95886_CURVE_POINTS[i - 1].log10N,
      ),
  },
  {
    id: 'imp95886-curve-decades-bought-monotone-increasing',
    description: 'decadesBought is strictly increasing across the reshaped curve (reproduces imp-95863 ledger)',
    holds: () =>
      IMP95886_CURVE_POINTS.every(
        (p, i) => i === 0 || p.decadesBought > IMP95886_CURVE_POINTS[i - 1].decadesBought,
      ),
  },
  {
    id: 'imp95886-only-first-row-in-repo',
    description: 'exactly one curve point (N = 1e6) is flagged inRepo',
    holds: () => IMP95886_CURVE_POINTS.filter((p) => p.inRepo).length === 1 && IMP95886_CURVE_POINTS[0].inRepo,
  },
  {
    id: 'imp95886-landmarks-ascending-and-bracket-curve',
    description: 'the two landmarks are ascending in log10N and match the curve endpoints',
    holds: () =>
      IMP95886_LANDMARKS[0].log10N < IMP95886_LANDMARKS[1].log10N &&
      IMP95886_LANDMARKS[0].N === IMP95886_CURVE_POINTS[0].N &&
      IMP95886_LANDMARKS[0].decadesBought === IMP95886_CURVE_POINTS[0].decadesBought,
  },
  {
    id: 'imp95886-window-bottom-landmark-matches-baseline-gap',
    description: 'the window-bottom landmark decadesBought equals the baseline gap decades',
    holds: () => Math.abs(IMP95886_LANDMARKS[1].decadesBought - baselineGapDecades) < 1e-9,
  },
  {
    id: 'imp95886-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags NO QED',
    holds: () => /HONEST STATUS/.test(IMP95886_CAVEAT_BANNER) && /NO QED/.test(IMP95886_CAVEAT_BANNER),
  },
];

for (const a of IMP95886_DECADE_REACH_LEDGER_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95886-decade-reach-ledger-viz-data assertion failed: ${a.id}`);
  }
}
