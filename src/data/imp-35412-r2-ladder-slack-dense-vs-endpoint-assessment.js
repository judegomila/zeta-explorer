/**
 * @module imp-35412-r2-ladder-slack-dense-vs-endpoint-assessment
 * @fileoverview imp-35412: ASSESSMENT of which N=2000 collision time the R2
 * one-sided true-flow ladder slack in Imp35288R2FlowLadderSlackViz RUNGS[5]
 * SHOULD report -- the imp-35324 endpoint DP45 dt-over-2 worst-case
 * t_c = 1.1999384320e-3 (currently baked, slack +6.16e-8) or the LATER imp-35351
 * DP45 CONTD5 dense-output interior crossing t_c = 1.1919828898e-3 (which the
 * ticket notes would give a larger ~8.0e-6 slack).
 *
 * THE QUESTION
 * -----------
 * imp-35359 confirmed RUNGS[5] bakes the imp-35324 endpoint DP45 dt-over-2
 * worst-case (1.1999384320e-3), giving a razor-thin slack t_c_hi - t_c_flow =
 * +6.16e-8. imp-35351 then built a true DP45 continuous-extension (CONTD5)
 * interpolant and caught the pair-1495 WITHIN-STEP step-over at step 2007 with a
 * crossing time 1.1919828898e-3 -- BELOW both the RK4 dt-over-2 endpoint
 * (1.19236e-3) and the endpoint DP45 dt-over-2 (1.19994e-3). Should the ladder
 * slack adopt the dense interior crossing instead of the endpoint worst-case?
 *
 * VERDICT: NO -- KEEP the imp-35324 endpoint DP45 dt-over-2 worst-case
 * ------------------------------------------------------------------------
 * The R2 predicate is a ONE-SIDED UPPER bound t_c_flow(N) <= t_c_hi(N)
 * (imp-2528). For a one-sided upper bound the CONSERVATIVE worst case is the
 * LARGEST tested collision time -- the value closest to t_c_hi from below, which
 * yields the SMALLEST (most honest) slack. Three reasons the dense crossing must
 * NOT replace the endpoint value in the slack denominator:
 *
 *   (R1) DIRECTION. 1.1999384320e-3 (endpoint) > 1.1919828898e-3 (dense), so
 *        adopting the dense crossing REPLACES the conservative +6.16e-8 margin
 *        with an over-optimistic +8.0e-6 margin -- it UNDER-states the
 *        endpoint-quantization risk that the slack exists to bound.
 *
 *   (R2) NOT-EVEN-THE-DENSE-WORST-CASE. Within imp-35351's OWN dense-output
 *        envelope the DP45 dt-over-2 interior crossing 1.1919828898e-3 is NOT
 *        the worst case: folding it with the RK4 dt and RK4 dt-over-2 endpoint
 *        crossings, the dense envelope MAX is the RK4 dt-over-2 reference
 *        1.1924935719e-3 (slack +7.506e-6). The naive ~8.0e-6 the ticket quotes
 *        is 1.2e-3 minus the DP45 dt-over-2 dense crossing, which is not the
 *        envelope max, so it double-mis-selects (wrong reference AND wrong grid).
 *
 *   (R3) APPLES-vs-ORANGES GRID. 1.1999384320e-3 is a FINER-grid (dt = tauC/4000,
 *        imp-35324) ENDPOINT-gate detection where NO within-step step-over occurs
 *        (the finer grid straddles the dip). 1.1919828898e-3 is a COARSER-grid
 *        (dt = tauC/1000, imp-35351) INTERIOR dense crossing. They measure the
 *        collision under different resolutions and detection roles; they are not
 *        two readings of one event that could be swapped in place.
 *
 * ROLE OF THE DENSE CROSSING. The imp-35351 dense-output crossing is the more
 * physically FAITHFUL detection of the true within-step collision time (it
 * resolves the interior dip that endpoint methods are blind to) and it lands
 * strictly below t_c_hi -- valuable as a DIAGNOSTIC that the step-over is real
 * and favorably placed. But a more-accurate (earlier) collision time is the
 * WRONG quantity for a conservative worst-case slack: over-estimating t_c and
 * still clearing t_c_hi is the safe reading; under-estimating it is not.
 *
 * CONSEQUENCE. RUNGS[5] should KEEP t_c_flow = 1.1999384320e-3 (slack +6.16e-8);
 * the N=2000 rung stays PROVISIONAL and the ladder stays robustly certified only
 * through N=1000 (imp-35221/imp-35324). The dense crossing 1.1919828898e-3 and
 * the dense-envelope max 1.1924935719e-3 are recorded (imp-35351) as diagnostics,
 * not adopted as the slack denominator.
 *
 * SCOPE: ASSESSMENT ONLY. Recommends NO page edit (RUNGS[5] already correct per
 * imp-35359); does NOT advance the R2 ladder (stays N=1000); does not touch the
 * imp-486 GUE conditional. Changes NO bound. No refereed bound is changed
 * . NO QED.
 *
 * SYNTAX NOTE: "dt-over-2" prose used in place of the slash form to avoid the
 * star-slash JSDoc terminator.
 *
 * @see imp-35324  finer-grid (tauC/4000) endpoint DP45 dt-over-2 worst-case (baked in RUNGS[5])
 * @see imp-35351  DP45 CONTD5 dense-output within-step crossing (the candidate value)
 * @see imp-35359  confirmed RUNGS[5] bakes the imp-35324 endpoint worst-case (+6.16e-8)
 */

