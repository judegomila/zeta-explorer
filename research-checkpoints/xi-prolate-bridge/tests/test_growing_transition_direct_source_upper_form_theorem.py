#!/usr/bin/env python3
"""Regressions for the growing-transition direct-source upper-form theorem."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import re
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md"
NOTE_HASH = "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97"

PROTECTED_HASHES = {
    "vendor/CCM-ZST-2511.22755v1.pdf":
        "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/OUTER_PROJECTION_RADICAL_REDUCTION.md":
        "3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd",
    "notes/CHEBYSHEV_ERROR_REWRITE.md":
        "164482f280284c49eda27c6d22607f32d5e16db4ab053b965c97f8bbd81db20a",
    "notes/NEAR_SIGNED_HANKEL_REDUCTION.md":
        "fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md":
        "a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85",
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "notes/GROWING_TRANSITION_FINITE_FEJER_XI_WRONSKIAN_ASSEMBLY_GATE.md":
        "41dad88fd3e5bcb3277ccadb6baaa4bfa40ab683d15c747bebe8a50ce759ff23",
    "tests/test_growing_transition_finite_fejer_xi_wronskian_assembly_gate.py":
        "dcb9640a5294ae5c44502f983f20f9eadcdf8271dd02099b9d3887f255460aee",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def omega(cutoff: int, value: int) -> mp.mpf:
    if value > cutoff:
        return mp.mpf("0")
    return 1 - mp.mpf(value) / (cutoff + 1)


def mangoldt(value: int) -> mp.mpf:
    if value < 2:
        return mp.mpf("0")
    for prime in range(2, value + 1):
        if any(prime % divisor == 0
               for divisor in range(2, math.isqrt(prime) + 1)):
            continue
        power = prime
        while power < value:
            power *= prime
        if power == value:
            return mp.log(prime)
    return mp.mpf("0")


def g_completed(s_value: mp.mpf) -> mp.mpf:
    return (
        mp.mpf("0.5")
        * s_value
        * (s_value - 1)
        * mp.power(mp.pi, -s_value / 2)
        * mp.gamma(s_value / 2)
    )


def xi_completed(s_value: mp.mpf) -> mp.mpf:
    return g_completed(s_value) * mp.zeta(s_value)


def delta_model(r_value: mp.mpf, kappa: mp.mpf) -> mp.mpf:
    return mp.exp(-kappa * r_value) * (
        1 + r_value + r_value * r_value / 7
    )


class GrowingTransitionDirectSourceUpperFormTheoremTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_two_physical_boundaries_add_in_same_slot(self) -> None:
        # X and O are even; the two summands in the source correlation are
        # the right and reflected-left physical boundaries.
        ell = mp.mpf("1")
        length = 2 * ell
        shift = mp.mpf("1.35")

        def x_profile(t_value: mp.mpf) -> mp.mpf:
            if abs(t_value) > ell:
                return mp.mpf("0")
            return 1 - t_value * t_value

        def o_profile(t_value: mp.mpf) -> mp.mpf:
            if abs(t_value) <= ell:
                return mp.mpf("0")
            return mp.exp(-(abs(t_value) - ell))

        first = mp.quad(
            lambda t_value: x_profile(t_value) * o_profile(t_value + shift),
            [ell - shift, ell],
        )
        second = mp.quad(
            lambda t_value: x_profile(t_value + shift) * o_profile(t_value),
            [-ell - shift, -ell],
        )
        convolution = mp.quad(
            lambda s_value: (2 * s_value - s_value * s_value)
            * mp.exp(-(shift - s_value)),
            [0, min(length, shift)],
        )
        self.assertLess(abs(first - convolution), mp.mpf("1e-70"))
        self.assertLess(abs(second - convolution), mp.mpf("1e-70"))
        self.assertLess(abs(first + second - 2 * convolution), mp.mpf("1e-70"))

    def test_adjoint_and_hermitian_average_normalization(self) -> None:
        upper = mp.matrix([
            [1 + 2j, 3 - 4j],
            [-2 + 5j, 7 - 1j],
        ])
        lower = upper.conjugate().T
        hermitian = (upper + lower) / 2
        self.assertLess(mp.norm(hermitian - hermitian.conjugate().T), mp.mpf("1e-70"))
        self.assertLess(mp.norm(upper + lower - 2 * hermitian), mp.mpf("1e-70"))

        physical = mp.matrix([
            [mp.mpf("2"), 1 + 3j],
            [1 - 3j, mp.mpf("-1")],
        ])
        self.assertLess(
            mp.norm((physical + physical.conjugate().T) / 2 - physical),
            mp.mpf("1e-70"),
        )
        self.assertGreater(mp.norm(physical + physical.conjugate().T - physical), 1)

    def test_direct_source_block_signs_and_factors(self) -> None:
        kappa = mp.mpf("1.6")

        def c_value(r_value: mp.mpf) -> mp.mpf:
            return r_value * mp.exp(-kappa * r_value)

        w_02 = mp.quad(
            lambda r_value: 2 * (1 + mp.exp(-r_value)) * c_value(r_value),
            [0, 1, mp.inf],
        )
        w_arch = mp.quad(
            lambda r_value: 2 * c_value(r_value)
            / (mp.exp(r_value) - mp.exp(-r_value)),
            [0, 1, mp.inf],
        )
        prime = 2 * mp.fsum(
            mangoldt(n) * c_value(mp.log(n)) / n
            for n in range(2, 61)
        )
        upper_from_blocks = -w_02 + w_arch + prime
        upper_display = (
            -2 * mp.quad(
                lambda r_value: (1 + mp.exp(-r_value)) * c_value(r_value),
                [0, 1, mp.inf],
            )
            + 2 * mp.quad(
                lambda r_value: c_value(r_value)
                / (mp.exp(r_value) - mp.exp(-r_value)),
                [0, 1, mp.inf],
            )
            + 2 * mp.fsum(
                mangoldt(n) * c_value(mp.log(n)) / n
                for n in range(2, 61)
            )
        )
        self.assertLess(abs(upper_from_blocks - upper_display), mp.mpf("1e-70"))
        self.assertLess(-w_02, 0)
        self.assertGreater(w_arch, 0)
        self.assertGreater(prime, 0)

    def test_first_bulk_last_boundary_identity(self) -> None:
        kappa = mp.mpf("1.7")
        p_value = mp.mpf("0.8")
        q_value = mp.mpf("1.3")
        length = mp.mpf("0.9")

        def convolution(r_value: mp.mpf) -> mp.mpf:
            upper = min(length, r_value)
            return (
                mp.exp(-q_value * r_value)
                * (mp.exp((q_value - p_value) * upper) - 1)
                / (q_value - p_value)
            )

        def convolution_prime(r_value: mp.mpf) -> mp.mpf:
            upper = min(length, r_value)
            base = convolution(r_value)
            if r_value < length:
                return -q_value * base + mp.exp(-p_value * r_value)
            return -q_value * base

        direct = 2 * mp.quad(
            lambda r_value: delta_model(r_value, kappa)
            * (convolution_prime(r_value) - convolution(r_value)),
            [0, length, mp.inf],
        )

        def beta(h_value: mp.mpf) -> mp.mpf:
            return mp.quad(
                lambda t_value: delta_model(h_value + t_value, kappa)
                * mp.exp(-q_value * t_value),
                [0, mp.inf],
            )

        first = 2 * beta(0)
        bulk = 2 * mp.quad(
            lambda s_value: -(p_value + 1)
            * mp.exp(-p_value * s_value)
            * beta(s_value),
            [0, length],
        )
        last = -2 * mp.exp(-p_value * length) * beta(length)
        completed = first + bulk + last
        self.assertLess(abs(direct - completed), mp.mpf("1e-65"))

        # The exact finite-length expression already contains the last row.
        duplicated = completed + last
        self.assertGreater(abs(duplicated - direct), mp.mpf("1e-4"))

    def test_ordered_prime_triple_has_m_left_and_ln_right(self) -> None:
        cutoff = 5
        lambda_value = mp.mpf("2")
        length = 2 * mp.log(lambda_value)

        def inward_atom(x_value: mp.mpf) -> mp.mpf:
            return mp.exp(-x_value)

        def outward_atom(x_value: mp.mpf) -> mp.mpf:
            return mp.exp(-2 * x_value)

        def a_value(s_value: mp.mpf) -> mp.mpf:
            return mp.sqrt(lambda_value) / 2 * mp.fsum(
                omega(cutoff, m)
                * inward_atom(m * lambda_value * mp.exp(-s_value))
                for m in range(1, cutoff + 1)
            )

        def b_value(t_value: mp.mpf) -> mp.mpf:
            return mp.sqrt(lambda_value) * mp.exp(t_value) / 2 * mp.fsum(
                omega(cutoff, ell_value)
                * outward_atom(ell_value * lambda_value * mp.exp(t_value))
                for ell_value in range(1, cutoff + 1)
            )

        prime_source = 2 * mp.fsum(
            mangoldt(n) / n * mp.quad(
                lambda s_value: a_value(s_value)
                * b_value(mp.log(n) - s_value),
                [0, min(length, mp.log(n))],
            )
            for n in range(2, 14)
        )
        prime_triple = mp.mpf("0.5") * mp.fsum(
            omega(cutoff, m)
            * mangoldt(n)
            * omega(cutoff, ell_value)
            * mp.quad(
                lambda u_value: inward_atom(m * u_value)
                * outward_atom(ell_value * n * u_value),
                [max(lambda_value / n, 1 / lambda_value), lambda_value],
            )
            for m in range(1, cutoff + 1)
            for n in range(2, 14)
            for ell_value in range(1, cutoff + 1)
        )
        self.assertLess(abs(prime_source - prime_triple), mp.mpf("1e-65"))

    def test_finite_cutoff_is_a_cross_form_not_a_radical(self) -> None:
        lambda_value = mp.mpf("2")
        length = 2 * mp.log(lambda_value)
        cutoff = 1

        # This h is self-Fourier for F_a f(y)=int f(x)e^(2*pi*i*x*y)dx,
        # and satisfies h(0)=integral(h)=0.
        def h_value(x_value: mp.mpf) -> mp.mpf:
            return (
                mp.pi
                / 2
                * x_value * x_value
                * (2 * mp.pi * x_value * x_value - 3)
                * mp.exp(-mp.pi * x_value * x_value)
            )

        def collapsed(s_value: mp.mpf) -> mp.mpf:
            argument = lambda_value * mp.exp(-s_value)
            return (
                mp.sqrt(lambda_value)
                * omega(cutoff, 1)
                * h_value(argument)
            )

        self.assertGreater(
            abs(collapsed(length) - lambda_value * collapsed(0)),
            mp.mpf("1e-3"),
        )

        s_value = mp.mpf("0.37")
        argument = lambda_value * mp.exp(-s_value)
        time_truncated = omega(cutoff, 1) * (
            mp.sqrt(lambda_value) / 2 * h_value(argument)
            + mp.exp(s_value) / (2 * mp.sqrt(lambda_value))
            * h_value(mp.exp(s_value) / lambda_value)
        )
        self.assertGreater(abs(collapsed(s_value) - time_truncated), mp.mpf("1e-4"))

    def test_complete_source_carrier_is_xi_log_divided_difference(self) -> None:
        p_value = mp.mpf("2.3")
        q_value = mp.mpf("3.1")
        s_value = p_value + 1
        t_value = q_value + 1

        def d_transform(z_value: mp.mpf) -> mp.mpf:
            return (
                1 / z_value
                + (mp.diff(mp.zeta, z_value + 1) / mp.zeta(z_value + 1))
                / (z_value + 1)
                + (mp.digamma((z_value + 3) / 2) - mp.digamma(1))
                / (2 * (z_value + 1))
            )

        transform = 2 * (
            (p_value + 1) * d_transform(p_value)
            - (q_value + 1) * d_transform(q_value)
        ) / (p_value - q_value)
        xi_target = 2 * (
            mp.diff(xi_completed, s_value) / xi_completed(s_value)
            - mp.diff(xi_completed, t_value) / xi_completed(t_value)
        ) / (s_value - t_value)
        self.assertLess(abs(transform - xi_target), mp.mpf("1e-70"))

        def c_value(r_value: mp.mpf) -> mp.mpf:
            return (
                mp.exp(-q_value * r_value) - mp.exp(-p_value * r_value)
            ) / (p_value - q_value)

        continuous = mp.quad(
            lambda r_value: (
                -2 * (1 + mp.exp(-r_value))
                + 2 / (mp.exp(r_value) - mp.exp(-r_value))
            ) * c_value(r_value),
            [0, 1, mp.inf],
        )
        prime = 2 * (
            mp.diff(mp.zeta, s_value) / mp.zeta(s_value)
            - mp.diff(mp.zeta, t_value) / mp.zeta(t_value)
        ) / (p_value - q_value)
        self.assertLess(abs(continuous + prime - transform), mp.mpf("1e-65"))

    def test_finite_length_tail_correction(self) -> None:
        kappa = mp.mpf("1.7")
        p_value = mp.mpf("0.8")
        q_value = mp.mpf("1.3")
        length = mp.mpf("0.9")

        def d_transform(z_value: mp.mpf) -> mp.mpf:
            rate = z_value + kappa
            return 1 / rate + 1 / rate ** 2 + 2 / (7 * rate ** 3)

        def a_part(z_value: mp.mpf) -> mp.mpf:
            return mp.quad(
                lambda r_value: delta_model(r_value, kappa)
                * mp.exp(-z_value * r_value),
                [0, length],
            )

        def t_part(z_value: mp.mpf) -> mp.mpf:
            return d_transform(z_value) - a_part(z_value)

        exponential = mp.exp((q_value - p_value) * length)
        finite_formula = 2 * (
            (p_value + 1) * a_part(p_value)
            - (q_value + 1) * a_part(q_value)
            + (q_value + 1) * (exponential - 1) * t_part(q_value)
        ) / (p_value - q_value)
        infinite_formula = 2 * (
            (p_value + 1) * d_transform(p_value)
            - (q_value + 1) * d_transform(q_value)
        ) / (p_value - q_value)
        tail = 2 * (
            (q_value + 1) * exponential * t_part(q_value)
            - (p_value + 1) * t_part(p_value)
        ) / (p_value - q_value)
        self.assertLess(abs(finite_formula - infinite_formula - tail), mp.mpf("1e-70"))

    def test_archimedean_principal_is_one_and_carleman_is_infinite_rank(self) -> None:
        r_value = mp.mpf("1e-25")
        kernel = (
            2 / (mp.exp(r_value) - mp.exp(-r_value))
            - 2 * (1 + mp.exp(-r_value))
        )
        self.assertLess(abs(r_value * kernel - 1), mp.mpf("1e-23"))
        self.assertLess(abs(kernel - 1 / r_value + 4), mp.mpf("1e-23"))
        self.assertEqual(min(mp.log(n) for n in range(2, 20)), mp.log(2))

        for size in range(1, 6):
            matrix = mp.matrix(size)
            for row in range(size):
                for column in range(size):
                    matrix[row, column] = 1 / (
                        mp.mpf(row + 1) + mp.mpf(column + 1) / 3
                    )
            self.assertGreater(abs(mp.det(matrix)), mp.mpf("1e-40"))

    def test_scope_is_fail_closed(self) -> None:
        required = (
            "not asserted at finite `M`",
            "No `R,C_R,C_L,B` mask assignment is needed",
            "`q_lambda(X,O)` is not automatically defined",
            "must not be added to the direct source formula",
            "not by their unnormalized sum",
            "The outer--outer mask formula `-2(G-B)`",
            "No finite-`M` global radical is used",
            "No scalar mask bridge is needed",
            "double-counts the source prime integral",
            "Appending the endpoint part of (4.4) once more would double-count it",
            "does not exclude cancellation after compression",
            "proves no complete edge floor",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        # The compact form must never be silently extended to an outer input.
        self.assertNotIn(r"q_\lambda(X_j,O_k)", self.text)
        self.assertNotIn(r"q_\lambda(O_j,X_k)", self.text)
        self.assertNotIn(r"q_\lambda(X_M,O_M)", self.text)
        self.assertIn(r"-\mathcal W_Z(X_j,O_k)", self.text)
        self.assertIn(r"-\mathcal W_Z(O_j,X_k)", self.text)

    def test_tex_and_control_sentinels(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertNotIn("\x0c", self.text)
        self.assertNotIn(",qquad", self.text)
        self.assertNotIn(r"{cal ", self.text)
        self.assertNotRegex(
            self.text,
            r"\\tag\{[^}]+\}\s*\n\\end\{aligned\}",
        )
        for path in (NOTE, Path(__file__)):
            for byte in path.read_bytes():
                self.assertFalse(byte < 32 and byte not in (9, 10), path)


if __name__ == "__main__":
    unittest.main()
