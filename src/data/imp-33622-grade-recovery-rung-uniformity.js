/**
 * @module imp-33622-grade-recovery-rung-uniformity
 * @fileoverview imp-33622 -- EXTEND the imp-33600 origin-concentration grade sweep {4,5,6,8} from the
 *   SINGLE rung n=596 to the other TWO imp-33599 band-clearing cluster peaks n=526 and n=634, holding
 *   the imp-33539 node-budget ladder fixed, and MEASURE whether "grade-6-recovers-the-band" is
 *   RUNG-UNIFORM across all three cluster peaks or whether the recovery grade DRIFTS with depth.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE GAP imp-33600 LEFT OPEN
 *   ---------------------------
 *   imp-33600 isolated the origin-concentration GRADE (not node budget, not rule family) as the driver of
 *   the imp-33577 band-crossing artifact -- but at ONE rung only, n=596: grade-4/5 stay OUT of the
 *   imp-33316 &lt; 64 ULP band (floor ~65/~69 ULP, minInBandNodes Infinity), grade-6/8 clear it at &lt;= 300
 *   nodes. imp-33599 then located THREE disjoint band-clearing cluster peaks over [400,700]: n ~ 526, ~591,
 *   and ~634. imp-33600 tested only the MIDDLE cluster (n=596). Is the "grade-6 recovery" a property of the
 *   cluster peaks generally, or is it specific to n=596? This module RE-RUNS the identical grade sweep
 *   {4,5,6,8} across the identical imp-33539 node-budget ladder at the FLANKING cluster peaks n=526 and
 *   n=634 (plus n=596 reproduced verbatim as the anchor) and asks: does the grade-6 recovery threshold hold
 *   rung-uniform, or does the recovery grade drift with cluster depth?
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   At each rung n in {526,596,634}, tau* = saddleTau(n). For each grade g in {4,5,6,8} we score the direct
 *   graded-GL plateau A_direct(tau*) across the imp-33539 node-budget ladder (panels P in
 *   {10,15,20,30,50,100,200,400} = 100..4000 inner GL-10 nodes) vs the imp-33213 INDEPENDENT log-domain
 *   target A_log, in ULP = A_log*2^-52. Per grade per rung we locate floorUlp (smallest residual at budgets
 *   &gt;= 200 nodes, once the peak is resolved) and minInBandNodes (smallest budget whose residual falls
 *   &lt; 64 ULP; Infinity when none in the ladder does). Per rung the RECOVERY GRADE is the LOWEST grade
 *   whose floor enters the band.
 *
 *   MEASURED (floorUlp / minInBandNodes; ULP vs the imp-33213 A_log target):
 *
 *        rung    grade4              grade5              grade6              grade8            recovery
 *        n=526   ~25.9 / 200n        ~21.1 / 200n        ~4.8 / 200n         ~11.5 / 200n      grade 4
 *        n=596   ~65.3 / Infinity    ~68.8 / Infinity    ~34.0 / 200n        ~59.2 / 300n      grade 6
 *        n=634   ~10.7 / 200n        ~12.6 / 200n        ~4.9 / 200n         ~14.6 / 200n      grade 4
 *
 *   HEADLINE. The grade-6 recovery is NOT RUNG-UNIFORM. At the middle cluster peak n=596 grade-4/5 fail
 *   (floor ~65/~69 ULP, minInBandNodes Infinity) and only grade-6 recovers the band -- reproducing imp-33600
 *   verbatim. But at BOTH flanking cluster peaks n=526 and n=634 even grade-4 ALREADY clears the imp-33316
 *   &lt; 64 band at a node-competitive 200 nodes (floor ~26 and ~11 ULP, well inside), so NO grade bump is
 *   needed at all. The recovery grade drifts with rung: 4 at n=526, 6 at n=596, 4 at n=634. The grade-4
 *   UNDER-CONCENTRATION FAILURE that imp-33600 diagnosed is SPECIFIC TO the middle cluster peak n=596, not a
 *   cluster-peak-uniform property. (Consistent with imp-33621, which found the middle cluster n~591..601 the
 *   tallest floorUlp spike of the three; n=596 sits nearest that spike where grade-4 under-concentration
 *   bites hardest.)
 *
 *   VERDICT. RECOVERY-GRADE-NOT-RUNG-UNIFORM. imp-33600's "grade-6-recovers-the-band" is confirmed AS the
 *   n=596 reading but does NOT generalize to the flanking cluster peaks: grade-4 already suffices at n=526
 *   and n=634. The grade-6 requirement is a rung-LOCAL (n=596) artifact, not a rung-uniform law -- the grade
 *   axis is the driver, but the driving THRESHOLD is depth-dependent, sharpest at the middle cluster.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It extends the imp-33600 grade
 *   axis measurement to two more rungs; it changes NO bound, patches NO literal, and establishes NO operator
 *   positivity. The per-budget ULP is a JITTERY arithmetic-floor lattice property
 *   (imp-33249/imp-33277/imp-33296/imp-33537/imp-33599/imp-33621 latticeJitterCaveat): the exact per-grade/
 *   per-budget ULP bounces and cross-platform libm exp/pow variation can shift the few-ULP measurements, so
 *   the robust reading is the QUALITATIVE separation -- grade-4 clears at n=526/634 but fails at n=596 where
 *   grade-6 is needed -- not the exact per-budget ULP. The NPHI = 10 Phi-series truncation is inherited
 *   upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33600-band-crossing-grade-vs-node-driver.js (the single-rung n=596 grade sweep this extends)
 *   @see imp-33599-wide-range-band-crossing-envelope-law.js (the three cluster peaks n~526,591,634)
 *   @see imp-33621-band-clearing-cluster-decay-and-tail-scan.js (cluster peak decay: middle cluster tallest)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33622 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33557/imp-33600) -------
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
// The three imp-33599 band-clearing cluster peaks: n=596 is the imp-33600 anchor (grade-4 FAILS there),
// n=526 and n=634 are the flanking cluster peaks this ticket adds.
const RUNG_SWEEP = [526, 596, 634];
const N_ANCHOR = 596; // the imp-33600 rung reproduced verbatim as the anchor
// The imp-33539 node-budget ladder verbatim: panels P (10 GL nodes per panel) => 100..4000 nodes.
const PANEL_SWEEP = [10, 15, 20, 30, 50, 100, 200, 400];
// The imp-33600 grade axis verbatim: the origin-concentration grade held-budget-fixed.
const GRADE_SWEEP = [4, 5, 6, 8];
const DEEP_FLOOR_ULP = 64; // the imp-33316 widened ~2x deep-tail band
const RESOLVED_NODES = 200; // budgets at/above this have collapsed off the ~e7 unresolved-peak spike

// -- Per-rung grade x budget sweep (node budget held fixed across the ladder; grade and rung vary) --
function gradeTableForRung(n) {
  const tauStar = saddleTau(n);
  const aLogAtRung = aLog(tauStar);
  const ulpOfALog = aLogAtRung * U;

  const perGrade = GRADE_SWEEP.map((grade) => {
    const budgetRow = PANEL_SWEEP.map((panels) => {
      const nodes = 10 * panels;
      const ulp = Math.abs(aDirectGradedGL(tauStar, 7, panels, grade) - aLogAtRung) / ulpOfALog;
      return Object.freeze({ panels, nodes, ulp, inBand: ulp < DEEP_FLOOR_ULP });
    });
    const inBand = budgetRow.filter((b) => b.inBand);
    const minInBandNodes = inBand.length ? Math.min(...inBand.map((b) => b.nodes)) : Infinity;
    const resolvedFloor = budgetRow.filter((b) => b.nodes >= RESOLVED_NODES);
    const floorUlp = Math.min(...resolvedFloor.map((b) => b.ulp));
    return Object.freeze({
      grade,
      budgetRow: Object.freeze(budgetRow),
      minInBandNodes,
      floorUlp,
      floorInBand: floorUlp < DEEP_FLOOR_ULP,
    });
  });

  // The RECOVERY GRADE at this rung: the lowest grade in the sweep whose floor enters the band.
  const firstInBand = perGrade.find((r) => r.floorInBand);
  const recoveryGrade = firstInBand ? firstInBand.grade : null;

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogAtRung,
    perGrade: Object.freeze(perGrade),
    recoveryGrade,
  });
}

const RUNG_TABLE = RUNG_SWEEP.map(gradeTableForRung);

// -- Summary statistics ---------------------------------------------------------------------------
const byRung = (n) => RUNG_TABLE.find((r) => r.n === n);
const RUNG526 = byRung(526);
const RUNG596 = byRung(596); // the imp-33600 anchor: grade-4/5 fail, grade-6 recovers
const RUNG634 = byRung(634);
const gradeOf = (rung, g) => rung.perGrade.find((r) => r.grade === g);

const RECOVERY_GRADES = RUNG_TABLE.map((r) => r.recoveryGrade);
// The recovery threshold is rung-uniform iff every rung recovers at the same grade.
const uniqueRecoveryGrades = Array.from(new Set(RECOVERY_GRADES));
const recoveryGradeRungUniform = uniqueRecoveryGrades.length === 1;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: grade sweep {4,5,6,8} across the imp-33539 ladder at all three cluster peaks.
const sweepCovered =
  RUNG_SWEEP.length === 3 && RUNG_SWEEP[0] === 526 && RUNG_SWEEP[1] === 596 && RUNG_SWEEP[2] === 634 &&
  GRADE_SWEEP.length === 4 && GRADE_SWEEP[0] === 4 && GRADE_SWEEP[3] === 8 && PANEL_SWEEP.length >= 6;
// (2) The n=596 anchor REPRODUCES imp-33600: grade-4/5 fail (Infinity), grade-6 recovers at &lt;= 300 nodes.
const anchorReproducesImp33600 =
  gradeOf(RUNG596, 4).minInBandNodes === Infinity && !gradeOf(RUNG596, 4).floorInBand &&
  gradeOf(RUNG596, 5).minInBandNodes === Infinity && !gradeOf(RUNG596, 5).floorInBand &&
  gradeOf(RUNG596, 6).floorInBand && Number.isFinite(gradeOf(RUNG596, 6).minInBandNodes) &&
  RUNG596.recoveryGrade === 6;
// (3) THE HEADLINE: at BOTH flanking cluster peaks grade-4 ALREADY clears the band -- no grade bump needed.
const grade4ClearsAt526 =
  gradeOf(RUNG526, 4).floorInBand && Number.isFinite(gradeOf(RUNG526, 4).minInBandNodes) &&
  RUNG526.recoveryGrade === 4;
const grade4ClearsAt634 =
  gradeOf(RUNG634, 4).floorInBand && Number.isFinite(gradeOf(RUNG634, 4).minInBandNodes) &&
  RUNG634.recoveryGrade === 4;
// (4) THE HEADLINE: the recovery grade is NOT rung-uniform -- it drifts (4 at flanks, 6 at n=596).
const recoveryGradeDrifts =
  !recoveryGradeRungUniform && RUNG526.recoveryGrade === 4 && RUNG596.recoveryGrade === 6 &&
  RUNG634.recoveryGrade === 4;
// (5) The grade-4 UNDER-CONCENTRATION FAILURE is SPECIFIC to the middle peak n=596:
//     grade-4 fails ONLY at n=596 among the three cluster peaks.
const grade4FailsOnlyAtMiddle =
  !gradeOf(RUNG596, 4).floorInBand && gradeOf(RUNG526, 4).floorInBand && gradeOf(RUNG634, 4).floorInBand;

const verdict =
  sweepCovered && anchorReproducesImp33600 && grade4ClearsAt526 && grade4ClearsAt634 &&
  recoveryGradeDrifts && grade4FailsOnlyAtMiddle
    ? 'RECOVERY-GRADE-NOT-RUNG-UNIFORM:-EXTENDING-THE-imp-33600-GRADE-SWEEP-{4,5,6,8}-FROM-n=596-TO-THE-FLANKING-' +
      'imp-33599-CLUSTER-PEAKS-n=526-AND-n=634-(imp-33539-NODE-BUDGET-FIXED)-SHOWS-THE-grade-6-RECOVERY-IS-NOT-' +
      'RUNG-UNIFORM.-AT-n=596-grade-4/5-FAIL-(FLOOR-~65/~69-ULP,-minInBandNodes-Infinity)-AND-ONLY-grade-6-RECOVERS-' +
      '(REPRODUCING-imp-33600),-BUT-AT-BOTH-FLANKING-PEAKS-n=526-AND-n=634-grade-4-ALREADY-CLEARS-THE-imp-33316-<64-' +
      'ULP-BAND-AT-200-NODES-(FLOOR-~26-AND-~11-ULP,-WELL-INSIDE).-THE-RECOVERY-GRADE-DRIFTS-4/6/4-ACROSS-THE-THREE-' +
      'CLUSTER-PEAKS:-THE-grade-4-UNDER-CONCENTRATION-FAILURE-imp-33600-DIAGNOSED-IS-SPECIFIC-TO-THE-MIDDLE-CLUSTER-' +
      'PEAK-n=596-(THE-imp-33621-TALLEST-floorUlp-SPIKE),-NOT-A-CLUSTER-PEAK-UNIFORM-PROPERTY.-THE-GRADE-AXIS-IS-THE-' +
      'DRIVER-BUT-ITS-DRIVING-THRESHOLD-IS-DEPTH-DEPENDENT.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-' +
      'FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33622_GRADE_RECOVERY_RUNG_UNIFORMITY = Object.freeze({
  id: 'imp-33622-grade-recovery-rung-uniformity',
  ticket: 'imp-33622',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33600-band-crossing-grade-vs-node-driver.js',
  crossValidatesModules: [
    'imp-33600-band-crossing-grade-vs-node-driver.js',
    'imp-33599-wide-range-band-crossing-envelope-law.js',
    'imp-33621-band-clearing-cluster-decay-and-tail-scan.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'RUNG-UNIFORMITY of the imp-33600 grade-6 band recovery: extend the origin-concentration grade sweep {4,5,6,8} ' +
    'across the imp-33539 node-budget ladder from the SINGLE rung n=596 to the FLANKING imp-33599 band-clearing ' +
    'cluster peaks n=526 and n=634, and measure whether "grade-6-recovers-the-band" is rung-uniform. RESULT: it is ' +
    'NOT. At n=596 grade-4/5 fail (floor ~65/~69 ULP, minInBandNodes Infinity) and only grade-6 recovers the ' +
    'imp-33316 &lt; 64 ULP band (reproducing imp-33600), but at BOTH flanking peaks n=526 and n=634 grade-4 ALREADY ' +
    'clears the band at a node-competitive 200 nodes (floor ~26 and ~11 ULP, well inside). The recovery grade drifts ' +
    '4/6/4 across the three cluster peaks: the grade-4 under-concentration FAILURE imp-33600 diagnosed is SPECIFIC to ' +
    'the middle cluster peak n=596 (the imp-33621 tallest floorUlp spike), not a cluster-peak-uniform property. The ' +
    'grade axis is the driver but its driving THRESHOLD is depth-dependent. VERDICT: RECOVERY-GRADE-NOT-RUNG-UNIFORM. ' +
    'ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; operator ' +
    'positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'the three imp-33599 band-clearing cluster peaks n in {526,596,634}; n=596 is the imp-33600 anchor',
    axis: 'the origin-concentration GRADE g in {4,5,6,8} in a_j = 7 (j/panels)^g, swept while the node budget and rule family are held fixed',
    budgetLadder: 'the imp-33539 graded-GL plateau ladder verbatim, panels P in {10,15,20,30,50,100,200,400} = 100..4000 nodes',
    scoring: 'residual of A_direct(tau*) vs the imp-33213 log-domain target A_log, in ULP = A_log * 2^-52',
    floorUlp: 'per grade per rung, the smallest residual reachable at budgets >= 200 nodes (once the peak is resolved)',
    minInBand: 'per grade per rung, the smallest budget reaching the imp-33316 &lt; 64 ULP band (Infinity when none does)',
    recoveryGrade: 'per rung, the LOWEST grade whose floor enters the band -- the origin-concentration grade needed to clear it',
    selfComputing: 'every rung, every grade, every budget, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    rungSweep: Object.freeze(RUNG_SWEEP.slice()),
    nAnchor: N_ANCHOR,
    panelSweep: Object.freeze(PANEL_SWEEP.slice()),
    gradeSweep: Object.freeze(GRADE_SWEEP.slice()),
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    resolvedNodes: RESOLVED_NODES,
    rungTable: RUNG_TABLE,
    recoveryGrades: Object.freeze(RECOVERY_GRADES.slice()),
    recoveryGradeRungUniform,
    // Per-rung headline floors at grade 4 (the axis the recovery threshold moves on).
    rung526Grade4FloorUlp: gradeOf(RUNG526, 4).floorUlp,
    rung526Grade4MinInBandNodes: gradeOf(RUNG526, 4).minInBandNodes,
    rung596Grade4FloorUlp: gradeOf(RUNG596, 4).floorUlp,
    rung596Grade4MinInBandNodes: gradeOf(RUNG596, 4).minInBandNodes,
    rung596Grade6FloorUlp: gradeOf(RUNG596, 6).floorUlp,
    rung596Grade6MinInBandNodes: gradeOf(RUNG596, 6).minInBandNodes,
    rung634Grade4FloorUlp: gradeOf(RUNG634, 4).floorUlp,
    rung634Grade4MinInBandNodes: gradeOf(RUNG634, 4).minInBandNodes,
    sweepCovered,
    anchorReproducesImp33600,
    grade4ClearsAt526,
    grade4ClearsAt634,
    recoveryGradeDrifts,
    grade4FailsOnlyAtMiddle,
    verdict,
  }),

  interpretation: Object.freeze({
    anchorReproduces:
      'The n=596 anchor reproduces imp-33600 verbatim: grade-4 floors ~65 ULP and grade-5 ~69 ULP with NO budget in ' +
      'the imp-33539 ladder reaching the imp-33316 &lt; 64 band (minInBandNodes Infinity), while grade-6 clears it at ' +
      '200 nodes (floor ~34 ULP). The recovery grade at n=596 is 6.',
    flanksNeedNoBump:
      'At BOTH flanking cluster peaks the grade-4 sweep already lands inside the band at 200 nodes: floor ~26 ULP at ' +
      'n=526 and ~11 ULP at n=634, both well below 64. So no grade bump is required -- the recovery grade at n=526 and ' +
      'n=634 is 4, not 6.',
    recoveryGradeDrifts:
      'The recovery grade drifts 4/6/4 across the three cluster peaks. imp-33600 "grade-6-recovers-the-band" holds AS ' +
      'the n=596 reading but does NOT generalize: the grade-4 under-concentration FAILURE is specific to the middle ' +
      'cluster peak. The grade is still the driver (imp-33600), but the driving THRESHOLD is depth-dependent -- it ' +
      'spikes to grade-6 only at the middle cluster and stays at grade-4 on either flank.',
    consistentWithImp33621:
      'This is consistent with imp-33621, which found the middle cluster (n~591..601) the TALLEST of the three ' +
      'floorUlp spikes (~65.3 vs the flanks). n=596 sits nearest that spike where the grade-4 arithmetic floor pokes ' +
      'above 64 ULP, so it is precisely the middle peak where grade-4 under-concentration bites and a grade bump is ' +
      'needed; the shallower flanking peaks stay grade-4-clear.',
    jitterCaveat:
      'The per-grade floors are jittery few-ULP lattice values (grade-6 dips to ~5 ULP at both flanks); the robust, ' +
      'platform-stable reading is the QUALITATIVE separation -- grade-4 clears at n=526/634 but fails at n=596 -- not ' +
      'the exact per-budget ULP or the exact clearing budget.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Extends the imp-33600 grade-axis measurement from the single rung n=596 to the flanking imp-33599 cluster peaks ' +
      'n=526 and n=634, holding the imp-33539 node budget and the graded-GL rule family fixed. It changes NO bound, ' +
      'patches NO literal, and establishes NO operator positivity. Grid-design measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33600/imp-33599/imp-33539/imp-33316/imp-33213; this ' +
      'audits the rung-uniformity of the grade axis, not that truncation.',
    latticeJitterCaveat:
      'The per-grade/per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/' +
      'imp-33537/imp-33599/imp-33621): individual grids bounce and cross-platform libm exp/pow variation can shift the ' +
      'few-ULP measurements, so the robust reading is the QUALITATIVE separation -- grade-4 clears at n=526/634 but ' +
      'fails at n=596 where grade-6 is needed -- not the exact per-budget ULP or the exact recovery grade at any single ' +
      'rung. The recovery THRESHOLD is not rung-uniform; the grade remains the driver.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33622_GRADE_RECOVERY_RUNG_UNIFORMITY_ASSERTIONS = [
  {
    id: 'imp33622-sweep-covered',
    why: 'The sweep must run the grade set {4,5,6,8} across the imp-33539 ladder at all three cluster peaks {526,596,634}.',
    holds: () => sweepCovered && RUNG_TABLE.length === RUNG_SWEEP.length &&
      RUNG_TABLE.every((r) => r.perGrade.length === GRADE_SWEEP.length),
  },
  {
    id: 'imp33622-anchor-reproduces-imp33600',
    why: 'The n=596 anchor must reproduce imp-33600: grade-4/5 fail (minInBandNodes Infinity, out of band) and ' +
         'grade-6 recovers the imp-33316 &lt; 64 band at a finite budget -- recovery grade 6.',
    holds: () => anchorReproducesImp33600 && RUNG596.recoveryGrade === 6,
  },
  {
    id: 'imp33622-grade4-clears-at-526',
    why: 'THE HEADLINE: at the shallow flanking peak n=526 grade-4 ALREADY clears the band at a finite budget -- ' +
         'no grade bump needed, recovery grade 4.',
    holds: () => grade4ClearsAt526 && RUNG526.recoveryGrade === 4,
  },
  {
    id: 'imp33622-grade4-clears-at-634',
    why: 'THE HEADLINE: at the deep flanking peak n=634 grade-4 ALREADY clears the band at a finite budget -- ' +
         'no grade bump needed, recovery grade 4.',
    holds: () => grade4ClearsAt634 && RUNG634.recoveryGrade === 4,
  },
  {
    id: 'imp33622-grade4-fails-only-at-middle',
    why: 'The grade-4 under-concentration FAILURE must be SPECIFIC to the middle cluster peak n=596 -- grade-4 ' +
         'floors out of band ONLY at n=596 among the three cluster peaks.',
    holds: () => grade4FailsOnlyAtMiddle,
  },
  {
    id: 'imp33622-recovery-grade-not-rung-uniform',
    why: 'THE HEADLINE: the recovery grade must NOT be rung-uniform -- it drifts 4/6/4 across {526,596,634}, so ' +
         'the imp-33600 grade-6 recovery does not generalize to the flanking peaks.',
    holds: () => recoveryGradeDrifts && !recoveryGradeRungUniform && uniqueRecoveryGrades.length === 2,
  },
  {
    id: 'imp33622-verdict-records-not-rung-uniform',
    why: 'The classified verdict must record the RECOVERY-GRADE-NOT-RUNG-UNIFORM reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33622-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33622_GRADE_RECOVERY_RUNG_UNIFORMITY.honestCaveat;
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

for (const assertion of IMP33622_GRADE_RECOVERY_RUNG_UNIFORMITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33622-grade-recovery-rung-uniformity assertion failed: ${assertion.id}`);
  }
}
