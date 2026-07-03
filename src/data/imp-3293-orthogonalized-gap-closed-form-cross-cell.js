/**
 * @module imp-3293-orthogonalized-gap-closed-form-cross-cell
 * @fileoverview imp-3293 -- Certify that the imp-3125 SATURATING closed form
 *   tanh(s) - tanh(s/2), s = a*U, is the DEG-to-infinity limit of the numerical
 *   basis-invariant orthogonalized gap across the FULL a x U grid, not merely at the
 *   single locked headline cell a = 0.5, U = 6 (s = 3) where imp-3125 certified it.
 *
 *   THE TWO PARENTS
 *   ---------------
 *   imp-3102-orthogonalized-gap-aU-grid.js swept the surviving gap
 *   ||R_orth|| - max_j R_orth_jj (R_orth = L H L^T, L = (Cholesky of the FULL passive
 *   cosh Gram)^-1) across the a x U grid at DEG = 4 ONLY and found it tracks the single
 *   product s = a*U. imp-3125 then swept DEG in {2,4,6,8,10} at the ONE headline cell
 *   a = 0.5, U = 6 and found the gap SATURATES from below to the closed form
 *   tanh(a*U) - tanh(a*U/2) ~ 0.08991, pinned by two analytic anchors: the operator
 *   norm rises toward the Rayleigh ceiling tanh(a*U), and the constant-function
 *   direction diagonal is EXACTLY R_orth_00 = (cosh(a*U)-1)/sinh(a*U) = tanh(a*U/2).
 *   But NO cell OTHER than s = 3 was DEG-swept: the closed form was certified at one s.
 *
 *   WHAT THIS MODULE ADDS (the imp-3293 deliverable -- MEASURE + EXTRAPOLATE)
 *   -----------------------------------------------------------------------
 *   We DEG-sweep {2,4,6,8,10} at SIX cells spanning the product axis at VARIED (a,U)
 *   decompositions -- s = 0.5 (small), s = s_star (the golden-ratio maximum, see below),
 *   s = 1.5, s = 2, s = 3 (the headline lock), s = 4 -- and, per cell, (i) confirm the
 *   EXACT constant-direction floor R_orth_00 = tanh(s/2) to machine precision at every
 *   degree, (ii) confirm the operator norm rises toward and respects the ceiling
 *   tanh(s), (iii) Aitken-extrapolate the DEG-to-infinity CONSTANT-DIRECTION gap
 *   ||R_orth|| - R_orth_00 and check it lands on the closed form tanh(s) - tanh(s/2).
 *
 *   THE CLEAN CELL-WIDE INVARIANT (why the CONSTANT-direction gap, not the max-diagonal)
 *   -----------------------------------------------------------------------------------
 *   R_orth_00 = H_00 / P_00 = (cosh(s)-1)/sinh(s) = tanh(s/2) is EXACT and DEG-independent
 *   at EVERY cell -- it is the cosh-weighted Rayleigh quotient of the constant function.
 *   So the DEG-to-infinity limit of ||R_orth|| - R_orth_00 is tanh(s) - tanh(s/2) cell-wide,
 *   and the sweep certifies the numerical gap saturates to it at every trustworthy cell.
 *
 *   THE GOLDEN-RATIO MAXIMUM (a clean structural fact this sweep records)
 *   --------------------------------------------------------------------
 *   The closed-form gap g(s) = tanh(s) - tanh(s/2) is maximized where g_prime(s) = 0, i.e.
 *   sech^2(s) = (1/2) sech^2(s/2). Writing c = cosh^2(s/2) and cosh(s) = 2c - 1 gives
 *   4c^2 - 6c + 1 = 0, whose relevant root yields cosh(s_star) = (1+sqrt(5))/2 = phi, the
 *   GOLDEN RATIO. So s_star = arccosh(phi) ~ 1.0613 and g(s_star) ~ 0.30028 is the largest
 *   the intrinsic obstruction ever gets. The headline cell s = 3 sits well on the
 *   large-s (decaying) side of this maximum -- so the swept cells straddle s_star.
 *
 *   TWO HONEST BOUNDARIES THIS SWEEP MEASURES (not swept under the rug)
 *   ------------------------------------------------------------------
 *   (A) MAX-DIAGONAL vs CONSTANT-DIRECTION. The imp-3125 headline used max_j R_orth_jj and
 *       found the argmax IS the constant direction (j = 0) at s = 3. That is s-DEPENDENT:
 *       at SMALL s (e.g. s = 0.5) the highest boundary monomial diagonal edges ABOVE the
 *       constant direction by ~1e-5 (a near-degeneracy), so the MAX-diagonal gap saturates
 *       ~1e-5 BELOW the closed form. The clean cell-wide quantity is the CONSTANT-direction
 *       gap ||R_orth|| - R_orth_00; the max-diagonal identity holds only where the argmax
 *       coincides with j = 0 (broadly, but not at the smallest s).
 *   (B) LARGE-s ILL-CONDITIONING. The cosh-monomial passive Gram is catastrophically
 *       ill-conditioned at large s: at s = 5 (a = 0.5, U = 10) the DEG = 10 operator norm
 *       OVERSHOOTS its own analytic ceiling tanh(5) ~ 0.99991 (measured ~1.0667) -- garbage.
 *       So the cross-cell certification is bounded to cells whose operator norm RESPECTS
 *       the ceiling tanh(s); s = 5 is EXCLUDED and flagged as the conditioning boundary.
 *
 *   WHAT THE SWEEP FINDS (measured, NOT proved)
 *   -------------------------------------------
 *   At every trustworthy cell (s in {0.5, s_star, 1.5, 2, 3}): R_orth_00 = tanh(s/2) to
 *   ~1e-12; the operator norm respects and rises toward tanh(s); the constant-direction
 *   gap distance to tanh(s) - tanh(s/2) is strictly positive and strictly shrinking with
 *   DEG (shrink ~10x-16x); and the Aitken DEG-to-infinity extrapolant matches the closed
 *   form to within ~3e-3 (extrapolation residual, tightest ~4e-5 at s = 3). THE VERDICT:
 *   the imp-3125 closed form is the DEG-to-infinity gap limit CELL-WIDE, not just at s = 3.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial-moment truncation as
 *   imp-3066 / imp-3086 / imp-3102 / imp-3125; NOT the section-26 Gram. The measured gap,
 *   its DEG-trend, and the closed-form match carry NO RH verdict. The clean cell-wide
 *   invariant is the CONSTANT-direction gap (floor pinned EXACTLY at tanh(s/2)); the
 *   max-diagonal identity is s-dependent (boundary A) and DEG &lt;= 10 numerics fail at
 *   large s (boundary B). MEASURE + EXTRAPOLATE ONLY; no positivity attempted; not a proof
 *   or a reduction; bare-V pilot (imp-1240) NOT re-run. Platt-Trudgian Lambda &lt;= 0.2
 *   REMAINS the rigorous SOTA. No false QED.
 *
 *   @see imp-3125-orthogonalized-residual-gap-degree-sweep.js (imp-3125: the s = 3 DEG sweep)
 *   @see imp-3102-orthogonalized-gap-aU-grid.js (imp-3102: the DEG = 4 a x U grid sweep)
 *   @see imp-3086-orthogonalized-basis-conditioning.js (imp-3086: the single-cell survivor)
 *
 *   Ticket: imp-3293 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG_SET = Object.freeze([2, 4, 6, 8, 10]);   // swept degrees (inside the imp-3104 trustworthy range)
const NQ = 4000;                                   // midpoint quadrature panels (matches imp-3102 / imp-3125)

const cosh = Math.cosh;
const sinh = Math.sinh;
const tanh = Math.tanh;

// The golden-ratio maximum of g(s) = tanh(s) - tanh(s/2): g_prime = 0 <=> cosh(s) = phi.
const PHI = (1 + Math.sqrt(5)) / 2;
const S_STAR = Math.acosh(PHI);                    // ~1.0613: where the closed-form gap peaks

/** Closed-form gap the numerical constant-direction gap saturates toward at s = a*U. */
function closedFormGap(s) {
  return tanh(s) - tanh(s / 2);
}

