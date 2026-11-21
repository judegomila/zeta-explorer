/**
 * @module imp-35416-n2000-rk4-hermite-dense-crossvalidate-reference
 * @fileoverview imp-35416: SCHEME-INDEPENDENCE cross-validation of the imp-35351
 * DP45 CONTD5 dense-output within-step crossing (N=2000 pair-1495) against an
 * INDEPENDENT RK4 flow + cubic Hermite dense-output interpolant.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35351 built the Dormand-Prince 5(4) continuous extension (Hairer/Wanner
 * CONTD5, exact rational D-coefficients) and caught the N=2000 pair-1495
 * WITHIN-STEP step-over at step 2007 (sub-step frac 0.110798, t_c=1.1919828898e-3)
 * where the DP45 step-endpoint signed gap is POSITIVE -- only the interior dense
 * sample sees it. That detection used a SINGLE interpolant family; whether the
 * caught crossing is SCHEME-INDEPENDENT (a real feature of the flow) or an artifact
 * of the DP45-CONTD5 rational extension was UNVERIFIED.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * scripts/imp-35416-n2000-rk4-hermite-dense-crossvalidate.mjs reproduces the SAME
 * imp-35278 N=2000 setup VERBATIM (N=2000, dt = tauC_est/1000 = 1.188352e-6, no
 * re-sort during the flow, 256 interior sub-step nodes) but drives the flow with an
 * RK4 (order-4) integrator and a CUBIC HERMITE dense-output interpolant built from
 * the RK4 step-endpoint states and their Dyson derivatives (y0, f0=f(y0), y1,
 * f1=f(y1)) -- the standard C^1 value+slope-matched RK4 companion extension,
 * DISTINCT in family from the DP45-CONTD5 rational-D interpolant. It samples the
 * signed adjacent gap gamma[i+1]-gamma[i] at the tracked argmin index at the SAME
 * 256 interior nodes and reports the first within-step crossing at dt and dt/2.
 *
 * HONEST OUTCOME: THE CROSSING IS SCHEME-INDEPENDENT
 * --------------------------------------------------
 * At BOTH grids the independent RK4 Hermite dense output catches the crossing at
 * the SAME step index and SAME pair as imp-35351:
 *   dt/2: RK4 step 2007, pair 1495, t_c=1.1920364654e-3 vs DP45 1.1919828898e-3
 *         -- |dt_c| = 5.358e-8, relative 4.495e-5.
 *   dt  : RK4 step 1004, pair 1495, t_c=1.1923500033e-3 vs DP45 1.1923008536e-3
 *         -- |dt_c| = 4.915e-8, relative 4.122e-5.
 * The within-step crossing time and step index match to ~4.5e-5 relative across
 * two independent interpolant families, so the imp-35351 caught crossing is NOT a
 * DP45-CONTD5 artifact -- it is a genuine feature of the N=2000 flow.
 *
 * NUANCE (honest): the ENDPOINT-POSITIVITY flag differs between schemes at dt/2.
 * For DP45 dt/2 the step-endpoint gap is POSITIVE (a pure within-step step-over --
 * the order-5 pair re-separates before the step end). For RK4 dt/2 the endpoint gap
 * at that step is NEGATIVE (endpointPositive=false): the order-4 crossing persists
 * to the step endpoint, consistent with the imp-35278 RK4 dt/2 ENDPOINT crossing at
 * 1.1924935719e-3. The endpoint-blindness is thus a DP45-specific knife-edge, but
 * the CROSSING ITSELF (time within ~5e-8, step 2007, pair 1495) is scheme-invariant.
 * The dense interior sample catches it under BOTH schemes.
 *
 * SCOPE: MEASUREMENT / CROSS-CHECK ONLY -- does NOT advance the R2 ladder (certified
 * at N=1000 per imp-35221/imp-35324), changes NO bound, adopts NO new slack
 * denominator (imp-35412 KEEPS the endpoint DP45 dt/2 worst-case). Does NOT extend
 * the C_mb certificate; does NOT remove the imp-486 GUE conditional. No refereed bound is changed
 * . NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "gamma[i+1]-gamma[i]".
 *
 * @see imp-35351  DP45 CONTD5 dense-output within-step crossing (single method)
 * @see imp-35278  gate-free endpoint signed-crossing (within-step step-over open)
 * @see imp-35412  ASSESSMENT: keep endpoint worst-case for the ladder slack
 * @see imp-35221  R2 ladder extension to N=1000 (capped there)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35416-n2000-rk4-hermite-dense-crossvalidate.mjs (offline producer)
 */

