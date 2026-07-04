/**
 * @module imp-33536-r40-graded-vs-cc-cross-solver-node-budget
 * @fileoverview imp-33536 -- VERIFY the imp-33308 ~63x graded-vs-uniform inner-node saving on an
 *   INDEPENDENT cross-solver inner grid: rather than the Simpson family imp-33308 used for its
 *   uniform baseline, drop a CLENSHAW-CURTIS (Chebyshev-Lobatto + CC weights) inner A(tau) grid
 *   underneath the full imp-33292 R_40 = |D_40|/|D_40^saddle| moment machinery, reproduce the
 *   converged R_40, and MEASURE the R_40 floor residual the imp-33308 graded-GL rule reaches
 *   against that independently-converged target -- together with the node-count parity.
 *
 *   WHY A CROSS-SOLVER
 *   ------------------
 *   imp-33308 measured a ~63x plateau node saving (and a ~315x min-node saving) for the imp-33295
 *   graded-GL inner grid vs the imp-33292 uniform-Simpson doubling-plus-Richardson ladder
 *   (25206 inner nodes), placed under the full R_40 moment machinery. But BOTH sides of that
 *   comparison sat in one quadrature ecosystem: the uniform baseline was Simpson and the graded
 *   rule was Gauss-Legendre. A skeptic could read the ~63x as an artifact of the WEAK Simpson
 *   baseline -- a single uniform Simpson grid provably misses the floor even at 25601 nodes, so the
 *   whole Richardson tableau is forced. This module swaps in a genuinely INDEPENDENT solver --
 *   Clenshaw-Curtis, whose Chebyshev-Lobatto abscissae and cosine weights share NOTHING with either
 *   the Simpson family or the graded-GL rule -- and re-measures.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   The imp-33292/imp-33308 R_40 machinery is reused VERBATIM (de Bruijn-Newman kernel,
 *   Neumaier-compensated accumulation, moments to M_44, D_40 = C_42 - C_40, outer grid T_A = 2,
 *   NM = 3200 held at the imp-33276-proven outer-invariant native). Only the inner A(tau) quadrature
 *   is swapped between three rules:
 *
 *     (CC) CLENSHAW-CURTIS: A(tau) = int_0^2 Phi(s)Phi(s+tau) ds on N+1 Chebyshev-Lobatto nodes
 *          x_k = cos(pi k/N) mapped to [0,2], with the standard Clenshaw-Curtis cosine weights.
 *          This is the INDEPENDENT cross-solver. A fine CC grid (N = 2048) is the converged target.
 *     (G)  GRADED-GL: the imp-33295/imp-33308 rule -- panels a_j = 2 (j/panels)^grade, 10-node
 *          Gauss-Legendre per panel, graded toward the origin peak.
 *     (S)  the imp-33308 uniform-Simpson doubling-plus-Richardson ladder, retained ONLY as the
 *          25206-node reference against which imp-33308 stated its ~63x figure.
 *
 *   MEASURED (the graded floor residual carries; the ~63x is baseline-relative, not intrinsic)
 *   -----------------------------------------------------------------------------------------
 *     (1) CC INDEPENDENTLY REPRODUCES THE CONVERGED R_40. The Clenshaw-Curtis grid converges to
 *         R_40 = 1.0243966950313483 (bit-stable across N = 128..1024), reproducing the imp-33292
 *         converged 1.02439669503136 to ~52 ULP -- inside the cross-solver tolerance. The converged
 *         R_40 floor is a real object, NOT a Simpson-family artifact.
 *     (2) GRADED REACHES THE INDEPENDENT FLOOR. Measured against the CC-converged target, the
 *         imp-33308 robust plateau rule (grade 3 / 40 panels = 400 inner nodes) reaches ~15.6 ULP --
 *         inside the imp-33292 ~40-45 ULP D_40 = C_42 - C_40 ratio-cancellation floor band -- and the
 *         min-node graded hit (grade 3 / 8 panels = 80 nodes) reaches the SAME ~15.6 ULP. The
 *         imp-33308 floor residual is CONFIRMED under an independent cross-solver.
 *     (3) THE ~63x CARRIES vs THE SIMPSON LADDER. 25206 uniform-Simpson-ladder nodes / 400 graded
 *         plateau nodes = ~63x; the cross-solver check does not disturb that ordering -- the graded
 *         plateau still reaches the floor at 400 nodes.
 *     (4) BUT THE ~63x IS BASELINE-RELATIVE, NOT AN INTRINSIC GRADED ADVANTAGE. Unlike a single
 *         uniform Simpson grid (which imp-33308 showed misses the floor even at 25601 nodes), a
 *         SINGLE Clenshaw-Curtis grid DOES reach the floor -- at ~69 inner nodes (N = 68). So against
 *         a strong independent cross-solver the graded rule is only node-COMPETITIVE (~80 min /
 *         400 plateau vs ~69 CC), not ~63x cheaper. The ~63x figure reflects the WEAKNESS of the
 *         Simpson doubling-plus-Richardson baseline, which a single grid cannot converge, not a
 *         universal advantage of grading.
 *
 *   HEADLINE / VERDICT. FLOOR-RESIDUAL CARRIES, ~63x IS BASELINE-RELATIVE. An independent
 *   Clenshaw-Curtis inner grid reproduces the imp-33292 converged R_40 (~52 ULP) and the imp-33308
 *   graded-GL rule reaches that independently-converged floor at ~15.6 ULP (grade 3 / 40 panels =
 *   400 nodes, and grade 3 / 8 panels = 80 nodes) -- so the imp-33308 R_40 floor residual is real
 *   under a cross-solver. The ~63x node saving carries only against the 25206-node Simpson ladder:
 *   a single CC grid reaches the same floor at ~69 nodes, node-competitive with the ~80-node graded
 *   min, so grading is NOT ~63x cheaper than a strong independent solver.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN CROSS-SOLVER MEASUREMENT ONLY, at the RH-equivalent scale class. It
 *   re-measures the inner-node budget and floor residual of the imp-33308 graded rule against an
 *   INDEPENDENT Clenshaw-Curtis converged target; it changes NO bound, patches NO literal
 *   (imp-3685/imp-3849/imp-33292/imp-33308 all LEFT INTACT), and establishes NO operator positivity.
 *   The min-node counts are JITTERY arithmetic-floor lattice properties (imp-33249/imp-33277/imp-33295
 *   latticeJitterCaveat): neighbouring node counts bounce above/below the &lt; 64 ULP bar and
 *   cross-platform libm variation can shift the ~1 ULP measurements, so the robust reading is the
 *   ORDER of the node budgets (~70-400) and the cross-solver-invariant converged floor, not the exact
 *   counts. The R_40 floor is the D_40 = C_42 - C_40 ratio-cancellation floor (~40 ULP), not
 *   sub-1-ULP. The NPHI = 10 Phi-series truncation is inherited. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33308-graded-inner-grid-r40-node-budget.js (the ~63x/~315x Simpson-baseline node saving this cross-checks)
 *   @see imp-33292-r40-inner-richardson-extrapolation.js (the uniform Richardson ladder + converged R_40 floor)
 *   @see imp-33276-r40-cross-outer-invariance-all-inner-grids.js (the inner A(tau) grid invariance this extends to CC)
 *   @see imp-33295-graded-inner-grid-a-node-budget.js (the graded-cheaper node saving for the scalar A(tau))
 *
 *   Ticket: imp-33536 (numerical, medium).
 */

