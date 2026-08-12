#!/usr/bin/env python3
"""Exact regressions for the low forcing rate and full-metric barriers."""

from __future__ import annotations

from fractions import Fraction as F
import ast
import hashlib
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md":
        "b0254889d35ae41a92ee926dd116b473ee427e2762f8853903f4e80e307860ed",
    "notes/GROWING_TRANSITION_SAMPLING_THEOREM.md":
        "551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72",
    "notes/BLOCK_QUOTIENT_ACTION_THEOREM.md":
        "31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4",
    "notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md":
        "33f064c07a134986afa23efb91f7514e27828543b09cc358ebfff01e79c6f16e",
    "notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md":
        "113be74d52f48d66903c1babf1525ec6d130243321acfa31562abd8640868a3a",
    "notes/PARITY_SHIFT_SCALE_AUDIT.md":
        "dee08d1833047dea48a962d7b37738cc5eba0b48e9078ac90b103904b64091b0",
}


def mat_vec(matrix: tuple[tuple[F, F], tuple[F, F]], vector: tuple[F, F]) -> tuple[F, F]:
    return (
        matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
        matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
    )


def inverse_2(matrix: tuple[tuple[F, F], tuple[F, F]]) -> tuple[tuple[F, F], tuple[F, F]]:
    determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    if determinant == 0:
        raise ZeroDivisionError("singular matrix")
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


class LowBlockForcingRateFullMetricBarrierTests(unittest.TestCase):
    maxDiff = None

    def test_frozen_dependency_hashes(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            actual = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(actual, expected, relative)

    def test_fixed_index_ratio_and_little_o_power_are_exact(self) -> None:
        # A_8/A_6 = (16*pi)^2*6!/8! = (32/7)*pi^2.
        coefficient = F(16**2) * F(1 * 2 * 3 * 4 * 5 * 6, 1 * 2 * 3 * 4 * 5 * 6 * 7 * 8)
        self.assertEqual(coefficient, F(32, 7))
        gamma_power = F(3)
        d6_over_d8_power = F(-4)
        squared_forcing_power = gamma_power + d6_over_d8_power
        self.assertEqual(squared_forcing_power, F(-1))
        self.assertEqual(squared_forcing_power / 2, F(-1, 2))

    def test_block_row_operator_bound_retains_mixed_term(self) -> None:
        c8, m8, cr, mr = F(1), F(4), F(9), F(1)
        # Squaring the complete row triangle retains the positive mixed term.
        diagonal = c8 * m8 + cr * mr
        mixed = 2 * F(2) * F(3)
        complete_square = (F(2) + F(3)) ** 2
        self.assertEqual(diagonal, F(13))
        self.assertEqual(mixed, F(12))
        self.assertEqual(complete_square, diagonal + mixed)

    def test_full_metric_family_has_identical_diagonal_blocks(self) -> None:
        for delta in (F(1, 2), F(1, 3), F(1, 5)):
            full = ((F(1), -(1 - delta)), (-(1 - delta), F(1)))
            self.assertEqual((full[0][0], full[1][1]), (F(1), F(1)))
            self.assertEqual(full[0][0] * full[1][1] - full[0][1] ** 2, delta * (2 - delta))
            self.assertGreater(delta, 0)
            self.assertGreater(2 - delta, 0)

    def test_block_and_full_quotient_actions_are_exact(self) -> None:
        w = (F(1), F(1))
        for delta in (F(1, 2), F(1, 3), F(1, 5)):
            block_inverse = ((F(1), F(0)), (F(0), F(1)))
            full = ((F(1), -(1 - delta)), (-(1 - delta), F(1)))
            full_inverse = inverse_2(full)
            r_block = sum(x * y for x, y in zip(w, mat_vec(block_inverse, w)))
            r_full = sum(x * y for x, y in zip(w, mat_vec(full_inverse, w)))
            self.assertEqual(r_block, 2)
            self.assertEqual(r_full, 2 / delta)
            delta_block = 1 / r_block
            delta_full = 1 / r_full
            self.assertEqual(delta_block, F(1, 2))
            self.assertEqual(delta_full, delta / 2)
            self.assertEqual(1 / delta_block**2, 4)
            self.assertEqual(1 / delta_full**2, 4 / delta**2)

    def test_full_metric_has_exact_defect_plus_anchor_form(self) -> None:
        delta = F(2, 7)
        anchor = (F(1), F(-1))
        reconstructed = tuple(
            tuple(delta * (i == j) + (1 - delta) * anchor[i] * anchor[j] for j in range(2))
            for i in range(2)
        )
        expected = ((F(1), -(1 - delta)), (-(1 - delta), F(1)))
        self.assertEqual(reconstructed, expected)

    def test_signed_coupling_keeps_marginals_but_blows_up_action(self) -> None:
        forcing = (F(1), F(-1))
        for delta in (F(1, 2), F(1, 3), F(1, 5)):
            signed = ((F(1), 1 - delta), (1 - delta, F(1)))
            self.assertEqual((signed[0][0], signed[1][1]), (F(1), F(1)))
            self.assertEqual(signed[0][0] * signed[1][1] - signed[0][1] ** 2, delta * (2 - delta))
            action = mat_vec(inverse_2(signed), forcing)
            self.assertEqual(action, (1 / delta, -1 / delta))
            self.assertEqual(abs(1 - delta), 1 - delta)

    def test_positive_marginals_do_not_imply_full_positivity(self) -> None:
        signed = ((F(1), F(2)), (F(2), F(1)))
        self.assertEqual((signed[0][0], signed[1][1]), (F(1), F(1)))
        self.assertLess(signed[0][0] * signed[1][1] - signed[0][1] ** 2, 0)

    def test_note_states_conditional_reserve_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "Positive-sampling low-block forcing rate, conditional signed action",
            "Theorem 2.1 (positive forcing; conditional action)",
            "G_L=P_{K_L}S^*S|_{K_L}",
            "c_Lc_L^*<=epsilon_lambda G_L",
            "M_8=O\\!\\left({\\lambda^2\\over d_8}\\right)",
            "M_R=O\\!\\left({\\lambda^{-2}\\over d_8}\\right)",
            "positive-sampling **forcing factor**",
            "still-unproved uniform signed left-preconditioned hypothesis",
            "uses `D_bd` consistently",
            "No actual residual action, equation (5.2)",
            "every low/high signed coupling",
            "o\\!\\left(\\lambda^{-1/2}P(\\lambda)^{1/2}\\right)",
        )
        for phrase in required:
            self.assertIn(phrase, text)
        self.assertNotIn("equation (5.2) is proved", text)
        self.assertNotIn("proves RH", text)

    def test_package_is_stdlib_only_and_has_clean_bytes(self) -> None:
        tree = ast.parse(TEST.read_text(encoding="utf-8"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".")[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".")[0])
        self.assertLessEqual(imported, {"__future__", "fractions", "ast", "hashlib", "pathlib", "unittest"})
        for path in (NOTE, TEST):
            payload = path.read_bytes()
            self.assertNotIn(b"\x00", payload)
            self.assertNotIn(b"\r", payload)
            self.assertTrue(payload.endswith(b"\n"))
            self.assertTrue(all(byte < 128 for byte in payload))


if __name__ == "__main__":
    unittest.main()
