#!/usr/bin/env python3
"""Exact regression for universal phase synchronization on the 1:q even family."""

from __future__ import annotations

import cmath
from decimal import Decimal, localcontext
from fractions import Fraction as F
import hashlib
from math import gcd, pi, tan
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ONE_EVEN_FAMILY_PHASE_SYNCHRONIZATION_THEOREM.md"

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md":
        "ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1",
    "notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md":
        "a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc",
    "notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md":
        "00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff",
    "notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md":
        "6a704c20640a9c113836904e91c7fafbe12bee0a03d31f623faad988bd306959",
    "notes/SHORT_GAP_TWO_FREQUENCY_PHASE_THEOREM.md":
        "60e1f3fed5218b37a03532cf48db3c26049269a7559bcbede2bf6690e43c3fc7",
    "notes/COMMON_ROOT_LIFT_BOUND_TWO_FREQUENCY_THEOREM.md":
        "ff13a51757d527bdb851c9b6d331518de8b62538cb1e2c4c3a862bb6f9b1e8f8",
    "notes/ONE_FOUR_PHASE_TRANSVERSALITY_THEOREM.md":
        "5c8596f3f674c066b72d09e747e3470435f455d721cc2b0e22b90ca102e4d0ef",
}

Gaussian = tuple[F, F]


def g_add(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] + right[0], left[1] + right[1]


def g_sub(left: Gaussian, right: Gaussian) -> Gaussian:
    return left[0] - right[0], left[1] - right[1]


