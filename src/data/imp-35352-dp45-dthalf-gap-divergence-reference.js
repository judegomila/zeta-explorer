/**
 * @module imp-35352-dp45-dthalf-gap-divergence-reference
 * @fileoverview imp-35352: diagnose WHY the imp-35324 DP45 dt/2 pre-gate min
 * neighbour spacing (9.841e-4) is anomalously LARGER than the other three N=2000
 * references (~8.787-8.805e-4) on the tauC/4000 finer base grid, by instrumenting
 * the imp-35324 flow to record the full pre-collision pair-1495 gap trajectory of
 * each reference and MEASURING at which step and by how much the DP45 dt/2 gap
 * trajectory diverges from the RK4 dt/2 gap trajectory.
 *
 * WHY THIS TEST
 * ------------
 * imp-35324 re-ran the imp-35235 R2 N=2000 order-robust backward-Dyson flow test
 * on a FINER base grid (dt = tauC_est/4000) and found the DP45 dt/2 gate-skip
 * RESOLVED, but the DP45 dt/2 reference reported gapBeforeGate = 9.841e-4 while
 * the other three references (RK4 dt, DP45 dt, RK4 dt/2) shared ~8.79e-4. imp-35324
 * flagged this as the residual signature of the order-5 dt/2 stages sampling the
 * singular 2/diff approach differently near the collision, but never characterized
 * WHERE that difference enters: is it a slow accumulated trajectory divergence
 * (order-5 truncation error building over many steps) or a localized final-step
 * stage-ordering effect (the two families track in lockstep down the whole
 * approach and differ only in the single step that brackets the collision, where
 * the 2/diff field is near-singular and stiff)?
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * scripts/imp-35352-dp45-dthalf-gap-divergence.mjs re-runs the imp-35324 flow
 * VERBATIM (same Kahan-Neumaier derivative, same RK4 and independent-family DP45
 * steppers, same finer grid dt = tauC_est/4000, same min-spacing < 1e-4 gate) but
 * records at EVERY step the global min spacing AND the pair-1495 gap for all four
 * references, then compares the two dt/2 references (which share dt/2 = tauC/8000
 * and the same initial condition, so their per-step pair gaps are directly
 * comparable) step by step.
 *
 * HONEST OUTCOME: FINAL-STEP STAGE-ORDERING EFFECT, NOT TRAJECTORY DIVERGENCE
 * --------------------------------------------------------------------------
 * The DP45 dt/2 and RK4 dt/2 pair-1495 gap trajectories are numerically
 * INDISTINGUISHABLE for the ENTIRE approach: across all 8027 pre-collision common
 * steps the two gaps agree to better than 1e-6 ABSOLUTE. The FIRST step at which
 * they diverge by more than 1e-6 (and 1e-5, and by relative 1e-3) is step 8027 --
 * which is RK4 dt/2 OWN collision step. At that single step:
 *   RK4  dt/2 pair-1495 gap: 8.799935e-4 (step 8026) -> -8.477603e-5 (step 8027, gate trips)
 *   DP45 dt/2 pair-1495 gap: 8.799935e-4 (step 8026) ->  7.770767e-3 (step 8027, OVERSHOOTS)
 * i.e. in the ONE step that RK4 uses to cross into the collision gate, the order-5
 * DP45 stages -- sampling the near-singular 2/diff field at their own internal
 * nodes -- OVERSHOOT the approach so the pair-1495 gap RE-SEPARATES to 7.77e-3
 * instead of crossing zero. Max absolute divergence 7.855543e-3, max relative
 * divergence 9.27e+1, BOTH at step 8027 (nowhere earlier). DP45 dt/2 then takes 51
 * MORE base steps to re-approach and land in the gate at step 8078 with the
 * anomalous pre-gate gap 9.841268e-4 (its last clean sample, step 8077) rather
 * than RK4 8.799935e-4.
 *
 * VERDICT: the imp-35324 DP45 dt/2 pre-gate-gap anomaly is a STAGE-ORDERING /
 * FINAL-STEP SINGULAR-SAMPLING effect, NOT an accumulated trajectory divergence.
 * The two families are indistinguishable to < 1e-6 for all 8027 approach steps and
 * diverge only in the single collision-bracketing step where the 2/diff field is
 * stiff; the order-5 nodes there overshoot, delaying the DP45 gate landing by 51
 * steps and leaving a larger last-clean-sample gap. This explains imp-35324s
 * 9.841e-4 signature with NO appeal to trajectory-wide order-5 truncation error.
 *
 * SCOPE: MEASUREMENT / DIAGNOSTIC ONLY. Does NOT advance the R2 ladder (stays at
 * N=1000 per imp-35221); does NOT change the imp-35324 verdict or its baked
 * references; does NOT extend the C_mb certificate; does NOT remove the imp-486
 * GUE conditional; changes NO bound. No refereed bound is changed.
 * NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "2/diff" prose.
 *
 * @see imp-35324  finer-grid re-run that flagged the 9.841e-4 pre-gate anomaly
 * @see imp-35235  coarse-grid predecessor (the DP45 dt/2 gate-skip origin)
 * @see imp-35350  still-finer-grid follow-up (tauC/16000 restores the dt/2 tie)
 * @see imp-35278  dense-output interpolated-event route (within-step crossing)
 * @see imp-35221  R2 ladder last robustly-certified rung (N=1000)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35352-dp45-dthalf-gap-divergence.mjs (offline producer)
 * @see scripts/imp-35324-n2000-finer-grid-flow.mjs (instrumented predecessor)
 */

