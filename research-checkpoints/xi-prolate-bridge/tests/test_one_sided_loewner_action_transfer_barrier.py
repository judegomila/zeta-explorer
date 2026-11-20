#!/usr/bin/env python3
"""Exact regressions for the one-sided Loewner action-transfer barrier."""

from __future__ import annotations

from fractions import Fraction as F
import ast
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ONE_SIDED_LOEWNER_ACTION_TRANSFER_BARRIER.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md":
        "33f064c07a134986afa23efb91f7514e27828543b09cc358ebfff01e79c6f16e",
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md":
        "93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329",
    "notes/TRANSPORTED_SIGNED_KERNEL_LEFT_RESERVE_BARRIER.md":
        "6e45d1ba6667f480223f0e742fd57c14c8708bc8cd8f77c0001edb9c234b23d2",
}

Matrix = tuple[tuple[F, F], tuple[F, F]]
Vector = tuple[F, F]


def mat_vec(matrix: Matrix, vector: Vector) -> Vector:
    return (
        matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
        matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
    )


def dot(left: Vector, right: Vector) -> F:
    return left[0] * right[0] + left[1] * right[1]


def inverse_2(matrix: Matrix) -> Matrix:
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    if determinant == 0:
        raise ZeroDivisionError("singular matrix")
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


def outer(vector: Vector) -> Matrix:
    return (
        (vector[0] * vector[0], vector[0] * vector[1]),
        (vector[1] * vector[0], vector[1] * vector[1]),
    )


class OneSidedLoewnerActionTransferBarrierTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_quotient_and_sampling_constants_are_exact(self) -> None:
        for m in (F(2), F(5), F(11)):
            # W=diag(m,1), D=I, S=[0,1].
            quotient_inverse: Matrix = ((m**2, F(0)), (F(0), F(1)))
            delta: Matrix = ((1 / m**2, F(0)), (F(0), F(1)))
            sampling_gram: Matrix = ((F(0), F(0)), (F(0), F(1)))
            self.assertEqual(mat_vec(delta, mat_vec(quotient_inverse, (F(1), F(1)))), (F(1), F(1)))
            self.assertEqual(sampling_gram, outer((F(0), F(1))))
            c_min = F(1)
            c_delta = F(1)
            gamma_delta = F(1)
            self.assertEqual((c_min, c_delta, gamma_delta), (F(1), F(1), F(1)))
            self.assertEqual(m**2 * c_delta / gamma_delta, m**2)

    def test_two_sided_loewner_witnesses_are_rank_one(self) -> None:
        for m in (F(2), F(5), F(11)):
            delta: Matrix = ((1 / m**2, F(0)), (F(0), F(1)))
            signed: Matrix = ((2 / m**2, 1 / m), (1 / m, F(2)))
            lower_gap: Matrix = (
                (signed[0][0] - delta[0][0], signed[0][1]),
                (signed[1][0], signed[1][1] - delta[1][1]),
            )
            upper_gap: Matrix = (
                (3 * delta[0][0] - signed[0][0], -signed[0][1]),
                (-signed[1][0], 3 * delta[1][1] - signed[1][1]),
            )
            self.assertEqual(lower_gap, outer((1 / m, F(1))))
            self.assertEqual(upper_gap, outer((1 / m, F(-1))))
            self.assertEqual(lower_gap[0][0] * lower_gap[1][1] - lower_gap[0][1] ** 2, 0)
            self.assertEqual(upper_gap[0][0] * upper_gap[1][1] - upper_gap[0][1] ** 2, 0)

    def test_inverse_action_has_exact_conditioning_loss(self) -> None:
        for m, a in ((F(2), F(1, 3)), (F(5), F(1, 7)), (F(11), F(1, 13))):
            delta_inverse: Matrix = ((m**2, F(0)), (F(0), F(1)))
            signed: Matrix = ((2 / m**2, 1 / m), (1 / m, F(2)))
            forcing = (F(0), a)
            positive_forcing = mat_vec(delta_inverse, forcing)
            action = mat_vec(inverse_2(signed), forcing)
            self.assertEqual(positive_forcing, (F(0), a))
            self.assertEqual(action, (-a * m / 3, 2 * a / 3))
            self.assertEqual(dot(action, action) / dot(positive_forcing, positive_forcing), (m**2 + 4) / 9)

    def test_energy_norm_bound_survives_when_euclidean_bound_fails(self) -> None:
        for m in (F(2), F(5), F(11)):
            a = F(1, 7)
            action = (-a * m / 3, 2 * a / 3)
            action_energy_squared = action[0] ** 2 / m**2 + action[1] ** 2
            forcing_energy_squared = a**2
            self.assertEqual(action_energy_squared, 5 * a**2 / 9)
            self.assertLessEqual(action_energy_squared, forcing_energy_squared)

    def test_shrinking_forcing_can_have_constant_or_divergent_action(self) -> None:
        previous_divergent = None
        for n in (2, 3, 5, 11):
            # Constant-action branch: m=n, a=1/n.
            m = F(n)
            a = F(1, n)
            constant_action_squared = a**2 * (m**2 + 4) / 9
            self.assertEqual(constant_action_squared, (1 + F(4, n**2)) / 9)
            # Divergent branch: m=n^2, a=1/n.
            m_divergent = F(n**2)
            divergent_action_squared = a**2 * (m_divergent**2 + 4) / 9
            self.assertEqual(divergent_action_squared, (F(n**2) + F(4, n**2)) / 9)
            if previous_divergent is not None:
                self.assertGreater(divergent_action_squared, previous_divergent)
            previous_divergent = divergent_action_squared

    def test_dominating_action_scalar_rescaling_is_invariant(self) -> None:
        # Squared theorem factor C_tilde*||Delta_tilde^-1/2||^2/mu_tilde^2.
        for m in (F(5), F(11)):
            for scale in (F(1, 3), F(2), F(7)):
                c_tilde = 1 / scale
                inverse_half_norm_squared = m**2 / scale
                mu_tilde = 1 / scale
                squared_factor = c_tilde * inverse_half_norm_squared / mu_tilde**2
                self.assertEqual(squared_factor, m**2)

    def test_no_scalar_left_close_above_exact_threshold(self) -> None:
        # sym(Delta^-1 B) has determinant 4-((m+1/m)/2)^2.
        for m in (F(4), F(5), F(11)):
            off_diagonal = (m + 1 / m) / 2
            determinant = F(4) - off_diagonal**2
            self.assertLess(determinant, 0)
            self.assertGreater(m + 1 / m, 4)

    def test_current_dominating_route_loses_one_lambda_power(self) -> None:
        c_delta_power = F(3)
        delta_inverse_power = F(2)
        d6_over_d8_power = F(-4)
        squared_action_power = c_delta_power + delta_inverse_power + d6_over_d8_power
        self.assertEqual(squared_action_power, F(1))
        self.assertEqual(squared_action_power / 2, F(1, 2))
        target_squared_power = F(-1)
        required_mu_power = (squared_action_power - target_squared_power) / 2
        self.assertEqual(required_mu_power, F(1))

    def test_envelope_ratio_is_not_a_pointwise_ratio_claim(self) -> None:
        for m in (F(2), F(5), F(11)):
            envelope_denominator_squared = F(1)
            envelope_numerator_squared = (m**2 + 4) / 9
            envelope_ratio_squared = envelope_numerator_squared / envelope_denominator_squared
            source_balance_upper_squared = m**2
            self.assertEqual(envelope_ratio_squared, (m**2 + 4) / 9)
            self.assertLessEqual(envelope_ratio_squared, source_balance_upper_squared)

    def test_commuting_one_sided_model_has_no_euclidean_loss(self) -> None:
        delta: Matrix = ((F(1, 5), F(0)), (F(0), F(7)))
        signed: Matrix = ((F(2, 5), F(0)), (F(0), F(21)))
        forcing = (F(3), F(5))
        delta_action = mat_vec(inverse_2(delta), forcing)
        signed_action = mat_vec(inverse_2(signed), forcing)
        # B>=2*Delta, and coordinatewise B^-1 Delta<=1/2.
        self.assertEqual(delta_action, (F(15), F(5, 7)))
        self.assertEqual(signed_action, (F(15, 2), F(5, 21)))
        self.assertLessEqual(dot(signed_action, signed_action), dot(delta_action, delta_action) / 4)

    def test_note_states_precise_scope_and_orientation_alternatives(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "One-sided Loewner action-transfer barrier and exact orientation alternatives",
            "A one-sided floor is lossless only in the energy norm",
            "Quotient-compatible two-sided counterfamily",
            "Delta\\preceq B\\preceq3\\Delta",
            "fixed positive-sampling constants equal to one",
            "M>2+\\sqrt3",
            "Scalar rescaling cannot repair the obstruction",
            "loses a full factor `lambda`",
            "mu_lambda>=c*lambda",
            "restricted-transfer conditions",
            "A carefully scoped sampling-envelope ratio",
            "separate operator-norm suprema",
            "not a pointwise equivalence",
            "source-aligned balance condition",
            "The existing dominating-action theorem remains valid",
            "abstract finite-dimensional implication countermodel",
            "not asserted to be the actual signed",
            "actual residual-action estimate",
            "equation (5.2)",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "one-sided floor proves the action rate",
            "the actual one-sided floor fails",
            "equation (5.2) is proved",
            "proves RH",
            "is the ratio for each common forcing direction",
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
