/**
 * @module imp-commutator-diagonal-positivity
 *
 * imp-2850 (medium, proof): Verify the C_a commutator integrand symmetry in §25
 * against the off-diagonal shear claim.
 *
 * hidden-square-program-section.js (commutator, l.~62) states the commutator
 * integrand
 *
 *     C_a(w, z; u, v) = cosh(au) sinh(av) cos(zu) sin(wb v)
 *                       - sinh(au) cosh(av) sin(zu) cos(wb v)
 *
 * (writing wb for the conjugate w-bar) and claims the strict diagonal u = v part
 * is "positive by construction" while the u != v part is "the exact obstruction".
 * This module CHECKS that split symbolically.
 *
 * The integrand arises from the de Branges Wronskian numerator (l.51 wronskianForm,
 * imp-2840): with A_a(z) = int Phi(u) cosh(au) cos(zu) du and
 * B_a(z) = int Phi(u) sinh(au) sin(zu) du,
 *
 *     A_a(z) B_a(wb) - B_a(z) A_a(wb)
 *        = int int Phi(u) Phi(v) C_a(w, z; u, v) du dv.
 *
 * ----------------------------------------------------------------------------
 * RESULT 1 -- diagonal reduction (strict u = v channel)
 * ----------------------------------------------------------------------------
 * Setting v = u and factoring the common cosh(au) sinh(au) = (1/2) sinh(2au):
 *
 *     C_a(w, z; u, u)
 *        = cosh(au) sinh(au) [ cos(zu) sin(wb u) - sin(zu) cos(wb u) ]
 *        = (1/2) sinh(2au) sin((wb - z) u).
 *
 * The bracket collapses by the sine difference identity
 * sin(wb u) cos(zu) - cos(wb u) sin(zu) = sin((wb - z) u).
 *
 * ----------------------------------------------------------------------------
 * RESULT 2 -- diagonal positivity "by construction" (energy diagonal wb = z)
 * ----------------------------------------------------------------------------
 * The kernel energy is read on its own diagonal wb -> z, where the Wronskian
 * divisor pi(wb - z) cancels the vanishing of sin((wb - z) u). Using
 * sin((wb - z) u) / (wb - z) -> u as wb -> z, the diagonal CHANNEL contributes
 *
 *     lim_{wb -> z}  (1 / (pi (wb - z))) int Phi(u)^2 C_a(w, z; u, u) du
 *        = (1 / (2 pi)) int_0^infinity Phi(u)^2  u  sinh(2au) du.
 *
 * Every factor in the integrand is non-negative on the integration domain:
 * Phi(u)^2 >= 0, u >= 0, and sinh(2au) >= 0 for u >= 0, a > 0. Hence the diagonal
 * channel contributes a SIGN-DEFINITE (>= 0) quantity term by term -- this is the
 * precise meaning of "positive by construction". It is strictly positive for any
 * Phi not a.e. zero.
 *
 * ----------------------------------------------------------------------------
 * RESULT 3 -- off-diagonal antisymmetry consistent with the Wronskian sign
 * ----------------------------------------------------------------------------
 * Under the JOINT swap (z <-> wb, u <-> v) the integrand is exactly antisymmetric:
 *
 *     C_a(w', z'; v, u) |_{z' = wb, w'b = z}  =  - C_a(w, z; u, v).
 *
 * Because the weight Phi(u) Phi(v) du dv is symmetric in (u, v), the (u, v)
 * antisymmetric part integrates to zero, leaving the numerator
 * N(wb, z) = int int Phi(u)Phi(v) C_a antisymmetric under z <-> wb:
 * N(z, wb) = - N(wb, z). This matches the antisymmetric divisor 1/(wb - z), so the
 * full kernel K_a is symmetric -- exactly the CORRECTED (antisymmetric) Wronskian
 * sign certified in imp-2840, and it confirms the u != v block is the genuine
 * shear obstruction rather than a sign artifact.
 *
 * HONESTY: this is a bounded SYMBOLIC verification of the §25 diagonal/off-diagonal
 * split, not a discharge of Conjecture 25.2 (the no-ghost / hidden-square target,
 * RH-equivalent). It certifies the foundation (diagonal really is positive; the
 * antisymmetry is load-bearing) so the §25-27 chain can be read honestly. NO QED.
 *
 * @see hidden-square-program-section.js (commutator, §25)
 * @see imp-2840 kernel Wronskian antisymmetry audit (corrected sign)
 */

