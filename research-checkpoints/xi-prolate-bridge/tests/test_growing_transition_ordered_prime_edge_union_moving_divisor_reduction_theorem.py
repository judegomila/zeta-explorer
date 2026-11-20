#!/usr/bin/env python3
"""Regressions for the ordered-prime edge-union moving-divisor reduction."""

from __future__ import annotations

import hashlib
import math
import pathlib
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_ORDERED_PRIME_EDGE_UNION_MOVING_DIVISOR_REDUCTION_THEOREM.md"


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class EdgeUnionMovingDivisorReductionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_frozen_dependencies(self) -> None:
        expected = {
            "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md": "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
            "tests/test_growing_transition_direct_source_upper_form_theorem.py": "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
            "notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md": "787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79",
            "tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py": "73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7",
            "notes/GROWING_TRANSITION_ORDERED_PRIME_ALL_OUTWARD_HARD_TAIL_DIVISOR_REGROUPING_THEOREM.md": "0f3de001b13125dcb6efe5cd0d9afa5c7a897f47fc732f06aac9f63fa457f50f",
            "tests/test_growing_transition_ordered_prime_all_outward_hard_tail_divisor_regrouping_theorem.py": "958c115bae61ff9a20871bcd4c46f74a4ebae1a63260c98e0a7c40210bda33b3",
            "notes/GROWING_TRANSITION_ORDERED_PRIME_HARD_TAIL_PNT_GRAM_REDUCTION.md": "b8439dcfa6f969fd84dae8fafb5474c3e176ba14d84c7d73140fabeac042a4be",
            "tests/test_growing_transition_ordered_prime_hard_tail_pnt_gram_reduction.py": "1101aebef550259387eb6220cf8b2740d728c2f52ddf6349b253d6a555248cb6",
        }
        for relative, digest in expected.items():
            self.assertEqual(sha256(ROOT / relative), digest, relative)

    def test_exact_finite_edge_subtraction_and_hermitian_factors(self) -> None:
        self.assertIn("Q^\\uparrow_{{\\rm edge},M,R}", self.text)
        self.assertIn("{1\\over2}C_M^*P_{M,R}-{1\\over2}S_{>,M}^*P_{A,M,R}", self.text)
        self.assertIn("{1\\over4}\\mathsf S(C_M,P_{M,R})", self.text)
        self.assertIn("-{1\\over4}\\mathsf S(S_{>,M},P_{A,M,R})", self.text)
        self.assertIn("There is no double count", self.text)

    def test_edge_off_partition_subtracts_local_and_edge_resonance(self) -> None:
        self.assertIn("Q_{{\\rm off},{\\rm edge}}", self.text)
        self.assertIn("=Q_{\\rm mov}-Q_{>>}^{\\rm raw}-Q_{p,11}-Q_{{\\rm res},\\leq A}", self.text)
        self.assertIn("if\n`n>A`, then `m=ln>A`", self.text.replace("\r", ""))

    def test_forced_matching_and_lower_bounds(self) -> None:
        self.assertIn("Q_{{\\rm off},{\\rm edge}}+Q_{\\rm cont}", self.text)
        self.assertIn("Q_{\\rm mov}+Q_{\\rm cont}", self.text)
        self.assertGreaterEqual(self.text.count("{c'_m\\over8}T_LP_E"), 2)
        self.assertIn("\\sigma:=hC", self.text)
        self.assertIn("{1\\over2}<\\sigma<1", self.text)
        self.assertIn("T_L={A^{hC}\\over L^{2m}}={A^\\sigma\\over L^{2m}}", self.text)

    def test_cutoff_divisor_coefficient_retains_outward_weight(self) -> None:
        self.assertIn("b_{M,R}(q;u)", self.text)
        self.assertIn("\\Lambda(n)\\omega_M(q/n)", self.text)
        self.assertIn("There is no spurious factor `omega_M(q)`", self.text)
        self.assertIn("\\sum_{d\\mid q}\\Lambda(d)=\\log q", self.text)

    def test_limit_divisor_layer_and_pure_exterior_property(self) -> None:
        self.assertIn("b(q;u)=\\sum_", self.text)
        self.assertIn("b(q;u)=\\log q-", self.text)
        self.assertIn("\\boxed{qu\\geq\\lambda", self.text)
        for lam in (2.5, 4.5, 8.5):
            for u in (1 / lam, 0.8, lam):
                threshold = lam / u
                for q in range(1, 80):
                    divisors = [n for n in range(2, q + 1) if q % n == 0 and n >= threshold]
                    if divisors:
                        self.assertGreaterEqual(q * u + 1e-12, lam)

    def test_poisson_self_reciprocity_and_triangular_row(self) -> None:
        self.assertIn("C_x(u)={1\\over u}C_x(1/u)", self.text)
        self.assertIn("(\\mathcal V_\\lambda f)(v)", self.text)
        self.assertIn("{\\Lambda(n)\\over n}", self.text)
        self.assertIn("\\sum_{r\\geq1}f(rv/n)", self.text)
        self.assertIn("du=-dv/v^2", self.text)

    def test_no_illegal_positive_diagonal_or_square(self) -> None:
        self.assertIn("selecting `r=mn`", self.text)
        self.assertIn("divergent scalar", self.text)
        self.assertIn("Cancellation with the other `r` terms", self.text)
        self.assertIn("(C+P)^*(C+P)-(C-P)^*(C-P)", self.text)
        self.assertIn("It has no intrinsic sign", self.text)

    def test_genuine_positive_feature_but_no_separate_map_frame(self) -> None:
        self.assertIn("\\mathcal G_{{\\rm mov},+}:={C+P\\over\\sqrt8}", self.text)
        self.assertIn("s_{\\min}(\\mathcal G_{{\\rm mov},+}|_E)", self.text)
        self.assertIn("\\sqrt{{c'_mT_L\\over8}}", self.text)
        self.assertIn("not the\nmoving-threshold map `P`", self.text.replace("\r", ""))

    def test_disjoint_low_prime_geometry(self) -> None:
        self.assertIn("A_{<n,M}^*B_M+H_{\\geq n,M}^*B_M", self.text)
        self.assertIn("The first summand is the compact-tail geometry", self.text)
        self.assertIn("The second is tail-tail", self.text)
        self.assertIn("Every resonance `r=ln`", self.text)

    def test_low_prime_poisson_convolution_coefficients(self) -> None:
        self.assertIn("{1\\over v^2}", self.text)
        self.assertIn("\\sum_{2\\leq n\\leq A}{\\Lambda(n)\\over n}", self.text)
        self.assertIn("\\int_{1/\\lambda}^{n/\\lambda}", self.text)
        self.assertIn("\\overline{C_x(t)}F_y(t/n)", self.text)

    def test_claim_boundary_is_fail_closed(self) -> None:
        required = (
            "does not provide a finite-Fejer coefficientwise estimate",
            "plausible separate corollary",
            "it is not used here",
            "two-sided edge FIO/frame estimate",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, self.text)

    def test_no_forbidden_claims_or_runtime_artifacts(self) -> None:
        self.assertNotRegex(self.text, re.compile(r"\\bproves RH\\b", re.IGNORECASE))
        self.assertNotIn("__pycache__", self.text)
        self.assertNotIn(".pyc", self.text)

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 35)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = pathlib.Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_ascii_balanced_displays_unique_tags_and_no_placeholder(self) -> None:
        starts = re.findall(r"(?m)^\\s*\\\[\\s*$", self.text)
        ends = re.findall(r"(?m)^\\s*\\\]\\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\\{([^}]+)\\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("AWAITING_FINAL_FREEZE", self.text)
        self.assertNotIn("TO_BE_FROZEN", self.text)


if __name__ == "__main__":
    unittest.main()
