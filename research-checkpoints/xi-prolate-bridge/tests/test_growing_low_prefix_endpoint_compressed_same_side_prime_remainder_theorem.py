#!/usr/bin/env python3
"""Regressions for the endpoint-compressed same-side prime theorem."""

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
    / "GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_SAME_SIDE_PRIME_REMAINDER_THEOREM.md"
)
NOTE_HASH = "a0a44e3d0030691ab987379b5f60366aade7430a37bc55850a5e76068d270c9f"

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
    "notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md":
        "1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce",
    "tests/test_growing_low_prefix_complete_profile_fio_reduction.py":
        "ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fejer(cutoff: int, sampler: int) -> float:
    return max(0.0, 1.0 - sampler / (cutoff + 1))


def von_mangoldt(n: int) -> float:
    for p in range(2, n + 1):
        is_prime = all(p % divisor for divisor in range(2, int(math.sqrt(p)) + 1))
        if not is_prime:
            continue
        value = p
        while value < n:
            value *= p
        if value == n:
            return math.log(p)
    return 0.0


def equality_density(cutoff: int, beta: float) -> float:
    maximum = int(math.floor(1 / math.sin(beta) + 1e-12))
    total = 0.0
    for q in range(2, maximum + 1):
        weight = von_mangoldt(q)
        if weight == 0.0:
            continue
        for ell in range(1, maximum // q + 1):
            total += (
                weight
                * fejer(cutoff, q * ell)
                * fejer(cutoff, ell)
                / (q * ell)
            )
    return total / math.pi


class EndpointCompressedSameSidePrimeTests(unittest.TestCase):
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

    def test_physical_isometric_factor_and_two_orientations(self) -> None:
        phi_scale_squared = (1 / (2 * math.sqrt(2))) ** 2
        self.assertAlmostEqual(phi_scale_squared, 1 / 8, places=15)
        self.assertAlmostEqual(-4 * phi_scale_squared, -1 / 2, places=15)

        for q, ell in ((2, 1), (3, 4), (17, 9)):
            ordered = 1 / (4 * math.pi * ell * math.sqrt(q))
            one_prime_orientation = -2 / math.sqrt(q)
            combined = 2 * one_prime_orientation * ordered
            self.assertAlmostEqual(combined, -1 / (math.pi * q * ell), places=15)

    def test_exact_equality_density_has_two_cutoff_slots(self) -> None:
        for q, ell in ((2, 1), (3, 4), (17, 9)):
            cutoff = q * ell + 13
            slots = fejer(cutoff, q * ell) * fejer(cutoff, ell)
            wrong_square = fejer(cutoff, q * ell) ** 2
            self.assertGreater(slots, 0.0)
            if ell != q * ell:
                self.assertNotAlmostEqual(slots, wrong_square, places=14)

        for cutoff in (5, 20, 100):
            for beta in (0.03, 0.08, 0.2, 0.5):
                value = equality_density(cutoff, beta)
                majorant = 3.0 * math.log(math.e / beta) ** 2
                self.assertGreaterEqual(value, 0.0)
                self.assertLess(value, majorant)

    def test_divisor_regrouping_and_fejer_bound(self) -> None:
        for product in range(2, 100):
            exact = sum(
                von_mangoldt(divisor)
                for divisor in range(2, product + 1)
                if product % divisor == 0
            )
            self.assertAlmostEqual(exact, math.log(product), places=12)
            for cutoff in (3, 20, 150):
                weighted = sum(
                    von_mangoldt(divisor)
                    * fejer(cutoff, product // divisor)
                    for divisor in range(2, product + 1)
                    if product % divisor == 0
                )
                self.assertLessEqual(weighted, math.log(product) + 1e-12)

    def test_regular_lattice_sum_is_absolutely_summable(self) -> None:
        previous = 0.0
        for cutoff in (20, 50, 100, 200, 400):
            total = 0.0
            for product in range(2, cutoff + 1):
                inner = sum(
                    1 / (sampler * (1 + abs(sampler - product)))
                    for sampler in range(2, cutoff + 1)
                    if sampler != product
                )
                total += math.log(product) * inner / product
            self.assertGreaterEqual(total, previous)
            self.assertLess(total, 9.0)
            previous = total

            for product in (2, 7, 31, min(199, cutoff)):
                if product > cutoff:
                    continue
                inner = sum(
                    1 / (sampler * (1 + abs(sampler - product)))
                    for sampler in range(2, 20 * product + 1)
                    if sampler != product
                )
                self.assertLess(inner, 5 * math.log(math.e * product) / product)

    def test_endpoint_ideal_is_killed_only_after_compression(self) -> None:
        epsilon = (1.0, 1.0, 1.0)
        j_vector = (1 / math.sqrt(2), -1 / math.sqrt(2), 0.0)
        self.assertAlmostEqual(
            sum(e * j for e, j in zip(epsilon, j_vector)), 0.0, places=15
        )

        u = (2.0, -0.5, 1.25)
        alpha = 0.75
        endpoint = tuple(
            tuple(
                epsilon[r] * u[s]
                + u[r] * epsilon[s]
                + alpha * epsilon[r] * epsilon[s]
                for s in range(3)
            )
            for r in range(3)
        )
        self.assertGreater(max(abs(value) for row in endpoint for value in row), 1.0)
        compressed = sum(
            j_vector[r] * endpoint[r][s] * j_vector[s]
            for r in range(3)
            for s in range(3)
        )
        self.assertAlmostEqual(compressed, 0.0, places=14)

        self.assertIn(
            "Such a term does not generally belong to\n(3.2)", self.text
        )

    def test_one_hard_stationary_exponents(self) -> None:
        c = 1.0e12
        for q, ell in ((2, 1), (3, 7), (17, 11), (101, 31)):
            product = q * ell
            amplitude = math.sqrt(product) / ell
            curvature = c * product**3
            stationary = amplitude / math.sqrt(curvature)
            expected = 1 / (math.sqrt(c) * q * ell**2)
            self.assertAlmostEqual(stationary, expected, places=15)

    def test_deep_tail_is_operator_level_and_power_small(self) -> None:
        for c in (1.0e8, 1.0e12, 1.0e16):
            threshold = int(c**0.25)
            partial = sum(
                math.log(n) / n**2
                for n in range(threshold + 1, 50 * threshold + 1)
            )
            remainder = (math.log(50 * threshold) + 1) / (50 * threshold)
            self.assertLess(
                partial + remainder,
                1.1 * (math.log(threshold) + 1) / threshold,
            )
            self.assertLess(c**-0.25 * math.log(c), c**-0.08)

    def test_logarithmic_prefix_makes_remainder_sublinear(self) -> None:
        previous = float("inf")
        for exponent in (400, 450, 500, 550):
            log_ratio = 30 * math.log(exponent) - 0.12 * exponent - math.log(exponent)
            self.assertLess(log_ratio, previous)
            previous = log_ratio

    def test_scope_and_fail_closed_tokens(self) -> None:
        required = (
            "complete same-side prime fold",
            "two ordered same-side orientations",
            "exact finite-cutoff density",
            "must not be replaced by\na square",
            "Only after this factorization is the exact compression applied",
            "does not generally belong to",
            "retained in the integration-by-parts quotient",
            "principal carrier is not extrapolated termwise",
            "operator estimate for the resummed endpoint-null profile",
            "reflected Stieltjes form",
            "P0_INVALIDATED",
            "standard eight are\nunchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "every regular boundary lies in the endpoint ideal",
            "the two Fejer weights are equal",
            "the Bernoulli row is a positive independent block",
            "This proves the full outer-only lower bound",
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
        self.assertGreaterEqual(len(displays), 30)
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
