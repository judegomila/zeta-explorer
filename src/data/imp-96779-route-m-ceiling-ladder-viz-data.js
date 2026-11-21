/**
 * @module imp-96779-route-m-ceiling-ladder-viz-data
 *
 * imp-96779 (ux): import-light viz-data leaf for the imp-96682 Route M
 * conditioning-ceiling ladder (compute < trace-rigorous < Frobenius-rigorous
 * < measured/fit), reshaping IMP96682_LADDER + IMP96682_RATIOS +
 * IMP96682_VERDICT (all imported directly, no transcription) into
 * chart-ready log10(N) bars with the three adjacency ratios
 * (traceOverCompute, frobeniusOverTrace, measuredOverFrobenius) labelled
 * between rungs.
 *
 * imp-96682 assembled the reconciled ladder but shipped no visualization:
 * this module is presentation only.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96682-route-m-conditioning-ceiling-ladder-status.js (source ladder + ratios + verdict)
 * @see imp-96683-route-m-conditioning-ceiling-ci-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96779 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96682_LADDER,
  IMP96682_RATIOS,
  IMP96682_VERDICT,
  IMP96682_HONEST_BANNER,
} from './imp-96682-route-m-conditioning-ceiling-ladder-status.js';

const COLOR_BY_RUNG = Object.freeze({
  compute: '#94a3b8',
  traceLowerRigorous: '#f87171',
  frobeniusLowerRigorousSharper: '#fb923c',
  measuredComposed: '#4ade80',
});

// Chart-ready bars, one per ladder rung, on a shared log10(N) axis.
export const IMP96779_BARS = Object.freeze(
  IMP96682_LADDER.map((rung) =>
    Object.freeze({
      key: rung.rung,
      label: rung.source,
      rigor: rung.rigor,
      N: rung.N,
      log10N: Math.log10(rung.N),
      color: COLOR_BY_RUNG[rung.rung],
    }),
  ),
);

// The three adjacency ratios, labelled against the pair of rungs they connect.
export const IMP96779_RATIO_LABELS = Object.freeze([
  Object.freeze({
    key: 'traceOverCompute',
    fromIdx: 0,
    toIdx: 1,
    ratio: IMP96682_RATIOS.traceOverCompute,
    label: 'trace / compute',
  }),
  Object.freeze({
    key: 'frobeniusOverTrace',
    fromIdx: 1,
    toIdx: 2,
    ratio: IMP96682_RATIOS.frobeniusOverTrace,
    label: 'Frobenius / trace',
  }),
  Object.freeze({
    key: 'measuredOverFrobenius',
    fromIdx: 2,
    toIdx: 3,
    ratio: IMP96682_RATIOS.measuredOverFrobenius,
    label: 'measured / Frobenius',
  }),
]);

export const IMP96779_VERDICT_SUMMARY = Object.freeze({
  strictlyOrdered: IMP96682_VERDICT.strictlyOrdered,
  computeBindsFirstFactor: IMP96682_VERDICT.computeBindsFirstFactor,
  conclusion: IMP96682_VERDICT.conclusion,
});

export const IMP96779_HONEST_BANNER = IMP96682_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96779_ASSERTIONS = [
  {
    id: 'imp96779-four-bars-strictly-increasing-log10n',
    holds: () =>
      IMP96779_BARS.length === 4 &&
      IMP96779_BARS.every((b, i) => i === 0 || b.log10N > IMP96779_BARS[i - 1].log10N),
    why: 'the four ladder rungs must be present and strictly increasing in log10(N), matching the imp-96682 strict ordering.',
  },
  {
    id: 'imp96779-three-ratio-labels-match-source-ratios',
    holds: () =>
      IMP96779_RATIO_LABELS.length === 3 &&
      IMP96779_RATIO_LABELS[0].ratio === IMP96682_RATIOS.traceOverCompute &&
      IMP96779_RATIO_LABELS[1].ratio === IMP96682_RATIOS.frobeniusOverTrace &&
      IMP96779_RATIO_LABELS[2].ratio === IMP96682_RATIOS.measuredOverFrobenius &&
      IMP96779_RATIO_LABELS.every((r) => r.ratio > 1),
    why: 'each labelled ratio must match its source value verbatim and exceed 1, consistent with a strictly increasing ladder.',
  },
  {
    id: 'imp96779-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96779_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96779_HONEST_BANNER) &&
      /NO QED/.test(IMP96779_HONEST_BANNER) &&
      IMP96779_VERDICT_SUMMARY.strictlyOrdered === true,
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers, matching the source verdict.',
  },
];

for (const a of IMP96779_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96779-route-m-ceiling-ladder-viz-data assertion failed: ${a.id}`);
  }
}
