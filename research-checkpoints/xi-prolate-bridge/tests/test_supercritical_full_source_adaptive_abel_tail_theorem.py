#!/usr/bin/env python3
"""Regressions for the supercritical full-source adaptive Abel theorem."""

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
NOTE = ROOT / "notes" / "SUPERCRITICAL_FULL_SOURCE_ADAPTIVE_ABEL_TAIL_THEOREM.md"
NOTE_HASH = "ddd9fe4132e43bbbf859b89192380b3c299f2d9e3acec528bdefe39bb0f2eece"

FROZEN = {
    "notes/PROLATE_TAIL_ENVELOPE.md":
        "309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d",
    "tests/test_prolate_tail_envelope.py":
        "bb5b5ec58f6357a8defcf36b19d3a1674091518903c5438f56c17ae6eef0581e",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
    "tests/test_prolate_defect_source_lock.py":
        "7caa8d088522d68dc4dedfad8d00d8e5c7e15070065c743d9e2a41f9e7faa519",
    "notes/CRITICAL_DENSITY_PROLATE_MELLIN_TRANSPORT_CONNECTION_THEOREM.md":
        "4d20e37cb8b6cfe3d92da7e1344da0f1b12ca9d20185fd7b6d8ac406ef7846c6",
    "tests/test_critical_density_prolate_mellin_transport_connection_theorem.py":
        "0a6128433698ecdc83252747971c61fb0859bf12a2afe582cd78808b8c5b8cf3",
    "notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md":
        "aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6",
    "tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py":
        "6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6",
    "notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md":
        "287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0",
    "tests/test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem.py":
        "36d9ca8f522f10b3bf8fd98bffa7b0a0e26a67eaee94ebaba18ff4912b9d651a",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def action(u: float) -> float:
    sine = math.sin(u)
    return math.sqrt(sine * (1.0 + sine))


class SupercriticalFullSourceAdaptiveAbelTailTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_retuned_and_original_exponent_margins(self) -> None:
        beta_rad_09 = 0.9 * math.pi / 2 - 1
        beta_arc_safe = 1 - math.sqrt(3) / 2 + 7 * math.pi / 60
        beta_carrier = 0.361283181361350
        self.assertAlmostEqual(beta_rad_09, 0.4137166941154069, places=14)
        self.assertGreater(beta_rad_09, 0.4)
        self.assertGreater(beta_arc_safe, 0.5)
        self.assertGreater(0.4, beta_carrier)
        self.assertGreater(math.pi / 2 - 1, 0.5)
        self.assertIn("beta_(.9)=2/5", self.text)
        self.assertIn("including `1/2`", self.text)

    def test_arc_action_identity_and_safe_retuning(self) -> None:
        exact = math.sqrt(3) / 2 - math.pi / 6
        values = []
        for index in range(20001):
            u = (math.pi / 2) * index / 20000
            values.append(action(u) - u)
            self.assertLessEqual(
                action(u) - 0.9 * u,
                exact + math.pi / 20 + 2e-15,
            )
        self.assertLess(abs(max(values) - exact), 2e-9)

    def test_endpoint_recurrence_induction_has_strict_reserve(self) -> None:
        costs = (9 / 16, 1 / 16, 1 / 512)
        self.assertLess(sum(costs), 1)
        for token in ("{9\\over16}", "{1\\over16}", "{1\\over512}"):
            self.assertIn(token, self.text)
        self.assertIn("R=\\lfloor c/4\\rfloor", self.text)

    def test_l2_remainder_uses_distinct_spectral_quantities(self) -> None:
        required = (
            "The Sturm eigenvalue `Theta_j(c)` is not the finite-Fourier amplitude.",
            "Let `rho_j` denote the positive finite-Fourier amplitude",
            "rho_j^{-1}\\leq\\sqrt2",
            "controlled in `L2`, not by an unstated pointwise",
            "{C c^R\\over\\sqrt{2R}}",
            "c^{5/2-R}",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

    def test_aligned_display_tags_compile_outside_environment(self) -> None:
        displays = []
        display_blocks = re.findall(
            r"\\\[\s*(.*?)\s*\\\]",
            self.text,
            flags=re.DOTALL,
        )
        for tag in ("5.8", "6.2"):
            candidates = [
                block for block in display_blocks
                if rf"\tag{{{tag}}}" in block
            ]
            self.assertEqual(len(candidates), 1, tag)
            display = candidates[0]
            self.assertTrue(display.startswith(r"\begin{aligned}"), tag)
            self.assertRegex(
                display,
                rf"\\end\{{aligned\}}\s*\\tag\{{{re.escape(tag)}\}}$",
            )
            aligned_body = display.split(r"\end{aligned}", 1)[0]
            self.assertNotIn(r"\tag{", aligned_body, tag)
            displays.append(display)

        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex is unavailable; static display check passed")
        source = (
            r"\documentclass{article}"
            "\n"
            r"\usepackage{amsmath}"
            "\n"
            r"\begin{document}"
            "\n"
            + "\n".join(r"\[" + item + r"\]" for item in displays)
            + "\n"
            + r"\end{document}"
            + "\n"
        )
        with tempfile.TemporaryDirectory() as temp_dir:
            tex_path = Path(temp_dir) / "aligned-displays.tex"
            tex_path.write_text(source, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout[-4000:] + result.stderr)

    def test_arbitrary_real_lambda_image_pair_split(self) -> None:
        required = (
            "No integer,\nhalf-integer, rational, or Diophantine condition",
            "symmetric trace representative",
            "arbitrarily near resonances",
            "A_n=C\\lambda^{-n+1/2}",
            "B_n=C\\lambda^{n+1/2}",
            "Stieltjes integration by parts",
            "Dirichlet\nLebesgue bound",
            "This is the required arbitrary-real-`lambda` leading-channel lemma.",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

        for lam in (1.5, 2.3, math.e, 10.0):
            for k_value in (100, 10_000, 1_000_000):
                n0 = math.floor(math.log(k_value) / (2 * math.log(lam)))
                self.assertLessEqual(lam**n0, math.sqrt(k_value) * (1 + 1e-12))
                self.assertLessEqual(
                    lam ** (-(n0 + 1)),
                    1 / math.sqrt(k_value) * (1 + 1e-12),
                )

    def test_euler_periodization_and_full_recombination_are_exact(self) -> None:
        required = (
            "b(t)=-\\int_0^\\infty(1+\\{e^y\\})e^{-y/2}\\cos(ty)\\,dy",
            "\\widehat Q(k)={1\\over L}\\widehat q_e(t_k)",
            "=-{b(t_k)\\over L}",
            "lambda^{-it_k}=(-1)^k",
            "Equation (8.1) is\nexactly (2.9)",
            "no endpoint channel has been removed or counted twice",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

    def test_two_range_tail_and_value_only_row_are_declared(self) -> None:
        required = (
            "{9c\\over10}\\leq t\\leq c^2",
            "\\sup_{K\\geq K_2}|S_K|\\leq P(c,L)e^{-c}",
            "\\sup_{K\\geq K_{.9}}|S_K|",
            "\\sup_{K\\geq K_c}|S_K|",
            "No derivative of\nan Abel tail is formed anywhere.",
            "with no derivative of `S_K`",
            "For every `gamma>=0`",
            "\\leq 6a",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)
        self.assertLessEqual(
            self.text.count("is used only through values and Abel/Stieltjes summation."),
            1,
        )

    def test_claim_boundary_and_old_invalid_pair_removed(self) -> None:
        required = (
            "does not claim exponent one",
            "does not assert the rest\nof the critical arithmetic-to-actual transfer",
            "P0_INVALIDATED",
            "no\nunproved comparison between a compact endpoint term and an exterior tail",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)
        self.assertFalse(
            (ROOT / "notes" / "SUPERCRITICAL_COMPACT_ABEL_CONTOUR_REDUCTION.md").exists()
        )
        self.assertFalse(
            (ROOT / "tests" / "test_supercritical_compact_abel_contour_reduction.py").exists()
        )


if __name__ == "__main__":
    unittest.main()
