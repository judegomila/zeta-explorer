import hashlib
import json
from fractions import Fraction
from pathlib import Path
import unittest

import mpmath as mp

from transition_window_bound import (
    LOCKED_BETA_CONVENTION,
    LOCKED_TRAILING_EXPONENT,
    parse_lambda_fraction,
    serialize_transition_window,
    transition_window_bound,
)


ROOT = Path(__file__).resolve().parents[1]


class TransitionWindowBoundTests(unittest.TestCase):
    def setUp(self):
        mp.mp.dps = 100

    def test_exact_shannon_conversion_and_lambda2_threshold(self):
        bound = transition_window_bound("2", 80)
        self.assertEqual(bound.lambda_exact, Fraction(2))
        self.assertEqual(bound.shannon_index, Fraction(16))
        self.assertEqual(bound.shannon_ceil, 16)
        self.assertEqual(bound.buffer_ceil, 5)
        self.assertEqual(bound.n_star, 27)
        self.assertLess(bound.beta.lower, bound.beta.upper)
        beta_point = 2 * mp.log(825) / mp.pi**2
        self.assertLessEqual(bound.beta.lower, beta_point)
        self.assertGreaterEqual(bound.beta.upper, beta_point)

    def test_n_star_is_included_without_extra_plus_one(self):
        bound = transition_window_bound("2", 80)
        self.assertTrue(bound.has_half_defect_floor(bound.n_star))
        self.assertLessEqual(bound.trailing_upper_bound(bound.n_star), mp.mpf("0.5"))
        self.assertGreaterEqual(bound.defect_lower_bound(bound.n_star), mp.mpf("0.5"))

    def test_preceding_index_is_not_promoted_by_off_by_one(self):
        bound = transition_window_bound("2", 80)
        previous = bound.n_star - 1
        self.assertFalse(bound.has_half_defect_floor(previous))
        self.assertGreater(bound.trailing_upper_bound(previous), mp.mpf("0.5"))
        self.assertLess(bound.defect_lower_bound(previous), mp.mpf("0.5"))
        with self.assertRaises(ValueError):
            bound.trailing_upper_bound(bound.shannon_ceil - 1)

    def test_wrong_reciprocal_and_exponent_are_rejected(self):
        with self.assertRaises(ValueError):
            transition_window_bound(
                "2",
                beta_convention="pi^2/(2*log(200*lambda^2+25))",
            )
        with self.assertRaises(ValueError):
            transition_window_bound(
                "2",
                exponent_convention="+(n-ceil(S)-6)/beta",
            )

    def test_binary64_parameter_paths_are_rejected(self):
        for value in (2.0, mp.mpf("2")):
            with self.subTest(value=type(value).__name__):
                with self.assertRaises(TypeError):
                    parse_lambda_fraction(value)  # type: ignore[arg-type]
                with self.assertRaises(TypeError):
                    transition_window_bound(value)  # type: ignore[arg-type]

    def test_fractional_decimal_uses_exact_shannon_ceiling(self):
        bound = transition_window_bound("1.75", 80)
        self.assertEqual(bound.shannon_index, Fraction(49, 4))
        self.assertEqual(bound.shannon_ceil, 13)
        self.assertEqual(bound.n_star, 23)

    def test_strict_target_counts_handle_integer_boundary(self):
        bound = transition_window_bound("2", 80)
        # At S=16 the plus target 16 is excluded, while minus target 14 is in.
        self.assertEqual(bound.shannon_target_counts(), (2, 3))
        self.assertEqual(bound.buffered_target_counts(), (5, 6))

    def test_serialized_intervals_retain_fail_closed_claim_class(self):
        payload = serialize_transition_window(transition_window_bound("2", 80))
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertFalse(payload["signed_weil_comparison_claim"])
        self.assertEqual(payload["exact_indices"]["n_star"], 27)
        self.assertTrue(payload["checks"]["n_star_is_included"])

    def test_p2_lock_formula_and_vendored_pdf_hash(self):
        lock = json.loads((ROOT / "P2_SOURCE_LOCK.json").read_text(encoding="utf-8"))
        source = lock["binding_sources"][0]
        dependency = lock["binding_sources"][1]
        conventions = lock["convention_map"]
        formulas = lock["locked_formulas"]

        self.assertEqual(
            conventions["source_transition_scale"],
            "beta_c = (2/pi^2)*L_c",
        )
        self.assertEqual(
            conventions["source_log_factor"],
            "L_c = log(100*c/pi + 25) = log(200*lambda^2 + 25)",
        )
        self.assertEqual(
            LOCKED_BETA_CONVENTION,
            "(2/pi^2)*log(200*lambda^2+25)",
        )
        self.assertIn("-(n-ceil(S)-6)/beta_c", formulas["trailing_side"])
        self.assertEqual(LOCKED_TRAILING_EXPONENT, "-(n-ceil(S)-6)/beta")

        pdf = ROOT / source["vendored_path"]
        digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
        self.assertEqual(digest, source["vendored_sha256"])
        self.assertEqual(
            digest,
            "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0",
        )
        dependency_pdf = ROOT / dependency["vendored_path"]
        dependency_digest = hashlib.sha256(dependency_pdf.read_bytes()).hexdigest()
        self.assertEqual(dependency_digest, dependency["vendored_sha256"])
        self.assertEqual(
            dependency_digest,
            "928759f7eebeeb59883ae2de305ebe8062f412c2ad0d275bb9ad4320c897ff6b",
        )
        self.assertEqual(
            lock["dependency_map"]["source_chain_status"],
            "TRANSITIVE_DPSS_TO_PSWF_INPUT_PINNED",
        )


if __name__ == "__main__":
    unittest.main()
