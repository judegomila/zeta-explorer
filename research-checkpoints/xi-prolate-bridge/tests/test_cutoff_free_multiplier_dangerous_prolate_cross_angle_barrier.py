#!/usr/bin/env python3
"""Strict regressions for the multiplier-dangerous prolate cross-angle barrier.

All algebraic fixtures use exact ``Fraction`` arithmetic.  The test reads no
zero table, cached ground, prolate artifact, or network resource.
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
NOTE = ROOT / "notes" / (
    "CUTOFF_FREE_MULTIPLIER_DANGEROUS_PROLATE_CROSS_ANGLE_BARRIER.md"
)
NOTE_HASH = "bfabbf6b7c4879d027e4ea1be8e1103b22468519b2bd68aa0d121642000120ed"

FROZEN = {
    "notes/CUTOFF_FREE_BRIDGE_MIXED_ADJOINT_TAIL_PREFACTOR_REDUCTION.md":
        "53dd9fefd8cc05a29cd3e0a043e6f86f8bbdc7545d2c203d29bc59cbbe1a04f8",
    "tests/test_cutoff_free_bridge_mixed_adjoint_tail_prefactor_reduction.py":
        "e532a958742feda3efe00adc37e1ea2879a3676f23b63a47c238e348aaf5b17c",
    "notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md":
        "157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9",
    "tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py":
        "d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae",
    "notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md":
        "3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81",
    "tests/test_full_source_coframe_rank.py":
        "dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "tests/test_parity_multiplier_schur.py":
        "94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb",
    "notes/GROWING_MULTIPLIER_DEFICIT_GEOMETRY_BOUNDARY_ALIAS_BARRIER.md":
        "2e5b38892f73848b4d081de5fef45f10819bd4e7f6a8be5a4edb8f85dae11141",
    "tests/test_growing_multiplier_deficit_geometry_boundary_alias_barrier.py":
        "6dc9991b36db57e6a22155b30e0ab9bf913812d17c0f81d3f356c602da73d9d0",
}

Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(row[index] for row in matrix) for index in range(len(matrix[0])))


def matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = transpose(right)
    return tuple(
        tuple(sum((a * b for a, b in zip(row, column)), F(0)) for column in right_t)
        for row in left
    )


def matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    )


def add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(a + b for a, b in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def sub(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(a - b for a, b in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def scale(scalar: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * entry for entry in row) for row in matrix)


def diagonal(*entries: F) -> Matrix:
    return tuple(
        tuple(entry if row == column else F(0) for column in range(len(entries)))
        for row, entry in enumerate(entries)
    )


def identity(dimension: int) -> Matrix:
    return diagonal(*(F(1) for _ in range(dimension)))


def dot(left: Vector, right: Vector) -> F:
    return sum((a * b for a, b in zip(left, right)), F(0))


def rank(matrix: Matrix) -> int:
    work = [list(row) for row in matrix]
    rows = len(work)
    columns = len(work[0]) if rows else 0
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        pivot_value = work[pivot_row][column]
        work[pivot_row] = [value / pivot_value for value in work[pivot_row]]
        for row in range(rows):
            if row == pivot_row:
                continue
            factor = work[row][column]
            if factor != 0:
                work[row] = [
                    value - factor * pivot_entry
                    for value, pivot_entry in zip(work[row], work[pivot_row])
                ]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


class CutoffFreeMultiplierDangerousProlateCrossAngleBarrierTests(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.text = NOTE.read_text(encoding="ascii")
        cls.normalized = " ".join(cls.text.split())

    def test_frozen_dependencies_and_self_hash(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)
                self.assertIn(relative, self.text)
                self.assertIn(expected, self.text)
        if NOTE_HASH != "DRAFT":
            self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_normalized_full_source_map_is_an_isometry(self) -> None:
        # A maps four source coordinates to three physical coordinates.
        arithmetic = (
            (F(1), F(0), F(0), F(0)),
            (F(0), F(2), F(0), F(0)),
            (F(0), F(0), F(3), F(1)),
        )
        y_inclusion = (
            (F(1), F(0)),
            (F(0), F(1)),
            (F(0), F(0)),
        )
        r_inverse_half = diagonal(F(1), F(1, 2))
        j_map = matmul(transpose(arithmetic), matmul(y_inclusion, r_inverse_half))
        self.assertEqual(matmul(transpose(j_map), j_map), identity(2))

        source_prefix = diagonal(F(1), F(0), F(0), F(0))
        captured = matmul(source_prefix, j_map)
        self.assertEqual(rank(captured), 1)
        self.assertLess(rank(captured), 2)

        complete_gram = matmul(arithmetic, transpose(arithmetic))
        r_y = matmul(transpose(y_inclusion), matmul(complete_gram, y_inclusion))
        self.assertEqual(r_y, diagonal(F(1), F(4)))

    def test_rank_obstruction_forces_zero_smallest_singular_value(self) -> None:
        # Three isometric target columns enter a two-dimensional prefix.
        j_map = (
            (F(1), F(0), F(0)),
            (F(0), F(1), F(0)),
            (F(0), F(0), F(1)),
        )
        prefix = (
            (F(1), F(0), F(0)),
            (F(0), F(1), F(0)),
        )
        captured = matmul(prefix, j_map)
        self.assertEqual(rank(captured), 2)
        self.assertLess(rank(captured), len(j_map[0]))
        gram = matmul(transpose(captured), captured)
        self.assertEqual(rank(gram), 2)
        self.assertEqual(matvec(gram, (F(0), F(0), F(1))), (F(0), F(0), F(0)))

    def test_actual_physical_angle_constants_follow_from_loewner_comparison(self) -> None:
        # V=diag(10,2), g=4, kappa=1.  The rank-one positive correction
        # makes y=(1,1) an exact eigenvector of B with eigenvalue -1.
        deficit = diagonal(F(10), F(2))
        positive = (
            (F(25, 2), F(-15, 2)),
            (F(-15, 2), F(9, 2)),
        )
        comparison = diagonal(F(-6), F(2))
        shifted = add(comparison, positive)
        y_value = (F(1), F(1))
        self.assertEqual(matvec(shifted, y_value), (F(-1), F(-1)))
        self.assertEqual(positive[0][0] * positive[1][1] - positive[0][1] ** 2, 0)
        self.assertGreater(positive[0][0], 0)
        self.assertEqual(sub(shifted, comparison), positive)

        threshold = F(3)
        lower_angle_squared = F(4 + 1, 1) - threshold
        lower_angle_squared /= F(10) - threshold
        upper_safe_squared = F(10 - 4 - 1, 1) / (F(10) - threshold)
        actual_danger_squared = F(1, 2)
        actual_safe_squared = F(1, 2)
        self.assertEqual(lower_angle_squared, F(2, 7))
        self.assertEqual(upper_safe_squared, F(5, 7))
        self.assertGreaterEqual(actual_danger_squared, lower_angle_squared)
        self.assertLessEqual(actual_safe_squared, upper_safe_squared)
        self.assertGreaterEqual(dot(y_value, matvec(deficit, y_value)), 5 * dot(y_value, y_value))

    def test_full_source_conditioning_constants_are_exact(self) -> None:
        lambda_value = F(2)
        mobius_sum = F(3)
        lower = 1 / (2 * lambda_value**2 * mobius_sum**2)
        upper = lambda_value**2 / 2
        self.assertEqual(lower, F(1, 72))
        self.assertEqual(upper, F(2))
        self.assertEqual(lower / upper, F(1, 144))

        lower_singular_factor = 1 / (lambda_value**2 * mobius_sum)
        upper_singular_factor = lambda_value**2 * mobius_sum
        self.assertEqual(lower_singular_factor, F(1, 12))
        self.assertEqual(upper_singular_factor, F(12))
        self.assertGreaterEqual(lower_singular_factor, F(1, 2 * lambda_value**3))
        self.assertLessEqual(upper_singular_factor, 2 * lambda_value**3)

    def test_normalized_triangle_bound_is_sufficient_not_necessary(self) -> None:
        # Same-range scalar pieces can reinforce even when Delta is negative.
        dangerous = F(2)
        safe = F(3)
        delta = abs(dangerous) - abs(safe)
        total_capture = abs(dangerous + safe) ** 2
        self.assertEqual(delta, F(-1))
        self.assertEqual(total_capture, F(25))
        self.assertLessEqual(max(delta, F(0)) ** 2, total_capture)

        # Opposite pieces give equality in the reverse-triangle estimate.
        dangerous = F(5)
        safe = F(-2)
        delta = abs(dangerous) - abs(safe)
        total_capture = abs(dangerous + safe) ** 2
        self.assertEqual(delta, F(3))
        self.assertEqual(total_capture, delta**2)

    def test_signed_cross_is_the_projector_commutator_corner(self) -> None:
        projector = diagonal(F(1), F(0))
        complement = sub(identity(2), projector)
        captured_gram = (
            (F(2), F(3)),
            (F(3), F(5)),
        )
        cross = matmul(projector, matmul(captured_gram, complement))
        commutator = sub(
            matmul(projector, captured_gram),
            matmul(captured_gram, projector),
        )
        commutator_corner = matmul(projector, matmul(commutator, complement))
        self.assertEqual(cross, ((F(0), F(3)), (F(0), F(0))))
        self.assertEqual(cross, commutator_corner)

        dangerous = (F(2), F(0))
        safe = (F(-1), F(1))
        total = tuple(a + b for a, b in zip(dangerous, safe))
        exact_gram = dot(total, total)
        expanded = (
            dot(dangerous, dangerous)
            + dot(safe, safe)
            + 2 * dot(dangerous, safe)
        )
        self.assertEqual(exact_gram, expanded)

    def test_literal_arithmetic_edge_model_has_full_space_rank_zero_capture(self) -> None:
        # A is full row rank.  The edge plus block has p^perp as its bottom
        # eigenspace, while the two-coordinate source prefix misses two of
        # the three normalized bottom columns.
        arithmetic = (
            (F(1), F(0), F(0), F(0), F(0)),
            (F(0), F(1), F(0), F(0), F(0)),
            (F(0), F(0), F(1), F(0), F(0)),
            (F(0), F(0), F(0), F(1), F(0)),
        )
        source_prefix = diagonal(F(1), F(1), F(0), F(0), F(0))
        y_inclusion = (
            (F(0), F(0), F(0)),
            (F(1), F(0), F(0)),
            (F(0), F(1), F(0)),
            (F(0), F(0), F(1)),
        )
        complete_gram = matmul(arithmetic, transpose(arithmetic))
        r_y = matmul(transpose(y_inclusion), matmul(complete_gram, y_inclusion))
        self.assertEqual(r_y, identity(3))
        j_map = matmul(transpose(arithmetic), y_inclusion)
        self.assertEqual(matmul(transpose(j_map), j_map), identity(3))
        captured = matmul(source_prefix, j_map)
        self.assertEqual(rank(captured), 1)
        self.assertLess(rank(captured), 3)

        pole = (F(1), F(0), F(0), F(0))
        pole_matrix = tuple(tuple(2 * a * b for b in pole) for a in pole)
        edge_block = add(scale(F(-1), identity(4)), pole_matrix)
        self.assertEqual(
            matmul(edge_block, y_inclusion),
            scale(F(-1), y_inclusion),
        )

    def test_literal_arithmetic_edge_model_has_codimension_one_missed_line(self) -> None:
        arithmetic = (
            (F(1), F(0), F(0), F(0)),
            (F(0), F(1), F(0), F(0)),
            (F(0), F(0), F(1), F(0)),
        )
        prefix = diagonal(F(1), F(1), F(0), F(0))
        e_zero = (F(0), F(0), F(1))
        adjoint_line = matvec(transpose(arithmetic), e_zero)
        self.assertEqual(matvec(prefix, adjoint_line), (F(0),) * 4)
        self.assertEqual(dot(adjoint_line, adjoint_line), F(1))

        phase_source = (F(0), F(1), F(0), F(0))
        phase_image = matvec(arithmetic, phase_source)
        self.assertEqual(dot(phase_image, e_zero), F(0))
        self.assertEqual(rank((phase_image, e_zero)), 2)
        self.assertIn(r"e_0\in p_+^\perp\cap\ker(P_EA^*)", self.normalized)
        self.assertIn(r"T_F^*e_0=0", self.normalized)

    def test_edge_threshold_and_smoothing_cannot_improve_capture(self) -> None:
        mean_deficit = F(5)
        g_value = F(2)
        safe_threshold = F(1)
        self.assertLess(safe_threshold, g_value)
        self.assertLess(safe_threshold, mean_deficit)

        rejected_threshold = F(6)
        self.assertGreater(rejected_threshold, mean_deficit)
        self.assertLess(g_value - rejected_threshold, 0)

        total_line = F(5)
        taper = F(3, 4)
        smoothed_delta = taper * abs(total_line) - (1 - taper) * abs(total_line)
        self.assertEqual(smoothed_delta, F(5, 2))
        self.assertLessEqual(smoothed_delta, abs(total_line))

        missed_line = F(0)
        self.assertEqual(taper * missed_line, 0)
        self.assertEqual((1 - taper) * missed_line, 0)

    def test_one_line_coefficient_energy_keeps_the_signed_cross(self) -> None:
        beta_dangerous = (F(5), F(1))
        beta_safe = (F(-2), F(3))
        beta_total = tuple(a + b for a, b in zip(beta_dangerous, beta_safe))
        tau = F(100)
        raw_energy = dot(beta_total, beta_total)
        expanded = (
            dot(beta_dangerous, beta_dangerous)
            + dot(beta_safe, beta_safe)
            + 2 * dot(beta_dangerous, beta_safe)
        )
        self.assertEqual(beta_total, (F(3), F(4)))
        self.assertEqual(raw_energy, F(25))
        self.assertEqual(raw_energy, expanded)
        self.assertEqual(raw_energy / tau, F(1, 4))

        delta_e = F(1, 5)
        self.assertGreater(raw_energy / tau, delta_e)

        integral_vector = (F(1), F(2))
        s_value = dot(integral_vector, integral_vector)
        penalty = dot(integral_vector, beta_total) ** 2 / s_value
        corrected = raw_energy - penalty
        self.assertEqual(penalty, F(121, 5))
        self.assertEqual(corrected, F(4, 5))
        self.assertEqual(corrected / tau, F(1, 125))

    def test_polynomial_capture_does_not_replace_the_exact_delta_gate(self) -> None:
        lambda_value = 20
        # pi^2<10 makes this a smaller rational lower bound than the frozen
        # 1/(16*pi^2*lambda^2) threshold lower bound.
        certified_lower = F(1, 160 * lambda_value**2)
        polynomial_capture = 2 * certified_lower
        compatible_actual_threshold = F(1, 4)
        self.assertGreater(polynomial_capture, certified_lower)
        self.assertLess(polynomial_capture, compatible_actual_threshold)
        self.assertIn(r"\mathfrak q_E(e_0)>\delta_E", self.normalized)
        self.assertIn(r"\delta_{E_R}\geq{1\over16\pi^2\lambda^2}", self.normalized)
        self.assertIn("No matching upper bound", self.text)

    def test_note_contract_and_claim_boundary(self) -> None:
        required = (
            r"J_Y=A^*P_YR_Y^{-1/2}",
            r"J_Y^*J_Y=I_Y",
            r"\mathfrak q_E(Y)",
            r"s_{\min}(P_EJ_Y)^2",
            r"\dim Y>\dim E",
            r"\Pi_t={\bf1}_{[t,\infty)}(\mathcal V)",
            r"{g+\kappa-t\over V-t}",
            r"{V-g-\kappa\over V-t}",
            r"{a_t\over\lambda^2M_\mu(\lambda)}",
            r"\Delta_E&=s_{\min}(D_E)-\|S_E\|",
            r"\mathfrak q_E(Y)^{1/2}",
            r"D_E^*S_E",
            r"\Pi_t[\Pi_t,C_E](I-\Pi_t)",
            r"m_{\rm edge}(t)=-4\lambda\cos(Lt)",
            r"T_{v_\beta}=\overline v_\beta I",
            r"e_0\in p_+^\perp\cap\ker(P_EA^*)",
            r"\tau_0=\|A^*e_0\|^2\geq m_\lambda>0",
            r"W_f=f(T_{v_\beta})=cI",
            r"\beta_j(e_0)",
            r"\sum_{j\in\mathcal I_E}|\beta_j(e_0)|^2",
            "synthetic critical-edge symbol",
            "not the actual full von-Mangoldt Weil symbol",
            "No matching upper bound",
            "P0_INVALIDATED",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)

        forbidden = (
            r"\delta_E\asymp",
            r"\delta_{E_R}\asymp",
            "delta_E asymp",
            "delta_(E_R) asymp",
            "actual-prime countermodel",
            "actual prime countermodel",
            "proves RH",
            "TO_BE_FROZEN",
            "DRAFT RESULT",
        )
        for token in forbidden:
            self.assertNotIn(token, self.text)

    def test_static_hygiene_and_unique_tex_tags(self) -> None:
        self.assertEqual(self.text.count(r"\["), self.text.count(r"\]"))
        self.assertNotIn("\r", self.text)
        self.assertNotIn("\t", self.text)
        self.assertIsNone(re.search(r"[ \t]+$", self.text, flags=re.MULTILINE))
        tags = re.findall(r"\\tag\{([^}]+)\}", self.text)
        self.assertEqual(len(tags), len(set(tags)))
        self.assertGreaterEqual(len(tags), 45)

        for path in (NOTE, Path(__file__)):
            payload = path.read_bytes()
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))
            self.assertNotIn(b"\r", payload)
            self.assertFalse(
                any(line.endswith((b" ", b"\t")) for line in payload.splitlines())
            )

        tree = ast.parse(Path(__file__).read_text(encoding="ascii"))
        forbidden_calls = {"eval", "exec"}
        called = {
            node.func.id
            for node in ast.walk(tree)
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name)
        }
        self.assertTrue(forbidden_calls.isdisjoint(called))

    def test_all_displayed_tex_compiles(self) -> None:
        pdflatex = shutil.which("pdflatex")
        if pdflatex is None:
            self.skipTest("pdflatex unavailable")
        displays = re.findall(r"\\\[(.*?)\\\]", self.text, flags=re.S)
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
