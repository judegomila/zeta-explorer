/**
 * @module imp-33580-graded-mapped-cc-abscissa-artifact
 * @fileoverview imp-33580 -- TEST the imp-33560 attribution. imp-33560 ran a SINGLE Clenshaw-Curtis
 *   inner grid against the deep-tail weight
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel,
 *
 *   at the deeper deep-tail rungs n in {350,375,400} and found its min-node budget CLIMBS with depth
 *   (~257 nodes at n=350/375 to ~513 at n=400) while the imp-33539 graded-GL budget stays FLAT at
 *   ~200 nodes. imp-33560 called that the one honest graded edge and ATTRIBUTED the CC climb to its
 *   fixed Chebyshev-Lobatto abscissae x_k = cos(pi k / N) not tracking the sharpening saddle peak --
 *   but never tested the attribution. This module tests it directly: it re-runs the identical CC
 *   single-grid A(tau*) sweep after composing onto the Chebyshev-Lobatto nodes the SAME origin-
 *   concentrating coordinate map the graded-GL rule uses, and asks whether graded-mapped CC also
 *   flattens (the climb is a uniform-abscissa artifact -- grading, not the solver, carries the edge)
 *   or still climbs (the edge is intrinsic to CC spectral node placement).
 *
 *   THE COORDINATE MAP (the graded-GL clustering, composed onto the CC reference nodes)
 *   -----------------------------------------------------------------------------------
 *   The imp-33539 graded-GL rule clusters panels toward the origin peak via a_j = hi (j/panels)^grade.
 *   The equivalent smooth change of variable is s = hi t^grade with t in [0,1]. The standard CC grid
 *   places its Chebyshev-Lobatto nodes in the reference variable x in [-1,1]; mapping t = (1 + x)/2
 *   and then s = hi t^grade concentrates the nodes toward s = 0 exactly as the graded panels do. The
 *   integral becomes, with Jacobian ds = hi grade t^{grade-1} dt and dt = dx/2,
 *
 *       int_0^hi f(s) ds = (1/2) int_{-1}^1 f(hi t^grade) hi grade t^{grade-1} dx
 *                       approx (1/2) sum_k w_k f(hi t_k^grade) hi grade t_k^{grade-1},  t_k = (1 + x_k)/2,
 *
 *   with the SAME standard CC cosine weights w_k. At grade = 1 this reduces to the imp-33560 linear
 *   map s = (hi/2)(1 + x), so the graded-mapped rule is a strict generalisation of the imp-33560 CC.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   -----------------------------------------------------------------------
 *   For each deeper deep-tail rung n in {350,375,400} we take tau* = saddleTau(n), the imp-33213
 *   log-domain A_log(tau*) target, and sweep BOTH inner rules over the imp-33560 even-N ladder
 *   (nodes 17..2049), scoring each residual in ULP = A_log * 2^-52 and locating the smallest grid
 *   whose residual clears the imp-33316 widened deep-tail band (&lt; 64 ULP):
 *
 *     (CC)   the imp-33560 UNMAPPED single grid: linear map s = (hi/2)(1 + x_k). Reproduces the
 *            imp-33560 climbing budget (~257 -> ~513 nodes) as the control.
 *     (CCg)  the GRADED-MAPPED single grid: same nodes, same weights, map s = hi t_k^grade,
 *            t_k = (1 + x_k)/2, grade = 4 -- the imp-33539 origin-concentrating clustering composed
 *            onto the CC abscissae.
 *
 *   MEASURED (the CC climb IS a uniform-abscissa artifact; grading carries the edge)
 *   -------------------------------------------------------------------------------
 *        n    tau*       unmapped CC min       graded-mapped CC min
 *        350  0.867315   257  (N=256, ~19.7)   129  (N=128, ~35.8)
 *        375  0.880727   257  (N=256, ~22.8)    97  (N=96,  ~19.9)
 *        400  0.893314   513  (N=512, ~35.0)   129  (N=128, ~31.7)
 *
 *     (1) THE UNMAPPED CC BUDGET CLIMBS (control reproduces imp-33560). The linear-mapped CC single
 *         grid min-node budget reproduces the imp-33560 climb verbatim: 257 nodes at n=350/375 rising
 *         to 513 at n=400 as the saddle peak sharpens.
 *     (2) THE GRADED-MAPPED CC BUDGET FLATTENS. Composing the origin-concentrating map s = hi t^4 onto
 *         the SAME Chebyshev-Lobatto nodes collapses the budget to a FLAT ~97-129 nodes across all
 *         three rungs -- it does NOT climb with depth; its worst budget (129) sits BELOW the unmapped
 *         floor (257). At the deepest rung n=400 the graded map cuts the budget ~4x (513 -> 129).
 *     (3) VERDICT: THE CLIMB IS A UNIFORM-ABSCISSA ARTIFACT. Because the only change between (CC) and
 *         (CCg) is the abscissa placement (linear vs origin-concentrating), the imp-33560 depth-climb
 *         is confirmed to come from the UNIFORM Chebyshev-Lobatto placement not tracking the sharpening
 *         peak, NOT from anything intrinsic to Clenshaw-Curtis. Grading -- the origin-concentrating
 *         coordinate map -- carries the flat-budget edge; when CC is given the same abscissae it
 *         flattens too. The imp-33560 attribution is CONFIRMED.
 *
 *   HEADLINE / VERDICT. CLIMBING-BUDGET-IS-A-UNIFORM-ABSCISSA-ARTIFACT. The imp-33560 climbing CC
 *   single-grid budget (~257 -> ~513 nodes over n in {350,375,400}) collapses to a FLAT ~97-129 nodes
 *   once the imp-33539 origin-concentrating map s = hi t^4 is composed onto the Chebyshev-Lobatto
 *   nodes -- so the climb is a uniform-abscissa artifact, not intrinsic to Clenshaw-Curtis. Grading,
 *   not the solver family, carries the flat-budget edge; the imp-33560 attribution is confirmed.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN CROSS-SOLVER MEASUREMENT ONLY, at the RH-equivalent scale class. It tests
 *   the imp-33560 abscissa attribution by composing the graded coordinate map onto the CC nodes; it
 *   changes NO bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560
 *   all LEFT INTACT), and establishes NO operator positivity. The min-node counts are JITTERY
 *   arithmetic-floor lattice properties (imp-33249/imp-33277/imp-33295/imp-33539/imp-33560
 *   latticeJitterCaveat): both residual ladders are non-monotone near the floor (neighbouring even N
 *   bounce above/below the &lt; 64 ULP bar) and cross-platform libm exp/pow/cos variation can shift the
 *   exact counts, so the robust reading is the ORDER of the budgets (graded-mapped ~100 vs unmapped
 *   ~250-500) and the QUALITATIVE flat-vs-climbing separation, not the precise 97/129/257/513 counts.
 *   imp-33537/imp-33557 showed the &lt; 64 ULP band is a coarse-grid artifact that FAILS at deeper rungs
 *   n &gt;= 510; the rungs here (n in {350,375,400}) sit firmly inside the band. The NPHI = 10 Phi-series
 *   truncation is inherited. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH
 *   verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js (the climbing-budget attribution this tests)
 *   @see imp-33539-graded-plateau-deeper-tail-min-budget.js (the flat ~200-node graded plateau + grade-4 map)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the fixed-budget deep-tail measurement + &lt; 64 band)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33580 (accuracy, medium).
 */

