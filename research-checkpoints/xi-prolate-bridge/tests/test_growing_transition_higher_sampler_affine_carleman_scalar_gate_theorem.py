#!/usr/bin/env python3
"""Regressions for the higher-sampler affine Carleman/scalar gate."""

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
    / "GROWING_TRANSITION_HIGHER_SAMPLER_AFFINE_CARLEMAN_SCALAR_GATE_THEOREM.md"
)

NOTE_HASH = "fd28ae155cb49e2d2700fec368e3bf4525452bdbf0ad80f4a37d2b09c593c249"
PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md":
        "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c",
    "tests/test_growing_transition_subcritical_lg_action_bv_theorem.py":
        "a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92",
    "notes/GROWING_TRANSITION_POST_PLEMELJ_REGULAR_ACTION_REDUCTION_THEOREM.md":
        "c7793bec967d219d06eecee76f5606b871b77b75f068648fcf2607977791afd8",
    "tests/test_growing_transition_post_plemelj_regular_action_reduction_theorem.py":
        "00d3fe6c8eb1c1e145abf4d5d1dbee5e38cd33259b1e33d6316246dc61c6eeb1",
    "notes/GROWING_TRANSITION_LOCKED_CARRIER_FLAT_SCALAR_SUM_THEOREM.md":
        "cf51bc269592e5ae2393e0c30931ca8fb4723283e70bb5981345f6e822afcc9e",
    "tests/test_growing_transition_locked_carrier_flat_scalar_sum_theorem.py":
        "6577d3a20f6917a7a807ded2bd90b8879122b7c259cbb6ce6be1b6ac22f8d5a3",
    "notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md":
        "c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9",
    "tests/test_growing_transition_finite_fejer_post_core_quantifier_theorem.py":
        "409b119b42d8202511d0253a638d08c9e6585e4866337de4a7a14cbae76e9f1a",
    "notes/GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md":
        "3bd3bf977178be94e91b7c6603db9df7f861f1cfe498bef303c210e9b87b9ec5",
    "tests/test_growing_transition_edge_edge_higher_alias_theorem.py":
        "c7f6920d5253d31d3acc73c00412567294791c51d62c18291f8407a0ea53be2f",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def abel_upper(
    amplitude_i: mp.mpf,
    phase_i: mp.mpf,
    momentum_i: mp.mpf,
    amplitude_k: mp.mpf,
    phase_k: mp.mpf,
    momentum_k: mp.mpf,
    epsilon: mp.mpf,
) -> mp.mpf:
    """Closed Abel integral after r=s+t and u=s/r."""
    difference = (
        mp.log(epsilon + 1j * momentum_i)
        - mp.log(epsilon + 1j * momentum_k)
    ) / (1j * (momentum_i - momentum_k))
    summation = (
        mp.log(epsilon + 1j * momentum_i)
        - mp.log(epsilon - 1j * momentum_k)
    ) / (1j * (momentum_i + momentum_k))
    value = mp.e ** (1j * (phase_i - phase_k)) * difference
    value += mp.e ** (1j * (phase_i + phase_k)) * summation
    return amplitude_i * amplitude_k * mp.re(value) / 2


def compact_even_profile(value: mp.mpf, lam: mp.mpf) -> mp.mpf:
    """Even C1 profile with f(0)=f(lam)=f'(lam)=int f=0."""
    if abs(value) > lam:
        return mp.mpf("0")
    y = value / lam
    return y**2 * (1 - y**2) ** 2 * (y**2 - mp.mpf(1) / 3)


