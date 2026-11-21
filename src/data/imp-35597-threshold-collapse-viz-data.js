/**
 * @module imp-35597-threshold-collapse-viz-data
 * @fileoverview imp-35597 -- VIZ DATA ONLY for the imp-35571 route-(i)
 *   subleading-rate THRESHOLD-COLLAPSE curve: the required log T0 as a
 *   function of the poly-log exponent a (log T0 >= 200^(1/a)) and the
 *   power-law rate delta (log T0 >= 5.2983/delta), plotted against the
 *   landmark log-heights -- the interior sigma-peak (~13.23), the
 *   E_coll = E_trunc crossover (~20.86), the Platt-Trudgian anchor (~28.73)
 *   -- and the leading-rate baseline log T0 >= 200 (T0 >= e^200).
 *
 *   Re-exports the imp-35571 CANDIDATES table and landmark log-heights
 *   directly and adds two dense curve series (poly-log over a in [1,4],
 *   power-law over delta in [0.1,2]) for plotting. imp-35571 is
 *   import-light (only lambda-rh-height-mapping.js -> bridge-lambda-rh.js
 *   -> guth-maynard-tail-bound.js, no heavy dependency, never the 16.7MB
 *   zeros bundle), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35571-route-i-subleading-rate-scope.js (the module re-exported here)
 *   @see imp-35538-route-i-remainder-derivation-requirements (REQ-4 log T0 >= 200 threshold)
 *   @see imp-35598 (glossary companion for the same threshold-collapse finding)
 *
 *   Ticket: imp-35597 (ux, medium). Presentation only of an already-established
 *   scoping assessment; adds no new Lambda bound, discharges nothing. C_C =
 *   (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

import { IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE } from './imp-35571-route-i-subleading-rate-scope.js';

const TC = IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.thresholdCollapse;

export const IMP35597_CANDIDATES = TC.candidates;

export const IMP35597_LANDMARKS = Object.freeze({
  logT0Peak: TC.logT0Peak, // ~13.2309
  logT0Cross: TC.logT0Cross, // ~20.8576
  logT_PT: TC.logT_PT, // ~28.7296
  logT0NeededLeading: TC.logT0NeededLeading, // 200 (baseline e^200)
});

// Dense poly-log curve: log T0 needed = 200^(1/a), a in [1, 4].
const POLYLOG_A_VALUES = [1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4];
export const IMP35597_POLYLOG_CURVE = Object.freeze(
  POLYLOG_A_VALUES.map((a) => ({
    a,
    logT0Needed: +Math.pow(1 / TC.crossEcollRelBudget, 1 / a).toFixed(4),
  }))
);

// Dense power-law curve: log T0 needed = ln(1/B)/delta, delta in [0.1, 2].
const POWERLAW_DELTA_VALUES = [0.1, 0.15, 0.2, 0.254, 0.3, 0.5, 0.75, 1, 1.5, 2];
const LN_INV_BUDGET = Math.log(1 / TC.crossEcollRelBudget); // ~5.2983
export const IMP35597_POWERLAW_CURVE = Object.freeze(
  POWERLAW_DELTA_VALUES.map((delta) => ({
    delta,
    logT0Needed: +(LN_INV_BUDGET / delta).toFixed(4),
  }))
);

export const IMP35597_SUMMARY = Object.freeze({
  a2LogT0Needed: IMP35597_CANDIDATES.find((c) => c.family === 'poly-log' && c.value === 2).logT0Needed,
  deltaAtCrossoverHeight: +(LN_INV_BUDGET / TC.logT0Cross).toFixed(4), // delta such that threshold = crossover height
  deltaAtPeakHeight: +(LN_INV_BUDGET / TC.logT0Peak).toFixed(4), // delta such that threshold = peak height
});

export default Object.freeze({
  id: 'imp-35597-threshold-collapse-viz-data',
  ticket: 'imp-35597',
  sources: ['imp-35571-route-i-subleading-rate-scope.js'],
  landmarks: IMP35597_LANDMARKS,
  candidates: IMP35597_CANDIDATES,
  polylogCurve: IMP35597_POLYLOG_CURVE,
  powerlawCurve: IMP35597_POWERLAW_CURVE,
  summary: IMP35597_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35597_ASSERTIONS = [
  {
    id: 'imp35597-landmark-heights-match-imp35571',
    holds: () =>
      Math.abs(IMP35597_LANDMARKS.logT0Peak - 13.2309) < 1e-2 &&
      Math.abs(IMP35597_LANDMARKS.logT0Cross - 20.8576) < 1e-2 &&
      Math.abs(IMP35597_LANDMARKS.logT_PT - 28.7296) < 1e-2 &&
      IMP35597_LANDMARKS.logT0NeededLeading === 200,
    why: 'The three landmark log-heights and the leading-rate baseline must match imp-35571 verbatim.',
  },
  {
    id: 'imp35597-polylog-curve-monotone-decreasing',
    holds: () =>
      IMP35597_POLYLOG_CURVE.every(
        (row, i) => i === 0 || row.logT0Needed <= IMP35597_POLYLOG_CURVE[i - 1].logT0Needed
      ) && IMP35597_POLYLOG_CURVE[0].logT0Needed === 200,
    why: 'log T0 needed = 200^(1/a) must decrease monotonically as a increases, starting at the a=1 leading-rate baseline of 200.',
  },
  {
    id: 'imp35597-powerlaw-curve-monotone-decreasing',
    holds: () =>
      IMP35597_POWERLAW_CURVE.every(
        (row, i) => i === 0 || row.logT0Needed <= IMP35597_POWERLAW_CURVE[i - 1].logT0Needed
      ),
    why: 'log T0 needed = ln(1/B)/delta must decrease monotonically as delta increases.',
  },
  {
    id: 'imp35597-a2-in-landmark-regime',
    holds: () =>
      IMP35597_SUMMARY.a2LogT0Needed > IMP35597_LANDMARKS.logT0Peak &&
      IMP35597_SUMMARY.a2LogT0Needed < IMP35597_LANDMARKS.logT0Cross,
    why: 'The a=2 poly-log threshold (~14.14) must sit strictly between the peak (~13.23) and crossover (~20.86) log-heights, per imp-35571.',
  },
  {
    id: 'imp35597-delta-at-crossover-height-near-0-254',
    holds: () => Math.abs(IMP35597_SUMMARY.deltaAtCrossoverHeight - 0.254) < 0.01,
    why: 'The power-law delta that puts the threshold exactly at the crossover height must be ~0.254, matching the imp-35571 narrative figure.',
  },
];

for (const assertion of IMP35597_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35597-threshold-collapse-viz-data assertion failed: ${assertion.id}`);
  }
}
