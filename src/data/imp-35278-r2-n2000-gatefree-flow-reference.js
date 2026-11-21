/**
 * @module imp-35278-r2-n2000-gatefree-flow-reference
 * @fileoverview imp-35278: re-run the imp-35235 R2 N=2000 order-robust
 * backward-Dyson flow test with a GATE-FREE (signed-crossing, linearly
 * interpolated) collision event, to test whether reinterpreting the event
 * definition resolves the imp-35235 DP45 dt/2 gate-skip and recovers a robust
 * t_c_flow(2000) <= t_c_hi(2000).
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35235 left R2 at N=2000 PARTIAL. On the resolved (dt) grid RK4 (order 4)
 * and DP45 (order 5) agree to full precision, and the RK4 dt/2 refinement also
 * lands correctly -- three of four references put the true-flow collision on
 * pair 1495 at t_c ~ 1.192-1.193e-3, strictly below the imp-857 fixed-dt map
 * upper bracket t_c_hi = 1.2e-3. But the fourth reference -- DP45 at dt/2 --
 * GATE-SKIPPED: the sorted min spacing jumped from 1.775e-3 to a re-sorted
 * 3.23e-2 in one step WITHOUT landing in the (0, 1e-4) gate band, so DP45
 * continued to a spurious re-approach event at t_c = 1.3238e-3 > t_c_hi. The
 * imp-35235 sub-gap (imp-35235-sub-n2000-gate-skip) offered two candidate
 * remedies: a FINER flow grid, OR a SIGNED-CROSSING event that catches a gap
 * changing sign rather than only entering a narrow band.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * scripts/imp-35278-n2000-gatefree-flow.mjs reproduces the imp-35235 setup
 * VERBATIM (N=2000, dt = tauC_est/1000 = 1.188352e-6, RK4 and DP45 at dt and
 * dt/2) but replaces the (0, 1e-4) min-spacing gate with a GATE-FREE event: at
 * each step it tracks the SIGNED adjacent gap gamma[i+1]-gamma[i] at the argmin
 * index and declares a collision the first time that gap crosses from positive
 * to non-positive, then LINEARLY INTERPOLATES the crossing time within the step
 * from the pre-step and post-step signed gap. No re-sorting during the flow, so a
 * genuine pass-through shows as a sign change at that index. This tests the
 * SIGNED-CROSSING remedy of the sub-gap at the SAME dt/2 grid endpoints.
 *
 * HONEST OUTCOME: PARTIAL -- SIGNED-CROSSING AT ENDPOINTS DOES NOT FIX DP45 dt/2
 * ------------------------------------------------------------------------------
 * The three clean references sharpen nicely under the gate-free event, each
 * registering a GENUINE sign change (g_prev > 0, g_curr < 0) with an interior
 * interpolation fraction:
 *   RK4  dt   : t_c = 1.1924488124e-3  (step 1004, frac 0.4475, g +1.772e-3 -> -2.188e-3)
 *   DP45 dt   : t_c = 1.1926277027e-3  (step 1004, frac 0.5980, g +1.776e-3 -> -1.194e-3)
 *   RK4  dt/2 : t_c = 1.1924935719e-3  (step 2007, frac 0.9703, g +1.775e-3 -> -5.436e-5)
 * The order4-vs-order5 (dt) gap tightens to 1.789e-7 and the RK4 dt-vs-dt/2
 * self-consistency is ~4.5e-8. The clean envelope max 1.1926277027e-3 clears
 * t_c_hi with slack 7.372297e-6 -- consistent with imp-35235 and now with
 * genuine sub-step interpolated crossing times rather than gate-band step counts.
 *
 * BUT the DP45 dt/2 reference STILL fails identically: the gate-free event finds
 * its first endpoint sign change only at step 2228, t_c = 1.3235388042e-3 (frac
 * 0.5198), essentially the SAME spurious re-approach imp-35235 found at step 2228
 * with the gate (1.3238e-3). REASON: the step-over is WITHIN a single dt/2 step.
 * Near step ~2007 the order-5 dt/2 stages step pair-1495 THROUGH each other and
 * the pair RE-SEPARATES before the step endpoint, so the signed gap is positive
 * at BOTH endpoints of that step -- no endpoint sign change to catch. An event
 * defined on step ENDPOINTS (gate OR signed-crossing) is therefore blind to it;
 * only a FINER grid or a genuine SUB-STEP dense-output interpolant that samples
 * the DP45 continuous extension at INTERIOR nodes can resolve the crossing.
 *
 * NET: the gate-free (endpoint signed-crossing) reinterpretation does NOT recover
 * a robust worst-case t_c_flow(2000) <= t_c_hi. The worst-case envelope still
 * fails (slack -1.235388e-4), so the R2 ladder largest-N-tested-and-met STAYS at
 * 1000 (imp-35221); it is NOT advanced to 2000. The finding SHARPENS the
 * imp-35235 sub-gap: the effective remedy is a finer grid or a genuine sub-step
 * dense output, NOT merely an endpoint signed-crossing gate.
 *
 * REFINED SUB-GAP (named): imp-35278-sub-within-step-stepover -- at N=2000 the
 * DP45 order-5 dt/2 step-over of pair-1495 completes WITHIN one step, invisible
 * to any endpoint event. Certifying R2 at N=2000 needs either (a) a flow grid
 * finer than tauC/1000 so the crossing straddles a step boundary, or (b) a true
 * DP45 dense-output interpolant sampled at sub-step nodes; an endpoint gate or
 * endpoint signed-crossing is insufficient.
 *
 * SCOPE: MEASUREMENT ONLY. Does NOT extend the R2 ladder; does NOT extend the
 * C_mb certificate; does NOT remove the imp-486 GUE conditional; changes NO
 * bound. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "gamma[i+1]-gamma[i]"
 * prose.
 *
 * @see imp-35235  R2 N=2000 order-robust flow (PARTIAL: DP45 dt/2 gate-skip)
 * @see imp-35221  R2 ladder extension to N=1000 (capped there, flagged N=2000)
 * @see imp-35104  C_MB_WEAKER_K_INTERVAL_SCOPE (requirement R2)
 * @see imp-2528   mapVsFlowSemantics one-sided-flow-bound reclassification
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (fixed-dt map bracket incl. N=2000)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35278-n2000-gatefree-flow.mjs (offline producer)
 */