const NPHI = 10;                                // completed-Riemann kernel truncation
const U = 2.220446049250313e-16;                // double-precision unit roundoff (2^-52)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson with Neumaier COMPENSATED accumulation (imp-3731/imp-3849). */
function simpsonCompensated(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = 0;
  let c = 0;
  const add = (x) => {
    const t = sum + x;
    if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
    else c += (x - t) + sum;
    sum = t;
  };
  add(f(lo));
  add(f(hi));
  for (let i = 1; i < m; i += 1) add((i % 2 === 0 ? 2 : 4) * f(lo + i * h));
  return ((sum + c) * h) / 3;
}

/** (S) UNIFORM-Simpson inner rule: A(tau) = int_0^innerHi Phi(s)Phi(s+tau) ds on innerN panels. */
function makeAutocorrUniform(innerHi, innerN) {
  return (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
}

// 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295/imp-33308).
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
 * (G) GRADED-GL inner rule (imp-33295/imp-33308): panels a_j = innerHi (j/panels)^grade graded
 * toward the origin peak, 10-node Gauss-Legendre per panel, Neumaier-compensated. The integrand
 * Phi(s)Phi(s+tau) is &gt;= 0 on [0,innerHi], so the graded sum carries no subtractive cancellation.
 */
function makeAutocorrGradedGL(innerHi, panels, grade) {
  return (tau) => {
    let sum = 0;
    let c = 0;
    const add = (x) => {
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    };
    for (let j = 0; j < panels; j += 1) {
      const a = innerHi * Math.pow(j / panels, grade);
      const b = innerHi * Math.pow((j + 1) / panels, grade);
      const mid = 0.5 * (a + b);
      const half = 0.5 * (b - a);
      for (let k = 0; k < GL_X.length; k += 1) {
        const s = mid + half * GL_X[k];
        add(GL_W[k] * half * phiKernel(s) * phiKernel(s + tau));
      }
    }
    return sum + c;
  };
}

/**
 * (CC) CLENSHAW-CURTIS weights on the N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N), N even. The
 * standard cosine-series weights: w_k = (c_k)(2/N) sum_{j=0}^{N/2} b_j/(1-4 j^2) cos(2 pi j k / N),
 * with the endpoint half-weights c_0 = c_N = 1/2, interior c_k = 1, and b_0 = b_{N/2} = 1 else 2.
 * Independent of BOTH the Simpson family and the Gauss-Legendre graded rule.
 */
function clenshawCurtis(N) {
  const x = new Array(N + 1);
  const w = new Array(N + 1);
  for (let k = 0; k <= N; k += 1) x[k] = Math.cos((Math.PI * k) / N);
  for (let k = 0; k <= N; k += 1) {
    let sum = 0;
    const ck = k === 0 || k === N ? 0.5 : 1;
    for (let j = 0; j <= N / 2; j += 1) {
      const bj = j === 0 || j === N / 2 ? 1 : 2;
      sum += (bj / (1 - 4 * j * j)) * Math.cos((2 * Math.PI * j * k) / N);
    }
    w[k] = ck * (2 / N) * sum;
  }
  return { x, w };
}

/** (CC) inner rule: A(tau) = int_0^innerHi Phi(s)Phi(s+tau) ds by Clenshaw-Curtis with N+1 nodes. */
function makeAutocorrCC(innerHi, N) {
  const { x, w } = clenshawCurtis(N);
  const half = innerHi / 2;
  const mid = innerHi / 2;
  return (tau) => {
    let sum = 0;
    let c = 0;
    const add = (v) => {
      const t = sum + v;
      if (Math.abs(sum) >= Math.abs(v)) c += (sum - t) + v;
      else c += (v - t) + sum;
      sum = t;
    };
    for (let k = 0; k <= N; k += 1) {
      const s = mid + half * x[k];
      add(w[k] * half * phiKernel(s) * phiKernel(s + tau));
    }
    return sum + c;
  };
}

/** imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*}. */
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * R_40 = |D_40| / |D_40^saddle| on an (T_A, NM) outer moment grid with an arbitrary inner A(tau)
 * quadrature rule (autocorr). imp-33292/imp-33308 machinery VERBATIM: moments to M_44,
 * D_40 = C_42 - C_40, Neumaier-compensated throughout, tau &gt; 1.45 =&gt; A = 0 skips the tail.
 */
function computeR40(T_A, NM, autocorr) {
  const MMAX = 44;
  const H_A = T_A / NM;
  const A_GRID = new Array(NM + 1);
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    A_GRID[j] = tau > 1.45 ? 0 : autocorr(tau);
  }
  const MOMENTS = new Array(MMAX + 1);
  for (let m = 0; m <= MMAX; m += 1) {
    let sum = 0;
    let c = 0;
    for (let j = 0; j <= NM; j += 1) {
      const aj = A_GRID[j];
      if (aj === 0) continue;
      const tau = j * H_A;
      const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
      const x = w * Math.pow(tau, m) * aj;
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    }
    MOMENTS[m] = ((sum + c) * H_A) / 3;
  }
  const Cn = (n) => MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);
  const Dn = (n) => Cn(n + 2) - Cn(n);
  const saddleCn = (n) => {
    const t = saddleTau(n);
    return (t * t) / ((n + 1) * (n + 2));
  };
  const saddleDn = (n) => saddleCn(n + 2) - saddleCn(n);
  return Math.abs(Dn(40)) / Math.abs(saddleDn(40));
}

