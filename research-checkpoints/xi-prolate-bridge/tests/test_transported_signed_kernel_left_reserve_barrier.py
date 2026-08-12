#!/usr/bin/env python3
"""Exact regressions for the transported signed-kernel reserve barrier."""

from __future__ import annotations

from fractions import Fraction as F
import ast
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "TRANSPORTED_SIGNED_KERNEL_LEFT_RESERVE_BARRIER.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md":
        "9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c",
    "notes/CHEBYSHEV_ERROR_REWRITE.md":
        "164482f280284c49eda27c6d22607f32d5e16db4ab053b965c97f8bbd81db20a",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md":
        "93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
}

Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(matrix[i][j] for i in range(len(matrix))) for j in range(len(matrix[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(sum(left[i][k] * right[k][j] for k in range(len(right))) for j in range(len(right[0])))
        for i in range(len(left))
    )


def matsub(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def mat_vec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(sum(row[j] * vector[j] for j in range(len(vector))) for row in matrix)


def dot(left: Vector, right: Vector) -> F:
    return sum(x * y for x, y in zip(left, right))


def inverse_2(matrix: Matrix) -> Matrix:
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    if determinant == 0:
        raise ZeroDivisionError("singular matrix")
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


class TransportedSignedKernelLeftReserveBarrierTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_transport_identity_survives_a_noninjective_synthesis(self) -> None:
        # A=(1,1): R^2 -> R has P0=A^dagger A=J/2 and Delta=1/2.
        a: Matrix = ((F(1), F(1)),)
        a_star = transpose(a)
        a_dagger: Matrix = ((F(1, 2),), (F(1, 2),))
        p0: Matrix = ((F(1, 2), F(1, 2)), (F(1, 2), F(1, 2)))
        b: Matrix = ((F(3, 4),),)
        defect = matsub(matmul(matmul(a_star, b), a), p0)
        transported = matmul(matmul(a, defect), a_dagger)
        delta: Matrix = ((F(1, 2),),)
        left_preconditioned = ((F(2) * (b[0][0] - delta[0][0]),),)
        self.assertEqual(defect, ((F(1, 4), F(1, 4)), (F(1, 4), F(1, 4))))
        self.assertEqual(matmul(p0, defect), defect)
        self.assertEqual(matmul(defect, p0), defect)
        self.assertEqual(transported, left_preconditioned)
        self.assertEqual(transported, ((F(1, 2),),))

    def test_complete_injective_cross_entry_keeps_the_signed_kernel(self) -> None:
        # Synthetic exact entry of (3.3): signed = shift*Gram - kernel.
        a8 = (F(1), F(0))
        ar = (F(1), F(1))
        signed: Matrix = ((F(2), F(3)), (F(3), F(5)))
        shift = F(4)
        gram_cross = dot(a8, ar)
        signed_cross = dot(a8, mat_vec(signed, ar))
        kernel_cross = shift * gram_cross - signed_cross
        self.assertEqual(gram_cross, 1)
        self.assertEqual(signed_cross, 5)
        self.assertEqual(kernel_cross, -1)
        self.assertEqual(shift * gram_cross - kernel_cross, signed_cross)

    def test_symmetric_source_norm_and_left_transport_can_differ(self) -> None:
        # A=diag(2,1), E=[[0,1/2],[1/2,0]].  The symmetric defect norm is
        # 1/2, while A E A^{-1}=[[0,1],[1/4,0]] has norm 1.
        a: Matrix = ((F(2), F(0)), (F(0), F(1)))
        a_inverse: Matrix = ((F(1, 2), F(0)), (F(0), F(1)))
        defect: Matrix = ((F(0), F(1, 2)), (F(1, 2), F(0)))
        left = matmul(matmul(a, defect), a_inverse)
        self.assertEqual(left, ((F(0), F(1)), (F(1, 4), F(0))))
        # For [[0,a],[b,0]], singular values are |a| and |b|.
        self.assertEqual(max(abs(defect[0][1]), abs(defect[1][0])), F(1, 2))
        self.assertEqual(max(abs(left[0][1]), abs(left[1][0])), F(1))

    def test_positive_sampling_constants_are_exactly_one(self) -> None:
        # A=S=Delta=G=I on two one-dimensional source blocks.
        c8 = cr = m8 = mr = gamma = F(1)
        self.assertEqual((c8, cr, m8, mr, gamma), (F(1),) * 5)

    def test_formal_kernel_projection_can_realize_any_entry(self) -> None:
        # Exact two-point analogue of (3.6)--(3.8): h is the component of
        # d orthogonal to r, F=-(h/J)T, and -<d,F>=T.
        d = (F(1), F(2))
        r = (F(1), F(1))
        projection_coefficient = dot(d, r) / dot(r, r)
        h = tuple(d[i] - projection_coefficient * r[i] for i in range(2))
        j = dot(d, h)
        target = F(7, 3)
        formal_derivative = tuple(-entry * target / j for entry in h)
        self.assertEqual(h, (F(-1, 2), F(1, 2)))
        self.assertEqual(j, F(1, 2))
        self.assertEqual(dot(r, h), 0)
        self.assertEqual(-dot(d, formal_derivative), target)

    def test_shrinking_forcing_saturates_the_positive_bound(self) -> None:
        for f in (F(1, 2), F(1, 3), F(1, 5)):
            forcing = (f, -f)
            epsilon = 2 * f**2
            rank_one: Matrix = tuple(
                tuple(forcing[i] * forcing[j] for j in range(2)) for i in range(2)
            )
            gap = ((epsilon - rank_one[0][0], -rank_one[0][1]),
                   (-rank_one[1][0], epsilon - rank_one[1][1]))
            self.assertEqual(gap, ((f**2, f**2), (f**2, f**2)))
            self.assertEqual(gap[0][0] * gap[1][1] - gap[0][1] ** 2, 0)
            self.assertEqual(dot(forcing, forcing), epsilon)

    def test_signed_family_has_exact_positive_eigenvalues(self) -> None:
        plus = (F(1), F(1))
        minus = (F(1), F(-1))
        for f in (F(1, 2), F(1, 3), F(1, 5)):
            delta = f**2
            signed: Matrix = ((F(1), 1 - delta), (1 - delta, F(1)))
            self.assertEqual(mat_vec(signed, minus), (delta, -delta))
            self.assertEqual(mat_vec(signed, plus), (2 - delta, 2 - delta))
            self.assertEqual(
                signed[0][0] * signed[1][1] - signed[0][1] ** 2,
                delta * (2 - delta),
            )
            self.assertGreater(delta, 0)
            self.assertGreater(2 - delta, 0)

    def test_pointwise_reserve_has_no_uniform_gap(self) -> None:
        previous_rho = F(0)
        for n in (2, 3, 5, 11):
            f = F(1, n)
            delta = f**2
            rho = 1 - delta
            self.assertLess(rho, 1)
            self.assertEqual(1 - rho, F(1, n**2))
            self.assertGreater(rho, previous_rho)
            previous_rho = rho

    def test_inverse_action_diverges_while_forcing_shrinks(self) -> None:
        prior_forcing_norm_squared = None
        prior_action_norm_squared = None
        for n in (2, 3, 5, 11):
            f = F(1, n)
            delta = f**2
            forcing = (f, -f)
            signed: Matrix = ((F(1), 1 - delta), (1 - delta, F(1)))
            action = mat_vec(inverse_2(signed), forcing)
            forcing_norm_squared = dot(forcing, forcing)
            action_norm_squared = dot(action, action)
            self.assertEqual(action, (1 / f, -1 / f))
            self.assertEqual(forcing_norm_squared, 2 * f**2)
            self.assertEqual(action_norm_squared, 2 / f**2)
            if prior_forcing_norm_squared is not None:
                self.assertLess(forcing_norm_squared, prior_forcing_norm_squared)
                self.assertGreater(action_norm_squared, prior_action_norm_squared)
            prior_forcing_norm_squared = forcing_norm_squared
            prior_action_norm_squared = action_norm_squared

    def test_singular_and_indefinite_boundaries_keep_positive_data(self) -> None:
        for coupling, determinant_sign in ((F(1), 0), (F(3, 2), -1)):
            signed: Matrix = ((F(1), coupling), (coupling, F(1)))
            determinant = signed[0][0] * signed[1][1] - signed[0][1] ** 2
            self.assertEqual((signed[0][0], signed[1][1]), (F(1), F(1)))
            if determinant_sign == 0:
                self.assertEqual(determinant, 0)
            else:
                self.assertLess(determinant, 0)

    def test_note_states_exact_target_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Transported signed-kernel left reserve and shrinking-forcing action barrier",
            "E_L=A^*B_LA-P_0",
            "A E_L A^\\dagger",
            "i_8^*P_0i_R",
            "complete label-8/rest source entry",
            "pinned unconditional",
            "Chebyshev-error moments do not estimate",
            "Moment finiteness does not compare",
            "Endpoint cancellation and P3 moments alone allow an arbitrary formal entry",
            "formal matrix-correlation model",
            "It is not asserted to arise",
            "Hermitian, two-sided relative defect",
            "generally **not**",
            "but it does not imply (2.7)",
            "pointwise reserve `rho_L<1`, but no uniform reserve",
            "implication countermodel, not an actual prolate--Weil realization",
            "the forcing itself now shrinks",
            "does **not** prove an actual residual-action bound",
            "equation (5.2)",
            "does not assert that the actual Chebyshev kernel realizes",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "equation (5.2) is proved",
            "proves RH",
            "Therefore the actual reserve fails",
            "We prove the actual reserve fails",
            "P3 moments imply (2.7)",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_package_is_stdlib_only_and_has_clean_bytes(self) -> None:
        tree = ast.parse(TEST.read_text(encoding="utf-8"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(imported, {"__future__", "fractions", "ast", "hashlib", "pathlib", "unittest"})
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))


if __name__ == "__main__":
    unittest.main()
