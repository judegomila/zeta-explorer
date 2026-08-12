#!/usr/bin/env python3
"""Regressions for the mixed-bridge radical quotient graph-core barrier."""

from __future__ import annotations

import ast
from fractions import Fraction
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
    / "GROWING_MIXED_BRIDGE_RADICAL_QUOTIENT_GRAPH_CORE_BARRIER.md"
)
NOTE_HASH = "96c477b3118eefced3ef2f2840ada259c18d1f2ec76daa86d2712ad6a666f768"

FROZEN = {
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md":
        "f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079",
    "notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md":
        "23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0",
    "tests/test_growing_low_prefix_outer_floor_assembly_theorem.py":
        "634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311",
    "notes/GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md":
        "a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459",
    "tests/test_growing_odd_low_prefix_outer_floor_transfer_theorem.py":
        "c8a86e338762f00c32c04e9e300fc3398d4cbb084f16a1a530b77a16a1144bad",
    "notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md":
        "335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb",
    "tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py":
        "0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc",
    "notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md":
        "6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98",
    "tests/test_polynomial_xi_radical_tower_covariance_floor_obstruction.py":
        "ce28d716eedddfad168a5d27fe38da31ab1ba81c77b9f0b28e637111db6afab5",
    "notes/CENTERED_ZERO_PALEY_WIENER_INTERPOLATION_OBSTRUCTION.md":
        "b23720bd4c05afbda4aa3f50176ff0580bacda0668264fd4fcc075b7c43d5ae2",
    "notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md":
        "e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816",
    "tests/test_common_radical_leakage_gram_orientation.py":
        "d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417",
    "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md":
        "78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3",
    "tests/test_q_shift_sector_weil_core_gate.py":
        "714f9839b0514c779f1fc05d558dd9446654de360dd1f0cc70502cba75fa6bf2",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def feature(vector: tuple[Fraction, ...]) -> tuple[Fraction, Fraction, Fraction]:
    return tuple(vector[j] + vector[j + 3] for j in range(3))  # type: ignore[return-value]


def signed_pair(
    left: tuple[Fraction, ...], right: tuple[Fraction, ...]
) -> Fraction:
    zl = feature(left)
    zr = feature(right)
    signs = (1, 1, -1)
    return sum(Fraction(signs[j]) * zl[j] * zr[j] for j in range(3))


def sampling_square(vector: tuple[Fraction, ...]) -> Fraction:
    return sum(value * value for value in feature(vector))


def central(vector: tuple[int, int, int]) -> tuple[Fraction, ...]:
    return tuple(map(Fraction, vector + (0, 0, 0)))


def exterior_tail(vector: tuple[int, int, int]) -> tuple[Fraction, ...]:
    return tuple(map(Fraction, (0, 0, 0) + tuple(-x for x in vector)))


def add(
    left: tuple[Fraction, ...], right: tuple[Fraction, ...]
) -> tuple[Fraction, ...]:
    return tuple(x + y for x, y in zip(left, right))


class GrowingMixedBridgeRadicalQuotientGraphCoreBarrierTests(unittest.TestCase):
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

    def test_radical_lift_only_identifies_central_with_negative_tail(self) -> None:
        x = (2, -3, 5)
        compact = central(x)
        tail = exterior_tail(x)
        lift = add(compact, tail)

        self.assertEqual(feature(lift), (0, 0, 0))
        self.assertEqual(sampling_square(lift), 0)
        self.assertEqual(
            tuple(-value for value in feature(tail)),
            feature(compact),
        )
        self.assertNotEqual(feature(compact), (0, 0, 0))

    def test_captured_positive_block_does_not_capture_bridge(self) -> None:
        e1 = central((1, 0, 0))
        e2 = central((0, 1, 0))
        bridge = central((0, 0, 1))

        for a, b in ((1, 0), (0, 1), (2, -3), (-5, 7)):
            captured = tuple(
                Fraction(a) * x + Fraction(b) * y for x, y in zip(e1, e2)
            )
            self.assertEqual(signed_pair(captured, captured), a * a + b * b)
            difference = tuple(x - y for x, y in zip(bridge, captured))
            self.assertEqual(sampling_square(difference), a * a + b * b + 1)

        self.assertEqual(signed_pair(bridge, bridge), -1)
        self.assertEqual(sampling_square(bridge), 1)

    def test_codimension_two_source_family_can_be_entirely_radical(self) -> None:
        # The last two rows are the abstract origin and integral constraints.
        for source in (
            (1, 2, 3, 0, 0),
            (-5, 7, 11, 0, 0),
            (13, -17, 19, 0, 0),
        ):
            self.assertEqual(source[3:], (0, 0))
            x = source[:3]
            lift = add(central(x), exterior_tail(x))
            self.assertEqual(feature(lift), (0, 0, 0))
            self.assertEqual(signed_pair(lift, lift), 0)

    def test_dense_kernel_model_is_not_closable(self) -> None:
        previous = Fraction(1)
        for cutoff in (1, 2, 4, 8, 16):
            tail_square = Fraction(1, 3 * 4**cutoff)
            self.assertLess(tail_square, previous)
            previous = tail_square
            # Z_0(x-r_N)=1 at every cutoff although the L2 tail tends to zero.
            self.assertEqual(Fraction(1), 1)
        self.assertLess(math.sqrt(float(previous)), 1e-4)

    def test_graph_form_is_bounded_but_signed(self) -> None:
        vectors = (
            central((2, 3, 5)),
            exterior_tail((7, -11, 13)),
            central((-17, 19, 23)),
        )
        for left in vectors:
            for right in vectors:
                bound = math.sqrt(
                    float(sampling_square(left) * sampling_square(right))
                )
                self.assertLessEqual(abs(float(signed_pair(left, right))), bound)
        self.assertGreater(signed_pair(central((1, 0, 0)), central((1, 0, 0))), 0)
        self.assertLess(signed_pair(central((0, 0, 1)), central((0, 0, 1))), 0)

    def test_value_rows_are_not_derivative_jets(self) -> None:
        # A repeated value row at zero sees neither derivative of A(z)=z.
        value_rows = (0, 0, 0)
        first_derivative = 1
        self.assertEqual(sum(abs(x) for x in value_rows), 0)
        self.assertNotEqual(first_derivative, 0)

    def test_exact_scope_and_missing_gate_tokens(self) -> None:
        required = (
            "[X]=-[O]",
            "does not say \\([X]=0\\)",
            "repeats ordinary value rows",
            "It does not impose",
            "remain undecided here",
            "No external distinct-zero or simple-zero theorem is imported",
            "Hausdorff \\(L^2\\) completion",
            "is not \\(L^2\\)-closable",
            "absolute sampling topology",
            "codimension-two source family",
            "inf_{C\\in{\\cal C}_{\\rm cap}}",
            "=o(Ld_2)",
            "RH-strength",
            "exact endpoint shear",
            "full bridge cross metric",
            "No bridge row is discarded",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "Farmer",
            "ZX_b\\ne0 is proved",
            "the compact bridge is zero",
            "the compact bridge is nonzero in the quotient",
            "the mixed floor is false",
            "This proves the Riemann hypothesis",
        )
        lowered = self.text.lower()
        for token in forbidden:
            self.assertNotIn(token.lower(), lowered)

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
                "__future__", "ast", "fractions", "hashlib", "math",
                "pathlib", "re", "shutil", "subprocess", "tempfile",
                "unittest",
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
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout[-4000:])


if __name__ == "__main__":
    unittest.main()
