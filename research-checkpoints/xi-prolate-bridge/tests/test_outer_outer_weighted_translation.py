from __future__ import annotations

import copy
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from outer_outer_weighted_translation import produce  # noqa: E402
from outer_outer_weighted_translation_replay import replay  # noqa: E402


def endpoint(payload: dict[str, object], key: str, side: str) -> mp.mpf:
    raw = payload["intervals"][key]["dyadic"][side]
    return mp.mpf((raw[0], int(raw[1]), raw[2], raw[3]))


class OuterOuterWeightedTranslationTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 120

    def test_producer_and_independent_replay(self):
        payload = produce("2.5", 60)
        result = replay(payload)
        self.assertEqual(result["status"], "ANALYTIC_UNIFORM_COMPONENT_REPLAY_PASS")
        self.assertTrue(result["intervals_reconstructed_from_decimal_parameter"])
        self.assertFalse(result["producer_booleans_trusted"])
        self.assertTrue(all(
            item["overlap"] for item in result["interval_comparisons"].values()
        ))

    def test_doubled_precision_intervals_overlap(self):
        low = produce("2.5", 60)
        high = produce("2.5", 120)
        for key in low["intervals"]:
            lo1, hi1 = endpoint(low, key, "lower"), endpoint(low, key, "upper")
            lo2, hi2 = endpoint(high, key, "lower"), endpoint(high, key, "upper")
            self.assertLessEqual(max(lo1, lo2), min(hi1, hi2), key)

    def test_degree_seven_leading_coefficient_is_lambda_independent(self):
        first = produce("2", 70)
        second = produce("7.25", 70)
        lo1 = endpoint(first, "leading_degree_seven_coefficient", "lower")
        hi1 = endpoint(first, "leading_degree_seven_coefficient", "upper")
        lo2 = endpoint(second, "leading_degree_seven_coefficient", "lower")
        hi2 = endpoint(second, "leading_degree_seven_coefficient", "upper")
        self.assertLessEqual(max(lo1, lo2), min(hi1, hi2))
        self.assertEqual(first["theorem"]["polynomial_degree"], 7)
        self.assertEqual(first["theorem"]["q"], 1)

    def test_all_components_are_positive_and_retained(self):
        payload = produce("2", 70)
        for key in (
            "leading_component",
            "near_component",
            "far_component",
            "prolate_constant",
            "bump_constant",
            "D_S",
        ):
            self.assertGreater(endpoint(payload, key, "lower"), 0, key)
        total = endpoint(payload, "D_S", "lower")
        prolate = endpoint(payload, "prolate_constant", "upper")
        bump = endpoint(payload, "bump_constant", "upper")
        self.assertLessEqual(total, prolate + bump)

    def test_binary64_and_invalid_lambda_are_rejected(self):
        with self.assertRaises(TypeError):
            produce(2.0, 60)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            produce("2e0", 60)
        with self.assertRaises(TypeError):
            produce("2", 60.0)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            produce("1.999", 60)

    def test_replay_rejects_omitted_sawtooth_phase_factor(self):
        payload = produce("2.5", 60)
        payload["locked_formulas"]["sawtooth"] = (
            "||Delta S||^2<=64*delta^(-1)*h^delta"
        )
        with self.assertRaisesRegex(ValueError, "locked formula"):
            replay(payload)

    def test_replay_rejects_incomplete_volterra_or_join_decomposition(self):
        for replacement in (
            "leading sawtooth only",
            "leading + near edge; Volterra remainder omitted",
            "leading + Volterra; artificial joins omitted",
            "leading + Volterra; invisible bump omitted",
        ):
            payload = produce("2.5", 60)
            payload["locked_formulas"]["decomposition"] = replacement
            with self.assertRaisesRegex(ValueError, "locked formula"):
                replay(payload)

    def test_replay_rejects_dropped_reflection_and_unit_normalization(self):
        reflection = produce("2.5", 60)
        reflection["locked_formulas"]["reflection"] = "right tail only"
        with self.assertRaisesRegex(ValueError, "locked formula"):
            replay(reflection)

        normalization = produce("2.5", 60)
        normalization["locked_formulas"]["source_normalization"] = (
            "norm(h_lambda)=1"
        )
        with self.assertRaisesRegex(ValueError, "normalization"):
            replay(normalization)

    def test_replay_rejects_polynomial_or_epsilon_overclaim(self):
        degree = produce("2.5", 60)
        degree["theorem"]["polynomial_degree"] = 6
        with self.assertRaisesRegex(ValueError, "polynomial degree"):
            replay(degree)

        q = produce("2.5", 60)
        q["theorem"]["q"] = 0
        with self.assertRaisesRegex(ValueError, "theorem scope"):
            replay(q)

    def test_replay_rejects_outer_outer_claim_promotion(self):
        payload = copy.deepcopy(produce("2.5", 60))
        payload["claim_scope"]["proved"] += " and the outer--outer Weil bound"
        payload["claim_scope"]["not_proved"] = []
        with self.assertRaisesRegex(ValueError, "claim scope"):
            replay(payload)

    def test_replay_rejects_source_tamper_and_hidden_library_independence(self):
        source = produce("2.5", 60)
        source["source_hashes"]["P1_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "source hashes"):
            replay(source)

        arithmetic = produce("2.5", 60)
        arithmetic["arithmetic"]["shared_library_with_replay"] = False
        with self.assertRaisesRegex(ValueError, "arithmetic"):
            replay(arithmetic)

    def test_replay_rejects_disjoint_interval_without_tolerance(self):
        payload = produce("2.5", 60)
        payload["intervals"]["D_S"] = {
            "decimal": ["0", "0"],
            "dyadic": {
                "lower": [0, "0", 0, 0],
                "upper": [0, "0", 0, 0],
            },
        }
        with self.assertRaisesRegex(ValueError, "interval nonoverlap for D_S"):
            replay(payload)

    def test_replay_rejects_extra_binary64_input(self):
        payload = produce("2.5", 60)
        payload["input"]["lambda_binary64"] = 2.5
        with self.assertRaisesRegex(ValueError, "input inventory"):
            replay(payload)


if __name__ == "__main__":
    unittest.main()
