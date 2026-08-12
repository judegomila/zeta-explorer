#!/usr/bin/env python3
"""Regressions for the finite-Fejer Xi-Wronskian assembly gate."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_FINITE_FEJER_XI_WRONSKIAN_ASSEMBLY_GATE.md"
NOTE_HASH = "41dad88fd3e5bcb3277ccadb6baaa4bfa40ab683d15c747bebe8a50ce759ff23"

DEPENDENCIES = {
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "notes/GROWING_TRANSITION_POST_PLEMELJ_REGULAR_ACTION_REDUCTION_THEOREM.md":
        "c7793bec967d219d06eecee76f5606b871b77b75f068648fcf2607977791afd8",
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md":
        "c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9",
    "tests/test_growing_transition_finite_fejer_post_core_quantifier_theorem.py":
        "409b119b42d8202511d0253a638d08c9e6585e4866337de4a7a14cbae76e9f1a",
    "notes/NEAR_SIGNED_HANKEL_REDUCTION.md":
        "fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e",
    "notes/MELLIN_PROJECTION_SOFT_SYMBOL_REDUCTION.md":
        "97bdb89e2d98811d98c0aa9d4b007bd644066b14e05b78ca7a763d6b48dceea1",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def omega(cutoff: int, value: int) -> mp.mpf:
    return max(mp.mpf("0"), 1 - mp.mpf(value) / (cutoff + 1))


def z_m(cutoff: int, s: mp.mpf) -> mp.mpf:
    return mp.fsum(omega(cutoff, m) * mp.power(m, -s)
                   for m in range(1, cutoff + 1))


def z_m_prime(cutoff: int, s: mp.mpf) -> mp.mpf:
    return -mp.fsum(omega(cutoff, m) * mp.log(m) * mp.power(m, -s)
                    for m in range(1, cutoff + 1))


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


def ell(cutoff: int, total: int) -> mp.mpf:
    return mp.fsum(
        mangoldt(divisor) * omega(cutoff, total // divisor)
        for divisor in range(1, total + 1)
        if total % divisor == 0
    )


def l_m_rectangular(cutoff: int, s: mp.mpf, n_max: int) -> mp.mpf:
    return mp.fsum(
        mangoldt(n) * omega(cutoff, q) * mp.power(n * q, -s)
        for n in range(2, n_max + 1)
        for q in range(1, cutoff + 1)
    )


def p_truncated(s: mp.mpf, n_max: int) -> mp.mpf:
    return mp.fsum(mangoldt(n) * mp.power(n, -s)
                   for n in range(2, n_max + 1))


def g(s: mp.mpf) -> mp.mpf:
    return mp.mpf("0.5") * s * (s - 1) * mp.power(mp.pi, -s / 2) * mp.gamma(s / 2)


def xi(s: mp.mpf) -> mp.mpf:
    return g(s) * mp.zeta(s)


class FiniteFejerXiWronskianAssemblyGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_mask_coordinate_table(self) -> None:
        a_value = mp.mpf(49) / 4
        examples = (
            # n,m,l,rho, expected mask
            (17, 2, 3, mp.log(2) + mp.mpf("0.1"), "R"),
            (17, 7, 2, mp.log(7) - mp.mpf("0.1"), "C_R"),
            (17, 2, 7, mp.log(2) + mp.log(mp.mpf(17) / a_value) + mp.mpf("0.1"), "C_L"),
            (5, 7, 7, mp.log(7) - mp.mpf("0.4"), "B"),
        )
        for n, m, ell_value, rho, expected in examples:
            total = n * m * ell_value
            y = mp.log(mp.mpf(total) / a_value)
            t_j = rho - mp.log(m)
            t_k = y - rho - mp.log(ell_value)
            self.assertAlmostEqual(float(t_j + t_k), float(mp.log(mp.mpf(n) / a_value)), places=13)
            if t_j >= 0 and t_k >= 0:
                actual = "R"
            elif t_j < 0 and t_k >= 0:
                actual = "C_R"
            elif t_j >= 0 and t_k < 0:
                actual = "C_L"
            else:
                actual = "B"
            self.assertEqual(actual, expected)

    def test_midpoint_formula_requires_two_a_collar(self) -> None:
        cutoff = 40
        total = 32
        a_value = mp.mpf(49) / 4
        self.assertGreaterEqual(total, 2 * a_value)
        divisors = tuple(n for n in range(1, total + 1) if total % n == 0)
        actual_layer = omega(cutoff, 1) * mp.fsum(
            mangoldt(n) * omega(cutoff, total // n)
            for n in divisors
            if n < a_value
        )
        overextended_formula = omega(cutoff, 1) * (
            ell(cutoff, total) - omega(cutoff, 1) * mangoldt(total)
        )
        log_two = mp.log(2)
        self.assertLess(
            abs(actual_layer / log_two - mp.mpf(3800) / 1681),
            mp.mpf("1e-70"),
        )
        self.assertLess(
            abs(overextended_formula / log_two - mp.mpf(5360) / 1681),
            mp.mpf("1e-70"),
        )
        self.assertLess(
            abs(
                (overextended_formula - actual_layer) / log_two
                - omega(cutoff, 1) * omega(cutoff, 2)
            ),
            mp.mpf("1e-70"),
        )
        self.assertIn("A<N<2A", self.text)
        self.assertIn("not valid without this restriction", self.text)

    def test_dirichlet_convolution_factorization(self) -> None:
        cutoff = 11
        s = mp.mpf("3.25")
        # A finite rectangle checks the divisor convolution exactly.
        n_max = 120
        left = l_m_rectangular(cutoff, s, n_max)
        right = p_truncated(s, n_max) * z_m(cutoff, s)
        self.assertLess(abs(left - right), mp.mpf("1e-70"))

    def test_ordered_commutator_sign(self) -> None:
        cutoff = 17
        s = mp.mpf("2.4")
        t = mp.mpf("3.1")
        zs, zt = z_m(cutoff, s), z_m(cutoff, t)
        ps = -mp.diff(mp.zeta, s) / mp.zeta(s)
        pt = -mp.diff(mp.zeta, t) / mp.zeta(t)
        ls, lt = ps * zs, pt * zt
        ordered = zs * lt - ls * zt
        expected = zs * zt * (
            mp.diff(mp.zeta, s) / mp.zeta(s)
            - mp.diff(mp.zeta, t) / mp.zeta(t)
        )
        self.assertLess(abs(ordered - expected), mp.mpf("1e-70"))

    def test_finite_cutoff_archimedean_completion(self) -> None:
        cutoff = 13
        s = mp.mpf("2.35")
        t = mp.mpf("3.05")
        zs, zt = z_m(cutoff, s), z_m(cutoff, t)
        ps = -mp.diff(mp.zeta, s) / mp.zeta(s)
        pt = -mp.diff(mp.zeta, t) / mp.zeta(t)
        ls, lt = ps * zs, pt * zt
        completed = zs * lt - ls * zt + zs * zt * (
            mp.diff(g, s) / g(s) - mp.diff(g, t) / g(t)
        )
        expected = zs * zt * (
            mp.diff(xi, s) / xi(s) - mp.diff(xi, t) / xi(t)
        )
        self.assertLess(abs(completed - expected), mp.mpf("1e-70"))

    def test_gamma_conjugated_wronskian(self) -> None:
        s = mp.mpf("2.3")
        t = mp.mpf("3.2")
        xi_s, xi_t = xi(s), xi(t)
        xi_prime_s = mp.diff(xi, s)
        xi_prime_t = mp.diff(xi, t)
        lhs = 2 * mp.zeta(s) * mp.zeta(t) * (
            xi_prime_s / xi_s - xi_prime_t / xi_t
        ) / (s - t)
        rhs = 2 * (xi_prime_s * xi_t - xi_s * xi_prime_t) / (
            g(s) * g(t) * (s - t)
        )
        self.assertLess(abs(lhs - rhs), mp.mpf("1e-70"))

    def test_finite_length_tail_identity(self) -> None:
        # A polynomial-exponential sum kernel catches every displayed tail sign.
        kappa = mp.mpf("1.7")
        p = mp.mpf("0.8")
        q = mp.mpf("1.3")
        length = mp.mpf("0.9")

        def moments(z: mp.mpf) -> tuple[mp.mpf, mp.mpf, mp.mpf]:
            rate = z + kappa
            scaled = rate * length
            decay = mp.exp(-scaled)
            i0 = (1 - decay) / rate
            i1 = (1 - decay * (1 + scaled)) / rate ** 2
            i2 = (2 - decay * (2 + 2 * scaled + scaled ** 2)) / rate ** 3
            return i0, i1, i2

        def d_transform(z: mp.mpf) -> mp.mpf:
            rate = z + kappa
            return 1 / rate + 1 / rate ** 2 + 2 / (7 * rate ** 3)

        def a_part(z: mp.mpf) -> mp.mpf:
            i0, i1, i2 = moments(z)
            return i0 + i1 + i2 / 7

        def t_part(z: mp.mpf) -> mp.mpf:
            return d_transform(z) - a_part(z)

        exponential = mp.exp((q - p) * length)
        finite_formula = 2 * (
            (p + 1) * a_part(p)
            - (q + 1) * a_part(q)
            + (q + 1) * (exponential - 1) * t_part(q)
        ) / (p - q)
        infinite_formula = 2 * (
            (p + 1) * d_transform(p) - (q + 1) * d_transform(q)
        ) / (p - q)
        tail_correction = 2 * (
            (q + 1) * exponential * t_part(q) - (p + 1) * t_part(p)
        ) / (p - q)

        # Direct +first-boundary +bulk -last-boundary evaluation.
        q_rate = q + kappa
        c0 = 1 / q_rate + 1 / q_rate ** 2 + 2 / (7 * q_rate ** 3)
        c1 = 1 / q_rate + 2 / (7 * q_rate ** 2)
        c2 = 1 / (7 * q_rate)
        p_i0, p_i1, p_i2 = moments(p)
        first_boundary = c0
        bulk = -(p + 1) * (c0 * p_i0 + c1 * p_i1 + c2 * p_i2)
        h_at_length = mp.exp(-kappa * length) * (
            c0 + c1 * length + c2 * length ** 2
        )
        last_boundary = -mp.exp(-p * length) * h_at_length
        direct = 2 * (first_boundary + bulk + last_boundary)

        self.assertLess(abs(finite_formula - direct), mp.mpf("1e-70"))
        self.assertLess(
            abs(finite_formula - infinite_formula - tail_correction),
            mp.mpf("1e-70"),
        )

    def test_finite_cutoff_is_not_cd_of_g_z_m(self) -> None:
        cutoff = 9
        s = mp.mpf("2.2")
        t = mp.mpf("3.4")
        zs, zt = z_m(cutoff, s), z_m(cutoff, t)
        zps, zpt = z_m_prime(cutoff, s), z_m_prime(cutoff, t)
        xi_log_s = mp.diff(xi, s) / xi(s)
        xi_log_t = mp.diff(xi, t) / xi(t)
        completed = g(s) * g(t) * zs * zt * (xi_log_s - xi_log_t)
        xi_m_s, xi_m_t = g(s) * zs, g(t) * zt
        xi_m_prime_s = mp.diff(g, s) * zs + g(s) * zps
        xi_m_prime_t = mp.diff(g, t) * zt + g(t) * zpt
        finite_cd = xi_m_prime_s * xi_m_t - xi_m_s * xi_m_prime_t
        self.assertGreater(abs(completed - finite_cd), mp.mpf("1e-8"))

    def test_distinguished_source_factor(self) -> None:
        # Two Xi/4 slots multiplying the factor 2 in I_* give 1/8.
        self.assertEqual(mp.mpf(2) * (mp.mpf(1) / 4) ** 2, mp.mpf(1) / 8)
        self.assertIn(r"{1\over8}", self.text)

    def test_scope_is_fail_closed(self) -> None:
        for token in (
            "**Assembly implication AH.**",
            "`AH` is not proved",
            "not a proved formula for",
            "is **not** the",
            "special-source corollary",
            "must therefore remain distributional and fail closed",
            "Dropping this minus sign",
            "finite-length tail correction",
            r"\mathcal T_{M,L}",
            "Equation (7.1) is not asserted here",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_tex_and_control_sentinels(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("\x0c", self.text)
        self.assertNotIn("{xi_R'over", self.text)
        self.assertNotRegex(
            self.text,
            r"\\tag\{[^}]+\}\s*\n\\end\{aligned\}",
        )


if __name__ == "__main__":
    unittest.main()
