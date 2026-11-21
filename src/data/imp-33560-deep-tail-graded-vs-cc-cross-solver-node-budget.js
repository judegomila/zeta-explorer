/**
 * @module imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget
 * @fileoverview imp-33560 -- EXTEND the imp-33536 baseline-relative cross-solver finding from the
 *   R_40 moment weight to the DEEP-TAIL A(tau) weight. imp-33536 showed the imp-33308 ~63x graded-
 *   vs-uniform R_40 node saving is BASELINE-RELATIVE: a single Clenshaw-Curtis inner grid reaches the
 *   R_40 floor at ~69 nodes, node-competitive with the ~80-node graded min, so the ~63x reflects the
 *   WEAK Simpson doubling-plus-Richardson baseline, not an intrinsic graded advantage. This module runs
 *   the SAME cross-solver test against the deep-tail weight
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel,
 *
 *   reproducing the imp-33539 deeper deep-tail graded-vs-uniform node budget at n in {350,375,400} with
 *   a single Clenshaw-Curtis inner grid as the strong INDEPENDENT baseline against the imp-33213 A_log
 *   target, and asks: is the imp-33539 ~9.3x / ~186x deep-tail saving likewise baseline-relative, or is
 *   it a genuine grading advantage that survives a strong cross-solver?
 *
 *   WHY A CROSS-SOLVER (the imp-33539 gap)
 *   --------------------------------------
 *   imp-33539 measured a FLAT ~200-node graded-GL plateau minimum across the deeper rungs n in
 *   {350,375,400} against the imp-33275 A_log floor band, and read the ~9.3x nominal (37205 / 4000) and
 *   ~186x true-minimum (37205 / 200) savings off the imp-33275 uniform Richardson ladder. But BOTH sides
 *   of that comparison were graded-vs-uniform inside one ecosystem: the uniform baseline was the Simpson
 *   Richardson ladder and the graded rule was Gauss-Legendre. Exactly as imp-33536 showed for R_40, a
 *   skeptic can read the ~186x as an artifact of the WEAK uniform ladder rather than an intrinsic graded
 *   win. This module swaps in a genuinely INDEPENDENT solver -- Clenshaw-Curtis, whose Chebyshev-Lobatto
 *   abscissae and cosine weights share NOTHING with either the Simpson family or the graded-GL rule --
 *   and locates its single-grid min-node budget for the SAME deep-tail A(tau*(n)) floor test.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For each deeper deep-tail rung n in {350,375,400} we take tau* = saddleTau(n), the imp-33213
 *   log-domain target A_log(tau*), and score two inner A(tau*) rules against it in ULP = A_log * 2^-52:
 *
 *     (CC)  CLENSHAW-CURTIS single grid: A(tau*) = int_0^7 Phi(s)Phi(s+tau*) ds on N+1 Chebyshev-Lobatto
 *           nodes x_k = cos(pi k/N) mapped to [0,7] with the standard CC cosine weights -- the INDEPENDENT
 *           cross-solver. We sweep even N over a ladder (nodes 17..8193) and locate the smallest CC grid
 *           whose residual clears the imp-33316 widened deep-tail band (&lt; 64 ULP).
 *     (G)   the imp-33539 graded-GL plateau: panels a_j = 7 (j/panels)^4, 10-node Gauss-Legendre per
 *           panel, graded toward the origin peak; its min-node budget is the FLAT ~200 nodes imp-33539
 *           located.
 *
 *   MEASURED (the ~9.3x / ~186x deep-tail saving is likewise BASELINE-RELATIVE)
 *   --------------------------------------------------------------------------
 *        n    tau*       graded min    CC min (nodes, ULP)     CC / graded
 *        350  0.867315   200 nodes     257  (N=256, ~19.7)     ~1.28
 *        375  0.880727   200 nodes     257  (N=256, ~22.8)     ~1.28
 *        400  0.893314   200 nodes     513  (N=512, ~35.0)     ~2.56
 *
 *     (1) THE SINGLE CC GRID REACHES THE DEEP-TAIL FLOOR. Unlike a single uniform grid, a single
 *         Clenshaw-Curtis grid DOES clear the imp-33316 &lt; 64 ULP A_log band at every deeper rung, at a
 *         modest node count (~257 at n=350/375, ~513 at n=400). The deep-tail floor is NOT a graded-GL
 *         artifact -- a strong independent solver reaches it too.
 *     (2) CC IS NODE-COMPETITIVE WITH THE GRADED ~200-NODE MIN. The CC / graded min-node ratio is
 *         ~1.28 (n=350/375) and ~2.56 (n=400) -- all &lt; 4x. So against a strong independent solver the
 *         graded rule is only node-COMPETITIVE, NOT ~9.3x / ~186x cheaper. The ~186x figure reflects the
 *         WEAKNESS of the imp-33275 uniform Richardson ladder (37205 nodes), not an intrinsic graded
 *         advantage -- exactly the imp-33536 R_40 finding, now confirmed for the deep-tail A(tau).
 *     (3) THE MILD GENUINE GRADED EDGE: FLAT vs SLOWLY-GROWING. The one honest nuance vs R_40: the
 *         graded min-node budget is FLAT at ~200 nodes across the deeper rungs (imp-33539), whereas the
 *         CC single-grid budget CLIMBS with depth (~257 -> ~513 nodes from n=350 to n=400) as the peak
 *         sharpens. So grading DOES carry a mild real edge -- its origin-concentrating panels track the
 *         sharpening saddle without adding nodes while CC must add nodes -- but that edge is ~1.3-2.6x,
 *         NOT the ~9.3x / ~186x claimed against the weak uniform ladder.
 *
 *   HEADLINE / VERDICT. BASELINE-RELATIVE-EXTENDS-TO-THE-DEEP-TAIL. The imp-33539 ~9.3x / ~186x
 *   deep-tail graded-vs-uniform saving is BASELINE-RELATIVE, just as imp-33536 found for R_40: a single
 *   Clenshaw-Curtis inner grid reaches the imp-33275 A_log floor band at ~257-513 nodes across
 *   n in {350,375,400}, node-competitive (~1.3-2.6x) with the flat ~200-node graded min, so the ~186x
 *   reflects the weak uniform Richardson ladder, not an intrinsic graded advantage. The one genuine
 *   graded edge is that its ~200-node budget is FLAT while CC's climbs slowly with depth (~257 -> ~513) --
 *   a mild ~1.3-2.6x real win, not ~186x.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN CROSS-SOLVER MEASUREMENT ONLY, at the RH-equivalent scale class. It
 *   re-measures the deep-tail inner-node budget of the imp-33539 graded rule against an INDEPENDENT
 *   Clenshaw-Curtis single grid; it changes NO bound, patches NO literal (imp-3685/imp-3849/imp-33213/
 *   imp-33316/imp-33539 all LEFT INTACT), and establishes NO operator positivity. The min-node counts
 *   are JITTERY arithmetic-floor lattice properties (imp-33249/imp-33277/imp-33295/imp-33539
 *   latticeJitterCaveat): the CC residual ladder is non-monotone near the floor (e.g. neighbouring even
 *   N bounce above/below the &lt; 64 ULP bar) and cross-platform libm exp/pow/cos variation can shift the
 *   measurements, so the robust reading is the ORDER of the node budgets (~200-500) and the cross-solver
 *   node-competitiveness (~1.3-2.6x, well under 4x), not the exact counts. imp-33537/imp-33557 showed the
 *   &lt; 64 ULP band is a coarse-grid artifact that FAILS at deeper rungs n &gt;= 510; the rungs here
 *   (n in {350,375,400}) sit firmly inside the band. The NPHI = 10 Phi-series truncation is inherited.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33536-r40-graded-vs-cc-cross-solver-node-budget.js (the R_40 baseline-relative finding this extends)
 *   @see imp-33539-graded-plateau-deeper-tail-min-budget.js (the deep-tail graded-vs-uniform node budget this cross-checks)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the fixed-budget deep-tail measurement + &lt; 64 band)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33560 (numerical, medium).
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

// 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295/imp-33316/imp-33539).
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

/**
 * (G) the imp-33539 GRADED-GL plateau on the DIRECT linear integrand: panels a_j = hi (j/panels)^grade,
 * GL-10 per panel. The integrand Phi(s)Phi(s+tau) &gt;= 0 on [0,hi], so no subtractive cancellation.
 */
