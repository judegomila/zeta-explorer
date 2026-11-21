/**
 * @module imp-35324-r2-n2000-finer-grid-reference
 * @fileoverview imp-35324: re-run the imp-35235 R2 N=2000 order-robust
 * backward-Dyson flow test on a FINER BASE GRID (dt = tauC_est/4000, four times
 * the imp-35235 tauC_est/1000 resolution) with the SAME (0, 1e-4) min-spacing
 * collision gate, and measure whether the finer base grid restores the order-4
 * (RK4) vs order-5 (DP45) cross-grid agreement that FAILED at N=2000 on the
 * tauC/1000 grid via the DP45 dt/2 gate-skip.
 *
 * WHY THIS TEST
 * ------------
 * imp-35235 reproduced the imp-35221 R2 order-robust flow method at N=2000 on
 * dt = tauC_est/1000 = 1.188352e-6 and found THREE of four references (RK4 dt,
 * DP45 dt, RK4 dt/2) cleanly clear the imp-857 map bracket t_c_hi = 1.2e-3, but
 * the fourth (DP45 dt/2) suffered a GATE-SKIP: the pair-1495 gap collapsed so
 * fast that the order-5 dt/2 stages stepped the two zeros THROUGH each other and
 * the min gap jumped 1.775e-3 -> 3.23e-2 WITHOUT landing in the (0, 1e-4) gate,
 * so DP45 continued to a SPURIOUS re-approach collision at t_c = 1.3238e-3 that
 * EXCEEDS t_c_hi. imp-35235 attributed this EXPLICITLY to the tauC/1000 grid
 * being "too coarse for the order-5 stages" at the faster N=2000 approach and
 * named a sub-gap (imp-35235-sub-n2000-gate-skip): certify R2 at N=2000 with a
 * FINER flow grid OR a signed-crossing gate. This module tests the FINER-GRID
 * lever directly (distinct from imp-35278, which keeps the grid and changes the
 * event definition to a dense-output interpolated crossing).
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * The imp-35235 method reproduced VERBATIM at N=2000 by
 * scripts/imp-35324-n2000-finer-grid-flow.mjs on a base grid FOUR TIMES finer
 * (dt = tauC_est/4000 = 2.970880e-7) and the SAME min-spacing < 1e-4 collision
 * gate. Four flow references (RK4 and independent-family DP45, each at dt and
 * dt/2) plus the imp-857 fixed-dt=1e-4 MAP bracket.
 *
 * HONEST OUTCOME: THE FINER GRID CLEARS THE WORST-CASE ENVELOPE (MARGINALLY)
 * -------------------------------------------------------------------------
 * On the finer base grid the DP45 dt/2 GATE-SKIP is GONE. All four references
 * now collide on pair 1495 and LAND in the (0, 1e-4) gate:
 *   RK4  dt    t_c = 1.1925112320e-3  (step 4014)
 *   DP45 dt    t_c = 1.1925112320e-3  (step 4014)   -- IDENTICAL to RK4 dt (gap 0)
 *   RK4  dt/2  t_c = 1.1923626880e-3  (step 8027)
 *   DP45 dt/2  t_c = 1.1999384320e-3  (step 8078)   -- lands in gate, no step-over
 * The worst-case cross-family cross-grid envelope is [1.1923626880e-3,
 * 1.1999384320e-3]; its MAX (DP45 dt/2) is BELOW t_c_hi = 1.2e-3, so the R2
 * predicate envMax <= t_c_hi now HOLDS with slack +6.156800e-8. This directly
 * CONFIRMS imp-35235s grid-coarseness diagnosis: the spurious 1.3238e-3
 * re-approach was a tauC/1000 resolution artifact, not a real late collision.
 *
 * WHY THE LADDER STILL DOES NOT ADVANCE (RAZOR-THIN, NOT FULL-PRECISION)
 * ---------------------------------------------------------------------
 * The clearance is MARGINAL, not the clean full-precision tie that carried the
 * ladder at N<=1000: (1) the DP45 dt/2 reference sits only 6.16e-8 below t_c_hi
 * -- a single fixed-dt=1e-4 map step is 1e-4, so this slack is ~1600x smaller
 * than one map cell; (2) the dt/2 cross-family gap |dp45(dt/2)-rk4(dt/2)| =
 * 7.576e-6 is NONZERO (at N<=1000 both dt/2 families landed on the identical
 * t_c), and the DP45 dt/2 pre-gate min gap (9.841e-4) is anomalously larger than
 * the other three references (~8.79e-4), so the order-5 dt/2 stages STILL sample
 * the singular 2/diff approach differently -- the finer grid MITIGATED but did
 * not fully ELIMINATE the order-5 dt/2 sensitivity near the singularity.
 *
 * NET: the finer base grid strengthens the N=2000 support from the imp-35235
 * three-of-four (worst-case envelope FAILS) to a four-of-four CLEARING envelope
 * (worst-case envelope PASSES marginally), confirming the gate-skip was a grid
 * artifact. This is PROVISIONAL strengthening only. Per the ticket, R2 stays
 * AS-GRADED: the R2 ladder largest-N-robustly-certified STAYS at 1000 (imp-35221)
 * because the N=2000 clearance is razor-thin and the dt/2 cross-family agreement
 * is not full-precision. Changes NO bound; NO QED.
 *
 * SUB-GAP (named): imp-35324-sub-n2000-marginal-clearance -- robustly certifying
 * R2 at N=2000 needs EITHER a still-finer grid (to drive the dt/2 cross-family
 * gap back to full-precision so the clearance is not a 6e-8 knife-edge) OR the
 * imp-35278 dense-output interpolated-crossing event definition (to remove the
 * remaining order-5 dt/2 near-gate sensitivity). Feeds imp-35278.
 *
 * SCOPE: MEASUREMENT ONLY. Does NOT advance the R2 ladder; does NOT extend the
 * C_mb certificate; does NOT remove the imp-486 GUE conditional; changes NO
 * bound. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "2/diff" prose.
 *
 * @see imp-35235  R2 N=2000 flow reference (DP45 dt/2 gate-skip -- the failure this fixes)
 * @see imp-35278  dense-output interpolated-event route (keeps grid, changes event)
 * @see imp-35221  R2 ladder extension to N=1000 (last robustly-certified rung)
 * @see imp-35104  C_MB_WEAKER_K_INTERVAL_SCOPE (requirement R2)
 * @see imp-2509   offline backward-Dyson RK4 large-N cache convention
 * @see imp-2528   mapVsFlowSemantics one-sided-flow-bound reclassification
 * @see imp-857    C_MB_INTERVAL_CERTIFIED (closable map bracket set incl. N=2000)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35324-n2000-finer-grid-flow.mjs (offline producer)
 * @see scripts/imp-35235-n2000-order-robust-flow.mjs (coarse-grid predecessor)
 */

