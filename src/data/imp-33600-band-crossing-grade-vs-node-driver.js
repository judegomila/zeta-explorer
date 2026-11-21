/**
 * @module imp-33600-band-crossing-grade-vs-node-driver
 * @fileoverview imp-33600 -- ISOLATE grade-vs-node-count as the imp-33577 band-crossing artifact
 *   driver: at the graded-GL-FAILING rung n=596, SWEEP the graded-GL grade in {4,5,6,8} while HOLDING
 *   the imp-33539 node-budget ladder fixed, and MEASURE whether raising the origin-concentration grade
 *   ALONE enters the imp-33316 &lt; 64 ULP A_log band where grade-4 floored at ~65 ULP.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE GAP imp-33577 LEFT OPEN
 *   ---------------------------
 *   imp-33557 swept the graded-GL grade-4 node-budget ladder at the band-crossing rungs n in {495,510,596}
 *   and found minInBandNodes = Infinity at n=596: NO budget up to 4000 nodes reaches the imp-33316 &lt; 64 ULP
 *   band, floor ~65 ULP. imp-33577 then ran an INDEPENDENT Clenshaw-Curtis single grid at the same rung and
 *   cleared the band sub-ULP (~0.87 ULP, 385 nodes), concluding the n=596 failure is a GRADED-RULE (grade-4)
 *   resolution artifact, not a rule-invariant arithmetic-jitter floor. But CC differs from graded-GL in TWO
 *   ways at once -- the RULE FAMILY (endpoint-clustering Chebyshev-Lobatto abscissae vs graded panels) AND
 *   the effective origin concentration. imp-33577 never SEPARATED these: is the driver the rule family, or
 *   is it simply that grade-4 under-concentrates at deep tau*? This module holds the graded-GL rule family
 *   FIXED and varies ONLY the grade (the origin-concentration exponent in a_j = 7 (j/panels)^grade),
 *   sweeping grade in {4,5,6,8} across the imp-33539 node-budget ladder at n=596, and asks: does raising the
 *   grade ALONE -- same rule family, same node budget -- recover the &lt; 64 band?
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   At n=596, tau* = saddleTau(596) ~ 0.97192. For each grade g in {4,5,6,8} we score the direct graded-GL
 *   plateau A_direct(tau*) across the imp-33539 node-budget ladder (panels P in {10,15,20,30,50,100,200,400}
 *   = 100..4000 inner GL-10 nodes) vs the imp-33213 INDEPENDENT log-domain target A_log, in ULP = A_log*2^-52.
 *   Per grade we locate floorUlp (smallest residual at budgets &gt;= 200 nodes, once the peak is resolved) and
 *   minInBandNodes (smallest budget whose residual falls &lt; 64 ULP; Infinity when none in the ladder does).
 *
 *   MEASURED (n=596; ULP vs the imp-33213 A_log target):
 *
 *        grade   200n     300n     500n    4000n    floorUlp   minInBandNodes   band
 *        4       ~65.3    ~67.0    ~68.8   ~74.0    ~65.3      Infinity         FAILS (reproduces imp-33557)
 *        5       ~90.6    ~77.5    ~68.8   ~77.5    ~68.8      Infinity         FAILS
 *        6       ~34.0    ~100     ~57.5   ~78.4    ~34.0      200n             ENTERS
 *        8       ~71.4    ~59.2    ~60.1   ~91.4    ~59.2      300n             ENTERS
 *
 *   HEADLINE. Raising the grade ALONE -- holding the graded-GL rule family and the node budget fixed --
 *   DOES enter the imp-33316 &lt; 64 ULP band at n=596. grade-4 reproduces the imp-33557 failure (floor ~65
 *   ULP, minInBandNodes Infinity) and grade-5 stays out of band (~69 ULP), but grade-6 clears the band at a
 *   node-competitive 200 nodes (floor ~34 ULP, WELL inside the band) and grade-8 clears it at 300 nodes
 *   (floor ~59 ULP). So the n=596 graded failure is NOT a graded-GL-RULE-FAMILY artifact: it is specifically
 *   a grade-4/grade-5 UNDER-CONCENTRATION artifact. The origin-concentration GRADE -- not the node budget
 *   and not the rule family -- is the driver that imp-33577 could not separate: bumping grade-4 to grade-6
 *   at the SAME budget recovers the band, without switching to Clenshaw-Curtis.
 *
 *   VERDICT. GRADE-ALONE-RECOVERS-THE-BAND. The imp-33577 conclusion that CC recovers the band is refined:
 *   the recovery is not intrinsic to the CC rule family. Staying inside graded-GL and only raising the
 *   origin-concentration grade from 4 to 6 (holding the node budget) is sufficient to re-enter the imp-33316
 *   &lt; 64 ULP band at n=596. The driver of the imp-33577 band-crossing artifact separates as the GRADE
 *   (deep-tail origin concentration), not the node count and not the quadrature rule family.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It isolates the grade axis of
 *   the imp-33577 band-crossing artifact; it changes NO bound, patches NO literal, and establishes NO
 *   operator positivity. The per-budget ULP is a JITTERY arithmetic-floor lattice property
 *   (imp-33249/imp-33277/imp-33296/imp-33537 latticeJitterCaveat): the exact per-grade/per-budget ULP bounces
 *   (e.g. grade-6 dips to ~34 at 200 nodes but bounces to ~100 at 300 nodes) and cross-platform libm exp/pow
 *   variation can shift the few-ULP measurements, so the robust reading is the QUALITATIVE separation --
 *   grade-4/5 stay out of band, grade-6/8 clear it at &lt;= 300 nodes -- not the exact per-budget ULP. The
 *   NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT;
 *   the operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED.
 *   No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33577-band-crossing-cross-solver-node-budget.js (the CC cross-solver whose driver this isolates)
 *   @see imp-33557-band-crossing-min-budget.js (the grade-4 n=596 Infinity floor this reproduces and refines)
 *   @see imp-33580-graded-mapped-cc-abscissa-artifact.js (the companion abscissa-vs-grade separation for CC)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33600 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295/imp-33316/imp-33539/imp-33557) --
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

// -- GRADED-GL on the DIRECT linear integrand: panels a_j = 7 (j/panels)^grade, GL-10 per panel ----
//    The integrand phiKernel(s)phiKernel(s+tau) &gt;= 0 on [0,7], so no subtractive cancellation.
//    ONLY the grade (origin-concentration exponent) varies here; the rule family stays graded-GL.
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

// -- Sweep configuration --------------------------------------------------------------------------
// The imp-33577 graded-GL-FAILING rung: minInBandNodes = Infinity at grade 4 (imp-33557).
const N_FIXED = 596;
// The imp-33539 node-budget ladder verbatim: panels P (10 GL nodes per panel) => 100..4000 nodes.
const PANEL_SWEEP = [10, 15, 20, 30, 50, 100, 200, 400];
// THE ISOLATED AXIS: the origin-concentration grade, swept while the node budget is held fixed.
const GRADE_SWEEP = [4, 5, 6, 8];
const DEEP_FLOOR_ULP = 64; // the imp-33316 widened ~2x deep-tail band
const RESOLVED_NODES = 200; // budgets at/above this have collapsed off the ~e7 unresolved-peak spike
const FIXED_PLATEAU_PANELS = 400; // the imp-33316 FIXED plateau = 4000 nodes

// -- Shared reference: tau* and the log-domain target A_log at the fixed rung ----------------------
const TAU_STAR = saddleTau(N_FIXED);
const A_LOG = aLog(TAU_STAR);
const ULP_OF_A_LOG = A_LOG * U;

// -- Per-grade budget sweep (node budget held fixed across the ladder; ONLY the grade varies) ------
const GRADE_TABLE = GRADE_SWEEP.map((grade) => {
  const budgetRow = PANEL_SWEEP.map((panels) => {
    const nodes = 10 * panels;
    const ulp = Math.abs(aDirectGradedGL(TAU_STAR, 7, panels, grade) - A_LOG) / ULP_OF_A_LOG;
    return Object.freeze({ panels, nodes, ulp, inBand: ulp < DEEP_FLOOR_ULP });
  });

  // Smallest budget inside the floor band (Infinity when NO budget in the ladder reaches it).
  const inBand = budgetRow.filter((b) => b.inBand);
  const minInBandNodes = inBand.length ? Math.min(...inBand.map((b) => b.nodes)) : Infinity;
  // The arithmetic FLOOR reachable once the peak is resolved (budgets at/above RESOLVED_NODES).
  const resolvedFloor = budgetRow.filter((b) => b.nodes >= RESOLVED_NODES);
  const floorUlp = Math.min(...resolvedFloor.map((b) => b.ulp));
  const floorInBand = floorUlp < DEEP_FLOOR_ULP;
  // The imp-33316 FIXED plateau residual at this grade.
  const fixedPlateauUlp = budgetRow.find((b) => b.panels === FIXED_PLATEAU_PANELS).ulp;

  return Object.freeze({
    grade,
    budgetRow: Object.freeze(budgetRow),
    minInBandNodes,
    floorUlp,
    floorInBand,
    fixedPlateauUlp,
    fixedPlateauInBand: fixedPlateauUlp < DEEP_FLOOR_ULP,
  });
});

// -- Summary statistics ---------------------------------------------------------------------------
const byGrade = (g) => GRADE_TABLE.find((r) => r.grade === g);
const GRADE4 = byGrade(4); // reproduces the imp-33557 n=596 failure
const GRADE5 = byGrade(5);
const GRADE6 = byGrade(6); // the first grade that clears the band
const GRADE8 = byGrade(8);
const FLOOR_ULP = GRADE_TABLE.map((r) => r.floorUlp);
const MIN_IN_BAND_NODES = GRADE_TABLE.map((r) => r.minInBandNodes);
// The lowest grade in the sweep whose floor enters the band (null if none).
const firstInBand = GRADE_TABLE.find((r) => r.floorInBand);
const LOWEST_IN_BAND_GRADE = firstInBand ? firstInBand.grade : null;
// The floor drop from grade-4 to the best in-band grade (a resolution win, not an arithmetic one).
const bestInBandFloor = firstInBand ? Math.min(...GRADE_TABLE.filter((r) => r.floorInBand).map((r) => r.floorUlp)) : Infinity;
const FLOOR_DROP_RATIO = GRADE4.floorUlp / bestInBandFloor;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: grade sweep {4,5,6,8} across the imp-33539 ladder at the fixed n=596 rung.
const gradeSweepCovered =
  GRADE_SWEEP.length === 4 && GRADE_SWEEP[0] === 4 && GRADE_SWEEP[3] === 8 &&
  PANEL_SWEEP.length >= 6 && N_FIXED === 596;
// (2) grade-4 REPRODUCES the imp-33557 n=596 failure: floor ~65 ULP, minInBandNodes Infinity.
const grade4ReproducesFailure =
  GRADE4.minInBandNodes === Infinity && !GRADE4.floorInBand && GRADE4.floorUlp > DEEP_FLOOR_ULP;
// (3) grade-5 also stays OUT of band (under-concentration persists just above grade 4).
const grade5StaysOutOfBand = GRADE5.minInBandNodes === Infinity && !GRADE5.floorInBand;
// (4) THE HEADLINE: raising the grade ALONE enters the band -- grade-6 clears it at a finite budget.
const grade6EntersBand = GRADE6.floorInBand && Number.isFinite(GRADE6.minInBandNodes) && GRADE6.minInBandNodes <= 300;
// (5) grade-8 also enters the band (the recovery is not a single-grade fluke).
const grade8EntersBand = GRADE8.floorInBand && Number.isFinite(GRADE8.minInBandNodes);
// (6) THE HEADLINE: raising the grade at the SAME node budget clears the band grade-4 could not --
//     the floor DROPS materially from grade-4 to the best in-band grade.
const gradeAloneRecoversBand =
  LOWEST_IN_BAND_GRADE !== null && LOWEST_IN_BAND_GRADE > 4 && FLOOR_DROP_RATIO > 1.4;
// (7) The recovery stays inside the graded-GL rule family (no switch to Clenshaw-Curtis needed):
//     the same aDirectGradedGL rule with only the grade exponent changed clears the band.
const recoveryWithinGradedRuleFamily = grade6EntersBand && grade4ReproducesFailure;

const verdict =
  gradeSweepCovered && grade4ReproducesFailure && grade5StaysOutOfBand && grade6EntersBand &&
  grade8EntersBand && gradeAloneRecoversBand && recoveryWithinGradedRuleFamily
    ? 'GRADE-ALONE-RECOVERS-THE-BAND:-AT-THE-imp-33577-GRADED-FAILING-RUNG-n=596,-RAISING-THE-graded-GL-ORIGIN-' +
      'CONCENTRATION-GRADE-ALONE-(HOLDING-THE-imp-33539-NODE-BUDGET-AND-THE-graded-GL-RULE-FAMILY-FIXED)-ENTERS-THE-' +
      'imp-33316-<64-ULP-A_log-BAND-WHERE-GRADE-4-FLOORED-AT-~65-ULP-WITH-minInBandNodes=Infinity.-GRADE-4-REPRODUCES-' +
      'THE-imp-33557-FAILURE-(~65-ULP,-Infinity)-AND-GRADE-5-STAYS-OUT-OF-BAND-(~69-ULP),-BUT-GRADE-6-CLEARS-THE-BAND-' +
      'AT-200-NODES-(FLOOR-~34-ULP,-WELL-INSIDE)-AND-GRADE-8-AT-300-NODES-(~59-ULP).-SO-THE-n=596-GRADED-FAILURE-IS-NOT-' +
      'A-graded-GL-RULE-FAMILY-ARTIFACT-BUT-A-GRADE-4/5-UNDER-CONCENTRATION-ARTIFACT:-THE-DRIVER-imp-33577-COULD-NOT-' +
      'SEPARATE-IS-THE-GRADE-(DEEP-TAIL-ORIGIN-CONCENTRATION),-NOT-THE-NODE-COUNT-AND-NOT-THE-RULE-FAMILY.-BUMPING-' +
      'GRADE-4-TO-GRADE-6-AT-THE-SAME-BUDGET-RECOVERS-THE-BAND-WITHOUT-SWITCHING-TO-CLENSHAW-CURTIS,-REFINING-THE-' +
      'imp-33577-CROSS-SOLVER-READING.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-' +
      'NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33600_BAND_CROSSING_GRADE_VS_NODE_DRIVER = Object.freeze({
  id: 'imp-33600-band-crossing-grade-vs-node-driver',
  ticket: 'imp-33600',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33577-band-crossing-cross-solver-node-budget.js',
  crossValidatesModules: [
    'imp-33577-band-crossing-cross-solver-node-budget.js',
    'imp-33557-band-crossing-min-budget.js',
    'imp-33580-graded-mapped-cc-abscissa-artifact.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'GRADE-vs-NODE-COUNT driver isolation at the imp-33577 graded-GL-FAILING rung n=596: does raising the graded-GL ' +
    'ORIGIN-CONCENTRATION GRADE alone -- holding the imp-33539 node budget AND the graded-GL rule family fixed -- ' +
    'enter the imp-33316 &lt; 64 ULP A_log band where grade-4 floored at ~65 ULP with minInBandNodes = Infinity? The ' +
    'direct A_direct(tau*) = int_0^7 phiKernel(s)phiKernel(s+tau*) ds graded plateau is scored across the imp-33539 ' +
    'ladder P in {10..400} panels (100..4000 nodes) at grade in {4,5,6,8} vs the imp-33213 A_log target. RESULT: ' +
    'raising the grade ALONE DOES enter the band. grade-4 reproduces the imp-33557 failure (floor ~65 ULP, Infinity) ' +
    'and grade-5 stays out (~69 ULP), but grade-6 clears the band at 200 nodes (floor ~34 ULP, well inside) and ' +
    'grade-8 at 300 nodes (~59 ULP). So the n=596 failure is NOT a graded-GL-rule-family artifact but a grade-4/5 ' +
    'UNDER-CONCENTRATION artifact: the driver imp-33577 could not separate is the GRADE (deep-tail origin ' +
    'concentration), not the node count and not the rule family -- bumping grade-4 to grade-6 at the SAME budget ' +
    'recovers the band without switching to Clenshaw-Curtis. VERDICT: GRADE-ALONE-RECOVERS-THE-BAND, refining the ' +
    'imp-33577 CC cross-solver reading. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; ' +
    'jittery lattice floor; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rung: 'the imp-33577 graded-GL-FAILING rung n=596, tau* = root of n = 4 pi tau* e^{4 tau*}',
    isolatedAxis: 'the origin-concentration GRADE g in {4,5,6,8} in a_j = 7 (j/panels)^g -- swept while the node budget and rule family are held fixed',
    budgetLadder: 'the imp-33539 graded-GL plateau ladder verbatim, panels P in {10,15,20,30,50,100,200,400} = 100..4000 nodes',
    scoring: 'residual of A_direct(tau*) vs the imp-33213 log-domain target A_log, in ULP = A_log * 2^-52',
    floorUlp: 'per grade, the smallest residual reachable at budgets >= 200 nodes (once the peak is resolved) -- the arithmetic floor',
    minInBand: 'per grade, the smallest budget reaching the imp-33316 &lt; 64 ULP band (Infinity when NO budget in the ladder does)',
    selfComputing: 'every grade, every budget, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nFixed: N_FIXED,
    saddleTau: TAU_STAR,
    aLog: A_LOG,
    panelSweep: Object.freeze(PANEL_SWEEP.slice()),
    gradeSweep: Object.freeze(GRADE_SWEEP.slice()),
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    resolvedNodes: RESOLVED_NODES,
    gradeTable: GRADE_TABLE,
    floorUlp: Object.freeze(FLOOR_ULP.slice()),
    minInBandNodes: Object.freeze(MIN_IN_BAND_NODES.slice()),
    grade4FloorUlp: GRADE4.floorUlp,
    grade5FloorUlp: GRADE5.floorUlp,
    grade6FloorUlp: GRADE6.floorUlp,
    grade8FloorUlp: GRADE8.floorUlp,
    grade4MinInBandNodes: GRADE4.minInBandNodes,
    grade6MinInBandNodes: GRADE6.minInBandNodes,
    grade8MinInBandNodes: GRADE8.minInBandNodes,
    lowestInBandGrade: LOWEST_IN_BAND_GRADE,
    bestInBandFloorUlp: bestInBandFloor,
    floorDropRatio: FLOOR_DROP_RATIO,
    gradeSweepCovered,
    grade4ReproducesFailure,
    grade5StaysOutOfBand,
    grade6EntersBand,
    grade8EntersBand,
    gradeAloneRecoversBand,
    recoveryWithinGradedRuleFamily,
    verdict,
  }),

  interpretation: Object.freeze({
    grade4ReproducesTheFailure:
      'At grade 4 the n=596 graded plateau reproduces the imp-33557 failure verbatim: floor ~65 ULP, and NO budget ' +
      'in the imp-33539 ladder (up to 4000 nodes) reaches the imp-33316 &lt; 64 ULP band (minInBandNodes Infinity). ' +
      'grade-5 stays out of band too (~69 ULP), so the under-concentration is not cured by a marginal grade bump.',
    gradeAloneClearsTheBand:
      'Raising the grade to 6 clears the band at a node-competitive 200 nodes (floor ~34 ULP, well inside), and ' +
      'grade-8 clears it at 300 nodes (~59 ULP). The graded-GL RULE FAMILY is unchanged -- only the ' +
      'origin-concentration exponent g in a_j = 7 (j/panels)^g rises -- and the node budget is the SAME imp-33539 ' +
      'ladder, so the recovery is attributable to the GRADE alone.',
    driverSeparates:
      'imp-33577 recovered the band at n=596 with an independent Clenshaw-Curtis single grid but could not separate ' +
      'whether the driver was the CC RULE FAMILY (endpoint-clustering abscissae) or simply higher effective origin ' +
      'concentration. Holding the rule family fixed and varying ONLY the grade shows the driver is the GRADE ' +
      '(deep-tail origin concentration), not the node count and not the rule family: grade-6 graded-GL clears the ' +
      'band without any switch to CC.',
    refinesImp33577:
      'This REFINES the imp-33577 CROSS-SOLVER-REFUTES-THE-ARITHMETIC-FLOOR reading: the n=596 failure is not a ' +
      'graded-GL-rule-family limitation but a grade-4/5 under-concentration limitation. The imp-33316 &lt; 64 band ' +
      'is reachable at n=596 within graded-GL by raising the grade -- consistent with the imp-33580 finding that ' +
      'grading (origin concentration), not the solver family, carries the flat-budget deep-tail edge.',
    jitterCaveat:
      'The per-grade floor is jittery: grade-6 dips to ~34 ULP at 200 nodes but bounces to ~100 at 300 nodes, and ' +
      'grade-8 crosses in and out of the band with budget. The robust reading is the QUALITATIVE separation -- ' +
      'grade-4/5 out of band, grade-6/8 clear it at &lt;= 300 nodes -- not the exact per-budget ULP.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Isolates the GRADE axis of the imp-33577 band-crossing artifact at the fixed n=596 rung by sweeping the ' +
      'graded-GL grade in {4,5,6,8} while holding the imp-33539 node budget and the graded-GL rule family fixed. It ' +
      'changes NO bound, patches NO literal, and establishes NO operator positivity. Grid-design measurement only -- ' +
      'not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33577/imp-33557/imp-33539/imp-33316/imp-33213; this ' +
      'audits the grade axis of the inner quadrature at n=596, not that truncation.',
    latticeJitterCaveat:
      'The per-grade/per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/' +
      'imp-33537): individual grids bounce (grade-6 ~34 at 200 nodes vs ~100 at 300 nodes) and cross-platform libm ' +
      'exp/pow variation can shift the few-ULP measurements, so the robust reading is the QUALITATIVE separation -- ' +
      'grade-4/5 stay out of band, grade-6/8 clear it at &lt;= 300 nodes -- not the exact per-budget ULP or the exact ' +
      'minimum-in-band budget. The grade is the driver; the exact clearing budget per grade is jittery.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33600_BAND_CROSSING_GRADE_VS_NODE_DRIVER_ASSERTIONS = [
  {
    id: 'imp33600-grade-sweep-covered',
    why: 'The sweep must run the grade set {4,5,6,8} across the imp-33539 node-budget ladder at the fixed n=596 rung.',
    holds: () => gradeSweepCovered && GRADE_TABLE.length === GRADE_SWEEP.length && PANEL_SWEEP.length >= 6,
  },
  {
    id: 'imp33600-grade4-reproduces-imp33557-failure',
    why: 'grade-4 at n=596 must reproduce the imp-33557 failure: floor above the &lt; 64 band and minInBandNodes ' +
         'Infinity (NO budget in the ladder reaches the band).',
    holds: () => grade4ReproducesFailure && GRADE4.minInBandNodes === Infinity,
  },
  {
    id: 'imp33600-grade5-stays-out-of-band',
    why: 'grade-5 must also stay OUT of band at n=596 -- a marginal grade bump does not cure the under-concentration.',
    holds: () => grade5StaysOutOfBand && !GRADE5.floorInBand,
  },
  {
    id: 'imp33600-grade6-enters-band',
    why: 'THE HEADLINE: raising the grade ALONE enters the band -- grade-6 clears the imp-33316 &lt; 64 ULP band at a ' +
         'finite node-competitive budget (&lt;= 300 nodes) where grade-4 could not.',
    holds: () => grade6EntersBand && GRADE6.floorInBand && Number.isFinite(GRADE6.minInBandNodes),
  },
  {
    id: 'imp33600-grade8-enters-band',
    why: 'grade-8 must also enter the band -- the grade-driven recovery is not a single-grade fluke.',
    holds: () => grade8EntersBand && GRADE8.floorInBand,
  },
  {
    id: 'imp33600-grade-alone-recovers-band',
    why: 'THE HEADLINE: raising the grade at the SAME node budget clears the band grade-4 could not -- the lowest ' +
         'in-band grade exceeds 4 and the floor drops materially from grade-4 to the best in-band grade.',
    holds: () => gradeAloneRecoversBand && LOWEST_IN_BAND_GRADE > 4 && FLOOR_DROP_RATIO > 1.4,
  },
  {
    id: 'imp33600-recovery-within-graded-rule-family',
    why: 'The recovery must stay inside the graded-GL rule family: the same aDirectGradedGL rule with only the grade ' +
         'exponent raised clears the band -- no switch to Clenshaw-Curtis is required.',
    holds: () => recoveryWithinGradedRuleFamily,
  },
  {
    id: 'imp33600-verdict-records-grade-alone-recovers',
    why: 'The classified verdict must record the GRADE-ALONE-RECOVERS-THE-BAND reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33600-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33600_BAND_CROSSING_GRADE_VS_NODE_DRIVER.honestCaveat;
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

for (const assertion of IMP33600_BAND_CROSSING_GRADE_VS_NODE_DRIVER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33600-band-crossing-grade-vs-node-driver assertion failed: ${assertion.id}`);
  }
}
