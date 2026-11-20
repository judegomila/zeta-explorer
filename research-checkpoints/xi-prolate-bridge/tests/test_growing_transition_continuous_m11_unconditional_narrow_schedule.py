#!/usr/bin/env python3
"""Regressions for the unconditional continuous m=l=1 narrow region."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import re
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md"
)
FALLBACK = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_NEGATIVE_PACKET_THEOREM.md"
)
NOTE_HASH = "6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c"
FALLBACK_HASH = "0ec602eb10822b3a44d5c1f59b2d252d61fa9d6ba6fcc0d620dbc75f3d2edeb4"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ContinuousNarrowScheduleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 70
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_fallback_is_immutable(self) -> None:
        self.assertEqual(sha256(FALLBACK), FALLBACK_HASH)

    def test_candidate_hash_is_frozen(self) -> None:
        self.assertNotEqual(NOTE_HASH, "PENDING")
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_scope_wall_is_explicit(self) -> None:
        required = (
            "only about the continuous physical `m=l=1` block",
            "nothing about a discrete prime shell",
            "complete central negative packet",
            "actual leakage factors",
            "physical endpoint row",
            "(\\chi_\\gamma z_\\gamma)^2",
            "8\\chi_\\alpha\\chi_\\beta",
            "independent uniform lower",
            "none of the discrete or modal",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_tex_and_general_c_regressions(self) -> None:
        forbidden = (
            "{1\\over2},,1",
            "2hA_1,,1",
            "=1,quad",
            "+left(",
            "sqrt c,L",
            "sqrt c,L^2",
            "|leq",
            "(\\,cdot\\,",
            "X=CL=L/5",
            ",qquad",
            ",quad",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        self.assertEqual(
            self.text.count("\\begin{aligned}"),
            self.text.count("\\end{aligned}"),
        )
        self.assertEqual(self.text.count("\\["), 74)
        self.assertIsNone(
            re.search(
                r"\\tag\{[^}]+\}\s*\n\\end\{aligned\}",
                self.text,
            )
        )
        self.assertIn("`X=CL` and", self.text)
        self.assertIn("a_i(L)=a_i+O(L^{-1})", self.text)
        self.assertIn("actual `L`-dependent nodes", self.text)
        self.assertIn("E_{-\\alpha}^2", self.text)

    def test_region_allows_large_gap_with_tiny_base(self) -> None:
        h_value = mp.pi / 4
        a_one = mp.mpf("0.005")
        c_gap = mp.mpf("1.1")
        epsilon = mp.mpf("0.1")
        decisive = h_value * c_gap + (
            5 * h_value + 3 * epsilon / 2
        ) * a_one
        self.assertLess(decisive, 1)
        upper = min(
            mp.mpf("0.5"),
            1 - h_value * c_gap - 2 * h_value * a_one,
            1 - 2 * h_value * a_one,
        )
        self.assertGreater(upper, h_value * a_one)
        reverse_exponent = (
            -1
            - h_value * c_gap
            + (5 * h_value + 3 * epsilon / 2) * a_one
        )
        self.assertLess(reverse_exponent, 0)

    def test_safe_example_satisfies_full_open_region(self) -> None:
        h_value = mp.pi / 4
        a_one = mp.mpf(1) / 20
        c_gap = mp.mpf(1) / 5
        epsilon = mp.mpf(1) / 10
        theta = mp.mpf(1) / 3
        decisive = h_value * c_gap + (
            5 * h_value + 3 * epsilon / 2
        ) * a_one
        self.assertLess(decisive, 1)
        self.assertLess(0, epsilon)
        self.assertLess(epsilon, 2 * h_value)
        upper = min(
            mp.mpf("0.5"),
            1 - h_value * c_gap - 2 * h_value * a_one,
            1 - 2 * h_value * a_one,
        )
        self.assertLess(h_value * a_one, theta)
        self.assertLess(theta, upper)

    def test_all_exponent_margins_are_positive(self) -> None:
        h_value = mp.pi / 4
        a_one = mp.mpf(1) / 20
        c_gap = mp.mpf(1) / 5
        epsilon = mp.mpf(1) / 10
        s_value = 2 * h_value + epsilon
        margins = (
            1 - h_value * c_gap - (5 * h_value + 3 * epsilon / 2) * a_one,
            (s_value - h_value) * a_one,
            mp.mpf("0.5") - (h_value + s_value / 2) * a_one,
            1 - h_value * (a_one + c_gap) - s_value * a_one,
        )
        for margin in margins:
            self.assertGreater(margin, 0)

    def test_flat_barrier_action_is_exact(self) -> None:
        for alpha in (mp.mpf("2.5"), mp.mpf(7), mp.mpf(19)):
            root = mp.sqrt(alpha**2 - 4)
            x_minus = (alpha - root) / 4
            x_plus = (alpha + root) / 4
            action = mp.quad(
                lambda x_value: mp.sqrt(
                    -(1 - alpha / (2 * x_value) + 1 / (4 * x_value**2))
                ),
                [x_minus, (x_minus + x_plus) / 2, x_plus],
            )
            self.assertLess(
                abs(action - (mp.pi * alpha / 4 - mp.pi / 2)),
                mp.mpf("1e-55"),
            )

    def test_tricomi_far_remainder_has_claimed_scale(self) -> None:
        for alpha in (mp.mpf(7), mp.mpf(19)):
            parameter = mp.mpf("0.5") + 1j * alpha / 4
            x_value = 64 * (1 + alpha) ** 3
            z_value = -2j * x_value
            leading = mp.power(z_value, -parameter)
            ratio = mp.hyperu(parameter, 1, z_value) / leading - 1
            scale = abs(parameter) ** 2 / abs(z_value)
            self.assertLess(abs(ratio), 3 * scale)

    def test_hk_mixed_derivative_identity(self) -> None:
        conductor = mp.mpf(1009)
        beta = mp.mpf(7)

        def f_value(x_value: mp.mpf) -> mp.mpf:
            return mp.sqrt(conductor) / (
                x_value * mp.sqrt(conductor**2 - x_value**2)
            )

        def g_value(y_value: mp.mpf) -> mp.mpf:
            b_value = (y_value**2 - conductor**2) / conductor
            return 1 / mp.sqrt(b_value + beta + 1 / b_value)

        def full_value(x_value: mp.mpf, y_value: mp.mpf) -> mp.mpf:
            return f_value(x_value) * g_value(y_value) / mp.log(
                y_value / x_value
            )

        for x_value, y_value in (
            (mp.mpf(400), mp.mpf(1040)),
            (mp.mpf(900), mp.mpf(1100)),
        ):
            r_value = mp.log(y_value / x_value)
            f_now = f_value(x_value)
            g_now = g_value(y_value)
            f_prime = mp.diff(f_value, x_value)
            g_prime = mp.diff(g_value, y_value)
            claimed = f_prime * (
                g_prime / r_value - g_now / (y_value * r_value**2)
            ) + f_now * (
                g_prime / (x_value * r_value**2)
                - 2 * g_now / (x_value * y_value * r_value**3)
            )
            direct = mp.diff(
                lambda xx: mp.diff(
                    lambda yy: full_value(xx, yy), y_value
                ),
                x_value,
            )
            self.assertLess(abs(direct - claimed), mp.mpf("1e-60"))

    def test_unimodality_crossings_are_upward(self) -> None:
        for k_value in (1, 2):
            for z_value in (mp.mpf("1.02"), mp.mpf("1.4"), mp.mpf(3)):
                q_value = lambda t_value: (
                    k_value * (1 - t_value**2)
                    - mp.log(z_value / t_value) * (1 - 2 * t_value**2)
                )
                samples = [
                    mp.mpf("0.001")
                    + j * (mp.mpf("0.998") / 2000)
                    for j in range(2001)
                ]
                crossings = []
                for left, right in zip(samples, samples[1:]):
                    if q_value(left) <= 0 < q_value(right):
                        crossings.append((left, right))
                self.assertEqual(len(crossings), 1)
                root = mp.findroot(q_value, crossings[0])
                self.assertLess(root, 1 / mp.sqrt(2))
                derivative_at_root = (
                    (1 - 2 * root**2) / root
                    + 2 * k_value * root / (1 - 2 * root**2)
                )
                self.assertGreater(derivative_at_root, 0)

    def test_j1_j2_bounds_have_correct_powers(self) -> None:
        conductor = mp.mpf(10000)
        radius = mp.mpf(20)
        log_a = mp.log(conductor / (2 * mp.pi))
        y_zero = conductor + radius

        def f_value(x_value: mp.mpf) -> mp.mpf:
            return mp.sqrt(conductor) / (
                x_value * mp.sqrt(conductor**2 - x_value**2)
            )

        def abs_f_prime(x_value: mp.mpf) -> mp.mpf:
            f_now = f_value(x_value)
            return abs(
                f_now
                * (-1 / x_value + x_value / (conductor**2 - x_value**2))
            )

        r_zero = lambda x_value: mp.log(y_zero / x_value)
        intervals = [2 * mp.pi, conductor / 2, conductor - radius]
        j_one = mp.quad(
            lambda x_value: abs_f_prime(x_value) / r_zero(x_value),
            intervals,
        )
        j_two = mp.quad(
            lambda x_value: f_value(x_value)
            / (x_value * r_zero(x_value) ** 2),
            intervals,
        )
        bound_one = radius ** (-mp.mpf("1.5")) + 1 / (
            mp.sqrt(conductor) * log_a
        )
        bound_two = radius ** (-mp.mpf("1.5")) + 1 / (
            mp.sqrt(conductor) * log_a**2
        )
        self.assertLess(j_one, 5 * bound_one)
        self.assertLess(j_two, 5 * bound_two)

    def test_arch_symbol_derivatives_have_both_regimes(self) -> None:
        phi = lambda r_value: 1 / mp.sinh(r_value) - 1 / r_value
        for r_value in (mp.mpf("1e-3"), mp.mpf("0.02"), mp.mpf("0.4")):
            self.assertLess(abs(phi(r_value)), r_value)
            self.assertLess(abs(mp.diff(phi, r_value)), 2)
            self.assertLess(abs(mp.diff(phi, r_value, 2)), 2 * r_value)
        for r_value in (mp.mpf(1), mp.mpf(3), mp.mpf(9)):
            for order in range(3):
                self.assertLess(
                    abs(mp.diff(phi, r_value, order)),
                    4 * r_value ** (-1 - order),
                )

    def test_two_cluster_matrix_has_m_negative_eigenvalues(self) -> None:
        h_value = mp.pi / 4
        a_nodes = [mp.mpf("-0.7"), mp.mpf("0.4"), mp.mpf("1.5")]
        b_nodes = [mp.mpf("-1.1"), mp.mpf("0.2"), mp.mpf("1.9")]
        dimension = len(a_nodes)
        scale = mp.mpf(30)
        cross = mp.matrix(
            [
                [
                    2
                    * mp.sinh(h_value * (scale + a_nodes[i] - b_nodes[j]))
                    / (scale + a_nodes[i] - b_nodes[j])
                    for j in range(dimension)
                ]
                for i in range(dimension)
            ]
        )
        full = mp.matrix(2 * dimension)
        for i in range(dimension):
            for j in range(dimension):
                full[i, dimension + j] = cross[j, i]
                full[dimension + i, j] = cross[i, j]
        eigenvalues = list(mp.eigsy(full, eigvals_only=True))
        self.assertEqual(sum(value < 0 for value in eigenvalues), dimension)


if __name__ == "__main__":
    unittest.main()
