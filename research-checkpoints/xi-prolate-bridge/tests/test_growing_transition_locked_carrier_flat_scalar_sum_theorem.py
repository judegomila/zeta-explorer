#!/usr/bin/env python3
"""Exact regressions for the locked-carrier flat scalar-sum theorem."""

from __future__ import annotations

import cmath
import functools
import hashlib
import math
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_LOCKED_CARRIER_FLAT_SCALAR_SUM_THEOREM.md"
)
NOTE_HASH = "cf51bc269592e5ae2393e0c30931ca8fb4723283e70bb5981345f6e822afcc9e"
PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md":
        "16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0",
    "notes/NEAR_SIGNED_HANKEL_REDUCTION.md":
        "fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e",
    "notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md":
        "c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9",
}


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


@functools.cache
def divisors(n: int) -> tuple[int, ...]:
    low: list[int] = []
    high: list[int] = []
    for d in range(1, math.isqrt(n) + 1):
        if n % d == 0:
            low.append(d)
            if d * d != n:
                high.append(n // d)
    return tuple(low + list(reversed(high)))


@functools.cache
def prime_power_base(n: int) -> int | None:
    if n < 2:
        return None
    for p in range(2, math.isqrt(n) + 1):
        if n % p != 0:
            continue
        value = n
        while value % p == 0:
            value //= p
        return p if value == 1 else None
    # A prime larger than sqrt(n) is its own first power.
    return n


@functools.cache
def von_mangoldt(n: int) -> mp.mpf:
    base = prime_power_base(n)
    return mp.mpf("0") if base is None else mp.log(base)


def chi4(n: int) -> int:
    if n % 2 == 0:
        return 0
    return 1 if n % 4 == 1 else -1


def i_power(exponent: int) -> mp.mpc:
    return (
        mp.mpc(1),
        mp.mpc(0, 1),
        mp.mpc(-1),
        mp.mpc(0, -1),
    )[exponent % 4]


def omega(cutoff: int, m: int) -> mp.mpf:
    return max(mp.mpf("0"), 1 - mp.mpf(m) / (cutoff + 1))


def ell(cutoff: int, total: int) -> mp.mpf:
    return mp.fsum(
        von_mangoldt(n) * omega(cutoff, total // n)
        for n in divisors(total)
    )


def center_coefficient(cutoff: int, total: int) -> mp.mpf:
    w1 = omega(cutoff, 1)
    return 2 * w1 * ell(cutoff, total) - w1**2 * von_mangoldt(total)


def c_coefficient(k: int, alpha: mp.mpc) -> mp.mpc:
    a_value = mp.mpf("0.5") + 1j * alpha / 4
    b_value = mp.mpf("0.5") - 1j * alpha / 4
    return mp.fsum(
        mp.rf(a_value, j)
        / mp.factorial(j)
        * (-1) ** (k - j)
        * mp.rf(b_value, k - j)
        / mp.factorial(k - j)
        for j in range(k + 1)
    )


def f0(n_value: int, alpha: mp.mpc) -> mp.mpc:
    return (
        -1j
        / mp.sqrt(n_value * n_value - 1)
        * mp.exp(
            1j
            * alpha
            * mp.log(mp.mpf(n_value + 1) / (n_value - 1))
            / 4
        )
    )


def q_truncated(residue: int, s_value: mp.mpf, limit: int) -> mp.mpc:
    return mp.fsum(
        von_mangoldt(n) * i_power(residue * n) / mp.power(n, s_value)
        for n in range(2, limit + 1)
    )


def l_twisted_truncated(cutoff: int, s_value: mp.mpf, limit: int) -> mp.mpc:
    return mp.fsum(
        ell(cutoff, total) * i_power(total) / mp.power(total, s_value)
        for total in range(2, limit + 1)
    )


def c_twisted_truncated(cutoff: int, s_value: mp.mpf, limit: int) -> mp.mpc:
    return mp.fsum(
        center_coefficient(cutoff, total)
        * i_power(total)
        / mp.power(total, s_value)
        for total in range(2, limit + 1)
    )


class GrowingTransitionLockedCarrierFlatScalarSumTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_frozen_dependencies_are_hash_pinned(self) -> None:
        self.assertEqual(file_hash(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(file_hash(ROOT / relative), expected, relative)

    def test_locked_schedule_gives_i_to_the_n_carrier(self) -> None:
        for p_value in range(5, 50, 2):
            self.assertEqual((p_value * p_value) % 8, 1)
            c_value = mp.pi * p_value * p_value / 2
            for n_value in range(-8, 9):
                self.assertLess(
                    abs(mp.exp(1j * c_value * n_value) - i_power(n_value)),
                    mp.mpf("1e-72"),
                )

    def test_first_three_power_series_coefficients(self) -> None:
        for alpha in (mp.mpf("-3.25"), mp.mpf("0"), mp.mpf("2.5")):
            self.assertLess(abs(c_coefficient(0, alpha) - 1), mp.mpf("1e-75"))
            self.assertLess(
                abs(c_coefficient(1, alpha) - 1j * alpha / 2),
                mp.mpf("1e-75"),
            )
            self.assertLess(
                abs(c_coefficient(2, alpha) - (mp.mpf("0.5") - alpha**2 / 8)),
                mp.mpf("1e-75"),
            )

    def test_exact_f0_power_series(self) -> None:
        for n_value, alpha in (
            (2, mp.mpf("-2.75")),
            (3, mp.mpf("0.4")),
            (11, mp.mpf("7.0")),
        ):
            series = -1j * mp.fsum(
                c_coefficient(k, alpha) / mp.power(n_value, k + 1)
                for k in range(130)
            )
            self.assertLess(abs(series - f0(n_value, alpha)), mp.mpf("1e-35"))

    def test_mod_four_q_coefficients_include_two_adic_correction(self) -> None:
        for n_value in range(2, 180):
            lam = von_mangoldt(n_value)
            is_two_power = (
                n_value > 0 and n_value & (n_value - 1) == 0
            )
            two_exponent = n_value.bit_length() - 1 if is_two_power else None
            for residue in range(4):
                direct = lam * i_power(residue * n_value)
                if residue == 0:
                    reduced = lam
                elif residue == 2:
                    reduced = -lam + (2 * lam if is_two_power else 0)
                else:
                    odd_part = (
                        (mp.j if residue == 1 else -mp.j) * chi4(n_value) * lam
                    )
                    even_part = mp.mpf("0")
                    if is_two_power:
                        even_part = -lam if two_exponent == 1 else lam
                    reduced = odd_part + even_part
                self.assertLess(abs(direct - reduced), mp.mpf("1e-75"))

    def test_ordered_twisted_fejer_convolution(self) -> None:
        cutoff = 9
        limit = 180
        s_value = mp.mpf("2.3")
        direct = l_twisted_truncated(cutoff, s_value, limit)
        reindexed = mp.fsum(
            omega(cutoff, l_value)
            / mp.power(l_value, s_value)
            * mp.fsum(
                von_mangoldt(n_value)
                * i_power(l_value * n_value)
                / mp.power(n_value, s_value)
                for n_value in range(2, limit // l_value + 1)
            )
            for l_value in range(1, cutoff + 1)
        )
        self.assertLess(abs(direct - reindexed), mp.mpf("1e-70"))

    def test_center_transform_identity(self) -> None:
        for cutoff in (1, 2, 7, 13):
            limit = 220
            s_value = mp.mpf("2.1")
            direct = c_twisted_truncated(cutoff, s_value, limit)
            reduced = (
                2
                * omega(cutoff, 1)
                * l_twisted_truncated(cutoff, s_value, limit)
                - omega(cutoff, 1) ** 2
                * q_truncated(1, s_value, limit)
            )
            self.assertLess(abs(direct - reduced), mp.mpf("1e-70"))

    def test_scalar_sum_is_tower_of_twisted_moments(self) -> None:
        cutoff = 7
        limit = 100
        sigma = mp.mpf("0.65")
        alpha = mp.mpf("1.75")
        direct = mp.fsum(
            center_coefficient(cutoff, total)
            * i_power(total)
            * f0(total, alpha)
            / mp.power(total, sigma)
            for total in range(2, limit + 1)
        )
        tower = -1j * mp.fsum(
            c_coefficient(k, alpha)
            * c_twisted_truncated(cutoff, k + 1 + sigma, limit)
            for k in range(130)
        )
        self.assertLess(abs(direct - tower), mp.mpf("1e-35"))

    def test_locked_twist_is_not_untwisted_product(self) -> None:
        # At M=1, the N=2 coefficient is changed by i^2=-1.
        w1 = omega(1, 1)
        twisted = w1 * von_mangoldt(2) * i_power(2)
        untwisted = w1 * von_mangoldt(2)
        self.assertEqual(twisted, -untwisted)
        self.assertNotEqual(twisted, untwisted)

    def test_possible_s_equals_one_pole_is_not_suppressed(self) -> None:
        s_value = mp.mpf("1.4")
        a_two = mp.fsum(
            omega(2, l_value) / mp.power(l_value, s_value)
            for l_value in range(1, 3)
            if l_value % 4 == 0
        ) - mp.fsum(
            omega(2, l_value) / mp.power(l_value, s_value)
            for l_value in range(1, 3)
            if l_value % 4 == 2
        )
        expected = -omega(2, 2) / mp.power(2, s_value)
        self.assertLess(abs(a_two - expected), mp.mpf("1e-75"))
        self.assertNotEqual(a_two, 0)

    def test_midpoint_closed_form_requires_a_less_n_less_2a(self) -> None:
        cutoff = 40
        a_value = mp.mpf(49) / 4
        total = 32
        self.assertGreaterEqual(total, 2 * a_value)
        actual_boundary_layer = omega(cutoff, 1) * mp.fsum(
            von_mangoldt(n) * omega(cutoff, total // n)
            for n in divisors(total)
            if n < a_value
        )
        overbroad_closed_form = omega(cutoff, 1) * (
            ell(cutoff, total)
            - omega(cutoff, 1) * von_mangoldt(total)
        )
        self.assertLess(
            abs(actual_boundary_layer / mp.log(2) - mp.mpf(3800) / 1681),
            mp.mpf("1e-75"),
        )
        self.assertLess(
            abs(overbroad_closed_form / mp.log(2) - mp.mpf(5360) / 1681),
            mp.mpf("1e-75"),
        )
        self.assertNotEqual(actual_boundary_layer, overbroad_closed_form)

    def test_n_zero_one_scope_and_rows_are_fail_closed(self) -> None:
        self.assertNotIn(r"Q_{,l\bmod4}", self.text)
        self.assertIn(
            r"A_M(s)=\sum_{\substack{l\leq M\\l\equiv0\ (4)}}",
            self.text,
        )
        for n_value in range(2, 100):
            r_value = mp.log(mp.mpf(n_value + 1) / (n_value - 1)) / 4
            self.assertGreater(r_value, 0)
            self.assertLessEqual(r_value, mp.log(3) / 4)
        principal_n_zero_phase = mp.exp(1j * mp.mpf("2.5") * (1j * mp.pi / 4))
        self.assertLess(
            abs(principal_n_zero_phase - mp.exp(-mp.pi * mp.mpf("2.5") / 4)),
            mp.mpf("1e-75"),
        )
        for token in (
            "At `N=1`",
            "not an extension of the scalar theorem",
            "establish cancellation of (5.3)",
            r"2\Gamma_{\rm in}^*\rho",
            "At the exact endpoints `rho=0` and `rho=y_N`",
            r"A<N<2A",
            r"C_M(N)-{1\over2}E_{N,M}",
            "variable far Jost coefficient",
            "no proof of `PA`",
            "continue to the critical line",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)


if __name__ == "__main__":
    unittest.main()
