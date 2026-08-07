from __future__ import annotations

import copy
import sys
import unittest
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from physical_map_conditioning import (  # noqa: E402
    conditioning_reduction_report,
    determinant_floor_from_bounds,
    endpoint_jet_leading_coefficient,
    half_integer_breakpoint_data,
    mobius_conditioning_data,
    normalized_gram_point_report,
)
from physical_map_conditioning_replay import replay_artifact  # noqa: E402


def _serialize(value: object, digits: int = 60) -> object:
    if isinstance(value, (mp.mpf, mp.mpc)):
        return mp.nstr(mp.re(value), digits)
    if isinstance(value, dict):
        return {key: _serialize(item, digits) for key, item in value.items()}
    if isinstance(value, list):
        return [_serialize(item, digits) for item in value]
    return value


class PhysicalMapConditioningTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 80

    def test_exact_half_integer_breakpoint_is_unmatched(self) -> None:
        for lambda_text in ("3/2", "5/2", "7/2", "9/2"):
            data = half_integer_breakpoint_data(lambda_text)
            self.assertEqual(data["odd_square_mod_8"], 1)
            self.assertFalse(data["reflected_index_is_integer"])
            self.assertTrue(data["unmatched_breakpoint_hypothesis_pass"])

    def test_integer_lambda_is_rejected_by_schedule_lemma(self) -> None:
        with self.assertRaisesRegex(ValueError, "strict half-integer"):
            half_integer_breakpoint_data("2")

    def test_mobius_conditioning_constant_obeys_elementary_bound(self) -> None:
        data = mobius_conditioning_data("5/2")
        self.assertEqual(data["cutoff_floor_lambda_squared"], 6)
        self.assertEqual(data["mobius_1_to_cutoff"], [1, -1, -1, 0, -1, 1])
        self.assertTrue(data["bound_pass"])
        self.assertGreater(data["upper_bound_defect"], 0)

    def test_endpoint_jet_leading_coefficients(self) -> None:
        expected = ["1", "1/2", "1/8", "1/48", "1/384", "1/3840"]
        self.assertEqual(
            [str(endpoint_jet_leading_coefficient(order)) for order in range(6)],
            expected,
        )

    def test_normalized_gram_determinant_floor(self) -> None:
        B = mp.matrix([[2, mp.mpf("0.1")], [mp.mpf("0.1"), 3]])
        W = mp.matrix(
            [
                [1, mp.mpc("0.2", "0.1")],
                [mp.mpc("0.3", "-0.2"), 2],
                [mp.mpf("0.4"), mp.mpf("-0.3")],
            ]
        )
        report = normalized_gram_point_report(B, W)
        self.assertTrue(report["finite_point_injective"])
        self.assertGreaterEqual(report["criterion_below_true_floor_defect"], -mp.mpf("1e-70"))
        with self.assertRaisesRegex(ValueError, "Hermitian"):
            normalized_gram_point_report(mp.matrix([[1, 1], [0, 1]]), mp.eye(2))
        with self.assertRaisesRegex(ValueError, "positive dimension"):
            normalized_gram_point_report(mp.matrix(0, 0), mp.matrix(0, 0))

    def test_determinant_bound_rejects_nonpositive_inputs(self) -> None:
        with self.assertRaises(ValueError):
            determinant_floor_from_bounds(0, 1, 2)
        with self.assertRaises(ValueError):
            determinant_floor_from_bounds(1, 0, 2)

    def test_independent_replay(self) -> None:
        artifact = _serialize(conditioning_reduction_report("5/2", 60))
        replay = replay_artifact(artifact)  # type: ignore[arg-type]
        self.assertTrue(replay["mobius_inversion_inputs_replayed"])
        self.assertTrue(replay["unmatched_breakpoint_replayed"])
        self.assertFalse(replay["uniform_physical_conditioning_proved"])

    def test_replay_rejects_binary64_and_reported_field_tamper(self) -> None:
        artifact = _serialize(conditioning_reduction_report("5/2", 60))
        tampered = copy.deepcopy(artifact)
        tampered["mobius"]["lambda_exact"] = 2.5
        with self.assertRaisesRegex(ValueError, "exact text"):
            replay_artifact(tampered)  # type: ignore[arg-type]

        mutations = (
            ("elementary_upper_2lambda", "6.0"),
            ("upper_bound_defect", "0.0"),
            ("bound_pass", False),
        )
        for key, replacement in mutations:
            with self.subTest(key=key):
                tampered = copy.deepcopy(artifact)
                tampered["mobius"][key] = replacement
                with self.assertRaisesRegex(ValueError, "inconsistent"):
                    replay_artifact(tampered)  # type: ignore[arg-type]

    def test_replay_rejects_uniform_promotion(self) -> None:
        artifact = _serialize(conditioning_reduction_report("5/2", 60))
        artifact["uniform_physical_conditioning_proved"] = True
        with self.assertRaisesRegex(ValueError, "promoted"):
            replay_artifact(artifact)  # type: ignore[arg-type]

        artifact = _serialize(conditioning_reduction_report("5/2", 60))
        artifact["artifact_version"] = "0.15.1-unknown"
        with self.assertRaisesRegex(ValueError, "artifact version"):
            replay_artifact(artifact)  # type: ignore[arg-type]

    def test_replay_rejects_provenance_tamper(self) -> None:
        artifact = _serialize(conditioning_reduction_report("5/2", 60))
        artifact["provenance_sha256"]["src/physical_map_conditioning.py"] = "f" * 64
        with self.assertRaisesRegex(ValueError, "provenance hash"):
            replay_artifact(artifact)  # type: ignore[arg-type]


if __name__ == "__main__":
    unittest.main()
