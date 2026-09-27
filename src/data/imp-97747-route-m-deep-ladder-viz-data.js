/**
 * @module imp-97747-route-m-deep-ladder-viz-data
 *
 * imp-97747: import-light viz-data leaf charting the imp-97722 23-rung Route M gap-law
 * residual ladder log|residual| vs log(log p), with the 8 sign-change (RISE) rungs
 * highlighted and the endpoint / Theil-Sen / OLS slope estimates overlaid. Reuses
 * IMP97722_LADDER and its derived exponents verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; MCM stays refuted from omega=11; RH open; NO QED.
 *
 * @see imp-97722-route-m-deep-ladder-independent-crosscheck.js (ladder, rise indices, exponents)
 */

import {
  IMP97722_LADDER,
  IMP97722_RISE_INDICES,
  IMP97722_ENDPOINT_EXPONENT,
  IMP97722_THEIL_SEN,
  IMP97722_OLS_RECOMPUTE,
  IMP97722_HONEST_BANNER,
} from './imp-97722-route-m-deep-ladder-independent-crosscheck.js';

const RISE_SET = new Set(IMP97722_RISE_INDICES);

// One row per ladder rung: the log-log axes plus a rise flag for the chart/table.
export const IMP97747_LADDER_ROWS = Object.freeze(
  IMP97722_LADDER.map((r, i) =>
    Object.freeze({
      index: i,
      pOmega: r.pOmega,
      residual: r.residual,
      logLogP: Math.log(Math.log(r.pOmega)),
      logAbsResidual: Math.log(Math.abs(r.residual)),
      isRise: RISE_SET.has(i),
    })
  )
);

export const IMP97747_RISE_COUNT = IMP97747_LADDER_ROWS.filter((r) => r.isRise).length;

export const IMP97747_SLOPES = Object.freeze({
  endpoint: IMP97722_ENDPOINT_EXPONENT,
  theilSen: IMP97722_THEIL_SEN.median,
  ols: IMP97722_OLS_RECOMPUTE,
});

const FIRST_ROW = IMP97747_LADDER_ROWS[0];
const LAST_ROW = IMP97747_LADDER_ROWS[IMP97747_LADDER_ROWS.length - 1];

export const IMP97747_SUMMARY = Object.freeze({
  reading:
    `The imp-97722 23-rung ladder (p from ${FIRST_ROW.pOmega.toLocaleString()} to ` +
    `${LAST_ROW.pOmega.toLocaleString()}) has log|residual| decaying against log(log p) with ` +
    `8 sign-change (RISE) rungs at ladder indices ${IMP97722_RISE_INDICES.join(', ')}. The three ` +
    `independent slope estimators -- endpoint ${IMP97747_SLOPES.endpoint.toFixed(2)}, Theil-Sen ` +
    `${IMP97747_SLOPES.theilSen.toFixed(2)}, OLS ${IMP97747_SLOPES.ols.toFixed(2)} -- agree within ` +
    `the oscillation noise and all far exceed the power-3 threshold.`,
  verdict:
    'Presentation only: every ladder value, rise index, and slope estimate is reused verbatim ' +
    'from imp-97722 (an independent cross-check, not a new computation). MCM stays refuted from ' +
    'omega=11; no bound moved; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
  banner: IMP97722_HONEST_BANNER,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97747_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97747-twentythree-rows',
    description: 'exactly 23 baked ladder rows',
    holds: () => IMP97747_LADDER_ROWS.length === 23,
  },
  {
    id: 'imp97747-eight-rise-rungs-match-source',
    description: 'exactly 8 rows flagged isRise, matching the imp-97722 rise indices',
    holds: () =>
      IMP97747_RISE_COUNT === 8 &&
      IMP97747_LADDER_ROWS.filter((r) => r.isRise).map((r) => r.index).join(',') ===
        IMP97722_RISE_INDICES.join(','),
  },
  {
    id: 'imp97747-slopes-exceed-power-three',
    description: 'all three slope overlays far exceed 3',
    holds: () =>
      IMP97747_SLOPES.endpoint > 3 && IMP97747_SLOPES.theilSen > 3 && IMP97747_SLOPES.ols > 3,
  },
  {
    id: 'imp97747-loglog-axis-monotonic-in-height',
    description: 'the log(log p) x-axis is strictly increasing with ladder height',
    holds: () => {
      for (let i = 1; i < IMP97747_LADDER_ROWS.length; i++) {
        if (!(IMP97747_LADDER_ROWS[i].logLogP > IMP97747_LADDER_ROWS[i - 1].logLogP)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97747-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97747_SUMMARY.verdict) && /NO QED/.test(IMP97747_SUMMARY.verdict),
  },
];

for (const assertion of IMP97747_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97747 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97747_SUMMARY;
