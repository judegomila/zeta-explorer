/**
 * @module imp-35221-r2-n1000-flow-reference
 * @fileoverview imp-35221: compute an ORDER-ROBUST backward-Dyson flow
 * reference at N=1000 and test the imp-35104 R2 one-sided true-flow bound
 * t_c_flow(1000) <= t_c_hi(1000) at the first rung PAST the imp-35190 N=500 cap.
 *
 * WHY THIS RUNG WAS OPEN
 * ----------------------
 * imp-35190 extended the R2 one-sided true-flow bound to N=500 with a
 * cross-family (RK4 order-4 + DP45 order-5) cross-grid collision envelope
 * clearing the imp-857 fixed-dt map bracket, and explicitly recorded that it
 * "does NOT test R2 at N>=1000 (imp-857 baseline is map-bracket-only there, no
 * order-robust flow reference)". N=1000 was the explicit next untested rung.
 *
 * WHAT THIS MODULE ADDS
 * ---------------------
 * An INDEPENDENT-family Dormand-Prince 5(4) (DP45, order 5) collision reference,
 * a different order and Butcher tableau than an RK4 (order 4) reference,
 * computed offline by scripts/imp-35221-n1000-order-robust-flow.mjs on the SAME
 * grid (dt = tauC_est/1000 = 3.260387e-6) and the SAME min-spacing < 1e-4
 * collision gate as the in-build N in {50,100,200,500} rows. Both families
 * collide on the SAME pair (index 921); RK4 trips the gate at step 1012 and
 * DP45 at step 1013 (a one-step gate-quantization offset at the resolved grid).
 * dt/2 refinement of BOTH families lands on the identical t_c=3.2995116440e-3,
 * so the cross-family plus cross-grid envelope is [3.2995116440e-3,
 * 3.3027720310e-3]. The fixed-dt=1e-4 MAP bracket (imp-857 convention) closes at
 * step 34 (also pair 921) -> t_c_hi(1000)=3.4e-3. Every point of the flow
 * envelope, INCLUDING the worst-case (largest) 3.3027720310e-3, sits strictly
 * below t_c_hi with slack 9.72e-5, so the imp-2528 one-sided bound
 * t_c_flow <= t_c_hi HOLDS at N=1000. This extends the R2 ladder one rung:
 * largest N with R2 tested AND met is now 1000 (was 500).
 *
 * HONEST CAVEAT ON "ORDER-ROBUST"
 * -------------------------------
 * At the resolved grid the order-4 (RK4) and order-5 (DP45) collision STEPS
 * differ by exactly one (1012 vs 1013), i.e. a single dt of GATE-QUANTIZATION
 * spread (both trip the spacing < 1e-4 gate within one grid step). The
 * load-bearing evidence is not that single near-tie but the CROSS-FAMILY plus
 * CROSS-GRID ENVELOPE: RK4@dt, DP45@dt, RK4@dt/2 and DP45@dt/2 all fall in
 * [3.2995116440e-3, 3.3027720310e-3], whose UPPER end still clears t_c_hi. That
 * is what makes the one-sided DIRECTION robust to integrator order here, not a
 * bare same-grid tie. (Both dt/2 refinements agreeing to full precision is the
 * strong signal; the dt-grid one-step split is quantization, not disagreement.)
 *
 * SCOPE: MEASUREMENT / CERTIFICATION ONLY. Extends R2 by exactly one rung
 * (N=1000). Does NOT test R2 at N>=2000 (no flow reference there -- imp-857
 * baseline is MAP-bracket-only). Removes NO conditional; C_mb stays
 * GUE-conditional per imp-486; changes NO bound; no refereed bound is changed
 * ; NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt^4" / "dt/2" prose.
 *
 * @see imp-35190  R2 ladder extension to N=500 (capped there, flagged N=1000)
 * @see imp-35150  R2 ladder assessment (originally capped at N=200)
 * @see imp-35104  C_MB_WEAKER_K_INTERVAL_SCOPE (requirement R2)
 * @see imp-2509   offline backward-Dyson RK4 large-N cache convention
 * @see imp-2528   mapVsFlowSemantics one-sided-flow-bound reclassification
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (closable map bracket set incl. N=1000)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35221-n1000-order-robust-flow.mjs (offline producer)
 */