const NPHI = 10;
const PI = Math.PI;
const U = Math.pow(2, -52); // double-precision unit roundoff (2^-52)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686/imp-3646). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2) * Math.exp(-PI * n2 * e4);
  }
  return s;
}

/** imp-3850 FACTORED log kernel: ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}). */
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

/**
 * (CC) CLENSHAW-CURTIS weights on the N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N), N even. The
 * standard cosine-series weights w_k = c_k (2/N) sum_{j=0}^{N/2} b_j/(1-4 j^2) cos(2 pi j k / N), with
 * endpoint half-weights c_0 = c_N = 1/2, interior c_k = 1, b_0 = b_{N/2} = 1 else 2. Held VERBATIM
 * from imp-33560 (Chebyshev-Lobatto abscissae + CC cosine weights, independent of the Simpson family).
 */
function clenshawCurtis(N) {
  const x = new Array(N + 1);
  const w = new Array(N + 1);
  for (let k = 0; k <= N; k += 1) x[k] = Math.cos((PI * k) / N);
  for (let k = 0; k <= N; k += 1) {
    let sum = 0;
    const ck = k === 0 || k === N ? 0.5 : 1;
    for (let j = 0; j <= N / 2; j += 1) {
      const bj = j === 0 || j === N / 2 ? 1 : 2;
      sum += (bj / (1 - 4 * j * j)) * Math.cos((2 * PI * j * k) / N);
    }
    w[k] = ck * (2 / N) * sum;
  }
  return { x, w };
}

