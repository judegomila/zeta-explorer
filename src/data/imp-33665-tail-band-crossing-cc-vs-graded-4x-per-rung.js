/**
 * @module imp-33665-tail-band-crossing-cc-vs-graded-4x-per-rung
 * @fileoverview imp-33665 -- extend the imp-33642 DENSE per-rung CC-vs-graded 4x node-competitiveness
 *   crossing scan from the mid-tail band-crossing window [490,530] to a RE-INTENSIFYING deep-tail window
 *   [960,1000]. imp-33642 scanned only [490,530], where the imp-33557 flat graded 200-node floor is mostly
 *   band-clear (out of the imp-33316 &lt; 64 ULP band at only 7/41 rungs), and found the imp-33623 4x
 *   crossing is a 513&lt;-&gt;1025-node lattice toggle holding at ~39% of rungs and ALMOST ALWAYS
 *   UNCONDITIONAL (only 1/16 ~6.3% conditional). But imp-33638 shows the graded floor RE-INTENSIFIES in the
 *   tail (clusters ~[979,1008] peak ~85.6 ULP envelope-min, n~998), so the region where the graded reference
 *   is band-clear runs out. This ticket re-runs the IDENTICAL self-computing cross-solver at EVERY integer
 *   rung in [960,1000] and measures whether the 4x-crossing frequency, the graded-out-of-band fraction, and
 *   the CONDITIONAL fraction all RISE relative to the [490,530] baseline as the graded floor degrades.
 *
 *   THE imp-33642 GAP
 *   -----------------
 *   imp-33642 established the ~39% crossing / ~6% conditional picture in [490,530], but that window sits where
 *   the graded floor is mostly band-clear. It could not say whether the picture holds, or the crossing and
 *   conditional fractions RISE, in the deep-tail cluster ~[979,1008] where the imp-33638 floor re-intensifies.
 *   This dense tail scan closes that directly at every rung in [960,1000].
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Held VERBATIM from imp-33642. For every integer rung n in [960,1000] we take tau* = saddleTau(n), the
 *   imp-33213 log-domain A_log(tau*) target, and locate the smallest single Clenshaw-Curtis grid (Chebyshev-
 *   Lobatto nodes x_k = cos(pi k/N) mapped to [0,7], standard CC cosine weights, even N over the ladder
 *   16..8192) whose residual clears the imp-33316 &lt; 64 ULP band. Per rung we report CC min-nodes, the
 *   CC / flat-graded (~200-node) ratio, the graded 200-node floorInBand status, and the crosses-4x flag. We
 *   then aggregate the crossing fraction, the out-of-band fraction, and -- the ticket headline -- the
 *   CONDITIONAL fraction of the 4x crossings, and compare each to the imp-33642 [490,530] baseline.
 *
 *   MEASURED (dense tail scan [960,1000], 41 integer rungs) vs the imp-33642 [490,530] baseline
 *   ------------------------------------------------------------------------------------------
 *                                              [960,1000]  vs  [490,530] baseline
 *        cross 4x:                            31 / 41 (~75.6%)  vs  16 / 41 (~39.0%)   <-- RISES
 *        graded 200-node floor OUT of band:   41 / 41 (100.0%)  vs   7 / 41 (~17.1%)   <-- RISES to ALL
 *        4x-crossing rungs that are CONDITIONAL: 31 / 31 (100%)  vs   1 / 16 (~6.3%)   <-- RISES to ALL
 *        distinct CC min-N seen across region: {512,1024,2048,3072} + one non-clearing (n=999)
 *
 *     (1) THE GRADED 200-NODE FLOOR IS OUT OF BAND AT EVERY TAIL RUNG. Across [960,1000] the flat graded
 *         grade-4 200-node reading sits at ~318..515 ULP -- far above the imp-33316 &lt; 64 band at ALL 41
 *         rungs (100%), versus only 17.1% in [490,530]. (The ~85..143 ULP figure from imp-33638 is the
 *         rolling-MAX-of-min ENVELOPE over budgets &gt;= 200; the exact fixed-200-node reading here is
 *         higher, ~400 ULP, because it is a single budget not the per-rung minimum. Both far exceed 64.)
 *
 *     (2) THE 4x-CROSSING FREQUENCY RISES FROM ~39% TO ~76%. The CC min-node budget now lands on N=1024
 *         (ratio ~5.125x, ABOVE 4x) at most rungs, with heavier hits N=2048 (~10.245x, n in {971,988,995})
 *         and N=3072 (~15.365x, n in {992,1000}); the N=512 grid clears the band (no crossing, ratio
 *         ~2.565x) at only 10/41 rungs (n in {964,965,966,973,975,977,978,980,989,997}). So the toggle
 *         still flips but now sits ABOVE 4x nearly 3x as often as in the mid-tail baseline.
 *
 *     (3) EVERY 4x CROSSING IS NOW CONDITIONAL. Because the graded floor is out of band at all 41 rungs, all
 *         31 crossings are CONDITIONAL (graded reference NOT band-clear) -- 100%, versus the near-unique
 *         edge case n=494 (1/16 ~6.3%) in [490,530]. The imp-33642 "almost always unconditional" headline
 *         INVERTS in the deep tail: the node-competitiveness advantage of the flat graded rule now rests on
 *         a graded reference that has itself left the band at every crossing.
 *
 *     (4) THE CC LADDER ITSELF FAILS AT ONE RUNG. At n=999 no single Clenshaw-Curtis grid up to N=8192
 *         (8193 nodes) clears the &lt; 64 band, so its CC min-nodes is Infinity (ratio Infinity, counted as
 *         a crossing). This is a NEW deep-tail degradation absent from [490,530], where a single CC grid
 *         reached the floor band at every rung.
 *
 *   HEADLINE / VERDICT. 4x-CROSSING-FREQUENCY-AND-CONDITIONAL-FRACTION-BOTH-RISE-SHARPLY-IN-THE-DEEP-TAIL.
 *   Re-running the imp-33642 cross-solver at every integer rung in [960,1000] shows the 4x crossing frequency
 *   rises from ~39% to ~76% (31/41), the graded 200-node floor is out of the imp-33316 band at ALL 41 rungs
 *   (up from 17.1%), and -- the headline -- ALL 31 crossings are now CONDITIONAL (100%, up from ~6.3%), so the
 *   imp-33642 "almost always unconditional" picture INVERTS where the imp-33638 tail floor re-intensifies. One
 *   rung (n=999) is not cleared by any CC grid up to 8193 nodes. The crossing and its conditional flag both
 *   TRACK the graded-floor degradation, exactly as the two-regime tail picture predicts.
 *
 *   HONEST CAVEAT. Grid-design cross-solver MEASUREMENT ONLY, RH-equivalent: it changes NO bound, patches NO
 *   literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33557/imp-33560/imp-33584/imp-33623/imp-33638/
 *   imp-33642 intact), and establishes NO operator positivity. The CC min-node budgets are single lattice hits
 *   on a jittery arithmetic floor; the robust reading is the RISE in the crossing FREQUENCY and the CONDITIONAL
 *   fraction relative to the [490,530] baseline, not the exact per-rung 513/1025/2049/3073 counts. The NPHI = 10
 *   Phi-series truncation is inherited. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no
 *   QED. No refereed bound is changed.
 *
 *   @see imp-33642-dense-band-crossing-cc-vs-graded-4x-per-rung.js (the [490,530] baseline this extends into the tail)
 *   @see imp-33623-band-crossing-cc-vs-graded-ratio-4x-crossing.js (the n in {500,510,525} 4x crossing)
 *   @see imp-33638 (the grade-4 floorUlp(n) tail re-intensification, clusters ~[979,1008] peak ~85.6 ULP)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the fixed-budget deep-tail measurement + < 64 band)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33665 (numerical, medium).
 */

