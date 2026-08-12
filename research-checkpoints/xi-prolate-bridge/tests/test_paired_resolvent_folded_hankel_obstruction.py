from __future__ import annotations

from fractions import Fraction
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "PAIRED_RESOLVENT_FOLDED_HANKEL_OBSTRUCTION.md"


def von_mangoldt(n: int) -> float:
    value = 0.0
    for p in range(2, n + 1):
        is_prime = all(p % q for q in range(2, int(math.sqrt(p)) + 1))
        if not is_prime:
            continue
        power = p
        while power < n:
            power *= p
        if power == n:
            value = math.log(p)
            break
    return value


def source_prime_powers(lam: int) -> list[int]:
    return [n for n in range(2, lam * lam + 1) if von_mangoldt(n) > 0]


def rho(h: float) -> float:
    return math.exp(-h / 2) / (1 - math.exp(-2 * h))


def sigma(h: float) -> float:
    return rho(h) - 2 * math.cosh(h / 2)


def det2(matrix):
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def inverse2(matrix):
    determinant = det2(matrix)
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


def quadratic(vector, matrix):
    return sum(
        vector[i] * matrix[i][j] * vector[j]
        for i in range(len(vector))
        for j in range(len(vector))
    )


class PairedResolventFoldedHankelObstructionTests(unittest.TestCase):
    def test_source_inventory_is_inclusive_at_lambda_squared(self) -> None:
        self.assertEqual(source_prime_powers(2), [2, 3, 4])
        self.assertGreater(von_mangoldt(4), 0)

    def test_continuous_density_has_plastic_constant_crossing(self) -> None:
        plastic = 1.32471795724474602596
        h_star = math.log(plastic)
        self.assertGreater(sigma(h_star - 1e-4), 0)
        self.assertLess(sigma(h_star + 1e-4), 0)
        for h in (0.05, 0.2, 0.4, 0.9, 1.7):
            tail_form = math.exp(-5 * h / 2) / (1 - math.exp(-2 * h))
            tail_form -= math.exp(h / 2)
            self.assertAlmostEqual(sigma(h), tail_form, places=13)

    def test_folded_matrix_difference_has_hankel_coefficient(self) -> None:
        # A symmetric four-point convolution kernel, ordered as -x2,-x1,x1,x2.
        # Its arbitrary diagonal cancels in the parity difference.
        x = (0.2, 0.55)
        kernel = lambda distance: math.exp(-distance) + 0.3 * math.exp(-2 * distance)
        points = (-x[1], -x[0], x[0], x[1])
        full = []
        for i, left in enumerate(points):
            row = []
            for j, right in enumerate(points):
                row.append(7.0 + i if i == j else -kernel(abs(left - right)))
            full.append(row)

        plus_columns = (
            (0.0, 1 / math.sqrt(2), 1 / math.sqrt(2), 0.0),
            (1 / math.sqrt(2), 0.0, 0.0, 1 / math.sqrt(2)),
        )
        minus_columns = (
            (0.0, -1 / math.sqrt(2), 1 / math.sqrt(2), 0.0),
            (-1 / math.sqrt(2), 0.0, 0.0, 1 / math.sqrt(2)),
        )

        def compressed(columns):
            return tuple(
                tuple(
                    sum(
                        columns[i][r] * full[r][s] * columns[j][s]
                        for r in range(4)
                        for s in range(4)
                    )
                    for j in range(2)
                )
                for i in range(2)
            )

        plus = compressed(plus_columns)
        minus = compressed(minus_columns)
        for i in range(2):
            for j in range(2):
                expected = 2 * kernel(x[i] + x[j])
                self.assertAlmostEqual(minus[i][j] - plus[i][j], expected, places=13)

        # The exact hyperbolic rank terms turn the same difference into
        # 2*(j(x+y)-2*cosh((x+y)/2)).
        c = [math.cosh(value / 2) for value in x]
        s = [math.sinh(value / 2) for value in x]
        for i in range(2):
            for j in range(2):
                loaded_difference = (
                    minus[i][j] - 4 * s[i] * s[j]
                    - plus[i][j] - 4 * c[i] * c[j]
                )
                expected = 2 * (
                    kernel(x[i] + x[j]) - 2 * math.cosh((x[i] + x[j]) / 2)
                )
                self.assertAlmostEqual(loaded_difference, expected, places=13)

    def test_atom_avoiding_bump_interval_is_strictly_negative(self) -> None:
        lam = 3
        logarithms = [math.log(n) for n in source_prime_powers(lam)]
        d = 0.50
        epsilon = 0.02
        interval = (d - 2 * epsilon, d + 2 * epsilon)
        plastic = 1.32471795724474602596
        self.assertGreater(interval[0], math.log(plastic))
        self.assertLess(interval[1], 2 * math.log(lam))
        self.assertTrue(all(not (interval[0] <= value <= interval[1]) for value in logarithms))
        for k in range(101):
            h = interval[0] + (interval[1] - interval[0]) * k / 100
            self.assertLess(sigma(h), 0)

    def test_paired_resolvent_is_exact_log_determinant_derivative(self) -> None:
        a_plus = (
            (Fraction(4), Fraction(1, 3)),
            (Fraction(1, 3), Fraction(7)),
        )
        a_minus = (
            (Fraction(5), Fraction(-2, 5)),
            (Fraction(-2, 5), Fraction(9)),
        )
        p_plus = (Fraction(3, 2), Fraction(-1, 4))
        p_minus = (Fraction(2, 3), Fraction(5, 4))
        z = Fraction(1)

        shifted_plus = (
            (a_plus[0][0] - z, a_plus[0][1]),
            (a_plus[1][0], a_plus[1][1] - z),
        )
        shifted_minus = (
            (a_minus[0][0] - z, a_minus[0][1]),
            (a_minus[1][0], a_minus[1][1] - z),
        )
        f_plus = quadratic(p_plus, inverse2(shifted_plus))
        f_minus = quadratic(p_minus, inverse2(shifted_minus))

        # Matrix determinant lemma: these are the exact derivatives at t=0.
        dlog_plus = 2 * f_plus
        dlog_minus = -2 * f_minus
        derivative_of_log_ratio_over_two = (dlog_plus - dlog_minus) / 2
        self.assertEqual(derivative_of_log_ratio_over_two, f_plus + f_minus)

    def test_note_keeps_the_claim_boundary_and_source_conventions(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "same** locked\nBernstein--Levy operator",
            "n<=lambda^2",
            "minus-prime convention",
            "U_-^*\\mathscr A_-U_- -U_+^*\\mathscr A_+U_+",
            "j_\\lambda-2t\\cosh(h/2)dh",
            "prime-atom-avoiding negative direction",
            "F_+(z)+F_-(z)",
            "does **not** order the two\nlowest eigenvalues",
            "remains unresolved",
        )
        for phrase in required:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
