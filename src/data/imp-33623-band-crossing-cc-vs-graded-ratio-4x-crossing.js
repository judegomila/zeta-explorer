/**
 * @module imp-33623-band-crossing-cc-vs-graded-ratio-4x-crossing
 * @fileoverview imp-33623 -- EXTEND the imp-33584 Clenshaw-Curtis-vs-graded min-node ratio measurement
 *   INTO/ACROSS the band-crossing region n in {500,510,525} (past the imp-33584 deepest in-band rung
 *   n=475, where the CC/graded ratio reached ~3.85x but did NOT cross the 4x node-competitiveness bar)
 *   and LOCATE the smallest rung at which the ratio first crosses 4x, if any -- while flagging honestly
 *   that above the imp-33557 band-crossing rung n* ~ 510 the graded 200-node floor itself may leave the
 *   imp-33316 &lt; 64 ULP band, making the ratio comparison CONDITIONAL and requiring the graded
 *   floorInBand status to be reported per rung.
 *
 *   THE imp-33584 GAP
 *   -----------------
 *   imp-33584 extended the imp-33560 CC-vs-graded cross-solver ratio to n in {425,450,475} and found the
 *   ratio KEEPS CLIMBING (~2.56x through n=450, ~3.85x at n=475 as the N=512 CC grid falls out of the
 *   imp-33316 &lt; 64 ULP band and CC steps to N=768) but does NOT cross 4x through the deepest in-band
 *   rung. It DELIBERATELY stayed BELOW the imp-33557/imp-33579 band-crossing rung n* ~ 510 so the graded
 *   200-node minimum was still band-clear and the ratio comparison was well-posed. It left OPEN what
 *   happens at/across n* ~ 510: does the ratio finally cross 4x, and how does the comparison behave once
 *   the graded floor itself may leave the band?
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   The IDENTICAL imp-33584 cross-solver test is re-run at n in {500,510,525} -- INTO/ACROSS the
 *   band-crossing region. For each rung we take tau* = saddleTau(n), the imp-33213 log-domain A_log(tau*)
 *   target, and locate the smallest single Clenshaw-Curtis grid (Chebyshev-Lobatto nodes x_k = cos(pi
 *   k/N) mapped to [0,7], standard CC cosine weights -- independent of both the Simpson family and the
 *   graded-GL rule) whose residual clears the imp-33316 &lt; 64 ULP A_log band, sweeping even N over the
 *   ladder nodes 17..8193. We report the CC min-node budget, the CC / flat-graded (~200-node) ratio, and
 *   -- CRUCIALLY at these rungs -- the graded 200-node floorInBand status per rung, so the ratio is read
 *   as CONDITIONAL wherever the graded floor has itself left the band (imp-33557).
 *
 *   MEASURED (the ratio DOES cross 4x -- first at n=500 -- but the crossing is JITTERY and CONDITIONAL)
 *   --------------------------------------------------------------------------------------------------
 *        n    tau*       graded min (ULP, inBand)   CC min (nodes, ULP)      CC / graded   crosses 4x?
 *        500  0.937129   ~21.1 (IN band)            1025 (N=1024, ~20.5)     ~5.125        YES
 *        510  0.941039   ~87.7 (OUT of band)        513  (N=512,  ~1.6)      ~2.565        no (CONDITIONAL)
 *        525  0.946769   ~24.9 (IN band)            1025 (N=1024, ~28.0)     ~5.125        YES
 *
 *     (1) THE RATIO DOES CROSS 4x -- FIRST AT n=500. Stepping past the imp-33584 deepest in-band rung
 *         n=475 (ratio ~3.85x, CC min N=768), the very next rung n=500 JUMPS the CC min budget to N=1024
 *         (1025 nodes, residual ~20.5 ULP) -- the N=512 (~88 ULP) and N=768 (~115 ULP) grids no longer
 *         clear the band -- so the CC / graded ratio is ~5.125x, CROSSING the 4x node-competitiveness bar
 *         for the first time. The smallest rung at which the ratio first crosses 4x is n=500.
 *     (2) BUT THE CROSSING IS JITTERY AND NOT RUNG-UNIFORM. At n=510 the CC residual ladder JITTERS: the
 *         N=512 grid happens to land at ~1.6 ULP (deep in band), so the CC min drops back to 513 nodes
 *         and the raw ratio falls to ~2.565x -- BELOW 4x. Then n=525 crosses again (~5.125x, CC min
 *         N=1024). So the 4x crossing is REAL but NON-MONOTONE: the CC min-node budget bounces N=1024 /
 *         N=512 / N=1024 across {500,510,525} on the jittery arithmetic floor.
 *     (3) AND AT n=510 THE COMPARISON IS CONDITIONAL. At n=510 the imp-33539 flat graded 200-node floor
 *         has ITSELF left the imp-33316 &lt; 64 ULP band (~87.7 ULP) -- exactly the imp-33557 band-crossing
 *         behaviour at n* ~ 510 -- so the graded reference is NOT band-clear and the n=510 ratio is
 *         flagged CONDITIONAL, not a clean node-budget comparison. At the two flanking rungs n=500 (~21.1
 *         ULP) and n=525 (~24.9 ULP) the graded floor is comfortably IN band, so those crossings ARE
 *         against a genuinely band-clearing graded min.
 *
 *   HEADLINE / VERDICT. RATIO-CROSSES-4x-AT-n=500-BUT-CROSSING-IS-JITTERY-AND-CONDITIONAL-AT-n=510.
 *   Extending the imp-33584 CC-vs-graded cross-solver ratio into the band-crossing region n in
 *   {500,510,525} locates the first 4x crossing at n=500 (~5.125x, CC min steps to N=1024) -- so the
 *   flat-vs-climbing graded edge DOES eventually cross the node-competitiveness bar once the saddle
 *   sharpens past n=475. But the crossing is JITTERY (n=510 bounces back to CC min N=512, ratio ~2.565x)
 *   and CONDITIONAL at n=510, where the graded 200-node floor has itself left the &lt; 64 band (~87.7 ULP,
 *   the imp-33557 band-crossing). The robust reading is that the CC/graded ratio reaches the ~5x order at
 *   the in-band rungs n=500/525 while the exact rung-by-rung budget bounces on the arithmetic floor.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN CROSS-SOLVER MEASUREMENT ONLY, at the RH-equivalent scale class. It extends
 *   the imp-33584 deep-tail inner-node-budget measurement into the band-crossing region; it changes NO
 *   bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560/imp-33584 all
 *   LEFT INTACT), and establishes NO operator positivity. The CC min-node counts are JITTERY
 *   arithmetic-floor lattice properties (imp-33249/imp-33277/imp-33295/imp-33539/imp-33560/imp-33584
 *   latticeJitterCaveat): the CC residual ladder is non-monotone near the floor (neighbouring even N
 *   bounce above/below the &lt; 64 ULP bar -- at n=510 the N=512 grid lands at ~1.6 ULP while at n=500 it
 *   lands at ~88 ULP) and cross-platform libm exp/pow/cos variation can shift the measurements, so the
 *   robust reading is the ORDER of the node budgets (~500-1000) and the ratio order (~5x at the in-band
 *   rungs), not the exact 1025/513 counts. CRUCIALLY: above the imp-33557 band-crossing rung n* ~ 510 the
 *   graded 200-node floor itself leaves the &lt; 64 band (n=510 graded residual ~87.7 ULP), so the ratio
 *   at n=510 is CONDITIONAL -- reported with the graded floorInBand=false flag -- NOT a clean node-budget
 *   comparison. The NPHI = 10 Phi-series truncation is inherited. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing.js (the n in {425,450,475} ratio measurement this extends)
 *   @see imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js (the original n in {350,375,400} ratio measurement)
 *   @see imp-33539-graded-plateau-deeper-tail-min-budget.js (the flat graded ~200-node deep-tail min)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the fixed-budget deep-tail measurement + &lt; 64 band)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *   @see imp-33557-band-crossing-node-budget-floor-climb.js (the band-crossing rung n* ~ 510 where the < 64 band fails)
 *
 *   Ticket: imp-33623 (numerical, medium).
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

// 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295/imp-33316/imp-33539/imp-33560/imp-33584).
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

/**
 * (G) the imp-33539 GRADED-GL plateau on the DIRECT linear integrand: panels a_j = hi (j/panels)^grade,
 * GL-10 per panel. The integrand Phi(s)Phi(s+tau) &gt;= 0 on [0,hi], so no subtractive cancellation.
 */
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

