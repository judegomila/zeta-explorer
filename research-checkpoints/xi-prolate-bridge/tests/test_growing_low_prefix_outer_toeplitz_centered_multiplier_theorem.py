#!/usr/bin/env python3
"""Regressions for the growing low-prefix outer Toeplitz theorem."""

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
NOTE = ROOT / "notes" / "GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md"
NOTE_HASH = "b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44"

FROZEN = {
    "notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md":
        "e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe",
    "tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py":
        "a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713",
    "notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md":
        "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc",
    "tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py":
        "5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b",
    "notes/FIXED_PREFIX_COMPLETE_SIGNED_TOEPLITZ_SCHUR_THEOREM.md":
        "c69d6d1a69f71548aa9291c5d261117ac913f2851df8f8fcc2f186c8bd530314",
    "tests/test_fixed_prefix_complete_signed_toeplitz_schur_theorem.py":
        "4f704f58524b9f4818db8bd1884009be9f4074fd303e2ec1cca5be5c74f70f87",
    "notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md":
        "1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce",
    "tests/test_growing_low_prefix_complete_profile_fio_reduction.py":
        "ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fejer_weight(cutoff: int, sampler: int) -> float:
    return max(0.0, 1.0 - sampler / (cutoff + 1))


def w_value(cutoff: int, beta: float) -> float:
    upper = min(cutoff, int(math.floor(1.0 / math.sin(beta) + 1e-12)))
    return sum(fejer_weight(cutoff, m) ** 2 / m for m in range(1, upper + 1)) / (2 * math.pi)


class GrowingLowPrefixOuterToeplitzTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(f"`{relative}`", self.text)
            self.assertIn(f"`{expected}`", self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_squared_fejer_weight_and_cutoff_mismatch(self) -> None:
        self.assertAlmostEqual(fejer_weight(1, 1), 0.5)
        beta = math.pi / 3
        # At H=1 the finite symbol has coefficient omega_1(1)^2=1/4.
        self.assertAlmostEqual(w_value(1, beta), 1 / (8 * math.pi), places=15)
        self.assertNotAlmostEqual(w_value(1, beta), 1 / (2 * math.pi), places=12)
        for cutoff in (2, 5, 20):
            for sampler in range(1, cutoff + 1):
                expected = (1 - sampler / (cutoff + 1)) ** 2
                actual = fejer_weight(cutoff, sampler) ** 2
                self.assertAlmostEqual(actual, expected, places=15)

    def test_cosine_polarization_for_complex_coefficients(self) -> None:
        z = (1 + 2j, -0.75 + 0.5j, 0.2 - 1.1j)
        for beta in (0.07, 0.31, 0.79, 1.2):
            direct = 0j
            for j, zj in enumerate(z):
                for k, zk in enumerate(z):
                    direct += zj.conjugate() * zk * math.cos(4 * (j - k) * beta)
            plus = sum(zj * cmath.exp(4j * j * beta) for j, zj in enumerate(z))
            minus = sum(zj * cmath.exp(-4j * j * beta) for j, zj in enumerate(z))
            polarized = 0.5 * (abs(plus) ** 2 + abs(minus) ** 2)
            self.assertAlmostEqual(direct.real, polarized, places=13)
            self.assertAlmostEqual(direct.imag, 0.0, places=13)

    def test_finite_cutoff_floor_constant(self) -> None:
        for cutoff in (1, 2, 5, 100):
            omega_one = fejer_weight(cutoff, 1)
            self.assertGreaterEqual(omega_one**2 / 4, 1 / 16)

        # The orthogonality interval is exactly [0, pi/2].
        steps = 20000
        for difference in (1, 2, 7):
            h = (math.pi / 2) / steps
            integral = 0j
            for r in range(steps + 1):
                beta = r * h
                value = cmath.exp(4j * difference * beta)
                integral += value * (0.5 if r in (0, steps) else 1.0)
            self.assertLess(abs(h * integral), 1e-12)

    def test_log_squared_carleson_scale(self) -> None:
        # Near beta=0 the worst model density is log(e/beta)^2.
        # Its interval mass is O(h log(e/h)^2), uniformly in h.
        for exponent in (4, 6, 8, 10):
            h = 2.0 ** (-exponent)
            steps = 100000
            dx = h / steps
            total = 0.0
            for j in range(steps):
                beta = (j + 0.5) * dx
                total += math.log(math.e / beta) ** 2
            total *= dx
            scale = h * math.log(math.e / h) ** 2
            self.assertLess(total / scale, 1.8)

    def test_prime_equality_factor_and_slots(self) -> None:
        for n, ell in ((2, 1), (3, 4), (17, 9)):
            ordered = 1 / (4 * math.pi * ell * math.sqrt(n))
            prime_coefficient = -2 / math.sqrt(n)
            two_orientations = 2
            combined = ordered * prime_coefficient * two_orientations
            self.assertAlmostEqual(combined, -1 / (math.pi * n * ell), places=15)

            cutoff = n * ell + 7
            two_slots = fejer_weight(cutoff, n * ell) * fejer_weight(cutoff, ell)
            self.assertGreater(two_slots, 0.0)
            self.assertNotEqual(two_slots, fejer_weight(cutoff, n * ell) ** 2)

    def test_endpoint_null_divided_difference_tail_split(self) -> None:
        for c in (1.0e8, 1.0e12, 1.0e16):
            threshold = int(c ** 0.25)
            # The complete compressed tail has norm O(Q^(3/2) sum l^-2).
            partial = sum(ell ** -2 for ell in range(threshold + 1, 20 * threshold + 1))
            remainder = 1 / (20 * threshold)
            self.assertLess(partial + remainder, 1.1 / threshold)
            self.assertLess(partial + remainder, 1.1 * c ** -0.25)

    def test_full_metric_isometry_and_endpoint_row(self) -> None:
        # One endpoint-null column C=(1,-1), with d_1=d_2=3.
        d = (3.0, 3.0)
        column = (1.0, -1.0)
        metric = sum(di * ci * ci for di, ci in zip(d, column))
        j_vector = tuple(math.sqrt(di) * ci / math.sqrt(metric) for di, ci in zip(d, column))
        self.assertAlmostEqual(sum(value * value for value in j_vector), 1.0, places=15)

        epsilon = (1.0, 1.0)
        self.assertAlmostEqual(sum(e * j for e, j in zip(epsilon, j_vector)), 0.0, places=15)
        u = (2.0, -0.5)
        endpoint = tuple(
            tuple(epsilon[r] * u[s] + u[r] * epsilon[s] for s in range(2))
            for r in range(2)
        )
        compressed = sum(j_vector[r] * endpoint[r][s] * j_vector[s] for r in range(2) for s in range(2))
        self.assertAlmostEqual(compressed, 0.0, places=15)

    def test_fractional_gate_is_sublinear_only_below_half(self) -> None:
        delta = 0.4
        previous = float("inf")
        for exponent in (10, 20, 40, 80):
            length = math.exp(exponent)
            q = length
            ratio = q ** (2 * delta) * math.log(q + 2) / length
            self.assertLess(ratio, previous)
            previous = ratio

    def test_scope_and_fail_closed_tokens(self) -> None:
        required = (
            "cutoff-matched endpoint-sheared Gram estimate",
            "mandatory square `omega_H(m)^2`",
            "No uncompressed pure-label norm estimate is proved",
            "isolated `B_2` Bernoulli profile is a diagnostic term",
            "ordinary lower-end row",
            "uncompressed pure-label matrix",
            "kill it only after the actual",
            "Equation (4.4) is unproved",
            "alternative sufficient centered-multiplier gate",
            "common radial sampler is exactly",
            "`OT-REM` includes",
            "complete signed-floor or projection-transfer claim",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the cutoff-uniform pseudodifferential error",
            "Equations (4.1)--(4.5) prove a complete same-side prime bound",
            "prove (0.14)--(0.15)",
            "unconditional low-prefix floor",
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
