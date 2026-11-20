#!/usr/bin/env python3
"""Exact regressions for strict-odd selector-shell localization."""

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
NOTE = ROOT / "notes" / "STRICT_ODD_SELECTOR_SHELL_LOCALIZATION_THEOREM.md"
NOTE_HASH = "f84eb9ea08d7af397c201c645c7de5eb8957bc03ac6a5a7e55b653bc3d6321dc"

FROZEN = {
    "notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md":
        "e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26",
    "tests/test_source_cauchy_selector_cone_projective_tradeoff.py":
        "f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee",
    "notes/FULL_SOURCE_CAUCHY_ANCHOR_FORCING_FEASIBILITY.md":
        "e54cb3b5d79f8dc8bf6188ae1168d7c18fb6cec07e4d92de83510d8f6e523928",
    "tests/test_full_source_cauchy_anchor_forcing_feasibility.py":
        "63619da4265edbbfebcd96a27f549a43872dcd2eb24b5a9f455cf8dedb58b37b",
    "notes/ACTUAL_SOURCE_ROW_PAIRED_GRAM_EXCLUSION_SELECTOR_MOMENT_GATE.md":
        "39777f86bfbf067402ccccdf069ff96276e5f931ee3ed4880edd3b135e181329",
    "tests/test_actual_source_row_paired_gram_exclusion_selector_moment_gate.py":
        "4605cc87111476f3defeaa3e7dbf2f78e4f8b4b92ce9f3e9d2a3b2bf855d5ec3",
    "notes/ACTUAL_GLOBAL_TWISTED_CONE_MOVING_GRID_TARGET_INCOMPATIBILITY.md":
        "0fb7b3d1ab5980b9cdc490933c68d9da3536a8d77a677fe96ec921445639121f",
    "tests/test_actual_global_twisted_cone_moving_grid_target_incompatibility.py":
        "91bda99e6b0db886a7551501ae2343705e4a2cb4632a687fe0f0d72287f031d6",
}

Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def product(values) -> F:
    result = F(1)
    for value in values:
        result *= value
    return result


def cleared_even(count: int, tau: F) -> Vector:
    """Return the rational congruent coordinates S*q(tau)."""

    squares = tuple(F(n * n) for n in range(1, count + 1))
    return (product(tau + square for square in squares),) + tuple(
        2 * tau * product(
            tau + squares[m - 1]
            for m in range(1, count + 1)
            if m != n
        )
        for n in range(1, count + 1)
    )


def cleared_odd(count: int, tau: F) -> Vector:
    """Return the rational congruent coordinates S_-*z(tau)."""

    squares = tuple(F(n * n) for n in range(1, count + 1))
    return tuple(
        2 * n * product(
            tau + squares[m - 1]
            for m in range(1, count + 1)
            if m != n
        )
        for n in range(1, count + 1)
    )


def infinity_even(count: int) -> Vector:
    return (F(1),) + (F(2),) * count


def outer(left: Vector, right: Vector | None = None) -> Matrix:
    right = left if right is None else right
    return tuple(tuple(x * y for y in right) for x in left)


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x + y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def scale(value: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(value * entry for entry in row) for row in matrix)


def zero_matrix(rows: int, columns: int | None = None) -> Matrix:
    columns = rows if columns is None else columns
    return tuple(tuple(F(0) for _ in range(columns)) for _ in range(rows))


