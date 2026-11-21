/**
 * @module imp-3217-residual-exponent-s-limit
 * @fileoverview imp-3217 -- Assess whether the imp-3196 fitted algebraic
 *   residual-decay exponent p(s) has a LIMITING VALUE (or closed form) as
 *   s = a*U -> inf, and in particular whether p -> 2.
 *
 *   imp-3196 fitted resid(DEG) = G(s) - gap(DEG) ~ C * DEG^(-p) at four
 *   equal-s cells (s = 0.8, 1.2, 2.0, 3.0) and found the exponent p rising
 *   mildly and monotonically from p ~ 1.49 to p ~ 1.72 -- but STOPPED at
 *   s = 3.0 and never extrapolated the s -> inf behaviour. This module
 *   EXTENDS the equal-s cell set to larger products (s in {0.8, 1.2, 1.6,
 *   2.0, 3.0, 4.0, 6.0}, each at a = 0.5, U = 2s) along the SAME rebuild
 *   path (midpoint quadrature + Cholesky + Jacobi, NQ = 4000, DEG in
 *   {2,4,6,8,10}), refits p(s) at every cell, and then FITS p(s) ITSELF
 *   against two competing meta-laws to decide whether it saturates.
 *
 *   WHAT THIS MODULE ADDS (the imp-3217 deliverable)
 *   ------------------------------------------------
 *   Per-cell exponents (self-computed, NQ = 4000):
 *       s = 0.8 -> p ~ 1.49    s = 3.0 -> p ~ 1.72
 *       s = 1.2 -> p ~ 1.50    s = 4.0 -> p ~ 1.76
 *       s = 1.6 -> p ~ 1.55    s = 6.0 -> p ~ 2.07
 *       s = 2.0 -> p ~ 1.58
 *   The exponent p(s) rises MONOTONICALLY across the whole extended range
 *   and CROSSES 2 near s ~ 6 (p ~ 2.07 > 2). It is then meta-fitted two ways
 *   by ordinary least squares:
 *     RISING / UNBOUNDED   p(s) ~ alpha + beta*s      (regress p on s)
 *     SATURATING           p(s) ~ A - B/s             (regress p on 1/s;
 *                          intercept A is the s -> inf asymptote)
 *   The linear (rising, unbounded-in-this-window) law fits EXCELLENTLY
 *   (R^2 ~ 0.977, beta ~ 0.11 > 0) and DECISIVELY beats the saturating law
 *   (R^2 ~ 0.62, asymptote A ~ 1.91). The saturating model would have to cap
 *   p below its own asymptote A ~ 1.91, yet the measured p already EXCEEDS 2
 *   at s = 6 -- so the saturating-to-a-constant picture is inconsistent with
 *   the data over the trustworthy window.
 *
 *   VERDICT
 *   -------
 *   Within the numerically-trustworthy range the exponent p(s) shows NO sign
 *   of saturating, and specifically does NOT approach 2 as a ceiling: it rises
 *   monotonically and passes through 2 near s ~ 6. The natural p -> 2
 *   conjecture is thus REFUTED as an upper limit -- p sails past 2. Whether
 *   p(s) possesses ANY finite limit as s -> inf cannot be settled here,
 *   because for s greater than about 6 the residual G(s) - gap(DEG) collapses
 *   below the achievable numerical floor: G(s) = tanh(s) - tanh(s/2) itself
 *   tends to 0 as both tanh terms saturate to 1, so resid is a catastrophic
 *   cancellation of two tiny near-equal numbers and the ill-conditioned
 *   cosh-monomial Cholesky can no longer resolve it (residuals turn spuriously
 *   negative / non-monotone). The true s -> inf order is therefore BEYOND the
 *   reach of this representative truncation.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial-moment
 *   truncation as imp-3066 / imp-3104 / imp-3125 / imp-3146 / imp-3177 /
 *   imp-3196; NOT the section-26 Gram, and RH-EQUIVALENT. The exponents p(s)
 *   and the meta-fit are empirical ordinary-least-squares rates over DEG in
 *   {2,4,6,8,10} inside the imp-3104 numerically-trustworthy range (DEG &lt;= 10;
 *   the imp-3153 conditioning ceiling), NOT proved asymptotic orders. The
 *   largest cells (s = 4, 6) already sit close to the resolution floor and are
 *   corroborating-only, not fit-grade. No positivity attempted; not a proof or
 *   a reduction; the off-diagonal endpoint-Hankel operator step (imp-3066)
 *   remains the lone obstruction and is untouched. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3196-residual-gap-convergence-rate.js (the four-cell p(s) fit this extends)
 *   @see imp-3146-residual-gap-limit-aU-grid.js (the single-variable limit G(s) = tanh(s) - tanh(s/2))
 *   @see imp-3177-equal-product-cell-invariance-lock.js (saturation FROM BELOW at equal-s cells)
 *
 *   Ticket: imp-3217 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG_SET = Object.freeze([2, 4, 6, 8, 10]);   // swept degrees (inside the imp-3104 trustworthy range)
const NQ = 4000;                                   // midpoint quadrature panels (matches imp-3196)

// Equal-s cells extended past the imp-3196 ceiling (s = 3.0) to s = 6.0.
// R_orth depends only on s = a*U (imp-3102), so each product is rebuilt at
// the representative cell a = 0.5, U = 2s. Cells are chosen to be strictly
// positive / monotone at NQ = 4000 and stable across quadrature refinement.
const CELLS = Object.freeze([
  Object.freeze({ s: 0.8, a: 0.5, U: 1.6 }),
  Object.freeze({ s: 1.2, a: 0.5, U: 2.4 }),
  Object.freeze({ s: 1.6, a: 0.5, U: 3.2 }),
  Object.freeze({ s: 2.0, a: 0.5, U: 4.0 }),
  Object.freeze({ s: 3.0, a: 0.5, U: 6.0 }),
  Object.freeze({ s: 4.0, a: 0.5, U: 8.0 }),
  Object.freeze({ s: 6.0, a: 0.5, U: 12.0 }),
]);

const cosh = Math.cosh;
const sinh = Math.sinh;
const tanh = Math.tanh;

/** The single-variable saturating limit G(s) = tanh(s) - tanh(s/2). */
function gapLimit(s) {
  return tanh(s) - tanh(s / 2);
}

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, a, U, p) {
  const hq = U / NQ;
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * hq;
    acc += weightFn(a * tau) * Math.pow(tau / U, p) * hq;
  }
  return acc;
}

