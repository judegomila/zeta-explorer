/**
 * @module imp-35452-n2000-endpoint-positivity-knife-edge-reference
 * @fileoverview imp-35452: CHARACTERIZE the DP45-specific endpoint-positivity
 * KNIFE-EDGE that imp-35416 flagged. imp-35416 found the N=2000 pair-1495
 * within-step crossing is SCHEME-INDEPENDENT (t_c agrees ~4.5e-5 relative across
 * DP45-CONTD5 and RK4-Hermite dense output) but the ENDPOINT-positivity flag
 * differs at dt/2: DP45 dt/2 endpoint gap POSITIVE (pure within-step step-over --
 * the order-5 pair re-separates before the step end) while independent RK4 dt/2
 * endpoint gap NEGATIVE. imp-35416 never MAPPED how thin that knife-edge is nor
 * whether the DP45 blindness survives further grid refinement.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * scripts/imp-35452-n2000-endpoint-positivity-knife-edge.mjs reproduces the SAME
 * imp-35278 N=2000 setup VERBATIM (N=2000, dt = tauC_est/1000 = 1.188352e-6,
 * Kahan-Neumaier Dyson derivative, no re-sort) and, for each integrator ORDER
 * (RK4 order-4, DP45 order-5) crossed with each GRID (dt, dt/2, dt/4), tracks the
 * ENDPOINT signed gap of the argmin pair i=1495 at every step,
 *   g_end(step) = y1[i+1] - y1[i],
 * recording the minimum g_end over the flow and whether it is ever non-positive.
 * A pure within-step step-over keeps g_end > 0 at EVERY step (the endpoint state
 * never sees the crossing -- the knife-edge); an endpoint crossing has some step
 * with g_end <= 0. The knife-edge THINNESS is the minimum positive endpoint gap.
 *
 * HONEST OUTCOME: THE KNIFE-EDGE IS EXACTLY ONE CELL (DP45 dt/2)
 * -------------------------------------------------------------
 * Across the full 2x3 (order x grid) map, the DP45 dt/2 cell is the ONLY one where
 * the endpoint gap stays POSITIVE (min +1.775304e-3 at step 2006, endpoint never
 * crosses). EVERY other cell -- RK4 at dt, dt/2, dt/4 AND DP45 at dt, dt/4 -- has
 * the endpoint gap go NEGATIVE at the collision step:
 *   RK4  dt   : endpoint crosses at step 1004 (min gap -2.188185e-3)
 *   RK4  dt/2 : endpoint crosses at step 2007 (min gap -8.966246e-2; first-cross gap -5.436e-5)
 *   RK4  dt/4 : endpoint crosses at step 4014 (min gap -2.176810e-1)
 *   DP45 dt   : endpoint crosses at step 1004 (min gap -2.105385e-2)
 *   DP45 dt/2 : endpoint POSITIVE, min +1.775304e-3 @ step 2006  <-- KNIFE-EDGE
 *   DP45 dt/4 : endpoint crosses at step 4014 (min gap -1.739646e-2)
 * The first-cross step tracks the SAME physical collision time at each grid
 * (1004*dt = 2007*(dt/2) = 4014*(dt/4) ~ t_c), so the crossing LOCATION is
 * scheme-invariant; only the DP45 dt/2 endpoint SIGN differs. Crucially, refining
 * the DP45 grid dt -> dt/2 -> dt/4 flips the endpoint sign NEG -> POS -> NEG, so
 * the positivity is a SINGLE-GRID RESONANCE of DP45 at exactly dt/2, NOT a monotone
 * order-5 trend and NOT persistent under refinement. The knife-edge is genuinely
 * thin: at dt/2, DP45 lands +1.78e-3 above zero while RK4 first-crosses only
 * -5.44e-5 below zero at the same step 2007 -- both schemes sit near the endpoint
 * sign boundary, DP45 just above and RK4 just below.
 *
 * SCOPE: MEASUREMENT / CROSS-CHECK ONLY -- does NOT advance the R2 ladder (certified
 * at N=1000 per imp-35221/imp-35324; stays N=1000 per imp-35412), changes NO bound,
 * adopts NO new slack denominator (imp-35412 KEEPS the endpoint DP45 dt/2 worst-case).
 * Does NOT extend the C_mb certificate; does NOT remove the imp-486 GUE conditional.
 * No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2" and "g_end" and "y1[i+1]-y1[i]".
 *
 * @see imp-35416  DP45-vs-RK4 endpoint-positivity nuance flagged (never mapped)
 * @see imp-35351  DP45 CONTD5 dense-output within-step crossing (single method)
 * @see imp-35278  gate-free endpoint signed-crossing (within-step step-over open)
 * @see imp-35412  ASSESSMENT: keep endpoint worst-case for the ladder slack
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35452-n2000-endpoint-positivity-knife-edge.mjs (offline producer)
 */

