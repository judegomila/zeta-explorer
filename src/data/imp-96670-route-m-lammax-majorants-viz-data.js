/**
 * @module imp-96670-route-m-lammax-majorants-viz-data
 *
 * imp-96670 (ux): import-light viz-data leaf for the imp-96648 four
 * unconditional lam_max majorants on the exact Route M Vasyunin Gram --
 * Gershgorin/row-sum, Brauer/Cassini, Frobenius, Wolkowicz-Styan -- plotted
 * against the measured power-iteration lam_max and the imp-96548 trace
 * bound over the N=250..6000 ladder, with each majorant's re-solved
 * double-precision conditioning ceiling labeled.
 *
 * imp-96648 had six numeric curves (four majorants + measured lam_max +
 * trace) and the re-solved ceilings, but no chart. This module reshapes
 * the same eight-rung ladder into a chart-ready series list and a labeled
 * ceiling table; every number is reused verbatim from imp-96648, no
 * re-solve.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity,
 * no RH claim; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (source ladder + ceilings)
 * @see imp-96581-route-m-lammax-rigorous-vs-measured-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96670 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96648_ROWS,
  IMP96648_CEILINGS,
  IMP96648_GAP,
  IMP96648_VERDICT,
} from './imp-96648-route-m-lammax-frobenius-moment-majorant.js';

// Chart-ready series list: one entry per curve, each carrying its own
// per-N values (read off IMP96648_ROWS verbatim) and its re-solved ceiling.
export const IMP96670_SERIES = Object.freeze([
  Object.freeze({
    key: 'lamMax',
    label: 'measured lam_max (power iteration)',
    kind: 'reference',
    values: IMP96648_ROWS.map((r) => r.lamMax),
    ceilingN: IMP96648_CEILINGS.measured,
  }),
  Object.freeze({
    key: 'trace',
    label: 'trace bound (imp-96548, rigorous)',
    kind: 'baseline',
    values: IMP96648_ROWS.map((r) => r.trace),
    ceilingN: IMP96648_CEILINGS.trace,
  }),
  Object.freeze({
    key: 'rowsum',
    label: 'Gershgorin / row-sum (rigorous, FAILS)',
    kind: 'worse',
    values: IMP96648_ROWS.map((r) => r.rowsum),
    ceilingN: IMP96648_CEILINGS.rowsum,
  }),
  Object.freeze({
    key: 'brauer',
    label: 'Brauer / Cassini-oval (rigorous, FAILS)',
    kind: 'worse',
    values: IMP96648_ROWS.map((r) => r.brauer),
    ceilingN: IMP96648_CEILINGS.brauer,
  }),
  Object.freeze({
    key: 'frobenius',
    label: 'Frobenius (rigorous, sharper)',
    kind: 'sharper',
    values: IMP96648_ROWS.map((r) => r.frobenius),
    ceilingN: IMP96648_CEILINGS.frobenius,
  }),
  Object.freeze({
    key: 'ws',
    label: 'Wolkowicz-Styan (rigorous, sharper)',
    kind: 'sharper',
    values: IMP96648_ROWS.map((r) => r.ws),
    ceilingN: IMP96648_CEILINGS.ws,
  }),
]);

export const IMP96670_N_LADDER = Object.freeze(IMP96648_ROWS.map((r) => r.N));

// Labeled ceiling table (log10 for a readable log-N axis) plus the
// imp-96352 wall-clock compute ceiling that binds first regardless.
export const IMP96670_CEILING_TABLE = Object.freeze(
  IMP96670_SERIES.map((s) => Object.freeze({
    key: s.key,
    label: s.label,
    kind: s.kind,
    ceilingN: s.ceilingN,
    log10CeilingN: Math.log10(s.ceilingN),
  })).concat([
    Object.freeze({
      key: 'compute',
      label: 'wall-clock compute ceiling (imp-96352)',
      kind: 'compute',
      ceilingN: IMP96648_CEILINGS.computeCeilingN,
      log10CeilingN: Math.log10(IMP96648_CEILINGS.computeCeilingN),
    }),
  ]),
);

export const IMP96670_GAP_SUMMARY = Object.freeze({
  bestSharperCeilingN: IMP96648_GAP.bestSharperCeilingN, // ~3.75e7
  bestOverTraceFactor: IMP96648_GAP.bestOverTraceFactor, // ~1.445
  fractionOfTraceToMeasuredGapClosed: IMP96648_GAP.fractionOfTraceToMeasuredGapClosed, // ~0.762
  residualToMeasuredFactor: IMP96648_GAP.residualToMeasuredFactor, // ~1.096
  bestAboveComputeFactor: IMP96648_GAP.bestAboveComputeFactor, // ~3780x
});

export const IMP96670_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every curve value and ' +
  'ceiling is reused verbatim from imp-96648 (rigorous matrix inequalities measured on the ' +
  'same exact Vasyunin Gram); this module only reshapes the same eight-rung ladder into a ' +
  'chart-ready series list. No bound is claimed moved and no operator positivity is ' +
  'established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96670_ASSERTIONS = [
  {
    id: 'imp96670-six-series-eight-rungs',
    holds: () =>
      IMP96670_SERIES.length === 6 &&
      IMP96670_N_LADDER.length === 8 &&
      IMP96670_SERIES.every((s) => s.values.length === 8),
    why: 'the viz must carry all six imp-96648 curves (measured lam_max, trace, two failing row-sum majorants, two sharper moment majorants) over the same eight-rung N=250..6000 ladder, with no dropped points.',
  },
  {
    id: 'imp96670-ceiling-ordering-matches-imp96648-verdict',
    holds: () => {
      const byKey = Object.fromEntries(IMP96670_CEILING_TABLE.map((c) => [c.key, c.ceilingN]));
      return (
        byKey.rowsum < byKey.trace &&
        byKey.brauer < byKey.trace &&
        byKey.trace < byKey.frobenius &&
        byKey.trace < byKey.ws &&
        byKey.frobenius < byKey.lamMax &&
        byKey.compute < byKey.rowsum
      );
    },
    why: 'the labeled ceiling table must reproduce the imp-96648 verdict ordering: row-sum/Brauer below trace (fails), Frobenius/Wolkowicz-Styan above trace (sharper) but below the measured composed ceiling, and the compute ceiling far below every conditioning ceiling.',
  },
  {
    id: 'imp96670-values-monotone-increasing-per-curve',
    holds: () =>
      IMP96670_SERIES.every((s) =>
        s.values.every((v, i) => i === 0 || v > s.values[i - 1]),
      ),
    why: 'every curve (measured lam_max, trace, and all four majorants) is monotone increasing in N over the accessible ladder, matching the log-shape growth reported in imp-96648.',
  },
  {
    id: 'imp96670-gap-summary-matches-source',
    holds: () =>
      IMP96670_GAP_SUMMARY.fractionOfTraceToMeasuredGapClosed > 0.7 &&
      IMP96670_GAP_SUMMARY.fractionOfTraceToMeasuredGapClosed === IMP96648_GAP.fractionOfTraceToMeasuredGapClosed &&
      IMP96670_GAP_SUMMARY.bestAboveComputeFactor === IMP96648_GAP.bestAboveComputeFactor,
    why: 'the gap-summary numbers plotted alongside the chart must be identical (not re-derived) to the imp-96648 IMP96648_GAP record.',
  },
  {
    id: 'imp96670-verdict-flags-consistent',
    holds: () =>
      IMP96648_VERDICT.rowsumFamilyHelps === false && IMP96648_VERDICT.momentFamilyHelps === true,
    why: 'the row-sum-fails / moment-helps split from imp-96648 must hold for the labels (worse vs sharper) attached to each series to be accurate.',
  },
  {
    id: 'imp96670-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96670_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96670_HONEST_BANNER) &&
      /NO QED/.test(IMP96670_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96670_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96670-route-m-lammax-majorants-viz-data assertion failed: ${a.id}`,
    );
  }
}
