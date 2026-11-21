/**
 * @module imp-3442-sinh-residual-coefficient-U-scaling
 * @fileoverview imp-3442 -- MEASURE the U-scaling of the imp-3409 O(a^2)
 *   sinh-nonlinearity coefficient c of the mupass capture ratio. imp-3409 fit
 *   the residual e(a) = r(a) - r_lin ~ c a^2 and reported the leading coefficient
 *   c ~ 1.58e-5, but at the SINGLE cutoff U = 6 ONLY -- its U-dependence was never
 *   mapped. This module re-runs the identical sqrt(2)-geometric a-ladder fit at
 *   EACH U in the (extended) imp-3240 grid {4, 6, 8, 10, 12, 16, 20}, extracts
 *   c(U), and tests whether c(U) tracks a power of U -- specifically whether it
 *   inherits the imp-3240 r ~ C/U capture-law scaling (exponent -1).
 *
 *   WHAT THIS MODULE MEASURES (the imp-3442 deliverable -- MEASURE only)
 *   -------------------------------------------------------------------
 *   For each U it (1) builds the de Bruijn-Newman Phi samples and per-lag
 *   autocorrelation Abar (identical routines to imp-3409 / imp-3350), (2) sweeps
 *   the sinh capture ratio r(a) = ||T|| / ||Gshear|| down the same sqrt(2)-geometric
 *   a-ladder in [0.0625, 0.5] and subtracts the a-FREE linear ratio
 *   r_lin = ||Tlin|| / ||Glin||, (3) log-log-fits the residual over the four
 *   smallest a to extract the leading coefficient c(U) = exp(intercept) and confirm
 *   the per-U exponent stays at p ~ 2 (so c(U) is the coefficient of a genuine O(a^2)
 *   drift at every U). It then log-log-fits c(U) = k U^q to report the U-exponent q
 *   and R^2, and separately fits r_lin(U) = C0 U^{q_lin} to compare the two exponents.
 *
 *   THE FINDING (measurement, RH-equivalent, NO QED)
 *   ------------------------------------------------
 *   c(U) DECREASES monotonically with U (2.38e-5 at U = 4 down to 4.86e-6 at U = 20)
 *   and tracks a NEAR-1/U power law: the log-log fit gives q ~ -0.96 (R^2 ~ 0.997).
 *   The linear capture ratio itself carries essentially the SAME slope over this grid,
 *   q_lin ~ -0.94 (R^2 ~ 0.998) -- the two exponents agree to within ~0.02. So the
 *   O(a^2) sinh-drift coefficient and the 1/U capture decay SHARE a scaling: c(U)
 *   inherits the r ~ C/U law (the product c(U)*U stays near-constant ~9.5e-5 across
 *   the grid, whereas c(U)*U^2 grows monotonically -- ruling out a 1/U^2 rate). Every
 *   per-U small-a exponent stays pinned at p = 2.000 (R^2 = 1.000000), so the residual
 *   is a clean O(a^2) drift at every cutoff, with only its coefficient sliding as ~1/U.
 *   Measurement only; RH-equivalent; carries NO RH verdict and NO QED. No refereed bound is changed.
 *
 *   @see imp-3409-capture-ratio-sinh-residual-order.js (the O(a^2) rate + c ~ 1.58e-5 at U = 6 only)
 *   @see imp-3240-mupass-capture-ratio-aU-grid.js (the r ~ C/U capture law across the U-grid)
 *   @see imp-3350-capture-ratio-linear-shear-limit.js (the a -> 0 limit = linear ratio)
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (derives C in the linear-shear limit)
 *
 *   Ticket: imp-3442 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3409 / imp-3350 / imp-3240)
const N = 240; // representative resolution (the imp-3240 / imp-3409 headline grid)
const ITERS = 500; // power-iteration steps (identical to imp-3409, resolves the small residual)
// Extended imp-3240 U-grid: the {4,6,8,10} headline cells plus the {12,16,20} tail for a longer lever.
const U_GRID = Object.freeze([4, 6, 8, 10, 12, 16, 20]);
// sqrt(2)-geometric a-ladder 0.5 -> 0.0625 (equal log spacing; identical to imp-3409).
const A_FIT = Object.freeze([
  0.5, 0.3535533905932738, 0.25, 0.17677669529663687, 0.125, 0.08838834764831843, 0.0625,
]);
const SMALL_A_WINDOW = 4; // smallest-a points used for the asymptotic (leading-order) fit (identical to imp-3409)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3409). */
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

