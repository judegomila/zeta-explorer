/**
 * @module imp-3918-eps-sign-change-three-solver-crossval
 * @fileoverview imp-3918 -- ASSEMBLE the imp-3849 Simpson, imp-3868 Gauss-Legendre and
 *   imp-3895 Clenshaw-Curtis measurements of the moment-ratio correction
 *   eps_n = Q_n/tau*(n)^2 - 1 around its sign-change near n = 149 into a SINGLE
 *   machine-checkable cross-validation object: side-by-side eps_n at n in
 *   {100, 148, 149, 200, 300} for all THREE quadrature rules, with pairwise
 *   inter-solver deltas, giving one provenance artifact that the n = 149 sign-change
 *   is quadrature-rule-family-independent.
 *
 *   WHY THIS MODULE
 *   ---------------
 *   imp-3849 (composite Simpson), imp-3868 (composite 5-point Gauss-Legendre) and
 *   imp-3895 (composite Clenshaw-Curtis) EACH independently located the eps_n sign-change
 *   at n = 149 (Simpson eps_148 = +7.60e-6 / eps_149 = -3.46e-6; CC eps_148 = +7.58e-6 /
 *   eps_149 = -3.48e-6), but the three solvers' eps values around the crossing have never
 *   been tabulated together with their pairwise differences. Without that assembled table
 *   the claim -- the sign-change is not an artifact of any single quadrature family -- is
 *   spread across three modules and never machine-checked in one place. This module
 *   RE-DERIVES eps_n through all three rules (identical de Bruijn-Newman NPHI = 10 kernel,
 *   identical Q_n / tau*(n) algebra, ONLY the quadrature rule differs) and reports the
 *   3-solver x 5-point eps table plus every pairwise |delta| so a reader can confirm at a
 *   glance that (a) all three rules agree to ~1e-6 at each n, and (b) all three put
 *   eps_148 > 0 > eps_149.
 *
 *   METHOD (self-computing; three structurally-distinct rules, one kernel + one algebra)
 *   -----------------------------------------------------------------------------------
 *     (i)   phiKernel(u) is byte-identical to imp-3849 / imp-3868 / imp-3895 (NPHI = 10).
 *     (ii)  Simpson path: composite Neumaier-compensated Simpson, inner A(tau) on [0,2]
 *           with 4800 panels, outer moments on [0,2] with NM = 3200 -- the imp-3849
 *           converged grid.
 *     (iii) Gauss-Legendre path: composite 5-point GL (degree-9), inner A(tau) on [0,1.5]
 *           with 960 panels, outer moments on [0,1.5] with 640 panels -- the imp-3868 grid.
 *     (iv)  Clenshaw-Curtis path: composite order-8 CC (Chebyshev extrema), inner A(tau) on
 *           [0,1.5] with 240 panels, outer moments on [0,1.5] with 360 panels -- the
 *           imp-3895 grid. Its weights are self-computed by the clencurt construction and
 *           validated in-module (monomial exactness x^p, p=0..8, < 1e-12; weight sum 2).
 *     (v)   In every path A(tau) is evaluated once per outer node / grid point, the
 *           tau > 1.45 =&gt; A = 0 guard keeps tau^m finite, and moments run to M_306 (enough
 *           to form eps_n = M_(n+2)/M_n / tau*(n)^2 - 1 through n = 302, covering the five
 *           tabulated points and the full n = 4..300 sign-change scan).
 *
 *   MEASURED (three solvers, side by side)
 *   --------------------------------------
 *     (1) ALL THREE PUT THE SIGN-CHANGE AT n = 149. eps_148 > 0 > eps_149 for Simpson, GL
 *         and CC alike (eps_148 ~ +7.6e-6, eps_149 ~ -3.5e-6), and the first n with
 *         eps_n < 0 following a positive eps_(n-1) is n = 149 for all three.
 *     (2) THE THREE RULES AGREE TO ~1e-6 AT EVERY TABULATED n. The largest pairwise
 *         |delta| across {100,148,149,200,300} is < 5e-6 -- far below the eps_n magnitudes
 *         at n = 100 (~1e-3), n = 200 (~3.4e-4) and n = 300 (~5.0e-4), and comparable to
 *         but not larger than the ~1e-5 near-cancellation scale at n = 148/149, so the
 *         sign at the crossing is unanimous.
 *     (3) THE eps_n PROFILE IS RULE-INDEPENDENT: positive and O(1e-3) at n = 100, passing
 *         through zero at n = 149, negative and growing to n = 200 / n = 300 in all three.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class. This is a PROVENANCE / CROSS-CHECK
 *   assembly of the imp-3849 / imp-3868 / imp-3895 located eps_n values into one object; it
 *   introduces NO new physics and establishes NO operator positivity. All three solvers
 *   SHARE the finite NPHI = 10 kernel truncation, so the agreement pins the sign-change to
 *   that truncated-kernel model, not to a certified error bound -- it confirms the feature
 *   is quadrature-rule-family-independent, not that it is exact. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed
 *   . imp-3849, imp-3868 and imp-3895 assertions are
 *   LEFT INTACT -- this is an independent re-derivation-and-tabulation alongside them.
 *
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (Simpson solver)
 *   @see imp-3868-saddle-crossing-gauss-legendre-cross-solver.js (Gauss-Legendre solver)
 *   @see imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js (Clenshaw-Curtis solver)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (the Q_n/tau*^2 -> 1 correction)
 *
 *   Ticket: imp-3918 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                  // completed-Riemann kernel truncation (identical to the three solvers)
const MMAX = 306;                                 // moments to M_306 -> eps_n formable through n = 302

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI -- byte-identical to imp-3849/imp-3868/imp-3895. */
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

