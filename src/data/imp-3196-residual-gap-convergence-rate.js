/**
 * @module imp-3196-residual-gap-convergence-rate
 * @fileoverview imp-3196 -- Measure the DEGREE-CONVERGENCE RATE of the
 *   imp-3146 / imp-3177 finite-DEG residual gap toward the analytic limit
 *   G(s) = tanh(s) - tanh(s/2). imp-3125 swept the gap vs DEG at the single
 *   headline cell (s = a*U = 3) and imp-3177 certified that, at every equal-s
 *   cell, the rebuilt gap ||R_orth|| - max_j R_orth_jj saturates G(s) strictly
 *   FROM BELOW -- but NEITHER quantified HOW the residual
 *       resid(DEG) = G(s) - gap(DEG)
 *   decays as the monomial truncation degree DEG grows. This module rebuilds
 *   R_orth = L H L^T from its own quadrature + Cholesky + Jacobi path at four
 *   equal-s cells (s = 0.8, 1.2, 2.0, 3.0; each taken at a = 0.5, U = 2s),
 *   tabulates resid(DEG) over DEG in {2,4,6,8,10}, and fits the decay law.
 *
 *   WHAT THIS MODULE ADDS (the imp-3196 deliverable)
 *   ------------------------------------------------
 *   For each cell it fits resid(DEG) against TWO competing laws by ordinary
 *   least squares on the five swept degrees:
 *     ALGEBRAIC / power-law  resid ~ C * DEG^(-p)
 *         -> regress log(resid) on log(DEG); slope = -p, exponent p = -slope.
 *     GEOMETRIC               resid ~ C * r^DEG
 *         -> regress log(resid) on DEG; slope = log(r) (decay per unit degree).
 *   and classifies the cell by which law fits better (higher R^2). The measured
 *   verdict at EVERY cell is ALGEBRAIC:
 *     - the power-law fit is excellent (R^2 ~ 0.996..0.999) and clearly beats
 *       the geometric fit (R^2 ~ 0.96..0.97);
 *     - the ratio resid(DEG)/resid(DEG-2) is NOT constant but RISES toward 1
 *       (~0.40 -> ~0.67) -- the signature of an algebraic, not geometric, tail
 *       (a true geometric decay would hold the ratio fixed).
 *   The fitted exponent is p ~ 1.5 and depends MILDLY on s: it rises monotonically
 *   from p ~ 1.49 (s = 0.8) through 1.50, 1.58 to p ~ 1.72 (s = 3.0). So the
 *   approach to G(s) is a slow power law whose order increases gently with the
 *   product s = a*U; the rate is NOT s-independent.
 *
 *   The s = 3.0 cell reproduces the imp-3125 headline sweep exactly (same cell
 *   a = 0.5, U = 6): resid(2) ~ 5.20e-3 and resid(10) ~ 3.15e-4 (the imp-3125
 *   distance-to-limit endpoints), so this module is a strict refinement of the
 *   imp-3125 trend into a quantitative rate, cross-checked at four products.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial-moment truncation
 *   as imp-3066 / imp-3086 / imp-3102 / imp-3104 / imp-3125 / imp-3146 / imp-3177;
 *   NOT the section-26 Gram, and RH-EQUIVALENT. This MEASURES a convergence rate of
 *   a saturating, strictly-positive residual gap; it neither claims the cover holds
 *   nor that it fails, and carries NO RH verdict. The fitted exponent p is an
 *   empirical least-squares rate over DEG in {2,4,6,8,10} (inside the imp-3104
 *   numerically-trustworthy range DEG &lt;= 10; DEG &gt;= 11 is excluded because the
 *   cosh-monomial Gram becomes catastrophically ill-conditioned), NOT a proved
 *   asymptotic order. No positivity attempted; not a proof or a reduction; the
 *   off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction and is untouched. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3125-orthogonalized-residual-gap-degree-sweep.js (the headline-cell DEG sweep)
 *   @see imp-3177-equal-product-cell-invariance-lock.js (saturation FROM BELOW at equal-s cells)
 *   @see imp-3146-residual-gap-limit-aU-grid.js (the single-variable limit G(s) = tanh(s) - tanh(s/2))
 *
 *   Ticket: imp-3196 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG_SET = Object.freeze([2, 4, 6, 8, 10]);   // swept degrees (inside the imp-3104 trustworthy range)
const NQ = 4000;                                   // midpoint quadrature panels (matches imp-3125 / imp-3177)

// Equal-s cells: R_orth depends only on s = a*U (imp-3102), so each product is
// rebuilt at the representative cell a = 0.5, U = 2s.
const CELLS = Object.freeze([
  Object.freeze({ s: 0.8, a: 0.5, U: 1.6 }),
  Object.freeze({ s: 1.2, a: 0.5, U: 2.4 }),
  Object.freeze({ s: 2.0, a: 0.5, U: 4.0 }),
  Object.freeze({ s: 3.0, a: 0.5, U: 6.0 }),
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

/** Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (matches imp-3125 / imp-3177). */
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