// Map upper-bracket endpoint (imp-857) that the one-sided bound is tested against.
const T_C_HI = 0.0012;

// imp-35324 FINER-grid (dt = tauC/4000) ENDPOINT DP45 dt-over-2 worst-case --
// the value RUNGS[5] currently bakes for the reported slack.
const ENDPOINT_DP45_DT_HALF = 0.0011999384320;

// imp-35351 COARSER-grid (dt = tauC/1000) DP45 CONTD5 dense-output INTERIOR
// crossing (step 2007, pair 1495) -- the candidate value the ticket assesses.
const DENSE_DP45_DT_HALF = 0.0011919828898;

// imp-35351 dense-output ENVELOPE worst case (RK4 dt-over-2 endpoint crossing) --
// the TRUE max of the dense-folded envelope, NOT the DP45 dt-over-2 crossing.
const DENSE_ENVELOPE_MAX = 0.0011924935719;

const endpointSlack = T_C_HI - ENDPOINT_DP45_DT_HALF; // +6.1568e-8 (baked, conservative)
const denseDp45Slack = T_C_HI - DENSE_DP45_DT_HALF; // +8.0171e-6 (naive ticket figure)
const denseEnvelopeSlack = T_C_HI - DENSE_ENVELOPE_MAX; // +7.5064e-6 (honest dense worst case)

export const IMP_35412_R2_LADDER_SLACK_DENSE_VS_ENDPOINT_ASSESSMENT = {
  ticket: 'imp-35412',
  category: 'accuracy',
  verdict: 'KEEP endpoint worst-case 1.1999384320e-3 in RUNGS[5]; do NOT adopt the dense interior crossing',
  question:
    'Should the R2 N=2000 ladder slack report the imp-35324 endpoint DP45 dt-over-2 ' +
    'worst-case (1.1999384320e-3) or the imp-35351 dense-output interior crossing (1.1919828898e-3)?',
  predicate: 't_c_flow(2000) <= t_c_hi(2000)  (imp-2528 one-sided true-flow upper bound)',
  candidates: {
    endpointDp45DtHalf: ENDPOINT_DP45_DT_HALF,
    denseDp45DtHalf: DENSE_DP45_DT_HALF,
    denseEnvelopeMax: DENSE_ENVELOPE_MAX,
  },
  slacks: {
    endpoint: endpointSlack, // conservative, currently baked
    denseDp45Naive: denseDp45Slack, // the ticket ~8.0e-6, wrong reference selection
    denseEnvelope: denseEnvelopeSlack, // honest dense-envelope worst case ~7.51e-6
  },
  reasoning: {
    R1_direction:
      'One-sided UPPER bound: worst case = LARGEST collision time; endpoint (1.1999384320e-3) > ' +
      'dense (1.1919828898e-3), so the dense value under-states the margin risk.',
    R2_notDenseWorstCase:
      'Within the imp-35351 dense envelope the DP45 dt-over-2 crossing is NOT the max -- the ' +
      'RK4 dt-over-2 endpoint 1.1924935719e-3 is (slack +7.506e-6); the ticket ~8.0e-6 mis-selects.',
    R3_gridMismatch:
      'Endpoint value is a tauC/4000 finer-grid endpoint-gate detection (no step-over); dense value ' +
      'is a tauC/1000 coarser-grid interior crossing -- different resolutions, not swappable in place.',
    role:
      'The dense crossing is the more faithful physical collision time (a valuable DIAGNOSTIC that the ' +
      'step-over is real and below t_c_hi), but a more-accurate/earlier t_c is the WRONG quantity for a ' +
      'conservative worst-case slack.',
  },
  recommendation:
    'RUNGS[5] keeps t_c_flow=1.1999384320e-3 (slack +6.16e-8); N=2000 stays PROVISIONAL, ladder ' +
    'certified through N=1000; dense crossing recorded (imp-35351) as diagnostic, not as the slack.',
  scope: 'ASSESSMENT ONLY; recommends NO page edit; changes NO bound; ladder stays N=1000; NO QED',
};