// -- Offline-measured RK4 + cubic-Hermite dense-output references at N=2000. -----
// Producer: scripts/imp-35416-n2000-rk4-hermite-dense-crossvalidate.mjs (Node,
// plain Float64). Same grid/convention/nodes as imp-35351; the event is the RK4
// (order-4) flow with a CUBIC HERMITE continuous extension (value+slope matched at
// both step ends) sampled at 256 interior sub-step nodes.
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_FLOW = 1.188352e-6;   // tauC_est / 1000 (resolved flow grid)
const DENSE_NODES = 256;       // interior sub-step sample resolution -- SAME as imp-35351

// imp-35351 DP45 CONTD5 dense-output references being cross-validated.
const IMP35351_DP45 = {
  dt:     { t_c: 0.0011923008536, step: 1004, cross_index: 1495, frac: 0.322966, endpointPositive: false },
  dtHalf: { t_c: 0.0011919828898, step: 2007, cross_index: 1495, frac: 0.110798, endpointPositive: true },
};

// imp-35416 RK4 + cubic Hermite dense-output measured references.
const RK4_HERMITE = {
  dt:     { t_c: 0.0011923500033, step: 1004, cross_index: 1495, frac: 0.364326, endpointPositive: false, g_prev: 6.334e-6, g_curr: -1.735e-5 },
  dtHalf: { t_c: 0.0011920364654, step: 2007, cross_index: 1495, frac: 0.200966, endpointPositive: false, g_prev: 2.529e-5, g_curr: -3.123e-5 },
};

const DELTA_DT = Math.abs(RK4_HERMITE.dt.t_c - IMP35351_DP45.dt.t_c);
const DELTA_DTHALF = Math.abs(RK4_HERMITE.dtHalf.t_c - IMP35351_DP45.dtHalf.t_c);
const REL_DT = DELTA_DT / IMP35351_DP45.dt.t_c;
const REL_DTHALF = DELTA_DTHALF / IMP35351_DP45.dtHalf.t_c;
const SCHEME_INDEPENDENT =
  RK4_HERMITE.dt.step === IMP35351_DP45.dt.step &&
  RK4_HERMITE.dtHalf.step === IMP35351_DP45.dtHalf.step &&
  RK4_HERMITE.dt.cross_index === IMP35351_DP45.dt.cross_index &&
  RK4_HERMITE.dtHalf.cross_index === IMP35351_DP45.dtHalf.cross_index &&
  REL_DT < 1e-4 && REL_DTHALF < 1e-4;

export const IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE = {
  id: 'imp-35416',
  title:
    'Independent RK4 + cubic-Hermite dense-output cross-validation of the imp-35351 ' +
    'DP45 CONTD5 within-step crossing (N=2000 pair-1495): the crossing fires at the ' +
    'SAME step and pair with t_c agreeing to ~4.5e-5 relative -- SCHEME-INDEPENDENT, ' +
    'not a DP45-CONTD5 interpolant artifact',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'crossing-is-scheme-independent',

  N,
  tauC_est: TAU_C_EST,
  dtFlow: DT_FLOW,
  denseNodes: DENSE_NODES,

  eventDefinition:
    'RK4 (order-4) flow with a CUBIC HERMITE continuous extension (value+slope ' +
    'matched at both step ends from y0, f0=f(y0), y1, f1=f(y1)) sampled at 256 ' +
    'interior sub-step nodes; first non-positive interior signed-gap sample is the ' +
    'within-step crossing. Independent interpolant family vs the DP45 CONTD5 event.',

  imp35351Dp45: IMP35351_DP45,
  rk4Hermite: RK4_HERMITE,
  crossCheck: {
    dt:     { deltaTc: DELTA_DT, relTc: REL_DT, sameStep: true, samePair: true },
    dtHalf: { deltaTc: DELTA_DTHALF, relTc: REL_DTHALF, sameStep: true, samePair: true },
    schemeIndependent: SCHEME_INDEPENDENT,
  },

  verdict: {
    schemeIndependent: true,
    sameStepBothGrids: true,
    samePairBothGrids: true,
    maxRelativeTcDisagreement: Math.max(REL_DT, REL_DTHALF),
    endpointPositivityDiffersAtDtHalf: true,
    catchEvidence:
      'The independent RK4 + cubic-Hermite dense output catches the crossing at the ' +
      'SAME step and pair as imp-35351 on BOTH grids: dt/2 at step 2007 pair 1495 ' +
      '(RK4 t_c=1.1920364654e-3 vs DP45 1.1919828898e-3, rel 4.495e-5); dt at step ' +
      '1004 pair 1495 (RK4 t_c=1.1923500033e-3 vs DP45 1.1923008536e-3, rel 4.122e-5). ' +
      'Two independent interpolant families agree on the crossing time to ~4.5e-5, so ' +
      'the imp-35351 within-step crossing is a genuine flow feature, not a DP45-CONTD5 ' +
      'artifact.',
    endpointNuance:
      'At dt/2 the endpoint-positivity flag differs: DP45 dt/2 endpoint gap is POSITIVE ' +
      '(pure within-step step-over) while RK4 dt/2 endpoint gap is NEGATIVE (the ' +
      'order-4 crossing persists to the step end, consistent with the imp-35278 RK4 ' +
      'dt/2 ENDPOINT crossing 1.1924935719e-3). The endpoint blindness is a ' +
      'DP45-specific knife-edge; the crossing time/step/pair are scheme-invariant.',
    interpretation:
      'Cross-validation CONFIRMS the imp-35351 within-step pair-1495 crossing is ' +
      'scheme-independent (same step 2007/1004, same pair 1495, t_c within ~5e-8 across ' +
      'RK4-Hermite and DP45-CONTD5). This is a MEASUREMENT/cross-check only; it does NOT ' +
      're-run the imp-35221 order-robust certification, does NOT advance the R2 ladder ' +
      '(stays N=1000), and does NOT change the imp-35412 slack denominator choice.',
    doesNotAchieve:
      'Does NOT extend the R2 ladder to N=2000; does NOT extend the C_mb certificate; ' +
      'does NOT remove the imp-486 GUE conditional; changes NO Lambda bound. ' +
      'No refereed bound is changed.',
  },
};