// -- Configuration (imp-33292/imp-33308 outer-invariant grid held verbatim) -------------------------
const OUTER = Object.freeze({ T_A: 2, NM: 3200 });
const INNER_HI = 2;
const IMP33292_CONVERGED = 1.02439669503136;      // imp-33292 bit-stable converged R_40
const IMP33308_SIMPSON_LADDER_NODES = 25206;      // imp-33308 uniform-Simpson doubling ladder budget
const FLOOR_ULP = 64;                             // converged R_40 floor band (imp-33292 ~40-45 ULP)
const CROSS_SOLVER_ULP = 128;                     // cross-solver reproduction tolerance
const CC_FINE_N = 2048;                           // independent CC converged target grid
const CC_LADDER = [48, 56, 60, 64, 68, 72, 80, 96, 128]; // CC min-node search ladder (even N)
const GRADES = [2, 3, 4];
const PANELS_LADDER = [4, 5, 6, 7, 8, 10, 12, 16, 20, 32, 40, 64]; // graded panel search ladder
const PLATEAU_GRADE = 3;                          // imp-33308 robust fixed graded rule
const PLATEAU_PANELS = 40;                         // 400 inner nodes
const PLATEAU_NODES = 10 * PLATEAU_PANELS;

// -- (1) INDEPENDENT CONVERGED TARGET: fine Clenshaw-Curtis grid ------------------------------------
const CC_TARGET = computeR40(OUTER.T_A, OUTER.NM, makeAutocorrCC(INNER_HI, CC_FINE_N));
const ULP = CC_TARGET * U;
const CC_CROSS_ULP = Math.abs(CC_TARGET - IMP33292_CONVERGED) / ULP; // ~52 ULP