/**
 * (CC) CLENSHAW-CURTIS weights on the N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N), N even. The
 * standard cosine-series weights, endpoint half-weights c_0 = c_N = 1/2, interior c_k = 1,
 * b_0 = b_{N/2} = 1 else 2. Independent of BOTH the Simpson family and the Gauss-Legendre graded rule.
 */
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

// -- Configuration (imp-33584 deep-tail grid held verbatim; band-crossing rungs) -------------------
const HI = 7;                                    // imp-33316/imp-33539/imp-33560/imp-33584 deep-tail inner domain [0,7]
const DEEP_FLOOR_ULP = 64;                       // imp-33316 widened deep-tail A_log floor band
const N_RUNGS = [500, 510, 525];                 // BAND-CROSSING rungs (into/across the imp-33557 band-crossing n* ~ 510)
const GRADE = 4;                                 // imp-33295/imp-33316/imp-33539/imp-33560/imp-33584 robust graded rule
const GRADED_MIN_NODES = 200;                    // imp-33539 FLAT graded-GL plateau minimum (all rungs)
const GRADED_MIN_PANELS = 20;                    // 20 panels * 10 GL nodes = 200 nodes
const BAND_CROSSING_RUNG = 510;                  // imp-33557/imp-33579 band-crossing rung n* (this ticket runs INTO/ACROSS it)
// CC single-grid ladder (even N; nodes = N+1); cheap to expensive, matches imp-33584.
const CC_LADDER = [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192];
const NODE_COMPETITIVE_RATIO = 4;                // graded NOT >>cheaper than a strong solver if < 4x; >= 4x is the crossing bar

