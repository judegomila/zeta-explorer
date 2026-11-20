import math
from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "POLYLOG_SHIFTED_SOLVE_OBSERVABLE_REDUCTION.md"


class PolylogShiftedSolveObservableReductionTests(unittest.TestCase):
    def test_feshbach_derivative_is_exactly_shifted_solve_norm(self):
        # A=diag(3,5), U=1, b=(2,-1).  Differentiating
        # d(s)=q-s-sum b_i^2/(A_i-s) gives d'(U)=-1-tau_U^2.
        eigenvalues = (Fraction(3), Fraction(5))
        forcing = (Fraction(2), Fraction(-1))
        upper_shift = Fraction(1)
        tau_squared = sum(
            (
                coefficient * coefficient
                / (eigenvalue - upper_shift) ** 2
                for eigenvalue, coefficient in zip(eigenvalues, forcing)
            ),
            Fraction(),
        )
        derivative = -1 - sum(
            (
                coefficient * coefficient
                / (eigenvalue - upper_shift) ** 2
                for eigenvalue, coefficient in zip(eigenvalues, forcing)
            ),
            Fraction(),
        )
        self.assertEqual(tau_squared, Fraction(17, 16))
        self.assertEqual(-derivative - 1, tau_squared)

    def test_shift_monotone_graph_cauchy_bound(self):
        diagonal_b = (Fraction(2), Fraction(5), Fraction(11))
        forcing = (Fraction(3), Fraction(-4), Fraction(2))
        observable = (Fraction(7), Fraction(1), Fraction(-5))
        h = Fraction(3, 2)

        actual = sum(
            (
                g * b / (eigenvalue + h)
                for eigenvalue, b, g in zip(
                    diagonal_b, forcing, observable
                )
            ),
            Fraction(),
        )
        forcing_energy = sum(
            (
                b * b / eigenvalue
                for eigenvalue, b in zip(diagonal_b, forcing)
            ),
            Fraction(),
        )
        leverage = sum(
            (
                g * g / eigenvalue
                for eigenvalue, g in zip(diagonal_b, observable)
            ),
            Fraction(),
        )
        shifted_energy = sum(
            (
                eigenvalue * b * b / (eigenvalue + h) ** 2
                for eigenvalue, b in zip(diagonal_b, forcing)
            ),
            Fraction(),
        )
        self.assertLessEqual(shifted_energy, forcing_energy)
        self.assertLessEqual(actual * actual, leverage * shifted_energy)
        self.assertLessEqual(actual * actual, leverage * forcing_energy)

    def test_two_isolated_positive_values_do_not_bound_trace(self):
        traces = []
        for inverse_epsilon in (4, 8, 16, 32):
            inverse_epsilon_squared = Fraction(inverse_epsilon**2)
            first = 1 - inverse_epsilon_squared
            second = 1 - inverse_epsilon_squared / 4
            d_epsilon = first * second
            self.assertGreater(d_epsilon, 1)

            # c^(-2)=1-D^(-1), so the third factor at z=1 is D^(-1).
            inverse_c_squared = 1 - 1 / d_epsilon
            third = 1 - inverse_c_squared
            endpoint_ratio = first * second * third
            trace = (
                inverse_epsilon_squared
                + inverse_epsilon_squared / 4
                + inverse_c_squared
            )
            self.assertEqual(endpoint_ratio, 1)
            self.assertGreater(inverse_c_squared, 0)
            self.assertLess(inverse_c_squared, 1)
            traces.append(trace)

        self.assertTrue(all(y > x for x, y in zip(traces, traces[1:])))
        self.assertGreater(traces[-1], 1000)

    def test_zero_free_segment_repairs_the_ratio_bound(self):
        t_squared = Fraction(1, 4)
        root_squares = (
            Fraction(1),
            Fraction(9, 4),
            Fraction(16),
            Fraction(121, 4),
        )
        ratio = math.prod(
            float(1 - t_squared / root_squared)
            for root_squared in root_squares
        )
        trace = sum(
            (1 / root_squared for root_squared in root_squares), Fraction()
        )
        self.assertGreater(ratio, 0)
        self.assertLessEqual(float(t_squared * trace), -math.log(ratio))

    def test_high_frequency_observable_vanishes_while_tau_grows(self):
        products = []
        taus = []
        correction_norms = []
        for m in (8, 16, 32, 64):
            length = m
            mode = m**3
            forcing = m
            tau = forcing  # B=1.
            product_bound = (
                8 * forcing * forcing * length
                / (math.pi**2 * mode * mode)
                + forcing * forcing * length / m**20
            )
            ground = (1 - math.sqrt(1 + 4 * forcing * forcing)) / 2
            correction_norm = forcing / (1 - ground)

            self.assertGreater(mode / (length * length), 1)
            self.assertLess(correction_norm, 1)
            products.append(product_bound)
            taus.append(tau)
            correction_norms.append(correction_norm)

        self.assertTrue(all(y < x for x, y in zip(products, products[1:])))
        self.assertTrue(all(y > x for x, y in zip(taus, taus[1:])))
        self.assertTrue(
            all(y > x for x, y in zip(correction_norms, correction_norms[1:]))
        )
        self.assertGreater(correction_norms[-1], 0.99)

    def test_centered_even_mode_transform_obeys_claimed_bound(self):
        length = 40.0
        mode = 640
        cutoff = 2.0

        def centered_mode_transform(t):
            omega = 2 * math.pi * mode / length
            if t == 0:
                return 0.0
            return (
                -2
                * math.sqrt(2)
                * t
                * math.sin(t * length / 2)
                / (math.sqrt(length) * (omega * omega - t * t))
            )

        claimed = 2 * math.sqrt(2 * length) / (math.pi * mode)
        self.assertGreaterEqual(mode, cutoff * length / math.pi)
        for index in range(-200, 201):
            t = cutoff * index / 200
            self.assertLessEqual(abs(centered_mode_transform(t)), claimed)

    def test_note_records_all_required_boundaries(self):
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "P0_INVALIDATED",
            "minus-prime",
            "source Fourier convention",
            "complete exterior lattice",
            "two isolated positive values",
            "zero-free-segment hypothesis",
            "tau_U^2=-d'(U)-1",
            "a_j^2E_{U,j}",
            "No current source estimate proves (7.1)",
            "its matrix is not asserted to have the source Cauchy\n"
            "arithmetic form",
        )
        for phrase in required:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