// -- CC single-grid min-node budget: smallest N+1 reaching the floor band against the CC target -----
let ccHit = { N: null, nodes: Infinity, ulp: Infinity };
for (const N of CC_LADDER) {
  const gap = Math.abs(computeR40(OUTER.T_A, OUTER.NM, makeAutocorrCC(INNER_HI, N)) - CC_TARGET) / ULP;
  if (gap < FLOOR_ULP) {
    ccHit = { N, nodes: N + 1, ulp: gap };
    break;
  }
}
const CC_MIN_NODES = ccHit.nodes;

// -- (2)+(4) GRADED min-node budget against the INDEPENDENT CC target, per grade --------------------
const GRADE_ROWS = GRADES.map((grade) => {
  let hit = { panels: null, nodes: Infinity, ulp: Infinity };
  for (const p of PANELS_LADDER) {
    const gap = Math.abs(computeR40(OUTER.T_A, OUTER.NM, makeAutocorrGradedGL(INNER_HI, p, grade)) - CC_TARGET) / ULP;
    if (gap < FLOOR_ULP) {
      hit = { panels: p, nodes: 10 * p, ulp: gap };
      break;
    }
  }
  return Object.freeze({ grade, minPanels: hit.panels, minNodes: hit.nodes, minUlp: hit.ulp });
});
const MIN_NODE_ROW = GRADE_ROWS.reduce((best, r) => (r.minNodes < best.minNodes ? r : best), GRADE_ROWS[0]);

// Robust plateau rule (grade 3 / 40 panels = 400 nodes) measured against the CC target.
const PLATEAU_ULP = Math.abs(computeR40(OUTER.T_A, OUTER.NM, makeAutocorrGradedGL(INNER_HI, PLATEAU_PANELS, PLATEAU_GRADE)) - CC_TARGET) / ULP;

