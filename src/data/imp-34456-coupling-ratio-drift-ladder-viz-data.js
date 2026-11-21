/**
 * @module imp-34456-coupling-ratio-drift-ladder-viz-data
 * @fileoverview imp-34456 -- VIZ DATA ONLY for the imp-34372/imp-34447 coupling ratio
 *   residual/(E_flow/E_trunc) landmark ladder.
 *
 *   imp-34372 measured the coupling ratio residual/(E_flow/E_trunc) at three closed-form
 *   crossover landmarks (thr = 0.5, 0.1, 0.01) and found it pinned near the leading value 2
 *   (N proportional to E_coll^-2), drifting monotonically DOWN by a small amount per landmark.
 *   imp-34447 added a FOURTH, deeper landmark (thr = 0.001) supplying a THIRD drift interval,
 *   which resolved whether that drift is constant-rate or decaying: the per-landmark-step
 *   drift is {0.4901%, 0.5938%, 0.4255%} -- unequal, rising to a mild peak then TURNING OVER --
 *   so the ratio is CONVERGING toward a finite limit near 2 (~2.05), not sliding through it.
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34447 module's
 *   IMP34447_COUPLING_RATIO and IMP34447_DRIFT_INTERVALS fields (direct re-statement, not
 *   re-derived here). This module does NOT import lambda-rh-height-mapping.js or
 *   polymath15-constant-C-C.js -- no fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34447-coupling-ratio-drift-third-interval.js (source measurement: four-landmark ladder + drift)
 *   @see imp-34372-lockstep-ratio-deeptail-persistence.js (three-landmark lockstep; states the two-interval gap)
 *
 *   Ticket: imp-34456 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED. No refereed bound is changed.
 */

// -- four-landmark coupling-ratio ladder: residual/(E_flow/E_trunc), pinned near leading value 2 --
export const IMP34456_LADDER = Object.freeze([
  Object.freeze({ landmark: 'Halving', thr: 0.5, coupling_ratio: 2.089015, excess_above_two: 0.089015 }),
  Object.freeze({ landmark: 'Far-tail', thr: 0.1, coupling_ratio: 2.078776, excess_above_two: 0.078776 }),
  Object.freeze({ landmark: 'Deep-tail', thr: 0.01, coupling_ratio: 2.066432, excess_above_two: 0.066432 }),
  Object.freeze({ landmark: 'Ultra-deep-tail', thr: 0.001, coupling_ratio: 2.057639, excess_above_two: 0.057639 }),
]);

// -- per-landmark-step drift: rises to a mild peak then turns over (NOT constant-rate) --
export const IMP34456_DRIFT_INTERVALS = Object.freeze([
  Object.freeze({ step: 'Halving -> Far-tail', drift_pct: 0.4901 }),
  Object.freeze({ step: 'Far-tail -> Deep-tail', drift_pct: 0.5938 }),
  Object.freeze({ step: 'Deep-tail -> Ultra-deep-tail', drift_pct: 0.4255 }),
]);

export const IMP34456_SUMMARY = Object.freeze({
  drift_is_constant_rate: false,
  drift_decays_in_deep_tail: true,
  deepest_interval_is_smallest: true,
  coupling_ratio_converges_above_two: true,
});

export default Object.freeze({
  id: 'imp-34456-coupling-ratio-drift-ladder-viz-data',
  ticket: 'imp-34456',
  source: 'imp-34447-coupling-ratio-drift-third-interval.js',
  ladder: IMP34456_LADDER,
  driftIntervals: IMP34456_DRIFT_INTERVALS,
  summary: IMP34456_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34456_ASSERTIONS = [
  {
    id: 'imp34456-four-landmarks-decreasing-thr',
    holds: () => {
      const r = IMP34456_LADDER;
      return r.length === 4 && r[0].thr === 0.5 && r[1].thr === 0.1 && r[2].thr === 0.01 && r[3].thr === 0.001;
    },
    why: 'The ladder must be exactly {0.5, 0.1, 0.01, 0.001} in decreasing-thr order (imp-34372/imp-34447).',
  },
  {
    id: 'imp34456-ratio-pinned-near-two-monotone-down',
    holds: () => {
      const c = IMP34456_LADDER;
      return (
        c.every((r) => Math.abs(r.coupling_ratio - 2) < 0.1) &&
        c[0].coupling_ratio > c[1].coupling_ratio &&
        c[1].coupling_ratio > c[2].coupling_ratio &&
        c[2].coupling_ratio > c[3].coupling_ratio
      );
    },
    why: 'The coupling ratio must stay within ~5% of 2 at all four landmarks and drift monotonically DOWN.',
  },
  {
    id: 'imp34456-drift-turns-over-not-constant-rate',
    holds: () => {
      const d = IMP34456_DRIFT_INTERVALS;
      return (
        d.length === 3 &&
        d[2].drift_pct < d[0].drift_pct &&
        d[2].drift_pct < d[1].drift_pct &&
        IMP34456_SUMMARY.drift_is_constant_rate === false &&
        IMP34456_SUMMARY.drift_decays_in_deep_tail === true
      );
    },
    why: 'The deepest drift interval must be SMALLER than both earlier steps, confirming the drift turns over and decays rather than running at a constant rate.',
  },
];

for (const assertion of IMP34456_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34456-coupling-ratio-drift-ladder-viz-data assertion failed: ${assertion.id}`);
  }
}