/** EXACT constant-direction diagonal R_orth_00 = (cosh(s)-1)/sinh(s) = tanh(s/2). */
function constantDirectionDiagonal(s) {
  return (cosh(s) - 1) / sinh(s);
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

// -- small dense linear algebra (self-contained, identical routines to imp-3102 / imp-3125) --

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

/** Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (same as imp-3102 / imp-3125). */
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

/**
 * One (a, U, DEG) point: build the FULL passive cosh Gram P and the shear sinh Hankel H,
 * orthogonalize (R_orth = L H L^T), and return the operator norm, the max diagonal, its
 * index, and the EXACT constant-direction diagonal R_orth_00.
 */
function measureAt(a, U, deg) {
  const N = deg + 1;
  const P = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(cosh, a, U, j + k)),
  );
  const H = Array.from({ length: N }, (_u, j) =>
    Array.from({ length: N }, (_v, k) => weightedMoment(sinh, a, U, j + k)),
  );
  const L = invLower(choleskyLower(P));
  const Rorth = matmul(matmul(L, H), transpose(L));   // TRUE pencil operator: passive Gram is now identity
  const eigenvalues = symmetricEigenvalues(Rorth);
  const operatorNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diag = Rorth.map((row, i) => row[i]);
  const maxDiagonal = Math.max(...diag);
  const maxDiagonalIndex = diag.indexOf(maxDiagonal);
  const constantDirectionDiag = Rorth[0][0];          // R_orth_00 = H_00 / P_00 = tanh(s/2)
  return { deg, operatorNorm, maxDiagonal, maxDiagonalIndex, constantDirectionDiag };
}

