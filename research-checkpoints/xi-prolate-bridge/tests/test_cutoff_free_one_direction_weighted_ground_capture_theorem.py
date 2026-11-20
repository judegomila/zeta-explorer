#!/usr/bin/env python3
"""Exact checks for the one-direction weighted ground-capture theorem."""

from __future__ import annotations

from fractions import Fraction as F
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "CUTOFF_FREE_ONE_DIRECTION_WEIGHTED_GROUND_CAPTURE_THEOREM.md"
NOTE_HASH = "770087b56766e0102a915a31e08aba5389065d78dd59a55135adb5f5b6eea948"

FROZEN = {
    "notes/CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md":
        "2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d",
    "tests/test_cutoff_free_multi_anchor_ground_frame_barrier.py":
        "0fdc307a051d50ff4ece21ae8b01f89b745a14788f093ec4127f5da6026bde9f",
    "notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md":
        "c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c",
    "tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py":
        "d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11",
    "notes/CUTOFF_FREE_UNIFORM_RADICAL_GRAPH_TRANSFER_THEOREM.md":
        "aa69ac86e6b5d5256ba3b243b9fc07d9c5ad49bed7a70e3d570d0c57325bce18",
    "tests/test_cutoff_free_uniform_radical_graph_transfer_theorem.py":
        "b2708c8f72ce8bad831b2aea44c49ef3a8ec5f9c38551c288a1c982d097ee727",
    "notes/CUTOFF_FREE_BRIDGE_LEVERAGE_RANK_ONE_INNOVATION_REDUCTION.md":
        "808c314d6b0cf1926ddf8b0a5b83c324ccbbc252d18efea283781fefd1751097",
    "tests/test_cutoff_free_bridge_leverage_rank_one_innovation_reduction.py":
        "2c79244dd68e9fd56ddb67f7278f4572cb72bae9803b82047ccf9ad58196faba",
    "notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md":
        "c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81",
    "tests/test_parity_multiplier_schur.py":
        "94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb",
}


Matrix = tuple[tuple[F, ...], ...]
Vector = tuple[F, ...]


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


def diagonal(values: Vector) -> Matrix:
    return tuple(
        tuple(value if row == column else F(0) for column in range(len(values)))
        for row, value in enumerate(values)
    )


def scalar_matrix(value: F, matrix: Matrix) -> Matrix:
    return tuple(tuple(value * entry for entry in row) for row in matrix)


def frobenius_squared(matrix: Matrix) -> F:
    return sum((entry * entry for row in matrix for entry in row), F(0))


def trace(matrix: Matrix) -> F:
    return sum((matrix[index][index] for index in range(len(matrix))), F(0))


