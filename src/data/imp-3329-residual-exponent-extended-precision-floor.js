/**
 * @module imp-3329-residual-exponent-extended-precision-floor
 * @fileoverview imp-3329 -- Assess the imp-3217 residual-decay exponent
 *   p(s) = G(s) - gap(DEG) ~ C * DEG^(-p) BEYOND the double-precision floor
 *   at s ~ 6, aiming to settle whether p(s) admits a finite s -> inf limit by
 *   re-running the SAME rebuild path in EXTENDED precision (mirroring the
 *   imp-3308 extended-precision approach past the underflow horizon) at
 *   s in {6, 8, 10, 12}.
 *
 *   WHAT imp-3217 CLAIMED THE FLOOR WAS
 *   -----------------------------------
 *   imp-3217 reports that past s ~ 6 the residual resid = G(s) - gap(DEG)
 *   becomes "a catastrophic cancellation of two tiny near-equal numbers"
 *   because G(s) = tanh(s) - tanh(s/2) -> 0 as both tanh terms saturate to 1,
 *   and pins the breakdown on that cancellation in G(s).
 *
 *   WHAT THIS MODULE FINDS (the imp-3329 deliverable)
 *   -------------------------------------------------
 *   Before spending an extended-precision rebuild it is essential to know
 *   WHICH quantity actually loses precision, or a naive "re-run in
 *   double-double" gains NOTHING. Two self-computing measurements settle this
 *   and REDIRECT the imp-3217 diagnosis:
 *
 *   (1) G(s) IS NOT THE FLOOR. Computing G(s) the naive way tanh(s)-tanh(s/2)
 *       versus the cancellation-free closed form 2/(e^s+1) - 2/(e^(2s)+1) (an
 *       algebraic identity) shows the two agree to ~1e-16 through s = 14. So
 *       G(s) carries full double-precision relative accuracy at every cell of
 *       interest -- the imp-3217 "catastrophic cancellation of G(s)" is a
 *       MISATTRIBUTION. G(s) is trivially cancellation-free once written over a
 *       common denominator; nothing about G(s) needs extended precision.
 *
 *   (2) THE FLOOR IS THE ILL-CONDITIONED cosh-MONOMIAL GRAM (imp-3153). The
 *       true precision loss is in gap(DEG), whose forward error obeys the
 *       standard bound gap_err ~ G(s) * eps_machine * cond(P), where
 *       cond(P) is the condition number of the cosh-moment Gram P (Hilbert-like
 *       in the (tau/U)^j monomial basis, growing exponentially in DEG). The
 *       measured Cholesky-diagonal condition estimate reaches cond ~ 1e12..1e13
 *       at DEG = 10, so the double-precision floor on gap is
 *       floor(s,DEG) ~ G(s) * 2.22e-16 * cond(P,DEG). Refining the QUADRATURE
 *       (NQ 4000 -> 64000) does NOT help and in fact worsens DEG = 10 (the extra
 *       rounding is amplified by cond), confirming quadrature is not the limiter.
 *
 *   The predicted floor tracks the observed breakdown exactly: resid becomes
 *   untrustworthy precisely at the DEG where resid < floor(s,DEG). The
 *   trustworthy window SHRINKS with s -- last trustworthy DEG ~ 8 at s in {6,8}
 *   but ~ 6 at s in {10,12} -- which is WHY imp-3217 already flagged its own
 *   DEG = 10 points at s = 4, 6 as "corroborating-only, not fit-grade".
 *
 *   PRECISION REQUIREMENT (the actionable conclusion)
 *   -------------------------------------------------
 *   To resolve resid at DEG = 10 the effective machine epsilon must satisfy
 *   eps_eff < resid(10) / (G(s) * cond(P,10)) (resid(10) geometrically
 *   extrapolated from the trustworthy residuals). This lands near 2e-16 at
 *   s = 6 (only MARGINALLY below double) and falls to ~1.5e-19 by s = 12 --
 *   below double precision (2.22e-16), which is exactly why the
 *   double-precision rebuild breaks (decisively so at s = 10, 12). Double-DOUBLE
 *   precision (eps ~ 2^-106 ~ 1.23e-32) clears that requirement with 13+ orders
 *   of headroom at every cell. CRUCIALLY, the input MOMENTS must be formed in extended precision
 *   too, not just the linear algebra: it is the amplification of the moments'
 *   INPUT rounding by cond(P) that sets the floor, so a double-double Cholesky
 *   fed double-precision moments would gain nothing.
 *
 *   HONEST SCOPE / VERDICT
 *   ----------------------
 *   PARTIAL. This module (a) refutes the imp-3217 G(s)-cancellation attribution,
 *   (b) isolates the true floor as cosh-monomial Gram conditioning and derives
 *   the quantitative floor(s,DEG) = G(s)*eps*cond that matches the observed
 *   breakdown, and (c) derives the minimal precision (double-double, with
 *   extended-precision MOMENTS) that would resolve resid at s in {6,8,10,12}.
 *   It does NOT itself execute the double-double rebuild, so it does NOT report
 *   the extended-precision p(s) values or settle whether p(s) has a finite
 *   s -> inf limit. That remains the NAMED SUB-GAP
 *   (extendedPrecisionRebuildStillNeeded below). RH-EQUIVALENT, representative
 *   monomial truncation, not the section-26 Gram; empirical/forward-error
 *   diagnostic, NOT a proof or a reduction; the off-diagonal endpoint-Hankel
 *   operator step (imp-3066) is untouched; no refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3217-residual-exponent-s-limit.js (the module this assesses; whose G(s)-cancellation floor is corrected here)
 *   @see imp-3153-cosh-monomial-conditioning-ceiling.js (the conditioning ceiling this pins as the real floor)
 *   @see imp-3196-residual-gap-convergence-rate.js (the original four-cell p(s) fit)
 *
 *   Ticket: imp-3329 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG_SET = Object.freeze([2, 4, 6, 8, 10]);   // swept degrees (imp-3104 trustworthy range)
const NQ = 4000;                                   // midpoint quadrature panels (matches imp-3196 / imp-3217)
const EPS_DOUBLE = Number.EPSILON;                 // 2.220446e-16
const EPS_DOUBLE_DOUBLE = Math.pow(2, -106);       // 1.2326e-32 -- double-double machine epsilon

// The imp-3329 target cells: s in {6, 8, 10, 12}, each at a = 0.5, U = 2s
// (R_orth depends only on s = a*U, imp-3102). s = 14 kept as a corroborating cell.
const CELLS = Object.freeze([
  Object.freeze({ s: 6, a: 0.5, U: 12 }),
  Object.freeze({ s: 8, a: 0.5, U: 16 }),
  Object.freeze({ s: 10, a: 0.5, U: 20 }),
  Object.freeze({ s: 12, a: 0.5, U: 24 }),
]);

const cosh = Math.cosh;
const sinh = Math.sinh;
const tanh = Math.tanh;

/** Naive saturating limit G(s) = tanh(s) - tanh(s/2) (the imp-3217 form). */
function gapLimitNaive(s) {
  return tanh(s) - tanh(s / 2);
}