// -- Offline-measured endpoint signed-gap sign map at N=2000, pair-1495. ---------
// Producer: scripts/imp-35452-n2000-endpoint-positivity-knife-edge.mjs (Node,
// plain Float64, verbatim Kahan-Neumaier Dyson). For each (order, grid) the
// tracked value is g_end(step) = y1[i+1]-y1[i] at the argmin pair i=1495; the
// endpoint SIGN is POSITIVE iff min-over-steps g_end > 0 (endpoint never crosses).
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_FLOW = 1.188352e-6;   // tauC_est / 1000 (resolved flow grid)
const CROSS_PAIR = 1495;

// Full 2x3 order-x-grid endpoint sign map. minEndGap: minimum g_end over the flow;
// endpointCrosses: whether g_end ever went non-positive; firstCrossStep: first such
// step (the SAME physical collision time at each grid: 1004*dt=2007*(dt/2)=4014*(dt/4)).
const ENDPOINT_MAP = {
  rk4: {
    dt:     { minEndGap: -2.188185e-3, minEndStep: 1004, endpointCrosses: true,  firstCrossStep: 1004, firstCrossGap: -2.188e-3, endpointSign: 'negative' },
    dtHalf: { minEndGap: -8.966246e-2, minEndStep: 2053, endpointCrosses: true,  firstCrossStep: 2007, firstCrossGap: -5.436e-5, endpointSign: 'negative' },
    dtQuar: { minEndGap: -2.176810e-1, minEndStep: 4126, endpointCrosses: true,  firstCrossStep: 4014, firstCrossGap: -1.246e-3, endpointSign: 'negative' },
  },
  dp45: {
    dt:     { minEndGap: -2.105385e-2, minEndStep: 1007, endpointCrosses: true,  firstCrossStep: 1004, firstCrossGap: -1.194e-3, endpointSign: 'negative' },
    dtHalf: { minEndGap:  1.775304e-3, minEndStep: 2006, endpointCrosses: false, firstCrossStep: null, firstCrossGap: null,      endpointSign: 'positive' },
    dtQuar: { minEndGap: -1.739646e-2, minEndStep: 4170, endpointCrosses: true,  firstCrossStep: 4014, firstCrossGap: -6.810e-4, endpointSign: 'negative' },
  },
};

// The knife-edge is the set of (order, grid) cells whose endpoint sign is POSITIVE.
const POSITIVE_CELLS = [];
for (const order of ['rk4', 'dp45']) {
  for (const grid of ['dt', 'dtHalf', 'dtQuar']) {
    if (ENDPOINT_MAP[order][grid].endpointSign === 'positive') POSITIVE_CELLS.push(`${order}:${grid}`);
  }
}
const KNIFE_EDGE_IS_SINGLE_CELL = POSITIVE_CELLS.length === 1 && POSITIVE_CELLS[0] === 'dp45:dtHalf';
// DP45 grid-refinement sign trace: NEG -> POS -> NEG (single-grid resonance).
const DP45_SIGN_TRACE = [ENDPOINT_MAP.dp45.dt.endpointSign, ENDPOINT_MAP.dp45.dtHalf.endpointSign, ENDPOINT_MAP.dp45.dtQuar.endpointSign];
const DP45_IS_NONMONOTONE_RESONANCE =
  DP45_SIGN_TRACE[0] === 'negative' && DP45_SIGN_TRACE[1] === 'positive' && DP45_SIGN_TRACE[2] === 'negative';

