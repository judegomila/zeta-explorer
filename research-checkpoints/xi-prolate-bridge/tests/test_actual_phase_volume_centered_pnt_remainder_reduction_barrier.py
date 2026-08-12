#!/usr/bin/env python3
"""Exact regressions for the centered-PNT phase-volume reduction.

All mathematical fixtures use integers or Fraction.  The verifier reads no
zero table, sampled source symbol, cached matrix, or network resource.
"""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import json
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
    / "ACTUAL_PHASE_VOLUME_CENTERED_PNT_REMAINDER_REDUCTION_BARRIER.md"
)
NOTE_HASH = "2b2a40a4ec087c77145b45fc54d8a5782a85ecd122b2d599d2c2d8a067b714f1"

FROZEN = {
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "tests/test_parity_multiplier_schur.py":
        "94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb",
    "notes/PHASE_VOLUME_SCALE_AUDIT.md":
        "bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd",
    "notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md":
        "ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f",
    "tests/test_compressed_multiplier_trace.py":
        "ff7740f0e07db3674693a92e888935578036e4a745768bf47b10aea2c6a76f9c",
    "notes/GROWING_RETAINED_NEGATIVE_INDEX_CAPTURE_BARRIER.md":
        "9fc64fedde255791775861e7a3bb2b2d55eab1a3d402cf8b842d9e0d8519424c",
    "tests/test_growing_retained_negative_index_capture_barrier.py":
        "1e6067e8e4795eac284a8efc12bfc235ff7a6590efce28428b4569320257c4aa",
    "notes/CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md":
        "2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d",
    "tests/test_cutoff_free_multi_anchor_ground_frame_barrier.py":
        "0fdc307a051d50ff4ece21ae8b01f89b745a14788f093ec4127f5da6026bde9f",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def positive_part(value: F) -> F:
    return max(F(0), value)


def integrate_linear_over_u_three_halves(
    constant: F,
    lower_sqrt: F,
    upper_sqrt: F,
) -> F:
    """Integral (constant-u)u^(-3/2)du between square endpoints."""

    def primitive(square_root: F) -> F:
        return -2 * constant / square_root - 2 * square_root

    return primitive(upper_sqrt) - primitive(lower_sqrt)


class ActualPhaseVolumeCenteredPntRemainderReductionBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_source_lock_is_duplicate_free_and_pins_fks_decimal(self) -> None:
        payload = (ROOT / "P3_SOURCE_LOCK.json").read_text(encoding="ascii")

        def reject_duplicates(pairs: list[tuple[str, object]]) -> dict[str, object]:
            result: dict[str, object] = {}
            for key, value in pairs:
                self.assertNotIn(key, result)
                result[key] = value
            return result

        parsed = json.loads(payload, object_pairs_hook=reject_duplicates)
        source_bound = parsed["locked_formulas"]["source_bound"]
        self.assertIn("9.22022", source_bound)
        self.assertIn("0.8476836", source_bound)

    def test_positive_part_split_is_exactly_one_way(self) -> None:
        values = tuple(F(value, 3) for value in range(-12, 13))
        strict_examples = 0
        for left in values:
            for right in values:
                combined = positive_part(left + right)
                separated = positive_part(left) + positive_part(right)
                self.assertLessEqual(combined, separated)
                if combined < separated:
                    strict_examples += 1
        self.assertGreater(strict_examples, 0)

    def test_centered_stieltjes_identity_on_square_endpoints(self) -> None:
        # Toy right-continuous atomic Chebyshev function: mass 3 at u=4
        # and mass 5 at u=9.  At t=0 all powers and integrals are rational.
        d_value = F(3, 2) + F(5, 3)
        main_value = F(4)
        direct_remainder = d_value - main_value

        first_piece = integrate_linear_over_u_three_halves(
            F(1), F(1), F(2)
        )
        second_piece = integrate_linear_over_u_three_halves(
            F(4), F(2), F(3)
        )
        endpoint_error = F(3 + 5 - 9 + 1)
        by_parts = endpoint_error / F(3) + F(1, 2) * (
            first_piece + second_piece
        )

        self.assertEqual(first_piece, F(-1))
        self.assertEqual(second_piece, F(-2, 3))
        self.assertEqual(direct_remainder, F(-5, 6))
        self.assertEqual(by_parts, direct_remainder)

    def test_bounded_and_logarithmic_index_scalings_are_exact(self) -> None:
        # L=2*log(lambda): the frozen lambda^2/log(lambda) target is twice
        # lambda^2/L, including its implied constant.
        self.assertEqual(F(1, 1), 2 * F(1, 2))

        # Strip the common positive factor 2*pi from the min--max estimate.
        length = F(30)
        bounded_gap = F(1, 2)
        bounded_phase = F(7) * F(121) / length
        bounded_index_without_two_pi = (
            length * bounded_phase / bounded_gap
        )
        self.assertEqual(bounded_index_without_two_pi, F(14 * 121))

        kappa = F(2, 3)
        rho = F(1, 4)
        logarithmic_gap = kappa * (1 - rho) * length
        logarithmic_phase = F(11) * F(121)
        logarithmic_index_without_two_pi = (
            length * logarithmic_phase / logarithmic_gap
        )
        self.assertEqual(logarithmic_gap, length / 2)
        self.assertEqual(
            logarithmic_index_without_two_pi,
            2 * logarithmic_phase,
        )

    def test_logarithmic_main_exponent_has_strict_margin(self) -> None:
        kappa = F(2, 3)
        alpha = F(5, 6)
        exponent = 2 * kappa / alpha
        self.assertEqual(exponent, F(8, 5))
        self.assertLess(exponent, F(2))

        # On the model subsequence lambda=2^n, the bounded-main ratio
        # (lambda*L)/(lambda^2/L) is proportional to n^2/2^n.
        ratios = tuple(F(index * index, 2**index) for index in range(8, 17))
        self.assertTrue(all(right < left for left, right in zip(ratios, ratios[1:])))
        self.assertLess(ratios[-1], F(1, 100))

    def test_fks_derivative_constant_is_strictly_positive(self) -> None:
        a_value = F(2119209, 2500000)
        c_value = F(1, 2) - a_value * a_value / 24
        self.assertGreater(c_value, F(0))

        # Complete the quadratic in z=1/sqrt(s).  Its exact minimum is c_a.
        minimizer = a_value / 6
        derivative_factor = (
            F(1, 2)
            + F(3, 2) * minimizer * minimizer
            - a_value * minimizer / 2
        )
        self.assertEqual(derivative_factor, c_value)

    def test_note_contract_and_hygiene(self) -> None:
        required = (
            r"m_\lambda(t)=2\theta'(t)-2\operatorname {Re}D_\lambda(t)",
            r"M_\lambda(t)=\int_1^x u^{-1/2+it}\,du",
            r"E_\lambda(u)=\psi_C(u)-u+1",
            r"\mathfrak R_{\lambda,\alpha}",
            r"\mathfrak R^{\rm hi}_{\lambda,\alpha}",
            r"{\lambda^2\over L}",
            r"{\lambda^2\over\log\lambda}={2\lambda^2\over L}",
            r"n_-\!\left(PH_uP\right)",
            "g=1",
            "delta=1/2",
            "No reverse inequality is asserted",
            "not proved here",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.text)

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("\r", self.text)
        self.assertNotIn("\t", self.text)
        self.assertIsNone(re.search(r"[ \t]+$", self.text, flags=re.MULTILINE))
        self.assertNotIn("TO_BE_FROZEN", self.text)

        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
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
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_verifier_has_no_binary_float_literals(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="utf-8"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])


if __name__ == "__main__":
    unittest.main()
