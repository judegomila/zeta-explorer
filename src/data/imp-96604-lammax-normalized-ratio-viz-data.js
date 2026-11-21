/**
 * @module imp-96604-lammax-normalized-ratio-viz-data
 *
 * imp-96604 (ux): import-light viz-data leaf for the imp-96562 FINDING 3
 * numerical-pinnability measurement. imp-96562 asked whether either
 * normalized candidate (lam_max/log N, targeting the fitted slope 0.3526;
 * or lam_max/trace, targeting the ratio 0.2797) is close enough to its
 * asymptotic target across the accessible N=250..6000 ladder to be read off
 * as a Szego-type limiting constant. Both are still ~2x their targets at the
 * top rung -- this module reshapes the two ratio series plus their targets
 * into chart-ready arrays for one.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96562
 * IMP96562_ROWS / IMP96562_NUMERICAL_PINNABILITY records; only the two-series
 * reshape is new. Changes no bound, establishes no operator positivity, no
 * RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (source measurement)
 *
 * Ticket: imp-96604 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96562 (itself import-light,
 * no zeros bundle, no sibling imports).
 */

import {
  IMP96562_ROWS,
  IMP96562_NUMERICAL_PINNABILITY,
  IMP96562_HONEST_BANNER,
} from './imp-96562-route-m-lammax-offdiagonal-szego-assessment.js';

// Two normalized ratio series across the accessible ladder, each paired with
// its own asymptotic target for a "still ~2x away" reading.
export const IMP96604_RATIO_SERIES = Object.freeze(
  IMP96562_ROWS.map((r) => ({
    N: r.N,
    logN: Math.log10(r.N),
    lamMaxOverLogN: r.lamMaxOverLogN,
    lamMaxOverTrace: r.lamMaxOverTrace,
  })),
);

export const IMP96604_TARGETS = Object.freeze({
  lamMaxOverLogNTarget: IMP96562_NUMERICAL_PINNABILITY.targetSlope, // 0.3526
  lamMaxOverTraceTarget: IMP96562_NUMERICAL_PINNABILITY.targetRatioLamMaxTrace, // 0.2797
});

const first = IMP96604_RATIO_SERIES[0];
const last = IMP96604_RATIO_SERIES[IMP96604_RATIO_SERIES.length - 1];

export const IMP96604_GAP_SUMMARY = Object.freeze({
  lamMaxOverLogN: {
    first: first.lamMaxOverLogN,
    last: last.lamMaxOverLogN,
    target: IMP96604_TARGETS.lamMaxOverLogNTarget,
    lastOverTarget: last.lamMaxOverLogN / IMP96604_TARGETS.lamMaxOverLogNTarget,
  },
  lamMaxOverTrace: {
    first: first.lamMaxOverTrace,
    last: last.lamMaxOverTrace,
    target: IMP96604_TARGETS.lamMaxOverTraceTarget,
    lastOverTarget: last.lamMaxOverTrace / IMP96604_TARGETS.lamMaxOverTraceTarget,
  },
  note: IMP96562_NUMERICAL_PINNABILITY.note,
});

export const IMP96604_HONEST_BANNER = IMP96562_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96604_ASSERTIONS = [
  {
    id: 'imp96604-eight-rungs-present',
    holds: () => IMP96604_RATIO_SERIES.length === 8,
    why: 'imp-96562 measured exactly eight rungs (N=250..6000) for both normalized ratio series.',
  },
  {
    id: 'imp96604-both-series-decreasing-toward-target',
    holds: () =>
      IMP96604_RATIO_SERIES.every(
        (row, i) =>
          i === 0 ||
          (row.lamMaxOverLogN < IMP96604_RATIO_SERIES[i - 1].lamMaxOverLogN &&
            row.lamMaxOverTrace < IMP96604_RATIO_SERIES[i - 1].lamMaxOverTrace),
      ),
    why: 'both normalized ratios fall monotonically toward their targets as N grows across the ladder.',
  },
  {
    id: 'imp96604-both-still-2x-above-target-at-top-rung',
    holds: () =>
      IMP96604_GAP_SUMMARY.lamMaxOverLogN.lastOverTarget > 1.8 &&
      IMP96604_GAP_SUMMARY.lamMaxOverTrace.lastOverTarget > 1.8,
    why: 'FINDING 3: at N=6000, both ratios remain > 1.8x their asymptotic targets, so neither can numerically pin the limit from the accessible ladder.',
  },
  {
    id: 'imp96604-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96604_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96604_HONEST_BANNER) &&
      /NO QED/.test(IMP96604_HONEST_BANNER),
    why: 'every Route M lam_max viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96604_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96604-lammax-normalized-ratio-viz-data assertion failed: ${a.id}`);
  }
}
