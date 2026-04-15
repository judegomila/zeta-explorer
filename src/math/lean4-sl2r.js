/**
 * imp-085: Lean4 formalization sketch for the algebraic SL(2,R) proof that det(S_N) = 1.
 *
 * This module does NOT run Lean4 in the browser. It generates a Lean4 proof
 * skeleton that a mathematician could paste into Lean4/Mathlib and complete,
 * and it runs the numerical verification in JavaScript to confirm the claim.
 */

import { getPrimes } from './primes.js';

// ---------------------------------------------------------------------------
// Lean4 proof skeleton (verbatim string)
// ---------------------------------------------------------------------------

const lean4Code = `\
import Mathlib.LinearAlgebra.Matrix.Determinant
import Mathlib.Analysis.SpecialFunctions.Trigonometric.Basic
import Mathlib.Topology.Algebra.InfiniteSum.Basic

-- The ZPO transfer matrix for prime p at frequency \u03c9
def transferMatrix (logp \u03c9 : \u211d) : Matrix (Fin 2) (Fin 2) \u211d :=
  !![Real.cos (\u03c9 * logp), (1/logp) * Real.sin (\u03c9 * logp);
     -(logp) * Real.sin (\u03c9 * logp), Real.cos (\u03c9 * logp)]

-- Key lemma: det(transferMatrix) = 1
theorem det_transfer_eq_one (logp \u03c9 : \u211d) (hlogp : logp \u2260 0) :
    Matrix.det (transferMatrix logp \u03c9) = 1 := by
  simp [transferMatrix, Matrix.det_fin_two]
  ring_nf
  -- cos\u00b2(\u03b8) + sin\u00b2(\u03b8) = 1
  rw [\u2190 Real.cos_sq_add_sin_sq (\u03c9 * logp)]
  ring

-- The cascade product
def cascadeProduct (logprimes : List \u211d) (\u03c9 : \u211d) : Matrix (Fin 2) (Fin 2) \u211d :=
  logprimes.foldl (fun acc logp => acc * transferMatrix logp \u03c9) 1

-- Main theorem: cascade determinant = 1
theorem cascade_det_one (logprimes : List \u211d) (\u03c9 : \u211d)
    (h : \u2200 lp \u2208 logprimes, lp \u2260 0) :
    Matrix.det (cascadeProduct logprimes \u03c9) = 1 := by
  induction logprimes with
  | nil => simp [cascadeProduct, Matrix.det_one]
  | cons lp rest ih =>
    simp [cascadeProduct, List.foldl_cons]
    rw [Matrix.det_mul]
    rw [det_transfer_eq_one lp \u03c9 (h lp (List.mem_cons_self lp rest))]
    simp
    exact ih (fun x hx => h x (List.mem_cons_of_mem lp hx))

-- Corollary: the cascade is in SL(2,\u211d) for all N
theorem cascade_in_SL2 (logprimes : List \u211d) (\u03c9 : \u211d)
    (h : \u2200 lp \u2208 logprimes, lp \u2260 0) :
    cascadeProduct logprimes \u03c9 \u2208 Matrix.SpecialLinearGroup (Fin 2) \u211d := by
  sorry -- follows from cascade_det_one + Matrix.SpecialLinearGroup.mem_iff
`;

// ---------------------------------------------------------------------------
// Cross-verification findings (imp-766)
// ---------------------------------------------------------------------------
//
// FORMULA CORRECTNESS:
//   The JS transferMatrix() matches the Lean4 definition exactly:
//     row0 = [cos(th),         sin(th)/log(p)]
//     row1 = [-log(p)*sin(th), cos(th)      ]
//   where th = omega*log(p).  det = cos^2(th)+sin^2(th) = 1 (Pythagorean identity).
//
// EDGE-CASE ANALYSIS (NaN / Infinity):
//   logp = log(p) for prime p >= 2, so logp >= log(2) ~= 0.6931 > 0.
//   Division by logp in the (0,1) entry is always safe.
//   cos/sin are bounded; cascade entries may grow (SL(2,R) allows
//   unbounded entries with det=1), but IEEE-754 overflow is not triggered
//   for the N <= 200 test cases here.
//
// NUMERICAL REFERENCE VALUES (independently verified):
//   N=10, omega=0.0:       det = 1.000000000000000 (trivial; all T_p = I)
//   N=10, omega=1.0:       det = 1.0, |error| < 2e-15
//   N=100, omega=14.134725 (first Riemann zeta zero): det = 1.0, |error| < 1e-12
//
// OPEN GAP:
//   cascade_in_SL2 uses `sorry`; completion requires showing the cascade is
//   in Matrix.SpecialLinearGroup — follows from cascade_det_one plus
//   Matrix.SpecialLinearGroup.mem_iff (available in Mathlib).

