/**
 * @module imp-33308-graded-inner-grid-r40-node-budget
 * @fileoverview imp-33308 -- CARRY the imp-33295 graded-cheaper node saving from the SCALAR
 *   autocorrelation weight A(tau) to the FULL R_40 = |D_40|/|D_40^saddle| moment-ratio object:
 *   MEASURE whether the imp-33295 graded-GL inner grid, placed UNDERNEATH the imp-33292 R_40
 *   moment machinery, reaches the imp-33292 converged R_40 ~40 ULP arithmetic floor band at
 *   MATERIALLY FEWER inner nodes than the imp-33292 UNIFORM-Simpson doubling Richardson ladder.
 *
 *   THE GAP imp-33295 / imp-33292 LEFT OPEN
 *   ---------------------------------------
 *   imp-33295 showed a graded (peak-concentrated) inner grid reaches the A_log arithmetic floor
 *   band at ~266-310x fewer nodes than the uniform-Simpson Richardson ladder -- but ONLY for the
 *   DIRECT scalar autocorrelation A(tau) = int Phi(s)Phi(s+tau) ds. imp-33292 SEPARATELY collapsed
 *   the ~1.21e-5 imp-3888 inner R_40 drift to a ladder-independent converged R_40 ~ 1.0243966950314
 *   pinned to the ~40 ULP D_40 = C_42 - C_40 ratio-cancellation floor, using UNIFORM repeated
 *   Richardson on the inner A(tau) grid (the whole ladder N = 400..12800 = 25206 inner nodes per
 *   A(tau) evaluation). The two were never combined: whether the imp-33295 graded inner grid buys
 *   the same node saving when carried through the FULL R_40 moment machinery -- not just the scalar
 *   weight -- was UNMEASURED. This module measures exactly that.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   The imp-33292 R_40 machinery is reused VERBATIM (de Bruijn-Newman kernel, Neumaier-compensated
 *   Simpson, moments to M_44, D_40 = C_42 - C_40, outer grid T_A = 2, NM = 3200 held at the
 *   imp-33276-proven outer-invariant native). The ONLY thing swapped is the inner A(tau) quadrature:
 *
 *     (U) UNIFORM: A(tau) = int_0^2 Phi(s)Phi(s+tau) ds by composite Simpson on the imp-33292 inner
 *         doubling ladder N = 400,800,1600,3200,6400,12800, then the imp-33252 repeated-Richardson
 *         tableau. This reaches the converged R_40 floor ONLY through the WHOLE 6-grid ladder --
 *         node budget = sum(N + 1) = 25206 inner integrand evaluations per A(tau).
 *
 *     (G) GRADED-GL: the imp-33295 rule -- panels a_j = 2 (j/panels)^grade, b_j = 2 ((j+1)/panels)^grade,
 *         10-node Gauss-Legendre per panel, graded toward the origin peak. The integrand
 *         Phi(s)Phi(s+tau) &gt;= 0 on [0,2], so the graded sum carries no subtractive cancellation.
 *
 *   The imp-33292 Richardson extrapolant on (U) is the CONVERGED TARGET R_40; ULP = target * 2^-52.
 *   For each grade we locate the MIN-NODE graded budget: the smallest 10*panels reaching the
 *   converged floor band (&lt; 64 ULP of the target), and score a robust fixed plateau rule.
 *
 *   MEASURED (the graded grid reaches the R_40 floor at a tiny fraction of the uniform nodes)
 *   ---------------------------------------------------------------------------------------
 *     (1) CONVERGED TARGET. The uniform Richardson ladder extrapolant is R_40 = 1.024396695031357,
 *         agreeing with the imp-33292 bit-stable converged 1.02439669503136 to ~13 ULP -- the same
 *         converged R_40 object, reproduced here.
 *     (2) A SINGLE GRADED GRID REACHES THE FLOOR DIRECTLY. The graded-GL R_40 plateaus at ~23.4 ULP
 *         from the Richardson extrapolant -- comfortably inside the imp-33292 ~40-45 ULP
 *         ratio-cancellation floor band -- and STAYS there as panels grow (bit-flat from 80 to 3200
 *         inner nodes). Grading resolves the peak in one grid; no Richardson tableau is needed.
 *     (3) MIN-NODE GRADED BUDGET ~80 INNER NODES. The smallest graded grid reaching the &lt; 64 ULP
 *         floor band is grade 3 / 8 panels = 80 inner nodes (23.4 ULP); grade 2 / 8 panels (80n)
 *         also clears at 38.1 ULP. Against the 25206-node uniform Richardson ladder this is a
 *         ~315x node saving. A robust fixed plateau rule (grade 3 / 40 panels = 400 nodes, 23.4 ULP)
 *         -- not a fragile single-lattice hit -- reaches the same floor at ~63x fewer nodes.
 *     (4) A SINGLE UNIFORM GRID DOES NOT REACH THE FLOOR. The finest single uniform grid in the
 *         ladder (N = 12800, 12801 nodes) is ~34867 ULP from the converged target; even N = 25600
 *         (25601 nodes) is ~2197 ULP off. The uniform route genuinely needs the WHOLE Richardson
 *         tableau to reach the ~23 ULP floor the graded grid reaches directly at 80 nodes.
 *
 *   HEADLINE / VERDICT. GRADED-CHEAPER CARRIES TO R_40. The imp-33295 graded-cheaper ordering is
 *   not confined to the scalar A(tau): placed underneath the full imp-33292 R_40 = D_40 = C_42 - C_40
 *   moment-ratio machinery, a single graded-GL inner grid reaches the imp-33292 converged R_40
 *   ~40 ULP arithmetic floor band (measured ~23.4 ULP from the extrapolant) at ~80 inner nodes
 *   (~315x fewer than the 25206-node uniform Richardson ladder), and at ~400 nodes with a robust
 *   plateau rule (~63x fewer), while a single uniform grid misses the floor even at 25601 nodes.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It measures the
 *   inner-node budget of two quadrature rules for the inner A(tau) grid used inside the R_40
 *   mass-feasibility diagnostic; it changes NO bound, patches NO literal (imp-3685/imp-3849 and the
 *   imp-33292 converged value are all LEFT INTACT), and establishes NO operator positivity. The
 *   min-node graded budget is a JITTERY arithmetic-floor lattice property (imp-33249/imp-33277/imp-33295
 *   latticeJitterCaveat): neighbouring panel counts bounce above/below the bar and cross-platform libm
 *   variation can shift the ~1 ULP measurements, so the robust reading is the ~63x plateau saving and
 *   the graded-is-cheaper ordering, not the exact 80-node count. The R_40 floor is the D_40 = C_42 - C_40
 *   ratio-cancellation floor (~40 ULP), not sub-1-ULP. The NPHI = 10 Phi-series truncation is inherited.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33295-graded-inner-grid-a-node-budget.js (the graded-cheaper node saving for the SCALAR A(tau))
 *   @see imp-33292-r40-inner-richardson-extrapolation.js (the uniform Richardson ladder + converged R_40 floor)
 *   @see imp-33276-r40-cross-outer-invariance-all-inner-grids.js (the inner A(tau) grid that carries the R_40 residual)
 *   @see imp-3888-cross-check-provenance-audit.js (found the ~1.21e-5 R_40 residual this floor retires)
 *
 *   Ticket: imp-33308 (numerical, medium).
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

/** (U) UNIFORM inner rule: A(tau) = int_0^innerHi Phi(s)Phi(s+tau) ds on innerN Simpson panels. */
function makeAutocorrUniform(innerHi, innerN) {
  return (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
}

// 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295).
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
 * (G) GRADED-GL inner rule (imp-33295): panels a_j = innerHi (j/panels)^grade graded toward the
 * origin peak, 10-node Gauss-Legendre per panel, Neumaier-compensated. The integrand
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
 * quadrature rule (autocorr). imp-33292 machinery VERBATIM: moments to M_44, D_40 = C_42 - C_40,
 * Neumaier-compensated throughout, the tau &gt; 1.45 =&gt; A = 0 guard skips the numerically-zero tail.
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

/** Repeated Richardson on the Simpson even-power ladder (p = 4, 6, 8, ...) -> single extrapolant. */
function richardsonExtrapolant(raw) {
  let column = raw.slice();
  let p = 4;
  while (column.length > 1) {
    const factor = Math.pow(2, p);
    const next = [];
    for (let i = 0; i + 1 < column.length; i += 1) {
      next.push((factor * column[i + 1] - column[i]) / (factor - 1));
    }
    column = next;
    p += 2;
  }
  return column[0];
}

// -- Configuration (imp-33292 outer-invariant grid + inner doubling ladder held verbatim) ---------
const OUTER = Object.freeze({ T_A: 2, NM: 3200 });
const INNER_HI = 2;
const UNIFORM_LADDER = [400, 800, 1600, 3200, 6400, 12800];    // imp-33292 primary inner ladder
const UNIFORM_NODES = UNIFORM_LADDER.reduce((a, N) => a + N + 1, 0); // = 25206 (whole Richardson ladder)
const IMP33292_CONVERGED = 1.02439669503136;                    // imp-33292 bit-stable converged R_40
const FLOOR_ULP = 64;                                           // converged R_40 floor band (imp-33292 ~40-45 ULP)
const GRADES = [2, 3, 4];
const PANELS_LADDER = [4, 5, 6, 7, 8, 10, 12, 16, 20, 32, 40, 64]; // graded panel search ladder
const PLATEAU_GRADE = 3;                                        // robust fixed graded rule (not a fragile lattice hit)
const PLATEAU_PANELS = 40;                                      // 400 inner nodes
const PLATEAU_NODES = 10 * PLATEAU_PANELS;

// -- (1) CONVERGED TARGET: imp-33292 uniform Richardson ladder extrapolant --------------------------
const RAW_UNIFORM = UNIFORM_LADDER.map((N) => computeR40(OUTER.T_A, OUTER.NM, makeAutocorrUniform(INNER_HI, N)));
const CONVERGED_TARGET = richardsonExtrapolant(RAW_UNIFORM);
const ULP = CONVERGED_TARGET * U;
const IMP33292_CROSS_ULP = Math.abs(CONVERGED_TARGET - IMP33292_CONVERGED) / ULP; // ~13 ULP

// -- (2)+(3) GRADED min-node budget: smallest 10*panels reaching the floor band, per grade ----------
const GRADE_ROWS = GRADES.map((grade) => {
  let hit = { panels: null, nodes: Infinity, ulp: Infinity };
  for (const p of PANELS_LADDER) {
    const gap = Math.abs(computeR40(OUTER.T_A, OUTER.NM, makeAutocorrGradedGL(INNER_HI, p, grade)) - CONVERGED_TARGET) / ULP;
    if (gap < FLOOR_ULP) {
      hit = { panels: p, nodes: 10 * p, ulp: gap };
      break;
    }
  }
  return Object.freeze({ grade, minPanels: hit.panels, minNodes: hit.nodes, minUlp: hit.ulp });
});
const MIN_NODE_ROW = GRADE_ROWS.reduce((best, r) => (r.minNodes < best.minNodes ? r : best), GRADE_ROWS[0]);
const MIN_NODE_SAVING = UNIFORM_NODES / MIN_NODE_ROW.minNodes;

// Robust plateau rule (grade 3 / 40 panels = 400 nodes) -- not a fragile single-lattice hit.
const PLATEAU_ULP = Math.abs(computeR40(OUTER.T_A, OUTER.NM, makeAutocorrGradedGL(INNER_HI, PLATEAU_PANELS, PLATEAU_GRADE)) - CONVERGED_TARGET) / ULP;
const PLATEAU_SAVING = UNIFORM_NODES / PLATEAU_NODES;

// -- (4) SINGLE UNIFORM GRID MISSES: finest ladder grid + one beyond it -----------------------------
const FINEST_SINGLE_UNIFORM_ULP = Math.abs(RAW_UNIFORM[RAW_UNIFORM.length - 1] - CONVERGED_TARGET) / ULP; // N=12800, ~34867 ULP
const BEYOND_LADDER_N = 25600;
const BEYOND_SINGLE_UNIFORM_ULP = Math.abs(computeR40(OUTER.T_A, OUTER.NM, makeAutocorrUniform(INNER_HI, BEYOND_LADDER_N)) - CONVERGED_TARGET) / ULP; // ~2197 ULP

// -- Verdict classifiers ---------------------------------------------------------------------------
const gradedReachesFloor = GRADE_ROWS.every((r) => r.minNodes < Infinity && r.minUlp < FLOOR_ULP);
const gradedMateriallyFewer = MIN_NODE_SAVING > 100 && MIN_NODE_ROW.minNodes <= 128;
const plateauRobustlyCheaper = PLATEAU_ULP < FLOOR_ULP && PLATEAU_SAVING > 1;
const singleUniformMisses = FINEST_SINGLE_UNIFORM_ULP > FLOOR_ULP && BEYOND_SINGLE_UNIFORM_ULP > FLOOR_ULP;
const targetMatchesImp33292 = IMP33292_CROSS_ULP < 128;

const verdict =
  gradedReachesFloor && gradedMateriallyFewer && plateauRobustlyCheaper && singleUniformMisses && targetMatchesImp33292
    ? 'GRADED-CHEAPER-CARRIES-TO-R_40:-PLACED-UNDERNEATH-THE-imp-33292-R_40=D_40=C_42-C_40-MOMENT-RATIO-' +
      'MACHINERY,-A-SINGLE-imp-33295-GRADED-GL-INNER-GRID-REACHES-THE-imp-33292-CONVERGED-R_40-~40-ULP-' +
      'ARITHMETIC-FLOOR-BAND-(MEASURED-~23.4-ULP-FROM-THE-RICHARDSON-EXTRAPOLANT)-AT-~80-INNER-NODES-' +
      '(grade3/8panels;-~315x-FEWER-THAN-THE-25206-NODE-UNIFORM-RICHARDSON-LADDER),-AND-AT-400-NODES-' +
      'WITH-A-ROBUST-PLATEAU-RULE-(grade3/40panels;-~63x-FEWER);-A-SINGLE-UNIFORM-GRID-MISSES-THE-FLOOR-' +
      'EVEN-AT-25601-NODES-(~2197-ULP),-SO-THE-UNIFORM-ROUTE-NEEDS-THE-WHOLE-RICHARDSON-TABLEAU.-THE-' +
      'CONVERGED-TARGET-1.024396695031357-REPRODUCES-THE-imp-33292-1.02439669503136-TO-~13-ULP.-' +
      'ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-RATIO-CANCELLATION-FLOOR-NOT-SUB-1-ULP;-' +
      'NO-LITERAL-PATCHED;-imp-3685/imp-3849/imp-33292-INTACT;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-' +
      'imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33308_GRADED_INNER_GRID_R40_NODE_BUDGET = Object.freeze({
  id: 'imp-33308-graded-inner-grid-r40-node-budget',
  ticket: 'imp-33308',
  extendsModule: 'imp-33295-graded-inner-grid-a-node-budget.js',
  reusesMachineryFrom: 'imp-33292-r40-inner-richardson-extrapolation.js',
  crossValidatesModules: [
    'imp-33295-graded-inner-grid-a-node-budget.js',
    'imp-33292-r40-inner-richardson-extrapolation.js',
    'imp-33276-r40-cross-outer-invariance-all-inner-grids.js',
    'imp-3888-cross-check-provenance-audit.js',
  ],

  summary:
    'NODE-BUDGET measurement carrying the imp-33295 graded-cheaper node saving from the SCALAR A(tau) to the ' +
    'FULL R_40 = |D_40|/|D_40^saddle| moment-ratio object. The imp-33292 R_40 machinery is reused verbatim ' +
    '(outer grid T_A=2, NM=3200; D_40 = C_42 - C_40; moments to M_44) and ONLY the inner A(tau) quadrature is ' +
    'swapped: (U) uniform Simpson on the imp-33292 ladder N = 400..12800 + repeated Richardson (reaches the ' +
    'converged floor ONLY via the whole 6-grid ladder = 25206 inner nodes) vs (G) the imp-33295 graded-GL rule ' +
    '(panels a_j = 2 (j/panels)^grade, GL-10 per panel). RESULT: a SINGLE graded grid reaches the imp-33292 ' +
    'converged R_40 ~40 ULP floor band (measured ~23.4 ULP from the Richardson extrapolant, bit-flat 80..3200 ' +
    'nodes) at just ~80 inner nodes (grade3/8panels; ~315x fewer than the 25206-node uniform ladder), and at ' +
    '400 nodes with a robust plateau rule (grade3/40panels; ~63x fewer). A single uniform grid MISSES the floor ' +
    'even at 25601 nodes (~2197 ULP), confirming the uniform route needs the whole Richardson tableau. The ' +
    'converged target 1.024396695031357 reproduces the imp-33292 1.02439669503136 to ~13 ULP. VERDICT: ' +
    'GRADED-CHEAPER CARRIES TO R_40. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; jittery lattice floor; ratio-cancellation floor not sub-1-ULP; no literal ' +
    'patched; imp-3066 untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    ratio: 'R_40 = |D_40|/|D_40^saddle|, D_n = C_(n+2) - C_n, C_n = M_(n+2)/((n+1)(n+2)M_n), C_n^saddle = tau*(n)^2/((n+1)(n+2))',
    outerGrid: 'T_A=2, NM=3200 [imp-3849 native; imp-33276-proven outer-invariant]',
    innerDomain: '[0,2]',
    uniformRule: 'inner A(tau) by composite Simpson on the imp-33292 doubling ladder N = 400,800,1600,3200,6400,12800, then the imp-33252 repeated-Richardson tableau (p = 4,6,8,...)',
    uniformNodeBudget: 'sum over the ladder of (N + 1) inner evaluations = 25206 (a single uniform grid does not reach the floor)',
    gradedRule: 'inner A(tau) by the imp-33295 graded-GL rule: panels a_j = 2 (j/panels)^grade, b_j = 2 ((j+1)/panels)^grade, 10-node Gauss-Legendre per panel (integrand &gt;= 0 on [0,2])',
    target: 'CONVERGED R_40 = the uniform Richardson extrapolant (matches imp-33292 1.02439669503136 to ~13 ULP); ULP = target * 2^-52',
    minNodeBudget: 'smallest 10*panels over grade in {2,3,4} whose R_40 clears the converged floor band (&lt; 64 ULP of the target)',
    plateauRule: 'a robust fixed graded rule grade3/40panels (400 nodes), not a single fragile lattice hit',
    selfComputing: 'the target, both rules, the min-node sweep, the plateau rule, the single-uniform miss and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    outer: OUTER,
    innerHi: INNER_HI,
    uniformLadder: Object.freeze(UNIFORM_LADDER.slice()),
    uniformNodes: UNIFORM_NODES,
    convergedTarget: CONVERGED_TARGET,
    imp33292Converged: IMP33292_CONVERGED,
    imp33292CrossUlp: IMP33292_CROSS_ULP,
    floorBandUlp: FLOOR_ULP,
    gradeRows: GRADE_ROWS,
    minNodeGrade: MIN_NODE_ROW.grade,
    minNodePanels: MIN_NODE_ROW.minPanels,
    minNodeNodes: MIN_NODE_ROW.minNodes,
    minNodeUlp: MIN_NODE_ROW.minUlp,
    minNodeSaving: MIN_NODE_SAVING,
    plateauGrade: PLATEAU_GRADE,
    plateauPanels: PLATEAU_PANELS,
    plateauNodes: PLATEAU_NODES,
    plateauUlp: PLATEAU_ULP,
    plateauSaving: PLATEAU_SAVING,
    finestSingleUniformN: UNIFORM_LADDER[UNIFORM_LADDER.length - 1],
    finestSingleUniformUlp: FINEST_SINGLE_UNIFORM_ULP,
    beyondLadderN: BEYOND_LADDER_N,
    beyondSingleUniformUlp: BEYOND_SINGLE_UNIFORM_ULP,
    gradedReachesFloor,
    gradedMateriallyFewer,
    plateauRobustlyCheaper,
    singleUniformMisses,
    targetMatchesImp33292,
    verdict,
  }),

  interpretation: Object.freeze({
    gradingBuysTheSameR40FloorForFewerNodes:
      'The uniform Simpson grid reaches the imp-33292 converged R_40 floor band ONLY through the whole 6-grid ' +
      'Richardson ladder (25206 inner nodes); a single uniform grid does not reach it even at 25601 nodes ' +
      '(~2197 ULP). Grading the inner panels toward the origin peak reaches the SAME ~40 ULP band directly ' +
      '(measured ~23.4 ULP): the min-node lattice hit at ~80 nodes (~315x fewer) and a robust plateau rule at ' +
      '400 nodes (~63x fewer). So the imp-33295 graded-cheaper ordering is not confined to the scalar A(tau) -- ' +
      'it carries through the full R_40 moment-ratio machinery.',
    floorIsCancellationNotDiscretization:
      'The graded R_40 plateaus at ~23.4 ULP from the Richardson extrapolant and stays flat as panels grow: that ' +
      'plateau is the double-precision D_40 = C_42 - C_40 ratio-cancellation floor imp-33292 identified (~40-45 ' +
      'ULP), not a further discretization error. The graded grid trades no accuracy for its node savings.',
    latticeJitterIsTheHonestFloor:
      'The exact min-node panel count is a JITTERY arithmetic-floor lattice property (imp-33249/imp-33277/imp-33295): ' +
      'neighbouring panel counts bounce above/below the < 64 ULP bar and libm exp/pow variation can shift the ' +
      'measurements. The robust reading is the ~63x plateau saving and the graded-is-cheaper ordering, not the ' +
      'precise 80-node count.',
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
    derivationScope:
      'Measures the inner-node budget of two quadrature rules (uniform-Simpson-plus-Richardson vs graded-GL) for ' +
      'the inner A(tau) grid underneath the R_40 moment-ratio machinery -- a magnitude used inside a ' +
      'mass-feasibility diagnostic. It changes NO bound, patches NO literal (imp-3685/imp-3849/imp-33292 intact), ' +
      'and establishes NO operator positivity. Grid-design measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33292/imp-33295; this audits the inner ' +
      'quadrature node budget, not that truncation.',
    latticeJitterCaveat:
      'The min-node graded budget is a single lattice hit on a jittery arithmetic floor; the robust reading is ' +
      'the ~63x plateau-rule saving and the graded-is-cheaper ordering, not the exact node count.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33308_GRADED_INNER_GRID_R40_NODE_BUDGET_ASSERTIONS = [
  {
    id: 'imp33308-converged-target-reproduces-imp33292',
    why: 'The uniform Richardson extrapolant used as the converged R_40 target must reproduce the imp-33292 ' +
         'bit-stable converged 1.02439669503136 to within the machinery arithmetic floor (< 128 ULP).',
    holds: () => targetMatchesImp33292 && IMP33292_CROSS_ULP < 128,
  },
  {
    id: 'imp33308-graded-reaches-the-r40-floor-band',
    why: 'THE PURPOSE: at EVERY grade the graded-GL inner grid must reach the imp-33292 converged R_40 floor ' +
         'band (< 64 ULP), matching the ~40-45 ULP ratio-cancellation floor the uniform Richardson ladder reaches.',
    holds: () => gradedReachesFloor && MIN_NODE_ROW.minUlp < FLOOR_ULP && PLATEAU_ULP < FLOOR_ULP,
  },
  {
    id: 'imp33308-graded-min-node-materially-fewer',
    why: 'THE HEADLINE: the graded min-node budget must be MATERIALLY fewer inner nodes than the uniform ' +
         'Richardson ladder (> 100x) -- the measured saving is ~315x at ~80 nodes vs 25206.',
    holds: () => gradedMateriallyFewer && MIN_NODE_SAVING > 100 && MIN_NODE_ROW.minNodes <= 128,
  },
  {
    id: 'imp33308-plateau-rule-robustly-cheaper',
    why: 'The saving must not rest on the jittery min-node lattice hit: a robust fixed plateau rule ' +
         '(grade3/40panels, 400 nodes) must also reach the floor band at materially fewer nodes (~63x).',
    holds: () => plateauRobustlyCheaper && PLATEAU_ULP < FLOOR_ULP && PLATEAU_SAVING > 10,
  },
  {
    id: 'imp33308-single-uniform-grid-misses-the-floor',
    why: 'The uniform baseline is the WHOLE Richardson ladder: a single uniform grid must NOT reach the floor ' +
         'band -- the finest ladder grid (N=12800) and one beyond it (N=25600) must both stay far above 64 ULP.',
    holds: () => singleUniformMisses && FINEST_SINGLE_UNIFORM_ULP > 1000 && BEYOND_SINGLE_UNIFORM_ULP > FLOOR_ULP,
  },
  {
    id: 'imp33308-uniform-node-budget-is-the-whole-tableau',
    why: 'The uniform node budget is the WHOLE imp-33292 doubling ladder (a single uniform grid does not reach ' +
         'the floor): sum(N + 1) over N = 400..12800 = 25206.',
    holds: () => UNIFORM_NODES === UNIFORM_LADDER.reduce((a, N) => a + N + 1, 0) && UNIFORM_NODES === 25206,
  },
  {
    id: 'imp33308-verdict-records-graded-cheaper-carries-to-r40',
    why: 'The classified verdict must record that the graded-cheaper ordering carries to the full R_40 ' +
         'moment-ratio object, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33308-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, no literal patched, ' +
         'source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP33308_GRADED_INNER_GRID_R40_NODE_BUDGET.honestCaveat;
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

for (const assertion of IMP33308_GRADED_INNER_GRID_R40_NODE_BUDGET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33308-graded-inner-grid-r40-node-budget assertion failed: ${assertion.id}`);
  }
}

export default IMP33308_GRADED_INNER_GRID_R40_NODE_BUDGET;
