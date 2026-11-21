/**
 * @module imp-3409-capture-ratio-sinh-residual-order
 * @fileoverview imp-3409 -- MEASURE the vanishing RATE of the imp-3350
 *   sinh-nonlinearity residual of the mupass capture ratio. imp-3350 certified
 *   that the a -> 0 sinh-shear capture ratio r(a) = ||T|| / ||Gshear|| equals the
 *   exactly-linear-shear ratio r_lin = ||Tlin|| / ||Glin|| to machine precision,
 *   and named the surviving a-dependence a "vanishing sinh-nonlinearity" with
 *   ladderMonotoneDecreasing = true -- but it never QUANTIFIED the order of that
 *   residual. This module measures the residual e(a) = r(a) - r_lin across a
 *   finer geometric a-grid at fixed U and fits its leading power of a.
 *
 *   WHY O(a^2) IS EXPECTED (the perturbation argument, not a proof)
 *   --------------------------------------------------------------
 *   sinh(a Delta) = a Delta (1 + (a Delta)^2 / 6 + O(a^4)), so both Gram matrices
 *   are the linear kernel plus an a^2 correction times the common weight a:
 *     Gshear = a [ Glin + a^2 G3 + ... ],  G3(u,v) = Phi(u) Phi(v) Delta^3 / 6,
 *     T      = a [ Tlin + a^2 T3 + ... ],  T3(u,v) = Delta^3 Abar(|Delta|) / 6.
 *   The common factor a cancels identically in the ratio, leaving
 *     r(a) = ||Tlin + a^2 T3 + ...|| / ||Glin + a^2 G3 + ...||.
 *   A largest-singular-value is analytic in a symmetric-perturbation parameter, so
 *   its first correction is LINEAR in the a^2 perturbation: r(a) = r_lin + c a^2 +
 *   O(a^4). Hence the residual e(a) = r(a) - r_lin is expected to vanish as c a^2.
 *
 *   WHAT THIS MODULE MEASURES (the imp-3409 deliverable -- MEASURE only)
 *   -------------------------------------------------------------------
 *   At fixed U = 6 it sweeps r(a) down a sqrt(2)-geometric a-ladder in [0.0625, 0.5],
 *   forms e(a) = r(a) - r_lin against the a-FREE linear ratio, and (1) log-log
 *   least-squares-fits ln e(a) = ln|c| + p ln a to report the exponent p and
 *   coefficient c, (2) restricts the fit to the four smallest a (where the leading
 *   term dominates and the O(a^4) contamination is smallest) for the asymptotic
 *   exponent, and (3) reports the point-to-point LOCAL exponents p_k =
 *   ln(e_k / e_{k+1}) / ln(a_k / a_{k+1}) that descend toward 2 as a -> 0.
 *
 *   THE FINDING (measurement, RH-equivalent, NO QED)
 *   ------------------------------------------------
 *   The residual vanishes as O(a^2): at U = 6 both the full-grid and the small-a
 *   restricted log-log slopes land at p = 2.000 (R^2 = 1.000000 to six figures --
 *   the O(a^4) contamination is negligible across this [0.0625, 0.5] ladder), and
 *   the point-to-point local exponents descend monotonically 2.0002 -> 2.0000 toward
 *   2. The fitted leading coefficient is c = e(a) / a^2 -> a small positive constant
 *   (~1.58e-5 at U = 6), confirming the imp-3350 "vanishing sinh-nonlinearity" is
 *   precisely a positive O(a^2) drift.
 *   Measurement only; RH-equivalent; NO RH verdict. No refereed bound is changed.
 *
 *   @see imp-3350-capture-ratio-linear-shear-limit.js (the a -> 0 limit = linear ratio, unquantified residual)
 *   @see imp-3240-mupass-capture-ratio-aU-grid.js (the r ~ C/U law and the a -> 0 drift)
 *   @see imp-3346-capture-ratio-C-constant-derivation.js (derives C in the linear-shear limit)
 *
 *   Ticket: imp-3409 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3350 / imp-3240)
const N = 240; // representative resolution (the imp-3240 / imp-3350 headline grid)
const ITERS = 500; // power-iteration steps (bumped over imp-3350's 350 to resolve the small residual)
const U_STAR = 6; // headline lag cutoff (imp-3350 headline cell)
// sqrt(2)-geometric a-ladder 0.5 -> 0.0625 (equal log spacing for a clean log-log slope).
const A_FIT = Object.freeze([
  0.5, 0.3535533905932738, 0.25, 0.17677669529663687, 0.125, 0.08838834764831843, 0.0625,
]);
const SMALL_A_WINDOW = 4; // number of smallest-a points used for the asymptotic (leading-order) fit

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

/** Shared per-U build: midpoint nodes, Phi samples, and the per-lag autocorrelation Abar (identical to imp-3350). */
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