// ── Offline-measured collision references at N=2000, FINER base grid. ─────────
// Producer: scripts/imp-35324-n2000-finer-grid-flow.mjs (Node, plain Float64).
// tauC_est inherited from EMPIRICAL_M_SWEEP_EXTENDED (N=2000); base grid is the
// imp-2509 cache convention refined 4x (dt = tauC_est/4000).
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_FLOW = 2.970880e-7;   // tauC_est / 4000 (FOUR TIMES finer than imp-35235)
const DT_MAP = 1e-4;           // imp-857 baseline map grid

// gateSkip flags any reference whose min gap stepped THROUGH the collision
// singularity without landing in the (0, 1e-4) gate band. On the finer grid NONE
// gate-skip -- the imp-35235 DP45 dt/2 step-over is resolved. gapBeforeGate is
// the min neighbour spacing on the step just BEFORE the gate tripped.
const FLOW_REFERENCES = [
  { integrator: 'rk4-order-4', dt: DT_FLOW, t_c: 0.0011925112320, step: 4014, pair_index: 1495, gateSkip: false, gapBeforeGate: 8.787e-4, source: 'imp-35324 RK4 reference (finer resolved grid tauC/4000)' },
  { integrator: 'dp45-order-5', dt: DT_FLOW, t_c: 0.0011925112320, step: 4014, pair_index: 1495, gateSkip: false, gapBeforeGate: 8.805e-4, source: 'imp-35324 independent-family DP45 (finer resolved grid tauC/4000)' },
  { integrator: 'rk4-order-4', dt: DT_FLOW / 2, t_c: 0.0011923626880, step: 8027, pair_index: 1495, gateSkip: false, gapBeforeGate: 8.800e-4, source: 'imp-35324 RK4 dt/2 refinement (tauC/8000)' },
  { integrator: 'dp45-order-5', dt: DT_FLOW / 2, t_c: 0.0011999384320, step: 8078, pair_index: 1495, gateSkip: false, gapBeforeGate: 9.841e-4, source: 'imp-35324 DP45 dt/2 refinement (tauC/8000): lands in gate (no step-over), but marginal and pre-gate gap anomalous' },
];

