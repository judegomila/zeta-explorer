#!/usr/bin/env python3
"""Regressions for the growing low-prefix outer OT-REM theorem."""

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
NOTE = ROOT / "notes" / "GROWING_LOW_PREFIX_OUTER_NON_EQUALITY_REMAINDER_THEOREM.md"
NOTE_HASH = "a5378945cc1324db820b5f01c65184dd5b1777792e6145d199e6016615f34c9d"

FROZEN = {
    "notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md":
        "e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe",
    "tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py":
        "a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md":
        "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc",
    "tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py":
        "5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b",
    "notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md":
        "1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce",
    "tests/test_growing_low_prefix_complete_profile_fio_reduction.py":
        "ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d",
    "notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md":
        "b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44",
    "tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py":
        "16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_SAME_SIDE_PRIME_REMAINDER_THEOREM.md":
        "a0a44e3d0030691ab987379b5f60366aade7430a37bc55850a5e76068d270c9f",
    "tests/test_growing_low_prefix_endpoint_compressed_same_side_prime_remainder_theorem.py":
        "dc899033544d4bbac75d4fcee0cb1ba50c40e57993f07d5a1b28e972968cae65",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_REFLECTED_STIELTJES_THEOREM.md":
        "621594962543f7700503cc545cca57b97a4969ef15b0129b0c026758398e8502",
    "tests/test_growing_low_prefix_endpoint_compressed_reflected_stieltjes_theorem.py":
        "f56565c253c2278fd3cbd0023317d5646059169e657b2225611a32a9867fa1fa",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class GrowingLowPrefixOuterNonEqualityTests(unittest.TestCase):
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

    def test_exact_same_side_allocation(self) -> None:
        self.assertIn("m\\ne ql", self.text)
        self.assertIn("both ordered", self.text)
        self.assertIn("Equality means exactly \\(m=ql\\)", self.text)
        self.assertIn("\\omega_H(m)\\omega_H(l)", self.text)
        self.assertIn("(2\\sqrt2)^{-1}U", self.text)

    def test_endpoint_ideal_is_killed_only_after_compression(self) -> None:
        epsilon = (1.0, 1.0, 1.0)
        j_vector = (1 / math.sqrt(2), -1 / math.sqrt(2), 0.0)
        self.assertAlmostEqual(
            sum(e * j for e, j in zip(epsilon, j_vector)), 0.0, places=15
        )
        u = (2.0, -0.5, 1.25)
        endpoint = tuple(
            tuple(epsilon[r] * u[s] + u[r] * epsilon[s]
                  for s in range(3))
            for r in range(3)
        )
        pure_norm = max(abs(value) for row in endpoint for value in row)
        compressed = sum(
            j_vector[r] * endpoint[r][s] * j_vector[s]
            for r in range(3) for s in range(3)
        )
        self.assertGreater(pure_norm, 1.0)
        self.assertAlmostEqual(compressed, 0.0, places=14)
        self.assertIn("shifted lower", self.text)
        self.assertIn("isolated \\(B_2\\) row", self.text)

    def test_positive_and_error_ledger(self) -> None:
        self.assertIn("P_{+,H,Q}^\\#\\succeq0", self.text)
        self.assertIn("P_{{\\rm cont},H,Q}^\\#\\succeq0", self.text)
        self.assertIn("E_{{\\rm OT},H,Q}^\\#", self.text)
        self.assertIn("state-invisible origin bump", self.text)
        self.assertIn("{\\cal B}^{\\rm prime}_{H,Q}", self.text)
        self.assertIn("\\rho_{\\rm bump}(c)=o(1)", self.text)
        self.assertIn("every origin term occurs exactly once", self.text)

    def test_frame_rates_are_sublinear(self) -> None:
        previous = float("inf")
        for length in (40.0, 80.0, 160.0, 320.0):
            q = length
            ratio = (
                math.sqrt(q) * math.log(q + 2) ** 2
                + math.log(q + 2) ** 2
            ) / length
            self.assertLess(ratio, previous)
            previous = ratio

    def test_power_absorbs_logarithms(self) -> None:
        eta = 0.1
        power = 12
        for log_c in (3000.0, 6000.0, 12000.0):
            left_log = power * math.log(log_c) - eta * log_c
            right_log = -(eta / 2) * log_c
            self.assertLess(left_log, right_log)

    def test_scope_signs_and_fail_closed_tokens(self) -> None:
        required = (
            "OT-REM",
            "centered Archimedean",
            "exact equality block are deliberately excluded",
            "does not by itself prove the full outer-only lower bound",
            "ordered limit",
            "no scalar divisor mask, midpoint",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "midpoint correction is added",
            "the B_2 row is a positive independent block",
            "This proves the full low-prefix floor",
            "This proves the Riemann hypothesis",
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
        self.assertGreaterEqual(len(displays), 15)
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
