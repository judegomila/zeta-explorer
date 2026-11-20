from __future__ import annotations

import copy
from fractions import Fraction
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from outer_projection_weil_bound import produce  # noqa: E402
from outer_projection_weil_bound_replay import replay  # noqa: E402


def interval_end(payload: dict[str, object], key: str, endpoint: str) -> mp.mpf:
    raw = payload["intervals"][key]["dyadic"][endpoint]
    return mp.mpf((raw[0], int(raw[1]), raw[2], raw[3]))


class OuterProjectionWeilBoundTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 120

    def test_producer_and_independent_replay(self):
        payload = produce(2, 60)
        result = replay(payload)
        self.assertEqual(result["status"], "ANALYTIC_UNIFORM_COMPONENT_REPLAY_PASS")
        self.assertTrue(result["intervals_reconstructed_from_j"])
        self.assertFalse(result["producer_booleans_trusted"])
        self.assertTrue(all(
            item["overlap"] for item in result["interval_comparisons"].values()
        ))

    def test_doubled_precision_and_next_schedule_point(self):
        low_precision = produce(2, 60)
        high_precision = produce(2, 120)
        first_upper = interval_end(
            low_precision, "outer_projection_relative_upper", "upper"
        )
        second_upper = interval_end(
            produce(3, 60), "outer_projection_relative_upper", "upper"
        )
        self.assertGreater(first_upper, 0)
        self.assertGreater(second_upper, 0)
        self.assertLess(second_upper, first_upper)
        for key in low_precision["intervals"]:
            lo1 = interval_end(low_precision, key, "lower")
            hi1 = interval_end(low_precision, key, "upper")
            lo2 = interval_end(high_precision, key, "lower")
            hi2 = interval_end(high_precision, key, "upper")
            self.assertLessEqual(max(lo1, lo2), min(hi1, hi2), key)

    def test_cross_margin_is_twice_projection_margin(self):
        payload = produce(2, 70)
        cross_lo = interval_end(
            payload, "outer_projection_exponent_margin", "lower"
        )
        cross_hi = interval_end(
            payload, "outer_projection_exponent_margin", "upper"
        )
        projection_lo = interval_end(
            payload, "projection_exponent_margin", "lower"
        )
        projection_hi = interval_end(
            payload, "projection_exponent_margin", "upper"
        )
        self.assertGreater(cross_lo, 0)
        self.assertLessEqual(cross_lo, 2 * projection_hi)
        self.assertGreaterEqual(cross_hi, 2 * projection_lo)

    def test_total_retains_both_pp_and_high_low_terms(self):
        payload = produce(2, 70)
        total = interval_end(payload, "outer_projection_relative_upper", "upper")
        pp = interval_end(payload, "source_pp_relative_upper", "upper")
        high_low = interval_end(payload, "high_low_relative_upper", "upper")
        self.assertGreater(total, pp)
        self.assertGreater(total, high_low)

    def test_quadrant_sum_constant_for_small_exact_N(self):
        # Independently check the elementary sum behind the coefficient 6.
        for N in range(1, 9):
            same = sum(
                Fraction(1, r * s * (r - s))
                for r in range(N + 1, 20 * N + 20)
                for s in range(1, N + 1)
            )
            opposite = sum(
                Fraction(1, r * s * (r + s))
                for r in range(N + 1, 20 * N + 20)
                for s in range(1, N + 1)
            )
            harmonic = sum(Fraction(1, k) for k in range(1, N + 1))
            self.assertLessEqual(same, 2 * harmonic / N)
            self.assertLessEqual(opposite, harmonic / N)

    def test_binary64_and_bool_inputs_are_rejected(self):
        with self.assertRaises(TypeError):
            produce(2.0, 60)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            produce(True, 60)  # type: ignore[arg-type]
        with self.assertRaises(TypeError):
            produce(2, 60.0)  # type: ignore[arg-type]

    def test_schedule_before_locked_range_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "j>=2"):
            produce(1, 60)

    def test_replay_rejects_changed_prime_sign(self):
        payload = produce(2, 60)
        payload["locked_formulas"]["weil_sign"] = "Q=W_0,2-W_R+W_p"
        with self.assertRaisesRegex(ValueError, "formula, sign"):
            replay(payload)

    def test_replay_rejects_dropped_reflection(self):
        payload = produce(2, 60)
        payload["locked_formulas"]["reflection"] = (
            "K=E(tilde_h); O is the right tail only"
        )
        with self.assertRaisesRegex(ValueError, "reflection"):
            replay(payload)

    def test_replay_rejects_radical_sign_change(self):
        payload = produce(2, 60)
        payload["locked_formulas"]["radical_reduction"] = (
            "W(O,P)=+q(CK,P)"
        )
        with self.assertRaisesRegex(ValueError, "formula, sign"):
            replay(payload)

    def test_replay_rejects_unit_normalization_substitution(self):
        payload = produce(2, 60)
        payload["locked_formulas"]["source_normalization"] = "norm(h_lambda)=1"
        with self.assertRaisesRegex(ValueError, "normalization"):
            replay(payload)

    def test_replay_rejects_hard_endpoint_and_prime_endpoint_mutations(self):
        endpoint = produce(2, 60)
        endpoint["locked_formulas"]["hard_endpoint_term"] = "0"
        with self.assertRaisesRegex(ValueError, "formula, sign"):
            replay(endpoint)

        prime = produce(2, 60)
        prime["locked_formulas"]["prime_endpoint"] = (
            "prime powers n<lambda^2; endpoint omitted"
        )
        with self.assertRaisesRegex(ValueError, "formula, sign"):
            replay(prime)

    def test_replay_rejects_changed_basis_and_schedule(self):
        basis = produce(2, 60)
        basis["locked_formulas"]["basis"] = (
            "L^(-1/2)*exp(-2*pi*i*r*(t+log(lambda))/L)"
        )
        with self.assertRaisesRegex(ValueError, "formula, sign"):
            replay(basis)

        schedule = produce(2, 60)
        schedule["input"]["schedule_exponent"] += 1
        with self.assertRaisesRegex(ValueError, "schedule exponent"):
            replay(schedule)

    def test_replay_rejects_extra_input_and_tampered_interval(self):
        extra = produce(2, 60)
        extra["input"]["lambda_binary64"] = 2.5
        with self.assertRaisesRegex(ValueError, "input inventory"):
            replay(extra)

    def test_replay_rejects_nonoverlap_even_below_decimal_tolerance(self):
        # The true bound is about 1e-72 at j=2, below the replay's generic
        # decimal endpoint tolerance.  A point interval at zero is still
        # disjoint and must be rejected unconditionally.
        bad = produce(2, 60)
        bad["intervals"]["outer_projection_relative_upper"] = {
            "decimal": ["0.0", "0.0"],
            "dyadic": {
                "lower": [0, "0", 0, 0],
                "upper": [0, "0", 0, 0],
            },
        }
        with self.assertRaisesRegex(
            ValueError, "nonoverlap for outer_projection_relative_upper"
        ):
            replay(bad)

    def test_replay_rejects_source_and_claim_overclaims(self):
        source = produce(2, 60)
        source["source_pins"]["global_radical"]["source_lock_sha256"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "radical source pins"):
            replay(source)

        scope = copy.deepcopy(produce(2, 60))
        scope["claim_scope"]["proved"] += " for each individual prolate label"
        scope["claim_scope"]["not_proved"] = []
        with self.assertRaisesRegex(ValueError, "claim scope"):
            replay(scope)

        arithmetic = produce(2, 60)
        arithmetic["arithmetic"]["shared_library_with_replay"] = False
        with self.assertRaisesRegex(ValueError, "arithmetic metadata"):
            replay(arithmetic)

    def test_replay_rejects_trusted_producer_boolean(self):
        payload = produce(2, 60)
        payload["producer_pass_boolean_trusted_by_replay"] = True
        with self.assertRaisesRegex(ValueError, "must not trust"):
            replay(payload)


if __name__ == "__main__":
    unittest.main()
