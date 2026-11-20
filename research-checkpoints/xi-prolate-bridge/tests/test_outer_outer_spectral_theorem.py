from __future__ import annotations

import copy
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from outer_outer_spectral_theorem import produce  # noqa: E402
from outer_outer_spectral_theorem_replay import (  # noqa: E402
    ReplayError,
    replay,
)


def endpoint(payload: dict[str, object], key: str, side: str) -> mp.mpf:
    raw = payload["intervals"][key]["dyadic"][side]
    return mp.mpf((raw[0], int(raw[1]), raw[2], raw[3]))


class OuterOuterSpectralTheoremTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 140

    def test_producer_and_independent_replay(self):
        payload = produce("2.5", 60)
        result = replay(payload)
        self.assertEqual(
            result["status"],
            "ANALYTIC_UNIFORM_OUTER_OUTER_SPECTRAL_REPLAY_PASS",
        )
        self.assertTrue(result["source_bytes_rechecked"])
        self.assertTrue(result["zero_source_independent_q1_replay"])
        self.assertTrue(result["transcendentals_reconstructed_from_source_parameters"])
        self.assertFalse(result["producer_booleans_trusted"])
        self.assertFalse(result["zero_list_read"])
        self.assertFalse(result["zeros_assumed_real_globally"])
        self.assertTrue(
            all(item["overlap"] for item in result["interval_comparisons"].values())
        )

    def test_replay_does_not_depend_on_ambient_mpmath_precision(self):
        payload = produce("2.5", 100)
        with mp.workdps(15):
            result = replay(payload)
        self.assertEqual(
            result["status"],
            "ANALYTIC_UNIFORM_OUTER_OUTER_SPECTRAL_REPLAY_PASS",
        )

    def test_doubled_precision_intervals_overlap(self):
        low = produce("2.5", 60)
        high = produce("2.5", 120)
        for key in low["intervals"]:
            lo1, hi1 = endpoint(low, key, "lower"), endpoint(low, key, "upper")
            lo2, hi2 = endpoint(high, key, "lower"), endpoint(high, key, "upper")
            self.assertLessEqual(max(lo1, lo2), min(hi1, hi2), key)

    def test_low_constant_is_exactly_128_times_finite_overlap(self):
        payload = produce("2", 70)
        z_lo = endpoint(payload, "Z_finite", "lower")
        z_hi = endpoint(payload, "Z_finite", "upper")
        c_lo = endpoint(payload, "C_low", "lower")
        c_hi = endpoint(payload, "C_low", "upper")
        self.assertLessEqual(c_lo, 128 * z_hi)
        self.assertGreaterEqual(c_hi, 128 * z_lo)
        self.assertEqual(payload["theorem"]["low_block_coefficient"], "128*Z_finite")

    def test_degree_seven_majorant_is_positive_and_holds(self):
        for lambda_text in ("2", "2.5", "7.25"):
            with self.subTest(lambda_text=lambda_text):
                payload = produce(lambda_text, 70)
                self.assertGreaterEqual(endpoint(payload, "majorant_slack", "upper"), 0)
                self.assertLessEqual(
                    endpoint(payload, "D_S_over_lambda7", "upper"),
                    endpoint(payload, "C_D", "upper"),
                )
                self.assertEqual(payload["theorem"]["D_S_polynomial_degree"], 7)

    def test_high_series_is_exact_q1_and_not_numerically_truncated(self):
        payload = produce("2.5", 70)
        self.assertEqual(payload["theorem"]["translation_exponent_q"], 1)
        self.assertFalse(payload["theorem"]["high_series_evaluated_by_truncation"])
        self.assertTrue(payload["series"]["exact_infinite_series_used_in_theorem"])
        self.assertFalse(payload["series"]["numeric_sum_claimed"])
        self.assertEqual(payload["series"]["stored_terms_are_cross_checks_only"], [0, 34, 64])
        for index in (0, 34, 64):
            self.assertGreater(endpoint(payload, f"high_term_j{index}", "lower"), 0)

    def test_rejects_assumed_real_zeros(self):
        payload = produce("2.5", 60)
        payload["source_admissions"][
            "global_zeros_assumed_real_or_on_critical_line"
        ] = True
        with self.assertRaisesRegex(ReplayError, "assumed-real zeros"):
            replay(payload)

    def test_rejects_rounded_hsw_corollary_substitution(self):
        payload = produce("2.5", 60)
        payload["source_admissions"]["hsw_rounded_corollary_substituted"] = True
        payload["source_admissions"]["hsw_sampling_input"] = (
            "rounded HSW corollary with 0.1038, 0.2573, 9.3675"
        )
        with self.assertRaisesRegex(ReplayError, "HSW substitution"):
            replay(payload)

    def test_rejects_dropped_reflected_tail(self):
        payload = produce("2.5", 60)
        payload["locked_formulas"]["reflected_state"] = "O=(1-C)*E(tilde_h)"
        payload["source_admissions"]["both_reflected_tails_retained"] = False
        with self.assertRaisesRegex(ReplayError, "reflection"):
            replay(payload)

    def test_rejects_omitted_sawtooth_phase_factor(self):
        payload = produce("2.5", 60)
        payload["locked_formulas"]["sawtooth_with_phase"] = (
            "||Delta S||_2^2<=64*delta^(-1)*h^delta"
        )
        payload["source_admissions"]["sawtooth_phase_factor_retained"] = False
        with self.assertRaisesRegex(ReplayError, "phase"):
            replay(payload)

    def test_rejects_gamma_zero_omission_and_low_factor_mutation(self):
        gamma_zero = produce("2.5", 60)
        gamma_zero["locked_formulas"]["gamma_zero"] = "PT is extended to gamma=0"
        with self.assertRaisesRegex(ReplayError, "locked formula"):
            replay(gamma_zero)

        low_factor = produce("2.5", 60)
        low_factor["locked_formulas"]["low_block"] = "C_low=256*Z_finite"
        low_factor["theorem"]["low_block_coefficient"] = "256*Z_finite"
        with self.assertRaises(ReplayError):
            replay(low_factor)

    def test_rejects_high_series_or_q_mutation(self):
        q = produce("2.5", 60)
        q["theorem"]["translation_exponent_q"] = 2
        with self.assertRaisesRegex(ReplayError, "theorem constants"):
            replay(q)

        truncation = produce("2.5", 60)
        truncation["series"]["numeric_sum_claimed"] = True
        truncation["theorem"]["high_series_evaluated_by_truncation"] = True
        with self.assertRaises(ReplayError):
            replay(truncation)

    def test_rejects_terminal_or_claim_status_promotion(self):
        terminal = produce("2.5", 60)
        terminal["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        with self.assertRaisesRegex(ReplayError, "terminal-state promotion"):
            replay(terminal)

        scope = copy.deepcopy(produce("2.5", 60))
        scope["claim_scope"]["not_proved"] = []
        scope["source_admissions"]["signed_sector_floor_proved"] = True
        with self.assertRaises(ReplayError):
            replay(scope)

        threshold = produce("2.5", 60)
        threshold["theorem"]["slepian_threshold_effective"] = True
        with self.assertRaisesRegex(ReplayError, "theorem constants"):
            replay(threshold)

    def test_rejects_binary64_inputs_and_fields(self):
        with self.assertRaises(TypeError):
            produce(2.5, 60)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            produce("2e0", 60)
        with self.assertRaises(TypeError):
            produce("2.5", 60.0)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            produce("1.99", 60)

        payload = produce("2.5", 60)
        payload["input"]["lambda_decimal"] = 2.5
        with self.assertRaisesRegex(ReplayError, "binary64"):
            replay(payload)

    def test_rejects_source_hash_and_interval_tampering(self):
        source = produce("2.5", 60)
        source["source_hashes"]["ZERO_SAMPLING_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(ReplayError, "declared component"):
            replay(source)

        interval = produce("2.5", 60)
        interval["intervals"]["C_low"] = {
            "decimal": ["0", "0"],
            "dyadic": {
                "lower": [0, "0", 0, 0],
                "upper": [0, "0", 0, 0],
            },
        }
        with self.assertRaisesRegex(ReplayError, "interval nonoverlap for C_low"):
            replay(interval)


if __name__ == "__main__":
    unittest.main()
