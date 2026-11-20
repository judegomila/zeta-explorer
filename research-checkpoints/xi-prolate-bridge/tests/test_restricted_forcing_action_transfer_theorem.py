#!/usr/bin/env python3
"""Exact regressions for the restricted-forcing action-transfer theorem."""

from __future__ import annotations

from fractions import Fraction as F
import ast
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "RESTRICTED_FORCING_ACTION_TRANSFER_THEOREM.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "notes/ONE_SIDED_LOEWNER_ACTION_TRANSFER_BARRIER.md":
        "643c54707b9dee31493a628f6fd8d1368a3a5eb4eb27d17d7e2acaa5a0448a9f",
    "notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md":
        "000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932",
}

Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
    )


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum(left[i][k] * right[k][j] for k in range(len(right)))
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def mat_vec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum(matrix[i][j] * vector[j] for j in range(len(vector)))
        for i in range(len(matrix))
    )


def matsub(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def scale(scalar: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * entry for entry in row) for row in matrix)


def diagonal(*entries: F) -> Matrix:
    return tuple(
        tuple(entries[i] if i == j else F(0) for j in range(len(entries)))
        for i in range(len(entries))
    )


def inverse_2(matrix: Matrix) -> Matrix:
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


def dot(left: Vector, right: Vector) -> F:
    return sum(x * y for x, y in zip(left, right))


def quadratic(matrix: Matrix, vector: Vector) -> F:
    return dot(vector, mat_vec(matrix, vector))


def outer(vector: Vector) -> Matrix:
    return tuple(tuple(x * y for y in vector) for x in vector)


def determinant_2(matrix: Matrix) -> F:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


class RestrictedForcingActionTransferTheoremTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_noninjective_polar_source_and_floor_equivalence(self) -> None:
        rotation: Matrix = ((F(3, 5), F(-4, 5)), (F(4, 5), F(3, 5)))
        source_scale: Matrix = ((F(1), F(0), F(0)), (F(0), F(2), F(0)))
        synthesis = matmul(rotation, source_scale)
        j = matmul(transpose(synthesis), synthesis)
        p0 = diagonal(F(1), F(1), F(0))
        self.assertEqual(j, diagonal(F(1), F(4), F(0)))

        source_scale_dagger: Matrix = (
            (F(1), F(0)),
            (F(0), F(1, 2)),
            (F(0), F(0)),
        )
        synthesis_dagger = matmul(source_scale_dagger, transpose(rotation))
        self.assertEqual(matmul(synthesis_dagger, synthesis), p0)
        self.assertEqual(matmul(synthesis, synthesis_dagger), diagonal(F(1), F(1)))

        b0: Matrix = ((F(2), F(1)), (F(1), F(3)))
        physical = matmul(matmul(rotation, b0), transpose(rotation))
        delta0 = diagonal(F(1), F(1, 4))
        delta = matmul(matmul(rotation, delta0), transpose(rotation))
        h = matmul(matmul(transpose(synthesis), physical), synthesis)
        self.assertEqual(
            h,
            ((F(2), F(2), F(0)), (F(2), F(12), F(0)), (F(0), F(0), F(0))),
        )

        # mu=1: the source and physical gaps are the same positive congruence.
        source_gap = matsub(h, p0)
        physical_gap = matsub(physical, delta)
        expected_physical_gap = matmul(
            matmul(rotation, ((F(1), F(1)), (F(1), F(11, 4)))),
            transpose(rotation),
        )
        self.assertEqual(physical_gap, expected_physical_gap)
        self.assertEqual(source_gap[0][0] * source_gap[1][1] - source_gap[0][1] ** 2, F(7))
        self.assertGreater(source_gap[0][0], 0)

    def test_correct_noninjective_vector_identities_and_metric_quotient(self) -> None:
        rotation: Matrix = ((F(3, 5), F(-4, 5)), (F(4, 5), F(3, 5)))
        source_scale: Matrix = ((F(1), F(0), F(0)), (F(0), F(2), F(0)))
        synthesis = matmul(rotation, source_scale)
        source_scale_dagger: Matrix = (
            (F(1), F(0)),
            (F(0), F(1, 2)),
            (F(0), F(0)),
        )
        synthesis_dagger = matmul(source_scale_dagger, transpose(rotation))

        b0: Matrix = ((F(2), F(1)), (F(1), F(3)))
        b0_inverse = inverse_2(b0)
        physical_inverse = matmul(matmul(rotation, b0_inverse), transpose(rotation))
        c0: Vector = (F(1), F(-1))
        forcing = mat_vec(rotation, c0)
        g = mat_vec(transpose(synthesis), forcing)
        self.assertEqual(g, (F(1), F(-2), F(0)))

        h_inverse: Matrix = ((F(3, 5), F(-1, 10)), (F(-1, 10), F(1, 10)))
        h_inverse_g = mat_vec(h_inverse, g[:2])
        self.assertEqual(h_inverse_g, (F(4, 5), F(-3, 10)))

        signed_action = mat_vec(physical_inverse, forcing)
        self.assertEqual(signed_action, mat_vec(synthesis, h_inverse_g + (F(0),)))
        self.assertEqual(signed_action, (F(24, 25), F(7, 25)))
        self.assertEqual(
            mat_vec(synthesis_dagger, signed_action),
            h_inverse_g + (F(0),),
        )

        adjoint_action = mat_vec(transpose(synthesis), signed_action)
        j_h_inverse_g = (h_inverse_g[0], F(4) * h_inverse_g[1], F(0))
        self.assertEqual(adjoint_action, j_h_inverse_g)
        self.assertEqual(adjoint_action, (F(4, 5), F(-6, 5), F(0)))
        self.assertNotEqual(adjoint_action[:2], h_inverse_g)

        delta_inverse = matmul(
            matmul(rotation, diagonal(F(1), F(4))),
            transpose(rotation),
        )
        unsigned_action = mat_vec(delta_inverse, forcing)
        self.assertEqual(unsigned_action, (F(19, 5), F(-8, 5)))
        q_j_g = g[0] ** 2 + F(4) * g[1] ** 2
        q_j_h_inverse_g = h_inverse_g[0] ** 2 + F(4) * h_inverse_g[1] ** 2
        self.assertEqual(q_j_g, dot(unsigned_action, unsigned_action))
        self.assertEqual(q_j_h_inverse_g, dot(signed_action, signed_action))
        self.assertEqual(q_j_h_inverse_g / q_j_g, F(1, 17))

    def test_source_transfer_operator_has_the_exact_order(self) -> None:
        j_half = diagonal(F(1), F(2))
        j_inverse_half = diagonal(F(1), F(1, 2))
        h_inverse: Matrix = ((F(3, 5), F(-1, 10)), (F(-1, 10), F(1, 10)))
        source_transfer = matmul(matmul(j_half, h_inverse), j_inverse_half)
        expected: Matrix = ((F(3, 5), F(-1, 20)), (F(-1, 5), F(1, 10)))
        self.assertEqual(source_transfer, expected)

        b0_inverse: Matrix = ((F(3, 5), F(-1, 5)), (F(-1, 5), F(2, 5)))
        delta0 = diagonal(F(1), F(1, 4))
        self.assertEqual(matmul(b0_inverse, delta0), expected)
        g = (F(1), F(-2))
        self.assertEqual(mat_vec(j_half, g), (F(1), F(-4)))
        self.assertEqual(
            mat_vec(source_transfer, mat_vec(j_half, g)),
            mat_vec(j_half, mat_vec(h_inverse, g)),
        )

    def test_repeated_singular_level_uses_spectral_projection_weight(self) -> None:
        # B=I, Delta=T, u=(1,2,2), c=Delta*u.
        transfer = diagonal(F(3), F(3), F(1))
        u: Vector = (F(1), F(2), F(2))
        c = mat_vec(transfer, u)
        self.assertEqual(c, (F(3), F(6), F(2)))
        denominator = dot(u, u)
        numerator = dot(c, c)
        self.assertEqual((denominator, numerator), (F(9), F(49)))

        repeated_projection_mass = u[0] ** 2 + u[1] ** 2
        simple_projection_mass = u[2] ** 2
        self.assertEqual((repeated_projection_mass, simple_projection_mass), (F(5), F(4)))
        first_moment = (
            F(9) * repeated_projection_mass + simple_projection_mass
        ) / denominator
        self.assertEqual(first_moment, F(49, 9))

        # A rational rotation inside the repeated singular subspace changes
        # individual overlaps but preserves their combined projection mass.
        right_one = (F(3, 5), F(4, 5))
        right_two = (F(-4, 5), F(3, 5))
        rotated_masses = (dot(right_one, u[:2]) ** 2, dot(right_two, u[:2]) ** 2)
        self.assertEqual(rotated_masses, (F(121, 25), F(4, 25)))
        self.assertEqual(sum(rotated_masses), repeated_projection_mass)

    def test_exceptional_levels_plus_tail_cap(self) -> None:
        squared_singular_values = (F(100), F(9), F(1))
        raw_weights = (F(1), F(4), F(9))
        total_weight = sum(raw_weights)
        exact_moment = sum(
            value * weight
            for value, weight in zip(squared_singular_values, raw_weights)
        ) / total_weight
        exceptional_contribution = squared_singular_values[0] * raw_weights[0] / total_weight
        tail_cap = squared_singular_values[1]
        self.assertEqual(exact_moment, F(145, 14))
        self.assertLessEqual(exact_moment, exceptional_contribution + tail_cap)

        direct_tail = sum(
            value * weight
            for value, weight in zip(squared_singular_values[1:], raw_weights[1:])
        ) / total_weight
        self.assertEqual(exact_moment, exceptional_contribution + direct_tail)

    def test_first_moment_is_strictly_weaker_than_cyclic_support_cap(self) -> None:
        previous_cap = F(0)
        for n_int in (2, 3, 5, 11):
            n = F(n_int)
            u = (1 / n, F(1))
            c = (F(1), F(1))
            denominator = dot(u, u)
            action_ratio_squared = dot(c, c) / denominator
            high_weight = (1 / n**2) / denominator
            low_weight = 1 / denominator
            first_moment = n**2 * high_weight + low_weight
            self.assertEqual(action_ratio_squared, F(2) * n**2 / (n**2 + 1))
            self.assertEqual(first_moment, action_ratio_squared)
            self.assertLess(action_ratio_squared, 2)

            # det[u,(T*T)u] != 0, so the cyclic space is all of R^2.
            cyclic_determinant = u[0] * u[1] - u[1] * (n**2 * u[0])
            self.assertNotEqual(cyclic_determinant, 0)
            support_cap = n**2
            self.assertGreater(support_cap, previous_cap)
            previous_cap = support_cap

    def test_fixed_two_sided_floor_counterfamily(self) -> None:
        h: Matrix = ((F(3, 2), F(-1, 2)), (F(-1, 2), F(3, 2)))
        identity = diagonal(F(1), F(1))
        h_minus_identity = matsub(h, identity)
        two_identity_minus_h = matsub(scale(F(2), identity), h)
        self.assertEqual(h_minus_identity, scale(F(1, 2), outer((F(1), F(-1)))))
        self.assertEqual(two_identity_minus_h, scale(F(1, 2), outer((F(1), F(1)))))

        for n_int in (2, 3, 5, 11):
            n = F(n_int)
            epsilon = 1 / n
            delta = diagonal(n**2, F(1))
            signed: Matrix = (
                (F(3, 2) * n**2, F(-1, 2) * n),
                (F(-1, 2) * n, F(3, 2)),
            )
            self.assertEqual(
                matsub(signed, delta),
                scale(F(1, 2), outer((n, F(-1)))),
            )
            self.assertEqual(
                matsub(scale(F(2), delta), signed),
                scale(F(1, 2), outer((n, F(1)))),
            )
            self.assertGreater(determinant_2(signed), 0)

            signed_inverse = inverse_2(signed)
            transfer = matmul(signed_inverse, delta)
            self.assertEqual(
                transfer,
                ((F(3, 4), epsilon / 4), (n / 4, F(3, 4))),
            )
            self.assertEqual(transfer[0][0] + transfer[1][1], F(3, 2))
            self.assertEqual(determinant_2(transfer), F(1, 2))

    def test_floor_counterfamily_action_matches_source_quotient_exactly(self) -> None:
        h_inverse: Matrix = ((F(3, 4), F(1, 4)), (F(1, 4), F(3, 4)))
        g: Vector = (F(1), F(0))
        h_inverse_g = mat_vec(h_inverse, g)
        self.assertEqual(h_inverse_g, (F(3, 4), F(1, 4)))

        for n_int in (2, 3, 5, 11):
            n = F(n_int)
            epsilon = 1 / n
            j = diagonal(epsilon**2, F(1))
            source_denominator = quadratic(j, g)
            source_numerator = quadratic(j, h_inverse_g)
            expected_ratio = (n**2 + 9) / 16
            self.assertEqual(source_numerator / source_denominator, expected_ratio)

            delta = diagonal(n**2, F(1))
            delta_inverse = diagonal(epsilon**2, F(1))
            signed: Matrix = (
                (F(3, 2) * n**2, F(-1, 2) * n),
                (F(-1, 2) * n, F(3, 2)),
            )
            signed_inverse = inverse_2(signed)
            forcing = (n, F(0))
            unsigned_action = mat_vec(delta_inverse, forcing)
            signed_action = mat_vec(signed_inverse, forcing)
            direct_ratio = dot(signed_action, signed_action) / dot(unsigned_action, unsigned_action)
            self.assertEqual(direct_ratio, expected_ratio)
            self.assertEqual(F(16) * direct_ratio - n**2, F(9))
            self.assertLessEqual(direct_ratio, n**2)

            # Scaling to the fixed physical forcing e_1 leaves the ratio unchanged.
            fixed_unsigned = mat_vec(delta_inverse, (F(1), F(0)))
            fixed_signed = mat_vec(signed_inverse, (F(1), F(0)))
            fixed_ratio = dot(fixed_signed, fixed_signed) / dot(fixed_unsigned, fixed_unsigned)
            self.assertEqual(fixed_ratio, expected_ratio)

    def test_note_states_exact_theorem_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Restricted-forcing action-transfer theorem",
            "possibly noninjective normalized source",
            "polar source transfer",
            "A^*B^{-1}c&=J_SH_S^{-1}g",
            "must not be confused",
            "Exact one-vector quotient",
            "exact first-moment criterion",
            "distinct singular values",
            "singular value is repeated",
            "exceptional levels plus a tail cap",
            "right-singular cyclic subspace",
            "strictly stronger",
            "fixed two-sided floor, divergent action",
            "usual conditioning loss is sharp in order",
            "no physical forcing estimate",
            "no equation (5.2)",
            "no RH conclusion",
            "Lambda bound",
            "actual arithmetic source",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "A^*B^{-1}c=H_S^{-1}g",
            "the actual forcing vector is controlled",
            "the physical forcing rate follows",
            "the actual low range is reducing",
            "equation (5.2) is proved",
            "proves RH",
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
        self.assertLessEqual(
            imported,
            {"__future__", "fractions", "ast", "hashlib", "pathlib", "unittest"},
        )

        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))


if __name__ == "__main__":
    unittest.main()