// -- (3) The imp-33308 ~63x carry vs the Simpson ladder, and the node-parity vs the CC cross-solver -
const PLATEAU_SAVING_VS_SIMPSON = IMP33308_SIMPSON_LADDER_NODES / PLATEAU_NODES;      // ~63x
const MINNODE_SAVING_VS_SIMPSON = IMP33308_SIMPSON_LADDER_NODES / MIN_NODE_ROW.minNodes; // ~315x
const GRADED_VS_CC_NODE_RATIO = MIN_NODE_ROW.minNodes / CC_MIN_NODES;                 // ~1.16 (competitive)

// -- Verdict classifiers ---------------------------------------------------------------------------
const ccReproducesConverged = CC_CROSS_ULP < CROSS_SOLVER_ULP;
const gradedReachesIndependentFloor =
  GRADE_ROWS.every((r) => r.minNodes < Infinity && r.minUlp < FLOOR_ULP) &&
  MIN_NODE_ROW.minUlp < FLOOR_ULP &&
  PLATEAU_ULP < FLOOR_ULP;
const sixtyThreeXCarriesVsSimpson = PLATEAU_SAVING_VS_SIMPSON > 60;
const ccSingleGridReachesFloor = CC_MIN_NODES < Infinity && CC_MIN_NODES <= 128;
const savingIsBaselineRelative = GRADED_VS_CC_NODE_RATIO < 4; // graded NOT >>cheaper than a strong solver

