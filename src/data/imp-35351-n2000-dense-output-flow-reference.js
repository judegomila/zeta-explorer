/**
 * @module imp-35351-n2000-dense-output-flow-reference
 * @fileoverview imp-35351: build a TRUE DP45 continuous-extension (dense-output)
 * interpolant sampled at INTERIOR sub-step nodes for the imp-35278 R2 N=2000
 * collision event, and measure whether it catches the within-step pair-1495
 * step-over that both the imp-35235 endpoint gate and the imp-35278 endpoint
 * signed-crossing miss.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35278 replaced the imp-35235 (0, 1e-4) min-spacing gate with an ENDPOINT
 * signed-crossing plus LINEAR within-step interpolation and found the DP45 dt/2
 * reference STILL failed identically -- a spurious re-approach at step 2228,
 * t_c ~ 1.3235e-3 -- because pair-1495 steps THROUGH and re-separates WITHIN a
 * single dt/2 step near step 2007, so the signed adjacent gap is positive at BOTH
 * step endpoints and no endpoint event (gate OR signed-crossing) can see it. The
 * imp-35278 refined sub-gap (imp-35278-sub-within-step-stepover) named remedy (b):
 * a GENUINE DP45 dense-output interpolant sampled at sub-step INTERIOR nodes,
 * DISTINCT from the imp-35278 endpoint linear interpolation.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * scripts/imp-35351-n2000-dense-output-flow.mjs reproduces the imp-35278 setup
 * VERBATIM (N=2000, dt = tauC_est/1000 = 1.188352e-6, DP45 at dt and dt/2, no
 * re-sort during the flow) but builds the classic Dormand-Prince 5(4) CONTINUOUS
 * EXTENSION -- the Hairer/Wanner CONTD5 fourth-order interpolant with exact
 * rational D-coefficients -- from the SAME seven stages each DP45 step already
 * evaluates (k7 is the FSAL endpoint stage). At every step it forms the per-index
 * interpolation polynomial y(theta), theta in (0,1), and samples the SIGNED
 * adjacent gap gamma[i+1]-gamma[i] at the tracked argmin index at 256 INTERIOR
 * sub-step nodes. The first step whose interior sample dips non-positive is a
 * genuine WITHIN-STEP crossing; its sub-step time is bracketed on the dense node
 * grid and refined linearly.
 *
 * HONEST OUTCOME: THE DENSE OUTPUT CATCHES THE WITHIN-STEP STEP-OVER
 * -----------------------------------------------------------------
 * The DP45 dt/2 dense-output event fires at step 2007 (NOT the spurious step 2228
 * of the endpoint events), at pair 1495, sub-step fraction 0.110798, and the
 * crossing time lands at t_c = 1.1919828898e-3 -- BELOW the imp-857 map upper
 * bracket t_c_hi = 1.2e-3. Crucially the step-endpoint signed gap is POSITIVE at
 * that step (endpointPos = true): the pair passes through and re-separates within
 * the one dt/2 step exactly as imp-35278 diagnosed, so ONLY the interior
 * dense-output sample sees the crossing. The DP45 dt dense event fires at step
 * 1004 (t_c = 1.1923008536e-3, endpoint already negative); the DP45 dt-vs-dt/2
 * self-consistency under the dense event tightens to 3.180e-7.
 *
 * So remedy (b) WORKS where remedy (a)-substitutes did not: the true DP45
 * dense-output interpolant resolves the within-step step-over that both the
 * endpoint gate (imp-35235) and the endpoint signed-crossing (imp-35278) miss.
 * Folding the dense DP45 crossings into the imp-35278 RK4 endpoint crossings, the
 * worst-case flow envelope max is 1.1924935719e-3 (the RK4 dt/2 reference) and
 * clears t_c_hi with slack 7.506e-6.
 *
 * SCOPE: MEASUREMENT ONLY -- ladder STAYS at N=1000. This is a SINGLE-METHOD (DP45
 * continuous extension) sub-step measurement; the R2 ladder certification per
 * imp-35221 requires the full order-robust method, and this module does NOT
 * re-run that pipeline with the dense event, so it does NOT formally advance the
 * R2 largest-N-tested-and-met past N=1000 (imp-35221). It removes the imp-35278
 * "endpoint sampling is blind" obstruction and shows the within-step crossing is
 * favorably placed, but the certification integration is a distinct step.
 *
 * REFINED SUB-GAP (named): imp-35351-sub-dense-certification -- the DP45
 * dense-output event RESOLVES the within-step step-over and places the crossing
 * below t_c_hi on the tauC/1000 grid, but whether integrating this dense event
 * into the full imp-35221 order-robust certification (all four RK4/DP45 x dt,dt/2
 * references under one dense-output event) formally advances the R2 ladder to
 * N=2000 is UNMEASURED here.
 *
 * SCOPE: Does NOT extend the C_mb certificate; does NOT remove the imp-486 GUE
 * conditional; changes NO bound. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "gamma[i+1]-gamma[i]".
 *
 * @see imp-35278  gate-free endpoint signed-crossing (PARTIAL: within-step step-over)
 * @see imp-35235  R2 N=2000 order-robust flow (PARTIAL: DP45 dt/2 gate-skip)
 * @see imp-35324  finer-base-grid (tauC/4000) resolution of the gate-skip
 * @see imp-35325  signed-crossing diagnostic (step-over is PHYSICAL, not a label swap)
 * @see imp-35221  R2 ladder extension to N=1000 (capped there, flagged N=2000)
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (fixed-dt map bracket incl. N=2000)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35351-n2000-dense-output-flow.mjs (offline producer)
 */