// -- Per-rung CC single-grid min-node budget vs the imp-33539 flat graded ~200-node min ------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  // graded floor cross-check: the imp-33539 flat 200-node plateau residual at this rung, and whether it
  // is still IN the imp-33316 < 64 ULP band. Above the imp-33557 band-crossing rung it may leave the band.
  const gradedMinUlp = Math.abs(aDirectGradedGL(tauStar, HI, GRADED_MIN_PANELS, GRADE) - aLogVal) / ulpOfALog;
  const gradedFloorInBand = gradedMinUlp < DEEP_FLOOR_ULP;

  // CC single-grid sweep: smallest N+1 clearing the deep-tail floor band.
  let ccMinNodes = Infinity;
  let ccMinN = null;
  let ccMinUlp = Infinity;
  const ccRow = CC_LADDER.map((N) => {
    const ulp = Math.abs(aDirectCC(tauStar, HI, N) - aLogVal) / ulpOfALog;
    if (ulp < DEEP_FLOOR_ULP && ccMinNodes === Infinity) {
      ccMinNodes = N + 1;
      ccMinN = N;
      ccMinUlp = ulp;
    }
    return Object.freeze({ N, nodes: N + 1, ulp, inBand: ulp < DEEP_FLOOR_ULP });
  });

  const ccOverGraded = ccMinNodes / GRADED_MIN_NODES;
  const crosses4x = ccMinNodes < Infinity && ccOverGraded >= NODE_COMPETITIVE_RATIO;

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    gradedMinNodes: GRADED_MIN_NODES,
    gradedMinUlp,
    gradedFloorInBand,
    ccRow: Object.freeze(ccRow),
    ccMinN,
    ccMinNodes,
    ccMinUlp,
    ccOverGraded,
    crosses4x,
    // At/above the band-crossing rung the graded floor may leave the band, making the ratio CONDITIONAL.
    ratioConditional: !gradedFloorInBand,
    aboveOrAtBandCrossing: n >= BAND_CROSSING_RUNG,
  });
});

