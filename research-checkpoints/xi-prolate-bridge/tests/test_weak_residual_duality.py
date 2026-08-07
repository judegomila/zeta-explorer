from __future__ import annotations

import copy
import sys
import unittest
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from weak_residual_duality import (  # noqa: E402
    canonical_obstruction_report,
    weak_dual_point_report,
)
from weak_residual_duality_replay import replay_artifact  # noqa: E402


def _serialized_report(dps: int = 60) -> dict[str, object]:
    report = canonical_obstruction_report(dps)

    def convert(value: object) -> object:
        if isinstance(value, (mp.mpf, mp.mpc)):
            return mp.nstr(mp.re(value), dps)
        if isinstance(value, dict):
            return {key: convert(item) for key, item in value.items()}
        if isinstance(value, list):
            return [convert(item) for item in value]
        return value

    return convert(report)  # type: ignore[return-value]


class WeakResidualDualityTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 80

    def test_graph_dual_identity_for_complex_data(self) -> None:
        A = mp.matrix(
            [
                [mp.mpf("3"), mp.mpc("0.1", "0.2")],
                [mp.mpc("0.1", "-0.2"), mp.mpf("7")],
            ]
        )
        D = mp.matrix([[mp.mpf("2"), 0], [0, mp.mpf("5")]])
        b = mp.matrix([mp.mpc("0.2", "-0.1"), mp.mpc("-0.3", "0.4")])
        a = mp.mpf("1.7")
        ell = -a * b
        report = weak_dual_point_report(A, b, D, 0, a, ell)
        self.assertLess(report["graph_duality_defect"], mp.mpf("1e-70"))
        self.assertLess(report["leakage_identity_defect"], mp.mpf("1e-70"))
        self.assertTrue(report["preconditioner_hypothesis_pass"])
        self.assertGreaterEqual(report["upper_minus_shifted_action"], -mp.mpf("1e-70"))

    def test_leakage_identity_mismatch_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "radical leakage identity"):
            weak_dual_point_report(
                mp.matrix([[2]]),
                mp.matrix([1]),
                mp.matrix([[2]]),
                0,
                1,
                mp.matrix([1]),
            )

    def test_nonpositive_preconditioner_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "positive definite"):
            weak_dual_point_report(
                mp.matrix([[2]]),
                mp.matrix([1]),
                mp.matrix([[0]]),
                0,
                1,
                mp.matrix([-1]),
            )

    def test_graph_norm_cannot_be_replaced_by_energy_norm(self) -> None:
        epsilon = mp.mpf("1e-20")
        D = mp.matrix([[epsilon, 0], [0, 1]])
        b = mp.matrix([1, 0])
        graph_dual = mp.norm(mp.lu_solve(D, b))
        energy_dual = 1 / mp.sqrt(epsilon)
        self.assertEqual(graph_dual, 1 / epsilon)
        self.assertGreater(graph_dual, mp.mpf("1e9") * energy_dual)

    def test_exact_obstruction_has_zero_scalars_and_nonzero_action(self) -> None:
        report = canonical_obstruction_report(80)
        self.assertEqual(report["radical_left_norm"], 0)
        self.assertEqual(report["radical_right_norm"], 0)
        self.assertTrue(all(value == 0 for value in report["scalar_pairings"].values()))
        self.assertEqual(report["cross_pairing_e_remainder"], 1)
        self.assertEqual(report["cross_pairing_e_p"], -1)
        self.assertTrue(report["strict_even_comparison"])
        self.assertTrue(report["strict_odd_comparison"])
        self.assertGreater(report["weighted_action_tau"], mp.mpf("0.6"))

    def test_independent_replay_reconstructs_exact_matrices(self) -> None:
        artifact = _serialized_report()
        replay = replay_artifact(artifact)
        self.assertTrue(replay["exact_radical_replay_pass"])
        self.assertTrue(replay["exact_scalar_pairings_zero"])
        self.assertTrue(replay["exact_residual_nonzero"])
        self.assertEqual(replay["replay_precision_decimal_digits"], 60)
        tau_digits = replay["weighted_action_tau"].replace(".", "").lstrip("-0")
        self.assertGreaterEqual(len(tau_digits), 58)

    def test_independent_replay_rejects_tampered_matrix_and_claim_fields(self) -> None:
        artifact = _serialized_report()
        tampered = copy.deepcopy(artifact)
        tampered["W_exact_integer_rows"][3][1] = "0"
        with self.assertRaisesRegex(ValueError, "independent exact reconstruction"):
            replay_artifact(tampered)

        mutations = (
            (("scalar_pairings", "outer_outer"), "1.0"),
            (("cross_pairing_e_remainder",), "0.0"),
            (("residual_norm",), "0.0"),
            (("strict_even_comparison",), False),
            (("weak_dual", "preconditioner_hypothesis_pass"), False),
        )
        for path, replacement in mutations:
            with self.subTest(path=path):
                tampered = copy.deepcopy(artifact)
                target = tampered
                for key in path[:-1]:
                    target = target[key]
                target[path[-1]] = replacement
                with self.assertRaisesRegex(ValueError, "inconsistent"):
                    replay_artifact(tampered)

    def test_independent_replay_rejects_promoted_status(self) -> None:
        artifact = _serialized_report()
        artifact["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        with self.assertRaisesRegex(ValueError, "promotion"):
            replay_artifact(artifact)

        artifact = _serialized_report()
        artifact["artifact_version"] = "0.15.1-unknown"
        with self.assertRaisesRegex(ValueError, "artifact version"):
            replay_artifact(artifact)

    def test_independent_replay_rejects_provenance_tamper(self) -> None:
        artifact = _serialized_report()
        artifact["provenance_sha256"]["src/weak_residual_duality.py"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "provenance hash"):
            replay_artifact(artifact)


if __name__ == "__main__":
    unittest.main()