const CLEAN_REFERENCES = FLOW_REFERENCES.filter((r) => !r.gateSkip); // now all four
const T_C_FLOW_VALUES = FLOW_REFERENCES.map((r) => r.t_c);
const T_C_FLOW_MIN = Math.min(...T_C_FLOW_VALUES);
const T_C_FLOW_MAX = Math.max(...T_C_FLOW_VALUES); // worst case = DP45 dt/2
const T_C_FLOW_BEST = 0.0011923626880;             // RK4 dt/2 finest estimate

// Cross-family agreement diagnostics.
const ORDER_GAP_DT = Math.abs(0.0011925112320 - 0.0011925112320);      // 0 (exact tie on resolved grid)
const ORDER_GAP_DTHALF = Math.abs(0.0011999384320 - 0.0011923626880);  // 7.576e-6 (NONZERO)

// Fixed-dt=1e-4 MAP bracket (imp-857 convention), unchanged from imp-35235.
const MAP_COLLISION_STEP = 12;
const MAP_PAIR_INDEX = 1495;
const T_C_LO = (MAP_COLLISION_STEP - 1) * DT_MAP; // 1.1e-3
const T_C_HI = MAP_COLLISION_STEP * DT_MAP;       // 1.2e-3 upper bracket endpoint

const R2_MET_WORSTCASE = T_C_FLOW_MAX <= T_C_HI;  // now TRUE (gate-skip resolved)
const R2_SLACK_WORSTCASE = T_C_HI - T_C_FLOW_MAX; // +6.1568e-8 (razor-thin)

export const IMP_35324_R2_N2000_FINER_GRID_REFERENCE = {
  id: 'imp-35324',
  title:
    'Finer-base-grid (dt = tauC/4000) re-run of the imp-35235 R2 N=2000 ' +
    'order-robust flow test: the DP45 dt/2 gate-skip is RESOLVED and the ' +
    'worst-case envelope CLEARS t_c_hi=1.2e-3 (marginally, +6.16e-8)',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'finer-grid-clears-worstcase-marginally',

  N,
  tauC_est: TAU_C_EST,
  dtFlow: DT_FLOW,
  dtFlowCoarse_imp35235: 1.188352e-6,   // the imp-35235 grid this refines (4x coarser)
  refinementFactor: 4,
  dtMap: DT_MAP,

  flowReferences: FLOW_REFERENCES,
  flowEnvelope: { min: T_C_FLOW_MIN, max: T_C_FLOW_MAX, best: T_C_FLOW_BEST },
  crossFamilyGap: { dt: ORDER_GAP_DT, dtHalf: ORDER_GAP_DTHALF },
  mapBracket: { step: MAP_COLLISION_STEP, pair_index: MAP_PAIR_INDEX, t_c_lo: T_C_LO, t_c_hi: T_C_HI },

  r2Predicate: 't_c_flow(2000) <= t_c_hi(2000)  (imp-2528 one-sided true-flow bound)',
  r2MetWorstCase: R2_MET_WORSTCASE,
  r2SlackWorstCase: R2_SLACK_WORSTCASE,

  verdict: {
    finerGridClearsWorstCaseEnvelope: true,
    gateSkipResolved: true,
    confirmsImp35235CoarsenessDiagnosis: true,
    resolvedGridOrderRobust: true,
    resolvedGridEvidence:
      'On the finer RESOLVED (dt=tauC/4000) grid RK4 (order 4) and DP45 (order 5) ' +
      'AGREE to full precision: SAME pair (1495), SAME step 4014, SAME ' +
      't_c=0.0011925112320 (cross-family gap 0). The RK4 dt/2 refinement lands at ' +
      '0.0011923626880 (step 8027, pair 1495).',
    gateSkipResolvedEvidence:
      'The DP45 dt/2 refinement -- which on the imp-35235 tauC/1000 grid stepped ' +
      'THROUGH the collision to a spurious re-approach at 0.0013238241280 > t_c_hi ' +
      '-- now LANDS in the (0, 1e-4) gate at 0.0011999384320 (step 8078, pair 1495) ' +
      'with NO step-over. The finer base grid lets the order-5 dt/2 stages sample ' +
      'the singular approach, exactly as imp-35235 predicted the coarseness fix ' +
      'would do.',
    marginalClearanceCaveat:
      'The clearance is a KNIFE-EDGE: the DP45 dt/2 reference sits only 6.156800e-8 ' +
      'below t_c_hi=1.2e-3 (~1600x smaller than one 1e-4 map cell), the dt/2 ' +
      'cross-family gap is 7.576e-6 (NONZERO, unlike the full-precision tie at ' +
      'N<=1000), and the DP45 dt/2 pre-gate min gap (9.841e-4) is anomalously ' +
      'larger than the other three references (~8.79e-4). The order-5 dt/2 near-gate ' +
      'sensitivity is MITIGATED but not fully ELIMINATED.',
    largestN_R2_robustly_certified: 1000,
    priorLargestN_R2_robustly_certified: 1000,
    interpretation:
      'The finer base grid (tauC/4000) STRENGTHENS the N=2000 support from the ' +
      'imp-35235 three-of-four (worst-case envelope FAILED via the DP45 dt/2 ' +
      'gate-skip) to a four-of-four CLEARING envelope [1.1923626880e-3, ' +
      '1.1999384320e-3] whose max is below t_c_hi=1.2e-3 (slack +6.16e-8). This ' +
      'CONFIRMS the imp-35235 grid-coarseness diagnosis: the spurious 1.3238e-3 ' +
      're-approach was a tauC/1000 resolution artifact. But the clearance is ' +
      'razor-thin and the dt/2 cross-family agreement is not full-precision, so per ' +
      'the ticket R2 STAYS AS-GRADED: the ladder largest-N-robustly-certified ' +
      'remains 1000 (imp-35221); it is NOT advanced to 2000.',
    doesNotAchieve:
      'Does NOT advance the R2 ladder to N=2000 (clearance is a 6e-8 knife-edge, ' +
      'dt/2 cross-family gap nonzero); does NOT extend the C_mb certificate; does ' +
      'NOT remove the imp-486 GUE conditional; changes NO Lambda bound. ' +
      'No refereed bound is changed.',
    subGap:
      'imp-35324-sub-n2000-marginal-clearance: robustly certifying R2 at N=2000 ' +
      'needs EITHER a still-finer grid (to drive the dt/2 cross-family gap back to ' +
      'full precision so the clearance is not a 6e-8 knife-edge) OR the imp-35278 ' +
      'dense-output interpolated-crossing event definition (to remove the remaining ' +
      'order-5 dt/2 near-gate sensitivity).',
    residualId: 'imp-35324-sub-n2000-marginal-clearance / imp-35278 (interpolated event)',
  },
};