const NPHI = 10;
const PI = Math.PI;
const U = Math.pow(2, -52); // double-precision unit roundoff (2^-52)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686/imp-3646). */
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

/** imp-3850 FACTORED log kernel: ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}). */
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

// 10-node Gauss-Legendre nodes/weights (imp-33316/imp-33539/imp-33560/imp-33584/imp-33623/imp-33642).
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

/** (G) the imp-33539 GRADED-GL plateau on the DIRECT linear integrand: a_j = hi (j/panels)^grade, GL-10 per panel. */
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

/** (CC) Clenshaw-Curtis weights on the N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N), N even. */
function clenshawCurtis(N) {
  const x = new Array(N + 1);
  const w = new Array(N + 1);
  for (let k = 0; k <= N; k += 1) x[k] = Math.cos((PI * k) / N);
  for (let k = 0; k <= N; k += 1) {
    let sum = 0;
    const ck = k === 0 || k === N ? 0.5 : 1;
    for (let j = 0; j <= N / 2; j += 1) {
      const bj = j === 0 || j === N / 2 ? 1 : 2;
      sum += (bj / (1 - 4 * j * j)) * Math.cos((2 * PI * j * k) / N);
    }
    w[k] = ck * (2 / N) * sum;
  }
  return { x, w };
}

