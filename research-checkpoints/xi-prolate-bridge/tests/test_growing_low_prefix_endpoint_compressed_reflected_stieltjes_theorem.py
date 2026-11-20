#!/usr/bin/env python3
"""Regressions for the endpoint-compressed reflected Stieltjes theorem."""

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
NOTE = ROOT / "notes" / (
    "GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_REFLECTED_STIELTJES_THEOREM.md"
)
NOTE_HASH = "621594962543f7700503cc545cca57b97a4969ef15b0129b0c026758398e8502"
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
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fejer_weight(cutoff: int, sampler: int) -> float:
    return max(0.0, 1.0 - sampler / (cutoff + 1))


class GrowingLowPrefixReflectedStieltjesTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        tick = chr(96)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(f"{tick}{relative}{tick}", self.text)
            self.assertIn(f"{tick}{expected}{tick}", self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_reflected_signs(self) -> None:
        # M=-continuous+prime+logarithmic and Q_refl=-2*lambda*M.
        lam = 7.0
        continuous, prime, logarithmic = 1.2, -0.3, 0.05
        combined = -2 * lam * (-continuous + prime + logarithmic)
        displayed = (
            2 * lam * continuous
            - 2 * lam * prime
            - 2 * lam * logarithmic
        )
        self.assertAlmostEqual(combined, displayed, places=14)

    def test_continuous_term_and_pole_are_positive(self) -> None:
        values = (1 + 2j, -0.25 + 0.5j, 0.7 - 0.1j, -0.4 - 0.8j)
        correlation = sum(left.conjugate() * right
                          for left in values for right in values)
        self.assertAlmostEqual(correlation.real, abs(sum(values)) ** 2, places=13)
        self.assertAlmostEqual(correlation.imag, 0.0, places=13)
        self.assertGreaterEqual(correlation.real, 0.0)

        row = (1 + 0.2j, -0.4 + 0.7j, 0.3 - 0.9j)
        vector = (0.5 - 0.1j, -1.2 + 0.4j, 0.8 + 0.6j)
        pole = 2 * abs(sum(r * z for r, z in zip(row, vector))) ** 2
        self.assertGreaterEqual(pole, 0.0)

    def test_endpoint_ideal_compresses_to_zero(self) -> None:
        epsilon = (1.0, 1.0)
        j_vector = (1 / math.sqrt(2), -1 / math.sqrt(2))
        self.assertAlmostEqual(sum(e * j for e, j in zip(epsilon, j_vector)), 0.0)
        u, alpha = (0.7, -1.1), 0.35
        endpoint = tuple(tuple(
            epsilon[r] * u[s] + u[r] * epsilon[s]
            + alpha * epsilon[r] * epsilon[s]
            for s in range(2)) for r in range(2))
        compressed = sum(j_vector[r] * endpoint[r][s] * j_vector[s]
                         for r in range(2) for s in range(2))
        self.assertAlmostEqual(compressed, 0.0, places=15)

    def test_symmetric_and_reciprocal_physical_support(self) -> None:
        for beta in (0.18, 0.41, 0.72, 1.13):
            csc, sec = 1 / math.sin(beta), 1 / math.cos(beta)
            for m in range(1, 6):
                for ell in range(1, 6):
                    sym = math.log(csc / m) >= -1e-14 and math.log(csc / ell) >= -1e-14
                    self.assertEqual(sym, m <= csc + 1e-14 and ell <= csc + 1e-14)
                    rec = math.log(csc / m) >= -1e-14 and math.log(sec / ell) >= -1e-14
                    self.assertEqual(rec, m <= csc + 1e-14 and ell <= sec + 1e-14)

    def test_ghost_endpoints_and_unique_coalescence(self) -> None:
        beta = math.pi / 4
        s_12 = math.log((1 / math.sin(beta)) / 1)
        t_12 = math.log((1 / math.cos(beta)) / 2)
        self.assertGreater(s_12, 0.0)
        self.assertLess(t_12, 0.0)
        allowed = [
            (m, ell)
            for m in range(1, 5)
            for ell in range(1, 5)
            if m <= 1 / math.sin(beta) + 1e-14
            and ell <= 1 / math.cos(beta) + 1e-14
        ]
        self.assertEqual(allowed, [(1, 1)])

    def test_reciprocal_prime_carrier_is_one(self) -> None:
        for m, ell, n in ((1, 1, 101), (1, 7, 103), (4, 9, 107)):
            carrier = cmath.exp(2j * math.pi * m * ell * n)
            self.assertAlmostEqual(carrier.real, 1.0, places=10)
            self.assertAlmostEqual(carrier.imag, 0.0, places=10)

    def test_hard_divided_difference_scales(self) -> None:
        for c in (1.0e8, 1.0e12, 1.0e16):
            split, edge = c ** -1, c ** -0.25
            first_l1 = c ** 1.5 * split**4 / 4
            second_l1 = (edge**2.5 - split**2.5) / 2.5
            l1, linf = first_l1 + second_l1, edge**0.5
            self.assertLess(l1, 0.5 * c ** (-5 / 8))
            self.assertAlmostEqual(linf, c ** (-1 / 8), places=14)
            self.assertLess(l1 * linf, 0.5 * c ** (-3 / 4))

    def test_deep_reciprocal_ladder_is_power_small(self) -> None:
        for c in (1.0e8, 1.0e12):
            threshold = int(c ** 0.25)
            low = 0.5 * c ** -0.5 * sum(
                1 / ell for ell in range(1, threshold + 1)
            )
            partial = sum(1 / (2 * ell**3)
                          for ell in range(threshold + 1, 40 * threshold + 1))
            remainder = 1 / (4 * (40 * threshold) ** 2)
            self.assertLess(low, c ** -0.5 * math.log(c))
            self.assertLess(partial + remainder, 0.3 * c ** -0.5)

    def test_quartic_core_and_log_tail_scales(self) -> None:
        delta = 1 / 32
        previous = None
        for length in (500.0, 1000.0, 2000.0):
            # Log of Q^8*c^(-1/4+delta/2), with Q=L.
            log_ratio = 8 * math.log(length) + (-0.25 + delta / 2) * length
            self.assertLess(log_ratio, 0.0)
            if previous is not None:
                self.assertLess(log_ratio, previous)
            previous = log_ratio

        a, lam = 100.0, 10.0
        rows = (0.7 + 0.2j, -0.1 + 0.8j, 0.3 - 0.4j)
        value = sum(a ** (-2 * k) * abs(row) ** 2
                    for k, row in enumerate(rows))
        self.assertLessEqual(-2 * lam * a ** -3 * value, 0.0)

    def test_carleson_rates_and_fejer_uniformity(self) -> None:
        previous = None
        for q in (64.0, 256.0, 1024.0, 4096.0, 16384.0):
            reciprocal = math.log(q + 2) ** 2
            symmetric = math.sqrt(q) * math.log(q + 2) ** 2
            ratio = symmetric / q
            self.assertLess(reciprocal, symmetric)
            if previous is not None:
                self.assertLess(ratio, previous)
            previous = ratio
        for cutoff in (1, 2, 5, 20):
            for sampler in range(1, cutoff + 2):
                self.assertGreaterEqual(fejer_weight(cutoff, sampler), 0.0)
                self.assertLessEqual(fejer_weight(cutoff, sampler), 1.0)

    def test_scope_and_claim_tokens(self) -> None:
        required = (
            "continuous reflected term and the even pole as",
            "negative prime operator directly",
            "m,l<=csc(beta)",
            "m<=csc(beta), l<=sec(beta)",
            "ghost stationary points",
            "only physical",
            "coalescence",
            "bounded endpoint",
            "transition factors",
            "only exact endpoint deletion",
            "finite Fejer",
            "sampling is not silently replaced",
            "deep reciprocal ladder",
            "not promoted term by term",
            "operator estimate after endpoint compression",
            "same-side non-equality prime fold",
            "centered Archimedean multiplier",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)
        forbidden = (
            "This proves the full outer remainder",
            "This proves the unconditional low-prefix floor",
            "(1,2,0) and (2,1,0) are boundary caustics",
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
        self.assertLessEqual(imported, {
            "__future__", "ast", "cmath", "hashlib", "math", "pathlib",
            "re", "shutil", "subprocess", "tempfile", "unittest",
        })

    def test_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 45)
        document = (
            "\\documentclass{article}\n\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as directory:
            tex_path = Path(directory) / "note.tex"
            tex_path.write_text(document, encoding="ascii")
            result = subprocess.run(
                [pdflatex, "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory, capture_output=True, text=True, timeout=60, check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
