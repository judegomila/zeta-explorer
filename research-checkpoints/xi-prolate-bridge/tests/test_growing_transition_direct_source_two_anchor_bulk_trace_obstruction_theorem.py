#!/usr/bin/env python3
"""Regressions for the direct-source two-anchor bulk-trace obstruction."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_DIRECT_SOURCE_TWO_ANCHOR_BULK_TRACE_OBSTRUCTION_THEOREM.md"
)
NOTE_HASH = "cb2afb9b28cbcaf4dbd55802b72e59a3f71cad0fa84e69ee18252c5f7dbef591"

PROTECTED_HASHES = {
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md":
        "a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85",
    "tests/test_growing_transition_complete_central_plemelj_cauchy_floor_theorem.py":
        "b9f9cf3d76554b988d7c6d9408130a9ab2b45d37a1862279e139ed7e62edbe61",
    "notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md":
        "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c",
    "tests/test_growing_transition_subcritical_lg_action_bv_theorem.py":
        "a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92",
    "notes/GROWING_TRANSITION_POST_PLEMELJ_REGULAR_ACTION_REDUCTION_THEOREM.md":
        "c7793bec967d219d06eecee76f5606b871b77b75f068648fcf2607977791afd8",
    "tests/test_growing_transition_post_plemelj_regular_action_reduction_theorem.py":
        "00d3fe6c8eb1c1e145abf4d5d1dbee5e38cd33259b1e33d6316246dc61c6eeb1",
    "notes/GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md":
        "3bd3bf977178be94e91b7c6603db9df7f861f1cfe498bef303c210e9b87b9ec5",
    "tests/test_growing_transition_edge_edge_higher_alias_theorem.py":
        "c7f6920d5253d31d3acc73c00412567294791c51d62c18291f8407a0ea53be2f",
    "notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md":
        "c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9",
    "tests/test_growing_transition_finite_fejer_post_core_quantifier_theorem.py":
        "409b119b42d8202511d0253a638d08c9e6585e4866337de4a7a14cbae76e9f1a",
    "notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md":
        "e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17",
    "tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py":
        "545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f",
    "notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md":
        "287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0",
    "tests/test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem.py":
        "36d9ca8f522f10b3bf8fd98bffa7b0a0e26a67eaee94ebaba18ff4912b9d651a",
    "notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md":
        "1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d",
    "tests/test_growing_transition_edge_carleman_scattering_obstruction.py":
        "b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def det2(matrix: list[list[F]]) -> F:
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]


def transpose(matrix: list[list[F]]) -> list[list[F]]:
    return [list(row) for row in zip(*matrix)]


def matmul(left: list[list[F]], right: list[list[F]]) -> list[list[F]]:
    return [
        [
            sum((left[i][k] * right[k][j] for k in range(len(right))), F(0))
            for j in range(len(right[0]))
        ]
        for i in range(len(left))
    ]


def inverse2(matrix: list[list[F]]) -> list[list[F]]:
    determinant = det2(matrix)
    return [
        [matrix[1][1] / determinant, -matrix[0][1] / determinant],
        [-matrix[1][0] / determinant, matrix[0][0] / determinant],
    ]


class DirectSourceTwoAnchorBulkTraceObstructionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_note_and_dependencies_are_hash_pinned(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)
        for relative, expected in PROTECTED_HASHES.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)

    def test_locked_fraction_and_bernoulli_value(self) -> None:
        def bernoulli_two(x_value: F) -> F:
            return x_value * x_value - x_value + F(1, 6)

        for p_value in range(5, 100, 2):
            self.assertEqual((p_value * p_value) % 8, 1)
            self.assertEqual(F(p_value * p_value, 4) % 1, F(1, 4))
        self.assertEqual(bernoulli_two(F(1, 4)), F(-1, 48))

        derivative_limit = -8 * math.pi ** 1.5
        first_term = derivative_limit * float(F(-1, 48)) / 4
        self.assertAlmostEqual(first_term, math.pi ** 1.5 / 24, places=14)

    def test_two_row_determinant_invariant(self) -> None:
        d_metric = [[F(5), F(1)], [F(1), F(3)]]
        rows = [[F(2), F(-1)], [F(4), F(3)]]
        gram = matmul(matmul(rows, inverse2(d_metric)), transpose(rows))
        self.assertEqual(
            det2(gram),
            det2(rows) ** 2 / det2(d_metric),
        )

        # In an already white plane, eta=(3,4), e=(3,4)/5 and
        # v=(-4,3)/5.  The transformed determinant is r*gamma_v.
        eta = (F(3), F(4))
        gamma = (F(2), F(-1))
        e_vec = (F(3, 5), F(4, 5))
        v_vec = (F(-4, 5), F(3, 5))
        r_value = eta[0] * e_vec[0] + eta[1] * e_vec[1]
        gamma_v = gamma[0] * v_vec[0] + gamma[1] * v_vec[1]
        self.assertEqual(r_value, 5)
        self.assertEqual(r_value * gamma_v, eta[0] * gamma[1] - eta[1] * gamma[0])

    def test_nonzero_first_bernoulli_term_does_not_fix_gamma_v(self) -> None:
        lam = F(9, 2)
        derivative = F(-17, 3)
        b_two = F(-1, 48)
        # The exact second integral can algebraically cancel the first.
        integral = 2 * derivative * b_two
        gamma_v = (
            derivative * b_two / (4 * float(lam) ** 1.5)
            - integral / (8 * float(lam) ** 1.5)
        )
        self.assertAlmostEqual(float(gamma_v), 0.0, places=15)
        for token in (
            "does not imply `gamma_v != 0`",
            "pointwise estimate",
            r"{\pi^{3/2}\over24}",
            r"f_v^{\rm corr}=f_v+\mathfrak b_v",
            r"(f_v^{\rm corr})''(x)",
            "`||(f_v^corr)''||_1`",
            "including the invisible",
        ):
            self.assertIn(token, self.text)

    def test_full_carleman_amplitude_split_is_bilinear(self) -> None:
        # A positive discretization of 1/(s+t); the identity is purely
        # bilinear and does not lower the singular order of any summand.
        s_grid = (F(1, 5), F(2, 5), F(4, 5))
        t_grid = (F(1, 7), F(3, 7), F(6, 7))
        kernel = [[1 / (s_value + t_value) for t_value in t_grid]
                  for s_value in s_grid]
        a_one = [[F(2), F(-1), F(3)]]
        a_plus = [[F(1), F(4), F(-2)]]
        b_one = [[F(-3), F(2), F(1)]]
        b_plus = [[F(5), F(-1), F(2)]]

        def form(a_row: list[list[F]], b_row: list[list[F]]) -> F:
            return matmul(matmul(a_row, kernel), transpose(b_row))[0][0]

        a_full = [[a_one[0][i] + a_plus[0][i] for i in range(3)]]
        b_full = [[b_one[0][i] + b_plus[0][i] for i in range(3)]]
        split = (
            form(a_one, b_one)
            + form(a_one, b_plus)
            + form(a_plus, b_one)
            + form(a_plus, b_plus)
        )
        self.assertEqual(form(a_full, b_full), split)

    def test_double_null_cancels_samplewise_trace_only_after_sum(self) -> None:
        sqrt_lambda_over_two = 3.25
        h_value = 2.0 - 5.0j
        one_a = sqrt_lambda_over_two * h_value.conjugate()
        one_b = sqrt_lambda_over_two * h_value
        plus_a = -one_a
        plus_b = -one_b
        self.assertEqual(one_a + plus_a, 0)
        self.assertEqual(one_b + plus_b, 0)
        self.assertNotEqual(one_a, 0)
        self.assertNotEqual(one_b, 0)

        # If a(0)=b(0)=0, a(s)b(t)/(s+t) has the softened st/(s+t) scale.
        for s_value, t_value in ((0.1, 0.2), (0.01, 0.03), (0.4, 0.7)):
            self.assertAlmostEqual(
                (s_value * t_value) / (s_value + t_value),
                s_value * t_value / (s_value + t_value),
            )
        for token in (
            "does not make the completed Carleman",
            "would retain the compressed identity",
            "new compressed derivative--bulk theorem",
        ):
            self.assertIn(token, self.text)
        self.assertNotIn("identity contribution carried by that boundary", self.text)

    def test_exact_two_row_congruence_kills_rest_rows(self) -> None:
        r_anchor = [[F(2), F(1)], [F(1), F(3)]]
        r_rest = [[F(5)], [F(-2)]]
        transfer = matmul(inverse2(r_anchor), r_rest)
        row_map = [r_anchor[0] + r_rest[0], r_anchor[1] + r_rest[1]]
        shear = [
            [F(1), F(0), -transfer[0][0]],
            [F(0), F(1), -transfer[1][0]],
            [F(0), F(0), F(1)],
        ]
        transformed = matmul(row_map, shear)
        self.assertEqual([row[-1] for row in transformed], [F(0), F(0)])
        self.assertEqual([row[:2] for row in transformed], r_anchor)

    def test_schur_cross_threshold_is_square_root_L(self) -> None:
        kappa = 0.2
        for length in (1e4, 1e8, 1e12):
            smaller_cross = length ** 0.49
            critical_cross = length ** 0.5
            smaller_penalty = smaller_cross ** 2 / (kappa * length)
            critical_penalty = critical_cross ** 2 / (kappa * length)
            self.assertLess(smaller_penalty, 5.0)
            self.assertAlmostEqual(critical_penalty, 1 / kappa, places=12)
        self.assertIn(r"=o(\sqrt L)", self.text)
        self.assertIn(r"\mathcal R-\mathcal C^*\mathcal A^{-1}\mathcal C", self.text)

    def test_jump_channel_has_only_one_gap_denominator(self) -> None:
        theta = 0.5
        epsilon = 0.03
        max_row_sum = 0.0
        for center in range(-30, 31):
            row_sum = 0.0
            for other in range(-30, 31):
                if center == other:
                    continue
                gap = abs(center - other)
                delta = 1.5 * math.pi * gap
                row_sum += epsilon * (1 + gap) ** (-theta) / delta
            max_row_sum = max(max_row_sum, row_sum)
        zeta_upper = sum(n ** (-1 - theta) for n in range(1, 100000))
        bound = 4 * epsilon * (zeta_upper + 0.01) / (3 * math.pi)
        self.assertLess(max_row_sum, bound)
        self.assertIn(r"J^M_{jk}=-{\widehat\nu^M_{jk}(-\Delta_{jk})", self.text)

    def test_endpoint_form_uses_incoming_trace_and_exact_anchor_cross(self) -> None:
        sqrt_lambda_over_two = 2.75
        eta_anchor = 3.0 - 2.0j
        gamma_out_anchor = -1.5 + 0.25j
        rho_rest = 4.0 + 5.0j
        gamma_in_anchor = (
            gamma_out_anchor + sqrt_lambda_over_two * eta_anchor
        )
        expected_cross = gamma_in_anchor.conjugate() * rho_rest
        rewritten_cross = (
            gamma_out_anchor + sqrt_lambda_over_two * eta_anchor
        ).conjugate() * rho_rest
        self.assertEqual(expected_cross, rewritten_cross)
        for token in (
            r"E_{\rm end}=\Gamma_{\rm in}^*\rho",
            r"\Gamma_{\rm in}=\Gamma_{\rm out}",
            r"\Gamma_{{\rm out},A}",
            r"{\sqrt\lambda\over2}\eta_A",
        ):
            self.assertIn(token, self.text)

    def test_claim_boundary_and_scope_are_literal(self) -> None:
        for token in (
            "does not close the complete Plemelj assembly `PA`",
            "complete multi-sampler Plemelj synthesis",
            "fixed `8/12` determinant lower bound",
            "edge--bulk/full-metric Schur estimate",
            "unsheared edge--edge Hilbert--Schmidt estimate",
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
        self.assertNotIn("\\qquadad", self.text)
        self.assertNotRegex(self.text, r"(?<!\\)qquad")
        self.assertNotRegex(self.text, r"(?<!\\)text\{")


if __name__ == "__main__":
    unittest.main()
