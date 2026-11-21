/**
 * @module imp-34496-excess-above-two-viz-data
 * @fileoverview imp-34496 -- VIZ DATA ONLY for the imp-34447 coupling-ratio drift turnover,
 *   framed in ABSOLUTE excess-above-2 units (not the imp-34456 relative percent-drift framing).
 *
 *   imp-34447 measured the coupling ratio residual/(E_flow/E_trunc) at four closed-form
 *   crossover landmarks (thr = 0.5, 0.1, 0.01, 0.001). The excess above the leading value 2 is
 *   {0.089015, 0.078776, 0.066432, 0.057639}, and the ABSOLUTE per-step drops of that excess
 *   are {0.010239, 0.012344, 0.008793} -- unequal, rising to a mild peak at the far-tail to
 *   deep-tail step then TURNING OVER: the deepest interval drop (8.79e-3) is the SMALLEST of
 *   the three, mirroring the imp-34447/imp-34456 relative-percent turnover in absolute terms.
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34447 module's
 *   IMP34447_COUPLING_RATIO and IMP34447_DRIFT_INTERVALS (excess_above_two / excess_drop fields;
 *   direct re-statement, not re-derived here). This module does NOT import
 *   lambda-rh-height-mapping.js or polymath15-constant-C-C.js -- no fresh computation, per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34447-coupling-ratio-drift-third-interval.js (source measurement: four-landmark ladder + drift)
 *   @see imp-34456-coupling-ratio-drift-ladder-viz-data.js (companion viz: relative percent-drift framing)
 *
 *   Ticket: imp-34496 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED. No refereed bound is changed.
 */

// -- four-landmark excess-above-2 sequence: coupling_ratio - 2 --
export const IMP34496_EXCESS_LADDER = Object.freeze([
  Object.freeze({ landmark: 'Halving', thr: 0.5, excess_above_two: 0.089015 }),
  Object.freeze({ landmark: 'Far-tail', thr: 0.1, excess_above_two: 0.078776 }),
  Object.freeze({ landmark: 'Deep-tail', thr: 0.01, excess_above_two: 0.066432 }),
  Object.freeze({ landmark: 'Ultra-deep-tail', thr: 0.001, excess_above_two: 0.057639 }),
]);

// -- absolute per-step drops of the excess: rises to a mild peak then turns over --
export const IMP34496_EXCESS_DROPS = Object.freeze([
  Object.freeze({ step: 'Halving -> Far-tail', excess_drop: 0.010239 }),
  Object.freeze({ step: 'Far-tail -> Deep-tail', excess_drop: 0.012344 }),
  Object.freeze({ step: 'Deep-tail -> Ultra-deep-tail', excess_drop: 0.008793 }),
]);

export const IMP34496_SUMMARY = Object.freeze({
  drops_are_constant: false,
  deepest_interval_drop_is_smallest: true,
  peak_interval_is_middle_step: true,
  verdict:
    'The absolute excess-above-2 drops turn over just like the relative percent drift -- the ' +
    'deepest interval (8.79e-3) is smaller than both earlier steps, confirming the coupling ' +
    'ratio is converging toward a finite limit rather than sliding through 2 at a steady rate. ' +
    'Measurement/extrapolation only within the inherited component model, NOT a rigorous ' +
    'asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED; no refereed bound is changed' +
    '.',
});

export default Object.freeze({
  id: 'imp-34496-excess-above-two-viz-data',
  ticket: 'imp-34496',
  source: 'imp-34447-coupling-ratio-drift-third-interval.js',
  excessLadder: IMP34496_EXCESS_LADDER,
  excessDrops: IMP34496_EXCESS_DROPS,
  summary: IMP34496_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34496_ASSERTIONS = [
  {
    id: 'imp34496-four-landmarks-decreasing-thr',
    holds: () => {
      const r = IMP34496_EXCESS_LADDER;
      return r.length === 4 && r[0].thr === 0.5 && r[1].thr === 0.1 && r[2].thr === 0.01 && r[3].thr === 0.001;
    },
    why: 'The ladder must be exactly {0.5, 0.1, 0.01, 0.001} in decreasing-thr order (imp-34447).',
  },
  {
    id: 'imp34496-excess-monotone-decreasing',
    holds: () => {
      const r = IMP34496_EXCESS_LADDER;
      return (
        r[0].excess_above_two > r[1].excess_above_two &&
        r[1].excess_above_two > r[2].excess_above_two &&
        r[2].excess_above_two > r[3].excess_above_two
      );
    },
    why: 'The excess-above-2 sequence must be strictly decreasing across the four landmarks.',
  },
  {
    id: 'imp34496-drops-reproduce-ladder-differences',
    holds: () => {
      const r = IMP34496_EXCESS_LADDER;
      const d = IMP34496_EXCESS_DROPS;
      return d.every((interval, i) => Math.abs(interval.excess_drop - (r[i].excess_above_two - r[i + 1].excess_above_two)) < 1e-6);
    },
    why: 'Each baked excess_drop must exactly equal the difference of adjacent baked excess_above_two values.',
  },
  {
    id: 'imp34496-deepest-drop-is-smallest',
    holds: () => {
      const d = IMP34496_EXCESS_DROPS;
      return (
        d.length === 3 &&
        d[2].excess_drop < d[0].excess_drop &&
        d[2].excess_drop < d[1].excess_drop &&
        IMP34496_SUMMARY.deepest_interval_drop_is_smallest === true
      );
    },
    why: 'The deepest interval drop (8.79e-3) must be smaller than both earlier steps, confirming the turnover in absolute terms too.',
  },
  {
    id: 'imp34496-honesty-gate-no-qed',
    holds: () => /NO QED/.test(IMP34496_SUMMARY.verdict) && /refereed bound is changed/i.test(IMP34496_SUMMARY.verdict) && /UNTOUCHED/.test(IMP34496_SUMMARY.verdict),
    why: 'Honesty gate: measurement/extrapolation only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34496_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34496-excess-above-two-viz-data assertion failed: ${assertion.id}`);
  }
}