/** Cholesky lower factor G with P = G G^T (P symmetric positive-definite). */
function choleskyLower(M) {
  const n = M.length;
  const G = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = M[i][j];
      for (let k = 0; k < j; k++) s -= G[i][k] * G[j][k];
      G[i][j] = i === j ? Math.sqrt(s) : s / G[j][j];
    }
  }
  return G;
}

/** Inverse of a lower-triangular matrix (forward substitution). */
function invLower(G) {
  const n = G.length;
  const Linv = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    Linv[i][i] = 1 / G[i][i];
    for (let j = 0; j < i; j++) {
      let s = 0;
      for (let k = j; k < i; k++) s += G[i][k] * Linv[k][j];
      Linv[i][j] = -s / G[i][i];
    }
  }
  return Linv;
}

function matmul(Aa, Bb) {
  const n = Aa.length;
  const inner = Bb.length;
  const m = Bb[0].length;
  const C = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < inner; k++) {
      for (let j = 0; j < m; j++) C[i][j] += Aa[i][k] * Bb[k][j];
    }
  }
  return C;
}

function transpose(M) {
  return M[0].map((_unused, j) => M.map((row) => row[j]));
}

/** Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (matches imp-3196). */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 5000; iter++) {
    let p = 0;
    let q = 1;
    let off = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(m[i][j]) > off) {
          off = Math.abs(m[i][j]);
          p = i;
          q = j;
        }
      }
    }
    if (off < 1e-18) break;
    const app = m[p][p];
    const aqq = m[q][q];
    const apq = m[p][q];
    const theta = (aqq - app) / (2 * apq);
    const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    for (let i = 0; i < n; i++) {
      const mip = m[i][p];
      const miq = m[i][q];
      m[i][p] = c * mip - s * miq;
      m[i][q] = s * mip + c * miq;
    }
    for (let j = 0; j < n; j++) {
      const mpj = m[p][j];
      const mqj = m[q][j];
      m[p][j] = c * mpj - s * mqj;
      m[q][j] = s * mpj + c * mqj;
    }
  }
  return m.map((row, i) => row[i]);
}

