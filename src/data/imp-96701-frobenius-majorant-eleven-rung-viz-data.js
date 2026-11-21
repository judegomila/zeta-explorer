/**
 * @module imp-96701-frobenius-majorant-eleven-rung-viz-data
 *
 * imp-96701 (ux): import-light viz-data leaf for the imp-96684 eleven-rung
 * Frobenius / Wolkowicz-Styan two-moment majorant ladder (N=250..9000),
 * plotting the majorant curve against the measured lam_max and trace, and
 * labeling the re-solved rigorous-lower conditioning ceilings alongside the
 * imp-96352 wall-clock compute ceiling.
 *
 * imp-96684 extended the imp-96648 eight-rung ladder (N<=6000) with three
 * new measured rungs (N=7000,8000,9000) and re-fit the majorant slope over
 * all eleven rungs, but had no visualization. This module reshapes the
 * eleven-rung ladder (imp-96648 rows + imp-96684 new rows, both imported
 * directly, no transcription) into a chart-ready series list and a labeled
 * ceiling table.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity,
 * no RH claim; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (eight committed rungs)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (three new rungs + re-fit ceilings)
 * @see imp-96670-route-m-lammax-majorants-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96701 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96648_ROWS } from './imp-96648-route-m-lammax-frobenius-moment-majorant.js';
import {
  IMP96684_NEW_ROWS,
  IMP96684_LAMMAX_AT_NEW_RUNGS,
  IMP96684_CEILINGS,
  IMP96684_CEILING_SHIFT,
  IMP96684_VERDICT,
  IMP96684_HONEST_BANNER,
} from './imp-96684-route-m-frobenius-majorant-high-n-rungs.js';

// The full eleven-rung N ladder in ascending order.
export const IMP96701_N_LADDER = Object.freeze(
  IMP96648_ROWS.map((r) => r.N).concat(IMP96684_NEW_ROWS.map((r) => r.N)),
);

// Chart-ready series list: Frobenius majorant (all 11 rungs, reused
// verbatim), measured lam_max (all 11 rungs), and trace (all 11 rungs).
export const IMP96701_SERIES = Object.freeze([
  Object.freeze({
    key: 'frobenius',
    label: 'Frobenius / Wolkowicz-Styan majorant (rigorous)',
    kind: 'sharper',
    values: IMP96648_ROWS.map((r) => r.frobenius).concat(IMP96684_NEW_ROWS.map((r) => r.frobenius)),
    ceilingN: IMP96684_CEILINGS.frobenius11,
  }),
  Object.freeze({
    key: 'lamMax',
    label: 'measured lam_max (power iteration)',
    kind: 'reference',
    values: IMP96648_ROWS.map((r) => r.lamMax).concat(
      IMP96684_NEW_ROWS.map((r) => IMP96684_LAMMAX_AT_NEW_RUNGS[r.N]),
    ),
    ceilingN: IMP96684_CEILINGS.measured,
  }),
  Object.freeze({
    key: 'trace',
    label: 'trace bound (rigorous)',
    kind: 'baseline',
    values: IMP96648_ROWS.map((r) => r.trace).concat(IMP96684_NEW_ROWS.map((r) => r.trace)),
    ceilingN: IMP96684_CEILINGS.trace,
  }),
]);

// Labeled ceiling table (log10 for a readable log-N axis) plus the
// imp-96352 wall-clock compute ceiling that binds first regardless, and the
// pre-imp-96684 eight-rung Frobenius ceiling for the before/after reference.
export const IMP96701_CEILING_TABLE = Object.freeze(
  IMP96701_SERIES.map((s) => Object.freeze({
    key: s.key,
    label: s.label,
    kind: s.kind,
    ceilingN: s.ceilingN,
    log10CeilingN: Math.log10(s.ceilingN),
  })).concat([
    Object.freeze({
      key: 'frobenius8',
      label: 'eight-rung Frobenius ceiling, before imp-96684 (for reference)',
      kind: 'before',
      ceilingN: IMP96684_CEILINGS.frobenius8,
      log10CeilingN: Math.log10(IMP96684_CEILINGS.frobenius8),
    }),
    Object.freeze({
      key: 'compute',
      label: 'wall-clock compute ceiling (imp-96352)',
      kind: 'compute',
      ceilingN: IMP96684_CEILINGS.computeCeilingN,
      log10CeilingN: Math.log10(IMP96684_CEILINGS.computeCeilingN),
    }),
  ]),
);

export const IMP96701_CEILING_SHIFT = Object.freeze({
  frobeniusBefore: IMP96684_CEILING_SHIFT.frobeniusBefore,
  frobeniusAfter: IMP96684_CEILING_SHIFT.frobeniusAfter,
  frobeniusShiftFactor: IMP96684_CEILING_SHIFT.frobeniusShiftFactor,
  residualToMeasuredFactor: IMP96684_CEILING_SHIFT.residualToMeasuredFactor,
  fractionOfTraceToMeasuredGapClosed: IMP96684_CEILING_SHIFT.fractionOfTraceToMeasuredGapClosed,
  aboveComputeFactor: IMP96684_CEILING_SHIFT.aboveComputeFactor,
});

export const IMP96701_HONEST_BANNER = IMP96684_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96701_ASSERTIONS = [
  {
    id: 'imp96701-eleven-rungs-three-series',
    holds: () =>
      IMP96701_N_LADDER.length === 11 &&
      IMP96701_SERIES.length === 3 &&
      IMP96701_SERIES.every((s) => s.values.length === 11),
    why: 'the viz must carry all three curves (Frobenius majorant, measured lam_max, trace) over the full eleven-rung N=250..9000 ladder (the imp-96648 eight rungs plus the imp-96684 three new rungs), with no dropped points.',
  },
  {
    id: 'imp96701-values-monotone-increasing-per-curve',
    holds: () =>
      IMP96701_SERIES.every((s) => s.values.every((v, i) => i === 0 || v > s.values[i - 1])),
    why: 'every curve (Frobenius majorant, measured lam_max, trace) is monotone increasing in N over the accessible ladder, matching the log-shape growth reported in imp-96684.',
  },
  {
    id: 'imp96701-frobenius-between-lammax-and-trace',
    holds: () => {
      const byKey = Object.fromEntries(IMP96701_SERIES.map((s) => [s.key, s.values]));
      return byKey.frobenius.every((v, i) => v > byKey.lamMax[i] && v < byKey.trace[i]);
    },
    why: 'the Frobenius majorant must sit strictly between the measured lam_max and the trace at every rung -- a valid, sharper-than-trace rigorous upper bound (imp-96684 Finding 3).',
  },
  {
    id: 'imp96701-ceiling-shift-matches-source',
    holds: () =>
      IMP96701_CEILING_SHIFT.frobeniusShiftFactor === IMP96684_CEILING_SHIFT.frobeniusShiftFactor &&
      IMP96701_CEILING_SHIFT.frobeniusShiftFactor > 1.0 &&
      IMP96701_CEILING_SHIFT.frobeniusShiftFactor < 1.01 &&
      IMP96701_CEILING_SHIFT.residualToMeasuredFactor === IMP96684_CEILING_SHIFT.residualToMeasuredFactor,
    why: 'the ceiling-shift numbers plotted alongside the chart must be identical (not re-derived) to the imp-96684 IMP96684_CEILING_SHIFT record: the +0.42% robust shift.',
  },
  {
    id: 'imp96701-verdict-flags-consistent',
    holds: () =>
      IMP96684_VERDICT.majorantSlopeFlattens === true && IMP96684_VERDICT.ceilingTightens === false,
    why: 'the slope-flattens / ceiling-not-tightened split from imp-96684 must hold for the chart caption to accurately describe the eleven-rung ladder.',
  },
  {
    id: 'imp96701-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96701_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96701_HONEST_BANNER) &&
      /NO QED/.test(IMP96701_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96701_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96701-frobenius-majorant-eleven-rung-viz-data assertion failed: ${a.id}`,
    );
  }
}
