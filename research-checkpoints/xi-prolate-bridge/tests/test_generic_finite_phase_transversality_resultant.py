#!/usr/bin/env python3
"""Exact regressions for generic finite phase transversality."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GENERIC_FINITE_PHASE_TRANSVERSALITY_RESULTANT.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md":
        "ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1",
    "notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md":
        "00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff",
    "notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md":
        "6a704c20640a9c113836904e91c7fafbe12bee0a03d31f623faad988bd306959",
}

Gaussian = tuple[F, F]
Polynomial = tuple[Gaussian, ...]  # ascending coefficients

ZERO = (F(0), F(0))
ONE = (F(1), F(0))


def g_add(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def g_sub(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] - right[0], left[1] - right[1]


def g_mul(left: Gaussian, right: Gaussian) -> Gaussian:
    return (
        left[0] * right[0] - left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def g_scale(scale: F, value: Gaussian) -> Gaussian:
    return scale * value[0], scale * value[1]


def g_conjugate(value: Gaussian) -> Gaussian:
    return value[0], -value[1]


def g_inverse(value: Gaussian) -> Gaussian:
    norm = value[0] ** 2 + value[1] ** 2
    return value[0] / norm, -value[1] / norm


def g_div(left: Gaussian, right: Gaussian) -> Gaussian:
    return g_mul(left, g_inverse(right))


def g_power(value: Gaussian, exponent: int) -> Gaussian:
    result = ONE
    factor = value
    remaining = exponent
    while remaining:
        if remaining % 2:
            result = g_mul(result, factor)
        factor = g_mul(factor, factor)
        remaining //= 2
    return result


def inverse_square(edge: F, omega: F, frequency: int) -> Gaussian:
    return g_inverse(g_power((edge, F(frequency) * omega), 2))


def lifted_polynomial(
    edge: F,
    omega: F,
    support: tuple[int, ...],
    weights: tuple[int, ...],
    power: int,
) -> Polynomial:
    n_value = max(support)
    coefficients = [ZERO] * (2 * n_value + 1)
    for frequency, weight in zip(support, weights, strict=True):
        coefficient = g_scale(
            F(weight),
            g_power(inverse_square(edge, omega, frequency), power),
        )
        coefficients[n_value + frequency] = g_add(
            coefficients[n_value + frequency], coefficient
        )
        coefficients[n_value - frequency] = g_add(
            coefficients[n_value - frequency], g_conjugate(coefficient)
        )
    return tuple(coefficients)


def gaussian_determinant(matrix: list[list[Gaussian]]) -> Gaussian:
    values = [row[:] for row in matrix]
    determinant = ONE
    size = len(values)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size)
             if values[row][column] != ZERO),
            None,
        )
        if pivot is None:
            return ZERO
        if pivot != column:
            values[column], values[pivot] = values[pivot], values[column]
            determinant = g_scale(F(-1), determinant)
        pivot_value = values[column][column]
        determinant = g_mul(determinant, pivot_value)
        for row in range(column + 1, size):
            if values[row][column] == ZERO:
                continue
            multiplier = g_div(values[row][column], pivot_value)
            for index in range(column, size):
                values[row][index] = g_sub(
                    values[row][index],
                    g_mul(multiplier, values[column][index]),
                )
    return determinant


def resultant(left: Polynomial, right: Polynomial) -> Gaussian:
    left_degree = len(left) - 1
    right_degree = len(right) - 1
    assert left[-1] != ZERO and right[-1] != ZERO
    left_descending = list(reversed(left))
    right_descending = list(reversed(right))
    size = left_degree + right_degree
    matrix: list[list[Gaussian]] = []
    for shift in range(right_degree):
        matrix.append(
            [ZERO] * shift
            + left_descending
            + [ZERO] * (right_degree - shift - 1)
        )
    for shift in range(left_degree):
        matrix.append(
            [ZERO] * shift
            + right_descending
            + [ZERO] * (left_degree - shift - 1)
        )
    assert all(len(row) == size for row in matrix)
    return gaussian_determinant(matrix)


def evaluate_edge_functions(
    edge: F,
    omega: F,
    support: tuple[int, ...],
    weights: tuple[int, ...],
    phase: Gaussian,
) -> tuple[F, F, F, F]:
    values: list[F] = []
    for power in (1, 2, 3):
        total = ZERO
        for frequency, weight in zip(support, weights, strict=True):
            term = g_mul(
                g_power(inverse_square(edge, omega, frequency), power),
                g_power(phase, frequency),
            )
            total = g_add(total, g_scale(F(weight), term))
        values.append(2 * total[0])
    p_value, v_value, w_value = values
    return p_value, v_value, w_value, p_value * w_value - v_value**2


class GenericFinitePhaseTransversalityResultantTests(unittest.TestCase):
    maxDiff = None

    def test_protected_dependency_hashes(self) -> None:
        for relative_path, expected_hash in PROTECTED_HASHES.items():
            payload = (ROOT / relative_path).read_bytes()
            self.assertEqual(hashlib.sha256(payload).hexdigest(), expected_hash)

    def test_locked_coefficient_has_the_exact_nonreal_part(self) -> None:
        edge = F(2)
        omega = F(3)
        frequency = 4
        b_value = inverse_square(edge, omega, frequency)
        expected_imaginary = (
            -2 * edge * frequency * omega
            / (edge**2 + (frequency * omega) ** 2) ** 2
        )
        self.assertEqual(b_value[1], expected_imaginary)
        self.assertLess(b_value[1], 0)

    def test_lifts_have_exact_degree_and_conjugate_endpoints(self) -> None:
        support = (1, 2, 4)
        weights = (2, 3, 5)
        for power in (1, 2):
            polynomial = lifted_polynomial(
                F(1), F(1), support, weights, power
            )
            b_top = g_power(inverse_square(F(1), F(1), 4), power)
            self.assertEqual(len(polynomial), 9)
            self.assertEqual(polynomial[-1], g_scale(F(5), b_top))
            self.assertEqual(
                polynomial[0], g_scale(F(5), g_conjugate(b_top))
            )
            self.assertNotEqual(polynomial[-1], ZERO)
            self.assertNotEqual(polynomial[0], ZERO)

    def test_one_mode_resultant_matches_the_binomial_formula(self) -> None:
        for top_frequency in (1, 3, 4):
            first = lifted_polynomial(
                F(1), F(1), (top_frequency,), (1,), 1
            )
            second = lifted_polynomial(
                F(1), F(1), (top_frequency,), (1,), 2
            )
            b_value = inverse_square(F(1), F(1), top_frequency)
            delta = g_sub(
                g_mul(b_value, g_power(g_conjugate(b_value), 2)),
                g_mul(g_power(b_value, 2), g_conjugate(b_value)),
            )
            self.assertNotEqual(delta, ZERO)
            self.assertEqual(
                resultant(first, second),
                g_power(delta, 2 * top_frequency),
            )

    def test_positive_three_frequency_resultants_are_exactly_nonzero(self) -> None:
        for support in ((1, 2, 3), (1, 2, 4), (1, 3, 4)):
            weights = (1, 1, 1)
            first = lifted_polynomial(F(1), F(1), support, weights, 1)
            second = lifted_polynomial(F(1), F(1), support, weights, 2)
            self.assertNotEqual(resultant(first, second), ZERO)

    def test_resultant_has_the_claimed_weight_homogeneity(self) -> None:
        support = (1, 2, 3)
        weights = (1, 2, 3)
        scale = 2
        base = resultant(
            lifted_polynomial(F(1), F(1), support, weights, 1),
            lifted_polynomial(F(1), F(1), support, weights, 2),
        )
        scaled_weights = tuple(scale * value for value in weights)
        scaled = resultant(
            lifted_polynomial(F(1), F(1), support, scaled_weights, 1),
            lifted_polynomial(F(1), F(1), support, scaled_weights, 2),
        )
        self.assertEqual(
            scaled,
            g_scale(F(scale ** (4 * max(support))), base),
        )

    def test_exact_boundary_transversality_fixture(self) -> None:
        p_value, v_value, w_value, covariance = evaluate_edge_functions(
            F(1), F(1), (1,), (1,), ONE
        )
        self.assertEqual((p_value, v_value, w_value, covariance), (
            F(0), F(-1, 2), F(0), F(-1, 4)
        ))

    def test_exact_three_frequency_favorable_fixtures(self) -> None:
        expected = {
            (1, 2, 3): (
                F(28, 25), F(26, 625), F(-8339, 31250),
                F(-117422, 390625),
            ),
            (1, 2, 4): (
                F(8209, 7225), F(1370544, 52200625),
                F(-399804155209, 1508598062500),
                F(-455294930593, 1508598062500),
            ),
            (1, 3, 4): (
                F(5608, 7225), F(1203502, 52200625),
                F(-190017743099, 754299031250),
                F(-73945767296, 377149515625),
            ),
        }
        phase = (F(0), F(1))
        for support, expected_values in expected.items():
            values = evaluate_edge_functions(
                F(1), F(1), support, (1, 1, 1), phase
            )
            self.assertEqual(values, expected_values)
            self.assertGreater(values[0], 0)
            self.assertLess(values[3], 0)

    def test_note_states_the_resultant_theorem_and_diagnostic_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for required in (
            "at **every** sign-changing boundary point",
            "\\operatorname {Res}_z(F_{\\boldsymbol r},G_{\\boldsymbol r})",
            "its total weight degree is `4n`",
            "is not the zero polynomial",
            "empty interior",
            "Lebesgue measure zero",
            "All statements in this section are floating-point",
            "diagnostics.  They are neither exhaustive",
            "the exceptional algebraic set\nmay contain one",
            "The formal state remains `P0_INVALIDATED`",
        ):
            self.assertIn(required, text)

    def test_note_does_not_overclaim_the_exceptional_or_zeta_cases(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        for forbidden in (
            "every positive weight vector is favorable",
            "the exceptional algebraic set is empty",
            "every finite attained edge is obstructed",
            "actual zeta ordinates are commensurable",
            "equation (5.2) of `DIRECT_RH_ATTACK.md` is proved",
            "The formal state is `P0_VALIDATED`",
        ):
            self.assertNotIn(forbidden, text)
        self.assertIn("This is not a universal theorem", text)
        self.assertIn("does not settle a prescribed positive integer", text)
        self.assertIn("does not assert that an actual attained zeta edge is", text)
        self.assertIn("No exact compatible failure was found", text)

    def test_regression_is_stdlib_only_and_does_not_mutate_status(self) -> None:
        source = TEST.read_text(encoding="utf-8")
        for forbidden in (
            "num" + "py",
            "sci" + "py",
            "sym" + "py",
            "sub" + "process",
            "write" + "_text",
            "write" + "_bytes",
            "PROJECT" + "_STATUS",
            "CHECK" + "POINT",
        ):
            self.assertNotIn(forbidden, source)


if __name__ == "__main__":
    unittest.main()
