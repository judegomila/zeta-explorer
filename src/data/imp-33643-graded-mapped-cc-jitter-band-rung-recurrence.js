/**
 * @module imp-33643-graded-mapped-cc-jitter-band-rung-recurrence
 * @fileoverview imp-33643 -- ASSESS whether the imp-33605 near-floor ~360 ULP jitter bounce
 *   (one even-N step above the graded-mapped Clenshaw-Curtis floor at n=375) RECURS at other
 *   deep-tail rungs, by extending the identical dense even-N scan to n in {325,425,450}.
 *
 *   imp-33605 ran a DENSE even-N scan (every even N in [40,300]) of the imp-33580 graded-mapped CC
 *   residual gUlp(N) = |aDirectCCgraded(tau*,7,N,4) - A_log(tau*)| / (A_log 2^-52) at the three deeper
 *   deep-tail rungs n in {350,375,400} and found the true dense floor (99/91/101 nodes) sits BELOW the
 *   coarse-ladder read (129/97/129) but the near-floor region is genuinely non-monotone. Its most
 *   striking finding was at n=375: the residual dips in-band at N=90 (~16 ULP) then bounces STRAIGHT
 *   back out to ~360 ULP at N=92 -- a ~5.6x-band spike one even step above the floor, FAR larger than
 *   the ~64/~69 ULP grazes at n=350/400. But it only scanned {350,375,400}, so it could NOT tell
 *   whether that ~360 ULP spike is an n=375-specific arithmetic-floor accident or a recurring deep-tail
 *   near-floor hazard. This module answers that: it re-runs the IDENTICAL dense even-N scan at three
 *   FRESH interleaving rungs n in {325,425,450} and reports firstInBandNodes, stableFloorNodes and
 *   bounceMaxUlp per rung.
 *
 *   THE DENSE SCAN (self-computing at import; import-light, no zeros bundle; machinery VERBATIM)
 *   ------------------------------------------------------------------------------------------
 *   For each rung n take tau* = saddleTau(n) and the imp-33213 log-domain A_log(tau*) target, and for
 *   EVERY even N in [40,300] score gUlp(N) = |aDirectCCgraded(tau*,7,N,4) - A_log(tau*)| / (A_log 2^-52).
 *   Per rung we record (identical definitions to imp-33605):
 *     - firstInBandNodes: the SMALLEST N+1 with gUlp &lt; 64 (the true dense-scan floor);
 *     - stableFloorNodes: the smallest N+1 ABOVE which every scanned even N stays in band;
 *     - bounceMaxUlp: the LARGEST gUlp among out-of-band even N sitting ABOVE the first in-band N
 *       (how far the residual bounces back out of the band after first clearing it).
 *
 *   MEASURED (the ~360 ULP spike is n=375-SPECIFIC; a smaller &gt;64-ULP bounce recurs)
 *   ------------------------------------------------------------------------------------
 *        n    tau*       firstInBand        stableFloor    bounceMaxUlp (N)         bounces above floor
 *        325  0.852961   99  (N=98, ~24)    99             ~0    (none)            0  (MONOTONE-CLEAN)
 *        [375 0.880727   91  (N=90, ~16)    169            ~360  (N=92)            imp-33605 reference]
 *        425  0.905173   101 (N=100, ~61)   115            ~76   (N=112)           1
 *        450  0.916385   99  (N=98, ~26)    115            ~86   (N=100)           2
 *
 *     (1) THE ~360 ULP SPIKE DOES NOT RECUR. At none of the three fresh rungs does the near-floor
 *         residual bounce anywhere near ~360 ULP one step above the floor. At n=325 there is NO bounce
 *         at all above the floor (firstInBand == stableFloor == 99 nodes; the scan is monotone-clean
 *         above N=98). At n=425 the worst above-floor bounce is ~76 ULP (N=112, ~1.2x the 64 bar) and
 *         at n=450 it is ~86 ULP (N=100, ~1.3x). The n=375 ~360 ULP spike (~5.6x the bar) is ~4-5x
 *         larger than the worst bounce at ANY of the three neighbours -- it is an n=375-SPECIFIC
 *         arithmetic-floor accident, not a recurring deep-tail hazard.
 *     (2) BUT A SMALLER &gt;64-ULP NEAR-FLOOR BOUNCE DOES RECUR. Two of the three fresh rungs (n=425,450)
 *         DO have at least one out-of-band even N above the first in-band N (~76/~86 ULP), so the
 *         GENERIC near-floor non-monotonicity (a graze/bounce just above the 64 bar) is a real recurring
 *         feature -- consistent with the imp-33605 n=350/400 grazes (~64/~69 ULP). What is n=375-specific
 *         is the MAGNITUDE (~360, a full ~5.6x the band), not the existence of a bounce.
 *     (3) THE DENSE FLOOR AND STABLE FLOOR STAY IN THE imp-33605 BAND. firstInBandNodes = 99/101/99 and
 *         stableFloorNodes = 99/115/115 across the three fresh rungs -- all inside the imp-33605
 *         ~91-169-node jitter band, and the worst stable-floor here (115) is far below both the n=375
 *         upper edge (169) and the imp-33560 unmapped-CC floor (257). The flat-budget edge holds; the
 *         fresh rungs do NOT widen the band beyond what imp-33605 already reported.
 *
 *   HEADLINE / VERDICT. THE-~360-ULP-SPIKE-IS-n=375-SPECIFIC-NOT-A-RECURRING-DEEP-TAIL-HAZARD. Re-running
 *   the imp-33605 dense even-N scan at three fresh interleaving rungs n in {325,425,450} shows the worst
 *   above-floor bounce is ~0/~76/~86 ULP -- at most ~1.3x the 64-ULP bar, ~4-5x SMALLER than the n=375
 *   ~360 ULP (~5.6x) spike, with n=325 fully monotone above its floor. A near-floor bounce just above the
 *   bar (&gt;64 ULP) IS a recurring feature (n=425,450), but the ~360 ULP MAGNITUDE is an n=375-specific
 *   arithmetic-floor accident. The dense/stable floors (99/101/99 and 99/115/115 nodes) sit inside the
 *   imp-33605 ~91-169-node band, so the fresh rungs corroborate the band without widening it, and the
 *   flat-budget edge (all &lt; the imp-33560 unmapped 257) survives.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN LATTICE-JITTER MEASUREMENT ONLY, at the RH-equivalent scale class. It extends
 *   the imp-33605 dense even-N scan to three fresh rungs to test whether the n=375 ~360 ULP spike recurs.
 *   It changes NO bound, patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560/
 *   imp-33580/imp-33605 all LEFT INTACT), and establishes NO operator positivity. The exact per-N ULP
 *   figures are themselves jittery arithmetic-floor lattice properties (cross-platform libm exp/pow/cos
 *   variation can shift the exact 99/101/115/... counts by an even step); the robust reading is the
 *   STRUCTURE -- the ~360 ULP spike is a lone n=375 accident, a smaller &gt;64-ULP bounce recurs, and the
 *   floors stay inside the imp-33605 band -- not the precise counts. imp-33537/imp-33557 showed the
 *   &lt; 64 ULP band is a coarse-grid artifact that FAILS at deeper rungs n &gt;= 510; the rungs here
 *   (n in {325,425,450}) sit firmly inside the band. The NPHI = 10 Phi-series truncation is inherited.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33605-graded-mapped-cc-jitter-band.js (the n=350/375/400 scan whose ~360 ULP spike this tests)
 *   @see imp-33580-graded-mapped-cc-abscissa-artifact.js (the coarse-ladder floor)
 *   @see imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js (the unmapped 257-node CC floor)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33643 (numerical, medium).
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

/**
 * CLENSHAW-CURTIS weights on the N+1 Chebyshev-Lobatto nodes x_k = cos(pi k/N), N even. Held VERBATIM
 * from imp-33605/imp-33580/imp-33560 (Chebyshev-Lobatto abscissae + CC cosine weights).
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

/**
 * (CCg) GRADED-MAPPED single-grid inner rule (imp-33580 test rule): the imp-33539 origin-
 * concentrating map s = hi t^grade, t = (1 + x_k)/2, composed onto the SAME Chebyshev-Lobatto nodes
 * and CC weights, Jacobian ds = hi grade t^{grade-1} dt, dt = dx/2. Held VERBATIM from imp-33605.
 */