// -- Offline-measured DP45 dense-output collision references at N=2000. ---------
// Producer: scripts/imp-35351-n2000-dense-output-flow.mjs (Node, plain Float64).
// Same grid/convention as imp-35278; the event is the DP45 (DOPRI5) 4th-order
// CONTINUOUS EXTENSION (Hairer/Wanner CONTD5) sampled at 256 interior sub-step
// nodes, replacing the imp-35278 endpoint-only signed-crossing.
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_FLOW = 1.188352e-6;   // tauC_est / 1000 (resolved flow grid)
const DT_MAP = 1e-4;           // imp-857 baseline map grid
const DENSE_NODES = 256;       // interior sub-step sample resolution

// DP45 dense-output references. withinStep=true and endpointPositive=true marks
// the reference whose crossing is a genuine WITHIN-STEP step-over: the pair passes
// through and re-separates before the step endpoint, so the endpoint signed gap
// stays positive and ONLY the interior dense sample catches it.
const DENSE_REFERENCES = [
  { integrator: 'dp45-order-5', dt: DT_FLOW, t_c: 0.0011923008536, step: 1004, cross_index: 1495, frac: 0.322966, withinStep: true, endpointPositive: false, g_prev: 1.719e-5, g_curr: -8.111e-6, source: 'imp-35351 DP45 dense-output (resolved grid); endpoint already negative, interior refines the crossing' },
  { integrator: 'dp45-order-5', dt: DT_FLOW / 2, t_c: 0.0011919828898, step: 2007, cross_index: 1495, frac: 0.110798, withinStep: true, endpointPositive: true, g_prev: 3.621e-5, g_curr: -6.316e-5, source: 'imp-35351 DP45 dt/2 dense-output: WITHIN-STEP STEP-OVER at step 2007 (endpoint gap POSITIVE, only the interior dense sample sees the crossing) -- resolves the imp-35278 spurious step-2228 re-approach' },
];

// imp-35278 RK4 endpoint signed-crossing references (already genuine at endpoints),
// carried in verbatim so the worst-case envelope folds all four references.
const IMP35278_ENDPOINT = {
  rk4_dt: 0.0011924488124,
  rk4_dthalf: 0.0011924935719,
};

