#!/usr/bin/env python3
"""Regressions for the moving-divisor density--discrepancy theorem."""

from __future__ import annotations

import cmath
import hashlib
import pathlib
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_TRANSITION_ORDERED_PRIME_MOVING_DIVISOR_DENSITY_DISCREPANCY_VOLTERRA_THEOREM.md"


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class MovingDivisorDensityDiscrepancyVolterraTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="utf-8")

    def test_frozen_dependencies(self) -> None:
        expected = {
            "notes/GROWING_TRANSITION_ORDERED_PRIME_EDGE_UNION_MOVING_DIVISOR_REDUCTION_THEOREM.md": "47dd1decdb3a099cdb15ad929426d293f3f34ccb799b177ae02308c2051fa68c",
            "tests/test_growing_transition_ordered_prime_edge_union_moving_divisor_reduction_theorem.py": "6b37ecbf1534d0d140294bb995d0be1ad1da39a185ae4e5ae32bf7aee49fcdb6",
            "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md": "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
            "tests/test_growing_transition_direct_source_upper_form_theorem.py": "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
            "notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md": "7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74",
            "tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py": "d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140",
            "notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md": "aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723",
            "tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py": "1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74",
        }
        for relative, digest in expected.items():
            self.assertEqual(sha256(ROOT / relative), digest, relative)

    def test_direct_profile_factor_and_hermitian_normalization(self) -> None:
        self.assertIn("Q_p^\\uparrow=2\\mathfrak a^*\\mathcal V_\\mu\\mathfrak b", self.text)
        self.assertIn("Q_{\\rm mov}=\\mathsf S(\\mathfrak a,", self.text)
        self.assertIn("Hermitian averaging of the coefficient `2`", self.text)
        self.assertIn("no unnormalized adjoint is added", self.text)

    def test_density_is_constant_b0_row_and_cancels_pole(self) -> None:
        self.assertIn("\\mathcal V_{dr}\\mathfrak b=\\mathbf1_{[0,L]}\\mathcal B_0", self.text)
        self.assertIn("\\mathsf S(\\mathcal A_0,\\mathcal B_0)", self.text)
        self.assertIn("Q_{\\rm cont}=-\\mathsf S(\\mathcal A_0,\\mathcal B_0)", self.text)
        self.assertIn("cancels the continuous pole", self.text)

    def test_e_row_null_and_feature_angle_scale(self) -> None:
        self.assertIn("\\sigma:=hC", self.text)
        self.assertIn("{1\\over2}<\\sigma<1", self.text)
        self.assertIn("T_L={A^{hC}\\over L^{2m}}={A^\\sigma\\over L^{2m}}", self.text)
        self.assertIn("\\mathcal A_0=\\lambda\\mathcal A_1=0", self.text)
        self.assertIn("\\mathcal V_{\\mu_D}\\mathfrak b", self.text)
        self.assertIn("{c'_m\\over8}T_LP_E", self.text)
        self.assertIn("{c'_m\\over16}T_L\\|x\\|_D^2", self.text)

    def test_exact_edge_coordinate_removal(self) -> None:
        self.assertIn("Q_{{\\rm off},{\\rm edge}}", self.text)
        self.assertIn("Q_{>>}^{\\rm raw}", self.text)
        self.assertIn("Q_{p,11}", self.text)
        self.assertIn("Q_{{\\rm res},\\leq A}", self.text)
        self.assertIn("O_m(L^2)=o(T_L)", self.text)

    def test_finite_tail_mellin_formula_tokens(self) -> None:
        self.assertIn("-\\frac{\\zeta'(1+z)}{\\zeta(1+z)}-{1\\over z}", self.text)
        self.assertIn("T_{D,L}(z)", self.text)
        self.assertIn("T_{D,L}(p)-e^{-(p-q)L}T_{D,L}(q)", self.text)
        self.assertIn("{1-e^{-pL}\\over pq}", self.text)
        self.assertIn("Dropping `T_(D,L)`", self.text)

    def test_finite_measure_tail_identity_numerically(self) -> None:
        # Finite atomic analogue of (5.2), with the full Lebesgue subtraction.
        atoms = [(0.7, 0.4), (1.2, 0.9), (2.3, 0.25), (3.1, 0.6)]
        length = 2.0
        p = 0.8 + 0.21j
        q = 1.1 - 0.17j

        direct_atomic = 0j
        for r, weight in atoms:
            cutoff = min(length, r)
            direct_atomic += weight * cmath.exp(-q * r) * (
                1 - cmath.exp(-(p - q) * cutoff)
            ) / (p - q)
        direct_lebesgue = (1 - cmath.exp(-p * length)) / (p * q)
        direct = direct_atomic - direct_lebesgue

        def transform(z: complex) -> complex:
            return sum(w * cmath.exp(-z * r) for r, w in atoms) - 1 / z

        def tail(z: complex) -> complex:
            return (
                sum(w * cmath.exp(-z * r) for r, w in atoms if r >= length)
                - cmath.exp(-z * length) / z
            )

        formula = (
            transform(q)
            - transform(p)
            + tail(p)
            - cmath.exp(-(p - q) * length) * tail(q)
        ) / (p - q)
        self.assertAlmostEqual(direct.real, formula.real, places=12)
        self.assertAlmostEqual(direct.imag, formula.imag, places=12)

    def test_threshold_trace_and_short_interval_are_retained(self) -> None:
        self.assertIn("(\\mathcal V_{\\leq A}b)(L-y)", self.text)
        self.assertIn("Ae^{-y}\\leq n\\leq A", self.text)
        self.assertIn("\\mathfrak b_x(0)=\\Gamma_{\\rm out}(x)=0", self.text)
        self.assertIn("does not make any summand in the interior", self.text)

    def test_no_square_pick_or_pnt_overclaim(self) -> None:
        self.assertIn("J_R^2=I", self.text)
        self.assertIn("both the even and odd reflection sectors", self.text)
        self.assertIn("not a global Pick condition", self.text)
        self.assertIn("neither an ordinary pointwise PNT envelope", self.text)
        self.assertNotRegex(self.text, re.compile(r"\\bproves RH\\b", re.IGNORECASE))
        self.assertIn("P0_INVALIDATED", self.text)

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 30)
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

    def test_ascii_balanced_displays_unique_tags_and_no_artifacts(self) -> None:
        starts = re.findall(r"(?m)^\\s*\\\[\\s*$", self.text)
        ends = re.findall(r"(?m)^\\s*\\\]\\s*$", self.text)
        self.assertEqual(len(starts), len(ends))
        tags = re.findall(r"\\tag\\{([^}]+)\\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        data = NOTE.read_bytes()
        self.assertTrue(all(byte in (9, 10, 13) or 32 <= byte <= 126 for byte in data))
        self.assertNotIn("__pycache__", self.text)
        self.assertNotIn(".pyc", self.text)
        self.assertNotIn("PENDING_STRICT_AUDIT", self.text)


if __name__ == "__main__":
    unittest.main()