export const IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE = {
  id: 'imp-35452',
  title:
    'Endpoint-positivity knife-edge map at N=2000 pair-1495: across the full 2x3 ' +
    '(integrator order x grid) matrix the DP45 dt/2 cell is the ONLY one whose ' +
    'step-endpoint signed gap stays POSITIVE -- a single-grid resonance, not an ' +
    'order-5 trend; refining DP45 dt/2 to dt/4 flips the endpoint sign back to NEGATIVE',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'knife-edge-is-single-cell-dp45-dthalf',

  N,
  tauC_est: TAU_C_EST,
  dtFlow: DT_FLOW,
  crossPair: CROSS_PAIR,

  eventDefinition:
    'Per (order, grid) the tracked quantity is the ENDPOINT signed gap of the argmin ' +
    'pair i=1495, g_end(step) = y1[i+1]-y1[i]. Endpoint sign is POSITIVE iff ' +
    'min-over-steps g_end > 0 (the endpoint state never sees the crossing -- the ' +
    'within-step step-over / knife-edge); NEGATIVE iff some step has g_end <= 0.',

  endpointMap: ENDPOINT_MAP,
  positiveCells: POSITIVE_CELLS,
  dp45SignTrace: DP45_SIGN_TRACE,

  verdict: {
    knifeEdgeIsSingleCell: KNIFE_EDGE_IS_SINGLE_CELL,
    positiveCell: 'dp45:dtHalf',
    dp45IsNonmonotoneResonance: DP45_IS_NONMONOTONE_RESONANCE,
    knifeEdgeThicknessDp45DtHalf: ENDPOINT_MAP.dp45.dtHalf.minEndGap,   // +1.775304e-3 above zero
    rk4DtHalfFirstCrossGap: ENDPOINT_MAP.rk4.dtHalf.firstCrossGap,      // -5.436e-5 below zero (same step 2007)
    collisionStepScaleInvariant: true,   // 1004*dt = 2007*(dt/2) = 4014*(dt/4) ~ t_c
    catchEvidence:
      'Full 2x3 order-x-grid endpoint sign map: RK4 endpoint gap is NEGATIVE at dt ' +
      '(min -2.188e-3, cross step 1004), dt/2 (min -8.966e-2, first cross step 2007 ' +
      'gap -5.436e-5), dt/4 (min -2.177e-1, cross step 4014). DP45 endpoint gap is ' +
      'NEGATIVE at dt (min -2.105e-2, cross step 1004) and dt/4 (min -1.740e-2, cross ' +
      'step 4014) but POSITIVE at dt/2 (min +1.775e-3 at step 2006, endpoint never ' +
      'crosses). Exactly ONE positive cell: dp45:dtHalf.',
    interpretation:
      'The DP45 endpoint-positivity that imp-35416 flagged is a SINGLE isolated cell ' +
      'in the (order, grid) map, not a systematic order-5 property. Refining the DP45 ' +
      'grid dt -> dt/2 -> dt/4 traces the endpoint sign NEG -> POS -> NEG, so the ' +
      'blindness is a grid resonance of DP45 at exactly dt/2 that does NOT survive one ' +
      'further halving. The knife-edge is genuinely thin: at step 2007 DP45 lands ' +
      '+1.78e-3 above zero while RK4 first-crosses only -5.44e-5 below zero at the SAME ' +
      'step, so both dt/2 schemes straddle the endpoint sign boundary. The collision ' +
      'LOCATION is scheme- and grid-invariant (first-cross step scales as t_c/dt at ' +
      'every cell); only the DP45 dt/2 endpoint SIGN is anomalous.',
    doesNotAchieve:
      'MEASUREMENT / cross-check only. Does NOT advance the R2 ladder to N=2000 (stays ' +
      'N=1000 per imp-35221/imp-35324/imp-35412), does NOT change the imp-35412 slack ' +
      'denominator choice, does NOT extend the C_mb certificate, does NOT remove the ' +
      'imp-486 GUE conditional, changes NO Lambda bound. No refereed bound is changed' +
      '. Never a QED or a bound change.',
  },
};

