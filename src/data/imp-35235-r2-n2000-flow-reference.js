/**
 * @module imp-35235-r2-n2000-flow-reference
 * @fileoverview imp-35235: compute an ORDER-ROBUST backward-Dyson flow
 * reference at N=2000 and test the imp-35104 R2 one-sided true-flow bound
 * t_c_flow(2000) <= t_c_hi(2000) at the first rung PAST the imp-35221 N=1000 cap.
 *
 * WHY THIS RUNG WAS OPEN
 * ----------------------
 * imp-35221 extended the R2 one-sided true-flow bound to N=1000 with a
 * cross-family (RK4 order-4 + DP45 order-5) cross-grid collision envelope
 * clearing the imp-857 fixed-dt map bracket, and explicitly recorded that it
 * "does NOT test R2 at N>=2000 (imp-857 baseline is map-bracket-only there, no
 * order-robust flow reference)". N=2000 was the explicit next untested rung.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * The imp-35221 method reproduced VERBATIM at N=2000 by
 * scripts/imp-35235-n2000-order-robust-flow.mjs on the SAME grid convention
 * (dt = tauC_est/1000 = 1.188352e-6) and the SAME min-spacing < 1e-4 collision
 * gate. Four flow references (RK4 and independent-family DP45, each at dt and
 * dt/2) plus the imp-857 fixed-dt=1e-4 MAP bracket.
 *
 * HONEST OUTCOME: PARTIAL -- R2 NOT ROBUSTLY CERTIFIED AT N=2000
 * -------------------------------------------------------------
 * On the RESOLVED (dt) grid the two families AGREE to full precision: RK4 and
 * DP45 both collide on pair 1495 at step 1004, t_c = 1.1931054080e-3, which
 * sits BELOW the map upper bracket t_c_hi = 1.2e-3 (coarse-grid slack
 * 6.894592e-6). The RK4 dt/2 refinement also lands correctly at
 * t_c = 1.1925112320e-3 (step 2007, pair 1495), likewise below t_c_hi. So THREE
 * of the four references cleanly clear the map bracket.
 *
 * BUT the fourth reference -- DP45 at dt/2 -- suffers a GATE-SKIP: at N=2000 the
 * pair-1495 gap collapses FAST (5.63e-3 -> 1.78e-3 across a single dt/2 step
 * near step 2006), and the order-5 dt/2 stages step the two zeros THROUGH each
 * other in one step -- the min gap jumps from 1.775e-3 directly to a re-sorted
 * 3.23e-2 WITHOUT ever landing in the (0, 1e-4) gate band. The gate is never
 * tripped near the true event; DP45 continues to a spurious re-approach collision
 * at step 2228, t_c = 1.3238241280e-3, which EXCEEDS t_c_hi (worst-case slack
 * -1.238241e-4). The order-4-vs-order-5 dt/2 CROSS-GRID AGREEMENT that was the
 * load-bearing signal at N=1000 therefore FAILS at N=2000, so the honest
 * worst-case envelope does NOT clear the map bracket and R2 is NOT certified here.
 *
 * WHY N=2000 IS DIFFERENT FROM N=1000
 * -----------------------------------
 * At N=1000 the resolved grid dt = tauC/1000 = 3.26e-6 was fine enough that BOTH
 * dt/2 families landed on the identical collision time. At N=2000 tauC is smaller
 * (1.188e-3 vs 3.26e-3), so the pair approaches the singularity FASTER relative
 * to the same tauC/1000 grid; the dt/2 grid is now too coarse for the order-5
 * stages to sample the singular 2/diff derivative before the crossing, and the
 * gate is stepped over. This is a resolution/gate-design limitation of the fixed
 * tauC/1000 convention at N=2000, not evidence that the true-flow collision
 * exceeds t_c_hi: the three non-skipping references all put the true event at
 * ~1.192-1.193e-3, strictly below t_c_hi = 1.2e-3.
 *
 * NET: R2 has PROVISIONAL (three-of-four references) support at N=2000 but is
 * NOT robustly certified under the honest worst-case cross-family cross-grid
 * envelope. The R2 ladder LARGEST-N-tested-AND-met therefore STAYS at 1000
 * (imp-35221); it is NOT advanced to 2000.
 *
 * SUB-GAP (named): certifying R2 at N=2000 needs either a FINER flow grid than
 * tauC/1000 (so the order-5 dt/2 stages resolve the collision without a gate
 * skip) OR a SIGNED-CROSSING gate (detect gamma[i+1]-gamma[i] changing sign,
 * not only entering the (0, 1e-4) band) so a step-over cannot masquerade as a
 * missed collision. Tracked as imp-35235-sub-n2000-gate-skip.
 *
 * SCOPE: MEASUREMENT ONLY. Does NOT extend the R2 ladder; does NOT extend the
 * C_mb certificate; does NOT remove the imp-486 GUE conditional; changes NO
 * bound. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "2/diff" prose.
 *
 * @see imp-35221  R2 ladder extension to N=1000 (capped there, flagged N=2000)
 * @see imp-35190  R2 ladder extension to N=500
 * @see imp-35104  C_MB_WEAKER_K_INTERVAL_SCOPE (requirement R2)
 * @see imp-2509   offline backward-Dyson RK4 large-N cache convention
 * @see imp-2528   mapVsFlowSemantics one-sided-flow-bound reclassification
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (closable map bracket set incl. N=2000)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35235-n2000-order-robust-flow.mjs (offline producer)
 */

