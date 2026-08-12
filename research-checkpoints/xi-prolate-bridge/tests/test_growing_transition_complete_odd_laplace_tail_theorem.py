#!/usr/bin/env python3
"""Regressions for the complete odd-Laplace tail theorem."""

from __future__ import annotations

import hashlib
import math
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes/GROWING_TRANSITION_COMPLETE_ODD_LAPLACE_TAIL_THEOREM.md"

FROZEN = {
    "notes/GROWING_TRANSITION_EULER_RESOLVENT_CURVED_HARD_ALIAS_COMPLETION_THEOREM.md":
        "429488fd14d246a6bcbe0495e4a6290569535536e118ff05ac9ad581845ac0dd",
    "tests/test_growing_transition_euler_resolvent_curved_hard_alias_completion_theorem.py":
        "6f8b65303cd8611c0d0f54ad8996808d541de91ca03150531e57488758aeeb16",
    "notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md":
        "6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c",
    "tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py":
        "626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34",
    "notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md":
        "326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1",
    "tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py":
        "de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7",
    "notes/GROWING_TRANSITION_ODD_LAPLACE_MIDDLE_BAND_ALIAS_FRAME_OBSTRUCTION_THEOREM.md":
        "6863fd558c13b52255a5bca67c2bb91aae4cd75b82180835a37e178546f70956",
    "tests/test_growing_transition_odd_laplace_middle_band_alias_frame_obstruction_theorem.py":
        "7c0c1a4abaa5768291ca6e7bfc9ca01915e6e8f78ada3f4071ac490a83c59a5a",
    "notes/GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md":
        "0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b",
    "tests/test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem.py":
        "97215866f7cf3a6969a7ec92d81e722a6e376034e95d58ff1e759b3780fcc79f",
    "notes/TRANSITION_PROLATE_OUTER_THEOREM.md":
        "215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6",
    "tests/test_transition_prolate_outer.py":
        "bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433",
    "notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md":
        "7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74",
    "tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py":
        "d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140",
    "notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md":
        "aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723",
    "tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py":
        "1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class CompleteOddLaplaceTailTheoremTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_frozen_dependencies(self) -> None:
        for rel, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / rel), expected, rel)

    def test_exact_scope_and_fail_closed_exclusions(self) -> None:
        for token in (
            "Z_L={cK_0\\log L\\over L}",
            "K_0>8m/C",
            "E\\subseteq\\ker\\widehat{\\mathcal A}^{1,\\rm mod}_0",
            "\\|P_E\\widehat Q_{\\rm odd}^{>I_L}P_E\\|",
            "=o(T_L)",
            "\\preceq-{c'_m\\over4}T_LP_E",
            "ordered prime form",
            "equation (5.2)",
            "P0_INVALIDATED",
        ):
            self.assertIn(token, self.text)

    def test_local_tail_is_subtracted_not_jet_estimated(self) -> None:
        for token in (
            "Q_{\\rm cont,11}=Q_{\\rm flat}",
            "Q_{\\rm mid,11}=Q_{\\rm flat}",
            "=Q_{\\rm cont,11}-Q_{\\rm mid,11}",
            "+\\mathsf S(\\mathcal A^{1,\\rm mod}_0",
            "The modal pole cross is not small termwise",
            "P_E\\mathsf S(\\widehat{\\mathcal A}^{1,\\rm mod}_0",
            "No estimate of the modal local pole row is used",
            "This exact finite-row",
            "reason no nonuniform high-row jet expansion is needed",
        ):
            self.assertIn(token, self.text)

    def test_mesoscopic_row_inventory_and_sums(self) -> None:
        for token in (
            "3<=z<=c",
            "e^{h\\alpha_{\\max}}2^{-z}",
            "\\sum_{Z_L<z\\leq c}{1\\over z}=O(\\log L)",
            "c^{-1/2+hA_1+o(1)}",
            "c^(-1/2+o(1))",
        ):
            self.assertIn(token, self.text)

    def test_short_time_outer_extension_is_explicit(self) -> None:
        for token in (
            "s_0=\\log(4/3)",
            "u>=3lambda/4",
            "Isolate `r=2`",
            "2u>=3lambda/2",
            "r>=3",
            "ru>=9lambda/4>2lambda",
            "M(u)=max(3,ceil(mathcal K/u))",
            "mathcal K/(u^2M)=O(1/u)",
            "\\left|\\sum_{r\\geq2}H_\\gamma(ru)\\right|",
            "\\leq {L^K|e_\\gamma|\\over\\lambda}",
            "{L^K\\over\\sqrt{\\lambda J_\\gamma}}",
        ):
            self.assertIn(token, self.text)

    def test_high_rows_have_summable_z_inverse_bounds(self) -> None:
        for token in (
            "|\\widehat{\\mathcal A}^{+,\\rm high}_{z}|",
            "\\leq {L^K\\over\\sqrt L\\,z}",
            "c^Ke^{h\\alpha_{\\max}}(3/4)^z",
            "\\leq {L^K\\over z}",
            "|\\widehat{\\mathcal B}^{+,\\rm low}_z|",
            "\\leq {L^K\\sqrt L\\over z}",
            "sum_(z>c, z odd) z^(-2)=O(c^(-1))",
            "{L^K\\sqrt L\\over c}",
        ):
            self.assertIn(token, self.text)

    def test_fixed_row_corollary_and_dimension_cost(self) -> None:
        for token in (
            "\\mathcal A_0=\\lambda\\mathcal A_1=0",
            "the zero-integral source row, `Gamma_in`, `rho_out`, `eta`",
            "uncorrected modal local `mathcal A_0^1` row",
            "give `r=6`, so one takes `m>6`",
            "also gives `Gamma_out=0`; it is not a\nseventh row",
            "\\geq m-r",
            "`r<m`",
        ):
            self.assertIn(token, self.text)

    def test_corrected_bump_is_in_full_local_subtraction(self) -> None:
        for token in (
            "H_{\\rm bump}(y)={a_0\\over2\\lambda}",
            "\\widehat{\\mathcal A}^{1,\\rm bump}_z",
            "\\widehat{\\mathcal B}^{1,\\rm bump}_z",
            "\\Delta_z^{\\rm bump}",
            "no `z=0` bump estimate is needed",
            "Neither step estimates or cancels a bump `z=0` row",
            "corrected physical local",
        ):
            self.assertIn(token, self.text)

    def test_false_local_pole_bound_is_absent(self) -> None:
        self.assertNotIn(
            "|\\widehat{\\mathcal A}^{1,\\rm high}_0|",
            self.text,
        )
        self.assertNotIn("restoration of the already small pole row", self.text)

    def test_jet_obstruction_is_preserved(self) -> None:
        for token in (
            "J_L(f)=-{1\\over2\\sqrt\\lambda}",
            "a_f'(0)=-{\\lambda^{3/2}\\over2}\\kappa(f)-J_L(f)",
            "No frozen theorem gives a growing-`lambda`, white uniform bound",
            "does not claim a new bound for `J_L`",
        ):
            self.assertIn(token, self.text)

    def test_schedule_margins_numerically(self) -> None:
        h = math.pi / 4.0
        eps = 0.1
        a1 = 0.05
        cgap = 0.2
        self.assertLess(h * cgap + (5 * h + 1.5 * eps) * a1, 1.0)
        self.assertLess(h * a1, 0.2)
        self.assertLess(h * a1 - 0.5, 0.0)

    def test_no_unresolved_placeholders_or_external_citations(self) -> None:
        lowered = self.text.lower()
        for bad in ("todo", "tbd", "placeholder", "arxiv", "http://", "https://"):
            self.assertNotIn(bad, lowered)
        self.assertIsNone(re.search(r"\\bcitation needed\\b", lowered))

    def test_display_balance_unique_tags_ascii_and_no_control_bytes(self) -> None:
        starts = re.findall(r"(?m)^\s*\\\[\s*$", self.text)
        ends = re.findall(r"(?m)^\s*\\\]\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10) or 32 <= byte <= 126 for byte in data))

    def test_displays_compile_as_tex(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.DOTALL)
        self.assertGreaterEqual(len(displays), 20)
        source = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            tex = Path(tmp) / "displays.tex"
            tex.write_text(source, encoding="utf-8")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex.name],
                cwd=tmp,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout[-5000:])


if __name__ == "__main__":
    unittest.main()