// -- Build-time assertions (import-light; only baked literals). ------------------
export const IMP_35412_R2_LADDER_SLACK_DENSE_VS_ENDPOINT_ASSESSMENT_ASSERTIONS = [
  {
    name: 'imp-35412: endpoint worst-case exceeds the dense interior crossing (one-sided-upper direction)',
    run: () => ENDPOINT_DP45_DT_HALF > DENSE_DP45_DT_HALF && ENDPOINT_DP45_DT_HALF > DENSE_ENVELOPE_MAX,
    detail:
      'For a one-sided upper bound the conservative worst case is the LARGEST collision time; the ' +
      'endpoint DP45 dt-over-2 (1.1999384320e-3) is larger than both the dense DP45 dt-over-2 crossing ' +
      'and the dense-envelope max, so keeping it is the conservative choice.',
  },
  {
    name: 'imp-35412: baked endpoint slack is the razor-thin +6.16e-8',
    run: () => endpointSlack > 0 && Math.abs(endpointSlack - 6.15680e-8) < 1e-12,
    detail: 'The kept RUNGS[5] slack t_c_hi - 1.1999384320e-3 = +6.156800e-8, matching imp-35324/imp-35359.',
  },
  {
    name: 'imp-35412: adopting the dense crossing would inflate the slack ~130x',
    run: () =>
      Math.abs(denseDp45Slack - 8.0171102e-6) < 1e-11 &&
      denseDp45Slack / endpointSlack > 100,
    detail:
      'The dense DP45 dt-over-2 crossing would give slack +8.0171e-6, over 100x the conservative ' +
      'endpoint +6.16e-8 -- an over-optimistic margin that hides the endpoint-quantization worst case.',
  },
  {
    name: 'imp-35412: the DP45 dt-over-2 dense crossing is NOT the dense-envelope worst case',
    run: () =>
      DENSE_ENVELOPE_MAX > DENSE_DP45_DT_HALF &&
      Math.abs(denseEnvelopeSlack - 7.5064281e-6) < 1e-11,
    detail:
      'The dense-envelope max is the RK4 dt-over-2 endpoint 1.1924935719e-3 (slack +7.5064e-6), above ' +
      'the DP45 dt-over-2 crossing -- so the naive ~8.0e-6 figure mis-selects the reference.',
  },
  {
    name: 'imp-35412: all three candidate crossings clear t_c_hi (bound holds regardless of choice)',
    run: () =>
      ENDPOINT_DP45_DT_HALF < T_C_HI && DENSE_DP45_DT_HALF < T_C_HI && DENSE_ENVELOPE_MAX < T_C_HI,
    detail:
      'The predicate t_c_flow < t_c_hi holds for every candidate; the assessment is about which slack to ' +
      'REPORT (conservatism), not whether the N=2000 rung clears -- it does, provisionally.',
  },
];

// Execute at import so any regression trips the build-time assertion sweep.
for (const a of IMP_35412_R2_LADDER_SLACK_DENSE_VS_ENDPOINT_ASSESSMENT_ASSERTIONS) {
  if (!a.run()) {
    throw new Error(`[imp-35412 dense-vs-endpoint assessment] FAILED: ${a.name}`);
  }
}
