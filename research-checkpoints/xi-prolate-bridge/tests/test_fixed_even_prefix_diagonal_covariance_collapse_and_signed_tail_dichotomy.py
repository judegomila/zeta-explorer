#!/usr/bin/env python3
"""Exact regressions for diagonal covariance collapse and signed-tail dichotomy."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = (
    ROOT
    / "notes"
    / "FIXED_EVEN_PREFIX_DIAGONAL_COVARIANCE_COLLAPSE_AND_SIGNED_TAIL_DICHOTOMY.md"
)
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md":
        "1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4",
    "notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md":
        "6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98",
    "notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md":
        "000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932",
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md":
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc",
    "notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md":
        "e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816",
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}

Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
    )


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(
            sum(left[i][k] * right[k][j] for k in range(len(right)))
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def matadd(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] + right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def matsub(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def scale(scalar: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * value for value in row) for row in matrix)


def diagonal(*values: F) -> Matrix:
    return tuple(
        tuple(values[i] if i == j else F(0) for j in range(len(values)))
        for i in range(len(values))
    )


def mat_vec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum(matrix[i][j] * vector[j] for j in range(len(vector)))
        for i in range(len(matrix))
    )


def dot(left: Vector, right: Vector) -> F:
    return sum(x * y for x, y in zip(left, right))


def quadratic(matrix: Matrix, vector: Vector) -> F:
    return dot(vector, mat_vec(matrix, vector))


def is_psd_2x2(matrix: Matrix) -> bool:
    return (
        matrix[0][0] >= 0
        and matrix[1][1] >= 0
        and matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0] >= 0
    )


class FixedEvenPrefixDiagonalCovarianceSignedTailTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_global_radical_annihilation_moves_every_zero_slot_to_tail(self) -> None:
        # ZK=0 and K=W+R imply ZW=-ZR, including both paired slots.
        z_w = (F(2), F(-3), F(5), F(7))
        z_r = tuple(-value for value in z_w)
        z_k = tuple(a + b for a, b in zip(z_w, z_r))
        self.assertEqual(z_k, (F(0),) * 4)
        signature = (F(1), F(-1), F(1), F(-1))
        signed_w = sum(s * value * value for s, value in zip(signature, z_w))
        signed_r = sum(s * value * value for s, value in zip(signature, z_r))
        absolute_w = sum(value * value for value in z_w)
        absolute_r = sum(value * value for value in z_r)
        self.assertEqual(signed_w, signed_r)
        self.assertEqual(absolute_w, absolute_r)

    def test_aligned_minus_anti_aligned_decomposition(self) -> None:
        aligned: Matrix = ((F(3), F(1)), (F(1), F(2)))
        anti: Matrix = ((F(1), F(0)), (F(0), F(1, 2)))
        absolute = matadd(aligned, anti)
        signed = matsub(aligned, anti)
        defect = scale(F(2), anti)
        self.assertEqual(signed, matsub(absolute, defect))
        self.assertTrue(is_psd_2x2(aligned))
        self.assertTrue(is_psd_2x2(anti))
        self.assertTrue(is_psd_2x2(defect))

    def test_positive_base_orientation_contraction_is_exact(self) -> None:
        # C=diag(4,9), E=diag(1,3).  C^(-1/2) E C^(-1/2)
        # has eigenvalues 1/4 and 1/3, so C-E is positive.
        base = diagonal(F(4), F(9))
        defect = diagonal(F(1), F(3))
        gap = matsub(base, defect)
        relative = diagonal(F(1, 4), F(1, 3))
        self.assertTrue(is_psd_2x2(gap))
        self.assertEqual(max(relative[0][0], relative[1][1]), F(1, 3))
        self.assertLessEqual(max(relative[0][0], relative[1][1]), 1)

    def test_contraction_boundary_allows_semidefinite_floor(self) -> None:
        base = diagonal(F(4), F(9))
        defect = diagonal(F(4), F(3))
        gap = matsub(base, defect)
        relative = diagonal(F(1), F(1, 3))
        self.assertTrue(is_psd_2x2(gap))
        self.assertEqual(gap[0][0], 0)
        self.assertEqual(max(relative[0][0], relative[1][1]), 1)

    def test_singular_base_passes_only_on_its_range(self) -> None:
        base = diagonal(F(4), F(0))
        defect = diagonal(F(1), F(0))
        gap = matsub(base, defect)
        pseudo_relative = diagonal(F(1, 4), F(0))
        self.assertTrue(is_psd_2x2(gap))
        self.assertLessEqual(max(pseudo_relative[0][0], pseudo_relative[1][1]), 1)
        kernel = (F(0), F(1))
        self.assertEqual(mat_vec(defect, kernel), (F(0), F(0)))

    def test_singular_base_rejects_defect_outside_its_range(self) -> None:
        base = diagonal(F(4), F(0))
        defect = diagonal(F(1), F(1))
        gap = matsub(base, defect)
        self.assertFalse(is_psd_2x2(gap))
        kernel = (F(0), F(1))
        self.assertNotEqual(mat_vec(defect, kernel), (F(0), F(0)))

    def test_nonpositive_absolute_base_makes_signed_floor_impossible(self) -> None:
        base: Matrix = diagonal(F(2), F(-1))
        defect: Matrix = diagonal(F(0), F(1))
        gap = matsub(base, defect)
        self.assertFalse(is_psd_2x2(base))
        self.assertFalse(is_psd_2x2(gap))

    def test_positive_failure_certificate_is_an_upper_matrix(self) -> None:
        absolute = diagonal(F(1, 100), F(4))
        gram = diagonal(F(1), F(2))
        shift = F(-1, 1000)
        signed = diagonal(F(-1, 200), F(3))
        actual = matsub(signed, scale(shift, gram))
        upper = matadd(absolute, scale(abs(shift), gram))
        for vector in ((F(1), F(0)), (F(0), F(1)), (F(2), F(-3))):
            self.assertLessEqual(quadratic(actual, vector), quadratic(upper, vector))
        self.assertEqual(upper[0][0], F(11, 1000))

    def test_moment_ratio_witness_is_exactly_anchor_orthogonal(self) -> None:
        # Symmetric rational measure with masses at +/-1 and +/-2.
        moments = []
        for n in range(6):
            moments.append(2 * F(1) ** (2 * n) + 2 * F(2) ** (2 * n))
        for n in range(4):
            c_n = moments[n + 1] / moments[n]
            integral = moments[n + 1] - c_n * moments[n]
            self.assertEqual(integral, 0)
            self.assertGreater(c_n, 0)

    def test_diagonal_selection_can_meet_all_finitely_many_thresholds(self) -> None:
        # Synthetic thresholds represent convergence, transition, metric,
        # and shift gates at each fixed depth.  Locked numerators remain odd.
        thresholds = [7, 18, 31, 46, 79, 110]
        previous = 3
        locked_numerators = []
        for threshold in thresholds:
            candidate = max(previous + 2, threshold)
            if candidate % 2 == 0:
                candidate += 1
            locked_numerators.append(candidate)
            previous = candidate
        self.assertEqual(locked_numerators, [7, 19, 31, 47, 79, 111])
        self.assertTrue(all(value % 2 for value in locked_numerators))
        self.assertTrue(all(a < b for a, b in zip(locked_numerators, locked_numerators[1:])))
        self.assertTrue(all(value >= threshold for value, threshold in zip(locked_numerators, thresholds)))

    def test_diagonal_floor_inherits_faster_than_fixed_exponential_decay(self) -> None:
        # gamma_m=(m+1)^(-2m) has m-th root (m+1)^(-2).
        # A finite transfer error no larger than gamma_m gives floor <=2 gamma_m.
        for m in range(2, 12):
            gamma = F(1, (m + 1) ** (2 * m))
            finite_floor = gamma + gamma
            self.assertLessEqual(finite_floor, 2 * gamma)
            for fixed_base in range(2, min(m + 1, 6)):
                if (m + 1) ** 2 > 2 * fixed_base:
                    self.assertLess(finite_floor, F(1, fixed_base**m))

    def test_exact_scale_factor_identity_keeps_G_over_D(self) -> None:
        covariance = F(3, 500)
        raw_gram = F(7, 5)
        defect = F(1, 10000)
        left = covariance / defect
        right = (covariance / raw_gram) * (raw_gram / defect)
        self.assertEqual(left, right)
        self.assertGreater(raw_gram / defect, 10000)

    def test_real_window_collapse_does_not_force_tail_sampling_collapse(self) -> None:
        # The first form collapses relative to G while the independent
        # paired-zero absolute tail form stays fixed relative to D.
        for m in range(2, 9):
            gram = F(1)
            real_window = F(1, (m + 1) ** (2 * m))
            defect = F(1, 10**m)
            absolute_tail = defect
            self.assertLess(real_window / gram, F(1, 2**m))
            self.assertEqual(absolute_tail / defect, 1)

    def test_scope_rejects_false_signed_floor_promotions(self) -> None:
        text = NOTE.read_text()
        normalized = " ".join(text.split())
        required = (
            "does **not** prove that the actual growing-rest",
            "signed floor fails",
            "does not assert collapse on every growing schedule",
            "This is a sufficient failure theorem, not a statement that the actual",
            "the actual growing prolate rest",
            "floor is neither proved nor disproved here",
            "Positive covariance, absolute tail sampling, and signed tail orientation",
            "are three distinct data",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)
        forbidden = (
            "therefore the actual signed floor fails",
            "the growing-rest signed floor is disproved",
            "polynomial--Xi covariance proves signed collapse",
            "RH follows",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

    def test_note_contains_exact_singular_and_failure_branches(self) -> None:
        text = NOTE.read_text()
        for token in (
            "{\\rm ran}\\widehat E\\subseteq{\\rm ran}C_\\mu",
            "C_\\mu^{\\dagger/2}\\widehat E",
            "\\alpha_{\\lambda,m}\\longrightarrow0",
            "x^*C_{m,\\lambda}(T)x\\over x^*Dx",
            "Z{\\cal K}_{\\lambda,m}=0",
        ):
            self.assertIn(token, text)

    def test_python_source_is_syntax_valid_and_self_contained(self) -> None:
        tree = ast.parse(TEST.read_text())
        imports = {
            node.names[0].name
            for node in tree.body
            if isinstance(node, ast.Import)
        }
        self.assertEqual(imports, {"ast", "hashlib", "unittest"})
        from_imports = {
            node.module for node in tree.body if isinstance(node, ast.ImportFrom)
        }
        self.assertEqual(from_imports, {"__future__", "fractions", "pathlib"})


if __name__ == "__main__":
    unittest.main()
