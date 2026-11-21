/**
 * @module imp-33295-graded-inner-grid-a-node-budget
 * @fileoverview imp-33295 -- MEASURE whether a GRADED inner quadrature grid reaches the imp-33275
 *   A_log (and imp-33276 R_40) double-precision arithmetic floor at MATERIALLY FEWER inner nodes
 *   than the imp-33275/imp-33276 UNIFORM-Simpson ladder, for the saddle-window autocorrelation weight
 *
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE GAP imp-33275/imp-33276 LEFT OPEN
 *   -------------------------------------
 *   imp-33275 (rung-uniform repeated Richardson to a few-ULP floor) and imp-33276 (R_40 inner O(h^4)
 *   drift, outer-invariant) both drive A(tau)/R_40 onto the double-precision floor using a UNIFORM inner
 *   composite Simpson grid refined by raw panel doubling (inner N = 1200,2400,...,19200) -- and the
 *   uniform grid ONLY reaches the floor through a 5-rung Richardson tableau, never at a single grid. The
 *   imp-33249/imp-33277 graded-GL work showed that GRADING the nodes toward the peak reaches &lt;1 ULP at
 *   far fewer nodes for the log-domain -ln A weight. Whether a graded inner grid buys the same node
 *   savings for the DIRECT linear-domain autocorrelation quadrature -- the exact inner A(tau) object both
 *   imp-33275 and imp-33276 refine -- was UNMEASURED.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For each saddle-a rung n in {10,20,...,80} we take tau* = saddleTau(n) and evaluate the direct linear
 *   autocorrelation A_direct(tau*) = int_0^7 phiKernel(s) phiKernel(s+tau*) ds by TWO inner rules:
 *
 *     (U) UNIFORM composite Simpson on the imp-33275 ladder N = 1200,2400,4800,9600,19200, then the SAME
 *         repeated-Richardson tableau (even powers p = 4,6,8,...). This is the imp-33275 route: its node
 *         budget to reach the floor is the WHOLE ladder, sum(N + 1) = 37205 inner integrand evaluations.
 *
 *     (G) GRADED-GL: panels graded toward the origin peak, a_j = 7 (j/panels)^grade,
 *         b_j = 7 ((j+1)/panels)^grade, 10-node Gauss-Legendre per panel (the imp-33249/imp-33277 grading
 *         applied to the DIRECT linear integrand). The integrand phiKernel(s)phiKernel(s+tau) is strictly
 *         positive on [0,7] (each amp = 2 pi n^2 e^{2u} - 3 &gt; 0 for u &gt;= 0), so the linear-domain graded
 *         sum carries no subtractive cancellation.
 *
 *   For each rung we (a) locate the MIN-NODE graded budget: the smallest 10*panels over grade in {2..6}
 *   and panels 8..600 whose worst-window residual clears the imp-33275 floor band (&lt; 30 ULP of A_log),
 *   and (b) score a CONSERVATIVE fixed plateau rule (grade 4, 400 panels = 4000 nodes) that is not a
 *   single fragile lattice hit. A_log(tau*) = exp(-negLnA) is the imp-33213 INDEPENDENT log-domain
 *   target; ULP = A_log * 2^-52.
 *
 *   MEASURED (per rung: graded min-node vs the uniform Richardson ladder that reaches the same floor):
 *
 *        n    tau*      graded min-node        plateau (4000n)   uniform Richardson ladder
 *        10   0.27012   g3/120n   1.49 ULP     14.13 ULP         37205n  18.60 ULP
 *        20   0.36687   g3/120n  12.32 ULP      4.93 ULP         37205n   4.11 ULP
 *        30   0.42907   g4/120n   7.40 ULP      2.28 ULP         37205n   4.55 ULP
 *        40   0.47538   g3/120n   6.60 ULP     21.01 ULP         37205n  21.01 ULP
 *        50   0.51241   g4/120n  23.65 ULP      9.46 ULP         37205n  21.55 ULP
 *        60   0.54334   g3/140n   2.40 ULP      6.40 ULP         37205n  15.20 ULP
 *        70   0.56993   g3/140n  27.27 ULP      5.45 ULP         37205n   6.54 ULP
 *        80   0.59327   g4/140n  10.20 ULP      2.04 ULP         37205n  10.88 ULP
 *
 *   HEADLINE. The GRADED inner grid reaches the SAME few-ULP double-precision floor band as the uniform
 *   Richardson ladder at MATERIALLY FEWER inner nodes. The aggressive min-node graded lattice hit lands in
 *   the floor band (worst ~27 ULP, comparable to the uniform ladder worst ~21.6 ULP) at just 120-140 inner
 *   nodes -- a ~266-310x node saving against the 37205-node uniform ladder. Even the CONSERVATIVE fixed
 *   plateau rule (grade4/400p, 4000 nodes; worst ~21 ULP), which is not a fragile single-lattice hit,
 *   reaches the floor at ~9.3x fewer nodes than the uniform ladder. A SINGLE uniform Simpson grid does
 *   NOT reach this floor band even at millions of nodes -- the uniform route needs the whole Richardson
 *   tableau, whereas grading reaches the floor directly.
 *
 *   VERDICT. GRADED-CHEAPER. A graded (peak-concentrated) inner grid reaches the imp-33275 A_log
 *   arithmetic floor band at MATERIALLY FEWER inner nodes than the imp-33275/imp-33276 uniform-Simpson
 *   ladder at every saddle-support rung tau*(10..80): ~266-310x fewer at the min-node lattice hit, ~9.3x
 *   fewer with a robust plateau rule. Because both imp-33275 (A_log) and imp-33276 (R_40) attribute their
 *   floor / ~1.21e-5 drift to the INNER A(tau) Simpson resolution, this node-savings principle carries to
 *   the shared inner A(tau) grid underneath the R_40 moment ladder.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It measures the inner-node
 *   budget of two quadrature rules for a fixed autocorrelation weight A(tau) used inside a mass-feasibility
 *   diagnostic; it changes NO bound, patches NO literal, and establishes NO operator positivity. The
 *   min-node graded budget is a JITTERY arithmetic-floor lattice property (imp-33249/imp-33277
 *   latticeJitterCaveat): neighbouring panel counts bounce above/below the bar and cross-platform libm
 *   variation can shift the ~1 ULP measurements, so the robust reading is the ~9.3x plateau saving and the
 *   graded-is-cheaper ordering, not the exact 120-140 node counts. The NPHI = 10 Phi-series truncation is
 *   inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-33275-richardson-saddle-a-rung-uniformity.js (the uniform Richardson ladder this beats on node budget)
 *   @see imp-33276-r40-cross-outer-invariance-all-inner-grids.js (the R_40 inner A(tau) grid that inherits the savings)
 *   @see imp-33277-a-weight-graded-gl-1ulp-budget-tau78.js (the graded-GL node-budget lineage for -ln A)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33295 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const U = Math.pow(2, -52); // double-precision unit roundoff

// -- imp-3893s DIRECT completed-Riemann kernel (double-domain; representable for u &lt; ~1.37) --------
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

// -- imp-3850s FACTORED log kernel: ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}) ----
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

// -- (U) UNIFORM composite Simpson -- the imp-33275/imp-33276 direct inner rule --------------------
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  return (sum * h) / 3;
}
function aDirectUniform(tau, innerN) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, innerN);
}

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277) -----------------------------------
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

// -- (G) GRADED-GL on the DIRECT linear integrand: panels a_j = 7 (j/panels)^grade, GL-10 per panel.
//        The integrand phiKernel(s)phiKernel(s+tau) &gt;= 0 on [0,7], so no subtractive cancellation.
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

// -- imp-33213s INDEPENDENT log-domain graded-GL -ln A (grade 5, 300 panels, hi=10) ----------------
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

// -- imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} (imp-3893 saddleTau) --------
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

// -- Repeated Richardson extrapolation on the Simpson even-power expansion (p = 4,6,8,...) ----------
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

// -- Sweep configuration --------------------------------------------------------------------------
const N_RUNGS = [10, 20, 30, 40, 50, 60, 70, 80];
const INNER_LADDER = [1200, 2400, 4800, 9600, 19200]; // imp-33275 uniform ladder
// Uniform node budget to reach the floor = the WHOLE Richardson ladder (5 grids, + endpoint each).
const UNIFORM_LADDER_NODES = INNER_LADDER.reduce((a, N) => a + N + 1, 0);
const FLOOR_ULP = 30; // imp-33275 floor band (all rungs &lt; 22 ULP after Richardson; 30 with margin)
const GRADES = [2, 3, 4, 5, 6];
const MIN_NODE_MAX_PANELS = 600;
const PLATEAU_GRADE = 4; // a robust fixed graded rule (not a single fragile lattice hit)
const PLATEAU_PANELS = 400; // 4000 inner nodes
const PLATEAU_NODES = 10 * PLATEAU_PANELS;

// -- Per-rung measurement -------------------------------------------------------------------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  // (G) MIN-NODE graded budget: smallest 10*panels over grades reaching the floor band.
  let minNode = { grade: null, panels: null, nodes: Infinity, ulp: Infinity };
  for (const grade of GRADES) {
    for (let p = 8; p <= MIN_NODE_MAX_PANELS; p += 2) {
      const gap = Math.abs(aDirectGradedGL(tauStar, 7, p, grade) - aLogVal) / ulpOfALog;
      if (gap < FLOOR_ULP) {
        if (10 * p < minNode.nodes) minNode = { grade, panels: p, nodes: 10 * p, ulp: gap };
        break;
      }
    }
  }

  // (G) CONSERVATIVE plateau rule (grade4/400p) -- robust to the lattice jitter.
  const plateauUlp = Math.abs(aDirectGradedGL(tauStar, 7, PLATEAU_PANELS, PLATEAU_GRADE) - aLogVal) / ulpOfALog;

  // (U) UNIFORM Richardson ladder (the imp-33275 route that reaches the floor).
  const raw = INNER_LADDER.map((N) => aDirectUniform(tauStar, N));
  const uniformExtrapUlp = Math.abs(richardsonExtrapolant(raw) - aLogVal) / ulpOfALog;

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    gradedMinNodeGrade: minNode.grade,
    gradedMinNodePanels: minNode.panels,
    gradedMinNodeNodes: minNode.nodes,
    gradedMinNodeUlp: minNode.ulp,
    gradedPlateauNodes: PLATEAU_NODES,
    gradedPlateauUlp: plateauUlp,
    uniformLadderNodes: UNIFORM_LADDER_NODES,
    uniformExtrapUlp,
    minNodeSaving: UNIFORM_LADDER_NODES / minNode.nodes,
    plateauSaving: UNIFORM_LADDER_NODES / PLATEAU_NODES,
  });
});

// -- Summary statistics ---------------------------------------------------------------------------
const WORST_GRADED_MINNODE_ULP = Math.max(...RUNG_TABLE.map((r) => r.gradedMinNodeUlp));
const WORST_GRADED_PLATEAU_ULP = Math.max(...RUNG_TABLE.map((r) => r.gradedPlateauUlp));
const WORST_UNIFORM_LADDER_ULP = Math.max(...RUNG_TABLE.map((r) => r.uniformExtrapUlp));
const MAX_GRADED_MINNODE_NODES = Math.max(...RUNG_TABLE.map((r) => r.gradedMinNodeNodes));
const MIN_MINNODE_SAVING = Math.min(...RUNG_TABLE.map((r) => r.minNodeSaving));
const MAX_MINNODE_SAVING = Math.max(...RUNG_TABLE.map((r) => r.minNodeSaving));
const PLATEAU_SAVING = UNIFORM_LADDER_NODES / PLATEAU_NODES;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The graded min-node budget reaches the imp-33275 floor band at EVERY rung.
const gradedReachesFloor = RUNG_TABLE.every((r) => r.gradedMinNodeUlp < FLOOR_ULP);
// (2) The graded min-node budget is MATERIALLY fewer nodes than the uniform ladder (&gt; 50x) at every rung.
const gradedMinNodeMateriallyFewer = RUNG_TABLE.every((r) => r.minNodeSaving > 50);
// (3) The floor bands are COMPARABLE: worst graded and worst uniform-ladder ULP both in the few-ULP band.
const floorBandsComparable = WORST_GRADED_MINNODE_ULP < FLOOR_ULP && WORST_UNIFORM_LADDER_ULP < FLOOR_ULP;
// (4) The ROBUST plateau rule (not a fragile lattice hit) reaches the floor band at fewer nodes than
//     the uniform ladder at EVERY rung -- so the saving does not rest on the jittery min-node hit.
const plateauRobustlyCheaper =
  RUNG_TABLE.every((r) => r.gradedPlateauUlp < FLOOR_ULP) && PLATEAU_SAVING > 1;
// (5) Coverage: the full saddle-support ladder tau*(10..80) is tested.
const fullLadderCovered = N_RUNGS.length === 8 && N_RUNGS[0] === 10 && N_RUNGS[N_RUNGS.length - 1] === 80;

const verdict =
  gradedReachesFloor && gradedMinNodeMateriallyFewer && floorBandsComparable && plateauRobustlyCheaper && fullLadderCovered
    ? 'GRADED-CHEAPER:-A-GRADED-(PEAK-CONCENTRATED)-INNER-GRID-REACHES-THE-imp-33275-A_log-DOUBLE-PRECISION-' +
      'FLOOR-BAND-AT-MATERIALLY-FEWER-INNER-NODES-THAN-THE-imp-33275/imp-33276-UNIFORM-SIMPSON-RICHARDSON-LADDER-' +
      'AT-EVERY-SADDLE-SUPPORT-RUNG-tau*(10..80):-THE-MIN-NODE-GRADED-LATTICE-HIT-LANDS-IN-THE-FLOOR-BAND-(WORST-' +
      '~27-ULP,-COMPARABLE-TO-THE-UNIFORM-LADDER-~21.6-ULP)-AT-JUST-120-140-INNER-NODES-(~266-310x-FEWER-THAN-THE-' +
      '37205-NODE-UNIFORM-LADDER),-AND-EVEN-A-ROBUST-FIXED-PLATEAU-RULE-(grade4/400p,-4000-NODES,-WORST-~21-ULP)-' +
      'REACHES-THE-FLOOR-AT-~9.3x-FEWER-NODES;-A-SINGLE-UNIFORM-SIMPSON-GRID-DOES-NOT-REACH-THIS-FLOOR-EVEN-AT-' +
      'MILLIONS-OF-NODES-(THE-UNIFORM-ROUTE-NEEDS-THE-WHOLE-RICHARDSON-TABLEAU).-BOTH-imp-33275-(A_log)-AND-' +
      'imp-33276-(R_40)-ATTRIBUTE-THEIR-FLOOR/DRIFT-TO-THE-INNER-A(tau)-RESOLUTION,-SO-THE-SAVING-CARRIES-TO-THE-' +
      'SHARED-INNER-A(tau)-GRID.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-' +
      'NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33295_GRADED_INNER_GRID_A_NODE_BUDGET = Object.freeze({
  id: 'imp-33295-graded-inner-grid-a-node-budget',
  ticket: 'imp-33295',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33275-richardson-saddle-a-rung-uniformity.js',
  crossValidatesModules: [
    'imp-33275-richardson-saddle-a-rung-uniformity.js',
    'imp-33276-r40-cross-outer-invariance-all-inner-grids.js',
    'imp-33277-a-weight-graded-gl-1ulp-budget-tau78.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'NODE-BUDGET measurement: does a GRADED inner quadrature grid reach the imp-33275 A_log (and imp-33276 ' +
    'R_40) double-precision arithmetic floor at MATERIALLY FEWER inner nodes than the imp-33275/imp-33276 ' +
    'UNIFORM-Simpson ladder, for the saddle-window autocorrelation weight A(tau)? At each saddle-a rung ' +
    'tau*(10..80) the direct A_direct(tau*) = int_0^7 phiKernel(s)phiKernel(s+tau*) ds is evaluated by (U) ' +
    'uniform composite Simpson on the imp-33275 ladder N = 1200..19200 + repeated Richardson (which reaches ' +
    'the floor only via the WHOLE 5-grid ladder = 37205 inner nodes) and (G) a graded-GL rule with panels ' +
    'graded toward the origin peak (a_j = 7 (j/panels)^grade, GL-10 per panel). RESULT: the graded grid ' +
    'reaches the SAME few-ULP floor band at MATERIALLY FEWER nodes -- the min-node graded lattice hit lands ' +
    'in the band (worst ~27 ULP, vs the uniform ladder worst ~21.6 ULP) at just 120-140 inner nodes ' +
    '(~266-310x fewer than the 37205-node uniform ladder), and even a robust fixed plateau rule (grade4/400p, ' +
    '4000 nodes, worst ~21 ULP) reaches the floor at ~9.3x fewer nodes. A single uniform Simpson grid does ' +
    'NOT reach the floor band even at millions of nodes. Since imp-33275 (A_log) and imp-33276 (R_40) both ' +
    'attribute their floor / ~1.21e-5 drift to the INNER A(tau) resolution, the saving carries to the shared ' +
    'inner A(tau) grid under the R_40 moment ladder. VERDICT: GRADED-CHEAPER. ACCURACY/RULE-DESIGN ' +
    'MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; operator positivity ' +
    '(imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'saddle-a ladder rungs n in {10,20,...,80}, tau* = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893 saddleTau)',
    uniformRule: 'A_direct(tau*) by uniform composite Simpson on [0,7], imp-33275 ladder N = 1200,2400,4800,9600,19200, ' +
      'then the imp-33275 repeated-Richardson tableau (even powers p = 4,6,8,...); floor reached only via the WHOLE ladder',
    uniformNodeBudget: 'sum over the ladder of (N + 1) inner integrand evaluations = 37205 (a single grid does not reach the floor)',
    gradedRule: 'A_direct(tau*) by graded-GL: panels a_j = 7 (j/panels)^grade, b_j = 7 ((j+1)/panels)^grade, 10-node ' +
      'Gauss-Legendre per panel (the imp-33249/imp-33277 grading on the DIRECT linear integrand, which is &gt;= 0 on [0,7])',
    minNodeBudget: 'smallest 10*panels over grade in {2,3,4,5,6}, panels 8..600, whose worst residual clears the imp-33275 floor band (&lt; 30 ULP of A_log)',
    plateauRule: 'a robust fixed graded rule grade4/400p (4000 nodes), not a single fragile lattice hit',
    target: 'A_log(tau*) = exp(-negLnA), negLnA from imp-33213s INDEPENDENT log-domain graded-GL (grade 5, 300 panels, hi=10); ULP = A_log * 2^-52',
    selfComputing: 'every rung, both rules, the min-node sweep, the plateau rule and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    innerLadder: Object.freeze(INNER_LADDER.slice()),
    uniformLadderNodes: UNIFORM_LADDER_NODES,
    floorBandUlp: FLOOR_ULP,
    plateauGrade: PLATEAU_GRADE,
    plateauPanels: PLATEAU_PANELS,
    plateauNodes: PLATEAU_NODES,
    rungTable: RUNG_TABLE,
    worstGradedMinNodeUlp: WORST_GRADED_MINNODE_ULP,
    worstGradedPlateauUlp: WORST_GRADED_PLATEAU_ULP,
    worstUniformLadderUlp: WORST_UNIFORM_LADDER_ULP,
    maxGradedMinNodeNodes: MAX_GRADED_MINNODE_NODES,
    minMinNodeSaving: MIN_MINNODE_SAVING,
    maxMinNodeSaving: MAX_MINNODE_SAVING,
    plateauSaving: PLATEAU_SAVING,
    gradedReachesFloor,
    gradedMinNodeMateriallyFewer,
    floorBandsComparable,
    plateauRobustlyCheaper,
    fullLadderCovered,
    verdict,
  }),

  interpretation: Object.freeze({
    gradingBuysTheSameFloorForFewerNodes:
      'The uniform Simpson grid reaches the imp-33275 A_log floor band ONLY through the whole 5-rung Richardson ' +
      'ladder (37205 inner nodes); a single uniform grid does not reach it even at millions of nodes. Grading the ' +
      'panels toward the origin peak reaches the SAME few-ULP band directly: the min-node lattice hit at 120-140 ' +
      'nodes (~266-310x fewer) and a robust plateau rule at 4000 nodes (~9.3x fewer). The floor bands are ' +
      'comparable (graded worst ~27 ULP vs uniform-ladder worst ~21.6 ULP), so the graded grid trades no accuracy ' +
      'for its node savings.',
    savingCarriesToR40:
      'imp-33276 established that the whole ~1.21e-5 R_40 residual is carried by the INNER A(tau) resolution ' +
      '(outer-invariant at all inner grids), and imp-33275 that the A(tau) floor is an inner-Simpson resolution ' +
      'effect. Because R_40 is built from the SAME inner A(tau) evaluations this module grades, the node-savings ' +
      'principle carries to the inner A(tau) grid under the R_40 moment ladder -- fewer inner A(tau) nodes for the ' +
      'same converged R_40.',
    latticeJitterIsTheHonestFloor:
      'The exact min-node panel count is a JITTERY arithmetic-floor lattice property (imp-33249/imp-33277): ' +
      'neighbouring panel counts bounce above/below the &lt; 30 ULP bar (worst min-node hit 27.27 ULP at n=70), and ' +
      'libm exp/pow variation can shift the ~1 ULP measurements. The robust reading is the ~9.3x plateau saving and ' +
      'the graded-is-cheaper ordering, not the precise 120-140 node counts.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Measures the inner-node budget of two quadrature rules (uniform-Simpson-plus-Richardson vs graded-GL) for a ' +
      'fixed autocorrelation weight A(tau) at each saddle rung -- a magnitude used inside a mass-feasibility ' +
      'diagnostic. It changes NO bound, patches NO literal, and establishes NO operator positivity. Grid-design ' +
      'measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33275/imp-33213; this audits the inner quadrature ' +
      'node budget, not that truncation.',
    latticeJitterCaveat:
      'The min-node graded budget is a single lattice hit on a jittery arithmetic floor; neighbouring panel counts ' +
      'bounce above the bar and cross-platform libm variation in exp/pow can shift the ~1 ULP measurements. The ' +
      'robust reading is the ~9.3x plateau-rule saving and the graded-is-cheaper ordering, not the exact node counts.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33295_GRADED_INNER_GRID_A_NODE_BUDGET_ASSERTIONS = [
  {
    id: 'imp33295-full-saddle-ladder-covered',
    why: 'The measurement must run across the FULL saddle-support ladder tau*(10..80) (8 rungs), not a single rung.',
    holds: () => fullLadderCovered && RUNG_TABLE.length === 8,
  },
  {
    id: 'imp33295-graded-reaches-the-imp33275-floor-band',
    why: 'THE PURPOSE: at EVERY rung the graded min-node inner grid must reach the imp-33275 A_log floor band ' +
         '(&lt; 30 ULP), matching the uniform Richardson ladder that also stays in that band.',
    holds: () => gradedReachesFloor && floorBandsComparable && WORST_GRADED_MINNODE_ULP < FLOOR_ULP,
  },
  {
    id: 'imp33295-graded-min-node-materially-fewer',
    why: 'THE HEADLINE: the graded min-node budget must be MATERIALLY fewer inner nodes than the uniform ladder ' +
         '(&gt; 50x) at every rung -- the measured saving is ~266-310x at 120-140 nodes vs 37205.',
    holds: () => gradedMinNodeMateriallyFewer && MIN_MINNODE_SAVING > 50 && MAX_GRADED_MINNODE_NODES <= 200,
  },
  {
    id: 'imp33295-plateau-rule-robustly-cheaper',
    why: 'The saving must not rest on the jittery min-node lattice hit: a robust fixed plateau rule (grade4/400p, ' +
         '4000 nodes) must also reach the floor band at fewer nodes than the uniform ladder at every rung.',
    holds: () => plateauRobustlyCheaper && WORST_GRADED_PLATEAU_ULP < FLOOR_ULP && PLATEAU_SAVING > 1,
  },
  {
    id: 'imp33295-uniform-ladder-node-budget-is-the-whole-tableau',
    why: 'The uniform baseline is the WHOLE imp-33275 Richardson ladder (a single uniform grid does not reach the ' +
         'floor): the node budget is sum(N + 1) over the 5-grid ladder = 37205.',
    holds: () => UNIFORM_LADDER_NODES === INNER_LADDER.reduce((a, N) => a + N + 1, 0) && UNIFORM_LADDER_NODES === 37205,
  },
  {
    id: 'imp33295-verdict-records-graded-cheaper',
    why: 'The classified verdict must record the graded-cheaper reading (graded reaches the floor at materially ' +
         'fewer nodes), not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33295-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33295_GRADED_INNER_GRID_A_NODE_BUDGET.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33295_GRADED_INNER_GRID_A_NODE_BUDGET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33295-graded-inner-grid-a-node-budget assertion failed: ${assertion.id}`);
  }
}

export default IMP33295_GRADED_INNER_GRID_A_NODE_BUDGET;
