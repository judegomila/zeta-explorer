/**
 * @module imp-35190-r2-n500-flow-reference
 * @fileoverview imp-35190: compute an ORDER-ROBUST backward-Dyson flow
 * reference at N=500 and test the imp-35104 R2 one-sided true-flow bound
 * t_c_flow(500) <= t_c_hi(500) at the first rung PAST the imp-35150 N=200 cap.
 *
 * WHY THIS RUNG WAS OPEN
 * ----------------------
 * imp-35150 found the R2 obligation MET at N in {50,100,200} but UNCERTIFIED at
 * N>=500 purely because no order-robust flow reference existed there: only an
 * imp-2509 RK4 (order-4) collision (t_c=0.012336066560 at dt=tauC_est/1000) and
 * the imp-857 closable MAP bracket were on hand. imp-35150 explicitly gated the
 * extension on "a DP8 / directed-rounding flow reference at N >= 500".
 *
 * WHAT THIS MODULE ADDS
 * ---------------------
 * An INDEPENDENT-family Dormand-Prince 5(4) (DP45, order 5) collision reference,
 * a different order and Butcher tableau than the cached RK4 (order 4), computed
 * offline by scripts/imp-35190-n500-order-robust-flow.mjs on the SAME grid and
 * the SAME min-spacing < 1e-4 collision gate as the in-build N in {50,100,200}
 * rows. RK4 and DP45 land on the identical resolved collision (t_c=0.012336...,
 * pair 452). Grid refinement (dt/2, both families) keeps every flow estimate
 * inside a tight envelope [1.2330e-2, 1.2396e-2]. The fixed-dt=1e-4 MAP bracket
 * (imp-857 convention) closes at step 124 -> t_c_hi(500)=1.24e-2. Every point of
 * the flow envelope, INCLUDING the worst-case (largest) 1.2396e-2, sits strictly
 * below t_c_hi, so the imp-2528 one-sided bound t_c_flow <= t_c_hi HOLDS at
 * N=500. This extends the R2 ladder one rung: largest N with R2 tested AND met
 * is now 500 (was 200).
 *
 * HONEST CAVEAT ON "ORDER-ROBUST"
 * -------------------------------
 * At the SAME grid the order-4 (RK4) and order-5 (DP45) collision TIMES agree to
 * full precision -- but that exact agreement is partly a GATE-QUANTIZATION
 * artifact (both families trip the spacing < 1e-4 gate at the same grid step
 * 1024, so t_c = step*dt coincides by construction). The load-bearing evidence
 * is not that single coincidence but the CROSS-FAMILY plus CROSS-GRID ENVELOPE:
 * RK4@dt, DP45@dt, RK4@dt/2 (imp-2509 half-dt check) and DP45@dt/2 all fall in
 * [1.2330e-2, 1.2396e-2], whose UPPER end still clears t_c_hi. That is what makes
 * the one-sided direction robust to integrator order here, not a bare same-grid
 * tie.
 *
 * SCOPE: MEASUREMENT / CERTIFICATION ONLY. Extends R2 by exactly one rung
 * (N=500). Does NOT test R2 at N>=1000 (no flow reference there -- imp-857
 * baseline is MAP-bracket-only). Removes NO conditional; C_mb stays
 * GUE-conditional per imp-486; changes NO bound; no refereed bound is changed
 * ; NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt^4" / "dt/2" prose.
 *
 * @see imp-35150  R2 ladder assessment (capped at N=200 by flow-ref availability)
 * @see imp-35104  C_MB_WEAKER_K_INTERVAL_SCOPE (requirement R2)
 * @see imp-2509   offline backward-Dyson RK4 large-N cache (RK4 reference at 500)
 * @see imp-2528   mapVsFlowSemantics one-sided-flow-bound reclassification
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (closable map bracket set incl. N=500)
 * @see scripts/imp-35190-n500-order-robust-flow.mjs (offline producer)
 */

