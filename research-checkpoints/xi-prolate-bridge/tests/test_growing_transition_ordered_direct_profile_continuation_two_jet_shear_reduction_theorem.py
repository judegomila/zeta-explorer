#!/usr/bin/env python3
"""Regressions for ordered continuation and the endpoint two-jet shear."""

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
    / "GROWING_TRANSITION_ORDERED_DIRECT_PROFILE_CONTINUATION_TWO_JET_SHEAR_REDUCTION_THEOREM.md"
)
NOTE_HASH = "e3b1228a1fb22270a01f061c198239f3e60cb00b675da55ddd13420f9929dea3"

DEPENDENCIES = {
    "notes/GROWING_TRANSITION_FINITE_FEJER_XI_WRONSKIAN_ASSEMBLY_GATE.md":
        "41dad88fd3e5bcb3277ccadb6baaa4bfa40ab683d15c747bebe8a50ce759ff23",
    "tests/test_growing_transition_finite_fejer_xi_wronskian_assembly_gate.py":
        "dcb9640a5294ae5c44502f983f20f9eadcdf8271dd02099b9d3887f255460aee",
    "notes/GROWING_TRANSITION_LOCKED_CARRIER_FLAT_SCALAR_SUM_THEOREM.md":
        "cf51bc269592e5ae2393e0c30931ca8fb4723283e70bb5981345f6e822afcc9e",
    "tests/test_growing_transition_locked_carrier_flat_scalar_sum_theorem.py":
        "6577d3a20f6917a7a807ded2bd90b8879122b7c259cbb6ce6be1b6ac22f8d5a3",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "tests/test_growing_transition_edge_carleman_scattering_obstruction.py":
        "b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb",
    "notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md":
        "287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0",
    "tests/test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem.py":
        "36d9ca8f522f10b3bf8fd98bffa7b0a0e26a67eaee94ebaba18ff4912b9d651a",
    "notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md":
        "e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17",
    "tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py":
        "545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "tests/test_growing_transition_equality_conductor_garding_theorem.py":
        "61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_TWO_ANCHOR_BULK_TRACE_OBSTRUCTION_THEOREM.md":
        "cb2afb9b28cbcaf4dbd55802b72e59a3f71cad0fa84e69ee18252c5f7dbef591",
    "tests/test_growing_transition_direct_source_two_anchor_bulk_trace_obstruction_theorem.py":
        "bd888e61906c5c696f8a7338dbf4d1b6861c888ee863d2ba6ba9ab14d05d8892",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def matmul(left: list[list[float]], right: list[list[float]]) -> list[list[float]]:
    return [
        [
            sum(left[i][k] * right[k][j] for k in range(len(right)))
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


class OrderedDirectProfileTwoJetShearTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 70
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_all_dependencies_are_hash_pinned(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in DEPENDENCIES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_finite_m_counterexample_is_a_physical_fourier_pair(self) -> None:
        lam = mp.mpf(5) / 2
        t_value = mp.mpf(1) / 5

        def source(x_value: mp.mpf) -> mp.mpf:
            if abs(x_value) > lam:
                return mp.mpf("0")
            u_value = x_value / lam
            return (
                u_value ** 2
                * (1 - u_value ** 2) ** 5
                * (u_value ** 2 - mp.mpf(1) / 5)
            )

        def fourier(y_value: mp.mpf) -> mp.mpf:
            return 2 * mp.quad(
                lambda x_value: source(x_value)
                * mp.cos(2 * mp.pi * x_value * y_value),
                [0, lam],
            )

        self.assertEqual(source(0), 0)
        self.assertEqual(source(lam), 0)
        self.assertLess(
            abs(mp.quad(source, [-lam, 0, lam])), mp.mpf("1e-60")
        )

        # M=1 has omega_1(1)=1/2 and no other sampler.
        small_argument = mp.e ** (-t_value) / lam
        inward = mp.sqrt(lam) / 4 * (
            source(small_argument) + fourier(small_argument)
        )
        lambda_outward = (
            lam ** mp.mpf("1.5")
            * mp.e ** t_value
            / 4
            * fourier(lam * mp.e ** t_value)
        )
        self.assertLess(
            abs(inward - mp.mpf("-0.00454037117166042924514127976520")),
            mp.mpf("1e-30"),
        )
        self.assertLess(
            abs(lambda_outward - mp.mpf("-0.000000225761913761817187436654714")),
            mp.mpf("1e-32"),
        )
        self.assertGreater(abs(inward - lambda_outward), mp.mpf("0.004"))

    def test_ordered_continuation_coefficient(self) -> None:
        # At s=L+t, the first full time-sampler coefficient is sqrt(lambda)/2.
        # Multiplying b by lambda gives the same coefficient.
        for lam in (2.5, 4.5, 8.5):
            self.assertAlmostEqual(
                math.sqrt(lam) / 2,
                lam / (2 * math.sqrt(lam)),
                places=15,
            )
        for token in (
            r"a_f(L+t)=\lambda b_f(t)",
            "ordered complete profiles",
            "not a coefficientwise identity",
        ):
            self.assertIn(token, self.text)

    def test_off_diagonal_cauchy_inertia_is_paired(self) -> None:
        # A two-by-two separated Cauchy compression T.
        x_values = (0.1, 0.7)
        u_values = (1.2, 2.0)
        t_matrix = [[1 / (u - x) for u in u_values] for x in x_values]
        # For B=[[0,T],[T^T,0]], traces of odd powers vanish and det(B)>0
        # in dimension four; a direct symmetric Jacobi calculation is avoided.
        zero = [[0.0, 0.0], [0.0, 0.0]]
        transpose_t = [list(row) for row in zip(*t_matrix)]
        block = [
            zero[0] + t_matrix[0],
            zero[1] + t_matrix[1],
            transpose_t[0] + zero[0],
            transpose_t[1] + zero[1],
        ]
        signature = [[1.0, 0.0, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0],
                     [0.0, 0.0, -1.0, 0.0], [0.0, 0.0, 0.0, -1.0]]
        anti_left = matmul(signature, block)
        anti_right = matmul(block, signature)
        for i in range(4):
            for j in range(4):
                self.assertAlmostEqual(anti_left[i][j], -anti_right[i][j])
        self.assertIn(r"\pm {s_\nu(T)\over2\lambda}", self.text)
        self.assertIn("not a positive Carleman square", self.text)

    def test_stable_eta_rho_anchor_limit(self) -> None:
        limiting = [[1.0, 1.0], [-17.0, -25.0]]
        determinant = (
            limiting[0][0] * limiting[1][1]
            - limiting[0][1] * limiting[1][0]
        )
        self.assertEqual(determinant, -8.0)
        trace_gram = 916.0
        sigma_min = math.sqrt(
            (trace_gram - math.sqrt(trace_gram ** 2 - 4 * determinant ** 2))
            / 2
        )
        self.assertAlmostEqual(sigma_min, 0.2643375224737613, places=14)

        # alpha_12-alpha_8=-8 and c=2*pi*lambda^2 give the raw determinant.
        for lam in (10.0, 100.0):
            c_value = 2 * math.pi * lam ** 2
            endpoint_product = 2 * math.pi * lam
            raw_det = endpoint_product * (-c_value / (2 * lam)) * (-8)
            self.assertAlmostEqual(raw_det, 16 * math.pi ** 2 * lam ** 2)
        for token in (
            r"\det M_*=-8",
            r"16\pi^2\lambda^2\{1+o(1)\}",
            r"\ker(\eta,\rho)=\ker(\eta,\kappa)",
        ):
            self.assertIn(token, self.text)

    def test_exact_two_row_shear_kills_value_and_derivative(self) -> None:
        anchor = [[2.0, 1.0], [1.0, 3.0]]
        rest = [[5.0], [-2.0]]
        determinant = 5.0
        inverse = [[3 / determinant, -1 / determinant],
                   [-1 / determinant, 2 / determinant]]
        transfer = matmul(inverse, rest)
        row_map = [anchor[0] + rest[0], anchor[1] + rest[1]]
        shear = [[1.0, 0.0, -transfer[0][0]],
                 [0.0, 1.0, -transfer[1][0]],
                 [0.0, 0.0, 1.0]]
        transformed = matmul(row_map, shear)
        self.assertLess(abs(transformed[0][2]), 1e-15)
        self.assertLess(abs(transformed[1][2]), 1e-15)
        self.assertIn(r"D^\#=S^*D_{\rm full}S", self.text)

    def test_jump_atoms_and_next_jet(self) -> None:
        lam = 3.5
        m_value = 4
        weight = 0.7
        kappa = -1.25
        second = 2.75
        x_at_jump = lam
        first_jump = (
            math.sqrt(lam) / 2 * weight * (-x_at_jump * kappa)
        )
        expected_first = -lam ** 1.5 / 2 * weight * kappa
        self.assertAlmostEqual(first_jump, expected_first)
        second_jump = (
            math.sqrt(lam) / 2
            * weight
            * (x_at_jump * 0 + x_at_jump ** 2 * second)
        )
        expected_second = lam ** 2.5 / 2 * weight * second
        self.assertAlmostEqual(second_jump, expected_second)

        # For h=e^s omega f(me^s/lambda)/(2 sqrt(lambda)) supported
        # to the left of s_0=L-log(m), the distributional jump is
        # right-minus-left.  Evaluate the smooth left derivatives at s_0
        # independently of the closed formulas recorded in the note.
        endpoint_prefactor = lam ** 1.5 / (2 * m_value) * weight
        reciprocal_first_left = endpoint_prefactor * (0 + lam * kappa)
        reciprocal_first_jump = -reciprocal_first_left
        expected_reciprocal_first = (
            -lam ** 2.5 / (2 * m_value) * weight * kappa
        )
        self.assertAlmostEqual(
            reciprocal_first_jump, expected_reciprocal_first
        )
        reciprocal_second_left = endpoint_prefactor * (
            0 + 3 * lam * 0 + lam ** 2 * second
        )
        reciprocal_second_jump = -reciprocal_second_left
        expected_reciprocal_second = (
            -lam ** 3.5 / (2 * m_value) * weight * second
        )
        self.assertAlmostEqual(
            reciprocal_second_jump, expected_reciprocal_second
        )
        self.assertNotEqual(reciprocal_first_jump, first_jump)
        self.assertLess(reciprocal_second_jump, 0)

        # The two internal atom locations cannot collide on A=p^2/4.
        for odd_p in range(5, 31, 2):
            a_value = odd_p ** 2 / 4
            for left_m in range(2, math.ceil(a_value)):
                for right_m in range(2, math.ceil(a_value)):
                    self.assertNotEqual(left_m * right_m, a_value)

        c_value = 11.0
        alpha = 7.0
        p_two = c_value ** 2 * alpha ** 2 / 8 + c_value * alpha / 4 - c_value ** 2 / 2
        delta = -c_value * alpha
        recurrence_value = ((delta - 2) * delta / 2 - 2 * c_value ** 2) / 4
        self.assertAlmostEqual(p_two, recurrence_value)
        for token in (
            r"[h'_m]_{L-\log m}",
            r"{\lambda^{5/2}\over2m}",
            r"{\lambda^{7/2}\over2m}",
            r"D_s^2a^{\rm time}_{f,M}\big|_{\rm int.atoms}",
            r"\sum_{2\leq m<A}\omega_M(m)\delta_{\log m}",
            r"\sum_{2\leq m<A}{\omega_M(m)\over m}",
            r"J_{2,M}^\uparrow=\kappa^*R_M^{\rm comb}",
            "Hermitian rank is at most two",
            "`alpha^2` endpoint moment",
        ):
            self.assertIn(token, self.text)

    def test_whole_profile_euler_main_cancellation(self) -> None:
        # For f(u)=u^2 near zero, the short-origin identity and 1/(6A)
        # scaling are exact up to the chosen ||f''||=2 normalization.
        for lam in (5.0, 20.0, 100.0):
            a_value = lam ** 2
            short_integral = (1 / lam) ** 3 / 3
            main_at_z_zero = a_value / lam * short_integral
            bound = 2 / (6 * a_value)
            self.assertAlmostEqual(main_at_z_zero, bound)

        # The complete ordered transform is the first branch plus its
        # reflected 1-z branch, with the exact profile coefficients.
        lam_mp = mp.mpf("2.5")
        area_mp = lam_mp ** 2
        length_mp = mp.log(area_mp)
        z_mp = mp.mpf("0.37") + mp.mpf("0.71") * 1j
        sampler_max = int(mp.floor(area_mp))

        def source(value: mp.mpf) -> mp.mpf:
            if abs(value) > lam_mp:
                return mp.mpf("0")
            y_value = value / lam_mp
            return (
                y_value ** 2
                * (1 - y_value ** 2) ** 2
                * (y_value ** 2 - mp.mpf(1) / 3)
            )

        breaks = sorted(
            {mp.mpf("0"), length_mp}
            | {mp.log(m) for m in range(2, sampler_max + 1)}
            | {length_mp - mp.log(m) for m in range(2, sampler_max + 1)}
        )

        def first_profile(s_value: mp.mpf) -> mp.mpf:
            return mp.fsum(
                source(m * lam_mp * mp.exp(-s_value))
                for m in range(1, sampler_max + 1)
            )

        def full_profile(s_value: mp.mpf) -> mp.mpf:
            reciprocal = mp.fsum(
                source(m * mp.exp(s_value) / lam_mp)
                for m in range(1, sampler_max + 1)
            )
            return (
                mp.sqrt(lam_mp) / 2 * first_profile(s_value)
                + mp.exp(s_value) / (2 * mp.sqrt(lam_mp)) * reciprocal
            )

        full_transform = mp.quad(
            lambda s_value: full_profile(s_value) * mp.exp(-z_mp * s_value),
            breaks,
        )
        first_transform = mp.quad(
            lambda s_value: first_profile(s_value) * mp.exp(-z_mp * s_value),
            breaks,
        )
        reflected_transform = mp.quad(
            lambda s_value: first_profile(s_value)
            * mp.exp(-(1 - z_mp) * s_value),
            breaks,
        )
        assembled = (
            mp.sqrt(lam_mp) / 2 * first_transform
            + area_mp ** (1 - z_mp)
            / (2 * mp.sqrt(lam_mp))
            * reflected_transform
        )
        self.assertLess(abs(full_transform - assembled), mp.mpf("1e-55"))

        # Exact Fejer identity when M covers every m<=X.
        z_value = 0.4 + 0.7j
        cutoff = 30
        for x_value in (1.0, 4.7, 17.2, 29.9):
            integers = range(1, math.floor(x_value) + 1)
            weighted = sum(
                (1 - m / (cutoff + 1)) * m ** (-z_value)
                for m in integers
            )
            split = (
                sum(m ** (-z_value) for m in integers)
                - sum(m ** (1 - z_value) for m in integers) / (cutoff + 1)
            )
            self.assertAlmostEqual(weighted.real, split.real, places=14)
            self.assertAlmostEqual(weighted.imag, split.imag, places=14)
        for token in (
            r"S_M(X,z)=S(X,z)-{1\over M+1}S(X,z-1)",
            r"{A^{1-z}\over2\sqrt\lambda}T_A(f;1-z)",
            "`zeta(z)` and `zeta(1-z)`",
            "not the complete inward profile",
            "do not supply",
            "the missing frame estimate",
        ):
            self.assertIn(token, self.text)

    def test_weakened_schur_threshold(self) -> None:
        kappa_zero = 0.2
        for length in (1e4, 1e8, 1e12):
            cross_o_l = length ** 0.9
            cross_o_sqrt_l = length ** 0.4
            erosion_large = cross_o_l ** 2 / (kappa_zero * length)
            erosion_small = cross_o_sqrt_l ** 2 / (kappa_zero * length)
            self.assertAlmostEqual(
                erosion_large / length, 5 * length ** -0.2, places=12
            )
            self.assertAlmostEqual(
                erosion_small, 5 * length ** -0.2, places=12
            )
        self.assertIn(r"=o(L)", self.text)
        self.assertIn(r"=o(\sqrt L)", self.text)
        self.assertIn(r"R_{M,R}^{\rm comb,norm}", self.text)

    def test_gamma_and_pa_exclusions_are_literal(self) -> None:
        for token in (
            r"\Gamma_{\rm in}=\Gamma_{\rm out}",
            r"2\Gamma_{\rm in}^*(\beta_0-\lambda\beta_L)",
            "complete multi-sampler Plemelj synthesis",
            "complete Plemelj assembly `PA` remains open",
            "full-metric Schur theorem",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_displayed_tags_are_unique_and_tex_is_sane(self) -> None:
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        aligned_blocks = re.findall(
            r"\\begin\{aligned\}(.*?)\\end\{aligned\}",
            self.text,
            flags=re.DOTALL,
        )
        self.assertTrue(aligned_blocks)
        for block in aligned_blocks:
            self.assertNotIn(r"\tag{", block)
        self.assertNotRegex(self.text, r"(?<!\\)qquad")
        self.assertNotRegex(self.text, r"(?<!\\)text\{")


if __name__ == "__main__":
    unittest.main()
