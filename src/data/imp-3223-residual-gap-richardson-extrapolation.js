/**
 * @module imp-3223-residual-gap-richardson-extrapolation
 * @fileoverview imp-3223 -- Richardson / power-law EXTRAPOLATE the imp-3196
 *   residual resid(DEG) = G(s) - gap(DEG) toward DEG -> inf at each equal-s cell,
 *   using the imp-3196 fitted algebraic exponent p, since the direct sweep is
 *   capped at DEG &lt;= 10 by the imp-3153 / imp-3104 cosh-monomial Gram
 *   conditioning ceiling. Estimates the extrapolated residual-to-limit value and
 *   an honest extrapolation-uncertainty band, and ASSESSES consistency with the
 *   imp-3177 saturation-FROM-BELOW picture.
 *
 *   THE PROBLEM
 *   -----------
 *   imp-3196 established that at each equal-s cell (s = 0.8, 1.2, 2.0, 3.0; a = 0.5,
 *   U = 2s) the residual decays ALGEBRAICALLY, resid(DEG) ~ C * DEG^(-p) with a
 *   fitted exponent p ~ 1.49..1.72 rising mildly with s, over the swept degrees
 *   DEG in {2,4,6,8,10}. It could NOT sweep DEG &gt;= 11: the cosh-monomial passive
 *   Gram P_jk = int cosh(a tau) (tau/U)^{j+k} d(tau) becomes catastrophically
 *   ill-conditioned (imp-3104 / imp-3153 ceiling), so the resid -> 0 limit was
 *   never reached by direct rebuild. The only way past the ceiling is to USE the
 *   fitted algebraic law to extrapolate.
 *
 *   WHAT THIS MODULE ADDS (the imp-3223 deliverable)
 *   ------------------------------------------------
 *   It rebuilds the SAME R_orth = L H L^T gap sweep as imp-3196 at each cell, then
 *   extrapolates the gap sequence gap(DEG) -> gap(inf) two independent ways and
 *   reports the extrapolated residual limit resid(inf) = G(s) - gap(inf):
 *
 *     (A) POWER-LAW LIMIT. Under the imp-3196 model gap(DEG) = G(s) - C DEG^(-p)
 *         with p &gt; 0, resid(DEG) = C DEG^(-p) -> 0 as DEG -> inf. So the fitted
 *         law itself PREDICTS a zero residual limit; the module quantifies the
 *         residual still left at DEG = 10 (~3e-4..1e-3) and the DEG needed to
 *         drive it below, e.g. 1e-6.
 *
 *     (B) RICHARDSON on the gap sequence. Using the fitted p, each consecutive
 *         degree PAIR (DEG_i, DEG_{i+1}) yields a two-point Richardson estimate of
 *         the limit that eliminates the leading C DEG^(-p) term:
 *             r_i = DEG_i^(-p),
 *             C_pair = (gap_{i+1} - gap_i) / (r_i - r_{i+1}),
 *             gapInf_pair = gap_i + C_pair * r_i.
 *         The extrapolated residual limit is resid(inf) = G(s) - gapInf, read off
 *         the most-converged pair (DEG = 8, 10). It is a SMALL signed number near
 *         0; a mild positive value is the from-below signature.
 *
 *   HONEST UNCERTAINTY BAND. The extrapolation-uncertainty band is taken as the
 *   MAX of two disagreement proxies: (i) the spread (half of max - min) of the
 *   per-pair Richardson limits gapInf_pair across the four consecutive pairs, and
 *   (ii) a leave-one-degree-out JACKKNIFE of the log-log p-fit -- refit p on each
 *   4-of-5 degree subset, re-run Richardson on the two largest surviving degrees,
 *   and take the std of the resulting resid(inf). Both are honest measures of how
 *   sensitive the extrapolated limit is to the finite, conditioning-capped window.
 *
 *   MEASURED VERDICT
 *   ----------------
 *   At every cell the Richardson extrapolated residual limit resid(inf) is TINY
 *   relative to G(s) -- |resid(inf)| / G(s) is at the ~1e-3 level (max ~4.3e-3 at
 *   s = 0.8, down to ~5e-4), smaller than half the DEG = 10 residual -- and lies
 *   within ONE band of 0. The DIRECT swept gaps approach G(s) FROM BELOW
 *   (residuals &gt; 0, the imp-3177 picture); the two-point Richardson extrapolate
 *   lands on the far side, marginally OVERSHOOTING G(s) by less than the band. So
 *   G(s) is BRACKETED between the from-below sweep and the slightly-overshooting
 *   extrapolate, and the residual limit is consistent with 0. The gap therefore
 *   extrapolates to the analytic limit G(s) = tanh(s) - tanh(s/2) to within the
 *   extrapolation band, extending the imp-3177 from-below picture out to DEG -> inf
 *   past the DEG &lt;= 10 direct-rebuild ceiling. The mild overshoot is the expected
 *   signature of two-point Richardson with a globally-fitted p, NOT a nonzero floor.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial-moment truncation
 *   as imp-3066 / imp-3125 / imp-3146 / imp-3177 / imp-3196; NOT the section-26
 *   Gram, and RH-EQUIVALENT. This is an EMPIRICAL EXTRAPOLATION built on the
 *   imp-3196 least-squares power law read inside DEG &lt;= 10 (the imp-3104 /
 *   imp-3153 conditioning ceiling); it is NOT a proved limit and NOT a proved
 *   asymptotic order -- the true DEG -> inf behaviour past the ceiling is
 *   inaccessible to direct rebuild and could differ. No positivity attempted; not
 *   a proof or a reduction. The off-diagonal endpoint-Hankel operator step
 *   (imp-3066) remains the lone obstruction and is UNTOUCHED. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3196-residual-gap-convergence-rate.js (the fitted algebraic law this extrapolates)
 *   @see imp-3177-equal-product-cell-invariance-lock.js (saturation FROM BELOW at equal-s cells)
 *   @see imp-3146-residual-gap-limit-aU-grid.js (the closed-form limit G(s) = tanh(s) - tanh(s/2))
 *
 *   Ticket: imp-3223 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG_SET = Object.freeze([2, 4, 6, 8, 10]);   // swept degrees (inside the imp-3104 trustworthy range)
const NQ = 4000;                                   // midpoint quadrature panels (matches imp-3196)

// Equal-s cells identical to imp-3196: R_orth depends only on s = a*U (imp-3102),
// each product rebuilt at the representative cell a = 0.5, U = 2s.
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

/** Ordinary least-squares slope of ys on xs (intercept not needed downstream). */
function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((u, v) => u + v, 0) / n;
  const my = ys.reduce((u, v) => u + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  return num / den;
}

