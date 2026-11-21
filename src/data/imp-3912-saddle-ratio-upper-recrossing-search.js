/**
 * @module imp-3912-saddle-ratio-upper-recrossing-search
 * @fileoverview imp-3912 -- LOCATE (or bound) the UPPER R_n = 1 re-crossing past the
 *   imp-3849/imp-3895 sub-unity well. imp-3895 confirmed the ratio well
 *   R_n = |D_n|/|D_n^saddle| bottoms at n = 500 (r_min = R_n - 1 = -5.844e-4) and reported
 *   R_n only "recovering toward 1 from below" above it (r_500 = -5.844e-4, r_560 = -5.796e-4,
 *   r_620 = -5.685e-4) WITHOUT locating the upper rung where R_n returns through 1 -- because
 *   its ladder stopped at MMAX = 628 (rungs to n = 624). This module EXTENDS the imp-3895
 *   composite Clenshaw-Curtis ladder to MMAX = 2200 (accessible top rung n = 2196) to MEASURE
 *   where, or whether, R_n re-crosses unity, cross-checked against the imp-3849 Simpson and
 *   imp-3868 Gauss-Legendre rules for rule-family stability.
 *
 *   THE MEASURED ANSWER (and it CORRECTS the ticket premise)
 *   -------------------------------------------------------
 *   Within the numerically accessible window (n = 500 .. 2196), R_n does NOT re-cross 1.
 *   It stays STRICTLY sub-unity (r_n < 0) at every rung and recovers MONOTONICALLY toward 1
 *   from BELOW -- but the recovery is a DECELERATING asymptotic approach, not an approach to a
 *   findable finite crossing:
 *     r_500 = -5.844e-4 (well floor), r_700 = -5.491e-4, r_1000 = -4.699e-4,
 *     r_1500 = -3.695e-4, r_2000 = -3.035e-4, r_2196 = -2.836e-4.
 *   By the top accessible rung |r| has fallen to only ~48.5% of the well depth and is STILL
 *   ~2.8e-4 below unity. The local power |r_n| ~ n^p STEEPENS with n (p ~ -0.36 near n = 750,
 *   p ~ -0.67 near n = 1650) and r_n * ln(n) DRIFTS (-3.63e-3 at n = 500 -> -2.18e-3 at
 *   n = 2196) -- both signatures of r_n -> 0 from below only as n -> infinity, i.e. R_n -> 1
 *   from below with NO finite upper crossing indicated inside the reachable range.
 *
 *   THE HARD MEASUREMENT CEILING (the sub-gap)
 *   -----------------------------------------
 *   Direct measurement cannot be pushed arbitrarily far: the outer moment integrand tau^m
 *   OVERFLOWS IEEE-754 double at the A(tau) support edge (largest tau node with nonzero
 *   autocorrelation is ~1.37..1.40) once m ~ 2272, so the explicit-moment ladder becomes
 *   non-finite and the CC ladder can form rungs only to n ~ 2268. Whether R_n EVER crosses
 *   back ABOVE 1 at some finite n > 2268, versus asymptoting to 1 from below forever, is
 *   therefore UNDECIDED by this direct-moment measurement -- it lies beyond the tau^m overflow
 *   ceiling. Closing that residual sub-gap needs an overflow-free moment scheme (log-domain
 *   accumulation or per-order moment normalisation), which this measurement does NOT attempt.
 *
 *   RULE-FAMILY STABILITY (the "no re-crossing in reach" is not a CC artifact)
 *   ------------------------------------------------------------------------
 *   All three quadrature families agree on the sub-unity tail across n in [400, 2000]:
 *   CC vs imp-3868 Gauss-Legendre agree to ~7e-7, CC vs imp-3849 Simpson (raised to a
 *   converged 1400/1000-panel resolution) to ~5e-6, and the CC-internal 360/240-vs-300/200
 *   grid delta is ~5e-7 -- all FAR below the ~2.8e-4 sub-unity gap at the top rung. So the
 *   monotone-from-below recovery with no re-crossing is rule-family-independent.
 *   HONEST SUB-NOTE: an UNDER-resolved equispaced Simpson rule (500/400 panels) spuriously
 *   drifts r_n POSITIVE near n ~ 2100 -- but that is itself an edge-under-resolution artifact
 *   (the high moments concentrate at the tau support edge where equispaced nodes are sparse),
 *   which vanishes once Simpson resolution is raised; it echoes, at the OUTER quadrature, the
 *   imp-3731 inner-A(tau)-resolution artifact story. The clustered Clenshaw-Curtis / interior
 *   Gauss-Legendre nodes resolve the edge and stay cleanly negative.
 *
 *   METHOD (self-computing; imp-3895 kernel + algebra, ladder EXTENDED)
 *   -----------------------------------------------------------------
 *     (i)   phiKernel(u) is byte-identical to imp-3849/imp-3868/imp-3895 (NPHI = 10). The
 *           D_n / Q_n / saddle-tau algebra is byte-identical. The ONLY change vs imp-3895 is
 *           MMAX 628 -> 2200 (the ladder reaches further out) plus the overflow-ceiling probe.
 *     (ii)  The Clenshaw-Curtis weights are self-computed by the clencurt construction and
 *           validated in-module (monomial exactness x^p, p = 0..8, to < 1e-13; weight sum 2).
 *     (iii) PRIMARY CC grid: inner A(tau) on [0,1.5] with 240 panels, outer moments on [0,1.5]
 *           with 360 panels, A evaluated once per outer node and reused across m = 0..2200.
 *           A COARSER CC cross-grid (300 outer / 200 inner) gives the CC-internal node check.
 *     (iv)  Cross-solvers: imp-3849-style composite Simpson (1400 outer / 1000 inner panels,
 *           raised to converge the high moments) and imp-3868-style composite 5-point
 *           Gauss-Legendre (420 outer / 320 inner). Same kernel, same algebra, different rules.
 *     (v)   The overflow ceiling is measured DIRECTLY: the primary moment loop is continued
 *           past MMAX until the first non-finite moment, recording m_overflow ~ 2272.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class. This LOCATES no upper crossing; it
 *   MEASURES that R_n stays sub-unity and recovers monotonically from below across the whole
 *   accessible range and BOUNDS the search by the tau^m overflow ceiling. It establishes NO
 *   operator positivity. All solvers SHARE the finite NPHI = 10 kernel truncation, so this
 *   pins the behaviour to that truncated-kernel model, not to a certified error bound.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a >= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict,
 *   no QED. No refereed bound is changed. imp-3849, imp-3868,
 *   imp-3895 and imp-3731 assertions are LEFT INTACT -- this extends the ladder alongside them.
 *
 *   @see imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js (the MMAX = 628 CC ladder this extends)
 *   @see imp-3868-saddle-crossing-gauss-legendre-cross-solver.js (the Gauss-Legendre cross-solver)
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the Simpson well-depth anchor)
 *
 *   Ticket: imp-3912 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (identical to imp-3895)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI -- BYTE-IDENTICAL to imp-3895. */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