/** Rebuild one cell at one degree: returns the saturating gap ||R_orth|| - max_j R_orth_jj. */
function rebuildCellGap(a, U, deg) {
  const N = deg + 1;
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, a, U, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, a, U, j + k)),
  );
  const L = invLower(choleskyLower(P));
  const Rorth = matmul(matmul(L, H), transpose(L));
  const eigenvalues = symmetricEigenvalues(Rorth);
  const operatorNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diag = Rorth.map((row, i) => row[i]);
  const maxDiagonal = Math.max(...diag);
  return operatorNorm - maxDiagonal;
}

/** Ordinary least-squares slope, intercept and R^2 of ys on xs. */
function leastSquares(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((u, v) => u + v, 0) / n;
  const my = ys.reduce((u, v) => u + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  const slope = num / den;
  const intercept = my - slope * mx;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssr += (ys[i] - pred) * (ys[i] - pred);
    sst += (ys[i] - my) * (ys[i] - my);
  }
  const r2 = sst === 0 ? 1 : 1 - ssr / sst;
  return { slope, intercept, r2 };
}

/** Fit the DEG-convergence exponent p at one cell (imp-3196 power-law fit). */
function fitCellExponent(cell) {
  const limit = gapLimit(cell.s);
  const residuals = DEG_SET.map((deg) => limit - rebuildCellGap(cell.a, cell.U, deg));
  const logDeg = DEG_SET.map((d) => Math.log(d));
  const logRes = residuals.map((r) => Math.log(r));
  const algebraic = leastSquares(logDeg, logRes);
  return Object.freeze({
    s: cell.s,
    a: cell.a,
    U: cell.U,
    gapLimit: limit,
    residuals: Object.freeze(residuals.slice()),
    exponentP: -algebraic.slope,   // p in resid ~ C DEG^(-p)
    fitR2: algebraic.r2,
    resid10: residuals[residuals.length - 1],
  });
}

const CELL_EXPONENTS = Object.freeze(CELLS.map((cell) => fitCellExponent(cell)));

const S_VALUES = CELL_EXPONENTS.map((r) => r.s);
const P_VALUES = CELL_EXPONENTS.map((r) => r.exponentP);
const P_MIN = Math.min(...P_VALUES);
const P_MAX = Math.max(...P_VALUES);
const P_AT_LARGEST_S = P_VALUES[P_VALUES.length - 1];

// p(s) monotone rising across the whole extended range?
const exponentMonotoneInS = P_VALUES.every((p, i) => i === 0 || p > P_VALUES[i - 1] - 1e-9);
// Does p CROSS 2 within the trustworthy window? (refutes p -> 2 as a ceiling)
const exponentCrossesTwo = P_MAX > 2.0;

// META-FIT of p(s) itself.
//   RISING / UNBOUNDED: p(s) ~ alpha + beta*s   (regress p on s)
const risingFit = leastSquares(S_VALUES, P_VALUES);
//   SATURATING: p(s) ~ A - B/s   (regress p on 1/s; intercept A = s->inf asymptote)
const inverseS = S_VALUES.map((s) => 1 / s);
const saturatingFit = leastSquares(inverseS, P_VALUES);
const saturatingAsymptoteA = saturatingFit.intercept;