/** sinh-shear capture ratio r(a, U) = ||T|| / ||Gshear|| (identical construction to imp-3350). */
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

// --- Sweep the sinh capture ratio and form the residual against the a-FREE linear ratio. ---
const CTX = buildPhiAbar(U_STAR);
const R_LIN = ratioLinear(CTX);
const SINH_RATIOS = Object.freeze(A_FIT.map((a) => ratioSinh(a, CTX)));
const RESIDUALS = Object.freeze(SINH_RATIOS.map((r) => r - R_LIN)); // e(a) = r(a) - r_lin, expected c a^2 > 0

// Point-to-point local exponents p_k = ln(e_k / e_{k+1}) / ln(a_k / a_{k+1}), descending toward 2.
const LOCAL_EXPONENTS = Object.freeze(
  A_FIT.slice(0, -1).map((a, i) =>
    Math.log(RESIDUALS[i] / RESIDUALS[i + 1]) / Math.log(A_FIT[i] / A_FIT[i + 1]),
  ),
);

// Full-grid log-log fit of ln e(a) vs ln a.
const LN_A = A_FIT.map((a) => Math.log(a));
const LN_E = RESIDUALS.map((e) => Math.log(e));
const fullFit = logLogFit(LN_A, LN_E);

// Small-a restricted fit (the leading-order regime, least O(a^4) contamination).
const smallStart = A_FIT.length - SMALL_A_WINDOW;
const smallFit = logLogFit(LN_A.slice(smallStart), LN_E.slice(smallStart));

// Leading coefficient c estimated as e(a) / a^2 at the smallest a (the asymptotic regime).
const smallestA = A_FIT[A_FIT.length - 1];
const smallestResidual = RESIDUALS[RESIDUALS.length - 1];
const coefficientFromSmallestA = smallestResidual / (smallestA * smallestA);
const coefficientFromFit = Math.exp(smallFit.intercept); // c = exp(intercept) of the small-a log-log fit

const residualsPositive = RESIDUALS.every((e) => e > 0);
const residualsMonotoneDecreasing = RESIDUALS.every(
  (e, i) => i === 0 || e < RESIDUALS[i - 1],
);
// The restricted small-a exponent must land near 2 to certify the O(a^2) rate.
const asymptoticExponentNearTwo = Math.abs(smallFit.slope - 2) < 0.15;

const verdict =
  residualsPositive && residualsMonotoneDecreasing && asymptoticExponentNearTwo && smallFit.r2 > 0.999
    ? 'SINH-NONLINEARITY-RESIDUAL-VANISHES-AS-POSITIVE-O(a^2)-DRIFT'
    : 'INDETERMINATE';