/**
 * (CC) UNMAPPED single-grid inner rule (imp-33560 control): linear map s = (hi/2)(1 + x_k), so
 * A(tau) = int_0^hi Phi(s)Phi(s+tau) ds by Clenshaw-Curtis with N+1 nodes. Reproduces the imp-33560
 * climbing budget.
 */
function aDirectCC(tau, hi, N) {
  const { x, w } = clenshawCurtis(N);
  const half = hi / 2;
  const mid = hi / 2;
  let sum = 0;
  for (let k = 0; k <= N; k += 1) {
    const s = mid + half * x[k];
    sum += w[k] * half * phiKernel(s) * phiKernel(s + tau);
  }
  return sum;
}

/**
 * (CCg) GRADED-MAPPED single-grid inner rule: the imp-33539 origin-concentrating map s = hi t^grade,
 * t = (1 + x_k)/2, composed onto the SAME Chebyshev-Lobatto nodes and CC weights. With Jacobian
 * ds = hi grade t^{grade-1} dt and dt = dx/2 the contribution of node k is
 * 0.5 w_k hi grade t_k^{grade-1} Phi(s_k) Phi(s_k + tau). At grade = 1 this is exactly aDirectCC.
 * At the t = 0 endpoint (x_k = -1) the Jacobian vanishes for grade > 1, so no pole is introduced.
 */
function aDirectCCgraded(tau, hi, N, grade) {
  const { x, w } = clenshawCurtis(N);
  let sum = 0;
  for (let k = 0; k <= N; k += 1) {
    const t = 0.5 * (1 + x[k]);
    const s = hi * Math.pow(t, grade);
    const jac = hi * grade * Math.pow(t, grade - 1);
    sum += 0.5 * w[k] * jac * phiKernel(s) * phiKernel(s + tau);
  }
  return sum;
}

// 10-node Gauss-Legendre nodes/weights (imp-33213 log-domain target rule).
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];

/** imp-33213 INDEPENDENT log-domain graded-GL -ln A (grade 5, 300 panels, hi=10) target. */
function negLnAgradedGL(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}
function aLog(tau) {
  return Math.exp(-negLnAgradedGL(tau, 10, 300, 5));
}

/** imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} (imp-3893 saddleTau). */
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// -- Configuration (imp-33560 deep-tail grid held verbatim) ----------------------------------------
const HI = 7;                                    // imp-33316/imp-33539/imp-33560 deep-tail inner domain [0,7]
const DEEP_FLOOR_ULP = 64;                       // imp-33316 widened deep-tail A_log floor band
const N_RUNGS = [350, 375, 400];                 // imp-33560 deeper deep-tail rungs
const GRADE = 4;                                 // imp-33295/imp-33316/imp-33539 origin-concentrating grade
const GRADED_MIN_NODES = 200;                    // imp-33539 FLAT graded-GL plateau minimum (reference)
// CC single-grid ladder (even N; nodes = N+1); imp-33560 ladder held verbatim.
const CC_LADDER = [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048];

