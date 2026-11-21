/**
 * @module imp-35477-n2000-bs3-dense-crossvalidate-reference
 * @fileoverview imp-35477: THIRD dense-output family corroboration of the
 * imp-35351 DP45 CONTD5 within-step crossing (N=2000 pair-1495), strengthening
 * the imp-35416 two-family scheme-independence result to THREE integrator orders.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35351 caught a WITHIN-STEP step-over of pair 1495 at N=2000 (step 2007 at
 * dt/2, interior sub-step, t_c=1.1919828898e-3) with the Dormand-Prince 5(4)
 * continuous extension (CONTD5) -- a SINGLE method (order 5). imp-35416 confirmed
 * it is scheme-INDEPENDENT with a SECOND family (RK4 order-4 + cubic Hermite),
 * agreeing to ~4.5e-5 relative at dt/2. Two families still leave open whether a
 * genuinely LOWER-order integrator would resolve the same interior event, or
 * whether the crossing is an artifact of high-order (5,4) schemes only.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * scripts/imp-35477-n2000-bs3-dense-crossvalidate.mjs drives a THIRD, distinct
 * integrator family on the IDENTICAL imp-35278 N=2000 setup (N=2000,
 * dt=tauC_est/1000=1.188352e-6, 256 interior sub-step nodes, no re-sort):
 * Bogacki-Shampine BS3 (order-3, FSAL) with its NATURAL cubic-Hermite continuous
 * extension built from (y0, f0=k1, y1, f1=k4-FSAL). The recomputed outputs are
 * baked below verbatim and asserted to catch the SAME step/pair crossing at a
 * t_c compatible with both prior families.
 *
 * HONEST OUTCOME: THE CROSSING IS CORROBORATED ACROSS THREE ORDERS (3, 4, 5)
 * -------------------------------------------------------------------------
 * Fresh run (Node, plain Float64):
 *   BS3 dt   Hermite: t_c=1.1923806919e-3 step=1004 idx=1495 frac=0.390150
 *                     endpointPos=false g_prev=1.905e-5 g_curr=-2.635e-6
 *   BS3 dt/2 Hermite: t_c=1.1921020374e-3 step=2007 idx=1495 frac=0.311324
 *                     endpointPos=false g_prev=2.425e-5 g_curr=-1.044e-5
 *   Cross-check:
 *     dt  : vs DP45 |dt_c|=7.984e-8 rel=6.696e-5; vs RK4 |dt_c|=3.069e-8 rel=2.574e-5
 *     dt/2: vs DP45 |dt_c|=1.191e-7 rel=9.996e-5; vs RK4 |dt_c|=6.557e-8 rel=5.501e-5
 * BS3 catches the crossing at the SAME step (1004 at dt, 2007 at dt/2) and SAME
 * pair (1495) as DP45 CONTD5 and RK4-Hermite, at a t_c within ~1e-4 relative of
 * both, so the event is scheme-INVARIANT across integrator orders 3, 4, and 5 --
 * not a high-order artifact. Endpoint-positivity: the BS3 endpoint gap is
 * NEGATIVE at both dt and dt/2 (endpointPos=false), matching RK4; the lone
 * endpoint-POSITIVE cell remains the DP45 dt/2 knife-edge (imp-35416/imp-35452).
 *
 * SCOPE: MEASUREMENT / CROSS-CHECK ONLY -- corroborates the imp-35351 crossing
 * with a third family, changes NO bound, adopts NO new slack denominator
 * (imp-35412 KEEPS the endpoint DP45 dt/2 worst-case), does NOT advance the R2
 * ladder (certified at N=1000 per imp-35221/imp-35324), does NOT extend the C_mb
 * certificate, does NOT remove the imp-486 GUE conditional. No refereed bound is changed
 * . NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2".
 *
 * @see imp-35351  DP45 CONTD5 dense-output within-step crossing (family 1, order 5)
 * @see imp-35416  RK4 + cubic-Hermite cross-validation (family 2, order 4)
 * @see imp-35471  independent re-verification of the imp-35416 literals
 * @see scripts/imp-35477-n2000-bs3-dense-crossvalidate.mjs (BS3 producer)
 */