// ── Offline-measured pair-1495 gap divergence at N=2000, imp-35324 finer grid. ─
// Producer: scripts/imp-35352-dp45-dthalf-gap-divergence.mjs (Node, plain Float64).
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_FLOW = 2.970880e-7;      // tauC_est / 4000 (imp-35324 finer base grid)
const DT_HALF = 1.485440e-7;      // dt/2 = tauC_est / 8000
const PAIR_INDEX = 1495;          // the colliding pair (imp-35235/imp-35324)
const GATE = 1e-4;                // min-spacing collision gate (imp-35324/imp-35235)

// The four references, with their collision step and last-clean-sample pre-gate
// gap (imp-35324 gapBeforeGate) reproduced VERBATIM by this instrumented re-run.
const FLOW_REFERENCES = [
  { integrator: 'rk4-order-4', dt: DT_FLOW, t_c: 0.0011925112320, step: 4014, pair_index: 1495, preGateGap: 8.786976e-4 },
  { integrator: 'dp45-order-5', dt: DT_FLOW, t_c: 0.0011925112320, step: 4014, pair_index: 1495, preGateGap: 8.804928e-4 },
  { integrator: 'rk4-order-4', dt: DT_HALF, t_c: 0.0011923626880, step: 8027, pair_index: 1495, preGateGap: 8.799935e-4 },
  { integrator: 'dp45-order-5', dt: DT_HALF, t_c: 0.0011999384320, step: 8078, pair_index: 1495, preGateGap: 9.841268e-4 },
];

// ── DP45 dt/2 vs RK4 dt/2 pair-1495 gap divergence, measured step by step. ─────
// Both dt/2 references share dt/2 = tauC/8000 and the same initial condition, so
// their per-step pair-1495 gaps are directly comparable up to the RK4 gate step.
const DIVERGENCE = {
  commonComparableSteps: 8028,        // RK4 dt/2 records steps 0..8027 (gate at 8027)
  firstStepAbsOver1e6: 8027,          // first step |gap_dp45 - gap_rk4| > 1e-6
  firstStepAbsOver1e5: 8027,          // first step > 1e-5
  firstStepRelOver1e3: 8027,          // first step relative > 1e-3
  maxAbsDivergence: 7.855543e-3,      // largest |gap_dp45 - gap_rk4| over the run
  maxAbsDivergenceStep: 8027,
  maxRelDivergence: 9.266232e+1,      // largest relative gap divergence
  maxRelDivergenceStep: 8027,
  // The divergence is localized to the SINGLE collision-bracketing step: before
  // step 8027 the two dt/2 families agree to < 1e-6 absolute at every step.
  rk4GateStep: 8027,
  dp45GateStep: 8078,
  extraDp45StepsToGate: 51,           // 8078 - 8027
};

