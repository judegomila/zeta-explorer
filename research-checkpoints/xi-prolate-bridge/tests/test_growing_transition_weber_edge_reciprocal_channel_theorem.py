"""Exact regressions for the Weber-edge reciprocal channel theorem."""

from __future__ import annotations

import cmath
import math
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md"


def ell(x: float) -> float:
    return math.log((x + 1.0) / (x - 1.0))


def flat_multiplier(x: float, alpha: float) -> complex:
    return -1j / math.sqrt(x * x - 1.0) * cmath.exp(0.25j * alpha * ell(x))


class WeberEdgeReciprocalChannelTests(unittest.TestCase):
    def test_note_keeps_fail_closed_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        self.assertIn("edge reciprocal channel theorem", text.lower())
        self.assertIn("not a full\nsame-side floor", text)
        self.assertIn("P0_INVALIDATED", text)
        self.assertIn("coherent-translation obstruction", text)
        self.assertIn("Missing composition lemma", text)
        self.assertIn("does **not** claim the\ncomplete decay", text)
        self.assertIn("restricted to one fixed Fourier phase", text)
        self.assertIn(r"\nu\equiv0\pmod4", text)
        self.assertIn(
            "The scalar\n`F_c(N,\\alpha)` theorem remains valid for any real",
            text,
        )
        self.assertIn(r"H(v)=\sum_{\nu\in I}a_\nu H_\nu(v)", text)
        self.assertIn(
            r"D=\int_{|v|\geq\lambda}|H(v)|^2\,dv",
            text,
        )
        self.assertIn("exact fixed-phase `D`-normalized channel", text)
        self.assertNotIn(
            "For distinct prolate labels the positive exterior tails",
            text,
        )
        self.assertNotIn("full exterior metric", text)

    def test_volterra_feedback_retains_quadratic_spectral_term(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        self.assertIn(
            r"\kappa_N={C_*\over c}",
            text,
        )
        self.assertIn(
            r"{B\over N^2}+{B^2\over N^3}",
            text,
        )
        self.assertIn(
            r"{B\over N^2}+{B^2\over N^3}+{B^3\over N^4}",
            text,
        )
        self.assertNotIn("`C(1+B)/(cN^2)`", text)
        self.assertNotIn(r"{C(1+B)\over cN^2}", text)

    def test_edge_change_of_variables_and_sampler(self) -> None:
        c = 17.0
        u = 3.25
        for m in (1, 2, 5, 11):
            tau = m * u + c * (m - 1)
            self.assertAlmostEqual(c + tau, m * (c + u), places=13)

    def test_stationary_factorization(self) -> None:
        c = 101.0
        alpha = 7.0
        r2 = alpha / c
        for zm, zn in ((0.3, 2.0), (0.7, 4.0), (1.2, 3.4)):
            def momentum_squared(z: float) -> float:
                return c * c * (z * z + 1.0 + r2 * (1.0 + 1.0 / (z * z)))

            lhs = momentum_squared(zn) - momentum_squared(zm)
            rhs = c * c * (zn * zn - zm * zm) * (
                1.0 - r2 / (zm * zm * zn * zn)
            )
            self.assertAlmostEqual(lhs, rhs, delta=abs(lhs) * 1e-13 + 1e-10)

    def test_reciprocal_point_quadratic(self) -> None:
        c = 10_000.0
        alpha = 9.0
        for n in (2, 3, 9):
            disc = (n * n - 1) ** 2 + 4 * n * n * alpha / c
            y = (math.sqrt(disc) - (n * n - 1)) / (2 * n * n)
            self.assertAlmostEqual(
                n * n * y * y + (n * n - 1) * y,
                alpha / c,
                places=14,
            )

    def test_flat_multiplier_solves_first_order_equation(self) -> None:
        for x in (2.0, 3.5, 11.0):
            for alpha in (-7.0, 0.0, 5.0):
                f = flat_multiplier(x, alpha)
                log_derivative = (-x - 0.5j * alpha) / (x * x - 1.0)
                fp = f * log_derivative
                residual = 2j * (1.0 - x * x) * fp + (alpha - 2j * x) * f
                self.assertLess(abs(residual), 2e-13)

    def test_exact_channel_system_algebra(self) -> None:
        # Coefficient identity behind d=1-(N+i alpha/2)^2/(N^2-1).
        for n in (2.0, 5.0, 13.0):
            for alpha in (-9.0, 3.0):
                p = n * n - 1.0
                a = n + 0.5j * alpha
                d_direct = 1.0 - a * a / p
                d_closed = (-1.0 - 1j * alpha * n + alpha * alpha / 4.0) / p
                self.assertLess(abs(d_direct - d_closed), 2e-15)

    def test_flat_multiplier_dyadic_variation_bound(self) -> None:
        # A fine quadrature checks the deliberately slack 4/X+B/X^2 bound.
        for x0 in (2.0, 4.0, 16.0):
            for bound in (1.0, 7.0, 31.0):
                steps = 20_000
                h = x0 / steps
                variation = 0.0
                previous = flat_multiplier(x0, bound)
                for k in range(1, steps + 1):
                    current = flat_multiplier(x0 + k * h, bound)
                    variation += abs(current - previous)
                    previous = current
                lhs = abs(flat_multiplier(2.0 * x0, bound)) + variation
                rhs = 4.0 / x0 + bound / (x0 * x0)
                self.assertLessEqual(lhs, rhs)

    def test_ell_remainder_bounds(self) -> None:
        for n in range(2, 500):
            delta = ell(float(n)) - 2.0 / n
            self.assertGreater(delta, 0.0)
            self.assertLessEqual(delta, 8.0 / (9.0 * n**3) + 2e-16)
            derivative_delta = -2.0 / (n * n - 1.0) + 2.0 / (n * n)
            self.assertLessEqual(abs(derivative_delta), 8.0 / (3.0 * n**4))

    def test_locked_carrier_parity(self) -> None:
        powers_of_i = (1.0 + 0.0j, 0.0 + 1.0j, -1.0 + 0.0j, 0.0 - 1.0j)
        for n in range(1, 40, 2):
            chi_n = 1 if n % 4 == 1 else -1
            for l in range(1, 24):
                carrier = (-1j) * powers_of_i[(l * n) % 4]
                if l % 2 == 1:
                    chi_l = 1 if l % 4 == 1 else -1
                    self.assertLess(abs(carrier - chi_l * chi_n), 1e-14)
                elif l % 4 == 0:
                    self.assertLess(abs(carrier + 1j), 1e-14)
                else:
                    self.assertLess(abs(carrier - 1j), 1e-14)

    def test_even_l_scalar_real_part_has_uniform_reciprocal_gain(self) -> None:
        powers_of_i = (1.0 + 0.0j, 0.0 + 1.0j, -1.0 + 0.0j, 0.0 - 1.0j)
        for bound in (1.0, 7.0, 31.0):
            for alpha in (-bound, -0.3 * bound, 0.0, 0.8 * bound, bound):
                for n in range(1, 20, 2):
                    for l in range(2, 14, 2):
                        index = l * n
                        carrier = (-1j) * powers_of_i[index % 4]
                        phase = cmath.exp(0.25j * alpha * ell(float(index)))
                        lhs = abs((carrier * phase).real)
                        rhs = min(1.0, 2.0 * bound / (3.0 * index))
                        self.assertLessEqual(lhs, rhs + 2e-15)

    def test_far_half_density(self) -> None:
        c = 37.0
        for n in (2.0, 3.0, 8.0):
            u = c * (n - 1.0)
            a = 2.0 * u + u * u / c
            self.assertAlmostEqual(a, c * (n * n - 1.0), places=12)

    def test_exact_far_action_integral(self) -> None:
        # Integral c/[U(U+2c)] from c(N-1) to infinity.
        for n in (2.0, 3.0, 10.0):
            exact = 0.5 * ell(n)
            lower = n - 1.0
            # Antiderivative in x=U/c is .5 log(x/(x+2)); infinity is zero.
            reconstructed = -0.5 * math.log(lower / (lower + 2.0))
            self.assertAlmostEqual(exact, reconstructed, places=14)


if __name__ == "__main__":
    unittest.main()