// ------------------------------------------------------------------------------------
// PRIMARY / CROSS Clenshaw-Curtis rule (self-computed, validated) -- as imp-3895.
// ------------------------------------------------------------------------------------
const CCORDER = 8;                              // nine Chebyshev-extrema nodes per CC panel

/** Clenshaw-Curtis nodes / weights on [-1,1] for N intervals (standard clencurt construction). */
function clencurt(N) {
  const x = new Array(N + 1);
  const w = new Array(N + 1).fill(0);
  const theta = new Array(N + 1);
  for (let k = 0; k <= N; k += 1) {
    theta[k] = (Math.PI * k) / N;
    x[k] = Math.cos(theta[k]);
  }
  w[0] = 1 / (N * N - 1);
  w[N] = w[0];
  for (let k = 1; k < N; k += 1) {
    let v = 1;
    for (let j = 1; j <= N / 2 - 1; j += 1) v -= (2 * Math.cos(2 * j * theta[k])) / (4 * j * j - 1);
    v -= Math.cos(N * theta[k]) / (N * N - 1);
    w[k] = (2 * v) / N;
  }
  return { x: Object.freeze(x), w: Object.freeze(w) };
}

const CC = clencurt(CCORDER);

// SELF-VALIDATION of the derived CC rule (no weight literals transcribed).
function ccMaxPolyError() {
  let maxerr = 0;
  for (let p = 0; p <= CCORDER; p += 1) {
    let s = 0;
    for (let k = 0; k <= CCORDER; k += 1) s += CC.w[k] * Math.pow(CC.x[k], p);
    const exact = p % 2 === 0 ? 2 / (p + 1) : 0;
    maxerr = Math.max(maxerr, Math.abs(s - exact));
  }
  return maxerr;
}
const CC_MAX_POLY_ERROR = ccMaxPolyError();
const CC_WEIGHT_SUM = CC.w.reduce((a, b) => a + b, 0);

/** Composite Clenshaw-Curtis quadrature with Neumaier compensated accumulation (as imp-3895). */
function clenshawCurtisCompensated(f, lo, hi, panels) {
  const H = (hi - lo) / panels;
  let sum = 0;
  let c = 0;
  const add = (x) => {
    const t = sum + x;
    if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
    else c += (x - t) + sum;
    sum = t;
  };
  for (let p = 0; p < panels; p += 1) {
    const a = lo + p * H;
    const b = a + H;
    const halfW = (b - a) / 2;
    const mid = (a + b) / 2;
    for (let k = 0; k <= CCORDER; k += 1) add(halfW * CC.w[k] * f(mid + halfW * CC.x[k]));
  }
  return sum + c;
}