// ── Offline-measured gate-free collision references at N=2000. ────────────────
// Producer: scripts/imp-35278-n2000-gatefree-flow.mjs (Node, plain Float64).
// Same grid/convention as imp-35235; ONLY the event definition differs (signed
// adjacent-gap crossing with linear within-step interpolation, no (0,1e-4) gate).
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_FLOW = 1.188352e-6;   // tauC_est / 1000 (resolved flow grid)
const DT_MAP = 1e-4;           // imp-857 baseline map grid

// gateSkip flags the reference whose true crossing is a WITHIN-STEP step-over
// (positive signed gap at both step endpoints near the true event), so the
// gate-free endpoint event still finds only a spurious later re-approach.
const FLOW_REFERENCES = [
  { integrator: 'rk4-order-4', dt: DT_FLOW, t_c: 0.0011924488124, step: 1004, cross_index: 1495, frac: 0.4475, g_prev: 1.772e-3, g_curr: -2.188e-3, gateSkip: false, source: 'imp-35278 RK4 gate-free signed-crossing (resolved grid)' },
  { integrator: 'dp45-order-5', dt: DT_FLOW, t_c: 0.0011926277027, step: 1004, cross_index: 1495, frac: 0.5980, g_prev: 1.776e-3, g_curr: -1.194e-3, gateSkip: false, source: 'imp-35278 DP45 gate-free signed-crossing (resolved grid)' },
  { integrator: 'rk4-order-4', dt: DT_FLOW / 2, t_c: 0.0011924935719, step: 2007, cross_index: 1495, frac: 0.9703, g_prev: 1.775e-3, g_curr: -5.436e-5, gateSkip: false, source: 'imp-35278 RK4 dt/2 gate-free signed-crossing' },
  { integrator: 'dp45-order-5', dt: DT_FLOW / 2, t_c: 0.0013235388042, step: 2228, cross_index: 1495, frac: 0.5198, g_prev: 5.291e-4, g_curr: -4.888e-4, gateSkip: true, source: 'imp-35278 DP45 dt/2 gate-free signed-crossing (WITHIN-STEP STEP-OVER: pair re-separates before the step endpoint near step 2007, so endpoint gap stays positive; first endpoint sign change is a spurious re-approach at step 2228)' },
];