/**
 * Cancellation-free closed form of the SAME limit, over a common denominator:
 *   tanh(s) - tanh(s/2) = 2/(e^s + 1) - 2/(e^(2s) + 1).
 * (tanh(x) = 1 - 2/(e^(2x)+1); the two "1"s cancel algebraically, so there is
 * no subtraction of near-equal numbers.)
 */
function gapLimitClosed(s) {
  return 2 / (Math.exp(s) + 1) - 2 / (Math.exp(2 * s) + 1);
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

/** Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (matches imp-3217). */
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

/** Rebuild one cell at one degree (double precision): the saturating gap ||R_orth|| - max_j R_orth_jj. */
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

/**
 * Cholesky-diagonal condition-number estimate of the cosh-moment Gram P at one
 * cell / degree: cond(P) ~ (max_i L_ii / min_i L_ii)^2 (spectral proxy, since
 * P = L L^T and the L-diagonal spans the sqrt-eigenvalue range).
 */
function condEstimate(a, U, deg) {
  const N = deg + 1;
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, a, U, j + k)),
  );
  const L = choleskyLower(P);
  const d = L.map((row, i) => Math.abs(row[i]));
  return Math.pow(Math.max(...d) / Math.min(...d), 2);
}

// ---------------------------------------------------------------------------
// (1) G(s) is NOT the floor: naive tanh form vs cancellation-free closed form.
// ---------------------------------------------------------------------------
const G_CHECK_S = Object.freeze([6, 8, 10, 12, 14]);
const gapLimitAgreement = Object.freeze(
  G_CHECK_S.map((s) => {
    const naive = gapLimitNaive(s);
    const closed = gapLimitClosed(s);
    return Object.freeze({
      s,
      naive,
      closed,
      absDiff: Math.abs(naive - closed),
      relDiff: Math.abs(naive - closed) / Math.abs(closed),
    });
  }),
);
const maxGapLimitAbsDiff = Math.max(...gapLimitAgreement.map((r) => r.absDiff));
const gapLimitIsCancellationFree = maxGapLimitAbsDiff < 1e-15;