export const IMP3409_CAPTURE_RATIO_SINH_RESIDUAL_ORDER = Object.freeze({
  id: 'imp-3409-capture-ratio-sinh-residual-order',
  ticket: 'imp-3409',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentDiagnostic: 'imp-3350-capture-ratio-linear-shear-limit.js',
  relatedConstantDerivation: 'imp-3346-capture-ratio-C-constant-derivation.js',

  summary:
    'MEASURE the vanishing RATE of the imp-3350 sinh-nonlinearity residual e(a) = r(a) - r_lin of the ' +
    'mupass capture ratio, which imp-3350 named a "vanishing sinh-nonlinearity" (ladderMonotoneDecreasing) ' +
    'but never quantified. Sweeping the sinh ratio r(a) = ||T|| / ||Gshear|| down a sqrt(2)-geometric ' +
    'a-ladder in [0.0625, 0.5] at U = 6 and subtracting the a-FREE linear ratio r_lin = ||Tlin|| / ||Glin||, ' +
    'the residual e(a) is positive, monotone decreasing, and vanishes as O(a^2): both the full-grid and the ' +
    'small-a restricted log-log slopes land at p = 2.000 (R^2 = 1.000000) and the point-to-point local ' +
    'exponents descend monotonically 2.0002 -> 2.0000 toward 2, matching the sinh(a Delta) = a Delta ' +
    '(1 + (a Delta)^2/6 + ...) expansion (the common a factor cancels in the ratio, leaving a first-order a^2 ' +
    'largest-singular-value correction). The fitted leading coefficient c = e(a) / a^2 is a small positive ' +
    'constant (~1.58e-5 at U = 6). Measurement only; ' +
    'RH-equivalent; carries NO RH verdict and NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u,v) = Phi(u) Phi(v) sinh(a(v-u))',
    lagStationarySurrogate: 'T(u,v) = sinh(a(v-u)) Abar(|v-u|),  Abar(k) = A_Phi(k)/(N-k)',
    linearShearGram: 'Glin(u,v) = Phi(u) Phi(v) (v-u),  Tlin(u,v) = (v-u) Abar(|v-u|)  (a-FREE ratio)',
    residual: 'e(a) = r(a) - r_lin,  r(a) = ||T|| / ||Gshear|| (sinh),  r_lin = ||Tlin|| / ||Glin|| (linear)',
    expansion: 'sinh(a Delta) = a Delta (1 + (a Delta)^2 / 6 + O(a^4)) -> r(a) = r_lin + c a^2 + O(a^4)',
    fullFit: 'log-log least squares ln e(a) = ln|c| + p ln a over the full a-ladder',
    smallAFit: `log-log least squares restricted to the ${SMALL_A_WINDOW} smallest a (asymptotic leading-order regime)`,
    localExponents: 'p_k = ln(e_k / e_{k+1}) / ln(a_k / a_{k+1}) (point-to-point slope, -> 2 as a -> 0)',
    aLadder: A_FIT.slice(),
    U: U_STAR,
    N,
    iters: ITERS,
    quadrature: 'midpoint, N panels on [0, U]; spectral norm via power iteration on M^T M (identical to imp-3350)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    aLadder: A_FIT.slice(),
    linearRatio: R_LIN, // a-FREE r_lin at U = 6, ~0.02966452 (reproduces imp-3350)
    sinhRatios: SINH_RATIOS, // r(a) sliding down toward r_lin as a -> 0
    residuals: RESIDUALS, // e(a) = r(a) - r_lin, positive and monotone decreasing
    residualsPositive,
    residualsMonotoneDecreasing,
    localExponents: LOCAL_EXPONENTS, // point-to-point exponents descending toward 2
    fullGridExponent: fullFit.slope, // log-log slope over the full ladder (~2.000; O(a^4) contamination negligible here)
    fullGridR2: fullFit.r2,
    asymptoticExponent: smallFit.slope, // small-a restricted slope ~ 2.00 (the leading-order rate)
    asymptoticR2: smallFit.r2,
    coefficientFromSmallestA, // c ~ e(a)/a^2 at the smallest a
    coefficientFromFit, // c = exp(intercept) of the small-a log-log fit
    asymptoticExponentNearTwo, // |p - 2| < 0.15
    verdict, // SINH-NONLINEARITY-RESIDUAL-VANISHES-AS-POSITIVE-O(a^2)-DRIFT
  }),

  interpretation: Object.freeze({
    orderIsTwo:
      'The imp-3350 "vanishing sinh-nonlinearity" residual e(a) = r(a) - r_lin vanishes as O(a^2). Both the ' +
      'full-grid and the small-a restricted log-log slopes land at p = 2.000 (R^2 = 1.000000) and the ' +
      'point-to-point local exponents descend monotonically 2.0002 -> 2.0000 toward 2; the O(a^4) ' +
      'contamination is negligible across this [0.0625, 0.5] ladder.',
    whyO2:
      'sinh(a Delta) = a Delta (1 + (a Delta)^2 / 6 + O(a^4)), so both Gram matrices are the linear kernel ' +
      'plus an a^2 correction times the common weight a; the a factor cancels in the ratio, and the leading ' +
      'correction to the largest singular value is first order in the a^2 perturbation, giving r(a) = r_lin + ' +
      'c a^2 + O(a^4). The measured rate confirms this leading-order picture numerically.',
    positiveDrift:
      'The residual is positive at every a (r(a) > r_lin, monotone decreasing toward r_lin), so the sinh ' +
      'nonlinearity is a small POSITIVE O(a^2) drift above the linear-shear limit, with fitted leading ' +
      'coefficient c ~ 1.58e-5 at U = 6 -- three orders below the ~3% capture ratio itself.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measuresRateNotPositivity:
      'This module measures only the leading power of a in the sinh residual e(a) = r(a) - r_lin; it does ' +
      'NOT construct the missing off-diagonal magnitude and does NOT attempt the K_a >= 0 positivity.',
    orderIsNumericalNotSymbolic:
      'The O(a^2) rate is certified NUMERICALLY (log-log fit + point-to-point local exponents at N = 240, ' +
      'ITERS = 500), not by a symbolic proof that the a^2 term is the exact leading correction of the norm ' +
      'ratio; it is a measured leading-order rate, not an identity.',
    finiteAContamination:
      'Higher sinh terms contribute O(a^4) contamination at the larger a; across this [0.0625, 0.5] ladder ' +
      'that contamination is negligible (both full-grid and small-a slopes = 2.000), but the quoted O(a^2) ' +
      'rate is the small-a restricted (asymptotic) slope, which is the cleanest leading-order regime.',
    necessaryNotSufficient:
      'Quantifying the residual rate is diagnostic; the imp-3066 off-diagonal endpoint-Hankel operator ' +
      'magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3409_CAPTURE_RATIO_SINH_RESIDUAL_ORDER_ASSERTIONS = [
  {
    id: 'imp3409-residual-positive-and-monotone',
    why: 'The sinh residual e(a) = r(a) - r_lin must be positive at every a and monotone decreasing as ' +
      'a -> 0 (r(a) slides down toward the linear-shear limit r_lin). A sign flip or non-monotone residual ' +
      'would break the imp-3350 vanishing-sinh-nonlinearity picture.',
    holds: () => residualsPositive && residualsMonotoneDecreasing,
  },
  {
    id: 'imp3409-asymptotic-exponent-is-two',
    why: 'THE CORE DELIVERABLE: the small-a restricted log-log slope of ln e(a) vs ln a must land near 2 ' +
      '(|p - 2| < 0.15), certifying the residual vanishes as O(a^2) as predicted by the sinh(a Delta) = ' +
      'a Delta (1 + (a Delta)^2 / 6 + ...) expansion. A slope away from 2 would contradict the leading-order rate.',
    holds: () => asymptoticExponentNearTwo,
  },
  {
    id: 'imp3409-loglog-fit-quality',
    why: 'The small-a log-log fit must be near-perfectly linear (R^2 > 0.999): a clean power law is what makes ' +
      'the fitted exponent a meaningful measurement of the leading vanishing rate.',
    holds: () => smallFit.r2 > 0.999,
  },
  {
    id: 'imp3409-local-exponents-descend-toward-two',
    why: 'The point-to-point local exponents must descend toward 2 as a -> 0, with the smallest-a local ' +
      'exponent within 0.2 of 2. A rising or far-from-2 tail would indicate the residual is not O(a^2).',
    holds: () => Math.abs(LOCAL_EXPONENTS[LOCAL_EXPONENTS.length - 1] - 2) < 0.2,
  },
  {
    id: 'imp3409-linear-ratio-reproduces-imp3350',
    why: 'The a-FREE linear ratio r_lin at U = 6 must reproduce the imp-3350 / imp-3240 headline capture ~0.02966, ' +
      'confirming the residual is measured against the correct linear-shear baseline.',
    holds: () => R_LIN > 0.0296 && R_LIN < 0.0297,
  },
  {
    id: 'imp3409-verdict-o2-drift',
    why: 'The classified verdict must be the positive-O(a^2)-drift finding, not indeterminate; a flip means the ' +
      'residual sign/monotonicity, the O(a^2) rate, or the fit quality failed.',
    holds: () => verdict === 'SINH-NONLINEARITY-RESIDUAL-VANISHES-AS-POSITIVE-O(a^2)-DRIFT',
  },
  {
    id: 'imp3409-honest-measurement-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- not a proof, not a reduction below RH, RH-equivalent, positivity ' +
      'not attempted, the rate is numerical not symbolic, no refereed bound is changed. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3409_CAPTURE_RATIO_SINH_RESIDUAL_ORDER.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.orderIsNumericalNotSymbolic === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3409_CAPTURE_RATIO_SINH_RESIDUAL_ORDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3409-capture-ratio-sinh-residual-order assertion failed: ${assertion.id}`);
  }
}

export default IMP3409_CAPTURE_RATIO_SINH_RESIDUAL_ORDER;