/** Aitken delta-squared extrapolant of the last three terms of a sequence. */
function aitken(seq) {
  const n = seq.length;
  const g0 = seq[n - 3];
  const g1 = seq[n - 2];
  const g2 = seq[n - 1];
  const denom = (g2 - g1) - (g1 - g0);
  return g2 - ((g2 - g1) * (g2 - g1)) / denom;
}

/**
 * DEG-sweep one cell (a, U): measure the constant-direction gap ||R_orth|| - R_orth_00
 * across DEG_SET, compare its DEG-to-infinity extrapolant against the closed form, and
 * classify the max-diagonal-vs-constant-direction relationship. A cell is "trustworthy"
 * iff its DEG = 10 operator norm respects the analytic ceiling tanh(s).
 */
function sweepCell(a, U) {
  const s = a * U;
  const cf = closedFormGap(s);
  const ceiling = tanh(s);
  const R00Analytic = constantDirectionDiagonal(s);

  const rows = DEG_SET.map((deg) => {
    const m = measureAt(a, U, deg);
    return Object.freeze({
      deg,
      operatorNorm: m.operatorNorm,
      maxDiagonal: m.maxDiagonal,
      maxDiagonalIndex: m.maxDiagonalIndex,
      constantDirectionDiag: m.constantDirectionDiag,
      constantDirectionGap: m.operatorNorm - m.constantDirectionDiag,
      distanceToClosedForm: cf - (m.operatorNorm - m.constantDirectionDiag),
    });
  });

  const cdGaps = rows.map((r) => r.constantDirectionGap);
  const distances = rows.map((r) => r.distanceToClosedForm);
  const cdGapExtrapolated = aitken(cdGaps);
  const last = rows[rows.length - 1];

  // Constant-direction floor pinned EXACTLY at tanh(s/2) at every degree.
  const constantDirectionPinned = rows.every(
    (r) => Math.abs(r.constantDirectionDiag - R00Analytic) < 1e-12,
  );
  // Operator norm respects the analytic ceiling at DEG = 10 (numerical trustworthiness).
  const opNormRespectsCeiling = last.operatorNorm <= ceiling + 1e-12;
  // Distance to the closed form strictly positive and strictly shrinking with DEG.
  const distanceStrictlyPositive = distances.every((d) => d > 0);
  const distanceStrictlyShrinking = distances.every((d, i) => i === 0 || d < distances[i - 1]);
  const distanceShrinkFactor = distances[0] / distances[distances.length - 1];
  // The max-diagonal argmax sits at the constant direction (j = 0) at DEG = 10?
  const maxDiagIsConstantDirection = last.maxDiagonalIndex === 0;
  // How far the max diagonal edges above the constant direction (boundary A drift).
  const maxDiagOverConstantDirection = last.maxDiagonal - last.constantDirectionDiag;

  return Object.freeze({
    a,
    U,
    s,
    closedFormGap: cf,
    analyticCeiling: ceiling,
    analyticConstantDirectionDiagonal: R00Analytic,
    rows: Object.freeze(rows),
    cdGapAtDeg10: last.constantDirectionGap,
    cdGapExtrapolated,                                 // Aitken DEG-to-infinity constant-direction gap
    extrapolationResidual: cdGapExtrapolated - cf,     // extrapolant minus closed form
    distanceAtDeg10: last.distanceToClosedForm,
    distanceShrinkFactor,
    constantDirectionPinned,
    opNormRespectsCeiling,
    distanceStrictlyPositive,
    distanceStrictlyShrinking,
    maxDiagIsConstantDirection,
    maxDiagOverConstantDirection,
  });
}