class GrowingTransitionHigherSamplerAffineCarlemanScalarGateTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_abel_hermitianization_leaves_only_sum_cauchy_term(self) -> None:
        amplitude_i = mp.mpf("1.37")
        amplitude_k = mp.mpf("-0.81")
        phase_i = mp.mpf("0.42")
        phase_k = mp.mpf("-1.13")
        momentum_i = mp.mpf("5.7")
        momentum_k = mp.mpf("9.2")
        epsilon = mp.mpf("1e-35")

        upper_ik = abel_upper(
            amplitude_i,
            phase_i,
            momentum_i,
            amplitude_k,
            phase_k,
            momentum_k,
            epsilon,
        )
        upper_ki = abel_upper(
            amplitude_k,
            phase_k,
            momentum_k,
            amplitude_i,
            phase_i,
            momentum_i,
            epsilon,
        )
        hermitian = (upper_ik + upper_ki) / 2
        target = (
            mp.pi
            * amplitude_i
            * amplitude_k
            * mp.cos(phase_i + phase_k)
            / (2 * (momentum_i + momentum_k))
        )
        self.assertLess(abs(hermitian - target), mp.mpf("1e-30"))

        # The difference-frequency logarithm itself is skew.
        log_term_ik = (
            mp.sin(phase_i - phase_k)
            * mp.log(momentum_i / momentum_k)
            / (momentum_i - momentum_k)
        )
        log_term_ki = (
            mp.sin(phase_k - phase_i)
            * mp.log(momentum_k / momentum_i)
            / (momentum_k - momentum_i)
        )
        self.assertLess(abs(log_term_ik + log_term_ki), mp.mpf("1e-70"))

    def test_cauchy_gram_is_positive_but_affine_difference_can_be_negative(self) -> None:
        momenta = [mp.mpf("2.1"), mp.mpf("4.8"), mp.mpf("10.3")]
        vector = [mp.mpf("1.4"), mp.mpf("-0.7"), mp.mpf("0.2")]
        gram_value = mp.fsum(
            vector[j] * vector[k] / (momenta[j] + momenta[k])
            for j in range(3)
            for k in range(3)
        )
        laplace_value = mp.quad(
            lambda u: mp.fsum(
                vector[j] * mp.exp(-momenta[j] * u) for j in range(3)
            ) ** 2,
            [0, mp.inf],
        )
        self.assertGreater(gram_value, 0)
        self.assertLess(abs(gram_value - laplace_value), mp.mpf("1e-70"))

        amplitude = mp.mpf("1.9")
        momentum = mp.mpf("7.2")
        negative_diagonal = (
            mp.pi * amplitude**2 * mp.cos(mp.pi) / (4 * momentum)
        )
        self.assertLess(negative_diagonal, 0)

    def test_two_way_amplitude_uses_value_and_normalized_derivative(self) -> None:
        lam = mp.mpf("5.5")
        weight = mp.mpf("0.73")
        defect_mass = mp.mpf("2.4")
        sample = 3
        momentum = mp.mpf("811")
        h_value = mp.mpf("-0.42")
        h_derivative = mp.mpf("1.17")
        prefactor = mp.sqrt(lam) * weight / (2 * mp.sqrt(defect_mass))
        value = prefactor * h_value
        normalized_derivative = (
            -prefactor * sample * lam * h_derivative / momentum
        )
        amplitude = mp.sqrt(value**2 + normalized_derivative**2)
        cosine = value / amplitude
        sine = normalized_derivative / amplitude

        self.assertLess(abs(amplitude * cosine - value), mp.mpf("1e-70"))
        self.assertLess(
            abs(momentum * amplitude * sine + prefactor * sample * lam * h_derivative),
            mp.mpf("1e-70"),
        )
        # The product of two such amplitudes already contains lambda/4.
        self.assertLess(abs((mp.sqrt(lam) / 2) ** 2 - lam / 4), mp.mpf("1e-70"))

    def test_exact_higher_sampler_sum_and_dimension_free_majorant(self) -> None:
        exact = 2 * mp.zeta(3) - mp.mpf(3) / 2
        cutoff = 20_000
        partial = mp.fsum(
            (mp.harmonic(m + 1) - 1) / m**2
            for m in range(2, cutoff + 1)
        )
        error = exact - partial
        self.assertGreater(error, 0)
        self.assertLess(error, (mp.log(cutoff) + 3) / cutoff)
        self.assertGreater(exact, 0)
        self.assertLess(exact, 1)

        # With C_LG=1, q<=3c/(4pi), and J>=pi/2, equation (4.4).
        majorant = 3 * exact / (4 * mp.pi)
        self.assertLess(majorant, mp.mpf("0.25"))

    def test_bulk_momentum_has_uniform_sum_frequency_floor(self) -> None:
        c_value = mp.mpf("137")
        for alpha in (mp.mpf("1"), mp.mpf("17"), mp.mpf("91")):
            r_squared = alpha / c_value
            for sampler in range(2, 30):
                x = mp.sqrt(sampler**2 - 1)
                y = mp.sqrt(x**2 + r_squared)
                momentum = c_value * sampler * y / x
                self.assertGreaterEqual(momentum, c_value * sampler)
                self.assertGreaterEqual(x, mp.sqrt(3) * sampler / 2)

    def test_unweighted_mod_four_residues_cancel_at_s_one(self) -> None:
        log_two = mp.log(2)

        def zeta_part(s_value: mp.mpf) -> mp.mpf:
            a_value = mp.power(2, -s_value)
            return (
                -(2 * a_value**2 - a_value) * mp.diff(mp.zeta, s_value)
                + log_two
                * (4 * a_value**2 - a_value)
                * mp.zeta(s_value)
            )

        residues = []
        for exponent in (8, 12, 16, 20):
            epsilon = mp.power(10, -exponent)
            residues.append(epsilon * zeta_part(1 + epsilon))
        self.assertLess(max(abs(value) for value in residues[-2:]), mp.mpf("1e-14"))

        derivative_coefficient = -log_two / 2
        zeta_prime_residue = derivative_coefficient
        zeta_residue = log_two / 2
        self.assertEqual(zeta_prime_residue + zeta_residue, 0)

    def test_finite_fejer_mod_four_pole_coefficient_need_not_cancel(self) -> None:
        cutoff = 2
        omega_two = 1 - mp.mpf(2) / (cutoff + 1)
        s_value = mp.mpf("1.3")
        coefficient = -omega_two * mp.power(2, -s_value)
        self.assertNotEqual(coefficient, 0)
        self.assertLess(coefficient, 0)

    def test_compact_time_branch_equals_swapped_mellin_integral(self) -> None:
        lam = mp.mpf("2.5")
        area = lam**2
        length = mp.log(area)
        z_value = mp.mpf("0.37") + mp.mpf("0.71") * 1j
        sampler_max = int(mp.floor(area))

        time_breaks = [mp.mpf("0")]
        time_breaks.extend(mp.log(m) for m in range(2, sampler_max + 1))
        time_breaks.append(length)

        def time_integrand(s_value: mp.mpf) -> mp.mpc:
            samples = mp.fsum(
                compact_even_profile(m * lam * mp.exp(-s_value), lam)
                for m in range(1, sampler_max + 1)
            )
            return samples * mp.exp(-z_value * s_value)

        direct = mp.quad(time_integrand, time_breaks)

        x_breaks = [mp.mpf(1) / area]
        x_breaks.extend(mp.mpf(m) / area for m in range(2, sampler_max + 1))
        x_breaks.append(mp.mpf("1"))

        def mellin_integrand(x_value: mp.mpf) -> mp.mpc:
            partial_sum = mp.fsum(
                mp.power(m, -z_value)
                for m in range(1, int(mp.floor(area * x_value)) + 1)
            )
            return (
                compact_even_profile(lam * x_value, lam)
                * mp.power(x_value, z_value - 1)
                * partial_sum
            )

        swapped = mp.quad(mellin_integrand, x_breaks)
        self.assertLess(abs(direct - swapped), mp.mpf("1e-55"))

        reflected_breaks = sorted(
            set(
                time_breaks
                + [length - mp.log(m) for m in range(1, sampler_max + 1)]
            )
        )

        def reciprocal_integrand(s_value: mp.mpf) -> mp.mpc:
            samples = mp.fsum(
                compact_even_profile(m * mp.exp(s_value) / lam, lam)
                for m in range(1, sampler_max + 1)
            )
            return mp.exp(s_value) * samples * mp.exp(-z_value * s_value)

        reciprocal = mp.quad(reciprocal_integrand, reflected_breaks)

        def compact_transform(exponent: mp.mpc) -> mp.mpc:
            def integrand(s_value: mp.mpf) -> mp.mpc:
                samples = mp.fsum(
                    compact_even_profile(m * lam * mp.exp(-s_value), lam)
                    for m in range(1, sampler_max + 1)
                )
                return samples * mp.exp(-exponent * s_value)

            return mp.quad(integrand, time_breaks)

        full_direct = mp.sqrt(lam) * direct / 2 + reciprocal / (2 * mp.sqrt(lam))
        full_reflected = (
            mp.sqrt(lam) * direct / 2
            + mp.power(area, 1 - z_value)
            * compact_transform(1 - z_value)
            / (2 * mp.sqrt(lam))
        )
        self.assertLess(abs(full_direct - full_reflected), mp.mpf("1e-55"))

        half_integral = mp.quad(
            lambda u: compact_even_profile(u, lam),
            [0, lam],
        )
        self.assertLess(abs(half_integral), mp.mpf("1e-70"))
        truncated = mp.quad(
            lambda x: compact_even_profile(lam * x, lam),
            [1 / area, 1],
        )
        omitted = -mp.quad(
            lambda u: compact_even_profile(u, lam) / lam,
            [0, 1 / lam],
        )
        self.assertLess(abs(truncated - omitted), mp.mpf("1e-70"))

    def test_sharp_mask_has_only_one_gap_denominator(self) -> None:
        for odd_integer in (1, 3, 9, 31):
            gap = 2 * mp.pi * odd_integer
            value = (mp.exp(1j * gap) - mp.exp(1j * gap / 2)) / (1j * gap)
            self.assertLess(abs(abs(value) - 2 / abs(gap)), mp.mpf("1e-70"))

    def test_post_constants_and_scope_are_serialized(self) -> None:
        required = (
            "all coherent sampler pairs `m,l>=2`",
            r"{\lambda\over4}\omega_M(m)\omega_M(l)",
            "with no factor `m/l` or `l/m`",
            r"W_{m,j}&=-{\sqrt\lambda\over2}\omega_M(m)",
            r"{\cal A}_{m,j}&=(V_{m,j}^2+W_{m,j}^2)^{1/2}",
            "already contains the",
            "direct-source factor `lambda/4`",
            r"(C_+)_{ik}={1\over P_i+P_k}",
            "difference** of two positive Cauchy",
            "It is not an `I+iH` boundary matrix",
            r"2\zeta(3)-{3\over2}",
            r"A^M=C^L\circ C^b\circ q^M",
            "unital completely positive Schur",
            "the whole inward profile stays there",
            r"m_a(\xi)={1\over\sqrt{1+q_r(\xi)}}",
            r"{\cal H}_{\rm hard}^M",
            r"-(2a^2-a)\zeta'(s)",
            "They cancel exactly",
            r"C_M(N)=2\omega_M(1)\ell_M(N)-\omega_M(1)^2\Lambda(N)",
            r"\mathfrak S^\sharp_{\geq2}(L)",
            r"{\cal J}^M",
            "A supremum over `M` after",
            "subtracting the limiting core is false",
            "action-gap denominator",
            "false Euler main",
            "does not license splitting artificial internal",
            "The compact-`f` inward time branch",
            r"{A^{1-z}\over2\sqrt\lambda}{\cal T}_A(f;1-z)",
            "not a finite-Fejer identity",
            "There is no frozen weighted Poisson/orientation identity",
            "The sampler `m=1` has `x_1=0`",
            "edge--bulk or bulk--edge channel",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

        forbidden = (
            "the expanded affine block is positive",
            "weighted fixed-product sample `K(N)` equals",
            "the finite-`M` scalar gate is proved",
            "the edge--bulk block is o(L)",
            "this proves the complete Plemelj assembly",
            "this proves RH",
            r"\boxed{{\cal A}_{m,j}={\sqrt\lambda\over2}",
        )
        for phrase in forbidden:
            self.assertNotIn(phrase, self.text)

    def test_tex_tags_and_control_bytes_survive_serialization(self) -> None:
        for path in (NOTE, Path(__file__)):
            bad = [
                value
                for value in path.read_bytes()
                if value < 32 and value not in (9, 10)
            ]
            self.assertEqual(bad, [], str(path))

        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(self.text.count("\n\\[\n"), self.text.count("\n\\]\n"))
        self.assertIsNone(
            re.search(
                r"\\tag\{[^}]+\}\s*\\end\{(?:aligned|gathered)\}",
                self.text,
            )
        )
        for malformed in (
            "{cal A}",
            ",qquad",
            "int_R",
            "(L/2)mathsf X",
            "+left(",
            r"\left{",
            r"\right}",
            "\n\\[\n\\[\n",
        ):
            self.assertNotIn(malformed, self.text)


if __name__ == "__main__":
    unittest.main()