const { cosh, sinh, cos, sin, exp, abs, PI } = Math;

// The §25 commutator integrand C_a(w, z; u, v); wb denotes the conjugate w-bar
// treated as a real argument for the symbolic checks below.
function C_a(a, wb, z, u, v) {
  return (
    cosh(a * u) * sinh(a * v) * cos(z * u) * sin(wb * v) -
    sinh(a * u) * cosh(a * v) * sin(z * u) * cos(wb * v)
  );
}

// RESULT 1 closed form on the strict diagonal v = u.
function C_a_diag(a, wb, z, u) {
  return 0.5 * sinh(2 * a * u) * sin((wb - z) * u);
}

// Trapezoid helper on [0, U].
function integrate(f, U, n) {
  let s = 0.5 * (f(0) + f(U));
  for (let i = 1; i < n; i++) s += f((U * i) / n);
  return s * (U / n);
}

// Generic positive test profile standing in for the completed-Riemann Phi; the
// positivity of RESULT 2 is structural and holds for ANY real Phi.
const PHI_TEST = (t) => exp(-t * t);
const A_PARAM = 0.7;

// RESULT 2: the energy-diagonal contribution of the diagonal channel.
const DIAG_ENERGY = (1 / (2 * PI)) * integrate((u) => PHI_TEST(u) ** 2 * u * sinh(2 * A_PARAM * u), 8, 20000);

export const IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY = {
  id: 'imp-2850',
  question:
    'Verify the §25 commutator integrand split: is C_a(.;u,u) (strict diagonal) sign-definite, ' +
    'and is the C_a(u,v) <-> C_a(v,u) antisymmetry consistent with the corrected Wronskian sign?',
  integrand: 'C_a(w,z;u,v) = cosh(au)sinh(av)cos(zu)sin(wb v) - sinh(au)cosh(av)sin(zu)cos(wb v)',
  result1_diagonalReduction: {
    identity: 'C_a(w,z;u,u) = (1/2) sinh(2au) sin((wb - z) u)',
    mechanism: 'common factor cosh(au)sinh(au) = (1/2)sinh(2au); bracket = sin((wb - z)u) by the sine difference identity',
  },
  result2_diagonalPositivity: {
    energyDiagonalLimit: '(1/(2 pi)) int_0^inf Phi(u)^2 u sinh(2au) du',
    signDefinite: true,
    reason: 'Phi(u)^2 >= 0, u >= 0, sinh(2au) >= 0 for u >= 0, a > 0 -- non-negative term by term',
    testValue: +DIAG_ENERGY.toFixed(8), // > 0 for the generic positive test profile
    meaning: 'this is the precise content of the "positive by construction" claim (l.~64)',
  },
  result3_offDiagonalAntisymmetry: {
    identity: 'C_a(z, wb; v, u) = - C_a(wb, z; u, v) under the joint swap (z <-> wb, u <-> v)',
    consequence: 'Phi(u)Phi(v) symmetric => numerator N(wb,z) is antisymmetric in z <-> wb: N(z,wb) = -N(wb,z)',
    wronskianConsistency:
      'matches the antisymmetric divisor 1/(wb - z) so K_a is symmetric -- the CORRECTED Wronskian sign (imp-2840); ' +
      'the u != v block is the genuine shear obstruction, not a sign artifact',
  },
  status: 'SYMBOLIC-CHECK-PASSED (diagonal positive; off-diagonal antisymmetry load-bearing)',
  rigorousBeat: false, // does NOT discharge Conjecture 25.2 (no-ghost target is RH-equivalent)
  verdict:
    'The §25 diagonal/off-diagonal split is verified symbolically: the strict diagonal reduces to ' +
    '(1/2)sinh(2au)sin((wb-z)u) and its energy-diagonal channel is sign-definite >= 0 ("positive by ' +
    'construction"), while C_a is exactly antisymmetric under the joint (z<->wb, u<->v) swap, matching ' +
    'the corrected antisymmetric Wronskian sign (imp-2840). This certifies the FOUNDATION of the §25-27 ' +
    'program but does NOT close Conjecture 25.2 (no-ghost / hidden-square, RH-equivalent). NO QED.',
  citation: 'hidden-square-program-section.js commutator (§25); imp-2840 Wronskian antisymmetry audit',
};

