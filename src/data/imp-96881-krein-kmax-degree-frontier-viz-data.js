/**
 * @module imp-96881-krein-kmax-degree-frontier-viz-data
 *
 * imp-96881 (ux): import-light viz-data leaf for the imp-96845 Route I Krein
 * kmax degree-frontier ladder -- under the identical lean double-precision
 * cutting-plane config, kmax=4 walls immediately at 2a=0.96 (a fixed-degree
 * / double-precision ARTIFACT), while kmax=5 stays solvable with a tiny
 * bounded l1 out to 2a=1.06, then walls numerically in the 1.06-1.08 band,
 * short of ln3=1.0986 by ~0.039.
 *
 * imp-96845 exported IMP96845_SWEEP + IMP96845_VERDICT but shipped no
 * visualization: this module reshapes those literals (imported directly, no
 * transcription) into a chart-ready per-kmax solvability ladder plus the
 * headline frontier-band and l1-collapse annotations.
 *
 * PRESENTATION ONLY. Every kmax=5 point is a near-feasible cutting-plane
 * iterate, not an interval-verified certificate; the kmax=5 wall is a HiGHS
 * numerical (double-precision) limit, not a proven infeasibility;
 * interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96845-krein-kmax5-frontier-measurement.js (source sweep table + verdict)
 * @see imp-96857-krein-2a-monotonicity-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96881 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96845_SWEEP, IMP96845_VERDICT } from './imp-96845-krein-kmax5-frontier-measurement.js';

const LN3 = Math.log(3); // 1.0986122886681098

export const IMP96881_TWO_A = Object.freeze([0.96, 1.0, 1.04, 1.06, 1.08, 1.09, LN3]);
export const IMP96881_TWO_A_LABELS = Object.freeze(['0.96', '1.00', '1.04', '1.06', '1.08', '1.09', 'ln3']);

// Chart-ready ladder: one row per 2a, kmax=4 known only at 2a=0.96 (null elsewhere -- not solved in this lean config).
export const IMP96881_LADDER = Object.freeze(
  IMP96881_TWO_A.map((twoA, i) => {
    const k4 = IMP96845_SWEEP.find((r) => r.kmax === 4 && r.twoA === twoA) ?? null;
    const k5 = IMP96845_SWEEP.find((r) => r.kmax === 5 && r.twoA === twoA) ?? null;
    return Object.freeze({
      twoA,
      twoALabel: IMP96881_TWO_A_LABELS[i],
      kmax4Status: k4 ? k4.status : null,
      kmax5Status: k5 ? k5.status : null,
      kmax5L1: k5 ? k5.l1 : null,
    });
  }),
);

// l1 series over the solved kmax=5 stretch only (walled points carry l1=null).
export const IMP96881_L1_SERIES = Object.freeze(
  IMP96881_LADDER.filter((r) => r.kmax5L1 !== null).map((r) => ({ twoA: r.twoA, twoALabel: r.twoALabel, l1: r.kmax5L1 })),
);

export const IMP96881_HEADLINE = Object.freeze({
  kmax4WallTwoA: 0.96,
  kmax5FrontierLower: IMP96845_VERDICT.twoAStarLowerMeasured, // 1.06 -- last solvable kmax=5 point
  kmax5FrontierUpper: IMP96845_VERDICT.twoAStarUpperMeasured, // 1.08 -- first walled kmax=5 point
  ln3: LN3,
  shortfallBelowLn3: IMP96845_VERDICT.shortfallBelowLn3, // ~0.039
  l1ReductionFactorAt096: IMP96845_VERDICT.l1ReductionFactorAt096, // ~7.9e4
});

export const IMP96881_HONEST_BANNER =
  'Measurement only: every kmax=5 point is a near-feasible cutting-plane iterate, not an ' +
  'interval-verified certificate, and the kmax=5 wall (1.06-1.08) is a HiGHS double-precision ' +
  'numerical limit, not proven infeasibility. The kmax=4 wall at 2a=0.96 is a fixed-degree ' +
  'artifact -- raising the degree moves the frontier right of 1.0 but not past ln3. ' +
  'Interval-rigorous certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96881_ASSERTIONS = [
  {
    id: 'imp96881-seven-point-ladder',
    holds: () => IMP96881_LADDER.length === 7 && IMP96881_LADDER.every((r) => r.kmax5Status !== null),
    why: 'the ladder must carry all seven 2a grid points (0.96..ln3) with a kmax=5 status on every row.',
  },
  {
    id: 'imp96881-kmax4-walls-where-kmax5-solves-at-096',
    holds: () => {
      const row = IMP96881_LADDER.find((r) => r.twoA === 0.96);
      return row.kmax4Status === 'walled' && row.kmax5Status === 'solved' && row.kmax5L1 > 0 && row.kmax5L1 < 100;
    },
    why: 'the core degree-move signal: under the identical lean config, kmax=4 walls at 2a=0.96 while kmax=5 stays solvable with a tiny bounded l1.',
  },
  {
    id: 'imp96881-l1-series-four-solved-points',
    holds: () => IMP96881_L1_SERIES.length === 4 && IMP96881_L1_SERIES.every((r) => r.l1 > 0),
    why: 'the l1 series must cover exactly the four solved kmax=5 points (0.96,1.00,1.04,1.06), each with a positive bounded l1.',
  },
  {
    id: 'imp96881-frontier-band-below-ln3',
    holds: () =>
      IMP96881_HEADLINE.kmax5FrontierLower < IMP96881_HEADLINE.kmax5FrontierUpper &&
      IMP96881_HEADLINE.kmax5FrontierUpper < LN3 &&
      IMP96881_HEADLINE.shortfallBelowLn3 > 0,
    why: 'the measured kmax=5 frontier band (1.06 < 2a* < 1.08) must sit strictly below ln3, matching the imp-96845 verdict that ln3 is not reached.',
  },
  {
    id: 'imp96881-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96881_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96881_HONEST_BANNER) &&
      /NO QED/.test(IMP96881_HONEST_BANNER),
    why: 'every Route I viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96881_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96881-krein-kmax-degree-frontier-viz-data assertion failed: ${a.id}`);
  }
}