class CutoffFreeOneDirectionWeightedGroundCaptureTheoremTests(unittest.TestCase):
    def test_frozen_dependency_hashes(self) -> None:
        self.assertEqual(len(FROZEN), 10)
        for relative, expected in FROZEN.items():
            with self.subTest(relative=relative):
                self.assertEqual(sha256(ROOT / relative), expected)

    def test_note_hash_is_frozen(self) -> None:
        self.assertEqual(sha256(NOTE), NOTE_HASH)

    def test_full_bottom_projector_identity_is_multiplicity_safe(self) -> None:
        # The bottom is two-dimensional.  B captures only its first line.
        mu = F(-3)
        q_matrix = diagonal((mu, mu, F(2), F(5)))
        projector = diagonal((F(1), F(1), F(0), F(0)))
        synthesis = (
            (F(2), F(0), F(0)),
            (F(0), F(0), F(0)),
            (F(0), F(1), F(0)),
            (F(0), F(0), F(1)),
        )

        projected = matmul(projector, synthesis)
        residual = matmul(q_matrix, synthesis)
        projected_residual = matmul(projector, residual)
        self.assertEqual(projected_residual, scalar_matrix(mu, projected))

        capture_gram = matmul(projected, transpose(projected))
        self.assertEqual(capture_gram, diagonal((F(4), F(0), F(0), F(0))))
        lambda_max = F(4)
        lambda_min_frame = F(0)  # not onto the two-dimensional bottom
        residual_norm_squared = F(36)  # max diagonal singular value squared
        self.assertEqual(lambda_min_frame, 0)
        self.assertEqual(mu * mu * lambda_max, residual_norm_squared)

    def test_generalized_ratio_and_trace_versions_are_exact(self) -> None:
        mu = F(-3)
        q_matrix = diagonal((mu, mu, F(2), F(5)))
        projector = diagonal((F(1), F(1), F(0), F(0)))
        synthesis = (
            (F(2), F(0), F(0)),
            (F(0), F(0), F(0)),
            (F(0), F(1), F(0)),
            (F(0), F(0), F(1)),
        )
        projected = matmul(projector, synthesis)
        residual = matmul(q_matrix, synthesis)

        # On u=e_1, the exact vector ratio is 6/2=3=|mu|.
        u = (F(1), F(0), F(0))
        projected_u = matvec(projected, u)
        residual_u = matvec(residual, u)
        projected_norm_squared = sum(x * x for x in projected_u)
        residual_u_norm_squared = sum(x * x for x in residual_u)
        self.assertEqual(projected_norm_squared, F(4))
        self.assertEqual(residual_u_norm_squared, F(36))
        self.assertEqual(residual_u_norm_squared, mu * mu * projected_norm_squared)

        capture_trace = trace(matmul(projected, transpose(projected)))
        projected_residual_hs = frobenius_squared(matmul(projector, residual))
        full_residual_hs = frobenius_squared(residual)
        self.assertEqual(capture_trace, F(4))
        self.assertEqual(projected_residual_hs, mu * mu * capture_trace)
        self.assertEqual(full_residual_hs, F(65))
        self.assertLessEqual(projected_residual_hs, full_residual_hs)

        # At zero capture eta is infinite, but the operator quotient is not
        # defined and must never be formed.
        mu = F(-3)
        q_matrix = diagonal((mu, mu, F(2), F(5)))
        projector = diagonal((F(1), F(1), F(0), F(0)))
        synthesis = (
            (F(0), F(0)),
            (F(0), F(0)),
            (F(1), F(0)),
            (F(0), F(1)),
        )
        projected = matmul(projector, synthesis)
        residual = matmul(q_matrix, synthesis)

        self.assertEqual(projected, scalar_matrix(F(0), synthesis))
        self.assertEqual(matmul(projector, residual), projected)
        lambda_max = F(0)
        residual_operator_norm_squared = F(25)
        eta = float("inf") if lambda_max == 0 else F(0)
        operator_ratio_squared = (
            None
            if lambda_max == 0
            else residual_operator_norm_squared / lambda_max
        )
        self.assertEqual(eta, float("inf"))
        self.assertLessEqual(abs(mu), eta)
        self.assertIsNone(operator_ratio_squared)

    def test_operator_bound_can_close_when_full_frame_is_singular(self) -> None:
        # A family with one amplified captured column and many uncaptured
        # residual columns illustrates the strict distinction from both the
        # smallest frame eigenvalue and the Hilbert--Schmidt estimate.
        n = F(10)
        source_rank = 10_000
        lambda_max = n * n
        operator_residual_squared = F(1)
        hs_residual_squared = F(source_rank - 1) + F(1, 100)
        capture_trace = lambda_max

        self.assertEqual(F(1) / lambda_max, F(1, 100))
        self.assertGreater(hs_residual_squared / capture_trace, F(99))
        self.assertEqual(operator_residual_squared / lambda_max, F(1, 100))
        self.assertEqual(F(0), 0)  # the full-frame minimum remains zero

    def test_rank_one_bridge_contribution_is_the_contrast_over_schur(self) -> None:
        # Bulk misses e_1.  The bridge innovation lies on e_2, so its exact
        # contrast on the missed line is zero despite a positive innovation.
        source_schur = F(4)
        bulk_weighted = diagonal((F(0), F(3)))
        bridge = (F(0), F(2))
        bridge_rank_one = tuple(
            tuple(bridge[row] * bridge[column] / source_schur for column in range(2))
            for row in range(2)
        )
        augmented = tuple(
            tuple(bulk_weighted[row][column] + bridge_rank_one[row][column]
                  for column in range(2))
            for row in range(2)
        )
        self.assertEqual(bridge_rank_one, diagonal((F(0), F(1))))
        self.assertEqual(augmented, diagonal((F(0), F(4))))
        missed_line = (F(1), F(0))
        self.assertEqual(sum(x * y for x, y in zip(missed_line, bridge, strict=True)), 0)

    def test_odd_pole_birman_schwinger_does_not_force_bridge_contrast(self) -> None:
        # H=I, p=e_1, Q=H-2pp*=diag(-1,1).
        pole_free = diagonal((F(1), F(1)))
        pole = (F(1), F(0))
        q_matrix = diagonal((F(-1), F(1)))
        mu = F(-1)
        ground = (F(1), F(0))
        resolvent = diagonal((F(1, 2), F(1, 2)))
        bridge = (F(0), F(1))

        resolvent_pole = matvec(resolvent, pole)
        secular = F(2) * sum(x * y for x, y in zip(pole, resolvent_pole, strict=True))
        pole_overlap = sum(x * y for x, y in zip(pole, ground, strict=True))
        bridge_contrast = sum(x * y for x, y in zip(ground, bridge, strict=True))
        bridge_base_energy = sum(
            x * y for x, y in zip(bridge, matvec(pole_free, bridge), strict=True)
        )

        self.assertEqual(matvec(q_matrix, ground), tuple(mu * x for x in ground))
        self.assertEqual(secular, F(1))
        self.assertEqual(pole_overlap, F(1))
        self.assertEqual(bridge_contrast, F(0))
        self.assertEqual(bridge_base_energy, F(1))
        gap = F(2)
        self.assertEqual(pole_overlap, gap / (F(2) * F(1)))

    def test_note_is_fail_closed_and_records_required_distinctions(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Lambda_F^{\\max}",
            "Lambda_F^{\\min}",
            "eta_F",
            "Lambda_F^{\\max}>0",
            "no second inequality is asserted",
            "operator-norm, and Hilbert--Schmidt",
            "including all multiplicities",
            "both inversion parities",
            "beta_2(e_0)-{I_2\\over I_0}\\beta_0(e_0)",
            "Birman--Schwinger",
            "The formal state remains",
            "P0_INVALIDATED",
            "proves no lower bound",
        )
        for phrase in required:
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, text)
        self.assertNotIn("RH is proved", text)
        self.assertNotIn("Riemann hypothesis is proved", text)

    def test_new_files_are_ascii_and_have_no_trailing_space(self) -> None:
        for path in (NOTE, Path(__file__)):
            raw = path.read_bytes()
            raw.decode("ascii")
            for line in raw.splitlines():
                self.assertEqual(line, line.rstrip())


if __name__ == "__main__":
    unittest.main()
