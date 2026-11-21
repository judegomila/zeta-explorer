/**
 * @module imp-96857-krein-2a-monotonicity-viz-data
 *
 * imp-96857 (ux): import-light viz-data leaf for the imp-96835 Krein floor-vs-2a
 * monotonicity cross-check -- floor lambda_min(T_a[sigma_2]) (Rayleigh-Ritz upper
 * bound, condB=1 Gegenbauer basis) descending 20.13 -> 0.58 as 2a climbs from 0.96
 * to ln3, one series per N in {52,76,100}, at the t-converged T=4800 rung.
 *
 * imp-96835 exported IMP96835_FLOOR_VS_2A + IMP96835_VERDICT but shipped no
 * visualization: this module reshapes those literals (imported directly, no
 * transcription) into a chart-ready per-N series list plus the headline
 * 0.96-vs-ln3 ratio annotation.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity; the
 * Rayleigh floor is an UPPER bound; the uniform-in-N spectral gap remains the
 * open obstruction (IMP96749_UNIFORM_N_GAP_UNSETTLED); interval-rigorous
 * certificate reach stays 2a<=0.96; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-96835-krein-2a-monotonicity-cross-check.js (source floor-vs-2a table + verdict)
 * @see imp-96836-krein-tsweep-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96857 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96835_TWO_A,
  IMP96835_TWO_A_LABELS,
  IMP96835_NS,
  IMP96835_FLOOR_VS_2A,
  IMP96835_FLOOR_096_N100_T4800,
  IMP96835_FLOOR_LN3_N100_T4800,
  IMP96835_096_TO_LN3_RATIO,
} from './imp-96835-krein-2a-monotonicity-cross-check.js';

export const IMP96857_TWO_A = IMP96835_TWO_A;
export const IMP96857_TWO_A_LABELS = IMP96835_TWO_A_LABELS;
export const IMP96857_NS = IMP96835_NS;
export const IMP96857_T = 4800; // t-converged rung used for the headline series

const COLOR_BY_N = Object.freeze({
  52: '#38bdf8',
  76: '#facc15',
  100: '#4ade80',
});

// Chart-ready per-N series over the 2a ladder (T=4800, t-converged rung).
export const IMP96857_SERIES = Object.freeze(
  IMP96857_NS.map((N) =>
    Object.freeze({
      N,
      label: `lambda_min(T_a[sigma_2]), N=${N}`,
      color: COLOR_BY_N[N],
      values: IMP96835_FLOOR_VS_2A[IMP96857_T][N],
      twoA: IMP96857_TWO_A,
    }),
  ),
);

// Headline bridge annotation (N=100, T=4800): 2a=0.96 floor vs the 2a=ln3 plateau.
export const IMP96857_HEADLINE = Object.freeze({
  floor096: IMP96835_FLOOR_096_N100_T4800, // 20.132660
  floorLn3: IMP96835_FLOOR_LN3_N100_T4800, // 0.579988
  ratio: IMP96835_096_TO_LN3_RATIO, // 34.7
});

export const IMP96857_HONEST_BANNER =
  'Measurement only: this is a Rayleigh-Ritz UPPER floor, not an operator positivity proof. ' +
  'The floor descent as 2a increases confirms 2a=ln3 is the smallest floor in the certified-adjacent ' +
  'window, not that it is intrinsically positive; the uniform-in-N spectral gap ' +
  'lambda_min(T_a[sigma_2]) >= c > 0 stays OPEN; interval-rigorous certificate reach stays 2a<=0.96; ' +
  'RH open; no refereed bound is changed; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96857_ASSERTIONS = [
  {
    id: 'imp96857-three-series-four-rungs',
    holds: () =>
      IMP96857_SERIES.length === 3 &&
      IMP96857_SERIES.every((s) => s.values.length === IMP96857_TWO_A.length && s.twoA.length === IMP96857_TWO_A.length),
    why: 'the viz must carry all three N rungs (52,76,100) over the full four-point 2a=0.96..ln3 ladder, with no dropped points.',
  },
  {
    id: 'imp96857-series-monotone-descending-in-2a',
    holds: () =>
      IMP96857_SERIES.every((s) => s.values.every((v, i) => i === 0 || v < s.values[i - 1])),
    why: 'each N series must strictly descend as 2a increases 0.96->1.00->1.05->ln3, matching the imp-96835 monotonicity reading.',
  },
  {
    id: 'imp96857-headline-matches-n100-column',
    holds: () => {
      const row = IMP96835_FLOOR_VS_2A[IMP96857_T][100];
      return Math.abs(row[0] - IMP96857_HEADLINE.floor096) < 1e-9 &&
        Math.abs(row[row.length - 1] - IMP96857_HEADLINE.floorLn3) < 1e-9 &&
        IMP96857_HEADLINE.ratio > 10;
    },
    why: 'the headline annotation must reproduce the N=100, T=4800 column of the imp-96835 table verbatim, with the 0.96-vs-ln3 ratio strongly greater than one.',
  },
  {
    id: 'imp96857-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96857_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96857_HONEST_BANNER) &&
      /NO QED/.test(IMP96857_HONEST_BANNER),
    why: 'every Route I viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96857_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96857-krein-2a-monotonicity-viz-data assertion failed: ${a.id}`);
  }
}
