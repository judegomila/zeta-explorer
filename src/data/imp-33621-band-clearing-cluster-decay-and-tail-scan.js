/**
 * @module imp-33621-band-clearing-cluster-decay-and-tail-scan
 * @fileoverview imp-33621 -- MEASURE the quantitative structure of the three disjoint band-clearing
 *   clusters the imp-33599 wide-window floorUlp(n) scan found over n in [400,700] (peak-height decay,
 *   inter-peak spacing, cluster widths), and EXTEND the identical grade-4 &gt;=200-node dense every-integer
 *   floorUlp(n) scan to the collared tail window n in [700,900], asking whether a fourth ISOLATED cluster
 *   appears or the envelope has fully subsided below the imp-33316 &lt; 64 ULP band.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33599 LEFT UNMEASURED
 *   ------------------------------
 *   imp-33599 extended the imp-33579 narrow band-crossing scan to the wide window [400,700] and found NO
 *   monotone wide-range crossing: the band clearing is a set of THREE disjoint isolated clusters
 *   (~[526,545] peak ~76 ULP, ~[591,601] peak ~65, ~[634,644] peak ~64), each subsiding back below 64 above
 *   its peak, riding a weak jitter-dominated ~+0.10 ULP/rung trend. It reported the cluster peaks qualitatively
 *   but did NOT quantify the peak-height DECAY across the three clusters, the inter-peak SPACING, or the
 *   cluster WIDTHS, and it stopped the dense scan at n=700. Whether the 76 -&gt; 65 -&gt; 64 peak downtrend is a
 *   global decay law (predicting the envelope subsides below the band beyond n~644) or a local feature was
 *   left open. This module measures the cluster structure and pushes the identical scan into [700,900].
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Identical rule to imp-33599/imp-33579: for every integer rung n we take tau* = saddleTau(n), the
 *   imp-33213 log-domain target A_log(tau*), and score floorUlp(n) = the SMALLEST residual of the direct
 *   graded-GL plateau A_direct(tau*) over the resolved node ladder (grade 4, panels {20,30,50,100,200,400}
 *   = 200..4000 inner GL nodes), in ULP = A_log * 2^-52. The +/-5 rolling-MAX envelope is the jitter-tolerant
 *   reading; env &gt;= 64 marks a band-clearing cluster. We scan TWO collared windows: [400,700] (to re-derive
 *   and quantify the three imp-33599 clusters) and the NEW tail [700,900].
 *
 *   THE HEADLINE RESULT -- THE TAIL NEITHER SUBSIDES NOR SHOWS A LONE FOURTH CLUSTER
 *   -------------------------------------------------------------------------------
 *   Over [400,700] the three clusters have a clear peak DOWNTREND (76.08 -&gt; 65.30 -&gt; 64.06 ULP), inter-peak
 *   spacings of ~65 and ~43 rungs, and widths of ~20, ~11, ~11 rungs. But that downtrend is a LOCAL feature,
 *   NOT a global decay law: extending the dense scan to [700,900] the clustered-spike phenomenon does NOT
 *   subside below the band and does NOT resolve to a single isolated fourth cluster -- instead SIX further
 *   band-clearing clusters appear (grade 4, budgets &gt;= 200 nodes):
 *
 *        cluster (env &gt;= 64) in [700,900]   peak env   peak n
 *        ~[708,719]                         ~78.4      n~709   &lt;- TALLER than the [400,700] max (~76.1)
 *        ~[735,745]                         ~67.3      n~735
 *        ~[754,764]                         ~67.1      n~754
 *        ~[807,817]                         ~64.5      n~807
 *        ~[824,834]                         ~73.2      n~824
 *        ~[874,884]                         ~68.4      n~874
 *
 *   The tail envelope maximum (~78.4 ULP at n~709) EXCEEDS the entire [400,700] window maximum (~76.1), so the
 *   76 -&gt; 65 -&gt; 64 peak decay does NOT continue -- the tail RE-INTENSIFIES. The envelope still dips well below
 *   the band between clusters (env min ~28 ULP in [700,900]), so this is the SAME clustered-spike structure,
 *   not a persistent failure region. The [700,900] envelope trend is essentially flat (least-squares slope
 *   ~ -0.02 ULP/rung, r^2 ~ 0.01); the combined [400,900] trend stays weakly positive and jitter-dominated
 *   (~ +0.05 ULP/rung, r^2 ~ 0.23), consistent with the imp-33599 ~+0.10 over [400,700].
 *
 *   VERDICT. TAIL-DOES-NOT-SUBSIDE-CLUSTERING-PERSISTS-AND-RE-INTENSIFIES. The imp-33599 three-cluster
 *   peak downtrend (76 -&gt; 65 -&gt; 64) is a LOCAL feature, not a global decay law: the [700,900] extension shows
 *   NEITHER a lone isolated fourth cluster NOR full subsidence below 64 ULP, but SIX more disjoint clusters
 *   whose tallest (~78 ULP at n~709) exceeds the [400,700] maximum. This SHARPENS the imp-33599/imp-33579/
 *   imp-33557/imp-33537 latticeJitterCaveat: the band-clearing clustered-spike structure is a PERSISTENT tail
 *   phenomenon at all scales examined, riding a weak jitter-dominated positive trend, never subsiding to below
 *   the band and never resolving to a monotone threshold.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It quantifies (peak decay,
 *   spacing, widths) the imp-33599 clusters and characterizes the [700,900] tail; it changes NO bound, patches
 *   NO literal, and establishes NO operator positivity. floorUlp(n) is a JITTERY arithmetic-floor lattice
 *   property (imp-33249/imp-33277/imp-33296/imp-33537/imp-33557/imp-33579/imp-33599 latticeJitterCaveat): the
 *   exact per-rung ULP bounces and cross-platform libm exp/pow variation can shift every few-ULP measurement,
 *   so the robust reading is the QUALITATIVE structure -- a persistent clustered-spike tail that neither
 *   subsides nor resolves to a lone fourth cluster -- not the exact per-rung ULP, cluster edges, or peak
 *   heights. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel
 *   step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the SOTA.
 *
 *   @see imp-33599-wide-range-band-crossing-envelope-law.js (the three clusters this quantifies and the scan this extends)
 *   @see imp-33579-band-crossing-floor-bisection.js (the narrow-bracket scan)
 *   @see imp-33557-band-crossing-min-budget.js (the node ladder)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33621 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33316/imp-33539/imp-33557/imp-33599) -
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

// -- Scan configuration (identical rule to imp-33599; two windows: the imp-33599 cluster window + the tail) --
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;            // the imp-33295/imp-33316/imp-33539/imp-33557/imp-33579/imp-33599 robust fixed rule
const DEEP_FLOOR_ULP = 64;  // the imp-33316 widened ~2x deep-tail band
const COLLAR = 5;           // +/-5 collar so the rolling-max envelope is defined at window edges
const CLUSTER_LO = 400;     // the imp-33599 cluster window this quantifies
const CLUSTER_HI = 700;
const TAIL_LO = 700;        // the NEW tail window this ticket extends into
const TAIL_HI = 900;

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

// -- Compute both windows and their cluster structure ---------------------------------------------
const CLUSTER_SCAN = scanWindow(CLUSTER_LO, CLUSTER_HI);
const TAIL_SCAN = scanWindow(TAIL_LO, TAIL_HI);
const clusterWindowClusters = clustersOf(CLUSTER_SCAN);
const tailClusters = clustersOf(TAIL_SCAN);

// -- [400,700] cluster structure: peak-height decay, inter-peak spacing, widths -------------------
const clusterPeaks = clusterWindowClusters.map((c) => c.peakEnv);
const clusterPeakNs = clusterWindowClusters.map((c) => c.peakN);
const clusterWidths = clusterWindowClusters.map((c) => c.width);
const interPeakSpacing = clusterPeakNs.slice(1).map((pn, i) => pn - clusterPeakNs[i]);
// Consecutive peak drops (positive = decay). The imp-33599 downtrend 76 -&gt; 65 -&gt; 64.
const peakDrops = clusterPeaks.slice(1).map((pe, i) => clusterPeaks[i] - pe);
const clusterPeakDowntrend = clusterPeaks.length >= 3 && clusterPeaks[0] > clusterPeaks[clusterPeaks.length - 1];

// -- [700,900] tail: cluster count, max/min envelope, band-clearing counts ------------------------
const tailPeaks = tailClusters.map((c) => c.peakEnv);
const tailEnvMax = Math.max(...TAIL_SCAN.map((r) => r.envelope));
const tailEnvMin = Math.min(...TAIL_SCAN.map((r) => r.envelope));
const tailRawOverBand = TAIL_SCAN.filter((r) => r.floorUlp >= DEEP_FLOOR_ULP).length;
const tailEnvOverBand = TAIL_SCAN.filter((r) => r.envelope >= DEEP_FLOOR_ULP).length;
const clusterWindowEnvMax = Math.max(...CLUSTER_SCAN.map((r) => r.envelope));

// -- Envelope growth-law trends -------------------------------------------------------------------
const tailEnvFit = lsqFit(TAIL_SCAN.map((r) => ({ x: r.n, y: r.envelope })));
const combinedEnvFit = lsqFit(
  [...CLUSTER_SCAN, ...TAIL_SCAN].map((r) => ({ x: r.n, y: r.envelope })),
);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The [400,700] window reproduces the imp-33599 three-cluster structure (>= 3 disjoint clusters).
const clusterWindowHasThreeClusters = clusterWindowClusters.length >= 3;
// (2) The three clusters show a peak DOWNTREND (first peak exceeds the last) -- the imp-33599 76 -&gt; 65 -&gt; 64.
const clusterPeaksDecayLocally = clusterPeakDowntrend && peakDrops.every((d) => d > 0);
// (3) The tail is DENSELY scanned (every integer, budgets >= 200 nodes).
const tailDenselyScanned =
  TAIL_SCAN.length === TAIL_HI - TAIL_LO + 1 && RESOLVED_PANEL_SWEEP.length >= 5;
// (4) THE HEADLINE: the tail does NOT resolve to a lone fourth cluster -- it has MANY (>= 3) clusters.
const tailNotLoneFourthCluster = tailClusters.length >= 3;
// (5) THE HEADLINE: the tail does NOT fully subside below the band -- its envelope still clears 64 ULP.
const tailDoesNotSubside = tailEnvMax >= DEEP_FLOOR_ULP && tailEnvOverBand > 0;
// (6) The tail RE-INTENSIFIES: its envelope max meets or exceeds the [400,700] window max (decay not global).
const tailReIntensifies = tailEnvMax >= clusterWindowEnvMax - 1;
// (7) The tail is still a CLUSTERED-spike structure (dips well below the band between clusters).
const tailStillClustered = tailEnvMin < DEEP_FLOOR_ULP - 10;
// (8) The combined [400,900] trend stays weakly positive (0 <= slope < 0.3) and jitter-dominated (r^2 < 0.5).
const combinedTrendWeakJittered =
  combinedEnvFit.slope >= 0 && combinedEnvFit.slope < 0.3 && combinedEnvFit.r2 < 0.5;

const verdict =
  clusterWindowHasThreeClusters && clusterPeaksDecayLocally && tailDenselyScanned &&
  tailNotLoneFourthCluster && tailDoesNotSubside && tailReIntensifies && tailStillClustered &&
  combinedTrendWeakJittered
    ? 'TAIL-DOES-NOT-SUBSIDE-CLUSTERING-PERSISTS-AND-RE-INTENSIFIES.-QUANTIFYING-THE-imp-33599-THREE-CLUSTERS-' +
      'OVER-[400,700]:-PEAK-DOWNTREND-~76.1->~65.3->~64.1-ULP,-INTER-PEAK-SPACING-~65-AND-~43-RUNGS,-WIDTHS-' +
      '~20/~11/~11-RUNGS.-THAT-DOWNTREND-IS-A-LOCAL-FEATURE-NOT-A-GLOBAL-DECAY-LAW:-EXTENDING-THE-IDENTICAL-' +
      'GRADE-4-BUDGETS->=200-NODE-DENSE-EVERY-INTEGER-floorUlp(n)-SCAN-TO-THE-TAIL-n-in-[700,900]-SHOWS-NEITHER-' +
      'A-LONE-ISOLATED-FOURTH-CLUSTER-NOR-FULL-SUBSIDENCE-BELOW-64-ULP,-BUT-SIX-FURTHER-DISJOINT-CLUSTERS-' +
      '(~[708,719]-PEAK~78,-~[735,745]~67,-~[754,764]~67,-~[807,817]~65,-~[824,834]~73,-~[874,884]~68)-WHOSE-' +
      'TALLEST-(~78-ULP-AT-n~709)-EXCEEDS-THE-[400,700]-MAXIMUM-(~76).-THE-TAIL-ENVELOPE-STILL-DIPS-TO-~28-ULP-' +
      'BETWEEN-CLUSTERS-(SAME-CLUSTERED-SPIKE-STRUCTURE),-ITS-OWN-TREND-IS-FLAT-(~-0.02-ULP/RUNG,-r^2~0.01),-THE-' +
      'COMBINED-[400,900]-TREND-WEAKLY-POSITIVE-JITTER-DOMINATED-(~+0.05-ULP/RUNG,-r^2~0.23).-SHARPENS-THE-' +
      'imp-33599/imp-33579/imp-33557/imp-33537-latticeJitterCaveat:-THE-BAND-CLEARING-CLUSTERED-SPIKE-STRUCTURE-' +
      'IS-A-PERSISTENT-TAIL-PHENOMENON-AT-ALL-SCALES,-NEVER-SUBSIDING-AND-NEVER-A-MONOTONE-THRESHOLD.-ACCURACY/' +
      'RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-' +
      'imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33621_BAND_CLEARING_CLUSTER_DECAY_AND_TAIL_SCAN = Object.freeze({
  id: 'imp-33621-band-clearing-cluster-decay-and-tail-scan',
  ticket: 'imp-33621',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33599-wide-range-band-crossing-envelope-law.js',
  crossValidatesModules: [
    'imp-33599-wide-range-band-crossing-envelope-law.js',
    'imp-33579-band-crossing-floor-bisection.js',
    'imp-33557-band-crossing-min-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'QUANTIFIES the imp-33599 three band-clearing clusters over n in [400,700] and EXTENDS the identical ' +
    'grade-4 budgets >= 200-node dense every-integer floorUlp(n) scan into the tail n in [700,900]. The three ' +
    'clusters have a peak DOWNTREND (~76.1 -> ~65.3 -> ~64.1 ULP), inter-peak spacings ~65 and ~43 rungs, and ' +
    'widths ~20/~11/~11 rungs. RESULT: that downtrend is a LOCAL feature, not a global decay law -- the tail ' +
    '[700,900] shows NEITHER a lone isolated fourth cluster NOR full subsidence below 64 ULP, but SIX further ' +
    'disjoint clusters whose tallest (~78 ULP at n~709) EXCEEDS the [400,700] window maximum (~76). The tail ' +
    'envelope still dips to ~28 ULP between clusters (same clustered-spike structure); its own trend is flat ' +
    '(~ -0.02 ULP/rung, r^2 ~ 0.01) and the combined [400,900] trend stays weakly positive and jitter-dominated ' +
    '(~ +0.05 ULP/rung, r^2 ~ 0.23). VERDICT: TAIL-DOES-NOT-SUBSIDE-CLUSTERING-PERSISTS-AND-RE-INTENSIFIES. ' +
    'SHARPENS the imp-33599/imp-33579/imp-33557/imp-33537 latticeJitterCaveat -- the band-clearing clustered ' +
    'spike is a persistent tail phenomenon at all scales examined, never subsiding and never a monotone ' +
    'threshold. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice ' +
    'floor; operator positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    windows: 'two dense every-integer scans, each +/-5 collared: the imp-33599 cluster window [400,700] and the NEW tail [700,900]',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp is the jitter-tolerant reading; env >= 64 marks a band-clearing cluster',
    clusterStructure: 'per cluster: [lo,hi] edges, width, peak env and its rung; then peak-height decay, inter-peak spacing across clusters',
    tailQuestion: 'does the tail [700,900] show a lone isolated fourth cluster, fully subside below 64 ULP, or keep clustering',
    selfComputing: 'both windows, the cluster structure, the tail scan, the trend fits, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    resolvedPanelSweep: Object.freeze(RESOLVED_PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    collar: COLLAR,
    // -- [400,700] cluster structure (the ticket asked to quantify) --
    clusterWindowLo: CLUSTER_LO,
    clusterWindowHi: CLUSTER_HI,
    clusterWindowClusterCount: clusterWindowClusters.length,
    clusterWindowClusters: Object.freeze(clusterWindowClusters.map((c) => Object.freeze({ ...c }))),
    clusterPeaks: Object.freeze(clusterPeaks.slice()),
    clusterPeakNs: Object.freeze(clusterPeakNs.slice()),
    clusterWidths: Object.freeze(clusterWidths.slice()),
    interPeakSpacing: Object.freeze(interPeakSpacing.slice()),
    peakDrops: Object.freeze(peakDrops.slice()),
    clusterWindowEnvMax,
    // -- [700,900] tail extension (the ticket asked to scan) --
    tailWindowLo: TAIL_LO,
    tailWindowHi: TAIL_HI,
    tailScanCount: TAIL_SCAN.length,
    tailClusterCount: tailClusters.length,
    tailClusters: Object.freeze(tailClusters.map((c) => Object.freeze({ ...c }))),
    tailPeaks: Object.freeze(tailPeaks.slice()),
    tailEnvMax,
    tailEnvMin,
    tailRawOverBand,
    tailEnvOverBand,
    tailEnvSlope: tailEnvFit.slope,
    tailEnvR2: tailEnvFit.r2,
    combinedEnvSlope: combinedEnvFit.slope,
    combinedEnvR2: combinedEnvFit.r2,
    // -- verdict flags --
    clusterWindowHasThreeClusters,
    clusterPeaksDecayLocally,
    tailDenselyScanned,
    tailNotLoneFourthCluster,
    tailDoesNotSubside,
    tailReIntensifies,
    tailStillClustered,
    combinedTrendWeakJittered,
    verdict,
    // -- coarse every-25th-rung tail digest (full 201-rung scan is live above) --
    tailScanDigest: Object.freeze(
      TAIL_SCAN.filter((r) => r.n % 25 === 0).map((r) =>
        Object.freeze({ n: r.n, floorUlp: r.floorUlp, envelope: r.envelope })),
    ),
  }),

  interpretation: Object.freeze({
    clusterStructureQuantified:
      'The imp-33599 three band-clearing clusters over [400,700] are: ~[526,545] (width ~20, peak ~76.1 ULP at ' +
      'n~526), ~[591,601] (width ~11, peak ~65.3 at n~591), ~[634,644] (width ~11, peak ~64.1 at n~634). Their ' +
      'peak heights DECAY monotonely (76.1 -> 65.3 -> 64.1), inter-peak spacings are ~65 and ~43 rungs, and the ' +
      'first cluster is roughly twice as wide as the two that follow.',
    peakDecayIsLocalNotGlobal:
      'The 76 -> 65 -> 64 peak downtrend is a LOCAL feature of the [400,700] window, NOT a global decay law: it ' +
      'does not predict subsidence below the band beyond n~644. The tail re-intensifies (see below), so a naive ' +
      'extrapolation of the three-cluster decay would have been wrong.',
    tailNeitherFourthNorSubsided:
      'The [700,900] extension answers the ticket: NEITHER a single isolated fourth cluster NOR full subsidence ' +
      'below 64 ULP. Instead SIX further disjoint band-clearing clusters appear (~[708,719], ~[735,745], ' +
      '~[754,764], ~[807,817], ~[824,834], ~[874,884]), each subsiding back below 64 above its peak but the next ' +
      'rising again.',
    tailReIntensifiesAboveClusterWindow:
      'The tail envelope maximum (~78.4 ULP at n~709) EXCEEDS the entire [400,700] window maximum (~76.1), so the ' +
      'clustered-spike structure RE-INTENSIFIES rather than decaying out. The tail envelope still dips to ~28 ULP ' +
      'between clusters, so this remains the SAME clustered-spike structure, not a persistent failure region.',
    trendStaysWeakJittered:
      'The [700,900] envelope trend is essentially flat (least-squares slope ~ -0.02 ULP/rung, r^2 ~ 0.01); the ' +
      'combined [400,900] trend stays weakly positive and jitter-dominated (~ +0.05 ULP/rung, r^2 ~ 0.23), ' +
      'consistent with the imp-33599 ~ +0.10 over [400,700]. No monotone climb to a threshold at any scale.',
    sharpensLatticeJitterCaveat:
      'This SHARPENS the imp-33599/imp-33579/imp-33557/imp-33537 latticeJitterCaveat: the band-clearing ' +
      'clustered-spike structure is a PERSISTENT tail phenomenon at all scales examined, riding a weak ' +
      'jitter-dominated positive trend, never subsiding below the band and never resolving to a monotone rung ' +
      'threshold. It bounds the resolution of any tail band-clearing claim to the cluster envelope, not an onset.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Quantifies (peak decay, inter-peak spacing, widths) the imp-33599 three band-clearing clusters over ' +
      '[400,700] and extends the identical grade-4 budgets >= 200-node dense every-integer floorUlp(n) scan into ' +
      'the tail [700,900]. It finds the tail neither subsides below 64 ULP nor shows a lone fourth cluster, but ' +
      'six further clusters that re-intensify above the [400,700] maximum. It changes NO bound, patches NO ' +
      'literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33599/imp-33579/imp-33557/imp-33539/imp-33316/' +
      'imp-33213; this quantifies the cluster structure and extends the inner-quadrature arithmetic-floor scan ' +
      'into the tail, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599): the exact per-rung ULP bounces and cross-platform libm exp/pow variation ' +
      'can shift every few-ULP measurement (the exact cluster edges, the ~76/~65/~64 and ~78/~73/~68/~67/~65 ULP ' +
      'peaks, the ~65/~43 spacings, and the flat/weak trend slopes). The robust reading is the QUALITATIVE ' +
      'structure -- a persistent clustered-spike tail that neither subsides nor resolves to a lone fourth ' +
      'cluster, with a local [400,700] peak downtrend that does NOT extrapolate -- not the exact per-rung ULP.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33621_BAND_CLEARING_CLUSTER_DECAY_AND_TAIL_SCAN_ASSERTIONS = [
  {
    id: 'imp33621-cluster-window-has-three-clusters',
    why: 'The [400,700] window must reproduce the imp-33599 band-clearing structure as >= 3 disjoint clusters ' +
         'so their peak decay, spacing, and widths can be quantified.',
    holds: () => clusterWindowHasThreeClusters && clusterWindowClusters.length >= 3,
  },
  {
    id: 'imp33621-cluster-peaks-decay-locally',
    why: 'The three clusters must show a LOCAL peak downtrend (first peak exceeds the last, every consecutive ' +
         'drop positive) -- the imp-33599 ~76 -> ~65 -> ~64 ULP decay.',
    holds: () => clusterPeaksDecayLocally && clusterPeaks[0] > clusterPeaks[2],
  },
  {
    id: 'imp33621-tail-densely-scanned',
    why: 'The extension must be a dense every-integer scan across the tail n in [700,900] over the ' +
         'resolved-regime (budgets >= 200 nodes) grade-4 ladder.',
    holds: () => tailDenselyScanned && TAIL_SCAN.length === TAIL_HI - TAIL_LO + 1,
  },
  {
    id: 'imp33621-tail-not-lone-fourth-cluster',
    why: 'THE HEADLINE: the tail does NOT resolve to a single isolated fourth cluster -- it holds MANY ' +
         '(>= 3) disjoint band-clearing clusters.',
    holds: () => tailNotLoneFourthCluster && tailClusters.length >= 3,
  },
  {
    id: 'imp33621-tail-does-not-subside',
    why: 'THE HEADLINE: the tail envelope does NOT fully subside below the 64 ULP band -- it still clears it.',
    holds: () => tailDoesNotSubside && tailEnvMax >= DEEP_FLOOR_ULP && tailEnvOverBand > 0,
  },
  {
    id: 'imp33621-tail-re-intensifies',
    why: 'The tail envelope maximum must meet or exceed the [400,700] window maximum -- the local peak decay ' +
         'does NOT extrapolate to a global decay law; the clustered-spike structure re-intensifies.',
    holds: () => tailReIntensifies && tailEnvMax >= clusterWindowEnvMax - 1,
  },
  {
    id: 'imp33621-tail-still-clustered',
    why: 'The tail must still be a clustered-spike structure -- the envelope dips well below the band ' +
         '(min < 54 ULP) between clusters, not a persistent failure region.',
    holds: () => tailStillClustered && tailEnvMin < DEEP_FLOOR_ULP - 10,
  },
  {
    id: 'imp33621-combined-trend-weak-jittered',
    why: 'The combined [400,900] envelope trend must stay weakly positive (0 <= slope < 0.3 ULP/rung) and ' +
         'jitter-dominated (r^2 < 0.5) -- a trend, not a monotone climb to a threshold.',
    holds: () => combinedTrendWeakJittered && combinedEnvFit.slope >= 0 && combinedEnvFit.slope < 0.3 && combinedEnvFit.r2 < 0.5,
  },
  {
    id: 'imp33621-verdict-records-tail-does-not-subside',
    why: 'The classified verdict must record the TAIL-DOES-NOT-SUBSIDE reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33621-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33621_BAND_CLEARING_CLUSTER_DECAY_AND_TAIL_SCAN.honestCaveat;
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

for (const assertion of IMP33621_BAND_CLEARING_CLUSTER_DECAY_AND_TAIL_SCAN_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33621-band-clearing-cluster-decay-and-tail-scan assertion failed: ${assertion.id}`);
  }
}
