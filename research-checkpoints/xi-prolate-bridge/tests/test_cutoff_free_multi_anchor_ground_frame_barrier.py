#!/usr/bin/env python3
"""Exact regressions for the cutoff-free multi-anchor ground-frame barrier.

All mathematical fixtures use integers or Fraction.  The verifier reads no
zero table, numerical ground vector, cached matrix, or network resource.
"""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md"
NOTE_HASH = "2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d"

FROZEN = {
    "vendor/CCM-ZST-2511.22755v1.pdf":
        "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
    "notes/CUTOFF_FREE_PROLATE_GROUND_ALIGNMENT_RH_DICHOTOMY.md":
        "37f381b6ed75017633f4c845f90ff7d2660699bc0ae7a4340ec789b0e8dccea7",
    "tests/test_cutoff_free_prolate_ground_alignment_rh_dichotomy.py":
        "b17c3c603d459547c09fd0abb92b595986356e29e1d53f7e8c6f3ace4a8baf80",
    "notes/GROWING_RETAINED_NEGATIVE_INDEX_CAPTURE_BARRIER.md":
        "9fc64fedde255791775861e7a3bb2b2d55eab1a3d402cf8b842d9e0d8519424c",
    "tests/test_growing_retained_negative_index_capture_barrier.py":
        "1e6067e8e4795eac284a8efc12bfc235ff7a6590efce28428b4569320257c4aa",
    "notes/PHASE_VOLUME_SCALE_AUDIT.md":
        "bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd",
    "notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md":
        "ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f",
    "tests/test_compressed_multiplier_trace.py":
        "ff7740f0e07db3674693a92e888935578036e4a745768bf47b10aea2c6a76f9c",
    "notes/GROWING_WINDOW_THEOREM.md":
        "dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md":
        "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    "tests/test_full_source_coframe_rank.py":
        "dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a",
    "notes/NATURAL_CENTERED_GATE_ANCHOR_COFACTOR_NONEMPTYNESS_REDUCTION_BARRIER.md":
        "88f6ffa991547f5ca88aacce893a585f3047d7675200288cd18a57cbbcfb7699",
    "tests/test_natural_centered_gate_anchor_cofactor_nonemptiness_reduction_barrier.py":
        "b57ad035543d21e4d6746bb58c19764171706ecc613932f850ea71e6857186bb",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: tuple[F, ...], right: tuple[F, ...]) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def norm_square(vector: tuple[F, ...]) -> F:
    return dot(vector, vector)


def diagonal_action(
    diagonal: tuple[F, ...], vector: tuple[F, ...]
) -> tuple[F, ...]:
    return tuple(value * coordinate for value, coordinate in zip(diagonal, vector))


