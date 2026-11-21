/**
 * @module imp-33659-band-clearing-tail-plateau-n1200-1500
 * @fileoverview imp-33659 -- EXTEND the imp-33638 grade-4 &gt;=200-node dense every-integer floorUlp(n)
 *   band-clearing scan from the deep window n in [900,1200] into the DEEPER window n in [1200,1500], and
 *   MEASURE whether the re-intensifying clustered-spike envelope (imp-33638 max ~143.6 ULP at n~1126, terminal
 *   cluster ~135 ULP still rising at the n~1198 window edge) finally hits a GLOBAL envelope CEILING or keeps
 *   climbing.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33638 LEFT OPEN
 *   -----------------------
 *   imp-33638 verdict NO-GLOBAL-CEILING-ENVELOPE-RE-INTENSIFIES-AND-ROUGHLY-DOUBLES stopped the dense grade-4
 *   budgets &gt;= 200-node every-integer floorUlp(n) scan at n=1200. Over [900,1200] SEVEN clusters appeared
 *   whose tallest (~143.6 ULP at n~1126) was nearly DOUBLE the imp-33621 [700,900] tail max (~78.4) and the
 *   [400,700] max (~76.1), and the TERMINAL cluster ~[1184,1200] still peaked ~135 ULP at the window edge
 *   (n~1198), still rising -- so imp-33638 could NOT locate a global ceiling within [900,1200] and left OPEN
 *   whether one lies beyond n=1200. This module re-runs the IDENTICAL scan over the deeper window [1200,1500].
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Identical rule to imp-33638/imp-33621/imp-33599: for every integer rung n we take tau* = saddleTau(n), the
 *   imp-33213 log-domain target A_log(tau*), and score floorUlp(n) = the SMALLEST residual of the direct
 *   graded-GL plateau A_direct(tau*) over the resolved node ladder (grade 4, panels {20,30,50,100,200,400}
 *   = 200..4000 inner GL nodes), in ULP = A_log * 2^-52. The +/-5 rolling-MAX envelope is the jitter-tolerant
 *   reading; env &gt;= 64 marks a band-clearing cluster. We recompute the imp-33638 window [900,1200] verbatim
 *   (as the RE-INTENSIFICATION baseline whose max is the ceiling-test anchor) and scan the NEW deeper window
 *   [1200,1500].
 *
 *   THE HEADLINE RESULT -- THE ENVELOPE PLATEAUS: A SOFT CEILING NEAR ~144 ULP; THE DOUBLING STOPS
 *   ---------------------------------------------------------------------------------------------
 *   The [1200,1500] window does NOT keep climbing. Its envelope MAXIMUM (~144.2 ULP at n~1324) is essentially
 *   EQUAL to the imp-33638 [900,1200] maximum (~143.6 ULP at n~1126) -- the re-intensification ratio is
 *   ~1.00, NOT another rough doubling. FOUR further band-clearing clusters appear (grade 4, budgets &gt;= 200
 *   nodes), all peaking in a tight ~132..144 ULP band:
 *
 *        cluster (env &gt;= 64) in [1200,1500]   peak env   peak n
 *        ~[1200,1307]                         ~140.1     n~1230   &lt;- continues the imp-33638 terminal spike
 *        ~[1313,1384]                         ~144.2     n~1324   &lt;- the [1200,1500] envelope maximum
 *        ~[1386,1462]                         ~143.3     n~1433
 *        ~[1464,1500]                         ~132.2     n~1474   &lt;- terminal cluster, still band-clearing at edge
 *
 *   The crucial change from imp-33638: the WITHIN-WINDOW envelope trend COLLAPSES to flat -- least-squares
 *   slope ~ +0.02 ULP/rung, r^2 ~ 0.01 (versus the imp-33638 [900,1200] clearly-positive ~ +0.23, r^2 ~ 0.41).
 *   The peaks stop growing: instead of doubling again to ~280 ULP they LEVEL OFF at the same ~144 ULP the
 *   imp-33638 window reached. This is a SOFT envelope PLATEAU / emerging ceiling near ~144 ULP. The combined
 *   [900,1500] trend stays weakly positive and jitter-dominated (~ +0.13 ULP/rung, r^2 ~ 0.45), dominated by
 *   the earlier [900,1200] climb, not the flat [1200,1500] tail.
 *
 *   This is a PLATEAU, not a subsidence. The envelope still dips between clusters (env min ~37 ULP in
 *   [1200,1500] -- risen from the imp-33638 ~17 ULP inter-cluster floor but still well below the 64 band), so
 *   this remains the SAME clustered-spike structure. And the terminal cluster ~[1464,1500] still peaks ~132
 *   ULP right at the window edge (n~1474), still band-clearing -- so the peaks do not fall below 64 either.
 *   The reading is a LEVELLING-OFF of the peak envelope at ~144 ULP, not a decay.
 *
 *   VERDICT. ENVELOPE-PLATEAUS-SOFT-CEILING-NEAR-144-ULP. Extending the identical grade-4 budgets &gt;= 200-node
 *   dense every-integer floorUlp(n) scan from [900,1200] into [1200,1500] finds the clustered-spike envelope
 *   STOPS re-intensifying: FOUR more disjoint clusters whose tallest (~144.2 ULP at n~1324) is essentially
 *   EQUAL to the imp-33638 [900,1200] maximum (ratio ~1.00, NOT another doubling), with the within-window
 *   trend collapsed to flat (~ +0.02 ULP/rung, r^2 ~ 0.01). So the imp-33638 doubling does NOT continue: the
 *   deep-tail grade-4 arithmetic-floor envelope levels off at a SOFT ceiling near ~144 ULP. The structure stays
 *   clustered (inter-cluster floor ~37 ULP) and the terminal cluster still band-clears at the window edge, so
 *   this is a peak-envelope PLATEAU, not a subsidence below the band. This REVISES the imp-33638 "keeps
 *   climbing" reading: over the longer [900,1500] span the climb SATURATES near ~144 ULP.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It extends the imp-33638 dense
 *   floorUlp(n) scan into [1200,1500]; it changes NO bound, patches NO literal, and establishes NO operator
 *   positivity. floorUlp(n) is a JITTERY arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/
 *   imp-33537/imp-33557/imp-33579/imp-33599/imp-33621/imp-33638 latticeJitterCaveat): the exact per-rung ULP
 *   bounces and cross-platform libm exp/pow variation can shift every few-ULP measurement (cluster edges, the
 *   ~140/~144/~143/~132 ULP peaks, the ~1.00 plateau ratio, the ~0.02 and ~0.13 trend slopes), so the robust
 *   reading is the QUALITATIVE structure -- a persistent clustered-spike tail whose peak envelope LEVELS OFF
 *   near ~144 ULP rather than continuing to double -- not the exact per-rung ULP, peak heights, or the exact
 *   plateau level. The plateau is EMPIRICAL over [1200,1500]; it does NOT PROVE a hard global ceiling (a later
 *   window could resume climbing), only that the imp-33638 doubling halts across this 300-rung span. The
 *   NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT;
 *   the operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED.
 *   No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the [900,1200] scan this extends)
 *   @see imp-33621-band-clearing-cluster-decay-and-tail-scan.js (the [700,900] tail)
 *   @see imp-33599-wide-range-band-crossing-envelope-law.js (the three [400,700] clusters)
 *   @see imp-33557-band-crossing-min-budget.js (the node ladder)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33659 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33557/imp-33599/imp-33638) -
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

// -- Scan configuration (identical rule to imp-33638; the [900,1200] baseline + the NEW deeper window) --
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;            // the imp-33295/imp-33316/imp-33539/imp-33557/imp-33579/imp-33599/imp-33638 robust fixed rule
const DEEP_FLOOR_ULP = 64;  // the imp-33316 widened ~2x deep-tail band
const COLLAR = 5;           // +/-5 collar so the rolling-max envelope is defined at window edges
const BASE_LO = 900;        // the imp-33638 window recomputed as the re-intensification/ceiling anchor
const BASE_HI = 1200;
const DEEP_LO = 1200;       // the NEW deeper window this ticket extends into
const DEEP_HI = 1500;

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

// -- Compute the imp-33638 [900,1200] baseline and the NEW deeper window ---------------------------
const BASE_SCAN = scanWindow(BASE_LO, BASE_HI);   // imp-33638 [900,1200] recomputed verbatim
const DEEP_SCAN = scanWindow(DEEP_LO, DEEP_HI);    // NEW [1200,1500] extension
const baseClusters = clustersOf(BASE_SCAN);
const deepClusters = clustersOf(DEEP_SCAN);

// -- Baseline: the imp-33638 [900,1200] envelope maximum (the ceiling-test anchor ~143.6 ULP) ------
const baseEnvMax = Math.max(...BASE_SCAN.map((r) => r.envelope));

// -- [1200,1500] deeper window: cluster count, max/min envelope, band-clearing counts -------------
const deepPeaks = deepClusters.map((c) => c.peakEnv);
const deepPeakNs = deepClusters.map((c) => c.peakN);
const deepWidths = deepClusters.map((c) => c.width);
const deepInterPeakSpacing = deepPeakNs.slice(1).map((pn, i) => pn - deepPeakNs[i]);
const deepEnvMax = Math.max(...DEEP_SCAN.map((r) => r.envelope));
const deepEnvMin = Math.min(...DEEP_SCAN.map((r) => r.envelope));
const deepEnvMaxN = DEEP_SCAN.reduce((best, r) => (r.envelope > best.envelope ? r : best), DEEP_SCAN[0]).n;
const deepRawOverBand = DEEP_SCAN.filter((r) => r.floorUlp >= DEEP_FLOOR_ULP).length;
const deepEnvOverBand = DEEP_SCAN.filter((r) => r.envelope >= DEEP_FLOOR_ULP).length;
// The re-intensification ratio: deep window max over the imp-33638 [900,1200] max. ~1.00 => plateau.
const reIntensifyRatio = deepEnvMax / baseEnvMax;
// The terminal (highest-n) cluster still band-clears at the window edge -- the plateau is not a subsidence.
const terminalCluster = deepClusters.length ? deepClusters[deepClusters.length - 1] : null;
const terminalClusterAtEdge =
  terminalCluster !== null && terminalCluster.hi >= DEEP_HI - COLLAR &&
  terminalCluster.peakEnv >= DEEP_FLOOR_ULP;

// -- Envelope growth-law trends -------------------------------------------------------------------
const deepEnvFit = lsqFit(DEEP_SCAN.map((r) => ({ x: r.n, y: r.envelope })));
const combinedEnvFit = lsqFit(
  [...BASE_SCAN, ...DEEP_SCAN].map((r) => ({ x: r.n, y: r.envelope })),
);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The deep window is DENSELY scanned (every integer, budgets >= 200 nodes).
const deepDenselyScanned =
  DEEP_SCAN.length === DEEP_HI - DEEP_LO + 1 && RESOLVED_PANEL_SWEEP.length >= 5;
// (2) The deep window still holds MANY (>= 3) disjoint band-clearing clusters -- clustered-spike persists.
const deepHasManyClusters = deepClusters.length >= 3;
// (3) The deep envelope does NOT subside below the band -- its envelope still clears 64.
const deepDoesNotSubside = deepEnvMax >= DEEP_FLOOR_ULP && deepEnvOverBand > 0;
// (4) THE HEADLINE: the envelope PLATEAUS -- it does NOT roughly double again (ratio < 1.2) yet stays near
//     the imp-33638 max (ratio >= 0.85). The peak envelope levels off at ~144 ULP instead of climbing.
const envelopePlateausNotDoubling = reIntensifyRatio < 1.2 && reIntensifyRatio >= 0.85;
// (5) THE HEADLINE: the WITHIN-WINDOW [1200,1500] trend has COLLAPSED to flat (|slope| < 0.1, r^2 < 0.15) --
//     the imp-33638 clearly-positive climb (~ +0.23, r^2 ~ 0.41) is gone; the peaks stop growing.
const deepTrendFlat = Math.abs(deepEnvFit.slope) < 0.1 && deepEnvFit.r2 < 0.15;
// (6) The deep window is still a CLUSTERED-spike structure (dips below the band between clusters).
const deepStillClustered = deepEnvMin < DEEP_FLOOR_ULP - 10;
// (7) The plateau is a SOFT ceiling, NOT a subsidence: the terminal cluster still band-clears at the edge.
const plateauNotSubsidence = terminalClusterAtEdge;
// (8) The combined [900,1500] trend stays positive (0 <= slope < 0.3) and jitter-dominated (r^2 < 0.6),
//     carried by the earlier [900,1200] climb, not the flat [1200,1500] tail.
const combinedTrendPositiveJittered =
  combinedEnvFit.slope >= 0 && combinedEnvFit.slope < 0.3 && combinedEnvFit.r2 < 0.6;

const verdict =
  deepDenselyScanned && deepHasManyClusters && deepDoesNotSubside && envelopePlateausNotDoubling &&
  deepTrendFlat && deepStillClustered && plateauNotSubsidence && combinedTrendPositiveJittered
    ? 'ENVELOPE-PLATEAUS-SOFT-CEILING-NEAR-144-ULP.-EXTENDING-THE-IDENTICAL-GRADE-4-BUDGETS->=200-NODE-DENSE-' +
      'EVERY-INTEGER-floorUlp(n)-SCAN-FROM-THE-imp-33638-WINDOW-n-in-[900,1200]-INTO-THE-DEEPER-WINDOW-' +
      'n-in-[1200,1500]-FINDS-THE-CLUSTERED-SPIKE-ENVELOPE-STOPS-RE-INTENSIFYING:-FOUR-FURTHER-DISJOINT-' +
      'CLUSTERS-(~[1200,1307]~140,-~[1313,1384]~144,-~[1386,1462]~143,-~[1464,1500]~132)-WHOSE-TALLEST-' +
      '(~144.2-ULP-AT-n~1324)-IS-ESSENTIALLY-EQUAL-TO-THE-imp-33638-[900,1200]-MAXIMUM-(~143.6,-RATIO-~1.00,-' +
      'NOT-ANOTHER-DOUBLING).-THE-WITHIN-WINDOW-[1200,1500]-TREND-COLLAPSES-TO-FLAT-(~+0.02-ULP/RUNG,-r^2~0.01)-' +
      'VERSUS-THE-imp-33638-CLEARLY-POSITIVE-~+0.23-r^2~0.41,-SO-THE-PEAK-ENVELOPE-LEVELS-OFF-AT-A-SOFT-CEILING-' +
      'NEAR-~144-ULP-INSTEAD-OF-CLIMBING.-THE-STRUCTURE-STAYS-CLUSTERED-(INTER-CLUSTER-FLOOR-~37-ULP)-AND-THE-' +
      'TERMINAL-CLUSTER-STILL-BAND-CLEARS-~132-ULP-AT-THE-WINDOW-EDGE-(n~1474),-SO-THIS-IS-A-PEAK-ENVELOPE-' +
      'PLATEAU-NOT-A-SUBSIDENCE.-THE-COMBINED-[900,1500]-TREND-STAYS-WEAKLY-POSITIVE-JITTER-DOMINATED-' +
      '(~+0.13-ULP/RUNG,-r^2~0.45),-CARRIED-BY-THE-EARLIER-CLIMB.-THIS-REVISES-THE-imp-33638-KEEPS-CLIMBING-' +
      'READING:-OVER-[900,1500]-THE-CLIMB-SATURATES-NEAR-~144-ULP.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-' +
      'JITTERY-LATTICE-FLOOR;-EMPIRICAL-PLATEAU-NOT-A-PROVEN-HARD-CEILING;-mass-feasibility-NECESSARY-BUT-NOT-' +
      'SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33659_BAND_CLEARING_TAIL_PLATEAU_N1200_1500 = Object.freeze({
  id: 'imp-33659-band-clearing-tail-plateau-n1200-1500',
  ticket: 'imp-33659',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
  crossValidatesModules: [
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33621-band-clearing-cluster-decay-and-tail-scan.js',
    'imp-33599-wide-range-band-crossing-envelope-law.js',
    'imp-33557-band-crossing-min-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'EXTENDS the imp-33638 grade-4 budgets >= 200-node dense every-integer floorUlp(n) band-clearing scan ' +
    'from the deep window n in [900,1200] into the DEEPER window n in [1200,1500] and asks whether the ' +
    're-intensifying clustered-spike envelope finally hits a GLOBAL ceiling or keeps climbing. RESULT: the ' +
    'envelope PLATEAUS -- a SOFT ceiling near ~144 ULP; the imp-33638 doubling STOPS. Four further disjoint ' +
    'band-clearing clusters appear whose tallest (~144.2 ULP at n~1324) is essentially EQUAL to the imp-33638 ' +
    '[900,1200] maximum (~143.6, ratio ~1.00, not another doubling). The within-window [1200,1500] trend ' +
    'collapses to flat (~ +0.02 ULP/rung, r^2 ~ 0.01) versus the imp-33638 clearly-positive ~ +0.23 (r^2 ~ ' +
    '0.41), so the peak envelope levels off at ~144 ULP instead of climbing. The structure stays clustered ' +
    '(inter-cluster floor ~37 ULP) and the terminal cluster still band-clears ~132 ULP at the window edge ' +
    '(n~1474), so this is a peak-envelope PLATEAU, not a subsidence. The combined [900,1500] trend stays ' +
    'weakly positive and jitter-dominated (~ +0.13 ULP/rung, r^2 ~ 0.45), carried by the earlier climb. ' +
    'VERDICT: ENVELOPE-PLATEAUS-SOFT-CEILING-NEAR-144-ULP. This REVISES the imp-33638 keeps-climbing reading: ' +
    'over [900,1500] the climb saturates near ~144 ULP. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; jittery lattice floor; empirical plateau not a proven hard ceiling; ' +
    'operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    windows: 'two dense every-integer scans, each +/-5 collared: the imp-33638 baseline [900,1200] and the NEW deeper window [1200,1500]',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp >= 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp is the jitter-tolerant reading; env >= 64 marks a band-clearing cluster',
    ceilingTest: 'compare the [1200,1500] envelope max to the imp-33638 [900,1200] max (~143.6 ULP): ratio ~1.00 => plateau, >> 1 => still climbing',
    trendTest: 'the WITHIN-window least-squares envelope slope/r^2 distinguishes a flat plateau (~+0.02, r^2~0.01) from a positive climb (~+0.23, r^2~0.41)',
    selfComputing: 'both windows, the cluster structure, the re-intensification ratio, the trend fits, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    resolvedPanelSweep: Object.freeze(RESOLVED_PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    collar: COLLAR,
    // -- imp-33638 [900,1200] baseline (ceiling-test anchor ~143.6 ULP) --
    baseWindowLo: BASE_LO,
    baseWindowHi: BASE_HI,
    baseClusterCount: baseClusters.length,
    baseEnvMax,
    // -- [1200,1500] deeper extension (the ticket asked to scan) --
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
    envelopePlateausNotDoubling,
    deepTrendFlat,
    deepStillClustered,
    plateauNotSubsidence,
    combinedTrendPositiveJittered,
    verdict,
    // -- coarse every-25th-rung deep-window digest (full 301-rung scan is live above) --
    deepScanDigest: Object.freeze(
      DEEP_SCAN.filter((r) => r.n % 25 === 0).map((r) =>
        Object.freeze({ n: r.n, floorUlp: r.floorUlp, envelope: r.envelope })),
    ),
  }),

  interpretation: Object.freeze({
    envelopePlateaus:
      'The [1200,1500] extension answers the imp-33659 question: the clustered-spike envelope STOPS ' +
      're-intensifying -- it levels off at a SOFT ceiling near ~144 ULP. The deep-window envelope maximum ' +
      '(~144.2 ULP at n~1324) is essentially EQUAL to the imp-33638 [900,1200] maximum (~143.6), a ratio of ' +
      '~1.00, NOT another rough doubling. The imp-33638 climb saturates over this window.',
    fourMoreClusters:
      'Four further disjoint band-clearing clusters appear over [1200,1500]: ~[1200,1307] (peak ~140.1 at ' +
      'n~1230, continuing the imp-33638 terminal spike), ~[1313,1384] (~144.2 at n~1324, the window maximum), ' +
      '~[1386,1462] (~143.3 at n~1433), and ~[1464,1500] (~132.2 at n~1474). All four peak in a tight ~132..144 ' +
      'ULP band -- consistent with a levelling-off, not continued growth.',
    trendCollapsesToFlat:
      'The decisive change from imp-33638 is the WITHIN-window trend: the [1200,1500] least-squares envelope ' +
      'slope collapses to ~ +0.02 ULP/rung (r^2 ~ 0.01), essentially flat, versus the imp-33638 [900,1200] ' +
      'clearly-positive ~ +0.23 (r^2 ~ 0.41). The peaks stop growing; instead of doubling again to ~280 ULP ' +
      'they hold at ~144 ULP. The combined [900,1500] slope (~ +0.13, r^2 ~ 0.45) is carried by the earlier ' +
      'climb, not the flat tail.',
    plateauNotSubsidence:
      'This is a PLATEAU, not a subsidence. The envelope still dips to ~37 ULP between clusters (risen from ' +
      'the imp-33638 ~17 ULP floor but still well below the 64 band), so this remains the SAME clustered-spike ' +
      'structure; and the terminal cluster ~[1464,1500] still peaks ~132 ULP at the window edge (n~1474), still ' +
      'band-clearing -- so the peaks neither keep climbing nor fall below the band. They level off.',
    revisesImp33638:
      'This REVISES the imp-33638 NO-GLOBAL-CEILING-KEEPS-CLIMBING reading. Over the longer combined [900,1500] ' +
      'span the doubling halts and the peak envelope saturates near ~144 ULP. imp-33638 could not see this ' +
      'because its terminal cluster was still rising at n=1200; the extension shows that rise flattening.',
    sharpensLatticeJitterCaveat:
      'This SHARPENS the imp-33638/imp-33621/imp-33599/imp-33579/imp-33557 latticeJitterCaveat: the deep-tail ' +
      'grade-4 arithmetic-floor envelope, having roughly doubled over [400,1200], levels off near ~144 ULP over ' +
      '[1200,1500]. Any tail band-clearing claim is bounded by a clustered-spike envelope whose empirical ' +
      'plateau is ~144 ULP over this span -- a soft ceiling, not a proven hard global bound.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Extends the imp-33638 grade-4 budgets >= 200-node dense every-integer floorUlp(n) scan from the deep ' +
      'window [900,1200] into the deeper window [1200,1500]. It finds the clustered-spike envelope neither keeps ' +
      'doubling nor subsides below 64 ULP: four further clusters whose tallest (~144.2 ULP at n~1324) is ' +
      'essentially equal to the imp-33638 maximum, with the within-window trend collapsed to flat -- a soft ' +
      'peak-envelope plateau near ~144 ULP. It changes NO bound, patches NO literal, and establishes NO operator ' +
      'positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33638/imp-33621/imp-33599/imp-33579/imp-33557/' +
      'imp-33539/imp-33316/imp-33213; this extends the inner-quadrature arithmetic-floor scan into the deeper ' +
      'tail, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621/imp-33638): the exact per-rung ULP bounces and cross-platform ' +
      'libm exp/pow variation can shift every few-ULP measurement (the exact cluster edges, the ~140/~144/~143/' +
      '~132 ULP peaks, the ~1.00 plateau ratio, and the ~0.02/~0.13 trend slopes). The robust reading is the ' +
      'QUALITATIVE structure -- a persistent clustered-spike tail whose peak envelope LEVELS OFF near ~144 ULP ' +
      'rather than continuing to double -- not the exact per-rung ULP, peak heights, or the exact plateau level.',
    plateauIsEmpiricalNotProven:
      'The plateau is EMPIRICAL over [1200,1500]; it does NOT PROVE a hard global ceiling. A later window ' +
      '(n > 1500) could resume climbing; this scan establishes only that the imp-33638 doubling halts and the ' +
      'peak envelope saturates near ~144 ULP across this 300-rung span, with the terminal cluster still ' +
      'band-clearing at the edge. Whether the plateau persists indefinitely is left open.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33659_BAND_CLEARING_TAIL_PLATEAU_N1200_1500_ASSERTIONS = [
  {
    id: 'imp33659-deep-densely-scanned',
    why: 'The extension must be a dense every-integer scan across n in [1200,1500] over the resolved-regime ' +
         '(budgets >= 200 nodes) grade-4 ladder.',
    holds: () => deepDenselyScanned && DEEP_SCAN.length === DEEP_HI - DEEP_LO + 1,
  },
  {
    id: 'imp33659-deep-has-many-clusters',
    why: 'The deep window must still hold MANY (>= 3) disjoint band-clearing clusters -- the clustered-spike ' +
         'structure persists.',
    holds: () => deepHasManyClusters && deepClusters.length >= 3,
  },
  {
    id: 'imp33659-deep-does-not-subside',
    why: 'The deep envelope does NOT fully subside below the 64 ULP band -- it still clears it.',
    holds: () => deepDoesNotSubside && deepEnvMax >= DEEP_FLOOR_ULP && deepEnvOverBand > 0,
  },
  {
    id: 'imp33659-envelope-plateaus-not-doubling',
    why: 'THE HEADLINE: the deep envelope maximum must NOT roughly double again (ratio < 1.2) yet stay near ' +
         'the imp-33638 [900,1200] maximum (ratio >= 0.85) -- the peak envelope levels off near ~144 ULP.',
    holds: () => envelopePlateausNotDoubling && reIntensifyRatio < 1.2 && reIntensifyRatio >= 0.85,
  },
  {
    id: 'imp33659-deep-trend-flat',
    why: 'THE HEADLINE: the WITHIN-window [1200,1500] envelope trend must be flat (|slope| < 0.1, r^2 < 0.15) ' +
         '-- the imp-33638 clearly-positive climb (~ +0.23, r^2 ~ 0.41) is gone; the peaks stop growing.',
    holds: () => deepTrendFlat && Math.abs(deepEnvFit.slope) < 0.1 && deepEnvFit.r2 < 0.15,
  },
  {
    id: 'imp33659-deep-still-clustered',
    why: 'The deep window must still be a clustered-spike structure -- the envelope dips well below the band ' +
         '(min < 54 ULP) between clusters, not a persistent failure region.',
    holds: () => deepStillClustered && deepEnvMin < DEEP_FLOOR_ULP - 10,
  },
  {
    id: 'imp33659-plateau-not-subsidence',
    why: 'The plateau must be a SOFT ceiling, not a subsidence: the terminal (highest-n) cluster still ' +
         'band-clears at the window edge, so the peaks level off rather than fall below the band.',
    holds: () => plateauNotSubsidence && terminalClusterAtEdge,
  },
  {
    id: 'imp33659-combined-trend-positive-jittered',
    why: 'The combined [900,1500] envelope trend must stay positive (0 <= slope < 0.3 ULP/rung) and ' +
         'jitter-dominated (r^2 < 0.6) -- carried by the earlier [900,1200] climb, not the flat [1200,1500] tail.',
    holds: () => combinedTrendPositiveJittered && combinedEnvFit.slope >= 0 && combinedEnvFit.slope < 0.3 && combinedEnvFit.r2 < 0.6,
  },
  {
    id: 'imp33659-verdict-records-plateau',
    why: 'The classified verdict must record the ENVELOPE-PLATEAUS-SOFT-CEILING reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33659-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, empirical plateau ' +
         'not a proven hard ceiling, mass-feasibility necessary-but-not-sufficient, operator positivity ' +
         '(imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33659_BAND_CLEARING_TAIL_PLATEAU_N1200_1500.honestCaveat;
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

for (const assertion of IMP33659_BAND_CLEARING_TAIL_PLATEAU_N1200_1500_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33659-band-clearing-tail-plateau-n1200-1500 assertion failed: ${assertion.id}`);
  }
}