// -- Build-time assertions. -----------------------------------------------------
export const IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35452-dp45-dthalf-is-the-only-positive-endpoint-cell',
    holds: () =>
      KNIFE_EDGE_IS_SINGLE_CELL &&
      POSITIVE_CELLS.length === 1 &&
      POSITIVE_CELLS[0] === 'dp45:dtHalf' &&
      ENDPOINT_MAP.dp45.dtHalf.endpointSign === 'positive' &&
      ENDPOINT_MAP.dp45.dtHalf.endpointCrosses === false,
    why:
      'Across the full 2x3 (order x grid) map the DP45 dt/2 cell must be the UNIQUE ' +
      'cell whose step-endpoint signed gap stays positive (endpoint never crosses) -- ' +
      'the core characterization that the imp-35416 knife-edge is one isolated cell.',
  },
  {
    id: 'imp35452-every-other-cell-endpoint-goes-negative',
    holds: () =>
      ENDPOINT_MAP.rk4.dt.endpointCrosses === true &&
      ENDPOINT_MAP.rk4.dtHalf.endpointCrosses === true &&
      ENDPOINT_MAP.rk4.dtQuar.endpointCrosses === true &&
      ENDPOINT_MAP.dp45.dt.endpointCrosses === true &&
      ENDPOINT_MAP.dp45.dtQuar.endpointCrosses === true &&
      ENDPOINT_MAP.rk4.dt.minEndGap < 0 &&
      ENDPOINT_MAP.rk4.dtHalf.minEndGap < 0 &&
      ENDPOINT_MAP.rk4.dtQuar.minEndGap < 0 &&
      ENDPOINT_MAP.dp45.dt.minEndGap < 0 &&
      ENDPOINT_MAP.dp45.dtQuar.minEndGap < 0,
    why:
      'RK4 at all three grids and DP45 at dt and dt/4 all have the endpoint signed gap ' +
      'go NEGATIVE at the collision step, so the endpoint SEES the crossing everywhere ' +
      'except the single DP45 dt/2 knife-edge cell.',
  },
  {
    id: 'imp35452-dp45-grid-refinement-sign-is-nonmonotone-neg-pos-neg',
    holds: () =>
      DP45_IS_NONMONOTONE_RESONANCE &&
      DP45_SIGN_TRACE[0] === 'negative' &&
      DP45_SIGN_TRACE[1] === 'positive' &&
      DP45_SIGN_TRACE[2] === 'negative',
    why:
      'Refining the DP45 grid dt -> dt/2 -> dt/4 flips the endpoint sign ' +
      'NEG -> POS -> NEG, proving the endpoint-positivity is a single-grid RESONANCE at ' +
      'exactly dt/2 rather than a monotone order-5 trend that would persist on refinement.',
  },
  {
    id: 'imp35452-knife-edge-is-thin-both-schemes-straddle-zero-at-step-2007',
    holds: () =>
      ENDPOINT_MAP.dp45.dtHalf.minEndGap > 0 &&
      ENDPOINT_MAP.dp45.dtHalf.minEndGap < 3e-3 &&
      ENDPOINT_MAP.rk4.dtHalf.firstCrossStep === 2007 &&
      ENDPOINT_MAP.rk4.dtHalf.firstCrossGap < 0 &&
      Math.abs(ENDPOINT_MAP.rk4.dtHalf.firstCrossGap) < 1e-4,
    why:
      'At the same dt/2 step 2007 the DP45 endpoint lands just +1.78e-3 above zero while ' +
      'the RK4 endpoint first-crosses only -5.44e-5 below zero, so both dt/2 schemes ' +
      'straddle the endpoint sign boundary -- the knife-edge is genuinely thin.',
  },
  {
    id: 'imp35452-collision-step-scales-as-tc-over-dt-at-every-cell',
    holds: () =>
      ENDPOINT_MAP.rk4.dt.firstCrossStep === 1004 &&
      ENDPOINT_MAP.rk4.dtHalf.firstCrossStep === 2007 &&
      ENDPOINT_MAP.rk4.dtQuar.firstCrossStep === 4014 &&
      ENDPOINT_MAP.dp45.dt.firstCrossStep === 1004 &&
      ENDPOINT_MAP.dp45.dtQuar.firstCrossStep === 4014,
    why:
      'The endpoint first-cross step doubles with each grid halving (1004 -> 2007 -> 4014), ' +
      'so every cell that crosses does so at the SAME physical collision time t_c ~ ' +
      'step*dt -- the crossing LOCATION is scheme- and grid-invariant; only the DP45 dt/2 ' +
      'endpoint sign is anomalous.',
  },
  {
    id: 'imp35452-measurement-only-ladder-stays-no-qed',
    holds: () =>
      IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE.noQED === true &&
      IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE.changesNoBound === true &&
      IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE.cMbStaysGueConditional === 'imp-486',
    why:
      'Characterization / cross-check only: maps the endpoint-positivity knife-edge but ' +
      'does NOT advance the R2 ladder past N=1000, does NOT change the imp-35412 slack ' +
      'denominator, changes NO bound. C_mb stays GUE-conditional (imp-486); ' +
      'no refereed bound is changed. Never a QED or a bound change.',
  },
];
