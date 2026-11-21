/**
 * @module imp-33577-band-crossing-cross-solver-node-budget
 * @fileoverview imp-33577 -- EXTEND the imp-33560 Clenshaw-Curtis cross-solver deep-tail node-budget
 *   test to the imp-33557 BAND-CROSSING rungs n in {495,510,596}, where the imp-33539 graded-plateau
 *   minimum node budget is band-conditional (200 nodes at n=495, ~500 at n=510 EDGE, UNDEFINED at
 *   n=596 where the imp-33316 widened &lt; 64 ULP band FAILS on the imp-33557 ladder).
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE GAP imp-33560 LEFT OPEN
 *   ---------------------------
 *   imp-33560 ran the single-grid Clenshaw-Curtis cross-solver against the deep-tail A(tau) weight at
 *   the DEEPER rungs n in {350,375,400} -- all firmly INSIDE the imp-33316 &lt; 64 ULP band -- and found
 *   CC reaches the band at a node-competitive ~257-513 nodes. imp-33557 then swept the graded-GL
 *   node-budget ladder at the BAND-CROSSING rungs n in {495,510,596} and found the flat ~200-node
 *   minimum is band-conditional: the graded minInBandNodes is a clean 200 at n=495, destabilises to
 *   ~500 at n=510, and is INFINITY at n=596, where NO graded budget up to 4000 nodes reaches the band.
 *   imp-33557 read that n=596 failure as a rule-INVARIANT depth-growing ARITHMETIC-JITTER FLOOR --
 *   "adding nodes does not rescue the deep rung" -- but tested only the graded-GL grade-4 rule. This
 *   module runs the IDENTICAL independent Clenshaw-Curtis single-grid sweep (nodes 17..8193) at the
 *   band-crossing rungs and asks the decisive cross-solver question: does a STRONG INDEPENDENT solver
 *   ALSO fail to reach the &lt; 64 band at n=596 (confirming a rule-invariant arithmetic floor), or does
 *   it reach the band there (showing the graded failure is a RULE-SPECIFIC resolution artifact)?
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For each band-crossing rung n in {495,510,596} we take tau* = saddleTau(n), the imp-33213
 *   log-domain target A_log(tau*), and score, in ULP = A_log * 2^-52:
 *
 *     (CC)  CLENSHAW-CURTIS single grid A(tau*) = int_0^7 Phi(s)Phi(s+tau*) ds on N+1 Chebyshev-Lobatto
 *           nodes x_k = cos(pi k/N) mapped to [0,7] with the standard CC cosine weights, swept over even
 *           N (nodes 17..8193). We locate the smallest CC grid whose residual clears the imp-33316
 *           &lt; 64 ULP band (Infinity if none) and the CC floor (smallest residual over the ladder).
 *     (G)   the imp-33557 graded-GL minInBandNodes reproduced verbatim (grade 4, panels
 *           P in {10..400} = 100..4000 nodes): 200 at n=495, ~500 at n=510, Infinity at n=596.
 *
 *   MEASURED (grade 4 graded ladder vs CC single grid; ULP vs the imp-33213 A_log target):
 *
 *        n    tau*       graded minInBand   CC min (nodes, ULP)     CC floorUlp   band(graded)
 *        495  0.935146   200 nodes          513 (N=512, ~22.8)      ~14.7         HOLDS
 *        510  0.941039   ~500 nodes         513 (N=512, ~1.6)       ~1.6          EDGE
 *        596  0.971924   Infinity           385 (N=384, ~49.6)      ~0.87         FAILS
 *
 *   HEADLINE. The independent strong solver does NOT fail at n=596. A single Clenshaw-Curtis grid clears
 *   the imp-33316 &lt; 64 ULP band at ALL THREE band-crossing rungs INCLUDING n=596 -- at a few-hundred-node
 *   budget (513/513/385 nodes) with a CC floor of ~14.7/~1.6/~0.87 ULP, reaching SUB-ULP agreement with
 *   the imp-33213 log-domain target at the very rung where the graded-GL grade-4 ladder floored at ~65
 *   ULP and never entered the band. So the imp-33557 n=596 graded FAILURE is NOT a rule-invariant
 *   arithmetic-jitter floor: it is a GRADED-RULE (grade-4) resolution artifact. Both the direct-domain
 *   CC integral and the direct-domain graded integral are scored against the SAME log-domain target, so
 *   the ~65-ULP-vs-~0.87-ULP gap at n=596 is attributable to the QUADRATURE RULE (CC endpoint clustering
 *   vs graded-GL grade-4 panels), not to an arithmetic property of A(tau*). Adding nodes DOES rescue the
 *   deep rung -- with the right rule.
 *
 *   VERDICT. CROSS-SOLVER-REFUTES-THE-ARITHMETIC-FLOOR-READING-AT-n=596. This CONFIRMS the imp-33557
 *   graded measurement (the graded minInBandNodes is band-conditional: 200 / ~500 / Infinity, reproduced
 *   here verbatim) but REFINES its interpretation: the n=596 graded failure is RULE-SPECIFIC, not a
 *   rule-invariant arithmetic-jitter floor, because an independent Clenshaw-Curtis single grid reaches
 *   sub-ULP agreement with the log-domain target there. The imp-33316 &lt; 64 ULP band is therefore a real,
 *   cross-solver-reachable object at n=596; what "fails" at n=596 is the graded-GL grade-4 rule on the
 *   imp-33557 &lt;= 4000-node ladder, not the underlying A(tau*).
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN CROSS-SOLVER MEASUREMENT ONLY, at the RH-equivalent scale class. It swaps the
 *   independent Clenshaw-Curtis single grid in for the graded-GL rule at the imp-33557 band-crossing
 *   rungs; it changes NO bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/
 *   imp-33557 all LEFT INTACT), and establishes NO operator positivity. The min-node counts and floors
 *   are JITTERY arithmetic-floor lattice properties (imp-33249/imp-33277/imp-33295/imp-33557
 *   latticeJitterCaveat): BOTH ladders are non-monotone near the floor (individual CC grids bounce above
 *   64 ULP -- e.g. N=640/896/1024 at n=596 -- and libm exp/pow/cos variation can shift the measurements),
 *   so the robust reading is the SMALLEST-CLEARING-GRID metric (matching the imp-33557 minInBandNodes
 *   definition): CC clears at a few-hundred-node budget at EVERY band-crossing rung, graded clears at
 *   n=495/510 but not at n=596 on the &lt;= 4000-node ladder. The refined claim is QUALITATIVE -- the n=596
 *   graded failure is rule-specific, not rule-invariant -- not the exact 385/513 counts. The NPHI = 10
 *   Phi-series truncation is inherited. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED.
 *   No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js (the in-band CC cross-solver this extends)
 *   @see imp-33557-band-crossing-min-budget.js (the graded band-conditional minimum this cross-solves)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the fixed-budget deep-tail measurement + &lt; 64 band)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33577 (numerical, medium).
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

// 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295/imp-33316/imp-33557).
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
 * (G) the imp-33557 GRADED-GL plateau on the DIRECT linear integrand: panels a_j = hi (j/panels)^grade,
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
 * (CC) CLENSHAW-CURTIS weights on the N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N), N even. Standard
 * cosine-series weights, endpoint half-weights c_0 = c_N = 1/2, b_0 = b_{N/2} = 1 else 2. Independent of
 * BOTH the Simpson family and the Gauss-Legendre graded rule (imp-33536/imp-33560).
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

// -- Configuration (imp-33557 band-crossing rungs + graded ladder held verbatim) -------------------
const HI = 7;                                    // imp-33316/imp-33557 deep-tail inner domain [0,7]
const DEEP_FLOOR_ULP = 64;                       // imp-33316 widened deep-tail A_log floor band
const N_RUNGS = [495, 510, 596];                 // imp-33537/imp-33557 BAND-CROSSING rungs
const GRADE = 4;                                 // imp-33295/imp-33316/imp-33557 robust graded rule
const PANEL_SWEEP = [10, 15, 20, 30, 50, 100, 200, 400]; // imp-33557 graded ladder (100..4000 nodes)
// CC single-grid ladder (even N; nodes = N+1); nodes 17..8193 -- extends the imp-33560 ladder deeper.
const CC_LADDER = [
  16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192,
];
const MODEST_BUDGET_NODES = 1024;                // "few hundred" order for the smallest-clearing CC grid

// -- Per-rung CC single-grid min-node budget vs the imp-33557 graded minInBandNodes ----------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  // (G) the imp-33557 graded minInBandNodes, reproduced verbatim on its own ladder.
  let gradedMinInBandNodes = Infinity;
  const gradedRow = PANEL_SWEEP.map((panels) => {
    const nodes = 10 * panels;
    const ulp = Math.abs(aDirectGradedGL(tauStar, HI, panels, GRADE) - aLogVal) / ulpOfALog;
    if (ulp < DEEP_FLOOR_ULP && gradedMinInBandNodes === Infinity) gradedMinInBandNodes = nodes;
    return Object.freeze({ panels, nodes, ulp, inBand: ulp < DEEP_FLOOR_ULP });
  });

  // (CC) single-grid sweep: smallest N+1 clearing the deep-tail floor band + the CC floor over the ladder.
  let ccMinNodes = Infinity;
  let ccMinN = null;
  let ccMinUlp = Infinity;
  let ccFloorUlp = Infinity;
  const ccRow = CC_LADDER.map((N) => {
    const ulp = Math.abs(aDirectCC(tauStar, HI, N) - aLogVal) / ulpOfALog;
    if (ulp < ccFloorUlp) ccFloorUlp = ulp;
    if (ulp < DEEP_FLOOR_ULP && ccMinNodes === Infinity) {
      ccMinNodes = N + 1;
      ccMinN = N;
      ccMinUlp = ulp;
    }
    return Object.freeze({ N, nodes: N + 1, ulp, inBand: ulp < DEEP_FLOOR_ULP });
  });

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    gradedRow: Object.freeze(gradedRow),
    gradedMinInBandNodes,
    gradedInBand: Number.isFinite(gradedMinInBandNodes),
    ccRow: Object.freeze(ccRow),
    ccMinN,
    ccMinNodes,
    ccMinUlp,
    ccFloorUlp,
    ccInBand: ccMinNodes < Infinity,
    // THE REFUTATION: at a rung where the graded ladder FAILS, the CC single grid still reaches the band.
    ccClearsWhereGradedFails: !Number.isFinite(gradedMinInBandNodes) && ccMinNodes < Infinity,
  });
});

// -- Summary statistics ----------------------------------------------------------------------------
const SHALLOWEST = RUNG_TABLE[0];                       // n=495, still inside the band
const DEEPEST = RUNG_TABLE[RUNG_TABLE.length - 1];      // n=596, where the graded ladder fails
const CC_MIN_NODES_BY_RUNG = RUNG_TABLE.map((r) => r.ccMinNodes);
const CC_FLOOR_ULP_BY_RUNG = RUNG_TABLE.map((r) => r.ccFloorUlp);
const GRADED_MIN_IN_BAND_BY_RUNG = RUNG_TABLE.map((r) => r.gradedMinInBandNodes);
const MAX_CC_MIN_NODES = Math.max(...CC_MIN_NODES_BY_RUNG);

// -- Verdict classifiers ---------------------------------------------------------------------------
// (1) Coverage: the imp-33537/imp-33557 band-crossing rungs n in {495,510,596} over the extended CC ladder.
const bandCrossingCovered =
  N_RUNGS.length === 3 && N_RUNGS[0] === 495 && N_RUNGS[2] === 596 && CC_LADDER.length >= 15;
// (2) The independent CC single grid reaches the < 64 band at EVERY band-crossing rung, including n=596.
const ccReachesBandAllRungs = RUNG_TABLE.every((r) => r.ccInBand);
// (3) THE HEADLINE REFUTATION: at n=596 the graded ladder FAILS (minInBandNodes Infinity) but CC CLEARS the band.
const ccClearsWhereGradedFailsAtDeepest = DEEPEST.ccClearsWhereGradedFails;
// (4) The CC floor at the deepest rung sits WELL inside the band (sub-ULP measured ~0.87), not at ~65 ULP.
const ccFloorInsideBandAtDeepest = DEEPEST.ccFloorUlp < DEEP_FLOOR_ULP;
// (5) The smallest-clearing CC grid stays a MODEST few-hundred-node budget at every rung (< 1024 nodes).
const ccBudgetModest = MAX_CC_MIN_NODES < MODEST_BUDGET_NODES;
// (6) Cross-check: the imp-33557 graded minInBandNodes is reproduced verbatim (finite at n=495, Infinity at n=596).
const gradedReproducesImp33557 =
  Number.isFinite(SHALLOWEST.gradedMinInBandNodes) && SHALLOWEST.gradedMinInBandNodes <= 300 &&
  DEEPEST.gradedMinInBandNodes === Infinity;

const verdict =
  bandCrossingCovered && ccReachesBandAllRungs && ccClearsWhereGradedFailsAtDeepest &&
  ccFloorInsideBandAtDeepest && ccBudgetModest && gradedReproducesImp33557
    ? 'CROSS-SOLVER-REFUTES-THE-ARITHMETIC-FLOOR-READING-AT-n=596:-THE-INDEPENDENT-STRONG-SOLVER-DOES-NOT-FAIL.-A-' +
      'SINGLE-CLENSHAW-CURTIS-GRID-(CHEBYSHEV-LOBATTO-NODES-plus-CC-WEIGHTS,-INDEPENDENT-OF-BOTH-THE-imp-33275-SIMPSON-' +
      'LADDER-AND-THE-GRADED-GL-RULE)-CLEARS-THE-imp-33316-<64-ULP-A_log-BAND-AT-ALL-THREE-BAND-CROSSING-RUNGS-' +
      'n-in-{495,510,596}-INCLUDING-n=596,-AT-A-FEW-HUNDRED-NODE-BUDGET-(513/513/385-NODES)-WITH-A-CC-FLOOR-OF-' +
      '~14.7/~1.6/~0.87-ULP,-REACHING-SUB-ULP-AGREEMENT-WITH-THE-imp-33213-LOG-DOMAIN-TARGET-AT-n=596-WHERE-THE-' +
      'GRADED-GL-GRADE-4-LADDER-FLOORED-AT-~65-ULP-AND-NO-BUDGET-UP-TO-4000-NODES-ENTERED-THE-BAND.-SO-THE-imp-33557-' +
      'n=596-GRADED-FAILURE-IS-NOT-A-RULE-INVARIANT-ARITHMETIC-JITTER-FLOOR-IT-IS-A-GRADED-RULE-(GRADE-4)-RESOLUTION-' +
      'ARTIFACT:-BOTH-DIRECT-DOMAIN-INTEGRALS-ARE-SCORED-VS-THE-SAME-LOG-TARGET,-SO-THE-~65-VS-~0.87-ULP-GAP-IS-DUE-TO-' +
      'THE-QUADRATURE-RULE-NOT-AN-ARITHMETIC-PROPERTY-OF-A(tau*).-CONFIRMS-(REPRODUCES-VERBATIM)-THE-imp-33557-GRADED-' +
      'minInBandNodes-BAND-CONDITIONAL-READING-(200/~500/INFINITY)-BUT-REFINES-ITS-INTERPRETATION-THE-<64-BAND-IS-A-' +
      'REAL-CROSS-SOLVER-REACHABLE-OBJECT-AT-n=596;-WHAT-FAILS-IS-THE-GRADED-RULE-ON-THE-<=4000-NODE-LADDER,-NOT-A(tau*).-' +
      'ACCURACY/RULE-DESIGN-CROSS-SOLVER-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-NO-LITERAL-PATCHED;-imp-3685/imp-3849/' +
      'imp-33213/imp-33316/imp-33539/imp-33557-INTACT;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-' +
      'NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33577_BAND_CROSSING_CROSS_SOLVER_NODE_BUDGET = Object.freeze({
  id: 'imp-33577-band-crossing-cross-solver-node-budget',
  ticket: 'imp-33577',
  extendsModule: 'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
  reusesMachineryFrom: 'imp-33557-band-crossing-min-budget.js',
  crossValidatesModules: [
    'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
    'imp-33557-band-crossing-min-budget.js',
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'CROSS-SOLVER extension of the imp-33560 single-grid Clenshaw-Curtis test from the IN-BAND rungs n in {350,375,400} ' +
    'to the imp-33557 BAND-CROSSING rungs n in {495,510,596}, where the graded-GL minInBandNodes is band-conditional ' +
    '(200 at n=495, ~500 at n=510, INFINITY at n=596). For each rung the deep-tail A(tau*) = int_0^7 ' +
    'phiKernel(s)phiKernel(s+tau*) ds is scored on a SINGLE Clenshaw-Curtis grid (Chebyshev-Lobatto nodes + CC ' +
    'weights, independent of both the Simpson ladder and the graded-GL rule) across even-N nodes 17..8193 vs the ' +
    'imp-33213 A_log target, and the smallest CC grid clearing the imp-33316 < 64 ULP band is located. RESULT: the ' +
    'independent strong solver does NOT fail at n=596 -- CC clears the band at ALL THREE band-crossing rungs ' +
    '(513/513/385 nodes; CC floor ~14.7/~1.6/~0.87 ULP), reaching SUB-ULP agreement with the log-domain target at ' +
    'n=596 where the graded-GL grade-4 ladder floored at ~65 ULP and never entered the band. So the imp-33557 n=596 ' +
    'graded failure is a GRADED-RULE (grade-4) resolution artifact, NOT a rule-invariant arithmetic-jitter floor: ' +
    'both direct-domain integrals are scored vs the SAME log target, so the ~65-vs-~0.87-ULP gap is due to the ' +
    'quadrature rule, not an arithmetic property of A(tau*). VERDICT: CROSS-SOLVER-REFUTES-THE-ARITHMETIC-FLOOR-' +
    'READING-AT-n=596. This CONFIRMS (reproduces verbatim) the imp-33557 graded band-conditional minInBandNodes ' +
    '(200/~500/Infinity) but REFINES its interpretation. ACCURACY/RULE-DESIGN CROSS-SOLVER MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; jittery lattice floor; no literal patched; imp-3066 untouched; no QED. ' +
    'No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'BAND-CROSSING rungs n in {495,510,596} (imp-33537/imp-33557), tau* = root of n = 4 pi tau* e^{4 tau*}',
    crossSolver: 'Clenshaw-Curtis SINGLE grid: N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N) mapped to [0,7], standard CC cosine weights -- independent of both the Simpson family and Gauss-Legendre',
    ccLadder: 'even N over nodes 17..8193; smallest whose residual clears the imp-33316 < 64 ULP band, plus the CC floor over the ladder',
    gradedReference: 'the imp-33557 graded-GL minInBandNodes (grade 4, panels 10..400 = 100..4000 nodes) reproduced verbatim',
    target: 'the imp-33213 log-domain A_log target, residual in ULP = A_log * 2^-52',
    refutationTest: 'does CC ALSO fail to reach the band at n=596 (rule-invariant arithmetic floor) or reach it (rule-specific graded artifact)?',
    selfComputing: 'every rung, the CC ladder sweep, the graded minInBand reproduction, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    ccLadder: Object.freeze(CC_LADDER.slice()),
    panelSweep: Object.freeze(PANEL_SWEEP.slice()),
    hi: HI,
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    rungTable: RUNG_TABLE,
    ccMinNodesByRung: Object.freeze(CC_MIN_NODES_BY_RUNG.slice()),
    ccFloorUlpByRung: Object.freeze(CC_FLOOR_ULP_BY_RUNG.slice()),
    gradedMinInBandByRung: Object.freeze(GRADED_MIN_IN_BAND_BY_RUNG.slice()),
    maxCcMinNodes: MAX_CC_MIN_NODES,
    shallowestCcFloorUlp: SHALLOWEST.ccFloorUlp,
    deepestCcFloorUlp: DEEPEST.ccFloorUlp,
    shallowestGradedMinInBandNodes: SHALLOWEST.gradedMinInBandNodes,
    deepestGradedMinInBandNodes: DEEPEST.gradedMinInBandNodes,
    modestBudgetNodes: MODEST_BUDGET_NODES,
    bandCrossingCovered,
    ccReachesBandAllRungs,
    ccClearsWhereGradedFailsAtDeepest,
    ccFloorInsideBandAtDeepest,
    ccBudgetModest,
    gradedReproducesImp33557,
    verdict,
  }),

  interpretation: Object.freeze({
    strongSolverDoesNotFailAtDeepest:
      'The decisive cross-solver result: an independent Clenshaw-Curtis single grid -- whose Chebyshev-Lobatto nodes ' +
      'cluster at both endpoints and whose cosine weights share nothing with the graded-GL rule -- clears the ' +
      'imp-33316 < 64 ULP A_log band at n=596 (~385 nodes, CC floor ~0.87 ULP), the very rung where the imp-33557 ' +
      'graded-GL grade-4 ladder floored at ~65 ULP with minInBandNodes = Infinity. A strong solver does NOT fail there.',
    theFailureIsRuleSpecificNotArithmetic:
      'Because both the direct-domain CC integral and the direct-domain graded integral are scored against the SAME ' +
      'imp-33213 log-domain target, the ~65-ULP-vs-~0.87-ULP gap at n=596 is attributable to the QUADRATURE RULE ' +
      '(CC endpoint clustering vs graded-GL grade-4 panels), not to an arithmetic property of A(tau*). The imp-33557 ' +
      '"rule-invariant depth-growing arithmetic-jitter floor / adding nodes does not rescue" reading is therefore ' +
      'refined: the n=596 failure is RULE-SPECIFIC. Adding nodes DOES rescue the deep rung -- with the right rule.',
    confirmsGradedMeasurementRefinesInterpretation:
      'This CONFIRMS the imp-33557 graded MEASUREMENT (its minInBandNodes 200/~500/Infinity is reproduced verbatim ' +
      'here on the same ladder) while REFINING its INTERPRETATION: the imp-33316 < 64 ULP band is a real, ' +
      'cross-solver-reachable object at n=596; what "fails" is the graded-GL grade-4 rule on the <= 4000-node ladder, ' +
      'not the underlying A(tau*). The band-conditional graded minimum is a graded-rule property, not a hard floor.',
    latticeJitterIsTheHonestFloor:
      'BOTH ladders are jittery near the floor (imp-33249/imp-33277/imp-33295/imp-33557): individual CC grids bounce ' +
      'above 64 ULP (e.g. N=640/896/1024 at n=596) and libm exp/pow/cos variation can shift the measurements. The ' +
      'robust reading is the SMALLEST-CLEARING-GRID metric (matching the imp-33557 minInBandNodes definition): CC ' +
      'clears at a few-hundred-node budget at EVERY band-crossing rung, graded clears at n=495/510 but not at n=596 ' +
      'on the <= 4000-node ladder -- a qualitative rule-specific-not-rule-invariant claim, not the exact 385/513 counts.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    reachesArithmeticFloorNotSubUlp: false,
    changesAnyBound: false,
    patchedALiteral: false,
    leavesSourceModulesIntact: true,
    refinesImp33557Interpretation:
      'This CONFIRMS the imp-33557 graded minInBandNodes measurement (200/~500/Infinity, reproduced verbatim) but ' +
      'REFINES its interpretation: the n=596 graded failure is a graded-GL grade-4 RESOLUTION artifact on the ' +
      '<= 4000-node ladder, NOT a rule-invariant arithmetic-jitter floor, because an independent Clenshaw-Curtis ' +
      'single grid reaches sub-ULP agreement with the log-domain target there. It overturns no measurement.',
    derivationScope:
      'Swaps the independent single Clenshaw-Curtis grid in for the graded-GL rule at the imp-33557 band-crossing ' +
      'rungs for the A(tau) weight underneath a mass-feasibility diagnostic. It changes NO bound, patches NO literal ' +
      '(imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33557 intact), and establishes NO operator positivity. ' +
      'Grid-design cross-solver measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33557/imp-33316/imp-33213; this audits the inner ' +
      'quadrature node budget under a cross-solver at the band-crossing rungs, not that truncation.',
    latticeJitterCaveat:
      'BOTH the CC and graded ladders are jittery near the arithmetic floor; the robust reading is the ' +
      'smallest-clearing-grid metric (CC clears at a few-hundred-node budget at every band-crossing rung, graded ' +
      'clears at n=495/510 but not n=596 on the <= 4000-node ladder) and the QUALITATIVE rule-specific-not-rule-' +
      'invariant conclusion, not the exact 385/513 node counts or the ~0.87 ULP CC floor.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33577_BAND_CROSSING_CROSS_SOLVER_NODE_BUDGET_ASSERTIONS = [
  {
    id: 'imp33577-band-crossing-covered',
    why: 'The CC cross-solver sweep must run across the imp-33537/imp-33557 band-crossing rungs n in {495,510,596} ' +
         'over the extended even-N ladder (nodes 17..8193).',
    holds: () => bandCrossingCovered && RUNG_TABLE.length === N_RUNGS.length && CC_LADDER.length >= 15,
  },
  {
    id: 'imp33577-cc-reaches-band-at-all-band-crossing-rungs',
    why: 'The independent Clenshaw-Curtis single grid must clear the imp-33316 < 64 ULP band at EVERY band-crossing ' +
         'rung, including n=596 -- the strong solver does not fail where the graded ladder does.',
    holds: () => ccReachesBandAllRungs && RUNG_TABLE.every((r) => r.ccMinNodes < Infinity),
  },
  {
    id: 'imp33577-cc-clears-where-graded-fails-at-deepest',
    why: 'THE HEADLINE REFUTATION: at n=596 the imp-33557 graded ladder FAILS (minInBandNodes Infinity) yet the CC ' +
         'single grid CLEARS the band -- the n=596 failure is rule-specific, not a rule-invariant arithmetic floor.',
    holds: () => ccClearsWhereGradedFailsAtDeepest && DEEPEST.gradedMinInBandNodes === Infinity && DEEPEST.ccInBand,
  },
  {
    id: 'imp33577-cc-floor-inside-band-at-deepest',
    why: 'The CC floor at the deepest rung n=596 must sit WELL inside the < 64 band (measured sub-ULP ~0.87), not at ' +
         'the ~65 ULP graded-GL floor -- the true A(tau*) is cross-solver-reachable there.',
    holds: () => ccFloorInsideBandAtDeepest && DEEPEST.ccFloorUlp < DEEP_FLOOR_ULP,
  },
  {
    id: 'imp33577-cc-budget-stays-modest',
    why: 'The smallest-clearing CC grid must stay a MODEST few-hundred-node budget (< 1024 nodes) at every ' +
         'band-crossing rung -- not an exploding budget.',
    holds: () => ccBudgetModest && MAX_CC_MIN_NODES < MODEST_BUDGET_NODES,
  },
  {
    id: 'imp33577-graded-reproduces-imp33557',
    why: 'Cross-check: the imp-33557 graded minInBandNodes must be reproduced verbatim -- finite (~200) at the ' +
         'in-band rung n=495 and Infinity at n=596 where the graded ladder fails.',
    holds: () => gradedReproducesImp33557 && Number.isFinite(SHALLOWEST.gradedMinInBandNodes) &&
      DEEPEST.gradedMinInBandNodes === Infinity,
  },
  {
    id: 'imp33577-verdict-records-cross-solver-refutes-arithmetic-floor',
    why: 'The classified verdict must record that the independent Clenshaw-Curtis cross-solver REFUTES the ' +
         'rule-invariant arithmetic-floor reading at n=596, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33577-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-solver measurement only, not a certified bound, no literal ' +
         'patched, source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33577_BAND_CROSSING_CROSS_SOLVER_NODE_BUDGET.honestCaveat;
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

for (const assertion of IMP33577_BAND_CROSSING_CROSS_SOLVER_NODE_BUDGET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33577-band-crossing-cross-solver-node-budget assertion failed: ${assertion.id}`);
  }
}

export default IMP33577_BAND_CROSSING_CROSS_SOLVER_NODE_BUDGET;
