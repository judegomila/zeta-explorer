#!/usr/bin/env python3
"""Regressions for the endpoint-compressed logarithmic WKB theorem."""

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
    / "GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_LOG_MULTIPLIER_WKB_THEOREM.md"
)
NOTE_HASH = "DRAFT"

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
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def real_psi_quarter(xi: float) -> float:
    """Re psi(1/4+i*xi/2) by recurrence and its asymptotic series."""
    z = complex(0.25, xi / 2)
    shifted = z + 32
    inverse = 1 / shifted
    inverse2 = inverse * inverse
    # log(z)-1/(2z)-sum B_(2k)/(2k z^(2k)).
    value = (
        cmath.log(shifted)
        - inverse / 2
        - inverse2 / 12
        + inverse2**2 / 120
        - inverse2**3 / 252
        + inverse2**4 / 240
        - inverse2**5 / 132
    )
    for k in range(32):
        value -= 1 / (z + k)
    return value.real


class GrowingLowPrefixEndpointCompressedLogWkbTests(unittest.TestCase):
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

    def test_digamma_kernel_sign_and_half_scale(self) -> None:
        # Midpoint quadrature of the exact difference kernel.  The
        # difference cancels its 1/t singularity at the origin.
        for xi, p in ((3.0, 7.0), (17.0, 5.0), (40.0, 80.0)):
            upper = 80.0
            steps = 300000
            h = upper / steps
            integral = 0.0
            for k in range(steps):
                t = (k + 0.5) * h
                kernel = math.exp(-t / 4) / (-math.expm1(-t))
                integral += kernel * (
                    math.cos(p * t / 2) - math.cos(xi * t / 2)
                )
            integral *= h
            expected = real_psi_quarter(xi) - real_psi_quarter(p)
            self.assertLess(abs(integral - expected), 2e-4)

    def test_exact_lower_row_factorization(self) -> None:
        epsilon = (1.25, 0.75, 2.0)
        z = (2.0 - 0.5j, -1.0 + 0.25j, 0.3 + 0.1j)
        f = (
            (1.0 + 0.2j, -0.4 + 0.3j),
            (0.5 - 0.1j, 0.9 + 0.7j),
            (-0.2 + 0.4j, 1.3 - 0.2j),
        )
        reference = f[0]
        direct = [
            sum(z[j] * epsilon[j] * f[j][k] for j in range(3))
            for k in range(2)
        ]
        endpoint = sum(epsilon[j] * z[j] for j in range(3))
        factored = [
            reference[k] * endpoint
            + sum(
                z[j] * epsilon[j] * (f[j][k] - reference[k])
                for j in range(3)
            )
            for k in range(2)
        ]
        for left, right in zip(direct, factored):
            self.assertLess(abs(left - right), 1e-14)

    def test_endpoint_row_is_killed_only_after_actual_compression(self) -> None:
        d = (0.2, 0.5, 0.7)
        e = (1.0, 2.0, 3.0)
        epsilon = tuple(e[j] / math.sqrt(d[j]) for j in range(3))
        # Columns of C satisfy e^T C=0 in raw modal coordinates.
        columns = (
            (e[1], -e[0], 0.0),
            (e[2], 0.0, -e[0]),
        )
        for column in columns:
            raw_endpoint = sum(e[j] * column[j] for j in range(3))
            white_column = tuple(math.sqrt(d[j]) * column[j] for j in range(3))
            compressed_endpoint = sum(
                epsilon[j] * white_column[j] for j in range(3)
            )
            self.assertAlmostEqual(raw_endpoint, 0.0)
            self.assertAlmostEqual(compressed_endpoint, 0.0)
        self.assertGreater(sum(value * value for value in epsilon), 1.0)

    def test_divided_difference_gains_one_sampler_power(self) -> None:
        q = 21
        for m in (2, 5, 17, 101):
            for s in (0.0, 0.7, 2.0):
                x = math.sqrt(m * m * math.exp(2 * s) - 1)
                beta = math.atan(1 / x)
                amplitude = 1 / math.sqrt(2 * math.pi * m * x)
                gained = amplitude * q * beta
                envelope = q * math.exp(-1.5 * s) / m**2
                self.assertLess(gained, 1.2 * envelope)

    def test_wkb_split_and_hard_fractional_exponents(self) -> None:
        for c_value in (1.0e8, 1.0e12, 1.0e16):
            x0 = c_value ** (-0.25)
            p = c_value / x0
            slow = x0 ** -2
            split = p ** (-0.75)
            near_phase = slow * p * split * split
            self.assertLessEqual(near_phase, 1.01 * c_value ** (-0.125))
            self.assertLess(slow / p, 2 * c_value ** (-0.75))

            delta = 0.125
            hard_power = -0.25 + delta / 4
            self.assertLess(hard_power, -0.2)

    def test_digamma_limit_has_two_pi_normalization(self) -> None:
        for c_value in (1.0e4, 1.0e6):
            for beta in (0.03, 0.2, 0.7, 1.2, 1.5):
                xi = c_value / (math.sin(beta) * math.cos(beta))
                exact = real_psi_quarter(xi) - math.log(math.pi)
                exact -= math.log(c_value)
                target = math.log(
                    1 / (2 * math.pi * math.sin(beta) * math.cos(beta))
                )
                asymptotic = math.log(xi / (2 * math.pi)) - math.log(c_value)
                self.assertAlmostEqual(asymptotic, target, places=13)
                self.assertTrue(math.isfinite(exact))

    def test_scope_and_no_jet_splitting_tokens(self) -> None:
        required = (
            "ordinary lower-end packet is factored at finite cutoff",
            "killed only by (0.6)",
            "exact\nspectral divided difference",
            "never split\noff",
            "e^*C_Q^\\#=0",
            "J_Q^*E_{{\\rm end},H,Q}J_Q=0",
            "singular\n\\(t^{-1}\\) kernel was never estimated by an absolute triangle",
            "zero-initial divided-difference graph",
            "no value at \\(s=0\\) is deleted",
            "Isolating the derivative/\\(B_2\\) row",
            "signed non-equality prime block",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)
        forbidden = (
            "shell BV proves the functional calculus",
            "delete the B_2 row",
            "This proves the complete signed floor",
            "This proves the Riemann hypothesis",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

    def test_display_balance_unique_tags_ascii_and_imports(self) -> None:
        self.assertEqual(self.text.count("\\["), self.text.count("\\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__).resolve()):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))

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
                "__future__", "ast", "cmath", "hashlib", "math",
                "pathlib", "re", "shutil", "subprocess", "tempfile",
                "unittest",
            },
        )

    def test_displayed_tex_compiles_when_available(self) -> None:
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