def subtract(left: tuple[F, ...], right: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(x - y for x, y in zip(left, right))


def scale(value: F, vector: tuple[F, ...]) -> tuple[F, ...]:
    return tuple(value * coordinate for coordinate in vector)


class CutoffFreeMultiAnchorGroundFrameBarrierTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)

    def test_note_hash_is_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_multi_anchor_projector_inequality_with_multiple_bottom(self) -> None:
        diagonal = (F(-2), F(-2), F(3), F(7))
        columns = (
            (F(1), F(2), F(3), F(0)),
            (F(2), F(-1), F(0), F(1)),
        )
        targets = (F(1), F(-1))
        mu = F(-2)
        q_star = max(abs(value) for value in targets)

        total_rho = F(0)
        projected_residual_square = F(0)
        total_residual_square = F(0)
        for column, target in zip(columns, targets):
            action = diagonal_action(diagonal, column)
            residual = subtract(action, scale(target, column))
            projected = residual[:2] + (F(0), F(0))
            rho = norm_square(column[:2])

            self.assertEqual(projected, scale(mu - target, column[:2]) + (F(0), F(0)))
            total_rho += rho
            projected_residual_square += norm_square(projected)
            total_residual_square += norm_square(residual)

        lower = max(F(0), abs(mu) - q_star) ** 2 * total_rho
        self.assertEqual(total_rho, F(10))
        self.assertEqual(projected_residual_square, F(50))
        self.assertLessEqual(lower, projected_residual_square)
        self.assertLessEqual(projected_residual_square, total_residual_square)

    def test_multi_anchor_bound_has_an_exact_equality_case(self) -> None:
        diagonal = (F(-2), F(-2))
        columns = ((F(1), F(0)), (F(0), F(1)))
        total_residual_square = sum(
            (norm_square(diagonal_action(diagonal, column)) for column in columns),
            F(0),
        )
        total_rho = sum((norm_square(column) for column in columns), F(0))
        self.assertEqual(total_residual_square, F(8))
        self.assertEqual(abs(diagonal[0]) ** 2 * total_rho, total_residual_square)

    def test_residual_weighted_family_can_close_below_constant_overlap(self) -> None:
        previous_ratio = F(1)
        for size in (2, 3, 5, 8, 13, 21, 34):
            # M=size columns, each residual norm size^(-3), and total ground
            # weight size^(-2).  The exact ratio is size^(-3).
            residual_square_sum = F(size, size**6)
            total_ground_weight = F(1, size**2)
            ratio = residual_square_sum / total_ground_weight
            self.assertEqual(ratio, F(1, size**3))
            self.assertLess(ratio, previous_ratio)
            previous_ratio = ratio

    def test_rank_one_load_compression_and_resolvent_residue(self) -> None:
        # Q=diag(0,0,3), kappa=(3/5,0,4/5).  Compression of the negative
        # rank-one load to the two-dimensional bottom has sole nonzero
        # eigenvalue rho=9/25.
        rho = F(9, 25)
        self.assertEqual(F(3, 5) ** 2, rho)

        previous_error = F(1)
        for denominator in (1, 2, 3, 5, 8, 13, 21):
            z = -F(1, denominator)
            residue_approximation = (-z) * (
                rho / (-z) + F(16, 25) / (F(3) - z)
            )
            error = residue_approximation - rho
            self.assertEqual(error, F(16, 25 * (3 * denominator + 1)))
            self.assertGreater(error, F(0))
            self.assertLess(error, previous_error)
            previous_error = error

    def test_full_projector_retains_the_odd_ground_blind_spot(self) -> None:
        # First coordinate is even, second is odd.  A strictly odd bottom
        # annihilates the even anchor; at a collision the even summand returns.
        even_anchor = (F(1), F(0))
        odd_bottom_projector = (F(0), F(1))
        collision_projector = even_anchor
        self.assertEqual(dot(even_anchor, odd_bottom_projector), F(0))
        self.assertEqual(norm_square(collision_projector), F(1))

    def test_even_odd_translated_pair_is_the_parallelogram_identity(self) -> None:
        for left, right in ((F(2), F(3)), (F(-4), F(7)), (F(5, 3), F(-2, 9))):
            plus = left + right
            minus = left - right
            self.assertEqual(plus * plus + minus * minus, F(2) * (left * left + right * right))

    def test_translation_cyclicity_has_no_uniform_frame_floor(self) -> None:
        # The two-character translation group has phases +1 and -1.  Its
        # exact translation average is the two-mode instance of (5.2).
        previous_floor = F(1)
        for index in (2, 3, 5, 8, 13, 21):
            anchor = (F(1), F(1, index))
            ground = (F(0), F(1))
            correlation_zero = anchor[0] * ground[0] + anchor[1] * ground[1]
            correlation_one = anchor[0] * ground[0] - anchor[1] * ground[1]
            average = (correlation_zero**2 + correlation_one**2) / 2
            expected = anchor[0] ** 2 * ground[0] ** 2 + anchor[1] ** 2 * ground[1] ** 2
            self.assertEqual(average, expected)
            self.assertGreater(average, F(0))
            self.assertLess(average, previous_floor)
            previous_floor = average

    def test_halfgrid_shannon_index_is_exactly_p_squared(self) -> None:
        for odd_p in (3, 5, 7, 11, 13, 17):
            lam = F(odd_p, 2)
            self.assertEqual(F(4) * lam * lam, F(odd_p * odd_p))

    def test_note_contract_and_hygiene(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            r"\sum_jr_{\lambda,j}^2",
            r"\sum_j\rho_{\lambda,j}",
            r"{\|E_\lambda\|\over\sqrt{c_\lambda}}",
            r"-m_\kappa'(0+)",
            r"\operatorname {tr}\!\left(",
            "K_s^+",
            "K_s^-",
            r"\min_{|n|\leq R}\sum_a|\kappa_{a,n}|^2",
            r"\Phi_\lambda(U_Z,g)\ll{\lambda^2\over\log\lambda}",
            r"{2c\over\pi}=4\lambda^2",
            r"b_n=B\sin{\pi n\over2}",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, text)

        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        self.assertNotIn("\r", text)
        self.assertNotIn("\t", text)
        arrow_command = "long" + "rightarrow"
        for match in re.finditer(arrow_command, text):
            self.assertGreater(match.start(), 0)
            self.assertEqual(text[match.start() - 1], "\\")
        self.assertIsNone(re.search(r"[ \t]+$", text, flags=re.MULTILINE))
        self.assertNotIn("TO_BE_FROZEN", text)

        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))
        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        text = NOTE.read_text(encoding="ascii")
        displays = re.findall(r"\\\[(.*?)\\\]", text, flags=re.S)
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

    def test_verifier_has_no_binary_float_literals(self) -> None:
        tree = ast.parse(Path(__file__).read_text(encoding="utf-8"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])


if __name__ == "__main__":
    unittest.main()