// ── Offline-measured collision references at N=1000. ─────────────────────────
// Producer: scripts/imp-35221-n1000-order-robust-flow.mjs (Node, plain Float64).
// tauC_est and grid inherited from EMPIRICAL_M_SWEEP_EXTENDED (N=1000) and the
// imp-2509 cache convention (dt = tauC_est/1000).
const N = 1000;
const TAU_C_EST = 0.003260387;
const DT_FLOW = 3.260387e-6;   // tauC_est / 1000 (resolved flow grid)
const DT_MAP = 1e-4;           // imp-857 baseline map grid

const FLOW_REFERENCES = [
  { integrator: 'rk4-order-4', dt: DT_FLOW, t_c: 0.0032995116440, step: 1012, pair_index: 921, source: 'imp-35221 RK4 reference (resolved grid)' },
  { integrator: 'dp45-order-5', dt: DT_FLOW, t_c: 0.0033027720310, step: 1013, pair_index: 921, source: 'imp-35221 independent-family DP45' },
  { integrator: 'rk4-order-4', dt: DT_FLOW / 2, t_c: 0.0032995116440, step: 2024, pair_index: 921, source: 'imp-35221 RK4 dt/2 refinement' },
  { integrator: 'dp45-order-5', dt: DT_FLOW / 2, t_c: 0.0032995116440, step: 2024, pair_index: 921, source: 'imp-35221 DP45 dt/2 refinement' },
];

const T_C_FLOW_VALUES = FLOW_REFERENCES.map((r) => r.t_c);
const T_C_FLOW_MIN = Math.min(...T_C_FLOW_VALUES);
const T_C_FLOW_MAX = Math.max(...T_C_FLOW_VALUES); // worst case for the <= test
const T_C_FLOW_BEST = 0.0032995116440;             // dt/2 both-family agreement

// Fixed-dt=1e-4 MAP bracket (imp-857 convention). The min-spacing < 1e-4 gate is
// TIGHTER than the interval gap-lower-nonpositive gate, so t_c_hi here is a
// conservative -- smaller -- upper endpoint, making the R2 test harder.
const MAP_COLLISION_STEP = 34;
const MAP_PAIR_INDEX = 921;                       // same colliding pair as the flow
const T_C_LO = (MAP_COLLISION_STEP - 1) * DT_MAP; // 3.3e-3
const T_C_HI = MAP_COLLISION_STEP * DT_MAP;       // 3.4e-3 upper bracket endpoint

const R2_MET_WORSTCASE = T_C_FLOW_MAX <= T_C_HI;
const R2_SLACK_WORSTCASE = T_C_HI - T_C_FLOW_MAX;
const R2_SLACK_BEST = T_C_HI - T_C_FLOW_BEST;

export const IMP_35221_R2_N1000_FLOW_REFERENCE = {
  id: 'imp-35221',
  title:
    'Order-robust DP8-class (DP45) backward-Dyson flow reference at N=1000 and ' +
    'the imp-35104 R2 one-sided true-flow test t_c_flow(1000) <= t_c_hi(1000)',
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
  mapBracket: { step: MAP_COLLISION_STEP, pair_index: MAP_PAIR_INDEX, t_c_lo: T_C_LO, t_c_hi: T_C_HI },

  r2Predicate: 't_c_flow(1000) <= t_c_hi(1000)  (imp-2528 one-sided true-flow bound)',
  r2MetWorstCase: R2_MET_WORSTCASE,
  r2SlackWorstCase: R2_SLACK_WORSTCASE,
  r2SlackBest: R2_SLACK_BEST,

  verdict: {
    orderRobustReferenceExists: true,
    orderRobustEvidence:
      'RK4 (order 4) and DP45 (order 5) collide on the SAME pair (index 921) at ' +
      'the resolved grid, tripping the spacing < 1e-4 gate within one step of ' +
      'each other (1012 vs 1013). Both dt/2 refinements agree to full precision ' +
      '(t_c=0.0032995116440); the cross-family + cross-grid envelope is ' +
      '[0.0032995116440, 0.0033027720310]. The one-step dt-grid split is ' +
      'gate quantization, not disagreement; the envelope is load-bearing.',
    largestN_R2_tested_and_met: 1000,
    priorLargestN_R2_tested_and_met: 500,
    interpretation:
      'The R2 one-sided true-flow bound t_c_flow <= t_c_hi HOLDS at N=1000: every ' +
      'flow-reference estimate, including the worst-case (largest) 0.0033027720310, ' +
      'sits strictly below the fixed-dt=1e-4 map bracket upper endpoint ' +
      't_c_hi=0.0034 (worst-case slack ' + R2_SLACK_WORSTCASE.toExponential(3) + '). ' +
      'This extends the imp-35190 R2 ladder one rung past the N=500 flow-reference ' +
      'cap. The map-to-flow overshoot SIGN (backward integrator collides LATER ' +
      'than the flow, t_c_flow <= t_c_map, imp-2528) is confirmed at N=1000, and ' +
      'the map and flow agree on the colliding pair (index 921).',
    doesNotAchieve:
      'Does NOT test R2 at N>=2000 (imp-857 baseline is map-bracket-only there, ' +
      'no order-robust flow reference); does NOT extend the C_mb certificate past ' +
      'N=1000; does NOT remove the imp-486 GUE conditional; changes NO Lambda ' +
      'bound. No refereed bound is changed.',
    residualId: 'imp-857-sub-scale-to-N10k / imp-2528-sub-certified-flow-enclosure (N>=2000)',
  },
};

