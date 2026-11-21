/**
 * @module imp-3408-capture-ratio-quadrature-cross-validation
 * @fileoverview imp-3408 -- CROSS-VALIDATE the imp-3350 equality r_star = r_lin
 *   (the a -> 0 sinh-shear capture limit equals the exactly-linear-shear ratio)
 *   via an INDEPENDENT quadrature route rather than the single N = 240 midpoint
 *   power-iteration that imp-3350 used.
 *
 *   CONTEXT
 *   -------
 *   imp-3350 certifies, at fixed U, that the a^2-Richardson-extrapolated a -> 0
 *   limit r_star of the sinh-shear capture ratio r = ||T|| / ||Gshear|| equals the
 *   exactly-linear-shear ratio r_lin = ||Tlin|| / ||Glin|| to below 5e-15, and that
 *   the rank-2 skew denominator has the closed form ||Glin|| = sqrt(Q0 Q2 - Q1^2),
 *   Q_k = sum_i u_i^k Phi_i^2. Its honestCaveat.limitIsNumericalNotSymbolic flags
 *   the single-route risk: everything was computed on ONE discretization (midpoint,
 *   N = 240 uniform nodes) with ONE spectral routine (power iteration), so the
 *   coincidence could in principle be a shared-quadrature artifact.
 *
 *   WHAT THIS MODULE DOES (the imp-3408 deliverable -- CROSS-VALIDATE)
 *   ----------------------------------------------------------------
 *   It rebuilds BOTH ratios on a completely different discretization and reports the
 *   cross-route agreement:
 *     (a) NODES: Gauss-Legendre nodes + weights on [0, U] (non-uniform, distinct node
 *         count nGL = 160), NOT the imp-3350 uniform midpoint grid.
 *     (b) OPERATOR NORM: the integral operator is discretized in the symmetric
 *         weighted form Ktilde_ij = sqrt(w_i) K(u_i, u_j) sqrt(w_j) (D K D, D =
 *         diag(sqrt(w))), the L2-operator-norm-preserving GL analogue of the bare
 *         midpoint matrix (for uniform weights D = sqrt(H) I is a scalar and cancels
 *         in the ratio, which is exactly why imp-3350 could omit it).
 *     (c) AUTOCORRELATION: the lag-stationary surrogate uses the CONTINUUM
 *         autocorrelation R(tau) = (1 / (U - tau)) int_0^{U-tau} Phi(u) Phi(u + tau) du,
 *         evaluated by its own Gauss-Legendre quadrature (MR = 220 nodes), in place of
 *         the imp-3350 discrete integer-lag average Abar(k) = A_Phi(k) / (N - k).
 *   So node set, node count, quadrature rule, weighting, AND the autocorrelation
 *   estimator all differ from imp-3350 -- a genuinely independent route.
 *
 *   THE FINDING (cross-validation, RH-equivalent, NO QED)
 *   ----------------------------------------------------
 *   (1) The WITHIN-ROUTE equality r_star = r_lin SURVIVES the change of quadrature to
 *       machine precision: at U = 6, 8, 10 the GL-route a^2-Richardson sinh limit and
 *       the GL-route exactly-linear ratio agree to gap &lt; 1e-11 (U = 6: 2.2e-13, U = 8:
 *       8.6e-16, U = 10: 2.5e-16). The imp-3350 core claim -- the sinh a -> 0 capture
 *       limit IS the exactly-linear-shear ratio -- is NOT a midpoint / power-iteration
 *       artifact; it holds identically under Gauss-Legendre nodes with the continuum
 *       autocorrelation.
 *   (2) The rank-2 closed form ||Glin|| = sqrt(Q0 Q2 - Q1^2) is even TIGHTER under GL
 *       weights: the GL-weighted moments reproduce the GL power-iteration operator norm
 *       to &lt; 1e-13 relative (vs ~1e-10 for midpoint), because GL exactly integrates the
 *       low-order polynomial moments Q_k.
 *   (3) The ABSOLUTE ratio value is quadrature-dependent at finite resolution and the
 *       two routes converge to a COMMON continuum limit from OPPOSITE sides. At U = 6
 *       midpoint descends with N (0.0305983 -> 0.0296645 -> 0.0294490 for N = 120, 240,
 *       480) while GL climbs with nGL (0.0291758 at 128 -> 0.0293678 at 256); the
 *       midpoint O(H^2) Richardson (N = 240 -> 480) lands at r_lin(U = 6) = 0.0293772 and
 *       GL at nGL = 256 gives 0.0293678, AGREEING to ~9.4e-6. So the imp-3350 headline
 *       0.0296645 carries a ~0.98% finite-N MIDPOINT BIAS above the resolution-converged
 *       continuum ratio ~0.02938 -- the equality r_star = r_lin is exact per route, but
 *       the shared midpoint N = 240 absolute number is ~1% high. This does not touch
 *       imp-3346 (which measures C = lim_U r_lin U as a ratio-shape constant) nor the
 *       imp-3399 symbolic evenness identity (which is per-route exact).
 *
 *   @see imp-3350-capture-ratio-linear-shear-limit.js (the single-route N=240 certification)
 *   @see imp-3399-capture-ratio-sinh-odd-factorization-identity.js (symbolic r even in a)
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (C = lim_U r_lin U ~ 0.1751)
 *
 *   Ticket: imp-3408 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3350 / imp-3240)
const NGL = 160; // Gauss-Legendre operator node count (distinct from the imp-3350 midpoint N = 240)
const MR = 220; // Gauss-Legendre node count for the continuum autocorrelation R(tau)
const ITERS = 350; // power-iteration steps (converges the ratio to better than 1e-8 at this N)
const U_CHECK = Object.freeze([6, 8, 10]); // fixed-U cells (identical to imp-3350)

// imp-3350 midpoint N=240 headline linear ratios, baked as literals (no heavy cross-import).
const IMP3350_MIDPOINT_N240 = Object.freeze({ 6: 0.0296645199, 8: 0.0223367161, 10: 0.0180106555 });

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3350). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Gauss-Legendre nodes and weights on [-1, 1] via Newton iteration on the Legendre polynomial P_n. */
function gaussLegendre(n) {
  const x = new Array(n);
  const w = new Array(n);
  for (let i = 0; i < n; i++) {
    let xi = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)); // asymptotic initial guess for the i-th root
    for (let it = 0; it < 100; it++) {
      let p0 = 1;
      let p1 = xi;
      for (let k = 2; k <= n; k++) {
        const p2 = ((2 * k - 1) * xi * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      const dp = n * (xi * p1 - p0) / (xi * xi - 1); // P_n prime
      const dx = p1 / dp;
      xi -= dx;
      if (Math.abs(dx) < 1e-15) break;
    }
    let p0 = 1;
    let p1 = xi;
    for (let k = 2; k <= n; k++) {
      const p2 = ((2 * k - 1) * xi * p1 - (k - 1) * p0) / k;
      p0 = p1;
      p1 = p2;
    }
    const dp = n * (xi * p1 - p0) / (xi * xi - 1);
    x[i] = xi;
    w[i] = 2 / ((1 - xi * xi) * dp * dp);
  }
  return { x, w };
}

