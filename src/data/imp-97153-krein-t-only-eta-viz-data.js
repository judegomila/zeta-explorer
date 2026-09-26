/**
 * @module imp-97153-krein-t-only-eta-viz-data
 * @fileoverview imp-97153 -- VIZ DATA ONLY. Bakes the imp-97120 decoupled per-Nbig T-only closed-form
 *   exponent diagnostic q = log2(d1/d2) on the geometric T ladder {800, 1600, 3200}: q=1.9358 at
 *   Nbig=120, q=0.5593 at Nbig=200, and DEGENERATE at Nbig=240 (second difference exceeds the first,
 *   d2/d1=1.3132>1, q=-0.393<0, still accelerating / pre-asymptotic). The three per-slice values fall
 *   then break down -- they do not settle toward the imp-97058 joint surface-fit exponent q~0.354,
 *   confirming that joint value is a coupled-surface averaging artifact rather than a stable T-rate.
 *   Values are copied literals from imp-97120's frozen export IMP97120_T_ONLY_FIT -- this module does
 *   NOT recompute d1, d2, or q. Pure frozen-object data, no imports, no self-executing assertions of
 *   its own, per the [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]]
 *   conventions -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-97120-krein-t-only-eta-rate-not-stable.js (the certified per-Nbig T-only fit this bakes)
 *   @see imp-97058-krein-coupled-nt-surface-fit-no-rate.js (the joint q=0.354 surface fit isolated here)
 *
 *   Ticket: imp-97153 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. Ritz values stay UPPER bounds; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

// -- baked from imp-97120 IMP97120_T_ONLY_FIT --
export const IMP97153_T_ONLY_ROWS = Object.freeze([
  Object.freeze({ Nbig: 120, d1: 0.020760, d2: 0.005426, d2_over_d1: 0.261368, q: 1.935798, converging: true }),
  Object.freeze({ Nbig: 200, d1: 0.023241, d2: 0.015772, d2_over_d1: 0.678628, q: 0.559313, converging: true }),
  Object.freeze({ Nbig: 240, d1: 0.015795, d2: 0.020742, d2_over_d1: 1.313200, q: -0.393115, converging: false }),
]);

export const IMP97153_SUMMARY = Object.freeze({
  jointQFromImp97058: 0.3542,
  perNbigTexponents: [1.935798, 0.559313, -0.393115],
  tExponentNbigStable: false,
  settlesTowardJointQ: false,
  jointQisArtifact: true,
  largestNbigLadderAccelerating: true,
});

export default Object.freeze({
  id: 'imp-97153-krein-t-only-eta-viz-data',
  ticket: 'imp-97153',
  source: 'imp-97120-krein-t-only-eta-rate-not-stable.js',
  tOnlyRows: IMP97153_T_ONLY_ROWS,
  summary: IMP97153_SUMMARY,
  intervalRigorousReach: 0.96,
});
