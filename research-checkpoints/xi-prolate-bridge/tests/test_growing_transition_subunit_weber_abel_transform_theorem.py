#!/usr/bin/env python3
"""Exact regressions for the subunit Weber Abel-transform theorem."""

from __future__ import annotations

import cmath
import hashlib
import math
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_SUBUNIT_WEBER_ABEL_TRANSFORM_THEOREM.md"
)
NOTE_HASH = "144051cd4ebace4d71a2969ed2f39ad4e622e35a4d5a5c13d73a3912443b1a95"

DEPENDENCIES = {
    "notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md":
        "16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0",
    "tests/test_growing_transition_weber_edge_reciprocal_channel_theorem.py":
        "5be3b86c8538f1234db40373a6562ac226604ed925dad9d13ef7e37516a82df6",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def delta(value: float) -> float:
    return 1.0 - value * value


def ell_inside(value: float) -> float:
    return math.log((1.0 + value) / (1.0 - value))


def flat_inside(value: float, alpha: float, sigma: int) -> complex:
    return (
        math.exp(-math.pi * alpha / 4.0)
        / math.sqrt(delta(value))
        * cmath.exp(0.25j * sigma * alpha * ell_inside(value))
    )


def g_one(value: float, alpha: float, sigma: int) -> complex:
    d_value = delta(value)
    k_value = 1.0 - alpha * alpha / 4.0
    return (
        math.pi * k_value / 8.0
        + alpha / (4.0 * d_value)
        - 1j
        * sigma
        * k_value
        * (ell_inside(value) / 8.0 + value / (4.0 * d_value))
    )


def g_one_prime(value: float, alpha: float, sigma: int) -> complex:
    k_value = 1.0 - alpha * alpha / 4.0
    return (
        alpha * value - 1j * sigma * k_value
    ) / (2.0 * delta(value) ** 2)


class SubunitWeberAbelTransformTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_hash_pinned(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_scope_is_endpoint_normalized_and_fail_closed(self) -> None:
        self.assertIn("endpoint-normalized outward solution", self.text)
        self.assertIn("does **not** identify a cutoff-weighted shell", self.text)
        self.assertIn("two-endpoint Fourier-integral\noperator estimate", self.text)
        self.assertIn("P0_INVALIDATED", self.text)
        self.assertIn("No finite Fourier eigenfunction relation", self.text)

    def test_flat_laplace_boundary_has_suppressed_branch(self) -> None:
        # Evaluate the exact right-half-plane product and approach both
        # lateral boundary values.  The tolerance is first order in epsilon.
        epsilon = 1.0e-8
        for value in (-0.5, -0.2, 0.0, 0.3, 0.5):
            for alpha in (0.0, 1.25, 7.0):
                for sigma in (-1, 1):
                    z_value = epsilon + 1j * sigma * value
                    a_value = 0.5 + 0.25j * alpha
                    direct = (z_value - 1j) ** (-a_value) * (
                        z_value + 1j
                    ) ** (a_value - 1.0)
                    expected = flat_inside(value, alpha, sigma)
                    self.assertLess(
                        abs(direct - expected),
                        2.0e-6 * max(1.0, abs(expected)),
                    )

    def test_flat_boundary_solves_leading_first_order_equation(self) -> None:
        for value in (-0.5, -0.1, 0.2, 0.5):
            for alpha in (0.0, 2.0, 9.0):
                for sigma in (-1, 1):
                    f_value = flat_inside(value, alpha, sigma)
                    derivative = (
                        value + 0.5j * sigma * alpha
                    ) / delta(value) * f_value
                    if sigma == 1:
                        residual = (
                            2j * delta(value) * derivative
                            + (alpha - 2j * value) * f_value
                        )
                    else:
                        residual = (
                            -2j * delta(value) * derivative
                            + (alpha + 2j * value) * f_value
                        )
                    self.assertLess(abs(residual), 2.0e-14)

    def test_exact_gauge_is_angular_prolate_equation(self) -> None:
        for value in (-0.4, 0.2, 1.7):
            for conductor in (17.0, 101.0):
                alpha = 3.25
                p_value = value * value - 1.0
                s_value = 0.7 - 0.2j
                sp_value = -0.3 + 0.8j
                spp_value = 1.1 + 0.4j
                carrier = cmath.exp(1j * conductor * value)
                f_value = carrier * s_value
                fp_value = carrier * (sp_value + 1j * conductor * s_value)
                fpp_value = carrier * (
                    spp_value
                    + 2j * conductor * sp_value
                    - conductor * conductor * s_value
                )
                original = (
                    p_value * fpp_value
                    + (2.0 * value - 2j * conductor * p_value) * fp_value
                    + (conductor * alpha - 2j * conductor * value) * f_value
                )
                gauged = carrier * (
                    p_value * spp_value
                    + 2.0 * value * sp_value
                    + (conductor**2 * p_value + conductor * alpha) * s_value
                )
                self.assertLess(abs(original - gauged), 5.0e-11)

    def test_factored_transport_equation_is_exact(self) -> None:
        value = 0.37
        alpha = 4.2
        conductor = 71.0
        p_value = value * value - 1.0
        phi_value = flat_inside(value, alpha, 1)
        log_phi_prime = -(value + 0.5j * alpha) / p_value
        log_phi_second = (
            -p_value + 2.0 * value * (value + 0.5j * alpha)
        ) / p_value**2
        phi_prime = phi_value * log_phi_prime
        phi_second = phi_value * (
            log_phi_prime**2 + log_phi_second
        )
        g_value = 0.6 - 0.4j
        gp_value = -0.2 + 0.7j
        gpp_value = 1.3 + 0.1j
        f_value = phi_value * g_value
        fp_value = phi_prime * g_value + phi_value * gp_value
        fpp_value = (
            phi_second * g_value
            + 2.0 * phi_prime * gp_value
            + phi_value * gpp_value
        )
        original = (
            p_value * fpp_value
            + (2.0 * value - 2j * conductor * p_value) * fp_value
            + (conductor * alpha - 2j * conductor * value) * f_value
        ) / phi_value
        d_value = (
            -1.0 - 1j * alpha * value + alpha * alpha / 4.0
        ) / p_value
        factored = (
            p_value * gpp_value
            - (1j * alpha + 2j * conductor * p_value) * gp_value
            - d_value * g_value
        )
        self.assertLess(abs(original - factored), 3.0e-12)

    def test_first_transport_coefficient_and_derivative(self) -> None:
        for value in (-0.5, -0.13, 0.0, 0.27, 0.5):
            for alpha in (0.0, 2.0, 8.0):
                p_value = value * value - 1.0
                d_value = (
                    -1.0 - 1j * alpha * value + alpha * alpha / 4.0
                ) / p_value
                transport = -2j * p_value * g_one_prime(value, alpha, 1)
                self.assertLess(abs(transport - d_value), 3.0e-14)

                step = 2.0e-6
                finite_difference = (
                    g_one(value + step, alpha, 1)
                    - g_one(value - step, alpha, 1)
                ) / (2.0 * step)
                self.assertLess(
                    abs(finite_difference - g_one_prime(value, alpha, 1)),
                    2.0e-8,
                )

    def test_lateral_transport_coefficients_are_conjugates(self) -> None:
        for value in (-0.5, 0.0, 0.5):
            for alpha in (0.0, 3.0, 11.0):
                self.assertLess(
                    abs(g_one(value, alpha, -1) - g_one(value, alpha, 1).conjugate()),
                    2.0e-15,
                )
                self.assertLess(
                    abs(
                        g_one_prime(value, alpha, -1)
                        - g_one_prime(value, alpha, 1).conjugate()
                    ),
                    2.0e-15,
                )

    def test_exact_inner_kummer_reduction(self) -> None:
        conductor = 83.0
        alpha = 5.5
        t_value = 1.7 + 0.6j
        n_value = 1.0 + t_value / (2j * conductor)
        # A polynomial supplies independent f, f', and f'' values.
        f_value = 1.0 + 0.4 * t_value - 0.3 * t_value**2 + 0.2 * t_value**3
        ft_value = 0.4 - 0.6 * t_value + 0.6 * t_value**2
        ftt_value = -0.6 + 1.2 * t_value
        fn_value = 2j * conductor * ft_value
        fnn_value = -4.0 * conductor**2 * ftt_value
        p_value = n_value * n_value - 1.0
        original = (
            p_value * fnn_value
            + (2.0 * n_value - 2j * conductor * p_value) * fn_value
            + (conductor * alpha - 2j * conductor * n_value) * f_value
        ) / (4j * conductor)
        a_value = 0.5 + 0.25j * alpha
        kummer = (
            t_value * ftt_value
            + (1.0 - t_value) * ft_value
            - a_value * f_value
        )
        perturbation = 1j / (4.0 * conductor) * (
            -t_value**2 * ftt_value
            + (t_value**2 - 2.0 * t_value) * ft_value
            + t_value * f_value
        )
        self.assertLess(abs(original - kummer - perturbation), 2.0e-12)

    def test_reciprocal_specialization_is_exact(self) -> None:
        for n_value in (2, 3, 7, 31, 10_003):
            value = 1.0 / n_value
            ell_n = math.log((n_value + 1.0) / (n_value - 1.0))
            self.assertAlmostEqual(ell_inside(value), ell_n, places=14)
            self.assertAlmostEqual(
                1.0 / math.sqrt(delta(value)),
                n_value / math.sqrt(n_value * n_value - 1.0),
                places=14,
            )
            for alpha in (0.0, 2.0, 9.0):
                k_value = 1.0 - alpha * alpha / 4.0
                specialized = (
                    math.pi * k_value / 8.0
                    + alpha * n_value**2 / (4.0 * (n_value**2 - 1.0))
                    - 1j
                    * k_value
                    * (
                        ell_n / 8.0
                        + n_value / (4.0 * (n_value**2 - 1.0))
                    )
                )
                self.assertLess(abs(g_one(value, alpha, 1) - specialized), 2e-14)

    def test_subunit_family_has_uniform_flat_value_and_variation(self) -> None:
        # The theorem's finite-c correction is relative.  These exact flat
        # checks pin the n-uniform principal normalization and n^-2 BV scale.
        for alpha in (1.0, 5.0, 13.0):
            envelope = math.exp(-math.pi * alpha / 4.0)
            for n_value in range(2, 1000):
                value = 1.0 / n_value
                transform = flat_inside(value, alpha, 1)
                self.assertLessEqual(abs(transform), 1.155 * envelope)
                n_derivative = abs(
                    -(value**2)
                    * (value + 0.5j * alpha)
                    / delta(value)
                    * transform
                )
                self.assertLessEqual(
                    n_derivative,
                    1.0 * (1.0 + alpha) * envelope / n_value**2,
                )

    def test_endpoint_value_of_first_correction(self) -> None:
        for alpha in (0.0, 2.0, 8.0):
            expected = (
                math.pi * (1.0 - alpha * alpha / 4.0) / 8.0
                + alpha / 4.0
            )
            self.assertLess(abs(g_one(0.0, alpha, 1) - expected), 2.0e-15)


if __name__ == "__main__":
    unittest.main()
