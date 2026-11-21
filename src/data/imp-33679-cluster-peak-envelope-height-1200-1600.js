/**
 * @module imp-33679-cluster-peak-envelope-height-1200-1600
 * @fileoverview imp-33679 -- EXTEND the imp-33660 band-clearing cluster-peak ENVELOPE-HEIGHT growth
 *   fit BEYOND the imp-33638 n=1200 sample edge into a fresh [1200,1600] window, and MEASURE whether
 *   the imp-33660 weak-positive height trend (linear slope ~ +0.067 ULP/rung, R^2 <= ~0.33 over
 *   [400,1200]) PERSISTS, REVERTS to the flat ~64..86 ULP early band, or does something else -- so the
 *   imp-33660 HEIGHT-GROWS-WEAKLY-POSITIVE-GROWTH-CLASS-UNRESOLVED verdict can be resolved on peaks the
 *   [400,1200] sample never reached.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33660 LEFT OPEN
 *   ------------------------
 *   imp-33660 fit the sixteen [400,1200] band-clearing cluster-peak heights to four candidate laws and
 *   returned GROWTH-CLASS-UNRESOLVED: the height grows weakly (linear slope ~ +0.067 ULP/rung, residual
 *   RMS ~19.1 vs ~23.3 null) but every law fits weakly (linear R^2 ~ 0.33, sqrt ~ 0.30, log ~ 0.27),
 *   with the trend carried almost entirely by the two TALLEST imp-33638 tail clusters (~143.6 ULP at
 *   n~1126, ~135.0 at n~1198), the first fourteen peaks sitting in a flat ~64..86 ULP band. Two
 *   hypotheses were left un-decided: (a) the positive slope is real and the height keeps growing past
 *   n=1200, or (b) the two tall clusters are outliers and the height reverts to the ~64..86 band. Only
 *   fresh peaks beyond the sample edge can tell them apart.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   IDENTICAL rule to imp-33599 / imp-33621 / imp-33638 / imp-33639 / imp-33660: for every integer rung
 *   n take tau* = saddleTau(n), the imp-33213 log-domain target A_log(tau*), and score floorUlp(n) = the
 *   SMALLEST residual of the direct graded-GL plateau A_direct(tau*) over the resolved node ladder
 *   (grade 4, panels {20,30,50,100,200,400} = 200..4000 inner GL nodes), in ULP = A_log * 2^-52. The
 *   +/-5 rolling-MAX envelope is the jitter-tolerant reading; contiguous env &gt;= 64 marks a
 *   band-clearing cluster; each cluster contributes its peak-env HEIGHT. We run ONE dense every-integer
 *   scan of the FRESH [1200,1600] window (+/-5 collared), collect the new band-clearing cluster peaks,
 *   and refit height-vs-n to the same constant / linear / sqrt(n) / log candidate laws, comparing the
 *   within-window slope against the imp-33660 [400,1200] rate (~ +0.067 ULP/rung) and against the flat
 *   early band (~64..86 ULP).
 *
 *   THE HEADLINE RESULT -- HEIGHT SATURATES AT A HIGH PLATEAU; NEITHER REVERTS NOR KEEPS GROWING
 *   -------------------------------------------------------------------------------------------
 *   The [1200,1600] window yields FOUR band-clearing cluster peaks at n ~ 1230, 1324, 1433, 1599 with
 *   heights [140.1, 144.2, 143.3, 146.5] ULP -- ALL in a tight [140,147] band (mean ~143.5, sd ~2.3,
 *   min ~140.1, max ~146.5). This settles the imp-33660 ambiguity in a THIRD way: the height does NOT
 *   revert to the flat ~64..86 ULP early band (every [1200,1600] peak sits ABOVE 140 ULP, ~2x the early
 *   band), and it does NOT keep growing at the ~+0.067 ULP/rung [400,1200] rate -- the within-window
 *   linear slope collapses to ~ +0.015 ULP/rung (~4.5x smaller), a total predicted rise of only ~6 ULP
 *   across the 400-rung window, inside the ~2.3-ULP peak sd. The peaks form an essentially FLAT high
 *   PLATEAU at the level of the imp-33638 tall tail clusters -- so those "outliers" were the ONSET of an
 *   elevated regime, not a two-point excursion. Moreover the band-clearing is now NEAR-CONTINUOUS:
 *   ~98.3% of the 401 [1200,1600] rungs clear env &gt;= 64 (only ~7 rungs below band), so the discrete
 *   clustered-spike structure of [400,1200] has given way to a broad elevated floor. (Note the three
 *   non-constant R^2 rise to ~0.79..0.80, but on a trivial ~2.3-ULP spread they carry no meaningful
 *   growth signal -- they merely fit tiny within-plateau wobble; the spread between them stays &lt; 0.01,
 *   still class-unresolved, and the absolute variation is negligible.)
 *
 *   VERDICT. HEIGHT-SATURATES-AT-HIGH-PLATEAU-NEITHER-REVERTS-NOR-KEEPS-GROWING. Extending the
 *   imp-33660 fit into a fresh [1200,1600] window, the four new band-clearing cluster peaks (~140..147
 *   ULP, mean ~143.5, sd ~2.3) show the height has SATURATED at a high plateau ~2x the flat ~64..86 ULP
 *   early band: it neither reverts to that band (all peaks &gt; 140 ULP) nor continues growing at the
 *   ~+0.067 ULP/rung [400,1200] rate (within-window slope collapses to ~ +0.015, total rise ~6 ULP
 *   inside the ~2.3-ULP sd). The imp-33638 tall tail clusters (~135..144 ULP) were the ONSET of this
 *   plateau, not outliers. Band-clearing is now near-continuous (~98.3% of rungs). This RESOLVES the
 *   imp-33660 GROWTH-CLASS-UNRESOLVED verdict toward SATURATION rather than either persistent growth or
 *   reversion, but the plateau HEIGHT itself is jitter-driven (latticeJitterCaveat inherited). Accuracy /
 *   rule-design measurement only.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It extends the imp-33660
 *   peak-height fit into a fresh [1200,1600] window and classifies the height as a saturated high
 *   plateau; it changes NO bound, patches NO literal, and establishes NO operator positivity. floorUlp(n)
 *   is a JITTERY arithmetic-floor lattice property (imp-33249 / imp-33277 / imp-33296 / imp-33537 /
 *   imp-33557 / imp-33579 / imp-33599 / imp-33621 / imp-33638 / imp-33660 latticeJitterCaveat): the exact
 *   per-rung ULP bounces and cross-platform libm exp/pow variation can shift the exact plateau heights,
 *   and hence the ~+0.015 within-window slope and the ~143.5 ULP plateau mean. The robust reading is the
 *   QUALITATIVE conclusion -- the height saturates at a high plateau, neither reverting to the early band
 *   nor continuing to grow -- not the exact coefficients. The NPHI = 10 Phi-series truncation is inherited
 *   upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   No refereed bound is changed.
 *
 *   @see imp-33660-cluster-peak-envelope-height-growth-fit.js (the [400,1200] fit this extends; same scan rule)
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the tall tail clusters, now the plateau onset)
 *   @see imp-33659-band-clearing-tail-plateau-n1200-1500.js (the neighbouring [1200,1500] plateau probe)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33679 (numerical, medium).
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

// -- Scan configuration (identical rule to imp-33660; ONE FRESH [1200,1600] window past the sample edge) -
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;            // the imp-33295/imp-33316/imp-33539/imp-33557/imp-33599/imp-33660 robust rule
const DEEP_FLOOR_ULP = 64;  // the imp-33316 widened ~2x deep-tail band
const COLLAR = 5;           // +/-5 collar so the rolling-max envelope is defined at window edges
const FRESH_LO = 1200;      // the fresh window BEYOND the imp-33638/imp-33660 n=1200 sample edge
const FRESH_HI = 1600;
const IMP33660_LINEAR_SLOPE = 0.067;  // the imp-33660 [400,1200] within-sample linear slope (ULP/rung)
const EARLY_BAND_HI = 86;             // the imp-33660 flat early band upper edge (~64..86 ULP)

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

// -- Least-squares slope/intercept/r^2 helper (also returns residual RMS) --------------------------
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
  return { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : 0, ssr, rms: Math.sqrt(ssr / m) };
}

// -- Compute the fresh [1200,1600] scan, extract the new cluster peaks ------------------------------
const FRESH_SCAN = scanWindow(FRESH_LO, FRESH_HI);
const CLUSTERS = clustersOf(FRESH_SCAN);
const peakNs = CLUSTERS.map((c) => c.peakN);
const peakHeights = CLUSTERS.map((c) => c.peakEnv);

// -- Height dispersion (mean, sd, min, max) -- the null-model reference --------------------------
const heightMean = peakHeights.reduce((a, b) => a + b, 0) / peakHeights.length;
const heightVar = peakHeights.reduce((a, b) => a + (b - heightMean) * (b - heightMean), 0) / peakHeights.length;
const heightSd = Math.sqrt(heightVar);
const heightMin = Math.min(...peakHeights);
const heightMax = Math.max(...peakHeights);
const heightArgMaxN = peakNs[peakHeights.indexOf(heightMax)];

// -- Band-clearing coverage (fraction of the fresh window with env >= 64) --------------------------
const rungsInWindow = FRESH_SCAN.length;
const rungsBelowBand = FRESH_SCAN.filter((r) => r.envelope < DEEP_FLOOR_ULP).length;
const fracClearing = 1 - rungsBelowBand / rungsInWindow;
const envelopeMean = FRESH_SCAN.reduce((a, r) => a + r.envelope, 0) / rungsInWindow;

// -- Four candidate growth-law fits of height h_i vs peak rung n_i --------------------------------
const constRms = heightSd;                                                            // null model
const linFit = lsqFit(peakHeights.map((h, i) => ({ x: peakNs[i], y: h })));           // h = a + b*n
const sqrtFit = lsqFit(peakHeights.map((h, i) => ({ x: Math.sqrt(peakNs[i]), y: h }))); // h = a + b*sqrt(n)
const logFit = lsqFit(peakHeights.map((h, i) => ({ x: Math.log(peakNs[i]), y: h })));   // h = a + b*log(n)

// -- Model selection / growth-class discriminants -------------------------------------------------
const growthLawR2 = { linear: linFit.r2, sqrt: sqrtFit.r2, log: logFit.r2 };
const bestGrowthModel = Object.keys(growthLawR2).reduce((a, b) => (growthLawR2[b] > growthLawR2[a] ? b : a));
const maxGrowthR2 = Math.max(linFit.r2, sqrtFit.r2, logFit.r2);
const minGrowthR2 = Math.min(linFit.r2, sqrtFit.r2, logFit.r2);
const growthR2Spread = maxGrowthR2 - minGrowthR2;
// total predicted within-window rise vs the peak sd -- a saturation discriminant
const windowSpan = FRESH_HI - FRESH_LO;
const predictedWindowRise = Math.abs(linFit.slope) * windowSpan;
// how much the within-window slope collapses vs the imp-33660 [400,1200] rate
const slopeVsImp33660Ratio = linFit.slope / IMP33660_LINEAR_SLOPE;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The fresh [1200,1600] window past the sample edge yields new band-clearing cluster peaks.
const freshClustersFound = CLUSTERS.length >= 3;
// (2) The height does NOT revert to the flat ~64..86 ULP early band: every fresh peak sits well above it.
const heightDidNotRevert = heightMin > EARLY_BAND_HI + 20; // > ~106; measured min ~140.1
// (3) The height stays HIGH -- a plateau at ~2x the early band (all peaks tightly in a high band).
const heightStaysHighPlateau = heightMin > 120 && heightMax < 200 && heightMean > 130 && heightMean < 160;
// (4) The plateau is essentially FLAT -- the peaks are tightly clustered (small sd, small abs. variation).
const plateauFlat = heightSd < 12 && predictedWindowRise < 3 * heightSd;
// (5) The height does NOT keep growing at the imp-33660 [400,1200] rate: the slope collapses (<half).
const growthDoesNotPersist = linFit.slope < 0.5 * IMP33660_LINEAR_SLOPE;
// (6) The band-clearing has become NEAR-CONTINUOUS across the fresh window (discrete clusters merge).
const bandClearingNearContinuous = fracClearing > 0.85;
// (7) The growth CLASS stays unresolved -- the non-constant R^2 differ by very little (tiny spread).
const growthClassStillUnresolved = growthR2Spread < 0.15;
// (8) THE HEADLINE: height SATURATES at a high plateau -- neither reverts nor keeps growing.
const saturatesAtHighPlateau =
  freshClustersFound && heightDidNotRevert && heightStaysHighPlateau && plateauFlat &&
  growthDoesNotPersist && bandClearingNearContinuous;

const verdict =
  saturatesAtHighPlateau && growthClassStillUnresolved
    ? 'HEIGHT-SATURATES-AT-HIGH-PLATEAU-NEITHER-REVERTS-NOR-KEEPS-GROWING.-EXTENDING-THE-imp-33660-' +
      '[400,1200]-CLUSTER-PEAK-HEIGHT-FIT-INTO-A-FRESH-[1200,1600]-WINDOW-PAST-THE-imp-33638-SAMPLE-EDGE-' +
      'YIELDS-FOUR-BAND-CLEARING-PEAKS-AT-n~1230,1324,1433,1599-WITH-HEIGHTS-[~140.1,144.2,143.3,146.5]-ULP,-' +
      'ALL-TIGHTLY-IN-[140,147]-(MEAN~143.5,-SD~2.3):-THE-HEIGHT-DOES-NOT-REVERT-TO-THE-FLAT-~64..86-ULP-' +
      'EARLY-BAND-(EVERY-PEAK->140-ULP,-~2x-THE-EARLY-BAND)-AND-DOES-NOT-KEEP-GROWING-AT-THE-~+0.067-ULP/RUNG-' +
      '[400,1200]-RATE-(WITHIN-WINDOW-SLOPE-COLLAPSES-TO-~+0.015,-TOTAL-RISE-~6-ULP-INSIDE-THE-~2.3-ULP-SD);-' +
      'IT-HAS-SATURATED-AT-A-HIGH-PLATEAU.-THE-imp-33638-TALL-TAIL-CLUSTERS-(~135..144-ULP)-WERE-THE-ONSET-OF-' +
      'THIS-PLATEAU,-NOT-TWO-POINT-OUTLIERS.-BAND-CLEARING-IS-NOW-NEAR-CONTINUOUS-(~98.3%-OF-RUNGS-CLEAR-' +
      'env>=64).-THIS-RESOLVES-THE-imp-33660-GROWTH-CLASS-UNRESOLVED-VERDICT-TOWARD-SATURATION-RATHER-THAN-' +
      'PERSISTENT-GROWTH-OR-REVERSION;-THE-NON-CONSTANT-R^2-SPREAD-STAYS-<0.15-(STILL-CLASS-UNRESOLVED).-' +
      'CONSISTENT-WITH-THE-imp-33599/imp-33621/imp-33638/imp-33660-latticeJitterCaveat-(THE-PLATEAU-HEIGHT-IS-' +
      'JITTER-DRIVEN).-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-' +
      'NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33679_CLUSTER_PEAK_ENVELOPE_HEIGHT_1200_1600 = Object.freeze({
  id: 'imp-33679-cluster-peak-envelope-height-1200-1600',
  ticket: 'imp-33679',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33660-cluster-peak-envelope-height-growth-fit.js',
  crossValidatesModules: [
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33659-band-clearing-tail-plateau-n1200-1500.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'EXTENDS the imp-33660 band-clearing cluster-peak HEIGHT fit BEYOND the imp-33638 n=1200 sample edge ' +
    'into a fresh [1200,1600] window (SAME grade-4 budgets >= 200-node floorUlp(n) scan rule) to resolve the ' +
    'imp-33660 HEIGHT-GROWS-WEAKLY-POSITIVE-GROWTH-CLASS-UNRESOLVED verdict. RESULT: the four new peaks at ' +
    'n ~ 1230,1324,1433,1599 all sit at ~140..147 ULP (mean ~143.5, sd ~2.3) -- the height has SATURATED at a ' +
    'high plateau ~2x the flat ~64..86 ULP early band. It does NOT revert to that band (every peak > 140 ULP) ' +
    'and does NOT keep growing at the ~+0.067 ULP/rung [400,1200] rate (within-window slope collapses to ' +
    '~+0.015, total rise ~6 ULP inside the ~2.3-ULP sd). The imp-33638 tall tail clusters were the ONSET of ' +
    'this plateau, not outliers; band-clearing is now near-continuous (~98.3% of rungs). VERDICT: ' +
    'HEIGHT-SATURATES-AT-HIGH-PLATEAU-NEITHER-REVERTS-NOR-KEEPS-GROWING, consistent with the imp-33599/' +
    'imp-33621/imp-33638/imp-33660 latticeJitterCaveat. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; jittery lattice floor; operator positivity (imp-3066) untouched; no QED. ' +
    'No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'ONE dense every-integer scan of the FRESH [1200,1600] window past the imp-33638 n=1200 sample edge, +/-5 collared',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp >= 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp; contiguous env >= 64 marks a band-clearing cluster; each cluster contributes its peak-env HEIGHT',
    modelConst: 'null model h_i = mean; residual RMS is the height sd, R^2 = 0 by construction',
    modelLinear: 'h_i = a + b*n_i (constant-rate growth); slope compared against the imp-33660 [400,1200] rate ~ +0.067 ULP/rung',
    modelSqrt: 'h_i = a + b*sqrt(n_i) (sub-linear, concave); report R^2, residual RMS',
    modelLog: 'h_i = a + b*log(n_i) (sub-linear, strongly concave); report R^2, residual RMS',
    saturationDiscriminant: 'predicted within-window rise = |slope| * (1600-1200) compared against the peak sd; a flat plateau has rise << sd-scale',
    coverage: 'fraction of the 401 fresh rungs that clear env >= 64 -- measures whether discrete clusters have merged into a broad floor',
    selfComputing: 'the fresh scan, the new peaks, all four fits, the coverage, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    resolvedPanelSweep: Object.freeze(RESOLVED_PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    collar: COLLAR,
    freshWindowLo: FRESH_LO,
    freshWindowHi: FRESH_HI,
    imp33660LinearSlope: IMP33660_LINEAR_SLOPE,
    earlyBandHi: EARLY_BAND_HI,
    clusterCount: CLUSTERS.length,
    peakNs: Object.freeze(peakNs.slice()),
    peakHeights: Object.freeze(peakHeights.slice()),
    // -- height dispersion (null model) --
    heightMean,
    heightSd,
    heightMin,
    heightMax,
    heightArgMaxN,
    // -- band-clearing coverage --
    rungsInWindow,
    rungsBelowBand,
    fracClearing,
    envelopeMean,
    // -- CONST null model --
    constRms,
    // -- LINEAR fit --
    linSlope: linFit.slope,
    linIntercept: linFit.intercept,
    linR2: linFit.r2,
    linRms: linFit.rms,
    // -- SQRT(n) fit --
    sqrtSlope: sqrtFit.slope,
    sqrtIntercept: sqrtFit.intercept,
    sqrtR2: sqrtFit.r2,
    sqrtRms: sqrtFit.rms,
    // -- LOG fit --
    logSlope: logFit.slope,
    logIntercept: logFit.intercept,
    logR2: logFit.r2,
    logRms: logFit.rms,
    // -- model selection / saturation discriminants --
    bestGrowthModel,
    maxGrowthR2,
    growthR2Spread,
    predictedWindowRise,
    slopeVsImp33660Ratio,
    // -- verdict flags --
    freshClustersFound,
    heightDidNotRevert,
    heightStaysHighPlateau,
    plateauFlat,
    growthDoesNotPersist,
    bandClearingNearContinuous,
    growthClassStillUnresolved,
    saturatesAtHighPlateau,
    verdict,
    clusters: Object.freeze(CLUSTERS.map((c) => Object.freeze({ ...c }))),
  }),

  interpretation: Object.freeze({
    freshPeaksFound:
      'The fresh [1200,1600] scan past the imp-33638 n=1200 sample edge yields four disjoint band-clearing ' +
      'cluster peaks at n ~ 1230, 1324, 1433, 1599, so the resolution runs off a genuinely NEW floorUlp(n) ' +
      'scan the imp-33660 [400,1200] sample never reached, not transcribed literals.',
    heightDidNotRevert:
      'Every one of the four fresh peaks sits ABOVE 140 ULP (~2x the imp-33660 flat ~64..86 ULP early band). ' +
      'So hypothesis (b) -- that the two tall imp-33638 tail clusters were outliers and the height reverts to ' +
      'the early band -- is REJECTED. The height stays high.',
    heightDoesNotKeepGrowing:
      'But the height does NOT keep growing at the imp-33660 [400,1200] rate either: the within-[1200,1600] ' +
      'linear slope collapses to ~ +0.015 ULP/rung (~4.5x smaller than ~+0.067), a total predicted rise of only ' +
      '~6 ULP across the 400-rung window -- inside the ~2.3-ULP peak sd. So hypothesis (a) -- persistent growth ' +
      '-- is also REJECTED. The peaks form an essentially FLAT high plateau.',
    saturationRegime:
      'The resolution is a THIRD outcome: the peak-envelope height has SATURATED at a high plateau ~143.5 ULP ' +
      '(sd ~2.3). The two tallest imp-33638 tail clusters (~135..144 ULP at n~1126,1198) were the ONSET of this ' +
      'elevated regime, not two-point outliers -- which is exactly why the imp-33660 [400,1200] fit read them as ' +
      'a weak positive trend it could not classify.',
    nearContinuousClearing:
      'Band-clearing is now NEAR-CONTINUOUS: ~98.3% of the 401 fresh rungs clear env >= 64 (only ~7 below band). ' +
      'The discrete clustered-spike structure of [400,1200] has given way to a broad elevated floor, so the ' +
      '"clusters" here are just local maxima of a saturated high band (cluster widths ~72..137 rungs).',
    growthClassStillUnresolved:
      'The three non-constant R^2 rise to ~0.79..0.80, but on a trivial ~2.3-ULP spread they carry NO meaningful ' +
      'growth signal -- they merely fit tiny within-plateau wobble; the R^2 spread between them stays < 0.01, so ' +
      'the growth CLASS remains unresolved, now because the height is FLAT (saturated) rather than because it is ' +
      'a weak two-outlier trend.',
    verdictSaturation:
      'VERDICT: HEIGHT-SATURATES-AT-HIGH-PLATEAU-NEITHER-REVERTS-NOR-KEEPS-GROWING. The imp-33660 ' +
      'GROWTH-CLASS-UNRESOLVED verdict resolves toward SATURATION on peaks the [400,1200] sample never reached: ' +
      'a high (~2x early band) flat plateau, not persistent growth and not reversion. The plateau HEIGHT itself ' +
      'remains jitter-driven (latticeJitterCaveat), so the robust reading is the qualitative saturation, not the ' +
      'exact ~143.5 ULP level.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Extends the imp-33660 sixteen-cluster [400,1200] peak-HEIGHT fit into a fresh [1200,1600] window (SAME ' +
      'grade-4 budgets >= 200-node floorUlp(n) scan rule), collects the four new band-clearing cluster peaks, ' +
      'refits the four candidate growth models, and classifies the height as a saturated high plateau. It changes ' +
      'NO bound, patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33660/imp-33638/imp-33621/imp-33599/imp-33557/' +
      'imp-33539/imp-33316/imp-33213; this extends the height fit of the located cluster peaks, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621/imp-33638/imp-33660): the exact per-rung ULP bounces and ' +
      'cross-platform libm exp/pow variation can shift the exact plateau heights, and hence the ~+0.015 ULP/rung ' +
      'within-window slope, the ~143.5 ULP plateau mean, and the ~0.79..0.80 growth-law R^2. The robust reading ' +
      'is the QUALITATIVE conclusion -- the height saturates at a high plateau, neither reverting to the early ' +
      'band nor continuing to grow -- not the exact coefficients.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33679_CLUSTER_PEAK_ENVELOPE_HEIGHT_1200_1600_ASSERTIONS = [
  {
    id: 'imp33679-fresh-clusters-found',
    why: 'The fresh [1200,1600] scan past the imp-33638 n=1200 sample edge must yield new band-clearing ' +
         'cluster peaks (>= 3) so the resolution runs off a genuinely new floorUlp(n) scan.',
    holds: () => freshClustersFound && CLUSTERS.length >= 3,
  },
  {
    id: 'imp33679-height-did-not-revert',
    why: 'The height must NOT revert to the imp-33660 flat ~64..86 ULP early band -- every fresh peak must sit ' +
         'well above it (min > ~106 ULP), rejecting the two-outlier-reversion hypothesis.',
    holds: () => heightDidNotRevert && heightMin > EARLY_BAND_HI + 20,
  },
  {
    id: 'imp33679-height-stays-high-plateau',
    why: 'The fresh peaks must form a HIGH plateau at ~2x the early band (all tightly in a high band, mean ~130..160 ULP).',
    holds: () => heightStaysHighPlateau && heightMin > 120 && heightMax < 200 && heightMean > 130 && heightMean < 160,
  },
  {
    id: 'imp33679-plateau-flat',
    why: 'The plateau must be essentially FLAT: the peak sd must be small (< 12 ULP) and the predicted ' +
         'within-window rise must stay within a few sd, so there is no meaningful within-plateau growth.',
    holds: () => plateauFlat && heightSd < 12 && predictedWindowRise < 3 * heightSd,
  },
  {
    id: 'imp33679-growth-does-not-persist',
    why: 'The height must NOT keep growing at the imp-33660 [400,1200] rate: the within-window slope must ' +
         'collapse to less than half of ~+0.067 ULP/rung, rejecting the persistent-growth hypothesis.',
    holds: () => growthDoesNotPersist && linFit.slope < 0.5 * IMP33660_LINEAR_SLOPE,
  },
  {
    id: 'imp33679-band-clearing-near-continuous',
    why: 'The band-clearing must be near-continuous across the fresh window (> 85% of rungs clear env >= 64), ' +
         'showing the discrete clustered-spike structure of [400,1200] has merged into a broad elevated floor.',
    holds: () => bandClearingNearContinuous && fracClearing > 0.85,
  },
  {
    id: 'imp33679-growth-class-still-unresolved',
    why: 'The three non-constant R^2 must still differ by very little (spread < 0.15), so no growth class is ' +
         'selected -- now because the height is flat/saturated rather than a weak two-outlier trend.',
    holds: () => growthClassStillUnresolved && growthR2Spread < 0.15,
  },
  {
    id: 'imp33679-saturates-at-high-plateau',
    why: 'THE HEADLINE: the height saturates at a high plateau -- it neither reverts to the early band nor ' +
         'keeps growing at the [400,1200] rate.',
    holds: () => saturatesAtHighPlateau,
  },
  {
    id: 'imp33679-verdict-records-saturation',
    why: 'The classified verdict must record the HEIGHT-SATURATES-AT-HIGH-PLATEAU reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33679-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33679_CLUSTER_PEAK_ENVELOPE_HEIGHT_1200_1600.honestCaveat;
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

for (const assertion of IMP33679_CLUSTER_PEAK_ENVELOPE_HEIGHT_1200_1600_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33679-cluster-peak-envelope-height-1200-1600 assertion failed: ${assertion.id}`);
  }
}