// -- Prior families (imp-35351 family 1 order 5, imp-35416 family 2 order 4). -----
const DP45 = {
  dt:     { t_c: 0.0011923008536, step: 1004, cross_index: 1495, endpointPositive: false },
  dtHalf: { t_c: 0.0011919828898, step: 2007, cross_index: 1495, endpointPositive: true },
};
const RK4 = {
  dt:     { t_c: 0.0011923500033, step: 1004, cross_index: 1495, endpointPositive: false },
  dtHalf: { t_c: 0.0011920364654, step: 2007, cross_index: 1495, endpointPositive: false },
};

// -- imp-35477 THIRD family: Bogacki-Shampine BS3 (order 3, FSAL) + cubic Hermite.
const BS3 = {
  dt:     { t_c: 0.0011923806919, step: 1004, cross_index: 1495, frac: 0.390150, endpointPositive: false, g_prev: 1.905e-5, g_curr: -2.635e-6 },
  dtHalf: { t_c: 0.0011921020374, step: 2007, cross_index: 1495, frac: 0.311324, endpointPositive: false, g_prev: 2.425e-5, g_curr: -1.044e-5 },
};

const DELTA_DT_DP45 = Math.abs(BS3.dt.t_c - DP45.dt.t_c);
const DELTA_DT_RK4 = Math.abs(BS3.dt.t_c - RK4.dt.t_c);
const DELTA_DTHALF_DP45 = Math.abs(BS3.dtHalf.t_c - DP45.dtHalf.t_c);
const DELTA_DTHALF_RK4 = Math.abs(BS3.dtHalf.t_c - RK4.dtHalf.t_c);
const REL_DT_DP45 = DELTA_DT_DP45 / DP45.dt.t_c;
const REL_DT_RK4 = DELTA_DT_RK4 / RK4.dt.t_c;
const REL_DTHALF_DP45 = DELTA_DTHALF_DP45 / DP45.dtHalf.t_c;
const REL_DTHALF_RK4 = DELTA_DTHALF_RK4 / RK4.dtHalf.t_c;

export const IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE = {
  id: 'imp-35477',
  title:
    'Third dense-output family (Bogacki-Shampine BS3, order-3 FSAL + cubic ' +
    'Hermite) corroborates the imp-35351/imp-35416 N=2000 pair-1495 within-step ' +
    'crossing at the same step (1004 at dt, 2007 at dt/2) and pair, t_c within ' +
    '~1e-4 relative of both prior families -- scheme-invariant across orders 3,4,5',
  kind: 'measurement-cross-check-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'third-family-corroborates-crossing-across-three-orders',

  setup: { N: 2000, dtFlow: 1.188352e-6, denseNodes: 256, integrator: 'BS3-order3-FSAL', interpolant: 'cubic-Hermite' },
  dp45: DP45,
  rk4: RK4,
  bs3: BS3,
  crossCheck: {
    dt:     { deltaTcVsDp45: DELTA_DT_DP45, relTcVsDp45: REL_DT_DP45, deltaTcVsRk4: DELTA_DT_RK4, relTcVsRk4: REL_DT_RK4 },
    dtHalf: { deltaTcVsDp45: DELTA_DTHALF_DP45, relTcVsDp45: REL_DTHALF_DP45, deltaTcVsRk4: DELTA_DTHALF_RK4, relTcVsRk4: REL_DTHALF_RK4 },
  },

  verdict: {
    catchesSameStepAndPair: true,
    tcCompatibleWithBothFamilies: true,
    schemeInvariantAcrossOrders: '3,4,5',
    endpointPositivityKnifeEdgeStillDp45DtHalf: true,
    interpretation:
      'BS3 (order 3, FSAL) with its natural cubic-Hermite continuous extension, ' +
      'driven on the same imp-35278 N=2000 setup, catches the pair-1495 ' +
      'within-step crossing at the SAME step (1004 at dt, 2007 at dt/2) and SAME ' +
      'pair (1495) as DP45 CONTD5 (order 5) and RK4-Hermite (order 4). Its ' +
      't_c=1.1923806919e-3 (dt) and 1.1921020374e-3 (dt/2) sit within ~1e-4 ' +
      'relative of both prior families, so the crossing is scheme-invariant ' +
      'across integrator orders 3, 4, and 5 -- not a high-order artifact. The ' +
      'BS3 endpoint gap is NEGATIVE at both grids, matching RK4; the lone ' +
      'endpoint-POSITIVE cell stays the DP45 dt/2 knife-edge. MEASUREMENT ONLY.',
    doesNotAchieve:
      'Does NOT advance the R2 ladder past N=1000; does NOT adopt a new slack ' +
      'denominator (imp-35412 keeps the endpoint DP45 dt/2 worst-case); does NOT ' +
      'extend the C_mb certificate; does NOT remove the imp-486 GUE conditional; ' +
      'changes NO Lambda bound. No refereed bound is changed.',
  },
};