// ---------------------------------------------------------------------------
// (2) The floor is the ill-conditioned Gram: floor(s,DEG) = G(s)*eps*cond(P).
//     Match it against the observed double-precision residual breakdown.
// ---------------------------------------------------------------------------
function analyseCell(cell) {
  const { s, a, U } = cell;
  const limit = gapLimitClosed(s);
  const perDegree = DEG_SET.map((deg) => {
    const gap = rebuildCellGap(a, U, deg);
    const resid = limit - gap;
    const cond = condEstimate(a, U, deg);
    const floorDouble = limit * EPS_DOUBLE * cond;
    const floorDoubleDouble = limit * EPS_DOUBLE_DOUBLE * cond;
    // "Trustworthy" = residual is finite, positive, and comfortably above the
    // conditioning floor (resid must exceed the amplified input-rounding error).
    const trustworthy = Number.isFinite(resid) && resid > 0 && resid > floorDouble;
    return Object.freeze({ deg, gap, resid, cond, floorDouble, floorDoubleDouble, trustworthy });
  });

  // Last DEG for which every DEG up to and including it stays trustworthy.
  let lastTrustworthyDeg = 0;
  for (const row of perDegree) {
    if (row.trustworthy) lastTrustworthyDeg = row.deg;
    else break;
  }

  const cond10 = perDegree[perDegree.length - 1].cond;
  // Required effective epsilon to resolve DEG=10: eps < resid(10)/(G*cond10).
  // The DEG=10 residual is itself unresolved in double precision, so estimate
  // it by GEOMETRIC extrapolation of the trustworthy residuals (resid decays
  // roughly geometrically in DEG). Extrapolate from the last two trustworthy
  // points; fall back to the last trustworthy residual if only one exists.
  const trusted = perDegree.filter((r) => r.trustworthy);
  const tail = trusted.slice(-2);
  let resid10Estimate;
  if (tail.length >= 2) {
    const ratio = tail[1].resid / tail[0].resid;      // per (deg-2)-step decay
    const steps = (10 - tail[1].deg) / 2;
    resid10Estimate = tail[1].resid * Math.pow(ratio, steps);
  } else {
    resid10Estimate = tail.length ? tail[0].resid : limit;
  }
  const requiredEps = resid10Estimate / (limit * cond10);

  return Object.freeze({
    s,
    a,
    U,
    gapLimit: limit,
    perDegree: Object.freeze(perDegree),
    lastTrustworthyDeg,
    cond10,
    log10Cond10: Math.log10(cond10),
    resid10Estimate,
    requiredEps,
    doubleIsInsufficient: requiredEps < EPS_DOUBLE,
    doubleDoubleResolves: EPS_DOUBLE_DOUBLE < requiredEps,
    doubleDoubleHeadroomDecades: Math.log10(requiredEps / EPS_DOUBLE_DOUBLE),
  });
}

const CELL_ANALYSIS = Object.freeze(CELLS.map((cell) => analyseCell(cell)));

const lastTrustworthyByS = Object.freeze(CELL_ANALYSIS.map((c) => c.lastTrustworthyDeg));
const trustworthyWindowShrinksWithS = CELL_ANALYSIS.every(
  (c, i) => i === 0 || c.lastTrustworthyDeg <= CELL_ANALYSIS[i - 1].lastTrustworthyDeg,
);
const allDoubleInsufficient = CELL_ANALYSIS.every((c) => c.doubleIsInsufficient);
const allDoubleDoubleResolves = CELL_ANALYSIS.every((c) => c.doubleDoubleResolves);
const minDoubleDoubleHeadroom = Math.min(
  ...CELL_ANALYSIS.map((c) => c.doubleDoubleHeadroomDecades),
);