function aDirectCCgraded(tau, hi, N, grade) {
  const { x, w } = clenshawCurtis(N);
  let sum = 0;
  for (let k = 0; k <= N; k += 1) {
    const t = 0.5 * (1 + x[k]);
    const s = hi * Math.pow(t, grade);
    const jac = hi * grade * Math.pow(t, grade - 1);
    sum += 0.5 * w[k] * jac * phiKernel(s) * phiKernel(s + tau);
  }
  return sum;
}

// 10-node Gauss-Legendre nodes/weights (imp-33213 log-domain target rule).
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

// -- Configuration (imp-33605 dense-scan grid held verbatim; FRESH interleaving rungs) --------------
const HI = 7;                         // imp-33316/imp-33539/imp-33560 deep-tail inner domain [0,7]
const DEEP_FLOOR_ULP = 64;            // imp-33316 widened deep-tail A_log floor band
const GRADE = 4;                      // imp-33295/imp-33316/imp-33539 origin-concentrating grade
const N_RUNGS = [325, 425, 450];      // FRESH rungs interleaving the imp-33605 {350,375,400}
const SCAN_LO = 40;                   // dense even-N scan start (imp-33605 verbatim)
const SCAN_HI = 300;                  // dense even-N scan end (imp-33605 verbatim)
const UNMAPPED_FLOOR_NODES = 257;     // imp-33560/imp-33580 unmapped-CC min-node floor
// imp-33605 reference: the n=375 near-floor bounce that this module tests for recurrence.
const IMP33605_N375_BOUNCE_ULP = 360; // the ~360 ULP spike one even step above the n=375 floor
const IMP33605_BAND_UPPER_NODES = 169; // the imp-33605 upper jitter edge (stable floor at n=350/375)

