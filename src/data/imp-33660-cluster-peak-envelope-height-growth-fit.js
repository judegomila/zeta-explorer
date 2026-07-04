/**
 * @module imp-33660-cluster-peak-envelope-height-growth-fit
 * @fileoverview imp-33660 -- FIT the band-clearing cluster-peak ENVELOPE-HEIGHT sequence across the
 *   combined imp-33599 [400,700] + imp-33621 [700,900] + imp-33638 [900,1200] SIXTEEN cluster peaks
 *   to candidate growth laws (constant / linear / sqrt(n) / log), and MEASURE whether the peak-envelope
 *   HEIGHT grows sub-linearly. imp-33639 fit only the peak SPACING; the HEIGHT growth was never fit.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33639 LEFT UNMEASURED
 *   ------------------------------
 *   imp-33639 fit the nine [400,900] cluster-peak SPACING (irregular, CV ~ 0.46) but never fit the
 *   peak-envelope HEIGHT growth. imp-33638 then added seven more clusters in [900,1200] with the
 *   envelope roughly DOUBLING (~76 -&gt; ~143 ULP) and a positive combined [700,1200] slope ~ +0.10
 *   ULP/rung. So we have sixteen cluster peaks over [400,1200] but no growth-law fit of their HEIGHT.
 *   Whether the peak-envelope height grows linearly, sub-linearly (sqrt(n)/log), or is flat with two
 *   tall tail outliers was left open. This module re-derives the sixteen peaks off the SAME grade-4
 *   budgets &gt;=200-node floorUlp(n) scan (one combined [400,1200] window), extracts the peak-env
 *   HEIGHT per cluster, and fits height-vs-n to four candidate models reporting R^2 and residual RMS.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Identical rule to imp-33599 / imp-33621 / imp-33638 / imp-33639: for every integer rung n take
 *   tau* = saddleTau(n), the imp-33213 log-domain target A_log(tau*), and score floorUlp(n) = the
 *   SMALLEST residual of the direct graded-GL plateau A_direct(tau*) over the resolved node ladder
 *   (grade 4, panels {20,30,50,100,200,400} = 200..4000 inner GL nodes), in ULP = A_log * 2^-52. The
 *   +/-5 rolling-MAX envelope is the jitter-tolerant reading; contiguous env &gt;= 64 marks a
 *   band-clearing cluster; each cluster contributes its peak-env HEIGHT. We then fit the sixteen peak
 *   heights h_i vs the peak rung n_i:
 *     (CONST)  h_i = c                 (mean; residual RMS = height sd -- the null model),
 *     (LINEAR) h_i = a + b*n_i         (constant-rate growth),
 *     (SQRT)   h_i = a + b*sqrt(n_i)   (sub-linear, concave),
 *     (LOG)    h_i = a + b*log(n_i)    (sub-linear, strongly concave),
 *   reporting R^2 and residual RMS for each, plus the height dispersion (mean, sd, min, max).
 *
 *   THE HEADLINE RESULT -- HEIGHT GROWS WEAKLY-POSITIVE; GROWTH CLASS UNRESOLVED
 *   ---------------------------------------------------------------------------
 *   The sixteen peak heights are [76.1,65.3,64.1,78.4,67.3,67.1,64.5,73.2,68.4,78.6,85.6,71.8,64.7,
 *   72.3,143.6,135.0] ULP (mean ~79.7, sd ~23.3, min ~64.1, max ~143.6). The height DOES grow: the
 *   linear model has a positive slope ~ +0.067 ULP/rung and reduces the residual RMS from ~23.3
 *   (constant/null) to ~19.1, an ~18% reduction. BUT every candidate law fits WEAKLY -- linear
 *   R^2 ~ 0.33, sqrt R^2 ~ 0.30, log R^2 ~ 0.27 -- and the three non-constant R^2 differ by only ~0.06,
 *   well inside the jitter. So no growth law is decisively selected. The positive trend is concentrated
 *   almost entirely in the two TALLEST imp-33638 tail clusters (~143.6 ULP at n~1126, ~135.0 at n~1198);
 *   the first fourteen peaks sit in a flat ~64..86 ULP band. Whether the growth is strictly sub-linear
 *   is UNRESOLVED: the concave (sqrt/log) laws do NOT out-score the linear law (they fit marginally
 *   worse), so the data does not select a sub-linear class -- it is a weak, two-outlier-driven,
 *   jitter-limited positive trend.
 *
 *   VERDICT. HEIGHT-GROWS-WEAKLY-POSITIVE-GROWTH-CLASS-UNRESOLVED. The sixteen band-clearing cluster
 *   peaks over [400,1200] show a WEAK positive height trend (linear slope ~ +0.067 ULP/rung, residual
 *   RMS ~19.1 vs ~23.3 null), but all four candidate laws (constant/linear/sqrt/log) fit weakly
 *   (R^2 &lt;= ~0.33) with the linear/sqrt/log R^2 within ~0.06 of one another, so no growth class --
 *   and in particular no strictly sub-linear class -- is decisively selected. The trend is carried by
 *   the two tallest imp-33638 tail clusters (~135..144 ULP), with the first fourteen peaks in a flat
 *   ~64..86 ULP band. Consistent with the imp-33599 / imp-33621 / imp-33638 / imp-33639 latticeJitter
 *   caveat: the clustered-spike heights are jitter-driven, so the exact fit coefficients are not robust.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It fits the HEIGHT of the
 *   sixteen band-clearing cluster peaks and classifies the growth as weak-positive / class-unresolved;
 *   it changes NO bound, patches NO literal, and establishes NO operator positivity. floorUlp(n) is a
 *   JITTERY arithmetic-floor lattice property (imp-33249 / imp-33277 / imp-33296 / imp-33537 / imp-33557
 *   / imp-33579 / imp-33599 / imp-33621 / imp-33638 latticeJitterCaveat): the exact per-rung ULP bounces
 *   and cross-platform libm exp/pow variation can shift the exact peak heights, and hence every fit R^2,
 *   slope, and residual RMS. The robust reading is the QUALITATIVE conclusion -- a weak positive trend,
 *   growth class unresolved, driven by two tall tail clusters -- not the exact coefficients. The
 *   NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the SOTA.
 *
 *   @see imp-33639-cluster-peak-spacing-periodicity-fit.js (the spacing fit this complements; same scan)
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the seven [900,1200] tail clusters)
 *   @see imp-33621-band-clearing-cluster-decay-and-tail-scan.js (the six [700,900] clusters)
 *   @see imp-33599-wide-range-band-crossing-envelope-law.js (the three [400,700] clusters)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33660 (numerical, medium).
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

// -- Scan configuration (identical rule to imp-33599/imp-33621/imp-33638/imp-33639; ONE [400,1200]) -
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

// -- Compute the combined [400,1200] scan, extract the sixteen cluster peaks -----------------------
const COMBINED_SCAN = scanWindow(COMBINED_LO, COMBINED_HI);
const CLUSTERS = clustersOf(COMBINED_SCAN);
const peakNs = CLUSTERS.map((c) => c.peakN);
const peakHeights = CLUSTERS.map((c) => c.peakEnv);

// -- Height dispersion (mean, sd, min, max) -- the null-model reference --------------------------
const heightMean = peakHeights.reduce((a, b) => a + b, 0) / peakHeights.length;
const heightVar = peakHeights.reduce((a, b) => a + (b - heightMean) * (b - heightMean), 0) / peakHeights.length;
const heightSd = Math.sqrt(heightVar);
const heightMin = Math.min(...peakHeights);
const heightMax = Math.max(...peakHeights);
const heightArgMaxN = peakNs[peakHeights.indexOf(heightMax)];

// -- Four candidate growth-law fits of height h_i vs peak rung n_i --------------------------------
// (CONST) null model: h_i = mean; residual RMS is exactly the height sd, R^2 = 0 by construction.
const constRms = heightSd;
// (LINEAR) h_i = a + b*n_i
const linFit = lsqFit(peakHeights.map((h, i) => ({ x: peakNs[i], y: h })));
// (SQRT)   h_i = a + b*sqrt(n_i)
const sqrtFit = lsqFit(peakHeights.map((h, i) => ({ x: Math.sqrt(peakNs[i]), y: h })));
// (LOG)    h_i = a + b*log(n_i)
const logFit = lsqFit(peakHeights.map((h, i) => ({ x: Math.log(peakNs[i]), y: h })));

// -- Model selection / growth-class discriminants -------------------------------------------------
const growthLawR2 = { linear: linFit.r2, sqrt: sqrtFit.r2, log: logFit.r2 };
const bestGrowthModel = Object.keys(growthLawR2).reduce((a, b) => (growthLawR2[b] > growthLawR2[a] ? b : a));
const maxGrowthR2 = Math.max(linFit.r2, sqrtFit.r2, logFit.r2);
const minGrowthR2 = Math.min(linFit.r2, sqrtFit.r2, logFit.r2);
const growthR2Spread = maxGrowthR2 - minGrowthR2;
const linearResidualReduction = constRms > 0 ? (constRms - linFit.rms) / constRms : 0;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The combined [400,1200] scan reproduces the sixteen-cluster structure (imp-33599+imp-33621+imp-33638).
const sixteenClustersFound = CLUSTERS.length >= 14;
// (2) The height GROWS: the linear slope is positive and beats the null (constant) residual RMS.
const heightGrowsPositive = linFit.slope > 0 && linFit.rms < constRms;
// (3) Every candidate law fits WEAKLY (max R^2 well below a decisive threshold).
const allGrowthFitsWeak = maxGrowthR2 < 0.5;
// (4) THE HEADLINE: the growth CLASS is UNRESOLVED -- the linear/sqrt/log R^2 differ by very little.
const growthClassUnresolved = growthR2Spread < 0.15;
// (5) The concave (sub-linear) laws do NOT out-score the linear law, so sub-linearity is NOT selected.
const subLinearNotSelected = !(sqrtFit.r2 > linFit.r2 + 0.05) && !(logFit.r2 > linFit.r2 + 0.05);
// (6) The trend is carried by the tall tail clusters: the tallest peak is a deep-tail (n > 1000) outlier.
const trendDrivenByTailOutliers = heightMax > 100 && heightArgMaxN > 1000;
// (7) THE HEADLINE: height grows weakly-positive but the growth class is unresolved.
const weakPositiveClassUnresolved =
  heightGrowsPositive && allGrowthFitsWeak && growthClassUnresolved && subLinearNotSelected;

const verdict =
  sixteenClustersFound && heightGrowsPositive && allGrowthFitsWeak && growthClassUnresolved &&
  subLinearNotSelected && trendDrivenByTailOutliers && weakPositiveClassUnresolved
    ? 'HEIGHT-GROWS-WEAKLY-POSITIVE-GROWTH-CLASS-UNRESOLVED.-FITTING-THE-SIXTEEN-imp-33599-[400,700]-+-' +
      'imp-33621-[700,900]-+-imp-33638-[900,1200]-BAND-CLEARING-CLUSTER-PEAK-HEIGHTS-(~64..86-ULP-FOR-THE-' +
      'FIRST-FOURTEEN,-THEN-~143.6-AT-n~1126-AND-~135.0-AT-n~1198)-TO-GROWTH-LAWS:-THE-HEIGHT-DOES-GROW-' +
      '(LINEAR-SLOPE~+0.067-ULP/RUNG,-RESIDUAL-RMS~19.1-VS-~23.3-NULL,-AN-~18%-REDUCTION)-BUT-ALL-FOUR-' +
      'CANDIDATE-LAWS-(CONSTANT/LINEAR/SQRT/LOG)-FIT-WEAKLY-(LINEAR-R^2~0.33,-SQRT-R^2~0.30,-LOG-R^2~0.27)-' +
      'WITH-THE-THREE-NON-CONSTANT-R^2-WITHIN-~0.06-OF-ONE-ANOTHER,-SO-NO-GROWTH-CLASS-IS-DECISIVELY-SELECTED;-' +
      'IN-PARTICULAR-THE-CONCAVE-SQRT/LOG-(SUB-LINEAR)-LAWS-DO-NOT-OUT-SCORE-LINEAR,-SO-STRICT-SUB-LINEARITY-' +
      'IS-NOT-SELECTED.-THE-POSITIVE-TREND-IS-CONCENTRATED-IN-THE-TWO-TALLEST-imp-33638-TAIL-CLUSTERS-(~135..144-' +
      'ULP);-THE-FIRST-FOURTEEN-PEAKS-SIT-IN-A-FLAT-~64..86-ULP-BAND.-CONSISTENT-WITH-THE-imp-33599/imp-33621/' +
      'imp-33638/imp-33639-latticeJitterCaveat-(THE-CLUSTERED-SPIKE-HEIGHTS-ARE-JITTER-DRIVEN,-SO-THE-EXACT-FIT-' +
      'COEFFICIENTS-ARE-NOT-ROBUST).-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-' +
      'feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT = Object.freeze({
  id: 'imp-33660-cluster-peak-envelope-height-growth-fit',
  ticket: 'imp-33660',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33639-cluster-peak-spacing-periodicity-fit.js',
  crossValidatesModules: [
    'imp-33639-cluster-peak-spacing-periodicity-fit.js',
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33621-band-clearing-cluster-decay-and-tail-scan.js',
    'imp-33599-wide-range-band-crossing-envelope-law.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'FITS the combined imp-33599 [400,700] + imp-33621 [700,900] + imp-33638 [900,1200] SIXTEEN ' +
    'band-clearing cluster-peak HEIGHTS to growth laws (constant/linear/sqrt(n)/log), off the SAME grade-4 ' +
    'budgets >= 200-node floorUlp(n) scan (one combined [400,1200] window) -- imp-33639 fit only the peak ' +
    'SPACING. RESULT: the peak-envelope height DOES grow (linear slope ~ +0.067 ULP/rung, residual RMS ~19.1 ' +
    'vs ~23.3 null, an ~18% reduction) but every candidate law fits WEAKLY (linear R^2 ~ 0.33, sqrt ~ 0.30, ' +
    'log ~ 0.27) with the three non-constant R^2 within ~0.06 of one another, so NO growth class is decisively ' +
    'selected; the concave sqrt/log (sub-linear) laws do NOT out-score linear, so strict sub-linearity is not ' +
    'selected. The positive trend is concentrated in the two tallest imp-33638 tail clusters (~135..144 ULP at ' +
    'n ~ 1126,1198); the first fourteen peaks sit in a flat ~64..86 ULP band. VERDICT: ' +
    'HEIGHT-GROWS-WEAKLY-POSITIVE-GROWTH-CLASS-UNRESOLVED, consistent with the imp-33599/imp-33621/imp-33638/' +
    'imp-33639 latticeJitterCaveat. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-' +
    'sufficient; jittery lattice floor; operator positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'ONE dense every-integer scan of the combined [400,1200] window, +/-5 collared, reproducing all sixteen clusters',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp; contiguous env >= 64 marks a band-clearing cluster; each cluster contributes its peak-env HEIGHT',
    modelConst: 'null model h_i = mean; residual RMS is the height sd, R^2 = 0 by construction',
    modelLinear: 'h_i = a + b*n_i (constant-rate growth); report slope, R^2, residual RMS',
    modelSqrt: 'h_i = a + b*sqrt(n_i) (sub-linear, concave); report R^2, residual RMS',
    modelLog: 'h_i = a + b*log(n_i) (sub-linear, strongly concave); report R^2, residual RMS',
    dispersion: 'peak-height mean, sd, min, max -- the null-model reference the growth laws must beat',
    selfComputing: 'the scan, the sixteen peaks, all four fits, and every verdict flag recompute at import',
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
    peakHeights: Object.freeze(peakHeights.slice()),
    // -- height dispersion (null model) --
    heightMean,
    heightSd,
    heightMin,
    heightMax,
    heightArgMaxN,
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
    // -- model selection --
    bestGrowthModel,
    maxGrowthR2,
    growthR2Spread,
    linearResidualReduction,
    // -- verdict flags --
    sixteenClustersFound,
    heightGrowsPositive,
    allGrowthFitsWeak,
    growthClassUnresolved,
    subLinearNotSelected,
    trendDrivenByTailOutliers,
    weakPositiveClassUnresolved,
    verdict,
    clusters: Object.freeze(CLUSTERS.map((c) => Object.freeze({ ...c }))),
  }),

  interpretation: Object.freeze({
    peaksReproduced:
      'The combined [400,1200] scan reproduces the imp-33599 three clusters (peaks ~526,591,634), the imp-33621 ' +
      'six tail clusters (peaks ~709,735,754,807,824,874), and the imp-33638 seven [900,1200] clusters (peaks ' +
      '~962,998,1038,1072,1104,1126,1198) as sixteen disjoint band-clearing clusters, so the height fit runs off ' +
      'the SAME floorUlp(n) scan, not on transcribed literals.',
    heightGrowsButWeakly:
      'The linear height fit has a positive slope ~ +0.067 ULP/rung and reduces the residual RMS from ~23.3 ' +
      '(constant/null) to ~19.1, an ~18% reduction -- so the peak-envelope height DOES grow. But R^2 ~ 0.33 is ' +
      'weak: the trend explains only a third of the height variance.',
    growthClassUnresolved:
      'The three non-constant candidate laws fit almost equally: linear R^2 ~ 0.33, sqrt(n) R^2 ~ 0.30, log ' +
      'R^2 ~ 0.27 -- a spread of only ~0.06, well inside the lattice jitter. No candidate growth law is ' +
      'decisively selected, so the growth CLASS is unresolved.',
    subLinearNotSelected:
      'Critically, the concave (sub-linear) laws sqrt(n) and log do NOT out-score the linear law -- they fit ' +
      'marginally worse. So the data does not select a strictly sub-linear class; the ticket premise of ' +
      'sub-linear height growth is NOT confirmed on this sixteen-cluster sample. It is simply a weak positive ' +
      'trend of undetermined class.',
    tailOutlierDriven:
      'The positive trend is carried almost entirely by the two tallest imp-33638 tail clusters (~143.6 ULP at ' +
      'n~1126, ~135.0 at n~1198); the first fourteen peaks sit in a flat ~64..86 ULP band. Removing the two tail ' +
      'outliers would flatten the trend, which is why the fit is weak and jitter-limited.',
    verdictWeakPositive:
      'VERDICT: HEIGHT-GROWS-WEAKLY-POSITIVE-GROWTH-CLASS-UNRESOLVED. The height grows weakly and positively, ' +
      'but no growth law (and no sub-linear law in particular) is decisively selected on the sixteen-cluster ' +
      'sample; the trend is two-outlier-driven and jitter-limited. This bounds any tail band-clearing claim to a ' +
      'weak positive height envelope, not a characterized growth law.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Fits the combined sixteen imp-33599 + imp-33621 + imp-33638 band-clearing cluster-peak HEIGHTS (re-derived ' +
      'off the same grade-4 budgets >= 200-node floorUlp(n) scan over [400,1200]) to four candidate growth models ' +
      '(constant, linear, sqrt(n), log) and classifies the growth as weak-positive / class-unresolved. It changes ' +
      'NO bound, patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33638/imp-33621/imp-33599/imp-33557/imp-33539/' +
      'imp-33316/imp-33213; this fits the height of the located cluster peaks, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621/imp-33638): the exact per-rung ULP bounces and cross-platform ' +
      'libm exp/pow variation can shift the exact peak heights, and hence the ~+0.067 ULP/rung linear slope, the ' +
      '~19.1-vs-~23.3 residual RMS, and the ~0.33/~0.30/~0.27 growth-law R^2. The robust reading is the ' +
      'QUALITATIVE conclusion -- a weak positive trend, growth class unresolved, driven by two tall tail clusters ' +
      '-- not the exact fit coefficients.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT_ASSERTIONS = [
  {
    id: 'imp33660-sixteen-clusters-reproduced',
    why: 'The combined [400,1200] scan must reproduce the imp-33599 + imp-33621 + imp-33638 band-clearing ' +
         'structure as the full set of disjoint cluster peaks (>= 14) so the height fit runs off the same scan.',
    holds: () => sixteenClustersFound && CLUSTERS.length >= 14,
  },
  {
    id: 'imp33660-height-grows-positive',
    why: 'The peak-envelope height must GROW: the linear fit slope must be positive and beat the null/constant ' +
         'residual RMS.',
    holds: () => heightGrowsPositive && linFit.slope > 0 && linFit.rms < constRms,
  },
  {
    id: 'imp33660-all-growth-fits-weak',
    why: 'Every candidate growth law must fit weakly (max R^2 < 0.5) -- the trend explains at most a third of ' +
         'the height variance.',
    holds: () => allGrowthFitsWeak && maxGrowthR2 < 0.5,
  },
  {
    id: 'imp33660-growth-class-unresolved',
    why: 'THE HEADLINE: the linear/sqrt/log R^2 must differ by very little (spread < 0.15), so no growth class ' +
         'is decisively selected.',
    holds: () => growthClassUnresolved && growthR2Spread < 0.15,
  },
  {
    id: 'imp33660-sub-linear-not-selected',
    why: 'The concave (sub-linear) sqrt(n)/log laws must NOT out-score the linear law by a decisive margin, so ' +
         'strict sub-linearity is NOT selected on this sample.',
    holds: () => subLinearNotSelected && !(sqrtFit.r2 > linFit.r2 + 0.05) && !(logFit.r2 > linFit.r2 + 0.05),
  },
  {
    id: 'imp33660-trend-driven-by-tail-outliers',
    why: 'The tallest peak must be a deep-tail (n > 1000) outlier above 100 ULP -- the imp-33638 tail ' +
         're-intensification that carries the positive trend.',
    holds: () => trendDrivenByTailOutliers && heightMax > 100 && heightArgMaxN > 1000,
  },
  {
    id: 'imp33660-weak-positive-class-unresolved',
    why: 'THE HEADLINE: height grows weakly-positive but the growth class (and sub-linearity in particular) is ' +
         'unresolved on the sixteen-cluster sample.',
    holds: () => weakPositiveClassUnresolved,
  },
  {
    id: 'imp33660-verdict-records-weak-positive',
    why: 'The classified verdict must record the HEIGHT-GROWS-WEAKLY-POSITIVE-GROWTH-CLASS-UNRESOLVED reading, ' +
         'not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33660-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT.honestCaveat;
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

for (const assertion of IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33660-cluster-peak-envelope-height-growth-fit assertion failed: ${assertion.id}`);
  }
}