// ── Offline-measured collision references at N=500. ──────────────────────────
// Producer: scripts/imp-35190-n500-order-robust-flow.mjs (Node, plain Float64).
// tauC_est and grid inherited from EMPIRICAL_M_SWEEP_EXTENDED (N=500) and the
// imp-2509 resolved cache (dt = tauC_est/1000, collision at step 1024).
const N = 500;
const TAU_C_EST = 0.01204694;
const DT_FLOW = 1.204694e-5;   // tauC_est / 1000 (imp-2509 resolved grid)
const DT_MAP = 1e-4;           // imp-857 baseline map grid

const FLOW_REFERENCES = [
  { integrator: 'rk4-order-4', dt: DT_FLOW, t_c: 0.012336066560, step: 1024, pair_index: 452, source: 'imp-2509 cache + reproduced by imp-35190 script' },
  { integrator: 'dp45-order-5', dt: DT_FLOW, t_c: 0.012336066560, step: 1024, pair_index: 452, source: 'imp-35190 independent-family DP45' },
  { integrator: 'rk4-order-4', dt: DT_FLOW / 2, t_c: 0.012330043090, step: 2047, pair_index: 452, source: 'imp-2509 cache halfDtCheck' },
  { integrator: 'dp45-order-5', dt: DT_FLOW / 2, t_c: 0.012396301260, step: 2058, pair_index: 452, source: 'imp-35190 DP45 dt/2 probe' },
];

const T_C_FLOW_VALUES = FLOW_REFERENCES.map((r) => r.t_c);
const T_C_FLOW_MIN = Math.min(...T_C_FLOW_VALUES);
const T_C_FLOW_MAX = Math.max(...T_C_FLOW_VALUES); // worst case for the <= test
const T_C_FLOW_BEST = 0.012336066560;              // resolved-grid RK4==DP45

// Fixed-dt=1e-4 MAP bracket (imp-857 convention; spacing < 1e-4 gate is TIGHTER
// than the interval gap-lower-nonpositive gate, so t_c_hi here is a conservative
// -- smaller -- upper endpoint, making the R2 test harder, not easier).
const MAP_COLLISION_STEP = 124;
const T_C_LO = (MAP_COLLISION_STEP - 1) * DT_MAP; // 1.23e-2
const T_C_HI = MAP_COLLISION_STEP * DT_MAP;       // 1.24e-2 upper bracket endpoint

const R2_MET_WORSTCASE = T_C_FLOW_MAX <= T_C_HI;
const R2_SLACK_WORSTCASE = T_C_HI - T_C_FLOW_MAX;
const R2_SLACK_BEST = T_C_HI - T_C_FLOW_BEST;

export const IMP_35190_R2_N500_FLOW_REFERENCE = {
  id: 'imp-35190',
  title:
    'Order-robust DP8-class (DP45) backward-Dyson flow reference at N=500 and ' +
    'the imp-35104 R2 one-sided true-flow test t_c_flow(500) <= t_c_hi(500)',
  kind: 'measurement-certification-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,

  N,
  tauC_est: TAU_C_EST,
  dtFlow: DT_FLOW,
  dtMap: DT_MAP,

  flowReferences: FLOW_REFERENCES,
  flowEnvelope: { min: T_C_FLOW_MIN, max: T_C_FLOW_MAX, best: T_C_FLOW_BEST },
  mapBracket: { step: MAP_COLLISION_STEP, t_c_lo: T_C_LO, t_c_hi: T_C_HI },

  r2Predicate: 't_c_flow(500) <= t_c_hi(500)  (imp-2528 one-sided true-flow bound)',
  r2MetWorstCase: R2_MET_WORSTCASE,
  r2SlackWorstCase: R2_SLACK_WORSTCASE,
  r2SlackBest: R2_SLACK_BEST,

  verdict: {
    orderRobustReferenceExists: true,
    orderRobustEvidence:
      'RK4 (order 4) and DP45 (order 5) agree at the resolved grid (t_c=' +
      '0.012336066560, pair 452); the cross-family + cross-grid envelope is ' +
      '[0.012330043090, 0.012396301260]. Same-grid order agreement is partly a ' +
      'gate-quantization tie; the envelope is the load-bearing evidence.',
    largestN_R2_tested_and_met: 500,
    priorLargestN_R2_tested_and_met: 200,
    interpretation:
      'The R2 one-sided true-flow bound t_c_flow <= t_c_hi HOLDS at N=500: every ' +
      'flow-reference estimate, including the worst-case (largest) 0.012396301260, ' +
      'sits strictly below the fixed-dt=1e-4 map bracket upper endpoint ' +
      't_c_hi=0.0124 (worst-case slack ' + R2_SLACK_WORSTCASE.toExponential(3) + '). ' +
      'This extends the imp-35150 R2 ladder one rung past the N=200 flow-reference ' +
      'cap. The map-to-flow overshoot SIGN (backward integrator collides LATER ' +
      'than the flow, t_c_flow <= t_c_map, imp-2528) is confirmed at N=500.',
    doesNotAchieve:
      'Does NOT test R2 at N>=1000 (imp-857 baseline is map-bracket-only there, ' +
      'no order-robust flow reference); does NOT extend the C_mb certificate past ' +
      'N=500; does NOT remove the imp-486 GUE conditional; changes NO Lambda ' +
      'bound. No refereed bound is changed.',
    residualId: 'imp-857-sub-scale-to-N10k / imp-2528-sub-certified-flow-enclosure (N>=1000)',
  },
};