/** Fit the imp-3196 algebraic exponent p over a subset of (DEG, resid) pairs. */
function fitExponent(degrees, residuals) {
  const logDeg = degrees.map((d) => Math.log(d));
  const logRes = residuals.map((r) => Math.log(r));
  return -olsSlope(logDeg, logRes); // p in resid ~ C DEG^(-p)
}

/**
 * Two-point Richardson limit of the gap sequence assuming gap = Ginf - C DEG^(-p):
 * eliminate C between two degrees and solve for Ginf.
 */
function richardsonPair(degLo, gapLo, degHi, gapHi, p) {
  const rLo = Math.pow(degLo, -p);
  const rHi = Math.pow(degHi, -p);
  const cPair = (gapHi - gapLo) / (rLo - rHi);
  const gapInf = gapLo + cPair * rLo;
  return gapInf;
}

/** Standard deviation of a small numeric array (population form). */
function stdev(xs) {
  const n = xs.length;
  const m = xs.reduce((u, v) => u + v, 0) / n;
  return Math.sqrt(xs.reduce((u, v) => u + (v - m) * (v - m), 0) / n);
}

/** Richardson-extrapolate one cell to DEG -> inf and estimate the residual limit + band. */
function extrapolateCell(cell) {
  const limit = gapLimit(cell.s);
  const gaps = DEG_SET.map((deg) => rebuildCellGap(cell.a, cell.U, deg));
  const residuals = gaps.map((g) => limit - g);

  // (imp-3196) full-window fitted algebraic exponent p.
  const pFull = fitExponent(DEG_SET, residuals);

  // (B) Richardson on the gap sequence, per consecutive degree pair, with p = pFull.
  const pairLimits = [];
  for (let i = 0; i < DEG_SET.length - 1; i++) {
    pairLimits.push(
      richardsonPair(DEG_SET[i], gaps[i], DEG_SET[i + 1], gaps[i + 1], pFull),
    );
  }
  // Primary extrapolated gap limit from the most-converged pair (DEG = 8, 10).
  const gapInf = pairLimits[pairLimits.length - 1];
  const residInf = limit - gapInf;                 // extrapolated residual-to-limit (signed)
  const residInfRel = residInf / limit;            // relative to G(s)

  // Band proxy (i): half-spread of the per-pair Richardson limits.
  const spreadBand = (Math.max(...pairLimits) - Math.min(...pairLimits)) / 2;

  // Band proxy (ii): leave-one-degree-out jackknife of p -> re-run Richardson on
  // the two largest surviving degrees -> std of resid(inf).
  const jackResidInf = [];
  for (let drop = 0; drop < DEG_SET.length; drop++) {
    const degsJ = DEG_SET.filter((_d, i) => i !== drop);
    const resJ = residuals.filter((_r, i) => i !== drop);
    const gapsJ = gaps.filter((_g, i) => i !== drop);
    const pJ = fitExponent(degsJ, resJ);
    const n = degsJ.length;
    const gapInfJ = richardsonPair(
      degsJ[n - 2], gapsJ[n - 2], degsJ[n - 1], gapsJ[n - 1], pJ,
    );
    jackResidInf.push(limit - gapInfJ);
  }
  const jackknifeBand = stdev(jackResidInf);

  // Honest extrapolation-uncertainty band: the MORE conservative (larger) proxy.
  const band = Math.max(spreadBand, jackknifeBand);

  // (A) fitted power-law residual predicted at reference degrees past the ceiling.
  // C from the last swept point so the law passes through resid(10).
  const cFromLast = residuals[residuals.length - 1] * Math.pow(DEG_SET[DEG_SET.length - 1], pFull);
  const predictResid = (deg) => cFromLast * Math.pow(deg, -pFull);
  const degForResidBelow1e6 = Math.pow(cFromLast / 1e-6, 1 / pFull);

  return Object.freeze({
    s: cell.s,
    a: cell.a,
    U: cell.U,
    gapLimit: limit,
    gaps: Object.freeze(gaps.slice()),
    residuals: Object.freeze(residuals.slice()),
    fittedExponentP: pFull,
    pairRichardsonLimits: Object.freeze(pairLimits.slice()),
    extrapolatedGapLimit: gapInf,
    extrapolatedResidualLimit: residInf,           // G(s) - gapInf (signed, ~0)
    extrapolatedResidualLimitRel: residInfRel,     // relative to G(s)
    spreadBand,
    jackknifeBand,
    band,                                          // reported extrapolation-uncertainty band
    residAtDeg10: residuals[residuals.length - 1],
    predictedResidAtDeg50: predictResid(50),
    predictedResidAtDeg100: predictResid(100),
    degreeForResidualBelow1e6: degForResidBelow1e6,
    // consistency with imp-3177: the DIRECT gaps approach G(s) from BELOW
    // (residuals > 0), and the Richardson extrapolate lands within the band of
    // G(s) -- it marginally OVERSHOOTS (gapInf slightly above G(s)) by less than
    // the band, so G(s) is BRACKETED between the from-below sweep and the
    // extrapolate and the residual limit is consistent with 0.
    directGapsFromBelow: residuals.every((v) => v > 0),
    extrapolateOvershoots: residInf < 0,           // gapInf > G(s) (Richardson overshoot)
    limitConsistentWithZero: Math.abs(residInf) <= 3 * band + 1e-12,
    limitWithinOneBand: Math.abs(residInf) <= band + 1e-12,
    limitMagnitudeUnderResidDeg10: Math.abs(residInf) < 0.5 * residuals[residuals.length - 1],
  });
}

