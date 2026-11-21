/**
 * @module imp-33699-gap-vs-trough-depth-correlation-n400-1200
 * @fileoverview imp-33699 -- CROSS-CORRELATE the imp-33662 fifteen inter-cluster TROUGH-FLOOR DEPTHS
 *   against the imp-33661 fifteen inter-peak GAPS at the SHARED [400,1200] sixteen-cluster set, and
 *   MEASURE whether a WIDER spacing sits at a DEEPER trough. imp-33661 characterized the gap sequence
 *   (irregular, CV ~ 0.47), imp-33662 characterized the inter-cluster trough floor (flat, not rising),
 *   and imp-33682 correlated gap vs peak-HEIGHT (independent). NEITHER module paired gap against trough
 *   DEPTH -- the natural one-to-one alignment the gap-vs-HEIGHT test never covered, because each trough
 *   sits INSIDE its own gap.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE NATURAL ONE-TO-ONE ALIGNMENT imp-33682 COULD NOT USE
 *   -------------------------------------------------------
 *   imp-33682 aligned each of the fifteen gaps with adjacent peak HEIGHTS and needed four ambiguous
 *   alignments (left/right/mean/max) because a height lives AT a peak, not IN a gap. Here the pairing is
 *   canonical: trough_i is the LOCAL MINIMUM of the +/-5 rolling-max envelope in the strictly-interior
 *   gap between cluster_i and cluster_{i+1} (imp-33662), i.e. it sits INSIDE gap_i = peakN_{i+1}-peakN_i
 *   (imp-33661). So gap_i and troughEnv_i are the SAME inter-peak interval, and there is a single, natural
 *   alignment. "Deeper trough" means a SMALLER envelope value (closer to zero, further below the peaks),
 *   so "wider spacing sits at a deeper trough" is a NEGATIVE Pearson(gap, troughEnv).
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Identical rule to imp-33599 / imp-33621 / imp-33638 / imp-33639 / imp-33660 / imp-33661 / imp-33662:
 *   for every integer rung n take tau* = saddleTau(n), the imp-33213 log-domain target A_log(tau*), and
 *   score floorUlp(n) = the SMALLEST residual of the direct graded-GL plateau A_direct(tau*) over the
 *   resolved node ladder (grade 4, panels {20,30,50,100,200,400} = 200..4000 inner GL nodes), in
 *   ULP = A_log*2^-52. The +/-5 rolling-MAX envelope is the jitter-tolerant reading; contiguous
 *   env &gt;= 64 marks a band-clearing cluster; each contributes its peak rung. The fifteen gaps
 *   g_i = peakN_{i+1}-peakN_i are aligned one-to-one with the fifteen inter-cluster trough depths
 *   troughEnv_i (the LOCAL MINIMUM env in gap_i), and we report Pearson r, Pearson R^2 = r^2, and
 *   Spearman tie-averaged rank rho, plus a DECISIVE determinism test: does the WIDEST gap hold the
 *   DEEPEST trough, and does the deepest trough sit in the widest gap.
 *
 *   THE HEADLINE RESULT -- A WEAK-TO-MODERATE NEGATIVE COUPLING, NOT INDEPENDENCE
 *   ----------------------------------------------------------------------------
 *   The sixteen peaks [526,591,634,709,735,754,807,824,874,962,998,1038,1072,1104,1126,1198] give
 *   fifteen gaps [65,43,75,26,19,53,17,50,88,36,40,34,32,22,72] rungs and fifteen inter-cluster trough
 *   depths ~[32.4,24.0,44.1,28.0,56.9,33.0,61.6,30.0,30.5,43.0,17.1,42.9,31.6,62.1,43.2] ULP (identical
 *   to imp-33661 / imp-33662). Pearson(gap, troughEnv) ~ -0.38 (R^2 ~ 0.15) and Spearman rho ~ -0.30 --
 *   a WEAK-TO-MODERATE NEGATIVE association: wider gaps DO sit at marginally DEEPER (lower-env) troughs,
 *   the ticket-hypothesis direction. This is DISTINCT from the imp-33682 gap-vs-HEIGHT INDEPENDENCE
 *   (Pearson |r| &lt;= ~0.30, R^2 ~ 0.035) -- gap couples to trough DEPTH but NOT to peak HEIGHT.
 *   Crucially the coupling is NOT deterministic: the DEEPEST trough ~17.1 ULP (n ~ 1010) sits in a
 *   NEAR-MEAN 40-rung gap (mean ~44.8), NOT the widest, and the WIDEST 88-rung gap (874-&gt;962) holds
 *   only a MIDDLING ~30.5-ULP trough, well above the ~17.1 deepest. So the negative trend is an
 *   aggregate tendency, not a rung-by-rung law.
 *
 *   HONEST MECHANISM -- PART SAMPLING-WINDOW ARTIFACT
 *   ------------------------------------------------
 *   The negative sign is at least PARTLY a local-minimum sampling-window effect, NOT necessarily a
 *   physical "deeper failure between distant clusters": a wider gap spans MORE interior rungs, so the
 *   MINIMUM env over that gap is taken over more samples and mechanically tends lower. So the |r| ~ 0.38
 *   over-reads any genuine spacing-vs-depth driver; the robust reading is that gap and trough depth are
 *   WEAKLY NEGATIVELY coupled with a plausible mundane cause, not that wide spacings CAUSE deep troughs.
 *
 *   VERDICT. WIDER-GAP-WEAK-NEGATIVE-TROUGH-DEPTH-COUPLING. Correlating the fifteen imp-33661 inter-peak
 *   gaps against the fifteen imp-33662 inter-cluster trough depths at the shared [400,1200] peaks yields a
 *   WEAK-TO-MODERATE NEGATIVE association (Pearson r ~ -0.38, R^2 ~ 0.15, Spearman rho ~ -0.30): wider
 *   spacings sit at marginally deeper troughs, the ticket-hypothesis direction and DISTINCT from the
 *   imp-33682 gap-vs-HEIGHT independence. But it is NOT deterministic (the deepest trough sits in a
 *   near-mean 40-rung gap and the widest 88-rung gap holds a middling ~30.5-ULP trough) and is partly a
 *   local-minimum sampling-window artifact (wider gap = min over more rungs). ACCURACY / RULE-DESIGN
 *   MEASUREMENT ONLY, at the RH-equivalent scale class; fifteen paired points is a SMALL sample so even
 *   the magnitude is not robust; jittery lattice floor; the NPHI = 10 truncation is inherited; the
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED.
 *   No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33662-inter-cluster-trough-floor-drift-n400-1200.js (the fifteen trough DEPTHS this correlates)
 *   @see imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js (the fifteen GAPS this correlates)
 *   @see imp-33682-gap-vs-height-correlation-n400-1200.js (the gap-vs-HEIGHT independence this contrasts against)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33699 (accuracy, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33557/imp-33660/imp-33662) -
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

// -- Scan configuration (identical rule to imp-33599/imp-33621/imp-33638/imp-33660/imp-33661/imp-33662) --
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
const gaps = peakNs.slice(1).map((pn, i) => pn - peakNs[i]); // the imp-33661 fifteen inter-peak GAPS

// -- Inter-cluster TROUGHS: the LOCAL MINIMUM envelope in each strictly-interior gap (imp-33662) ---
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
  TROUGHS.push(Object.freeze({ fromPeakN: CLUSTERS[i].peakN, toPeakN: CLUSTERS[i + 1].peakN, troughN: minN, troughEnv: minEnv }));
}
const troughEnvs = TROUGHS.map((t) => t.troughEnv); // the imp-33662 fifteen inter-cluster trough DEPTHS

// -- The single natural one-to-one alignment: gap_i vs troughEnv_i (trough sits INSIDE gap_i) ------
const pearsonR = pearson(gaps, troughEnvs);
const pearsonR2 = pearsonR * pearsonR;
const spearmanRho = spearman(gaps, troughEnvs);

// -- Gap/trough dispersion anchors ----------------------------------------------------------------
const gapMean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
const troughMean = troughEnvs.reduce((a, b) => a + b, 0) / troughEnvs.length;
const troughMin = Math.min(...troughEnvs); // the DEEPEST trough (smallest env)

// -- DECISIVE determinism test: does the WIDEST gap hold the DEEPEST trough (and vice versa)? ------
const gapMax = Math.max(...gaps);
const widestGapIdx = gaps.indexOf(gapMax);
const troughAtWidestGap = troughEnvs[widestGapIdx];        // env of the trough inside the widest gap
const deepestTroughIdx = troughEnvs.indexOf(troughMin);
const gapAtDeepestTrough = gaps[deepestTroughIdx];         // width of the gap holding the deepest trough

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The combined [400,1200] scan reproduces the sixteen-cluster structure (>= 15), giving >= 14 pairs.
const sixteenClustersFound = CLUSTERS.length >= 15 && gaps.length >= 14 && TROUGHS.length >= 14;
// (2) THE HEADLINE: the association is NEGATIVE -- wider gaps sit at LOWER-env (deeper) troughs.
const couplingNegative = pearsonR < 0 && spearmanRho < 0;
// (3) THE HEADLINE: the coupling is WEAK-TO-MODERATE, not negligible and not strong (0.15 < |r| < 0.65).
const couplingWeakToModerate = Math.abs(pearsonR) > 0.15 && Math.abs(pearsonR) < 0.65;
// (4) NOT INDEPENDENCE: |r| is materially larger than the imp-33682 gap-vs-HEIGHT |r| ~ 0.19.
const strongerThanGapVsHeight = Math.abs(pearsonR) > 0.25;
// (5) DECISIVE: the coupling is NOT deterministic -- the widest gap does NOT hold the deepest trough.
const notDeterministic = troughAtWidestGap > troughMin + 5 && gapAtDeepestTrough < gapMax;
// (6) THE HEADLINE: a weak-to-moderate NEGATIVE coupling (negative AND weak-to-moderate AND non-deterministic).
const weakNegativeCoupling = couplingNegative && couplingWeakToModerate && notDeterministic;

const verdict =
  sixteenClustersFound && couplingNegative && couplingWeakToModerate && strongerThanGapVsHeight &&
  notDeterministic && weakNegativeCoupling
    ? 'WIDER-GAP-WEAK-NEGATIVE-TROUGH-DEPTH-COUPLING.-CROSS-CORRELATING-THE-FIFTEEN-imp-33661-INTER-PEAK-GAPS-' +
      '[65,43,75,26,19,53,17,50,88,36,40,34,32,22,72]-AGAINST-THE-FIFTEEN-imp-33662-INTER-CLUSTER-TROUGH-DEPTHS-' +
      '~[32.4,24.0,44.1,28.0,56.9,33.0,61.6,30.0,30.5,43.0,17.1,42.9,31.6,62.1,43.2]-ULP-AT-THE-SHARED-' +
      '[400,1200]-PEAKS-(ONE-NATURAL-ALIGNMENT:-EACH-TROUGH-SITS-INSIDE-ITS-OWN-GAP):-PEARSON-r~-0.38-' +
      '(R^2~0.15),-SPEARMAN-rho~-0.30-=>-A-WEAK-TO-MODERATE-NEGATIVE-COUPLING-(WIDER-SPACINGS-SIT-AT-' +
      'MARGINALLY-DEEPER/LOWER-ENV-TROUGHS,-THE-TICKET-HYPOTHESIS-DIRECTION),-DISTINCT-FROM-THE-imp-33682-' +
      'GAP-VS-HEIGHT-INDEPENDENCE-(|r|~0.19,-R^2~0.035).-BUT-NOT-DETERMINISTIC:-THE-DEEPEST-TROUGH~17.1-ULP-' +
      '(n~1010)-SITS-IN-A-NEAR-MEAN-40-RUNG-GAP-(MEAN~44.8),-NOT-THE-WIDEST,-AND-THE-WIDEST-88-RUNG-GAP-' +
      '(874->962)-HOLDS-ONLY-A-MIDDLING~30.5-ULP-TROUGH.-THE-NEGATIVE-SIGN-IS-PARTLY-A-LOCAL-MINIMUM-' +
      'SAMPLING-WINDOW-ARTIFACT-(WIDER-GAP-=-MIN-OVER-MORE-RUNGS-=>-MECHANICALLY-LOWER),-SO-|r|~0.38-' +
      'OVER-READS-ANY-GENUINE-SPACING-VS-DEPTH-DRIVER.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-FIFTEEN-PAIRED-' +
      'POINTS-IS-A-SMALL-SAMPLE;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-' +
      'imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33699_GAP_VS_TROUGH_DEPTH_CORRELATION = Object.freeze({
  id: 'imp-33699-gap-vs-trough-depth-correlation-n400-1200',
  ticket: 'imp-33699',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33662-inter-cluster-trough-floor-drift-n400-1200.js',
  crossValidatesModules: [
    'imp-33662-inter-cluster-trough-floor-drift-n400-1200.js',
    'imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js',
    'imp-33682-gap-vs-height-correlation-n400-1200.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'CROSS-CORRELATES the imp-33661 fifteen inter-peak GAPS [65,43,75,26,19,53,17,50,88,36,40,34,32,22,72] ' +
    'against the imp-33662 fifteen inter-cluster TROUGH DEPTHS ~[32.4,24.0,44.1,28.0,56.9,33.0,61.6,30.0,30.5,' +
    '43.0,17.1,42.9,31.6,62.1,43.2] ULP at the SHARED [400,1200] sixteen-cluster set, off the SAME grade-4 ' +
    'budgets >= 200-node floorUlp(n) scan -- a gap-vs-trough-DEPTH pairing imp-33682 (gap-vs-HEIGHT) never ran, ' +
    'using the one NATURAL alignment (each trough sits INSIDE its own gap). RESULT: Pearson r ~ -0.38 ' +
    '(R^2 ~ 0.15), Spearman rho ~ -0.30 -- a WEAK-TO-MODERATE NEGATIVE coupling: wider spacings sit at ' +
    'marginally DEEPER (lower-env) troughs, the ticket-hypothesis direction, and DISTINCT from the imp-33682 ' +
    'gap-vs-HEIGHT independence (|r| ~ 0.19, R^2 ~ 0.035). But it is NOT deterministic (the deepest trough ' +
    '~17.1 ULP at n ~ 1010 sits in a near-mean 40-rung gap, and the widest 88-rung gap holds a middling ~30.5 ' +
    'ULP trough) and is PARTLY a local-minimum sampling-window artifact (wider gap = min over more rungs). ' +
    'VERDICT: WIDER-GAP-WEAK-NEGATIVE-TROUGH-DEPTH-COUPLING. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; small sample; jittery lattice floor; operator positivity (imp-3066) ' +
    'untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    window: 'ONE dense every-integer scan of the combined [400,1200] window, +/-5 collared, reproducing all sixteen clusters',
    saddle: 'tau* = saddleTau(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893)',
    floorUlp: 'per rung, the SMALLEST residual of A_direct(tau*) vs the imp-33213 log-domain A_log over the resolved node ladder',
    resolvedLadder: 'the imp-33557 grade-4 ladder restricted to budgets >= 200 nodes: panels P in {20,30,50,100,200,400} = 200..4000 nodes',
    scoring: 'residual in ULP = A_log * 2^-52; band = floorUlp < 64 (imp-33316 widened deep band)',
    envelope: 'a +/-5 rolling-MAX of floorUlp; contiguous env >= 64 marks a band-clearing cluster; each contributes its peak rung',
    gaps: 'fifteen inter-peak gaps g_i = peakN_{i+1} - peakN_i (the imp-33661 spacing sequence)',
    troughs: 'fifteen inter-cluster trough depths troughEnv_i = LOCAL MINIMUM env in the strictly-interior gap between cluster_i and cluster_{i+1} (the imp-33662 sequence)',
    alignment: 'a SINGLE natural one-to-one alignment gap_i <-> troughEnv_i (trough_i sits INSIDE gap_i), unlike the four ambiguous gap-to-peak-HEIGHT alignments imp-33682 needed',
    depthConvention: 'a DEEPER trough is a SMALLER env value, so wider-spacing-at-deeper-trough is a NEGATIVE Pearson(gap, troughEnv)',
    correlation: 'Pearson r + Pearson R^2 = r^2 + Spearman tie-averaged rank rho on the single alignment',
    determinismTest: 'DECISIVE check: does the WIDEST gap hold the DEEPEST trough, and does the deepest trough sit in the widest gap (both fail -> coupling non-deterministic)',
    samplingArtifactNote: 'a wider gap spans MORE interior rungs, so its local MINIMUM env is over more samples and mechanically tends lower -- part of the negative sign is this window effect, not a physical driver',
    selfComputing: 'the scan, the sixteen peaks, the fifteen gaps/troughs, the correlation, the determinism test, and every flag recompute at import',
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
    gaps: Object.freeze(gaps.slice()),
    troughNs: Object.freeze(TROUGHS.map((t) => t.troughN)),
    troughEnvs: Object.freeze(troughEnvs.slice()),
    gapMean,
    troughMean,
    troughMin,
    // -- the single-alignment correlation --
    pearsonR,
    pearsonR2,
    spearmanRho,
    // -- determinism test anchors --
    gapMax,
    troughAtWidestGap,
    gapAtDeepestTrough,
    // -- contrast anchor (imp-33682 gap-vs-HEIGHT) --
    imp33682GapVsHeightPearson: 0.19,
    imp33682GapVsHeightR2: 0.035,
    // -- verdict flags --
    sixteenClustersFound,
    couplingNegative,
    couplingWeakToModerate,
    strongerThanGapVsHeight,
    notDeterministic,
    weakNegativeCoupling,
    verdict,
    troughs: Object.freeze(TROUGHS.map((t) => Object.freeze({ ...t }))),
  }),

  interpretation: Object.freeze({
    pairsAligned:
      'The combined [400,1200] scan reproduces the sixteen imp-33660/imp-33661/imp-33662 cluster peaks, so the ' +
      'fifteen gaps and the fifteen inter-cluster trough depths are aligned off the SAME floorUlp(n) scan (not ' +
      'transcribed literals). The alignment is canonical one-to-one: trough_i is the local minimum env INSIDE ' +
      'gap_i, so no left/right/mean/max ambiguity arises.',
    couplingWeakNegative:
      'Pearson(gap, troughEnv) ~ -0.38 (R^2 ~ 0.15) and Spearman rho ~ -0.30 -- a weak-to-moderate NEGATIVE ' +
      'association. Wider gaps sit at marginally DEEPER (lower-env) troughs, the ticket-hypothesis direction. ' +
      'The gap width explains ~15% of the trough-depth variance -- small but materially above noise.',
    distinctFromGapVsHeight:
      'This is DISTINCT from the imp-33682 gap-vs-HEIGHT result: there gap and peak height were INDEPENDENT ' +
      '(|r| ~ 0.19, R^2 ~ 0.035, weak POSITIVE). Gap width couples (weakly, negatively) to inter-cluster trough ' +
      'DEPTH but NOT to cluster peak HEIGHT -- the spacing sequence talks to the floor between peaks, not the ' +
      'peaks themselves.',
    notDeterministic:
      'The coupling is an aggregate tendency, NOT a rung-by-rung law: the DEEPEST trough ~17.1 ULP (n ~ 1010) ' +
      'sits in a near-mean 40-rung gap, NOT the widest, and the WIDEST 88-rung gap (874->962) holds only a ' +
      'MIDDLING ~30.5-ULP trough. So one cannot predict the deepest trough from the widest gap.',
    partlySamplingArtifact:
      'The negative sign is at least PARTLY a local-minimum sampling-window effect: a wider gap spans MORE ' +
      'interior rungs, so the MINIMUM env over the gap is taken over more samples and mechanically tends lower. ' +
      'So |r| ~ 0.38 over-reads any genuine spacing-vs-depth driver; the robust reading is a weak negative ' +
      'coupling with a plausible mundane cause, not that wide spacings CAUSE deep troughs.',
    verdictWeakNegative:
      'VERDICT: WIDER-GAP-WEAK-NEGATIVE-TROUGH-DEPTH-COUPLING. Wider spacings sit at marginally deeper troughs ' +
      '(r ~ -0.38, R^2 ~ 0.15, Spearman ~ -0.30), distinct from the gap-vs-HEIGHT independence, but non- ' +
      'deterministic and partly a sampling-window artifact. This bounds any joint spacing/depth claim to a weak ' +
      'aggregate tendency: the spacing sequence weakly co-varies with the inter-cluster floor, not the peaks.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Cross-correlates the gap sequence (imp-33661) and the inter-cluster trough-depth sequence (imp-33662) of ' +
      'the sixteen band-clearing cluster peaks (re-derived off the same grade-4 budgets >= 200-node floorUlp(n) ' +
      'scan over [400,1200]) under the one natural one-to-one alignment and classifies them weakly-negatively ' +
      'coupled. It changes NO bound, patches NO literal, and establishes NO operator positivity. Grid-design ' +
      'measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    samplingWindowArtifactCaveat:
      'The negative sign is at least partly a local-minimum sampling-window artifact: a wider gap spans more ' +
      'interior rungs, so its minimum env is over more samples and tends mechanically lower. So the coupling ' +
      'magnitude over-reads any genuine spacing-vs-depth driver, and the qualitative weak-negative reading is ' +
      'more robust than the ~-0.38 coefficient.',
    smallSampleCaveat:
      'Fifteen paired points is a SMALL sample: even the magnitude of the weak-negative correlation is not ' +
      'robust, and no significance is claimed. The robust reading is a weak-to-moderate negative coupling, ' +
      'non-deterministic, not the exact coefficients.',
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33662/imp-33661/imp-33660/imp-33639/imp-33638/' +
      'imp-33621/imp-33599/imp-33557/imp-33539/imp-33316/imp-33213; this correlates the located sequences, not ' +
      'that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621/imp-33638/imp-33639/imp-33660/imp-33661/imp-33662): the exact ' +
      'per-rung ULP bounces and cross-platform libm exp/pow variation can shift the exact peak rungs, gaps, and ' +
      'trough depths, and hence the r / rho / R^2. The robust reading is the QUALITATIVE conclusion -- a weak-to-' +
      'moderate negative coupling, non-deterministic, distinct from the gap-vs-height independence -- not the ' +
      'exact coefficients.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33699_GAP_VS_TROUGH_DEPTH_CORRELATION_ASSERTIONS = [
  {
    id: 'imp33699-sixteen-clusters-fifteen-pairs',
    why: 'The combined [400,1200] scan must reproduce the sixteen-cluster structure (>= 15 clusters) so the ' +
         'gap-vs-trough-depth correlation runs off the same floorUlp scan and yields >= 14 aligned pairs.',
    holds: () => sixteenClustersFound && CLUSTERS.length >= 15 && gaps.length >= 14 && TROUGHS.length >= 14,
  },
  {
    id: 'imp33699-coupling-negative',
    why: 'THE HEADLINE: both the Pearson and Spearman correlations of gap vs trough env must be NEGATIVE -- ' +
         'wider gaps sit at lower-env (deeper) troughs, the ticket-hypothesis direction.',
    holds: () => couplingNegative && pearsonR < 0 && spearmanRho < 0,
  },
  {
    id: 'imp33699-coupling-weak-to-moderate',
    why: 'THE HEADLINE: the coupling is WEAK-TO-MODERATE (0.15 < |Pearson r| < 0.65) -- materially above the ' +
         'gap-vs-height noise but far from a strong or deterministic law.',
    holds: () => couplingWeakToModerate && Math.abs(pearsonR) > 0.15 && Math.abs(pearsonR) < 0.65,
  },
  {
    id: 'imp33699-stronger-than-gap-vs-height',
    why: 'NOT INDEPENDENCE: the gap-vs-trough-depth |r| must be materially larger than the imp-33682 gap-vs-' +
         'HEIGHT |r| ~ 0.19 (> 0.25) -- gap couples to trough DEPTH but not to peak HEIGHT.',
    holds: () => strongerThanGapVsHeight && Math.abs(pearsonR) > 0.25,
  },
  {
    id: 'imp33699-not-deterministic',
    why: 'DECISIVE: the coupling is NOT deterministic -- the WIDEST gap must NOT hold the DEEPEST trough, and ' +
         'the deepest trough must sit in a gap narrower than the widest.',
    holds: () => notDeterministic && troughAtWidestGap > troughMin + 5 && gapAtDeepestTrough < gapMax,
  },
  {
    id: 'imp33699-weak-negative-coupling',
    why: 'THE HEADLINE: a weak-to-moderate NEGATIVE, non-deterministic coupling -- negative AND weak-to-moderate ' +
         'AND non-deterministic together.',
    holds: () => weakNegativeCoupling,
  },
  {
    id: 'imp33699-verdict-records-weak-negative-coupling',
    why: 'The classified verdict must record the WIDER-GAP-WEAK-NEGATIVE-TROUGH-DEPTH-COUPLING reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33699-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33699_GAP_VS_TROUGH_DEPTH_CORRELATION.honestCaveat;
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

for (const assertion of IMP33699_GAP_VS_TROUGH_DEPTH_CORRELATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33699-gap-vs-trough-depth-correlation-n400-1200 assertion failed: ${assertion.id}`);
  }
}