/** The imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} (identical to all three solvers). */
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

// -- Rule 1: composite Simpson with Neumaier compensation (imp-3849) ------------------
function simpsonCompensated(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = 0;
  let c = 0;
  const add = (x) => {
    const t = sum + x;
    if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
    else c += (x - t) + sum;
    sum = t;
  };
  add(f(lo));
  add(f(hi));
  for (let i = 1; i < m; i += 1) add((i % 2 === 0 ? 2 : 4) * f(lo + i * h));
  return ((sum + c) * h) / 3;
}

// The imp-3849 Simpson eps ladder: inner A(tau) grid + Simpson moments on an equispaced lattice.
function simpsonEpsLadder(T_A, NM, innerHi, innerN) {
  const autocorr = (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
  const H_A = T_A / NM;
  const A_GRID = new Array(NM + 1);
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    A_GRID[j] = tau > 1.45 ? 0 : autocorr(tau);
  }
  const MOMENTS = new Array(MMAX + 1);
  for (let m = 0; m <= MMAX; m += 1) {
    let sum = 0;
    let c = 0;
    for (let j = 0; j <= NM; j += 1) {
      const aj = A_GRID[j];
      if (aj === 0) continue;                       // Inf * 0 = NaN guard once tau^m is huge
      const tau = j * H_A;
      const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
      const x = w * Math.pow(tau, m) * aj;
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    }
    MOMENTS[m] = ((sum + c) * H_A) / 3;
  }
  return epsFromMoments(MOMENTS);
}

// -- Rule 2/3: composite panel-node rules (Gauss-Legendre and Clenshaw-Curtis) --------
// 5-point Gauss-Legendre nodes/weights on [-1,1] (degree-9 exact) -- imp-3868.
const GL_X = Object.freeze([0, -0.5384693101056831, 0.5384693101056831, -0.9061798459386640, 0.9061798459386640]);
const GL_W = Object.freeze([0.5688888888888889, 0.4786286704993665, 0.4786286704993665, 0.2369268850561891, 0.2369268850561891]);

// Order-8 Clenshaw-Curtis nodes/weights on [-1,1] (Chebyshev extrema, self-computed) -- imp-3895.
const CCORDER = 8;
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

// SELF-VALIDATION of the derived CC rule: monomial exactness x^p (p=0..8) on [-1,1] and weight sum 2.
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

// Composite panel-node inner integrator with Neumaier compensation (rule = {X,W} on [-1,1]).
function panelCompensated(f, lo, hi, panels, X, W) {
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
    for (let k = 0; k < X.length; k += 1) add(halfW * W[k] * f(mid + halfW * X[k]));
  }
  return sum + c;
}