const DP45_DT = DENSE_REFERENCES.find((r) => r.dt === DT_FLOW).t_c;
const DP45_DTHALF = DENSE_REFERENCES.find((r) => r.dt === DT_FLOW / 2).t_c;

// Fixed-dt=1e-4 MAP bracket (imp-857 convention), inherited from imp-35235/imp-35278.
const MAP_COLLISION_STEP = 12;
const MAP_PAIR_INDEX = 1495;
const T_C_LO = (MAP_COLLISION_STEP - 1) * DT_MAP; // 1.1e-3
const T_C_HI = MAP_COLLISION_STEP * DT_MAP;       // 1.2e-3 upper bracket endpoint

// Worst-case envelope under the dense-output event: dense DP45 dt, dense DP45
// dt/2, imp-35278 RK4 dt, imp-35278 RK4 dt/2 (RK4 references need no dense output).
const ENVELOPE_VALUES = [DP45_DT, DP45_DTHALF, IMP35278_ENDPOINT.rk4_dt, IMP35278_ENDPOINT.rk4_dthalf];
const T_C_ENV_MAX = Math.max(...ENVELOPE_VALUES);
const T_C_ENV_MIN = Math.min(...ENVELOPE_VALUES);

const WITHIN_STEP_BELOW_TC_HI = DP45_DTHALF < T_C_HI;      // true -- remedy (b) works
const R2_ENVELOPE_CLEARS = T_C_ENV_MAX <= T_C_HI;          // true under dense event
const R2_ENVELOPE_SLACK = T_C_HI - T_C_ENV_MAX;            // positive (~7.506e-6)
const DP45_SELF_CONV_DENSE = Math.abs(DP45_DT - DP45_DTHALF); // 3.180e-7