/** Fit the DEG-convergence rate of resid(DEG) = G(s) - gap(DEG) at one cell. */
function fitCellRate(cell) {
  const limit = gapLimit(cell.s);
  const sweep = DEG_SET.map((deg) => {
    const gap = rebuildCellGap(cell.a, cell.U, deg);
    return Object.freeze({ degree: deg, gap, residual: limit - gap });
  });
  const residuals = sweep.map((row) => row.residual);

  // Consecutive residual ratios: constant => geometric; rising toward 1 => algebraic.
  const ratios = residuals.slice(1).map((r, i) => r / residuals[i]);

  const logDeg = DEG_SET.map((d) => Math.log(d));
  const logRes = residuals.map((r) => Math.log(r));

  // ALGEBRAIC fit: log(resid) = log C - p log(DEG).
  const algebraic = leastSquares(logDeg, logRes);
  const algebraicExponentP = -algebraic.slope;

  // GEOMETRIC fit: log(resid) = log C + (log r) DEG.
  const geometric = leastSquares(DEG_SET, logRes);
  const geometricDecayPerDegree = Math.exp(geometric.slope); // factor per unit DEG

  const law = algebraic.r2 >= geometric.r2 ? 'ALGEBRAIC' : 'GEOMETRIC';

  return Object.freeze({
    s: cell.s,
    a: cell.a,
    U: cell.U,
    gapLimit: limit,
    sweep: Object.freeze(sweep),
    residuals: Object.freeze(residuals.slice()),
    consecutiveRatios: Object.freeze(ratios),
    algebraicExponentP,            // p in resid ~ C DEG^(-p)
    algebraicR2: algebraic.r2,
    geometricDecayPerDegree,       // r in resid ~ C r^DEG
    geometricR2: geometric.r2,
    law,                           // ALGEBRAIC at every cell (power law beats geometric)
  });
}

const CELL_RATES = Object.freeze(CELLS.map((cell) => fitCellRate(cell)));

const EXPONENTS = CELL_RATES.map((r) => r.algebraicExponentP);
const P_MIN = Math.min(...EXPONENTS);
const P_MAX = Math.max(...EXPONENTS);
// Does the fitted rate depend on s? p rises monotonically with s if so.
const exponentMonotoneInS = EXPONENTS.every((p, i) => i === 0 || p >= EXPONENTS[i - 1] - 1e-6);
const rateDependsOnS = exponentMonotoneInS && P_MAX - P_MIN > 0.1;
const allAlgebraic = CELL_RATES.every((r) => r.law === 'ALGEBRAIC');

