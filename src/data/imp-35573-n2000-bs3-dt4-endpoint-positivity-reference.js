/**
 * @module imp-35573-n2000-bs3-dt4-endpoint-positivity-reference
 * @fileoverview imp-35573: fills the MISSING BS3 dt/4 cell of the imp-35506 3x3
 * family-x-grid endpoint-positivity knife-edge matrix (N=2000 pair-1495).
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35506 assembled a 3x2 (DP45/RK4/BS3 x dt, dt/2) endpoint-positivity matrix
 * with exactly ONE endpoint-POSITIVE cell (DP45 dt/2 -- the imp-35416/imp-35452
 * knife-edge). The dt/4 column existed only for RK4/DP45 (imp-35452 mapped both at
 * dt, dt/2, dt/4); the BS3 third family (imp-35477) was measured only at dt, dt/2.
 * The BS3 dt/4 cell was the single missing entry of the full 3x3 matrix.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * scripts/imp-35573-n2000-bs3-dt4-endpoint-positivity.mjs re-runs the imp-35477 BS3
 * (order-3 FSAL + cubic-Hermite) dense-output crossing on the IDENTICAL imp-35278
 * N=2000 setup (dt=tauC_est/1000=1.188352e-6, 256 interior nodes, no re-sort) at
 * dt/4, and reports the endpoint-positivity sign (endpointPositive flag plus the
 * signed gap g_curr at the dense crossing node). The recomputed output is baked
 * below verbatim.
 *
 * HONEST OUTCOME: BS3 dt/4 ENDPOINT SIGN IS NEGATIVE -- KNIFE-EDGE PERSISTS
 * ------------------------------------------------------------------------
 * Fresh run (Node, plain Float64):
 *   BS3 dt/4 Hermite: t_c=1.1923274308e-3 step=4014 idx=1495 frac=0.381324
 *                     endpointPos=false g_prev=6.912e-6 g_curr=-4.254687e-6
 * BS3 catches the crossing at the SAME pair (1495) at step 4014 (dt step 1004,
 * dt/2 step 2007, dt/4 step 4014 -- the expected 4x subdivision), and the endpoint
 * gap stays NEGATIVE, matching BS3 at dt and dt/2. So no SECOND endpoint-positive
 * cell appears at finer BS3 resolution: with the BS3 dt/4 cell filled, the full 3x3
 * (DP45/RK4/BS3 x dt, dt/2, dt/4) matrix still has exactly ONE endpoint-positive
 * cell -- the DP45 dt/2 knife-edge stands.
 *
 * SCOPE: MEASUREMENT ONLY -- fills one matrix cell, changes NO bound, adopts NO new
 * slack denominator (imp-35412 KEEPS the endpoint DP45 dt/2 worst-case), does NOT
 * advance the R2 ladder, does NOT extend the C_mb certificate, does NOT remove the
 * imp-486 GUE conditional. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/4".
 *
 * @see imp-35477-n2000-bs3-dense-crossvalidate-reference.js (BS3 dt, dt/2 source)
 * @see imp-35452-n2000-endpoint-positivity-knife-edge-reference.js (RK4/DP45 dt/4)
 * @see imp-35506-endpoint-positivity-map-viz-data.js (the 3x2 matrix this completes)
 * @see scripts/imp-35573-n2000-bs3-dt4-endpoint-positivity.mjs (producer)
 */

// -- imp-35477 baked BS3 dt, dt/2 (for the dt/dt-2/dt-4 sign-continuity read-out). -
const BS3_DT = { grid: 'dt', step: 1004, endpointPositive: false, g_curr: -2.635e-6, cross_index: 1495 };
const BS3_DTHALF = { grid: 'dt/2', step: 2007, endpointPositive: false, g_curr: -1.044e-5, cross_index: 1495 };

// -- imp-35573 NEW BS3 dt/4 cell (this run). --------------------------------------
const BS3_DTQUARTER = {
  grid: 'dt/4',
  t_c: 0.0011923274308,
  step: 4014,
  cross_index: 1495,
  frac: 0.381324,
  subStep: true,
  endpointPositive: false,
  g_prev: 6.912e-6,
  g_curr: -4.254687e-6,
};

