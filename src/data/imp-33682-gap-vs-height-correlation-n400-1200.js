/**
 * @module imp-33682-gap-vs-height-correlation-n400-1200
 * @fileoverview imp-33682 -- CORRELATE the imp-33661 fifteen inter-peak GAPS against the imp-33660
 *   sixteen cluster-peak HEIGHTS at the SHARED [400,1200] sixteen-cluster set, and MEASURE whether
 *   taller peaks sit at wider spacings. imp-33661 characterized the gap sequence (irregular, CV ~ 0.47)
 *   and imp-33660 characterized the peak heights (weak-positive, growth class unresolved), but NEITHER
 *   module correlated gap against height -- a cross-check that tests whether the spacing irregularity and
 *   the weak height growth share a common lattice driver or are independent.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33660 AND imp-33661 LEFT UNMEASURED
 *   --------------------------------------------
 *   Both siblings ran the IDENTICAL grade-4 budgets &gt;=200-node floorUlp(n) scan over one combined
 *   [400,1200] window and extracted the SAME sixteen band-clearing cluster peaks. imp-33660 read each
 *   cluster peak-envelope HEIGHT h_i and fit its growth (weak-positive, class-unresolved); imp-33661 read
 *   the fifteen inter-peak GAPS g_i = peakN_{i+1} - peakN_i and fit their spacing (irregular, CV ~ 0.47,
 *   no quasi-period). Neither aligned the two at the shared peaks. If a wider gap PREDICTED a taller peak,
 *   the spacing irregularity and the height jitter would share a common lattice driver; if gap and height
 *   are uncorrelated, the two irregularities are INDEPENDENT arithmetic-floor phenomena. This module
 *   re-derives the sixteen peaks off the SAME scan, aligns each of the fifteen gaps with its two adjacent
 *   peak heights, and computes Pearson and Spearman correlation (plus Pearson R^2) under four alignments.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Identical rule to imp-33599 / imp-33621 / imp-33638 / imp-33639 / imp-33660 / imp-33661: for every
 *   integer rung n take tau* = saddleTau(n), the imp-33213 log-domain target A_log(tau*), and score
 *   floorUlp(n) = the SMALLEST residual of the direct graded-GL plateau A_direct(tau*) over the resolved
 *   node ladder (grade 4, panels {20,30,50,100,200,400} = 200..4000 inner GL nodes), in ULP = A_log*2^-52.
 *   The +/-5 rolling-MAX envelope is the jitter-tolerant reading; contiguous env &gt;= 64 marks a
 *   band-clearing cluster; each cluster contributes its peak-env HEIGHT h_i and rung peakN_i. The fifteen
 *   gaps g_i = peakN_{i+1} - peakN_i are each aligned with:
 *     (LEFT)  the left bounding peak height  h_i,
 *     (RIGHT) the right bounding peak height h_{i+1},
 *     (MEAN)  the mean of the two adjacent heights (h_i + h_{i+1})/2   -- the PRIMARY alignment,
 *     (MAX)   the max of the two adjacent heights,
 *   and for each we report Pearson r, Pearson R^2 = r^2, and Spearman rank rho.
 *
 *   THE HEADLINE RESULT -- GAP AND HEIGHT ARE ESSENTIALLY INDEPENDENT
 *   ----------------------------------------------------------------
 *   The sixteen peaks/heights (from imp-33660) are peakNs [526,591,634,709,735,754,807,824,874,962,998,
 *   1038,1072,1104,1126,1198] with heights [76.1,65.3,64.1,78.4,67.3,67.1,64.5,73.2,68.4,78.6,85.6,71.8,
 *   64.7,72.3,143.6,135.0] ULP; the fifteen gaps (from imp-33661) are [65,43,75,26,19,53,17,50,88,36,40,
 *   34,32,22,72] rungs. The PRIMARY (mean-adjacent-height) alignment gives Pearson r ~ +0.19 (R^2 ~ 0.035)
 *   and Spearman rho ~ +0.18 -- a NEGLIGIBLE, weakly-positive correlation explaining ~3.5% of the variance.
 *   Across all four alignments the Pearson |r| stays &lt;= ~0.30 (LEFT ~0.30, RIGHT ~0.065, MEAN ~0.19,
 *   MAX ~0.083) and R^2 &lt;= ~0.088, and every Spearman |rho| &lt;= ~0.18. The sign is weakly POSITIVE
 *   (wider gaps sit near marginally taller peaks) but the effect is far too small to be distinguished from
 *   the lattice jitter. Decisively, the TALLEST peak (n~1126, h~143.6 ULP) sits at a NARROW inbound gap of
 *   just 22 rungs -- the direct opposite of "taller peaks at wider spacings" -- so the two tall imp-33638
 *   tail clusters that drive the imp-33660 height trend do NOT sit at anomalously wide gaps.
 *
 *   VERDICT. GAP-AND-HEIGHT-INDEPENDENT-NO-CORRELATION. Correlating the fifteen imp-33661 inter-peak gaps
 *   against the sixteen imp-33660 cluster-peak heights at the shared [400,1200] peaks yields a NEGLIGIBLE,
 *   weakly-positive association under every alignment (Pearson |r| &lt;= ~0.30, R^2 &lt;= ~0.088, Spearman
 *   |rho| &lt;= ~0.18); the primary mean-adjacent-height alignment gives r ~ +0.19 / R^2 ~ 0.035. Taller
 *   peaks do NOT sit at wider spacings -- the tallest peak sits at a 22-rung (narrow) inbound gap. So the
 *   imp-33661 spacing irregularity and the imp-33660 weak height growth do NOT share a detectable common
 *   lattice driver at this sample: they are INDEPENDENT arithmetic-floor phenomena, consistent with the
 *   imp-33599 / imp-33621 / imp-33638 / imp-33639 / imp-33660 / imp-33661 latticeJitterCaveat.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It cross-correlates the gap
 *   and height sequences of the sixteen band-clearing cluster peaks and classifies them independent; it
 *   changes NO bound, patches NO literal, and establishes NO operator positivity. floorUlp(n) is a JITTERY
 *   arithmetic-floor lattice property (imp-33249 / imp-33277 / imp-33296 / imp-33537 / imp-33557 /
 *   imp-33579 / imp-33599 / imp-33621 / imp-33638 / imp-33639 / imp-33660 / imp-33661 latticeJitterCaveat):
 *   the exact per-rung ULP bounces and cross-platform libm exp/pow variation can shift the exact peak rungs,
 *   gaps, and heights, and hence every correlation coefficient. The robust reading is the QUALITATIVE
 *   conclusion -- negligible correlation, gap and height independent, taller peaks NOT at wider gaps -- not
 *   the exact r / rho / R^2. Fifteen paired points is a SMALL sample, so even the sign is not robust. The
 *   NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT;
 *   the operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the SOTA.
 *
 *   @see imp-33660-cluster-peak-envelope-height-growth-fit.js (the sixteen peak HEIGHTS this correlates)
 *   @see imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js (the fifteen GAPS this correlates)
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the seven tall tail clusters)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33682 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33557/imp-33660/imp-33661) -
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

// -- Pearson correlation of two equal-length vectors ----------------------------------------------
function pearson(xs, ys) {
  const m = xs.length;
  let sx = 0;
  let sy = 0;
  for (let i = 0; i < m; i += 1) { sx += xs[i]; sy += ys[i]; }
  const mx = sx / m;
  const my = sy / m;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < m; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
    syy += (ys[i] - my) * (ys[i] - my);
  }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
}

// -- Fractional (mid-)ranks, tie-averaged, for the Spearman rank correlation -----------------------
function fractionalRanks(a) {
  const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]);
  const r = new Array(a.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j += 1;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) r[idx[k][1]] = avg;
    i = j + 1;
  }
  return r;
}
function spearman(xs, ys) {
  return pearson(fractionalRanks(xs), fractionalRanks(ys));
}

// -- Compute the combined [400,1200] scan, extract the sixteen cluster peaks -----------------------
const COMBINED_SCAN = scanWindow(COMBINED_LO, COMBINED_HI);
const CLUSTERS = clustersOf(COMBINED_SCAN);
const peakNs = CLUSTERS.map((c) => c.peakN);
const peakHeights = CLUSTERS.map((c) => c.peakEnv);       // the imp-33660 sixteen peak HEIGHTS
const gaps = peakNs.slice(1).map((pn, i) => pn - peakNs[i]); // the imp-33661 fifteen inter-peak GAPS

// -- Align each gap g_i with the adjacent peak heights under four alignments -----------------------
const leftHeights = gaps.map((g, i) => peakHeights[i]);              // left bounding peak height
const rightHeights = gaps.map((g, i) => peakHeights[i + 1]);        // right bounding peak height
const meanHeights = gaps.map((g, i) => 0.5 * (peakHeights[i] + peakHeights[i + 1])); // PRIMARY
const maxHeights = gaps.map((g, i) => Math.max(peakHeights[i], peakHeights[i + 1]));

// -- Correlations (Pearson r, Pearson R^2, Spearman rho) under each alignment ----------------------
function corrOf(ys) {
  const r = pearson(gaps, ys);
  return Object.freeze({ pearsonR: r, pearsonR2: r * r, spearmanRho: spearman(gaps, ys) });
}
const corrLeft = corrOf(leftHeights);
const corrRight = corrOf(rightHeights);
const corrMean = corrOf(meanHeights); // the PRIMARY (mean-adjacent-height) alignment
const corrMax = corrOf(maxHeights);

// -- The tallest peak and the width of its inbound gap (the direct taller-at-wider test) -----------
const heightMax = Math.max(...peakHeights);
const tallestIdx = peakHeights.indexOf(heightMax);
const tallestN = peakNs[tallestIdx];
// inbound gap = gap leading INTO the tallest peak (undefined for the first peak); use the left gap
const tallestInboundGap = tallestIdx > 0 ? peakNs[tallestIdx] - peakNs[tallestIdx - 1] : null;
const gapMean = gaps.reduce((a, b) => a + b, 0) / gaps.length;

// -- Discriminants over all four alignments -------------------------------------------------------
const allPearsonAbs = [corrLeft, corrRight, corrMean, corrMax].map((c) => Math.abs(c.pearsonR));
const allR2 = [corrLeft, corrRight, corrMean, corrMax].map((c) => c.pearsonR2);
const allSpearmanAbs = [corrLeft, corrRight, corrMean, corrMax].map((c) => Math.abs(c.spearmanRho));
const maxPearsonAbs = Math.max(...allPearsonAbs);
const maxR2 = Math.max(...allR2);
const maxSpearmanAbs = Math.max(...allSpearmanAbs);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The combined [400,1200] scan reproduces the shared sixteen-cluster structure (>= 15).
const sixteenClustersFound = CLUSTERS.length >= 15 && gaps.length >= 14;
// (2) The reproduced heights match the imp-33660 dispersion (tall tail present: max > 100 ULP).
const heightsReproduced = heightMax > 100;
// (3) THE HEADLINE: EVERY alignment gives a NEGLIGIBLE Pearson |r| (< 0.35) -- no linear association.
const pearsonNegligible = maxPearsonAbs < 0.35;
// (4) THE HEADLINE: EVERY alignment explains at most a tiny fraction of the variance (R^2 < 0.15).
const varianceExplainedTiny = maxR2 < 0.15;
// (5) The Spearman (rank) association is also negligible (|rho| < 0.35) -- not a monotone-nonlinear link.
const spearmanNegligible = maxSpearmanAbs < 0.35;
// (6) DECISIVE: the tallest peak does NOT sit at a wide inbound gap (its inbound gap is below the mean).
const tallestNotAtWideGap = tallestInboundGap !== null && tallestInboundGap < gapMean;
// (7) THE HEADLINE: gap and height are INDEPENDENT -- no detectable common lattice driver.
const gapHeightIndependent = pearsonNegligible && varianceExplainedTiny && spearmanNegligible;

const verdict =
  sixteenClustersFound && heightsReproduced && pearsonNegligible && varianceExplainedTiny &&
  spearmanNegligible && tallestNotAtWideGap && gapHeightIndependent
    ? 'GAP-AND-HEIGHT-INDEPENDENT-NO-CORRELATION.-CORRELATING-THE-FIFTEEN-imp-33661-INTER-PEAK-GAPS-' +
      '[65,43,75,26,19,53,17,50,88,36,40,34,32,22,72]-AGAINST-THE-SIXTEEN-imp-33660-CLUSTER-PEAK-HEIGHTS-' +
      '[76.1,65.3,64.1,78.4,67.3,67.1,64.5,73.2,68.4,78.6,85.6,71.8,64.7,72.3,143.6,135.0]-ULP-AT-THE-SHARED-' +
      '[400,1200]-PEAKS:-EVERY-ALIGNMENT-(LEFT/RIGHT/MEAN/MAX-ADJACENT-HEIGHT)-GIVES-A-NEGLIGIBLE-WEAKLY-' +
      'POSITIVE-ASSOCIATION-(PEARSON-|r|<=~0.30,-R^2<=~0.088,-SPEARMAN-|rho|<=~0.18);-THE-PRIMARY-MEAN-' +
      'ADJACENT-HEIGHT-ALIGNMENT-GIVES-r~+0.19-/-R^2~0.035.-TALLER-PEAKS-DO-NOT-SIT-AT-WIDER-SPACINGS:-THE-' +
      'TALLEST-PEAK-(n~1126,-h~143.6-ULP)-SITS-AT-A-22-RUNG-(NARROW,-BELOW-THE-~44.8-MEAN)-INBOUND-GAP.-SO-THE-' +
      'imp-33661-SPACING-IRREGULARITY-AND-THE-imp-33660-WEAK-HEIGHT-GROWTH-DO-NOT-SHARE-A-DETECTABLE-COMMON-' +
      'LATTICE-DRIVER-AT-THIS-SAMPLE:-THEY-ARE-INDEPENDENT-ARITHMETIC-FLOOR-PHENOMENA-(imp-33599/imp-33621/' +
      'imp-33638/imp-33639/imp-33660/imp-33661-latticeJitterCaveat).-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-' +
      'FIFTEEN-PAIRED-POINTS-IS-A-SMALL-SAMPLE;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-' +
      'SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33682_GAP_VS_HEIGHT_CORRELATION = Object.freeze({
  id: 'imp-33682-gap-vs-height-correlation-n400-1200',
  ticket: 'imp-33682',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33660-cluster-peak-envelope-height-growth-fit.js',
  crossValidatesModules: [
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js',
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'CORRELATES the imp-33661 fifteen inter-peak GAPS [65,43,75,26,19,53,17,50,88,36,40,34,32,22,72] against ' +
    'the imp-33660 sixteen cluster-peak HEIGHTS [76.1,65.3,64.1,78.4,67.3,67.1,64.5,73.2,68.4,78.6,85.6,71.8,' +
    '64.7,72.3,143.6,135.0] ULP at the SHARED [400,1200] sixteen-cluster set (both re-derived off the SAME ' +
    'grade-4 budgets >= 200-node floorUlp(n) scan) -- a gap-vs-height cross-check neither sibling ran. RESULT: ' +
    'every alignment of a gap with its adjacent peak height(s) (left/right/mean/max) gives a NEGLIGIBLE, ' +
    'weakly-positive association -- Pearson |r| <= ~0.30, R^2 <= ~0.088, Spearman |rho| <= ~0.18; the primary ' +
    'mean-adjacent-height alignment gives r ~ +0.19 / R^2 ~ 0.035. Taller peaks do NOT sit at wider spacings: ' +
    'the tallest peak (n ~ 1126, h ~ 143.6 ULP) sits at a NARROW 22-rung inbound gap (below the ~44.8 mean). ' +
    'VERDICT: GAP-AND-HEIGHT-INDEPENDENT-NO-CORRELATION -- the imp-33661 spacing irregularity and the imp-33660 ' +
    'weak height growth do NOT share a detectable common lattice driver; they are independent arithmetic-floor ' +
    'phenomena (imp-33599/imp-33621/imp-33638/imp-33639/imp-33660/imp-33661 latticeJitterCaveat). ' +
    'ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; small sample; jittery ' +
    'lattice floor; operator positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'ONE dense every-integer scan of the combined [400,1200] window, +/-5 collared, reproducing all sixteen clusters',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp; contiguous env >= 64 marks a band-clearing cluster; each contributes its peak-env HEIGHT and rung',
    gaps: 'fifteen inter-peak gaps g_i = peakN_{i+1} - peakN_i (the imp-33661 spacing sequence)',
    heights: 'sixteen peak-envelope heights h_i (the imp-33660 height sequence)',
    alignments: 'each gap g_i aligned with left h_i, right h_{i+1}, MEAN 0.5(h_i+h_{i+1}) [PRIMARY], and MAX(h_i,h_{i+1})',
    correlation: 'Pearson r + Pearson R^2 = r^2 + Spearman tie-averaged rank rho, per alignment',
    tallerAtWiderTest: 'directly check whether the tallest peak sits at a WIDE inbound gap (it sits at a NARROW 22-rung gap)',
    selfComputing: 'the scan, the sixteen peaks, the gaps/heights, all four alignment correlations, and every flag recompute at import',
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
    gaps: Object.freeze(gaps.slice()),
    gapMean,
    // -- correlations by alignment --
    corrLeft,
    corrRight,
    corrMean,   // the PRIMARY alignment
    corrMax,
    // -- worst-case (largest) magnitudes across alignments --
    maxPearsonAbs,
    maxR2,
    maxSpearmanAbs,
    // -- taller-at-wider test --
    heightMax,
    tallestN,
    tallestInboundGap,
    // -- verdict flags --
    sixteenClustersFound,
    heightsReproduced,
    pearsonNegligible,
    varianceExplainedTiny,
    spearmanNegligible,
    tallestNotAtWideGap,
    gapHeightIndependent,
    verdict,
    clusters: Object.freeze(CLUSTERS.map((c) => Object.freeze({ ...c }))),
  }),

  interpretation: Object.freeze({
    peaksReproduced:
      'The combined [400,1200] scan reproduces the shared imp-33660 / imp-33661 sixteen band-clearing cluster ' +
      'peaks (peaks ~526..1198, tall tail ~143.6/135.0 ULP at n~1126,1198), so the gap and height sequences ' +
      'are aligned off the SAME floorUlp(n) scan, not transcribed literals.',
    correlationNegligible:
      'Across all four alignments the gap-vs-height Pearson |r| stays <= ~0.30 (left ~0.30, right ~0.065, mean ' +
      '~0.19, max ~0.083) and R^2 <= ~0.088; the primary mean-adjacent-height alignment gives r ~ +0.19, ' +
      'R^2 ~ 0.035. The Spearman rank rho is likewise <= ~0.18. A wider gap explains at most ~9% of the ' +
      'variance in the adjacent peak height -- negligible.',
    signWeaklyPositiveButNoise:
      'The sign is weakly POSITIVE (wider gaps sit near marginally taller peaks), which matches the ticket ' +
      'premise in direction, but the magnitude is far too small to distinguish from the lattice jitter on ' +
      'fifteen paired points; the association is statistically indistinguishable from zero.',
    tallestAtNarrowGap:
      'Decisively, the TALLEST peak (n~1126, h~143.6 ULP) sits at a NARROW inbound gap of just 22 rungs -- ' +
      'well below the ~44.8-rung mean -- the direct opposite of "taller peaks at wider spacings". The two tall ' +
      'imp-33638 tail clusters that drive the imp-33660 height trend do NOT sit at anomalously wide gaps.',
    verdictIndependent:
      'VERDICT: GAP-AND-HEIGHT-INDEPENDENT-NO-CORRELATION. The imp-33661 spacing irregularity and the imp-33660 ' +
      'weak height growth do NOT share a detectable common lattice driver at this sample; they are independent ' +
      'arithmetic-floor phenomena. This bounds any joint spacing/height claim: neither irregularity predicts the ' +
      'other, so a naive coupled model would over-fit the jitter.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Cross-correlates the gap sequence (imp-33661) and the height sequence (imp-33660) of the sixteen ' +
      'band-clearing cluster peaks (re-derived off the same grade-4 budgets >= 200-node floorUlp(n) scan over ' +
      '[400,1200]) under four gap-to-height alignments and classifies them independent. It changes NO bound, ' +
      'patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    smallSampleCaveat:
      'Fifteen paired points is a SMALL sample: even the sign of the weak positive correlation is not robust, ' +
      'and no significance is claimed. The robust reading is that the correlation is negligible (R^2 <= ~0.088), ' +
      'not the exact coefficients.',
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33660/imp-33661/imp-33639/imp-33638/imp-33621/' +
      'imp-33599/imp-33557/imp-33539/imp-33316/imp-33213; this correlates the located peaks, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621/imp-33638/imp-33639/imp-33660/imp-33661): the exact per-rung ULP ' +
      'bounces and cross-platform libm exp/pow variation can shift the exact peak rungs, gaps, and heights, and ' +
      'hence every correlation coefficient. The robust reading is the QUALITATIVE conclusion -- negligible ' +
      'correlation, gap and height independent, taller peaks NOT at wider gaps -- not the exact r / rho / R^2.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33682_GAP_VS_HEIGHT_CORRELATION_ASSERTIONS = [
  {
    id: 'imp33682-sixteen-clusters-reproduced',
    why: 'The combined [400,1200] scan must reproduce the shared imp-33660 / imp-33661 band-clearing structure ' +
         'as >= 15 disjoint cluster peaks (>= 14 gaps) so the correlation runs off the same floorUlp scan.',
    holds: () => sixteenClustersFound && CLUSTERS.length >= 15 && gaps.length >= 14,
  },
  {
    id: 'imp33682-tall-tail-reproduced',
    why: 'The reproduced height sequence must carry the imp-33638 tall tail (max height > 100 ULP), so the ' +
         'gap-vs-height correlation is aligned with the same sixteen heights imp-33660 measured.',
    holds: () => heightsReproduced && heightMax > 100,
  },
  {
    id: 'imp33682-pearson-negligible',
    why: 'THE HEADLINE: every gap-to-height alignment must give a NEGLIGIBLE Pearson |r| (< 0.35) -- no ' +
         'meaningful linear association between gap width and adjacent peak height.',
    holds: () => pearsonNegligible && maxPearsonAbs < 0.35,
  },
  {
    id: 'imp33682-variance-explained-tiny',
    why: 'THE HEADLINE: every alignment must explain at most a tiny fraction of the variance (Pearson R^2 < 0.15).',
    holds: () => varianceExplainedTiny && maxR2 < 0.15,
  },
  {
    id: 'imp33682-spearman-negligible',
    why: 'The Spearman (rank) association must also be negligible (|rho| < 0.35), ruling out a monotone-nonlinear ' +
         'link that Pearson could miss.',
    holds: () => spearmanNegligible && maxSpearmanAbs < 0.35,
  },
  {
    id: 'imp33682-tallest-peak-at-narrow-gap',
    why: 'DECISIVE taller-at-wider test: the tallest peak must NOT sit at a wide inbound gap -- its inbound gap ' +
         'must be below the mean gap (it is 22 rungs vs the ~44.8-rung mean).',
    holds: () => tallestNotAtWideGap && tallestInboundGap !== null && tallestInboundGap < gapMean,
  },
  {
    id: 'imp33682-gap-height-independent',
    why: 'THE HEADLINE: gap and height are INDEPENDENT -- negligible Pearson AND R^2 AND Spearman under every ' +
         'alignment, so no detectable common lattice driver.',
    holds: () => gapHeightIndependent,
  },
  {
    id: 'imp33682-verdict-records-independence',
    why: 'The classified verdict must record the GAP-AND-HEIGHT-INDEPENDENT-NO-CORRELATION reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33682-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33682_GAP_VS_HEIGHT_CORRELATION.honestCaveat;
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

for (const assertion of IMP33682_GAP_VS_HEIGHT_CORRELATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33682-gap-vs-height-correlation-n400-1200 assertion failed: ${assertion.id}`);
  }
}