// The single collision-bracketing step 8027, where the two families first differ.
const BRACKETING_STEP = {
  step: 8027,
  rk4PairGapPrev: 8.799935e-4,        // step 8026 (last clean sample, both families)
  rk4PairGapAtStep: -8.477603e-5,     // step 8027: RK4 crosses zero, gate trips
  dp45PairGapAtStep: 7.770767e-3,     // step 8027: DP45 order-5 stages OVERSHOOT, re-separates
  dp45PairGapPrev: 9.841268e-4,       // DP45 last clean sample (step 8077, the imp-35324 anomaly)
  dp45PairGapAtGate: -6.238619e-5,    // DP45 crosses at its OWN gate step 8078
};

export const IMP_35352_DP45_DTHALF_GAP_DIVERGENCE_REFERENCE = {
  id: 'imp-35352',
  title:
    'The imp-35324 DP45 dt/2 pre-gate gap anomaly (9.841e-4 vs ~8.79e-4) is a ' +
    'FINAL-STEP stage-ordering singular-sampling effect, NOT an accumulated ' +
    'trajectory divergence: the two dt/2 families agree to < 1e-6 for all 8027 ' +
    'approach steps and diverge only in the single collision-bracketing step',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'stage-ordering-final-step-effect-not-trajectory-divergence',

  N,
  tauC_est: TAU_C_EST,
  dtFlow: DT_FLOW,
  dtHalf: DT_HALF,
  pairIndex: PAIR_INDEX,
  gate: GATE,

  flowReferences: FLOW_REFERENCES,
  divergence: DIVERGENCE,
  bracketingStep: BRACKETING_STEP,

  verdict: {
    anomalyClass: 'stage-ordering / final-step singular-sampling',
    isAccumulatedTrajectoryDivergence: false,
    divergenceLocalizedToStep: 8027,
    familiesAgreeBelow1e6ForApproachSteps: 8027,
    evidence:
      'The DP45 dt/2 and RK4 dt/2 pair-1495 gap trajectories agree to better than ' +
      '1e-6 ABSOLUTE at every one of the 8027 pre-collision steps; the FIRST step ' +
      'at which |gap_dp45 - gap_rk4| exceeds 1e-6 (also 1e-5, also relative 1e-3) ' +
      'is step 8027, which is RK4 dt/2 own collision step. Max abs divergence ' +
      '7.855543e-3 and max rel divergence 9.27e+1 BOTH occur at step 8027 and ' +
      'nowhere earlier, so the divergence is localized to the single ' +
      'collision-bracketing step, not spread across the trajectory.',
    mechanism:
      'In the ONE step that RK4 uses to cross into the (0, 1e-4) gate (gap ' +
      '8.799935e-4 -> -8.477603e-5), the order-5 DP45 stages sample the ' +
      'near-singular 2/diff field at their own internal nodes and OVERSHOOT: the ' +
      'pair-1495 gap RE-SEPARATES to 7.770767e-3 instead of crossing zero. DP45 ' +
      'then takes 51 more base steps to re-approach and lands in the gate at step ' +
      '8078 with a last-clean-sample gap of 9.841268e-4 -- exactly the imp-35324 ' +
      'anomalous pre-gate value -- rather than RK4 8.799935e-4.',
    explainsImp35324Anomaly: true,
    interpretation:
      'The imp-35324 gapBeforeGate = 9.841e-4 anomaly needs NO appeal to ' +
      'trajectory-wide order-5 truncation error: the order-4 and order-5 dt/2 ' +
      'flows are numerically indistinguishable down the entire singular approach ' +
      'and differ only in how their internal stages resolve the ONE stiff step ' +
      'that brackets the collision. This is consistent with imp-35350, where a ' +
      'still-finer grid (tauC/16000) shrinks that final-step disagreement back to ' +
      'a full-precision tie.',
    doesNotAchieve:
      'Does NOT advance the R2 ladder (stays N=1000 per imp-35221); does NOT ' +
      'change the imp-35324 verdict or baked references; does NOT extend the C_mb ' +
      'certificate; does NOT remove the imp-486 GUE conditional; changes NO ' +
      'Lambda bound. No refereed bound is changed.',
    residualId: 'imp-35324-sub-n2000-marginal-clearance (unchanged)',
  },
};

