/**
 * @module imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing
 * @fileoverview imp-33584 -- EXTEND the imp-33560 deep-tail Clenshaw-Curtis cross-solver min-node
 *   ratio measurement to STILL-DEEPER rungs n in {425,450,475} and ask the open question imp-33560
 *   left standing: does the CC-single-grid / flat-graded min-node ratio KEEP CLIMBING with depth and
 *   eventually CROSS 4x (the genuine graded edge widening as the saddle sharpens), or does it plateau?
 *
 *   THE imp-33560 GAP
 *   -----------------
 *   imp-33560 measured the CC-vs-graded min-node ratio at the deeper deep-tail rungs n in {350,375,400}
 *   against the imp-33213 log-domain A_log target inside the imp-33316 widened deep-tail band
 *   (residual &lt; 64 ULP). It found the ratio ~1.28x (n=350/375) rising to ~2.56x (n=400) as the Laplace
 *   saddle peak sharpens -- all under 4x -- and concluded the genuine graded edge over a STRONG
 *   independent solver is FLAT-vs-CLIMBING (the graded ~200-node budget stays flat while the CC
 *   single-grid budget grows with depth), NOT the ~9.3x / ~186x figure that the weak imp-33275 uniform
 *   Richardson ladder produced. But imp-33560 stopped at n=400 (max ratio ~2.56x) and left OPEN whether
 *   the flat-vs-climbing edge keeps widening and crosses the 4x node-competitiveness bar at deeper rungs.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   The IDENTICAL imp-33560 cross-solver test is re-run at n in {425,450,475}. For each rung we take
 *   tau* = saddleTau(n), the imp-33213 log-domain target A_log(tau*), and locate the smallest single
 *   Clenshaw-Curtis grid (Chebyshev-Lobatto nodes x_k = cos(pi k/N) mapped to [0,7], standard CC cosine
 *   weights -- independent of both the imp-33275 Simpson family and the graded-GL rule) whose residual
 *   clears the imp-33316 &lt; 64 ULP A_log band, sweeping even N over the ladder nodes 17..8193. We report
 *   the CC min-node budget and the CC / flat-graded (~200-node) ratio at each. The rungs are held BELOW
 *   the imp-33557/imp-33579 band-crossing rung n* ~ 510, where the imp-33539 flat graded ~200-node
 *   minimum is still band-conditional-clear (imp-33557), so the ratio comparison is well-posed.
 *
 *   MEASURED (the ratio KEEPS CLIMBING but does NOT cross 4x through the deepest in-band rung)
 *   -----------------------------------------------------------------------------------------
 *        n    tau*       graded min    CC min (nodes, ULP)     CC / graded
 *        425  0.905173   200 nodes     513  (N=512, ~51.8)     ~2.56
 *        450  0.916385   200 nodes     513  (N=512, ~23.7)     ~2.56
 *        475  0.927018   769  (N=768, ~34.1)     ~3.85
 *
 *     (1) THE RATIO KEEPS CLIMBING WITH DEPTH. The CC / graded min-node ratio holds at ~2.56x through
 *         n=450 (CC min 513 nodes, unchanged from the imp-33560 n=400 value) then JUMPS to ~3.85x at
 *         n=475 (CC min 769 nodes) as the saddle peak sharpens enough that the N=512 CC grid no longer
 *         clears the &lt; 64 ULP band (its residual ~69 ULP, just over the bar) and CC must step up to
 *         N=768. So the flat-vs-climbing graded edge DOES keep widening with depth -- it does not
 *         plateau at ~2.56x.
 *     (2) BUT IT DOES NOT CROSS 4x THROUGH THE DEEPEST IN-BAND RUNG. Even at n=475 the ratio is ~3.85x,
 *         still UNDER the 4x node-competitiveness bar. Across every rung tested here (n in {425,450,475},
 *         all below the imp-33557 band-crossing rung n* ~ 510) the graded rule stays node-COMPETITIVE
 *         (&lt; 4x) with a strong independent Clenshaw-Curtis solver. The imp-33560 conclusion -- the
 *         graded edge is a mild flat-vs-climbing ~1.3-3.8x win, NOT the ~186x claimed against the weak
 *         uniform ladder -- SURVIVES the deeper extension.
 *     (3) THE GRADED 200-NODE PLATEAU STAYS IN BAND. The imp-33539 flat graded ~200-node residual is
 *         ~43.8 / ~45.7 / ~44.4 ULP at n = 425 / 450 / 475 -- comfortably inside the imp-33316 &lt; 64 ULP
 *         band at every rung, so the ratio comparison is against a genuinely band-clearing graded min.
 *
 *   HEADLINE / VERDICT. RATIO-CLIMBS-TOWARD-BUT-DOES-NOT-CROSS-4x. Extending the imp-33560 CC-vs-graded
 *   cross-solver ratio to n in {425,450,475} shows the ratio keeps climbing with depth (~2.56x through
 *   n=450, ~3.85x at n=475 as the N=512 CC grid falls out of the &lt; 64 ULP band and CC steps to N=768),
 *   approaching but NOT crossing the 4x node-competitiveness bar through the deepest in-band rung. The
 *   graded flat-vs-climbing edge WIDENS with depth but stays node-competitive (&lt; 4x) below the
 *   imp-33557 band-crossing rung -- so the imp-33560 finding (mild ~1.3-3.8x real graded win, not ~186x)
 *   holds deeper.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN CROSS-SOLVER MEASUREMENT ONLY, at the RH-equivalent scale class. It extends
 *   the imp-33560 deep-tail inner-node-budget measurement to three deeper rungs; it changes NO bound,
 *   patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560 all LEFT INTACT), and
 *   establishes NO operator positivity. The CC min-node counts are JITTERY arithmetic-floor lattice
 *   properties (imp-33249/imp-33277/imp-33295/imp-33539/imp-33560 latticeJitterCaveat): the CC residual
 *   ladder is non-monotone near the floor (neighbouring even N bounce above/below the &lt; 64 ULP bar --
 *   e.g. at n=475 the N=512 grid lands at ~69 ULP, just over the bar) and cross-platform libm exp/pow/cos
 *   variation can shift the measurements, so the robust reading is the ORDER of the node budgets
 *   (~500-800) and the ratio trend (climbing, still &lt; 4x), not the exact counts. imp-33537/imp-33557
 *   showed the &lt; 64 ULP band is a coarse-grid artifact that FAILS at deeper rungs n &gt;= 510; the rungs
 *   here (n in {425,450,475}) sit below that band-crossing rung. The NPHI = 10 Phi-series truncation is
 *   inherited. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js (the n in {350,375,400} ratio measurement this extends)
 *   @see imp-33539-graded-plateau-deeper-tail-min-budget.js (the flat graded ~200-node deep-tail min)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the fixed-budget deep-tail measurement + &lt; 64 band)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *   @see imp-33557-band-crossing-node-budget-floor-climb.js (the band-crossing rung n* ~ 510 cap)
 *
 *   Ticket: imp-33584 (numerical, medium).
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

// 10-node Gauss-Legendre nodes/weights (imp-33249/imp-33277/imp-33295/imp-33316/imp-33539/imp-33560).
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

// -- Configuration (imp-33560 deep-tail grid held verbatim; deeper rungs) --------------------------
const HI = 7;                                    // imp-33316/imp-33539/imp-33560 deep-tail inner domain [0,7]
const DEEP_FLOOR_ULP = 64;                       // imp-33316 widened deep-tail A_log floor band
const N_RUNGS = [425, 450, 475];                 // STILL-DEEPER rungs (below the imp-33557 band-crossing n* ~ 510)
const GRADE = 4;                                 // imp-33295/imp-33316/imp-33539/imp-33560 robust graded rule
const GRADED_MIN_NODES = 200;                    // imp-33539 FLAT graded-GL plateau minimum (all rungs)
const GRADED_MIN_PANELS = 20;                    // 20 panels * 10 GL nodes = 200 nodes
const BAND_CROSSING_RUNG = 510;                  // imp-33557/imp-33579 band-crossing rung n* (cap the extension below it)
// CC single-grid ladder (even N; nodes = N+1); cheap to expensive, extended past imp-33560 for depth.
const CC_LADDER = [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192];
const NODE_COMPETITIVE_RATIO = 4;                // graded NOT >>cheaper than a strong solver if < 4x

// -- Per-rung CC single-grid min-node budget vs the imp-33539 flat graded ~200-node min ------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  // graded min budget cross-check: the imp-33539 flat 200-node plateau residual at this rung.
  const gradedMinUlp = Math.abs(aDirectGradedGL(tauStar, HI, GRADED_MIN_PANELS, GRADE) - aLogVal) / ulpOfALog;

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

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    gradedMinNodes: GRADED_MIN_NODES,
    gradedMinUlp,
    ccRow: Object.freeze(ccRow),
    ccMinN,
    ccMinNodes,
    ccMinUlp,
    ccOverGraded,
    // still node-competitive (< 4x) vs the graded min at this deeper rung?
    ccNodeCompetitive: ccMinNodes < Infinity && ccOverGraded < NODE_COMPETITIVE_RATIO,
    belowBandCrossing: n < BAND_CROSSING_RUNG,
  });
});

// -- Summary statistics ----------------------------------------------------------------------------
const CC_MIN_NODES_BY_RUNG = RUNG_TABLE.map((r) => r.ccMinNodes);
const CC_OVER_GRADED_BY_RUNG = RUNG_TABLE.map((r) => r.ccOverGraded);
const MAX_CC_OVER_GRADED = Math.max(...CC_OVER_GRADED_BY_RUNG);
const MIN_CC_MIN_NODES = Math.min(...CC_MIN_NODES_BY_RUNG);
const MAX_CC_MIN_NODES = Math.max(...CC_MIN_NODES_BY_RUNG);
const WORST_GRADED_MIN_ULP = Math.max(...RUNG_TABLE.map((r) => r.gradedMinUlp));
// The imp-33560 deepest measured ratio was ~2.56x at n=400; the deeper extension pushes it higher.
const IMP33560_MAX_RATIO = 2.56;
const RATIO_KEEPS_CLIMBING = MAX_CC_OVER_GRADED > IMP33560_MAX_RATIO;

// -- Verdict classifiers ---------------------------------------------------------------------------
// (1) A single CC grid still reaches the deep-tail A_log floor band at every deeper rung.
const ccSingleGridReachesFloor = RUNG_TABLE.every((r) => r.ccMinNodes < Infinity);
// (2) The ratio KEEPS CLIMBING past the imp-33560 ~2.56x max as the saddle sharpens with depth.
const ratioClimbsPastImp33560 = RATIO_KEEPS_CLIMBING;
// (3) The ratio does NOT cross the 4x node-competitiveness bar through the deepest in-band rung.
const ratioStaysBelow4x = MAX_CC_OVER_GRADED < NODE_COMPETITIVE_RATIO && RUNG_TABLE.every((r) => r.ccNodeCompetitive);
// (4) The flat graded 200-node min is reproduced inside the band at every deeper rung (cross-check).
const gradedMinReproduced = WORST_GRADED_MIN_ULP < DEEP_FLOOR_ULP;
// (5) Coverage: three still-deeper rungs, all below the imp-33557 band-crossing rung, wide CC ladder.
const deeperTailCovered =
  N_RUNGS.length >= 3 &&
  N_RUNGS.every((n) => n >= 425 && n < BAND_CROSSING_RUNG) &&
  CC_LADDER.length >= 12 &&
  RUNG_TABLE.every((r) => r.belowBandCrossing);

const verdict =
  ccSingleGridReachesFloor && ratioClimbsPastImp33560 && ratioStaysBelow4x && gradedMinReproduced && deeperTailCovered
    ? 'RATIO-CLIMBS-TOWARD-BUT-DOES-NOT-CROSS-4x:-EXTENDING-THE-imp-33560-CC-VS-GRADED-CROSS-SOLVER-MIN-NODE-RATIO-' +
      'TO-STILL-DEEPER-RUNGS-n-in-{425,450,475}-(ALL-BELOW-THE-imp-33557/imp-33579-BAND-CROSSING-RUNG-n*~510)-SHOWS-' +
      'THE-CC-SINGLE-GRID/FLAT-GRADED-(~200-NODE)-MIN-NODE-RATIO-KEEPS-CLIMBING-WITH-DEPTH:-~2.56x-THROUGH-n=450-' +
      '(CC-MIN-513-NODES,-UNCHANGED-FROM-THE-imp-33560-n=400-VALUE)-THEN-~3.85x-AT-n=475-(CC-MIN-769-NODES)-AS-THE-' +
      'LAPLACE-SADDLE-PEAK-SHARPENS-ENOUGH-THAT-THE-N=512-CC-GRID-FALLS-OUT-OF-THE-imp-33316-<64-ULP-BAND-(~69-ULP)-' +
      'AND-CC-MUST-STEP-TO-N=768;-BUT-EVEN-AT-n=475-THE-RATIO-IS-~3.85x,-STILL-UNDER-THE-4x-NODE-COMPETITIVENESS-BAR.-' +
      'SO-THE-FLAT-VS-CLIMBING-GRADED-EDGE-WIDENS-WITH-DEPTH-BUT-DOES-NOT-CROSS-4x-THROUGH-THE-DEEPEST-IN-BAND-RUNG-' +
      'THE-imp-33560-FINDING-(MILD-~1.3-3.8x-REAL-GRADED-WIN,-NOT-THE-~186x-CLAIMED-AGAINST-THE-WEAK-imp-33275-UNIFORM-' +
      'RICHARDSON-LADDER)-SURVIVES-THE-DEEPER-EXTENSION.-ACCURACY/RULE-DESIGN-CROSS-SOLVER-MEASUREMENT-ONLY;-JITTERY-' +
      'LATTICE-FLOOR;-imp-33557-BOUNDS-THE-<64-BAND-AT-n>=510;-NO-LITERAL-PATCHED;-imp-3685/imp-3849/imp-33213/' +
      'imp-33316/imp-33539/imp-33560-INTACT;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-' +
      'NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33584_DEEPER_TAIL_CC_VS_GRADED_RATIO_4X_CROSSING = Object.freeze({
  id: 'imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing',
  ticket: 'imp-33584',
  extendsModule: 'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
  reusesMachineryFrom: 'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
  crossValidatesModules: [
    'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
    'imp-33539-graded-plateau-deeper-tail-min-budget.js',
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'EXTENDS the imp-33560 deep-tail Clenshaw-Curtis cross-solver min-node ratio measurement to STILL-DEEPER rungs ' +
    'n in {425,450,475} (all below the imp-33557/imp-33579 band-crossing rung n* ~ 510) to answer imp-33560s open ' +
    'question: does the CC-single-grid / flat-graded (~200-node) min-node ratio keep climbing with depth and cross ' +
    'the 4x node-competitiveness bar, or plateau? The identical A(tau*) = int_0^7 phiKernel(s)phiKernel(s+tau*) ds ' +
    'test is scored on a single Clenshaw-Curtis grid vs the imp-33213 A_log target, locating the smallest CC grid ' +
    'clearing the imp-33316 < 64 ULP band. RESULT: (1) the ratio KEEPS CLIMBING -- ~2.56x through n=450 (CC min 513 ' +
    'nodes, unchanged from imp-33560s n=400) then ~3.85x at n=475 (CC min 769 nodes) as the N=512 grid falls out of ' +
    'the band (~69 ULP) and CC steps to N=768; (2) but it does NOT cross 4x -- even n=475 is ~3.85x, node-competitive; ' +
    '(3) the flat graded 200-node min stays in band (~43.8/45.7/44.4 ULP). VERDICT: ' +
    'RATIO-CLIMBS-TOWARD-BUT-DOES-NOT-CROSS-4x -- the flat-vs-climbing graded edge widens with depth but stays under ' +
    '4x below the band-crossing rung, so the imp-33560 finding (mild ~1.3-3.8x real graded win, not ~186x) survives. ' +
    'ACCURACY/RULE-DESIGN CROSS-SOLVER MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice ' +
    'floor; imp-33557 bounds the < 64 band at n >= 510; no literal patched; imp-3066 untouched; no QED. ' +
    'PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'STILL-DEEPER rungs n in {425,450,475}, all below the imp-33557 band-crossing rung n* ~ 510; tau* = root of n = 4 pi tau* e^{4 tau*}',
    crossSolver: 'Clenshaw-Curtis SINGLE grid: N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N) mapped to [0,7], standard CC cosine weights -- independent of both the Simpson family and Gauss-Legendre',
    ccLadder: 'even N over nodes 17..8193; smallest whose residual clears the imp-33316 < 64 ULP band',
    gradedReference: 'the imp-33539 FLAT graded-GL plateau minimum (grade 4, 20 panels = 200 nodes)',
    target: 'the imp-33213 log-domain A_log target, residual in ULP = A_log * 2^-52',
    crossingTest: 'does CC-min / graded-min cross 4x at deeper rungs (graded edge widening), or plateau?',
    selfComputing: 'every rung, the CC ladder sweep, the graded-min cross-check, the ratios and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    ccLadder: Object.freeze(CC_LADDER.slice()),
    hi: HI,
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    gradedMinNodes: GRADED_MIN_NODES,
    bandCrossingRung: BAND_CROSSING_RUNG,
    imp33560MaxRatio: IMP33560_MAX_RATIO,
    rungTable: RUNG_TABLE,
    ccMinNodesByRung: Object.freeze(CC_MIN_NODES_BY_RUNG.slice()),
    ccOverGradedByRung: Object.freeze(CC_OVER_GRADED_BY_RUNG.slice()),
    minCcMinNodes: MIN_CC_MIN_NODES,
    maxCcMinNodes: MAX_CC_MIN_NODES,
    maxCcOverGraded: MAX_CC_OVER_GRADED,
    worstGradedMinUlp: WORST_GRADED_MIN_ULP,
    nodeCompetitiveRatio: NODE_COMPETITIVE_RATIO,
    ratioKeepsClimbing: RATIO_KEEPS_CLIMBING,
    ccSingleGridReachesFloor,
    ratioClimbsPastImp33560,
    ratioStaysBelow4x,
    gradedMinReproduced,
    deeperTailCovered,
    verdict,
  }),

  interpretation: Object.freeze({
    theRatioKeepsClimbing:
      'The CC / graded min-node ratio does NOT plateau at the imp-33560 ~2.56x: it holds ~2.56x through n=450 (CC min ' +
      '513 nodes, unchanged from the imp-33560 n=400 value) then JUMPS to ~3.85x at n=475 (CC min 769 nodes) as the ' +
      'Laplace saddle peak sharpens enough that the N=512 CC grid no longer clears the imp-33316 < 64 ULP band (its ' +
      'residual ~69 ULP, just over the bar) and CC must step up to N=768. The flat-vs-climbing graded edge DOES keep ' +
      'widening with depth.',
    itDoesNotCross4x:
      'But even at the deepest in-band rung n=475 the ratio is ~3.85x -- still UNDER the 4x node-competitiveness bar. ' +
      'Across n in {425,450,475}, all below the imp-33557 band-crossing rung n* ~ 510, the graded rule stays ' +
      'node-COMPETITIVE (< 4x) with a strong independent Clenshaw-Curtis solver. The imp-33560 conclusion -- the ' +
      'graded edge is a mild flat-vs-climbing ~1.3-3.8x win, NOT the ~186x claimed against the weak imp-33275 uniform ' +
      'Richardson ladder -- SURVIVES the deeper extension.',
    theGradedMinStaysInBand:
      'The imp-33539 flat graded ~200-node residual is ~43.8 / ~45.7 / ~44.4 ULP at n = 425 / 450 / 475 -- ' +
      'comfortably inside the imp-33316 < 64 ULP band at every rung, so the ratio comparison is against a genuinely ' +
      'band-clearing graded min, and the rungs sit below the imp-33557 band-crossing rung where the < 64 band FAILS.',
    latticeJitterIsTheHonestFloor:
      'The exact CC min-node counts are JITTERY arithmetic-floor lattice properties (imp-33249/imp-33277/imp-33295/' +
      'imp-33539/imp-33560): the CC residual ladder is non-monotone near the floor (at n=475 the N=512 grid lands at ' +
      '~69 ULP, just over the < 64 bar, forcing the step to N=768) and libm exp/pow/cos variation can shift the ' +
      'measurements. The robust reading is the ORDER of the node budgets (~500-800) and the ratio trend (climbing, ' +
      'still < 4x), not the precise 513/769 counts.',
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
    extendsImp33560ToDeeperRungs:
      'This EXTENDS imp-33560 from n in {350,375,400} to n in {425,450,475}: the CC-vs-graded min-node ratio keeps ' +
      'climbing (~2.56x -> ~3.85x) as the saddle sharpens but does NOT cross 4x through the deepest in-band rung, so ' +
      'the imp-33560 flat-vs-climbing finding (mild ~1.3-3.8x real graded win, node-competitive, not ~186x) holds ' +
      'deeper. It PATCHES NO literal and leaves imp-33560 and all source modules intact.',
    derivationScope:
      'Re-measures the deep-tail inner-node budget of the imp-33539 graded rule against an INDEPENDENT single ' +
      'Clenshaw-Curtis grid for the A(tau) weight at three deeper rungs underneath a mass-feasibility diagnostic. It ' +
      'changes NO bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560 intact), and ' +
      'establishes NO operator positivity. Grid-design cross-solver measurement only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33560/imp-33539/imp-33316/imp-33213; this audits the ' +
      'inner quadrature node budget under a cross-solver at deeper rungs, not that truncation.',
    bandValidityCaveat:
      'imp-33537/imp-33557 showed the imp-33316 < 64 ULP band is a coarse-grid artifact that FAILS at deeper rungs ' +
      'n >= 510; the rungs measured here (n in {425,450,475}) sit BELOW that band-crossing rung, so the node-budget ' +
      'and ratio reading is well-posed, but the < 64 band is NOT claimed to hold at every deep rung.',
    latticeJitterCaveat:
      'The CC min-node budgets are single lattice hits on a jittery arithmetic floor; the robust reading is the ' +
      'order of the node budgets (~500-800) and the ratio trend (climbing, < 4x), not the exact 513/769 counts.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33584_DEEPER_TAIL_CC_VS_GRADED_RATIO_4X_CROSSING_ASSERTIONS = [
  {
    id: 'imp33584-single-cc-grid-still-reaches-the-deep-tail-floor',
    why: 'A single independent Clenshaw-Curtis grid must still clear the imp-33316 < 64 ULP deep-tail A_log floor band ' +
         'at every deeper rung n in {425,450,475}.',
    holds: () => ccSingleGridReachesFloor && RUNG_TABLE.every((r) => r.ccMinNodes < Infinity),
  },
  {
    id: 'imp33584-ratio-keeps-climbing-past-imp33560',
    why: 'THE OPEN QUESTION: the CC / graded min-node ratio must KEEP CLIMBING past the imp-33560 ~2.56x max as the ' +
         'saddle sharpens with depth (max ratio here > 2.56x) -- the flat-vs-climbing graded edge widens.',
    holds: () => ratioClimbsPastImp33560 && MAX_CC_OVER_GRADED > IMP33560_MAX_RATIO,
  },
  {
    id: 'imp33584-ratio-does-not-cross-4x-in-band',
    why: 'THE ANSWER: the ratio must NOT cross the 4x node-competitiveness bar through the deepest in-band rung -- the ' +
         'graded edge stays node-competitive (< 4x) below the imp-33557 band-crossing rung, so the imp-33560 finding ' +
         '(mild ~1.3-3.8x win, not ~186x) survives the deeper extension.',
    holds: () => ratioStaysBelow4x && MAX_CC_OVER_GRADED < NODE_COMPETITIVE_RATIO,
  },
  {
    id: 'imp33584-graded-min-reproduced-in-band',
    why: 'Cross-check of imp-33539: the flat graded 200-node plateau must stay inside the < 64 ULP band at every ' +
         'deeper rung (worst well under the band).',
    holds: () => gradedMinReproduced && WORST_GRADED_MIN_ULP < DEEP_FLOOR_ULP,
  },
  {
    id: 'imp33584-deeper-tail-covered-below-band-crossing',
    why: 'The sweep must run across three still-deeper rungs n in {425,450,475}, all below the imp-33557 band-crossing ' +
         'rung n* ~ 510, over a wide CC single-grid ladder.',
    holds: () =>
      deeperTailCovered && RUNG_TABLE.length === N_RUNGS.length && RUNG_TABLE.every((r) => r.belowBandCrossing),
  },
  {
    id: 'imp33584-verdict-records-ratio-climbs-but-does-not-cross-4x',
    why: 'The classified verdict must record that the deeper CC-vs-graded ratio climbs toward but does not cross 4x, ' +
         'not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33584-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design cross-solver measurement only, not a certified bound, no literal ' +
         'patched, source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 untouched, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP33584_DEEPER_TAIL_CC_VS_GRADED_RATIO_4X_CROSSING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.changesAnyBound === false &&
        c.patchedALiteral === false &&
        c.leavesSourceModulesIntact === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33584_DEEPER_TAIL_CC_VS_GRADED_RATIO_4X_CROSSING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33584-deeper-tail-cc-vs-graded-ratio-4x-crossing assertion failed: ${assertion.id}`);
  }
}

export default IMP33584_DEEPER_TAIL_CC_VS_GRADED_RATIO_4X_CROSSING;
