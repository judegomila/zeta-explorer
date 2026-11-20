#!/usr/bin/env python3
"""Regressions for the fixed-anchor BV/Cauchy far-row theorem."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "FIXED_ANCHOR_BV_CAUCHY_FAR_ROW_THEOREM.md"
TEST = Path(__file__).resolve()
NOTE_HASH = "59395e5d184c93e3e56c935028c5fba322a0f30476bd9db1c99585c056876c79"

FROZEN = {
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "tests/test_fixed_even_prefix_arithmetic_synthesis_theorem.py":
        "6e89f2f1af22260e5796eb67221fccd86d2668556e9cb23dd903ea283d5f069f",
    "notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md":
        "c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f",
    "tests/test_growing_low_prefix_half_power_far_cross_theorem.py":
        "be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569",
    "notes/HIGH_FOURIER_COERCIVITY.md":
        "5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821",
    "tests/test_high_fourier_coercivity.py":
        "64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae",
    "notes/PROLATE_TAIL_ENVELOPE.md":
        "309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d",
    "tests/test_prolate_tail_envelope.py":
        "bb5b5ec58f6357a8defcf36b19d3a1674091518903c5438f56c17ae6eef0581e",
    "notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md":
        "ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86",
    "tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py":
        "bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d",
    "notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md":
        "c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b",
    "tests/test_fixed_even_endpoint_null_volterra_pnt_correlation_barrier.py":
        "195f71b516553b18bccd0ed9b873191abf463b6f72c79f2c4418f041f3f1bd73",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class FixedAnchorBVCauchyFarRowTests(unittest.TestCase):
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

    def test_stieltjes_bv_coefficient_has_one_over_n_decay(self) -> None:
        # A periodic step with one positive and one negative jump has exact
        # coefficients bounded by total variation/(2*pi*|n|).
        length = 3.0
        jump_location = 0.91
        total_variation = 2.0
        for mode in range(1, 80):
            omega = 2.0 * math.pi * mode / length
            coefficient = abs((1.0 - complex(math.cos(-omega * jump_location),
                                             math.sin(-omega * jump_location)))
                              / (1j * omega * math.sqrt(length)))
            bound = math.sqrt(length) * total_variation / (
                2.0 * math.pi * mode
            )
            self.assertLessEqual(coefficient, bound + 1e-14)

    def test_discrete_cauchy_weighted_sum_has_harmonic_tail(self) -> None:
        # Numerically stress the elementary lemma (3.4), including indices
        # close to the outer boundary.  The generous constant is fixed.
        for cutoff in (16, 64, 256, 1024):
            for index in (2, cutoff // 3, cutoff // 2, cutoff - 1, cutoff):
                value = sum(
                    1.0 / ((1 + abs(mode)) * abs(index - mode))
                    for mode in range(-cutoff, cutoff + 1)
                    if mode != index
                )
                scaled = value * (1 + index) / math.log(cutoff + 2)
                self.assertLess(scaled, 8.0)

    def test_exact_cauchy_matrix_preserves_one_over_n_tail(self) -> None:
        cutoff = 300
        coefficients = {
            index: F((-1) ** abs(index), 1 + abs(index))
            for index in range(-cutoff, cutoff + 1)
        }
        bvalues = {
            index: F(index, 1 + abs(index))
            for index in range(-cutoff, cutoff + 1)
        }
        # Test only the Cauchy commutator.  Multiplying the output by n
        # should grow no faster than a harmonic logarithm.
        scaled: list[float] = []
        for index in range(cutoff // 2, cutoff + 1):
            value = sum(
                (bvalues[index] - bvalues[mode])
                * coefficients[mode]
                / (index - mode)
                for mode in range(-cutoff, cutoff + 1)
                if mode != index
            )
            scaled.append(float(abs(value)) * (1 + index))
        self.assertLess(max(scaled), 12.0 * math.log(cutoff + 2))

    def test_deflated_endpoint_nullization_and_raw_denominator(self) -> None:
        # T(c4)=p4, T(c8)=p8=W8+alpha*p4, and s8=c8-alpha*c4.
        alpha = F(3, 7)
        endpoint_c4 = F(2, 11)
        endpoint_c8 = F(5, 13)
        endpoint_s8 = endpoint_c8 - alpha * endpoint_c4
        theta = endpoint_c4 / endpoint_s8

        # Coordinates are ordered (p4,W8).  The deflated construction is
        # Tg=(1,-theta), hence p4=Tg+theta*W8 exactly.
        transformed_deflated = [F(1), -theta]
        recovered = [transformed_deflated[0], transformed_deflated[1] + theta]
        self.assertEqual(recovered, [F(1), F(0)])

        zeta = endpoint_c4 / endpoint_c8
        # Raw Tg_raw=p4-zeta*p8=(1-zeta*alpha,-zeta).
        transformed_raw = [F(1) - zeta * alpha, -zeta]
        right = [transformed_raw[0], transformed_raw[1] + zeta]
        self.assertEqual(right, [F(1) - zeta * alpha, F(0)])
        self.assertNotEqual(right[0], F(1))

    def test_locked_exponential_margin_dominates_defect(self) -> None:
        margin = 2400.0 * math.log(2.0) - 2.0 * math.pi
        self.assertGreater(margin, 1600.0)
        log_ratios = [
            20.0 * math.log(length) - margin * length * length
            for length in (2.5, 3.5, 4.5)
        ]
        self.assertTrue(
            all(right < left for left, right in zip(log_ratios, log_ratios[1:]))
        )

    def test_scope_and_required_formulas(self) -> None:
        self.assertEqual(self.text.count(r"{\cal K}"), 4)
        self.assertEqual(self.text.count(r"{\cal L}"), 3)
        self.assertNotIn("{cal ", self.text)
        required = (
            "b_F=P_Fb",
            "P_*(\\lambda,L)\\over\\sqrt R",
            "\u03b8",  # This is intentionally absent: ASCII hygiene below rejects it.
        )
        self.assertIn(required[0], self.text)
        self.assertIn(required[1], self.text)
        self.assertNotIn(required[2], self.text)
        for phrase in (
            "does not cover the retained\nnon-endpoint-null singleton `W_8`",
            "Dropping the factor on the left would be an exact algebraic error",
            "real blocker for the coarse",
            "not for the actual\nfixed-anchor far row",
            "closes only `b_F=P_Fb`",
            "does not control the retained row",
            "remains `P0_INVALIDATED`",
            "standard eight are unchanged",
        ):
            self.assertIn(phrase, self.text)
        for forbidden in (
            "the retained row is closed",
            "proves the Riemann hypothesis",
            "the anchor belongs to the endpoint-null prefix",
        ):
            self.assertNotIn(forbidden, self.text)

    def test_all_displayed_tex_compiles(self) -> None:
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
                ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name],
                cwd=directory,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_ascii_python_and_whitespace_hygiene(self) -> None:
        ast.parse(TEST.read_text(encoding="utf-8"), filename=str(TEST))
        self.assertNotRegex(self.text, re.compile(r"(?<!\\)\$"))
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertFalse(any(byte < 32 and byte != 10 for byte in payload))
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(any(line.endswith((b" ", b"\t")) for line in payload.splitlines()))


if __name__ == "__main__":
    unittest.main()
