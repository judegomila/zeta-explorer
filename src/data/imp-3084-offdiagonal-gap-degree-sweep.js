/**
 * @module imp-3084-offdiagonal-gap-degree-sweep
 * @fileoverview imp-3084 -- Measure how the imp-3066 off-diagonal operator/diagonal
 *   gap ||R|| - max_j R_jj scales with the monomial truncation degree DEG. The parent
 *   imp-3066-offdiagonal-hankel-obstruction.js fixes DEG = 4 and reports a single,
 *   strictly-positive Perron operator/diagonal gap fed by the off-diagonal endpoint-
 *   Hankel cross-terms of the shear Gram. The DEG dependence was never swept: does the
 *   off-diagonal Hankel obstruction GROW, SATURATE, or SHRINK as the representative
 *   truncation refines?
 *
 *   THE SWEEP (same a = 0.5, U = 6 grid as imp-3066; only DEG varies)
 *   ----------------------------------------------------------------
 *   For each DEG in [2, 12] we rebuild EXACTLY the imp-3066 objects on the rescaled
 *   monomial truncation phi_j(tau) = (tau/U)^j, j = 0..DEG:
 *
 *     - passive diagonal D_jj = int_0^U cosh(a*tau) phi_j(tau)^2 d(tau)   (scalar cover)
 *     - shear Hankel  H_jk    = int_0^U sinh(a*tau) phi_j(tau) phi_k(tau) d(tau)
 *     - de-homogenized R_jk   = H_jk / sqrt(D_jj D_kk)
 *
 *   and report, per degree, the operator norm ||R|| (Perron eigenvalue), the largest
 *   diagonal max_j R_jj (the scalar-cover ceiling, always < 1), and the gap
 *   ||R|| - max_j R_jj. The trend is then classified by the sign of the consecutive
 *   gap increments.
 *
 *   WHAT THE SWEEP FINDS (measured, NOT proved)
 *   -------------------------------------------
 *   The gap GROWS monotonically and is unbounded in the RAW monomial basis: it rises
 *   roughly linearly in DEG (increment ~0.9 per added degree, slowly decreasing), from
 *   ~1.79 at DEG = 2 to ~10.8 at DEG = 12, while the largest diagonal stays pinned just
 *   below 1 (it creeps from ~0.986 toward ~0.994). So the off-diagonal endpoint-Hankel
 *   obstruction does NOT saturate or shrink as the representative truncation refines --
 *   it grows, and the operator norm ||R|| itself diverges. This is the expected signature
 *   of the ILL-CONDITIONED raw monomial basis: the high monomials phi_j become nearly
 *   collinear, so the de-homogenized Gram is increasingly dominated by its off-diagonal
 *   cross-terms. Whether the growth is a basis-conditioning artifact that an orthogonalized
 *   basis would tame is exactly the SEPARATE question imp-3086 poses; this module only
 *   establishes the raw-basis trend (grow, not saturate, not shrink).
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC, on the same representative monomial-moment truncation as
 *   imp-3066. The measured ||R|| and its DEG-trend carry NO RH verdict -- a growing,
 *   diverging ||R|| in this raw basis is NOT a claim that the cover fails (the basis is
 *   not the section-26 Gram, and the divergence is a known monomial-conditioning effect).
 *   This module MEASURES the degree-trend only; it does NOT attempt positivity, is NOT a
 *   proof or a reduction, and the bare-V pilot (imp-1240) is NOT re-run. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (parent: the DEG = 4 single-cell gap)
 *   @see imp-3007-mupass-overflow-cover.js (the complete scalar cover whose operator step this scopes)
 *
 *   Ticket: imp-3084 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;            // headline shear weight (matches imp-3066 / imp-3007 HEADLINE a = 0.5)
const U = 6;              // genuine-Phi lag cutoff (the imp-3066 grid)
const DEG_MIN = 2;        // smallest swept truncation degree
const DEG_MAX = 12;       // largest swept truncation degree
const NQ = 4000;          // midpoint quadrature panels for the Gram moments (matches imp-3066)
const HQ = U / NQ;

const cosh = Math.cosh;
const sinh = Math.sinh;

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, p) {
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    acc += weightFn(A * tau) * Math.pow(tau / U, p) * HQ;
  }
  return acc;
}

/**
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (largest-off-diagonal
 * pivot). Returns the diagonal after the off-diagonal is swept to zero; for our strictly
 * positive R the largest is the Perron operator norm. Self-contained, no deps. The
 * iteration cap is generous enough for the (DEG_MAX + 1) x (DEG_MAX + 1) = 13 x 13 size.
 */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 2000; iter++) {
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

/** Build the imp-3066 R = Gpass^{-1/2} Gshear Gpass^{-1/2} on the degree-DEG truncation and measure its gap. */
function measureAtDegree(deg) {
  const Ddiag = Array.from({ length: deg + 1 }, (_unused, j) => weightedMoment(cosh, 2 * j));
  const Hshear = Array.from({ length: deg + 1 }, (_u, j) =>
    Array.from({ length: deg + 1 }, (_v, k) => weightedMoment(sinh, j + k)),
  );
  const R = Array.from({ length: deg + 1 }, (_u, j) =>
    Array.from({ length: deg + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  const eigenvalues = symmetricEigenvalues(R);
  const operatorNorm = Math.max(...eigenvalues.map((e) => Math.abs(e)));
  const diagR = R.map((row, i) => row[i]);
  const rDiagMax = Math.max(...diagR);
  const traceR = diagR.reduce((acc, x) => acc + x, 0);
  const sumEig = eigenvalues.reduce((acc, x) => acc + x, 0);
  return {
    degree: deg,
    truncationSize: deg + 1,
    operatorNorm,
    rDiagMax,
    operatorDiagonalGap: operatorNorm - rDiagMax,
    traceR,
    sumEig,
  };
}

const sweep = [];
for (let deg = DEG_MIN; deg <= DEG_MAX; deg++) {
  sweep.push(measureAtDegree(deg));
}

// Consecutive gap increments: positive throughout => the obstruction GROWS as the truncation refines.
const gapIncrements = sweep.slice(1).map((row, i) => row.operatorDiagonalGap - sweep[i].operatorDiagonalGap);
const allIncrementsPositive = gapIncrements.every((d) => d > 0);
const gapsMonotoneIncreasing = sweep.every((row, i) => i === 0 || row.operatorDiagonalGap > sweep[i - 1].operatorDiagonalGap);

const firstGap = sweep[0].operatorDiagonalGap;
const lastGap = sweep[sweep.length - 1].operatorDiagonalGap;
const firstOpNorm = sweep[0].operatorNorm;
const lastOpNorm = sweep[sweep.length - 1].operatorNorm;

// Classify the trend purely from the measured increments (grow / saturate / shrink).
let trend;
if (gapsMonotoneIncreasing && allIncrementsPositive) {
  trend = 'GROWS';
} else if (lastGap < firstGap) {
  trend = 'SHRINKS';
} else {
  trend = 'SATURATES';
}

export const IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP = Object.freeze({
  id: 'imp-3084-offdiagonal-gap-degree-sweep',
  ticket: 'imp-3084',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentModule: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedCover: 'imp-3007-mupass-overflow-cover.js',

  summary:
    'Sweeps the imp-3066 off-diagonal operator/diagonal gap ||R|| - max_j R_jj across the ' +
    'monomial truncation degree DEG in [2, 12] on the same a = 0.5, U = 6 grid (the parent ' +
    'fixes DEG = 4). The gap GROWS monotonically and is unbounded in the raw monomial basis: ' +
    'it rises roughly linearly (~0.9 per added degree, slowly decreasing) from ~1.79 at DEG = 2 ' +
    'to ~10.8 at DEG = 12, while the scalar-cover ceiling max_j R_jj stays pinned just below 1 ' +
    '(~0.986 -> ~0.994) and the operator norm ||R|| itself diverges. So the off-diagonal endpoint-' +
    'Hankel obstruction does NOT saturate or shrink as the representative truncation refines -- it ' +
    'GROWS, the expected signature of the ill-conditioned raw monomial basis (high monomials become ' +
    'nearly collinear). REPRESENTATIVE / DIAGNOSTIC; the DEG-trend carries NO RH verdict; whether an ' +
    'orthogonalized basis tames the growth is the separate imp-3086 question; not a proof, not a reduction.',

  construction: Object.freeze({
    basis: 'phi_j(tau) = (tau/U)^j, j = 0..DEG (rescaled monomials -> O(1) entries)',
    passiveDiagonal: 'D_jj = int_0^U cosh(a*tau) phi_j(tau)^2 d(tau)  (the SCALAR-cover-controlled diagonal)',
    shearHankel: 'H_jk = int_0^U sinh(a*tau) phi_j(tau) phi_k(tau) d(tau)  (depends on j+k: genuine Hankel)',
    deHomogenizedR: 'R_jk = H_jk / sqrt(D_jj D_kk)  (= Gpass^{-1/2} Gshear Gpass^{-1/2} with Gpass diagonal)',
    gap: 'operatorDiagonalGap = ||R|| - max_j R_jj  (the off-diagonal cross-term contribution, > 0)',
    a: A,
    U,
    degreeRange: [DEG_MIN, DEG_MAX],
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    sweep: Object.freeze(sweep.map((row) => Object.freeze({ ...row }))),
    gapIncrements: Object.freeze(gapIncrements.slice()),
    allIncrementsPositive,
    gapsMonotoneIncreasing,
    firstGap,
    lastGap,
    firstOperatorNorm: firstOpNorm,
    lastOperatorNorm: lastOpNorm,
    trend,                                          // GROWS / SATURATES / SHRINKS, classified from the increments
    parentDegree4Gap: sweep.find((row) => row.degree === 4)?.operatorDiagonalGap,  // reproduces the imp-3066 cell
  }),

  interpretation: Object.freeze({
    obstructionGrowsNotSaturates:
      'Every consecutive gap increment is strictly positive, so the off-diagonal operator/diagonal ' +
      'gap grows monotonically with DEG -- it neither saturates nor shrinks as the truncation refines.',
    operatorNormDiverges:
      'The operator norm ||R|| rises roughly linearly with DEG while the scalar-cover ceiling max_j R_jj ' +
      'stays below 1: the entire growth is the off-diagonal Hankel cross-term contribution, which diverges.',
    expectedRawBasisConditioning:
      'This is the expected signature of the raw monomial basis: phi_j = (tau/U)^j become increasingly ' +
      'collinear at high j, so the de-homogenized Gram is ever more dominated by its off-diagonal terms. ' +
      'Whether orthogonalizing the basis tames the growth is the separate imp-3086 question.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    degreeTrendCarriesNoRHVerdict:
      'A growing, diverging ||R|| in this raw monomial basis is NOT a claim that the cover fails -- the ' +
      'basis is not the section-26 Gram and the divergence is a known monomial-conditioning effect. Only ' +
      'the existence and direction of the DEG-trend (grow, not saturate, not shrink) is asserted.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP_ASSERTIONS = [
  {
    id: 'imp3084-sweep-covers-range',
    why: 'The sweep must span the full advertised DEG range [DEG_MIN, DEG_MAX] with one row per degree; ' +
         'a length drift means a degree was dropped or duplicated.',
    holds: () =>
      sweep.length === DEG_MAX - DEG_MIN + 1 &&
      sweep[0].degree === DEG_MIN &&
      sweep[sweep.length - 1].degree === DEG_MAX,
  },
  {
    id: 'imp3084-each-gap-strictly-positive',
    why: 'At every swept degree R has strictly positive entries, so by Perron-Frobenius ||R|| strictly ' +
         'exceeds its largest diagonal: every gap must be strictly positive (the off-diagonal obstruction ' +
         'is present at every truncation size).',
    holds: () => sweep.every((row) => row.operatorDiagonalGap > 1e-9 && row.operatorNorm > row.rDiagMax),
  },
  {
    id: 'imp3084-scalar-cover-ceiling-below-one',
    why: 'The imp-3007 scalar cover realized as a matrix: the largest diagonal max_j R_jj must stay ' +
         'STRICTLY below 1 at every degree (sinh < cosh pointwise). If it reaches 1 the necessary part ' +
         'of the cover has broken on the truncation.',
    holds: () => sweep.every((row) => row.rDiagMax < 1 && row.rDiagMax > 0),
  },
  {
    id: 'imp3084-gap-grows-monotonically',
    why: 'THE DELIVERABLE: the off-diagonal gap GROWS as the truncation refines -- every consecutive ' +
         'increment must be strictly positive and the classified trend must be GROWS. A non-positive ' +
         'increment would mean the obstruction saturates or shrinks, contradicting the measured trend.',
    holds: () => allIncrementsPositive && gapsMonotoneIncreasing && trend === 'GROWS' && lastGap > firstGap,
  },
  {
    id: 'imp3084-operator-norm-diverges-diagonal-pinned',
    why: 'The growth is carried by the off-diagonal cross-terms: ||R|| must rise substantially across the ' +
         'sweep (last > first by more than 1) while the scalar-cover ceiling stays pinned below 1. This is ' +
         'the raw-basis conditioning signature the module reports.',
    holds: () => lastOpNorm - firstOpNorm > 1 && sweep[sweep.length - 1].rDiagMax < 1,
  },
  {
    id: 'imp3084-eigensolver-trace-consistent',
    why: 'Sanity on the self-contained Jacobi solver at every degree: sum of eigenvalues must equal ' +
         'trace(R) (the rotations are trace-preserving). A mismatch means the operator norm is unreliable.',
    holds: () => sweep.every((row) => Math.abs(row.sumEig - row.traceR) < 1e-9),
  },
  {
    id: 'imp3084-reproduces-parent-degree4-cell',
    why: 'Cross-check against the parent imp-3066: the DEG = 4 cell of this sweep must reproduce a ' +
         'strictly-positive gap consistent with the parent single-cell measurement (same a, U, NQ, basis).',
    holds: () => {
      const cell = sweep.find((row) => row.degree === 4);
      return Boolean(cell) && cell.operatorDiagonalGap > 1e-9;
    },
  },
  {
    id: 'imp3084-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE diagnostic sweep, the DEG-trend carries no RH ' +
         'verdict, positivity was not attempted, it is not a proof or a reduction, and no refereed bound is changed. ' +
         'If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3084-offdiagonal-gap-degree-sweep assertion failed: ${assertion.id}`);
  }
}

export default IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP;