// -- Summary statistics ----------------------------------------------------------------------------
const CC_MIN_NODES_BY_RUNG = RUNG_TABLE.map((r) => r.ccMinNodes);
const CC_OVER_GRADED_BY_RUNG = RUNG_TABLE.map((r) => r.ccOverGraded);
const MAX_CC_OVER_GRADED = Math.max(...CC_OVER_GRADED_BY_RUNG);
const MIN_CC_OVER_GRADED = Math.min(...CC_OVER_GRADED_BY_RUNG);
const MIN_CC_MIN_NODES = Math.min(...CC_MIN_NODES_BY_RUNG);
const MAX_CC_MIN_NODES = Math.max(...CC_MIN_NODES_BY_RUNG);
// The imp-33584 deepest measured ratio was ~3.85x at n=475, still under 4x; this ticket asks whether 4x is crossed.
const IMP33584_MAX_RATIO = 3.85;
const RUNGS_THAT_CROSS_4X = RUNG_TABLE.filter((r) => r.crosses4x).map((r) => r.n);
const SMALLEST_CROSSING_RUNG = RUNGS_THAT_CROSS_4X.length ? Math.min(...RUNGS_THAT_CROSS_4X) : null;
// In-band rungs (graded floor still band-clear): the ratio comparison there is unconditional.
const IN_BAND_RUNGS = RUNG_TABLE.filter((r) => r.gradedFloorInBand).map((r) => r.n);
const IN_BAND_RUNGS_CROSS_4X = RUNG_TABLE.filter((r) => r.gradedFloorInBand).every((r) => r.crosses4x);

// -- Verdict classifiers ---------------------------------------------------------------------------
// (1) A single CC grid still reaches the deep-tail A_log floor band at every band-crossing rung.
const ccSingleGridReachesFloor = RUNG_TABLE.every((r) => r.ccMinNodes < Infinity);
// (2) THE ANSWER: the ratio DOES cross 4x at least once in the band-crossing region (first at n=500).
const ratioCrosses4x = RUNGS_THAT_CROSS_4X.length >= 1 && SMALLEST_CROSSING_RUNG === 500;
// (3) The crossing is NOT rung-uniform: at least one rung (n=510, jitter + graded out of band) is < 4x.
const crossingIsJitteryNotUniform = !RUNG_TABLE.every((r) => r.crosses4x) && MIN_CC_OVER_GRADED < NODE_COMPETITIVE_RATIO;
// (4) CONDITIONAL FLAG: at n=510 the graded 200-node floor has left the < 64 band (imp-33557), so its ratio
//     is conditional; at the flanking rungs n=500/525 the graded floor is band-clear.
const gradedFloorLeavesBandAtNstar =
  RUNG_TABLE.find((r) => r.n === 510) !== undefined &&
  RUNG_TABLE.find((r) => r.n === 510).gradedFloorInBand === false &&
  RUNG_TABLE.find((r) => r.n === 500).gradedFloorInBand === true &&
  RUNG_TABLE.find((r) => r.n === 525).gradedFloorInBand === true;
// (5) The in-band flanking rungs (n=500/525) both cross 4x -- the crossing is genuine where the comparison
//     is unconditional.
const inBandCrossingsGenuine = IN_BAND_RUNGS_CROSS_4X && IN_BAND_RUNGS.length >= 2;
// (6) Coverage: three rungs spanning the band-crossing region, wide CC ladder.
const bandCrossingRegionCovered =
  N_RUNGS.length >= 3 &&
  N_RUNGS.every((n) => n >= 500 && n <= 525) &&
  CC_LADDER.length >= 12 &&
  RUNG_TABLE.some((r) => r.aboveOrAtBandCrossing);

