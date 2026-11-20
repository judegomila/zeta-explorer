#!/usr/bin/env python3
"""Regressions for the low-prefix complete-profile FIO reduction."""

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
NOTE = ROOT / "notes" / "GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md"
NOTE_HASH = "1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce"

FROZEN = {
    "notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md":
        "173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc",
    "tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py":
        "5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b",
    "notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md":
        "caaa4df57d43f74ef56fed6df907da6db0daa7b0f89da23cce30bc2ac9369acd",
    "tests/test_moving_label_carrier_coframe_defect_right_inverse_theorem.py":
        "31f8ffad0dc5a1f2b6a00a47b55238d64d9bc6550813d5b77b15c00da1757913",
    "notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md":
        "6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9",
    "tests/test_growing_transition_complete_central_form_reduction.py":
        "a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "tests/test_growing_transition_equality_conductor_garding_theorem.py":
        "61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba",
    "notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md":
        "efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca",
    "tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py":
        "12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class GrowingLowPrefixCompleteProfileFioReductionTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(f"`{relative}`", self.text)
            self.assertIn(f"`{expected}`", self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_hybrid_prime_translation_sum_is_sqrt_q(self) -> None:
        # Replace Lambda by its Chebyshev density 1.  The two pieces have
        # the exact exponents used in the operator proof.
        for q in (16.0, 64.0, 256.0, 1024.0):
            low = 2 * math.sqrt(q)
            high = q ** 1.5 / q
            self.assertLessEqual(low + high, 3 * math.sqrt(q) + 1e-12)
            self.assertLess((low + high) / q, 4 / math.sqrt(q))

    def test_raw_shift_is_not_complete_sampler_fold(self) -> None:
        # V_q R_l=sqrt(q)R_(ql).  The full fold has all m, while equality
        # removes only m=q*l; the unequal terms do not disappear.
        q = 2
        rows = {1: 1.0, 2: 0.5, 3: -0.25, 4: 0.125}
        full = 0.0
        equality = 0.0
        for m, left in rows.items():
            for ell in (1, 2):
                right = math.sqrt(q) * rows[q * ell]
                full += left * right
                if m == q * ell:
                    equality += left * right
        self.assertNotEqual(full - equality, 0.0)
        self.assertNotEqual(full, rows[1] * math.sqrt(q) * rows[q])

    def test_physical_to_isometric_normalization_locks_one_eighth(self) -> None:
        # Phi=U/(2*sqrt(2)), so every physical quadratic Gram is 1/8
        # of the corresponding U-coordinate Gram.  Consequently the
        # equality-prime coefficient -4 becomes -1/2, not -4, in U.
        scale = 1 / (2 * math.sqrt(2))
        self.assertAlmostEqual(scale**2, 1 / 8, places=15)
        weighted_u_gram = sum(
            weight * value**2
            for weight, value in ((math.log(2), 0.75), (math.log(3), -1.25))
        )
        physical_coordinate_value = -4 * scale**2 * weighted_u_gram
        isometric_coordinate_value = -0.5 * weighted_u_gram
        self.assertAlmostEqual(
            physical_coordinate_value, isometric_coordinate_value, places=14
        )

    def test_stationary_equation_has_symmetric_and_reciprocal_roots(self) -> None:
        def h(x: float) -> float:
            return x + 1 / x

        for x in (0.3, 0.7, 1.4, 3.0):
            self.assertAlmostEqual(h(x), h(1 / x), places=13)
            self.assertAlmostEqual(h(x), h(x), places=13)

        # (x1^2+1)(x2^2+1)=r^2 on both branches.
        for r in (2.1, 3.0, 10.0):
            x_sym = math.sqrt(r - 1)
            self.assertAlmostEqual((x_sym**2 + 1) ** 2, r**2)
            x_rec = 0.5 * (r + math.sqrt(r * r - 4))
            y_rec = 1 / x_rec
            self.assertAlmostEqual(
                (x_rec**2 + 1) * (y_rec**2 + 1), r**2, places=12
            )

    def test_prime_reciprocal_carrier_and_label_phase(self) -> None:
        # c=2*pi*A makes the reciprocal geometric phase integral at a
        # prime atom for every sampler pair.
        for m, ell, n in ((1, 1, 101), (1, 3, 103), (4, 7, 107)):
            carrier = cmath.exp(2j * math.pi * m * ell * n)
            self.assertAlmostEqual(carrier.real, 1.0, places=10)
            self.assertAlmostEqual(carrier.imag, 0.0, places=10)

        for k in (1, 2, 9):
            nu = 4 * k + 0.5
            phase = cmath.exp(1j * nu * math.pi / 2)
            target = cmath.exp(1j * math.pi / 4)
            self.assertAlmostEqual(abs(phase - target), 0.0, places=12)

    def test_second_derivative_formulas(self) -> None:
        for x in (0.4, 0.8, 1.3, 2.5):
            h = x + 1 / x
            sym_direct = 2 * (1 - 1 / x**2) * h
            sym_formula = 2 * (x - 1 / x**3)
            self.assertAlmostEqual(sym_direct, sym_formula, places=12)

            reciprocal_direct = h * (
                (1 - 1 / x**2) + (1 - x**2)
            )
            reciprocal_formula = -h * (x - 1 / x) ** 2
            self.assertAlmostEqual(
                reciprocal_direct, reciprocal_formula, places=12
            )

    def test_reciprocal_pushforward_cancels_caustic(self) -> None:
        for beta in (0.05, 0.2, 0.5, math.pi / 4 - 1e-4):
            r = 2 / math.sin(2 * beta)
            jacobian = 2 * abs(1 / math.tan(2 * beta))
            curvature_factor = math.sqrt(r * r - 4)
            self.assertAlmostEqual(
                jacobian / curvature_factor, 1.0, places=9
            )

    def test_carleson_scales_are_sublinear(self) -> None:
        previous_ratio = None
        for q in (64.0, 256.0, 1024.0, 4096.0, 16384.0):
            reciprocal = math.log(q + 2) ** 2
            symmetric = math.sqrt(q) * math.log(q + 2) ** 2
            ratio = symmetric / q
            self.assertLess(reciprocal, symmetric)
            if previous_ratio is not None:
                self.assertLess(ratio, previous_ratio)
            previous_ratio = ratio

    def test_complex_reflected_continuous_form_is_modulus_square(self) -> None:
        # Two abstract Laplace rows audit the conjugation convention.
        rows = (1 + 2j, -0.5 + 0.25j)
        coeffs = (0.7 - 0.2j, -1.1 + 0.4j)
        integral = sum(x * row for x, row in zip(coeffs, rows))
        paired = integral.conjugate() * integral
        self.assertGreaterEqual(paired.real, 0.0)
        self.assertAlmostEqual(paired.imag, 0.0, places=13)

    def test_scope_and_gate_tokens(self) -> None:
        required = (
            "Q\\leq C_0L",
            "raw one-tail translation correlation",
            "only a raw subchannel",
            "same-side prime and Archimedean terms",
            "B=\\sum_{m\\geq1}R_m\\Phi",
            "||R_m Phi||^2=(1/8)||R_mU||^2",
            "coefficient is `-4` in physical",
            "`-1/2` in isometric (U) coordinates",
            "symmetric branch is a Hankel Fourier frame",
            "reciprocal branch is a Toeplitz Fourier frame",
            "2\\pi mln",
            "finite-resolution Carleson embedding",
            "Q_X=\\mathcal W_Z(O,O)",
            "Hypothesis `OO-NEQ`",
            "outer-only complete non-equality estimate",
            "common-sampler cross-label",
            "regular-FIO",
            "DS-SC` estimate",
            "equivalent ordered-limit route",
            "both-miss mask",
            "exact quartic and hard cores stay inside",
            "pinned input presently supplies",
            "declare them standalone exact blocks",
            "exact full exterior metric",
            "not promoted to",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_fail_closed_language(self) -> None:
        forbidden = (
            "This proves OO-NEQ",
            "This proves the unconditional low-prefix floor",
            "ER and WA are independent exact blocks",
            "caustic-core pieces give",
            "may either be included in `R_CP` or recorded separately",
            "DS-SC is the sole missing gate",
            "applies to Q asymp lambda^2",
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