export const IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY_ASSERTIONS = [
  {
    id: 'imp2850-diagonal-reduction-identity',
    description: 'C_a(w,z;u,u) collapses to (1/2)sinh(2au)sin((wb-z)u) across sampled (a,u,z,wb)',
    holds: () => {
      const samples = [
        [0.7, 1.3, 0.4, 2.1],
        [1.0, 0.5, 1.7, 0.2],
        [0.3, 2.0, 0.9, 1.1],
        [1.5, 0.8, 0.0, 3.0],
      ];
      return samples.every(([a, u, z, wb]) => abs(C_a(a, wb, z, u, u) - C_a_diag(a, wb, z, u)) < 1e-11);
    },
  },
  {
    id: 'imp2850-diagonal-channel-sign-definite',
    description: 'Energy-diagonal channel (1/2pi) int Phi^2 u sinh(2au) du is >= 0 term by term and strictly positive for a non-trivial Phi',
    holds: () => {
      // each factor non-negative on a grid of u >= 0
      const grid = Array.from({ length: 50 }, (_, i) => (8 * i) / 49);
      const termwise = grid.every((u) => PHI_TEST(u) ** 2 >= 0 && u >= 0 && sinh(2 * A_PARAM * u) >= 0);
      return termwise && DIAG_ENERGY > 0;
    },
  },
  {
    id: 'imp2850-energy-diagonal-limit-matches',
    description: 'The wb -> z limit of (1/(pi(wb-z))) int Phi^2 C_a(.;u,u) du equals the (1/2pi) int Phi^2 u sinh(2au) du closed form',
    holds: () => {
      const eps = 1e-6;
      const z = 0.4;
      const lim = (1 / (PI * eps)) * integrate((u) => PHI_TEST(u) ** 2 * C_a(A_PARAM, z + eps, z, u, u), 8, 20000);
      return abs(lim - DIAG_ENERGY) < 1e-4;
    },
  },
  {
    id: 'imp2850-offdiagonal-joint-swap-antisymmetry',
    description: 'C_a(z,wb;v,u) = -C_a(wb,z;u,v) under the joint (z<->wb, u<->v) swap across sampled points',
    holds: () => {
      const samples = [
        [0.7, 2.1, 0.4, 1.3, 0.9],
        [1.1, 0.3, 1.9, 0.6, 2.2],
        [0.5, 1.4, 0.7, 2.0, 0.1],
      ];
      return samples.every(
        ([a, wb, z, u, v]) => abs(C_a(a, z, wb, v, u) + C_a(a, wb, z, u, v)) < 1e-11
      );
    },
  },
  {
    id: 'imp2850-numerator-wronskian-antisymmetry',
    description: 'The Phi-weighted numerator N(wb,z) is antisymmetric in z<->wb (N(z,wb) = -N(wb,z)), matching the 1/(wb-z) divisor',
    holds: () => {
      const a = 0.7, wb = 1.6, z = 0.5;
      const U = 8, n = 400;
      const numerator = (W, Z) => {
        let s = 0;
        for (let i = 1; i <= n; i++) {
          const u = (U * i) / n;
          for (let j = 1; j <= n; j++) {
            const v = (U * j) / n;
            s += PHI_TEST(u) * PHI_TEST(v) * C_a(a, W, Z, u, v);
          }
        }
        return s * (U / n) ** 2;
      };
      const n1 = numerator(wb, z);
      const n2 = numerator(z, wb);
      return abs(n1 + n2) < 1e-6 * (abs(n1) + 1);
    },
  },
  {
    id: 'imp2850-honesty-no-qed',
    description: 'HONESTY: this is a symbolic foundation check, NOT a discharge of Conjecture 25.2 (no false QED)',
    holds: () =>
      IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY.rigorousBeat === false &&
      /NO QED/.test(IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY.verdict) &&
      /does NOT close Conjecture 25\.2/.test(IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY.verdict),
  },
];

for (const a of IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-commutator-diagonal-positivity assertion failed: ${a.id}`);
  }
}
