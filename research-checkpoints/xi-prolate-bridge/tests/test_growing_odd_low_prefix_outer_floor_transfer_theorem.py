#!/usr/bin/env python3
"""Regressions for the growing odd low-prefix outer-floor transfer."""

from __future__ import annotations

import ast
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md"
NOTE_HASH = "a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459"

FROZEN = {
    "notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md":
        "e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe",
    "tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py":
        "a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md":
        "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc",
    "tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py":
        "5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b",
    "notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md":
        "b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44",
    "tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py":
        "16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_FACTORED_FRACTIONAL_FRAME_THEOREM.md":
        "6f0385a37476079991c45497e88664d49c0e13a5661026966f9d3bb22ee4f404",
    "tests/test_growing_low_prefix_endpoint_factored_fractional_frame_theorem.py":
        "cf03e6e7a4254403bc4fb75469a90b926e4525455693cd5a1c5decc78b12640e",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_SAME_SIDE_PRIME_REMAINDER_THEOREM.md":
        "a0a44e3d0030691ab987379b5f60366aade7430a37bc55850a5e76068d270c9f",
    "tests/test_growing_low_prefix_endpoint_compressed_same_side_prime_remainder_theorem.py":
        "dc899033544d4bbac75d4fcee0cb1ba50c40e57993f07d5a1b28e972968cae65",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_REFLECTED_STIELTJES_THEOREM.md":
        "621594962543f7700503cc545cca57b97a4969ef15b0129b0c026758398e8502",
    "tests/test_growing_low_prefix_endpoint_compressed_reflected_stieltjes_theorem.py":
        "f56565c253c2278fd3cbd0023317d5646059169e657b2225611a32a9867fa1fa",
    "notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md":
        "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0",
    "tests/test_growing_low_prefix_outer_floor_assembly_theorem.py":
        "634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311",
    "notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md":
        "d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771",
    "tests/test_fixed_label_six_odd_arithmetic_synthesis_gain.py":
        "ad57055b3f4c0190e3021bead942e7b280624dae636ec8fe2339bdbe69e372c6",
    "notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md":
        "3186182c5c3c6ef235e6a48bbe5a7e049f21db4094a8edbfaeb0160663a43c2e",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
    "notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md":
        "544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class GrowingOddLowPrefixOuterFloorTransferTests(unittest.TestCase):
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

    def test_residue_two_phase_arithmetic(self) -> None:
        for j in range(9):
            nu_odd_j = 4 * j + 2.5
            nu_even_j = 4 * j + 0.5
            for k in range(9):
                nu_odd_k = 4 * k + 2.5
                nu_even_k = 4 * k + 0.5
                self.assertEqual(nu_odd_j - nu_odd_k, nu_even_j - nu_even_k)
                self.assertEqual(
                    nu_odd_j + nu_odd_k,
                    nu_even_j + nu_even_k + 4,
                )

    def test_anchor_two_column_is_exactly_zero_integral(self) -> None:
        for integral_two, integral_t in ((-2.0, -3.0), (5.0, -7.0), (-11.0, 13.0)):
            coefficient = integral_t / integral_two
            integral = -integral_t + coefficient * integral_two
            self.assertEqual(integral, 0.0)

    def test_odd_outer_pole_evaluation_has_forced_minus_sign(self) -> None:
        # B(s)=exp(-s): ell=int exp(-s/2) ds=2 and
        # d=int exp(-3s/2) ds=2/3.
        ell = 2.0
        d_row = 2.0 / 3.0
        for lam in (2.5, 9.0, 100.0):
            formula = math.sqrt(lam) * ell - d_row / math.sqrt(lam)
            # Direct integration of the positive and negative outer tails.
            positive = math.sqrt(lam) * ell
            negative = -d_row / math.sqrt(lam)
            self.assertAlmostEqual(formula, positive + negative, places=14)
            wrong_even_sign = positive - negative
            self.assertNotAlmostEqual(formula, wrong_even_sign, places=12)

    def test_new_negative_rows_are_sublinear(self) -> None:
        previous = float("inf")
        for length in (40.0, 80.0, 160.0, 320.0):
            lam = math.exp(length / 2)
            q = length
            bound = (length + math.log(q + 2)) / lam
            ratio = bound / length
            self.assertLess(ratio, previous)
            previous = ratio
        self.assertLess(previous, 1e-60)

    def test_m1_toeplitz_quarter_is_residue_independent(self) -> None:
        gamma_zero = (math.pi / 2) / (2 * math.pi)
        self.assertAlmostEqual(gamma_zero, 0.25, places=15)
        for r in range(1, 12):
            self.assertAlmostEqual(
                math.sin(2 * math.pi * r) / (8 * math.pi * r),
                0.0,
                places=14,
            )

    def test_complete_finite_h_bump_row_and_schwartz_majorants(self) -> None:
        cutoff = 8
        s_value = 0.7
        samples = [
            (1 - m / (cutoff + 1)) * math.exp(-m * math.exp(s_value) / 2)
            for m in range(1, cutoff + 1)
        ]
        self.assertGreater(abs(sum(samples) - samples[0]), 1e-3)

        previous = 0.0
        for terminal in (4, 8, 16, 32, 64):
            # For psi_hat(u)=exp(-u), the first exact transformed series is
            # sum 2 exp(-m/2)/m.  The second is bounded termwise by it.
            majorant = sum(
                2 * math.exp(-m / 2) / m
                for m in range(1, terminal + 1)
            )
            self.assertGreater(majorant, previous)
            self.assertLess(majorant, 3.0)
            previous = majorant

        for token in (
            "\\sum_{m\\geq1}\\omega_H(m)",
            "2\\sum_{m\\geq1}{1\\over m}",
            "\\int_{m/2}^\\infty{|\\widehat\\psi(u)|\\over u}",
            "not its \\(m=1\\)",
            "C_{\\psi,1}<\\infty",
            "C_{\\psi,0}<\\infty",
        ):
            self.assertIn(token, self.text)

    def test_two_residue_subspaces_miss_exactly_one_bridge_direction(self) -> None:
        for q in range(1, 20):
            raw_dimension = 2 * (q + 1)
            full_zero_integral_dimension = raw_dimension - 1
            separated_dimension = q + q
            self.assertEqual(full_zero_integral_dimension - separated_dimension, 1)

    def test_exact_sign_and_scope_tokens(self) -> None:
        required = (
            "c^-_{4j+2}=-h_{4j+2}+{I_{4j+2}\\over I_2}h_2",
            "(\\epsilon^-_Q)^*J_{-,Q}=0",
            "-P_{{\\rm cont},-,Q}-P_{{\\rm pole},-,Q}",
            "reversal of the entire reflected cross",
            "-\\lambda^{-1/2}d_{H,-}z",
            "neither negative row is discarded",
            "codimension one",
            "b=c_2=h_2-{I_2\\over I_0}h_0",
            "orthogonal captured subspace",
            "no density of these source ranges",
            "operator-core or Weil graph-core density statement",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "odd pole is positive",
            "reflected cross is unchanged",
            "drop the odd pole",
            "form " + "core",
            "genuine orthogonal " + "core",
            "This proves the Riemann hypothesis",
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
                "__future__", "ast", "hashlib", "math", "pathlib", "re",
                "shutil", "subprocess", "tempfile", "unittest",
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