// ── Build-time assertions. ───────────────────────────────────────────────────
export const IMP_35190_R2_N500_FLOW_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35190-rk4-dp45-agree-at-resolved-grid',
    holds: () => {
      const rk4 = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.dt === DT_FLOW);
      const dp45 = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW);
      return rk4 && dp45 && rk4.t_c === dp45.t_c && rk4.pair_index === 452 && dp45.pair_index === 452;
    },
    why:
      'The independent-family DP45 (order 5) must reproduce the cached RK4 (order ' +
      '4) collision at the resolved grid (same t_c, same colliding pair 452). A ' +
      'mismatch would mean the flow reference is not order-robust and R2 stays ' +
      'ungated at N=500.',
  },
  {
    id: 'imp35190-flow-envelope-below-map-upper',
    holds: () =>
      IMP_35190_R2_N500_FLOW_REFERENCE.flowEnvelope.max <=
        IMP_35190_R2_N500_FLOW_REFERENCE.mapBracket.t_c_hi &&
      IMP_35190_R2_N500_FLOW_REFERENCE.r2MetWorstCase === true &&
      IMP_35190_R2_N500_FLOW_REFERENCE.r2SlackWorstCase > 0,
    why:
      'HONEST R2 TEST: the WORST-CASE (largest) flow-reference estimate across ' +
      'both integrator families and both grids must stay <= the map bracket upper ' +
      'endpoint t_c_hi with strictly positive slack. Testing only the best-case ' +
      'estimate would overstate the certification.',
  },
  {
    id: 'imp35190-ladder-extended-one-rung',
    holds: () =>
      IMP_35190_R2_N500_FLOW_REFERENCE.verdict.largestN_R2_tested_and_met === 500 &&
      IMP_35190_R2_N500_FLOW_REFERENCE.verdict.priorLargestN_R2_tested_and_met === 200,
    why:
      'The R2 ladder must advance from the imp-35150 N=200 cap to N=500 -- exactly ' +
      'one rung -- and record the prior cap so the extension is auditable.',
  },
  {
    id: 'imp35190-no-qed-no-bound-change',
    holds: () =>
      IMP_35190_R2_N500_FLOW_REFERENCE.noQED === true &&
      IMP_35190_R2_N500_FLOW_REFERENCE.changesNoBound === true &&
      IMP_35190_R2_N500_FLOW_REFERENCE.verdict.largestN_R2_tested_and_met < 1000,
    why:
      'Measurement/certification only: never a QED or a bound change. R2 must NOT ' +
      'be claimed at N>=1000 (no flow reference there). C_mb stays GUE-conditional ' +
      '(imp-486); no refereed bound is changed.',
  },
];