def g_mul(left: Gaussian, right: Gaussian) -> Gaussian:
    return (
        left[0] * right[0] - left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def g_power(value: Gaussian, exponent: int) -> Gaussian:
    result = F(1), F(0)
    while exponent:
        if exponent & 1:
            result = g_mul(result, value)
        value = g_mul(value, value)
        exponent >>= 1
    return result


def g_abs2(value: Gaussian) -> F:
    return value[0] * value[0] + value[1] * value[1]


def b_value(n: int, x: F) -> Gaussian:
    denominator = (1 + n * n * x * x) ** 2
    return (
        (1 - n * n * x * x) / denominator,
        -2 * n * x / denominator,
    )


def delta_formula(q: int, x: F) -> F:
    numerator = -(q * q - 1) * x * x * (
        3 + (q * q + 1) * x * x - q * q * x**4
    )
    denominator = (1 + x * x) ** 2 * (1 + q * q * x * x) ** 2
    return numerator / denominator


def decimal(value: F) -> Decimal:
    return Decimal(value.numerator) / Decimal(value.denominator)


def high_h(q: int, x: F) -> Decimal:
    aq = F((q * q - 1) ** 2, 4 * q)
    scalar = F(q) + F(1, q) + aq * x * x
    with localcontext() as context:
        context.prec = 90
        m = decimal(scalar)
        return (m + (m * m - 4).sqrt()) / 2


def route_rational_pair(p: int, q: int) -> str:
    divisor = gcd(p, q)
    p, q = p // divisor, q // divisor
    if p >= 2:
        return "frozen-common-root"
    if q % 2:
        return "frozen-antipode"
    if q == 2:
        return "frozen-one-two"
    return "new-one-even"


class OneEvenFamilyPhaseSynchronizationTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_inverse_square_coordinates_are_exact(self) -> None:
        for q in (4, 6, 10, 24):
            for x in (F(1, 9), F(2, 5), F(7, 4)):
                a = b_value(1, x)
                c = b_value(q, x)
                self.assertLess(a[1], 0)
                self.assertLess(c[1], 0)
                ratio = g_abs2(g_sub(c, a)) / (a[1] * c[1])
                expected = F((q - 1) ** 2, 4 * q) * (
                    4 + (q + 1) ** 2 * x * x
                )
                self.assertEqual(ratio, expected)

    def test_common_root_matrix_and_determinant_identity(self) -> None:
        fixtures = (
            (4, F(2, 7), F(3, 2), F(5, 3)),
            (6, F(5, 11), F(-7, 4), F(9, 5)),
            (12, F(7, 3), F(11, 6), F(13, 8)),
        )
        for q, x, r_c, h in fixtures:
            a, c = b_value(1, x), b_value(q, x)
            r_s = h * r_c
            delta = c[0] - a[0]
            m00 = r_c * delta
            m01 = -c[1] * r_s + r_c * a[1]
            m10 = c[1] * r_c - r_s * a[1]
            m11 = r_s * delta
            determinant = m00 * m11 - m01 * m10
            reduced = (
                delta * delta + a[1] * a[1] + c[1] * c[1]
                - a[1] * c[1] * (h + 1 / h)
            )
            self.assertEqual(determinant, r_c * r_s * reduced)

    def test_real_linear_pencil_rows_match_complex_multiplication(self) -> None:
        q, x = 6, F(3, 8)
        a, c = b_value(1, x), b_value(q, x)
        L, M = F(7, 5), F(-11, 9)
        r_c, r_s = F(13, 7), F(17, 6)
        d_a = r_c * L, r_s * M
        left = g_mul(c, d_a)
        a_a = g_mul(a, (L, M))
        right = r_c * a_a[0], r_s * a_a[1]
        difference = g_sub(left, right)
        delta = c[0] - a[0]
        expected = (
            r_c * delta * L + (-c[1] * r_s + r_c * a[1]) * M,
            (c[1] * r_c - r_s * a[1]) * L + r_s * delta * M,
        )
        self.assertEqual(difference, expected)

    def test_filter_and_gauge_multiplier_identities(self) -> None:
        for n in (1, 4, 6, 17):
            for x in (F(1, 8), F(3, 5), F(9, 4)):
                b = b_value(n, x)
                first_order = F(1), n * x
                self.assertEqual(
                    g_mul(g_power(first_order, 2), b),
                    (F(1), F(0)),
                )
                # (1+inx)^2 b_n^2=b_n is P=(I+xD)^2 V modewise.
                self.assertEqual(
                    g_mul(g_power(first_order, 2), g_power(b, 2)),
                    b,
                )

    def test_delta_factorization_and_small_x_sign(self) -> None:
        for q in (4, 6, 8, 20):
            for x in (F(1, 20), F(1, 3), F(1), F(7, 4)):
                a, c = b_value(1, x), b_value(q, x)
                self.assertEqual(c[0] - a[0], delta_formula(q, x))
                if x <= 1:
                    self.assertLess(delta_formula(q, x), 0)

    def test_large_reciprocal_root_is_above_q(self) -> None:
        for q in (4, 6, 8, 20, 50):
            aq = F((q * q - 1) ** 2, 4 * q)
            for x in (F(1, 100), F(1), F(5, 2)):
                h = high_h(q, x)
                self.assertGreater(h, q)
                with localcontext() as context:
                    context.prec = 80
                    lhs = h + 1 / h
                    rhs = decimal(F(q) + F(1, q) + aq * x * x)
                    self.assertLess(abs(lhs - rhs), Decimal("1e-70"))

    def test_small_x_high_branch_has_positive_tau_and_mu(self) -> None:
        for q in (4, 6, 12):
            for x in (F(1, 10), F(2, 5), F(1)):
                a, c = b_value(1, x), b_value(q, x)
                h = high_h(q, x)
                with localcontext() as context:
                    context.prec = 80
                    delta = decimal(c[0] - a[0])
                    tau = (h * decimal(a[1]) - decimal(c[1])) / (h * delta)
                    mu = decimal(a[0]) - decimal(a[1]) * tau
                    self.assertGreater(tau, 0)
                    self.assertGreater(mu, 0)

    def test_amplitude_identity_has_exact_difference_factor(self) -> None:
        fixtures = (
            (F(3, 2), F(7, 5), F(2, 7)),
            (F(9, 4), F(-5, 3), F(4, 9)),
            (F(11, 6), F(13, 8), F(7, 10)),
        )
        for h, tau, v in fixtures:
            left_denominator = (1 + h * h * v * v) * (1 + tau * tau)
            left_numerator = (1 + v * v) * (1 + h * h * tau * tau)
            self.assertEqual(
                left_numerator - left_denominator,
                (h * h - 1) * (tau * tau - v * v),
            )

    def test_large_x_chain_beats_the_angle_budget(self) -> None:
        for q in (4, 6, 10, 30):
            aq = F((q * q - 1) ** 2, 4 * q)
            self.assertGreater(aq / 2, q)
            self.assertGreater(q, 1 / tan(pi / (2 * q)))
            for x in (F(11, 10), F(2), F(10)):
                a, c = b_value(1, x), b_value(q, x)
                h = high_h(q, x)
                with localcontext() as context:
                    context.prec = 80
                    delta = decimal(c[0] - a[0])
                    if delta == 0:
                        continue
                    tau = (h * decimal(a[1]) - decimal(c[1])) / (h * delta)
                    bound = decimal(aq) / 2
                    self.assertGreater(h * abs(tau), bound)
                    self.assertGreater(h * abs(tau), Decimal(str(1 / tan(pi / (2 * q)))))

    def test_delta_zero_high_branch_forces_nonzero_second_row(self) -> None:
        for q in (4, 6, 20):
            # At Delta=0, put alpha=-Im(a)>gamma=-Im(c)>0.
            alpha, gamma = F(q + 3), F(2)
            h_high = alpha / gamma
            h_low = gamma / alpha
            self.assertGreater(h_high, 1)
            self.assertLess(h_low, 1)
            self.assertNotEqual(-gamma + h_high * alpha, 0)
            self.assertEqual(-gamma + h_low * alpha, 0)

    def test_high_harmonic_dominance_forces_alternating_samples(self) -> None:
        for q in (4, 6, 12):
            rho = 1.01
            lows = [cmath.cos((k + 0.37) * pi / q) for k in range(2 * q)]
            values = [lows[k].real + rho * (-1) ** k for k in range(2 * q)]
            self.assertTrue(all(value * (-1) ** k > 0 for k, value in enumerate(values)))
            self.assertTrue(all(values[k] * values[(k + 1) % (2 * q)] < 0
                                for k in range(2 * q)))

    def test_every_rational_primitive_class_has_a_route(self) -> None:
        expected = {
            (1, 2): "frozen-one-two",
            (1, 3): "frozen-antipode",
            (1, 4): "new-one-even",
            (1, 6): "new-one-even",
            (2, 3): "frozen-common-root",
            (3, 8): "frozen-common-root",
            (4, 12): "frozen-antipode",
            (6, 18): "frozen-antipode",
        }
        for pair, route in expected.items():
            self.assertEqual(route_rational_pair(*pair), route)

    def test_note_locks_theorem_mechanism_and_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"\boxed{\text{some phase has }P>0\text{ and }{\cal C}<0.}",
            "exactly two shared sign boundaries",
            "cDA=D(aA)",
            "h+h^{-1}",
            "one fixed weak sign",
            "cyclic variation diminishing",
            "P=(I+xD_t)^2V",
            "opposite nodal\norientations",
            "mu:=a_r-a_i\\tau<0",
            "Delta=0",
            "rho>1",
            "at least `2q` distinct sign boundaries",
            "every abstract two-orbit hull",
            "conditional on\nthe right edge being attained",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        forbidden = (
            "RH_PROVED",
            "equation (5.2) is proved",
            "every finite attained edge is synchronized",
            "the actual zeta right edge has two orbits",
            "routing contraction is proved",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
