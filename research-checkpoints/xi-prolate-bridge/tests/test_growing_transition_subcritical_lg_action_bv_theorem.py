#!/usr/bin/env python3
"""Regressions for the subcritical LG action-BV radial theorem."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md"

NOTE_HASH = "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c"
PROTECTED_HASHES = {
    "P2_SOURCE_LOCK.json":
        "8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "notes/LEADING_PROLATE_OSCILLATION_THEOREM.md":
        "d65e9221642b09cb66b0f0c46d716f5d7fae98980f4c3ed3289033dacb9a266b",
}


def tau(radius: mp.mpf, q: mp.mpf) -> mp.mpf:
    upper = mp.sqrt(q)
    return mp.quad(
        lambda v: mp.sqrt((1 + v * v) / (1 + radius * radius * v * v)),
        [0, upper],
    )


def tau_prime(radius: mp.mpf, q: mp.mpf) -> mp.mpf:
    return mp.sqrt(1 + q) / (2 * mp.sqrt(q) * mp.sqrt(1 + radius * radius * q))


def psi(radius: mp.mpf, q: mp.mpf) -> mp.mpf:
    value = tau(radius, q)
    radius2 = radius * radius
    return (
        1 / (16 * value * value)
        - 1 / (4 * q * (1 + q))
        + (3 + (8 + radius2) * q + 6 * radius2 * q * q)
        / (16 * q * (1 + q) ** 3)
    )


def rq_derivative(radius: mp.mpf, q: mp.mpf, r_order: int, q_order: int) -> mp.mpf:
    log_radius = mp.log(radius)
    log_q = mp.log(q)

    def in_q(log_q_value: mp.mpf, log_radius_value: mp.mpf) -> mp.mpf:
        return psi(mp.exp(log_radius_value), mp.exp(log_q_value))

    def after_q(log_radius_value: mp.mpf) -> mp.mpf:
        if q_order == 0:
            return in_q(log_q, log_radius_value)
        return mp.diff(lambda value: in_q(value, log_radius_value), log_q, q_order)

    if r_order == 0:
        return after_q(log_radius)
    return mp.diff(after_q, log_radius, r_order)


def elliptic_data(radius: mp.mpf) -> tuple[mp.mpf, mp.mpf]:
    parameter = 1 - radius * radius
    j_value = mp.ellipk(parameter)
    c_value = mp.ellipe(parameter) - radius * radius * j_value
    return j_value, c_value


class GrowingTransitionSubcriticalLGActionBVTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 70

    def test_frozen_note_and_dependency_hashes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_exact_dunster_numerator_rescaling(self) -> None:
        # z^2=1+a*q and kappa^2=1-a.  Dunster (3.4), m=0, has
        # (1-kappa^2){6z^4-(3+kappa^2)z^2-2kappa^2}.
        for a in (F(1, 100), F(1, 3), F(3, 4), F(1)):
            for q in (F(1, 7), F(2), F(13, 2)):
                z2 = 1 + a * q
                kappa2 = 1 - a
                left = a * (6 * z2 * z2 - (3 + kappa2) * z2 - 2 * kappa2)
                right = a * a * (3 + (8 + a) * q + 6 * a * q * q)
                self.assertEqual(left, right)

    def test_pole_cancellation_and_endpoint_value(self) -> None:
        # The three pole numerators are 1,-4,3.  The constant term is
        # (a+2)/12 after inserting tau^2=q+(1-a)q^2/3+....
        self.assertEqual(F(1) - F(4) + F(3), 0)
        for a in (F(0), F(1, 7), F(2, 3), F(1)):
            tau_square_q2 = (1 - a) / 3
            first_constant = -tau_square_q2 / 16
            second_constant = F(1, 4)
            third_constant = (a - 1) / 16
            endpoint = first_constant + second_constant + third_constant
            self.assertEqual(endpoint, (a + 2) / 12)

        for radius in (mp.mpf("0.02"), mp.mpf("0.2"), mp.mpf("0.8")):
            expected = (radius * radius + 2) / 12
            actual = psi(radius, mp.mpf("1e-18"))
            self.assertLess(abs(actual - expected), mp.mpf("2e-17"))

    def test_tau_scaling_and_derivative(self) -> None:
        for radius in (mp.mpf("0.03"), mp.mpf("0.3"), mp.mpf("0.9")):
            for q in (mp.mpf("1e-4"), mp.mpf("0.2"), mp.mpf("3"),
                      4 / (radius * radius)):
                numerical = mp.diff(lambda value: tau(radius, value), q)
                self.assertLess(abs(numerical / tau_prime(radius, q) - 1), mp.mpf("2e-40"))

    def test_three_region_first_two_log_derivatives(self) -> None:
        # Numerical stress of the scale-invariant pointwise bounds used in
        # the analytic integrations.  It is a regression, not a proof by grid.
        for radius in (mp.mpf("0.03"), mp.mpf("0.12"), mp.mpf("0.55")):
            radius2 = radius * radius
            points = (
                (mp.mpf("0.03"), mp.mpf(1)),
                (mp.mpf("2"), 2 ** -2 + radius2 / 2),
                (mp.mpf("0.2") / radius2, None),
                (mp.mpf("4") / radius2, radius2 / (4 / radius2) + (4 / radius2) ** -2),
                (mp.mpf("40") / radius2, radius2 / (40 / radius2) + (40 / radius2) ** -2),
            )
            for q, supplied_scale in points:
                if q <= 1:
                    scale = mp.mpf(1)
                elif q <= 1 / radius2:
                    scale = q ** -2 + radius2 / q
                else:
                    scale = radius2 / q + q ** -2
                if supplied_scale is not None and q > 1:
                    scale = supplied_scale
                for r_order, q_order in ((0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (0, 2)):
                    value = abs(rq_derivative(radius, q, r_order, q_order))
                    self.assertLess(value / scale, mp.mpf("400"),
                                    (radius, q, r_order, q_order, value / scale))

    def test_exact_action_derivatives(self) -> None:
        c_value = mp.mpf("137.5")
        for radius in (mp.mpf("0.03"), mp.mpf("0.2"), mp.mpf("0.7")):
            j_value, c_action = elliptic_data(radius)
            derivative_c = mp.diff(lambda rr: elliptic_data(rr)[1], radius)
            self.assertLess(abs(derivative_c + radius * j_value), mp.mpf("1e-55"))

            for x in (mp.mpf("0.01"), mp.mpf("0.4"), mp.mpf("3")):
                t_value = mp.quad(
                    lambda v: mp.sqrt((v * v + radius * radius) / (1 + v * v)),
                    [0, x],
                )
                i_value = mp.quad(
                    lambda v: 1 / mp.sqrt((1 + v * v) * (radius * radius + v * v)),
                    [0, x],
                )
                derivative_t = mp.diff(
                    lambda rr: mp.quad(
                        lambda v: mp.sqrt((v * v + rr * rr) / (1 + v * v)),
                        [0, x],
                    ),
                    radius,
                )
                by_sigma = c_value * derivative_t / (c_value * derivative_c)
                self.assertLess(abs(by_sigma + i_value / j_value), mp.mpf("2e-50"))

                derivative_completed = (c_value * (derivative_t + derivative_c)) / (
                    c_value * derivative_c
                )
                self.assertLess(
                    abs(derivative_completed - (1 - i_value / j_value)),
                    mp.mpf("2e-50"),
                )
                self.assertGreater(t_value, 0)

    def test_probability_score_is_centered(self) -> None:
        for radius in (mp.mpf("0.02"), mp.mpf("0.15"), mp.mpf("0.8")):
            j_value, c_value = elliptic_data(radius)
            expected = c_value / ((1 - radius * radius) * j_value)
            actual = mp.quad(
                lambda t: (
                    radius * radius / (radius * radius + t * t)
                    / (j_value * mp.sqrt((1 + t * t) * (radius * radius + t * t)))
                ),
                [0, 1, mp.inf],
            )
            self.assertLess(abs(expected - actual), mp.mpf("2e-50"))
            self.assertLessEqual(expected, mp.pi / (2 * j_value) + mp.mpf("1e-50"))

    def test_fixed_phase_velocity_is_uniform(self) -> None:
        for radius in (mp.mpf("0.01"), mp.mpf("0.1"), mp.mpf("0.6")):
            for q in (mp.mpf("1e-4"), mp.mpf("0.2"), mp.mpf("2"),
                      3 / (radius * radius), 100 / (radius * radius)):
                value = tau(radius, q)
                h_value = q * tau_prime(radius, q) / value
                b_value = mp.diff(lambda u: mp.log(tau(mp.exp(u), q)), mp.log(radius))
                velocity = -(2 + b_value) / h_value
                self.assertGreaterEqual(h_value, mp.mpf("0.5") - mp.mpf("1e-45"))
                self.assertLessEqual(h_value, mp.mpf(1) + mp.mpf("1e-45"))
                self.assertGreaterEqual(b_value, -1 - mp.mpf("1e-45"))
                self.assertLessEqual(b_value, mp.mpf("1e-45"))
                self.assertLessEqual(abs(velocity), 4 + mp.mpf("1e-40"))

    def test_bessel_carrier_matrix_has_bounded_weight(self) -> None:
        maximum = mp.mpf(0)
        for exponent in range(-10, 11):
            for multiplier in (mp.mpf(1), mp.mpf("1.7"), mp.mpf("3.2")):
                s = multiplier * mp.power(10, exponent)
                weighted = s * (mp.besselj(0, s) ** 2 + mp.bessely(0, s) ** 2)
                maximum = max(maximum, weighted)
        self.assertLess(maximum, mp.mpf("6"))

    def test_log_four_cutoff_is_lower_order(self) -> None:
        for length in (mp.mpf("1e3"), mp.mpf("1e6"), mp.mpf("1e12")):
            alpha0 = mp.log(length) ** 4
            volterra = mp.log(2 + alpha0) / alpha0
            action_bv = mp.log(length)
            self.assertLess(volterra, mp.mpf("0.02"))
            self.assertLess(action_bv / length, mp.mpf("0.01"))

    def test_scope_and_source_caveats_are_serialized(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"\alpha_0=(\log L)^4",
            r"1-4+3=0",
            r"\Psi_r(0)={r^2+2\over12}",
            r"\partial_\sigma\{c[T_r(x)+C(r)]\}=1-u_r(x)",
            r"\mathcal N_r={J(r)\over\pi c}\{1+\varepsilon_r\}",
            "equations (3.1)--(3.4)",
            "arXiv:1601.00699",
            "uniform asymptotic theorem is **not** used",
            "fixed positive lower bound for `r`",
            "At fixed `q`, the same",
            "fixed-`q` logarithmic derivative is asserted only to be `O(1)`",
            r"j=0,1.                    \tag{5.10}",
            r"\tag{5.10a}",
            r"R_x=(r\partial_r)|_x",
            r"\tag{5.10b}",
            r"\sup_{x>0}\operatorname {Var}",
            "same-side Hankel",
            "reflected reciprocal",
            "no endpoint-shear coefficient estimate",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, text)

        forbidden = (
            "Dunster's theorem proves (0.5)",
            "the sampler assembly is therefore bounded",
            "the reflected reciprocal block is positive",
            "this proves RH",
            "fixed physical `q`",
            "fixed-physical-",
            r"j=0,1,2.                  \tag{5.10}",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, text)

    def test_tex_and_control_bytes_survive_serialization(self) -> None:
        for path in (NOTE, Path(__file__)):
            bad = [value for value in path.read_bytes() if value < 32 and value not in (9, 10)]
            self.assertEqual(bad, [], str(path))

        text = NOTE.read_text(encoding="utf-8")
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(text.count("\n\\[\n"), text.count("\n\\]\n"))
        for malformed in ("{cal N}", ",qquad", "k^2=1-r^2", "\n\\[\n\\[\n"):
            self.assertNotIn(malformed, text)


if __name__ == "__main__":
    unittest.main()