// -- Per-rung dense even-N scan of the graded-mapped CC residual (identical definitions) -------------
const RUNG_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aLogVal = aLog(tauStar);
  const ulpOfALog = aLogVal * U;

  const scan = [];
  for (let N = SCAN_LO; N <= SCAN_HI; N += 2) {
    const gUlp = Math.abs(aDirectCCgraded(tauStar, HI, N, GRADE) - aLogVal) / ulpOfALog;
    scan.push({ N, nodes: N + 1, gUlp, inBand: gUlp < DEEP_FLOOR_ULP });
  }

  // firstInBand: the smallest even N clearing the band (the true dense-scan floor).
  const first = scan.find((r) => r.inBand) || null;
  const firstInBandN = first ? first.N : Infinity;
  const firstInBandNodes = first ? first.nodes : Infinity;
  const firstInBandUlp = first ? first.gUlp : Infinity;

  // out-of-band even N sitting ABOVE the first in-band N -- the non-monotone bounce.
  const bouncesAbove = first ? scan.filter((r) => r.N > first.N && !r.inBand) : [];
  const bounceCount = bouncesAbove.length;
  const bounceMaxUlp = bounceCount ? Math.max(...bouncesAbove.map((r) => r.gUlp)) : 0;
  const bounceMaxN = bounceCount
    ? bouncesAbove.reduce((a, b) => (b.gUlp > a.gUlp ? b : a)).N
    : null;
  // stableFloor: smallest even N ABOVE which every scanned even N stays in band (nothing bounces out).
  const lastOutAbove = bounceCount ? bouncesAbove[bouncesAbove.length - 1] : null;
  const stableFloorN = lastOutAbove ? lastOutAbove.N + 2 : firstInBandN;
  const stableFloorNodes = Number.isFinite(stableFloorN) ? stableFloorN + 1 : Infinity;

  // deepest dip in the scan (best achievable residual on this lattice).
  let minUlp = Infinity;
  let minUlpN = null;
  for (const r of scan) {
    if (r.gUlp < minUlp) {
      minUlp = r.gUlp;
      minUlpN = r.N;
    }
  }

  // near-floor window for display: firstInBand-6 .. firstInBand+24.
  const nearFloor = first
    ? scan
        .filter((r) => r.N >= first.N - 6 && r.N <= first.N + 24)
        .map((r) => Object.freeze({ N: r.N, nodes: r.nodes, gUlp: r.gUlp, inBand: r.inBand }))
    : [];

  return Object.freeze({
    n,
    saddleTau: tauStar,
    aLog: aLogVal,
    firstInBandN,
    firstInBandNodes,
    firstInBandUlp,
    bounceCount,
    bounceMaxUlp,
    bounceMaxN,
    stableFloorN,
    stableFloorNodes,
    minUlp,
    minUlpN,
    jitterBandNodes: Object.freeze([firstInBandNodes, stableFloorNodes]),
    nearFloorWindow: Object.freeze(nearFloor),
  });
});