// ── Offline-measured collision references at N=2000. ─────────────────────────
// Producer: scripts/imp-35235-n2000-order-robust-flow.mjs (Node, plain Float64).
// tauC_est and grid inherited from EMPIRICAL_M_SWEEP_EXTENDED (N=2000) and the
// imp-2509 cache convention (dt = tauC_est/1000).
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_FLOW = 1.188352e-6;   // tauC_est / 1000 (resolved flow grid)
const DT_MAP = 1e-4;           // imp-857 baseline map grid

// gateSkip flags the reference whose min-gap stepped THROUGH the collision
// singularity without landing in the (0, 1e-4) gate band (a spurious late t_c).
const FLOW_REFERENCES = [
  { integrator: 'rk4-order-4', dt: DT_FLOW, t_c: 0.0011931054080, step: 1004, pair_index: 1495, gateSkip: false, source: 'imp-35235 RK4 reference (resolved grid)' },
  { integrator: 'dp45-order-5', dt: DT_FLOW, t_c: 0.0011931054080, step: 1004, pair_index: 1495, gateSkip: false, source: 'imp-35235 independent-family DP45 (resolved grid)' },
  { integrator: 'rk4-order-4', dt: DT_FLOW / 2, t_c: 0.0011925112320, step: 2007, pair_index: 1495, gateSkip: false, source: 'imp-35235 RK4 dt/2 refinement' },
  { integrator: 'dp45-order-5', dt: DT_FLOW / 2, t_c: 0.0013238241280, step: 2228, pair_index: 1495, gateSkip: true, source: 'imp-35235 DP45 dt/2 refinement (GATE-SKIP: gap 1.775e-3 -> 3.23e-2 in one step, spurious re-approach collision)' },
];

// Clean references = every reference EXCEPT the gate-skip artifact. The honest
// worst-case R2 envelope uses ALL references (including the gate-skip); the
// clean sub-envelope quantifies the three-of-four provisional support.
const CLEAN_REFERENCES = FLOW_REFERENCES.filter((r) => !r.gateSkip);
const T_C_FLOW_VALUES = FLOW_REFERENCES.map((r) => r.t_c);
const T_C_FLOW_MIN = Math.min(...T_C_FLOW_VALUES);
const T_C_FLOW_MAX = Math.max(...T_C_FLOW_VALUES); // worst case incl. gate-skip
const T_C_CLEAN_MAX = Math.max(...CLEAN_REFERENCES.map((r) => r.t_c));
const T_C_FLOW_BEST = 0.0011925112320;             // RK4 dt/2 resolved estimate

// Fixed-dt=1e-4 MAP bracket (imp-857 convention). The min-spacing < 1e-4 gate is
// TIGHTER than the interval gap-lower-nonpositive gate, so t_c_hi here is a
// conservative -- smaller -- upper endpoint, making the R2 test harder.
const MAP_COLLISION_STEP = 12;
const MAP_PAIR_INDEX = 1495;                      // same colliding pair as the flow
const T_C_LO = (MAP_COLLISION_STEP - 1) * DT_MAP; // 1.1e-3
const T_C_HI = MAP_COLLISION_STEP * DT_MAP;       // 1.2e-3 upper bracket endpoint

const R2_MET_WORSTCASE = T_C_FLOW_MAX <= T_C_HI;  // false (gate-skip breaks it)
const R2_SLACK_WORSTCASE = T_C_HI - T_C_FLOW_MAX; // negative
const R2_MET_CLEAN = T_C_CLEAN_MAX <= T_C_HI;     // true (three-of-four)
const R2_SLACK_CLEAN = T_C_HI - T_C_CLEAN_MAX;    // positive provisional slack