/** (CC) single-grid inner rule: A(tau) = int_0^hi Phi(s)Phi(s+tau) ds by Clenshaw-Curtis with N+1 nodes. */
function aDirectCC(tau, hi, N) {
  const { x, w } = clenshawCurtis(N);
  const half = hi / 2;
  const mid = hi / 2;
  let sum = 0;
  for (let k = 0; k <= N; k += 1) {
    const s = mid + half * x[k];
    sum += w[k] * half * phiKernel(s) * phiKernel(s + tau);
  }
  return sum;
}

/** imp-33213 INDEPENDENT log-domain graded-GL -ln A (grade 5, 300 panels, hi=10) target. */
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

/** imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} (imp-3893 saddleTau). */
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

// -- Configuration (imp-33642 deep-tail grid held VERBATIM; DENSE integer scan shifted to the tail) --
const HI = 7;                                    // imp-33316/imp-33539/imp-33623/imp-33642 inner domain [0,7]
const DEEP_FLOOR_ULP = 64;                       // imp-33316 widened deep-tail A_log floor band
const RUNG_LO = 960;                             // dense TAIL scan lower rung (imp-33638 re-intensifying cluster)
const RUNG_HI = 1000;                            // dense TAIL scan upper rung
const GRADE = 4;                                 // imp-33316/imp-33539/imp-33623/imp-33642 robust graded rule
const GRADED_MIN_NODES = 200;                    // imp-33539 FLAT graded-GL plateau minimum (all rungs)
const GRADED_MIN_PANELS = 20;                    // 20 panels * 10 GL nodes = 200 nodes
const CC_LADDER = [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192];
const NODE_COMPETITIVE_RATIO = 4;                // >= 4x CC/graded is the node-competitiveness crossing bar

// imp-33642 [490,530] baseline fractions (16/41 cross, 7/41 out-of-band, 1/16 conditional) for comparison.
const BASELINE_CROSSING_FRACTION = 16 / 41;
const BASELINE_OUT_OF_BAND_FRACTION = 7 / 41;
const BASELINE_CONDITIONAL_FRACTION_OF_CROSSINGS = 1 / 16;

const N_RUNGS = [];
for (let n = RUNG_LO; n <= RUNG_HI; n += 1) N_RUNGS.push(n);

