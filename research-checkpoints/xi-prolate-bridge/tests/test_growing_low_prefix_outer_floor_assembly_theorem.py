#!/usr/bin/env python3
"""Regressions for the growing low-prefix outer floor assembly."""

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
NOTE = ROOT / "notes" / "GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md"
NOTE_HASH = "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0"

FROZEN = {
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
    "notes/GROWING_LOW_PREFIX_OUTER_NON_EQUALITY_REMAINDER_THEOREM.md":
        "a5378945cc1324db820b5f01c65184dd5b1777792e6145d199e6016615f34c9d",
    "tests/test_growing_low_prefix_outer_non_equality_remainder_theorem.py":
        "3760f2836ef4440c6cbbab767dd91357adfeaf5a7ad19c13e55104f1b143f07e",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def von_mangoldt(n: int) -> float:
    for base in range(2, n + 1):
        prime = all(base % divisor for divisor in range(2, int(math.sqrt(base)) + 1))
        if not prime:
            continue
        power = base
        while power < n:
            power *= base
        if power == n:
            return math.log(base)
    return 0.0


class GrowingLowPrefixOuterFloorAssemblyTests(unittest.TestCase):
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

    def test_limiting_m1_toeplitz_summand_is_quarter_identity(self) -> None:
        gamma_zero = (math.pi / 2) / (2 * math.pi)
        self.assertAlmostEqual(gamma_zero, 0.25, places=15)
        for r in range(1, 12):
            gamma_r = math.sin(2 * math.pi * r) / (8 * math.pi * r)
            self.assertAlmostEqual(gamma_r, 0.0, places=14)

    def test_finite_fejer_floor_tends_to_quarter(self) -> None:
        previous = 0.0
        for cutoff in (1, 2, 5, 20, 100, 1000):
            weight = cutoff / (cutoff + 1)
            floor = weight**2 / 4
            self.assertGreater(floor, previous)
            self.assertLess(floor, 0.25)
            previous = floor
        self.assertGreater(previous, 0.249)

    def test_equality_has_both_fejer_slots_and_no_hard_sampler(self) -> None:
        self.assertIn("\\omega_H(ql)\\omega_H(l)", self.text)
        self.assertIn("Every equality sampler is \\(N=ql\\geq2\\)", self.text)
        self.assertIn("-J_Q^*T_{Q+1}(v_H)J_Q", self.text)
        self.assertIn("\\sum_{N\\geq2}{\\log N\\over N^2}<\\infty", self.text)
        for product in range(2, 80):
            divisor_sum = sum(
                von_mangoldt(q)
                for q in range(2, product + 1)
                if product % q == 0
            )
            self.assertAlmostEqual(divisor_sum, math.log(product), places=12)

    def test_all_error_ledgers_are_sublinear(self) -> None:
        previous = float("inf")
        for length in (40.0, 80.0, 160.0, 320.0):
            q = length
            centered = math.sqrt(q) * math.log(q + 2) ** (39 / 40)
            reflected = math.sqrt(q) * math.log(q + 2) ** 2
            equality = math.log(q + 2) ** 2
            ratio = (centered + reflected + equality) / length
            self.assertLess(ratio, previous)
            previous = ratio

        for length in (1000.0, 2000.0, 4000.0):
            q = length
            power = math.exp(20 * math.log(q) - 0.25 * length) * length
            self.assertLess(power / length, 1.0)

    def test_exact_algebra_uses_full_gram_and_no_equality_garding(self) -> None:
        required = (
            "Insert and subtract \\(\\log c\\)",
            "complete equality block",
            "complete finite-Fejer outer",
            "occur exactly once",
            "non-equality part is exactly the \\(m\\ne ql\\) form",
            "continuous reflected main and even pole are retained exact and positive",
            "{\\cal B}^{\\rm prime}_{H,Q}",
            "\\rho_{\\rm bump}(c)=o(1)",
            "No endpoint, mask, or midpoint row is appended",
            "without interchanging the \\(H\\) and \\(c\\) limits",
            "unadmitted logarithmic-WKB draft is not an input",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "invoke equality Garding",
            "midpoint correction is added",
            "finite-cutoff global radicality",
            "This proves the Riemann hypothesis",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_scope_is_fail_closed(self) -> None:
        for token in (
            "slowly growing, endpoint-",
            "physical high-complement or quotient",
            "not a",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        ):
            self.assertIn(token, self.text)

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
        self.assertGreaterEqual(len(displays), 22)
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