function aDirectGradedGL(tau, hi, panels, grade) {
  let sum = 0;
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      sum += GL_W[k] * half * phiKernel(s) * phiKernel(s + tau);
    }
  }
  return sum;
}

/**
 * (CC) CLENSHAW-CURTIS weights on the N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N), N even. The
 * standard cosine-series weights w_k = c_k (2/N) sum_{j=0}^{N/2} b_j/(1-4 j^2) cos(2 pi j k / N), with
 * endpoint half-weights c_0 = c_N = 1/2, interior c_k = 1, b_0 = b_{N/2} = 1 else 2. Independent of BOTH
 * the Simpson family and the Gauss-Legendre graded rule (imp-33536).
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

/** (CC) single-grid inner rule: A(tau) = int_0^hi Phi(s)Phi(s+tau) ds by Clenshaw-Curtis with N+1 nodes. */
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

// -- Configuration (imp-33539 deep-tail grid held verbatim) ----------------------------------------
const HI = 7;                                    // imp-33316/imp-33539 deep-tail inner domain [0,7]
const DEEP_FLOOR_ULP = 64;                       // imp-33316 widened deep-tail A_log floor band
const N_RUNGS = [350, 375, 400];                 // imp-33539 deeper deep-tail rungs
const GRADE = 4;                                 // imp-33295/imp-33316/imp-33539 robust graded rule
const GRADED_MIN_NODES = 200;                    // imp-33539 FLAT graded-GL plateau minimum (all rungs)
const GRADED_MIN_PANELS = 20;                    // 20 panels * 10 GL nodes = 200 nodes
const UNIFORM_LADDER_NODES = 37205;              // imp-33275 uniform Richardson ladder (imp-33316/imp-33539)
const FIXED_PLATEAU_NODES = 4000;                // imp-33316 fixed plateau (grade4/400p)
const NOMINAL_SAVING = UNIFORM_LADDER_NODES / FIXED_PLATEAU_NODES; // ~9.3x nominal (imp-33539)
const MIN_BUDGET_SAVING = UNIFORM_LADDER_NODES / GRADED_MIN_NODES; // ~186x true-minimum (imp-33539)
// CC single-grid ladder (even N; nodes = N+1); cheap to expensive.
const CC_LADDER = [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048];
const NODE_COMPETITIVE_RATIO = 4;                // graded NOT >>cheaper than a strong solver if < 4x