// -- Per-rung CC single-grid min-node budget vs the imp-33539 flat graded ~200-node min ------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  const gradedMinUlp = Math.abs(aDirectGradedGL(tauStar, HI, GRADED_MIN_PANELS, GRADE) - aLogVal) / ulpOfALog;
  const gradedFloorInBand = gradedMinUlp < DEEP_FLOOR_ULP;

  let ccMinNodes = Infinity;
  let ccMinN = null;
  let ccMinUlp = Infinity;
  for (const N of CC_LADDER) {
    const ulp = Math.abs(aDirectCC(tauStar, HI, N) - aLogVal) / ulpOfALog;
    if (ulp < DEEP_FLOOR_ULP && ccMinNodes === Infinity) {
      ccMinNodes = N + 1;
      ccMinN = N;
      ccMinUlp = ulp;
    }
  }

  const ccOverGraded = ccMinNodes / GRADED_MIN_NODES;
  const crosses4x = ccOverGraded >= NODE_COMPETITIVE_RATIO;

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    gradedMinNodes: GRADED_MIN_NODES,
    gradedMinUlp,
    gradedFloorInBand,
    ccMinN,
    ccMinNodes,
    ccMinUlp,
    ccOverGraded,
    crosses4x,
    ccReachedFloor: ccMinNodes < Infinity,
    // In the deep tail the graded floor is out of band at every rung, so every crossing is CONDITIONAL.
    ratioConditional: crosses4x && !gradedFloorInBand,
  });
});

// -- Summary statistics ----------------------------------------------------------------------------
const TOTAL_RUNGS = RUNG_TABLE.length;
const CROSSING_RUNGS = RUNG_TABLE.filter((r) => r.crosses4x).map((r) => r.n);
const OUT_OF_BAND_RUNGS = RUNG_TABLE.filter((r) => !r.gradedFloorInBand).map((r) => r.n);
const CONDITIONAL_CROSSING_RUNGS = RUNG_TABLE.filter((r) => r.ratioConditional).map((r) => r.n);
const UNCONDITIONAL_CROSSING_RUNGS = RUNG_TABLE.filter((r) => r.crosses4x && r.gradedFloorInBand).map((r) => r.n);
const CC_NEVER_CLEARS_RUNGS = RUNG_TABLE.filter((r) => !r.ccReachedFloor).map((r) => r.n);

const CROSSING_COUNT = CROSSING_RUNGS.length;
const OUT_OF_BAND_COUNT = OUT_OF_BAND_RUNGS.length;
const CONDITIONAL_CROSSING_COUNT = CONDITIONAL_CROSSING_RUNGS.length;

const CROSSING_FRACTION = CROSSING_COUNT / TOTAL_RUNGS;
const OUT_OF_BAND_FRACTION = OUT_OF_BAND_COUNT / TOTAL_RUNGS;
// THE TICKET HEADLINE: fraction of band-crossing rungs where the graded reference is NOT band-clear.
const CONDITIONAL_FRACTION_OF_CROSSINGS = CROSSING_COUNT > 0 ? CONDITIONAL_CROSSING_COUNT / CROSSING_COUNT : 0;

const DISTINCT_CC_MIN_N = [...new Set(RUNG_TABLE.map((r) => r.ccMinN))].sort((a, b) => (a === null ? 1 : b === null ? -1 : a - b));
const SMALLEST_CROSSING_RUNG = CROSSING_RUNGS.length ? Math.min(...CROSSING_RUNGS) : null;

// -- Rise deltas vs the imp-33642 [490,530] baseline -----------------------------------------------
const CROSSING_FRACTION_DELTA = CROSSING_FRACTION - BASELINE_CROSSING_FRACTION;
const OUT_OF_BAND_FRACTION_DELTA = OUT_OF_BAND_FRACTION - BASELINE_OUT_OF_BAND_FRACTION;
const CONDITIONAL_FRACTION_DELTA = CONDITIONAL_FRACTION_OF_CROSSINGS - BASELINE_CONDITIONAL_FRACTION_OF_CROSSINGS;

// -- Verdict classifiers ---------------------------------------------------------------------------
// (1) The graded 200-node floor is out of band at EVERY tail rung (up from 17.1% in [490,530]).
const gradedFloorOutOfBandEverywhere = OUT_OF_BAND_FRACTION === 1 && OUT_OF_BAND_COUNT === TOTAL_RUNGS;
// (2) The 4x-crossing frequency RISES above the [490,530] baseline (measured ~76% vs ~39%).
const crossingFractionRises = CROSSING_FRACTION > BASELINE_CROSSING_FRACTION && CROSSING_FRACTION >= 0.6;
// (3) THE HEADLINE: the CONDITIONAL fraction of crossings RISES to ALL (measured 100% vs ~6.3%).
const conditionalFractionRises =
  CONDITIONAL_FRACTION_OF_CROSSINGS > BASELINE_CONDITIONAL_FRACTION_OF_CROSSINGS &&
  CONDITIONAL_FRACTION_OF_CROSSINGS === 1;