def weighted_outers(vectors: tuple[Vector, ...], weights: tuple[F, ...]) -> Matrix:
    result = zero_matrix(len(vectors[0]))
    for vector, weight in zip(vectors, weights):
        result = add(result, scale(weight, outer(vector)))
    return result


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right)), F(0))


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(dot(row, vector) for row in matrix)


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(matrix[i][j] for i in range(len(matrix)))
                 for j in range(len(matrix[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = transpose(right)
    return tuple(tuple(dot(row, column) for column in right_t) for row in left)


def diagonal(values: Vector) -> Matrix:
    return tuple(
        tuple(value if i == j else F(0) for j in range(len(values)))
        for i, value in enumerate(values)
    )


def columns(vectors: tuple[Vector, ...]) -> Matrix:
    return tuple(tuple(vector[row] for vector in vectors)
                 for row in range(len(vectors[0])))


def rank(matrix: Matrix) -> int:
    work = [list(row) for row in matrix]
    if not work:
        return 0
    row_count = len(work)
    column_count = len(work[0])
    pivot_row = 0
    for column in range(column_count):
        pivot = next(
            (row for row in range(pivot_row, row_count) if work[row][column]),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        for row in range(row_count):
            if row == pivot_row or not work[row][column]:
                continue
            factor = work[row][column] / pivot_value
            for entry in range(column, column_count):
                work[row][entry] -= factor * work[pivot_row][entry]
        pivot_row += 1
        if pivot_row == row_count:
            break
    return pivot_row


def inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    work = [
        list(matrix[row]) + [F(int(row == column)) for column in range(size)]
        for row in range(size)
    ]
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column]), None)
        if pivot is None:
            raise ArithmeticError("singular matrix")
        work[column], work[pivot] = work[pivot], work[column]
        pivot_value = work[column][column]
        work[column] = [entry / pivot_value for entry in work[column]]
        for row in range(size):
            if row == column:
                continue
            factor = work[row][column]
            work[row] = [
                entry - factor * pivot_entry
                for entry, pivot_entry in zip(work[row], work[column])
            ]
    return tuple(tuple(row[size:]) for row in work)


def regular_q0(squared_roots: tuple[F, ...], weights: tuple[F, ...]) -> F:
    return 2 * sum(
        (weight / square for square, weight in zip(squared_roots, weights)),
        F(0),
    )


def regular_source(
    squared_roots: tuple[F, ...], weights: tuple[F, ...], n: int
) -> F:
    return -2 * n * sum(
        (
            weight / (F(n * n) - square)
            for square, weight in zip(squared_roots, weights)
        ),
        F(0),
    )


def regular_diagonal(
    squared_roots: tuple[F, ...], weights: tuple[F, ...], n: int
) -> F:
    return 2 * sum(
        (
            weight * (F(n * n) + square) / (F(n * n) - square) ** 2
            for square, weight in zip(squared_roots, weights)
        ),
        F(0),
    )


def distance_squared(n: int, square: F) -> F:
    return (F(n * n) - square) ** 2 / square


class StrictOddSelectorShellLocalizationTheoremTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.note_bytes = NOTE.read_bytes()
        cls.text = cls.note_bytes.decode("ascii")

    def test_frozen_dependencies_and_self_hash(self) -> None:
        for relative, expected in FROZEN.items():
            self.assertEqual(sha256(ROOT / relative), expected, relative)
            self.assertIn(relative, self.text)
            self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_cleared_odd_curve_pole_limits_and_vandermonde_rank(self) -> None:
        count = 3
        for shell in range(1, count + 1):
            tau = F(-shell * shell)
            even = cleared_even(count, tau)
            odd = cleared_odd(count, tau)
            self.assertEqual(
                [index for index, value in enumerate(even) if value],
                [shell],
            )
            self.assertEqual(
                [index + 1 for index, value in enumerate(odd) if value],
                [shell],
            )
            self.assertEqual(even[shell] ** 2, -tau * odd[shell - 1] ** 2)

        taus = (F(-1), F(-2), F(-10))
        odd_columns = tuple(cleared_odd(count, tau) for tau in taus)
        self.assertEqual(rank(columns(odd_columns)), count)

    def test_strict_odd_block_excludes_zero_infinity_and_positive_tau(self) -> None:
        count = 3

        def odd_congruence(taus: tuple[F, ...], atom_weights: tuple[F, ...]):
            odd_columns = tuple(cleared_odd(count, tau) for tau in taus)
            z_matrix = columns(odd_columns)
            coefficients = tuple(-weight * tau for weight, tau in zip(atom_weights, taus))
            odd = matmul(matmul(z_matrix, diagonal(coefficients)), transpose(z_matrix))
            z_inverse = inverse(z_matrix)
            isolated = matmul(matmul(z_inverse, odd), transpose(z_inverse))
            self.assertEqual(isolated, diagonal(coefficients))
            return coefficients, odd

        negative_taus = (F(-1), F(-2), F(-10))
        coefficients, odd = odd_congruence(negative_taus, (F(2), F(3), F(5)))
        self.assertTrue(all(value > 0 for value in coefficients))
        self.assertEqual(rank(odd), count)

        mixed_taus = (F(-1), F(3), F(-10))
        coefficients, odd = odd_congruence(mixed_taus, (F(2), F(3), F(5)))
        self.assertEqual(sum(value < 0 for value in coefficients), 1)
        self.assertEqual(rank(odd), count)

        zero_taus = (F(-1), F(0), F(-10))
        zero_vectors = tuple(cleared_odd(count, tau) for tau in zero_taus)
        zero_coefficients = tuple(-tau for tau in zero_taus)
        zero_odd = matmul(
            matmul(columns(zero_vectors), diagonal(zero_coefficients)),
            transpose(columns(zero_vectors)),
        )
        self.assertEqual(rank(zero_odd), count - 1)

        finite = (F(-2), F(-10))
        infinity_odd = weighted_outers(
            tuple(cleared_odd(count, tau) for tau in finite),
            tuple(-tau for tau in finite),
        )
        self.assertEqual(rank(infinity_odd), count - 1)
        self.assertEqual(len(infinity_even(count)), count + 1)

    def test_mixed_regular_shell_decomposition_has_simple_even_kernel(self) -> None:
        count = 3
        taus = (F(-1), F(-2), F(-10))
        paired_weights = {F(2): F(3), F(10): F(5)}
        shell_weight = F(7)

        regular_atom_weights = []
        for square in (F(2), F(10)):
            tau = -square
            denominator_product = product(
                tau + F(n * n) for n in range(1, count + 1)
            )
            regular_atom_weights.append(
                2 * paired_weights[square] / (denominator_product**2 * square)
            )
        shell = 1
        shell_tau = F(-1)
        shell_normalized_coordinate_squared = (
            2 * shell_tau**2
            * product(
                shell_tau + F(n * n)
                for n in range(1, count + 1)
                if n != shell
            ) ** 2
        )
        shell_atom_weight = shell_weight / shell_normalized_coordinate_squared
        atom_weights = (
            shell_atom_weight,
            regular_atom_weights[0],
            regular_atom_weights[1],
        )

        even_vectors = tuple(cleared_even(count, tau) for tau in taus)
        even = weighted_outers(even_vectors, atom_weights)
        ground = (F(5, 9), F(0), F(3, 10), F(-7, 90))
        self.assertEqual(ground[0] + 2 * sum(ground[1:], F(0)), F(1))
        self.assertEqual(matvec(even, ground), (F(0),) * (count + 1))
        self.assertEqual(rank(even), count)
        self.assertEqual(ground[1], F(0))

        odd_vectors = tuple(cleared_odd(count, tau) for tau in taus)
        odd_coefficients = tuple(
            -weight * tau for weight, tau in zip(atom_weights, taus)
        )
        self.assertTrue(all(value > 0 for value in odd_coefficients))
        odd = weighted_outers(odd_vectors, odd_coefficients)
        self.assertEqual(rank(odd), count)

    def test_shell_inclusive_moments_and_localization(self) -> None:
        squared_roots = (F(2), F(10))
        weights = (F(3), F(5))
        shells = {1: F(7)}
        q_zero = regular_q0(squared_roots, weights)
        self.assertEqual(q_zero, F(4))

        n = 2
        source = regular_source(squared_roots, weights, n)
        diagonal_value = regular_diagonal(squared_roots, weights, n)
        d_value = diagonal_value - source / n
        self.assertEqual(source, F(-8, 3))
        self.assertEqual(diagonal_value, F(116, 9))
        self.assertEqual(d_value, F(128, 9))
        self.assertNotIn(n, shells)

        all_squared_roots = (F(1),) + squared_roots
        left_squared = min(distance_squared(n, square) for square in all_squared_roots)
        right_squared = F(2 * n * n) * q_zero / d_value
        self.assertEqual(left_squared, F(2))
        self.assertEqual(right_squared, F(9, 4))
        self.assertLessEqual(left_squared, right_squared)

        shell_n = 1
        shell_distance = min(
            distance_squared(shell_n, square) for square in all_squared_roots
        )
        shell_source = regular_source(squared_roots, weights, shell_n)
        shell_d = (
            regular_diagonal(squared_roots, weights, shell_n)
            + shells[shell_n]
            - shell_source / shell_n
        )
        self.assertEqual(shell_distance, F(0))
        self.assertGreater(shell_d, 0)
        self.assertLessEqual(shell_distance, F(2) * q_zero / shell_d)

    def test_all_shell_q0_zero_edge_is_exact(self) -> None:
        count = 4
        shell_weights = (F(2), F(3), F(5), F(7))
        taus = tuple(F(-n * n) for n in range(1, count + 1))
        even_vectors = tuple(cleared_even(count, tau) for tau in taus)
        odd_vectors = tuple(cleared_odd(count, tau) for tau in taus)

        # Choose the cleared-ray weights that produce the prescribed raw
        # paired shell diagonals (the rational congruence doubles them).
        ray_weights = tuple(
            shell_weight
            / (
                2
                * tau**2
                * product(
                    tau + F(m * m)
                    for m in range(1, count + 1)
                    if m != n
                )
                ** 2
            )
            for n, (tau, shell_weight) in enumerate(
                zip(taus, shell_weights), start=1
            )
        )
        even = weighted_outers(even_vectors, ray_weights)
        odd = weighted_outers(
            odd_vectors,
            tuple(-tau * weight for tau, weight in zip(taus, ray_weights)),
        )
        self.assertEqual(
            even,
            diagonal((F(0),) + tuple(2 * weight for weight in shell_weights)),
        )
        self.assertEqual(
            odd,
            diagonal(tuple(2 * weight for weight in shell_weights)),
        )
        self.assertEqual(rank(even), count)
        self.assertEqual(matvec(even, (F(1),) + (F(0),) * count), (F(0),) * (count + 1))
        self.assertEqual(rank(odd), count)

        q_zero = F(0)
        for n, shell_weight in enumerate(shell_weights, start=1):
            source = F(0)
            d_value = shell_weight - source / n
            minimum_distance = min(
                distance_squared(n, F(m * m)) for m in range(1, count + 1)
            )
            self.assertEqual(d_value, shell_weight)
            self.assertEqual(minimum_distance, F(0))
            self.assertEqual(F(2 * n * n) * q_zero / d_value, F(0))

    def test_genuine_odd_ritz_shift_implies_true_ground_strictness(self) -> None:
        mu = F(-2)
        lower_ritz = F(1)
        shifted_odd_eigenvalues = (F(3), F(5), F(11))
        true_ground_shifted = tuple(
            value + lower_ritz - mu for value in shifted_odd_eigenvalues
        )
        self.assertLessEqual(mu, lower_ritz)
        self.assertTrue(all(value > 0 for value in true_ground_shifted))
        self.assertIn(r"Q_- -\mu I=(Q_- -uI)+(u-\mu)I>0", self.text)

    def test_displayed_tex_compiles(self) -> None:
        compiler = shutil.which("pdflatex")
        self.assertIsNotNone(compiler, "pdflatex is required for TeX regression")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        self.assertGreaterEqual(len(displays), 20)
        document = (
            "\\documentclass{article}\n"
            "\\usepackage{amsmath,amssymb}\n"
            "\\begin{document}\n"
            + "\n".join("\\[" + display + "\\]" for display in displays)
            + "\n\\end{document}\n"
        )
        with tempfile.TemporaryDirectory() as temporary:
            source = Path(temporary) / "note.tex"
            source.write_text(document, encoding="ascii")
            result = subprocess.run(
                [compiler, "-interaction=nonstopmode", "-halt-on-error", source.name],
                cwd=temporary,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_static_hygiene_and_fail_closed_scope(self) -> None:
        test_path = Path(__file__)
        test_bytes = test_path.read_bytes()
        ast.parse(test_bytes.decode("ascii"), filename=str(test_path))
        for raw in (self.note_bytes, test_bytes):
            self.assertNotIn(b"\r", raw)
            self.assertNotIn(b"\t", raw)
            self.assertTrue(all(value < 128 for value in raw))
            self.assertTrue(all(line == line.rstrip(b" ") for line in raw.splitlines()))

        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(displays), len(tags))
        self.assertEqual(len(tags), len(set(tags)))
        self.assertNotIn("V_0,qquad", self.text)

        normalized = " ".join(self.text.split())
        required = (
            "No sign assumption on the coordinates",
            "Every root must occur with positive total weight",
            "projective infinity",
            "strict odd block",
            "shell at `n`",
            "q_0=0",
            "global twisted cone",
            "actual simple-even ground",
            "adds no zero statement beyond",
            "checkpoint-1.33 standard eight are unchanged",
            "P0_INVALIDATED",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)

        forbidden = (
            "the actual strict signs are proved",
            "the actual global cone is true",
            "the actual global cone is false",
            "the riemann hypothesis is proved",
            "standard eight are updated",
        )
        lowered = self.text.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase, lowered)


if __name__ == "__main__":
    unittest.main()
