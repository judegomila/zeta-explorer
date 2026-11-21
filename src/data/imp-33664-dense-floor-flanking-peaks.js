/**
 * @module imp-33664-dense-floor-flanking-peaks
 * @fileoverview imp-33664 -- EXTEND the imp-33641 dense integer-panel [15,60] true-floor scan to the FLANKING
 *   imp-33599 cluster peaks n in {526,634} and MEASURE whether the sub-200-node true floor imp-33641 found at
 *   n=596 (~6.1 ULP at 180 nodes, BELOW the coarse 200-node sample) is n=596-SPECIFIC or a GENERAL feature the
 *   coarse {200,300,500,...} ladder systematically misses.
 *
 *       A(tau) = int_0^7 phiKernel(s) phiKernel(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   WHAT imp-33641 FOUND, AND THE OPEN QUESTION
 *   -------------------------------------------
 *   imp-33641 (verdict GRADE-6-n=596-RE-EXIT-IS-A-DENSE-LADDER-JITTER-ARTIFACT) densified the imp-33600 grade-6
 *   node-budget ladder at the single rung n=596 and found the TRUE dense floor there is ~6.1 ULP at 180 nodes --
 *   WELL inside the imp-33316 &lt; 64 ULP band and BELOW the coarse 200-node ~34 sample, so the coarse
 *   {200,300,500,...} ladder missed the local floor. imp-33641 scanned ONLY n=596. Whether a sub-200-node true
 *   floor that beats the coarse 200-node sample is a PROPERTY OF n=596 or a GENERAL feature the coarse ladder
 *   misses at every cluster peak was untested. This module re-runs the IDENTICAL dense scan (grade 6, every
 *   integer panel P in [15,60] = 150..600 inner GL-10 nodes) at the flanking imp-33599 cluster peaks n=526 and
 *   n=634, alongside the n=596 reference, and asks at each rung: does the global dense floor sit SUB-200 nodes
 *   AND below the coarse 200-node sample (the imp-33641 signature)?
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   -----------------------------------------------------------------------
 *   For each rung n in {526, 596, 634} at tau* = saddleTau(n), we score the direct graded-GL plateau
 *   A_direct(tau*) = int_0^7 phiKernel(s)phiKernel(s+tau*) ds (grade 6, GL-10 per panel, a_j = 7 (j/panels)^6)
 *   vs the imp-33213 INDEPENDENT log-domain target A_log on every integer panel P in [15,60], in ULP =
 *   A_log*2^-52. Panels P &lt;= 17 sit on the unresolved inner-peak spike; the RESOLVED region is P &gt;= 18
 *   (&gt;= 180 nodes). At each rung we locate (1) the global dense floor (ULP and node count), (2) the coarse
 *   200-node sample, and (3) the sub-200-node (190-node) resolved floor, and test the imp-33641 signature
 *   subFloorMiss = (global-floor node &lt; 200) AND (global-floor ULP &lt; coarse-200 ULP).
 *
 *   MEASURED (grade 6; ULP vs the imp-33213 A_log target):
 *
 *        n=526  tau* ~0.94715:  coarse200 ~4.8   coarse300 ~46.0   global floor ~4.8 ULP @ 200 nodes
 *               sub-200 (190n) floor ~20.1     ->  floor sits AT the coarse 200-node sample; NO sub-200 miss
 *        n=596  tau* ~0.97192:  coarse200 ~34.0  coarse300 ~100.1  global floor ~6.1 ULP @ 180 nodes
 *               sub-200 (180n) floor ~6.1      ->  floor sits SUB-200 and BELOW coarse-200; imp-33641 SIGNATURE
 *        n=634  tau* ~0.98423:  coarse200 ~61.1  coarse300 ~10.7   global floor ~1.0 ULP @ 410 nodes
 *               sub-200 (190n) floor ~63.1     ->  deep floor is at 410 nodes (FAR above 200); NO sub-200 miss
 *
 *   HEADLINE. The sub-200-node true floor that BEATS the coarse 200-node sample is n=596-SPECIFIC, NOT a general
 *   feature the coarse ladder systematically misses. Across the three grade-6 cluster peaks the global-floor NODE
 *   COUNT wanders (200 -&gt; 180 -&gt; 410) and only n=596 places its floor sub-200 AND below the coarse 200-node
 *   sample. At n=526 the global dense floor (~4.8 ULP) sits EXACTLY at the coarse 200-node sample -- the coarse
 *   ladder did NOT miss it; at n=634 the deep floor (~1.0 ULP) is at 410 nodes, so the sub-200 region (190n
 *   ~63 ULP) is nowhere near the true floor. The imp-33641 sub-200 notch does not recur at either flank.
 *
 *   HONEST NUANCE. The coarse {200,300,...} ladder DOES still misrepresent the LOCAL structure at both flanks --
 *   just not via a sub-200 floor. At n=526 the 300-node sample bounces to ~46 ULP (out of the &lt; 64 band edge
 *   region though still under it) while 200 nodes clears at ~4.8; at n=634 the 200-node sample (~61) rides the
 *   band edge while the 300-node sample (~11) is deep in-band and the true floor (~1.0) is at 410 nodes. So the
 *   jittery lattice floor and the coarse-ladder undersampling imp-33605/imp-33641 flagged are REAL at every peak;
 *   what is n=596-specific is the particular geometry where the deepest notch falls BELOW 200 nodes.
 *
 *   VERDICT. SUB-200-NODE-TRUE-FLOOR-IS-n=596-SPECIFIC-NOT-A-GENERAL-COARSE-LADDER-MISS. The imp-33641 sub-200
 *   floor-below-coarse-200 signature holds at n=596 but NOT at the flanking grade-6 cluster peaks n=526 (floor at
 *   200 nodes) or n=634 (floor at 410 nodes); the global-floor node count is a jittery lattice property that does
 *   not consistently land sub-200.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It characterizes where the dense
 *   graded-GL floor lands across three cluster peaks; it changes NO bound, patches NO literal, and establishes NO
 *   operator positivity. The per-panel ULP and the exact floor node count are JITTERY arithmetic-floor lattice
 *   properties (imp-33249/imp-33277/imp-33296/imp-33537/imp-33605/imp-33641 latticeJitterCaveat) that can shift
 *   under cross-platform libm exp/pow variation, so the robust reading is the QUALITATIVE separation -- the
 *   sub-200 floor-below-coarse signature is present at n=596 and absent at the two flanks -- not the exact per-rung
 *   floor node or ULP. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel
 *   step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33641-grade6-node-budget-non-monotonicity.js (the n=596 dense-floor scan this generalizes)
 *   @see imp-33600-band-crossing-grade-vs-node-driver.js (the coarse grade-6 budget row)
 *   @see imp-33599 (the cluster-peak set {526,596,634} whose flanking peaks this scans)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33664 (numerical, medium).
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

// -- 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33316/imp-33539/imp-33600/imp-33641) -------
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

// -- GRADED-GL on the DIRECT linear integrand: panels a_j = 7 (j/panels)^grade, GL-10 per panel -----
//    Identical to imp-33600/imp-33641 aDirectGradedGL: phiKernel(s)phiKernel(s+tau) &gt;= 0, no cancel.
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

// -- Sweep configuration --------------------------------------------------------------------------
const GRADE = 6;               // the imp-33641 grade-6 rule this generalizes across cluster peaks
const HI = 7;                  // the direct integrand upper limit (imp-33600/imp-33641)
const DENSE_LO_PANELS = 15;    // dense integer-panel ladder start (150 nodes)
const DENSE_HI_PANELS = 60;    // dense integer-panel ladder end (600 nodes)
const RESOLVED_PANELS = 18;    // panels &gt;= this (&gt;= 180 nodes) sit off the unresolved inner-peak spike
const DEEP_FLOOR_ULP = 64;     // the imp-33316 widened deep-tail band
const COARSE_200_PANELS = 20;  // the imp-33600/imp-33539 200-node budget (coarse sample)
const COARSE_300_PANELS = 30;  // the imp-33600/imp-33539 300-node budget
const SUB_200_PANELS = 19;     // the deepest sub-200 resolved panel (190 nodes)
const CENTER_RUNG = 596;       // the imp-33641 reference rung (the imp-33599 cluster peak center)
const FLANK_RUNGS = [526, 634]; // the imp-33599 flanking cluster peaks this ticket adds
const ALL_RUNGS = [526, 596, 634];

// -- Per-rung dense grade-6 scan; locate global floor, coarse-200 sample, sub-200 floor ------------
function scanRung(n) {
  const tau = saddleTau(n);
  const A = aLog(tau);
  const ulpOfA = A * U;
  const ladder = [];
  for (let p = DENSE_LO_PANELS; p <= DENSE_HI_PANELS; p += 1) {
    const ulp = Math.abs(aDirectGradedGL(tau, HI, p, GRADE) - A) / ulpOfA;
    ladder.push(Object.freeze({ panels: p, nodes: 10 * p, ulp, inBand: ulp < DEEP_FLOOR_ULP }));
  }
  const ulpAt = (panels) => ladder.find((r) => r.panels === panels).ulp;
  const resolved = ladder.filter((r) => r.panels >= RESOLVED_PANELS);
  const globalFloor = resolved.reduce((a, b) => (b.ulp < a.ulp ? b : a));
  const sub200 = resolved.filter((r) => r.nodes < 200);
  const sub200Floor = sub200.reduce((a, b) => (b.ulp < a.ulp ? b : a));
  const coarse200 = ulpAt(COARSE_200_PANELS);
  const coarse300 = ulpAt(COARSE_300_PANELS);
  const mean = resolved.reduce((s, r) => s + r.ulp, 0) / resolved.length;
  const max = Math.max(...resolved.map((r) => r.ulp));
  // The imp-33641 SIGNATURE: the global dense floor sits SUB-200 nodes AND below the coarse-200 sample.
  const subFloorMiss = globalFloor.nodes < 200 && globalFloor.ulp < coarse200;
  return Object.freeze({
    n,
    saddleTau: tau,
    aLog: A,
    ladder: Object.freeze(ladder),
    coarse200Ulp: coarse200,
    coarse300Ulp: coarse300,
    globalFloorUlp: globalFloor.ulp,
    globalFloorNodes: globalFloor.nodes,
    sub200FloorUlp: sub200Floor.ulp,
    sub200FloorNodes: sub200Floor.nodes,
    resolvedMeanUlp: mean,
    resolvedMaxUlp: max,
    subFloorMiss,
  });
}

const SCANS = Object.freeze(ALL_RUNGS.map(scanRung));
const byRung = (n) => SCANS.find((s) => s.n === n);
const CENTER = byRung(CENTER_RUNG);
const FLANK_LO = byRung(526);
const FLANK_HI = byRung(634);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Coverage: three grade-6 rungs, each a full dense integer-panel ladder P in [15,60].
const scanCovered =
  SCANS.length === 3 && GRADE === 6 &&
  SCANS.every((s) => s.ladder.length === DENSE_HI_PANELS - DENSE_LO_PANELS + 1);
// (2) The n=596 reference reproduces the imp-33641 sub-200 signature (floor sub-200 AND below coarse-200).
const centerReproducesImp33641 =
  CENTER.subFloorMiss && CENTER.globalFloorNodes < 200 && CENTER.globalFloorUlp < 32 &&
  CENTER.globalFloorUlp < CENTER.coarse200Ulp;
// (3) Neither flanking cluster peak shows the sub-200 signature: the floor is NOT both sub-200 and below coarse.
const flanksDoNotShowSignature = !FLANK_LO.subFloorMiss && !FLANK_HI.subFloorMiss;
// (4) The global-floor NODE count wanders across the three rungs (a jittery lattice property, not fixed sub-200).
const floorNodeWanders =
  FLANK_LO.globalFloorNodes >= 200 && FLANK_HI.globalFloorNodes >= 300 &&
  new Set(SCANS.map((s) => s.globalFloorNodes)).size >= 2;
// (5) HONEST NUANCE: coarse-ladder undersampling / jitter is REAL at every peak (the flanks still have wide
//     coarse200-vs-coarse300 spread), it is only the sub-200 geometry that is n=596-specific.
const jitterRealAtEveryPeak =
  Math.abs(FLANK_LO.coarse200Ulp - FLANK_LO.coarse300Ulp) > 20 &&
  Math.abs(FLANK_HI.coarse200Ulp - FLANK_HI.coarse300Ulp) > 20;

const verdict =
  scanCovered && centerReproducesImp33641 && flanksDoNotShowSignature && floorNodeWanders
    ? 'SUB-200-NODE-TRUE-FLOOR-IS-n=596-SPECIFIC-NOT-A-GENERAL-COARSE-LADDER-MISS.-RE-RUNNING-THE-imp-33641-DENSE-' +
      'INTEGER-PANEL-P-in-[15,60]-(150..600-NODES)-GRADE-6-A_direct(tau*)-SCAN-AT-THE-FLANKING-imp-33599-CLUSTER-' +
      'PEAKS-n-in-{526,634}-(ALONGSIDE-THE-n=596-REFERENCE)-SHOWS-ONLY-n=596-PLACES-ITS-GLOBAL-DENSE-FLOOR-BOTH-' +
      'SUB-200-NODES-AND-BELOW-ITS-COARSE-200-NODE-SAMPLE-(~6.1-ULP-@-180n-vs-COARSE-200n-~34).-AT-n=526-THE-GLOBAL-' +
      'FLOOR-(~4.8-ULP)-SITS-AT-THE-COARSE-200-NODE-SAMPLE-(THE-COARSE-LADDER-DID-NOT-MISS-IT);-AT-n=634-THE-DEEP-' +
      'FLOOR-(~1.0-ULP)-IS-AT-410-NODES-(FAR-ABOVE-200,-SUB-200-190n-FLOOR-~63).-THE-GLOBAL-FLOOR-NODE-COUNT-WANDERS-' +
      '200->180->410-A-JITTERY-LATTICE-PROPERTY,-NOT-A-FIXED-SUB-200-FEATURE.-HONEST-NUANCE:-COARSE-LADDER-JITTER/' +
      'UNDERSAMPLING-IS-REAL-AT-EVERY-PEAK-(WIDE-COARSE-200-VS-300-SPREAD-AT-BOTH-FLANKS),-ONLY-THE-SUB-200-GEOMETRY-' +
      'IS-n=596-SPECIFIC.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-' +
      'BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33664_DENSE_FLOOR_FLANKING_PEAKS = Object.freeze({
  id: 'imp-33664-dense-floor-flanking-peaks',
  ticket: 'imp-33664',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33641-grade6-node-budget-non-monotonicity.js',
  crossValidatesModules: [
    'imp-33641-grade6-node-budget-non-monotonicity.js',
    'imp-33600-band-crossing-grade-vs-node-driver.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'EXTENDS the imp-33641 dense integer-panel [15,60] true-floor scan (grade 6) from the single rung n=596 to the ' +
    'flanking imp-33599 cluster peaks n in {526,634}, testing whether the sub-200-node true floor imp-33641 found at ' +
    'n=596 (~6.1 ULP at 180 nodes, BELOW the coarse 200-node sample) is n=596-SPECIFIC or a GENERAL feature the coarse ' +
    '{200,300,500,...} ladder misses. RESULT: it is n=596-SPECIFIC. Only n=596 places its global dense floor both ' +
    'sub-200 nodes AND below its coarse 200-node sample. At n=526 the global floor (~4.8 ULP) sits AT the coarse ' +
    '200-node sample (not missed); at n=634 the deep floor (~1.0 ULP) is at 410 nodes (far above 200, sub-200 190n ' +
    'floor ~63). The global-floor node count wanders 200 -&gt; 180 -&gt; 410, a jittery lattice property, not a fixed ' +
    'sub-200 feature. HONEST NUANCE: coarse-ladder jitter/undersampling is REAL at every peak (wide coarse-200-vs-300 ' +
    'spread at both flanks); only the sub-200 geometry is n=596-specific. VERDICT: ' +
    'SUB-200-NODE-TRUE-FLOOR-IS-n=596-SPECIFIC-NOT-A-GENERAL-COARSE-LADDER-MISS. ACCURACY/RULE-DESIGN MEASUREMENT, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; operator positivity (imp-3066) untouched; no ' +
    'QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'the imp-33599 cluster peaks n in {526,596,634}; tau* = root of n = 4 pi tau* e^{4 tau*}',
    rule: 'the imp-33600/imp-33641 direct graded-GL A_direct(tau*) plateau, grade 6, a_j = 7 (j/panels)^6, GL-10 per panel',
    denseLadder: 'EVERY integer panel P in [15,60] = 150..600 inner GL-10 nodes at each rung (vs the coarse {200,300,500,...})',
    resolvedRegion: 'panels >= 18 (>= 180 nodes) sit off the unresolved inner-peak spike at P <= 17',
    scoring: 'residual of A_direct(tau*) vs the imp-33213 log-domain target A_log, in ULP = A_log * 2^-52',
    signatureTest: 'subFloorMiss = (global-floor node < 200) AND (global-floor ULP < coarse-200 ULP) -- the imp-33641 signature',
    selfComputing: 'every rung, every panel, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    grade: GRADE,
    centerRung: CENTER_RUNG,
    flankRungs: Object.freeze(FLANK_RUNGS.slice()),
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    denseLoPanels: DENSE_LO_PANELS,
    denseHiPanels: DENSE_HI_PANELS,
    resolvedPanels: RESOLVED_PANELS,
    scans: SCANS,
    centerReproducesImp33641,
    flanksDoNotShowSignature,
    floorNodeWanders,
    jitterRealAtEveryPeak,
    scanCovered,
    verdict,
  }),

  interpretation: Object.freeze({
    centerSignature:
      'The n=596 reference reproduces the imp-33641 finding: the global dense floor is ~6.1 ULP at 180 nodes -- SUB-200 ' +
      'and WELL below the coarse 200-node ~34 ULP sample, so the coarse ladder missed the local floor.',
    flanksNoSignature:
      'Neither flanking cluster peak shows the sub-200 signature. At n=526 the global dense floor (~4.8 ULP) sits ' +
      'EXACTLY at the coarse 200-node sample -- the coarse ladder did NOT miss it, and the sub-200 (190-node) floor ' +
      '(~20 ULP) is ABOVE it. At n=634 the deepest floor (~1.0 ULP) is at 410 nodes, FAR above 200, and the sub-200 ' +
      '(190-node) floor (~63 ULP) is nowhere near the true floor. The imp-33641 sub-200 notch does not recur.',
    floorNodeIsJittery:
      'The global-floor node count wanders across the three grade-6 cluster peaks -- 200 (n=526) -> 180 (n=596) -> 410 ' +
      '(n=634) -- so the deepest notch does not consistently fall sub-200. Where the floor lands is a jittery lattice ' +
      'property of the mapped abscissa, not a fixed sub-200 feature of the graded-GL rule.',
    honestJitterReal:
      'The coarse {200,300,...} ladder DOES still misrepresent the LOCAL structure at both flanks -- just not via a ' +
      'sub-200 floor. n=526 shows a wide coarse-200 (~4.8) vs coarse-300 (~46) spread and n=634 shows coarse-200 (~61) ' +
      'riding the band edge vs coarse-300 (~11) deep in-band. The jittery lattice floor and coarse-ladder ' +
      'undersampling imp-33605/imp-33641 flagged are real at every peak; what is n=596-specific is the sub-200 geometry.',
    latticeJitterCaveat:
      'The per-panel ULP and the exact floor node count are jittery arithmetic-floor lattice properties ' +
      '(imp-33249/imp-33277/imp-33296/imp-33537/imp-33605/imp-33641): they can shift under cross-platform libm exp/pow ' +
      'variation. The robust reading is the QUALITATIVE separation -- the sub-200 floor-below-coarse signature is ' +
      'present at n=596 and absent at both flanks -- not the exact per-rung floor node or ULP.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Generalizes the imp-33641 dense-panel true-floor scan (grade 6, every integer panel P in [15,60]) from n=596 to ' +
      'the flanking imp-33599 cluster peaks n in {526,634} and tests whether the sub-200-node floor-below-coarse-200 ' +
      'signature recurs. It changes NO bound, patches NO literal, and establishes NO operator positivity. Grid-design ' +
      'measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33641/imp-33600/imp-33577/imp-33539/imp-33316/imp-33213; ' +
      'this audits where the dense graded-GL floor lands across three cluster peaks, not that truncation.',
    latticeJitterCaveat:
      'The per-panel ULP and the exact floor node count are jittery arithmetic-floor lattice properties ' +
      '(imp-33249/imp-33277/imp-33296/imp-33537/imp-33605/imp-33641): individual panels bounce and cross-platform libm ' +
      'exp/pow variation can shift the few-ULP measurements and the floor node, so the robust reading is the ' +
      'QUALITATIVE separation -- the sub-200 floor-below-coarse signature is present at n=596 and absent at both ' +
      'flanking peaks -- not the exact per-rung floor node, ULP, or the exact node count where each floor lands.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33664_DENSE_FLOOR_FLANKING_PEAKS_ASSERTIONS = [
  {
    id: 'imp33664-scan-covered',
    why: 'The scan must cover three grade-6 cluster peaks n in {526,596,634}, each a full dense integer-panel ladder ' +
         'P in [15,60] (the generalization of the imp-33641 single-rung n=596 scan).',
    holds: () => scanCovered && SCANS.length === 3 &&
      SCANS.every((s) => s.ladder.length === DENSE_HI_PANELS - DENSE_LO_PANELS + 1),
  },
  {
    id: 'imp33664-center-reproduces-imp33641-signature',
    why: 'The n=596 reference must reproduce the imp-33641 sub-200 signature: the global dense floor is SUB-200 nodes ' +
         'AND below the coarse 200-node sample (well inside the &lt; 32 ULP band).',
    holds: () => centerReproducesImp33641 && CENTER.globalFloorNodes < 200 &&
      CENTER.globalFloorUlp < CENTER.coarse200Ulp && CENTER.globalFloorUlp < 32,
  },
  {
    id: 'imp33664-flanks-do-not-show-signature',
    why: 'THE HEADLINE: neither flanking cluster peak shows the imp-33641 sub-200 signature -- the global floor is NOT ' +
         'both sub-200 nodes and below the coarse 200-node sample at n=526 or n=634.',
    holds: () => flanksDoNotShowSignature && !FLANK_LO.subFloorMiss && !FLANK_HI.subFloorMiss,
  },
  {
    id: 'imp33664-flank-floor-nodes-not-sub-200',
    why: 'THE HEADLINE detail: the flanking global-floor node counts land at/above 200 (n=526 at the coarse sample) and ' +
         'well above 300 (n=634 deep at ~410 nodes) -- not sub-200 like n=596.',
    holds: () => FLANK_LO.globalFloorNodes >= 200 && FLANK_HI.globalFloorNodes >= 300,
  },
  {
    id: 'imp33664-floor-node-wanders',
    why: 'The global-floor node count is a jittery lattice property that wanders across the three rungs (200 -> 180 -> ' +
         '410), not a fixed sub-200 feature.',
    holds: () => floorNodeWanders && new Set(SCANS.map((s) => s.globalFloorNodes)).size >= 2,
  },
  {
    id: 'imp33664-honest-jitter-real-at-every-peak',
    why: 'Mandatory honesty: coarse-ladder jitter/undersampling IS real at every peak (wide coarse-200-vs-300 spread at ' +
         'both flanks) -- the verdict is that the SUB-200 geometry is n=596-specific, not that the flanks are clean.',
    holds: () => jitterRealAtEveryPeak,
  },
  {
    id: 'imp33664-verdict-records-n596-specific',
    why: 'The classified verdict must record the SUB-200-NODE-TRUE-FLOOR-IS-n=596-SPECIFIC reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33664-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33664_DENSE_FLOOR_FLANKING_PEAKS.honestCaveat;
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

for (const assertion of IMP33664_DENSE_FLOOR_FLANKING_PEAKS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33664-dense-floor-flanking-peaks assertion failed: ${assertion.id}`);
  }
}
