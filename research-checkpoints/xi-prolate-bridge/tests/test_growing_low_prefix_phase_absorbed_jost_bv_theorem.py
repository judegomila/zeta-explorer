#!/usr/bin/env python3
"""Regressions for the growing low-prefix phase-absorbed Jost BV theorem."""

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
NOTE = ROOT / "notes" / "GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md"
NOTE_HASH = "e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe"

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
    "notes/GROWING_TRANSITION_BOTH_MISS_RECIPROCAL_CORE_THEOREM.md":
        "0211d021fa37b423f41b2839aeda96630aaac931de0ea3d7d028f95705de29a8",
    "tests/test_growing_transition_both_miss_reciprocal_core_theorem.py":
        "0ec59c581c1109e07d57306dc3eb6752f3ba3a4080cbf4b2683c1ddfe3b41d4c",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_TWO_ANCHOR_BULK_TRACE_OBSTRUCTION_THEOREM.md":
        "cb2afb9b28cbcaf4dbd55802b72e59a3f71cad0fa84e69ee18252c5f7dbef591",
    "tests/test_growing_transition_direct_source_two_anchor_bulk_trace_obstruction_theorem.py":
        "bd888e61906c5c696f8a7338dbf4d1b6861c888ee863d2ba6ba9ab14d05d8892",
    "notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md":
        "2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97",
    "tests/test_growing_transition_direct_source_upper_form_theorem.py":
        "96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2",
    "notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md":
        "efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca",
    "tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py":
        "12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class GrowingLowPrefixPhaseAbsorbedJostBvTests(unittest.TestCase):
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

    def test_exact_phase_absorption_identity(self) -> None:
        for c, nu, x in (
            (100.0, 3.5, 0.2),
            (1000.0, 17.25, 1.0),
            (1.0e6, 41.5, 8.0),
        ):
            p = c - nu / (1 + x * x)
            q0 = (1 - 2 * x * x) / (4 * x * x * (1 + x * x) ** 2)
            residual = q0 - nu * nu / (1 + x * x) ** 2
            exact = c * c - 2 * c * nu / (1 + x * x) + q0
            self.assertAlmostEqual(p * p + residual, exact, places=7)

    def test_q0_algebra_and_integrable_envelopes(self) -> None:
        for x in (0.05, 0.2, 1.0, 3.0, 20.0):
            original = 1 / (4 * x * x) - (1 + x * x / 4) / (1 + x * x) ** 2
            reduced = (1 - 2 * x * x) / (4 * x * x * (1 + x * x) ** 2)
            self.assertAlmostEqual(original, reduced, places=12)

        # The exact p' integral used in the Volterra load.
        for x in (0.2, 1.0, 5.0):
            nu = 7.0
            antiderivative = nu / (1 + x * x)
            # Trapezoidal audit on a long finite interval.
            upper = 500.0
            steps = 200000
            h = (upper - x) / steps
            total = 0.0
            for j in range(steps + 1):
                z = x + j * h
                value = 2 * nu * z / (1 + z * z) ** 2
                total += value * (0.5 if j in (0, steps) else 1.0)
            total *= h
            self.assertLess(abs(total - antiderivative), 3e-4)

    def test_jost_load_is_small_on_moving_prefix(self) -> None:
        for c in (1.0e6, 1.0e10, 1.0e14):
            q = math.log(c)
            x0 = c ** (-0.25)
            load = c ** (-0.75) + q * q / c
            self.assertLess(load, 3 * c ** (-2 / 3))
            self.assertAlmostEqual(x0 ** -1 / c, c ** (-0.75), places=14)

    def test_defect_normalization_constant(self) -> None:
        # Averaging sin^2 against (1+x^2)^-1 gives pi/4.  Including two
        # exterior tails fixes d/e^2=1/(2*pi*lambda).
        lam = 37.0
        averaged_one_tail = (math.pi / 4) / (math.pi**2 * lam)
        two_tail = 2 * averaged_one_tail
        self.assertAlmostEqual(two_tail, 1 / (2 * math.pi * lam), places=15)

        for c in (1.0e4, 1.0e8, 1.0e12):
            hard_mass = math.sqrt(c) * c ** (-1.25)
            main_mass = c ** (-0.5)
            self.assertAlmostEqual(hard_mass / main_mass, c ** (-0.25))

    def test_shell_symbol_and_volterra_exponents(self) -> None:
        for m in (2, 5, 17):
            for r in (0.0, 1.0, 4.0):
                x = math.sqrt(m * m * math.exp(2 * r) - 1)
                q_m = 1 / math.sqrt(2 * math.pi * m * x)
                envelope = math.exp(-r / 2) / m
                self.assertLess(q_m, envelope)
                volterra_ratio = (math.exp(-2 * r) / (m * m))
                self.assertLessEqual(volterra_ratio, 0.25)

    def test_hard_parameter_graph_scales(self) -> None:
        for c in (1.0e6, 1.0e10):
            q = math.log(c)
            delta_mu = c * q
            value_norm = delta_mu * c ** (-1.5)
            derivative_norm = delta_mu * c ** (-0.5)
            self.assertAlmostEqual(value_norm, q / math.sqrt(c), places=12)
            self.assertAlmostEqual(derivative_norm, math.sqrt(c) * q, places=6)

    def test_reciprocal_hard_transition_exponents(self) -> None:
        c = 1.0e8
        for n, ell in ((2, 1), (3, 5), (17, 11), (101, 97)):
            product = n * ell
            amplitude_product = math.sqrt(product) / ell
            curvature = c * product**3
            stationary = amplitude_product / math.sqrt(curvature)
            target = 1 / (math.sqrt(c) * n * ell**2)
            self.assertAlmostEqual(stationary, target, places=15)

            s0 = 0.5 * math.log1p(product ** -2)
            endpoint_envelope = (4 / 3) * s0 ** 0.75 / ell
            target_scale = 1 / (n**1.5 * ell**2.5)
            self.assertLess(endpoint_envelope, target_scale)

    def test_weighted_hard_double_sums_converge(self) -> None:
        # Lambda(k)<=log(k) is enough for this finite monotone regression.
        previous_interior = 0.0
        previous_endpoint = 0.0
        c = 300.0
        for cutoff in (20, 50, 100, 200):
            interior = 0.0
            endpoint = 0.0
            for n in range(2, cutoff + 1):
                weight = math.log(n)
                for ell in range(1, cutoff + 1):
                    interior += weight / (n**1.5 * ell**2)
                    if n * ell >= c:
                        endpoint += weight / (n**2 * ell**2.5)
            self.assertGreaterEqual(interior, previous_interior)
            self.assertGreaterEqual(endpoint, previous_endpoint)
            self.assertLess(interior, 8.0)
            self.assertLess(endpoint, 0.05)
            previous_interior = interior
            previous_endpoint = endpoint

    def test_scope_and_exact_blocker_tokens(self) -> None:
        required = (
            "phase-absorbed coefficient system",
            "`exp(CQ)` does not occur",
            "uniform endpoint-white asymptotic",
            "finite-Fejer weights lie in `[0,1]`",
            "hard-edge parametric graph",
            "one-hard reciprocal **principal** carrier",
            "completed singular Carleman kernel",
            "finite-Fejer both-miss coefficient `C_(N,M)`",
            "honest Gram comparison",
            "Equation (7.5) is an unproved target",
            "finite-Fejer logarithmic-multiplier",
            "not an intrinsic missing coefficient",
            "full source congruence",
            "not yet proved",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

    def test_fail_closed_language(self) -> None:
        forbidden = (
            "This proves CP-FIO",
            "This proves the complete signed complement floor",
            "the both-miss term is an independent exact block",
            "earliest missing statement is the cutoff-uniform masked",
            "both ordered mask orientations",
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