const CLEAN_REFERENCES = FLOW_REFERENCES.filter((r) => !r.gateSkip);
const T_C_FLOW_VALUES = FLOW_REFERENCES.map((r) => r.t_c);
const T_C_FLOW_MIN = Math.min(...T_C_FLOW_VALUES);
const T_C_FLOW_MAX = Math.max(...T_C_FLOW_VALUES); // worst case incl. step-over
const T_C_CLEAN_MAX = Math.max(...CLEAN_REFERENCES.map((r) => r.t_c));
const T_C_FLOW_BEST = 0.0011924935719;             // RK4 dt/2 resolved estimate

// Fixed-dt=1e-4 MAP bracket (imp-857 convention), inherited from imp-35235.
const MAP_COLLISION_STEP = 12;
const MAP_PAIR_INDEX = 1495;
const T_C_LO = (MAP_COLLISION_STEP - 1) * DT_MAP; // 1.1e-3
const T_C_HI = MAP_COLLISION_STEP * DT_MAP;       // 1.2e-3 upper bracket endpoint

const R2_MET_WORSTCASE = T_C_FLOW_MAX <= T_C_HI;  // false (step-over still breaks it)
const R2_SLACK_WORSTCASE = T_C_HI - T_C_FLOW_MAX; // negative
const R2_MET_CLEAN = T_C_CLEAN_MAX <= T_C_HI;     // true (three-of-four)
const R2_SLACK_CLEAN = T_C_HI - T_C_CLEAN_MAX;    // positive provisional slack

// Cross-family / cross-grid agreement diagnostics (dt families).
const ORDER_GAP_DT = Math.abs(0.0011926277027 - 0.0011924488124);   // |dp45-rk4| at dt
const RK4_SELF_CONV = Math.abs(0.0011924488124 - 0.0011924935719);  // RK4 dt vs dt/2
const DP45_SELF_CONV = Math.abs(0.0011926277027 - 0.0013235388042); // DP45 dt vs dt/2

