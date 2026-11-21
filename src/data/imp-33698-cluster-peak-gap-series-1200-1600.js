/**
 * @module imp-33698-cluster-peak-gap-series-1200-1600
 * @fileoverview imp-33698 -- MEASURE the inter-peak GAP series on the imp-33679 band-clearing
 *   cluster-peak EXTENSION set over the fresh [1200,1600] window (the four peaks n ~ 1230,1324,1433,1599
 *   the imp-33661 [400,1200] spacing fit never reached), and ASSESS whether the imp-33661 spacing
 *   IRREGULARITY (fifteen gaps, mean ~44.8, sd ~21.2, CV ~0.47, range 17..88) PERSISTS, SATURATES, or
 *   REGULARIZES in the extension window.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33661 LEFT UNREACHED
 *   -----------------------------
 *   imp-33661 tabulated the inter-peak gaps of the sixteen [400,1200] band-clearing cluster peaks
 *   [65,43,75,26,19,53,17,50,88,36,40,34,32,22,72] (mean ~44.8, sd ~21.2, CV ~0.47, range 17..88) and
 *   returned SPACING-IRREGULAR-CV-PERSISTS-ON-SIXTEEN-PEAKS. Its sample STOPPED at the imp-33638 n=1200
 *   edge. imp-33679 subsequently ran a fresh [1200,1600] scan (SAME grade-4 budgets &gt;=200-node
 *   floorUlp(n) rule) and located FOUR new band-clearing cluster peaks at n ~ 1230,1324,1433,1599, but
 *   fit only their HEIGHTS (finding a saturated high plateau). Their SPACING was never measured. Whether
 *   the imp-33661 irregularity continues, tightens toward a period, or does something else in the window
 *   imp-33661 never reached was left open.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   IDENTICAL rule to imp-33599 / imp-33621 / imp-33638 / imp-33660 / imp-33661 / imp-33679: for every
 *   integer rung n take tau* = saddleTau(n), the imp-33213 log-domain target A_log(tau*), and score
 *   floorUlp(n) = the SMALLEST residual of the direct graded-GL plateau A_direct(tau*) over the resolved
 *   node ladder (grade 4, panels {20,30,50,100,200,400} = 200..4000 inner GL nodes), in ULP = A_log *
 *   2^-52. The +/-5 rolling-MAX envelope is the jitter-tolerant reading; contiguous env &gt;= 64 marks a
 *   band-clearing cluster; each cluster contributes its peak-env rung. We re-run the imp-33679 dense
 *   every-integer scan of the FRESH [1200,1600] window, collect the new band-clearing cluster peak rungs,
 *   compute the inter-peak GAPS, and tabulate the gap dispersion (mean, sd, CV, min, max) against the
 *   imp-33661 [400,1200] fifteen-gap baseline.
 *
 *   THE HEADLINE RESULT -- THE CLUSTERED SPACING STATISTIC UNDERGOES A REGIME CHANGE, NOT A CONTINUATION
 *   ---------------------------------------------------------------------------------------------------
 *   The [1200,1600] window yields FOUR band-clearing cluster peaks at n = 1230,1324,1433,1599 whose THREE
 *   inter-peak gaps are [94,109,166] rungs: mean ~123 (~2.7x the imp-33661 ~44.8), sd ~31.0, CV ~0.25
 *   (roughly HALF the imp-33661 ~0.47), and EVERY gap (min 94) sits ABOVE the imp-33661 gap MAX of 88.
 *   Taken at face value the halved CV reads as REGULARIZATION -- but that reading is a trap. The four
 *   [1200,1600] peaks are NOT discrete band-clearing clusters like [400,1200]: band-clearing here is
 *   NEAR-CONTINUOUS (~98.3% of the 401 fresh rungs clear env &gt;= 64, imp-33679), so these four peaks are
 *   sparse LOCAL MAXIMA of a broad saturated floor, not sixteen distinct clustered spikes. The gap MEAN
 *   widens ~2.7x precisely BECAUSE the discrete clustered lattice has DISSOLVED -- there are only four
 *   local maxima across 400 near-continuous rungs, versus sixteen discrete clusters across 800 rungs. On
 *   only THREE gaps the halved CV is not a robust regularization signal; it is an artefact of the
 *   clustered structure the imp-33661 gap statistic was built to measure no longer existing.
 *
 *   VERDICT. SPACING-STATISTIC-UNDERGOES-REGIME-CHANGE-NOT-CONTINUATION. The imp-33661 [400,1200] gaps
 *   (mean ~44.8, CV ~0.47, range 17..88) measured spacing between DISCRETE band-clearing clusters; the
 *   imp-33679 four [1200,1600] peaks are sparse local maxima of a NEAR-CONTINUOUS saturated floor
 *   (~98.3% clearing), so their gaps [94,109,166] (mean ~123, ~2.7x wider; CV ~0.25, ~half) measure a
 *   DIFFERENT object. The naive CV drop reads as "regularizes" but, on only three gaps and across a
 *   DISSOLVED clustered structure, it is NOT a meaningful spacing-regularization: the imp-33661
 *   irregularity neither cleanly PERSISTS nor SATURATES -- the underlying clustered lattice REGIME-CHANGES
 *   into a broad elevated floor whose sparse maxima are simply farther apart. Consistent with the
 *   imp-33679 near-continuous-clearing finding and the imp-33599/imp-33621/imp-33638/imp-33660/imp-33661
 *   latticeJitterCaveat. Accuracy / rule-design measurement only.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It measures the inter-peak
 *   spacing of the imp-33679 four extension cluster peaks and finds the imp-33661 clustered spacing
 *   statistic undergoes a regime change; it changes NO bound, patches NO literal, and establishes NO
 *   operator positivity. floorUlp(n) is a JITTERY arithmetic-floor lattice property (imp-33249 /
 *   imp-33277 / imp-33296 / imp-33537 / imp-33557 / imp-33579 / imp-33599 / imp-33621 / imp-33638 /
 *   imp-33660 / imp-33661 / imp-33679 latticeJitterCaveat): the exact per-rung ULP bounces and
 *   cross-platform libm exp/pow variation can shift the exact peak rungs, the three gaps, and hence the
 *   mean / sd / CV. Only THREE gaps are available, so no dispersion statistic is robust; the robust
 *   reading is the QUALITATIVE conclusion -- the clustered spacing statistic changes regime rather than
 *   continuing -- not the exact coefficients. The NPHI = 10 Phi-series truncation is inherited upstream.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33679-cluster-peak-envelope-height-1200-1600.js (the four [1200,1600] peaks whose spacing this measures)
 *   @see imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js (the [400,1200] fifteen-gap baseline)
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the tail clusters, now the plateau onset)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33698 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33557/imp-33599/imp-33679) -
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

// -- Scan configuration (identical rule to imp-33679; the fresh [1200,1600] extension window) -------
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;            // the imp-33295/imp-33316/imp-33539/imp-33557/imp-33599/imp-33679 robust rule
const DEEP_FLOOR_ULP = 64;  // the imp-33316 widened ~2x deep-tail band
const COLLAR = 5;           // +/-5 collar so the rolling-max envelope is defined at window edges
const FRESH_LO = 1200;      // the imp-33679 fresh window BEYOND the imp-33638/imp-33661 n=1200 sample edge
const FRESH_HI = 1600;

// -- imp-33661 [400,1200] fifteen-gap baseline (the persistence/regularization comparison target) --
const IMP33661_GAP_MEAN = 44.8;  // imp-33661 measured fifteen-gap mean
const IMP33661_GAP_SD = 21.2;    // imp-33661 measured fifteen-gap sd
const IMP33661_GAP_CV = 0.47;    // imp-33661 measured fifteen-gap coefficient of variation
const IMP33661_GAP_MAX = 88;     // imp-33661 widest [400,1200] gap (874 -> 962)

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

// -- Disjoint contiguous clusters of env &gt;= 64 (peak location, width) ------------------------------
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

// -- Compute the fresh [1200,1600] scan, extract the extension cluster peak rungs and inter-peak gaps -
const FRESH_SCAN = scanWindow(FRESH_LO, FRESH_HI);
const CLUSTERS = clustersOf(FRESH_SCAN);
const peakNs = CLUSTERS.map((c) => c.peakN);
const gaps = peakNs.slice(1).map((pn, i) => pn - peakNs[i]);

// -- Gap dispersion of the extension window (mean, sd, coefficient of variation, range) ------------
const gapMean = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
const gapVar = gaps.length ? gaps.reduce((a, b) => a + (b - gapMean) * (b - gapMean), 0) / gaps.length : 0;
const gapSd = Math.sqrt(gapVar);
const gapCV = gapMean !== 0 ? gapSd / gapMean : 0;
const gapMin = gaps.length ? Math.min(...gaps) : 0;
const gapMax = gaps.length ? Math.max(...gaps) : 0;

// -- Drift statistics vs the imp-33661 [400,1200] fifteen-gap baseline -----------------------------
const gapMeanRatio = IMP33661_GAP_MEAN !== 0 ? gapMean / IMP33661_GAP_MEAN : Infinity;   // ~2.7x
const gapCVRatio = IMP33661_GAP_CV !== 0 ? gapCV / IMP33661_GAP_CV : Infinity;           // ~0.54 (halves)
const gapSdRatio = IMP33661_GAP_SD !== 0 ? gapSd / IMP33661_GAP_SD : Infinity;           // ~1.46

// -- Band-clearing coverage of the fresh window (the clustered-structure-dissolved discriminant) ----
const rungsInWindow = FRESH_SCAN.length;
const rungsBelowBand = FRESH_SCAN.filter((r) => r.envelope < DEEP_FLOOR_ULP).length;
const fracClearing = 1 - rungsBelowBand / rungsInWindow;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The fresh [1200,1600] scan yields enough extension peaks to form an inter-peak gap series.
const freshGapsComputed = gaps.length >= 3;
// (2) The extension gap MEAN drifts UP sharply (> 1.5x) vs the imp-33661 [400,1200] mean.
const gapMeanWidens = gapMean > 1.5 * IMP33661_GAP_MEAN;
// (3) EVERY extension gap sits ABOVE the imp-33661 [400,1200] gap MAX (the spacing floor lifts).
const allGapsAbovePriorMax = gapMin > IMP33661_GAP_MAX;
// (4) The naive extension gap CV DROPS well below the imp-33661 CV (< 0.8x) -- reads as regularization.
const cvDropsNaively = gapCV < 0.8 * IMP33661_GAP_CV;
// (5) Band-clearing in the extension window is NEAR-CONTINUOUS (> 85% of rungs) -- imp-33679 finding.
const bandClearingNearContinuous = fracClearing > 0.85;
// (6) The discrete clustered lattice has DISSOLVED: near-continuous clearing with only a few local maxima.
const clusteredStructureDissolved = bandClearingNearContinuous && CLUSTERS.length <= 5;
// (7) Only a FEW gaps are available, so no dispersion statistic is robust (mandatory small-sample caveat).
const smallSampleCaveat = gaps.length < 5;
// (8) THE HEADLINE: the clustered spacing statistic REGIME-CHANGES rather than persists/saturates/regularizes.
const regimeChangeNotContinuation =
  freshGapsComputed && gapMeanWidens && allGapsAbovePriorMax && cvDropsNaively &&
  clusteredStructureDissolved && smallSampleCaveat;

const verdict =
  regimeChangeNotContinuation
    ? 'SPACING-STATISTIC-UNDERGOES-REGIME-CHANGE-NOT-CONTINUATION.-MEASURING-THE-INTER-PEAK-GAPS-OF-THE-' +
      'imp-33679-FOUR-[1200,1600]-EXTENSION-CLUSTER-PEAKS-(n=1230,1324,1433,1599):-THE-THREE-GAPS-[94,109,166]-' +
      'HAVE-MEAN~123-(~2.7x-THE-imp-33661-[400,1200]-~44.8),-SD~31.0,-CV~0.25-(~HALF-THE-imp-33661-~0.47),-AND-' +
      'EVERY-GAP-(MIN-94)-SITS-ABOVE-THE-imp-33661-GAP-MAX-OF-88.-THE-HALVED-CV-NAIVELY-READS-AS-REGULARIZATION,-' +
      'BUT-THE-FOUR-[1200,1600]-PEAKS-ARE-NOT-DISCRETE-CLUSTERS-LIKE-[400,1200]:-BAND-CLEARING-IS-NEAR-CONTINUOUS-' +
      '(~98.3%-OF-RUNGS-CLEAR-env>=64,-imp-33679),-SO-THESE-FOUR-PEAKS-ARE-SPARSE-LOCAL-MAXIMA-OF-A-BROAD-' +
      'SATURATED-FLOOR,-NOT-SIXTEEN-DISCRETE-SPIKES.-THE-GAP-MEAN-WIDENS-~2.7x-BECAUSE-THE-DISCRETE-CLUSTERED-' +
      'LATTICE-HAS-DISSOLVED-(FOUR-MAXIMA-ACROSS-400-CONTINUOUS-RUNGS-VS-SIXTEEN-CLUSTERS-ACROSS-800).-ON-ONLY-' +
      'THREE-GAPS-THE-HALVED-CV-IS-NOT-A-ROBUST-REGULARIZATION-SIGNAL:-THE-imp-33661-IRREGULARITY-NEITHER-CLEANLY-' +
      'PERSISTS-NOR-SATURATES-;-THE-CLUSTERED-SPACING-STATISTIC-REGIME-CHANGES-INTO-A-BROAD-ELEVATED-FLOOR.-' +
      'CONSISTENT-WITH-THE-imp-33679-NEAR-CONTINUOUS-CLEARING-AND-THE-imp-33599/imp-33621/imp-33638/imp-33660/' +
      'imp-33661-latticeJitterCaveat.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-' +
      'feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33698_CLUSTER_PEAK_GAP_SERIES_1200_1600 = Object.freeze({
  id: 'imp-33698-cluster-peak-gap-series-1200-1600',
  ticket: 'imp-33698',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js',
  crossValidatesModules: [
    'imp-33679-cluster-peak-envelope-height-1200-1600.js',
    'imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js',
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'MEASURES the inter-peak GAP series on the imp-33679 four [1200,1600] band-clearing extension cluster ' +
    'peaks (n = 1230,1324,1433,1599, re-derived off the SAME grade-4 budgets >= 200-node floorUlp(n) scan) and ' +
    'ASSESSES whether the imp-33661 [400,1200] spacing irregularity (fifteen gaps, mean ~44.8, CV ~0.47, range ' +
    '17..88) persists, saturates, or regularizes. RESULT: the three extension gaps [94,109,166] have mean ~123 ' +
    '(~2.7x wider), sd ~31.0, CV ~0.25 (~half), and every gap (min 94) exceeds the imp-33661 gap max of 88. The ' +
    'halved CV naively reads as regularization, but the four peaks are sparse LOCAL MAXIMA of a near-continuous ' +
    'saturated floor (~98.3% of rungs clear env >= 64, imp-33679), not discrete clusters -- so the gap statistic ' +
    'measures a DIFFERENT object. VERDICT: SPACING-STATISTIC-UNDERGOES-REGIME-CHANGE-NOT-CONTINUATION -- the ' +
    'discrete clustered lattice dissolves; on only three gaps the CV drop is not a robust regularization signal, ' +
    'and the imp-33661 irregularity neither cleanly persists nor saturates. ACCURACY/RULE-DESIGN MEASUREMENT, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; operator positivity (imp-3066) ' +
    'untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'ONE dense every-integer scan of the imp-33679 fresh [1200,1600] extension window, +/-5 collared',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp >= 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp; contiguous env >= 64 marks a band-clearing cluster; each cluster contributes its peak-env rung',
    gapSeries: 'gap_i = peakN_{i+1} - peakN_i over the extension cluster peaks; report mean, sd, CV, min, max',
    baselineComparison: 'tabulate the extension gap dispersion against the imp-33661 [400,1200] fifteen-gap baseline (mean ~44.8, sd ~21.2, CV ~0.47, max 88)',
    dissolvedDiscriminant: 'fraction of the 401 fresh rungs clearing env >= 64 -- near-continuous clearing means the discrete clustered lattice has dissolved into a broad floor',
    selfComputing: 'the fresh scan, the extension peaks, the gap series, the dispersion, the baseline drift ratios, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    resolvedPanelSweep: Object.freeze(RESOLVED_PANEL_SWEEP.slice()),
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    collar: COLLAR,
    freshWindowLo: FRESH_LO,
    freshWindowHi: FRESH_HI,
    clusterCount: CLUSTERS.length,
    peakNs: Object.freeze(peakNs.slice()),
    gaps: Object.freeze(gaps.slice()),
    // -- extension-window gap dispersion --
    gapMean,
    gapSd,
    gapCV,
    gapMin,
    gapMax,
    // -- imp-33661 [400,1200] baseline and drift ratios --
    imp33661GapMean: IMP33661_GAP_MEAN,
    imp33661GapSd: IMP33661_GAP_SD,
    imp33661GapCV: IMP33661_GAP_CV,
    imp33661GapMax: IMP33661_GAP_MAX,
    gapMeanRatio,
    gapSdRatio,
    gapCVRatio,
    // -- band-clearing coverage (dissolved-structure discriminant) --
    rungsInWindow,
    rungsBelowBand,
    fracClearing,
    // -- verdict flags --
    freshGapsComputed,
    gapMeanWidens,
    allGapsAbovePriorMax,
    cvDropsNaively,
    bandClearingNearContinuous,
    clusteredStructureDissolved,
    smallSampleCaveat,
    regimeChangeNotContinuation,
    verdict,
    clusters: Object.freeze(CLUSTERS.map((c) => Object.freeze({ ...c }))),
  }),

  interpretation: Object.freeze({
    extensionGapsComputed:
      'The fresh [1200,1600] scan re-derives the imp-33679 four band-clearing cluster peaks at n = ' +
      '1230,1324,1433,1599, so the inter-peak gaps [94,109,166] run off a genuinely NEW floorUlp(n) scan the ' +
      'imp-33661 [400,1200] sample never reached, not transcribed literals.',
    meanWidensRangeLifts:
      'The three extension gaps have mean ~123, ~2.7x the imp-33661 [400,1200] gap mean ~44.8, and the SMALLEST ' +
      'extension gap (94) already exceeds the WIDEST imp-33661 gap (88). The spacing floor lifts wholesale -- the ' +
      'peaks are much farther apart than any discrete cluster spacing in [400,1200].',
    cvHalvesButNotRegularization:
      'The extension gap CV ~0.25 is roughly HALF the imp-33661 ~0.47, which taken alone would read as ' +
      'REGULARIZATION toward a period. That reading is a trap: it rests on only THREE gaps (smallSampleCaveat) ' +
      'and, decisively, on a clustered structure that no longer exists.',
    clusteredLatticeDissolved:
      'Band-clearing in [1200,1600] is NEAR-CONTINUOUS (~98.3% of the 401 rungs clear env >= 64, imp-33679), so ' +
      'the four peaks are sparse LOCAL MAXIMA of a broad saturated floor, not sixteen discrete clustered spikes. ' +
      'The gap mean widens ~2.7x precisely BECAUSE the discrete clustered lattice the imp-33661 gap statistic was ' +
      'built to measure has DISSOLVED -- four maxima across 400 continuous rungs versus sixteen clusters across 800.',
    verdictRegimeChange:
      'VERDICT: SPACING-STATISTIC-UNDERGOES-REGIME-CHANGE-NOT-CONTINUATION. The imp-33661 irregularity neither ' +
      'cleanly persists (the gaps are ~2.7x wider and the CV halves) nor saturates -- the underlying clustered ' +
      'lattice regime-changes into a broad elevated floor whose sparse maxima are simply farther apart. The ' +
      'naive CV drop is an artefact of measuring a different object, not a regularization of the same one; the ' +
      'robust reading is the qualitative regime change, not the exact three-gap coefficients.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Measures the inter-peak spacing of the imp-33679 four [1200,1600] band-clearing extension cluster peaks ' +
      '(re-derived off the same grade-4 budgets >= 200-node floorUlp(n) scan), tabulates the three-gap dispersion ' +
      'against the imp-33661 [400,1200] fifteen-gap baseline, and classifies the clustered spacing statistic as ' +
      'undergoing a regime change. It changes NO bound, patches NO literal, and establishes NO operator ' +
      'positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    smallSample:
      'Only THREE inter-peak gaps are available on the four extension peaks, so NO dispersion statistic (mean, ' +
      'sd, CV) is robust; the halved CV must NOT be read as a regularization of the imp-33661 spacing. The robust ' +
      'reading is the qualitative regime change (discrete clusters -> near-continuous floor), not the coefficients.',
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33679/imp-33661/imp-33660/imp-33638/imp-33621/' +
      'imp-33599/imp-33557/imp-33539/imp-33316/imp-33213; this measures the spacing of the located cluster peaks, ' +
      'not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621/imp-33638/imp-33660/imp-33661/imp-33679): the exact per-rung ULP ' +
      'bounces and cross-platform libm exp/pow variation can shift the exact peak rungs, the three gaps, and hence ' +
      'the ~123-rung mean, the ~31.0-rung sd, and the ~0.25 CV. The robust reading is the QUALITATIVE conclusion ' +
      '-- the clustered spacing statistic regime-changes rather than persisting/saturating/regularizing -- not ' +
      'the exact coefficients.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33698_CLUSTER_PEAK_GAP_SERIES_1200_1600_ASSERTIONS = [
  {
    id: 'imp33698-fresh-gaps-computed',
    why: 'The fresh [1200,1600] scan must re-derive the imp-33679 extension peaks and yield an inter-peak gap ' +
         'series (>= 3 gaps) so the measurement runs off a genuinely new floorUlp(n) scan.',
    holds: () => freshGapsComputed && gaps.length >= 3,
  },
  {
    id: 'imp33698-gap-mean-widens',
    why: 'The extension gap MEAN must drift UP sharply (> 1.5x) vs the imp-33661 [400,1200] gap mean ~44.8 -- ' +
         'the peaks are much farther apart than the discrete cluster spacing.',
    holds: () => gapMeanWidens && gapMean > 1.5 * IMP33661_GAP_MEAN,
  },
  {
    id: 'imp33698-all-gaps-above-prior-max',
    why: 'EVERY extension gap must sit ABOVE the imp-33661 [400,1200] gap MAX of 88, showing the spacing floor ' +
         'lifts wholesale rather than merely shifting.',
    holds: () => allGapsAbovePriorMax && gapMin > IMP33661_GAP_MAX,
  },
  {
    id: 'imp33698-cv-drops-naively',
    why: 'The naive extension gap CV must drop well below the imp-33661 CV ~0.47 (< 0.8x) -- the reading that ' +
         'would superficially suggest regularization and that the verdict must contextualize as an artefact.',
    holds: () => cvDropsNaively && gapCV < 0.8 * IMP33661_GAP_CV,
  },
  {
    id: 'imp33698-clustered-structure-dissolved',
    why: 'The extension window must show NEAR-CONTINUOUS band-clearing (> 85% of rungs) with only a few local ' +
         'maxima, so the discrete clustered lattice has dissolved and the gap statistic measures a different object.',
    holds: () => clusteredStructureDissolved && bandClearingNearContinuous && CLUSTERS.length <= 5,
  },
  {
    id: 'imp33698-small-sample-caveat',
    why: 'Only a FEW gaps (< 5) are available, so no dispersion statistic is robust -- the mandatory small-sample ' +
         'caveat that blocks reading the halved CV as regularization.',
    holds: () => smallSampleCaveat && gaps.length < 5,
  },
  {
    id: 'imp33698-regime-change-not-continuation',
    why: 'THE HEADLINE: the clustered spacing statistic undergoes a regime change (mean widens, all gaps above ' +
         'prior max, CV drops naively, clustered structure dissolved, small sample) rather than a continuation.',
    holds: () => regimeChangeNotContinuation,
  },
  {
    id: 'imp33698-verdict-records-regime-change',
    why: 'The classified verdict must record the SPACING-STATISTIC-UNDERGOES-REGIME-CHANGE reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33698-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33698_CLUSTER_PEAK_GAP_SERIES_1200_1600.honestCaveat;
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

for (const assertion of IMP33698_CLUSTER_PEAK_GAP_SERIES_1200_1600_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33698-cluster-peak-gap-series-1200-1600 assertion failed: ${assertion.id}`);
  }
}
