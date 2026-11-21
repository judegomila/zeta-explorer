/**
 * @module imp-124858-bisection-tol-roundoff-sweep-viz-data
 *
 * imp-124858: import-light viz-data leaf charting the imp-124810 bisection-tolerance sweep --
 * the round-off floor R(TOL) falling ~one decade per decade of TOL then saturating at
 * R_inf ~ 4.46e-13 for TOL <= ~1e-15, with the induced sigma_crit(TOL) overlay converging to
 * ~1.27e-2, strictly between the L6 (0.005) and L5 (0.02) ladder rungs. Reuses
 * IMP124810_BISECTION_TOL_ROUNDOFF_FLOOR_SWEEP verbatim (no re-derivation, no new computation).
 *
 * PRESENTATION ONLY. No new computation; conditional-share diagnostic; changes no bound; RH
 * open; NO QED.
 *
 * @see imp-124810-bisection-tol-roundoff-floor-sweep.js (the TOL sweep and R_inf/sigma_crit pins charted here)
 */

import { IMP124810_BISECTION_TOL_ROUNDOFF_FLOOR_SWEEP } from './imp-124810-bisection-tol-roundoff-floor-sweep.js';

const { sweep, machineFloor, verdict } = IMP124810_BISECTION_TOL_ROUNDOFF_FLOOR_SWEEP;

// One row per swept TOL, ordered loosest -> tightest (TOL = 0 = machine-limit rendered last).
export const IMP124858_TOL_SWEEP_ROWS = Object.freeze(
  sweep.map((s) => Object.freeze({
    tolLabel: s.tol === 0 ? 'machine-limit' : s.tol.toExponential(0),
    tol: s.tol,
    R: s.R,
    sigmaCrit: s.sigma_crit,
    isSaturated: s.tol === 0 || s.tol <= 1e-15,
  })),
);

export const IMP124858_SUMMARY = Object.freeze({
  reading:
    `R(TOL) falls ~one decade per decade of TOL while tolerance-limited, then saturates at ` +
    `R_inf = ${machineFloor.R_inf} once TOL <= ~1e-15 (identical to the TOL = 0 machine-limit solve). ` +
    `The induced sigma_crit(TOL) overlay converges to ${machineFloor.sigma_crit}, strictly between the ` +
    'L6 (0.005) and L5 (0.02) ladder rungs -- the floor is double-precision-limited, not bisection-limited.',
  R_inf: machineFloor.R_inf,
  sigmaCritSaturated: machineFloor.sigma_crit,
  L5: 0.02,
  L6: 0.005,
  verdict,
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124858_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124858-rows-match-sweep-length',
    description: 'one chart row per swept TOL rung',
    holds: () => IMP124858_TOL_SWEEP_ROWS.length === sweep.length,
  },
  {
    id: 'imp124858-rows-finite-positive',
    description: 'every row has finite positive R and sigmaCrit',
    holds: () =>
      IMP124858_TOL_SWEEP_ROWS.every(
        (r) => Number.isFinite(r.R) && r.R > 0 && Number.isFinite(r.sigmaCrit) && r.sigmaCrit > 0,
      ),
  },
  {
    id: 'imp124858-saturated-rows-equal-R-inf',
    description: 'every row flagged isSaturated has R equal to the machine-limit R_inf',
    holds: () =>
      IMP124858_TOL_SWEEP_ROWS.filter((r) => r.isSaturated).every((r) => r.R === machineFloor.R_inf),
  },
  {
    id: 'imp124858-sigma-crit-band',
    description: 'the saturated sigma_crit lies strictly between L6 (0.005) and L5 (0.02)',
    holds: () =>
      IMP124858_SUMMARY.sigmaCritSaturated > IMP124858_SUMMARY.L6 &&
      IMP124858_SUMMARY.sigmaCritSaturated < IMP124858_SUMMARY.L5,
  },
  {
    id: 'imp124858-values-match-source-verbatim',
    description: 'R_inf and sigma_crit are reused verbatim from imp-124810',
    holds: () =>
      IMP124858_SUMMARY.R_inf === machineFloor.R_inf &&
      IMP124858_SUMMARY.sigmaCritSaturated === machineFloor.sigma_crit,
  },
  {
    id: 'imp124858-honesty-gate-no-qed',
    description: 'restated verdict carries the no-QED markers',
    holds: () => /NO QED/.test(IMP124858_SUMMARY.verdict) && /refereed bound is changed/i.test(IMP124858_SUMMARY.verdict),
  },
];

for (const assertion of IMP124858_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124858 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}