export const IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE = {
  id: 'imp-35278',
  title:
    'Gate-free (signed-crossing, interpolated) collision event for the imp-35235 ' +
    'R2 N=2000 order-robust flow test -- PARTIAL: an endpoint signed-crossing does ' +
    'NOT resolve the DP45 dt/2 step-over (it is WITHIN one dt/2 step)',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'partial-within-step-stepover',

  N,
  tauC_est: TAU_C_EST,
  dtFlow: DT_FLOW,
  dtMap: DT_MAP,

  eventDefinition:
    'GATE-FREE: first step at which the signed adjacent gap gamma[i+1]-gamma[i] at ' +
    'the argmin index crosses from positive to non-positive; crossing time linearly ' +
    'interpolated within the step. Replaces the imp-35235 (0, 1e-4) min-spacing gate.',

  flowReferences: FLOW_REFERENCES,
  flowEnvelope: { min: T_C_FLOW_MIN, max: T_C_FLOW_MAX, best: T_C_FLOW_BEST, cleanMax: T_C_CLEAN_MAX },
  mapBracket: { step: MAP_COLLISION_STEP, pair_index: MAP_PAIR_INDEX, t_c_lo: T_C_LO, t_c_hi: T_C_HI },
  diagnostics: { orderGapDt: ORDER_GAP_DT, rk4SelfConv: RK4_SELF_CONV, dp45SelfConv: DP45_SELF_CONV },

  r2Predicate: 't_c_flow(2000) <= t_c_hi(2000)  (imp-2528 one-sided true-flow bound)',
  r2MetWorstCase: R2_MET_WORSTCASE,
  r2SlackWorstCase: R2_SLACK_WORSTCASE,
  r2MetClean: R2_MET_CLEAN,
  r2SlackClean: R2_SLACK_CLEAN,

  verdict: {
    gateFreeResolvesGateSkip: false,
    cleanReferencesSharpen: true,
    cleanEvidence:
      'Under the gate-free event the three clean references (RK4 dt, DP45 dt, RK4 ' +
      'dt/2) each register a GENUINE sign change with an interior interpolation ' +
      'fraction and land at 1.1924488124e-3, 1.1926277027e-3, 1.1924935719e-3 -- ' +
      'order4-vs-order5 (dt) gap 1.789e-7, RK4 dt-vs-dt/2 self-conv ~4.5e-8. The ' +
      'clean envelope max 1.1926277027e-3 clears t_c_hi=1.2e-3 (slack ' +
      R2_SLACK_CLEAN.toExponential(3) + ').',
    withinStepEvidence:
      'The DP45 dt/2 reference STILL fails: the gate-free endpoint event finds its ' +
      'first signed-gap sign change only at step 2228, t_c=1.3235388042e-3 -- the ' +
      'SAME spurious re-approach imp-35235 found at step 2228 (1.3238e-3). Near step ' +
      '2007 the order-5 dt/2 stages step pair-1495 THROUGH each other and it ' +
      'RE-SEPARATES before the step endpoint, so the signed gap is positive at BOTH ' +
      'endpoints of that step. An endpoint event (gate OR signed-crossing) cannot ' +
      'see a step-over that completes within one step.',
    largestN_R2_tested_and_met: 1000,
    priorLargestN_R2_tested_and_met: 1000,
    interpretation:
      'Reinterpreting the collision as an endpoint signed-crossing does NOT recover ' +
      'a robust worst-case t_c_flow(2000) <= t_c_hi. Three of four references clear ' +
      't_c_hi with positive slack (clean sub-envelope, consistent with imp-35235 and ' +
      'now with genuine sub-step interpolated crossings), but the DP45 dt/2 step-over ' +
      'is WITHIN one dt/2 step and stays invisible to endpoint sampling, so the ' +
      'honest worst-case envelope still exceeds t_c_hi (slack ' +
      R2_SLACK_WORSTCASE.toExponential(3) + '). The R2 ladder largest-N-tested-and-met ' +
      'STAYS at 1000 (imp-35221); it is NOT advanced to 2000. The finding SHARPENS ' +
      'the imp-35235 sub-gap: an endpoint signed-crossing is NOT the fix; a finer ' +
      'grid or a genuine sub-step dense output is required.',
    doesNotAchieve:
      'Does NOT resolve the DP45 dt/2 artifact; does NOT extend the R2 ladder to ' +
      'N=2000; does NOT extend the C_mb certificate; does NOT remove the imp-486 GUE ' +
      'conditional; changes NO Lambda bound. No refereed bound is changed.',
    subGap:
      'imp-35278-sub-within-step-stepover: the DP45 order-5 dt/2 step-over of ' +
      'pair-1495 at N=2000 completes WITHIN one step (positive signed gap at both ' +
      'endpoints), invisible to any endpoint event. Certifying R2 at N=2000 needs a ' +
      'flow grid finer than tauC/1000 so the crossing straddles a step boundary, OR a ' +
      'true DP45 dense-output interpolant sampled at sub-step interior nodes; an ' +
      'endpoint gate or endpoint signed-crossing is insufficient.',
    residualId: 'imp-35278-sub-within-step-stepover / imp-35235-sub-n2000-gate-skip',
  },
};

