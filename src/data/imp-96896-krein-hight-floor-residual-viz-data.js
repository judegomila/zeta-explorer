/**
 * @module imp-96896-krein-hight-floor-residual-viz-data
 *
 * imp-96896 (ux): import-light viz-data leaf for the imp-96876 direct high-T
 * N=100, 2a=ln3 Krein floor sweep -- lambda_min(T_a[sigma_2]) climbing over
 * T in {800,1600,3200,4800,6400,9600,12800} toward L~0.58044615 -- plus the
 * three residual-bound routes quoted at T=4800 (actual 4.586e-4, GEOM
 * 1.304e-3, TRACE 1.446e12) reshaped onto a log10 scale so all three fit on
 * one axis despite spanning ~16 orders of magnitude.
 *
 * imp-96876 exported IMP96876_TS/IMP96876_FLOOR/IMP96876_RESIDUAL_TABLE but
 * shipped no visualization: this module reshapes those literals (imported
 * directly, no transcription) into a chart-ready floor-sweep series plus a
 * log10 residual-route bar list.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity;
 * the floor is a Rayleigh-Ritz UPPER bound; the uniform-in-N spectral gap
 * remains open (IMP96749_UNIFORM_N_GAP_UNSETTLED); interval-rigorous
 * certificate reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96876-krein-tresidual-crossval-measurement.js (source floor sweep + residual table)
 * @see imp-96856-krein-tresidual-envelope-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96896 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96876_TS,
  IMP96876_FLOOR,
  IMP96876_L_EST,
  IMP96876_RESIDUAL_TABLE,
} from './imp-96876-krein-tresidual-crossval-measurement.js';

export const IMP96896_TS = IMP96876_TS;

// Chart-ready floor-sweep series, plus log2(T) x-coordinates for an
// even-spaced axis (800..12800 -> log2 9.64..13.64).
export const IMP96896_FLOOR_SERIES = Object.freeze({
  label: 'lambda_min(T_a[sigma_2]), N=100, 2a=ln3',
  color: '#4ade80',
  values: Object.freeze(IMP96896_TS.map((t) => IMP96876_FLOOR[t])),
  log2T: Object.freeze(IMP96896_TS.map((t) => Math.log2(t))),
  limitEstimate: IMP96876_L_EST,
});

const ROUTE_COLOR = Object.freeze({
  actual: '#4ade80',
  geom: '#facc15',
  trace: '#f87171',
});

// The three residual-beyond-T=4800 routes on a log10 scale (they span
// ~4.6e-4 to ~1.4e12, ~16 orders of magnitude, so a linear axis is useless).
export const IMP96896_RESIDUAL_ROUTES_LOG10 = Object.freeze([
  {
    name: 'actual',
    label: 'measured (direct solve)',
    color: ROUTE_COLOR.actual,
    value: IMP96876_RESIDUAL_TABLE.actual,
    log10Value: Math.log10(IMP96876_RESIDUAL_TABLE.actual),
  },
  {
    name: 'geom',
    label: 'GEOM envelope (imp-96827)',
    color: ROUTE_COLOR.geom,
    value: IMP96876_RESIDUAL_TABLE.geom,
    log10Value: Math.log10(IMP96876_RESIDUAL_TABLE.geom),
  },
  {
    name: 'trace',
    label: 'TRACE closed-form (imp-96848)',
    color: ROUTE_COLOR.trace,
    value: IMP96876_RESIDUAL_TABLE.trace,
    log10Value: Math.log10(IMP96876_RESIDUAL_TABLE.trace),
  },
].map(Object.freeze));

export const IMP96896_HONEST_BANNER =
  'Measurement only: the floor sweep is a Rayleigh-Ritz UPPER bound on the true lambda_min, not an ' +
  'operator positivity proof. GEOM and TRACE are both valid upper bounds on the actual residual (that is ' +
  'why all three sit on the SAME side of the measured value on the log10 axis); TRACE is numerically ' +
  'vacuous (~3e15x actual). The uniform-in-N spectral gap lambda_min(T_a[sigma_2]) >= c > 0 stays OPEN; ' +
  'interval-rigorous certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.';

// -- plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
//    leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page. Checked
//    by scripts/run-assertions.mjs via the IMP96896_ASSERTIONS array below, not at import time.)
export const IMP96896_VALIDATION = Object.freeze({
  fullLadderPresent:
    IMP96896_FLOOR_SERIES.values.length === IMP96896_TS.length &&
    IMP96896_FLOOR_SERIES.log2T.length === IMP96896_TS.length,
  floorMonotoneClimbing: IMP96896_FLOOR_SERIES.values.every(
    (v, i) => i === 0 || v > IMP96896_FLOOR_SERIES.values[i - 1],
  ),
  limitEstimateIsLastRung:
    IMP96896_FLOOR_SERIES.limitEstimate === IMP96896_FLOOR_SERIES.values[IMP96896_FLOOR_SERIES.values.length - 1],
  threeRoutesOrderedAscending:
    IMP96896_RESIDUAL_ROUTES_LOG10.length === 3 &&
    IMP96896_RESIDUAL_ROUTES_LOG10[0].log10Value < IMP96896_RESIDUAL_ROUTES_LOG10[1].log10Value &&
    IMP96896_RESIDUAL_ROUTES_LOG10[1].log10Value < IMP96896_RESIDUAL_ROUTES_LOG10[2].log10Value,
  log10ValuesMatchSource: IMP96896_RESIDUAL_ROUTES_LOG10.every(
    (r) => Math.abs(Math.pow(10, r.log10Value) - r.value) / r.value < 1e-9,
  ),
  honestBannerPresent:
    /RH open/.test(IMP96896_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96896_HONEST_BANNER) &&
    /NO QED/.test(IMP96896_HONEST_BANNER),
});

// imp-96397: registers the IMP96896_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP96896_ASSERTIONS = [
  {
    id: 'imp96896-floor-series-full-ladder',
    description: 'the viz carries the full seven-point T=800..12800 ladder, with no dropped points',
    holds: () => IMP96896_VALIDATION.fullLadderPresent,
  },
  {
    id: 'imp96896-floor-monotone-climbing',
    description: 'the floor climbs monotonically as T increases, matching the imp-96876 reading',
    holds: () => IMP96896_VALIDATION.floorMonotoneClimbing,
  },
  {
    id: 'imp96896-limit-estimate-is-last-rung',
    description: 'the best-estimate limit L~0.58044615 is the highest-T measured rung, verbatim from imp-96876',
    holds: () => IMP96896_VALIDATION.limitEstimateIsLastRung,
  },
  {
    id: 'imp96896-three-residual-routes-ordered',
    description: 'the three residual routes are present and ordered actual < GEOM < TRACE in log10 space',
    holds: () => IMP96896_VALIDATION.threeRoutesOrderedAscending,
  },
  {
    id: 'imp96896-log10-values-match-source',
    description: 'log10Value inverts back to the source IMP96876_RESIDUAL_TABLE value with no drift',
    holds: () => IMP96896_VALIDATION.log10ValuesMatchSource,
  },
  {
    id: 'imp96896-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP96896_VALIDATION.honestBannerPresent,
  },
];