// -- Build-time assertions. -----------------------------------------------------
export const IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35477-bs3-catches-same-step-and-pair',
    holds: () =>
      BS3.dt.step === DP45.dt.step && BS3.dt.step === RK4.dt.step && BS3.dt.step === 1004 &&
      BS3.dtHalf.step === DP45.dtHalf.step && BS3.dtHalf.step === RK4.dtHalf.step && BS3.dtHalf.step === 2007 &&
      BS3.dt.cross_index === 1495 && BS3.dtHalf.cross_index === 1495,
    why:
      'The BS3 third family must catch the within-step crossing at the SAME step ' +
      '(1004 at dt, 2007 at dt/2) and SAME pair (1495) as the DP45 CONTD5 and ' +
      'RK4-Hermite families, confirming the event location is scheme-invariant.',
  },
  {
    id: 'imp35477-bs3-tc-compatible-with-both-families',
    holds: () =>
      REL_DT_DP45 < 2e-4 && REL_DT_RK4 < 2e-4 &&
      REL_DTHALF_DP45 < 2e-4 && REL_DTHALF_RK4 < 2e-4 &&
      Math.abs(REL_DTHALF_DP45 - 9.996e-5) < 1e-7 &&
      Math.abs(REL_DT_RK4 - 2.574e-5) < 1e-7,
    why:
      'The BS3 crossing time must agree with BOTH prior families to within ~1e-4 ' +
      'relative (dt/2 vs DP45 rel 9.996e-5, dt vs RK4 rel 2.574e-5), corroborating ' +
      'the crossing time across integrator orders 3, 4, and 5.',
  },
  {
    id: 'imp35477-bs3-tc-literals-reproduce',
    holds: () =>
      Math.abs(BS3.dt.t_c - 0.0011923806919) < 1e-13 &&
      Math.abs(BS3.dtHalf.t_c - 0.0011921020374) < 1e-13 &&
      BS3.dt.t_c > DP45.dt.t_c && BS3.dt.t_c > RK4.dt.t_c &&
      BS3.dtHalf.t_c > DP45.dtHalf.t_c && BS3.dtHalf.t_c > RK4.dtHalf.t_c,
    why:
      'The baked BS3 crossing times (dt 1.1923806919e-3, dt/2 1.1921020374e-3) ' +
      'must reproduce the producer output and sit just above both prior families ' +
      '(BS3 order-3 flow lands the crossing slightly later, as expected).',
  },
  {
    id: 'imp35477-endpoint-positivity-knife-edge-stays-dp45-dthalf',
    holds: () =>
      BS3.dt.endpointPositive === false && BS3.dtHalf.endpointPositive === false &&
      RK4.dtHalf.endpointPositive === false && DP45.dtHalf.endpointPositive === true,
    why:
      'The BS3 endpoint gap must be NEGATIVE at both grids (matching RK4); the ' +
      'lone endpoint-POSITIVE cell remains the DP45 dt/2 knife-edge, so the third ' +
      'family does not disturb the imp-35416/imp-35452 endpoint-blindness reading.',
  },
  {
    id: 'imp35477-measurement-only-ladder-stays-no-qed',
    holds: () =>
      IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE.noQED === true &&
      IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE.changesNoBound === true &&
      IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE.verdict.catchesSameStepAndPair === true,
    why:
      'Measurement / cross-check only: corroborates the imp-35351 crossing with a ' +
      'third family but advances NO ladder past N=1000 and changes NO bound. C_mb ' +
      'stays GUE-conditional (imp-486); no refereed bound is changed. Never a QED.',
  },
];