/** Gauss-Legendre nodes + weights affine-mapped to [0, U]. */
function nodesOn(U, n) {
  const { x, w } = gaussLegendre(n);
  const u = new Array(n);
  const ww = new Array(n);
  for (let i = 0; i < n; i++) {
    u[i] = 0.5 * U * (x[i] + 1);
    ww[i] = 0.5 * U * w[i];
  }
  return { u, w: ww };
}

/** Spectral norm (top singular value) via power iteration on M^T M (identical routine to imp-3350). */
function spectralNorm(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  let s0 = nrm(v);
  for (let i = 0; i < n; i++) v[i] /= s0;
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = 0; j < n; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    const MtMv = new Float64Array(n);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += M[i][j] * Mv[i];
      MtMv[j] = s;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

/**
 * Continuum autocorrelation R(tau) = (1 / (U - tau)) int_0^{U-tau} Phi(u) Phi(u + tau) du,
 * evaluated by Gauss-Legendre quadrature -- the a-independent continuum analogue of the
 * imp-3350 discrete integer-lag average Abar(k) = A_Phi(k) / (N - k).
 */
function makeAutocorr(U, M) {
  const { x, w } = gaussLegendre(M);
  return function R(tau) {
    const L = U - tau;
    if (L <= 0) return 0;
    let s = 0;
    for (let i = 0; i < M; i++) {
      const u = 0.5 * L * (x[i] + 1);
      s += w[i] * phiKernel(u) * phiKernel(u + tau);
    }
    return 0.5 * s; // (0.5 L s) / L : GL of int_0^L phi(u)phi(u+tau) du, divided by the length L
  };
}

/**
 * GL-route ratios at fixed U with shear strength a. Uses symmetric weighting
 * Ktilde_ij = sqrt(w_i) K(u_i, u_j) sqrt(w_j) so the matrix spectral norm approximates the
 * L2 integral-operator norm. Returns the sinh ratio, the exactly-linear ratio, and the
 * rank-2 closed-form relative error of the linear denominator.
 */
function glRatios(U, nGL, a, Rfun, iters) {
  const { u, w } = nodesOn(U, nGL);
  const sw = w.map(Math.sqrt);
  const phi = u.map(phiKernel);
  const Gsh = [];
  const Tsh = [];
  const Gl = [];
  const Tl = [];
  for (let i = 0; i < nGL; i++) {
    const gG = new Float64Array(nGL);
    const tG = new Float64Array(nGL);
    const gL = new Float64Array(nGL);
    const tL = new Float64Array(nGL);
    for (let j = 0; j < nGL; j++) {
      const d = u[j] - u[i];
      const sh = Math.sinh(a * d);
      const Rk = Rfun(Math.abs(d));
      const wf = sw[i] * sw[j];
      gG[j] = wf * phi[i] * phi[j] * sh; // sinh-shear Gram (symmetric-weighted)
      tG[j] = wf * sh * Rk; // sinh Toeplitz surrogate
      gL[j] = wf * phi[i] * phi[j] * d; // exactly-linear Gram Glin
      tL[j] = wf * d * Rk; // exactly-linear surrogate Tlin
    }
    Gsh.push(gG);
    Tsh.push(tG);
    Gl.push(gL);
    Tl.push(tL);
  }
  const rSinh = spectralNorm(Tsh, nGL, iters) / spectralNorm(Gsh, nGL, iters);
  const normGl = spectralNorm(Gl, nGL, iters);
  const normTl = spectralNorm(Tl, nGL, iters);
  // Rank-2 skew closed form under GL weights: ||Glin|| = sqrt(Q0 Q2 - Q1^2), Q_k = sum_i w_i u_i^k Phi_i^2.
  let Q0 = 0;
  let Q1 = 0;
  let Q2 = 0;
  for (let i = 0; i < nGL; i++) {
    const ww = w[i] * phi[i] * phi[i];
    Q0 += ww;
    Q1 += ww * u[i];
    Q2 += ww * u[i] * u[i];
  }
  const normGlClosed = Math.sqrt(Q0 * Q2 - Q1 * Q1);
  return {
    rSinh,
    rLin: normTl / normGl,
    closedFormRelErr: Math.abs(normGl - normGlClosed) / normGlClosed,
  };
}

/** imp-3350 midpoint linear ratio at uniform resolution N (bare matrix; the H weight cancels in the ratio). */
function midpointLinearRatio(U, N, iters) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  const abar = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    let c = 0;
    for (let i = 0; i + k < N; i++) {
      s += phi[i] * phi[i + k];
      c += 1;
    }
    abar[k] = c ? s / c : 0;
  }
  const Gl = [];
  const Tl = [];
  for (let i = 0; i < N; i++) {
    const gL = new Float64Array(N);
    const tL = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      const d = u[j] - u[i];
      gL[j] = phi[i] * phi[j] * d;
      tL[j] = d * abar[k];
    }
    Gl.push(gL);
    Tl.push(tL);
  }
  return spectralNorm(Tl, N, iters) / spectralNorm(Gl, N, iters);
}

