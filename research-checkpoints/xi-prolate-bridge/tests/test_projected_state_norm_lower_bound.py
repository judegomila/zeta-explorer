import copy
import hashlib
import json
import sys
import unittest
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from projected_state_norm_lower_bound import constants, produce
from projected_state_norm_lower_bound_replay import ReplayError, replay


def lower(interval):
    return mp.mpf(tuple(interval._mpi_[0]))


def upper(interval):
    return mp.mpf(tuple(interval._mpi_[1]))


def serialized_endpoint(item, side):
    raw = item["dyadic"][side]
    return mp.mpf((raw[0], int(raw[1]), raw[2], raw[3]))


class ProjectedStateNormLowerBoundTests(unittest.TestCase):
    def test_interval_formulas_give_positive_locked_margin(self):
        values = constants("4", 4096, "0.00001", 70)
        self.assertGreater(lower(values["K_star"]), 0)
        self.assertGreater(lower(values["projected_norm_lower_margin"]), 0)
        self.assertLess(upper(values["limiting_state_tail"]), mp.mpf("1e-18"))
        self.assertGreater(lower(values["unit_norm_rescale_minus_one"]), 2)

    def test_independent_replay_at_doubled_precision(self):
        first = produce("4", 4096, "0.00001", 60)
        second = produce("4", 4096, "0.00001", 120)
        first_replay = replay(first)
        second_replay = replay(second)
        self.assertEqual(
            first_replay["result"],
            "PROJECTED_STATE_NORM_LOWER_BOUND_REPLAY_PASS",
        )
        self.assertEqual(
            second_replay["result"],
            "PROJECTED_STATE_NORM_LOWER_BOUND_REPLAY_PASS",
        )
        self.assertNotEqual(first["intervals"], second["intervals"])
        for name in first["intervals"]:
            with self.subTest(interval=name):
                first_lo = serialized_endpoint(first["intervals"][name], "lower")
                first_hi = serialized_endpoint(first["intervals"][name], "upper")
                second_lo = serialized_endpoint(second["intervals"][name], "lower")
                second_hi = serialized_endpoint(second["intervals"][name], "upper")
                self.assertLessEqual(max(first_lo, second_lo), min(first_hi, second_hi))
        self.assertTrue(
            first_replay["independently_reconstructed_finite_margin_positive"]
        )

    def test_nonpositive_finite_margin_is_not_reported_positive(self):
        payload = produce("2", 0, "1", 60)
        self.assertFalse(payload["theorem"]["finite_margin_positive"])
        result = replay(payload)
        self.assertFalse(
            result["independently_reconstructed_finite_margin_positive"]
        )

    def test_rejects_binary64_and_bad_exact_inputs(self):
        with self.assertRaises(TypeError):
            produce(4.0, 4096, "0.00001", 60)
        with self.assertRaises(TypeError):
            produce("4", 4096, 0.00001, 60)
        with self.assertRaises(TypeError):
            produce("4", 4.0, "0.00001", 60)
        with self.assertRaises(ValueError):
            produce("1.99", 10, "0", 60)

        payload = produce("4", 4096, "0.00001", 60)
        payload["input"]["N"] = 4096.0
        with self.assertRaisesRegex(ReplayError, "binary64"):
            replay(payload)

    def test_rejects_normalization_and_state_mutations(self):
        for field in (
            "unit_norm_substitution_accepted",
            "invisible_bump_changes_projected_state",
            "fourier_sign_changed",
            "lambda_mixed_with_lambda_squared",
            "inversion_reflection_dropped",
        ):
            with self.subTest(field=field):
                payload = produce("4", 4096, "0.00001", 60)
                payload["source_admissions"][field] = True
                with self.assertRaisesRegex(ReplayError, "source admission"):
                    replay(payload)

        tails = produce("4", 4096, "0.00001", 60)
        tails["source_admissions"][
            "both_inversion_reflected_limiting_tails_retained"
        ] = False
        with self.assertRaisesRegex(ReplayError, "source admission"):
            replay(tails)

        scalar = produce("4", 4096, "0.00001", 60)
        scalar["locked_formulas"]["unit_norm_rejection"] = (
            "wrong multiplier=1"
        )
        with self.assertRaisesRegex(ReplayError, "locked formula"):
            replay(scalar)

    def test_rejects_delta_promotion_and_claim_promotion(self):
        delta = produce("4", 4096, "0.00001", 60)
        delta["theorem"]["supplied_delta_is_an_effective_source_enclosure"] = True
        with self.assertRaisesRegex(ReplayError, "theorem claim"):
            replay(delta)

        for field in (
            "signed_odd_floor_proved",
            "signed_even_floor_proved",
            "graph_dual_action_proved",
            "equation_5_2_proved",
            "rh_proved",
        ):
            with self.subTest(field=field):
                payload = produce("4", 4096, "0.00001", 60)
                payload["source_admissions"][field] = True
                with self.assertRaisesRegex(ReplayError, "source admission"):
                    replay(payload)

        terminal = produce("4", 4096, "0.00001", 60)
        terminal["terminal_state"] = "P0_EXACT_FORMULAS_PASS"
        with self.assertRaisesRegex(ReplayError, "terminal-state"):
            replay(terminal)

    def test_reconstructs_margin_sign_instead_of_trusting_producer(self):
        positive = produce("4", 4096, "0.00001", 60)
        positive["theorem"]["finite_margin_positive"] = False
        with self.assertRaisesRegex(ReplayError, "margin sign"):
            replay(positive)

        negative = produce("2", 0, "1", 60)
        negative["theorem"]["finite_margin_positive"] = True
        with self.assertRaisesRegex(ReplayError, "margin sign"):
            replay(negative)

    def test_replay_binds_the_exact_producer_byte_buffer(self):
        payload = produce("4", 4096, "0.00001", 60)
        exact_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        result = replay(payload, producer_bytes=exact_bytes)
        self.assertEqual(
            result["producer_binding"],
            {
                "byte_source": "exact artifact file bytes",
                "byte_count": len(exact_bytes),
                "sha256": hashlib.sha256(exact_bytes).hexdigest(),
            },
        )

        mismatched_bytes = (
            json.dumps(produce("3", 4096, "0.00001", 60), sort_keys=True)
            + "\n"
        ).encode("utf-8")
        with self.assertRaisesRegex(
            ReplayError, "do not decode to replay payload"
        ):
            replay(payload, producer_bytes=mismatched_bytes)
        with self.assertRaisesRegex(ReplayError, "must be exact bytes"):
            replay(payload, producer_bytes=bytearray(exact_bytes))

        integer_payload = produce("4", 1, "0.00001", 60)
        bool_mutation = copy.deepcopy(integer_payload)
        bool_mutation["input"]["N"] = True
        bool_bytes = json.dumps(bool_mutation, separators=(",", ":")).encode(
            "utf-8"
        )
        with self.assertRaisesRegex(
            ReplayError, "do not decode to replay payload"
        ):
            replay(integer_payload, producer_bytes=bool_bytes)

        verifier_source = (
            ROOT / "verifier" / "projected_state_norm_lower_bound_replay.py"
        ).read_text(encoding="utf-8")
        self.assertNotIn("from projected_state_norm_lower_bound import", verifier_source)
        self.assertNotIn(
            "import projected_state_norm_lower_bound", verifier_source
        )

    def test_rejects_source_hash_and_arithmetic_mutations(self):
        source = produce("4", 4096, "0.00001", 60)
        source["source_hashes"]["notes/PROJECTION_RATE_THEOREM.md"] = "0" * 64
        with self.assertRaisesRegex(ReplayError, "source hash"):
            replay(source)

        gamma = produce("4", 4096, "0.00001", 60)
        gamma["arithmetic"]["incomplete_gamma_point_values_used"] = True
        with self.assertRaisesRegex(ReplayError, "arithmetic"):
            replay(gamma)

        promoted = produce("4", 4096, "0.00001", 60)
        promoted["claim_scope"]["not_proved"].remove("the Riemann hypothesis")
        with self.assertRaisesRegex(ReplayError, "claim-scope"):
            replay(promoted)

    def test_rejects_interval_endpoint_decimal_and_width_mutations(self):
        endpoint = produce("4", 4096, "0.00001", 60)
        endpoint["intervals"]["K_star"]["dyadic"]["lower"][1] = "0"
        with self.assertRaisesRegex(ReplayError, "noncanonical|nonoverlap"):
            replay(endpoint)

        display = produce("4", 4096, "0.00001", 60)
        display["intervals"]["K_star"]["decimal"][0] = "arbitrary"
        with self.assertRaisesRegex(ReplayError, "noncanonical decimal"):
            replay(display)

        oversized = produce("4", 4096, "0.00001", 60)
        oversized["intervals"]["K_star"]["dyadic"]["lower"][3] = 1_000_000
        with self.assertRaisesRegex(ReplayError, "typed dyadic"):
            replay(oversized)

        wide = produce("4", 4096, "0.00001", 60)
        with mp.workprec(80):
            lo = mp.mpf("0")
            hi = mp.mpf("1")
        wide["intervals"]["K_star"] = {
            "decimal": [mp.nstr(lo, 60), mp.nstr(hi, 60)],
            "dyadic": {
                "lower": [0, str(lo._mpf_[1]), lo._mpf_[2], lo._mpf_[3]],
                "upper": [0, str(hi._mpf_[1]), hi._mpf_[2], hi._mpf_[3]],
            },
        }
        with self.assertRaisesRegex(ReplayError, "too wide"):
            replay(wide)

    def test_rejects_formula_inventory_mutation(self):
        payload = copy.deepcopy(produce("4", 4096, "0.00001", 60))
        payload["locked_formulas"]["finite_lower"] = (
            "a>=K_star-A-F-T_bar"
        )
        with self.assertRaisesRegex(ReplayError, "locked formula"):
            replay(payload)

        missing_norm_premise = produce("4", 4096, "0.00001", 60)
        missing_norm_premise["locked_formulas"]["normalized_shift"] = (
            "epsilon_lambda=o(d6) implies U_Z=o(d6)"
        )
        with self.assertRaisesRegex(ReplayError, "locked formula"):
            replay(missing_norm_premise)


if __name__ == "__main__":
    unittest.main()