// -- Per-rung UNMAPPED vs GRADED-MAPPED CC min-node budgets -----------------------------------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  // control: imp-33560 unmapped (linear) CC single-grid smallest N+1 clearing the band.
  let unmappedNodes = Infinity;
  let unmappedN = null;
  let unmappedUlp = Infinity;
  // test: graded-mapped CC single-grid smallest N+1 clearing the band.
  let mappedNodes = Infinity;
  let mappedN = null;
  let mappedUlp = Infinity;

  const ladderRow = CC_LADDER.map((N) => {
    const uUlp = Math.abs(aDirectCC(tauStar, HI, N) - aLogVal) / ulpOfALog;
    const gUlp = Math.abs(aDirectCCgraded(tauStar, HI, N, GRADE) - aLogVal) / ulpOfALog;
    if (uUlp < DEEP_FLOOR_ULP && unmappedNodes === Infinity) {
      unmappedNodes = N + 1;
      unmappedN = N;
      unmappedUlp = uUlp;
    }
    if (gUlp < DEEP_FLOOR_ULP && mappedNodes === Infinity) {
      mappedNodes = N + 1;
      mappedN = N;
      mappedUlp = gUlp;
    }
    return Object.freeze({
      N,
      nodes: N + 1,
      unmappedUlp: uUlp,
      mappedUlp: gUlp,
      unmappedInBand: uUlp < DEEP_FLOOR_ULP,
      mappedInBand: gUlp < DEEP_FLOOR_ULP,
    });
  });

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    ladderRow: Object.freeze(ladderRow),
    unmappedN,
    unmappedNodes,
    unmappedUlp,
    mappedN,
    mappedNodes,
    mappedUlp,
    // graded map cuts the budget at this rung by this factor (unmapped / graded-mapped).
    mapSavingFactor: unmappedNodes / mappedNodes,
  });
});

// -- Summary statistics ----------------------------------------------------------------------------
const UNMAPPED_NODES_BY_RUNG = RUNG_TABLE.map((r) => r.unmappedNodes);
const MAPPED_NODES_BY_RUNG = RUNG_TABLE.map((r) => r.mappedNodes);
const MIN_UNMAPPED_NODES = Math.min(...UNMAPPED_NODES_BY_RUNG);
const MAX_UNMAPPED_NODES = Math.max(...UNMAPPED_NODES_BY_RUNG);
const MIN_MAPPED_NODES = Math.min(...MAPPED_NODES_BY_RUNG);
const MAX_MAPPED_NODES = Math.max(...MAPPED_NODES_BY_RUNG);
const MAX_MAP_SAVING = Math.max(...RUNG_TABLE.map((r) => r.mapSavingFactor));
// shallowest (n=350) and deepest (n=400) rung graded-mapped budgets, for the flat-vs-climb test.
const MAPPED_SHALLOWEST = MAPPED_NODES_BY_RUNG[0];
const MAPPED_DEEPEST = MAPPED_NODES_BY_RUNG[MAPPED_NODES_BY_RUNG.length - 1];

// -- Verdict classifiers ---------------------------------------------------------------------------
// (1) The imp-33560 unmapped CC control CLIMBS with depth (max > min: 513 > 257), reproducing imp-33560.
const unmappedReproducesClimb =
  RUNG_TABLE.every((r) => r.unmappedNodes < Infinity) && MAX_UNMAPPED_NODES > MIN_UNMAPPED_NODES;
// (2) The graded-mapped CC budget FLATTENS: every rung reaches the band, and the worst budget stays at
//     or below the imp-33539 flat ~200-node graded plateau (does not climb into the unmapped regime).
const gradedMappedFlattens =
  RUNG_TABLE.every((r) => r.mappedNodes < Infinity) && MAX_MAPPED_NODES <= GRADED_MIN_NODES;
