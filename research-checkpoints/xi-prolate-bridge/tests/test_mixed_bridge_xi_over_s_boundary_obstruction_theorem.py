#!/usr/bin/env python3
"""Regressions for the mixed-bridge Xi-over-s boundary obstruction."""

from __future__ import annotations

import ast
import cmath
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
    / "MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md"
)
NOTE_HASH = "4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2"

FROZEN = {
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "tests/test_growing_transition_equality_conductor_garding_theorem.py":
        "61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba",
    "notes/CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md":
        "c9b4513fb0afa57a396f3c1bf7326bb94969d4c8d51a245ea66fa64c1889061e",
    "notes/GROWING_TRANSITION_HADAMARD_PICK_CARRIER_RH_EQUIVALENCE_THEOREM.md":
        "092d0adefb7bafea8d931a2741299d19feef2a45ccc3d243c3543765fdf5cff7",
    "tests/test_growing_transition_hadamard_pick_carrier_rh_equivalence_theorem.py":
        "d15fff20bc0aa62ad63903b6c17e64b11ecba3ab965f179c82086e261c398b43",
    "notes/PROLATE_DEFECT_SOURCE_AUDIT.md":
        "b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d",
    "notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md":
        "544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class MixedBridgeXiOverSBoundaryObstructionTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_hermite_bridge_mellin_factor(self) -> None:
        for s_value in (0.3, 0.5, 1.25, 2.75, 5.5):
            gaussian = (
                0.5
                * math.pi ** (-s_value / 2.0)
                * math.gamma(s_value / 2.0)
            )
            shifted = (
                0.5
                * math.pi ** (-(s_value + 2.0) / 2.0)
                * math.gamma((s_value + 2.0) / 2.0)
            )
            direct = 2.0 ** 0.75 * (gaussian - 2.0 * math.pi * shifted)
            expected = (
                2.0 ** (-0.25)
                * (1.0 - s_value)
                * math.pi ** (-s_value / 2.0)
                * math.gamma(s_value / 2.0)
            )
            self.assertAlmostEqual(direct, expected, places=13)

            fake_zeta = 1.37
            xi_value = (
                0.5
                * s_value
                * (s_value - 1.0)
                * math.pi ** (-s_value / 2.0)
                * math.gamma(s_value / 2.0)
                * fake_zeta
            )
            if s_value != 1.0:
                self.assertAlmostEqual(
                    fake_zeta * expected,
                    -(2.0 ** 0.75) * xi_value / s_value,
                    places=13,
                )

    def test_centered_even_and_odd_carrier_algebra(self) -> None:
        constant = 2.0 ** 0.75
        for z_value in (0.1 + 0.7j, -0.2 + 1.3j, 0.33 - 2.0j):
            raw_plus = -constant / (0.5 - z_value)
            raw_minus = -constant / (0.5 + z_value)
            even = (raw_plus + raw_minus) / 2.0
            odd = (raw_plus - raw_minus) / 2.0
            self.assertAlmostEqual(
                abs(even + 2.0 ** (-0.25) / (0.25 - z_value**2)),
                0.0,
                places=13,
            )
            self.assertAlmostEqual(
                abs(odd + constant * z_value / (0.25 - z_value**2)),
                0.0,
                places=13,
            )

    def test_carriers_are_nonzero_at_open_strip_nontrivial_points(self) -> None:
        for real_part in (-0.49, -0.2, 0.0, 0.17, 0.49):
            for imaginary_part in (0.7, 14.1, 100.0):
                z_value = complex(real_part, imaginary_part)
                phi_plus = 1.0 / (0.25 - z_value**2)
                phi_minus = z_value / (0.25 - z_value**2)
                self.assertGreater(abs(phi_plus), 0.0)
                self.assertGreater(abs(phi_minus), 0.0)

    def test_zero_orbit_summands_do_not_depend_on_representative(self) -> None:
        for z_value in (0.2 + 9.0j, -0.1 + 17.0j, 0.0 + 25.0j):
            a_value = 3.7

            def phi_plus(z_arg: complex) -> complex:
                return 1.0 / (0.25 - z_arg**2)

            def phi_minus(z_arg: complex) -> complex:
                return z_arg / (0.25 - z_arg**2)

            plus = phi_plus(z_value) * cmath.sinh(a_value * z_value) / z_value
            plus_reflected = (
                phi_plus(-z_value)
                * cmath.sinh(-a_value * z_value)
                / (-z_value)
            )
            minus = phi_minus(z_value) * cmath.cosh(a_value * z_value) / z_value
            minus_reflected = (
                phi_minus(-z_value)
                * cmath.cosh(-a_value * z_value)
                / (-z_value)
            )
            self.assertAlmostEqual(abs(plus - plus_reflected), 0.0, places=13)
            self.assertAlmostEqual(abs(minus - minus_reflected), 0.0, places=13)

    def test_off_line_carrier_has_nonzero_laplace_residue(self) -> None:
        z_value = 0.125 + 20.0j
        multiplicity = 3
        phi_plus = 1.0 / (0.25 - z_value**2)
        phi_minus = z_value / (0.25 - z_value**2)
        residue_plus = -multiplicity * phi_plus / z_value
        residue_minus = -multiplicity * phi_minus / z_value
        self.assertGreater(abs(residue_plus), 0.0)
        self.assertGreater(abs(residue_minus), 0.0)

    def test_codimension_two_anchor_solve(self) -> None:
        v_zero = 1.2
        v_two = 0.8
        chi_zero = 0.999
        chi_two = 0.995
        integral_zero = chi_zero * v_zero
        integral_two = -chi_two * v_two
        determinant = integral_zero * v_two - integral_two * v_zero
        self.assertGreater(determinant, 0.0)

        for label, v_n, chi_n in (
            (4, 0.5, 0.97),
            (6, 0.4, 0.94),
            (8, 0.3, 0.90),
            (10, 0.2, 0.86),
        ):
            sign = 1.0 if label % 4 == 0 else -1.0
            integral_n = sign * chi_n * v_n
            a_n = (integral_n * v_two - integral_two * v_n) / determinant
            b_n = (integral_zero * v_n - v_zero * integral_n) / determinant
            corrected_integral = integral_n - a_n * integral_zero - b_n * integral_two
            corrected_origin = v_n - a_n * v_zero - b_n * v_two
            self.assertAlmostEqual(corrected_integral, 0.0, places=14)
            self.assertAlmostEqual(corrected_origin, 0.0, places=14)

        for q_value in range(1, 20):
            ambient = 2 * q_value + 2
            self.assertEqual(ambient - 2, 2 * q_value)
            self.assertEqual((ambient - 1) - (ambient - 2), 1)

    def test_augmented_metric_scales_are_incompatible(self) -> None:
        for lam in (3.0, 5.0, 10.0):
            log_d_two_model = 5.0 * math.log(lam) - 4.0 * math.pi * lam**2
            log_bump_scale = -math.log(lam)
            self.assertLess(log_d_two_model, log_bump_scale)
            self.assertGreater(log_bump_scale - log_d_two_model, 20.0 * math.log(10.0))

    def test_scope_and_formula_tokens(self) -> None:
        required = (
            "-2^{3/4}{\\xi(s)\\over s}",
            "\\Phi_+(z)={1\\over1/4-z^2}",
            "\\Phi_-(z)={z\\over1/4-z^2}",
            "bounded exactly if the Riemann hypothesis holds",
            "The frozen Hadamard--Pick theorem is not reproved here",
            "The present theorem proves no kernel positivity",
            "It does not identify the raw",
            "-f(0) beta_lambda",
            "Plemelj/closability",
            "\\dim(\\ker I\\cap\\ker v)=2Q",
            "removes exactly one direction",
            "\\mu_\\lambda\\gtrsim\\lambda^{-1}",
            "\\mu_\\lambda\\lesssim d_2",
            "not a proof of RH",
            "not a claim that the complete coherent bridge",
            "standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the complete bridge floor fails",
            "drop the beta row",
            "the bump cancels the Xi-over-s profile",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_balance_unique_tags_and_ascii(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

    def test_import_hygiene(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(
            imported,
            {
                "__future__", "ast", "cmath", "hashlib", "math", "pathlib",
                "re", "shutil", "subprocess", "tempfile", "unittest",
            },
        )

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
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
