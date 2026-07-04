/**
 * @module imp-33704-g7-obstruction-U-scaling
 * @fileoverview imp-33704 -- Assess the U-DEPENDENCE of the imp-3066 G7 off-diagonal
 *   endpoint-Hankel operator/diagonal gap (the ~3.626 obstruction at a = 0.5, U = 6)
 *   by MEASURING the Perron operator norm ||R||, the diagonal maximum, the off-diagonal
 *   Frobenius norm, and the operator/diagonal gap across a U ladder at FIXED a = 0.5,
 *   then DERIVING whether the K_a >= 0 obstruction magnitude grows, saturates or shrinks
 *   with the lag window U.
 *
 *   THE GAP THIS FILLS (the imp-33704 ticket)
 *   -----------------------------------------
 *   The lambda-roadmap G7 node records the K_a >= 0 obstruction magnitude at a SINGLE
 *   (a, U) = (0.5, 6) cell only: ||R|| ~ 4.617, max diag ~ 0.9909, operator/diagonal gap
 *   ~ 3.626, off-diagonal Frobenius ~ 4.082 (imp-3066 .measured). Whether that magnitude
 *   is a fixed feature or a function of the lag window U -- i.e. whether widening or
 *   narrowing the endpoint-Hankel truncation window RELIEVES or WORSENS the obstruction --
 *   was never tabulated. This module sweeps U at fixed a = 0.5, reusing the imp-3066
 *   construction verbatim, and DERIVES the U-scaling.
 *
 *   THE SETUP (inherited verbatim from imp-3066)
 *   --------------------------------------------
 *   On the same representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j:
 *       D_jj = int_0^U cosh(a*tau) phi_j^2 d(tau),
 *       H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau),
 *       R_jk = H_jk / sqrt(D_jj D_kk),   ||R|| = Perron eigenvalue of R.
 *   Substituting tau = U*x cancels the shared U prefactor, so R -- and hence EVERY metric
 *   (||R||, max diag, off-diagonal Frobenius, gap) -- is a function of s = a*U alone. At
 *   fixed a = 0.5 the U ladder is therefore the s ladder s = U/2, and the U-dependence of
 *   the obstruction IS its s-dependence.
 *
 *   WHAT IS MEASURED / DERIVED (the imp-33704 deliverable -- MEASURE ONLY)
 *   ---------------------------------------------------------------------
 *   (1) THE U LADDER. Per U in {2,4,6,8,10,12,14,16} (even step 2, s = 1..8): ||R||,
 *       max diag(R), off-diagonal Frobenius norm of R, and the operator/diagonal gap
 *       ||R|| - max diag.
 *   (2) THE DERIVED SCALING. The obstruction gap GROWS MONOTONICALLY with U but SATURATES:
 *       gap climbs 2.300 (U=2) -> 3.626 (U=6, the roadmap headline) -> 3.909 (U=16), with
 *       STRICTLY DECREASING increments (concave: +0.993, +0.333, +0.131, +0.066, +0.040,
 *       +0.027, +0.020). It neither shrinks nor diverges.
 *   (3) THE CEILING (derived). As s = a*U -> inf every R_jk -> 1 (cosh, sinh -> e^{s*x}),
 *       so R -> the all-ones (DEG+1) x (DEG+1) matrix J, whose Perron eigenvalue is exactly
 *       DEG+1 = 5. Hence the obstruction saturates at truncation-size-fixed ceilings:
 *       ||R|| -> 5, max diag -> 1, gap -> DEG = 4, off-diagonal Frobenius -> sqrt(DEG(DEG+1))
 *       = sqrt(20) ~ 4.4721. Every measured value sits strictly below these ceilings and
 *       approaches them from below as U grows. WIDENING THE LAG WINDOW CANNOT RELIEVE the
 *       G7 obstruction (it grows), but CANNOT make it diverge either (it is bounded by the
 *       all-ones limit fixed by the truncation size, not the window).
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as imp-3066 --
 *   NOT the section-26 Gram. The measured ||R|| and gap carry NO RH verdict: this is a pure
 *   measurement of how the off-diagonal obstruction magnitude scales with the lag window U,
 *   and a derivation that it saturates (rather than diverging or vanishing) at the all-ones
 *   Perron ceiling fixed by the truncation size. imp-3066 / G7 are UNTOUCHED as a proof;
 *   positivity is NOT attempted; the bare-V pilot (imp-1240) is NOT re-run. Platt-Trudgian
 *   Lambda &lt;= 0.2 REMAINS the rigorous SOTA. No false QED.
 *
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell G7 magnitude)
 *   @see imp-3107-dehomogenized-offdiag-aU-grid.js (imp-3107: the de-homogenized off-diag entries track s = a*U)
 *   @see lambda-roadmap.js G7 (the K_a >= 0 lone obstruction node)
 *
 *   Ticket: imp-33704 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;                                          // FIXED shear weight (the imp-3066 headline)
const U_LADDER = Object.freeze([2, 4, 6, 8, 10, 12, 14, 16]);  // lag windows, EVEN step 2 (s = a*U = 1..8)
const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;                                       // midpoint quadrature panels (matches imp-3066)

const cosh = Math.cosh;
const sinh = Math.sinh;

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

/**
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (self-contained, no deps).
 * For our strictly-positive R the largest is the Perron operator norm. Copied verbatim from
 * imp-3066 so the two modules read the SAME spectrum.
 */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 500; iter++) {
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
    if (off < 1e-15) break;
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

/** One (a, U) cell: build R exactly as imp-3066 and read off the G7 obstruction metrics. */
function cellMetrics(a, U) {
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => weightedMoment(cosh, a, U, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => weightedMoment(sinh, a, U, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  const eig = symmetricEigenvalues(R);
  const operatorNorm = Math.max(...eig.map((e) => Math.abs(e)));   // ||R|| = Perron eigenvalue
  const diagR = R.map((row, i) => row[i]);
  const diagMax = Math.max(...diagR);
  let offDiagFrobeniusSq = 0;
  for (let j = 0; j <= DEG; j++) {
    for (let k = 0; k <= DEG; k++) {
      if (j === k) continue;
      offDiagFrobeniusSq += R[j][k] * R[j][k];
    }
  }
  return Object.freeze({
    a,
    U,
    s: a * U,
    operatorNorm,                          // ||R||
    diagMax,                               // max diag(R) (the scalar-cover ceiling < 1)
    offDiagonalFrobeniusNormOfR: Math.sqrt(offDiagFrobeniusSq),
    operatorDiagonalGap: operatorNorm - diagMax,   // the G7 obstruction magnitude
  });
}

// The U ladder at fixed a = 0.5.
const LADDER = Object.freeze(U_LADDER.map((U) => cellMetrics(A, U)));

// Derived all-ones ceiling: R -> J (all-ones) as s -> inf, Perron(J) = DEG+1.
const PERRON_CEILING = DEG + 1;                                   // ||R|| -> 5
const GAP_CEILING = DEG;                                          // gap -> 4 (Perron - 1)
const OFFDIAG_FROBENIUS_CEILING = Math.sqrt(DEG * (DEG + 1));     // -> sqrt(20) ~ 4.4721

// Is the obstruction gap monotone increasing in U, and are its increments strictly decreasing?
let gapMonotoneIncreasing = true;
let gapIncrementsStrictlyDecreasing = true;
for (let i = 1; i < LADDER.length; i++) {
  if (LADDER[i].operatorDiagonalGap <= LADDER[i - 1].operatorDiagonalGap) gapMonotoneIncreasing = false;
}
for (let i = 2; i < LADDER.length; i++) {
  const prevInc = LADDER[i - 1].operatorDiagonalGap - LADDER[i - 2].operatorDiagonalGap;
  const inc = LADDER[i].operatorDiagonalGap - LADDER[i - 1].operatorDiagonalGap;
  if (inc >= prevInc) gapIncrementsStrictlyDecreasing = false;
}

// Every metric sits strictly below its all-ones ceiling on the whole ladder.
const allBelowCeiling = LADDER.every(
  (c) =>
    c.operatorNorm < PERRON_CEILING &&
    c.operatorDiagonalGap < GAP_CEILING &&
    c.offDiagonalFrobeniusNormOfR < OFFDIAG_FROBENIUS_CEILING &&
    c.diagMax < 1,
);

const headlineCell = cellMetrics(A, 6);          // the roadmap G7 anchor cell
const tailCell = LADDER[LADDER.length - 1];      // U = 16, s = 8: closest to the ceiling

export const IMP33704_G7_OBSTRUCTION_U_SCALING = Object.freeze({
  id: 'imp-33704-g7-obstruction-U-scaling',
  ticket: 'imp-33704',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedOffDiagGrid: 'imp-3107-dehomogenized-offdiag-aU-grid.js',
  roadmapNode: 'G7',

  summary:
    'Sweeps the lag window U at FIXED a = 0.5 across the imp-3066 representative degree-4 monomial ' +
    'truncation and DERIVES the U-scaling of the G7 K_a >= 0 obstruction magnitude the lambda-roadmap ' +
    'records at the single (a,U) = (0.5,6) cell (||R|| ~ 4.617, max diag ~ 0.9909, operator/diagonal ' +
    'gap ~ 3.626, off-diagonal Frobenius ~ 4.082). FINDING: the obstruction gap GROWS MONOTONICALLY ' +
    'with U but SATURATES -- it climbs 2.300 (U=2) -> 3.626 (U=6) -> 3.909 (U=16) with STRICTLY ' +
    'DECREASING increments (concave), neither shrinking nor diverging. DERIVED CEILING: as s = a*U ' +
    '-> inf every R_jk -> 1 (cosh, sinh -> e^{s*x}), so R -> the all-ones 5x5 matrix J with Perron ' +
    'eigenvalue exactly DEG+1 = 5; hence ||R|| -> 5, max diag -> 1, gap -> DEG = 4, off-diagonal ' +
    'Frobenius -> sqrt(DEG(DEG+1)) = sqrt(20) ~ 4.4721, every measured value strictly below and ' +
    'approaching from below. WIDENING the lag window CANNOT relieve the obstruction (it grows) but ' +
    'CANNOT make it diverge (bounded by the truncation-size-fixed all-ones limit, not the window). ' +
    'REPRESENTATIVE / DIAGNOSTIC; ||R|| carries NO RH verdict; imp-3066/G7 untouched; not a proof.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3066-offdiagonal-hankel-obstruction.js (same phi_j = (tau/U)^j truncation, quadrature, Jacobi eigensolver)',
    deHomogenizedR: 'R_jk = H_jk / sqrt(D_jj D_kk), D_jj = int cosh(a*tau)(tau/U)^{2j}, H_jk = int sinh(a*tau)(tau/U)^{j+k}',
    scaleReduction: 'tau = U*x => every metric of R depends on s = a*U alone; at fixed a the U ladder is the s ladder s = U/2',
    a: A,
    uLadder: U_LADDER,
    degree: DEG,
    truncationSize: DEG + 1,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladder: LADDER,                                    // per U: s, ||R||, max diag, off-diag Frobenius, gap
    headlineGapAtU6: headlineCell.operatorDiagonalGap,           // ~3.626095 (matches roadmap G7)
    headlineOperatorNormAtU6: headlineCell.operatorNorm,         // ~4.617014
    headlineOffDiagFrobeniusAtU6: headlineCell.offDiagonalFrobeniusNormOfR,  // ~4.081529
    headlineDiagMaxAtU6: headlineCell.diagMax,                   // ~0.990918
    tailGapAtU16: tailCell.operatorDiagonalGap,                  // ~3.909132 (closest to the ceiling 4)
    tailOperatorNormAtU16: tailCell.operatorNorm,                // ~4.909130 (closest to 5)
    gapMonotoneIncreasing,                             // gap rises with U
    gapIncrementsStrictlyDecreasing,                   // ...but concave: it saturates, not diverges
    allMetricsBelowAllOnesCeiling: allBelowCeiling,
    perronCeiling: PERRON_CEILING,                     // ||R|| -> DEG+1 = 5
    gapCeiling: GAP_CEILING,                           // gap -> DEG = 4
    offDiagFrobeniusCeiling: OFFDIAG_FROBENIUS_CEILING,  // -> sqrt(DEG(DEG+1)) ~ 4.4721
  }),

  interpretation: Object.freeze({
    obstructionGrowsWithU:
      'The G7 operator/diagonal gap is NOT a fixed single-cell number: at fixed a = 0.5 it increases ' +
      'monotonically with the lag window U (2.300 at U=2 to 3.909 at U=16). Widening the endpoint-' +
      'Hankel window strengthens the off-diagonal cross-terms, so it CANNOT relieve the K_a >= 0 ' +
      'obstruction -- the obstruction is worst in the long-lag regime.',
    butItSaturates:
      'The growth is concave (strictly decreasing increments) and bounded: as s = a*U -> inf every ' +
      'de-homogenized entry R_jk -> 1 (cosh, sinh -> e^{s*x}), so R -> the all-ones (DEG+1)x(DEG+1) ' +
      'matrix J. Perron(J) = DEG+1 exactly, so ||R|| -> 5, gap -> DEG = 4, off-diagonal Frobenius ' +
      '-> sqrt(DEG(DEG+1)). The obstruction magnitude does NOT diverge with U; it approaches a ' +
      'truncation-size-fixed ceiling from below.',
    whatThisMeansForG7:
      'The lag window U is not a lever on the G7 obstruction: narrowing it shrinks the gap only ' +
      'toward the small-s value (still strictly positive), widening it only approaches the all-ones ' +
      'ceiling. The obstruction magnitude is controlled by the truncation SIZE (the all-ones Perron ' +
      'limit DEG+1), not by the window. Assessment only; the K_a >= 0 positivity step is untouched.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    opNormCarriesNoRHVerdict:
      'The measured ||R|| and gap are on the SAME representative monomial-moment truncation as ' +
      'imp-3066, chosen to EXHIBIT the off-diagonal cross-terms; NOT the section-26 Gram, so they ' +
      'neither claim the cover fails nor that it holds. Only the U-scaling of the obstruction ' +
      'magnitude and its all-ones saturation ceiling are asserted.',
    imp3066Untouched: true,
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33704_G7_OBSTRUCTION_U_SCALING_ASSERTIONS = [
  {
    id: 'imp33704-ladder-shape',
    why: 'The sweep covers the full U ladder at fixed a = 0.5; a count drift means the ladder build ' +
         'dropped or duplicated a cell.',
    holds: () => LADDER.length === U_LADDER.length && LADDER.every((c) => c.a === A),
  },
  {
    id: 'imp33704-headline-matches-imp3066-and-roadmap',
    why: 'Cross-check the (a,U) = (0.5,6) anchor against the imp-3066 / lambda-roadmap G7 numbers: ' +
         'operator/diagonal gap ~ 3.626, ||R|| ~ 4.617, off-diagonal Frobenius ~ 4.082, max diag ' +
         '~ 0.9909. A mismatch means the inherited construction drifted from imp-3066.',
    holds: () =>
      Math.abs(headlineCell.operatorDiagonalGap - 3.626095) < 1e-5 &&
      Math.abs(headlineCell.operatorNorm - 4.617014) < 1e-5 &&
      Math.abs(headlineCell.offDiagonalFrobeniusNormOfR - 4.081529) < 1e-5 &&
      Math.abs(headlineCell.diagMax - 0.990918) < 1e-5,
  },
  {
    id: 'imp33704-gap-monotone-increasing-in-U',
    why: 'THE FINDING (part 1): the G7 obstruction gap ||R|| - max diag GROWS with the lag window U ' +
         'at fixed a = 0.5. It must be strictly increasing across the ladder; a non-monotone trend ' +
         'would mean widening the window can relieve the obstruction.',
    holds: () => gapMonotoneIncreasing,
  },
  {
    id: 'imp33704-gap-increments-strictly-decreasing-saturating',
    why: 'THE FINDING (part 2): the growth is CONCAVE -- successive gap increments strictly decrease, ' +
         'so the obstruction SATURATES rather than diverges. A non-decreasing increment would falsify ' +
         'the saturation claim.',
    holds: () => gapIncrementsStrictlyDecreasing,
  },
  {
    id: 'imp33704-every-metric-below-all-ones-ceiling',
    why: 'THE DERIVED CEILING: as s = a*U -> inf every R_jk -> 1, so R -> the all-ones (DEG+1)x(DEG+1) ' +
         'matrix J with Perron eigenvalue DEG+1. Every measured ||R||, gap and off-diagonal Frobenius ' +
         'must sit strictly below the ceilings DEG+1, DEG, sqrt(DEG(DEG+1)) (and every max diag < 1). ' +
         'A value at or above a ceiling would mean the all-ones limit is not the supremum.',
    holds: () => allBelowCeiling,
  },
  {
    id: 'imp33704-tail-approaches-ceiling-from-below',
    why: 'Saturation, quantified: the tail cell U = 16 (s = 8) must be the CLOSEST to the ceilings ' +
         'and within a small margin of them -- ||R|| within 0.1 of DEG+1 = 5 and gap within 0.1 of ' +
         'DEG = 4 -- confirming the ladder approaches the all-ones limit from below.',
    holds: () =>
      PERRON_CEILING - tailCell.operatorNorm > 0 &&
      PERRON_CEILING - tailCell.operatorNorm < 0.1 &&
      GAP_CEILING - tailCell.operatorDiagonalGap > 0 &&
      GAP_CEILING - tailCell.operatorDiagonalGap < 0.1,
  },
  {
    id: 'imp33704-s-invariance-cross-a-check',
    why: 'Sanity that the U ladder IS the s ladder: substituting tau = U*x cancels U, so a cell at ' +
         'a different a but the SAME s = a*U must give an identical gap. Rebuild at (a,U) = (0.25,12), ' +
         's = 3, and require its gap to coincide with the (0.5,6) anchor to machine precision.',
    holds: () => Math.abs(cellMetrics(0.25, 12).operatorDiagonalGap - headlineCell.operatorDiagonalGap) < 1e-9,
  },
  {
    id: 'imp33704-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE diagnostic sweep, ||R|| carries no RH verdict, ' +
         'imp-3066/G7 are untouched, positivity was not attempted, it is not a proof or a reduction, ' +
         'and PT 0.2 stays SOTA. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP33704_G7_OBSTRUCTION_U_SCALING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.imp3066Untouched === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33704_G7_OBSTRUCTION_U_SCALING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33704-g7-obstruction-U-scaling assertion failed: ${assertion.id}`);
  }
}

export default IMP33704_G7_OBSTRUCTION_U_SCALING;