// The panel-node eps ladder (used for both GL and CC): A(tau) evaluated once per outer node.
function panelEpsLadder(outerHi, outerPanels, innerHi, innerPanels, X, W) {
  const autocorr = (tau) => panelCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerPanels, X, W);
  const H = outerHi / outerPanels;
  const nodes = [];
  const weights = [];
  const Avals = [];
  for (let p = 0; p < outerPanels; p += 1) {
    const a = p * H;
    const b = a + H;
    const halfW = (b - a) / 2;
    const mid = (a + b) / 2;
    for (let k = 0; k < X.length; k += 1) {
      const tau = mid + halfW * X[k];
      nodes.push(tau);
      weights.push(halfW * W[k]);
      Avals.push(tau > 1.45 ? 0 : autocorr(tau));   // A(tau) underflows to 0 beyond ~1.4
    }
  }
  const numNodes = nodes.length;
  const MOMENTS = new Array(MMAX + 1);
  for (let m = 0; m <= MMAX; m += 1) {
    let sum = 0;
    let c = 0;
    for (let j = 0; j < numNodes; j += 1) {
      const aj = Avals[j];
      if (aj === 0) continue;                       // Inf * 0 = NaN guard once tau^m is huge
      const x = weights[j] * Math.pow(nodes[j], m) * aj;
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    }
    MOMENTS[m] = sum + c;
  }
  return epsFromMoments(MOMENTS);
}

// Shared algebra: eps_n = Q_n/tau*(n)^2 - 1 with Q_n = M_(n+2)/M_n (imp-3646), identical across rules.
function epsFromMoments(MOMENTS) {
  const eps = new Array(MMAX - 1).fill(null);
  for (let n = 3; n <= MMAX - 2; n += 1) {
    const t = saddleTau(n);
    eps[n] = MOMENTS[n + 2] / MOMENTS[n] / (t * t) - 1;
  }
  return eps;
}

// -- Build the three eps ladders on each solver's converged primary grid --------------
const EPS_SIMPSON = simpsonEpsLadder(2, 3200, 2, 4800);            // imp-3849 grid
const EPS_GL = panelEpsLadder(1.5, 640, 1.5, 960, GL_X, GL_W);    // imp-3868 grid
const EPS_CC = panelEpsLadder(1.5, 360, 1.5, 240, CC.x, CC.w);   // imp-3895 grid

// First n with eps_n < 0 following a positive eps_(n-1) -- the sign-change locator, per solver.
function epsSignChangeN(eps) {
  for (let n = 4; n <= MMAX - 2; n += 1) {
    if (eps[n - 1] > 0 && eps[n] < 0) return n;
  }
  return null;
}
const SIGN_CHANGE_SIMPSON = epsSignChangeN(EPS_SIMPSON);
const SIGN_CHANGE_GL = epsSignChangeN(EPS_GL);
const SIGN_CHANGE_CC = epsSignChangeN(EPS_CC);

// -- The 3-solver x 5-point eps cross-validation table with pairwise inter-solver deltas ---
const TABLE_NS = Object.freeze([100, 148, 149, 200, 300]);
const CROSSVAL_TABLE = TABLE_NS.map((n) => {
  const simpson = EPS_SIMPSON[n];
  const gl = EPS_GL[n];
  const cc = EPS_CC[n];
  return Object.freeze({
    n,
    simpson,                                        // imp-3849 eps_n
    gl,                                             // imp-3868 eps_n
    cc,                                             // imp-3895 eps_n
    deltaSimpsonGl: Math.abs(simpson - gl),         // |eps^Simpson - eps^GL|
    deltaSimpsonCc: Math.abs(simpson - cc),         // |eps^Simpson - eps^CC|
    deltaGlCc: Math.abs(gl - cc),                   // |eps^GL - eps^CC|
    allSameSign: Math.sign(simpson) === Math.sign(gl) && Math.sign(gl) === Math.sign(cc),
  });
});

// Largest pairwise inter-solver |delta| across the whole table -- the three-rule agreement scale.
let MAX_PAIRWISE_DELTA = 0;
for (const row of CROSSVAL_TABLE) {
  MAX_PAIRWISE_DELTA = Math.max(MAX_PAIRWISE_DELTA, row.deltaSimpsonGl, row.deltaSimpsonCc, row.deltaGlCc);
}