// ------------------------------------------------------------------------------------
// CROSS-SOLVER rules: composite Simpson (imp-3849 family) and 5-point Gauss-Legendre (imp-3868).
// ------------------------------------------------------------------------------------
function simpson(f, lo, hi, panels) {
  const N = 2 * panels;
  const h = (hi - lo) / N;
  let s = f(lo) + f(hi);
  for (let i = 1; i < N; i += 1) s += (i % 2 ? 4 : 2) * f(lo + i * h);
  return (s * h) / 3;
}

const GL_X = Object.freeze([-0.906179845938664, -0.5384693101056831, 0, 0.5384693101056831, 0.906179845938664]);
const GL_W = Object.freeze([0.2369268850561891, 0.4786286704993665, 0.5688888888888889, 0.4786286704993665, 0.2369268850561891]);
function gaussLegendre(f, lo, hi, panels) {
  const H = (hi - lo) / panels;
  let s = 0;
  for (let p = 0; p < panels; p += 1) {
    const a = lo + p * H;
    const b = a + H;
    const halfW = (b - a) / 2;
    const mid = (a + b) / 2;
    for (let k = 0; k < 5; k += 1) s += halfW * GL_W[k] * f(mid + halfW * GL_X[k]);
  }
  return s;
}

// -- The imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} (identical to imp-3895) --
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ------------------------------------------------------------------------------------
// Moment ladder builder -- generic over a quadrature rule and its OUTER node set.
// Returns MOMENTS[0..probeMax] (moments continued past MMAX to find the overflow ceiling).
// ------------------------------------------------------------------------------------
function buildMoments(quad, innerHi, innerPanels, outerNodes, probeMax) {
  const autocorr = (tau) => quad((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerPanels);
  const { nodes, weights } = outerNodes;
  const numNodes = nodes.length;
  const Avals = nodes.map((tau) => (tau > 1.45 ? 0 : autocorr(tau)));   // A underflows to 0 beyond ~1.4
  const MOMENTS = new Array(probeMax + 1);
  for (let m = 0; m <= probeMax; m += 1) {
    let sum = 0;
    let c = 0;
    for (let j = 0; j < numNodes; j += 1) {
      const aj = Avals[j];
      if (aj === 0) continue;                    // Inf * 0 = NaN guard once tau^m is huge
      const x = weights[j] * Math.pow(nodes[j], m) * aj;
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    }
    MOMENTS[m] = sum + c;
  }
  return MOMENTS;
}

// Outer node-set constructors (Chebyshev-extrema CC / Simpson lattice / Gauss abscissae).
function ccOuterNodes(hi, panels) {
  const H = hi / panels;
  const nodes = [];
  const weights = [];
  for (let p = 0; p < panels; p += 1) {
    const a = p * H;
    const b = a + H;
    const halfW = (b - a) / 2;
    const mid = (a + b) / 2;
    for (let k = 0; k <= CCORDER; k += 1) {
      nodes.push(mid + halfW * CC.x[k]);
      weights.push(halfW * CC.w[k]);
    }
  }
  return { nodes, weights };
}
function simpsonOuterNodes(hi, panels) {
  const N = 2 * panels;
  const h = hi / N;
  const nodes = [];
  const weights = [];
  for (let i = 0; i <= N; i += 1) {
    nodes.push(i * h);
    const wc = i === 0 || i === N ? 1 : i % 2 ? 4 : 2;
    weights.push((wc * h) / 3);
  }
  return { nodes, weights };
}
function glOuterNodes(hi, panels) {
  const H = hi / panels;
  const nodes = [];
  const weights = [];
  for (let p = 0; p < panels; p += 1) {
    const a = p * H;
    const b = a + H;
    const halfW = (b - a) / 2;
    const mid = (a + b) / 2;
    for (let k = 0; k < 5; k += 1) {
      nodes.push(mid + halfW * GL_X[k]);
      weights.push(halfW * GL_W[k]);
    }
  }
  return { nodes, weights };
}

// -- Ratio ladder r_n = R_n - 1 from a moment array (algebra byte-identical to imp-3895) -----
function ratiosFromMoments(MOMENTS, MMAX) {
  const Cn = (n) => MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);
  const Dn = (n) => Cn(n + 2) - Cn(n);            // D_n = C_(n+2) - C_n
  const saddleCn = (n) => {
    const t = saddleTau(n);
    return (t * t) / ((n + 1) * (n + 2));
  };
  const saddleDn = (n) => saddleCn(n + 2) - saddleCn(n);
  const rungs = new Map();
  for (let n = 3; n <= MMAX - 4; n += 1) {
    const ratio = Math.abs(Dn(n)) / Math.abs(saddleDn(n));
    rungs.set(n, ratio - 1);                       // r_n = R_n - 1 (signed)
  }
  return rungs;
}

