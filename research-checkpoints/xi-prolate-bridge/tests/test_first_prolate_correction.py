#!/usr/bin/env python3
"""Independent algebra regressions for the first prolate correction."""

from __future__ import annotations

import unittest

import mpmath as mp


class FirstProlateCorrectionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 90

    @staticmethod
    def hermite_function(n: int, x: mp.mpf) -> mp.mpf:
        return (
            mp.power(2, mp.mpf(1) / 4)
            * mp.hermite(n, mp.sqrt(2 * mp.pi) * x)
            * mp.exp(-mp.pi * x * x)
            / mp.sqrt(mp.power(2, n) * mp.factorial(n))
        )

    @staticmethod
    def polynomial_g1(x: mp.mpf) -> mp.mpf:
        return (
            x**2
            * (
                201
                - 414 * mp.pi * x**2
                + 224 * mp.pi**2 * x**4
                - 32 * mp.pi**3 * x**6
            )
            * mp.exp(-mp.pi * x**2)
            / 128
        )

    def test_hermite_and_polynomial_paths_agree(self) -> None:
        a4 = mp.sqrt(3) / mp.power(2, mp.mpf(11) / 4)
        for x_text in ("0", "0.03125", "0.25", "0.5", "1", "1.75"):
            x = mp.mpf(x_text)
            hermite_path = a4 * (
                mp.sqrt(6) / (8 * mp.pi) * self.hermite_function(0, x)
                + mp.mpf(3) / (64 * mp.pi) * self.hermite_function(4, x)
                - mp.sqrt(105) / (16 * mp.pi) * self.hermite_function(8, x)
            )
            self.assertLess(abs(hermite_path - self.polynomial_g1(x)), mp.mpf("1e-80"))

    def test_zero_integral_and_norm(self) -> None:
        integral = 2 * mp.quad(self.polynomial_g1, [0, 1, mp.inf])
        norm_squared = 2 * mp.quad(
            lambda x: self.polynomial_g1(x) ** 2, [0, 1, mp.inf]
        )
        a4_squared = mp.mpf(3) / mp.power(2, mp.mpf(11) / 2)
        expected_norm_squared = a4_squared * mp.mpf(2073) / (4096 * mp.pi**2)
        self.assertLess(abs(integral), mp.mpf("1e-75"))
        self.assertLess(abs(norm_squared - expected_norm_squared), mp.mpf("1e-75"))

    def test_mellin_identity(self) -> None:
        for s in (mp.mpc("0.25", "0.7"), mp.mpc("1.3", "-0.2"), mp.mpf("2.5")):
            direct = mp.quad(
                lambda x: self.polynomial_g1(x) * mp.power(x, s - 1),
                [0, 1, mp.inf],
            )
            closed = (
                -s
                * (s - 1)
                * (4 * s**2 - 4 * s + 43)
                * mp.power(mp.pi, -s / 2)
                * mp.gamma(s / 2)
                / (512 * mp.pi)
            )
            self.assertLess(abs(direct - closed), mp.mpf("1e-72"))

    def test_source_ratio_first_coefficient(self) -> None:
        r = mp.sqrt(6) / 4
        alpha = mp.sqrt(6) / (32 * mp.pi)
        beta = mp.sqrt(105) / (16 * mp.pi)
        v8_over_v0 = mp.sqrt(70) / 16
        # u_0=-alpha*h_4 and u_4=alpha*h_0-beta*h_8.
        r1 = alpha - beta * v8_over_v0 + alpha * r**2
        self.assertLess(abs(r1 + 3 * mp.sqrt(6) / (32 * mp.pi)), mp.mpf("1e-80"))


if __name__ == "__main__":
    unittest.main()