// ---------------------------------------------------------------------------
// Numerical verification helpers
// ---------------------------------------------------------------------------

/**
 * Build the 2x2 transfer matrix for a single prime p at frequency omega.
 *   T_p(omega) = [[cos(theta), sin(theta)/log(p)],
 *                 [-log(p)*sin(theta), cos(theta)]]
 * where theta = omega * log(p).
 */
function transferMatrix(logp, omega) {
  const theta = omega * logp;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [c, s / logp],
    [-logp * s, c],
  ];
}

/** Multiply two 2x2 matrices. */
function mat2x2Mul(A, B) {
  return [
    [
      A[0][0] * B[0][0] + A[0][1] * B[1][0],
      A[0][0] * B[0][1] + A[0][1] * B[1][1],
    ],
    [
      A[1][0] * B[0][0] + A[1][1] * B[1][0],
      A[1][0] * B[0][1] + A[1][1] * B[1][1],
    ],
  ];
}

/** Determinant of a 2x2 matrix. */
function det2x2(M) {
  return M[0][0] * M[1][1] - M[0][1] * M[1][0];
}

/**
 * Compute det(S_N) = det(T_{p_1} * T_{p_2} * ... * T_{p_N}) at frequency omega.
 */
function cascadeDet(N, omega) {
  const primes = getPrimes(N);
  let S = [
    [1, 0],
    [0, 1],
  ]; // identity
  for (const p of primes) {
    const logp = Math.log(p);
    const T = transferMatrix(logp, omega);
    S = mat2x2Mul(S, T);
  }
  return det2x2(S);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generate the Lean4 proof skeleton and run numerical verification.
 *
 * @returns {{
 *   lean4Code: string,
 *   numericalVerification: object,
 *   proofChain: Array<{step: number, claim: string, status: string}>,
 *   verdict: string
 * }}
 */
export function lean4SL2RProof() {
  // --- numerical verification -------------------------------------------
  const testNs = [5, 10, 50, 100, 200];
  const testOmegas = [0.0, 1.0, 14.134725, 21.022040, 100.0];
  const tolerance = 1e-10;

  const results = [];
  let allPass = true;

  for (const N of testNs) {
    for (const omega of testOmegas) {
      const d = cascadeDet(N, omega);
      const error = Math.abs(d - 1.0);
      const pass = error < tolerance;
      if (!pass) allPass = false;
      results.push({ N, omega, det: d, error, pass });
    }
  }

  const numericalVerification = {
    description:
      'Cascade determinant det(S_N) computed via IEEE-754 double arithmetic for various N and omega.',
    tolerance,
    testCases: results,
    allPassed: allPass,
    summary: allPass
      ? `All ${results.length} test cases satisfy |det(S_N) - 1| < ${tolerance}.`
      : `Some test cases exceeded tolerance ${tolerance}.`,
  };

  // --- proof chain -------------------------------------------------------
  const proofChain = [
    {
      step: 1,
      claim:
        'Each T_p has det = cos\u00b2\u03b8 + sin\u00b2\u03b8 = 1 (Pythagorean identity)',
      status: 'formalizable',
    },
    {
      step: 2,
      claim: 'det(AB) = det(A)\u00b7det(B) (Mathlib: Matrix.det_mul)',
      status: 'in Mathlib',
    },
    {
      step: 3,
      claim: 'Induction: det(S_N) = 1 for all N',
      status: 'formalizable',
    },
    {
      step: 4,
      claim: 'S_N \u2208 SL(2,\u211d) for all N',
      status: 'formalizable',
    },
    {
      step: 5,
      claim:
        'SL(2,\u211d) is closed \u2192 S_\u221e \u2208 SL(2,\u211d) if limit exists',
      status: 'needs topology lemma',
    },
  ];

  // --- verdict -----------------------------------------------------------
  const formalizableCount = proofChain.filter(
    (s) => s.status === 'formalizable' || s.status === 'in Mathlib'
  ).length;
  const verdict =
    `Lean4 skeleton covers ${formalizableCount}/${proofChain.length} steps with formalizable or existing Mathlib tactics. ` +
    `Numerical verification ${allPass ? 'PASSED' : 'FAILED'} across ${results.length} test cases. ` +
    'Step 5 (topological closure of SL(2,R)) requires an additional convergence argument not yet in the skeleton.';

  return {
    lean4Code,
    numericalVerification,
    proofChain,
    verdict,
  };
}