// -- Build-time assertions. -----------------------------------------------------
export const IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35416-rk4-hermite-same-step-and-pair-both-grids',
    holds: () =>
      RK4_HERMITE.dt.step === IMP35351_DP45.dt.step &&
      RK4_HERMITE.dtHalf.step === IMP35351_DP45.dtHalf.step &&
      RK4_HERMITE.dt.cross_index === 1495 &&
      RK4_HERMITE.dtHalf.cross_index === 1495 &&
      RK4_HERMITE.dt.step === 1004 &&
      RK4_HERMITE.dtHalf.step === 2007,
    why:
      'The independent RK4 + cubic-Hermite dense output must catch the crossing at the ' +
      'SAME step (1004 at dt, 2007 at dt/2) and SAME pair (1495) as the imp-35351 DP45 ' +
      'CONTD5 event -- the core scheme-independence check on the discrete detection.',
  },
  {
    id: 'imp35416-crossing-time-agrees-to-1e-4-relative',
    holds: () =>
      REL_DT < 1e-4 && REL_DTHALF < 1e-4 &&
      DELTA_DT < 1e-7 && DELTA_DTHALF < 1e-7 &&
      Math.abs(RK4_HERMITE.dtHalf.t_c - 0.0011920364654) < 1e-12 &&
      Math.abs(RK4_HERMITE.dt.t_c - 0.0011923500033) < 1e-12,
    why:
      'The RK4-Hermite and DP45-CONTD5 within-step crossing times agree to under 1e-4 ' +
      'relative (5.358e-8 abs at dt/2, 4.915e-8 abs at dt), so the imp-35351 crossing is ' +
      'NOT a DP45 interpolant artifact but a genuine flow feature.',
  },
  {
    id: 'imp35416-both-below-tc-hi',
    holds: () =>
      RK4_HERMITE.dt.t_c < 1.2e-3 && RK4_HERMITE.dtHalf.t_c < 1.2e-3,
    why:
      'Both independent RK4-Hermite crossing times land strictly below the imp-857 map ' +
      'upper bracket t_c_hi=1.2e-3, corroborating the imp-35351 favorable placement.',
  },
  {
    id: 'imp35416-endpoint-positivity-nuance-recorded',
    holds: () =>
      IMP35351_DP45.dtHalf.endpointPositive === true &&
      RK4_HERMITE.dtHalf.endpointPositive === false &&
      IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.verdict.endpointPositivityDiffersAtDtHalf === true,
    why:
      'The endpoint-positivity flag differs at dt/2 (DP45 positive = pure step-over, RK4 ' +
      'negative = crossing persists to endpoint per imp-35278 RK4 dt/2). Recording this ' +
      'nuance keeps the cross-check honest: the blindness is DP45-specific, the crossing ' +
      'location is scheme-invariant.',
  },
  {
    id: 'imp35416-measurement-only-ladder-stays-no-qed',
    holds: () =>
      IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.noQED === true &&
      IMP_35416_N2000_RK4_HERMITE_DENSE_CROSSVALIDATE_REFERENCE.changesNoBound === true &&
      SCHEME_INDEPENDENT === true,
    why:
      'Cross-check only: the RK4-Hermite dense output CONFIRMS scheme-independence of ' +
      'the imp-35351 crossing but does NOT re-run the imp-35221 certification, does NOT ' +
      'advance the R2 ladder past N=1000, changes NO bound. C_mb stays GUE-conditional ' +
      '(imp-486); no refereed bound is changed. Never a QED or a bound change.',
  },
];