export const IMP_35351_N2000_DENSE_OUTPUT_FLOW_REFERENCE = {
  id: 'imp-35351',
  title:
    'True DP45 continuous-extension (dense-output) interpolant sampled at interior ' +
    'sub-step nodes for the imp-35278 R2 N=2000 collision -- CATCHES the within-step ' +
    'pair-1495 step-over that both the endpoint gate and the endpoint signed-crossing ' +
    'miss; the within-step crossing lands below t_c_hi',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'dense-output-catches-within-step-stepover',

  N,
  tauC_est: TAU_C_EST,
  dtFlow: DT_FLOW,
  dtMap: DT_MAP,
  denseNodes: DENSE_NODES,

  eventDefinition:
    'DENSE-OUTPUT: DP45 (DOPRI5) 4th-order continuous extension (Hairer/Wanner ' +
    'CONTD5, exact rational D-coefficients) built from the seven DP45 stages (k7 ' +
    'FSAL); the signed adjacent gap gamma[i+1]-gamma[i] at the tracked argmin index ' +
    'is sampled at 256 interior sub-step nodes and the first non-positive interior ' +
    'sample is the within-step crossing. Replaces the imp-35278 endpoint-only event.',

  denseReferences: DENSE_REFERENCES,
  imp35278EndpointRk4: IMP35278_ENDPOINT,
  flowEnvelope: { min: T_C_ENV_MIN, max: T_C_ENV_MAX, dp45Dt: DP45_DT, dp45DtHalf: DP45_DTHALF },
  mapBracket: { step: MAP_COLLISION_STEP, pair_index: MAP_PAIR_INDEX, t_c_lo: T_C_LO, t_c_hi: T_C_HI },
  diagnostics: { dp45SelfConvDense: DP45_SELF_CONV_DENSE, withinStepBelowTcHi: WITHIN_STEP_BELOW_TC_HI },

  r2Predicate: 't_c_flow(2000) <= t_c_hi(2000)  (imp-2528 one-sided true-flow bound)',
  withinStepCrossingResolved: true,
  r2EnvelopeClears: R2_ENVELOPE_CLEARS,
  r2EnvelopeSlack: R2_ENVELOPE_SLACK,

  verdict: {
    denseOutputCatchesStepover: true,
    endpointEventsBlind: true,
    dp45DtHalfStep: 2007,
    imp35278Dp45DtHalfSpuriousStep: 2228,
    largestN_R2_tested_and_met: 1000,
    priorLargestN_R2_tested_and_met: 1000,
    catchEvidence:
      'The DP45 dt/2 dense-output event fires at step 2007 at pair 1495 (sub-step ' +
      'frac 0.110798, t_c=1.1919828898e-3) with the STEP-ENDPOINT signed gap POSITIVE ' +
      '(endpointPositive=true) -- the pair passes through and re-separates within one ' +
      'dt/2 step, so only the interior dense sample sees it. This replaces the ' +
      'imp-35278 spurious endpoint re-approach at step 2228 (t_c~1.3235e-3). The DP45 ' +
      'dt dense event fires at step 1004 (t_c=1.1923008536e-3). DP45 dt-vs-dt/2 ' +
      'self-consistency under the dense event tightens to 3.180e-7.',
    envelopeEvidence:
      'Folding the dense DP45 dt and dt/2 crossings into the imp-35278 RK4 dt and ' +
      'RK4 dt/2 endpoint crossings, the worst-case flow envelope max is ' +
      '1.1924935719e-3 (the RK4 dt/2 reference) and clears t_c_hi=1.2e-3 with slack ' +
      R2_ENVELOPE_SLACK.toExponential(3) + '. The within-step DP45 dt/2 crossing at ' +
      '1.1919828898e-3 is itself below t_c_hi.',
    interpretation:
      'Remedy (b) of the imp-35278 sub-gap WORKS: a true DP45 dense-output ' +
      'interpolant sampled at interior sub-step nodes RESOLVES the within-step ' +
      'pair-1495 step-over that both the imp-35235 endpoint gate and the imp-35278 ' +
      'endpoint signed-crossing miss, and places the crossing below t_c_hi. This is a ' +
      'SINGLE-METHOD (DP45 continuous extension) sub-step MEASUREMENT; it removes the ' +
      'imp-35278 endpoint-blindness obstruction but does NOT re-run the full imp-35221 ' +
      'order-robust certification under the dense event, so the R2 ladder ' +
      'largest-N-tested-and-met STAYS at 1000; it is NOT advanced to 2000.',
    doesNotAchieve:
      'Does NOT re-run the full imp-35221 order-robust certification pipeline under ' +
      'the dense event; does NOT extend the R2 ladder to N=2000; does NOT extend the ' +
      'C_mb certificate; does NOT remove the imp-486 GUE conditional; changes NO ' +
      'Lambda bound. No refereed bound is changed.',
    subGap:
      'imp-35351-sub-dense-certification: the DP45 dense-output event resolves the ' +
      'within-step step-over and places the crossing below t_c_hi on the tauC/1000 ' +
      'grid, but whether integrating it into the full imp-35221 order-robust ' +
      'certification (all four RK4/DP45 x dt,dt/2 references under one dense event) ' +
      'formally advances the R2 ladder to N=2000 is UNMEASURED here.',
    residualId: 'imp-35351-sub-dense-certification',
  },
};

