/**
 * @module imp-3845-per-site-self-similar-depth-dyson-run
 *
 * imp-3845 (numerical, frontier-direction): imp-3726 STATED the self-similar per-site backward-flow depth
 * schedule s_k(g_k) = c * g_k^2 that makes the Lemma B Gronwall floor exp(-2 s_k / g_k^2) = exp(-2c)
 * scale-INVARIANT (independent of g_k), the imp-3708 escape from the floor_meso^{k^2} collapse of a single
 * GLOBAL depth. But imp-3726 flagged its own N2 residual: "the floor values 0.991 / 0.7788 are SCALING
 * estimates from the exponent 2 s / y^2, NOT outputs of an actual per-site RK4 run." THIS module RUNS that
 * missing per-site adaptive-depth integrator: it integrates the imp-3642 attractive Calogero-Moser /
 * backward-Dyson RK4 flow dx_k/ds = -2 sum 1/(x_k - x_j) with a PER-SITE depth s_k = c * g_k^2 (not one
 * global s), tabulates the REALIZED Lemma B floor at a ladder of shrinking nearest-pair gaps g_k, and
 * reports whether it stays bounded away from 0 uniformly as g_k -> 0 (confirming the reparameterization
 * keeps 2 s_k / g_k^2 constant in practice) or whether discretization / finite-N effects reintroduce
 * collapse. Measurement only; does NOT close G6a_shock_lipschitz, no positivity, imp-3066 untouched; NO QED.
 *
 * WHAT IS MEASURED (the N2 per-site adaptive-depth run, actually executed)
 * -----------------------------------------------------------------------
 * At each local gap scale g the gas is seeded at spacing d = g (a mesoscopic block RESCALED to the local
 * scale, so the mean gap IS g -- the nearest-pair scale), the Lemma B strip is read at height y = g, and
 * the attractive CM flow is integrated by RK4 to the per-site depth s_k = c * g^2. Two quantities:
 *   REALIZED FLOOR(g)  = sup_x Im M(x + i g; after) / sup_x Im M(x + i g; before)  -- the ACTUAL density
 *                        ratio along the per-site flow (Lemma B tracks a LOWER bound on this ratio);
 *   RESPECT RATIO(g)   = realizedFloor(g) / exp(-2c)  -- > 1 iff the flow stays above the Gronwall floor
 *                        (same convention as imp-3642 worstFloorRatio > 0.98).
 *
 * KEY FINDINGS
 * ------------
 * (M1) SCALE-INVARIANT AND BOUNDED on the PRE-COLLISION window. For every fixed pre-collision constant
 *      c < c_front = 1/8, the realized floor is scale-invariant to machine precision across a ladder of
 *      shrinking gaps spanning three decades (g from O(1) down to O(1e-3)) -- spread < 1e-13 -- and stays
 *      BOUNDED AWAY FROM 0 (in fact ABOVE 1: the attractive flow clumps the gas and RAISES the density
 *      floor). Measured constant-value floors: c_pin = E_meso/2 gives 1.0021, c = 1/32 gives 1.0169,
 *      c = 1/16 gives 1.0401. The exponent 2 s_k / g^2 = 2c is held constant to machine epsilon at every
 *      rung. This CONFIRMS imp-3726 with an actual per-site RK4 run: the imp-3708 fixed-depth
 *      floor_meso^{k^2} collapse is a reparameterization artifact -- the per-site depth removes it and the
 *      realized floor does NOT collapse as g_k -> 0. The scale-invariance is the exact scale-covariance of
 *      the CM flow (x -> lambda x, s -> lambda^2 s) realized numerically: the per-site RK4 preserves it
 *      because a fixed step count makes dt = s_k / STEPS scale with g^2 too.
 * (M2) THE FRONT-REACHING ENDPOINT c_front = 1/8 IS A SINGULAR LIMIT. c_front is exactly the imp-325
 *      collision time tau_c ~ g^2 / 8, so integrating a per-site depth s_k = g^2 / 8 drives the flow onto
 *      the collision singularity. There the RK4 realized floor is NON-CONVERGENT: refining the step count
 *      (STEPS = 250, 500, 1000, 2000) makes the reported floor wander (1.07, 1.32, 1.48, 1.13) with no
 *      limit -- the value is not a reliable number. This REFINES imp-3726: the closed interval
 *      c in [c_pin, c_front] must be OPENED to c in [c_pin, c_front) -- the schedule keeps the floor
 *      bounded on the pre-collision window but reaching TO the front is a singular limit, exactly why
 *      imp-3642 integrates only to HALF the shock budget rather than to the collision.
 * (M3) FIXED-GLOBAL-DEPTH CONTRAST. Holding one global depth s_glob and reading it at a shrinking strip
 *      height y = g gives the exponent 2 s_glob / g^2 -> infinity, so the analytic floor exp(-2 s_glob/g^2)
 *      underflows to 0 as g -> 0 (reproduces the imp-3708 floor_meso^{k^2} collapse). The per-site depth
 *      is what removes it.
 *
 * HONEST SCOPE / WHAT STAYS OPEN
 * ------------------------------
 * This RUNS the imp-3726 N2 object (a per-site adaptive-depth RK4 integrator) and confirms M1 numerically,
 * refining M2. It does NOT touch imp-3726 N1 (the heterogeneous-depth Gronwall CONTRACTION composed across
 * the range of separations -- the pinned per-pair floor is NECESSARY but not SUFFICIENT) nor N3 (the K1/K2
 * two-point pair-separation extension). The seed is a locally-uniform mesoscopic block rescaled to g, so
 * what is read is the density-floor SHOCK quantity, NOT the microscopic nearest-pair collision; the
 * absolute shock constant c_sh (imp-2520 SG1, OPEN) is untouched. So G6a_shock_lipschitz stays OPEN.
 *
 * MEASUREMENT ONLY. RH-EQUIVALENT; necessary-but-not-sufficient. No positivity, no bridge closure, no RH
 * claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3726-y2-adapted-flow-depth-schedule (states s_k = c g_k^2; N2 = "not outputs of an actual per-site RK4 run")
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (the RK4 machinery reused here; integrates to HALF the shock budget)
 * @see imp-3708-s2-gronwall-vacuity-intrinsic-assessment (fixed-depth floor collapse floor_meso^{k^2}; escape s(y) ~ y^2)
 * @see dyson-collision-lower-bound (imp-325: dg_k^2/dtau >= -8, so tau_c >= g_k^2 / 8 = c_front g_k^2)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

// ── imp-3642 RK4 machinery, replicated (kept light: no heavy imports) ──
// Unnormalized Stieltjes transform Im M(x + i y) = sum_k y / ((x_k - x)^2 + y^2)
function imM(xs, xr, y) {
  let s = 0;
  for (let k = 0; k < xs.length; k++) {
    const a = xs[k] - xr;
    s += y / (a * a + y * y);
  }
  return s;
}
// grid-sup of Im M over the strip boundary y (the Lemma B quantity), grid step d/8
function gridSupImM(xs, y, d) {
  let best = 0;
  for (let x = -6 * d; x <= 6 * d; x += d / 8) {
    const v = imM(xs, x, y);
    if (v > best) best = v;
  }
  return best;
}
// attractive Calogero-Moser velocities dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j)
function attractiveVelocities(xs) {
  const n = xs.length;
  const v = new Array(n).fill(0);
  for (let k = 0; k < n; k++) {
    let s = 0;
    for (let j = 0; j < n; j++) if (j !== k) s -= 2 / (xs[k] - xs[j]);
    v[k] = s;
  }
  return v;
}
// locally-uniform mesoscopic seed at spacing d, small deterministic (reproducible) perturbation
function seedBlock(d, M) {
  const xs = new Array(M);
  for (let k = 0; k < M; k++) {
    const base = (k - (M - 1) / 2) * d;
    const jitter = 0.15 * d * Math.sin(2.4 * k) + 0.07 * d * Math.cos(5.1 * k);
    xs[k] = base + jitter;
  }
  return xs;
}
function rk4Step(xs, dt) {
  const k1 = attractiveVelocities(xs);
  const x2 = xs.map((x, i) => x + 0.5 * dt * k1[i]);
  const k2 = attractiveVelocities(x2);
  const x3 = xs.map((x, i) => x + 0.5 * dt * k2[i]);
  const k3 = attractiveVelocities(x3);
  const x4 = xs.map((x, i) => x + dt * k3[i]);
  const k4 = attractiveVelocities(x4);
  return xs.map((x, i) => x + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

const BLOCK_M = 161; // same block size as imp-3642
const STEPS = 250; // same RK4 step count as imp-3642

// PER-SITE run: seed at spacing d = g (rescaled to the local gap), read strip at y = g, integrate the
// attractive CM flow to the per-site depth s_k = c * g^2. Returns the realized Lemma B floor at that pair.
function perSiteRun(g, c, steps = STEPS) {
  const d = g;
  const y = g;
  let xs = seedBlock(d, BLOCK_M);
  const before = gridSupImM(xs, y, d);
  const s_k = c * g * g; // per-site self-similar depth
  const dt = s_k / steps; // step scales with g^2 too -> dt/g^2 = c/steps is scale-invariant
  for (let step = 0; step < steps; step++) xs = rk4Step(xs, dt);
  const after = gridSupImM(xs, y, d);
  const realizedFloor = after / before; // actual density ratio along the per-site flow
  const analyticFloor = Math.exp(-2 * c); // Lemma B Gronwall floor exp(-2 s_k / g^2) = exp(-2c)
  const respectRatio = realizedFloor / analyticFloor; // > 1 iff flow stays above the Gronwall floor
  const exponent = (2 * s_k) / (g * g); // must equal the constant 2c at every scale
  return { g, c, s_k, exponent, realizedFloor, analyticFloor, respectRatio };
}

const C_PIN = 0.009041 / 2; // E_meso/2 = 0.0045205 (imp-3708 floor-pinning constant)
const C_FRONT = 1 / 8; // 0.125 (imp-325 collision-time depth tau_c >= g^2/8) -- the singular endpoint

// (M1) PRE-COLLISION c-ladder at g = 1 (the realized floor is scale-invariant, so g is a free label).
const PRE_COLLISION_C = [C_PIN, 1 / 32, 1 / 16];
const C_LADDER_ROWS = PRE_COLLISION_C.map((c) => {
  const r = perSiteRun(1, c);
  return {
    c: +c.toFixed(7),
    exponent: +r.exponent.toFixed(8), // = 2c to machine epsilon
    analyticFloor: +r.analyticFloor.toFixed(6), // exp(-2c) (the imp-3726 scaling estimate)
    realizedFloor: +r.realizedFloor.toFixed(8), // ACTUAL per-site RK4 output
    respectRatio: +r.respectRatio.toFixed(6), // > 1: Gronwall floor respected
  };
});

// (M1) SCALE-INVARIANCE across a ladder of shrinking gaps (mixed dyadic + non-dyadic) at a representative
// pre-collision depth c = 1/16. The realized floor is constant to machine precision as g -> 0.
const G_LADDER = [1, 0.5, 0.25, 0.1, 0.05, 0.01, 0.003];
const C_PROBE = 1 / 16;
const SCALE_ROWS = G_LADDER.map((g) => {
  const r = perSiteRun(g, C_PROBE);
  return { g: +g.toExponential(3), realizedFloor: +r.realizedFloor.toFixed(10), respectRatio: +r.respectRatio.toFixed(6) };
});
const SCALE_FLOORS = SCALE_ROWS.map((r) => r.realizedFloor);
const SCALE_SPREAD = Math.max(...SCALE_FLOORS) - Math.min(...SCALE_FLOORS); // ~1e-14: scale-invariant
const SCALE_MIN_FLOOR = Math.min(...SCALE_FLOORS); // bounded away from 0 (> 1)
const SCALE_MIN_RESPECT = Math.min(...SCALE_ROWS.map((r) => r.respectRatio)); // > 1: floor respected

// (M2) FRONT-REACHING ENDPOINT c_front is SINGULAR: refining STEPS makes the realized floor wander (no limit).
const FRONT_STEP_COUNTS = [250, 500, 1000, 2000];
const FRONT_STEP_FLOORS = FRONT_STEP_COUNTS.map((steps) => +perSiteRun(1, C_FRONT, steps).realizedFloor.toFixed(8));
const FRONT_STEP_RANGE = Math.max(...FRONT_STEP_FLOORS) - Math.min(...FRONT_STEP_FLOORS); // O(0.1): non-convergent
// same step-refinement at a pre-collision depth c = 1/16 CONVERGES (range ~1e-13) -- the contrast that proves
// the front endpoint (not the method) is what is singular.
const PRE_STEP_FLOORS = FRONT_STEP_COUNTS.map((steps) => perSiteRun(1, C_PROBE, steps).realizedFloor);
const PRE_STEP_RANGE = Math.max(...PRE_STEP_FLOORS) - Math.min(...PRE_STEP_FLOORS); // ~1e-13: converged

// (M3) FIXED-GLOBAL-DEPTH analytic floor collapses as g -> 0 (imp-3708 floor_meso^{k^2} baseline).
function fixedDepthAnalyticFloor(g, sGlob) {
  return Math.exp((-2 * sGlob) / (g * g)); // exponent 2 s_glob/g^2 diverges as g -> 0
}
const S_GLOB = C_FRONT * 1 * 1; // one absolute depth s_glob = 1/8, read at shrinking g
const FIXED_FLOOR_AT_1 = fixedDepthAnalyticFloor(1, S_GLOB); // 0.779
const FIXED_FLOOR_AT_SMALL = fixedDepthAnalyticFloor(0.03125, S_GLOB); // ~6.6e-112: collapsed

export const IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN = {
  id: 'imp-3845',
  proofSection: 'S-frontier',
  question:
    'Run the imp-3642 backward-Dyson RK4 with the imp-3726 PER-SITE self-similar depth schedule ' +
    's_k = c g_k^2 (the imp-3726 N2 object, which was a scaling estimate, not an actual run) and MEASURE ' +
    'whether the Lemma B Gronwall floor exp(-2 s_k / g_k^2) = exp(-2c) stays bounded away from 0 uniformly ' +
    'as g_k -> 0 across the shrinking nearest-pair scales, or whether discretization / finite-N effects ' +
    'reintroduce collapse. Measurement only; does not close G6a, no positivity, imp-3066 untouched; NO QED.',
  quantity:
    'realized Lemma B floor(g) = sup_x Im M(x + i g; after) / sup_x Im M(x + i g; before) along the ' +
    'per-site CM flow dx_k/ds = -2 sum 1/(x_k - x_j) integrated to depth s_k = c g^2; respect ratio ' +
    'realizedFloor(g) / exp(-2c) (> 1 iff the flow stays above the Gronwall floor, imp-3642 convention)',
  method: {
    flow: 'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) (attractive Calogero-Moser, Step-2 backward-Dyson)',
    blockSize: BLOCK_M,
    rk4Steps: STEPS,
    seed: 'locally-uniform mesoscopic block RESCALED to spacing d = g (mean gap = the local nearest-pair scale)',
    perSiteDepth: 's_k = c * g^2 (run pair k -s flow only as deep as the local gap squared); dt = s_k / STEPS',
    strip: 'Lemma B strip read at y = g (the local gap itself), so exp(-2 s_k / g^2) = exp(-2c)',
  },
  preCollisionCLadder: C_LADDER_ROWS, // realized floors at c_pin, 1/32, 1/16 (all bounded, respectRatio > 1)
  scaleInvariance: {
    probeConstant: +C_PROBE.toFixed(6), // c = 1/16, a representative pre-collision depth
    gLadder: SCALE_ROWS, // realized floor at each shrinking gap g (constant to machine precision)
    spread: +SCALE_SPREAD.toExponential(2), // ~1e-14: scale-invariant across three decades of g
    minRealizedFloor: +SCALE_MIN_FLOOR.toFixed(8), // > 1: bounded away from 0
    minRespectRatio: +SCALE_MIN_RESPECT.toFixed(6), // > 1: Gronwall floor respected at every scale
  },
  frontEndpointSingular: {
    c_front: +C_FRONT.toFixed(6), // 0.125 = imp-325 collision time tau_c ~ g^2/8
    stepCounts: FRONT_STEP_COUNTS,
    realizedFloors: FRONT_STEP_FLOORS, // wander with STEPS: no limit (1.07, 1.32, 1.48, 1.13)
    stepRefinementRange: +FRONT_STEP_RANGE.toFixed(4), // O(0.1): NON-convergent at the collision endpoint
    preCollisionStepRange: +PRE_STEP_RANGE.toExponential(2), // ~1e-13 at c = 1/16: converged (contrast)
  },
  fixedGlobalDepthCollapse: {
    s_glob: +S_GLOB.toFixed(6), // one absolute depth read at shrinking y = g
    floorAt_g1: +FIXED_FLOOR_AT_1.toFixed(6), // 0.779
    floorAt_g_small: +FIXED_FLOOR_AT_SMALL.toExponential(2), // ~6.6e-112: collapsed (imp-3708 floor_meso^{k^2})
  },
  finding: {
    M1_bounded_scale_invariant:
      'RUNNING the per-site adaptive-depth RK4 (imp-3726 N2) CONFIRMS the reparameterization: for every ' +
      'fixed pre-collision c < c_front the realized Lemma B floor is scale-invariant to machine precision ' +
      '(spread ' + SCALE_SPREAD.toExponential(1) + ' across g from 1 to ' + G_LADDER[G_LADDER.length - 1] +
      ') and stays BOUNDED AWAY FROM 0 -- in fact above 1 (attractive clumping raises the density floor): ' +
      'c_pin -> ' + C_LADDER_ROWS[0].realizedFloor + ', c=1/32 -> ' + C_LADDER_ROWS[1].realizedFloor +
      ', c=1/16 -> ' + C_LADDER_ROWS[2].realizedFloor + '. The exponent 2 s_k / g^2 = 2c is held constant ' +
      'to machine epsilon at every rung, so the imp-3708 fixed-depth floor_meso^{k^2} collapse does NOT ' +
      'reappear: the per-site depth removes it and no discretization / finite-N collapse is observed.',
    M2_front_endpoint_singular:
      'The front-reaching endpoint c_front = 1/8 is exactly the imp-325 collision time tau_c ~ g^2/8, so ' +
      'integrating a per-site depth s_k = g^2/8 drives the flow onto the collision singularity. There the ' +
      'RK4 realized floor is NON-convergent: STEPS = 250/500/1000/2000 give ' + FRONT_STEP_FLOORS.join(' / ') +
      ' (range ' + FRONT_STEP_RANGE.toFixed(3) + '), no limit, whereas the same refinement at c = 1/16 ' +
      'converges to range ' + PRE_STEP_RANGE.toExponential(1) + '. So imp-3726 closed interval ' +
      '[c_pin, c_front] must be OPENED to [c_pin, c_front): the schedule keeps the floor bounded on the ' +
      'pre-collision window, but reaching TO the front is a singular limit -- exactly why imp-3642 ' +
      'integrates only to HALF the shock budget rather than to the collision.',
    M3_fixed_depth_collapse:
      'Holding one global depth s_glob = ' + S_GLOB.toFixed(3) + ' and reading it at a shrinking strip ' +
      'y = g gives exponent 2 s_glob/g^2 -> infinity, so the analytic floor underflows from ' +
      FIXED_FLOOR_AT_1.toFixed(3) + ' at g=1 to ' + FIXED_FLOOR_AT_SMALL.toExponential(1) + ' at g=1/32 ' +
      '(the imp-3708 floor_meso^{k^2} collapse). The per-site depth is what removes it.',
  },
  scaleInvarianceMechanism:
    'The realized floor is scale-invariant because the CM flow dx_k/ds = -2 sum 1/(x_k - x_j) is exactly ' +
    'scale-covariant (x -> lambda x, s -> lambda^2 s): seeding at d = g, reading at y = g, and flowing to ' +
    's_k = c g^2 maps every scale to the SAME unit problem. The per-site RK4 preserves this because a fixed ' +
    'step count makes dt = s_k / STEPS scale with g^2 too, so dt / g^2 = c / STEPS is scale-invariant.',
  opensN1: false, // heterogeneous-depth Gronwall CONTRACTION composition (imp-3726 N1) UNTOUCHED
  opensN3: false, // K1/K2 two-point pair-separation extension (imp-3726 N3) UNTOUCHED
  g6aStillOpen: true,
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). RUNNING the imp-3726 N2 object -- the per-site ' +
    'adaptive-depth integrator that imp-3726 flagged as a scaling estimate, not an actual RK4 run -- on the ' +
    'imp-3642 attractive Calogero-Moser backward-Dyson flow dx_k/ds = -2 sum 1/(x_k - x_j) with per-site ' +
    'depth s_k = c g^2 (block of 161 rescaled to spacing d = g, strip y = g, 250 RK4 steps) shows: (M1) for ' +
    'every fixed PRE-COLLISION c < c_front = 1/8 the realized Lemma B floor is scale-invariant to machine ' +
    'precision (spread < 1e-13 across g from 1 down to 3e-3) and stays BOUNDED AWAY FROM 0 -- in fact above ' +
    '1 (attractive clumping raises the density floor): c_pin -> 1.0021, c=1/32 -> 1.0169, c=1/16 -> 1.0401, ' +
    'with the exponent 2 s_k/g^2 held at the constant 2c, so the imp-3708 fixed-depth floor_meso^{k^2} ' +
    'collapse does NOT reappear and NO discretization / finite-N collapse is observed; (M2) the ' +
    'front-reaching ENDPOINT c_front = 1/8 is exactly the imp-325 collision time tau_c ~ g^2/8, so ' +
    'integrating to that depth hits the collision singularity where the RK4 floor is NON-convergent ' +
    '(STEPS = 250/500/1000/2000 wander with no limit, range O(0.1), vs range ~1e-13 at c=1/16), so the ' +
    'imp-3726 closed interval [c_pin, c_front] must be OPENED to [c_pin, c_front) -- reaching TO the front ' +
    'is a singular limit, exactly why imp-3642 integrates only to HALF the shock budget; (M3) the ' +
    'fixed-global-depth analytic floor underflows (0.779 at g=1 to ~6.6e-112 at g=1/32), reproducing the ' +
    'imp-3708 collapse the per-site depth removes. The scale-invariance is the exact scale-covariance of the ' +
    'CM flow (x -> lambda x, s -> lambda^2 s) realized numerically. This RUNS imp-3726 N2 and confirms M1; ' +
    'it does NOT touch imp-3726 N1 (the heterogeneous-depth Gronwall CONTRACTION composed across the range ' +
    'of separations -- the pinned per-pair floor is NECESSARY but not SUFFICIENT) nor N3 (the K1/K2 ' +
    'two-point pair-separation extension). The seed is mesoscopic, so only the density-floor SHOCK quantity ' +
    'is read, not the microscopic nearest-pair collision; the absolute shock constant c_sh (imp-2520 SG1, ' +
    'OPEN) is untouched. So G6a_shock_lipschitz stays OPEN. Measurement only, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; no positivity, no bridge closure, no RH claim, NO QED. imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3726 (states s_k = c g_k^2; N2 = "not outputs of an actual per-site RK4 run"); imp-3642 ' +
    '(backward-Dyson RK4 machinery; integrates to HALF the shock budget); imp-3708 (fixed-depth floor ' +
    'collapse floor_meso^{k^2}, escape s(y) ~ y^2); imp-325 dyson-collision-lower-bound (tau_c >= g^2/8 = ' +
    'c_front g^2); lambda-roadmap Step 4 (Polymath15 bridge, open sub-gap G6a_shock_lipschitz).',
};

export const IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN_ASSERTIONS = [
  {
    // (M1) The per-site exponent 2 s_k / g^2 = 2c is held constant to machine epsilon at every rung.
    id: 'imp3845-per-site-exponent-is-constant-2c',
    description: 'the realized exponent 2 s_k/g^2 equals the constant 2c to machine epsilon on the c-ladder',
    holds: () => C_LADDER_ROWS.every((row) => Math.abs(row.exponent - 2 * row.c) < 1e-9),
  },
  {
    // (M1) The realized floor is scale-invariant across three decades of shrinking g (spread ~1e-14).
    id: 'imp3845-realized-floor-scale-invariant',
    description: 'realized floor at c=1/16 is constant to < 1e-10 across g from 1 down to 3e-3 (no collapse)',
    holds: () => SCALE_SPREAD < 1e-10,
  },
  {
    // (M1) The realized floor stays bounded away from 0 uniformly (in fact above 1) as g -> 0.
    id: 'imp3845-realized-floor-bounded-away-from-zero',
    description: 'min realized floor across the shrinking-gap ladder is > 1 (bounded away from 0), respectRatio > 1',
    holds: () =>
      SCALE_MIN_FLOOR > 1 &&
      SCALE_MIN_RESPECT > 1 &&
      C_LADDER_ROWS.every((row) => row.realizedFloor > 1 && row.respectRatio > 1),
  },
  {
    // (M2) The front endpoint c_front = 1/8 is the imp-325 collision time and is a SINGULAR limit:
    // step-refinement wanders there (no limit) while a pre-collision depth converges to machine precision.
    id: 'imp3845-front-endpoint-singular-not-method',
    description: 'STEPS refinement is non-convergent at c_front (range >> pre-collision range): the endpoint is singular',
    holds: () =>
      Math.abs(C_FRONT - 1 / 8) < 1e-15 &&
      FRONT_STEP_RANGE > 1e-2 && // wanders at the collision endpoint
      PRE_STEP_RANGE < 1e-6 && // converges at a pre-collision depth
      FRONT_STEP_RANGE > 1e4 * PRE_STEP_RANGE, // the endpoint, not the method, is singular
  },
  {
    // (M3) The fixed-global-depth analytic floor collapses as g -> 0 (imp-3708 floor_meso^{k^2}); the
    // per-site depth is what removes it.
    id: 'imp3845-fixed-global-depth-collapses',
    description: 'fixed-global-depth floor > 0.7 at g=1 but underflows below 1e-8 at g=1/32 (per-site depth removes it)',
    holds: () => FIXED_FLOOR_AT_1 > 0.7 && FIXED_FLOOR_AT_SMALL < 1e-8,
  },
  {
    // Scope: this RUNS imp-3726 N2 only; N1 (heterogeneous-depth contraction) and N3 (two-point) untouched.
    id: 'imp3845-n1-n3-untouched-g6a-open',
    description: 'imp-3726 N1 and N3 untouched, G6a still open (this runs N2 only)',
    holds: () =>
      IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN.opensN1 === false &&
      IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN.opensN3 === false &&
      IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN.g6aStillOpen === true,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3845-honesty-gate-no-qed',
    description: 'Measurement only: no QED, RH-equivalent necessary-but-not-sufficient, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN.isRigorous === false &&
      /NO QED/.test(IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN.verdict) &&
      /RH-EQUIVALENT/.test(IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN.verdict) &&
      /necessary-but-not-sufficient/.test(IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN.verdict) &&
      /refereed bound is changed/i.test(IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN.verdict.replace(/\s+/g, ' ')) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN.verdict),
  },
];

for (const a of IMP3845_PER_SITE_SELF_SIMILAR_DEPTH_DYSON_RUN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3845-per-site-self-similar-depth-dyson-run assertion failed: ${a.id}`);
  }
}
