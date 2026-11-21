/**
 * @module imp-96762-lstar-loo-model-selection-viz-data
 *
 * imp-96762 (ux): import-light viz-data leaf for the imp-96735 leave-one-out
 * (jackknife) re-analysis of the imp-96712 basis-C corroboration-reach
 * bracket. imp-96735 has the numbers as JSDoc/literal tables and nested
 * per-drop records only; this reshapes them into two chart-ready arrays:
 * (1) the 15 leave-one-out L* points (5 dropped rungs x 3 models A/B/C),
 * grouped by dropped rung, against the imp-96712 full-data +/-6% band, and
 * (2) a small bar-panel of the three information-criterion deltas
 * (dAIC/dBIC/dAICc) that favour the single-slope OLS baseline over the
 * three-parameter quadratic.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96735
 * IMP96735_BASIS_C_LSTAR_BRACKET_LOO export; only the flat chart-ready
 * reshape is new. Changes no bound, establishes no operator positivity, no
 * RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96735-basis-c-lstar-bracket-leave-one-out-robustness.js (source: 15 LOO refits + AIC/BIC/AICc)
 * @see imp-96712-basis-c-accelerating-exponent-model.js (the +/-6% bracket this stress-tests)
 *
 * Ticket: imp-96762 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96735 (itself import-light,
 * no zeros bundle, no sibling imports).
 */

import {
  IMP96735_BASIS_C_LSTAR_BRACKET_LOO,
  IMP96735_HONEST_BANNER,
} from './imp-96735-basis-c-lstar-bracket-leave-one-out-robustness.js';

const { leaveOneOut, imp96712Bracket, modelSelection } = IMP96735_BASIS_C_LSTAR_BRACKET_LOO;

// The 15 leave-one-out L* points (5 dropped rungs x 3 models), flattened for a scatter/strip chart.
export const IMP96762_LOO_POINTS = Object.freeze(
  leaveOneOut.perDrop.flatMap((row) => (
    ['A', 'B', 'C'].map((model) => ({
      droppedL: row.droppedL,
      model,
      lstar: row[model],
      logLstar: Math.log10(row[model]),
    }))
  )),
);

// The imp-96712 full-data +/-6% band, for overlay against the wider LOO envelope.
export const IMP96762_FULL_DATA_BAND = Object.freeze({
  lo: imp96712Bracket.lo,
  hi: imp96712Bracket.hi,
  olsBaseline: imp96712Bracket.olsBaseline,
});

// The wider leave-one-out envelope (~4x the full-data band).
export const IMP96762_LOO_ENVELOPE = Object.freeze({
  lo: leaveOneOut.envelope.lo,
  hi: leaveOneOut.envelope.hi,
  ratioHiLo: leaveOneOut.envelope.ratioHiLo,
  fullBandFractionOfOls: leaveOneOut.fullBandFractionOfOls,
  looBandFractionOfOls: leaveOneOut.looBandFractionOfOls,
});

// Small bar panel: the three information-criterion deltas (all > 0 favour the simpler OLS baseline).
export const IMP96762_IC_DELTA_BARS = Object.freeze([
  { criterion: 'AIC', delta: modelSelection.dAIC, favoursOls: modelSelection.dAIC > 0 },
  { criterion: 'BIC', delta: modelSelection.dBIC, favoursOls: modelSelection.dBIC > 0 },
  { criterion: 'AICc', delta: modelSelection.dAICc, favoursOls: modelSelection.dAICc > 0 },
]);

export const IMP96762_HONEST_BANNER = IMP96735_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96762_ASSERTIONS = [
  {
    id: 'imp96762-fifteen-loo-points-present',
    holds: () => IMP96762_LOO_POINTS.length === 15,
    why: 'imp-96735 re-fit three models (A/B/C) on each of five leave-one-out drops, giving 15 crossovers.',
  },
  {
    id: 'imp96762-loo-envelope-wider-than-full-data-band',
    holds: () =>
      IMP96762_LOO_ENVELOPE.lo < IMP96762_FULL_DATA_BAND.lo &&
      IMP96762_LOO_ENVELOPE.hi > IMP96762_FULL_DATA_BAND.hi,
    why: 'imp-96735 FINDING 1: the leave-one-out envelope must strictly contain and exceed the imp-96712 tight +/-6% band on both ends.',
  },
  {
    id: 'imp96762-loo-points-span-the-envelope',
    holds: () =>
      Math.min(...IMP96762_LOO_POINTS.map((p) => p.lstar)) === IMP96762_LOO_ENVELOPE.lo &&
      Math.max(...IMP96762_LOO_POINTS.map((p) => p.lstar)) === IMP96762_LOO_ENVELOPE.hi,
    why: 'the flattened 15-point series must reproduce the exact min/max recorded in the imp-96735 envelope.',
  },
  {
    id: 'imp96762-ic-deltas-all-favour-ols',
    holds: () => IMP96762_IC_DELTA_BARS.every((b) => b.favoursOls) && IMP96762_IC_DELTA_BARS.length === 3,
    why: 'imp-96735 FINDING 3: AIC, BIC, and AICc all prefer the single-slope OLS baseline over the three-parameter quadratic (positive deltas).',
  },
  {
    id: 'imp96762-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96762_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96762_HONEST_BANNER) &&
      /NO QED/.test(IMP96762_HONEST_BANNER),
    why: 'every Route I/basis-C viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96762_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96762-lstar-loo-model-selection-viz-data assertion failed: ${a.id}`);
  }
}
