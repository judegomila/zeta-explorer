import hashlib
import itertools
import math
from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "CAUCHY_GROUND_RESPONSE_WINDOW_REDUCTION.md"
N = 3
MODES = tuple(range(-N, N + 1))
EPSILON = Fraction(1, 100)
H_NONNEGATIVE = (
    Fraction(-4, 245),
    Fraction(27, 245),
    Fraction(-54, 49),
    Fraction(1),
)


def even_coefficient(values, mode):
    return values[abs(mode)]


def boundary_sum(values):
    return values[0] + 2 * sum(values[1:], Fraction())


def ground_coefficients(sign):
    return tuple(
        Fraction(1, 7) + sign * EPSILON * value
        for value in H_NONNEGATIVE
    )


def cauchy_transform(values, frequency):
    return values[0] / frequency + sum(
        (
            values[n]
            * (
                1 / (frequency - n)
                + 1 / (frequency + n)
            )
            for n in range(1, N + 1)
        ),
        Fraction(),
    )


def cauchy_transform_derivative(values, frequency):
    return -values[0] / frequency**2 + sum(
        (
            values[n]
            * (
                -1 / (frequency - n) ** 2
                - 1 / (frequency + n) ** 2
            )
            for n in range(1, N + 1)
        ),
        Fraction(),
    )


def response(values, frequency):
    return 1 - 2 * sum(
        (
            n * n * values[n] / (n * n - frequency * frequency)
            for n in range(1, N + 1)
        ),
        Fraction(),
    )


def matrix_for(values):
    return {
        (n, m): (
            1 / even_coefficient(values, n) - 1
            if n == m
            else Fraction(-1)
        )
        for n in MODES
        for m in MODES
    }


def matrix_vector(matrix, vector):
    return {
        n: sum(
            (matrix[n, m] * vector[m] for m in MODES),
            Fraction(),
        )
        for n in MODES
    }


