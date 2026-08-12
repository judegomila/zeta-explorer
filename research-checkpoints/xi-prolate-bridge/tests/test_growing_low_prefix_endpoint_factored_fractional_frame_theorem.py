#!/usr/bin/env python3
"""Regressions for the endpoint-factored fractional-frame theorem."""

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
NOTE = (
    ROOT
    / "notes"
    / "GROWING_LOW_PREFIX_ENDPOINT_FACTORED_FRACTIONAL_FRAME_THEOREM.md"
)
NOTE_HASH = "6f0385a37476079991c45497e88664d49c0e13a5661026966f9d3bb22ee4f404"

FROZEN = {
    "notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md":
        "e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe",
    "tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py":
        "a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md":
        "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc",
    "tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py":
        "5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b",
    "notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md":
        "b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e",
    "tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py":
        "9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe",
    "notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md":
        "b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44",
    "tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py":
        "16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class EndpointFactoredFractionalFrameTests(unittest.TestCase):
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

    def test_endpoint_factorization_kills_only_common_row(self) -> None:
        eps = (1.0, 1.0, 1.0)
        inv2 = 1 / math.sqrt(2)
        inv6 = 1 / math.sqrt(6)
        columns = (
            (inv2, -inv2, 0.0),
            (inv6, inv6, -2 * inv6),
        )
        for column in columns:
            self.assertAlmostEqual(sum(e * x for e, x in zip(eps, column)), 0.0)
            self.assertAlmostEqual(sum(x * x for x in column), 1.0)
        self.assertAlmostEqual(
            sum(columns[0][j] * columns[1][j] for j in range(3)), 0.0
        )

        f_ref = 7.0
        values = (8.0, 4.0, 11.0)
        full = tuple(eps[j] * values[j] for j in range(3))
        common = tuple(e * f_ref for e in eps)
        residual = tuple(full[j] - common[j] for j in range(3))
        for column in columns:
            lhs = sum(full[j] * column[j] for j in range(3))
            rhs = sum(residual[j] * column[j] for j in range(3))
            self.assertAlmostEqual(lhs, rhs)

    def test_fractional_sampler_sums_converge(self) -> None:
        delta = 1 / 8
        previous = 0.0
        for cutoff in (20, 100, 500, 2000):
            total = sum(
                m ** (-2 + 2 * delta) * (1 + math.log(m))
                for m in range(2, cutoff + 1)
            )
            self.assertGreaterEqual(total, previous)
            self.assertLess(total, 6.0)
            previous = total

    def test_hard_low_frequency_phase_gap(self) -> None:
        for c in (100.0, 1.0e4, 1.0e8):
            xi = c / 2
            for z in (1.0, c / 10, c, math.sqrt(3) * c):
                shift = xi * z / (c * c + z * z)
                self.assertLessEqual(shift, 0.25 + 1e-15)
                self.assertGreater(1 / math.sqrt(2) - shift, 0.45)

    def test_interpolation_exponents(self) -> None:
        delta0 = 1 / 8
        theta = 1 / 40
        delta_star = theta * delta0
        self.assertEqual(delta_star, 1 / 320)
        self.assertEqual(20 * theta, 1 / 2)
        self.assertEqual(1 - theta, 39 / 40)

    def test_interpolated_bound_is_subconductor(self) -> None:
        ratios = []
        for log_c in (100.0, 1000.0, 10000.0):
            q = log_c
            bound = q ** 0.5 * math.log(q + 2) ** (39 / 40)
            ratios.append(bound / log_c)
        self.assertGreater(ratios[0], ratios[1])
        self.assertGreater(ratios[1], ratios[2])
        self.assertLess(ratios[-1], 0.1)

    def test_low_frequency_error_is_power_small(self) -> None:
        for log_c in (1000.0, 5000.0, 10000.0):
            log_error = 20 * math.log(log_c) - log_c / 4 + math.log(log_c)
            self.assertLess(log_error / log_c, 0.0)

    def test_scope_and_exact_tokens(self) -> None:
        required = (
            "Exact endpoint factorization",
            "complete divided difference",
            "isolated \\(B_2\\) row is neither discarded",
            "finite Fejer cutoff",
            "low-frequency leakage",
            "ordinary Cauchy--Schwarz only in",
            "Holder's inequality in Fourier space",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_fail_closed_language(self) -> None:
        forbidden = (
            "This proves the complete signed complement floor",
            "the isolated B_2 row is a lower bound",
            "This proves the Riemann hypothesis",
            "full transition span is closed",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

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
        self.assertGreaterEqual(len(displays), 25)
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