// Every tabulated row must have the three solvers unanimous in sign (the crossing is rule-independent).
const ALL_ROWS_UNANIMOUS_SIGN = CROSSVAL_TABLE.every((row) => row.allSameSign);
const CROSSING_ROWS_UNANIMOUS =
  CROSSVAL_TABLE.find((r) => r.n === 148).simpson > 0 &&
  CROSSVAL_TABLE.find((r) => r.n === 148).gl > 0 &&
  CROSSVAL_TABLE.find((r) => r.n === 148).cc > 0 &&
  CROSSVAL_TABLE.find((r) => r.n === 149).simpson < 0 &&
  CROSSVAL_TABLE.find((r) => r.n === 149).gl < 0 &&
  CROSSVAL_TABLE.find((r) => r.n === 149).cc < 0;

// -- Classification ------------------------------------------------------------------
const verdict =
  CC_MAX_POLY_ERROR < 1e-12 &&
  Math.abs(CC_WEIGHT_SUM - 2) < 1e-12 &&
  SIGN_CHANGE_SIMPSON === 149 &&
  SIGN_CHANGE_GL === 149 &&
  SIGN_CHANGE_CC === 149 &&
  CROSSING_ROWS_UNANIMOUS &&
  ALL_ROWS_UNANIMOUS_SIGN &&
  MAX_PAIRWISE_DELTA < 5e-6
    ? 'THREE-SOLVER-CROSS-VALIDATION-CONFIRMS-eps_n-SIGN-CHANGE-AT-n=149:-SIMPSON-(imp-3849),-GAUSS-LEGENDRE-' +
      '(imp-3868)-AND-CLENSHAW-CURTIS-(imp-3895)-ALL-PUT-eps_148>0>eps_149-AND-FIRST-NEGATIVE-AT-n=149,-WITH-' +
      'THE-LARGEST-PAIRWISE-INTER-SOLVER-|delta|-BELOW-5e-6-ACROSS-n-IN-{100,148,149,200,300};-SO-THE-eps_n-' +
      'SIGN-CHANGE-IS-QUADRATURE-RULE-FAMILY-INDEPENDENT,-NOT-AN-ARTIFACT-OF-ANY-ONE-RULE'
    : 'INDETERMINATE';