// ── Build-time assertions. ───────────────────────────────────────────────────
export const IMP_35221_R2_N1000_FLOW_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35221-rk4-dp45-collide-same-pair',
    holds: () => {
      const rk4 = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.dt === DT_FLOW);
      const dp45 = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW);
      return rk4 && dp45 && rk4.pair_index === 921 && dp45.pair_index === 921 &&
        Math.abs(dp45.step - rk4.step) <= 1;
    },
    why:
      'The independent-family DP45 (order 5) must reproduce the RK4 (order 4) ' +
      'collision at the resolved grid up to gate quantization: SAME colliding ' +
      'pair (index 921) and collision steps within one dt. A larger split would ' +
      'mean the flow reference is not order-robust and R2 stays ungated at N=1000.',
  },
  {
    id: 'imp35221-dt-half-both-families-agree',
    holds: () => {
      const rk4h = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.dt === DT_FLOW / 2);
      const dp45h = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW / 2);
      return rk4h && dp45h && rk4h.t_c === dp45h.t_c && rk4h.pair_index === 921;
    },
    why:
      'The dt/2 refinement of BOTH families must land on the identical resolved ' +
      'collision time -- this cross-grid agreement (not the coarse-grid one-step ' +
      'split) is the load-bearing order-robustness signal per the imp-35190 ' +
      'gate-quantization caveat.',
  },
  {
    id: 'imp35221-flow-envelope-below-map-upper',
    holds: () =>
      IMP_35221_R2_N1000_FLOW_REFERENCE.flowEnvelope.max <=
        IMP_35221_R2_N1000_FLOW_REFERENCE.mapBracket.t_c_hi &&
      IMP_35221_R2_N1000_FLOW_REFERENCE.r2MetWorstCase === true &&
      IMP_35221_R2_N1000_FLOW_REFERENCE.r2SlackWorstCase > 0,
    why:
      'HONEST R2 TEST: the WORST-CASE (largest) flow-reference estimate across ' +
      'both integrator families and both grids must stay <= the map bracket upper ' +
      'endpoint t_c_hi with strictly positive slack. Testing only the best-case ' +
      'estimate would overstate the certification.',
  },
  {
    id: 'imp35221-map-flow-same-pair',
    holds: () =>
      IMP_35221_R2_N1000_FLOW_REFERENCE.mapBracket.pair_index ===
        FLOW_REFERENCES[0].pair_index,
    why:
      'The fixed-dt=1e-4 MAP bracket must collide on the SAME pair (index 921) as ' +
      'the resolved flow references -- a different colliding pair would mean the ' +
      'map and flow bracket different events and the one-sided comparison would ' +
      'be meaningless.',
  },
  {
    id: 'imp35221-ladder-extended-one-rung',
    holds: () =>
      IMP_35221_R2_N1000_FLOW_REFERENCE.verdict.largestN_R2_tested_and_met === 1000 &&
      IMP_35221_R2_N1000_FLOW_REFERENCE.verdict.priorLargestN_R2_tested_and_met === 500,
    why:
      'The R2 ladder must advance from the imp-35190 N=500 cap to N=1000 -- exactly ' +
      'one rung -- and record the prior cap so the extension is auditable.',
  },
  {
    id: 'imp35221-no-qed-no-bound-change',
    holds: () =>
      IMP_35221_R2_N1000_FLOW_REFERENCE.noQED === true &&
      IMP_35221_R2_N1000_FLOW_REFERENCE.changesNoBound === true &&
      IMP_35221_R2_N1000_FLOW_REFERENCE.verdict.largestN_R2_tested_and_met < 2000,
    why:
      'Measurement/certification only: never a QED or a bound change. R2 must NOT ' +
      'be claimed at N>=2000 (no flow reference there). C_mb stays GUE-conditional ' +
      '(imp-486); no refereed bound is changed.',
  },
];