// -- Summary statistics -----------------------------------------------------------------------------
const DENSE_FLOOR_NODES_BY_RUNG = RUNG_TABLE.map((r) => r.firstInBandNodes);
const STABLE_FLOOR_NODES_BY_RUNG = RUNG_TABLE.map((r) => r.stableFloorNodes);
const BOUNCE_MAX_ULP_BY_RUNG = RUNG_TABLE.map((r) => r.bounceMaxUlp);
const WORST_STABLE_FLOOR_NODES = Math.max(...STABLE_FLOOR_NODES_BY_RUNG);
// the LARGEST above-floor bounce across the three FRESH rungs -- the number the n=375 ~360 tests against.
const MAX_FRESH_BOUNCE_ULP = Math.max(...BOUNCE_MAX_ULP_BY_RUNG);
// how many fresh rungs have any >64-ULP above-floor bounce at all.
const RUNGS_WITH_BOUNCE = RUNG_TABLE.filter((r) => r.bounceCount > 0).length;

// -- Verdict classifiers ----------------------------------------------------------------------------
// (1) The dense scan reaches the band at every fresh rung (finite floor to compare).
const denseFloorReachedEveryRung = RUNG_TABLE.every((r) => Number.isFinite(r.firstInBandNodes));
// (2) THE PURPOSE: the ~360 ULP spike does NOT recur -- the worst above-floor bounce at any fresh rung
//     is FAR below the n=375 ~360 ULP (a generous half-magnitude threshold; measured worst is ~86 ULP).
const spikeDoesNotRecur = MAX_FRESH_BOUNCE_ULP < IMP33605_N375_BOUNCE_ULP / 2;
// (3) BUT a smaller >64-ULP near-floor bounce DOES recur (generic non-monotonicity is real).
const smallerBounceRecurs = RUNGS_WITH_BOUNCE >= 1 && MAX_FRESH_BOUNCE_ULP >= DEEP_FLOOR_ULP;
// (4) The fresh dense/stable floors stay inside the imp-33605 upper band edge (169 nodes) -- no widening.
const floorsInsideImp33605Band = WORST_STABLE_FLOOR_NODES <= IMP33605_BAND_UPPER_NODES;
// (5) THE EDGE SURVIVES: even the worst fresh stable-floor stays strictly BELOW the imp-33560 unmapped
//     floor (257), so the flat-budget edge holds at the fresh rungs too.
const edgeSurvivesJitter = WORST_STABLE_FLOOR_NODES < UNMAPPED_FLOOR_NODES;
// (6) Coverage: dense even-N scan (step 2) at three fresh rungs interleaving the imp-33605 set.
const denseCoverage = SCAN_LO <= 90 && SCAN_HI >= 200 && N_RUNGS.length === 3;

