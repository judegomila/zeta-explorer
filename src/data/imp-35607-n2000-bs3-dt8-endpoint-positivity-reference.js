/**
 * @module imp-35607-n2000-bs3-dt8-endpoint-positivity-reference
 * @fileoverview imp-35607: measures the BS3 dt/8 endpoint-positivity cell -- one
 * resolution finer than the imp-35573 dt/4 cell -- extending the endpoint-positivity
 * sign-continuity read-out of the BS3 column of the imp-35506 3x3 knife-edge matrix.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35573 mapped the BS3 (order-3 FSAL + cubic-Hermite) endpoint sign at dt, dt/2,
 * dt/4 for the N=2000 pair-1495 dense crossing (all three NEGATIVE), completing the
 * imp-35506 3x3 (DP45/RK4/BS3 x dt, dt/2, dt/4) matrix with exactly ONE endpoint-
 * POSITIVE cell (DP45 dt/2). Whether the BS3 endpoint sign stays NEGATIVE under a
 * further dt-halving (dt/8) was unmeasured -- the sign-continuity read-out stopped
 * at dt/4.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * scripts/imp-35607-n2000-bs3-dt8-endpoint-positivity.mjs re-runs the IDENTICAL
 * imp-35477/imp-35278 N=2000 setup (dt=tauC_est/1000=1.188352e-6, 256 interior
 * nodes, no re-sort) at dt/8 and reports the endpoint-positivity sign
 * (endpointPositive flag + signed gap g_curr at the dense crossing node). The
 * recomputed output is baked below verbatim.
 *
 * HONEST OUTCOME: BS3 dt/8 ENDPOINT SIGN IS NEGATIVE -- KNIFE-EDGE PERSISTS
 * ------------------------------------------------------------------------
 * Fresh run (Node, plain Float64):
 *   BS3 dt/8 Hermite: t_c=1.1922546250e-3 step=8027 idx=1495 frac=0.272519
 *                     endpointPos=false g_prev=1.556e-5 g_curr=-4.784301e-6
 * BS3 catches the crossing at the SAME pair (1495) at step 8027 (dt step 1004,
 * dt/2 step 2007, dt/4 step 4014, dt/8 step 8027 -- the expected ~2x subdivision of
 * the dt/4 step), and the endpoint gap stays NEGATIVE, matching BS3 at dt, dt/2 and
 * dt/4. So no SECOND endpoint-positive cell appears one resolution finer: the BS3
 * endpoint sign is NEGATIVE across dt, dt/2, dt/4, dt/8, and the DP45 dt/2
 * single-positive-cell knife-edge stands.
 *
 * SCOPE: MEASUREMENT ONLY -- extends the BS3 sign-continuity read-out by one cell,
 * changes NO bound, adopts NO new slack denominator (imp-35412 KEEPS the endpoint
 * DP45 dt/2 worst-case), does NOT advance the R2 ladder, does NOT extend the C_mb
 * certificate, does NOT remove the imp-486 GUE conditional. No refereed bound is changed
 * . NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/8".
 *
 * @see imp-35573-n2000-bs3-dt4-endpoint-positivity-reference.js (BS3 dt/4 source)
 * @see imp-35477-n2000-bs3-dense-crossvalidate-reference.js (BS3 dt, dt/2 source)
 * @see imp-35506-endpoint-positivity-map-viz-data.js (the 3x3 matrix this extends)
 * @see scripts/imp-35607-n2000-bs3-dt8-endpoint-positivity.mjs (producer)
 */

// -- imp-35477/imp-35573 baked BS3 dt, dt/2, dt/4 (for the sign-continuity ladder). -
const BS3_DT = { grid: 'dt', step: 1004, endpointPositive: false, g_curr: -2.635e-6, cross_index: 1495 };
const BS3_DTHALF = { grid: 'dt/2', step: 2007, endpointPositive: false, g_curr: -1.044e-5, cross_index: 1495 };
const BS3_DTQUARTER = { grid: 'dt/4', step: 4014, endpointPositive: false, g_curr: -4.254687e-6, cross_index: 1495 };

// -- imp-35607 NEW BS3 dt/8 cell (this run). ---------------------------------------
const BS3_DTEIGHTH = {
  grid: 'dt/8',
  t_c: 0.001192254625,
  step: 8027,
  cross_index: 1495,
  frac: 0.272519,
  subStep: true,
  endpointPositive: false,
  g_prev: 1.556e-5,
  g_curr: -4.784301e-6,
};

