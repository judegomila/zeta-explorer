#!/usr/bin/env python3
"""Regressions for the post-Plemelj regular action reduction theorem."""

from __future__ import annotations

from collections import Counter
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_POST_PLEMELJ_REGULAR_ACTION_REDUCTION_THEOREM.md"

# Patched after the note bytes are frozen.
NOTE_HASH = "c7793bec967d219d06eecee76f5606b871b77b75f068648fcf2607977791afd8"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md":
        "a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85",
    "tests/test_growing_transition_complete_central_plemelj_cauchy_floor_theorem.py":
        "b9f9cf3d76554b988d7c6d9408130a9ab2b45d37a1862279e139ed7e62edbe61",
    "notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md":
        "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c",
    "tests/test_growing_transition_subcritical_lg_action_bv_theorem.py":
        "a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92",
    "notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md":
        "16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0",
    "tests/test_growing_transition_weber_edge_reciprocal_channel_theorem.py":
        "5be3b86c8538f1234db40373a6562ac226604ed925dad9d13ef7e37516a82df6",
    "notes/GROWING_TRANSITION_BOTH_MISS_RECIPROCAL_CORE_THEOREM.md":
        "0211d021fa37b423f41b2839aeda96630aaac931de0ea3d7d028f95705de29a8",
    "tests/test_growing_transition_both_miss_reciprocal_core_theorem.py":
        "0ec59c581c1109e07d57306dc3eb6752f3ba3a4080cbf4b2683c1ddfe3b41d4c",
    "P2_SOURCE_LOCK.json":
        "8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a",
}


def divisors(number: int) -> list[int]:
    return [candidate for candidate in range(1, number + 1) if number % candidate == 0]


def factorization(number: int) -> Counter[int]:
    factors: Counter[int] = Counter()
    prime = 2
    while prime * prime <= number:
        while number % prime == 0:
            factors[prime] += 1
            number //= prime
        prime += 1
    if number > 1:
        factors[number] += 1
    return factors


def mangoldt_basis(number: int) -> Counter[int]:
    factors = factorization(number)
    if len(factors) != 1:
        return Counter()
    return Counter({next(iter(factors)): 1})


def add_basis(target: Counter[int], source: Counter[int], scale: F) -> None:
    for prime, coefficient in source.items():
        target[prime] += scale * coefficient
        if target[prime] == 0:
            del target[prime]