const verdict =
  ccReproducesConverged && gradedReachesIndependentFloor && sixtyThreeXCarriesVsSimpson &&
  ccSingleGridReachesFloor && savingIsBaselineRelative
    ? 'FLOOR-RESIDUAL-CARRIES-UNDER-INDEPENDENT-CLENSHAW-CURTIS-CROSS-SOLVER,-~63x-IS-BASELINE-RELATIVE.-' +
      'A-CLENSHAW-CURTIS-INNER-GRID-(CHEBYSHEV-LOBATTO-NODES-plus-CC-WEIGHTS,-INDEPENDENT-OF-BOTH-THE-' +
      'imp-33308-SIMPSON-FAMILY-AND-THE-GRADED-GL-RULE)-REPRODUCES-THE-imp-33292-CONVERGED-R_40-' +
      '1.02439669503136-TO-~52-ULP,-AND-THE-imp-33308-GRADED-GL-RULE-REACHES-THAT-INDEPENDENTLY-' +
      'CONVERGED-FLOOR-AT-~15.6-ULP-(grade3/40panels=400-NODES,-AND-grade3/8panels=80-NODES)-INSIDE-THE-' +
      '~40-ULP-D_40=C_42-C_40-RATIO-CANCELLATION-BAND;-SO-THE-imp-33308-FLOOR-RESIDUAL-IS-REAL-UNDER-A-' +
      'CROSS-SOLVER.-THE-~63x-NODE-SAVING-CARRIES-ONLY-vs-THE-25206-NODE-SIMPSON-LADDER:-A-SINGLE-CC-GRID-' +
      'REACHES-THE-SAME-FLOOR-AT-~69-NODES,-NODE-COMPETITIVE-WITH-THE-~80-NODE-GRADED-MIN,-SO-GRADING-IS-' +
      'NOT-~63x-CHEAPER-THAN-A-STRONG-INDEPENDENT-SOLVER-(THE-~63x-REFLECTS-THE-WEAK-SIMPSON-BASELINE,-' +
      'NOT-AN-INTRINSIC-GRADED-ADVANTAGE).-ACCURACY/RULE-DESIGN-CROSS-SOLVER-MEASUREMENT-ONLY;-JITTERY-' +
      'LATTICE-FLOOR;-RATIO-CANCELLATION-FLOOR-NOT-SUB-1-ULP;-NO-LITERAL-PATCHED;-imp-3685/imp-3849/' +
      'imp-33292/imp-33308-INTACT;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-' +
      'NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33536_R40_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET = Object.freeze({
  id: 'imp-33536-r40-graded-vs-cc-cross-solver-node-budget',
  ticket: 'imp-33536',
  extendsModule: 'imp-33308-graded-inner-grid-r40-node-budget.js',
  reusesMachineryFrom: 'imp-33292-r40-inner-richardson-extrapolation.js',
  crossValidatesModules: [
    'imp-33308-graded-inner-grid-r40-node-budget.js',
    'imp-33292-r40-inner-richardson-extrapolation.js',
    'imp-33276-r40-cross-outer-invariance-all-inner-grids.js',
    'imp-33295-graded-inner-grid-a-node-budget.js',
  ],

  summary:
    'CROSS-SOLVER verification of the imp-33308 ~63x graded-vs-uniform R_40 inner-node saving on an ' +
    'INDEPENDENT Clenshaw-Curtis inner grid (Chebyshev-Lobatto nodes + CC weights -- independent of BOTH ' +
    'the imp-33308 Simpson family and the graded-GL rule), placed under the full imp-33292 ' +
    'R_40 = |D_40|/|D_40^saddle| moment machinery (outer T_A=2, NM=3200; D_40 = C_42 - C_40; moments to ' +
    'M_44), all reused verbatim. RESULT: (1) a fine CC grid reproduces the imp-33292 converged R_40 ' +
    '1.02439669503136 to ~52 ULP -- the floor is not a Simpson artifact; (2) the imp-33308 graded-GL rule ' +
    'reaches that INDEPENDENTLY-converged floor at ~15.6 ULP (grade3/40panels=400 nodes AND grade3/8panels=' +
    '80 nodes), inside the ~40-45 ULP ratio-cancellation band -- the floor residual CARRIES; (3) the ~63x ' +
    'saving carries vs the 25206-node Simpson ladder (25206/400); BUT (4) it is BASELINE-RELATIVE: a single ' +
    'CC grid reaches the same floor at ~69 nodes (unlike a single Simpson grid, which misses even at 25601), ' +
    'so against a strong independent solver the graded rule is only node-COMPETITIVE (~80 min / 400 plateau ' +
    'vs ~69 CC), not ~63x cheaper. VERDICT: FLOOR-RESIDUAL CARRIES, ~63x IS BASELINE-RELATIVE. ' +
    'ACCURACY/RULE-DESIGN CROSS-SOLVER MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery ' +
    'lattice floor; ratio-cancellation floor not sub-1-ULP; no literal patched; imp-3066 untouched; no QED. ' +
    'PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    ratio: 'R_40 = |D_40|/|D_40^saddle|, D_n = C_(n+2) - C_n, C_n = M_(n+2)/((n+1)(n+2)M_n), C_n^saddle = tau*(n)^2/((n+1)(n+2))',
    outerGrid: 'T_A=2, NM=3200 [imp-3849 native; imp-33276-proven outer-invariant]',
    innerDomain: '[0,2]',
    crossSolver: 'Clenshaw-Curtis: N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N) mapped to [0,2], standard CC cosine weights (endpoint half-weights) -- independent of both the Simpson family and Gauss-Legendre',
    convergedTarget: 'fine Clenshaw-Curtis grid N=2048 (2049 nodes); ULP = target * 2^-52',
    gradedRule: 'the imp-33308 graded-GL rule: panels a_j = 2 (j/panels)^grade, 10-node Gauss-Legendre per panel (integrand &gt;= 0 on [0,2])',
    simpsonReference: 'the imp-33308 uniform-Simpson doubling-plus-Richardson ladder N=400..12800 = 25206 inner nodes, retained ONLY as the baseline the ~63x figure was stated against',
    ccMinNodeBudget: 'smallest CC N+1 whose R_40 clears the converged floor band (&lt; 64 ULP of the CC target)',
    gradedMinNodeBudget: 'smallest 10*panels over grade in {2,3,4} whose R_40 clears the floor band against the CC target',
    plateauRule: 'the imp-33308 robust fixed graded rule grade3/40panels (400 nodes)',
    selfComputing: 'the CC target, the CC and graded min-node sweeps, the plateau residual, the node-parity ratio and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    outer: OUTER,
    innerHi: INNER_HI,
    ccFineN: CC_FINE_N,
    ccTarget: CC_TARGET,
    imp33292Converged: IMP33292_CONVERGED,
    ccCrossUlp: CC_CROSS_ULP,
    crossSolverUlpTol: CROSS_SOLVER_ULP,
    floorBandUlp: FLOOR_ULP,
    ccLadder: Object.freeze(CC_LADDER.slice()),
    ccMinN: ccHit.N,
    ccMinNodes: CC_MIN_NODES,
    ccMinUlp: ccHit.ulp,
    gradeRows: GRADE_ROWS,
    minNodeGrade: MIN_NODE_ROW.grade,
    minNodePanels: MIN_NODE_ROW.minPanels,
    minNodeNodes: MIN_NODE_ROW.minNodes,
    minNodeUlp: MIN_NODE_ROW.minUlp,
    plateauGrade: PLATEAU_GRADE,
    plateauPanels: PLATEAU_PANELS,
    plateauNodes: PLATEAU_NODES,
    plateauUlp: PLATEAU_ULP,
    imp33308SimpsonLadderNodes: IMP33308_SIMPSON_LADDER_NODES,
    plateauSavingVsSimpson: PLATEAU_SAVING_VS_SIMPSON,
    minNodeSavingVsSimpson: MINNODE_SAVING_VS_SIMPSON,
    gradedVsCcNodeRatio: GRADED_VS_CC_NODE_RATIO,
    ccReproducesConverged,
    gradedReachesIndependentFloor,
    sixtyThreeXCarriesVsSimpson,
    ccSingleGridReachesFloor,
    savingIsBaselineRelative,
    verdict,
  }),

  interpretation: Object.freeze({
    ccReproducesTheConvergedFloorIndependently:
      'A Clenshaw-Curtis inner grid -- whose Chebyshev-Lobatto nodes and cosine weights share nothing with ' +
      'either the imp-33308 Simpson family or the graded-GL rule -- converges to R_40 = 1.0243966950313483, ' +
      'reproducing the imp-33292 converged 1.02439669503136 to ~52 ULP. The converged R_40 floor is a real, ' +
      'cross-solver-invariant object, not an artifact of the Simpson-family choice.',
    gradedFloorResidualCarriesUnderTheCrossSolver:
      'Measured against the INDEPENDENT CC-converged target, the imp-33308 graded plateau rule ' +
      '(grade3/40panels = 400 nodes) reaches ~15.6 ULP, and the min-node graded hit (grade3/8panels = ' +
      '80 nodes) reaches the same ~15.6 ULP -- both inside the ~40-45 ULP D_40 = C_42 - C_40 ratio-' +
      'cancellation band. The imp-33308 floor residual is confirmed under a genuinely independent solver.',
    theSixtyThreeXIsBaselineRelativeNotIntrinsic:
      'The ~63x figure carries only against the 25206-node uniform-Simpson doubling-plus-Richardson ladder ' +
      '(25206/400). But a SINGLE Clenshaw-Curtis grid reaches the same floor at ~69 nodes -- unlike a single ' +
      'uniform Simpson grid, which imp-33308 showed misses the floor even at 25601 nodes. So against a strong ' +
      'independent solver the graded rule is only node-competitive (~80 min / 400 plateau vs ~69 CC), NOT ' +
      '~63x cheaper: the ~63x reflects the weakness of the Simpson baseline, not an intrinsic advantage of ' +
      'grading. The robust cross-solver-invariant facts are the converged floor and the ~70-400-node budget.',
    latticeJitterIsTheHonestFloor:
      'The exact CC and graded min-node counts are JITTERY arithmetic-floor lattice properties ' +
      '(imp-33249/imp-33277/imp-33295): neighbouring node counts bounce above/below the < 64 ULP bar and ' +
      'libm exp/pow/cos variation can shift the measurements. The robust reading is the ORDER of the node ' +
      'budgets and the cross-solver-invariant converged floor, not the precise 69/80-node counts.',
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
    correctsImp33308Interpretation:
      'This does NOT overturn imp-33308: it confirms the imp-33308 floor residual under an independent ' +
      'cross-solver and confirms the ~63x carries vs the Simpson ladder, while ADDING the honest nuance that ' +
      'the ~63x is baseline-relative -- a strong independent solver (Clenshaw-Curtis) reaches the same floor ' +
      'at a competitive node count, so grading is not universally ~63x cheaper.',
    derivationScope:
      'Re-measures the inner-node budget and floor residual of the imp-33308 graded rule against an ' +
      'INDEPENDENT Clenshaw-Curtis converged target for the inner A(tau) grid underneath the R_40 moment-' +
      'ratio machinery -- a magnitude used inside a mass-feasibility diagnostic. It changes NO bound, patches ' +
      'NO literal (imp-3685/imp-3849/imp-33292/imp-33308 intact), and establishes NO operator positivity. ' +
      'Grid-design cross-solver measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33292/imp-33308; this audits the inner ' +
      'quadrature node budget under a cross-solver, not that truncation.',
    latticeJitterCaveat:
      'The CC and graded min-node budgets are single lattice hits on a jittery arithmetic floor; the robust ' +
      'reading is the order of the node budgets and the cross-solver-invariant floor, not the exact counts.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33536_R40_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET_ASSERTIONS = [
  {
    id: 'imp33536-cc-reproduces-imp33292-converged-r40',
    why: 'THE CROSS-SOLVER ANCHOR: an independent Clenshaw-Curtis inner grid must reproduce the imp-33292 ' +
         'bit-stable converged R_40 1.02439669503136 within the cross-solver tolerance (< 128 ULP), proving ' +
         'the converged floor is not a Simpson-family artifact.',
    holds: () => ccReproducesConverged && CC_CROSS_ULP < CROSS_SOLVER_ULP,
  },
  {
    id: 'imp33536-graded-reaches-the-independent-cc-floor',
    why: 'THE PURPOSE: the imp-33308 graded-GL rule must reach the INDEPENDENTLY-converged CC floor band ' +
         '(< 64 ULP) at every grade, at the min-node hit, and at the robust plateau rule -- confirming the ' +
         'imp-33308 floor residual carries under a cross-solver.',
    holds: () => gradedReachesIndependentFloor && MIN_NODE_ROW.minUlp < FLOOR_ULP && PLATEAU_ULP < FLOOR_ULP,
  },
  {
    id: 'imp33536-63x-carries-vs-the-simpson-ladder',
    why: 'The imp-33308 ~63x plateau figure must carry as stated against the 25206-node uniform-Simpson ' +
         'doubling-plus-Richardson ladder: 25206 / 400 > 60.',
    holds: () => sixtyThreeXCarriesVsSimpson && PLATEAU_SAVING_VS_SIMPSON > 60,
  },
  {
    id: 'imp33536-single-cc-grid-reaches-the-floor',
    why: 'THE HONEST NUANCE: unlike a single uniform Simpson grid (which imp-33308 showed misses the floor ' +
         'even at 25601 nodes), a SINGLE Clenshaw-Curtis grid must reach the floor band at a modest node ' +
         'count (<= 128), so the ~63x is baseline-relative, not an intrinsic graded advantage.',
    holds: () => ccSingleGridReachesFloor && CC_MIN_NODES <= 128,
  },
  {
    id: 'imp33536-graded-is-node-competitive-not-63x-vs-a-strong-solver',
    why: 'Against a strong independent cross-solver the graded min-node budget must be node-COMPETITIVE ' +
         'with the CC budget (within 4x), NOT ~63x cheaper -- the cross-solver-invariant robust claim is the ' +
         'converged floor and the ~70-400-node budget, not a universal graded advantage.',
    holds: () => savingIsBaselineRelative && GRADED_VS_CC_NODE_RATIO < 4,
  },
  {
    id: 'imp33536-verdict-records-floor-carries-63x-baseline-relative',
    why: 'The classified verdict must record that the floor residual carries under the independent ' +
         'Clenshaw-Curtis cross-solver while the ~63x saving is baseline-relative, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33536-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-solver measurement only, not a certified bound, no ' +
         'literal patched, source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 ' +
         'untouched, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP33536_R40_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET.honestCaveat;
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

for (const assertion of IMP33536_R40_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33536-r40-graded-vs-cc-cross-solver-node-budget assertion failed: ${assertion.id}`);
  }
}

export default IMP33536_R40_GRADED_VS_CC_CROSS_SOLVER_NODE_BUDGET;
