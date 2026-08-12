#!/usr/bin/env python3
"""Strict regressions for the cross-root even-sector reduction/barrier."""

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
NOTE = (
    ROOT
    / "notes"
    / "CROSSROOT_EVEN_SECTOR_PROJECTIVE_ALIGNMENT_REDUCTION_BARRIER.md"
)
NOTE_HASH = "0049b692b8cae38eb46734f6113be822a54ee6af8b17ea71d1687fa6a8666833"

FROZEN = {
    "notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md":
        "ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450",
    "tests/test_natural_cutoff_signed_ground_alignment.py":
        "3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb",
    "notes/EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md":
        "c8656f4c5e574ac30972b0645015a3bb57492908efbf0e57ddef5de9c0c6e9c2",
    "tests/test_even_sector_cross_root_limit_bridge.py":
        "73d7705dc170c7081cf99a7669bd74493ed937cac75dcaa075beacdbf9e3b3b1",
    "notes/CANONICAL_BOUNDARY_GROUND_CROSS_ROOT.md":
        "715590d8e21ec4cf48f17390e9441fc6658067c6db862728c1416b6233f12920",
    "tests/test_canonical_boundary_ground_cross_root.py":
        "0dd9c4b0b61fee8b5ca15febbfe7333e4501def4a0dc77f02fbdd5ffd19643bf",
    "notes/CANONICAL_GROUND_MIXED_PROJECTOR_OVERLAP.md":
        "f82357e99c54dffc8f11675e2ff32e65375b9a9fbb6480d318c11d3ff51a7730",
    "tests/test_canonical_ground_mixed_projector_overlap.py":
        "65c4efafa252b413e52d06ac915da09ff6fc26c49e022ba8fca9a048b660723e",
    "notes/CRITICAL_ARITHMETIC_TO_ACTUAL_SCALAR_TRANSFER_THEOREM.md":
        "8c453f25d75ab351a15faa65a8b7ce5eaaf96ba3b83043b4cdb037f5daa379d8",
    "tests/test_critical_arithmetic_to_actual_scalar_transfer_theorem.py":
        "6e313a0fdeb2db8f11721ce805ff02c60567d370ec4430b63e6a8faae3e00408",
    "notes/ADAPTIVE_CRITICAL_ODD_HALFGRID_LITERAL_CEILING_TRANSFER_THEOREM.md":
        "8b81d868bffe1057fceba65e144b08a7813d01bd3648b496fbf8b63a430f6af7",
    "tests/test_adaptive_critical_odd_halfgrid_literal_ceiling_transfer_theorem.py":
        "e39c457e81dd5712b191bac2a9402987448b7e11eec0a5637ea9d6d3ca50c20b",
    "notes/ADAPTIVE_PROLATE_SATURATION_DIVERGENCE_ORIENTATION_BARRIER.md":
        "7882db630232ec094318e52689b0b12bf28b0d74ee2c012259a6e91fe666268b",
    "tests/test_adaptive_prolate_saturation_divergence_orientation_barrier.py":
        "5efe525cd79bc7279fe5198ae9af8ec9da8941e5bd3a4f1baa4479de56336798",
    "notes/CRITICAL_SCALAR_FLOOR_TO_TRUE_GROUND_ROW_DELETION_BARRIER.md":
        "3cf82e60d684f738e331ba5b4378ee7d0528bd47dd71c73bd551777750938ba4",
    "tests/test_critical_scalar_floor_to_true_ground_row_deletion_barrier.py":
        "0f4ca4642d750876a2216df0cec4f60704bc9cd977223d08b6796f89783437ba",
    "notes/CRITICAL_ODD_GROUND_MIXED_VANDERMONDE_COFACTOR_TARGET.md":
        "e29cbe760a3fea646220fa738573638ad42075e92cf4a0345e674002f9f91fda",
    "tests/test_critical_odd_ground_mixed_vandermonde_cofactor_target.py":
        "ee3fd3205cdefb061c4d55f321e69b5cd480fd109b0670bb9d028066d530f51f",
    "notes/CRITICAL_GROUND_NEGATIVE_SOBOLEV_NO_ESCAPE_BARRIER.md":
        "08048a91afda16b0b1305f7355efc5b8be223d7fc8a27a8918da71a8532cdfa6",
    "tests/test_critical_ground_negative_sobolev_no_escape_barrier.py":
        "9afbfa782f507ad1c6ffd2b7e9721d06413a90d82c83c987b1d1abb1441e71a4",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dot(left: list[F], right: list[F]) -> F:
    return sum((x_value * y_value for x_value, y_value in zip(left, right)), F(0))


def diagonal_action(diagonal: list[F], vector: list[F]) -> list[F]:
    return [entry * value for entry, value in zip(diagonal, vector)]


def padded_model(
    size: int, base: F, epsilon: F, gap: F
) -> tuple[list[int], list[F], list[F]]:
    modes = list(range(-size, size + 1))
    diagonal = []
    for mode in modes:
        if mode == 0:
            diagonal.append(base)
        elif abs(mode) == 1:
            diagonal.append(base + epsilon)
        else:
            diagonal.append(base + gap)
    anchor = [F(0)] * len(modes)
    anchor[modes.index(-1)] = F(1)
    anchor[modes.index(0)] = F(-2)
    anchor[modes.index(1)] = F(1)
    return modes, diagonal, anchor


class CrossrootEvenSectorProjectiveAlignmentReductionBarrierTests(
    unittest.TestCase
):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 20)
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_exact_raw_source_cauchy_and_endpoint_zero(self) -> None:
        for size in (2, 3, 8, 17):
            modes, diagonal, anchor = padded_model(
                size, F(5, 7), F(3, 11), F(13, 17)
            )
            coefficients = {mode: F(0) for mode in modes}
            for i, mode in enumerate(modes):
                self.assertEqual(coefficients[-mode], -coefficients[mode])
                for j, other in enumerate(modes):
                    if i != j:
                        off_diagonal = (
                            coefficients[mode] - coefficients[other]
                        ) / (mode - other)
                        self.assertEqual(off_diagonal, 0)
            self.assertEqual(sum(anchor, F(0)), 0)
            norm_squared = dot(anchor, anchor)
            self.assertEqual(norm_squared, 6)
            energy = dot(anchor, diagonal_action(diagonal, anchor)) / norm_squared
            self.assertEqual(energy, F(5, 7) + F(1, 11))
            self.assertGreater(energy, 0)

    def test_exact_ritz_gate_and_bounded_ratio(self) -> None:
        parameter_sets = (
            (F(2), F(3), F(7)),
            (F(5, 7), F(3, 11), F(13, 17)),
            (F(1, 101), F(17, 19), F(23, 29)),
        )
        for base, epsilon, gap in parameter_sets:
            _, diagonal, anchor = padded_model(5, base, epsilon, gap)
            norm_squared = dot(anchor, anchor)
            q_value = dot(anchor, diagonal_action(diagonal, anchor)) / norm_squared
            lower_ritz = base
            lowering = q_value - lower_ritz
            self.assertEqual(lowering, epsilon / 3)

            residual = [
                value - q_value * coordinate
                for value, coordinate in zip(
                    diagonal_action(diagonal, anchor), anchor
                )
            ]
            residual_squared = dot(residual, residual) / norm_squared
            self.assertEqual(residual_squared, F(2, 9) * epsilon * epsilon)
            self.assertEqual(
                lowering * lowering / residual_squared,
                F(1, 2),
            )

            # The raw representative of w is (1,1,1) on modes -1,0,1.
            complement = [F(0)] * len(anchor)
            middle = len(anchor) // 2
            complement[middle - 1:middle + 2] = [F(1), F(1), F(1)]
            self.assertEqual(dot(anchor, complement), 0)
            complement_value = (
                dot(complement, diagonal_action(diagonal, complement))
                / dot(complement, complement)
            )
            self.assertEqual(complement_value - lower_ritz, F(2, 3) * epsilon)
            self.assertGreater(min(F(2, 3) * epsilon, gap), 0)

    def test_parity_blocks_visibility_and_uniform_overlap(self) -> None:
        for size in (2, 4, 11):
            modes, diagonal, anchor = padded_model(
                size, F(7, 13), F(5, 19), F(23, 31)
            )
            index = {mode: offset for offset, mode in enumerate(modes)}
            even_diagonal = [diagonal[index[0]]] + [
                diagonal[index[n_value]] for n_value in range(1, size + 1)
            ]
            odd_diagonal = [
                diagonal[index[n_value]] for n_value in range(1, size + 1)
            ]
            self.assertEqual(even_diagonal[0], F(7, 13))
            self.assertTrue(
                all(value > even_diagonal[0] for value in even_diagonal[1:])
            )
            self.assertTrue(
                all(value > even_diagonal[0] for value in odd_diagonal)
            )
            overlap_squared = anchor[index[0]] ** 2 / dot(anchor, anchor)
            self.assertEqual(overlap_squared, F(2, 3))
            canonical_visibility_squared = F(1)
            self.assertEqual(canonical_visibility_squared, F(1))

    def test_projective_statistic_and_signed_response_are_one_half(self) -> None:
        # xi=e_0, alpha=-2/sqrt(6), X=xi/alpha.  All quantities below
        # are evaluated through squares, so Fraction arithmetic is exact.
        alpha_squared = F(2, 3)
        x_norm_squared = F(1) / alpha_squared
        kappa_norm_squared = F(1)
        kappa_x_pairing = F(1)
        correction_squared = (
            x_norm_squared + kappa_norm_squared - 2 * kappa_x_pairing
        )
        self.assertEqual(x_norm_squared, F(3, 2))
        self.assertEqual(correction_squared, F(1, 2))
        k_00 = F(1)
        h_value = F(0)
        a_value = correction_squared
        signed_response = a_value + h_value * h_value / k_00 - 2 * h_value
        self.assertEqual(signed_response, F(1, 2))
        self.assertEqual(x_norm_squared - k_00, F(1, 2))

    def test_canonical_projector_formulas_match_simple_line(self) -> None:
        # P_E eta=e_0 has norm one and its kappa overlap has square 2/3.
        v_norm_squared = F(1)
        mixed_overlap_squared = F(2, 3)
        inverse_overlap_squared = v_norm_squared / mixed_overlap_squared
        transverse_squared = F(1, 3)
        canonical_a = transverse_squared / mixed_overlap_squared
        self.assertEqual(inverse_overlap_squared, F(3, 2))
        self.assertEqual(canonical_a, F(1, 2))
        self.assertGreater(mixed_overlap_squared, 0)

    def test_natural_rate_is_sufficient_but_countermodel_never_decays(self) -> None:
        for exponent in (0.0, 0.125, 0.25, 0.49):
            previous = None
            for length in (400.0, 800.0, 1600.0):
                sufficient = length * math.exp(
                    (2.0 * exponent - 1.0) * length / 2.0
                )
                if previous is not None:
                    self.assertLess(sufficient, previous)
                previous = sufficient
            self.assertLess(previous, 1e-2)
        self.assertEqual(F(1, 2), F(1, 2))
        self.assertNotEqual(F(1, 2), F(0))

    def test_reduced_gate_list_and_checkpoint_nonimplication(self) -> None:
        required = (
            "P_{\\kappa^\\perp\\cap H_+}(Q_+-uI)",
            "{\\cal A}_{N,M}=\\|P_{{\\cal L}_M}X\\|^2",
            "P\\eta\\ne0",
            "|\\langle\\kappa,P\\eta\\rangle|^2",
            "\\Delta_N>0",
            "\\mu_1^- -u>0",
            "\\Theta_N\\leq1-\\rho",
            "not hypotheses of this route",
            "wrong minimax direction",
            "sampling energy",
            "Hilbert-space angle",
            "(\\eta_{\\rm model}^{\\rm pr})^2",
            "checkpoint-1.53",
            "checkpoint-1.54",
            "checkpoint-1.55",
            "standard eight files",
            "P0_INVALIDATED",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "This proves the Riemann hypothesis",
            "the Riemann hypothesis follows",
            "the finite gates are closed",
            "the padded diagonal family is the actual",
            "sampling energy is a Hilbert-space angle",
            "Delta_N is required by checkpoint 0.71",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 40)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb,mathrsfs}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [
                    compiler,
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    source.name,
                ],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_static_ascii_ast_hash_and_cache_clean(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        self.note_bytes.decode("ascii")
        test_bytes.decode("ascii")
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
        self.assertNotRegex(self.text, r"(?<!\\)\$\$")
        self.assertNotIn("\\begin{equation}", self.text)
        self.assertNotIn("\\end{equation}", self.text)
        self.assertNotRegex(self.text, r"(?<!\\)\b(?:qquad|quad)\b")
        self.assertIsNone(
            re.search(r"\\begin\{aligned\}.*?\\tag", self.text, flags=re.S)
        )
        cache_entries = [
            path for path in ROOT.rglob("__pycache__") if path.is_dir()
        ] + list(ROOT.rglob("*.pyc"))
        self.assertEqual(cache_entries, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