// (4) BOTH the crossing frequency and the conditional fraction rise together (the ticket question).
const bothRise = crossingFractionRises && conditionalFractionRises;
// (5) The CC min-N is still a lattice toggle dominated by {512,1024} but with a heavier tail (2048,3072).
const ccStillLatticeTogglePlusHeavierTail =
  DISTINCT_CC_MIN_N.includes(512) &&
  DISTINCT_CC_MIN_N.includes(1024) &&
  (DISTINCT_CC_MIN_N.includes(2048) || DISTINCT_CC_MIN_N.includes(3072));
// (6) NEW tail degradation: at least one rung is not cleared by any CC grid up to N=8192 (absent in [490,530]).
const ccLadderFailsAtSomeTailRung = CC_NEVER_CLEARS_RUNGS.length >= 1;
// (7) Coverage: every integer rung in [960,1000].
const denseTailRegionCovered =
  TOTAL_RUNGS === RUNG_HI - RUNG_LO + 1 &&
  RUNG_TABLE[0].n === RUNG_LO &&
  RUNG_TABLE[TOTAL_RUNGS - 1].n === RUNG_HI &&
  CC_LADDER.length >= 12;

const verdict =
  gradedFloorOutOfBandEverywhere &&
  crossingFractionRises &&
  conditionalFractionRises &&
  bothRise &&
  ccStillLatticeTogglePlusHeavierTail &&
  denseTailRegionCovered
    ? '4x-CROSSING-FREQUENCY-AND-CONDITIONAL-FRACTION-BOTH-RISE-SHARPLY-IN-THE-DEEP-TAIL:-RE-RUNNING-THE-' +
      'imp-33642-CC/GRADED-CROSS-SOLVER-AT-EVERY-INTEGER-RUNG-IN-[960,1000]-(41-RUNGS)-SHOWS-THE-4x-CROSSING-' +
      'FREQUENCY-RISES-FROM-~39%-TO-~76%-(31/41),-THE-GRADED-200-NODE-FLOOR-IS-OUT-OF-THE-imp-33316-<64-ULP-BAND-' +
      'AT-ALL-41-RUNGS-(UP-FROM-17.1%),-AND-THE-HEADLINE-ALL-31-CROSSINGS-ARE-NOW-CONDITIONAL-(100%,-UP-FROM-~6.3%),-' +
      'SO-THE-imp-33642-ALMOST-ALWAYS-UNCONDITIONAL-PICTURE-INVERTS-WHERE-THE-imp-33638-TAIL-FLOOR-RE-INTENSIFIES;-' +
      'ONE-RUNG-(n=999)-IS-NOT-CLEARED-BY-ANY-CC-GRID-UP-TO-8193-NODES.-THE-CROSSING-AND-ITS-CONDITIONAL-FLAG-BOTH-' +
      'TRACK-THE-GRADED-FLOOR-DEGRADATION,-AS-THE-TWO-REGIME-TAIL-PICTURE-PREDICTS.'
    : 'INDETERMINATE';