/** Spectral norm (top singular value) via power iteration on M^T M (identical routine to imp-3409). */
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
  // Per-row nonzero column span [lo[i], hi[i]). Entries outside it are +-0, and
  // with finite v each skipped term is +-0, which never changes an accumulator
  // that starts at +0 (x + +-0 === x for x !== -0, and the accumulator is never
  // -0). So restricting to the span is bit-identical to the dense loop while
  // skipping the exactly-zero Phi tail / band (the dense version made the
  // /closure-routes page take tens of seconds at import).
  const lo = new Int32Array(n);
  const hi = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    const Mi = M[i];
    let a = 0;
    while (a < n && Mi[a] === 0) a++;
    let b = n;
    while (b > a && Mi[b - 1] === 0) b--;
    lo[i] = a;
    hi[i] = b;
  }
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = lo[i], e = hi[i]; j < e; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    // Row-major accumulation (cache-friendly): each MtMv[j] still receives the
    // terms M[i][j]*Mv[i] in the same i = 0..n-1 order starting from 0, so the
    // result is bit-identical to the column-wise loop it replaces.
    const MtMv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const Mi = M[i];
      const mvi = Mv[i];
      for (let j = lo[i], e = hi[i]; j < e; j++) MtMv[j] += Mi[j] * mvi;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

/** Shared per-U build: midpoint nodes, Phi samples, and the per-lag autocorrelation Abar (identical to imp-3409). */
function buildPhiAbar(U) {
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
  return { u, phi, abar };
}

/** sinh-shear capture ratio r(a, U) = ||T|| / ||Gshear|| (identical construction to imp-3409). */
function ratioSinh(a, ctx) {
  const { u, phi, abar } = ctx;
  const G = [];
  const T = [];
  for (let i = 0; i < N; i++) {
    const rG = new Float64Array(N);
    const rT = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      const sh = Math.sinh(a * (u[j] - u[i]));
      rG[j] = phi[i] * phi[j] * sh;
      rT[j] = sh * abar[k];
    }
    G.push(rG);
    T.push(rT);
  }
  return spectralNorm(T, N, ITERS) / spectralNorm(G, N, ITERS);
}

/** EXACTLY-LINEAR-shear ratio r_lin = ||Tlin|| / ||Glin||: sinh(a(v-u)) -> (v-u); a cancels, ratio is a-FREE. */
function ratioLinear(ctx) {
  const { u, phi, abar } = ctx;
  const G = [];
  const T = [];
  for (let i = 0; i < N; i++) {
    const rG = new Float64Array(N);
    const rT = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      const d = u[j] - u[i];
      rG[j] = phi[i] * phi[j] * d;
      rT[j] = d * abar[k];
    }
    G.push(rG);
    T.push(rT);
  }
  return spectralNorm(T, N, ITERS) / spectralNorm(G, N, ITERS);
}

