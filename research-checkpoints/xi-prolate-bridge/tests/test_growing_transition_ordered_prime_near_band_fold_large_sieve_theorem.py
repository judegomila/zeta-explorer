#!/usr/bin/env python3
"""Regressions for the ordered-prime near-band fold large sieve."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "GROWING_TRANSITION_ORDERED_PRIME_NEAR_BAND_FOLD_LARGE_SIEVE_THEOREM.md"
)
NOTE_HASH = "93a42acf8f33a2706e67ca53a929755d021c291a0dd3907099eb3176524e2675"

FROZEN = {
    "notes/GROWING_TRANSITION_ORDERED_PRIME_HARD_TAIL_PNT_GRAM_REDUCTION.md":
        "b8439dcfa6f969fd84dae8fafb5474c3e176ba14d84c7d73140fabeac042a4be",
    "tests/test_growing_transition_ordered_prime_hard_tail_pnt_gram_reduction.py":
        "1101aebef550259387eb6220cf8b2740d728c2f52ddf6349b253d6a555248cb6",
    "notes/GROWING_TRANSITION_ORDERED_PRIME_FAR_ANNULUS_DILATION_LARGE_SIEVE_THEOREM.md":
        "c09ae35ef96a9d897446221354199e6a945c7e4b6d118a4b934b223452e137cc",
    "tests/test_growing_transition_ordered_prime_far_annulus_dilation_large_sieve_theorem.py":
        "1b09dd1eac6356e5a9faecbee8b400911d28577e473ee3583cfb1df349587f1b",
    "notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md":
        "1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c",
    "tests/test_growing_transition_subcritical_lg_action_bv_theorem.py":
        "a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92",
    "notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md":
        "7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564",
    "tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py":
        "caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c",
    "notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md":
        "787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79",
    "tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py":
        "73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py":
        "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class OrderedPrimeNearBandFoldLargeSieveTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_note_and_dependencies_are_frozen(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
        if NOTE_HASH.startswith("DRAFT_"):
            self.skipTest("draft note intentionally awaits final self-hash")
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_literal_near_band_has_no_bessel_origin(self) -> None:
        for odd_p in (5, 9, 21, 101):
            conductor = (odd_p / 2) ** 2
            self.assertAlmostEqual(conductor % 1, 0.25)
            first_index = math.floor(conductor) + 1
            self.assertAlmostEqual(first_index - conductor, 0.75)
            first_edge = 2 * math.pi * (first_index - conductor)
            self.assertAlmostEqual(first_edge, 3 * math.pi / 2)
        for token in (
            "n-A\\geq{3\\over4}",
            "U_n(1)\\geq{3\\pi\\over2}",
            "Bessel origin is therefore never sampled",
            "S_\\gamma(U_n(y))\\geq c_1\\sqrt\\gamma",
        ):
            self.assertIn(token, self.text)

    def test_exact_action_derivative(self) -> None:
        # Audit dS/dU directly from dT/dx and x^2=a_c(U)/c.
        for conductor, gamma, edge in (
            (1_000.0, 20.0, 5.0),
            (20_000.0, 80.0, 100.0),
            (100_000.0, 200.0, 30_000.0),
        ):
            c_value = 2 * math.pi * conductor
            p_value = 2 * edge + edge**2 / c_value
            x_value = math.sqrt(p_value / c_value)
            r_square = gamma / c_value
            dx_du = (1 + edge / c_value) / (c_value * x_value)
            dt_dx = math.sqrt((x_value**2 + r_square) / (1 + x_value**2))
            direct = c_value * dt_dx * dx_du
            claimed = math.sqrt(1 + gamma / p_value)
            self.assertAlmostEqual(direct, claimed, places=12)

    def test_affine_covariance_is_exact(self) -> None:
        for c_value, edge, ratio in (
            (1000.0, 7.0, 1.01),
            (10_000.0, 100.0, 1.2),
            (50_000.0, 8_000.0, 1.8),
        ):
            shifted = ratio * edge + c_value * (ratio - 1)
            p_value = 2 * edge + edge**2 / c_value
            q_value = 2 * shifted + shifted**2 / c_value
            k_value = c_value * (ratio**2 - 1)
            self.assertAlmostEqual(q_value, ratio**2 * p_value + k_value)
        self.assertIn("\\boxed{Q=h^2P+K.}", self.text)

    def test_quadratic_and_discriminant_are_exact(self) -> None:
        for c_value, h_value, alpha, beta, p_value in (
            (10_000.0, 1.001, 40.0, 50.0, 300.0),
            (20_000.0, 1.2, 100.0, 10.0, 80.0),
            (50_000.0, 1.8, 15.0, 250.0, 20_000.0),
        ):
            k_value = c_value * (h_value**2 - 1)
            q_value = h_value**2 * p_value + k_value
            omega_a_sq = 1 + alpha / p_value
            omega_b_sq = 1 + beta / q_value
            direct = p_value * q_value * (
                omega_a_sq - h_value**2 * omega_b_sq
            )
            coefficient_a = -k_value * h_value**2 / c_value
            coefficient_b = (
                h_value**2 * (alpha - beta) - k_value**2 / c_value
            )
            coefficient_c = alpha * k_value
            polynomial = (
                coefficient_a * p_value**2
                + coefficient_b * p_value
                + coefficient_c
            )
            self.assertTrue(math.isclose(direct, polynomial, rel_tol=1e-14))
            discriminant = coefficient_b**2 - 4 * coefficient_a * coefficient_c
            claimed = (
                h_value**4 * (alpha - beta) ** 2
                + 2 * h_value**2 * (alpha + beta) * k_value**2 / c_value
                + k_value**4 / c_value**2
            )
            self.assertTrue(math.isclose(discriminant, claimed, rel_tol=2e-15))

    def test_positive_root_is_simple_with_sqrt_discriminant_slope(self) -> None:
        for c_value, h_value, alpha, beta in (
            (10_000.0, 1.01, 20.0, 20.0),
            (40_000.0, 1.2, 200.0, 15.0),
            (90_000.0, 1.7, 12.0, 300.0),
        ):
            k_value = c_value * (h_value**2 - 1)
            aa = -k_value * h_value**2 / c_value
            bb = h_value**2 * (alpha - beta) - k_value**2 / c_value
            cc = alpha * k_value
            disc = bb**2 - 4 * aa * cc
            roots = ((-bb + math.sqrt(disc)) / (2 * aa),
                     (-bb - math.sqrt(disc)) / (2 * aa))
            positive = [root for root in roots if root > 0]
            negative = [root for root in roots if root < 0]
            self.assertEqual(len(positive), 1)
            self.assertEqual(len(negative), 1)
            slope = 2 * aa * positive[0] + bb
            self.assertAlmostEqual(abs(slope), math.sqrt(disc), places=8)

    def test_fold_and_coherence_scales_are_distinct(self) -> None:
        for conductor, alpha in ((10_000.0, 25.0), (1e8, 100.0)):
            fold_rows = math.sqrt(conductor * alpha)
            coherent_width = math.sqrt(conductor / alpha)
            self.assertAlmostEqual(fold_rows / coherent_width, alpha)
            q_star = math.sqrt(alpha * conductor / (8 * math.pi))
            self.assertTrue(math.isclose(
                q_star**2,
                alpha * conductor / (8 * math.pi),
                rel_tol=2e-15,
            ))
        for token in (
            "d\\asymp\\sqrt{A\\gamma}",
            "d\\asymp\\sqrt{A/\\gamma}",
            "counts possible fold rows",
            "Airy-style",
        ):
            self.assertIn(token, self.text)

    def test_discriminant_schur_sum_has_square_root_conductor_scale(self) -> None:
        for conductor, energy in ((10_000, 20.0), (100_000, 80.0)):
            total = 0.0
            for distance in range(1, conductor + 1):
                lower_delta = (
                    energy * distance**2 / conductor
                    + distance**4 / conductor**2
                )
                total += lower_delta ** (-0.25)
            self.assertLess(total, 8 * math.sqrt(conductor) * math.log(conductor))

    def test_same_sign_endpoint_weight_is_schur_summable(self) -> None:
        for conductor, gamma in ((10_000, 20.0), (100_000, 100.0)):
            total = math.fsum(
                (offset * (offset + gamma)) ** (-0.25)
                for offset in (index + 0.75 for index in range(conductor))
            )
            self.assertLess(total, 3 * math.sqrt(conductor))
        self.assertIn("\\omega_\\alpha(P)+h\\omega_\\beta(Q)\\geq1+h", self.text)

    def test_frame_arithmetic_and_forced_scale(self) -> None:
        for conductor, ell_value, exponent in (
            (1e8, math.log(1e8), 0.6),
            (1e12, math.log(1e12), 0.75),
        ):
            gram = conductor ** (-0.5)
            sampler_square = gram * conductor
            discrepancy_square = gram * conductor * ell_value
            cross = math.sqrt(sampler_square * discrepancy_square)
            self.assertAlmostEqual(sampler_square, math.sqrt(conductor))
            self.assertAlmostEqual(
                discrepancy_square, math.sqrt(conductor) * ell_value
            )
            # The power comparison is the invariant point; fixed polylogs
            # are asymptotically absorbed for every exponent > 1/2.
            self.assertLess(conductor ** 0.5, conductor**exponent)
            self.assertAlmostEqual(cross, math.sqrt(conductor * ell_value))

    def test_hermitian_coefficients_and_resonance_are_locked(self) -> None:
        for token in (
            "{1\\over2}S_{\\rm tr}^*S_{\\rm tr}",
            "{1\\over4}\\{S_{\\rm tr}^*R_{\\rm tr}",
            "Q_{{\\rm res},1,{\\rm tr}}",
            "={1\\over2}\\sum_{n\\in\\mathcal W}\\Lambda(n)T_n^*T_n",
            "\\|Q_{{\\rm res},1,{\\rm tr}}\\|=O_m(1)",
            "Subtracting the positive resonant diagonal",
        ):
            self.assertIn(token, self.text)

    def test_scope_is_fail_closed(self) -> None:
        for token in (
            "only `l=1` and `A<n<2A`",
            "`l\\geq2`",
            "no complete hard-tail theorem",
            "no determinant conclusion",
            "no RH statement",
            "project state remains `P0_INVALIDATED`",
            "does not silently promote",
        ):
            self.assertIn(token, self.text)

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
