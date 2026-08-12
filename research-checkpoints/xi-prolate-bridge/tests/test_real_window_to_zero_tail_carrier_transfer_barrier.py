#!/usr/bin/env python3
"""Exact regressions for the real-window/zero-tail carrier barrier."""

from __future__ import annotations

import ast
from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "REAL_WINDOW_TO_ZERO_TAIL_CARRIER_TRANSFER_BARRIER.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md":
        "e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816",
    "notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md":
        "6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98",
    "notes/FIXED_EVEN_PREFIX_DIAGONAL_COVARIANCE_COLLAPSE_AND_SIGNED_TAIL_DICHOTOMY.md":
        "6d8be3d8bef6002d7fa2f1581e09bf27aa0dc12b2a3805fa7cd5e92863cd70d8",
    "notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md":
        "ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a",
    "notes/CENTERED_ZERO_PALEY_WIENER_INTERPOLATION_OBSTRUCTION.md":
        "b23720bd4c05afbda4aa3f50176ff0580bacda0668264fd4fcc075b7c43d5ae2",
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
}

Vector = tuple[F, ...]
Matrix = tuple[tuple[F, ...], ...]


def dot(left: Vector, right: Vector) -> F:
    return sum(x * y for x, y in zip(left, right))


def mat_vec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(
        sum(matrix[i][j] * vector[j] for j in range(len(vector)))
        for i in range(len(matrix))
    )


def norm_squared(vector: Vector) -> F:
    return dot(vector, vector)


def rank(matrix: Matrix) -> int:
    work = [list(row) for row in matrix]
    rows = len(work)
    columns = len(work[0]) if rows else 0
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column]),
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
            work[row] = [
                value - factor * base
                for value, base in zip(work[row], work[pivot_row])
            ]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


class RealWindowZeroTailCarrierBarrierTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_diagonal_minus_off_diagonal_keeps_claimed_frame(self) -> None:
        # Normalize d_L to one.  The proof has b_L/d_L <= 1/3.
        # The adverse symmetric matrix has least eigenvalue 2/3, whose
        # square is strictly larger than the deliberately claimed 1/4.
        matrix: Matrix = ((F(1), F(1, 3)), (F(1, 3), F(1)))
        adverse = (F(1), F(-1))
        image = mat_vec(matrix, adverse)
        self.assertEqual(image, (F(2, 3), F(-2, 3)))
        self.assertEqual(norm_squared(image) / norm_squared(adverse), F(4, 9))
        self.assertGreaterEqual(F(4, 9), F(1, 4))

    def test_window_and_sampling_constants_have_opposite_L_scales(self) -> None:
        # Suppress the common positive pi^(-2) factor in the sampling bound.
        # The exact constants are 512*T/(L*gamma^2) and L/(8*pi^2).
        T = F(3)
        gamma = F(20)
        previous_window = None
        previous_sampling = None
        for length in (F(16), F(32), F(64), F(128)):
            window = F(512) * T / (length * gamma * gamma)
            sampling_without_pi = length / 8
            if previous_window is not None:
                self.assertLess(window, previous_window)
                self.assertGreater(sampling_without_pi, previous_sampling)
            previous_window = window
            previous_sampling = sampling_without_pi

    def test_two_carriers_always_leave_an_anchor_orthogonal_direction(self) -> None:
        # H is the first two coordinate axes.  For an arbitrary anchor,
        # (kappa_2,-kappa_1,0) is in H and orthogonal to kappa unless both
        # displayed coordinates vanish, in which case e_1 works.
        anchors = (
            (F(2), F(3), F(5)),
            (F(0), F(7), F(-4)),
            (F(0), F(0), F(1)),
        )
        for anchor in anchors:
            candidate = (anchor[1], -anchor[0], F(0))
            if candidate == (F(0), F(0), F(0)):
                candidate = (F(1), F(0), F(0))
            self.assertEqual(dot(anchor, candidate), 0)
            self.assertNotEqual(norm_squared(candidate), 0)

    def test_radical_remainder_keeps_absolute_carrier_samples(self) -> None:
        # ZK=0 and K=v+R force ZR=-Zv at every paired slot.
        z_v = (F(3), F(-5), F(7), F(11))
        z_r = tuple(-value for value in z_v)
        z_k = tuple(a + b for a, b in zip(z_v, z_r))
        self.assertEqual(z_k, (F(0),) * len(z_v))
        self.assertEqual(norm_squared(z_v), norm_squared(z_r))

    def test_finite_saturation_survives_anchor_projection(self) -> None:
        # Three nested tower columns span E^3 at depth three.  Projection
        # away from the first coordinate spans its two-dimensional
        # complement at the same finite depth.
        tower: Matrix = (
            (F(1), F(1), F(2)),
            (F(0), F(1), F(1)),
            (F(0), F(0), F(1)),
        )
        projected: Matrix = (
            (F(0), F(0), F(0)),
            tower[1],
            tower[2],
        )
        self.assertEqual(rank(tower), 3)
        self.assertEqual(rank(projected), 2)

    def test_D_weighted_right_inverse_gate_is_exact(self) -> None:
        # If sampling >= k*L*||v||^2 and minimum D-cost <= C*L*||v||^2,
        # their quotient is at least k/C; L cancels exactly.
        length = F(120)
        k = F(1, 80)
        C = F(3)
        vector_norm = F(7, 5)
        sampling = k * length * vector_norm
        d_cost = C * length * vector_norm
        self.assertEqual(sampling / d_cost, k / C)
        self.assertEqual(k / C, F(1, 240))

    def test_locked_grid_lipschitz_budget_retains_half_the_product(self) -> None:
        # Abstract the exact theorem with S=1/32 and sum gamma=10.
        # Grid distance 4/e^(A/2) at the threshold e^(A/2)=4*sum/S
        # costs exactly S/2 under Lipschitz constant sum/2.
        S = F(1, 32)
        gamma_sum = F(10)
        exp_half_A = 4 * gamma_sum / S
        grid_distance = 4 / exp_half_A
        lipschitz_loss = gamma_sum * grid_distance / 2
        self.assertEqual(lipschitz_loss, S / 2)
        self.assertEqual(S - lipschitz_loss, S / 2)

    def test_natural_growing_K_defeats_nearest_grid_condition(self) -> None:
        # The discretization condition contains 2^K.  Already the weaker
        # schematic demand lambda >= 2^K is impossible when K>=lambda>=2.
        for locked_lambda in range(2, 40):
            growing_k = locked_lambda
            self.assertGreater(2**growing_k, locked_lambda)

    def test_note_states_the_exact_fail_closed_boundary(self) -> None:
        normalized = " ".join(NOTE.read_text().split())
        required = (
            "specific moment-ratio witness",
            "no estimate for its `D`-cost",
            "no signed orientation",
            "no RH conclusion",
            "no Lambda bound",
            "failure of the **mean-plus-nearest-grid argument**",
            "does not prove that no favorable locked point exists",
            "qualitative saturation",
        )
        for phrase in required:
            self.assertIn(phrase, normalized)
        forbidden = (
            "therefore the moment-ratio witness collapses",
            "the actual growing-rest signed floor fails",
            "RH follows",
            "Lambda is bounded",
        )
        lowered = normalized.lower()
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), lowered)

    def test_note_contains_binding_constants_and_gates(self) -> None:
        text = NOTE.read_text()
        required = (
            "{512T\\over L\\gamma_{\\min}^2}",
            "{L\\over8\\pi^2}",
            "{\\cal R}_D(H;m,\\lambda)",
            "A_{D,m,\\lambda}^{\\dagger}",
            "J_L\\subseteq\\operatorname {ran}W_{m,\\lambda}",
            "{\\cal R}_D(J_L;m,\\lambda)\\leq C L",
            "d_*(lambda,N)",
            "S_K(H)",
            "e^{A/2}\\geq {4\\sum_{j=1}^K\\gamma_j\\over S_K(H)}",
        )
        for token in required:
            self.assertIn(token, text)
        self.assertNotIn(
            "H_L\\subseteq\\operatorname {ran}W_{m,\\lambda}", text
        )

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