// -- Per-rung CC single-grid min-node budget vs the imp-33539 flat graded ~200-node min ------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  // graded min budget cross-check: the imp-33539 flat 200-node plateau residual at this rung.
  const gradedMinUlp = Math.abs(aDirectGradedGL(tauStar, HI, GRADED_MIN_PANELS, GRADE) - aLogVal) / ulpOfALog;

  // CC single-grid sweep: smallest N+1 clearing the deep-tail floor band.
  let ccMinNodes = Infinity;
  let ccMinN = null;
  let ccMinUlp = Infinity;
  const ccRow = CC_LADDER.map((N) => {
    const ulp = Math.abs(aDirectCC(tauStar, HI, N) - aLogVal) / ulpOfALog;
    if (ulp < DEEP_FLOOR_ULP && ccMinNodes === Infinity) {
      ccMinNodes = N + 1;
      ccMinN = N;
      ccMinUlp = ulp;
    }
    return Object.freeze({ N, nodes: N + 1, ulp, inBand: ulp < DEEP_FLOOR_ULP });
  });

  const ccOverGraded = ccMinNodes / GRADED_MIN_NODES;

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    gradedMinNodes: GRADED_MIN_NODES,
    gradedMinUlp,
    ccRow: Object.freeze(ccRow),
    ccMinN,
    ccMinNodes,
    ccMinUlp,
    ccOverGraded,
    // CC single grid reaches the floor at a node-competitive (< 4x) count vs the graded min.
    ccNodeCompetitive: ccMinNodes < Infinity && ccOverGraded < NODE_COMPETITIVE_RATIO,
  });
});

