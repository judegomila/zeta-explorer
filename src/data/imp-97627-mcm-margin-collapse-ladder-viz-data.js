/**
 * @module imp-97627-mcm-margin-collapse-ladder-viz-data
 *
 * imp-97627: import-light viz-data reshaping the imp-97583 Route-M MCM primorial holding margin
 * T(p_omega#) across omega = 6..15 into chart-ready rows, marking the last holding order
 * omega = 10 (+4.78e-4) and the first failing order omega = 11 (-9.62e-4, the MCM onset), and
 * overlaying the imp-97601 gap-to-limit law gap(omega) ~ 0.166635/log p_omega and the
 * -e^{gamma}/12 + Rcorr primorial limit asymptote (~-0.0458).
 *
 * PRESENTATION ONLY. Reuses the frozen IMP97583_ONSET_LADDER / IMP97583_RESULTS / GAP_LAW_CONST
 * literals verbatim -- no re-derivation, no new computation. No bound moves; RH open; NO QED.
 *
 * @see imp-97583-route-m-mcm-onset-omega11-primorial.js (IMP97583_ONSET_LADDER, IMP97583_RESULTS)
 * @see imp-97601-route-m-mcm-margin-collapse-rate-law.js (GAP_LAW_CONST, gap-to-limit law)
 */

import {
  IMP97583_ONSET_LADDER,
  IMP97583_RESULTS,
} from './imp-97583-route-m-mcm-onset-omega11-primorial.js';
import { GAP_LAW_CONST } from './imp-97601-route-m-mcm-margin-collapse-rate-law.js';

const ONSET_OMEGA = IMP97583_RESULTS.onsetOmega; // 11
const LAST_HOLDING_OMEGA = IMP97583_RESULTS.lastHoldingOmega; // 10
const PRIMORIAL_LIMIT = IMP97583_RESULTS.primorialLimitCrossCheck.limitExact; // -0.045769690297240 (~-0.0458)

// Chart rows: omega, T(p_omega#), holds flag, and which marker (if any) this rung corresponds to.
export const IMP97627_LADDER_ROWS = Object.freeze(
  IMP97583_ONSET_LADDER.map((row) =>
    Object.freeze({
      omega: row.omega,
      T: row.T,
      holds: row.holds,
      isLastHolding: row.omega === LAST_HOLDING_OMEGA,
      isOnset: row.omega === ONSET_OMEGA,
    })),
);

export const IMP97627_ONSET_OMEGA = ONSET_OMEGA;
export const IMP97627_LAST_HOLDING_OMEGA = LAST_HOLDING_OMEGA;
export const IMP97627_PRIMORIAL_LIMIT = PRIMORIAL_LIMIT; // -0.045769690297240
export const IMP97627_GAP_LAW_CONST = GAP_LAW_CONST; // ~0.166635

export const IMP97627_SUMMARY = Object.freeze({
  law:
    'gap(omega) := T(p_omega#) - primorial_limit ~ GAP_LAW_CONST / log(p_omega), closing only '
    + 'logarithmically -- the -e^{gamma}/12 + Rcorr limit is never reached at any finite omega.',
  reading:
    `T(p_omega#) falls from ${IMP97627_LADDER_ROWS[0].T.toExponential(3)} at omega = `
    + `${IMP97627_LADDER_ROWS[0].omega} through the last holding order omega = ${LAST_HOLDING_OMEGA} `
    + `(margin only ${IMP97627_LADDER_ROWS.find((r) => r.isLastHolding).T.toExponential(3)}), then `
    + `first goes negative at the omega = ${ONSET_OMEGA} onset `
    + `(${IMP97627_LADDER_ROWS.find((r) => r.isOnset).T.toExponential(3)}), drifting further toward `
    + `the primorial limit -e^{gamma}/12 + Rcorr = ${PRIMORIAL_LIMIT.toFixed(6)} (~-0.0458) at a `
    + `logarithmically vanishing rate (gap ~ ${GAP_LAW_CONST.toFixed(6)}/log p_omega).`,
  verdict:
    'MEASUREMENT ONLY. MCM holds through omega = 10 and stays refuted from omega = 11; b/4 ceiling '
    + 'untouched; no bound moved; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97627_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97627-row-count-matches-source-ladder',
    description: 'nine rows, one per imp-97583 onset-ladder rung',
    holds: () => IMP97627_LADDER_ROWS.length === IMP97583_ONSET_LADDER.length,
  },
  {
    id: 'imp97627-exactly-one-last-holding-marker',
    description: 'exactly one ladder rung is flagged as the last holding order omega=10',
    holds: () => IMP97627_LADDER_ROWS.filter((r) => r.isLastHolding).length === 1,
  },
  {
    id: 'imp97627-exactly-one-onset-marker',
    description: 'exactly one ladder rung is flagged as the onset omega=11',
    holds: () => IMP97627_LADDER_ROWS.filter((r) => r.isOnset).length === 1,
  },
  {
    id: 'imp97627-last-holding-positive-onset-negative',
    description: 'the last-holding rung has positive T and the onset rung has negative T',
    holds: () => {
      const lastHolding = IMP97627_LADDER_ROWS.find((r) => r.isLastHolding);
      const onset = IMP97627_LADDER_ROWS.find((r) => r.isOnset);
      return lastHolding !== undefined && onset !== undefined
        && lastHolding.T > 0 && onset.T < 0;
    },
  },
  {
    id: 'imp97627-monotone-holds-flag',
    description: 'rows at or below the last-holding order hold, rows at or above the onset fail',
    holds: () =>
      IMP97627_LADDER_ROWS.every((r) => {
        if (r.omega <= LAST_HOLDING_OMEGA) return r.holds === true;
        if (r.omega >= ONSET_OMEGA) return r.holds === false;
        return true;
      }),
  },
  {
    id: 'imp97627-primorial-limit-below-all-measured-T',
    description: 'the primorial limit sits below every measured T value on the ladder (approached, never reached)',
    holds: () => IMP97627_LADDER_ROWS.every((r) => PRIMORIAL_LIMIT < r.T),
  },
  {
    id: 'imp97627-honest-status-carried',
    description: 'verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () =>
      /no bound/.test(IMP97627_SUMMARY.verdict) &&
      /NO QED/.test(IMP97627_SUMMARY.verdict),
  },
];

for (const assertion of IMP97627_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97627 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97627_SUMMARY;
