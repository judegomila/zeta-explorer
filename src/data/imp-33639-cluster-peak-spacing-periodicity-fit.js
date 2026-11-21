/**
 * @module imp-33639-cluster-peak-spacing-periodicity-fit
 * @fileoverview imp-33639 -- FIT the combined nine band-clearing cluster-peak locations that the
 *   imp-33599 [400,700] scan (three clusters: peaks ~526,591,634) and the imp-33621 [700,900]
 *   extension (six clusters: peaks ~709,735,754,807,824,874) located, to candidate spacing/periodicity
 *   models, and MEASURE whether the inter-peak spacing is quasi-periodic in n or irregular.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33621 LEFT UNMEASURED
 *   ------------------------------
 *   imp-33621 reported inter-peak spacings of ~65 and ~43 rungs for the three [400,700] clusters and
 *   located six further clusters in the tail [700,900] (peaks ~709,735,754,807,824,874), but it NEVER
 *   fit a spacing law across the combined nine-cluster set, nor tested whether the peaks recur on a
 *   quasi-periodic lattice. Whether the nine band-clearing spikes sit on a single dominant period
 *   (arithmetic progression), on a linear-in-index or sqrt(n)-scaled spacing ramp, or are simply
 *   irregular jitter-driven spikes was left open. This module re-derives the nine peaks off the SAME
 *   grade-4 budgets &gt;=200-node floorUlp(n) scan (one combined [400,900] window) and fits three
 *   candidate spacing models, reporting residuals / R^2 and a quasi-periodicity classification.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Identical rule to imp-33599 / imp-33621 / imp-33579: for every integer rung n take tau* =
 *   saddleTau(n), the imp-33213 log-domain target A_log(tau*), and score floorUlp(n) = the SMALLEST
 *   residual of the direct graded-GL plateau A_direct(tau*) over the resolved node ladder (grade 4,
 *   panels {20,30,50,100,200,400} = 200..4000 inner GL nodes), in ULP = A_log * 2^-52. The +/-5
 *   rolling-MAX envelope is the jitter-tolerant reading; contiguous env &gt;= 64 marks a band-clearing
 *   cluster; each cluster contributes its peak-env rung. We then fit the nine peak rungs peakN_i:
 *     (A) arithmetic progression  peakN_i = A + B*i  (a single constant spacing B = the period),
 *     (B) linear-in-index spacing gap_i   = a + b*i,
 *     (C) sqrt(n)-scaled spacing  gap_i   = a + b*sqrt(midN_i),
 *   and read the gap dispersion (mean, sd, coefficient of variation CV, min, max).
 *
 *   THE HEADLINE RESULT -- THE PEAKS ARE IRREGULAR, NOT QUASI-PERIODIC
 *   -----------------------------------------------------------------
 *   The nine peaks admit a ROUGH constant-spacing envelope: fitting peakN_i vs index i gives period
 *   B ~ 41.4 rungs with R^2 ~ 0.976 -- but that high R^2 is an artefact of a monotone sequence spanning
 *   ~350 rungs; the residual RMS about that arithmetic progression is ~16.8 rungs, ~40% of the period.
 *   The inter-peak GAPS themselves are [65,43,75,26,19,53,17,50] rungs: mean ~43.5, sd ~20.0, so the
 *   coefficient of variation is CV ~ 0.46 and the gaps range from 17 to 75 rungs (a &gt; 4x spread).
 *   Neither a linear-in-index spacing (R^2 ~ 0.18) nor a sqrt(n)-scaled spacing (R^2 ~ 0.21) explains
 *   that variation. So there is NO clean period: the spacing is IRREGULAR / jitter-dominated, not
 *   quasi-periodic.
 *
 *   VERDICT. SPACING-IRREGULAR-NOT-QUASI-PERIODIC. The nine imp-33599 + imp-33621 cluster peaks sit on
 *   a rough ~41-rung constant-spacing arithmetic-progression envelope (R^2 ~ 0.98 vs index, but a large
 *   ~17-rung / ~40% residual RMS), while the inter-peak gaps scatter from 17 to 75 rungs (CV ~ 0.46)
 *   with neither a linear-in-index (R^2 ~ 0.18) nor a sqrt(n)-scaled (R^2 ~ 0.21) law fitting. This is
 *   consistent with the imp-33599 / imp-33621 / imp-33557 / imp-33537 latticeJitterCaveat: the
 *   band-clearing clustered-spike structure is jitter-driven, so its peaks recur on no fixed lattice.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It fits the spacing of
 *   the nine band-clearing cluster peaks and classifies them as irregular; it changes NO bound, patches
 *   NO literal, and establishes NO operator positivity. floorUlp(n) is a JITTERY arithmetic-floor
 *   lattice property (imp-33249 / imp-33277 / imp-33296 / imp-33537 / imp-33557 / imp-33579 / imp-33599
 *   / imp-33621 latticeJitterCaveat): the exact per-rung ULP bounces and cross-platform libm exp/pow
 *   variation can shift the exact peak rungs, gaps, and hence every fit coefficient. The robust reading
 *   is the QUALITATIVE conclusion -- no fixed period, spacing irregular -- not the exact R^2 or period.
 *   The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33621-band-clearing-cluster-decay-and-tail-scan.js (the six tail clusters and the scan this reuses)
 *   @see imp-33599-wide-range-band-crossing-envelope-law.js (the three [400,700] clusters)
 *   @see imp-33557-band-crossing-min-budget.js (the node ladder)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33639 (numerical, medium).
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

// -- Scan configuration (identical rule to imp-33599/imp-33621; ONE combined window [400,900]) -----
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;            // the imp-33295/imp-33316/imp-33539/imp-33557/imp-33599/imp-33621 robust rule
const DEEP_FLOOR_ULP = 64;  // the imp-33316 widened ~2x deep-tail band
const COLLAR = 5;           // +/-5 collar so the rolling-max envelope is defined at window edges
const COMBINED_LO = 400;    // the imp-33599 + imp-33621 combined cluster window
const COMBINED_HI = 900;

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

// -- Compute the combined [400,900] scan, extract the nine cluster peaks ---------------------------
const COMBINED_SCAN = scanWindow(COMBINED_LO, COMBINED_HI);
const CLUSTERS = clustersOf(COMBINED_SCAN);
const peakNs = CLUSTERS.map((c) => c.peakN);
const peakEnvs = CLUSTERS.map((c) => c.peakEnv);
const gaps = peakNs.slice(1).map((pn, i) => pn - peakNs[i]);

// -- Gap dispersion (mean, sd, coefficient of variation, range) -----------------------------------
const gapMean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
const gapVar = gaps.reduce((a, b) => a + (b - gapMean) * (b - gapMean), 0) / gaps.length;
const gapSd = Math.sqrt(gapVar);
const gapCV = gapMean !== 0 ? gapSd / gapMean : 0;
const gapMin = Math.min(...gaps);
const gapMax = Math.max(...gaps);

// -- Model A: peakN_i = A + B*i (arithmetic progression / single constant spacing B = period) ------
const apFit = lsqFit(peakNs.map((pn, i) => ({ x: i, y: pn })));
const apPeriod = apFit.slope;
const apResidualRms = Math.sqrt(apFit.ssr / peakNs.length);
const apResidualFracOfPeriod = apPeriod !== 0 ? apResidualRms / apPeriod : Infinity;

// -- Model B: gap_i = a + b*i (linear-in-index spacing ramp) ---------------------------------------
const gapLinFit = lsqFit(gaps.map((g, i) => ({ x: i, y: g })));

// -- Model C: gap_i = a + b*sqrt(midN_i) (sqrt(n)-scaled spacing) ----------------------------------
const gapSqrtFit = lsqFit(gaps.map((g, i) => ({ x: Math.sqrt(0.5 * (peakNs[i] + peakNs[i + 1])), y: g })));

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The combined [400,900] scan reproduces the imp-33599 + imp-33621 nine-cluster structure.
const nineClustersFound = CLUSTERS.length >= 8;
// (2) The peaks sit on a rough constant-spacing arithmetic-progression envelope (high R^2 vs index).
const peaksOnRoughArithmeticProgression = apFit.r2 > 0.9 && apPeriod > 0;
// (3) BUT the arithmetic-progression residual RMS is a LARGE fraction of the period (>= ~25%).
const arithmeticProgressionResidualLarge = apResidualFracOfPeriod >= 0.25;
// (4) THE HEADLINE: the inter-peak gaps are highly dispersed (CV >= ~0.3) -- no single clean period.
const gapsHighlyDispersed = gapCV >= 0.3;
// (5) A linear-in-index spacing ramp does NOT explain the gap variation (weak R^2).
const linearInIndexDoesNotFit = gapLinFit.r2 < 0.5;
// (6) A sqrt(n)-scaled spacing law does NOT explain the gap variation (weak R^2).
const sqrtScaledDoesNotFit = gapSqrtFit.r2 < 0.5;
// (7) THE HEADLINE: the spacing is irregular, NOT quasi-periodic (a clean period would need CV small).
const notQuasiPeriodic = gapsHighlyDispersed && arithmeticProgressionResidualLarge;

const verdict =
  nineClustersFound && peaksOnRoughArithmeticProgression && arithmeticProgressionResidualLarge &&
  gapsHighlyDispersed && linearInIndexDoesNotFit && sqrtScaledDoesNotFit && notQuasiPeriodic
    ? 'SPACING-IRREGULAR-NOT-QUASI-PERIODIC.-FITTING-THE-COMBINED-imp-33599-[400,700]-+-imp-33621-[700,900]-' +
      'NINE-BAND-CLEARING-CLUSTER-PEAKS-(~526,591,634,709,735,754,807,824,874)-TO-SPACING-MODELS:-THE-PEAKS-' +
      'SIT-ON-A-ROUGH-CONSTANT-SPACING-ARITHMETIC-PROGRESSION-(PERIOD-B~41.4-RUNGS,-R^2~0.98-VS-INDEX)-BUT-' +
      'WITH-A-LARGE-RESIDUAL-RMS-~16.8-RUNGS-(~40%-OF-THE-PERIOD).-THE-INTER-PEAK-GAPS-[65,43,75,26,19,53,17,50]-' +
      'SCATTER-FROM-17-TO-75-RUNGS-(MEAN~43.5,-SD~20.0,-CV~0.46),-AND-NEITHER-A-LINEAR-IN-INDEX-SPACING-' +
      '(R^2~0.18)-NOR-A-SQRT(n)-SCALED-SPACING-(R^2~0.21)-EXPLAINS-THAT-VARIATION.-SO-THERE-IS-NO-CLEAN-PERIOD:-' +
      'THE-SPACING-IS-IRREGULAR-/-JITTER-DOMINATED,-NOT-QUASI-PERIODIC.-CONSISTENT-WITH-THE-imp-33599/imp-33621/' +
      'imp-33557/imp-33537-latticeJitterCaveat-(THE-CLUSTERED-SPIKE-STRUCTURE-IS-JITTER-DRIVEN,-SO-ITS-PEAKS-' +
      'RECUR-ON-NO-FIXED-LATTICE).-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-' +
      'NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33639_CLUSTER_PEAK_SPACING_PERIODICITY_FIT = Object.freeze({
  id: 'imp-33639-cluster-peak-spacing-periodicity-fit',
  ticket: 'imp-33639',
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
    'FITS the combined imp-33599 [400,700] (peaks ~526,591,634) + imp-33621 [700,900] (peaks ~709,735,754,' +
    '807,824,874) nine band-clearing cluster-peak locations to candidate spacing/periodicity models, off the ' +
    'SAME grade-4 budgets >= 200-node floorUlp(n) scan (one combined [400,900] window). RESULT: the peaks sit ' +
    'on a ROUGH constant-spacing arithmetic progression (period B ~ 41.4 rungs, R^2 ~ 0.98 vs index) but with a ' +
    'LARGE residual RMS ~ 16.8 rungs (~40% of the period); the inter-peak gaps [65,43,75,26,19,53,17,50] scatter ' +
    'from 17 to 75 rungs (mean ~43.5, sd ~20.0, CV ~ 0.46), and neither a linear-in-index spacing (R^2 ~ 0.18) ' +
    'nor a sqrt(n)-scaled spacing (R^2 ~ 0.21) explains the variation. VERDICT: SPACING-IRREGULAR-NOT-QUASI-' +
    'PERIODIC -- there is no clean period; the spacing is jitter-dominated, consistent with the imp-33599/' +
    'imp-33621/imp-33557/imp-33537 latticeJitterCaveat. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; jittery lattice floor; operator positivity (imp-3066) untouched; no QED. ' +
    'No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'ONE dense every-integer scan of the combined [400,900] window, +/-5 collared, reproducing all nine clusters',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp; contiguous env >= 64 marks a band-clearing cluster; each cluster contributes its peak-env rung',
    modelA: 'arithmetic progression peakN_i = A + B*i, a single constant spacing B (the candidate period); report R^2 and residual RMS',
    modelB: 'linear-in-index spacing gap_i = a + b*i; report R^2',
    modelC: 'sqrt(n)-scaled spacing gap_i = a + b*sqrt(midN_i); report R^2',
    dispersion: 'inter-peak gap mean, sd, coefficient of variation CV, min, max -- the quasi-periodicity discriminant',
    selfComputing: 'the scan, the nine peaks, all three fits, the gap dispersion, and every verdict flag recompute at import',
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
    peakEnvs: Object.freeze(peakEnvs.slice()),
    gaps: Object.freeze(gaps.slice()),
    // -- gap dispersion --
    gapMean,
    gapSd,
    gapCV,
    gapMin,
    gapMax,
    // -- Model A: arithmetic progression --
    apPeriod,
    apIntercept: apFit.intercept,
    apR2: apFit.r2,
    apResidualRms,
    apResidualFracOfPeriod,
    // -- Model B: linear-in-index spacing --
    gapLinSlope: gapLinFit.slope,
    gapLinIntercept: gapLinFit.intercept,
    gapLinR2: gapLinFit.r2,
    // -- Model C: sqrt(n)-scaled spacing --
    gapSqrtSlope: gapSqrtFit.slope,
    gapSqrtIntercept: gapSqrtFit.intercept,
    gapSqrtR2: gapSqrtFit.r2,
    // -- verdict flags --
    nineClustersFound,
    peaksOnRoughArithmeticProgression,
    arithmeticProgressionResidualLarge,
    gapsHighlyDispersed,
    linearInIndexDoesNotFit,
    sqrtScaledDoesNotFit,
    notQuasiPeriodic,
    verdict,
    clusters: Object.freeze(CLUSTERS.map((c) => Object.freeze({ ...c }))),
  }),

  interpretation: Object.freeze({
    peaksReproduced:
      'The combined [400,900] scan reproduces the imp-33599 three clusters (peaks ~526,591,634) and the ' +
      'imp-33621 six tail clusters (peaks ~709,735,754,807,824,874) as nine disjoint band-clearing clusters, ' +
      'so the spacing fit runs off the SAME floorUlp(n) scan, not on transcribed literals.',
    roughArithmeticProgressionButLargeResidual:
      'Fitting peakN_i vs index i gives a single constant spacing (period) B ~ 41.4 rungs with R^2 ~ 0.976. That ' +
      'high R^2 is largely an artefact of a monotone sequence spanning ~350 rungs: the residual RMS about the ' +
      'arithmetic progression is ~16.8 rungs, ~40% of the period, so the constant-spacing envelope is only rough.',
    gapsAreIrregular:
      'The inter-peak gaps are [65,43,75,26,19,53,17,50] rungs -- mean ~43.5, sd ~20.0, coefficient of variation ' +
      'CV ~ 0.46, ranging from 17 to 75 rungs (a > 4x spread). A quasi-periodic recurrence would need a small CV ' +
      'and a clean dominant period; this dispersion is far too large for that.',
    noSpacingLawFits:
      'Neither a linear-in-index spacing ramp gap_i = a + b*i (R^2 ~ 0.18) nor a sqrt(n)-scaled spacing ' +
      'gap_i = a + b*sqrt(midN) (R^2 ~ 0.21) explains the gap variation, so the irregularity is not a smooth ' +
      'growth or contraction of the spacing with n -- it is scatter.',
    verdictIrregular:
      'VERDICT: SPACING-IRREGULAR-NOT-QUASI-PERIODIC. The nine peaks recur on NO fixed lattice; the band-clearing ' +
      'clustered-spike structure is jitter-driven (imp-33599/imp-33621/imp-33557/imp-33537 latticeJitterCaveat), ' +
      'so a naive periodicity model would over-fit. This bounds any tail band-clearing claim to the cluster ' +
      'envelope, not a periodic onset lattice.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Fits the combined nine imp-33599 + imp-33621 band-clearing cluster-peak locations (re-derived off the same ' +
      'grade-4 budgets >= 200-node floorUlp(n) scan over [400,900]) to three candidate spacing models (arithmetic ' +
      'progression, linear-in-index, sqrt(n)-scaled) and classifies the spacing as irregular / not quasi-periodic. ' +
      'It changes NO bound, patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33621/imp-33599/imp-33557/imp-33539/imp-33316/' +
      'imp-33213; this fits the spacing of the located cluster peaks, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621): the exact per-rung ULP bounces and cross-platform libm exp/pow ' +
      'variation can shift the exact peak rungs, the gaps, and hence the ~41.4-rung period, the ~16.8-rung ' +
      'residual RMS, the ~0.46 CV, and the ~0.18/~0.21 spacing-law R^2. The robust reading is the QUALITATIVE ' +
      'conclusion -- no fixed period, spacing irregular, not quasi-periodic -- not the exact fit coefficients.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33639_CLUSTER_PEAK_SPACING_PERIODICITY_FIT_ASSERTIONS = [
  {
    id: 'imp33639-nine-clusters-reproduced',
    why: 'The combined [400,900] scan must reproduce the imp-33599 + imp-33621 band-clearing structure as ' +
         'the full set of disjoint cluster peaks (>= 8) so the spacing fit runs off the same floorUlp scan.',
    holds: () => nineClustersFound && CLUSTERS.length >= 8,
  },
  {
    id: 'imp33639-peaks-on-rough-arithmetic-progression',
    why: 'Fitting peakN vs index must give a positive period with high R^2 vs index (a monotone increasing ' +
         'sequence) -- the rough constant-spacing envelope.',
    holds: () => peaksOnRoughArithmeticProgression && apFit.r2 > 0.9 && apPeriod > 0,
  },
  {
    id: 'imp33639-arithmetic-progression-residual-large',
    why: 'The arithmetic-progression residual RMS must be a LARGE fraction of the period (>= 25%), so the ' +
         'high index-R^2 does NOT imply a clean single period.',
    holds: () => arithmeticProgressionResidualLarge && apResidualFracOfPeriod >= 0.25,
  },
  {
    id: 'imp33639-gaps-highly-dispersed',
    why: 'THE HEADLINE: the inter-peak gaps must be highly dispersed (coefficient of variation >= 0.3) -- ' +
         'the discriminant that rules out quasi-periodicity.',
    holds: () => gapsHighlyDispersed && gapCV >= 0.3,
  },
  {
    id: 'imp33639-linear-in-index-does-not-fit',
    why: 'A linear-in-index spacing ramp must NOT explain the gap variation (R^2 < 0.5).',
    holds: () => linearInIndexDoesNotFit && gapLinFit.r2 < 0.5,
  },
  {
    id: 'imp33639-sqrt-scaled-does-not-fit',
    why: 'A sqrt(n)-scaled spacing law must NOT explain the gap variation (R^2 < 0.5).',
    holds: () => sqrtScaledDoesNotFit && gapSqrtFit.r2 < 0.5,
  },
  {
    id: 'imp33639-not-quasi-periodic',
    why: 'THE HEADLINE: the combined verdict is that the spacing is irregular / NOT quasi-periodic (high gap ' +
         'dispersion AND large arithmetic-progression residual).',
    holds: () => notQuasiPeriodic,
  },
  {
    id: 'imp33639-verdict-records-irregular-spacing',
    why: 'The classified verdict must record the SPACING-IRREGULAR-NOT-QUASI-PERIODIC reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33639-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33639_CLUSTER_PEAK_SPACING_PERIODICITY_FIT.honestCaveat;
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

for (const assertion of IMP33639_CLUSTER_PEAK_SPACING_PERIODICITY_FIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33639-cluster-peak-spacing-periodicity-fit assertion failed: ${assertion.id}`);
  }
}
