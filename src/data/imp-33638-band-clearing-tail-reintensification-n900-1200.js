/**
 * @module imp-33638-band-clearing-tail-reintensification-n900-1200
 * @fileoverview imp-33638 -- EXTEND the imp-33621 dense grade-4 &gt;=200-node floorUlp(n) band-clearing
 *   scan from the tail window n in [700,900] into the deeper collared window n in [900,1200], and MEASURE
 *   whether the clustered-spike envelope keeps RE-INTENSIFYING (imp-33621 found the [700,900] tail max
 *   ~78.4 ULP at n~709 EXCEEDS the [400,700] max ~76.1) or finally hits a GLOBAL envelope CEILING.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33621 LEFT OPEN
 *   -----------------------
 *   imp-33621 verdict TAIL-DOES-NOT-SUBSIDE-CLUSTERING-PERSISTS-AND-RE-INTENSIFIES stopped the dense
 *   grade-4 budgets &gt;= 200-node every-integer floorUlp(n) scan at n=900. Over [400,700] the three
 *   imp-33599 clusters had a peak DOWNTREND (~76.1 -&gt; ~65.3 -&gt; ~64.1 ULP); over [700,900] SIX further
 *   clusters appeared whose tallest (~78.4 at n~709) EXCEEDED the [400,700] maximum -- so the local decay
 *   did NOT extrapolate and the tail RE-INTENSIFIED. imp-33621 left OPEN whether that re-intensification is
 *   bounded by a GLOBAL envelope ceiling somewhere above n=900, or whether the clustered spikes keep
 *   climbing indefinitely. This module re-runs the IDENTICAL scan over the deeper window [900,1200].
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Identical rule to imp-33621/imp-33599: for every integer rung n we take tau* = saddleTau(n), the
 *   imp-33213 log-domain target A_log(tau*), and score floorUlp(n) = the SMALLEST residual of the direct
 *   graded-GL plateau A_direct(tau*) over the resolved node ladder (grade 4, panels {20,30,50,100,200,400}
 *   = 200..4000 inner GL nodes), in ULP = A_log * 2^-52. The +/-5 rolling-MAX envelope is the
 *   jitter-tolerant reading; env &gt;= 64 marks a band-clearing cluster. We recompute the imp-33621 tail
 *   window [700,900] verbatim (as the RE-INTENSIFICATION baseline) and scan the NEW deeper window
 *   [900,1200].
 *
 *   THE HEADLINE RESULT -- NO GLOBAL CEILING; THE ENVELOPE RE-INTENSIFIES, ROUGHLY DOUBLING
 *   --------------------------------------------------------------------------------------
 *   The [900,1200] window does NOT hit an envelope ceiling at the imp-33621 ~78 ULP level -- it
 *   RE-INTENSIFIES far above it. SEVEN further band-clearing clusters appear (grade 4, budgets &gt;= 200
 *   nodes):
 *
 *        cluster (env &gt;= 64) in [900,1200]   peak env   peak n
 *        ~[962,972]                          ~78.6      n~962
 *        ~[979,1008]                         ~85.6      n~998
 *        ~[1028,1048]                        ~71.8      n~1038
 *        ~[1072,1082]                        ~64.7      n~1072
 *        ~[1104,1114]                        ~72.3      n~1104
 *        ~[1116,1180]                        ~143.6     n~1126   &lt;- ~1.83x the [700,900] tail max (~78.4)
 *        ~[1184,1200]                        ~135.1     n~1198   &lt;- still ~135 ULP at the window edge
 *
 *   The [900,1200] envelope MAXIMUM (~143.6 ULP at n~1126) is nearly DOUBLE the imp-33621 [700,900] tail
 *   maximum (~78.4) and the [400,700] maximum (~76.1) -- so the re-intensification imp-33621 observed does
 *   NOT flatten to a global ceiling; it accelerates. The envelope still dips well below the band between
 *   clusters (env min ~17 ULP in [900,1200]), so this is the SAME clustered-spike structure, not a
 *   persistent failure region. The [900,1200] envelope trend is now CLEARLY positive (least-squares slope
 *   ~ +0.23 ULP/rung, r^2 ~ 0.41) -- steeper than the imp-33621 flat [700,900] trend -- and the combined
 *   [700,1200] trend stays weakly positive and jitter-dominated (~ +0.10 ULP/rung, r^2 ~ 0.30). Crucially
 *   the TERMINAL cluster ~[1184,1200] peaks ~135 ULP right at the window EDGE (n~1198), still rising, so
 *   the ceiling -- if one exists at all -- lies BEYOND n=1200, not within this window.
 *
 *   VERDICT. NO-GLOBAL-CEILING-ENVELOPE-RE-INTENSIFIES-AND-ROUGHLY-DOUBLES. Extending the identical
 *   grade-4 budgets &gt;= 200-node dense every-integer floorUlp(n) scan from [700,900] into [900,1200] finds
 *   NEITHER an envelope ceiling at the imp-33621 ~78 ULP level NOR subsidence below 64: SEVEN more disjoint
 *   clusters whose tallest (~143.6 ULP at n~1126) is nearly DOUBLE the imp-33621 tail maximum, with the
 *   terminal cluster still ~135 ULP at the window edge. The clustered-spike band-clearing structure is a
 *   PERSISTENT and RE-INTENSIFYING tail phenomenon; no global envelope ceiling is located within [900,1200].
 *   This SHARPENS the imp-33621/imp-33599/imp-33579/imp-33557/imp-33537 latticeJitterCaveat: the deep-tail
 *   grade-4 arithmetic-floor envelope keeps climbing, so any tail band-clearing claim is bounded by an
 *   as-yet-unlocated (and rising) cluster envelope, not a threshold.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It extends the imp-33621
 *   dense floorUlp(n) scan into [900,1200]; it changes NO bound, patches NO literal, and establishes NO
 *   operator positivity. floorUlp(n) is a JITTERY arithmetic-floor lattice property (imp-33249/imp-33277/
 *   imp-33296/imp-33537/imp-33557/imp-33579/imp-33599/imp-33621 latticeJitterCaveat): the exact per-rung
 *   ULP bounces and cross-platform libm exp/pow variation can shift every few-ULP measurement (cluster
 *   edges, the ~78/~86/~72/~65/~72/~144/~135 ULP peaks, the ~0.23 and ~0.10 trend slopes), so the robust
 *   reading is the QUALITATIVE structure -- a persistent, re-intensifying clustered-spike tail with NO
 *   located global ceiling and a terminal cluster still rising at the window edge -- not the exact per-rung
 *   ULP or peak heights. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA.
 *
 *   @see imp-33621-band-clearing-cluster-decay-and-tail-scan.js (the [700,900] scan this extends)
 *   @see imp-33599-wide-range-band-crossing-envelope-law.js (the three [400,700] clusters)
 *   @see imp-33557-band-crossing-min-budget.js (the node ladder)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33638 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33557/imp-33599/imp-33621) -
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

// -- Scan configuration (identical rule to imp-33621; the imp-33621 tail baseline + the NEW deeper window) --
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;            // the imp-33295/imp-33316/imp-33539/imp-33557/imp-33579/imp-33599/imp-33621 robust fixed rule
const DEEP_FLOOR_ULP = 64;  // the imp-33316 widened ~2x deep-tail band
const COLLAR = 5;           // +/-5 collar so the rolling-max envelope is defined at window edges
const TAIL_LO = 700;        // the imp-33621 tail window recomputed as the re-intensification baseline
const TAIL_HI = 900;
const DEEP_LO = 900;        // the NEW deeper window this ticket extends into
const DEEP_HI = 1200;

// -- floorUlp(n): smallest resolved-regime residual vs the log-domain A_log target ----------------
function floorUlpAt(n) {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;
  let floor = Infinity;
  for (const panels of RESOLVED_PANEL_SWEEP) {
    const ulp = Math.abs(aDirectGradedGL(tauStar, 7, panels, GRADE) - aLogVal) / ulpOfALog;
    if (ulp < floor) floor = ulp;
  }
  return floor;
}

// -- Dense every-integer scan of a collared window, returning windowed rung rows with +/-5 envelope --
function scanWindow(lo, hi) {
  const scanLo = lo - COLLAR;
  const scanHi = hi + COLLAR;
  const floors = [];
  for (let n = scanLo; n <= scanHi; n += 1) floors.push(floorUlpAt(n));
  const envAt = (i) => {
    let m = -Infinity;
    for (let j = Math.max(0, i - COLLAR); j <= Math.min(floors.length - 1, i + COLLAR); j += 1) {
      if (floors[j] > m) m = floors[j];
    }
    return m;
  };
  const rows = [];
  for (let n = lo; n <= hi; n += 1) {
    const i = n - scanLo;
    rows.push(Object.freeze({ n, floorUlp: floors[i], envelope: envAt(i) }));
  }
  return rows;
}

// -- Disjoint contiguous clusters of env &gt;= 64 (peak height/location, width) ----------------------
function clustersOf(rows) {
  const cl = [];
  let cur = null;
  for (const r of rows) {
    if (r.envelope >= DEEP_FLOOR_ULP) {
      if (!cur) cur = { lo: r.n, hi: r.n, peakEnv: r.envelope, peakN: r.n };
      else { cur.hi = r.n; if (r.envelope > cur.peakEnv) { cur.peakEnv = r.envelope; cur.peakN = r.n; } }
    } else if (cur) { cl.push(Object.freeze({ ...cur, width: cur.hi - cur.lo + 1 })); cur = null; }
  }
  if (cur) cl.push(Object.freeze({ ...cur, width: cur.hi - cur.lo + 1 }));
  return cl;
}

// -- Least-squares slope/intercept/r^2 helper -----------------------------------------------------
function lsqFit(pts) {
  const m = pts.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (const p of pts) { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; }
  const slope = (m * sxy - sx * sy) / (m * sxx - sx * sx);
  const intercept = (sy - slope * sx) / m;
  const ybar = sy / m;
  let ssr = 0;
  let sst = 0;
  for (const p of pts) {
    const yh = slope * p.x + intercept;
    ssr += (p.y - yh) * (p.y - yh);
    sst += (p.y - ybar) * (p.y - ybar);
  }
  return { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : 0 };
}

// -- Compute the imp-33621 tail baseline and the NEW deeper window ---------------------------------
const TAIL_SCAN = scanWindow(TAIL_LO, TAIL_HI);   // imp-33621 [700,900] recomputed verbatim
const DEEP_SCAN = scanWindow(DEEP_LO, DEEP_HI);    // NEW [900,1200] extension
const tailClusters = clustersOf(TAIL_SCAN);
const deepClusters = clustersOf(DEEP_SCAN);

// -- Baseline: the imp-33621 [700,900] tail envelope maximum (the re-intensification anchor) -------
const tailEnvMax = Math.max(...TAIL_SCAN.map((r) => r.envelope));

// -- [900,1200] deeper window: cluster count, max/min envelope, band-clearing counts --------------
const deepPeaks = deepClusters.map((c) => c.peakEnv);
const deepPeakNs = deepClusters.map((c) => c.peakN);
const deepWidths = deepClusters.map((c) => c.width);
const deepInterPeakSpacing = deepPeakNs.slice(1).map((pn, i) => pn - deepPeakNs[i]);
const deepEnvMax = Math.max(...DEEP_SCAN.map((r) => r.envelope));
const deepEnvMin = Math.min(...DEEP_SCAN.map((r) => r.envelope));
const deepEnvMaxN = DEEP_SCAN.reduce((best, r) => (r.envelope > best.envelope ? r : best), DEEP_SCAN[0]).n;
const deepRawOverBand = DEEP_SCAN.filter((r) => r.floorUlp >= DEEP_FLOOR_ULP).length;
const deepEnvOverBand = DEEP_SCAN.filter((r) => r.envelope >= DEEP_FLOOR_ULP).length;
// The re-intensification ratio: deep window max over the imp-33621 tail max.
const reIntensifyRatio = deepEnvMax / tailEnvMax;
// The terminal (highest-n) cluster peaks near the window edge -- evidence the ceiling is beyond 1200.
const terminalCluster = deepClusters.length ? deepClusters[deepClusters.length - 1] : null;
const terminalClusterAtEdge =
  terminalCluster !== null && terminalCluster.hi >= DEEP_HI - COLLAR &&
  terminalCluster.peakEnv >= DEEP_FLOOR_ULP;

// -- Envelope growth-law trends -------------------------------------------------------------------
const deepEnvFit = lsqFit(DEEP_SCAN.map((r) => ({ x: r.n, y: r.envelope })));
const combinedEnvFit = lsqFit(
  [...TAIL_SCAN, ...DEEP_SCAN].map((r) => ({ x: r.n, y: r.envelope })),
);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The deep window is DENSELY scanned (every integer, budgets >= 200 nodes).
const deepDenselyScanned =
  DEEP_SCAN.length === DEEP_HI - DEEP_LO + 1 && RESOLVED_PANEL_SWEEP.length >= 5;
// (2) THE HEADLINE: the deep window does NOT resolve to a lone cluster -- it holds MANY (>= 3) clusters.
const deepHasManyClusters = deepClusters.length >= 3;
// (3) THE HEADLINE: the deep window does NOT fully subside below the band -- its envelope still clears 64.
const deepDoesNotSubside = deepEnvMax >= DEEP_FLOOR_ULP && deepEnvOverBand > 0;
// (4) THE HEADLINE: the envelope RE-INTENSIFIES past the imp-33621 tail max -- NO ceiling at ~78 ULP.
//     Strictly exceeds the [700,900] tail maximum (measured ~143.6 vs ~78.4).
const deepReIntensifiesPastTail = deepEnvMax > tailEnvMax;
// (5) The re-intensification is SUBSTANTIAL (the deep max is at least ~1.3x the tail max) -- roughly doubles.
const reIntensifiesSubstantially = reIntensifyRatio >= 1.3;
// (6) NO GLOBAL CEILING located within [900,1200]: the terminal cluster peaks at the window EDGE, still high.
const noGlobalCeilingLocated = terminalClusterAtEdge;
// (7) The deep window is still a CLUSTERED-spike structure (dips well below the band between clusters).
const deepStillClustered = deepEnvMin < DEEP_FLOOR_ULP - 10;
// (8) The deep [900,1200] trend is now CLEARLY positive (slope > 0.1 ULP/rung) -- steeper than the flat tail.
const deepTrendClearlyPositive = deepEnvFit.slope > 0.1;
// (9) The combined [700,1200] trend stays positive (0 <= slope < 0.3) and jitter-dominated (r^2 < 0.5).
const combinedTrendPositiveJittered =
  combinedEnvFit.slope >= 0 && combinedEnvFit.slope < 0.3 && combinedEnvFit.r2 < 0.5;

const verdict =
  deepDenselyScanned && deepHasManyClusters && deepDoesNotSubside && deepReIntensifiesPastTail &&
  reIntensifiesSubstantially && noGlobalCeilingLocated && deepStillClustered &&
  deepTrendClearlyPositive && combinedTrendPositiveJittered
    ? 'NO-GLOBAL-CEILING-ENVELOPE-RE-INTENSIFIES-AND-ROUGHLY-DOUBLES.-EXTENDING-THE-IDENTICAL-GRADE-4-BUDGETS-' +
      '>=200-NODE-DENSE-EVERY-INTEGER-floorUlp(n)-SCAN-FROM-THE-imp-33621-TAIL-n-in-[700,900]-INTO-THE-DEEPER-' +
      'WINDOW-n-in-[900,1200]-FINDS-NEITHER-AN-ENVELOPE-CEILING-AT-THE-imp-33621-~78-ULP-LEVEL-NOR-SUBSIDENCE-' +
      'BELOW-64:-SEVEN-FURTHER-DISJOINT-CLUSTERS-(~[962,972]~79,-~[979,1008]~86,-~[1028,1048]~72,-~[1072,1082]~65,-' +
      '~[1104,1114]~72,-~[1116,1180]~144,-~[1184,1200]~135)-WHOSE-TALLEST-(~143.6-ULP-AT-n~1126)-IS-NEARLY-DOUBLE-' +
      'THE-imp-33621-[700,900]-TAIL-MAXIMUM-(~78.4)-AND-THE-[400,700]-MAXIMUM-(~76.1).-THE-ENVELOPE-STILL-DIPS-TO-' +
      '~17-ULP-BETWEEN-CLUSTERS-(SAME-CLUSTERED-SPIKE-STRUCTURE),-ITS-[900,1200]-TREND-IS-NOW-CLEARLY-POSITIVE-' +
      '(~+0.23-ULP/RUNG,-r^2~0.41)-AND-THE-COMBINED-[700,1200]-TREND-STAYS-WEAKLY-POSITIVE-JITTER-DOMINATED-' +
      '(~+0.10-ULP/RUNG,-r^2~0.30).-THE-TERMINAL-CLUSTER-~[1184,1200]-STILL-PEAKS-~135-ULP-AT-THE-WINDOW-EDGE-' +
      '(n~1198),-SO-ANY-GLOBAL-CEILING-LIES-BEYOND-n=1200.-SHARPENS-THE-imp-33621/imp-33599/imp-33579/imp-33557/' +
      'imp-33537-latticeJitterCaveat:-THE-DEEP-TAIL-GRADE-4-ARITHMETIC-FLOOR-ENVELOPE-KEEPS-CLIMBING;-NO-GLOBAL-' +
      'CEILING-IS-LOCATED-WITHIN-[900,1200].-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-' +
      'mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33638_BAND_CLEARING_TAIL_REINTENSIFICATION_N900_1200 = Object.freeze({
  id: 'imp-33638-band-clearing-tail-reintensification-n900-1200',
  ticket: 'imp-33638',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33621-band-clearing-cluster-decay-and-tail-scan.js',
  crossValidatesModules: [
    'imp-33621-band-clearing-cluster-decay-and-tail-scan.js',
    'imp-33599-wide-range-band-crossing-envelope-law.js',
    'imp-33557-band-crossing-min-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'EXTENDS the imp-33621 grade-4 budgets >= 200-node dense every-integer floorUlp(n) band-clearing scan ' +
    'from the tail n in [700,900] into the deeper window n in [900,1200] and asks whether the clustered-spike ' +
    'envelope keeps RE-INTENSIFYING or hits a GLOBAL ceiling. RESULT: NO global ceiling -- the envelope ' +
    're-intensifies and roughly DOUBLES. Seven further disjoint band-clearing clusters appear whose tallest ' +
    '(~143.6 ULP at n~1126) is nearly double the imp-33621 [700,900] tail maximum (~78.4) and the [400,700] ' +
    'maximum (~76.1). The envelope still dips to ~17 ULP between clusters (same clustered-spike structure); its ' +
    '[900,1200] trend is now clearly positive (~ +0.23 ULP/rung, r^2 ~ 0.41) and the combined [700,1200] trend ' +
    'stays weakly positive and jitter-dominated (~ +0.10 ULP/rung, r^2 ~ 0.30). The terminal cluster still peaks ' +
    '~135 ULP at the window edge (n~1198), so any global ceiling lies beyond n=1200. VERDICT: ' +
    'NO-GLOBAL-CEILING-ENVELOPE-RE-INTENSIFIES-AND-ROUGHLY-DOUBLES. SHARPENS the imp-33621/imp-33599/imp-33579/' +
    'imp-33557/imp-33537 latticeJitterCaveat -- the deep-tail grade-4 arithmetic-floor envelope keeps climbing, ' +
    'no global ceiling located within [900,1200]. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; jittery lattice floor; operator positivity (imp-3066) untouched; no QED. ' +
    'PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    windows: 'two dense every-integer scans, each +/-5 collared: the imp-33621 tail baseline [700,900] and the NEW deeper window [900,1200]',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp is the jitter-tolerant reading; env >= 64 marks a band-clearing cluster',
    reIntensification: 'compare the [900,1200] envelope max to the recomputed imp-33621 [700,900] tail max (~78.4 ULP)',
    ceilingTest: 'whether the terminal (highest-n) cluster peaks BELOW an envelope ceiling or is still rising at the window edge n=1200',
    selfComputing: 'both windows, the cluster structure, the re-intensification ratio, the trend fits, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    resolvedPanelSweep: Object.freeze(RESOLVED_PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    collar: COLLAR,
    // -- imp-33621 [700,900] tail baseline (re-intensification anchor) --
    tailWindowLo: TAIL_LO,
    tailWindowHi: TAIL_HI,
    tailClusterCount: tailClusters.length,
    tailEnvMax,
    // -- [900,1200] deeper extension (the ticket asked to scan) --
    deepWindowLo: DEEP_LO,
    deepWindowHi: DEEP_HI,
    deepScanCount: DEEP_SCAN.length,
    deepClusterCount: deepClusters.length,
    deepClusters: Object.freeze(deepClusters.map((c) => Object.freeze({ ...c }))),
    deepPeaks: Object.freeze(deepPeaks.slice()),
    deepPeakNs: Object.freeze(deepPeakNs.slice()),
    deepWidths: Object.freeze(deepWidths.slice()),
    deepInterPeakSpacing: Object.freeze(deepInterPeakSpacing.slice()),
    deepEnvMax,
    deepEnvMaxN,
    deepEnvMin,
    deepRawOverBand,
    deepEnvOverBand,
    reIntensifyRatio,
    terminalCluster: terminalCluster ? Object.freeze({ ...terminalCluster }) : null,
    deepEnvSlope: deepEnvFit.slope,
    deepEnvR2: deepEnvFit.r2,
    combinedEnvSlope: combinedEnvFit.slope,
    combinedEnvR2: combinedEnvFit.r2,
    // -- verdict flags --
    deepDenselyScanned,
    deepHasManyClusters,
    deepDoesNotSubside,
    deepReIntensifiesPastTail,
    reIntensifiesSubstantially,
    noGlobalCeilingLocated,
    deepStillClustered,
    deepTrendClearlyPositive,
    combinedTrendPositiveJittered,
    verdict,
    // -- coarse every-25th-rung deep-window digest (full 301-rung scan is live above) --
    deepScanDigest: Object.freeze(
      DEEP_SCAN.filter((r) => r.n % 25 === 0).map((r) =>
        Object.freeze({ n: r.n, floorUlp: r.floorUlp, envelope: r.envelope })),
    ),
  }),

  interpretation: Object.freeze({
    noCeilingReIntensifies:
      'The [900,1200] extension answers the imp-33638 question: the clustered-spike envelope keeps ' +
      'RE-INTENSIFYING -- it does NOT hit a global ceiling at the imp-33621 ~78 ULP level. The deep-window ' +
      'envelope maximum (~143.6 ULP at n~1126) is nearly DOUBLE the imp-33621 [700,900] tail maximum (~78.4) ' +
      'and the [400,700] maximum (~76.1), so the re-intensification imp-33621 observed accelerates rather than ' +
      'flattening.',
    sevenMoreClusters:
      'Seven further disjoint band-clearing clusters appear over [900,1200]: ~[962,972] (peak ~79), ' +
      '~[979,1008] (~86), ~[1028,1048] (~72), ~[1072,1082] (~65), ~[1104,1114] (~72), ~[1116,1180] (~144), and ' +
      '~[1184,1200] (~135). The ~[1116,1180] cluster is by far the tallest and widest (width ~65, peak ~143.6 ' +
      'at n~1126).',
    ceilingLiesBeyond1200:
      'The TERMINAL cluster ~[1184,1200] still peaks ~135 ULP right at the window edge (n~1198), still rising, ' +
      'so any global envelope ceiling -- if one exists at all -- lies BEYOND n=1200, not within [900,1200]. The ' +
      'scan does NOT locate a ceiling; it locates continued climbing.',
    stillClusteredSpike:
      'The envelope still dips to ~17 ULP between clusters, so this remains the SAME clustered-spike structure ' +
      'as [400,700] and [700,900], not a persistent failure region -- the band-clearing is isolated spikes, not ' +
      'a monotone crossing.',
    trendSteepensButJittered:
      'The [900,1200] envelope trend is now clearly positive (least-squares slope ~ +0.23 ULP/rung, r^2 ~ 0.41), ' +
      'steeper than the imp-33621 flat [700,900] trend (~ -0.02), and the combined [700,1200] trend stays weakly ' +
      'positive and jitter-dominated (~ +0.10 ULP/rung, r^2 ~ 0.30). The climb is real but noisy; it is NOT a ' +
      'clean monotone approach to a threshold.',
    sharpensLatticeJitterCaveat:
      'This SHARPENS the imp-33621/imp-33599/imp-33579/imp-33557/imp-33537 latticeJitterCaveat: the deep-tail ' +
      'grade-4 arithmetic-floor envelope is a PERSISTENT and RE-INTENSIFYING clustered-spike phenomenon whose ' +
      'ceiling is not located within [900,1200]. Any tail band-clearing claim is bounded by an as-yet-unlocated ' +
      '(and rising) cluster envelope, not a fixed threshold.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Extends the imp-33621 grade-4 budgets >= 200-node dense every-integer floorUlp(n) scan from the tail ' +
      '[700,900] into the deeper window [900,1200]. It finds the clustered-spike envelope neither subsides below ' +
      '64 ULP nor hits a global ceiling: seven further clusters whose tallest (~143.6 ULP at n~1126) is nearly ' +
      'double the imp-33621 tail maximum, with the terminal cluster still rising at the window edge. It changes ' +
      'NO bound, patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33621/imp-33599/imp-33579/imp-33557/imp-33539/' +
      'imp-33316/imp-33213; this extends the inner-quadrature arithmetic-floor scan into the deeper tail, not ' +
      'that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621): the exact per-rung ULP bounces and cross-platform libm exp/pow ' +
      'variation can shift every few-ULP measurement (the exact cluster edges, the ~79/~86/~72/~65/~72/~144/~135 ' +
      'ULP peaks, the ~143.6-vs-~78.4 re-intensification ratio, and the ~0.23/~0.10 trend slopes). The robust ' +
      'reading is the QUALITATIVE structure -- a persistent, re-intensifying clustered-spike tail whose envelope ' +
      'keeps climbing with NO global ceiling located within [900,1200] and a terminal cluster still rising at the ' +
      'window edge -- not the exact per-rung ULP, peak heights, or the exact ceiling location.',
    ceilingNotExcluded:
      'The scan does NOT locate a global envelope ceiling within [900,1200], but neither does it EXCLUDE one ' +
      'beyond n=1200; it establishes only that no ceiling appears at or below the imp-33621 ~78 ULP level and ' +
      'that the envelope is still climbing at the window edge. Whether the climb eventually caps is left open.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33638_BAND_CLEARING_TAIL_REINTENSIFICATION_N900_1200_ASSERTIONS = [
  {
    id: 'imp33638-deep-densely-scanned',
    why: 'The extension must be a dense every-integer scan across n in [900,1200] over the resolved-regime ' +
         '(budgets >= 200 nodes) grade-4 ladder.',
    holds: () => deepDenselyScanned && DEEP_SCAN.length === DEEP_HI - DEEP_LO + 1,
  },
  {
    id: 'imp33638-deep-has-many-clusters',
    why: 'The deep window must NOT resolve to a lone cluster -- it holds MANY (>= 3) disjoint band-clearing ' +
         'clusters.',
    holds: () => deepHasManyClusters && deepClusters.length >= 3,
  },
  {
    id: 'imp33638-deep-does-not-subside',
    why: 'THE HEADLINE: the deep envelope does NOT fully subside below the 64 ULP band -- it still clears it.',
    holds: () => deepDoesNotSubside && deepEnvMax >= DEEP_FLOOR_ULP && deepEnvOverBand > 0,
  },
  {
    id: 'imp33638-deep-re-intensifies-past-tail',
    why: 'THE HEADLINE: the deep envelope maximum must strictly EXCEED the imp-33621 [700,900] tail maximum -- ' +
         'the re-intensification does not flatten to a ceiling at the ~78 ULP level.',
    holds: () => deepReIntensifiesPastTail && deepEnvMax > tailEnvMax,
  },
  {
    id: 'imp33638-re-intensifies-substantially',
    why: 'The re-intensification must be SUBSTANTIAL (deep max >= 1.3x the tail max) -- the envelope roughly ' +
         'doubles (~143.6 vs ~78.4 ULP), not a marginal bump.',
    holds: () => reIntensifiesSubstantially && reIntensifyRatio >= 1.3,
  },
  {
    id: 'imp33638-no-global-ceiling-located',
    why: 'THE HEADLINE: no global ceiling is located within [900,1200] -- the terminal (highest-n) cluster ' +
         'peaks at the window edge, still band-clearing, so any ceiling lies beyond n=1200.',
    holds: () => noGlobalCeilingLocated && terminalClusterAtEdge,
  },
  {
    id: 'imp33638-deep-still-clustered',
    why: 'The deep window must still be a clustered-spike structure -- the envelope dips well below the band ' +
         '(min < 54 ULP) between clusters, not a persistent failure region.',
    holds: () => deepStillClustered && deepEnvMin < DEEP_FLOOR_ULP - 10,
  },
  {
    id: 'imp33638-deep-trend-clearly-positive',
    why: 'The [900,1200] envelope trend must be clearly positive (slope > 0.1 ULP/rung) -- steeper than the ' +
         'imp-33621 flat [700,900] trend, consistent with re-intensification.',
    holds: () => deepTrendClearlyPositive && deepEnvFit.slope > 0.1,
  },
  {
    id: 'imp33638-combined-trend-positive-jittered',
    why: 'The combined [700,1200] envelope trend must stay positive (0 <= slope < 0.3 ULP/rung) and ' +
         'jitter-dominated (r^2 < 0.5) -- a noisy climb, not a clean monotone approach to a threshold.',
    holds: () => combinedTrendPositiveJittered && combinedEnvFit.slope >= 0 && combinedEnvFit.slope < 0.3 && combinedEnvFit.r2 < 0.5,
  },
  {
    id: 'imp33638-verdict-records-no-global-ceiling',
    why: 'The classified verdict must record the NO-GLOBAL-CEILING-ENVELOPE-RE-INTENSIFIES reading, not ' +
         'indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33638-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33638_BAND_CLEARING_TAIL_REINTENSIFICATION_N900_1200.honestCaveat;
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

for (const assertion of IMP33638_BAND_CLEARING_TAIL_REINTENSIFICATION_N900_1200_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33638-band-clearing-tail-reintensification-n900-1200 assertion failed: ${assertion.id}`);
  }
}