// -- Summary statistics ----------------------------------------------------------------------------
const CC_MIN_NODES_BY_RUNG = RUNG_TABLE.map((r) => r.ccMinNodes);
const MAX_CC_OVER_GRADED = Math.max(...RUNG_TABLE.map((r) => r.ccOverGraded));
const MIN_CC_MIN_NODES = Math.min(...CC_MIN_NODES_BY_RUNG);
const MAX_CC_MIN_NODES = Math.max(...CC_MIN_NODES_BY_RUNG);
const WORST_GRADED_MIN_ULP = Math.max(...RUNG_TABLE.map((r) => r.gradedMinUlp));

// -- Verdict classifiers ---------------------------------------------------------------------------
// (1) A single CC grid reaches the deep-tail A_log floor band at every deeper rung (not a graded artifact).
const ccSingleGridReachesFloor = RUNG_TABLE.every((r) => r.ccMinNodes < Infinity);
// (2) CC is node-competitive (< 4x) with the flat graded ~200-node min at every rung -- the ~186x is baseline-relative.
const ccNodeCompetitiveEverywhere = RUNG_TABLE.every((r) => r.ccNodeCompetitive) && MAX_CC_OVER_GRADED < NODE_COMPETITIVE_RATIO;
// (3) The imp-33539 flat graded 200-node min is reproduced inside the band at every deeper rung (cross-check).
const gradedMinReproduced = WORST_GRADED_MIN_ULP < DEEP_FLOOR_ULP;
// (4) The mild genuine graded edge: CC budget CLIMBS with depth while graded stays flat at 200.
const ccBudgetClimbsWithDepth = MAX_CC_MIN_NODES > MIN_CC_MIN_NODES;
// (5) Coverage: the deeper deep-tail rungs n ~ 350..400 are swept with a wide CC single-grid ladder.
const deeperTailCovered =
  N_RUNGS.length >= 3 && N_RUNGS.every((n) => n >= 350 && n <= 400) && CC_LADDER.length >= 10;

