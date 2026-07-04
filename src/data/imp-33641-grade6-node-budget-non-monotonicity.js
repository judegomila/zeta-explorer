/**
 * @module imp-33641-grade6-node-budget-non-monotonicity
 * @fileoverview imp-33641 -- ASSESS the imp-33630 grade-6 n=596 node-budget NON-MONOTONICITY: the residual
 *   DROPS from ~34 ULP at 200 nodes back OUT to ~100 ULP at 300 nodes then re-enters the imp-33316 band --
 *   MEASURE whether this 200->300-node re-exit is a DENSE-LADDER LATTICE-JITTER artifact or a genuine grade-6
 *   ANTI-CONVERGENCE at n=596.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE NON-MONOTONICITY imp-33630 SURFACED
 *   ---------------------------------------
 *   The imp-33600 IMP33600_BAND_CROSSING_GRADE_VS_NODE_DRIVER grade-6 budget row (rendered by the imp-33630
 *   IMP33630_GRADE_TABLE viz) is ulpByNodes = [33.96, 100.13, 57.47, 61.82, 71.40, 78.36] over the imp-33539
 *   coarse budgets {200, 300, 500, 1000, 2000, 4000} inner GL-10 nodes at the imp-33577 graded-GL-failing rung
 *   n = 596. It is strongly non-monotone: 200 nodes clears the imp-33316 &lt; 64 ULP band (~34) but 300 nodes
 *   BOUNCES back OUT (~100) before settling near the band edge. imp-33600 flagged this as jittery
 *   (latticeJitterCaveat) but the COARSE {200,300,500,...} ladder samples the 200-300-node region at only two
 *   points -- it cannot distinguish (a) a single-panel lattice-jitter SPIKE at 300 nodes from (b) a genuine
 *   grade-6 ANTI-CONVERGENCE where the floor systematically RISES with node count through this region. This
 *   module re-runs the identical imp-33600 direct graded-GL A_direct(tau*) plateau at grade 6 on a DENSE
 *   integer-panel ladder (every panel P in [15,60] = 150..600 nodes) at n = 596 to locate the true floor and
 *   characterize the bounce.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   -----------------------------------------------------------------------
 *   At n = 596, tau* = saddleTau(596) ~ 0.97192. For every integer panel count P in [15,60] we score the
 *   direct graded-GL plateau A_direct(tau*) = int_0^7 phiKernel(s)phiKernel(s+tau*) ds (grade 6, GL-10 per
 *   panel, a_j = 7 (j/panels)^6) vs the imp-33213 INDEPENDENT log-domain target A_log, in ULP = A_log*2^-52.
 *   Panels P &lt;= 17 still sit on the unresolved ~e3-ULP inner-peak spike; the RESOLVED region is P &gt;= 18
 *   (&gt;= 180 nodes). Over the resolved region we (1) locate the global dense floor, (2) reproduce the coarse
 *   200/300-node samples, (3) measure the 300-node value against its LOCAL [270,330]-node median and immediate
 *   neighbors, and (4) fit ULP vs node-count (Pearson r, OLS slope) to test for a monotone upward trend.
 *
 *   MEASURED (n = 596, grade 6; ULP vs the imp-33213 A_log target):
 *
 *        coarse ladder reproduced:   200n ~34.0    300n ~100.1   (matches imp-33600 grade-6 row)
 *        dense resolved region P in [18,60] (180..600 nodes):
 *          global floor              ~6.1 ULP at 180 nodes  (WELL inside the &lt; 64 band)
 *          mean residual             ~71.9 ULP,  min ~6.1,  max ~101 (jittery, no smooth trend)
 *          300-node value            ~100.1 ULP;  local [270,330] median ~71.4;  ratio ~1.40
 *          immediate neighbours      290n ~59.2   310n ~74.0  (both FAR below the 300n ~100 spike)
 *          Pearson r(ulp, nodes)     ~ +0.30   (r^2 ~ 0.09; OLS slope ~ +0.044 ULP/node)
 *          windowed(3) floor         firstHalf ~55.8  vs  secondHalf ~63.8  (mild, floor stays in-band)
 *
 *   HEADLINE. The 200->300-node re-exit is PREDOMINANTLY a DENSE-LADDER LATTICE-JITTER artifact, NOT a genuine
 *   grade-6 anti-convergence. Three independent readings agree: (1) the 300-node ~100 ULP value is a
 *   SINGLE-PANEL jitter spike -- only ~1.40x its local [270,330]-node median (~71) and its immediate integer
 *   neighbours (290n ~59, 310n ~74) both sit far below it, so the spike does not persist even one panel to
 *   either side; (2) the TRUE floor in this region is ~6 ULP at 180 nodes -- WELL inside the imp-33316 &lt; 64
 *   band and BETTER than either coarse sample (the coarse ladder is 200-node ~34 was not even the local floor);
 *   (3) the resolved-region ULP-vs-node correlation is WEAK (Pearson r ~ +0.30, r^2 ~ 0.09) -- a genuine
 *   anti-convergence would show a strong monotone upward trend (r near +1 and a rising windowed floor), whereas
 *   here ~91% of the residual variance is high-frequency jitter and the windowed floor stays inside the band.
 *
 *   HONEST NUANCE. The correlation is not zero: there IS a WEAK secondary upward drift (r ~ +0.30, slope ~
 *   +0.044 ULP/node; windowed floor edges 55.8 -&gt; 63.8 across the region), the mild grade-6 lattice-floor
 *   coarsening imp-33621/imp-33638 documented near the middle cluster. But that drift is a small residual
 *   trend riding on top of dominant jitter; it is NOT the 200->300-node re-exit, which is a lattice-jitter
 *   spike, and it does not push the windowed floor out of the band. The re-exit is a coarse-ladder sampling
 *   artifact of the two-point {200,300} spacing, exactly as the imp-33605 dense-vs-coarse jitter warned.
 *
 *   VERDICT. GRADE-6-n=596-RE-EXIT-IS-A-DENSE-LADDER-JITTER-ARTIFACT-NOT-ANTI-CONVERGENCE. The imp-33630
 *   grade-6 200->300-node bounce is a single-panel lattice-jitter spike over a jittery ~50-100 ULP band whose
 *   TRUE floor (~6 ULP at 180 nodes) sits well inside the imp-33316 band and below the coarse 200-node sample;
 *   the ULP-vs-node trend is only weakly positive (r ~ +0.30), so there is no genuine grade-6 anti-convergence.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It characterizes the dense-panel
 *   structure of the imp-33630 grade-6 non-monotonicity at n = 596; it changes NO bound, patches NO literal,
 *   and establishes NO operator positivity. The per-panel ULP is a JITTERY arithmetic-floor lattice property
 *   (imp-33249/imp-33277/imp-33296/imp-33537/imp-33605 latticeJitterCaveat): the exact per-panel ULP and the
 *   exact floor location can shift under cross-platform libm exp/pow variation, so the robust reading is the
 *   QUALITATIVE separation -- a single-panel spike over a jittery band with an in-band floor and only a weak
 *   upward trend -- not the exact per-panel ULP. The NPHI = 10 Phi-series truncation is inherited upstream.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33600-band-crossing-grade-vs-node-driver.js (the coarse grade-6 budget row this densifies)
 *   @see imp-33630-grade-vs-node-budget-viz-data.js (the IMP33630_GRADE_TABLE viz that surfaced the bounce)
 *   @see imp-33605-graded-mapped-cc-abscissa-artifact-related (the dense-vs-coarse jitter precedent)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33641 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33316/imp-33539/imp-33557/imp-33600) --
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
//    Identical to imp-33600 aDirectGradedGL: the integrand phiKernel(s)phiKernel(s+tau) &gt;= 0, no cancel.
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
const N_FIXED = 596;           // the imp-33577 graded-GL-failing rung imp-33600 studied
const GRADE = 6;               // the imp-33600 grade-6 row whose 200->300-node bounce this densifies
const HI = 7;                  // the direct integrand upper limit (imp-33600)
const DENSE_LO_PANELS = 15;    // dense integer-panel ladder start (150 nodes)
const DENSE_HI_PANELS = 60;    // dense integer-panel ladder end (600 nodes)
const RESOLVED_PANELS = 18;    // panels &gt;= this (&gt;= 180 nodes) sit off the unresolved inner-peak spike
const DEEP_FLOOR_ULP = 64;     // the imp-33316 widened deep-tail band
const COARSE_200_PANELS = 20;  // the imp-33600/imp-33539 200-node budget
const COARSE_300_PANELS = 30;  // the imp-33600/imp-33539 300-node budget (the bounce sample)
const LOCAL_WINDOW_LO = 270;   // local-median window around the 300-node spike (nodes)
const LOCAL_WINDOW_HI = 330;

// -- Shared reference: tau* and the log-domain target A_log at the fixed rung ----------------------
const TAU_STAR = saddleTau(N_FIXED);
const A_LOG = aLog(TAU_STAR);
const ULP_OF_A_LOG = A_LOG * U;

// -- Dense integer-panel ladder P in [15,60] (nodes 150..600) at grade 6 --------------------------
const DENSE_LADDER = [];
for (let p = DENSE_LO_PANELS; p <= DENSE_HI_PANELS; p += 1) {
  const ulp = Math.abs(aDirectGradedGL(TAU_STAR, HI, p, GRADE) - A_LOG) / ULP_OF_A_LOG;
  DENSE_LADDER.push(Object.freeze({ panels: p, nodes: 10 * p, ulp, inBand: ulp < DEEP_FLOOR_ULP }));
}
Object.freeze(DENSE_LADDER);

// -- Coarse-sample reproduction (must match the imp-33600 grade-6 row) -----------------------------
const ulpAt = (panels) => DENSE_LADDER.find((r) => r.panels === panels).ulp;
const COARSE_200_ULP = ulpAt(COARSE_200_PANELS);
const COARSE_300_ULP = ulpAt(COARSE_300_PANELS);

// -- Resolved region (panels &gt;= 18) statistics --------------------------------------------------
const RESOLVED = DENSE_LADDER.filter((r) => r.panels >= RESOLVED_PANELS);
const globalFloor = RESOLVED.reduce((a, b) => (b.ulp < a.ulp ? b : a));
const GLOBAL_FLOOR_ULP = globalFloor.ulp;
const GLOBAL_FLOOR_NODES = globalFloor.nodes;
const RESOLVED_MEAN_ULP = RESOLVED.reduce((s, r) => s + r.ulp, 0) / RESOLVED.length;
const RESOLVED_MAX_ULP = Math.max(...RESOLVED.map((r) => r.ulp));

// -- 300-node spike vs its LOCAL median and immediate integer neighbours ---------------------------
const localWin = RESOLVED
  .filter((r) => r.nodes >= LOCAL_WINDOW_LO && r.nodes <= LOCAL_WINDOW_HI)
  .map((r) => r.ulp)
  .sort((a, b) => a - b);
const LOCAL_MEDIAN_ULP = localWin[Math.floor(localWin.length / 2)];
const SPIKE_OVER_LOCAL_MEDIAN = COARSE_300_ULP / LOCAL_MEDIAN_ULP;
const NEIGHBOR_LO_ULP = ulpAt(COARSE_300_PANELS - 1); // 290 nodes
const NEIGHBOR_HI_ULP = ulpAt(COARSE_300_PANELS + 1); // 310 nodes
// Both immediate neighbours sit BELOW the 300-node spike => the spike does not persist one panel to either side.
const SPIKE_IS_SINGLE_PANEL = NEIGHBOR_LO_ULP < COARSE_300_ULP && NEIGHBOR_HI_ULP < COARSE_300_ULP;

// -- Monotone-trend test: OLS ULP vs node-count over the resolved region (Pearson r, slope) --------
const xs = RESOLVED.map((r) => r.nodes);
const ys = RESOLVED.map((r) => r.ulp);
const nR = xs.length;
const meanX = xs.reduce((a, b) => a + b, 0) / nR;
const meanY = ys.reduce((a, b) => a + b, 0) / nR;
let sxy = 0;
let sxx = 0;
let syy = 0;
for (let i = 0; i < nR; i += 1) {
  sxy += (xs[i] - meanX) * (ys[i] - meanY);
  sxx += (xs[i] - meanX) ** 2;
  syy += (ys[i] - meanY) ** 2;
}
const OLS_SLOPE_ULP_PER_NODE = sxy / sxx;
const PEARSON_R = sxy / Math.sqrt(sxx * syy);
const R_SQUARED = PEARSON_R * PEARSON_R;

// -- Windowed(3) floor: first-half vs second-half average (does the floor rise with nodes?) --------
const rollFloor = [];
for (let i = 1; i < RESOLVED.length - 1; i += 1) {
  rollFloor.push(Math.min(RESOLVED[i - 1].ulp, RESOLVED[i].ulp, RESOLVED[i + 1].ulp));
}
const halfR = Math.floor(rollFloor.length / 2);
const avg = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
const WINDOWED_FLOOR_FIRST_HALF = avg(rollFloor.slice(0, halfR));
const WINDOWED_FLOOR_SECOND_HALF = avg(rollFloor.slice(halfR));
const WINDOWED_FLOOR_MIN = Math.min(...rollFloor);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: dense integer-panel ladder P in [15,60] at grade 6, n=596.
const denseScanCovered =
  DENSE_LADDER.length === DENSE_HI_PANELS - DENSE_LO_PANELS + 1 &&
  DENSE_LADDER[0].panels === DENSE_LO_PANELS && GRADE === 6 && N_FIXED === 596;
// (2) The coarse imp-33600 grade-6 samples are reproduced: 200n clears the band (~34), 300n bounces out (~100).
const coarseBounceReproduced =
  COARSE_200_ULP < DEEP_FLOOR_ULP && COARSE_300_ULP > DEEP_FLOOR_ULP && COARSE_300_ULP > 90;
// (3) The 300-node bounce is a SINGLE-PANEL lattice-jitter spike: modest over its local median and both
//     immediate integer neighbours sit below it (the spike does not persist one panel to either side).
const spikeIsLocalJitter = SPIKE_IS_SINGLE_PANEL && SPIKE_OVER_LOCAL_MEDIAN < 2;
// (4) The TRUE dense floor is WELL inside the band and BETTER than the coarse 200-node sample.
const trueFloorWellInBand = GLOBAL_FLOOR_ULP < 32 && GLOBAL_FLOOR_ULP < COARSE_200_ULP;
// (5) NO genuine anti-convergence: the resolved-region ULP-vs-node correlation is WEAK (not a monotone rise).
const notAntiConvergence = PEARSON_R < 0.5 && R_SQUARED < 0.25 && WINDOWED_FLOOR_MIN < DEEP_FLOOR_ULP;
// (6) HONEST NUANCE: a WEAK secondary upward drift is present (r positive, windowed floor edges up) but small.
const weakSecondaryDriftPresent =
  PEARSON_R > 0.1 && OLS_SLOPE_ULP_PER_NODE > 0 && WINDOWED_FLOOR_SECOND_HALF > WINDOWED_FLOOR_FIRST_HALF;

const verdict =
  denseScanCovered && coarseBounceReproduced && spikeIsLocalJitter && trueFloorWellInBand && notAntiConvergence
    ? 'GRADE-6-n=596-200->300-NODE-RE-EXIT-IS-A-DENSE-LADDER-LATTICE-JITTER-ARTIFACT-NOT-A-GENUINE-GRADE-6-' +
      'ANTI-CONVERGENCE.-A-DENSE-INTEGER-PANEL-LADDER-P-in-[15,60]-(150..600-NODES)-AT-n=596-GRADE-6-REPRODUCES-' +
      'THE-imp-33630-COARSE-SAMPLES-(200n-~34-IN-BAND,-300n-~100-OUT)-BUT-SHOWS-THE-300-NODE-~100-ULP-VALUE-IS-A-' +
      'SINGLE-PANEL-SPIKE-(~1.40x-ITS-LOCAL-[270,330]-NODE-MEDIAN-~71;-IMMEDIATE-NEIGHBOURS-290n-~59-AND-310n-~74-' +
      'BOTH-FAR-BELOW),-THE-TRUE-FLOOR-IS-~6-ULP-AT-180-NODES-(WELL-INSIDE-THE-imp-33316-<64-BAND-AND-BELOW-THE-' +
      'COARSE-200-NODE-~34-SAMPLE),-AND-THE-RESOLVED-REGION-ULP-VS-NODE-CORRELATION-IS-WEAK-(PEARSON-r-~+0.30,-' +
      'r^2-~0.09,-SLOPE-~+0.044-ULP/NODE)-NOT-THE-STRONG-MONOTONE-RISE-A-GENUINE-ANTI-CONVERGENCE-WOULD-SHOW.-' +
      'HONEST-NUANCE:-A-WEAK-SECONDARY-UPWARD-DRIFT-IS-PRESENT-(WINDOWED-FLOOR-~55.8->63.8)-THE-MILD-imp-33621/' +
      'imp-33638-GRADE-6-LATTICE-FLOOR-COARSENING,-BUT-IT-RIDES-ON-DOMINANT-JITTER-AND-DOES-NOT-PUSH-THE-WINDOWED-' +
      'FLOOR-OUT-OF-BAND.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-' +
      'NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY = Object.freeze({
  id: 'imp-33641-grade6-node-budget-non-monotonicity',
  ticket: 'imp-33641',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33600-band-crossing-grade-vs-node-driver.js',
  crossValidatesModules: [
    'imp-33600-band-crossing-grade-vs-node-driver.js',
    'imp-33630-grade-vs-node-budget-viz-data.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'DENSE-LADDER assessment of the imp-33630 grade-6 n=596 node-budget non-monotonicity: the imp-33600 grade-6 row ' +
    'DROPS to ~34 ULP at 200 nodes then BOUNCES back OUT to ~100 ULP at 300 nodes before settling. Re-running the ' +
    'identical direct graded-GL A_direct(tau*) plateau (grade 6, GL-10 per panel) on EVERY integer panel P in [15,60] ' +
    '(150..600 inner nodes) at n=596 vs the imp-33213 A_log target shows the 200->300-node re-exit is a DENSE-LADDER ' +
    'LATTICE-JITTER artifact, NOT a genuine grade-6 anti-convergence. The 300-node ~100 ULP value is a SINGLE-PANEL ' +
    'spike (~1.40x its local [270,330]-node median ~71; immediate neighbours 290n ~59, 310n ~74 both far below); the ' +
    'TRUE floor is ~6 ULP at 180 nodes (well inside the imp-33316 &lt; 64 band and below the coarse 200-node sample); ' +
    'and the resolved-region ULP-vs-node correlation is WEAK (Pearson r ~ +0.30, r^2 ~ 0.09, slope ~ +0.044 ULP/node), ' +
    'not the strong monotone rise anti-convergence would show. HONEST NUANCE: a weak secondary upward drift is present ' +
    '(windowed floor ~55.8 -> 63.8, the mild imp-33621/imp-33638 grade-6 lattice-floor coarsening) but it rides on ' +
    'dominant jitter and keeps the windowed floor in band. VERDICT: DENSE-LADDER-JITTER-ARTIFACT-NOT-ANTI-CONVERGENCE. ' +
    'ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; operator ' +
    'positivity (imp-3066) untouched; no QED. PT Lambda &lt;= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rung: 'the imp-33577 graded-GL-failing rung n=596, tau* = root of n = 4 pi tau* e^{4 tau*}',
    rule: 'the imp-33600 direct graded-GL A_direct(tau*) plateau, grade 6, a_j = 7 (j/panels)^6, GL-10 per panel',
    denseLadder: 'EVERY integer panel P in [15,60] = 150..600 inner GL-10 nodes (vs the imp-33539 coarse {200,300,500,...})',
    resolvedRegion: 'panels >= 18 (>= 180 nodes) sit off the unresolved ~e3-ULP inner-peak spike at P <= 17',
    scoring: 'residual of A_direct(tau*) vs the imp-33213 log-domain target A_log, in ULP = A_log * 2^-52',
    spikeTest: 'the 300-node value vs its local [270,330]-node median and immediate integer neighbours (290n, 310n)',
    trendTest: 'OLS Pearson r and slope of ULP vs node-count over the resolved region -- tests for a monotone upward rise',
    selfComputing: 'every panel, every statistic, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nFixed: N_FIXED,
    grade: GRADE,
    saddleTau: TAU_STAR,
    aLog: A_LOG,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    denseLoPanels: DENSE_LO_PANELS,
    denseHiPanels: DENSE_HI_PANELS,
    resolvedPanels: RESOLVED_PANELS,
    denseLadder: DENSE_LADDER,
    coarse200Ulp: COARSE_200_ULP,
    coarse300Ulp: COARSE_300_ULP,
    globalFloorUlp: GLOBAL_FLOOR_ULP,
    globalFloorNodes: GLOBAL_FLOOR_NODES,
    resolvedMeanUlp: RESOLVED_MEAN_ULP,
    resolvedMaxUlp: RESOLVED_MAX_ULP,
    localMedianUlp: LOCAL_MEDIAN_ULP,
    spikeOverLocalMedian: SPIKE_OVER_LOCAL_MEDIAN,
    neighborLoUlp: NEIGHBOR_LO_ULP,
    neighborHiUlp: NEIGHBOR_HI_ULP,
    spikeIsSinglePanel: SPIKE_IS_SINGLE_PANEL,
    olsSlopeUlpPerNode: OLS_SLOPE_ULP_PER_NODE,
    pearsonR: PEARSON_R,
    rSquared: R_SQUARED,
    windowedFloorFirstHalf: WINDOWED_FLOOR_FIRST_HALF,
    windowedFloorSecondHalf: WINDOWED_FLOOR_SECOND_HALF,
    windowedFloorMin: WINDOWED_FLOOR_MIN,
    denseScanCovered,
    coarseBounceReproduced,
    spikeIsLocalJitter,
    trueFloorWellInBand,
    notAntiConvergence,
    weakSecondaryDriftPresent,
    verdict,
  }),

  interpretation: Object.freeze({
    spikeIsSinglePanelJitter:
      'The 300-node ~100 ULP value the imp-33630 coarse ladder flagged is a SINGLE-PANEL lattice-jitter spike: it is ' +
      'only ~1.40x its local [270,330]-node median (~71 ULP), and its immediate integer neighbours -- 290 nodes ~59 ULP ' +
      'and 310 nodes ~74 ULP -- both sit far below it, so the spike does not persist even one panel to either side.',
    trueFloorBeatsCoarse:
      'The true floor over the resolved dense region is ~6 ULP at 180 nodes -- WELL inside the imp-33316 &lt; 64 ULP ' +
      'band and BELOW the coarse 200-node ~34 ULP sample. The coarse {200,300} two-point spacing missed both the local ' +
      'floor and the true structure of the region: what looked like a clean 34->100 re-exit is a jittery ~50-100 ULP ' +
      'band with a deep in-band notch the coarse ladder never sampled.',
    noAntiConvergence:
      'A genuine grade-6 anti-convergence would show the floor systematically RISING with node count (Pearson r near ' +
      '+1, a rising windowed floor). Instead the resolved-region ULP-vs-node correlation is WEAK (r ~ +0.30, r^2 ~ 0.09, ' +
      'slope ~ +0.044 ULP/node): ~91% of the residual variance is high-frequency jitter, and the windowed floor stays ' +
      'inside the band. The re-exit is a coarse-ladder sampling artifact, not anti-convergence.',
    honestWeakDrift:
      'The correlation is not zero. There IS a WEAK secondary upward drift (r ~ +0.30; windowed(3) floor edges ~55.8 -> ' +
      '~63.8 across the region) -- the mild grade-6 lattice-floor coarsening imp-33621/imp-33638 documented near the ' +
      'middle cluster. But that drift is a small residual trend riding on dominant jitter; it is NOT the 200->300-node ' +
      're-exit (a single-panel spike) and it does not push the windowed floor out of band.',
    latticeJitterCaveat:
      'The per-panel ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33605): the exact per-panel ULP and the exact floor location can shift under cross-platform libm exp/pow ' +
      'variation. The robust reading is the QUALITATIVE separation -- a single-panel spike over a jittery band with an ' +
      'in-band floor and only a weak upward trend -- not the exact per-panel ULP or the exact floor node count.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Characterizes the dense-panel structure of the imp-33630 grade-6 node-budget non-monotonicity at n=596 by ' +
      're-running the imp-33600 direct graded-GL A_direct(tau*) plateau (grade 6) on every integer panel P in [15,60] ' +
      'and testing the 200->300-node re-exit for single-panel jitter vs monotone anti-convergence. It changes NO bound, ' +
      'patches NO literal, and establishes NO operator positivity. Grid-design measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33600/imp-33577/imp-33539/imp-33316/imp-33213; this ' +
      'audits the dense-panel structure of the inner quadrature at n=596, not that truncation.',
    latticeJitterCaveat:
      'The per-panel ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33605): individual panels bounce (300 nodes ~100 vs neighbours ~59/~74) and cross-platform libm exp/pow ' +
      'variation can shift the few-ULP measurements, so the robust reading is the QUALITATIVE separation -- a ' +
      'single-panel spike over a jittery band with a ~6 ULP in-band floor and only a weak (r ~ +0.30) upward trend -- ' +
      'not the exact per-panel ULP, the exact floor node count, or the exact correlation coefficient.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY_ASSERTIONS = [
  {
    id: 'imp33641-dense-scan-covered',
    why: 'The scan must cover every integer panel P in [15,60] at grade 6, n=596 (the dense densification of the ' +
         'imp-33600 grade-6 coarse budget row).',
    holds: () => denseScanCovered && DENSE_LADDER.length === DENSE_HI_PANELS - DENSE_LO_PANELS + 1,
  },
  {
    id: 'imp33641-coarse-bounce-reproduced',
    why: 'The dense ladder must reproduce the imp-33600 grade-6 coarse samples: 200 nodes clears the band (&lt; 64 ULP) ' +
         'and 300 nodes bounces back OUT (&gt; 90 ULP) -- the non-monotonicity this ticket assesses.',
    holds: () => coarseBounceReproduced && COARSE_200_ULP < DEEP_FLOOR_ULP && COARSE_300_ULP > 90,
  },
  {
    id: 'imp33641-300-node-spike-is-single-panel-jitter',
    why: 'THE HEADLINE: the 300-node bounce is a SINGLE-PANEL lattice-jitter spike -- modest over its local median ' +
         '(&lt; 2x) and BOTH immediate integer neighbours (290n, 310n) sit below it.',
    holds: () => spikeIsLocalJitter && SPIKE_IS_SINGLE_PANEL && SPIKE_OVER_LOCAL_MEDIAN < 2,
  },
  {
    id: 'imp33641-true-floor-well-in-band',
    why: 'The true dense floor must sit WELL inside the imp-33316 &lt; 64 band (&lt; 32 ULP) and BELOW the coarse ' +
         '200-node sample -- the coarse ladder missed the local floor.',
    holds: () => trueFloorWellInBand && GLOBAL_FLOOR_ULP < 32 && GLOBAL_FLOOR_ULP < COARSE_200_ULP,
  },
  {
    id: 'imp33641-not-anti-convergence',
    why: 'THE HEADLINE: no genuine grade-6 anti-convergence -- the resolved-region ULP-vs-node correlation is WEAK ' +
         '(Pearson r &lt; 0.5, r^2 &lt; 0.25) and the windowed floor stays in band, not the strong monotone rise ' +
         'anti-convergence would show.',
    holds: () => notAntiConvergence && PEARSON_R < 0.5 && WINDOWED_FLOOR_MIN < DEEP_FLOOR_ULP,
  },
  {
    id: 'imp33641-honest-weak-secondary-drift',
    why: 'Mandatory honesty: a WEAK secondary upward drift IS present (r positive, windowed floor edges up) -- the ' +
         'verdict is jitter-dominant, not a claim of zero trend.',
    holds: () => weakSecondaryDriftPresent && PEARSON_R > 0.1,
  },
  {
    id: 'imp33641-verdict-records-jitter-artifact',
    why: 'The classified verdict must record the DENSE-LADDER-JITTER-ARTIFACT-NOT-ANTI-CONVERGENCE reading, not ' +
         'indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33641-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY.honestCaveat;
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

for (const assertion of IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33641-grade6-node-budget-non-monotonicity assertion failed: ${assertion.id}`);
  }
}
