/**
 * @module imp-33662-inter-cluster-trough-floor-drift-n400-1200
 * @fileoverview imp-33662 -- MEASURE the INTER-CLUSTER TROUGH floor of the imp-33638 grade-4
 *   floorUlp(n) +/-5 rolling-MAX envelope across the combined [400,1200] window, tabulate the
 *   local-minimum envelope between each adjacent band-clearing cluster pair, and fit trough-vs-n
 *   to test whether the between-cluster baseline stays FLAT or DRIFTS UPWARD as the cluster PEAKS
 *   re-intensify (imp-33660 read a weak positive peak-HEIGHT growth). A rising trough would mean
 *   the whole floor degrades; a flat trough isolates the growth to the peaks alone.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33638 LEFT UNMEASURED
 *   ------------------------------
 *   imp-33638 reported that the re-intensifying [900,1200] envelope still DIPS to env min ~17 ULP
 *   between clusters (matching the earlier [700,900] trough), and read that as evidence the
 *   re-intensification is clustered-spike structure rather than a persistent failure region. But it
 *   never TABULATED the trough floor per inter-cluster gap across the full [400,1200] window, so it
 *   never separated a genuine peak-envelope growth (imp-33660: weak positive peak-HEIGHT slope
 *   ~+0.067 ULP/rung) from a rising between-cluster BASELINE. This module re-runs the identical
 *   grade-4 floorUlp(n) +/-5 rolling-max envelope scan (one combined [400,1200] window, IDENTICAL to
 *   imp-33660 / imp-33661), extracts the LOCAL MINIMUM env in each inter-cluster gap, and fits
 *   trough-vs-n.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Identical rule to imp-33599 / imp-33621 / imp-33638 / imp-33660 / imp-33661: for every integer rung
 *   n take tau* = saddleTau(n), the imp-33213 log-domain target A_log(tau*), and score floorUlp(n) = the
 *   SMALLEST residual of the direct graded-GL plateau A_direct(tau*) over the resolved node ladder
 *   (grade 4, panels {20,30,50,100,200,400} = 200..4000 inner GL nodes), in ULP = A_log * 2^-52. The
 *   +/-5 rolling-MAX envelope is the jitter-tolerant reading; contiguous env &gt;= 64 marks a
 *   band-clearing cluster. Between each adjacent cluster pair (cluster_i.hi, cluster_{i+1}.lo) we take
 *   the LOCAL MINIMUM of the rolling-max envelope over the strictly-interior gap rungs -- the
 *   inter-cluster TROUGH -- and record its depth and location. We then fit the sixteen-cluster set's
 *   fifteen troughVals_i:
 *     trough-vs-n:  troughEnv_i = a + b * troughN_i   (b &gt; 0 rising, b ~ 0 flat),
 *   and cross-check the first-half vs second-half trough mean (a rising baseline would push the second
 *   half above the first). The trough slope is compared against the imp-33660 peak-HEIGHT slope: a
 *   trough slope far BELOW the peak slope isolates the growth to the peaks.
 *
 *   THE HEADLINE RESULT -- THE TROUGH FLOOR IS FLAT, THE GROWTH IS PEAK-ONLY
 *   -----------------------------------------------------------------------
 *   The sixteen peaks are [526,591,634,709,735,754,807,824,874,962,998,1038,1072,1104,1126,1198]
 *   (identical to imp-33660 / imp-33661), giving fifteen inter-cluster troughs at n ~
 *   [557,632,656,722,746,769,818,839,890,973,1010,1057,1083,1115,1181] with envelope depths ~
 *   [32.4,24.0,44.1,28.0,56.9,33.0,61.6,30.0,30.5,43.0,17.1,42.9,31.6,62.1,43.2] ULP: mean ~38.7,
 *   sd ~13.0, min ~17.1 (at n ~ 1010, the imp-33638 env-min trough), max ~62.1. Fitting troughEnv vs n
 *   gives slope b ~ +0.013 ULP/rung with R^2 ~ 0.04 -- statistically FLAT, no significant upward drift.
 *   The first-half trough mean ~40.0 is actually marginally ABOVE the second-half ~37.5, so the
 *   between-cluster baseline does NOT rise as the tail peaks re-intensify. The trough slope ~+0.013 is
 *   FAR below the imp-33660 peak-HEIGHT slope ~+0.067 (~5x smaller), so whatever weak positive height
 *   growth imp-33660 measured is carried by the PEAKS, not the floor. Note the trough MEAN ~38.7 sits
 *   well ABOVE the ~17 ULP env-min the ticket cites: the +/-5 rolling-MAX envelope LIFTS most troughs,
 *   so ~17 ULP is the single DEEPEST trough (n ~ 1010), not a persistent ~17 ULP baseline; the typical
 *   inter-cluster floor is ~38.7 ULP and jitter-bounces in ~17..62 ULP.
 *
 *   VERDICT. TROUGH-FLOOR-FLAT-NOT-RISING. The inter-cluster baseline across [400,1200] is flat
 *   (mean ~38.7 ULP, trough-vs-n slope ~+0.013 ULP/rung, R^2 ~ 0.04, second-half mean ~37.5 BELOW the
 *   first-half ~40.0), and its slope is ~5x smaller than the imp-33660 peak-HEIGHT slope ~+0.067. So
 *   the re-intensification is a PEAK-envelope effect, not a rising failure floor: the whole floor does
 *   NOT degrade. The deepest single trough ~17.1 ULP (n ~ 1010) recovers the imp-33638 env-min reading,
 *   but that is the floor of the jitter band, not a persistent baseline (typical trough ~38.7 ULP).
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It tabulates the
 *   inter-cluster trough floor of the band-clearing envelope and confirms it flat / non-rising; it
 *   changes NO bound, patches NO literal, and establishes NO operator positivity. floorUlp(n) is a
 *   JITTERY arithmetic-floor lattice property (imp-33249 / imp-33277 / imp-33296 / imp-33537 /
 *   imp-33557 / imp-33579 / imp-33599 / imp-33621 / imp-33638 / imp-33660 latticeJitterCaveat): the
 *   exact per-rung ULP bounces and cross-platform libm exp/pow variation can shift the exact trough
 *   rungs, depths, and hence the ~+0.013 slope, the ~0.04 R^2, and the ~38.7 mean. The robust reading
 *   is the QUALITATIVE conclusion -- the between-cluster floor is flat, not rising; the growth is
 *   peak-only -- not the exact fit coefficients. The NPHI = 10 Phi-series truncation is inherited
 *   upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the env-min ~17 ULP reading this tabulates)
 *   @see imp-33660-cluster-peak-envelope-height-growth-fit.js (the peak-HEIGHT slope this contrasts against)
 *   @see imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js (the same [400,1200] sixteen-cluster scan)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33662 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33557/imp-33599/imp-33660) -
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

// -- Scan configuration (identical rule to imp-33599/imp-33621/imp-33638/imp-33660/imp-33661; [400,1200]) -
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;            // the imp-33295/imp-33316/imp-33539/imp-33557/imp-33599/imp-33621 robust rule
const DEEP_FLOOR_ULP = 64;  // the imp-33316 widened ~2x deep-tail band
const COLLAR = 5;           // +/-5 collar so the rolling-max envelope is defined at window edges
const COMBINED_LO = 400;    // the imp-33599 + imp-33621 + imp-33638 combined cluster window
const COMBINED_HI = 1200;

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

// -- Disjoint contiguous clusters of env &gt;= 64 (peak height/location, span) -----------------------
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

// -- Least-squares slope/intercept/r^2 helper (also returns SSR for residual-RMS) -----------------
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
  return { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : 0, ssr };
}

// -- Compute the combined [400,1200] scan, extract the sixteen cluster peaks -----------------------
const COMBINED_SCAN = scanWindow(COMBINED_LO, COMBINED_HI);
const CLUSTERS = clustersOf(COMBINED_SCAN);
const peakNs = CLUSTERS.map((c) => c.peakN);

// -- Inter-cluster TROUGHS: the LOCAL MINIMUM envelope in each strictly-interior gap ---------------
const rowByN = new Map();
for (const r of COMBINED_SCAN) rowByN.set(r.n, r);
const TROUGHS = [];
for (let i = 0; i < CLUSTERS.length - 1; i += 1) {
  const gapLo = CLUSTERS[i].hi + 1;
  const gapHi = CLUSTERS[i + 1].lo - 1;
  let minEnv = Infinity;
  let minN = null;
  for (let n = gapLo; n <= gapHi; n += 1) {
    const e = rowByN.get(n).envelope;
    if (e < minEnv) { minEnv = e; minN = n; }
  }
  TROUGHS.push(Object.freeze({
    fromPeakN: CLUSTERS[i].peakN,
    toPeakN: CLUSTERS[i + 1].peakN,
    troughN: minN,
    troughEnv: minEnv,
    gapLo,
    gapHi,
  }));
}

const troughEnvs = TROUGHS.map((t) => t.troughEnv);
const troughNs = TROUGHS.map((t) => t.troughN);

// -- Trough dispersion (mean, sd, min, max) -------------------------------------------------------
const troughMean = troughEnvs.reduce((a, b) => a + b, 0) / troughEnvs.length;
const troughVar = troughEnvs.reduce((a, b) => a + (b - troughMean) * (b - troughMean), 0) / troughEnvs.length;
const troughSd = Math.sqrt(troughVar);
const troughMin = Math.min(...troughEnvs);
const troughMax = Math.max(...troughEnvs);

// -- Trough-vs-n least-squares (the flat-vs-rising discriminant) -----------------------------------
const troughFit = lsqFit(TROUGHS.map((t) => ({ x: t.troughN, y: t.troughEnv })));
const troughSlope = troughFit.slope;
const troughR2 = troughFit.r2;
const troughRms = Math.sqrt(troughFit.ssr / TROUGHS.length);

// -- First-half vs second-half trough mean (a rising baseline lifts the second half) --------------
const HALF = Math.floor(TROUGHS.length / 2);
const firstHalf = troughEnvs.slice(0, HALF);
const secondHalf = troughEnvs.slice(HALF);
const firstHalfMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
const secondHalfMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

// -- The imp-33660 peak-HEIGHT slope and imp-33638 env-min baselines (the contrast anchors) --------
const IMP33660_PEAK_HEIGHT_SLOPE = 0.067; // ULP/rung; the weak positive peak-envelope growth
const IMP33638_ENV_MIN_ULP = 17;          // the imp-33638 between-cluster env min

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The combined [400,1200] scan reproduces the sixteen-cluster structure (>= 15), giving >= 14 troughs.
const sixteenClustersFound = CLUSTERS.length >= 15 && TROUGHS.length >= 14;
// (2) THE HEADLINE: trough-vs-n is statistically FLAT -- weak R^2, no significant upward drift.
const troughFloorFlat = troughR2 < 0.15;
// (3) THE HEADLINE: the between-cluster baseline does NOT rise -- second-half mean does not exceed the first.
const baselineNotRising = secondHalfMean <= firstHalfMean + 1e-9;
// (4) THE HEADLINE: the trough slope is FAR below the imp-33660 peak-HEIGHT slope (< half) -- growth peak-only.
const growthIsolatedToPeaks = troughSlope < 0.5 * IMP33660_PEAK_HEIGHT_SLOPE;
// (5) The deepest single trough recovers the imp-33638 env-min ~17 ULP reading (within ~5 ULP).
const deepestTroughMatchesEnvMin = Math.abs(troughMin - IMP33638_ENV_MIN_ULP) <= 5;
// (6) The typical trough sits WELL ABOVE the deepest one -- so ~17 ULP is the band floor, not the baseline.
const troughMeanAboveDeepest = troughMean > troughMin + 10;

const verdict =
  sixteenClustersFound && troughFloorFlat && baselineNotRising && growthIsolatedToPeaks &&
  deepestTroughMatchesEnvMin && troughMeanAboveDeepest
    ? 'TROUGH-FLOOR-FLAT-NOT-RISING.-TABULATING-THE-INTER-CLUSTER-TROUGH-FLOOR-OF-THE-imp-33638-GRADE-4-' +
      'floorUlp(n)-+/-5-ROLLING-MAX-ENVELOPE-ACROSS-[400,1200]-(SIXTEEN-CLUSTERS-~526,591,634,709,735,754,' +
      '807,824,874,962,998,1038,1072,1104,1126,1198;-FIFTEEN-INTER-CLUSTER-TROUGHS-AT-n~557..1181,-DEPTHS-' +
      '~[32,24,44,28,57,33,62,30,31,43,17,43,32,62,43]-ULP):-THE-TROUGH-FLOOR-IS-FLAT-(MEAN~38.7,-SD~13.0,-' +
      'MIN~17.1-AT-n~1010,-MAX~62.1),-trough-vs-n-SLOPE~+0.013-ULP/RUNG-R^2~0.04,-AND-THE-FIRST-HALF-MEAN~40.0-' +
      'IS-MARGINALLY-ABOVE-THE-SECOND-HALF~37.5,-SO-THE-BETWEEN-CLUSTER-BASELINE-DOES-NOT-RISE-AS-THE-TAIL-' +
      'PEAKS-RE-INTENSIFY.-THE-TROUGH-SLOPE~+0.013-IS-~5x-SMALLER-THAN-THE-imp-33660-PEAK-HEIGHT-SLOPE~+0.067,-' +
      'SO-THE-WEAK-POSITIVE-GROWTH-imp-33660-MEASURED-IS-A-PEAK-ENVELOPE-EFFECT,-NOT-A-RISING-FLOOR:-THE-WHOLE-' +
      'FLOOR-DOES-NOT-DEGRADE.-THE-DEEPEST-SINGLE-TROUGH~17.1-ULP-(n~1010)-RECOVERS-THE-imp-33638-ENV-MIN,-BUT-' +
      'THAT-IS-THE-JITTER-BAND-FLOOR,-NOT-A-PERSISTENT-BASELINE-(TYPICAL-TROUGH~38.7-ULP-BECAUSE-THE-+/-5-' +
      'ROLLING-MAX-LIFTS-MOST-TROUGHS).-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-' +
      'mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33662_INTER_CLUSTER_TROUGH_FLOOR_DRIFT = Object.freeze({
  id: 'imp-33662-inter-cluster-trough-floor-drift-n400-1200',
  ticket: 'imp-33662',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
  crossValidatesModules: [
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'MEASURES the INTER-CLUSTER TROUGH floor of the imp-33638 grade-4 floorUlp(n) +/-5 rolling-max envelope ' +
    'across the combined [400,1200] window, tabulating the LOCAL MINIMUM env in each of the fifteen gaps between ' +
    'the sixteen band-clearing cluster peaks, off the SAME scan as imp-33660/imp-33661. RESULT: the troughs sit ' +
    'at n ~ 557..1181 with depths ~[32,24,44,28,57,33,62,30,31,43,17,43,32,62,43] ULP (mean ~38.7, sd ~13.0, ' +
    'min ~17.1 at n ~ 1010, max ~62.1); trough-vs-n slope ~+0.013 ULP/rung with R^2 ~ 0.04 -- statistically FLAT ' +
    '-- and the first-half mean ~40.0 is marginally ABOVE the second-half ~37.5, so the between-cluster baseline ' +
    'does NOT rise. The trough slope is ~5x smaller than the imp-33660 peak-HEIGHT slope ~+0.067, isolating the ' +
    'weak positive growth to the PEAKS. VERDICT: TROUGH-FLOOR-FLAT-NOT-RISING -- the re-intensification is a peak ' +
    'effect, not a degrading floor; the ~17 ULP env-min the ticket cites is the single deepest trough (jitter-band ' +
    'floor), not a persistent baseline. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-' +
    'sufficient; jittery lattice floor; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'ONE dense every-integer scan of the combined [400,1200] window, +/-5 collared, reproducing all sixteen clusters',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp; contiguous env >= 64 marks a band-clearing cluster',
    trough: 'between adjacent clusters (cluster_i.hi, cluster_{i+1}.lo) take the LOCAL MINIMUM envelope over the strictly-interior gap rungs -- the inter-cluster TROUGH depth and location',
    troughFit: 'least-squares troughEnv_i = a + b*troughN_i; b > 0 rising baseline, b ~ 0 (weak R^2) flat baseline',
    halfSplit: 'first-half vs second-half trough mean; a rising floor pushes the second-half mean above the first',
    peakContrast: 'compare the trough slope against the imp-33660 peak-HEIGHT slope ~+0.067: a trough slope << peak slope isolates the growth to the peaks',
    selfComputing: 'the scan, the sixteen peaks, the fifteen troughs, the trough-vs-n fit, the half-split, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    resolvedPanelSweep: Object.freeze(RESOLVED_PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    collar: COLLAR,
    combinedWindowLo: COMBINED_LO,
    combinedWindowHi: COMBINED_HI,
    clusterCount: CLUSTERS.length,
    peakNs: Object.freeze(peakNs.slice()),
    troughCount: TROUGHS.length,
    troughNs: Object.freeze(troughNs.slice()),
    troughEnvs: Object.freeze(troughEnvs.slice()),
    // -- trough dispersion --
    troughMean,
    troughSd,
    troughMin,
    troughMax,
    // -- trough-vs-n fit (the flat-vs-rising discriminant) --
    troughSlope,
    troughIntercept: troughFit.intercept,
    troughR2,
    troughRms,
    // -- half-split --
    firstHalfMean,
    secondHalfMean,
    halfSplitDelta: secondHalfMean - firstHalfMean,
    // -- contrast anchors --
    imp33660PeakHeightSlope: IMP33660_PEAK_HEIGHT_SLOPE,
    imp33638EnvMinUlp: IMP33638_ENV_MIN_ULP,
    troughSlopeVsPeakSlopeRatio: IMP33660_PEAK_HEIGHT_SLOPE !== 0 ? troughSlope / IMP33660_PEAK_HEIGHT_SLOPE : Infinity,
    // -- verdict flags --
    sixteenClustersFound,
    troughFloorFlat,
    baselineNotRising,
    growthIsolatedToPeaks,
    deepestTroughMatchesEnvMin,
    troughMeanAboveDeepest,
    verdict,
    troughs: Object.freeze(TROUGHS.map((t) => Object.freeze({ ...t }))),
  }),

  interpretation: Object.freeze({
    troughsTabulated:
      'The combined [400,1200] scan reproduces the sixteen imp-33660/imp-33661 cluster peaks, so the fifteen ' +
      'inter-cluster gaps run off the SAME floorUlp(n) scan (not transcribed literals). Each gaps LOCAL MINIMUM ' +
      'rolling-max envelope is its trough; the fifteen troughs sit at n ~ 557..1181.',
    troughFloorFlat:
      'Fitting troughEnv vs n gives slope ~+0.013 ULP/rung with R^2 ~ 0.04 -- statistically flat. The between-' +
      'cluster baseline shows NO significant upward drift across [400,1200]; the trough depths jitter-bounce in ' +
      '~17..62 ULP around a ~38.7 ULP mean with no n-trend.',
    baselineNotRising:
      'The first-half trough mean ~40.0 is marginally ABOVE the second-half ~37.5, so the between-cluster floor ' +
      'does NOT rise as the imp-33638 tail peaks re-intensify -- if anything it is flat-to-slightly-lower. A rising ' +
      'failure floor is ruled out on this sample.',
    growthIsolatedToPeaks:
      'The trough slope ~+0.013 ULP/rung is ~5x smaller than the imp-33660 peak-HEIGHT slope ~+0.067. So whatever ' +
      'weak positive envelope growth imp-33660 measured is carried by the cluster PEAKS, not the between-cluster ' +
      'baseline: the re-intensification is clustered-spike structure, not a degrading floor.',
    envMinIsBandFloorNotBaseline:
      'The deepest single trough ~17.1 ULP (n ~ 1010) recovers the imp-33638 env-min ~17 ULP reading, but the ' +
      'typical trough is ~38.7 ULP -- the +/-5 rolling-MAX envelope LIFTS most troughs. So ~17 ULP is the FLOOR of ' +
      'the jitter band, not a persistent between-cluster baseline; the ticket-cited ~17 ULP would over-read the ' +
      'typical floor by ~2x.',
    verdictFlatNotRising:
      'VERDICT: TROUGH-FLOOR-FLAT-NOT-RISING. The between-cluster baseline across [400,1200] is flat / non-rising ' +
      'and its slope is ~5x below the peak-height slope, so the imp-33638 re-intensification and the imp-33660 weak ' +
      'peak-height growth are PEAK-envelope effects, not a rising failure region. This bounds any tail band-clearing ' +
      'claim to the cluster spikes, leaving the between-cluster floor intact.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Tabulates the fifteen inter-cluster trough depths of the imp-33638 grade-4 floorUlp(n) +/-5 rolling-max ' +
      'envelope (re-derived off the same scan over [400,1200]) and fits trough-vs-n to test flat vs rising, ' +
      'contrasting the trough slope against the imp-33660 peak-HEIGHT slope. It changes NO bound, patches NO ' +
      'literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33660/imp-33661/imp-33638/imp-33621/imp-33599/' +
      'imp-33557/imp-33539/imp-33316/imp-33213; this tabulates the inter-cluster trough floor of the located ' +
      'envelope, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621/imp-33638/imp-33660): the exact per-rung ULP bounces and ' +
      'cross-platform libm exp/pow variation can shift the exact trough rungs, depths, and hence the ~+0.013 ' +
      'slope, the ~0.04 R^2, the ~38.7 mean, and the ~17.1 deepest trough. The robust reading is the QUALITATIVE ' +
      'conclusion -- the between-cluster floor is flat, not rising, and the growth is peak-only -- not the exact ' +
      'fit coefficients.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33662_INTER_CLUSTER_TROUGH_FLOOR_DRIFT_ASSERTIONS = [
  {
    id: 'imp33662-sixteen-clusters-fifteen-troughs',
    why: 'The combined [400,1200] scan must reproduce the sixteen-cluster structure (>= 15 clusters) so the ' +
         'inter-cluster trough tabulation runs off the same floorUlp scan and yields >= 14 troughs.',
    holds: () => sixteenClustersFound && CLUSTERS.length >= 15 && TROUGHS.length >= 14,
  },
  {
    id: 'imp33662-trough-floor-flat',
    why: 'THE HEADLINE: fitting the inter-cluster trough depths vs n must be statistically FLAT (R^2 < 0.15) -- ' +
         'no significant upward drift of the between-cluster baseline.',
    holds: () => troughFloorFlat && troughR2 < 0.15,
  },
  {
    id: 'imp33662-baseline-not-rising',
    why: 'THE HEADLINE: the second-half trough mean must NOT exceed the first-half mean -- the between-cluster ' +
         'floor does not rise as the tail peaks re-intensify.',
    holds: () => baselineNotRising && secondHalfMean <= firstHalfMean + 1e-9,
  },
  {
    id: 'imp33662-growth-isolated-to-peaks',
    why: 'THE HEADLINE: the trough slope must be FAR below (< half) the imp-33660 peak-HEIGHT slope ~+0.067, so ' +
         'the weak positive envelope growth is carried by the PEAKS, not the floor.',
    holds: () => growthIsolatedToPeaks && troughSlope < 0.5 * IMP33660_PEAK_HEIGHT_SLOPE,
  },
  {
    id: 'imp33662-deepest-trough-recovers-env-min',
    why: 'The deepest single trough must recover the imp-33638 env-min ~17 ULP reading (within ~5 ULP), ' +
         'confirming the scan reproduces the earlier trough.',
    holds: () => deepestTroughMatchesEnvMin && Math.abs(troughMin - IMP33638_ENV_MIN_ULP) <= 5,
  },
  {
    id: 'imp33662-env-min-is-band-floor-not-baseline',
    why: 'The typical trough mean must sit WELL ABOVE the deepest trough (> min + 10 ULP), so the ~17 ULP env-min ' +
         'is the jitter-band floor, not a persistent between-cluster baseline (which is ~38.7 ULP).',
    holds: () => troughMeanAboveDeepest && troughMean > troughMin + 10,
  },
  {
    id: 'imp33662-verdict-records-flat-not-rising',
    why: 'The classified verdict must record the TROUGH-FLOOR-FLAT-NOT-RISING reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33662-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33662_INTER_CLUSTER_TROUGH_FLOOR_DRIFT.honestCaveat;
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

for (const assertion of IMP33662_INTER_CLUSTER_TROUGH_FLOOR_DRIFT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33662-inter-cluster-trough-floor-drift-n400-1200 assertion failed: ${assertion.id}`);
  }
}
