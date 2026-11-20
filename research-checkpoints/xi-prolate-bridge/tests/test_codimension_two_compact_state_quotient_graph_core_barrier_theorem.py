#!/usr/bin/env python3
"""Regressions for the codimension-two compact-state quotient barrier."""

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
    / "CODIMENSION_TWO_COMPACT_STATE_QUOTIENT_GRAPH_CORE_BARRIER_THEOREM.md"
)
NOTE_HASH = "8e912879ce4d445a1b3448bbb15229cbd9e7d570bcb7b0193edf99d621e596b6"

FROZEN = {
    "notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md":
        "335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb",
    "tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py":
        "0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc",
    "notes/MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md":
        "4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2",
    "tests/test_mixed_bridge_xi_over_s_boundary_obstruction_theorem.py":
        "1bc81194a9fa2fd4eac92491a08c60bc58f3640ac16e4e5e17864da8a2970c67",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md":
        "3d6428991a0e66e1c2752c8eec76375576e6f94f68a65891cd3215495e6d4e61",
    "notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md":
        "544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c",
    "notes/GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md":
        "a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459",
    "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md":
        "78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3",
    "notes/FIXED_LAMBDA_GALERKIN_ALIGNMENT_NO_GO.md":
        "a809f361f3939c2f309ad7030b8ef5abd5cf321b443d513d7d0c7087a7f38d34",
    "notes/UNIFORM_PROLATE_JACOBI_TAIL_AND_SCHEDULE_AUDIT.md":
        "f029b40ca676ad557aa7b24ecfcee0dc54b4c98b8106d5bea415093892042826",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rank(rows: list[list[Fraction]]) -> int:
    matrix = [row[:] for row in rows]
    if not matrix:
        return 0
    row_count = len(matrix)
    column_count = len(matrix[0])
    pivot_row = 0
    for column in range(column_count):
        pivot = next(
            (index for index in range(pivot_row, row_count)
             if matrix[index][column]),
            None,
        )
        if pivot is None:
            continue
        matrix[pivot_row], matrix[pivot] = matrix[pivot], matrix[pivot_row]
        scale = matrix[pivot_row][column]
        matrix[pivot_row] = [entry / scale for entry in matrix[pivot_row]]
        for index in range(row_count):
            if index == pivot_row:
                continue
            factor = matrix[index][column]
            if factor:
                matrix[index] = [
                    left - factor * right
                    for left, right in zip(matrix[index], matrix[pivot_row])
                ]
        pivot_row += 1
        if pivot_row == row_count:
            break
    return pivot_row


class CodimensionTwoCompactStateQuotientBarrierTests(unittest.TestCase):
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

    def test_exact_invisible_retraction_and_downstream_equality(self) -> None:
        # Coordinates are three modal entries followed by the bump entry.
        integral = list(map(Fraction, (2, -3, 5, 0)))
        origin = list(map(Fraction, (7, 11, 13, 1)))
        state = [
            list(map(Fraction, (1, 2, -1, 0))),
            list(map(Fraction, (3, -4, 6, 0))),
        ]

        source = list(map(Fraction, (3, 2, 0, 0)))
        # Make the source zero-integral: 2*3-3*2=0.
        self.assertEqual(sum(a * b for a, b in zip(integral, source)), 0)
        value = sum(a * b for a, b in zip(origin, source))
        corrected = source[:]
        corrected[-1] -= value

        self.assertEqual(sum(a * b for a, b in zip(integral, corrected)), 0)
        self.assertEqual(sum(a * b for a, b in zip(origin, corrected)), 0)
        for row in state:
            self.assertEqual(
                sum(a * b for a, b in zip(row, corrected)),
                sum(a * b for a, b in zip(row, source)),
            )

        corrected_twice = corrected[:]
        second_value = sum(a * b for a, b in zip(origin, corrected_twice))
        corrected_twice[-1] -= second_value
        self.assertEqual(corrected_twice, corrected)

    def test_pure_modal_loss_and_augmented_corrected_dimension(self) -> None:
        q_value = 3
        modal_dimension = 2 * q_value + 2
        ambient_dimension = modal_dimension + 1
        integral = [Fraction((-1) ** index, index + 2)
                    for index in range(modal_dimension)]
        origin = [Fraction(2 * index + 3) for index in range(modal_dimension)]

        # A nullspace basis for the two modal rows using the first two
        # coordinates as anchors.
        determinant = integral[0] * origin[1] - integral[1] * origin[0]
        self.assertNotEqual(determinant, 0)
        g_basis: list[list[Fraction]] = []
        for index in range(2, modal_dimension):
            a_value = (
                integral[index] * origin[1] - integral[1] * origin[index]
            ) / determinant
            b_value = (
                integral[0] * origin[index] - origin[0] * integral[index]
            ) / determinant
            vector = [Fraction(0) for _ in range(ambient_dimension)]
            vector[index] = 1
            vector[0] = -a_value
            vector[1] = -b_value
            self.assertEqual(
                sum(integral[j] * vector[j] for j in range(modal_dimension)),
                0,
            )
            self.assertEqual(
                sum(origin[j] * vector[j] for j in range(modal_dimension)),
                0,
            )
            g_basis.append(vector)

        bridge = [Fraction(0) for _ in range(ambient_dimension)]
        bridge[1] = 1
        bridge[0] = -integral[1] / integral[0]
        bridge_value = sum(
            origin[j] * bridge[j] for j in range(modal_dimension)
        )
        self.assertNotEqual(bridge_value, 0)

        corrected_bridge = bridge[:]
        corrected_bridge[-1] = -bridge_value
        corrected_basis = g_basis + [corrected_bridge]
        self.assertEqual(rank(g_basis), 2 * q_value)
        self.assertEqual(rank(corrected_basis), 2 * q_value + 1)

        # The bump state column is zero, so bridge and corrected bridge have
        # exactly the same central state.
        central_row = [Fraction(index + 1) for index in range(modal_dimension)]
        central_row.append(Fraction(0))
        self.assertEqual(
            sum(a * b for a, b in zip(central_row, bridge)),
            sum(a * b for a, b in zip(central_row, corrected_bridge)),
        )

    def test_unbounded_tail_row_gives_small_origin_correction(self) -> None:
        # Synthetic coefficient model: the integral row is l2, while the
        # origin row is not.  Project the latter off the integral row on a
        # finite tail block.  The normalized origin response grows, so an
        # origin-one correction has norm tending to zero.
        previous_norm = float("inf")
        cutoff = 20
        for block_length in (20, 80, 320, 1280):
            integral = [1.0 / (index + 1.0)
                        for index in range(cutoff, cutoff + block_length)]
            origin = [1.0 for _ in integral]
            inner_vi = sum(a * b for a, b in zip(origin, integral))
            inner_ii = sum(value * value for value in integral)
            residual = [
                value - inner_vi * i_value / inner_ii
                for value, i_value in zip(origin, integral)
            ]
            self.assertAlmostEqual(
                sum(a * b for a, b in zip(integral, residual)),
                0.0,
                places=11,
            )
            response = sum(residual)
            norm = math.sqrt(sum(value * value for value in residual))
            self.assertAlmostEqual(response, norm * norm, places=9)
            correction_norm = norm / response
            self.assertLess(correction_norm, previous_norm)
            previous_norm = correction_norm

            defect = sum(
                value * value / (cutoff + local_index + 2.0)
                for local_index, value in enumerate(residual)
            ) / (response * response)
            self.assertLessEqual(defect, correction_norm * correction_norm)
        self.assertLess(previous_norm, 0.04)

    def test_scale_mismatch_between_bump_and_modal_bridge(self) -> None:
        for lam in (3.0, 5.0, 8.0, 12.0):
            log_bump = -math.log(lam)
            log_modal = 5.0 * math.log(lam) - 4.0 * math.pi * lam * lam
            self.assertGreater(log_bump, log_modal)
        self.assertGreater(
            -math.log(12.0) - (5.0 * math.log(12.0) - 4.0 * math.pi * 144.0),
            1700.0,
        )

    def test_scope_and_missing_gate_tokens(self) -> None:
        required = (
            "T_\\lambda R_\\lambda=T_\\lambda",
            "T_\\lambda(Z)=T_\\lambda(Z_0)",
            "same compact central-state range",
            "augmented corrected prefix",
            "pure modal `g_n` prefix",
            "\\dim G_Q=2Q",
            "\\dim Z_Q=2Q+1",
            "actual lost continuous physical direction",
            "non-effective index",
            "fixed-parameter",
            "D_\\lambda(q_k)\\longrightarrow0",
            "does not imply",
            "Plemelj/closability",
            "quantitative graph-norm approximation",
            "absolute zero-sampling norm",
            "not proved",
            "P0_INVALIDATED",
            "standard eight are unchanged",
        )
        for token in required:
            self.assertIn(token, self.text)

        forbidden = (
            "the bridge is eliminated from the floor proof",
            "drop the beta row",
            "L2 convergence implies graph convergence",
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
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
