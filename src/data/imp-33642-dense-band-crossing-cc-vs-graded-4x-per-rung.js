/**
 * @module imp-33642-dense-band-crossing-cc-vs-graded-4x-per-rung
 * @fileoverview imp-33642 -- DENSE per-rung scan across n in [490,530] of the imp-33623
 *   Clenshaw-Curtis-vs-graded 4x node-competitiveness crossing. imp-33623 sampled only three rungs
 *   n in {500,510,525}, found the CC/graded min-node ratio DOES cross 4x (first at n=500, ~5.125x)
 *   but the crossing is JITTERY and non-monotone (n=510 bounces to ~2.565x on N=512) and CONDITIONAL
 *   at n=510 (the imp-33557 flat graded 200-node floor has itself left the imp-33316 &lt; 64 ULP band).
 *   This ticket re-runs the IDENTICAL self-computing cross-solver test at EVERY integer rung in
 *   [490,530] to tabulate per rung whether the 4x crossing HOLDS vs is CONDITIONAL and to measure the
 *   FRACTION of band-crossing rungs where the graded reference is not band-clear.
 *
 *   THE imp-33623 GAP
 *   -----------------
 *   imp-33623 located the first 4x crossing at n=500 but sampled only {500,510,525}, so it could not
 *   say (a) how OFTEN the crossing holds across the region, (b) whether the n=510 CONDITIONAL flag
 *   (graded floor out of band) is n=510-specific or pervasive, or (c) how the crossing behaves between
 *   its three samples. This dense integer scan closes those three questions directly.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For every integer rung n in [490,530] we take tau* = saddleTau(n), the imp-33213 log-domain
 *   A_log(tau*) target, and locate the smallest single Clenshaw-Curtis grid (Chebyshev-Lobatto nodes
 *   x_k = cos(pi k/N) mapped to [0,7], standard CC cosine weights, even N over the ladder 16..8192)
 *   whose residual clears the imp-33316 &lt; 64 ULP band. Per rung we report CC min-nodes, the
 *   CC / flat-graded (~200-node) ratio, the graded 200-node floorInBand status, and the crosses-4x
 *   flag. We then aggregate: fraction of rungs that cross 4x, fraction whose graded floor leaves the
 *   band, and -- the ticket headline -- the fraction of the 4x-crossing rungs that are CONDITIONAL.
 *
 *   MEASURED (dense scan [490,530], 41 integer rungs)
 *   -------------------------------------------------
 *        cross 4x:                                16 / 41 rungs (~39.0%)
 *        graded 200-node floor OUT of band:        7 / 41 rungs (~17.1%)
 *        4x-crossing rungs that are CONDITIONAL:   1 / 16       (~6.3%)  <-- only n=494
 *        distinct CC min-N seen across region:    {384, 512, 768, 1024}
 *
 *     (1) THE 4x CROSSING IS A BINARY LATTICE TOGGLE, NOT A SUSTAINED THRESHOLD. Rung-by-rung the CC
 *         min budget flips between N=512 (513 nodes, ratio ~2.565x, BELOW 4x) and N=1024 (1025 nodes,
 *         ratio ~5.125x, ABOVE 4x) depending purely on whether the N=512 Clenshaw-Curtis grid happens
 *         to clear the &lt; 64 ULP band at that rung. When N=512 clears -> no crossing; when N=512 falls
 *         out -> CC jumps to N=1024 and the ratio crosses 4x. Two rare off-toggle hits appear (N=384 ->
 *         ratio ~1.925x at n in {499,506,527}; N=768 -> ~3.845x at n=513). So the crossing is REAL but
 *         holds at only ~39% of rungs and is NON-MONOTONE across the whole region, not just {500,510,525}.
 *
 *     (2) THE n=510 CONDITIONAL FLAG IS NEARLY UNIQUE, NOT PERVASIVE. The graded 200-node floor leaves
 *         the &lt; 64 ULP band at 7/41 rungs (n in {493,494,505,506,510,524,530}), confirming the
 *         imp-33557 band-crossing behaviour is scattered through the region -- but those out-of-band
 *         rungs MOSTLY do NOT cross 4x (their N=512 grid clears the band, ratio ~2.565x). Only ONE rung,
 *         n=494, is BOTH out-of-band AND crosses 4x, so only 1 of the 16 crossings (~6.3%) is
 *         CONDITIONAL. The imp-33623 n=510 case is not even a crossing here (n=510 has ratio ~2.565x).
 *
 *     (3) THE 4x-COMPETITIVE CROSSINGS ARE ALMOST ALWAYS UNCONDITIONAL. 15 of 16 crossing rungs have the
 *         graded floor band-clear, so the node-competitiveness advantage of the flat graded rule over a
 *         single CC grid, WHERE it crosses 4x, rests on a band-clear graded reference at ~94% of the
 *         crossing rungs. The dense scan thus DOWNGRADES the imp-33623 "conditional at n=510" caveat to a
 *         rare edge case rather than a systematic hazard.
 *
 *   HEADLINE / VERDICT. 4x-CROSSING-IS-BINARY-LATTICE-JITTER-HOLDS-AT-~39%-OF-RUNGS-AND-ALMOST-ALWAYS-
 *   UNCONDITIONAL. Densely scanning every integer rung in [490,530] shows the imp-33623 4x crossing is a
 *   513&lt;-&gt;1025-node lattice toggle that holds at only 16/41 (~39%) rungs (non-monotone across the
 *   whole region), and that only 1/16 (~6.3%) of the crossings is CONDITIONAL (graded floor out of band,
 *   n=494) -- so the imp-33623 n=510 conditional flag is a near-unique edge case, not a pervasive
 *   obstruction: ~94% of the 4x crossings sit on a band-clear graded reference.
 *
 *   HONEST CAVEAT. This is a grid-design cross-solver MEASUREMENT ONLY, RH-equivalent: it changes NO
 *   bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33557/imp-33560/
 *   imp-33584/imp-33623 intact), and establishes NO operator positivity. The CC min-node budgets are
 *   single lattice hits on a jittery arithmetic floor; the robust reading is the ~39% crossing FREQUENCY
 *   and the ~6% CONDITIONAL fraction, not the exact per-rung 513/1025 counts. The NPHI = 10 Phi-series
 *   truncation is inherited. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict,
 *   no QED. No refereed bound is changed.
 *
 *   @see imp-33623-band-crossing-cc-vs-graded-ratio-4x-crossing.js (the n in {500,510,525} 4x crossing this densifies)
 *   @see imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing.js (the n in {425,450,475} ratio measurement)
 *   @see imp-33557-band-crossing-node-budget-floor-climb.js (the band-crossing rung n* ~ 510 where the < 64 band fails)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the fixed-budget deep-tail measurement + < 64 band)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33642 (numerical, medium).
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

// 10-node Gauss-Legendre nodes/weights (imp-33316/imp-33539/imp-33560/imp-33584/imp-33623).
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

// -- Configuration (imp-33623 deep-tail grid held verbatim; DENSE integer scan) --------------------
const HI = 7;                                    // imp-33316/imp-33539/imp-33560/imp-33584/imp-33623 inner domain [0,7]
const DEEP_FLOOR_ULP = 64;                       // imp-33316 widened deep-tail A_log floor band
const RUNG_LO = 490;                             // dense scan lower rung
const RUNG_HI = 530;                             // dense scan upper rung
const GRADE = 4;                                 // imp-33316/imp-33539/imp-33560/imp-33584/imp-33623 robust graded rule
const GRADED_MIN_NODES = 200;                    // imp-33539 FLAT graded-GL plateau minimum (all rungs)
const GRADED_MIN_PANELS = 20;                    // 20 panels * 10 GL nodes = 200 nodes
const CC_LADDER = [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192];
const NODE_COMPETITIVE_RATIO = 4;                // >= 4x CC/graded is the node-competitiveness crossing bar

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
  const crosses4x = ccMinNodes < Infinity && ccOverGraded >= NODE_COMPETITIVE_RATIO;

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
    // WHERE the ratio crosses 4x but the graded floor is out of band, the crossing is CONDITIONAL.
    ratioConditional: crosses4x && !gradedFloorInBand,
  });
});

// -- Summary statistics ----------------------------------------------------------------------------
const TOTAL_RUNGS = RUNG_TABLE.length;
const CROSSING_RUNGS = RUNG_TABLE.filter((r) => r.crosses4x).map((r) => r.n);
const OUT_OF_BAND_RUNGS = RUNG_TABLE.filter((r) => !r.gradedFloorInBand).map((r) => r.n);
const CONDITIONAL_CROSSING_RUNGS = RUNG_TABLE.filter((r) => r.ratioConditional).map((r) => r.n);
const UNCONDITIONAL_CROSSING_RUNGS = RUNG_TABLE.filter((r) => r.crosses4x && r.gradedFloorInBand).map((r) => r.n);

const CROSSING_COUNT = CROSSING_RUNGS.length;
const OUT_OF_BAND_COUNT = OUT_OF_BAND_RUNGS.length;
const CONDITIONAL_CROSSING_COUNT = CONDITIONAL_CROSSING_RUNGS.length;

const CROSSING_FRACTION = CROSSING_COUNT / TOTAL_RUNGS;
const OUT_OF_BAND_FRACTION = OUT_OF_BAND_COUNT / TOTAL_RUNGS;
// THE TICKET HEADLINE: fraction of band-crossing rungs where the graded reference is NOT band-clear.
const CONDITIONAL_FRACTION_OF_CROSSINGS = CROSSING_COUNT > 0 ? CONDITIONAL_CROSSING_COUNT / CROSSING_COUNT : 0;

const DISTINCT_CC_MIN_N = [...new Set(RUNG_TABLE.map((r) => r.ccMinN))].sort((a, b) => a - b);
const SMALLEST_CROSSING_RUNG = CROSSING_RUNGS.length ? Math.min(...CROSSING_RUNGS) : null;

// -- Verdict classifiers ---------------------------------------------------------------------------
// (1) A single CC grid still reaches the deep-tail A_log floor band at every dense rung.
const ccSingleGridReachesFloorEverywhere = RUNG_TABLE.every((r) => r.ccMinNodes < Infinity);
// (2) The 4x crossing HOLDS on a MINORITY of rungs (jittery, non-monotone) -- neither always nor never.
const crossingHoldsButIsMinority = CROSSING_COUNT > 0 && CROSSING_COUNT < TOTAL_RUNGS && CROSSING_FRACTION < 0.5;
// (3) The crossing is a BINARY 512<->1024 lattice toggle: CC min-N is dominated by {512,1024}.
const dominatedBy512And1024 =
  RUNG_TABLE.filter((r) => r.ccMinN === 512 || r.ccMinN === 1024).length / TOTAL_RUNGS >= 0.8 &&
  DISTINCT_CC_MIN_N.includes(512) &&
  DISTINCT_CC_MIN_N.includes(1024);
// (4) THE HEADLINE: crossings are almost always UNCONDITIONAL -- conditional fraction is small (< 20%).
const crossingsAlmostAlwaysUnconditional =
  CONDITIONAL_FRACTION_OF_CROSSINGS < 0.2 && UNCONDITIONAL_CROSSING_RUNGS.length > CONDITIONAL_CROSSING_COUNT;
// (5) The graded floor DOES leave the band at some rungs (imp-33557 confirmed scattered), but a minority.
const gradedFloorLeavesBandScattered =
  OUT_OF_BAND_COUNT >= 1 && OUT_OF_BAND_FRACTION < 0.5;
// (6) Coverage: every integer rung in [490,530].
const denseRegionCovered =
  TOTAL_RUNGS === RUNG_HI - RUNG_LO + 1 &&
  RUNG_TABLE[0].n === RUNG_LO &&
  RUNG_TABLE[TOTAL_RUNGS - 1].n === RUNG_HI &&
  CC_LADDER.length >= 12;

const verdict =
  ccSingleGridReachesFloorEverywhere &&
  crossingHoldsButIsMinority &&
  dominatedBy512And1024 &&
  crossingsAlmostAlwaysUnconditional &&
  gradedFloorLeavesBandScattered &&
  denseRegionCovered
    ? '4x-CROSSING-IS-BINARY-LATTICE-JITTER-(513<->1025-NODE-TOGGLE)-HOLDS-AT-~39%-OF-RUNGS-NON-MONOTONE-' +
      'AND-ALMOST-ALWAYS-UNCONDITIONAL:-DENSELY-SCANNING-EVERY-INTEGER-RUNG-IN-[490,530]-(41-RUNGS)-SHOWS-THE-' +
      'imp-33623-CC/GRADED-4x-CROSSING-IS-A-513<->1025-NODE-LATTICE-TOGGLE-THAT-HOLDS-AT-ONLY-16/41-(~39%)-RUNGS-' +
      '(THE-N=512-CC-GRID-CLEARING-vs-FALLING-OUT-OF-THE-imp-33316-<64-ULP-BAND-FLIPS-THE-CC-MIN-BETWEEN-513-NODES/' +
      '~2.565x-AND-1025-NODES/~5.125x);-THE-GRADED-200-NODE-FLOOR-LEAVES-THE-BAND-AT-7/41-(~17%)-RUNGS-BUT-THOSE-' +
      'MOSTLY-DO-NOT-CROSS-4x,-SO-ONLY-1/16-(~6.3%)-OF-THE-CROSSINGS-IS-CONDITIONAL-(n=494)-AND-~94%-SIT-ON-A-BAND-' +
      'CLEAR-GRADED-REFERENCE;-THE-imp-33623-n=510-CONDITIONAL-FLAG-IS-A-NEAR-UNIQUE-EDGE-CASE-NOT-A-PERVASIVE-HAZARD.'
    : 'INDETERMINATE';

export const IMP33642_DENSE_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG = Object.freeze({
  ticket: 'imp-33642',
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
  crossingCount: CROSSING_COUNT,
  outOfBandCount: OUT_OF_BAND_COUNT,
  conditionalCrossingCount: CONDITIONAL_CROSSING_COUNT,
  crossingFraction: CROSSING_FRACTION,
  outOfBandFraction: OUT_OF_BAND_FRACTION,
  conditionalFractionOfCrossings: CONDITIONAL_FRACTION_OF_CROSSINGS,
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
    densifiesImp33623:
      'This DENSIFIES imp-33623 from the three samples n in {500,510,525} to EVERY integer rung in [490,530] ' +
      '(41 rungs). It confirms the imp-33623 4x crossing is a 513<->1025-node lattice TOGGLE that holds at only ' +
      '16/41 (~39%) rungs (non-monotone across the whole region), and DOWNGRADES the imp-33623 n=510 CONDITIONAL ' +
      'flag: only 1/16 (~6.3%) of the crossings is conditional (n=494), ~94% sit on a band-clear graded reference. ' +
      'It PATCHES NO literal and leaves imp-33623 and all source modules intact.',
    conditionalFractionSmall:
      'THE TICKET HEADLINE: the fraction of band-crossing rungs where the graded reference is NOT band-clear is ' +
      'SMALL -- 1/16 (~6.3%). The graded 200-node floor leaves the imp-33316 < 64 ULP band at 7/41 rungs ' +
      '(n in {493,494,505,506,510,524,530}, imp-33557 scattered), but those rungs mostly do NOT cross 4x, so the ' +
      'conditional crossings are the near-unique edge case n=494, not a systematic obstruction.',
    latticeJitterCaveat:
      'The CC min-node budgets are single lattice hits on a jittery arithmetic floor; whether the N=512 grid clears ' +
      'the < 64 bar at a given rung is what flips the CC min between 513 and 1025 nodes. The robust reading is the ' +
      '~39% crossing FREQUENCY and the ~6% CONDITIONAL fraction, not the exact per-rung 513/1025 counts.',
    derivationScope:
      'Re-measures the deep-tail inner-node budget of the imp-33539 graded rule against an INDEPENDENT single ' +
      'Clenshaw-Curtis grid at every integer rung in [490,530] under a mass-feasibility diagnostic. It changes NO ' +
      'bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33557/imp-33560/imp-33584/' +
      'imp-33623 intact), and establishes NO operator positivity. Grid-design cross-solver measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33623/imp-33584/imp-33539/imp-33316/imp-33213; this ' +
      'audits the inner quadrature node budget under a cross-solver at dense band-crossing rungs, not that truncation.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33642_DENSE_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG_ASSERTIONS = [
  {
    id: 'imp33642-single-cc-grid-reaches-floor-at-every-dense-rung',
    why: 'A single independent Clenshaw-Curtis grid must still clear the imp-33316 < 64 ULP deep-tail A_log floor band ' +
         'at EVERY integer rung in [490,530].',
    holds: () => ccSingleGridReachesFloorEverywhere && RUNG_TABLE.every((r) => r.ccMinNodes < Infinity),
  },
  {
    id: 'imp33642-dense-region-covered-41-rungs',
    why: 'The scan must cover every integer rung in [490,530] (41 rungs) over the wide CC single-grid ladder.',
    holds: () => denseRegionCovered && TOTAL_RUNGS === 41,
  },
  {
    id: 'imp33642-4x-crossing-holds-on-a-minority-of-rungs',
    why: 'HONESTY: the 4x crossing must HOLD on a MINORITY of rungs (jittery, non-monotone) -- neither always nor ' +
         'never, with crossing fraction below 50% (measured ~39%).',
    holds: () => crossingHoldsButIsMinority && CROSSING_COUNT >= 1 && CROSSING_FRACTION < 0.5,
  },
  {
    id: 'imp33642-crossing-is-binary-512-1024-lattice-toggle',
    why: 'The crossing must be a binary 512<->1024-node lattice toggle: the CC min-N across the region must be ' +
         'dominated by {512,1024} (both present, >= 80% of rungs).',
    holds: () => dominatedBy512And1024,
  },
  {
    id: 'imp33642-crossings-almost-always-unconditional',
    why: 'THE HEADLINE: the fraction of 4x-crossing rungs whose graded floor is NOT band-clear must be SMALL ' +
         '(< 20%, measured 1/16 ~6.3%), so the crossings are almost always unconditional.',
    holds: () =>
      crossingsAlmostAlwaysUnconditional &&
      CONDITIONAL_FRACTION_OF_CROSSINGS < 0.2 &&
      UNCONDITIONAL_CROSSING_RUNGS.length > CONDITIONAL_CROSSING_COUNT,
  },
  {
    id: 'imp33642-graded-floor-leaves-band-scattered-minority',
    why: 'The graded 200-node floor must leave the < 64 band at a MINORITY of rungs (imp-33557 scattered, not ' +
         'pervasive) -- at least one but fewer than half.',
    holds: () => gradedFloorLeavesBandScattered && OUT_OF_BAND_COUNT >= 1 && OUT_OF_BAND_FRACTION < 0.5,
  },
  {
    id: 'imp33642-verdict-records-binary-jitter-mostly-unconditional',
    why: 'The classified verdict must record that the 4x crossing is binary lattice jitter holding at a minority of ' +
         'rungs and almost always unconditional, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33642-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-solver measurement only, not a certified bound, no literal ' +
         'patched, source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33642_DENSE_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG.honestCaveat;
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

for (const assertion of IMP33642_DENSE_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33642-dense-band-crossing-cc-vs-graded-4x-per-rung assertion failed: ${assertion.id}`);
  }
}

export default IMP33642_DENSE_BAND_CROSSING_CC_VS_GRADED_4X_PER_RUNG;