export const IMP3196_RESIDUAL_GAP_CONVERGENCE_RATE = Object.freeze({
  id: 'imp-3196-residual-gap-convergence-rate',
  ticket: 'imp-3196',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedHeadlineDegreeSweep: 'imp-3125-orthogonalized-residual-gap-degree-sweep.js',
  relatedSaturationFromBelow: 'imp-3177-equal-product-cell-invariance-lock.js',
  relatedSingleVariableLimit: 'imp-3146-residual-gap-limit-aU-grid.js',

  summary:
    'Measures the DEGREE-convergence RATE of the finite-DEG residual gap toward the ' +
    'analytic limit G(s) = tanh(s) - tanh(s/2). imp-3177 certified the rebuilt gap ' +
    '||R_orth|| - max_j R_orth_jj saturates G(s) strictly FROM BELOW at equal-s cells but ' +
    'never quantified HOW resid(DEG) = G(s) - gap(DEG) decays. Rebuilds R_orth = L H L^T from ' +
    'its own quadrature + Cholesky + Jacobi path at s = 0.8, 1.2, 2.0, 3.0 (a = 0.5, U = 2s) ' +
    'over DEG in {2,4,6,8,10} and fits resid(DEG) against a power law resid ~ C DEG^(-p) and a ' +
    'geometric law resid ~ C r^DEG. THE VERDICT at every cell is ALGEBRAIC: the power-law fit ' +
    'is excellent (R^2 ~ 0.996..0.999) and beats the geometric fit (R^2 ~ 0.96..0.97), and the ' +
    'consecutive residual ratio RISES toward 1 (~0.40 -> ~0.67) rather than staying constant -- ' +
    'the signature of an algebraic, not geometric, tail. The fitted exponent is p ~ 1.5 and ' +
    'depends MILDLY on s, rising monotonically from p ~ 1.49 (s = 0.8) to p ~ 1.72 (s = 3.0): ' +
    'the rate is NOT s-independent. The s = 3 cell reproduces the imp-3125 headline endpoints ' +
    '(resid(2) ~ 5.20e-3, resid(10) ~ 3.15e-4). REPRESENTATIVE / DIAGNOSTIC; RH-EQUIVALENT; no ' +
    'positivity, no proof; an empirical least-squares rate, NOT a proved asymptotic order.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3125 / imp-3177 (same R_orth = L H L^T construction, same quadrature)',
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)',
    deHomogenizedOrth: 'R_orth = L H L^T, L = (Cholesky P)^{-1}',
    perDegreeGap: '||R_orth|| - max_j R_orth_jj at each DEG',
    saturatingLimitClosedForm: 'G(s) = tanh(s) - tanh(s/2), s = a*U',
    residualMeasured: 'resid(DEG) = G(s) - gap(DEG) > 0 (saturation from below)',
    algebraicFit: 'log(resid) regressed on log(DEG): slope = -p, exponent p',
    geometricFit: 'log(resid) regressed on DEG: slope = log r, factor r per unit DEG',
    cells: CELLS,
    degreeSet: DEG_SET,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    cellRates: CELL_RATES,            // per cell: sweep, residuals, ratios, fitted p and r, R^2, law
    exponents: Object.freeze(EXPONENTS.slice()),
    pMin: P_MIN,
    pMax: P_MAX,
    exponentMonotoneInS,              // p rises with s
    rateDependsOnS,                   // p spread > 0.1 and monotone => the rate is s-dependent
    allAlgebraic,                     // power law beats geometric at every cell
    cellCount: CELL_RATES.length,
  }),

  interpretation: Object.freeze({
    decayIsAlgebraicNotGeometric:
      'At every cell the power-law fit resid ~ C DEG^(-p) (R^2 ~ 0.996..0.999) decisively beats ' +
      'the geometric fit resid ~ C r^DEG (R^2 ~ 0.96..0.97), and the consecutive residual ratio ' +
      'resid(DEG)/resid(DEG-2) is not constant but RISES toward 1 (~0.40 at the first step to ~0.67 ' +
      'at the last). A constant ratio is the hallmark of geometric decay; a ratio drifting toward 1 ' +
      'is the hallmark of an algebraic tail. So the saturation toward G(s) is a slow power law, not a ' +
      'fast exponential -- consistent with the truncation of a function with an endpoint singularity ' +
      'in the lag variable rather than an analytic integrand.',
    exponentNearThreeHalvesRisingWithS:
      'The fitted exponent p sits near 1.5 and increases monotonically with the product s = a*U, ' +
      'from p ~ 1.49 at s = 0.8 through 1.50 and 1.58 to p ~ 1.72 at s = 3.0. The rate is therefore ' +
      'NOT s-independent: larger s (stronger shear over a longer lag window) yields a modestly faster ' +
      'power-law approach. The spread p ~ 0.23 over s in [0.8, 3.0] is gentle, so to leading order the ' +
      'whole equal-s family converges at a comparable ~DEG^(-3/2) rate.',
    refinesImp3125Trend:
      'imp-3125 reported only that the s = 3 gap SATURATES (distance to limit 5.20e-3 -> 3.15e-4, ~16x ' +
      'over DEG in {2,4,6,8,10}); this module reproduces those endpoints at the same cell and turns the ' +
      'qualitative trend into a quantitative power-law rate p ~ 1.72, cross-checked at three more products.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    fittedRateIsEmpiricalNotProvedOrder:
      'The exponent p is an ordinary-least-squares rate over the five swept degrees DEG in ' +
      '{2,4,6,8,10}, NOT a proved asymptotic order. DEG >= 11 is excluded because the cosh-monomial ' +
      'Gram becomes catastrophically ill-conditioned (imp-3104 / imp-3153), so the fit is read inside ' +
      'the numerically-trustworthy range only; the true DEG -> inf order may differ.',
    didNotAttemptPositivity: true,
    operatorStepUntouched:
      'Measures a convergence rate of the representative monomial-truncation residual gap; the ' +
      'off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is NOT ' +
      'addressed here.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3196_RESIDUAL_GAP_CONVERGENCE_RATE_ASSERTIONS = [
  {
    id: 'imp3196-covers-every-cell-and-degree',
    why: 'The rate measurement must cover all four equal-s cells (s = 0.8, 1.2, 2.0, 3.0), each at ' +
         'a = 0.5, U = 2s, swept over DEG in {2,4,6,8,10}. A missing cell or degree means the rate is ' +
         'only partially profiled.',
    holds: () =>
      CELL_RATES.length === 4 &&
      CELL_RATES.every(
        (r) =>
          Math.abs(r.a * r.U - r.s) < 1e-12 &&
          r.sweep.length === DEG_SET.length &&
          r.sweep.every((row, i) => row.degree === DEG_SET[i]),
      ),
  },
  {
    id: 'imp3196-residual-positive-and-strictly-shrinking',
    why: 'Saturation FROM BELOW: resid(DEG) = G(s) - gap(DEG) must be strictly positive and strictly ' +
         'decreasing in DEG at every cell. A non-positive or non-monotone residual would contradict the ' +
         'imp-3177 from-below saturation this rate is measured against.',
    holds: () =>
      CELL_RATES.every(
        (r) =>
          r.residuals.every((v) => v > 0) &&
          r.residuals.every((v, i) => i === 0 || v < r.residuals[i - 1]),
      ),
  },
  {
    id: 'imp3196-decay-is-algebraic-not-geometric',
    why: 'THE DELIVERABLE: the decay is ALGEBRAIC (power law) at every cell -- the log-log fit must beat ' +
         'the semi-log (geometric) fit, with an excellent power-law R^2 (> 0.99), and the consecutive ' +
         'residual ratio must RISE (not stay constant) toward 1, the algebraic-tail signature.',
    holds: () =>
      allAlgebraic &&
      CELL_RATES.every(
        (r) =>
          r.law === 'ALGEBRAIC' &&
          r.algebraicR2 > 0.99 &&
          r.algebraicR2 > r.geometricR2 &&
          r.consecutiveRatios.every((v, i) => i === 0 || v > r.consecutiveRatios[i - 1]),
      ),
  },
  {
    id: 'imp3196-exponent-near-three-halves-and-s-dependent',
    why: 'THE RATE: the fitted power-law exponent p must sit near 1.5 (in [1.3, 1.9]) at every cell and ' +
         'rise monotonically with s, so the spread p_max - p_min exceeds 0.1 -- the rate is NOT ' +
         's-independent. A flat or non-monotone p would contradict the measured s-dependence.',
    holds: () =>
      EXPONENTS.every((p) => p > 1.3 && p < 1.9) &&
      exponentMonotoneInS &&
      rateDependsOnS &&
      P_MAX - P_MIN > 0.1,
  },
  {
    id: 'imp3196-s3-cell-reproduces-imp3125-endpoints',
    why: 'Cross-check against the imp-3125 headline sweep (same cell a = 0.5, U = 6): the s = 3 residual ' +
         'must reproduce the imp-3125 distance-to-limit endpoints resid(2) ~ 5.20e-3 and resid(10) ~ ' +
         '3.15e-4. A mismatch means the inherited construction drifted.',
    holds: () => {
      const s3 = CELL_RATES.find((r) => r.s === 3.0);
      if (!s3) return false;
      const first = s3.residuals[0];
      const last = s3.residuals[s3.residuals.length - 1];
      return Math.abs(first - 5.2e-3) < 5e-4 && Math.abs(last - 3.15e-4) < 1e-4;
    },
  },
  {
    id: 'imp3196-honest-rh-equivalent-not-a-verdict',
    why: 'Mandatory honesty: this is an empirical rate MEASUREMENT, RH-EQUIVALENT, representative ' +
         'truncation diagnostic, leaves the operator step untouched, did not attempt positivity, is not a ' +
         'proof or a reduction or a proved asymptotic order, and no refereed bound is changed. If any flip the module ' +
         'is over-claiming.',
    holds: () => {
      const c = IMP3196_RESIDUAL_GAP_CONVERGENCE_RATE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3196_RESIDUAL_GAP_CONVERGENCE_RATE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3196-residual-gap-convergence-rate assertion failed: ${assertion.id}`);
  }
}

export default IMP3196_RESIDUAL_GAP_CONVERGENCE_RATE;