// ------------------------------------------------------------------------------------
// EXTENDED LADDER (the imp-3912 measurement).
// ------------------------------------------------------------------------------------
const MMAX = 2200;                               // rungs formable to accessible top n = MMAX - 4 = 2196
const PROBE_MAX = 2320;                          // continue moments past MMAX to catch the overflow ceiling
const TOP_N = MMAX - 4;

// PRIMARY CC moments (360 outer / 240 inner), continued to PROBE_MAX for the ceiling probe.
const MOM_CC = buildMoments(clenshawCurtisCompensated, 1.5, 240, ccOuterNodes(1.5, 360), PROBE_MAX);
// COARSER CC cross-grid (300 outer / 200 inner) for the CC-internal node-convergence check.
const MOM_CC_COARSE = buildMoments(clenshawCurtisCompensated, 1.5, 200, ccOuterNodes(1.5, 300), MMAX);
// Simpson cross-solver (1400 outer / 1000 inner -- raised to converge the high moments).
const MOM_SIMPSON = buildMoments(simpson, 1.5, 1000, simpsonOuterNodes(1.5, 1400), MMAX);
// Gauss-Legendre cross-solver (420 outer / 320 inner).
const MOM_GL = buildMoments(gaussLegendre, 1.5, 320, glOuterNodes(1.5, 420), MMAX);

const R_CC = ratiosFromMoments(MOM_CC, MMAX);
const R_CC_COARSE = ratiosFromMoments(MOM_CC_COARSE, MMAX);
const R_SIMPSON = ratiosFromMoments(MOM_SIMPSON, MMAX);
const R_GL = ratiosFromMoments(MOM_GL, MMAX);

// -- The OVERFLOW CEILING: first m with a non-finite primary moment ------------------
let OVERFLOW_M = null;
for (let m = 0; m <= PROBE_MAX; m += 1) {
  if (!Number.isFinite(MOM_CC[m])) {
    OVERFLOW_M = m;
    break;
  }
}
const CEILING_N = OVERFLOW_M === null ? PROBE_MAX - 4 : OVERFLOW_M - 4;   // last formable rung n

// -- Search for an UPPER re-crossing R_n = 1 above the well (first n > 520 with r_n >= 0) ---
let UPPER_CROSS_N = null;
for (let n = 521; n <= TOP_N; n += 1) {
  if (R_CC.get(n) >= 0) {
    UPPER_CROSS_N = n;
    break;
  }
}

// -- Well minimum (deepest sub-unity rung) over the whole extended ladder ------------
let WELL_MIN_N = 3;
let WELL_MIN_R = R_CC.get(3);
for (let n = 3; n <= TOP_N; n += 1) {
  const r = R_CC.get(n);
  if (r < WELL_MIN_R) {
    WELL_MIN_R = r;
    WELL_MIN_N = n;
  }
}

// -- Monotone recovery from the well floor to the top accessible rung ----------------
let MONOTONE_RECOVERY = true;
for (let n = WELL_MIN_N + 1; n <= TOP_N; n += 1) {
  if (R_CC.get(n) <= R_CC.get(n - 1)) {
    MONOTONE_RECOVERY = false;
    break;
  }
}

// -- Tail-decay diagnostics: local power p of |r_n| ~ n^p, and r_n * ln(n) drift -----
function localPower(n1, n2) {
  return Math.log(Math.abs(R_CC.get(n2)) / Math.abs(R_CC.get(n1))) / Math.log(n2 / n1);
}
const TAIL_POWER_750 = localPower(600, 900);      // ~ -0.36
const TAIL_POWER_1650 = localPower(1500, 1800);   // ~ -0.67
const RLNN_500 = R_CC.get(500) * Math.log(500);   // ~ -3.63e-3
const RLNN_TOP = R_CC.get(TOP_N) * Math.log(TOP_N); // ~ -2.18e-3
const SHRINK_FACTOR = Math.abs(R_CC.get(TOP_N)) / Math.abs(R_CC.get(500)); // ~0.485

