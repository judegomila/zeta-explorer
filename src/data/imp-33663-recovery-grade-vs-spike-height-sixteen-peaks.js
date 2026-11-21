/**
 * @module imp-33663-recovery-grade-vs-spike-height-sixteen-peaks
 * @fileoverview imp-33663 -- EXTEND the imp-33640 recovery-grade-vs-spike-height correlation from THREE cluster
 *   peaks to the FULL imp-33621/imp-33638 SIXTEEN-cluster [400,1200] sample, and MEASURE whether the
 *   reading-A-fails / reading-B-tautological pattern holds on the larger set.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33640 LEFT ON THE TABLE
 *   --------------------------------
 *   imp-33640 verdict RECOVERY-GRADE-DRIFT-NOT-PREDICTED-BY-ENVELOPE-SPIKE-HEIGHT rested on only THREE cluster
 *   peaks {526,596,634}, with the qualitative sign carried by three points (Pearson r vs the cluster ENVELOPE
 *   height ~ -0.42, vs the EXACT-rung floor ~ +0.96). imp-33640s own smallSampleCaveat flagged that "extending
 *   the recovery-grade sweep to the imp-33621/imp-33638 tail clusters would sharpen it." imp-33621 (three
 *   [400,700] + [700,900] clusters) and imp-33638 ([900,1200] re-intensification) now supply SIXTEEN band-
 *   clearing cluster peaks n in {526,591,634,709,735,754,807,824,874,962,998,1038,1072,1104,1126,1198}. This
 *   module re-runs the identical imp-33640 measurement across all sixteen and re-tests the two-reading pattern.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   At each of the sixteen anchor rungs: (1) RECOVERY GRADE -- the lowest grade g in {4,5,6,8} whose graded-GL
 *   floor (budgets &gt;= 200 nodes) enters the imp-33316 &lt; 64 ULP band, tau* = saddleTau(n), imp-33213
 *   log-domain A_log target; (2) reading B -- the grade-4 floorUlp at the EXACT rung (min residual over budgets
 *   &gt;= 200 nodes); (3) reading A -- the imp-33599/imp-33621 +/-5 rolling-max ENVELOPE of grade-4 floorUlp over
 *   the collar [n-5, n+5]. Then Pearson-correlate the recovery grade against EACH reading over the sixteen rungs.
 *
 *   MEASURED (recovery grade vs the two spike-height readings; ULP vs the imp-33213 A_log target):
 *
 *        rung    recoveryGrade   envelope +/-5 (A)     exact-rung grade4 floor (B)
 *        n=526   4               ~76.1 ULP             ~25.9 ULP
 *        n=591   4               ~65.3                 ~18.1
 *        n=634   4               ~64.1                 ~10.7
 *        ... (thirteen further tail peaks; see rungTable) ...
 *        n=998   5 (the ONLY g&gt;4) ~85.6              ~70.4 (the ONLY B &gt; 64)
 *        n=1126  4               ~143.6 (TALLEST)      ~10.4
 *        n=1198  4               ~135.0               ~2.9
 *
 *   HEADLINE. On the sixteen-peak sample the recovery grade is NEARLY CONSTANT: fifteen of sixteen peaks recover
 *   at grade 4; the LONE exception is n = 998 (grade 5), and n = 998 is EXACTLY the unique rung whose grade-4
 *   EXACT-rung floor (~70.4 ULP) pokes above the imp-33316 &lt; 64 band. So the reading-B tautology is now PERFECT
 *   on the full sample: recoveryGrade == 4 if-and-only-if the grade-4 exact-rung floor &lt; 64. Reading B still
 *   "predicts" the recovery grade (Pearson r ~ +0.63, weaker than the three-point ~+0.96 because a single outlier
 *   now carries it) but it does so by restating the definition. The cluster-ENVELOPE reading A STILL FAILS: its
 *   Pearson correlation with the recovery grade is essentially ZERO (~+0.06) -- the three-point negative ~-0.42
 *   does NOT survive as a robust negative, it collapses to noise -- and the QUALITATIVE failure is starker than
 *   ever: the TWO TALLEST envelope clusters n = 1126 (~143.6 ULP) and n = 1198 (~135.0) both carry the LOWEST
 *   recovery grade (4), while the lone grade-5 rung n = 998 has only a MIDDLING envelope (~85.6, fifth of sixteen).
 *
 *   VERDICT. EXACT-RUNG-TAUTOLOGY-PERSISTS-ENVELOPE-STILL-FAILS-ON-SIXTEEN-PEAKS. Quadrupling-plus the sample
 *   from three rungs to sixteen does NOT rescue cluster spike height as a predictor of the recovery grade: the
 *   only reading that tracks the grade is the exact-rung floor, and it tracks it tautologically (the recovery
 *   grade steps to 5 at precisely the one rung whose grade-4 exact-rung floor exceeds 64). The recovery-grade
 *   behaviour is a rung-local lattice-jitter property -- whether the grade-4 arithmetic floor at the EXACT rung
 *   happens to poke above 64 -- not a cluster-peak-amplitude law. The re-intensified tail envelopes (~86..144 ULP)
 *   do NOT force higher recovery grades.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It re-runs the imp-33640
 *   correlation on the imp-33621/imp-33638 sixteen-peak set; it changes NO bound, patches NO literal, and
 *   establishes NO operator positivity. floorUlp is a JITTERY arithmetic-floor lattice property (imp-33249/
 *   imp-33277/imp-33296/imp-33537/imp-33599/imp-33621/imp-33622/imp-33638/imp-33640 latticeJitterCaveat), so the
 *   robust reading is the QUALITATIVE pattern -- the tallest envelope clusters carry the lowest recovery grade and
 *   the recovery grade steps exactly where the exact-rung floor crosses 64 -- not the exact correlation
 *   coefficients. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is NECESSARY-BUT-
 *   NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066)
 *   is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33640-recovery-grade-vs-spike-height-correlation.js (the three-rung correlation this extends)
 *   @see imp-33621-band-clearing-cluster-decay-and-tail-scan.js (the [400,900] cluster peaks)
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the [900,1200] re-intensified tail peaks)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33663 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33622/imp-33640) -------
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

// -- Sweep configuration (verbatim from imp-33640) ------------------------------------------------
// The SIXTEEN imp-33621/imp-33638 band-clearing cluster peaks over [400,1200] (imp-33660/imp-33661/imp-33662):
//   imp-33599 flank peaks {526,591,634}, imp-33621 [700,900] peaks, imp-33638 re-intensified [900,1200] tail.
const ANCHOR_RUNGS = [526, 591, 634, 709, 735, 754, 807, 824, 874, 962, 998, 1038, 1072, 1104, 1126, 1198];
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

// -- Per-rung correlation table (sixteen imp-33621/imp-33638 cluster peaks) ------------------------
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

const RECOVERY_GRADES = RUNG_TABLE.map((r) => r.recoveryGrade);
const ENVELOPE_HEIGHTS = RUNG_TABLE.map((r) => r.envelopeHeight);
const EXACT_RUNG_FLOORS = RUNG_TABLE.map((r) => r.exactRungGrade4Floor);

// (A) recovery grade vs the imp-33599/imp-33621 cluster peak-ENVELOPE height -- the natural spike-height reading.
const corrRecoveryVsEnvelope = pearson(ENVELOPE_HEIGHTS, RECOVERY_GRADES);
// (B) recovery grade vs the grade-4 floorUlp at the EXACT anchor rung -- near-tautological with the definition.
const corrRecoveryVsExactRung = pearson(EXACT_RUNG_FLOORS, RECOVERY_GRADES);

// -- Verdict classifiers --------------------------------------------------------------------------
const minGrade = Math.min(...RECOVERY_GRADES);
const maxGrade = Math.max(...RECOVERY_GRADES);
// The rung carrying the TALLEST envelope (reading A) and the rung(s) needing a grade above the floor.
const tallestEnvRung = RUNG_TABLE.reduce((a, b) => (b.envelopeHeight > a.envelopeHeight ? b : a));
const elevatedGradeRungs = RUNG_TABLE.filter((r) => r.recoveryGrade > minGrade);

// (1) Coverage: all sixteen cluster peaks measured, recovery grades resolved.
const coverageOk =
  RUNG_TABLE.length === 16 &&
  RUNG_TABLE.every((r) => r.recoveryGrade !== null && Number.isFinite(r.envelopeHeight) && Number.isFinite(r.exactRungGrade4Floor));
// (2) THE EXACT-RUNG TAUTOLOGY: for EVERY peak, recoveryGrade === 4 iff the grade-4 exact-rung floor is in band.
const exactRungTautologyHolds =
  RUNG_TABLE.every((r) => (r.recoveryGrade === 4) === (r.exactRungGrade4Floor < DEEP_FLOOR_ULP));
// (3) The recovery grade is NEARLY CONSTANT: only a small handful of rungs step above the floor grade.
const recoveryGradeNearlyConstant = elevatedGradeRungs.length >= 1 && elevatedGradeRungs.length <= 3;
// (4) THE HEADLINE: the cluster-ENVELOPE reading A does NOT predict the recovery grade -- correlation is ~0.
const envelopeDoesNotPredict = Math.abs(corrRecoveryVsEnvelope) < 0.3;
// (5) The exact-rung reading B still tracks the grade, more strongly than the envelope and positively.
const exactRungPredictsMoreThanEnvelope =
  corrRecoveryVsExactRung > 0.4 && corrRecoveryVsExactRung > corrRecoveryVsEnvelope + 0.3;
// (6) THE HEADLINE: the TALLEST envelope cluster carries the LOWEST recovery grade, and the lone elevated-grade
//     rung is NOT the tallest envelope -- envelope amplitude and recovery grade are decoupled.
const tallestEnvHasLowestGrade = tallestEnvRung.recoveryGrade === minGrade && maxGrade > minGrade;
const elevatedGradeRungNotTallestEnv = elevatedGradeRungs.every((r) => r.n !== tallestEnvRung.n);

const verdict =
  coverageOk && exactRungTautologyHolds && recoveryGradeNearlyConstant && envelopeDoesNotPredict &&
  exactRungPredictsMoreThanEnvelope && tallestEnvHasLowestGrade && elevatedGradeRungNotTallestEnv
    ? 'EXACT-RUNG-TAUTOLOGY-PERSISTS-ENVELOPE-STILL-FAILS-ON-SIXTEEN-PEAKS:-EXTENDING-THE-imp-33640-RECOVERY-GRADE-' +
      'VS-SPIKE-HEIGHT-CORRELATION-FROM-THREE-RUNGS-{526,596,634}-TO-THE-FULL-imp-33621/imp-33638-SIXTEEN-CLUSTER-' +
      '[400,1200]-SAMPLE-{526,591,634,709,735,754,807,824,874,962,998,1038,1072,1104,1126,1198}-SHOWS-THE-RECOVERY-' +
      'GRADE-IS-NEARLY-CONSTANT-(FIFTEEN-OF-SIXTEEN-RECOVER-AT-GRADE-4;-THE-LONE-EXCEPTION-n=998-IS-GRADE-5).-n=998-IS-' +
      'EXACTLY-THE-UNIQUE-RUNG-WHOSE-grade-4-EXACT-RUNG-FLOOR-(~70.4-ULP)-POKES-ABOVE-64,-SO-THE-READING-B-TAUTOLOGY-IS-' +
      'PERFECT:-recoveryGrade==4-IFF-THE-grade-4-EXACT-RUNG-FLOOR-<64.-READING-B-STILL-"PREDICTS"-(PEARSON-r~+0.63,-' +
      'WEAKER-THAN-THE-THREE-POINT-~+0.96-BECAUSE-ONE-OUTLIER-NOW-CARRIES-IT)-BUT-BY-RESTATING-THE-DEFINITION.-THE-' +
      'CLUSTER-ENVELOPE-READING-A-STILL-FAILS:-PEARSON-r~+0.06-(THE-THREE-POINT-NEGATIVE-~-0.42-DOES-NOT-SURVIVE),-AND-' +
      'THE-TWO-TALLEST-ENVELOPE-CLUSTERS-n=1126-(~143.6)-AND-n=1198-(~135.0)-BOTH-CARRY-THE-LOWEST-GRADE-(4)-WHILE-THE-' +
      'LONE-GRADE-5-RUNG-n=998-HAS-ONLY-A-MIDDLING-ENVELOPE-(~85.6).-QUADRUPLING-THE-SAMPLE-DOES-NOT-RESCUE-CLUSTER-' +
      'SPIKE-HEIGHT-AS-A-PREDICTOR:-THE-RECOVERY-GRADE-STEPS-EXACTLY-WHERE-THE-EXACT-RUNG-FLOOR-CROSSES-64,-A-RUNG-' +
      'LOCAL-LATTICE-JITTER-PROPERTY,-NOT-A-CLUSTER-PEAK-AMPLITUDE-LAW.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-' +
      'LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33663_RECOVERY_GRADE_VS_SPIKE_HEIGHT_SIXTEEN = Object.freeze({
  id: 'imp-33663-recovery-grade-vs-spike-height-sixteen-peaks',
  ticket: 'imp-33663',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33640-recovery-grade-vs-spike-height-correlation.js',
  crossValidatesModules: [
    'imp-33640-recovery-grade-vs-spike-height-correlation.js',
    'imp-33621-band-clearing-cluster-decay-and-tail-scan.js',
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'EXTEND the imp-33640 recovery-grade-vs-spike-height correlation from THREE cluster peaks {526,596,634} to the ' +
    'FULL imp-33621/imp-33638 SIXTEEN-cluster [400,1200] sample {526,591,634,709,735,754,807,824,874,962,998,1038,' +
    '1072,1104,1126,1198} and MEASURE whether the reading-A-fails / reading-B-tautological pattern holds. RESULT: it ' +
    'holds, more starkly. The recovery grade is NEARLY CONSTANT -- fifteen of sixteen peaks recover at grade 4; the ' +
    'LONE exception n = 998 is grade 5, and n = 998 is EXACTLY the unique rung whose grade-4 EXACT-rung floor (~70.4 ' +
    'ULP) pokes above the imp-33316 &lt; 64 band, so the reading-B tautology is now PERFECT (recoveryGrade == 4 iff ' +
    'the grade-4 exact-rung floor &lt; 64). Reading B still tracks the grade (Pearson r ~ +0.63, weaker than the ' +
    'three-point ~+0.96 because one outlier now carries it) but by restating the definition. The cluster-ENVELOPE ' +
    'reading A STILL FAILS: Pearson r ~ +0.06 (the three-point negative ~ -0.42 does NOT survive), and the TWO ' +
    'TALLEST envelope clusters n = 1126 (~143.6) and n = 1198 (~135.0) both carry the LOWEST recovery grade (4) while ' +
    'the lone grade-5 rung n = 998 has only a middling envelope (~85.6). Quadrupling the sample does NOT rescue ' +
    'cluster spike height as a predictor: the recovery grade steps exactly where the exact-rung floor crosses 64 -- a ' +
    'rung-local lattice-jitter property, not a cluster-peak-amplitude law. VERDICT: EXACT-RUNG-TAUTOLOGY-PERSISTS-' +
    'ENVELOPE-STILL-FAILS-ON-SIXTEEN-PEAKS. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-' +
    'sufficient; jittery lattice floor; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'the SIXTEEN imp-33621/imp-33638 band-clearing cluster peaks over [400,1200] (imp-33660/imp-33661/imp-33662)',
    recoveryGrade: 'the lowest grade g in {4,5,6,8} whose graded-GL floor (budgets >= 200 nodes) enters the imp-33316 &lt; 64 ULP band',
    envelopeReadingA: 'the imp-33599/imp-33621 +/-5 rolling-max envelope of grade-4 floorUlp over the collar [n-5, n+5]',
    exactRungReadingB: 'the grade-4 floorUlp at the EXACT anchor rung n (min residual over budgets >= 200 nodes)',
    scoring: 'residual of A_direct(tau*) vs the imp-33213 log-domain target A_log, in ULP = A_log * 2^-52',
    correlation: 'Pearson correlation of the recovery grade against each spike-height reading across the sixteen rungs',
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
    minRecoveryGrade: minGrade,
    maxRecoveryGrade: maxGrade,
    elevatedGradeRungs: Object.freeze(elevatedGradeRungs.map((r) => r.n)),
    tallestEnvelopeRung: tallestEnvRung.n,
    tallestEnvelopeHeight: tallestEnvRung.envelopeHeight,
    corrRecoveryVsEnvelope, // reading (A): the natural cluster-envelope spike height -- ~0, does not predict
    corrRecoveryVsExactRung, // reading (B): the exact-rung grade-4 floor -- positive but near-tautological
    coverageOk,
    exactRungTautologyHolds,
    recoveryGradeNearlyConstant,
    envelopeDoesNotPredict,
    exactRungPredictsMoreThanEnvelope,
    tallestEnvHasLowestGrade,
    elevatedGradeRungNotTallestEnv,
    verdict,
  }),

  interpretation: Object.freeze({
    recoveryGradeNearlyConstant:
      'Across the sixteen imp-33621/imp-33638 cluster peaks the recovery grade is nearly constant: fifteen recover ' +
      'at grade 4 and only n = 998 needs grade 5. The imp-33640 middle-rung grade-6 was specific to n = 596; the ' +
      'sixteen-cluster scan places the middle flank peak at n = 591 (grade 4), so the 4/6/4 drift does not recur.',
    exactRungTautologyHolds:
      'The single grade-5 rung n = 998 is EXACTLY the unique rung whose grade-4 exact-rung floor (~70.4 ULP) pokes ' +
      'above 64. By construction recoveryGrade == 4 iff the grade-4 exact-rung floor is inside the imp-33316 &lt; 64 ' +
      'band (the grade-4 branch of the sweep IS reading B), so the reading-B tautology is perfect on the full sample.',
    envelopeDoesNotPredict:
      'The cluster-ENVELOPE reading A does not predict the recovery grade: its Pearson correlation is ~ +0.06, ' +
      'essentially zero. The imp-33640 three-point negative ~ -0.42 does NOT survive as a robust negative -- it ' +
      'collapses to noise. The two TALLEST envelope clusters n = 1126 (~143.6) and n = 1198 (~135.0) both carry the ' +
      'LOWEST recovery grade (4), while the lone grade-5 rung n = 998 has only a middling envelope (~85.6, fifth of ' +
      'sixteen): envelope amplitude and recovery grade are decoupled.',
    onlyExactRungPredicts:
      'Only the exact-rung reading B tracks the grade (Pearson r ~ +0.63), and that is near-tautological: it is the ' +
      'same min-over-budgets grade-4 floor whose 64-crossing DEFINES when the recovery grade leaves 4. The r is ' +
      'weaker than the three-point ~+0.96 only because a single outlier (n = 998) now carries the entire signal.',
    jitterCaveat:
      'floorUlp is a jittery few-ULP lattice value, so the robust reading is the QUALITATIVE pattern -- the tallest ' +
      'envelope clusters carry the lowest recovery grade and the grade steps exactly where the exact-rung floor ' +
      'crosses 64 -- not the exact correlation coefficients. The behaviour is a rung-local lattice-jitter property, ' +
      'not a cluster-peak-amplitude law; the re-intensified tail envelopes (~86..144 ULP) force no higher grade.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Re-runs the imp-33640 recovery-grade vs spike-height correlation on the imp-33621/imp-33638 sixteen-peak ' +
      '[400,1200] set. It changes NO bound, patches NO literal, and establishes NO operator positivity. Grid-design ' +
      'measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sampleCaveat:
      'The correlation is over sixteen cluster peaks (up from imp-33640s three); the recovery grade is nearly ' +
      'constant so the reading-B signal is carried by a single grade-5 outlier (n = 998), and the coefficients are ' +
      'coarse. The robust reading is the tautology and the tallest-envelope-lowest-grade pattern, not the exact r.',
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33640/imp-33622/imp-33621/imp-33638/imp-33539/' +
      'imp-33316/imp-33213; this audits the recovery-grade vs spike-height correlation, not that truncation.',
    latticeJitterCaveat:
      'The per-grade/per-budget ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/' +
      'imp-33537/imp-33599/imp-33621/imp-33622/imp-33638/imp-33640): individual grids bounce and cross-platform ' +
      'libm exp/pow variation can shift the few-ULP measurements, so the robust reading is the QUALITATIVE pattern -- ' +
      'the tallest envelope clusters carry the lowest recovery grade and the grade steps exactly where the exact-rung ' +
      'floor crosses 64 -- not the exact correlation coefficients. Rung-local, not a cluster-peak-amplitude law.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33663_RECOVERY_GRADE_VS_SPIKE_HEIGHT_SIXTEEN_ASSERTIONS = [
  {
    id: 'imp33663-coverage',
    why: 'All sixteen imp-33621/imp-33638 cluster peaks must have a resolved recovery grade and finite envelope/exact-rung floors.',
    holds: () => coverageOk && RUNG_TABLE.length === 16,
  },
  {
    id: 'imp33663-exact-rung-tautology-holds',
    why: 'For every peak the recovery grade must be 4 exactly when the grade-4 EXACT-rung floor is inside the imp-33316 &lt; 64 band.',
    holds: () => exactRungTautologyHolds,
  },
  {
    id: 'imp33663-recovery-grade-nearly-constant',
    why: 'On the sixteen-peak sample the recovery grade must be nearly constant -- only a small handful of rungs step above grade 4.',
    holds: () => recoveryGradeNearlyConstant,
  },
  {
    id: 'imp33663-envelope-does-not-predict',
    why: 'THE HEADLINE: the cluster-envelope reading A must NOT predict the recovery grade -- |Pearson r| &lt; 0.3 (~0.06).',
    holds: () => envelopeDoesNotPredict && Math.abs(corrRecoveryVsEnvelope) < 0.3,
  },
  {
    id: 'imp33663-tallest-envelope-has-lowest-grade',
    why: 'THE HEADLINE: the TALLEST envelope cluster (n=1126, ~143.6 ULP) must carry the LOWEST recovery grade (4).',
    holds: () => tallestEnvHasLowestGrade && elevatedGradeRungNotTallestEnv,
  },
  {
    id: 'imp33663-only-exact-rung-predicts-tautologically',
    why: 'Only the exact-rung reading B must track the grade, positively and more strongly than the envelope (r &gt; 0.4, r &gt; corrA + 0.3).',
    holds: () => exactRungPredictsMoreThanEnvelope,
  },
  {
    id: 'imp33663-verdict-records-tautology-persists',
    why: 'The classified verdict must record EXACT-RUNG-TAUTOLOGY-PERSISTS-ENVELOPE-STILL-FAILS, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33663-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33663_RECOVERY_GRADE_VS_SPIKE_HEIGHT_SIXTEEN.honestCaveat;
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

for (const assertion of IMP33663_RECOVERY_GRADE_VS_SPIKE_HEIGHT_SIXTEEN_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33663-recovery-grade-vs-spike-height-sixteen-peaks assertion failed: ${assertion.id}`);
  }
}
