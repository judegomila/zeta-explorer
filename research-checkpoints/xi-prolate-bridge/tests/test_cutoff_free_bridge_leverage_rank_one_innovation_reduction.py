#!/usr/bin/env python3
"""Exact regressions for the bridge-leverage rank-one reduction.

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
    / "CUTOFF_FREE_BRIDGE_LEVERAGE_RANK_ONE_INNOVATION_REDUCTION.md"
)
NOTE_HASH = "808c314d6b0cf1926ddf8b0a5b83c324ccbbc252d18efea283781fefd1751097"

FROZEN = {
    "notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md":
        "157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9",
    "tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py":
        "d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae",
    "notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md":
        "c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c",
    "tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py":
        "d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11",
    "notes/CUTOFF_FREE_UNIFORM_RADICAL_GRAPH_TRANSFER_THEOREM.md":
        "aa69ac86e6b5d5256ba3b243b9fc07d9c5ad49bed7a70e3d570d0c57325bce18",
    "tests/test_cutoff_free_uniform_radical_graph_transfer_theorem.py":
        "b2708c8f72ce8bad831b2aea44c49ef3a8ec5f9c38551c288a1c982d097ee727",
    "notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md":
        "335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb",
    "tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py":
        "0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc",
    "notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md":
        "43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2",
    "tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py":
        "95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a",
    "notes/GROWING_MIXED_BRIDGE_RADICAL_QUOTIENT_GRAPH_CORE_BARRIER.md":
        "96c477b3118eefced3ef2f2840ada259c18d1f2ec76daa86d2712ad6a666f768",
    "tests/test_growing_mixed_bridge_radical_quotient_graph_core_barrier.py":
        "9c73374d532f20fdf0f772c1d081dc5c4e2e6bb93b164f6671e19e936afb1b86",
}


Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]
Gaussian = tuple[F, F]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[row][column] for row in range(len(matrix)))
        for column in range(len(matrix[0]))
    )


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = transpose(right)
    return tuple(
        tuple(
            sum((x * y for x, y in zip(row, column, strict=True)), F(0))
            for column in right_t
        )
        for row in left
    )


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum((x * y for x, y in zip(row, vector, strict=True)), F(0))
        for row in matrix
    )


def dot(left: Vector, right: Vector) -> F:
    return sum((x * y for x, y in zip(left, right, strict=True)), F(0))


def identity(size: int) -> Matrix:
    return tuple(
        tuple(F(1) if row == column else F(0) for column in range(size))
        for row in range(size)
    )


def diagonal(values: Vector) -> Matrix:
    return tuple(
        tuple(value if row == column else F(0) for column in range(len(values)))
        for row, value in enumerate(values)
    )


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x + y for x, y in zip(left_row, right_row, strict=True))
        for left_row, right_row in zip(left, right, strict=True)
    )


def subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x - y for x, y in zip(left_row, right_row, strict=True))
        for left_row, right_row in zip(left, right, strict=True)
    )


def scalar_matrix(value: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(value * entry for entry in row) for row in matrix)


def outer(left: Vector, right: Vector) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    augmented = [
        list(row) + list(identity(size)[index])
        for index, row in enumerate(matrix)
    ]
    for column in range(size):
        pivot = next(
            row for row in range(column, size) if augmented[row][column] != 0
        )
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        scale = augmented[column][column]
        augmented[column] = [value / scale for value in augmented[column]]
        for row in range(size):
            if row == column:
                continue
            multiplier = augmented[row][column]
            augmented[row] = [
                value - multiplier * pivot_value
                for value, pivot_value in zip(
                    augmented[row], augmented[column], strict=True
                )
            ]
    return tuple(tuple(row[size:]) for row in augmented)


def determinant(matrix: Matrix) -> F:
    size = len(matrix)
    work = [list(row) for row in matrix]
    result = F(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for row in range(column + 1, size):
            multiplier = work[row][column] / pivot_value
            for entry in range(column, size):
                work[row][entry] -= multiplier * work[column][entry]
    return result


def column(vector: Vector) -> Matrix:
    return tuple((value,) for value in vector)


def gaussian_add(left: Gaussian, right: Gaussian) -> Gaussian:
    return (left[0] + right[0], left[1] + right[1])


def gaussian_multiply(left: Gaussian, right: Gaussian) -> Gaussian:
    return (
        left[0] * right[0] - left[1] * right[1],
        left[0] * right[1] + left[1] * right[0],
    )


def gaussian_conjugate(value: Gaussian) -> Gaussian:
    return (value[0], -value[1])


def gaussian_norm_squared(value: Gaussian) -> F:
    return value[0] * value[0] + value[1] * value[1]


class CutoffFreeBridgeLeverageRankOneInnovationReductionTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        self.assertEqual(len(FROZEN), 12)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)

    def test_note_hash_is_frozen(self) -> None:
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_block_inverse_and_rank_one_innovation_are_exact(self) -> None:
        defect_bulk = diagonal((F(2), F(3)))
        cross = (F(1), F(1))
        bridge_defect = F(2)
        defect = (
            (F(2), F(0), F(1)),
            (F(0), F(3), F(1)),
            (F(1), F(1), F(2)),
        )
        transform_bulk = identity(2)
        bridge_state = (F(2), F(1))
        transform = (
            (F(1), F(0), F(2)),
            (F(0), F(1), F(1)),
        )

        defect_bulk_inverse = inverse(defect_bulk)
        schur = bridge_defect - dot(cross, matvec(defect_bulk_inverse, cross))
        innovation = tuple(
            bridge_state[index] - matvec(defect_bulk_inverse, cross)[index]
            for index in range(2)
        )
        self.assertEqual(schur, F(7, 6))
        self.assertEqual(innovation, (F(3, 2), F(2, 3)))

        weighted_full = matmul(matmul(transform, inverse(defect)), transpose(transform))
        weighted_bulk = matmul(
            matmul(transform_bulk, defect_bulk_inverse),
            transpose(transform_bulk),
        )
        rank_one = scalar_matrix(F(1) / schur, outer(innovation, innovation))
        self.assertEqual(weighted_full, add(weighted_bulk, rank_one))

        expected_inverse = (
            (F(5, 7), F(1, 7), F(-3, 7)),
            (F(1, 7), F(3, 7), F(-2, 7)),
            (F(-3, 7), F(-2, 7), F(6, 7)),
        )
        self.assertEqual(inverse(defect), expected_inverse)

    def test_linear_first_complex_cross_term_matches_completion_of_square(self) -> None:
        # Delta=[[1,i],[-i,2]], f=1, z=i in the repository's convention
        # where the inner product is linear in its first argument.
        one = (F(1), F(0))
        imaginary_unit = (F(0), F(1))
        f_value = one
        z_value = imaginary_unit
        cross_column = imaginary_unit

        inner_f_c = gaussian_multiply(f_value, gaussian_conjugate(cross_column))
        correct_cross = F(2) * gaussian_multiply(
            gaussian_conjugate(z_value), inner_f_c
        )[0]
        incorrect_cross = F(2) * gaussian_multiply(z_value, inner_f_c)[0]
        direct = (
            gaussian_norm_squared(f_value)
            + correct_cross
            + F(2) * gaussian_norm_squared(z_value)
        )

        f_prime = gaussian_add(
            f_value, gaussian_multiply(z_value, cross_column)
        )
        schur = F(2) - gaussian_norm_squared(cross_column)
        completed = (
            gaussian_norm_squared(f_prime)
            + schur * gaussian_norm_squared(z_value)
        )

        self.assertEqual(inner_f_c, (F(0), F(-1)))
        self.assertEqual(correct_cross, F(-2))
        self.assertEqual(incorrect_cross, F(2))
        self.assertEqual(direct, F(1))
        self.assertEqual(completed, F(1))
        self.assertEqual(
            gaussian_norm_squared(f_value)
            + incorrect_cross
            + F(2) * gaussian_norm_squared(z_value),
            F(5),
        )

    def test_explicit_schur_scalar_and_endpoint_shear_invariance(self) -> None:
        d_four = diagonal((F(2), F(5)))
        d_tail = diagonal((F(3), F(7)))
        u = (F(1), F(2))
        a = (F(2), F(1))
        d_zero = F(1, 3)
        d_two = F(1, 4)
        beta = F(3, 2)

        bulk = (
            add(d_four, scalar_matrix(d_zero, outer(u, u)))[0]
            + (F(0), F(0)),
            add(d_four, scalar_matrix(d_zero, outer(u, u)))[1]
            + (F(0), F(0)),
            (F(0), F(0))
            + add(d_tail, scalar_matrix(d_two, outer(a, a)))[0],
            (F(0), F(0))
            + add(d_tail, scalar_matrix(d_two, outer(a, a)))[1],
        )
        cross = tuple(d_zero * beta * value for value in u) + tuple(
            d_two * value for value in a
        )
        diagonal_bridge = d_two + d_zero * beta * beta
        direct = diagonal_bridge - dot(cross, matvec(inverse(bulk), cross))

        u_scalar = dot(u, matvec(inverse(d_four), u))
        a_scalar = dot(a, matvec(inverse(d_tail), a))
        formula = (
            d_zero * beta * beta / (F(1) + d_zero * u_scalar)
            + d_two / (F(1) + d_two * a_scalar)
        )
        self.assertEqual(direct, formula)

        # A general bulk shear leaves both the Schur scalar and innovation fixed.
        q = (F(1, 2), F(-1, 3), F(2, 5), F(-3, 7))
        state_map = (
            (F(1), F(0), F(1), F(2)),
            (F(0), F(1), F(-1), F(1)),
        )
        state = (F(3), F(-2))
        innovation = tuple(
            state[index] - matvec(
                state_map, matvec(inverse(bulk), cross)
            )[index]
            for index in range(2)
        )
        cross_sheared = tuple(
            cross[index] - matvec(bulk, q)[index]
            for index in range(4)
        )
        diagonal_sheared = (
            diagonal_bridge
            - F(2) * dot(q, cross)
            + dot(q, matvec(bulk, q))
        )
        state_sheared = tuple(
            state[index] - matvec(state_map, q)[index]
            for index in range(2)
        )
        direct_sheared = diagonal_sheared - dot(
            cross_sheared, matvec(inverse(bulk), cross_sheared)
        )
        innovation_sheared = tuple(
            state_sheared[index]
            - matvec(
                state_map, matvec(inverse(bulk), cross_sheared)
            )[index]
            for index in range(2)
        )
        self.assertEqual(direct_sheared, direct)
        self.assertEqual(innovation_sheared, innovation)

    def test_minimum_defect_inverse_and_determinant_ratio(self) -> None:
        defect_bulk = diagonal((F(2), F(3)))
        cross = (F(1), F(1))
        defect = (
            (F(2), F(0), F(1)),
            (F(0), F(3), F(1)),
            (F(1), F(1), F(2)),
        )
        transform = (
            (F(1), F(0), F(2)),
            (F(0), F(1), F(1)),
        )
        transform_bulk = identity(2)
        bulk_inverse = inverse(defect_bulk)
        schur = F(7, 6)
        innovation = (F(3, 2), F(2, 3))
        mixed_frame = matmul(matmul(transform, inverse(defect)), transpose(transform))
        right_inverse = matmul(
            matmul(inverse(defect), transpose(transform)), inverse(mixed_frame)
        )
        self.assertEqual(matmul(transform, right_inverse), identity(2))

        bridge_row = right_inverse[-1]
        expected_bridge_row = matmul(
            scalar_matrix(F(1) / schur, transpose(column(innovation))),
            inverse(mixed_frame),
        )[0]
        self.assertEqual(bridge_row, expected_bridge_row)

        correction = matvec(bulk_inverse, cross)
        innovation_bulk = tuple(
            tuple(
                right_inverse[row][column_index]
                + correction[row] * bridge_row[column_index]
                for column_index in range(2)
            )
            for row in range(2)
        )
        deletion = subtract(identity(2), outer(innovation, bridge_row))
        self.assertEqual(matmul(transform_bulk, innovation_bulk), deletion)

        theta = F(1) - dot(bridge_row, innovation)
        bulk_frame = matmul(
            matmul(transform_bulk, bulk_inverse), transpose(transform_bulk)
        )
        self.assertEqual(
            theta,
            determinant(bulk_frame) / determinant(mixed_frame),
        )
        repair = add(identity(2), scalar_matrix(F(1) / theta, outer(innovation, bridge_row)))
        bulk_right_inverse = matmul(innovation_bulk, repair)
        self.assertEqual(matmul(transform_bulk, bulk_right_inverse), identity(2))

    def test_kappa_condition_gives_quantitative_bulk_floor(self) -> None:
        # One bulk coordinate and one orthogonal bridge coordinate.
        defect = identity(2)
        transform = ((F(1), F(1, 2)),)
        mixed_frame = matmul(matmul(transform, defect), transpose(transform))
        right_inverse = matmul(transpose(transform), inverse(mixed_frame))
        bulk_part = right_inverse[0][0]
        bridge_row = right_inverse[1][0]
        innovation = F(1, 2)
        kappa = innovation * bridge_row
        theta = F(1) - kappa
        repaired_bulk = bulk_part / theta
        frame_bulk = F(1)
        lower_bound = (F(1) - kappa) ** 2 / bulk_part**2

        self.assertEqual(mixed_frame, ((F(5, 4),),))
        self.assertEqual((bulk_part, bridge_row), (F(4, 5), F(2, 5)))
        self.assertEqual(kappa, F(1, 5))
        self.assertEqual(repaired_bulk, F(1))
        self.assertEqual(lower_bound, frame_bulk)

    def test_codimension_one_floor_and_adjoint_scalar(self) -> None:
        alpha = F(2)
        bulk_frame = diagonal((F(0), alpha, alpha))
        innovation = (F(1), F(1), F(0))
        mixed_frame = add(bulk_frame, outer(innovation, innovation))
        harmonic_floor = alpha / (alpha + dot(innovation, innovation))
        shifted = subtract(mixed_frame, scalar_matrix(harmonic_floor, identity(3)))

        self.assertEqual(harmonic_floor, F(1, 2))
        self.assertEqual(shifted[0][0], F(1, 2))
        self.assertEqual(
            shifted[0][0] * shifted[1][1] - shifted[0][1] ** 2,
            F(1, 4),
        )
        self.assertEqual(shifted[2][2], F(3, 2))

        beta_two = F(5)
        beta_zero = F(2)
        ratio = F(2)
        schur = F(4)
        corrected_coefficient = beta_two - ratio * beta_zero
        self.assertEqual(corrected_coefficient, F(1))
        self.assertEqual(corrected_coefficient / F(2), F(1, 2))
        self.assertEqual(schur, F(2) ** 2)

    def test_nullity_two_cannot_be_repaired_by_one_bridge(self) -> None:
        bulk_frame = diagonal((F(0), F(0), F(3)))
        innovation = (F(1), F(2), F(4))
        mixed_frame = add(bulk_frame, outer(innovation, innovation))
        missed = (F(2), F(-1), F(0))
        self.assertEqual(matvec(bulk_frame, missed), (F(0), F(0), F(0)))
        self.assertEqual(dot(innovation, missed), F(0))
        self.assertEqual(matvec(mixed_frame, missed), (F(0), F(0), F(0)))
        self.assertEqual(determinant(mixed_frame), F(0))

    def test_ground_parity_coherent_scalar_and_orientation_do_not_imply_capture(self) -> None:
        operator = diagonal((F(0), F(2)))
        ground = (F(1), F(0))
        bridge_state = (F(0), F(1))
        self.assertEqual(dot(ground, matvec(operator, ground)), F(0))
        self.assertEqual(dot(ground, bridge_state), F(0))
        self.assertEqual(dot(bridge_state, matvec(operator, bridge_state)), F(2))

        epsilon = F(1, 7)
        bulk_frame = scalar_matrix(epsilon**2, identity(2))
        rank_one_bridge = outer((F(1), F(0)), (F(1), F(0)))
        mixed_frame = add(bulk_frame, rank_one_bridge)
        self.assertEqual(
            mixed_frame,
            diagonal((F(1) + epsilon**2, epsilon**2)),
        )
        self.assertEqual(matvec(mixed_frame, (F(0), F(1))), (F(0), epsilon**2))

    def test_note_contract_static_hygiene_and_test_ast(self) -> None:
        source = NOTE.read_text(encoding="ascii")
        required = (
            r"S_M=S_F+|v_b\rangle\langle v_b|",
            r"2\operatorname {Re}\{\overline z\langle f,c\rangle\}",
            r"b'=b-C_Fq,\qquad t_b'=t_b-T_Fq",
            r"{d_0\beta^2\over1+d_0U}",
            r"r_b=s_b^{-1}w_b^*S_M^{-1}",
            r"{\det S_F\over\det S_M}",
            r"\theta_b>0\quad\Longleftrightarrow\quad S_F>0",
            r"\kappa_b=\|w_b\|\,\|\ell_bB_M\|",
            r"{(1-\kappa_b)^2\over K_F^2}",
            r"\beta_2(e_0)-{I_2\over I_0}\beta_0(e_0)",
            "dim ker S_F>=2",
            "positive coherent diagonal alone cannot imply bottom overlap",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, source)

        for relative, expected in FROZEN.items():
            self.assertIn(relative, source)
            self.assertIn(expected, source)

        forbidden = (
            "RH_PROVED",
            "P0_VALIDATED",
            "we prove RH",
            "we have proved RH",
            "the Riemann hypothesis follows unconditionally",
        )
        for token in forbidden:
            self.assertNotIn(token, source)

        self.assertNotIn("\r", source)
        self.assertNotIn("\t", source)
        self.assertIsNone(re.search(r"[ \t]+$", source, flags=re.MULTILINE))
        self.assertNotIn("TO_BE_FROZEN", source)
        self.assertIsNone(re.search(r"(?<!\\)qquad", source))
        tags = re.findall(r"\\tag\{([^}]+)\}", source)
        self.assertEqual(len(tags), len(set(tags)))

        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        floats = [
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, float)
        ]
        self.assertEqual(floats, [])

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        source = NOTE.read_text(encoding="ascii")
        displays = re.findall(r"\\\[(.*?)\\\]", source, flags=re.S)
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


if __name__ == "__main__":
    unittest.main()