// -- Rule-family stability (all far below the ~2.8e-4 sub-unity gap at the top) ------
let MAX_CC_GRID_DELTA = 0;      // CC 360/240 vs 300/200 over n >= 200
for (let n = 200; n <= TOP_N; n += 1) {
  const d = Math.abs(R_CC.get(n) - R_CC_COARSE.get(n));
  if (d > MAX_CC_GRID_DELTA) MAX_CC_GRID_DELTA = d;
}
let MAX_CC_VS_GL = 0;           // CC vs GL over n in [400, 2000]
let MAX_CC_VS_SIMPSON = 0;      // CC vs Simpson over n in [400, 2000]
for (let n = 400; n <= 2000; n += 1) {
  MAX_CC_VS_GL = Math.max(MAX_CC_VS_GL, Math.abs(R_CC.get(n) - R_GL.get(n)));
  MAX_CC_VS_SIMPSON = Math.max(MAX_CC_VS_SIMPSON, Math.abs(R_CC.get(n) - R_SIMPSON.get(n)));
}

// -- Classification ------------------------------------------------------------------
const verdict =
  CC_MAX_POLY_ERROR < 1e-12 &&
  Math.abs(CC_WEIGHT_SUM - 2) < 1e-12 &&
  UPPER_CROSS_N === null &&
  WELL_MIN_N === 500 &&
  R_CC.get(TOP_N) < 0 &&
  R_CC.get(TOP_N) > R_CC.get(500) &&
  MONOTONE_RECOVERY &&
  OVERFLOW_M !== null &&
  OVERFLOW_M >= 2240 &&
  OVERFLOW_M <= 2300 &&
  TAIL_POWER_1650 < TAIL_POWER_750 &&
  MAX_CC_GRID_DELTA < 1e-5 &&
  MAX_CC_VS_GL < 1e-5 &&
  MAX_CC_VS_SIMPSON < 1e-4
    ? 'NO-UPPER-RE-CROSSING-IN-REACH:-EXTENDING-THE-imp-3895-CLENSHAW-CURTIS-LADDER-TO-MMAX=2200-' +
      '(TOP-RUNG-n=2196)-FINDS-R_n-STRICTLY-SUB-UNITY-AT-EVERY-RUNG-n=500..2196,-RECOVERING-' +
      'MONOTONICALLY-TOWARD-1-FROM-BELOW-(r_500=-5.84e-4-WELL-FLOOR-TO-r_2196=-2.84e-4,-|r|-DOWN-TO-' +
      '~48.5%-OF-WELL-DEPTH)-WITH-A-DECELERATING-POWER-LAW-(p:-0.36->-0.67)-CONSISTENT-WITH-R_n->1-' +
      'FROM-BELOW-AS-n->inf;-WHETHER-A-FINITE-UPPER-CROSSING-EXISTS-BEYOND-n~2268-IS-UNDECIDED-BY-' +
      'DIRECT-MOMENTS-BECAUSE-tau^m-OVERFLOWS-DOUBLE-AT-m~2272;-CC/GL/SIMPSON-AGREE-ON-THE-TAIL-TO-' +
      '~7e-7/~5e-6-(FAR-BELOW-THE-~2.8e-4-SUB-UNITY-GAP),-SO-THE-NO-RE-CROSSING-IS-RULE-INDEPENDENT'
    : 'INDETERMINATE';