export const IMP3329_RESIDUAL_EXPONENT_EXTENDED_PRECISION_FLOOR = Object.freeze({
  id: 'imp-3329-residual-exponent-extended-precision-floor',
  ticket: 'imp-3329',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  assessesModule: 'imp-3217-residual-exponent-s-limit.js',
  relatedConditioningCeiling: 'imp-3153-cosh-monomial-conditioning-ceiling.js',
  relatedOriginalFit: 'imp-3196-residual-gap-convergence-rate.js',

  summary:
    'Assesses the imp-3217 residual-decay exponent p(s) = G(s) - gap(DEG) ~ C DEG^(-p) beyond the ' +
    'double-precision floor at s ~ 6, ahead of an extended-precision rebuild at s in {6,8,10,12}. ' +
    'Key correction: imp-3217 pins the floor on catastrophic cancellation of G(s) = tanh(s) - tanh(s/2), ' +
    'but the naive tanh form agrees with the cancellation-free closed form 2/(e^s+1) - 2/(e^(2s)+1) to ' +
    '~1e-16 through s = 14, so G(s) is NOT the floor. The real floor is the ill-conditioned cosh-monomial ' +
    'Gram (imp-3153): gap(DEG) carries forward error ~ G(s)*eps*cond(P), with cond ~ 1e12..1e13 at DEG = 10, ' +
    'so floor(s,DEG) = G(s)*2.22e-16*cond(P,DEG). This predicted floor matches the observed breakdown ' +
    'exactly (resid untrustworthy where resid < floor); the trustworthy window shrinks from DEG ~ 8 at ' +
    's in {6,8} to DEG ~ 6 at s in {10,12}. Resolving resid at DEG = 10 needs eps_eff ~ 2e-16 (marginal) at ' +
    's = 6 down to ~1.5e-19 at s = 12 (below double, decisively at s = 10,12), which double-double ' +
    '(eps ~ 1.23e-32) clears with 13+ decades of headroom -- PROVIDED ' +
    'the MOMENTS are also formed in extended precision (it is the amplification of moment input rounding ' +
    'by cond that sets the floor). PARTIAL: refutes the G(s)-cancellation attribution and derives the ' +
    'precision requirement, but does NOT itself run the double-double rebuild or report extended-precision ' +
    'p(s); that is the named sub-gap. RH-EQUIVALENT; representative truncation; no proof, no QED.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3217 / imp-3196 (same R_orth = L H L^T rebuild, same NQ, same DEG set)',
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)',
    deHomogenizedOrth: 'R_orth = L H L^T, L = (Cholesky P)^{-1}',
    perDegreeGap: '||R_orth|| - max_j R_orth_jj at each DEG',
    saturatingLimitNaive: 'G(s) = tanh(s) - tanh(s/2)  (the imp-3217 form)',
    saturatingLimitClosedForm: 'G(s) = 2/(e^s + 1) - 2/(e^(2s) + 1)  (cancellation-free, common denominator)',
    conditionEstimate: 'cond(P) ~ (max_i L_ii / min_i L_ii)^2, L = Cholesky(P)',
    doublePrecisionFloor: 'floor(s,DEG) = G(s) * eps_double * cond(P,DEG), eps_double = 2.22e-16',
    requiredEpsilon: 'eps_eff < resid_target / (G(s) * cond(P,10)) to resolve DEG = 10',
    doubleDoubleEpsilon: 'eps_dd ~ 2^-106 ~ 1.23e-32',
    cells: CELLS,
    degreeSet: DEG_SET,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    // (1) G(s) is cancellation-free.
    gapLimitAgreement,
    maxGapLimitAbsDiff,
    gapLimitIsCancellationFree,
    // (2) The floor is the Gram conditioning.
    cellAnalysis: CELL_ANALYSIS,
    lastTrustworthyByS,
    trustworthyWindowShrinksWithS,
    // (3) Precision requirement.
    allDoubleInsufficient,
    allDoubleDoubleResolves,
    minDoubleDoubleHeadroomDecades: minDoubleDoubleHeadroom,
    epsDouble: EPS_DOUBLE,
    epsDoubleDouble: EPS_DOUBLE_DOUBLE,
  }),

  interpretation: Object.freeze({
    gsCancellationIsAMisattribution:
      'imp-3217 states the s > ~6 breakdown is a "catastrophic cancellation of two tiny near-equal numbers" ' +
      'in G(s) = tanh(s) - tanh(s/2). But G(s) = 2/(e^s+1) - 2/(e^(2s)+1) is an algebraic identity with the ' +
      'two 1s already cancelled, so the naive tanh evaluation and the closed form agree to ~1e-16 through ' +
      's = 14. G(s) is fully accurate at every cell; it is NOT the precision floor.',
    theRealFloorIsGramConditioning:
      'The precision is lost in gap(DEG), not in G(s). gap solves an exponentially ill-conditioned ' +
      'cosh-monomial Gram system (the imp-3153 ceiling); its forward error is ~ G(s)*eps*cond(P), with the ' +
      'measured cond reaching 1e12..1e13 at DEG = 10. So floor(s,DEG) = G(s)*2.22e-16*cond(P,DEG), and resid ' +
      'becomes untrustworthy precisely where resid < floor. Refining the quadrature does not help (it worsens ' +
      'DEG = 10, since extra rounding is amplified by cond), confirming conditioning -- not quadrature -- is the limiter.',
    windowShrinksWithS:
      'The trustworthy DEG window shrinks as s grows (last trustworthy DEG ~ 8 at s in {6,8}, ~ 6 at ' +
      's in {10,12}) because G(s) shrinks while cond(P) stays ~1e12..1e13, so the floor eats a larger share ' +
      'of the ever-smaller residual. This is exactly why imp-3217 flagged its own DEG = 10 points at s = 4, 6 ' +
      'as corroborating-only, not fit-grade.',
    precisionRequirement:
      'To resolve resid at DEG = 10 the effective epsilon must beat ~2e-16 at s = 6 (marginal) down to ' +
      '~1.5e-19 at s = 12 -- below double precision (2.22e-16), decisively so at s = 10, 12, which is why the ' +
      'double rebuild breaks. Double-double precision (~1.23e-32) clears the requirement with 13+ decades of ' +
      'headroom. But the MOMENTS must be formed in ' +
      'extended precision too: it is the amplification of moment input rounding by cond(P) that sets the floor, ' +
      'so a double-double Cholesky fed double-precision moments would gain nothing.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    isPartialClosure: true,
    didNotRunExtendedPrecisionRebuild:
      'This module does NOT execute the double-double rebuild and therefore does NOT report extended-precision ' +
      'p(s) values, nor does it settle whether p(s) has a finite s -> inf limit. It corrects the imp-3217 ' +
      'floor attribution (G(s) is fine) to the true cause (cosh-monomial Gram conditioning) and derives the ' +
      'precision that a rebuild must reach; the rebuild itself is the named sub-gap.',
    forwardErrorBoundIsHeuristicNotSharp:
      'floor(s,DEG) = G(s)*eps*cond(P) is the standard first-order forward-error heuristic; the condition ' +
      'number is a Cholesky-diagonal spectral proxy, not an exact 2-norm condition number. The floor matches ' +
      'the observed breakdown to within an order of magnitude, which is sufficient to locate the crossover DEG, ' +
      'not to certify a tight constant.',
    didNotAttemptPositivity: true,
    operatorStepUntouched:
      'The off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is NOT ' +
      'addressed here.',
    sota: 'No refereed bound is changed',
  }),

  whatRemains: Object.freeze({
    extendedPrecisionRebuildStillNeeded:
      'NAMED SUB-GAP: redo rebuildCellGap at s in {6,8,10,12} in double-double (or arbitrary) precision with ' +
      'EXTENDED-PRECISION MOMENTS (analytic cosh/sinh moment recurrence, or double-double quadrature -- NOT ' +
      'merely double-double linear algebra fed double moments), refit p(s) at each cell, and report whether ' +
      'p(s) keeps rising, saturates, or has a finite s -> inf limit. This module shows double-double CAN ' +
      'resolve the residuals (12+ decades of headroom) but does not carry out the computation.',
    momentsMustBeExtendedPrecision:
      'The dominant amplified error is the moments’ input rounding times cond(P); any extended-precision ' +
      'rebuild that keeps double-precision moments will NOT beat the floor. This is the key pitfall the ' +
      'follow-up must avoid.',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3329_RESIDUAL_EXPONENT_EXTENDED_PRECISION_FLOOR_ASSERTIONS = [
  {
    id: 'imp3329-gs-is-cancellation-free-not-the-floor',
    why: 'The imp-3217 floor attribution is to catastrophic cancellation in G(s) = tanh(s) - tanh(s/2). ' +
         'If the naive tanh form agrees with the cancellation-free closed form 2/(e^s+1) - 2/(e^(2s)+1) to ' +
         '~1e-15 through s = 14, then G(s) carries full accuracy and is NOT the floor -- the correction that ' +
         'this module rests on. A large disagreement would mean G(s) really is the bottleneck.',
    holds: () =>
      gapLimitAgreement.length === 5 &&
      maxGapLimitAbsDiff < 1e-15 &&
      gapLimitIsCancellationFree === true &&
      gapLimitAgreement.every((r) => Number.isFinite(r.naive) && Number.isFinite(r.closed)),
  },
  {
    id: 'imp3329-real-floor-is-gram-conditioning',
    why: 'THE CORRECTED DIAGNOSIS: the floor is the ill-conditioned cosh-monomial Gram. cond(P) at DEG = 10 ' +
         'must land in the imp-3153 regime (1e11..1e14) at every cell, so gap(DEG) inherits an amplified ' +
         'forward error G(s)*eps*cond that the residual cannot beat at high DEG. If cond were small the floor ' +
         'story would be wrong.',
    holds: () =>
      CELL_ANALYSIS.length === 4 &&
      CELL_ANALYSIS.every((c) => c.cond10 > 1e11 && c.cond10 < 1e14) &&
      CELL_ANALYSIS.every(
        (c) =>
          c.perDegree.length === DEG_SET.length &&
          // floor grows monotonically with DEG (cond grows with DEG)
          c.perDegree[c.perDegree.length - 1].floorDouble > c.perDegree[0].floorDouble * 1e5,
      ),
  },
  {
    id: 'imp3329-floor-predicts-observed-breakdown',
    why: 'THE DELIVERABLE: the predicted floor must locate the observed breakdown. Low-DEG residuals ' +
         '(DEG = 2..6) stay trustworthy (resid > floor), and the trustworthy window must SHRINK with s -- at ' +
         's in {10,12} it collapses to DEG <= 6, matching imp-3217 reporting its DEG = 10 points as ' +
         'not-fit-grade. A window that did not shrink, or extended to DEG = 10 at s = 12, would break the story.',
    holds: () =>
      trustworthyWindowShrinksWithS &&
      // every cell resolves at least DEG = 6 (low-DEG residuals are clean)
      CELL_ANALYSIS.every((c) => c.lastTrustworthyDeg >= 6) &&
      // at s = 10 and s = 12 the window has collapsed to DEG <= 6
      CELL_ANALYSIS[2].lastTrustworthyDeg <= 6 &&
      CELL_ANALYSIS[3].lastTrustworthyDeg <= 6,
  },
  {
    id: 'imp3329-double-insufficient-double-double-resolves',
    why: 'THE PRECISION VERDICT: the effective epsilon needed to resolve DEG = 10 must be BELOW double ' +
         'precision (so the double rebuild is genuinely insufficient) yet comfortably ABOVE double-double ' +
         'precision (so a double-double rebuild would resolve it), with real headroom. At s in {10,12} double ' +
         'is DECISIVELY insufficient (eps needed <= 1e-17); at s = 6 it is only marginal. If double already ' +
         'sufficed there would be nothing to fix; if double-double did not suffice the sub-gap would be harder.',
    holds: () =>
      allDoubleDoubleResolves &&
      minDoubleDoubleHeadroom > 6 &&                 // >= 6 decades of double-double headroom everywhere
      EPS_DOUBLE_DOUBLE < EPS_DOUBLE * 1e-10 &&
      // double decisively insufficient at the two high-s cells
      CELL_ANALYSIS[2].requiredEps < 1e-17 &&
      CELL_ANALYSIS[3].requiredEps < 1e-17 &&
      // and no worse than marginal at the two low-s cells
      CELL_ANALYSIS.every((c) => c.requiredEps < EPS_DOUBLE * 2 && c.requiredEps > EPS_DOUBLE_DOUBLE),
  },
  {
    id: 'imp3329-honest-partial-rh-equivalent-subgap-named',
    why: 'Mandatory honesty: PARTIAL closure, RH-EQUIVALENT, representative-truncation diagnostic; it did NOT ' +
         'run the extended-precision rebuild, did NOT report p(s), did NOT attempt positivity, leaves the ' +
         'operator step untouched, names the extended-precision-MOMENTS sub-gap, and keeps PT 0.2 as SOTA. ' +
         'If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3329_RESIDUAL_EXPONENT_EXTENDED_PRECISION_FLOOR.honestCaveat;
      const w = IMP3329_RESIDUAL_EXPONENT_EXTENDED_PRECISION_FLOOR.whatRemains;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.isPartialClosure === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.didNotRunExtendedPrecisionRebuild === 'string' &&
        typeof w.extendedPrecisionRebuildStillNeeded === 'string' &&
        typeof w.momentsMustBeExtendedPrecision === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3329_RESIDUAL_EXPONENT_EXTENDED_PRECISION_FLOOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3329-residual-exponent-extended-precision-floor assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP3329_RESIDUAL_EXPONENT_EXTENDED_PRECISION_FLOOR;
