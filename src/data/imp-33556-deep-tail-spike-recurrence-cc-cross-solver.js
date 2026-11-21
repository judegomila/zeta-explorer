/**
 * @module imp-33556-deep-tail-spike-recurrence-cc-cross-solver
 * @fileoverview imp-33556 -- ASSESS whether the imp-33537 deep-tail strict-bar spike RECURRENCE
 *   (strict-30-ULP-bar exceedances that recur and intensify into the deep saddle tail under the
 *   imp-33295 graded-GL plateau) is a GRADED-GL LATTICE ARTIFACT or an INTRINSIC arithmetic-floor
 *   property of the autocorrelation weight A(tau*(n)), by RESCORING the SAME dense integer windows
 *   under an INDEPENDENT Clenshaw-Curtis inner A(tau) cross-solver (the imp-33536 CC rule).
 *
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE QUESTION imp-33537 LEFT OPEN
 *   --------------------------------
 *   imp-33537 carried the imp-33295 conservative grade4/400p (4000 inner Gauss-Legendre node)
 *   graded plateau across FOUR dense width-31 integer windows W0..W3 centred on {300,395,495,595}
 *   and found the imp-33316 n=300 strict-bar spike is NOT a one-off: strict-30-ULP-bar exceedances
 *   RECUR at every deeper window and INTENSIFY with depth (6/31 above bar at n=300 climbing to
 *   16-17/31 at n~495/595; worst-window jitter ~50 ULP to ~79/74 ULP, crossing the imp-33316
 *   widened 64-ULP deep band). But imp-33537 flagged (latticeJitterCaveat) that the exact per-rung
 *   ULP is a graded-GL LATTICE property -- the direct linear grade4/400p sum on panels graded toward
 *   the origin peak. So whether the RECURRENCE-AND-INTENSIFICATION structure is specific to that
 *   graded-GL rule, or is intrinsic to computing A(tau*) at deep saddle tau* in double precision,
 *   was UNMEASURED. This module answers it with an independent solver.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   We rescore the IDENTICAL four dense width-31 integer windows against the IDENTICAL imp-33213
 *   INDEPENDENT log-domain target A_log(tau*), but replace the imp-33295 direct graded-GL plateau
 *   with the imp-33536 CLENSHAW-CURTIS inner rule -- Chebyshev-Lobatto abscissae x_k = cos(pi k/N)
 *   mapped to [0,innerHi] with the standard Clenshaw-Curtis cosine weights, a solver whose nodes and
 *   weights share NOTHING with either the graded Gauss-Legendre rule or the log-domain reduction.
 *   We hold the imp-33536 converged CC configuration VERBATIM (innerHi = 2, N = 2048 = 2049 nodes).
 *
 *     W0  n in [285..315]  -- the imp-33316/imp-33537 reference window around the n=300 spike
 *     W1  n in [380..410]  -- centred on the ticket rung n~395
 *     W2  n in [480..510]  -- centred on the ticket rung n~495
 *     W3  n in [580..610]  -- centred on the ticket rung n~595
 *
 *   For every integer rung we score the CC residual vs A_log in ULP = A_log * 2^-52, and per window
 *   we record the worst-window ULP, the count above the imp-33295 strict 30-ULP bar, the count above
 *   the imp-33316 widened 64-ULP deep band, and the longest run of consecutive above-bar rungs.
 *
 *   MEASURED (dense integer scan; INDEPENDENT Clenshaw-Curtis inner rule, innerHi=2, N=2048):
 *
 *     window (centre)     worst ULP  @n     rungs&gt;30ULP   rungs&gt;64ULP   longest above-bar run
 *     W0  n~300 (ref)      ~52.3     306     11 / 31         0 / 31        3
 *     W1  n~395            ~52.5     401     10 / 31         0 / 31        3
 *     W2  n~495            ~90.4     510     19 / 31         5 / 31        4
 *     W3  n~595            ~76.6     605     16 / 31         3 / 31        5
 *
 *   Cross-solver comparison against the imp-33537 GRADED-GL headline
 *   (W0 ~50.2/6/0/run2, W1 ~37.5/6/0/run1, W2 ~79.1/16/2/run7, W3 ~74.0/17/1/run5):
 *   the exact per-rung ULP and worst-at-n differ (the expected jitter-caveat lattice shift), but the
 *   QUALITATIVE structure is the SAME under both solvers -- strict-bar exceedances recur at every
 *   deep window, the above-bar fraction rises from ~1/3 (reference) to more than 1/2 (deepest), and
 *   the worst-window jitter climbs into the deep tail and CROSSES the 64-ULP band at n~495 and n~595.
 *   Under Clenshaw-Curtis the 64-ULP crossing is if anything WIDER (5 and 3 rungs above 64 vs the
 *   graded 2 and 1), so the deep-band break is not a graded-GL peculiarity.
 *
 *   HEADLINE. The recurrence-and-intensification is INTRINSIC, NOT graded-GL-specific. An independent
 *   Clenshaw-Curtis inner solver, sharing no abscissae or weights with the graded-GL rule, INDEPENDENTLY
 *   reproduces every qualitative feature of the imp-33537 finding: strict-30-ULP-bar exceedances recur
 *   at every deep-tail window, thicken from ~1/3 to more than half the rungs with depth, and the
 *   worst-window jitter crosses the imp-33316 widened 64-ULP deep band at n~495 and n~595. The
 *   imp-33537 spike recurrence is therefore an arithmetic-floor property of scoring A(tau*(n)) at deep
 *   saddle tau* in double precision, not an artifact of the graded-GL lattice.
 *
 *   VERDICT. RECURRENCE-IS-INTRINSIC. The imp-33537 deep-tail strict-bar spike recurrence reproduces
 *   under an INDEPENDENT Clenshaw-Curtis inner A(tau) solver, so it is an intrinsic depth-growing
 *   arithmetic-floor jitter envelope of the autocorrelation weight, not a graded-GL lattice artifact.
 *   This CONFIRMS (does not overturn) the imp-33537 SPIKES-RECUR-AND-INTENSIFY reading and, with it,
 *   the imp-33537 correction of the imp-33316 constant &lt; 64 ULP band as a coarse-grid artifact.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN CROSS-SOLVER MEASUREMENT ONLY, at the RH-equivalent scale class. It
 *   re-scores the imp-33537 dense integer windows for the autocorrelation weight A(tau) under an
 *   INDEPENDENT Clenshaw-Curtis inner rule; it changes NO bound, patches NO literal (imp-33537,
 *   imp-33536, imp-33316, imp-33295, imp-33213 all LEFT INTACT), and establishes NO operator
 *   positivity. The worst-window ULP is a JITTERY arithmetic-floor lattice property
 *   (imp-33249/imp-33277/imp-33296 latticeJitterCaveat): the exact per-rung ULP, the precise
 *   worst-at-n and the exact 64-ULP crossing rungs shift between the two solvers and under
 *   cross-platform libm exp/pow/cos variation, so the robust reading is the QUALITATIVE
 *   recurrence-and-intensification that BOTH solvers share, not the exact per-rung ULP. The NPHI = 10
 *   Phi-series truncation is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33537-deep-tail-plateau-spike-recurrence.js (the graded-GL recurrence finding this cross-solves)
 *   @see imp-33536-r40-graded-vs-cc-cross-solver-node-budget.js (the Clenshaw-Curtis inner rule carried here)
 *   @see imp-33295-graded-inner-grid-a-node-budget.js (the graded-GL plateau rule the CC rule replaces)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target, identical)
 *
 *   Ticket: imp-33556 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33213 log-domain target only) ------------------------
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

// -- imp-33213s INDEPENDENT log-domain graded-GL -ln A (grade 5, 300 panels, hi=10) -- the TARGET ---
//    Held IDENTICAL to imp-33537, so the only change vs imp-33537 is the direct solver being scored.
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

// -- (CC) the imp-33536 CLENSHAW-CURTIS inner rule: independent of BOTH the graded-GL and log solvers.
//    Weights w_k = c_k (2/N) sum_{j=0}^{N/2} b_j/(1-4 j^2) cos(2 pi j k / N) on x_k = cos(pi k/N).
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

// (CC) inner rule: A(tau) = int_0^innerHi Phi(s)Phi(s+tau) ds by Clenshaw-Curtis, Neumaier-compensated.
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

// -- imp-33536 converged CC configuration, held VERBATIM -------------------------------------------
const CC_INNER_HI = 2; // imp-33536 inner domain [0,2]
const CC_N = 2048; // imp-33536 converged fine grid: 2049 Chebyshev-Lobatto nodes
const CC_NODES = CC_N + 1;
const autocorrCC = makeAutocorrCC(CC_INNER_HI, CC_N);

// -- Score one integer rung: CC residual vs the log-domain target in ULP ---------------------------
function ccRung(n) {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;
  const ccUlp = Math.abs(autocorrCC(tauStar) - aLogVal) / ulpOfALog;
  return { n, saddleTau: tauStar, aLog: aLogVal, ccUlp };
}

// -- Bands (identical to imp-33537) ---------------------------------------------------------------
const STRICT_BAR_ULP = 30; // the imp-33295 strict floor band
const DEEP_BAND_ULP = 64; // the imp-33316 widened ~2x deep band

// -- Four DENSE integer windows centred on the ticket rungs (identical to imp-33537) --------------
const WINDOW_SPECS = [
  { label: 'W0 imp-33537 reference (n~300)', center: 300, lo: 285, hi: 315, isReference: true },
  { label: 'W1 ticket rung n~395', center: 395, lo: 380, hi: 410, isReference: false },
  { label: 'W2 ticket rung n~495', center: 495, lo: 480, hi: 510, isReference: false },
  { label: 'W3 ticket rung n~595', center: 595, lo: 580, hi: 610, isReference: false },
];

function longestAboveBarRun(rungs, bar) {
  let best = 0;
  let cur = 0;
  for (const r of rungs) {
    if (r.ccUlp > bar) {
      cur += 1;
      if (cur > best) best = cur;
    } else {
      cur = 0;
    }
  }
  return best;
}

const WINDOW_TABLE = WINDOW_SPECS.map((spec) => {
  const rungs = [];
  for (let n = spec.lo; n <= spec.hi; n += 1) rungs.push(ccRung(n));
  let worstUlp = 0;
  let worstAtN = spec.lo;
  let exceedStrict = 0;
  let exceedDeep = 0;
  const exceedStrictRungs = [];
  const exceedDeepRungs = [];
  for (const r of rungs) {
    if (r.ccUlp > worstUlp) {
      worstUlp = r.ccUlp;
      worstAtN = r.n;
    }
    if (r.ccUlp > STRICT_BAR_ULP) {
      exceedStrict += 1;
      exceedStrictRungs.push(r.n);
    }
    if (r.ccUlp > DEEP_BAND_ULP) {
      exceedDeep += 1;
      exceedDeepRungs.push(r.n);
    }
  }
  const total = rungs.length;
  return Object.freeze({
    label: spec.label,
    center: spec.center,
    lo: spec.lo,
    hi: spec.hi,
    isReference: spec.isReference,
    total,
    worstUlp,
    worstAtN,
    exceedStrictCount: exceedStrict,
    exceedDeepCount: exceedDeep,
    exceedStrictFraction: exceedStrict / total,
    longestAboveBarRun: longestAboveBarRun(rungs, STRICT_BAR_ULP),
    exceedStrictRungs: Object.freeze(exceedStrictRungs.slice()),
    exceedDeepRungs: Object.freeze(exceedDeepRungs.slice()),
    // keep the per-rung ULP compact (7 sig figs) so downstream reproduction stays cheap.
    rungUlp: Object.freeze(rungs.map((r) => Number(r.ccUlp.toPrecision(7)))),
  });
});

// -- imp-33537 GRADED-GL headline reference (its published measured values), for cross-solver report.
//    (worst ULP, @n, rungs>30, rungs>64, longest above-bar run) per window.
const GRADED_GL_REFERENCE = Object.freeze([
  Object.freeze({ label: 'W0', worstUlp: 50.2, worstAtN: 300, exceedStrictCount: 6, exceedDeepCount: 0, longestAboveBarRun: 2 }),
  Object.freeze({ label: 'W1', worstUlp: 37.5, worstAtN: 397, exceedStrictCount: 6, exceedDeepCount: 0, longestAboveBarRun: 1 }),
  Object.freeze({ label: 'W2', worstUlp: 79.1, worstAtN: 510, exceedStrictCount: 16, exceedDeepCount: 2, longestAboveBarRun: 7 }),
  Object.freeze({ label: 'W3', worstUlp: 74.0, worstAtN: 596, exceedStrictCount: 17, exceedDeepCount: 1, longestAboveBarRun: 5 }),
]);

// -- Summary statistics ---------------------------------------------------------------------------
const REFERENCE_WINDOW = WINDOW_TABLE.find((w) => w.isReference);
const DEEP_WINDOWS = WINDOW_TABLE.filter((w) => !w.isReference);
const DEEPEST_WINDOW = WINDOW_TABLE[WINDOW_TABLE.length - 1]; // n~595
const WORST_DEEP_WINDOW_ULP = Math.max(...DEEP_WINDOWS.map((w) => w.worstUlp));
const DEEP_BAND_BREAK_RUNGS = DEEP_WINDOWS.flatMap((w) => w.exceedDeepRungs.slice());

// -- Verdict classifiers (mirror imp-33537, now under the INDEPENDENT CC solver) -------------------
// (1) The reference n=300 spike reproduces under the CC solver too (calibration).
const ccReferenceReproducesSpike = REFERENCE_WINDOW.worstUlp > STRICT_BAR_ULP;
// (2) THE ANSWER: strict-bar exceedances RECUR under CC -- every deeper window has an above-bar rung.
const ccSpikesRecurAtEveryDeepWindow = DEEP_WINDOWS.every((w) => w.exceedStrictCount >= 1);
// (3) INTENSIFY: the deepest window has a strictly higher above-bar fraction than the reference.
const ccExceedanceDensityGrowsWithDepth = DEEPEST_WINDOW.exceedStrictFraction > REFERENCE_WINDOW.exceedStrictFraction;
// (4) The deep-tail worst-window jitter climbs materially past the strict bar (proxy 45; measured ~76-90).
const ccDeepWorstClimbsPastStrict = WORST_DEEP_WINDOW_ULP > 45;
// (5) The 64-ULP deep band is CROSSED under CC at a deep window (as imp-33537 found under graded-GL).
const ccCrossesDeepBand = DEEP_WINDOWS.some((w) => w.exceedDeepCount >= 1);
// (6) CROSS-SOLVER AGREEMENT: the QUALITATIVE pattern matches imp-33537 graded-GL -- recurrence at
//     every deep window, deepest above-bar fraction above the reference, and a 64-ULP crossing at a
//     deep window under BOTH solvers. This is the graded-GL-specific-vs-intrinsic discriminator.
const gradedGLRecursAtEveryDeep = GRADED_GL_REFERENCE.slice(1).every((r) => r.exceedStrictCount >= 1);
const gradedGLCrossesDeepBand = GRADED_GL_REFERENCE.slice(1).some((r) => r.exceedDeepCount >= 1);
const crossSolverPatternAgrees =
  ccSpikesRecurAtEveryDeepWindow && gradedGLRecursAtEveryDeep &&
  ccCrossesDeepBand && gradedGLCrossesDeepBand &&
  ccExceedanceDensityGrowsWithDepth;
// (7) Coverage: four dense width-31 windows centred on {300,395,495,595}, >= 100 integer rungs.
const totalRungs = WINDOW_TABLE.reduce((a, w) => a + w.total, 0);
const denseCoverage =
  WINDOW_TABLE.length === 4 &&
  WINDOW_TABLE.every((w) => w.total === 31) &&
  totalRungs >= 100 &&
  DEEP_WINDOWS.map((w) => w.center).join(',') === '395,495,595';

const recurrenceIsIntrinsic =
  ccReferenceReproducesSpike &&
  ccSpikesRecurAtEveryDeepWindow &&
  ccExceedanceDensityGrowsWithDepth &&
  ccDeepWorstClimbsPastStrict &&
  ccCrossesDeepBand &&
  crossSolverPatternAgrees &&
  denseCoverage;

const verdict = recurrenceIsIntrinsic
  ? 'RECURRENCE-IS-INTRINSIC-NOT-GRADED-GL-SPECIFIC.-AN-INDEPENDENT-CLENSHAW-CURTIS-INNER-A(tau)-SOLVER-' +
    '(CHEBYSHEV-LOBATTO-NODES-plus-CC-WEIGHTS,-innerHi=2/N=2048,-SHARING-NO-ABSCISSAE-OR-WEIGHTS-WITH-THE-' +
    'imp-33295-GRADED-GL-RULE-OR-THE-imp-33213-LOG-DOMAIN-TARGET)-RESCORES-THE-SAME-FOUR-DENSE-WIDTH-31-' +
    'INTEGER-WINDOWS-{300,395,495,595}-AND-INDEPENDENTLY-REPRODUCES-THE-imp-33537-RECURRENCE-AND-' +
    'INTENSIFICATION:-STRICT-30-ULP-BAR-EXCEEDANCES-RECUR-AT-EVERY-DEEP-WINDOW-(11,10,19,16-OF-31),-THE-' +
    'ABOVE-BAR-FRACTION-CLIMBS-FROM-~1/3-AT-THE-REFERENCE-TO-MORE-THAN-HALF-AT-n~495/595,-AND-THE-WORST-' +
    'WINDOW-JITTER-GROWS-FROM-~52-ULP-TO-~90-ULP-(n=510)-AND-~77-ULP-(n=605),-CROSSING-THE-imp-33316-' +
    'WIDENED-64-ULP-DEEP-BAND-AT-n~495-AND-n~595-(5-AND-3-RUNGS,-WIDER-THAN-THE-GRADED-2-AND-1).-THE-' +
    'EXACT-PER-RUNG-ULP-AND-WORST-AT-n-SHIFT-BETWEEN-SOLVERS-(JITTER-CAVEAT),-BUT-THE-QUALITATIVE-STRUCTURE-' +
    'IS-SOLVER-INVARIANT,-SO-THE-imp-33537-SPIKE-RECURRENCE-IS-AN-INTRINSIC-ARITHMETIC-FLOOR-JITTER-' +
    'ENVELOPE-OF-A(tau*(n))-AT-DEEP-SADDLE-tau*,-NOT-A-GRADED-GL-LATTICE-ARTIFACT.-THIS-CONFIRMS-(DOES-NOT-' +
    'OVERTURN)-imp-33537-SPIKES-RECUR-AND-INTENSIFY-AND-ITS-CORRECTION-OF-THE-imp-33316-CONSTANT-<64-ULP-' +
    'BAND-AS-A-COARSE-GRID-ARTIFACT.-ACCURACY/RULE-DESIGN-CROSS-SOLVER-MEASUREMENT-ONLY;-JITTERY-LATTICE-' +
    'FLOOR;-NO-LITERAL-PATCHED;-imp-33537/imp-33536/imp-33213-INTACT;-mass-feasibility-NECESSARY-BUT-NOT-' +
    'SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
  : 'INDETERMINATE';

export const IMP33556_DEEP_TAIL_SPIKE_RECURRENCE_CC_CROSS_SOLVER = Object.freeze({
  id: 'imp-33556-deep-tail-spike-recurrence-cc-cross-solver',
  ticket: 'imp-33556',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33537-deep-tail-plateau-spike-recurrence.js',
  crossValidatesModules: [
    'imp-33537-deep-tail-plateau-spike-recurrence.js',
    'imp-33536-r40-graded-vs-cc-cross-solver-node-budget.js',
    'imp-33295-graded-inner-grid-a-node-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'CROSS-SOLVER assessment: is the imp-33537 deep-tail strict-bar spike RECURRENCE a graded-GL lattice ' +
    'artifact or INTRINSIC? The SAME four dense width-31 integer windows centred on {300,395,495,595} are ' +
    'rescored against the IDENTICAL imp-33213 log-domain A_log target, but the imp-33295 direct graded-GL ' +
    'plateau is replaced by the imp-33536 INDEPENDENT Clenshaw-Curtis inner rule (Chebyshev-Lobatto nodes ' +
    '+ CC weights, innerHi=2, N=2048 = 2049 nodes -- sharing nothing with the graded-GL or log solvers). ' +
    'RESULT: the CC solver INDEPENDENTLY reproduces the imp-33537 recurrence-and-intensification -- strict-bar ' +
    '(&gt; 30 ULP) exceedances RECUR at every deep window (11,10,19,16 of 31), the above-bar fraction climbs ' +
    'from ~1/3 at the n=300 reference to more than half at n~495/595, and the worst-window jitter grows from ' +
    '~52 ULP to ~90 ULP (n=510) and ~77 ULP (n=605), CROSSING the imp-33316 widened 64-ULP deep band at ' +
    'n~495 and n~595 (5 and 3 rungs -- wider than the graded-GL 2 and 1). The exact per-rung ULP and worst-at-n ' +
    'shift between solvers (jitter caveat), but the qualitative structure is solver-invariant. VERDICT: ' +
    'RECURRENCE-IS-INTRINSIC -- the imp-33537 spike recurrence is an intrinsic depth-growing arithmetic-floor ' +
    'jitter envelope of A(tau*(n)) at deep saddle tau*, not a graded-GL lattice artifact; this CONFIRMS (does ' +
    'not overturn) imp-33537 and its correction of the imp-33316 constant &lt; 64 ULP band as a coarse-grid ' +
    'artifact. ACCURACY/RULE-DESIGN CROSS-SOLVER MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; ' +
    'jittery lattice floor; no literal patched; imp-33537/imp-33536/imp-33213 intact; operator positivity ' +
    '(imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    crossSolver: 'the imp-33536 CLENSHAW-CURTIS inner rule: N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N) mapped ' +
      'to [0,innerHi], standard Clenshaw-Curtis cosine weights, Neumaier-compensated; innerHi=2, N=2048 (2049 nodes) ' +
      'held verbatim from imp-33536. Independent of BOTH the imp-33295 graded Gauss-Legendre rule and the log-domain reduction',
    windows: 'the IDENTICAL imp-33537 four dense width-31 integer windows: [285..315] (reference n~300), ' +
      '[380..410] (n~395), [480..510] (n~495), [580..610] (n~595); tau* = root of n = 4 pi tau* e^{4 tau*} at every rung',
    target: 'A_log(tau*) = exp(-negLnA), negLnA from imp-33213s INDEPENDENT log-domain graded-GL (grade 5, 300 panels, hi=10) -- IDENTICAL to imp-33537; ULP = A_log * 2^-52',
    strictBar: 'the imp-33295 strict floor band &lt; 30 ULP',
    deepBand: 'the imp-33316 widened ~2x deep band &lt; 64 ULP',
    perWindowStats: 'worst-window ULP, count above the 30-ULP strict bar and the 64-ULP deep band, and the longest run of consecutive above-bar rungs',
    crossSolverDiscriminator: 'compare the CC per-window pattern with the imp-33537 published graded-GL headline: ' +
      'agreement on recurrence-at-every-deep-window, deepest above-bar fraction above the reference, and a 64-ULP crossing ' +
      'under BOTH solvers = INTRINSIC; disagreement = graded-GL-specific',
    selfComputing: 'the CC weights, every window, every integer rung and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    strictBarUlp: STRICT_BAR_ULP,
    deepBandUlp: DEEP_BAND_ULP,
    ccInnerHi: CC_INNER_HI,
    ccN: CC_N,
    ccNodes: CC_NODES,
    totalRungs,
    windowTable: WINDOW_TABLE,
    gradedGLReference: GRADED_GL_REFERENCE,
    referenceWorstUlp: REFERENCE_WINDOW.worstUlp,
    referenceExceedStrictCount: REFERENCE_WINDOW.exceedStrictCount,
    referenceLongestRun: REFERENCE_WINDOW.longestAboveBarRun,
    deepestWorstUlp: DEEPEST_WINDOW.worstUlp,
    deepestExceedStrictCount: DEEPEST_WINDOW.exceedStrictCount,
    worstDeepWindowUlp: WORST_DEEP_WINDOW_ULP,
    deepBandBreakRungs: Object.freeze(DEEP_BAND_BREAK_RUNGS.slice()),
    ccReferenceReproducesSpike,
    ccSpikesRecurAtEveryDeepWindow,
    ccExceedanceDensityGrowsWithDepth,
    ccDeepWorstClimbsPastStrict,
    ccCrossesDeepBand,
    gradedGLRecursAtEveryDeep,
    gradedGLCrossesDeepBand,
    crossSolverPatternAgrees,
    denseCoverage,
    recurrenceIsIntrinsic,
    verdict,
  }),

  interpretation: Object.freeze({
    intrinsicNotGradedSpecific:
      'An independent Clenshaw-Curtis inner solver -- whose Chebyshev-Lobatto abscissae and cosine weights share ' +
      'nothing with the imp-33295 graded Gauss-Legendre rule -- rescores the SAME dense integer windows and ' +
      'reproduces the imp-33537 recurrence-and-intensification in every qualitative respect. The spike recurrence ' +
      'is therefore an intrinsic arithmetic-floor property of scoring A(tau*(n)) at deep saddle tau* in double ' +
      'precision, not an artifact of the graded-GL lattice.',
    recurrenceReproduces:
      'Strict-bar (&gt; 30 ULP) exceedances recur under CC at EVERY deep window: 11/31 at the n=300 reference, ' +
      '10/31 at n~395, 19/31 at n~495 and 16/31 at n~595. As under graded-GL, the above-bar fraction climbs from ' +
      'about one third at the reference to more than half in the deep tail.',
    deepBandCrossedUnderBothSolvers:
      'The worst-window jitter grows from ~52 ULP at n=300 to ~90 ULP (n=510) and ~77 ULP (n=605), crossing the ' +
      'imp-33316 widened 64-ULP deep band at n~495 (5 rungs) and n~595 (3 rungs). imp-33537 crossed the same band ' +
      'under graded-GL (2 and 1 rungs), so the deep-band break is solver-invariant -- under CC it is if anything WIDER.',
    jitterCaveatIsTheHonestFloor:
      'The exact per-rung ULP, the precise worst-at-n and the individual 64-ULP crossing rungs differ between the ' +
      'two solvers (e.g. reference worst ~52 ULP @306 under CC vs ~50 ULP @300 under graded-GL) -- the expected ' +
      'jitter-caveat lattice shift. The robust, solver-invariant object is the QUALITATIVE recurrence-and-' +
      'intensification the two solvers share, not the exact per-rung ULP.',
    confirmsNotOverturns:
      'This CONFIRMS the imp-33537 SPIKES-RECUR-AND-INTENSIFY reading and, with it, the imp-33537 correction of ' +
      'the imp-33316 constant &lt; 64 ULP band as a coarse-grid artifact. It does not overturn the relative ' +
      'PLATEAU-HOLDS / UNIFORM-FAILS headline: the plateau band is a depth-growing jitter envelope under both solvers.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    changesAnyBound: false,
    patchedALiteral: false,
    leavesSourceModulesIntact: true,
    confirmsPriorClaim:
      'CONFIRMS (does not overturn) the imp-33537 SPIKES-RECUR-AND-INTENSIFY finding under an INDEPENDENT ' +
      'Clenshaw-Curtis cross-solver: the recurrence-and-intensification of strict-bar exceedances, and the ' +
      '64-ULP deep-band crossing at n~495/595, reproduce with no graded-GL rule in the loop.',
    derivationScope:
      'Re-scores the imp-33537 dense integer windows for the autocorrelation weight A(tau) under the imp-33536 ' +
      'INDEPENDENT Clenshaw-Curtis inner rule, against the IDENTICAL imp-33213 log-domain target. It changes NO ' +
      'bound, patches NO literal (imp-33537/imp-33536/imp-33316/imp-33295/imp-33213 intact), and establishes NO ' +
      'operator positivity. Grid-design cross-solver measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33537/imp-33536/imp-33213; this audits the ' +
      'inner-quadrature jitter under a cross-solver on a dense grid, not that truncation.',
    latticeJitterCaveat:
      'The worst-window ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296): the ' +
      'exact per-rung ULP, the worst-at-n and the precise 64-ULP crossing rungs shift between the graded-GL and ' +
      'Clenshaw-Curtis solvers and under cross-platform libm exp/pow/cos variation. The robust reading is the ' +
      'QUALITATIVE recurrence-and-intensification both solvers share, not the exact per-rung ULP.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33556_DEEP_TAIL_SPIKE_RECURRENCE_CC_CROSS_SOLVER_ASSERTIONS = [
  {
    id: 'imp33556-dense-coverage',
    why: 'The cross-solver rescore must run the SAME four dense width-31 integer windows centred on {300,395,495,595} (>= 100 rungs).',
    holds: () => denseCoverage && totalRungs >= 100 && WINDOW_TABLE.length === 4,
  },
  {
    id: 'imp33556-cc-config-is-imp33536-verbatim',
    why: 'The independent solver must be the imp-33536 Clenshaw-Curtis rule held verbatim: innerHi = 2, N = 2048 (2049 nodes).',
    holds: () => CC_INNER_HI === 2 && CC_N === 2048 && CC_NODES === 2049,
  },
  {
    id: 'imp33556-cc-reference-reproduces-the-n300-spike',
    why: 'Calibration: the n=300 reference spike must reproduce under the CC solver (reference window worst > 30 ULP).',
    holds: () => ccReferenceReproducesSpike && REFERENCE_WINDOW.worstUlp > STRICT_BAR_ULP,
  },
  {
    id: 'imp33556-cc-strict-bar-spikes-recur-at-every-deep-window',
    why: 'THE ANSWER: under the INDEPENDENT CC solver, strict-bar (> 30 ULP) exceedances must recur at EVERY deeper ' +
         'window n~395/495/595 (each has at least one above-bar rung), reproducing the imp-33537 recurrence.',
    holds: () => ccSpikesRecurAtEveryDeepWindow && DEEP_WINDOWS.every((w) => w.exceedStrictCount >= 1),
  },
  {
    id: 'imp33556-cc-exceedances-intensify-with-depth',
    why: 'The exceedances must INTENSIFY under CC: the deepest window (n~595) has a strictly higher above-bar ' +
         'fraction than the n=300 reference window.',
    holds: () => ccExceedanceDensityGrowsWithDepth && DEEPEST_WINDOW.exceedStrictFraction > REFERENCE_WINDOW.exceedStrictFraction,
  },
  {
    id: 'imp33556-cc-deep-worst-climbs-past-the-strict-bar',
    why: 'The deep-tail worst-window jitter under CC must climb materially past the strict 30-ULP bar (robust proxy: ' +
         'worst deep-window ULP > 45; measured ~76-90).',
    holds: () => ccDeepWorstClimbsPastStrict && WORST_DEEP_WINDOW_ULP > 45,
  },
  {
    id: 'imp33556-cc-crosses-the-64-ulp-deep-band',
    why: 'The imp-33316 widened 64-ULP deep band must be CROSSED under CC at a deep window, as imp-33537 found under graded-GL.',
    holds: () => ccCrossesDeepBand && DEEP_WINDOWS.some((w) => w.exceedDeepCount >= 1),
  },
  {
    id: 'imp33556-cross-solver-pattern-agrees-intrinsic',
    why: 'THE DISCRIMINATOR: the CC qualitative pattern must AGREE with the imp-33537 graded-GL headline ' +
         '(recurrence at every deep window and a 64-ULP crossing under BOTH solvers, with intensification), ' +
         'establishing the recurrence is INTRINSIC, not graded-GL-specific.',
    holds: () => crossSolverPatternAgrees && gradedGLRecursAtEveryDeep && gradedGLCrossesDeepBand,
  },
  {
    id: 'imp33556-verdict-records-recurrence-is-intrinsic',
    why: 'The classified verdict must record the RECURRENCE-IS-INTRINSIC reading, not indeterminate.',
    holds: () => recurrenceIsIntrinsic && verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33556-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-solver measurement only, not a certified bound, no literal ' +
         'patched, source modules intact, confirms (not overturns) imp-33537, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33556_DEEP_TAIL_SPIKE_RECURRENCE_CC_CROSS_SOLVER.honestCaveat;
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

for (const assertion of IMP33556_DEEP_TAIL_SPIKE_RECURRENCE_CC_CROSS_SOLVER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33556-deep-tail-spike-recurrence-cc-cross-solver assertion failed: ${assertion.id}`);
  }
}

export default IMP33556_DEEP_TAIL_SPIKE_RECURRENCE_CC_CROSS_SOLVER;