export const IMP_35235_R2_N2000_FLOW_REFERENCE = {
  id: 'imp-35235',
  title:
    'Order-robust DP45 backward-Dyson flow reference at N=2000 and the imp-35104 ' +
    'R2 one-sided true-flow test t_c_flow(2000) <= t_c_hi(2000) -- PARTIAL: ' +
    'DP45 dt/2 gate-skip breaks the worst-case envelope',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'partial-gate-skip',

  N,
  tauC_est: TAU_C_EST,
  dtFlow: DT_FLOW,
  dtMap: DT_MAP,

  flowReferences: FLOW_REFERENCES,
  flowEnvelope: { min: T_C_FLOW_MIN, max: T_C_FLOW_MAX, best: T_C_FLOW_BEST, cleanMax: T_C_CLEAN_MAX },
  mapBracket: { step: MAP_COLLISION_STEP, pair_index: MAP_PAIR_INDEX, t_c_lo: T_C_LO, t_c_hi: T_C_HI },

  r2Predicate: 't_c_flow(2000) <= t_c_hi(2000)  (imp-2528 one-sided true-flow bound)',
  r2MetWorstCase: R2_MET_WORSTCASE,
  r2SlackWorstCase: R2_SLACK_WORSTCASE,
  r2MetClean: R2_MET_CLEAN,
  r2SlackClean: R2_SLACK_CLEAN,

  verdict: {
    orderRobustReferenceExists: false,
    coarseGridOrderRobust: true,
    coarseGridEvidence:
      'On the RESOLVED (dt) grid RK4 (order 4) and DP45 (order 5) AGREE to full ' +
      'precision: SAME pair (index 1495), SAME step 1004, SAME t_c=0.0011931054080. ' +
      'The RK4 dt/2 refinement also lands correctly at 0.0011925112320 (step 2007, ' +
      'pair 1495). Three of four references cleanly clear t_c_hi=1.2e-3.',
    gateSkipEvidence:
      'The DP45 dt/2 refinement suffers a GATE-SKIP: at N=2000 the pair-1495 gap ' +
      'collapses fast (5.63e-3 -> 1.78e-3 in one dt/2 step near step 2006) and the ' +
      'order-5 stages step the two zeros THROUGH each other in a single step -- the ' +
      'min gap jumps 1.775e-3 -> 3.23e-2 WITHOUT landing in the (0, 1e-4) gate band. ' +
      'The gate is never tripped near the true event, so DP45 continues to a ' +
      'spurious re-approach collision at step 2228, t_c=0.0013238241280 > t_c_hi.',
    largestN_R2_tested_and_met: 1000,
    priorLargestN_R2_tested_and_met: 1000,
    interpretation:
      'R2 at N=2000 has PROVISIONAL (three-of-four references) support -- the ' +
      'coarse-grid cross-family agreement and the RK4 dt/2 refinement all put the ' +
      'true-flow collision at ~1.192-1.193e-3, strictly below the map upper bracket ' +
      't_c_hi=1.2e-3 (clean slack ' + R2_SLACK_CLEAN.toExponential(3) + '). But the ' +
      'HONEST worst-case cross-family cross-grid envelope does NOT clear t_c_hi ' +
      'because the DP45 dt/2 reference gate-skips to a spurious 0.0013238241280 ' +
      '(worst-case slack ' + R2_SLACK_WORSTCASE.toExponential(3) + '). The dt/2 ' +
      'cross-family agreement that was load-bearing at N=1000 FAILS at N=2000, so ' +
      'R2 is NOT robustly certified here. The R2 ladder largest-N-tested-and-met ' +
      'STAYS at 1000 (imp-35221); it is NOT advanced to 2000. The map and flow do ' +
      'agree on the colliding pair (index 1495), and the map-to-flow overshoot SIGN ' +
      '(imp-2528, t_c_flow <= t_c_map on the non-skipping references) is preserved.',
    doesNotAchieve:
      'Does NOT extend the R2 ladder to N=2000 (worst-case envelope fails via the ' +
      'DP45 dt/2 gate-skip); does NOT extend the C_mb certificate; does NOT remove ' +
      'the imp-486 GUE conditional; changes NO Lambda bound. No refereed bound is changed' +
      '.',
    subGap:
      'imp-35235-sub-n2000-gate-skip: certifying R2 at N=2000 needs a FINER flow ' +
      'grid than tauC/1000 (so the order-5 dt/2 stages resolve the collision ' +
      'without a step-over) OR a SIGNED-CROSSING gate (detect the neighbour gap ' +
      'changing sign, not only entering the (0, 1e-4) band) so a step-over cannot ' +
      'masquerade as a missed collision.',
    residualId: 'imp-35235-sub-n2000-gate-skip / imp-857-sub-scale-to-N10k (N>=2000)',
  },
};