// ── Build-time assertions (re-derive from the baked literals). ────────────────
export const IMP_35352_DP45_DTHALF_GAP_DIVERGENCE_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35352-divergence-localized-to-final-step',
    holds: () =>
      DIVERGENCE.firstStepAbsOver1e6 === DIVERGENCE.rk4GateStep &&
      DIVERGENCE.maxAbsDivergenceStep === DIVERGENCE.rk4GateStep &&
      DIVERGENCE.maxRelDivergenceStep === DIVERGENCE.rk4GateStep,
    why:
      'KEY FINDING: the DP45 dt/2 vs RK4 dt/2 pair-1495 gap divergence is localized ' +
      'to the single collision-bracketing step (RK4 gate step 8027) -- the first ' +
      'step exceeding 1e-6 AND both the max-absolute and max-relative divergence ' +
      'steps all coincide at the RK4 gate step, so the divergence is NOT spread ' +
      'across the trajectory.',
  },
  {
    id: 'imp35352-families-agree-before-bracketing-step',
    holds: () =>
      DIVERGENCE.firstStepAbsOver1e6 > 8000 &&
      IMP_35352_DP45_DTHALF_GAP_DIVERGENCE_REFERENCE.verdict.isAccumulatedTrajectoryDivergence === false &&
      IMP_35352_DP45_DTHALF_GAP_DIVERGENCE_REFERENCE.verdict.familiesAgreeBelow1e6ForApproachSteps === 8027,
    why:
      'The order-4 and order-5 dt/2 flows agree to < 1e-6 absolute for all 8027 ' +
      'approach steps (first divergence step > 8000), confirming the anomaly is a ' +
      'stage-ordering final-step effect and NOT an accumulated trajectory ' +
      'divergence.',
  },
  {
    id: 'imp35352-overshoot-mechanism',
    holds: () =>
      BRACKETING_STEP.rk4PairGapAtStep < 0 &&
      BRACKETING_STEP.dp45PairGapAtStep > 1e-3 &&
      BRACKETING_STEP.dp45PairGapAtStep > BRACKETING_STEP.rk4PairGapPrev,
    why:
      'MECHANISM: at the shared bracketing step 8027 RK4 crosses zero (gap ' +
      'negative, gate trips) while the order-5 DP45 stages OVERSHOOT the singular ' +
      'approach so the pair-1495 gap re-separates to > 1e-3 (larger than the ' +
      'common pre-step gap), which is why DP45 needs 51 more steps to reach its ' +
      'own gate.',
  },
  {
    id: 'imp35352-explains-imp35324-anomaly',
    holds: () => {
      const dp45h = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_HALF);
      const rk4h = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.dt === DT_HALF);
      // DP45 dt/2 pre-gate gap is the anomalous 9.841e-4; it equals the DP45
      // last-clean-sample gap at its own delayed gate landing.
      return dp45h && rk4h && dp45h.preGateGap > rk4h.preGateGap &&
        Math.abs(dp45h.preGateGap - BRACKETING_STEP.dp45PairGapPrev) < 1e-9 &&
        DIVERGENCE.extraDp45StepsToGate === (DIVERGENCE.dp45GateStep - DIVERGENCE.rk4GateStep);
    },
    why:
      'The imp-35324 DP45 dt/2 anomalous pre-gate gap (9.841268e-4, larger than ' +
      'RK4 8.799935e-4) is exactly the DP45 last-clean-sample gap after the ' +
      'overshoot delayed its gate landing by 51 steps (8078 - 8027), so this ' +
      'measurement fully accounts for the imp-35324 signature.',
  },
  {
    id: 'imp35352-measurement-only-no-qed',
    holds: () =>
      IMP_35352_DP45_DTHALF_GAP_DIVERGENCE_REFERENCE.noQED === true &&
      IMP_35352_DP45_DTHALF_GAP_DIVERGENCE_REFERENCE.changesNoBound === true &&
      IMP_35352_DP45_DTHALF_GAP_DIVERGENCE_REFERENCE.cMbStaysGueConditional === 'imp-486',
    why:
      'Diagnostic measurement only: never a QED or a bound change; does not touch ' +
      'the imp-35324 verdict, the R2 ladder (stays N=1000), or the imp-486 GUE ' +
      'conditional. No refereed bound is changed.',
  },
];
