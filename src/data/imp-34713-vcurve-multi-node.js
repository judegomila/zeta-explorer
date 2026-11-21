/**
 * @module imp-34713-vcurve-multi-node
 *
 * imp-34692 (numerical, frontier cross-validation) extended the imp-34685 two-endpoint
 * central-difference cross-check of the imp-34650 map derivative
 *   gPrime(N) = K * (dT0/dN)/T0,  dT0/dN = 2pi / log(T0 / 2pi),
 * to a dense 201-point log grid, and ran the textbook step-size V-curve study
 * (O(h^2) truncation down to a ~4.5e-12 floor near h/N ~ eps^(1/3), then subtractive-
 * cancellation roundoff climb) -- but the V-curve was traced at the SINGLE node N_cross.
 * This module repeats the SAME h/N sweep at SEVERAL nodes spanning the imp-34675 left
 * edge N_star ~ 1.475e8, the imp-34650/imp-33723 fixed point N_cross ~ 3.28e9, and the
 * imp-34676 right-widened tail out to ~1e12, and MEASURES the optimal h/N and the
 * attained floor at EACH node -- confirming the eps^(1/3) minimum and the
 * "no non-vanishing floor" (formula-error-free) diagnostic hold UNIFORMLY across the
 * contraction interval, not only at the fixed point.
 *
 * WHAT IS MEASURED
 * ----------------
 * 1. Per-node V-curve. At each of five nodes the relative step h/N is swept from 1e-2
 *    down to 1e-10 and the FD-vs-analytic relative error |numeric/analytic - 1| is
 *    recorded. Every node reproduces the classic V shape: monotone O(h^2) descent in the
 *    truncation regime, a floor near the theoretical optimum, then a roundoff climb.
 * 2. Optimal step is eps^(1/3) everywhere. The step that minimizes the error lands at
 *    h/N in {1e-5, 1e-6} at every node -- straddling the classic central-difference
 *    optimum h/N ~ eps^(1/3) ~ 6.06e-6 (eps = 2^-52) -- not drifting with N. The measured
 *    minimum h/N stays inside [1e-6, 1e-5] across the whole interval.
 * 3. Floor is method-limited (formula-error-free) everywhere. At every node the attained
 *    floor is ~1e-11 or below and is STRICTLY smaller than the error at the coarsest step
 *    (1e-2) AND the error CLIMBS again at the finest step (1e-10). A formula error would
 *    leave a NON-vanishing floor as h -> 0; instead the error is driven arbitrarily small
 *    by tuning h at every node, so the ~1e-10 residual is the differencing method's
 *    roundoff at each node, not a defect in gPrime -- the imp-34692 N_cross conclusion is
 *    not a fixed-point artifact.
 *
 * RESULT
 * ------
 * The imp-34692 single-node (N_cross) V-curve generalizes: at five log-spaced nodes across
 * [N_star, ~1e12] the optimal relative step stays pinned at h/N ~ eps^(1/3) (measured
 * minimum in {1e-5, 1e-6}) and the attained floor is ~1e-11 or below with a genuine
 * roundoff climb beneath it -- so the ~1e-10 residual is method-limited (formula-error-free)
 * UNIFORMLY over the contraction interval, not just at the fixed point.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY. This is a wider step-size sweep of the SAME inherited
 * surrogate derivative; it adds NO new RH bound, does not touch the C_C = (1/8) sqrt(3 pi)
 * ansatz (imp-2642/imp-2643), does not upgrade the imp-34650a interval-arithmetic sub-gap,
 * leaves the C_mb GUE-conditional per imp-486 UNTOUCHED, establishes no operator positivity,
 * and issues NO QED. No refereed bound is changed.
 *
 * @see imp-34692-derivative-crosscheck-wide-grid (the single-node V-curve widened here)
 * @see imp-34685-banach-certificate-crossvalidation (the two-endpoint derivative check)
 * @see imp-34650-crossover-banach-contraction-certificate (the analytic derivative formula)
 * @see imp-34675-crossover-contraction-left-edge (N_star ~ 1.475e8, the grid left edge)
 * @see imp-34676-crossover-contraction-right-widening (the ~1e12 right-widened tail)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the source solver reproduced inline here)
 */

// -- Independent constants (baked, no imports; mirror imp-34692) ---------------
const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 ~ 2.22e-16
const EPS_CBRT = Math.cbrt(EPS); // classic central-difference optimum ~6.06e-6