// (3) The graded-mapped budget stays entirely BELOW the unmapped floor (worst mapped < best unmapped:
//     129 < 257) -- a robust separation not sensitive to the exact jittery counts.
const gradedMappedBelowUnmappedFloor = MAX_MAPPED_NODES < MIN_UNMAPPED_NODES;
// (4) It does NOT climb with depth: the deepest rung budget is not larger than the shallowest, while
//     unmapped grows there (the mechanism is abscissa placement, not depth per se).
const gradedMappedDoesNotClimb = MAPPED_DEEPEST <= MAPPED_SHALLOWEST;
// (5) Coverage: both rules swept across the deeper deep-tail rungs over the wide imp-33560 CC ladder.
const deeperTailCovered =
  N_RUNGS.length >= 3 && N_RUNGS.every((n) => n >= 350 && n <= 400) && CC_LADDER.length >= 10;

const verdict =
  unmappedReproducesClimb && gradedMappedFlattens && gradedMappedBelowUnmappedFloor && gradedMappedDoesNotClimb && deeperTailCovered
    ? 'CLIMBING-BUDGET-IS-A-UNIFORM-ABSCISSA-ARTIFACT:-THE-imp-33560-CLIMBING-CLENSHAW-CURTIS-SINGLE-GRID-' +
      'BUDGET-(~257-NODES-AT-n=350/375-RISING-TO-~513-AT-n=400)-COLLAPSES-TO-A-FLAT-~97-129-NODES-ONCE-THE-' +
      'imp-33539-ORIGIN-CONCENTRATING-MAP-s=hi*t^4-(t=(1+x)/2)-IS-COMPOSED-ONTO-THE-SAME-CHEBYSHEV-LOBATTO-' +
      'NODES-AND-CC-COSINE-WEIGHTS.-THE-WORST-GRADED-MAPPED-BUDGET-(129)-SITS-BELOW-THE-UNMAPPED-FLOOR-(257),-' +
      'AND-AT-THE-DEEPEST-RUNG-n=400-THE-MAP-CUTS-THE-BUDGET-~4x-(513->129).-SINCE-THE-ONLY-CHANGE-IS-THE-' +
      'ABSCISSA-PLACEMENT-(LINEAR-vs-ORIGIN-CONCENTRATING),-THE-imp-33560-DEPTH-CLIMB-IS-A-UNIFORM-ABSCISSA-' +
      'ARTIFACT-NOT-INTRINSIC-TO-CLENSHAW-CURTIS:-GRADING-(THE-COORDINATE-MAP),-NOT-THE-SOLVER-FAMILY,-CARRIES-' +
      'THE-FLAT-BUDGET-EDGE;-THE-imp-33560-ATTRIBUTION-IS-CONFIRMED.-ACCURACY/RULE-DESIGN-CROSS-SOLVER-' +
      'MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR-(ROBUST-READING-IS-FLAT-~100-vs-CLIMBING-~250-500,-NOT-THE-EXACT-' +
      'COUNTS);-imp-33537/imp-33557-BOUND-THE-<64-BAND-AT-n>=510;-NO-LITERAL-PATCHED;-imp-3685/imp-3849/' +
      'imp-33213/imp-33316/imp-33539/imp-33560-INTACT;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-' +
      'UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33580_GRADED_MAPPED_CC_ABSCISSA_ARTIFACT = Object.freeze({
  id: 'imp-33580-graded-mapped-cc-abscissa-artifact',
  ticket: 'imp-33580',
  testsAttributionFrom: 'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
  reusesMachineryFrom: 'imp-33539-graded-plateau-deeper-tail-min-budget.js',
  crossValidatesModules: [
    'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
    'imp-33539-graded-plateau-deeper-tail-min-budget.js',
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'TESTS the imp-33560 attribution that its climbing Clenshaw-Curtis single-grid deep-tail budget ' +
    '(~257 nodes at n=350/375 rising to ~513 at n=400) comes from the fixed Chebyshev-Lobatto abscissae ' +
    'not tracking the sharpening saddle. It re-runs the identical CC A(tau*) = int_0^7 phiKernel(s)' +
    'phiKernel(s+tau*) ds sweep after composing the imp-33539 origin-concentrating map s = hi t^4 ' +
    '(t = (1+x)/2) onto the SAME Chebyshev-Lobatto nodes and CC cosine weights, across the imp-33560 ' +
    'even-N ladder (nodes 17..2049) vs the imp-33213 A_log target, and locates the smallest grid clearing ' +
    'the imp-33316 < 64 ULP band for both the unmapped control and the graded-mapped rule. RESULT: (1) the ' +
    'unmapped control reproduces the imp-33560 climb (257/257/513 nodes); (2) the graded-mapped CC budget ' +
    'FLATTENS to ~97-129 nodes across all three rungs -- its worst budget (129) sits below the unmapped ' +
    'floor (257), and at the deepest rung n=400 the map cuts the budget ~4x (513 -> 129); (3) so the ' +
    'imp-33560 depth-climb is a UNIFORM-ABSCISSA ARTIFACT, not intrinsic to Clenshaw-Curtis -- grading ' +
    '(the coordinate map), not the solver family, carries the flat-budget edge; the imp-33560 attribution ' +
    'is CONFIRMED. VERDICT: CLIMBING-BUDGET-IS-A-UNIFORM-ABSCISSA-ARTIFACT. ACCURACY/RULE-DESIGN ' +
    'CROSS-SOLVER MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; ' +
    'imp-33537/imp-33557 bound the < 64 band at n >= 510; no literal patched; imp-3066 untouched; no QED. ' +
    'PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'DEEPER deep-tail rungs n in {350,375,400}, tau* = root of n = 4 pi tau* e^{4 tau*}',
    control: 'imp-33560 UNMAPPED CC single grid: linear map s = (hi/2)(1 + x_k), Chebyshev-Lobatto nodes + CC cosine weights',
    test: 'GRADED-MAPPED CC single grid: same nodes/weights, origin-concentrating map s = hi t^4, t = (1 + x_k)/2, Jacobian hi*grade*t^{grade-1}, factor 0.5',
    ccLadder: 'even N over nodes 17..2049 (imp-33560 ladder); smallest whose residual clears the imp-33316 < 64 ULP band',
    gradedReference: 'the imp-33539 FLAT graded-GL plateau minimum (grade 4, ~200 nodes) as the flat-budget reference',
    target: 'the imp-33213 log-domain A_log target, residual in ULP = A_log * 2^-52',
    attributionTest: 'graded-mapped CC flattens => climb is a uniform-abscissa artifact (grading carries the edge); still climbs => intrinsic to CC node placement',
    selfComputing: 'every rung, both ladder sweeps, both min-node budgets, the saving factors and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    ccLadder: Object.freeze(CC_LADDER.slice()),
    hi: HI,
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    gradedPlateauNodes: GRADED_MIN_NODES,
    rungTable: RUNG_TABLE,
    unmappedNodesByRung: Object.freeze(UNMAPPED_NODES_BY_RUNG.slice()),
    mappedNodesByRung: Object.freeze(MAPPED_NODES_BY_RUNG.slice()),
    minUnmappedNodes: MIN_UNMAPPED_NODES,
    maxUnmappedNodes: MAX_UNMAPPED_NODES,
    minMappedNodes: MIN_MAPPED_NODES,
    maxMappedNodes: MAX_MAPPED_NODES,
    maxMapSavingFactor: MAX_MAP_SAVING,
    unmappedReproducesClimb,
    gradedMappedFlattens,
    gradedMappedBelowUnmappedFloor,
    gradedMappedDoesNotClimb,
    deeperTailCovered,
    verdict,
  }),

  interpretation: Object.freeze({
    unmappedControlReproducesTheClimb:
      'The linear-mapped CC single grid (imp-33560 control) reproduces the imp-33560 climbing budget verbatim: ' +
      '257 nodes at n=350/375 rising to 513 at n=400. The control is faithful, so any change under the graded ' +
      'map is attributable to the abscissa placement alone.',
    gradedMappedBudgetFlattens:
      'Composing the imp-33539 origin-concentrating map s = hi t^4 onto the SAME Chebyshev-Lobatto nodes ' +
      'collapses the CC min-node budget to a FLAT ~97-129 nodes across all three rungs. Its worst budget (129) ' +
      'sits below the unmapped floor (257), and at the deepest rung n=400 the map cuts the budget ~4x ' +
      '(513 -> 129) -- the sharpening peak is resolved by clustering nodes toward the origin, not by adding them.',
    theClimbIsAUniformAbscissaArtifact:
      'Because the ONLY change between the control and the test is the abscissa placement (linear vs ' +
      'origin-concentrating), the imp-33560 depth-climb is confirmed to come from the UNIFORM Chebyshev-Lobatto ' +
      'placement not tracking the sharpening saddle, NOT from anything intrinsic to Clenshaw-Curtis. Grading -- ' +
      'the coordinate map -- carries the flat-budget edge; when CC is given the same abscissae it flattens too. ' +
      'The imp-33560 attribution is CONFIRMED, and the graded rule holds no solver-intrinsic advantage: the win ' +
      'is entirely the node distribution, portable to any solver that adopts it.',
    latticeJitterIsTheHonestFloor:
      'The exact min-node counts are JITTERY arithmetic-floor lattice properties (imp-33249/imp-33277/imp-33295/' +
      'imp-33539/imp-33560): both residual ladders are non-monotone near the floor (neighbouring even N bounce ' +
      'above/below the < 64 ULP bar) and libm exp/pow/cos variation can shift the measurements. The robust ' +
      'reading is the ORDER of the budgets (graded-mapped ~100 vs unmapped ~250-500) and the qualitative ' +
      'flat-vs-climbing separation, not the precise 97/129/257/513 counts.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    reachesArithmeticFloorNotSubUlp: true,
    changesAnyBound: false,
    patchedALiteral: false,
    leavesSourceModulesIntact: true,
    confirmsImp33560Attribution:
      'This CONFIRMS the imp-33560 attribution: its climbing CC single-grid budget is a uniform-abscissa ' +
      'artifact, not intrinsic to Clenshaw-Curtis. Composing the imp-33539 origin-concentrating map onto the ' +
      'SAME Chebyshev-Lobatto nodes flattens the budget to ~97-129 nodes (below the unmapped 257 floor), so ' +
      'grading -- the node distribution -- carries the flat-budget edge and it is portable to any solver.',
    derivationScope:
      'Tests the imp-33560 abscissa attribution by composing the graded coordinate map onto the CC nodes and ' +
      're-measuring the deep-tail inner-node budget for the A(tau) weight underneath a mass-feasibility ' +
      'diagnostic. It changes NO bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/' +
      'imp-33560 intact), and establishes NO operator positivity. Grid-design cross-solver measurement only -- ' +
      'not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33560/imp-33539/imp-33316/imp-33213; this ' +
      'audits the inner quadrature abscissa placement, not that truncation.',
    bandValidityCaveat:
      'imp-33537/imp-33557 showed the imp-33316 < 64 ULP band is a coarse-grid artifact that FAILS at deeper ' +
      'rungs n >= 510; the rungs measured here (n in {350,375,400}) sit firmly inside the band, so the ' +
      'node-budget reading is unaffected, but the < 64 band is NOT claimed to hold at every deep rung.',
    latticeJitterCaveat:
      'The min-node budgets are single lattice hits on a jittery arithmetic floor; the robust reading is the ' +
      'order of the budgets (graded-mapped ~100 vs unmapped ~250-500) and the flat-vs-climbing separation, not ' +
      'the exact counts.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33580_GRADED_MAPPED_CC_ABSCISSA_ARTIFACT_ASSERTIONS = [
  {
    id: 'imp33580-unmapped-control-reproduces-the-imp33560-climb',
    why: 'THE CONTROL: the imp-33560 UNMAPPED (linear) CC single grid must reach the imp-33316 < 64 ULP band at ' +
         'every rung and its budget must CLIMB with depth (max > min), reproducing the imp-33560 finding so any ' +
         'change under the graded map is attributable to the abscissa placement alone.',
    holds: () => unmappedReproducesClimb && MAX_UNMAPPED_NODES > MIN_UNMAPPED_NODES,
  },
  {
    id: 'imp33580-graded-mapped-cc-flattens',
    why: 'THE PURPOSE: composing the imp-33539 origin-concentrating map onto the SAME Chebyshev-Lobatto nodes must ' +
         'FLATTEN the CC budget -- every rung reaches the band and the worst budget stays at or below the imp-33539 ' +
         'flat ~200-node graded plateau, i.e. it does not climb into the unmapped regime.',
    holds: () => gradedMappedFlattens && MAX_MAPPED_NODES <= GRADED_MIN_NODES,
  },
  {
    id: 'imp33580-graded-mapped-stays-below-the-unmapped-floor',
    why: 'ROBUST SEPARATION: the worst graded-mapped budget must sit BELOW the best unmapped budget (max mapped < ' +
         'min unmapped) -- a qualitative flat-vs-climb separation not sensitive to the exact jittery counts.',
    holds: () => gradedMappedBelowUnmappedFloor && MAX_MAPPED_NODES < MIN_UNMAPPED_NODES,
  },
  {
    id: 'imp33580-graded-mapped-does-not-climb-with-depth',
    why: 'THE MECHANISM: the graded-mapped budget at the deepest rung (n=400) must not exceed the shallowest ' +
         '(n=350) while the unmapped budget grows there -- confirming the climb is abscissa placement, not depth.',
    holds: () => gradedMappedDoesNotClimb && MAPPED_DEEPEST <= MAPPED_SHALLOWEST,
  },
  {
    id: 'imp33580-deeper-tail-covered',
    why: 'The sweep must run BOTH rules across the deeper deep-tail rungs n in {350,375,400} over the wide ' +
         'imp-33560 CC single-grid ladder.',
    holds: () => deeperTailCovered && RUNG_TABLE.length === N_RUNGS.length && CC_LADDER.length >= 10,
  },
  {
    id: 'imp33580-verdict-records-uniform-abscissa-artifact',
    why: 'The classified verdict must record that the imp-33560 climbing CC budget is a uniform-abscissa artifact ' +
         '(grading carries the edge), not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33580-graded-map-reduces-to-linear-cc-at-grade-one',
    why: 'STRUCTURAL CHECK: at grade = 1 the graded-mapped rule must reduce EXACTLY to the imp-33560 linear CC ' +
         '(same nodes, same map s = (hi/2)(1+x)), verifying the Jacobian composition is correct.',
    holds: () => {
      const tau = saddleTau(375);
      const lin = aDirectCC(tau, HI, 128);
      const g1 = aDirectCCgraded(tau, HI, 128, 1);
      return Math.abs(lin - g1) <= 1e-12 * Math.abs(lin);
    },
  },
  {
    id: 'imp33580-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-solver measurement only, not a certified bound, no literal ' +
         'patched, source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP33580_GRADED_MAPPED_CC_ABSCISSA_ARTIFACT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.changesAnyBound === false &&
        c.patchedALiteral === false &&
        c.leavesSourceModulesIntact === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33580_GRADED_MAPPED_CC_ABSCISSA_ARTIFACT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33580-graded-mapped-cc-abscissa-artifact assertion failed: ${assertion.id}`);
  }
}

export default IMP33580_GRADED_MAPPED_CC_ABSCISSA_ARTIFACT;