const verdict =
  denseFloorReachedEveryRung &&
  spikeDoesNotRecur &&
  smallerBounceRecurs &&
  floorsInsideImp33605Band &&
  edgeSurvivesJitter &&
  denseCoverage
    ? 'THE-imp-33605-n=375-~360-ULP-NEAR-FLOOR-SPIKE-IS-n=375-SPECIFIC-NOT-A-RECURRING-DEEP-TAIL-HAZARD:-' +
      'RE-RUNNING-THE-IDENTICAL-DENSE-EVEN-N-SCAN-AT-THREE-FRESH-INTERLEAVING-RUNGS-n-IN-{325,425,450}-' +
      'GIVES-A-WORST-ABOVE-FLOOR-BOUNCE-OF-~0/~76/~86-ULP-(AT-MOST-~1.3x-THE-64-ULP-BAR,-~4-5x-SMALLER-' +
      'THAN-THE-n=375-~360-ULP-~5.6x-SPIKE,-WITH-n=325-FULLY-MONOTONE-ABOVE-ITS-FLOOR).-A-NEAR-FLOOR-' +
      'BOUNCE-JUST-ABOVE-THE-BAR-(>64-ULP)-IS-A-RECURRING-FEATURE-(n=425,450),-BUT-THE-~360-ULP-MAGNITUDE-' +
      'IS-AN-n=375-SPECIFIC-ARITHMETIC-FLOOR-ACCIDENT.-THE-FRESH-DENSE/STABLE-FLOORS-(99/101/99-AND-' +
      '99/115/115-NODES)-SIT-INSIDE-THE-imp-33605-~91-169-NODE-BAND-AND-BELOW-THE-imp-33560-UNMAPPED-257,-' +
      'SO-THE-FRESH-RUNGS-CORROBORATE-THE-BAND-WITHOUT-WIDENING-IT-AND-THE-FLAT-BUDGET-EDGE-SURVIVES.-' +
      'ACCURACY/RULE-DESIGN-LATTICE-JITTER-MEASUREMENT-ONLY;-JITTERY-ARITHMETIC-FLOOR-(ROBUST-READING-IS-' +
      'THE-STRUCTURE:-~360-IS-A-LONE-n=375-ACCIDENT,-A-SMALLER->64-BOUNCE-RECURS,-FLOORS-INSIDE-THE-BAND,-' +
      'NOT-THE-EXACT-COUNTS);-imp-33537/imp-33557-BOUND-THE-<64-BAND-AT-n>=510;-NO-LITERAL-PATCHED;-' +
      'imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560/imp-33580/imp-33605-INTACT;-mass-' +
      'feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33643_GRADED_MAPPED_CC_JITTER_BAND_RUNG_RECURRENCE = Object.freeze({
  id: 'imp-33643-graded-mapped-cc-jitter-band-rung-recurrence',
  ticket: 'imp-33643',
  extendsScanFrom: 'imp-33605-graded-mapped-cc-jitter-band.js',
  reusesMachineryFrom: 'imp-33605-graded-mapped-cc-jitter-band.js',
  crossValidatesModules: [
    'imp-33605-graded-mapped-cc-jitter-band.js',
    'imp-33580-graded-mapped-cc-abscissa-artifact.js',
    'imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'ASSESSES whether the imp-33605 near-floor ~360 ULP jitter bounce (one even-N step above the graded- ' +
    'mapped CC floor at n=375) recurs at other deep-tail rungs, by extending the identical dense even-N ' +
    'scan (every even N in [40,300], gUlp = |aDirectCCgraded(tau*,7,N,4) - A_log| / (A_log 2^-52)) to three ' +
    'FRESH interleaving rungs n in {325,425,450}. RESULT: the ~360 ULP spike is n=375-SPECIFIC -- the worst ' +
    'above-floor bounce at the fresh rungs is ~0/~76/~86 ULP (at most ~1.3x the 64 bar, ~4-5x smaller than ' +
    'the n=375 ~5.6x spike), with n=325 fully monotone above its floor. A smaller >64-ULP near-floor bounce ' +
    'DOES recur (n=425,450), so the GENERIC non-monotonicity is real but the ~360 MAGNITUDE is an ' +
    'n=375 arithmetic-floor accident. The fresh dense/stable floors (99/101/99 and 99/115/115 nodes) sit ' +
    'inside the imp-33605 ~91-169-node band and below the imp-33560 unmapped 257, so the fresh rungs ' +
    'corroborate the band without widening it and the flat-budget edge survives. VERDICT: THE-~360-ULP-SPIKE-' +
    'IS-n=375-SPECIFIC-NOT-A-RECURRING-DEEP-TAIL-HAZARD. ACCURACY/RULE-DESIGN LATTICE-JITTER MEASUREMENT, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; imp-33537/imp-33557 bound the < 64 ' +
    'band at n >= 510; no literal patched; imp-3066 untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    rungs: 'FRESH interleaving deep-tail rungs n in {325,425,450} (bracketing the imp-33605 {350,375,400}), tau* = root of n = 4 pi tau* e^{4 tau*}',
    rule: 'imp-33605/imp-33580 GRADED-MAPPED CC single grid: origin-concentrating map s = hi t^4, t = (1 + x_k)/2, Chebyshev-Lobatto nodes + CC cosine weights, Jacobian hi*grade*t^{grade-1}, factor 0.5',
    denseScan: 'every EVEN N in [40,300] (imp-33605 verbatim); gUlp = |A_CCg - A_log| / (A_log 2^-52)',
    firstInBand: 'smallest even N with gUlp < 64 -- the TRUE dense-scan floor',
    stableFloor: 'smallest even N above which every scanned even N stays in band (nothing bounces out)',
    bounce: 'max gUlp among out-of-band even N ABOVE the first in-band N -- the non-monotone bounce magnitude tested for recurrence',
    target: 'the imp-33213 log-domain A_log target, residual in ULP = A_log * 2^-52',
    selfComputing: 'every rung, the full dense scan, the dense floor, the stable floor, the bounce magnitude and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    nRungs: Object.freeze(N_RUNGS.slice()),
    scanLo: SCAN_LO,
    scanHi: SCAN_HI,
    hi: HI,
    grade: GRADE,
    deepFloorBandUlp: DEEP_FLOOR_ULP,
    unmappedFloorNodes: UNMAPPED_FLOOR_NODES,
    imp33605N375BounceUlp: IMP33605_N375_BOUNCE_ULP,
    imp33605BandUpperNodes: IMP33605_BAND_UPPER_NODES,
    rungTable: RUNG_TABLE,
    denseFloorNodesByRung: Object.freeze(DENSE_FLOOR_NODES_BY_RUNG.slice()),
    stableFloorNodesByRung: Object.freeze(STABLE_FLOOR_NODES_BY_RUNG.slice()),
    bounceMaxUlpByRung: Object.freeze(BOUNCE_MAX_ULP_BY_RUNG.slice()),
    worstStableFloorNodes: WORST_STABLE_FLOOR_NODES,
    maxFreshBounceUlp: MAX_FRESH_BOUNCE_ULP,
    rungsWithBounce: RUNGS_WITH_BOUNCE,
    denseFloorReachedEveryRung,
    spikeDoesNotRecur,
    smallerBounceRecurs,
    floorsInsideImp33605Band,
    edgeSurvivesJitter,
    denseCoverage,
    verdict,
  }),

  interpretation: Object.freeze({
    theSpikeIsN375Specific:
      'At none of the three fresh rungs does the near-floor residual bounce anywhere near ~360 ULP one step ' +
      'above the floor. At n=325 there is NO above-floor bounce at all (firstInBand == stableFloor == 99 ' +
      'nodes; the scan is monotone-clean above N=98). At n=425 the worst above-floor bounce is ~76 ULP ' +
      '(N=112, ~1.2x the 64 bar) and at n=450 it is ~86 ULP (N=100, ~1.3x). The n=375 ~360 ULP spike ' +
      '(~5.6x the bar) is ~4-5x larger than the worst bounce at ANY of the three neighbours -- an ' +
      'n=375-specific arithmetic-floor accident, not a recurring deep-tail hazard.',
    aSmallerBounceDoesRecur:
      'Two of the three fresh rungs (n=425,450) DO have at least one out-of-band even N above the first ' +
      'in-band N (~76/~86 ULP), so the GENERIC near-floor non-monotonicity (a graze/bounce just above the ' +
      '64 bar) is a real recurring feature -- consistent with the imp-33605 n=350/400 grazes (~64/~69 ULP). ' +
      'What is n=375-specific is the MAGNITUDE (~360, a full ~5.6x the band), not the existence of a bounce.',
    floorsStayInsideTheImp33605Band:
      'firstInBandNodes = 99/101/99 and stableFloorNodes = 99/115/115 across the three fresh rungs -- all ' +
      'inside the imp-33605 ~91-169-node jitter band, and the worst stable-floor here (115) is far below both ' +
      'the n=375 upper edge (169) and the imp-33560 unmapped-CC floor (257). The flat-budget edge holds; the ' +
      'fresh rungs corroborate the band without widening it.',
    latticeJitterIsTheHonestFloor:
      'The exact per-N ULP figures are themselves jittery arithmetic-floor lattice properties (cross-platform ' +
      'libm exp/pow/cos variation can shift the exact 99/101/115/... counts by an even step). The robust ' +
      'reading is the STRUCTURE -- the ~360 ULP spike is a lone n=375 accident, a smaller >64-ULP bounce ' +
      'recurs, and the floors stay inside the imp-33605 band -- not the precise counts.',
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
    assessesImp33605SpikeRecurrence:
      'This EXTENDS the imp-33605 dense even-N scan to three fresh interleaving rungs n in {325,425,450} to ' +
      'test whether its striking n=375 ~360 ULP near-floor spike recurs. It does NOT: the worst above-floor ' +
      'bounce at the fresh rungs is ~0/~76/~86 ULP, ~4-5x smaller, so the ~360 ULP magnitude is an ' +
      'n=375-specific arithmetic-floor accident. A smaller >64-ULP bounce DOES recur, and the floors stay ' +
      'inside the imp-33605 ~91-169-node band.',
    derivationScope:
      'Re-runs the imp-33605 graded-mapped CC dense even-N scan at three fresh rungs. It changes NO bound, ' +
      'patches NO literal (imp-3685/imp-3849/imp-33213/imp-33316/imp-33539/imp-33560/imp-33580/imp-33605 ' +
      'intact), and establishes NO operator positivity. Grid-design lattice-jitter measurement only -- not ' +
      'a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33605/imp-33580/imp-33560/imp-33539/' +
      'imp-33316/imp-33213; this audits the near-floor lattice jitter recurrence, not that truncation.',
    bandValidityCaveat:
      'imp-33537/imp-33557 showed the imp-33316 < 64 ULP band is a coarse-grid artifact that FAILS at deeper ' +
      'rungs n >= 510; the rungs measured here (n in {325,425,450}) sit firmly inside the band, so the jitter ' +
      'recurrence reading is unaffected, but the < 64 band is NOT claimed to hold at every deep rung.',
    latticeJitterCaveat:
      'The exact dense-floor / stable-floor / bounce counts are single lattice hits on a jittery arithmetic ' +
      'floor; the robust reading is the structure (~360 is a lone n=375 accident, a smaller >64-ULP bounce ' +
      'recurs, floors inside the imp-33605 band), not the exact 99/101/99/115/... counts.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ----------------------------------------------------------------------------
export const IMP33643_GRADED_MAPPED_CC_JITTER_BAND_RUNG_RECURRENCE_ASSERTIONS = [
  {
    id: 'imp33643-dense-scan-reaches-band-every-fresh-rung',
    why: 'The dense even-N scan of the graded-mapped CC residual must reach the imp-33316 < 64 ULP band at ' +
         'every fresh interleaving rung n in {325,425,450}, giving a finite dense floor and a well-defined ' +
         'above-floor bounce to compare against the n=375 ~360 ULP spike.',
    holds: () => denseFloorReachedEveryRung && RUNG_TABLE.every((r) => Number.isFinite(r.firstInBandNodes)),
  },
  {
    id: 'imp33643-n375-spike-does-not-recur',
    why: 'THE PURPOSE: the worst above-floor bounce at any fresh rung must be FAR below the imp-33605 n=375 ' +
         '~360 ULP spike (below half its magnitude; measured worst is ~86 ULP at n=450) -- so the ~360 ULP ' +
         'spike is n=375-specific, not a recurring deep-tail hazard.',
    holds: () => spikeDoesNotRecur && MAX_FRESH_BOUNCE_ULP < IMP33605_N375_BOUNCE_ULP / 2,
  },
  {
    id: 'imp33643-smaller-bounce-recurs',
    why: 'HONEST NUANCE: a smaller >64-ULP near-floor bounce IS a recurring feature -- at least one fresh ' +
         'rung must have an out-of-band even N above its first in-band N reaching the 64-ULP bar (n=425,450 ' +
         'do), so the generic near-floor non-monotonicity is real; only the ~360 magnitude is n=375-specific.',
    holds: () => smallerBounceRecurs && RUNGS_WITH_BOUNCE >= 1 && MAX_FRESH_BOUNCE_ULP >= DEEP_FLOOR_ULP,
  },
  {
    id: 'imp33643-floors-inside-imp33605-band',
    why: 'The fresh dense/stable floors must sit INSIDE the imp-33605 ~91-169-node jitter band (worst stable ' +
         'floor <= 169), so the fresh rungs corroborate the band without widening it.',
    holds: () => floorsInsideImp33605Band && WORST_STABLE_FLOOR_NODES <= IMP33605_BAND_UPPER_NODES,
  },
  {
    id: 'imp33643-flat-budget-edge-survives-jitter',
    why: 'THE VERDICT: even the worst fresh stable-floor must stay strictly BELOW the imp-33560 unmapped-CC ' +
         'floor (257 nodes) -- the flat-budget edge holds at the fresh rungs too.',
    holds: () => edgeSurvivesJitter && WORST_STABLE_FLOOR_NODES < UNMAPPED_FLOOR_NODES,
  },
  {
    id: 'imp33643-dense-coverage',
    why: 'The scan must be a DENSE even-N sweep (step 2) that brackets the ~97-129 floor and the near-floor ' +
         'jitter region (SCAN_LO <= 90, SCAN_HI >= 200) across all three fresh rungs.',
    holds: () => denseCoverage && SCAN_LO <= 90 && SCAN_HI >= 200 && RUNG_TABLE.length === 3,
  },
  {
    id: 'imp33643-verdict-records-spike-is-rung-specific',
    why: 'The classified verdict must record that the n=375 ~360 ULP spike is n=375-specific (not recurring) ' +
         'while a smaller bounce recurs -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33643-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design lattice-jitter measurement only, not a certified bound, no ' +
         'literal patched, source modules intact, mass-feasibility necessary-but-not-sufficient, imp-3066 ' +
         'untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33643_GRADED_MAPPED_CC_JITTER_BAND_RUNG_RECURRENCE.honestCaveat;
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

for (const assertion of IMP33643_GRADED_MAPPED_CC_JITTER_BAND_RUNG_RECURRENCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33643-graded-mapped-cc-jitter-band-rung-recurrence assertion failed: ${assertion.id}`);
  }
}

export default IMP33643_GRADED_MAPPED_CC_JITTER_BAND_RUNG_RECURRENCE;