// -- Fresh inline copy of the Riemann-von Mangoldt inverse-height solver -------
// Inverse of N(T) = (T/2pi)(log(T/2pi) - 1), Newton against f(T) = N(T) - N.
// Independently re-typed from lambda-rh-height-mapping.js (NOT imported).
function inverseHeight(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI; // dN/dT = log(T/2pi)/2pi
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

// Analytic dT0/dN (the imp-34650 step under test) and its central-difference twin.
const dT0dNanalytic = (N) => TWO_PI / Math.log(inverseHeight(N) / TWO_PI);
const dT0dNnumeric = (N, relStep) => {
  const h = N * relStep;
  return (inverseHeight(N + h) - inverseHeight(N - h)) / (2 * h);
};

// -- Nodes across the contraction interval (imp-34675 edge .. imp-34676 tail) --
const N_STAR = 1.475e8; // imp-34675 left edge of the contraction interval
const N_CROSS = 3.280294e9; // imp-34650/imp-33723 fixed point
const N_TAIL = 1e12; // imp-34676 right-widened tail
// Five log-spaced probe nodes spanning the whole interval (endpoints + interior +
// N_cross), so the V-curve is sampled left edge, below/at/above the fixed point, tail.
const NODES = [N_STAR, 1e9, N_CROSS, 1e11, N_TAIL];

// -- Step-size study: the imp-34692 V-curve ladder, now run at every node ------
const STEP_LADDER = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10];

function vCurveAt(N) {
  const a = dT0dNanalytic(N);
  const study = STEP_LADDER.map((relStep) => ({
    relStep,
    relErr: Math.abs(dT0dNnumeric(N, relStep) / a - 1),
  }));
  const best = study.reduce((m, s) => (s.relErr < m.relErr ? s : m), study[0]);
  // Truncation regime: monotone O(h^2) descent over the coarse steps 1e-2..1e-5.
  const truncMonotone =
    study[0].relErr > study[1].relErr &&
    study[1].relErr > study[2].relErr &&
    study[2].relErr > study[3].relErr;
  // Roundoff regime: error climbs again below the optimum (finest step worse than best).
  const roundoffClimbs = study[8].relErr > study[6].relErr && study[8].relErr > best.relErr;
  // Formula-error-free diagnostic: floor is genuine (best strictly below coarse endpoint,
  // and roundoff climbs beneath it) => tuning h drives the error small, no fixed floor.
  const methodLimited = best.relErr < study[0].relErr && roundoffClimbs;
  // Optimal step pinned at eps^(1/3) (measured minimum in {1e-5, 1e-6}), N-independent.
  const optNearEpsCbrt = best.relStep <= 1e-5 && best.relStep >= 1e-6;
  return { N, study, best, truncMonotone, roundoffClimbs, methodLimited, optNearEpsCbrt };
}

const NODE_STUDIES = NODES.map(vCurveAt);

// -- Cross-node summaries ------------------------------------------------------
const ALL_TRUNC_MONOTONE = NODE_STUDIES.every((s) => s.truncMonotone);
const ALL_ROUNDOFF_CLIMB = NODE_STUDIES.every((s) => s.roundoffClimbs);
const ALL_METHOD_LIMITED = NODE_STUDIES.every((s) => s.methodLimited);
const ALL_OPT_NEAR_EPS_CBRT = NODE_STUDIES.every((s) => s.optNearEpsCbrt);
const WORST_FLOOR = NODE_STUDIES.reduce((m, s) => Math.max(m, s.best.relErr), 0);
const OPT_STEPS = NODE_STUDIES.map((s) => s.best.relStep);
const OPT_STEP_MIN = Math.min(...OPT_STEPS);
const OPT_STEP_MAX = Math.max(...OPT_STEPS);