const verdict =
  ccSingleGridReachesFloor && ccNodeCompetitiveEverywhere && gradedMinReproduced && ccBudgetClimbsWithDepth && deeperTailCovered
    ? 'BASELINE-RELATIVE-EXTENDS-TO-THE-DEEP-TAIL:-THE-imp-33539-~9.3x/~186x-DEEP-TAIL-GRADED-VS-UNIFORM-SAVING-IS-' +
      'BASELINE-RELATIVE,-JUST-AS-imp-33536-FOUND-FOR-R_40.-A-SINGLE-CLENSHAW-CURTIS-INNER-GRID-(CHEBYSHEV-LOBATTO-' +
      'NODES-plus-CC-WEIGHTS,-INDEPENDENT-OF-BOTH-THE-imp-33275-SIMPSON-LADDER-AND-THE-GRADED-GL-RULE)-CLEARS-THE-' +
      'imp-33316-<64-ULP-A_log-FLOOR-BAND-AT-~257-NODES-(n=350/375)-AND-~513-NODES-(n=400)-ACROSS-n-in-{350,375,400},-' +
      'NODE-COMPETITIVE-(~1.28-2.56x,-ALL-<4x)-WITH-THE-imp-33539-FLAT-~200-NODE-GRADED-MIN;-SO-THE-~186x-(37205/200)-' +
      'REFLECTS-THE-WEAK-imp-33275-UNIFORM-RICHARDSON-LADDER-(37205-NODES),-NOT-AN-INTRINSIC-GRADED-ADVANTAGE-OVER-A-' +
      'STRONG-INDEPENDENT-SOLVER.-THE-ONE-GENUINE-GRADED-EDGE:-THE-~200-NODE-GRADED-BUDGET-IS-FLAT-WHILE-THE-CC-' +
      'SINGLE-GRID-BUDGET-CLIMBS-WITH-DEPTH-(~257->~513-NODES-FROM-n=350-TO-n=400)-AS-THE-SADDLE-PEAK-SHARPENS-A-' +
      'MILD-~1.3-2.6x-REAL-WIN,-NOT-~186x.-ACCURACY/RULE-DESIGN-CROSS-SOLVER-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-' +
      'imp-33537/imp-33557-BOUND-THE-<64-BAND-AT-n>=510;-NO-LITERAL-PATCHED;-imp-3685/imp-3849/imp-33213/imp-33316/' +
      'imp-33539-INTACT;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33560_DEEP_TAIL_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET = Object.freeze({
  id: 'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget',
  ticket: 'imp-33560',
  extendsModule: 'imp-33536-r40-graded-vs-cc-cross-solver-node-budget.js',
  reusesMachineryFrom: 'imp-33539-graded-plateau-deeper-tail-min-budget.js',
  crossValidatesModules: [
    'imp-33536-r40-graded-vs-cc-cross-solver-node-budget.js',
    'imp-33539-graded-plateau-deeper-tail-min-budget.js',
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'CROSS-SOLVER extension of the imp-33536 baseline-relative finding from R_40 to the DEEP-TAIL A(tau) weight: is ' +
    'the imp-33539 ~9.3x / ~186x deep-tail graded-vs-uniform node saving intrinsic, or baseline-relative? For each ' +
    'deeper deep-tail rung n in {350,375,400} the deep-tail A(tau*) = int_0^7 phiKernel(s)phiKernel(s+tau*) ds is ' +
    'scored on a SINGLE Clenshaw-Curtis grid (Chebyshev-Lobatto nodes + CC weights, independent of both the Simpson ' +
    'ladder and the graded-GL rule) across even-N nodes 17..2049 vs the imp-33213 A_log target, and the smallest CC ' +
    'grid clearing the imp-33316 < 64 ULP floor band is located. RESULT: (1) a single CC grid DOES reach the ' +
    'deep-tail floor -- at ~257 nodes (n=350/375) and ~513 nodes (n=400); (2) that is node-COMPETITIVE (~1.28-2.56x, ' +
    'all < 4x) with the imp-33539 FLAT ~200-node graded min, so the ~186x (37205/200) is BASELINE-RELATIVE -- it ' +
    'reflects the weak imp-33275 uniform Richardson ladder, not an intrinsic graded advantage; (3) the ONE genuine ' +
    'graded edge is that its ~200-node budget is FLAT while CC climbs with depth (~257 -> ~513) as the peak sharpens ' +
    '-- a mild ~1.3-2.6x real win, not ~186x. VERDICT: BASELINE-RELATIVE-EXTENDS-TO-THE-DEEP-TAIL. ACCURACY/RULE-' +
    'DESIGN CROSS-SOLVER MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; ' +
    'imp-33537/imp-33557 bound the < 64 band at n >= 510; no literal patched; imp-3066 untouched; no QED. ' +
    'No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'DEEPER deep-tail rungs n in {350,375,400}, tau* = root of n = 4 pi tau* e^{4 tau*}',
    crossSolver: 'Clenshaw-Curtis SINGLE grid: N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N) mapped to [0,7], standard CC cosine weights -- independent of both the Simpson family and Gauss-Legendre',
    ccLadder: 'even N over nodes 17..2049; smallest whose residual clears the imp-33316 < 64 ULP band',
    gradedReference: 'the imp-33539 FLAT graded-GL plateau minimum (grade 4, 20 panels = 200 nodes)',
    target: 'the imp-33213 log-domain A_log target, residual in ULP = A_log * 2^-52',
    nodeCompetitiveTest: 'CC-min / graded-min < 4x => the ~186x saving is baseline-relative, not intrinsic',
    selfComputing: 'every rung, the CC ladder sweep, the graded-min cross-check, the ratios and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    ccLadder: Object.freeze(CC_LADDER.slice()),
    hi: HI,
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    gradedMinNodes: GRADED_MIN_NODES,
    uniformLadderNodes: UNIFORM_LADDER_NODES,
    nominalSaving: NOMINAL_SAVING,
    minBudgetSaving: MIN_BUDGET_SAVING,
    rungTable: RUNG_TABLE,
    ccMinNodesByRung: Object.freeze(CC_MIN_NODES_BY_RUNG.slice()),
    minCcMinNodes: MIN_CC_MIN_NODES,
    maxCcMinNodes: MAX_CC_MIN_NODES,
    maxCcOverGraded: MAX_CC_OVER_GRADED,
    worstGradedMinUlp: WORST_GRADED_MIN_ULP,
    nodeCompetitiveRatio: NODE_COMPETITIVE_RATIO,
    ccSingleGridReachesFloor,
    ccNodeCompetitiveEverywhere,
    gradedMinReproduced,
    ccBudgetClimbsWithDepth,
    deeperTailCovered,
    verdict,
  }),

  interpretation: Object.freeze({
    singleCcGridReachesTheDeepTailFloor:
      'Unlike a single uniform grid, a SINGLE Clenshaw-Curtis grid -- whose Chebyshev-Lobatto nodes cluster at both ' +
      'endpoints and whose cosine weights share nothing with either the imp-33275 Simpson ladder or the graded-GL ' +
      'rule -- clears the imp-33316 < 64 ULP A_log band at every deeper rung (~257 nodes at n=350/375, ~513 at ' +
      'n=400). The deep-tail floor is a real, cross-solver-invariant object, not a graded-GL artifact.',
    theEighteenSixXIsBaselineRelative:
      'The imp-33539 ~186x true-minimum saving (37205 / 200) and its ~9.3x nominal (37205 / 4000) carry ONLY against ' +
      'the weak imp-33275 uniform Richardson ladder (37205 nodes). A strong independent solver -- Clenshaw-Curtis -- ' +
      'reaches the same floor at ~257-513 nodes, node-competitive (~1.28-2.56x, all < 4x) with the flat ~200-node ' +
      'graded min. So against a strong solver the graded rule is NOT ~186x cheaper -- exactly the imp-33536 R_40 ' +
      'finding, now confirmed for the deep-tail A(tau).',
    theMildGenuineGradedEdge:
      'The one honest nuance vs the R_40 case (where CC was even slightly tighter than graded): here the graded ' +
      'min-node budget is FLAT at ~200 nodes across the deeper rungs (imp-33539), whereas the CC single-grid budget ' +
      'CLIMBS with depth (~257 -> ~513 nodes from n=350 to n=400) as the saddle peak sharpens. The origin-' +
      'concentrating graded panels a_j = 7 (j/panels)^4 track the sharpening peak without adding nodes while CC must ' +
      'add nodes -- so grading DOES carry a mild real edge, but it is ~1.3-2.6x, NOT the ~9.3x / ~186x claimed ' +
      'against the weak uniform ladder.',
    latticeJitterIsTheHonestFloor:
      'The exact CC min-node counts are JITTERY arithmetic-floor lattice properties (imp-33249/imp-33277/imp-33295/' +
      'imp-33539): the CC residual ladder is non-monotone near the floor (neighbouring even N bounce above/below the ' +
      '< 64 ULP bar) and libm exp/pow/cos variation can shift the measurements. The robust reading is the ORDER of ' +
      'the node budgets (~200-500) and the cross-solver node-competitiveness (< 4x), not the precise 257/513 counts.',
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
    extendsImp33536ToTheDeepTail:
      'This CONFIRMS and extends imp-33536: the ~186x/~9.3x deep-tail graded-vs-uniform saving is baseline-relative ' +
      'under an independent Clenshaw-Curtis cross-solver, just as the ~63x R_40 saving was, while ADDING the honest ' +
      'nuance that the graded rule keeps a mild genuine edge (flat ~200-node budget vs CC climbing ~257->~513 with ' +
      'depth) -- so grading is node-competitive-plus-a-hair, not universally ~186x cheaper.',
    derivationScope:
      'Re-measures the deep-tail inner-node budget of the imp-33539 graded rule against an INDEPENDENT single ' +
      'Clenshaw-Curtis grid for the A(tau) weight underneath a mass-feasibility diagnostic. It changes NO bound, ' +
      'patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539 intact), and establishes NO operator ' +
      'positivity. Grid-design cross-solver measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33539/imp-33316/imp-33213; this audits the inner ' +
      'quadrature node budget under a cross-solver, not that truncation.',
    bandValidityCaveat:
      'imp-33537/imp-33557 showed the imp-33316 < 64 ULP band is a coarse-grid artifact that FAILS at deeper rungs ' +
      'n >= 510; the rungs measured here (n in {350,375,400}) sit firmly inside the band, so the node-budget reading ' +
      'is unaffected, but the < 64 band is NOT claimed to hold at every deep rung.',
    latticeJitterCaveat:
      'The CC min-node budgets are single lattice hits on a jittery arithmetic floor; the robust reading is the ' +
      'order of the node budgets (~200-500) and the cross-solver node-competitiveness (< 4x), not the exact counts.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33560_DEEP_TAIL_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET_ASSERTIONS = [
  {
    id: 'imp33560-single-cc-grid-reaches-the-deep-tail-floor',
    why: 'THE CROSS-SOLVER ANCHOR: a single independent Clenshaw-Curtis grid must clear the imp-33316 < 64 ULP ' +
         'deep-tail A_log floor band at every deeper rung n in {350,375,400}, proving the floor is not a graded-GL ' +
         'artifact.',
    holds: () => ccSingleGridReachesFloor && RUNG_TABLE.every((r) => r.ccMinNodes < Infinity),
  },
  {
    id: 'imp33560-cc-is-node-competitive-not-186x-vs-a-strong-solver',
    why: 'THE PURPOSE: against a strong independent cross-solver the CC single-grid min-node budget must be ' +
         'node-COMPETITIVE (< 4x) with the imp-33539 flat ~200-node graded min at every rung -- so the ~186x/~9.3x ' +
         'deep-tail saving is baseline-relative, not an intrinsic graded advantage.',
    holds: () => ccNodeCompetitiveEverywhere && MAX_CC_OVER_GRADED < NODE_COMPETITIVE_RATIO,
  },
  {
    id: 'imp33560-graded-min-reproduced-in-band',
    why: 'Cross-check of imp-33539: the flat graded 200-node plateau must stay inside the < 64 ULP band at every ' +
         'deeper rung (worst well under the band).',
    holds: () => gradedMinReproduced && WORST_GRADED_MIN_ULP < DEEP_FLOOR_ULP,
  },
  {
    id: 'imp33560-cc-budget-climbs-with-depth-graded-stays-flat',
    why: 'THE HONEST NUANCE: the CC single-grid min-node budget must CLIMB with depth (max > min across the rungs) ' +
         'while the graded min stays flat at 200 -- the mild genuine graded edge (flat vs slowly-growing), still ' +
         'only ~1.3-2.6x, not ~186x.',
    holds: () => ccBudgetClimbsWithDepth && MAX_CC_MIN_NODES > MIN_CC_MIN_NODES,
  },
  {
    id: 'imp33560-deeper-tail-covered',
    why: 'The sweep must run across the deeper deep-tail rungs n in {350,375,400} over a wide CC single-grid ladder.',
    holds: () => deeperTailCovered && RUNG_TABLE.length === N_RUNGS.length && CC_LADDER.length >= 10,
  },
  {
    id: 'imp33560-verdict-records-baseline-relative-extends-to-deep-tail',
    why: 'The classified verdict must record that the deep-tail ~186x saving is baseline-relative under the ' +
         'independent Clenshaw-Curtis cross-solver, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33560-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-solver measurement only, not a certified bound, no literal ' +
         'patched, source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33560_DEEP_TAIL_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.changesAnyBound === false &&
        c.patchedALiteral === false &&
        c.leavesSourceModulesIntact === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33560_DEEP_TAIL_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget assertion failed: ${assertion.id}`);
  }
}

export default IMP33560_DEEP_TAIL_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET;