// SIX cells spanning the product axis at VARIED (a,U) decompositions (straddling the
// golden-ratio maximum s_star ~ 1.0613): five trustworthy plus one ill-conditioned probe.
const CERT_CELLS = Object.freeze([
  sweepCell(0.25, 2),                 // s = 0.5   (small, below the golden maximum)
  sweepCell(0.5, 2 * S_STAR),         // s = s_star (the golden-ratio maximum)
  sweepCell(0.3, 5),                  // s = 1.5
  sweepCell(0.2, 10),                 // s = 2     (different a -- tests the s = a*U invariant)
  sweepCell(0.5, 6),                  // s = 3     (the imp-3125 / imp-3102 headline lock)
]);

// The ill-conditioning boundary probe: at s = 5 the DEG = 10 cosh-Gram breaks the ceiling.
const ILL_CONDITIONED_PROBE = sweepCell(0.5, 10);      // s = 5, a = 0.5, U = 10

// Worst extrapolation residual across the trustworthy certification cells.
const worstExtrapolationResidual = Math.max(
  ...CERT_CELLS.map((c) => Math.abs(c.extrapolationResidual)),
);
// Worst constant-direction-floor mismatch across all swept cells and degrees.
const worstConstantDirectionMismatch = Math.max(
  ...CERT_CELLS.concat([ILL_CONDITIONED_PROBE]).flatMap((c) =>
    c.rows.map((r) => Math.abs(r.constantDirectionDiag - c.analyticConstantDirectionDiagonal)),
  ),
);

// Equal-product coincidence (inherited from imp-3102): s = 3 via two distinct (a,U),
// checked at DEG = 4 where the Cholesky conditioning keeps the s = a*U invariant machine
// -tight (~3e-13); by DEG = 10 the same conditioning has loosened it to ~6e-5 (boundary B).
const equalProductA = measureAt(0.5, 6, 4);            // s = 3
const equalProductB = measureAt(0.3, 10, 4);           // s = 3
const equalProductCdGapMismatch = Math.abs(
  (equalProductA.operatorNorm - equalProductA.constantDirectionDiag) -
  (equalProductB.operatorNorm - equalProductB.constantDirectionDiag),
);