/** Least-squares slope/intercept of y = intercept + slope * x, plus R^2. */
function logLogFit(xs, ys) {
  const n = xs.length;
  let Sx = 0;
  let Sy = 0;
  let Sxx = 0;
  let Sxy = 0;
  for (let i = 0; i < n; i++) {
    Sx += xs[i];
    Sy += ys[i];
    Sxx += xs[i] * xs[i];
    Sxy += xs[i] * ys[i];
  }
  const slope = (n * Sxy - Sx * Sy) / (n * Sxx - Sx * Sx);
  const intercept = (Sy - slope * Sx) / n;
  let ssTot = 0;
  let ssRes = 0;
  const yBar = Sy / n;
  for (let i = 0; i < n; i++) {
    const yHat = intercept + slope * xs[i];
    ssRes += (ys[i] - yHat) * (ys[i] - yHat);
    ssTot += (ys[i] - yBar) * (ys[i] - yBar);
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  return { slope, intercept, r2 };
}

/** Per-U leading-order fit: extract c(U) = exp(intercept) and the small-a exponent p(U). */
function coefficientAtU(U) {
  const ctx = buildPhiAbar(U);
  const rLin = ratioLinear(ctx);
  const sinhRatios = A_FIT.map((a) => ratioSinh(a, ctx));
  const residuals = sinhRatios.map((r) => r - rLin); // e(a) = r(a) - r_lin, expected c a^2 > 0
  const lnA = A_FIT.map((a) => Math.log(a));
  const lnE = residuals.map((e) => Math.log(e));
  const start = A_FIT.length - SMALL_A_WINDOW;
  const smallFit = logLogFit(lnA.slice(start), lnE.slice(start));
  const smallestA = A_FIT[A_FIT.length - 1];
  const coefFromSmallestA = residuals[residuals.length - 1] / (smallestA * smallestA);
  return {
    U,
    linearRatio: rLin,
    residualsPositive: residuals.every((e) => e > 0),
    exponent: smallFit.slope, // per-U small-a exponent p(U), expected ~ 2
    exponentR2: smallFit.r2,
    coefficient: Math.exp(smallFit.intercept), // c(U) = exp(intercept) of the small-a log-log fit
    coefFromSmallestA, // cross-check c(U) ~ e(a)/a^2 at the smallest a
  };
}

// --- Sweep the per-U leading O(a^2) coefficient across the extended imp-3240 U-grid. ---
const PER_U = Object.freeze(U_GRID.map((U) => coefficientAtU(U)));
const C_OF_U = Object.freeze(PER_U.map((r) => r.coefficient)); // c(U), expected ~ const / U
const R_LIN_OF_U = Object.freeze(PER_U.map((r) => r.linearRatio)); // r_lin(U), the imp-3240 ~ C/U capture law

// Power-law fit c(U) = k U^q (the imp-3442 headline: does the O(a^2) coefficient inherit the 1/U capture law?).
const LN_U = U_GRID.map((U) => Math.log(U));
const LN_C = C_OF_U.map((c) => Math.log(c));
const cScalingFit = logLogFit(LN_U, LN_C);

// Companion power-law fit r_lin(U) = C0 U^{q_lin} to compare the two exponents on the same grid.
const LN_RLIN = R_LIN_OF_U.map((r) => Math.log(r));
const rLinScalingFit = logLogFit(LN_U, LN_RLIN);

// c(U)*U stays near-constant if q ~ -1; c(U)*U^2 grows if q > -2. Both diagnose the exponent.
const C_TIMES_U = Object.freeze(C_OF_U.map((c, i) => c * U_GRID[i]));
const C_TIMES_U2 = Object.freeze(C_OF_U.map((c, i) => c * U_GRID[i] * U_GRID[i]));

const coefficientMonotoneDecreasing = C_OF_U.every((c, i) => i === 0 || c < C_OF_U[i - 1]);
const allPerUExponentsNearTwo = PER_U.every((r) => Math.abs(r.exponent - 2) < 0.05);
const allPerUResidualsPositive = PER_U.every((r) => r.residualsPositive);
// The c(U) exponent must be near -1 (the 1/U capture law), NOT near -2 (a 1/U^2 rate).
const cExponentNearMinusOne = Math.abs(cScalingFit.slope - -1) < 0.15;
// c(U) and r_lin(U) share a scaling if their U-exponents agree closely.
const exponentGap = Math.abs(cScalingFit.slope - rLinScalingFit.slope);
const sharesCaptureLawScaling = exponentGap < 0.1;

const verdict =
  coefficientMonotoneDecreasing &&
  allPerUExponentsNearTwo &&
  cExponentNearMinusOne &&
  sharesCaptureLawScaling &&
  cScalingFit.r2 > 0.99
    ? 'SINH-O(a^2)-COEFFICIENT-c(U)-INHERITS-THE-1/U-CAPTURE-LAW-SCALING'
    : 'INDETERMINATE';

export const IMP3442_SINH_RESIDUAL_COEFFICIENT_U_SCALING = Object.freeze({
  id: 'imp-3442-sinh-residual-coefficient-U-scaling',
  ticket: 'imp-3442',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentDiagnostic: 'imp-3409-capture-ratio-sinh-residual-order.js',
  captureLawSource: 'imp-3240-mupass-capture-ratio-aU-grid.js',

  summary:
    'MEASURE the U-scaling of the imp-3409 O(a^2) sinh-nonlinearity coefficient c of the mupass capture ratio, ' +
    'which imp-3409 fit only at the single cutoff U = 6 (c ~ 1.58e-5). Re-running the identical sqrt(2)-geometric ' +
    'a-ladder small-a fit at each U in the extended imp-3240 grid {4,6,8,10,12,16,20} and extracting ' +
    'c(U) = exp(intercept), the coefficient DECREASES monotonically (2.38e-5 at U = 4 -> 4.86e-6 at U = 20) and ' +
    'tracks a NEAR-1/U power law: the log-log fit c(U) = k U^q gives q ~ -0.96 (R^2 ~ 0.997). The linear capture ' +
    'ratio r_lin(U) itself carries essentially the same slope over the grid, q_lin ~ -0.94 (R^2 ~ 0.998), the two ' +
    'exponents agreeing to within ~0.02. So the O(a^2) sinh-drift coefficient and the imp-3240 1/U capture decay ' +
    'SHARE a scaling: c(U) inherits the r ~ C/U law (c(U)*U stays near-constant ~9.5e-5 across the grid, whereas ' +
    'c(U)*U^2 grows monotonically, ruling out a 1/U^2 rate), while every per-U small-a exponent stays pinned at ' +
    'p = 2.000 (R^2 = 1.000000). Measurement only; RH-equivalent; carries NO RH verdict and NO QED. ' +
    'No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u,v) = Phi(u) Phi(v) sinh(a(v-u))',
    lagStationarySurrogate: 'T(u,v) = sinh(a(v-u)) Abar(|v-u|),  Abar(k) = A_Phi(k)/(N-k)',
    linearShearGram: 'Glin(u,v) = Phi(u) Phi(v) (v-u),  Tlin(u,v) = (v-u) Abar(|v-u|)  (a-FREE ratio)',
    residual: 'e(a) = r(a) - r_lin,  r(a) = ||T|| / ||Gshear|| (sinh),  r_lin = ||Tlin|| / ||Glin|| (linear)',
    perUCoefficient: 'c(U) = exp(intercept) of the small-a log-log fit ln e(a) = ln|c| + p ln a (SMALL_A_WINDOW smallest a)',
    cScalingFit: 'log-log least squares c(U) = k U^q over the U-grid (the imp-3442 headline U-exponent q)',
    rLinScalingFit: 'log-log least squares r_lin(U) = C0 U^{q_lin} over the same grid (for exponent comparison)',
    productDiagnostics: 'c(U)*U (near-constant iff q ~ -1) and c(U)*U^2 (grows iff q > -2)',
    uGrid: U_GRID.slice(),
    aLadder: A_FIT.slice(),
    smallAWindow: SMALL_A_WINDOW,
    N,
    iters: ITERS,
    quadrature: 'midpoint, N panels on [0, U]; spectral norm via power iteration on M^T M (identical to imp-3409)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    uGrid: U_GRID.slice(),
    perU: PER_U.map((r) => ({ ...r })), // per-U linearRatio, exponent p(U), exponentR2, coefficient c(U), cross-check
    cOfU: C_OF_U.slice(), // c(U), monotone decreasing, ~ const/U
    rLinOfU: R_LIN_OF_U.slice(), // r_lin(U), the imp-3240 ~ C/U capture law
    cTimesU: C_TIMES_U.slice(), // near-constant ~9.5e-5 if q ~ -1
    cTimesU2: C_TIMES_U2.slice(), // grows monotonically if q > -2 (rules out 1/U^2)
    cScalingExponent: cScalingFit.slope, // q ~ -0.96 (the headline U-exponent of the O(a^2) coefficient)
    cScalingR2: cScalingFit.r2,
    cScalingCoefficient: Math.exp(cScalingFit.intercept), // k in c(U) = k U^q
    rLinScalingExponent: rLinScalingFit.slope, // q_lin ~ -0.94 (the capture-law exponent on this grid)
    rLinScalingR2: rLinScalingFit.r2,
    exponentGap, // |q - q_lin| ~ 0.02 (the two share a scaling)
    coefficientMonotoneDecreasing,
    allPerUExponentsNearTwo, // every per-U small-a exponent p(U) ~ 2 (clean O(a^2) drift at every cutoff)
    allPerUResidualsPositive,
    cExponentNearMinusOne, // |q - (-1)| < 0.15
    sharesCaptureLawScaling, // |q - q_lin| < 0.1
    verdict, // SINH-O(a^2)-COEFFICIENT-c(U)-INHERITS-THE-1/U-CAPTURE-LAW-SCALING
  }),

  interpretation: Object.freeze({
    coefficientTracksOneOverU:
      'The imp-3409 O(a^2) sinh-nonlinearity coefficient, mapped here across the extended imp-3240 U-grid, ' +
      'tracks a near-1/U power law: c(U) = k U^q with q ~ -0.96 (R^2 ~ 0.997), sliding from 2.38e-5 at U = 4 ' +
      'to 4.86e-6 at U = 20. The product c(U)*U stays near-constant (~9.5e-5) while c(U)*U^2 grows monotonically, ' +
      'so the exponent is near -1, not -2.',
    sharesTheCaptureLaw:
      'The linear capture ratio r_lin(U) carries essentially the SAME slope over this grid (q_lin ~ -0.94, ' +
      'R^2 ~ 0.998); the two exponents agree to within ~0.02. So the O(a^2) sinh-drift and the imp-3240 1/U ' +
      'capture decay share a scaling -- the coefficient c(U) inherits the r ~ C/U law rather than carrying a ' +
      'distinct exponent.',
    o2RateSurvivesEveryU:
      'Every per-U small-a log-log exponent stays pinned at p = 2.000 (R^2 = 1.000000) with a positive, ' +
      'monotone-decreasing residual, so the drift is a clean O(a^2) term at every cutoff -- only its leading ' +
      'coefficient slides as ~1/U, three-plus orders below the ~1-10% capture ratio itself.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    exponentIsNumericalNotSymbolic:
      'The c(U) ~ 1/U scaling is measured NUMERICALLY (per-U small-a log-log fits feeding a second log-log fit ' +
      'in U at N = 240, ITERS = 500), not derived symbolically; q ~ -0.96 is a fitted exponent over a finite ' +
      'U-grid, not an identity, and it sits ~4% short of exactly -1 on this ladder.',
    slightlyAboveMinusOne:
      'Both the c(U) and r_lin(U) exponents land slightly above -1 in magnitude (q ~ -0.96, q_lin ~ -0.94), ' +
      'consistent with the imp-3240 observation that r*U rises slowly rather than being exactly constant -- the ' +
      '1/U law is leading-order with a slow positive correction, inherited here by the coefficient.',
    measuresRateNotPositivity:
      'This module measures only how the leading O(a^2) coefficient scales with U; it does NOT construct the ' +
      'missing off-diagonal magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Mapping the coefficient U-scaling is diagnostic; the imp-3066 off-diagonal endpoint-Hankel operator ' +
      'magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3442_SINH_RESIDUAL_COEFFICIENT_U_SCALING_ASSERTIONS = [
  {
    id: 'imp3442-coefficient-monotone-decreasing-in-U',
    why: 'The leading O(a^2) coefficient c(U) must decrease monotonically with U (a 1/U-type decay); a rise or ' +
      'non-monotone c(U) would contradict the inherited capture-law scaling.',
    holds: () => coefficientMonotoneDecreasing,
  },
  {
    id: 'imp3442-per-U-exponent-stays-two',
    why: 'THE PRECONDITION: every per-U small-a log-log exponent must stay near 2 (|p(U) - 2| < 0.05) with a ' +
      'positive residual, so c(U) is the genuine coefficient of an O(a^2) drift at every cutoff, not an artifact ' +
      'of a shifting exponent.',
    holds: () => allPerUExponentsNearTwo && allPerUResidualsPositive,
  },
  {
    id: 'imp3442-c-exponent-near-minus-one',
    why: 'THE CORE DELIVERABLE: the log-log fit c(U) = k U^q must land near q = -1 (|q + 1| < 0.15), certifying ' +
      'the O(a^2) coefficient inherits the ~1/U capture law rather than a 1/U^2 (or U-independent) rate.',
    holds: () => cExponentNearMinusOne,
  },
  {
    id: 'imp3442-c-scaling-fit-quality',
    why: 'The c(U) power-law fit must be near-linear in log-log (R^2 > 0.99): a clean power law is what makes the ' +
      'fitted U-exponent a meaningful measurement of the scaling.',
    holds: () => cScalingFit.r2 > 0.99,
  },
  {
    id: 'imp3442-shares-capture-law-scaling',
    why: 'c(U) and r_lin(U) must share a scaling: their fitted U-exponents must agree closely (|q - q_lin| < 0.1), ' +
      'showing the O(a^2) drift coefficient tracks the same 1/U decay as the capture ratio.',
    holds: () => sharesCaptureLawScaling,
  },
  {
    id: 'imp3442-c-times-U-near-constant',
    why: 'If q ~ -1 the product c(U)*U stays near-constant across the grid (small relative spread) while c(U)*U^2 ' +
      'grows monotonically; both diagnostics must agree the exponent is near -1, not -2.',
    holds: () => {
      const maxCU = Math.max(...C_TIMES_U);
      const minCU = Math.min(...C_TIMES_U);
      const cuNearConstant = (maxCU - minCU) / minCU < 0.25;
      const cu2Grows = C_TIMES_U2.every((v, i) => i === 0 || v > C_TIMES_U2[i - 1]);
      return cuNearConstant && cu2Grows;
    },
  },
  {
    id: 'imp3442-linear-ratio-reproduces-imp3409',
    why: 'The a-FREE linear ratio at U = 6 must reproduce the imp-3409 / imp-3240 headline capture ~0.02966, ' +
      'confirming c(6) is measured against the correct linear-shear baseline.',
    holds: () => {
      const u6 = PER_U.find((r) => r.U === 6);
      return u6 && u6.linearRatio > 0.0296 && u6.linearRatio < 0.0297;
    },
  },
  {
    id: 'imp3442-coefficient-reproduces-imp3409-at-U6',
    why: 'The measured c(6) must reproduce the imp-3409 headline coefficient ~1.58e-5, confirming this sweep ' +
      'extends the identical fit rather than a different construction.',
    holds: () => {
      const u6 = PER_U.find((r) => r.U === 6);
      return u6 && u6.coefficient > 1.5e-5 && u6.coefficient < 1.65e-5;
    },
  },
  {
    id: 'imp3442-verdict-inherits-capture-law',
    why: 'The classified verdict must be the inherits-1/U-capture-law finding, not indeterminate; a flip means the ' +
      'monotonicity, the per-U O(a^2) rate, the near-(-1) exponent, the shared scaling, or the fit quality failed.',
    holds: () => verdict === 'SINH-O(a^2)-COEFFICIENT-c(U)-INHERITS-THE-1/U-CAPTURE-LAW-SCALING',
  },
  {
    id: 'imp3442-honest-measurement-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- not a proof, not a reduction below RH, RH-equivalent, positivity ' +
      'not attempted, the exponent is numerical not symbolic, no refereed bound is changed. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3442_SINH_RESIDUAL_COEFFICIENT_U_SCALING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.exponentIsNumericalNotSymbolic === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3442_SINH_RESIDUAL_COEFFICIENT_U_SCALING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3442-sinh-residual-coefficient-U-scaling assertion failed: ${assertion.id}`);
  }
}

export default IMP3442_SINH_RESIDUAL_COEFFICIENT_U_SCALING;
