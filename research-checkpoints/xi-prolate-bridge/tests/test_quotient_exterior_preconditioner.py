from __future__ import annotations

import copy
import json
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from quotient_exterior_preconditioner import (  # noqa: E402
    _serialize,
    canonical_report,
    quotient_point_report,
)
from quotient_exterior_preconditioner_replay import replay_artifact  # noqa: E402


class QuotientExteriorPreconditionerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80

    def artifact(self) -> dict[str, object]:
        return json.loads(json.dumps(_serialize(canonical_report(80), 80)))

    def test_rank_deficient_quotient_identities(self) -> None:
        report = canonical_report(80)
        point = report["quotient_point"]
        self.assertEqual(point["source_kernel_dimension"], 1)
        self.assertFalse(point["source_map_injective"])
        self.assertFalse(point["ordinary_source_inverse_permitted"])
        self.assertLess(point["quotient_floor_identity_defect"], mp.mpf("1e-60"))
        self.assertLessEqual(point["alignment_Gamma"], point["alignment_upper_bound"])

    def test_minimum_energy_preimage(self) -> None:
        # W x=(x_1+x_3,x_2). For v=(2,3), the minimum occurs at x_3=1/5.
        v = mp.matrix([2, 3])
        Delta = mp.diag([mp.mpf(9) / 10, 4])
        quotient_energy = (v.H * Delta * v)[0]
        t = mp.mpf(1) / 5
        x = mp.matrix([2 - t, 3, t])
        D = mp.diag([1, 4, 9])
        source_energy = (x.H * D * x)[0]
        self.assertLess(abs(quotient_energy - mp.mpf("39.6")), mp.mpf("1e-70"))
        self.assertLess(abs(source_energy - quotient_energy), mp.mpf("1e-70"))
        for offset in (mp.mpf("-2"), mp.mpf("-0.1"), mp.mpf("0.3"), mp.mpf("4")):
            candidate = mp.matrix([2 - t - offset, 3, t + offset])
            self.assertGreaterEqual(
                (candidate.H * D * candidate)[0] + mp.mpf("1e-70"),
                quotient_energy,
            )

    def test_general_point_rejects_forcing_outside_range(self) -> None:
        D = mp.eye(2)
        W = mp.matrix([[1, 0], [0, 1], [0, 0]])
        S = mp.eye(3)
        B = mp.eye(3)
        with self.assertRaisesRegex(ValueError, "forcing does not lie"):
            quotient_point_report(D, W, S, B, mp.matrix([0, 0, 1]), 1)

    def test_general_point_rejects_nonpositive_metric(self) -> None:
        D = mp.diag([1, 0])
        W = mp.eye(2)
        with self.assertRaisesRegex(ValueError, "positive definite"):
            quotient_point_report(D, W, mp.eye(2), mp.eye(2), mp.matrix([1, 0]), 1)

    def test_ambient_zero_is_not_a_quotient_floor(self) -> None:
        D = mp.diag([4, 1])
        W = mp.matrix([[1, 1], [0, 0]])
        S = mp.matrix([[1, 0]])
        B = mp.diag([mp.mpf(4) / 5, 1])
        report = quotient_point_report(D, W, S, B, mp.matrix([1, 0]), 1)
        self.assertEqual(report["physical_range_dimension"], 1)
        self.assertLess(abs(report["quotient_floor"] - mp.mpf(4) / 5), mp.mpf("1e-70"))
        self.assertLess(
            abs(report["quotient_matrix_physical"][1, 1]), mp.mpf("1e-70")
        )

    def test_singular_sampling_gram_rejects_forcing_outside_its_range(self) -> None:
        D = mp.eye(2)
        W = mp.eye(2)
        S = mp.matrix([[1, 0]])
        with self.assertRaisesRegex(ValueError, "forcing rank-one"):
            quotient_point_report(D, W, S, mp.eye(2), mp.matrix([0, 1]), 1)

    def test_false_domination_vector_shortcut(self) -> None:
        Delta = mp.diag([1, 100])
        B = mp.matrix([[2, 10], [10, 200]])
        c = mp.matrix([0, 1])
        self.assertGreaterEqual(
            mp.eigsy(B - Delta, eigvals_only=True)[0], -mp.mpf("1e-70")
        )
        action = mp.sqrt(mp.fsum(abs(value) ** 2 for value in mp.lu_solve(B, c)))
        shortcut = mp.sqrt(
            mp.fsum(abs(value) ** 2 for value in mp.lu_solve(Delta, c))
        )
        self.assertGreater(action, shortcut)

    def test_left_factor_order_is_not_reversible(self) -> None:
        Delta = mp.diag([1, 4])
        perturbation = mp.matrix([[0, mp.mpf(1) / 2], [mp.mpf(1) / 2, 0]])
        B = Delta + perturbation
        correct = mp.inverse(mp.eye(2) + mp.inverse(Delta) * perturbation) * mp.inverse(
            Delta
        )
        reversed_factors = mp.inverse(Delta) * mp.inverse(
            mp.eye(2) + mp.inverse(Delta) * perturbation
        )
        self.assertLess(
            max(abs((mp.inverse(B) - correct)[row, column]) for row in range(2) for column in range(2)),
            mp.mpf("1e-70"),
        )
        self.assertGreater(
            max(abs((mp.inverse(B) - reversed_factors)[row, column]) for row in range(2) for column in range(2)),
            mp.mpf("1e-3"),
        )

    def test_modewise_diagonals_do_not_control_sampling_gram(self) -> None:
        dimension = 5
        S = mp.matrix([[1] * dimension])
        G = S.H * S
        self.assertTrue(all(G[index, index] == 1 for index in range(dimension)))
        self.assertEqual(mp.eigsy(G, eigvals_only=True)[-1], dimension)

    def test_independent_exact_replay(self) -> None:
        replay = replay_artifact(self.artifact())
        self.assertTrue(replay["quotient_identity_pass"])
        self.assertTrue(replay["sampling_descent_pass"])
        self.assertTrue(replay["block_cross_term_pass"])
        self.assertFalse(replay["equation_5_2_proved"])

    def test_replay_rejects_terminal_promotion(self) -> None:
        artifact = self.artifact()
        artifact["terminal_state"] = "P0_EXACT_FORMULAS_PASS"
        with self.assertRaisesRegex(ValueError, "terminal state"):
            replay_artifact(artifact)

    def test_replay_rejects_cached_quotient_tamper(self) -> None:
        artifact = self.artifact()
        artifact["quotient_point"]["quotient_matrix_physical"][0][0] = "1"
        with self.assertRaisesRegex(ValueError, "quotient matrix"):
            replay_artifact(artifact)

    def test_replay_rejects_binary64_exact_input(self) -> None:
        artifact = self.artifact()
        artifact["exact_inputs"]["D_integer_diagonal"][0] = 1.0
        with self.assertRaisesRegex(ValueError, "exact inputs"):
            replay_artifact(artifact)

    def test_replay_rejects_injectivity_promotion(self) -> None:
        artifact = self.artifact()
        artifact["quotient_point"]["source_map_injective"] = True
        with self.assertRaisesRegex(ValueError, "promoted to injective"):
            replay_artifact(artifact)

    def test_replay_rejects_dropped_cross_block_sum(self) -> None:
        artifact = self.artifact()
        block = artifact["block_cross_term_regression"]
        block["cross_aware_constant_formula"] = block[
            "incorrect_maximum_of_block_constants"
        ]
        with self.assertRaisesRegex(ValueError, "cross_aware_constant_formula"):
            replay_artifact(artifact)

    def test_replay_rejects_false_sampling_constant(self) -> None:
        artifact = self.artifact()
        artifact["exact_expected_rationals"]["C_min"] = "4/3"
        with self.assertRaisesRegex(ValueError, "C_min"):
            replay_artifact(artifact)

    def test_replay_rejects_provenance_tamper(self) -> None:
        artifact = self.artifact()
        artifact["provenance_sha256"][
            "src/quotient_exterior_preconditioner.py"
        ] = "0" * 64
        with self.assertRaisesRegex(ValueError, "provenance"):
            replay_artifact(artifact)

    def test_replay_rejects_claim_promotion(self) -> None:
        artifact = self.artifact()
        artifact["theorem_flags"]["defect_relative_exterior_sampling_proved"] = True
        with self.assertRaisesRegex(ValueError, "flags"):
            replay_artifact(artifact)


if __name__ == "__main__":
    unittest.main()
