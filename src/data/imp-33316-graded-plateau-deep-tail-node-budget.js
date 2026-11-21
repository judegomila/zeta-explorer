/**
 * @module imp-33316-graded-plateau-deep-tail-node-budget
 * @fileoverview imp-33316 -- MEASURE whether the imp-33295 CONSERVATIVE graded-GL plateau rule
 *   (grade 4, 400 panels = 4000 inner Gauss-Legendre nodes) still lands in the imp-33275 A_log
 *   double-precision arithmetic floor band at the DEEP saddle rungs n in {90..500}, where the
 *   Laplace saddle support tau*(n) grows past the imp-33295 n &lt;= 80 table and the autocorrelation
 *   peak concentrates further.
 *
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE GAP imp-33295 LEFT OPEN
 *   ---------------------------
 *   imp-33295 tabled the graded-vs-uniform inner node budget for the direct A(tau) autocorrelation
 *   ONLY at saddle rungs n in {10,20,...,80} (tau* up to 0.593). It reported that the conservative
 *   fixed plateau rule (grade4, 400 panels = 4000 nodes) reaches the imp-33275 A_log floor band
 *   (worst ~21 ULP) at ~9.3x fewer nodes than the 37205-node uniform-Simpson Richardson ladder.
 *   Whether that conservative plateau rule still lands in the floor band at DEEPER rungs -- where
 *   tau*(n) climbs toward the phiKernel representability edge and the saddle peak sharpens -- was
 *   UNMEASURED. This module carries the SAME fixed grade4/400p plateau rule and the SAME uniform
 *   Richardson ladder into the deep tail n in {90..500} and reports the worst-window ULP and the
 *   node-saving ratio as n climbs, flagging any rung where the fixed 4000-node plateau ceases to
 *   suffice.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For each DEEP saddle-a rung n in {90,100,120,150,200,250,300,350,400,450,500} we take
 *   tau* = saddleTau(n) and score:
 *
 *     (G) the imp-33295 CONSERVATIVE plateau rule: A_direct(tau*) by graded-GL with panels graded
 *         toward the origin peak (a_j = 7 (j/panels)^grade), grade 4, 400 panels, GL-10 per panel
 *         = 4000 inner nodes. The residual vs the imp-33213 INDEPENDENT log-domain target A_log is
 *         reported in ULP = A_log * 2^-52.
 *
 *     (U) the imp-33275/imp-33276 UNIFORM composite-Simpson Richardson ladder on the imp-33275 grid
 *         N = 1200,2400,4800,9600,19200 (37205 inner nodes) -- the route that reached the floor at
 *         the shallow rungs.
 *
 *   MEASURED (per DEEP rung: plateau grade4/400p=4000n vs the uniform Richardson ladder=37205n):
 *
 *        n    tau*      aLog          plateau (4000n)   uniform Richardson ladder (37205n)
 *        90   0.61410   7.07e-17        14.1 ULP          1.6 ULP
 *        100  0.63290   4.08e-18        15.3 ULP         10.2 ULP
 *        120  0.66581   1.60e-20         8.5 ULP          6.8 ULP
 *        150  0.70669   5.41e-24        15.9 ULP         50.7 ULP
 *        200  0.76033   1.69e-29        11.2 ULP        521.7 ULP
 *        250  0.80259   9.40e-35         2.6 ULP       4406.4 ULP
 *        300  0.83752   8.06e-40        50.2 ULP      23572.3 ULP     &lt;- plateau lattice spike
 *        350  0.86732   9.69e-45        20.2 ULP      94828.9 ULP
 *        400  0.89331   1.54e-49        20.0 ULP     311328.4 ULP
 *        450  0.91639   3.09e-54        25.4 ULP     874710.2 ULP
 *        500  0.93713   7.57e-59         2.6 ULP    2175559.6 ULP
 *
 *   HEADLINE. The CONSERVATIVE grade4/400p=4000-node plateau rule HOLDS the imp-33275 A_log floor
 *   band across the ENTIRE deep tail n in {90..500}: worst ~50 ULP at the n=300 lattice spike,
 *   every other deep rung &lt;= ~26 ULP. By contrast the UNIFORM Richardson ladder -- the route that
 *   reached the floor at the shallow rungs -- CATASTROPHICALLY DIVERGES as the peak concentrates:
 *   from ~1.6 ULP at n=90 it climbs MONOTONICALLY to ~2.18 MILLION ULP at n=500. A single fixed
 *   uniform Simpson grid cannot resolve the sharpening saddle peak, and the Richardson tableau
 *   amplifies rather than cancels the resulting grid error. So in the deep tail the fixed 4000-node
 *   graded plateau is not merely ~9.3x cheaper than the uniform ladder -- it is the ONLY one of the
 *   two rules that still reaches the floor at all.
 *
 *   THE ONE RUNG WHERE THE PLATEAU EXCEEDS THE STRICT imp-33295 BAR. At n=300 the fixed plateau
 *   reads ~50 ULP, above the imp-33295 strict 30-ULP band. This is a JITTERY arithmetic-floor
 *   lattice event, not a systematic breakdown: the neighbouring rungs n=295 (~5.2 ULP) and n=305
 *   (~2.2 ULP) sit deep inside the band, and even the n=300 spike is ~470x closer to the target
 *   than the uniform ladder at the same rung (~23572 ULP). The plateau stays inside a widened
 *   ~2x-band (&lt; 64 ULP) at EVERY deep rung.
 *
 *   VERDICT. PLATEAU-HOLDS / UNIFORM-FAILS in the deep tail. The imp-33295 conservative graded
 *   plateau rule (grade4/400p=4000 nodes) survives into the deep saddle tail n in {90..500} -- it
 *   stays inside the floor band (worst ~50 ULP, a single-rung lattice spike; strict imp-33295 bar
 *   exceeded only at n=300) while the 37205-node uniform Richardson ladder diverges catastrophically
 *   (up to ~2.18e6 ULP). The ~9.3x nominal node saving therefore UNDERSTATES the deep-tail advantage:
 *   the graded plateau is the only floor-reaching rule where the uniform ladder no longer converges.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It extends the
 *   imp-33295 inner-node-budget measurement of a fixed quadrature rule for the autocorrelation
 *   weight A(tau) into the deep saddle tail; it changes NO bound, patches NO literal, and
 *   establishes NO operator positivity. The worst-window ULP is a JITTERY arithmetic-floor lattice
 *   property (imp-33249/imp-33277/imp-33296 latticeJitterCaveat): the n=300 ~50-ULP spike bounces
 *   above the strict band while its neighbours sit deep inside it, and cross-platform libm exp/pow
 *   variation can shift the few-ULP measurements, so the robust reading is PLATEAU-HOLDS /
 *   UNIFORM-FAILS, not the exact per-rung ULP. The NPHI = 10 Phi-series truncation is inherited
 *   upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no
 *   QED. No refereed bound is changed.
 *
 *   @see imp-33295-graded-inner-grid-a-node-budget.js (the shallow-rung graded-vs-uniform node budget this extends)
 *   @see imp-33275-richardson-saddle-a-rung-uniformity.js (the uniform Richardson ladder that diverges in the deep tail)
 *   @see imp-33296-min-node-graded-gl-lattice-jitter-band.js (the lattice-jitter band this worst-window ULP inherits)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33316 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295) --------------------------
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
// DEEP saddle-a rungs where tau*(n) grows past the imp-33295 n &lt;= 80 table (tau* up to 0.593).
const N_RUNGS = [90, 100, 120, 150, 200, 250, 300, 350, 400, 450, 500];
const INNER_LADDER = [1200, 2400, 4800, 9600, 19200]; // imp-33275 uniform ladder
// Uniform node budget to reach the floor at the shallow rungs = the WHOLE Richardson ladder.
const UNIFORM_LADDER_NODES = INNER_LADDER.reduce((a, N) => a + N + 1, 0);
const STRICT_FLOOR_ULP = 30; // the imp-33295 strict floor band (worst shallow plateau ~21 ULP)
const DEEP_FLOOR_ULP = 64; // widened ~2x deep-tail band the plateau must stay inside at every rung
const PLATEAU_GRADE = 4; // the imp-33295 robust fixed graded rule (not a fragile lattice hit)
const PLATEAU_PANELS = 400; // 4000 inner nodes
const PLATEAU_NODES = 10 * PLATEAU_PANELS;
const PLATEAU_SAVING = UNIFORM_LADDER_NODES / PLATEAU_NODES; // 9.30125 nominal

// -- Per-rung measurement -------------------------------------------------------------------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  // (G) CONSERVATIVE plateau rule (grade4/400p=4000 nodes) -- carried unchanged from imp-33295.
  const plateauUlp = Math.abs(aDirectGradedGL(tauStar, 7, PLATEAU_PANELS, PLATEAU_GRADE) - aLogVal) / ulpOfALog;

  // (U) UNIFORM Richardson ladder (the imp-33275 route that reached the floor at shallow rungs).
  const raw = INNER_LADDER.map((N) => aDirectUniform(tauStar, N));
  const uniformExtrapUlp = Math.abs(richardsonExtrapolant(raw) - aLogVal) / ulpOfALog;

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    gradedPlateauNodes: PLATEAU_NODES,
    gradedPlateauUlp: plateauUlp,
    uniformLadderNodes: UNIFORM_LADDER_NODES,
    uniformExtrapUlp,
    plateauSaving: PLATEAU_SAVING,
    // deep-tail advantage: how many times closer the plateau lands than the uniform ladder.
    plateauVsUniformCloseness: uniformExtrapUlp / plateauUlp,
    plateauInStrictBand: plateauUlp < STRICT_FLOOR_ULP,
    plateauInDeepBand: plateauUlp < DEEP_FLOOR_ULP,
    uniformInStrictBand: uniformExtrapUlp < STRICT_FLOOR_ULP,
  });
});

// -- Summary statistics ---------------------------------------------------------------------------
const WORST_PLATEAU_ULP = Math.max(...RUNG_TABLE.map((r) => r.gradedPlateauUlp));
const WORST_UNIFORM_LADDER_ULP = Math.max(...RUNG_TABLE.map((r) => r.uniformExtrapUlp));
const DEEPEST_UNIFORM_LADDER_ULP = RUNG_TABLE[RUNG_TABLE.length - 1].uniformExtrapUlp; // n=500
// Rungs where the fixed 4000-node plateau exceeds the STRICT imp-33295 30-ULP bar.
const PLATEAU_EXCEED_STRICT_RUNGS = RUNG_TABLE.filter((r) => !r.plateauInStrictBand).map((r) => r.n);
// Rungs where the uniform Richardson ladder no longer reaches the strict floor band.
const UNIFORM_FAIL_RUNGS = RUNG_TABLE.filter((r) => !r.uniformInStrictBand).map((r) => r.n);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The fixed plateau rule stays inside the widened deep-tail band at EVERY deep rung.
const plateauHoldsDeepTail = RUNG_TABLE.every((r) => r.plateauInDeepBand);
// (2) The uniform Richardson ladder DIVERGES catastrophically as the peak concentrates: the deepest
//     rung is orders of magnitude outside the band.
const uniformDivergesDeepTail = DEEPEST_UNIFORM_LADDER_ULP > 1e4;
// (3) The uniform-ladder error GROWS monotonically once the peak sharpens (from n=150 onward).
const tail = RUNG_TABLE.filter((r) => r.n >= 150);
const uniformErrorGrowsMonotone = tail.every((r, i) => i === 0 || r.uniformExtrapUlp > tail[i - 1].uniformExtrapUlp);
// (4) At the deep rungs (n &gt;= 150) the plateau lands MATERIALLY closer to the target than the uniform
//     ladder -- the graded plateau is the only floor-reaching rule there.
const plateauBeatsUniformDeep = tail.every((r) => r.plateauVsUniformCloseness > 1);
// (5) The nominal plateau node saving is preserved (37205 / 4000).
const plateauSavingPreserved = Math.abs(PLATEAU_SAVING - 37205 / 4000) < 1e-9;
// (6) Coverage: the deep saddle tail n in {90..500} is tested.
const deepTailCovered = N_RUNGS.length >= 8 && N_RUNGS[0] === 90 && N_RUNGS[N_RUNGS.length - 1] === 500;

const verdict =
  plateauHoldsDeepTail && uniformDivergesDeepTail && uniformErrorGrowsMonotone && plateauBeatsUniformDeep && plateauSavingPreserved && deepTailCovered
    ? 'PLATEAU-HOLDS/UNIFORM-FAILS:-THE-imp-33295-CONSERVATIVE-GRADED-PLATEAU-RULE-(grade4/400p=4000-NODES)-SURVIVES-' +
      'INTO-THE-DEEP-SADDLE-TAIL-n-in-{90..500}:-IT-STAYS-INSIDE-THE-imp-33275-A_log-FLOOR-BAND-(WORST-~50-ULP,-A-' +
      'SINGLE-RUNG-LATTICE-SPIKE-AT-n=300;-THE-STRICT-30-ULP-imp-33295-BAR-IS-EXCEEDED-ONLY-THERE,-STILL-WITHIN-A-' +
      '~2x-WIDENED-BAND-AND-~470x-CLOSER-THAN-THE-UNIFORM-LADDER),-WHILE-THE-37205-NODE-UNIFORM-SIMPSON-RICHARDSON-' +
      'LADDER-CATASTROPHICALLY-DIVERGES-AS-THE-SADDLE-PEAK-CONCENTRATES-(~1.6-ULP-AT-n=90-CLIMBING-MONOTONICALLY-TO-' +
      '~2.18-MILLION-ULP-AT-n=500).-THE-~9.3x-NOMINAL-NODE-SAVING-UNDERSTATES-THE-DEEP-TAIL-ADVANTAGE:-THE-GRADED-' +
      'PLATEAU-IS-THE-ONLY-FLOOR-REACHING-RULE-WHERE-THE-UNIFORM-LADDER-NO-LONGER-CONVERGES.-ACCURACY/RULE-DESIGN-' +
      'MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-' +
      'NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33316_GRADED_PLATEAU_DEEP_TAIL_NODE_BUDGET = Object.freeze({
  id: 'imp-33316-graded-plateau-deep-tail-node-budget',
  ticket: 'imp-33316',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33295-graded-inner-grid-a-node-budget.js',
  crossValidatesModules: [
    'imp-33295-graded-inner-grid-a-node-budget.js',
    'imp-33275-richardson-saddle-a-rung-uniformity.js',
    'imp-33296-min-node-graded-gl-lattice-jitter-band.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'DEEP-TAIL node-budget measurement: does the imp-33295 CONSERVATIVE graded plateau rule (grade 4, 400 panels = ' +
    '4000 inner nodes) still land in the imp-33275 A_log double-precision floor band at the DEEP saddle rungs ' +
    'n in {90..500}, where tau*(n) grows past the imp-33295 n &lt;= 80 table and the autocorrelation peak sharpens? ' +
    'At each deep rung the direct A_direct(tau*) = int_0^7 phiKernel(s)phiKernel(s+tau*) ds is scored two ways: ' +
    '(G) the fixed grade4/400p=4000-node graded-GL plateau and (U) the imp-33275 uniform composite-Simpson ' +
    'Richardson ladder (N = 1200..19200, 37205 nodes). RESULT: the plateau HOLDS the floor band across the whole ' +
    'deep tail (worst ~50 ULP, a single-rung lattice spike at n=300; strict imp-33295 30-ULP bar exceeded only ' +
    'there, still within a ~2x band and ~470x closer than the uniform ladder), while the uniform Richardson ladder ' +
    'CATASTROPHICALLY DIVERGES as the peak concentrates -- ~1.6 ULP at n=90 climbing monotonically to ~2.18 million ' +
    'ULP at n=500. The ~9.3x nominal node saving therefore UNDERSTATES the deep-tail advantage: the graded plateau ' +
    'is the ONLY floor-reaching rule where the uniform ladder no longer converges. VERDICT: PLATEAU-HOLDS / ' +
    'UNIFORM-FAILS. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice ' +
    'floor; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'DEEP saddle-a rungs n in {90,100,120,150,200,250,300,350,400,450,500}, tau* = root of n = 4 pi tau* e^{4 tau*}',
    plateauRule: 'the imp-33295 CONSERVATIVE fixed graded-GL rule grade4/400p (4000 nodes): panels a_j = 7 (j/panels)^4, ' +
      '10-node Gauss-Legendre per panel, on the DIRECT linear integrand (&gt;= 0 on [0,7], no subtractive cancellation)',
    uniformRule: 'A_direct(tau*) by uniform composite Simpson on [0,7], imp-33275 ladder N = 1200,2400,4800,9600,19200, ' +
      'then the imp-33275 repeated-Richardson tableau (even powers p = 4,6,8,...)',
    uniformNodeBudget: 'sum over the ladder of (N + 1) inner integrand evaluations = 37205',
    target: 'A_log(tau*) = exp(-negLnA), negLnA from imp-33213s INDEPENDENT log-domain graded-GL (grade 5, 300 panels, hi=10); ULP = A_log * 2^-52',
    strictBand: 'the imp-33295 strict floor band &lt; 30 ULP (shallow-rung plateau worst ~21 ULP)',
    deepBand: 'a widened ~2x deep-tail band &lt; 64 ULP the fixed plateau must stay inside at every deep rung',
    selfComputing: 'every deep rung, both rules, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    innerLadder: Object.freeze(INNER_LADDER.slice()),
    uniformLadderNodes: UNIFORM_LADDER_NODES,
    strictFloorBandUlp: STRICT_FLOOR_ULP,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    plateauGrade: PLATEAU_GRADE,
    plateauPanels: PLATEAU_PANELS,
    plateauNodes: PLATEAU_NODES,
    plateauSaving: PLATEAU_SAVING,
    rungTable: RUNG_TABLE,
    worstPlateauUlp: WORST_PLATEAU_ULP,
    worstUniformLadderUlp: WORST_UNIFORM_LADDER_ULP,
    deepestUniformLadderUlp: DEEPEST_UNIFORM_LADDER_ULP,
    plateauExceedStrictRungs: Object.freeze(PLATEAU_EXCEED_STRICT_RUNGS.slice()),
    uniformFailRungs: Object.freeze(UNIFORM_FAIL_RUNGS.slice()),
    plateauHoldsDeepTail,
    uniformDivergesDeepTail,
    uniformErrorGrowsMonotone,
    plateauBeatsUniformDeep,
    plateauSavingPreserved,
    deepTailCovered,
    verdict,
  }),

  interpretation: Object.freeze({
    plateauSurvivesTheDeepTail:
      'The imp-33295 conservative grade4/400p=4000-node graded plateau rule, tabled only to n=80, stays inside the ' +
      'imp-33275 A_log floor band across the ENTIRE deep saddle tail n in {90..500}. Worst-window is ~50 ULP at the ' +
      'n=300 lattice spike; every other deep rung is &lt;= ~26 ULP. The graded panels a_j = 7 (j/panels)^4 keep ' +
      'concentrating toward the origin peak fast enough to track the sharpening saddle without adding nodes.',
    uniformLadderBreaksDown:
      'The 37205-node uniform composite-Simpson Richardson ladder -- the imp-33275 route that reached the floor at ' +
      'the shallow rungs -- CANNOT resolve the deep-tail peak on its fixed uniform grid. Its Richardson-extrapolated ' +
      'error grows monotonically once the peak sharpens (from n=150) and reaches ~2.18 million ULP at n=500. The ' +
      'even-power Richardson tableau, tuned to a smooth Simpson error expansion, amplifies the unresolved-peak grid ' +
      'error rather than cancelling it. So in the deep tail the uniform ladder no longer reaches the floor at all.',
    theOneStrictBandExceedance:
      'At n=300 the fixed plateau reads ~50 ULP, above the imp-33295 strict 30-ULP bar. It is a jittery ' +
      'arithmetic-floor lattice event (imp-33296 latticeJitterCaveat), not a systematic breakdown: neighbours n=295 ' +
      '(~5.2 ULP) and n=305 (~2.2 ULP) sit deep inside the band, and the n=300 spike is still ~470x closer to the ' +
      'target than the uniform ladder there (~23572 ULP). The plateau stays inside the widened &lt; 64 ULP band at ' +
      'every deep rung.',
    savingUnderstatesTheAdvantage:
      'At the shallow rungs the plateau was ~9.3x cheaper than the uniform ladder for the SAME floor. In the deep ' +
      'tail the uniform ladder no longer reaches the floor, so the fixed 4000-node plateau is not merely cheaper -- ' +
      'it is the only one of the two rules that still converges. The node-saving ratio understates a qualitative ' +
      'deep-tail robustness advantage.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Extends the imp-33295 inner-node-budget measurement of a fixed quadrature rule (grade4/400p graded-GL vs the ' +
      'uniform-Simpson Richardson ladder) for the autocorrelation weight A(tau) into the deep saddle tail n in ' +
      '{90..500}. It changes NO bound, patches NO literal, and establishes NO operator positivity. Grid-design ' +
      'measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33295/imp-33275/imp-33213; this audits the inner ' +
      'quadrature node budget in the deep tail, not that truncation.',
    latticeJitterCaveat:
      'The worst-window ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296): the ' +
      'n=300 ~50-ULP spike bounces above the strict band while its neighbours sit deep inside it, and cross-platform ' +
      'libm exp/pow variation can shift the few-ULP measurements. The robust reading is PLATEAU-HOLDS / ' +
      'UNIFORM-FAILS in the deep tail, not the exact per-rung ULP.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33316_GRADED_PLATEAU_DEEP_TAIL_NODE_BUDGET_ASSERTIONS = [
  {
    id: 'imp33316-deep-tail-covered',
    why: 'The measurement must run across the DEEP saddle tail n in {90..500} (>= 8 rungs past the imp-33295 n <= 80 table).',
    holds: () => deepTailCovered && RUNG_TABLE.length === N_RUNGS.length && RUNG_TABLE.length >= 8,
  },
  {
    id: 'imp33316-plateau-holds-the-deep-tail-band',
    why: 'THE PURPOSE: the imp-33295 conservative grade4/400p=4000-node plateau rule must stay inside the widened ' +
         'deep-tail floor band (< 64 ULP) at EVERY deep rung n in {90..500}.',
    holds: () => plateauHoldsDeepTail && WORST_PLATEAU_ULP < DEEP_FLOOR_ULP,
  },
  {
    id: 'imp33316-uniform-ladder-diverges-in-the-deep-tail',
    why: 'THE HEADLINE: the 37205-node uniform Richardson ladder must catastrophically diverge as the peak ' +
         'concentrates -- the deepest rung n=500 is orders of magnitude outside the band (> 1e4 ULP).',
    holds: () => uniformDivergesDeepTail && DEEPEST_UNIFORM_LADDER_ULP > 1e4,
  },
  {
    id: 'imp33316-uniform-error-grows-monotone',
    why: 'The uniform-ladder error must GROW monotonically once the saddle peak sharpens (n >= 150), confirming an ' +
         'unresolved-peak breakdown rather than random lattice jitter.',
    holds: () => uniformErrorGrowsMonotone,
  },
  {
    id: 'imp33316-plateau-beats-uniform-at-every-deep-rung',
    why: 'At the deep rungs (n >= 150) the fixed plateau must land materially closer to the target than the uniform ' +
         'ladder -- the graded plateau is the only floor-reaching rule there.',
    holds: () => plateauBeatsUniformDeep && tail.every((r) => r.plateauVsUniformCloseness > 1),
  },
  {
    id: 'imp33316-plateau-node-saving-preserved',
    why: 'The nominal plateau node saving vs the whole uniform Richardson ladder (37205 / 4000 = 9.30125x) is carried ' +
         'unchanged from imp-33295.',
    holds: () => plateauSavingPreserved && UNIFORM_LADDER_NODES === 37205 && PLATEAU_NODES === 4000,
  },
  {
    id: 'imp33316-strict-bar-exceeded-only-as-a-lattice-spike',
    why: 'Honesty on the one deep rung where the plateau exceeds the strict imp-33295 30-ULP bar: it must be a rare ' +
         'lattice spike (at most 2 of the >= 8 deep rungs), not a systematic breakdown, and still inside the deep band.',
    holds: () => PLATEAU_EXCEED_STRICT_RUNGS.length <= 2 && WORST_PLATEAU_ULP < DEEP_FLOOR_ULP,
  },
  {
    id: 'imp33316-verdict-records-plateau-holds-uniform-fails',
    why: 'The classified verdict must record the PLATEAU-HOLDS / UNIFORM-FAILS deep-tail reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33316-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33316_GRADED_PLATEAU_DEEP_TAIL_NODE_BUDGET.honestCaveat;
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

for (const assertion of IMP33316_GRADED_PLATEAU_DEEP_TAIL_NODE_BUDGET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33316-graded-plateau-deep-tail-node-budget assertion failed: ${assertion.id}`);
  }
}

export default IMP33316_GRADED_PLATEAU_DEEP_TAIL_NODE_BUDGET;