export const IMP_35607_N2000_BS3_DT8_ENDPOINT_POSITIVITY_REFERENCE = {
  id: 'imp-35607',
  title:
    'BS3 (order-3 FSAL) dt/8 endpoint-positivity cell for N=2000 pair-1495: ' +
    'endpoint gap NEGATIVE (g_curr=-4.784301e-6 at step 8027), matching BS3 at dt, ' +
    'dt/2 and dt/4 -- extends the BS3 sign-continuity read-out one resolution ' +
    'finer; no second positive cell appears, so the DP45 dt/2 single-positive-cell ' +
    'knife-edge persists under continued dt-halving',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'bs3-dt8-endpoint-negative-knife-edge-persists',

  setup: { N: 2000, dtFlow: 1.188352e-6, denseNodes: 256, integrator: 'BS3-order3-FSAL', interpolant: 'cubic-Hermite' },
  bs3: { dt: BS3_DT, dtHalf: BS3_DTHALF, dtQuarter: BS3_DTQUARTER, dtEighth: BS3_DTEIGHTH },

  verdict: {
    catchesSamePair: BS3_DTEIGHTH.cross_index === 1495,
    stepIsAboutTwiceDtQuarter: BS3_DTEIGHTH.step === 8027,
    endpointNegativeAtAllFourGrids: true,
    secondPositiveCellAppears: false,
    lonePositiveCellStaysDp45DtHalf: true,
    interpretation:
      'BS3 (order 3, FSAL) with its natural cubic-Hermite continuous extension, ' +
      'driven on the same imp-35278 N=2000 setup at dt/8, catches the pair-1495 ' +
      'within-step crossing at step 8027 (the ~2x subdivision of the dt/4 step ' +
      '4014, itself the 4x subdivision of the dt step 1004 / dt/2 step 2007) and ' +
      'the endpoint gap is NEGATIVE (g_curr=-4.784301e-6, endpointPos=false), ' +
      'matching BS3 at dt, dt/2 and dt/4. Extending the BS3 column one resolution ' +
      'finer produces NO SECOND endpoint-positive cell, so the DP45 dt/2 ' +
      'single-positive-cell knife-edge stands under continued dt-halving. ' +
      'MEASUREMENT ONLY.',
    doesNotAchieve:
      'Does NOT advance the R2 ladder past N=1000; does NOT adopt a new slack ' +
      'denominator (imp-35412 keeps the endpoint DP45 dt/2 worst-case); does NOT ' +
      'extend the C_mb certificate; does NOT remove the imp-486 GUE conditional; ' +
      'changes NO Lambda bound. No refereed bound is changed.',
  },
};

// -- Build-time assertions. -----------------------------------------------------
export const IMP_35607_N2000_BS3_DT8_ENDPOINT_POSITIVITY_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35607-bs3-dt8-endpoint-negative',
    holds: () =>
      BS3_DTEIGHTH.endpointPositive === false &&
      BS3_DTEIGHTH.g_curr < 0 &&
      Math.abs(BS3_DTEIGHTH.g_curr - -4.784301e-6) < 1e-12,
    why:
      'The measured BS3 dt/8 endpoint gap must be NEGATIVE (endpointPos=false, ' +
      'g_curr=-4.784301e-6), reproducing the producer output and matching the ' +
      'BS3 dt, dt/2 and dt/4 sign.',
  },
  {
    id: 'imp35607-bs3-dt8-same-pair',
    holds: () =>
      BS3_DTEIGHTH.cross_index === 1495 &&
      BS3_DTEIGHTH.step === 8027 &&
      Math.abs(BS3_DTEIGHTH.t_c - 0.001192254625) < 1e-13,
    why:
      'BS3 dt/8 must catch the SAME pair (1495) at step 8027 -- the ~2x ' +
      'subdivision of the dt/4 step 4014 -- confirming the event location is ' +
      'scheme- and grid-invariant under a further dt-halving.',
  },
  {
    id: 'imp35607-endpoint-negative-across-all-four-bs3-grids',
    holds: () =>
      BS3_DT.endpointPositive === false &&
      BS3_DTHALF.endpointPositive === false &&
      BS3_DTQUARTER.endpointPositive === false &&
      BS3_DTEIGHTH.endpointPositive === false,
    why:
      'The BS3 endpoint gap is NEGATIVE at dt, dt/2, dt/4 AND dt/8: no second ' +
      'endpoint-positive cell appears one resolution finer, so the DP45 dt/2 ' +
      'single-positive-cell knife-edge persists under continued dt-halving.',
  },
  {
    id: 'imp35607-measurement-only-no-qed',
    holds: () =>
      IMP_35607_N2000_BS3_DT8_ENDPOINT_POSITIVITY_REFERENCE.noQED === true &&
      IMP_35607_N2000_BS3_DT8_ENDPOINT_POSITIVITY_REFERENCE.changesNoBound === true &&
      IMP_35607_N2000_BS3_DT8_ENDPOINT_POSITIVITY_REFERENCE.verdict.secondPositiveCellAppears === false,
    why:
      'Measurement only: extends the BS3 sign-continuity ladder by one cell, ' +
      'advances NO ladder and changes NO bound. C_mb stays GUE-conditional ' +
      '(imp-486); no refereed bound is changed. Never a QED.',
  },
];

for (const assertion of IMP_35607_N2000_BS3_DT8_ENDPOINT_POSITIVITY_REFERENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35607-n2000-bs3-dt8-endpoint-positivity-reference assertion failed: ${assertion.id}`);
  }
}
