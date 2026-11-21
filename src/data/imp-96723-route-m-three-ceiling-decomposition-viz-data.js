/**
 * @module imp-96723-route-m-three-ceiling-decomposition-viz-data
 *
 * imp-96723 (ux): import-light viz-data leaf for the imp-96693 Route M
 * three-ceiling ladder (trace-domination rigorous T 2.594e7 < Frobenius fit
 * F 3.764e7 < measured M 4.109e7), reshaping IMP96693_CEILINGS +
 * IMP96693_RATIOS + IMP96693_DECOMPOSITION + IMP96693_VERDICT (all imported
 * directly, no re-computation) into chart-ready log10(N) bars carrying each
 * ceiling's fit-vs-rigorous label, with the 1.45x (F/T) and 1.09x (M/F)
 * adjacency ratios labelled between rungs.
 *
 * imp-96693 audited the pairwise-ratio decomposition of the three ceilings
 * but shipped no visualization: this module is presentation only.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (source ceilings + ratios + decomposition + verdict)
 * @see imp-96779-route-m-ceiling-ladder-viz-data.js (sibling viz-data leaf convention, four-rung ladder incl. compute)
 *
 * Ticket: imp-96723 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96693_CEILINGS,
  IMP96693_RATIOS,
  IMP96693_DECOMPOSITION,
  IMP96693_VERDICT,
  IMP96693_HONEST_BANNER,
} from './imp-96693-route-m-conditioning-ceiling-residual-decomposition.js';

const COLOR_BY_SYMBOL = Object.freeze({
  T: '#f87171',
  F: '#fb923c',
  M: '#4ade80',
});

// Chart-ready bars, one per ceiling, on a shared log10(N) axis, carrying the
// fit-vs-rigorous label.
export const IMP96723_BARS = Object.freeze(
  ['trace', 'frobenius', 'measured'].map((key) => {
    const c = IMP96693_CEILINGS[key];
    return Object.freeze({
      key,
      symbol: c.symbol,
      label: c.label,
      source: c.source,
      N: c.N,
      log10N: Math.log10(c.N),
      color: COLOR_BY_SYMBOL[c.symbol],
    });
  }),
);

// The two adjacency ratios of the decomposition (Finding 3): 1.45x rigorous
// -> fit leg, 1.09x fit -> measured leg.
export const IMP96723_RATIO_LABELS = Object.freeze([
  Object.freeze({
    key: 'frobeniusOverTrace',
    fromIdx: 0,
    toIdx: 1,
    ratio: IMP96693_RATIOS.frobeniusOverTrace,
    label: 'F / T (rigorous -> fit)',
  }),
  Object.freeze({
    key: 'measuredOverFrobenius',
    fromIdx: 1,
    toIdx: 2,
    ratio: IMP96693_RATIOS.measuredOverFrobenius,
    label: 'M / F (fit -> measured)',
  }),
]);

export const IMP96723_DECOMPOSITION_SUMMARY = Object.freeze({
  totalRatio: IMP96693_RATIOS.measuredOverTrace,
  product: IMP96693_DECOMPOSITION.product,
  decompositionCloses: IMP96693_VERDICT.decompositionCloses,
  strictlyOrdered: IMP96693_VERDICT.strictlyOrdered,
});

export const IMP96723_HONEST_BANNER = IMP96693_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96723_ASSERTIONS = [
  {
    id: 'imp96723-three-bars-strictly-increasing-log10n-with-labels',
    holds: () =>
      IMP96723_BARS.length === 3 &&
      IMP96723_BARS.every((b, i) => i === 0 || b.log10N > IMP96723_BARS[i - 1].log10N) &&
      IMP96723_BARS[0].label === 'rigorous' &&
      IMP96723_BARS[1].label === 'fit' &&
      IMP96723_BARS[2].label === 'measured',
    why: 'the three ceiling bars must be present, strictly increasing in log10(N), and carry the trace/rigorous, Frobenius/fit, measured/measured labels in order.',
  },
  {
    id: 'imp96723-two-ratio-labels-match-source-ratios',
    holds: () =>
      IMP96723_RATIO_LABELS.length === 2 &&
      IMP96723_RATIO_LABELS[0].ratio === IMP96693_RATIOS.frobeniusOverTrace &&
      IMP96723_RATIO_LABELS[1].ratio === IMP96693_RATIOS.measuredOverFrobenius &&
      IMP96723_RATIO_LABELS[0].ratio > 1.44 && IMP96723_RATIO_LABELS[0].ratio < 1.46 &&
      IMP96723_RATIO_LABELS[1].ratio > 1.08 && IMP96723_RATIO_LABELS[1].ratio < 1.10,
    why: 'the two labelled ratios must match the imp-96693 source ratios verbatim, reproducing the ~1.45x and ~1.09x decomposition legs.',
  },
  {
    id: 'imp96723-decomposition-summary-and-honesty-gate',
    holds: () =>
      IMP96723_DECOMPOSITION_SUMMARY.decompositionCloses === true &&
      IMP96723_DECOMPOSITION_SUMMARY.strictlyOrdered === true &&
      IMP96723_DECOMPOSITION_SUMMARY.totalRatio > 1.57 && IMP96723_DECOMPOSITION_SUMMARY.totalRatio < 1.60 &&
      /RH open/.test(IMP96723_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96723_HONEST_BANNER) &&
      /NO QED/.test(IMP96723_HONEST_BANNER),
    why: 'the decomposition-closure and strict-ordering flags must be reused verbatim from imp-96693, the total ratio must match the ~1.58x figure, and the honesty markers must be present.',
  },
];

for (const a of IMP96723_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96723-route-m-three-ceiling-decomposition-viz-data assertion failed: ${a.id}`,
    );
  }
}
