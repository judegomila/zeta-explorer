from __future__ import annotations

import copy
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from compact_projection_weil_bound import produce  # noqa: E402
from compact_projection_weil_bound_replay import replay  # noqa: E402


def interval_end(payload: dict[str, object], key: str, endpoint: str) -> mp.mpf:
    raw = payload["intervals"][key]["dyadic"][endpoint]
    return mp.mpf((raw[0], int(raw[1]), raw[2], raw[3]))


class CompactProjectionWeilBoundTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 100

    def test_producer_and_independent_replay(self):
        payload = produce(2, 60)
        result = replay(payload)
        self.assertEqual(result["status"], "ANALYTIC_UNIFORM_COMPONENT_REPLAY_PASS")
        self.assertTrue(result["intervals_reconstructed_from_j"])
        self.assertFalse(result["producer_booleans_trusted"])
        self.assertTrue(all(
            item["overlap"] for item in result["interval_comparisons"].values()
        ))

    def test_bound_is_positive_and_decreases_at_next_schedule_point(self):
        first = produce(2, 60)
        second = produce(3, 60)
        first_upper = interval_end(first, "relative_pp_upper", "upper")
        second_upper = interval_end(second, "relative_pp_upper", "upper")
        self.assertGreater(first_upper, 0)
        self.assertGreater(second_upper, 0)
        self.assertLess(second_upper, first_upper)
        self.assertGreater(interval_end(first, "exponent_margin", "lower"), 0)

    def test_source_combination_retains_source_scalar(self):
        payload = produce(2, 60)
        pp = interval_end(payload, "relative_pp_upper", "upper")
        combined = interval_end(
            payload, "source_combination_relative_upper", "upper"
        )
        self.assertGreater(combined, pp)

    def test_binary64_and_bool_inputs_are_rejected(self):
        with self.assertRaises(TypeError):
            produce(2.0, 60)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            produce(True, 60)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            produce(2, 60.0)  # type: ignore[arg-type]

        extra = produce(2, 60)
        extra["input"]["alternate_lambda_binary64"] = 2.5
        with self.assertRaisesRegex(ValueError, "input inventory"):
            replay(extra)

        missing = produce(2, 60)
        del missing["input"]["lambda_exact"]
        with self.assertRaisesRegex(ValueError, "input inventory"):
            replay(missing)

    def test_schedule_before_locked_range_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "j>=2"):
            produce(1, 60)

    def test_replay_rejects_changed_minus_prime_sign(self):
        payload = produce(2, 60)
        payload["locked_formulas"]["weil_sign"] = "Q=W_0,2-W_R+W_p"
        with self.assertRaisesRegex(ValueError, "formula or sign"):
            replay(payload)

    def test_replay_rejects_changed_fourier_basis(self):
        payload = produce(2, 60)
        payload["locked_formulas"]["basis"] = (
            "L^(-1/2)*exp(-2*pi*i*r*(t+log(lambda))/L)"
        )
        with self.assertRaisesRegex(ValueError, "formula or sign"):
            replay(payload)

    def test_replay_rejects_changed_schedule_exponent(self):
        payload = produce(2, 60)
        payload["input"]["schedule_exponent"] += 1
        with self.assertRaisesRegex(ValueError, "schedule exponent"):
            replay(payload)

    def test_replay_rejects_tampered_interval(self):
        payload = produce(2, 60)
        bad = copy.deepcopy(payload)
        bad["intervals"]["relative_pp_upper"] = {
            "decimal": ["0.0", "0.0"],
            "dyadic": {
                "lower": [0, "0", 0, 0],
                "upper": [0, "0", 0, 0],
            },
        }
        with self.assertRaisesRegex(ValueError, "relative_pp_upper"):
            replay(bad)

    def test_replay_rejects_tampered_source_hash(self):
        payload = produce(2, 60)
        payload["source_pins"]["ccm_pdf_sha256"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "CCM source pin"):
            replay(payload)

    def test_replay_rejects_trusted_producer_boolean(self):
        payload = produce(2, 60)
        payload["producer_pass_boolean_trusted_by_replay"] = True
        with self.assertRaisesRegex(ValueError, "must not trust"):
            replay(payload)

    def test_replay_rejects_claim_and_arithmetic_overclaims(self):
        base = produce(2, 60)
        bad_class = copy.deepcopy(base)
        bad_class["claim_class"] = "FULL_BRIDGE"
        with self.assertRaisesRegex(ValueError, "claim class"):
            replay(bad_class)

        bad_scope = copy.deepcopy(base)
        bad_scope["claim_scope"]["not_proved"] = []
        bad_scope["claim_scope"]["proved"] += " and determinant convergence"
        with self.assertRaisesRegex(ValueError, "claim scope"):
            replay(bad_scope)

        bad_arithmetic = copy.deepcopy(base)
        bad_arithmetic["arithmetic"]["shared_library_with_replay"] = False
        with self.assertRaisesRegex(ValueError, "arithmetic metadata"):
            replay(bad_arithmetic)


if __name__ == "__main__":
    unittest.main()
