/**
 * @module imp-33539-graded-plateau-deeper-tail-min-budget
 * @fileoverview imp-33539 -- ASSESS whether the imp-33316 ~9.3x graded-vs-uniform cost ratio HOLDS
 *   at the deeper deep-tail rungs n in {350,375,400} as the saddle peak sharpens further, or whether
 *   the graded plateau NODE BUDGET must GROW to keep resolving the peak.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE GAP imp-33316 LEFT OPEN
 *   ---------------------------
 *   imp-33316 carried the imp-33295 CONSERVATIVE graded plateau rule (grade 4, 400 panels = 4000
 *   inner Gauss-Legendre nodes) and the 37205-node uniform Richardson ladder into the deep saddle
 *   tail n in {90..500}, and reported PLATEAU-HOLDS / UNIFORM-FAILS: the FIXED 4000-node plateau
 *   stays inside the imp-33275 A_log floor band while the uniform ladder diverges. But imp-33316
 *   held the plateau budget FIXED at 4000 nodes -- it never measured the MINIMUM graded budget the
 *   floor band actually requires, so it could not say whether the ~9.3x nominal ratio is a genuine
 *   FIXED-budget win or whether the required budget silently climbs as the peak sharpens. This module
 *   SWEEPS the graded plateau node budget at the deeper rungs n in {350,375,400} and locates, per
 *   rung, the smallest budget that reaches the floor band -- i.e. whether that minimum GROWS with n.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For each deeper deep-tail rung n in {350,375,400} we take tau* = saddleTau(n) and score the
 *   direct graded-GL plateau A_direct(tau*) at a ladder of node budgets (grade 4, panels
 *   P in {10,15,20,30,50,100,200,400} = 100..4000 inner nodes), reporting the residual vs the
 *   imp-33213 INDEPENDENT log-domain target A_log in ULP = A_log * 2^-52. Per rung we then locate:
 *     - minInBandNodes: the smallest budget whose residual falls inside the imp-33316 widened
 *       deep-tail band (&lt; 64 ULP), and
 *     - breakThresholdNodes: the largest budget still OUTSIDE that band (the resolution wall below
 *       which the graded rule cannot yet track the peak).
 *
 *   MEASURED (grade 4; ULP vs the imp-33213 A_log target):
 *
 *        n    tau*       100n       150n     200n    ...   4000n(fixed)   minInBand   breakWall
 *        350  0.86732    ~2.1e6     ~771     27.8    ...   20.2 ULP        200n        150n
 *        375  0.88073    ~3.6e6     ~778     35.7    ...   30.4 ULP        200n        150n
 *        400  0.89331    ~5.7e6     ~862     27.8    ...   20.0 ULP        200n        150n
 *
 *   HEADLINE. The graded plateau MINIMUM node budget is FLAT at ~200 nodes across all three deeper
 *   rungs n in {350,375,400} -- it does NOT grow as the saddle peak sharpens. The resolution wall is
 *   equally flat: at 150 nodes all three rungs sit at ~800 ULP (out of band) and collapse to
 *   ~2e6..6e6 ULP at 100 nodes, then every rung snaps into the band at 200 nodes. So the imp-33316
 *   FIXED 4000-node plateau carries ~20x headroom over the true ~200-node minimum at every deeper
 *   rung, and its ~9.3x nominal graded-vs-uniform ratio (37205 / 4000) is a GENUINE fixed-budget win
 *   -- indeed the true minimum-budget saving is ~186x (37205 / 200), so the ~9.3x conservative ratio
 *   UNDERSTATES the win rather than needing to climb. The graded panels a_j = 7 (j/panels)^4
 *   auto-concentrate toward the origin peak, so the same node count resolves an ever-sharper saddle
 *   without adding nodes -- exactly the opposite of the uniform ladder, whose fixed grid diverges
 *   (imp-33316).
 *
 *   VERDICT. FIXED-BUDGET-WIN-HOLDS. The required graded plateau node budget is FLAT (~200 nodes)
 *   across the deeper deep-tail rungs n in {350,375,400}; it does not grow as the peak sharpens, so
 *   the imp-33316 ~9.3x graded-vs-uniform ratio persists as a fixed-budget win with ~20x headroom.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It extends the
 *   imp-33316 fixed-budget deep-tail measurement into a budget SWEEP at the deeper rungs; it changes
 *   NO bound, patches NO literal, and establishes NO operator positivity. The worst-window ULP is a
 *   JITTERY arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296 latticeJitterCaveat):
 *   the exact per-budget ULP bounces, so the robust reading is the FLAT ~200-node minimum and the
 *   flat resolution wall, not the exact per-budget ULP. imp-33537 showed the imp-33316 constant
 *   &lt; 64 ULP band is a coarse-grid artifact that the fixed plateau CROSSES at deeper rungs (n ~ 510,
 *   596); the deeper rungs measured here (n in {350,375,400}) sit firmly inside the band, so the
 *   minimum-budget reading is unaffected, but the &lt; 64 band is NOT claimed to hold at every deep
 *   rung. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the fixed-budget deep-tail measurement this sweeps)
 *   @see imp-33537-deep-tail-plateau-spike-recurrence.js (the dense scan that bounds the &lt; 64 band validity)
 *   @see imp-33295-graded-inner-grid-a-node-budget.js (the shallow-rung graded-vs-uniform node budget)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33539 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295/imp-33316) ----------------
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

// -- Sweep configuration --------------------------------------------------------------------------
// DEEPER deep-tail rungs the ticket targets (n ~ 350..400), past the imp-33316 tabled shallow tail.
const N_RUNGS = [350, 375, 400];
// Graded plateau node-budget ladder: panels P (grade 4), 10 GL nodes per panel => 100..4000 nodes.
const PANEL_SWEEP = [10, 15, 20, 30, 50, 100, 200, 400];
const GRADE = 4; // the imp-33295/imp-33316 robust fixed graded rule
const DEEP_FLOOR_ULP = 64; // the imp-33316 widened ~2x deep-tail band
const FIXED_PLATEAU_PANELS = 400; // the imp-33316 FIXED plateau = 4000 nodes
const FIXED_PLATEAU_NODES = 10 * FIXED_PLATEAU_PANELS;
const UNIFORM_LADDER_NODES = 37205; // the imp-33275 uniform Richardson ladder (imp-33316)
const NOMINAL_SAVING = UNIFORM_LADDER_NODES / FIXED_PLATEAU_NODES; // 9.30125 nominal (imp-33316)

// -- Per-rung budget sweep ------------------------------------------------------------------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  const budgetRow = PANEL_SWEEP.map((panels) => {
    const nodes = 10 * panels;
    const ulp = Math.abs(aDirectGradedGL(tauStar, 7, panels, GRADE) - aLogVal) / ulpOfALog;
    return Object.freeze({ panels, nodes, ulp, inBand: ulp < DEEP_FLOOR_ULP });
  });

  // Smallest budget inside the floor band (ascending node order); the true minimum this rung needs.
  const inBand = budgetRow.filter((b) => b.inBand);
  const minInBandNodes = inBand.length ? Math.min(...inBand.map((b) => b.nodes)) : Infinity;
  // Largest budget still OUTSIDE the band (the resolution wall below the minimum).
  const outBand = budgetRow.filter((b) => !b.inBand);
  const breakThresholdNodes = outBand.length ? Math.max(...outBand.map((b) => b.nodes)) : 0;
  // The imp-33316 FIXED plateau residual at this deeper rung (cross-check of imp-33316 ~20 ULP).
  const fixedPlateauUlp = budgetRow.find((b) => b.panels === FIXED_PLATEAU_PANELS).ulp;

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    budgetRow: Object.freeze(budgetRow),
    minInBandNodes,
    breakThresholdNodes,
    fixedPlateauUlp,
    fixedPlateauInBand: fixedPlateauUlp < DEEP_FLOOR_ULP,
    // headroom of the imp-33316 fixed 4000-node budget over the true minimum this rung requires.
    fixedBudgetHeadroom: FIXED_PLATEAU_NODES / minInBandNodes,
    // true minimum-budget saving vs the uniform ladder (understated by the nominal 9.3x).
    minBudgetSaving: UNIFORM_LADDER_NODES / minInBandNodes,
  });
});

// -- Summary statistics ---------------------------------------------------------------------------
const MIN_IN_BAND_NODES = RUNG_TABLE.map((r) => r.minInBandNodes);
const BREAK_THRESHOLD_NODES = RUNG_TABLE.map((r) => r.breakThresholdNodes);
const MAX_MIN_IN_BAND = Math.max(...MIN_IN_BAND_NODES);
const MIN_MIN_IN_BAND = Math.min(...MIN_IN_BAND_NODES);
const WORST_FIXED_PLATEAU_ULP = Math.max(...RUNG_TABLE.map((r) => r.fixedPlateauUlp));
const MIN_FIXED_BUDGET_HEADROOM = Math.min(...RUNG_TABLE.map((r) => r.fixedBudgetHeadroom));
const MIN_MIN_BUDGET_SAVING = Math.min(...RUNG_TABLE.map((r) => r.minBudgetSaving));

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The required minimum budget is FLAT across the deeper rungs -- it does NOT grow with n.
const minBudgetFlat = MAX_MIN_IN_BAND === MIN_MIN_IN_BAND && MAX_MIN_IN_BAND < FIXED_PLATEAU_NODES;
// (2) The resolution wall below the minimum is equally flat across the deeper rungs.
const breakWallFlat = Math.max(...BREAK_THRESHOLD_NODES) === Math.min(...BREAK_THRESHOLD_NODES);
// (3) The imp-33316 fixed 4000-node plateau stays in the band at every deeper rung (cross-check).
const fixedPlateauHolds = RUNG_TABLE.every((r) => r.fixedPlateauInBand);
// (4) The fixed budget carries genuine headroom (>= 10x) over the true minimum at every rung.
const fixedBudgetHasHeadroom = MIN_FIXED_BUDGET_HEADROOM >= 10;
// (5) The nominal 9.3x saving is preserved AND understated by the true minimum-budget saving.
const savingHoldsAndUnderstated =
  Math.abs(NOMINAL_SAVING - 37205 / 4000) < 1e-9 && MIN_MIN_BUDGET_SAVING > NOMINAL_SAVING;
// (6) Coverage: the deeper deep-tail rungs n ~ 350..400 are swept across a wide budget ladder.
const deeperTailCovered =
  N_RUNGS.length >= 3 && N_RUNGS.every((n) => n >= 350 && n <= 400) && PANEL_SWEEP.length >= 6;

const verdict =
  minBudgetFlat && breakWallFlat && fixedPlateauHolds && fixedBudgetHasHeadroom && savingHoldsAndUnderstated && deeperTailCovered
    ? 'FIXED-BUDGET-WIN-HOLDS:-THE-REQUIRED-GRADED-PLATEAU-NODE-BUDGET-IS-FLAT-(~200-NODES)-ACROSS-THE-DEEPER-' +
      'DEEP-TAIL-RUNGS-n-in-{350,375,400}:-IT-DOES-NOT-GROW-AS-THE-SADDLE-PEAK-SHARPENS.-EVERY-RUNG-SNAPS-INTO-' +
      'THE-imp-33275-A_log-FLOOR-BAND-AT-THE-SAME-~200-NODE-BUDGET-(RESOLUTION-WALL-AT-~150-NODES,-~800-ULP,-' +
      'COLLAPSING-TO-~e6-ULP-AT-100-NODES),-SO-THE-imp-33316-FIXED-4000-NODE-PLATEAU-CARRIES-~20x-HEADROOM-AND-' +
      'ITS-~9.3x-GRADED-VS-UNIFORM-RATIO-(37205/4000)-HOLDS-AS-A-GENUINE-FIXED-BUDGET-WIN-(THE-TRUE-MINIMUM-' +
      'SAVING-~186x-UNDERSTATES-IT).-THE-GRADED-PANELS-a_j=7(j/panels)^4-AUTO-CONCENTRATE-TO-TRACK-THE-SHARPENING-' +
      'PEAK-WITHOUT-ADDING-NODES.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-imp-33537-BOUNDS-' +
      'THE-<64-BAND-AT-n>=510;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-' +
      'PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33539_GRADED_PLATEAU_DEEPER_TAIL_MIN_BUDGET = Object.freeze({
  id: 'imp-33539-graded-plateau-deeper-tail-min-budget',
  ticket: 'imp-33539',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33316-graded-plateau-deep-tail-node-budget.js',
  crossValidatesModules: [
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
    'imp-33537-deep-tail-plateau-spike-recurrence.js',
    'imp-33295-graded-inner-grid-a-node-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'DEEPER deep-tail MINIMUM node-budget sweep: does the imp-33316 ~9.3x graded-vs-uniform cost ratio HOLD at ' +
    'n in {350,375,400} as the saddle peak sharpens, or must the graded plateau node budget GROW to keep resolving ' +
    'the peak? At each deeper rung the direct A_direct(tau*) = int_0^7 phiKernel(s)phiKernel(s+tau*) ds graded-GL ' +
    'plateau (grade 4) is scored across a node-budget ladder P in {10..400} panels (100..4000 nodes) vs the ' +
    'imp-33213 A_log target, and the smallest budget reaching the imp-33316 &lt; 64 ULP floor band is located. ' +
    'RESULT: the required MINIMUM budget is FLAT at ~200 nodes across all three deeper rungs -- it does NOT grow ' +
    'as the peak sharpens; the resolution wall is equally flat (~150 nodes at ~800 ULP, collapsing to ~e6 ULP at ' +
    '100 nodes). The imp-33316 FIXED 4000-node plateau (worst ~30 ULP here, cross-checking its ~20 ULP reading) ' +
    'therefore carries ~20x headroom, and the ~9.3x nominal ratio (37205/4000) HOLDS as a genuine fixed-budget win ' +
    '-- the true minimum-budget saving (~186x = 37205/200) UNDERSTATES it. The graded panels a_j = 7 (j/panels)^4 ' +
    'auto-concentrate to track the sharpening saddle without adding nodes. VERDICT: FIXED-BUDGET-WIN-HOLDS. ' +
    'ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; imp-33537 ' +
    'bounds the &lt; 64 band at n &gt;= 510; operator positivity (imp-3066) untouched; no QED. PT Lambda &lt;= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'DEEPER deep-tail rungs n in {350,375,400}, tau* = root of n = 4 pi tau* e^{4 tau*}',
    budgetLadder: 'graded-GL plateau (grade 4), panels P in {10,15,20,30,50,100,200,400} = 100..4000 inner GL nodes',
    scoring: 'residual of A_direct(tau*) vs the imp-33213 log-domain target A_log, in ULP = A_log * 2^-52',
    minInBand: 'per rung, the smallest node budget whose residual falls inside the imp-33316 widened band (&lt; 64 ULP)',
    breakThreshold: 'per rung, the largest node budget still OUTSIDE the band (the resolution wall below the minimum)',
    fixedReference: 'the imp-33316 FIXED plateau (grade4/400p=4000 nodes) vs the imp-33275 uniform ladder (37205 nodes)',
    selfComputing: 'every rung, every budget, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    panelSweep: Object.freeze(PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    fixedPlateauNodes: FIXED_PLATEAU_NODES,
    uniformLadderNodes: UNIFORM_LADDER_NODES,
    nominalSaving: NOMINAL_SAVING,
    rungTable: RUNG_TABLE,
    minInBandNodes: Object.freeze(MIN_IN_BAND_NODES.slice()),
    breakThresholdNodes: Object.freeze(BREAK_THRESHOLD_NODES.slice()),
    maxMinInBand: MAX_MIN_IN_BAND,
    minMinInBand: MIN_MIN_IN_BAND,
    worstFixedPlateauUlp: WORST_FIXED_PLATEAU_ULP,
    minFixedBudgetHeadroom: MIN_FIXED_BUDGET_HEADROOM,
    minMinBudgetSaving: MIN_MIN_BUDGET_SAVING,
    minBudgetFlat,
    breakWallFlat,
    fixedPlateauHolds,
    fixedBudgetHasHeadroom,
    savingHoldsAndUnderstated,
    deeperTailCovered,
    verdict,
  }),

  interpretation: Object.freeze({
    minimumBudgetDoesNotGrow:
      'The smallest graded-GL budget that reaches the imp-33275 A_log floor band is ~200 nodes at EVERY deeper rung ' +
      'n in {350,375,400} -- flat, not climbing. As the saddle peak sharpens the graded panels a_j = 7 (j/panels)^4 ' +
      'keep concentrating toward the origin fast enough that the same node count still resolves the sharper peak, so ' +
      'the required budget does not grow. This is the opposite behaviour of the uniform ladder, whose fixed grid ' +
      'diverges as the peak concentrates (imp-33316).',
    fixedBudgetHasLargeHeadroom:
      'The imp-33316 FIXED 4000-node plateau reads worst ~30 ULP at these deeper rungs (cross-checking its ~20 ULP ' +
      'reading), so it sits ~20x above the ~200-node minimum the band actually requires. The conservative fixed ' +
      'plateau is nowhere near its resolution wall in the deeper tail.',
    ratioHoldsAndUnderstates:
      'Because the required budget is flat, the imp-33316 ~9.3x nominal graded-vs-uniform ratio (37205 / 4000) HOLDS ' +
      'as a genuine fixed-budget win at the deeper rungs -- it does not need to climb. The true minimum-budget saving ' +
      'vs the 37205-node uniform ladder is ~186x (37205 / 200), so the conservative ~9.3x ratio understates the win.',
    theResolutionWall:
      'Below ~200 nodes the graded rule cannot yet resolve the peak: at 150 nodes all three rungs sit at ~800 ULP ' +
      '(out of band) and at 100 nodes they collapse to ~2e6..6e6 ULP. This wall is flat across the deeper rungs, ' +
      'confirming the ~200-node minimum is a genuine resolution threshold, not a lattice-jitter artifact.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Extends the imp-33316 FIXED-budget deep-tail measurement into a node-budget SWEEP at the deeper rungs ' +
      'n in {350,375,400}, locating the minimum graded budget the A_log floor band requires. It changes NO bound, ' +
      'patches NO literal, and establishes NO operator positivity. Grid-design measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33316/imp-33295/imp-33213; this audits the inner ' +
      'quadrature node budget in the deeper tail, not that truncation.',
    latticeJitterCaveat:
      'The worst-window ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296): the ' +
      'exact per-budget ULP bounces and cross-platform libm exp/pow variation can shift the few-ULP measurements. ' +
      'The robust reading is the FLAT ~200-node minimum and the flat resolution wall, not the exact per-budget ULP. ' +
      'imp-33537 showed the imp-33316 constant < 64 ULP band is a coarse-grid artifact the fixed plateau crosses at ' +
      'n ~ 510, 596; the deeper rungs measured here (n in {350,375,400}) sit firmly inside the band, so the ' +
      'minimum-budget reading is unaffected, but the < 64 band is NOT claimed to hold at every deep rung.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33539_GRADED_PLATEAU_DEEPER_TAIL_MIN_BUDGET_ASSERTIONS = [
  {
    id: 'imp33539-deeper-tail-covered',
    why: 'The sweep must run across the deeper deep-tail rungs n in {350,375,400} over a wide node-budget ladder.',
    holds: () => deeperTailCovered && RUNG_TABLE.length === N_RUNGS.length && PANEL_SWEEP.length >= 6,
  },
  {
    id: 'imp33539-minimum-budget-is-flat',
    why: 'THE PURPOSE: the smallest graded budget reaching the floor band must be FLAT across the deeper rungs -- ' +
         'the required budget does NOT grow as the saddle peak sharpens.',
    holds: () => minBudgetFlat && MAX_MIN_IN_BAND === MIN_MIN_IN_BAND && MAX_MIN_IN_BAND < FIXED_PLATEAU_NODES,
  },
  {
    id: 'imp33539-resolution-wall-is-flat',
    why: 'The resolution wall below the minimum (largest out-of-band budget) must also be flat across the deeper ' +
         'rungs, confirming the ~200-node minimum is a genuine threshold, not lattice jitter.',
    holds: () => breakWallFlat && RUNG_TABLE.every((r) => r.breakThresholdNodes < r.minInBandNodes),
  },
  {
    id: 'imp33539-fixed-plateau-still-holds',
    why: 'Cross-check of imp-33316: the FIXED 4000-node plateau must stay inside the < 64 ULP band at every deeper ' +
         'rung (worst well under the band).',
    holds: () => fixedPlateauHolds && WORST_FIXED_PLATEAU_ULP < DEEP_FLOOR_ULP,
  },
  {
    id: 'imp33539-fixed-budget-has-headroom',
    why: 'The imp-33316 fixed 4000-node budget must carry genuine headroom (>= 10x) over the true minimum the band ' +
         'requires at every deeper rung.',
    holds: () => fixedBudgetHasHeadroom && MIN_FIXED_BUDGET_HEADROOM >= 10,
  },
  {
    id: 'imp33539-nominal-ratio-holds-and-understated',
    why: 'THE HEADLINE: the imp-33316 nominal 9.3x ratio (37205/4000) is preserved AND understated by the true ' +
         'minimum-budget saving (37205 / ~200), so the ratio HOLDS as a fixed-budget win rather than needing to climb.',
    holds: () => savingHoldsAndUnderstated && Math.abs(NOMINAL_SAVING - 37205 / 4000) < 1e-9 && MIN_MIN_BUDGET_SAVING > NOMINAL_SAVING,
  },
  {
    id: 'imp33539-verdict-records-fixed-budget-win-holds',
    why: 'The classified verdict must record the FIXED-BUDGET-WIN-HOLDS reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33539-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33539_GRADED_PLATEAU_DEEPER_TAIL_MIN_BUDGET.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33539_GRADED_PLATEAU_DEEPER_TAIL_MIN_BUDGET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33539-graded-plateau-deeper-tail-min-budget assertion failed: ${assertion.id}`);
  }
}