// ── Build-time assertions. ───────────────────────────────────────────────────
export const IMP_35235_R2_N2000_FLOW_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35235-coarse-grid-order-robust',
    holds: () => {
      const rk4 = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.dt === DT_FLOW);
      const dp45 = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW);
      return rk4 && dp45 && rk4.pair_index === 1495 && dp45.pair_index === 1495 &&
        rk4.step === dp45.step && rk4.t_c === dp45.t_c;
    },
    why:
      'On the RESOLVED (dt) grid the independent-family DP45 (order 5) must ' +
      'reproduce the RK4 (order 4) collision to full precision: SAME pair (1495), ' +
      'SAME step, SAME t_c. This coarse-grid agreement is the clean part of the ' +
      'measurement and shows the true-flow collision is well-defined at N=2000.',
  },
  {
    id: 'imp35235-dp45-dthalf-gate-skip',
    holds: () => {
      const dp45h = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW / 2);
      const rk4h = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.dt === DT_FLOW / 2);
      return dp45h && rk4h && dp45h.gateSkip === true && rk4h.gateSkip === false &&
        dp45h.t_c > rk4h.t_c && dp45h.t_c !== rk4h.t_c;
    },
    why:
      'HONEST DEFECT: the DP45 dt/2 refinement must be flagged as a GATE-SKIP with ' +
      'a spurious t_c ABOVE the RK4 dt/2 estimate. Recording it as agreement would ' +
      'falsely certify R2 at N=2000; the dt/2 cross-family disagreement is the ' +
      'reason the rung is NOT extended.',
  },
  {
    id: 'imp35235-worstcase-envelope-fails',
    holds: () =>
      IMP_35235_R2_N2000_FLOW_REFERENCE.r2MetWorstCase === false &&
      IMP_35235_R2_N2000_FLOW_REFERENCE.r2SlackWorstCase < 0 &&
      IMP_35235_R2_N2000_FLOW_REFERENCE.flowEnvelope.max >
        IMP_35235_R2_N2000_FLOW_REFERENCE.mapBracket.t_c_hi,
    why:
      'HONEST R2 TEST: the WORST-CASE (largest) flow reference across both families ' +
      'and both grids EXCEEDS t_c_hi because of the DP45 dt/2 gate-skip, so the ' +
      'worst-case envelope does NOT clear the map bracket and R2 is NOT certified ' +
      'at N=2000. Claiming a pass on the clean sub-envelope alone would overstate.',
  },
  {
    id: 'imp35235-clean-subenvelope-clears',
    holds: () =>
      IMP_35235_R2_N2000_FLOW_REFERENCE.r2MetClean === true &&
      IMP_35235_R2_N2000_FLOW_REFERENCE.r2SlackClean > 0 &&
      CLEAN_REFERENCES.length === 3,
    why:
      'PROVISIONAL support: the three NON-skipping references (RK4 dt, DP45 dt, ' +
      'RK4 dt/2) all put the true-flow collision strictly below t_c_hi with ' +
      'positive slack. This is why the outcome is a PARTIAL (gate-skip artifact), ' +
      'not evidence that the true collision exceeds t_c_hi.',
  },
  {
    id: 'imp35235-map-flow-same-pair',
    holds: () =>
      IMP_35235_R2_N2000_FLOW_REFERENCE.mapBracket.pair_index ===
        FLOW_REFERENCES[0].pair_index,
    why:
      'The fixed-dt=1e-4 MAP bracket must collide on the SAME pair (index 1495) as ' +
      'the resolved flow references -- a different colliding pair would mean the ' +
      'map and flow bracket different events and the one-sided comparison would ' +
      'be meaningless.',
  },
  {
    id: 'imp35235-ladder-not-extended-no-qed',
    holds: () =>
      IMP_35235_R2_N2000_FLOW_REFERENCE.noQED === true &&
      IMP_35235_R2_N2000_FLOW_REFERENCE.changesNoBound === true &&
      IMP_35235_R2_N2000_FLOW_REFERENCE.verdict.largestN_R2_tested_and_met === 1000 &&
      typeof IMP_35235_R2_N2000_FLOW_REFERENCE.verdict.subGap === 'string',
    why:
      'Measurement only: never a QED or a bound change. Because the worst-case ' +
      'envelope fails, the R2 ladder largest-N-tested-and-met must STAY at 1000 ' +
      '(NOT advance to 2000) and a named sub-gap must be recorded. C_mb stays ' +
      'GUE-conditional (imp-486); no refereed bound is changed.',
  },
];