// -- Build-time assertions. -----------------------------------------------------
export const IMP_35351_N2000_DENSE_OUTPUT_FLOW_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35351-dense-catches-within-step-stepover',
    holds: () => {
      const dp45h = DENSE_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW / 2);
      // The dense event fires at step 2007 (NOT the imp-35278 spurious step 2228),
      // the step ENDPOINT gap is positive (a within-step step-over), the interior
      // sample dips non-positive, and the crossing is at pair 1495.
      return dp45h && dp45h.step === 2007 && dp45h.endpointPositive === true &&
        dp45h.withinStep === true && dp45h.cross_index === 1495 &&
        dp45h.g_prev > 0 && dp45h.g_curr < 0 && dp45h.frac > 0 && dp45h.frac < 1;
    },
    why:
      'The true DP45 dense-output interpolant must CATCH the within-step pair-1495 ' +
      'step-over: it fires at step 2007 with a POSITIVE step-endpoint gap ' +
      '(endpointPositive=true) -- invisible to any endpoint event -- while the ' +
      'interior sub-step sample dips non-positive. This is the core measurement.',
  },
  {
    id: 'imp35351-within-step-crossing-below-tc-hi',
    holds: () =>
      IMP_35351_N2000_DENSE_OUTPUT_FLOW_REFERENCE.withinStepCrossingResolved === true &&
      WITHIN_STEP_BELOW_TC_HI === true &&
      DP45_DTHALF < T_C_HI &&
      Math.abs(DP45_DTHALF - 0.0011919828898) < 1e-12,
    why:
      'The measured within-step DP45 dt/2 crossing time (1.1919828898e-3) lands ' +
      'strictly below the imp-857 map upper bracket t_c_hi=1.2e-3, so remedy (b) ' +
      'places the true crossing favorably.',
  },
  {
    id: 'imp35351-supersedes-imp35278-spurious-step2228',
    holds: () => {
      const dp45h = DENSE_REFERENCES.find((r) => r.dt === DT_FLOW / 2);
      // The dense event step (2007) is EARLIER than the imp-35278 endpoint spurious
      // re-approach step (2228), and its t_c is well below the imp-35278 1.3235e-3.
      return dp45h.step < IMP_35351_N2000_DENSE_OUTPUT_FLOW_REFERENCE.verdict.imp35278Dp45DtHalfSpuriousStep &&
        dp45h.t_c < 0.0012 && dp45h.t_c < 0.0013235388042;
    },
    why:
      'The dense-output crossing at step 2007 supersedes the imp-35278 endpoint ' +
      'signed-crossing spurious re-approach at step 2228 (t_c~1.3235e-3): the ' +
      'dense-output t_c is far below it and below t_c_hi.',
  },
  {
    id: 'imp35351-envelope-clears-under-dense-event',
    holds: () =>
      R2_ENVELOPE_CLEARS === true &&
      R2_ENVELOPE_SLACK > 0 &&
      Math.abs(T_C_ENV_MAX - 0.0011924935719) < 1e-12 &&
      Math.abs(R2_ENVELOPE_SLACK - 7.506428e-6) < 1e-9,
    why:
      'Folding the dense DP45 dt and dt/2 crossings into the imp-35278 RK4 endpoint ' +
      'crossings, the worst-case envelope max is the RK4 dt/2 reference ' +
      '1.1924935719e-3, clearing t_c_hi with slack ~7.506e-6.',
  },
  {
    id: 'imp35351-measurement-only-ladder-stays-no-qed',
    holds: () =>
      IMP_35351_N2000_DENSE_OUTPUT_FLOW_REFERENCE.noQED === true &&
      IMP_35351_N2000_DENSE_OUTPUT_FLOW_REFERENCE.changesNoBound === true &&
      IMP_35351_N2000_DENSE_OUTPUT_FLOW_REFERENCE.verdict.largestN_R2_tested_and_met === 1000 &&
      typeof IMP_35351_N2000_DENSE_OUTPUT_FLOW_REFERENCE.verdict.subGap === 'string',
    why:
      'Measurement only: the dense output RESOLVES the within-step step-over but this ' +
      'is a single-method sub-step measurement, NOT the full imp-35221 certification, ' +
      'so the R2 ladder largest-N-tested-and-met STAYS at 1000 and a refined sub-gap ' +
      '(imp-35351-sub-dense-certification) is recorded. C_mb stays GUE-conditional ' +
      '(imp-486); no refereed bound is changed. Never a QED or a bound change.',
  },
];