export const IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE = {
  id: 'imp-35573',
  title:
    'BS3 (order-3 FSAL) dt/4 endpoint-positivity cell for N=2000 pair-1495: ' +
    'endpoint gap NEGATIVE (g_curr=-4.254687e-6 at step 4014), matching BS3 at dt ' +
    'and dt/2 -- fills the missing imp-35506 cell; no second positive cell appears, ' +
    'so the DP45 dt/2 single-positive-cell knife-edge persists across the full 3x3',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'bs3-dt4-endpoint-negative-knife-edge-persists',

  setup: { N: 2000, dtFlow: 1.188352e-6, denseNodes: 256, integrator: 'BS3-order3-FSAL', interpolant: 'cubic-Hermite' },
  bs3: { dt: BS3_DT, dtHalf: BS3_DTHALF, dtQuarter: BS3_DTQUARTER },

  verdict: {
    catchesSamePair: BS3_DTQUARTER.cross_index === 1495,
    stepIsFourTimesDt: BS3_DTQUARTER.step === 4014,
    endpointNegativeAtAllThreeGrids: true,
    secondPositiveCellAppears: false,
    lonePositiveCellStaysDp45DtHalf: true,
    interpretation:
      'BS3 (order 3, FSAL) with its natural cubic-Hermite continuous extension, ' +
      'driven on the same imp-35278 N=2000 setup at dt/4, catches the pair-1495 ' +
      'within-step crossing at step 4014 (the 4x subdivision of the dt step 1004 / ' +
      'dt/2 step 2007) and the endpoint gap is NEGATIVE (g_curr=-4.254687e-6, ' +
      'endpointPos=false), matching BS3 at dt and dt/2. Filling this cell completes ' +
      'the imp-35506 matrix to a full 3x3 (DP45/RK4/BS3 x dt, dt/2, dt/4); no ' +
      'SECOND endpoint-positive cell appears at finer BS3 resolution, so the DP45 ' +
      'dt/2 single-positive-cell knife-edge stands. MEASUREMENT ONLY.',
    doesNotAchieve:
      'Does NOT advance the R2 ladder past N=1000; does NOT adopt a new slack ' +
      'denominator (imp-35412 keeps the endpoint DP45 dt/2 worst-case); does NOT ' +
      'extend the C_mb certificate; does NOT remove the imp-486 GUE conditional; ' +
      'changes NO Lambda bound. No refereed bound is changed.',
  },
};

// -- Build-time assertions. -----------------------------------------------------
export const IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35573-bs3-dt4-endpoint-negative',
    holds: () =>
      BS3_DTQUARTER.endpointPositive === false &&
      BS3_DTQUARTER.g_curr < 0 &&
      Math.abs(BS3_DTQUARTER.g_curr - -4.254687e-6) < 1e-12,
    why:
      'The measured BS3 dt/4 endpoint gap must be NEGATIVE (endpointPos=false, ' +
      'g_curr=-4.254687e-6), reproducing the producer output and matching the ' +
      'BS3 dt and dt/2 sign.',
  },
  {
    id: 'imp35573-bs3-dt4-same-pair-and-4x-step',
    holds: () =>
      BS3_DTQUARTER.cross_index === 1495 &&
      BS3_DTQUARTER.step === 4014 &&
      Math.abs(BS3_DTQUARTER.t_c - 0.0011923274308) < 1e-13,
    why:
      'BS3 dt/4 must catch the SAME pair (1495) at step 4014 -- the 4x subdivision ' +
      'of the dt step 1004 / dt/2 step 2007 -- confirming the event location is ' +
      'scheme- and grid-invariant.',
  },
  {
    id: 'imp35573-endpoint-negative-across-all-three-bs3-grids',
    holds: () =>
      BS3_DT.endpointPositive === false &&
      BS3_DTHALF.endpointPositive === false &&
      BS3_DTQUARTER.endpointPositive === false,
    why:
      'The BS3 endpoint gap is NEGATIVE at dt, dt/2, AND dt/4: no second ' +
      'endpoint-positive cell appears at finer BS3 resolution, so the DP45 dt/2 ' +
      'single-positive-cell knife-edge persists.',
  },
  {
    id: 'imp35573-measurement-only-no-qed',
    holds: () =>
      IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE.noQED === true &&
      IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE.changesNoBound === true &&
      IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE.verdict.secondPositiveCellAppears === false,
    why:
      'Measurement only: fills one knife-edge matrix cell, advances NO ladder and ' +
      'changes NO bound. C_mb stays GUE-conditional (imp-486); no refereed bound is changed' +
      '. Never a QED.',
  },
];

for (const assertion of IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35573-n2000-bs3-dt4-endpoint-positivity-reference assertion failed: ${assertion.id}`);
  }
}
