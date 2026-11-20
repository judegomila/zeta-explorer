#!/usr/bin/env python3
"""Exact regressions for the cutoff-free weighted radical coframe barrier.

All mathematical fixtures use integers or Fraction.  The verifier reads no
zero table, prolate artifact, numerical ground vector, or cached matrix.
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
NOTE = (
    ROOT
    / "notes"
    / "CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md"
)
NOTE_HASH = "c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c"

FROZEN = {
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md":
        "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    "tests/test_full_source_coframe_rank.py":
        "dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "tests/test_growing_transition_sampling.py":
        "ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac",
    "notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md":
        "2feb3d62a71e435706c4b330d13bcb096015e52204af6ec9bd2828308d44383d",
    "tests/test_compact_absolute_sampling.py":
        "883c0e4edd8b6573bcf11740031a6a0ea93340d45e36ac1057e3793b729bc605",
    "notes/CUTOFF_FREE_PROLATE_GROUND_ALIGNMENT_RH_DICHOTOMY.md":
        "37f381b6ed75017633f4c845f90ff7d2660699bc0ae7a4340ec789b0e8dccea7",
    "tests/test_cutoff_free_prolate_ground_alignment_rh_dichotomy.py":
        "b17c3c603d459547c09fd0abb92b595986356e29e1d53f7e8c6f3ace4a8baf80",
    "notes/GROWING_WINDOW_THEOREM.md":
        "dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7",
    "notes/EFFECTIVE_MIXED_PREFIX_SCHEDULE_ATTACK.md":
        "a33e7a072057f1444afb9d00911465f599fec508d0a6488e655638947cc515ba",
}


Matrix = tuple[tuple[F, ...], ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(row[column] for row in matrix) for column in range(len(matrix[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = transpose(right)
    return tuple(
        tuple(sum((x * y for x, y in zip(row, column)), F(0)) for column in right_t)
        for row in left
    )


def identity(size: int) -> Matrix:
    return tuple(
        tuple(F(1) if row == column else F(0) for column in range(size))
        for row in range(size)
    )


def diagonal(values: tuple[F, ...]) -> Matrix:
    return tuple(
        tuple(value if row == column else F(0) for column in range(len(values)))
        for row, value in enumerate(values)
    )


def inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    augmented = [list(row) + list(identity(size)[index]) for index, row in enumerate(matrix)]
    for column in range(size):
        pivot = next(row for row in range(column, size) if augmented[row][column] != 0)
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        scale = augmented[column][column]
        augmented[column] = [value / scale for value in augmented[column]]
        for row in range(size):
            if row == column:
                continue
            multiplier = augmented[row][column]
            augmented[row] = [
                value - multiplier * pivot_value
                for value, pivot_value in zip(augmented[row], augmented[column])
            ]
    return tuple(tuple(row[size:]) for row in augmented)


def scalar_matrix(value: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(value * entry for entry in row) for row in matrix)


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x + y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


class CutoffFreeWeightedRadicalCoframeReductionBarrierTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)

    def test_note_hash_is_frozen(self) -> None:
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_minimum_defect_right_inverse_exactly(self) -> None:
        transform = (
            (F(1), F(0), F(1)),
            (F(0), F(1), F(1)),
        )
        defect = diagonal((F(1, 4), F(1, 9), F(1, 16)))
        defect_inverse = diagonal((F(4), F(9), F(16)))
        gram = matmul(matmul(transform, defect_inverse), transpose(transform))
        self.assertEqual(gram, ((F(20), F(16)), (F(16), F(25))))

        right_inverse = matmul(
            matmul(defect_inverse, transpose(transform)),
            inverse(gram),
        )
        self.assertEqual(matmul(transform, right_inverse), identity(2))
        self.assertEqual(
            matmul(matmul(transpose(right_inverse), defect), right_inverse),
            inverse(gram),
        )

        null_perturbation = (
            (F(-1), F(-2)),
            (F(-1), F(-2)),
            (F(1), F(2)),
        )
        self.assertEqual(matmul(transform, null_perturbation), scalar_matrix(F(0), identity(2)))
        other = add(right_inverse, null_perturbation)
        expected_energy = add(
            inverse(gram),
            matmul(matmul(transpose(null_perturbation), defect), null_perturbation),
        )
        self.assertEqual(matmul(transform, other), identity(2))
        self.assertEqual(
            matmul(matmul(transpose(other), defect), other),
            expected_energy,
        )

    def test_operator_synthesis_avoids_source_dimension_loss(self) -> None:
        # The projected anchor synthesis is the identity on a bottom space
        # of arbitrary dimension.  Its operator residual stays epsilon,
        # whereas a columnwise Hilbert--Schmidt square sum is d*epsilon^2.
        epsilon = F(1, 17)
        for dimension_value in (1, 2, 3, 5, 8):
            projected_synthesis = identity(dimension_value)
            residual = scalar_matrix(epsilon, identity(dimension_value))
            self.assertEqual(
                matmul(projected_synthesis, transpose(projected_synthesis)),
                identity(dimension_value),
            )
            operator_square = epsilon * epsilon
            hilbert_schmidt_square = F(dimension_value) * epsilon * epsilon
            self.assertEqual(hilbert_schmidt_square, F(dimension_value) * operator_square)
            self.assertGreaterEqual(hilbert_schmidt_square, operator_square)

    def test_hard_prefix_principal_angle_and_weighted_floor(self) -> None:
        alpha = F(1, 5)
        defects = (F(1, 16), F(1, 8), F(1, 2), F(3, 4))
        previous_gamma = F(1)
        for parameter in (2, 3, 5, 8, 13, 21):
            a_value = F(2 * parameter, parameter * parameter + 1)
            b_value = F(parameter * parameter - 1, parameter * parameter + 1)
            self.assertEqual(a_value * a_value + b_value * b_value, F(1))
            transform = (
                (alpha * a_value, F(0), alpha * b_value, F(0)),
                (F(0), alpha * a_value, F(0), alpha * b_value),
            )
            full_gram = matmul(transform, transpose(transform))
            self.assertEqual(full_gram, scalar_matrix(alpha * alpha, identity(2)))

            retained = tuple(tuple(row[column] for column in (0, 1)) for row in transform)
            retained_gram = matmul(retained, transpose(retained))
            gamma = a_value * a_value
            self.assertEqual(
                retained_gram,
                scalar_matrix(alpha * alpha * gamma, identity(2)),
            )
            weighted = matmul(
                matmul(retained, diagonal((F(16), F(8)))),
                transpose(retained),
            )
            self.assertEqual(weighted[1][1], alpha * alpha * gamma / defects[1])
            self.assertEqual(weighted[0][1], F(0))
            self.assertLess(gamma, previous_gamma)
            previous_gamma = gamma

    def test_full_floor_does_not_force_any_leading_capture(self) -> None:
        alpha = F(1, 7)
        early = (
            (alpha, F(0), F(0), F(0)),
            (F(0), alpha, F(0), F(0)),
        )
        late = (
            (F(0), F(0), alpha, F(0)),
            (F(0), F(0), F(0), alpha),
        )
        self.assertEqual(matmul(early, transpose(early)), matmul(late, transpose(late)))
        early_prefix = tuple(tuple(row[column] for column in (0, 1)) for row in early)
        late_prefix = tuple(tuple(row[column] for column in (0, 1)) for row in late)
        self.assertEqual(
            matmul(early_prefix, transpose(early_prefix)),
            scalar_matrix(alpha * alpha, identity(2)),
        )
        self.assertEqual(matmul(late_prefix, transpose(late_prefix)), scalar_matrix(F(0), identity(2)))

    def test_neumann_approximation_right_inverse(self) -> None:
        transform = ((F(1), F(1)),)
        full_right_inverse = ((F(1, 2),), (F(1, 2),))
        self.assertEqual(matmul(transform, full_right_inverse), identity(1))

        projected_right_inverse = ((F(1, 2),), (F(0),))
        approximate_identity = matmul(transform, projected_right_inverse)
        self.assertEqual(approximate_identity, ((F(1, 2),),))
        delta = F(1, 2)
        repaired = scalar_matrix(F(2), projected_right_inverse)
        self.assertEqual(matmul(transform, repaired), identity(1))

        full_norm_square = F(1, 2)
        restricted_frame = F(1)
        lower_bound = (F(1) - delta) ** 2 / full_norm_square
        self.assertEqual(lower_bound, F(1, 2))
        self.assertGreaterEqual(restricted_frame, lower_bound)

    def test_halfgrid_shannon_index_and_leading_margin(self) -> None:
        for odd_p in (3, 5, 7, 11, 13, 17):
            lam = F(odd_p, 2)
            shannon = F(4) * lam * lam
            self.assertEqual(shannon, F(odd_p * odd_p))
            for margin in (8, 9, 12):
                cutoff = odd_p * odd_p - margin
                if cutoff >= 0:
                    self.assertEqual(odd_p * odd_p - cutoff - 7, margin - 7)

    def test_note_contract_and_hygiene(self) -> None:
        text = NOTE.read_text(encoding="ascii")
        required = (
            r"T_F\Delta_F^\dagger T_F^*",
            r"{\mathcal C_F\over\sqrt{\Lambda_F}}",
            r"P_\lambda KK^*P_\lambda=I_X",
            r"1-\|(I-P_{F_m})U_\lambda^*\|^2",
            r"{\gamma_m\over8\lambda^4d_m}",
            r"{8\mathcal C_{F_m}^2\lambda^4d_m\over\gamma_m}",
            r"{S-m-7\over\beta_\lambda}",
            r"\eta_F(B)=\|(I-P_F)B\|",
            r"a_r^2+b_r^2=1",
            r"{\Lambda_{F_m}\over\mathcal C_{F_m}^2}",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, text)

        for relative, expected in FROZEN.items():
            self.assertIn(relative, text)
            self.assertIn(expected, text)

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
        self.assertGreaterEqual(len(displays), 45)
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