/** Per-U GL-route certification cell: a^2-Richardson sinh a -> 0 limit vs the exactly-linear ratio. */
function certifyAtGL(U) {
  const Rfun = makeAutocorr(U, MR);
  const rHi = glRatios(U, NGL, 0.02, Rfun, ITERS).rSinh; // coarser a
  const lo = glRatios(U, NGL, 0.01, Rfun, ITERS); // finer a (+ linear ratio + closed form)
  const rStar = lo.rSinh - (rHi - lo.rSinh) / 3; // a^2 Richardson (identical scheme to imp-3350)
  return {
    U,
    glSinhRichardsonLimit: rStar,
    glLinearRatio: lo.rLin,
    withinRouteGap: Math.abs(rStar - lo.rLin), // < 1e-11: equality survives the change of quadrature
    glClosedFormRelErr: lo.closedFormRelErr, // rank-2 area formula under GL weights (< 1e-13)
    imp3350MidpointN240: IMP3350_MIDPOINT_N240[U], // single-route reference value
  };
}

// --- (1) GL-route certification: r_star = r_lin survives the independent quadrature at each U.
const CELLS = Object.freeze(U_CHECK.map((U) => certifyAtGL(U)));
const maxWithinRouteGap = Math.max(...CELLS.map((c) => c.withinRouteGap)); // < 1e-11
const maxGLClosedFormRelErr = Math.max(...CELLS.map((c) => c.glClosedFormRelErr)); // < 1e-13