class CauchyGroundResponseWindowReductionTests(unittest.TestCase):
    def test_protected_source_bytes_and_normalization_are_unchanged(self):
        expected = {
            "vendor/CCM-ZST-2511.22755v1.pdf":
                "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
            "P0_SOURCE_LOCK.json":
                "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
            "P0_NORMALIZATION_AUDIT.md":
                "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
        }
        for relative, digest in expected.items():
            self.assertEqual(
                hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(),
                digest,
            )

    def test_exact_perturbation_annihilates_one_local_jet(self):
        self.assertEqual(boundary_sum(H_NONNEGATIVE), 0)
        self.assertEqual(
            cauchy_transform(H_NONNEGATIVE, Fraction(1, 2)),
            0,
        )
        self.assertEqual(
            cauchy_transform_derivative(
                H_NONNEGATIVE, Fraction(1, 2)
            ),
            0,
        )
        self.assertEqual(
            cauchy_transform(H_NONNEGATIVE, Fraction(1, 3)),
            Fraction(-243, 13720),
        )

    def test_both_matrices_have_the_same_exact_cauchy_displacement(self):
        b = {mode: Fraction(-mode) for mode in MODES}
        for sign in (-1, 1):
            values = ground_coefficients(sign)
            self.assertTrue(all(value > 0 for value in values))
            self.assertEqual(boundary_sum(values), 1)
            matrix = matrix_for(values)

            for n in MODES:
                for m in MODES:
                    self.assertEqual(matrix[n, m], matrix[m, n])
                    self.assertEqual(matrix[n, m], matrix[-n, -m])
                    self.assertEqual(
                        (n - m) * matrix[n, m],
                        b[n] - b[m],
                    )

            ground = {
                mode: even_coefficient(values, mode) for mode in MODES
            }
            self.assertEqual(
                matrix_vector(matrix, ground),
                {mode: Fraction() for mode in MODES},
            )

            # Every proper principal minor is positive and the full one is
            # zero by the exact rank-one determinant formula.  This proves
            # positive semidefiniteness and a one-dimensional kernel.
            for size in range(1, len(MODES) + 1):
                for subset in itertools.combinations(MODES, size):
                    product = math.prod(
                        1 / even_coefficient(values, mode)
                        for mode in subset
                    )
                    determinant = product * (
                        1
                        - sum(
                            (
                                even_coefficient(values, mode)
                                for mode in subset
                            ),
                            Fraction(),
                        )
                    )
                    if size < len(MODES):
                        self.assertGreater(determinant, 0)
                    else:
                        self.assertEqual(determinant, 0)

    def test_odd_resolvent_profile_equals_the_coefficient_formula(self):
        # On an odd vector, Q=diag(1/x_n), beta_n=-n in the raw
        # positive-index coordinate, and T_-^{-1} beta has coordinate
        # -n*x_n.  Contracting with the normalized g_r gives the factor 2.
        for sign in (-1, 1):
            values = ground_coefficients(sign)
            for frequency in (
                Fraction(1, 3),
                Fraction(1, 2),
                Fraction(4, 5),
                Fraction(7, 2),
            ):
                odd_response = 1 + sum(
                    (
                        2
                        * n
                        / (n * n - frequency * frequency)
                        * (-n * values[n])
                        for n in range(1, N + 1)
                    ),
                    Fraction(),
                )
                self.assertEqual(odd_response, response(values, frequency))
                self.assertEqual(
                    response(values, frequency),
                    frequency * cauchy_transform(values, frequency),
                )

    def test_displayed_corrections_are_the_exact_complement_solves(self):
        uniform = {mode: Fraction(1, 7) for mode in MODES}
        for sign in (-1, 1):
            values = ground_coefficients(sign)
            matrix = matrix_for(values)
            ground = {
                mode: even_coefficient(values, mode) for mode in MODES
            }
            # This is z/sqrt(7)=uniform-ground.  Its coefficient sum is
            # zero, so it lies in the complement of eta/sqrt(7).
            scaled_correction = {
                mode: uniform[mode] - ground[mode] for mode in MODES
            }
            self.assertEqual(
                sum(scaled_correction.values(), Fraction()),
                0,
            )
            # Q(ground)=0 gives Q(z/sqrt(7))=Q(uniform), exactly the
            # complement block equation A z=b after the common scaling.
            self.assertEqual(
                matrix_vector(matrix, scaled_correction),
                matrix_vector(matrix, uniform),
            )

    def test_local_scalars_and_solve_norm_do_not_control_the_window(self):
        plus = ground_coefficients(1)
        minus = ground_coefficients(-1)
        local = Fraction(1, 2)
        remote = Fraction(1, 3)

        plus_value = cauchy_transform(plus, local)
        minus_value = cauchy_transform(minus, local)
        plus_derivative = cauchy_transform_derivative(plus, local)
        minus_derivative = cauchy_transform_derivative(minus, local)
        self.assertEqual(plus_value, minus_value)
        self.assertEqual(plus_value, Fraction(2, 49))
        self.assertNotEqual(plus_value, 0)
        self.assertEqual(plus_derivative, minus_derivative)
        self.assertEqual(
            plus_derivative / plus_value,
            minus_derivative / minus_value,
        )

        remote_difference = (
            cauchy_transform(plus, remote)
            - cauchy_transform(minus, remote)
        )
        self.assertEqual(
            remote_difference,
            2
            * EPSILON
            * cauchy_transform(H_NONNEGATIVE, remote),
        )
        self.assertNotEqual(remote_difference, 0)

        h_norm_squared = (
            H_NONNEGATIVE[0] ** 2
            + 2
            * sum(
                (value * value for value in H_NONNEGATIVE[1:]),
                Fraction(),
            )
        )
        self.assertEqual(h_norm_squared, Fraction(267324, 60025))
        plus_solve_norm_squared = 7 * EPSILON**2 * h_norm_squared
        minus_solve_norm_squared = 7 * EPSILON**2 * h_norm_squared
        self.assertEqual(plus_solve_norm_squared, minus_solve_norm_squared)

        # The corrections are +/-sqrt(7)*epsilon*h, so their boundary
        # values and local one-jets vanish while the remote values do not.
        self.assertEqual(boundary_sum(H_NONNEGATIVE), 0)
        self.assertEqual(cauchy_transform(H_NONNEGATIVE, local), 0)
        self.assertEqual(
            cauchy_transform_derivative(H_NONNEGATIVE, local),
            0,
        )
        self.assertNotEqual(cauchy_transform(H_NONNEGATIVE, remote), 0)

    def test_note_keeps_the_reduction_conditional_and_source_locked(self):
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "minus-prime",
            "inclusive",
            "response profile",
            "odd-resolvent eigenline equation",
            "real-window response identity",
            "boundary-free projective form",
            "The same profile contains the odd-inertia gate",
            "fixed finite jet",
            "logical finite Cauchy model",
            "No current source estimate",
        )
        for phrase in required:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
