/**
 * @module imp-33702-lagged-gap-vs-height-correlation-n400-1200
 * @fileoverview imp-33702 -- Measure a LAGGED (off-by-one-rung) gap-vs-height correlation for the
 *   imp-33661 fifteen inter-peak GAPS against the imp-33660 sixteen cluster-peak HEIGHTS at the shared
 *   [400,1200] sixteen-cluster set, and ASSESS whether the gap at rung n predicts the height at a
 *   NEIGHBORING peak -- a coupling the imp-33682 exact-rung GAP-AND-HEIGHT-INDEPENDENT verdict does NOT
 *   exclude. imp-33682 aligned each gap g_i only with its two BOUNDING peak heights (left h_i, right
 *   h_{i+1}, plus mean/max) and found a negligible, weakly-POSITIVE association (primary mean r ~ +0.19,
 *   R^2 ~ 0.035, Spearman rho ~ +0.18). But imp-33686 showed for the recovery-grade-vs-spike series that a
 *   ONE-RUNG LAG can surface structure the exact-rung reading misses, so this module shifts the height
 *   series by one peak in EACH direction and re-runs the correlation.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33682 LEFT UNMEASURED
 *   ------------------------------
 *   imp-33682 tested only the EXACT-RUNG alignment: a gap g_i (the spacing between peak i and peak i+1)
 *   against the heights of the two peaks it directly separates. It never asked whether a gap predicts the
 *   height of a peak ONE FURTHER along -- i.e. whether wide/narrow spacings are followed (or preceded) by
 *   tall/short peaks a rung away. That off-by-one coupling is exactly the kind of lattice memory imp-33686
 *   found in the grade-vs-spike series. This module reuses the IDENTICAL imp-33682 grade-4 budgets
 *   &gt;=200-node floorUlp(n) scan and the SAME sixteen peaks/gaps/heights, then aligns each gap with the
 *   height of a NON-adjacent peak under two lags:
 *     (LAG_BACK, lag -1)  gap g_i  vs  h_{i-1}   -- the height of the peak just BEFORE the left neighbor
 *                          (valid for i = 1..14, giving fourteen paired points),
 *     (LAG_FWD,  lag +1)  gap g_i  vs  h_{i+2}   -- the height of the peak just AFTER the right neighbor
 *                          (valid for i = 0..13, giving fourteen paired points).
 *   The imp-33682 primary EXACT-rung mean-adjacent-height alignment is recomputed off the same scan as the
 *   lag-0 baseline. For each we report Pearson r, Pearson R^2 = r^2, and Spearman tie-averaged rank rho.
 *
 *   THE HEADLINE RESULT -- A ONE-RUNG LAG REVEALS NO HIDDEN COUPLING
 *   ---------------------------------------------------------------
 *   The sixteen peaks are peakNs [526,591,634,709,735,754,807,824,874,962,998,1038,1072,1104,1126,1198]
 *   with heights [76.1,65.3,64.1,78.4,67.3,67.1,64.5,73.2,68.4,78.6,85.6,71.8,64.7,72.3,143.6,135.0] ULP;
 *   the fifteen gaps are [65,43,75,26,19,53,17,50,88,36,40,34,32,22,72] rungs. The lag-0 EXACT-rung mean
 *   baseline reproduces imp-33682 (Pearson r ~ +0.19, R^2 ~ 0.035, Spearman rho ~ +0.18). Shifting the
 *   height series by one peak does NOT strengthen this: the BACKWARD lag (g_i vs h_{i-1}) gives Pearson
 *   r ~ -0.05 (R^2 ~ 0.003) and Spearman rho ~ +0.07; the FORWARD lag (g_i vs h_{i+2}) gives Pearson
 *   r ~ -0.19 (R^2 ~ 0.038) and Spearman rho ~ +0.05. Both lags keep |Pearson r| &lt;= ~0.20 and R^2
 *   &lt;= ~0.04, and -- decisively -- BOTH lag Spearman |rho| (~0.07, ~0.05) are SMALLER than the exact-rung
 *   |rho| ~0.18, so the rank coupling WEAKENS, not strengthens, under a one-rung shift. The forward-lag
 *   Pearson even FLIPS sign to weakly negative while the exact-rung sign was weakly positive -- a sign
 *   reversal on a ~4%-variance signal is noise, not a coupling. So the gap at rung n carries NO detectable
 *   predictive information about the height of a neighboring peak.
 *
 *   VERDICT. LAGGED-GAP-AND-HEIGHT-STILL-INDEPENDENT-NO-OFF-BY-ONE-COUPLING. Shifting the imp-33660 height
 *   series by one peak in either direction and re-correlating against the imp-33661 gaps leaves the
 *   association negligible under both lags (Pearson |r| &lt;= ~0.20, R^2 &lt;= ~0.04, Spearman |rho|
 *   &lt;= ~0.07); the rank coupling is WEAKER than the imp-33682 exact-rung reading and the Pearson sign
 *   flips, so a one-rung lag reveals NO coupling the exact-rung reading missed. Unlike imp-33686 (where a
 *   lag surfaced grade-vs-spike structure), the gap and height sequences remain INDEPENDENT arithmetic-floor
 *   phenomena at lag +/-1, extending the imp-33682 exact-rung independence to the off-by-one neighborhood.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It cross-correlates the gap
 *   sequence against a one-rung-shifted height sequence and classifies them independent; it changes NO
 *   bound, patches NO literal, and establishes NO operator positivity. floorUlp(n) is a JITTERY
 *   arithmetic-floor lattice property (imp-33249 / imp-33296 / imp-33537 / imp-33557 / imp-33599 /
 *   imp-33621 / imp-33638 / imp-33639 / imp-33660 / imp-33661 / imp-33682 latticeJitterCaveat): the exact
 *   per-rung ULP bounces and cross-platform libm exp/pow variation can shift the exact peak rungs, gaps, and
 *   heights, and hence every correlation coefficient. FOURTEEN paired points per lag is a SMALL sample, so
 *   even the sign is not robust; the robust reading is the QUALITATIVE conclusion -- negligible correlation
 *   at lag +/-1, no off-by-one coupling -- not the exact r / rho / R^2. The NPHI = 10 Phi-series truncation
 *   is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the SOTA.
 *
 *   @see imp-33682-gap-vs-height-correlation-n400-1200.js (the EXACT-rung baseline this lags)
 *   @see imp-33660-cluster-peak-envelope-height-growth-fit.js (the sixteen peak HEIGHTS this lags)
 *   @see imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js (the fifteen GAPS this correlates)
 *   @see imp-33686-lagged-recovery-grade-vs-spike-height.js (the precedent where a one-rung lag mattered)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33702 (accuracy, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33557/imp-33660/imp-33682) -
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

// -- Scan configuration (identical rule to imp-33682/imp-33660/imp-33661; combined [400,1200]) ------
const RESOLVED_PANEL_SWEEP = [20, 30, 50, 100, 200, 400]; // = 200,300,500,1000,2000,4000 nodes
const GRADE = 4;            // the imp-33295/imp-33316/imp-33539/imp-33557/imp-33599/imp-33682 robust rule
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

// -- Compute the combined [400,1200] scan, extract the sixteen cluster peaks (SAME scan as imp-33682) -
const COMBINED_SCAN = scanWindow(COMBINED_LO, COMBINED_HI);
const CLUSTERS = clustersOf(COMBINED_SCAN);
const peakNs = CLUSTERS.map((c) => c.peakN);
const peakHeights = CLUSTERS.map((c) => c.peakEnv);       // the imp-33660 sixteen peak HEIGHTS
const gaps = peakNs.slice(1).map((pn, i) => pn - peakNs[i]); // the imp-33661 fifteen inter-peak GAPS

// -- Correlate a gap subsequence against a height subsequence, returning r / R^2 / rho ------------
function corrOf(xs, ys) {
  const r = pearson(xs, ys);
  return Object.freeze({ n: xs.length, pearsonR: r, pearsonR2: r * r, spearmanRho: spearman(xs, ys) });
}

// -- LAG 0 baseline: the imp-33682 PRIMARY exact-rung mean-adjacent-height alignment ---------------
const exactGaps = gaps.slice();
const exactMeanHeights = gaps.map((g, i) => 0.5 * (peakHeights[i] + peakHeights[i + 1]));
const corrExactMean = corrOf(exactGaps, exactMeanHeights);

// -- LAG -1 (backward): gap g_i vs h_{i-1}, the height of the peak just BEFORE the left neighbor ---
const lagBackGaps = [];
const lagBackHeights = [];
for (let i = 1; i < gaps.length; i += 1) { lagBackGaps.push(gaps[i]); lagBackHeights.push(peakHeights[i - 1]); }
const corrLagBack = corrOf(lagBackGaps, lagBackHeights);

// -- LAG +1 (forward): gap g_i vs h_{i+2}, the height of the peak just AFTER the right neighbor ----
const lagFwdGaps = [];
const lagFwdHeights = [];
for (let i = 0; i < gaps.length - 1; i += 1) { lagFwdGaps.push(gaps[i]); lagFwdHeights.push(peakHeights[i + 2]); }
const corrLagFwd = corrOf(lagFwdGaps, lagFwdHeights);

// -- Discriminants over the two lags --------------------------------------------------------------
const lagPearsonAbs = [corrLagBack, corrLagFwd].map((c) => Math.abs(c.pearsonR));
const lagR2 = [corrLagBack, corrLagFwd].map((c) => c.pearsonR2);
const lagSpearmanAbs = [corrLagBack, corrLagFwd].map((c) => Math.abs(c.spearmanRho));
const maxLagPearsonAbs = Math.max(...lagPearsonAbs);
const maxLagR2 = Math.max(...lagR2);
const maxLagSpearmanAbs = Math.max(...lagSpearmanAbs);
const exactMeanSpearmanAbs = Math.abs(corrExactMean.spearmanRho);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The combined [400,1200] scan reproduces the shared sixteen-cluster structure (>= 15 peaks).
const sixteenClustersFound = CLUSTERS.length >= 15 && gaps.length >= 14;
// (2) The reproduced heights carry the imp-33638 tall tail (max height > 100 ULP).
const heightsReproduced = Math.max(...peakHeights) > 100;
// (3) The lag-0 baseline reproduces imp-33682 (weakly-positive exact-rung mean r in the ~[0.10,0.30] band).
const exactBaselineReproduced = corrExactMean.pearsonR > 0.10 && corrExactMean.pearsonR < 0.30;
// (4) THE HEADLINE: BOTH lags give a NEGLIGIBLE Pearson |r| (< 0.35) -- no off-by-one linear association.
const lagPearsonNegligible = maxLagPearsonAbs < 0.35;
// (5) THE HEADLINE: BOTH lags explain at most a tiny fraction of the variance (R^2 < 0.15).
const lagVarianceExplainedTiny = maxLagR2 < 0.15;
// (6) The lag Spearman (rank) association is also negligible (|rho| < 0.35).
const lagSpearmanNegligible = maxLagSpearmanAbs < 0.35;
// (7) DECISIVE: a one-rung lag does NOT strengthen the rank coupling -- both lag |rho| stay below the
//     imp-33682 exact-rung |rho|, so the shift reveals no hidden coupling (it weakens, not surfaces).
const lagDoesNotStrengthenCoupling = maxLagSpearmanAbs < exactMeanSpearmanAbs;
// (8) THE HEADLINE: gap and height remain INDEPENDENT at lag +/-1 -- no detectable off-by-one driver.
const laggedGapHeightIndependent =
  lagPearsonNegligible && lagVarianceExplainedTiny && lagSpearmanNegligible;

const verdict =
  sixteenClustersFound && heightsReproduced && exactBaselineReproduced && lagPearsonNegligible &&
  lagVarianceExplainedTiny && lagSpearmanNegligible && lagDoesNotStrengthenCoupling &&
  laggedGapHeightIndependent
    ? 'LAGGED-GAP-AND-HEIGHT-STILL-INDEPENDENT-NO-OFF-BY-ONE-COUPLING.-SHIFTING-THE-SIXTEEN-imp-33660-' +
      'CLUSTER-PEAK-HEIGHTS-[76.1,65.3,64.1,78.4,67.3,67.1,64.5,73.2,68.4,78.6,85.6,71.8,64.7,72.3,143.6,' +
      '135.0]-ULP-BY-ONE-PEAK-IN-EACH-DIRECTION-AND-RE-CORRELATING-AGAINST-THE-FIFTEEN-imp-33661-GAPS-' +
      '[65,43,75,26,19,53,17,50,88,36,40,34,32,22,72]-LEAVES-THE-ASSOCIATION-NEGLIGIBLE:-BACKWARD-LAG-' +
      '(g_i-vs-h_{i-1})-PEARSON-r~-0.05/R^2~0.003/SPEARMAN-rho~+0.07,-FORWARD-LAG-(g_i-vs-h_{i+2})-PEARSON-' +
      'r~-0.19/R^2~0.038/SPEARMAN-rho~+0.05-(FOURTEEN-PAIRS-EACH).-BOTH-LAG-|rho|-ARE-SMALLER-THAN-THE-' +
      'imp-33682-EXACT-RUNG-|rho|~0.18-AND-THE-FORWARD-PEARSON-SIGN-FLIPS-TO-WEAKLY-NEGATIVE,-SO-A-ONE-RUNG-' +
      'LAG-REVEALS-NO-COUPLING-THE-EXACT-RUNG-READING-MISSED.-UNLIKE-imp-33686-(WHERE-A-LAG-SURFACED-GRADE-' +
      'VS-SPIKE-STRUCTURE),-THE-GAP-AND-HEIGHT-SEQUENCES-REMAIN-INDEPENDENT-ARITHMETIC-FLOOR-PHENOMENA-AT-' +
      'LAG+/-1.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-FOURTEEN-PAIRED-POINTS-IS-A-SMALL-SAMPLE;-JITTERY-' +
      'LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-' +
      'Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33702_LAGGED_GAP_VS_HEIGHT_CORRELATION = Object.freeze({
  id: 'imp-33702-lagged-gap-vs-height-correlation-n400-1200',
  ticket: 'imp-33702',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33682-gap-vs-height-correlation-n400-1200.js',
  crossValidatesModules: [
    'imp-33682-gap-vs-height-correlation-n400-1200.js',
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js',
    'imp-33686-lagged-recovery-grade-vs-spike-height.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'Measures a LAGGED (off-by-one-rung) gap-vs-height correlation for the imp-33661 fifteen inter-peak GAPS ' +
    '[65,43,75,26,19,53,17,50,88,36,40,34,32,22,72] against the imp-33660 sixteen cluster-peak HEIGHTS ' +
    '[76.1,65.3,64.1,78.4,67.3,67.1,64.5,73.2,68.4,78.6,85.6,71.8,64.7,72.3,143.6,135.0] ULP at the shared ' +
    '[400,1200] sixteen-cluster set (SAME grade-4 budgets >= 200-node floorUlp(n) scan as imp-33682). The ' +
    'imp-33682 exact-rung reading found only a negligible weakly-POSITIVE bounding-peak association (mean r ' +
    '~ +0.19, Spearman rho ~ +0.18); this shifts the height series by one peak in EACH direction and asks ' +
    'whether the gap at rung n predicts a NEIGHBORING peak height. RESULT: the BACKWARD lag (g_i vs h_{i-1}) ' +
    'gives Pearson r ~ -0.05 / R^2 ~ 0.003 / Spearman rho ~ +0.07, the FORWARD lag (g_i vs h_{i+2}) gives ' +
    'Pearson r ~ -0.19 / R^2 ~ 0.038 / Spearman rho ~ +0.05 (fourteen pairs each). BOTH lag |rho| are SMALLER ' +
    'than the exact-rung |rho| and the forward Pearson sign FLIPS, so a one-rung lag reveals NO coupling the ' +
    'exact-rung reading missed. VERDICT: LAGGED-GAP-AND-HEIGHT-STILL-INDEPENDENT-NO-OFF-BY-ONE-COUPLING -- ' +
    'unlike imp-33686, the gap and height sequences stay independent arithmetic-floor phenomena at lag +/-1. ' +
    'ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; small sample; jittery ' +
    'lattice floor; operator positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'ONE dense every-integer scan of the combined [400,1200] window, +/-5 collared, reproducing all sixteen imp-33682 clusters',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp; contiguous env >= 64 marks a band-clearing cluster; each contributes its peak-env HEIGHT and rung',
    gaps: 'fifteen inter-peak gaps g_i = peakN_{i+1} - peakN_i (the imp-33661 spacing sequence)',
    heights: 'sixteen peak-envelope heights h_i (the imp-33660 height sequence)',
    lag0Baseline: 'the imp-33682 PRIMARY exact-rung mean-adjacent-height alignment g_i vs 0.5(h_i+h_{i+1}), recomputed off the same scan',
    lagBack: 'LAG -1 (backward): gap g_i vs h_{i-1}, the height of the peak just BEFORE the left neighbor (fourteen pairs, i=1..14)',
    lagFwd: 'LAG +1 (forward): gap g_i vs h_{i+2}, the height of the peak just AFTER the right neighbor (fourteen pairs, i=0..13)',
    correlation: 'Pearson r + Pearson R^2 = r^2 + Spearman tie-averaged rank rho, per lag',
    couplingTest: 'compare each lag |Spearman rho| against the exact-rung |rho| -- a lag that STRENGTHENS coupling would exceed it (neither does)',
    selfComputing: 'the scan, the sixteen peaks, the gaps/heights, the lag-0 baseline, both lag correlations, and every flag recompute at import',
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
    // -- correlations: lag-0 baseline + the two lags --
    corrExactMean, // the imp-33682 exact-rung mean-adjacent-height baseline (lag 0)
    corrLagBack,   // LAG -1 backward
    corrLagFwd,    // LAG +1 forward
    // -- worst-case (largest) magnitudes across the two lags --
    maxLagPearsonAbs,
    maxLagR2,
    maxLagSpearmanAbs,
    exactMeanSpearmanAbs,
    // -- verdict flags --
    sixteenClustersFound,
    heightsReproduced,
    exactBaselineReproduced,
    lagPearsonNegligible,
    lagVarianceExplainedTiny,
    lagSpearmanNegligible,
    lagDoesNotStrengthenCoupling,
    laggedGapHeightIndependent,
    verdict,
    clusters: Object.freeze(CLUSTERS.map((c) => Object.freeze({ ...c }))),
  }),

  interpretation: Object.freeze({
    peaksReproduced:
      'The combined [400,1200] scan reproduces the shared imp-33682 / imp-33660 / imp-33661 sixteen ' +
      'band-clearing cluster peaks (peaks ~526..1198, tall tail ~143.6/135.0 ULP at n~1126,1198), so the ' +
      'lagged correlation runs off the SAME floorUlp(n) scan, not transcribed literals.',
    lagCorrelationNegligible:
      'Shifting the height series by one peak leaves both lag associations negligible: the backward lag ' +
      '(g_i vs h_{i-1}) gives Pearson r ~ -0.05, R^2 ~ 0.003, Spearman rho ~ +0.07; the forward lag ' +
      '(g_i vs h_{i+2}) gives Pearson r ~ -0.19, R^2 ~ 0.038, Spearman rho ~ +0.05. A one-rung-away gap ' +
      'explains at most ~4% of the variance in a neighboring peak height -- negligible.',
    lagWeakensNotSurfaces:
      'Decisively, BOTH lag Spearman |rho| (~0.07, ~0.05) are SMALLER than the imp-33682 exact-rung |rho| ~0.18, ' +
      'and the forward-lag Pearson sign FLIPS from weakly positive (exact-rung +0.19) to weakly negative ' +
      '(-0.19). A one-rung shift therefore WEAKENS the rank coupling rather than surfacing hidden structure -- ' +
      'the opposite of the imp-33686 grade-vs-spike case where a lag mattered.',
    verdictIndependentAtLag:
      'VERDICT: LAGGED-GAP-AND-HEIGHT-STILL-INDEPENDENT-NO-OFF-BY-ONE-COUPLING. The gap at rung n carries no ' +
      'detectable predictive information about the height of a neighboring peak, extending the imp-33682 ' +
      'exact-rung independence to the off-by-one neighborhood. This bounds any lagged spacing/height claim: ' +
      'neither the immediate nor the one-away peak height is predicted by the gap, so a coupled model at ' +
      'lag +/-1 would over-fit the jitter.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Cross-correlates the imp-33661 gap sequence against a ONE-PEAK-SHIFTED imp-33660 height sequence (both ' +
      're-derived off the same grade-4 budgets >= 200-node floorUlp(n) scan over [400,1200]) under a backward ' +
      'and a forward lag, plus the imp-33682 exact-rung baseline, and classifies them independent at lag +/-1. ' +
      'It changes NO bound, patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    smallSampleCaveat:
      'Fourteen paired points per lag is a SMALL sample: even the sign of the weak correlation is not robust, ' +
      'and no significance is claimed. The robust reading is that the lagged correlation is negligible ' +
      '(R^2 <= ~0.04) and does not exceed the exact-rung reading, not the exact coefficients.',
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33682/imp-33660/imp-33661/imp-33639/imp-33638/' +
      'imp-33621/imp-33599/imp-33557/imp-33539/imp-33316/imp-33213; this lags the located peaks, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33296/imp-33537/imp-33557/' +
      'imp-33599/imp-33621/imp-33638/imp-33639/imp-33660/imp-33661/imp-33682): the exact per-rung ULP bounces ' +
      'and cross-platform libm exp/pow variation can shift the exact peak rungs, gaps, and heights, and hence ' +
      'every lagged correlation coefficient. The robust reading is the QUALITATIVE conclusion -- negligible ' +
      'correlation at lag +/-1, no off-by-one coupling -- not the exact r / rho / R^2.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33702_LAGGED_GAP_VS_HEIGHT_CORRELATION_ASSERTIONS = [
  {
    id: 'imp33702-sixteen-clusters-reproduced',
    why: 'The combined [400,1200] scan must reproduce the shared imp-33682 / imp-33660 / imp-33661 ' +
         'band-clearing structure as >= 15 disjoint cluster peaks (>= 14 gaps) so the lag runs off the same scan.',
    holds: () => sixteenClustersFound && CLUSTERS.length >= 15 && gaps.length >= 14,
  },
  {
    id: 'imp33702-tall-tail-reproduced',
    why: 'The reproduced height sequence must carry the imp-33638 tall tail (max height > 100 ULP), so the ' +
         'lagged correlation is aligned with the same sixteen heights imp-33660 measured.',
    holds: () => heightsReproduced && Math.max(...peakHeights) > 100,
  },
  {
    id: 'imp33702-exact-baseline-reproduces-imp33682',
    why: 'The lag-0 baseline must reproduce the imp-33682 weakly-positive exact-rung mean-adjacent-height ' +
         'reading (Pearson r in ~[0.10,0.30]), confirming the same scan underlies the lags.',
    holds: () => exactBaselineReproduced && corrExactMean.pearsonR > 0.10 && corrExactMean.pearsonR < 0.30,
  },
  {
    id: 'imp33702-lag-pearson-negligible',
    why: 'THE HEADLINE: BOTH the backward and forward lags must give a NEGLIGIBLE Pearson |r| (< 0.35) -- no ' +
         'off-by-one linear association between gap width and a neighboring peak height.',
    holds: () => lagPearsonNegligible && maxLagPearsonAbs < 0.35,
  },
  {
    id: 'imp33702-lag-variance-explained-tiny',
    why: 'THE HEADLINE: both lags must explain at most a tiny fraction of the variance (Pearson R^2 < 0.15).',
    holds: () => lagVarianceExplainedTiny && maxLagR2 < 0.15,
  },
  {
    id: 'imp33702-lag-spearman-negligible',
    why: 'The lag Spearman (rank) association must also be negligible (|rho| < 0.35), ruling out a ' +
         'monotone-nonlinear off-by-one link that Pearson could miss.',
    holds: () => lagSpearmanNegligible && maxLagSpearmanAbs < 0.35,
  },
  {
    id: 'imp33702-lag-does-not-strengthen-coupling',
    why: 'DECISIVE off-by-one test: neither lag may STRENGTHEN the coupling -- both lag |Spearman rho| must ' +
         'stay BELOW the imp-33682 exact-rung |rho|, so the shift reveals no hidden coupling.',
    holds: () => lagDoesNotStrengthenCoupling && maxLagSpearmanAbs < exactMeanSpearmanAbs,
  },
  {
    id: 'imp33702-lagged-gap-height-independent',
    why: 'THE HEADLINE: gap and height remain INDEPENDENT at lag +/-1 -- negligible Pearson AND R^2 AND ' +
         'Spearman under both lags, so no detectable off-by-one lattice driver.',
    holds: () => laggedGapHeightIndependent,
  },
  {
    id: 'imp33702-verdict-records-lagged-independence',
    why: 'The classified verdict must record the LAGGED-GAP-AND-HEIGHT-STILL-INDEPENDENT reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33702-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33702_LAGGED_GAP_VS_HEIGHT_CORRELATION.honestCaveat;
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

for (const assertion of IMP33702_LAGGED_GAP_VS_HEIGHT_CORRELATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33702-lagged-gap-vs-height-correlation-n400-1200 assertion failed: ${assertion.id}`);
  }
}