export const IMP3918_EPS_SIGN_CHANGE_THREE_SOLVER_CROSSVAL = Object.freeze({
  id: 'imp-3918-eps-sign-change-three-solver-crossval',
  ticket: 'imp-3918',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  assembles: [
    'imp-3849-saddle-ratio-well-depth-inner-converged.js',
    'imp-3868-saddle-crossing-gauss-legendre-cross-solver.js',
    'imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js',
  ],
  relatedCorrection: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',

  summary:
    'ASSEMBLES the imp-3849 Simpson, imp-3868 Gauss-Legendre and imp-3895 Clenshaw-Curtis measurements of the ' +
    'moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1 around its sign-change near n = 149 into a SINGLE ' +
    'machine-checkable cross-validation object: eps_n at n in {100,148,149,200,300} for all THREE quadrature ' +
    'families side-by-side, with every pairwise inter-solver |delta|. Each ladder re-derives eps_n through the ' +
    'IDENTICAL de Bruijn-Newman NPHI = 10 kernel and the IDENTICAL Q_n / tau*(n) algebra on that solver\'s ' +
    'own converged grid (Simpson: inner [0,2]/4800, outer [0,2]/NM=3200; GL: inner [0,1.5]/960, outer ' +
    '[0,1.5]/640; CC: inner [0,1.5]/240, outer [0,1.5]/360, weights self-computed and validated). RESULT: all ' +
    'three solvers put eps_148 > 0 > eps_149 and locate the first-negative rung at n = 149, and the largest ' +
    'pairwise inter-solver |delta| across the five tabulated n is below 5e-6 -- far below the eps magnitude at ' +
    'n = 100 (~1e-3), n = 200 (~3.4e-4) and n = 300 (~5.0e-4). So the eps_n sign-change at n = 149 is ' +
    'quadrature-rule-family-independent, tabulated once as a provenance artifact rather than spread across ' +
    'three modules. MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) ' +
    'untouched; no QED. imp-3849, imp-3868 and imp-3895 assertions LEFT INTACT.',

  method: Object.freeze({
    kernelHeldFixed: 'phiKernel byte-identical to imp-3849/imp-3868/imp-3895 (NPHI=10); only the quadrature rule differs across the three ladders',
    algebraIdentical: 'eps_n = Q_n/tau*(n)^2 - 1, Q_n = M_(n+2)/M_n, saddle tau*(n) bisection -- shared epsFromMoments across all three rules',
    simpsonGrid: 'composite Neumaier-compensated Simpson: inner A(tau) on [0,2] with 4800 panels, outer moments on [0,2] with NM=3200 (imp-3849)',
    glGrid: 'composite 5-point Gauss-Legendre (degree-9): inner A(tau) on [0,1.5] with 960 panels, outer moments on [0,1.5] with 640 panels (imp-3868)',
    ccGrid: 'composite order-8 Clenshaw-Curtis (Chebyshev extrema, self-computed weights): inner A(tau) on [0,1.5] with 240 panels, outer moments on [0,1.5] with 360 panels (imp-3895)',
    ccRuleValidated: 'CC weights self-computed by the clencurt construction and validated in-module: monomial exactness x^p (p=0..8) < 1e-12, weight sum 2',
    overflowGuard: 'tau > 1.45 => A = 0 keeps tau^m finite (Inf*0=NaN guard) in all three paths',
    momentsTo: MMAX,
    tabulatedNs: TABLE_NS,
    selfComputing: true,
  }),

  measured: Object.freeze({
    ccMaxPolyError: CC_MAX_POLY_ERROR,               // ~1e-16 (CC rule monomial exactness)
    ccWeightSum: CC_WEIGHT_SUM,                      // 2
    signChangeSimpson: SIGN_CHANGE_SIMPSON,          // 149
    signChangeGl: SIGN_CHANGE_GL,                    // 149
    signChangeCc: SIGN_CHANGE_CC,                    // 149
    crossValTable: Object.freeze(CROSSVAL_TABLE),    // 3 solvers x {100,148,149,200,300} with pairwise deltas
    maxPairwiseDelta: MAX_PAIRWISE_DELTA,            // < 5e-6 across the table
    allRowsUnanimousSign: ALL_ROWS_UNANIMOUS_SIGN,   // true
    crossingRowsUnanimous: CROSSING_ROWS_UNANIMOUS,  // eps_148 > 0, eps_149 < 0 for all three
    epsSimpson148: EPS_SIMPSON[148],                 // ~+7.60e-6
    epsSimpson149: EPS_SIMPSON[149],                 // ~-3.46e-6
    epsGl148: EPS_GL[148],                           // ~+7.6e-6
    epsGl149: EPS_GL[149],                           // ~-3.5e-6
    epsCc148: EPS_CC[148],                           // ~+7.58e-6
    epsCc149: EPS_CC[149],                           // ~-3.48e-6
    verdict,
  }),

  interpretation: Object.freeze({
    signChangeRuleFamilyIndependent:
      'Composite Simpson (equispaced Newton-Cotes), 5-point Gauss-Legendre (interior Gauss abscissae) and ' +
      'order-8 Clenshaw-Curtis (clustered Chebyshev extrema) share no node placement, weight pattern or error ' +
      'mechanism, yet all three locate the eps_n sign-change at n = 149 with eps_148 > 0 > eps_149. The feature ' +
      'is therefore not an artifact of any single quadrature rule family -- it is pinned to the NPHI=10 kernel.',
    agreementBelowFeature:
      'The largest pairwise inter-solver |delta| across n in {100,148,149,200,300} is below 5e-6, far below the ' +
      'eps magnitude at n = 100 (~1e-3), n = 200 (~3.4e-4) and n = 300 (~5.0e-4); at the n = 148/149 crossing ' +
      'the residual near-cancellation scale (~1e-5) still leaves all three solvers unanimous in sign.',
    provenanceArtifact:
      'This assembles into ONE object what was previously spread across imp-3849, imp-3868 and imp-3895 -- a ' +
      'single machine-checkable table of the three-solver eps_n around the crossing with all pairwise deltas.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    isProvenanceAssembly: true,
    leavesImp3849Imp3868Imp3895AssertionsIntact: true,
    derivationScope:
      'Cross-validation ASSEMBLY of the imp-3849 / imp-3868 / imp-3895 eps_n sign-change at n = 149 into one ' +
      'tabulated object with pairwise inter-solver deltas. NO operator positivity.',
    sharedKernelTruncation:
      'All three solvers SHARE the finite NPHI = 10 kernel truncation, so the agreement pins the sign-change to ' +
      'that truncated-kernel model, not to a certified error bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3918_EPS_SIGN_CHANGE_THREE_SOLVER_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3918-cc-rule-self-validated',
    why: 'THE CC RULE IS DERIVED, NOT TRANSCRIBED: the self-computed Clenshaw-Curtis weights must integrate ' +
         'every monomial x^p (p=0..8) on [-1,1] to < 1e-12 and sum to 2, so the third ladder is genuinely CC.',
    holds: () => CC_MAX_POLY_ERROR < 1e-12 && Math.abs(CC_WEIGHT_SUM - 2) < 1e-12,
  },
  {
    id: 'imp3918-all-three-solvers-sign-change-n149',
    why: 'THE CENTRAL CROSS-VALIDATION: Simpson, Gauss-Legendre and Clenshaw-Curtis EACH locate the eps_n ' +
         'sign-change (first n with eps_n < 0 after a positive eps_(n-1)) at exactly n = 149.',
    holds: () => SIGN_CHANGE_SIMPSON === 149 && SIGN_CHANGE_GL === 149 && SIGN_CHANGE_CC === 149,
  },
  {
    id: 'imp3918-crossing-rows-unanimous-sign',
    why: 'At the crossing all three solvers must agree in sign: eps_148 > 0 and eps_149 < 0 for Simpson, GL ' +
         'and CC alike, so the located n = 149 is not a single-rule quirk.',
    holds: () =>
      CROSSING_ROWS_UNANIMOUS &&
      EPS_SIMPSON[148] > 0 && EPS_GL[148] > 0 && EPS_CC[148] > 0 &&
      EPS_SIMPSON[149] < 0 && EPS_GL[149] < 0 && EPS_CC[149] < 0,
  },
  {
    id: 'imp3918-three-rules-agree-below-5e-6',
    why: 'The largest pairwise inter-solver |delta| across n in {100,148,149,200,300} must be below 5e-6 -- ' +
         'far below the eps magnitudes at n = 100/200/300 -- so the three rules genuinely agree, not merely ' +
         'share a sign.',
    holds: () => MAX_PAIRWISE_DELTA < 5e-6 && MAX_PAIRWISE_DELTA > 0,
  },
  {
    id: 'imp3918-eps-profile-rule-independent',
    why: 'The eps_n profile is rule-independent: positive and O(1e-3) at n = 100, negative and O(1e-4) at ' +
         'n = 200 and n = 300, in ALL three solvers.',
    holds: () =>
      EPS_SIMPSON[100] > 5e-4 && EPS_GL[100] > 5e-4 && EPS_CC[100] > 5e-4 &&
      EPS_SIMPSON[200] < 0 && EPS_GL[200] < 0 && EPS_CC[200] < 0 &&
      EPS_SIMPSON[300] < 0 && EPS_GL[300] < 0 && EPS_CC[300] < 0,
  },
  {
    id: 'imp3918-table-has-five-rows-with-deltas',
    why: 'The cross-validation table must carry all five n and, for each, the three solver eps values and all ' +
         'three pairwise deltas -- a complete provenance artifact.',
    holds: () =>
      CROSSVAL_TABLE.length === 5 &&
      CROSSVAL_TABLE.every(
        (r) =>
          typeof r.simpson === 'number' &&
          typeof r.gl === 'number' &&
          typeof r.cc === 'number' &&
          typeof r.deltaSimpsonGl === 'number' &&
          typeof r.deltaSimpsonCc === 'number' &&
          typeof r.deltaGlCc === 'number'
      ),
  },
  {
    id: 'imp3918-verdict-not-indeterminate',
    why: 'The classified verdict must record the three-solver confirmation of the n = 149 sign-change and the ' +
         'sub-5e-6 inter-solver agreement -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3918-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: provenance assembly only, shared kernel truncation not a certified bound, ' +
         'mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed' +
         ', and imp-3849/imp-3868/imp-3895 assertions left intact.',
    holds: () => {
      const c = IMP3918_EPS_SIGN_CHANGE_THREE_SOLVER_CROSSVAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isProvenanceAssembly === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        c.leavesImp3849Imp3868Imp3895AssertionsIntact === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3918_EPS_SIGN_CHANGE_THREE_SOLVER_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3918-eps-sign-change-three-solver-crossval assertion failed: ${assertion.id}`);
  }
}

export default IMP3918_EPS_SIGN_CHANGE_THREE_SOLVER_CROSSVAL;