// --- (2) cross-route CONTINUUM convergence at U = 6: midpoint (down) and GL (up) meet a common limit.
const U6 = 6;
const R6 = makeAutocorr(U6, MR);
const GL_U6_128 = glRatios(U6, 128, 0.01, R6, ITERS).rLin; // GL below headline
const GL_U6_256 = glRatios(U6, 256, 0.01, R6, ITERS).rLin; // GL climbing toward the continuum limit
const MID_U6_240 = midpointLinearRatio(U6, 240, ITERS); // reproduces imp-3350 headline
const MID_U6_480 = midpointLinearRatio(U6, 480, ITERS); // midpoint descending
const MID_U6_RICHARDSON = MID_U6_480 + (MID_U6_480 - MID_U6_240) / 3; // O(H^2) Richardson (N: 240 -> 480)
const crossRouteContinuumGap = Math.abs(GL_U6_256 - MID_U6_RICHARDSON); // ~9e-6: independent routes agree
const midpointN240ExcessPct = ((MID_U6_240 - MID_U6_RICHARDSON) / MID_U6_RICHARDSON) * 100; // ~0.98%

const verdict =
  maxWithinRouteGap < 1e-11 &&
  maxGLClosedFormRelErr < 1e-13 &&
  crossRouteContinuumGap < 1e-4 &&
  midpointN240ExcessPct > 0.5 &&
  midpointN240ExcessPct < 1.5
    ? 'IMP3350-EQUALITY-r_star=r_lin-SURVIVES-INDEPENDENT-GAUSS-LEGENDRE-QUADRATURE; ABSOLUTE-RATIO-CARRIES-~1%-MIDPOINT-N240-FINITE-N-BIAS-BOTH-ROUTES-MEET-A-COMMON-CONTINUUM-LIMIT'
    : 'INDETERMINATE';

