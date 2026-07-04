/**
 * @module imp-33686-lagged-recovery-grade-vs-spike-height
 * @fileoverview imp-33686 -- MEASURE a LAGGED (off-by-one-rung) recovery-grade-vs-spike-height correlation on the
 *   imp-33663 SIXTEEN-cluster [400,1200] sample, and ASSESS whether spike height at cluster peak n predicts the
 *   recovery grade at a NEIGHBORING cluster peak -- a cross-rung correlation the imp-33663 EXACT-RUNG-TAUTOLOGY
 *   verdict (grade and height read at the SAME rung) did not exclude.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33663 LEFT ON THE TABLE
 *   --------------------------------
 *   imp-33663 (verdict EXACT-RUNG-TAUTOLOGY-PERSISTS-ENVELOPE-STILL-FAILS-ON-SIXTEEN-PEAKS) found the recovery-grade
 *   vs spike-height correlation is an EXACT-rung tautology: at lag 0 (grade and height read at the SAME cluster peak)
 *   the cluster-ENVELOPE reading A does not predict the grade (Pearson r ~ +0.06) while only the EXACT-rung reading B
 *   tracks it (r ~ +0.63), and it does so tautologically -- the lone grade-5 rung n = 998 is exactly the unique rung
 *   whose grade-4 exact-rung floor pokes above 64. That framing says NOTHING about cross-rung LEAD/LAG: it never
 *   asked whether the spike height at one cluster peak predicts the recovery grade at a NEIGHBORING peak. This module
 *   recomputes the identical imp-33663 sixteen-rung series and correlates the grade against each spike-height reading
 *   SHIFTED by +/-1 and +/-2 cluster-peak indices, testing for genuine off-diagonal predictive structure.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   At each of the sixteen imp-33621/imp-33638 band-clearing cluster peaks n in {526,591,634,709,735,754,807,824,
 *   874,962,998,1038,1072,1104,1126,1198} recompute (verbatim from imp-33663): the RECOVERY GRADE (lowest g in
 *   {4,5,6,8} whose graded-GL floor at budgets &gt;= 200 nodes enters the imp-33316 &lt; 64 ULP band, tau* =
 *   saddleTau(n), imp-33213 A_log target); reading B, the grade-4 floorUlp at the EXACT rung; reading A, the
 *   imp-33599/imp-33621 +/-5 rolling-max ENVELOPE of grade-4 floorUlp over [n-5, n+5]. Then form the LAGGED Pearson
 *   correlation r(lag) = corr( grade[i], height[i + lag] ) over the overlapping window (16 - |lag| pairs), for
 *   lag in {-2,-1,0,+1,+2}, against BOTH the envelope reading A and the exact-rung reading B. lag = 0 reproduces
 *   the imp-33663 same-rung correlation; lag = +/-1, +/-2 are the neighboring-rung predictions imp-33663 did not run.
 *
 *   MEASURED (lagged Pearson r; grade vs height shifted by lag cluster-peak indices):
 *
 *        lag    envelope reading A       exact-rung reading B
 *        -2     ~ -0.123                 ~ -0.065
 *        -1     ~ +0.036                 ~ -0.108
 *         0     ~ +0.065  (imp-33663)    ~ +0.629  (imp-33663 tautology)
 *        +1     ~ -0.091                 ~ -0.149
 *        +2     ~ -0.184                 ~ +0.236
 *
 *   HEADLINE. There is NO genuine lagged predictive structure. The cluster-ENVELOPE reading A is noise at EVERY lag
 *   (max |r| ~ 0.184 at lag +2), so shifting by one or two cluster peaks does NOT rescue it -- it never predicted
 *   the grade at the same rung and it does not predict it at a neighboring rung either. And the exact-rung reading B,
 *   the ONLY reading that "predicts" at lag 0 (r ~ +0.629), COLLAPSES the instant the series is shifted: r drops to
 *   ~ -0.108 at lag -1, ~ -0.149 at lag +1, and no off-diagonal lag exceeds ~ +0.236 in magnitude. The +0.629 lag-0
 *   signal is thus STRICTLY a same-rung effect: it is the imp-33663 tautology (the grade-5 outlier n = 998 aligning
 *   with the exact-rung-floor spike at the very same rung n = 998), NOT a cross-rung lead or lag. Once the grade and
 *   the height are read at DIFFERENT cluster peaks the apparent prediction vanishes into noise (every off-diagonal
 *   |r| &lt; 0.3, all far below the lag-0 tautology of +0.629).
 *
 *   VERDICT. NO-LAGGED-PREDICTIVE-STRUCTURE-EXACT-RUNG-TAUTOLOGY-IS-STRICTLY-LAG-ZERO. Spike height at cluster peak
 *   n does NOT predict the recovery grade at a neighboring cluster peak, in either direction. The envelope reading is
 *   noise at all lags; the exact-rung reading only "predicts" at lag 0, and that is the same-rung tautology imp-33663
 *   already identified, not genuine predictive structure. Introducing an off-by-one-rung shift removes the tautology
 *   and with it all of the apparent signal, closing the cross-rung correlation the imp-33663 verdict left unmeasured.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It recomputes the imp-33663
 *   recovery-grade / spike-height series and correlates them at non-zero lags; it changes NO bound, patches NO
 *   literal, and establishes NO operator positivity. floorUlp is a JITTERY arithmetic-floor lattice property
 *   (imp-33249/imp-33277/imp-33296/imp-33537/imp-33599/imp-33621/imp-33622/imp-33638/imp-33640/imp-33663
 *   latticeJitterCaveat), so the robust reading is the QUALITATIVE pattern -- every off-diagonal correlation is
 *   near-zero and the only above-noise correlation is the lag-0 same-rung tautology -- not the exact coefficients.
 *   The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH
 *   verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js (the same-rung sixteen-peak correlation this extends)
 *   @see imp-33640-recovery-grade-vs-spike-height-correlation.js (the original three-rung correlation)
 *   @see imp-33621-band-clearing-cluster-decay-and-tail-scan.js (the [400,900] cluster peaks)
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the [900,1200] re-intensified tail peaks)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33686 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33622/imp-33640/imp-33663) -------
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

// -- Sweep configuration (verbatim from imp-33663) ------------------------------------------------
// The SIXTEEN imp-33621/imp-33638 band-clearing cluster peaks over [400,1200] (imp-33660/imp-33661/imp-33662/imp-33663):
const ANCHOR_RUNGS = [526, 591, 634, 709, 735, 754, 807, 824, 874, 962, 998, 1038, 1072, 1104, 1126, 1198];
const PANEL_SWEEP = [10, 15, 20, 30, 50, 100, 200, 400]; // imp-33539 ladder => 100..4000 nodes
const GRADE_SWEEP = [4, 5, 6, 8];                          // the imp-33600 origin-concentration grade axis
const DEEP_FLOOR_ULP = 64;                                 // the imp-33316 widened deep-tail band
const RESOLVED_NODES = 200;                                // budgets at/above this off the unresolved-peak spike
const ENVELOPE_COLLAR = 5;                                 // imp-33599/imp-33621 +/-5 rolling-max envelope
const LAGS = [-2, -1, 0, 1, 2];                            // the cross-rung shifts to test (0 = imp-33663 same-rung)
const NOISE_THRESHOLD = 0.3;                               // |r| below this is treated as non-predictive noise

// -- grade-4 floorUlp(n): smallest grade-4 residual at budgets >= 200 nodes, vs the imp-33213 A_log target --
function grade4FloorUlp(n) {
  const tauStar = saddleTau(n);
  const aLogAtRung = aLog(tauStar);
  const ulpOfALog = aLogAtRung * U;
  let floor = Infinity;
  for (const panels of PANEL_SWEEP) {
    if (10 * panels < RESOLVED_NODES) continue;
    const ulp = Math.abs(aDirectGradedGL(tauStar, 7, panels, 4) - aLogAtRung) / ulpOfALog;
    if (ulp < floor) floor = ulp;
  }
  return floor;
}

// -- RECOVERY GRADE at a rung: the lowest grade in the sweep whose floor (budgets >= 200) enters the band --
function recoveryGradeForRung(n) {
  const tauStar = saddleTau(n);
  const aLogAtRung = aLog(tauStar);
  const ulpOfALog = aLogAtRung * U;
  for (const grade of GRADE_SWEEP) {
    let floor = Infinity;
    for (const panels of PANEL_SWEEP) {
      if (10 * panels < RESOLVED_NODES) continue;
      const ulp = Math.abs(aDirectGradedGL(tauStar, 7, panels, grade) - aLogAtRung) / ulpOfALog;
      if (ulp < floor) floor = ulp;
    }
    if (floor < DEEP_FLOOR_ULP) return grade;
  }
  return null;
}

// -- ENVELOPE height at a cluster peak: +/-5 rolling max of grade-4 floorUlp over [n-5, n+5] (reading A) --
function envelopeHeight(n) {
  let mx = -Infinity;
  for (let m = n - ENVELOPE_COLLAR; m <= n + ENVELOPE_COLLAR; m += 1) {
    const f = grade4FloorUlp(m);
    if (f > mx) mx = f;
  }
  return mx;
}

// -- Per-rung series (sixteen imp-33621/imp-33638 cluster peaks; verbatim imp-33663 readings) -------
const RUNG_TABLE = ANCHOR_RUNGS.map((n) => Object.freeze({
  n,
  recoveryGrade: recoveryGradeForRung(n),
  exactRungGrade4Floor: grade4FloorUlp(n), // reading (B): grade-4 floorUlp at the EXACT anchor rung
  envelopeHeight: envelopeHeight(n),       // reading (A): +/-5 rolling-max grade-4 floorUlp cluster envelope
}));

// -- Pearson correlation (guarded) ----------------------------------------------------------------
function pearson(xs, ys) {
  const nPts = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / nPts;
  const my = ys.reduce((a, b) => a + b, 0) / nPts;
  let cov = 0;
  let vx = 0;
  let vy = 0;
  for (let i = 0; i < nPts; i += 1) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    cov += dx * dy;
    vx += dx * dx;
    vy += dy * dy;
  }
  const denom = Math.sqrt(vx * vy);
  return denom > 0 ? cov / denom : 0;
}

// -- LAGGED Pearson: corr( grade[i], height[i + lag] ) over the overlapping window (16 - |lag| pairs).
//    lag > 0 pairs the grade at peak i with the spike height at the LATER peak i+lag; lag < 0 with the
//    EARLIER peak i+lag. lag = 0 reproduces the imp-33663 same-rung correlation exactly.
function laggedPearson(heights, grades, lag) {
  const xs = [];
  const ys = [];
  for (let i = 0; i < grades.length; i += 1) {
    const j = i + lag;
    if (j < 0 || j >= heights.length) continue;
    xs.push(heights[j]);
    ys.push(grades[i]);
  }
  return { lag, r: pearson(xs, ys), pairs: xs.length };
}

const RECOVERY_GRADES = RUNG_TABLE.map((r) => r.recoveryGrade);
const ENVELOPE_HEIGHTS = RUNG_TABLE.map((r) => r.envelopeHeight);
const EXACT_RUNG_FLOORS = RUNG_TABLE.map((r) => r.exactRungGrade4Floor);

// Reading A (cluster-envelope spike height) and reading B (exact-rung grade-4 floor), each at all five lags.
const LAGGED_ENVELOPE = LAGS.map((lag) => laggedPearson(ENVELOPE_HEIGHTS, RECOVERY_GRADES, lag));
const LAGGED_EXACT_RUNG = LAGS.map((lag) => laggedPearson(EXACT_RUNG_FLOORS, RECOVERY_GRADES, lag));

// -- Verdict classifiers --------------------------------------------------------------------------
const lag0Env = LAGGED_ENVELOPE.find((e) => e.lag === 0).r;
const lag0Exact = LAGGED_EXACT_RUNG.find((e) => e.lag === 0).r;
const offDiagEnv = LAGGED_ENVELOPE.filter((e) => e.lag !== 0);
const offDiagExact = LAGGED_EXACT_RUNG.filter((e) => e.lag !== 0);
const maxOffDiagEnv = Math.max(...offDiagEnv.map((e) => Math.abs(e.r)));
const maxOffDiagExact = Math.max(...offDiagExact.map((e) => Math.abs(e.r)));
const maxOffDiagAll = Math.max(maxOffDiagEnv, maxOffDiagExact);

// (1) Coverage: all sixteen peaks resolved, both readings at all five lags computed.
const coverageOk =
  RUNG_TABLE.length === 16 &&
  RUNG_TABLE.every((r) => r.recoveryGrade !== null && Number.isFinite(r.envelopeHeight) && Number.isFinite(r.exactRungGrade4Floor)) &&
  LAGGED_ENVELOPE.length === 5 && LAGGED_EXACT_RUNG.length === 5;
// (2) Lag-0 reproduces imp-33663: envelope near-zero (~0.06), exact-rung positive (~0.63).
const lag0ReproducesImp33663 = Math.abs(lag0Env) < 0.15 && lag0Exact > 0.5;
// (3) THE HEADLINE: the cluster-envelope reading A has NO lagged predictive structure -- noise at EVERY lag.
const envelopeNoLaggedStructure = LAGGED_ENVELOPE.every((e) => Math.abs(e.r) < NOISE_THRESHOLD);
// (4) THE HEADLINE: the exact-rung reading B "predicts" ONLY at lag 0 -- every off-diagonal lag is noise.
const exactRungTautologyStrictlyLag0 =
  offDiagExact.every((e) => Math.abs(e.r) < NOISE_THRESHOLD) &&
  lag0Exact - maxOffDiagExact > NOISE_THRESHOLD;
// (5) NO lagged correlation is non-trivially non-zero: max over ALL off-diagonal lags and both readings < 0.3.
const noLaggedPredictiveStructure = maxOffDiagAll < NOISE_THRESHOLD;

const verdict =
  coverageOk && lag0ReproducesImp33663 && envelopeNoLaggedStructure &&
  exactRungTautologyStrictlyLag0 && noLaggedPredictiveStructure
    ? 'NO-LAGGED-PREDICTIVE-STRUCTURE-EXACT-RUNG-TAUTOLOGY-IS-STRICTLY-LAG-ZERO:-SHIFTING-THE-RECOVERY-GRADE-SERIES-' +
      'BY-+/-1-AND-+/-2-CLUSTER-PEAK-INDICES-RELATIVE-TO-THE-SPIKE-HEIGHT-SERIES-ACROSS-THE-imp-33663-SIXTEEN-CLUSTER-' +
      '[400,1200]-SAMPLE-SHOWS-NO-GENUINE-CROSS-RUNG-PREDICTIVE-STRUCTURE.-THE-CLUSTER-ENVELOPE-READING-A-IS-NOISE-AT-' +
      'EVERY-LAG-(max-|r|~0.184-AT-lag+2)-SO-A-NEIGHBORING-RUNG-SHIFT-DOES-NOT-RESCUE-IT.-THE-EXACT-RUNG-READING-B,-' +
      'THE-ONLY-READING-THAT-PREDICTS-AT-lag-0-(r~+0.629),-COLLAPSES-THE-INSTANT-THE-SERIES-IS-SHIFTED-(r~-0.108-AT-' +
      'lag-1,-r~-0.149-AT-lag+1,-max-OFF-DIAGONAL-|r|~0.236)-SO-THE-lag-0-SIGNAL-IS-STRICTLY-THE-imp-33663-SAME-RUNG-' +
      'TAUTOLOGY-(THE-GRADE-5-OUTLIER-n=998-ALIGNING-WITH-THE-EXACT-RUNG-FLOOR-SPIKE-AT-THE-SAME-RUNG),-NOT-A-CROSS-' +
      'RUNG-LEAD-OR-LAG.-SPIKE-HEIGHT-AT-CLUSTER-PEAK-n-DOES-NOT-PREDICT-THE-RECOVERY-GRADE-AT-A-NEIGHBORING-PEAK-IN-' +
      'EITHER-DIRECTION.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-' +
      'NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33686_LAGGED_RECOVERY_GRADE_VS_SPIKE_HEIGHT = Object.freeze({
  id: 'imp-33686-lagged-recovery-grade-vs-spike-height',
  ticket: 'imp-33686',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js',
  crossValidatesModules: [
    'imp-33663-recovery-grade-vs-spike-height-sixteen-peaks.js',
    'imp-33640-recovery-grade-vs-spike-height-correlation.js',
    'imp-33621-band-clearing-cluster-decay-and-tail-scan.js',
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'MEASURE a LAGGED (off-by-one-rung) recovery-grade-vs-spike-height correlation on the imp-33663 SIXTEEN-cluster ' +
    '[400,1200] sample and ASSESS whether spike height at cluster peak n predicts the recovery grade at a NEIGHBORING ' +
    'peak -- a cross-rung correlation the imp-33663 EXACT-RUNG-TAUTOLOGY verdict (grade and height read at the SAME ' +
    'rung) did not exclude. Recomputing the identical sixteen-rung series and correlating the grade against each ' +
    'spike-height reading SHIFTED by +/-1 and +/-2 cluster-peak indices, the RESULT is NO genuine lagged predictive ' +
    'structure. The cluster-ENVELOPE reading A is noise at EVERY lag (max |r| ~ 0.184 at lag +2), so a neighboring-' +
    'rung shift does NOT rescue it. The exact-rung reading B, the ONLY reading that predicts at lag 0 (r ~ +0.629), ' +
    'COLLAPSES the instant the series is shifted (r ~ -0.108 at lag -1, ~ -0.149 at lag +1, max off-diagonal |r| ~ ' +
    '0.236), so the lag-0 signal is STRICTLY the imp-33663 same-rung tautology (the grade-5 outlier n = 998 aligning ' +
    'with the exact-rung-floor spike at the same rung), NOT a cross-rung lead or lag. Every off-diagonal |r| &lt; 0.3, ' +
    'far below the lag-0 tautology of +0.629. VERDICT: NO-LAGGED-PREDICTIVE-STRUCTURE-EXACT-RUNG-TAUTOLOGY-IS-' +
    'STRICTLY-LAG-ZERO. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery ' +
    'lattice floor; operator positivity (imp-3066) untouched; no QED. PT Lambda &lt;= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'the SIXTEEN imp-33621/imp-33638 band-clearing cluster peaks over [400,1200] (imp-33660/imp-33661/imp-33662/imp-33663)',
    recoveryGrade: 'the lowest grade g in {4,5,6,8} whose graded-GL floor (budgets >= 200 nodes) enters the imp-33316 &lt; 64 ULP band',
    envelopeReadingA: 'the imp-33599/imp-33621 +/-5 rolling-max envelope of grade-4 floorUlp over the collar [n-5, n+5]',
    exactRungReadingB: 'the grade-4 floorUlp at the EXACT anchor rung n (min residual over budgets >= 200 nodes)',
    laggedCorrelation: 'r(lag) = Pearson( grade[i], height[i + lag] ) over the 16 - |lag| overlapping cluster-peak pairs, lag in {-2,-1,0,+1,+2}',
    lagConvention: 'lag > 0 pairs grade at peak i with the spike height at the LATER peak i+lag; lag < 0 with the EARLIER peak; lag = 0 = imp-33663 same-rung',
    selfComputing: 'every rung, recovery grade, both spike-height readings, all ten lagged correlations, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    anchorRungs: Object.freeze(ANCHOR_RUNGS.slice()),
    panelSweep: Object.freeze(PANEL_SWEEP.slice()),
    gradeSweep: Object.freeze(GRADE_SWEEP.slice()),
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    resolvedNodes: RESOLVED_NODES,
    envelopeCollar: ENVELOPE_COLLAR,
    lags: Object.freeze(LAGS.slice()),
    noiseThreshold: NOISE_THRESHOLD,
    rungTable: RUNG_TABLE,
    recoveryGrades: Object.freeze(RECOVERY_GRADES.slice()),
    envelopeHeights: Object.freeze(ENVELOPE_HEIGHTS.slice()),
    exactRungFloors: Object.freeze(EXACT_RUNG_FLOORS.slice()),
    laggedEnvelope: Object.freeze(LAGGED_ENVELOPE.map((e) => Object.freeze({ ...e }))), // reading A at each lag
    laggedExactRung: Object.freeze(LAGGED_EXACT_RUNG.map((e) => Object.freeze({ ...e }))), // reading B at each lag
    lag0Envelope: lag0Env,       // ~ +0.06 -- reproduces imp-33663 same-rung envelope correlation
    lag0ExactRung: lag0Exact,    // ~ +0.63 -- reproduces imp-33663 same-rung exact-rung tautology
    maxOffDiagEnvelope: maxOffDiagEnv,   // ~ 0.184 -- envelope is noise at every lag
    maxOffDiagExactRung: maxOffDiagExact, // ~ 0.236 -- exact-rung signal is gone off the diagonal
    maxOffDiagAll: maxOffDiagAll,
    coverageOk,
    lag0ReproducesImp33663,
    envelopeNoLaggedStructure,
    exactRungTautologyStrictlyLag0,
    noLaggedPredictiveStructure,
    verdict,
  }),

  interpretation: Object.freeze({
    envelopeNoLaggedStructure:
      'The cluster-ENVELOPE reading A never predicts the recovery grade -- not at the same rung (lag 0, r ~ +0.06) ' +
      'and not at a neighboring rung (max |r| ~ 0.184 at lag +2). Shifting the grade series by one or two cluster ' +
      'peaks does not surface any hidden lead/lag: the envelope is decoupled from the grade at every offset.',
    exactRungTautologyStrictlyLag0:
      'The exact-rung reading B is the only reading that predicts, and it does so ONLY at lag 0 (r ~ +0.629). The ' +
      'instant the series is shifted the correlation collapses (~ -0.108 at lag -1, ~ -0.149 at lag +1, no ' +
      'off-diagonal |r| above ~0.236). The lag-0 signal is the imp-33663 same-rung tautology (grade-5 outlier n=998 ' +
      'aligning with the exact-rung-floor spike at the very same rung), not a cross-rung predictive relationship.',
    noLaggedPredictiveStructure:
      'No lagged correlation is non-trivially non-zero: every off-diagonal coefficient across both readings and all ' +
      'four non-zero lags has |r| &lt; 0.3, far below the lag-0 tautology of +0.629. Spike height at cluster peak n ' +
      'does NOT predict the recovery grade at a neighboring cluster peak in either direction. The cross-rung ' +
      'correlation the imp-33663 EXACT-RUNG-TAUTOLOGY verdict left unmeasured is measured here and also vanishes.',
    jitterCaveat:
      'floorUlp is a jittery few-ULP lattice value, so the robust reading is the QUALITATIVE pattern -- every ' +
      'off-diagonal correlation is near-zero and the only above-noise correlation is the lag-0 same-rung tautology -- ' +
      'not the exact coefficients. The behaviour is a rung-local lattice-jitter property, not a cross-rung law.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Recomputes the imp-33663 recovery-grade / spike-height series on the imp-33621/imp-33638 sixteen-peak ' +
      '[400,1200] set and correlates them at non-zero cluster-peak lags. It changes NO bound, patches NO literal, ' +
      'and establishes NO operator positivity. Grid-design measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sampleCaveat:
      'The lagged correlations are over 16 - |lag| cluster-peak pairs; the recovery grade is nearly constant (a ' +
      'single grade-5 outlier n = 998), so the coefficients are coarse. The robust reading is that only the lag-0 ' +
      'same-rung tautology rises above noise and every off-diagonal lag is near-zero, not the exact r values.',
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33663/imp-33640/imp-33622/imp-33621/imp-33638/' +
      'imp-33539/imp-33316/imp-33213; this audits the lagged recovery-grade / spike-height correlation, not that truncation.',
    latticeJitterCaveat:
      'The per-grade/per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/' +
      'imp-33537/imp-33599/imp-33621/imp-33622/imp-33638/imp-33640/imp-33663): individual grids bounce and ' +
      'cross-platform libm exp/pow variation can shift the few-ULP measurements, so the robust reading is the ' +
      'QUALITATIVE pattern -- every off-diagonal correlation is near-zero and only the lag-0 same-rung tautology is ' +
      'above noise -- not the exact correlation coefficients. Rung-local, not a cross-rung cluster-amplitude law.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33686_LAGGED_RECOVERY_GRADE_VS_SPIKE_HEIGHT_ASSERTIONS = [
  {
    id: 'imp33686-coverage',
    why: 'All sixteen cluster peaks must resolve, and both readings must be correlated at all five lags {-2,-1,0,+1,+2}.',
    holds: () => coverageOk && RUNG_TABLE.length === 16 && LAGS.length === 5,
  },
  {
    id: 'imp33686-lag0-reproduces-imp33663',
    why: 'Cross-check: at lag 0 the module must reproduce the imp-33663 same-rung readings -- envelope near-zero, exact-rung positive (~0.63).',
    holds: () => lag0ReproducesImp33663 && Math.abs(lag0Env) < 0.15 && lag0Exact > 0.5,
  },
  {
    id: 'imp33686-envelope-no-lagged-structure',
    why: 'THE HEADLINE: the cluster-envelope reading A must have NO lagged predictive structure -- |r| &lt; 0.3 at EVERY lag.',
    holds: () => envelopeNoLaggedStructure && maxOffDiagEnv < NOISE_THRESHOLD,
  },
  {
    id: 'imp33686-exact-rung-tautology-strictly-lag0',
    why: 'THE HEADLINE: the exact-rung reading B must predict ONLY at lag 0 -- every off-diagonal |r| &lt; 0.3 and the lag-0 r exceeds the max off-diagonal by &gt; 0.3.',
    holds: () => exactRungTautologyStrictlyLag0,
  },
  {
    id: 'imp33686-no-lagged-predictive-structure',
    why: 'THE VERDICT: no lagged correlation is non-trivially non-zero -- the max off-diagonal |r| across both readings is below the noise threshold.',
    holds: () => noLaggedPredictiveStructure && maxOffDiagAll < NOISE_THRESHOLD,
  },
  {
    id: 'imp33686-verdict-records-no-lagged-structure',
    why: 'The classified verdict must record NO-LAGGED-PREDICTIVE-STRUCTURE-EXACT-RUNG-TAUTOLOGY-IS-STRICTLY-LAG-ZERO, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33686-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33686_LAGGED_RECOVERY_GRADE_VS_SPIKE_HEIGHT.honestCaveat;
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

for (const assertion of IMP33686_LAGGED_RECOVERY_GRADE_VS_SPIKE_HEIGHT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33686-lagged-recovery-grade-vs-spike-height assertion failed: ${assertion.id}`);
  }
}