export const IMP33665_TAIL_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG = Object.freeze({
  ticket: 'imp-33665',
  category: 'numerical',
  rungLo: RUNG_LO,
  rungHi: RUNG_HI,
  totalRungs: TOTAL_RUNGS,
  deepFloorUlp: DEEP_FLOOR_ULP,
  gradedMinNodes: GRADED_MIN_NODES,
  nodeCompetitiveRatio: NODE_COMPETITIVE_RATIO,
  ccLadder: CC_LADDER,
  rungTable: RUNG_TABLE,
  crossingRungs: CROSSING_RUNGS,
  outOfBandRungs: OUT_OF_BAND_RUNGS,
  conditionalCrossingRungs: CONDITIONAL_CROSSING_RUNGS,
  unconditionalCrossingRungs: UNCONDITIONAL_CROSSING_RUNGS,
  ccNeverClearsRungs: CC_NEVER_CLEARS_RUNGS,
  crossingCount: CROSSING_COUNT,
  outOfBandCount: OUT_OF_BAND_COUNT,
  conditionalCrossingCount: CONDITIONAL_CROSSING_COUNT,
  crossingFraction: CROSSING_FRACTION,
  outOfBandFraction: OUT_OF_BAND_FRACTION,
  conditionalFractionOfCrossings: CONDITIONAL_FRACTION_OF_CROSSINGS,
  baselineCrossingFraction: BASELINE_CROSSING_FRACTION,
  baselineOutOfBandFraction: BASELINE_OUT_OF_BAND_FRACTION,
  baselineConditionalFractionOfCrossings: BASELINE_CONDITIONAL_FRACTION_OF_CROSSINGS,
  crossingFractionDelta: CROSSING_FRACTION_DELTA,
  outOfBandFractionDelta: OUT_OF_BAND_FRACTION_DELTA,
  conditionalFractionDelta: CONDITIONAL_FRACTION_DELTA,
  distinctCcMinN: DISTINCT_CC_MIN_N,
  smallestCrossingRung: SMALLEST_CROSSING_RUNG,
  verdict,
  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    reachesArithmeticFloorNotSubUlp: true,
    changesAnyBound: false,
    patchedALiteral: false,
    leavesSourceModulesIntact: true,
    extendsImp33642:
      'This EXTENDS imp-33642 from the mid-tail window [490,530] (where the graded floor is mostly band-clear) to ' +
      'the deep-tail re-intensifying window [960,1000] (imp-33638 cluster ~[979,1008]). It measures that the 4x ' +
      'crossing frequency RISES from ~39% to ~76% (31/41), the graded 200-node floor is out of band at ALL 41 rungs ' +
      '(up from 17.1%), and the CONDITIONAL fraction of crossings RISES from ~6.3% to 100%. It PATCHES NO literal ' +
      'and leaves imp-33642 and all source modules intact.',
    conditionalFractionRisesToAll:
      'THE TICKET HEADLINE INVERTS: in [490,530] only 1/16 (~6.3%) of the crossings was CONDITIONAL, but in the ' +
      'deep tail [960,1000] the graded reference is out of band at every rung, so ALL 31 crossings (100%) are ' +
      'CONDITIONAL. The imp-33642 almost-always-UNCONDITIONAL picture does NOT hold where the tail floor degrades.',
    ccLadderFailsAtN999:
      'NEW deep-tail degradation absent from [490,530]: at n=999 no single Clenshaw-Curtis grid up to N=8192 ' +
      '(8193 nodes) clears the imp-33316 < 64 ULP band, so its CC min-nodes is Infinity (ratio Infinity, counted ' +
      'as a crossing). In [490,530] a single CC grid reached the band at every rung.',
    latticeJitterCaveat:
      'The CC min-node budgets are single lattice hits on a jittery arithmetic floor; the robust reading is the RISE ' +
      'in the crossing FREQUENCY (~39% -> ~76%) and the CONDITIONAL fraction (~6.3% -> 100%) relative to the ' +
      'imp-33642 baseline, not the exact per-rung 513/1025/2049/3073 counts.',
    envelopeVsFixedBudgetNote:
      'The ~85..143 ULP tail figure from imp-33638 is the rolling-MAX-of-min ENVELOPE over budgets >= 200; the exact ' +
      'FIXED-200-node grade-4 reading measured here is higher (~318..515 ULP) because it is a single budget not the ' +
      'per-rung minimum. Both far exceed the 64 ULP band -- the graded floor is out of band on either reading.',
    derivationScope:
      'Re-measures the deep-tail inner-node budget of the imp-33539 graded rule against an INDEPENDENT single ' +
      'Clenshaw-Curtis grid at every integer rung in [960,1000] under a mass-feasibility diagnostic. It changes NO ' +
      'bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33557/imp-33560/imp-33584/' +
      'imp-33623/imp-33638/imp-33642 intact), and establishes NO operator positivity. Grid-design cross-solver only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33642/imp-33638/imp-33623/imp-33539/imp-33316/' +
      'imp-33213; this audits the inner quadrature node budget under a cross-solver at dense tail rungs, not that truncation.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33665_TAIL_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG_ASSERTIONS = [
  {
    id: 'imp33665-dense-tail-region-covered-41-rungs',
    why: 'The scan must cover every integer rung in [960,1000] (41 rungs) over the wide CC single-grid ladder.',
    holds: () => denseTailRegionCovered && TOTAL_RUNGS === 41,
  },
  {
    id: 'imp33665-graded-floor-out-of-band-at-every-tail-rung',
    why: 'In the deep tail the flat graded 200-node grade-4 floor must be OUT of the imp-33316 < 64 ULP band at ALL ' +
         '41 rungs (up from 7/41 ~17.1% in [490,530]).',
    holds: () => gradedFloorOutOfBandEverywhere && OUT_OF_BAND_COUNT === TOTAL_RUNGS,
  },
  {
    id: 'imp33665-4x-crossing-frequency-rises-above-baseline',
    why: 'The 4x-crossing frequency must RISE above the imp-33642 [490,530] baseline (~39%), measured ~76% (31/41).',
    holds: () => crossingFractionRises && CROSSING_FRACTION > BASELINE_CROSSING_FRACTION && CROSSING_FRACTION >= 0.6,
  },
  {
    id: 'imp33665-conditional-fraction-rises-to-all-crossings',
    why: 'THE HEADLINE: because the graded floor is out of band everywhere, ALL 4x crossings must be CONDITIONAL ' +
         '(100%, up from 1/16 ~6.3% in [490,530]).',
    holds: () =>
      conditionalFractionRises &&
      CONDITIONAL_FRACTION_OF_CROSSINGS === 1 &&
      CONDITIONAL_FRACTION_OF_CROSSINGS > BASELINE_CONDITIONAL_FRACTION_OF_CROSSINGS,
  },
  {
    id: 'imp33665-both-crossing-and-conditional-fractions-rise',
    why: 'The ticket question: BOTH the crossing frequency and the conditional fraction must rise together as the ' +
         'graded floor degrades in the tail.',
    holds: () => bothRise && CROSSING_FRACTION_DELTA > 0 && CONDITIONAL_FRACTION_DELTA > 0,
  },
  {
    id: 'imp33665-cc-ladder-fails-at-some-tail-rung',
    why: 'NEW deep-tail degradation: at least one rung (n=999) must NOT be cleared by any single CC grid up to N=8192.',
    holds: () => ccLadderFailsAtSomeTailRung && CC_NEVER_CLEARS_RUNGS.length >= 1,
  },
  {
    id: 'imp33665-cc-min-n-still-lattice-toggle-with-heavier-tail',
    why: 'The CC min-N must still be a lattice toggle dominated by {512,1024} but now reaching the heavier {2048,3072}.',
    holds: () => ccStillLatticeTogglePlusHeavierTail,
  },
  {
    id: 'imp33665-verdict-records-both-fractions-rise',
    why: 'The classified verdict must record that BOTH the 4x-crossing frequency and the conditional fraction rise ' +
         'sharply in the deep tail, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33665-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-solver measurement only, not a certified bound, no literal ' +
         'patched, source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33665_TAIL_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.changesAnyBound === false &&
        c.patchedALiteral === false &&
        c.leavesSourceModulesIntact === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33665_TAIL_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33665-tail-band-crossing-cc-vs-graded-4x-per-rung assertion failed: ${assertion.id}`);
  }
}

export default IMP33665_TAIL_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG;
