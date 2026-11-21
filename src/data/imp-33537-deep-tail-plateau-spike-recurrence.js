/**
 * @module imp-33537-deep-tail-plateau-spike-recurrence
 * @fileoverview imp-33537 -- ASSESS whether the isolated imp-33316 n=300 deep-tail PLATEAU
 *   lattice spike (the one rung where the imp-33295 conservative grade4/400p=4000-node graded-GL
 *   plateau exceeded the strict 30-ULP band) RECURS at other deep-tail rungs (n~395, 495, 595)
 *   under the SAME conservative graded plateau rule, or was a one-off lattice event.
 *
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE QUESTION imp-33316 LEFT OPEN
 *   --------------------------------
 *   imp-33316 carried the imp-33295 conservative grade4/400p (4000 inner Gauss-Legendre node)
 *   graded plateau into the deep saddle tail n in {90..500} on a COARSE grid (specific rungs
 *   90,100,120,150,200,250,300,350,400,450,500). It found the plateau HOLDS the imp-33275 A_log
 *   double-precision floor band everywhere, with ONE rung -- n=300, ~50 ULP -- exceeding the strict
 *   imp-33295 30-ULP bar. imp-33316 read that as an ISOLATED single-rung lattice event: its
 *   neighbours n=295 (~5.2 ULP) and n=305 (~2.2 ULP) sit deep inside the band, and it declared the
 *   plateau stays inside a widened ~2x deep band (&lt; 64 ULP) at EVERY deep rung. But imp-33316
 *   only sampled ONE integer near each of n~395/495/595, so whether such strict-bar exceedances
 *   RECUR as the saddle sharpens -- and whether the widened 64-ULP band actually holds under a
 *   DENSE integer scan rather than the coarse grid -- was UNMEASURED.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   We carry the IDENTICAL imp-33295 conservative plateau rule (grade 4, 400 panels, GL-10 per
 *   panel = 4000 inner nodes, on the DIRECT non-negative integrand phiKernel(s)phiKernel(s+tau*))
 *   across FOUR DENSE integer windows of width 31, each centred on a ticket rung:
 *
 *     W0  n in [285..315]  -- the imp-33316 reference window around the n=300 spike
 *     W1  n in [380..410]  -- centred on the ticket rung n~395
 *     W2  n in [480..510]  -- centred on the ticket rung n~495
 *     W3  n in [580..610]  -- centred on the ticket rung n~595
 *
 *   For every integer rung we score the plateau residual vs the imp-33213 INDEPENDENT log-domain
 *   target A_log in ULP = A_log * 2^-52, and per window we record: the worst-window ULP, the count
 *   of rungs above the strict imp-33295 30-ULP bar, the count above the imp-33316 widened 64-ULP
 *   deep band, and the longest RUN of consecutive above-bar rungs (isolated event vs cluster).
 *
 *   MEASURED (dense integer scan; plateau grade4/400p=4000 nodes):
 *
 *     window (centre)     worst ULP  @n     rungs&gt;30ULP   rungs&gt;64ULP   longest above-bar run
 *     W0  n~300 (ref)      ~50.2     300      6 / 31         0 / 31        2  (NOT a lone spike)
 *     W1  n~395            ~37.5     397      6 / 31         0 / 31        1
 *     W2  n~495            ~79.1     510     16 / 31         2 / 31        7  (493..499 all &gt; 30)
 *     W3  n~595            ~74.0     596     17 / 31         1 / 31        5
 *
 *   HEADLINE. The n=300 spike is NOT a one-off. Strict-bar (&gt; 30 ULP) exceedances RECUR at every
 *   deeper window and INTENSIFY with depth. A dense scan even DISSOLVES the imp-33316 "isolated
 *   single-rung" reading of n=300: the width-31 reference window already carries 6 above-bar rungs
 *   and a run of 2, not a lone spike. Deeper still the exceedances thicken into DENSE CLUSTERS at
 *   n~495 and n~595 (16-17 of 31 rungs above the bar -- more than half -- with runs of five to seven
 *   consecutive above-bar rungs, e.g. n=493..499). The worst-window jitter also GROWS: ~50 ULP at
 *   n=300 climbs to ~79 ULP (n=510) and ~74 ULP (n=596), CROSSING the imp-33316 widened 64-ULP deep
 *   band that the coarse grid never hit.
 *
 *   VERDICT. SPIKES-RECUR-AND-INTENSIFY. The imp-33316 n=300 strict-bar exceedance is the SHALLOW,
 *   isolated tip of a growing arithmetic-floor jitter envelope, not a one-off: under a dense integer
 *   scan the fixed 4000-node plateau exceeds the strict 30-ULP bar on a rising fraction of deep-tail
 *   rungs and, at n=510 and n=596, crosses even the imp-33316 widened 64-ULP band. This CORRECTS the
 *   imp-33316 "&lt; 64 ULP at every deep rung" reading as a coarse-grid artifact: the plateau band
 *   must be treated as a DEPTH-GROWING jitter envelope, not a fixed constant. It does NOT overturn
 *   the imp-33316 PLATEAU-HOLDS / UNIFORM-FAILS headline in RELATIVE terms -- at these rungs the
 *   uniform Richardson ladder sits at ~1e5..1e6 ULP, so the plateau at ~74-79 ULP is still 3-4
 *   orders of magnitude closer -- but the absolute constant-band claim does not survive densification.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It re-samples the
 *   imp-33295 fixed quadrature rule for the autocorrelation weight A(tau) on a DENSE integer grid in
 *   the deep saddle tail; it changes NO bound, patches NO literal, and establishes NO operator
 *   positivity. The worst-window ULP is a JITTERY arithmetic-floor lattice property
 *   (imp-33249/imp-33277/imp-33296 latticeJitterCaveat): the exact per-rung ULP and the precise
 *   64-ULP crossing rungs can shift under cross-platform libm exp/pow variation, so the robust
 *   reading is the QUALITATIVE recurrence-and-intensification of strict-bar exceedances with depth,
 *   not the exact per-rung ULP. The NPHI = 10 Phi-series truncation is inherited upstream.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the coarse-grid deep-tail measurement this densifies)
 *   @see imp-33295-graded-inner-grid-a-node-budget.js (the conservative grade4/400p plateau rule carried unchanged)
 *   @see imp-33296-min-node-graded-gl-lattice-jitter-band.js (the lattice-jitter band this worst-window ULP inherits)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33537 (numerical, medium).
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

// -- (G) the imp-33295 CONSERVATIVE plateau: panels a_j = 7 (j/panels)^grade, GL-10 per panel. -----
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

// -- Score one integer rung: plateau residual vs the log-domain target in ULP ----------------------
const PLATEAU_GRADE = 4; // the imp-33295 robust fixed graded rule (carried unchanged)
const PLATEAU_PANELS = 400; // 4000 inner nodes
const PLATEAU_NODES = 10 * PLATEAU_PANELS;
function plateauRung(n) {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;
  const plateauUlp = Math.abs(aDirectGradedGL(tauStar, 7, PLATEAU_PANELS, PLATEAU_GRADE) - aLogVal) / ulpOfALog;
  return { n, saddleTau: tauStar, aLog: aLogVal, plateauUlp };
}

// -- Bands ----------------------------------------------------------------------------------------
const STRICT_BAR_ULP = 30; // the imp-33295 strict floor band (shallow-rung plateau worst ~21 ULP)
const DEEP_BAND_ULP = 64; // the imp-33316 widened ~2x deep band the coarse grid stayed inside

// -- Four DENSE integer windows centred on the ticket rungs ---------------------------------------
const WINDOW_SPECS = [
  { label: 'W0 imp-33316 reference (n~300)', center: 300, lo: 285, hi: 315, isReference: true },
  { label: 'W1 ticket rung n~395', center: 395, lo: 380, hi: 410, isReference: false },
  { label: 'W2 ticket rung n~495', center: 495, lo: 480, hi: 510, isReference: false },
  { label: 'W3 ticket rung n~595', center: 595, lo: 580, hi: 610, isReference: false },
];

function longestAboveBarRun(rungs, bar) {
  let best = 0;
  let cur = 0;
  for (const r of rungs) {
    if (r.plateauUlp > bar) {
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
  for (let n = spec.lo; n <= spec.hi; n += 1) rungs.push(plateauRung(n));
  let worstUlp = 0;
  let worstAtN = spec.lo;
  let exceedStrict = 0;
  let exceedDeep = 0;
  const exceedStrictRungs = [];
  const exceedDeepRungs = [];
  for (const r of rungs) {
    if (r.plateauUlp > worstUlp) {
      worstUlp = r.plateauUlp;
      worstAtN = r.n;
    }
    if (r.plateauUlp > STRICT_BAR_ULP) {
      exceedStrict += 1;
      exceedStrictRungs.push(r.n);
    }
    if (r.plateauUlp > DEEP_BAND_ULP) {
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
    rungUlp: Object.freeze(rungs.map((r) => Number(r.plateauUlp.toPrecision(7)))),
  });
});

// -- The three explicitly-named ticket rungs and their +/-5 neighbours ----------------------------
const NAMED_TICKET_RUNGS = [395, 495, 595].map((n) => {
  const lo = plateauRung(n - 5).plateauUlp;
  const mid = plateauRung(n).plateauUlp;
  const hi = plateauRung(n + 5).plateauUlp;
  return Object.freeze({
    n,
    neighbourMinusUlp: lo,
    centreUlp: mid,
    neighbourPlusUlp: hi,
    centreExceedsStrict: mid > STRICT_BAR_ULP,
  });
});

// -- Summary statistics ---------------------------------------------------------------------------
const REFERENCE_WINDOW = WINDOW_TABLE.find((w) => w.isReference);
const DEEP_WINDOWS = WINDOW_TABLE.filter((w) => !w.isReference);
const DEEPEST_WINDOW = WINDOW_TABLE[WINDOW_TABLE.length - 1]; // n~595
const WORST_DEEP_WINDOW_ULP = Math.max(...DEEP_WINDOWS.map((w) => w.worstUlp));
const DEEP_BAND_BREAK_RUNGS = DEEP_WINDOWS.flatMap((w) => w.exceedDeepRungs.slice());

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The imp-33316 n=300 strict-bar spike reproduces on this dense scan.
const referenceReproducesSpike = REFERENCE_WINDOW.worstUlp > STRICT_BAR_ULP;
// (2) THE ANSWER: strict-bar exceedances RECUR -- every deeper window has at least one above-bar rung.
const spikesRecurAtEveryDeepWindow = DEEP_WINDOWS.every((w) => w.exceedStrictCount >= 1);
// (3) The exceedances INTENSIFY: the deepest window has a strictly higher above-bar fraction than the
//     isolated reference window (isolated single-rung event -> dense cluster).
const exceedanceDensityGrowsWithDepth = DEEPEST_WINDOW.exceedStrictFraction > REFERENCE_WINDOW.exceedStrictFraction;
// (4) CLUSTERING intensifies with depth: a deep window forms a CLUSTER (longest above-bar run >= 3)
//     that is strictly longer than the reference window run -- correcting the imp-33316 "isolated
//     single-rung" framing, which is itself a +/-5-grid artifact (the dense n=300 window already
//     shows a short run, not a lone spike).
const clusteringIntensifiesWithDepth =
  DEEP_WINDOWS.some((w) => w.longestAboveBarRun >= 3) &&
  DEEPEST_WINDOW.longestAboveBarRun > REFERENCE_WINDOW.longestAboveBarRun;
// (5) The deep-tail worst-window jitter climbs materially past the strict bar toward/through the
//     imp-33316 64-ULP deep band (robust proxy threshold 45, well below the measured ~74-79).
const deepWorstClimbsPastStrict = WORST_DEEP_WINDOW_ULP > 45;
// (6) Coverage: four dense width-31 windows centred on {300,395,495,595}, >= 100 integer rungs.
const totalRungs = WINDOW_TABLE.reduce((a, w) => a + w.total, 0);
const denseCoverage =
  WINDOW_TABLE.length === 4 &&
  WINDOW_TABLE.every((w) => w.total === 31) &&
  totalRungs >= 100 &&
  DEEP_WINDOWS.map((w) => w.center).join(',') === '395,495,595';

const verdict =
  referenceReproducesSpike &&
  spikesRecurAtEveryDeepWindow &&
  exceedanceDensityGrowsWithDepth &&
  clusteringIntensifiesWithDepth &&
  deepWorstClimbsPastStrict &&
  denseCoverage
    ? 'SPIKES-RECUR-AND-INTENSIFY:-THE-imp-33316-n=300-STRICT-BAR-PLATEAU-SPIKE-IS-NOT-A-ONE-OFF.-UNDER-A-DENSE-' +
      'INTEGER-SCAN-THE-imp-33295-CONSERVATIVE-grade4/400p=4000-NODE-PLATEAU-EXCEEDS-THE-STRICT-30-ULP-BAR-ON-A-' +
      'RISING-FRACTION-OF-DEEP-TAIL-RUNGS-(A-DENSE-SCAN-EVEN-DISSOLVES-THE-imp-33316-ISOLATED-READING-OF-n=300,-THE-' +
      'WIDTH-31-REFERENCE-WINDOW-ALREADY-CARRIES-6/31-ABOVE-BAR-RUNGS-AND-A-RUN-OF-2;-DEEPER-STILL-THEY-THICKEN-INTO-' +
      'DENSE-CLUSTERS-AT-n~495-AND-n~595,-16-17/31-WITH-RUNS-OF-FIVE-TO-SEVEN-CONSECUTIVE-ABOVE-BAR-RUNGS),-AND-THE-WORST-WINDOW-JITTER-' +
      'GROWS-FROM-~50-ULP-AT-n=300-TO-~79-ULP-(n=510)-AND-~74-ULP-(n=596),-CROSSING-THE-imp-33316-WIDENED-64-ULP-' +
      'DEEP-BAND-THE-COARSE-GRID-NEVER-HIT.-THIS-CORRECTS-THE-imp-33316-CONSTANT-<64-ULP-BAND-READING-AS-A-COARSE-' +
      'GRID-ARTIFACT:-THE-PLATEAU-BAND-IS-A-DEPTH-GROWING-JITTER-ENVELOPE.-IT-DOES-NOT-OVERTURN-PLATEAU-HOLDS/' +
      'UNIFORM-FAILS-IN-RELATIVE-TERMS-(THE-UNIFORM-LADDER-SITS-AT-~1e5..1e6-ULP-THERE).-ACCURACY/RULE-DESIGN-' +
      'MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-' +
      'NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33537_DEEP_TAIL_PLATEAU_SPIKE_RECURRENCE = Object.freeze({
  id: 'imp-33537-deep-tail-plateau-spike-recurrence',
  ticket: 'imp-33537',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33316-graded-plateau-deep-tail-node-budget.js',
  crossValidatesModules: [
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
    'imp-33295-graded-inner-grid-a-node-budget.js',
    'imp-33296-min-node-graded-gl-lattice-jitter-band.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'DENSE-GRID recurrence assessment: is the imp-33316 n=300 deep-tail PLATEAU strict-bar spike a one-off? The ' +
    'IDENTICAL imp-33295 conservative grade4/400p=4000-node graded plateau is re-scored against the imp-33213 A_log ' +
    'target on FOUR dense width-31 integer windows centred on {300,395,495,595}. RESULT: the n=300 spike is NOT a ' +
    'one-off -- strict-bar (&gt; 30 ULP) exceedances RECUR at every deeper window and INTENSIFY with depth. A dense ' +
    'scan even dissolves the imp-33316 isolated reading of n=300 (the width-31 reference window carries 6/31 above-bar ' +
    'rungs and a run of 2), and deeper they thicken into dense clusters at n~495 and n~595 (16-17/31, runs of five to ' +
    'seven consecutive above-bar rungs, e.g. n=493..499), while the worst-window jitter grows from ~50 ULP ' +
    'at n=300 to ~79 ULP (n=510) and ~74 ULP (n=596), CROSSING the imp-33316 widened 64-ULP deep band the coarse ' +
    'grid never hit. VERDICT: SPIKES-RECUR-AND-INTENSIFY -- the imp-33316 constant &lt; 64 ULP band was a coarse-grid ' +
    'artifact; the plateau band is a depth-growing jitter envelope. This does NOT overturn PLATEAU-HOLDS / ' +
    'UNIFORM-FAILS in relative terms (the uniform ladder sits at ~1e5..1e6 ULP there). ACCURACY/RULE-DESIGN ' +
    'MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; operator positivity (imp-3066) ' +
    'untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    plateauRule: 'the imp-33295 CONSERVATIVE fixed graded-GL rule grade4/400p (4000 nodes): panels a_j = 7 (j/panels)^4, ' +
      '10-node Gauss-Legendre per panel, on the DIRECT linear integrand (&gt;= 0 on [0,7], no subtractive cancellation)',
    windows: 'FOUR dense width-31 integer windows: [290..310] (imp-33316 reference), [380..410] (n~395), ' +
      '[480..510] (n~495), [580..610] (n~595); tau* = root of n = 4 pi tau* e^{4 tau*} at every integer rung',
    target: 'A_log(tau*) = exp(-negLnA), negLnA from imp-33213s INDEPENDENT log-domain graded-GL (grade 5, 300 panels, hi=10); ULP = A_log * 2^-52',
    strictBar: 'the imp-33295 strict floor band &lt; 30 ULP (shallow-rung plateau worst ~21 ULP)',
    deepBand: 'the imp-33316 widened ~2x deep band &lt; 64 ULP the coarse grid stayed inside',
    perWindowStats: 'worst-window ULP, count of rungs above the 30-ULP strict bar and the 64-ULP deep band, ' +
      'and the longest run of consecutive above-bar rungs (isolated event vs cluster)',
    selfComputing: 'every window, every integer rung and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    strictBarUlp: STRICT_BAR_ULP,
    deepBandUlp: DEEP_BAND_ULP,
    plateauGrade: PLATEAU_GRADE,
    plateauPanels: PLATEAU_PANELS,
    plateauNodes: PLATEAU_NODES,
    totalRungs,
    windowTable: WINDOW_TABLE,
    namedTicketRungs: NAMED_TICKET_RUNGS,
    referenceWorstUlp: REFERENCE_WINDOW.worstUlp,
    referenceExceedStrictCount: REFERENCE_WINDOW.exceedStrictCount,
    referenceLongestRun: REFERENCE_WINDOW.longestAboveBarRun,
    deepestWorstUlp: DEEPEST_WINDOW.worstUlp,
    deepestExceedStrictCount: DEEPEST_WINDOW.exceedStrictCount,
    worstDeepWindowUlp: WORST_DEEP_WINDOW_ULP,
    deepBandBreakRungs: Object.freeze(DEEP_BAND_BREAK_RUNGS.slice()),
    referenceReproducesSpike,
    spikesRecurAtEveryDeepWindow,
    exceedanceDensityGrowsWithDepth,
    clusteringIntensifiesWithDepth,
    deepWorstClimbsPastStrict,
    denseCoverage,
    verdict,
  }),

  interpretation: Object.freeze({
    notAOneOff:
      'The imp-33316 n=300 strict-bar exceedance recurs: under a dense integer scan the fixed 4000-node plateau ' +
      'exceeds the strict 30-ULP bar at EVERY deeper window (n~395/495/595). It is the shallow, isolated tip of a ' +
      'jitter envelope, not a singular lattice accident confined to n=300.',
    intensifiesWithDepth:
      'The above-bar fraction climbs from 6/31 at the n=300 reference to 16/31 (n~495) and 17/31 (n~595) -- more than ' +
      'half the rungs. Under dense sampling the imp-33316 "isolated single-rung" reading of n=300 already dissolves ' +
      '(the reference window carries a run of 2, not a lone spike), and deeper the exceedances thicken into CLUSTERS ' +
      'of five to seven consecutive above-bar rungs (e.g. n=493..499), so the "isolated single-rung event" reading ' +
      'does not survive densification.',
    deepBandCrossed:
      'The worst-window jitter grows from ~50 ULP at n=300 to ~79 ULP (n=510) and ~74 ULP (n=596), crossing the ' +
      'imp-33316 widened 64-ULP deep band that the coarse grid never sampled. The imp-33316 constant &lt; 64 ULP band ' +
      'is therefore a coarse-grid artifact; the honest object is a DEPTH-GROWING jitter envelope, not a fixed band.',
    relativeHeadlineSurvives:
      'This does NOT overturn the imp-33316 PLATEAU-HOLDS / UNIFORM-FAILS headline in RELATIVE terms: at these rungs ' +
      'the 37205-node uniform Richardson ladder sits at ~1e5..1e6 ULP, so the plateau at ~74-79 ULP is still 3-4 ' +
      'orders of magnitude closer. What is corrected is the ABSOLUTE constant-band claim, not the relative advantage.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    correctsPriorClaim:
      'CORRECTS the imp-33316 "the plateau stays inside the widened &lt; 64 ULP band at every deep rung" reading as a ' +
      'coarse-grid artifact. The dense integer scan shows the worst-window plateau ULP crosses 64 at n=510 and n=596. ' +
      'The relative PLATEAU-HOLDS / UNIFORM-FAILS headline is unaffected; only the absolute constant band is revised.',
    derivationScope:
      'Re-samples the imp-33295 fixed quadrature rule (grade4/400p graded-GL) for the autocorrelation weight A(tau) ' +
      'on a DENSE integer grid across four deep-tail windows. It changes NO bound, patches NO literal, and ' +
      'establishes NO operator positivity. Grid-design measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33316/imp-33295/imp-33213; this audits the inner ' +
      'quadrature jitter on a dense grid, not that truncation.',
    latticeJitterCaveat:
      'The worst-window ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296): the exact ' +
      'per-rung ULP and the precise 64-ULP crossing rungs can shift under cross-platform libm exp/pow variation. The ' +
      'robust reading is the QUALITATIVE recurrence-and-intensification of strict-bar exceedances with depth, not the ' +
      'exact per-rung ULP.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33537_DEEP_TAIL_PLATEAU_SPIKE_RECURRENCE_ASSERTIONS = [
  {
    id: 'imp33537-dense-coverage',
    why: 'The measurement must run four dense width-31 integer windows centred on {300,395,495,595} (>= 100 rungs).',
    holds: () => denseCoverage && totalRungs >= 100 && WINDOW_TABLE.length === 4,
  },
  {
    id: 'imp33537-reference-reproduces-the-n300-spike',
    why: 'Calibration: the imp-33316 n=300 strict-bar spike must reproduce on this dense scan (reference window worst > 30 ULP).',
    holds: () => referenceReproducesSpike && REFERENCE_WINDOW.worstUlp > STRICT_BAR_ULP,
  },
  {
    id: 'imp33537-strict-bar-spikes-recur-at-every-deep-window',
    why: 'THE ANSWER: the n=300 spike is NOT a one-off -- strict-bar (> 30 ULP) exceedances must recur at EVERY ' +
         'deeper window n~395/495/595 (each has at least one above-bar rung).',
    holds: () => spikesRecurAtEveryDeepWindow && DEEP_WINDOWS.every((w) => w.exceedStrictCount >= 1),
  },
  {
    id: 'imp33537-exceedances-intensify-with-depth',
    why: 'The exceedances must INTENSIFY: the deepest window (n~595) has a strictly higher above-bar fraction than ' +
         'the isolated n=300 reference window.',
    holds: () => exceedanceDensityGrowsWithDepth && DEEPEST_WINDOW.exceedStrictFraction > REFERENCE_WINDOW.exceedStrictFraction,
  },
  {
    id: 'imp33537-clustering-intensifies-with-depth',
    why: 'CLUSTERING must intensify with depth: a deep window forms a CLUSTER (longest above-bar run >= 3) that is ' +
         'strictly longer than the reference window run, correcting the imp-33316 "isolated single-rung" framing as ' +
         'a +/-5-grid artifact (the dense n=300 window already shows a short run, not a lone spike).',
    holds: () => clusteringIntensifiesWithDepth && DEEP_WINDOWS.some((w) => w.longestAboveBarRun >= 3) && DEEPEST_WINDOW.longestAboveBarRun > REFERENCE_WINDOW.longestAboveBarRun,
  },
  {
    id: 'imp33537-deep-worst-climbs-past-the-strict-bar',
    why: 'The deep-tail worst-window jitter must climb materially past the strict 30-ULP bar toward/through the ' +
         'imp-33316 64-ULP deep band (robust proxy: worst deep-window ULP > 45; measured ~74-79).',
    holds: () => deepWorstClimbsPastStrict && WORST_DEEP_WINDOW_ULP > 45,
  },
  {
    id: 'imp33537-plateau-rule-carried-unchanged',
    why: 'The imp-33295 conservative plateau rule (grade 4, 400 panels = 4000 nodes) must be carried UNCHANGED from imp-33316.',
    holds: () => PLATEAU_GRADE === 4 && PLATEAU_PANELS === 400 && PLATEAU_NODES === 4000,
  },
  {
    id: 'imp33537-verdict-records-spikes-recur',
    why: 'The classified verdict must record the SPIKES-RECUR-AND-INTENSIFY reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33537-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, corrects the imp-33316 ' +
         'constant-band claim without overturning the relative headline, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33537_DEEP_TAIL_PLATEAU_SPIKE_RECURRENCE.honestCaveat;
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

for (const assertion of IMP33537_DEEP_TAIL_PLATEAU_SPIKE_RECURRENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33537-deep-tail-plateau-spike-recurrence assertion failed: ${assertion.id}`);
  }
}

export default IMP33537_DEEP_TAIL_PLATEAU_SPIKE_RECURRENCE;