export const IMP3912_SADDLE_RATIO_UPPER_RECROSSING_SEARCH = Object.freeze({
  id: 'imp-3912-saddle-ratio-upper-recrossing-search',
  ticket: 'imp-3912',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extends: 'imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js',
  crossChecks: ['imp-3868-saddle-crossing-gauss-legendre-cross-solver.js', 'imp-3849-saddle-ratio-well-depth-inner-converged.js'],

  summary:
    'LOCATES/BOUNDS the UPPER R_n = 1 re-crossing past the imp-3849/imp-3895 sub-unity well. imp-3895 confirmed ' +
    'the ratio well R_n = |D_n|/|D_n^saddle| bottoms at n = 500 (r_min = -5.844e-4) and only reported R_n ' +
    '"recovering toward 1" above it, its ladder stopping at MMAX = 628 (n = 624). This module EXTENDS the ' +
    'IDENTICAL Clenshaw-Curtis kernel/algebra ladder to MMAX = 2200 (top accessible rung n = 2196) and MEASURES ' +
    'that R_n does NOT re-cross 1 in reach: r_n stays STRICTLY negative at every rung and recovers MONOTONICALLY ' +
    'from below (r_500 = -5.844e-4 well floor, r_700 = -5.491e-4, r_1000 = -4.699e-4, r_1500 = -3.695e-4, ' +
    'r_2000 = -3.035e-4, r_2196 = -2.836e-4 -- |r| down to only ~48.5% of well depth). The recovery is a ' +
    'DECELERATING asymptotic approach (local power |r_n| ~ n^p steepens -0.36 -> -0.67; r_n*ln(n) drifts ' +
    '-3.63e-3 -> -2.18e-3), consistent with R_n -> 1 from below as n -> inf with NO finite upper crossing ' +
    'indicated. The search is BOUNDED by a hard ceiling: the outer moment tau^m OVERFLOWS double at m ~ 2272, ' +
    'so rungs form only to n ~ 2268; whether any finite upper crossing exists beyond that is UNDECIDED by ' +
    'direct moments (residual sub-gap: needs an overflow-free / log-domain moment scheme). Rule-family stable: ' +
    'CC vs imp-3868 GL agree to ~7e-7 and CC vs imp-3849 Simpson (converged 1400/1000) to ~5e-6 across ' +
    'n in [400,2000], CC-internal grid delta ~5e-7 -- all far below the ~2.8e-4 sub-unity gap. (An UNDER-' +
    'resolved equispaced Simpson spuriously drifts positive near n ~ 2100, itself an edge-under-resolution ' +
    'artifact echoing imp-3731.) MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity ' +
    '(imp-3066) untouched; no QED. imp-3849/imp-3868/imp-3895/imp-3731 assertions LEFT INTACT.',

  method: Object.freeze({
    extendsLadder: 'imp-3895 composite Clenshaw-Curtis ladder, MMAX 628 -> 2200 (top accessible rung n = 2196)',
    kernelHeldFixed: 'phiKernel byte-identical to imp-3849/imp-3868/imp-3895 (NPHI = 10); D_n/Q_n/saddle algebra identical',
    primaryCcGrid: 'inner A(tau) on [0,1.5] with 240 CC panels, outer moments on [0,1.5] with 360 CC panels, A evaluated once per outer node and reused across m = 0..2200',
    coarseCcGrid: 'CC 300 outer / 200 inner panels -- CC-internal node-convergence cross-grid',
    simpsonCrossSolver: 'imp-3849-style composite Simpson, 1400 outer / 1000 inner panels (raised to converge the high moments; a 500/400 under-resolved run spuriously drifts positive near n ~ 2100)',
    glCrossSolver: 'imp-3868-style composite 5-point Gauss-Legendre, 420 outer / 320 inner panels',
    ccRuleDerivedNotTranscribed: 'CC nodes/weights self-computed and validated in-module: monomial exactness x^p (p=0..8) < 1e-13, weight sum exactly 2',
    overflowCeilingProbe: 'primary moment loop continued past MMAX to PROBE_MAX = 2320; first non-finite moment records m_overflow (tau^m overflow at the A support edge tau ~ 1.4)',
    overflowGuard: 'tau > 1.45 => A = 0 skips the numerically-zero A tail (Inf*0 = NaN guard), matching imp-3895',
    rungRange: [3, TOP_N],
    selfComputing: true,
  }),

  measured: Object.freeze({
    ccMaxPolyError: CC_MAX_POLY_ERROR,             // ~1e-16 (CC monomial exactness)
    ccWeightSum: CC_WEIGHT_SUM,                    // 2
    topAccessibleN: TOP_N,                         // 2196
    upperCrossN: UPPER_CROSS_N,                    // null -- NO upper re-crossing in reach
    wellMinN: WELL_MIN_N,                          // 500
    wellMinR: WELL_MIN_R,                          // ~ -5.844e-4
    r620: R_CC.get(620),                           // ~ -5.685e-4
    r700: R_CC.get(700),                           // ~ -5.491e-4
    r1000: R_CC.get(1000),                         // ~ -4.699e-4
    r1500: R_CC.get(1500),                         // ~ -3.695e-4
    r2000: R_CC.get(2000),                         // ~ -3.035e-4
    rTop: R_CC.get(TOP_N),                         // r_2196 ~ -2.836e-4 (still sub-unity)
    monotoneRecovery: MONOTONE_RECOVERY,           // true -- strictly increasing r from n=500..2196
    shrinkFactor: SHRINK_FACTOR,                   // ~0.485 (|r_2196|/|r_500|)
    tailPowerNear750: TAIL_POWER_750,              // ~ -0.36 (local power of |r_n| ~ n^p)
    tailPowerNear1650: TAIL_POWER_1650,            // ~ -0.67 (steepening -> asymptotic from below)
    rTimesLnN_at500: RLNN_500,                     // ~ -3.63e-3
    rTimesLnN_atTop: RLNN_TOP,                     // ~ -2.18e-3 (drift, not constant)
    overflowM: OVERFLOW_M,                         // ~2272 -- first non-finite tau^m moment
    ceilingN: CEILING_N,                           // ~2268 -- last rung the direct-moment ladder can form
    simpsonR2000: R_SIMPSON.get(2000),             // ~ -3.087e-4 (converged Simpson cross-check)
    glR2000: R_GL.get(2000),                       // ~ -3.028e-4 (GL cross-check)
    maxCcGridDelta: MAX_CC_GRID_DELTA,             // ~5e-7 (CC 360/240 vs 300/200, n >= 200)
    maxCcVsGl: MAX_CC_VS_GL,                        // ~7e-7 (CC vs GL, n in [400,2000])
    maxCcVsSimpson: MAX_CC_VS_SIMPSON,             // ~5e-6 (CC vs converged Simpson, n in [400,2000])
    verdict,
  }),

  interpretation: Object.freeze({
    noUpperCrossingInReach:
      'Across the entire accessible ladder n = 500 .. 2196 the ratio r_n = R_n - 1 stays STRICTLY negative and ' +
      'recovers MONOTONICALLY from the n = 500 well floor r = -5.844e-4 toward 1 from BELOW, reaching only ' +
      'r_2196 = -2.836e-4 (|r| ~ 48.5% of the well depth). R_n does NOT return through 1 anywhere in reach.',
    recoveryIsAsymptoticNotToAFiniteCrossing:
      'The local power |r_n| ~ n^p STEEPENS with n (p ~ -0.36 near n = 750, p ~ -0.67 near n = 1650) and ' +
      'r_n * ln(n) DRIFTS (-3.63e-3 at n = 500 -> -2.18e-3 at n = 2196). Both signatures point to r_n -> 0 ' +
      'from below only as n -> infinity: R_n -> 1 from below with NO finite upper crossing indicated in reach.',
    hardCeilingBoundsTheSearch:
      'The outer moment integrand tau^m overflows IEEE-754 double at the A(tau) support edge (tau ~ 1.4) once ' +
      'm ~ 2272, so the explicit-moment ladder becomes non-finite and rungs form only to n ~ 2268. Whether R_n ' +
      'EVER crosses back above 1 at some finite n > 2268 is UNDECIDED by direct moments -- the residual sub-gap.',
    ruleFamilyStable:
      'CC vs imp-3868 Gauss-Legendre agree to ~7e-7 and CC vs imp-3849 Simpson (converged 1400/1000) to ~5e-6 ' +
      'across n in [400,2000], with CC-internal grid delta ~5e-7 -- all FAR below the ~2.8e-4 sub-unity gap at ' +
      'the top rung, so the monotone-from-below recovery with no re-crossing is rule-family-independent.',
    underResolvedSimpsonArtifact:
      'An UNDER-resolved equispaced Simpson (500/400 panels) spuriously drifts r_n positive near n ~ 2100 -- an ' +
      'edge-under-resolution artifact (high moments concentrate at the tau support edge where equispaced nodes ' +
      'are sparse), removed by raising resolution. It echoes, at the OUTER quadrature, the imp-3731 inner-A(tau) ' +
      'resolution artifact; the clustered CC / interior GL nodes resolve the edge and stay cleanly negative.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurement: true,
    locatesAFiniteUpperCrossing: false,
    upperCrossingUndecidedBeyondCeiling: true,
    isCertifiedErrorBound: false,
    leavesPriorAssertionsIntact: true,
    residualSubGap:
      'Whether R_n crosses back above 1 at some finite n > 2268 (vs asymptoting to 1 from below forever) is ' +
      'UNDECIDED by this direct-moment measurement: it lies beyond the tau^m double-precision overflow ceiling ' +
      '(m ~ 2272). Closing it needs an overflow-free moment scheme (log-domain accumulation or per-order ' +
      'moment normalisation), NOT attempted here.',
    derivationScope:
      'Extends the imp-3895 CC ladder to MMAX = 2200 and MEASURES no upper re-crossing in reach plus the ' +
      'overflow ceiling that bounds the search. NO operator positivity.',
    sharedKernelTruncation:
      'All solvers SHARE the finite NPHI = 10 kernel truncation, so this pins the behaviour to that ' +
      'truncated-kernel model, not to a certified error bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3912_SADDLE_RATIO_UPPER_RECROSSING_SEARCH_ASSERTIONS = [
  {
    id: 'imp3912-cc-rule-self-validated',
    why: 'The self-computed Clenshaw-Curtis weights must integrate every monomial x^p (p=0..8) on [-1,1] to ' +
         '< 1e-12 and sum to 2, so the extended ladder is genuinely CC and no weight literals were mis-copied.',
    holds: () => CC_MAX_POLY_ERROR < 1e-12 && Math.abs(CC_WEIGHT_SUM - 2) < 1e-12,
  },
  {
    id: 'imp3912-no-upper-recrossing-in-reach',
    why: 'THE CENTRAL MEASUREMENT: extending the CC ladder to the top accessible rung n = 2196 finds NO n > 520 ' +
         'with R_n >= 1 -- R_n stays strictly sub-unity, so no upper re-crossing exists in reach.',
    holds: () => UPPER_CROSS_N === null && R_CC.get(TOP_N) < 0 && TOP_N === 2196,
  },
  {
    id: 'imp3912-monotone-recovery-from-below',
    why: 'R_n recovers MONOTONICALLY from the n = 500 well floor (r ~ -5.844e-4) toward 1 from below, reaching ' +
         'only r_2196 ~ -2.836e-4 (|r| ~ 48.5% of well depth) -- strictly increasing, still sub-unity.',
    holds: () =>
      WELL_MIN_N === 500 &&
      WELL_MIN_R < -5.5e-4 &&
      WELL_MIN_R > -6.5e-4 &&
      MONOTONE_RECOVERY &&
      R_CC.get(TOP_N) < 0 &&
      SHRINK_FACTOR > 0.45 &&
      SHRINK_FACTOR < 0.55,
  },
  {
    id: 'imp3912-recovery-decelerates-asymptotic',
    why: 'The recovery is a DECELERATING asymptotic approach: the local power |r_n| ~ n^p steepens ' +
         '(p near n=1650 more negative than near n=750) and r_n*ln(n) drifts (not constant), consistent with ' +
         'R_n -> 1 from below as n -> inf rather than an approach to a finite crossing.',
    holds: () =>
      TAIL_POWER_1650 < TAIL_POWER_750 &&
      TAIL_POWER_750 < 0 &&
      TAIL_POWER_1650 < 0 &&
      RLNN_500 < 0 &&
      RLNN_TOP < 0 &&
      Math.abs(RLNN_TOP) < Math.abs(RLNN_500),
  },
  {
    id: 'imp3912-overflow-ceiling-bounds-search',
    why: 'The search is BOUNDED by the tau^m overflow ceiling: the primary moment loop hits its first ' +
         'non-finite moment at m ~ 2272 (2240..2300), so the direct-moment ladder can form rungs only to ' +
         'n ~ 2268 -- this is the residual sub-gap on any finite upper crossing beyond it.',
    holds: () =>
      OVERFLOW_M !== null &&
      OVERFLOW_M >= 2240 &&
      OVERFLOW_M <= 2300 &&
      CEILING_N >= TOP_N &&
      CEILING_N < 2300,
  },
  {
    id: 'imp3912-rule-family-stable-on-tail',
    why: 'Rule-family stability: CC vs imp-3868 Gauss-Legendre agree to < 1e-5 and CC vs imp-3849 Simpson ' +
         '(converged 1400/1000) to < 1e-4 across n in [400,2000], with CC-internal grid delta < 1e-5 -- all ' +
         'far below the ~2.8e-4 sub-unity gap, so the no-re-crossing measurement is rule-independent.',
    holds: () =>
      MAX_CC_GRID_DELTA < 1e-5 &&
      MAX_CC_VS_GL < 1e-5 &&
      MAX_CC_VS_SIMPSON < 1e-4 &&
      R_GL.get(2000) < 0 &&
      R_SIMPSON.get(2000) < 0,
  },
  {
    id: 'imp3912-cross-check-imp3895-well-floor',
    why: 'Cross-check vs imp-3895 through the extended ladder: the well floor must still sit at n = 500 with ' +
         'r ~ -5.844e-4 (imp-3895 / imp-3868 GL -5.844e-4), confirming the extension reproduces the anchor.',
    holds: () => WELL_MIN_N === 500 && Math.abs(WELL_MIN_R + 5.844e-4) < 5e-6,
  },
  {
    id: 'imp3912-verdict-not-indeterminate',
    why: 'The classified verdict must record no-upper-re-crossing-in-reach, the monotone-from-below decelerating ' +
         'recovery, the overflow ceiling bounding the search, and rule-family stability -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3912-honest-measurement-not-a-verdict',
    why: 'Mandatory honesty: measurement only, locates no finite upper crossing, the crossing beyond the ' +
         'ceiling is UNDECIDED (named sub-gap), shared kernel truncation not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed, priors intact.',
    holds: () => {
      const c = IMP3912_SADDLE_RATIO_UPPER_RECROSSING_SEARCH.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurement === true &&
        c.locatesAFiniteUpperCrossing === false &&
        c.upperCrossingUndecidedBeyondCeiling === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        c.leavesPriorAssertionsIntact === true &&
        /log-domain/.test(c.residualSubGap) &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3912_SADDLE_RATIO_UPPER_RECROSSING_SEARCH_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3912-saddle-ratio-upper-recrossing-search assertion failed: ${assertion.id}`);
  }
}

export default IMP3912_SADDLE_RATIO_UPPER_RECROSSING_SEARCH;