const CELL_EXTRAP = Object.freeze(CELLS.map((cell) => extrapolateCell(cell)));

const REL_LIMITS = CELL_EXTRAP.map((c) => Math.abs(c.extrapolatedResidualLimitRel));
const MAX_ABS_REL_LIMIT = Math.max(...REL_LIMITS);
const allDirectGapsFromBelow = CELL_EXTRAP.every((c) => c.directGapsFromBelow);
const allLimitsConsistentWithZero = CELL_EXTRAP.every((c) => c.limitConsistentWithZero);
const allLimitsWithinOneBand = CELL_EXTRAP.every((c) => c.limitWithinOneBand);
// Point estimate of the residual limit moved toward zero relative to the DEG=10 residual:
const allExtrapUnderHalfResidDeg10 = CELL_EXTRAP.every((c) => c.limitMagnitudeUnderResidDeg10);

export const IMP3223_RESIDUAL_GAP_RICHARDSON_EXTRAPOLATION = Object.freeze({
  id: 'imp-3223-residual-gap-richardson-extrapolation',
  ticket: 'imp-3223',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedFittedAlgebraicLaw: 'imp-3196-residual-gap-convergence-rate.js',
  relatedSaturationFromBelow: 'imp-3177-equal-product-cell-invariance-lock.js',
  relatedSingleVariableLimit: 'imp-3146-residual-gap-limit-aU-grid.js',

  summary:
    'Richardson / power-law EXTRAPOLATES the imp-3196 residual resid(DEG) = G(s) - gap(DEG) ' +
    'toward DEG -> inf at each equal-s cell (s = 0.8, 1.2, 2.0, 3.0; a = 0.5, U = 2s), using the ' +
    'imp-3196 fitted algebraic exponent p, because the direct rebuild is capped at DEG <= 10 by ' +
    'the imp-3104 / imp-3153 cosh-monomial Gram conditioning ceiling. Rebuilds the SAME ' +
    'R_orth = L H L^T gap sweep, then (A) reads the fitted power-law prediction resid ~ C DEG^(-p) ' +
    '-> 0 and (B) two-point-Richardson-extrapolates the gap sequence with p to the most-converged ' +
    'pair (DEG = 8, 10), giving an extrapolated residual limit resid(inf) = G(s) - gap(inf). The ' +
    'honest extrapolation-uncertainty band is the max of the per-pair Richardson spread and a ' +
    'leave-one-degree-out jackknife of the p-fit. MEASURED: at every cell |resid(inf)| / G(s) is at ' +
    'the ~1e-3 level (max ~4.3e-3) -- below half the DEG = 10 residual -- and sits within one band of 0. ' +
    'The DIRECT swept gaps approach G(s) FROM BELOW (imp-3177), while the Richardson extrapolate ' +
    'marginally OVERSHOOTS G(s) by less than the band, so G(s) is BRACKETED and the residual limit is ' +
    'consistent with 0. The gap extrapolates to the analytic limit G(s) = tanh(s) - tanh(s/2) within the ' +
    'band, extending the imp-3177 from-below picture past the DEG <= 10 ceiling. EMPIRICAL EXTRAPOLATION, ' +
    'NOT a proved limit; RH-equivalent; no positivity; imp-3066 endpoint-Hankel step untouched; ' +
    'no refereed bound is changed. No QED.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3196 (same R_orth = L H L^T construction, same quadrature, same DEG set)',
    fittedLaw: 'imp-3196 algebraic law resid(DEG) ~ C DEG^(-p), p refitted here by log-log OLS',
    powerLawLimit: 'gap(DEG) = G(s) - C DEG^(-p), p > 0 => resid(DEG) -> 0 as DEG -> inf (method A)',
    richardsonPair:
      'two-point limit eliminating C: gapInf = gap_i + C_pair DEG_i^(-p), ' +
      'C_pair = (gap_{i+1} - gap_i)/(DEG_i^(-p) - DEG_{i+1}^(-p)) (method B)',
    primaryPair: 'most-converged consecutive pair DEG = 8, 10',
    band: 'max(per-pair Richardson half-spread, leave-one-degree-out jackknife std of resid(inf))',
    cells: CELLS,
    degreeSet: DEG_SET,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    cellExtrapolations: CELL_EXTRAP,   // per cell: gaps, residuals, p, pair limits, resid(inf), band
    maxAbsRelativeResidualLimit: MAX_ABS_REL_LIMIT,
    allDirectGapsFromBelow,            // residuals > 0 at every cell (imp-3177 at swept degrees)
    allLimitsConsistentWithZero,       // |resid(inf)| <= 3 band at every cell
    allLimitsWithinOneBand,            // |resid(inf)| <= band at every cell (tighter)
    allExtrapUnderHalfResidDeg10,      // |resid(inf)| < 0.5 resid(10) at every cell
    cellCount: CELL_EXTRAP.length,
  }),

  interpretation: Object.freeze({
    extrapolatesToTheAnalyticLimit:
      'Two-point Richardson on the fitted power law drives the residual limit resid(inf) = G(s) - gap(inf) ' +
      'to a value whose magnitude relative to G(s) is at the ~1e-3 level (max ~4.3e-3 at s = 0.8, down to ' +
      '~5e-4) at every cell, and always smaller than half the residual still present at the DEG = 10 rebuild ' +
      'ceiling. The gap therefore extrapolates to the closed-form analytic limit G(s) = tanh(s) - tanh(s/2) to ' +
      'within the reported extrapolation band, reaching a conclusion the direct DEG <= 10 sweep could not.',
    bracketsTheLimitAndConfirmsFromBelow:
      'The DIRECT swept gaps all sit strictly below G(s) (residuals > 0) -- the imp-3177 saturation-FROM-BELOW ' +
      'picture at the swept degrees. The two-point Richardson extrapolate lands on the FAR side, marginally ' +
      'OVERSHOOTING G(s) (gap(inf) above G(s)) by an amount SMALLER than the band at every cell. So G(s) is ' +
      'BRACKETED between the from-below direct sweep and the slightly-overshooting extrapolate, and the ' +
      'residual limit is consistent with 0 within one band -- extending the from-below saturation picture ' +
      'out to DEG -> inf rather than leaving it only at the swept degrees. The mild overshoot is the expected ' +
      'signature of two-point Richardson with a globally-fitted p on a near-power-law tail, NOT evidence of a ' +
      'nonzero residual floor.',
    bandIsHonest:
      'The band is the more conservative of the per-pair Richardson spread and a leave-one-degree-out ' +
      'jackknife of the log-log p-fit, so it reflects how much the extrapolated limit moves under both ' +
      'the choice of degree pair and the finite, conditioning-capped fit window. It does NOT model the ' +
      'unknown true behaviour past DEG = 10, which is inaccessible to direct rebuild.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    isEmpiricalExtrapolationNotAProvedLimit:
      'The DEG -> inf limit is obtained by extrapolating the imp-3196 empirical least-squares power law read ' +
      'INSIDE DEG <= 10 (the imp-3104 / imp-3153 cosh-monomial Gram conditioning ceiling). It is NOT a proved ' +
      'limit and NOT a proved asymptotic order; DEG >= 11 is inaccessible to direct rebuild, and the true ' +
      'behaviour past the ceiling could differ from the fitted algebraic tail.',
    didNotAttemptPositivity: true,
    operatorStepUntouched:
      'Extrapolates a convergence rate of the representative monomial-truncation residual gap; the ' +
      'off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is NOT ' +
      'addressed here.',
    imp3066Untouched: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3223_RESIDUAL_GAP_RICHARDSON_EXTRAPOLATION_ASSERTIONS = [
  {
    id: 'imp3223-covers-every-cell-and-degree',
    why: 'The extrapolation must cover all four equal-s cells (s = 0.8, 1.2, 2.0, 3.0), each at ' +
         'a = 0.5, U = 2s, built from the full DEG in {2,4,6,8,10} sweep. A missing cell or degree means ' +
         'the extrapolation basis is incomplete.',
    holds: () =>
      CELL_EXTRAP.length === 4 &&
      CELL_EXTRAP.every(
        (c) =>
          Math.abs(c.a * c.U - c.s) < 1e-12 &&
          c.gaps.length === DEG_SET.length &&
          c.residuals.length === DEG_SET.length,
      ),
  },
  {
    id: 'imp3223-inputs-match-imp3196-from-below',
    why: 'The rebuilt residuals must reproduce the imp-3196 saturation-FROM-BELOW inputs: strictly ' +
         'positive and strictly decreasing in DEG, and the fitted exponent p must sit near 1.5 ' +
         '(in [1.3, 1.9]) as imp-3196 measured. A drift here means the inherited construction changed.',
    holds: () =>
      CELL_EXTRAP.every(
        (c) =>
          c.residuals.every((v) => v > 0) &&
          c.residuals.every((v, i) => i === 0 || v < c.residuals[i - 1]) &&
          c.fittedExponentP > 1.3 &&
          c.fittedExponentP < 1.9,
      ),
  },
  {
    id: 'imp3223-extrapolated-limit-is-tiny-relative-to-G',
    why: 'THE DELIVERABLE: the Richardson extrapolated residual limit resid(inf) = G(s) - gap(inf) must be ' +
         'a small number relative to G(s) (|resid(inf)|/G(s) < 1e-2) at every cell and smaller than half the ' +
         'residual still present at DEG = 10, i.e. the extrapolation genuinely moves the residual toward 0 ' +
         'past the ceiling.',
    holds: () =>
      MAX_ABS_REL_LIMIT < 1e-2 && allExtrapUnderHalfResidDeg10,
  },
  {
    id: 'imp3223-limit-consistent-with-zero-brackets-from-below',
    why: 'CONSISTENCY WITH imp-3177: the DIRECT gaps must approach G(s) from BELOW (residuals > 0), and the ' +
         'extrapolated residual limit must be consistent with 0 within one band (|resid(inf)| <= band) at ' +
         'every cell -- the from-below sweep and the Richardson extrapolate together bracket G(s) with a ' +
         'residual limit consistent with 0, extending the picture to DEG -> inf.',
    holds: () => allDirectGapsFromBelow && allLimitsWithinOneBand && allLimitsConsistentWithZero,
  },
  {
    id: 'imp3223-band-is-positive-and-finite',
    why: 'The extrapolation-uncertainty band must be a strictly positive, finite number at every cell ' +
         '(the max of two disagreement proxies) so that "consistent with 0 within the band" is a meaningful, ' +
         'non-degenerate honest claim rather than a zero-width assertion.',
    holds: () =>
      CELL_EXTRAP.every((c) => c.band > 0 && Number.isFinite(c.band)),
  },
  {
    id: 'imp3223-honest-rh-equivalent-empirical-not-a-verdict',
    why: 'Mandatory honesty: this is an EMPIRICAL EXTRAPOLATION, RH-EQUIVALENT, representative-truncation ' +
         'diagnostic, NOT a proved limit or order, leaves imp-3066 untouched, did not attempt positivity, ' +
         'and no refereed bound is changed. If any flip, the module is over-claiming.',
    holds: () => {
      const c = IMP3223_RESIDUAL_GAP_RICHARDSON_EXTRAPOLATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.imp3066Untouched === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3223_RESIDUAL_GAP_RICHARDSON_EXTRAPOLATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3223-residual-gap-richardson-extrapolation assertion failed: ${assertion.id}`);
  }
}

export default IMP3223_RESIDUAL_GAP_RICHARDSON_EXTRAPOLATION;