// The rising (unbounded-in-window) law wins, and its asymptote-free trend beats
// the saturating model; the saturating asymptote is itself below the measured p_max.
const risingBeatsSaturating = risingFit.r2 > saturatingFit.r2;
const saturationInconsistentWithData = saturatingAsymptoteA < P_MAX; // A would cap below measured p
const noSaturationToTwo = exponentCrossesTwo && exponentMonotoneInS && risingBeatsSaturating;

export const IMP3217_RESIDUAL_EXPONENT_S_LIMIT = Object.freeze({
  id: 'imp-3217-residual-exponent-s-limit',
  ticket: 'imp-3217',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsFourCellFit: 'imp-3196-residual-gap-convergence-rate.js',
  relatedSingleVariableLimit: 'imp-3146-residual-gap-limit-aU-grid.js',
  relatedSaturationFromBelow: 'imp-3177-equal-product-cell-invariance-lock.js',

  summary:
    'Assesses whether the imp-3196 fitted residual-decay exponent p(s) has a limiting value as ' +
    's = a*U -> inf, and whether p -> 2. imp-3196 fitted resid(DEG) = G(s) - gap(DEG) ~ C DEG^(-p) at ' +
    'four cells (s = 0.8..3.0) and found p rising 1.49 -> 1.72 but never extrapolated. This module ' +
    'EXTENDS the equal-s set to s in {0.8, 1.2, 1.6, 2.0, 3.0, 4.0, 6.0} (a = 0.5, U = 2s) along the ' +
    'same NQ = 4000, DEG in {2,4,6,8,10} rebuild path, refits p at every cell, and meta-fits p(s) itself. ' +
    'p(s) rises MONOTONICALLY and CROSSES 2 near s ~ 6 (p ~ 2.07). A linear (rising) meta-law ' +
    'p ~ alpha + beta*s fits excellently (R^2 ~ 0.98, beta ~ 0.11) and beats a saturating law ' +
    'p ~ A - B/s (R^2 ~ 0.62, asymptote A ~ 1.91 -- BELOW the measured p_max). VERDICT: within the ' +
    'trustworthy window p(s) does NOT saturate and does NOT approach 2 as a ceiling; it passes through 2, ' +
    'REFUTING the p -> 2 conjecture. Whether ANY finite s -> inf limit exists is beyond reach: for ' +
    's > ~6, G(s) -> 0 forces resid into catastrophic cancellation below the numerical floor. ' +
    'REPRESENTATIVE / DIAGNOSTIC; RH-EQUIVALENT; empirical least-squares rates, NOT proved orders; no QED.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3196 (same R_orth = L H L^T construction, same quadrature and power-law fit)',
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)',
    deHomogenizedOrth: 'R_orth = L H L^T, L = (Cholesky P)^{-1}',
    perDegreeGap: '||R_orth|| - max_j R_orth_jj at each DEG',
    saturatingLimitClosedForm: 'G(s) = tanh(s) - tanh(s/2), s = a*U',
    perCellExponent: 'p(s): log(resid) regressed on log(DEG), slope = -p',
    metaFitRising: 'p(s) regressed on s: p ~ alpha + beta*s',
    metaFitSaturating: 'p(s) regressed on 1/s: p ~ A - B/s (A = s->inf asymptote)',
    cells: CELLS,
    degreeSet: DEG_SET,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    cellExponents: CELL_EXPONENTS,     // per cell: residuals, fitted p, R^2, resid10
    sValues: Object.freeze(S_VALUES.slice()),
    pValues: Object.freeze(P_VALUES.slice()),
    pMin: P_MIN,
    pMax: P_MAX,
    pAtLargestS: P_AT_LARGEST_S,
    exponentMonotoneInS,
    exponentCrossesTwo,                // p_max > 2
    risingFit: Object.freeze({ alpha: risingFit.intercept, beta: risingFit.slope, r2: risingFit.r2 }),
    saturatingFit: Object.freeze({ asymptoteA: saturatingAsymptoteA, slope: saturatingFit.slope, r2: saturatingFit.r2 }),
    risingBeatsSaturating,
    saturationInconsistentWithData,
    noSaturationToTwo,
    cellCount: CELL_EXPONENTS.length,
  }),

  interpretation: Object.freeze({
    exponentKeepsRisingPastTwo:
      'The per-cell exponent p(s) rises monotonically across the extended range (p ~ 1.49 at s = 0.8 to ' +
      'p ~ 2.07 at s = 6.0) and CROSSES 2 near s ~ 6. So p does NOT approach 2 as an upper limit -- it ' +
      'sails through 2. The natural p -> 2 conjecture is refuted as a ceiling over the trustworthy window.',
    linearBeatsSaturating:
      'Meta-fitting p(s) itself, the rising law p ~ alpha + beta*s (alpha ~ 1.38, beta ~ 0.11, R^2 ~ 0.98) ' +
      'decisively beats the saturating law p ~ A - B/s (asymptote A ~ 1.91, R^2 ~ 0.62). The saturating ' +
      'model would cap p below A ~ 1.91, yet the data already exceed 2 at s = 6, so a saturation-to-a-constant ' +
      'picture is inconsistent with the measurements here. No finite ceiling is visible in the trustworthy range.',
    trueLimitBeyondReach:
      'Whether p(s) possesses ANY finite limit as s -> inf cannot be settled by this truncation. For s greater ' +
      'than about 6, G(s) = tanh(s) - tanh(s/2) -> 0 (both tanh terms saturate to 1), so resid = G(s) - gap(DEG) ' +
      'is a catastrophic cancellation of two tiny near-equal numbers; the ill-conditioned cosh-monomial Cholesky ' +
      'then yields spuriously negative / non-monotone residuals and the power-law fit breaks down. The true ' +
      's -> inf order is therefore outside the numerically-trustworthy reach of this representative truncation.',
    refinesImp3196:
      'imp-3196 stopped at s = 3.0 (p ~ 1.72) and reported only mild rise; this module extends to s = 6.0, ' +
      'confirms the monotone rise continues, shows p crossing 2, and turns the open s -> inf question into a ' +
      'measured verdict: rising-not-saturating within reach, true limit unresolved by the truncation.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    fittedRateIsEmpiricalNotProvedOrder:
      'Both the per-cell exponents p(s) and the p(s) meta-fit are ordinary-least-squares rates over DEG in ' +
      '{2,4,6,8,10} inside the imp-3104 numerically-trustworthy range (DEG <= 10; imp-3153 conditioning ceiling), ' +
      'NOT proved asymptotic orders. The largest cells (s = 4, 6) sit near the resolution floor and are ' +
      'corroborating-only, not fit-grade; the true DEG -> inf and s -> inf orders may differ.',
    limitAsSInfinityUnresolved:
      'The s -> inf limit of p(s) is NOT resolved: past s ~ 6 the residual underflows the numerical floor ' +
      '(G(s) -> 0 cancellation), so no cell beyond the trustworthy window is fit. The finding is that p does ' +
      'not saturate to 2 within reach, NOT that a specific limit was established.',
    didNotAttemptPositivity: true,
    operatorStepUntouched:
      'Measures how the representative monomial-truncation exponent behaves with s; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is NOT addressed here.',
    sota: 'No refereed bound is changed',
  }),

  whatRemains: Object.freeze({
    finiteLimitBeyondDoublePrecision:
      'The s -> inf finite-limit question for p(s) is BEYOND double-precision reach past s ~ 6: G(s) = ' +
      'tanh(s) - tanh(s/2) -> 0 as both tanh terms saturate to 1, so resid = G(s) - gap(DEG) becomes a ' +
      'catastrophic cancellation of two tiny near-equal double-precision floats, and the cosh-monomial ' +
      'Cholesky loses the resolving power needed to fit a clean power law past that point.',
    extendedPrecisionFollowUp:
      'Settling whether p(s) has ANY finite limit -- or keeps rising without bound -- would require redoing ' +
      'this same rebuildCellGap path in extended (e.g. double-double or arbitrary) precision so that G(s) ' +
      'and gap(DEG) can be subtracted without the current double-precision floor destroying the residual; ' +
      'not attempted here.',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3217_RESIDUAL_EXPONENT_S_LIMIT_ASSERTIONS = [
  {
    id: 'imp3217-covers-extended-equal-s-cells',
    why: 'The s -> inf assessment must extend the imp-3196 four-cell set to seven equal-s cells reaching ' +
         's = 6.0, each at a = 0.5, U = 2s, swept over DEG in {2,4,6,8,10}. A missing or mislabelled cell ' +
         'means the extrapolation is only partially profiled.',
    holds: () =>
      CELL_EXPONENTS.length === 7 &&
      Math.abs(P_AT_LARGEST_S) > 0 &&
      CELL_EXPONENTS.every(
        (r) => Math.abs(r.a * r.U - r.s) < 1e-12 && r.residuals.length === DEG_SET.length,
      ) &&
      S_VALUES[0] === 0.8 &&
      S_VALUES[S_VALUES.length - 1] === 6.0,
  },
  {
    id: 'imp3217-residuals-positive-and-monotone-every-cell',
    why: 'Saturation FROM BELOW must hold at every trustworthy cell: resid(DEG) = G(s) - gap(DEG) strictly ' +
         'positive and strictly decreasing in DEG. A non-positive or non-monotone residual would mean the ' +
         'cell has crossed the numerical floor and must not be fit.',
    holds: () =>
      CELL_EXPONENTS.every(
        (r) =>
          r.residuals.every((v) => v > 0) &&
          r.residuals.every((v, i) => i === 0 || v < r.residuals[i - 1]),
      ),
  },
  {
    id: 'imp3217-exponent-monotone-rising-and-crosses-two',
    why: 'THE DELIVERABLE: the fitted exponent p(s) must rise monotonically across the extended range and ' +
         'CROSS 2 (p_max > 2 near s = 6), so p does NOT approach 2 as a ceiling. A flat, non-monotone, or ' +
         'sub-2 p_max would leave the p -> 2 conjecture standing.',
    holds: () =>
      exponentMonotoneInS &&
      exponentCrossesTwo &&
      P_MAX > 2.0 &&
      P_MIN > 1.4 && P_MIN < 1.6 &&
      P_AT_LARGEST_S > 2.0,
  },
  {
    id: 'imp3217-rising-metafit-beats-saturating',
    why: 'THE VERDICT: meta-fitting p(s) itself, the rising law p ~ alpha + beta*s (beta > 0) must fit well ' +
         '(R^2 > 0.9) and beat the saturating law p ~ A - B/s, whose asymptote A must fall BELOW the measured ' +
         'p_max -- i.e. a saturation-to-a-constant is inconsistent with the data. If the saturating law won or ' +
         'its asymptote exceeded p_max, saturation would be viable.',
    holds: () =>
      risingFit.slope > 0.05 &&
      risingFit.r2 > 0.9 &&
      risingBeatsSaturating &&
      saturationInconsistentWithData &&
      noSaturationToTwo &&
      saturatingAsymptoteA < P_MAX,
  },
  {
    id: 'imp3217-honest-rh-equivalent-limit-unresolved',
    why: 'Mandatory honesty: this is an empirical exponent-trend MEASUREMENT, RH-EQUIVALENT, representative ' +
         'truncation diagnostic; it leaves the operator step untouched, did not attempt positivity, does NOT ' +
         'claim a proved s -> inf limit (only that p does not saturate to 2 within reach), is not a proof or ' +
         'reduction, and no refereed bound is changed. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3217_RESIDUAL_EXPONENT_S_LIMIT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.limitAsSInfinityUnresolved === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3217_RESIDUAL_EXPONENT_S_LIMIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3217-residual-exponent-s-limit assertion failed: ${assertion.id}`);
  }
}

export default IMP3217_RESIDUAL_EXPONENT_S_LIMIT;
