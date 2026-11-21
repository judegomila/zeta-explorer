/**
 * @module imp-33640-recovery-grade-vs-spike-height-correlation
 * @fileoverview imp-33640 -- CORRELATE the imp-33622 origin-concentration RECOVERY GRADE (the drift 4/6/4
 *   across the three imp-33599 band-clearing cluster peaks n = 526 / 596 / 634) against the LOCAL cluster
 *   peak-envelope height, and MEASURE whether the recovery-grade drift is PREDICTED by floorUlp spike height.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE CONJECTURE imp-33622 LEFT ON THE TABLE
 *   ------------------------------------------
 *   imp-33622 found the imp-33600 "grade-6-recovers-the-band" is NOT rung-uniform: the recovery grade (lowest
 *   grade g in {4,5,6,8} whose graded-GL floor enters the imp-33316 &lt; 64 ULP band on the imp-33539 node
 *   ladder) drifts 4 / 6 / 4 across the three imp-33599 cluster peaks n = 526 / 596 / 634 -- grade-4 already
 *   clears the band at the flanks but only grade-6 clears it at the middle rung n = 596. imp-33622 CONJECTURED
 *   this tracks the imp-33621 finding that "the middle cluster ~[591,601] is the tallest floorUlp spike."
 *   This module TESTS that conjecture quantitatively: is the recovery-grade drift PREDICTED by spike height?
 *
 *   THE METRIC AMBIGUITY THIS MODULE RESOLVES
 *   -----------------------------------------
 *   "Spike height" is ambiguous and the conjecture rests on which reading is used:
 *     (A) the imp-33599/imp-33621 +/-5 ROLLING-MAX ENVELOPE height of grade-4 floorUlp at each cluster
 *         (the published cluster peaks ~76.1 / ~65.3 / ~64.1 ULP -- DECREASING), versus
 *     (B) the grade-4 floorUlp at the EXACT anchor rung (~26 / ~65 / ~11 ULP -- middle tallest).
 *   imp-33621 measured (A): its cluster peak heights DECAY 76.1 -> 65.3 -> 64.1, so by the +/-5 rolling-max
 *   ENVELOPE the FIRST cluster n ~ 526 is the tallest, NOT the middle. imp-33622s "middle cluster is the
 *   tallest spike" is true only under reading (B). This module computes BOTH and correlates each against the
 *   recovery grade.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   At each anchor rung n in {526,596,634}: (1) RECOVERY GRADE -- re-run the imp-33622 grade sweep {4,5,6,8}
 *   across the imp-33539 ladder (panels {10,15,20,30,50,100,200,400} = 100..4000 nodes), score A_direct(tau*)
 *   vs the imp-33213 log-domain A_log target in ULP = A_log*2^-52, take the lowest grade whose floor (budgets
 *   &gt;= 200 nodes) enters the &lt; 64 band; (2) EXACT-RUNG grade-4 floorUlp (reading B); (3) ENVELOPE height
 *   -- the +/-5 rolling max of grade-4 floorUlp over the collar [n-5, n+5] (reading A). Then compute the
 *   Pearson correlation of the recovery grade against EACH spike-height reading.
 *
 *   MEASURED (recovery grade vs the two spike-height readings; ULP vs the imp-33213 A_log target):
 *
 *        rung    recoveryGrade   envelope +/-5 (A)     exact-rung grade4 floor (B)
 *        n=526   4               ~76 ULP (tallest)     ~26 ULP
 *        n=596   6               ~65 ULP               ~65 ULP (tallest)
 *        n=634   4               ~64 ULP               ~11 ULP
 *
 *   HEADLINE. The recovery-grade drift is NOT predicted by the cluster peak-ENVELOPE height (reading A). The
 *   TALLEST envelope cluster is n = 526 (~76 ULP) yet it has the LOWEST recovery grade (4); the middle rung
 *   n = 596 has a SHORTER envelope (~65) yet the HIGHEST recovery grade (6). The Pearson correlation of
 *   recovery grade vs envelope height is NEGATIVE (~ -0.4): taller envelope -> LOWER, not higher, recovery
 *   grade. Only reading (B) -- the grade-4 floorUlp at the EXACT anchor rung -- correlates strongly and
 *   positively (~ +0.96), and that correlation is NEAR-TAUTOLOGICAL: by construction the recovery grade is 4
 *   exactly when the grade-4 exact-rung floor sits inside the &lt; 64 band, so (B) predicting the recovery
 *   grade restates the definition, it does not explain the drift by spike height.
 *
 *   VERDICT. RECOVERY-GRADE-DRIFT-NOT-PREDICTED-BY-ENVELOPE-SPIKE-HEIGHT. imp-33622s conjecture that the
 *   grade-6 recovery tracks "the tallest floorUlp spike" holds ONLY under the exact-rung reading (B), where it
 *   is tautological, and FAILS under the natural imp-33599/imp-33621 cluster-ENVELOPE reading (A), where the
 *   tallest cluster (n = 526) needs the LOWEST grade. So the drift is NOT driven by cluster spike height per
 *   se; it is driven by whether the local grade-4 arithmetic floor at the EXACT rung happens to poke above
 *   64 ULP -- a rung-local lattice-jitter property, not a cluster-peak-amplitude law.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It correlates two already-
 *   measured imp-33622/imp-33621 quantities across three rungs; it changes NO bound, patches NO literal, and
 *   establishes NO operator positivity. Three points give a coarse correlation and floorUlp is a JITTERY
 *   arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/imp-33599/imp-33621/imp-33622
 *   latticeJitterCaveat), so the robust reading is the QUALITATIVE sign -- the tallest ENVELOPE cluster has
 *   the LOWEST recovery grade, so envelope height does not predict the drift -- not the exact correlation
 *   coefficient. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is NECESSARY-
 *   BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33622-grade-recovery-rung-uniformity.js (the recovery-grade drift 4/6/4 this correlates)
 *   @see imp-33621-band-clearing-cluster-decay-and-tail-scan.js (the cluster peak-envelope decay 76.1/65.3/64.1)
 *   @see imp-33599-wide-range-band-crossing-envelope-law.js (the three band-clearing cluster peaks)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33640 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33622) ----------------
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

// -- Sweep configuration (verbatim from imp-33622) ------------------------------------------------
// The three imp-33599 band-clearing cluster peaks where imp-33622 measured the recovery grade.
const ANCHOR_RUNGS = [526, 596, 634];
const PANEL_SWEEP = [10, 15, 20, 30, 50, 100, 200, 400]; // imp-33539 ladder => 100..4000 nodes
const GRADE_SWEEP = [4, 5, 6, 8];                          // the imp-33600 origin-concentration grade axis
const DEEP_FLOOR_ULP = 64;                                 // the imp-33316 widened deep-tail band
const RESOLVED_NODES = 200;                                // budgets at/above this off the unresolved-peak spike
const ENVELOPE_COLLAR = 5;                                 // imp-33599/imp-33621 +/-5 rolling-max envelope

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

// -- Per-rung correlation table -------------------------------------------------------------------
const RUNG_TABLE = ANCHOR_RUNGS.map((n) => Object.freeze({
  n,
  recoveryGrade: recoveryGradeForRung(n),
  exactRungGrade4Floor: grade4FloorUlp(n), // reading (B): grade-4 floorUlp at the EXACT anchor rung
  envelopeHeight: envelopeHeight(n),       // reading (A): +/-5 rolling-max grade-4 floorUlp cluster envelope
}));

// -- Pearson correlation (small-sample, guarded) --------------------------------------------------
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

const RECOVERY_GRADES = RUNG_TABLE.map((r) => r.recoveryGrade);
const ENVELOPE_HEIGHTS = RUNG_TABLE.map((r) => r.envelopeHeight);
const EXACT_RUNG_FLOORS = RUNG_TABLE.map((r) => r.exactRungGrade4Floor);

// (A) recovery grade vs the imp-33599/imp-33621 cluster peak-ENVELOPE height -- the natural spike-height reading.
const corrRecoveryVsEnvelope = pearson(ENVELOPE_HEIGHTS, RECOVERY_GRADES);
// (B) recovery grade vs the grade-4 floorUlp at the EXACT anchor rung -- near-tautological with the definition.
const corrRecoveryVsExactRung = pearson(EXACT_RUNG_FLOORS, RECOVERY_GRADES);

// -- Verdict classifiers --------------------------------------------------------------------------
const byRung = (n) => RUNG_TABLE.find((r) => r.n === n);
const R526 = byRung(526);
const R596 = byRung(596);
const R634 = byRung(634);

// (1) Coverage: all three cluster peaks measured, recovery grades resolved.
const coverageOk =
  RUNG_TABLE.length === 3 && RUNG_TABLE.every((r) => r.recoveryGrade !== null && Number.isFinite(r.envelopeHeight));
// (2) Reproduce the imp-33622 drift 4/6/4.
const reproducesDrift = R526.recoveryGrade === 4 && R596.recoveryGrade === 6 && R634.recoveryGrade === 4;
// (3) THE HEADLINE: the TALLEST cluster ENVELOPE is n=526 (reading A) yet it has the LOWEST recovery grade.
const tallestEnvelopeIsFirstCluster =
  R526.envelopeHeight > R596.envelopeHeight && R526.envelopeHeight > R634.envelopeHeight;
const tallestEnvelopeHasLowestGrade =
  R526.recoveryGrade === Math.min(...RECOVERY_GRADES) && R526.recoveryGrade < R596.recoveryGrade;
// (4) Envelope height does NOT positively predict the recovery grade -- correlation is <= 0.
const envelopeDoesNotPredict = corrRecoveryVsEnvelope <= 0;
// (5) Only the EXACT-rung grade-4 floor (reading B, near-tautological) predicts strongly and positively.
const exactRungTallestIsMiddle =
  R596.exactRungGrade4Floor > R526.exactRungGrade4Floor && R596.exactRungGrade4Floor > R634.exactRungGrade4Floor;
const exactRungPredicts = corrRecoveryVsExactRung > 0.8;

const verdict =
  coverageOk && reproducesDrift && tallestEnvelopeIsFirstCluster && tallestEnvelopeHasLowestGrade &&
  envelopeDoesNotPredict && exactRungTallestIsMiddle && exactRungPredicts
    ? 'RECOVERY-GRADE-DRIFT-NOT-PREDICTED-BY-ENVELOPE-SPIKE-HEIGHT:-CORRELATING-THE-imp-33622-RECOVERY-GRADE-DRIFT-' +
      '4/6/4-ACROSS-THE-imp-33599-CLUSTER-PEAKS-n=526/596/634-AGAINST-THE-imp-33599/imp-33621-CLUSTER-PEAK-ENVELOPE-' +
      'HEIGHT-SHOWS-THE-DRIFT-IS-NOT-PREDICTED-BY-SPIKE-HEIGHT.-THE-TALLEST-+/-5-ROLLING-MAX-ENVELOPE-CLUSTER-IS-' +
      'n=526-(~76-ULP)-YET-IT-HAS-THE-LOWEST-RECOVERY-GRADE-(4),-WHILE-THE-SHORTER-MIDDLE-RUNG-n=596-(~65-ULP)-HAS-' +
      'THE-HIGHEST-(6):-PEARSON-r-OF-RECOVERY-GRADE-VS-ENVELOPE-HEIGHT-IS-NEGATIVE-(~-0.4).-ONLY-THE-grade-4-floorUlp-' +
      'AT-THE-EXACT-ANCHOR-RUNG-(TALLEST-AT-n=596,-~65>64)-PREDICTS-STRONGLY-(r~+0.96),-AND-THAT-IS-NEAR-TAUTOLOGICAL-' +
      '(RECOVERY-GRADE-IS-4-EXACTLY-WHEN-THE-grade-4-EXACT-RUNG-FLOOR-IS-IN-BAND).-imp-33622s-"TRACKS-THE-TALLEST-' +
      'floorUlp-SPIKE"-HOLDS-ONLY-UNDER-THE-EXACT-RUNG-READING,-WHERE-IT-RESTATES-THE-DEFINITION,-AND-FAILS-UNDER-THE-' +
      'NATURAL-CLUSTER-ENVELOPE-READING.-THE-DRIFT-IS-DRIVEN-BY-A-RUNG-LOCAL-LATTICE-JITTER-PROPERTY-(WHETHER-THE-' +
      'grade-4-FLOOR-AT-THE-EXACT-RUNG-POKES-ABOVE-64),-NOT-BY-CLUSTER-PEAK-AMPLITUDE.-ACCURACY/RULE-DESIGN-' +
      'MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-' +
      'NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33640_RECOVERY_GRADE_VS_SPIKE_HEIGHT = Object.freeze({
  id: 'imp-33640-recovery-grade-vs-spike-height-correlation',
  ticket: 'imp-33640',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33622-grade-recovery-rung-uniformity.js',
  crossValidatesModules: [
    'imp-33622-grade-recovery-rung-uniformity.js',
    'imp-33621-band-clearing-cluster-decay-and-tail-scan.js',
    'imp-33599-wide-range-band-crossing-envelope-law.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'CORRELATE the imp-33622 origin-concentration RECOVERY GRADE (the drift 4/6/4 across the three imp-33599 ' +
    'band-clearing cluster peaks n = 526/596/634) against the local cluster peak-envelope height and MEASURE ' +
    'whether the recovery-grade drift is predicted by floorUlp spike height. RESULT: it is NOT. Under the natural ' +
    'imp-33599/imp-33621 +/-5 rolling-max ENVELOPE reading the tallest cluster is n = 526 (~76 ULP) yet it has the ' +
    'LOWEST recovery grade (4), while the shorter middle rung n = 596 (~65 ULP) has the HIGHEST (6): the Pearson ' +
    'correlation of recovery grade vs envelope height is NEGATIVE (~ -0.4). Only the grade-4 floorUlp at the EXACT ' +
    'anchor rung (tallest at n = 596, ~65 > 64) predicts strongly (~ +0.96), and that is near-tautological -- the ' +
    'recovery grade is 4 exactly when the grade-4 exact-rung floor is in band. imp-33622s conjecture that the ' +
    'recovery grade "tracks the tallest floorUlp spike" holds ONLY under the exact-rung reading, where it restates ' +
    'the definition, and FAILS under the natural cluster-envelope reading. The drift is a rung-local lattice-jitter ' +
    'property, not a cluster-peak-amplitude law. VERDICT: RECOVERY-GRADE-DRIFT-NOT-PREDICTED-BY-ENVELOPE-SPIKE-HEIGHT. ' +
    'ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; operator ' +
    'positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'the three imp-33599 band-clearing cluster peaks n in {526,596,634} where imp-33622 measured the recovery grade',
    recoveryGrade: 'the lowest grade g in {4,5,6,8} whose graded-GL floor (budgets >= 200 nodes) enters the imp-33316 &lt; 64 ULP band',
    envelopeReadingA: 'the imp-33599/imp-33621 +/-5 rolling-max envelope of grade-4 floorUlp over the collar [n-5, n+5]',
    exactRungReadingB: 'the grade-4 floorUlp at the EXACT anchor rung n (min residual over budgets >= 200 nodes)',
    scoring: 'residual of A_direct(tau*) vs the imp-33213 log-domain target A_log, in ULP = A_log * 2^-52',
    correlation: 'Pearson correlation of the recovery grade against each spike-height reading across the three rungs',
    selfComputing: 'every rung, recovery grade, both spike-height readings, both correlations, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    anchorRungs: Object.freeze(ANCHOR_RUNGS.slice()),
    panelSweep: Object.freeze(PANEL_SWEEP.slice()),
    gradeSweep: Object.freeze(GRADE_SWEEP.slice()),
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    resolvedNodes: RESOLVED_NODES,
    envelopeCollar: ENVELOPE_COLLAR,
    rungTable: RUNG_TABLE,
    recoveryGrades: Object.freeze(RECOVERY_GRADES.slice()),
    envelopeHeights: Object.freeze(ENVELOPE_HEIGHTS.slice()),
    exactRungFloors: Object.freeze(EXACT_RUNG_FLOORS.slice()),
    corrRecoveryVsEnvelope, // reading (A): the natural cluster-envelope spike height -- NEGATIVE, does not predict
    corrRecoveryVsExactRung, // reading (B): the exact-rung grade-4 floor -- strong but near-tautological
    coverageOk,
    reproducesDrift,
    tallestEnvelopeIsFirstCluster,
    tallestEnvelopeHasLowestGrade,
    envelopeDoesNotPredict,
    exactRungTallestIsMiddle,
    exactRungPredicts,
    verdict,
  }),

  interpretation: Object.freeze({
    reproducesDrift:
      'The recovery grade recomputes to 4/6/4 across n = 526/596/634, reproducing imp-33622: grade-4 clears the ' +
      'imp-33316 &lt; 64 band at the flanks but only grade-6 clears it at the middle rung n = 596.',
    envelopeDoesNotPredict:
      'Under the natural imp-33599/imp-33621 +/-5 rolling-max ENVELOPE reading the cluster peak heights DECREASE ' +
      '~76 -> ~65 -> ~64 ULP, so the TALLEST cluster is n = 526 -- yet n = 526 has the LOWEST recovery grade (4). ' +
      'The Pearson correlation of recovery grade vs envelope height is NEGATIVE (~ -0.4): a taller cluster envelope ' +
      'goes with a LOWER, not a higher, recovery grade. Envelope spike height does not predict the drift.',
    onlyExactRungPredicts:
      'Only the grade-4 floorUlp at the EXACT anchor rung (reading B) tracks the recovery grade: it is ~26/~65/~11 ' +
      'ULP, tallest at n = 596 where it pokes above 64, so the recovery grade correlates strongly (~ +0.96). But ' +
      'this is NEAR-TAUTOLOGICAL -- by construction the recovery grade is 4 exactly when the grade-4 exact-rung ' +
      'floor is inside the band, so reading B predicting the recovery grade restates the definition; it does not ' +
      'explain the drift by cluster spike height.',
    resolvesMetricAmbiguity:
      'imp-33622s "consistent with imp-33621 tallest spike" conflated the two readings: by the +/-5 rolling-max ' +
      'ENVELOPE (imp-33621s published metric) the FIRST cluster n ~ 526 is the tallest, NOT the middle. The middle ' +
      'is tallest only under the exact-rung reading. So the conjecture that the grade-6 recovery tracks the tallest ' +
      'floorUlp spike is TRUE only in the tautological reading and FALSE in the amplitude reading.',
    jitterCaveat:
      'Three points give a coarse correlation and floorUlp is a jittery few-ULP lattice value, so the robust ' +
      'reading is the QUALITATIVE sign -- the tallest ENVELOPE cluster has the LOWEST recovery grade -- not the ' +
      'exact correlation coefficient. The drift is a rung-local lattice-jitter property, not a peak-amplitude law.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Correlates two already-measured imp-33622/imp-33621 quantities (the recovery-grade drift 4/6/4 and the ' +
      'cluster peak-envelope height) across the three imp-33599 cluster peaks. It changes NO bound, patches NO ' +
      'literal, and establishes NO operator positivity. Grid-design measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    smallSampleCaveat:
      'The correlation is over only THREE cluster peaks (the rungs imp-33622 measured the recovery grade at); the ' +
      'coefficients are coarse and the robust reading is the sign, not the exact r. Extending the recovery-grade ' +
      'sweep to the imp-33621/imp-33638 tail clusters would sharpen it.',
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33622/imp-33621/imp-33599/imp-33539/imp-33316/' +
      'imp-33213; this audits the recovery-grade vs spike-height correlation, not that truncation.',
    latticeJitterCaveat:
      'The per-grade/per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/' +
      'imp-33537/imp-33599/imp-33621/imp-33622): individual grids bounce and cross-platform libm exp/pow variation ' +
      'can shift the few-ULP measurements, so the robust reading is the QUALITATIVE sign -- the tallest ENVELOPE ' +
      'cluster has the LOWEST recovery grade, so envelope height does not predict the drift -- not the exact ' +
      'correlation coefficient. The drift is rung-local, not a cluster-peak-amplitude law.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33640_RECOVERY_GRADE_VS_SPIKE_HEIGHT_ASSERTIONS = [
  {
    id: 'imp33640-coverage',
    why: 'All three imp-33599 cluster peaks {526,596,634} must have a resolved recovery grade and a finite envelope height.',
    holds: () => coverageOk && RUNG_TABLE.length === 3,
  },
  {
    id: 'imp33640-reproduces-drift',
    why: 'The recovery grade must recompute to the imp-33622 drift 4/6/4 across {526,596,634}.',
    holds: () => reproducesDrift,
  },
  {
    id: 'imp33640-tallest-envelope-is-first-cluster',
    why: 'Under the imp-33599/imp-33621 +/-5 rolling-max ENVELOPE reading the tallest cluster must be n=526, NOT the middle.',
    holds: () => tallestEnvelopeIsFirstCluster,
  },
  {
    id: 'imp33640-tallest-envelope-has-lowest-grade',
    why: 'THE HEADLINE: the tallest ENVELOPE cluster n=526 must have the LOWEST recovery grade (4), below the middle rung.',
    holds: () => tallestEnvelopeHasLowestGrade,
  },
  {
    id: 'imp33640-envelope-does-not-predict',
    why: 'THE HEADLINE: recovery grade vs cluster-envelope height must NOT positively correlate -- Pearson r &lt;= 0.',
    holds: () => envelopeDoesNotPredict && corrRecoveryVsEnvelope <= 0,
  },
  {
    id: 'imp33640-only-exact-rung-predicts-tautologically',
    why: 'Only the grade-4 floorUlp at the EXACT rung (tallest at n=596) predicts the recovery grade, near-tautologically (r &gt; 0.8).',
    holds: () => exactRungTallestIsMiddle && exactRungPredicts,
  },
  {
    id: 'imp33640-verdict-records-not-predicted',
    why: 'The classified verdict must record the RECOVERY-GRADE-DRIFT-NOT-PREDICTED-BY-ENVELOPE-SPIKE-HEIGHT reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33640-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33640_RECOVERY_GRADE_VS_SPIKE_HEIGHT.honestCaveat;
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

for (const assertion of IMP33640_RECOVERY_GRADE_VS_SPIKE_HEIGHT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33640-recovery-grade-vs-spike-height-correlation assertion failed: ${assertion.id}`);
  }
}