// ── Build-time assertions. ───────────────────────────────────────────────────
export const IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35278-clean-references-genuine-crossings',
    holds: () => {
      const clean = FLOW_REFERENCES.filter((r) => !r.gateSkip);
      return clean.length === 3 &&
        clean.every((r) => r.g_prev > 0 && r.g_curr < 0 && r.frac > 0 && r.frac <= 1 &&
          r.cross_index === 1495 && r.t_c < 1.2e-3);
    },
    why:
      'Under the gate-free event the three clean references (RK4 dt, DP45 dt, RK4 ' +
      'dt/2) must each register a GENUINE sign change (g_prev > 0, g_curr < 0) at ' +
      'pair 1495 with an interior interpolation fraction, and land strictly below ' +
      't_c_hi=1.2e-3. This is the clean part of the measurement.',
  },
  {
    id: 'imp35278-clean-subenvelope-clears',
    holds: () =>
      IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.r2MetClean === true &&
      IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.r2SlackClean > 0 &&
      Math.abs(R2_SLACK_CLEAN - 7.372297e-6) < 1e-9,
    why:
      'The three non-skipping references clear t_c_hi with positive slack ~7.37e-6 ' +
      '(clean max 1.1926277027e-3). Consistent with imp-35235; the gate-free event ' +
      'gives genuine sub-step interpolated crossings rather than gate-band steps.',
  },
  {
    id: 'imp35278-dp45-dthalf-within-step-stepover',
    holds: () => {
      const dp45h = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW / 2);
      const rk4h = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.dt === DT_FLOW / 2);
      // Same step 2228 as the imp-35235 gate-based artifact; t_c essentially unchanged.
      return dp45h && rk4h && dp45h.gateSkip === true && rk4h.gateSkip === false &&
        dp45h.step === 2228 && dp45h.t_c > rk4h.t_c && dp45h.t_c > 1.3e-3;
    },
    why:
      'HONEST DEFECT PERSISTS: the DP45 dt/2 endpoint signed-crossing still lands at ' +
      'step 2228 (t_c~1.3235e-3), the SAME spurious re-approach imp-35235 found with ' +
      'the gate. The step-over is WITHIN one dt/2 step, so the gate-free ' +
      'reinterpretation does NOT fix it.',
  },
  {
    id: 'imp35278-worstcase-envelope-still-fails',
    holds: () =>
      IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.r2MetWorstCase === false &&
      IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.r2SlackWorstCase < 0 &&
      IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.flowEnvelope.max >
        IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.mapBracket.t_c_hi,
    why:
      'HONEST R2 TEST: because the DP45 dt/2 step-over survives the gate-free event, ' +
      'the worst-case flow reference still EXCEEDS t_c_hi and the envelope does NOT ' +
      'clear the map bracket. R2 is NOT certified at N=2000.',
  },
  {
    id: 'imp35278-gatefree-does-not-resolve-no-qed',
    holds: () =>
      IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.noQED === true &&
      IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.changesNoBound === true &&
      IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.verdict.gateFreeResolvesGateSkip === false &&
      IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.verdict.largestN_R2_tested_and_met === 1000 &&
      typeof IMP_35278_R2_N2000_GATEFREE_FLOW_REFERENCE.verdict.subGap === 'string',
    why:
      'Measurement only: never a QED or a bound change. The gate-free event does NOT ' +
      'resolve the artifact, so the R2 ladder largest-N-tested-and-met STAYS at 1000 ' +
      'and a refined sub-gap is recorded. C_mb stays GUE-conditional (imp-486); ' +
      'no refereed bound is changed.',
  },
];