export const IMP3408_CAPTURE_RATIO_QUADRATURE_CROSS_VALIDATION = Object.freeze({
  id: 'imp-3408-capture-ratio-quadrature-cross-validation',
  ticket: 'imp-3408',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentModule: 'imp-3350-capture-ratio-linear-shear-limit.js',
  relatedSymbolicIdentity: 'imp-3399-capture-ratio-sinh-odd-factorization-identity.js',

  summary:
    'CROSS-VALIDATE the imp-3350 equality r_star = r_lin (the a -> 0 sinh-shear capture limit equals the ' +
    'exactly-linear-shear ratio) via an INDEPENDENT quadrature route instead of the single midpoint N = 240 ' +
    'power iteration. New route: Gauss-Legendre nodes + weights on [0, U] (nGL = 160), symmetric weighting ' +
    'Ktilde_ij = sqrt(w_i) K sqrt(w_j) for the L2 operator norm, and the CONTINUUM autocorrelation ' +
    'R(tau) = mean_u Phi(u) Phi(u + tau) by its own GL quadrature (MR = 220) in place of the discrete lag ' +
    'average Abar. FINDING: (1) the within-route equality r_star = r_lin SURVIVES the change of quadrature to ' +
    'machine precision (gap < 1e-11 at U = 6, 8, 10 -- U = 6: 2.2e-13), so it is not a midpoint / power-iteration ' +
    'artifact; (2) the rank-2 closed form ||Glin|| = sqrt(Q0 Q2 - Q1^2) is even tighter under GL weights ' +
    '(relErr < 1e-13); (3) the ABSOLUTE ratio is quadrature-dependent -- midpoint descends with N and GL climbs ' +
    'with nGL to a COMMON continuum limit r_lin(U = 6) ~ 0.02938 (midpoint O(H^2) Richardson 0.0293772 vs GL ' +
    'nGL = 256 0.0293678, agreeing to ~9.4e-6), so the imp-3350 headline 0.0296645 carries a ~0.98% finite-N ' +
    'midpoint bias above the resolution-converged value. Cross-validation only; RH-equivalent; imp-3066 ' +
    'positivity untouched; carries NO RH verdict and NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    independentRoute: 'Gauss-Legendre nodes + weights on [0, U] (Newton on P_n), NOT the imp-3350 uniform midpoint grid',
    operatorNorm: 'symmetric-weighted Ktilde_ij = sqrt(w_i) K(u_i, u_j) sqrt(w_j) (D K D), the L2-norm-preserving GL discretization',
    autocorrelation: 'continuum R(tau) = (1/(U-tau)) int_0^{U-tau} Phi(u)Phi(u+tau) du by its own GL quadrature (MR nodes), replacing the discrete lag average Abar(k) = A_Phi(k)/(N-k)',
    linearShearGram: 'Glin(u,v) = Phi(u) Phi(v) (v-u) = p q^T - q p^T (rank-2 skew)',
    rank2ClosedForm: '||Glin|| = sqrt(Q0 Q2 - Q1^2), Q_k = sum_i w_i u_i^k Phi_i^2 (GL-weighted moments)',
    aToZeroLimit: 'a^2 Richardson from a = {0.02, 0.01}: r_star = r(0.01) - (r(0.02) - r(0.01)) / 3',
    nGL: NGL,
    autocorrNodes: MR,
    iters: ITERS,
    uCheck: U_CHECK.slice(),
    continuumStudyU: U6,
    selfComputing: true,
  }),

  measured: Object.freeze({
    cells: CELLS, // per-U: GL sinh limit, GL linear ratio, within-route gap, closed-form error, imp-3350 reference
    maxWithinRouteGap, // < 1e-11: r_star = r_lin survives the independent Gauss-Legendre quadrature
    maxGLClosedFormRelErr, // < 1e-13: rank-2 area formula under GL weights (tighter than midpoint 1e-10)
    glU6At128: GL_U6_128, // GL below the headline, climbing with node count
    glU6At256: GL_U6_256, // GL closer to the continuum limit
    midpointU6At240: MID_U6_240, // reproduces the imp-3350 headline ~0.0296645
    midpointU6At480: MID_U6_480, // midpoint descending with N
    midpointU6Richardson: MID_U6_RICHARDSON, // O(H^2)-extrapolated continuum midpoint limit ~0.0293772
    crossRouteContinuumGap, // ~9.4e-6: midpoint-Richardson and GL nGL=256 agree on the continuum ratio
    midpointN240ExcessPct, // ~0.98%: the imp-3350 N=240 headline is ~1% above the resolution-converged value
    verdict,
  }),

  interpretation: Object.freeze({
    equalityIsQuadratureRobust:
      'The equality r_star = r_lin is the imp-3350 core claim, and it holds to machine precision under a ' +
      'completely different discretization -- non-uniform Gauss-Legendre nodes, symmetric weighting, and the ' +
      'continuum autocorrelation R(tau) rather than the discrete lag average. It is therefore a property of the ' +
      'kernels, not of the midpoint grid or the power-iteration routine, corroborating the imp-3399 symbolic ' +
      'evenness identity that made the same limit exact at fixed N.',
    closedFormRobust:
      'The rank-2 skew closed form ||Glin|| = sqrt(Q0 Q2 - Q1^2) reproduces the GL power-iteration operator norm ' +
      'to < 1e-13 relative, tighter than the midpoint ~1e-10, because Gauss-Legendre exactly integrates the ' +
      'low-order polynomial occupation moments Q_k = sum w_i u_i^k Phi_i^2.',
    absoluteValueHasFiniteNBias:
      'The absolute ratio value is quadrature-dependent at finite resolution: midpoint converges DOWN with N ' +
      'and GL converges UP with nGL to a COMMON continuum limit r_lin(U = 6) ~ 0.02938. The two independent ' +
      'routes (midpoint O(H^2) Richardson and GL at nGL = 256) agree to ~9.4e-6, and the imp-3350 headline ' +
      '0.0296645 sits ~0.98% above that limit -- a finite-N midpoint bias, not a value error in the equality. ' +
      'The imp-3346 constant C = lim_U r_lin U is a ratio-shape limit and is unaffected in kind; only the ' +
      'quoted absolute capture magnitude at the single N = 240 midpoint grid should be read as ~1% high.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    crossValidationNotNewClaim:
      'This module CROSS-VALIDATES an existing imp-3350 measurement on an independent quadrature; it introduces ' +
      'no new reduction and no positivity result. It confirms the equality r_star = r_lin is quadrature-robust ' +
      'and flags a ~1% finite-N bias in the single-route absolute value.',
    measuresRatioNotPositivity:
      'It measures only norm ratios; it does NOT construct the missing magnitude and does NOT attempt K_a >= 0.',
    stillNumericalNotSymbolic:
      'The cross-route agreement is NUMERICAL (two finite-resolution quadratures extrapolated to a common limit), ' +
      'not a symbolic proof; the imp-3399 evenness identity remains the symbolic statement of the a -> 0 limit.',
    necessaryNotSufficient:
      'Robustness of the ratio measurement is diagnostic; the imp-3066 off-diagonal endpoint-Hankel operator ' +
      'magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3408_CAPTURE_RATIO_QUADRATURE_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp3408-equality-survives-independent-quadrature',
    why: 'THE CORE DELIVERABLE: the a^2-Richardson sinh a -> 0 limit r_star equals the exactly-linear ratio ' +
      'r_lin on the INDEPENDENT Gauss-Legendre route (distinct nodes, symmetric weighting, continuum ' +
      'autocorrelation) to below 1e-11 at every U tested. A larger gap would mean the imp-3350 equality was a ' +
      'midpoint / power-iteration artifact.',
    holds: () => maxWithinRouteGap < 1e-11,
  },
  {
    id: 'imp3408-rank2-closed-form-under-GL-weights',
    why: 'The linear denominator ||Glin|| = sqrt(Q0 Q2 - Q1^2) with GL-weighted moments Q_k = sum_i w_i u_i^k ' +
      'Phi_i^2 must match the GL power-iteration operator norm to below 1e-13 relative -- tighter than the ' +
      'midpoint ~1e-10 because GL exactly integrates the polynomial moments.',
    holds: () => maxGLClosedFormRelErr < 1e-13,
  },
  {
    id: 'imp3408-cross-route-continuum-agreement',
    why: 'The two INDEPENDENT quadratures must converge to a COMMON continuum ratio at U = 6: the midpoint ' +
      'O(H^2) Richardson (N: 240 -> 480) and the GL value at nGL = 256 must agree to below 1e-4 (in fact ' +
      '~9.4e-6). Disagreement would mean one route has not converged or the surrogate differs between routes.',
    holds: () => crossRouteContinuumGap < 1e-4,
  },
  {
    id: 'imp3408-midpoint-N240-carries-percent-level-bias',
    why: 'The imp-3350 headline midpoint N = 240 value must sit ABOVE the resolution-converged continuum limit ' +
      'by a percent-level margin (0.5%-1.5%, measured ~0.98%). This certifies the honest finding that the ' +
      'single-route absolute number is ~1% high while the equality itself is exact.',
    holds: () => midpointN240ExcessPct > 0.5 && midpointN240ExcessPct < 1.5,
  },
  {
    id: 'imp3408-midpoint-reproduces-imp3350-headline',
    why: 'The midpoint N = 240 linear ratio recomputed here must reproduce the imp-3350 baked headline ' +
      '(U = 6 ~ 0.0296645) to below 1e-5, confirming the cross-validation is measuring the SAME construction ' +
      'as the parent module before extrapolating.',
    holds: () => Math.abs(MID_U6_240 - IMP3350_MIDPOINT_N240[6]) < 1e-5,
  },
  {
    id: 'imp3408-verdict-equality-robust-value-biased',
    why: 'The classified verdict must be the equality-survives / absolute-value-carries-~1%-midpoint-bias split, ' +
      'not indeterminate; a flip means the within-route equality, the closed form, the cross-route agreement, ' +
      'or the bias magnitude failed.',
    holds: () =>
      verdict ===
      'IMP3350-EQUALITY-r_star=r_lin-SURVIVES-INDEPENDENT-GAUSS-LEGENDRE-QUADRATURE; ABSOLUTE-RATIO-CARRIES-~1%-MIDPOINT-N240-FINITE-N-BIAS-BOTH-ROUTES-MEET-A-COMMON-CONTINUUM-LIMIT',
  },
  {
    id: 'imp3408-honest-cross-validation-no-qed',
    why: 'Mandatory honesty: CROSS-VALIDATION only -- not a proof, not a reduction below RH, RH-equivalent, ' +
      'positivity not attempted, agreement is numerical not symbolic, no refereed bound is changed. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3408_CAPTURE_RATIO_QUADRATURE_CROSS_VALIDATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.stillNumericalNotSymbolic === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3408_CAPTURE_RATIO_QUADRATURE_CROSS_VALIDATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3408-capture-ratio-quadrature-cross-validation assertion failed: ${assertion.id}`);
  }
}

export default IMP3408_CAPTURE_RATIO_QUADRATURE_CROSS_VALIDATION;