export const IMP34713_VCURVE_MULTI_NODE = {
  id: 'imp-34713',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-34692 central-difference step-size V-curve study from N_cross alone to several nodes ' +
    'across the [N_star, ~1e12] grid: measure the optimal h/N and the eps^(1/3) minimum at each, confirming ' +
    'the ~1e-10 residual is method-limited (formula-error-free) everywhere, not just at the fixed point. ' +
    'Cross-validation/measurement only; no new bound; no QED.',
  measured: {
    eps: +EPS.toExponential(4),
    eps_cbrt: +EPS_CBRT.toExponential(4), // classic optimum h/N ~ 6.06e-6
    node_count: NODES.length,
    // Per-node V-curve: node N, its optimal h/N, and the attained floor there.
    nodes: NODE_STUDIES.map((s) => ({
      N: +s.N.toExponential(4),
      opt_h_over_N: +s.best.relStep.toExponential(0),
      floor_rel_err: +s.best.relErr.toExponential(3),
      trunc_monotone: s.truncMonotone,
      roundoff_climbs: s.roundoffClimbs,
    })),
    // The optimal h/N stays pinned in [1e-6, 1e-5] across every node (N-independent).
    opt_step_min: +OPT_STEP_MIN.toExponential(0),
    opt_step_max: +OPT_STEP_MAX.toExponential(0),
    // Worst attained floor over all nodes -- still ~1e-11 or below.
    worst_floor_rel_err: +WORST_FLOOR.toExponential(3),
  },
  findings: {
    v_curve_at_every_node: ALL_TRUNC_MONOTONE && ALL_ROUNDOFF_CLIMB,
    optimal_step_pinned_at_eps_cbrt: ALL_OPT_NEAR_EPS_CBRT,
    floor_method_limited_at_every_node: ALL_METHOD_LIMITED,
    worst_floor_below_1e10: WORST_FLOOR < 1e-10,
    uniform_not_fixed_point_artifact: ALL_METHOD_LIMITED && ALL_OPT_NEAR_EPS_CBRT,
  },
  discrepancy:
    'NONE. At five log-spaced nodes across [1.475e8, 1e12] -- the imp-34675 left edge N_star, an interior ' +
    'point below the fixed point, N_cross ~ 3.28e9, an interior point above it, and the imp-34676 tail ~1e12 ' +
    '-- the central-difference V-curve reproduces the same shape everywhere: monotone O(h^2) truncation ' +
    'descent, an optimal step pinned at h/N in {1e-5, 1e-6} (straddling eps^(1/3) ~ 6.06e-6), a floor ' +
    '~1e-11 or below, then a roundoff climb. The floor is method-limited at every node, so the imp-34692 ' +
    'N_cross conclusion is not a fixed-point artifact.',
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT an RH bound). The imp-34692 single-node (N_cross) central- ' +
    'difference step-size V-curve for the imp-34650 derivative gPrime = K*(dT0/dN)/T0, dT0/dN = 2pi/log(T0/2pi), ' +
    'is repeated at five log-spaced nodes spanning the imp-34675 left edge N_star ~ 1.475e8, the fixed point ' +
    'N_cross ~ 3.28e9, and the imp-34676 tail ~1e12. At EVERY node the optimal relative step lands at h/N in ' +
    '{1e-5, 1e-6} (straddling the classic optimum eps^(1/3) ~ 6.06e-6, eps = 2^-52), the attained floor is ' +
    '~1e-11 or below, the truncation regime is monotone O(h^2), and the error CLIMBS again at the finest step ' +
    '-- a genuine V, not a fixed non-vanishing floor. So the ~1e-10 residual is method-limited (formula-error- ' +
    'free) UNIFORMLY across the contraction interval, not only at the fixed point. This widens a numerical ' +
    'step-size sweep of an inherited surrogate derivative; it adds no bound, leaves the imp-34650a interval- ' +
    'arithmetic sub-gap OPEN, leaves the C_C (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED, establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34692 (single-node N_cross V-curve being widened); imp-34685 (two-endpoint derivative cross-check); ' +
    'imp-34650 (analytic derivative formula); imp-34675 (left edge N_star ~ 1.475e8); imp-34676 (right-widened ' +
    'tail to ~1e12); imp-33723 (crossover fixed point); lambda-rh-height-mapping (effectiveHeightForN, inline).',
};

export const IMP34713_VCURVE_MULTI_NODE_ASSERTIONS = [
  {
    // Every node reproduces the textbook V: O(h^2) truncation descent + roundoff climb.
    id: 'imp34713-v-curve-at-every-node',
    description: 'at all five nodes the truncation regime is monotone O(h^2) and roundoff climbs below the optimum',
    holds: () => ALL_TRUNC_MONOTONE && ALL_ROUNDOFF_CLIMB,
  },
  {
    // Optimal step is pinned at eps^(1/3), N-independent (measured minimum in {1e-5,1e-6}).
    id: 'imp34713-optimal-step-eps-cbrt',
    description: 'optimal h/N stays inside [1e-6, 1e-5] (straddling eps^(1/3) ~ 6.06e-6) at every node',
    holds: () => ALL_OPT_NEAR_EPS_CBRT && OPT_STEP_MIN >= 1e-6 && OPT_STEP_MAX <= 1e-5 && EPS_CBRT > 1e-6 && EPS_CBRT < 1e-5,
  },
  {
    // Floor is method-limited (formula-error-free) at every node, not just N_cross.
    id: 'imp34713-floor-method-limited-uniform',
    description: 'floor strictly below the coarse-step error with a roundoff climb beneath it at every node',
    holds: () => ALL_METHOD_LIMITED,
  },
  {
    // Worst attained floor over all nodes is still ~1e-11 or below (well under 1e-10).
    id: 'imp34713-worst-floor-small',
    description: 'worst per-node floor over the interval is < 1e-10 (measured ~1e-11 or below)',
    holds: () => WORST_FLOOR > 0 && WORST_FLOOR < 1e-10,
  },
  {
    // Honesty gate: cross-validation only, no rigorous upgrade, no QED, no refereed bound is changed.
    id: 'imp34713-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no discrepancy, no QED, no refereed bound is changed',
    holds: () =>
      IMP34713_VCURVE_MULTI_NODE.isRigorous === false &&
      /NONE/.test(IMP34713_VCURVE_MULTI_NODE.discrepancy) &&
      /NO QED/.test(IMP34713_VCURVE_MULTI_NODE.verdict) &&
      /refereed bound is changed/i.test(IMP34713_VCURVE_MULTI_NODE.verdict),
  },
];

for (const a of IMP34713_VCURVE_MULTI_NODE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34713-vcurve-multi-node assertion failed: ${a.id}`);
  }
}