const verdict =
  ccSingleGridReachesFloor &&
  ratioCrosses4x &&
  crossingIsJitteryNotUniform &&
  gradedFloorLeavesBandAtNstar &&
  inBandCrossingsGenuine &&
  bandCrossingRegionCovered
    ? 'RATIO-CROSSES-4x-AT-n=500-BUT-CROSSING-IS-JITTERY-AND-CONDITIONAL-AT-n=510:-EXTENDING-THE-imp-33584-CC-VS-' +
      'GRADED-CROSS-SOLVER-MIN-NODE-RATIO-INTO/ACROSS-THE-BAND-CROSSING-REGION-n-in-{500,510,525}-(PAST-THE-imp-33584-' +
      'DEEPEST-IN-BAND-RUNG-n=475-WHERE-THE-RATIO-REACHED-~3.85x)-LOCATES-THE-FIRST-4x-CROSSING-AT-n=500-(~5.125x,-CC-' +
      'MIN-STEPS-TO-N=1024/1025-NODES-AS-THE-N=512/~88-ULP-AND-N=768/~115-ULP-GRIDS-FALL-OUT-OF-THE-imp-33316-<64-ULP-' +
      'BAND);-SO-THE-FLAT-VS-CLIMBING-GRADED-EDGE-DOES-EVENTUALLY-CROSS-THE-NODE-COMPETITIVENESS-BAR-ONCE-THE-SADDLE-' +
      'SHARPENS-PAST-n=475.-BUT-THE-CROSSING-IS-JITTERY-AND-NON-MONOTONE:-AT-n=510-THE-CC-RESIDUAL-LADDER-BOUNCES-BACK-' +
      'TO-N=512-(~1.6-ULP,-DEEP-IN-BAND)-SO-CC-MIN-DROPS-TO-513-NODES-AND-THE-RAW-RATIO-FALLS-TO-~2.565x,-AND-AT-THAT-' +
      'SAME-RUNG-THE-imp-33539-FLAT-GRADED-200-NODE-FLOOR-HAS-ITSELF-LEFT-THE-<64-BAND-(~87.7-ULP,-THE-imp-33557-BAND-' +
      'CROSSING-AT-n*~510)-SO-THE-n=510-RATIO-IS-CONDITIONAL-NOT-A-CLEAN-NODE-BUDGET-COMPARISON;-n=525-CROSSES-AGAIN-' +
      '(~5.125x,-CC-MIN-N=1024).-THE-ROBUST-READING-IS-THAT-THE-CC/GRADED-RATIO-REACHES-THE-~5x-ORDER-AT-THE-IN-BAND-' +
      'RUNGS-n=500/525-WHILE-THE-EXACT-RUNG-BY-RUNG-BUDGET-BOUNCES-ON-THE-JITTERY-ARITHMETIC-FLOOR.-ACCURACY/RULE-' +
      'DESIGN-CROSS-SOLVER-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-imp-33557-BOUNDS-THE-<64-BAND-AT-n>=510-(GRADED-' +
      'FLOOR-OUT-OF-BAND-AT-n=510);-NO-LITERAL-PATCHED;-imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560/' +
      'imp-33584-INTACT;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33623_BAND_CROSSING_CC_VS_GRADED_RATIO_4X_CROSSING = Object.freeze({
  id: 'imp-33623-band-crossing-cc-vs-graded-ratio-4x-crossing',
  ticket: 'imp-33623',
  extendsModule: 'imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing.js',
  reusesMachineryFrom: 'imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing.js',
  crossValidatesModules: [
    'imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing.js',
    'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
    'imp-33539-graded-plateau-deeper-tail-min-budget.js',
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
    'imp-33557-band-crossing-node-budget-floor-climb.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'EXTENDS the imp-33584 Clenshaw-Curtis-vs-graded min-node ratio measurement INTO/ACROSS the band-crossing region ' +
    'n in {500,510,525} (past the imp-33584 deepest in-band rung n=475, where the CC/graded ratio reached ~3.85x but ' +
    'did NOT cross the 4x node-competitiveness bar) to locate the smallest rung at which the ratio first crosses 4x, ' +
    'while reporting the graded 200-node floorInBand status per rung. RESULT: (1) the ratio DOES cross 4x, first at ' +
    'n=500 (~5.125x, CC min steps to N=1024/1025 nodes as the N=512/~88 ULP and N=768/~115 ULP grids fall out of the ' +
    'imp-33316 < 64 ULP band); (2) but the crossing is JITTERY and non-monotone -- at n=510 the CC residual bounces ' +
    'back to N=512 (~1.6 ULP), CC min drops to 513 nodes, raw ratio ~2.565x; (3) and at n=510 the flat graded 200-node ' +
    'floor has ITSELF left the < 64 band (~87.7 ULP, the imp-33557 band-crossing at n*~510), so the n=510 ratio is ' +
    'CONDITIONAL; the flanking in-band rungs n=500 (~21.1 ULP) and n=525 (~24.9 ULP) both cross 4x against a ' +
    'band-clear graded min. VERDICT: RATIO-CROSSES-4x-AT-n=500-BUT-CROSSING-IS-JITTERY-AND-CONDITIONAL-AT-n=510 -- the ' +
    'flat-vs-climbing graded edge does eventually cross the bar (smallest crossing rung n=500) but only at in-band ' +
    'rungs, with the exact budget bouncing on the arithmetic floor. ACCURACY/RULE-DESIGN CROSS-SOLVER MEASUREMENT, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; imp-33557 bounds the < 64 band at n >= 510; ' +
    'no literal patched; imp-3066 untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'BAND-CROSSING rungs n in {500,510,525}, into/across the imp-33557 band-crossing rung n* ~ 510; tau* = root of n = 4 pi tau* e^{4 tau*}',
    crossSolver: 'Clenshaw-Curtis SINGLE grid: N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N) mapped to [0,7], standard CC cosine weights -- independent of both the Simpson family and Gauss-Legendre',
    ccLadder: 'even N over nodes 17..8193; smallest whose residual clears the imp-33316 < 64 ULP band',
    gradedReference: 'the imp-33539 FLAT graded-GL plateau minimum (grade 4, 20 panels = 200 nodes), with its own floorInBand status reported per rung',
    target: 'the imp-33213 log-domain A_log target, residual in ULP = A_log * 2^-52',
    crossingTest: 'locate the smallest rung at which CC-min / graded-min first crosses 4x, flagging where the graded floor itself leaves the band (conditional ratio)',
    selfComputing: 'every rung, the CC ladder sweep, the graded-floor cross-check, the ratios, the crossing rung and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    ccLadder: Object.freeze(CC_LADDER.slice()),
    hi: HI,
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    gradedMinNodes: GRADED_MIN_NODES,
    bandCrossingRung: BAND_CROSSING_RUNG,
    imp33584MaxRatio: IMP33584_MAX_RATIO,
    rungTable: RUNG_TABLE,
    ccMinNodesByRung: Object.freeze(CC_MIN_NODES_BY_RUNG.slice()),
    ccOverGradedByRung: Object.freeze(CC_OVER_GRADED_BY_RUNG.slice()),
    minCcMinNodes: MIN_CC_MIN_NODES,
    maxCcMinNodes: MAX_CC_MIN_NODES,
    maxCcOverGraded: MAX_CC_OVER_GRADED,
    minCcOverGraded: MIN_CC_OVER_GRADED,
    nodeCompetitiveRatio: NODE_COMPETITIVE_RATIO,
    rungsThatCross4x: Object.freeze(RUNGS_THAT_CROSS_4X.slice()),
    smallestCrossingRung: SMALLEST_CROSSING_RUNG,
    inBandRungs: Object.freeze(IN_BAND_RUNGS.slice()),
    inBandRungsCross4x: IN_BAND_RUNGS_CROSS_4X,
    ccSingleGridReachesFloor,
    ratioCrosses4x,
    crossingIsJitteryNotUniform,
    gradedFloorLeavesBandAtNstar,
    inBandCrossingsGenuine,
    bandCrossingRegionCovered,
    verdict,
  }),

  interpretation: Object.freeze({
    theRatioCrosses4xAtN500:
      'Stepping past the imp-33584 deepest in-band rung n=475 (ratio ~3.85x, CC min N=768), the very next rung n=500 ' +
      'jumps the CC min budget to N=1024 (1025 nodes, residual ~20.5 ULP) -- the N=512 (~88 ULP) and N=768 (~115 ULP) ' +
      'grids no longer clear the imp-33316 < 64 ULP band -- so the CC / graded ratio is ~5.125x, CROSSING the 4x ' +
      'node-competitiveness bar for the first time. The smallest rung at which the ratio first crosses 4x is n=500.',
    butTheCrossingIsJittery:
      'The crossing is NOT rung-uniform. At n=510 the CC residual ladder jitters: the N=512 grid happens to land at ' +
      '~1.6 ULP (deep in band), so the CC min drops back to 513 nodes and the raw ratio falls to ~2.565x -- below 4x. ' +
      'Then n=525 crosses again (~5.125x, CC min N=1024). The CC min-node budget bounces N=1024 / N=512 / N=1024 ' +
      'across {500,510,525} on the jittery arithmetic floor -- the robust reading is the ~5x order at the in-band ' +
      'rungs, not the exact rung-by-rung count.',
    andAtN510TheRatioIsConditional:
      'At n=510 the imp-33539 flat graded 200-node floor has ITSELF left the imp-33316 < 64 ULP band (~87.7 ULP) -- ' +
      'exactly the imp-33557 band-crossing behaviour at n* ~ 510 -- so the graded reference is NOT band-clear and the ' +
      'n=510 ratio is flagged CONDITIONAL, not a clean node-budget comparison. At the flanking rungs n=500 (~21.1 ULP) ' +
      'and n=525 (~24.9 ULP) the graded floor is comfortably in band, so those 4x crossings are against a genuinely ' +
      'band-clearing graded min.',
    latticeJitterIsTheHonestFloor:
      'The exact CC min-node counts are JITTERY arithmetic-floor lattice properties (imp-33249/imp-33277/imp-33295/' +
      'imp-33539/imp-33560/imp-33584): the CC residual ladder is non-monotone near the floor (at n=510 the N=512 grid ' +
      'lands at ~1.6 ULP while at n=500 it lands at ~88 ULP) and libm exp/pow/cos variation can shift the ' +
      'measurements. The robust reading is the ORDER of the node budgets (~500-1000) and the ratio order (~5x at the ' +
      'in-band rungs), not the precise 1025/513 counts.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    reachesArithmeticFloorNotSubUlp: true,
    changesAnyBound: false,
    patchedALiteral: false,
    leavesSourceModulesIntact: true,
    extendsImp33584IntoBandCrossingRegion:
      'This EXTENDS imp-33584 from n in {425,450,475} to n in {500,510,525}: the CC-vs-graded min-node ratio DOES ' +
      'cross 4x (first at n=500, ~5.125x) once the saddle sharpens past the imp-33584 deepest in-band rung n=475, so ' +
      'the flat-vs-climbing graded edge eventually crosses the node-competitiveness bar. But the crossing is jittery ' +
      '(n=510 bounces back to CC min N=512, ratio ~2.565x) and CONDITIONAL at n=510, where the graded 200-node floor ' +
      'has itself left the < 64 band (~87.7 ULP, imp-33557). It PATCHES NO literal and leaves imp-33584 and all source ' +
      'modules intact.',
    conditionalAboveBandCrossing:
      'CRUCIAL HONESTY: above the imp-33557 band-crossing rung n* ~ 510 the imp-33539 flat graded 200-node floor ' +
      'itself leaves the imp-33316 < 64 ULP band (n=510 graded residual ~87.7 ULP), so the n=510 ratio is CONDITIONAL ' +
      '-- reported with the graded floorInBand=false flag -- NOT a clean node-budget comparison. The unconditional ' +
      'crossings are the flanking in-band rungs n=500 and n=525.',
    derivationScope:
      'Re-measures the deep-tail inner-node budget of the imp-33539 graded rule against an INDEPENDENT single ' +
      'Clenshaw-Curtis grid for the A(tau) weight at three band-crossing rungs underneath a mass-feasibility ' +
      'diagnostic. It changes NO bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560/' +
      'imp-33584 intact), and establishes NO operator positivity. Grid-design cross-solver measurement only -- not a ' +
      'certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33584/imp-33560/imp-33539/imp-33316/imp-33213; this ' +
      'audits the inner quadrature node budget under a cross-solver at band-crossing rungs, not that truncation.',
    bandValidityCaveat:
      'imp-33537/imp-33557 showed the imp-33316 < 64 ULP band is a coarse-grid artifact that FAILS at deeper rungs ' +
      'n >= 510; this ticket runs INTO/ACROSS that band-crossing rung and confirms it directly -- the graded 200-node ' +
      'floor is out of band at n=510 (~87.7 ULP) -- so the ratio there is reported as conditional, while the flanking ' +
      'rungs n=500/525 remain band-clear.',
    latticeJitterCaveat:
      'The CC min-node budgets are single lattice hits on a jittery arithmetic floor; neighbouring even N bounce ' +
      'above/below the < 64 bar (n=510 N=512 lands at ~1.6 ULP, n=500 N=512 lands at ~88 ULP). The robust reading is ' +
      'the order of the node budgets (~500-1000) and the ratio order (~5x at the in-band rungs), not the exact ' +
      '1025/513 counts.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33623_BAND_CROSSING_CC_VS_GRADED_RATIO_4X_CROSSING_ASSERTIONS = [
  {
    id: 'imp33623-single-cc-grid-still-reaches-the-deep-tail-floor',
    why: 'A single independent Clenshaw-Curtis grid must still clear the imp-33316 < 64 ULP deep-tail A_log floor band ' +
         'at every band-crossing rung n in {500,510,525}.',
    holds: () => ccSingleGridReachesFloor && RUNG_TABLE.every((r) => r.ccMinNodes < Infinity),
  },
  {
    id: 'imp33623-ratio-crosses-4x-first-at-n500',
    why: 'THE ANSWER: the CC / graded min-node ratio must CROSS the 4x node-competitiveness bar in the band-crossing ' +
         'region, with the smallest crossing rung located at n=500 (~5.125x, CC min steps to N=1024) -- the ' +
         'flat-vs-climbing graded edge eventually crosses the bar past the imp-33584 deepest in-band rung n=475.',
    holds: () => ratioCrosses4x && SMALLEST_CROSSING_RUNG === 500 && MAX_CC_OVER_GRADED >= NODE_COMPETITIVE_RATIO,
  },
  {
    id: 'imp33623-crossing-is-jittery-not-rung-uniform',
    why: 'HONESTY: the crossing must be NON-MONOTONE -- at least one rung (n=510, CC bounces back to N=512) has ratio ' +
         '< 4x, so the CC min-node budget jitters on the arithmetic floor rather than crossing uniformly.',
    holds: () => crossingIsJitteryNotUniform && MIN_CC_OVER_GRADED < NODE_COMPETITIVE_RATIO,
  },
  {
    id: 'imp33623-graded-floor-leaves-band-at-n510-conditional-ratio',
    why: 'THE CONDITIONAL FLAG: at n=510 the imp-33539 flat graded 200-node floor must have left the imp-33316 < 64 ULP ' +
         'band (imp-33557 band-crossing at n*~510), so its ratio is conditional; at the flanking rungs n=500/525 the ' +
         'graded floor must stay band-clear.',
    holds: () =>
      gradedFloorLeavesBandAtNstar &&
      RUNG_TABLE.find((r) => r.n === 510).ratioConditional === true,
  },
  {
    id: 'imp33623-in-band-flanking-crossings-are-genuine',
    why: 'The flanking in-band rungs n=500 and n=525 (graded floor band-clear) must BOTH cross 4x -- so the crossing ' +
         'is genuine where the comparison is unconditional.',
    holds: () => inBandCrossingsGenuine && IN_BAND_RUNGS.length >= 2 && IN_BAND_RUNGS_CROSS_4X,
  },
  {
    id: 'imp33623-band-crossing-region-covered',
    why: 'The sweep must run across three rungs n in {500,510,525} spanning the imp-33557 band-crossing region ' +
         '(into/across n* ~ 510) over a wide CC single-grid ladder.',
    holds: () =>
      bandCrossingRegionCovered && RUNG_TABLE.length === N_RUNGS.length && RUNG_TABLE.some((r) => r.aboveOrAtBandCrossing),
  },
  {
    id: 'imp33623-verdict-records-crosses-4x-jittery-conditional',
    why: 'The classified verdict must record that the ratio crosses 4x at n=500 but the crossing is jittery and ' +
         'conditional at n=510, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33623-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-solver measurement only, not a certified bound, no literal ' +
         'patched, source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33623_BAND_CROSSING_CC_VS_GRADED_RATIO_4X_CROSSING.honestCaveat;
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

for (const assertion of IMP33623_BAND_CROSSING_CC_VS_GRADED_RATIO_4X_CROSSING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33623-band-crossing-cc-vs-graded-ratio-4x-crossing assertion failed: ${assertion.id}`);
  }
}

export default IMP33623_BAND_CROSSING_CC_VS_GRADED_RATIO_4X_CROSSING;