// ── Build-time assertions (re-derive from the baked literals). ────────────────
export const IMP_35324_R2_N2000_FINER_GRID_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35324-resolved-grid-order-robust',
    holds: () => {
      const rk4 = FLOW_REFERENCES.find((r) => r.integrator === 'rk4-order-4' && r.dt === DT_FLOW);
      const dp45 = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW);
      return rk4 && dp45 && rk4.pair_index === 1495 && dp45.pair_index === 1495 &&
        rk4.step === dp45.step && rk4.t_c === dp45.t_c;
    },
    why:
      'On the finer RESOLVED (dt=tauC/4000) grid the independent-family DP45 ' +
      '(order 5) must reproduce the RK4 (order 4) collision to full precision: ' +
      'SAME pair (1495), SAME step, SAME t_c. This is the clean part of the finer ' +
      'grid measurement.',
  },
  {
    id: 'imp35324-dp45-dthalf-gate-skip-resolved',
    holds: () => {
      const dp45h = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW / 2);
      // On the imp-35235 coarse grid this reference gate-skipped to 1.3238e-3 > t_c_hi.
      // On the finer grid it must LAND in the gate (no skip) and sit BELOW t_c_hi.
      return dp45h && dp45h.gateSkip === false && dp45h.t_c < T_C_HI &&
        dp45h.t_c < 0.0013238241280;
    },
    why:
      'KEY FINDING: on the finer base grid the DP45 dt/2 refinement -- which ' +
      'gate-skipped to a spurious 0.0013238241280 > t_c_hi on the imp-35235 ' +
      'tauC/1000 grid -- must now LAND in the (0, 1e-4) gate BELOW t_c_hi. This ' +
      'confirms the imp-35235 coarseness diagnosis of the gate-skip.',
  },
  {
    id: 'imp35324-worstcase-envelope-clears',
    holds: () =>
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.r2MetWorstCase === true &&
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.r2SlackWorstCase > 0 &&
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.flowEnvelope.max <=
        IMP_35324_R2_N2000_FINER_GRID_REFERENCE.mapBracket.t_c_hi,
    why:
      'The finer-grid worst-case (largest) flow reference across both families and ' +
      'both grids now sits BELOW t_c_hi=1.2e-3, so the worst-case envelope CLEARS ' +
      'the map bracket (unlike imp-35235, where the gate-skip broke it).',
  },
  {
    id: 'imp35324-clearance-is-marginal',
    holds: () =>
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.r2SlackWorstCase < 1e-6 &&
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.crossFamilyGap.dtHalf > 1e-6 &&
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.crossFamilyGap.dt === 0,
    why:
      'HONEST CAVEAT: the clearance is a knife-edge -- worst-case slack < 1e-6 ' +
      '(actually ~6.16e-8) while the dt/2 cross-family gap is > 1e-6 (nonzero, ' +
      'unlike the full-precision resolved-grid tie of exactly 0). Recording a clean ' +
      'pass would overstate; this is why the ladder is not advanced.',
  },
  {
    id: 'imp35324-map-flow-same-pair',
    holds: () =>
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.mapBracket.pair_index ===
        FLOW_REFERENCES[0].pair_index &&
      FLOW_REFERENCES.every((r) => r.pair_index === 1495),
    why:
      'The fixed-dt=1e-4 MAP bracket and every finer-grid flow reference must ' +
      'collide on the SAME pair (index 1495) as imp-35235 -- a different colliding ' +
      'pair would mean the map and flow bracket different events.',
  },
  {
    id: 'imp35324-ladder-not-advanced-no-qed',
    holds: () =>
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.noQED === true &&
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.changesNoBound === true &&
      IMP_35324_R2_N2000_FINER_GRID_REFERENCE.verdict.largestN_R2_robustly_certified === 1000 &&
      typeof IMP_35324_R2_N2000_FINER_GRID_REFERENCE.verdict.subGap === 'string',
    why:
      'Measurement only: never a QED or a bound change. Because the clearance is ' +
      'razor-thin and the dt/2 cross-family agreement is not full-precision, the R2 ' +
      'ladder largest-N-robustly-certified STAYS at 1000 (NOT advanced to 2000) and ' +
      'a named sub-gap is recorded. C_mb stays GUE-conditional (imp-486); ' +
      'no refereed bound is changed.',
  },
  {
    // imp-35358: independent recompute of BOTH prose slack literals from the
    // baked t_c reference values, plus the worst-case (smallest-slack) selection.
    id: 'imp35358-slack-recompute-crosscheck',
    holds: () => {
      const dp45h = FLOW_REFERENCES.find((r) => r.integrator === 'dp45-order-5' && r.dt === DT_FLOW / 2);
      // imp-35324 R2 predicate slack: t_c_hi - DP45 dt/2 worst-case t_c.
      const slack324 = T_C_HI - dp45h.t_c;                 // baked 6.156800e-8
      // imp-35278 clean-envelope slack: t_c_hi - DP45 dt clean-max t_c.
      const cleanMax278 = 0.0011926277027;                 // imp-35278 baked DP45 dt clean-max
      const slack278 = T_C_HI - cleanMax278;               // baked 7.372297e-6
      return (
        Math.abs(slack324 - 6.156800e-8) < 1e-13 &&
        Math.abs(slack278 - 7.372297e-6) < 1e-11 &&
        slack324 > 0 && slack278 > 0 &&
        slack324 < slack278 // imp-35324 DP45 dt/2 is the worst-case (smallest slack)
      );
    },
    why:
      'imp-35358 independent verification: recomputing t_c_hi - t_c from the baked ' +
      'literals reproduces the imp-35324 R2 slack (+6.156800e-8, from DP45 dt/2 ' +
      't_c=1.1999384320e-3) and the imp-35278 clean-envelope slack (7.372297e-6, ' +
      'from DP45 dt clean-max t_c=1.1926277027e-3) to reported precision. Both are ' +
      'POSITIVE (references below t_c_hi=1.2e-3) and the imp-35324 dt/2 slack is the ' +
      'smaller of the two, so it is the correct worst-case. No transcription or ' +
      'reference-selection error. Verification only; changes no bound; NO QED.',
  },
];