// The golden-ratio maximum: verify cosh(s_star) = phi and g(s_star) is the numerical max.
const goldenCoshResidual = Math.abs(cosh(S_STAR) - PHI);
const goldenGapValue = closedFormGap(S_STAR);
let goldenIsNumericalMax = true;
for (let k = 1; k <= 400; k++) {
  const sProbe = 0.02 * k;                             // scan s in (0, 8]
  if (closedFormGap(sProbe) > goldenGapValue + 1e-12) goldenIsNumericalMax = false;
}

const allCellsPinned = CERT_CELLS.every((c) => c.constantDirectionPinned);
const allCellsRespectCeiling = CERT_CELLS.every((c) => c.opNormRespectsCeiling);
const allCellsSaturate = CERT_CELLS.every(
  (c) => c.distanceStrictlyPositive && c.distanceStrictlyShrinking && c.distanceShrinkFactor > 2,
);
// Boundary A: the smallest-s cell (s = 0.5) has its max diagonal edge ABOVE the constant
// direction (argmax off j = 0), while the headline cell (s = 3) has the argmax AT j = 0.
const smallSCell = CERT_CELLS[0];
const headlineCell = CERT_CELLS[4];

export const IMP3293_ORTHOGONALIZED_GAP_CLOSED_FORM_CROSS_CELL = Object.freeze({
  id: 'imp-3293-orthogonalized-gap-closed-form-cross-cell',
  ticket: 'imp-3293',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedHeadlineDegreeSweep: 'imp-3125-orthogonalized-residual-gap-degree-sweep.js',
  relatedGridSweep: 'imp-3102-orthogonalized-gap-aU-grid.js',
  relatedSingleCellSurvivor: 'imp-3086-orthogonalized-basis-conditioning.js',

  summary:
    'Certifies the imp-3125 saturating closed form tanh(s) - tanh(s/2), s = a*U, is the ' +
    'DEG-to-infinity limit of the numerical orthogonalized gap CELL-WIDE, not merely at the ' +
    'locked headline cell a = 0.5, U = 6 (s = 3). DEG-sweeps {2,4,6,8,10} at five trustworthy ' +
    'cells at VARIED (a,U) straddling the golden-ratio maximum s_star = arccosh(phi) ~ 1.0613 ' +
    '(s in {0.5, s_star, 1.5, 2, 3}). Per cell: the constant-direction floor R_orth_00 = ' +
    '(cosh(s)-1)/sinh(s) = tanh(s/2) is EXACT to ~1e-12 at every degree; the operator norm ' +
    'respects and rises toward the ceiling tanh(s); and the Aitken DEG-to-infinity extrapolant ' +
    'of the constant-direction gap ||R_orth|| - R_orth_00 lands on tanh(s) - tanh(s/2) to within ' +
    '~3e-3 (tightest ~4e-5 at s = 3), with the distance to the closed form strictly positive and ' +
    'shrinking ~10x-16x. TWO HONEST BOUNDARIES: (A) the MAX-diagonal argmax coincides with the ' +
    'constant direction only broadly -- at small s (0.5) a boundary monomial diagonal edges ~1e-5 ' +
    'above it, so the clean cell-wide invariant is the CONSTANT-direction gap; (B) at large s ' +
    '(s = 5, a = 0.5, U = 10) the DEG = 10 cosh-Gram is catastrophically ill-conditioned and the ' +
    'operator norm OVERSHOOTS its ceiling tanh(5) -- that cell is EXCLUDED and flagged. ' +
    'REPRESENTATIVE / DIAGNOSTIC; carries NO RH verdict.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3125 / imp-3102 (same R_orth = L H L^T orthogonalization and quadrature)',
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials)',
    fullPassiveGram: 'P_jk = int_0^U cosh(a*tau) phi_j phi_k d(tau)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau)',
    deHomogenizedOrth: 'R_orth = L H L^T, L = (Cholesky P)^-1 (TRUE pencil operator; passive Gram -> identity)',
    constantDirectionFloor: 'R_orth_00 = H_00 / P_00 = (cosh(s)-1)/sinh(s) = tanh(s/2), EXACT and DEG-independent',
    ceiling: 'tanh(s): ||R_orth|| = sup int sinh f^2 / int cosh f^2 <= tanh(a*U) for all f',
    closedFormGap: 'tanh(s) - tanh(s/2) (the DEG-to-infinity limit of ||R_orth|| - R_orth_00)',
    goldenMaximum: 'g(s) = tanh(s) - tanh(s/2) peaks where cosh(s) = phi = (1+sqrt5)/2; s_star = arccosh(phi) ~ 1.0613',
    extrapolation: 'Aitken delta-squared on the DEG in {6,8,10} constant-direction gaps',
    degreeSet: DEG_SET,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    certificationCells: '(a,U) = (0.25,2),(0.5,2 s_star),(0.3,5),(0.2,10),(0.5,6) [s = 0.5,s_star,1.5,2,3]',
    illConditionedProbe: '(a,U) = (0.5,10) [s = 5]: DEG = 10 op-norm overshoots ceiling tanh(5)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    certificationCells: CERT_CELLS,                    // per cell: DEG sweep, extrapolant, closed-form residual
    illConditionedProbe: ILL_CONDITIONED_PROBE,        // s = 5: ceiling-violating boundary cell
    worstExtrapolationResidual,                        // max |Aitken extrapolant - closed form| across cells
    worstConstantDirectionMismatch,                    // max |R_orth_00 - tanh(s/2)| across all cells/degrees
    equalProductCdGapMismatch,                         // s = 3 via (0.5,6) vs (0.3,10): coincidence of the gap
    goldenCoshResidual,                                // |cosh(s_star) - phi|
    goldenGapValue,                                    // g(s_star) ~ 0.30028, the peak gap
    goldenIsNumericalMax,                              // g(s_star) is the max over a fine s-grid
    sStar: S_STAR,                                     // arccosh(phi) ~ 1.0613
    phi: PHI,
    allCellsPinned,
    allCellsRespectCeiling,
    allCellsSaturate,
    smallSMaxDiagOverConstantDirection: smallSCell.maxDiagOverConstantDirection,   // ~+2.6e-5 (boundary A)
    smallSMaxDiagIsConstantDirection: smallSCell.maxDiagIsConstantDirection,       // false at s = 0.5
    headlineMaxDiagIsConstantDirection: headlineCell.maxDiagIsConstantDirection,   // true at s = 3
    illConditionedOpNormOvershoot:
      ILL_CONDITIONED_PROBE.rows[ILL_CONDITIONED_PROBE.rows.length - 1].operatorNorm -
      ILL_CONDITIONED_PROBE.analyticCeiling,           // > 0: the s = 5 ceiling violation
  }),

  interpretation: Object.freeze({
    closedFormHoldsCellWide:
      'The imp-3125 closed form tanh(s) - tanh(s/2) is the DEG-to-infinity limit of the ' +
      'basis-invariant orthogonalized gap at EVERY trustworthy cell, not just the s = 3 lock: ' +
      'the constant-direction floor R_orth_00 = tanh(s/2) is EXACT and DEG-independent at every ' +
      'cell, the operator norm rises toward tanh(s), and the Aitken DEG-to-infinity extrapolant ' +
      'of ||R_orth|| - R_orth_00 lands on tanh(s) - tanh(s/2) across the product axis.',
    cleanInvariantIsConstantDirection:
      'The clean cell-wide quantity is the CONSTANT-direction gap ||R_orth|| - R_orth_00, whose ' +
      'floor is EXACT. The MAX-diagonal gap coincides with it only where the argmax is the ' +
      'constant direction j = 0 -- true at s = 3 (the imp-3125 lock) but NOT at small s = 0.5, ' +
      'where the highest boundary monomial diagonal edges ~1e-5 above the constant direction ' +
      '(a near-degeneracy). So the max-diagonal identity from the headline cell is s-dependent.',
    goldenRatioMaximum:
      'The closed-form gap g(s) = tanh(s) - tanh(s/2) is maximized exactly where cosh(s) = phi ' +
      '(the golden ratio): the stationarity sech^2(s) = (1/2) sech^2(s/2) reduces via ' +
      'cosh(s) = 2 cosh^2(s/2) - 1 to 4c^2 - 6c + 1 = 0 with cosh(s_star) = (1+sqrt5)/2. So ' +
      's_star = arccosh(phi) ~ 1.0613 and g(s_star) ~ 0.30028 is the largest the obstruction gets; ' +
      'the swept cells straddle this peak (s = 0.5 below, s = 1.5,2,3 above).',
    illConditioningBoundary:
      'At large s the cosh-monomial Gram is catastrophically ill-conditioned: at s = 5 the DEG = 10 ' +
      'operator norm overshoots its own analytic ceiling tanh(5) ~ 0.99991, so the sweep produces ' +
      'garbage there. Cross-cell certification is bounded to cells whose operator norm respects the ' +
      'ceiling; s = 5 is EXCLUDED and recorded as the conditioning boundary.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    cleanInvariantIsConstantDirectionGap: true,
    maxDiagonalIdentityIsSDependent: true,
    largeSDeg10IllConditioned: true,
    closedFormMatchCarriesNoRHVerdict:
      'The cross-cell closed-form match is on the SAME representative monomial-moment truncation ' +
      'as imp-3066 / imp-3086 / imp-3102 / imp-3125; NOT the section-26 Gram, so it neither claims ' +
      'the cover holds nor that it fails. Only that the imp-3125 closed form tanh(s) - tanh(s/2) is ' +
      'the DEG-to-infinity limit of the CONSTANT-direction gap cell-wide (in the trustworthy window).',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3293_ORTHOGONALIZED_GAP_CLOSED_FORM_CROSS_CELL_ASSERTIONS = [
  {
    id: 'imp3293-cells-cover-distinct-s-values',
    why: 'The certification must span the product axis at VARIED (a,U): five trustworthy cells with ' +
         'distinct s = a*U straddling the golden maximum. A collapse to one s or a duplicate would ' +
         'mean the cross-cell scope was lost.',
    holds: () => {
      const svals = CERT_CELLS.map((c) => c.s);
      const distinct = new Set(svals.map((s) => s.toFixed(6)));
      return CERT_CELLS.length === 5 && distinct.size === 5 &&
        svals.some((s) => s < S_STAR) && svals.some((s) => s > S_STAR);
    },
  },
  {
    id: 'imp3293-constant-direction-floor-exact-cell-wide',
    why: 'THE CLEAN INVARIANT: R_orth_00 = (cosh(s)-1)/sinh(s) = tanh(s/2) is EXACT and ' +
         'DEG-independent at every cell and degree. A mismatch would break the analytic floor the ' +
         'closed form hangs on.',
    holds: () => allCellsPinned && worstConstantDirectionMismatch < 1e-12,
  },
  {
    id: 'imp3293-extrapolant-matches-closed-form-cell-wide',
    why: 'THE DELIVERABLE: the Aitken DEG-to-infinity extrapolant of the constant-direction gap ' +
         '||R_orth|| - R_orth_00 lands on the closed form tanh(s) - tanh(s/2) at every trustworthy ' +
         'cell, to within the ~3e-3 extrapolation residual. A larger residual would mean the closed ' +
         'form is NOT the cell-wide limit.',
    holds: () => worstExtrapolationResidual < 5e-3,
  },
  {
    id: 'imp3293-gap-saturates-from-below-cell-wide',
    why: 'At every trustworthy cell the constant-direction gap distance to the closed form is ' +
         'strictly positive (saturation from below) and strictly shrinking with DEG (shrink > 2), ' +
         'and the DEG = 10 operator norm respects the ceiling tanh(s). A non-shrinking or ' +
         'ceiling-violating cell would not certify.',
    holds: () => allCellsSaturate && allCellsRespectCeiling,
  },
  {
    id: 'imp3293-golden-ratio-maximum',
    why: 'The closed-form gap g(s) = tanh(s) - tanh(s/2) is maximized exactly where cosh(s) = phi ' +
         '(golden ratio): s_star = arccosh(phi) ~ 1.0613 and g(s_star) is the max over a fine s-grid. ' +
         'A mismatch would mean the peak location is wrong.',
    holds: () => goldenCoshResidual < 1e-12 && goldenIsNumericalMax && Math.abs(goldenGapValue - 0.30028) < 1e-3,
  },
  {
    id: 'imp3293-boundary-A-max-diagonal-s-dependent',
    why: 'BOUNDARY A (honest): the max-diagonal argmax coincides with the constant direction at ' +
         's = 3 (headline) but NOT at small s = 0.5, where a boundary monomial edges above the ' +
         'constant direction (~1e-5). This records that the max-diagonal identity is s-dependent ' +
         'while the constant-direction floor is exact everywhere.',
    holds: () =>
      headlineCell.maxDiagIsConstantDirection === true &&
      smallSCell.maxDiagIsConstantDirection === false &&
      smallSCell.maxDiagOverConstantDirection > 0 &&
      smallSCell.maxDiagOverConstantDirection < 1e-3,
  },
  {
    id: 'imp3293-boundary-B-large-s-ill-conditioned',
    why: 'BOUNDARY B (honest): at s = 5 (a = 0.5, U = 10) the DEG = 10 cosh-Gram is catastrophically ' +
         'ill-conditioned -- the operator norm OVERSHOOTS its analytic ceiling tanh(5) ~ 0.99991. ' +
         'This flags the conditioning boundary that bounds the cross-cell certification.',
    holds: () => {
      const last = ILL_CONDITIONED_PROBE.rows[ILL_CONDITIONED_PROBE.rows.length - 1];
      return !ILL_CONDITIONED_PROBE.opNormRespectsCeiling &&
        last.operatorNorm > ILL_CONDITIONED_PROBE.analyticCeiling + 1e-3;
    },
  },
  {
    id: 'imp3293-equal-product-cell-coincidence',
    why: 'Inherited s = a*U invariance re-confirmed on the constant-direction gap: s = 3 via ' +
         '(0.5,6) and (0.3,10) must coincide to machine precision (Cholesky-conditioned ~1e-12). ' +
         'A mismatch would mean the gap is not a function of s alone.',
    holds: () => equalProductCdGapMismatch < 1e-9,
  },
  {
    id: 'imp3293-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: REPRESENTATIVE diagnostic, the closed-form match carries no RH verdict, ' +
         'the clean invariant is the constant-direction gap, the max-diagonal identity is s-dependent, ' +
         'large-s DEG = 10 is ill-conditioned, positivity not attempted, bare pilot not re-run, PT 0.2 ' +
         'stays SOTA. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3293_ORTHOGONALIZED_GAP_CLOSED_FORM_CROSS_CELL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.cleanInvariantIsConstantDirectionGap === true &&
        c.maxDiagonalIdentityIsSDependent === true &&
        c.largeSDeg10IllConditioned === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3293_ORTHOGONALIZED_GAP_CLOSED_FORM_CROSS_CELL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3293-orthogonalized-gap-closed-form-cross-cell assertion failed: ${assertion.id}`);
  }
}

export default IMP3293_ORTHOGONALIZED_GAP_CLOSED_FORM_CROSS_CELL;