def ell_basis(number: int, weights: dict[int, F]) -> Counter[int]:
    result: Counter[int] = Counter()
    for n_value in divisors(number):
        if n_value < 2:
            continue
        add_basis(result, mangoldt_basis(n_value), weights.get(number // n_value, F(0)))
    return result


class GrowingTransitionPostPlemeljRegularActionReductionTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 60

    def test_frozen_note_and_dependency_hashes(self) -> None:
        self.assertEqual(hashlib.sha256(NOTE.read_bytes()).hexdigest(), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_finite_fejer_ordered_product_has_two_unsymmetrized_weights(self) -> None:
        weights = {
            1: F(1),
            2: F(3, 4),
            3: F(2, 5),
            4: F(1, 7),
            5: F(3, 11),
            6: F(1, 13),
        }
        for product in range(2, 41):
            ordered: Counter[int] = Counter()
            for m_value in divisors(product):
                quotient = product // m_value
                add_basis(
                    ordered,
                    ell_basis(quotient, weights),
                    weights.get(m_value, F(0)),
                )

            raw: Counter[int] = Counter()
            for n_value in divisors(product):
                mangoldt = mangoldt_basis(n_value)
                if not mangoldt:
                    continue
                quotient = product // n_value
                for m_value in divisors(quotient):
                    l_value = quotient // m_value
                    add_basis(
                        raw,
                        mangoldt,
                        weights.get(m_value, F(0)) * weights.get(l_value, F(0)),
                    )
            self.assertEqual(ordered, raw, product)

    def test_finite_fejer_center_cancellation_precedes_the_sampler_limit(self) -> None:
        weights = {
            1: F(1, 2),
            2: F(1, 3),
            3: F(1, 5),
            4: F(1, 7),
            5: F(1, 11),
            6: F(1, 13),
        }
        for product in range(2, 61):
            unrestricted: Counter[int] = Counter()
            both_miss: Counter[int] = Counter()
            for n_value in divisors(product):
                mangoldt = mangoldt_basis(n_value)
                quotient = product // n_value
                for m_value in divisors(quotient):
                    l_value = quotient // m_value
                    weight = weights.get(m_value, F(0)) * weights.get(l_value, F(0))
                    add_basis(unrestricted, mangoldt, weight)
                    if m_value >= 2 and l_value >= 2:
                        add_basis(both_miss, mangoldt, weight)

            retained = unrestricted.copy()
            add_basis(retained, both_miss, F(-1))
            expected = ell_basis(product, weights)
            expected = Counter({prime: 2 * weights[1] * value for prime, value in expected.items()})
            add_basis(expected, mangoldt_basis(product), -(weights[1] ** 2))
            self.assertEqual(retained, expected, product)

        first_weights = {1: F(1, 2)}
        for product in range(2, 40):
            expected = mangoldt_basis(product)
            expected = Counter({prime: F(1, 4) * value for prime, value in expected.items()})
            ell_first = ell_basis(product, first_weights)
            retained = Counter({prime: 2 * first_weights[1] * value for prime, value in ell_first.items()})
            add_basis(retained, mangoldt_basis(product), -(first_weights[1] ** 2))
            self.assertEqual(retained, expected, product)

    def test_bk_gap_sums_give_the_exact_sequence_constants(self) -> None:
        hilbert_perturbation = 2 * (mp.mpf(1) / (6 * mp.pi)) * (mp.pi ** 2 / 6)
        square_gap = 2 * (mp.mpf(4) / (9 * mp.pi ** 2)) * (mp.pi ** 2 / 6)
        self.assertLess(abs(hilbert_perturbation - mp.pi / 18), mp.mpf("1e-55"))
        self.assertLess(abs(square_gap - mp.mpf(4) / 27), mp.mpf("1e-55"))

        for index_gap in range(1, 50):
            for epsilon_gap in (-mp.pi / 2, -mp.pi / 7, 0, mp.pi / 7, mp.pi / 2):
                delta = 2 * mp.pi * index_gap + epsilon_gap
                self.assertGreaterEqual(
                    abs(delta) + mp.mpf("1e-50"),
                    3 * mp.pi * index_gap / 2,
                )
                error = abs(1 / delta - 1 / (2 * mp.pi * index_gap))
                self.assertLessEqual(
                    error,
                    1 / (6 * mp.pi * index_gap * index_gap) + mp.mpf("1e-50"),
                )

    def test_two_integrations_by_parts_have_the_recorded_signs(self) -> None:
        # A(y)=1+2y-3y^2+5y^3, so dA'=A''dy in the final Stieltjes term.
        amplitude = lambda y: 1 + 2 * y - 3 * y * y + 5 * y ** 3
        derivative = lambda y: 2 - 6 * y + 15 * y * y
        second = lambda y: -6 + 30 * y
        for delta in (mp.mpf("1.7"), mp.mpf("6.2"), mp.mpf("13.4")):
            direct = mp.quad(lambda y: amplitude(y) * mp.exp(1j * delta * y), [0, 1])
            first_boundary = (
                amplitude(1) * mp.exp(1j * delta) - amplitude(0)
            ) / (1j * delta)
            second_boundary = -(
                derivative(1) * mp.exp(1j * delta) - derivative(0)
            ) / (1j * delta) ** 2
            stieltjes = mp.quad(
                lambda y: mp.exp(1j * delta * y) * second(y), [0, 1]
            ) / (1j * delta) ** 2
            self.assertLess(abs(direct - first_boundary - second_boundary - stieltjes), mp.mpf("1e-52"))

    def test_half_density_y_derivative_is_exact(self) -> None:
        for a_j, a_k, x_value, c_value in (
            (mp.mpf("0.03"), mp.mpf("0.4"), mp.mpf("1.1"), mp.mpf("90")),
            (mp.mpf("0.2"), mp.mpf("0.8"), mp.mpf("3.0"), mp.mpf("500")),
        ):
            # Only the action difference enters the displayed identity.
            # Use F(a)=a+a^2/7 as a smooth exact test action and impose
            # sigma_j-sigma_k=-c(F_j-F_k)/2.
            f_j = a_j + a_j * a_j / 7
            f_k = a_k + a_k * a_k / 7
            sigma_gap = -c_value * (f_j - f_k) / 2

            def cb(x_arg: mp.mpf) -> mp.mpf:
                u_j = (x_arg * x_arg + a_j) ** mp.mpf("0.25")
                u_k = (x_arg * x_arg + a_k) ** mp.mpf("0.25")
                return (u_j / u_k + u_k / u_j) / 2

            b_j = mp.sqrt(x_value * x_value + a_j)
            b_k = mp.sqrt(x_value * x_value + a_k)
            p_bar = -c_value * (a_j - a_k) / (
                sigma_gap * mp.sqrt(1 + x_value * x_value) * (b_j + b_k)
            )
            numerical = mp.diff(cb, x_value) / (-p_bar)
            displayed = (
                -sigma_gap
                / c_value
                * x_value
                * mp.sqrt(1 + x_value * x_value)
                * (a_j - a_k)
                / (4 * (b_j * b_k) ** mp.mpf("2.5"))
            )
            self.assertLess(abs(numerical - displayed), mp.mpf("1e-48"))

    def test_hankel_christoffel_darboux_identity_and_hard_boundary(self) -> None:
        for x_value, z_value, cutoff in (
            (mp.mpf("0.2"), mp.mpf("0.7"), mp.mpf("3.2")),
            (mp.mpf("0.6"), mp.mpf("1.3"), mp.mpf("8.1")),
        ):
            integral = mp.quad(
                lambda t: t * mp.besselj(0, t * x_value) * mp.besselj(0, t * z_value),
                [0, cutoff],
            )
            closed = cutoff * (
                x_value * mp.besselj(1, cutoff * x_value) * mp.besselj(0, cutoff * z_value)
                - z_value * mp.besselj(0, cutoff * x_value) * mp.besselj(1, cutoff * z_value)
            ) / (x_value * x_value - z_value * z_value)
            self.assertLess(abs(integral - closed), mp.mpf("1e-50"))

        z_value = mp.mpf("0.8")
        cutoff = mp.mpf("5")
        kernel = lambda x_value: (
            mp.sqrt(x_value * z_value)
            * mp.quad(
                lambda t: t * mp.besselj(0, t * x_value) * mp.besselj(0, t * z_value),
                [0, cutoff],
            )
            / 2
        )
        self.assertLess(abs(kernel(mp.mpf("1e-20"))), mp.mpf("1e-8"))

    def test_exact_hard_coordinate_multiplier_is_not_the_pure_hankel_row(self) -> None:
        for radius, x_value in (
            (mp.mpf("0.03"), mp.mpf("0.004")),
            (mp.mpf("0.2"), mp.mpf("0.4")),
            (mp.mpf("0.8"), mp.mpf("1.7")),
        ):
            action = mp.quad(
                lambda v: mp.sqrt((v * v + radius * radius) / (1 + v * v)),
                [0, x_value],
            )
            xi_value = action / radius
            q_value = x_value * x_value / (radius * radius)
            multiplier_from_x = radius / mp.sqrt(x_value * x_value + radius * radius)
            multiplier_from_q = 1 / mp.sqrt(1 + q_value)
            self.assertGreater(xi_value, 0)
            self.assertLess(abs(multiplier_from_x - multiplier_from_q), mp.mpf("1e-55"))
            self.assertGreater(multiplier_from_x, 0)
            self.assertLessEqual(multiplier_from_x, 1)

            dxi_dx = (
                mp.sqrt((x_value * x_value + radius * radius) / (1 + x_value * x_value))
                / radius
            )
            self.assertLess(
                abs(multiplier_from_x * dxi_dx - 1 / mp.sqrt(1 + x_value * x_value)),
                mp.mpf("1e-55"),
            )

    def test_action_measure_has_reversed_orientation(self) -> None:
        for c_value, t_value in (
            (mp.mpf("100"), mp.mpf("2")),
            (mp.mpf("500"), mp.mpf("31")),
            (mp.mpf("10000"), mp.mpf("800")),
        ):
            a_value = (t_value / c_value) ** 2
            j_value = mp.ellipk(1 - a_value)
            da_dt = 2 * t_value / (c_value * c_value)
            dsigma_dt = -(c_value / 2) * j_value * da_dt
            positive_measure = j_value * t_value / (2 * mp.pi * c_value)
            self.assertLess(abs(-dsigma_dt / (2 * mp.pi) - positive_measure), mp.mpf("1e-55"))
            self.assertLess(dsigma_dt, 0)
            self.assertGreater(positive_measure, 0)

    def test_bounded_primitive_does_not_force_fourier_decay(self) -> None:
        for atom_pairs in (3, 10, 50):
            # At odd integer frequency k, each pair contributes 2.
            frequency = 2 * math.pi
            transform = sum(
                complex(math.cos(frequency * q), math.sin(frequency * q))
                - complex(
                    math.cos(frequency * (q + 0.5)),
                    math.sin(frequency * (q + 0.5)),
                )
                for q in range(1, atom_pairs + 1)
            )
            self.assertAlmostEqual(transform.real, 2 * atom_pairs, places=11)
            self.assertAlmostEqual(transform.imag, 0.0, places=11)

    def test_claim_boundary_remains_fail_closed(self) -> None:
        text = NOTE.read_text()
        required = (
            "This note proves neither (0.8)",
            "No frozen input proves either version of `SB`.",
            "does not prove any",
            "no entire-span regular",
            "no complete central floor",
            "P0_INVALIDATED",
            "A supremum over all `M>=1` after subtracting only the limiting core is",
            "={J(a)t\\,dt\\over2\\pi c}\n =-{d\\sigma\\over2\\pi}",
            "The pure kernel (7.5)--(7.6) is only the reference",
            "No current frozen input proves the factorization (7.8)",
        )
        for phrase in required:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
